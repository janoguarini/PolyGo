# Chino mandarín A1 y A2

Estado (2026-11-13): **implementado y validado en local**. Nada se aplicó en producción, no hubo
despliegues, builds ni commits. Todo el contenido nuevo está en borrador (`draft`) y sin publicar.

Enfoque: el del inglés, el portugués y el italiano ([IT_A1_A2.md](IT_A1_A2.md)). PolyGo enseña, no
certifica: HSK 1–2 sirvió de referencia orientativa para el vocabulario, sin reproducir sus listas ni
sus exámenes. Variante: **mandarín estándar de China continental**, **caracteres simplificados** y
**pinyin oficial con marcas de tono**. Traducciones al español rioplatense, como el piloto (_celular_,
_subte_, _colectivo_, _pollera_, voseo).

## 1. Inventario previo

| Qué                  | Estado antes de esta fase                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Piloto A1            | U1–U12 publicadas (60 lecciones escritas, 182 palabras con pinyin, 219 caracteres), con Ranked                               |
| Temas del piloto     | Tonos y saludos, 是 / 不 / 吗, números y edad, familia y 个, objetos y clasificadores, 在 + lugar, comida, rutina, la hora y |
|                      | la fecha, ir a lugares y transporte, gustos y habilidades (会 / 能), compras y 太…了                                         |
| Faltaba en A1        | Plural con 们, profesiones e idiomas, colores, comparaciones (比, 一样), año, clima y estaciones, 了 de cambio y de acción   |
|                      | terminada, 没 en pasado, direcciones (左边, 旁边, 往), 可以, 吧                                                              |
| A2                   | No existía                                                                                                                   |
| Comprensión / textos | Ninguna (el piloto no tiene `context_choice`)                                                                                |
| Escritura            | Ninguna tarea de chino; `shared/writing.ts` no separaba caracteres chinos (una oración entera era una sola ficha)            |
| Pinyin en la app     | `shared/readings.ts` segmenta con el diccionario de palabras (la más larga primero) y `EXTRA_READINGS` para lo demás         |
| Tonos                | El piloto usa `listen_choice` con opciones de pinyin («Escuchá y elegí el tono correcto»)                                    |
| Configuración        | `shared/languages.ts`: `zh` disponible, nivel inicial sólo A1; el CHECK de nivel ya admite A1 y A2                           |

## 2. Qué se agregó

### Unidades

El piloto no se toca. Las unidades nuevas viven en su propio camino (`content/zh-course.ts`, `ZH_PATH`),
fuera de `COURSES` y de `CURRICULUM_PATH`, como el portugués y el italiano.

| Nivel | #   | Unidad                            | Gramática principal                                                                           | Palabras |
| ----- | --- | --------------------------------- | --------------------------------------------------------------------------------------------- | -------- |
| A1    | 13  | Trabajo, estudios e idiomas       | 们 (你们, 他们), 都, 做什么工作, 在 + lugar + verbo, 会说 + idioma, 一点儿, 哪里              | 16       |
| A1    | 14  | Descripciones, colores y comparar | Color + 的 (红色的), 有点儿 + adjetivo, describir personas, A 比 B + adj., A 跟 B 一样        | 17       |
| A1    | 15  | Fechas, cumpleaños y clima        | Orden de la fecha (年月号), 生日快乐, 天气怎么样, 了 de cambio (下雨了, 二十岁了), estaciones | 16       |
| A1    | 16  | Direcciones, planes y lo que hice | 旁边 / 左边 / 前面, 一直走, 往左走, 可以, 一起…吧, verbo + 了 y 没 + verbo                    | 16       |
| A2    | 1   | ¿Qué hiciste el fin de semana?    | 了 con objeto y cantidad, 已经…了, 还没…呢, 刚才, 早 / 晚, 见面                               | 16       |
| A2    | 2   | Viajes y experiencias             | 过, número + 次, 从…到…, 个小时, 是…的 (cómo / cuándo / con quién)                            | 15       |
| A2    | 3   | Restaurante y hotel               | 请, 给 + persona, 来一碗…, verbo repetido (尝尝), 买单, 预订                                  | 16       |
| A2    | 4   | ¿Qué estás haciendo?              | 在 / 正在…呢, 没在, el teléfono (喂, 你找谁), 给…打电话, 等一会儿, 马上                       | 14       |
| A2    | 5   | Salud y bienestar                 | Parte del cuerpo + 疼, 感冒了, 不舒服, 吃药, 应该, 别, 多 + verbo                             | 15       |
| A2    | 6   | Invitaciones y planes             | Preguntas A-不-A (有没有, 想不想), 打算, 还是, 当然 / 可惜, 进来 / 出去 / 回来 / 上来         | 15       |
| A2    | 7   | Trabajo y estudios                | Complementos de resultado (做完, 听懂, 写错, 准备好), 得 de grado, duración (学了两年)        | 15       |
| A2    | 8   | Compras y comparaciones           | 比…一点儿 / 多了, 更, 最, 没有…那么, 试试, 条, 打八折 (pagás el 80 %)                         | 15       |
| A2    | 9   | Tecnología y comunicación         | 发给 + persona, 用 + cosa + verbo, 开 / 关, 把 introductorio                                  | 15       |
| A2    | 10  | Rutinas, cambios y relaciones     | 以前…现在…了, 不…了, 越来越, 开始, …的时候, 一边…一边, 跟…结婚                                | 15       |
| A2    | 11  | Cultura y costumbres chinas       | 为什么, 因为…所以…, 先…再…, adjetivos repetidos (甜甜的), 春节, 中秋节, regalos               | 16       |
| A2    | 12  | Opiniones, problemas y soluciones | 觉得, 但是, 同意, 怎么了 / 怎么办, 丢 / 坏 / 忘, 被, 可能, 如果…就…                           | 16       |

