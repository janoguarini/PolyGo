# Protocolo de batalla — Word Rush

> **Estado: borrador de diseño (Fase 4). Nada de esto está implementado todavía.**
> El botón "Buscar partida" de la app está deshabilitado hasta que exista el servidor.

## Servicio

- `server/`: Node.js + TypeScript + Socket.IO, desplegado como proceso persistente (no serverless).
- Autentica cada conexión verificando el JWT de Supabase.
- Escribe en Supabase con la `service_role` key (sólo en el servidor).
- Importa `shared/` para ELO, rangos y puntuación: misma lógica que muestra la app.

## Máquina de estados de partida

```
searching ──▶ matched ──▶ ready ──▶ in_progress ──▶ completed
    │            │          │           │  ▲
    ▼            ▼          ▼           ▼  │
 cancelled   cancelled  cancelled   reconnecting ──▶ forfeited
```

| Transición | Condición |
| --- | --- |
| matched → ready | ambos confirman `match:ready` en ≤ 10 s; si no → cancelled (sin ELO) |
| in_progress → reconnecting | un jugador pierde la conexión |
| reconnecting → in_progress | vuelve en ≤ 15 s; el reloj del servidor **no** se detiene |
| reconnecting → forfeited | no vuelve a tiempo: derrota para quien abandonó |
| in_progress → completed | se agota el tiempo (75 s) o ambos terminan las preguntas |

Cualquier otra transición se rechaza.

## Reglas propuestas

- 75 s por partida, misma secuencia de preguntas para ambos, generada y firmada por el servidor.
- El cliente recibe enunciado y opciones, **nunca** la respuesta correcta antes de responder.
- Puntuación por pregunta (a validar en tests): correcta = 100 + bonus de velocidad ≤ 50; incorrecta = −50; puntaje total con piso 0. La penalización hace que adivinar al azar tenga valor esperado ≈ 0.
- Respuestas duplicadas para la misma pregunta: se ignoran. Respuestas recibidas tras el fin: no puntúan.
- Empate: misma puntuación final → desempate por precisión; si persiste, empate (S = 0.5).

## Eventos (contrato tipado en `shared/protocol.ts`, Fase 4)

`queue:join`, `queue:leave`, `match:found`, `match:ready`, `battle:start`, `battle:question`, `battle:answer`, `battle:score`, `battle:opponent_status`, `battle:reconnect`, `battle:finish`, `battle:cancel`.

## Persistencia (ya creada en la migración 0004)

`battles` y `battle_players` existen desde la Fase 3 para el historial. La liquidación debe, en una sola transacción: cerrar `battles` (estado y `ended_at`), completar ambas filas de `battle_players` (puntaje, resultado, rating antes/después), actualizar `player_ratings`, insertar `rating_history` (`UNIQUE (user_id, battle_id)` impide duplicar) y llamar a `evaluate_achievements` para cada jugador.

## Matchmaking

Cola por idioma y versión de protocolo. Ventana inicial ±100 ELO, se amplía +50 cada 5 s hasta ±400. Nunca se muestran bots como personas; si no hay rival, se ofrece un modo práctica claramente etiquetado y sin ELO.
