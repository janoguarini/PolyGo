# Fase 4 — Cierre funcional e integración del aprendizaje

Estado (2026-11-08): **implementado y probado en local** (PGlite, Jest y PostgreSQL 17 local). **Nada
aplicado en producción**, ninguna Edge Function desplegada, sin commits, sin build. El SRS v2, el uso
del motor por Adaptive y la visualización del dominio siguen **apagados**. No se tocó Ranked, el SRS
v1 ni `submit_learning_session` (ni su cuerpo v1). Plus: mismos precios, beneficios y reglas de
selección; sus repasos pasaron a la corrección del servidor (P3).

**Cierre (2026-11-08):** decisiones P1–P9 tomadas e implementadas donde correspondía (§10). Migración
nueva `20261110140000_learning_phase4_close.sql`; especificaciones `FREE_PRODUCTION_GRADING_SPEC.md`
(P8) y `EDITORIAL_CONTENT_PIPELINE.md` (P9).

Fuentes de verdad: `LEARNING_DATA_ARCHITECTURE.md` rev. 8, `MASTERY_ENGINE_DESIGN.md` rev. 2,
`ADAPTIVE_LEARNING_DESIGN.md` rev. 4.2, `LEARNING_ATTEMPTS_PHASE2.md`, `ADAPTIVE_LEARNING_PHASE3.md`.
Este documento no cambia ninguno; cierra los pendientes B2, B3, B4 y B6 de la fase 3 en lo que estaba
definido y registra lo que sigue abierto.

## 1. Resumen

| Objetivo                          | Resultado                                                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| A · Repasos adaptativos en la app | **Integrado.** La pantalla de repaso usa `start_review` / `answer_review` / `submit_review`; feedback sólo del servidor; retomar sesiones  |
| B · Mastery en la experiencia     | **Integrado detrás de un interruptor** (`enabled_for_display`, apagado). «Dominadas» sólo del motor (AL12); «Para repasar» del SRS vigente |
| C · Cobertura por tipo            | Vocabulario **y producción**. Gramática y comprensión: el catálogo no tiene conceptos. `free_production`: sin corrección automática        |
| D · Historial de errores, R5/AL17 | **Implementado**: `srs_unit_updates`, ventana de 30 días, R5 completa, tope por objetivo, AL17 con los umbrales provisionales de 19.3      |
| E · Trabajos programados          | **Preparados** (exclusión, lotes, reintentos, registro, estado). **Sin programar**: `supabase/pending/learning_jobs_cron.sql`              |
| F · F1–F10                        | Ver §7. F10 sigue bloqueando encender el v2                                                                                                |
| G · Integración general           | Ver §8. Objetivos editoriales integrados donde corresponden; las tablas siguen vacías (no se inventan)                                     |

## 2. Repasos del servidor en la app (A)

### Flujo

```
app (review.tsx, modo «review»)          Edge Function learning-session            base
───────────────────────────────          ─────────────────────────────             ────
sessionId (nuevo o el abierto de hoy) ─▶ start_review ──▶ learning_review_prepare ── ¿cerrada / abierta / nueva?, ¿v2?
                                                           (nueva + v2 encendido: srs_user_lock → migra en línea)
                                         · v2 apagado   → {status: 'srs_v2_disabled'}  (la app juega el repaso v1)
                                         · abierta      → learning_review_content (retomar, con lo ya corregido)
                                         · nueva        → candidates → buildReviewPlan → learning_start_review
                                                          → learning_review_content + persistentUnits (AL17)
cada respuesta ──────────────────────▶ answer_review ──▶ gradeReviewAnswer (shared) → learning_review_answer
  ◀── veredicto, respuesta correcta, explicación (la primera respuesta registrada es la que vale)
al terminar ─────────────────────────▶ submit_review ──▶ gradeReviewAttempts → learning_submit_review_graded
                                                          (exige que coincida con lo registrado: answer_mismatch)
```

### Garantías

- **Feedback sólo del servidor.** En los repasos del servidor el `SessionPlayer` no corrige en el
  dispositivo (`grade`): espera la corrección de `answer_review` («Comprobando…») y muestra su
  veredicto, la respuesta correcta y la explicación. La app no recibe la respuesta antes de responder
  (`learning_review_content` no la incluye; el payload de elección trae las opciones en el orden
  registrado).
