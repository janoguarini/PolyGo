# PolyGo — Prevalidación integral antes de producción

Fecha: 2026-11-08/09. Rama `feature/ranked-server-authority`, sin commits. **Ninguna acción modificó
producción**: en el proyecto `wtymosvsymzoosxscnxi` sólo se ejecutaron consultas `SELECT` sobre catálogos y
listados (historial de migraciones, funciones desplegadas, interruptores, huella de esquema). No se aplicó
ninguna migración, no se desplegó nada, no se tocaron variables de EAS, no hubo builds.

Todo lo que dice «ejecutado» acá se corrió realmente; las cifras salen de las corridas. Lo que no se pudo
ejecutar está marcado como tal.

---

## A. Estado general

### Validado (ejecutado)

| Área                                                       | Cómo                                            | Resultado                                       |
| ---------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| TypeScript app + scripts                                   | `npm run typecheck`                             | sin errores                                     |
| TypeScript servidor de partidas                            | `npm --prefix server run typecheck`             | sin errores **después de corregir D-2**         |
| Lint                                                       | `npx expo lint`                                 | 0 problemas                                     |
| Jest                                                       | `npx jest --ci`, suite completa, sin otra carga | **58/58 suites, 6 046/6 046 pruebas**           |
| Base (PGlite)                                              | `npm run test:db`, suite completa               | ver §B.4 (300/300 en corrida limpia)            |
| Servidor de partidas                                       | `npm --prefix server test`                      | 50/50                                           |
| Concurrencia PG 17 (SRS v2)                                | `pg17/srs2-concurrency.mjs`                     | K1, K2, K4, K5, K9, K11, J1, J2 correctos       |
| Concurrencia PG 17 (repasos)                               | `pg17/record-concurrency.mjs`                   | R1, R2, R3 correctos                            |
| Concurrencia PG 17 (trabajos)                              | `pg17/jobs-concurrency.mjs` (**nuevo**)         | 6/6                                             |
| Migraciones pendientes sobre el esquema REAL de producción | `pg17/pending-migrations.mjs` (**nuevo**)       | 25/25                                           |
| Edge Function `learning-session` **ejecutándose en Deno**  | `deno/learning-session.e2e.mjs` (**nuevo**)     | **27/27 escenarios**, 184 invocaciones, 556 RPC |
| `deno check` de las 3 funciones                            | Deno 2.2.15                                     | sin errores                                     |
| Paquetes generados de la función                           | `npm run functions:build -- --check`            | al día                                          |
| Migración de fase 5 generada                               | `tsx scripts/build-phase5-sql.ts --check`       | al día                                          |
| Estado real de producción                                  | consultas de sólo lectura                       | §A.3                                            |

### No validado

- **App en dispositivo o emulador**: en esta máquina no hay Android SDK, `adb`, emulador ni iOS. No se
  simuló nada: queda el checklist manual de §E.4.
- **Edge Function en el Edge Runtime de Supabase** (no Deno «pelado»): se usó Deno 2.2.15 oficial con
  `npm:` resuelto desde el registro, que es lo que hace el runtime, pero no el contenedor `edge-runtime`
  (Docker no estaba corriendo). Diferencias posibles: límites de CPU/memoria, cabeceras del gateway.
- **GoTrue y PostgREST reales**: se emularon (JWT HS256 reales, roles reales de PostgreSQL, una
  transacción por pedido). No se probó contra un Supabase local completo.
- **Nada autenticado contra producción** (no corresponde en esta etapa).
- **Ventana entre migraciones y despliegue** con la función hoy desplegada (v2, fase 3): verificado sólo
  por firmas (ninguna función que usa cambió de firma, `learning_submit_review_graded` sigue existiendo),
  no ejecutado. Ningún cliente publicado usa esas acciones.

### Requiere pruebas manuales

Todo §E (dispositivo), la prueba autenticada con cuenta de prueba después del despliegue (§E.3, pasos 10–12)
y la revisión de logs posterior.

### A.3 Estado real de producción (verificado 2026-11-08, sólo lectura)

| Elemento                                 | Esperado            | Real                                                                                                                                                                                                     |
| ---------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Migraciones de fases 1–3 en el historial | aplicadas           | **sí**, las 25 con la misma versión que los archivos locales (`20261107120000` … `20261109140000`)                                                                                                       |
| Fases 4 y 5                              | sin aplicar         | **sin aplicar**: no existen `enabled_for_display`, `record_learning_session`, `learning_route_usage`, `learning_run_job`, `learning_session_clients`, `review_presentation_answers`, `learning_job_runs` |
| `srs_v2_settings.enabled`                | false               | **false**                                                                                                                                                                                                |
| `me-1.0.0.enabled_for_adaptive`          | false               | **false** (`enabled_for_display` todavía no existe)                                                                                                                                                      |
| `pg_cron`                                | no instalado        | **no instalado** (extensiones: pg_stat_statements, pgcrypto, plpgsql, supabase_vault, uuid-ossp)                                                                                                         |
| `learning-session`                       | v2 (fase 3)         | **versión 2**, `verify_jwt: false`, actualizada 2026-11-08                                                                                                                                               |
| Uso de la ruta nueva                     | ninguno (sin build) | 0 correcciones, 0 planes; 9 sesiones y 4 perfiles en total                                                                                                                                               |
| PostgreSQL                               | 17                  | 17.11                                                                                                                                                                                                    |

