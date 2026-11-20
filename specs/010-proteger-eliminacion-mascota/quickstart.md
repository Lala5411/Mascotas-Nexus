# Quickstart: Proteger la eliminación de mascotas

## Pruebas automáticas

```powershell
cd backend; .\mvnw.cmd verify; cd ..
cd frontend; npm test -- --watchAll=false --coverage; cd ..
```

## Prueba manual

1. Inicia el backend y el frontend.
2. Como adoptante, postúlate a una mascota.
3. Como administrador, pulsa «Eliminar» en esa mascota: aparece el mensaje y la mascota sigue en la
   lista.
4. Registra una mascota nueva y elimínala: desaparece de la lista sin mensajes.