- **Sin duplicados.** Una respuesta por presentación: `review_presentation_answers` (PK
  `presentation_id`, inmutable) guarda la primera; un reintento devuelve la misma corrección
  (`duplicate: true`). El envío es idempotente por `session_id` (fase 3) y se rechaza si trae otra
  respuesta para una presentación ya corregida. **Cierre (P4):** un error vuelve al final de la
  sesión hasta 2 veces; cada repetición la corrige el servidor (`attempt_no` 2–3,
  `review_presentation_retries`) pero no es evidencia y no entra en el envío (§10, P4).
- **Sesiones interrumpidas.** La app guarda `{sessionId, startedAt, fecha}` por idioma **y tipo de
  repaso** en el dispositivo cuando el servidor registró el plan; al volver retoma la misma sesión (el
  servidor devuelve lo ya corregido, con las repeticiones, y el reproductor sigue desde ahí). Si se
  puede retomar lo decide el servidor (P7, §10). Una sesión ya enviada (`session_closed`) se descarta
  y empieza otra. Salir del repaso no pierde lo comprobado.
- **Errores recuperables, sin respaldo silencioso.** Si `start_review` falla: estado de error con
  «Reintentar» (mismo `sessionId`). Si `answer_review` falla: la respuesta queda pendiente con
  «Reintentar» (la misma respuesta). Si `submit_review` falla: «No se pudo guardar · Reintentar». Nunca
  se guarda por `submit_learning_session` directo.
- **v2 apagado = modo declarado.** Con el v2 apagado (producción hoy) el servidor responde
  `srs_v2_disabled` y la app juega el repaso de siempre (v1). Es una respuesta explícita del servidor,
  no un respaldo ante un error. Consecuencia: si la función no está desplegada o no responde, no hay
  repaso (estado de error), aunque el v2 esté apagado (ver §9, orden de despliegue).
- **Qué no cambia.** Práctica libre y puntos débiles (no guardan) siguen por la app. Los repasos de
  Plus (inteligente y por tema) **pasaron al servidor** en el cierre (P3, §10).

### La respuesta registrada no es evidencia

`review_presentation_answers` es un bloqueo previo al envío: ni el SRS ni el motor la leen. La
evidencia sigue siendo `exercise_attempt_gradings`, que se escribe sólo en el envío y en la misma
transacción que la sesión. Un repaso abandonado deja presentaciones y respuestas sin sesión, como las
lecciones abandonadas de la fase 2.

## 3. Mastery en la experiencia (B)

`get_learning_mastery(idioma, zona)` (sólo `authenticated`, sólo `auth.uid()`):

- **«Para repasar»**: del SRS v2 si está encendido y el usuario migrado (`user_srs_state.due_at`), si
  no del v1 (`user_word_progress.next_review_at`), **por idioma**. `due_now` = vencidas ahora.
- **Dominio**: sólo si hay una versión activa con `mastery_model_versions.enabled_for_display` (nueva,
  `false`). Si no, `available: false` y la app **no muestra «Dominadas»** (AL12: hasta hoy mostraba la
  etapa del v1 con ese nombre). Cada unidad (concepto, dimensión) está en exactamente un estado:

| Estado         | Definición                                             | Se muestra como          |
| -------------- | ------------------------------------------------------ | ------------------------ |
| `no_evidence`  | Expuesta, `evidence_count = 0`                         | «Sin evidencia»          |
| `insufficient` | Con evidencia, sin suficiencia del motor (P9: sin m/c) | «Evidencia insuficiente» |
| `weak`         | Estimada y débil                                       | «Puntos débiles»         |
| `in_progress`  | Estimada, ni débil ni dominada                         | «En progreso»            |
| `mastered`     | `status = 'mastered'`                                  | «Dominadas»              |

Por unidad curricular: total de unidades de la unidad (conceptos `target` de sus ejercicios
publicados) y `not_seen` (sin ninguna fila del motor), que se distingue de «sin evidencia».

- **Retención** sólo de unidades con retención suficiente; **velocidad** (mediana de `recall_speed`,
  cociente frente al tiempo recomendado) sólo donde se midió. **Puntos para reforzar**: R5 (menor m,
  exposición más vieja), 10 como máximo.

App: `MasteryCard` en las estadísticas del perfil y los mosaicos «Dominadas» / «Para repasar» de
`LearningStats`. El motor sigue sin tocar `S` ni `D`: la lectura es de `user_concept_state`; nada se
escribe.

## 4. Cobertura por tipo de contenido (C)

Catálogo cargado (medido en PGlite con todas las migraciones): **1 107 conceptos, todos léxicos**; las
filas `target` están en **vocabulario (7 680) y producción (1 187)**. No hay conceptos de gramática ni
de comprensión.

