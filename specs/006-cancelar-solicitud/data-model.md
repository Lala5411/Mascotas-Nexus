# Data Model: Cancelar una solicitud de adopción pendiente

## Solicitud (entidad existente, `model/Solicitud.java`)

| Campo | Cambio |
| --- | --- |
| `estado` | Admite un valor nuevo: `CANCELADA`. Sigue siendo texto; no requiere migración. |

## Transiciones de estado

```text
PENDIENTE --(adoptante dueño cancela)--> CANCELADA
PENDIENTE --(administrador aprueba)----> APROBADA
PENDIENTE --(administrador rechaza)----> RECHAZADA
CANCELADA, APROBADA, RECHAZADA: estados finales (cualquier transición responde 409)
```

## Respuesta

Se reutiliza `SolicitudResponse` (`id`, `mascotaId`, `mascotaNombre`, `mensaje`, `estado`,
`tipoVivienda`, `horasLibres`, `nivelActividad`).