**Hallazgo importante — el historial de migraciones de producción NO es un espejo del directorio local**
(D-4): 152 archivos locales contra 92 filas remotas. 61 archivos locales no figuran con esa versión
(contenido A2, multilenguaje it/pt/zh, rush, logros: cargados por `execute_sql`/editor SQL) y 3 están con
otra versión (`ranked_v2`, `achievements_catalog`, `friend_daily_missions`, `ranked_server_authority`,
`stale_sweep_server_only` tienen otro timestamp en prod). **Consecuencia: `supabase db push` y
`supabase migration up` están prohibidos para este release** (intentarían reejecutar decenas de
migraciones viejas). Las 4 pendientes se aplican una por una, como en las fases 2 y 3.

---

## B. Pruebas

### B.1 TypeScript y lint

- `npm run typecheck` (app `tsc --noEmit` + `tsc -p scripts`): exit 0.
- `npx expo lint`: exit 0, sin avisos.
- `npm --prefix server run typecheck`: **fallaba** (TS1484 en `shared/adaptivePlanner.ts`: `Dimension` y `Rung`
  importados como valores con `verbatimModuleSyntax`). Corregido (D-2). Ahora exit 0. Esto rompía
  `npm run check` (CI).
- `deno check` de `learning-session`, `delete-account`, `notify-battle-invite`: exit 0, sin `deno.lock`.

### B.2 Jest

| Corrida                               | Suites    | Pruebas         | Tiempo | Nota                                                  |
| ------------------------------------- | --------- | --------------- | ------ | ----------------------------------------------------- |
| 1 (en paralelo con `tsc` y `test:db`) | 56/58     | 6 044/6 046     | 664 s  | `Button.test.tsx` y `report.test.tsx`: timeout de 5 s |
| 2 (sola)                              | **58/58** | **6 046/6 046** | 208 s  | —                                                     |

Diagnóstico: las dos fallas son el timeout por defecto de Jest (5 s) con la CPU saturada; ninguna aserción
funcional falló. Flakiness por carga, no defecto. No se tocaron.

### B.3 Concurrencia en PostgreSQL 17 (dos o más conexiones reales)

Clústeres desechables (`initdb`, puertos 55432–55438, directorio temporal). Cada «sesión» es un `psql` propio;
`pg_sleep` dentro de la transacción fuerza el intercalado.

| Escenario pedido                             | Prueba                                                                                                   | Resultado                                                            |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Dos envíos simultáneos de la misma respuesta | R1; Deno «dos envíos simultáneos del mismo repaso»; «dos respuestas simultáneas a la misma presentación» | una sola sesión / una sola corrección; el otro `duplicate`           |
| Ruta nueva contra ruta antigua               | R2 (mismo `session_id` a la vez)                                                                         | gana una, sin mezclar                                                |
| Dos repasos simultáneos                      | R3 (v2 encendido, conceptos solapados), K1, K9 (20 envíos)                                               | `srs_seq` 1 y 2, sin huecos, recálculo = guardado, sin interbloqueos |
| Reintentos de sesiones interrumpidas         | K4, K5 (fallo y reintento), Deno «sesión interrumpida»                                                   | se aplica una vez; la retomada devuelve lo corregido                 |
| Ejercicios de varios conceptos               | R3; Deno «ítem de varios conceptos»                                                                      | sólo los conceptos target, una vez                                   |
| Actualizaciones de SRS                       | K1–K11                                                                                                   | correctos                                                            |
| Jobs simultáneos y bloqueo de duplicados     | **J1–J5 nuevos**                                                                                         | ver abajo                                                            |

`jobs-concurrency.mjs` (nuevo):

- J1: dos `learning_run_job('mastery_queue')` a la vez → uno `ok`, el otro `skipped/already_running`.
- J2: 8 ejecuciones simultáneas → 1 trabajó, 7 `skipped`; las 50 unidades procesadas exactamente una vez;
  las 8 ejecuciones quedan registradas.
- J3: con todo apagado, `me_hint` → `skipped/motor_disabled`, `srs_repair` y `srs_migrations` →
  `skipped/srs_v2_disabled`.
- J4: `srs_v2_process_migrations` con otra ejecución en curso → `skipped/already_running`; dos a la vez (v2
  encendido sólo en esa base) → 12 usuarios migrados una vez cada uno, ninguno repetido ni fallido.
- J5: dos retenciones y `mastery_queue` a la vez → sin fallas; conserva la última de cada trabajo.

### B.4 Base de datos (`npm run test:db`, suite completa)

| Corrida                                        | Resultado   | Tiempo             | Fallas                                                                                   |
| ---------------------------------------------- | ----------- | ------------------ | ---------------------------------------------------------------------------------------- |
| 1 (con Jest y `tsc` en paralelo)               | 298/300     | 12 min             | `energy.test.mjs:156` («espera 3593.865»), `humanmatch.test.mjs:183` («empieza en ~5 s») |
| 2 (sola)                                       | **300/300** | 3 min 7 s          | —                                                                                        |
| 3 (sola, después de D-1; máquina lenta)        | 299/300     | 9 min 35 s         | `humanmatch.test.mjs:183`                                                                |
| 4 (la máquina se suspendió y cruzó medianoche) | 299/300     | (708 min de reloj) | `srs2.test.mjs:365` AL19 (`14 !== 15`)                                                   |
| 5 (final, sola)                                | **300/300** | 2 min 18 s         | —                                                                                        |

Diagnóstico de cada falla (investigado, no reintentado a ciegas):

- **energy.test.mjs** (no es Ranked): comparaba `next_unit_at − server_now` con tolerancia de 5 s, pero
  `anchor_at` se fija al gastar y el reloj de pared sigue corriendo; con carga pasaron ~6 s. **Corregido en
  la prueba (D-1)**: ahora compara exacto contra el ancla guardada (`next_unit_at − anchor_at = 3 h` y
  `= 9 h` tras «viajar» 8 h) y sólo exige que la espera esté en (0, 3 h]. Comprueba lo mismo, sin reloj.
