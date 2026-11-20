# Contrato: cancelar una solicitud

`PUT /api/solicitudes/{id}/cancelar?usuarioId={usuarioId}`

| Caso | Respuesta |
| --- | --- |
| La solicitud existe, es del usuario y está PENDIENTE | `200 OK` con `SolicitudResponse` y `estado: "CANCELADA"` |
| Falta `usuarioId` | `400 Bad Request` |
| La solicitud no existe | `404 Not Found` |
| La solicitud es de otro usuario | `403 Forbidden` |
| La solicitud no está PENDIENTE | `409 Conflict` |

En todos los casos de error no se guarda ningún cambio.

Ejemplo de respuesta 200:

```json
{
  "id": 21,
  "mascotaId": 7,
  "mascotaNombre": "Luna",
  "mensaje": "Quiero adoptar",
  "estado": "CANCELADA",
  "tipoVivienda": "CASA",
  "horasLibres": 6,
  "nivelActividad": "ALTO"
}
```