Cada unidad: objetivo comunicativo, gramática con ejemplos, 5 lecciones escritas y el camino de siempre
(`content/path.ts`): L1 · L2 · Repaso · L3 · L4 · Repaso · L5 · Escucha · Palabras · Repaso final =
**10 lecciones por unidad, 160 en total** (80 escritas, 80 de repaso generadas con `unitWordsOnly`). Cada
lección escrita: introducción con dos ejemplos, 8–10 ejercicios, al menos una escucha, un ejercicio de
tonos en las cuatro primeras, los dos últimos de producción y 2 cierres «Ahora podés…».

**Diferencias con el español trabajadas a propósito** (en explicaciones y distractores): no hay verbo
«estar» con adjetivos (我很好, 很 obligatorio) pero sí sin 很 con 比; el lugar y el tiempo van antes del
verbo; 有 se niega con 没 y el pasado con 没 (nunca 不去过); 了 no es un «pasado» general; 还没 nunca con 了;
见面 y 结婚 no llevan objeto (跟…见面); 吃药 («comer» remedios); 打八折 (pagás el 80 %); 二 frente a 两; 点
(hora del reloj) frente a 小时 (duración); 高 (estatura) frente a 长 (largo); 旧 sólo para cosas y 老 para
personas; 还是 sólo en preguntas. Cultura: hemisferios y estaciones, el 8 de buena suerte, 红包, 回老家 en el
Año Nuevo, 月饼 y la luna, no regalar un reloj (送钟), pagar la cuenta quien invita.

### Pinyin y tonos

- Todo lo que se escribe es pinyin (con marcas o con números: `ni3 hao3`), como en el piloto; también se
  aceptan los caracteres y el pinyin sin espacios. 不 y 一 se escriben con su cambio de tono (bú shì, yí
  ge, como el piloto) y se acepta también el tono de diccionario (bù shì, yī ge).
- **65 ejercicios de tonos** («Escuchá y elegí el tono correcto», `listen_choice` con opciones de pinyin),
  uno por lección en las cuatro primeras de cada unidad, y explicaciones del tercer tono, el neutro, 喂 (wéi), 一会儿 (yíhuìr) y el erhua.
- **El pinyin que se escribe es el que la app muestra.** La app pone el pinyin encima de cada palabra
  segmentando con el diccionario del curso. El validador compara, para cada respuesta escrita y cada
  ejercicio de tonos, el pinyin autorado con el que la app mostraría encima de los caracteres (el neutro
  coincide con cualquier tono, y 不 / 一 se comparan sin su cambio de tono). Lo mismo con el pinyin de
  los modelos de escritura.
- Cada palabra tiene una sílaba válida por carácter y al menos un tono marcado (salvo las partículas), y
  cada carácter se lee igual en todo el curso (sin contar el tono) salvo una lista de polifónicos (了, 得,
  觉, 长, 还, 行, 地, 便…). El divisor de sílabas (`content/zh-pinyin.ts`) divide bien las 182 palabras del
  piloto y las 248 nuevas.

### Caracteres

- **233 caracteres nuevos** (219 del piloto, 452 en total), todos simplificados: el validador rechaza una
  lista de tradicionales frecuentes (們, 個, 這, 說, 學…).
