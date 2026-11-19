---
name: java-spring-best-practices
description: Buenas prácticas de arquitectura, manejo de excepciones y Spring Boot 3. Usar al crear Controllers, Services, DTOs o refactorizar lógica en Java.
---

# Java & Spring Boot Best Practices

## 🏛️ Capas de Arquitectura
- **Controller:** Los controladores deben limitarse a mapear peticiones HTTP y llamar servicios. No colocar lógica de negocio en el controller.
- **Service:** Toda la lógica de negocio, validaciones y transformaciones deben residir en la capa de servicios `@Service`.
- **DTOs:** Utilizar DTOs para las peticiones y respuestas en los endpoints REST; no exponer entidades JPA directamente cuando contengan datos sensibles.

## 🔐 Seguridad y Excepciones
- Retornar siempre respuestas tipadas con `ResponseEntity<T>`.
- Manejar excepciones explícitas y evitar bloques `catch` vacíos.