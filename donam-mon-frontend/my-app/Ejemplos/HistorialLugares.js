import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles-perfil';

const HistorialLugares = ({ navigation }) => {
    const [visitedFallas, setVisitedFallas] = useState([]);

    useEffect(() => {
        const getVisitedFallas = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    setVisitedFallas([]);
                    return;
                }
                const response = await fetch('http://192.168.1.44:8000/api/visited-lugares/', {
                    method: 'GET',
                    headers: { 'Authorization': `Token ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setVisitedFallas(data);
                } else {
                    setVisitedFallas([]);
                }
            } catch (error) {
                setVisitedFallas([]);
            }
        };
        getVisitedFallas();
    }, []);

    const handleClearHistory = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;
            await fetch('http://192.168.1.44:8000/api/visited-lugares/', {
                method: 'DELETE',
                headers: { 'Authorization': `Token ${token}` },
            });
            setVisitedFallas([]);
            Alert.alert('Éxito', 'El historial de lugares visitados ha sido borrado.');
        } catch (error) {
            Alert.alert('Error', 'No se pudo borrar el historial.');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: '#f5f6fa' }]}> 
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <Image source={require('../assets/fuego.png')} style={{ width: 32, height: 32, marginRight: 8 }} />
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#bc5880', letterSpacing: 0.5 }}>
                    Historial de lugares visitados
                </Text>
            </View>
            <FlatList
                data={visitedFallas}
                keyExtractor={(item, index) => item.lugar?.id ? item.lugar.id.toString() : `lugar-${index}`}
                style={{ marginBottom: 10, width: '100%' }}
                renderItem={({ item }) => (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
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
                    }}>
                        <View style={{ width: 54, height: 54, alignItems: 'center', justifyContent: 'center', marginRight: 14, backgroundColor: '#eee', borderWidth: 2, borderColor: '#5f68c4', borderRadius: 12, overflow: 'hidden' }}>
                            {(() => {
                                let fotoUrl = item.lugar && item.lugar.foto_url ? item.lugar.foto_url : null;
                                if (fotoUrl && !fotoUrl.startsWith('http')) {
                                    // Si la URL es relativa, anteponer el host del backend
                                    fotoUrl = `http://192.168.1.44:8000${fotoUrl}`;
                                }
                                if (fotoUrl) {
                                    console.log('Cargando imagen:', fotoUrl);
                                }
                                return fotoUrl ? (
                                    <Image
                                        source={{ uri: fotoUrl }}
                                        style={{ width: 54, height: 54, resizeMode: 'cover', borderWidth: 2, borderColor: '#5f68c4' }}
                                        onError={e => {
                                            console.log('Error cargando imagen', fotoUrl, e.nativeEvent);
                                        }}
                                    />
                                ) : (
                                    <Image
                                        source={require('../assets/fuego.png')}
                                        style={{ width: 44, height: 44, resizeMode: 'contain' }}
                                    />
                                );
                            })()}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', color: '#5f68c4', fontSize: 16, marginBottom: 2 }}>{item.lugar?.nombre}</Text>
                            <Text style={{ color: '#bc5880', fontSize: 13, fontWeight: 'bold', marginBottom: 1 }}>Visitada el:</Text>
                            <Text style={{ color: '#888', fontSize: 13 }}>{item.visited_at ? new Date(item.visited_at).toLocaleString() : ''}</Text>
                        </View>
                    </View>
                )}
            />
            <TouchableOpacity onPress={handleClearHistory} style={[styles.clearButton, { backgroundColor: '#5f68c4', borderRadius: 12, marginBottom: 8 }]}> 
                <Text style={[styles.clearButtonText, { color: '#fff', fontWeight: 'bold' }]}>Borrar Historial</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HistorialLugares;
