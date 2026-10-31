# Polys: la economía de Polygo

Una sola moneda que se gana volviendo todos los días y se gasta en cuidar la racha y en lucirse.
Nunca da ventaja en ranked (el ELO no se toca con Polys).

- Valores: `shared/polys.ts`. La base los replica en `public.poly_config()` y
  `supabase/tests/polys.test.mjs` compara ambos: cambiar un valor = cambiar los dos.
- Base: `poly_wallets` (saldo) y `poly_transactions` (un movimiento por fila, clave única
  `(user_id, reason, ref)` para que nada se acredite dos veces). La app sólo lee.
- `sync_polys(tz)` acredita lo ganado que falte, derivado de lo que la base ya guarda. La app la
  llama al abrir y después de cada lección, repaso o partida. La primera vez marca lo previo como
  contado (amount 0) y da sólo el regalo de bienvenida.

## Ganancias

| Fuente                                                 | Polys                           | Límite                |
| ------------------------------------------------------ | ------------------------------- | --------------------- |
| Regalo de bienvenida                                   | 100                             | 1                     |
| Misión diaria completada                               | 5                               | 3 por día             |
| Cofre del día (las 3 misiones)                         | 10–20, 5 % de chance de 50      | 1 por día             |
| Bonus semanal (5 cofres en la semana, lunes a domingo) | 50                              | 1 por semana          |
| Lección con 3★ por primera vez                         | 2                               | cada lección una vez  |
| Unidad terminada                                       | 20                              | cada unidad una vez   |
| Victoria ranked                                        | 3                               | 5 por día             |
| Rango alcanzado en la temporada                        | 50 (Plata) → 300 (Gran Maestro) | una vez por temporada |
| Hito de racha 7/14/30/50/100/365 días                  | 25/40/75/100/200/500            | una vez en la vida    |
| Logro de nivel N                                       | min(10 × N, 50)                 | cada nivel una vez    |

## Gastos

| Ítem                          | Precio |
| ----------------------------- | ------ |
| Protector de racha (máximo 2) | 100    |

## Etapas

1. **Hecha:** moneda, ganancias, cofre, compra del protector, saldo en Aprender y Ranked, aviso de "+Polys".
2. Tienda: recuperar racha perdida (72 h; 250, o 400 si era de 30+ días), marcos de avatar
   (común 150–250, raro 400–600, épico 1.000–1.500) y fondos de perfil.
3. Temporada: legendarios por rango final y destacado semanal con descuento.

**Legendarios y exclusivos no se compran con Polys** (decisión del usuario): se ganan por
temporada o logros, o se venden con plata real (compras dentro de la app, más adelante). El
registro de movimientos ya admite agregar compras pagas sin cambiar el modelo.
