# Plan de reconciliación de base de datos y contenidos (Fase 4)

- **Fecha:** 2026-11-21.
- **Proyecto de producción:** `wtymosvsymzoosxscnxi` (PolyGo, plan Pro).
- **Fase de planificación.** En producción solo se hicieron lecturas: `list_migrations`,
  `list_edge_functions` y `SELECT` sobre catálogo y conteos. No se ejecutaron `INSERT`, `UPDATE`,
  `DELETE`, DDL, migraciones, `db push` ni restauraciones. No se borraron cuentas.
- **Archivos:** en el cliente solo se creó este documento; PolyGo no se tocó. Las regeneraciones de SQL
  se escribieron en el directorio temporal de la sesión.

**Resultado: `DATABASE RECONCILIATION PLAN — READY FOR REVIEW`**

> **Condición sobre el francés.** La Fase 3 dio **BLOCKED**, con 11 bloqueantes sin corregir
> ([FR_A1_A2_PHASE3_REPORT.md](FR_A1_A2_PHASE3_REPORT.md)). Las migraciones de 30 unidades de este plan
> (carga `24abe901…`, publicación `6612fae8…`) corresponden al contenido **actual**. Si se autoriza
> corregir B1–B11, las dos cambian de hash y hay que regenerarlas antes del paso F de §8. Hasta
> entonces, este plan no las da por definitivas.
>
> **Revisión 2026-11-21:** el francés queda **fuera de producción** hasta corregir B1–B11, regenerar sus
> dos migraciones y que una nueva validación independiente dé PASS (Etapa II de §8.1). Las secciones
> §12 y §13 recogen el efecto en Ranked, el backup y el PRECHECK.

## 1. Estado actual de los repositorios

| Repositorio                       | Rama                              | Migraciones en `supabase/migrations/` | `supabase/pending/`                                                    | Estado                                           |
| --------------------------------- | --------------------------------- | ------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------ |
| `Polygo-client` (trabajo)         | `client/stage0` (local, sin push) | **164**                               | no existe                                                              | 303 entradas en `git status`, sin commits nuevos |
| `PolyGo` (original, solo lectura) | `feature/ranked-server-authority` | **186**                               | 8 publicaciones + `learning_jobs_cron.sql` y `ranked_legacy_close.sql` | sin cambios en esta fase                         |

- **Diferencia entre repositorios.** El cliente es un subconjunto exacto del original: los 164 archivos
  son idénticos byte a byte. Al cliente le faltan **22**:
  - **10 de contenido:** `planned_lessons_en_a1_u13_u14`, `a1_en_closure`, `a2_en_completion`, `b1_en`,
    `b2_en`, `pt_a1_a2`, `it_a1_a2`, `zh_a1_a2`, `fr_a1_a2` y `es_a1_a2`.
  - **2 de producto:** `20261206120000_avatar_animals` y `20261208120000_leaderboard_best_language`.
  - **10 de Ranked Glicko y Stage 3:** `20261210…` a `20261212200000`.
- **Rollbacks:** el original tiene 12 archivos `.down.sql`, de `ranked_legacy_guard` y de Ranked
  Glicko/Stage 3. **No hay rollbacks para las cargas de contenido.**

## 2. Estado real de las migraciones en producción (verificado 2026-11-21)

`supabase_migrations.schema_migrations` tiene **110 filas**. La última es
`20261213100000_perf_user_fk_indexes`. Entre ellas están:

- `20261118120000_learning_machine_hardening`. El clasificador A1.4.9.3 (`42634ac2…`), un `SELECT`
  puro, devuelve **`S1 APLICADO Y REGISTRADO`**: `srs_apply_me_hint = 8581ce6e…`,
  `mastery_process_queue_safe = a397e523…`, fila 1118 presente, sin sobrecargas ni homónimos.
- `20261209120000_ranked_legacy_guard`.

**Contenido en producción:**

| Idioma | Unidades (publicadas)  | Lecciones (publicadas)     | Ítems                   | `languages.content_status`       |
| ------ | ---------------------- | -------------------------- | ----------------------- | -------------------------------- |
| en     | A1 14 (12), A2 12 (12) | A1 134 (120), A2 120 (120) | 1681 activos + 91 draft | `available`, Ranked              |
| it     | A1 12 (12)             | 120 (120)                  | 844 activos             | `available`, Ranked              |
| pt     | A1 12 (12)             | 120 (120)                  | 842 activos             | `available`, Ranked              |
| zh     | A1 12 (12)             | 120 (120)                  | 831 activos             | `available`, Ranked              |
| fr     | 0                      | 0                          | 0                       | **`hidden`** (la fila ya existe) |
| es     | 0                      | 0                          | 0                       | `soon`                           |

En inglés, A1 U13 y U14 tienen solo la lección «En contexto» (`a1-u13-context`, `a1-u14-context`),
sin publicar.

**Infraestructura (línea base para comparar después):**

- **Esquema `public`:** 107 tablas, 262 funciones, 36 políticas RLS, 69 triggers y 256 índices.
- **Otros esquemas:** `auth`, `extensions`, `graphql`, `graphql_public`, `public`, `ranked_legacy`,
  `realtime`, `storage`, `supabase_migrations`, `vault`.
- **Storage:** 1 bucket, 0 objetos.
- **Edge Functions:**
  - `learning-session` v4 (verify_jwt false, ezbr `234f5a6e…`);
  - `delete-account` v2;
  - `notify-battle-invite` v1.

## 3. Diferencias entre el cliente, el original y producción

| Grupo                                       | Cantidad             | Qué es                                                                                                                                                                                                                       | Estado real en producción                                                                                                                                                                                                                                                     |
| ------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Archivos del cliente sin fila en producción | **61**               | Contenido A1 v1/v2, A2 inglés, `multilanguage_content`, italiano, portugués y chino A1 U1–U12, `rush_*`, logros, amigos, `ranked_server_authority`… (todos anteriores al motor)                                              | **Aplicados sin registro o con otra versión.** Las 28 funciones y la tabla `content_testers` que crean existen. El contenido (en A1/A2, it/pt/zh A1) está publicado. Que los cuerpos coincidan con los archivos: **NO VERIFICADO** (solo se comprobó que los objetos existen) |
| Versiones solo en producción                | **7**                | `ranked_v2` (031150231), `achievements_catalog_v2`, `friend_daily_missions` (04130546), `ranked_server_authority` (06182124), `stale_sweep_server_only`, `avatar_animals` (15153056), `leaderboard_best_language` (15220003) | Son las mismas migraciones registradas con otra hora. Sus archivos locales tienen otra versión (p. ej. `20261206120000_avatar_animals`, `20261208120000_leaderboard_best_language`, que están solo en el original). `leaderboard_ranked` existe                               |
| Cargas de contenido pendientes              | **10** (9 + francés) | §4                                                                                                                                                                                                                           | **Ninguna aplicada, ni siquiera en parte:** no hay unidades `a2-u13…17`, `b1-*`, `b2-*`, `pt/it/zh-a1-u13…16`, `*-a2-*`, `fr-*` ni `es-*`, ni palabras de francés o español                                                                                                   |
| Publicaciones pendientes                    | **8**                | `pending/`: en A2 U13–17, B1, B2, pt, it, zh, fr, es                                                                                                                                                                         | No aplicadas: nada de lo anterior existe                                                                                                                                                                                                                                      |
| Ranked Glicko y Stage 3                     | **10**               | `20261210…` a `20261212200000`                                                                                                                                                                                               | **No aplicadas.** Faltan sus 19 tablas, 37 funciones y 1 vista, como se esperaba. **Fuera de este plan**                                                                                                                                                                      |

