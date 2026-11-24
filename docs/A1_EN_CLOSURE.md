# Cierre de inglés A1

Estado (2026-11-12): **implementado y validado en local**. Nada se aplicó en producción, no hubo
despliegues, builds ni commits. Contenido nuevo en borrador (`draft`) y sin publicar.

**Enfoque de producto (decisión del 2026-11-12).** PolyGo es una app para aprender, no una plataforma
de certificación. El MCER es una **guía de nivel**, no una especificación que haya que cumplir
literalmente. Por eso:

- **No hay exámenes ni puntos de control obligatorios**, ni aprobaciones por sección, umbrales,
  certificaciones o desbloqueos condicionados a evaluaciones. El usuario avanza por las lecciones como
  siempre. El sistema de niveles no cambió.
- Los bancos de CP1–CP4 y de las formas A y B quedan como **material de práctica opcional**, fuera del
  flujo (§7). No se invierte más en ellos.
- La escritura es **práctica**: tareas guiadas con requisitos sencillos y tareas libres con ejemplo y
  checklist, al terminar la lección (§6). No se guarda ni genera evidencia.
- Nada se bloquea por citas del MCER, revisión oficial o revisión nativa: se mantiene un inglés natural y
  correcto para principiantes; la revisión humana es una mejora recomendada (§8).

Fuente de contenido: `docs/polygo-ingles-a1-mapa-curricular.md` (el «mapa»), usada como referencia
interna de objetivos y progresión.

## 1. Inventario contra el mapa

| Pendiente del mapa                                                | Estado                                                                                                     | Dónde                         |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------- |
| U1–U12, lecciones escritas y consolidación                        | Implementado y validado (fases previas)                                                                    | `content/en/a1/unit01…12`     |
| 14 lecciones «En contexto»                                        | Implementado y validado (C.1–C.2)                                                                          | `content/en/a1/context*.ts`   |
| U13 y U14, L1–L5                                                  | Implementado y validado (C.3)                                                                              | `unit13`, `unit14`            |
| U1 L1–L2: SIT y LM                                                | **Implementado ahora**                                                                                     | `content/en/a1/closure.ts`    |
| U2 L4: profesiones (v15); U2 L5: TR                               | **Implementado ahora**                                                                                     | ídem                          |
| U3: 0, 13, 14 y 16–19                                             | **Implementado ahora** (7 palabras, al final de L3)                                                        | ídem                          |
| U3 y U9: LD (dictado)                                             | Fuera a propósito (§9): se practica con LC y PW                                                            | —                             |
| U4 L4: _'s_ (g08)                                                 | **Implementado ahora**                                                                                     | ídem                          |
| U5 L2: _the_; U5 L6 «Uno, dos, muchos» (g05)                      | **Implementado ahora** (lección nueva `a1-u05-l06`)                                                        | ídem                          |
| U6 L5: PW sobre una escena; g10 con PW                            | **Implementado ahora**                                                                                     | ídem                          |
| U7 L4: _I'd like_ y SIT                                           | **Implementado ahora**                                                                                     | ídem                          |
| U8 L4: TR; v08 con PW                                             | **Implementado ahora**                                                                                     | ídem                          |
| U9 L3: _in the morning_, _on Monday_, _at_                        | **Implementado ahora**                                                                                     | ídem                          |
| U9 L6 «Meses y fechas»                                            | **Implementado ahora** (lección nueva `a1-u09-l06`: 12 meses, ordinales 1.º–5.º, _in_ + mes, _on_ + fecha) | ídem                          |
| U10: PW de lugares y de indicaciones (g19)                        | **Implementado ahora**                                                                                     | ídem                          |
| U11: _I like it/them_ (g21); v11 con PW                           | **Implementado ahora**                                                                                     | ídem                          |
| U12 L3: SIT en un chat; U12 L6 «Mensajes y postales»              | **Implementado ahora** (lección nueva `a1-u12-l06`)                                                        | ídem                          |
| U14: PW cifra → palabra hasta 100                                 | **Implementado ahora**                                                                                     | ídem                          |
| GW con datos propios (U1 L5, U3 L4, U4 L5, U8 L5, U11 L5, U12 L5) | **Implementado ahora** como escritura guiada en el dispositivo (§6)                                        | `content/en/a1/writing.ts`    |
| Tareas de escritura de los 4 bloques (FW)                         | **Implementado ahora** (§6)                                                                                | ídem                          |
| Validación de escritura sin IA (mapa §8, punto 1)                 | **Implementado ahora** (§6)                                                                                | `shared/writing.ts`           |
| CP1–CP4 y evaluación final                                        | Bancos de **práctica opcional**, fuera del flujo; sin exámenes (§7)                                        | `content/en/a1/assessment.ts` |
| Reetiquetado por objetivo y modo (mapa §6.1)                      | Parcial: ver §5                                                                                            | —                             |
| `objective` y `grammar` en U5–U12                                 | **No implementado** (prioridad baja en el mapa; cambiaría filas publicadas)                                | —                             |
| Cotejo de citas con el MCER 2020                                  | No bloquea: el MCER es guía (§8)                                                                           | —                             |
| Revisión nativa                                                   | Recomendada, no bloquea (§8)                                                                               | —                             |

