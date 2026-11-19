# Mascota Nexus

Aplicación de adopción con backend Java 17 / Spring Boot en `backend/`, frontend React en `frontend/` y PostgreSQL como base de datos.

## Arnés de Copilot

El repositorio está configurado para GitHub Copilot en VS Code. La memoria y las convenciones generales están en `.github/copilot-instructions.md`; los agentes están en `.github/agents/` y las skills del workspace en `.github/skills/`. Los módulos también conservan instrucciones y skills complementarias en `backend/.github/` y `frontend/.github/`.

### Skills y asignación a agentes

| Skill | Ubicación | Problema que resuelve | Cuándo se invoca | Agentes que la usan |
|---|---|---|---|---|
| `spring-service-testing` | `.github/skills/` | Pruebas de servicios, controladores, repositorios y reglas de negocio del backend. | Al cambiar o probar código Java del backend. | `backend-implementer`, `quality-reviewer` |
| `react-accessible-flows` | `.github/skills/` | Flujos React accesibles, pruebas de interfaz, identidad del usuario y estados asíncronos. | Al cambiar componentes o pruebas de `frontend/src/`. | `frontend-implementer`, `quality-reviewer` |
| `adoption-flow-validation` | `.github/skills/` | Validación de postulaciones, persistencia, transiciones de estado y resultados visibles para el adoptante, incluidas las pruebas Playwright. | Al cambiar datos de la solicitud, reglas de envío, historial o decisiones del administrador. | `backend-implementer`, `frontend-implementer`, `quality-reviewer` |
| `java-spring-best-practices` | `backend/.github/skills/` | Arquitectura por capas, DTOs y manejo de errores en servicios Spring. | Al abrir `backend/` como espacio de trabajo propio. | Complementaria, no asignada en el frontmatter de los agentes. |
| `web-design-guidelines` | `frontend/.github/skills/` | Accesibilidad, diseño responsive y patrones Tailwind de la interfaz. | Al abrir `frontend/` como espacio de trabajo propio. | Complementaria, no asignada en el frontmatter de los agentes. |

La asignación de skills a agentes está declarada en el campo `skills:` de cada archivo de `.github/agents/`. Las dos últimas skills son complementarias y están disponibles junto a las instrucciones de cada módulo.

### Agentes y herramientas permitidas

| Agente | Responsabilidad | Modelo | Herramientas |
|---|---|---|---|
| `backend-implementer` | Implementar y probar backend respetando controller/service/repository. | `GPT-4.1` | `read`, `search`, `edit`, `execute` |
| `frontend-implementer` | Implementar flujos React accesibles, API y pruebas de interacción. | `GPT-4.1` | `read`, `search`, `edit`, `execute` |
| `quality-reviewer` | Revisar ambos módulos y ejecutar verificaciones sin herramienta de edición de archivos. | `GPT-4.1` | `read`, `search`, `execute` |

Las listas de herramientas limitan las herramientas disponibles para cada agente; el agente de calidad no tiene la herramienta `edit`. La ejecución de comandos no equivale a un aislamiento del sistema operativo.

La separación de roles corresponde a los dos módulos de la aplicación y a una revisión transversal: cada implementador trabaja en su módulo y el revisor verifica la integración. Los pull requests y CI sirven como controles de integración, sin añadir un coordinador para este conjunto acotado de funcionalidades.

### Cómo se usa el arnés

1. **Spec → plan → tasks:** crea o actualiza `specs/NN-nombre/spec.md`, `plan.md` y `tasks.md`, revisando los requisitos y las pruebas existentes. No hay un comando ni un agente dedicado a generar estos tres archivos: son artefactos Markdown del repositorio.
   ```powershell
   Get-Content .\specs\NN-nombre\spec.md, .\specs\NN-nombre\plan.md, .\specs\NN-nombre\tasks.md
   ```
2. **Implementación por módulo:** en Copilot Chat selecciona `backend-implementer` o `frontend-implementer`, según los archivos implicados, y proporciona los requisitos y la spec. Ejecuta las verificaciones del módulo:
   ```powershell
   Set-Location backend; .\mvnw.cmd verify
   Set-Location ..\frontend; npm test -- --watchAll=false --coverage; npm run build
   ```
3. **Revisión:** selecciona `quality-reviewer` en Copilot Chat y solicita revisión del diff y ejecución de las verificaciones relevantes. Para una revisión transversal:
   ```powershell
   Set-Location backend; .\mvnw.cmd verify
   Set-Location ..\frontend; npm test -- --watchAll=false --coverage; npm run build
   ```
