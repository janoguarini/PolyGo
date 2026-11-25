# Sistema de rangos y ELO

Fuente de verdad: [`shared/ranking.ts`](../shared/ranking.ts). Tests: `shared/__tests__/ranking.test.ts`.
Si cambiás un valor, actualizá este documento y los `CHECK` de la base de datos que correspondan (piso de rating).

## Parámetros

| Parámetro      | Valor                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| Rating inicial | 100, oculto: el jugador está **sin posicionar** hasta su primera victoria                             |
| Piso de rating | 100 (también `CHECK (rating >= 100)` en SQL)                                                          |
| K estándar     | 32                                                                                                    |
| Sin posicionar | 0 victorias: perder o empatar no mueve el rating; la primera victoria lo posiciona (~115, Bronce III) |
| Redondeo       | `Math.round` sobre el delta                                                                           |

## Fórmula

```
Expected_A = 1 / (1 + 10^((R_B − R_A) / 400))
Delta_A    = round(K × multiplicador_repetición × (S_A − Expected_A))
R_A'       = max(100, R_A + Delta_A)
S = 1 victoria · 0.5 empate · 0 derrota
```

Entre dos jugadores posicionados el sistema es de suma cero (testeado). Si uno está sin posicionar y pierde, no pierde rating aunque el rival gane: es intencional para que nadie arranque frustrado. Una victoria pareja suma ~16, así que cada división (100 puntos) lleva varias victorias netas: se sube de a poco.

En la base: `ranked_rating_after()` (bots y personas, sin servidor). El servidor de partidas (`server/src/settlement.ts`) aplica la misma fórmula con `computeRatingChange`, incluido "sin posicionar" (`isPlaced`).

## Modo de juego: Word Rush

Ranked tiene **un único modo, Word Rush**: una partida de **60 s** que mezcla cuatro formatos (Swipe Battle, Connect Battle, Sentence Rush y Audio Blitz). El servidor decide qué formato viene (rotación ponderada en `shared/arcade.ts`, `KIND_ROTATION`), la secuencia es la misma para los dos jugadores y la partida termina sólo por el reloj. Puntos, combo y Frenesí: `arcadeScore` (diseño en [RANKED_ARCADE.md](RANKED_ARCADE.md); «Arcade» es el nombre interno del motor, nunca un modo visible).

El rating se calcula igual que siempre: sólo importa quién ganó (más puntos) con la fórmula de arriba. El protocolo y la transición desde el formato clásico de 75 s están en [BATTLE_PROTOCOL.md](BATTLE_PROTOCOL.md).

## Anti-farming: rival repetido

Partidas ranked contra **la misma cuenta** en las últimas 24 h (contando la actual):

| Partida nº | Multiplicador de K                            |
| ---------- | --------------------------------------------- |
| 1–2        | 1                                             |
| 3–4        | 0.5                                           |
| 5+         | 0 (no mueve rating; sí queda en el historial) |

## Partidas contra bots: calibración y sin ELO

Con el servidor de partidas (`server/`), Ranked siempre se puede jugar:

- **Bot a los 3 s:** si en `BOT_CONFIG.afterMs` (3 s, temporizador exacto por jugador desde que entró a la cola) no aparece una persona compatible, el servidor arma la partida contra un bot. Una persona que llega antes del plazo tiene prioridad, y nadie queda en dos partidas (ver BATTLE_PROTOCOL, «Cola»).
- **Rating del bot:** el del jugador ± 40 (`pickBot`). Su habilidad sale de `botSkill(rating)`, una curva continua sin saltos entre rangos.
- **Calibración:** las primeras **3** partidas contra bots de cada usuario **en cada idioma** mueven el ELO, contra el rating asignado al bot. Ayudan a ubicar al jugador nuevo. Tope: `BOT_CALIBRATION.ratedGames` en `shared/bots.ts`, espejo SQL `public.bot_calibration_limit()` (un test compara).
- **Lo cuenta la base**, no la app: `start_bot_battle_v2` bloquea el rating del jugador y cuenta las partidas ranked contra bots no canceladas de ese idioma (`bot_calibration_used`), **incluidas las del flujo viejo sin servidor y las abandonadas**. Una partida cancelada antes de empezar no consume cupo; reintentar el inicio con el mismo id no consume dos veces.
- **Después del cupo:** el bot sigue entrando a los 3 s, pero la partida es **sin ELO** (`rating: 'unrated'`, `is_ranked = false`). Se guarda con su resultado (historial, identificada como partida contra bot), pero `settle_battle` no cambia el rating, las partidas jugadas ni los logros. La app la muestra como «Word Rush · sin ELO» y no muestra ningún cambio de ELO.
- Contra una persona no se consume cupo.

**Cómo juega el bot** (`shared/arcadeBot.ts`): forma del día, dificultad por formato (Swipe le resulta más fácil que Sentence Rush), rachas, errores que suelen tardar más, demora de feedback entre desafíos y nunca más rápido que lo que el servidor acepta de una persona. Las rachas están centradas en su precisión base: en promedio acierta lo de su rating (±2,5 puntos, verificado por simulación), así que el ELO contra el bot mide lo mismo que antes.