**Regeneración desde el cliente.** Las 16 migraciones pendientes de inglés, portugués, italiano, chino y
español (9 cargas y 7 publicaciones) se regeneran **idénticas byte a byte** a las del original. Las del
francés se regeneran con las 30 unidades (§6). El contenido del cliente es la fuente de verdad.

**Consecuencia: el historial no se puede reconciliar con `db push`.** Las versiones pendientes son
anteriores a la última aplicada (`20261213100000`) y hay 61 + 7 versiones desfasadas. `db push` sigue
**prohibido**. Este plan **no propone reescribir el historial**. Lo que propone es aplicar cada
pendiente por separado y registrar su versión local, con el método ya usado en 209, 213 y 1118.

## 4. Dependencias entre idiomas

Todas las cargas usan la plantilla _add-only_ de la fase C.3 y requieren `20261113120000_context_comprehension`,
que **está aplicada**. Cada carga es **un único bloque `DO`**: si algo no coincide, aborta y no deja
nada a medias.

| Orden | Migración                                      | Requiere (además de `context_comprehension`)                | Agrega (sin publicar)                                | SHA-256 (16)       | Tamaño  |
| ----- | ---------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------- | ------------------ | ------- |
| 1     | `20261113120300_planned_lessons_en_a1_u13_u14` | `20261113120200_comprehension_en_a1_u13_u14` (**aplicada**) | 2 u. · 20 lecc. · 34 pal. · 200 ej.                  | `5d240802266e72c6` | 452 KB  |
| 2     | `20261119120000_a1_en_closure`                 | **el paso 1** (U14 L1 recibe 2 ejercicios)                  | 3 lecc. nuevas en 13 unidades cargadas               | `2d37a8dec8da25fc` | 304 KB  |
| 3     | `20261120120000_a2_en_completion`              | inglés A2 U1–U12 (**publicado**)                            | 5 u. · 50 lecc. · 84 pal. · 469 ej.                  | `86dc9a9fa4d9b1ff` | 1040 KB |
| 4     | `20261122120000_b1_en`                         | palabras publicadas de inglés                               | 12 u. · 120 lecc. · 209 pal. · 1128 ej.              | `b566e927bf796d08` | 2528 KB |
| 5     | `20261124120000_b2_en`                         | palabras publicadas de inglés                               | 12 u. · 120 lecc. · 215 pal. · 1176 ej.              | `f06ef4b44820e1f4` | 2904 KB |
| 6     | `20261126120000_pt_a1_a2`                      | piloto pt A1 U1–U12 (**publicado**)                         | 16 u. · 160 lecc. · 264 pal. · 1577 ej.              | `aa16bcb79e87e227` | 3468 KB |
| 7     | `20261128120000_it_a1_a2`                      | piloto it A1 U1–U12 (**publicado**)                         | 16 u. · 160 lecc. · 271 pal. · 1540 ej.              | `3bcb320f5cd966c4` | 3452 KB |
| 8     | `20261130120000_zh_a1_a2`                      | piloto zh A1 U1–U12 (**publicado**)                         | 16 u. · 160 lecc. · 248 pal. · 1546 ej.              | `f416450cb77c945a` | 3436 KB |
| 9     | `20261202120000_fr_a1_a2` (**30 unidades**)    | nada más: solo palabras propias                             | 30 u. · 300 lecc. · 548 pal. · 2998 ej. · 2431 ítems | `24abe90130ff5c8f` | 6615 KB |
| (10)  | `20261204120000_es_a1_a2`                      | nada más                                                    | 29 u. · 290 lecc. · 532 pal. · 2891 ej.              | `cec4ddef40d8659f` | 6448 KB |

**Cómo se relacionan:**

- La única cadena real es la del inglés: 1 → 2.
- Portugués, italiano, chino y francés son **independientes** entre sí y del inglés.
- El orden por fecha respeta todo y es el mismo que ya se probó: la prueba PGlite del francés arma la
  base con 1–8 en este orden y después aplica el francés; pasó 8/8 en las Fases 2 y 3.
- El español (10) queda **fuera del MVP pedido**: su estado es `soon` y no figura en la consigna. Se
  puede sumar después sin afectar a los demás.

**Publicaciones** (de `pending/`, solo `UPDATE` de estado, idempotentes; cada una exige que existan
exactamente las filas de su carga):

| Publicación                                         | SHA-256 (16)                                                       | Después de |
| --------------------------------------------------- | ------------------------------------------------------------------ | ---------- |
| `20261121120000_publish_en_a2_u13_u17`              | `1cee529df2322d78`                                                 | 3          |
| `20261123120000_publish_en_b1`                      | `638b1ec1d11c85c2`                                                 | 4          |
| `20261125120000_publish_en_b2`                      | `e85571fb76f42b4d`                                                 | 5          |
| `20261127120000_publish_pt_a1_a2`                   | `5b98cfab65a393a7`                                                 | 6          |
| `20261129120000_publish_it_a1_a2`                   | `1b213af05d750c31`                                                 | 7          |
| `20261201120000_publish_zh_a1_a2`                   | `6a0f1424475a7b1c`                                                 | 8          |
| `20261203120000_publish_fr_a1_a2` (**30 unidades**) | `6612fae8266373830ec532c5fb48058a95145980a7da09ebf82332ca78aa70ce` | 9          |
| `20261205120000_publish_es_a1_a2`                   | `1e32202c6f72f6dd`                                                 | (10)       |

**Inglés A1 U13–U14 y el cierre de A1 no tienen publicación escrita.** `A1_EN_CLOSURE.md` habla de
«una migración de publicación aparte», que no existe. Además dependen de la ruta `en.a1.route.v2`, que
en producción está **desactivada** (`enabled = false`, `min_curriculum_api = 1`). La v4 de
`learning-session` no reenvía la cabecera C.7, así que la app ve todo con nivel de API 0. Mientras eso
siga así, cargar los pasos 1 y 2 **no cambia nada visible**: quedan sin publicar.

## 5. Datos de prueba identificados

Producción tiene **1 usuario** en `auth.users` y **1 perfil**: la cuenta del propietario. Todas las
filas con referencia a usuario son de esa cuenta, salvo las de bots.

