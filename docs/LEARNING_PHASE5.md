# Fase 5 — Cobertura completa y preparación para la validación integral

Estado (2026-11-08, **cerrada**: §11): **implementado y probado en local** (PGlite, Jest y PostgreSQL 17 local). **Nada
aplicado en producción**, ninguna Edge Function desplegada, sin commits, sin build. SRS v2, Mastery
Display y Adaptive siguen **apagados** (las pruebas lo comprueban al terminar). No se tocó Ranked, el
cuerpo de `submit_learning_session(_v1)`, `polygo.answers.v1`, la energía ni Plus (precios, beneficios).

Fuentes que no cambia: `LEARNING_DATA_ARCHITECTURE.md` rev. 8, `MASTERY_ENGINE_DESIGN.md` rev. 2,
`ADAPTIVE_LEARNING_DESIGN.md` rev. 4.2, fases 2–4 y `FREE_PRODUCTION_GRADING_SPEC.md`.

## 1. Resumen

| Objetivo                         | Resultado                                                                                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A · `record_learning_session`    | **Implementado.** Vía autoritativa de los repasos del servidor: ítems de uno o varios conceptos, vocabulario y producción, idempotente, sin doble progreso |
| B · Rutas de evaluación          | **Unificadas** en una corrección (`gradeOne`), una tabla de presentaciones y una de evidencias; dos escritores (lecciones / repasos), ver §3                |
| C · Repasos multilingües         | **Infraestructura lista**: idioma del plan validado, sin mezclas, `content_unavailable` para idiomas sin contenido, Unicode/NFC/chino probados            |
| D · Producción                   | **Motor determinista `constrained_text.v1` implementado, sin activar** (faltan listas cerradas editoriales y respuestas de prueba por ítem)               |
| E · Compatibilidad de versiones  | Contrato de cliente (`client`), registro por sesión, medición de rutas y compuerta de contrato mínimo (sin efecto por defecto). Ruta vieja intacta         |
| F · Pruebas                      | Suites nuevas en PGlite, PostgreSQL 17 (concurrencia) y Jest; ver §8                                                                                       |

## 2. A — `record_learning_session`

Migración `20261111120000_learning_phase5.sql` (aditiva, sin DROP ni DELETE). Sólo `service_role`.

```
app ── answer_review (fase 4, sin cambios) ──▶ review_presentation_answers (la primera respuesta vale)
app ── submit_review ──▶ Edge Function: gradeRecordedAttempts (shared/learningSession.ts → gradeOne →
                         gradeWithSpec, polygo.answers.v1, contra la versión PRESENTADA)
                     ──▶ record_learning_session(p_user, p_session_id, p_started_at, p_time_zone,
                                                  p_gradings, p_grader, p_client)   — una transacción
```

Qué hace, en orden:

1. **Idempotencia**: bloqueo consultivo por sesión; si la sesión existe → `duplicate: true` con los
   veredictos guardados (también si la registró la RPC vieja con el mismo id; R2 en PG17).
2. **Plan y presentaciones**: exige `srs_session_plans` de esa cuenta con origen `adaptive_review` o
   `focus_review`; cada corrección apunta a una presentación de la sesión sin ubicación, primer intento,
   estado/veredicto coherentes, una sola vez por presentación (`invalid_gradings`); todas las
   presentaciones son del idioma del plan (`invalid_plan`); la respuesta coincide con la registrada en
   `answer_review` (`answer_mismatch`).
3. **SRS v2**: con el v2 encendido toma `srs_user_lock` antes de los hechos, como el envoltorio de la
   RPC; el trigger diferido de siempre aplica la sesión. Sus observaciones ya salían de `item_concepts`
   (varios conceptos, varias dimensiones, `χ = 1/n_t`): no se tocó `srs_v2_apply_session`.
