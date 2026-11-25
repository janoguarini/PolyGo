/**
 * Fase 5: el banco propio de Word Rush (tablas word_rush_sentences y word_rush_exercise_variants) unido
 * a las frases de las lecciones publicadas. Sólo lo usa loadSentences, que sólo usa Word Rush
 * (protocolo 3): ni las lecciones ni los desafíos con amigos leen estas tablas.
 *
 * Funciones puras (sin Supabase) para poder probarlas contra el contenido local.
 * Ver docs/WORD_RUSH_CONTENT.md §8.
 */
import { canonicalForm, verdictForText } from '../../shared/answers';
import type { ArcadeSentence } from '../../shared/arcade';

/** Fila de public.word_rush_sentences (sólo las columnas que lee el servidor). */
export interface WordRushSentenceRow {
  id: unknown;
  language_code: unknown;
  unit_id: unknown;
  tokens: unknown;
  answer: unknown;
  accepted_answers: unknown;
  translation: unknown;
}

/** Fila de public.word_rush_exercise_variants. */
export interface WordRushVariantRow {
  exercise_id: unknown;
  accepted_answers: unknown;
}

/** Lo que se descartó al unir, para el log (nunca bloquea la partida). */
export interface MergeReport {
  bankSentences: number;
  bankSkipped: number;
  variantsApplied: number;
  variantsSkipped: number;
  duplicatesSkipped: number;
}

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((t) => typeof t === 'string');

const nonEmpty = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/** Más fichas que esto no se valida por permutaciones (Word Rush usa hasta 6; sentencePool las saca). */
const MAX_PERMUTATION_TOKENS = 7;

function* permutations<T>(items: readonly T[]): Generator<T[]> {
  if (items.length <= 1) {
    yield [...items];
    return;
  }
  for (let i = 0; i < items.length; i++) {
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const p of permutations(rest)) yield [items[i]!, ...p];
  }
}

/**
 * Una variante es válida si se arma con exactamente las mismas fichas que la frase, en otro orden, y el
 * corrector de Word Rush (verdictForText, sin tolerancia de tipeo) la reconoce. Así una variante mal
 * cargada (de otra frase, con una palabra de más o de menos) nunca vuelve correcta una respuesta falsa.
 */
export function isValidVariant(tokens: readonly string[], variant: string): boolean {
  if (!nonEmpty(variant) || tokens.length === 0 || tokens.length > MAX_PERMUTATION_TOKENS)
    return false;
  // Atajo barato: los mismos caracteres (sin espacios) antes de probar órdenes.
  const chars = (s: string) => [...canonicalForm(s).replace(/\s+/g, '')].sort().join('');
  if (chars(tokens.join(' ')) !== chars(variant)) return false;
  for (const order of permutations(tokens)) {
    if (verdictForText(order.join(' '), [variant], false).correct) return true;
  }
  return false;
}

/** Variantes válidas y sin repetir (ni la respuesta ni las que ya estaban). */
function validVariants(sentence: ArcadeSentence, candidates: readonly string[]): string[] {
  const known = new Set([sentence.answer, ...sentence.acceptedAnswers].map(canonicalForm));
  const out: string[] = [];
  for (const v of candidates) {
    const key = canonicalForm(v);
    if (known.has(key) || !isValidVariant(sentence.tokens, v)) continue;
    known.add(key);
    out.push(v);
  }
  return out;
}

/**
 * Une las dos fuentes. Reglas:
 * - Las frases de lecciones van primero y no se tocan salvo para sumarles variantes válidas del banco
 *   (sólo en Word Rush: las lecciones siguen leyendo exercises.accepted_answers).
 * - Una frase del banco entra sólo si es del curso, de una unidad publicada (`publishedUnits`), tiene
 *   fichas, respuesta y traducción, y las fichas forman la respuesta. Sus variantes también se validan.
 * - Sin duplicados: ni el mismo id ni la misma respuesta (canonicalForm) que una frase anterior. Ante un
 *   choque gana la lección.
 * El filtro por jugador (unidades desbloqueadas, nivel, largo) se aplica después, igual que antes.
 */
export function mergeSentenceSources(
  languageCode: string,
  lessons: readonly ArcadeSentence[],
  bank: { sentences: readonly WordRushSentenceRow[]; variants: readonly WordRushVariantRow[] },
  publishedUnits: ReadonlySet<string>,
): { sentences: ArcadeSentence[]; report: MergeReport } {
  const report: MergeReport = {
    bankSentences: 0,
    bankSkipped: 0,
    variantsApplied: 0,
    variantsSkipped: 0,
    duplicatesSkipped: 0,
  };

  const extra = new Map<string, string[]>();
  for (const row of bank.variants) {
    if (!nonEmpty(row.exercise_id) || !isStringArray(row.accepted_answers)) {
      report.variantsSkipped += 1;
      continue;
    }
    extra.set(row.exercise_id, [...(extra.get(row.exercise_id) ?? []), ...row.accepted_answers]);
  }

  const out: ArcadeSentence[] = [];
  const ids = new Set<string>();
  const answers = new Set<string>();
  const push = (s: ArcadeSentence) => {
    ids.add(s.id);
    answers.add(canonicalForm(s.answer));
    out.push(s);
  };

  for (const s of lessons) {
    const more = extra.get(s.id);
    if (!more) {
      push(s);
      continue;
    }
    const valid = validVariants(s, more);
    report.variantsApplied += valid.length;
    report.variantsSkipped += more.length - valid.length;
    push(valid.length ? { ...s, acceptedAnswers: [...s.acceptedAnswers, ...valid] } : s);
  }
  // Variantes de ejercicios que no llegaron (de otro curso o no publicados): no se usan ni se cuentan,
  // porque la tabla se lee entera (es chica) y casi todas son de otros cursos.

  for (const row of bank.sentences) {
    if (
      !nonEmpty(row.id) ||
      row.language_code !== languageCode ||
      !nonEmpty(row.unit_id) ||
      !publishedUnits.has(row.unit_id) ||
      !isStringArray(row.tokens) ||
      row.tokens.length === 0 ||
      !nonEmpty(row.answer) ||
      !nonEmpty(row.translation) ||
      !isStringArray(row.accepted_answers ?? [])
    ) {
      report.bankSkipped += 1;
      continue;
    }
    const tokens = row.tokens;
    // Las fichas tienen que formar la respuesta (mismo control que sentencePool).
    if (!verdictForText(tokens.join(' '), [row.answer], false).correct) {
      report.bankSkipped += 1;
      continue;
    }
    if (ids.has(row.id) || answers.has(canonicalForm(row.answer))) {
      report.duplicatesSkipped += 1;
      continue;
    }
    const base: ArcadeSentence = {
      id: row.id,
      tokens: [...tokens],
      answer: row.answer,
      acceptedAnswers: [],
      translation: row.translation,
      unitId: row.unit_id,
    };
    const candidates = (row.accepted_answers ?? []) as string[];
    const valid = validVariants(base, candidates);
    report.variantsSkipped += candidates.length - valid.length;
    push({ ...base, acceptedAnswers: valid });
    report.bankSentences += 1;
  }

  return { sentences: out, report };
}
