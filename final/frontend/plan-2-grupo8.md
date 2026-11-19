/plan [Qué quiero] Implementar una barra de búsqueda en tiempo real y selectores de filtro por especie en el catálogo en React. [Para quién] Para los usuarios adoptantes de Mascota Nexus. [Contexto] Frontend en React con Tailwind CSS y Axios. [Formato del Plan] Plan paso a paso en Markdown detallando cambios en Catalogo.js, estados de React y estilos. [Restricciones] Seguir web-design-guidelines y clases de Tailwind CSS.

**Plan: búsqueda y filtro por especie en el catálogo**
**Objetivo:** permitir que los adoptantes encuentren mascotas disponibles con una búsqueda instantánea por nombre y un selector de especie. Los filtros se combinarán, con búsqueda local y filtro por especie a través del endpoint backend ya implementado.

**Pasos**
**1. Ampliar el estado de Catalogo en Catalogo.js:**

- **terminoBusqueda:** texto escrito.
- **especieSeleccionada:** especie elegida o valor vacío para «Todas las especies».
- **especiesDisponibles:** opciones derivadas de la lista inicial de mascotas disponibles.
- **mascotas:** resultados del catálogo para la especie elegida.
- **cargandoMascotas y errorMascotas:** estados para carga y fallos.

2. **Cargar y filtrar los datos:**

- En la carga inicial, conservar la petición existente a /api/mascotas/disponibles y derivar de esa lista las especies únicas para el selector.
- Al cambiar la especie, solicitar /api/mascotas/filtrar?especie=...; al elegir «Todas las especies», mostrar de nuevo la lista completa.
- Aplicar el término de búsqueda localmente sobre los resultados, por nombre y sin distinguir mayúsculas/minúsculas; no enviar
una petición por cada tecla.
- Evitar mostrar resultados obsoletos si cambia la selección mientras hay una petición en curso.

3. **Añadir controles y estados visuales:**

- Incluir en la sección del catálogo un campo de búsqueda con etiqueta accesible y un selector de especie, en una distribución responsive mobile-first.
- Aplicar clases Tailwind coherentes con la paleta esmeralda/slate y estados focus-visible.
- Mostrar indicadores o mensajes para carga, error y ausencia de coincidencias, sin afectar la pestaña de postulaciones.

4. **Agregar pruebas en un archivo nuevo, por ejemplo** 

frontend/src/components/Catalogo.test.js:

- Renderizado de búsqueda y selector.
- Búsqueda instantánea por nombre, sin distinguir mayúsculas.
- Selector con especies únicas y opción «Todas las especies».
- Petición al endpoint al cambiar la especie y combinación con
búsqueda.
- Estados de carga, error y sin resultados.
Validar con npm test -- --watchAll=false --runTestsByPath src/components/Catalogo.test.js y npm run build, ejecutados desde frontend.

El plan queda definido aquí; no modifiqué archivos. No pude guardarlo en el archivo de sesión porque este entorno está en modo de solo lectura.