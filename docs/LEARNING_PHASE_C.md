# Fase C — Comprensión lectora y auditiva en contexto (inglés A1)

> **Fase C.1 (2026-11-09): auditoría contra el mapa curricular.** El mapa ya está en el repositorio
> (`docs/polygo-ingles-a1-mapa-curricular.md`). Lo que sigue en §0–§14 describe la fase C original;
> donde la C.1 lo cambió, manda **§C1** (al final). En particular: D1 quedó resuelto (objetivos del
> mapa, `en.a1.obj.cl01`…), los 24 objetivos propuestos se reemplazaron por 11, hay 75 preguntas y
> 25 estímulos (no 72 y 24), y el audio ya no presenta el cambio de tono como una segunda voz.
>
> **Fase C.2 (2026-11-09): U13 y U14.** Ver **§C2** al final: las dos lecciones «En contexto» que
> faltaban, en unidades planificadas sin publicar. Total de la fase: 14 lecciones, 30 estímulos y 91
> preguntas. D5 queda resuelto para la L6 de cada unidad (sus L1–L5 siguen sin escribir).
>
> **Fase C.3 (2026-11-09): U13 y U14 L1–L5.** Ver **§C3** al final: las diez lecciones escritas que
> faltaban, con su consolidación, sin publicar. U13 y U14 tienen ya el camino completo (posiciones 1–11).

Estado (2026-11-09): **implementada y validada localmente** (PGlite, Jest). Contenido en **borrador**,
sin revisión pedagógica ni de hablantes nativos. **Nada aplicado en producción**: ni migraciones, ni
contenido, ni Edge Functions; sin commits, sin build, sin EAS. SRS v2, Mastery, Adaptive y Display
siguen **apagados** (las pruebas lo comprueban). La única operación contra producción fue una consulta
de **sólo lectura** a `pg_constraint` para confirmar los nombres de los CHECK que amplía la migración.

Fuentes: `LEARNING_DATA_ARCHITECTURE.md` rev. 8 (§4.2–§4.5, §13.2, §18, P8, P9),
`MASTERY_ENGINE_DESIGN.md` rev. 2, `ADAPTIVE_LEARNING_DESIGN.md` rev. 4.2, `LEARNING_PHASE5.md`,
`PRE_RELEASE_VALIDATION.md`, `LEARNING_CATALOG_PHASE1.md`, `EXERCISE_ITEM_VERSIONS_PENDING.md`.

## 0. Diferencias con el encargo y decisiones tomadas

| # | Hallazgo | Decisión (2026-11-09) |
|---|---|---|
| D1 (**resuelto en C.1**, §C1) | El documento «Inglés A1: mapa curricular definitivo» **no está en el repositorio** (ni en artifacts, Drive ni Notion). Es la fuente de los ids `cL…`/`cR…`, los escenarios completos, el orden y U13/U14. Además, `content/objectives.ts` exige ids `en.a1.obj.<slug>`, no `cL01`. | Redactar desde la **tabla resumida del encargo**, todo en `draft`, con objetivos marcados como **propuestos** (no del mapa). No se usan ids `cL/cR` ni descriptores del MCER. |
| D2 | `is_lesson_unlocked` encadena todas las lecciones publicadas por posición: publicar «En contexto» dentro de U1–U12 bloquearía, por ejemplo, `a1-u02-l01` a quien ya terminó U1 (lo prueba `comprehension.test.mjs`). `content:diff` rechaza altas de lecciones, y agregarlas a `UnitDef.lessons` regeneraría la consolidación y cambiaría ids publicados. | Lecciones en un camino propio (`COMPREHENSION_PATH`), **fuera** de `CURRICULUM_PATH`, al final de su unidad, cargadas con `is_published = false`. |
| D3 | Ningún tipo de ejercicio admite «estímulo + pregunta» (`listen_choice` sólo lleva `audioText`), y `exercises.type`, `exercises.skill` y `exercise_items.type` son listas cerradas con CHECK. §18 decía «C: esquema ninguno». | Tipo nuevo **`context_choice`** y skill de interfaz **`reading`**, con una migración mínima que sólo amplía los CHECK (desviación documentada de §18). |
| D4 | `review_item_candidates` (ruta de repasos activa) toma ítems `status = 'active'` sin mirar si su ejercicio está publicado, y el SQL del catálogo cargaba todo ítem como `active`. Con dimensión `comprehension`, `srs_v2_rung_for_mode` da el peldaño `U`: los ítems habrían entrado en los repasos. | Los ítems de comprensión se cargan en **`status = 'draft'`**. `CATALOG_SQL` acepta un `status` por ítem (por defecto `active`, sin cambio para el resto). |
| D5 | U13 (datos personales) y U14 (precios y compras) **no existen** como unidades, y `content_personas` está vacío a propósito (falta la lista de exclusión editorial). | **No implementadas.** No se inventan unidades ni personas. |

## 1. Objetivo y alcance

Dos capacidades: entender textos breves (**reading_comprehension**) y mensajes orales
(**listening_comprehension**) en contexto, respondiendo preguntas sobre su significado. Regla: leer o
escuchar una palabra y elegir su traducción no es comprensión; cada pregunta exige ubicar un dato,
relacionar dos datos o entender la intención (quién, dónde, cuándo, qué quiere, qué pasó).

Alcance real: **12 lecciones «En contexto», una por unidad U1–U12 de inglés A1.** Fuera de alcance
(no tocado): U13/U14, A2 y otros idiomas, evaluaciones finales, desbloqueos de nivel, compactación,
producción libre, Ranked, SRS v1, energía, rachas, logros, Plus.

## 2. Arquitectura utilizada

```
content/en/a1/context.ts          12 ContextLessonDef (draft): estímulos + preguntas + objetivos propuestos
        │  (content/context-builders.ts: readingQuestions / listeningQuestions)
content/comprehension.ts          COMPREHENSION_PATH (fuera de CURRICULUM_PATH), COMPREHENSION_OBJECTIVES,
        │                         ITEM_REGISTRY_PATH y registryCatalog() para content/ids.lock.json
content/comprehension-checks.ts   comprehensionProblems(): reglas de §6 (tests y generador)
content/catalog.ts                context_choice → modo y entrada según el estímulo; targets = `concepts`
        │
scripts/build-comprehension-sql.ts → supabase/migrations/20261113120100_comprehension_en_a1.sql
        │  (scripts/comprehension-sql.ts: lecciones y ejercicios sin publicar, ítems draft,
        │   sin exercise_words; catálogo, objetivos, versiones y conjuntos con las plantillas de siempre)
supabase/migrations/20261113120000_context_comprehension.sql   amplía 4 CHECK (requisito del anterior)
        │
learning-session v3 (SIN CAMBIOS) ── plan → presentaciones → gradeWithSpec(exact_option.v1) sobre la versión
        │
app: SessionPlayer → ExercisePrompt → ContextStimulus (texto / audio con 2 voces) → AnswerInput (opciones)
```

Lo que se reutiliza sin cambios: `exercise_item_versions` (el estímulo es parte de la versión
inmutable y de su hash SHA-256 sobre JCS RFC 8785 en NFC), `exercise_option_sets`,
`exercise_presentations`, `exercise_attempt_presentations`, `exercise_attempt_gradings`,
`polygo.shuffle.v1`, `exact_option.v1`, `learning_lesson_plan`, `learning_start_lesson`,
`learning_submit_graded`, `submit_learning_session`.

## 3. Tipo de ejercicio nuevo: `context_choice`

Contrato (`shared/exercises.ts`):

```ts
{ type: 'context_choice'; stimulus: ContextStimulus; question: string; options: string[] }

ReadingStimulus   { kind: 'reading'; id: 'en.stim.<slug>'; document: ReadingDocument; setting;
                    title?; from?; to?; lines: string[] }
ListeningStimulus { kind: 'listening'; id; setting; speakers: { name; voice: 'a' | 'b' }[];
                    rate; lines: { speaker; text }[] }   // lines = guion TTS = transcripción
```

| Propiedad | Lectura | Escucha |
|---|---|---|
| Modo (`ExerciseDef.mode`, validado contra el estímulo) | `reading_comprehension` | `listening_comprehension` |
| Dimensión de PolyGo | `comprehension` (+ `vocabulary` por §4.3, ver §9) | ídem |
| Formato / entrada | `select` / `text` | `select` / `audio` |
| Corrección | `exact_option.v1` (por valor, sin normalizar) | ídem |
| Privacidad | `closed` | `closed` |
| `skill` (interfaz) | `reading` (nueva) | `listening` |
| Actividad del MCER (en el objetivo) | `reading` | `listening` |

Tipos curriculares del encargo: **RQ** (preguntas sobre un texto) = `context_choice` con estímulo
`reading`; **LQ** y **LM** (preguntas sobre una conversación / un mensaje oral) = `context_choice`
con estímulo `listening` de dos voces o de una. No se crearon tipos técnicos distintos: la diferencia
pedagógica está en el estímulo, no en el formato de respuesta. Como el mapa no está disponible, esta
correspondencia es una interpretación y queda para revisar.

Preguntas y opciones van **en español**: se mide si se entendió el mensaje en inglés, no el
enunciado. Cada pregunta es un ítem con id propio (`en.ex.<14>`, sorteado por `npm run content:ids`);
las preguntas de un mismo estímulo comparten `stimulus.id` y copian el estímulo en su versión.

## 4. Objetivos curriculares cubiertos

24 objetivos **propuestos**, `draft`, sin `cefrRef`, uno de lectura y uno de escucha por lección.
Ids `en.a1.obj.<slug>`. Relaciones derivadas del contenido: ítems de esa actividad, sus conceptos
target como `core` (135 conceptos distintos) y la lección con rol `practice`. La descripción de cada
uno dice que no procede del mapa curricular. Cargarlos no muestra nada: P9 sigue sin dominio de
comprensión visible (`user_objective_state` y Display apagados).

## 5. Unidades, lecciones y recursos (matriz de cobertura)

| Unidad | Lección | Reading (documento · preguntas) | Listening (voces · preguntas) | Objetivos vinculados | Audio disponible | Tests |
|---|---|---|---|---|---|---|
| U1 Saludos | `a1-u01-context` Un primer encuentro | mensaje · 3 | Tom (a) + Lucy (b) · 3 | read-short-greeting-message, understand-first-meeting | TTS en dispositivo | contenido, catálogo, PGlite, UI |
| U2 To be | `a1-u02-context` ¿Quién es quién? | descripción · 3 | Leo (a) + Kate (b) · 3 | read-who-is-who-card, understand-to-be-questions | TTS | ídem |
| U3 Números y países | `a1-u03-context` Tarjetas de jugadores | ficha · 3 | Ray (a) + Max (b) · 3 | read-player-cards, understand-age-and-country | TTS | ídem + corrección |
| U4 Familia | `a1-u04-context` La familia de Ana | publicación · 3 | Tom (a) + Ana (b) · 3 | read-family-description, understand-family-conversation | TTS | ídem |
| U5 Objetos | `a1-u05-context` ¿Cuál es el tuyo? | mensaje · 3 | Leo (a) + Kim (b) · 3 | read-message-about-objects, understand-whose-object | TTS | ídem + corrección |
| U6 Casa | `a1-u06-context` Un departamento en alquiler | aviso · 3 | Nora (a) + Sara (b) · 3 | read-rental-ad, understand-where-things-are | TTS | ídem |
| U7 Comida | `a1-u07-context` En el café | menú · 3 | Paul (a) + Emma (b) · 3 | read-simple-menu, understand-cafe-order | TTS | ídem + corrección + UI |
| U8 Rutinas | `a1-u08-context` La semana de Tom | mensaje · 3 | mensaje de voz, Tom (a) · 3 | read-routine-message, understand-routine-voice-message | TTS | ídem |
| U9 Horarios | `a1-u09-context` El programa del museo | horario · 3 | anuncio, una voz · 3 | read-opening-hours, understand-time-announcement | TTS | ídem + corrección |
| U10 Ciudad | `a1-u10-context` ¿Cómo llego? | cartel · 3 | Ann (a) + Joe (b) · 3 | read-direction-sign, understand-street-directions | TTS | ídem + corrección |
| U11 Gustos | `a1-u11-context` Una publicación sobre hobbies | publicación · 3 | Dan (a) + Rose (b) · 3 | read-hobbies-post, understand-likes-conversation | TTS | ídem |
| U12 Preguntas | `a1-u12-context` Situaciones de comunicación | mensaje · 3 | Ben (a) + Ms. Park (b) · 3 | read-request-for-help, understand-classroom-exchange | TTS | ídem |
| U13 Datos personales | — | — | — | — | — | **No implementada** (la unidad no existe; necesita `content_personas`) |
| U14 Precios y compras | — | — | — | — | — | **No implementada** (la unidad no existe) |

Totales: 12 lecciones · 24 estímulos (12 de lectura, 12 de audio) · 72 preguntas = 72 ejercicios = 72
ítems · 72 versiones · 72 conjuntos de opciones · 334 filas de `item_concepts` · 24 objetivos.
**Ninguna unidad está «terminada»**: todas siguen sin revisión pedagógica (§11).

## 6. Recursos de lectura y reglas de calidad

Documentos: mensaje, publicación, descripción, ficha, aviso, menú, horario, cartel (también
admitidos: correo, postal, indicaciones). Cada tarjeta muestra la situación, el tipo de documento,
emisor y destinatario ficticios y el texto, separada de la pregunta.

`comprehensionProblems()` exige, y `content/__tests__/comprehension.test.ts` lo prueba con mutaciones:
lección de 6–10 preguntas con al menos un estímulo de cada tipo; 2–4 preguntas por estímulo; mismo
`stimulus.id` ⇔ mismo contenido; modo y skill acordes al estímulo; `words` vacío; conceptos target
existentes, del idioma y enseñados hasta esa unidad; 3–4 opciones únicas (también sin tildes ni
mayúsculas) con la respuesta una sola vez; pregunta terminada en «?»; explicación con la evidencia;
NFC; sin datos de contacto (correos, teléfonos, URLs); si la respuesta aparece tal cual en el texto,
otro distractor también (no se resuelve copiando); nombres ficticios declarados en `names`; y toda
palabra de los estímulos no enseñada hasta esa unidad declarada en `untaught` (lista para la revisión
pedagógica: p. ej. U9 `museum, opens, closes, tour, children, visits, for`).

## 7. Recursos de audio

**Fuente**: `expo-speech` (ya en el proyecto), voz sintetizada del sistema en el dispositivo. No hay
archivos de audio, Supabase Storage, URLs ni proveedor de pago: el «recurso» es el guion de
`lines`, que es a la vez lo que se dice y la transcripción de referencia guardada en la versión
inmutable. La app lo indica como «voz sintetizada».

- **Dos voces**: `dialogueVoices()` elige la mejor voz instalada del locale para `a` y la mejor
  distinta para `b`; si el dispositivo tiene una sola, `b` usa la misma con otro tono (pitch 1.25).
- **Velocidad**: la del estímulo (0.85 en todo A1; el validador admite 0.75–0.9); «despacio» baja a
  0.5; nunca se acelera.
