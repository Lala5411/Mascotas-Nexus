# Spec 03: Historial personal de postulaciones

## Objetivo

Permitir que cada usuario autenticado vea sus propias postulaciones y que las nuevas solicitudes se asocien con su identidad, sin usar identificadores fijos en el frontend.

## Criterios de aceptación

1. La respuesta de inicio de sesión incluye el identificador de usuario.
2. El frontend conserva ese identificador y lo usa al enviar una solicitud de adopción.
3. El endpoint `GET /api/solicitudes/usuario/{usuarioId}` devuelve solo las postulaciones de ese usuario, como DTO y no como entidades JPA.
4. Un identificador inexistente produce `404`; un usuario sin postulaciones recibe una lista vacía.
5. El catálogo carga y actualiza el historial consultando el endpoint del usuario actual.

## Pruebas

- Unitarias del servicio para la consulta por usuario y el mapeo DTO.
- De controlador para la respuesta de la ruta del historial.
- De autenticación y componente para conservar y enviar el identificador correcto.
