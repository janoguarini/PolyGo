# Protocolo de batalla — Word Rush

> **Ranked tiene un único modo: Word Rush.** Es una partida de 60 s que combina cuatro formatos (Swipe
> Battle, Connect Battle, Sentence Rush y Audio Blitz) y usa el **protocolo 3**. Internamente el motor
> se llama «Arcade» (`shared/arcade.ts`, `server/src/arcadeBattle.ts`, `src/features/battle/arcade/`).
> Ese nombre nunca aparece en la app.
>
> El **protocolo 2** es el formato clásico de 75 s con preguntas de opción múltiple y escritura. Queda
> sólo en dos lugares:
>
> 1. Las builds anteriores, hasta el corte (ver «Versiones y corte»).
> 2. Los desafíos con amigos, que van por Supabase y no pasan por este servidor.
>
> **Estado:** Word Rush unificado está implementado en `Polygo-client` (Fases 1–3) y **todavía no se
> desplegó**. Contrato tipado en [`shared/protocol.ts`](../shared/protocol.ts). Diseño de la puntuación
> en [RANKED_ARCADE.md](RANKED_ARCADE.md).

## Servicio

- `server/`: Node 22 + TypeScript (ejecutado con `tsx`) + Socket.IO 4, proceso persistente (no
  serverless).
- Autentica el handshake validando el access token de Supabase con `auth.getUser` (sirve con claves
  JWT simétricas o asimétricas).
- Escribe en Supabase con la `service_role` key, sólo mediante las funciones de las migraciones.
- Importa `shared/` para ELO, rangos, puntuación, desafíos y bots: la misma lógica que muestra la app.
- `GET /health` → `{ ok, protocolVersion, protocolVersions, connected, queued, battles, matching }`.
  - `protocolVersion`: la más nueva que acepta.
  - `matching`: jugadores cuya partida se está armando.

## Handshake

`io(url, { transports: ['websocket'], auth: { token, protocolVersion, curriculumApi? } })`.

- Rechazos (mensaje de `connect_error`): `unauthorized`, `protocol_mismatch`, `server_error`.
- Una conexión por usuario: una nueva reemplaza a la anterior y la reengancha a su partida.
- Una partida en curso sólo la retoma un cliente de su misma versión de protocolo.

## Versiones y corte

| Versión | Qué juega                                                     | Quién                             |
| ------- | ------------------------------------------------------------- | --------------------------------- |
| 3       | **Word Rush**: 60 s, cuatro formatos (`arcade:*`)             | la app actual                     |
| 2       | Formato clásico de 75 s (`battle:question` / `battle:answer`) | builds anteriores, hasta el corte |

- **Las versiones nunca se mezclan.** La cola separa por versión y la práctica y el bot usan la
  versión de quien los pide. `battles.protocol_version` guarda 2 o 3. `battles.mode` sigue siendo
  `word_rush` en los dos.
- **Por defecto el servidor acepta 2 y 3.** El corte es `BATTLE_PROTOCOL_VERSIONS=3` en el entorno del
  servidor (`server/src/index.ts`) y no requiere cambiar código.
  - Si el valor es inválido, se registra el error y se usan las versiones soportadas.
  - Después del corte, una build v2 recibe `protocol_mismatch`. Ya muestra «Hay una versión nueva…
    Actualizá la app para jugar».
- **Orden previsto:**
  1. Desplegar el servidor (acepta 2 y 3).
  2. Publicar la build con el protocolo 3.
  3. Hacer el corte.

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

