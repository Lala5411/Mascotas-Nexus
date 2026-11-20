# Research: Ordenar el catálogo

## Decisión 1: ordenar en el frontend

- **Decisión**: ordenar en memoria dentro del `useMemo` de `Catalogo.js`.
- **Razón**: la spec exige no hacer peticiones nuevas y el catálogo ya tiene nombre y edad.
- **Alternativas consideradas**: un parámetro `orden` en `/api/mascotas/filtrar`. Se descarta: añade
  backend y peticiones sin necesidad.

## Decisión 2: comparación de nombres

- **Decisión**: `a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })`.
- **Razón**: ignora mayúsculas y tildes, como lo esperaría una persona en español.

## Decisión 3: no mutar el estado

- **Decisión**: ordenar una copia (`[...lista].sort(...)`).
- **Razón**: `sort` modifica el arreglo; mutar el estado de React rompería el orden original.
