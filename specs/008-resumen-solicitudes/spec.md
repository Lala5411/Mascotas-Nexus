# Feature Specification: Resumen de solicitudes para el administrador

**Feature Branch**: `008-resumen-solicitudes`

**Created**: 2026-11-19

**Status**: Draft

**Input**: User description: "Como administrador de Mascota Nexus, quiero ver en mi panel un resumen con cuántas solicitudes de adopción hay en cada estado (PENDIENTE, APROBADA, RECHAZADA y CANCELADA), para saber de un vistazo cuántas me faltan por revisar. El resumen se obtiene de un endpoint de lectura que devuelve un conteo por estado, incluyendo los estados con cero solicitudes. El panel muestra el resumen con estados de carga y de error, y lo actualiza después de aprobar o rechazar una solicitud."

## Clarifications

### Session 2026-11-19

- Q: ¿El resumen incluye un total? → A: Sí, el total de solicitudes, además del conteo por estado.
- Q: ¿Se actualiza solo o con un botón? → A: Se carga al abrir el panel y se vuelve a cargar después de aprobar o rechazar; no hace falta un botón.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Conteo por estado (Priority: P1)

El sistema entrega cuántas solicitudes hay en cada estado y el total, incluidos los estados sin solicitudes.

**Why this priority**: es el dato que el panel necesita; sin él no hay resumen.

**Independent Test**: con solicitudes en distintos estados, se pide el resumen y se comparan los conteos.

**Acceptance Scenarios**:

1. **Given** 3 pendientes, 1 aprobada, 2 rechazadas y 0 canceladas, **When** se pide el resumen, **Then** responde pendientes 3, aprobadas 1, rechazadas 2, canceladas 0 y total 6.
2. **Given** que no hay solicitudes, **When** se pide el resumen, **Then** todos los conteos y el total son 0.

---

### User Story 2 - Resumen en el panel (Priority: P1)

El administrador ve el resumen arriba de la bandeja de solicitudes, con un mensaje mientras carga y otro si falla.

**Why this priority**: es como el administrador obtiene el valor de la funcionalidad.

**Independent Test**: se renderiza el panel con un resumen simulado y se comprueban los números.

**Acceptance Scenarios**:

1. **Given** un resumen con 3 pendientes, **When** el administrador abre el panel, **Then** ve «Pendientes: 3» y los demás conteos.
2. **Given** que la carga del resumen falla, **When** abre el panel, **Then** ve un mensaje de error accesible y el resto del panel sigue funcionando.
3. **Given** el panel abierto, **When** aprueba o rechaza una solicitud, **Then** el resumen se vuelve a cargar.

---

### Edge Cases

- Estados escritos en minúsculas en la base de datos no existen: el sistema siempre guarda los estados en mayúsculas.
- Si la carga del resumen tarda, el panel muestra «Cargando resumen...».

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE ofrecer un resumen con el número de solicitudes PENDIENTE, APROBADA, RECHAZADA y CANCELADA, y el total.
- **FR-002**: Los estados sin solicitudes DEBEN aparecer con 0.
- **FR-003**: El panel DEBE mostrar el resumen con una etiqueta legible por estado.
- **FR-004**: El panel DEBE mostrar un mensaje mientras el resumen carga y un mensaje de error accesible si falla.
- **FR-005**: El panel DEBE volver a cargar el resumen después de aprobar o rechazar una solicitud.

### Key Entities

- **Resumen de solicitudes**: conteo de solicitudes por estado y total. No se guarda; se calcula al pedirlo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El administrador sabe cuántas solicitudes le faltan por revisar sin contar filas.
- **SC-002**: Los conteos coinciden con las solicitudes registradas en el 100 % de los casos probados.

## Assumptions

- Depende del estado CANCELADA introducido en la spec 006.
- El resumen es solo de lectura y está dentro del panel del administrador.
