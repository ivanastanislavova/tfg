import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
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

  // Valida el login del usuario
  const validateLogin = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Busca usuario y contraseña
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        // Si es correcto, guarda el usuario actual y el estado de login
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        await AsyncStorage.setItem('isLoggedIn', 'true'); // Guardar el estado de sesión activa
        navigation.navigate('Welcome'); // Navegar a la pantalla de bienvenida
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
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>🔥 Fallas Login 🔥</Text>

        {/* Input de usuario */}
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          placeholderTextColor="white"
          value={username}
          onChangeText={name => setUsername(name)}
        />

        {/* Input de contraseña */}
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="white"
          value={password}
          secureTextEntry={true}
          onChangeText={name => setPassword(name)}
        />

        {/* Botón de login */}
        <TouchableOpacity style={styles.button} onPress={validateLogin}>
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>

        {/* Icono decorativo */}
        <FontAwesome name="fire" size={50} color="orange" style={styles.icon} />
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