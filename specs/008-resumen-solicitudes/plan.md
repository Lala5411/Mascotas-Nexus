# Implementation Plan: Resumen de solicitudes para el administrador

**Branch**: `008-resumen-solicitudes` | **Date**: 2026-11-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-resumen-solicitudes/spec.md`

## Summary

`SolicitudRepository` añade `countByEstado`. `SolicitudService.resumenPorEstado()` arma un DTO
`ResumenSolicitudesResponse` (`pendientes`, `aprobadas`, `rechazadas`, `canceladas`, `total`) y
`GET /api/solicitudes/resumen` lo devuelve. `AdminPanel.js` lo carga al abrir y tras aprobar o
rechazar, con mensajes de carga y error.

## Technical Context

**Language/Version**: Java 17 (Spring Boot 4.1.2); JavaScript con React 19
**Primary Dependencies**: Spring Data JPA (consulta derivada), Lombok; Axios, Tailwind CSS
**Storage**: PostgreSQL; sin cambios de esquema
**Testing**: JUnit 5 + Mockito + MockMvc; Jest + React Testing Library
**Target Platform**: API REST y aplicación web
**Project Type**: aplicación web (backend + frontend)
**Performance Goals**: N/A (4 consultas de conteo)
**Constraints**: sin dependencias nuevas
**Scale/Scope**: 1 consulta, 1 DTO, 1 endpoint y 1 sección del panel

## Constitution Check

| Principio | Cumplimiento |
| --- | --- |
| I. Simplicidad | Consulta derivada `countByEstado`; sin SQL a mano ni librerías nuevas. ✅ |
| II. Arquitectura por capas | Conteo en el repositorio, armado en el servicio, DTO en la respuesta. ✅ |
| III. Errores HTTP | Endpoint de lectura sin casos de error de negocio. ✅ |
| IV. Frontend accesible | Región con nombre accesible, carga con `role="status"` y error con `role="alert"`. ✅ |
| V. Pruebas primero | Pruebas de servicio, HTTP y del panel antes del código. ✅ |
| VI. Calidad medible | Se mantienen los umbrales. ✅ |
| VII. Seguridad | Sin cambios. ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/008-resumen-solicitudes/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/resumen-solicitudes.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/src/main/java/com/mascotanexus/backend/
├── dto/ResumenSolicitudesResponse.java     # nuevo
├── repository/SolicitudRepository.java     # countByEstado
├── service/SolicitudService.java           # resumenPorEstado()
└── controller/SolicitudController.java     # GET /resumen
backend/src/test/java/com/mascotanexus/backend/
├── service/SolicitudServiceResumenTest.java
└── controller/SolicitudControllerHttpTest.java
frontend/src/components/AdminPanel.js
frontend/src/components/AdminPanel.test.js
```

**Structure Decision**: aplicación web existente.

## Complexity Tracking

Sin desviaciones de la constitución.
