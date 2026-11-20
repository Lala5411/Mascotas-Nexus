# Spec 04: Validación de solicitudes de adopción

## Objetivo

Rechazar solicitudes incompletas, duplicadas o dirigidas a una mascota que ya no está disponible.

## Criterios de aceptación

1. Se requiere un usuario existente, una mascota existente y un mensaje no vacío de hasta 2000 caracteres.
2. Se requiere un tipo de vivienda `CASA` o `APARTAMENTO`, entre 1 y 12 horas libres y un nivel de actividad `BAJO`, `MEDIO` o `ALTO`.
3. El mensaje se recorta, los valores de vivienda y actividad se guardan en mayúsculas y el estado inicial siempre es `PENDIENTE`.
4. Solo se puede crear una solicitud pendiente por usuario y mascota.
5. Una mascota no disponible o una solicitud pendiente duplicada produce `409 Conflict`; una referencia inexistente produce `404`; datos incompletos, fuera de rango o un mensaje demasiado largo producen `400 Bad Request` en el borde HTTP.
6. Las solicitudes rechazadas no se guardan.

## Pruebas

- Casos de éxito, mensaje vacío o demasiado largo, datos del hogar fuera de rango, usuario o mascota inexistentes, mascota no disponible y solicitud pendiente duplicada en servicio.
- Pruebas HTTP para mascota inexistente y datos incompletos.
