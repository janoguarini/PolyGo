# Fase 3 — Motor de aprendizaje adaptativo (SRS v2, Mastery Engine, Adaptive)

Estado (2026-11-08): **implementado y probado en local** (PGlite, Jest y PostgreSQL 17 local). **Nada
aplicado en producción**, ninguna Edge Function desplegada, sin commits. El SRS v2 y el uso del motor
por Adaptive quedan **apagados por defecto**.

Fuentes de verdad: `LEARNING_DATA_ARCHITECTURE.md` rev. 8, `MASTERY_ENGINE_DESIGN.md` rev. 2,
`ADAPTIVE_LEARNING_DESIGN.md` rev. 4.2 y `LEARNING_ATTEMPTS_PHASE2.md`. Este documento no cambia
ninguno: registra cómo se implementaron, dónde el texto no alcanzaba y qué queda bloqueado.

## 1. Componentes

| Bloque               | Qué hace                                                                                                                                                                                                                                                                             | Autoridad                                                 | Réplica / núcleo TS         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- | --------------------------- |
| A · SRS v2           | `srs-2.0.0`: núcleo FSRS-4.5 (ecuaciones reescritas) + capa de sesión (5.3–5.9), q en enteros (13.2), dispersión `polygo.unit_hash.v1`, AL19 (9.7), una sola vía `srs_v2_apply_session` con `srs_user_head` / `seq` / `t_srs`, migración por usuario (15.3) y recálculo determinista | `supabase/migrations/20261109120000_srs_v2.sql`           | `shared/srs2.ts`            |
| B · Mastery Engine   | `me-1.0.0`: `model_eval` canónico en `numeric` (P5 numérico con Stirling + Lentz + bisección), cuatro dimensiones, suficiencia, transferencia, retención (grilla), velocidad sólo en `T`, detalle que explica la estimación; cola de recálculo; trabajo de sugerencias R1            | `supabase/migrations/20261109130000_mastery_engine.sql`   | `shared/mastery.ts`         |
| C · Adaptive         | `planner-2.0.0`: presupuesto (AL7, AL21), reserva, vencidos, plaza semanal (AL8), R3–R5, adelantos (I7), recién aprendidas, por vencer, escalón (8.4), intercalado                                                                                                                   | `shared/adaptivePlanner.ts` (lo ejecuta la Edge Function) | —                           |
| D · Repasos servidor | Candidatos, registro del plan y de las presentaciones exactas, envío corregido (`adaptive_review`)                                                                                                                                                                                   | `supabase/migrations/20261109140000_adaptive_review.sql`  | `shared/learningSession.ts` |

### Separación de responsabilidades (verificada por pruebas)

- **SRS programa:** sólo `srs_v2_apply_session` escribe `user_srs_state` desde sesiones.
- **Mastery estima:** ninguna función `mastery_*` menciona tablas del SRS, de Adaptive ni `user_word_progress`
  (prueba por `prosrc`); su escalera es propia.
- **El motor nunca toca `S` ni `D`:** `srs_apply_me_hint` sólo escribe `due_effective_at`, `me_hint_at` y
  `me_hint_expires_at`; un trigger rechaza cualquier otra columna cuando escribe ese trabajo (I4), y toda
  sesión aplicada anula la sugerencia (I6).
- **Adaptive decide:** el armador es puro (la prueba comprueba que no modifica su entrada).
- **Ranked:** no se tocó ninguna tabla ni función de Ranked. **Plus:** no cambia ningún parámetro del
  motor (`focus_review` existe como origen, sin ventajas).

## 2. Integración con lo existente

- **`submit_learning_session` no cambió.** Su cuerpo vigente se conserva intacto como
  `submit_learning_session_v1` (renombrado, sin permisos para la app) y la función pública es un
  envoltorio con la misma firma y los mismos permisos que, con el v2 encendido, toma el bloqueo del usuario
  **antes** de registrar los hechos (13.3, pasos 1–2; migra en línea si hace falta) y deja la zona
  horaria para la aplicación. El SRS v1 (`apply_word_result`, `user_word_progress`), la energía, la racha y
  los logros siguen saliendo del cuerpo original.