| Tipo                      | Estado                                                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vocabulario (R, G, L)     | Como en la fase 3; ahora también los ítems de producción de un concepto entran en su escalón L                                                                                  |
| Producción (P)            | **Nuevo.** Ítems `controlled_production` (`translate_write`, `short_answer`), `normalized_text.v1`, de **un único concepto** (marcado en vocabulario y producción): 38 en total |
| Producción libre (F)      | **Pendiente.** `free_production` no tiene corrección automática (shared/grading.ts la bloquea); no se inventa una                                                               |
| Gramática / comprensión   | **Sin contenido**: el catálogo no tiene esos conceptos. La vía ya filtra por tipo de concepto y no por dimensión, así que un concepto léxico en comprensión entraría solo       |
| Ítems de varios conceptos | **Pendiente.** La RPC de repasos registra una palabra por intento; un ítem de varios conceptos necesita `record_learning_session` (arquitectura, fase 3)                        |
| Conceptos no léxicos      | **Pendiente.** Mismo motivo: no tienen palabra                                                                                                                                  |

Regla de la vía (sin cambiar `polygo.answers.v1` ni las presentaciones): concepto léxico activo con
palabra publicada, ítem activo con versión vigente, **un único concepto `target`** (antes: una única
fila), corrección `exact_option.v1` / `normalized_text.v1`, escalón definido y, si es de elección, un
único conjunto del catálogo. Un ítem de producción actualiza las dos unidades del concepto (vocabulario
L y producción P), igual que en una lección, y la palabra en el v1.

**Interfaz para lo no determinista** (no implementada, sin inventar corrección): un corrector propio
(`grader` / `grader_version` distintos) que escriba `exercise_attempt_gradings` con el mismo contrato;
hoy `status` sólo admite `valid` / `invalid_response`, así que un estado «pendiente de corrección» y su
efecto en el SRS (no aplicar hasta corregir) son decisiones de diseño abiertas (P8).

Corrección de la fase 3 encontrada: `learning_start_review` unía los candidatos por ítem y concepto; con
un ítem candidato en dos dimensiones registraba dos presentaciones. Ahora une también por dimensión.

## 5. Historial de errores por unidad, R5 y AL17 (D)

- **`srs_unit_updates`** (inmutable, sin acceso para la app): una fila por unidad actualizada por
  `srs_v2_apply_session` (la vía única, también en `replay` y `repair`), con `seq`, `t_srs` (hora del
  SRS; en las históricas, su `completed_at`), `informative` (subió `n`) y `full_error` (subió λ:
  `z⁻ ≥ 0,5`, 5.4). `lapses_after` = λ del estado. Se escribe en la misma transacción que el estado.
- **Ventana de 30 días**: `srs_unit_full_errors(usuario, concepto, dimensión, ahora)`, `(ahora − 30 d,
ahora]`. Integridad: `errors_window_complete = false` para una unidad **convertida** (15.3,
  conversión B: no tiene sesiones) si el corte fue hace menos de 30 días; esas no se marcan
  persistentes. Usuarios sin historial: cuentan 0 (no hay errores que contar), lo que equivale a la
  regla de respaldo por `D`.
- **R5** (planner-2.1.0): respaldo sin motor `D ≥ 6,85` **o ≥ 2 errores plenos en 30 días**; con motor,
  orden por menor `m` y exposición más vieja (las estimadas por el motor antes que las del respaldo);
  **máximo 2 débiles por objetivo `core` activo y sesión**.
- **Un concepto por sesión**: la RPC registra una palabra por intento; antes un concepto con dos
  dimensiones vencidas hacía fallar `learning_start_review`.
- **AL17**: `persistentUnits` = `errors_30d ≥ 4` y `D ≥ 8,2` (19.3, **provisionales**, F9), con
  `intro_lesson_id` = la lección `introduce` de un objetivo del concepto, o la primera lección
  publicada que lo usa. La app ofrece «Ver la explicación» (pantalla nueva `lesson-intro/[id]`, sólo
  lectura: muestra `lessons.intro`, que hasta ahora no se mostraba en ninguna pantalla; no gasta
  energía). No cambia el plan.
- `srs_applied_sessions.planner_version` registra ahora la versión real del plan (antes, fija
  `planner-2.0.0`).

## 6. Trabajos programables (E)

Migración `20261110130000_learning_jobs.sql` (sin programar nada):

