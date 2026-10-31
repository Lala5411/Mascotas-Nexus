# Memoria del Proyecto - Mascota Nexus (Frontend)

## Descripción del Proyecto
Interfaz web interactiva para el sistema de adopción y gestión de refugios Mascota Nexus.

## Tech Stack
- **Framework/Biblioteca:** React (Create React App / Vite)
- **Estilos UI:** Tailwind CSS
- **Peticiones HTTP:** Axios
- **Navegación:** React Router DOM

## Comandos de Ejecución (PowerShell)
- **Instalar dependencias:** `npm install`
- **Ejecutar en entorno local:** `npm start`
- **Compilar para producción:** `npm run build`

## Estructura del Código
- `src/components/`: Componentes modulares de interfaz:
  - `Login.js`: Autenticación y registro de usuarios.
  - `Catalogo.js`: Vista pública de mascotas y postulación a adopción.
  - `AdminPanel.js`: Gestión CRUD, carga de imágenes y moderación de solicitudes.
  - `MatchMascotas.js`: Test inteligente de recomendación.
- `src/App.js`: Enrutamiento principal y control de sesión por roles (`ROLE_USER` y `ROLE_ADMIN`).
- `src/index.css`: Directivas principales de Tailwind CSS.

## Convenciones del Equipo
- **Componentes:** PascalCase (`Catalogo.js`).
- **Manejo de Tokens:** Guardar JWT en `localStorage` e incluir la cabecera `Authorization` en Axios.
- **Estilos:** Priorizar clases utilitarias de Tailwind CSS.

## Lo que el Agente NO debe hacer
- No eliminar el token de autenticación ni el rol de usuario del `localStorage` de forma no deseada.
- No modificar la URL base de peticiones `http://localhost:8080/api` a menos que se indique explícitamente.