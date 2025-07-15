import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import NavigationAppDemo2 from './Ejemplos/NavigationAppDemo2';
import { FiltrosProvider } from './Ejemplos/FiltrosContext';
import NotificacionProximidad from './Ejemplos/NotificacionProximidad';

export default function App() {
  return (
    <FiltrosProvider>
      <NotificacionProximidad />
      <NavigationAppDemo2 />
    </FiltrosProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});