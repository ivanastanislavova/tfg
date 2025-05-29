// Main.js: Navegación principal con pestañas inferiores (Bottom Tab Navigator)
import AReality from './AReality';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Mapa from './Mapa';
import MujeresCombinadas from './MujeresCombinadas';
import PerfilUsuario from './PerfilUsuario';
import { Image } from 'react-native';
import QR from './QR';

// Crea el navegador de pestañas inferiores
const Tab = createBottomTabNavigator();

// Componente principal que define las pestañas de la app
const Main = ({ route }) => {
    return (
        // Tab.Navigator define la barra de navegación inferior y sus estilos
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#5f68c4', // Color del icono/texto activo
                tabBarInactiveTintColor: '#000000', // Color del icono/texto inactivo
                tabBarStyle: { backgroundColor: '#edebff' }, // Fondo del tab bar
            }}
        >
            {/* Pestaña de Mapa */}
            <Tab.Screen 
                name="Mapa" 
                component={Mapa} 
                initialParams={route.params} 
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Image source={require('../assets/mapa.png')} style={{ width: size, height: size, tintColor: color }} />
                    ),
                }} 
            />
            {/* Pestaña de Mujeres */}
            <Tab.Screen 
                name="Mujeres" 
                component={MujeresCombinadas} 
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Image source={require('../assets/fuego.png')} style={{ width: size, height: size, tintColor: color }} />
                    ),
                }} 
            />
            {/* Pestaña de QR */}
            <Tab.Screen 
                name="QR" 
                component={QR} 
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Image source={require('../assets/qr.png')} style={{ width: size, height: size, tintColor: color }} />
                    ),
                }} 
            />
            {/* Pestaña de Realidad Aumentada */}
            <Tab.Screen 
                name="RA" 
                component={AReality} 
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Image source={require('../assets/ra.png')} style={{ width: size, height: size, tintColor: color }} />
                    ),
                }} 
            />
            {/* Pestaña de Perfil de Usuario */}
             <Tab.Screen 
                name="Perfil" 
                component={PerfilUsuario} 
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Image source={require('../assets/perfil.png')} style={{ width: size, height: size, tintColor: color }} />
                    ),
                }} 
            />
        </Tab.Navigator>
    );
};

export default Main;