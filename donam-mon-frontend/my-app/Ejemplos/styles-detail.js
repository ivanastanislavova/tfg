// Importa StyleSheet de React Native para crear estilos
import { StyleSheet } from 'react-native';

// Estilos para las pantallas de detalle de falla
const styles = StyleSheet.create({
    // Contenedor principal
    container: {
        flex: 1,
        backgroundColor: '#ffcf7e', 
        padding: 20,
    },
    // Título principal
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    // Subtítulo
    subHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    // Contenedor de la tarjeta de la falla
    fallaContainer: {
        backgroundColor: '#ffefc2',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    // Imagen de la falla
    fallaImage: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    // Texto general
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    // Texto en negrita
    boldText: {
        fontWeight: 'bold',
    },
    // Texto de estado de visita
    fallaVisited: {
        fontSize: 16,
        color: '#007BFF',
        textAlign: 'center',
        marginVertical: 10,
    },
    // Botón de visitada/no visitada
    visitedButton: {
        backgroundColor: '#fee8a7',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginVertical: 10,
    },
    // Texto del botón de visitada/no visitada
    visitedButtonText: {
        color: '#ffab1e',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default styles;