# Instrucciones de Copilot - Mascota Nexus Backend

- Al generar código Java, utiliza únicamente características compatibles con Java 17.
- Garantiza que todos los nuevos DTOs utilicen las anotaciones de Lombok (`@Data`, `@AllArgsConstructor`, etc.).
- Todo endpoint sensible debe incluir anotaciones de seguridad y validación de tipos genéricos en `ResponseEntity<T>`.
- Siempre que implementes un método en Service, incluye manejo explícito de excepciones.
- Responde siempre en español y con comentarios explicativos claros sobre la arquitectura en capas.