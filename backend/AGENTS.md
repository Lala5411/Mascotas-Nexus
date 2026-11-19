# Memoria del proyecto - Backend

## Stack y estructura

- Java 17, Spring Boot 4.1.2, Spring Web MVC, Spring Data JPA y Spring Security.
- PostgreSQL; JWT mediante JJWT y contraseñas con BCrypt.
- Código Java bajo `src/main/java/com/mascotanexus/backend/`, organizado en `controller/`, `dto/`, `model/`, `repository/`, `security/` y `service/`.
- Pruebas JUnit bajo `src/test/java/`.

## Comandos (PowerShell)

- Ejecutar: `.\mvnw.cmd spring-boot:run`
- Probar: `.\mvnw.cmd test`
- Probar y validar cobertura: `.\mvnw.cmd verify`

Mantén la separación controller/service/repository y no cambies credenciales, puertos ni el uso de BCrypt.