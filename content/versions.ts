import { gradingSpecFor, gradingSpecProblems, type GradingSpec } from '../shared/grading';
import type { ExerciseType } from '../shared/exercises';
import { canonicalHash } from './canonical-json';
import type { Catalog } from './catalog';
import { INLINE_OPTION_ITEMS } from './inline-option-items';
import { VARIABLE_OPTION_ITEMS } from './variable-options';

/**
 * Versiones de los ítems (arquitectura de datos rev. 8, §5 y §8; tabla `exercise_item_versions`,
 * migración 20261107150000_learning_item_versions.sql). Decisiones V1–V8 aprobadas el 2026-11-08
 * (docs/EXERCISE_ITEM_VERSIONS_PENDING.md).
 *
 * - Contenido: copia exacta de lo publicado en la ubicación (`prompt_es`, `payload`, `answer`,
 *   `accepted_answers`, `explanation_es`, `difficulty`, `recommended_seconds`), más `grading_spec`
 *   (V1, shared/grading.ts).
 * - `content_hash` (V3, V4): `v1:` + SHA-256 del JSON canónico RFC 8785, en NFC, de esos siete campos
 *   y `grading_spec` (content/canonical-json.ts). Sin ubicación, publicación, skill ni ids. Los arrays
 *   conservan su orden; `accepted_answers` también (la respuesta principal es `answer`).
 * - `generator`, `generator_version` (V6): sólo en los generados, fuera del hash; metadatos de la
 *   versión que los originó. A → B → A reutiliza A con su procedencia original (scripts/versions-sql.ts).
 * - Deduplicación por (ítem, hash): las 948 copias de la consolidación comparten la versión de su
 *   escrito.
 * - Distractores variables (V5 (a), resuelta con V5.1–V5.3 el 2026-11-08): en los ítems de
 *   VARIABLE_OPTION_ITEMS (content/variable-options.ts) `payload.options` no forma parte de la versión
 *   ni del hash; las opciones de cada ubicación viven en su conjunto inmutable
 *   (content/option-sets.ts). El resto del contenido tiene que ser único: una versión por ítem.
 * - Generados de elección futuros (decisión del 2026-11-08, docs/EXERCISE_ITEM_VERSIONS_PENDING.md §6):
 *   todo ítem generado de elección (image_choice, translation_choice, fill_blank, listen_choice) que no
 *   esté en INLINE_OPTION_ITEMS (content/inline-option-items.ts, los 782 ya cargados con las opciones
 *   en la versión) lleva las opciones fuera de su versión, como los 176: la versión es el conocimiento
 *   y la corrección; el conjunto, la presentación. Los escritos no cambian (sus opciones siguen en la
 *   versión) y ninguna versión ni hash cargado cambia.
 */

/** Columnas de `exercises` que la versión copia (§5), en el orden de la tabla. */
export const VERSION_CONTENT_FIELDS = [
  'prompt_es',
  'payload',
  'answer',
  'accepted_answers',
  'explanation_es',
  'difficulty',
  'recommended_seconds',
] as const;

export interface VersionContent {
  prompt_es: string;
  payload: unknown;
  answer: string;
  accepted_answers: string[];
  explanation_es: string | null;
  difficulty: number;
  recommended_seconds: number;
}

/** Fila de `exercises` tal como la arma scripts/content-document.ts. */
export interface ExerciseRowLike extends VersionContent {
  id: string;
  type: ExerciseType;
}

/** La copia de lo publicado que guarda una versión (§5). */
export function versionContentOf(row: VersionContent): VersionContent {
  return {
    prompt_es: row.prompt_es,
    payload: row.payload,
    answer: row.answer,
    accepted_answers: row.accepted_answers,
    explanation_es: row.explanation_es,
    difficulty: row.difficulty,
    recommended_seconds: row.recommended_seconds,
  };
}

