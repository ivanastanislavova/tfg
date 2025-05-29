// Combina fallas mayores e infantiles y calcula la distancia si hay ubicación
export function combineFallas(fallas, fallasInfantiles, userLocation) {
    // Para cada falla mayor, busca si tiene una falla infantil asociada y calcula la distancia al usuario
    return fallas.map(falla => {
        // Busca la falla infantil correspondiente por id_falla
        const fallaInfantil = fallasInfantiles.find(f => f.properties.id_falla === falla.properties.id_falla);
        let distance = null;
        // Si hay coordenadas y ubicación del usuario, calcula la distancia
        if (
            falla.geometry &&
            Array.isArray(falla.geometry.coordinates) &&
            falla.geometry.coordinates.length >= 2 &&
            userLocation
        ) {
            distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                falla.geometry.coordinates[1], // latitud
                falla.geometry.coordinates[0]  // longitud
            );
        }
        // Devuelve la falla mayor, su infantil asociada (si existe) y la distancia
        return { ...falla, fallaInfantil, distance };
    });
}

// Calcula la distancia entre dos puntos geográficos usando la fórmula del haversine
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        0.5 - Math.cos(dLat) / 2 + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        (1 - Math.cos(dLon)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

// Aplica los filtros sobre las fallas combinadas
export function applyFilters(combinedFallas, selectedSection, selectedVisited, searchTerm) {
    let filteredFallas = combinedFallas;
    // Filtra por sección si no es 'Todas'
    if (selectedSection !== 'Todas') {
        filteredFallas = filteredFallas.filter(falla => falla.properties.seccion === selectedSection || (falla.fallaInfantil && falla.fallaInfantil.properties.seccion === selectedSection));
    }
    // Filtra por estado de visita
    if (selectedVisited !== 'Todas') {
        if (selectedVisited === 'No visitadas') {
            filteredFallas = filteredFallas.filter(falla =>
                !falla.visited && (!falla.fallaInfantil || !falla.fallaInfantil.visited)
            );
        } else if (selectedVisited === 'Visitadas') {
            filteredFallas = filteredFallas.filter(falla =>
                falla.visited || (falla.fallaInfantil && falla.fallaInfantil.visited)
            );
        }
    }
    // Filtra por término de búsqueda en el nombre
    if (searchTerm) {
        filteredFallas = filteredFallas.filter(falla => falla.properties.nombre && falla.properties.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // Ordena por distancia (las más cercanas primero)
    return filteredFallas.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
}
