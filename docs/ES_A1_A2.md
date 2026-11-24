# Español A1 y A2

> **Actualización 2026-11-21: el curso pasó a español neutro de Latinoamérica (tú y ustedes).**
> Decisión del dueño; guía en [ES_NEUTRAL_GUIDE.md](ES_NEUTRAL_GUIDE.md). Todo lo que este documento
> dice del voseo rioplatense, es-AR y el léxico argentino quedó **reemplazado**: voz `es-MX`, tú
> (tienes, eres, dobla, llámame), ustedes, vosotros solo explicado, una mención del voseo en A1 U2,
> léxico panhispánico (autobús, metro, carro, apartamento, mesero, maleta, dinero, talla…), lugares de
> varios países. El validador (`content/es-checks.ts`: `VOSEO`, `REGIONAL`, `isVoseo`) rechaza voseo,
> vosotros y léxico rioplatense en lo que se muestra o se escucha; se aceptan en las respuestas.
> Resultado: 29 unidades, 290 lecciones, **533 palabras**, 2891 ejercicios, 2338 ítems; 35 ids de
> palabra renombrados; registro de ids: 145 escritos reemplazados y 93 generados retirados (nunca
> estuvieron en producción). Carga `supabase/migrations/20261204120000_es_a1_a2.sql` (SHA-256
> `e271fc40…73c695d1`) y publicación `supabase/pending/20261205120000_publish_es_a1_a2.sql`
> (`759867e4…d21cec4`, 2129 ítems activos + 209 en draft), **regeneradas en el cliente y no aplicadas**.
> Validación: es-check 0 problemas (unidades y escritura), `es.test.ts` 31/31, `esContent.test.mjs`
> (PGlite) 8/8. Sin revisión nativa. Las dudas pedagógicas siguen en el `review.notes` de cada unidad.

Estado (2026-11-14): **implementado y validado en local**. Nada se aplicó en producción, no hubo
despliegues, builds ni commits. Todo el contenido está en borrador (`draft`) y sin publicar. El idioma
sigue «Próximamente» en la app.

Enfoque: el de los demás cursos ([FR_A1_A2.md](FR_A1_A2.md), [IT_A1_A2.md](IT_A1_A2.md)). PolyGo enseña,
no certifica: el MCER es una guía de nivel. No hay exámenes, umbrales ni desbloqueos condicionados.

- **Para quién**: personas que no hablan español.
- **Idioma de apoyo: inglés.** Traducciones, consignas, explicaciones, títulos, objetivos, preguntas de
  comprensión y tareas de escritura están en inglés. El español es el idioma que se aprende.
- **Variante: español rioplatense (Argentina), con voseo**, comprensible para cualquier hispanohablante.
  Cuando ayuda se explican las otras variantes: tú en España y gran parte de América Latina, coche, metro,
  chaqueta…

## 1. Inventario previo

| Qué                     | Estado antes de esta fase                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Contenido               | **Ninguno.** No había piloto, unidades, palabras, ejercicios ni ítems de español                                   |
| Configuración           | `shared/languages.ts`: `es` en «Próximamente» (`soon`), `es-MX`, «Español neutro con tú», sin niveles              |
| Decisión documentada    | `docs/CONTENT_STANDARD.md`: «necesita la interfaz traducida al inglés» (la app supone que el alumno habla español) |
| Base                    | `public.languages('es')` existe en `soon`; no hay contenido                                                        |
| Generadores, validación | Nada propio                                                                                                        |

Como no hay piloto, **no se conservó ni se modificó contenido previo de español**. Todo el curso es
nuevo: A1 U1–U17 y A2 U1–U12.

**Decisión del idioma de apoyo**: se consultó y se eligió «inglés, sólo contenido». El contenido se
escribe desde el inglés y la traducción de la interfaz de la app queda para la etapa de mejora
integral. Hasta entonces el idioma no se puede elegir.