- Ningún carácter aparece antes de enseñarse: todo el chino de cada ejercicio (opciones, audio,
  estímulos, respuestas, ejemplos y repasos generados) se segmenta con lo enseñado hasta ese punto
  (piloto, unidades anteriores, palabras ya presentadas en la unidad, apoyo y nombres). Una palabra de una
  unidad posterior no aparece antes de tiempo, aunque sus caracteres ya se conozcan.
- Reconocimiento visual con los tipos existentes (`translation_choice`, `image_choice`, `match_pairs`,
  `listen_choice`) y el interruptor de pinyin de la app para leer sin ayuda. **No hay práctica de trazos**:
  la arquitectura no la tiene y no se inventó un sistema nuevo.

### Vocabulario

- **248 palabras nuevas** (A1 65, A2 183) con caracteres, pinyin, traducción al español rioplatense,
  ejemplo, unidad e id `zh-…` nuevo. Ninguna repite el texto de una palabra del piloto. Los ids que ya
  usaba el piloto para otra palabra se evitaron (笔 es `zh-bi`, así que 比 es `zh-bi-comparar`).
- **Vocabulario de apoyo: 33 entradas** (`support` de cada unidad) más los nombres de personajes: formas
  que usan los textos sin ser palabras practicadas (大家, 可是, 吃饭, 和, 学, 打, 折, 奶奶, 知道…). Su
  pinyin está en `shared/zh-course-readings.ts`, que se suma a `EXTRA_READINGS` para que la app lo muestre.
  Una prueba comprueba que estas lecturas **no cambian la segmentación de ningún texto del piloto** (y por
  lo tanto tampoco los conjuntos de opciones ya cargados).

### Ejercicios

| Escritos (747)             |     | En los repasos generados (799) |     |
| -------------------------- | --- | ------------------------------ | --- |
| `fill_blank`               | 138 | `listen_choice`                | 213 |
| `translation_choice`       | 137 | `translation_choice`           | 175 |
| `context_choice`           | 96  | `translate_write` (pinyin)     | 171 |
| `listen_choice`            | 80  | `match_pairs`                  | 80  |
| `short_answer` (pinyin)    | 80  | Frases escritas reutilizadas   | 160 |
| `translate_write` (pinyin) | 80  |                                |     |
| `listen_choice` de tonos   | 65  |                                |     |
| `match_pairs`              | 31  |                                |     |
| `order_words`              | 27  |                                |     |
| `image_choice`             | 13  |                                |     |

**Sin tipos nuevos.** Los diálogos contextualizados son `context_choice` (audio) y `listen_choice`; la
producción escrita libre es el sistema de escritura. 454 ítems generados nuevos.

### Textos y audios

**48 estímulos** con 96 preguntas `context_choice`, al menos un audio y un texto por unidad:

- A1 (12, ~36 caracteres de media): 8 audios (una fiesta, una tienda, la familia, el clima, indicaciones
  en la calle) y 4 textos (mensajes, una presentación en el grupo de la clase). Velocidad 0.8.
- A2 (36, ~36 caracteres de media, más estructuras por oración): 23 audios (llamadas, consultorio, hotel,
  restaurante, aeropuerto, oficina, café, visitas) y 13 textos (mensajes, publicaciones, postal, menú,
  cartel de descuentos, descripción de la Fiesta de Medio Otoño). Velocidad 0.85.

Personajes ficticios (王明 del piloto, 李华, 张丽, 安娜, el profesor 陈); ningún dato de contacto. **Audio**:
el sistema existente lee con la voz del dispositivo (`zh-CN`) los mismos caracteres del ejercicio; no hay
archivos grabados. La correspondencia texto–pinyin está verificada (arriba); el audio en sí no se
escuchó ni se verificó en un dispositivo.

### Escritura (`content/zh/writing.ts`)

22 tareas con el sistema existente (sin IA, en el dispositivo, no se guarda):

- **A1, 8 guiadas**: presentarse (piloto U2), la familia (U4), el cuarto (U6), el día (U8), los gustos
  (U11), trabajo e idiomas (U13), describir a alguien (U14) y un mensaje para salir (U16). **1 libre** al
  terminar el A1 (U16, repaso final).
- **A2, 11 guiadas**: el fin de semana, un viaje, un mensaje para reservar, qué están haciendo, consejos
  de salud, invitar, trabajo o estudios, recomendar una tienda, antes y ahora, una fiesta, tu opinión. **2
  libres**: organizar un viaje (U6, repaso final) y un problema que tuviste (U12, repaso final).
