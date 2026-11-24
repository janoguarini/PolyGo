# Portugués de Brasil A1 y A2

Estado (2026-11-12): **implementado y validado en local**. Nada se aplicó en producción, no hubo
despliegues, builds ni commits. Todo el contenido nuevo está en borrador (`draft`) y sin publicar.

Enfoque: el del inglés ([A1_EN_CLOSURE.md](A1_EN_CLOSURE.md), [B1_EN.md](B1_EN.md)). PolyGo enseña, no
certifica; el MCER es una guía de nivel. No hay exámenes, umbrales ni desbloqueos condicionados.
Variante: **portugués de Brasil** (ortografía actual, vocabulario y registro brasileños: _você_,
_a gente_, pronombres antes del verbo, _ônibus_, _celular_, _tênis_). Traducciones al español
rioplatense, como el piloto (_remera_, _colectivo_, voseo).

## 1. Inventario previo

| Qué                  | Estado antes de esta fase                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| Piloto A1            | U1–U12 publicadas (60 lecciones escritas, 210 palabras, ~315 formas), con Ranked                          |
| Temas del piloto     | Saludos, ser, números, familia, objetos, casa, comida, rutina, horas, ciudad, gustos, preguntas y precios |
| Faltaba en A1        | Profesiones, plural de los verbos (nós / eles), estar y estados, fechas y clima, transporte, pelo / pela  |
| A2                   | No existía                                                                                                |
| Comprensión / textos | Ninguna (el piloto no tiene `context_choice`)                                                             |
| Escritura            | Ninguna tarea de portugués                                                                                |
| Configuración        | `shared/languages.ts`: `pt` disponible, nivel inicial sólo A1; el CHECK de nivel ya admite A1 y A2        |
| Validación           | Sólo las reglas generales de `content.test.ts` (el validador por formas de B1/B2 es del inglés)           |

## 2. Qué se agregó

### Unidades

El piloto no se toca. Las unidades nuevas viven en su propio camino (`content/pt-course.ts`, `PT_PATH`),
fuera de `COURSES` y de `CURRICULUM_PATH`, como el inglés A2 U13–U17, B1 y B2.

| Nivel | #   | Unidad                         | Gramática principal                                                                       | Palabras |
| ----- | --- | ------------------------------ | ----------------------------------------------------------------------------------------- | -------- |
| A1    | 13  | Profesiones y trabajo          | nós, eles, elas, vocês, _a gente_; ser y -ar en plural; nosso / nossa                     | 18       |
| A1    | 14  | ¿Cómo estás? Estados y descr.  | estar (estou), _estar com fome / sede_, ser vs. estar, concordancia, pouco / mas          | 17       |
| A1    | 15  | Fechas, meses y clima          | la fecha (_dia 5 de maio_), em + mes, _faz calor / frio_, chove                           | 19       |
| A1    | 16  | Transporte y tiempo libre      | _ir de ônibus / a pé_, ao / à, pelo / pela, fazer (faço, fazemos), vamos / vão            | 17       |
| A2    | 1   | ¿Qué hiciste el fin de semana? | Perfeito regular (-ei / -ou, -i / -eu, -i / -iu), já, ainda não                           | 17       |
| A2    | 2   | Viajes                         | Perfeito irregular: fui / foi, fiz / fez, tive, estive; conhecer                          | 16       |
| A2    | 3   | Restaurantes y hospedaje       | Pedidos corteses: _gostaria de_, _poderia_; pagar, propina, reservar                      | 16       |
| A2    | 4   | Cuando era chico               | Imperfeito (morava, comia; era, tinha, ia), costumava                                     | 16       |
| A2    | 5   | ¿Qué pasó? Contar un hecho     | Imperfeito (escena) vs. perfeito (hecho), _estava + gerundio_, conectores                 | 16       |
| A2    | 6   | Planes e invitaciones          | Futuro próximo (_vou viajar_), invitar / aceptar / rechazar (_topa?_, _bora_, _que pena_) | 16       |
| A2    | 7   | Trabajo y estudios             | Futuro do presente en lo formal (será, terá), _pretender_, _formar-se_                    | 16       |
| A2    | 8   | Salud y bienestar              | _Estar com dor de_, imperativo (tome, beba, descanse, evite; _não coma_)                  | 16       |
| A2    | 9   | Compras y servicios            | Comparativos (_mais… do que_, _tão… quanto_), melhor / pior / maior / menor, superlativo  | 16       |
| A2    | 10  | Tecnología y comunicación      | Pronombres de objeto en Brasil (_te ligo_, _me manda_; _eu o conheço_ / _vi ele_)         | 16       |
| A2    | 11  | Rutina y cuidados              | Reflexivos (_me levanto_, _se deita_), _tomar banho_, frecuencia, _há / faz_ + tiempo     | 16       |
| A2    | 12  | Opiniones y problemas          | _Acho que_, concordo / discordo, _se_ + presente, _se der_, _se você quiser_; reclamos    | 16       |

