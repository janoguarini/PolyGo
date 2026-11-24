# Catálogo de aprendizaje, fase 1: identidad, privacidad y referencias

Decisiones de implementación del 2026-11-07 que cierran los pendientes del catálogo de la fase 1
(arquitectura de datos rev. 8, §4–§5, §13.2 y §18). No cambian la arquitectura aprobada: la aplican
donde dejaba un hueco y, donde no alcanza, lo marcan como decisión pendiente.

**Estado: escrito y probado en PGlite. Nada aplicado en producción.** Actualizado el 2026-11-07
(segunda entrega): §2 (ubicaciones que se mueven), §3 (CHECK quitado), §6 y §7–§11.

| Pieza                         | Archivos                                                                                                                                                                                                                                                                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identidad e ítems             | `content/catalog.ts`, `content/ids-lock.ts`, `content/ids.lock.json`, `content/types.ts` (`id`, `personalData`)                                                                                                                                                                                                         |
| Versiones y ubicaciones       | `content/versions.ts`, `scripts/versions-sql.ts` (preparado), `PLACEMENTS_SQL` en `scripts/catalog-sql.ts`                                                                                                                                                                                                              |
| Objetivos                     | `content/objectives.ts` (vacío)                                                                                                                                                                                                                                                                                         |
| Orígenes de la práctica       | `content/practice-sources.ts`                                                                                                                                                                                                                                                                                           |
| Personas ficticias            | `content/personas.ts` (vacío)                                                                                                                                                                                                                                                                                           |
| Comandos                      | `npm run content:ids` (`scripts/content-ids.ts`); los generadores validan con `scripts/ids-lock-file.ts` (`assertContentCatalog`)                                                                                                                                                                                       |
| Migraciones nuevas (aditivas) | `20261107140000_learning_ref_input_modalities.sql`, `20261107140100_learning_items_match_pairs.sql`, `20261107150000_learning_item_versions.sql`, `20261107150100_learning_item_placements.sql`, `20261107160000_learning_objectives.sql`, `20261107170000_practice_sources.sql`, `20261107180000_content_personas.sql` |
| Pruebas                       | `content/__tests__/identity.test.ts`, `content/__tests__/catalog.test.ts`, `content/__tests__/phase1.test.ts`, `supabase/tests/items.test.mjs`, `supabase/tests/versions.test.mjs`, `supabase/tests/catalog.test.mjs`                                                                                                   |
| Pendientes de versiones       | `docs/EXERCISE_ITEM_VERSIONS_PENDING.md`                                                                                                                                                                                                                                                                                |

## 1. Identidad de los `match_pairs` generados

Había 300 ejercicios `match_pairs` de la consolidación sin ítem: la plantilla de los generados
(`<idioma>.gen.<tipo>.<palabra>`) es de una palabra y cada uno tiene cuatro.

**Plantilla:** `<idioma>.gen.match_pairs.set.<palabra>+<palabra>+…`

Ejemplo: `en.gen.match_pairs.set.en-a+en-big+en-cup+en-small`.

**Algoritmo** (`generatedSetItemId`):

1. Tomar los ids de palabra del ejercicio (`ExerciseDef.words`, que son los conceptos léxicos target).
2. Quitar duplicados y ordenar por código de unidad UTF-16 (`Array.prototype.sort` sin comparador),
   no por configuración regional: el resultado es el mismo en cualquier plataforma. En Postgres es
   `order by … collate "C"` (lo usa la prueba de la base).
3. Exigir 2 o más palabras, cada una con la forma `<idioma>-<slug>` (`[a-z0-9]` y guiones) y del
   idioma del ítem.
4. Unir con `+` y anteponer `<idioma>.gen.match_pairs.set.`.

Sin azar, sin hora, sin hash: el id es el conjunto mismo, legible e inyectivo. El orden visual de
las parejas no cambia el id; cambiar una palabra da otro id; dos idiomas no pueden compartir id (el
prefijo y cada palabra llevan el idioma).

