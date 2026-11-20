# Feature Specification: Ordenar el catálogo

**Feature Branch**: `009-ordenar-catalogo`

**Created**: 2026-11-19

**Status**: Draft

**Input**: User description: "Como adoptante de Mascota Nexus, quiero ordenar las mascotas disponibles del catálogo por nombre (de la A a la Z) o por edad (de menor a mayor y de mayor a menor), para encontrar más rápido la que busco. El orden se combina con la búsqueda por nombre y el filtro por especie que ya existen, se aplica en el frontend sin hacer peticiones nuevas al backend, y el selector de orden tiene un nombre accesible y se puede usar con el teclado. Por defecto se mantiene el orden actual."

## Clarifications

### Session 2026-11-19

- Q: ¿Cómo se ordenan dos mascotas con la misma edad? → A: Por nombre, de la A a la Z, para que el orden sea siempre el mismo.
- Q: ¿El orden distingue mayúsculas y tildes? → A: No; se compara como lo haría una persona en español.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ordenar por nombre o edad (Priority: P1)

El adoptante elige un orden en el selector «Ordenar por» y las tarjetas del catálogo se reordenan al instante.

**Why this priority**: es el valor completo de la funcionalidad.

**Independent Test**: con Luna (2), Nube (1) y Rocky (4), se elige cada orden y se compara la secuencia de tarjetas.

**Acceptance Scenarios**:

1. **Given** el catálogo con Luna (2), Nube (1) y Rocky (4), **When** se elige «Nombre (A-Z)», **Then** el orden es Luna, Nube, Rocky.
2. **Given** el mismo catálogo, **When** se elige «Edad: menor a mayor», **Then** el orden es Nube, Luna, Rocky.
3. **Given** el mismo catálogo, **When** se elige «Edad: mayor a menor», **Then** el orden es Rocky, Luna, Nube.
4. **Given** que no se elige ningún orden, **When** se abre el catálogo, **Then** se mantiene el orden en que llegan las mascotas.

---

### User Story 2 - Combinar con búsqueda y filtro (Priority: P2)

El orden elegido se mantiene al buscar por nombre o filtrar por especie, sin pedir datos nuevos al servidor.

**Why this priority**: el orden debe convivir con las herramientas que ya existen (spec 002).

**Independent Test**: se elige un orden, se escribe una búsqueda y se comprueba que el resultado sigue ordenado y que no hubo peticiones nuevas.

**Acceptance Scenarios**:

1. **Given** el orden «Edad: mayor a menor», **When** se busca «u», **Then** se ven Luna y Nube, en ese orden.
2. **Given** el catálogo cargado, **When** se cambia el orden, **Then** no se hace ninguna petición nueva al servidor.

---

### Edge Cases

- Con una sola mascota o ninguna, el selector se puede usar y no hay errores.
- Dos mascotas con la misma edad se ordenan por nombre.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El catálogo DEBE ofrecer un selector «Ordenar por» con las opciones: orden original, Nombre (A-Z), Edad: menor a mayor y Edad: mayor a menor.
- **FR-002**: Por defecto DEBE mantenerse el orden original.
- **FR-003**: El orden DEBE aplicarse sobre el resultado de la búsqueda y del filtro por especie.
- **FR-004**: Cambiar el orden NO DEBE generar peticiones al servidor.
- **FR-005**: Las mascotas con la misma edad DEBEN ordenarse por nombre.
- **FR-006**: El selector DEBE tener un nombre accesible y poder usarse con el teclado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El adoptante puede reordenar el catálogo en un solo paso.
- **SC-002**: El 100 % de los órdenes probados coinciden con lo esperado, también combinados con búsqueda y filtro.

## Assumptions

- El catálogo ya trae nombre y edad de cada mascota; no se necesitan datos nuevos.
- El orden elegido no se guarda entre sesiones.
