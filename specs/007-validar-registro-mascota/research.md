# Research: Validar el registro de mascotas

## Decisión 1: dónde validar

- **Decisión**: validación manual en `MascotaService.guardar` con `ResponseStatusException` 400.
- **Razón**: es el mismo patrón de `SolicitudService` (spec 004) y la constitución pide las reglas en
  los servicios (principio II) sin dependencias nuevas (principio I).
- **Alternativas consideradas**: Bean Validation (`@NotBlank`, `@Size`) sobre la entidad. Se descarta
  porque la entidad se usa también como cuerpo de la petición y añadiría una dependencia y un
  manejador de errores nuevo.

## Decisión 2: mensaje en el panel

- **Decisión**: ante un 400, el panel muestra un mensaje fijo con las reglas válidas.
- **Razón**: Spring no incluye el texto del error en la respuesta salvo que se active
  `server.error.include-message`; cambiar esa configuración afecta a toda la API y excede la spec.
- **Alternativas consideradas**: activar `server.error.include-message=always`. Queda como mejora
  futura.

## Decisión 3: límites

- **Decisión**: nombre de 1 a 60 caracteres tras recortar; edad entera de 0 a 30.
- **Razón**: los nombres de las pruebas E2E (`Perro Rechazado E2E <sufijo>`) miden menos de 45
  caracteres, así que el límite no rompe los datos existentes de las pruebas.