## 2. Cómo se integra (sin tocar lo publicado)

`content/supplement.ts` arma `SUPPLEMENT_PATH`, fuera de `COURSES` y de `CURRICULUM_PATH` (igual que la
fase C y la C.3):

- **Agregado a una lección cargada** (lo que el mapa marca «M: agregar …»): la misma lección, con sólo
  los ejercicios nuevos a partir de la posición siguiente a la última cargada (`exerciseOffset`;
  p. ej. `a1-u04-l04-e12`). La consolidación generada no cambia, porque los agregados no están en
  `UnitDef.lessons`.
- **Lección nueva del mapa** (U5 L6, U9 L6, U12 L6): id con el número del mapa (`a1-u09-l06`), en la
  posición 12, después de la «En contexto» (11). El mapa las pone antes de la «En contexto»; ordenarlas así
  es la decisión **D2** ya pendiente (desbloqueo), no se tomó acá.
- **Migración** `supabase/migrations/20261119120000_a1_en_closure.sql`, generada con
  `npm run content:a1-closure -- <archivo>`, con la plantilla _add-only_ de la C.3 sin modificarla. Todo
  nace `is_published = false` y los ítems en `draft`: `learning_lesson_plan` y RLS sólo ven lo publicado,
  así que **ninguna lección publicada cambia** hasta una migración de publicación aparte. Si una fila
  cargada difiere, aborta. SHA-256 `2d37a8de…00931596`, igual en dos corridas. Sin `drop`, `delete`,
  `alter` ni cambios de rutas, RLS o desbloqueo. **No aplicada.**
- **Ids**: 105 ítems nuevos `en.ex.*` sorteados y registrados con `npm run content:ids` (registro:
  4464 → 4569; 0 reemplazos, 0 retirados).
- **App**: sin tipos de ejercicio nuevos. Dos cambios mínimos: el TTS ya no lee emojis (`spokenText`:
  una escena de PW con emojis es la imagen, no algo para pronunciar) y la pantalla de escritura (§6).
  Un cliente actual abre todo el contenido nuevo (son tipos que ya conoce).

Totales del cierre: 34 palabras, 3 lecciones nuevas, 20 lecciones cargadas con agregados, 105
ejercicios (75 agregados y 30 en lecciones nuevas), 105 ítems y versiones, 53 conjuntos de opciones.

## 3. Formatos del mapa con los tipos que existen

| Formato del mapa                                                | Cómo se implementa                                                                                                    | Corrección                                  |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| PW (imagen o situación → escribir)                              | `short_answer`: la escena con emojis en la pregunta; la línea en español describe la tarea, nunca la frase a traducir | `normalized_text.v1`, respuestas enumeradas |
| TR (transformación)                                             | `short_answer` con la oración y «Escribí la oración en negativa / como pregunta»                                      | ídem                                        |
| SIT (situación → fórmula)                                       | `fill_blank` con la situación en español y las fórmulas como opciones                                                 | `exact_option.v1`                           |
| LM / LQ / RQ                                                    | `context_choice` (como en la fase C). LM: una frase corta oída; LQ: mensaje, anuncio o diálogo                        | `exact_option.v1`                           |
| GW con el dato dado («escribí la pregunta para esta respuesta») | `short_answer`                                                                                                        | `normalized_text.v1`                        |
| FF (campo de formulario)                                        | `short_answer` con la persona ficticia `en.persona.sofia-ruiz` (privacidad `fictional`)                               | ídem                                        |
| GW con datos propios, FW                                        | Escritura en el dispositivo (§6)                                                                                      | Requisitos observables / autoevaluación     |
| LD (dictado)                                                    | **No implementado**: no hay tipo «escuchar y escribir» (§9)                                                           | —                                           |