## 2. Qué se agregó

### Configuración e infraestructura (sin cambios para los demás idiomas)

- **`shared/languages.ts`**:
  - el campo opcional nuevo `support?: { code: 'en'; targetName: string }`, que es el idioma de apoyo
    del contenido;
  - el español queda con `support: { code: 'en', targetName: 'Spanish' }`, `speechLocale: 'es-AR'` y la
    variante «Español rioplatense (Argentina), con voseo»;
  - el `status` sigue en `soon` y `ranked` en `false`.
- **`content/builders.ts`**: las consignas salen de una tabla por idioma de apoyo. Sin `support`, las
  cadenas son las mismas de siempre. Con `support: en`, salen en inglés: «Translate into Spanish»,
  «What does “hola” mean?», «Answer in Spanish».
- **`content/path.ts`**: los títulos y objetivos de los repasos generados también siguen el idioma de
  apoyo («Review 1», «Listening practice», «Words of the unit», «Final review»).
- **Comprobado**: el SQL del francés y del italiano regenerado sale idéntico byte a byte, y las pruebas
  del portugués, el italiano, el chino y el francés pasan sin cambios.
- **`shared/writing.ts`**: en el requisito «cada oración empieza con mayúscula», una oración que abre con
  ¿ o ¡ cuenta por la letra que sigue (antes «¿Cómo estás?» se marcaba como error). Los demás idiomas
  no usan esos signos, así que para ellos no cambia nada.

### Unidades

Las unidades viven en su propio camino (`content/es-course.ts`, `ES_PATH`), fuera de `COURSES` y de
`CURRICULUM_PATH`, como el francés.

- Cada unidad tiene objetivo comunicativo, gramática con 3 ejemplos y 5 lecciones escritas.
- Cada lección tiene objetivo, introducción con ejemplos, 2 ideas para llevarse y entre 8 y 10
  ejercicios, y cierra con dos ejercicios de producción.
- A eso se suman 5 repasos generados por unidad: 10 lecciones por unidad y **290 lecciones** en total
  (145 escritas y 145 generadas).