4. **Hechos**: `learning_sessions` (`review`; inicio = el del plan del servidor, así una sesión retomada
   después de 3 h no cae en `invalid_started_at`; duración acotada a 3 h como en v1), un
   `exercise_attempts` por presentación (`word_id` = la palabra si el ítem tiene un solo concepto léxico,
   si no nulo; `skill 'vocabulary'` como todo repaso de v1), vínculos y `exercise_attempt_gradings`.
5. **SRS v1**: un `apply_word_result` por palabra publicada de cada concepto léxico target, correcta
   sólo si todos sus primeros intentos lo fueron (la regla de las lecciones de v1). Con un concepto por
   ítem es **exactamente** lo de la ruta de repasos (prueba de paridad).
6. **Recompensas de repaso** idénticas a v1: actividad diaria (racha) y logros. Sin energía ni progreso
   de lección. El motor encola por su trigger de correcciones.
7. Registra el cliente (`learning_session_clients`, §5).

**Candidatos** (`review_item_candidates`, misma firma): admite ítems de varios conceptos target, todos
activos. Para un usuario, un ítem sólo es presentable si ya vio **todos** sus conceptos
(`review_item_known`: estado en el v2 para el adaptativo, palabra estudiada en el v1 para Plus) — un
repaso no introduce ni acredita conceptos nuevos. Ninguna entrada del plan comparte un concepto con
otra, tampoco como secundario (validación en `learning_start_review` / `learning_start_focus_review`;
armadores `planner-2.2.0` y `focus-1.1.0`). `learning_review_content` agrega `words` (todas las
palabras del ítem) para que la app muestre lecturas y audio.

**15.3**: `srs_v2_migrate_user_locked` atribuye también los intentos de `record_learning_session`
(corrección → `item_concepts` → palabra) y ya no los cuenta como categoría C. Sin esto, quien repasara
ítems de varios conceptos antes del corte quedaría «sin reconstruir» (prueba 15.3).

Las funciones reemplazadas se generan copiando la versión vigente y aplicando parches verificados
(`scripts/build-phase5-sql.ts`; una prueba exige que la migración esté al día).

## 3. B — Arquitectura común de evaluación

| Ruta                                   | Presentación                      | Corrección                         | Escritor de hechos / evidencias                 | Quién la usa                          |
| -------------------------------------- | --------------------------------- | ---------------------------------- | ----------------------------------------------- | ------------------------------------- |
| Lección (`start` / `submit`)           | `exercise_presentations`          | servidor, `gradeOne`               | `learning_submit_graded` → cuerpo v1 (energía, progreso, desbloqueo) | builds nuevas                         |
| Repaso básico (`basic_review`, v2 apagado) | `exercise_presentations` + plan | servidor, `gradeOne` (cada respuesta) | **`record_learning_session`**                 | builds nuevas (cierre, §11)           |
| Repaso adaptativo (`adaptive_review`, v2 encendido) | ídem                     | ídem                               | **`record_learning_session`**                    | builds nuevas                         |
| Repasos Plus (`focus_review`)          | ídem                              | ídem                               | **`record_learning_session`**                    | builds nuevas                         |
| `submit_learning_session` directo      | — (la arma la app)                | **cliente**                        | cuerpo v1                                        | builds publicadas; respaldo de lecciones de las builds nuevas (sólo red/función caída) |
| `learning_submit_review_graded` (f. 4) | igual que repasos                 | servidor                           | cuerpo v1                                        | **sin uso** (queda para volver atrás)  |
| Práctica libre / puntos débiles        | app                               | app (sólo feedback)                | no guardan                                       | todas                                 |

- **Una sola regla de corrección** (`gradeOne` → `gradeWithSpec`, `polygo.answers.v1`) para lecciones,
  cada respuesta de un repaso y su envío. Ningún veredicto local es fuente de verdad en las rutas nuevas.
- **Por qué las lecciones no pasan a `record_learning_session`**: ya son autoritativas y su escritor
  necesita la energía, el progreso y el desbloqueo del cuerpo v1; copiarlos duplicaría recompensas sin
  ganar nada. Los dos escritores comparten tablas, corrección y validación de presentaciones.
