# Plan: Filtrado dinámico de mascotas

1. Añadir a `MascotaRepository` una consulta de mascotas disponibles con filtros opcionales por especie y edad máxima.
2. Normalizar la especie vacía en `MascotaService` y convertir entidades a `MascotaResponse`.
3. Exponer `GET /api/mascotas/filtrar` en `MascotaController` y rechazar edades negativas.
4. Añadir pruebas focalizadas para repositorio, servicio y controlador.
5. Ejecutar `.\mvnw.cmd test` desde `backend/`.

## Archivos

- Backend: `backend/src/main/java/com/mascotanexus/backend/repository/MascotaRepository.java`, `service/MascotaService.java`, `controller/MascotaController.java` y `dto/MascotaResponse.java`.
- Pruebas: `backend/src/test/java/com/mascotanexus/backend/repository/MascotaRepositoryTest.java`, `service/MascotaServiceTest.java` y `controller/MascotaControllerTest.java`.

La aplicación declara Spring Boot 4.1.2 en `backend/pom.xml`; esta funcionalidad no requiere modificar la versión.
