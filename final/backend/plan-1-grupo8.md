/plan [Qué quiero] Implementar un endpoint REST de filtrado dinámico de mascotas por especie y edad máxima. [Para quién] Para los usuarios adoptantes de Mascota Nexus. [Contexto] Sistema Spring Boot 3, JPA y PostgreSQL. [Formato del Plan] Plan paso a paso en Markdown especificando archivos a tocar, firmas de métodos y pruebas. [Restricciones] Mantener arquitectura por capas, DTOs ResponseEntity y convenciones de AGENTS.md.

**Plan: filtrado dinámico de mascotas**
**Objetivo:** agregar GET /api/mascotas/filtrar para que los adoptantes busquen mascotas disponibles por especie, edad máxima o ambos criterios. Los parámetros serán opcionales; la edad máxima será inclusiva. La especie vacía se ignorará y se comparará sin distinguir mayúsculas/minúsculas. Una edad negativa devolverá 400 Bad Request.

**Pasos**
**1. Añadir la consulta al repositorio en MascotaRepository.java.**

- Firma propuesta: List<Mascota> filtrarDisponibles(String especie, Integer edadMaxima).

- Implementar la consulta JPA con filtros opcionales, estado DISPONIBLE, coincidencia de especie sin distinguir mayúsculas y edad <= edadMaxima.

**2. Definir el DTO de respuesta en un archivo nuevo:** 

backend/src/main/java/com/mascotanexus/backend/dto/MascotaResponse.java.

- Incluir los campos públicos del catálogo: id, nombre, especie, edad, estado e imagenUrl.

- No exponer la entidad JPA desde el nuevo endpoint.

3. **Implementar la lógica en el servicio en MascotaService.java.**

- **Firma propuesta:** 
List<MascotaResponse> filtrarDisponibles(String especie, Integer edadMaxima).

- Normalizar la especie vacía o con espacios como filtro ausente y transformar las entidades a DTOs.

4. **Exponer el endpoint en MascotaController.java.**

- **Firma propuesta:** ResponseEntity<List<MascotaResponse>> filtrarMascotas(String especie, Integer edadMaxima).

- Recibir ambos parámetros como opcionales; devolver 400 si la edad máxima es negativa y 200 con la lista —incluida una lista vacía— para consultas válidas.

5. **Agregar pruebas:**

- **Servicio:** sin filtros, solo especie, solo edad, ambos filtros, especie vacía y mapeo a DTO.

- **Controlador:** respuestas 200, filtros opcionales, lista vacía y edad negativa con 400.

- **Repositorio:** verificar que la consulta aplique correctamente estado, especie y edad en el entorno de pruebas disponible.

6. **Validar con** ./mvnw test desde backend y comprobar que las rutas existentes de listado y mascotas disponibles mantienen su comportamiento.

- **Consideración:** backend/AGENTS.md indica Spring Boot 3.x, pero el pom.xml consultado declara el parent 4.1.2. El plan no propone cambiar la versión; conviene aclarar esa discrepancia antes de implementar o interpretar errores de compatibilidad.

No modifiqué archivos; dejo el plan aquí para que puedas revisarlo.