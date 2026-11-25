import { canonicalForm, verdictForText } from './answers';
import { HAN } from './languages';

/**
 * `constrained_text.v1` — corrección determinista de producción con respuestas no enumerables
 * (docs/FREE_PRODUCTION_GRADING_SPEC.md §3, decisión P8). Fase 5: el MOTOR está implementado y probado;
 * el modo NO está activado: no está en GRADING_MODES (shared/grading.ts) ni en ref_grading_modes, el
 * trigger de exercise_attempt_gradings no lo admite y ningún ítem lo usa. Activarlo exige lo de §3.6 y
 * §7 (respuestas de prueba por ítem, revisión pedagógica, listas cerradas editoriales y una migración).
 *
 * Separación (§2, principio 4):
 *   1. Determinista (este archivo): patrones de fichas, alternativas, opcionales, clases con listas
 *      cerradas, lemas con tablas de formas cerradas, palabras prohibidas, tipeo por ficha y límite de
 *      fichas. Mismo resultado para la misma especificación, las mismas listas y la misma respuesta.
 *   2. Semántica: lo que las reglas no deciden → `pending_review` (sólo si el ítem lo permite), nunca un
 *      veredicto inventado.
 *   3. IA / rúbrica (§4): fuera de este archivo; no existe ni se llama a ningún servicio.
 *
 * Normalización: la de `polygo.answers.v1` (NFC, mayúsculas, puntuación, contracciones del inglés,
 * pinyin numerado → marcas). Acentos: cuentan (política estricta de v1; D-P8-2 abierta). Chino: no se
 * asume que haya espacios: cada carácter Han es una ficha (en la respuesta y en los patrones).
 */

export const CONSTRAINED_TEXT_ID = 'constrained_text.v1';
export const CONSTRAINED_TEXT_GRADER = {
  grader: 'shared/constrainedText.ts#gradeConstrainedText',
  grader_version: '1.0.0',
} as const;

/** Clases resueltas sin listas: deterministas por definición. */
const BUILTIN_CLASSES = ['NUMBER', 'ANY_WORD'] as const;

export interface ConstrainedTextSpec {
  mode: 'constrained_text';
  mode_version: 1;
  normalizer: 'polygo.answers.v1';
  /** Patrones aceptados: literal, `(a|b)`, `[opcional]`, `[(a|b)]`, `<CLASE>`. */
  accept: { tokens: string[] }[];
  /** Lemas que tienen que aparecer (alguna forma de `lemma_forms`). */
  require_lemmas?: string[];
  /** Fichas o clases que hacen incorrecta la respuesta (p. ej. respuestas en la L1). */
  forbid?: string[];
  max_tokens: number;
  /** Tipeo por ficha (Damerau-Levenshtein). null = sin tolerancia. */
  typo_tolerance: { max_distance: 1 | 2; min_length: number } | null;
  /** Crédito parcial: v1 sólo `none` (el SRS no cambia; el detalle se registra aparte). */
  partial: 'none';
  /** Permite `pending_review` en los casos ambiguos de §5.3. Sin esto, son `incorrect`. */
  allow_pending?: boolean;
}

/**
 * Listas cerradas y versionadas por idioma (§3.1, §3.3). Son contenido editorial: hoy no existe
 * ninguna (EDITORIAL_CONTENT_PIPELINE.md); el motor no inventa ninguna entrada.
 */
export interface ClosedLists {
  /** p. ej. `regional_variants.en.v1+lemma_forms.en.v1`. Se registra con la corrección. */
  version: string;
  classes: Record<string, readonly string[]>;
  lemma_forms: Record<string, readonly string[]>;
  /** Palabras válidas del idioma: un tipeo nunca puede producir una de ellas (§3.4). */
  lexicon?: readonly string[];
}

export const EMPTY_LISTS: ClosedLists = { version: 'none', classes: {}, lemma_forms: {} };

export interface ConstrainedDetail {
  pattern: number | null;
  typos: { expected: string; given: string }[];
  matched_constraints: string[];
  failed_constraints: string[];
  error_tags: string[];
}

