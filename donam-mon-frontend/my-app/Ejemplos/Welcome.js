// Importa los módulos necesarios de React Native y librerías externas
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componente principal de la pantalla de bienvenida
const Welcome = () => {
  const navigation = useNavigation(); // Hook para controlar la navegación

  useEffect(() => {
    // Temporizador para redirigir automáticamente después de 2 segundos
    const timer = setTimeout(async () => {
      // Verifica si el usuario está logueado en AsyncStorage
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        navigation.navigate('Main'); // Si está logueado, navega a la pantalla principal
      } else {
        navigation.navigate('Login'); // Si no, navega a la pantalla de login
      }
    }, 2000); // Espera 2 segundos

    // Limpia el temporizador si el componente se desmonta antes de tiempo
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, StyleSheet.absoluteFillObject]}>
      <Image
        source={require('../assets/splashscreen.png')}
        style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
      />
    </View>
  );
};

// Estilos para la pantalla de bienvenida
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Welcome;