# División de trabajo sugerida

El equipo es de cuatro integrantes. La estructura del repositorio permite que cada persona tenga un área principal sin aislarse del resto.

## Integrante 1 — Frontend
Carpetas principales:
- `frontend/src/components`
- `frontend/src/styles.css`
- `frontend/src/App.jsx`

Responsabilidades:
- Diseño visual.
- Componentes React.
- Responsive design.
- Integración de mapa en una iteración posterior.

## Integrante 2 — Backend
Carpetas principales:
- `backend/src/routes`
- `backend/src/middleware`
- `backend/src/config`

Responsabilidades:
- API REST.
- Autenticación.
- Validación.
- Reglas de negocio.
- Futuras rutas administrativas.

## Integrante 3 — Base de datos
Carpeta principal:
- `database`

Responsabilidades:
- Modelo relacional.
- Scripts SQL.
- Datos reales cuando se levante la información de los locales.
- Índices y optimización de consultas.

## Integrante 4 — Pruebas e integración
Carpetas principales:
- `backend/tests`
- futura carpeta de pruebas de frontend
- documentación técnica

Responsabilidades:
- Pruebas unitarias e integración.
- Verificar que frontend, API y PostgreSQL funcionen juntos.
- Revisar Pull Requests.
- Mantener documentación de ejecución.

## Flujo recomendado con Git
Nunca desarrollar directamente sobre `main`.

Ejemplo:

```bash
git checkout main
git pull
git checkout -b feature/filtro-precio
```

Después:
1. Hacer cambios pequeños y entendibles.
2. Ejecutar pruebas.
3. Hacer commit.
4. Subir la rama.
5. Abrir Pull Request hacia `main`.
6. Otro integrante revisa antes de hacer merge.

Convenciones de ramas:
- `feature/...`
- `fix/...`
- `test/...`
- `docs/...`