| Nivel | #   | Unidad                          | Gramática principal                                                                            | Palabras |
| ----- | --- | ------------------------------- | ---------------------------------------------------------------------------------------------- | -------- |
| A1    | 1   | Greetings and introductions     | vos y usted (¿cómo estás? / ¿cómo está?), me llamo / ¿cómo te llamás?                          | 20       |
| A1    | 2   | Where are you from?             | Pronombres; ser en singular (yo soy, vos sos, usted es); nacionalidades; no                    | 19       |
| A1    | 3   | Numbers and age                 | Tener (tengo, tenés, tiene); la edad con tener; uno → un año                                   | 18       |
| A1    | 4   | Family                          | el / la / los / las, masculino plural inclusivo; mi, tu, su; se llama                          | 20       |
| A1    | 5   | Things and colors               | Género y número; un / una; adjetivo después del sustantivo; este / esta                        | 19       |
| A1    | 6   | At home                         | Hay / no hay; estar para la ubicación; preposiciones de lugar; del                             | 19       |
| A1    | 7   | Food and drinks                 | Quiero / quisiera / ¿me das…?; comer y tomar (= beber); mucho, un poco de; el agua             | 19       |
| A1    | 8   | My day                          | Presente regular -ar / -er / -ir con todas las personas (ustedes, sin vosotros); reflexivos    | 19       |
| A1    | 9   | Time and days                   | Es la una / son las dos; y media, menos cuarto; el lunes / los lunes                           | 19       |
| A1    | 10  | Around town                     | Ir (voy, vas…); al; imperativo introductorio con vos (doblá, seguí) y usted (doble, siga)      | 20       |
| A1    | 11  | Likes and free time             | Gustar (me gusta / me gustan), encantar, preferir (e → ie), jugar (u → ue) frente a tocar      | 19       |
| A1    | 12  | Questions and shopping          | Interrogativos con tilde, ¿…?; por qué / porque; ¿cuánto cuesta?; números hasta 100            | 19       |
| A1    | 13  | Work and studies                | Ser + profesión sin artículo; somos, son; tenemos, tienen; empiezo (vos empezás)               | 20       |
| A1    | 14  | Describing people               | Ser frente a estar; concordancia del adjetivo; tener el pelo / los ojos; muy                   | 20       |
| A1    | 15  | Months and dates                | La fecha (el 9 de julio, el primero de mayo); en + mes; nací                                   | 18       |
| A1    | 16  | Weather and seasons             | Hace calor / frío; llueve, nieva; las estaciones del hemisferio sur; más… que, tan… como       | 18       |
| A1    | 17  | Transport and plans             | en colectivo / a pie; tomar; ir a + infinitivo; quedarse                                       | 18       |
| A2    | 1   | What did you do on the weekend? | Pretérito indefinido regular e irregulares hacer, ir / ser, ver; ya / todavía no               | 18       |
| A2    | 2   | Travel                          | Indefinido irregular (estuve, tuve, vine, llegué); hace + tiempo; tarde / a tiempo             | 17       |
| A2    | 3   | Restaurant and hotel            | Condicional de cortesía: me gustaría, ¿podría…?, ¿me trae…?; usted con el personal             | 18       |
| A2    | 4   | When I was a kid                | Pretérito imperfecto (era, tenía, vivía, jugaba, había); costumbres                            | 17       |
| A2    | 5   | What happened?                  | Imperfecto (escena) frente a indefinido (hechos); estar + gerundio; conectores; acabar de      | 17       |
| A2    | 6   | Invitations and plans           | ¿Querés venir…?, dale; futuro simple introductorio (iré, haré, habrá) frente a ir a            | 18       |
| A2    | 7   | Work and studies                | Obligación y posibilidad: tener que, hay que, poder; desde / desde hace / durante              | 17       |
| A2    | 8   | Health                          | Me duele(n); imperativo afirmativo y negativo (descansá, no tomes; descanse); ¡que te mejores! | 17       |
| A2    | 9   | Shopping and services           | Comparativos y superlativos, mejor / peor, -ísimo; me lo / me la llevo                         | 17       |
| A2    | 10  | Technology                      | Objeto directo e indirecto (lo, la, le, les), se lo; andar = funcionar                         | 17       |
| A2    | 11  | Relationships and experiences   | Reflexivos y recíprocos en pasado; doble negación; pretérito perfecto (he estado, ha sido)     | 17       |
| A2    | 12  | Opinions and solutions          | Creo que / me parece que; deberías, podríamos; si + presente; por y para; dice que; ojalá      | 18       |

### Voseo y variante

- **Voseo en todo lo que se muestra y se escucha**: vos sos, tenés, querés, podés, hablás, comés,
  vivís, vas, estás.
  - Imperativo afirmativo con acento final: doblá, seguí, tomá, descansá.
  - Imperativo negativo con el subjuntivo sin acento: no tomes. «No tomés» se explica como coloquial.
  - Plural: ustedes, nunca vosotros. Formal: usted.
- **El tuteo se explica, no se practica.**
  - Las explicaciones en inglés lo presentan como la forma de España y de gran parte de América Latina.
  - Una unidad puede declarar formas de tuteo en `contrast` para mostrarlas en un ejemplo de la
    gramática; A1 U2 lo hace con «tú eres».
  - Las respuestas aceptadas sí admiten el tuteo, porque un estudiante internacional puede escribirlo.
- **El validador lo garantiza**: rechaza el tuteo (tú, eres, tienes, hablas…) y el vosotros (sois,
  habláis…) en respuestas, opciones, audios, textos, ejemplos y repasos generados.
