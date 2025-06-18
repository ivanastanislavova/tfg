// Importa StyleSheet de React Native para crear estilos
import { StyleSheet } from 'react-native';

// Estilos para los filtros (pantallas de filtros de fallas)
const stylesFiltros = StyleSheet.create({
  // Contenedor principal de la pantalla de filtros
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa', // fondo blanco-azulado suave
    padding: 20,
    justifyContent: 'flex-start',
  },
  // Botón de aceptar filtros
  acceptButton: {
    backgroundColor: '#6c63ff', // morado principal
    borderRadius: 10,
    paddingHorizontal: 32,
    paddingVertical: 12,
    elevation: 3,
    marginBottom: 18,
    alignSelf: 'center',
  },
  // Texto del botón de aceptar
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  // Caja de cada filtro (sección, estado, etc.)
  filterBox: {
    backgroundColor: '#e6e9f7', // azul/morado muy claro
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#6c63ff', // sombra morada
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  // Etiqueta de cada picker
  pickerLabel: {
    color: '#3a3a6a', // azul/morado oscuro
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  // Estilo del picker (selector)
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,
  },
});

export default stylesFiltros;