- **Reproducción**: suena sola al aparecer la primera pregunta de cada estímulo; se repite sin límite
  con el parlante y con la tortuga; se puede detener; muestra «Reproduciendo… n de m»; un error del
  motor muestra «No se pudo reproducir el audio» y se reintenta con el mismo botón.
- **Transcripción**: oculta hasta responder (antes invalidaría la evaluación); visible en el feedback
  con el nombre de cada hablante.

Límite (pendiente, §12): la calidad depende de las voces instaladas en cada dispositivo; no hay
grabaciones ni audio verificado por personas. No se marcó ninguna capacidad oral como evaluada por
usar TTS: sólo se registra `input_modality = 'audio'` en la corrección.

## 8. Integración en la app

Sin pantallas nuevas ni cambios de navegación: el reproductor de siempre (`SessionPlayer`) muestra
`ContextStimulus` dentro de `ExercisePrompt` y las opciones con el `ChoiceInput` existente.
`schema.ts` valida el estímulo (zod) antes de mostrarlo. Carga, error de carga, sin conexión
(«Reintentar» con la misma respuesta), reanudación y resultados son los del reproductor actual. La
respuesta correcta (en español) no se pronuncia en el resumen. `LearningStats` oculta `reading`
mientras no tenga respuestas.

Mientras las lecciones sigan sin publicar, la app no las lista (RLS: sólo lo publicado) ni puede
empezarlas (`lesson_not_found`). **Requisito antes de publicarlas**: una build con este cliente; una
build anterior no reconoce `context_choice` y no podría abrir la lección (zod la rechaza).

## 9. Corrección y evidencia

- **Autoridad**: la v3 desplegada corrige con `gradeWithSpec` según el `grading_spec` de la versión
  presentada. El paquete `core.generated.js` no contiene ninguna lista de tipos de ejercicio
  (verificado): corrige `context_choice` sin cambiar contrato ni código. El cliente sólo da feedback
  inmediato; su veredicto se guarda como `client_verdict` y no decide.
- **Reglas**: `exact_option` compara el texto exacto de la opción elegida con `answer`, contra el
  conjunto presentado. Espacios extra, mayúsculas cambiadas, una opción inventada o una respuesta de
  texto son `invalid_response` o `incorrect`, nunca correctas (probado).
- **SRS v1**: sin `exercise_words`, así que la lección no toca `user_word_progress` (probado).
- **SRS v2 / Mastery / Adaptive**: los ítems nacen `draft` y ninguna ruta de candidatos los toma
  (probado). Por §4.3 (aprobada), cada concepto target da una fila `vocabulary` y una
  `comprehension`: cuando un motor se encienda, una respuesta de comprensión también será evidencia de
  vocabulario de esas palabras. No se convierte la comprensión en vocabulario: es la regla aprobada.

## 10. Estado editorial

| Elemento | Estado |
|---|---|
| Lecciones y ejercicios | `is_published = false`; la migración nunca lo cambia (reaplicarla no revierte una publicación) |
| Ítems | `exercise_items.status = 'draft'` |
| Objetivos | `draft`, propuestos, sin descriptor del MCER |
| `ContextLessonDef.status` | `draft` (el tipo no admite otro valor) |
| Revisión de hablantes nativos | **no hecha**; nada se marcó como revisado |

Publicar exige, por este orden: revisión pedagógica real (P8), decidir el desbloqueo (D2: con la regla
de hoy, publicadas al final de la unidad bloquearían la siguiente a quien ya la terminó), una build
con el cliente nuevo, aplicar las dos migraciones y luego publicar con una migración escrita a mano
(lecciones, ejercicios e ítems `active`).

## 11. Pruebas ejecutadas y resultados

Corrida final (2026-11-09, local, una sola corrida después de todos los cambios):

| Validación | Resultado |
|---|---|
| `npm run typecheck` (app + scripts) | exit 0 |
| `npx expo lint` | exit 0, sin problemas |
| `npx jest --ci` | **63/63 suites, 6117/6117 tests** |
| `npm run test:db` (PGlite, todas las migraciones) | **325/325** |
| `npm run test:server` | **50/50** (corrida anterior; sin cambios en `server/`) |
| `npm run content:ids -- check` | OK: el contenido respeta el registro (4270 ids, 72 nuevos) |
| Generación de la migración dos veces | mismo SHA-256 `8b3556c4…5928b3` |
| `npm run functions:build` | paquetes regenerados; sin listas de tipos (la v3 no cambia) |
| Consulta de sólo lectura en producción | los 4 CHECK se llaman como en la migración |

Suites nuevas: `content/__tests__/comprehension.test.ts` (24: contenido, clasificación, catálogo,
determinismo, identidad, objetivos y 9 mutaciones que el validador detecta),
`supabase/tests/comprehension.test.mjs` (17: esquema, generación, carga sin publicar, ítems draft,
idempotencia, aislamiento de la app, desbloqueo, repasos, motores apagados, corrección en servidor,
respuestas no normalizadas, opciones alteradas, presentaciones ajenas, energía, Ranked y la prueba del
bloqueo que motiva D2), `src/features/learning/__tests__/ContextLesson.test.tsx` (10: lectura,
escucha, repetir, despacio, detener, error de audio, sesión completa, reanudación, sin conexión,
validación del payload) y `speechDialogue.test.ts` (7).

**Fallos encontrados y qué se hizo** (primera corrida completa: Jest 4 fallos, `test:db` 11):

- 13 eran pruebas que fijaban la premisa «la base / el currículo es exactamente lo de
  `CURRICULUM_PATH`» o la lista cerrada de tipos (`nueve tipos`, 4.198 ítems, 3.139 conjuntos, «no hay
  objetivos», «ningún ejercicio sin palabras», «la de retiro es la última migración»). Se **ampliaron**
  para esperar currículo + fase C, comparando fila a fila con el documento de la fase C, en lugar de
  excluir filas: `catalog`, `items`, `learning`, `legacyReviewRetirement`, `presentations`, `versions`
  (db) y `grading`, `option-sets`, `versions` (Jest). En `items` («idiomas y niveles») el test asumía
  id de ítem = id de ejercicio, cierto sólo para los ids históricos: pasó a `exercises.item_id`.
  `identity.test.ts` valida el registro contra `registryCatalog()`.
- **Intermitente**: `humanmatch.test.mjs` › «emparejamiento: dos jugadores cercanos…» falló una vez en
  la corrida completa (`'empieza en ~5 s'`, tiempo bajo carga). Aislada: 10/10; en la corrida final:
  pasó. No se modificó; ninguna migración de esta fase toca Ranked. Queda registrada como intermitente.

**No ejecutado**: los arneses PG 17 (`supabase/tests/pg17/*`) y Deno e2e: esta fase no agrega
concurrencia ni cambia la Edge Function, y PGlite (PostgreSQL 17) cubre todo lo nuevo. Tampoco
pruebas en dispositivos reales (§13).

## 12. Limitaciones

1. Contenido redactado sin el mapa curricular: escenarios, objetivos y orden son interpretación de la
   tabla resumida. Hay que cotejarlos con el mapa y renombrar o fusionar objetivos si corresponde.
2. Audio sintetizado en el dispositivo: calidad variable, sin control de acento ni de prosodia; en
   dispositivos con una sola voz, los hablantes se distinguen sólo por el tono.
3. El estímulo se repite en el payload de cada pregunta (3 por estímulo): más datos por versión, a
   cambio de versiones autocontenidas y auditables.
4. La transcripción viaja al cliente (como hoy viaja `answer`): ocultarla es una regla de interfaz, no
   de seguridad. La corrección sigue siendo del servidor.
5. `exact_option` no normaliza: la app envía el texto exacto de la opción tocada.
6. La migración de esquema lleva `drop constraint` (para ampliar CHECK): la herramienta MCP la
   rechaza; si se aprueba, se aplica desde el SQL Editor o la CLI.

## 13. Pendientes de revisión humana

- Cotejo con el mapa curricular (ids `cL/cR`, escenarios, orden, RQ/LQ/LM).
- Revisión pedagógica de las 72 preguntas, sus distractores y las explicaciones.
- Revisión de inglés natural A1 por un hablante nativo, incluidas las palabras `untaught`.
- Decisión de privacidad sobre edades ficticias en U3 (tarjetas de jugadores).
- Escucha real en iOS y Android: voces disponibles, distinción de hablantes, velocidad.

## 14. Próximos pasos (no iniciados)

1. Conseguir el mapa curricular y ajustar contenido y objetivos.
2. Revisión pedagógica (P8) y de hablantes nativos.
3. Decidir el desbloqueo de las lecciones «En contexto» (opcionales o requisito, y su posición).
4. Build con el cliente de esta fase; después, aplicar las dos migraciones y publicar.
5. U13 y U14: escribir las unidades completas y la lista de exclusión de `content_personas`.

---

## C1. Fase C.1 — Auditoría y alineación curricular (2026-11-09)

Fuente curricular: `docs/polygo-ingles-a1-mapa-curricular.md` (§2 tabla «Comprehension», §3 tablas
de los bloques), entregado por el responsable el 2026-11-09 y guardado sin cambios de contenido.
Todo sigue **local**: nada aplicado en producción, sin commits, sin build ni EAS, sin cambios en la
Edge Function, motores apagados. Contenido en **draft**; nada se marcó como revisado.

Clasificación usada en todo el apartado: **Alineado** (con el currículo, sin cambios) · **Corregido** ·
**Pendiente de revisión humana** · **Pendiente de recurso técnico** · **No implementado**.

### C1.1 Correspondencia entre códigos curriculares e ids de la base

El CHECK `learning_objectives_id_check` exige `^[a-z]{2,3}\.[a-c][12]\.obj\.[a-z0-9]+(-[a-z0-9]+)*$`
(minúsculas): `en-a1-cL01` no cabe tal cual. Regla: **id = código en minúsculas**,
`en-a1-cL01` ↔ `en.a1.obj.cl01`. Es biyectiva (cL y cR no chocan), no usa posiciones y no cambia
el esquema. Implementada en `content/comprehension-map.ts` (`comprehensionObjectiveId`,
`curriculumCode`); el código del mapa queda además en `description_es` y las anclas en `cefr_ref`.

| Código del mapa | Id en `learning_objectives` | Actividad | Ancla (`cefr_ref`) | Lecciones que lo practican | Preguntas |
|---|---|---|---|---|---|
| en-a1-cL01 | `en.a1.obj.cl01` | listening | LIS-1 † | U5 | 3 |
| en-a1-cL02 | `en.a1.obj.cl02` | listening | INT-1 | U2, U12 | 6 |
| en-a1-cL03 | `en.a1.obj.cl03` | listening | LIS-3, LIS-1 † | U3, U9 | 6 |
| en-a1-cL04 | `en.a1.obj.cl04` | listening | LIS-3 | U6, U10 | 6 |
| en-a1-cL05 | `en.a1.obj.cl05` | listening | LIS-2 | U1, U4, U7, U11, U12 | 15 |
| en-a1-cL06 | `en.a1.obj.cl06` | listening | LIS-4 | U8 | 3 |
| en-a1-cR01 | `en.a1.obj.cr01` | reading | REA-3 | U3, U7, U9, U10 | 12 |
| en-a1-cR02 | `en.a1.obj.cr02` | reading | REA-2 | U1, U8, U11 | 9 |
| en-a1-cR03 | `en.a1.obj.cr03` | reading | REA-4, REA-1 † | U2, U4, U6 | 9 |
| en-a1-cR05 | `en.a1.obj.cr05` | reading | REA-1 † | U5 | 3 |
| en-a1-cR06 | `en.a1.obj.cr06` | reading | REA-5 | U10 | 3 |
| ~~en-a1-cR04~~ | — | — | — | **Retirado por el mapa**: no se usa; el validador rechaza `cR04` | — |

Cobertura de U13 y U14 (cL02, cR01, cL03, cL05 en esas unidades): **No implementado** (las unidades no
existen). Los once objetivos tienen ejercicios igual, por las otras lecciones.

Estado de cada objetivo: `draft`, posición 1001–1011 (orden del mapa), conceptos `core` = los
conceptos target de sus preguntas, lecciones con rol `practice`. Las anclas citan la edición 2018
salvo †; el mapa pide cotejarlas con el PDF 2020 antes de mostrar cualquier cita (Display apagado: hoy
no se muestra nada).

### C1.2 Objetivos: los 24 propuestos, revisados

Los 24 eran uno de lectura y uno de escucha **por lección**: la misma capacidad repetida con otro
nombre (por ejemplo, cuatro «conversación entre otros» distintos). Ninguno llegó a la base (la
migración nunca se aplicó), así que se **reemplazaron**, no se retiraron: no hay filas que conservar.
Los ids de ítem (`en.ex.*`) sí están registrados, y se trataron con las reglas append-only (C1.4).

| Lección | Objetivo propuesto (lectura · escucha) | Qué era | Ahora |
|---|---|---|---|
| U1 | read-short-greeting-message · understand-first-meeting | relación con objetivos existentes | cR02 · cL05 |
| U2 | read-who-is-who-card · understand-to-be-questions | lectura: relación; **escucha: incorrecto** (conversación entre otros; el mapa pide preguntas dirigidas al alumno) | cR03 · cL02 (**contenido corregido**) |
| U3 | read-player-cards · understand-age-and-country | relaciones; una pregunta medía el país, no un número | cR01 · cL03 (pregunta corregida) |
| U4 | read-family-description · understand-family-conversation | relaciones | cR03 · cL05 |
| U5 | read-message-about-objects · understand-whose-object | relaciones | cR05 · cL01 |
| U6 | read-rental-ad · understand-where-things-are | relaciones | cR03 · cL04 |
| U7 | read-simple-menu · understand-cafe-order | relaciones | cR01 · cL05 |
| U8 | read-routine-message · understand-routine-voice-message | relaciones | cR02 · cL06 |
| U9 | read-opening-hours · understand-time-announcement | relaciones | cR01 · cL03 |
| U10 | read-direction-sign · understand-street-directions | relaciones; **faltaba cR06** | cR01 · cL04 + **cR06 (estímulo nuevo)** |
| U11 | read-hobbies-post · understand-likes-conversation | relaciones | cR02 · cL05 |
| U12 | read-request-for-help · understand-classroom-exchange | **lectura: no está en el mapa** (L7 es sólo de escucha); escucha: relación | cL05 + **cL02 (estímulo nuevo)**; lectura quitada |

Resultado: **11 objetivos reales, uno por capacidad**, 0 duplicados, 0 retirados reutilizados.

### C1.3 Matriz de cobertura de las 12 unidades

Número de lección: el **del mapa** (L6/L7). No es `lessons.position`: en el camino cada unidad ya
ocupa las posiciones 1–10 (L1–L5, dos repasos, escucha, palabras y final), y «En contexto» va en la 11
(D2). Ponerla en la posición 6 o 7 pisaría `rev2` o `l05`, que están publicadas. El número del mapa
queda en `ContextLessonDef.curriculumLesson` y el validador lo comprueba (lecciones escritas + 1 +
lecciones nuevas planificadas antes). Los ids (`a1-uNN-context`) no dependen de ninguna posición.

