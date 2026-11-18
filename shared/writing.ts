/**
 * `polygo.writing_check.v1` — producción escrita sin IA (cierre de inglés A1, docs/A1_EN_CLOSURE.md §6).
 *
 * Qué hace y qué NO hace:
 * - Comprueba REQUISITOS OBSERVABLES de un texto: que aparezca una expresión (con sus variantes), una
 *   estructura (patrón de fichas), un número, una cantidad mínima de oraciones o de palabras, la
 *   mayúscula inicial y la puntuación final. Determinista: mismo texto + misma tarea = mismo resultado.
 * - NO juzga si el texto es correcto, natural o adecuado, ni da una nota de calidad. Un requisito
 *   cumplido sólo dice «aparece X», nunca «está bien escrito».
 * - Escritura guiada (`guided`): la tarea se da por completa cuando se cumplen todos sus requisitos
 *   obligatorios. Escritura libre (`free`): nunca hay veredicto; el alumno compara con un modelo y
 *   marca una lista de control (autoevaluación).
 * - Corre en el dispositivo y el texto no se envía ni se guarda: las tareas pueden pedir datos
 *   propios sin chocar con P4 (arquitectura de datos §13.2), porque no hay respuesta registrada.
 *
 * Normalización: NFC, minúsculas, apóstrofo tipográfico → «'», puntuación fuera de las fichas,
 * espacios colapsados. Contracciones: se escriben como variantes en la tarea («i am|i'm»).
 */

export const WRITING_CHECK_ID = 'polygo.writing_check.v1';

export type WritingRequirement =
  | {
      id: string;
      /** Qué se le muestra al alumno (español A1: «Decís tu nombre con My name is…»). */
      label: string;
      kind: 'pattern';
      /**
       * Alguno de los patrones tiene que aparecer como fichas seguidas. Ficha: literal, alternativas
       * `a|b`, `<NUMBER>` (cifra o número en palabras 0–100), `<WORD>` (cualquier palabra).
       * Un literal con espacios no existe: cada ficha es una palabra.
       */
      patterns: string[][];
      optional?: boolean;
    }
  | {
      id: string;
      label: string;
      kind: 'min_sentences' | 'min_words';
      min: number;
      optional?: boolean;
    }
  | { id: string; label: string; kind: 'capital_start' | 'end_punctuation'; optional?: boolean };

export interface WritingTaskDef {
  /** `<idioma>.<nivel>.wt.<slug>`: estable. */
  id: string;
  language: string;
  kind: 'guided' | 'free';
  /** Códigos del mapa que practica (p02, p05…). */
  codes: string[];
  /**
   * Lección tras la que se ofrece: la de la GW, o el repaso final de la última unidad del bloque para
   * la tarea libre (FW). La tarea de bloque declara además su bloque.
   */
  lesson?: string;
  block?: number;
  title: string;
  /** Consigna en español, comprensible para A1. */
  instructions: string;
  /** Preguntas guía en el idioma que se aprende (opcionales). */
  prompts: string[];
  /** Expresiones que la tarea usa antes de enseñarlas en una lección, con su significado. */
  glossary?: { term: string; meaning: string }[];
  /** Puede usar datos inventados: se le dice siempre al alumno. */
  allowInvented: true;
  requirements: WritingRequirement[];
  /** Texto modelo para comparar (no es «la» respuesta). */
  model: string;
  /** Chino: el pinyin del modelo, que la app muestra debajo como apoyo para leerlo. */
  modelReading?: string;
  /** Lista de control para la autoevaluación, en español. */
  checklist: string[];
  maxChars: number;
}

const NUMBER_WORDS = new Set(
  (
    'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen ' +
    'sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred'
  ).split(' '),
);

/**
 * Fichas de un texto. En chino no hay espacios entre palabras: cada carácter es una ficha (los
 * patrones de una tarea en chino se escriben carácter por carácter: ['我', '叫']). El pinyin escrito
 * con espacios da una ficha por sílaba o palabra, como el resto de los idiomas.
 */