- **El test lo comprueba**: las siete formas del brief (sos, tenés, querés, podés, hablás, comés, vivís)
  aparecen en el curso y ninguna forma de tuteo aparece.
- **Pasados**: el indefinido es el pasado de todos los días, como en la Argentina (hoy comí, ya
  terminé). El pretérito perfecto se enseña en A2 U11, aclarando que acá se usa poco.
- **Futuro**: para los planes, ir a + infinitivo. El futuro simple es introductorio.
- **Vocabulario argentino cotidiano**, con la variante general cuando ayuda: colectivo, subte, auto,
  celular, computadora, departamento, living, lapicera, campera, zapatillas, valija, billetera, mozo,
  medialuna, plata, talle, pasantía, resfrío, remedio, dale, che. Lo coloquial se marca como informal.
  No hay lunfardo presentado como estándar.

### Pronunciación

No hay transcripciones fonéticas ni IPA. Cada unidad explica la pronunciación con reglas y comparaciones
con el inglés:

- las cinco vocales y la h muda;
- r frente a rr;
- b = v;
- j y la g fuerte, gue / gui;
- la ñ;
- ll / y con yeísmo rehilado («like the sh in shoe»);
- el seseo;
- la tilde y la sílaba tónica, incluido el acento final del voseo;
- la entonación de preguntas y exclamaciones.

Se practica con `listen_choice` de pares que sí se distinguen: pero / perro, dos / doce, tengo / tenés,
me gusta / me gustan, lo / la / los llamo.

**Regla nueva del validador (`soundKey`)**: las opciones de escucha no pueden sonar igual en el español
rioplatense. Por seseo, yeísmo, b = v y h muda, pares como casa / caza, vaca / baca, calló / cayó u
hola / ola no se distinguen de oído.

### Vocabulario

- **532 palabras** (A1 324, A2 208), cada una con:
  - traducción al inglés;
  - ejemplo en español y su traducción;
  - unidad, etiquetas y emoji;
  - id `es-…`.
- Los sustantivos llevan el artículo (el libro, la llave, el agua). Los adjetivos, sus formas femeninas
  y plurales en `acceptedTexts`.
- En las traducciones se cuidan los falsos amigos para quien viene del inglés: largo, simpático, once,
  librería, recordar, aprobar, la receta, la facultad.
- **Vocabulario de apoyo: 337 formas** (A1 120, A2 217), declarado por unidad: conjugaciones de verbos
  ya vistos y palabras de contexto que no entran a los repasos.
- **Audio**: lo genera la síntesis de voz del dispositivo (`expo-speech`, `es-AR`). **No hay
  grabaciones y ningún audio fue escuchado ni verificado por una persona.** Si el dispositivo no tiene
  una voz es-AR, se usa otra voz de español: puede no tener seseo rehilado y leer la ll / y de otra manera.

### Ejercicios

| Escritos (1441)      |     | Todos, con los repasos generados (2891) |     |
| -------------------- | --- | --------------------------------------- | --- |
| `fill_blank`         | 308 | `listen_choice`                         | 586 |
| `translation_choice` | 225 | `fill_blank`                            | 478 |
| `context_choice`     | 209 | `translate_write`                       | 448 |
| `listen_choice`      | 208 | `translation_choice`                    | 433 |
| `translate_write`    | 173 | `match_pairs`                           | 260 |
| `short_answer`       | 117 | `context_choice`                        | 209 |
| `match_pairs`        | 115 | `short_answer`                          | 173 |
| `order_words`        | 82  | `complete_word`                         | 169 |
| `image_choice`       | 4   | `order_words`                           | 131 |
|                      |     | `image_choice`                          | 4   |

**Sin tipos nuevos.** Lo que pide el brief se cubre con los tipos existentes:

- selección de conjugaciones, de género y de número, y diálogos para completar: `fill_blank` con
  distractores del objetivo (vos frente a usted, ser frente a estar, gusta / gustan, lo / la);
