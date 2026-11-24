# Fase 2 — Presentación, corrección en el servidor y registro de intentos

Estado (2026-11-08): implementada y probada en local (PGlite + Jest). **No aplicada en producción**:
falta autorización para la migración, el despliegue de la Edge Function y la actualización de la app
(§6).

## 1. Puntos de integración (antes de esta fase)

| Qué                       | Dónde                                                                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Obtener ejercicios        | `fetchLessonContent` (src/features/learning/api.ts) lee `exercises`; repasos: `buildReviewExercises` (review.ts) arma ejercicios en la app desde `words` |
| Presentar                 | `SessionPlayer` → `AnswerInput`                                                                                                                          |
| Mezclar opciones          | `ChoiceInput` con `shuffle(options, "<sesión>:<ejercicio>")`; fichas y parejas también, en la app                                                        |
| Corregir                  | `checkAnswer` en `SessionPlayer.handleSubmit` (sólo en el cliente)                                                                                       |
| Enviar / guardar intentos | `submitLearningSession` → RPC `submit_learning_session`, que confía en `correct` del cliente                                                             |
| Finalizar sesión          | La misma RPC: crea `learning_sessions`, `exercise_attempts`, SRS v1, progreso, energía, logros                                                           |

## 2. Flujo nuevo (lecciones)

1. **Inicio** — la app llama a la Edge Function `learning-session` (`action: 'start'`). Ésta autentica
   con `auth.getUser`, pide el plan (`learning_lesson_plan`: lección publicada y desbloqueada, versión y
   conjunto vigentes de cada ubicación), calcula el orden con `polygo.shuffle.v1` y semilla
   `<sesión>:<ejercicio>` (la misma de antes) y registra todo en una transacción
   (`learning_start_lesson` → `exercise_presentations`). Idempotente por `session_id`: un reintento
   devuelve las mismas filas, nunca recalculadas.
2. **Juego** — la app muestra las opciones **exactamente** en el orden registrado (`options_shown`, que
   sale del conjunto inmutable). Sigue corrigiendo localmente sólo para el feedback inmediato. Si la
   versión leída no coincide con la presentada, o el inicio falla, juega por la ruta vieja.
3. **Envío** — `action: 'submit'` con la respuesta estructurada (`UserAnswer`) de cada intento, su
   `presentation_id`, tiempo, ayudas y el veredicto local (sólo para comparar). La función lee las
   fotografías inmutables (`learning_session_presentations`), corrige con `gradeWithSpec`
   (shared/grading.ts, `polygo.answers.v1`) contra la **versión presentada** y llama a
   `learning_submit_graded`, que en **una transacción**:
   - valida que cada corrección apunte a una presentación de esa cuenta y sesión, de la misma
     ubicación, y que el intento lleve el veredicto y el primer intento de la corrección;
   - llama a `submit_learning_session` **sin modificarla** (única vía del SRS v1, progreso, energía,
     racha y logros), con el veredicto del servidor;
   - vincula cada intento a su presentación (`exercise_attempt_presentations`) y guarda su corrección
     (`exercise_attempt_gradings`).
     Cualquier error (sin energía, lección incompleta, corrección incoherente) revierte todo.
4. **Resultado** — el de siempre más `verdicts` (los del servidor). Un reenvío devuelve lo mismo con
   `duplicate: true`.

Reglas de validación (arquitectura §9): opción que no estaba entre las mostradas, fichas que no son
el multiconjunto del ítem, parejas con lados distintos o repetidos, o tipo de respuesta que no es el
del modo → `invalid_response` (sin veredicto; para el SRS v1 cuenta como incorrecta). Presentación
inexistente o ajena, respuesta mal formada, más de 3 intentos por presentación o un reintento después
de acertar → se rechaza el envío entero (422) sin guardar nada.

## 3. Archivos

| Archivo                                                                                                | Qué                                                                              |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `supabase/migrations/20261108150000_learning_attempt_gradings.sql`                                     | **Nueva.** Tabla, índice y funciones (§4)                                        |
| `shared/learningSession.ts`                                                                            | Núcleo puro: órdenes, validación y corrección de una lección                     |
| `scripts/build-functions.ts`, `npm run functions:build`                                                | Empaqueta el núcleo para Deno (los imports de `shared/` no llevan extensión)     |
| `supabase/functions/learning-session/index.ts`, `core.generated.js`                                    | Edge Function y paquete generado (una prueba exige que esté al día)              |
| `src/features/learning/api.ts`, `hooks.ts`                                                             | `startLessonPresentation`, `useLessonPresentation`, envío corregido              |
| `src/app/lesson/[id].tsx`                                                                              | Inicio, comprobación de versiones, intentos con respuesta estructurada, respaldo |
| `src/features/learning/player.ts`, `SessionPlayer.tsx`, `AnswerInput.tsx`                              | Guarda `UserAnswer` y ayudas; muestra las opciones registradas                   |
| `supabase/tests/attempts.test.mjs`, `shared/__tests__/learningSession.test.ts`, `AnswerInput.test.tsx` | Pruebas                                                                          |
| `.prettierignore`, `package.json`                                                                      | Ignorar el paquete generado; script nuevo                                        |