- **humanmatch.test.mjs** (Ranked, prueba conocida): `starts_at = now() + 5 s` se fija al emparejar y
  `server_now` se lee después; si entre ambas llamadas pasan > 2 s la aserción `> 3 000 ms` falla. Depende
  de la carga de la máquina (`node --test` corre los 30 archivos en paralelo, cada uno con su PGlite WASM).
  **No se tocó** (Ranked). Pasó en la corrida 2. Aislamiento recomendado (no aplicado): medir contra
  `starts_at − created_at` de la partida en vez de contra el reloj de la segunda lectura.
- **srs2.test.mjs AL19**: duró 3 413 s porque la máquina se suspendió; la prueba toma `evaluated_on` (día
  local) al empezar y pasa `new Date()` en cada iteración: al cruzar la medianoche local el conteo se corre
  un día. Sensibilidad de la prueba al cambio de fecha durante su ejecución, no del cálculo AL19 (que
  recibe el día explícito). Se documenta; no se tocó.

#### B.4.1 Corrida final

Después de D-1 y D-2, suite completa sin otra carga: **300/300, exit 0, 2 min 18 s**. La suite pasa
completa (no sólo por archivo). Quedan dos pruebas sensibles al entorno, documentadas y no ocultadas:
`humanmatch` (carga, Ranked, D-3) y AL19 (cruce de medianoche durante la prueba, D-5).

### B.5 Edge Function `learning-session` en Deno

**Qué se ejecutó**: `index.ts` sin modificar, con `deno run --no-lock --node-modules-dir=none --allow-net
--allow-env` (Deno 2.2.15 LTS oficial, `npm:@supabase/supabase-js@2` resuelto desde el registro a
**2.119.0**, como el runtime). Cadena completa:

```
supabase-js (functions.invoke, como la app) → gateway emulado (verify_jwt=false) → Deno: index.ts
  → supabase-js de la función → GoTrue emulado (/auth/v1/user, JWT HS256 verificado, usuario existente)
                              → PostgREST emulado (/rest/v1/rpc, una transacción por pedido,
                                `set local role` según el JWT, request.jwt.claim.sub, argumentos por nombre)
  → PostgreSQL 17 con el stub de Supabase y las 152 migraciones
```

Arnés: `supabase/tests/deno/learning-session.e2e.mjs` (reproducible; Deno no es dependencia del proyecto,
se pasa `DENO_BIN`).

Hallazgo de entorno: sin `--node-modules-dir=none`, Deno 2 detecta el `package.json` de la raíz y resuelve
`npm:` desde `node_modules` del proyecto (supabase-js 2.118) en vez del registro. El despliegue usa el
registro; la prueba final usa el registro.

**Resultado: 27/27 escenarios** (corrida final: 184 invocaciones de la función, 180 `getUser`, 556 RPC,
179 s):