- **Aplicación en la misma transacción.** Un trigger de restricción diferido sobre `learning_sessions`
  llama a `srs_v2_apply_session(…, 'online')` al confirmar, cuando ya existen los intentos y las
  correcciones del servidor (la fase 2 las inserta después de llamar a la RPC). Si falla, falla el envío
  entero. No hay cola de sesiones.
- **Fase 2 intacta:** `learning-session` (start/submit de lecciones), `exercise_presentations`,
  `exercise_attempt_presentations`, `exercise_attempt_gradings`, `polygo.answers.v1` y la corrección del
  servidor no cambiaron. El núcleo `gradeLessonAttempts` se refactorizó sin cambio de comportamiento (una
  función interna compartida con los repasos); las 5 985 pruebas de Jest y `attempts.test.mjs` pasan.
- **Ruta vieja compatible:** la app actual sigue funcionando igual; con el v2 encendido sus sesiones
  (`client_reported`) alimentan el v2 con las reglas de 15.2 A (AL14).

## 3. Repasos generados en el servidor

Edge Function `learning-session` (sólo en el repositorio, **no desplegada**):

- `start_review {session_id, language_code, time_zone}` → `learning_review_candidates` (estado del SRS v2,
  del motor, presupuesto, deuda, AL8) → `buildReviewPlan` → `learning_start_review`, que **vuelve a validar
  cada entrada contra el catálogo** y registra `srs_session_plans` (origen `adaptive_review`) y una
  `exercise_presentations` por ítem (versión vigente, conjunto del catálogo, orden `polygo.shuffle.v1` con
  semilla `<sesión>:<ítem>`). Idempotente por `session_id`. Sin nada elegible: `up_to_date` o
  `budget_exhausted`, sin escribir nada.
- `submit_review {session_id, started_at, time_zone, attempts}` → corrige con `gradeReviewAttempts` (una
  respuesta por presentación; la palabra la fija el plan, nunca la app) → `learning_submit_review_graded`:
  `submit_learning_session('review')` con el veredicto del servidor + vínculos + correcciones, en una
  transacción. Devuelve además `srs` (estado confirmado por unidad y `srs_seq`).

Qué puede entrar (nada se inventa): unidades léxicas de vocabulario con estado, palabra publicada; ítems
activos con versión vigente cuyo **único** concepto `target` es esa unidad, corregibles
(`exact_option.v1` / `normalized_text.v1`) y, si son de elección, con **un único** conjunto de opciones del
catálogo para su versión. El escalón del ítem tiene que ser el `k` de la unidad (objetivo si está dominada o
es sondeo); si no hay ítem en ese escalón, la unidad no entra y sigue vencida.

En el catálogo cargado hay ítems de un solo concepto en los tres escalones de vocabulario (R 1 744, G 231,
L 399), así que los repasos de vocabulario tienen contenido.

**La app todavía no llama a `start_review`/`submit_review`**: los repasos de la app siguen por la ruta
vieja. Conectar la pantalla de repaso es trabajo de interfaz y llega con una build nueva.

## 4. Archivos

**Nuevos:** `shared/srs2.ts`, `shared/mastery.ts`, `shared/adaptivePlanner.ts`,
`shared/__tests__/srs2.test.ts`, `shared/__tests__/mastery.test.ts`,
`shared/__tests__/adaptivePlanner.test.ts`, `shared/__tests__/fixtures/srs2-golden.json`,
`supabase/migrations/20261109120000_srs_v2.sql`, `20261109130000_mastery_engine.sql`,
`20261109140000_adaptive_review.sql`, `supabase/tests/srs2.test.mjs`, `mastery.test.mjs`,
`review.test.mjs`, `learningHelpers.mjs`, `supabase/tests/pg17/srs2-concurrency.mjs`,
`supabase/functions/learning-session/planner.generated.js`, este documento.

**Modificados:** `shared/learningSession.ts` (helper `gradeOne`, `gradeReviewAttempts`,
`reviewPresentationOrders`), `supabase/functions/learning-session/index.ts` (acciones de repaso, `srs` en
los envíos), `core.generated.js` (regenerado), `scripts/build-functions.ts` (segundo paquete),
`supabase/tests/harness.mjs` (exporta el stub).

## 5. Pruebas

