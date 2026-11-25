# Contenido de Word Rush

Estado del banco de desafíos de Word Rush (el único modo Ranked: Swipe Battle, Connect Battle, Sentence
Rush y Audio Blitz). Código: [`content/word-rush/`](../content/word-rush). Tests:
[`content/__tests__/wordRushContent.test.ts`](../content/__tests__/wordRushContent.test.ts) y
[`rankedArcadePools.test.ts`](../content/__tests__/rankedArcadePools.test.ts). Reglas del juego:
[BATTLE_PROTOCOL.md](BATTLE_PROTOCOL.md).

> **Fase 4 (contenido) y Fase 5 (integración en el servidor) hechas localmente, 2026-11-24. Nada
> está aplicado en producción:** ni la migración, ni los datos, ni el deploy del servidor. Ver §8.

## 1. Cómo se armó

- **Fuente:** las frases de las lecciones publicadas, con el mismo id que en la base
  (`pathExerciseId`), más un banco por idioma:
  - **frases nuevas**: sólo inglés y español, por ahora;
  - **variantes**: otros órdenes igual de correctos para frases de lecciones;
  - **revisadas como de orden único**: con su motivo.
- **Filtros:** todo pasa por los mismos filtros del servidor (`sentencePool`: nivel, 3–6 fichas,
  contenido roto, conectores, duplicados) y se corrige con el mismo `gradeArcade`.
- **Controles** (`bankProblems`, todos en cero en los seis idiomas):
  - ids `<idioma>.wr.<slug>` únicos; unidad publicada;
  - 3–6 fichas; puntuación final; sin ¿ ni ¡ en las fichas (delatarían el orden);
  - traducción natural con puntuación;
  - sin repetir la frase ni la traducción de otra frase (del banco o de una lección);
  - cada variante usa exactamente las mismas fichas y el corrector la acepta;
  - la frase pasa los filtros de Word Rush;
  - **vocabulario enseñado hasta su unidad** (inglés: lo enseñado en A1 U1…U*n*; español:
    `esTaughtFormsBefore`, con plurales y femeninos regulares);
  - registro:
    - el curso de español usa tú, sin voseo;
    - las traducciones al español del curso de inglés usan vos, como toda la app;
  - **adverbio de tiempo en un extremo** («hoy», «today», «今天»…): exige la variante con el otro
    orden, o `onlyOrder` con el motivo si ningún otro orden es natural.
- **Publicado:** inglés A1 U1–12 y A2 U1–17; italiano, portugués y chino A1 U1–16 y A2; francés y
  español A1 y A2. Según la última integración registrada (2026-11-23); ver §6.

## 2. Frases utilizables, antes y después

| Curso     | Franja | Antes (sólo lecciones) | Después | Nuevas | Lecciones recuperadas o corregidas |
| --------- | ------ | ---------------------: | ------: | -----: | ---------------------------------- |
| Inglés    | A1     |                     30 | **165** |    134 | 4 variantes, 1 orden revisado      |
| Inglés    | A1+A2  |                     50 | **185** |        |                                    |
| Español   | A1     |                     32 | **167** |    134 | 10 variantes, 1 orden revisado     |
| Español   | A1+A2  |                     58 | **194** |        |                                    |
| Italiano  | A1     |                     44 |      49 |      — | 18 variantes                       |
| Italiano  | A1+A2  |                     59 |      66 |        |                                    |
| Portugués | A1     |                     46 |      47 |      — | 8 variantes, 1 orden revisado      |
| Portugués | A1+A2  |                     78 |      79 |        |                                    |
| Francés   | A1     |                     50 |      51 |      — | 4 variantes, 2 órdenes revisados   |
| Francés   | A1+A2  |                     79 |      80 |        |                                    |
| Chino     | A1     |                     59 |      59 |      — | 6 variantes, 2 órdenes revisados   |
| Chino     | A1+A2  |                     71 |      71 |        |                                    |

