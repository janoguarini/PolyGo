# Inglés B1

Estado (2026-11-12): **implementado y validado en local**. Nada se aplicó en producción, no hubo
despliegues, builds ni commits. Todo el contenido está en borrador (`draft`) y sin publicar.

Enfoque: el de A1 y A2 ([A1_EN_CLOSURE.md](A1_EN_CLOSURE.md), [A2_EN_COMPLETION.md](A2_EN_COMPLETION.md)).
PolyGo enseña, no certifica; el MCER es una guía de nivel. No hay exámenes, umbrales ni desbloqueos
condicionados: el alumno avanza por las lecciones como siempre.

## 1. Inventario previo

| Qué                         | Estado antes de esta fase                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| Contenido B1                | No existía (ni unidades, ni plan, ni escritura)                                            |
| Base de datos               | `curriculum_units.level` sólo admitía A1 y A2 (CHECK de `20261029021909_curriculum.sql`)   |
| `ref_levels`                | Ya tenía B1 (`20261107120000_learning_concepts.sql`)                                       |
| App                         | Agrupa el camino por `unit.level` (texto): un nivel nuevo se muestra sin cambios de código |
| Desbloqueo                  | `is_lesson_unlocked` encadena por idioma y nivel: la primera lección de B1 abre el nivel   |
| Ranked                      | Sólo usa A1 y A2 (`rush_levels`): B1 queda fuera de Ranked sin tocar nada                  |
| Vocabulario enseñado previo | ~1000 formas (A1 + A2 completos, incluidos A2 U13–U17)                                     |

## 2. Qué se agregó

### Unidades U1–U12 (`content/en/b1/unit01…12-*.ts`)

| #   | Unidad                    | Estructura principal                                                                                                      | Palabras |
| --- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Experiencias de vida      | Present perfect vs. past simple; participios irregulares; _been to / gone to_; _so far, the first time, in my life_       | 17       |
| 2   | Hábitos y aficiones       | _for / since / how long_; present perfect continuous; _enjoy, stop, avoid_ + -ing; _decide to_; _take up, give up_        | 18       |
| 3   | Anécdotas                 | Past continuous (escena) + past perfect; _by the time, as soon as, before/after + -ing, afterwards, eventually_           | 17       |
| 4   | Planes y objetivos        | _going to_ / present continuous (arreglos) / _will_ / _might_; _when, as soon as, until_ + presente; metas y proyectos    | 17       |
| 5   | Trabajo y estudios        | _have to / don't have to, must / mustn't, be allowed to_; exámenes; aviso de trabajo, CV, entrevista                      | 17       |
| 6   | Viajes y cultura          | Primer condicional; _unless_; demoras y cancelaciones; dinero y propinas; costumbres (_polite, rude, tradition_)          | 17       |
| 7   | Salud y bienestar         | _should, ought to, had better_; _as … as, not as … as, much / a bit_ + comparativo, _the more…, the better…_              | 18       |
| 8   | Tecnología y comunicación | Oraciones de relativo (_who, which, that, where_); _turn on/off, log in_; apps, redes sociales, videollamadas             | 18       |
| 9   | Medioambiente y sociedad  | Voz pasiva en presente y pasado (_is recycled, was built, by…_); _made of_; reducir, proteger; comunidad y voluntariado   | 18       |
| 10  | Noticias y medios         | Estilo indirecto (_said that, told me, asked if / where_; _is → was, will → would, can → could_); sucesos; fuentes        | 17       |
| 11  | Opiniones y relaciones    | Opinar, acordar y discrepar; ventajas y desventajas; segundo condicional, _if I were you_; _I wish_, _would rather_       | 18       |
| 12  | Problemas y soluciones    | _must be / might be / can't be_; _because of, therefore, although, however_; _break down, run out of, sort out_; reclamos | 17       |

Phrasal verbs (_take up, give up, look forward to, set up, fill in, find out, work out, turn on/off, log
in, get on with, break down, run out of, sort out_) y collocations (_make a decision, go sightseeing,
keep in touch, lose weight, get married, apply for_) van repartidos en las unidades donde se usan.

Cada unidad tiene el camino de siempre (`content/path.ts`): 5 lecciones escritas y 5 repasos generados
(dos repasos, escucha, palabras y repaso final) = **10 lecciones por unidad, 120 en total**.

Cada lección escrita sigue `docs/CONTENT_STANDARD.md`: introducción con explicación breve y dos
ejemplos, 8–10 ejercicios, al menos una escucha, los dos últimos de producción sin opciones y 2 cierres
«Ahora podés…».

