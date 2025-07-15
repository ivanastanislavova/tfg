import React, { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import axios from 'axios';

// 🔔 Manejo de notificaciones en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificacionProximidad() {
  const notifiedIds = useRef(new Set());
  const hasShownNoNearbyNotification = useRef(false);
  const [initialChecked, setInitialChecked] = useState(false);

  useEffect(() => {
    const getDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = x => (x * Math.PI) / 180;
      const R = 6371; // km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const checkNearby = async (isInitial = false) => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const response = await axios.get('http://192.168.1.44:8000/api/mujeres/');
        const lugares = [];

        response.data.results.forEach(mujer => {
          mujer.lugares?.forEach(lugar => {
            lugares.push({ ...lugar, mujer_nombre: mujer.nombre });
          });
        });

        let foundNearby = false;

        for (const lugar of lugares) {
          const dist = getDistance(latitude, longitude, lugar.latitud, lugar.longitud);
          if (dist !== null && dist <= 3 && !notifiedIds.current.has(lugar.id)) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: '¡Estás cerca de un lugar destacado!',
                body: `Te encuentras a ${dist.toFixed(2)} km de ${lugar.nombre} (${lugar.mujer_nombre})`,
              },
              trigger: null,
            });
            notifiedIds.current.add(lugar.id);
            foundNearby = true;
          }
        }

        if (isInitial && !foundNearby && !hasShownNoNearbyNotification.current) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Sin lugares cercanos',
              body: 'No hay lugares destacados cerca de tu ubicación.',
            },
            trigger: null,
          });
          hasShownNoNearbyNotification.current = true;
        }

      } catch (error) {
        console.log('Error comprobando lugares cercanos:', error);
      }
    };

    // Solo una vez al cargar el componente
    checkNearby(true).then(() => setInitialChecked(true));

    const interval = setInterval(() => {
      if (initialChecked) {
        checkNearby(false);
      }
    }, 60000); // cada minuto

    return () => clearInterval(interval);
  }, [initialChecked]);

  return null;
}
