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
                const response = await fetch('http://192.168.1.132:8000/api/visited-lugares/', {
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
            await fetch('http://192.168.1.132:8000/api/visited-lugares/', {
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
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#bc5880', alignSelf: 'center', letterSpacing: 0.5 }}>
                Historial de lugares visitados
            </Text>
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
                        <View style={{ width: 48, alignItems: 'center', marginRight: 14 }}>
                            {item.lugar && item.lugar.foto_url ? (
                                <Image
                                    source={{ uri: item.lugar.foto_url }}
                                    style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#5f68c4', backgroundColor: '#eee' }}
                                />
                            ) : (
                                <Image
                                    source={require('../assets/fuego.png')}
                                    style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#5f68c4', backgroundColor: '#eee' }}
                                />
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', color: '#5f68c4', fontSize: 16, marginBottom: 2 }}>{item.lugar?.nombre}</Text>
                            <Text style={{ color: '#5f68c4', fontSize: 13, fontWeight: 'bold', marginBottom: 1 }}>Visitada el:</Text>
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
