# Plan: Validación de solicitudes de adopción

1. Validar campos y mensaje en `SolicitudService`.
2. Resolver usuario y mascota desde sus repositorios para no persistir referencias arbitrarias.
3. Comprobar disponibilidad y solicitudes pendientes duplicadas antes de guardar.
4. Normalizar el texto y definir el estado inicial en el servidor.
5. Verificar los códigos de error y el comportamiento con pruebas de servicio.

## Archivos

- Backend: `SolicitudService`, `SolicitudRepository`.
- Pruebas: `SolicitudServiceValidationTest`.