| Transición                           | Condición                                                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| matched → ready                      | ambos envían `match:ready` en ≤ 10 s (el bot confirma solo, con una demora de 0,6–2 s); si no → cancelled (sin ELO) |
| ready → in_progress                  | se guardó el inicio (`start_battle` / `start_bot_battle_v2`) y pasó la cuenta atrás de 3 s                          |
| matched/ready → cancelled            | timeout de confirmación, alguien se va o falla el guardado del inicio                                               |
| in_progress → reconnecting           | un jugador pierde la conexión o abandona                                                                            |
| reconnecting → in_progress           | vuelve en ≤ 15 s; el reloj del servidor **no** se detiene                                                           |
| reconnecting → forfeited             | no vuelve a tiempo (o abandonó con `battle:leave`): derrota para quien se fue                                       |
| in_progress/reconnecting → completed | Word Rush: **sólo** al agotarse los 60 s. Clásico: al agotarse los 75 s o si ambos respondieron todas las preguntas |

Cualquier otra transición lanza un error (testeado en `shared/__tests__/wordRush.test.ts`).

## Word Rush (protocolo 3)

### Reglas

- **Tiempo:** 60 s de juego desde el fin de la cuenta regresiva (`startsAt` → `endsAt`).
  - El servidor cierra la partida a los 60 s y desde `endsAt` responde `battle_over`.
  - Una respuesta 1 ms antes cuenta; en el instante 60 s, no.
- **Sin agotamiento:** la secuencia es un **flujo continuo** (`createChallengeStream`).
  - Arranca con 60 desafíos y crece en bloques de 20 cuando el jugador más adelantado se acerca al
    final.
  - La partida nunca termina por quedarse sin desafíos.
- **Misma secuencia para todos:** los dos jugadores y el bot leen el mismo arreglo, en el mismo orden,
  a cualquier ritmo.
  - Cada uno avanza por su cuenta.
  - El cliente recibe siempre el desafío actual y el siguiente (`lookahead` 2), así no hay espera
    entre uno y otro.
  - Nunca recibe la respuesta.
- **Rotación** (la decide el servidor, `KIND_ROTATION`):
  - Proporciones: Swipe 30 %, Audio 25 %, Connect 23 % y Sentence 22 %, con corrección por déficit.
  - Swipe y Audio, como mucho 2 seguidos; Connect y Sentence, nunca.
  - Ningún formato falta más de 6 desafíos.
  - Arranca con un formato rápido (Swipe o Audio).
  - No hay rondas fijas: el orden no se puede predecir.
  - Si un formato no tiene contenido suficiente en ese nivel, sale de la rotación (nunca se inventa
    contenido).
- **Contenido:** las palabras y frases salen de los niveles del rating (Bronce A1, desde Plata A1 + A2)
  y de las unidades comunes a los humanos (`rush_common_unit_ids`).
  - No entran traducciones descriptivas («auxiliar…», «partícula…»).
  - Una «mentira» de Swipe, un distractor de Audio o una pareja de Connect nunca comparte un
    significado con la respuesta correcta (`translationKeys`).
  - El contenido visto hace poco por cualquiera de los dos jugadores va al final del mazo
    (`RecentContentMemory`, en memoria del proceso, por usuario e idioma; se pierde al reiniciar).
- **Puntuación:** `arcadeScore`.
  - Puntos base por formato más un bonus de velocidad de hasta el 25 %.
  - El combo multiplica (×2 desde 3 aciertos seguidos, ×3 desde 5, ×4 desde 8).
  - Frenesí: ×2 en los últimos 15 s.
  - Respuestas no humanas (Swipe en menos de 200 ms) cuentan como fallo.
- **Resultado:** gana el de más puntos; si empatan, el de mayor precisión; si persiste, empate. El ELO
  se calcula igual que siempre (RANKING_SYSTEM.md).
- **Reintentos:** una respuesta duplicada, adelantada o de un desafío que ya pasó es `stale_question`
  y no puntúa; una forma inválida es `invalid_payload`. El cliente sólo dice qué hizo en qué desafío.
- **Rate limit:** 20 eventos por segundo y socket; el exceso se descarta.

### Eventos propios

