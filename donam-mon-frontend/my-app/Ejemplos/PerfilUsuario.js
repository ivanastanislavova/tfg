// PerfilUsuario.js: Pantalla de perfil de usuario y gestión de historial de lugares y rutas visitadas
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import styles from './styles-perfil';
import getCompletedRoutes from './user-stats-utils';

const PerfilUsuario = ({ route, navigation }) => {
    const [newUsername, setNewUsername] = useState('');
    const [username, setUsername] = useState('');
    const [completedRoutes, setCompletedRoutes] = useState(0);
    const [visitedCount, setVisitedCount] = useState(0);
    const isFocused = useIsFocused();

    // Obtiene el nombre de usuario actual del backend
    const fetchUsername = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return setUsername('');
            const response = await fetch('http://192.168.1.44:8000/api/update-username/', {
                method: 'GET',
                headers: { 'Authorization': `Token ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setUsername(data.username || '');
            } else {
                setUsername('');
            }
        } catch {
            setUsername('');
        }
    };

    useEffect(() => {
        fetchUsername();
    }, [isFocused]);

    useEffect(() => {
        // Calcular rutas completadas
        const fetchCompletedRoutes = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) return setCompletedRoutes(0);
            const n = await getCompletedRoutes(
                token,
                'http://192.168.1.44:8000/api/visited-lugares-ruta/',
                'http://192.168.1.44:8000/api/rutas/'
            );
            setCompletedRoutes(n);
        };
        fetchCompletedRoutes();
    }, [isFocused]);

    useEffect(() => {
        // Obtener el número de lugares visitados
        const fetchVisitedCount = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) return setVisitedCount(0);
                const response = await fetch('http://192.168.1.44:8000/api/visited-lugares/', {
                    method: 'GET',
                    headers: { 'Authorization': `Token ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setVisitedCount(Array.isArray(data) ? data.length : 0);
                } else {
                    setVisitedCount(0);
                }
            } catch {
                setVisitedCount(0);
            }
        };
        fetchVisitedCount();
    }, [isFocused]);

    // handleSave: solo usa el token, no currentUser
    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No se encontró el token de autenticación.');
                return;
            }
            const response = await fetch('http://192.168.1.44:8000/api/update-username/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ username: newUsername }),
            });
            const data = await response.json();
            if (response.ok) {
                setNewUsername('');
                fetchUsername();
                Alert.alert('Éxito', 'Nombre de usuario actualizado');
            } else {
                Alert.alert('Error', data.error || 'No se pudo actualizar el nombre');
            }
        } catch (error) {
            console.error('Error al actualizar el nombre de usuario:', error);
            Alert.alert('Error', 'No se pudo actualizar el nombre');
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            Alert.alert('Error', 'No se pudo cerrar sesión');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: '#f5f6fa' }]}> 
            {/* Tarjeta de perfil mejorada */}
            <View style={{ backgroundColor: '#fff', borderRadius: 22, padding: 22, marginTop: 18, marginBottom: 18, marginHorizontal: 2, alignItems: 'center', elevation: 6, shadowColor: '#5f68c4', shadowOpacity: 0.13, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } }}>
                <Image source={require('../assets/usuario.png')} style={{ width: 110, height: 110, borderRadius: 55, marginBottom: 10, borderWidth: 3, borderColor: '#5f68c4', backgroundColor: '#fff', shadowColor: '#5f68c4', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }} />
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#5f68c4', marginBottom: 2, textAlign: 'center', letterSpacing: 0.5 }}>{username || 'Usuario'}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                    <View style={{ alignItems: 'center', marginHorizontal: 18 }}>
                        <Image source={require('../assets/fuego.png')} style={{ width: 44, height: 44, borderRadius: 12, marginBottom: 2, borderWidth: 2, borderColor: '#5f68c4' }} />
                        <Text style={{ color: '#bc5880', fontWeight: 'bold', fontSize: 16 }}>{visitedCount}</Text>
                        <Text style={{ color: '#5f68c4', fontSize: 13 }}>Lugares</Text>
                    </View>
                    <View style={{ width: 1, height: 38, backgroundColor: '#e0e0e0', marginHorizontal: 8 }} />
                    <View style={{ alignItems: 'center', marginHorizontal: 18 }}>
                        <View style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden', alignItems: 'flex-end', justifyContent: 'center', borderWidth: 2, borderColor: '#5f68c4', backgroundColor: '#fff', marginBottom: 2 }}>
                            <Image source={require('../assets/rutas.png')} style={{ width: 38, height: 44, resizeMode: 'contain', marginLeft: 8 }} />
                        </View>
                        <Text style={{ color: '#bc5880', fontWeight: 'bold', fontSize: 16 }}>{completedRoutes}</Text>
                        <Text style={{ color: '#5f68c4', fontSize: 13 }}>Rutas</Text>
                    </View>
                </View>
                <Text style={{ fontSize: 15, color: '#888', marginBottom: 10, textAlign: 'center' }}>¡Sigue explorando para aumentar tus logros!</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 0, justifyContent: 'space-between' }}>
                    <TextInput
                        style={[styles.input, { backgroundColor: '#f5f6fa', borderRadius: 14, borderWidth: 1.5, borderColor: '#5f68c4', fontSize: 17, flex: 1, paddingHorizontal: 16, marginBottom: 0, marginRight: 10, color: '#222' }]}
                        value={newUsername}
                        onChangeText={setNewUsername}
                        placeholder="Cambiar nombre"
                        placeholderTextColor="#bbb"
                    />
                    <TouchableOpacity onPress={handleSave} style={[styles.button, { backgroundColor: '#5f68c4', borderRadius: 14, marginBottom: 0, paddingVertical: 12, paddingHorizontal: 20, alignSelf: 'auto', elevation: 2 }]}> 
                        <Text style={[styles.buttonText, { color: '#fff', fontWeight: 'bold', fontSize: 17 }]}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Imágenes de historial */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 18 }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('HistorialLugares')}
                    activeOpacity={0.85}
                    style={{ borderRadius: 18, elevation: 4, shadowColor: '#5f68c4', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, backgroundColor: '#fff' }}
                >
                    <Image
                        source={require('../assets/historial_lugares_visitados.png')}
                        style={{ width: 170, height: 170, borderRadius: 18, resizeMode: 'cover' }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('HistorialRutas')}
                    activeOpacity={0.85}
                    style={{ borderRadius: 18, elevation: 4, shadowColor: '#5f68c4', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, backgroundColor: '#fff' }}
                >
                    <Image
                        source={require('../assets/historial_rutas_visitadas.png')}
                        style={{ width: 170, height: 170, borderRadius: 18, resizeMode: 'cover' }}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleLogout} style={[styles.clearButton, { backgroundColor: '#bc5880', borderRadius: 12 }]}> 
                <Text style={[styles.clearButtonText, { color: '#fff', fontWeight: 'bold' }]}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PerfilUsuario;