`content/supplement-checks.ts#mapFormatOf` deduce el formato de cada ejercicio y el validador exige que
esté en «Practicar» o «Evaluar» de algún objetivo de su lección (o sea práctica general del mapa §5:
IC, TC, MP, FB, CW, OW, LC, TW, SA).

## 4. Validación del contenido nuevo

`content/supplement-checks.ts` (lo usan las pruebas y el generador, que no escribe si hay problemas):

- Códigos del mapa existentes; nunca `cR04`, `v13`, `p12` ni `g24`.
- **Vocabulario en el orden de la ruta v2** (U13 después de U3, U14 después de U7): todo el inglés usa
  palabras y formas ya enseñadas hasta esa unidad, nombres declarados o las palabras target del propio
  ejercicio. Las que se adelantan quedan listadas (`advancedWords`): profesiones de A2 en U2 L4 (como pide
  el mapa), _I'd like_ (U14) en U7 L4 (lo pide el mapa), _birthday_ y _month_ (A2) en U9 L6 y _help_ (U12)
  en U11 L2 (_help me_, frase fija del mapa).
- Sin ambigüedad: opciones únicas (sin mayúsculas, tildes ni puntuación) y **la corrección del servidor**
  (`gradeWithSpec`) da correcta la respuesta y cada aceptada, e incorrecto cada distractor.
- Lecciones nuevas con el estándar (introducción con ejemplos, cierres, 6–10 ejercicios, escucha, los dos
  últimos de producción); palabras nuevas con IPA y practicadas; sin datos de contacto ni datos del alumno.

## 5. Objetivos y reetiquetado (mapa §6.1)

- `content/curriculum-map.ts` copia el catálogo del mapa (§2): 59 objetivos V/G/C/P con sus formatos de
  «Practicar» y «Evaluar», los retirados y los bloques con los objetivos de cada CP.
- Cada agregado y lección nueva declara sus códigos (`curriculum`) tal como los nombra el mapa §3.
- **No se crearon objetivos en la base.** Los de Vocabulary y Grammar exigen una actividad del MCER
  (`learning_objectives.cefr_activity`, obligatoria) que el mapa no define (dice que su inventario es
  «derivado»): asignarla sería inventar, y no hace falta: quedan como referencia interna (§9).
- **No se cambió la clasificación de ítems ya cargados**: el modo actual de cada tipo (`content/catalog.ts`)
  ya coincide con §6.1 (OW → `guided_construction`, TW de palabra → `free_recall`, TW de frase y SA →
  `controlled_production`). Cambiar el modo de un ítem cargado cambiaría su identidad; no hizo falta.

## 6. Producción escrita sin IA (mapa §8, punto 1)

`shared/writing.ts` (`polygo.writing_check.v1`) y `content/en/a1/writing.ts` (10 tareas). Pantalla:
`src/app/writing/[id].tsx` + `WritingTask`.

**Escritura guiada (GW)** — 6 tareas, una por cada lección donde el mapa pasa un SA a GW:

- Requisitos **observables y deterministas**: expresiones con variantes (`hello|hi`), estructuras como
  patrones de fichas (`i am <NUMBER>`, `my name is <WORD>`), cantidad mínima de oraciones, mayúscula
  inicial y puntuación final. Normalización de mayúsculas, apóstrofos tipográficos y puntuación.
- «Completa» = cumple todos los requisitos obligatorios. La pantalla dice explícitamente que la revisión
  **no corrige la gramática** ni dice si el texto está bien escrito.
- Ejemplo: «I have 31 years» no cumple «Decís tu edad con I am + número (sin have)».

**Escritura libre (FW)** — 4 tareas de bloque (p02/p03, p04/p10, p05/p09, p06/p07/p09):

- **Sin veredicto nunca** (`complete: null`). Al terminar se ven pistas opcionales («¿usaste and o
  but?»), un texto modelo («un ejemplo, no la única respuesta») y una lista de control para marcar.

