# Implementation Plan: Ordenar el catálogo

**Branch**: `009-ordenar-catalogo` | **Date**: 2026-11-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-ordenar-catalogo/spec.md`

## Summary

`Catalogo.js` añade el estado `orden` y un `<select>` con etiqueta «Ordenar por» junto a los filtros.
El `useMemo` que hoy produce `mascotasFiltradas` aplica después el orden elegido sobre una copia de la
lista, con `localeCompare` en español y desempate por nombre. No hay cambios en el backend.

## Technical Context

**Language/Version**: JavaScript con React 19
**Primary Dependencies**: React (useState, useMemo), Tailwind CSS
**Storage**: N/A
**Testing**: Jest + React Testing Library
**Target Platform**: aplicación web
**Project Type**: aplicación web (solo frontend)
**Performance Goals**: N/A (ordenar decenas de tarjetas en memoria)
**Constraints**: sin peticiones nuevas al backend
**Scale/Scope**: 1 componente y su archivo de pruebas

## Constitution Check

| Principio | Cumplimiento |
| --- | --- |
| I. Simplicidad | Orden en memoria con `Array.prototype.sort` sobre una copia; sin librerías. ✅ |
| II. Arquitectura por capas | No aplica al backend; no hay cambios ahí. ✅ |
| III. Errores HTTP | No hay llamadas nuevas. ✅ |
| IV. Frontend accesible | `<select>` con `<label>` asociado, navegable con teclado. ✅ |
| V. Pruebas primero | Pruebas de `Catalogo` antes del código. ✅ |
| VI. Calidad medible | Se mantienen los umbrales de Jest. ✅ |
| VII. Seguridad | Sin cambios. ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/009-ordenar-catalogo/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ui-ordenar-catalogo.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
frontend/src/components/Catalogo.js
frontend/src/components/Catalogo.test.js
```

**Structure Decision**: solo frontend; un componente existente.

## Complexity Tracking

Sin desviaciones de la constitución.
