# tfg
Implementación de la aplicación Dona'm Món

Para desplegar el Backend:
- Levantar la bd:
docker-compose up

- Levantar django:
docker-compose up web

Para desplegar el Frontend:
- cd my-app y allí: npx expo start

Otros:
- docker-compose down -v  # Detiene y borra volúmenes (asegura limpiar DB mal configurada)
- docker-compose build    # Vuelve a construir la imagen
