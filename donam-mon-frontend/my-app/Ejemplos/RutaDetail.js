import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';

const RutaDetail = ({ route }) => {
    const { ruta } = route.params;
    const [visitedRutaIds, setVisitedRutaIds] = useState([]);
    const [showScanner, setShowScanner] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [scanMsg, setScanMsg] = useState('');

    useEffect(() => {
        fetchVisitedRuta();
    }, []);

    const fetchVisitedRuta = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return setVisitedRutaIds([]);
            const response = await fetch(`http://192.168.1.44:8000/api/visited-lugares-ruta/?ruta_id=${ruta.id}`, {
                method: 'GET',
                headers: { 'Authorization': `Token ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setVisitedRutaIds(data.map(v => v.lugar.id));
            } else setVisitedRutaIds([]);
        } catch {
            setVisitedRutaIds([]);
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
            fetchVisitedRuta();
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
            setScanMsg('Ruta reiniciada. Todos los lugares están como no visitados.');
            setTimeout(() => setScanMsg(''), 2000);
        } catch {
            setScanMsg('Error al reiniciar la ruta.');
            setTimeout(() => setScanMsg(''), 2000);
        }
    };

    const completada = ruta.lugares.every(l => visitedRutaIds.includes(l.id));

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Ruta: {ruta.nombre}</Text>
            <View style={styles.qrRow}>
                {!completada && (
                    <Image source={require('../assets/qr.png')} style={styles.qrImageSmall} resizeMode="contain" />
                )}
                <Text style={[styles.completada, { marginLeft: !completada ? 12 : 0, textAlign: !completada ? 'left' : 'center' }]}>{completada ? '¡Ruta completada!' : 'Escanea los QR de cada lugar para completar la ruta.'}</Text>
            </View>
            <FlatList
                data={ruta.lugares}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.lugarCard}>
                        <Text style={styles.lugarName}>{item.nombre}</Text>
                        <Text style={styles.lugarStatus}>{visitedRutaIds.includes(item.id) ? 'Visitado' : 'No visitado'}</Text>
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
                            <Text style={{ color: '#333', fontSize: 18, marginBottom: 20 }}>Necesitamos permiso para usar la cámara</Text>
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
                    {scanMsg ? <Text style={{ color: '#6c63ff', textAlign: 'center', margin: 10 }}>{scanMsg}</Text> : null}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa', padding: 16 },
    header: { fontSize: 26, fontWeight: 'bold', color: '#6c63ff', marginBottom: 18, textAlign: 'center' },
    completada: { color: '#43a047', fontWeight: 'bold', fontSize: 16, marginBottom: 10, textAlign: 'center' },
    lugarCard: { backgroundColor: '#e6e9f7', borderRadius: 10, padding: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
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
    qrImageSmall: { width: 28, height: 28, marginRight: 0 },
});

export default RutaDetail;