| Trabajo          | Llamada                                  | Interruptor                        | Lote / reintentos                                                           |
| ---------------- | ---------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------- |
| `mastery_queue`  | `learning_run_job('mastery_queue', 500)` | ninguno (sólo estima)              | por unidad con punto de recuperación; 5 intentos (`attempts`, `last_error`) |
| `me_hint`        | `learning_run_job('me_hint', 500)`       | versión con `enabled_for_adaptive` | `srs_apply_me_hint` (`skip locked`, guarda I4)                              |
| `srs_migrations` | `call srs_v2_process_migrations(50)`     | v2 encendido                       | un usuario por transacción (COMMIT); espera 5·2ⁿ min; 5 intentos            |
| `srs_repair`     | `learning_run_job('srs_repair', 1)`      | v2 encendido                       | barrido completo; debe dar 0                                                |
| `retention`      | `learning_run_job('retention', 5000)`    | ninguno (sólo registros operativos) | P6: `learning_job_runs` > 90 días (180 los fallidos), conserva el último    |

- **Exclusión**: `pg_try_advisory_xact_lock` por trabajo (o de sesión en el procedimiento); una
  ejecución simultánea queda `skipped / already_running`. Probado con dos conexiones reales (J1, J2).
- **Registro**: `learning_job_runs` (estado, motivo, procesados, fallidos, pendientes, error);
  `learning_jobs_status()` da colas, reintentos, abandonados y la última ejecución de cada trabajo.
- **Recuperación**: un fallo del trabajo entero se registra como `failed` sin propagar; una unidad o un
  usuario que falla no deshace el lote. El procedimiento no puede ser `security definer` ni llevar
  `set search_path` (PostgreSQL no lo permite con COMMIT): todo está calificado y sólo lo ejecutan
  `postgres` y `service_role`.
- **Programación**: `supabase/pending/learning_jobs_cron.sql` (fuera de `migrations/`), con
  frecuencias propuestas y cómo deshacerlo. **Requiere autorización expresa.**

## 7. Decisiones F1–F10 (19.4 de la rev. 4.2)

| #   | Estado tras la fase 4                                                                                                                                                                     | Tipo                         |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| F1  | FSRS-4.5 implementado; cambiar de núcleo exige ≥ 20 000 repasos de ≥ 200 usuarios. Sin cambios                                                                                            | Provisional · espera datos   |
| F2  | `srs-2.0.0-w-initial` activos; sin ajuste                                                                                                                                                 | Provisional · espera datos   |
| F3  | `r` 0,85, `I_max` 45                                                                                                                                                                      | Provisional · espera A/B     |
| F4  | Plaza semanal y escalera provisionales                                                                                                                                                    | Provisional · espera A/B     |
| F5  | AL19 implementada (19.3)                                                                                                                                                                  | Provisional · espera A/B     |
| F6  | Ritmo 7,5 con contracción por usuario                                                                                                                                                     | Provisional · espera datos   |
| F7  | Sólo recomendación, reserva 0 % con deuda; no bloquea lecciones                                                                                                                           | Decisión de producto abierta |
| F8  | Reanclaje de `S` (AL4-b) no implementado                                                                                                                                                  | Espera motor activo + datos  |
| F9  | **AL17 implementada** con los umbrales provisionales de 19.3 (λ ≥ 4 en 30 días, D ≥ 8,2) y su interfaz; ya no la bloquean ni el historial ni la interfaz. La calibración sigue atada a F2 | Provisional · espera F2      |
| F10 | **Sin resolver.** Ninguna verificación nueva; la confirmación legal es de un tercero                                                                                                      | **Bloqueo externo**          |

Ninguna decisión aprobada se cambió para simplificar. Con F10 abierta **no se debe encender el v2**.

## 8. Integración general (G)

| Pieza                 | Cómo queda                                                                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Catálogo y versiones  | Repasos con ítems del catálogo, versión vigente, conjunto y orden registrados (fase 1–3, sin cambios)                                                     |
| Objetivos editoriales | `objective_concepts` (core) → tope de R5; `lesson_objectives` (introduce) → lección de AL17. **Tablas vacías**: no se generaron objetivos ni asignaciones |
| Lecciones             | Sin cambios (fase 2). Su explicación ahora es visible desde AL17                                                                                          |
| Corrección            | Una sola regla (`gradeOne`) para lecciones, repasos y cada respuesta de un repaso                                                                         |
| Evidencias            | `exercise_attempt_gradings` sólo al enviar; nada nuevo es evidencia                                                                                       |
| SRS                   | v2 por la vía única; historial por unidad en la misma transacción; v1 sin cambios                                                                         |
| Mastery               | Lee correcciones; la app lo ve con `get_learning_mastery`; nunca escribe `S`/`D`                                                                          |
| Adaptive              | planner-2.1.0 en la Edge Function                                                                                                                         |
| Progreso del usuario  | «Dominadas» del motor, «Para repasar» del SRS vigente, progreso por unidad del motor                                                                      |

