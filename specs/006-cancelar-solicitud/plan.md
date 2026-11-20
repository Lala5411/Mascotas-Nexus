# Implementation Plan: Cancelar una solicitud de adopción pendiente

**Branch**: `006-cancelar-solicitud` | **Date**: 2026-11-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-cancelar-solicitud/spec.md`

## Summary

El adoptante cancela una solicitud propia en estado PENDIENTE. El backend añade la operación
`cancelar` a `SolicitudService` (regla de adopción, principio II) con los códigos 400, 403, 404 y 409
(principio III), y un endpoint `PUT /api/solicitudes/{id}/cancelar?usuarioId={id}` que devuelve un
`SolicitudResponse`. El historial de `Catalogo.js` muestra el botón «Cancelar» solo en las pendientes
y actualiza la fila con la respuesta. La regla existente de `cambiarEstado` ya rechaza con 409
cualquier solicitud que no esté PENDIENTE, así que una CANCELADA no se puede aprobar ni rechazar.

## Technical Context

**Language/Version**: Java 17 (Spring Boot 4.1.2); JavaScript con React 19
**Primary Dependencies**: Spring Web MVC, Spring Data JPA; Axios, Tailwind CSS
**Storage**: PostgreSQL; la columna `estado` es texto libre, CANCELADA no requiere migración
**Testing**: JUnit 5 + Mockito + MockMvc; Jest + React Testing Library
**Target Platform**: API REST en servidor y aplicación web en navegador
**Project Type**: aplicación web (backend + frontend)
**Performance Goals**: N/A (operación sobre un solo registro)
**Constraints**: no cambiar autenticación, credenciales ni puertos (principio VII)
**Scale/Scope**: 1 endpoint nuevo, 1 método de servicio, cambios en una tabla del historial

## Constitution Check

| Principio | Cumplimiento |
| --- | --- |
| I. Simplicidad | Sin dependencias nuevas; reutiliza `SolicitudResponse` y el identificador de sesión existente. ✅ |
| II. Arquitectura por capas | La regla vive en `SolicitudService`; el controlador solo delega. ✅ |
| III. Errores HTTP | 400 sin usuario, 404 inexistente, 403 ajena, 409 no pendiente; nada se guarda al rechazar. ✅ |
| IV. Frontend accesible | Botón con nombre accesible por mascota y mensaje de error con `role="alert"`. ✅ |
| V. Pruebas primero | Cada tarea de implementación va precedida de su prueba en `tasks.md`. ✅ |
| VI. Calidad medible | Se mantiene `mvnw verify` y la cobertura de Jest sobre los umbrales. ✅ |
| VII. Seguridad | No se toca la autenticación; la identidad se pasa igual que en el historial. ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/006-cancelar-solicitud/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── cancelar-solicitud.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/src/main/java/com/mascotanexus/backend/
├── controller/SolicitudController.java      # nuevo endpoint PUT /{id}/cancelar
└── service/SolicitudService.java            # nuevo método cancelar(...)
backend/src/test/java/com/mascotanexus/backend/
├── service/SolicitudServiceCancelTest.java  # nuevas pruebas de la regla
└── controller/SolicitudControllerHttpTest.java  # pruebas HTTP del endpoint
frontend/src/components/
├── Catalogo.js                              # botón Cancelar y estado CANCELADA
└── Catalogo.test.js                         # pruebas del historial
```

**Structure Decision**: aplicación web existente (`backend/` + `frontend/`); se modifican archivos
actuales y se añade una clase de prueba de servicio.

## Complexity Tracking

Sin desviaciones de la constitución.
