# Corrección de producción libre — especificación (P8)

> **Fase 5 (2026-11-08, `LEARNING_PHASE5.md` §6):** el motor determinista de §3 y los casos de §5.3
> están implementados y probados en `shared/constrainedText.ts`, **sin activar** (no es un modo de
> `ref_grading_modes`, ningún ítem lo usa, sin listas cerradas reales). §4 (rúbricas/IA) y §5.1–5.2
> (`pending_review` en la base) siguen sin implementar.

Estado (2026-11-08): **diseño, sin implementar ni activar.** `free_production` sigue sin modo de
corrección (`gradingSpecFor` lo rechaza, `shared/grading.ts`) y ningún ítem de ese modo entra en
lecciones ni repasos. No se llama a ningún servicio de IA ni se genera ningún costo. Este documento
cierra la decisión P8 de `LEARNING_PHASE4.md` §10 como especificación técnica para una fase futura.

Fuentes que no cambia: `shared/grading.ts` (modos `exact_option.v1`, `normalized_text.v1`,
`pair_set.v1`), `polygo.answers.v1` (congelado, V2), `exercise_attempt_gradings` (inmutable), la vía
única del SRS v2 y el Mastery Engine.

## 1. Qué es «producción libre»

Una respuesta escrita (o, más adelante, hablada) **abierta**: el alumno compone una frase o un texto
corto y hay muchas respuestas correctas que no se pueden enumerar. Se distingue de la producción
controlada (`translate_write`, `short_answer`), que ya se corrige con `normalized_text.v1` contra
`answer` + `accepted_answers`.

| Caso                                     | Modo                          | Hoy                     |
| ---------------------------------------- | ----------------------------- | ----------------------- |
| Opción elegida                           | `exact_option.v1`             | En uso                  |
| Texto con respuestas enumerables         | `normalized_text.v1`          | En uso (38 ítems de P)  |
| Parejas                                  | `pair_set.v1`                 | En uso (lecciones)      |
| Texto con respuestas no enumerables      | `constrained_text.v1` (nuevo) | **Diseño** (§3)         |
| Texto evaluado por rúbrica (con revisor) | `rubric.v1` (nuevo)           | **Diseño** (§4, futuro) |

## 2. Principios

1. **Determinista primero.** Todo lo que se pueda decidir con reglas versionadas se decide así, en el
   servidor, con el mismo resultado para la misma versión del ítem y la misma respuesta.
2. **Nunca un veredicto inventado.** Si las reglas no alcanzan, el estado es `pending_review`
   (§5), no «correcto» ni «incorrecto».
3. **Inmutable y versionado.** Un modo nuevo es una fila nueva en `ref_grading_modes`
   (`constrained_text.v1`); cambiar su comportamiento es `v2`. Un veredicto ya registrado no se
   recalcula: una corrección posterior es una fila nueva (§5.3).
4. **Separación de responsabilidades.** El corrector produce una corrección (`exercise_attempt_gradings`);
   el SRS y el motor la consumen sólo cuando es definitiva. Ninguna evaluación externa escribe `S`, `D`
   ni estados del motor.
5. **Sin ventajas de pago.** El mismo corrector para todos; Plus no cambia cómo se corrige.

## 3. Corrección determinista: `constrained_text.v1`

Para respuestas de una oración donde lo correcto se puede describir con **restricciones** en lugar de
enumerarlo. El `grading_spec` (validado por su JSON Schema) define:

```jsonc
{
  "mode": "constrained_text",
  "mode_version": 1,
  "normalizer": "polygo.answers.v1",          // o uno nuevo: ver §3.2
  "accept": [                                  // patrones aceptados (alguno debe cumplirse)
    { "tokens": ["i", "(am|'m)", "from", "<PROPER_NOUN>"] }
  ],
  "require_lemmas": ["be", "from"],            // lemas obligatorios (§3.3)
  "forbid": ["<L1_WORD>"],                      // p. ej. respuestas en español
  "max_tokens": 12,
  "typo_tolerance": { "max_distance": 1, "min_length": 8 },
  "partial": "none"                             // §3.5
}
```

### 3.1 Respuestas alternativas válidas

- `accept` es una lista de **patrones de fichas** sobre la respuesta normalizada: literales,
  alternativas `(a|b)`, opcionales `[a]` y comodines con clase (`<PROPER_NOUN>`, `<NUMBER>`,
  `<ANY_WORD>`). Las clases se resuelven con listas cerradas y versionadas por idioma (no con IA).