| Ejercicios escritos (535) |     | Ejercicios generados de los repasos (593) |     |
| ------------------------- | --- | ----------------------------------------- | --- |
| `fill_blank`              | 154 | `listen_choice`                           | 158 |
| `context_choice`          | 99  | `translate_write`                         | 102 |
| `translate_write`         | 75  | `translation_choice`                      | 87  |
| `listen_choice`           | 60  | `complete_word`                           | 73  |
| `order_words`             | 46  | `fill_blank`                              | 69  |
| `short_answer`            | 45  | `match_pairs`                             | 58  |
| `match_pairs`             | 25  | `order_words`                             | 23  |
| `translation_choice`      | 20  | `short_answer`                            | 23  |
| `image_choice`            | 11  |                                           |     |

**Textos y audios**: 50 estímulos (4 o 5 por unidad) con 99 preguntas `context_choice`: 24 audios
(diálogos, una entrevista, una noticia de radio, una llamada) y 26 textos (12 publicaciones, 5 avisos,
4 correos, 2 mensajes, un aviso de trabajo, un programa de visita y un texto de revista). Más 60
`listen_choice` en las lecciones. Audio sintetizado a velocidad normal (1.0; el A2 usa 0.9). Personajes
ficticios con nombre de pila; ningún dato de contacto.

**Sin tipos de ejercicio nuevos** y sin cambios en la app: un cliente que reconozca `context_choice`
abre estas lecciones.

### Escritura B1 (`content/en/b1/writing.ts`)

15 tareas con el sistema de A1 y A2 (`shared/writing.ts`: sin IA, en el dispositivo, no se guarda):

- **12 guiadas**, con requisitos observables, al terminar la lección: una experiencia inolvidable
  (present perfect, U1), tu pasatiempo (_for/since_, _have been + -ing_, U2), una anécdota (past
  perfect, U3), tus objetivos (U4), un correo formal para postularte a un trabajo (U5), consejos para un
  visitante (primer condicional, U6), consejos a un amigo estresado (U7), recomendar una app (relativos,
  U8), tu barrio y el medioambiente (pasiva, U9), lo que te contaron (estilo indirecto, U10), tu opinión
  (segundo condicional, U11) y un reclamo formal (U12 L3).
- **3 libres** (sin veredicto: modelo, pistas opcionales y lista de control) al terminar los repasos
  finales de U4, U8 y U12.

`content/writing.ts` reúne las tareas de A1, A2 y B1; la tarjeta «Practicá escribiendo» las ofrece al
terminar su lección (sin cambios en la app).

## 3. Cómo se integra (sin tocar lo publicado)

- `content/b1.ts` arma `B1_PATH`, **fuera de `COURSES` y de `CURRICULUM_PATH`** (como A2 U13–U17): la
  consolidación de lo cargado, sus ids y los totales que comparan la base con `content/` no cambian. Los
  repasos generados sólo usan palabras de su unidad (`unitWordsOnly`).
- `Level` admite `'B1'` (`content/types.ts`, `content/catalog.ts`).
- **Ids**: 885 ítems registrados con `npm run content:ids` (registro 4937 → 5822: 535 escritos y 350
  generados). Ningún ítem cargado cambió de identidad (lo comprueba `content/__tests__/identity.test.ts`).
- **Vínculos**: B1 enlaza palabras publicadas, de A2 U13–U17 y propias. No enlaza las del cierre de A1
  ni A1 U13/U14 (el validador lo exige).
- **Migración de carga** `supabase/migrations/20261122120000_b1_en.sql` (`npm run content:b1 -- <archivo>`),
  con la plantilla _add-only_ de la fase C.3 sin modificarla. Antes del contenido amplía el CHECK de
  `curriculum_units.level` a `('A1', 'A2', 'B1')` (único cambio de esquema, idempotente). Todo nace
  `is_published = false` y los ítems en `draft`. Sin `delete`, cambios de funciones, RLS, rutas ni
  desbloqueo. SHA-256 `b566e927…df72645e`, igual en dos corridas. **No aplicada.**

### Vocabulario de apoyo

El validador de A2 limita todo el inglés a formas ya enseñadas. Un texto B1 natural necesita más
palabras de las que se enseñan como vocabulario, así que cada unidad declara un **vocabulario de apoyo**
(`support`, 10–22 formas por unidad, 177 en total): palabras que aparecen en textos, audios y frases
pero no son objetivo de práctica ni entran a los repasos (_really, also, only, news, project, taxi,
problem, idea, internet…_). El validador exige que cada forma de apoyo se use, que no esté ya enseñada
y, desde la unidad siguiente, la cuenta como conocida. Así el límite sigue siendo explícito y revisable.

## 4. Validación (`content/b1-checks.ts`)

La usan la prueba de Jest y el generador (que no escribe si hay problemas). Son las reglas del A2 nuevo:

- Estándar de lección, ids propios, 15–22 palabras por unidad, estructura principal declarada.
- Palabras: ids nuevos, IPA, traducción y ejemplo; ningún texto repite otro ni coincide con la
  traducción de otra palabra; todas se practican.
