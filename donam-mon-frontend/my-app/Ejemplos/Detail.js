import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import styles from './styles-detail';

// Componente de detalle de una mujer/lugar
const Detail = ({ route, navigation }) => {
    // Obtiene el lugar y la función updateMujer desde los parámetros de navegación
    const { lugar, updateMujer } = route.params;

    // Cambia el estado de visitada/no visitada y actualiza el estado global
    const toggleVisited = () => {
        const updatedLugar = { ...lugar, visited: !lugar.visited };
        updateMujer(updatedLugar);
        navigation.setParams({ lugar: updatedLugar });
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    const openImageModal = (imgUrl) => {
        setModalImage(imgUrl);
        setModalVisible(true);
    };
    const closeImageModal = () => {
        setModalVisible(false);
        setModalImage(null);
    };

    // Render principal de la pantalla de detalle
    return (
        <ScrollView style={[styles.container, { backgroundColor: '#edebff' }]}> 
            {/* Modal de imagen en grande */}
            {modalVisible && (
                <View style={{ position: 'absolute', zIndex: 1000, top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={closeImageModal} style={{ position: 'absolute', top: 36, right: 18, zIndex: 101, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 6 }}>
                        <Ionicons name="close" size={38} color="#fff" />
                    </TouchableOpacity>
                    <Image source={{ uri: modalImage }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                </View>
            )}
            {/* Tarjeta de información de la mujer */}
            <View style={{ backgroundColor: 'rgba(255,255,255,0.97)', borderRadius: 20, padding: 18, marginTop: 18, marginBottom: 12, marginHorizontal: 8, elevation: 2, borderWidth: 2, borderColor: '#bc5880', alignItems: 'center' }}>
                {/* Nombre de la mujer */}
                <Text style={{ color: '#bc5880', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 }}>{lugar.mujer_nombre}</Text>
                {/* Imagen de la mujer */}
                {lugar.mujer_foto ? (
                    <TouchableOpacity onPress={() => openImageModal(lugar.mujer_foto)}>
                        <Image
                            source={{ uri: lugar.mujer_foto }}
                            style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#edebff', backgroundColor: '#edebff', marginBottom: 10 }}
                        />
                    </TouchableOpacity>
                ) : null}
                {/* Descripción de la mujer justificada a la izquierda */}
                {lugar.mujer_descripcion && (
                    <Text style={{ color: '#222', fontSize: 15, marginBottom: 8, textAlign: 'left', alignSelf: 'stretch' }}>{lugar.mujer_descripcion}</Text>
                )}
                {/* Chips de áreas de investigación */}
                {(Array.isArray(lugar.areas_investigacion) && lugar.areas_investigacion.length > 0) ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 6, marginBottom: 4 }}>
                        {lugar.areas_investigacion.map((area, idx) => (
                            <View key={idx} style={{ backgroundColor: '#5f68c4', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 4, margin: 3 }}>
                                <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>{area}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    lugar.areas_investigacion && typeof lugar.areas_investigacion === 'string' && lugar.areas_investigacion.length > 0 ? (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 6, marginBottom: 4 }}>
                            <View style={{ backgroundColor: '#5f68c4', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 4, margin: 3 }}>
                                <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>{lugar.areas_investigacion}</Text>
                            </View>
                        </View>
                    ) : null
                )}
                {/* Chip de ámbito */}
                {lugar.mujer_ambito && (
                    <View style={{ backgroundColor: '#bc5880', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 4, margin: 3 }}>
                        <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>{lugar.mujer_ambito}</Text>
                    </View>
                )}
                {/* Fechas de la mujer */}
                {lugar.mujer_fechas && (
                    <Text style={{ color: '#5f68c4', fontSize: 15, marginBottom: 2 }}>{lugar.mujer_fechas}</Text>
                )}
            </View>
            {/* Tarjeta de información del lugar */}
            <View style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 20, padding: 18, marginBottom: 18, marginHorizontal: 8, elevation: 2, borderWidth: 2, borderColor: '#5f68c4' }}>
                <Text style={{ color: '#5f68c4', fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>Lugar</Text>
                {/* Imagen del lugar */}
                {lugar.foto ? (
                    <TouchableOpacity onPress={() => openImageModal(lugar.foto)}>
                        <Image source={{ uri: lugar.foto }} style={{ width: '100%', height: 180, borderRadius: 14, marginBottom: 12, borderWidth: 2, borderColor: '#bc5880' }} />
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.text}>No hay imagen disponible</Text>
                )}
                {/* Información relevante del lugar */}
                <Text style={{ fontSize: 16, color: '#bc5880', fontWeight: 'bold', marginBottom: 4 }}>Nombre: <Text style={{ fontWeight: 'normal', color: '#222' }}>{lugar.nombre}</Text></Text>
                {lugar.direccion && (
                    <Text style={{ fontSize: 15, color: '#5f68c4', marginBottom: 2 }}>Dirección: <Text style={{ color: '#222' }}>{lugar.direccion}</Text></Text>
                )}
                {lugar.descripcion && (
                    <Text style={{ fontSize: 15, color: '#5f68c4', marginBottom: 2 }}>Descripción: <Text style={{ color: '#222' }}>{lugar.descripcion}</Text></Text>
                )}
                {lugar.distance !== null && (
                    <Text style={{ fontSize: 15, color: '#bc5880', marginBottom: 8 }}>Distancia: <Text style={{ color: '#222' }}>{lugar.distance.toFixed(2)} km</Text></Text>
                )}
                {/* Botón para marcar como visitada/no visitada */}
                <TouchableOpacity onPress={toggleVisited} style={{ alignSelf: 'center', marginTop: 10, minWidth: 140, borderRadius: 20, backgroundColor: lugar.visited ? '#43a047' : '#e53935', elevation: 2, paddingVertical: 12, paddingHorizontal: 22 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>{lugar.visited ? 'Lugar visitado' : 'Lugar no visitado'}</Text>
                </TouchableOpacity>
                {/* Mapa del lugar (solo debajo del botón) */}
                {lugar.latitud && lugar.longitud && (
                    <View style={{ width: '100%', height: 180, borderRadius: 14, overflow: 'hidden', marginTop: 12, marginBottom: 12, borderWidth: 2, borderColor: '#bc5880' }}>
                        <MapView
                            style={{ flex: 1 }}
                            initialRegion={{
                                latitude: lugar.latitud,
                                longitude: lugar.longitud,
                                latitudeDelta: 0.003,
                                longitudeDelta: 0.003,
                            }}
                            scrollEnabled={false}
                            zoomEnabled={false}
                            pitchEnabled={false}
                            rotateEnabled={false}
                        >
                            <Marker 
                                coordinate={{ latitude: lugar.latitud, longitude: lugar.longitud }}
                                pinColor={'#5f68c4'} // Color personalizado (azul)
                            />
                        </MapView>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

export default Detail;