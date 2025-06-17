// PerfilUsuario.js: Pantalla de perfil de usuario y gestión de historial de fallas visitadas
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import styles from './styles-perfil';

// Componente principal del perfil de usuario
const PerfilUsuario = ({ route, navigation }) => {
    // Elimina toda la lógica de usuario local salvo el token
    const [newUsername, setNewUsername] = useState('');
    const [visitedFallas, setVisitedFallas] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        // Solo obtiene el username del backend (opcional: puedes crear un endpoint para obtener el usuario actual)
        const getVisitedFallas = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    setVisitedFallas([]);
                    return;
                }
                const response = await fetch('http://192.168.1.132:8000/api/visited-lugares/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setVisitedFallas(data);
                } else {
                    setVisitedFallas([]);
                }
            } catch (error) {
                console.error('Error al cargar las fallas visitadas:', error);
                setVisitedFallas([]);
            }
        };
        getVisitedFallas();
    }, [isFocused]);

    // handleSave: solo usa el token, no currentUser
    const handleSave = async () => {
        try {
            // Obtener el token de autenticación
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No se encontró el token de autenticación.');
                return;
            }
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

    // handleLogout: solo borra el token
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            Alert.alert('Error', 'No se pudo cerrar sesión');
        }
    };

    // handleClearHistory: solo borra en backend (opcional, si tienes endpoint)
    const handleClearHistory = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;
            await fetch('http://192.168.1.132:8000/api/visited-lugares/', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            setVisitedFallas([]);
            Alert.alert('Éxito', 'El historial de lugares visitados ha sido borrado.');
        } catch (error) {
            console.error('Error al borrar el historial:', error);
            Alert.alert('Error', 'No se pudo borrar el historial.');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: '#edebff' }]}> 
            <View style={{ alignItems: 'center', marginTop: 18, marginBottom: 10 }}>
                <Image source={require('../assets/usuario.png')} style={{ width: 90, height: 90, borderRadius: 45, marginBottom: 10, borderWidth: 2, borderColor: '#5f68c4', backgroundColor: '#fff' }} />
                <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#5f68c4' }}>
                    Puedes cambiar tu nombre de usuario aquí
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 10, justifyContent: 'space-between' }}>
                    <TextInput
                        style={[styles.input, { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#5f68c4', fontSize: 16, flex: 1, paddingHorizontal: 14, marginBottom: 0, marginRight: 8, color: '#222' }]}
                        value={newUsername}
                        onChangeText={setNewUsername}
                        placeholder="Nombre de usuario"
                        placeholderTextColor="#bbb"
                    />
                    <TouchableOpacity onPress={handleSave} style={[styles.button, { backgroundColor: '#5f68c4', borderRadius: 12, marginBottom: 0, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'auto' }]}> 
                        <Text style={[styles.buttonText, { color: '#fff', fontWeight: 'bold', fontSize: 16 }]}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
            <TouchableOpacity onPress={handleLogout} style={[styles.clearButton, { backgroundColor: '#bc5880', borderRadius: 12 }]}> 
                <Text style={[styles.clearButtonText, { color: '#fff', fontWeight: 'bold' }]}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PerfilUsuario;