| Dirección          | Evento                                               | Contenido                                                                                                 |
| ------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| servidor → cliente | `arcade:challenge`                                   | `ChallengeView` (sin respuesta): el que entra en la ventana                                               |
| cliente → servidor | `arcade:answer { battleId, challengeIndex, answer }` | ack con `ArcadeAnswerResult` (correcto, puntos, combo, multiplicador, Frenesí, `done`, solución revelada) |
| en las fotos       | `arcade`                                             | ventana actual, `current`, combo, mejor combo, `frenzyAt`, `durationMs` (para retomar tras reconectar)    |
| en `battle:finish` | `players[].arcade`                                   | mejor combo y puntos en Frenesí (sólo para mostrar)                                                       |

### Cliente

- **Un solo modo visible.** La pestaña Ranked presenta Word Rush con sus 60 s y los cuatro formatos
  como partes del juego, no para elegir.
- **Presentación con la identidad oscura del juego.** Rival encontrado y cuenta regresiva usan
  `ArcadeLobby`, el mismo tema que la partida, así no hay salto de tema.
- **Durante la partida:**
  - Al llegar a 0 se ve «¡Tiempo!» hasta que llega el resultado.
  - Si se cae la conexión propia, aparece «Reconectando…»: el reloj sigue en el servidor, y al volver
    `battle:sync` repone la ventana.
- **Etiquetas:** «RANKED · WORD RUSH», «RANKED · CALIBRACIÓN n/3», «WORD RUSH · SIN ELO» (bot fuera del
  cupo) y «WORD RUSH · PRÁCTICA».

## Formato clásico (protocolo 2)

Builds anteriores hasta el corte y desafíos con amigos (los desafíos con amigos usan estas mismas reglas
por Supabase, sin este servidor).

- 75 s por partida; 40 preguntas (más de las que alguien responde): el tiempo es el límite real.
- **Secuencia:** la misma para ambos, generada con aleatoriedad criptográfica a partir de las palabras
  publicadas del idioma.
  - Cada pregunta: palabra en el idioma → 4 traducciones, o al revés.
  - Un distractor nunca comparte texto ni traducción con la palabra.
- **Ritmo:** cada jugador recibe la pregunta _n+1_ sólo después de responder la _n_.
- **Puntuación:**
  - Correcta = 100 + bonus de velocidad (50 → 0 lineal en 5 s) + bonus de racha (+10 desde 3, +20
    desde 5, +30 desde 8; tope 180 por respuesta).
  - Incorrecta = −50 y corta la racha.
  - El acumulado no baja de 0.
- **Tipos de pregunta** (`questionKind`, determinístico): imagen, audio o texto.
- **Escribir:** desde Oro y nunca en chino, la 3.ª, 6.ª, 9.ª… pregunta llega con `kind: 'write'`.
  - El cliente responde `{ text }` (≤ 80 caracteres) y el servidor corrige con `checkWritten`.
  - Mandar `option` en una de escribir, o `text` en una de opciones, es `invalid_payload`.
- **Respuestas inválidas:** duplicadas, adelantadas o de otra pregunta → `stale_question`. Después del
  final → `battle_over`.

## Eventos comunes

| Cliente → servidor                                              | Respuesta (ack)                                                         |
| --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `queue:join { mode: 'ranked' \| 'practice' \| 'bot_practice' }` | `{ mode }` o `onboarding_required`, `already_in_battle`                 |
| `queue:leave`                                                   | —                                                                       |
| `match:ready { battleId }`                                      | —                                                                       |
| `battle:answer { battleId, questionIndex, option \| text }`     | sólo protocolo 2                                                        |
| `arcade:answer`                                                 | sólo protocolo 3 (arriba)                                               |
| `battle:leave`                                                  | antes de empezar cancela; en juego es derrota (en práctica, la termina) |
| `battle:sync`                                                   | foto actual o `null` si ya no está en partida                           |