| #   | Escenario                                                | Qué se comprobó                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B   | OPTIONS / método                                         | CORS `*`; GET → 405                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| B   | JWT                                                      | sin token, firma falsa, vencido, usuario inexistente y anon key → 401 `unauthorized`; nada registrado                                                                                                                                                                                                                                                                                                                                                               |
| B   | Entrada                                                  | no JSON, `session_id` inválido, acción desconocida, idioma `ENG`, foco inválido → 400                                                                                                                                                                                                                                                                                                                                                                               |
| F   | Permisos                                                 | `authenticated` y `anon` reciben 42501 en `learning_start_lesson`, `record_learning_session`, `learning_review_answer`, `learning_session_presentations`, `learning_route_usage`, `learning_run_job`, `learning_retention_sweep`, `learning_start_basic_review`, `learning_focus_candidates`; otro usuario no lee presentaciones ajenas                                                                                                                             |
| D   | Lección completa                                         | `start` idempotente (mismas presentaciones); el cliente dice «correct» en una incorrecta y el servidor la registra `incorrect`; energía −1 sin Plus; progreso; palabras v1; actividad diaria (racha); `learning_session_clients = lesson_graded,2,android`; `srs: null` con v2 apagado; reenvío → `duplicate` sin cambios                                                                                                                                           |
| D   | Doble envío de lección simultáneo                        | 1 sesión, intentos sin duplicar, energía −1 una sola vez                                                                                                                                                                                                                                                                                                                                                                                                            |
| D   | Reglas                                                   | `lesson_locked` 403, `lesson_not_found` 404, incompleta y sesión ajena rechazadas sin registros parciales, `no_energy` 402 sin registros parciales                                                                                                                                                                                                                                                                                                                  |
| D   | Repaso básico (v2 apagado)                               | origen `basic_review`; ≤ 10 ítems; la palabra con más errores entra; los ítems no traen la respuesta; corrección del servidor; repetir una respuesta → vale la primera (`duplicate`, `matches:false`); repetición P4 (`attempt_no 2`) sólo tras un error (si no, 409 `retry_not_allowed`); envío por `record_learning_session`; SRS v1 actualizado; energía intacta; reenvío `duplicate`; `start_review` sobre sesión cerrada → 409; UPDATE de evidencias rechazado |
| D   | Respuesta distinta a la registrada                       | 409 `answer_mismatch`, sin registros; luego el envío correcto pasa                                                                                                                                                                                                                                                                                                                                                                                                  |
| D   | Doble envío de repaso / doble respuesta simultánea       | una sesión / una corrección; las dos llamadas ven el mismo veredicto                                                                                                                                                                                                                                                                                                                                                                                                |
| D   | Estados                                                  | contrato 1 → `srs_v2_disabled`; sin vencidas → `up_to_date`; `es` y `fr` → `content_unavailable`; `xx` → 400                                                                                                                                                                                                                                                                                                                                                        |
| D   | Chino                                                    | lección y repaso `zh` completos, contenido Han intacto, todas correctas por el servidor                                                                                                                                                                                                                                                                                                                                                                             |
| D   | Plus                                                     | sin Plus → 403 `plus_required`; con Plus: inteligente (`focus_review`) y por tema, sin energía; un `session_id` Plus no se retoma como básico (409 `session_conflict`)                                                                                                                                                                                                                                                                                              |
| F   | Varios conceptos                                         | ítem real de varios conceptos en el plan; sólo sus palabras target suben `seen_count` +1, una vez; las demás sin cambios                                                                                                                                                                                                                                                                                                                                            |
| D   | Interrumpida                                             | retomar con el mismo id: mismas presentaciones, la ya respondida viene corregida                                                                                                                                                                                                                                                                                                                                                                                    |
| D   | Cambio de día                                            | sesión de ayer → `session_expired`; incompleta no admite respuestas (409); abandonada no bloquea una nueva; completa y vencida se envía                                                                                                                                                                                                                                                                                                                             |
| D   | Zona horaria                                             | retomar con otra zona: manda la registrada; zona inexistente no da 500                                                                                                                                                                                                                                                                                                                                                                                              |
| F   | Aislamiento                                              | repaso italiano sólo con palabras `it`; el progreso inglés y otro usuario (progreso, energía, actividad) sin cambios; otro usuario no puede responder ni enviar la sesión                                                                                                                                                                                                                                                                                           |
| F   | Errores sin parciales                                    | envío/respuesta de sesión inexistente → 4xx (no 500), nada registrado                                                                                                                                                                                                                                                                                                                                                                                               |
| I   | Ruta vieja                                               | `submit_learning_session` por PostgREST con el JWT del usuario (lección y repaso) funciona; reenvío `duplicate`; `learning_route_usage` distingue `legacy_lesson`, `legacy_review`, `lesson_graded`, `record_learning_session`                                                                                                                                                                                                                                      |
| I   | Build vieja reenvía un id guardado por la ruta nueva     | `duplicate`                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| D   | Adaptativo (v2 encendido **sólo en la base desechable**) | la lección devuelve `srs`; plan `adaptive_review`, `persistent`, corrección, evidencias, `srs` confirmado; se apaga y se verifica `false`                                                                                                                                                                                                                                                                                                                           |
| I   | `LEARNING_MIN_CONTRACT=2`                                | sin contrato → 426 `client_outdated` con `min_contract: 2`; contrato 2 normal                                                                                                                                                                                                                                                                                                                                                                                       |
| B   | Claves nuevas                                            | sólo `SUPABASE_SECRET_KEYS` (`sb_secret_…`) → funciona                                                                                                                                                                                                                                                                                                                                                                                                              |
| B   | Sin clave de servicio                                    | nunca 200                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| H   | Interruptores al terminar                                | `false,false,false`, sin `pg_cron`                                                                                                                                                                                                                                                                                                                                                                                                                                  |

Observación (no corregida, no bloqueante, O-1): sin clave de servicio, `createClient` lanza **antes** del
`try` → Deno responde 500 genérico sin JSON ni CORS. Sólo pasa con la función mal configurada.

### B.6 App y dispositivo

No ejecutado (sin dispositivo/emulador). Ver §E.4.

---

## C. Migraciones

### C.1 Archivos y orden definitivo

| #   | Archivo                                    | Bytes  | SHA-256 (16)       | Depende de                           |
| --- | ------------------------------------------ | ------ | ------------------ | ------------------------------------ |
| 1   | `20261110120000_learning_phase4.sql`       | 54 006 | `21bb429300c4f175` | fase 3                               |
| 2   | `20261110130000_learning_jobs.sql`         | 11 656 | `acc3b4473a516288` | 1 (lógicamente)                      |
| 3   | `20261110140000_learning_phase4_close.sql` | 55 742 | `430baf8bb68725a0` | 1 (`review_presentation_answers`), 2 |
| 4   | `20261111120000_learning_phase5.sql`       | 68 160 | `c91f693f7b4207af` | 1, 3                                 |

La de trabajos es la **versión final con `retention`** en el CHECK de `learning_job_runs.job` (línea 28).
Antes de aplicar, comparar los SHA-256 completos (`sha256sum`) con estos.

### C.2 Ejecución local sobre el esquema de producción (`pending-migrations.mjs`, 25/25)

- **M1 base = producción**: las 148 migraciones hasta `20261109140000` en PG 17 dan una huella
  (`schema-fingerprint.sql`: funciones con cuerpo, `SECURITY DEFINER`, `search_path`, resultado,
  volatilidad y permisos de anon/authenticated/service_role; columnas; constraints; índices; RLS; políticas;
  triggers) **idéntica a la de producción en los 1 323 objetos**. Primero difirieron 8 funciones; se
  investigó: 6 tienen CRLF en prod (cargadas desde Windows) y 2 (`poly_earnings`, `sync_polys`) están en prod
  sin las líneas de comentario; código idéntico (md5 normalizado igual en ambos lados). La huella normaliza
  eso.
- **M2 datos previos**: 4 usuarios con lección y repaso por la ruta vieja y perfil público.
- **M3** las 4 en orden, una transacción por archivo: 107–276 ms cada una. +87 objetos nuevos, 11
  reemplazados, **0 quitados**.
  Reemplazados: `get_public_profile`, `learning_review_candidates`, `learning_start_review`,
  `learning_submit_review_graded`, `review_item_candidates`, `srs_v2_apply_session`,
  `srs_v2_migrate_user_locked` (mismas firmas) y columnas nuevas con default en `knowledge_recompute_queue`,
  `mastery_model_versions`, `srs_migration_queue`, `srs_session_plans`.
