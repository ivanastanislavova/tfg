import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import MapView, { Marker, Polyline } from 'react-native-maps';

const RutaDetail = ({ route }) => {
    const { ruta } = route.params;
    const [visitedRutaIds, setVisitedRutaIds] = useState([]);
    const [visitedOrder, setVisitedOrder] = useState([]);
    const [showScanner, setShowScanner] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [scanMsg, setScanMsg] = useState('');

    useEffect(() => {
        fetchVisitedRuta();
    }, []);

    const fetchVisitedRuta = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;
            const response = await fetch(`http://192.168.1.44:8000/api/visited-lugares-ruta/?ruta_id=${ruta.id}`, {
                method: 'GET',
                headers: { 'Authorization': `Token ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setVisitedRutaIds(data.map(v => v.lugar.id));
                setVisitedOrder(data.map(v => v.lugar.id));
            } else {
                setVisitedRutaIds([]);
                setVisitedOrder([]);
            }
        } catch {
            setVisitedRutaIds([]);
            setVisitedOrder([]);
        }
    };

    const handleBarcodeScanned = async ({ data }) => {
        const lugar = ruta.lugares.find(l => l.nombre.toLowerCase() === data.toLowerCase());
        if (!lugar) {
            setScanMsg('QR no corresponde a ningún lugar de la ruta.');
            setTimeout(() => setScanMsg(''), 2000);
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            await fetch('http://192.168.1.44:8000/api/visit-lugar-ruta/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
                body: JSON.stringify({ ruta_id: ruta.id, lugar_id: lugar.id })
            });
            setScanMsg('¡Lugar de ruta marcado como visitado!');
            await fetchVisitedRuta();
        } catch {
            setScanMsg('Error al marcar como visitado en ruta.');
        }
        setTimeout(() => setScanMsg(''), 2000);
    };

    const handleReiniciarRuta = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;
            await fetch(`http://192.168.1.44:8000/api/visited-lugares-ruta/?ruta_id=${ruta.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Token ${token}` },
            });
            setVisitedRutaIds([]);
            setVisitedOrder([]);
            setScanMsg('Ruta reiniciada. Todos los lugares están como no visitados.');
            setTimeout(() => setScanMsg(''), 2000);
        } catch {
            setScanMsg('Error al reiniciar la ruta.');
            setTimeout(() => setScanMsg(''), 2000);
        }
    };

    const completada = ruta.lugares.every(l => visitedRutaIds.includes(l.id));

    const getInitialRegion = () => {
        if (!ruta.lugares || ruta.lugares.length === 0) {
            return {
                latitude: 39.513,
                longitude: -0.4242,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
        }
        const lats = ruta.lugares.map(l => l.latitud);
        const lngs = ruta.lugares.map(l => l.longitud);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        return {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: Math.max(0.01, (maxLat - minLat) * 2 || 0.01),
            longitudeDelta: Math.max(0.01, (maxLng - minLng) * 2 || 0.01),
        };
    };

    const getSegments = () => {
        const lugaresMap = new Map(ruta.lugares.map(l => [l.id, l]));
        const puntos = visitedOrder
            .map(id => lugaresMap.get(id))
            .filter(l => l && l.latitud && l.longitud)
            .map(l => ({
                latitude: parseFloat(l.latitud),
                longitude: parseFloat(l.longitud)
            }));

        const segmentos = [];
        for (let i = 0; i < puntos.length - 1; i++) {
            segmentos.push([puntos[i], puntos[i + 1]]);
        }
        return segmentos;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header} numberOfLines={2} ellipsizeMode="tail">
                Ruta de {ruta.nombre}
            </Text>

            <View style={styles.qrRow}>
                {!completada && (
                    <Image source={require('../assets/qr.png')} style={styles.qrImageSmall} resizeMode="contain" />
                )}
                <Text style={[styles.completada, { marginLeft: !completada ? 12 : 0, textAlign: !completada ? 'left' : 'center' }]}>
                    {completada ? '¡Ruta completada!' : 'Escanea los QR de cada lugar para completar la ruta.'}
                </Text>
            </View>

            {ruta.lugares && ruta.lugares.length > 0 && (
                <View style={styles.mapaContainer}>
                    <MapView
                        key={visitedOrder.join('-')}
                        style={{ flex: 1 }}
                        initialRegion={getInitialRegion()}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        rotateEnabled={false}
                    >
                        {getSegments().map((segment, idx) => (
                            <Polyline
                                key={idx}
                                coordinates={segment}
                                strokeColor="#43a047"
                                strokeWidth={5}
                            />
                        ))}
                        {ruta.lugares.map(lugar =>
                            (lugar.latitud && lugar.longitud) ? (
                                <Marker
                                    key={lugar.id}
                                    coordinate={{ latitude: lugar.latitud, longitude: lugar.longitud }}
                                    pinColor={visitedRutaIds.includes(lugar.id) ? '#43a047' : '#5f68c4'}
                                    title={lugar.nombre}
                                />
                            ) : null
                        )}
                    </MapView>
                </View>
            )}

            <FlatList
                data={ruta.lugares}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.lugarCard}>
                        <Text style={styles.lugarName}>{item.nombre}</Text>
                        <Text style={styles.lugarStatus}>
                            {visitedRutaIds.includes(item.id) ? 'Visitado' : 'No visitado'}
                        </Text>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.scanButton} onPress={() => setShowScanner(true)}>
                <Text style={styles.scanButtonText}>Escanear QR de lugar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.scanButton} onPress={handleReiniciarRuta}>
                <Text style={styles.scanButtonText}>Reiniciar ruta</Text>
            </TouchableOpacity>

            <Modal visible={showScanner} animationType="slide">
                <View style={{ flex: 1, backgroundColor: '#f5f6fa', justifyContent: 'center' }}>
                    {(!permission || !permission.granted) ? (
                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <Text style={{ color: '#333', fontSize: 18, marginBottom: 20 }}>
                                Necesitamos permiso para usar la cámara
                            </Text>
                            <TouchableOpacity style={styles.scanButton} onPress={requestPermission}>
                                <Text style={styles.scanButtonText}>Conceder permiso</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <CameraView
                            style={{ flex: 1 }}
                            facing="back"
                            barCodeScannerSettings={{ barCodeTypes: ['qr'] }}
                            onBarcodeScanned={handleBarcodeScanned}
                        />
                    )}
                    <TouchableOpacity style={styles.scanButton} onPress={() => setShowScanner(false)}>
                        <Text style={styles.scanButtonText}>Cerrar escáner</Text>
                    </TouchableOpacity>
                    {scanMsg ? (
                        <Text style={{ color: '#6c63ff', textAlign: 'center', margin: 10 }}>{scanMsg}</Text>
                    ) : null}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa', padding: 16 },
    header: { fontSize: 26, fontWeight: 'bold', color: '#6c63ff', marginBottom: 18, textAlign: 'center' },
    completada: { color: '#43a047', fontWeight: 'bold', fontSize: 16, marginBottom: 10, textAlign: 'center' },
    mapaContainer: {
        width: '100%',
        height: 220,
        borderRadius: 14,
        overflow: 'hidden',
        marginTop: 18,
        marginBottom: 18,
        borderWidth: 2,
        borderColor: '#bc5880',
        alignSelf: 'center',
    },
    lugarCard: {
        backgroundColor: '#e6e9f7',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },
    lugarName: { fontSize: 16, color: '#3a3a6a' },
    lugarStatus: { fontSize: 16, fontWeight: 'bold', color: '#6c63ff' },
    scanButton: { backgroundColor: '#6c63ff', borderRadius: 10, padding: 14, marginTop: 16, alignItems: 'center' },
    scanButtonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
    qrRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginLeft: 18,
        marginRight: 18,
    },
    qrImageSmall: { width: 28, height: 28 },
});

export default RutaDetail;
