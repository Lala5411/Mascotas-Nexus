# Evidencia de calidad — Mascota Nexus

Medido el 2026-11-20 sobre `main` (commit `2fb981c`, merge del PR #8). Toda cifra de este documento
sale de una ejecución real; los enlaces llevan a las ejecuciones de GitHub Actions.

## Mecanismos de calidad

| # | Mecanismo | Configuración | Qué bloquea |
| --- | --- | --- | --- |
| 1 | CI en cada pull request y en cada push a `main` | [`.github/workflows/quality.yml`](../../.github/workflows/quality.yml) | Un PR con pruebas, build o E2E en rojo |
| 2 | Umbral de cobertura del backend (JaCoCo) | [`backend/pom.xml`](../../backend/pom.xml): 60 % de instrucciones y 60 % de ramas | `mvnw verify` falla por debajo del umbral |
| 3 | Umbral de cobertura del frontend (Jest) | [`frontend/package.json`](../../frontend/package.json): 60 % sentencias, 60 % ramas, 55 % funciones, 60 % líneas | `npm test --coverage` falla por debajo del umbral |
| 4 | Pruebas de extremo a extremo (Playwright) | [`frontend/playwright.config.js`](../../frontend/playwright.config.js), [`frontend/e2e/`](../../frontend/e2e/) | El job `end-to-end` del CI |
| 5 | Pruebas primero (TDD) dentro del flujo SDD | Principio V de la [constitución](../../.specify/memory/constitution.md); orden de `tasks.md` | La tarea de prueba precede a la de implementación |
| 6 | Revisión y convergencia | Agentes [`quality-reviewer`](../../.github/agents/quality-reviewer.agent.md) y [`spec-auditor`](../../.github/agents/spec-auditor.agent.md); [plantilla de PR](../../.github/pull_request_template.md) | Tabla de convergencia requisito → prueba en cada `tasks.md` |

El build de producción (`npm run build`) ejecuta ESLint; en el CI (`CI=true`) cualquier aviso hace
fallar el job, así que también actúa como control de lint.

## Métricas actuales de `main`

| Módulo | Pruebas | Cobertura medida | Umbral |
| --- | --- | --- | --- |
| Backend (JUnit + JaCoCo) | 66, 0 fallos | 76,8 % instrucciones · 75,3 % ramas · 76,7 % líneas | 60 % · 60 % |
| Frontend (Jest) | 28, 0 fallos | 82,66 % sentencias · 74,35 % ramas · 83,09 % funciones · 82,9 % líneas | 60 · 60 · 55 · 60 |
| E2E (Playwright) | 3 de 3 | — | — |

Evolución: el 2026-11-19, antes de las specs 006 a 010, el backend tenía 36 pruebas (70,1 % de
instrucciones) y el frontend 15 pruebas (65,71 % de sentencias).

## Evidencia por spec

| Spec | PR fusionado | CI del PR | Pruebas que verifican sus criterios | Trazabilidad |
| --- | --- | --- | --- | --- |
| 001 Filtrado de mascotas | [#1](https://github.com/Lala5411/Mascotas-Nexus/pull/1) | No había CI todavía (se creó en el PR #3) | `MascotaServiceTest` (3), `MascotaControllerTest` (5), `MascotaRepositoryTest` (2) | [`tasks.md`](../../specs/001-filtrado-mascotas/tasks.md) |
| 002 Búsqueda en catálogo | [#2](https://github.com/Lala5411/Mascotas-Nexus/pull/2) | No había CI todavía | `Catalogo.test.js`: búsqueda, filtro por especie, carga, error y resultados tardíos | [`tasks.md`](../../specs/002-busqueda-catalogo/tasks.md) |
| 003 Historial de solicitudes | [#3](https://github.com/Lala5411/Mascotas-Nexus/pull/3) | [verde](https://github.com/Lala5411/Mascotas-Nexus/actions/runs/44427548225) | `SolicitudServiceTest`, `SolicitudControllerTest`, `SolicitudControllerHttpTest` (404 y lista vacía) | [`tasks.md`](../../specs/003-historial-solicitudes/tasks.md) |
| 004 Validación de solicitudes | [#4](https://github.com/Lala5411/Mascotas-Nexus/pull/4) | [verde](https://github.com/Lala5411/Mascotas-Nexus/actions/runs/44427749575) | `SolicitudServiceValidationTest` (7), `SolicitudControllerHttpTest` (404 y 400) | [`tasks.md`](../../specs/004-validacion-solicitudes/tasks.md) |
| 005 Transiciones de solicitudes | [#5](https://github.com/Lala5411/Mascotas-Nexus/pull/5) | [verde](https://github.com/Lala5411/Mascotas-Nexus/actions/runs/44428884206) | `SolicitudServiceStateTest` (5), `SolicitudControllerHttpTest` (404) | [`tasks.md`](../../specs/005-transiciones-solicitudes/tasks.md) |
| 006 Cancelar solicitud | [#8](https://github.com/Lala5411/Mascotas-Nexus/pull/8) | [verde](https://github.com/Lala5411/Mascotas-Nexus/actions/runs/44652443149) | `SolicitudServiceCancelTest` (6), `SolicitudControllerHttpTest` (3), `Catalogo.test.js` (3) | [tabla de convergencia](../../specs/006-cancelar-solicitud/tasks.md) |
| 007 Validar registro de mascota | [#8](https://github.com/Lala5411/Mascotas-Nexus/pull/8) | [verde](https://github.com/Lala5411/Mascotas-Nexus/actions/runs/44652443149) | `MascotaServiceRegistroTest` (10), `MascotaRegistroHttpTest` (2), `AdminPanel.test.js` (2) | [tabla de convergencia](../../specs/007-validar-registro-mascota/tasks.md) |
| 008 Resumen de solicitudes | [#8](https://github.com/Lala5411/Mascotas-Nexus/pull/8) | [verde](https://github.com/Lala5411/Mascotas-Nexus/actions/runs/44652443149) | `SolicitudServiceResumenTest` (2), `SolicitudControllerHttpTest` (1), `AdminPanel.test.js` (3) | [tabla de convergencia](../../specs/008-resumen-solicitudes/tasks.md) |
| 009 Ordenar catálogo | [#8](https://github.com/Lala5411/Mascotas-Nexus/pull/8) | [verde](https://github.com/Lala5411/Mascotas-Nexus/actions/runs/44652443149) | `Catalogo.test.js` (3) | [tabla de convergencia](../../specs/009-ordenar-catalogo/tasks.md) |
| 010 Proteger eliminación | [#8](https://github.com/Lala5411/Mascotas-Nexus/pull/8) | [verde](https://github.com/Lala5411/Mascotas-Nexus/actions/runs/44652443149) | `MascotaServiceEliminarTest` (4), `MascotaRegistroHttpTest` (2), `AdminPanel.test.js` (2) | [tabla de convergencia](../../specs/010-proteger-eliminacion-mascota/tasks.md) |

Ejecución de `main` tras el merge del PR #8: [verde](https://github.com/Lala5411/Mascotas-Nexus/actions/runs/44652481727).

## Hallazgos y limitaciones reconocidas

- **Las specs 006 a 010 se fusionaron en un solo PR (#8).** Cada spec tiene su propia rama
  (`006-cancelar-solicitud` … `010-proteger-eliminacion-mascota`) y sus propios commits, pero las ramas
  estaban encadenadas y se abrió el PR desde la última. El historial de `main` conserva un commit por
  spec.
- **El job `end-to-end` es intermitente en CI.** Falló en el PR #7 y en el push `37786b2` a `main`,
  que solo cambiaban documentación o ya habían pasado con el mismo código; al relanzarse pasó. En
  local pasa 3 de 3. La causa no está diagnosticada.
- **La cobertura mide ejecución, no la calidad de las aserciones.** El mutation testing que proponía
  el Taller 5 no se implementó.
- **Las specs 001 y 002 se fusionaron antes de existir el CI.** Sus pruebas sí corren hoy en cada PR.

## Cómo reproducir

```powershell
cd backend; .\mvnw.cmd verify; cd ..
cd frontend; npm test -- --watchAll=false --coverage; $env:CI="true"; npm run build; npm run test:e2e; cd ..
```

Los informes completos se generan en `backend/target/site/jacoco/index.html` y
`frontend/coverage/lcov-report/index.html`, y el CI los publica como artefactos `backend-coverage`,
`frontend-coverage` y `playwright-report`, que se conservan 7 días.