- **Práctica libre**: la arquitectura (8.6, D3) la quiere con evidencia sin efecto en el SRS; no se
  implementó porque `affects_srs` no existe todavía en `learning_sessions` (arquitectura fase 2). Sigue
  sin guardar, como hoy.

### Transición progresiva

1. **Inventario**: la tabla de arriba; `learning_route_usage(desde)` cuenta sesiones, usuarios, contrato
   y versión por ruta (`legacy_lesson`, `legacy_review`, `lesson_graded`, `record_learning_session`,
   `review_graded_phase4`).
2. **Compatibilidad temporal**: `submit_learning_session` no cambió; sus sesiones siguen dando las
   mismas recompensas; una build vieja que reenvía un id ya registrado recibe `duplicate`.
3. **Builds nuevas** (contrato 2): lecciones y repasos por el servidor (§2), el respaldo de lecciones
   por la ruta vieja sólo ante red/función caída.
4. **Detección** y 5. **cierre**: §5.

## 4. C — Cobertura por idioma

Medido en PGlite con todas las migraciones (catálogo cargado; ítems activos con versión vigente):

| Idioma         | Estado    | Conceptos | Ítems de repaso | De varios conceptos | Vocabulario / Producción | Conceptos repasables | Nota                                 |
| -------------- | --------- | --------- | --------------- | ------------------- | ------------------------ | -------------------- | ------------------------------------ |
| Inglés (en)    | available | 485       | 1 449           | 589                 | 1 449 / 167              | 483                  | A1 + A2                              |
| Italiano (it)  | available | 225       | 714             | 250                 | 714 / 108                | 225                  | A1, sin revisión nativa              |
| Portugués (pt) | available | 215       | 709             | 247                 | 709 / 107                | 213                  | A1, sin revisión nativa              |
| Chino (zh)     | available | 182       | 711             | 255                 | 711 / 99                 | 182                  | A1; sin short_answer ni complete_word |
| Español (es)   | soon      | 0         | 0               | —                   | —                        | 0                    | **No disponible** (content_unavailable) |
| Francés (fr)   | hidden    | 0         | 0               | —                   | —                        | 0                    | **No disponible** (content_unavailable) |

(learning_review_coverage; un ítem de producción cuenta en las dos dimensiones. Los ítems de varios
conceptos —1 341 en total— no podían repasarse antes de esta fase; match_pairs sigue fuera.)

- **Identificación**: el idioma de aprendizaje es el del plan (`srs_session_plans.language_code`); los
  candidatos se filtran por él y `record_learning_session` rechaza una presentación de otro idioma. El
  idioma de interfaz no interviene en la corrección (consignas en español en todo el catálogo).
- **Sin contenido**: `learning_review_coverage(idioma)` → la Edge Function responde
  `status: 'content_unavailable'` y la app muestra «Repasos en preparación», no «Estás al día» ni un
  error. No se inventó contenido.
- **Otro idioma del usuario**: probado que un repaso en italiano no cambia ninguna fila del inglés.
- **Normalización** (`polygo.answers.v1`, sin cambios, ahora fijada por `multilingualGrading.test.ts`):
  NFC, plegado de mayúsculas con acentos, acentos estrictos (un acento faltante es tipeo sólo en
  respuestas de ≥ 8 caracteres; nunca «correcta»), puntuación china = latina, espacios junto a Han
  ignorados, pinyin numerado = marcas, sin tonos = otra respuesta.
- **Limitaciones documentadas (no se cambian sin `polygo.answers.v2`)**: la regla de tipeo mide en
  unidades UTF-16 y se aplica igual en chino (una frase china de ≥ 8 caracteres admite un carácter
  distinto como tipeo); la política de acentos es única para todos los idiomas (D-P8-2).