export function writingTokens(text: string): string[] {
  return (
    text
      .normalize('NFC')
      .toLowerCase()
      .replace(/[’‘`´]/g, "'")
      .replace(/([㐀-䶿一-鿿])/gu, ' $1 ')
      .match(/[\p{L}\d]+(?:['-][\p{L}\d]+)*/gu) ?? []
  );
}

const isNumber = (t: string) =>
  /^\d+$/.test(t) || NUMBER_WORDS.has(t) || t.split('-').every((p) => NUMBER_WORDS.has(p));

function tokenMatches(pattern: string, token: string): boolean {
  if (pattern === '<NUMBER>') return isNumber(token);
  if (pattern === '<WORD>') return true;
  return pattern.split('|').includes(token);
}

/** ¿El patrón aparece como fichas seguidas en el texto? */
export function hasPattern(tokens: readonly string[], pattern: readonly string[]): boolean {
  if (!pattern.length) return false;
  for (let i = 0; i + pattern.length <= tokens.length; i++)
    if (pattern.every((p, j) => tokenMatches(p, tokens[i + j]!))) return true;
  return false;
}

export const sentencesOf = (text: string) =>
  text
    .split(/[.!?。！？]+|\n+/)
    .map((s) => s.trim())
    .filter((s) => writingTokens(s).length > 0);

export interface WritingCheckResult {
  check: typeof WRITING_CHECK_ID;
  requirements: { id: string; label: string; met: boolean; optional: boolean }[];
  /** Guiada: todos los obligatorios cumplidos. Libre: siempre null (no hay veredicto). */
  complete: boolean | null;
  empty: boolean;
}

export function checkWriting(task: WritingTaskDef, text: string): WritingCheckResult {
  const tokens = writingTokens(text);
  const trimmed = text.trim();
  const requirements = task.requirements.map((r) => {
    let met: boolean;
    switch (r.kind) {
      case 'pattern':
        met = r.patterns.some((p) => hasPattern(tokens, p));
        break;
      case 'min_sentences':
        met = sentencesOf(trimmed).length >= r.min;
        break;
      case 'min_words':
        met = tokens.length >= r.min;
        break;
      case 'capital_start':
        met =
          sentencesOf(trimmed).length > 0 &&
          // El chino no tiene mayúsculas: una oración que empieza con un carácter chino cuenta. En
          // español la oración puede abrir con ¿ o ¡: cuenta la letra que sigue.
          sentencesOf(trimmed).every((s) => /^[¿¡]*(?:\p{Lu}|\d|[㐀-䶿一-鿿])/u.test(s));
        break;
      case 'end_punctuation':
        met = /[.!?。！？]$/.test(trimmed);
        break;
    }
    return { id: r.id, label: r.label, met, optional: !!r.optional };
  });
  const empty = tokens.length === 0;
  return {
    check: WRITING_CHECK_ID,
    requirements,
    complete:
      task.kind === 'guided' ? !empty && requirements.every((r) => r.met || r.optional) : null,
    empty,
  };
}

/** Problemas de definición de una tarea (vacío = válida). */
export function writingTaskProblems(task: WritingTaskDef): string[] {
  const problems: string[] = [];
  const at = task.id;
  if (!/^[a-z]{2}\.[a-c][12]\.wt\.[a-z0-9-]+$/.test(task.id)) problems.push(`${at}: id inválido`);
  if (!task.instructions.trim() || !task.title.trim()) problems.push(`${at}: falta la consigna`);
  if (!task.model.trim()) problems.push(`${at}: falta el texto modelo`);
  if (task.checklist.length < 2)
    problems.push(`${at}: la lista de control tiene que tener 2+ puntos`);
  if (!task.requirements.length) problems.push(`${at}: sin requisitos observables`);
  if (task.model.length > task.maxChars) problems.push(`${at}: el modelo supera maxChars`);
  const ids = task.requirements.map((r) => r.id);
  if (new Set(ids).size !== ids.length) problems.push(`${at}: requisitos con id repetido`);
  // El modelo tiene que cumplir todos los requisitos: si no, la tarea pide algo imposible o mal escrito.
  const result = checkWriting(task, task.model);
  for (const r of result.requirements)
    if (!r.met) problems.push(`${at}: el modelo no cumple «${r.label}»`);
  if (task.kind === 'free' && task.requirements.some((r) => !r.optional && r.kind === 'pattern'))
    problems.push(`${at}: una tarea libre sólo da pistas (patrones opcionales), no requisitos`);
  return problems;
}
