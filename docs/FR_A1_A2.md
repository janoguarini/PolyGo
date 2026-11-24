# Francés A1 y A2

Estado (2026-11-14): **implementado y validado en local**. Nada se aplicó en producción, no hubo
despliegues, builds ni commits. Todo el contenido está en borrador (`draft`) y sin publicar. El idioma
está configurado pero **oculto** en la app.

> **Integración (2026-11-21):** B1–B11 corregidos (validación independiente PASS), carga regenerada
> (`6853b985…`) y francés en `available` para todos, sin `content_testers`. Migraciones, plan de
> producción y rollback en [FR_A1_A2_INTEGRATION.md](FR_A1_A2_INTEGRATION.md). Nada aplicado en producción.

> **Ampliación (2026-11-21): A2 U13.** Se agregó una unidad nueva sobre los pronombres tónicos y el
> imperativo con _tu_ y _nous_ ([§2.1](#21-ampliación-a2-u13-2026-11-21)). Las cifras y los hashes de
> las secciones 2 a 6 son los de la versión del 2026-11-14 (29 unidades). Los totales vigentes, de 30
> unidades, están en §2.1. Auditoría en [FR_A1_A2_AUDIT.md](FR_A1_A2_AUDIT.md).

Enfoque: el del inglés, el portugués y el italiano ([IT_A1_A2.md](IT_A1_A2.md)). PolyGo enseña, no
certifica: el MCER es una guía de nivel. No hay exámenes, umbrales ni desbloqueos condicionados.
Variante: **francés estándar de Francia (FR-FR)**, registro neutro. Lo coloquial (_on_ por _nous_,
_sympa_, _bises / bisous_, la caída del _ne_ en lo oral) se marca como tal en las explicaciones. Las
consignas y traducciones usan español rioplatense con voseo, como los demás cursos.

## 1. Inventario previo

| Qué                     | Estado antes de esta fase                                                           |
| ----------------------- | ----------------------------------------------------------------------------------- |
| Contenido               | **Ninguno.** No había piloto, unidades, palabras, ejercicios ni ítems de francés    |
| Configuración           | `shared/languages.ts` no tenía `fr`. En la base no había fila en `public.languages` |
| Comprensión / escritura | Nada                                                                                |
| Validación              | Nada propio                                                                         |

Como no hay piloto, **no se conservó ni se modificó contenido previo de francés**: todo el curso es
nuevo, A1 U1–U17 y A2 U1–U12.

## 2. Qué se agregó

### Configuración: idioma oculto

- `shared/languages.ts`: nueva entrada `fr` (`speechLocale: 'fr-FR'`, `script: 'latin'`,
  `ranked: false`, `levels: []`) con el estado nuevo **`hidden`**. También se agregó
  `VISIBLE_LANGUAGES` (todos menos los `hidden`).
- El onboarding (`src/app/onboarding.tsx`) y el selector de idiomas del perfil
  (`src/features/profile/components/LanguagesRow.tsx`) usan `VISIBLE_LANGUAGES`, así que el francés no
  aparece para elegir. Los demás idiomas se ven igual que antes.
- No hay migración que cree `public.languages('fr')`: la carga no la necesita y activar el idioma es una
  decisión de producto aparte (§6).

### Unidades

Las unidades viven en su propio camino (`content/fr-course.ts`, `FR_PATH`), fuera de `COURSES` y de
`CURRICULUM_PATH`, como el italiano, el portugués, el inglés A2 U13–U17, B1 y B2. Cada unidad tiene
objetivo comunicativo, gramática con 3 ejemplos y 5 lecciones escritas. Cada lección tiene objetivo,
introducción con ejemplos, 2 ideas para llevarse y entre 8 y 10 ejercicios, y cierra con dos de
producción. A eso se suman 5 repasos generados por unidad (rev1, rev2, listen, words y final): 10
lecciones por unidad y **290 lecciones** en total (145 escritas y 145 generadas).

| Nivel | #   | Unidad                            | Gramática principal                                                                        | Palabras |
| ----- | --- | --------------------------------- | ------------------------------------------------------------------------------------------ | -------- |
| A1    | 1   | Saludos y presentaciones          | _tu / vous_, _je m'appelle_, elisión                                                       | 20       |
| A1    | 2   | Soy argentino                     | _être_, nacionalidades y femenino, _ne… pas_, _j'habite à_                                 | 19       |
| A1    | 3   | Números y edad                    | _avoir_ y la edad (_j'ai vingt ans_), 1–12 y 20                                            | 18       |
| A1    | 4   | La familia                        | Posesivos _mon / ma / mes, ton / ta, son / sa_                                             | 20       |
| A1    | 5   | Objetos y colores                 | Artículos, _c'est / ce sont_, el color después del sustantivo                              | 19       |
| A1    | 6   | La casa                           | _il y a / il n'y a pas de_, _où est…?_, preposiciones de lugar                             | 18       |
| A1    | 7   | Comer y beber                     | Partitivos _du / de la / de l'_, _pas de_, _beaucoup de_, _je voudrais_                    | 18       |
| A1    | 8   | Mi día                            | Verbos en _-er_ en presente, _nous / ils / on_, _je me lève_                               | 19       |
| A1    | 9   | La hora y los días                | _Il est… heures_, _et demie, et quart, moins le quart_, _lundi / le lundi_                 | 20       |
| A1    | 10  | La ciudad y las direcciones       | _aller_ + _à_, contracciones _au / à la / aux_, _tournez_                                  | 20       |
| A1    | 11  | Gustos y tiempo libre             | _aimer_ + artículo, _faire du_, _jouer au / jouer de la_                                   | 19       |
| A1    | 12  | Preguntas, compras y precios      | Tres formas de preguntar, _est-ce que_, _quel / quelle_, hasta 100                         | 19       |
| A1    | 13  | Trabajo y estudios                | _je suis médecin_ (sin artículo), _nous sommes, ils ont_, _je finis_                       | 20       |
| A1    | 14  | Describir personas                | Concordancia y lugar del adjetivo, _beau / belle, vieux / vieille_                         | 19       |
| A1    | 15  | Meses, fechas y cumpleaños        | La fecha (_le premier mai, le 14 juillet_)                                                 | 18       |
| A1    | 16  | El clima y las estaciones         | _il fait_ + adjetivo, _il pleut, il neige_, _en / au_ + estación                           | 17       |
| A1    | 17  | Transporte y planes               | _prendre_, _en train / à pied_, futuro próximo _aller_ + infinitivo                        | 19       |
| A2    | 1   | ¿Qué hiciste el fin de semana?    | _passé composé_ con _avoir_, _déjà / pas encore_                                           | 17       |
| A2    | 2   | Viajes                            | _passé composé_ con _être_ y concordancia, _il y a deux ans_                               | 17       |
| A2    | 3   | Restaurante y hotel               | Condicional de cortesía (_j'aimerais, pourriez-vous…?_)                                    | 17       |
| A2    | 4   | Cuando era chico                  | _imparfait_ (_j'étais, il y avait, je jouais_), _d'habitude_                               | 17       |
| A2    | 5   | ¿Qué pasó?                        | _imparfait_ frente a _passé composé_, _être en train de_, _soudain_                        | 17       |
| A2    | 6   | Invitaciones y planes             | _ça te dit de…?_, futur simple (_j'irai, je ferai, il y aura_)                             | 18       |
| A2    | 7   | Trabajo y estudios                | _devoir, pouvoir, vouloir_ + infinitivo, _il faut_, _depuis / pendant_                     | 17       |
| A2    | 8   | Salud y bienestar                 | _avoir mal à_, imperativo con _vous_ (_reposez-vous_)                                      | 17       |
| A2    | 9   | Compras y servicios               | Comparativos, _meilleur_, el pronombre _en_                                                | 18       |
| A2    | 10  | Tecnología y comunicación         | Pronombres _le / la / l' / les_ y _lui / leur_                                             | 17       |
| A2    | 11  | Relaciones y vida cotidiana       | Pronominales en pasado con _être_, _y_, _qui / que_, _ne… jamais / plus / rien / personne_ | 17       |
| A2    | 12  | Opiniones, problemas y soluciones | Condicional para aconsejar, _si_ + presente, _il dit que_                                  | 17       |
| A2    | 13  | Moi, toi y el imperativo          | Pronombres tónicos, _moi aussi / non plus_, imperativo de _tu / nous_ y con pronombre      | 20       |

**Pronunciación**: sin transcripciones fonéticas inventadas y sin IPA. Cada unidad la explica con reglas
(consonantes finales mudas, _e_ caduca, vocales nasales, _liaison_ y elisión, la _s_ de _bus_, el
femenino que hace sonar la consonante final: _petit / petite_) y la practica con `listen_choice` de pares
mínimos (_le / les, deux / douze, ils ont / ils sont, vous / vu, je parle / j'ai parlé, vin / vent…_).

### Vocabulario

- **528 palabras** (A1 322, A2 206), con traducción al español rioplatense, ejemplo en francés y en
  español, unidad, emoji y etiquetas. Los ids son `fr-…`, nuevos. Los sustantivos llevan su artículo
  (_le livre, la clé, l'eau_), y cuando el artículo no muestra el género (_l'_) lo aclara la traducción o
  el ejemplo. Sin IPA.
- **Vocabulario de apoyo: 229 formas** (A1 63, A2 166), declarado por unidad en `support`. Son las formas
  que usan los textos, audios y frases sin ser palabras practicadas (conjugaciones de verbos ya vistos,
  _bouteille, carafe, soupe, mousse_…). No entran a los repasos.
- **Audio**: lo genera la síntesis de voz del dispositivo (`expo-speech`, `fr-FR`). **No hay grabaciones**
  y ningún audio fue escuchado ni verificado por una persona.

### Ejercicios

| Escritos (1448)      |     | Todos, con los repasos generados (2898) |     |
| -------------------- | --- | --------------------------------------- | --- |
| `fill_blank`         | 326 | `listen_choice`                         | 543 |
| `translation_choice` | 245 | `fill_blank`                            | 496 |
| `context_choice`     | 188 | `translation_choice`                    | 451 |
| `listen_choice`      | 165 | `translate_write`                       | 420 |
| `translate_write`    | 164 | `match_pairs`                           | 263 |
| `short_answer`       | 126 | `short_answer`                          | 193 |
| `match_pairs`        | 118 | `context_choice`                        | 188 |
| `order_words`        | 98  | `complete_word`                         | 175 |
| `image_choice`       | 18  | `order_words`                           | 151 |
|                      |     | `image_choice`                          | 18  |

**Sin tipos nuevos.** Los diálogos y textos con preguntas son `context_choice` (audio o lectura). La
producción escrita libre usa el sistema de escritura (más abajo).

### Textos y audios

**69 estímulos** con 188 preguntas `context_choice`, y al menos un audio y un texto por unidad:

- **A1**: 38 estímulos (21 audios y 17 textos), de unas 31 palabras de media, con 101 preguntas.
  Velocidad 0.85. Hay diálogos en la panadería, el café, la estación y la tienda, y textos que son
  mensajes, publicaciones, descripciones, avisos, un menú, un horario y una postal.
- **A2**: 31 estímulos (17 audios y 14 textos), de unas 48 palabras de media, con 87 preguntas.
  Velocidad 0.9. Hay conversaciones en el hotel, el consultorio, la entrevista de trabajo y la tienda, y
  textos que son publicaciones, mensajes, correos, avisos, una postal y una carta de restaurante.

Las preguntas están en español, con la respuesta y 3 distractores plausibles, los conceptos evaluados y
una explicación que cita el texto. Los personajes son ficticios, con nombre de pila, y no hay datos de
contacto.

### Escritura (`content/fr/writing.ts`)

24 tareas con el sistema existente (`shared/writing.ts`: sin IA, se corrige en el dispositivo y el texto
no se guarda):

- **A1, 9 guiadas**: presentarse (U2), la familia (U4), la casa (U6), el día (U8), el tiempo libre
  (U11), en una tienda (U12), el trabajo (U13), describir a alguien (U14) y los planes (U17).
- **A1, 1 libre** al terminar el A1 (U17, repaso final): «yo».
- **A2, 12 guiadas**: el fin de semana (U1), un viaje (U2), reservar un hotel (U3), la infancia (U4),
  algo que pasó (U5), una invitación (U6), pedir una pasantía (U7), avisar que estás enfermo (U8),
  comparar antes de comprar (U9), un problema con la tecnología (U10), una pareja (U11) y tu opinión (U12).
- **A2, 2 libres**: un fin de semana especial (U6, repaso final) y un día que no olvidás (U12, repaso
  final).

En las fichas de los patrones, el apóstrofo y el guion quedan dentro (_j'ai, s'appelle_). La etiqueta
del campo sale del idioma de la tarea, así que no hubo cambios en la app.

### 2.1 Ampliación: A2 U13 (2026-11-21)

La auditoría ([FR_A1_A2_AUDIT.md](FR_A1_A2_AUDIT.md) §5) encontró dos temas sin enseñanza explícita, y
se cubrieron con una unidad nueva al final del A2. Quedó al final para no renumerar unidades ni cambiar
ids ya validados. Las 29 unidades anteriores no cambiaron (§2.1.4).

#### 2.1.1 Programa

`content/fr/a2/unit13-moi-toi.ts`, «Moi, toi y el imperativo». Tiene la estructura de siempre:
objetivo, gramática con 3 ejemplos y 5 lecciones de 10 ejercicios. Cada lección cierra con dos de
producción. La unidad tiene un audio (`fr.stim.a2-u13-sortie`) y un texto (`fr.stim.a2-u13-mot`).

| Lección | Contenido                                                                                                                                                                                                  |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1      | Sujeto frente a tónico: _moi, je…; lui, il…; elle, elle…_; _c'est moi_ (y _c'est à moi_ = es mío)                                                                                                          |
| L2      | Después de preposición: _avec moi_ (no hay «conmigo»), _pour toi, sans elles, chez moi / chez toi_; _eux_ frente a _ils_                                                                                   |
| L3      | _Moi aussi_ (afirmativa), _moi non plus_ (negativa), _pas moi_; audio con 3 preguntas                                                                                                                      |
| L4      | Imperativo de _tu_ y _nous_: sin sujeto; los verbos en _-er_ y _aller_ pierden la _s_ (_regarde, va_), salvo en _vas-y_; _prends, attends, allons-y_; _sois sage, n'aie pas peur_; negativo _n'oublie pas_ |
| L5      | Imperativo con pronombre: _dépêche-toi, assieds-toi, aide-moi_ frente a _ne te dépêche pas, ne t'inquiète pas_; texto con 3 preguntas                                                                      |

**Palabras nuevas (20):**

- _moi, toi, c'est moi, chez moi, avec moi, sans, eux_
- _moi aussi, moi non plus_
- _regarde, prends, attends, allons-y, vas-y, sois sage, n'oublie pas_
- _dépêche-toi, assieds-toi, aide-moi, ne t'inquiète pas_

**Apoyo (7):** _regardez, oubliez, dépêchez, toute, dort, ferme, maman_.

**Escritura:** una tarea guiada, `fr.a2.wt.consignes` («Una nota con indicaciones»), tras
`fr-a2-u13-l05`. Pide imperativo de _tu_ y un tónico después de preposición.

**Pronunciación:**

- _regarde_ y _regardes_ suenan igual;
- _regarde_ frente a _regardez_;
- la _s_ de _vas-y_ suena como _z_;
- _moi / toi_ se pronuncian «mua / tua»;
- _non plus_: la _o_ es nasal y la _s_ final no suena.

**Para la revisión nativa** (además de §7):

- _sois sage_ dicho a un chico;
- _vas-y_ traducido como «dale»;
- _pas moi_;
- la naturalidad de la nota de la mamá (_attends-la_, _ne ferme pas la porte_).

#### 2.1.2 Detalle técnico

En _moi_ y _toi_ no se aceptan las traducciones «mí» ni «tú». El generador de repasos descarta las
traducciones ambiguas en todo el francés. Sin tildes, «tú» coincidía con «tu» (_ton / ta_), y la
primera versión de la unidad hacía desaparecer el ejercicio generado `fr.gen.translate_write.fr-ton-ta`
de A1 U4. `content:ids` lo detectó y no escribió el registro. Al quitar esas dos traducciones, los
caminos de las 29 unidades volvieron a ser idénticos a los del original.

#### 2.1.3 Totales vigentes (30 unidades)

| Qué                          | Antes (29)  | Ahora (30)  | Diferencia |
| ---------------------------- | ----------- | ----------- | ---------- |
| Unidades                     | 29          | 30          | +1         |
| Lecciones (escritas)         | 290 (145)   | 300 (150)   | +10 (+5)   |
| Ejercicios (escritos)        | 2898 (1448) | 2998 (1498) | +100 (+50) |
| Palabras (A2)                | 528 (206)   | 548 (226)   | +20        |
| Formas de apoyo              | 229         | 236         | +7         |
| `context_choice`             | 188         | 194         | +6         |
| Estímulos                    | 69          | 71          | +2         |
| Tareas de escritura          | 24          | 25          | +1         |
| Ítems en `ids.lock.json`     | 2351        | 2431        | +80        |
| Publicación: activos / draft | 2163 / 188  | 2237 / 194  | +74 / +6   |

Los 50 ejercicios escritos de la U13 en detalle: 16 `fill_blank`, 8 `translation_choice`, 6
`context_choice`, 6 `short_answer`, 5 `listen_choice`, 4 `match_pairs`, 4 `translate_write` y 1
`order_words`. Los otros 50 los generan los 5 repasos.

#### 2.1.4 Migraciones regeneradas

Se generan desde el cliente y son deterministas: dos ejecuciones dan el mismo hash. **No están en
`supabase/migrations/` ni en `supabase/pending/` del cliente y no se aplicaron**; integrarlas es la
Fase 4, sin autorizar.

- `20261202120000_fr_a1_a2.sql`: SHA-256
  `24abe90130ff5c8f5abed1f2764cf2ab1c25e2b91758ea47ae04612fed2c302d` (antes `e2417402…0ad4e12`).
- `20261203120000_publish_fr_a1_a2.sql`: SHA-256
  `6612fae8266373830ec532c5fb48058a95145980a7da09ebf82332ca78aa70ce` (antes `168f080e…6ab0229ee`).
  El rango de seguridad pasó a A2 1–13.

Las copias de PolyGo siguen siendo las de 29 unidades.

## 3. Cómo se integra

- `content/fr-course.ts` arma `FR_COURSE` (A1 U1–U17 y A2 U1–U12) y `FR_PATH` con
  `unitPath(…, { unitWordsOnly: true })`: cada unidad sólo enlaza sus propias palabras.
- **Registro**: `FR_PATH` entra en `ITEM_REGISTRY_PATH` y en el catálogo (`content/comprehension.ts`), y
  las tareas en `content/writing.ts`.
- **Ids**: 2351 ítems registrados con `npm run content:ids` (el registro pasó a 12765 ids): 1448 ejercicios
  escritos sorteados y el resto generados. Ningún ítem ya cargado cambió de identidad.
- **Vínculos**: sólo palabras de francés. Publicar el francés no depende de otras publicaciones.
- **Migración de carga** `supabase/migrations/20261202120000_fr_a1_a2.sql` (`npm run content:fr -- <archivo>`),
  con la plantilla _add-only_ sin modificarla:
  - 29 unidades, 290 lecciones, 528 palabras, 2898 ejercicios y 2351 ítems;
  - todo nace `is_published = false` y los ítems en `draft`;
  - sin cambios de esquema, `delete`, funciones, RLS, rutas ni desbloqueo, y sin fila en `public.languages`;
  - SHA-256 `e2417402…0ad4e12`;
  - **no aplicada**.
- Learning Machine, Ranked, SRS, Mastery y Adaptive: sin cambios.
- Inglés, portugués, italiano y chino: sin cambios en su contenido.

## 4. Validación (`content/fr-checks.ts`)

La usan la prueba de Jest, el generador de SQL (que no escribe si hay problemas) y `scripts/fr-check.ts`
(`npx tsx scripts/fr-check.ts ["fr A1 U5" | writing]`). Son las reglas del italiano adaptadas al francés:

- **Estructura**: el estándar de lección, ids propios, 14–20 palabras por unidad, objetivo y gramática
  declarados, `draft`.
- **Palabras**:
  - todas tienen id `fr-`, traducción y ejemplo, y ninguna lleva IPA;
  - ningún texto repite otro ni coincide con la traducción de otra palabra, salvo cognados y la única
    excepción declarada, _très_ («muy») frente a «tres» (_trois_), que sólo se igualan sin tildes;
  - todas se practican.
- **Vocabulario**:
  - todo el francés de respuestas, opciones, audio, estímulos, ejemplos, gramática y repasos generados
    usa formas ya enseñadas (unidades anteriores y su apoyo), palabras ya introducidas en la unidad,
    nombres declarados o el apoyo de la unidad;
  - el apóstrofo y el guion separan (_j'ai_ → _j_, _ai_);
  - se aceptan el plural y el femenino regulares de lo enseñado (_amies, grandes, italienne, vendeuse,
    sportive, chevaux_);
  - las formas verbales nuevas se enseñan o se declaran.
- **Apoyo**: cada forma se usa, es una sola ficha y no repite algo ya enseñado.
- **Corrección del servidor** (`gradeWithSpec`): la respuesta y las aceptadas se aceptan y los
  distractores no. No hay opciones repetidas **ni siquiera sin tildes**: _a / à, ou / où, la / là_ nunca
  van juntas como opciones, esa diferencia se trabaja con producción.
- **Convenciones**: apóstrofo recto y **sin espacio antes de `?` y `!`** (decisión del curso; la tipografía
  francesa lo pone, pero la app no maneja el espacio fino). `order_words` sin comas internas.
- **`context_choice`**: sin `words` (SRS v1), con conceptos, pregunta con «?», explicación con la
  evidencia y audio a 0.85 en A1 y 0.9 en A2. Los repasos generados no traducen cognados.
- **Escritura**: el modelo cumple sus requisitos, la lección existe y el modelo y las preguntas guía usan
  vocabulario enseñado hasta esa lección.

## 5. Pruebas

| Prueba                                              | Qué comprueba                                                                                |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `content/__tests__/fr.test.ts` (25)                 | Reglas, idioma oculto, camino, tipos, gramática por unidad, textos y velocidad, convenciones |
|                                                     | tipográficas, registro de ids, corrección, carga y publicación exactas, mutaciones del       |
|                                                     | validador, lematización, escritura                                                           |
| `content/__tests__/*` (9 suites, 5809 pruebas)      | Identidad de ítems, registro, catálogo, versiones, comprensión, conjuntos de opciones        |
| `supabase/tests/frContent.test.mjs` (en PGlite)     | Carga exacta, add-only, reaplicable, invisible sin publicar. Publicación: idempotente, sólo  |
|                                                     | filas propias, desbloqueo de la primera lección de cada nivel, juega las lecciones           |
| `items`, `learning`, `versions`, `presentations`, … | Incluyen `FR_PATH` y la migración nueva en sus listas                                        |

## 6. Publicación (preparada, sin ejecutar)

`supabase/pending/20261203120000_publish_fr_a1_a2.sql` (`npm run content:fr-publish -- <archivo>`):

- usa el mismo mecanismo que las publicaciones de los otros idiomas;
- comprueba que las filas sean exactamente las de la carga (francés A1 U1–U17 y A2 U1–U12);
- las publica, activa los conceptos y 2163 ítems, y deja los 188 `context_choice` en `draft` (D4);
- sólo hace `UPDATE` de estado, es idempotente y no toca `public.languages`;
- SHA-256 `168f080e…6ab0229ee` (regenerar si cambia la carga);
- vive en `pending/` para que nadie la aplique con el lote.

Orden para publicar (al final, junto con el resto):

1. Tener en las tiendas una build que reconozca `context_choice`, traiga la escritura de francés y oculte
   los idiomas `hidden`. La build local actual lo hace.
2. Aplicar las migraciones pendientes en orden; como mínimo `20261202120000_fr_a1_a2.sql`.
3. Mover `pending/20261203120000_publish_fr_a1_a2.sql` a `migrations/`, correr `npm run test:db` y
   aplicarla.
4. **Activar el idioma** (decisión de producto aparte, no incluida):
   - crear o activar la fila `fr` en `public.languages` con su `content_status`;
   - en `shared/languages.ts`, pasar `status` de `hidden` a `available` y definir `levels` (p. ej.
     `['A1']`);
   - decidir si el francés entra a Ranked (`ranked`).
5. Comprobar:
   - 29 unidades publicadas;
   - `fr-a1-u01-l01` y `fr-a2-u01-l01` abiertas, `fr-a1-u01-l02` cerrada hasta terminar la anterior;
   - una lección se completa en la app con la voz `fr-FR` del dispositivo.

Efectos al publicar (sin cambios en los motores):

- **Repasos (SRS v1)**: los 2163 ítems activos entran como candidatos cuando el alumno practicó su
  palabra; los de comprensión no. SRS v2, Mastery y Adaptive siguen apagados.
- **Ranked**: el francés tiene `ranked: false`. Si se activa, usaría las palabras publicadas de A1 y A2.

## 7. Revisión humana recomendada (no bloquea)

No hubo revisión nativa ni pedagógica humana. Conviene que un hablante de francés revise:

- **Audio**: escuchar la voz `fr-FR` de iOS y Android con los pares mínimos (_le / les, deux / douze, vin
  / vent_), las _liaisons_ y los números. Ningún audio fue verificado.
- **Hora**: _midi et demi_ frente a _midi et demie_ (las dos se aceptan desde la reforma de 1990; el curso
  enseña _midi et demi_).
- **Femeninos de profesiones**: _professeure, ingénieure_ (usuales en Francia hoy) frente a las formas
  tradicionales. Algunos distractores usan formas que no existen (_serveure_) para evaluar el femenino;
  decidir si se quieren distractores inexistentes.
- **Registro**: _bises / bisous_ al cerrar mensajes, _sympa_, _on_ por _nous_, y _vous_ en el hotel, el
  consultorio y la entrevista.
- **Compras**: _je fais du 38_ para el talle y la equivalencia de talles y números con la Argentina.
- **Nombres reales**: algunos textos mencionan lugares conocidos (la tour Eiffel, unas grandes tiendas de
  París) como referencia cultural, sin datos de contacto.
- **Tipografía**: el curso escribe sin espacio antes de `?` y `!`; la norma francesa lo pide. Es una
  decisión técnica que hay que confirmar.
- **Modelos de escritura**: leer los 24 modelos, sobre todo los libres del A2.

## 8. Archivos

Nuevos:

- `content/fr-course.ts`, `content/fr-checks.ts`, `content/fr/helpers.ts`, `content/fr/writing.ts`
- `content/fr/a1/index.ts`, `content/fr/a1/unit01…17-*.ts`, `content/fr/a2/index.ts`,
  `content/fr/a2/unit01…12-*.ts`
- `content/__tests__/fr.test.ts`, `supabase/tests/frContent.test.mjs`
- `scripts/build-fr-sql.ts`, `scripts/build-fr-publish-sql.ts`, `scripts/fr-check.ts`
- `supabase/migrations/20261202120000_fr_a1_a2.sql`, `supabase/pending/20261203120000_publish_fr_a1_a2.sql`
- este documento

Modificados:

- `shared/languages.ts`: `fr`, estado `hidden` y `VISIBLE_LANGUAGES`
- `src/app/onboarding.tsx` y `src/features/profile/components/LanguagesRow.tsx`: usan
  `VISIBLE_LANGUAGES`
- `content/comprehension.ts` (registro) y `content/writing.ts` (tareas de francés)
- `content/ids.lock.json`: 2351 ids nuevos
- `package.json`: `content:fr` y `content:fr-publish`
- `content/__tests__/comprehension.test.ts` y `planned.test.ts`: composición del registro
- `supabase/tests/items`, `learning`, `versions`, `presentations`, `planned`, `legacyReviewRetirement` y
  `a2Publish.test.mjs`: tramos y lista de migraciones
- `docs/LEARNING_CURRICULUM.md`
