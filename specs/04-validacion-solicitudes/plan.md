# Plan: Validación de solicitudes de adopción

1. Antes de consultar repositorios, validar usuario y mascota con ID, mensaje no vacío de hasta 2000 caracteres, vivienda `CASA`/`APARTAMENTO`, horas libres entre 1 y 12 y actividad `BAJO`/`MEDIO`/`ALTO`; datos inválidos producen `400`.
2. Resolver el usuario y la mascota desde sus repositorios; una referencia inexistente produce `404`.
3. Comprobar que la mascota esté `DISPONIBLE` y que no exista otra solicitud `PENDIENTE` para el mismo usuario y mascota; si falla alguna condición, producir `409`.
4. Reemplazar las referencias recibidas por las entidades recuperadas, recortar el mensaje, guardar vivienda y actividad en mayúsculas e imponer el estado inicial `PENDIENTE`.
5. Guardar solo después de superar las validaciones, dentro de la transacción del servicio.
6. Verificar reglas, persistencia y códigos HTTP con pruebas de servicio y de controlador.

## Archivos

- Backend: `SolicitudService`, `SolicitudRepository`, `MascotaRepository`, `UsuarioRepository` y `SolicitudController`.
- Pruebas: `SolicitudServiceValidationTest` y pruebas HTTP de `SolicitudController`.
