# Inglés para hablantes de portugués, italiano y francés

Estado (2026-11-27): **PUBLICADO en producción** (base: cursos, cargas, publicación, Ranked compartido; servidor d476178; notify-battle-invite v5). En la app se ven con la **próxima build** (shared/courses.ts ya los marca disponibles). Commits en i18n/neutral-spanish (sin push). Lo que sigue en esta sección es el historial del trabajo.

**Avance:**

- **Contenido de los tres cursos traducido y validado:** 43 unidades cada uno y 0 problemas con `scripts/en-src-check.ts`.
- **Cargas generadas, sin publicar** (se aplican por psql, porque superan el límite de la API):

  | Curso        | Archivo                                                   | Tamaño  | Lecciones | Ejercicios |
  | ------------ | --------------------------------------------------------- | ------- | --------- | ---------- |
  | `en-from-pt` | `supabase/migrations/20270109120000_en_from_pt.sql`       | 9,27 MB | 450       | 4.160      |
  | `en-from-it` | `supabase/migrations/20270109120100_en_from_it.sql`       | 9,30 MB | 450       | 4.159      |
  | `en-from-fr` | `supabase/migrations/20270109120200_en_from_fr.sql`       | 9,31 MB | 450       | 4.158      |

- **Test de nivel:** `content/placement/select.ts` arma el banco de los tres cursos desde sus lecciones publicadas (A1–B1: 6 bandas, 18 preguntas, en el idioma de apoyo); los niveles salen de `courseLevels`. Los seis bancos de antes no cambian.
- **Tareas de escritura:** 38 por curso, en `content/en-src/generated/writing-*.ts` y registradas en `content/writing.ts`.
- **Interfaz en francés:** hecha (docs/I18N_GUIDE.md).
- **Migración `20270108120000_courses_per_language.sql` APLICADA en producción** (2026-11-27, psql, historial 152→153; SHA-256 821cda4a…). Antes: las 15 funciones que reemplaza coincidían por md5 con el repo. Después: contenido idéntico (210 unidades, 3.751 palabras), 0 filas sin curso, 3 cursos nuevos `hidden`; `interface_language` acepta es/en/pt-BR/it/fr (supera a `20270103` salvo `claim_battle_invite_push`, que sigue sin aplicar).
- **Falta:**
  - probar las cargas en PGlite;
  - `learning-session` por curso. **Cliente (local, sin build):** `shared/courses.ts` con los tres cursos (`status: 'hidden'`, niveles A1–B1; abrir uno = cambiar su `status`), selector agrupado por idioma de origen (`src/features/courses/CoursePicker.tsx`) en el registro y en «Tus cursos» → «Agregar curso», el idioma de Aprender abre «Tus cursos», y las cachés de contenido (camino, banco, palabras, palabra del día, dominio, repaso precargado/guardado) por curso;
  - Ranked compartido;
  - la publicación.

**Pendiente de revisión humana:**
- las notas de cada `content/en-src/<idioma>/<unidad>.json`;
- los errores del curso de origen que encontraron los traductores:
  - «de el» en B1 U5;
  - el «primer condicional» de B1 U6;
  - Leo, que nunca se presenta, en B1 U6 y U10;
  - la pista de los meses de A1 U9.

Cursos nuevos:

| Curso        | Para quién                              | Mercado | Apoyo                       |
| ------------ | --------------------------------------- | ------- | --------------------------- |
| `en-from-pt` | Hablantes de portugués (variante Brasil) | Brasil  | Português do Brasil, «você» |
| `en-from-it` | Hablantes de italiano                    | Italia  | Italiano estándar, «tu»     |
| `en-from-fr` | Hablantes de francés                     | Francia | Francés de Francia, «tu»    |

Todos van de A1 a B1, con el mismo inglés que `en-from-es`.

## 1. Decisiones del dueño

- **2026-11-27, orden:** primero el portugués completo y validado. Después el italiano y el francés en paralelo, reusando todo lo del piloto.
- **2026-11-27, Ranked:** un solo pool por idioma que se aprende. Un hispanohablante y un brasileño que estudian inglés juegan entre sí, con el mismo ELO de inglés. Cada jugador ve las traducciones en su propio idioma.
- Toda escritura en producción, despliegue o build pide autorización aparte, como siempre.

## 2. Enfoque del contenido: localizar, no reescribir

El inglés que se enseña es el mismo en los cuatro cursos. Por eso los cursos nuevos **se localizan** a partir del inglés desde español:

- Quedan **iguales**: palabras, oraciones, audios, opciones en inglés, respuestas y modelos de escritura. Los audios del bucket `tts` se reusan, porque cada clip se identifica por su texto en inglés.
- Se **reescribe** solo la capa de apoyo, adaptada al alumno:
  - traducciones;
  - consignas;
  - explicaciones;
  - preguntas de comprensión;
  - consignas y listas de las tareas de escritura.

### Piezas del pipeline

