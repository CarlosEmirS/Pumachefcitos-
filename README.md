# Pumachefcitos

Aplicación web para consultar y comparar opciones de comida dentro y alrededor de la Facultad de Ingeniería.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: PostgreSQL
- Autenticación: JWT
- Pruebas iniciales: Vitest + Supertest

## Funcionalidades incluidas en esta base
- Catálogo de establecimientos.
- Búsqueda por nombre o descripción.
- Filtros por zona, rango de precios y calificación mínima.
- Detalle de cada establecimiento con productos individuales.
- Registro e inicio de sesión para cualquier persona.
- Reseñas con calificación general, comida, precio y servicio.
- Rol `user` y rol `admin` preparado en la base de datos.
- 12 establecimientos ficticios para desarrollo.
- Diseño responsive de primera versión.

## Requisitos
- Node.js 20 o superior.
- npm.
- Docker Desktop recomendado para levantar PostgreSQL.

## 1. Levantar PostgreSQL
Desde la raíz del repositorio:

```bash
docker compose up -d
```

La base se crea en `localhost:5432` y ejecuta automáticamente:
- `database/schema.sql`
- `database/seed.sql`

## 2. Ejecutar el backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API: `http://localhost:3000`

Prueba rápida:
```text
GET http://localhost:3000/api/health
```

## 3. Ejecutar el frontend
En otra terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Aplicación: `http://localhost:5173`

## Pruebas
```bash
cd backend
npm test
```

## Organización del equipo
Consulta `docs/TEAM_WORKFLOW.md` para la propuesta de división del trabajo entre cuatro integrantes.

## Siguiente etapa
1. Sustituir datos ficticios por establecimientos reales.
2. Agregar mapa con Leaflet + OpenStreetMap.
3. Construir panel de administración.
4. Ampliar pruebas unitarias e integración.