## 4. Migración 20261108150000 (aditiva, sin DROP ni DELETE)

- Ninguna restricción nueva sobre tablas existentes: la idempotencia del inicio y que una sesión sea de
  una sola cuenta las garantiza `learning_start_lesson` (bloqueo consultivo por sesión).
- Tabla `exercise_attempt_gradings` (PK `attempt_id`): presentación, cuenta, sesión, ítem, versión,
  modo, entrada, número de intento, respuesta (`UserAnswer`, ≤ 4 KB), opción elegida (índice en el
  conjunto), estado, veredicto, veredicto del cliente, ayudas (`ref_assists`), corrector y versión.
  Inmutable (sin UPDATE; DELETE sólo en cascada). Un trigger exige coherencia con el intento, la
  presentación, la versión, el vínculo y lo que quedó en `exercise_attempts`. RLS sin políticas.
- Funciones `learning_lesson_plan`, `learning_start_lesson`, `learning_session_presentations`,
  `learning_submit_graded` (+ dos auxiliares): sólo `service_role`.
- No toca `exercise_attempts`, `submit_learning_session`, `apply_word_result`, `user_word_progress`,
  Ranked ni versiones. Para llamar a `submit_learning_session` sin cambiarla, `learning_submit_graded`
  fija los claims del JWT al usuario ya autenticado sólo dentro de su transacción y los restaura.

## 5. Bloqueos y decisiones que te corresponden

1. **SRS v1 recibe el veredicto del servidor en la ruta nueva.** La función y su entrada no cambian;
   cambia de quién sale `correct` (antes, del cliente). Para un cliente honesto es el mismo veredicto
   (mismo código). Si preferís que el SRS v1 siga con el veredicto del cliente durante esta fase, es
   un cambio de una línea en `learning_submit_graded`/núcleo. **Confirmá cuál querés.**
2. **Repasos: siguen por la ruta vieja (`client_reported`).** Los arma la app desde `words`, con
   distractores elegidos en el cliente, y su contenido no es el de ninguna versión del catálogo (p. ej.
   «Escribí en inglés» y 20 s contra «Traducí al inglés» y 30 s de `en.gen.translate_write.*`).
   Presentarlos exigiría inventar una correspondencia. Hace falta decidir: generar los repasos en el
   servidor (fase 3 de la arquitectura, `client_proposed` + conjuntos `session`) y con qué ítems.
3. **Orden de fichas (`order_words`) y columnas de `match_pairs` no se registran.** El esquema aprobado
   (V5) sólo guarda orden para conjuntos de opciones (`option_order` exige `option_set_id`). La app las
   sigue mezclando localmente. Necesita una decisión de esquema.
4. **Ayudas:** sólo se registra `reading_visible` (chino). `audio_replays`, `slow_audio_plays` y
   `prompt_audio_plays` requieren instrumentar `SpeakButton`; `hints_revealed` no existe en la app.
   El veredicto del cliente llega como `correct`/`incorrect` (la app no distingue `typo` en el intento).
5. **Diferencia con la arquitectura rev. 8.** Su «fase 2» (§18) es `answer_events`/`answer_gradings`/
   `concept_evidence` y la reescritura de recompensas; esta fase siguió tu pedido (presentaciones +
   `exercise_attempts`). `exercise_attempt_gradings` es el registro de corrección de ahora; pasar a
   `answer_gradings` después es una copia por `attempt_id` (`legacy_attempt_id`). No se crearon
   sesiones abandonadas ni `invalid_plan`, así que el orden obligatorio de §18 no se rompe.
6. `presented_at` es la hora del inicio (plan entregado al dispositivo), no la de cada pantalla.
7. No probado en Deno ni contra un proyecto real (no hay Deno ni Docker locales): el manejador es
   delgado y el núcleo y las funciones SQL están probados. La concurrencia se resuelve con un bloqueo
   consultivo por sesión más el `on conflict` de la RPC vieja; PGlite no permite probar dos conexiones.
8. `src/lib/database.generated.ts` no tiene las columnas de la fase 1 (sin regenerar).

## 6. Pasos para producción (requieren tu autorización)

1. Aplicar `20261108150000_learning_attempt_gradings.sql` (una transacción, con su fila en
   `supabase_migrations.schema_migrations`).
2. Desplegar la función: `npx supabase functions deploy learning-session --no-verify-jwt`.
3. Publicar la app (sólo JS: `eas update`). Mientras la función no exista, la app juega por la ruta
   vieja sin cambios visibles.

## 7. Estado en producción y validación de un ciclo real

