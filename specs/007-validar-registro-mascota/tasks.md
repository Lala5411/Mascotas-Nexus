# Tasks: Validar el registro de mascotas

**Input**: Design documents from `/specs/007-validar-registro-mascota/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: obligatorias por la constitución (principio V): cada prueba precede a su implementación.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Verificar la línea base: las pruebas actuales del backend y del frontend pasan

## Phase 2: User Story 1 y 2 - Validación en el backend (Priority: P1) 🎯 MVP

**Goal**: los registros inválidos responden 400 sin guardar; los válidos se guardan normalizados.
**Independent Test**: pruebas de servicio y HTTP de `POST /api/mascotas`.

### Tests (Red)

- [X] T002 [US1] Pruebas en `backend/src/test/java/com/mascotanexus/backend/service/MascotaServiceRegistroTest.java`: nombre vacío, nombre de 61 caracteres, especie vacía, edad nula, edad -1, edad 31 y estado `PERDIDO` responden 400 y no llaman a `save`
- [X] T003 [US2] Pruebas en el mismo archivo: `"  Luna  "` y `"Gato"` sin estado se guardan como `Luna`, `Gato`, `DISPONIBLE`; las edades 0 y 30 se aceptan; `adoptado` se guarda como `ADOPTADO`
- [X] T004 [US1] Prueba HTTP en `backend/src/test/java/com/mascotanexus/backend/controller/MascotaRegistroHttpTest.java`: `POST /api/mascotas` con edad 45 responde 400 y con datos válidos responde 200

### Implementation (Green)

- [X] T005 [US1] [US2] Implementar la validación y la normalización en `MascotaService.guardar` hasta que pasen T002 a T004

**Checkpoint**: revisión de `quality-reviewer` del backend (`.\mvnw.cmd verify`).

## Phase 3: User Story 3 - Error visible en el panel (Priority: P2)

### Tests (Red)

- [X] T006 [US3] Pruebas en `frontend/src/components/AdminPanel.test.js`: si `POST /mascotas` responde 400 se muestra un `role="alert"` con las reglas y el nombre y la edad se conservan; si responde 200, el formulario se limpia y se vuelve a cargar la lista

### Implementation (Green)

- [X] T007 [US3] En `frontend/src/components/AdminPanel.js`: `aria-label` en los campos, captura del error con mensaje accesible y conservación de los datos

**Checkpoint**: revisión de `quality-reviewer` del frontend.

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T008 Verificación completa: `.\mvnw.cmd verify`, `npm test -- --watchAll=false --coverage` y `npm run build`
- [X] T009 Auditoría de convergencia con `spec-auditor` (`/speckit-converge`)

## Dependencies & Execution Order

- T001 → T002–T004 → T005 → T006 → T007 → T008 → T009.

## Phase 5: Convergence

Auditoría de convergencia (`/speckit-converge`, rol `spec-auditor`) del 2026-11-19.

| Requisito | Evidencia | Resultado |
| --- | --- | --- |
| FR-001 | `MascotaServiceRegistroTest.rechazaNombreVacio` | Cumple |
| FR-002 | `rechazaNombreDeMasDeSesentaCaracteres` | Cumple |
| FR-003 | `rechazaEspecieVacia` | Cumple |
| FR-004 | `rechazaEdadAusente`, `rechazaEdadNegativa`, `rechazaEdadMayorQueTreinta`; HTTP `registrarMascotaConEdadFueraDeRangoDevuelveBadRequest` | Cumple |
| FR-005 | `rechazaEstadoNoPermitido` | Cumple |
| FR-006 | `verify(mascotaRepository, never()).save(any())` en todas las pruebas de rechazo | Cumple |
| FR-007 | `guardaMascotaValidaRecortadaYDisponiblePorDefecto`, `aceptaLasEdadesLimite`, `guardaElEstadoEnMayusculas`; HTTP `registrarMascotaValidaDevuelveOk` | Cumple |
| FR-008 | `AdminPanel.test.js`: «muestra las reglas y conserva los datos si el servidor rechaza la mascota» | Cumple |
| FR-009 | Las pruebas de `AdminPanel` localizan los campos por su nombre accesible | Cumple |

Verificación: `.\mvnw.cmd verify` 57 pruebas y umbrales de JaCoCo cumplidos; `npm test -- --watchAll=false --coverage` 20 pruebas (78,52 % de sentencias); `npm run build` correcto. Las pruebas E2E no usan los campos del formulario del panel.

**Resultado**: converged. No se añaden tareas.
