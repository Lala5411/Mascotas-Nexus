# Data Model: Proteger la eliminación de mascotas

Sin cambios de esquema.

## Relación existente

`Solicitud.mascota` → `Mascota` (`mascota_id`, obligatorio, sin cascada).

## Consultas nuevas en `SolicitudRepository`

| Consulta | Uso |
| --- | --- |
| `existsByMascotaIdAndEstado(Long mascotaId, String estado)` | ¿Tiene solicitudes PENDIENTE? |
| `existsByMascotaId(Long mascotaId)` | ¿Tiene alguna solicitud? |