| Grupo                      | Tablas (filas)                                                                                                                                                                                                                                                                                                               | Relación con la cuenta                                                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Progreso                   | `user_lesson_progress` (7), `user_word_progress` (27), `user_daily_activity` (6), `user_curriculum_routes` (1)                                                                                                                                                                                                               | FK `CASCADE` (a `profiles`; `user_curriculum_routes` a `auth.users`)                                                                                              |
| Learning Machine (usuario) | `exercise_attempts` (89), `exercise_attempt_gradings` (42), `exercise_attempt_presentations` (42), `exercise_presentations` (48), `learning_sessions` (10), `learning_session_clients` (4), `review_presentation_answers` (10), `review_presentation_retries` (1), `srs_session_plans` (1), `knowledge_recompute_queue` (26) | `CASCADE`. `exercise_attempt_presentations` cuelga de los intentos. Resto de `srs_*` y `user_srs_state*`: 0 filas                                                 |
| Energía, XP, economía      | `user_energy` (0), `poly_wallets` (1), `poly_transactions` (37), `user_streak_freezes` (0), `user_frozen_days` (0), `user_mission_rewards` (0)                                                                                                                                                                               | `CASCADE`                                                                                                                                                         |
| Ranked                     | `player_ratings` (3: uno por idioma, todos de la cuenta), `rating_history` (14), `ranked_queue` (1)                                                                                                                                                                                                                          | `CASCADE`                                                                                                                                                         |
| Partidas                   | `battle_players` (32: 11 de la cuenta, 21 con `user_id` nulo = bots), `battles` (16), `friend_challenges` (2)                                                                                                                                                                                                                | `battle_players.user_id` es `SET NULL`. **`battles` no tiene FK a usuarios**: no se borra con la cuenta. `friend_challenges` es `CASCADE` (`guest_id` `SET NULL`) |
| Logros y cosmética         | `user_achievements` (15), `user_cosmetics` (1)                                                                                                                                                                                                                                                                               | `CASCADE`                                                                                                                                                         |
| Social y ajustes           | `user_settings` (1), `user_presence` (1), `push_tokens` (1), `friendships` (0), `user_blocks` (0), `avatar_reports` (0)                                                                                                                                                                                                      | `CASCADE`                                                                                                                                                         |
| **Cuidado**                | `content_testers` (1: la cuenta), `user_entitlements` (1: Plus u otro derecho)                                                                                                                                                                                                                                               | `CASCADE`. **Si se borra la cuenta, la beta y el derecho se pierden** y hay que volver a darlos a la cuenta nueva                                                 |
| Auth                       | `identities`, `sessions`, `mfa_*`, `one_time_tokens`…                                                                                                                                                                                                                                                                        | `CASCADE` desde `auth.users`                                                                                                                                      |

**No contienen datos de usuario** y no hay que tocarlas:

- `ranked_legacy_switch` (1) y `ranked_legacy_switch_log` (0): el interruptor ABIERTO de 209;
- `seasons` (1), `app_client_policy` (1) y `curriculum_route_enrollment` (1);
- `curriculum_routes` (2), `curriculum_route_units` (26) y `curriculum_route_client_requirements` (2);
- `mastery_model_versions`, `srs_algorithm_versions`, `srs_v2_settings`, `srs_weights` y las `ref_*`;
- `learning_job_runs` (0), `achievements` (76), `cosmetic_items` (19) y `practice_sources` (10);
- todo el contenido.

## 6. Infraestructura que se preserva

Ninguna alternativa de este plan toca nada de esto:

- **Esquema:** las 107 tablas y su estructura, las 262 funciones y RPC, las 36 políticas RLS, los 69
  triggers y los 256 índices, incluidos los 6 de `perf_user_fk_indexes`.
- **Historial de migraciones:** las 110 filas, sin borrar ni modificar ninguna. En particular la fila
  `20261118120000` y las funciones del hardening en S1.
- **Edge Functions:** `learning-session` v4 (rollback en `ops/learning-session/v3/`), `delete-account` y
  `notify-battle-invite`, con sus secretos y `verify_jwt`.
- **Configuración del proyecto:** autenticación, storage (1 bucket), secretos y variables.
- **Configuración del juego:** el interruptor de Ranked legacy (ABIERTO), las rutas curriculares, la
  política de cliente y las temporadas.
- **AdMob y compras:** **no hay configuración en la base**. Viven en la app, las tiendas y RevenueCat
  (si se usa). Lo único en la base es la fila de `user_entitlements` de la cuenta. **NO VERIFICADO**
  fuera de la base.

## 7. Alternativas

### A. Integración incremental (**recomendada**)

Consiste en aplicar, una por una y en el orden del §8, las cargas y publicaciones pendientes, que ya
existen y se regeneran igual desde el cliente. Cada versión local se registra en `schema_migrations`.

- **No hace falta borrar datos de usuario.** Las cargas solo agregan filas, no tocan filas publicadas ni
  el progreso, y abortan si algo no coincide.
- **Se reutiliza lo probado:** las plantillas y las pruebas PGlite (carga exacta, add-only, reaplicable,
  invisible sin publicar, publicación idempotente con todas las lecciones jugadas). También el método de
  aplicación que ya funcionó en producción con 209, 213 y 1118.
- **Desventaja:** el historial sigue desfasado en las 61 + 7 versiones antiguas. No afecta al
  funcionamiento, pero obliga a seguir aplicando por separado (sin `db push`).

### B. Reinicialización controlada de datos

Consiste en borrar los datos de prueba (la cuenta y lo que cuelga de ella) y recargar contenido.

- **No resuelve nada del problema real.** El desfase está en el historial y en las cargas no aplicadas,
  no en los datos de usuario. Borrar la cuenta deja intactos los 61 + 7 desfases, y las cargas
  pendientes se siguen aplicando igual que en A.
- **Reconstruir el contenido es innecesario y riesgoso.** El contenido publicado ya coincide con lo que
  esperan las cargas nuevas, y los ids son estables. Borrarlo y recargarlo pasaría por las 61
  migraciones antiguas, cuyos cuerpos no están verificados, y rompería ítems, versiones y conjuntos de
  opciones ya registrados.
- **Lo que sí aporta:** empezar el MVP con la cuenta limpia. Eso se logra con **un solo paso al final**:
  borrar la cuenta desde `delete-account` o desde el panel de Auth, que se propaga por `CASCADE` a todo
  lo del §5. Después solo queda limpiar `battles` (no tiene FK) y las filas de bots sin usuario, si se
  quiere.

**Recomendación: A ahora y, si se quiere, el borrado de la cuenta al final del MVP.** Son pasos
independientes, y el borrado no es requisito de la integración.

## 8. Orden de ejecución propuesto (nada se ejecuta sin autorización)

**Método por paso** (el mismo de 209, 213 y 1118):

1. Leer el archivo entero.
2. Comprobar el SHA-256 contra este documento.
3. Envolverlo en `BEGIN; SET LOCAL lock_timeout = '5s'; … ; INSERT INTO supabase_migrations.schema_migrations (version, name, …) VALUES ('<versión local>', '<nombre>', …); COMMIT;`.
4. Enviarlo con `npx supabase@2 db query --linked --project-ref wtymosvsymzoosxscnxi -f <archivo>`.

No se usa `apply_migration`, porque registra la hora actual como versión. Tampoco `execute_sql` del
conector: rechaza consultas de más de unos 2 MB, y las cargas de 4 a 9 pesan entre 2,5 y 6,6 MB.

> **Revisión 2026-11-21 (Fase 4b).** La tabla de abajo es la versión inicial y queda como historial.
> El orden vigente, con el francés separado y los recuentos corregidos, es el de **§8.1**.

