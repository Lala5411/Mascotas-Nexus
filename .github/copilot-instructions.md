# Mascota Nexus

Este repositorio contiene un backend en Java/Spring en `backend/` y un frontend en React en `frontend/`.

## Arnés de Copilot

- Lee `README.md` para ver el mapa de agentes, skills, specs y controles de calidad.
- Los agentes del espacio de trabajo están en `.github/agents/`; su lista de herramientas permitidas define qué herramientas tiene cada rol.
- Reutiliza una skill de `.github/skills/` cuando su descripción coincida con la tarea. Las reglas de los servicios del backend las cubre `spring-service-testing`; el trabajo accesible en React, `react-accessible-flows`; y los flujos de envío y revisión de solicitudes de adopción, `adoption-flow-validation`.
- Las cinco funcionalidades usan la estructura `specs/NN-*/spec.md`, `plan.md` y `tasks.md` del repositorio. No se usa Spec Kit.

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
