import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Rutas = () => {
    const [rutas, setRutas] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchRutas = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get('http://192.168.1.44:8000/api/rutas/', {
                    headers: token ? { Authorization: `Token ${token}` } : {},
                });
                setRutas(response.data);
            } catch (error) {
                setRutas([]);
            }
        };
        fetchRutas();
    }, []);

    return (
        <View style={styles.container}>
            {/* Imagen decorativa de rutas */}
            <Image source={require('../assets/rutas.png')} style={styles.rutasImage} resizeMode="contain" />
            <Text style={styles.header}>Rutas</Text>
            <FlatList
                data={rutas}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.rutaCard} onPress={() => navigation.navigate('RutaDetail', { ruta: item })}>
                        <Text style={styles.rutaTitle}>Ruta: {item.nombre}</Text>
                        <Text style={styles.rutaSubtitle}>{item.lugares.length} lugares</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa', padding: 16 },
    rutasImage: { width: '100%', height: 120, marginBottom: 10, alignSelf: 'center' },
    header: { fontSize: 26, fontWeight: 'bold', color: '#6c63ff', marginBottom: 18, textAlign: 'center' },
    rutaCard: { backgroundColor: '#fff', borderRadius: 14, padding: 18, marginBottom: 14, elevation: 2 },
    rutaTitle: { fontSize: 20, fontWeight: 'bold', color: '#3a3a6a' },
    rutaSubtitle: { fontSize: 15, color: '#6c63ff', marginTop: 4 },
});

export default Rutas;