/**
 * Contenidos publicados distintos de cada ítem, recorriendo todas sus ubicaciones (escritas, copias
 * de la consolidación y generadas). Comparación estructural (mismo JSON con las claves en el orden de
 * VERSION_CONTENT_FIELDS).
 */
export function contentsByItem(
  catalog: Pick<Catalog, 'placements'>,
  exercises: readonly ExerciseRowLike[],
): Map<string, { content: VersionContent; exercises: string[] }[]> {
  const rows = new Map(exercises.map((e) => [e.id, e]));
  const out = new Map<string, { content: VersionContent; exercises: string[] }[]>();
  for (const p of catalog.placements) {
    const row = rows.get(p.exercise_id);
    if (!row) throw new Error(`Ubicación ${p.exercise_id} sin fila de exercises`);
    const content = versionContentOf(row);
    const key = JSON.stringify(content);
    const list = out.get(p.item_id) ?? [];
    const same = list.find((c) => JSON.stringify(c.content) === key);
    if (same) same.exercises.push(p.exercise_id);
    else list.push({ content, exercises: [p.exercise_id] });
    out.set(p.item_id, list);
  }
  return out;
}

/**
 * Procedencia de los generados (V6): el método de `Generator` (content/path.ts) que arma cada tipo
 * y una versión que se sube cuando cambia su salida. Fuera del hash.
 */
export const GENERATORS: Partial<Record<ExerciseType, { generator: string; version: string }>> = {
  translation_choice: { generator: 'content/path.ts#translationChoice', version: '1.0.0' },
  listen_choice: { generator: 'content/path.ts#listenChoice', version: '1.0.0' },
  complete_word: { generator: 'content/path.ts#completeWord', version: '1.0.0' },
  translate_write: { generator: 'content/path.ts#translateWrite', version: '1.0.0' },
  match_pairs: { generator: 'content/path.ts#matchPairs', version: '1.0.0' },
};

/** Lo que entra en el hash: los siete campos de §5 y `grading_spec`, nada más (V3). */
export const hashInputOf = (content: VersionContent, spec: GradingSpec) => ({
  ...versionContentOf(content),
  grading_spec: spec,
});

export const versionHash = (content: VersionContent, spec: GradingSpec) =>
  canonicalHash(hashInputOf(content, spec));

export interface VersionRow extends VersionContent {
  item_id: string;
  content_hash: string;
  grading_spec: GradingSpec;
  generator: string | null;
  generator_version: string | null;
}

export interface VersionSet {
  /** Una por (ítem, hash), en el orden de los ítems del catálogo. */
  versions: VersionRow[];
  current_versions: { item_id: string; content_hash: string }[];
  placement_versions: { exercise_id: string; item_id: string; content_hash: string }[];
  /**
   * Ítems con las opciones fuera de la versión (V5 (a) y generados de elección nuevos) y sus
   * ubicaciones. Tienen versión como los demás; el dato es informativo (encabezados de las
   * migraciones y pruebas).
   */
  variable_options: { item_id: string; exercises: string[] }[];
}

/** ¿Va con las opciones fuera de su versión? Ver el encabezado del archivo. */
export function optionsOutsideVersion(
  item: Pick<Catalog['items'][number], 'id' | 'origin' | 'type'>,
  variable: ReadonlySet<string>,
  inline: ReadonlySet<string>,
): boolean {
  if (variable.has(item.id)) return true;
  return (
    item.origin === 'generated' &&
    gradingSpecFor(item.type).mode === 'exact_option' &&
    !inline.has(item.id)
  );
}

/** Contenido de la versión de un ítem con las opciones fuera: sin `payload.options` (V5 (a)). */
export function withoutOptions(content: VersionContent): VersionContent {
  const { options: _options, ...payload } = content.payload as Record<string, unknown>;
  return { ...content, payload };
}