export type ConstrainedOutcome =
  | { status: 'graded'; verdict: 'correct' | 'typo' | 'incorrect'; detail: ConstrainedDetail }
  | { status: 'pending_review'; verdict: null; reason: PendingReason; detail: ConstrainedDetail };

export type PendingReason = 'shares_required_lemmas' | 'unknown_word' | 'too_long_with_pattern';

// ---------------------------------------------------------------------------------------------
// Fichas

const HAN_ONE = new RegExp(`(${HAN.source})`, 'gu');

/** Fichas de un texto: la forma canónica de v1, separada por espacios y por carácter Han. */
export function tokenize(raw: string): string[] {
  const canonical = canonicalForm(raw);
  if (!canonical) return [];
  return canonical
    .split(' ')
    .flatMap((t) => t.replace(HAN_ONE, ' $1 ').trim().split(/\s+/))
    .filter(Boolean);
}

const isHan = (t: string) => new RegExp(`^${HAN.source}$`, 'u').test(t);

/** Damerau-Levenshtein (transposición adyacente) por puntos de código. */
export function damerau(a: string, b: string): number {
  const x = [...a];
  const y = [...b];
  const d: number[][] = Array.from({ length: x.length + 1 }, (_, i) =>
    Array.from({ length: y.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= x.length; i++) {
    for (let j = 1; j <= y.length; j++) {
      const cost = x[i - 1] === y[j - 1] ? 0 : 1;
      d[i]![j] = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + cost);
      if (i > 1 && j > 1 && x[i - 1] === y[j - 2] && x[i - 2] === y[j - 1]) {
        d[i]![j] = Math.min(d[i]![j]!, d[i - 2]![j - 2]! + 1);
      }
    }
  }
  return d[x.length]![y.length]!;
}

// ---------------------------------------------------------------------------------------------
// Patrones

type Element =
  | { kind: 'alt'; options: string[][]; optional: boolean }
  | { kind: 'class'; name: string; optional: boolean };

function parseElement(raw: string): Element {
  let s = raw.trim();
  let optional = false;
  if (s.startsWith('[') && s.endsWith(']')) {
    optional = true;
    s = s.slice(1, -1).trim();
  }
  const cls = /^<([A-Z][A-Z0-9_]*)>$/.exec(s);
  if (cls) return { kind: 'class', name: cls[1]!, optional };
  if (s.startsWith('(') && s.endsWith(')')) s = s.slice(1, -1);
  const options = s.split('|').map((o) => tokenize(o));
  if (options.length === 0 || options.some((o) => o.length === 0)) {
    throw new Error(`elemento vacío: ${raw}`);
  }
  return { kind: 'alt', options, optional };
}

/** Problemas de una especificación con sus listas. Vacío = publicable (§3.6 además exige pruebas). */
export function constrainedSpecProblems(spec: unknown, lists: ClosedLists = EMPTY_LISTS): string[] {
  const s = spec as Partial<ConstrainedTextSpec> | null;
  const p: string[] = [];
  if (!s || typeof s !== 'object') return ['no es un objeto'];
  if (s.mode !== 'constrained_text' || s.mode_version !== 1) p.push('modo o versión');
  if (s.normalizer !== 'polygo.answers.v1') p.push('normalizador');
  if (s.partial !== 'none') p.push('partial: v1 sólo admite none');
  if (
    !Number.isInteger(s.max_tokens) ||
    (s.max_tokens as number) < 1 ||
    (s.max_tokens as number) > 60
  ) {
    p.push('max_tokens');
  }
  const t = s.typo_tolerance;
  if (
    t !== null &&
    (typeof t !== 'object' ||
      ![1, 2].includes(t?.max_distance as number) ||
      !Number.isInteger(t?.min_length) ||
      (t?.min_length as number) < 4)
  ) {
    p.push('typo_tolerance');
  }
  if (!Array.isArray(s.accept) || s.accept.length === 0) p.push('accept vacío');
  const known = (name: string) =>
    (BUILTIN_CLASSES as readonly string[]).includes(name) ||
    (Array.isArray(lists.classes[name]) && lists.classes[name]!.length > 0);
  for (const [i, pat] of (s.accept ?? []).entries()) {
    if (!pat || !Array.isArray(pat.tokens) || pat.tokens.length === 0) {
      p.push(`accept[${i}] vacío`);
      continue;
    }
    for (const raw of pat.tokens) {
      try {
        const e = parseElement(String(raw));
        if (e.kind === 'class' && !known(e.name)) p.push(`clase sin lista cerrada: <${e.name}>`);
      } catch (err) {
        p.push(`accept[${i}]: ${(err as Error).message}`);
      }
    }
    if (pat.tokens.every((raw) => /^\[.*\]$/.test(String(raw).trim()))) {
      p.push(`accept[${i}]: todo opcional`);
    }
  }
  for (const lemma of s.require_lemmas ?? []) {
    if (!lists.lemma_forms[lemma]?.length) p.push(`lema sin tabla de formas cerradas: ${lemma}`);
  }
  for (const f of s.forbid ?? []) {
    const c = /^<([A-Z][A-Z0-9_]*)>$/.exec(f);
    if (c && !lists.classes[c[1]!]?.length) p.push(`clase prohibida sin lista: ${f}`);
  }
  return p;
}

interface MatchState {
  typos: { expected: string; given: string }[];
}

/**
 * ¿`tokens` cumple el patrón entero? Backtracking acotado (patrones cortos, ≤ 60 fichas). Devuelve los
 * tipeos usados (el emparejamiento con menos tipeos), o null.
 */
function matchPattern(
  elements: Element[],
  tokens: string[],
  spec: ConstrainedTextSpec,
  lists: ClosedLists,
  valid: ReadonlySet<string>,
): MatchState | null {
  let best: MatchState | null = null;
  const tokenOk = (expected: string, given: string, typos: MatchState['typos']) => {
    if (expected === given) return true;
    const tol = spec.typo_tolerance;
    if (!tol || isHan(expected) || isHan(given)) return false;
    if ([...expected].length < tol.min_length) return false;
    // Un tipeo nunca produce otra palabra válida (form/from, there/three).
    if (valid.has(given)) return false;
    if (damerau(expected, given) > tol.max_distance) return false;
    typos.push({ expected, given });
    return true;
  };
  const builtin = (name: string, token: string) =>
    name === 'NUMBER' ? /^\p{Nd}+$/u.test(token) : /^[\p{L}\p{M}'-]+$/u.test(token);
  const go = (e: number, t: number, typos: MatchState['typos']) => {
    if (best && best.typos.length <= typos.length) return;
    if (e === elements.length) {
      if (t === tokens.length) best = { typos: [...typos] };
      return;
    }
    const el = elements[e]!;
    if (el.optional) go(e + 1, t, typos);
    if (el.kind === 'class' && (BUILTIN_CLASSES as readonly string[]).includes(el.name)) {
      if (t < tokens.length && builtin(el.name, tokens[t]!)) go(e + 1, t + 1, typos);
      return;
    }
    // Una entrada de una lista cerrada puede tener varias fichas («Buenos Aires»).
    const options =
      el.kind === 'class' ? (lists.classes[el.name] ?? []).map((x) => tokenize(x)) : el.options;
    for (const option of options) {
      if (t + option.length > tokens.length) continue;
      const local = [...typos];
      if (option.every((exp, k) => tokenOk(exp, tokens[t + k]!, local)))
        go(e + 1, t + option.length, local);
    }
  };
  go(0, 0, []);
  return best;
}

/** Corrige una respuesta. Lanza si la especificación no es publicable con esas listas. */
export function gradeConstrainedText(
  spec: ConstrainedTextSpec,
  content: { answer: string; accepted_answers: readonly string[] },
  raw: string,
  lists: ClosedLists = EMPTY_LISTS,
): ConstrainedOutcome {
  const problems = constrainedSpecProblems(spec, lists);
  if (problems.length) throw new Error(`constrained_text.v1 inválido: ${problems.join('; ')}`);
  const detail: ConstrainedDetail = {
    pattern: null,
    typos: [],
    matched_constraints: [],
    failed_constraints: [],
    error_tags: [],
  };
  const graded = (verdict: 'correct' | 'typo' | 'incorrect'): ConstrainedOutcome => ({
    status: 'graded',
    verdict,
    detail,
  });
  const pending = (reason: PendingReason): ConstrainedOutcome =>
    spec.allow_pending
      ? { status: 'pending_review', verdict: null, reason, detail }
      : graded('incorrect');

  const tokens = tokenize(raw);
  if (tokens.length === 0) return graded('incorrect');

  // §3.1: answer y accepted_answers siguen valiendo como coincidencias exactas (sin tipeo).
  if (verdictForText(raw, [content.answer, ...content.accepted_answers], false).correct) {
    detail.matched_constraints.push('exact_answer');
    return graded('correct');
  }

  const forbidden = (spec.forbid ?? []).flatMap((f) => {
    const c = /^<([A-Z][A-Z0-9_]*)>$/.exec(f);
    return c ? [...(lists.classes[c[1]!] ?? [])].map((x) => canonicalForm(x)) : tokenize(f);
  });
  const hit = tokens.filter((t) => forbidden.includes(t));
  if (hit.length) {
    detail.failed_constraints.push('forbid');
    detail.error_tags.push('forbidden_word');
    return graded('incorrect');
  }

  const valid = new Set<string>([
    ...(lists.lexicon ?? []).map((x) => canonicalForm(x)),
    ...Object.values(lists.classes)
      .flat()
      .map((x) => canonicalForm(x)),
    ...Object.values(lists.lemma_forms)
      .flat()
      .map((x) => canonicalForm(x)),
    ...spec.accept.flatMap((p) =>
      p.tokens.flatMap((raw) => {
        const e = parseElement(raw);
        return e.kind === 'alt' ? e.options.flat() : [];
      }),
    ),
  ]);

  // Lemas obligatorios (§3.3): alguna forma cerrada presente; sin tabla, la especificación es inválida.
  const lemmas = spec.require_lemmas ?? [];
  const lemmaHits = lemmas.filter((l) =>
    (lists.lemma_forms[l] ?? []).some((f) => tokens.includes(canonicalForm(f))),
  );
  for (const l of lemmas) {
    (lemmaHits.includes(l) ? detail.matched_constraints : detail.failed_constraints).push(
      `lemma:${l}`,
    );
  }

  const patterns = spec.accept.map((p) => p.tokens.map(parseElement));
  const tooLong = tokens.length > spec.max_tokens;
  if (!tooLong) {
    let best: { i: number; m: MatchState } | null = null;
    for (const [i, els] of patterns.entries()) {
      const m = matchPattern(els, tokens, spec, lists, valid);
      if (m && (!best || m.typos.length < best.m.typos.length)) best = { i, m };
    }
    if (best) {
      detail.pattern = best.i;
      detail.typos = best.m.typos;
      detail.matched_constraints.push('pattern');
      if (lemmaHits.length < lemmas.length) {
        detail.error_tags.push('missing_lemma');
        return graded('incorrect');
      }
      return graded(best.m.typos.length ? 'typo' : 'correct');
    }
    detail.failed_constraints.push('pattern');
  } else {
    detail.failed_constraints.push('max_tokens');
    // §5.3: supera el límite pero contiene un patrón aceptado (subsecuencia contigua).
    for (let a = 0; a < tokens.length; a++) {
      for (let b = a + 1; b <= tokens.length; b++) {
        const slice = tokens.slice(a, b);
        if (patterns.some((els) => matchPattern(els, slice, spec, lists, valid))) {
          return pending('too_long_with_pattern');
        }
      }
    }
    return graded('incorrect');
  }

  // §5.3: casos ambiguos (sólo con allow_pending; si no, incorrecta).
  if (lemmas.length > 0 && lemmaHits.length / lemmas.length >= 0.6)
    return pending('shares_required_lemmas');
  if (lists.lexicon && tokens.some((t) => !valid.has(t) && !/^\p{Nd}+$/u.test(t))) {
    return pending('unknown_word');
  }
  return graded('incorrect');
}