**Antes** (fase C):

| Unidad | Lección | Título | Lectura | Escucha | Desvío del mapa |
|---|---|---|---|---|---|
| U1 | sin número (pos. 11) | un primer encuentro | mensaje de bienvenida | diálogo de presentación | ninguno |
| U2 | ídem | ¿quién es quién? | ficha | conversación Leo–Kate | la escucha no era cL02 |
| U3 | ídem | tarjetas de jugadores | fichas | entrenador–chico | una pregunta medía el país |
| U4 | ídem | la familia de Ana | publicación | conversación con foto | texto y audio se contradecían (bebé varón / nena) |
| U5 | ídem | ¿cuál es el tuyo? | mensaje | conversación | es L7 en el mapa (L6 = plurales) |
| U6 | ídem | un departamento en alquiler | aviso | recorrido | ninguno (falta el plano) |
| U7 | ídem | en el café | menú | pedido | una pregunta era reconocer «apple» |
| U8 | ídem | la semana de Tom | mensaje | mensaje de voz | texto y audio se contradecían (trabaja todos los días / no; estudia en casa / en la escuela) |
| U9 | ídem | el programa del museo | horario | anuncio | es L7 en el mapa (L6 = meses y fechas) |
| U10 | ídem | ¿cómo llego? | cartel | pedir indicaciones | faltaba cR06 (indicaciones escritas) |
| U11 | ídem | una publicación sobre hobbies | publicación | conversación | ninguno |
| U12 | ídem | situaciones de comunicación | mensaje de ayuda | conversación en clase | es L7 «una conversación completa», sólo cL02 y cL05 |

**Después** (fase C.1):

| Unidad | Lección del mapa | Título | Principales (estímulo → objetivo) | Secundarios del mapa (documentación) | Escenario y tipo de estímulo | Preguntas | Resultado |
|---|---|---|---|---|---|---|---|
| U1 | L6 | En contexto: un primer encuentro | mensaje → cR02; diálogo → cL05 | v01 | chat de un curso (mensaje) · dos personas se conocen (2 voces) | 6 | Alineado |
| U2 | L6 | En contexto: ¿quién es quién? | ficha → cR03; la profesora te pregunta → cL02 | g02 | ficha de una clase (descripción, **sin foto**) · primer día de clase (1 voz, preguntas a vos) | 6 | Corregido (escucha) · Pendiente de recurso técnico (foto) |
| U3 | L6 | En contexto: tarjetas de jugadores | fichas → cR01; entrenador–chico → cL03 | v03 | tarjetas de un equipo infantil · diálogo (2 voces) | 6 | Corregido (1 pregunta) |
| U4 | L6 | En contexto: la familia de Ana | publicación → cR03; foto familiar → cL05 | v04 | publicación de Ana · diálogo sobre una foto (2 voces; **la foto no existe**) | 6 | Corregido (coherencia) · Pendiente de recurso técnico |
| U5 | **L7** | En contexto: ¿cuál es el tuyo? | mensaje → cR05; diálogo → cL01 | g06 | objetos encontrados (mensaje) · ordenar la mesa (2 voces) | 6 | Corregido (número de lección) · L6 «Uno, dos, muchos»: No implementado |
| U6 | L6 | En contexto: un departamento en alquiler | aviso → cR03; recorrido → cL04 | p04 | aviso (**sin plano**) · recorrido por la casa (2 voces) | 6 | Alineado · Pendiente de recurso técnico (plano) |
| U7 | L6 | En contexto: en el café | menú → cR01; pedido → cL05 | p10 | menú · camarero y clienta (2 voces) | 6 | Corregido (1 pregunta) |
| U8 | L6 | En contexto: la semana de Tom | mensaje → cR02; mensaje de voz → cL06 | g12 | mensaje a un amigo · mensaje de voz a la mamá (1 voz) | 6 | Corregido (coherencia) |
| U9 | **L7** | En contexto: el programa del museo | horario → cR01; anuncio → cL03 | v09 | horario en la puerta · anuncio por parlantes (1 voz) | 6 | Corregido (número de lección) · L6 «Meses y fechas»: No implementado |
| U10 | L6 | En contexto: ¿cómo llego? | cartel → cR01; pedir indicaciones → cL04; **indicaciones escritas → cR06** | g19 | cartel en una esquina · diálogo en la calle (2 voces) · de la estación al museo (**sin mapa**) | 9 | Corregido (cR06) · Pendiente de recurso técnico (mapa) |
| U11 | L6 | En contexto: una publicación sobre hobbies | publicación → cR02; conversación → cL05 | p06 | publicación de Lily · charla (2 voces) | 6 | Alineado |
| U12 | **L7** | En contexto: una conversación completa | la profesora te habla → cL02; conversación en clase → cL05 | v12 | en clase, a vos (1 voz) · Ben y la profesora (2 voces) | 6 | Corregido (título, número, objetivos, estímulo) · L6 «Mensajes y postales»: No implementado |
| U13 | L6 | En contexto: registro en un hotel | — | — | — | — | No implementado (la unidad no existe) |
| U14 | L6 | En contexto: cliente y vendedor | — | — | — | — | No implementado (la unidad no existe) |

Vocabulario requerido: el validador sigue exigiendo que toda palabra de los estímulos esté enseñada
hasta esa unidad o declarada en `untaught` (lista para la revisión). Cambió U8 (sale `now`); el resto
sigue igual: U1 `is`; U2 `a, class, our`; U3 `number, ok, players, team`; U4 `a, big`; U7 `menu, ok,
or, with`; U8 `at, english, mom, tv`; U9 `children, closes, for, museum, opens, tour, visits`; U10
`take`; U11 `can't, cooking, swimming`; U12 `course, of`. Conceptos principales: los `concepts` de
cada pregunta, todos enseñados hasta la unidad (validador). Los secundarios del mapa (v01, g02,
p04…) quedan en `curriculum.secondary` sólo como documentación: esos objetivos (Vocabulary, Grammar,
Production) todavía no existen en la base y no se inventan.

### C1.4 Cambios realizados

Contenido (`content/en/a1/context.ts`), todo en draft:

1. **U2, escucha → cL02.** La conversación Leo–Kate era entre otras personas (cL05). Ahora la
   profesora Kate te habla a vos: «Hello! My name is Kate. I am your teacher. / Are you a student? /
   And are you tired?». Preguntas: quién te habla; qué te pregunta primero; qué respuesta corresponde
   a la segunda pregunta («No, I am not.» frente a «No, she is not.» y «No, you are not.»). Es la
   forma de evaluar del mapa: «oye la pregunta y elige una respuesta adecuada».
2. **U3, escucha:** «¿De dónde es Max?» (el país no es cL03) → «¿Quién es mayor, Max o su amigo Leo?»
   (relacionar dos edades oídas).
3. **U4, lectura:** «Her baby is a boy» → «a girl». El audio dice que Julia, la única hermana de Ana,
   tiene una nena. Mismos ítems con la misma identidad; sólo cambia el texto.
4. **U7, lectura:** «¿De qué fruta es el jugo?» se resolvía reconociendo «apple» → «¿Qué se puede
   tomar en el almuerzo?» (hay que ubicar la sección LUNCH: sólo agua).
5. **U8, mensaje de voz:** contradecía el mensaje escrito. Ahora: «Hi, Mom. It's Tom. / I live in a
   small apartment. I work at home. / I always get up and read. I don't watch TV. / Bye!». Se
   conserva «¿Dónde trabaja Tom?» (sin «ahora») y cambian las otras dos.
6. **U10, cR06:** estímulo nuevo de **indicaciones escritas** de la estación al museo, con 3 preguntas
   (qué hacer primero, dónde doblar, dónde está el museo). El cartel queda como cR01 (REA-3 incluye
   «directions» en carteles). Va al final de la lección para no mover ítems registrados.
7. **U12:** título «una conversación completa». Se quitó el mensaje escrito de Lucas, que no
   corresponde a cL02 ni a cL05. Entra un audio de la profesora dirigido a vos (cL02): «Good morning!
   What is your name? / Do you speak Spanish? / Please repeat the word slowly.». Preguntas: qué te
   pregunta primero, qué respuesta corresponde («Yes, I do.» frente a «Yes, I am.» y «Yes, it is.») y
   qué te pide que hagas.
8. Metadatos del mapa en cada lección: `curriculumLesson`, `plannedBefore`,
   `curriculum.{primary,secondary}` y `stimulusObjectives`.

Identidad (`content/ids.lock.json`, con `npm run content:ids`, append-only): **10 ids retirados por
reemplazo** (el viejo queda con `withdrawn.replacedBy` y nunca se reutiliza) y **3 altas**. Todos son
ítems «En contexto» sin publicar; ningún ítem del currículo cambió.

| Retirado | Reemplazo | Lugar |
|---|---|---|
| en.ex.psccno5pdnqnuz | en.ex.yadb7e867nggc5 | U2 escucha 1 |
| en.ex.2g5f903nsbwqzi | en.ex.xi7fc124gjv0hs | U2 escucha 2 |
| en.ex.en7bzsopu315fw | en.ex.t3ed5escjrqnxr | U2 escucha 3 |
| en.ex.ctsdzviq3v564d | en.ex.w9usv0y8bxovtv | U3 escucha 1 |
| en.ex.g9f5v8daq6lbq3 | en.ex.z9wm3r1m3n8tae | U7 lectura 2 |
| en.ex.yche5pvavkvxug | en.ex.i94dczua9ctapi | U8 escucha 1 |
| en.ex.avnn9fgnvom7w4 | en.ex.ybbrxlsaql3eut | U8 escucha 3 |
| en.ex.w0d72datecygwd | en.ex.y258gw5mlmpoxl | U12 posición 1 (era lectura) |
| en.ex.0d0az9prs17gmb | en.ex.ndkm8lkntoaigw | U12 posición 2 (era lectura) |
| en.ex.w9ho9e4dql6rgt | en.ex.umf74h75lqm3r1 | U12 posición 3 (era lectura) |
| — (altas) | en.ex.h8fx8ulyxyuui6, en.ex.eyi8sw0cqq9la0, en.ex.pnu0pk38xjc3bv | U10 indicaciones escritas |

Los tres ítems del mensaje de Lucas (U12) quedan retirados con su identidad intacta. Si U12 L6
«Mensajes y postales» los quiere usar, `npm run content:ids -- restore <id>` los reactiva.

Código y validación:

- `content/comprehension-map.ts` (nuevo): tabla del mapa, correspondencia de ids y `cR04` retirado.
- `content/comprehension.ts`: `COMPREHENSION_OBJECTIVES` deriva **un objetivo por código** a partir
  de `stimulusObjectives` (antes, uno por lección y actividad).
- `content/comprehension-checks.ts`: la regla «una lectura y una escucha por lección» se cambió por
  las del mapa. Cada estímulo tiene un objetivo principal de su actividad, cada objetivo principal
  tiene un estímulo, no se usan códigos retirados ni inexistentes, y el número de lección del mapa
  cuadra.
- `content/types.ts`: campos nuevos de `ContextLessonDef`. Se quitó `objectives`, que iba por slug.
- Migración `20261113120100_comprehension_en_a1.sql` **regenerada, sin aplicar**: 12 lecciones sin
  publicar, 75 preguntas, 11 objetivos en draft. SHA-256 `e3e24ef0…17c001ba`, el mismo en dos
  corridas.
- Audio: ver C1.6.

### C1.5 Revisión de las preguntas (72 originales + 3 nuevas)

Criterios: inglés natural A1; sólo vocabulario enseñado o declarado; respuesta inequívoca según el
estímulo; distractores plausibles y del mismo contexto; nada irrelevante. La lectura mide interpretar
el texto y la escucha interpretar el mensaje oral (la transcripción se oculta hasta responder).
Ninguna pregunta se resuelve reconociendo una palabra suelta. Todas siguen **Pendiente de revisión
humana** (P8 y hablante nativo); la columna dice el resultado de esta auditoría.