- **Parejas (`match_pairs`, `pair_set.v1`) siguen fuera de los repasos**: su payload trae las parejas
  resueltas (la respuesta). Falta un formato de presentación que las oculte (fase 2, punto 3).

## 5. E — Compatibilidad de versiones

- **Contrato**: `LEARNING_CONTRACT = 2` (`shared/learningSession.ts`). La app manda en cada pedido
  `client: {contract, app_version, platform}`; sin el campo = contrato 1. La función lo registra en
  `learning_session_clients` (una fila por sesión, inmutable, sin acceso de la app) para lecciones
  (`lesson_graded`) y repasos (`record_learning_session`). Nunca cambia una corrección.
- **Respuestas compatibles**: `submit_review` devuelve lo de siempre más `route`; `start_review` suma el
  estado `content_unavailable` (las builds publicadas no llaman a `start_review`).
- **Compuerta**: variable `LEARNING_MIN_CONTRACT` de la Edge Function (por defecto 1, no rechaza a nadie).
  Subirla hace que un contrato menor reciba `426 client_outdated` (la app nueva no cae a la ruta vieja
  ante ese código).
- **Builds publicadas** (sin Edge Function): siguen por `submit_learning_session` sin cambios.

### Condiciones exactas para cerrar la ruta vieja (no se cierra en esta fase)

Criterios de adopción, sin fecha: se cumplen o no según los datos. Los umbrales (14 días, 98 %) son
una **propuesta** a confirmar en el momento de decidir. Todas a la vez, medidas con
`learning_route_usage(now() - interval '14 days')`:

1. La build con contrato ≥ 2 publicada en las dos tiendas.
2. **`legacy_review_users = 0` durante 14 días seguidos.** Desde el cierre (§11) la build nueva ya no
   guarda ningún repaso por la ruta vieja (ni con el v2 apagado), así que todo `legacy_review` es de
   una build vieja: este criterio mide directamente la adopción.
3. Sesiones `legacy_lesson` sólo de respaldos esporádicos: ≥ 98 % de las lecciones de los últimos 14
   días en `lesson_graded` y ningún usuario cuya última sesión sea `legacy_*` sin ninguna con contrato
   ≥ 2 (las builds viejas no registran cliente: un usuario sólo en `legacy_*` es una build vieja).
4. Un mecanismo de «actualizá la app» en la build vigente (hoy no existe: revocar deja a las builds
   viejas con un error genérico).

Procedimiento: (a) confirmar 1–4; (b) aviso en la app; (c) `revoke execute on function
public.submit_learning_session(...) from authenticated` (reversible con `grant`); (d) observar errores
7 días; (e) recién entonces retirar el respaldo de lecciones de la app. Nada se borra.

**Retirada parcial preparada (2026-11-09, SIN aplicar en producción):**
`20261112120000_retire_legacy_review_route.sql` rechaza sólo los **repasos** de la app por
`submit_learning_session` (`p_kind = 'review'` con rol de sesión `authenticated`/`anon` →
`legacy_review_retired`, SQLSTATE 42501, PostgREST 403). No revoca EXECUTE ni cambia las lecciones, el cuerpo
v1 ni los flujos internos (rol `service_role`). El discriminador es el GUC `role` (PostgREST hace SET ROLE;
SECURITY DEFINER no lo cambia); `auth.role()` no sirve porque `learning_submit_graded` y
`learning_submit_review_graded` fijan `role: authenticated` en los claims. `learning_submit_review_graded`
queda marcada OBSOLETA en el catálogo (sin uso desde la fase 5; se conserva como vuelta atrás). Pruebas:
`supabase/tests/legacyReviewRetirement.test.mjs`; las pruebas que ejercen la rama de repasos del cuerpo v1
pasaron a `service_role`. Efecto en builds de desarrollo viejas: sus repasos fallan con ese código (también
el reenvío de un repaso ya guardado, que antes daba `duplicate`); sus lecciones siguen. Aplicarla requiere
decisión explícita (criterios de arriba o retirada antes del lanzamiento, sin builds públicas).

