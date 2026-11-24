# Test de nivel y nivel inicial por curso (Fase 4)

Estado (2026-11-22): **hecho en local, sin aplicar**. Plan general:
[MULTILINGUAL_ONBOARDING_PLAN.md](MULTILINGUAL_ONBOARDING_PLAN.md). Nada se aplicó en Supabase.

## Flujo

`Tus cursos → «Empezar un curso nuevo» → curso → ¿Por dónde querés empezar?`

1. **Hacer el test de nivel** (`/placement/[code]`): bienvenida (qué se evalúa, reglas, duración) →
   preguntas de a una con barra de progreso, chip «Pregunta n» y chip del nivel que se está probando →
   feedback inmediato (correcto / incorrecto + respuesta correcta; aviso «¡Subís al nivel A2!» al
   superar un nivel) → resultado «Tu nivel estimado es A2» con qué significa, por qué, desde qué unidad
   empieza, aciertos y la aclaración de que es una estimación → **Comenzar curso**. También: «Prefiero
   empezar desde A1» (si el resultado es mayor) y «Hacer el test de nuevo».
2. **Prefiero empezar desde A1** (`/course-start/[code]`): inscribe en A1 y deja el curso activo.

- Salir del test (X, con confirmación; el gesto de volver está desactivado) no guarda nada.
- Si falla el guardado, el resultado queda en pantalla con «Reintentar» (misma elección).
- Un curso con un solo nivel publicado no ofrece el test. Desde 2026-11-23 ninguno: los seis cursos
  (en, fr, it, pt, zh desde español; es desde inglés) tienen banco A1–A2 (docs/RANKED_ALL_COURSES.md).
  En chino, el banco trae el pinyin de sus preguntas (`readings`), porque el test se hace antes de
  tener el banco de palabras del curso.
- Un curso en el que ya está inscripto muestra «Ya estás en este curso» y sólo lo abre.
- Sin el modelo de cursos aplicado (producción hoy), el test aparece como «llega con la próxima
  actualización» y «desde A1» usa el cambio de curso de la Fase 3.

## Banco de preguntas (`content/placement/`)

- **No hay preguntas escritas para el test.** Cada pregunta es un ejercicio de una lección escrita de
  una unidad **publicada** del curso, copiado tal cual (`select.ts`). La selección es determinista y se
  vuelca en `banks.generated.ts` (`npm run content:placement`), que es lo que viaja con la app (no se
  carga el curso entero en el teléfono). `content/__tests__/placement.test.ts` verifica que el archivo
  esté al día y que cada pregunta coincida con su ejercicio de origen (`sourceId`).
- Niveles = los publicados del destino (`shared/languages.ts` `levels`): hoy inglés y francés, A1 y A2.
  Sin B1/B2/C1 publicados, el test no puede asignarlos. Un curso con un solo nivel no tiene banco.
- Inglés: sólo ejercicios de la carga original (id por posición); los agregados después con id propio
  no todos están publicados. Francés: todo el curso se publicó junto.
- Cada nivel se parte en dos **bandas** (primera y segunda mitad de sus unidades); cada banda tiene 3
  preguntas de unidades repartidas de esa mitad (dentro de cada unidad, de sus últimas lecciones).
- **Progresión** (dimensiones por banda):

  | Banda | Preguntas                                            |
  | ----- | ---------------------------------------------------- |
  | A1·1  | vocabulario · gramática · comprensión de frases      |
  | A1·2  | gramática · comprensión de frases · estructura       |
  | A2·1  | comprensión de frases · estructura · uso en contexto |
  | A2·2  | estructura · uso en contexto · gramática             |

  Tipos: vocabulario = `translation_choice`; gramática = `fill_blank` (grammar); frases = `fill_blank`
  (vocabulary); estructura = `order_words` (3–9 fichas); contexto = `context_choice` de lectura si el
  curso lo tiene (francés), si no `short_answer` (inglés). Sin audio ni unir parejas: rápido y sin
  depender de la voz del dispositivo. Las consignas son contenido del curso (idioma de origen); las
  instrucciones del test, de la interfaz.

