import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistorialRutas = ({ navigation }) => {
    const [rutasCompletadas, setRutasCompletadas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRutasCompletadas();
    }, []);

    const fetchRutasCompletadas = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return setRutasCompletadas([]);
            const response = await fetch('http://192.168.1.44:8000/api/rutas/', {
                method: 'GET',
                headers: { 'Authorization': `Token ${token}` },
            });
            if (response.ok) {
                const rutas = await response.json();
                // Para cada ruta, comprobar si todos los lugares están visitados en la ruta
                const completadas = [];
                for (const ruta of rutas) {
                    const res = await fetch(`http://192.168.1.44:8000/api/visited-lugares-ruta/?ruta_id=${ruta.id}`, {
                        method: 'GET',
                        headers: { 'Authorization': `Token ${token}` },
                    });
                    if (res.ok) {
                        const visitados = await res.json();
                        const idsVisitados = visitados.map(v => v.lugar.id);
                        const completada = ruta.lugares.every(l => idsVisitados.includes(l.id));
                        if (completada) completadas.push(ruta);
                    }
                }
                setRutasCompletadas(completadas);
            } else setRutasCompletadas([]);
        } catch {
            setRutasCompletadas([]);
        }
        setLoading(false);
    };

    const handleClearHistorialRutas = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;
            // Para cada ruta completada, borrar visitas
            for (const ruta of rutasCompletadas) {
                await fetch(`http://192.168.1.44:8000/api/visited-lugares-ruta/?ruta_id=${ruta.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Token ${token}` },
                });
            }
            setRutasCompletadas([]);
            Alert.alert('Éxito', 'Historial de rutas completadas borrado.');
        } catch {
            Alert.alert('Error', 'No se pudo borrar el historial de rutas.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <Image source={require('../assets/rutas.png')} style={{ width: 32, height: 32, marginRight: 8 }} />
                <Text style={styles.header}>Historial de rutas completadas</Text>
            </View>
            {loading ? (
                <Text style={styles.loading}>Cargando...</Text>
            ) : rutasCompletadas.length === 0 ? (
                <Text style={styles.empty}>No has completado ninguna ruta aún.</Text>
            ) : (
                <FlatList
                    data={rutasCompletadas}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.rutaCard}>
                            <Text style={styles.rutaTitle}>{item.nombre}</Text>
                            <Text style={styles.rutaSubtitle}>{item.lugares.length} lugares</Text>
                        </View>
                    )}
                />
            )}
            <TouchableOpacity style={styles.clearButton} onPress={handleClearHistorialRutas}>
                <Text style={styles.clearButtonText}>Borrar historial de rutas</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa', padding: 16 },
    header: { fontSize: 22, fontWeight: 'bold', color: '#bc5880', letterSpacing: 0.5 },
    loading: { color: '#5f68c4', textAlign: 'center', marginTop: 20 },
    empty: { color: '#888', textAlign: 'center', marginTop: 20 },
    rutaCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 2,
        elevation: 2,
        shadowColor: '#5f68c4',
        shadowOpacity: 0.10,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        borderWidth: 2,
        borderColor: '#5f68c4',
    },
    rutaTitle: { fontSize: 16, fontWeight: 'bold', color: '#5f68c4', marginBottom: 2 },
    rutaSubtitle: { fontSize: 13, color: '#bc5880', fontWeight: 'bold', marginBottom: 1 },
    clearButton: { backgroundColor: '#5f68c4', borderRadius: 12, padding: 14, marginTop: 16, alignItems: 'center', marginBottom: 8 },
    clearButtonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});

export default HistorialRutas;
