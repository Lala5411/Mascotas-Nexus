# Quickstart: Ordenar el catálogo

## Pruebas automáticas

```powershell
cd frontend; npm test -- --watchAll=false --coverage; npm run build; cd ..
```

## Prueba manual

1. Inicia el backend y el frontend, e inicia sesión como adoptante.
2. En el catálogo, abre «Ordenar por» y elige «Edad: menor a mayor»: las tarjetas se reordenan.
3. Escribe una búsqueda: el resultado conserva el orden.
4. Usa solo el teclado (Tab y flechas) para cambiar el orden.
