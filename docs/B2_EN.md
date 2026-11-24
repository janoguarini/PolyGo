# Inglés B2

Estado (2026-11-12): **implementado y validado en local**. Nada se aplicó en producción, no hubo
despliegues, builds ni commits. Todo el contenido está en borrador (`draft`) y sin publicar.

Enfoque: el de A1, A2 y B1 ([B1_EN.md](B1_EN.md)). PolyGo enseña, no certifica; el MCER es una guía de
nivel. No hay exámenes, umbrales ni desbloqueos condicionados.

## 1. Inventario previo

| Qué                         | Estado antes de esta fase                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| Contenido B2                | No existía                                                                               |
| Base de datos               | `curriculum_units.level` admitía A1, A2 y B1 (CHECK que dejó `20261122120000_b1_en.sql`) |
| `ref_levels`                | Ya tenía B2 (`20261107120000_learning_concepts.sql`)                                     |
| App                         | Agrupa el camino por `unit.level`: un nivel nuevo se muestra sin cambios de código       |
| Desbloqueo                  | `is_lesson_unlocked` encadena por idioma y nivel: `b2-u01-l01` abre el nivel (probado)   |
| Ranked                      | Sólo usa A1 y A2 (`rush_levels`): B2 queda fuera de Ranked sin tocar nada                |
| Vocabulario enseñado previo | ~1500 formas (A1, A2 y B1 completos, con el vocabulario de apoyo del B1)                 |

## 2. Qué se agregó

### Unidades U1–U12 (`content/en/b2/unit01…12-*.ts`)

| #   | Unidad                             | Estructura principal                                                                                                                      | Palabras |
| --- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Decir las cosas con matices        | Verbos con -ing o infinitivo (_remember / stop / regret / mean to_); suavizar: _tend to, seem, apparently_                                | 19       |
| 2   | Trabajo, liderazgo y negociación   | Condiciones: _as long as, provided that, otherwise, in case_; colocaciones (_reach an agreement_)                                         | 18       |
| 3   | Sociedad, cultura y actualidad     | Pasiva avanzada: _has been done, is being done, should be done, it is said that, is expected to_                                          | 18       |
| 4   | Ciencia, tecnología e innovación   | Relativos avanzados: explicativas con comas, _whose_, _which_ (= lo cual), _for whom_, _most of which_                                    | 17       |
| 5   | Economía, consumo y finanzas       | Causativa (_have / get something done_); comparación: _twice as… as, nowhere near as, by far, the …-er_                                   | 18       |
| 6   | Psicología y relaciones            | Modales perfectos: _must / might / can't have_ (deducción), _should / shouldn't / could have_ (lamento)                                   | 18       |
| 7   | Medioambiente y problemas globales | Concesivas y contraste: _despite, in spite of, even though, even if, whereas_                                                             | 18       |
| 8   | Medios y desinformación            | Estilo indirecto avanzado: _claim, suggest + -ing, warn not to, insist on, accuse of, deny / admit + -ing, refuse to_                     | 18       |
| 9   | Educación y desarrollo personal    | Tercer condicional; _wish / if only_ + past perfect                                                                                       | 17       |
| 10  | Argumentación y debate             | Oraciones escindidas (_What matters is…, The reason why… is that…, It is… that…_); conectores formales                                    | 18       |
| 11  | Historias, libros y expresiones    | Oraciones con participio (_Walking…, Having missed…_); inversión narrativa (_Never had…, Hardly had… when, No sooner… than, Little did…_) | 18       |
| 12  | Decisiones y conflictos            | Condicionales mixtos; inversión enfática (_Not only…, Under no circumstances…, Only then…, Should you…_)                                  | 18       |

**215 palabras nuevas** (expresiones y colocaciones incluidas). Phrasal verbs (_get across, point out,
bring up, take on, turn down, come up with, rely on, keep up with, cut back on, fall out, make up, cheer
up, let down, drop out, catch up, look back on, turn out, set off, weigh up, stand up for, back down_),
colocaciones (_reach an agreement, meet halfway, take place, make progress, take into account, take
sides, common ground, value for money, carbon footprint_) e _idioms_ (_break the ice, out of the blue, a
piece of cake, once in a blue moon, the last straw, burst into tears, gut feeling_) van repartidos donde
se usan. También lenguaje para argumentar (_moreover, nevertheless, admittedly, on the contrary, to sum
up, all things considered_), formal e informal (correos y avisos frente a charlas) y matices (_blunt /
straightforward / tactful_, _upset / angry_, _biased / misleading_).

Cada unidad tiene el camino de siempre (`content/path.ts`): 5 lecciones escritas y 5 repasos generados
(dos repasos, escucha, palabras y repaso final) = **10 lecciones por unidad, 120 en total**. Cada lección
escrita sigue `docs/CONTENT_STANDARD.md`: introducción con explicación y dos ejemplos, 8–10 ejercicios,
al menos una escucha, los dos últimos de producción sin opciones y 2 cierres «Ahora podés…».

