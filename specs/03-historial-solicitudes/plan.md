# Plan: Historial personal de postulaciones

1. Añadir el ID del usuario al DTO de autenticación.
2. Exponer una consulta de solicitudes por usuario y mapear el resultado a un DTO.
3. Guardar el ID retornado al iniciar sesión y usarlo al crear una solicitud y consultar el historial.
4. Verificar los casos del servicio, controlador, autenticación e interfaz.

## Archivos

- Backend: `AuthResponse`, `AuthService`, `SolicitudController`, `SolicitudService`, `SolicitudResponse`.
- Frontend: `Login.js`, `Catalogo.js`.
- Pruebas: `AuthServiceTest`, `SolicitudControllerTest`, `SolicitudServiceTest`, `Login.test.js`, `Catalogo.test.js`.
