# Contrato: resumen de solicitudes

`GET /api/solicitudes/resumen`

Respuesta `200 OK`:

```json
{
  "pendientes": 3,
  "aprobadas": 1,
  "rechazadas": 2,
  "canceladas": 0,
  "total": 6
}
```

Sin solicitudes, todos los campos son `0`.
