# Tasks: Resumen de solicitudes para el administrador

**Input**: Design documents from `/specs/008-resumen-solicitudes/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: obligatorias por la constitución (principio V): cada prueba precede a su implementación.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Verificar la línea base: las pruebas actuales del backend y del frontend pasan

## Phase 2: User Story 1 - Conteo por estado (Priority: P1) 🎯 MVP

### Tests (Red)

- [X] T002 [US1] Pruebas en `backend/src/test/java/com/mascotanexus/backend/service/SolicitudServiceResumenTest.java`: con conteos 3/1/2/0 el resumen devuelve esos valores y total 6; sin solicitudes, todo en 0
- [X] T003 [US1] Prueba HTTP en `backend/src/test/java/com/mascotanexus/backend/controller/SolicitudControllerHttpTest.java`: `GET /api/solicitudes/resumen` responde 200 con los cinco campos

### Implementation (Green)

- [X] T004 [US1] Crear `backend/src/main/java/com/mascotanexus/backend/dto/ResumenSolicitudesResponse.java`
- [X] T005 [US1] Añadir `countByEstado` en `SolicitudRepository` y `resumenPorEstado()` en `SolicitudService`
- [X] T006 [US1] Añadir `GET /resumen` en `SolicitudController`

**Checkpoint**: revisión de `quality-reviewer` del backend.

## Phase 3: User Story 2 - Resumen en el panel (Priority: P1)

### Tests (Red)

- [X] T007 [US2] Pruebas en `frontend/src/components/AdminPanel.test.js`: el panel muestra «Pendientes: 3» y los demás conteos; si la carga falla, muestra un `role="alert"`; tras aprobar una solicitud vuelve a pedir el resumen

### Implementation (Green)

- [X] T008 [US2] Implementar la carga, la sección del resumen y la recarga tras responder en `frontend/src/components/AdminPanel.js`

**Checkpoint**: revisión de `quality-reviewer` del frontend.

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T009 Verificación completa: `.\mvnw.cmd verify`, `npm test -- --watchAll=false --coverage` y `npm run build`
- [X] T010 Auditoría de convergencia con `spec-auditor` (`/speckit-converge`)

## Dependencies & Execution Order

- T001 → T002–T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010.

## Phase 5: Convergence

Auditoría de convergencia (`/speckit-converge`, rol `spec-auditor`) del 2026-11-19.

| Requisito | Evidencia | Resultado |
| --- | --- | --- |
| FR-001 | `SolicitudServiceResumenTest.resumenCuentaLasSolicitudesPorEstadoYElTotal`; HTTP `resumenDevuelveElConteoPorEstado` | Cumple |
| FR-002 | `resumenSinSolicitudesDevuelveCeros` | Cumple |
| FR-003 | `AdminPanel.test.js`: «muestra el resumen de solicitudes por estado» | Cumple |
| FR-004 | «muestra un error si no se puede cargar el resumen»; el estado de carga usa `role="status"` | Cumple |
| FR-005 | «vuelve a cargar el resumen después de aprobar una solicitud» | Cumple |

Verificación: `.\mvnw.cmd verify` 60 pruebas y umbrales de JaCoCo cumplidos; `npm test -- --watchAll=false --coverage` 23 pruebas (80,84 % de sentencias); `CI=true npm run build` correcto. Hallazgo durante la verificación: un primer `npm run build` mostró avisos de `no-unused-vars` por una caché local de ESLint desactualizada; al borrarla, el build con `CI=true` (como en GitHub Actions) compila sin avisos.

**Resultado**: converged. No se añaden tareas.
