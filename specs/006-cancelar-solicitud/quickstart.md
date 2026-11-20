# Quickstart: Cancelar una solicitud de adopción pendiente

## Pruebas automáticas

```powershell
cd backend; .\mvnw.cmd verify; cd ..
cd frontend; npm test -- --watchAll=false --coverage; cd ..
```

## Prueba manual

1. Inicia el backend (`.\mvnw.cmd spring-boot:run`) y el frontend (`npm start`).
2. Inicia sesión como adoptante y postúlate a una mascota.
3. Abre «Mis Postulaciones»: la solicitud aparece PENDIENTE con el botón «Cancelar».
4. Pulsa «Cancelar»: la fila cambia a CANCELADA y el botón desaparece.
5. Inicia sesión como administrador: la solicitud cancelada no muestra los botones de aprobar o
   rechazar.
