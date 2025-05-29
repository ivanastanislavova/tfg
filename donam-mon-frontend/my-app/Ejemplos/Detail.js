import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Share } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles-detail';

// Componente de detalle de una falla
const Detail = ({ route, navigation }) => {
    // Obtiene la falla mayor, la infantil (si existe) y la función updateFalla desde los parámetros de navegación
    const { falla, fallaInfantil, updateFalla } = route.params;

    // Cambia el estado de visitada/no visitada de la falla y actualiza el estado global
    const toggleVisited = (falla, isInfantil = false) => {
        const updatedFalla = { ...falla, visited: !falla.visited };
        updateFalla(updatedFalla, isInfantil);
        if (isInfantil) {
            navigation.setParams({ fallaInfantil: updatedFalla });
        } else {
            navigation.setParams({ falla: updatedFalla });
        }
    };

    // Renderiza la información detallada de una falla (mayor o infantil)
    const renderFallaInfo = (falla) => (
        <View style={styles.fallaContainer}>
            {/* Imagen de la falla si existe, si no, texto alternativo */}
            {falla.properties.boceto ? (
                <Image source={{ uri: falla.properties.boceto }} style={styles.fallaImage} />
            ) : (
                <Text style={styles.text}>No hay imagen disponible</Text>
            )}
            {/* Información relevante de la falla */}
            {falla.properties.seccion && (
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Sección: </Text>{falla.properties.seccion}
                </Text>
            )}
            {falla.properties.fallera && (
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Fallera Mayor: </Text>{falla.properties.fallera}
                </Text>
            )}
            {falla.properties.presidente && (
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Presidente: </Text>{falla.properties.presidente}
                </Text>
            )}
            {falla.properties.anyo_fundacion && (
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Año de fundación: </Text>{falla.properties.anyo_fundacion}
                </Text>
            )}
            {falla.properties.artista && (
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Artista: </Text>{falla.properties.artista}
                </Text>
            )}
            {falla.properties.distintivo && (
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Distintivo: </Text>{falla.properties.distintivo}
                </Text>
            )}
            {falla.properties.lema && (
                <Text style={styles.text}>
                    <Text style={styles.boldText}>Lema: </Text>{falla.properties.lema}
                </Text>
            )}
        </View>
    );

    // Permite compartir la información de la falla (y la infantil si existe) usando el API Share
    const compartirFalla = async () => {
        try {
            let message = `Me gustaría que veas esta falla:\n${falla.properties.nombre} de la sección ${falla.properties.seccion}.\n\"${falla.properties.lema}\" del artista fallero ${falla.properties.artista}.\n${falla.properties.boceto}.`;
            if (fallaInfantil) {
                message += `\n\nY también su falla infantil:\n${fallaInfantil.properties.nombre} de la sección ${fallaInfantil.properties.seccion}.\n\"${fallaInfantil.properties.lema}\" del artista fallero ${fallaInfantil.properties.artista}.\n${fallaInfantil.properties.boceto}.`;
            }
            await Share.share({ message });
        } catch (error) {
            console.error("Error al compartir la falla:", error);
        }
    };

    // Lista de secciones consideradas infantiles
    const INFANTIL_SECTIONS = [
        "IE", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
        "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"
    ];
    // Determina si la falla es infantil
    const esInfantil = INFANTIL_SECTIONS.includes(falla.properties.seccion);

    // Render principal de la pantalla de detalle
    return (
        <ScrollView style={styles.container}>
            {/* Cabecera con el nombre de la falla y botones de compartir y visitada */}
            <View style={{ alignItems: 'center', marginTop: 18, marginBottom: 8 }}>
                <Text style={[styles.header, { color: '#b85c00', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 }]}> 
                    {falla.properties.nombre} (ID: {falla.properties.id_falla})
                </Text>
                {/* Botón para compartir debajo del nombre */}
                <TouchableOpacity onPress={compartirFalla} style={{ backgroundColor: '#7196e4', borderRadius: 20, padding: 10, marginBottom: 8, elevation: 2 }}>
                    <Ionicons name="share-social" size={24} color="#fff" />
                </TouchableOpacity>
                {/* Botón para marcar como visitada/no visitada */}
                <TouchableOpacity onPress={() => toggleVisited(falla)} style={[styles.visitedButton, { marginBottom: 8, minWidth: 120, borderRadius: 18, backgroundColor: falla.visited ? '#43a047' : '#e53935', elevation: 1 }]}> 
                    <Text style={[styles.visitedButtonText, { color: '#fff', fontWeight: 'bold', fontSize: 15 }]}>{falla.visited ? 'Visitada' : 'No visitada'}</Text>
                </TouchableOpacity>
            </View>
            {/* Tarjeta de información de la falla mayor */}
            <View style={{ backgroundColor: '#fffbe9', borderRadius: 16, padding: 16, marginBottom: 18, marginHorizontal: 8, elevation: 1 }}>
                <Text style={[styles.subHeader, { color: '#b85c00', fontSize: 17, marginBottom: 8 }]}>Falla Mayor</Text>
                {renderFallaInfo(falla)}
            </View>
            {/* Si existe, tarjeta de información de la falla infantil asociada */}
            {fallaInfantil && (
                <View style={{ backgroundColor: '#fffbe9', borderRadius: 16, padding: 16, marginBottom: 18, marginHorizontal: 8, elevation: 1 }}>
                    <Text style={[styles.subHeader, { color: '#b85c00', fontSize: 17, marginBottom: 8 }]}>Falla Infantil</Text>
                    {renderFallaInfo(fallaInfantil)}
                </View>
            )}
        </ScrollView>
    );
}

export default Detail;