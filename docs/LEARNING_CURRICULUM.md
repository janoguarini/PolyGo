# Currículo de inglés A1

Referencia: nivel A1 del MCER. Completar unidades **no** equivale a una certificación oficial.

## Estado del contenido

| # | Unidad | Lecciones | Estado |
| --- | --- | --- | --- |
| 1 | Saludos y presentaciones | 5 | ✅ cargada (borrador) |
| 2 | Pronombres y verbo *to be* | 5 | ✅ cargada (borrador) |
| 3 | Números, edades y países | 5 | ✅ cargada (borrador) |
| 4 | Familia y personas | — | planificada |
| 5 | Objetos cotidianos | — | planificada |
| 6 | Casa y habitaciones | — | planificada |
| 7 | Comida y bebidas | — | planificada |
| 8 | Rutinas y presente simple | — | planificada |
| 9 | Horarios y días | — | planificada |
| 10 | Lugares de la ciudad | — | planificada |
| 11 | Gustos y preferencias | — | planificada |
| 12 | Preguntas y conversaciones básicas | — | planificada |

Totales actuales: 15 lecciones · 64 palabras · 119 ejercicios.
Todo el contenido tiene `review_status = 'draft'`: fue redactado sin revisión editorial humana. Antes del lanzamiento, una persona con dominio del inglés debe revisarlo (traducciones, IPA, ejemplos) y marcarlo `reviewed`.

## Flujo de autoría

1. Editar `content/a1/unitNN-*.ts` (formato tipado en `content/types.ts`, atajos en `content/builders.ts`).
2. `npm test`: `content/__tests__/content.test.ts` valida cada ejercicio (ver abajo).
3. `npm run content:sql -- supabase/migrations/<timestamp>_content_….sql` genera una migración idempotente.
4. Aplicar la migración. Los ejercicios retirados se **despublican** (no se borran) para conservar el historial de intentos.

### Validaciones automáticas del contenido

- Unidades con 5–8 lecciones; lecciones con 6–10 ejercicios.
- IDs de palabras únicos; cada palabra con IPA, traducción y ejemplos; cada palabra practicada en al menos un ejercicio.
- Los ejercicios sólo usan palabras de su unidad o de unidades anteriores.
- Opciones únicas que incluyen la respuesta; huecos `___` únicos; máscaras de ortografía coherentes; parejas sin repetidos; fichas de "ordenar" iguales a la respuesta.
- La respuesta canónica y cada variante aceptada pasan el validador real de la app (`shared/answers.ts`).

## Tipos de ejercicio (`shared/exercises.ts`)

| Tipo | Habilidad | Respuesta |
| --- | --- | --- |
| `image_choice` | vocabulario | opción (imagen = emoji) |
| `translation_choice` | vocabulario | opción |
| `translate_write` | traducción | texto |
| `complete_word` | vocabulario (ortografía) | texto, sin tolerancia a errores |
| `fill_blank` | gramática / vocabulario | opción (cubre "completar frase" y "palabra en contexto") |
| `order_words` | construcción de frases | fichas |
| `listen_choice` | comprensión auditiva | opción |
| `match_pairs` | vocabulario | parejas |
| `short_answer` | construcción de frases | texto con variantes explícitas |

Audio: voz sintetizada del sistema (`expo-speech`, en-US). La app lo indica como "voz sintetizada"; no son grabaciones de hablantes nativos.

## Validación de respuestas (`shared/answers.ts`)

- Se ignoran mayúsculas, espacios extra, comas, `¿¡` y la puntuación final; se unifican apóstrofos tipográficos.
- **Las tildes cuentan.**
- Contracciones: sólo una lista cerrada es equivalente (`I'm` = `I am`, `isn't` = `is not`, …).
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