## 9. Producción (requiere autorización expresa; nada hecho)

Orden necesario (la build nueva depende de los pasos 1–2):

1. Aplicar `20261110120000_learning_phase4.sql`, `20261110130000_learning_jobs.sql` y
   `20261110140000_learning_phase4_close.sql`, en ese orden (aditivas; con todo apagado no cambian
   comportamiento salvo que `srs_v2_apply_session` también escribe historial cuando el v2 esté
   encendido). La tercera define un `DELETE` dentro de `learning_retention_sweep`: el MCP de Supabase
   la rechaza; se aplica por la Management API (como las anteriores grandes).
2. Desplegar `learning-session` (acciones nuevas; las de lecciones no cambian).
3. Regenerar `src/lib/database.generated.ts` (hoy se llama `get_learning_mastery` con un cast).
4. Build de tiendas (con las variables `EXPO_PUBLIC_*` de EAS, pendiente desde la fase 2). **Una build
   nueva antes del paso 2 deja la pantalla de repaso y los repasos Plus en error** (no hay respaldo
   silencioso). Las builds publicadas siguen funcionando con el servidor nuevo (sus repasos Plus van
   por la ruta vieja, que no se tocó).
5. Programar los trabajos (`supabase/pending/learning_jobs_cron.sql`).
6. Encender el v2 = corte 15.3 (bloqueado por F10; repetir el inventario).
7. Habilitar el motor para mostrarse (`enabled_for_display`) y para Adaptive (`enabled_for_adaptive`),
   después de que la cola haya calculado los estados.

## 10. Decisiones de producto P1–P9 (cerradas)

| #   | Decisión                                                                     | Estado                                       |
| --- | ---------------------------------------------------------------------------- | -------------------------------------------- |
| P1  | Motores apagados; activar exige una decisión posterior explícita             | **Configurado** (nada encendido)             |
| P2  | Sin «Dominadas» del SRS v1; sólo el conteo del motor cuando esté habilitado | **Implementado**                             |
| P3  | Repasos Plus por el servidor (presentación, corrección y envío)              | **Implementado**                             |
| P4  | Repetición controlada de errores, fuera de la evidencia                      | **Implementado**                             |
| P5  | Sin respaldo silencioso; modo v1 sólo declarado por el servidor              | **Configurado** (como estaba)                |
| P6  | Retención sólo de registros operativos; el aprendizaje se conserva           | **Implementado** (trabajo sin programar)     |
| P7  | Retomar el mismo día local de la zona registrada al iniciar                  | **Implementado**                             |
| P8  | Producción libre: especificación determinista + futura, sin activar          | **Especificado** (`FREE_PRODUCTION_GRADING_SPEC.md`) |
| P9  | Flujo editorial para contenido real; nada inventado                          | **Especificado** (`EDITORIAL_CONTENT_PIPELINE.md`)   |

### P1 — Activación de Mastery y Adaptive

- `srs_v2_settings.enabled = false`, `mastery_model_versions.enabled_for_display = false` y
  `enabled_for_adaptive = false`. Ninguna migración ni prueba los deja encendidos (la prueba P2 los
  comprueba al terminar).
- Preparado: los tres interruptores tienen su efecto implementado y probado (repasos del v2,
  `get_learning_mastery` y perfil público, R1/R5 con motor). Encender cada uno es un `update` de una
  fila, y el orden está en §9 (pasos 6 y 7).
- **SRS v2 no se enciende mientras F10 no tenga resolución legal documentada.** Encender cualquiera
  de los tres requiere una decisión posterior explícita y autorización para producción.

### P2 — «Dominadas» en los perfiles

- Perfil público (`player/[id]`): `get_public_profile` agrega `learning.concepts_mastered` =
  `mastery_display_count(usuario, idioma objetivo)`: unidades con evidencia y `status = 'mastered'` de
  la versión activa con `enabled_for_display` — **la misma definición** que «Dominadas» del perfil
  propio (`get_learning_mastery`). Sin motor habilitado es `null` y la app **no muestra el mosaico**.
- `words_mastered` (SRS v1) sigue en la respuesta sólo para las builds publicadas (que lo muestran
  hasta que se actualicen); la app nueva no lo lee.
- Perfil propio (`LearningStats`): ya era así desde la fase 4. Pestaña Repaso (`practice.tsx`): el
  mosaico «Dominadas» del v1 se reemplazó: con el motor habilitado muestra su conteo; si no,
  «Para repasar» (v1).