**Privacidad (P4)**: el texto **no se envía ni se guarda**; queda en el teléfono. Por eso las tareas pueden
pedir datos propios sin contradecir P4 (que prohíbe registrar datos personales reales) y siempre dicen
«podés inventar los datos». Consecuencia: **estas tareas no generan evidencia** para la dimensión
Production ni para el SRS; la Production con evidencia sale de PW, TR, GW con dato dado y FF.

Cada tarea se valida (`writingTaskProblems`): su modelo cumple sus requisitos, la lista de control tiene
2+ puntos, una tarea libre sólo tiene pistas opcionales, y el vocabulario de modelos y preguntas guía está
enseñado hasta su lección o bloque (la tarea del bloque 3 explica «Back at five» en un glosario, porque el
mapa pide esa nota antes de U12 L6).

**Acceso.** Al terminar una lección que tiene tarea, la pantalla de resultados muestra la tarjeta
«PRACTICÁ ESCRIBIENDO» (`WritingPracticeCard`, en el espacio `extra` que ya tenía `SessionResults`),
que abre `/writing/[id]`. Las 6 tareas guiadas aparecen tras su lección (U1 L5, U3 L4, U4 L5, U8 L5,
U11 L5 y U12 L5, todas publicadas) y las 4 libres tras el repaso final de la última unidad de cada bloque
en el camino publicado (`a1-u04-final`, `a1-u07-final`, `a1-u09-final`, `a1-u12-final`). Es opcional:
«Siguiente lección» sigue igual. Como viajan con la app, quedan disponibles con la próxima build.

## 7. Bancos de práctica (ex puntos de control y evaluación final)

`content/en/a1/assessment.ts` conserva 176 ítems escritos a partir de los puntos de control y la
evaluación final del mapa: CP1 (21), CP2 (20), CP3 (11), CP4 (16), A (54) y B (54).

- **No son exámenes**: no se aprueban, no tienen umbrales, no certifican A1 ni desbloquean nada.
- **Están fuera del flujo**: no se cargan en la base ni aparecen en la app.
- Siguen validados (`content/assessment-checks.ts`): ítems distintos de los de las lecciones, vocabulario
  enseñado, sin ambigüedad y aceptados por la corrección del servidor. Cada ítem dice qué objetivo del
  mapa practica, como referencia interna.
- Reutilizarlos como **repasos opcionales** por bloque es posible más adelante con un tramo de contenido
  y las rutas de repaso existentes; no se hizo ahora para no abrir una arquitectura nueva.

## 8. Revisión humana recomendada (no bloquea)

- **MCER 2020**: el PDF oficial no se pudo abrir (403). Como el MCER es una guía, no hace falta cotejar
  las citas para usar el contenido; ninguna cita se muestra en la app.
- **Revisión de inglés** (no hubo revisión nativa): conviene que alguien con buen inglés lea las frases
  nuevas de `closure.ts` (SIT de U1 y U12, TR de U2 y U8, fechas de U9 L6, la nota de U12), las escenas
  con emojis de PW en iOS y Android, y los modelos de las 10 tareas de escritura.

## 9. Lo que quedó fuera a propósito

| Tema                                              | Decisión                                                                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Dictado (LD)                                      | Sin tipo de ejercicio; se practica con escucha (LC/LQ) y escribir números y horas (PW). No hace falta para aprender |
| Exámenes, CP obligatorios, aprobación por sección | Fuera del producto (§7)                                                                                             |
| Objetivos V/G cargados en la base                 | No hacen falta: los objetivos quedan como referencia interna en `content/curriculum-map.ts`                         |
| Evidencia de la escritura propia                  | No hace falta: la escritura es práctica                                                                             |
| Orden de las 3 lecciones nuevas                   | Van después de la «En contexto» (posición 12). Al publicarlas se aplica la regla de desbloqueo de siempre (D2)      |

## 10. Archivos

Nuevos: `content/curriculum-map.ts`, `content/supplement.ts`, `content/supplement-checks.ts`,
`content/assessment-checks.ts`, `content/en/a1/closure.ts`, `content/en/a1/writing.ts`,
`content/en/a1/assessment.ts`, `shared/writing.ts`, `scripts/build-a1-closure-sql.ts`,
`src/features/learning/components/WritingTask.tsx`, `src/app/writing/[id].tsx`,
`supabase/migrations/20261119120000_a1_en_closure.sql`, pruebas `content/__tests__/a1-closure.test.ts`,
`src/features/learning/__tests__/WritingTask.test.tsx`, `supabase/tests/a1Closure.test.mjs`.

