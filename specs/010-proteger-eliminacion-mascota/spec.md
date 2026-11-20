# Feature Specification: Proteger la eliminación de mascotas

**Feature Branch**: `010-proteger-eliminacion-mascota`

**Created**: 2026-11-19

**Status**: Draft

**Input**: User description: "Como administrador de Mascota Nexus, no quiero poder eliminar una mascota que tenga solicitudes de adopción en estado PENDIENTE, para no dejar a adoptantes esperando una respuesta sobre una mascota que ya no existe. Si la mascota tiene solicitudes pendientes, la API responde 409 con un mensaje claro y no borra nada; si la mascota no existe, responde 404; si no tiene solicitudes pendientes, se elimina como hasta ahora. En el panel del administrador se muestra el mensaje del error en lugar de fallar en silencio."

## Clarifications

### Session 2026-11-19

- Q: ¿Qué pasa con una mascota que solo tiene solicitudes ya resueltas (aprobadas, rechazadas o canceladas)? → A: Tampoco se elimina y se responde 409. Al revisar el modelo, cada solicitud exige su mascota (`mascota_id` no admite nulos y no hay borrado en cascada), así que hoy ese borrado ya falla con un error 500 de la base de datos. Responder 409 convierte ese fallo en un mensaje claro y conserva el historial de adopciones.
- Q: ¿Se pide confirmación antes de eliminar? → A: No; el comportamiento del botón no cambia, solo se protege el caso con solicitudes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Bloquear la eliminación con solicitudes (Priority: P1)

El sistema no elimina una mascota que tiene solicitudes asociadas y explica por qué.

**Why this priority**: evita dejar adoptantes sin respuesta y errores 500 de la base de datos.

**Independent Test**: se intenta eliminar una mascota con solicitudes pendientes y otra con solicitudes resueltas, y se comprueba el 409 y que no se borra nada.

**Acceptance Scenarios**:

1. **Given** una mascota con una solicitud PENDIENTE, **When** el administrador la elimina, **Then** el sistema responde 409 y la mascota sigue registrada.
2. **Given** una mascota solo con solicitudes resueltas, **When** el administrador la elimina, **Then** el sistema responde 409 y la mascota sigue registrada.
3. **Given** que la mascota no existe, **When** se intenta eliminarla, **Then** el sistema responde 404.
4. **Given** una mascota sin solicitudes, **When** el administrador la elimina, **Then** se elimina y el sistema responde 204.

---

### User Story 2 - Mensaje en el panel (Priority: P2)

Si la eliminación es rechazada, el panel muestra un mensaje accesible con el nombre de la mascota.

**Why this priority**: hoy el panel no avisa cuando el borrado falla.

**Independent Test**: se simula un 409 al eliminar y se comprueba el mensaje.

**Acceptance Scenarios**:

1. **Given** que el servidor responde 409, **When** el administrador pulsa «Eliminar» en Luna, **Then** ve «No se puede eliminar a Luna porque tiene solicitudes de adopción asociadas.» y Luna sigue en la lista.
2. **Given** que el servidor responde 204, **When** pulsa «Eliminar», **Then** la lista se vuelve a cargar sin mensajes de error.

---

### Edge Cases

- Si la mascota fue eliminada por otra persona antes de pulsar «Eliminar», el servidor responde 404 y el panel recarga la lista con un aviso.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE responder 409 y no eliminar una mascota con solicitudes PENDIENTE.
- **FR-002**: El sistema DEBE responder 409 y no eliminar una mascota con solicitudes resueltas.
- **FR-003**: El sistema DEBE responder 404 cuando la mascota no existe.
- **FR-004**: El sistema DEBE eliminar una mascota sin solicitudes y responder 204.
- **FR-005**: El panel DEBE mostrar un mensaje de error accesible con el nombre de la mascota cuando la eliminación es rechazada.
- **FR-006**: El panel DEBE volver a cargar la lista tras una eliminación exitosa o un 404.

### Key Entities

- **Mascota** y **Solicitud de adopción**: una solicitud siempre pertenece a una mascota; esta spec impide borrar mascotas con solicitudes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ninguna eliminación de una mascota con solicitudes termina en un error 500.
- **SC-002**: El administrador entiende por qué una mascota no se pudo eliminar sin consultar a soporte.

## Assumptions

- Las mascotas con solicitudes se conservan como parte del historial de adopciones.
- El estado de la mascota (DISPONIBLE o ADOPTADO) no cambia al rechazar la eliminación.