| Paso   | Qué                                                                                                                                                                                                            | Tipo                       | Comprobación inmediata (solo lectura)                                                                                                                                         |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0**  | **Backup** dentro de las 24 h previas (físico diario de Pro, con comprobante del panel o de `supabase backups list`) **más** `pg_dump` lógico de `public` y `supabase_migrations`, guardado fuera del proyecto | sin escritura              | Fecha del backup y tamaño del dump                                                                                                                                            |
| **0b** | **PRECHECK**                                                                                                                                                                                                   | lectura                    | historial = 110 filas con las mismas versiones; clasificador = S1; línea base del §2 sin cambios; ninguna unidad de las cargas pendientes presente; ninguna transacción larga |
| 1      | `planned_lessons_en_a1_u13_u14`                                                                                                                                                                                | carga                      | +2 u. ya existentes; +20 lecc. y +34 pal. sin publicar; nada publicado cambia                                                                                                 |
| 2      | `a1_en_closure`                                                                                                                                                                                                | carga                      | +3 lecc. sin publicar                                                                                                                                                         |
| 3      | `a2_en_completion`                                                                                                                                                                                             | carga                      | +5 u. `a2-u13…17` sin publicar                                                                                                                                                |
| 4      | `b1_en`                                                                                                                                                                                                        | carga                      | +12 u. `b1-*` sin publicar                                                                                                                                                    |
| 5      | `b2_en`                                                                                                                                                                                                        | carga                      | +12 u. `b2-*` sin publicar                                                                                                                                                    |
| 6      | `pt_a1_a2`                                                                                                                                                                                                     | carga                      | +16 u. sin publicar                                                                                                                                                           |
| 7      | `it_a1_a2`                                                                                                                                                                                                     | carga                      | +16 u. sin publicar                                                                                                                                                           |
| 8      | `zh_a1_a2`                                                                                                                                                                                                     | carga                      | +16 u. sin publicar                                                                                                                                                           |
| 9 (F)  | `fr_a1_a2`, 30 u., **regenerada tras corregir B1–B11**                                                                                                                                                         | carga                      | +30 u., 300 lecc., 548 pal., 2998 ej., 2431 ítems draft                                                                                                                       |
| —      | **Punto de control:** POSTCHECK de cargas (§10), clasificador S1 y conteos de infraestructura iguales a la línea base                                                                                          | lectura                    |                                                                                                                                                                               |
| 10     | **Build de la app** que reconozca `context_choice`, la escritura nueva y los idiomas `beta` / `hidden`, y que tenga `fr` en `beta` en `shared/languages.ts`. Instalada en el dispositivo de prueba             | app                        | La versión de la tienda **no** debe ver contenido nuevo antes de esto                                                                                                         |
| 11     | Publicar en A2 U13–17, B1 y B2                                                                                                                                                                                 | publicación                | unidades `is_published`; ítems `active` salvo `context_choice`                                                                                                                |
| 12     | Publicar pt, it y zh A1–A2                                                                                                                                                                                     | publicación                | ídem                                                                                                                                                                          |
| 13     | Publicar fr (30 u.)                                                                                                                                                                                            | publicación                | 30 u.; 2237 ítems activos y 194 draft (o los nuevos números tras B1–B11)                                                                                                      |
| 14     | **Beta del francés:** `UPDATE public.languages SET content_status = 'beta' WHERE code = 'fr'` (1 fila). La cuenta ya está en `content_testers`                                                                 | escritura de configuración | `set_target_language('fr')` funciona para la cuenta; otra cuenta recibe `language_unavailable` y ve «Próximamente»                                                            |
| —      | **POSTCHECK final** (§10)                                                                                                                                                                                      | lectura                    |                                                                                                                                                                               |
| (15)   | Opcional, al final del MVP: borrar la cuenta de prueba (y `battles` / bots) y crear la nueva; volver a dar `content_testers` y `user_entitlements`                                                             | borrado                    | §5                                                                                                                                                                            |

**Fuera del orden, con decisión aparte:**

- inglés A1 U13–U14 y el cierre (falta escribir su publicación y decidir la ruta v2 y la cabecera C.7);
- el español (10);
- Ranked Glicko y Stage 3;
- el cierre de Ranked legacy.

~~Cantidad de pasos: «15 ejecuciones».~~ **Conteo corregido en §8.1.** El anterior mezclaba
comprobaciones, archivos y tandas: contaba 3 publicaciones donde son 7 archivos, y dejaba fuera el
POSTCHECK final.

### 8.1 Orden vigente (revisión 2026-11-21)

**El francés queda fuera de producción** hasta que se cumplan estas tres condiciones:

1. corregir B1–B11;
2. regenerar sus dos migraciones;
3. que una nueva validación independiente dé PASS.

Hasta entonces, solo se comprueba que **no** esté cargado (P18 del PRECHECK).

**Etapa I: inglés, portugués, italiano y chino**

| #     | Acción                                                                                                                   | Tipo            | Archivo / SHA-256 (16)  |
| ----- | ------------------------------------------------------------------------------------------------------------------------ | --------------- | ----------------------- |
| I-R1  | Verificar el backup: **físico posterior al hardening** (≥ 2026-11-21 02:21 UTC), dentro de las 24 h previas              | lectura         | `supabase backups list` |
| I-R2  | PRECHECK (`ops/db-reconciliation/precheck.sql`, 22 comprobaciones)                                                       | lectura         | `2c892993…08a3e`        |
| I-W1  | Carga: lecciones planificadas de inglés A1 U13–U14                                                                       | escritura       | `5d240802266e72c6`      |
| I-W2  | Carga: cierre de inglés A1 (requiere I-W1)                                                                               | escritura       | `2d37a8dec8da25fc`      |
| I-W3  | Carga: inglés A2 U13–U17                                                                                                 | escritura       | `86dc9a9fa4d9b1ff`      |
| I-W4  | Carga: inglés B1 (requiere I-W3). **Amplía el `CHECK` de `curriculum_units.level` a B1**                                 | escritura + DDL | `b566e927bf796d08`      |
| I-W5  | Carga: inglés B2 (requiere I-W3 e I-W4). **Amplía el `CHECK` a B2**                                                      | escritura + DDL | `f06ef4b44820e1f4`      |
| I-W6  | Carga: portugués A1 U13–U16 y A2                                                                                         | escritura       | `aa16bcb79e87e227`      |
| I-W7  | Carga: italiano A1 U13–U16 y A2                                                                                          | escritura       | `3bcb320f5cd966c4`      |
| I-W8  | Carga: chino A1 U13–U16 y A2                                                                                             | escritura       | `f416450cb77c945a`      |
| I-R3  | Punto de control: PRECHECK adaptado al estado nuevo, clasificador S1, infraestructura igual y nada publicado de lo nuevo | lectura         | —                       |
| I-A1  | **Build de la app** que reconozca `context_choice` (A2 U13–U17, B1 y B2 de inglés lo usan)                               | app (EAS)       | —                       |
| I-W9  | Publicar inglés A2 U13–U17                                                                                               | escritura       | `1cee529df2322d78`      |
| I-W10 | Publicar inglés B1                                                                                                       | escritura       | `638b1ec1d11c85c2`      |
| I-W11 | Publicar inglés B2                                                                                                       | escritura       | `e85571fb76f42b4d`      |
| I-W12 | Publicar portugués A1–A2 (**cambia Ranked: §12**)                                                                        | escritura       | `5b98cfab65a393a7`      |
| I-W13 | Publicar italiano A1–A2 (**cambia Ranked: §12**)                                                                         | escritura       | `1b213af05d750c31`      |
| I-W14 | Publicar chino A1–A2 (**cambia Ranked: §12**)                                                                            | escritura       | `6a0f1424475a7b1c`      |
| I-R4  | POSTCHECK final                                                                                                          | lectura         | —                       |

> **Reemplazada (2026-11-21):** las tres condiciones se cumplieron (B1–B11 corregidos, migraciones
> regeneradas, validación independiente PASS) y el dueño pidió habilitar el francés para todos, sin
> `beta`. El plan vigente es el de [FR_A1_A2_INTEGRATION.md](FR_A1_A2_INTEGRATION.md) §3. La tabla de
> abajo queda como historial.

**Etapa II: francés.** Empieza solo cuando se cumplen las tres condiciones de arriba.

