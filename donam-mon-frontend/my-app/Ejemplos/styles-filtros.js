// Importa StyleSheet de React Native para crear estilos
import { StyleSheet } from 'react-native';

// Estilos para los filtros (pantallas de filtros de fallas)
const stylesFiltros = StyleSheet.create({
  // Contenedor principal de la pantalla de filtros
  container: {
    flex: 1,
    backgroundColor: '#ffcf7e', 
    padding: 20,
    justifyContent: 'flex-start',
  },
  // Botón de aceptar filtros
  acceptButton: {
    backgroundColor: '#ffab1e', 
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
    backgroundColor: '#fffbe7',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#ffab1e',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  // Etiqueta de cada picker
  pickerLabel: {
    color: '#b85c00',
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