- El logro «Memoria de elefante» («Dominá N palabras con repasos espaciados») sigue con su métrica
  del v1: es un logro del SRS, lo dice su texto, y cambiarlo alteraría recompensas ya ganadas.

### P3 — Repasos Plus por el servidor

- `start_review` acepta `focus: {kind: 'smart'} | {kind: 'topic', unit_id}`. El servidor:
  1. comprueba Plus (`has_plus`, en `learning_focus_candidates` y otra vez en
     `learning_start_focus_review`: `plus_required`);
  2. elige las palabras con **las mismas reglas** de siempre, ahora en `shared/focusReview.ts`
     (la app las importa para contar lo disponible; el servidor las usa para armar);
  3. elige para cada palabra un ítem del catálogo presentable (`review_item_candidates`, dimensión
     vocabulario): el presentado hace más tiempo, desempate determinista por sesión. Sin elegir por
     dificultad;
  4. registra plan (`srs_session_plans.source = 'focus_review'`, `focus`) y presentaciones con versión,
     conjunto y orden de opciones; valida cada entrada (ítem presentable, palabra estudiada por el
     usuario, de la unidad en el repaso por tema, motivo del foco).
- Corrección y envío: los de cualquier repaso del servidor (`answer_review`, `submit_review` →
  `submit_learning_session('review')`). El SRS v1 recibe lo mismo que antes; con el v2 encendido va
  por la vía única con origen `focus_review` (ya existente, mismas reglas: AL11). El cliente no decide
  ningún veredicto.
- Reglas comerciales sin cambios: 15 palabras por sesión, mismas reglas de selección, sin energía,
  sin límite diario nuevo. **Sin ventaja competitiva:** Ranked no se toca y un repaso Plus no cambia
  parámetros del SRS. Además, un repaso Plus ya no cuenta como «primer repaso del día» del armador
  adaptativo (AL8): no consume su sondeo diario (`learning_review_candidates`, único cambio).
- Diferencia con la app vieja: una palabra **sin ítem presentable en el catálogo** no entra (antes el
  dispositivo armaba un ejercicio con cualquier palabra y lo corregía). El contador de la pestaña Repaso
  sigue contando con las reglas sobre todas las palabras; el repaso puede ser algo más corto.
- Las builds publicadas siguen con la ruta vieja (`submit_learning_session` con veredicto del cliente):
  cerrarla rompe esas builds (ver «Bloqueos»).

### P4 — Repetición de errores dentro de la sesión

- Un error (primer intento incorrecto o inválido) vuelve al final de la cola **hasta 2 veces**
  (`MAX_RETRIES` del reproductor = `MAX_REVIEW_ATTEMPTS − 1` del servidor, comprobado por una prueba).
  Una repetición sólo se admite si el intento anterior también falló; no hay ciclos (tope fijo).
- El servidor corrige cada repetición con la misma regla (`gradeReviewAnswer(…, attempt_no)`) y la
  registra en `review_presentation_retries` (PK `presentation_id, attempt_no`, inmutable, idempotente:
  un reintento de red devuelve la misma corrección).
- **No es evidencia:** el envío lleva sólo los primeros intentos (una corrección por presentación en
  `exercise_attempt_gradings`, siempre `attempt_no = 1`); las repeticiones no generan
  `exercise_attempts`, ni las leen el SRS ni el motor. La precisión de la sesión es la del primer
  intento. Se eligió esto porque la RPC de repasos (sin cambios) exige primeros intentos y una palabra
  distinta por intento: registrar las repeticiones como intentos duplicaría la palabra.
- Retomar: `learning_review_content` trae las repeticiones; el reproductor vuelve a poner al final las
  presentaciones falladas con repeticiones disponibles.

### P5 — Disponibilidad del servidor

Sin cambios: sin respaldo silencioso a corrección local, errores recuperables con «Reintentar» (inicio,
cada respuesta y envío, todo idempotente por `session_id` / presentación / intento), nada registrado
se pierde ni se duplica. Con el v2 apagado el servidor **declara** `srs_v2_disabled` y la app juega el
repaso v1: es una respuesta explícita, no un respaldo ante un error. Los repasos Plus no tienen modo
v1: siempre van por el servidor (con el v2 apagado también).

### P6 — Retención de datos

