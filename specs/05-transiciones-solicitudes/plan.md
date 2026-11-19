# Plan: Transiciones válidas de solicitudes

1. Validar que la decisión solicitada sea `APROBADA` o `RECHAZADA`.
2. Exigir que la solicitud exista y permanezca `PENDIENTE`.
3. En aprobación, comprobar que la mascota siga disponible y guardar su estado `ADOPTADO`.
4. Guardar la decisión en la misma transacción del servicio.
5. Verificar decisiones válidas e inválidas y estados incompatibles.

## Archivos

- Backend: `SolicitudService`.
- Pruebas: `SolicitudServiceStateTest`.
