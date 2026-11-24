# Inglés A2 completo

Estado (2026-11-12): **implementado y validado en local**. Nada se aplicó en producción, no hubo
despliegues, builds ni commits. Contenido nuevo en borrador (`draft`) y sin publicar.

Enfoque: el mismo del cierre de A1 ([A1_EN_CLOSURE.md](A1_EN_CLOSURE.md)). PolyGo enseña, no
certifica; el MCER es una guía de nivel. No hay exámenes, umbrales ni desbloqueos condicionados: el
usuario avanza por las lecciones como siempre.

## 1. Inventario

| Qué                                   | Estado antes de esta fase                                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| A2 U1–U12 (`content/en/a2/unit01…12`) | Cargadas y **publicadas** desde octubre: 60 lecciones escritas (120 con los repasos), 241 palabras, 1047 ejercicios |
| Mapa curricular de A2                 | No existe (A1 tiene `docs/polygo-ingles-a1-mapa-curricular.md`)                                                     |
| Introducción y cierres por lección    | No (igual que A1 U5–U12). No se agregan: cambiaría filas publicadas                                                 |
| Comprensión en contexto               | No                                                                                                                  |
| Escritura                             | No                                                                                                                  |

Las 12 unidades cubren: pasado de _to be_, pasado regular e irregular, viajes, presente continuo, ropa y
compras, comparativos, futuro, salud, trabajo, clima y presente perfecto. **Faltaban** áreas habituales
de A2: comer afuera, tiempo libre e invitaciones, describir personas y lugares, mensajes y correos,
teléfono y hotel, y contar historias (past continuous). Se reutiliza todo lo cargado; no se duplicó nada.

## 2. Qué se agregó

### Unidades U13–U17 (`content/en/a2/unit13…17-*.ts`)

| #   | Unidad                       | Contenido y estructuras                                                                                                                                                                                      | Palabras |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 13  | Comer afuera                 | Menú y platos; _some/any_; _much/many/a lot of_ (contables e incontables); _Could I have…?_; _a table for two_; la cuenta y cómo pagar; leer un menú con precios                                             | 18       |
| 14  | Tiempo libre e invitaciones  | Pasatiempos y frecuencia (_often, once a week_); _Would you like to…?_; _Let's…_; _How about + -ing_; aceptar (_I'd love to_) y rechazar (_Sorry, I can't. Maybe another time_); quedar (_Let's meet at…_)   | 17       |
| 15  | Cómo es                      | Aspecto (_What does she look like?_, _has curly hair_) vs. carácter (_What is she like?_); barrio y lugares (_quiet, noisy, crowded_); comparativos en -ier y con consonante doble (_noisier, thinner_)      | 17       |
| 16  | Mensajes, correos y llamadas | Mensajes informales (_Thanks for…, Take care_); correo (_Dear…, Best wishes_); _Could you…?_; teléfono (_Hold on, leave a message, call back_); reservar un hotel (_book a room, double room, check in/out_) | 16       |
| 17  | Contar una historia          | Past continuous (_was/were + -ing_); _when_ y _while_; _suddenly, luckily_; accidentes (_fell, broke, What happened?_); ordenar un relato (_at first, then, the next day, in the end_)                       | 16       |

Cada unidad tiene el camino de siempre (`content/path.ts`): 5 lecciones escritas y 5 repasos generados
(dos repasos, escucha, palabras y repaso final) = **10 lecciones por unidad, 50 en total**.

Cada lección escrita sigue `docs/CONTENT_STANDARD.md`: introducción con dos ejemplos, 8–10 ejercicios,
al menos una escucha, los dos últimos de producción sin opciones y 2–3 cierres «Ahora podés…».

| Ejercicios escritos (219)  |     | Ejercicios generados de los repasos (250) |     |
| -------------------------- | --- | ----------------------------------------- | --- |
| `fill_blank`               | 53  | `listen_choice`                           | 68  |
| `translate_write`          | 34  | `translate_write`                         | 47  |
| `listen_choice`            | 25  | `translation_choice`                      | 34  |
| `order_words`              | 20  | `complete_word`                           | 30  |
| `context_choice` (lectura) | 20  | `fill_blank`                              | 27  |
| `context_choice` (escucha) | 18  | `match_pairs`                             | 25  |
| `short_answer`             | 16  | `order_words`                             | 12  |
| `translation_choice`       | 12  | `short_answer`                            | 7   |
| `match_pairs`              | 11  |                                           |     |
| `image_choice`             | 8   |                                           |     |
| `complete_word`            | 2   |                                           |     |