| Ejercicios escritos (576) |     | Ejercicios generados de los repasos (600) |     |
| ------------------------- | --- | ----------------------------------------- | --- |
| `context_choice`          | 153 | `listen_choice`                           | 159 |
| `fill_blank`              | 141 | `translate_write`                         | 106 |
| `listen_choice`           | 60  | `translation_choice`                      | 86  |
| `short_answer`            | 60  | `complete_word`                           | 72  |
| `translate_write`         | 60  | `fill_blank`                              | 70  |
| `order_words`             | 47  | `match_pairs`                             | 60  |
| `match_pairs`             | 41  | `short_answer`                            | 26  |
| `translation_choice`      | 9   | `order_words`                             | 21  |
| `image_choice`            | 5   |                                           |     |

**Textos y audios**: 48 estímulos (4 por unidad, siempre lectura y escucha) con 153 preguntas
`context_choice` (B1: 50 estímulos y 99 preguntas). **24 audios**: conversaciones, una negociación, un
informe de radio, un pódcast, entrevistas (radio y televisión), un debate escolar, una reunión de
equipo, una tutoría y un relato familiar. **24 textos**: artículos de opinión y de divulgación, una
guía contra la desinformación, una noticia, una columna de consejos, reseñas, avisos formales, correos
(oferta de trabajo, disculpa) y el comienzo de un cuento. Promedio de **99 palabras por estímulo**
(B1: 45; máximo 128). Las preguntas apuntan a intención, tono, relaciones entre ideas y matices
(«¿qué tono tiene el correo?», «¿qué concede y cómo lo rebate?», «¿qué efecto tiene la última
oración?»), no sólo a datos. Más 60 `listen_choice` en las lecciones. Audio sintetizado a velocidad
normal (1.0). Personajes ficticios con nombre de pila; ningún dato de contacto.

**Sin tipos de ejercicio nuevos ni cambios en la app.** Los artículos usan el tipo de documento `post`
(«PUBLICACIÓN»), que ya existía.

### Escritura B2 (`content/en/b2/writing.ts`)

15 tareas con el sistema de siempre (`shared/writing.ts`: sin IA, en el dispositivo, no se guarda):

- **12 guiadas** (al terminar la L5 de cada unidad), con requisitos observables: aclarar un malentendido
  (U1), responder una oferta de trabajo con condiciones (correo formal, U2), un informe breve sobre tu
  ciudad (pasiva, U3), tu opinión sobre una tecnología (relativos, U4), un reclamo con propuesta (U5),
  un mensaje para hacer las paces (modales perfectos, U6), un artículo de opinión ambiental (U7), contar
  una noticia con verbos de reporte (U8), mirar atrás en tu educación (tercer condicional, U9), una
  argumentación con concesión y conclusión (U10), el comienzo de un relato (U11) y recomendar una entre
  dos alternativas (U12).
- **3 libres** (sin veredicto: modelo, pistas opcionales y lista de control) al terminar los repasos
  finales de U4 (una propuesta), U8 (discrepar con diplomacia) y U12 (artículo de ventajas y
  desventajas).

`content/writing.ts` reúne las tareas de A1 a B2; la tarjeta «Practicá escribiendo» las ofrece al
terminar su lección (sin cambios en la app).

## 3. Cómo se integra (sin tocar lo publicado)

- `content/b2.ts` arma `B2_PATH`, **fuera de `COURSES` y de `CURRICULUM_PATH`** (como B1). Los repasos
  generados sólo usan palabras de su unidad (`unitWordsOnly`).
- `Level` admite `'B2'` (`content/types.ts`, `content/catalog.ts`).
- **Ids**: 941 ítems registrados con `npm run content:ids` (registro 5822 → 6763: 576 escritos y 365
  generados). Ningún ítem anterior cambió de identidad (`content:ids -- check` OK).
- **Vínculos**: B2 enlaza palabras publicadas, de A2 U13–U17, del B1 y propias (el validador lo exige).
- **Migración de carga** `supabase/migrations/20261124120000_b2_en.sql` (`npm run content:b2 -- <archivo>`),
  plantilla _add-only_ de la fase C.3 sin modificar. Antes del contenido amplía el CHECK de
  `curriculum_units.level` a `('A1', 'A2', 'B1', 'B2')` (único cambio de esquema, idempotente). Todo nace
  `is_published = false` y los ítems en `draft`. Sin `delete`, cambios de funciones, RLS, rutas ni
  desbloqueo. SHA-256 `f06ef4b4…3985388f`, igual en dos corridas. **No aplicada.**
  - Reversión (sólo si hiciera falta y antes de publicar): borrar las filas `b2-u%` que agregó y volver
    el CHECK a `('A1', 'A2', 'B1')`. No hay datos de alumnos que dependan de ellas mientras no se publique.

### Vocabulario de apoyo

Como en B1, cada unidad declara un **vocabulario de apoyo** (`support`, 22–56 formas por unidad, 400 en
total): palabras que aparecen en textos, audios y frases sin ser objetivo de práctica (_mistake, research,
believe, species, campaign, lighthouse…_). No entran a los repasos. El validador exige que cada forma se
use y que no esté ya enseñada; desde la unidad siguiente cuenta como conocida. Es más que en B1 (177)
porque los textos B2 duplican el largo.

