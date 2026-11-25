# Ranked Arcade: integración con el servidor de producción

Fecha: 2026-11-24. Trabajo local en `Polygo-client` (rama `client/stage0`), sin commit ni deploy.
Diseño de Arcade: [RANKED_ARCADE.md](RANKED_ARCADE.md).

## 1. Qué corre en Railway

| Dato                | Valor                                                                                                                             | Cómo se verificó                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Repositorio         | GitHub `janoguarini/PolyGo`                                                                                                       | deployment de GitHub creado por `railway-app[bot]`                           |
| Proyecto / entorno  | «melodious-compassion» / production (`project c29178df…`, `environment 6e0503cb…`)                                                | mismo deployment                                                             |
| Commit desplegado   | `52de70f6bfd0a160a0f69c8d76bb626887740911` («Tipos de Ranked Fase 1 verificados contra producción», 2026-11-06)                   | `gh api repos/janoguarini/PolyGo/deployments`                                |
| Fecha del deploy    | 2026-11-18 13:55 UTC, estado `success`                                                                                            | `deployments/7885281057/statuses`                                            |
| Rama                | `deploy/battle-server` apunta exactamente a ese commit (también `feature/ranked-server-authority`)                                | `gh api …/branches/deploy%2Fbattle-server`, `compare` = `identical`          |
| Build / inicio      | `server/Dockerfile` desde la raíz del repo (`RAILWAY_DOCKERFILE_PATH`); `node --import tsx src/index.ts`                          | `docs/DEPLOYMENT.md` + Dockerfile del commit (**no** confirmado en el panel) |
| Variables (nombres) | `RAILWAY_DOCKERFILE_PATH`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT` (la pone Railway)                                  | `docs/DEPLOYMENT.md` (**no** confirmado en el panel)                         |
| En ejecución        | `/health` → `{"ok":true,"protocolVersion":2,…}`; `cancel_stale_battles` cada 5 min (288 llamadas en 24 h en los logs de Supabase) | `GET /health`, logs de la API                                                |

Es el único deployment que Railway registró en GitHub. Lo que **no** se pudo leer sin acceso a Railway
(no hay CLI ni token en esta máquina): la rama configurada para despliegue automático, el root dir y el
comando de inicio reales, los nombres de las variables y si hubo un `railway up` manual posterior (no
deja rastro en GitHub). Evidencia en contra de un deploy manual del servidor original: sus cambios no
están commiteados, no hay CLI de Railway en la máquina, y ese servidor liquida con
`battle_settlement_context_v4` y graba con `record_battle_answers`, que **no existen** en la base de
producción (consultado en `pg_proc`), así que no podría liquidar ninguna partida.

Procedimiento mínimo para confirmarlo (sólo lectura, lo hace el dueño): Railway → proyecto
«melodious-compassion» → servicio del Battle Server → **Deployments**: el activo debe decir
`52de70f`. **Settings → Source**: repositorio, rama y root dir. **Settings → Deploy**: comando de inicio
y healthcheck `/health`. **Variables**: sólo los nombres. Con CLI: `railway status` y
`railway deployment list` (nunca `railway up` ni `railway redeploy`).

## 2. Tres servidores

- **A** = `Polygo-client/server` (era idéntico a C en `server/src`; ahora con Arcade + C.7/C.8).
- **B** = `PolyGo/server` (árbol de trabajo del original, cambios sin commitear sobre `52de70f`).
- **C** = Railway (`52de70f`).

`server/src` de C → HEAD de Polygo-client: 0 diferencias (sólo un test nuevo). `shared/` que importa el
servidor cambió de forma aditiva desde C: `curriculumApi`/`parseCurriculumApi` (C.8), `unitId` en
`RushWord`, `checkWritten` ya no acepta como tipeo una diferencia sólo de apóstrofos (misma regla que
las lecciones), idiomas nuevos en `languages.ts`.

| Funcionalidad                                                                      | A (Polygo-client, final)                          | B (original)                 | C (Railway)                    | Se preserva                  |
| ---------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------- | ------------------------------ | ---------------------------- |
| Handshake y versiones                                                              | acepta 2 y 3                                      | sólo 2                       | sólo 2                         | 2 intacto + 3                |
| Word Rush (`Battle`)                                                               | igual a C                                         | + captura por ítem (Etapa 3) | base                           | C                            |
| Ranked Arcade (`ArcadeBattle`)                                                     | sí                                                | no                           | no                             | A                            |
| Matchmaking (ventana ±100 → ±400, idioma)                                          | igual + cola separada por versión                 | igual a C                    | base                           | C + separación               |
| Bots y calibración (`start_bot_battle_v2`)                                         | igual (también en v3)                             | igual                        | base                           | C                            |
| `curriculumApi` en el handshake (C.8)                                              | **portado**                                       | sí                           | no                             | B                            |
| Filtro de unidades `rush_common_unit_ids` (C.7)                                    | **portado** (palabras y frases)                   | sí (palabras)                | no                             | B, extendido a Arcade        |
| `unitId` en `loadWords`                                                            | **portado**                                       | sí                           | no                             | B                            |
| ELO (`computeRatingChange`, sin posicionar, rival repetido)                        | igual a C                                         | igual + Glicko en sombra     | base                           | C                            |
| Liquidación (`settle_battle`, rating vigente, reintento `stale_rating`, duplicada) | igual a C                                         | contexto v4 + Glicko         | `battle_settlement_context_v2` | C                            |
| Recuperación de liquidación (`recoverSettlement`, Etapa 1.1)                       | no                                                | sí                           | no                             | no portado (§4)              |
| Grabación de respuestas `record_battle_answers` (Etapa 3.1)                        | no                                                | sí                           | no                             | no portado: la RPC no existe |
| RTT, retraso del bucle, reloj monotónico (Etapa 3)                                 | no                                                | sí                           | no                             | no portado                   |
| `ladderBattleEngine.ts`, `performance.ts` (épocas, offline)                        | no                                                | sí (sin uso en vivo)         | no                             | no portado                   |
| Gracia de reconexión 15 s, abandono, cancelación                                   | igual (Arcade lo hereda)                          | igual                        | base                           | C                            |
| Rate limit 20 eventos/s                                                            | igual                                             | igual                        | base                           | C                            |
| Barrido de huérfanas (`index.ts`)                                                  | igual                                             | igual                        | base                           | C                            |
| `/health`                                                                          | + `protocolVersions` (mantiene `protocolVersion`) | igual a C                    | base                           | C + campo                    |
| Desafíos con amigos                                                                | no pasan por el servidor (Supabase)               | ídem                         | ídem                           | sin cambios                  |

Cambios que se pisan: B reescribe `settlement.ts`, `battle.ts` y `types.ts` para Glicko y la captura de
la Etapa 3; esa parte no se trajo. Compatibles: C.7/C.8 (sólo toca la creación de partida, el handshake,
`types.ts` y `loadWords`) y se integró a mano, no copiando archivos.

## 3. Compatibilidad v2/v3

- La versión sale del handshake (`auth.protocolVersion`); fuera de `SUPPORTED_PROTOCOL_VERSIONS` (2, 3)
  → `protocol_mismatch`. Se guarda en `socket.data.protocolVersion`.
- Al entrar a la cola se guarda con el jugador; `Matchmaker.takePairs` sólo empareja la misma versión
  (además del idioma y la ventana de ELO, sin otros cambios). El bot y la práctica usan la versión de
  quien los pide.
- v2 → `Battle` (Word Rush, igual que hoy). v3 → `ArcadeBattle`. `battles.protocol_version` guarda 2 o 3.
- Desafíos con amigos: Supabase, Word Rush, sin cambios.

## 4. Lo que no se portó del original y por qué

- **Glicko en sombra y `battle_settlement_context_v4`**: las funciones no existen en producción; con ellas
  el servidor no liquidaría. Además Glicko/Etapa 3 quedó fuera de alcance.
- **`record_battle_answers`, RTT, monotónico, motor de escalera, performance** (Etapa 3): dependen de
  migraciones no aplicadas; no cambian el juego.
- **`recoverSettlement`** (Etapa 1.1: si la respuesta de `settle_battle` se pierde, lee el resultado
  guardado en vez de cancelar): usa tablas que existen, pero no está en producción, no lo necesita
  Arcade y en B está entrelazado con el contexto v4. Candidato a un paso propio.

## 5. Cambio de comportamiento al desplegar

Producción hoy **no** filtra el mazo por unidades. El servidor consolidado sí (v2 y v3), como ya lo hacen
la base y los flujos sin servidor (`20261117120000_curriculum_isolation`). Para las builds v2 eso
significa: Word Rush sólo con vocabulario de unidades que ambos jugadores tienen disponibles. Si para un
jugador el conjunto no alcanza para armar preguntas, la partida no se crea (`server_error`), nunca se
juega con «todas las palabras». Medido en producción (sólo lectura): los 4 ratings que existen (en, fr,
it, pt) tienen entre 479 y 772 palabras permitidas; es y zh todavía no tienen ratings.

## 6. Tests

Servidor (`node --import tsx --test`): arcade 17, battle 18, bots 6, curriculum 19 (13 de C.7/C.8 del
original, ahora con v2, + 6 de Arcade), integrity 11, matchmaking 9, server 7 → **87/87**.
Base con el servidor real contra SQL (PGlite): `curriculumPropagation` **23/23** (antes 17/23: los 6
casos de C.7/C.8 fallaban porque el servidor no tenía el filtro), `battle` 12, `rankedAllCourses` 19,
`rankedserver` 8, `stalesweep` 6. App: Jest 124 suites / 7.250 tests, `tsc` (app, scripts, servidor) y
`expo lint` sin errores.

## 7. Correcciones pre-deploy (2026-11-24)

- **P1 — corregido.** Si falla crear una práctica o práctica contra bot después del ack `ok`, el
  servidor manda **un** `server:error` (`server_error`) a ese socket y registra `battle_create_failed`.
  Antes el cliente se quedaba esperando. Éxito: sin cambios. Ranked, matchmaking, liquidación y ELO sin
  cambios.
- **P2 — corregido.** Una conexión de otra versión de protocolo no hereda una partida en curso: se
  rechaza en el handshake con `protocol_mismatch` (y, si la partida se creó entre el handshake y la
  conexión, con `server:error` `protocol_mismatch` y desconexión) **sin** cortar la conexión que la
  juega. Si el usuario estaba en la cola con otra versión, esa entrada se saca al conectar. Con la
  misma versión, la reconexión y la cola se comportan como siempre.
- Tests: `server/test/session.test.ts` (9). Contra una copia del servidor sin las correcciones, los 7
  que reproducen P1/P2 fallan y los 2 de comportamiento de siempre pasan.
- **Sin cambios, documentado:** P3 (el desafío siguiente llega por adelantado; el bonus de velocidad,
  ≤ 25 %, se mide desde la activación en el servidor), P4 (SIGTERM cierra sin esperar liquidaciones:
  la partida en curso se cancela sin ELO por el barrido), P5 (`loadWords` sin paginar; el límite de
  filas de PostgREST no se verificó).
