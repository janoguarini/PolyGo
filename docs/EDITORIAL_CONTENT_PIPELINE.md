# Contenido editorial — arquitectura y flujo de incorporación (P9)

Estado (2026-11-08): **la arquitectura existe y está integrada; el contenido no.** No se generaron
objetivos, conceptos gramaticales, textos de lectura ni audios: este documento cierra la decisión P9
de `LEARNING_PHASE4.md` §10 describiendo cómo se incorpora contenido **real y validado**, sin
inventarlo para llenar tablas.

## 1. Qué ya está construido

| Pieza                    | Esquema (migración)                                                                                                       | Autoría (`content/`)                | Quién lo usa hoy                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Objetivos                | `learning_objectives`, `objective_concepts`, `lesson_objectives`, `item_objectives` (20261107160000)                      | `objectives.ts` (`ObjectiveDef`)    | Adaptive: tope de R5 por objetivo `core`; AL17: lección `introduce` de la explicación. **Tablas vacías**          |
| Conceptos                | `concepts` (`kind`: lexical, grammar, phonology, orthography, pragmatic), `ref_concept_kinds` (20261107120000)            | Léxicos generados de las palabras   | SRS v2, motor, repasos: **sólo léxicos** (1 107)                                                                  |
| Dimensiones              | `ref_polygo_dimensions`: vocabulary, grammar, comprehension, production                                                   | —                                   | Vocabulario y producción con filas `target`; gramática y comprensión sin conceptos                                |
| Ítems y versiones        | `exercise_items`, `exercise_item_versions` (inmutables), `item_concepts` (target/support por dimensión), option sets      | `catalog.ts`, `versions.ts`, `option-sets.ts` | Lecciones (fase 2) y repasos del servidor (fases 3–4)                                                    |
| Corrección               | `ref_grading_modes`: exact_option.v1, normalized_text.v1, pair_set.v1                                                     | `shared/grading.ts`                 | Lecciones y repasos. Producción libre: sin modo (`FREE_PRODUCTION_GRADING_SPEC.md`)                              |
| Personas ficticias       | `content_personas` (20261107180000)                                                                                       | `personas.ts`                       | Privacidad de respuestas (`responsePrivacyOf`)                                                                    |

El servidor ya filtra por **tipo de concepto y dimensión**, no por tipo de ejercicio: un concepto
gramatical o un ítem de comprensión correctamente catalogado entra en el SRS v2 y en el motor por la
misma vía, sin código nuevo en el armador. Lo que falta para los repasos es un punto de la RPC de
repasos (§4.3).

## 2. Principio

Una fila editorial se carga sólo si tiene **autor, revisión y fuente**. Nada se deduce
automáticamente de textos de la interfaz (`UnitDef.objective`, `LessonDef.objective` son «Podés…» sin
actividad del MCER, conceptos ni roles) ni se traduce entre idiomas sin una equivalencia editorial
(`group_key`).

## 3. Flujo de incorporación (para todo tipo de contenido)

```
1. Propuesta        content/<tipo>.ts en una rama, status 'draft'
2. Validación       npm test (content/__tests__: identidad, catálogo, objetivos, versiones) — bloqueante
3. Revisión         pedagógica (objetivo, nivel, actividad) + nativa (it/pt/zh) — registrada en el PR
4. Generación       npm run content:catalog -- <migración nueva> --language <xx> [--exclude-loaded …]
                    (genera SQL determinista; aborta si cambia idioma, nivel o actividad, o si se quita
                    una relación: quitar exige una migración escrita a mano)
5. Prueba de base   npm run test:db (PGlite con todas las migraciones)
6. Producción       con autorización: aplicar la migración; status 'draft' → 'active' en otra migración
                    después de la revisión (el servidor sólo usa objetivos 'active')
```

Reglas comunes: ids estables (`content/ids.lock.json` impide reutilizarlos), versiones inmutables
(un cambio de enunciado, opciones o respuesta es una versión nueva), sin `DELETE` en migraciones
generadas, y `active` sólo después de la revisión.

## 4. Por tipo de contenido

### 4.1 Objetivos de aprendizaje

Por objetivo (`ObjectiveDef`, validado por `objectiveProblems`):