- Se escribe en caracteres (teclado chino del teléfono) o en pinyin separado por palabras, con marcas,
  números o sin tonos: cada requisito acepta las cuatro formas. No se exige escribir a mano.
- Cada modelo trae su pinyin (`modelReading`), validado contra los caracteres. Las preguntas guía llevan
  el pinyin entre paréntesis.

Cambios mínimos en la app para que esto funcione:

- `shared/writing.ts`: cada carácter chino es una ficha (antes una oración entera era una sola ficha),
  。！？ cierran oraciones y cuentan como puntuación final, y una oración que empieza con un carácter
  chino cumple «mayúscula inicial». Para los demás idiomas no cambia nada (prueba).
- `WritingTask.tsx`: muestra `modelReading` debajo del modelo si la tarea lo trae.

Como las tareas viajan con la app, se ven recién con una build nueva (también las del piloto U2–U11).

## 3. Cómo se integra (sin tocar lo publicado)

- `content/zh-course.ts` arma `ZH_PATH` (A1 U13–U16 + A2 U1–U12). El piloto (`content/zh/a1/unit01…12`)
  no cambió: su consolidación, ids y vínculos son los mismos (`identity.test.ts`).
- **Ids**: 1201 ítems registrados con `npm run content:ids` (registro 9213 → 10414: 747 escritos
  sorteados y 454 generados). Ningún ítem cargado cambió de identidad.
- **Vínculos**: sólo palabras del piloto (publicadas) y propias. Publicar el chino no depende de otras
  publicaciones.
- **Migración de carga** `supabase/migrations/20261130120000_zh_a1_a2.sql` (`npm run content:zh -- <archivo>`),
  con la plantilla _add-only_ de la fase C.3 sin modificarla. **Sin cambios de esquema**: `words.romanization`
  ya guarda el pinyin y el CHECK de nivel ya admite A2. Todo nace `is_published = false` y los ítems en
  `draft`. Sin `delete`, funciones, RLS, rutas ni desbloqueo. SHA-256 `f416450c…c082`, igual en dos
  corridas. **No aplicada.**
- Ranked, SRS, Mastery, Adaptive y Learning Machine: sin cambios.

## 4. Validación (`content/zh-checks.ts`)

La usan la prueba de Jest y el generador (que no escribe si hay problemas):

- Estándar de lección, ids propios, 14–20 palabras por unidad, objetivo y gramática, draft.
- Palabras: ids `zh-`, pinyin válido (una sílaba por carácter, erhua incluido), tonos, sin repetir textos.
- Marca de tono sobre la vocal correcta (a / e; si no, la o de «ou»; si no, la última vocal: liù, guì)
  en palabras, lecturas de apoyo, respuestas escritas, opciones de tonos y pinyin de los modelos
  (agregado el 2026-11-14; las 1222 entradas existentes ya cumplían).
- Simplificados, coherencia carácter–pinyin, pinyin autorado = pinyin mostrado, caracteres y palabras
  enseñados a tiempo, apoyo con lectura y usado, lecturas nuevas que no tocan el piloto.
- **Corrección del servidor** (`gradeWithSpec`): respuesta y aceptadas correctas (pinyin, caracteres, sin
  espacios, sin cambio de tono), distractores no. Los ejercicios de tonos pueden tener opciones que sólo
  difieren en el tono (es lo que se practica).
- `context_choice` sin `words` (SRS v1), con conceptos, pregunta con «?», explicación con la evidencia,
  audio entre 0.75 y 0.9.
- Escritura: el modelo cumple sus requisitos, su pinyin coincide, la lección existe y el modelo y las
  preguntas usan caracteres enseñados hasta esa lección.

## 5. Pruebas

| Prueba                                             | Qué comprueba                                                                                |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `content/__tests__/zh.test.ts` (30)                | Reglas, camino, tipos, tonos por lección, gramática por unidad, longitud, velocidad,         |
|                                                    | registro, corrección (incluidos números de tono y sin tonos = incorrecto), pinyin mostrado,  |
|                                                    | piloto sin cambios, carga y publicación exactas, mutaciones del validador, escritura         |
| `content/__tests__/*` (17 suites, 5968)            | Identidad de ítems (pilotos incluidos), registro, catálogo, versiones, conjuntos de opciones |
| `supabase/tests/zhContent.test.mjs` (8, en PGlite) | Carga exacta, sin cambios de esquema, add-only, reaplicable, aborta si una fila difiere,     |
|                                                    | invisible; en la base desechable: publica, idempotente, sólo filas propias, juega las 160    |
| `items`, `learning`, `versions`, `presentations`,  | Incluyen `ZH_PATH` y la migración nueva en sus listas (102 pruebas)                          |
| `planned`, `legacyReviewRetirement`, `a2Publish`   |                                                                                              |