- **Vocabulario**: todo el inglés (respuestas, opciones, audio, estímulos, ejemplos y repasos
  generados) usa formas enseñadas antes, palabras ya introducidas en la unidad, nombres declarados o el
  apoyo de la unidad. Acepta -ing, -ed, -er, -est, el adverbio en -ly y contracciones de lo enseñado
  (_couldn't, you'd_).
- **Corrección del servidor** (`gradeWithSpec`): respuesta y aceptadas correctas, distractores no,
  opciones sin repetir; en `order_words`, oraciones sin comas.
- `context_choice` sin `words` (SRS v1), con conceptos, pregunta con «?» y explicación con la evidencia.
- Escritura: el modelo cumple sus requisitos, la lección existe y el modelo y las preguntas guía usan
  vocabulario enseñado hasta esa lección.

## 5. Pruebas

| Prueba                                             | Qué comprueba                                                                                                     |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `content/__tests__/b1.test.ts` (19)                | Reglas, camino, tipos, estructuras por unidad, registro, generadores, formas, mutaciones del validador, escritura |
| `content/__tests__/*` (5874 en total)              | Identidad de ítems, registro de ids, catálogo, versiones y conjuntos de opciones con el B1 incluido               |
| `supabase/tests/b1Content.test.mjs` (8, en PGlite) | Carga exacta, CHECK de nivel, add-only, reaplicable, aborta si una fila difiere, nada visible ni en repasos       |
|                                                    | En la base desechable: publica A2 nuevo y B1, idempotente, sólo cambia filas del B1, juega las 120 lecciones      |

## 6. Publicación (preparada, sin ejecutar)

`supabase/pending/20261123120000_publish_en_b1.sql` (`npm run content:b1-publish -- <archivo>`), mismo
mecanismo que la publicación del A2 nuevo: comprueba que las filas sean exactamente las de la carga (de
inglés B1 U1–U12), las publica, activa los conceptos y 786 ítems, y deja los 99 `context_choice` en
`draft` (D4). Sólo `UPDATE` de estado, idempotente. SHA-256 `638b1ec1…cb61f705` (regenerar si cambia la
carga). Vive en `pending/` para que nadie la aplique con el lote.

Orden para publicar:

1. Tener en las tiendas (y como mínima en uso) una build que reconozca `context_choice` y traiga la
   escritura B1 (la build local actual lo hace).
2. Aplicar las migraciones pendientes en orden; como mínimo `20261113120000_context_comprehension.sql`,
   `20261120120000_a2_en_completion.sql` y `20261122120000_b1_en.sql`.
3. Publicar el A2 nuevo (`pending/20261121120000_publish_en_a2_u13_u17.sql`): B1 enlaza palabras de A2
   U13–U17.
4. Mover `pending/20261123120000_publish_en_b1.sql` a `migrations/`, correr `npm run test:db` y aplicarla.
5. Comprobar: 12 unidades B1 publicadas; `b1-u01-l01` abierta; una lección B1 se completa en la app.

Efectos al publicar (sin cambios en los motores):

- **Ranked**: sin cambios; `rush_levels` sólo usa A1 y A2.
- **Repasos (SRS v1)**: los 786 ítems activos entran como candidatos cuando el alumno practicó su
  palabra; los de comprensión no. SRS v2, Mastery y Adaptive siguen apagados.
- **Onboarding**: `shared/profile.ts` sigue mostrando B1 como «no disponible» y `shared/languages.ts`
  lista A1 y A2 para elegir nivel inicial. Habilitar B1 como nivel de inicio es una decisión de producto
  aparte (exige ampliar también el CHECK de `profiles.start_level`).

**Revisión humana recomendada (no bloquea)**: que alguien con buen inglés lea los textos, audios y
modelos de escritura del B1. No hubo revisión nativa.

## 7. Archivos

Nuevos: `content/b1.ts`, `content/b1-checks.ts`, `content/en/b1/helpers.ts`,
`content/en/b1/unit01…12-*.ts`, `content/en/b1/writing.ts`, `content/__tests__/b1.test.ts`,
`scripts/build-b1-sql.ts`, `scripts/build-b1-publish-sql.ts`,
`supabase/migrations/20261122120000_b1_en.sql`, `supabase/pending/20261123120000_publish_en_b1.sql`,
`supabase/tests/b1Content.test.mjs`, este documento.

Modificados: `content/types.ts` y `content/catalog.ts` (nivel B1), `content/comprehension.ts` (registro),
`content/writing.ts` (tareas B1), `content/ids.lock.json` (885 ids nuevos), `package.json`
(`content:b1`, `content:b1-publish`), `content/__tests__/planned.test.ts` y `comprehension.test.ts`
(composición del registro), `supabase/tests/planned.test.mjs` y `legacyReviewRetirement.test.mjs`
(lista de migraciones), `docs/LEARNING_CURRICULUM.md`.
