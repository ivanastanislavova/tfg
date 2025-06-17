import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import usersData from '../usuarios.json';

export default function Login() {
  const navigation = useNavigation(); // Hook para navegación
  const [username, setUsername] = useState(''); // Estado para el usuario
  const [password, setPassword] = useState(''); // Estado para la contraseña

  useEffect(() => {
    // Al montar, guarda los usuarios en AsyncStorage si aún no existen
    const initializeUsers = async () => {
      const storedUsers = await AsyncStorage.getItem('users');
      if (!storedUsers) {
        await AsyncStorage.setItem('users', JSON.stringify(usersData));
      }
    };
    initializeUsers();
  }, []);

  // Valida el login del usuario contra la API de Django
  const validateLogin = async () => {
    try {
    const response = await fetch('http://192.168.1.132:8000/api/api-token-auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('currentUser', username);
        await AsyncStorage.setItem('isLoggedIn', 'true');
        navigation.navigate('Welcome');
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al verificar el login:', error);
      Alert.alert('Error', 'No se pudo verificar el login');
    }
  };

  // Renderiza la pantalla de login
  return (
    <View style={{ flex: 1, backgroundColor: '#edebff', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{
        width: '90%',
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: 28,
        borderRadius: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.10,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#5f68c4', marginBottom: 18, textAlign: 'center' }}>
          Iniciar sesión
        </Text>
        <TextInput
          style={{
            width: '100%',
            height: 44,
            borderColor: '#bc5880',
            borderWidth: 2,
            borderRadius: 10,
            paddingHorizontal: 14,
            fontSize: 17,
            marginBottom: 14,
            color: '#222',
            backgroundColor: '#fff',
          }}
          placeholder="Usuario"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={{
            width: '100%',
            height: 44,
            borderColor: '#bc5880',
            borderWidth: 2,
            borderRadius: 10,
            paddingHorizontal: 14,
            fontSize: 17,
            marginBottom: 18,
            color: '#222',
            backgroundColor: '#fff',
          }}
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#5f68c4',
            paddingVertical: 12,
            paddingHorizontal: 50,
            borderRadius: 10,
            marginTop: 6,
            marginBottom: 10,
            shadowColor: '#5f68c4',
            shadowOpacity: 0.15,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
          onPress={validateLogin}
        >
          <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold', letterSpacing: 1 }}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ alignSelf: 'center', marginTop: 10 }}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={{ color: '#5f68c4', fontWeight: 'bold', fontSize: 15 }}>
            ¿No tienes cuenta? <Text style={{ textDecorationLine: 'underline' }}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos para la pantalla de login
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Fondo sólido en negro
    opacity: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '90%',
    backgroundColor: 'rgba(0,0,0,0.8)', // Fondo semitransparente para resaltar el contenido
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'gold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
    backgroundColor: 'rgba(255, 69, 0, 0.7)',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  icon: {
    marginTop: 20,
  },
});