## 6. D — Producción

| Componente                                    | Estado                                                                                       |
| --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Producción controlada (`normalized_text.v1`)  | En uso; **ahora también en repasos de varios conceptos** (vocabulario + producción)         |
| 1 · Determinista `constrained_text.v1`        | **Implementado** en `shared/constrainedText.ts`: patrones, `(a|b)`, `[opcional]`, clases con listas cerradas (también de varias fichas), `<NUMBER>`/`<ANY_WORD>`, lemas con formas cerradas, prohibidas, `max_tokens`, tipeo Damerau por ficha sin producir otra palabra válida, chino por carácter, detalle (`matched/failed_constraints`, `error_tags`) sin efecto en el SRS |
| 2 · Semántica / ambiguas                      | `pending_review` (sólo con `allow_pending`): ≥ 60 % de lemas, palabra fuera de las listas, demasiado larga con patrón. Sin `allow_pending` → `incorrect` |
| 3 · IA / rúbricas (§4)                        | **No implementado** ni llamado; sin costos                                                   |

**No activado**: no está en `GRADING_MODES` ni en `ref_grading_modes` (una prueba lo comprueba), el
trigger de correcciones no lo admite, ningún ítem lo usa. **Limitaciones**: no existen listas cerradas
(`lemma_forms`, `regional_variants`, clases) ni respuestas de prueba por ítem (§3.6): son contenido
editorial y no se inventaron; «mezcla de idiomas» de §5.3 no es determinable sin listas de la L1;
`pending_review` en la base (§5.1–5.2) y D-P8-1…5 siguen abiertos.

## 7. Cobertura por tipo de ejercicio

| Tipo (modo)                                   | Lecciones | Repasos del servidor (fase 5)                         |
| --------------------------------------------- | --------- | ----------------------------------------------------- |
| translation_choice, image_choice, listen_choice (exact_option) | sí | sí, uno o varios conceptos                 |
| fill_blank (exact_option, casi todos de varios conceptos)      | sí | **sí (nuevo)**                             |
| order_words (normalized_text, varios conceptos)                | sí | **sí (nuevo)**                             |
| complete_word, translate_write free_recall (normalized_text)   | sí | sí                                         |
| translate_write / short_answer de producción (vocab + P)       | sí | **sí, también de varios conceptos (nuevo)**|
| match_pairs (pair_set)                                         | sí | no: el payload revela la respuesta (§4)    |
| free_production / rúbricas                                     | no | no (§6)                                    |
| Conceptos no léxicos (gramática, comprensión)                  | — | sin contenido en el catálogo; `record_learning_session` los registraría en el v2 y el motor, pero no tienen palabra para el v1 ni entran como concepto principal |

## 8. Pruebas (resultados reales)

**Ejecutado (2026-11-08):** `tsc` (app y scripts) y `expo lint` sin errores · Jest completo 58/58 suites,
6 044 pruebas · `npm run test:db` 295/296: la única falla es `humanmatch.test.mjs` (tiempos, conocida;
aislada 10/10) · PostgreSQL 17: R1, R2, R3 correctos · `build-phase5-sql.ts --check` al día. **No
probado:** la Edge Function en Deno, la app en un dispositivo, nada contra producción.

Suites nuevas:

| Suite                                             | Qué cubre                                                                                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `supabase/tests/phase5.test.mjs` (12)             | varios conceptos (v1 por palabra, intentos, cola del motor, energía), idempotencia, duplicados/modificadas, sesión retomada > 3 h, otra cuenta, producción con v2, armador sin conceptos repetidos, paridad con la fase 4, idiomas separados y mezcla rechazada, cobertura, ruta vieja y medición, 15.3, Ranked/energía/interruptores, migración generada al día |
| `supabase/tests/pg17/record-concurrency.mjs`      | R1 mismo envío simultáneo, R2 ruta nueva vs vieja con el mismo id, R3 dos repasos simultáneos con el v2 (seq 1,2; recálculo 0)                  |
| `shared/__tests__/constrainedText.test.ts` (20)   | §3 y §5.3, determinismo, chino, NFC, no activado                                                                                                 |
| `shared/__tests__/multilingualGrading.test.ts` (10) | v1 en it/pt/zh/es/fr                                                                                                                            |
| `adaptivePlanner`, `focusReview`, `learningSession`, `serverReview`, `learningClient` | armadores 2.2.0 / 1.1.0, `gradeRecordedAttempts`, contrato, palabras del ítem                         |

Actualizadas: `review.test.mjs` (el envío de la Edge Function va por `record_learning_session`; la de la
fase 4 sigue probada en «protección»), `phase4.test.mjs` y `phase4close.test.mjs` (versiones de armador).

## 9. Producción (requiere autorización expresa; nada hecho)

1. Aplicar las 3 migraciones de la fase 4 y luego `20261111120000_learning_phase5.sql` (aditiva; con
   todo apagado cambia sólo qué ítems puede elegir un repaso del servidor, que ninguna build publicada usa).
2. Desplegar `learning-session` (`npm run functions:build` antes).
3. Build de tiendas con las variables `EXPO_PUBLIC_*` de EAS (pendiente desde la fase 2).

## 10. Archivos

**Nuevos**: `supabase/migrations/20261111120000_learning_phase5.sql`, `scripts/build-phase5-sql.ts`,
`shared/constrainedText.ts`, `supabase/tests/phase5.test.mjs`, `supabase/tests/pg17/record-concurrency.mjs`,
`shared/__tests__/constrainedText.test.ts`, `shared/__tests__/multilingualGrading.test.ts`,
`src/features/learning/__tests__/learningClient.test.ts`, este documento.

**Modificados**: `shared/learningSession.ts` (contrato, `gradeRecordedAttempts`), `shared/adaptivePlanner.ts`
(2.2.0), `shared/focusReview.ts` (1.1.0), `supabase/functions/learning-session/index.ts` (+ paquetes
generados), `src/features/learning/api.ts`, `serverReview.ts`, `src/app/review.tsx`, pruebas citadas,
`FREE_PRODUCTION_GRADING_SPEC.md`, `LEARNING_PHASE4.md`, `EDITORIAL_CONTENT_PIPELINE.md` (líneas de estado).

## 11. Cierre de la fase 5 — repaso básico autoritativo con el SRS v1

Decisiones aprobadas (A, B, C del pedido de cierre). **Arquitectura definitiva de los repasos de la app
nueva: todos los arma, presenta, corrige y guarda el servidor**, con el v2 apagado o encendido.

### A. Repaso básico con el SRS v2 apagado

| Paso                         | Qué pasa                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1. `start_review` sin foco   | v2 apagado y contrato ≥ 2 → repaso básico (antes: `srs_v2_disabled` y la app lo armaba y guardaba sola)     |
| 2. Selección (servidor)      | `learning_focus_candidates` (progreso v1 + ítems presentables) → `buildBasicPlan` (`shared/focusReview.ts`) |
| 3. Registro                  | `learning_start_basic_review`: plan (`basic_review`, foco `{kind:'basic'}`, `basic-1.0.0`) + presentaciones |
| 4–5. Respuestas y corrección | `answer_review` (feedback del servidor, la primera respuesta vale, repeticiones P4) — sin cambios            |
| 6. Guardado                  | `submit_review` → `record_learning_session`: evidencias + SRS v1 + racha + logros, sin energía              |

- **Regla de selección preservada** (la de `LegacyReviewScreen`): palabras estudiadas y vencidas en el
  v1 (`next_review_at ≤ ahora`), las de más errores primero (empate: la que venció antes; después el id,
  para que sea determinista), hasta 10. `learning_start_basic_review` vuelve a validar en el servidor:
  palabra estudiada y vencida, motivo `due`, ≤ 10, ítem presentable y conocido, sin conceptos compartidos.
  No exige Plus.