- **M4** 23 funciones `SECURITY DEFINER` nuevas/reemplazadas, todas con `search_path`; anon no ejecuta nada
  nuevo; authenticated sólo `get_learning_mastery(text,text)` y `get_public_profile(uuid)` (mismos permisos
  que antes); service_role ejecuta todo; las 5 tablas nuevas (`learning_job_runs`,
  `learning_session_clients`, `review_presentation_answers`, `review_presentation_retries`,
  `srs_unit_updates`) con RLS y sin acceso de clientes; triggers de inmutabilidad de
  `exercise_attempt_gradings` presentes.
- **M5** ningún objeto de Ranked, partidas, economía, amigos ni energía cambia; ninguna fila previa de las
  93 tablas cambia ni se borra (sólo `practice_sources` +1 fila: el origen de catálogo `basic_review`);
  `get_public_profile` compatible: sólo agrega `learning.concepts_mastered = null`; la ruta vieja responde.
- **M6** v2, Adaptive y Display apagados, sin `pg_cron`, ningún trabajo ejecutado.
- **M7** el esquema final es idéntico al de una instalación desde cero.
- **M8 idempotencia**: aplicar cada archivo una segunda vez no falla ni cambia el esquema (sirve si un
  corte deja la duda de si se aplicó).
- **M9 orden incorrecto**: fase 5 o el cierre antes que la fase 4 fallan
  (`relation "public.review_presentation_answers" does not exist`) y no dejan nada; trabajos sola sí se aplica.
- **M10 atomicidad**: un error a mitad de archivo (simulado) no deja ningún objeto.
- **M11 recuperación**: reaplicar `pg_get_functiondef` de las 7 funciones reemplazadas, tomadas antes,
  devuelve su versión anterior exacta (cuerpo, `SECURITY DEFINER`, `search_path`, permisos).

### C.3 Riesgos

| Riesgo                                              | Nivel    | Mitigación                                                                                                                                                                                                       |
| --------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Usar `supabase db push` (historial divergente, D-4) | **Alto** | Prohibido; aplicar archivo por archivo (§E.3)                                                                                                                                                                    |
| Aplicar en otro orden                               | Medio    | El orden incorrecto falla sin dejar nada (M9); seguir la tabla                                                                                                                                                   |
| Operaciones destructivas                            | Bajo     | Ninguna al migrar. Único `DELETE`: dentro de `learning_retention_sweep` (sólo `learning_job_runs`; nadie la llama sin `pg_cron`). El MCP de Supabase rechaza el archivo 3 por ese texto: usar CLI/Management API |
| Bloqueos durante la migración                       | Bajo     | ALTER con default constante (sin reescritura) sobre tablas casi vacías; ~0,2 s por archivo en local                                                                                                              |
| Ventana migraciones → función nueva                 | Bajo     | Firmas iguales; la función actual (v2) sigue sirviendo lecciones; ningún cliente usa repasos del servidor                                                                                                        |
| Build nueva antes de la función                     | **Alto** | Repasos en error (sin respaldo). Orden obligatorio: migraciones → función → build                                                                                                                                |

### C.4 Recuperación

Las 4 migraciones son aditivas. Antes de aplicar se guarda la definición de las 7 funciones que se
reemplazan (paso 2 de §E.3). Si algo sale mal **después** de aplicar:

1. Si la función nueva falla: volver a desplegar la v2. Esa versión no está en el repositorio (sin
   commit), por eso **se descarga una copia de la v2 desplegada antes del paso 6** (§E.3 paso 2). La v2
   sigue siendo compatible con el esquema migrado (firmas sin cambios).
2. Restaurar las 7 funciones con el archivo guardado (probado en M11). Las tablas, columnas y funciones
   nuevas pueden quedar (nadie las usa con la función anterior). Quitarlas sería destructivo: requiere
   autorización expresa y no hace falta para volver al comportamiento anterior.
3. Las filas de `schema_migrations` insertadas a mano se dejan (documentan lo aplicado).

---

## D. Incidencias

### Defectos encontrados y corregidos

| Id  | Defecto                                                                                                                                 | Corrección                                                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| D-1 | `energy.test.mjs` dependía del reloj de pared (tolerancia 5 s); fallaba con carga                                                       | Aserción exacta contra `anchor_at` (sin cambiar lo que se prueba). Pasa 6/6                   |
| D-2 | `shared/adaptivePlanner.ts` importaba tipos como valores: `npm --prefix server run typecheck` (y `npm run check`/CI) fallaba con TS1484 | `type Dimension`, `type Rung`. El paquete `planner.generated.js` no cambia (`--check` al día) |

### Hallazgos documentados (no se cambian en esta etapa)

