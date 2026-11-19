---
name: spring-service-testing
description: Añade pruebas focalizadas para servicios de Spring, controladores REST y repositorios JPA.
---

# Pruebas de servicios Spring

1. Cubre las reglas de negocio en pruebas de servicio con repositorios simulados y comprueba tanto el estado devuelto como las interacciones con el repositorio.
2. Cubre la forma de las respuestas y los códigos de estado de los controladores en el borde HTTP; deja que Spring traduzca `ResponseStatusException` en lugar de duplicar las reglas de negocio.
3. Usa `@DataJpaTest` para las consultas derivadas y el comportamiento de JPQL, con valores de prueba distintos y el servicio PostgreSQL de pruebas que usa el CI.
4. Incluye casos límite y de transiciones rechazadas en los flujos de adopción.
5. Ejecuta `./mvnw test` desde `backend/` e informa explícitamente los fallos de base de datos o de pruebas.
