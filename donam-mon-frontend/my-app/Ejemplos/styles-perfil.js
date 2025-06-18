// Importa StyleSheet de React Native para crear estilos
import { StyleSheet } from 'react-native';

// Estilos para la pantalla de perfil de usuario
const styles = StyleSheet.create({
    // Contenedor principal
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa', 
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
    // Input de texto para el nombre de usuario
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    // Botón de guardar/cerrar sesión
    button: {
        backgroundColor: '#7196e4',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    // Texto de los botones
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    // Contenedor de cada tarjeta de falla visitada
    fallaContainer: {
        backgroundColor: '#ffefc2',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    // Título de la falla visitada
    fallaTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Fecha de visita de la falla
    fallaDate: {
        fontSize: 14,
        color: '#333333',
    },
    // Botón de cerrar sesión
    logoutButton: {
        backgroundColor: '#FF0000',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    // Texto del botón de cerrar sesión
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    // Botón de borrar historial
    clearButton: {
        backgroundColor: '#ff6347',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    // Texto del botón de borrar historial
    clearButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;