---
name: adoption-flow-validation
description: Valida los formularios de solicitud de adopción, su persistencia, las transiciones de estado y los resultados que ve el solicitante en Mascota Nexus.
---

# Validación del flujo de adopción

Usa esta skill al cambiar los datos de la solicitud, las reglas de envío, el historial de solicitudes o las decisiones del administrador.

1. Mantén las invariantes de la solicitud en `SolicitudService`; valida en el servidor los campos obligatorios, los valores permitidos, la disponibilidad y las solicitudes pendientes duplicadas.
2. Define las nuevas formas de respuesta de la API en DTOs y verifica los datos guardados mediante el endpoint de lectura correspondiente.
3. En las pruebas de React, simula Axios y comprueba lo que puede ver el adoptante o el administrador, incluidos los mensajes de carga y de error.
4. En las pruebas de Playwright, usa usuarios y mascotas únicos, verifica en el historial del adoptante el resultado de la aprobación y del rechazo, y limpia solo la base de datos aislada de E2E.
5. Ejecuta `.\mvnw.cmd test` desde `backend/`, y luego `npm test -- --watchAll=false` y `npm run build` desde `frontend/`.
6. Cuando cambie el flujo en el navegador o el contrato de la API, ejecuta `npm run test:e2e` desde `frontend/` e informa explícitamente si alguna infraestructura de pruebas no está disponible.