- `answer` y `accepted_answers` de la versión siguen valiendo como coincidencias exactas (un ítem
  puede migrar de `normalized_text.v1` sin perder ninguna respuesta aceptada).
- Un patrón nuevo es una **versión nueva del ítem** (las ya presentadas conservan su corrección).

### 3.2 Acentos, Unicode y variantes regionales

- Normalización Unicode **NFC** antes de todo; comparación por puntos de código, no por bytes.
- Mayúsculas: plegado por idioma (`toLocaleLowerCase(lang)`; el turco no aplica hoy).
- **Acentos**: `polygo.answers.v1` ya define qué es tipeo. Un modo nuevo puede pedir una política
  explícita por idioma: `accent_policy: "strict" | "lenient_typo"` (`lenient_typo` = un acento
  faltante cuenta como tipeo, veredicto `typo`, nunca `correct`). Cambiar la política existente exige
  `polygo.answers.v2` con pruebas de compatibilidad (la huella de v1 está congelada en
  `shared/__tests__/grading.test.ts`).
- **Chino**: las equivalencias de caracteres y pinyin de v1; los tonos numéricos y diacríticos se
  tratan como en v1.
- **Variantes regionales** (p. ej. _colour/color_, _apartment/flat_, pt-BR/pt-PT): una tabla
  versionada `regional_variants.<idioma>.v1` de equivalencias léxicas aceptadas en ambas direcciones.
  Una variante sólo se acepta si está en la tabla; el ítem puede restringirla
  (`variants: "any" | "<región>"`).

### 3.3 Flexiones y conjugaciones