| #     | Acción                                                                                                                   | Tipo                       |
| ----- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| II-L1 | Corregir B1–B11 y regenerar la carga y la publicación (hashes nuevos)                                                    | local                      |
| II-L2 | Nueva validación independiente: tiene que dar **PASS**                                                                   | local                      |
| II-R1 | PRECHECK del francés (backup vigente, nada de francés cargado, hashes nuevos)                                            | lectura                    |
| II-W1 | Carga del francés, 30 unidades                                                                                           | escritura                  |
| II-W2 | Publicación del francés                                                                                                  | escritura                  |
| II-A1 | Build de la app con `fr` en `beta` y sus `levels` en `shared/languages.ts`                                               | app (EAS)                  |
| II-W3 | `UPDATE public.languages SET content_status = 'beta' WHERE code = 'fr'` (1 fila; la cuenta ya está en `content_testers`) | escritura de configuración |
| II-R2 | POSTCHECK del francés: el tester lo elige; otra cuenta ve «Próximamente»                                                 | lectura                    |

**Recuento:**

|                         | Lecturas en producción | Escrituras en producción                               | Builds | Locales | Total  |
| ----------------------- | ---------------------- | ------------------------------------------------------ | ------ | ------- | ------ |
| Etapa I                 | 4 (I-R1 a I-R4)        | **14** (8 cargas + 6 publicaciones)                    | 1      | 0       | **19** |
| Etapa II                | 2                      | **3** (carga, publicación, beta)                       | 1      | 2       | **8**  |
| Opcional, final del MVP | —                      | 1 (borrar la cuenta de prueba y lo que cuelga de ella) | —      | —       | 1      |

- **Escrituras:** cada una es un archivo, en su propia transacción, con su fila de historial. Las 14 de
  la Etapa I se pueden autorizar en **4 tandas**:
  1. I-W1 a I-W5 (inglés);
  2. I-W6 a I-W8 (las otras cargas);
  3. I-W9 a I-W11 (publicaciones del inglés);
  4. I-W12 a I-W14 (publicaciones con efecto en Ranked).

  Cada tanda va precedida y seguida de una comprobación de solo lectura.

- **Fuera de las dos etapas:**
  - publicar inglés A1 U13–U14 y el cierre;
  - el español;
  - Ranked Glicko y Stage 3;
  - cerrar Ranked legacy;
  - normalizar el historial.

## 9. Riesgos y recuperación

| Riesgo                                                                         | Probabilidad                          | Mitigación / recuperación                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Una carga no coincide con producción (p. ej., una palabra del piloto distinta) | baja                                  | El bloque `DO` aborta y no queda nada. Se diagnostica con lecturas y no se reintenta a ciegas                                                                                                                                                  |
| Los cuerpos de las 61 migraciones antiguas difieren de los archivos            | **NO VERIFICADO**                     | No afecta a las cargas, porque solo agregan filas propias y las validan. Se puede comparar el `md5(prosrc)` de producción contra los archivos antes del paso 1 (solo lectura)                                                                  |
| La app de la tienda ve contenido nuevo antes de tiempo                         | media si se publica antes del paso 10 | Publicar **después** de la build. Sin publicar, RLS y `learning_lesson_plan` no muestran nada                                                                                                                                                  |
| Cambia el banco de Ranked de it, pt y zh al publicar el A2                     | segura (es el efecto esperado)        | Sin épocas de contenido (Stage 3 no aplicada), Ranked usa las palabras publicadas. Aceptarlo o publicar it, pt y zh después de decidirlo                                                                                                       |
| Una carga grande corta la conexión o tarda mucho                               | baja                                  | Una transacción por archivo, `lock_timeout` y aplicar fuera de uso. Si se corta antes del `COMMIT`, no queda nada                                                                                                                              |
| Error en una publicación                                                       | baja                                  | Solo hace `UPDATE` de estado y es idempotente. Se revierte con un `UPDATE … is_published = false` / `status = 'draft'` sobre los mismos ids (a preparar)                                                                                       |
| Hay que revertir una carga entera                                              | baja                                  | **No existen rollbacks de contenido.** Opciones: (a) un script por idioma que borre solo sus ids nuevos, en orden inverso de FK (a preparar y probar en PGlite); (b) restaurar el backup del paso 0, **que también deshace todo lo posterior** |
| Daño al hardening (S1)                                                         | muy baja                              | Ningún paso toca esas funciones. El clasificador se corre antes y después; su rollback de A1.4.10 existe pero **no está autorizado**                                                                                                           |
| Pérdida de la beta o de Plus al borrar la cuenta                               | segura si se hace el paso 15          | Volver a insertar `content_testers` y `user_entitlements` para la cuenta nueva                                                                                                                                                                 |

## 10. Pruebas posteriores

- **Locales, antes de producción** (en una copia aislada, como en las Fases 2 y 3):
  - `fr-check`, typecheck y lint;
  - `content:ids -- check`;
  - `jest content` (19 suites);
  - `frContent.test.mjs`;
  - el resto de `supabase/tests/*Content*` por archivo (no en paralelo).
- **POSTCHECK de producción, solo lectura:**
  - **Historial:** 110 filas iniciales + 1 por paso aplicado, con la versión local exacta.
  - **Conteos de contenido** por idioma y nivel, iguales a los de §4.
  - **Ítems por estado:** las cargas en `draft`; tras publicar, `active` salvo `context_choice`.
  - **Learning Machine:** el clasificador da S1.
  - **Infraestructura:** igual a la línea base (107 tablas, 262 funciones, 36 políticas, 69 triggers,
    256 índices). Las cargas no crean objetos.
  - **Datos de usuario:** sin cambios (los conteos del §5).
- **En la app, con la build nueva:**
  - la cuenta de prueba ve el francés y lo elige desde el perfil;
  - `fr-a1-u01-l01` y `fr-a2-u01-l01` abiertas, `fr-a1-u01-l02` cerrada;
  - una lección completa con la voz `fr-FR`;
  - un repaso;
  - pt, it y zh muestran A1 U13–U16 y A2;
  - inglés muestra A2 U13–U17, B1 y B2;
  - una segunda cuenta (sin tester) ve el francés como «Próximamente».

## 11. Acciones que requieren autorización adicional

Numeración de §8.1. Revisión del 2026-11-21: reemplaza la lista anterior.

1. **Etapa I, I-R1 (bloqueante):** contar con un backup físico posterior al hardening. El de hoy está
   previsto para las ~13:2x UTC, o se puede hacer un respaldo lógico manual (§13).
2. **Etapa I, tandas de escritura:** I-W1 a I-W5, I-W6 a I-W8, I-W9 a I-W11 e I-W12 a I-W14. Cada una
   con su autorización. La última incluye **aceptar el cambio de Ranked de §12**.
3. **Etapa I, I-A1:** la build de la app (EAS).
4. **Etapa II, II-L1:** corregir B1–B11 y regenerar las dos migraciones del francés.
5. **Etapa II, II-L2:** la nueva validación independiente (tiene que dar PASS).
6. **Etapa II, II-W1 a II-W3, más II-A1:** carga, publicación, build con `fr` en `beta` y el `UPDATE` de
   `languages.fr`.
7. **Opcional:** borrar la cuenta de prueba, `battles` y los bots; crear la cuenta nueva y volver a dar
   `content_testers` y `user_entitlements`.
8. **Copiar al cliente** las migraciones aplicadas (`supabase/migrations/` y `supabase/pending/`). Sin
   commit ni push mientras siga activa la integración GitHub–Supabase.
9. **Aparte:**
   - escribir la publicación de inglés A1 U13–U14 y el cierre, y decidir la ruta v2 y la cabecera C.7;
   - el español;
   - Ranked Glicko y Stage 3;
   - cerrar Ranked legacy;
   - una eventual normalización del historial (61 + 7).

