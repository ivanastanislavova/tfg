import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Dimensions, Image, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

// Componente principal de la pantalla de Realidad Aumentada
const AReality = () => {
    const [nearbyLugares, setNearbyLugares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNearbyLugares = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Obtener ubicación del usuario
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setError('Permiso de ubicación denegado');
                    setLoading(false);
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;

                // 2. Obtener lugares desde el backend
                const response = await axios.get('http:192.168.1.132:8000/api/mujeres/');
                let lugares = [];
                response.data.forEach(mujer => {
                    if (mujer.lugares && Array.isArray(mujer.lugares)) {
                        mujer.lugares.forEach(lugar => {
                            if (lugar.ar_url) {
                                lugares.push({
                                    ...lugar,
                                    mujer_nombre: mujer.nombre,
                                    mujer_foto: mujer.foto,
                                    latitud: lugar.latitud,
                                    longitud: lugar.longitud,
                                    ar_url: lugar.ar_url,
                                });
                            }
                        });
                    }
                });

                // 3. Calcular distancia y filtrar <= 3km
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
                const nearby = lugares
                    .map(lugar => ({
                        ...lugar,
                        distance: getDistance(latitude, longitude, lugar.latitud, lugar.longitud)
                    }))
                    .filter(lugar => lugar.distance !== null && lugar.distance <= 3);
                setNearbyLugares(nearby);
            } catch (err) {
                setError('Error obteniendo lugares o ubicación');
            }
            setLoading(false);
        };
        fetchNearbyLugares();
    }, []);

    const openURL = (url) => {
        Linking.openURL(url).catch(err => {
            console.error('No se pudo abrir la URL:', err);
        });
    };

    // Renderiza la interfaz de la pantalla AR
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {/* Título principal */}
                <Text style={styles.title}>Realidad Aumentada</Text>
                {/* Subtítulo explicativo */}
                <Text style={styles.subtitle}>Explora los lugares con RA si estás cerca (menos de 3 km).</Text>
                {/* Imagen ilustrativa (falleras) */}
                <Image source={require('../assets/mujeres.png')} style={styles.image} />
                {/* Indicador de carga */}
                {loading && <Text style={{ color: '#6c63ff', marginVertical: 10 }}>Cargando lugares cercanos...</Text>}
                {/* Mensaje de error */}
                {error && <Text style={{ color: 'red', marginVertical: 10 }}>{error}</Text>}
                {/* Lista de lugares cercanos con botón para abrir RA */}
                <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                    {/* Mensaje si no hay lugares cercanos */}
                    {nearbyLugares.length === 0 && !loading && !error && (
                        <Text style={{ color: '#3a3a6a', marginVertical: 10 }}>No hay lugares con RA a menos de 3 km.</Text>
                    )}
                    {/* Mapeo de lugares para mostrar botón por cada uno */}
                    {nearbyLugares.map((lugar, idx) => (
                        <TouchableOpacity
                            key={lugar.id + '-' + idx}
                            style={styles.button}
                            onPress={() => openURL(lugar.ar_url)}
                        >
                            <Text style={styles.buttonText}>Abrir RA de {lugar.nombre}</Text>
                            <Text style={{ color: '#fff', fontSize: 13, marginTop: 2 }}>{lugar.distance !== null && lugar.distance !== undefined ? lugar.distance.toFixed(2) : ''} km</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

// Estilos para la pantalla de Realidad Aumentada
const styles = StyleSheet.create({
    // Contenedor principal centrado y con fondo suave
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Tarjeta central con sombra y bordes redondeados
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        width: '85%',
        maxHeight: '90%',
    },
    // Título grande y destacado
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6c63ff',
        marginBottom: 10,
        textAlign: 'center',
    },
    // Subtítulo descriptivo
    subtitle: {
        fontSize: 16,
        color: '#3a3a6a',
        marginBottom: 20,
        textAlign: 'center',
    },
    // Imagen principal (sin recortes, tamaño fijo)
    image: {
        width: 220,
        height: 140,
        resizeMode: 'contain',
        marginBottom: 25,
    },
    // Botón destacado para abrir la web de AR
    button: {
        backgroundColor: '#6c63ff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 8,
        shadowColor: '#6c63ff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
        width: '100%',
    },
    // Texto del botón
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default AReality;