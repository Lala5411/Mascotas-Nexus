# Contrato: registrar una mascota

`POST /api/mascotas` (sin cambios de ruta ni de cuerpo)

```json
{ "nombre": "Luna", "especie": "Gato", "edad": 2, "estado": "DISPONIBLE", "imagenUrl": "/luna.jpg" }
```

| Caso | Respuesta |
| --- | --- |
| Datos válidos | `200 OK` con la mascota guardada |
| Nombre vacío o de más de 60 caracteres | `400 Bad Request` |
| Especie vacía | `400 Bad Request` |
| Edad ausente, menor que 0 o mayor que 30 | `400 Bad Request` |
| Estado distinto de DISPONIBLE o ADOPTADO | `400 Bad Request` |

En los casos 400 no se guarda nada.
