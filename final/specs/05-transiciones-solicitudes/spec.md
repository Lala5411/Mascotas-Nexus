# Spec 05: Transiciones válidas de solicitudes

## Objetivo

Evitar que una solicitud de adopción se procese con estados arbitrarios, más de una vez o cuando la mascota ya fue adoptada.

## Criterios de aceptación

1. Solo se permiten las decisiones `APROBADA` y `RECHAZADA`.
2. Solo se pueden procesar solicitudes con estado `PENDIENTE`.
3. Aprobar cambia la solicitud a `APROBADA` y la mascota disponible a `ADOPTADO` dentro de una transacción.
4. Rechazar cambia la solicitud a `RECHAZADA` sin cambiar el estado de la mascota.
5. Solicitud inexistente produce `404`, decisión inválida `400` y transición incompatible `409`.

## Pruebas

- Pruebas de servicio para aprobación, rechazo, decisión inválida, repetición y mascota previamente adoptada.
