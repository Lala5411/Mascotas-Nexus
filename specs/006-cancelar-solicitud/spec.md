# Feature Specification: Cancelar una solicitud de adopción pendiente

**Feature Branch**: `006-cancelar-solicitud`

**Created**: 2026-11-19

**Status**: Draft

**Input**: User description: "Como adoptante autenticado de Mascota Nexus, quiero cancelar desde mi historial de postulaciones una solicitud de adopción mía que siga en estado PENDIENTE, para retirarla si cambio de opinión. Al cancelarla pasa a estado CANCELADA y ya no se puede aprobar ni rechazar. No se puede cancelar una solicitud inexistente (404), una de otro usuario (403) ni una que ya no esté PENDIENTE (409), y en esos casos no se guarda ningún cambio. En el historial, el botón Cancelar solo aparece en las solicitudes pendientes y, tras cancelar, se ve el nuevo estado sin recargar la página."

## Clarifications

### Session 2026-11-19

- Q: ¿Cómo sabe el sistema quién pide la cancelación? → A: La petición incluye el identificador del adoptante autenticado; si no coincide con el dueño de la solicitud, se rechaza con 403. Es el mismo mecanismo de identidad que ya usa el historial.
- Q: ¿Se pide confirmación antes de cancelar? → A: No. La acción solo existe para solicitudes pendientes y su resultado se ve de inmediato; se mantiene la opción más simple.
- Q: ¿Una solicitud cancelada se puede reactivar? → A: No. Para volver a intentarlo, el adoptante envía una solicitud nueva.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cancelar una solicitud pendiente propia (Priority: P1)

El adoptante abre la pestaña «Mis Postulaciones», ve una solicitud en estado PENDIENTE y la cancela. La solicitud pasa a CANCELADA y el refugio ya no puede aprobarla ni rechazarla.

**Why this priority**: es el valor central de la funcionalidad: permite al adoptante retirar una postulación que ya no le interesa.

**Independent Test**: se crea una solicitud pendiente de un adoptante, se cancela con su identificador y se comprueba que queda en CANCELADA y que ya no admite aprobación.

**Acceptance Scenarios**:

1. **Given** una solicitud PENDIENTE del adoptante 3, **When** el adoptante 3 la cancela, **Then** la solicitud queda en estado CANCELADA y la respuesta muestra el nuevo estado.
2. **Given** una solicitud CANCELADA, **When** el administrador intenta aprobarla o rechazarla, **Then** el sistema responde 409 y la solicitud sigue CANCELADA.

---

### User Story 2 - Rechazar cancelaciones no permitidas (Priority: P1)

El sistema impide cancelar solicitudes que no existen, que pertenecen a otro adoptante o que ya no están pendientes, sin cambiar nada.

**Why this priority**: sin estas reglas un adoptante podría alterar solicitudes ajenas o decisiones ya tomadas por el refugio.

**Independent Test**: se intenta cancelar cada caso no permitido y se comprueba el código de respuesta y que no se guarda ningún cambio.

**Acceptance Scenarios**:

1. **Given** que no existe la solicitud 404, **When** se intenta cancelarla, **Then** el sistema responde 404.
2. **Given** una solicitud PENDIENTE del adoptante 3, **When** el adoptante 9 intenta cancelarla, **Then** el sistema responde 403 y la solicitud sigue PENDIENTE.
3. **Given** una solicitud APROBADA o RECHAZADA, **When** su dueño intenta cancelarla, **Then** el sistema responde 409 y la solicitud no cambia.
4. **Given** una petición de cancelación sin identificador de adoptante, **When** se envía, **Then** el sistema responde 400.

---

### User Story 3 - Cancelar desde el historial (Priority: P2)

En el historial, el botón «Cancelar» aparece solo en las solicitudes pendientes. Al pulsarlo, la fila muestra el estado CANCELADA sin recargar la página; si falla, se muestra un mensaje de error.

**Why this priority**: es la forma en que el adoptante usa la funcionalidad, pero depende de que la regla del servidor exista.

**Independent Test**: se renderiza el historial con una solicitud pendiente y una aprobada, se pulsa «Cancelar» y se comprueba el nuevo estado y la ausencia del botón en la aprobada.

**Acceptance Scenarios**:

1. **Given** un historial con una solicitud PENDIENTE y otra APROBADA, **When** el adoptante abre «Mis Postulaciones», **Then** solo la pendiente muestra el botón «Cancelar».
2. **Given** una solicitud PENDIENTE en el historial, **When** el adoptante pulsa «Cancelar», **Then** la fila muestra CANCELADA y el botón desaparece, sin recargar la página.
3. **Given** que el servidor rechaza la cancelación, **When** el adoptante pulsa «Cancelar», **Then** se muestra un mensaje de error y la solicitud sigue como estaba.

---

### Edge Cases

- ¿Qué pasa si el adoptante pulsa «Cancelar» dos veces seguidas? La segunda petición llega con la solicitud ya CANCELADA y el servidor responde 409; la pantalla no cambia el estado ya mostrado.
- ¿Qué pasa si el refugio aprueba la solicitud justo antes de la cancelación? El servidor responde 409 y el historial muestra el mensaje de error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir que el dueño de una solicitud en estado PENDIENTE la cancele, dejándola en estado CANCELADA.
- **FR-002**: El sistema DEBE responder 404 cuando la solicitud a cancelar no existe.
- **FR-003**: El sistema DEBE responder 403 cuando quien cancela no es el dueño de la solicitud.
- **FR-004**: El sistema DEBE responder 409 cuando la solicitud no está en estado PENDIENTE.
- **FR-005**: El sistema DEBE responder 400 cuando la petición no identifica al adoptante.
- **FR-006**: El sistema NO DEBE guardar ningún cambio cuando rechaza una cancelación.
- **FR-007**: Una solicitud CANCELADA NO DEBE poder aprobarse ni rechazarse.
- **FR-008**: El historial DEBE mostrar el botón «Cancelar» solo en las solicitudes PENDIENTE, con un nombre accesible que identifique la mascota.
- **FR-009**: Tras una cancelación exitosa, el historial DEBE mostrar el estado CANCELADA sin recargar la página.
- **FR-010**: Si la cancelación falla, el historial DEBE mostrar un mensaje de error accesible.

### Key Entities

- **Solicitud de adopción**: postulación de un adoptante a una mascota. Se añade el estado CANCELADA a los existentes (PENDIENTE, APROBADA y RECHAZADA).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un adoptante puede cancelar una solicitud pendiente en un solo paso desde su historial.
- **SC-002**: El 100 % de los intentos de cancelar una solicitud ajena, inexistente o ya resuelta se rechazan sin modificar datos.
- **SC-003**: El nuevo estado se ve en el historial inmediatamente después de cancelar, sin recargar.

## Assumptions

- La identidad del adoptante se toma del identificador guardado al iniciar sesión, igual que en el historial actual (spec 003).
- Una solicitud cancelada no se elimina: queda en el historial con su nuevo estado.
- La cancelación no cambia el estado de la mascota, que sigue DISPONIBLE.
