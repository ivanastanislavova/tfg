// QR.js: Pantalla de escaneo de códigos QR para localizar fallas
// Importación de librerías y componentes necesarios
import React, { useState, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import stylesDetail from './styles-detail';

// Componente principal de escaneo QR
export default function QR() {
    // Hooks de navegación y parámetros
    const navigation = useNavigation();
    const route = useRoute();
    const { updateFalla } = route.params || {};
    // Estados para permisos, escaneo y datos de fallas
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [fallaEncontrada, setFallaEncontrada] = useState(null);
    const [fallaInfantilEncontrada, setFallaInfantilEncontrada] = useState(null);
    const [fallas, setFallas] = useState([]);
    const [fallasInfantiles, setFallasInfantiles] = useState([]);

    // useEffect para cargar fallas y fallas infantiles desde la API
    useEffect(() => {
        const fetchFallas = async () => {
            try {
                const response = await axios.get('https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/falles-fallas/exports/geojson?lang=ca&timezone=Europe%2FBerlin');
                setFallas(response.data.features);
            } catch (error) {
                console.error('Error cargando fallas:', error);
            }
        };
        const fetchFallasInfantiles = async () => {
            try {
                const response = await axios.get('https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/falles-infantils-fallas-infantiles/exports/geojson?lang=ca&timezone=Europe%2FBerlin');
                setFallasInfantiles(response.data.features);
            } catch (error) {
                console.error('Error cargando fallas infantiles:', error);
            }
        };
        fetchFallas();
        fetchFallasInfantiles();
    }, []);

    // Función que maneja el escaneo del código QR
    const handleBarcodeScanned = ({ data }) => {
        if (scanned) return;
        setScanned(true);
        let idFalla = data;
        if (idFalla.includes('id_falla=')) idFalla = idFalla.split('id_falla=')[1];
        // Buscar por id (comparar como string por si acaso)
        const falla = fallas.find(f => String(f.properties.id_falla) === String(idFalla));
        const fallaInfantil = fallasInfantiles.find(f => String(f.properties.id_falla) === String(idFalla));
        // Ocultar si es 350 o 351
        if (idFalla === '350' || idFalla === '351') {
            setFallaEncontrada(null);
            setFallaInfantilEncontrada(null);
            setTimeout(() => setScanned(false), 2000);
            return;
        }
        if (falla || fallaInfantil) {
            setFallaEncontrada(falla || fallaInfantil);
            setFallaInfantilEncontrada(falla && fallaInfantil ? fallaInfantil : null);
        } else {
            setFallaEncontrada(null);
            setFallaInfantilEncontrada(null);
            alert('Falla no encontrada para el ID: ' + idFalla);
        }
        setTimeout(() => setScanned(false), 2000);
    };

    // Renderizado de la info de la falla (igual que Detail.js)
    const renderFallaInfo = (falla) => (
        <View style={stylesDetail.fallaContainer}>
            {falla.properties.boceto ? (
                <Image source={{ uri: falla.properties.boceto }} style={stylesDetail.fallaImage} />
            ) : (
                <Text style={stylesDetail.text}>No hay imagen disponible</Text>
            )}
            {falla.properties.seccion && (
                <Text style={stylesDetail.text}>
                    <Text style={stylesDetail.boldText}>Sección: </Text>{falla.properties.seccion}
                </Text>
            )}
            {falla.properties.fallera && (
                <Text style={stylesDetail.text}>
                    <Text style={stylesDetail.boldText}>Fallera Mayor: </Text>{falla.properties.fallera}
                </Text>
            )}
            {falla.properties.presidente && (
                <Text style={stylesDetail.text}>
                    <Text style={stylesDetail.boldText}>Presidente: </Text>{falla.properties.presidente}
                </Text>
            )}
            {falla.properties.anyo_fundacion && (
                <Text style={stylesDetail.text}>
                    <Text style={stylesDetail.boldText}>Año de fundación: </Text>{falla.properties.anyo_fundacion}
                </Text>
            )}
            {falla.properties.artista && (
                <Text style={stylesDetail.text}>
                    <Text style={stylesDetail.boldText}>Artista: </Text>{falla.properties.artista}
                </Text>
            )}
            {falla.properties.distintivo && (
                <Text style={stylesDetail.text}>
                    <Text style={stylesDetail.boldText}>Distintivo: </Text>{falla.properties.distintivo}
                </Text>
            )}
            {falla.properties.lema && (
                <Text style={stylesDetail.text}>
                    <Text style={stylesDetail.boldText}>Lema: </Text>{falla.properties.lema}
                </Text>
            )}
        </View>
    );

    // Si todavía no se sabe si hay permiso o no, no se muestra nada
    if (!permission) {
        return null;
    }
    // Si no se ha concedido el permiso para la cámara, se solicita al usuario
    if (!permission.granted) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.permissionText}>
                    Necesitamos tu permiso para usar la cámara
                </Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission} activeOpacity={0.8}>
                    <Text style={styles.buttonText}>Conceder permiso</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Renderizado del componente
    return (
        <View style={{ flex: 1, backgroundColor: '#f7b538' }}>
            <CameraView
                style={{ flex: 1 }}
                facing="back"
                barCodeScannerSettings={{ barCodeTypes: ['qr'] }}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />
            <ScrollView style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
                {fallaEncontrada && (
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.97)', margin: 10, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 }}>
                        <Text style={[stylesDetail.header, { color: '#b85c00', textAlign: 'center', marginBottom: 8 }]}>{fallaEncontrada.properties.nombre} (ID: {fallaEncontrada.properties.id_falla})</Text>
                        <Text style={[stylesDetail.subHeader, { color: '#ffab1e', textAlign: 'center' }]}>Falla</Text>
                        {renderFallaInfo(fallaEncontrada)}
                        {fallaInfantilEncontrada && (
                            <>
                                <Text style={[stylesDetail.subHeader, { color: '#ffab1e', textAlign: 'center' }]}>Falla Infantil</Text>
                                {renderFallaInfo(fallaInfantilEncontrada)}
                            </>
                        )}
                        <TouchableOpacity
                            style={{ backgroundColor: '#ffab1e', borderRadius: 8, padding: 12, marginTop: 18, alignItems: 'center' }}
                            onPress={() => {
                                setFallaEncontrada(null);
                                setFallaInfantilEncontrada(null);
                                setScanned(false);
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Volver a escanear</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

// Estilos para la vista
const styles = StyleSheet.create({
    centerText: {
        fontSize: 16,
        padding: 16,
        textAlign: 'center',
        backgroundColor: 'white',
    },
    permissionText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#800000',
        paddingVertical: 14,
        paddingHorizontal: 25,
        marginVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
        minWidth: 220,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.6,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: '#f7b538',
    },
});