| Suite                                           | Qué cubre                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/__tests__/srs2.test.ts` (36)            | T1–T9 y estado inicial; **equivalencia exacta (1e−9) con el simulador de la rev. 4.2 en 200 historiales**; Q1–Q12 y 10⁵ pares contra BigInt; P1–P4, E1/E2/E5, M1/M2 (también por día), límites; escalera; día local con DST; V1–V10 e I1–I3a en 10⁵ estados; I5; `B`, reserva, ritmo, `ipu`; AL19 (15.º día, tendencia, salida, reconstrucción)         |
| `shared/__tests__/mastery.test.ts` (31)         | 17 vectores P5 de 5.8.4 (≤ 1e−10), formas cerradas, ln Γ; E0 completo, E7, E2 A/B; velocidad (E4, 6.11); 6.1, 6.2, 6.3, 6.5, 6.6; sin evidencia frente a evidencia baja; retención; agregación 5.13                                                                                                                                                     |
| `shared/__tests__/adaptivePlanner.test.ts` (14) | AL21, reserva/AL19, orden de vencidos, I3b, «al día», escalón sin sustituto, dominada → objetivo, determinismo y pureza, intercalado, motor no habilitado, R3–R5, I7, AL8 (7 días, primera sesión, alternancia)                                                                                                                                         |
| `supabase/tests/srs2.test.mjs` (9)              | Apagado = comportamiento previo; SQL = TS (cuantización, ayudas, hash, 1 500 actualizaciones); online por la ruta vieja con v1 idéntico; ruta corregida; idempotencia y rollback; migración (orden canónico con empate, verificación contra v1, conversión, corte, AL19 inicial, recálculo, barrido 0); categoría C > 5 %; AL19 en la base = réplica TS |
| `supabase/tests/mastery.test.mjs` (5)           | P5 `numeric` = referencia = TS y error sin convergencia; cola → estado con SQL = TS por unidad y P9; E0 en la canónica; independencia por `prosrc`; R1 con E, I1–I4, I6                                                                                                                                                                                 |
| `supabase/tests/review.test.mjs` (5)            | Sin contenido elegible; plan con vencidos e ítems del catálogo, orden registrado, idempotencia; envío con SRS v2 (`adaptive_review`, `ipu`), v1 y cola del motor; manipulación de palabra, veredicto, plan y escalón; compatibilidad con la fase 2                                                                                                      |
| `supabase/tests/pg17/srs2-concurrency.mjs`      | K1, K2 (la segunda confirma antes), K4, K5, K9 (20 envíos), K11 con PostgreSQL 17 y conexiones reales                                                                                                                                                                                                                                                   |

**Resultados (2026-11-08, ejecutados):** `tsc` (app y scripts) y `expo lint` sin errores · Jest completo
53/53 suites, 5 985 pruebas · `npm run test:db` 263/267: las 4 fallas eran 3 pruebas de guarda de las
fases 1–2 que afirmaban que todavía no existían los orígenes `adaptive_review`/`focus_review`, las tablas
`srs_*` y sus FK (actualizadas al estado de la fase 3) y `humanmatch.test.mjs` (falla de tiempos conocida;
aislada pasa 10/10). Tras corregirlas: suites de fase 3 + guardas + `attempts.test.mjs` 59/59 · PostgreSQL 17:
K1, K2, K4, K5, K9 y K11 correctos. **No ejecutadas:** K3 por separado (cubierto por el recálculo en K2/K9),
K6, K7, K8 y K10 (sin inyección de reloj ni intercalados con el trabajo de sugerencias), y el e2e contra
producción (no autorizado).

## 6. Conflictos entre el texto y lo implementado

Se respetó el diseño aprobado; donde el texto era ambiguo o contradictorio se siguió lo que fija sus
vectores o su simulador, y se registra aquí.

| #   | Tema                                                                        | Qué se hizo y por qué                                                                                                                                                                                          |
| --- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| X1  | Vencimiento de la primera sesión informativa                                | 5.5 dice «según 5.6 con due previo = t» (daría `t + ρ·I`), pero la tabla «Estado inicial» de 5.11 —vectores de prueba de 17— y el simulador dan `t + I` (o el reaprendizaje). Se implementó lo de los vectores |
| X2  | `D_núcleo`                                                                  | La actualización de dificultad de FSRS-4.5 incluye su acotación a [1, 10] (igual que el simulador); el texto de 5.1 no la muestra                                                                              |
| X3  | FK de `user_srs_state` «contra `item_concepts`»                             | Imposible tal como está escrita (la PK de `item_concepts` incluye el ítem): FK a `concepts (id, language_code)` y a `ref_polygo_dimensions`                                                                    |
| X4  | CHECK de `study_date` en `srs_user_debt_days`                               | Depende de otra tabla y de la zona: trigger, con `measured_since_date` guardado en el estado                                                                                                                   |
| X5  | `srs_session_plans` «PK y FK» a la sesión; plan firmado (HMAC) de la arq. 9 | La sesión se inserta al enviar; el plan se guarda al iniciar en el servidor (como las presentaciones de la fase 2), sin FK ni firma                                                                            |
| X6  | `concept_evidence` / `answer_events` (arquitectura, fase 2) no existen      | El motor lee las correcciones `valid` de `exercise_attempt_gradings` y los conceptos `target`. `recorded_at` = hora del intento (todos los de una sesión comparten la del envío; el orden interno sale del id) |
| X7  | Momento de la aplicación                                                    | Trigger diferido en la misma transacción (no existe todavía `record_learning_session`). La respuesta con el estado confirmado la arma la Edge Function con `srs_v2_session_result` después del commit          |
| X8  | `invalid_response`                                                          | No es una corrección válida: no entra al v2 ni al motor (el v1 la cuenta como error, como antes)                                                                                                               |
| X9  | Sesiones históricas con correcciones del servidor                           | El `replay` usa las mismas observaciones que `online` (las del servidor); la verificación rehace el v1 con la atribución de 15.2 A, que es lo que vio el v1                                                    |
| X10 | Conversión B: campos no especificados                                       | `rung` G (inicio), `exposures` = `n` = `seen_count`, `relearning` = último resultado de v1 falso                                                                                                               |
| X11 | Columnas de implementación                                                  | `srs_user_head.time_zone`; en `srs_applied_sessions`: `source`, `language_code`, `time_zone`, `imax`, `units_attended`, `items_served` (para recalcular y para `ipu`)                                          |
| X12 | Rol del trabajo de sugerencias (I4)                                         | Guarda por trigger con una variable de transacción. Los permisos por columna para un rol propio quedan pendientes: crear roles y cambiar dueños en migraciones de Supabase no se verificó                      |
| X13 | Exposición del concepto (arq. 7.4, paso 6)                                  | Intentos vinculados por `word_id`, `exercise_words` o `item_concepts` (cualquier rol), de sesiones nuevas o viejas                                                                                             |
| X14 | Tope diario de adelantos (I7, «20 % de los repasos del día»)                | ≤ ⌈0,2·S⌉ por sesión y ≤ ⌊0,2·(B − reserva)⌋ por día                                                                                                                                                           |
| X15 | «Atendido» para AL8                                                         | Servido con motivo `weak` o `probe` en un `adaptive_review` enviado                                                                                                                                            |

## 7. Decisiones pendientes F1–F10

| #   | Estado en esta fase                                                                                                              | ¿Bloquea?                                                                     |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| F1  | Núcleo FSRS-4.5 implementado; cambiar de núcleo exige ≥ 20 000 repasos de ≥ 200 usuarios                                         | No                                                                            |
| F2  | Pesos iniciales (AL3) activos como `srs-2.0.0-w-initial`; sin ajuste                                                             | No                                                                            |
| F3  | `r` 0,85 e `I_max` 45 como parámetros de la versión                                                                              | No                                                                            |
| F4  | Plaza semanal y umbrales de la escalera provisionales                                                                            | No                                                                            |
| F5  | AL19 implementada con los umbrales de 19.3                                                                                       | No                                                                            |
| F6  | Ritmo poblacional 7,5 con contracción por usuario (8.1)                                                                          | No                                                                            |
| F7  | **Sólo se recomienda** (reserva 0 %); nada bloquea lecciones                                                                     | No (decisión de producto)                                                     |
| F8  | Reanclaje de `S` no implementado (AL4-b)                                                                                         | No                                                                            |
| F9  | Unidades persistentes (AL17): sin umbral ni interfaz; necesita además historial de errores plenos por unidad en 30 días (ver B3) | Bloquea AL17                                                                  |
| F10 | Ecuaciones reescritas, sin código copiado (apéndice C). **La confirmación legal sigue pendiente** y 21.1 la pone antes de AL1    | **Bloquea activar el v2 en producción** (no la implementación ni las pruebas) |

## 8. Bloqueos y pendientes reales

> **Fase 4 (2026-11-08, `docs/LEARNING_PHASE4.md`):** B2 cerrado para producción (conceptos léxicos en
> cualquier dimensión; gramática y comprensión no tienen conceptos), B3 cerrado (historial
> `srs_unit_updates`, R5 completa, AL17), B4 integrado en la app (repasos del servidor; dominio detrás de
> `enabled_for_display`), B6 preparado sin programar. B1 (F10), B5, B7 y B8 siguen abiertos.
>
> **Cierre del Learning Machine (2026-11-10, `docs/LEARNING_MACHINE_CLOSURE.md`):** B5 cerrado
> (`tools/al-sim4/`); B7: criterio 2 de 5.8.4 cumplido en PostgreSQL 17 (falta la parte «35 valores
> publicados» del criterio 1 y la decisión de habilitar); K3, K6–K10 ejecutados; dos interbloqueos de los
> trabajos corregidos en `20261118120000_learning_machine_hardening.sql` (sin aplicar). B1 (F10) y B8
> siguen abiertos.

- **B1 · F10 (licencias):** sin confirmación legal no conviene encender el v2 en producción.
- **B2 · Repasos del servidor sólo de vocabulario léxico.** La RPC de repasos (`submit_learning_session`
  `review`) exige una palabra publicada por intento. Gramática, producción y comprensión ya tienen estado
  en el v2 (desde las lecciones corregidas) pero no pueden repasarse por esta vía hasta que exista
  `record_learning_session` (arquitectura, fase 3) o se decida otra regla.
- **B3 · Respaldo de R5 «≥ 2 errores plenos en 30 días» y AL17:** no hay historial de errores plenos por
  unidad; sólo se usa `D ≥ 6,85`. «Máximo 2 por objetivo por sesión» no se aplica: `learning_objectives`
  está vacía.
- **B4 · App:** la pantalla de repaso no usa `start_review`/`submit_review`; «Dominada» (AL12) y
  «Para repasar» (`get_learning_summary`, 11) siguen saliendo del v1. Cambiarlos es interfaz + build.
- **B5 · AL18:** el simulador sigue fuera del repositorio; se usó sólo para generar los vectores dorados
  (`shared/__tests__/fixtures/srs2-golden.json`). Incorporarlo requiere revisar su código.
- **B6 · Trabajos programados:** `mastery_process_queue`, `srs_apply_me_hint`, `srs_v2_enqueue_migrations`
  / `srs_v2_migrate_user` y `srs_v2_repair_sweep` existen pero no están programados (`pg_cron`).
- **B7 · Habilitación del motor para Adaptive:** `mastery_model_versions.enabled_for_adaptive = false`.
  La canónica cumple los criterios 1, 3 y 4 de 5.8.4 en los vectores probados; el 2 (grilla completa de
  289 pares y 1 573 puntos de `I_x`) no se corrió en SQL.
- **B8 · Inventario de 15.3 paso 1:** repetirlo en el corte, como indica `SRS_V2_MIGRATION_INVENTORY.md`.

## 9. Producción (requiere autorización expresa)

Preparado, **sin aplicar**:

1. Migraciones `20261109120000_srs_v2.sql`, `20261109130000_mastery_engine.sql`,
   `20261109140000_adaptive_review.sql` (aditivas; una transacción por archivo). Aplicarlas **no cambia
   ningún comportamiento**: el v2 queda apagado y el envoltorio de la RPC no hace nada.
2. Desplegar `learning-session` (nuevas acciones; las de lecciones no cambian, salvo el campo `srs`, nulo
   con el v2 apagado).
3. Encender el v2 (`update srs_v2_settings set enabled = true`) = **corte** de 15.3: requiere B1, repetir
   el inventario (B8) y programar la migración por lotes (B6). Volver a apagarlo detiene la aplicación;
   las sesiones de ese intervalo quedarían para el barrido de reparación.
4. Habilitar el motor para Adaptive (B7) y programar sus trabajos.
5. App: conectar los repasos del servidor y los estados visibles (B4), en una build nueva.
