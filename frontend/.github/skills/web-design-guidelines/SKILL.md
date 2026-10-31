---
name: web-design-guidelines
description: Guías de diseño UI/UX, accesibilidad y Tailwind CSS para componentes en React. Usar cuando se modifique la interfaz gráfica o se creen nuevos componentes visuales.
---

# Web Design & Tailwind CSS Guidelines

## 🎨 Reglas de Estilos y UI
- Utiliza **Tailwind CSS** mediante clases utilitarias para todo el estilizado. Evita los estilos en línea (`style={{}}`).
- Asegura contraste suficiente entre texto y fondo según las pautas WCAG AA.
- Aplica estados hover, focus y active limpios (`hover:bg-emerald-700 focus:ring-2`).

## 📱 Responsividad
- Diseña enfocado en Mobile-First.
- Usa breakpoints estándar de Tailwind (`sm:`, `md:`, `lg:`).

## 🧩 Componentes React
- Divide interfaces complejas en componentes atómicos y reutilizables.
- Mantén la coherencia con la paleta de colores corporativa (tonos esmeralda, slate y blanco).