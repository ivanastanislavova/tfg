import React, { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import axios from 'axios';

// Este componente no renderiza nada, solo ejecuta la lógica de notificación en background
const NotificacionProximidad = () => {
  const notifiedIds = useRef(new Set());

  useEffect(() => {
    let interval;
    const checkNearby = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const response = await axios.get('http://192.168.1.132:8000/api/mujeres/');
        let lugares = [];
        response.data.forEach(mujer => {
          if (mujer.lugares && Array.isArray(mujer.lugares)) {
            mujer.lugares.forEach(lugar => {
              lugares.push({ ...lugar, mujer_nombre: mujer.nombre });
            });
          }
        });
        const getDistance = (lat1, lon1, lat2, lon2) => {
          if (!lat1 || !lon1 || !lat2 || !lon2) return null;
          const toRad = x => x * Math.PI / 180;
          const R = 6371;
          const dLat = toRad(lat2 - lat1);
          const dLon = toRad(lon2 - lon1);
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };
        lugares.forEach(lugar => {
          const dist = getDistance(latitude, longitude, lugar.latitud, lugar.longitud);
          if (dist !== null && dist <= 3 && !notifiedIds.current.has(lugar.id)) {
            Notifications.scheduleNotificationAsync({
              content: {
                title: '¡Estás cerca de un lugar destacado!',
                body: `Te encuentras a ${dist.toFixed(2)} km de ${lugar.nombre} (${lugar.mujer_nombre})`,
              },
              trigger: null,
            });
            notifiedIds.current.add(lugar.id);
          }
        });
      } catch (e) {}
    };
    interval = setInterval(checkNearby, 60000); // cada 60 segundos
    return () => clearInterval(interval);
  }, []);
  return null;
};

export default NotificacionProximidad;
