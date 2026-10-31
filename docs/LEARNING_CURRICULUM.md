# Currículo de inglés A1 y A2

Referencia: niveles A1 y A2 del MCER. Completar unidades **no** equivale a una certificación oficial.

Cada nivel es un camino propio (`content/a1/`, `content/a2/`, ensamblados en `content/index.ts`): el desbloqueo es lineal dentro del nivel y cada nivel arranca desbloqueado (`is_lesson_unlocked` particiona por idioma y nivel). En Aprender, un selector A1/A2 muestra un camino por vez; arranca en el nivel de inicio del perfil (`start_level`). El A2 supone el A1: sus ejercicios pueden usar todas las palabras del A1.

## Estado del contenido

### A1

| #   | Unidad                                                                   | Lecciones | Estado                |
| --- | ------------------------------------------------------------------------ | --------- | --------------------- |
| 1   | Saludos y presentaciones                                                 | 5         | ✅ cargada (borrador) |
| 2   | Pronombres y verbo _to be_                                               | 5         | ✅ cargada (borrador) |
| 3   | Números, edades y países                                                 | 5         | ✅ cargada (borrador) |
| 4   | Familia y personas (_his/her/our/their_, _have/has_)                     | 5         | ✅ cargada (borrador) |
| 5   | Objetos cotidianos (_a/an_, _this/that/these/those_, colores)            | 5         | ✅ cargada (borrador) |
| 6   | Casa y habitaciones (_there is/are_, preposiciones de lugar)             | 5         | ✅ cargada (borrador) |
| 7   | Comida y bebidas (_want_, _eat/drink_, _hungry/thirsty_)                 | 5         | ✅ cargada (borrador) |
| 8   | Rutinas y presente simple (_-s_, _do/does_, _don't/doesn't_, frecuencia) | 5         | ✅ cargada (borrador) |
| 9   | Horarios y días (días, _o'clock_, _half past_, _at/on/in_)               | 5         | ✅ cargada (borrador) |
| 10  | Lugares de la ciudad (lugares, _near/far_, indicaciones)                 | 5         | ✅ cargada (borrador) |
| 11  | Gustos y preferencias (_like/love/hate_, _can_, _favorite_)              | 5         | ✅ cargada (borrador) |
| 12  | Preguntas y conversaciones básicas (_what/when/why/which/how much/many_) | 5         | ✅ cargada (borrador) |

Totales A1: 12 unidades · 60 lecciones escritas (120 con la consolidación) · 244 palabras · 1057 ejercicios (verificado con checksum md5 contra Supabase, 2026-10-30).

### A2

| #   | Unidad                                                                 | Lecciones | Estado      |
| --- | ---------------------------------------------------------------------- | --------- | ----------- |
| 1   | El pasado de _to be_ (_was/were_, _yesterday_, _ago_)                  | 5         | ✅ borrador |
| 2   | Pasado simple regular (_-ed_, _did/didn't_, _then/after_)              | 5         | ✅ borrador |
| 3   | Pasado simple irregular (_went, had, saw, bought…_)                    | 5         | ✅ borrador |
| 4   | Viajes y vacaciones (transporte, aeropuerto, _by_ + transporte)        | 5         | ✅ borrador |
| 5   | Presente continuo (_am/is/are + -ing_, ahora vs. rutina)               | 5         | ✅ borrador |
| 6   | Ropa y compras (_wear_, talles, precios, pagar)                        | 5         | ✅ borrador |
| 7   | Comparativos y superlativos (_-er/more than_, _the -est/most_, _same_) | 5         | ✅ borrador |
| 8   | Futuro (_going to_, _will/won't_, _maybe/probably_)                    | 5         | ✅ borrador |
| 9   | Salud y cuerpo (partes del cuerpo, _hurt_, _should/shouldn't_)         | 5         | ✅ borrador |
| 10  | Trabajo y obligaciones (profesiones, _have to_, _must/mustn't_)        | 5         | ✅ borrador |
| 11  | El clima y las estaciones (tiempo, estaciones, pronóstico)             | 5         | ✅ borrador |
| 12  | Experiencias: presente perfecto (_have you ever_, _already/yet/just_)  | 5         | ✅ borrador |

Totales A2: 12 unidades · 60 lecciones escritas (120 con la consolidación) · 241 palabras · 1047 ejercicios. Migraciones `…_content_a2_unit_NN.sql`.
Todo el contenido tiene `review_status = 'draft'`: fue redactado sin revisión editorial humana (las unidades 1–3 tuvieron además una revisión lingüística automática/asistida el 2026-10-30). Antes del lanzamiento, una persona con dominio del inglés debe revisarlo (traducciones, IPA, ejemplos) y marcarlo `reviewed`.

Retoques puntuales a unidades ya cargadas pueden ir en una migración chica de `UPDATE` (ver `…_content_a1_text_fixes.sql`) en vez de regenerar la unidad: el resultado debe ser idéntico al de regenerarla, y se verifica con el checksum.

## Flujo de autoría

0. **Unidades ya cargadas:** antes de editar, `npm run content:dump -- antes.json` (foto del contenido actual).
1. Editar `content/<nivel>/unitNN-*.ts` (formato tipado en `content/types.ts`, atajos en `content/builders.ts`).
2. `npm test`: `content/__tests__/content.test.ts` valida cada ejercicio (ver abajo).
3. Unidades ya cargadas: `npm run content:diff -- antes.json supabase/migrations/<timestamp>_content_<cambio>.sql` genera sólo la diferencia (palabras y ejercicios cambiados) y **corrige los vínculos ejercicio→palabra con `UPDATE`**, sin `DELETE`. Usar esto y no `content:sql`: como los ids de ejercicios generados son posicionales, regenerar la unidad dejaría el vínculo viejo y los repasos se acreditarían a la palabra equivocada. Falla con un mensaje si el cambio no se puede expresar así (altas o bajas de lecciones o palabras, un ejercicio que pierde palabras).
   Unidades nuevas: `npm run content:sql -- supabase/migrations/<timestamp>_content_a2_unit_NN.sql --level A2 --unit NN` genera una migración idempotente por unidad (más chica y fácil de aplicar; aplicar en orden de unidad). Sin `--level`, `--unit` se refiere al A1.
   La consolidación de cada nivel sólo considera las palabras de ese nivel y los anteriores: agregar un nivel no cambia lo generado (ni lo cargado) de los anteriores.
4. Aplicar la migración y renombrar el archivo con la versión que registre Supabase. Los ejercicios retirados se **despublican** (no se borran) para conservar el historial de intentos.
5. Ninguna migración contiene sentencias destructivas. `supabase/tests/learning.test.mjs` verifica que la base que dejan todas las migraciones es idéntica a `content/` (incluidos los vínculos) y que reaplicar la última migración de contenido no cambia nada.

### Validaciones automáticas del contenido

- Consolidación generada: no traduce cognados (hotel → hotel; sólo se practican de oído), la consigna de «Traducí al inglés» va sin aclaraciones entre paréntesis y acepta las otras formas en inglés de la palabra (`acceptedTexts`, p. ej. _a lot_ para «mucho»).

- Unidades con 5–8 lecciones; lecciones con 6–10 ejercicios.
- IDs de palabras únicos; cada palabra con IPA, traducción y ejemplos; cada palabra practicada en al menos un ejercicio.
- Los ejercicios sólo usan palabras de su unidad o de unidades anteriores.
- Opciones únicas que incluyen la respuesta; huecos `___` únicos; máscaras de ortografía coherentes; parejas sin repetidos; fichas de "ordenar" iguales a la respuesta.
- La respuesta canónica y cada variante aceptada pasan el validador real de la app (`shared/answers.ts`).
- Ninguna palabra inglesa coincide con la traducción de otra (con o sin tildes ni paréntesis): evita preguntas ambiguas en Word Rush y en el widget (p. ej. _café_ el lugar vs. "café" = _coffee_).

## Tipos de ejercicio (`shared/exercises.ts`)

| Tipo                 | Habilidad                | Respuesta                                                |
| -------------------- | ------------------------ | -------------------------------------------------------- |
| `image_choice`       | vocabulario              | opción (imagen = emoji)                                  |
| `translation_choice` | vocabulario              | opción                                                   |
| `translate_write`    | traducción               | texto                                                    |
| `complete_word`      | vocabulario (ortografía) | texto, sin tolerancia a errores                          |
| `fill_blank`         | gramática / vocabulario  | opción (cubre "completar frase" y "palabra en contexto") |
| `order_words`        | construcción de frases   | fichas                                                   |
| `listen_choice`      | comprensión auditiva     | opción                                                   |
| `match_pairs`        | vocabulario              | parejas                                                  |
| `short_answer`       | construcción de frases   | texto con variantes explícitas                           |

Audio: voz sintetizada del sistema (`expo-speech`, en-US). La app lo indica como "voz sintetizada"; no son grabaciones de hablantes nativos.

## Validación de respuestas (`shared/answers.ts`)

- Se ignoran mayúsculas, espacios extra, comas, `¿¡` y la puntuación final; se unifican apóstrofos tipográficos.
- **Las tildes cuentan.**
- Contracciones: sólo una lista cerrada es equivalente (`I'm` = `I am`, `isn't` = `is not`, y para el A2 `didn't`, `won't`, `I'll`, `haven't`, `I've`, `shouldn't`, …). `he's`/`she's` se expanden siempre a _is_: en presente perfecto, listar la forma larga en `accepted_answers`.
- Tolerancia a errores de tipeo: distancia de edición 1, sólo en respuestas escritas de ≥ 8 caracteres y nunca en `complete_word`. La app avisa "Ojo con la ortografía" y muestra la forma correcta.
- Fuera de eso, se aceptan sólo la respuesta y las variantes listadas en `accepted_answers`.

## Lecciones

- Los errores vuelven al final de la cola ("Repaso de errores"), con un máximo de 2 reintentos por ejercicio.
- La precisión se mide sobre el **primer intento** de cada ejercicio.
- Desbloqueo lineal: cada lección requiere la anterior completada (regla en cliente y servidor: `is_lesson_unlocked`).
- Al terminar, la sesión se envía con un id generado en el cliente (idempotente: reintentar no duplica).

## Repetición espaciada (`shared/srs.ts` ↔ `public.srs_config()`)

- Etapas: 0 = nueva/fallada → 1 → 2 → 3 (dominada). Intervalos tras subir de etapa: 1, 3 y 7 días; mantenimiento cada 21.
- Un acierto sólo sube de etapa si el repaso estaba **vencido** (o es la primera vez). Acertar varias veces el mismo día no acelera el dominio.
- Un fallo vuelve a la etapa 0 y deja la palabra para repasar inmediatamente; también quita el estado "dominada".
- Por sesión se aplica un único resultado por palabra: correcto sólo si todos sus primeros intentos lo fueron.
- Un test SQL verifica que `srs_config()` coincide con `shared/srs.ts`.

## Repasos

Ejercicios generados de forma determinista a partir de las palabras vencidas (hasta 10, primero las más falladas): rotan elegir traducción, escuchar y escribir en inglés. Los distractores salen del banco de palabras publicadas.
