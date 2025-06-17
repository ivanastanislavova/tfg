// PerfilUsuario.js: Pantalla de perfil de usuario y gestión de historial de fallas visitadas
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import styles from './styles-perfil';

// Componente principal del perfil de usuario
const PerfilUsuario = ({ route, navigation }) => {
    // Obtiene el nombre de usuario desde los parámetros de navegación
    const usernameParam = route.params?.username || '';
    // Estados para el nombre, usuario actual y fallas visitadas
    const [newUsername, setNewUsername] = useState(usernameParam);
    const [currentUser, setCurrentUser] = useState(null);
    const [visitedFallas, setVisitedFallas] = useState([]);
    // Hook para detectar si la pantalla está enfocada
    const isFocused = useIsFocused();

    // useEffect para cargar usuario y fallas visitadas al montar o enfocar
    useEffect(() => {
        // Carga el usuario actual desde AsyncStorage
        const getCurrentUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('currentUser');
                if (userData) {
                    let user;
                    if (typeof userData === 'string' && userData.trim().startsWith('{')) {
                        user = JSON.parse(userData);
                    } else if (typeof userData === 'object') {
                        user = userData;
                    } else {
                        // Si es un string plano (nombre de usuario), lo convertimos a objeto
                        user = { username: userData };
                    }
                    setCurrentUser(user);
                    setNewUsername(user.username);
                }
            } catch (error) {
                console.error('Error al cargar el usuario:', error);
            }
        };

        // Carga el historial de fallas visitadas, eliminando duplicados
        const getVisitedFallas = async () => {
            try {
                const storedVisitedFallas = await AsyncStorage.getItem('visitedFallas');
                if (storedVisitedFallas) {
                    const parsed = JSON.parse(storedVisitedFallas);
                    const uniqueFallas = [];
                    const ids = new Set();
                    for (let falla of parsed) {
                        if (!ids.has(falla.properties.id_falla)) {
                            ids.add(falla.properties.id_falla);
                            uniqueFallas.push(falla);
                        }
                    }
                    setVisitedFallas(uniqueFallas);
                } else {
                    setVisitedFallas([]);
                }
            } catch (error) {
                console.error('Error al cargar las fallas visitadas:', error);
            }
        };

        getCurrentUser();
        getVisitedFallas();
    }, [isFocused]);

    // Función para manejar la actualización del nombre de usuario
    const handleSave = async () => {
        try {
            if (!currentUser) return;

            // Obtener el token de autenticación
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No se encontró el token de autenticación.');
                return;
            }

            // Llamada al backend para actualizar el nombre de usuario
            const response = await fetch('http://192.168.1.132:8000/api/update-username/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ username: newUsername }),
            });
            const data = await response.json();
            if (response.ok) {
                // Actualiza el usuario en AsyncStorage
                const updatedUser = { ...currentUser, username: newUsername };
                await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
                setNewUsername(newUsername);
                Alert.alert('Éxito', 'Nombre de usuario actualizado');
                navigation.navigate('Main', { username: newUsername });
            } else {
                Alert.alert('Error', data.error || 'No se pudo actualizar el nombre');
            }
        } catch (error) {
            console.error('Error al actualizar el nombre de usuario:', error);
            Alert.alert('Error', 'No se pudo actualizar el nombre');
        }
    };

    // Función para manejar el cierre de sesión
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('currentUser');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            Alert.alert('Error', 'No se pudo cerrar sesión');
        }
    };

    // Función para manejar el borrado del historial de fallas visitadas
    const handleClearHistory = async () => {
        try {
            await AsyncStorage.removeItem('visitedFallas');
            setVisitedFallas([]);
            Alert.alert('Éxito', 'El historial de fallas visitadas ha sido borrado.');
        } catch (error) {
            console.error('Error al borrar el historial:', error);
            Alert.alert('Error', 'No se pudo borrar el historial.');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: '#fffbe9' }]}> 
            <View style={{ alignItems: 'center', marginTop: 18, marginBottom: 10 }}>
                <Image source={require('../assets/usuario.png')} style={{ width: 90, height: 90, borderRadius: 45, marginBottom: 10, borderWidth: 2, borderColor: '#f7c873', backgroundColor: '#fff' }} />
                <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#b85c00' }}>
                    Puedes cambiar tu nombre de usuario aquí
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 10, justifyContent: 'space-between' }}>
                    <TextInput
                        style={[styles.input, { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#f7c873', fontSize: 16, flex: 1, paddingHorizontal: 14, marginBottom: 0, marginRight: 8 }]}
                        value={newUsername}
                        onChangeText={setNewUsername}
                        placeholder="Nombre de usuario"
                        placeholderTextColor="#bbb"
                    />
                    <TouchableOpacity onPress={handleSave} style={[styles.button, { backgroundColor: '#b85c00', borderRadius: 12, marginBottom: 0, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'auto' }]}> 
                        <Text style={[styles.buttonText, { color: '#fff', fontWeight: 'bold', fontSize: 16 }]}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#b85c00', alignSelf: 'center' }}>
                Historial de fallas visitadas
            </Text>
            <FlatList
                data={visitedFallas}
                keyExtractor={(item, index) => item.properties.id_falla ? item.properties.id_falla.toString() : `falla-${index}`}
                style={{ marginBottom: 10 }}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 8, elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } }}>
                        {/* Imagen circular de la falla a la izquierda */}
                        <View style={{ width: 44, alignItems: 'center', marginRight: 10 }}>
                            {item.properties.boceto ? (
                                <Image
                                    source={{ uri: item.properties.boceto }}
                                    style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#f7c873', backgroundColor: '#eee' }}
                                />
                            ) : (
                                <Image
                                    source={require('../assets/fuego.png')}
                                    style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#f7c873', backgroundColor: '#eee' }}
                                />
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', color: '#b85c00', fontSize: 15 }}>{item.properties.nombre}</Text>
                            <Text style={{ color: '#888', fontSize: 13 }}>Visitada el: {new Date(item.visitedDate).toLocaleString()}</Text>
                        </View>
                    </View>
                )}
            />
            <TouchableOpacity onPress={handleClearHistory} style={[styles.clearButton, { backgroundColor: '#e53935', borderRadius: 12, marginBottom: 8 }]}> 
                <Text style={[styles.clearButtonText, { color: '#fff', fontWeight: 'bold' }]}>Borrar Historial</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={[styles.clearButton, { backgroundColor: '#b85c00', borderRadius: 12 }]}> 
                <Text style={[styles.clearButtonText, { color: '#fff', fontWeight: 'bold' }]}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PerfilUsuario;