| Id  | Hallazgo                                                                                      | Impacto                                                                                                                                                                             |
| --- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-3 | `humanmatch.test.mjs:183` (Ranked) depende de la carga de la máquina                          | Falla intermitente conocida; no se tocó Ranked                                                                                                                                      |
| D-4 | Historial de migraciones remoto ≠ directorio local (61 archivos sin fila, 5 con otra versión) | Prohíbe `db push`; ver §E.3. Reconciliar el historial (`supabase migration repair`) es una tarea aparte, con autorización                                                           |
| D-5 | AL19 (`srs2.test.mjs`) falla si la prueba cruza la medianoche local mientras corre            | Sólo prueba                                                                                                                                                                         |
| D-6 | Jest: `Button`/`report` superan 5 s con la CPU saturada                                       | Sólo con carga                                                                                                                                                                      |
| O-1 | Sin clave de servicio, la función responde 500 sin JSON ni CORS (lanza antes del `try`)       | Sólo con mala configuración                                                                                                                                                         |
| O-2 | `EXPO_PUBLIC_BATTLE_SERVER_URL` vacía en `.env`; el servidor de partidas no está desplegado   | Con la variable vacía la app usa el modo Ranked por Supabase (diseño vigente). Fuera de este release                                                                                |
| O-3 | `eas.json` no fija `environment` en los perfiles                                              | EAS lo infiere (production si `distribution` es store —el valor por defecto—, development con `developmentClient`, preview el resto). Recomendado fijarlo explícito; no se modificó |
| O-4 | Producción tiene funciones con CRLF y sin comentarios respecto de los archivos                | Sin efecto; la huella lo normaliza                                                                                                                                                  |

### Pendientes

- Pruebas en dispositivo (§E.4).
- Prueba autenticada con la cuenta de prueba después del despliegue.
- `src/lib/database.generated.ts` desactualizado respecto de fases 1–5 (la app usa casts); se regenera
  después de aplicar (§E.3 paso 5).

### Bloqueos externos

- **F10** (licencias): bloquea encender el SRS v2. Ninguna validación técnica la reemplaza.
- Variables `EXPO_PUBLIC_*` de EAS sin crear (las crea el responsable con acceso).
- Dispositivo físico o emulador para §E.4.
- Servidor de partidas sin desplegar (sólo si se quiere Ranked por servidor).

---

## E. Publicación (requiere autorización expresa; nada ejecutado)

### E.1 Variables de EAS

| Variable                         | Obligatoria                                               | Perfiles                         | Entorno EAS                      | Visibilidad                                                                   | Fuente                                                                                                                                     |
| -------------------------------- | --------------------------------------------------------- | -------------------------------- | -------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `EXPO_PUBLIC_SUPABASE_URL`       | sí (sin ella la app muestra la pantalla de configuración) | development, preview, production | development, preview, production | plaintext                                                                     | URL del proyecto `wtymosvsymzoosxscnxi`                                                                                                    |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`  | sí                                                        | todos                            | los tres                         | sensitive (se empaqueta en la app: no es secreta, pero no se muestra en logs) | clave **anon/publishable** (verificado: la del `.env` local es `role: anon` del proyecto correcto). **Nunca** service_role ni `sb_secret_` |
| `EXPO_PUBLIC_BATTLE_SERVER_URL`  | no                                                        | todos                            | los tres                         | plaintext                                                                     | **Dejar sin definir** mientras el servidor no esté desplegado (vacía = modo Supabase)                                                      |
| `EXPO_PUBLIC_PRIVACY_POLICY_URL` | ya está                                                   | todos                            | —                                | —                                                                             | en `eas.json` (`env` de cada perfil)                                                                                                       |

Las variables públicas no pueden tener visibilidad `secret` (docs de EAS). La Edge Function **no** necesita
secretos nuevos: `SUPABASE_URL` y la clave de servicio las inyecta Supabase. `LEARNING_MIN_CONTRACT` no se
define (por defecto 1: no rechaza a nadie).

Comandos (los corre quien tenga acceso; no imprimir valores):

```sh
npx eas-cli@latest env:set --name EXPO_PUBLIC_SUPABASE_URL      --value "<url>"      --environment production --visibility plaintext
npx eas-cli@latest env:set --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "<anon key>" --environment production --visibility sensitive
# repetir con --environment preview y --environment development
npx eas-cli@latest env:pull --environment production   # verificar (escribe .env.local; no commitear)
```

### E.2 Orden de despliegue

1. Migraciones (4) → 2. Verificación → 3. Tipos → 4. Función → 5. Verificación → 6. Variables EAS →
2. Build → 8. Pruebas. **La función antes de la build. Nunca encender v2/Adaptive/Display ni `pg_cron`
   como parte del release.**

### E.3 Procedimiento con comandos

Nota: en esta máquina el CLI de Supabase cacheado por npx no arranca (`spawn UNKNOWN`); las banderas se
comprobaron contra la referencia oficial (CLI v3: `db query --remote/-f/-o json/--read-only`, `--yes` global),
no ejecutándolas. Correr `npx supabase@latest --version` antes de empezar.

Condición general de detención: cualquier paso que no dé el resultado esperado detiene todo; no se sigue
«para ver qué pasa».

```sh
# 1. Proyecto correcto (debe mostrar wtymosvsymzoosxscnxi / PolyGo)
npx supabase projects list
# DETENER si el ref no es wtymosvsymzoosxscnxi.

# 2. Estado previo y respaldo de lo que se reemplaza (sólo lectura)
npx supabase db query --remote=wtymosvsymzoosxscnxi --read-only -o json "select version from supabase_migrations.schema_migrations where version >= '20261109140000' order by 1"
#   esperado: sólo 20261109140000. DETENER si aparece alguna de las 4.
npx supabase db query --remote=wtymosvsymzoosxscnxi --read-only -o json "select (select enabled from public.srs_v2_settings), (select bool_or(enabled_for_adaptive) from public.mastery_model_versions), (select count(*) from pg_extension where extname='pg_cron')"
#   esperado: false, false, 0.
npx supabase db query --remote=wtymosvsymzoosxscnxi --read-only -o json -f supabase/tests/pg17/schema-fingerprint.sql > fp-antes.json
#   comparar con la huella usada en esta validación (debe coincidir; si no, DETENER y repetir pending-migrations.mjs con la nueva)
npx supabase db query --remote=wtymosvsymzoosxscnxi --read-only -o json "select string_agg(pg_get_functiondef(p.oid) || ';', E'\n\n') from pg_proc p where p.pronamespace='public'::regnamespace and p.proname in ('get_public_profile','learning_review_candidates','learning_start_review','learning_submit_review_graded','review_item_candidates','srs_v2_apply_session','srs_v2_migrate_user_locked')" > restore-before-phase4.sql
#   guardar también la función desplegada v2 (Dashboard → Edge Functions → learning-session → Download, o get_edge_function).
sha256sum supabase/migrations/2026111[01]*.sql    # comparar con §C.1

