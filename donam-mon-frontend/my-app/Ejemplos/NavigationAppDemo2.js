// NavigationAppDemo2.js: Configuración de la navegación principal de la app
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import Login from './Login';
import Main from './Main';
import Detail from './Detail';
import Welcome from './Welcome';
import Filtros from './Filtros';
import Register from './Register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistorialLugares from './HistorialLugares';
import HistorialRutas from './HistorialRutas';
import RutaDetail from './RutaDetail';

// Crea el stack de navegación (pantallas apiladas)
const Stack = createStackNavigator();

// Componente principal de navegación
const NavigationAppDemo2 = () => {
  // Referencia para controlar la navegación programáticamente
  const navigationRef = useRef();

  // useEffect para comprobar si el usuario está logueado y redirigir
  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        navigationRef.current?.navigate('Welcome');
      } else {
        navigationRef.current?.navigate('Login');
      }
    };
    checkLoginStatus();
  }, []);

  return (
    // NavigationContainer envuelve toda la navegación de la app
    <NavigationContainer ref={navigationRef}>
      {/* Stack.Navigator define las pantallas y su orden */}
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#edebff', // Fondo parte de arriba
          },
          headerTitle: () => (
            <Image
              source={require('../assets/logo2.png')}
              style={{ width: 135, height: 135 }}
              resizeMode="contain"
            />
          ),
          headerTitleAlign: 'center',
          headerTintColor: '#fff', // Color del texto del header
        }}
      >
        {/* Pantalla de login (sin header) */}
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        {/* Pantalla de bienvenida (sin header) */}
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        {/* Pantalla principal con tabs */}
        <Stack.Screen name="Main" component={Main} options={{ headerLeft: null, headerTintColor: '#5f68c4', headerTitleStyle: { color: '#5f68c4', fontWeight: 'bold' } }} />
        {/* Pantalla de detalle de falla */}
        <Stack.Screen name="Detail" component={Detail} options={{ headerTintColor: '#5f68c4', headerBackTitle: 'Volver' }} />
        <Stack.Screen name="RutaDetail" component={RutaDetail} options={{ headerTintColor: '#5f68c4', headerBackTitle: 'Volver' }} />
        <Stack.Screen name="Filtros" component={Filtros} />
        <Stack.Screen name="HistorialLugares" component={HistorialLugares} options={{ title: 'Historial de Lugares Visitados', headerTintColor: '#5f68c4', headerBackTitle: 'Volver' }} />
        <Stack.Screen name="HistorialRutas" component={HistorialRutas} options={{ title: 'Historial de Rutas Completadas', headerTintColor: '#5f68c4', headerBackTitle: 'Volver' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationAppDemo2;