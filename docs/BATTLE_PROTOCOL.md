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

Cola en memoria por idioma (la versión de protocolo ya la filtra el handshake). Ventana inicial ±100 ELO, +50 cada 5 s hasta ±400; se empareja sólo si la diferencia entra en la ventana de **ambos**, priorizando a quien más espera y al rival más cercano. Nunca se muestran bots como personas: tras 30 s la app ofrece el modo práctica, claramente etiquetado y sin ELO.

## Limitaciones conocidas

- Un único proceso: la cola y las partidas viven en memoria. Escalar a varias instancias requiere un adaptador (Redis) y afinidad de sesión.
- El bonus de velocidad incluye la latencia de red de cada jugador.
- Un reinicio del servidor cancela las partidas en curso (sin ELO).
