# Estándar de contenido para varios idiomas

Cómo se organiza y se escribe el contenido de Polygo para inglés, italiano, portugués de Brasil y chino mandarín (siempre desde español). El español como idioma a aprender queda «Próximamente»: necesita la interfaz traducida al inglés.

## Estado (2026-11-02, bloque 1)

| Idioma         | Variante              | Estado (`shared/languages.ts` ↔ `languages.content_status`) | Ranked | Contenido                                                                |
| -------------- | --------------------- | ----------------------------------------------------------- | ------ | ------------------------------------------------------------------------ |
| Inglés         | General americano     | `available`                                                 | Sí     | A1 y A2 completos (borrador); unidades 1–4 de A1 ya siguen este estándar |
| Italiano       | Estándar              | `beta` (sólo testers)                                       | No     | A1 unidades 1–4 de 12 (borrador)                                         |
| Portugués      | Brasil                | `beta` (sólo testers)                                       | No     | A1 unidades 1–4 de 12 (borrador)                                         |
| Chino mandarín | Simplificado + pinyin | `beta` (sólo testers)                                       | No     | A1 unidades 1–4 de 12 (borrador)                                         |
| Español        | Neutro con _tú_       | `soon`                                                      | No     | Sin contenido: requiere i18n de la interfaz                              |
| Francés        | —                     | `hidden` (fuera del selector)                               | No     | Sin contenido                                                            |

**Todo el contenido nuevo está redactado sin revisión de hablantes nativos** (`review_status = 'draft'`). Antes de pasar un idioma a `available` hace falta revisión lingüística de cada unidad (`UnitDef.review`).

## Estructura

```
content/<idioma>/<nivel>/unitNN-*.ts      (content/en/a1, content/it/a1, …)
content/index.ts                          COURSES: idioma → niveles → unidades
```

- IDs: palabra `<idioma>-<slug>`. Unidad, lección y ejercicio llevan prefijo de idioma (`it-a1-u01-l01-e01`) salvo inglés, que conserva los históricos (`a1-u01-…`) para no perder progreso.
- Cada unidad: 5 lecciones escritas + 5 de consolidación generadas (`content/path.ts`) = 10 en el camino.
- Por nivel: 12 unidades (`PLANNED_UNITS_PER_LEVEL`). Si faltan, el camino muestra «Más unidades en camino» y el nivel no se da por completo.
- Migración por unidad: `npm run content:sql -- supabase/migrations/<ts>_content_it_a1_unit_02.sql --language it --level A1 --unit 2`.

## Unidad (`UnitDef`)

- `objective`: objetivo comunicativo («Podés…»).
- `grammar`: estructura principal con explicación y ejemplos, cuando corresponde.
- `words`: 15–22 palabras o frases hechas (chunks). Todas entran al repaso espaciado vía `exercise_words`. La gramática se repasa a través de chunks (_mi chiamo_, _我叫_).
- `review`: `draft | in_review | reviewed`, revisor y notas.
- **Completada**: las 10 lecciones del camino (regla actual de desbloqueo).

## Lección (`LessonDef`, 7–10 ejercicios)

1. **Introducción** (`intro`, no puntúa): explicación de 1–3 frases y ≥2 ejemplos naturales con audio.
2. **Reconocimiento**: elegir, escuchar, unir.
3. **Práctica guiada**: completar, ordenar.
4. **Recuperación activa**: las dos últimas son de producción sin opciones (`translate_write`, `short_answer`).
5. **Cierre** (`takeaways`): 2–3 frases «Ahora podés…» en los resultados.

Reglas que valida `content/__tests__/content.test.ts`: lo anterior, ≥1 ejercicio de escucha por lección, cada palabra practicada, sólo palabras ya vistas, ids con prefijo, pinyin con tonos en chino y lectura para todo carácter chino.

Para agregar ejercicios a una unidad **ya cargada**, ponelos al final con `consolidate: false`: los ids anteriores y las lecciones de consolidación no cambian. Por eso las lecciones de inglés completadas pueden tener hasta 12 ejercicios.

Las partículas de tono neutro del chino (吗, 的) llevan la etiqueta `particle`: no se traducen ni se escuchan sueltas en la consolidación.

## Chino

- `text` en caracteres; `romanization` en pinyin con marcas de tono. El pinyin se muestra encima de los caracteres (`shared/readings.ts`; se oculta con el botón «pīn»). Nombres propios y ejemplos fuera del vocabulario van en `EXTRA_READINGS`.
- Nunca se pide escribir caracteres: se escribe pinyin (`ni3 hao3` = `nǐ hǎo`; sin tono es incorrecto) y se arman oraciones con fichas (`我 叫 王明。` → respuesta sin espacios).
- Los tonos se practican con `listen_choice`: se escucha la palabra y se elige el pinyin con el tono correcto.

## Interfaz

- Perfil → idiomas: tocar uno disponible cambia el idioma (`set_target_language`). El progreso es por idioma (ids propios).
- Aprender: nombre del idioma, «BETA» y unidades faltantes.
- Ranked: sólo en idiomas con `ranked: true`; en el resto, aviso (también si se entra por link o invitación).
- Voz: la del sistema en el locale del idioma (`en-US`, `it-IT`, `pt-BR`, `zh-CN`). Puede faltar en algunos Android.

## Plan de producción

1. ✅ Estandarizar el modelo (esta etapa).
2. ⏳ Validar la unidad piloto en los cuatro idiomas: pruebas en dispositivo + revisión nativa de cada unidad 1.
3. A1 por bloques de 3 unidades por idioma, con revisión nativa de cada bloque antes del siguiente. ✅ Bloque 1 (U2–4) redactado; ⏳ bloques 2–4 (U5–12).
4. A2 por bloques. Ranked de un idioma se habilita con su A1 completo y revisado.
5. Revisión de calidad: progresión, consignas, errores frecuentes por ejercicio (`exercise_attempts`).
6. B1: sólo preparar (ampliar el CHECK de `level` / `start_level` cuando toque).

La matriz de unidades por idioma está en el plan aprobado (conversación del 2026-11-02) y se baja a archivos bloque por bloque.
