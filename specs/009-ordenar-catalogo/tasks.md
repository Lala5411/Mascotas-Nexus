# Tasks: Ordenar el catálogo

**Input**: Design documents from `/specs/009-ordenar-catalogo/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: obligatorias por la constitución (principio V): cada prueba precede a su implementación.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Verificar la línea base: las pruebas actuales del frontend pasan

## Phase 2: User Story 1 - Ordenar por nombre o edad (Priority: P1) 🎯 MVP

### Tests (Red)

- [X] T002 [US1] Pruebas en `frontend/src/components/Catalogo.test.js`: el selector «Ordenar por» empieza en «Orden original»; «Nombre (A-Z)» da Luna, Nube, Rocky; «Edad: menor a mayor» da Nube, Luna, Rocky; «Edad: mayor a menor» da Rocky, Luna, Nube

### Implementation (Green)

- [X] T003 [US1] Añadir el estado `orden`, el selector con su etiqueta y el ordenamiento en el `useMemo` de `frontend/src/components/Catalogo.js`

## Phase 3: User Story 2 - Combinar con búsqueda y filtro (Priority: P2)

### Tests (Red)

- [X] T004 [US2] Prueba en `Catalogo.test.js`: con «Edad: mayor a menor» y la búsqueda «u» se ven Luna y Nube en ese orden, y cambiar el orden no hace peticiones nuevas
- [X] T005 [US2] Prueba en `Catalogo.test.js`: dos mascotas con la misma edad se ordenan por nombre

### Implementation (Green)

- [X] T006 [US2] Ajustar el ordenamiento si T004 o T005 fallan (desempate por nombre)

**Checkpoint**: revisión de `quality-reviewer` del frontend.

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T007 Verificación completa: `npm test -- --watchAll=false --coverage`, `npm run build` y `.\mvnw.cmd verify` como regresión
- [X] T008 Auditoría de convergencia con `spec-auditor` (`/speckit-converge`)

## Dependencies & Execution Order

- T001 → T002 → T003 → T004–T005 → T006 → T007 → T008.

## Phase 5: Convergence

Auditoría de convergencia (`/speckit-converge`, rol `spec-auditor`) del 2026-11-19.

| Requisito | Evidencia | Resultado |
| --- | --- | --- |
| FR-001 | `Catalogo.test.js`: «ordena el catálogo por nombre y por edad» (las cuatro opciones del selector) | Cumple |
| FR-002 | «conserva el orden original por defecto y desempata por nombre» | Cumple |
| FR-003 | «mantiene el orden al buscar y no hace peticiones nuevas» | Cumple |
| FR-004 | Misma prueba: el número de llamadas a `axios.get` no cambia | Cumple |
| FR-005 | «conserva el orden original por defecto y desempata por nombre» (Bruno y Luna, ambas de 2 años) | Cumple |
| FR-006 | Las pruebas localizan el selector por su nombre accesible «Ordenar por»; es un `<select>` nativo, navegable con teclado | Cumple |

Nota: la tarea T006 no requirió cambios adicionales; el desempate por nombre quedó incluido en T003 y las pruebas T004 y T005 pasaron.

Verificación: `npm test -- --watchAll=false --coverage` 26 pruebas (81,32 % de sentencias); `CI=true npm run build` correcto; `.\mvnw.cmd verify` 60 pruebas como regresión. Las pruebas E2E localizan los selectores por su etiqueta exacta, así que el nuevo no interfiere.

**Resultado**: converged. No se añaden tareas.
