# Quickstart: Resumen de solicitudes para el administrador

## Pruebas automáticas

```powershell
cd backend; .\mvnw.cmd verify; cd ..
cd frontend; npm test -- --watchAll=false --coverage; cd ..
```

## Prueba manual

1. Inicia el backend y el frontend, e inicia sesión como administrador.
2. Arriba de la bandeja de solicitudes aparece «Resumen de solicitudes» con los cuatro estados y el
   total.
3. Aprueba una solicitud pendiente: «Pendientes» baja en 1 y «Aprobadas» sube en 1.
