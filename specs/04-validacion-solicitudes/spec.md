# Spec 04: Validación de solicitudes de adopción

## Objetivo

Rechazar solicitudes incompletas, duplicadas o dirigidas a una mascota que ya no está disponible.

## Criterios de aceptación

1. Se requiere un usuario existente, una mascota existente y un mensaje no vacío.
2. El mensaje se recorta antes de guardar y el estado inicial siempre es `PENDIENTE`.
3. Solo se puede crear una solicitud pendiente por usuario y mascota.
4. Una mascota no disponible produce `409 Conflict`; una referencia inexistente produce `404`; datos incompletos producen `400`.
5. Las solicitudes rechazadas no se guardan.

## Pruebas

- Casos de éxito, mensaje vacío, usuario inexistente, mascota no disponible y solicitud pendiente duplicada en servicio.