| Servidor → cliente                                      | Cuándo                                                                |
| ------------------------------------------------------- | --------------------------------------------------------------------- |
| `queue:status { window, waitedMs, botCalibrationLeft }` | al entrar y en cada tick en cola                                      |
| `match:found` (foto)                                    | rival encontrado; trae `readyDeadline`, `rating` y `calibration`      |
| `battle:start` (foto)                                   | ambos listos; trae `startsAt` / `endsAt`                              |
| `battle:question`                                       | protocolo 2: la siguiente pregunta de ese jugador                     |
| `arcade:challenge`                                      | protocolo 3: el desafío que entra en la ventana                       |
| `battle:score`                                          | marcador tras cada respuesta (Tug of War)                             |
| `battle:opponent_status { connected, graceEndsAt }`     | el rival se cayó o volvió                                             |
| `battle:state` (foto)                                   | al reconectar                                                         |
| `battle:finish`                                         | resultado, ELO antes/después (null sin ELO) y logros nuevos           |
| `battle:cancel { reason }`                              | `ready_timeout`, `opponent_left`, `server_error`, `settlement_failed` |

- Las fotos incluyen `serverNow`: la app calcula el desfase de reloj y muestra los tiempos del servidor.
- Cada foto y cada `battle:finish` trae `rating`:
  - `competitive`: contra una persona.
  - `calibration`: con `calibration: { used, limit }`.
  - `unrated`: contra un bot fuera del cupo, o práctica.

## Cola

Hay una cola en memoria por idioma y versión de protocolo.

1. **Personas primero.** Al entrar a la cola se intenta emparejar enseguida; además, cada tick vuelve
   a intentar, porque las ventanas crecen con la espera.
   - Ventana inicial ±100 ELO, +50 cada 5 s hasta ±400.
   - Se empareja sólo si la diferencia entra en la ventana de **ambos**, priorizando a quien más espera
     y al rival más cercano.
2. **Bot a los 3 s exactos.** Cada jugador tiene su propio temporizador: vence a `joinedAt + 3 s`
   (`BOT_CONFIG.afterMs`), no depende del tick.
   - Reentrar a la cola no reinicia la espera.
   - El pase de emparejamiento es síncrono y siempre empareja personas antes que bots: quien llega
     antes del plazo de otro juega contra esa persona.
3. **Cupo de calibración.** Con cupo, la partida contra el bot es de calibración y mueve el ELO. Sin
   cupo, es igual de inmediata pero **sin ELO** (RANKING_SYSTEM.md). Nadie queda esperando
   indefinidamente.
4. **Sin partidas duplicadas.** Mientras se lee la base para armar la partida, el jugador queda
   registrado como «pendiente».
   - Pedir la cola de nuevo en ese lapso (la app lo hace al reconectarse) se acepta sin crear otra
     partida; pedir otra cosa responde `already_in_battle`.
   - Si alguien sale o se desconecta en ese lapso y no vuelve, la partida no se crea y el otro vuelve a
     la cola con su espera original.
   - Si vuelve a conectarse con la misma versión, la partida le llega a la conexión nueva.
   - Si la base falla, se avisa `server_error` y no se reintenta (nunca en bucle).

## Persistencia

Las partidas de práctica no se guardan. Las ranked:

1. **Inicio:** `start_battle(id, idioma, j1, j2, versión)` o, contra un bot,
   `start_bot_battle_v2(…, p_rated)`, al terminar la cuenta atrás (idempotente). Si falla, la partida
   se cancela.
2. **Contexto:** `battle_settlement_context_v2(id, 24)` devuelve rating, partidas jugadas, victorias
   (sin posicionar), si la partida es ranked y cuántas partidas jugaron entre ambos en las últimas 24 h.
