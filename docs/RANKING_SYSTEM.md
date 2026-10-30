# Sistema de rangos y ELO

Fuente de verdad: [`shared/ranking.ts`](../shared/ranking.ts). Tests: `shared/__tests__/ranking.test.ts`.
Si cambiás un valor, actualizá este documento y los `CHECK` de la base de datos que correspondan (piso de rating).

## Parámetros

| Parámetro | Valor |
| --- | --- |
| Rating inicial | 1000 |
| Piso de rating | 100 (también `CHECK (rating >= 100)` en SQL) |
| K estándar | 32 |
| K en colocación | 48 durante las primeras 5 partidas |
| Redondeo | `Math.round` sobre el delta |

## Fórmula

```
Expected_A = 1 / (1 + 10^((R_B − R_A) / 400))
Delta_A    = round(K × multiplicador_repetición × (S_A − Expected_A))
R_A'       = max(100, R_A + Delta_A)
S = 1 victoria · 0.5 empate · 0 derrota
```

Entre dos jugadores establecidos con el mismo K el sistema es de suma cero (testeado). Si uno está en colocación (K=48) y el otro no, no es suma cero: es intencional para calibrar rápido al nuevo sin castigar de más al rival.

## Anti-farming: rival repetido

Partidas ranked contra **la misma cuenta** en las últimas 24 h (contando la actual):

| Partida nº | Multiplicador de K |
| --- | --- |
| 1–2 | 1 |
| 3–4 | 0.5 |
| 5+ | 0 (no mueve rating; sí queda en el historial) |

## Partidas contra bots

Cuentan igual que contra una persona: el delta se calcula contra el rating asignado al bot (el del jugador ± 40). El bot no tiene rating propio que guardar. El anti-farming por rival repetido no aplica (cada bot es nuevo), pero no hace falta: el bot juega con la habilidad de su rating. Detalle en [BATTLE_PROTOCOL.md](BATTLE_PROTOCOL.md#bots).

## Tiers y divisiones

| Tier | Rating mínimo | Divisiones (III → II → I) |
| --- | --- | --- |
| Bronce | 0 | III < 800 · II 800–849 · I 850–899 |
| Plata | 900 | III 900 · II 950 · I 1000 |
| Oro | 1050 | III 1050 · II 1100 · I 1150 |
| Platino | 1200 | III 1200 · II 1250 · I 1300 |
| Esmeralda | 1350 | III 1350 · II 1400 · I 1450 |
| Diamante | 1500 | III 1500 · II 1567 · I 1633 |
| Maestro | 1700 | sin divisiones |
| Gran Maestro | 1900 | sin divisiones |

Un usuario nuevo (1000) queda en **Plata I**, pero se muestra **"En colocación / Sin rango"** hasta completar 5 partidas.

## Reglas de liquidación (implementadas en Fase 4: `server/src/settlement.ts` + `settle_battle`)

- El rating lo calcula **sólo el servidor de partidas**; el cliente no tiene privilegios de escritura sobre `player_ratings` ni `rating_history` (testeado con RLS).
- `rating_history` tiene `UNIQUE (user_id, battle_id)`: una partida no puede liquidarse dos veces para un jugador (testeado).
- Partidas canceladas: no generan filas en `rating_history`.
- Abandono: se liquida como derrota del que abandona (ver BATTLE_PROTOCOL).
- Temporadas: el historial nunca se borra; `season_id` agrupa filas por temporada.

## Rango ≠ nivel de idioma

El rating mide desempeño en Word Rush. El progreso lingüístico (lecciones, palabras dominadas, habilidades) se mide en tablas separadas (Fase 2/3) y nunca se deriva del ELO.
