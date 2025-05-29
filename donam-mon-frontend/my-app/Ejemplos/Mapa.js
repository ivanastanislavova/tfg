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

// Lista de secciones posibles para filtrar fallas
const ALL_SECTIONS = [
    "Todas","E", "1A", "1B", "2A", "2B", "3A", "3B", "3C", "4A", "4B", "4C", 
    "5A", "5B", "5C", "6A", "6B", "6C", "7A", "7B", "7C", "8A", "8B", "8C", "FC",
    "IE", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", 
    "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"
];

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
                const response = await axios.get('http://10.20.17.99:8000/api/mujeres/');
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