Modificados: `content/types.ts` (tipos del cierre), `content/path.ts` y `content/catalog.ts` y
`scripts/content-document.ts` (`exerciseOffset`), `content/comprehension.ts` (registro de ids),
`content/ids.lock.json` (105 ids), `src/features/learning/speech.ts` y `ExercisePrompt.tsx` (sin leer
emojis), `package.json` (`content:a1-closure`), y pruebas que fijaban la lista de migraciones o los totales.

## 11. Pruebas nuevas

- `content/__tests__/a1-closure.test.ts` (31): reglas del cierre, agregados sin tocar lo cargado,
  lecciones nuevas, cobertura (0–20, _the_, plurales, _'s_, meses, ordinales, pronombres objeto, PW en
  U1–U12), códigos retirados, palabras adelantadas, registro de ids, migración = generador, 5 mutaciones
  que el validador detecta, escritura (requisitos, guiada/libre, vocabulario, determinismo) y bancos de
  evaluación (reglas, paralelismo, cobertura, 2 mutaciones).
- `src/features/learning/__tests__/WritingTask.test.tsx` (4): guiada completa e incompleta, libre sin
  veredicto con modelo y lista de control, y el TTS sin emojis.
- `supabase/tests/a1Closure.test.mjs` (8, PGlite): generador exacto y sin sentencias destructivas,
  add-only fila a fila, reaplicar sin cambios y abortar ante una fila distinta, todo sin publicar e ítems
  draft, plan de las lecciones publicadas sin cambios, la app no ve nada nuevo, ítems fuera de los repasos,
  y las **21 lecciones tocadas jugadas con la corrección del servidor** (publicadas sólo en la base
  desechable): todas las respuestas correctas aceptadas.

Pruebas existentes ampliadas porque fijaban «currículo + fase C + C.3» (como pasó en la C.2 y la C.3):
`planned.test.ts`, `comprehension.test.ts` (Jest: composición del registro de ids);
`items`, `versions`, `presentations`, `comprehension`, `learning`, `planned` y
`legacyReviewRetirement` (test:db: totales, la lista de migraciones posteriores y la posición de la «En
contexto», que sigue en 11 con las lecciones nuevas en 12). En `learning.test.mjs` la prueba enviaba
todos los ejercicios de `a1-u01-l01`; ahora sólo los publicados (los agregados sin publicar se rechazan,
como corresponde).

## 12. Ronda final de validación (2026-11-12, local, secuencial)

| Paso                                                                                                             | Resultado                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1–4. Contenido inglés A1: objetivos, unidades, lecciones, ejercicios, palabras, estímulos, ids (`jest content/`) | **10/10 suites, 5826/5826**                                                                                                                                                      |
| 5. Base de datos afectada (`a1Closure` + las 7 ampliadas, secuencial)                                            | 8/8 y 114/114 (tras corregir la prueba de `learning`)                                                                                                                            |
| 6. Jest completo                                                                                                 | 6508/6510; fallaron por **timeout de 5 s bajo carga** `blocks.test.tsx` y `profile/report.test.tsx` (ajenos; `report` ya registrado como intermitente en C.1). Aislados: **5/5** |
| 7. `test:db` completo                                                                                            | **419/419** (primera corrida: 410/419, los 9 por totales fijos, corregidos arriba). `humanmatch` pasó                                                                            |
| 8. `npm run typecheck` (app + scripts)                                                                           | exit 0                                                                                                                                                                           |
| 9. `npx expo lint`                                                                                               | exit 0                                                                                                                                                                           |
| Determinismo de la migración                                                                                     | mismo SHA-256 `2d37a8de…00931596` en dos corridas                                                                                                                                |

`ContextStimulusVisual` pasó dentro de Jest completo (no se corrió en paralelo con `test:db`).
No se ejecutaron: arneses PG 17, Deno e2e (la Edge Function no cambió) ni pruebas en dispositivos.

### Corrida tras el cambio de enfoque (2026-11-12)

Conexión de la escritura a los resultados de la lección y bancos como práctica opcional:
`npm run typecheck` exit 0 (con las rutas tipadas regeneradas), `npx expo lint` exit 0, **Jest completo
70/70 suites, 6512/6512**. `test:db` no se repitió: no cambió ninguna migración ni contenido cargado
(la última corrida, 419/419, sigue vigente).