| Dato                                                                              | Clase                 | Retención                                                          |
| --------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------ |
| `learning_job_runs`                                                               | Operativo             | 90 días (fallidos 180); siempre la última ejecución de cada trabajo |
| `exercise_attempts`, `exercise_attempt_gradings`, `exercise_attempt_presentations` | Evidencia             | Se conservan (hasta borrar la cuenta)                              |
| `exercise_presentations`, `srs_session_plans`                                     | Auditoría / rotación  | Se conservan (la rotación de ítems usa `presented_at`)             |
| `review_presentation_answers`, `review_presentation_retries` (también abandonadas) | Registro de corrección | Se conservan                                                       |
| `srs_unit_updates`, `srs_applied_sessions`, `user_srs_state`, `user_concept_state` | SRS / motor           | Se conservan                                                       |
| Colas (`knowledge_recompute_queue`, `srs_hint_queue`, `srs_migration_queue`)      | Operativo acotado     | Sin borrado: una fila por unidad o usuario, se reutiliza por clave |

- `learning_retention_sweep(límite)` borra sólo `learning_job_runs`, por lotes, idempotente; trabajo
  `learning_run_job('retention', 5000)`, programación propuesta semanal en
  `supabase/pending/learning_jobs_cron.sql` (**sin programar**).
- Sesiones de repaso no enviadas: no se borran. Una sesión **abandonada** (vencida e incompleta) queda
  como registro de lo presentado y corregido, sin ser evidencia. `learning_jobs_status().review_sessions`
  cuenta abiertas, vencidas completas sin enviar y abandonadas.
- Integridad: el sweep sólo borra de `learning_job_runs`, que ninguna tabla referencia. Las tablas
  nuevas de respuestas y repeticiones se borran con la cuenta (`on delete cascade` desde `profiles`).

### P7 — Reanudación de sesiones

- **Criterio temporal:** una sesión se puede retomar mientras sea el **mismo día local en la zona
  horaria registrada al iniciarla** (`srs_session_plans.time_zone` / `local_date`) y no haya vencido el
  plan (90 días). La zona del dispositivo de ahora no cuenta: viajar o cambiar la zona no adelanta ni
  atrasa el vencimiento. Planes sin zona (anteriores): UTC y el día de creación.
- `learning_review_prepare` devuelve `open` / `expired` / `closed` / `new`, el origen y si está
  completa. Una sesión `expired` **no admite respuestas nuevas** (`session_expired`), pero un
  reintento de una respuesta ya registrada devuelve lo mismo.
- La app ya no filtra por su fecha: le pregunta al servidor con el `session_id` guardado. Vencida y
  **completa** (respuestas corregidas a tiempo, envío fallido) → la envía y empieza otra (no se pierde
  evidencia). Vencida e **incompleta** → empieza otra (lo respondido queda registrado, no es evidencia).
  Si pasa la medianoche durante el repaso, la respuesta siguiente recibe `session_expired` y la pantalla
  vuelve a preguntar por la sesión.
- El envío de una sesión vencida no se rechaza: sus correcciones se hicieron a tiempo en el servidor.

### P8 — Corrección de producción libre

No se implementa ninguna corrección automática. Especificación en `FREE_PRODUCTION_GRADING_SPEC.md`:
modo determinista `constrained_text.v1` (alternativas por patrones, Unicode/acentos, variantes
regionales, formas cerradas de lemas, tipeo por ficha, crédito parcial sin efecto en el SRS, criterios
de aceptación por ítem), estado `pending_review` sin efecto en el SRS hasta resolverse, y la evaluación
por rúbrica / IA separada, asíncrona y no autorizada.

### P9 — Contenido editorial

Sin contenido inventado. `EDITORIAL_CONTENT_PIPELINE.md`: qué está construido e integrado (objetivos →
R5 y AL17; conceptos y dimensiones; ítems; corrección), el flujo propuesta → validación → revisión →
generación → prueba → producción, los requisitos por tipo (objetivos, gramática, comprensión,
producción) y el pendiente técnico de los repasos para ítems de varios conceptos o no léxicos.

### Bloqueos que siguen abiertos

- **F10** (legal, externo): bloquea encender el SRS v2.
- **Ruta vieja de repasos**: las builds publicadas siguen enviando repasos con veredicto del cliente por
  `submit_learning_session`. Cerrarla (revocar o exigir presentaciones) rompe esas builds: decisión
  de producto cuando la build nueva tenga adopción suficiente.
- **Variables `EXPO_PUBLIC_*` en EAS production** (desde la fase 2): bloquean la build de tiendas.
- ~~`record_learning_session`~~ **implementado en la fase 5** (`LEARNING_PHASE5.md`): sin él no había repasos de ítems de varios conceptos
  ni de conceptos no léxicos.
- Contenido editorial (P9) y revisión nativa (it/pt/zh).

## 11. Archivos