## 12. Qué cambia en Ranked al publicar A2 de italiano, portugués y chino (verificado 2026-11-21)

### 12.1 Cómo se arma hoy el banco de palabras

Lo comprobé leyendo, en producción, las funciones `rush_player_unit_ids`, `rush_common_unit_ids`,
`rush_questions_in_units`, `rush_levels` y `curriculum_route_for`, y en el repositorio `shared/wordRush.ts`
y `server/src/server.ts`.

1. **Unidades.** `rush_player_unit_ids` devuelve, para cada nivel del idioma, las unidades de la ruta
   curricular del jugador que ya desbloqueó. **Si el idioma o nivel no tiene ruta, devuelve todas las
   unidades.** En producción solo hay rutas para **inglés A1**. Italiano, portugués y chino no tienen
   ninguna, así que **no hay filtro por progreso**.
2. **Palabras:** solo las **publicadas** de esas unidades.
3. **Nivel según el rating:**
   - menos de 400: solo **A1**;
   - desde 400 (plata): **A1 y A2**.

   Es la misma regla en SQL (`rush_levels`) y en el servidor de partidas (`RUSH_LEVELS`). Las palabras
   de B1 y B2 **nunca** entran a Ranked: `wordLevel` solo reconoce `aN-uNN` y el filtro solo admite A1 y
   A2.

4. **Servidor de partidas** (Ranked y bots): carga las palabras publicadas del idioma con una caché de
   10 minutos, así que lo publicado aparece en las partidas en hasta 10 minutos. Aplica el mismo filtro
   por rating.
   - La versión de `server.ts` del original además filtra por las unidades de `rush_common_unit_ids`;
     la del cliente no. Para italiano, portugués y chino el resultado es igual, porque no tienen rutas.
   - **Qué versión está desplegada no está verificado.**

### 12.2 Efecto al publicar I-W12 a I-W14

| Idioma | Banco A1 hoy (textos distintos) | A1 nuevas (U13–U16) | A2 nuevas | Rating < 400 (A1)     | Rating ≥ 400 (A1 + A2) |
| ------ | ------------------------------- | ------------------- | --------- | --------------------- | ---------------------- |
| it     | 224                             | +73                 | +198      | 224 → **297** (+33 %) | 224 → **495** (+121 %) |
| pt     | 215                             | +71                 | +193      | 215 → **286** (+33 %) | 215 → **479** (+123 %) |
| zh     | 182                             | +65                 | +183      | 182 → **247** (+36 %) | 182 → **430** (+136 %) |

- **Para todos los jugadores de italiano, portugués y chino,** incluso uno que recién empieza, las
  palabras de **A1 U13–U16** entran a sus partidas aunque no haya llegado a esas unidades en el curso.
  Es el mismo comportamiento de hoy con A1 U1–U12: el banco nunca dependió del progreso en estos idiomas.
- **Desde rating 400,** las preguntas pasan a incluir **A2**. Hoy en estos idiomas el banco de un jugador
  de 400 o más es solo A1, porque no hay A2 publicado. Las partidas se vuelven más difíciles de golpe
  para ese grupo.
- **Lo que no cambia:**
  - el ELO / rating (fórmulas, rangos, temporadas e historial);
  - la cola, el emparejamiento y la calibración contra bots;
  - el interruptor de Ranked legacy;
  - la escritura en chino, que sigue apagada.

  No hay épocas de contenido (Stage 3 no está aplicada), así que **nada se recalcula**: los ratings ya
  ganados quedan como están, aunque se hayan obtenido con un banco más fácil.

- **Hoy, en la práctica:**
  - la única cuenta tiene rating en italiano 118, portugués 117 e inglés 182, y no tiene rating en chino;
  - todos por debajo de 400: **solo notaría las palabras de A1 U13–U16**, unas 70 más por idioma;
  - no hay otros jugadores afectados.
- **Fuera de Ranked:** los **desafíos entre amigos** (`accept_friend_challenge`) usan
  `rush_questions_in_units` **sin rating**, es decir, todas las palabras publicadas de las unidades en
  común, de cualquier nivel.
  - Al publicar, en italiano, portugués y chino entra A2 desde el primer día.
  - En inglés entran además **A2 U13–U17, B1 y B2**, porque esos niveles tampoco tienen ruta.
  - No afecta al rating, pero sí a la dificultad de esos desafíos.
- **Inglés (I-W9 a I-W11):** el A2 de Ranked suma **+84** palabras para rating ≥ 400. B1 y B2 no entran
  a Ranked.

**Decisión pendiente (va con la tanda 4):** aceptar este efecto tal cual, o postergar I-W12 a I-W14. No
hay un término medio sin cambiar código o datos, por ejemplo publicando solo A1 U13–U16, porque cada
publicación incluye los dos niveles.

## 13. Fase 4b: backup y PRECHECK (2026-11-21, solo lectura)

### 13.1 Backup: **BLOQUEO**

`npx supabase backups list --project-ref wtymosvsymzoosxscnxi`, ejecutado a las 04:43 UTC con la CLI
3.2.0 local, sin instalar nada:

| Backup físico | Estado    | Fecha (UTC)                 |
| ------------- | --------- | --------------------------- |
| 2325817089    | COMPLETED | 2026-11-20 13:24:22         |
| 2315683880    | COMPLETED | 2026-11-19 13:31:21         |
| 2305405421    | COMPLETED | 2026-11-18 13:21:12         |
| …             | COMPLETED | diarios desde el 2026-11-14 |

- **Configuración:** `walg_enabled: true`, **`pitr_enabled: false`**.
- **El backup más reciente (13:24 UTC del 20) es anterior al hardening,** aplicado el 2026-11-21 a las
  02:21 UTC. Restaurarlo hoy **desharía S1** y su fila de historial. Por eso **no sirve como punto de
  recuperación** para la Etapa I.
- **`pg_dump` y `psql` no están instalados** en esta máquina, así que no se pudo preparar un respaldo
  lógico. La conexión directa a la base tampoco está configurada.
- **Para desbloquear, una de estas dos:**
  - **(a) Esperar** el backup diario de hoy, previsto hacia las 13:2x UTC del 2026-11-21, y verificarlo
    con el mismo comando. Las escrituras tendrían que hacerse dentro de las 24 h siguientes.
  - **(b) Respaldo lógico manual:** instalar herramientas (`pg_dump`) y usar la cadena de conexión. Ambas
    cosas requieren autorización.

  Mientras no se cumpla una de las dos, **ninguna escritura debe empezar**.

### 13.2 PRECHECK: **GO 22/22**

- **Archivo:** `ops/db-reconciliation/precheck.sql`, SHA-256 `2c892993b8a575c29bf948c68243f21b7977c5d055ca541c2f63177bcbd08a3e`.
- **Generación:** lo genera `ops/db-reconciliation/build-precheck.mjs` desde las migraciones de PolyGo,
  sin editarlo a mano. La generación es determinista: dos veces, mismo hash.
- **Verificaciones del generador:** antes de generar comprueba el SHA-256 de las 8 cargas.
- **Contenido:** un único `SELECT`, de 932 KB.
- **Ejecución:** con `npx supabase db query --remote=wtymosvsymzoosxscnxi --read-only -f …`, en una
  transacción de solo lectura, el 2026-11-21 a las 04:45:58 UTC.

> **Primera ejecución (04:45:40):** dio NO-GO por P19. Fue un error del generador, no de producción:
> `format()` escribe los booleanos como `t`/`f` y la comprobación esperaba `true`/`false`. Los valores
> reales coincidían. Se corrigió el generador y se volvió a ejecutar.