## Motor (`shared/placement.ts`, puro)

Escalera simple, sin estadística:

- Empieza por la banda más fácil. Una banda se **supera con 2 aciertos** y se **pierde con 2 errores**
  (máximo 3 preguntas por banda).
- Superada → banda siguiente. Perdida → fin. Superadas todas → fin.
- Duración: de 2 a 12 preguntas (curso con A1 y A2). Se corrige con `shared/answers.ts`, igual que
  las lecciones; cuenta sólo la primera respuesta (sin reintentos).
- Reproducible: el resultado depende sólo de la secuencia de aciertos (`replayPlacement`).

### Asignación

Un nivel está **dominado** si se superaron sus dos bandas. Nivel asignado = el primer nivel no
dominado, acotado al último nivel publicado.

| Bandas superadas | Resultado (curso A1–A2)                   |
| ---------------- | ----------------------------------------- |
| 0                | A1                                        |
| 1 (A1·1)         | A1 (ya conoce parte de lo básico)         |
| 2 (A1 dominado)  | A2                                        |
| 3 (y A2·1)       | A2 (y parte de A2)                        |
| 4 (todo)         | A2, el más alto disponible (`topReached`) |

Con más niveles publicados la regla se extiende sola (2 bandas por nivel; probado hasta C1).

**Por qué así**: empezar por lo que todavía no domina; exigir las dos mitades de un nivel para
saltearlo (adivinar 4 de 6 opciones múltiples al azar tiene ~2 % de probabilidad); detenerse en la
primera banda perdida para no seguir con preguntas más difíciles; nunca afirmar más que la evidencia
ni más que el contenido publicado.

## Persistencia (`20261224120000_course_placement.sql`, sin aplicar)

- `user_courses` ya tenía `placement_level` y `placement_completed_at` (Fase 2). Se agregan
  `placement_correct`, `placement_total` y `placement_version` (`placement-v1`), con CHECK.
- `start_course(course, start_level, placement…)`: una transacción. Curso nuevo → crea la inscripción
  con nivel y resultado y lo activa (los triggers de la Fase 2 sincronizan `target_language` y
  `start_level`). Curso ya inscripto → no cambia nivel, resultado ni progreso; lo activa y devuelve
  `created: false` (la app avisa). Valida disponibilidad, niveles publicados (`level_unavailable`,
  `placement_level_unavailable`) y que el inicial no supere al del test (`placement_invalid`). Crea el
  ELO del idioma si tiene Ranked, como `set_active_course`.
- Nunca toca XP (`player_xp`, `xp_events`), lecciones, intentos, SRS, logros ni otros cursos.
- Nada se escribe antes de confirmar el resultado: un test abandonado no deja nivel.
- Rollback: `supabase/rollback/20261224120000_course_placement.down.sql`.

## Archivos

- Motor: `shared/placement.ts` · pruebas `shared/__tests__/placement.test.ts`.
- Banco: `content/placement/select.ts`, `render.ts`, `banks.generated.ts`,
  `scripts/build-placement-bank.ts` · pruebas `content/__tests__/placement.test.ts`.
- Cliente: `src/features/placement/` (estado de pantalla, guardado, textos es/en, componentes),
  `src/app/course-start/[code].tsx`, `src/app/placement/[code].tsx`; «Tus cursos» abre la elección.
  `startCourse` en `src/features/courses/api.ts`.
- Base: migración, rollback, `supabase/tests/coursePlacement.test.mjs`.

## Pendiente / decisiones

- Aplicar en producción (con el modelo de cursos, 20261223120000) cuando se autorice.
- Ubicación por unidad (empezar en A1 U8) sigue fuera: exigiría cambiar `is_lesson_unlocked`.
- Sin la migración, `set_target_language` mantiene el `start_level` global: «desde A1» en producción
  hoy hereda ese nivel (comportamiento previo, Fase 3). Se corrige al aplicar el modelo de cursos.
- Las preguntas del test también aparecen después en sus lecciones (son contenido real del curso).
- Revisión pedagógica humana del banco y QA visual en dispositivo: pendientes.