4. **Pull request:** crea una rama descriptiva, confirma solo los cambios revisados con Conventional Commits, súbela y abre un PR hacia `main`:
   ```powershell
   git switch -c feat/nombre-de-la-funcionalidad
   git add <archivos-revisados>
   git commit -m "feat: describe la funcionalidad"
   git push -u origin feat/nombre-de-la-funcionalidad
   ```
   La creación del PR se realiza en GitHub; no hay un comando de PR configurado en el repositorio.
5. **CI:** al abrir o actualizar el PR, GitHub ejecuta automáticamente el workflow de calidad. Confirma los jobs y descarga sus artefactos de cobertura antes de fusionar.

## Desarrollo guiado por especificaciones

Se usa la estructura propia `spec → plan → tasks → implementación/pruebas`; no se usa Spec Kit. Las cinco funcionalidades tienen especificación, plan y tareas completadas en `specs/`:

| Spec | Funcionalidad | Pull request fusionado |
|---|---|---|
| `specs/01-filtrado-mascotas/` | Filtrar mascotas disponibles por especie y edad máxima. | [#1](https://github.com/Lala5411/Mascotas-Nexus/pull/1) |
| `specs/02-busqueda-catalogo/` | Buscar y filtrar en el catálogo. | [#2](https://github.com/Lala5411/Mascotas-Nexus/pull/2) |
| `specs/03-historial-solicitudes/` | Guardar y consultar postulaciones del usuario. | [#3](https://github.com/Lala5411/Mascotas-Nexus/pull/3) |
| `specs/04-validacion-solicitudes/` | Validar postulaciones e invariantes de adopción. | [#4](https://github.com/Lala5411/Mascotas-Nexus/pull/4) |
| `specs/05-transiciones-solicitudes/` | Aprobar o rechazar solicitudes pendientes de forma segura. | [#5](https://github.com/Lala5411/Mascotas-Nexus/pull/5) |

## Mecanismos de calidad

El workflow `.github/workflows/quality.yml` ejecuta:

- Pruebas de backend contra PostgreSQL y JaCoCo; la cobertura global debe alcanzar al menos 60% de instrucciones y 60% de ramas.
- Pruebas frontend con Jest y compilación de producción; los umbrales globales son 60% de sentencias, 60% de ramas, 55% de funciones y 60% de líneas.
- Pruebas de extremo a extremo con Playwright (`frontend/e2e/`, configuración en `frontend/playwright.config.js`) contra una base PostgreSQL aislada `mascota_nexus_e2e`; se ejecutan localmente con `npm run test:e2e` desde `frontend/`.
- Artefactos de cobertura de backend y frontend, y el informe `playwright-report`, retenidos durante siete días en las ejecuciones de CI.

Las pruebas backend están en [`backend/src/test/java/`](./backend/src/test/java/) y las pruebas frontend junto a los componentes en [`frontend/src/components/`](./frontend/src/components/). Los informes locales se generan en [`backend/target/site/jacoco/`](./backend/target/site/jacoco/) al ejecutar `.\mvnw.cmd verify` y [`frontend/coverage/`](./frontend/coverage/) al ejecutar Jest con `--coverage`. Son salidas generadas y no están versionadas. El workflow [quality.yml](./.github/workflows/quality.yml) publica esos directorios como artefactos `backend-coverage` y `frontend-coverage`; esta rama no tiene todavía una ejecución de CI ni artefactos remotos.

El historial de PRs incluye [#1](https://github.com/Lala5411/Mascotas-Nexus/pull/1), [#2](https://github.com/Lala5411/Mascotas-Nexus/pull/2), [#3](https://github.com/Lala5411/Mascotas-Nexus/pull/3), [#4](https://github.com/Lala5411/Mascotas-Nexus/pull/4) y [#5](https://github.com/Lala5411/Mascotas-Nexus/pull/5). Esos enlaces son evidencia de integración; no sustituyen los informes de cobertura o los resultados de CI.

## Cambios respecto del taller

| Cambio observado al ejecutar las specs | Motivo |
|---|---|
<!-- COMPLETAR: qué cambió y por qué, con lo observado al ejecutar las specs -->

## Ejecución local

Inicia PostgreSQL según la configuración de `backend/src/main/resources/application.properties`. Luego ejecuta el backend:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

En otra terminal, inicia el frontend:

```powershell
cd frontend
npm start
```

Ejecuta los controles desde el directorio de cada módulo:

```powershell
# backend
.\mvnw.cmd test

# frontend
npm test -- --watchAll=false
npm test -- --watchAll=false --coverage
npm run build
```
