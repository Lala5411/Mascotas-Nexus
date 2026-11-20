# Research: Cancelar una solicitud de adopción pendiente

## Decisión 1: identidad de quien cancela

- **Decisión**: el identificador del adoptante viaja como parámetro `usuarioId` de la petición.
- **Razón**: es el mecanismo que ya usa el historial (`GET /api/solicitudes/usuario/{usuarioId}`) y
  el frontend lo tiene en la sesión. La constitución (principio VII) prohíbe cambiar la autenticación
  en esta spec.
- **Alternativas consideradas**: leer el usuario del token JWT. Se descarta porque los endpoints de
  solicitudes no usan hoy el token y cambiarlo excede el alcance.

## Decisión 2: verbo y ruta

- **Decisión**: `PUT /api/solicitudes/{id}/cancelar`.
- **Razón**: sigue el estilo del endpoint existente `PUT /api/solicitudes/{id}/estado`; cancelar es
  una transición de estado, no un borrado.
- **Alternativas consideradas**: reutilizar `/estado?estado=CANCELADA`. Se descarta porque ese
  endpoint es del administrador y no verifica la propiedad de la solicitud.

## Decisión 3: impedir aprobar una cancelada

- **Decisión**: no se cambia `cambiarEstado`.
- **Razón**: ya responde 409 si la solicitud no está PENDIENTE (spec 005), lo que cubre CANCELADA.
  Se añade una prueba para dejarlo comprobado.
