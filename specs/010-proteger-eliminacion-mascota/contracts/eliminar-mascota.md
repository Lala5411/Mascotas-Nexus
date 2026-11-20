# Contrato: eliminar una mascota

`DELETE /api/mascotas/{id}` (sin cambios de ruta)

| Caso | Respuesta |
| --- | --- |
| La mascota existe y no tiene solicitudes | `204 No Content` y se elimina |
| La mascota no existe | `404 Not Found` |
| La mascota tiene solicitudes PENDIENTE | `409 Conflict` y no se elimina |
| La mascota solo tiene solicitudes resueltas | `409 Conflict` y no se elimina |
