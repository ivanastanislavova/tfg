import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Dimensions, Image } from 'react-native';

// Componente principal de la pantalla de Realidad Aumentada
const AReality = () => {
    // URL de la página de realidad aumentada
    const url = 'https://ivanastanislavova.github.io/falles/';

    // Función para abrir la URL en el navegador
    const openURL = () => {
        Linking.openURL(url).catch(err => {
            console.error("No se pudo abrir la URL:", err);
        });
    };

    // Renderiza la interfaz de la pantalla AR
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {/* Título principal */}
                <Text style={styles.title}>Realidad Aumentada</Text>
                {/* Subtítulo explicativo */}
                <Text style={styles.subtitle}>Explora las fallas en 3D y vive una experiencia interactiva única.</Text>
                {/* Imagen ilustrativa (falleras) */}
                <Image source={require('../assets/falleras.png')} style={styles.image} />
                {/* Botón para abrir la página de AR */}
                <TouchableOpacity style={styles.button} onPress={openURL}>
                    <Text style={styles.buttonText}>Abrir Página AR</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Estilos para la pantalla de Realidad Aumentada
const styles = StyleSheet.create({
    // Contenedor principal centrado y con fondo suave
    container: {
        flex: 1,
        backgroundColor: '#fff7e6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Tarjeta central con sombra y bordes redondeados
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        width: '85%',
    },
    // Título grande y destacado
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#b85c00',
        marginBottom: 10,
        textAlign: 'center',
    },
    // Subtítulo descriptivo
    subtitle: {
        fontSize: 16,
        color: '#b85c00',
        marginBottom: 20,
        textAlign: 'center',
    },
    // Imagen principal (sin recortes, tamaño fijo)
    image: {
        width: 220,
        height: 140,
        resizeMode: 'contain',
        marginBottom: 25,
        // Sin borderRadius ni borde para mostrar la imagen tal cual
    },
    // Botón destacado para abrir la web de AR
    button: {
        backgroundColor: '#ffab1e',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: '#b85c00',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    // Texto del botón
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AReality;