- **Meta de unas 150 frases por franja:** cumplida en inglés y español, las dos franjas.
- **Variantes que no suman frases:** en italiano, portugués, francés y chino las variantes recuperan
  pocas frases (las de conector) o ninguna. Sirven para que las respuestas correctas ya no se
  rechacen.
- **Repartición:**
  - Inglés: entre 6 (U1) y 13 frases por unidad A1.
  - Español: entre 4 (U3, con muy poco vocabulario) y 10 por unidad A1.
  - Con el filtro de unidades, quien recién empieza ve sólo las frases de lo que ya desbloqueó.

## 3. Por formato

| Curso     | Franja | Swipe y Audio (palabras) | Connect | Sentence Rush (frases) | Fuera por descriptivas | Comparten significado* |
| --------- | ------ | -----------------------: | ------- | ---------------------: | ---------------------: | ---------------------: |
| Inglés    | A1     |                      240 | sí      |                    165 |                      4 |                     23 |
| Inglés    | A1+A2  |                      559 | sí      |                    185 |                     10 |                     60 |
| Español   | A1     |                      325 | sí      |                    167 |                      0 |                     10 |
| Español   | A1+A2  |                      533 | sí      |                    194 |                      0 |                     23 |
| Italiano  | A1     |                      289 | sí      |                     49 |                      8 |                      6 |
| Italiano  | A1+A2  |                      487 | sí      |                     66 |                      8 |                     12 |
| Portugués | A1     |                      282 | sí      |                     47 |                      4 |                      6 |
| Portugués | A1+A2  |                      475 | sí      |                     79 |                      4 |                     20 |
| Francés   | A1     |                      322 | sí      |                     51 |                      0 |                     16 |
| Francés   | A1+A2  |                      548 | sí      |                     80 |                      0 |                     21 |
| Chino     | A1     |                      240 | sí      |                     59 |                      7 |                     15 |
| Chino     | A1+A2  |                      419 | sí      |                     71 |                     11 |                     28 |

\* Palabras que comparten algún significado con otra (casa / hogar). Siguen en el juego, pero el motor
nunca las usa como «mentira» de Swipe, distractor de Audio o pareja de Connect entre sí
(`translationKeys`, Fase 1). Por eso no hay distractores equivalentes a la respuesta.

**Los cuatro formatos están disponibles en los seis cursos y las dos franjas.** Una partida de 60
desafíos no repite palabras ni frases.

## 4. Lo que todavía queda fuera, y por qué

**Más de 6 fichas** (el tope de Sentence Rush, `ARCADE.sentenceTokens.max` en `shared/`). Las frases
afectadas son:

| Curso     | 7 fichas |   8 |  9+ | Con tope 7: A1 | Con tope 7: A1+A2 |
| --------- | -------: | --: | --: | -------------- | ----------------- |
| Inglés    |       29 |   7 |   3 | 165 → 167      | 185 → 200         |
| Español   |       21 |   8 |   0 | 167 → 171      | 194 → 205         |
| Italiano  |       11 |   1 |   0 | 49 → 50        | 66 → 68           |
| Portugués |       17 |   4 |   3 | 47 → 49        | 79 → 86           |
| Francés   |       16 |   9 |   3 | 51 → 55        | 80 → 89           |
| Chino     |        2 |   2 |   0 | 59 → 59        | 71 → 73           |

- **Recomendación:** subir el tope a 7 sólo en A1+A2 (ganancia real en inglés, español, francés y
  portugués). En A1 conviene dejar 6: el aporte es mínimo y las frases cortas son mejores para el
  ritmo de 60 s.
- Es un cambio de `shared/arcade.ts` y requiere autorización. De 8 fichas en adelante no conviene:
  son lentas de armar en una partida corta.

**Conector con un solo orden posible:** Word Rush las descarta. No se les inventa una variante.