3. **Liquidación:** el servidor calcula el ELO con `shared/ranking.ts` y llama a
   `settle_battle(id, estado, jugadores)`. En **una transacción**, esa función:
   - bloquea las filas de `player_ratings` y verifica que el rating y las partidas jugadas sigan siendo
     los leídos (si no: `stale_rating`; el servidor relee y reintenta hasta 3 veces);
   - completa `battle_players`, actualiza `player_ratings`, inserta `rating_history`, cierra `battles`
     y evalúa logros.

   Las partidas no ranked (bot fuera del cupo) sólo guardan puntaje y resultado. Reliquidar devuelve
   `duplicate: true` sin tocar nada.

4. **Si la liquidación falla del todo,** la partida se cancela (`cancel_battle`) y se avisa
   `settlement_failed`.
5. **Limpieza:** al arrancar y cada 5 min, el servidor cancela las partidas abiertas con más de 5 min
   (`cancel_stale_battles`), que quedaron huérfanas por un reinicio.

## Bots

Con pocos jugadores, quien espera **3 s** sin rival humano juega contra un bot. Con cupo de calibración
(3 partidas con ELO por idioma) la partida mueve el ELO; sin cupo, se juega igual pero sin ELO (ver
RANKING_SYSTEM.md).

- **Siempre identificado:** nombre propio y distintivo **BOT** al encontrar rival, en la partida, en el
  resultado y en el historial. Nunca se presenta como persona.
- **A tu nivel:** su rating es el del jugador ± 40.
  - La habilidad base sale de ese rating (`botSkill`, curva continua `BOT_CONFIG.skillCurve`):
    precisión de 50 % (100) a 97 % (2200) y tiempo medio de 6,5 s a 1,2 s.
  - En Word Rush, el bot humanizado (`shared/arcadeBot.ts`) suma forma del día, dificultad por formato,
    rachas centradas, errores más lentos, demora de feedback entre desafíos y tiempos sin valores
    fijos.
  - Nunca responde más rápido que lo que se acepta de una persona.
  - Calibrado por simulación: en promedio acierta lo de su rating (±2,5 puntos).
- **Juega por el mismo camino que una persona:** responde la misma secuencia con el reloj del servidor
  y nada después de los 60 s. Toda jugada se verifica con el corrector; si el contenido no admite
  ninguna respuesta válida, el bot saltea ese desafío sin puntos y sigue (nunca queda trabado).
- **Sin cuenta:** el bot no tiene fila en `profiles` ni `player_ratings`. Ocupa el slot 2 de
  `battle_players` sin `user_id`, con `bot_name` y `bot_avatar_id` (`battles.has_bot = true`), y no
  aparece en la clasificación.
- **Formato clásico (protocolo 2):** el bot clásico (`botMove`) responde preguntas de opción múltiple
  y tarda el doble en las de escribir.
- **Ajustes:** `BOT_CONFIG` en `shared/bots.ts` y `ARCADE_BOT` en `shared/arcadeBot.ts`.
  `botAfterMs: null` en `createBattleServer` desactiva los bots.

## Sin servidor de partidas (sólo desarrollo)

Las builds de tienda usan el servidor de partidas (URL en `eas.json`). Sin
`EXPO_PUBLIC_BATTLE_SERVER_URL`, sólo en desarrollo, el ranked usa el flujo viejo por Supabase con el
formato clásico. **No es seguro para el lanzamiento:** el teléfono genera (bots) o recibe (personas) las
preguntas con la respuesta e informa su puntaje; la base sólo valida rangos. Se cierra revocando sus RPC
(pasos en DEPLOYMENT.md).

### Entre personas

1. **Cola:** la app llama `join_human_queue()` cada 1,5 s. La base empareja con otra persona activa del
   mismo idioma si la diferencia de ELO entra en la ventana de **ambos** (±100, +50 cada 5 s hasta
   ±400). Quien deja de consultar sale de la cola sola (`seen_at`).
2. **Partida:** al emparejar, la base genera las 40 preguntas (`rush_questions`, mismas reglas que
   `shared/wordRush.ts`) y fija el inicio 5 s después. `get_human_match()` se las da a los dos con la
   hora del servidor para sincronizar la cuenta atrás.
