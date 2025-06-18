// Mapa.js: Pantalla principal de mapa interactivo con marcadores de fallas
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useFiltros } from './FiltrosContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineFallas, applyFilters } from './utilsFallas';
import styles from './styles';
import stylesFiltros from './styles-filtros';
import { Picker } from '@react-native-picker/picker';

// Componente principal del mapa
const Mapa = () => {
    // Referencia al componente MapView para animar la cámara
    const mapView = useRef(null);
    // Estados locales para datos de lugares y usuario
    const [lugares, setLugares] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    // useEffect para pedir permisos de localización y centrar el mapa en el usuario
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
                const response = await axios.get('http://192.168.1.132:8000/api/mujeres/', {
                    headers: token ? { Authorization: `Token ${token}` } : {},
                });
                setLugares(response.data); // Guardamos el array de mujeres (cada una con sus lugares)
            } catch (error) {
                console.error('Error fetching mujeres:', error);
            }
        };
        fetchMujeres();
    }, []);

    return (
        <View style={styles.container}>
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
                {lugares.map((mujer, idxMujer) => (
                    mujer.lugares && mujer.lugares.map((lugar, idxLugar) => (
                        <Marker
                            key={`mujer${mujer.id}_lugar${lugar.id}`}
                            coordinate={{
                                latitude: lugar.latitud,
                                longitude: lugar.longitud
                            }}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.8)', borderColor: '#000' }]}> 
                                <Icon name="gender-female" size={30} color="#f8d4e6" />
                            </View>
                            <Callout tooltip>
                                <ScrollView style={styles.callout}>
                                    {/* Mujer info */}
                                    <Text style={styles.calloutTitle}>{mujer.nombre}</Text>
                                    {mujer.foto_url && (
                                        <View style={{ alignItems: 'center', width: '100%' }}>
                                            <Image
                                                source={{ uri: mujer.foto_url }}
                                                style={{ width: 140, height: 140, borderRadius: 70, marginVertical: 5 }}
                                            />
                                        </View>
                                    )}
                                    {mujer.descripcion && (
                                        <Text style={{ marginBottom: 5 }}>{mujer.descripcion}</Text>
                                    )}
                                    {/* Lugar info */}
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
                                </ScrollView>
                            </Callout>
                        </Marker>
                    ))
                ))}
            </MapView>
        </View>
    );
}

export default Mapa;
