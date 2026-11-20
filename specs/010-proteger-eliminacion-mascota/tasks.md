# Tasks: Proteger la eliminación de mascotas

**Input**: Design documents from `/specs/010-proteger-eliminacion-mascota/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: obligatorias por la constitución (principio V): cada prueba precede a su implementación.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Verificar la línea base: las pruebas actuales del backend y del frontend pasan

## Phase 2: User Story 1 - Bloquear la eliminación con solicitudes (Priority: P1) 🎯 MVP

### Tests (Red)

- [X] T002 [US1] Pruebas en `backend/src/test/java/com/mascotanexus/backend/service/MascotaServiceEliminarTest.java`: inexistente → 404; con solicitud PENDIENTE → 409; solo con solicitudes resueltas → 409; sin solicitudes → se llama a `deleteById`; en los rechazos no se llama a `deleteById`
- [X] T003 [US1] Prueba HTTP en `backend/src/test/java/com/mascotanexus/backend/controller/MascotaRegistroHttpTest.java`: `DELETE /api/mascotas/{id}` responde 409 con solicitudes pendientes y 204 sin solicitudes

### Implementation (Green)

- [X] T004 [US1] Añadir `existsByMascotaIdAndEstado` y `existsByMascotaId` en `SolicitudRepository`
- [X] T005 [US1] Inyectar `SolicitudRepository` en `MascotaService` e implementar las reglas en `eliminar`; actualizar el constructor en `MascotaServiceTest` y `MascotaServiceRegistroTest`

**Checkpoint**: revisión de `quality-reviewer` del backend.

## Phase 3: User Story 2 - Mensaje en el panel (Priority: P2)

### Tests (Red)

- [X] T006 [US2] Pruebas en `frontend/src/components/AdminPanel.test.js`: con 409 se muestra un `role="alert"` con el nombre de la mascota y la mascota sigue en la lista; con 204 se recarga la lista sin errores

### Implementation (Green)

- [X] T007 [US2] Capturar el error en `eliminarMascota` de `frontend/src/components/AdminPanel.js` y mostrar el mensaje

**Checkpoint**: revisión de `quality-reviewer` del frontend.

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T008 Verificación completa: `.\mvnw.cmd verify`, `npm test -- --watchAll=false --coverage`, `CI=true npm run build` y `npm run test:e2e`
- [X] T009 Auditoría de convergencia con `spec-auditor` (`/speckit-converge`)

## Dependencies & Execution Order

- T001 → T002–T003 → T004 → T005 → T006 → T007 → T008 → T009.

## Phase 5: Convergence

Auditoría de convergencia (`/speckit-converge`, rol `spec-auditor`) del 2026-11-19.

| Requisito | Evidencia | Resultado |
| --- | --- | --- |
| FR-001 | `MascotaServiceEliminarTest.eliminarMascotaConSolicitudPendienteDevuelveConflicto`; HTTP `eliminarMascotaConSolicitudesPendientesDevuelveConflict` | Cumple |
| FR-002 | `eliminarMascotaSoloConSolicitudesResueltasDevuelveConflicto` | Cumple |
| FR-003 | `eliminarMascotaInexistenteDevuelveNoEncontrado` | Cumple |
| FR-004 | `eliminarMascotaSinSolicitudesLaElimina`; HTTP `eliminarMascotaSinSolicitudesDevuelveNoContent` | Cumple |
| FR-005 | `AdminPanel.test.js`: «explica por qué no se pudo eliminar una mascota con solicitudes» | Cumple |
| FR-006 | «recarga la lista sin errores cuando la mascota se elimina» | Cumple |

Verificación: `.\mvnw.cmd verify` 66 pruebas y umbrales de JaCoCo cumplidos; `npm test -- --watchAll=false --coverage` 28 pruebas (82,66 % de sentencias); `CI=true npm run build` correcto.

Hallazgos durante la verificación:

- Al escribir T006, la segunda prueba comparaba `> llamadasAntes - 1`, una condición que siempre se cumple. Se corrigió para exigir una recarga real después de eliminar.
- `npm run test:e2e` falló en `adoption-flow.spec.js`: `getByRole('cell', { name: petName })` encontró dos celdas, porque el botón «Cancelar solicitud de <mascota>» de la spec 006 también contiene el nombre. El componente cumple la spec 006 (FR-008 exige ese nombre accesible); la corrección es que la prueba E2E use `exact: true`. Se aplica en la rama de la spec 006, donde se originó el cambio, para que el CI de su PR también pase.

**Resultado**: converged. No se añaden tareas a esta spec.
