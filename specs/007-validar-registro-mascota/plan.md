# Implementation Plan: Validar el registro de mascotas

**Branch**: `007-validar-registro-mascota` | **Date**: 2026-11-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-validar-registro-mascota/spec.md`

## Summary

`MascotaService.guardar` valida nombre, especie, edad y estado antes de guardar y lanza
`ResponseStatusException` 400 si algo es inválido (principios II y III). El endpoint
`POST /api/mascotas` no cambia. `AdminPanel.js` captura el error, muestra un mensaje accesible con las
reglas y conserva los datos del formulario; los campos reciben nombres accesibles.

## Technical Context

**Language/Version**: Java 17 (Spring Boot 4.1.2); JavaScript con React 19
**Primary Dependencies**: Spring Web MVC, Spring Data JPA; Axios, Tailwind CSS
**Storage**: PostgreSQL; sin cambios de esquema
**Testing**: JUnit 5 + Mockito + MockMvc; Jest + React Testing Library
**Target Platform**: API REST y aplicación web
**Project Type**: aplicación web (backend + frontend)
**Performance Goals**: N/A
**Constraints**: no cambiar la configuración de errores del servidor (principio I)
**Scale/Scope**: 1 método de servicio y el formulario del panel

## Constitution Check

| Principio | Cumplimiento |
| --- | --- |
| I. Simplicidad | Validación manual en el servicio, sin Bean Validation ni dependencias nuevas. ✅ |
| II. Arquitectura por capas | La regla vive en `MascotaService`; el controlador no cambia. ✅ |
| III. Errores HTTP | 400 para datos inválidos y no se guarda nada. ✅ |
| IV. Frontend accesible | Campos con `aria-label` y error con `role="alert"`. ✅ |
| V. Pruebas primero | Pruebas de servicio, HTTP y del panel antes del código. ✅ |
| VI. Calidad medible | Se añade la primera prueba de `AdminPanel`, que hoy no tiene cobertura. ✅ |
| VII. Seguridad | Sin cambios de configuración ni autenticación. ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/007-validar-registro-mascota/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/registrar-mascota.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/src/main/java/com/mascotanexus/backend/service/MascotaService.java
backend/src/test/java/com/mascotanexus/backend/service/MascotaServiceRegistroTest.java
backend/src/test/java/com/mascotanexus/backend/controller/MascotaRegistroHttpTest.java
frontend/src/components/AdminPanel.js
frontend/src/components/AdminPanel.test.js
```

**Structure Decision**: aplicación web existente; se añaden dos clases de prueba en el backend y la
primera prueba de `AdminPanel`.

## Complexity Tracking

Sin desviaciones de la constitución.