| Lección | Pregunta | Objetivo | Resultado |
|---|---|---|---|
| U1 L | ¿Quién escribe el mensaje? | cR02 | Alineado |
| U1 L | ¿En qué momento del día escribe? | cR02 | Alineado; roza el reconocimiento de «Good morning» (revisión humana) |
| U1 L | ¿Qué le pregunta Ana a Tom? | cR02 | Alineado |
| U1 E | ¿Qué están haciendo Tom y Lucy? | cL05 | Alineado |
| U1 E | ¿Cómo está Lucy? | cL05 | Alineado; el distractor «No responde» es débil (revisión humana) |
| U1 E | ¿En qué momento del día se encuentran? | cL05 | Alineado |
| U2 L | ¿Quién es el profesor? | cR03 | Alineado |
| U2 L | ¿Cómo está Sam? | cR03 | Alineado |
| U2 L | ¿Qué relación hay entre Mia y Sam? | cR03 | Alineado |
| U2 E | ¿Qué es Kate? / ¿Quién es estudiante? / ¿Cómo está Kate? | (cL05) | **Corregido**: reemplazadas (era una conversación entre otros) |
| U2 E | ¿Quién te habla? | cL02 | Nueva |
| U2 E | ¿Qué te pregunta Kate primero? | cL02 | Nueva |
| U2 E | ¿Qué respuesta corresponde a la segunda pregunta de Kate? | cL02 | Nueva (opciones en inglés: mide la respuesta adecuada) |
| U3 L | ¿De dónde es el jugador número 3? | cR01 | Alineado |
| U3 L | ¿Quién es el más chico de los tres? | cR01 | Alineado |
| U3 L | ¿Qué tienen en común Lucas y Pablo? | cR01 | Alineado |
| U3 E | ¿De dónde es Max? | — | **Corregido** → «¿Quién es mayor, Max o su amigo Leo?» (cL03) |
| U3 E | ¿Cuántos años tiene el amigo de Max? | cL03 | Alineado |
| U3 E | ¿Qué número le da el entrenador a Max? | cL03 | Alineado |
| U4 L | ¿Cuántos hermanos varones tiene Ana? | cR03 | Alineado |
| U4 L | ¿Quién tiene un bebé? | cR03 | Corregido el texto («a girl»); mismo ítem |
| U4 L | ¿Quién es Elena? | cR03 | Alineado |
| U4 E | ¿Quién es el hombre de la foto? | cL05 | Alineado |
| U4 E | ¿Qué tiene Julia? | cL05 | **Corregido** (era ambigua: el texto decía un varón); mismo ítem |
| U4 E | ¿A qué se dedica Julia? | cL05 | Alineado |
| U5 L | ¿Cómo es el libro que encontró Mia? | cR05 | Alineado |
| U5 L | ¿De quién es la lapicera negra? | cR05 | Alineado; «That black pen is my pen» es poco natural, pero «mine» no está enseñado (revisión humana) |
| U5 L | ¿Qué quiere saber Mia sobre las llaves? | cR05 | Alineado |
| U5 E | ¿De qué color es el teléfono de Kim? | cL01 | Alineado |
| U5 E | ¿Qué objeto es de Kim? | cL01 | Alineado |
| U5 E | ¿Cómo termina la conversación? | cL01 | Alineado |
| U6 L | ¿Cuántos dormitorios tiene el departamento? | cR03 | Alineado |
| U6 L | ¿Qué mueble hay en el living? | cR03 | Alineado |
| U6 L | ¿Tiene jardín? | cR03 | Alineado |
| U6 E | ¿Dónde está la cocina? | cL04 | Alineado |
| U6 E | ¿Qué quiere saber Sara primero? | cL04 | Alineado |
| U6 E | ¿Dónde están las llaves? | cL04 | Alineado |
| U7 L | ¿Qué se puede comer en el almuerzo? | cR01 | Alineado |
| U7 L | ¿De qué fruta es el jugo? | — | **Corregido** → «¿Qué se puede tomar en el almuerzo?» |
| U7 L | ¿Qué comida del día no aparece en el menú? | cR01 | Alineado |
| U7 E | ¿Qué quiere comer Emma? | cL05 | Alineado |
| U7 E | ¿Qué quiere tomar? | cL05 | Alineado |
| U7 E | ¿Qué le pregunta Paul a Emma al principio? | cL05 | Alineado |
| U8 L | ¿Qué hace Tom en casa? | cR02 | Alineado |
| U8 L | ¿Qué no hace nunca Tom? | cR02 | Alineado |
| U8 L | ¿Qué hace la hermana de Tom? | cR02 | Alineado |
| U8 E | ¿Tom trabaja todos los días? | — | **Corregido**: contradecía el texto → «¿Dónde vive Tom?» |
| U8 E | ¿Dónde trabaja Tom (ahora)? | cL06 | Corregido (se quitó «ahora»); mismo ítem |
| U8 E | ¿Qué hace Tom en la escuela? | — | **Corregido**: contradecía el texto → «¿Qué hace siempre Tom después de levantarse?» |
| U9 L | ¿Qué día no se puede visitar el museo? | cR01 | Alineado |
| U9 L | ¿A qué hora abre el sábado? | cR01 | Alineado |
| U9 L | ¿Cuándo es la visita para chicos? | cR01 | Alineado |
| U9 E | ¿A qué hora cierra hoy el museo? | cL03 | Alineado |
| U9 E | ¿Qué día es mañana? | cL03 | Alineado; cercano al reconocimiento de «Sunday» (revisión humana) |
| U9 E | ¿Qué pasa mañana a las 9? | cL03 | Alineado |
| U10 L | Si querés ir al parque, ¿hacia dónde tenés que doblar? | cR01 | Alineado |
| U10 L | ¿Dónde está la biblioteca? | cR01 | Alineado |
| U10 L | ¿Qué lugar queda hacia la izquierda? | cR01 | Alineado |
| U10 E | ¿Qué lugar busca Ann primero? | cL04 | Alineado |
| U10 E | ¿Cómo se llega al cine? | cL04 | Alineado |
| U10 E | ¿Qué le aconseja Joe para ir al hotel? | cL04 | Alineado |
| U10 L2 | Al salir de la estación, ¿qué hay que hacer primero? | cR06 | Nueva |
| U10 L2 | ¿Dónde hay que doblar a la izquierda? | cR06 | Nueva |
| U10 L2 | ¿Dónde está el museo? | cR06 | Nueva |
| U11 L | ¿Cuál es el deporte favorito de Lily? | cR02 | Alineado |
| U11 L | ¿Qué no sabe hacer Lily? | cR02 | Alineado |
| U11 L | ¿Qué odia Lily? | cR02 | Alineado |
| U11 E | ¿Qué le encanta a Rose? | cL05 | Alineado |
| U11 E | ¿Qué le gusta más a Dan? | cL05 | Alineado |
| U11 E | ¿Qué sabe hacer Rose? | cL05 | Alineado |
| U12 L | ¿Por qué escribe Lucas? / ¿Qué le pide a la profesora? / ¿Qué quiere saber Lucas? | — | **Corregido**: quitadas de la L7 (sin objetivo del mapa); retiradas y restaurables para U12 L6 |
| U12 E1 | ¿Qué te pregunta primero la profesora? | cL02 | Nueva |
| U12 E1 | ¿Qué respuesta corresponde a su segunda pregunta? | cL02 | Nueva |
| U12 E1 | ¿Qué te pide que hagas al final? | cL02 | Nueva |
| U12 E2 | ¿Qué le pide Ben a la profesora? | cL05 | Alineado |
| U12 E2 | ¿Cuántos libros tiene Ben? | cL05 | Alineado |
| U12 E2 | ¿Por qué el libro de inglés es su favorito? | cL05 | Alineado |

Totales de las 72 originales:

- **59 alineadas sin cambios**, cuatro de ellas con una nota para la revisión humana.
- **3 corregidas en el mismo ítem**: U4 L «¿Quién tiene un bebé?» y U4 E «¿Qué tiene Julia?», por el
  texto, y U8 E «¿Dónde trabaja Tom?», por la redacción.
- **10 reemplazadas**: U2 E ×3, U3 E ×1, U7 L ×1, U8 E ×2 y U12 L ×3.

Hay **13 nuevas**: los 10 reemplazos y 3 de U10. Total actual: **75 preguntas**, 25 estímulos y 75
ítems con versión. No hay preguntas sin estímulo ni estímulos sin versión (lo prueban `versions` y
`comprehension`), y nada es de A2. Las dos preguntas con opciones en inglés (U2 y U12, cL02) no
aparecen en el audio, así que no se resuelven copiando.

Queda un pendiente del mapa sin resolver en el contenido (revisión humana). cR02 habla de mensajes
«que proponen qué hacer, cuándo y dónde». Los de U1, U8 y U11 son de presentación, rutina y gustos,
como dice la tabla del mapa, pero no proponen un plan. En U8 no se puede hacer sin los días, que se
enseñan recién en U9. Queda para la revisión pedagógica.

### C1.6 Estado real de los audios (`expo-speech`)

Verificado contra `expo-speech` ~58.0.3 (SDK 58), con los tipos instalados y
docs.expo.dev/versions/v58.0.0/sdk/speech.

| Pregunta | Respuesta (implementación) |
|---|---|
| ¿Qué voces ofrece el dispositivo? | Las del motor TTS del sistema: `getAvailableVoicesAsync()` → `{identifier, name, language, quality}`. iOS: voces de Apple compact, enhanced o premium, todas locales. Android: las del motor por defecto, con variantes `-local` y `-network`. La app no trae voces propias. |
| ¿Cómo se eligen? | `voiceScore`: primero el locale exacto (en-US), después otras variantes del idioma. Descarta las voces de efectos y las Eloquence. Ordena premium > enhanced > compact, y `-local` desempata. `a` es la mejor voz y `b` la mejor **de otro hablante**. |
| ¿Dos voces realmente distintas? | **Corregido.** Antes bastaba con que `b` tuviera otro `identifier`, así que «Samantha compact» y «Samantha enhanced», o `iol-local` e `iol-network`, contaban como dos voces y eran la misma persona. Ahora `voiceSpeaker()` compara el hablante: el nombre sin la calidad en iOS y sin `-local`/`-network` en Android. |
| ¿Si hay una sola voz? | `b` usa la misma voz con tono 1.25, para separar las líneas. **Ya no se presenta como una segunda voz**: `dialogueVoices` devuelve `distinct: false` y, en los diálogos, la tarjeta dice «Tu dispositivo tiene una sola voz en inglés: los dos hablantes usan la misma voz, sólo con otro tono». |
| ¿Si no hay voz en inglés? | `available: false`. El motor recibe `language: en-US` sin una voz concreta y puede sonar con otra voz o no sonar. La tarjeta dice «Tu dispositivo no tiene una voz en inglés instalada: puede sonar con otra voz del sistema». |
| ¿Velocidad? | La del estímulo: 0.85 en todo A1 (el validador admite 0.75–0.9). La tortuga baja a 0.5. Nunca se acelera (probado). |
| ¿Sin conexión? | iOS: las voces son locales y funcionan. Android: una voz `-network` falla sin conexión. **Corregido para diálogos**: se penalizan las voces de red, así que se prefiere una `-local` aunque la de red sea un poco mejor. Si igual falla, llega `onError`. Además, la lección necesita al servidor para corregir: sin conexión aparece «Reintentar» (sin cambios). |
| ¿Si la síntesis falla? | `onError` → «No se pudo reproducir el audio. Tocá el parlante para intentar de nuevo». La pregunta se puede responder igual; la transcripción se muestra recién al responder. |
| ¿Qué cambió en el reproductor? | Sólo un aviso de texto en `ContextStimulus` (`onVoices`). El diseño, los controles y el flujo no cambiaron. |

Estado de los 13 audios (de 25 estímulos, 13 son de escucha y 12 de lectura): **todos son TTS en el
dispositivo**. Ninguno es audio grabado ni revisado por personas, y no hay archivos, URLs ni proveedor
de pago. La transcripción de referencia es el guion de la versión inmutable.

- Diálogos de dos hablantes: U1, U3, U4, U5, U6, U7, U10, U11 y U12 (conversación). Necesitan dos
  voces distintas. Si el dispositivo tiene instaladas dos o más voces de hablantes distintos, suenan
  dos voces. Si no, suena una voz con dos tonos y la app lo avisa.
- Monólogos (una voz): U2, U8, U9 y U12 (la profesora).

**Pendiente de recurso técnico**: escucharlos en iOS y Android reales; hoy sólo hay pruebas con el
motor simulado. **Pendiente de revisión humana**: prosodia y naturalidad.

### C1.7 Revisión de privacidad

Regla de §13.2 de la arquitectura: `content_personas` es obligatorio para un ejercicio **de texto
libre** que pide datos de una persona (privacidad `fictional`). Ningún ejercicio puede pedir datos
reales del alumno.

| Estímulo | Datos de personas | Evaluación |
|---|---|---|
| U3, tarjetas de jugadores | nombre de pila, número de camiseta, país y edad (11–12) de 3 chicos ficticios | Alineado. Son personajes ficticios, sin apellido ni contacto. La pregunta es cerrada (`closed`): el alumno elige, no escribe datos. No requiere `content_personas`. |
| U3, entrenador y chico | Max, 10 años, de México; Leo, 11 | ídem |
| U1, U2, U4, U5, U8, U10, U11, U12 | nombres de pila (Ana, Tom, Kate, Julia…) y relaciones familiares | Alineado (nombres declarados en `names`, como exige el validador) |
| U2 y U12 (cL02, «te habla a vos») | preguntas al alumno: «Are you a student?», «What is your name?», «Do you speak Spanish?» | Alineado. El alumno no da sus datos: elige qué le preguntaron o qué forma gramatical corresponde. La respuesta correcta es fija y no dice nada del alumno (`closed`). |
| Todos | direcciones, teléfonos, correos, formularios | Ninguno. El validador rechaza correos, URLs y secuencias de dígitos de teléfono. |

No hay datos personales reales y **esta fase no necesita ninguna fila de `content_personas`**. Las
van a necesitar U13 (L4 teléfono, email y dirección; L5 formulario FF; L6 registro en un hotel) y los
FF y GW de p01 y p08. Antes de cargar la primera persona falta la lista de exclusión editorial
(`PUBLIC_FIGURE_EXCLUSIONS`, hoy vacía; LEARNING_CATALOG_PHASE1 §10). Eso queda **No implementado**,
fuera de esta tarea. Para la revisión humana: confirmar si las edades de menores ficticios en U3 son
aceptables editorialmente (técnicamente no son datos personales).

### C1.8 Contratos e integración

| Verificación | Resultado |
|---|---|
| `context_choice` y versiones inmutables | Sin cambios de contrato. El estímulo va dentro de la versión y de su hash. Las preguntas de un mismo estímulo comparten `stimulus.id` y contenido (validador). |
| Preguntas con sus opciones | Cada ítem tiene su fila en `exercise_option_sets` (`option-sets` y `presentations` en test:db). |
| Servidor como autoridad | `gradeWithSpec(exact_option.v1)` sobre la versión presentada. El cliente sólo guarda `client_verdict`. Una opción inventada o alterada no se acepta (test:db `comprehension`). |
| ¿El cliente puede alterar la respuesta correcta? | No: el veredicto sale de la versión del servidor, no del payload del cliente. |
| `learning-session` v3 | **Sin cambios**: no se tocó `supabase/functions/` y no se encontró ningún defecto de integración. |
| Repasos léxicos | `words` está vacío (sin `exercise_words`, fuera del SRS v1) y los ítems son `draft` (fuera de `review_item_candidates`). Probado en test:db. |
| Motores | SRS v2, Mastery, Adaptive y Display siguen apagados (probado). Ranked y SRS v1 no cambiaron. |
| Recorridos activos | Lecciones y ejercicios con `is_published = false`. `CURRICULUM_PATH` no contiene lecciones de contexto (Jest). |

### C1.9 Pruebas y resultados

Corrida final (2026-11-09, local; `test:db` y Jest uno después del otro, con todos los cambios):

| Validación | Resultado |
|---|---|
| `npm run typecheck` (app + scripts) | exit 0 |
| `npx expo lint` | exit 0, sin problemas |
| `npx jest --ci` | 6131/6132 tests, 62/63 suites. La que falla es **intermitente y ajena**: `profile/report.test.tsx` superó el timeout de 5 s (la suite tardó 78 s bajo carga). Aislada: 2/2. |
| `npm run test:db` (PGlite, todas las migraciones) | 324/325. La que falla es **intermitente y ajena**: `humanmatch` › «empieza en ~5 s» (11 s bajo carga; ya registrada en §11). Aislada junto con `comprehension` y `learning`: 45/45. |
| Identidad (`identity.test.ts`, `content:ids -- check`) | OK: 4283 ids, 13 nuevos, 10 retirados por reemplazo, 0 reutilizados |
| Versionado (`versions` en Jest y test:db) | OK: 75 versiones, una por pregunta, cada una con su estímulo |
| Determinismo | la migración generada dos veces da el mismo SHA-256 `e3e24ef0…17c001ba`; catálogo y versiones idénticos en dos corridas (Jest) |
| Contenido (`comprehension.test.ts`, 33 tests) | OK, incluida la tabla del mapa copiada a mano (`MAP_TABLE`) y 5 mutaciones nuevas: código retirado, actividad equivocada, objetivo principal sin estímulo, número de lección equivocado y estímulo sin objetivo |
| Privacidad | validador: sin datos de contacto y con los nombres declarados; `phase1` (personas) sin cambios |
| Reproductor (`ContextLesson.test.tsx`, `speechDialogue.test.ts`) | OK, con las pruebas nuevas: aviso de una sola voz, sin voz en inglés, misma voz en otra calidad o red/local, preferencia por voces locales y `onVoices` |
| test:db `comprehension` | 11 objetivos `cl01…cr06` en draft con `cefr_ref`; relaciones compartidas entre lecciones; ítems draft fuera de los repasos; lecciones sin publicar; corrección en servidor |

