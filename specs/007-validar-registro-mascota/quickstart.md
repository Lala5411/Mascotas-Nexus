# Quickstart: Validar el registro de mascotas

## Pruebas automáticas

```powershell
cd backend; .\mvnw.cmd verify; cd ..
cd frontend; npm test -- --watchAll=false --coverage; cd ..
```

## Prueba manual

1. Inicia el backend y el frontend, e inicia sesión como administrador.
2. En «Agregar Nueva Mascota», escribe un nombre y la edad 45, y pulsa «Guardar Mascota».
3. Aparece el mensaje de error con las reglas y el formulario conserva lo escrito.
4. Cambia la edad a 4 y guarda: la mascota aparece en la lista y el formulario se limpia.
