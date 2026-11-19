---
name: react-accessible-flows
description: Construye flujos React accesibles y fáciles de probar para el frontend de Mascota Nexus.
---

# Flujos React accesibles

1. Da a cada control un nombre accesible y muestra los estados de carga, error y vacío con los roles de estado o alerta adecuados.
2. Simula Axios en el límite del componente y prueba los resultados visibles para el usuario con React Testing Library.
3. Verifica que las peticiones usen el ID de usuario guardado en la sesión actual y conserven la URL de la API configurada.
4. Prueba las respuestas asíncronas obsoletas cuando un cambio de selección pueda iniciar peticiones superpuestas.
5. Ejecuta `npm test -- --watchAll=false` y `npm run build` desde `frontend/`.
