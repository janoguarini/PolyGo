import { gradingSpecFor } from '../shared/grading';
import { languageConfig } from '../shared/languages';
import {
  hasHan,
  readingDictionary,
  segmentReadings,
  type ReadingSegment,
} from '../shared/readings';
import { canonicalHash } from './canonical-json';
import type { Catalog } from './catalog';
import { GENERATORS, type ExerciseRowLike, type VersionSet } from './versions';

/**
 * Conjuntos de opciones inmutables (decisiones V5.1–V5.3 del 2026-11-08,
 * docs/EXERCISE_ITEM_VERSIONS_PENDING.md §5; tabla `exercise_option_sets`, migración
 * 20261108130000_learning_option_sets.sql).
 *
 * Un conjunto es la fotografía exacta de las opciones de un ítem de elección (`exact_option`:
 * image_choice, translation_choice, fill_blank, listen_choice) tal como se muestran: el texto literal
 * y lo que la app dibuja o reproduce con él, sin depender de ids de palabras. Cada opción
 * (`polygo.options.v1`):
 *
 *   { "text": "你好", "reading": [{"text":"你好","reading":"nǐ hǎo"}], "audio": null, "image": null }
 *
 * - `text`: la opción, carácter por carácter (lo que se compara con `answer`, V1).
 * - `reading`: en chino, los segmentos con su pinyin tal como los arma `segmentReadings`
 *   (shared/readings.ts) con el diccionario del curso; null si el idioma no usa caracteres chinos o el
 *   texto no los tiene. Así un cambio posterior de `words.romanization` no cambia lo que muestra una
 *   presentación histórica.
 * - `audio`, `image`: hoy ninguna opción tiene audio ni imagen propios (el audio y el emoji del
 *   enunciado están en la versión). Quedan en el formato, siempre null, para que agregarlos sea un
 *   formato nuevo y no una reinterpretación.
 *
 * `options_hash` = `v1:` + SHA-256 del JSON canónico de `{format, options, answer_index}`
 * (content/canonical-json.ts, calculado sólo en Node como el de las versiones, V4). Un conjunto es de
 * una versión: unique (versión, hash). Las ubicaciones de un mismo ítem con las mismas opciones
 * comparten el conjunto; los 176 ítems de distractores variables (content/variable-options.ts) tienen
 * un conjunto por cada contenido publicado, todos de su única versión.
 */

export const OPTION_SET_FORMAT = 'polygo.options.v1';

export interface OptionEntry {
  text: string;
  reading: ReadingSegment[] | null;
  audio: null;
  image: null;
}

export interface OptionSetRow {
  item_id: string;
  /** `content_hash` de la versión a la que pertenece. */
  version_hash: string;
  options_hash: string;
  format: typeof OPTION_SET_FORMAT;
  options: OptionEntry[];
  answer_index: number;
  /** `catalog`: de una ubicación publicada. `session` (servidor, V5.3) no lo genera content/. */
  origin: 'catalog';
  generator: string | null;
  generator_version: string | null;
}

export interface OptionSetPlan {
  /** Uno por (ítem, hash), en el orden de las ubicaciones del catálogo. */
  option_sets: OptionSetRow[];
  /** El conjunto de cada ubicación de elección. */
  placement_option_sets: { exercise_id: string; item_id: string; options_hash: string }[];
}

/** Tipos cuyas ubicaciones llevan conjunto: los que se corrigen con `exact_option`. */
export const isChoiceType = (type: ExerciseRowLike['type']) =>
  gradingSpecFor(type).mode === 'exact_option';

export const optionSetHash = (
  set: Pick<OptionSetRow, 'format' | 'options' | 'answer_index'>,
): string =>
  canonicalHash({ format: set.format, options: set.options, answer_index: set.answer_index });

/** Diccionario de lecturas por idioma, armado con las palabras del curso (como la app). */
export type ReadingWords = readonly {
  language_code: string;
  text: string;
  romanization: string | null;
}[];

