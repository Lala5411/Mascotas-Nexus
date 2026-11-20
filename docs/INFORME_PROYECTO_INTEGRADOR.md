# Informe técnico — Proyecto integrador: el arnés de Mascota Nexus

**Integrantes:** Laura Quintero · Estefania Jimenez
**Herramientas:** GitHub Copilot en VS Code (arnés) y Claude Code (ejecución del flujo SDD de las specs 006 a 010)
**Repositorio:** [github.com/Lala5411/Mascotas-Nexus](https://github.com/Lala5411/Mascotas-Nexus) · estado descrito: `main` al 2026-11-20

Mascota Nexus es una plataforma de adopción: el adoptante busca mascotas, se postula con el perfil
de su hogar y sigue sus solicitudes; el administrador registra mascotas y aprueba o rechaza
solicitudes. Backend Java 17 + Spring Boot 4.1.2 + PostgreSQL; frontend React 19 + Axios + Tailwind.

## 1. Arquitectura del arnés

```text
Mascotas-Nexus/
├── CLAUDE.md                                   memoria para Claude Code (importa constitución y memoria)
├── .specify/                                   Spec Kit 1.4.3 (integración copilot, scripts PowerShell)
│   ├── memory/constitution.md                  constitución v1.0.0
│   ├── templates/                              spec, plan, tasks, checklist, constitution
│   ├── scripts/powershell/                     create-new-feature, setup-plan, setup-tasks, …
│   ├── presets/implement-orquestador/          preset instalado (copia del de speckit-custom/)
│   └── workflows/speckit/workflow.yml
├── speckit-custom/presets/implement-orquestador/  fuente del preset que convierte implement en orquestador
├── .github/
│   ├── copilot-instructions.md                 memoria general (Copilot)
│   ├── instructions/
│   │   ├── backend-java.instructions.md        applyTo: backend/**/*.java
│   │   └── frontend-react.instructions.md      applyTo: frontend/src/**/*.js
│   ├── agents/
│   │   ├── backend-implementer.agent.md
│   │   ├── frontend-implementer.agent.md
│   │   ├── quality-reviewer.agent.md
│   │   └── spec-auditor.agent.md
│   ├── skills/
│   │   ├── spring-service-testing/SKILL.md     skill propia
│   │   ├── react-accessible-flows/SKILL.md     skill propia
│   │   ├── adoption-flow-validation/SKILL.md   skill propia
│   │   └── speckit-*/SKILL.md (9)               comandos del flujo SDD
│   ├── workflows/quality.yml                   CI: backend-tests, frontend-checks, end-to-end
│   └── pull_request_template.md
├── backend/AGENTS.md · frontend/AGENTS.md      memoria por módulo
├── specs/001-… a specs/010-…                   10 specs
└── docs/
    ├── quality-evidence/README.md              evidencia de calidad por spec
    └── INFORME_PROYECTO_INTEGRADOR.md          este informe
```

### Función de cada pieza

| Pieza | Contenido | Para qué sirve |
| --- | --- | --- |
| `.specify/memory/constitution.md` | 7 principios (simplicidad, capas, errores HTTP, frontend accesible, pruebas primero, calidad medible, seguridad), restricciones tecnológicas, flujo y gobierno | Fuente única de verdad: todas las fases de Spec Kit la leen y el *Constitution Check* de cada plan la verifica |
| `.github/copilot-instructions.md` | Enlace a la constitución, flujo SDD en 7 pasos, reglas de ingeniería y comandos | Lo que Copilot lee en cada sesión |
| `CLAUDE.md` | Importa la constitución y la memoria; comandos; lista de lo que el agente no debe hacer | Lo mismo para Claude Code, sin duplicar reglas |
| `backend/AGENTS.md`, `frontend/AGENTS.md` | Stack, estructura y comandos de cada módulo | Memoria específica por módulo |
| `backend-java.instructions.md` | Capas, DTOs, invariantes en `SolicitudService`, pruebas, no tocar credenciales | Reglas que solo se aplican a archivos Java |
| `frontend-react.instructions.md` | URL base de la API, usuario autenticado, estados de carga, error y vacío, pruebas con Axios simulado | Reglas que solo se aplican a archivos React |
| `spring-service-testing` | Cómo probar servicios, controladores y repositorios | Se carga al tocar Java |
| `react-accessible-flows` | Nombres accesibles, estados visibles, respuestas obsoletas | Se carga al tocar componentes React |
| `adoption-flow-validation` | Invariantes de la solicitud, DTOs, pruebas de interfaz y Playwright del flujo de adopción | Se carga al cambiar solicitudes, historial o decisiones del administrador |
| `speckit-*` (9) | `constitution`, `specify`, `clarify`, `plan`, `tasks`, `analyze`, `implement`, `converge`, `checklist` | Los comandos del flujo SDD |
| Preset `implement-orquestador` | Rol de orquestador, tabla de delegación, reglas de comunicación, puntos de control, traza | `/speckit-implement` no escribe código: delega en los agentes |

## 2. Sistema de agentes: taller frente a implementación final

| Agente | Modelo | Herramientas | Skills | Rol |
| --- | --- | --- | --- | --- |
| Orquestador (preset de `/speckit-implement`) | El del chat | Las del chat; solo puede editar `tasks.md` | — | Delegar por bloques, marcar tareas, puntos de control, convergencia |
| `backend-implementer` | GPT-4.1 | read, search, edit, execute | spring-service-testing, adoption-flow-validation | Red → Green en `backend/` |
| `frontend-implementer` | GPT-4.1 | read, search, edit, execute | react-accessible-flows, adoption-flow-validation | Red → Green en `frontend/` |
| `quality-reviewer` | GPT-4.1 | read, search, execute (sin edit) | las tres propias | Revisión por historia y final |
| `spec-auditor` | GPT-4.1 | read, search, edit, execute | speckit-converge | `/speckit-converge`; solo añade tareas a `tasks.md` |

El Taller 5 diseñó 7 agentes (orquestador, auditor de contrato, dos autores de pruebas, dos
implementadores y guardián de calidad) con Copilot Fusion y mutation testing como puerta.

| Cambio | Motivo observado |
| --- | --- |
| Se quitó el orquestador como agente y luego volvió como preset de `/speckit-implement` | En las specs 001 a 005, cuatro de cinco tocaron un solo módulo y no hacía falta coordinar. El profesor señaló que sin un flujo ejecutable no había arnés; con Spec Kit, el orquestador del taller recupera su sentido como rol de `implement` |
| Se quitó el auditor de contrato; aparece `spec-auditor` | El contrato lo comprueban las pruebas HTTP y E2E; `spec-auditor` verifica el código contra la spec completa |
| Los autores de pruebas se unieron a los implementadores | En las specs 001 a 005 pruebas y código llegaron en el mismo commit. Desde la 006, cada implementador hace Red y después Green |
| `guardian-calidad` pasó a ser `quality-reviewer` | Se mantuvo lo esencial: ejecuta y reporta, sin edit |
| Mutation testing → cobertura con umbral + E2E | No había CI; se priorizó una puerta automática en cada PR |
| Copilot Fusion → GPT-4.1 | No fue decisión del equipo: lo puso el agente y no se evaluó |

## 3. Las funcionalidades desarrolladas

Las specs 001 a 005 se escribieron a mano, antes de Spec Kit. Las specs 006 a 010 se desarrollaron
con el flujo SDD completo, ejecutado con Claude Code siguiendo las skills y roles del arnés.

| Spec | Rama | PR | Código de producción | Criterios verificados |
| --- | --- | --- | --- | --- |
| 001 Filtrado de mascotas | `feat/solicitud-1` | [#1](https://github.com/Lala5411/Mascotas-Nexus/pull/1) | `MascotaController`, `MascotaService`, `MascotaRepository` | 6 |
| 002 Búsqueda en catálogo | `feat/solicitud-2` | [#2](https://github.com/Lala5411/Mascotas-Nexus/pull/2) | `Catalogo.js` | 7 |
| 003 Historial de solicitudes | `feat/solicitudes-usuario` | [#3](https://github.com/Lala5411/Mascotas-Nexus/pull/3) | `SolicitudService`, `SolicitudController`, `SolicitudResponse`, `Catalogo.js` | 6 |
| 004 Validación de solicitudes | `feat/validar-solicitudes` | [#4](https://github.com/Lala5411/Mascotas-Nexus/pull/4) | `SolicitudService` | 6 |
| 005 Transiciones de solicitudes | `feat/transiciones-solicitudes` | [#5](https://github.com/Lala5411/Mascotas-Nexus/pull/5) | `SolicitudService` | 5 |
| 006 Cancelar solicitud | `006-cancelar-solicitud` | [#8](https://github.com/Lala5411/Mascotas-Nexus/pull/8) | `SolicitudService.cancelar`, `PUT /{id}/cancelar`, `Catalogo.js` | 10 de 10 |
| 007 Validar registro de mascota | `007-validar-registro-mascota` | [#8](https://github.com/Lala5411/Mascotas-Nexus/pull/8) | `MascotaService.guardar`, `AdminPanel.js` | 9 de 9 |
| 008 Resumen de solicitudes | `008-resumen-solicitudes` | [#8](https://github.com/Lala5411/Mascotas-Nexus/pull/8) | `ResumenSolicitudesResponse`, `countByEstado`, `GET /resumen`, `AdminPanel.js` | 5 de 5 |
| 009 Ordenar catálogo | `009-ordenar-catalogo` | [#8](https://github.com/Lala5411/Mascotas-Nexus/pull/8) | `Catalogo.js` | 6 de 6 |
| 010 Proteger eliminación | `010-proteger-eliminacion-mascota` | [#8](https://github.com/Lala5411/Mascotas-Nexus/pull/8) | `MascotaService.eliminar`, consultas `exists…`, `AdminPanel.js` | 6 de 6 |

Cada spec vive en `specs/NNN-nombre/` con `spec.md`, `plan.md` y `tasks.md`; desde la 006 también
`checklists/requirements.md`, `research.md`, `data-model.md`, `contracts/` y `quickstart.md`, y la
tabla de convergencia requisito → prueba al final de `tasks.md`.

Las specs 006 a 010 se fusionaron en un solo PR (#8) porque sus ramas estaban encadenadas; cada una
conserva su rama y su commit en el historial de `main`.

## 4. Aseguramiento de la calidad

Detalle y enlaces: [`docs/quality-evidence/README.md`](./quality-evidence/README.md).

| Métrica (main, 2026-11-20) | Valor |
| --- | --- |
| Pruebas backend | 66, 0 fallos |
| Cobertura backend (JaCoCo) | 76,8 % instrucciones · 75,3 % ramas (umbral 60/60) |
| Pruebas frontend | 28, 0 fallos |
| Cobertura frontend (Jest) | 82,66 % sentencias · 74,35 % ramas · 83,09 % funciones · 82,9 % líneas (umbral 60/60/55/60) |
| Pruebas E2E | 3 de 3 |
| CI de `main` | [verde](https://github.com/Lala5411/Mascotas-Nexus/actions/runs/44652481727) |

Hallazgos reales registrados durante el flujo: una E2E ambigua por el botón de la spec 006
(corregida en su rama), un error 500 latente al borrar mascotas con historial (convertido en 409 por
la spec 010), una prueba que siempre pasaba (corregida), la caché de ESLint que mostraba avisos
falsos y la intermitencia del job `end-to-end` en CI (sin diagnosticar).

## 5. Auditoría contra la rúbrica

| Parte | Exigencia | Estado | Evidencia |
| --- | --- | --- | --- |
| 1 · Arnés | Memoria | Cumple | `copilot-instructions.md`, `CLAUDE.md`, `AGENTS.md` |
| 1 · Arnés | Instrucciones por tipo de archivo | Cumple | `.github/instructions/` (2) |
| 1 · Arnés | Al menos 3 skills propias | Cumple | `spring-service-testing`, `react-accessible-flows`, `adoption-flow-validation` |
| 1 · Arnés | Constitución (usan Spec Kit) | Cumple | `.specify/memory/constitution.md` |
| 1 · Arnés | README del arnés | Cumple | Secciones de piezas, skills, uso, cambios y calidad |
| 2 · Agentes | Archivos con herramientas, permisos y modelo; cambios explicados | Cumple | `.github/agents/` (4), preset, «Cambios respecto del taller» |
| 3 · SDD | 5 specs con spec, plan, tareas, pruebas y PR fusionado | Cumple | 001–005 con un PR cada una; 006–010 con flujo Spec Kit completo |
| 3 · SDD | Una rama y un PR por spec | Parcial en 006–010 | Ramas propias, pero un PR compartido (#8) |
| 4 · Calidad | Al menos 2 mecanismos con evidencia | Cumple | CI, umbrales JaCoCo y Jest, E2E, TDD y convergencia |
| Entrega | Todo en `main` | Cumple | PR #1 a #8 fusionados |
| 5 · Exposición | Presentación | Fuera del repositorio | Deck en Q10 |
| 6 · Reflexión | Una reflexión personal por integrante | Fuera del repositorio | La escribe cada integrante |
