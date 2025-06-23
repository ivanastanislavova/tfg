import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleRegister = async () => {
    if (!username || !password || !password2 || !email || !birthDate) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    if (password !== password2) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    try {
      const response = await fetch('http://192.168.1.44:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          profile: { email, birth_date: birthDate }
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Éxito', 'Usuario registrado correctamente');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.error ? JSON.stringify(data.error) : 'No se pudo registrar el usuario');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      Alert.alert('Error', 'No se pudo registrar el usuario');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Registro</Text>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Repite la contraseña"
          placeholderTextColor="#aaa"
          value={password2}
          secureTextEntry={true}
          onChangeText={setPassword2}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha de nacimiento (YYYY-MM-DD)"
          placeholderTextColor="#aaa"
          value={birthDate}
          onChangeText={setBirthDate}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 10 }}>
          <Text style={{ color: '#5f68c4', fontWeight: 'bold' }}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edebff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5f68c4',
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
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
  },
  button: {
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
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
