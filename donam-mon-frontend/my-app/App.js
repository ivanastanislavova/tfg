import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import NavigationAppDemo2 from './Ejemplos/NavigationAppDemo2';
import { FiltrosProvider } from './Ejemplos/FiltrosContext';
import Register from './Ejemplos/Register';
import NotificacionProximidad from './Ejemplos/NotificacionProximidad';

// Componente principal de la app
export default function App() {
  return (
    // Provee el contexto de filtros a toda la app
    <FiltrosProvider>
      {/* Notificaciones de proximidad */}
      <NotificacionProximidad />
      {/* Componente de navegación principal */}
      <NavigationAppDemo2/>
    </FiltrosProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
});
