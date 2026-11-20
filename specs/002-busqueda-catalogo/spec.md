# Spec 02: Búsqueda y filtro de especie en el catálogo

## Objetivo

Ayudar a los adoptantes a encontrar mascotas disponibles mediante búsqueda por nombre y selección de especie.

## Criterios de aceptación

1. El catálogo carga las mascotas disponibles y obtiene de ellas las especies únicas para el selector.
2. La búsqueda por nombre es local, inmediata y no distingue mayúsculas/minúsculas.
3. El selector ofrece «Todas las especies» y filtra por especie mediante `GET /api/mascotas/filtrar`.
4. La búsqueda por nombre se combina con la especie seleccionada; al volver a «Todas las especies» se restaura la lista inicial.
5. Una respuesta tardía de un filtro anterior no reemplaza los resultados de la selección actual.
6. Se presentan estados de carga, error y ausencia de coincidencias sin interferir con la pestaña de postulaciones.
7. Los controles tienen etiquetas accesibles y distribución adaptable a móvil.

## Pruebas

- React Testing Library: controles, opciones únicas, búsqueda insensible a mayúsculas, combinación de filtros, selección de todas las especies y respuesta asíncrona obsoleta.
- Verificar estados de carga, error y sin resultados.
