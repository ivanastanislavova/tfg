// Importa utilidades de React Native para crear estilos y obtener dimensiones de pantalla
import { StyleSheet, Dimensions } from 'react-native';

// Obtiene el ancho de la pantalla del dispositivo
const { width } = Dimensions.get('window');

// Define todos los estilos usados en la app
const styles = StyleSheet.create({
    // Estilo general de contenedores principales
    container: {
        flex: 1,
        backgroundColor: '#f9efe8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Botón principal de filtros
    filterButton: {
        backgroundColor: '#7196e4', // Azul
        paddingVertical: 6,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 40,
        alignSelf: 'center',
        width: width + 20,
        height: 50,
        alignItems: 'center',
    },
    // Texto del botón de filtros
    filterButtonText: {
        color: '#ffffff',
        fontSize: 16,
        paddingTop: 13,
        fontWeight: 'bold',
    },
    // Botón alternativo de filtros (más pequeño)
    filterButton2: {
        backgroundColor: '#7196e4',
        paddingVertical: 6,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 15,
        alignSelf: 'center',
        width: width + 30,
        height: 40,
        alignItems: 'center',
    },
    // Texto del botón alternativo de filtros
    filterButtonText2: {
        color: '#ffffff',
        paddingTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Contenedor del modal de filtros
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    // Contenido del modal
    modalContent: {
        backgroundColor: '#fff',
        width: width - 60,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    // Elemento individual del modal
    modalItem: {
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    // Texto de los elementos del modal
    modalItemText: {
        fontSize: 16,
        color: '#333',
    },
    // Botón para cerrar el modal
    modalClose: {
        marginTop: 20,
        backgroundColor: '#ed5151',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    // Texto del botón de cerrar modal
    modalCloseText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Estilo para el mapa (ocupa todo el espacio)
    map: {
        width: "100%",
        height: "100%",
    },
    // Estilo para el mapa en modo medio
    mapHalf: {
        width: "100%",
        height: "50%",
    },
    // Contenedor para mostrar el nombre de usuario sobre el mapa
    usernameContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        padding: 5,
        borderRadius: 5,
    },
    // Texto del nombre de usuario
    username: {
        color: 'white',
        fontWeight: 'bold',
    },
    // Título de pantalla
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    // Contenedor de cada tarjeta de falla
    fallaContainer: {
        flexDirection: 'column',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#ffefc2',
        borderRadius: 20,
        shadowColor: '#ed5151',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        width: width - 20, 
        alignItems: 'center',
    },
    // Imagen de la falla
    fallaImage: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    // Contenedor de detalles de la falla
    fallaDetails: {
        flex: 1,
    },
    // Título de la falla
    fallaTitle: {
        color: '#ed5151',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center', 
    },
    // Distancia de la falla
    fallaDistance: {
        fontSize: 14,
        color: '#333333', 
        textAlign: 'center',
    },
    // Contenedor de iconos
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20, 
        borderWidth: 1,
    },
    // Estilo para el callout del mapa
    callout: {
        width: 200,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    // Título del callout
    calloutTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    // Botón dentro del callout
    calloutButton: {
        marginTop: 5,
        padding: 5,
        backgroundColor: '#ff4500',
        borderRadius: 5,
    },
    // Texto del botón del callout
    calloutButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    // Imagen dentro del callout
    calloutImage: {
        width: 100,
        height: 100,
        marginBottom: 5,
    },
    // Texto de estado de visita de la falla
    fallaVisited: {
        fontSize: 14,
        color: '#333333',
        textAlign: 'center',
        marginTop: 5,
    },
    // Input de búsqueda
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        margin: 10,
    },
    // Subtítulo del callout
    calloutSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#ff4500',
    },
    // Imagen del callout (versión para cubrir todo el ancho)
    calloutImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
        marginVertical: 5,
    },
});

export default styles;