3. **En vivo:** cada teléfono publica su puntaje por **Supabase Realtime** (broadcast en
   `battle:<id>`) después de cada respuesta, sólo para mostrar.
4. **Resultado:** `finish_human_match()` (no antes de 70 s, máximo 180 por acierto, ≤ 40 respuestas).
   - Cuando están los dos, se liquida a ambos (ELO de `shared/ranking.ts` con anti-farming por rival
     repetido).
   - Quien no informa a los 75 s + 30 s de gracia pierde por abandono; `human_match_result()` lo
     cierra cuando el otro consulta.
5. **Sin nadie en `BOT_CONFIG.afterMs`:** `leave_human_queue()` (si justo lo emparejaron, devuelve esa
   partida) y se juega contra un bot (abajo).

### Contra bots

- `start_bot_match()` (Supabase) elige el bot a tu altura y genera **todas sus jugadas**
  (`battles.bot_script`): el teléfono sólo las reproduce.
  - Antes cierra como **abandono** cualquier partida tuya que haya quedado abierta.
  - Tope: 100 por día.
- La partida corre en el teléfono (`src/features/battle/localMatch.ts`) con las mismas reglas y la
  misma pantalla.
- `finish_bot_match(id, puntaje, correctas, respondidas, abandono)`:
  - valida el puntaje (no antes de 70 s desde el inicio, máximo 180 por acierto, ≤ 200 respuestas);
  - recalcula el puntaje del bot desde su guion, decide el resultado y liquida el ELO y los logros;
  - es idempotente.
- Las funciones SQL replican `botSkill`, `answerPoints` y `computeRatingChange`;
  `supabase/tests/botmatch.test.mjs` verifica que den exactamente lo mismo que `shared/`.

## Desafío a un amigo

Es una partida entre dos personas que se ponen de acuerdo, siempre por Supabase (también con servidor de
partidas). Usa el formato clásico de 75 s y no mueve el ELO. Word Rush unificado no la cambió.

- **Crear:** `create_friend_challenge()` → `{code, expires_at}`.
  - Código de 6 caracteres sin ambiguos (0/O, 1/I/L); vence en 15 min.
  - Crear otro anula el anterior. Tope: 30 por hora.
- **Esperar:** quien desafía consulta `friend_challenge_status(code)` cada 1,5 s (`waiting` /
  `matched` / `expired`). Si deja de consultar 10 s, el código ya no se acepta (`host_gone`).
- **Aceptar:** `accept_friend_challenge(code)` (mayúsculas indistintas, reintento idempotente) crea la
  partida con `is_ranked = false` y arranca en 5 s.
  - Errores: `challenge_not_found`, `challenge_expired`, `challenge_taken`, `own_challenge`,
    `language_mismatch`.
- **Jugar:** es la misma partida entre personas (`get_human_match`, Realtime, `finish_human_match`).
  `settle_human_match` guarda puntajes y resultado pero, al no ser ranked, no toca `player_ratings`,
  `rating_history` ni logros, y devuelve los ratings en null.
- **Link:** `polygo://challenge/<código>` → `src/app/challenge/[code].tsx` → `/battle?code=...`. Sin
  sesión iniciada, el link lleva al login y el código se pierde (hay que escribirlo a mano).

## Limitaciones conocidas

- **Un único proceso:** la cola, las partidas y la memoria de contenido reciente viven en memoria.
  Escalar a varias instancias requiere un adaptador (Redis) y afinidad de sesión.
- **Latencia:** el bonus de velocidad incluye la latencia de red de cada jugador.
- **Reinicios:** un reinicio del servidor cancela las partidas en curso (sin ELO) y vacía la memoria de
  contenido reciente.
- **Empates de tiempo:** la prioridad de una persona sobre el bot está garantizada si llega antes del
  plazo. Si los dos eventos caen en el mismo milisegundo, decide el orden en que Node los procesa.
