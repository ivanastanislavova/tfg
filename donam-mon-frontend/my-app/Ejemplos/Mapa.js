import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useFiltros } from './FiltrosContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

const Mapa = () => {
    const mapView = useRef(null);
    const [lugares, setLugares] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    // Filtros globales
    const { selectedSection, selectedVisited, searchTerm } = useFiltros();

    // Detectar si hay filtros activos (igual que en MujeresCombinadas)
    const hayFiltrosActivos =
        (selectedSection && selectedSection !== 'Todas') ||
        (selectedVisited && selectedVisited !== 'Todas') ||
        (searchTerm && searchTerm.trim() !== '');

    // Obtener lugares visitados y marcar cada lugar
    const fetchVisitedAndSet = async (mujeres) => {
        try {
            const token = await AsyncStorage.getItem('token');
            let visitedIds = [];
            if (token) {
                const response = await fetch('http://192.168.1.44:8000/api/visited-lugares/', {
                    method: 'GET',
                    headers: { 'Authorization': `Token ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    visitedIds = data.map(v => v.lugar.id);
                }
            }
            // Marca cada lugar con visited
            const mujeresMarcadas = mujeres.map(mujer => ({
                ...mujer,
                lugares: mujer.lugares
                    ? mujer.lugares.map(lugar => ({
                        ...lugar,
                        visited: visitedIds.includes(lugar.id)
                    }))
                    : []
            }));
            setLugares(mujeresMarcadas);
        } catch (error) {
            const mujeresMarcadas = mujeres.map(mujer => ({
                ...mujer,
                lugares: mujer.lugares
                    ? mujer.lugares.map(lugar => ({
                        ...lugar,
                        visited: false
                    }))
                    : []
            }));
            setLugares(mujeresMarcadas);
        }
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            let region = {
                latitude: parseFloat(location.coords.latitude),
                longitude: parseFloat(location.coords.longitude),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            };
            mapView.current.animateToRegion(region, 2000);
            setUserLocation(location.coords);
        })();

        // Obtener mujeres y sus lugares desde la API de Django
        const fetchMujeres = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get('http://192.168.1.44:8000/api/mujeres/', {
                    headers: token ? { Authorization: `Token ${token}` } : {},
                });
                await fetchVisitedAndSet(response.data.results);
            } catch (error) {
                console.error('Error fetching mujeres:', error);
            }
        };
        fetchMujeres();
    }, [isFocused]);

    // Lógica de distancia (igual que en MujeresCombinadas)
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

    // Aplanar todos los lugares con referencia a la mujer
    let allLugares = [];
    lugares.forEach(mujer => {
        if (mujer.lugares && Array.isArray(mujer.lugares)) {
            mujer.lugares.forEach(lugar => {
                allLugares.push({
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

    // Aplicar filtros igual que en MujeresCombinadas
    let filteredLugares = allLugares;
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

    return (
        <View style={styles.container}>
            {/* Botón de filtros arriba del mapa */}
            <View style={{ marginTop: 16, marginHorizontal: 16, marginBottom: 0 }}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => navigation.navigate('Filtros')}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {hayFiltrosActivos && (
                            <View style={{
                                marginRight: 8,
                                marginTop: 4,
                                width: 14,
                                height: 14,
                                borderRadius: 7,
                                backgroundColor: '#bc5880',
                                borderWidth: 2,
                                borderColor: '#fff',
                                shadowColor: '#bc5880',
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                shadowOffset: { width: 0, height: 2 },
                            }} />
                        )}
                        <Text style={styles.filterButtonText}>Filtros</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <MapView
                style={styles.map}
                showsUserLocation={true}
                followUserLocation={true}
                zoomEnabled={true}
                initialRegion={{
                    latitude: 39.513,
                    longitude: -0.4242,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                ref={mapView}
            >
                {filteredLugares.map((lugar) => {
                    let iconColor = '#5f68c4';
                    if (lugar.visited) iconColor = '#43a047';
                    return (
                        <Marker
                            key={lugar.id}
                            coordinate={{
                                latitude: lugar.latitud,
                                longitude: lugar.longitud
                            }}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.8)', borderColor: '#000' }]}>
                                <Icon name="gender-female" size={30} color={iconColor} />
                            </View>
                            <Callout tooltip>
                                <ScrollView style={styles.callout}>
                                    <Text style={styles.calloutTitle}>{lugar.mujer_nombre}</Text>
                                    {lugar.mujer_foto && (
                                        <View style={{ alignItems: 'center', width: '100%' }}>
                                            <Image
                                                source={{ uri: lugar.mujer_foto }}
                                                style={{ width: 140, height: 140, borderRadius: 70, marginVertical: 5 }}
                                            />
                                        </View>
                                    )}
                                    {lugar.mujer_descripcion && (
                                        <Text style={{ marginBottom: 5 }}>{lugar.mujer_descripcion}</Text>
                                    )}
                                    <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{lugar.nombre}</Text>
                                    {lugar.descripcion && (
                                        <Text>{lugar.descripcion}</Text>
                                    )}
                                    {lugar.foto_url && (
                                        <View style={{ alignItems: 'center', width: '100%' }}>
                                            <Image
                                                source={{ uri: lugar.foto_url }}
                                                style={{ width: 80, height: 80, borderRadius: 10, marginVertical: 5 }}
                                            />
                                        </View>
                                    )}
                                    {lugar.distance !== undefined && (
                                        <Text style={{ color: '#bc5880', marginTop: 8 }}>
                                            Distancia: {lugar.distance !== null ? lugar.distance.toFixed(2) : 'N/A'} km
                                        </Text>
                                    )}
                                </ScrollView>
                            </Callout>
                        </Marker>
                    );
                })}
            </MapView>
        </View>
    );
}

export default Mapa;