1. Id `<idioma>.<nivel>.obj.<slug>` y posición.
2. Actividad del MCER (`listening`, `reading`, `speaking`, `writing`, `interaction`, `mediation`).
3. `canDo` («Podés…»), y si se quiere `description` y el descriptor `cefrRef`.
4. Conceptos `core` / `support` (existentes en el catálogo y del mismo idioma).
5. Lecciones con rol (`introduce`, `practice`, `consolidate`, `assess`) e ítems que lo evalúan.
6. `groupKey` sólo si hay una equivalencia editorial entre idiomas.

Efecto al activarse (sin cambios de código): R5 limita a 2 los débiles por objetivo `core` y sesión;
AL17 enlaza la lección `introduce`. Orden sugerido: inglés A1 primero (§18 de la arquitectura de datos).

### 4.2 Gramática

1. Conceptos `kind = 'grammar'`, id `<idioma>.gram.<slug>`, con nivel y descripción; dimensión de
   conocimiento `grammar` (`ref_concept_kinds`).
2. Ítems con `item_concepts` `target` en `grammar` (y `support` léxicos si corresponde), corrección
   objetiva (`exact_option.v1` / `normalized_text.v1`) y escalón definido para su `assessment_mode`.
3. Objetivos que los usan como `core`.

### 4.3 Comprensión lectora y auditiva

1. Textos de lectura y guiones de audio con autor, nivel y licencia; el audio, con su archivo y
   transcripción (los audios de hoy salen de síntesis del dispositivo: un audio grabado es contenido
   nuevo con su propio almacenamiento, fuera de esta fase).
2. Ítems de comprensión (`input_modality` `text` / `audio`) cuyo `target` es la dimensión
   `comprehension` de los conceptos que evalúan.
3. **Pendiente técnico para los repasos**: la RPC de repasos registra **una palabra por intento**
   (`submit_learning_session('review')`, sin cambios). Un ítem de varios conceptos o un concepto no
   léxico necesita `record_learning_session` (arquitectura, fase 3; **implementado en la fase 5** para ítems
   de varios conceptos léxicos, `LEARNING_PHASE5.md`; los conceptos no léxicos siguen sin palabra para el v1). Hasta entonces esos ítems se
   practican en lecciones (que sí los registran) y no entran en los repasos del servidor
   (`review_item_candidates` los excluye: exige un único concepto `target` léxico).

### 4.4 Producción

- Controlada (`translate_write`, `short_answer`): ya soportada (`normalized_text.v1`); se agrega con
  `answer` + `accepted_answers` revisados por un nativo.
- Libre: bloqueada hasta `constrained_text.v1` (`FREE_PRODUCTION_GRADING_SPEC.md`).

## 5. Integración objetivos ↔ conceptos ↔ lecciones ↔ ítems

```
learning_objectives ──< objective_concepts >── concepts ──< item_concepts >── exercise_items
        │                (core / support)                  (target / support,     │
        ├──< lesson_objectives >── lessons ──< exercises ──── dimensión) ─────────┤ (item_id)
        │      (introduce / practice / consolidate / assess)                        │
        └──< item_objectives >──────────────────────────────────────────────────────┘
```

Restricciones ya en la base: FK compuestas por idioma (un objetivo no puede apuntar a un concepto o
ítem de otro idioma) y el trigger de idioma de `lesson_objectives`. `objectiveProblems` ya comprueba
id, prefijo de idioma y nivel, estado, actividad, `canDo`, posición, `groupKey` único, roles válidos,
relaciones repetidas y que conceptos, lecciones e ítems existan y sean del mismo idioma.

Reglas de coherencia **propuestas** (no comprobadas todavía; agregarlas a `objectiveProblems` junto
con el primer objetivo real, para que tengan casos reales que las prueben): todo concepto `core`
aparece como `target` en algún ítem del objetivo; toda lección `introduce` presenta al menos un
concepto `core`; un objetivo `active` tiene al menos un ítem que lo evalúa.

## 6. Qué no se hace

- No se generan objetivos, gramática, lecturas ni audios de relleno.
- No se convierten textos de la interfaz en objetivos.
- No se activa nada en producción sin la revisión del paso 3 y autorización expresa.