| Curso     | Frases                                                                                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inglés    | «We packed our suitcases and left.» (secuencia)                                                                                                                                    |
| Español   | «Son las ocho y cuarto.» (la hora, dos ejercicios)                                                                                                                                 |
| Italiano  | «Sono le undici e un quarto.» (la hora)                                                                                                                                            |
| Portugués | «Tudo bem, e você?» (fórmula, dos), «São onze e quinze.» (la hora, dos), «Siga reto e depois à direita.» (secuencia, dos), «O computador quebrou e não funciona.» (causa y efecto) |

Para usarlas habría que permitir en `shared/` una marca de «orden único» que acepte el conector sin
variante. Es un cambio de `shared/`, así que no lo hice.

**Duplicados:** los repasos de las lecciones repiten frases (por ejemplo, 20 en inglés A1). Se cuentan
una sola vez, y no es un problema.

## 5. Ejemplos de variantes incorporadas

| Curso     | Frase                             | También acepta             | Motivo                  |
| --------- | --------------------------------- | -------------------------- | ----------------------- |
| Inglés    | They eat chicken and rice.        | They eat rice and chicken. | conector conmutativo    |
| Inglés    | I don't work tomorrow.            | Tomorrow I don't work.     | adverbio de tiempo      |
| Español   | Tengo pan y leche.                | Tengo leche y pan.         | conector conmutativo    |
| Español   | Hay un gato en la cama.           | En la cama hay un gato.    | locativo antepuesto     |
| Español   | Hoy hace buen tiempo. _(lección)_ | Hace buen tiempo hoy.      | adverbio de tiempo      |
| Italiano  | Ho due libri e tre penne.         | Ho tre penne e due libri.  | conector conmutativo    |
| Italiano  | Ho mal di testa da ieri.          | Da ieri ho mal di testa.   | complemento de tiempo   |
| Portugués | Eu posso cozinhar hoje.           | Hoje eu posso cozinhar.    | adverbio de tiempo      |
| Francés   | J'ai un fils et une fille.        | J'ai une fille et un fils. | conector conmutativo    |
| Chino     | 我早上吃早饭。                    | 早上我吃早饭。             | tiempo antes del sujeto |

**Revisadas como de orden único** (el control automático dudaba): «How about a movie tonight?», «Hoy
es el primero de abril.», «Já marquei uma consulta para amanhã.», «Quelle est la date
aujourd'hui?», «Qu'est-ce qui s'est passé hier?», «现在几点？», «现在九点半。».

**Criterio en español:** no se acepta la inversión del sujeto («En Roma vive mi hermana»), igual que
en las lecciones. Esas respuestas, que son gramaticales pero marcadas, se siguen rechazando.

## 6. Producción: lo que no se pudo verificar

- **Sin consultas a la base.** No se ejecutó SQL ni se consultó producción (fuera de lo autorizado).
  Lo «publicado» sale del contenido local y de la integración registrada el 2026-11-23.
- **Comparación estática con el repo:** las 800 frases de lección que se usan (123 en inglés, 131 en
  español, 123 en italiano, 151 en portugués, 153 en francés y 119 en chino) aparecen, con su id y su
  respuesta, en los `.sql` de `supabase/migrations` y `supabase/pending`. Eso prueba que el contenido
  local es el que el repo cargaría, no lo que hay hoy en la base.
- **Lo que podría diferir en producción:**
  - correcciones manuales posteriores;
  - el estado de publicación real (por ejemplo, inglés A1 U13–14 y el cierre estaban cargados sin
    publicar y no se cuentan acá);
  - si la ruta v2 de inglés se activó; hoy sólo cambia qué unidades ve cada jugador.
- **Cómo verificarlo antes de cargar** (sólo lectura, con autorización): contar los `order_words`
  publicados por idioma y unidad, y comparar ids y respuestas con `lessonOnlySentences`.

## 7. Qué falta