- `require_lemmas` comprueba que aparezcan formas de un lema, con una **tabla de formas cerradas** por
  idioma y nivel (`lemma_forms.<idioma>.v1`: _be → am, is, are, was, were, 'm, 's, 're_), generada y
  revisada editorialmente. No hay lematizador estadístico.
- Una forma flexionada **incorrecta** de un lema obligatorio (p. ej. _I is_) no es tipeo: es
  `incorrect`, con `error_tags: ["agreement"]` (§3.6) para el feedback.
- Si la tabla no cubre una forma, la respuesta no se acepta por esa vía (cae en `pending_review` sólo
  si el ítem lo permite, §5).

### 3.4 Tolerancia a errores ortográficos

- Distancia de edición (Damerau-Levenshtein) **por ficha**, con umbral por longitud
  (`max_distance`, `min_length`), como la regla de tipeo de v1 (distancia 1 desde 8 caracteres).
- Nunca se tolera un tipeo que convierta la ficha en **otra palabra válida** de la lista cerrada del
  idioma (_form/from_, _there/three_): eso es `incorrect`.
- Con tipeo el veredicto es `typo` (cuenta como acierto para el SRS, como hoy).

### 3.5 Respuestas parcialmente correctas

- `exercise_attempt_gradings.verdict` sigue siendo `correct | typo | incorrect`: el SRS y el motor no
  cambian.
- Un crédito parcial se registra **aparte**, como detalle de la corrección (`grading_detail`:
  `{matched_constraints, failed_constraints, error_tags}`), sin efecto en el SRS en `v1`
  (`partial: "none"`). Usar el parcial en el SRS o el motor sería una decisión de diseño nueva
  (q4 fraccionario, 5.4 de la rev. 4.2) y una versión nueva del modo.

### 3.6 Criterios de aceptación de un ítem `constrained_text.v1`

Un ítem sólo se publica con este modo si:

1. Tiene al menos **20 respuestas de prueba** etiquetadas por un revisor (≥ 10 correctas, ≥ 5
   incorrectas, ≥ 3 con tipeo, ≥ 2 de variante regional si aplica), versionadas junto al ítem.
2. El corrector da el veredicto esperado en **todas** (prueba automática por ítem, como la huella de v1).
3. Con respuestas reales (§6), la tasa de `pending_review` es ≤ 5 % y el desacuerdo con revisores es
   ≤ 2 % durante el piloto.
4. Revisión pedagógica (P8 de la arquitectura de datos) del patrón y de las clases que usa.

## 4. Rúbricas: `rubric.v1` (futuro, no determinista)

Para textos de más de una oración (escritura A2+). El `grading_spec` define criterios con niveles
(`task_completion`, `vocabulary`, `grammar`, cada uno 0–2) y descriptores. Lo evalúa un **revisor
humano** o, si algún día se decide, un **evaluador automático** con estas condiciones obligatorias:

- Ejecución **asíncrona** y fuera de la vía de la sesión (nunca bloquea un envío ni el SRS).
- Entrada: la versión del ítem, la rúbrica y la respuesta; **sin datos personales** (§6).
- Salida registrada como una corrección `pending_review → graded` con `grader = 'ai:<modelo>'`,
  `grader_version`, la puntuación por criterio y su confianza.
- Por debajo de un umbral de confianza, o en un muestreo fijo (p. ej. 10 %), pasa a revisión humana.
- Un evaluador automático **no se activa** sin: presupuesto aprobado, evaluación contra un conjunto
  etiquetado por revisores (acuerdo ≥ revisor-revisor), política de privacidad y consentimiento.
  Nada de esto existe hoy; esta especificación no lo autoriza.

## 5. Estado «pendiente de corrección» y efecto en el SRS

### 5.1 Esquema (migración futura, aditiva)

- `exercise_attempt_gradings.status` admite hoy `valid | invalid_response`. Se agregaría
  `pending_review` (CHECK nuevo: `pending_review` ⇒ `verdict` nulo).
- Tabla nueva `attempt_grading_resolutions` (inmutable): `(attempt_id, resolved_at, verdict,
grader, grader_version, rubric_scores, reviewer_id?)`. La corrección original no se modifica: la
  resolución la completa (principio 3).

### 5.2 Efecto en el SRS y el motor

- Una observación `pending_review` **no se aplica** al SRS: `srs_v2_observations` ya filtra
  `status = 'valid'`, así que hoy se excluiría sola. El ítem cuenta como presentado (exposición), no
  como evidencia.
- Al resolverse, la resolución **no reabre la sesión**: entra como observación diferida de la unidad
  con `t_srs` = hora de la resolución, por la misma vía única (`srs_v2_apply_session` con origen
  nuevo `deferred`), o se descarta si la unidad ya tuvo una sesión posterior (decisión abierta D-P8-1).
- El motor la lee como cualquier corrección válida (cola `knowledge_recompute_queue`).
- El SRS v1 no recibe correcciones diferidas (sigue con su envío de siempre: sin cambios).

### 5.3 Casos ambiguos que requieren evaluación adicional

`pending_review` cuando, y sólo cuando, el ítem lo permite (`allow_pending: true`) y:

- la respuesta no cumple ningún patrón pero comparte ≥ 60 % de los lemas obligatorios;
- aparece una palabra fuera de las listas cerradas (posible nombre propio, regionalismo o error);
- hay mezcla de idiomas que no es una palabra prohibida;
- la respuesta supera `max_tokens` pero contiene un patrón aceptado.

Sin `allow_pending`, esos casos son `incorrect` (comportamiento determinista y conservador, como hoy).

## 6. Datos y privacidad

- `responsePrivacyOf` (`content/catalog.ts`, §13.2) ya clasifica las respuestas: las de producción
  libre serían `open_text` o `fictional` (persona del catálogo). Las que pidan datos del propio
  usuario (`self_disclosure`) siguen sin publicarse mientras P4 de la arquitectura de datos esté
  pendiente. Se guardan como hoy (inmutables, sólo service_role), con la misma retención que las
  evidencias (P6: no se borran) y el mismo borrado por cuenta.
- Ningún envío a terceros sin una decisión explícita, documentada y con consentimiento (§4).

## 7. Plan de implementación (cuando se autorice)

1. `constrained_text.v1` en `shared/grading.ts` + su JSON Schema en `ref_grading_modes` (migración
   aditiva), listas cerradas `lemma_forms` / `regional_variants` / clases versionadas en `content/`.
2. Pruebas: huella del modo (como v1), respuestas de prueba por ítem (§3.6), compatibilidad de v1.
3. Ítems piloto en `draft` (inglés A1, producción), sin repasos; métricas de §3.6.
4. `pending_review` + resoluciones (§5) sólo si el piloto lo necesita.
5. `rubric.v1` y cualquier evaluador automático: decisión de producto aparte (§4).

## 8. Decisiones abiertas

| #      | Decisión                                                                         |
| ------ | -------------------------------------------------------------------------------- |
| D-P8-1 | Resolución diferida: aplicarla al SRS como observación tardía o sólo al motor    |
| D-P8-2 | Política de acentos por idioma en un normalizador `v2`                           |
| D-P8-3 | Crédito parcial en el SRS (q4 fraccionario) — hoy no                             |
| D-P8-4 | Evaluador automático: presupuesto, proveedor, privacidad y umbral de confianza   |
| D-P8-5 | Quién revisa (equipo editorial, revisores nativos) y su herramienta de revisión |
