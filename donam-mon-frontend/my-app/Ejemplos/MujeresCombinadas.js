import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFiltros } from './FiltrosContext';
import { combineFallas, applyFilters } from './utilsFallas';
import styles from './styles';
import stylesFiltros from './styles-filtros';

// Lista de áreas de conocimiento para filtrar mujeres
const ALL_AREAS = [
    "Todas",
    "Ciencias Naturales",
    "Ingeniería y Tecnología",
    "Ciencias Médicas y de la Salud",
    "Ciencias Sociales",
    "Humanidades",
    "Artes",
    "Ciencias Interdisciplinarias y Emergentes"
];

const MujeresCombinadas = () => {
    const navigation = useNavigation();
    const [mujeres, setMujeres] = useState([]); // Mujeres
    const [userLocation, setUserLocation] = useState(null); // Ubicación del usuario
    const [showPicker, setShowPicker] = useState(false); // Mostrar/ocultar filtros
    const isFocused = useIsFocused();
    const { selectedSection, setSelectedSection, selectedVisited, setSelectedVisited, searchTerm, setSearchTerm, sections, setSections } = useFiltros();

    // Carga de datos de mujeres y ubicación al entrar en la pantalla
    useEffect(() => {
        const fetchMujeres = async () => {
            try {
                const response = await axios.get('http://10.20.17.99:8000/api/mujeres/');
                // Aplana los lugares y añade referencia a la mujer
                let mujeresLugares = [];
                response.data.forEach(mujer => {
                    if (mujer.lugares && Array.isArray(mujer.lugares)) {
                        mujer.lugares.forEach(lugar => {
                            mujeresLugares.push({
                                ...lugar,
                                mujer_nombre: mujer.nombre,
                                mujer_foto: mujer.foto,
                                mujer_descripcion: mujer.descripcion,
                                area: mujer.area_conocimiento, // Ajusta el campo según tu modelo
                                visited: false // Inicialmente no visitada
                            });
                        });
                    }
                });
                // Cargar historial de visitadas
                const storedVisited = await AsyncStorage.getItem('visitedMujeres');
                const visited = storedVisited ? JSON.parse(storedVisited) : [];
                // Marca como visitadas
                mujeresLugares = mujeresLugares.map(lugar => {
                    const isVisited = visited.some(v => v.id === lugar.id);
                    return { ...lugar, visited: isVisited };
                });
                setMujeres(mujeresLugares);
            } catch (error) {
                console.error('Error fetching mujeres:', error);
            }
        };

        const fetchUserLocation = async () => {
            // Pide permisos y obtiene la ubicación del usuario
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setUserLocation(location.coords);
        };

        fetchMujeres();
        fetchUserLocation();
    }, [isFocused]);

    // Actualiza la lista de secciones cuando cambian las mujeres
    useEffect(() => {
        if (mujeres.length > 0) {
            updateSections();
        }
    }, [mujeres]);

    // Actualiza el contexto de secciones
    const updateSections = () => {
        setSections(ALL_AREAS);
    };

    // Marca una mujer como visitada o no visitada y actualiza AsyncStorage
    const updateMujer = async (lugar) => {
        let updated = mujeres.map(l => l.id === lugar.id ? { ...l, visited: !l.visited } : l);
        setMujeres(updated);
        // Actualiza en AsyncStorage
        const visited = updated.filter(l => l.visited);
        await AsyncStorage.setItem('visitedMujeres', JSON.stringify(visited.map(l => ({ id: l.id }))));
    };

    // Lógica de distancia
    const getDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const toRad = x => x * Math.PI / 180;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Filtros
    let filteredLugares = mujeres;
    if (selectedSection && selectedSection !== 'Todas') {
        filteredLugares = filteredLugares.filter(lugar => lugar.area === selectedSection);
    }
    if (selectedVisited && selectedVisited !== 'Todas') {
        filteredLugares = filteredLugares.filter(lugar => selectedVisited === 'Visitadas' ? lugar.visited : !lugar.visited);
    }
    if (searchTerm) {
        filteredLugares = filteredLugares.filter(lugar =>
            (lugar.nombre && lugar.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (lugar.mujer_nombre && lugar.mujer_nombre.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }
    // Calcula distancia
    filteredLugares = filteredLugares.map(lugar => {
        if (userLocation) {
            const distance = getDistance(userLocation.latitude, userLocation.longitude, lugar.latitud, lugar.longitud);
            return { ...lugar, distance };
        }
        return lugar;
    });

    // Ordena la lista de lugares de más cercano a más lejano
    filteredLugares = filteredLugares.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
    });

    // Render principal
    return (
        <View style={styles.container}>
            {/* Botón para mostrar/ocultar filtros */}
            <TouchableOpacity
                style={styles.filterButton2}
                onPress={() => { setShowPicker(!showPicker); setSearchTerm(''); }}
            >
                <Text style={styles.filterButtonText2}>Filtros</Text>
            </TouchableOpacity>
            {/* Panel de filtros (Picker) */}
            {showPicker && (
                <View style={[stylesFiltros.container, { backgroundColor: 'transparent', padding: 0 }]}> 
                    <View style={stylesFiltros.filterBox}>
                        <Text style={stylesFiltros.pickerLabel}>Selecciona un área de conocimiento:</Text>
                        <Picker
                            selectedValue={selectedSection}
                            style={stylesFiltros.picker}
                            onValueChange={setSelectedSection}
                        >
                            {sections.map(area => (
                                <Picker.Item key={area} label={area} value={area} />
                            ))}
                        </Picker>
                    </View>

                    <View style={stylesFiltros.filterBox}>
                        <Text style={stylesFiltros.pickerLabel}>Filtrar por estado:</Text>
                        <Picker
                            selectedValue={selectedVisited}
                            style={stylesFiltros.picker}
                            onValueChange={setSelectedVisited}
                        >
                            <Picker.Item label="Todas" value="Todas" />
                            <Picker.Item label="Visitadas" value="Visitadas" />
                            <Picker.Item label="No visitadas" value="No visitadas" />
                        </Picker>
                    </View>

                    {/* Botón Aceptar solo al final */}
                    <TouchableOpacity style={stylesFiltros.acceptButton} onPress={() => setShowPicker(false)}>
                        <Text style={stylesFiltros.acceptButtonText}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
            )}
            {/* Barra de búsqueda */}
            {!showPicker && (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    borderRadius: 24,
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    marginHorizontal: 10,
                    marginBottom: 12,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                }}>
                    <Text style={{ fontSize: 18, color: '#f7c873', marginRight: 8 }}>🔍</Text>
                    <TextInput
                        style={{
                            flex: 1,
                            fontSize: 16,
                            color: '#222',
                            paddingVertical: 4,
                            backgroundColor: 'transparent',
                        }}
                        placeholder="Buscar mujeres por nombre"
                        placeholderTextColor="#aaa"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        returnKeyType="search"
                    />
                </View>
            )}
            {/* Lista de lugares filtrados */}
            {!showPicker && (
                <FlatList
                    data={filteredLugares}
                    keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.fallaContainer, { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, marginBottom: 10, borderRadius: 12, backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }]}
                            onPress={() => updateMujer(item)}
                        >
                            {/* Imagen circular de la mujer a la izquierda */}
                            <View style={{ width: 54, alignItems: 'center', marginRight: 12 }}>
                                {item.mujer_foto ? (
                                    <Image
                                        source={{ uri: item.mujer_foto }}
                                        style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#f7c873', backgroundColor: '#eee' }}
                                    />
                                ) : (
                                    <Image
                                        source={require('../assets/usuario.png')}
                                        style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#f7c873', backgroundColor: '#eee' }}
                                    />
                                )}
                            </View>
                            {/* Info principal del lugar y la mujer */}
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={[styles.fallaTitle, { fontSize: 17, fontWeight: 'bold', marginBottom: 6, color: '#b85c00' }]} numberOfLines={2}>{item.nombre}</Text>
                                <Text style={{ fontSize: 15, color: '#1e88e5', fontWeight: '600', marginBottom: 2 }}>{item.mujer_nombre}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {item.distance !== null && (
                                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#1e88e5', marginRight: 12 }}>{item.distance.toFixed(2)} km</Text>
                                    )}
                                    <Text style={[styles.fallaVisited, { fontSize: 13, color: item.visited ? '#43a047' : '#e53935', fontWeight: 'bold' }]}>{item.visited ? 'Visitado' : 'No visitado'}</Text>
                                </View>
                            </View>
                            {/* Área de conocimiento a la derecha */}
                            <View style={{ width: 100, alignItems: 'center', marginLeft: 12 }}>
                                <View style={{ backgroundColor: '#f7c873', borderRadius: 8, paddingVertical: 2, paddingHorizontal: 8, marginBottom: 4 }}>
                                    <Text style={{ fontSize: 13, color: '#222', textAlign: 'center' }}>{item.area}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

export default MujeresCombinadas;