1. **Activarlo en producción** (con autorización): ver §8.5.
2. **Frases nuevas en italiano, portugués, francés y chino** para acercarse a 150 por franja (hoy
   49–80). Necesitan, antes, un validador de vocabulario como el de inglés y español; los
   `*TaughtFormsBefore` ya existen. En chino, además, la lectura de cada carácter (pinyin).
3. **Revisión nativa:** como todo el contenido nuevo del curso (`review_status = 'draft'`), las 268
   frases nuevas no pasaron por hablantes nativos.
4. **Decisiones de `shared/`:** el tope de 7 fichas en A1+A2 y la marca de «orden único» para frases
   con conector.

## 8. Integración en el servidor (Fase 5)

### 8.1 Tablas

`supabase/pending/20261227120000_word_rush_bank.sql`. Vive en `pending/` para que la integración
GitHub–Supabase no la aplique sola.

- **`word_rush_sentences`**: frases nuevas que no están en las lecciones.
  - Columnas: `id`, `language_code`, `level`, `unit_id`, `tokens`, `answer`, `accepted_answers`,
    `translation`, `is_published`, `created_at` y `updated_at`.
  - `id` con la forma `<idioma>.wr.<slug>`. No choca con los ids de `exercises`, que no llevan puntos.
  - FK a `languages` y a `curriculum_units`.
  - `unique (language_code, answer)`.
  - Un trigger exige que el idioma y el nivel sean los de la unidad, y que el id empiece con el
    idioma.
- **`word_rush_exercise_variants`**: otros órdenes correctos de ejercicios `order_words` que ya
  existen.
  - Columnas: `exercise_id` (PK y FK a `exercises`), `accepted_answers` y `reason`.
  - Un trigger exige que el ejercicio sea `order_words`.
  - **No modifica `exercises.accepted_answers`:** las lecciones corrigen igual que antes.
- **Acceso:** RLS activado y sin políticas.
  - `anon` y `authenticated` no tienen ningún privilegio.
  - `service_role` (el servidor de partidas) sólo tiene `select`.
  - La carga la hace la migración, como dueña de las tablas.
- **Datos:** `supabase/pending/20261227120100_word_rush_bank_data.sql`.
  - Lo genera `node --import tsx scripts/build-word-rush-sql.ts` desde `content/word-rush/`; no se
    edita a mano.
  - 266 frases y 50 ejercicios con variantes.
  - Idempotente (`on conflict do update`) y no borra nada.
- **Rollback:** `supabase/rollback/20261227120000_word_rush_bank.down.sql`.

### 8.2 Cómo se unen las dos fuentes

Lo hace `loadSentences` (`server/src/supabaseStore.ts`), con `mergeSentenceSources`
(`server/src/wordRushBank.ts`):

1. Lee las frases de las lecciones como antes: unidades, lecciones y ejercicios `order_words`, todos
   publicados.
2. Lee las dos tablas del banco: las frases publicadas del idioma y todas las variantes (son pocas
   filas).
3. Une las dos fuentes:
   - **Lecciones primero.** No cambian, salvo que se les suman las variantes válidas del banco.
   - **Frases del banco**, sólo si cumplen todo esto:
     - son del idioma pedido;
     - su unidad está publicada;
     - tienen fichas, respuesta y traducción;
     - las fichas forman la respuesta.
   - **Sin duplicados:** se descarta una frase con el mismo id o la misma respuesta (`canonicalForm`)
     que otra anterior. Ante un choque gana la lección.
4. Después sigue todo igual que antes, en `createBattle` (`server/src/server.ts`):
   - filtro de unidades comunes a los jugadores (`rush_common_unit_ids`);
   - `sentencePool` (nivel según el rating, 3–6 fichas, conectores, duplicados);
   - `createChallengeStream`.

   Una sola secuencia por partida, la misma para los dos jugadores, con la memoria anti-repetición
   de siempre (por id de frase).

### 8.3 Variantes

Una variante sólo se acepta si se arma con exactamente las mismas fichas que la frase, en otro
orden, y el corrector de Word Rush la reconoce:

- **Cómo se comprueba:** `isValidVariant` prueba las permutaciones de hasta 7 fichas con
  `verdictForText`, sin tolerancia de tipeo.
- **Si falla:** se descarta la variante, no la frase.
- **En la partida:** `gradeArcade` compara la respuesta con `[answer, ...acceptedAnswers]`.

### 8.4 Errores de lectura

| Qué falla                                                         | Qué pasa                                                                                                                       |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Lecciones                                                         | Lanza, como antes. La partida no se crea (`battle_create_failed`).                                                             |
| Cualquiera de las dos tablas del banco (red, permisos, no existe) | Sigue sólo con las lecciones, sin nada del banco: ni frases ni variantes. Registra `word_rush_bank_unavailable` con el código. |
| Filas inválidas o duplicadas                                      | Se descartan una por una. Registra `word_rush_bank_rows_skipped` con los contadores.                                           |

- **Antes de la migración:** como sin las tablas el servidor funciona igual que antes, se puede
  desplegar el servidor antes que la migración.
- **Caché:** el resultado (también el de sólo lecciones) se guarda 10 minutos por idioma
  (`wordCacheMs`). Tras un fallo del banco, vuelve a intentarlo al vencer.

### 8.5 Activación en producción (cada paso requiere autorización)

1. **Verificar de antemano, sólo lectura:**
   - que existan las unidades de `unit_id` y los ejercicios de `exercise_id`;
   - que no haya tablas con esos nombres.

   Si falta algo, la carga aborta entera (FK y triggers, dentro de `begin … commit`).

2. **Aplicar la estructura:** `supabase/pending/20261227120000_word_rush_bank.sql`.
3. **Aplicar los datos:** `supabase/pending/20261227120100_word_rush_bank_data.sql`.
4. **Postcheck:**
   - 266 frases y 50 variantes;
   - `exercises` sin cambios (md5);
   - `anon` y `authenticated` sin acceso.
5. **Desplegar en Railway el servidor de partidas con este código.** El orden entre el despliegue y
   los pasos 2–3 no importa.
6. **Prueba de humo:**
   - una partida Word Rush (v3) en inglés A1;
   - que no aparezca `word_rush_bank_unavailable` en los logs.
7. **Rollback:**
   - el archivo `.down.sql`;
   - o, sin tocar el esquema, `update word_rush_sentences set is_published = false`. Las variantes
     sólo se quitan borrando sus filas.

### 8.6 Tests

- **`server/test/wordRushBank.test.ts`:**
  - `loadSentences` con un Supabase falso: las dos fuentes, duplicados, idioma, nivel, unidades,
    variantes, corrector, misma secuencia, sin repetir;
  - fallas de cada fuente y tablas inexistentes;
  - partida v3 por Socket.IO con la misma secuencia para los dos;
  - partida v2 que no lee frases.
- **`supabase/tests/wordRushBank.test.mjs`** (sólo PGlite, en memoria):
  - la migración y los datos sobre una base como la de producción;
  - idempotencia;
  - `exercises` intacto;
  - permisos y restricciones;
  - rollback;
  - lo que leería el servidor es igual al contenido local en los seis cursos.
- **`content/__tests__/wordRushIntegration.test.ts`:**
  - la unión con el contenido real (inglés 165 y español 167 frases en A1);
  - 60 desafíos sin repetir;
  - que ningún código de la app, de los desafíos con amigos ni de las migraciones aplicables use
    las tablas.

### 8.7 Limitaciones

- **Sin tipos generados:** `database.generated.ts` no tiene las tablas, así que se leen sin tipos y
  cada fila se valida a mano. Tras aplicar la migración, conviene regenerar los tipos.
- **Las frases quitadas del banco local no se borran:** la carga no borra filas. Para retirar una
  frase hay que despublicarla con `is_published = false`.
- **Caché de 10 minutos:** un fallo del banco deja la partida sólo con lecciones hasta que vence.
- **Lo publicado en producción no se verificó** (§6).
