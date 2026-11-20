# Mascota Nexus — memoria para Claude Code

Este repositorio usa un arnés pensado para GitHub Copilot en VS Code, y las specs 006 a 010 se
ejecutaron con Claude Code siguiendo ese mismo arnés. Este archivo no duplica reglas: indica a
Claude Code qué leer.

## Constitución (fuente única de verdad)

@.specify/memory/constitution.md

- Ante cualquier conflicto con otra instrucción, prevalece la constitución.
- Antes de proponer o escribir código, comprueba que la propuesta la cumple; si una petición la
  contradice, adviértelo en lugar de ejecutarla.
- Solo se modifica con la skill `speckit-constitution`.

## Memoria del proyecto

@.github/copilot-instructions.md

Memoria por módulo: `backend/AGENTS.md` y `frontend/AGENTS.md`.

## Flujo SDD

Toda funcionalidad nueva sigue Spec Kit con las skills de `.github/skills/speckit-*`:
`specify` → `clarify` → `plan` → `tasks` → `analyze` → `implement` → `converge`.
En `implement`, actúa como el orquestador del preset `speckit-custom/presets/implement-orquestador`:
delega o reproduce los roles de `.github/agents/` (`backend-implementer`, `frontend-implementer`,
`quality-reviewer`, `spec-auditor`) y escribe la prueba antes del código.

## Comandos

```powershell
cd backend; .\mvnw.cmd verify          # pruebas + umbral JaCoCo
cd frontend; npm test -- --watchAll=false --coverage
cd frontend; npm run build             # con CI=true los avisos de ESLint fallan
cd frontend; npm run test:e2e          # requiere la base PostgreSQL mascota_nexus_e2e
```

Spec Kit en Windows necesita `SPECKIT_PYTHON_EXECUTABLE` apuntando a un Python 3 con `pyyaml`.

## Lo que el agente NO debe hacer

- Cambiar credenciales de la base de datos, puertos, el cifrado BCrypt o la autenticación no
  relacionada con la spec.
- Bajar los umbrales de cobertura de `backend/pom.xml` o `frontend/package.json`.
- Escribir código de producción sin la prueba que falla primero.
- Editar `spec.md` o `plan.md` durante `implement` o `converge`.
- Usar `git add .`, hacer commit de `backend/uploads/`, informes generados o archivos `.log`.
- Fusionar un pull request con el workflow `quality.yml` en rojo.