Cada unidad: objetivo comunicativo, gramática con ejemplos, 5 lecciones escritas y el camino de siempre
(`content/path.ts`): L1 · L2 · Repaso · L3 · L4 · Repaso · L5 · Escucha · Palabras · Repaso final =
**10 lecciones por unidad, 160 en total** (80 escritas, 80 de repaso generadas con `unitWordsOnly`).
Cada lección escrita: introducción con dos ejemplos, 8–10 ejercicios, al menos una escucha, los dos
últimos de producción y 2 cierres «Ahora podés…».

**Diferencias con el español trabajadas a propósito** (en explicaciones y distractores): falsos amigos
(_escritório, motorista, chato, mala, sobremesa, brincar, perceber, pretender, vaga, prova, costas,
calça, tênis, ligar, apagar, desligar, tela, academia, aniversário, criança, pelo, que pena_), género
(_a viagem_), contracciones (do, da, no, na, ao, à, pelo, pela, numa), conjugaciones (perfeito vs.
imperfeito, imperativo con _você_), verbos que no son reflexivos (_tomar banho, acordar_), _ir de_ +
transporte, _estar com fome_ (≠ «tener hambre»), _gostar de_, la colocación brasileña de los pronombres
y el registro (_a gente_, _tô_, _cadê_, _bora_, _topa?_, _zap_).

### Vocabulario

- **264 palabras nuevas** (A1 71, A2 193), con traducción al español, ejemplo y unidad; ids `pt-…` nuevos.
  Sin IPA, como el piloto de portugués.
- **Vocabulario de apoyo: 449 formas** (A1 39, A2 410), declarado por unidad en `support`: formas que usan
  los textos, audios y frases sin ser palabras practicadas (conjugaciones de verbos ya vistos, _pizza,
  hotel, táxi, feijão, arroz, empresa, banco_…). No entran a los repasos. El A2 necesita más apoyo que el
  inglés B1 porque el piloto enseña pocas formas (~315) y el portugués tiene mucha morfología verbal.

### Ejercicios

| Escritos (778)       |     | Generados en los repasos (799) |     |
| -------------------- | --- | ------------------------------ | --- |
| `fill_blank`         | 159 | `listen_choice`                | 238 |
| `context_choice`     | 144 | `translate_write`              | 133 |
| `translation_choice` | 126 | `translation_choice`           | 111 |
| `listen_choice`      | 80  | `fill_blank`                   | 86  |
| `short_answer`       | 80  | `match_pairs`                  | 79  |
| `translate_write`    | 80  | `complete_word`                | 73  |
| `order_words`        | 57  | `short_answer`                 | 47  |
| `image_choice`       | 32  | `order_words`                  | 32  |
| `match_pairs`        | 20  |                                |     |

**Sin tipos nuevos.** Los diálogos contextualizados son `context_choice` (audio) y `listen_choice`.

### Textos y audios

**57 estímulos** con 144 preguntas `context_choice`, al menos un audio y un texto por unidad:

- A1 (12, ~30 palabras de media): 5 audios (diálogos y una llamada) y 7 textos (publicaciones, un
  mensaje, un aviso, un cartel de la escuela, indicaciones para llegar). Velocidad 0.85.
- A2 (45, ~39 palabras de media): 21 audios (conversaciones, consultorio, llamadas a servicios,
  entrevista de trabajo y de radio, podcast, mensajes de voz, anuncio del aeropuerto) y 24 textos
  (publicaciones, mensajes y grupos, correos formales, avisos, carta de restaurante, postal, folleto
  de posada, indicaciones de un remedio, descripción). Velocidad 0.9.

Contextos brasileños: feijoada, pão de queijo, churrasco, acarajé, Festa Junina, Pix, los 10 % de
servicio, cuotas sin interés, WhatsApp («zap») y sus audios, la pousada, el clima del hemisferio sur.
Personajes ficticios con nombre de pila; ningún dato de contacto.

