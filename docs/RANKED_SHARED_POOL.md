# Ranked compartido entre cursos del mismo idioma

Estado (2026-11-27): **local**. Nada aplicado, desplegado ni commiteado.

**Decisión del dueño:** quienes estudian el mismo idioma juegan en una sola liga con un solo ELO,
sin importar su idioma de origen. Un hispanohablante y un brasileño que estudian inglés ven
exactamente las mismas palabras y frases en inglés. Los textos de apoyo se muestran a cada uno en su
idioma: español para uno y portugués para el otro (lo mismo con italiano y francés).

## Diseño

1. **Identidad = el inglés.** La partida se arma siempre con el contenido del curso **canónico** del
   idioma, es decir, su curso por defecto (`courses.is_default`; para el inglés, `en-from-es`).
   - A cada palabra y frase se le agregan (`support`) los textos del curso de cada otro asiento,
     cruzando por el inglés.
   - **Palabras:** mismo `text`. Si el texto se repite, se prefiere la palabra de la misma posición
     curricular.
   - **Frases:** mismo id (las del banco) o misma respuesta (`canonicalForm`, las de lecciones).
   - Si falta un texto, ese asiento ve el canónico y el servidor registra
     `shared_pool_support_missing` (`server/src/sharedPool.ts`).
2. **Unidades comunes por posición curricular.** Los cursos localizados se arman unidad por unidad
   desde el canónico (`content/en-src/flat.ts`), así que `ept-a1-u03` ↔ `a1-u03`.
   - `rush_canonical_unit_id` lleva cada unidad a su par en el curso por defecto: mismo idioma, nivel
     y posición.
   - `rush_common_unit_ids` intersecta en ese espacio y devuelve unidades canónicas.
   - `rush_player_unit_ids` sólo mira el curso del jugador (`user_course_for`). Las rutas se aplican
     sólo al curso por defecto, como en la capa de visibilidad.
   - Con dos jugadores del curso por defecto, el resultado es el mismo que antes.
3. **Un solo flujo, una vista por asiento.** `createChallengeStream` arma los desafíos una sola vez:
   mismo inglés, mismo orden, mismas fichas y mismo índice correcto.
   - Cada desafío lleva `localized[curso]` con los textos de apoyo en el mismo orden: `candidate` y
     `translation` en Swipe, `options` en Audio, `right` en Connect y `translation` en Sentence.
   - `ArcadeBattle` le muestra y le corrige a cada asiento `localizeChallenge(desafío, curso)`. Los
     índices son los mismos, así que la corrección, el puntaje y el ELO no cambian. Sólo la solución
     que se revela en Swipe llega en el idioma de cada asiento.
   - Los distractores no pueden confundirse en **ningún** idioma de apoyo presente (`supportOverlap`).
4. **Banco de Word Rush.** La tabla `word_rush_sentence_translations (sentence_id, source_language,
   translation)` guarda 134 frases × pt, it y fr (`content/word-rush/en-support.ts`).
5. **Partida contra bots en el teléfono:** `rush_my_unit_ids` devuelve las unidades del curso propio
   y la app lee sus propias palabras (RLS por curso). `wordLevel` ahora acepta `ept-a1-u01`.
6. **Partida de un solo curso:** no lleva `support` ni `localized`. Es la misma secuencia de siempre
   (comprobado contra el servidor sin catálogo de cursos).

## Protocolo

Sin cambios de forma: `arcade:challenge`, `ChallengeView`, `ArcadeAnswerResult` y las fotos son las
mismas. Lo único que cambia es el **contenido** de los textos de apoyo de cada asiento. Las builds que
ya están en tiendas no notan nada.

El protocolo 2 (clásico) no se localiza: sigue con los textos canónicos. Los cursos nuevos sólo llegan
con builds de protocolo 3.

## Limitaciones

- El flujo sin servidor (`rush_questions_in_units`: desarrollo y desafíos viejos por Supabase) usa las
  unidades canónicas, así que muestra los textos del curso canónico.
- Un curso no canónico no tiene rutas: puede usar todas sus unidades, como un nivel sin rutas.
- Las consignas pt/it/fr del banco no tienen revisión nativa.