**Espacio de nombres.** Los ids de palabra empiezan con `<idioma>-` y no contienen `.` ni `+`, así
que el segmento `set.` nunca se confunde con una palabra de la plantilla de una palabra, y `+` no
aparece en ningún otro id. Gramática para plantillas futuras: `<idioma>.gen.<tipo>.<clase>.<…>`, con
una `<clase>` nueva que no empiece con `<idioma>-` (hoy sólo existe `set`). Los escritos usan
`<idioma>.ex.` o el id por posición; nada choca.

**Nivel.** §5: «en los generados, el de la palabra». Con varias palabras se usa **el más alto**: un
ítem que exige una palabra de A2 es trabajo de A2, y §13.5 (`level_scope = greatest(nivel del ítem,
nivel activo)`, caso «Lección de A2 con A1 activo → A2») existe justamente para no compactar con A1
evidencia de A2. Afecta a 19 conjuntos que mezclan A1 y A2 en repasos de A2; otros 2 repasos de A2
tienen sólo palabras de A1 y quedan en A1.

**Relaciones.** Un ítem por ejercicio completo, no por pareja. Cada pareja da su fila (concepto
target, `vocabulary`) en `item_concepts` (§4.4: «una fila por pareja»); `recognition` no alimenta
ninguna habilidad. Resultado: 300 ítems y 1.200 filas, en una migración nueva generada con
`npm run content:catalog -- … --exclude-loaded <backfills>` para no reescribir las existentes. Las
948 copias de la consolidación siguen apuntando a su ítem escrito.

## 2. Ids de los ejercicios escritos: `ExerciseDef.id` y `content/ids.lock.json`

**`ExerciseDef.id` es opcional**, porque los 2.410 ejercicios publicados no lo declaran: su id de ítem
es su id por posición (`a1-u01-l01-e03`, `it-a1-u01-l01-e03`), congelado en el registro. Las reglas:

| Caso                                                       | Qué se escribe                                          |
| ---------------------------------------------------------- | ------------------------------------------------------- |
| Ejercicio ya publicado, sin mover                          | Nada                                                    |
| Ejercicio ya publicado que se mueve                        | `id: '<su id por posición>'` (conserva el ítem)         |
| Ejercicio nuevo                                            | `id: 'en.ex.new'` → `npm run content:ids` lo reemplaza  |
| Cambia tipo, modo, conceptos target o privacidad           | `id: 'en.ex.new'` (ítem nuevo; el viejo queda retirado) |
| Cambia redacción, opciones o respuesta sin cambiar el modo | Nada: mismo ítem (será una versión nueva)               |

Formato del id nuevo: `<idioma>.ex.` + 14 caracteres de `[0-9a-z]` (≈72 bits), equivalente a
`en.ex.<nanoid>` de §5. Se sortea **sólo** en `npm run content:ids` (con `crypto.randomInt`, sin
dependencias), se verifica que no exista en el registro ni en el contenido y se escribe en el archivo
de contenido reemplazando el marcador. Ningún build genera ids: `buildCatalog` rechaza el marcador.

**`content/ids.lock.json`**: una entrada por id de ítem (escritos y generados), ordenadas, una por
línea. Cada entrada guarda la identidad: idioma, nivel, origen, tipo, modo, formato, privacidad y
conceptos target; los escritos, además, su ubicación (`exercise`). La redacción no se guarda.

Es de sólo agregado:

- Nada se borra ni cambia su identidad. Una entrada sólo puede pasar a `withdrawn`, y sólo con un
  comando explícito: `content:ids` al registrar un reemplazo (`replacedBy`) o
  `content:ids -- withdraw <id> --reason "…"`. Un id retirado no se reutiliza (`restore` sólo vale
  si vuelve con la misma identidad, p. ej. una plantilla generada).
- `buildCatalog` falla con ids duplicados (dos ejercicios escritos con el mismo id) y con ids
  inválidos o de otro idioma.