- reconocimiento de pronunciación: `listen_choice`;
- producción: `translate_write` y `short_answer`.

### Textos y audios

**68 estímulos** con 209 preguntas `context_choice`, y al menos un audio y un texto por unidad:

- **A1**: 38 estímulos (21 audios y 17 textos), de unas 29 palabras de media, con 114 preguntas.
  Velocidad 0.85.
  - Audios: diálogos en el kiosco, la fiesta, la clase, la estación, el café y la tienda.
  - Textos: mensajes, publicaciones, una ficha, avisos, un menú, un horario y una postal.
- **A2**: 30 estímulos (16 audios y 14 textos), de unas 49 palabras de media, con 95 preguntas.
  Velocidad 0.9.
  - Audios: una entrevista de trabajo, el consultorio, la reserva de hotel, una parrilla, un robo en el
    colectivo, una invitación y un préstamo entre amigos.
  - Textos: mensajes, publicaciones, una postal, un menú, avisos y un anuncio de liquidación.

Las preguntas están en inglés, con la respuesta y 3 distractores plausibles, los conceptos evaluados y
una explicación que cita la frase en español. Los personajes son ficticios, con nombre de pila, y no hay
datos de contacto.

### Escritura (`content/es/writing.ts`)

24 tareas con el sistema existente (`shared/writing.ts`: sin IA, se corrige en el dispositivo y el texto
no se guarda). Consignas, requisitos y listas de control van en inglés; los modelos, en voseo.

- **A1, 9 guiadas**: presentarse (U2), la familia (U4), la casa (U6), el día (U8), el tiempo libre (U11),
  en una tienda (U12), el trabajo (U13), describir a alguien (U14) y los planes (U17).
- **A1, 1 libre**: «about me», al terminar el A1 (U17, repaso final).
- **A2, 12 guiadas**:
  - el fin de semana (U1), un viaje (U2), reservar un hotel (U3);
  - la infancia (U4), qué pasó (U5), una invitación (U6);
  - pedir una pasantía (U7), avisar que estás enfermo (U8), comparar antes de comprar (U9);
  - un problema con la tecnología (U10), una pareja (U11) y tu opinión (U12).
- **A2, 2 libres**: un fin de semana especial (U6) y un día que no olvidás (U12).

## 3. Cómo se integra

- **Camino**: `content/es-course.ts` arma `ES_COURSE` (A1 U1–U17 y A2 U1–U12) y `ES_PATH` con
  `unitWordsOnly: true`.
- **Registro**: `ES_PATH` entra en `ITEM_REGISTRY_PATH` y en el catálogo (`content/comprehension.ts`), y
  las tareas de escritura en `content/writing.ts`.
- **Ids**: 2341 ítems registrados con `npm run content:ids` (el registro pasó a 15106 ids): 1441
  ejercicios escritos sorteados y el resto generados. Ningún ítem ya cargado cambió de identidad.
- **Vínculos**: sólo palabras del español.
- **Migración de carga** `supabase/migrations/20261204120000_es_a1_a2.sql`
  (`npm run content:es -- <archivo>`), con la plantilla _add-only_ sin modificarla:
  - 29 unidades, 290 lecciones, 532 palabras, 2891 ejercicios y 2341 ítems;
  - todo nace `is_published = false` y los ítems en `draft`;
  - sin cambios de esquema y sin tocar `public.languages`;
  - en la columna `translation_es` va la traducción al inglés (el idioma de apoyo), igual que
    `example_es`;
  - SHA-256 `cec4ddef…080dccb8`;
  - **no aplicada**.
- **Sin cambios**: Learning Machine, Ranked, SRS, Mastery y Adaptive, y el contenido de inglés,
  portugués, italiano, chino y francés.

## 4. Validación (`content/es-checks.ts`)

