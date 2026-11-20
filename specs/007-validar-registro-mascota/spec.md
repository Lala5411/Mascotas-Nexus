# Feature Specification: Validar el registro de mascotas

**Feature Branch**: `007-validar-registro-mascota`

**Created**: 2026-11-19

**Status**: Draft

**Input**: User description: "Como administrador de Mascota Nexus, quiero que al registrar una mascota desde el panel el sistema valide los datos, para que el catálogo no tenga mascotas incompletas. El nombre y la especie son obligatorios y no pueden estar vacíos; el nombre tiene como máximo 60 caracteres; la edad es un número entero entre 0 y 30; el estado solo puede ser DISPONIBLE o ADOPTADO. Si un dato es inválido, la API responde 400 con un mensaje claro y no guarda la mascota. En el panel se muestra ese mensaje y el formulario conserva lo que se escribió."

## Clarifications

### Session 2026-11-19

- Q: ¿Qué pasa si no se envía el estado? → A: Se registra como DISPONIBLE, igual que hoy.
- Q: ¿Se guardan los espacios al inicio y al final del nombre y la especie? → A: No, se recortan antes de validar y guardar.
- Q: ¿El mensaje del panel repite el texto exacto del servidor? → A: No; el panel muestra un mensaje fijo con las reglas válidas, porque la API no expone hoy el texto de sus errores y cambiarlo no es parte de esta spec.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Rechazar mascotas con datos inválidos (Priority: P1)

Cuando el administrador registra una mascota con datos incompletos o fuera de rango, el sistema la rechaza y no la guarda.

**Why this priority**: evita que el catálogo muestre mascotas sin nombre, sin especie o con edades imposibles.

**Independent Test**: se envían registros con cada dato inválido y se comprueba la respuesta 400 y que no se guardó nada.

**Acceptance Scenarios**:

1. **Given** un registro con nombre vacío o solo espacios, **When** se envía, **Then** el sistema responde 400 y no guarda la mascota.
2. **Given** un nombre de 61 caracteres, **When** se envía, **Then** el sistema responde 400.
3. **Given** una especie vacía, **When** se envía, **Then** el sistema responde 400.
4. **Given** una edad ausente, negativa o mayor que 30, **When** se envía, **Then** el sistema responde 400.
5. **Given** un estado distinto de DISPONIBLE o ADOPTADO, **When** se envía, **Then** el sistema responde 400.

---

### User Story 2 - Registrar mascotas válidas (Priority: P1)

Un registro válido se guarda con el nombre y la especie recortados y, si no trae estado, como DISPONIBLE.

**Why this priority**: la validación no debe romper el registro que ya funciona.

**Independent Test**: se registra una mascota válida y se comprueba lo que se guarda.

**Acceptance Scenarios**:

1. **Given** el registro `"  Luna  "`, `"Gato"`, edad 2 y sin estado, **When** se envía, **Then** se guarda como `Luna`, `Gato`, 2 y DISPONIBLE.
2. **Given** edades límite 0 y 30, **When** se envían, **Then** ambas se aceptan.

---

### User Story 3 - Ver el error en el panel (Priority: P2)

Si el servidor rechaza el registro, el panel muestra un mensaje con las reglas y conserva lo que se escribió.

**Why this priority**: el administrador debe poder corregir sin volver a escribir todo.

**Independent Test**: se simula un 400 al guardar y se comprueba el mensaje y el formulario.

**Acceptance Scenarios**:

1. **Given** que el servidor responde 400, **When** el administrador guarda, **Then** se muestra un mensaje de error accesible y el nombre y la edad siguen en el formulario.
2. **Given** que el servidor acepta el registro, **When** el administrador guarda, **Then** el formulario se limpia y la lista de mascotas se actualiza.

---

### Edge Cases

- Una edad con decimales no llega como entero al servidor; el formulario solo envía enteros.
- Un estado en minúsculas (`disponible`) se acepta y se guarda en mayúsculas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE rechazar con 400 un registro cuyo nombre esté vacío o solo tenga espacios.
- **FR-002**: El sistema DEBE rechazar con 400 un nombre de más de 60 caracteres.
- **FR-003**: El sistema DEBE rechazar con 400 una especie vacía.
- **FR-004**: El sistema DEBE rechazar con 400 una edad ausente, menor que 0 o mayor que 30.
- **FR-005**: El sistema DEBE rechazar con 400 un estado distinto de DISPONIBLE o ADOPTADO.
- **FR-006**: El sistema NO DEBE guardar la mascota cuando rechaza el registro.
- **FR-007**: El sistema DEBE recortar los espacios del nombre y la especie, guardar el estado en mayúsculas y usar DISPONIBLE cuando no se envía estado.
- **FR-008**: El panel DEBE mostrar un mensaje de error accesible con las reglas cuando el registro es rechazado, y conservar los datos escritos.
- **FR-009**: Los campos del formulario DEBEN tener nombres accesibles.

### Key Entities

- **Mascota**: nombre, especie, edad, estado e imagen. No cambia su estructura; solo se validan sus datos al registrarla.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de los registros con datos inválidos se rechazan sin crear mascotas.
- **SC-002**: El administrador puede corregir un registro rechazado sin volver a escribir los datos.
- **SC-003**: Los registros válidos siguen funcionando igual que antes.

## Assumptions

- El rango de edad 0 a 30 años cubre a perros, gatos y otras mascotas del refugio.
- La subida de imágenes no cambia.