Las builds anteriores (formato clásico, protocolo 2) también reciben el bot a los 3 s y la partida sin ELO fuera del cupo; la oferta «Practicar contra un bot» que tenían tras 30 s ya no llega a mostrarse. Sin servidor (flujo viejo, hasta revocar sus RPC: ver DEPLOYMENT.md), las partidas contra bots siguen moviendo el ELO sin cupo.

## Tiers y divisiones

| Tier         | Rating mínimo | Divisiones (III → II → I)          |
| ------------ | ------------- | ---------------------------------- |
| Bronce       | 0             | III < 200 · II 200–299 · I 300–399 |
| Plata        | 400           | III 400 · II 500 · I 600           |
| Oro          | 700           | III 700 · II 800 · I 900           |
| Platino      | 1000          | III 1000 · II 1100 · I 1200        |
| Esmeralda    | 1300          | III 1300 · II 1400 · I 1500        |
| Diamante     | 1600          | III 1600 · II 1700 · I 1800        |
| Maestro      | 1900          | sin divisiones                     |
| Gran Maestro | 2200          | sin divisiones                     |

Un usuario nuevo se muestra **"Sin posicionar"** (sin número de ELO, fuera de la clasificación) hasta ganar una partida; entonces entra en **Bronce III**. El logro "Escalador" (rango máximo) también cuenta recién al posicionarse.

## Reglas de liquidación (implementadas en Fase 4: `server/src/settlement.ts` + `settle_battle`)

- El rating lo calcula **sólo el servidor de partidas**; el cliente no tiene privilegios de escritura sobre `player_ratings` ni `rating_history` (testeado con RLS). El cliente sólo envía qué opción eligió o qué escribió: corrección, tiempo y puntos los decide el servidor. **Salvedad:** mientras el flujo viejo sin servidor siga habilitado, sus RPC (`finish_bot_match`, `finish_human_match`) aceptan el puntaje que informa el teléfono.
- "Sin posicionar" también en el servidor: `battle_settlement_context_v2` devuelve las victorias y la liquidación usa `placed`.
- `rating_history` tiene `UNIQUE (user_id, battle_id)`: una partida no puede liquidarse dos veces para un jugador (testeado).
- Partidas canceladas: no generan filas en `rating_history`.
- Abandono: se liquida como derrota del que abandona (ver BATTLE_PROTOCOL).
- Temporadas: el historial nunca se borra; `season_id` agrupa filas por temporada.

## Rango ≠ nivel de idioma

El rating mide desempeño en Word Rush. El progreso lingüístico (lecciones, palabras dominadas, habilidades) se mide en tablas separadas (Fase 2/3) y nunca se deriva del ELO.

## Palabras según el rango

El ranked se pone más difícil a medida que subís: las palabras y las frases de Word Rush (los cuatro formatos) salen sólo de los niveles del currículo que habilita el rating (`RUSH_LEVELS` en `shared/wordRush.ts`, espejo SQL `public.rush_levels`; frases: `sentencePool` en `shared/arcade.ts`) y de las unidades que puede usar cada jugador (`rush_common_unit_ids`).

| Rating         | Palabras |
| -------------- | -------- |
| < 400 (Bronce) | A1       |
| ≥ 400 (Plata+) | A1 + A2  |

En partidas entre personas y desafíos manda el rating más bajo de los dos. Contra bots, tu rating (el servidor no cuenta al bot). Las traducciones se muestran sin las aclaraciones entre paréntesis (`rushLabel` / `public.rush_label`). En Word Rush tampoco entran las palabras cuya traducción es una explicación gramatical («auxiliar…», «partícula…»), y una «mentira» de Swipe o un distractor nunca comparte un significado con la respuesta (`translationKeys`).

## Formato clásico (75 s): escribir la respuesta desde Oro

Esto rige sólo para el formato clásico de 75 s: los desafíos con amigos y las builds anteriores con el protocolo 2 hasta el corte (BATTLE_PROTOCOL). Word Rush no tiene preguntas para escribir.

Desde Oro (700) una de cada tres preguntas (la 3.ª, 6.ª, 9.ª…) no tiene opciones: se muestra la palabra en español y hay que escribirla en inglés (`WRITING`, `withWriting` en `shared/wordRush.ts`; espejo SQL `public.rush_writing` y la marca `write` en `public.rush_questions`). Se corrige como en las lecciones (`checkWritten`: sin importar mayúsculas, espacios ni contracciones; un error de tipeo se tolera desde 8 letras). En esas preguntas el bonus de velocidad tiene el doble de margen y el bot tarda el doble (`start_bot_match` / `settle_bot_match`). Al fallar se muestra cómo se escribía.

En chino no hay preguntas para escribir (`writingEnabled`, espejo `public.rush_writing_for`). El servidor de partidas las manda desde el protocolo 2 (`battle:answer` con `text`) y las corrige él. La migración `20261104150000_ranked_server_authority` corrige el flujo viejo: `settle_bot_match` usaba `rush_writing` sin idioma y en chino desde Oro le daba al bot más bonus de velocidad que el que mostraba la app.