| ID            | Comprobación                                                                                                        | Resultado                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| P01           | Historial: 110 filas                                                                                                | OK (110)                                                           |
| P02           | Mismas versiones que el 2026-11-21 (md5 de la lista)                                                                | OK (`b62a1718…`)                                                   |
| P03           | Ninguna versión de las 8 cargas registrada                                                                          | OK (0)                                                             |
| P04           | Learning Machine en S1                                                                                              | OK (S1)                                                            |
| P05           | Infraestructura igual a la línea base                                                                               | OK (107 / 262 / 36 / 69 / 256 / 1)                                 |
| P06           | `CHECK` de nivel todavía A1/A2                                                                                      | OK                                                                 |
| P07           | Unidades por idioma/nivel                                                                                           | OK (`en/A1=14/12 en/A2=12/12 it/A1=12/12 pt/A1=12/12 zh/A1=12/12`) |
| P08           | Ítems por idioma/estado                                                                                             | OK (`en 1681+91 draft, it 844, pt 842, zh 831`)                    |
| P09 a P13     | Ninguna unidad, lección, palabra, ejercicio (7741) ni ítem (6109) nuevo de las cargas existe                        | OK (0 en todos)                                                    |
| P14           | Las 396 palabras que enlazan las cargas existen y están **publicadas**                                              | OK (396)                                                           |
| P15           | Los 407 conceptos que enlazan las cargas existen                                                                    | OK (407)                                                           |
| P16           | Las 15 unidades existentes que comparan las cargas (a1-u01…u14), idénticas con las columnas exactas de la plantilla | OK (ninguna distinta)                                              |
| P17           | Las 19 lecciones existentes que compara el cierre de A1, idénticas                                                  | OK (ninguna distinta)                                              |
| P18           | Francés fuera: 0 unidades, 0 palabras, 0 versiones                                                                  | OK                                                                 |
| P19           | Idiomas sin cambios (fr `hidden`)                                                                                   | OK                                                                 |
| P20           | Una sola cuenta                                                                                                     | OK                                                                 |
| P21           | Sin otras sesiones activas (informativa)                                                                            | OK (0)                                                             |
| P22           | Sin transacciones abiertas de más de 60 s                                                                           | OK (0)                                                             |
| **Veredicto** |                                                                                                                     | **GO**                                                             |

**Validez.** El PRECHECK describe el estado de las 04:45 UTC. Hay que repetirlo inmediatamente antes de
la primera escritura, en el mismo día y después del backup válido.

### 13.3 Dependencias: verificación ampliada

La extracción automática de referencias entre cargas confirmó el orden de §8.1 y no encontró ningún
ciclo:

- el cierre de A1 enlaza 3 palabras creadas por las lecciones planificadas;
- B1 enlaza 13 palabras de inglés A2 U13–U17;
- B2 enlaza 1 palabra de B1;
- portugués, italiano y chino solo enlazan su piloto publicado;
- el francés no enlaza nada externo.

**Cambio de esquema no listado en la primera versión del plan:** B1 y B2 amplían el `CHECK`
`curriculum_units_level_check`, que hoy admite A1 y A2, para aceptar B1 y B2. Es un `ALTER` acotado y
previsto por sus migraciones. Cambia la línea base de esquema y hay que tenerlo en cuenta en el
POSTCHECK.

## 14. Preparación de la tanda 1 (I-W1 a I-W5), 2026-11-21

Nada de esto escribe en producción. Las herramientas están en `ops/db-reconciliation/`:

- `apply-t1.mjs`: envoltorios, sin ejecutarlos;
- `lib.mjs` y `cli.mjs`: instantánea y POSTCHECK;
- `rehearse-t1.mjs`: ensayo en PGlite.

### 14.1 Los cinco archivos

| Paso | Archivo                                            | SHA-256 completo                                                   | Requiere                    | Efecto (todo sin publicar)                                                                                                                                                                        |
| ---- | -------------------------------------------------- | ------------------------------------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I-W1 | `20261113120300_planned_lessons_en_a1_u13_u14.sql` | `5d240802266e72c63c3387005be9b0393223597032bf4c288e2fd443fba3e2cf` | `20261113120200` (aplicada) | 20 lecciones L1–L5 en a1-u13/u14 (las unidades ya existen); 34 palabras; 200 ejercicios; 165 ítems; +4 relaciones objetivo–concepto                                                               |
| I-W2 | `20261119120000_a1_en_closure.sql`                 | `2d37a8dec8da25fcde498ca3382a7862d59eb9f956114167a621581e00931596` | I-W1                        | 3 lecciones nuevas; 34 palabras; 105 ejercicios (73 en lecciones ya publicadas, que quedan sin publicar); 105 ítems                                                                               |
| I-W3 | `20261120120000_a2_en_completion.sql`              | `86dc9a9fa4d9b1ffb84474da57db504aa471aa6abca6809f68b62897f673b7a3` | `20261113120000` (aplicada) | 5 unidades a2-u13…u17; 50 lecciones; 84 palabras; 469 ejercicios; 362 ítems                                                                                                                       |
| I-W4 | `20261122120000_b1_en.sql`                         | `b566e927bf796d0838435290167412d5ffb35db2c22236e426395778df72645e` | I-W3                        | **DDL:** `drop constraint if exists curriculum_units_level_check` + `add constraint … check (level in ('A1','A2','B1'))`. 12 unidades B1; 120 lecciones; 209 palabras; 1128 ejercicios; 885 ítems |
| I-W5 | `20261124120000_b2_en.sql`                         | `f06ef4b44820e1f4229f5dd623e66385594bb68b99ae0b431fec85b43985388f` | I-W3 e I-W4                 | **DDL:** el mismo `CHECK`, con `('A1','A2','B1','B2')`. 12 unidades B2; 120 lecciones; 215 palabras; 1176 ejercicios; 941 ítems                                                                   |

**Qué no contienen:** ninguno tiene `DELETE`, `TRUNCATE`, `DROP TABLE`, funciones nuevas, políticas,
triggers ni publicaciones.

**Qué pueden tocar de lo existente:**

- **`UPDATE`:** solo alcanzan ids de la propia carga, que hoy no existen (P12 y P13).
- **`ON CONFLICT DO UPDATE`:** solo de objetivos, en I-W1. Los 4 objetivos y 77 de sus 81 relaciones
  ya existen y son **idénticos**: se verificó en producción, en solo lectura. Por lo tanto **no
  modifican ninguna fila existente**.
- **El DDL:** al recrear el `CHECK` se valida contra las filas actuales de `curriculum_units`: 62 hoy,
  91 al terminar la tanda. La validación toma un bloqueo exclusivo breve sobre esa tabla, que cubre
  `lock_timeout = '5s'`.

### 14.2 Envoltorios (generados, **no ejecutados**)

Cada uno es **una sola transacción**, con estos pasos:

1. `lock_timeout = 5s` y `statement_timeout = 600s`.
2. **Guardias:** la versión no está registrada, sus dependencias sí, y el Learning Machine está en S1.
   Si algo falla, aborta antes de tocar nada.
3. El archivo, byte a byte; antes se comprueba su SHA-256.
4. La fila de historial con la versión local: `created_by = 'claude-code via cli db query'`, la misma
   convención de 209 y 213.
5. `COMMIT`.

Se generan de forma determinista: dos ejecuciones dan el mismo resultado.

