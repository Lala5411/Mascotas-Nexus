# Implementation Plan: Proteger la eliminación de mascotas

**Branch**: `010-proteger-eliminacion-mascota` | **Date**: 2026-11-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-proteger-eliminacion-mascota/spec.md`

## Summary

`MascotaService.eliminar` comprueba primero que la mascota exista (404) y luego que no tenga
solicitudes: pendientes (409, mensaje propio) o resueltas (409, mensaje de historial). Para eso
`MascotaService` recibe también `SolicitudRepository`, que añade `existsByMascotaIdAndEstado` y
`existsByMascotaId`. En `AdminPanel.js`, `eliminarMascota` captura el error y muestra un mensaje
accesible con el nombre de la mascota.

## Technical Context

**Language/Version**: Java 17 (Spring Boot 4.1.2); JavaScript con React 19
**Primary Dependencies**: Spring Data JPA (consultas derivadas); Axios, Tailwind CSS
**Storage**: PostgreSQL; sin cambios de esquema
**Testing**: JUnit 5 + Mockito + MockMvc; Jest + React Testing Library
**Target Platform**: API REST y aplicación web
**Project Type**: aplicación web (backend + frontend)
**Performance Goals**: N/A
**Constraints**: sin cambios de esquema ni borrado en cascada (se conserva el historial)
**Scale/Scope**: 1 método de servicio, 2 consultas derivadas y el botón «Eliminar» del panel

## Constitution Check

| Principio | Cumplimiento |
| --- | --- |
| I. Simplicidad | Dos consultas derivadas `exists...`; sin cascadas ni borrado lógico. ✅ |
| II. Arquitectura por capas | La regla vive en `MascotaService`; el controlador no cambia. ✅ |
| III. Errores HTTP | 404 inexistente, 409 con solicitudes; no se borra nada al rechazar. ✅ |
| IV. Frontend accesible | Mensaje con `role="alert"` y el nombre de la mascota. ✅ |
| V. Pruebas primero | Pruebas de servicio, HTTP y del panel antes del código. ✅ |
| VI. Calidad medible | Se mantienen los umbrales. ✅ |
| VII. Seguridad | Sin cambios. ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/010-proteger-eliminacion-mascota/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/eliminar-mascota.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/src/main/java/com/mascotanexus/backend/
├── repository/SolicitudRepository.java      # existsByMascotaIdAndEstado, existsByMascotaId
└── service/MascotaService.java              # eliminar(...) con las reglas; nuevo constructor
backend/src/test/java/com/mascotanexus/backend/
├── service/MascotaServiceEliminarTest.java  # nuevo
├── controller/MascotaRegistroHttpTest.java  # prueba HTTP del DELETE
└── service/MascotaServiceTest.java, MascotaServiceRegistroTest.java  # constructor actualizado
frontend/src/components/AdminPanel.js
frontend/src/components/AdminPanel.test.js
```

**Structure Decision**: aplicación web existente.

## Complexity Tracking

| Cambio | Por qué es necesario | Alternativa más simple descartada |
| --- | --- | --- |
| `MascotaService` depende de `SolicitudRepository` | La regla de borrado necesita saber si hay solicitudes | Comprobarlo en el controlador: viola el principio II |