Comprobaciones pedidas:

- Cada objetivo de comprensión tiene ejercicios vinculados: sí, entre 3 y 15.
- No hay objetivos duplicados: uno por código.
- No se reutilizan objetivos ni ids retirados: el validador rechaza `cR04` y el registro, los retirados.
- No hay lecciones de contexto fuera de su unidad: el id es `a1-uNN-context` y la unidad la del mapa.
- No hay preguntas sin estímulo ni estímulos sin versión.
- No hay respuestas ambiguas: una opción correcta exacta, sin opciones repetidas aunque se ignoren
  tildes y mayúsculas, y con el estímulo explicado.
- Los ítems draft no entran en recorridos activos ni en repasos.

Pruebas que se cambiaron porque fijaban el modelo anterior:

- `identity.test.ts` exigía que no hubiera retirados; ahora exige que sean exactamente los 10 de la C.1,
  con su reemplazo vigente.
- `learning.test.mjs` tenía 72 preguntas escritas a mano; ahora el número sale del contenido.
- `comprehension.test.mjs` exigía `cefr_ref` vacío y una lección por objetivo; ahora pide las anclas
  y relaciones compartidas.

**No ejecutado**: los arneses PG 17 y Deno e2e (la Edge Function no cambió) y pruebas en
dispositivos reales.

### C1.10 Lo que todavía requiere revisión humana

1. **Revisión pedagógica (P8)** de las 75 preguntas, sus distractores y sus explicaciones, y de qué
   objetivo evalúa cada estímulo. En especial: cR05 y cL01 en U5, que el mapa practica con imágenes
   (LM), y cR02 sin «propuesta» en U1, U8 y U11.
2. **Hablante nativo**: inglés natural A1, incluidas las palabras `untaught` y las notas de C1.5.
3. **Escucha en iOS y Android reales**: qué voces hay, si los dos hablantes se distinguen y la
   velocidad.
4. **Anclas del MCER** contra el PDF 2020 (mapa §0), antes de mostrar cualquier cita.
5. **Decisión de producto (D2).** El mapa ordena «En contexto» antes de la consolidación generada;
   hoy va después, en la posición 11. Moverla cambiaría la posición de lecciones publicadas
   (`listen`, `words`, `final`) y el desbloqueo. Es una contradicción entre el mapa y el desbloqueo
   actual: está documentada y no se resolvió. Hay que decidirla junto con D2, antes de publicar.
6. Edades de menores ficticios en U3 (C1.7).

Pendiente de recurso técnico: el apoyo visual de cR03 (foto de la ficha de U2 y de la familia de U4,
plano de U6), el mapa de U10 (cR06 y cL04) y las imágenes de cR05 y cL01. `ReadingStimulus` no admite
imágenes: agregarlas sería un cambio de contrato, y no se hizo.

### C1.11 Estado final de cada lección

| Lección | Estado |
|---|---|
| a1-u01-context (L6) | Alineado con el currículo · Pendiente de revisión humana |
| a1-u02-context (L6) | Corregido (escucha cL02) · Pendiente de recurso técnico (foto) · Pendiente de revisión humana |
| a1-u03-context (L6) | Corregido (1 pregunta) · Pendiente de revisión humana |
| a1-u04-context (L6) | Corregido (coherencia texto/audio) · Pendiente de recurso técnico (apoyo visual) · Pendiente de revisión humana |
| a1-u05-context (L7) | Corregido (número de lección) · Pendiente de recurso técnico (imágenes LM/RQ) · Pendiente de revisión humana |
| a1-u06-context (L6) | Alineado · Pendiente de recurso técnico (plano) · Pendiente de revisión humana |
| a1-u07-context (L6) | Corregido (1 pregunta) · Pendiente de revisión humana |
| a1-u08-context (L6) | Corregido (coherencia texto/audio) · Pendiente de revisión humana |
| a1-u09-context (L7) | Corregido (número de lección) · Pendiente de revisión humana |
| a1-u10-context (L6) | Corregido (se agregó cR06) · Pendiente de recurso técnico (mapa) · Pendiente de revisión humana |
| a1-u11-context (L6) | Alineado · Pendiente de revisión humana |
| a1-u12-context (L7) | Corregido (título, objetivos y estímulo cL02) · Pendiente de revisión humana |
| U5 L6, U9 L6, U12 L6 | No implementado (lecciones nuevas del mapa, fuera de esta tarea) |
| U13 y U14 completas | No implementado |

Todas siguen en `draft`, sin publicar y sin revisión de hablantes nativos.

---

## C2. Fase C.2 — U13 y U14 de inglés A1 (2026-11-09)

Todo **local**: nada aplicado en producción, sin commits, sin staging, sin build ni EAS, sin cambios en
`supabase/functions/` ni en SRS v1/v2, Mastery, Adaptive, Ranked o el desbloqueo. Contenido en
**draft**, sin revisión pedagógica ni nativa. Las 12 lecciones de la C.1 no cambiaron (su migración
tampoco: mismo SHA-256 `e3e24ef0…17c001ba`, lo comprueba `comprehension.test.mjs`).

### C2.1 Qué pide el mapa

Del mapa (§3) sólo se implementó la L6 «En contexto» de cada unidad nueva. Sus L1–L5 (alfabeto,
deletreo, nacionalidades, contacto, formulario; números 21–100, precios, *how much*, *a cup of*, en la
tienda) **no existen** y no eran parte de esta fase.

| Unidad | Lección del mapa | Principales (estímulo → objetivo) | Secundario (documentación) | Va después de |
|---|---|---|---|---|
| U13 Letras y datos personales | L6 En contexto: registro en un hotel | ficha → **cR01**; recepcionista que te habla → **cL02** | p01 | U3 |
| U14 Precios y compras | L6 En contexto: cliente y vendedor | cartel de precios → **cR01**; cliente y vendedora → **cL05**; anuncio de supermercado → **cL03** | p10 | U7 |

No se creó ningún objetivo: los cuatro son de los 11 existentes. cL05 ya lo practicaban U1, U4, U7,
U11 y U12; cR01, U3, U7, U9 y U10; cL02, U2 y U12; cL03, U3 y U9.

### C2.2 Unidades planificadas (decisión técnica)

`content:diff` rechaza altas de lecciones (D2), y meter U13/U14 en `COURSES` sin sus L1–L5 cambiaría
el camino generado y los totales que comparan la base con `content/`. Además el mapa las
intercala después de U3 y U7, pero el id de unidad sale de la posición (mapa §8, punto 3).
Solución, sin tocar el esquema ni el desbloqueo:

- `PlannedUnitDef` (`content/types.ts`) y `EN_A1_PLANNED_UNITS` (`content/en/a1/context-planned.ts`):
  unidad sin palabras ni lecciones, con `after` (unidad del mapa tras la que va: 3 y 7),
  `reservedPositions` (10) y `plannedLessons` (las L1–L5 que faltan).
- Ids `a1-u13` y `a1-u14` (los que propone el mapa). Posición **13 y 14, provisional**: las 12
  unidades escritas no se mueven. Ordenarlas como dice el mapa depende de separar id y posición (§8.3)
  y del desbloqueo (D2), ambos fuera de esta fase.
- La «En contexto» va en la **posición 11**, la misma que en U1–U12: 1–10 quedan para las 5 lecciones
  escritas y su consolidación (un test comprueba que toda unidad escrita de inglés A1 ocupa 10).
- La migración crea las dos unidades con `is_published = false` (reaplicarla no cambia ese valor), sin
  palabras. RLS sólo muestra unidades publicadas: la app no las ve ni puede empezar sus lecciones
  (`lesson_not_found`), y `is_lesson_unlocked` sólo encadena lo publicado.
- **Vocabulario**: el validador mide lo enseñado hasta `after` (U3 para U13, U7 para U14), no hasta la
  posición 13/14. Así un concepto target de U4 se rechaza en U13 y lo que todavía no se enseñó queda
  en `untaught`: casi todo es lo que tienen que enseñar las L1–L5 que faltan.

### C2.3 Persona ficticia (`content_personas`)

U13 muestra una ficha de hotel con datos personales completos (WRI-5, LIN-5), así que usa la estructura
de §13.2 tal como está:

- `en.persona.sofia-ruiz` en `CONTENT_PERSONAS` (`content/personas.ts`): Sofia Ruiz, 29, Puebla,
  Mexico, `555-0142` (rango 555-01xx, reservado para ficción en el plan norteamericano),
  `sofia.ruiz@example.com`. Pasa `personaProblems` y `personaPrivacyProblems` (también contra los
  correos de los usuarios de prueba). La carga `PERSONAS_SQL`, que aborta si una persona ya cargada
  cambia.
- `ContextLessonDef.persona` (nuevo, opcional) y `personalData: { persona }` en **cada** pregunta de
  U13. La privacidad sigue **`closed`**: son preguntas de opción y el alumno no escribe datos
  (`responsePrivacyOf`). No se usa `fictional` ni `learner`.
- En la escucha, el alumno **hace de** Sofia: el recepcionista le pregunta a ella. Nunca se piden ni se
  muestran datos del alumno (P4).
- Validador: en una lección con persona, los únicos datos de contacto admitidos en un estímulo son el
  teléfono y el correo de esa persona (otro número o un correo distinto se rechazan), toda pregunta
  la cita, y su nombre está en `names`. En una lección sin persona sigue prohibido todo dato de
  contacto y citar una persona.
- El vínculo ítem → persona no se guarda en la base (no hay columna: LEARNING_CATALOG_PHASE1 §10,
  punto 2). Los datos quedan copiados en la versión inmutable de cada pregunta, que es lo que exige
  §13.2. `PUBLIC_FIGURE_EXCLUSIONS` sigue vacía (lista editorial): es parte de la revisión antes de
  publicar.

### C2.4 Contenido

**U13 · `a1-u13-context` · En contexto: registro en un hotel** (7 preguntas, 2 estímulos)

| Estímulo | Objetivo | Pregunta | Qué exige |
|---|---|---|---|
| `en.stim.a1-u13-hotel-form` (documento `form`, nuevo) | cR01 | ¿Cuál es el apellido de la huésped? | distinguir *Surname* de *First name* y *City* (los tres distractores están en la ficha) |
| | cR01 | ¿Qué indica el 12 de la ficha? | relacionar el número con su campo (*Room*, no *Nights*) |
| | cR01 | ¿De dónde viene Sofia? | *City* + *Country* frente a la habitación del hotel |
| `en.stim.a1-u13-reception` (1 voz, Mark) | cL02 | ¿Qué te pregunta primero Mark? | *surname* frente a su propio nombre |
| | cL02 | ¿Qué respuesta corresponde a su segunda pregunta? | *How do you spell it?*: «it» es el apellido → R-U-I-Z |
| | cL02 | ¿Qué respuesta corresponde a su tercera pregunta? | *Where are you from?* → «I am from Mexico.» |
| | cL02 | ¿Qué te pide Mark que hagas? | la instrucción *write your phone number* (no el correo) |

**U14 · `a1-u14-context` · En contexto: cliente y vendedor** (9 preguntas, 3 estímulos)

| Estímulo | Objetivo | Pregunta | Qué exige |
|---|---|---|---|
| `en.stim.a1-u14-shop-prices` (cartel) | cR01 | ¿Cuánto cuesta una bolsa chica? | ubicar el precio por tamaño |
| | cR01 | ¿Cuánto pagás por dos tazas blancas? | entender la oferta (10, no 2 × 6) |
| | cR01 | ¿Qué es lo más caro del cartel? | comparar precios |
| `en.stim.a1-u14-at-the-shop` (2 voces, Nina y Jack) | cL05 | ¿Quién es Nina? | el rol por *Can I help you?* y los precios |
| | cL05 | ¿Qué compra Jack al final? | pregunta por la grande pero elige la chica y una taza |
| | cL05 | ¿Cuánto paga Jack? | *thirty-six dollars* (30 + 6) |
| `en.stim.a1-u14-supermarket-announcement` (1 voz) | cL03 | ¿Cuánto cuesta hoy una bolsa grande de café? | 25 frente a 35 y 15 |
| | cL03 | ¿Qué podés comprar con 3 dólares? | cantidad: dos botellas, no una |
| | cL03 | ¿Qué cuesta 15 dólares? | asociar precio y producto |

El diálogo de U14 pasa en la tienda del cartel y sus precios coinciden (lo prueba un test). Palabras
no enseñadas hasta `after`: U13 `city, do, email, first, here, hotel, key, mexican, nationality,
number, ok, phone, registration, room, spell, surname, what, write`; U14 `bottles, can, dollars,
forty, help, here, i'd, like, much, of, ok, prices, supermarket, thirty, today`.

**Totales C.2**: 2 lecciones, 5 estímulos (2 de lectura, 3 de audio), **16 preguntas = 16 ejercicios
= 16 ítems** draft, 16 versiones, 16 conjuntos de opciones, 68 filas de `item_concepts`, 5 relaciones
lección-objetivo, 16 ítem-objetivo, 2 unidades, 1 persona. **Fase C completa**: 14 lecciones, 30
estímulos, 91 preguntas, 426 `item_concepts`, 11 objetivos, 30 lecciones-objetivo.

Ids nuevos (`npm run content:ids`, append-only; 0 reemplazos, 0 retirados): U13
`en.ex.v0nf78b4lmocz9`, `bnjty0096ku4lp`, `1ke3ziwdl5v6wn`, `r79q5uqwoiv7nu`, `rzhqiwn55sau19`,
`ylvadbqw81gu23`, `f4xt6m9qpxob7q`; U14 `nmshzbes22rde7`, `gzzrzq21i18kmn`, `8cm6u13rr55dtg`,
`sumamygj2tze5c`, `qj84cmdzctv365`, `v52w4zd7ico8sy`, `f95v0wtlwzl077`, `0oghles4rn3866`,
`kwbnr4xbthebww` (todos `en.ex.…`). Registro: 4299 ids.

### C2.5 Audio y app

- Mismo TTS local (`expo-speech`, `speakDialogue`), sin dependencias nuevas ni archivos de audio.
  U13: monólogo del recepcionista (voz `a`); U14: diálogo con voces `a`/`b` (y el aviso de una sola
  voz si el dispositivo no tiene dos) y un anuncio de una voz. Velocidad 0.85.
- Documento nuevo **`form`** («FORMULARIO») en `READING_DOCUMENTS`: el único cambio de contrato, y
  sólo agrega un valor (zod del cliente y etiqueta de la tarjeta). El servidor no valida tipos de
  documento y la v3 no cambia. Una build anterior ya no podía abrir lecciones `context_choice`, así
  que el requisito de build de §8 no cambia.

### C2.6 Migración