# 3. Aplicar, UNA POR UNA, en este orden. Cada archivo en una transacción con su fila de historial
#    (como en fases 2 y 3). NO usar `supabase db push` ni `migration up` (D-4).
for f in 20261110120000_learning_phase4 20261110130000_learning_jobs 20261110140000_learning_phase4_close 20261111120000_learning_phase5; do
  v=${f%%_*}; n=${f#*_}
  { echo "begin;"; cat "supabase/migrations/$f.sql"; echo ";";
    echo "insert into supabase_migrations.schema_migrations (version, name, statements, created_by) values ('$v', '$n', array[]::text[], 'polygo-release-cli');";
    echo "commit;"; } > "/tmp/$f.apply.sql"
  npx supabase db query --remote=wtymosvsymzoosxscnxi --yes -f "/tmp/$f.apply.sql" || { echo "DETENER en $f"; break; }
done
#   (Alternativa equivalente: Management API POST /v1/projects/<ref>/database/query con el mismo cuerpo.)

# 4. Verificación de objetos y permisos
npx supabase db query --remote=wtymosvsymzoosxscnxi --read-only -o json -f supabase/tests/pg17/schema-fingerprint.sql > fp-despues.json
#   comparar con fp-after.json de pending-migrations.mjs: deben coincidir los 1 410 objetos (1 323 + 87).
npx supabase db query --remote=wtymosvsymzoosxscnxi --read-only -o json "select (select enabled from public.srs_v2_settings), (select bool_or(enabled_for_adaptive) from public.mastery_model_versions), (select bool_or(enabled_for_display) from public.mastery_model_versions), (select count(*) from pg_extension where extname='pg_cron'), (select count(*) from public.learning_job_runs)"
#   esperado: false, false, false, 0, 0. DETENER si no.
npx supabase db query --remote=wtymosvsymzoosxscnxi --read-only -o json "select public.learning_review_coverage('en')"   # available: true
#   + advisors de seguridad (Dashboard o MCP get_advisors security): sin avisos nuevos sobre tablas/funciones nuevas.

# 5. Tipos
npx supabase gen types typescript --project-id wtymosvsymzoosxscnxi > src/lib/database.generated.ts
npm run typecheck && npx expo lint && npx jest --ci

# 6. Función (paquetes al día; SIN verificación de JWT del gateway: la función valida el token)
npm run functions:build -- --check
npx supabase functions deploy learning-session --remote=wtymosvsymzoosxscnxi --no-verify-jwt --yes
#   --no-verify-jwt es obligatorio: no hay supabase/config.toml que lo fije (así se desplegaron v1 y v2).
#   En CLI v3 --project-ref sigue funcionando pero está deprecado; --remote es la forma vigente.
#   Alternativa: MCP deploy_edge_function con verify_jwt=false y los 4 archivos de la carpeta.

# 7. Verificación del despliegue
npx supabase functions list --remote=wtymosvsymzoosxscnxi     # learning-session versión 3, verify_jwt false
#   DETENER si verify_jwt quedó en true: no es lo validado (la función valida el token ella misma);
#   volver a desplegar con --no-verify-jwt.
curl -s -o /dev/null -w "%{http_code}\n" -X POST "https://wtymosvsymzoosxscnxi.supabase.co/functions/v1/learning-session"   # 401
#   Logs de la función: sin errores de arranque. DETENER y redeploy de la v2 guardada si no responde 401.

# 8. Variables EAS (E.1). 9. Build de tiendas
npx eas-cli@latest build --platform android --profile production
npx eas-cli@latest build --platform ios --profile production
#   (submit sólo con autorización aparte: npx eas-cli@latest submit --platform <android|ios> --profile production)
```

10. **Pruebas autenticadas con la cuenta de prueba** (escriben en esa cuenta): `npx tsx --env-file=.env
scripts/e2e-learning-session.ts --confirm` (lección) y desde la build: un repaso básico y uno Plus.
11. **Validación en dispositivo**: §E.4 completo con la build de tiendas (pista interna / TestFlight).
12. **Logs y medición**: logs de `learning-session` (sin 5xx); `select public.learning_route_usage(now() -
interval '1 day')` muestra `lesson_graded` y `record_learning_session` de la cuenta de prueba;
    `select public.learning_jobs_status()`; interruptores otra vez en false.

**Acciones que requieren autorización expresa**: pasos 3, 6, 8, 9, 10 y el submit a tiendas. **No forman
parte del release**: `supabase/pending/learning_jobs_cron.sql` (pg_cron), encender SRS v2 (F10), Display,
Adaptive, subir `LEARNING_MIN_CONTRACT`, revocar `submit_learning_session` (criterios de
LEARNING_PHASE5.md §5 sin decidir: 14 días / 98 % siguen siendo propuesta).

### E.4 Checklist manual en dispositivo (no ejecutado: sin dispositivo)

Con la build nueva (o una de desarrollo contra producción después de los pasos 1–7), cuenta de prueba sin
Plus y otra con Plus. «OK» = el resultado esperado exacto.

| #   | Paso                                                                 | Resultado esperado                                                                          |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | Iniciar sesión                                                       | Llega a Aprender; sin pantalla de configuración (variables bien)                            |
| 2   | Cambiar idioma (en → it → zh)                                        | Camino, palabra del día y repaso del idioma elegido; nada mezclado                          |
| 3   | Lección completa                                                     | Feedback inmediato; resultado; energía −1 (sin Plus); estrella/progreso; racha del día      |
| 4   | Responder mal a propósito una de elección                            | Marcada incorrecta aunque se toque rápido; el resultado lo refleja                          |
| 5   | Repaso básico (Repaso → Repasar)                                     | Hasta 10 ejercicios; feedback del servidor; resultado; energía igual                        |
| 6   | Ejercicio de varios conceptos (fill_blank / ordenar palabras)        | Se muestran las palabras del ítem; corrección correcta                                      |
| 7   | Ejercicio de producción (escribir la traducción)                     | Tilde faltante en palabra corta = incorrecta; error de tipeo en palabra ≥ 8 letras = «casi» |
| 8   | Repaso en chino                                                      | Caracteres, pinyin y audio; respuesta en pinyin con números aceptada                        |
| 9   | Repaso Plus inteligente y por tema (cuenta Plus)                     | Se arman; sin gasto de energía                                                              |
| 10  | Repaso Plus con cuenta sin Plus                                      | Pantalla de Plus, no error genérico                                                         |
| 11  | Idioma sin contenido (si se puede elegir es/fr)                      | «Repasos en preparación», no «Estás al día»                                                 |
| 12  | Modo avión a mitad de un repaso                                      | Estado recuperable con «Reintentar»; nada se pierde                                         |
| 13  | Volver a la red y reintentar / cerrar y reabrir la app               | Retoma la misma sesión con lo ya respondido                                                 |
| 14  | Cambiar la fecha del teléfono al día siguiente con un repaso abierto | La sesión vencida no acepta respuestas; si estaba completa se envía                         |
| 15  | Perfil propio y público de otro usuario                              | Sin «Dominadas» (Display apagado); estrellas, logros, racha                                 |
| 16  | Atrás desde lección/repaso a mitad                                   | Confirma o vuelve sin duplicar sesiones                                                     |
| 17  | Doble toque en «Enviar»/«Continuar»                                  | Una sola sesión (Perfil/actividad no se duplica)                                            |
| 18  | Pantallas vacías y de carga                                          | Sin parpadeos de «al día» antes de cargar; spinners con texto                               |
| 19  | Ranked (sin servidor)                                                | Modo Supabase/bots como hoy; nada cambió                                                    |

Después: `learning_route_usage` debe mostrar las sesiones de la cuenta de prueba en `lesson_graded` y
`record_learning_session`, ninguna en `legacy_*`.

---

## F. Criterio de salida

| Elemento                             | Estado                                                                                                                      |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| TypeScript (app, scripts, servidor)  | **APROBADO** (tras D-2)                                                                                                     |
| Lint                                 | **APROBADO**                                                                                                                |
| Jest                                 | **APROBADO** (58/58, 6 046/6 046 sin carga; timeouts con carga documentados, D-6)                                           |
| `test:db` (PGlite)                   | **APROBADO CON LIMITACIONES** (300/300 en la corrida final; 2 pruebas intermitentes por carga o cambio de fecha, D-3 y D-5) |
| Concurrencia PostgreSQL 17           | **APROBADO** (R1–R3, K1–K11, J1–J5)                                                                                         |
| Edge Function en Deno                | **APROBADO CON LIMITACIONES** (27/27 en Deno real; GoTrue/PostgREST emulados, no el contenedor edge-runtime)                |
| Migraciones fases 4 y 5              | **APROBADO** (25/25 sobre el esquema real de producción)                                                                    |
| Integridad y aislamiento de datos    | **APROBADO** (Deno F + M5)                                                                                                  |
| Compatibilidad con builds publicadas | **APROBADO** (ruta vieja, `duplicate`, `learning_route_usage`, contrato mínimo)                                             |
| Interruptores apagados               | **APROBADO** (producción y todas las bases de prueba al terminar)                                                           |
| Variables y build EAS                | **PENDIENTE** (variables por crear; nada ejecutado)                                                                         |
| App en dispositivo                   | **PENDIENTE** (sin dispositivo; checklist E.4)                                                                              |
| Prueba autenticada en producción     | **PENDIENTE** (después del despliegue)                                                                                      |
| Despliegue a producción              | **BLOQUEADO** hasta autorización expresa                                                                                    |
| Encender SRS v2                      | **BLOQUEADO** (F10)                                                                                                         |

## Archivos de esta etapa

Nuevos: `supabase/tests/deno/learning-session.e2e.mjs`, `supabase/tests/pg17/pending-migrations.mjs`,
`supabase/tests/pg17/jobs-concurrency.mjs`, `supabase/tests/pg17/schema-fingerprint.sql`, este documento.
Modificados: `supabase/tests/energy.test.mjs` (D-1), `shared/adaptivePlanner.ts` (D-2).

Reproducir:

```sh
npm run typecheck && npx expo lint && npx jest --ci && npm run test:db && npm run test:server
node --import tsx supabase/tests/pg17/srs2-concurrency.mjs
node --import tsx supabase/tests/pg17/record-concurrency.mjs
node --import tsx supabase/tests/pg17/jobs-concurrency.mjs
node --import tsx supabase/tests/pg17/pending-migrations.mjs <huella-de-produccion.json>
# Deno: npm i deno@2.2.15 en un directorio temporal
DENO_BIN=<…>/deno.exe node --import tsx supabase/tests/deno/learning-session.e2e.mjs
```