**Nuevos:** `supabase/migrations/20261110120000_learning_phase4.sql`,
`supabase/migrations/20261110130000_learning_jobs.sql`, `supabase/pending/learning_jobs_cron.sql`,
`supabase/tests/phase4.test.mjs`, `supabase/tests/jobs.test.mjs`, `src/features/learning/serverReview.ts`,
`src/features/learning/components/MasteryCard.tsx`, `src/app/lesson-intro/[id].tsx`,
`src/features/learning/__tests__/serverReview.test.ts`, este documento.

**Cierre (nuevos):** `supabase/migrations/20261110140000_learning_phase4_close.sql`,
`shared/focusReview.ts`, `supabase/functions/learning-session/focus.generated.js`,
`supabase/tests/phase4close.test.mjs`, `shared/__tests__/focusReview.test.ts`,
`docs/FREE_PRODUCTION_GRADING_SPEC.md`, `docs/EDITORIAL_CONTENT_PIPELINE.md`.
**Cierre (modificados):** `shared/learningSession.ts` (`MAX_REVIEW_ATTEMPTS`, `attempt_no`),
`supabase/functions/learning-session/index.ts` (+ `core.generated.js`), `scripts/build-functions.ts`,
`supabase/migrations/20261110130000_learning_jobs.sql` (sólo el CHECK de `job`, sin aplicar),
`supabase/pending/learning_jobs_cron.sql`, `src/app/review.tsx`, `src/app/(tabs)/practice.tsx`,
`src/app/player/[id].tsx`, `src/features/learning/{api,hooks,player,serverReview}.ts`,
`components/SessionPlayer.tsx`, `src/features/plus/{smartReview,topicReview}.ts` (reexportan
`shared/focusReview.ts`), `src/features/profile/api.ts`, `src/features/learning/__tests__/serverReview.test.ts`.

**Modificados:** `shared/adaptivePlanner.ts` (planner-2.1.0), `shared/learningSession.ts`
(`gradeReviewAnswer`), `supabase/functions/learning-session/index.ts` (+ `core.generated.js`,
`planner.generated.js` regenerados), `src/app/review.tsx`, `src/app/_layout.tsx`,
`src/features/learning/api.ts`, `hooks.ts`, `player.ts`, `components/SessionPlayer.tsx`,
`components/SessionResults.tsx`, `components/LearningStats.tsx`, `shared/__tests__/adaptivePlanner.test.ts`,
`supabase/tests/review.test.mjs`, `supabase/tests/pg17/srs2-concurrency.mjs`.

## 12. Pruebas

Ver el informe de la fase en la conversación para los resultados de cada ejecución; resumen al cierre en
la tabla siguiente.

| Suite                                      | Qué cubre                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `supabase/tests/phase4.test.mjs` (7)       | modo `srs_v2_disabled` sin escrituras; migración en línea; contenido sin respuesta; retomar; primera respuesta vale; `answer_mismatch`; sesión cerrada/ajena; historial y ventana de 30 días; producción de punta a punta; `get_learning_mastery` (interruptor, estados exclusivos, propios, anon); versión del armador |
| `supabase/tests/jobs.test.mjs` (3)         | interruptores, permisos, lote con unidad envenenada y 5 intentos, migración con falla inyectada, espera y abandono, estado, barrido                                                                                                                                                                                     |
| `pg17/srs2-concurrency.mjs` J1, J2         | exclusión real entre dos conexiones (función y procedimiento con COMMIT)                                                                                                                                                                                                                                                |
| `shared/__tests__/adaptivePlanner.test.ts` | +6: versión, R5 con errores, tope por objetivo, un concepto por sesión, orden de R5 con motor, AL17                                                                                                                                                                                                                     |
| `serverReview.test.ts` (8)                 | ejercicio sin respuesta, payload inválido, veredictos, retomar, envío, sesión abierta por idioma y tipo (vigencia del servidor), P4: repeticiones en el reproductor y al retomar                                                                                                                                         |
| `phase4close.test.mjs` (7)                 | P3: Plus exigido en el servidor, plan, presentación, corrección y envío; validación del plan; AL8 sin consumir. P4: repeticiones acotadas, idempotentes, inmutables, fuera de la evidencia. P7: vencimiento por la zona del plan, sin respuestas nuevas, envío de una completa. P6: retención. P2: perfil público; P1 |
| `shared/__tests__/focusReview.test.ts` (5) | reglas de selección, palabras sin ítem, por tema, elección del ítem, pedido de foco                                                                                                                                                                                                                                    |

**No probado:** la Edge Function en Deno (se reproduce su lógica con las mismas funciones SQL y el mismo
núcleo TS), la pantalla en un dispositivo, y nada contra producción.
