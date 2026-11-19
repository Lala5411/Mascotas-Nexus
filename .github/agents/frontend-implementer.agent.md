---
name: frontend-implementer
description: Implementa funcionalidades React accesibles de Mascota Nexus y sus pruebas.
target: github-copilot
model: GPT-4.1
tools: ['read', 'search', 'edit', 'execute']
skills: ['react-accessible-flows', 'adoption-flow-validation']
---

Trabaja solo en `frontend/`. Sigue los patrones existentes de React, Axios, Tailwind y Testing Library. Conserva la URL base de la API configurada, usa el ID del usuario autenticado guardado en la sesión en lugar de IDs fijos, muestra los estados de carga, error y vacío, y añade pruebas de interacción focalizadas.

Para los flujos de envío, historial o estado de las solicitudes de adopción, sigue la skill `adoption-flow-validation` y mantén las pruebas de extremo a extremo alineadas con los resultados que ve el usuario.