- `checkIdsLock` (usado por `content:sql`, `content:diff`, `content:catalog` y por Jest) falla si un
  id cambió de identidad, desapareció, está retirado o es un escrito nuevo sin id propio, y el
  mensaje dice qué id hace falta y por qué. Ejemplo real:
  `a1-u03-l04-e04 … cambió de identidad (targets: [en-old, en-ten] → [en-old]). Es un ítem nuevo (§5):
poné id: 'en.ex.new' en ese ejercicio y corré npm run content:ids. El id a1-u03-l04-e04 no se
reutiliza ni se borra`.
- Un ítem generado que cambia de identidad con el mismo id (p. ej. su palabra cambia de nivel) no se
  resuelve solo: necesita una plantilla nueva o retirarlo, y el error lo dice.

**Ejercicios que se mueven.** Un escrito puede cambiar de lección o de posición conservando su id
(declarándolo en `ExerciseDef.id`). `checkIdsLock` lo informa como `moved` y `content:ids` actualiza
sólo su `exercise` en el registro: la identidad no cambia, no se retira nada y correrlo otra vez no
cambia nada. Hace falta porque la detección de reemplazos usa esa ubicación: con la ubicación vieja, un
reemplazo en la posición nueva se veía como una desaparición, y un ítem nuevo en la posición que el
ejercicio dejó se habría registrado como su reemplazo (retirándolo sin serlo). Las pruebas de
`identity.test.ts` («escritos que se mueven…») cubren movimiento, intercambio, reemplazo posterior y
desaparición posterior. Hoy ningún escrito se movió: las 2.410 ubicaciones registradas coinciden.

Preparado para `exercise_item_versions`: lo que pasa el registro sin id nuevo es, por definición,
un cambio de versión. El registro no guarda hash de contenido; la versión lo hará con `content_hash`.

**Límite conocido.** Los ids por posición dependen de la posición. Insertar un ejercicio en el medio
de una lección publicada corre las ubicaciones: el registro lo detecta casi siempre (cambio de
identidad o escrito nuevo sin id al final), salvo que el ejercicio desplazado tenga exactamente la
misma identidad que el que ocupaba esa posición. Por eso sigue vigente la regla de
docs/CONTENT_STANDARD.md: agregar al final, con `consolidate: false`.

## 3. Tablas de referencia frente a `CHECK`

§4.1: «los valores cerrados van en tablas de referencia con FK, no en CHECK: así se agregan valores
con un INSERT … y cada valor lleva su significado». Las columnas de `exercise_items` e
`item_concepts` que usaban CHECK:

| Columna                         | Valores                                | Qué es                                                                                                                      | Decisión                                                   |
| ------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `exercise_items.input_modality` | `text`, `audio`, `image`, `audio_text` | Catálogo cerrado que crece con los tipos de ejercicio (el Mastery Engine usa tipo × entrada como contexto de transferencia) | **`ref_input_modalities` + FK** (migración 20261107140000) |
| `exercise_items.origin`         | `authored`, `generated`                | Atributo estructural: decide la plantilla de id, el registro y las columnas `generator*` de las versiones                   | **CHECK, excepción**                                       |
| `item_concepts.role`            | `target`, `context`, `distractor`      | Rol relacional cuyo efecto fija la regla de §4.3 (paso 3) dentro del trigger                                                | **CHECK, excepción**                                       |

Justificación de las excepciones: agregar un origen o un rol no se resuelve con un INSERT. Un origen
nuevo necesita su plantilla de id y sus reglas de versión; un rol nuevo, cambiar la regla de §4.3 (y
hoy `context`/`distractor` ni siquiera pueden tener filas: la PK incluye `dimension` y el paso 3 dice
que no dan filas). Las dos cosas son revisiones de diseño, no datos. Ninguno de los dos tiene
metadatos que guardar. Una tabla de referencia sería redundante.

`ref_input_modalities` lleva sólo `id`: la arquitectura no define metadatos para los canales y no se
inventan. Los valores y su significado no cambian. No se crearon otras tablas: `type` replica el
CHECK existente de `exercises.type` (la lista de `shared/exercises.ts`) y `status` sigue el mismo
patrón que `concepts.status`; ninguna de las dos estaba en el alcance.