- **`content/en-src/flat.ts`.** El inglés desde español creció por capas: unidades cargadas, cierre de A1, «En contexto», U13–U14 planificadas, A2 U13–U17 y B1. Este módulo lo aplana en **43 unidades** (A1 14, A2 17, B1 12). Cada unidad junta todas sus lecciones escritas: 232 lecciones, 1.987 ejercicios y 846 palabras. Los repasos se regeneran con el idioma de apoyo del curso.
- **`content/en-src/support.ts`.** Es la única definición de qué campos son «de apoyo». Sirve para extraer los textos y también para armar el curso localizado.
- **`content/en-src/strings.ts` y `scripts/en-src-catalog.ts`.** Generan el catálogo `content/en-src/catalog/<unidad>.json`: 6.619 textos únicos, unos 198 mil caracteres. Cada texto lleva un id (hash), su tipo y el inglés al que acompaña.
- **Traducciones.** Van en `content/en-src/<pt|it|fr>/<unidad>.json`, con este formato:

  ```json
  {
    "unit": "a1-u01",
    "strings": { "<id>": "texto" },
    "accepted": { "<palabra en inglés>": ["otra traducción válida"] },
    "notes": "dudas para la revisión"
  }
  ```

- **Pendiente:**
  - generador del curso localizado (`content/en-src/course.ts`), con ids propios por curso;
  - validador (`content/en-src/checks.ts`): todo traducido, sin restos de español, opciones distintas entre sí después de traducir, y las reglas de siempre de los cursos.

## 3. Guía para traducir y adaptar (pt-BR; italiano y francés, igual en su idioma)

1. **Adaptar, no calcar.** El texto es para un brasileño que aprende inglés. Cuando una explicación compara con el español («como en español…», tú/usted, vos, ser/estar), se reescribe comparando con el portugués, o se quita la comparación si no aplica. Los falsos amigos se explican desde el portugués: *pretend*, *push*, *actually* ≠ atualmente, *parents* ≠ parentes, *college*, *library*, *exquisite*, *lunch*, *fabric*, *costume*…
2. **El inglés no se toca.** Las palabras o frases en inglés dentro de un texto se dejan tal cual, en cursiva o entre comillas como estaban. Un texto que es todo inglés (por ejemplo «am», «My name is… / I am…») se devuelve idéntico.
3. **Mismo significado que el inglés de contexto (`en`).** No se agrega ni se quita información. En `translate_write` (`exercise.source`), la oración en portugués tiene que llevar naturalmente a la respuesta en inglés.
4. **Opciones distinguibles.** Las opciones de un mismo ejercicio y los pares de `match_pairs` tienen que seguir siendo distintos entre sí después de traducir. Si dos textos en español se volverían iguales en portugués, se diferencian (por ejemplo, con una aclaración entre paréntesis) y se anota en `notes`.
5. **Variante y registro.**
   - pt-BR, con «você», tono cercano y claro, como el resto de la app.
   - Comillas “ ”.
   - Vocabulario de Brasil: ônibus, celular, trem, café da manhã.
   - Las consignas van en imperativo con «você»: «Traduza para o inglês», «Complete a frase», «Ouça e escolha o que você escuta», «Toque nos pares».
6. **Traducciones aceptadas.** Si una palabra tiene otra traducción común en Brasil, va en `accepted`, con la palabra en inglés como clave (por ejemplo `"hi": ["oi", "olá"]`).
7. **Nombres y lugares.** Se mantienen. Si una escena dice «en Buenos Aires», queda igual: es un contexto, no una variante.
8. **Dudas.** Van en `notes`. Nunca se inventa una regla del inglés: si el texto en español tiene un error, se anota.

## 4. Infraestructura (pendiente; el detalle técnico está en el inventario de la sesión del 2026-11-27)

Hoy todo supone **un curso por idioma de destino**. Los cambios, todos aditivos y locales hasta autorizarlos:

1. **Base:**
   - `courses.status`;
   - `curriculum_units.course_code`, con unicidad `(course_code, level, position)`;
   - `words.course_code`;
   - prefijos de ids propios por curso;
   - `is_lesson_unlocked`, rutas y visibilidad particionadas por curso;
   - las RPC de repaso y SRS por curso.

   Los cursos existentes quedan con su `course_code` por defecto: para ellos no cambia nada.
2. **`learning-session`:** recibe el curso además del idioma.
3. **Cliente:** el contenido, las claves de caché, la palabra del día y los widgets se leen por curso activo. `SOURCE_LANGUAGES` pasa a `es, en, pt, it, fr`.
4. **Interfaz en francés:** `locales/fr.json`, más `fr` en `INTERFACE_LANGUAGES` y en el CHECK de `interface_language`.
5. **Ranked compartido:**
   - las unidades comunes se cruzan por concepto (la palabra en inglés), no por id;
   - el battle server arma cada pregunta una sola vez y la manda **localizada por asiento**, con el mismo índice de respuesta correcta;
   - el banco de Word Rush suma traducciones por idioma de apoyo.
6. **Push:** el idioma del aviso sale de `interface_language`, no del idioma que se aprende.
