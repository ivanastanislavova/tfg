import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, TextInput, Image, ImageBackground, Dimensions } from 'react-native';
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

    // Nueva función: obtener lugares visitados del backend y marcar los lugares
    const fetchVisitedAndSet = async (lugares) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                setMujeres(lugares.map(l => ({ ...l, visited: false })));
                return;
            }
            const response = await fetch('http://192.168.1.132:8000/api/visited-lugares/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            let visitedIds = [];
            if (response.ok) {
                const data = await response.json();
                visitedIds = data.map(v => v.lugar.id);
            }
            setMujeres(lugares.map(l => ({ ...l, visited: visitedIds.includes(l.id) })));
        } catch (error) {
            setMujeres(lugares.map(l => ({ ...l, visited: false })));
        }
    };

    // Carga de datos de mujeres y ubicación al entrar en la pantalla
    useEffect(() => {
        const fetchMujeres = async () => {
            try {
                const response = await axios.get('http://192.168.1.132:8000/api/mujeres/');
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
                                areas_investigacion: mujer.areas_investigacion,
                                area: (mujer.areas_investigacion && mujer.areas_investigacion.length > 0) ? mujer.areas_investigacion[0] : 'Sin área',
                            });
                        });
                    }
                });
                await fetchVisitedAndSet(mujeresLugares);
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
    const updateMujer = async () => {
        await fetchMujeres();
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
        <View style={[styles.container, { backgroundColor: '#f5f6fa' }]}> 
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
                    numColumns={1}
                    renderItem={({ item }) => {
                        const screenWidth = Dimensions.get('window').width;
                        const cardMargin = 18;
                        const cardSize = screenWidth - cardMargin * 2;
                        return (
                            <TouchableOpacity
                                style={{ marginBottom: 20, alignItems: 'center' }}
                                onPress={() => navigation.navigate('Detail', { lugar: item, updateMujer })}
                                activeOpacity={0.85}
                            >
                                <ImageBackground
                                    source={item.foto ? { uri: item.foto } : require('../assets/usuario.png')}
                                    style={{ width: cardSize, height: cardSize, borderRadius: 24, overflow: 'hidden', justifyContent: 'flex-end' }}
                                    imageStyle={{ borderRadius: 24 }}
                                    resizeMode="cover"
                                >
                                    {/* Nombre del lugar en la parte superior */}
                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(95,104,196,0.75)', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingVertical: 10, paddingHorizontal: 16, zIndex: 2 }}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }} numberOfLines={2}>{item.nombre}</Text>
                                    </View>
                                    {/* Imagen de la mujer superpuesta, centrada justo en el borde superior del contenedor blanco */}
                                    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 70, alignItems: 'center', zIndex: 3 }}>
                                        <Image
                                            source={item.mujer_foto ? { uri: item.mujer_foto } : require('../assets/usuario.png')}
                                            style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#edebff', backgroundColor: '#edebff' }}
                                        />
                                    </View>
                                    {/* Info inferior: nombre de la mujer y datos */}
                                    <View style={{ backgroundColor: 'rgba(255,255,255,0.85)', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, padding: 14, paddingTop: 40, alignItems: 'center', zIndex: 2, minHeight: 90 }}>
                                        <Text style={[styles.fallaTitle, { fontSize: 18, fontWeight: 'bold', color: '#bc5880', marginBottom: 6, textAlign: 'center' }]} numberOfLines={2}>{item.mujer_nombre}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2, justifyContent: 'center' }}>
                                            {item.distance !== null && (
                                                <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#1e88e5', marginRight: 8 }}>{item.distance.toFixed(2)} km</Text>
                                            )}
                                            <Text style={{ fontSize: 13, color: item.visited ? '#43a047' : '#e53935', fontWeight: 'bold' }}>{item.visited ? 'Visitado' : 'No visitado'}</Text>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </View>
    );
}

export default MujeresCombinadas;