# Research: Resumen de solicitudes para el administrador

## Decisión 1: cómo contar

- **Decisión**: una consulta derivada `countByEstado(String estado)` por cada estado.
- **Razón**: es la opción más simple con Spring Data JPA (principio I) y los conteos son pocos.
- **Alternativas consideradas**: una consulta JPQL con `GROUP BY`. Se descarta: devolvería solo los
  estados con solicitudes y habría que completar los ceros a mano.

## Decisión 2: forma de la respuesta

- **Decisión**: un DTO con un campo por estado y el total.
- **Razón**: la constitución exige DTOs en las respuestas nuevas y un objeto con nombres fijos es más
  fácil de probar y de leer en el frontend que un mapa.

## Decisión 3: ruta

- **Decisión**: `GET /api/solicitudes/resumen`.
- **Razón**: no choca con las rutas existentes (`/usuario/{id}`, `/{id}/estado`, `/{id}/cancelar`).
