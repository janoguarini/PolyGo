# Protocolo de batalla — Word Rush

> **Estado: implementado (Fase 4).** Contrato tipado en [`shared/protocol.ts`](../shared/protocol.ts),
> reglas puras en [`shared/wordRush.ts`](../shared/wordRush.ts), servidor en [`server/`](../server),
> cliente en `src/features/battle/`.

## Servicio

- `server/`: Node 22 + TypeScript (ejecutado con `tsx`) + Socket.IO 4, proceso persistente (no serverless).
- Autentica el handshake validando el access token de Supabase con `auth.getUser` (sirve con claves JWT simétricas o asimétricas).
- Escribe en Supabase con la `service_role` key, sólo mediante las funciones de la migración 0005.
- Importa `shared/` para ELO, rangos, puntuación y preguntas: la misma lógica que muestra la app.
- `GET /health` → `{ ok, protocolVersion, connected, queued, battles }`.

## Handshake

`io(url, { transports: ['websocket'], auth: { token, protocolVersion } })`. Rechazos (mensaje de `connect_error`): `unauthorized`, `protocol_mismatch`, `server_error`. Una conexión por usuario: una nueva reemplaza a la anterior (y la reengancha a su partida).

## Máquina de estados de partida

```
matched ──▶ ready ──▶ in_progress ──▶ completed
   │          │          │  ▲            ▲
   ▼          ▼          ▼  │            │
cancelled  cancelled  reconnecting ──────┘
                          │
                          ▼
                      forfeited
```

| Transición | Condición |
| --- | --- |
| matched → ready | ambos envían `match:ready` en ≤ 10 s; si no → cancelled (sin ELO) |
| ready → in_progress | se guardó el inicio (`start_battle`) y pasó la cuenta atrás de 3 s |
| matched/ready → cancelled | timeout de confirmación, alguien se va o falla el guardado del inicio |
| in_progress → reconnecting | un jugador pierde la conexión o abandona |
| reconnecting → in_progress | vuelve en ≤ 15 s; el reloj del servidor **no** se detiene |
| reconnecting → forfeited | no vuelve a tiempo (o abandonó con `battle:leave`): derrota para quien se fue |
| in_progress/reconnecting → completed | se agota el tiempo (75 s) o ambos respondieron todas las preguntas |

Cualquier otra transición lanza un error (testeado en `shared/__tests__/wordRush.test.ts`).

## Reglas

- 75 s por partida; 40 preguntas (más de las que alguien responde): el tiempo es el límite real.
- Misma secuencia para ambos, generada por el servidor con aleatoriedad criptográfica a partir de las palabras publicadas del idioma. Cada pregunta: palabra en inglés → 4 traducciones, o al revés. Un distractor nunca comparte texto ni traducción con la palabra (evita dos opciones válidas).
- Cada jugador avanza a su ritmo: recibe la pregunta *n+1* sólo después de responder la *n*. El cliente nunca recibe la respuesta correcta antes de responder.
- Puntuación: correcta = 100 + bonus de velocidad (50 → 0 lineal en 5 s desde que el servidor envió la pregunta); incorrecta = −50; el acumulado no baja de 0. Adivinar al azar entre 4 tiene valor esperado entre −12,5 (lento) y 0 (instantáneo): nunca conviene.
- Respuestas duplicadas, adelantadas o de otra pregunta: `stale_question`, no puntúan. Después del final: `battle_over`.
- Resultado: abandono pierde siempre; si no, mayor puntaje; empate de puntaje → mayor precisión; si persiste, empate (S = 0.5).
- Rate limit: 20 eventos por segundo y socket; el exceso se descarta.

## Eventos

| Cliente → servidor | Respuesta (ack) |
| --- | --- |
| `queue:join { mode: 'ranked' \| 'practice' }` | `{ mode }` o `onboarding_required`, `already_in_battle` |
| `queue:leave` | — |
| `match:ready { battleId }` | — |
| `battle:answer { battleId, questionIndex, option }` | `{ questionIndex, correct, correctOption, points, score }` |
| `battle:leave` | antes de empezar cancela; en juego es derrota (en práctica, la termina) |
| `battle:sync` | foto actual o `null` si ya no está en partida |