## 4. Validación (`content/b2-checks.ts`)

Las reglas del B1 con el límite corrido un nivel: estándar de lección, ids propios, 15–22 palabras por
unidad; palabras con IPA, traducción y ejemplo, sin repetir textos ni traducciones de A1–B1; todo el
inglés (respuestas, opciones, audio, estímulos, ejemplos y repasos generados) usa formas enseñadas antes,
introducidas en la unidad, nombres declarados o apoyo; **corrección del servidor** (`gradeWithSpec`):
respuesta y aceptadas correctas, distractores no; `context_choice` sin `words` (SRS v1), con conceptos,
pregunta con «?» y explicación con la evidencia; escritura con modelo que cumple sus requisitos y
vocabulario enseñado hasta esa lección.

## 5. Pruebas

| Prueba                                           | Resultado                                                                                                                                                                                                                                                             |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/__tests__/b2.test.ts` (20)              | ✅ reglas, camino, tipos, estructuras por unidad, largo de textos, registro, generadores, mutaciones del validador, escritura                                                                                                                                         |
| `content/__tests__/*` (5894) y `npx jest` (6570) | ✅                                                                                                                                                                                                                                                                    |
| `supabase/tests/b2Content.test.mjs` (8, PGlite)  | ✅ carga exacta, CHECK con B2, add-only, reaplicable, aborta si una fila difiere, nada visible ni en repasos; en la base desechable publica A2 nuevo → B1 → B2, idempotente, sólo cambia filas del B2 y **juega las 120 lecciones B2** con la corrección del servidor |
| `npx tsc --noEmit`, `npx expo lint`              | ✅ sin errores                                                                                                                                                                                                                                                        |

Se actualizaron las pruebas que enumeran tramos o migraciones (`items`, `learning`, `presentations`,
`versions`, `planned`, `legacyReviewRetirement`, `a2Publish` y los conteos de `planned.test.ts` y
`comprehension.test.ts`).

## 6. Publicación (preparada, sin ejecutar)

`supabase/pending/20261125120000_publish_en_b2.sql` (`npm run content:b2-publish -- <archivo>`): mismo
mecanismo que la del B1. Comprueba que las filas sean exactamente las de la carga (inglés B2 U1–U12),
publica, activa conceptos y 788 ítems y deja los 153 `context_choice` en `draft` (D4). Sólo `UPDATE` de
estado, idempotente. SHA-256 `e85571fb…43b8ec489` (regenerar si cambia la carga).

Orden para publicar:

1. Build de tiendas que reconozca `context_choice` y traiga la escritura B2 (la build local lo hace).
2. Aplicar las migraciones pendientes en orden, incluidas `20261120120000_a2_en_completion.sql`,
   `20261122120000_b1_en.sql` y `20261124120000_b2_en.sql`.
3. Publicar A2 U13–U17, después el B1 (`pending/…_publish_en_a2_u13_u17.sql`, `pending/…_publish_en_b1.sql`).
4. Mover `pending/20261125120000_publish_en_b2.sql` a `migrations/`, correr `npm run test:db` y aplicarla.
5. Comprobar: 12 unidades B2 publicadas; `b2-u01-l01` abierta; una lección B2 se completa en la app.

Efectos al publicar (sin cambios en los motores): Ranked sin cambios (`rush_levels` sólo A1/A2); los 788
ítems activos entran a los repasos SRS v1 como cualquier ítem; SRS v2, Mastery y Adaptive siguen
apagados. El onboarding sigue sin ofrecer B1/B2 como nivel de inicio (decisión de producto aparte, exige
ampliar el CHECK de `profiles.start_level`).

**Revisión humana recomendada (no bloquea)**: que alguien con buen inglés lea textos, audios y modelos
de escritura. No hubo revisión nativa.

## 7. Archivos

Nuevos: `content/b2.ts`, `content/b2-checks.ts`, `content/en/b2/unit01…12-*.ts`,
`content/en/b2/writing.ts`, `content/__tests__/b2.test.ts`, `scripts/build-b2-sql.ts`,
`scripts/build-b2-publish-sql.ts`, `supabase/migrations/20261124120000_b2_en.sql`,
`supabase/pending/20261125120000_publish_en_b2.sql`, `supabase/tests/b2Content.test.mjs`, este documento.

Modificados: `content/types.ts` y `content/catalog.ts` (nivel B2), `content/comprehension.ts` (registro),
`content/writing.ts` (tareas B2), `content/ids.lock.json` (941 ids), `package.json` (`content:b2`,
`content:b2-publish`), `content/__tests__/planned.test.ts` y `comprehension.test.ts`,
`supabase/tests/{items,learning,presentations,versions,planned,legacyReviewRetirement,a2Publish}.test.mjs`,
`docs/LEARNING_CURRICULUM.md`.