### Escritura (`content/pt/writing.ts`)

20 tareas con el sistema existente (`shared/writing.ts`: sin IA, en el dispositivo, no se guarda):

- **A1, 6 guiadas**: presentarse (piloto U2), la familia (U4), la casa (U6), la rutina (U8), el trabajo
  (U13) y un mensaje para salir (U16). **1 libre** al terminar el A1 (U16, repaso final).
- **A2, 11 guiadas**: el fin de semana (U1), un viaje (U2), un correo para reservar (U3), la infancia (U4),
  algo que te pasó (U5), invitar y responder (U6), un correo formal para una pasantía (U7), consejos de
  salud (U8), recomendar una tienda (U9), un mensaje por un problema con el celular (U10) y tu opinión
  (U12). **2 libres**: organizar un viaje (U6, repaso final) y un día que no olvidás (U12, repaso final).

Las tareas del piloto (U2–U8) aparecen al terminar lecciones ya publicadas: viajan con la app, así que
se ven recién con una build nueva. Único cambio en la app: la etiqueta del campo de texto
(`WritingTask.tsx`) dice el idioma de la tarea («Tu texto en portugués») en vez de «en inglés».

## 3. Cómo se integra (sin tocar lo publicado)

- `content/pt-course.ts` arma `PT_PATH` (A1 U13–U16 + A2 U1–U12). El piloto (`content/pt/a1/unit01…12`)
  no cambió: su consolidación, ids y vínculos son los mismos (`identity.test.ts`).
- **Ids**: 1235 ítems registrados con `npm run content:ids` (registro 6763 → 7998: 778 escritos sorteados
  y 457 generados). Ningún ítem cargado cambió de identidad.
- **Vínculos**: sólo palabras del piloto (publicadas) y propias. No enlaza nada del inglés: publicar el
  portugués no depende de ninguna publicación del inglés.
- **Migración de carga** `supabase/migrations/20261126120000_pt_a1_a2.sql` (`npm run content:pt -- <archivo>`),
  con la plantilla _add-only_ de la fase C.3 sin modificarla. **Sin cambios de esquema** (el CHECK de nivel
  ya admite A1 y A2). Todo nace `is_published = false` y los ítems en `draft`. Sin `delete`, funciones, RLS,
  rutas ni desbloqueo. SHA-256 `aa16bcb7…7acad26`, igual en dos corridas. **No aplicada.**
- Ranked, SRS, Mastery, Adaptive y Learning Machine: sin cambios.

## 4. Validación (`content/pt-checks.ts`)

La usan la prueba de Jest y el generador (que no escribe si hay problemas). Reglas del inglés B1/B2
adaptadas al portugués:

- Estándar de lección, ids propios, 14–20 palabras por unidad, objetivo y gramática declarados, draft.
- Palabras: ids nuevos `pt-`, traducción y ejemplo; ningún texto repite otro ni coincide con la traducción
  de otra palabra (salvo cognados); todas se practican.
- **Vocabulario**: todo el portugués (respuestas, opciones, audio, estímulos, ejemplos, gramática y repasos
  generados) usa formas enseñadas antes (el piloto entero, las unidades nuevas anteriores y su apoyo),
  palabras ya introducidas en la unidad, nombres declarados o el apoyo de la unidad. Acepta el plural y
  el femenino regulares de lo enseñado (_cansadas, lições, azuis, professoras_); las formas verbales
  nuevas se enseñan o se declaran.
- **Corrección del servidor** (`gradeWithSpec`): respuesta y aceptadas correctas, distractores no,
  opciones sin repetir **también sin tildes** (_saí / sai_, _às / as_ cuentan como iguales).
- `context_choice` sin `words` (SRS v1), con conceptos, pregunta con «?», explicación con la evidencia,
  audio entre 0.75 y 0.9. Repasos generados sin traducir cognados.
- Escritura: el modelo cumple sus requisitos, la lección existe y el modelo y las preguntas guía usan
  vocabulario enseñado hasta esa lección (para las del piloto, hasta esa unidad del piloto).

## 5. Pruebas

