import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import stylesFiltros from './styles-filtros';
import { useFiltros } from './FiltrosContext';
import { useNavigation } from '@react-navigation/native';

// Componente de pantalla de filtros para seleccionar sección y estado de visita
const Filtros = ({ onAccept, route }) => {
  // Obtiene y gestiona los filtros globales desde el contexto
  const { selectedSection, setSelectedSection, selectedVisited, setSelectedVisited, sections, setSections } = useFiltros();
  const navigation = useNavigation();

  // Al entrar, si no hay secciones, fuerza una mínima para evitar errores
  useEffect(() => {
    if (sections.length <= 1) {
      // Si se entra desde Mapa, pone al menos 'Todas' como sección
      if (route && route.params && route.params.from === 'Mapa') {
        setSections(['Todas']); // fallback mínimo
      }
    }
  }, [route]);

  // Acción al pulsar aceptar: ejecuta callback o vuelve atrás
  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    } else {
      navigation.goBack();
    }
  };

  // Renderiza la UI de filtros
  return (
    <View style={stylesFiltros.container}> 
      {/* Botón aceptar filtros */}
      <TouchableOpacity style={stylesFiltros.acceptButton} onPress={handleAccept}>
        <Text style={stylesFiltros.acceptButtonText}>Aceptar</Text>
      </TouchableOpacity>

      {/* Selector de sección */}
      <View style={stylesFiltros.filterBox}>
        <Text style={stylesFiltros.pickerLabel}>Selecciona una sección:</Text>
        <Picker
          selectedValue={selectedSection}
          style={stylesFiltros.picker}
          onValueChange={setSelectedSection}
        >
          {sections.map(section => (
            <Picker.Item key={section} label={section} value={section} />
          ))}
        </Picker>
      </View>

      {/* Selector de estado de visita */}
      <View style={stylesFiltros.filterBox}>
        <Text style={stylesFiltros.pickerLabel}>Filtrar por estado:</Text>
        <Picker
          selectedValue={selectedVisited}
          style={stylesFiltros.picker}
          onValueChange={setSelectedVisited}
        >
          <Picker.Item label="Todas" value="Todas" />
          <Picker.Item label="Visitadas" value="Visitadas" />
          <Picker.Item label="No visitadas" value="No visitadas" />
        </Picker>
      </View>
    </View>
  );
};

export default Filtros;