- **Diferencias con la app vieja, documentadas**: (1) una palabra sin ítem presentable del catálogo no
  entra (antes la app inventaba el ejercicio con distractores propios); se sigue con la siguiente vencida;
  (2) el ejercicio es un ítem del catálogo con su versión, no uno armado en el dispositivo; (3) un ítem de
  varios conceptos actualiza también sus otras palabras ya estudiadas, como una lección (criterio C).
- **SRS v1 sin cambios**: `apply_word_result` es el mismo y recibe lo mismo (prueba de paridad contra
  `submit_learning_session` con las mismas palabras y resultados).
- **Sin respaldo silencioso**: la app nueva no tiene ningún camino que guarde un repaso por
  `submit_learning_session`. `LegacyReviewScreen` quedó sólo para práctica libre y puntos débiles (no
  guardan). Si un servidor desactualizado respondiera `srs_v2_disabled`, la app muestra un error
  recuperable, no el repaso viejo.
- Con el v2 encendido, el repaso sin foco es el adaptativo (sin cambios). Una sesión abierta de origen
  `basic_review` se retoma aunque el v2 se haya encendido después.

### B. Builds antiguas

`submit_learning_session` no cambió ni se revocó; `learning_route_usage` distingue `legacy_*` (ruta
vieja) de `record_learning_session` / `lesson_graded` y registra contrato y versión. Contrato 1 en
`start_review` sigue recibiendo `srs_v2_disabled` (builds de la fase 4, nunca publicadas). Criterios de
retiro en §5 (sin fecha).

### C. Plus con ítems de varios conceptos — verificación

| Condición                                       | Cómo se cumple                                                                                          | Prueba                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------- |
| Vinculado explícitamente                        | Sólo filas `item_concepts` con `role = 'target'`                                                        | Cierre C                   |
| Evalúa realmente esos conceptos                 | `context` / `distractor` no se actualizan nunca                                                         | Cierre C (concepto context) |
| Todos estudiados antes                          | `review_item_known(…, 'v1')` en candidatos y otra vez al registrar el plan                                | Cierre C, A                |
| Una actualización por concepto                  | `apply_word_result` una vez por palabra y sesión (`group by`); el plan no repite conceptos              | A, Cierre C                |
| Sin progreso sobre relacionados no evaluados    | Ninguna otra palabra cambia (comparación fila por fila)                                                 | A, Cierre A, Cierre C      |
| Evidencias inmutables                           | Triggers de `exercise_attempt_gradings` (UPDATE/DELETE rechazados)                                      | Cierre C                   |
| Beneficios, energía, Ranked                     | Mismos tamaños y reglas de Plus; `user_energy` idéntica; hashes de Ranked idénticos                       | Cierre C, Aislamiento      |

### Pruebas del cierre

`phase5.test.mjs` +4 (repaso básico de punta a punta, paridad del v1 con la ruta vieja, validación del
plan básico, condiciones de Plus); `focusReview.test.ts` +2 (`basic-1.0.0`). Resultados en el informe.

**Resultados del cierre (2026-11-08, ejecutados):** `npm run typecheck` (app y scripts) y `expo lint` sin
errores · Jest completo 58/58 suites, 6 046 pruebas · `npm run test:db` 299/300 en la corrida completa;
la falla era `catalog.test.mjs` (la lista de orígenes no tenía `basic_review`): corregida en
`content/practice-sources.ts` (`PHASE5_PRACTICE_SOURCES`) y la suite pasa 9/9 · `phase5.test.mjs` 16/16 ·
PostgreSQL 17: R1, R2, R3 correctos · `build-phase5-sql.ts --check` al día. **No probado:** la Edge
Function en Deno, la app en un dispositivo, nada contra producción.