La usan la prueba de Jest, el generador (que no escribe si hay problemas) y `scripts/es-check.ts`
(`npx tsx scripts/es-check.ts ["es A1 U5" | writing]`). Toma las reglas del francés y agrega:

- **Morfología española** para el vocabulario enseñado: casas, colores, ciudades, luces, lecciones,
  ingleses, jóvenes; argentina, profesora, francesa. Las formas verbales nuevas se enseñan o se declaran.
- **Variante**: nada de tuteo ni de vosotros en lo que se muestra o se escucha. Lo detecta con:
  - una lista fija;
  - las terminaciones de vosotros (-áis, -éis);
  - el tuteo regular derivado de cada forma de voseo conocida (hablás → hablas), salvo que esa forma sea
    otra palabra enseñada (estás → estas, el demostrativo).
- **Ortografía**: ¿…? y ¡…! balanceados en todo el español, también en las respuestas aceptadas y en
  los ejemplos.
- **Escucha**: opciones que suenan igual en el Río de la Plata (`soundKey`).
- **`order_words`**: sin ¿ ni ¡, porque la primera ficha delataría el orden.
- **Lo mismo que el francés**:
  - estándar de lección;
  - traducciones gemelas;
  - cognados en los repasos;
  - corrección del servidor (`gradeWithSpec`), también sin tildes (esta / está, si / sí nunca van juntas
    como opciones);
  - `context_choice` sin `words`, con velocidad 0.85 / 0.9;
  - datos de contacto;
  - escritura.

## 5. Pruebas

| Prueba                                              | Qué comprueba                                                                           |
| --------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `content/__tests__/es.test.ts` (31)                 | Reglas, configuración (es-AR, apoyo en inglés, `soon`), consignas en inglés y las del   |
|                                                     | francés intactas, camino, tipos, voseo, gramática por unidad, textos y velocidad,       |
|                                                     | registro, corrección, carga y publicación exactas, lematización, `soundKey`,            |
|                                                     | mutaciones del validador, escritura (incluida la mayúscula después de ¿ / ¡)            |
| `content/__tests__/*` (13 suites, 5916 pruebas)     | Los demás idiomas, identidad de ítems, registro, catálogo, versiones, opciones          |
| `supabase/tests/esContent.test.mjs` (en PGlite)     | Carga exacta, add-only, reaplicable, invisible sin publicar. Publicación: idempotente,  |
|                                                     | sólo filas propias, desbloqueo de la primera lección de cada nivel, juega las lecciones |
| `items`, `learning`, `versions`, `presentations`, … | Incluyen `ES_PATH` y la migración nueva                                                 |

## 6. Publicación (preparada, sin ejecutar)

`supabase/pending/20261205120000_publish_es_a1_a2.sql` (`npm run content:es-publish -- <archivo>`):

- usa el mismo mecanismo que los demás idiomas;
- comprueba que las filas sean exactamente las de la carga;
- las publica, activa los conceptos y 2132 ítems, y deja los 209 `context_choice` en `draft` (D4);
- sólo hace `UPDATE` de estado, es idempotente y no toca `public.languages`;
- SHA-256 `1e32202c…8462f81`;
- vive en `pending/`.

**Requisito previo para que el idioma sea usable: la interfaz de la app en inglés.** Hoy todos los
textos de la app están en español: botones, pantallas, onboarding, mensajes de corrección y la etiqueta
del campo de escritura. Un alumno que no habla español no podría usarla, aunque el contenido esté en
inglés. Es trabajo de la etapa de mejora integral.

Orden para publicar (al final de todo):

1. Traducir la interfaz al inglés para los alumnos de español: selección del idioma de la interfaz
   según el idioma que se aprende, y textos de las pantallas y de la corrección.
2. Tener en las tiendas una build con eso, con `context_choice` y con la escritura de español.
3. Aplicar `20261204120000_es_a1_a2.sql`, mover `pending/20261205120000_publish_es_a1_a2.sql` a
   `migrations/`, correr `npm run test:db` y aplicarla.