| Prueba                                              | Qué comprueba                                                                                      |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `content/__tests__/pt.test.ts` (23)                 | Reglas, camino, tipos, gramática por unidad, longitud de textos, velocidad, registro, corrección,  |
|                                                     | carga y publicación exactas, mutaciones del validador, escritura                                   |
| `content/__tests__/*` (5907 en total)               | Identidad de ítems (piloto incluido), registro de ids, catálogo, versiones, conjuntos de opciones  |
| `supabase/tests/ptContent.test.mjs` (8, en PGlite)  | Carga exacta, sin cambios de esquema, add-only, reaplicable, aborta si una fila difiere, invisible |
|                                                     | En la base desechable: publica, idempotente, sólo filas propias, juega las 160 lecciones           |
| `items`, `learning`, `versions`, `presentations`, … | Incluyen `PT_PATH` y la migración nueva en sus listas                                              |

## 6. Publicación (preparada, sin ejecutar)

`supabase/pending/20261127120000_publish_pt_a1_a2.sql` (`npm run content:pt-publish -- <archivo>`): mismo
mecanismo que las publicaciones del inglés. Comprueba que las filas sean exactamente las de la carga (de
portugués A1 U13–U16 / A2 U1–U12), las publica, activa los conceptos y 1091 ítems y deja los 144
`context_choice` en `draft` (D4). Sólo `UPDATE` de estado, idempotente. SHA-256 `5b98cfab…c3eedc`
(regenerar si cambia la carga). Vive en `pending/` para que nadie la aplique con el lote.

Orden para publicar (al final, junto con el resto):

1. Tener en las tiendas (y como mínima en uso) una build que reconozca `context_choice` y traiga la
   escritura de portugués (la build local actual lo hace).
2. Aplicar las migraciones pendientes en orden; como mínimo `20261113120000_context_comprehension.sql` y
   `20261126120000_pt_a1_a2.sql`.
3. Mover `pending/20261127120000_publish_pt_a1_a2.sql` a `migrations/`, correr `npm run test:db` y aplicarla.
4. Comprobar: 16 unidades publicadas; `pt-a2-u01-l01` abierta; `pt-a1-u13-l01` se abre al terminar
   `pt-a1-u12-final`; una lección se completa en la app.

Efectos al publicar (sin cambios en los motores):

- **Ranked**: usa palabras publicadas de A1 y A2 (`rush_levels`); las palabras nuevas del portugués
  entrarían a su Ranked. Revisarlo antes de publicar si se quiere limitar.
- **Repasos (SRS v1)**: los 1091 ítems activos entran como candidatos cuando el alumno practicó su
  palabra; los de comprensión no. SRS v2, Mastery y Adaptive siguen apagados.
- **Nivel inicial**: `shared/languages.ts` sigue ofreciendo sólo A1 para portugués. Ofrecer A2 como nivel de
  inicio es una decisión de producto aparte.

**Revisión humana recomendada (no bloquea)**: que un hablante de portugués de Brasil lea los textos,
audios, modelos de escritura y el registro informal. No hubo revisión nativa.

## 7. Archivos

Nuevos: `content/pt-course.ts`, `content/pt-checks.ts`, `content/pt/helpers.ts`, `content/pt/writing.ts`,
`content/pt/a1/extra.ts`, `content/pt/a1/unit13…16-*.ts`, `content/pt/a2/index.ts`,
`content/pt/a2/unit01…12-*.ts`, `content/__tests__/pt.test.ts`, `scripts/build-pt-sql.ts`,
`scripts/build-pt-publish-sql.ts`, `supabase/migrations/20261126120000_pt_a1_a2.sql`,
`supabase/pending/20261127120000_publish_pt_a1_a2.sql`, `supabase/tests/ptContent.test.mjs`, este documento.

Modificados: `content/comprehension.ts` (registro), `content/writing.ts` (tareas de portugués),
`content/ids.lock.json` (1235 ids nuevos), `package.json` (`content:pt`, `content:pt-publish`),
`src/features/learning/components/WritingTask.tsx` (etiqueta por idioma),
`content/__tests__/comprehension.test.ts` y `planned.test.ts` (composición del registro),
`supabase/tests/items`, `learning`, `versions`, `presentations`, `planned`, `legacyReviewRetirement` y
`a2Publish.test.mjs` (tramos y lista de migraciones; el fixture de `learning.test.mjs` pasó de `pt / A2 / 1` a la posición 99 porque esa posición ahora es real, y `items.test.mjs` cuenta los ítems nuevos en portugués), `docs/LEARNING_CURRICULUM.md`.
