// Utilidad para calcular rutas completadas por el usuario
export default async function getCompletedRoutes(token, visitedLugarRutaEndpoint, rutasEndpoint) {
    // Devuelve el número de rutas completadas
    try {
        // 1. Obtener todas las rutas
        const rutasRes = await fetch(rutasEndpoint, {
            method: 'GET',
            headers: { 'Authorization': `Token ${token}` },
        });
        if (!rutasRes.ok) return 0;
        const rutas = await rutasRes.json();
        let completadas = 0;
        // 2. Para cada ruta, comprobar si todos los lugares están visitados
        for (const ruta of rutas) {
            const res = await fetch(`${visitedLugarRutaEndpoint}?ruta_id=${ruta.id}`, {
                method: 'GET',
                headers: { 'Authorization': `Token ${token}` },
            });
            if (!res.ok) continue;
            const visitados = await res.json();
            const idsVisitados = visitados.map(v => v.lugar.id);
            const completada = ruta.lugares.every(l => idsVisitados.includes(l.id));
            if (completada) completadas++;
        }
        return completadas;
    } catch {
        return 0;
    }
}