| Envoltorio                                                    | SHA-256                                                            | Bytes     |
| ------------------------------------------------------------- | ------------------------------------------------------------------ | --------- |
| `I-W1_20261113120300_planned_lessons_en_a1_u13_u14.apply.sql` | `9ee518e62851af470303cf7cc8ff0a1425c24528c074f69e59499f7ea2b9ca5e` | 462 025   |
| `I-W2_20261119120000_a1_en_closure.apply.sql`                 | `351a88a30e2a52ec7b32148d3edcaffd6ee802ddfcd979615725da1283843ccf` | 308 973   |
| `I-W3_20261120120000_a2_en_completion.apply.sql`              | `9e029b64632e6026cf4409f1cff93a82cb29af6740ac91396e7e86d564b36624` | 1 063 432 |
| `I-W4_20261122120000_b1_en.apply.sql`                         | `9f44d89b6401dc161fbed1f3eaafa2daad44f70ff367915b005fa789ce6f60f9` | 2 587 322 |
| `I-W5_20261124120000_b2_en.apply.sql`                         | `98bee34238e2ba4b1fedd24da297e3247ddc5e4e3efb635d5dcc67c6addc79a1` | 2 974 857 |

Se aplicarían, uno por uno y con autorización, con
`npx supabase db query --remote=wtymosvsymzoosxscnxi -f <envoltorio>`. No se usaría `db push`.

### 14.3 Ensayo local (PGlite, base desechable)

Se aplicaron los cinco envoltorios exactos sobre la cadena de las 164 migraciones del cliente. La base
tiene las **mismas 107 tablas** que producción.

- **Cambios medidos:**

  | Tabla                                       | Cambio         |
  | ------------------------------------------- | -------------- |
  | `curriculum_units`                          | +29            |
  | `words` y `concepts`                        | +576 cada una  |
  | `lessons`                                   | +313           |
  | `exercises`                                 | +3078          |
  | `exercise_words`                            | +4504          |
  | `exercise_items` y `exercise_item_versions` | +2458 cada una |
  | `item_concepts`                             | +5264          |
  | `exercise_option_sets`                      | +1501          |
  | `exercise_option_set_assignments`           | +1769          |
  | `objective_concepts` y `lesson_objectives`  | +4 cada una    |
  | `item_objectives`                           | +5             |

  Coinciden con la suma de los cinco archivos. Las otras 93 tablas no cambian.

- **Huella del esquema sin cambios:** funciones, políticas, triggers, índices, columnas, permisos y
  restricciones. Solo cambia el `CHECK` de nivel, de A1/A2 a A1/A2/B1/B2.
- **S1** antes y después.
- **Totales publicados y activos** iguales: no se publica nada.
- **POSTCHECK:** **GO** después de aplicar y **NO-GO** sin aplicar.
- **Reaplicar:** la guardia aborta (`ya está registrada`) y no cambia nada.

### 14.4 Cómo se verificará en producción

1. **Inmediatamente antes de I-W1:** repetir el PRECHECK (22 comprobaciones) y tomar la **instantánea
   previa** (`cli.mjs snapshot-sql`). Es un `SELECT` de solo lectura con conteos de las 107 tablas y de
   `auth.users`, el historial, la huella del esquema, S1 y los totales publicados.
2. **Después de cada paso:** comprobar la fila de historial y el clasificador S1.
3. **Al terminar la tanda:** el POSTCHECK (`cli.mjs postcheck-sql`, solo lectura) compara contra la
   instantánea previa más los deltas del ensayo. Verifica:
   - cada tabla igual a su valor previo más su delta (las 93 sin delta, idénticas);
   - el historial = las 110 filas previas, intactas, más exactamente las 5 nuevas, con su nombre;
   - la huella de funciones, políticas, triggers, índices, columnas y restricciones sin cambios;
   - el `CHECK` igual a `CHECK ((level = ANY (ARRAY['A1'::text, 'A2'::text, 'B1'::text, 'B2'::text])))`;
   - S1;
   - nada nuevo publicado.
4. **Prueba negativa ya hecha en producción** (2026-11-21 05:00 UTC, solo lectura). El POSTCHECK
   ejecutado **antes** de aplicar dio NO-GO en exactamente las 22 comprobaciones que dependen de las
   cargas: 14 tablas, 5 filas, el total y la lista del historial, y el `CHECK`. Las otras 103 dieron OK.
   Eso confirma que el POSTCHECK funciona sobre el esquema real.
5. **Limitación:** en producción la huella de permisos (`grants`) sale vacía, porque el rol de la CLI no
   ve `role_table_grants`, y no aporta información. Las demás huellas sí se leen.
6. **Requisito:** que no se use la app con la cuenta de prueba durante la ventana. Si no, cambiarían
   tablas de usuario y el POSTCHECK daría NO-GO por esa causa.

### 14.5 Backup y PRECHECK del día (2026-11-21, solo lectura): **desbloqueado**

- **Backup físico `2335804718`.** Así figura en `supabase backups list`, consultado a las 13:58 y
  confirmado a las 13:59 UTC:
  - estado **COMPLETED**;
  - fecha **2026-11-21 13:24:02 UTC**, **posterior al hardening** (02:21 UTC);
  - proyecto `wtymosvsymzoosxscnxi` (PolyGo, `environment: production`);
  - PITR desactivado.

  Reemplaza al bloqueo de §13.1. **Ventana de 24 h:** hasta el 2026-11-22 a las 13:24 UTC.

- **PRECHECK repetido** a las 13:59:37 UTC, con el mismo archivo (`2c892993…`): **GO 22/22**. Producción
  sigue en el estado de las 04:45 UTC.
- **Hashes:** los cinco archivos fuente y los cinco envoltorios, regenerados, conservan los hashes del
  §14.1 y del §14.2.
- **Pendiente antes de I-W1, en la misma ventana:**
  - repetir el PRECHECK;
  - tomar la instantánea previa (§14.4).

## Verificaciones: resumen

| Punto                                          | Estado                                                                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Migraciones aplicadas en producción            | **VERIFICADO**: 110 filas, listadas                                                                                 |
| Learning Machine en S1                         | **VERIFICADO**: clasificador S1                                                                                     |
| Objetos de las 61 migraciones antiguas         | **VERIFICADO** que existen; cuerpos **NO VERIFICADOS**                                                              |
| Ninguna carga pendiente aplicada               | **VERIFICADO**                                                                                                      |
| Dependencias                                   | **VERIFICADO** en los encabezados y en la cadena PGlite                                                             |
| Regeneración determinista desde el cliente     | **VERIFICADO**: 16 idénticas; francés de 30 u. determinista                                                         |
| Datos de usuario = una sola cuenta             | **VERIFICADO**: 1 usuario, FKs listadas                                                                             |
| Backup reciente                                | **BLOQUEO** (§13.1): el último físico es del 2026-11-20 13:24 UTC, **anterior al hardening**; sin PITR ni `pg_dump` |
| PRECHECK de la Etapa I                         | **GO 22/22** (§13.2), a las 04:45:58 UTC; repetir antes de escribir                                                 |
| Dependencias entre cargas y contra producción  | **VERIFICADO** (§13.3): 396 palabras publicadas, 407 conceptos, 15 unidades y 19 lecciones idénticas                |
| Efecto en Ranked de publicar it/pt/zh A1–A2    | **VERIFICADO** (§12) en la base; versión desplegada del Battle Server **NO VERIFICADA**                             |
| Configuración de AdMob y compras               | **NO VERIFICADO**: no está en la base                                                                               |
| Visibilidad de unidades sin ruta en producción | **NO VERIFICADO** en producción; verificado en PGlite                                                               |
