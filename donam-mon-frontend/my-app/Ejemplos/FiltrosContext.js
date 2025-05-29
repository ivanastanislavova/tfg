import React, { createContext, useContext, useState } from 'react';

// Crea el contexto de filtros
const FiltrosContext = createContext();

// Proveedor global de filtros para envolver la app
export const FiltrosProvider = ({ children }) => {
  // Estado global de los filtros
  const [selectedSection, setSelectedSection] = useState('Todas'); // Sección seleccionada
  const [selectedVisited, setSelectedVisited] = useState('Todas'); // Estado de visita seleccionado
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [sections, setSections] = useState(['Todas']); // Lista de secciones disponibles

  // Provee los valores y setters a toda la app
  return (
    <FiltrosContext.Provider value={{
      selectedSection,
      setSelectedSection,
      selectedVisited,
      setSelectedVisited,
      searchTerm,
      setSearchTerm,
      sections,
      setSections
    }}>
      {children}
    </FiltrosContext.Provider>
  );
};

// Hook para consumir el contexto de filtros fácilmente
export const useFiltros = () => useContext(FiltrosContext);