4. Activar el idioma (decisión de producto):
   - en `public.languages`, `content_status` de `es`;
   - en `shared/languages.ts`, `status` y `levels` (p. ej. `['A1']`);
   - decidir si entra a Ranked.
5. Comprobar:
   - 29 unidades publicadas;
   - `es-a1-u01-l01` y `es-a2-u01-l01` abiertas;
   - una lección se completa con la voz es-AR del dispositivo.

Efectos al publicar: los 2132 ítems activos entran a los repasos (SRS v1) cuando el alumno practicó su
palabra; los de comprensión no. SRS v2, Mastery y Adaptive siguen apagados.

## 7. Revisión humana recomendada (no bloquea)

No hubo revisión nativa ni pedagógica humana. Las dudas están en el `review.notes` de cada unidad. Las
principales:

- **Audio**: escuchar la voz es-AR de iOS y Android. En particular:
  - el yeísmo rehilado (muchas voces sintéticas no lo hacen);
  - el seseo;
  - los pares r / rr;
  - cómo lee precios en cifras (70.000 pesos) y fechas.
- **Registro**:
  - usted con el mozo, el personal del hotel y en la entrevista (entre jóvenes en Buenos Aires es común
    el vos);
  - dale y che como informales;
  - un beso / un abrazo al cerrar mensajes.
- **Gramática**:
  - «no tomes» como imperativo negativo estándar con vos;
  - el lugar del pretérito perfecto en la Argentina;
  - la concordancia de tiempos en «me dijo que no tiene trabajo»;
  - ojalá frente a ojalá que;
  - «me olvidé la contraseña» (coloquial).
- **Léxico**:
  - jugoso = rare / medium-rare;
  - la facultad = college;
  - morocho;
  - el talle y «uso talle cuarenta»;
  - pasantía;
  - «el primero» frente a «el uno» de mayo;
  - «a la mañana» frente a «por la mañana».
- **Precios**: los precios reales en pesos quedan desactualizados por la inflación. Los textos usan
  cifras orientativas («cien pesos» en A1 no es realista).
- **Distractores**: algunos usan formas inexistentes a propósito para evaluar la regla (como
  «celulars» en el plural). Decidir si se quieren.
- **Tareas de escritura**: leer los 24 modelos y las consignas en inglés.

## 8. Archivos

Nuevos:

- `content/es-course.ts`, `content/es-checks.ts`, `content/es/helpers.ts`, `content/es/writing.ts`
- `content/es/a1/index.ts`, `content/es/a1/unit01…17-*.ts`, `content/es/a2/index.ts`,
  `content/es/a2/unit01…12-*.ts`
- `content/__tests__/es.test.ts`, `supabase/tests/esContent.test.mjs`
- `scripts/build-es-sql.ts`, `scripts/build-es-publish-sql.ts`, `scripts/es-check.ts`
- `supabase/migrations/20261204120000_es_a1_a2.sql`, `supabase/pending/20261205120000_publish_es_a1_a2.sql`
- este documento

Modificados:

- `shared/languages.ts`: campo `support`; en `es`, `es-AR`, la variante y el apoyo en inglés
- `content/builders.ts` y `content/path.ts`: consignas y títulos según el idioma de apoyo (los demás
  idiomas no cambian)
- `shared/writing.ts`: la mayúscula después de ¿ / ¡
- `content/comprehension.ts` y `content/writing.ts`: registro
- `content/ids.lock.json`: 2341 ids nuevos
- `package.json`: `content:es` y `content:es-publish`
- `content/__tests__/comprehension.test.ts` y `planned.test.ts`
- `supabase/tests/items`, `learning`, `versions`, `presentations`, `planned`, `legacyReviewRetirement` y
  `a2Publish.test.mjs`
- `docs/CONTENT_STANDARD.md` y `docs/LEARNING_CURRICULUM.md`
