# Memoria del proyecto - Frontend

## Stack y estructura

- React 19.3.1 con Create React App (`react-scripts` 5.0.1), Axios, React Router DOM y Tailwind CSS.
- `src/App.js` compone la aplicación; `src/components/` contiene sus componentes y pruebas Jest/React Testing Library.

## Comandos (PowerShell)

- Instalar dependencias: `npm ci`
- Ejecutar: `npm start`
- Probar: `npm test -- --watchAll=false`
- Probar con cobertura: `npm test -- --watchAll=false --coverage`
- Compilar: `npm run build`

Al modificar la interfaz, conserva los patrones de React y las dependencias definidas en `package.json`.