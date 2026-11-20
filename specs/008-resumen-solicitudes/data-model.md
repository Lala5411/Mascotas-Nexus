# Data Model: Resumen de solicitudes para el administrador

## ResumenSolicitudesResponse (DTO nuevo, no persistido)

| Campo | Tipo | Significado |
| --- | --- | --- |
| `pendientes` | número | Solicitudes en estado PENDIENTE |
| `aprobadas` | número | Solicitudes en estado APROBADA |
| `rechazadas` | número | Solicitudes en estado RECHAZADA |
| `canceladas` | número | Solicitudes en estado CANCELADA |
| `total` | número | Suma de los cuatro conteos |

Se calcula a partir de la entidad `Solicitud` existente; no hay cambios de esquema.
