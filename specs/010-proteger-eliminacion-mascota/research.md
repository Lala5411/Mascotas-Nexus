# Research: Proteger la eliminación de mascotas

## Hallazgo: el borrado con solicitudes ya fallaba

`Solicitud.mascota` está mapeada con `@JoinColumn(name = "mascota_id", nullable = false)` y sin
cascada. Por eso PostgreSQL rechaza borrar una mascota que tenga cualquier solicitud, y hoy
`DELETE /api/mascotas/{id}` termina en un error 500 en ese caso. La spec original solo hablaba de
solicitudes pendientes; en la clarificación se decidió responder 409 también con solicitudes
resueltas.

## Decisión 1: dónde vive la regla

- **Decisión**: en `MascotaService.eliminar`, inyectando `SolicitudRepository`.
- **Razón**: la constitución exige las reglas en los servicios (principio II).
- **Alternativas consideradas**: borrado en cascada de las solicitudes. Se descarta porque elimina el
  historial de adopciones. Borrado lógico (marcar la mascota como inactiva): se descarta por ahora;
  añade un estado y filtros en todo el catálogo.

## Decisión 2: dos mensajes de 409

- **Decisión**: un mensaje para solicitudes pendientes y otro para historial de solicitudes.
- **Razón**: la acción que debe tomar el administrador es distinta (responder las pendientes frente a
  conservar el historial).

## Decisión 3: mensaje en el panel

- **Decisión**: el panel muestra un mensaje fijo con el nombre de la mascota ante un 409.
- **Razón**: igual que en la spec 007, la API no expone el texto de sus errores y no se cambia esa
  configuración.
