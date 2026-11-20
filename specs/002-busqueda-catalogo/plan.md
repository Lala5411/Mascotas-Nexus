# Plan: Búsqueda y filtro de especie en el catálogo

1. Mantener el estado de búsqueda, especie seleccionada, catálogo inicial, resultados y estados de carga/error en `Catalogo.js`.
2. Cargar las especies únicas desde `/api/mascotas/disponibles`.
3. Consultar `/api/mascotas/filtrar` al seleccionar una especie y restaurar el catálogo inicial al seleccionar «Todas las especies».
4. Aplicar localmente la búsqueda por nombre, sin una petición por cada tecla.
5. Ignorar resultados de peticiones que ya no correspondan a la selección actual.
6. Añadir controles accesibles y mensajes para carga, error y resultados vacíos.
7. Verificar con `npm test -- --watchAll=false` y `npm run build` desde `frontend/`.

## Archivos

- Frontend: `frontend/src/components/Catalogo.js`.
- Pruebas: `frontend/src/components/Catalogo.test.js`.

La implementación consume el endpoint de filtrado de la spec 01.
