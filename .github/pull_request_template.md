## Spec

<!-- Carpeta de la spec, por ejemplo specs/011-nombre-corto/ -->

## Flujo SDD seguido

- [ ] `/speckit-specify` y `/speckit-clarify`
- [ ] `/speckit-plan` con el *Constitution Check* en verde
- [ ] `/speckit-tasks` con cada prueba antes de su implementación
- [ ] `/speckit-analyze` sin problemas CRITICAL o HIGH
- [ ] `/speckit-implement` (orquestador y agentes)
- [ ] `/speckit-converge` con resultado `converged` registrado en `tasks.md`

## Evidencia de calidad

- [ ] `.\mvnw.cmd verify` en verde (umbral JaCoCo)
- [ ] `npm test -- --watchAll=false --coverage` en verde (umbral Jest)
- [ ] `npm run build` sin avisos
- [ ] `npm run test:e2e` si cambió un flujo visible
- [ ] Workflow `quality.yml` en verde en este PR

## Revisión

<!-- Hallazgos de quality-reviewer y qué se hizo con cada uno (aceptado o descartado y por qué) -->