`supabase/migrations/20261113120200_comprehension_en_a1_u13_u14.sql`, **sin aplicar**, generada con
`npm run content:comprehension`. Contiene todo el contenido de la fase C (idempotente): aplicada
después de la 20261113120100 deja esas 12 lecciones idénticas (lo prueba un test fila a fila) y agrega
las dos unidades, las dos lecciones, la persona y los ítems de U13/U14. SHA-256
`45ed577e…8628509e`, el mismo en dos corridas. La 20261113120100 no se regeneró. Reaplicar la de la
C.1 *después* de la C.2 aborta (ya no tiene las relaciones nuevas de los objetivos): el orden de las
migraciones lo evita, y no es una operación prevista.

### C2.7 Pruebas

Suites ampliadas: `content/__tests__/comprehension.test.ts` (42: 9 nuevas de U13/U14),
`ContextLesson.test.tsx` (6 nuevas: `form`, monólogo, diálogo + anuncio, sesión completa de U13 y de
U14, payload desde la base), `comprehension.test.mjs` (C.1 intacta, C.2 superconjunto, unidades sin
publicar e invisibles, persona y privacidad). Ajustadas porque fijaban «no hay personas»:
`identity.test.ts`, `phase1.test.ts`, `catalog.test.mjs`; y la lista de migraciones posteriores en
`legacyReviewRetirement.test.mjs`.

Corrida final (2026-11-09, local):

| Validación | Resultado |
|---|---|
| `npm run typecheck` · `npx expo lint` | exit 0 · exit 0 |
| `npx jest --ci` | **63/63 suites, 6147/6147** |
| `npm run test:db` | 327/328. Falla **sólo** el intermitente ya registrado `humanmatch` › «empieza en ~5 s» (tiempo bajo carga, §11); aislado 10/10. Las suites tocadas por la C.2, corridas después del último cambio: 29/29 (`comprehension`, `catalog`) y 110/110 antes (con `items`, `learning`, `legacyReviewRetirement`, `presentations`, `versions`) |
| `npm run content:ids -- check` | OK (4299 ids, 16 nuevos) |
| Migración generada dos veces | mismo SHA-256 `45ed577e…8628509e`; la de la C.1 sigue en `e3e24ef0…17c001ba` |

Dos defectos de la propia C.2 que encontraron las corridas completas, ya corregidos: (1) la prueba de
PGlite escribía el correo de la persona literal, y `personaPrivacyProblems` lo tomó como el de un
usuario de prueba (la regla funcionó): ahora lo lee de `content/personas.ts`; (2) la sesión completa de
U14 (9 preguntas) superaba el timeout de 5 s de Jest con la suite entera: tiene 30 s explícitos.

### C2.8 Pendiente antes de publicar (no bloquea esta fase)