**Comprensión en contexto**: 19 estímulos (menú, mensajes, correos, una publicación, una descripción,
diálogos y relatos en audio) con 38 preguntas `context_choice`, dentro de las lecciones de cada unidad.
Audio sintetizado a 0.9 (A2: un poco más lento que lo normal). Personajes ficticios con nombre de pila;
ningún dato de contacto.

**Sin tipos de ejercicio nuevos** y sin cambios en la app para las lecciones: un cliente actual las abre.

### Escritura A2 (`content/en/a2/writing.ts`)

13 tareas con el sistema de A1 (`shared/writing.ts`, sin IA, en el dispositivo, no se guarda):

- **10 guiadas**, con requisitos observables, al terminar la lección: una fiesta (_was/were_, U1 L5),
  tu fin de semana (pasado, U3 L5), un mensaje desde tus vacaciones (_by_ + transporte, U4 L5), tus
  planes (_going to_ y _will_, U8 L5), un consejo (_should/shouldn't_, U9 L5), tus experiencias
  (presente perfecto, U12 L5), una cena afuera (U13 L5), responder una invitación (U14 L5), describir a
  alguien (U15 L5) y un correo para reservar (U16 L5).
- **3 libres** (sin veredicto: modelo, pistas opcionales y lista de control) al terminar los repasos
  finales de U6, U12 y U17.

`content/writing.ts` reúne las tareas de A1 y A2; la tarjeta «Practicá escribiendo» y la pantalla
`/writing/[id]` ahora leen de ahí. **Las 6 tareas de U1–U12 aparecen en lecciones ya publicadas** con la
próxima build (son opcionales y no cambian el progreso); las de U13–U17, cuando se publiquen esas unidades.

## 3. Cómo se integra (sin tocar lo publicado)

- `content/a2-expansion.ts` arma `A2_EXPANSION_PATH`, **fuera de `COURSES` y de `CURRICULUM_PATH`**
  (igual que las unidades planificadas de A1): la consolidación de las unidades cargadas, sus ids, los
  totales que comparan la base con `content/` y lo que ve la app no cambian. Los repasos generados sólo
  usan palabras de su unidad (`unitWordsOnly`).
- **Ids**: 362 ítems registrados con `npm run content:ids` (registro 4569 → 4937). Una palabra prevista
  (_see you soon_) se cambió por _take care_ porque coincidía con la respuesta de un ejercicio publicado
  de A2 U8 y le habría cambiado el modo (identidad) a ese ítem. En la preparación de la publicación,
  6 ejercicios dejaron de enlazar palabras de A1 sin publicar (_people_ y _children_ del cierre de A1,
  _dollar_ e _I'd like_ de A1 U14): sus ids se reemplazaron (6 retirados, nunca aplicados en ninguna
  base). El validador ahora exige que U13–U17 sólo enlacen palabras propias o publicadas.
- **Migración** `supabase/migrations/20261120120000_a2_en_completion.sql`, generada con
  `npm run content:a2 -- <archivo>` y la plantilla _add-only_ de la fase C.3 sin modificarla. Todo nace
  `is_published = false` y los ítems en `draft`. **Sólo requiere** `20261113120000_context_comprehension.sql`
  (el tipo `context_choice`): no depende del cierre de A1 ni de A1 U13/U14 (comprobado en PGlite sobre
  la base de producción, hasta `20261112120000`, más esa migración). Sin `drop`, `delete`, `alter` ni
  cambios de rutas, RLS o desbloqueo. SHA-256 `86dc9a9f…f673b7a3`, igual en dos corridas. **No aplicada.**

## 4. Validación del contenido (`content/a2-expansion-checks.ts`)

Lo usan la prueba de Jest y el generador (que no escribe si hay problemas):

- Estándar de lección (arriba), ids propios en todos los ejercicios.
- Palabras: ids nuevos, IPA, traducción y ejemplo; ningún texto repite otro del idioma ni coincide con
  la traducción de otra palabra (evita ambigüedad en repasos y Word Rush); todas se practican.
- **Vocabulario**: todo el inglés (respuestas, opciones, audio, estímulos, ejemplos de las palabras y
  repasos generados) usa formas enseñadas antes (todo A1, A2 hasta la unidad anterior y el inglés de sus
  lecciones), palabras ya introducidas en la unidad o nombres declarados. Acepta formas regulares de lo
  enseñado (-ing, -ed, -er, -est) y las contracciones de la lista cerrada de la corrección (_I'll_ = _I
  will_).
- **Corrección del servidor** (`gradeWithSpec`): respuesta y aceptadas correctas, distractores no,
  opciones sin repetir.
- `context_choice` sin `words` (SRS v1), con conceptos, pregunta con «?» y explicación con la evidencia.
- Escritura: el modelo cumple sus requisitos, la lección existe y el modelo y las preguntas guía usan
  vocabulario enseñado hasta esa lección.

## 5. Publicación (preparada, sin ejecutar)

### 5.1 Migración de publicación

`supabase/pending/20261121120000_publish_en_a2_u13_u17.sql`, generada con
`npm run content:a2-publish -- <archivo>` (`scripts/build-a2-publish-sql.ts`). Vive en
`supabase/pending/` (como `learning_jobs_cron.sql`) para que **nadie la aplique al aplicar las migraciones
pendientes**; el día de publicar se mueve a `supabase/migrations/`. SHA-256 `1cee529d…f242532`, igual en
dos corridas.

Sigue el mecanismo de publicación del currículo (el estado con el que U1–U12 están publicadas):

- `curriculum_units`, `words`, `lessons`, `exercises`: `is_published = true` (5 · 84 · 50 · 469).
- `concepts`: activos si su palabra está publicada (la regla y el `UPDATE` de `scripts/catalog-sql.ts`).
- `exercise_items`: 324 pasan a `active`, como todo ítem publicado. Los **38 `context_choice` siguen en
  `draft`**, como toda la comprensión (D4 de LEARNING_PHASE_C.md: activos entrarían a los repasos). Sus
  ejercicios se publican y se juegan en las lecciones (`learning_lesson_plan` mira el ejercicio, no el
  ítem).
- Antes de cambiar nada comprueba que las filas sean exactamente las de la carga (de inglés A2 U13–U17,
  ninguna de más ni de menos); si no, aborta. Sólo hace `UPDATE` de estado, sólo en esas filas.
  **Idempotente**: reaplicarla no cambia nada.

### 5.2 Orden de migraciones

Producción tiene aplicadas hasta `20261112120000_retire_legacy_review_route.sql` (verificarlo con la
lista de migraciones antes de empezar). Pendientes, en este orden:

| #   | Migración                                          | Para A2                               | Reaplicable                         |
| --- | -------------------------------------------------- | ------------------------------------- | ----------------------------------- |
| 1   | `20261113120000_context_comprehension.sql`         | **Requerida** (tipo `context_choice`) | según su documento (no probado acá) |
| 2   | `20261113120100_comprehension_en_a1.sql`           | no                                    | según su documento (no probado acá) |
| 3   | `20261113120200_comprehension_en_a1_u13_u14.sql`   | no                                    | según su documento (no probado acá) |
| 4   | `20261113120300_planned_lessons_en_a1_u13_u14.sql` | no                                    | según su documento (no probado acá) |
| 5   | `20261114120000_curriculum_routes.sql`             | no (A2 no tiene rutas)                | según su documento (no probado acá) |
| 6   | `20261115120000_client_compatibility.sql`          | no                                    | según su documento (no probado acá) |
| 7   | `20261116120000_route_vocabulary_access.sql`       | no                                    | según su documento (no probado acá) |
| 8   | `20261117120000_curriculum_isolation.sql`          | no                                    | según su documento (no probado acá) |
| 9   | `20261118120000_learning_machine_hardening.sql`    | no                                    | según su documento (no probado acá) |
| 10  | `20261119120000_a1_en_closure.sql`                 | no                                    | sí (probado)                        |
| 11  | `20261120120000_a2_en_completion.sql`              | **Carga de U13–U17** (sin publicar)   | sí (probado)                        |
| 12  | `pending/20261121120000_publish_en_a2_u13_u17.sql` | **Publicación**                       | sí (probado)                        |

Lo recomendado es aplicarlas todas en este orden (es la base con la que corren todas las pruebas). La
dependencia **mínima** comprobada de A2 es 1 → 11 → 12: la carga y la publicación funcionan sobre la
base de producción con sólo la 1. Las 2–10 no publican nada, y sin ellas A2 queda igual: A2 no tiene
rutas, así que C.4–C.7 lo dejan como antes («sin rutas: todo»).

### 5.3 Clientes: requisito antes de publicar

U13–U17 tienen 38 ejercicios `context_choice`. **Las builds que hoy están en las tiendas no conocen ese
tipo** (zod lo rechaza: no podrían abrir esas lecciones), y como A2 no tiene rutas, la protección por
nivel de cliente de la C.5 no las oculta. Publicar exige que la build mínima en uso reconozca
`context_choice` (la build local actual sí). Las builds desde la C.5 se pueden forzar a actualizar con
`app_client_policy`; las anteriores, no. Si hiciera falta publicar antes, la alternativa es una ruta
de A2 con requisito de cliente (mecanismo de la C.4/C.5): no se hizo, porque es una decisión de producto.

### 5.4 Ranked y repasos con el vocabulario nuevo

Sin cambios en los motores. Al publicar:

- **Ranked**: A2 no tiene rutas, así que `rush_common_unit_ids` incluye U13–U17 y las 84 palabras entran
  al conjunto común como el resto de A2 (desde Plata, según los niveles por rating). Las preguntas se arman
  con texto y traducción completos; cinco palabras nuevas comparten una acepción con una ya publicada
  (_go out_/_leave_ «salir», _much_/_very much_ «mucho», _order_/_ask_ «pedir», _reply_/_answer_
  «responder», _let's_/_going to_ «vamos a»), pero sus traducciones difieren por la aclaración entre
  paréntesis, y el filtro de distractores (`shared/wordRush.ts`) no repite texto ni traducción.
  **Pendiente no bloqueante**: revisar con datos si alguna de esas cinco confunde y, si hace falta, ajustar
  su traducción con una migración de texto.
- **Repasos (SRS v1 y la ruta actual)**: los 324 ítems activos entran como candidatos cuando el alumno ya
  practicó su palabra; los 38 de comprensión no entran (siguen en `draft`). Las palabras nuevas se
  acreditan por `exercise_words` como siempre. SRS v2, Mastery y Adaptive siguen apagados; no cambian.
- **Pendiente no bloqueante**: el vocabulario de U13–U17 da por sabidas _people_, _children_, _dollar_ e
  _I'd like_ (aparecen en el texto), que en A1 recién se enseñan en el cierre y en U14, sin publicar.
  Se entienden sin problema en A2 y no hay vínculos de progreso a ellas.

### 5.5 Escritura A2

Las tareas viajan con la app y se ofrecen al terminar su lección (`writingTasksForLesson`):

- 6 guiadas y 2 libres sobre lecciones ya publicadas (U1, U3, U4, U8, U9, U12; repasos finales de U6 y
  U12): aparecen con la próxima build, sin migración.
- 4 guiadas (U13–U16 L5) y la libre de U17: aparecen cuando el alumno termina esas lecciones, o sea
  recién después de publicar. Antes no se pueden alcanzar (`lesson_not_found`).

### 5.6 Pasos para publicar

1. Confirmar en producción la última migración aplicada.
2. Tener en las tiendas (y como mínima en uso) una build que reconozca `context_choice` y traiga la
   escritura A2; si la build tiene la C.5, subir `app_client_policy.min_version`.
3. Aplicar las migraciones pendientes en el orden de §5.2 (como mínimo la 1 y la 11).
4. Mover `supabase/pending/20261121120000_publish_en_a2_u13_u17.sql` a `supabase/migrations/`, correr
   `npm run test:db` (las pruebas que fijan totales y la lista de migraciones se ajustan como en esta fase)
   y aplicarla.
5. Comprobar: 17 unidades A2 publicadas; `a2-u13-l01` se desbloquea tras `a2-u12-final`; una lección de
   U13 se completa en la app.

En las bases desechables de las pruebas se comprobó todo lo anterior: la publicación sólo cambia esas
filas, U1–U12 quedan idénticas, `is_lesson_unlocked` encadena `a2-u13-l01` después de `a2-u12-final` y
las 50 lecciones se juegan completas con la corrección del servidor.

**Revisión humana recomendada (no bloquea)**: que alguien con buen inglés lea los diálogos y textos de
U13–U17 y los modelos de escritura. No hubo revisión nativa.

## 6. Archivos

Nuevos: `content/a2-expansion.ts`, `content/a2-expansion-checks.ts`, `content/writing.ts`,
`content/en/a2/context-helpers.ts`, `content/en/a2/unit13-eating-out.ts`, `unit14-free-time.ts`,
`unit15-describing.ts`, `unit16-messages.ts`, `unit17-stories.ts`, `content/en/a2/writing.ts`,
`scripts/build-a2-expansion-sql.ts`, `scripts/build-a2-publish-sql.ts`,
`supabase/migrations/20261120120000_a2_en_completion.sql`,
`supabase/pending/20261121120000_publish_en_a2_u13_u17.sql`, `supabase/tests/a2Publish.test.mjs`,
`content/__tests__/a2-expansion.test.ts`, `supabase/tests/a2Completion.test.mjs`, este documento.

Modificados: `content/comprehension.ts` (registro de ids), `content/ids.lock.json` (368 ids, 6 retirados),
`package.json` (`content:a2`, `content:a2-publish`), `content/__tests__/identity.test.ts` (retirados),
`src/features/learning/components/WritingPracticeCard.tsx` y
`src/app/writing/[id].tsx` (leen `content/writing.ts`), `content/__tests__/planned.test.ts` y
`comprehension.test.ts` (composición del registro), `docs/LEARNING_CURRICULUM.md`.
