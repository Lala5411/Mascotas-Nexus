# Tasks: Cancelar una solicitud de adopción pendiente

**Input**: Design documents from `/specs/006-cancelar-solicitud/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: obligatorias por la constitución (principio V): cada prueba precede a su implementación.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Verificar la línea base: `.\mvnw.cmd test` en `backend/` y `npm test -- --watchAll=false` en `frontend/` pasan antes de empezar

## Phase 2: User Story 1 y 2 - Regla de cancelación en el backend (Priority: P1) 🎯 MVP

**Goal**: el dueño cancela una solicitud PENDIENTE; los casos no permitidos responden 400, 403, 404 o 409 sin guardar.
**Independent Test**: pruebas de servicio y HTTP del endpoint de cancelación.

### Tests (Red)

- [X] T002 [US1] Prueba en `backend/src/test/java/com/mascotanexus/backend/service/SolicitudServiceCancelTest.java`: cancelar una solicitud PENDIENTE propia la deja CANCELADA, la guarda y devuelve un `SolicitudResponse` con ese estado
- [X] T003 [US1] Prueba en el mismo archivo: `cambiarEstado` sobre una solicitud CANCELADA responde 409 y no guarda
- [X] T004 [US2] Pruebas en el mismo archivo: solicitud inexistente → 404, de otro usuario → 403, no PENDIENTE → 409, sin `usuarioId` → 400; en todos los casos no se llama a `save`

### Implementation (Green)

- [X] T005 [US1] [US2] Implementar `cancelar(Long solicitudId, Long usuarioId)` en `backend/src/main/java/com/mascotanexus/backend/service/SolicitudService.java` hasta que pasen T002 a T004

### Tests HTTP (Red)

- [X] T006 [US2] Pruebas en `backend/src/test/java/com/mascotanexus/backend/controller/SolicitudControllerHttpTest.java`: `PUT /api/solicitudes/{id}/cancelar?usuarioId=` responde 200 con estado CANCELADA, 403 con otro usuario y 409 si no está pendiente

### Implementation (Green)

- [X] T007 [US2] Añadir el endpoint `PUT /{id}/cancelar` en `backend/src/main/java/com/mascotanexus/backend/controller/SolicitudController.java` que delega en el servicio

**Checkpoint**: revisión de `quality-reviewer` del backend (`.\mvnw.cmd verify`).

## Phase 3: User Story 3 - Cancelar desde el historial (Priority: P2)

**Goal**: el historial muestra «Cancelar» solo en las pendientes y actualiza la fila tras cancelar.
**Independent Test**: pruebas de `Catalogo` con Axios simulado.

### Tests (Red)

- [X] T008 [US3] Pruebas en `frontend/src/components/Catalogo.test.js`: el botón «Cancelar» aparece solo en la solicitud PENDIENTE; al pulsarlo se llama a `PUT .../solicitudes/{id}/cancelar` con el `usuarioId` de la sesión y la fila muestra CANCELADA; si falla, se muestra un mensaje con `role="alert"`

### Implementation (Green)

- [X] T009 [US3] Implementar el botón, la llamada y los mensajes en `frontend/src/components/Catalogo.js`

**Checkpoint**: revisión de `quality-reviewer` del frontend (`npm test -- --watchAll=false --coverage` y `npm run build`).

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T010 Verificación completa: `.\mvnw.cmd verify` y `npm test -- --watchAll=false --coverage` sobre los umbrales, y `npm run build`
- [X] T011 Auditoría de convergencia con `spec-auditor` (`/speckit-converge`)

## Dependencies & Execution Order

- T001 → T002–T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011.
- La fase 3 depende del endpoint de la fase 2.

## Phase 5: Convergence

Auditoría de convergencia (`/speckit-converge`, rol `spec-auditor`) del 2026-11-19.

| Requisito | Evidencia | Resultado |
| --- | --- | --- |
| FR-001 | `SolicitudServiceCancelTest.cancelarSolicitudPendientePropiaLaDejaCancelada`; HTTP `cancelarDevuelveLaSolicitudCanceladaCuandoEsDelUsuarioYEstaPendiente` | Cumple |
| FR-002 | `cancelarSolicitudInexistenteDevuelveNoEncontrado` | Cumple |
| FR-003 | `cancelarSolicitudDeOtroUsuarioDevuelveProhibido`; HTTP `cancelarDevuelveForbiddenCuandoLaSolicitudEsDeOtroUsuario` | Cumple |
| FR-004 | `cancelarSolicitudQueYaNoEstaPendienteDevuelveConflicto`; HTTP `cancelarDevuelveConflictCuandoLaSolicitudYaNoEstaPendiente` | Cumple |
| FR-005 | `cancelarSinIdentificarAlUsuarioDevuelveSolicitudIncorrecta` | Cumple |
| FR-006 | `verify(solicitudRepository, never()).save(any())` en las cuatro pruebas de rechazo | Cumple |
| FR-007 | `cambiarEstadoDeUnaSolicitudCanceladaDevuelveConflicto` | Cumple |
| FR-008 | `muestra el botón Cancelar solo en las solicitudes pendientes` | Cumple |
| FR-009 | `cancela una solicitud pendiente y muestra el nuevo estado sin recargar` | Cumple |
| FR-010 | `muestra un error si el servidor rechaza la cancelación` | Cumple |

Verificación: `.\mvnw.cmd verify` 45 pruebas y umbrales de JaCoCo cumplidos; `npm test -- --watchAll=false --coverage` 18 pruebas (67,23 % de sentencias); `npm run build` correcto.

**Resultado**: converged. No se añaden tareas.

## Phase 6: Convergence (vuelta 2)

Hallazgo posterior, detectado al ejecutar `npm run test:e2e` durante la spec 010: en
`frontend/e2e/adoption-flow.spec.js`, `getByRole('cell', { name: petName })` encontró dos celdas,
porque el botón «Cancelar solicitud de <mascota>» de esta spec también contiene el nombre de la
mascota y Playwright compara nombres por coincidencia parcial. El componente cumple FR-008; la prueba
era imprecisa.

- [X] T012 [US3] Usar `exact: true` en los dos selectores de celda por nombre de mascota de `frontend/e2e/adoption-flow.spec.js`

**Resultado**: converged tras la corrección.