Lo de §C1.10, más: escribir U13 L1–L5 y U14 L1–L5; decidir el orden de U13/U14 (separar id y posición,
§8.3 del mapa) junto con D2; completar `PUBLIC_FIGURE_EXCLUSIONS`; revisión nativa de los guiones
(«Here you are», *I'd like*) y de la ficha.

## C3. Fase C.3 — U13 y U14 L1–L5 de inglés A1 (2026-11-09)

Todo **local**: nada aplicado en producción, sin commits, sin staging, sin build ni EAS, sin cambios en
`supabase/functions/` ni en SRS v1/v2, Mastery, Adaptive, Ranked, el orden curricular o el desbloqueo.
Contenido en **draft**, sin revisión pedagógica ni nativa. Las 14 lecciones «En contexto» no cambiaron
(la migración de la C.2 sigue en `45ed577e…8628509e` y es la salida exacta de su generador).

### C3.1 Contenido (mapa §3)

| Lección | Título | Objetivos del mapa | Palabras nuevas | Reutilizadas |
|---|---|---|---|---|
| a1-u13-l01 | El alfabeto | v02 · cL01 | alphabet, letter | — |
| a1-u13-l02 | Deletrear | v02 · cL02 | spell, how do you spell it, double | — |
| a1-u13-l03 | Nacionalidades | v02 · g02 | nationality, Argentinian, Mexican, American | what, Spanish, English (U12) |
| a1-u13-l04 | Teléfono, email y dirección | v02, v03 | number, phone number, address | email (A2 U10) |
| a1-u13-l05 | Completar un formulario | p01 · cR01 | form, first name, surname, age | city (U10) |
| a1-u14-l01 | Del 21 al 100 | v03 | thirty … ninety, one hundred | — |
| a1-u14-l02 | Precios y dinero | v03 · cL03 | dollar, cent | price, money, cheap, expensive (A2 U6) |
| a1-u14-l03 | How much, how many | g16, v03 | — | how much, how many (U12) |
| a1-u14-l04 | Una taza de, una botella de | g23, v07 | a cup of, a glass of, a bottle of, a kilo of, I'd like | — |
| a1-u14-l05 | En la tienda | p10 · v12 | anything else, that's all, here you are | — |

Cada lección: introducción con 2–3 ejemplos, 10 ejercicios (reconocimiento → práctica guiada → escucha
→ dos de producción al final) y 2 cierres. Tipos existentes, sin tipos ni componentes nuevos. FF, LD y GW
del mapa no existen: el formulario se practica con `fill_blank` por campo y `short_answer` sobre la
ficha; el deletreo, con `listen_choice` y `short_answer`.

**Palabras reutilizadas** (`PlannedWrittenUnitDef.borrowed`): el mapa adelanta palabras que ya existen
en unidades cargadas posteriores (U10, U12) o en A2. Se reutiliza la palabra (su id y su concepto); no
se duplica. El validador exige que la palabra exista después de `after` y rechaza un texto que ya sea
otra palabra.

**Datos personales**: sólo los de la persona ficticia `en.persona.sofia-ruiz` (ya cargada en la C.2),
citada con `personalData` en los 7 ejercicios que los muestran. Las 3 respuestas libres sobre ella son
`fictional`; nunca se piden datos del alumno (P4). Sin teléfonos ni correos inventados.

**Números**: U14 no usa 0, 13, 14 ni 16–19 (U3 todavía no los enseña: mapa §3, U3 «M»).

### C3.2 Camino y unidades planificadas

- `content/planned.ts`: `PLANNED_PATH`, fuera de COURSES y de CURRICULUM_PATH (como la fase C), con el
  camino estándar de `unitPath`: L1 · L2 · Repaso · L3 · L4 · Repaso · L5 · Escucha · Palabras · Repaso
  final en las posiciones 1–10 reservadas en la C.2; la «En contexto» sigue en la 11.
- `unitPath(…, { unitWordsOnly: true })` (opción nueva, por defecto apagada: el camino de las unidades
  cargadas no cambia): los repasos sólo generan ejercicios de las palabras propias. Sin esto, un repaso
  de U13 generaría `en.gen.listen_choice.en-mexico`, que ya es un ítem activo de U3.
- `ITEM_REGISTRY_PATH` y `registryCatalog()` incluyen el camino nuevo y fallan si un ítem repite el id
  de otro tramo.

### C3.3 Validación del contenido (`content/planned-checks.ts`)

Títulos y objetivos principales iguales a `plannedLessons`; estándar de lección; palabras nuevas sin
ids ni textos repetidos; **secuencia** (una lección sólo usa lo enseñado hasta `after` o lo que la
unidad introdujo en esa lección o antes); **límite de vocabulario** sobre todo el texto en inglés
(respuestas, opciones, frases, audio, ejemplos, consolidación generada), con U13 medido hasta U3 y U14
hasta U7; privacidad de datos de contacto. Lo usan las pruebas y el generador (no escribe si falla).

De lo que las «En contexto» marcaban como no enseñado, L1–L5 enseñan casi todo. Queda (vocabulario del
hotel y la tienda que el mapa no pone en L1–L5): U13 `here, hotel, key, ok, registration, room, write`;
U14 `can, help, ok, supermarket, today`.

### C3.4 Objetivos

No se crean objetivos. Se reutilizan los de comprensión que el mapa asigna (rol `practice`): U13 L1 →
cL01 (con sus 3 escuchas, formato LC), U13 L2 → cL02, U13 L5 → cR01 (con las 2 preguntas sobre el
formulario, formato RQ), U14 L2 → cL03. Un ítem sólo se vincula si su formato está en «Practicar» del
mapa: cL02 (LQ/LM) y cL03 (LD/LQ) quedan sin ítems. Los principales (v02, v03, g16, g23, p01, p10)
siguen sin existir en la base, como en la C.1 y la C.2; quedan en `PlannedWrittenUnitDef.curriculum`.
`content/planned-objectives.ts` arma los cuatro objetivos con sus relaciones completas.

### C3.5 Ids y registro

`npm run content:ids`: 100 ids escritos nuevos (`en.ex.…`) y 65 ítems generados registrados, 0
reemplazos, 0 retirados. Registro: 4299 → **4464** ids.

### C3.6 Migración

`supabase/migrations/20261113120300_planned_lessons_en_a1_u13_u14.sql`, **sin aplicar**, generada con
`npm run content:planned -- <archivo>` (`scripts/build-planned-units-sql.ts`, `scripts/planned-units-sql.ts`).
SHA-256 `5d240802…fba3e2cf`, el mismo en dos corridas. **Sólo agrega**: palabras, lecciones y ejercicios
con `on conflict do nothing`, y si una fila ya cargada difiere, aborta. Contenido: 34 palabras, 20
lecciones y 200 ejercicios sin publicar; 34 conceptos y 165 ítems en `draft`; 305 `item_concepts`; 165
versiones; 95 conjuntos de opciones (110 ubicaciones de elección); 322 `exercise_words`; 4 lecciones-objetivo
y 5 ítems-objetivo nuevos. Con `exercise_words` (a diferencia de la comprensión) porque son lecciones
de vocabulario: sin publicar nadie las responde, así que no generan progreso.

Reaplicar la C.2 **después** de la C.3 aborta (la C.3 amplía las relaciones de cuatro objetivos), igual
que reaplicar la C.1 después de la C.2; el orden de las migraciones lo evita. Una migración futura de la
fase C que recargue esos objetivos tiene que usar `PLANNED_OBJECTIVES`.

### C3.7 Pruebas

Nuevas: `content/__tests__/planned.test.ts` (218: estructura, secuencia y límites con casos negativos,
integridad y corrección de cada uno de los 200 ejercicios, ids, privacidad, objetivos) y
`supabase/tests/planned.test.mjs` (13: generador exacto, sin sentencias destructivas, **add-only fila a
fila** sobre la base de la C.2, reaplicar sin cambios, abortar ante una fila distinta, sin publicar e
invisibles para la app y la palabra del día, ítems fuera de los repasos, desbloqueo sin cambios, y las 20
lecciones jugadas con la corrección del servidor en la base desechable). Ajustadas porque fijaban
totales o «U13/U14 sin lecciones escritas»: `comprehension.test.ts`, `comprehension.test.mjs`,
`catalog.test.mjs`, `items.test.mjs`, `versions.test.mjs`, `presentations.test.mjs`, `learning.test.mjs`
y `legacyReviewRetirement.test.mjs`.

### C3.8 Pendiente antes de publicar (no bloquea esta fase)

Revisión pedagógica y nativa de las diez lecciones (en especial nacionalidades, *I'd like*, *Here you
are*); el audio TTS de letras sueltas y deletreos («A, E, I», «G-A-R-C-I-A») en dispositivo; los
objetivos v/g/p del mapa; el 0 y el 13–19 en U3; y lo de §C2.8 salvo las L1–L5: orden de U13/U14
(separar id y posición) y desbloqueo, que son la fase siguiente.

## C4. Fase C.4 — Versiones del recorrido y desbloqueos de inglés A1 (2026-11-10)

Todo **local**: migración sin aplicar, sin commits, sin build ni EAS, sin Edge Functions. U13 y U14
siguen sin publicar y la ruta nueva queda **apagada**. Sin cambios en SRS v1/v2, Mastery, Adaptive,
Ranked ni en el contenido de U1–U12 o de las fases C.1–C.3.

### C4.1 Modelo (`20261114120000_curriculum_routes.sql`)

| Tabla | Qué guarda |
|---|---|
| `curriculum_routes` | Una versión de recorrido por idioma y nivel (`en.a1.route.v1`, `v2`): `fallback` (la de quien no tiene asignación, una por idioma y nivel) y `enabled` (habilitación explícita) |
| `curriculum_route_units` | Unidad → posición en la ruta. Una ruta habilitada o asignada no cambia (trigger) |
| `curriculum_route_enrollment` | La ruta que reciben las altas nuevas de cada idioma y nivel (hoy `en.a1.route.v1`) |
| `user_curriculum_routes` | La ruta de cada usuario: **inmutable** (`backfill` o `signup`), se borra sólo con la cuenta |

- `en.a1.route.v1`: U1 → U12. Respaldo, habilitada. La de **todas las cuentas existentes** (backfill
  de `auth.users` en la migración) y la de las altas mientras no se habilite la v2.
- `en.a1.route.v2`: U1 → U2 → U3 → **U13** → U4 → U5 → U6 → U7 → **U14** → U8 → … → U12. Apagada.
- La identidad es `curriculum_units.id`; su orden lo da la ruta. Las posiciones de unidades y lecciones
  existentes no cambian. Idiomas y niveles sin rutas (it, pt, zh, inglés A2): por posición, como antes.

### C4.2 Asignación

Al darse de alta (trigger nuevo sobre `profiles`, sin tocar `handle_new_user`) cada cuenta recibe la ruta
de inscripción vigente y la conserva para siempre; las cuentas que existían al aplicar la migración
reciben la v1. No hay fecha de corte ni inferencia por progreso: la frontera es la fila persistida. Una
cuenta sin fila (no debería pasar) usa la ruta de respaldo, nunca una que exija unidades nuevas.

### C4.3 Desbloqueo

`is_lesson_unlocked` (misma firma, misma autoridad: la llaman `learning_lesson_plan` y las rutas de
siempre) encadena las lecciones publicadas en el orden de `curriculum_unit_order(usuario)`: la ruta del
usuario o, sin rutas, la posición. Regla igual que antes (primera del nivel, anterior completada o ya
completada), más: **una lección ya completada sigue desbloqueada** aunque su unidad no esté en la ruta.
En la v1 el orden es idéntico al anterior (lo prueba la comparación lección por lección, para todos los
idiomas, antes y después de la migración). En la v2, U13 queda detrás de U3, U4 detrás de U13, U14 detrás
de U7 y U8 detrás de U14. Una unidad de la ruta sin publicar se salta: nadie queda atrapado.

La app (`fetchCurriculum`) pide `my_curriculum_route` y dibuja el camino en ese orden y con esa
numeración; si la función no responde, usa el orden por posición. Sólo dibuja: decide el servidor.

### C4.4 Activación (fase posterior)

`select public.curriculum_enable_route('en.a1.route.v2')` (sólo `service_role`). Falla si alguna unidad
de la ruta no está publicada o no tiene lecciones publicadas, si las posiciones no son 1..n o si falta una
unidad de la ruta de respaldo. Los triggers aplican las mismas reglas a escrituras directas. Afecta sólo
a las altas posteriores. Volver atrás: `curriculum_enable_route('en.a1.route.v1')` (nadie cambia de
ruta). Una ruta con usuarios o con altas no se deshabilita.

**Requisito antes de publicar U13/U14 o habilitar la v2**: que la build mínima en uso sea una con
`my_curriculum_route`. Las builds anteriores ordenan por posición: mostrarían U13 y U14 al final.

### C4.5 Pruebas

`supabase/tests/curriculumRoutes.test.mjs` (10) y `src/features/learning/__tests__/curriculumRoute.test.ts`
(5). Ajustadas: la lista de migraciones posteriores (`legacyReviewRetirement.test.mjs`) y «la última de
contenido» (`planned.test.mjs`).

## C5. Fase C.5 — Compatibilidad de versiones y protección del recorrido (2026-11-10)

Prepara la publicación de U13/U14 sin que las builds anteriores rompan el recorrido. No publica nada, no
habilita la v2, no aplica migraciones ni toca EAS. Migración `20261115120000_client_compatibility.sql`
(local, sin aplicar, add-only e idempotente).

### C5.1 Cómo se distingue cada cliente

| Cliente | Qué envía | Nivel curricular |
| --- | --- | --- |
| Builds publicadas hasta hoy (y cualquier request sin la cabecera: Edge Functions, SQL) | nada | 0 |
| Builds desde la C.5 (`src/lib/clientInfo.ts`, `CURRICULUM_API = 1`) | cabecera `x-polygo-curriculum-api: 1` en cada request (supabase-js `global.headers`) y `polygo_curriculum_api: 1` en `signUp` (`options.data`) | 1 |

El nivel es un entero fijo en el código, no la versión de la tienda: no depende de `expo-updates` ni de
`appVersionSource`. Falsificarlo sólo cambia qué contenido publicado ve la propia cuenta o con qué ruta
habilitada nace; no da acceso a nada más. El servidor nunca confía en el cliente para desbloquear.

Cada ruta declara el nivel mínimo para representarla (`curriculum_route_client_requirements`, inmutable):
`en.a1.route.v1` → 0, `en.a1.route.v2` → 1. Una ruta sin requisito sólo la ve el nivel 999 (nadie).

### C5.2 Protección efectiva (en el servidor)

- **Lectura**: dos políticas RLS **restrictivas** nuevas (se suman con AND a las de siempre, que no se
  tocan) en `curriculum_units` y `lessons`: sólo se leen las unidades de la *ruta visible* — la asignada
  si el cliente la puede representar; si no, la de respaldo (v1). Idiomas y niveles sin rutas: todo,
  como antes. Un usuario de la v1 **nunca** lee U13/U14, con cualquier build, publicadas o no.
- **Alta**: `assign_curriculum_routes` da la ruta de inscripción vigente sólo si el alta declaró un nivel
  suficiente; si no (build antigua, dato ausente o inválido), la de respaldo. La asignación sigue siendo
  inmutable (`user_curriculum_routes_guard`); actualizar la app, consultar la versión o cambiar de
  dispositivo no escribe nada.
- **Camino de la app nueva**: `my_curriculum_route` (misma firma) usa la misma ruta visible.
- `is_lesson_unlocked` no cambia: el desbloqueo es de la ruta asignada, no del cliente.

### C5.3 Versión mínima

`app_client_policy` (una fila `any` y opcionalmente `ios` / `android` / `web`, que la reemplaza):
`min_version` (null = sin mínimo), `min_curriculum_api`, `message_es`, `update_url` (https). Se cambia con
SQL / service_role; los clientes no la leen. Por defecto: sin mínimo.

`app_client_status(p_app_version, p_platform, p_curriculum_api)` (anon y authenticated, no escribe)
devuelve `status`, `installed_version`, `min_version`, `curriculum_api`, `min_curriculum_api`,
`message`, `update_url`:

- `update_required`: nivel curricular o versión por debajo del mínimo. La app muestra
  `UpdateRequired` (bloquea) con el mensaje y, si hay, el botón a la tienda.
- `unknown`: hay mínimo por versión pero la build no informa una versión legible. No bloquea (no se puede
  probar que sea vieja); el nivel curricular sí se exige.
- `ok`. En la app, además, `unavailable` (backend sin la función, sin red o respuesta inválida): no bloquea.

Versión instalada = `Constants.expoConfig.version` (la `version` de `app.json` embebida en la build).
Comparación numérica mayor.menor.parche (`1.10.0` > `1.2.0`; sufijos `-beta` se ignoran).

**Límite**: una build que no incorpora esta comprobación no puede mostrar un aviso que no conoce. La
versión mínima sólo controla builds C.5 en adelante. A las anteriores las protege C5.2, no esto.

### C5.4 Limitaciones que requieren publicar la app

1. **Ninguna build publicada envía la cabecera.** Hasta que la build C.5 esté en las tiendas, todas las
   altas reciben la v1 aunque la v2 se habilite (correcto, pero la v2 no llega a nadie).
2. **Usuario v2 en una build antigua** (cuenta creada con la build nueva y abierta en otro dispositivo sin
   actualizar): ve sólo U1–U12 (nunca U13/U14 al final), pero el servidor desbloquea según la v2, así que
   U4 aparece bloqueada hasta completar U13, que esa build no muestra. No se corrompe nada; se resuelve
   actualizando. No se puede avisar a esa build. Mitigación: habilitar la v2 sólo cuando la build C.5
   sea la mayoritaria.
3. **Versión**: `version` de `app.json` hoy es `0.1.0`. Para que `min_version` distinga builds hay que
   subirla en cada publicación (EAS sólo autoincrementa el número de build, que la app no lee).
4. **Palabras**: las políticas cubren unidades y lecciones (lo que dibuja el camino). Las palabras de
   U13/U14 publicadas siguen siendo legibles por `words` como cualquier palabra publicada.
   **Resuelto en la C.6** (§C6): `words`, `exercises` y `exercise_words` también filtran por ruta.

### C5.5 Orden para publicar U13/U14 (fase posterior)

1. Publicar la build C.5 (con `version` nueva) y aplicar C.4 + C.5 en producción.
2. Cuando sea la build mayoritaria: `update app_client_policy set min_curriculum_api = 1` (o `min_version`)
   para que las builds C.5+ antiguas se actualicen; las anteriores a C.5 siguen protegidas por RLS.
3. Publicar U13/U14 (los usuarios v1 no las ven) y `curriculum_enable_route('en.a1.route.v2')`.

### C5.6 Pruebas

- `supabase/tests/clientCompatibility.test.mjs` (7): escenarios 1–12 de la fase (cliente antiguo/nuevo ×
  ruta v1/v2, altas desde cada cliente con la v2 apagada y encendida, versión ausente/inferior/compatible,
  por plataforma, nivel por parámetro y por cabecera, actualización sin cambio de ruta ni de desbloqueos,
  U13/U14 fuera de la v1 y en el lugar 4 y 9 de la v2, habilitación imposible sin unidades listas,
  reaplicación idempotente).
- `src/features/compat/__tests__/compat.test.ts` (8): cabecera y metadato de alta, estados de la app,
  falla segura sin backend, validación de variables.
- Ajustadas: listas de migraciones posteriores en `legacyReviewRetirement.test.mjs` y `planned.test.mjs`;
  `harness.mjs` agrega `auth.users.raw_user_meta_data` (como en Supabase).

## C6. Fase C.6 — Vocabulario según la ruta curricular (2026-11-10)

Cierra la excepción de §C5.4, punto 4. Migración `20261116120000_route_vocabulary_access.sql` (local,
**sin aplicar**, add-only, idempotente, sin DROP). No publica nada, no habilita la v2 y no cambia
palabras, ids, progreso, rutas, asignaciones, desbloqueos, SRS ni Ranked.

### C6.1 Pertenencia curricular (sin una fuente nueva)

- Palabra → `words.unit_id` (NOT NULL, FK): la unidad que la **introduce**. Ejercicio →
  `exercises.lesson_id` → `lessons.unit_id`. Es lo que ya usaban el generador y `word_of_the_day`.
- U13/U14 introducen **34 palabras** (16 y 18). Reutilizan **25** de otras unidades (U1, U3, U5, U6,
  U7, U10, U12 y A2 U6/U10: *coffee, how much, price, email…*), que conservan su `unit_id` y sólo se
  enlazan con `exercise_words` (§C3.1, `borrowed`). Hoy no hay palabras sin ejercicios.
- Visibilidad: la de la C.5 sin cambios (`curriculum_route_for` + cabecera del request). Una unidad es
  visible si está en la ruta que el cliente puede representar, o si su idioma y nivel no tienen rutas.

### C6.2 Vías que exponían vocabulario y protección

| Vía | Antes | Ahora |
| --- | --- | --- |
| `words` (consulta directa; la app la lee entera en `fetchWordPool`) | `is_published` | + restrictiva: `unit_id` en `curriculum_visible_unit_ids()` |
| `exercises` (enunciados, respuestas, payloads; `fetchLessonContent`) | `is_published` | + restrictiva: `curriculum_lesson_visible(lesson_id)` |
| `exercise_words` (los ids de palabra son el texto: `en-surname`) | `true`: **los 322 enlaces de U13/U14 se leían aunque nada estuviera publicado** | + restrictiva: ejercicio **y** palabra visibles |
| `word_of_the_day`, `get_learning_summary` (`frequent_mistakes`), «mis palabras» (`user_word_progress` + `words!inner`) | SECURITY INVOKER | heredan la RLS de `words` sin cambios de código |
| `get_learning_mastery` (SECURITY DEFINER) | textos sólo de conceptos con estado del propio usuario | sin cambios (un usuario v1 no tiene estado en U13/U14) |
| `review_item_candidates`, `learning_*_candidates`, `rush_questions` | no ejecutables por clientes (service_role) | sin cambios; ver C6.5 |
| `anon` | sin permisos sobre contenido | sin cambios (probado) |

Las políticas existentes no se tocan: las nuevas son **restrictivas** (AND). Las funciones auxiliares
nuevas (`curriculum_unit_visible`, `curriculum_lesson_visible`, `curriculum_exercise_visible`,
`curriculum_word_visible`) devuelven un **booleano por clave**: se pueden llamar por RPC (las políticas
se evalúan con el rol del que consulta) y una lista de ids revelaría palabras ocultas. Para una clave
oculta y una inexistente devuelven lo mismo (`false`). La prueba comprueba que `curriculum_unit_visible`
coincide con `curriculum_visible_unit_ids()` de la C.5 para toda unidad, ruta y cliente.

### C6.3 Resultado por caso

| Caso | Palabras exclusivas U13/U14 | Compartidas | Otras |
| --- | --- | --- | --- |
| v1 · cliente antiguo (0) | no | sí (en sus unidades; sus enlaces a ejercicios de U13/U14, no) | igual que antes |
| v1 · cliente C.5 (1) | no | ídem | igual que antes |
| v2 · cliente C.5, v2 habilitada y U13/U14 publicadas | sí | sí, también en U13/U14 | igual que antes |
| v2 · cliente antiguo | no (ve la v1, como en la C.5) | como la v1 | igual que antes |
| Palabra sin ejercicios | la decide su unidad: en U13/U14 oculta para la v1; en U1–U12 o A2, como antes | | |
| it, pt, zh, inglés A2 | — | — | exactamente lo publicado |

Con la v2 habilitada, una palabra de U13/U14 sin publicar sigue oculta también para la v2 (la política
permisiva `is_published` no cambió). El progreso no se borra ni se modifica: una cuenta v2 que abre una
build antigua deja de ver sus palabras de U13/U14 en el resumen y en «mis palabras» mientras use esa
build, igual que no ve esas unidades.

### C6.4 Pruebas

`supabase/tests/routeVocabulary.test.mjs` (12/12): los 12 casos pedidos, con la v2 apagada (sin
publicar y publicadas) y habilitada; foto antes/después de contenido, progreso, rutas, asignaciones y
desbloqueos (idénticos, migración aplicada dos veces); palabra del día en 500 fechas; inventario de
tablas y funciones accesibles a `authenticated`/`anon` que tocan vocabulario (falla si aparece una vía
nueva sin revisar). Ajustadas: listas de migraciones posteriores en `legacyReviewRetirement.test.mjs` y
`planned.test.mjs`.

### C6.5 Limitaciones que quedan (fuera de lo que esta fase puede tocar)

1. **Repasos (SRS)**: `review_item_candidates` no mira la ruta. De los 181 ítems de U13/U14, **35** tienen
   como conceptos target sólo palabras compartidas; si esos ítems pasaran a `active`, una cuenta v1 que
   conoce esas palabras podría recibirlos en un repaso (`review_item_known` sólo mira conceptos). Hoy
   los 181 son `draft`: no hay exposición. Hay que filtrarlos por ruta en el SRS **antes** de activarlos.
2. **Ranked**: `rush_questions` y el servidor de partidas (`server/src/supabaseStore.ts`, service_role)
   eligen entre todas las palabras publicadas del idioma y nivel. Al publicar U13/U14 sus palabras
   aparecerían en Ranked para cualquier cuenta. Decidir antes de publicar (por ejemplo, excluir unidades
   que no estén en la ruta de respaldo).
3. **Mastery Display** (apagado): `get_learning_mastery.units` lista títulos y conteos de todas las
   unidades publicadas del idioma; al encenderlo mostraría U13/U14 a la v1. Sin vocabulario.
4. Las cuatro funciones auxiliares, como las de la C.5, revelan si una clave (unidad, lección, ejercicio,
   palabra) es visible para quien pregunta; no revelan si existe.

Los puntos 1–3 se resuelven en la C.7 (§C7).

## C7. Fase C.7 — Aislamiento curricular en Repasos, Ranked y Mastery Display (2026-11-10)

Cierra los puntos 1–3 de §C6.5. Migración `20261117120000_curriculum_isolation.sql` (local, **sin
aplicar**, add-only, idempotente, sin DROP/DELETE). Sin publicar nada, sin habilitar la v2, sin encender
SRS v2, Mastery, Adaptive, Display ni `pg_cron`. Las funciones reemplazadas se generan con
`scripts/build-c7-sql.ts` (copia exacta de la versión vigente + parches que deben aparecer una vez).

### C7.1 Fuente de verdad (sin una nueva)

- **Ruta visible**: `curriculum_route_for(usuario, idioma, nivel, nivel_de_cliente)` de la C.5. Sin rutas
  (it, pt, zh, inglés A2) = todo, como antes.
- **Nivel de cliente**: `request_curriculum_api()` (cabecera `x-polygo-curriculum-api`; sin cabecera = 0).
  La Edge Function `learning-session` ahora **reenvía** la cabecera del cliente a sus RPC (y la admite en
  CORS). La función desplegada hoy no la reenvía: hasta desplegarla, todo repaso se arma con nivel 0
  (la ruta de respaldo), que es el valor seguro.
- **Procedencia**: ítem → `exercises.item_id` → lección → unidad (todo ítem tiene ejercicio; los 181 de
  U13/U14 sólo tienen ejercicios en U13/U14). Palabra → `words.unit_id`.
- **Desbloqueo**: `curriculum_unlocked_unit_ids` aplica la regla de `is_lesson_unlocked` en una pasada
  (la prueba compara ambas para cada lección).

### C7.2 Repasos (SRS)

`review_item_known(p_user, ítem, modo)` es la puerta común de las cinco funciones que arman o validan
candidatos (`learning_review_candidates`, `learning_start_review`, `learning_focus_candidates`,
`learning_start_focus_review`, `learning_start_basic_review`). Ahora exige además
`review_item_in_route(p_user, ítem)`: algún ejercicio **publicado** del ítem, en lección y unidad
publicadas, de una unidad de la ruta visible del usuario. Es un `EXISTS`: no agrega filas, no duplica,
no cambia orden, prioridades ni FSRS. `intro_lesson_id` (AL17, lo único de candidatos que llega a la app)
se limita a lecciones de la ruta visible. `learning_review_coverage` es un agregado por idioma (sin
usuario ni ítems) y no cambia. Un plan armado a mano con un ítem de U13 se rechaza (`invalid_plan`).

| Caso | Ítems de U13/U14 (exclusivos y de conceptos compartidos) | Ítems de U1–U12, A2, it/pt/zh |
| --- | --- | --- |
| v1 · cliente antiguo o C.5 | nunca | idénticos a antes |
| v2 · cliente compatible | sí, si su ejercicio está publicado (las lecciones `-context` siguen sin publicar) | idénticos |
| v2 · cliente antiguo | nunca (ve la v1) | idénticos |

### C7.3 Ranked: conjunto común, mismas preguntas

Cómo se comparte hoy: las preguntas de una partida se generan **una sola vez** —`battles.questions` en las
partidas de la base (`join_human_queue`, `accept_friend_challenge`) y la instancia `Battle` del servidor
(`createBattle`)— y ambos jugadores leen ese mismo arreglo. La C.7 no toca eso: sólo cambia el conjunto de
palabras del que se arma, que pasa a ser `rush_common_unit_ids(idioma, jugadores, niveles)`: la
**intersección** de las unidades usables por cada humano (los bots no cuentan). Usable: sin rutas, todas
(como antes); con rutas, unidad publicada de su ruta visible y desbloqueada para él. Las palabras **y los
distractores** salen sólo de ahí.

- Partidas de la base: `rush_questions_in_units` (copia exacta de `rush_questions` con el filtro de
  unidades; la de 3 argumentos para ranked, la de 2 para amistosos). La cola guarda el nivel de cliente de
  cada jugador (`ranked_queue.curriculum_api`, escrito en cada consulta) y el desafío el del anfitrión
  (`friend_challenges.host_curriculum_api`, por defecto el de la cabecera de quien lo crea).
- Servidor de partidas: `store.rushUnits` (RPC `rush_common_unit_ids`, service_role) filtra el pool antes
  de `rushPool`/`generateQuestions`. **El servidor no conoce el nivel de cliente** (el protocolo no lo
  lleva y no se cambió): usa 0, así que una cuenta v2 juega ahí como v1 (nunca U13/U14). Si la RPC falla
  no hay partida (nunca «todas las palabras»).
- Partida contra bots armada en el teléfono (`useLocalBattleSession`, un solo humano): la ruta ya la
  filtra la RLS de `words` (C.6); los desbloqueos, `rush_my_unit_ids` (authenticated; sólo devuelve
  unidades que el cliente ya puede leer). Si el backend no tiene la función, se juega sin ese filtro.
- Las firmas viejas `rush_questions(texto, n[, rating])` ya no las llama nadie; ahora quedan limitadas a la
  ruta de respaldo (`rush_fallback_unit_ids`).
- Sin cambios: ELO, puntuación, matchmaking (ventana, emparejamiento), duración, victoria/derrota,
  niveles por rating, preguntas para escribir, ids, contratos y protocolo.

**Efecto visible en inglés A1**: antes, Ranked usaba todo el vocabulario A1 publicado; ahora sólo el de
unidades desbloqueadas por ambos jugadores (una cuenta nueva: U1, 23 palabras; desde Plata se suma A2,
que no tiene rutas y sigue completo). Es la regla pedida («conocida curricularmente por ambos»); el resto
del balance (niveles por rating, escritura, puntos) no cambia. it, pt, zh e inglés A2: idénticos.

### C7.4 Mastery Display

En `get_learning_mastery` (la consulta, no el componente): `units` sólo lista unidades **publicadas** de la
ruta visible del cliente que pregunta (`curriculum_unit_visible`, C.6); `weak` omite palabras de unidades
que ese cliente no ve. Dimensiones, retención, velocidad, confianza, transferencia, estados y fórmulas no
cambian (los conteos siguen incluyendo todo el estado real del usuario). Display sigue apagado.

### C7.5 Pruebas

- `supabase/tests/curriculumIsolation.test.mjs` (18): migración add-only y reaplicable que cambia
  exactamente 7 funciones previstas y 2 columnas; datos, progreso, historial, ratings y switches intactos;
  generador al día; inventario de vías de candidatos; v1 (cliente antiguo y C.5) sin U13 ni U14 ni los 35
  compartidos, con todo lo demás idéntico (focus, SRS v2, conocidos); plan forjado rechazado; permisos;
  Mastery v1/v2/cliente antiguo/no publicadas/históricos/consulta directa con cabecera falsificada;
  desbloqueo = `is_lesson_unlocked`; Ranked v1+v1, v2+v2, v1+v2, v2 con cliente antiguo, progreso
  distinto, amistosos, mismas preguntas y orden para ambos, contenido común; regresión it/pt/zh/A2.
- `server/test/curriculum.test.ts` (6): mismo conjunto y orden para ambos jugadores, sólo lo común,
  práctica, sin conjunto no hay partida.
- `src/features/battle/__tests__/botMatchApi.test.ts` (+2): filtro de la partida contra bots.

### C7.6 Pendiente (no se puede resolver en local)

1. Aplicar C.4 → C.5 → C.6 → C.7 en producción, en ese orden.
2. Desplegar `learning-session` (reenvío de la cabecera). Antes de eso, los repasos usan nivel 0: una
   cuenta v2 no recibe ítems de U13/U14 en repasos (seguro, pero incompleto).
3. Servidor de partidas: desplegarlo **después** de la migración (usa `rush_common_unit_ids`). Para que una
   cuenta v2 vea U13/U14 en Ranked por el servidor, el protocolo tendría que llevar el nivel de cliente.
4. Build nueva de la app para el filtro de desbloqueos en la partida contra bots del teléfono.

## C8. Fase C.8 — Propagación del nivel curricular en Repasos, Ranked y bots (2026-11-10)

Completa los pendientes 2–4 de §C7.6 sin rehacer la C.7. **Sin migraciones nuevas** (los filtros SQL de la
C.7 no cambian), sin publicar U13/U14, sin habilitar la v2, sin desplegar nada.

### C8.1 Repasos (Edge Function `learning-session`)

Sin cambios de código: la verificación confirma que el recorrido ya era completo.

- La app manda `x-polygo-curriculum-api` como cabecera global de supabase-js, que `functions.invoke`
  también envía (`SupabaseClient.functions` usa `this.headers`).
- La función normaliza la cabecera (`^[0-9]{1,3}$`, si no `0`) y la reenvía en **todas** sus RPC
  (cliente `admin` con `global.headers`), en `start_review`, `answer_review` y `submit_review`.
- La selección se decide una sola vez, en `start_review` (`learning_focus_candidates` /
  `learning_review_candidates` → `review_item_known` → `review_item_in_route`). `answer_review` y
  `submit_review` corrigen las presentaciones registradas (`learning_session_presentations`,
  `learning_review_words`): no vuelven a elegir candidatos, así que la sesión conserva el contenido con
  que empezó y no hay forma de meter un ítem fuera de la ruta después.
- Sin bypass: el filtro de la C.7 está en la puerta común; un nivel falsificado (999) en una cuenta v1 no
  da U13/U14 (`curriculum_route_for` sólo elige entre la ruta asignada y la de respaldo).

### C8.2 Ranked por el servidor de partidas

- Handshake: campo opcional `curriculumApi` (`HandshakeAuth`, `parseCurriculumApi` en
  `shared/protocol.ts`, misma regla que `parse_curriculum_api`). **Misma `PROTOCOL_VERSION`**: las builds
  anteriores no lo mandan y juegan con 0.
- El servidor lo guarda por conexión (`socket.data.curriculumApi`) y lo copia al `PlayerInfo` en
  `queue:join` (sólo en memoria). `createBattle` pasa `{userId, curriculumApi}` de cada humano a
  `store.rushUnits`, que llama a `rush_common_unit_ids(idioma, jugadores, p_apis)`. Los bots no cuentan.
- La fuente de verdad sigue siendo la base: ruta persistente, unidades publicadas y desbloqueos de cada
  cuenta. El nivel declarado no se escribe en ningún lado.
- Sin cambios: preguntas generadas una vez para ambos, ELO, matchmaking, puntuación, duración,
  victoria, `battle:finish`, liquidación.
- App: `connectBattleSocket` manda `curriculumApi: CURRICULUM_API`.

### C8.3 Partida contra bots armada en el teléfono

- La lógica se movió a `shared/wordRush.ts` (`rushUnitsFromRpc`, `rushWordsInUnits`, `localRushWords`)
  para que la app y las pruebas usen la misma. Las unidades vienen de `rush_my_unit_ids` (la misma regla
  que Ranked: `rush_player_unit_ids` con la cabecera de la build); sin listas de palabras.
- Cambio de comportamiento: antes, cualquier error de `rush_my_unit_ids` hacía jugar **sin filtro**.
  Ahora sólo un backend sin la función (`PGRST202` / `42883`, anterior a la C.7) juega sin filtro; un
  error de red, de la base o una respuesta rara propaga el error y la partida no empieza (como el
  servidor de partidas). `localRushWords` además descarta filas no publicadas (como `loadWords`).
- Sin cambios: bots, dificultad, puntuación.

### C8.4 Pruebas

- `supabase/tests/curriculumPropagation.test.mjs` (23): la **función real** `learning-session/index.ts`
  cargada en Node (`tests/edge/runEdgeFunction.mjs`: `Deno.serve`/`Deno.env` emulados; `npm:` resuelto al
  supabase-js del proyecto) detrás de un PostgREST/GoTrue emulado sobre PGlite
  (`tests/edge/postgrestEmulator.mjs`, que expone `request.headers` como PostgREST); el servidor de
  partidas real con `createSupabaseStore` real (rushUnits, loadWords) contra ese emulador; y la selección
  local de bots por el mismo camino que la app. U13/U14 publicadas y v2 habilitada sólo en esa base.
- `server/test/curriculum.test.ts` (13): handshake con/sin nivel, niveles inválidos, v1/v2, mixtos,
  progreso distinto, bots del servidor, reconexión, formato de `battle:finish`.
- `src/features/battle/__tests__/botMatchApi.test.ts`: errores que ya no juegan «con todo»,
  `localRushWords`.

### C8.5 Pendiente

1. ~~Deno real no ejecutado~~ → resuelto en la C.8.1 (§C8.6).
2. Producción, en orden: C.4 → C.5 → C.6 → C.7; luego desplegar `learning-session`; luego el servidor de
   partidas (C.8 es compatible con builds viejas en ambos sentidos: servidor nuevo + app vieja = 0; app
   nueva + servidor viejo = el campo se ignora).
3. Build nueva de la app (handshake con `curriculumApi`, filtro estricto de bots).
4. Repasos con SRS v2 encendido (`learning_review_candidates`): cubierto por la C.7 en SQL, no por esta
   prueba de punta a punta (v2 sigue apagado).

### C8.6 C.8.1 — Validación en Deno real (2026-11-10)

`supabase/tests/deno/learning-session.e2e.mjs` (sin cambios en la función ni en SQL):

- El emulador de PostgREST ahora pasa **todas** las cabeceras del pedido a `request.headers` (como
  PostgREST) y registra el nivel que recibió cada RPC (`rpcLog`; respuesta de las de candidatos).
- `invoke(…, { headers })`: cabeceras globales del cliente, como la app.
- `DENO_NPM=local`: `--node-modules-dir=manual --cached-only` (supabase-js del proyecto, sin red). Por
  defecto sigue `--node-modules-dir=none` (registro, como el Edge Runtime).
- Escenarios «I» nuevos (al final: publican U13/U14 y habilitan la v2 sólo en el clúster desechable):
  cliente antiguo (0), cliente C.5 (1), cabeceras inválidas (`abc`, `-1`, `1000`, `1.5`, espacio → 0) en
  `start_review`/`answer_review`/`submit_review`; autoridad de corrección (respuesta incorrecta con
  `client_verdict: 'correct'` → `incorrect`); cuenta v2 con nivel 1 recibe U13/U14 en candidatos y plan,
  con cliente antiguo no; responder sin cabecera no vuelve a elegir candidatos; una presentación de U13
  de otra cuenta (con nivel 999) se rechaza en `answer_review`, no cambia el plan ni deja evidencia en
  palabras de U13/U14, ni cambia la ruta.

Ejecución: Deno 2.9.6 (binario ya presente en el caché local de Deno, no instalado), PostgreSQL 17 local,
161 migraciones, `DENO_NPM=local`: **31/32**. Los 5 escenarios de la C.8.1 pasan. Falla «I · ruta vieja
(submit_learning_session…) sigue funcionando»: escenario anterior a la retirada de la ruta vieja de
repasos (`20261112120000_retire_legacy_review_route.sql` responde `legacy_review_retired` a propósito);
no es de la C.8 y queda desactualizado. Diferencias con producción: Deno 2.9.6 (no la versión del Edge
Runtime) y supabase-js del proyecto (2.118) en lugar del registro.

### C8.7 C.8.2 — Escenario de la ruta vieja al día (2026-11-10)

Sólo `supabase/tests/deno/learning-session.e2e.mjs`, escenario «I · ruta vieja (submit_learning_session
por PostgREST con el JWT del usuario): lecciones siguen, repasos → legacy_review_retired». Sin cambios en
SQL, migraciones ni Edge Functions.

- Lección vieja: igual que antes (guarda, reenvío → `duplicate`), y vuelve a dar `duplicate` después del
  rechazo del repaso.
- Repaso viejo con el JWT del usuario: `data = null`, error `legacy_review_retired`, código `42501`,
  HTTP 403 (contrato de `20261112120000_retire_legacy_review_route.sql`).
- Sin escrituras: hash idéntico antes/después de **todas** las tablas públicas con `user_id` de la
  cuenta (sesiones, intentos, correcciones, SRS v1/v2, energía, racha, logros…) y 0 filas con el
  `session_id` rechazado en todas las tablas con `session_id`, y en `learning_sessions`.
- `learning_route_usage`: `legacy_lesson`, `lesson_graded` y `record_learning_session` presentes;
  `legacy_review` ausente y `legacy_review_users = 0`.

Ejecución (Deno 2.9.6, PG17 local, 161 migraciones, `DENO_NPM=local`): **32/32** en 462 s.
`legacyReviewRetirement.test.mjs` 8/8; `phase5.test.mjs` + `attempts.test.mjs` 30/30.