**Aplicado el 2026-11-08:** la migración 20261108150000 (verificada: RLS sin políticas, triggers,
funciones sólo `service_role`, `submit_learning_session` sin cambios) y la Edge Function
`learning-session` (responde 401 sin token). La app con la integración llega en la próxima build de
las tiendas (no hay `expo-updates`, por decisión no se configura OTA).

**Comportamiento de la app (probado en `learningSessionApi.test.ts`):**

- Lección: `start` con tiempo límite de 10 s y sin reintento. Si falla, vence, o las presentaciones no
  cubren exactamente los ejercicios cargados con la misma versión → se juega y guarda por la ruta vieja.
- Envío corregido con tiempo límite de 20 s. Si falla por red, tiempo, función caída o un rechazo del
  corrector → respaldo automático por `submit_learning_session` con el mismo `session_id` (si el envío
  corregido sí se había guardado, la RPC vieja devuelve `duplicate`). Sin respaldo, porque la ruta vieja
  daría lo mismo o no corresponde: `no_energy`, `not_authenticated`/`unauthorized`, `lesson_locked`,
  `lesson_not_found`, `session_conflict`, `incomplete_lesson`, `invalid_started_at`.
- Repasos: siempre la ruta vieja; nunca llaman a la función.

**Prueba automática contra producción** (cuenta autorizada; escribe una sesión real: gasta 1 de energía
sin Plus, suma progreso y actualiza el SRS de esa cuenta):

```bash
POLYGO_E2E_EMAIL=… POLYGO_E2E_PASSWORD=… [POLYGO_E2E_LESSON=a1-u01-l01] \
  npx tsx --env-file=.env scripts/e2e-learning-session.ts --confirm
```

Comprueba: 401 sin token; una presentación por ejercicio con su versión vigente; orden
`polygo.shuffle.v1`; `start` idempotente; presentación de otra sesión → 422 sin escribir; veredicto del
servidor (una respuesta mala que el cliente declara `correct` queda `incorrect`); número de intento;
`first_try_correct`; reenvío → `duplicate` con los mismos veredictos; `start` después de enviar → 409.
Imprime el `session_id`.

**Verificación en la base (sólo lectura)** con ese `session_id`:

```sql
select a.id, a.exercise_id, a.is_correct, a.is_first_try, g.attempt_no, g.status, g.verdict,
       g.client_verdict, g.item_version_id, p.option_order, r.status as reconstruction
from public.exercise_attempts a
join public.exercise_attempt_gradings g on g.attempt_id = a.id
join public.exercise_presentations p on p.id = g.presentation_id
join public.exercise_attempt_reconstruction r on r.attempt_id = a.id
where a.session_id = '<session_id>' order by a.id;
-- Esperado: una fila por intento, is_correct = (verdict in correct/typo), todas reconstructible.
select count(*) from public.exercise_attempts a
left join public.exercise_attempt_gradings g on g.attempt_id = a.id
where a.session_id = '<session_id>' and g.attempt_id is null;   -- 0
```

**Prueba manual en la build** (misma cuenta):

1. Una lección completa con un error a propósito → resultados y guardado normales; la SQL de arriba
   muestra la sesión con correcciones.
2. Un repaso → se guarda; la sesión **no** tiene filas en `exercise_attempt_gradings` (ruta vieja).
3. Modo avión al abrir una lección → la lección carga tras el tiempo límite o el error, se juega por
   la ruta vieja y se guarda al volver la conexión (botón Reintentar).
4. Chino: responder con el pinyin visible → `assists = {"reading_visible": true}`.

## 8. Requisitos de la próxima build

- **Sin cambios nativos**: no hay dependencias nuevas; `app.json` y `eas.json` no cambiaron. La
  integración es sólo JS y entra en cualquier build nueva.
- **Bloqueante (anterior a esta fase):** no existe ninguna build `preview` ni `production` (todas
  las anteriores son `development`, que lee `.env` desde Metro). `.env` está en `.gitignore`, EAS no lo
  sube, y el entorno `production` de EAS no tiene variables. Una build de tienda saldría sin
  `EXPO_PUBLIC_SUPABASE_URL` ni `EXPO_PUBLIC_SUPABASE_ANON_KEY` (la app no se conectaría) ni
  `EXPO_PUBLIC_BATTLE_SERVER_URL`. Hay que crearlas antes de la build, por ejemplo:
  `npx eas-cli env:create --environment production --name EXPO_PUBLIC_SUPABASE_URL --value … --visibility plaintext`
  (y lo mismo para `preview` si se usa), o agregarlas a `build.production.env` en `eas.json`.
- `expo-doctor`: sólo avisa 13 paquetes de Expo con parches menores atrasados (no bloquea; se
  actualizan con `npx expo install --fix` si se decide).
- Versión `0.1.0`; `appVersionSource: remote` y `autoIncrement` en `production` gestionan los números
  de build. El widget de iOS (`ExpoWidgetsTarget`) ya está configurado.