**Resuelto (2026-11-07).** El CHECK redundante `exercise_items_input_modality_check` se quitó de
`20261107130000_learning_items.sql`, que no estaba aplicada en producción. La única validación es la FK
`exercise_items_input_modality_fkey` de `20261107140000`; la cadena completa se aplica desde una base
limpia en PGlite (cada archivo de `supabase/tests` lo hace) y `items.test.mjs` comprueba que un canal
nuevo se agrega con un `INSERT` en `ref_input_modalities`. Entre `130000` y `140000` la columna no
tiene validación, pero `ADD CONSTRAINT … FOREIGN KEY` de `140000` valida las filas que cargaron los
backfills intermedios.

Las tablas nuevas de esta entrega siguen la misma regla: `objective_concepts.role`,
`lesson_objectives.role`, `practice_sources.selection_mode`, `evidence_class` y `reward_kind` usan
CHECK como excepción, igual que `origin` y `role`: su efecto lo fija el diseño (§4.3, §4.5, G1, G2) y
las funciones de recompensas, no se amplían con un `INSERT`.

## 4. Privacidad de la respuesta

Reglas (`responsePrivacyOf`, la usa `classifyExercise` y por lo tanto el backfill, `content:sql` y
`content:diff`, que toman el catálogo de `buildCatalog`):

- `closed`: opción, fichas o parejas (`answerKindFor` ≠ `text`), aunque el ejercicio cite una persona.
- `fictional`: texto libre con `personalData: { persona }` que apunta a una persona de
  `content/personas.ts` del mismo idioma. No alcanza con nombrar a alguien.
- `open_text`: el resto del texto libre (traducciones, `short_answer`).
- `personalData: 'learner'` (self_disclosure): el catálogo lanza un error; no hay valor en
  `ref_response_privacy` (P4).

**Relevamiento del contenido actual** (581 ejercicios escritos de texto libre en los cuatro idiomas):

- **Ningún ejercicio cumple la regla de `fictional`**: no existe el catálogo `content_personas` ni
  ningún ejercicio lo cita. `CONTENT_PERSONAS` queda vacío y no se inventaron personas. Coincide con
  §13.2: «las respuestas actuales … se clasifican como `closed` u `open_text` en el backfill».
- Mencionan nombres, edades u orígenes, pero son traducciones o respuestas con respuesta esperada,
  así que son `open_text`: p. ej. `a1-u01-l04-e08` («Mi nombre es Ana»), `a1-u03-l04-e04`,
  `zh-a1-u01-l04-e08` (Wang Ming), `it-a1-u04-l05-e07` (Luca).
- **Candidatos a `fictional` cuando exista `content_personas`**: juegos de rol con los datos dados en
  la consigna y respuesta fija. `a1-u03-l04-e06` (Tom, 11), `a1-u03-l05-e08` (Ana, España),
  `a1-u12-l05-e01` y `-e02`, `it-a1-u01-l04-e07`, `it-a1-u03-l04-e07`, `it-a1-u04-l05-e06`,
  `pt-a1-u01-l04-e07`, `pt-a1-u03-l04-e07`, `pt-a1-u03-l05-e06`, `pt-a1-u04-l05-e06`,
  `pt-a1-u08-l04-e07`, `pt-a1-u12-l03-e08`. Varios están en segunda persona («¿Cómo te llamás?
  (Respondé que te llamás Ana.)»), pero no piden datos reales: la respuesta está dada. Pasarlos a
  `fictional` cambia la privacidad, así que serían ítems nuevos con id propio (§5).
- Ninguno pide datos del propio usuario sin respuesta esperada (self_disclosure).

La tabla `content_personas` se creó en la segunda entrega (§10), sin filas.

## 5. Decisiones menores confirmadas (con pruebas)

| Decisión                                                                 | Prueba                                                                             |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Estados `draft` / `active` / `retired`                                   | items.test: «restricciones de integridad» (`published` falla)                      |
| Backfill publicado = `active`                                            | items.test: «la base tiene exactamente…» (`not_active: 0`)                         |
| No se retira un ítem por faltar en una recarga                           | items.test: «recargar sin un ejercicio no retira su ítem»                          |
| `ref_assists.optional = true` en las seis ayudas de §7.1                 | items.test: «tablas de referencia»                                                 |
| `cefr_activity` nula sin actividad declarada; no se deduce de la entrada | catalog.test: «el estado, la actividad… no se deducen»; items.test `with_extra: 0` |
| `context` / `distractor` sin filas; sólo `target`                        | items.test: casos «concepto context/distractor»; catalog.test                      |
| Reglas de `target` sin cambios (§4.3 pasos 1–2)                          | catalog.test: «cada concepto target da las filas de §4.3»                          |