const isNfc = (value: unknown): boolean =>
  typeof value === 'string'
    ? value === value.normalize('NFC')
    : Array.isArray(value)
      ? value.every(isNfc)
      : value !== null && typeof value === 'object'
        ? Object.entries(value).every(([k, v]) => isNfc(k) && isNfc(v))
        : true;

/**
 * Versiones de un catálogo. Determinista: mismo contenido → mismas filas en el mismo orden.
 * Falla si un ítem tiene más de un contenido publicado (en los de opciones fuera de la versión, más de
 * uno sin contar `payload.options`), si un texto no está en NFC (la copia guardada tiene que ser lo que
 * se hashea) o si un grading_spec no valida.
 */
export function buildVersions(
  catalog: Pick<Catalog, 'items' | 'placements'>,
  exercises: readonly ExerciseRowLike[],
  variableOptions: readonly string[] = VARIABLE_OPTION_ITEMS,
  inlineOptions: readonly string[] = INLINE_OPTION_ITEMS,
): VersionSet {
  const variable = new Set(variableOptions);
  const inline = new Set(inlineOptions);
  const byItem = contentsByItem(catalog, exercises);
  const out: VersionSet = {
    versions: [],
    current_versions: [],
    placement_versions: [],
    variable_options: [],
  };
  const hashOf = new Map<string, string>();

  for (const item of catalog.items) {
    let contents = byItem.get(item.id);
    if (!contents) continue; // ítem sin ubicación en este tramo
    if (optionsOutsideVersion(item, variable, inline)) {
      out.variable_options.push({
        item_id: item.id,
        exercises: contents.flatMap((c) => c.exercises),
      });
      // Las opciones van al conjunto de cada ubicación (content/option-sets.ts); el resto se agrupa.
      const merged = new Map<string, { content: VersionContent; exercises: string[] }>();
      for (const c of contents) {
        const content = withoutOptions(c.content);
        const key = JSON.stringify(content);
        const same = merged.get(key);
        if (same) same.exercises.push(...c.exercises);
        else merged.set(key, { content, exercises: [...c.exercises] });
      }
      contents = [...merged.values()];
    }
    if (contents.length > 1) {
      throw new Error(
        `${item.id}: ${contents.length} contenidos publicados a la vez (${contents
          .map((c) => c.exercises.join('+'))
          .join(' / ')}); una versión vigente por ítem (§5)`,
      );
    }
    const { content: raw, exercises: placed } = contents[0]!;
    // La copia es la que se guarda en jsonb: sin `undefined`.
    const content = JSON.parse(JSON.stringify(versionContentOf(raw))) as VersionContent;
    if (!isNfc(content)) throw new Error(`${item.id}: contenido fuera de NFC`);
    const spec = gradingSpecFor(item.type, item.assessment_mode);
    const problems = gradingSpecProblems(spec);
    if (problems.length) throw new Error(`${item.id}: ${problems.join('; ')}`);
    const gen = item.origin === 'generated' ? GENERATORS[item.type] : undefined;
    if (item.origin === 'generated' && !gen) throw new Error(`${item.id}: generador desconocido`);
    const content_hash = versionHash(content, spec);
    hashOf.set(item.id, content_hash);
    out.versions.push({
      item_id: item.id,
      content_hash,
      ...content,
      grading_spec: spec,
      generator: gen?.generator ?? null,
      generator_version: gen?.version ?? null,
    });
    out.current_versions.push({ item_id: item.id, content_hash });
    if (placed.length === 0) throw new Error(`${item.id}: sin ubicaciones`);
  }

  for (const p of catalog.placements) {
    const content_hash = hashOf.get(p.item_id);
    if (content_hash) out.placement_versions.push({ ...p, content_hash });
  }
  // Sólo los campos de la fila del documento.
  out.placement_versions = out.placement_versions.map(({ exercise_id, item_id, content_hash }) => ({
    exercise_id,
    item_id,
    content_hash,
  }));
  return out;
}