export function optionEntry(
  text: string,
  language: string,
  dictionaries: Map<string, ReturnType<typeof readingDictionary>>,
): OptionEntry {
  const dict = dictionaries.get(language);
  const reading =
    languageConfig(language).script === 'han' && dict && hasHan(text)
      ? segmentReadings(text, dict)
      : null;
  return { text, reading, audio: null, image: null };
}

/**
 * Conjuntos de un catálogo. Determinista. Falla si una ubicación de elección no tiene versión, si sus
 * opciones se repiten o no incluyen la respuesta, o si la versión guarda opciones distintas de las
 * publicadas (los 176 y los generados de elección nuevos las guardan fuera de la versión;
 * content/versions.ts).
 */
export function buildOptionSets(
  catalog: Pick<Catalog, 'items' | 'placements'>,
  exercises: readonly ExerciseRowLike[],
  versions: Pick<VersionSet, 'versions' | 'placement_versions'>,
  words: ReadingWords,
): OptionSetPlan {
  const items = new Map(catalog.items.map((i) => [i.id, i]));
  const rows = new Map(exercises.map((e) => [e.id, e]));
  const versionOf = new Map(
    versions.placement_versions.map((p) => [p.exercise_id, p.content_hash]),
  );
  const versionRow = new Map(versions.versions.map((v) => [`${v.item_id}@${v.content_hash}`, v]));
  const dictionaries = new Map<string, ReturnType<typeof readingDictionary>>();
  for (const lang of new Set(words.map((w) => w.language_code))) {
    dictionaries.set(lang, readingDictionary(words.filter((w) => w.language_code === lang)));
  }

  const out: OptionSetPlan = { option_sets: [], placement_option_sets: [] };
  const seen = new Set<string>();
  for (const p of catalog.placements) {
    const item = items.get(p.item_id);
    if (!item) continue; // ítem de otro tramo
    if (!isChoiceType(item.type)) continue;
    const row = rows.get(p.exercise_id);
    if (!row) throw new Error(`Ubicación ${p.exercise_id} sin fila de exercises`);
    const version_hash = versionOf.get(p.exercise_id);
    if (!version_hash) throw new Error(`${p.exercise_id}: ubicación de elección sin versión`);
    const payload = row.payload as { options?: unknown };
    const texts = payload.options;
    if (!Array.isArray(texts) || texts.some((t) => typeof t !== 'string' || t.length === 0)) {
      throw new Error(`${p.exercise_id}: payload.options inválido`);
    }
    if (new Set(texts).size !== texts.length)
      throw new Error(`${p.exercise_id}: opciones repetidas`);
    const answer_index = texts.indexOf(row.answer);
    if (answer_index < 0)
      throw new Error(`${p.exercise_id}: la respuesta no está entre las opciones`);
    const version = versionRow.get(`${p.item_id}@${version_hash}`);
    const inVersion = (version?.payload as { options?: unknown } | undefined)?.options;
    if (inVersion !== undefined && JSON.stringify(inVersion) !== JSON.stringify(texts)) {
      throw new Error(`${p.exercise_id}: las opciones de la versión no son las publicadas`);
    }
    const gen = item.origin === 'generated' ? GENERATORS[item.type] : undefined;
    const set = {
      format: OPTION_SET_FORMAT,
      options: (texts as string[]).map((t) => optionEntry(t, item.language_code, dictionaries)),
      answer_index,
    } as const;
    const options_hash = optionSetHash(set);
    const key = `${p.item_id}@${version_hash}@${options_hash}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.option_sets.push({
        item_id: p.item_id,
        version_hash,
        options_hash,
        ...set,
        options: set.options,
        origin: 'catalog',
        generator: gen?.generator ?? null,
        generator_version: gen?.version ?? null,
      });
    }
    out.placement_option_sets.push({
      exercise_id: p.exercise_id,
      item_id: p.item_id,
      options_hash,
    });
  }
  return out;
}