## 6. `exercise_item_versions` y ubicaciones

Esquema implementado (`20261107150000`) y `exercises.item_id` cargado para las 5.410 ubicaciones
(`20261107150100`, generado con `npm run content:catalog -- … --language en,it,pt,zh --only
placements`). Las versiones **no** se cargan: faltan las decisiones V1–V8 de
docs/EXERCISE_ITEM_VERSIONS_PENDING.md, que también separa lo ya determinado.

## 7. Orden de las migraciones de la fase 1

| #   | Migración                                             | Qué hace                                                                 |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| 1   | `20261107120000_learning_concepts.sql`                | `ref_levels`, dimensiones, tipos de concepto; `concepts` (1.107 léxicos) |
| 2   | `20261107130000_learning_items.sql`                   | `ref_*` de §4.1, `exercise_items`, `item_concepts` (sin el CHECK de §3)  |
| 3   | `20261107130101`–`130104_learning_items_<idioma>.sql` | Ítems y conceptos de ítems de en, it, pt, zh                             |
| 4   | `20261107140000_learning_ref_input_modalities.sql`    | `ref_input_modalities` y su FK                                           |
| 5   | `20261107140100_learning_items_match_pairs.sql`       | Los 300 `match_pairs` generados                                          |
| 6   | `20261107150000_learning_item_versions.sql`           | Versiones, `current_version_id`, `exercises.item_id` / `item_version_id` |
| 7   | `20261107150100_learning_item_placements.sql`         | `exercises.item_id` de las 5.410 ubicaciones                             |
| 8   | `20261107160000_learning_objectives.sql`              | Objetivos y sus tres relaciones (sin filas)                              |
| 9   | `20261107170000_practice_sources.sql`                 | `practice_sources` con 7 orígenes                                        |
| 10  | `20261107180000_content_personas.sql`                 | `content_personas` (sin filas)                                           |

Toda migración de contenido generada después de estas (`content:sql`, `content:diff`,
`content:catalog`) necesita las 10, porque escribe también personas, objetivos y ubicaciones.

## 8. Objetivos de aprendizaje: qué falta definir

Esquema completo (§4.5): `learning_objectives` (actividad del MCER obligatoria, id
`<idioma>.<nivel>.obj.<slug>` validado contra idioma y nivel, unique (`group_key`, `language_code`)),
`objective_concepts` y `item_objectives` con FK compuestas por idioma, `lesson_objectives` con el
trigger de idioma de §4.5. El formato de autoría es `content/objectives.ts` (`ObjectiveDef`), y los
tres generadores cargan objetivos y relaciones (`OBJECTIVES_SQL`): insertan, actualizan textos,
estado, `group_key` y roles, abortan si cambian el idioma, el nivel o la actividad, y abortan si el
contenido quita una relación (quitarla requiere una migración escrita a mano, sin `DELETE` en las
generadas). Probado con un objetivo de prueba que nunca se escribe en `content/`.

**Sin filas: falta la definición editorial.** §18 pide objetivos de inglés A1 en `draft` hasta la
revisión pedagógica (P8). Para escribirlos hace falta, por objetivo:

1. Id (slug) y posición.
2. Actividad del MCER (`listening` … `mediation`): obligatoria y no se puede deducir.
3. `can_do_es` («Podés…») y, si se quiere, `description_es` y el descriptor `cefr_ref`.
4. Conceptos `core` y `support`. Hoy sólo existen conceptos léxicos: los gramaticales (`en.gram.*`)
   tampoco están definidos, y §18 los pone en el mismo paquete que los objetivos.
5. Lecciones con su rol (`introduce`, `practice`, `consolidate`, `assess`) e ítems que lo evalúan.
6. `group_key` sólo si se definen equivalencias entre idiomas (D5).