## 6. Publicación (preparada, sin ejecutar)

`supabase/pending/20261201120000_publish_zh_a1_a2.sql` (`npm run content:zh-publish -- <archivo>`): mismo
mecanismo que las publicaciones anteriores. Comprueba que las filas sean exactamente las de la carga, las
publica, activa los conceptos y 1105 ítems y deja los 96 `context_choice` en `draft` (D4). Sólo `UPDATE`
de estado, idempotente. SHA-256 `6a0f1424…f9b2e` (regenerar si cambia la carga). Vive en `pending/`.

Orden para publicar (al final, junto con el resto):

1. Tener en las tiendas (y como mínima en uso) una build que reconozca `context_choice`, traiga las
   lecturas nuevas (`shared/zh-course-readings.ts`), la escritura por carácter y las tareas de chino.
2. Aplicar las migraciones pendientes en orden; como mínimo `20261113120000_context_comprehension.sql` y
   `20261130120000_zh_a1_a2.sql`.
3. Mover `pending/20261201120000_publish_zh_a1_a2.sql` a `migrations/`, correr `npm run test:db` y aplicarla.
4. Comprobar: 16 unidades publicadas; `zh-a2-u01-l01` abierta; `zh-a1-u13-l01` se abre al terminar
   `zh-a1-u12-final`; una lección se completa en la app con el pinyin encima.

Efectos al publicar (sin cambios en los motores): Ranked de chino tomaría las palabras nuevas
(`rush_levels`); los 1105 ítems activos entran como candidatos de repaso (SRS v1) cuando el alumno practicó
su palabra; el nivel inicial A2 sigue sin ofrecerse en `shared/languages.ts`.

## 7. Limitaciones conocidas

- **Sin revisión nativa**: tonos, naturalidad de diálogos, registro y cultura necesitan que los lea un
  hablante o docente de chino (no bloquea).
- **Audio sintético**: depende de la voz `zh-CN` del dispositivo; no se escuchó. Puede leer mal algún
  polifónico o un nombre propio.
- **Pinyin encima por palabra**: la app segmenta por el diccionario; los cambios de tono de 不 y 一 se
  muestran sólo donde hay una palabra o apoyo que los trae (不客气, 一共, 不太, 一点儿…); en el resto se ve
  el tono de diccionario. Los polifónicos sueltos usan la lectura más común.
- **Corrector existente con números de tono**: una sílaba neutra pegada necesita el 5 (`wo3men5`);
  `wo3men` no se convierte. Con marcas o con caracteres no hay problema. No se cambió el corrector (vive
  también en el servidor).
- **Escritura**: no reconoce pinyin todo junto sin espacios (`wojiao`) como patrón, y no practica trazos.
- **Nivel inicial A2**: no se ofrece todavía (decisión de producto aparte).

## 8. Archivos

Nuevos: `content/zh-course.ts`, `content/zh-checks.ts`, `content/zh-pinyin.ts`, `content/zh/helpers.ts`,
`content/zh/writing.ts`, `content/zh/a1/extra.ts`, `content/zh/a1/unit13…16-*.ts`, `content/zh/a2/index.ts`,
`content/zh/a2/unit01…12-*.ts`, `shared/zh-course-readings.ts`, `content/__tests__/zh.test.ts`,
`scripts/build-zh-sql.ts`, `scripts/build-zh-publish-sql.ts`, `supabase/migrations/20261130120000_zh_a1_a2.sql`,
`supabase/pending/20261201120000_publish_zh_a1_a2.sql`, `supabase/tests/zhContent.test.mjs`, este documento.

Modificados: `shared/readings.ts` (suma las lecturas nuevas), `shared/writing.ts` (fichas por carácter,
puntuación china, `modelReading`), `src/features/learning/components/WritingTask.tsx`,
`content/comprehension.ts` (registro), `content/writing.ts` (tareas de chino), `content/ids.lock.json`
(1201 ids nuevos), `package.json` (`content:zh`, `content:zh-publish`), `content/__tests__/comprehension.test.ts`
y `planned.test.ts`, `supabase/tests/items`, `learning`, `versions`, `presentations`, `planned`,
`legacyReviewRetirement` y `a2Publish.test.mjs`, `docs/LEARNING_CURRICULUM.md`.
