# Italiano A1 y A2

Estado (2026-11-12): **implementado y validado en local**. Nada se aplicó en producción, no hubo
despliegues, builds ni commits. Todo el contenido nuevo está en borrador (`draft`) y sin publicar.

Enfoque: el del inglés y el portugués ([PT_A1_A2.md](PT_A1_A2.md)). PolyGo enseña, no certifica; el MCER
es una guía de nivel. No hay exámenes, umbrales ni desbloqueos condicionados.
Variante: **italiano estándar contemporáneo (IT-IT)**, sin dialectos. La única expresión regional
(_daje_, de Roma) está identificada como tal. Traducciones al español rioplatense, como el piloto
(_remera_, _colectivo_, voseo).

## 1. Inventario previo

| Qué                  | Estado antes de esta fase                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Piloto A1            | U1–U12 publicadas (60 lecciones escritas, 225 palabras, ~325 formas), con Ranked                                                                              |
| Temas del piloto     | Saludos, essere, números y edad, familia, artículos y colores, casa (c'è, nel / sul), bar, rutina, horas, ciudad, gustos, preguntas y precios                 |
| Faltaba en A1        | Plural de los verbos (noi / voi / loro), profesiones, estados (essere / stare / avere), fechas y clima, transporte, al / alla, passato prossimo introductorio |
| A2                   | No existía                                                                                                                                                    |
| Comprensión / textos | Ninguna (el piloto no tiene `context_choice`)                                                                                                                 |
| Escritura            | Ninguna tarea de italiano                                                                                                                                     |
| Configuración        | `shared/languages.ts`: `it` disponible, nivel inicial sólo A1; el CHECK de nivel ya admite A1 y A2                                                            |
| Validación           | Sólo las reglas generales de `content.test.ts`                                                                                                                |

## 2. Qué se agregó

### Unidades

El piloto no se toca. Las unidades nuevas viven en su propio camino (`content/it-course.ts`, `IT_PATH`),
fuera de `COURSES` y de `CURRICULUM_PATH`, como el portugués, el inglés A2 U13–U17, B1 y B2.

| Nivel | #   | Unidad                            | Gramática principal                                                                                             | Palabras |
| ----- | --- | --------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------- |
| A1    | 13  | Profesiones y trabajo             | noi, voi, loro; essere y -are en plural (siamo, siete, lavoriamo); sono medico / faccio il medico; nostro       | 19       |
| A1    | 14  | ¿Cómo sos? ¿Cómo estás?           | Estados con essere (_sono stanco_), stare para la salud, avere (_ho fame, ho caldo_), concordancia, un po', ma  | 18       |
| A1    | 15  | Fechas, meses y clima             | Decenas hasta cento, la fecha (_il primo maggio_), _a / in_ + mes, _fa caldo, piove, nevica_, estaciones        | 18       |
| A1    | 16  | Transporte, tiempo libre y ayer   | _in treno / a piedi_, al / alla, andare en plural, primer passato prossimo (_ho mangiato, sono andato_)         | 18       |
| A2    | 1   | ¿Qué hiciste el fin de semana?    | Passato prossimo con avere (-ato, -uto, -ito; fatto, letto, preso), abbiamo / hanno, già, non… ancora           | 17       |
| A2    | 2   | Viajes                            | Passato prossimo con essere y concordancia (_sono partita, siamo stati_), _due anni fa_                         | 16       |
| A2    | 3   | Restaurantes y hotel              | Pedidos corteses con Lei (_mi porta…?, potrei…?_), el menú (primo, secondo, contorno, dolce), coperto           | 16       |
| A2    | 4   | Cuando era chico                  | Imperfetto (abitavo, giocavo; ero, avevo, facevo), c'era, di solito, da piccolo                                 | 16       |
| A2    | 5   | ¿Qué pasó? Contar un hecho        | Imperfetto (escena) vs. passato prossimo (hecho), _stavo + gerundio_, mentre, all'improvviso, quindi            | 16       |
| A2    | 6   | Planes e invitaciones             | Futuro semplice (andrò, farò, sarà, verrò), _ti va di…?, che ne dici?_, aceptar y rechazar, prossimo / tra      | 17       |
| A2    | 7   | Trabajo y estudios                | _Sto studiando_, presente + da (_da due anni_) vs. fa, dovere y potere, laurearsi                               | 16       |
| A2    | 8   | Salud y bienestar                 | _Mi fa male / ho mal di_, dal medico, imperativo con tu (_prendi, riposati, non mangiare_) y con Lei (_prenda_) | 17       |
| A2    | 9   | Compras y servicios               | Comparativos (_più / meno … di_), migliore / peggiore, superlativo e -issimo, ne (_ne prendo tre_)              | 17       |
| A2    | 10  | Tecnología y comunicación         | Pronombres de objeto: _ti chiamo, lo vedo, la chiamo, gli scrivo, le telefono_                                  | 16       |
| A2    | 11  | Rutina y relaciones               | Reflexivos en todas las personas y en pasado (_mi sono alzata_), recíprocos, ci de lugar, frecuencia            | 17       |
| A2    | 12  | Opiniones, problemas y soluciones | _Secondo me, sono d'accordo_, condizionale (_mi piacerebbe, dovresti, preferirei_), conectores, reclamos        | 17       |

Cada unidad: objetivo comunicativo, gramática con ejemplos, 5 lecciones escritas y el camino de siempre
(`content/path.ts`): L1 · L2 · Repaso · L3 · L4 · Repaso · L5 · Escucha · Palabras · Repaso final =
**10 lecciones por unidad, 160 en total** (80 escritas, 80 de repaso generadas con `unitWordsOnly`).
Cada lección escrita: introducción con dos ejemplos, 8–10 ejercicios, al menos una escucha, los dos
últimos de producción y 2 cierres «Ahora podés…».

**Diferencias con el español trabajadas a propósito** (en explicaciones y distractores):

- Falsos amigos: _siete_ (= ustedes son; 7 es _sette_), _negozio_, _cameriere_ / _camera_, _caldo_,
  _carino_, _macchina_, _guardare_, _prendere_, _partita_, _spesa_, _lettera_ / _carta_, _salire_ / _uscire_,
  _burro_, _campagna_, _paese_, _subito_, _imbarazzato_ / _incinta_, _magari_, _mi dispiace_, _colloquio_,
  _ricetta_, _saldi_, _scontrino_ / _sconto_, _spesso_, _presto_. _Attualmente_ y _sensibile_ se enseñan
  como lo que son para un hispanohablante (iguales al español), aclarando _sensato_.
- Gramática: estados con essere (_sono stanco_ ≠ «sto stanco»), profesión sin artículo con essere y con
  artículo con fare, il primo para el día 1, _giocare a calcio_ sin artículo, _invitare Marco_ sin «a»,
  _andare dal medico_ (da + persona), in con el transporte y _a piedi_, concordancia del participio con
  essere, el auxiliar de los verbos de movimiento y reflexivos, presente + da vs. fa, gli / le con
  telefonare frente a lo / la con chiamare, ne con cantidades y el condizionale de cortesía.
- Cultura: Ferragosto y los cierres de agosto, el contraste de hemisferios, il coperto y la mancia, el
  orden del menú, el aperitivo, el cappuccino después del almuerzo, el etto en el mercado, i saldi de
  enero y julio, Romeo y Julieta en Verona.

### Vocabulario

- **271 palabras nuevas** (A1 73, A2 198), con traducción al español rioplatense, ejemplo y unidad; ids
  `it-…` nuevos. Sin IPA, como el piloto de italiano. Ninguna repite el texto de una palabra del piloto
  ni choca con su traducción (por eso _ho letto_ se traduce «yo leí»: «leí» sin tilde es _lei_).
- **Vocabulario de apoyo: 330 formas** (A1 36, A2 294), declarado por unidad en `support`: formas que
  usan los textos, audios y frases sin ser palabras practicadas (conjugaciones de verbos ya vistos,
  _pasta, pomodoro, trattoria, sciroppo, cuffie_…). No entran a los repasos.

### Ejercicios

| Escritos (740)       |     | En los repasos generados (800) |     |
| -------------------- | --- | ------------------------------ | --- |
| `context_choice`     | 162 | `listen_choice`                | 166 |
| `fill_blank`         | 146 | `translation_choice`           | 118 |
| `translation_choice` | 116 | `translate_write`              | 91  |
| `listen_choice`      | 81  | `complete_word`                | 89  |
| `short_answer`       | 80  | `match_pairs`                  | 80  |
| `translate_write`    | 80  | Frases escritas reutilizadas   | 256 |
| `order_words`        | 33  |                                |     |
| `match_pairs`        | 26  |                                |     |
| `image_choice`       | 16  |                                |     |

**Sin tipos nuevos.** Los diálogos contextualizados son `context_choice` (audio) y `listen_choice`; la
producción escrita libre es el sistema de escritura (§2, Escritura). 475 ítems generados nuevos.

### Textos y audios

**59 estímulos** con 162 preguntas `context_choice`, al menos un audio y un texto por unidad:

- A1 (13, ~28 palabras de media): 8 audios (diálogos, una llamada, un pronóstico por radio) y 5 textos
  (publicaciones, mensajes, un cartel de Ferragosto). Velocidad 0.85.
- A2 (46, ~34 palabras de media): 22 audios (conversaciones, consultorio, farmacia, hotel, trattoria,
  entrevista de trabajo, anuncios del aeropuerto, mensajes de voz, oficina) y 24 textos (publicaciones,
  grupos de mensajes, postal, carta de una trattoria, reseña, avisos y carteles, aviso clasificado,
  foro). Velocidad 0.9.

Personajes ficticios con nombre de pila; ningún dato de contacto.

### Escritura (`content/it/writing.ts`)

21 tareas con el sistema existente (`shared/writing.ts`: sin IA, en el dispositivo, no se guarda):

- **A1, 7 guiadas**: presentarse (piloto U2), la familia (U4), la casa (U6), la rutina (U8), los gustos
  (U11), el trabajo (U13) y un mensaje para salir (U16). **1 libre** al terminar el A1 (U16, repaso final).
- **A2, 11 guiadas**: el fin de semana (U1), un viaje (U2), un correo para reservar (U3), la infancia (U4),
  algo que te pasó (U5), invitar y responder (U6), un correo formal para un trabajo (U7), consejos de
  salud (U8), recomendar una tienda (U9), un mensaje con pronombres (U10) y tu opinión (U12). **2
  libres**: organizar un viaje (U6, repaso final) y un día que no olvidás (U12, repaso final).

Las tareas del piloto (U2–U11) aparecen al terminar lecciones ya publicadas: viajan con la app, así
que se ven recién con una build nueva. La etiqueta del campo («Tu texto en italiano») ya sale del idioma
de la tarea (`WritingTask.tsx`, cambio del portugués): no hubo cambios en la app.

## 3. Cómo se integra (sin tocar lo publicado)

- `content/it-course.ts` arma `IT_PATH` (A1 U13–U16 + A2 U1–U12). El piloto (`content/it/a1/unit01…12`)
  no cambió: su consolidación, ids y vínculos son los mismos (`identity.test.ts`).
- **Ids**: 1215 ítems registrados con `npm run content:ids` (registro 7998 → 9213: 740 escritos sorteados y
  475 generados). Ningún ítem cargado cambió de identidad.
- **Vínculos**: sólo palabras del piloto (publicadas) y propias. No enlaza nada del inglés ni del
  portugués: publicar el italiano no depende de otras publicaciones.
- **Migración de carga** `supabase/migrations/20261128120000_it_a1_a2.sql` (`npm run content:it -- <archivo>`),
  con la plantilla _add-only_ de la fase C.3 sin modificarla. **Sin cambios de esquema** (el CHECK de nivel
  ya admite A1 y A2). Todo nace `is_published = false` y los ítems en `draft`. Sin `delete`, funciones,
  RLS, rutas ni desbloqueo. SHA-256 `3bcb320f…d858f7`, igual en dos corridas. **No aplicada.**
- Ranked, SRS, Mastery, Adaptive y Learning Machine: sin cambios.

## 4. Validación (`content/it-checks.ts`)

La usan la prueba de Jest y el generador (que no escribe si hay problemas). Reglas del portugués
adaptadas al italiano:

- Estándar de lección, ids propios, 14–20 palabras por unidad, objetivo y gramática declarados, draft.
- Palabras: ids nuevos `it-`, traducción y ejemplo; ningún texto repite otro ni coincide con la traducción
  de otra palabra (salvo cognados); todas se practican.
- **Vocabulario**: todo el italiano (respuestas, opciones, audio, estímulos, ejemplos, gramática y repasos
  generados) usa formas enseñadas antes (el piloto entero, las unidades nuevas anteriores y su apoyo),
  palabras ya introducidas en la unidad, nombres declarados o el apoyo de la unidad. Los apóstrofos
  separan (_l'acqua_ → _l_, _acqua_). Acepta el plural y el género regulares de lo enseñado (_amiche,
  bianchi, stazioni, figli, cameriera, piccolo_); las formas verbales nuevas se enseñan o se declaran.
- **Corrección del servidor** (`gradeWithSpec`): respuesta y aceptadas correctas, distractores no,
  opciones sin repetir **también sin tildes** (_è / e_, _campaña / campana_ cuentan como iguales).
- `context_choice` sin `words` (SRS v1), con conceptos, pregunta con «?», explicación con la evidencia,
  audio entre 0.75 y 0.9. Repasos generados sin traducir cognados (por eso las frases de traducción no
  enlazan _padre, madre, medico, al_).
- Escritura: el modelo cumple sus requisitos, la lección existe y el modelo y las preguntas guía usan
  vocabulario enseñado hasta esa lección (para las del piloto, hasta esa unidad del piloto).

## 5. Pruebas

| Prueba                                              | Qué comprueba                                                                                       |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `content/__tests__/it.test.ts` (23)                 | Reglas, camino, tipos, gramática por unidad, longitud de textos, velocidad, registro, corrección,   |
|                                                     | carga y publicación exactas, mutaciones del validador, lematización, escritura                      |
| `content/__tests__/*` (5940 en total)               | Identidad de ítems (pilotos incluidos), registro de ids, catálogo, versiones, conjuntos de opciones |
| `supabase/tests/itContent.test.mjs` (8, en PGlite)  | Carga exacta, sin cambios de esquema, add-only, reaplicable, aborta si una fila difiere, invisible  |
|                                                     | En la base desechable: publica, idempotente, sólo filas propias, juega las 160 lecciones            |
| `items`, `learning`, `versions`, `presentations`, … | Incluyen `IT_PATH` y la migración nueva en sus listas                                               |

## 6. Publicación (preparada, sin ejecutar)

`supabase/pending/20261129120000_publish_it_a1_a2.sql` (`npm run content:it-publish -- <archivo>`): mismo
mecanismo que las publicaciones del inglés y del portugués. Comprueba que las filas sean exactamente las
de la carga (de italiano A1 U13–U16 / A2 U1–U12), las publica, activa los conceptos y 1053 ítems y deja
los 162 `context_choice` en `draft` (D4). Sólo `UPDATE` de estado, idempotente. SHA-256 `1b213af0…0ef176`
(regenerar si cambia la carga). Vive en `pending/` para que nadie la aplique con el lote.

Orden para publicar (al final, junto con el resto):

1. Tener en las tiendas (y como mínima en uso) una build que reconozca `context_choice` y traiga la
   escritura de italiano (la build local actual lo hace).
2. Aplicar las migraciones pendientes en orden; como mínimo `20261113120000_context_comprehension.sql` y
   `20261128120000_it_a1_a2.sql`.
3. Mover `pending/20261129120000_publish_it_a1_a2.sql` a `migrations/`, correr `npm run test:db` y aplicarla.
4. Comprobar: 16 unidades publicadas; `it-a2-u01-l01` abierta; `it-a1-u13-l01` se abre al terminar
   `it-a1-u12-final`; una lección se completa en la app.

Efectos al publicar (sin cambios en los motores):

- **Ranked**: usa palabras publicadas de A1 y A2 (`rush_levels`); las palabras nuevas del italiano
  entrarían a su Ranked. Revisarlo antes de publicar si se quiere limitar.
- **Repasos (SRS v1)**: los 1053 ítems activos entran como candidatos cuando el alumno practicó su
  palabra; los de comprensión no. SRS v2, Mastery y Adaptive siguen apagados.
- **Nivel inicial**: `shared/languages.ts` sigue ofreciendo sólo A1 para italiano. Ofrecer A2 como nivel
  de inicio es una decisión de producto aparte.

**Revisión humana recomendada (no bloquea)**: que un hablante de italiano lea los textos, audios, modelos
de escritura y el registro (Lei en el consultorio, el hotel y la oficina). No hubo revisión nativa.

## 7. Archivos

Nuevos: `content/it-course.ts`, `content/it-checks.ts`, `content/it/helpers.ts`, `content/it/writing.ts`,
`content/it/a1/extra.ts`, `content/it/a1/unit13…16-*.ts`, `content/it/a2/index.ts`,
`content/it/a2/unit01…12-*.ts`, `content/__tests__/it.test.ts`, `scripts/build-it-sql.ts`,
`scripts/build-it-publish-sql.ts`, `supabase/migrations/20261128120000_it_a1_a2.sql`,
`supabase/pending/20261129120000_publish_it_a1_a2.sql`, `supabase/tests/itContent.test.mjs`, este documento.

Modificados: `content/comprehension.ts` (registro), `content/writing.ts` (tareas de italiano),
`content/ids.lock.json` (1215 ids nuevos), `package.json` (`content:it`, `content:it-publish`),
`content/__tests__/comprehension.test.ts` y `planned.test.ts` (composición del registro),
`supabase/tests/items`, `learning`, `versions`, `presentations`, `planned`, `legacyReviewRetirement` y
`a2Publish.test.mjs` (tramos y lista de migraciones; `items.test.mjs` cuenta los ítems nuevos en
italiano), `docs/LEARNING_CURRICULUM.md`.