`UnitDef.objective` y `LessonDef.objective` existen (textos «Podés…» de la interfaz), pero no tienen
actividad, conceptos ni roles, y convertirlos en objetivos sería una decisión pedagógica: no se usaron.

## 9. `practice_sources`: filas pendientes

Cargados los 7 orígenes con todas sus columnas definidas en §6.1: `lesson`, `consolidation`,
`srs_review`, `smart_review`, `topic_review`, `free_practice`, `mistakes_practice`. CHECK de G1
(`evidence_class = 'assessment'` ⇒ `selection_mode = 'server'`), unique (`id`, `selection_mode`) para la
FK compuesta de la fase 2. `content/practice-sources.ts` es la fuente; la prueba de la base exige que
coincidan. Lecturas de la tabla de §6.1 que conviene confirmar:

- «—» = no (SRS, progreso, energía, racha).
- `plus_feature` es texto: `smart_review` y `topic_review` llevan su propio id, como `focus_review` en
  el diseño de SRS v2; el resto, nulo. `active = true` en los siete.

**Decisiones pendientes (no se cargan):**

| Origen                     | Falta                                                                                                    | Propuesta                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `assessment`, `level_exam` | `affects_lesson_progress`: «según el caso»                                                               | `false` y `active = false` hasta diseñar las evaluaciones; el «caso» lo decide su función |
| `placement`                | `affects_lesson_progress`: «puede desbloquear»; `counts_for_streak` = no                                 | ídem                                                                                      |
| `srs_review_legacy`        | `selection_mode`: «desconocida»; la columna es obligatoria y forma parte de la FK compuesta de la fase 2 | `client_proposed` (los repasos viejos los armaba la app) con `active = false`             |

`adaptive_review` y `focus_review` son del diseño de SRS v2, sin implementar: no se cargaron.

## 10. Personas ficticias: qué falta definir

Esquema completo (§13.2): `content_personas` con `fictional = true` (CHECK), correo `@example.com`,
id `<idioma>.persona.<slug>` del idioma de la fila, correo y teléfono únicos. `personaProblems` y
`personaPrivacyProblems` validan lo mismo en `content/` más repetidos y la lista de exclusión; la prueba
de Jest la arma con los correos de los usuarios de prueba de `supabase/tests` y `server/src`. Una
persona cargada no cambia (el generador aborta).

**Sin filas, y los 13 candidatos siguen `open_text`.** No hay personas definidas, así que ninguno se
vinculó. Para vincularlos hace falta:

1. Definir cada persona (nombre, edad, ciudad, país, teléfono, correo) y completar
   `PUBLIC_FIGURE_EXCLUSIONS` (lista editorial de figuras públicas, hoy vacía).
2. Decidir **dónde se guarda el vínculo ítem → persona** en la base: §5 no tiene columna para eso y
   §13.1 sólo dice «catálogo (`content_personas`, versiones)». Propuesta: `exercise_items.persona_id`
   con FK compuesta (`persona_id`, `language_code`) y CHECK `response_privacy = 'fictional'` ⇔
   `persona_id is not null`.
3. Pasar cada candidato a `fictional` cambia su privacidad, así que es un ítem nuevo
   (`id: '<idioma>.ex.new'` y `npm run content:ids`; el id viejo queda retirado como reemplazado).
4. `self_disclosure` sigue bloqueado por P4: `personalData: 'learner'` falla.

## 11. Lo que sigue bloqueando la fase 1

1. **Versiones**: V1–V8 aprobadas e implementadas (4.022 de 4.198 ítems con versión, probado en PGlite);
   faltan los 176 ítems de distractores variables, retenidos por la condición de V5, y por eso V8
   (docs/EXERCISE_ITEM_VERSIONS_PENDING.md §5).
2. **Objetivos y conceptos gramaticales de inglés A1**: definición editorial (§8).
3. **`practice_sources`**: los cuatro orígenes de §9.
4. **Personas**: definición, lista de exclusión y dónde vive el vínculo con el ítem (§10).
5. Nada de lo escrito está aplicado en producción.
