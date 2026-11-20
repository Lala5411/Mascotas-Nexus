# Data Model: Validar el registro de mascotas

## Mascota (entidad existente, `model/Mascota.java`)

| Campo | Regla al registrar |
| --- | --- |
| `nombre` | Obligatorio; se recorta; de 1 a 60 caracteres |
| `especie` | Obligatoria; se recorta; no vacía |
| `edad` | Obligatoria; entero de 0 a 30 |
| `estado` | Opcional; si falta, `DISPONIBLE`; si viene, `DISPONIBLE` o `ADOPTADO` (se guarda en mayúsculas) |
| `imagenUrl` | Sin cambios |

No hay cambios de esquema.