| Servidor → cliente | Cuándo |
| --- | --- |
| `queue:status { window, waitedMs }` | al entrar y cada segundo en cola |
| `match:found` (foto) | rival encontrado; trae `readyDeadline` |
| `battle:start` (foto) | ambos listos; trae `startsAt`/`endsAt` |
| `battle:question` | la siguiente pregunta de ese jugador (`sentAt` = hora del servidor) |
| `battle:score` | marcador tras cada respuesta |
| `battle:opponent_status { connected, graceEndsAt }` | el rival se cayó o volvió |
| `battle:state` (foto) | al reconectar |
| `battle:finish` | resultado, ELO antes/después y logros nuevos |
| `battle:cancel { reason }` | `ready_timeout`, `opponent_left`, `server_error`, `settlement_failed` |

Las fotos incluyen `serverNow`: la app calcula el desfase de reloj y muestra los tiempos del servidor.

## Persistencia (migración 0005)

Las partidas de práctica no se guardan. Las ranked:

1. `start_battle(id, idioma, j1, j2, versión)` al terminar la cuenta atrás (idempotente). Si falla, la partida se cancela.
2. `battle_settlement_context(id, 24)` devuelve rating, partidas jugadas y partidas entre ambos en las últimas 24 h (contando la actual).
3. El servidor calcula el ELO con `shared/ranking.ts` y llama a `settle_battle(id, estado, jugadores)`, que en **una transacción** bloquea las filas de `player_ratings`, verifica que el rating y las partidas jugadas sigan siendo los leídos (si no: `stale_rating`, el servidor relee y reintenta hasta 3 veces), completa `battle_players`, actualiza `player_ratings`, inserta `rating_history`, cierra `battles` y llama a `evaluate_achievements` para cada jugador. Reliquidar devuelve `duplicate: true` sin tocar nada.
4. Si la liquidación falla del todo, la partida se cancela (`cancel_battle`) y se avisa `settlement_failed`.
5. Al arrancar y cada 5 min, el servidor cancela partidas abiertas con más de 5 min (`cancel_stale_battles`): quedaron huérfanas por un reinicio.

## Matchmaking

Cola en memoria por idioma (la versión de protocolo ya la filtra el handshake). Ventana inicial ±100 ELO, +50 cada 5 s hasta ±400; se empareja sólo si la diferencia entra en la ventana de **ambos**, priorizando a quien más espera y al rival más cercano. Un humano siempre tiene prioridad sobre un bot.

## Sin servidor de partidas (modo actual: MVP con Supabase)

Si la app no tiene `EXPO_PUBLIC_BATTLE_SERVER_URL`, el ranked funciona sin servidor propio ni costo extra. **Antes del lanzamiento se pasa al servidor de `server/` (Railway)**, que valida cada respuesta.

### Entre personas

1. **Cola:** la app llama `join_human_queue()` cada 1,5 s. La base empareja con otra persona activa del mismo idioma si la diferencia de ELO entra en la ventana de **ambos** (±100, +50 cada 5 s hasta ±400). Quien deja de consultar sale de la cola sola (`seen_at`).
2. **Partida:** al emparejar, la base genera las 40 preguntas (`rush_questions`, mismas reglas que `shared/wordRush.ts`) y fija el inicio 5 s después. `get_human_match()` se las da a los dos con la hora del servidor para sincronizar la cuenta atrás.
3. **En vivo:** cada teléfono publica su puntaje por **Supabase Realtime** (broadcast en `battle:<id>`) después de cada respuesta; sólo para mostrar.
4. **Resultado:** `finish_human_match()` (no antes de 70 s, máximo 150 por acierto, ≤ 40 respuestas). Cuando están los dos se liquida a ambos (ELO de `shared/ranking.ts` con anti-farming por rival repetido). Quien no informa a los 75 s + 30 s de gracia pierde por abandono; `human_match_result()` lo cierra cuando el otro consulta.
5. **Sin nadie en 10 s:** `leave_human_queue()` (si justo lo emparejaron, devuelve esa partida) y se juega contra un bot (abajo).

Probado E2E contra Supabase real con dos usuarios temporales (emparejamiento, mismas preguntas, Realtime y liquidación).

### Contra bots

Sin rival humano, el ranked se juega **contra bots en el teléfono**:

- `start_bot_match()` (Supabase) elige el bot a tu altura y genera **todas sus jugadas** (`battles.bot_script`): el teléfono sólo las reproduce, así que el resultado del bot no se puede tocar desde la app. Antes cierra como **abandono** cualquier partida tuya que haya quedado abierta (cerrar la app para no perder no sirve). Tope: 100 por día.
- La partida corre en el teléfono (`src/features/battle/localMatch.ts`) con las mismas reglas y la misma pantalla.
- `finish_bot_match(id, puntaje, correctas, respondidas, abandono)` valida el puntaje (no antes de 70 s desde el inicio, máximo 150 por acierto, ≤ 200 respuestas), recalcula el puntaje del bot desde su guion, decide el resultado y liquida el ELO y los logros. Idempotente.
- Las funciones SQL replican `botSkill`, `answerPoints` y `computeRatingChange`; `supabase/tests/botmatch.test.mjs` verifica que den exactamente lo mismo que `shared/`.
- Límite: no hay partidas entre personas, y el puntaje propio lo informa el teléfono (validado pero no observado en vivo). Para partidas entre personas, alojar `server/` (ver DEPLOYMENT.md) y cargar la URL.

## Desafío a un amigo

Partida entre dos personas que se ponen de acuerdo, siempre por Supabase (también con servidor de partidas):

- `create_friend_challenge()` → `{code, expires_at}`: código de 6 caracteres sin ambiguos (0/O, 1/I/L), vence en 15 min; crear otro anula el anterior. Tope: 30 por hora.
- Quien desafía consulta `friend_challenge_status(code)` cada 1,5 s (`waiting` / `matched` / `expired`); si deja de consultar 10 s, el código ya no se acepta (`host_gone`).
- `accept_friend_challenge(code)` (mayúsculas indistintas, reintento idempotente) crea la partida con `is_ranked = false` y arranca en 5 s. Errores: `challenge_not_found`, `challenge_expired`, `challenge_taken`, `own_challenge`, `language_mismatch`.
- De ahí en más es la misma partida entre personas (`get_human_match`, Realtime, `finish_human_match`). `settle_human_match` guarda puntajes y resultado pero, al no ser ranked, no toca `player_ratings`, `rating_history` ni logros, y devuelve los ratings en null.
- Link: `polygo://challenge/<código>` → `src/app/challenge/[code].tsx` → `/battle?code=...`. Sin sesión iniciada, el link lleva al login y el código se pierde (hay que escribirlo a mano).

## Bots

Con pocos jugadores, quien espera **10 s** en la cola ranked sin rival humano juega contra un bot ([`shared/bots.ts`](../shared/bots.ts)):

- **Siempre identificado:** nombre propio y distintivo **BOT** al encontrar rival, en la partida, en el resultado y en el historial. Nunca se presenta como persona.
- **A tu nivel:** rating = el del jugador ± 40. Su habilidad sale de ese rating: precisión de 55 % (600) a 97 % (1900) y tiempo medio de respuesta de 5 s a 1,3 s, con variación log-normal. Una simulación con la puntuación real (`shared/__tests__/bots.test.ts`) verifica que a igual rating cada uno gana ~50 % y que más rating gana más seguido.
- **Cuenta para el ELO** como una partida normal, calculada contra el rating del bot. Como el bot se elige a la altura del jugador, en promedio se gana la mitad: el ELO mide el nivel real y no se puede "farmear".
- **Sin cuenta:** el bot no tiene fila en `profiles` ni `player_ratings`; ocupa el slot 2 de `battle_players` sin `user_id`, con `bot_name` y `bot_avatar_id` (`battles.has_bot = true`). No aparece en la clasificación.
- **Juega por el mismo camino que una persona:** confirma con una demora de 0,6–2 s y responde con `Battle.answer`; el servidor no le envía nada.
- Persistencia: `start_bot_battle` (en lugar de `start_battle`); la liquidación y `settle_battle` no cambian (el slot del bot no tiene rating que actualizar).
- Ajustes: `BOT_CONFIG` en `shared/bots.ts`; `botAfterMs: null` en `createBattleServer` los desactiva.

## Limitaciones conocidas

- Un único proceso: la cola y las partidas viven en memoria. Escalar a varias instancias requiere un adaptador (Redis) y afinidad de sesión.
- El bonus de velocidad incluye la latencia de red de cada jugador.
- Un reinicio del servidor cancela las partidas en curso (sin ELO).
