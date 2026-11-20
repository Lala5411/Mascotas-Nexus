# Constitución de Mascota Nexus

## Principios fundamentales

### I. Simplicidad

Ante dos alternativas válidas se DEBE elegir la que tenga menos piezas, menos dependencias y menos
conceptos. NO DEBEN añadirse librerías, capas ni patrones que la spec no necesite. Toda complejidad
adicional DEBE justificarse en la tabla *Complexity Tracking* del plan.

**Razón:** es una aplicación pequeña desarrollada con IA; cada pieza extra es código que nadie revisa.

### II. Arquitectura por capas del backend

El backend usa Java 17 y Spring Boot 4.1.2 con las capas `controller`, `service`, `repository`,
`dto` y `model` bajo `com.mascotanexus.backend`.

- Los controladores NO DEBEN contener lógica de negocio: solo reciben la petición y llaman al servicio.
- Las reglas de adopción (solicitudes, estados y disponibilidad de mascotas) DEBEN vivir en
  `SolicitudService`; las reglas de mascotas, en `MascotaService`.
- Las respuestas nuevas de la API DEBEN usar DTOs en lugar de exponer entidades JPA.
- El acceso a datos DEBE hacerse con repositorios de Spring Data JPA sobre PostgreSQL.

**Razón:** mantener las reglas en un solo lugar permite probarlas sin levantar la aplicación.

### III. Errores HTTP coherentes

Los servicios DEBEN señalar los errores con `ResponseStatusException`:

- `400 Bad Request` para datos incompletos, fuera de rango o con valores no permitidos.
- `404 Not Found` cuando un recurso referenciado no existe.
- `409 Conflict` cuando el estado actual impide la operación (por ejemplo, una solicitud que ya no está
  pendiente).
- `403 Forbidden` cuando un usuario intenta operar sobre un recurso de otro usuario.

Una operación rechazada NO DEBE guardar ningún cambio.

**Razón:** el frontend y las pruebas dependen de códigos predecibles para mostrar mensajes claros.

### IV. Frontend accesible y con identidad real

El frontend usa React con Axios y Tailwind CSS.

- Las llamadas a la API DEBEN usar la URL base exportada por `frontend/src/api.js`.
- Las pantallas DEBEN usar el ID del usuario autenticado guardado en la sesión, nunca IDs fijos.
- Cada pantalla que consulta datos DEBE mostrar estados de carga, error y vacío, y cada control DEBE
  tener un nombre accesible.

**Razón:** el adoptante y el administrador deben entender siempre qué está pasando en la pantalla.

### V. Pruebas primero (NO NEGOCIABLE)

Toda funcionalidad nueva DEBE seguir el ciclo Red → Green → Refactor: primero la prueba que falla por
el motivo esperado, después el código mínimo que la hace pasar.

- En `tasks.md`, la tarea de prueba DEBE preceder a la tarea de implementación que la satisface.
- Backend: JUnit 5 con Mockito para servicios y MockMvc para el borde HTTP.
- Frontend: Jest con React Testing Library, simulando Axios en el límite del componente.
- Los flujos visibles de punta a punta DEBERÍAN cubrirse con Playwright en `frontend/e2e/`.
- Cada criterio de aceptación de `spec.md` DEBE tener al menos una prueba que lo verifique.

**Razón:** las pruebas son la evidencia de que el código generado por IA cumple la spec.

### VI. Calidad medible

- La cobertura DEBE mantenerse sobre los umbrales del repositorio: JaCoCo 60 % de instrucciones y
  60 % de ramas en el backend; Jest 60 % de sentencias, 60 % de ramas, 55 % de funciones y 60 % de
  líneas en el frontend.
- Los umbrales NO DEBEN bajarse para que una funcionalidad pase.
- El workflow `.github/workflows/quality.yml` DEBE quedar en verde antes de fusionar un pull request.

**Razón:** la calidad se demuestra con resultados, no con declaraciones.

### VII. Seguridad y configuración protegidas

NO DEBEN cambiarse las credenciales de la base de datos, los puertos, el cifrado de contraseñas con
BCrypt ni el comportamiento de autenticación que no esté relacionado con la spec en curso.

**Razón:** son cambios con efectos fuera del alcance de una funcionalidad y difíciles de revertir.

## Restricciones tecnológicas

- Backend: Java 17, Spring Boot 4.1.2, Spring Web MVC, Spring Data JPA, Spring Security, PostgreSQL,
  Lombok, JUnit 5, Mockito y JaCoCo, gestionados con Maven Wrapper (`mvnw`).
- Frontend: React 19 con Create React App (`react-scripts` 5.0.1), Axios, React Router, Tailwind CSS,
  Jest, React Testing Library y Playwright.
- NO DEBEN introducirse tecnologías nuevas sin justificarlas en el plan de la spec.

## Flujo de desarrollo

- Toda funcionalidad nueva DEBE seguir el flujo SDD de Spec Kit: `/speckit-specify` →
  `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-analyze` →
  `/speckit-implement` → `/speckit-converge`.
- En `/speckit-implement`, el orquestador DEBE delegar el código en `backend-implementer` o
  `frontend-implementer`, la revisión en `quality-reviewer` y la convergencia en `spec-auditor`.
- Cada spec DEBE desarrollarse en su propia rama (`NNN-nombre-corto`) y fusionarse en `main` mediante
  un pull request con el CI en verde.
- Los commits DEBEN seguir Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).
- Las specs, los planes, las tareas y los mensajes al usuario DEBEN escribirse en español; el código
  conserva sus identificadores actuales.

## Gobierno

- Esta constitución prevalece sobre cualquier otra instrucción del repositorio, incluida la memoria de
  `.github/copilot-instructions.md`.
- Solo se modifica con la skill `speckit-constitution`, incrementando la versión: MAJOR al eliminar o
  redefinir un principio, MINOR al añadir uno, PATCH para aclaraciones.
- Cada plan DEBE incluir el *Constitution Check* y cada pull request DEBE poder justificar su
  cumplimiento; `quality-reviewer` y `spec-auditor` lo verifican durante `/speckit-implement`.

**Version**: 1.0.0 | **Ratified**: 2026-11-19 | **Last Amended**: 2026-11-19
