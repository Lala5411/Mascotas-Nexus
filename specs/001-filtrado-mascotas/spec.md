# Spec 01: Filtrado dinámico de mascotas

## Objetivo

Permitir que los adoptantes consulten mascotas disponibles por especie, edad máxima o ambos criterios.

## Criterios de aceptación

1. `GET /api/mascotas/filtrar` acepta `especie` y `edadMaxima` como parámetros opcionales.
2. Solo devuelve mascotas `DISPONIBLE`; la especie se compara sin distinguir mayúsculas y la edad máxima es inclusiva.
3. Una especie vacía o con espacios se trata como filtro ausente.
4. Una edad máxima negativa devuelve `400 Bad Request`; una consulta válida devuelve `200 OK`, incluso si no hay resultados.
5. La respuesta usa un DTO con `id`, `nombre`, `especie`, `edad`, `estado` e `imagenUrl`.
6. El listado general y el listado de disponibles conservan su comportamiento.

## Pruebas

- Repositorio: estado, especie, edad inclusiva y combinación/omisión de filtros.
- Servicio: normalización de especie y mapeo de entidad a DTO.
- Controlador: respuestas `200` y `400`, filtros opcionales y lista vacía.
