# Arquitectura de Pumachefcitos

## Objetivo del MVP
Centralizar información de opciones gastronómicas para que un usuario pueda comparar rápidamente establecimientos, precios, ubicación dentro de la Facultad y opiniones de otros usuarios.

## Arquitectura general
Pumachefcitos usa una arquitectura cliente-servidor:

```text
React + Vite
     |
     | HTTP / JSON
     v
Node.js + Express
     |
     | SQL
     v
PostgreSQL
```

## Frontend
Responsabilidades:
- Presentar catálogo y detalle de establecimientos.
- Gestionar filtros y búsqueda.
- Mostrar productos y reseñas.
- Registrar e iniciar sesión.
- Enviar reseñas autenticadas.

No contiene reglas de persistencia ni acceso directo a PostgreSQL.

## Backend
Responsabilidades:
- Exponer la API REST bajo `/api`.
- Validar datos recibidos.
- Autenticar usuarios con JWT.
- Ejecutar consultas seguras usando parámetros SQL.
- Centralizar reglas de negocio.

Rutas iniciales:
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/places`
- `GET /api/places/:id`
- `POST /api/reviews`

## Base de datos
Entidades iniciales:
- `users`
- `places`
- `products`
- `reviews`

Una reseña pertenece a un usuario y un establecimiento. Un usuario tiene una sola reseña activa por establecimiento; si vuelve a publicar, la reseña se actualiza.

## Roles
- `user`: consulta información y publica reseñas.
- `admin`: preparado para el futuro panel administrativo.

## Decisiones pendientes para siguientes iteraciones
- Mapa con Leaflet + OpenStreetMap.
- CRUD administrativo de establecimientos y productos.
- Moderación de reseñas.
- Carga de imágenes propia.
- Recuperación de contraseña.
