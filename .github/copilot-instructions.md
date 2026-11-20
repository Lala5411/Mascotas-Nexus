# Mascota Nexus

Este repositorio contiene un backend en Java/Spring en `backend/` y un frontend en React en `frontend/`.

## Constitución

- La constitución del proyecto está en `.specify/memory/constitution.md`. Léela y respétala en toda conversación, aunque no se use un comando de Spec Kit.
- Es la fuente única de verdad: ante cualquier conflicto con estas instrucciones, prevalece la constitución.
- Antes de proponer o escribir código, verifica que la propuesta cumple la constitución. Si una petición la contradice, adviértelo en lugar de ejecutarla en silencio.
- No edites `.specify/memory/constitution.md` salvo con la skill `speckit-constitution`.

## Flujo SDD con Spec Kit

Toda funcionalidad nueva sigue este orden, con las skills de `.github/skills/speckit-*`:

1. `/speckit-specify`: qué se construye y por qué (genera `specs/NNN-nombre/spec.md`).
2. `/speckit-clarify` (opcional): resuelve las ambigüedades de la spec.
3. `/speckit-plan`: cómo se construye (genera `plan.md`, `research.md`, `data-model.md`, `contracts/` y `quickstart.md`).
4. `/speckit-tasks`: tareas ordenadas, con la prueba antes de la implementación (genera `tasks.md`).
5. `/speckit-analyze` (opcional): consistencia entre spec, plan y tareas.
6. `/speckit-implement`: actúa como orquestador y delega en `backend-implementer`, `frontend-implementer`, `quality-reviewer` y `spec-auditor`.
7. `/speckit-converge`: comprueba que el código cumple la spec; lo ejecuta `spec-auditor`.

## Arnés de Copilot

- Lee `README.md` para ver el mapa de agentes, skills, specs y controles de calidad.
- Los agentes del espacio de trabajo están en `.github/agents/`; su lista de herramientas permitidas define qué herramientas tiene cada rol.
- Reutiliza una skill de `.github/skills/` cuando su descripción coincida con la tarea. Las reglas de los servicios del backend las cubre `spring-service-testing`; el trabajo accesible en React, `react-accessible-flows`; y los flujos de envío y revisión de solicitudes de adopción, `adoption-flow-validation`.
- Las specs viven en `specs/NNN-nombre/`. Las specs 001 a 005 se escribieron antes de instalar Spec Kit; desde la 006 se generan con el flujo SDD de Spec Kit.

## Reglas de ingeniería

- Mantén los cambios dentro del módulo que corresponde y conserva en el backend la separación controller/service/repository.
- Valida la entrada del usuario en el borde de la API y aplica las invariantes de adopción en `SolicitudService`.
- Usa DTOs para las respuestas nuevas de la API en lugar de exponer entidades de persistencia.
- Mantén las llamadas del frontend a la API coherentes con la URL base existente `http://localhost:8080/api` y usa el ID del usuario autenticado en lugar de IDs fijos.
- Añade pruebas focalizadas para el comportamiento que cambie; no reemplaces pruebas significativas por snapshots ni por aserciones sobre detalles de implementación.
- No cambies las credenciales de la base de datos, los puertos, el cifrado de contraseñas ni comportamientos de autenticación no relacionados.
- No añadas informes, presentaciones, diagramas ni otros entregables narrativos a los cambios de código.

## Comandos de validación

- Backend: `cd backend` y luego `./mvnw test` (Windows: `.\mvnw.cmd test`).
- Pruebas del frontend: `cd frontend` y luego `npm test -- --watchAll=false`.
- Compilación de producción del frontend: `cd frontend` y luego `npm run build`.
- Pruebas de extremo a extremo en el navegador: `cd frontend` y luego `npm run test:e2e` (requiere la base de datos PostgreSQL aislada para E2E que configura Playwright).

El backend usa Java 17, Spring Boot, Spring Data JPA y PostgreSQL. El frontend usa React, Axios y Tailwind CSS.
