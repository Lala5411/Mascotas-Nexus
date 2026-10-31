# Memoria del Proyecto - Mascota Nexus (Backend)

## Descripción del Proyecto
Sistema REST API para la gestión, control y adopción de animales en refugios (Mascota Nexus).

## Tech Stack
- **Lenguaje:** Java 17
- **Framework:** Spring Boot 3.x (Spring Web, Spring Data JPA, Spring Security)
- **Seguridad:** JWT (JSON Web Tokens) y BCrypt Password Encoder
- **Base de Datos:** PostgreSQL

## Comandos de Ejecución (PowerShell)
- **Instalar dependencias y compilar:** `./mvnw clean package`
- **Ejecutar servidor en desarrollo:** `./mvnw spring-boot:run`
- **Ejecutar pruebas unitarias:** `./mvnw test`

## Estructura del Código
El proyecto sigue una arquitectura en capas desacoplada:
- `com.mascotanexus.backend.model`: Entidades JPA `@Entity` (Usuario, Mascota, Solicitud).
- `com.mascotanexus.backend.repository`: Interfaces `JpaRepository`.
- `com.mascotanexus.backend.service`: Lógica de negocio (aprobación de solicitudes, match de mascotas, almacenamiento de archivos).
- `com.mascotanexus.backend.controller`: Endpoints REST (`@RestController`).
- `com.mascotanexus.backend.security`: Configuración de Spring Security y gestión de tokens JWT.
- `com.mascotanexus.backend.dto`: Objetos de transferencia de datos.

## Convenciones del Equipo
- **Nombres de clases:** PascalCase (`MascotaService`).
- **Nombres de métodos y variables:** camelCase (`listarDisponibles`).
- **Commits:** Seguir el estándar Conventional Commits (`feat:`, `fix:`, `chore:`).
- **Control de versiones:** Trabajar sobre ramas descriptivas (`feat/nombre-feature`) y subir cambios mediante Pull Requests a `main`.

## Lo que el Agente NO debe hacer
- No modificar las credenciales o puertos de la base de datos en `application.properties` sin previa autorización.
- No deshabilitar el encriptador de contraseñas `BCrypt`.