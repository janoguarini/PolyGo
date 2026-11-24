import type { Exercise } from './exercises';

/**
 * Test de nivel (Fase 4, docs/PLACEMENT_TEST.md). Motor puro: sin red, sin azar y sin reloj. Las mismas
 * respuestas dan siempre el mismo resultado.
 *
 * El banco de un curso (content/placement/) está ordenado por dificultad en «bandas»: cada nivel
 * publicado del curso tiene dos (primera y segunda mitad de sus unidades) y cada banda tres preguntas
 * sacadas de las lecciones reales de esas unidades.
 *
 * Regla (escalera simple):
 * - Se empieza por la banda más fácil y se pregunta de a una.
 * - Una banda se SUPERA con 2 aciertos y se PIERDE con 2 errores (de 3 preguntas, como máximo).
 * - Superada → se pasa a la banda siguiente. Perdida → el test termina. Superadas todas → termina.
 * - Duración: entre 2 y 3 × bandas preguntas (curso con A1 y A2: de 2 a 12).
 *
 * Resultado: un nivel está DOMINADO si se superaron sus dos bandas. El nivel asignado es el primero
 * que no está dominado (empezar por lo que todavía no sabe), acotado al último nivel del banco: nunca
 * más que la evidencia ni más que el contenido publicado.
 */

export const PLACEMENT_VERSION = 'placement-v1';
export const BAND_SIZE = 3;
export const PASS_AT = 2;
export const FAIL_AT = 2;

/** Qué evalúa una pregunta (progresión del test). */
export const PLACEMENT_DIMENSIONS = [
  'vocabulary', //  vocabulario: qué significa una palabra
  'grammar', //     gramática: la forma correcta en una frase
  'sentences', //   comprensión de frases: la palabra que da sentido a una frase
  'structures', //  estructuras: ordenar una oración
  'context', //     uso en contexto: entender un mensaje o responder en una situación
] as const;
export type PlacementDimension = (typeof PLACEMENT_DIMENSIONS)[number];

export interface PlacementItem {
  /** Id del ejercicio de la lección de la que sale (trazabilidad: no se inventan preguntas). */
  sourceId: string;
  dimension: PlacementDimension;
  /** Unidad de origen (posición dentro del nivel). */
  unit: number;
  exercise: Exercise;
}

export interface PlacementBand {
  level: string;
  /** 1 = primera mitad de las unidades del nivel; 2 = segunda. */
  half: 1 | 2;
  items: PlacementItem[];
}

export interface PlacementLevelInfo {
  level: string;
  /** Título de la primera unidad del nivel (contenido del curso, en su idioma de origen). */
  firstUnitTitle: string;
  units: number;
}

export interface PlacementBank {
  courseCode: string;
  version: string;
  /** Niveles del banco, en orden. */
  levels: PlacementLevelInfo[];
  /** En orden de dificultad: A1·1, A1·2, A2·1, A2·2… */
  bands: PlacementBand[];
  /**
   * Sólo en cursos con caracteres chinos: el pinyin de cada palabra que aparece en las preguntas
   * (texto → romanización, del vocabulario del curso y de EXTRA_READINGS). El test se hace antes de
   * empezar el curso, sin el banco de palabras del servidor, así que la lectura viaja con el banco.
   */
  readings?: Record<string, string>;
}

export interface PlacementAnswer {
  band: number;
  sourceId: string;
  correct: boolean;
}

export interface PlacementState {
  bank: PlacementBank;
  band: number;
  answers: PlacementAnswer[];
  /** Bandas superadas (siempre las primeras: el test se detiene en la primera perdida). */
  passed: number;
  finished: boolean;
}

export interface PlacementResult {
  /** Nivel asignado (desde el que empieza el curso). */
  level: string;
  /** Niveles dominados (las dos bandas superadas). */
  mastered: string[];
  /** Superó también la primera mitad del nivel asignado. */
  partial: boolean;
  /** Superó todas las bandas: sabe al menos lo que el curso tiene publicado. */
  topReached: boolean;
  correct: number;
  answered: number;
  passedBands: number;
  totalBands: number;
  version: string;
}

/** Un banco sirve si tiene al menos una banda con preguntas. */
export function createPlacement(bank: PlacementBank): PlacementState {
  if (bank.bands.length === 0 || bank.bands.some((b) => b.items.length < BAND_SIZE)) {
    throw new Error(`placement bank ${bank.courseCode} is incomplete`);
  }
  return { bank, band: 0, answers: [], passed: 0, finished: false };
}

const bandAnswers = (state: PlacementState, band = state.band) =>
  state.answers.filter((a) => a.band === band);

/** La pregunta en pantalla; null si el test terminó. */
export function currentItem(state: PlacementState): PlacementItem | null {
  if (state.finished) return null;
  const items = state.bank.bands[state.band]!.items;
  return items[bandAnswers(state).length] ?? null;
}

/** Registra la respuesta a la pregunta actual y avanza (o termina). Un test terminado no cambia. */
export function answerPlacement(state: PlacementState, correct: boolean): PlacementState {
  const item = currentItem(state);
  if (!item) return state;
  const answers = [...state.answers, { band: state.band, sourceId: item.sourceId, correct }];
  const inBand = answers.filter((a) => a.band === state.band);
  const right = inBand.filter((a) => a.correct).length;
  const wrong = inBand.length - right;
  if (right >= PASS_AT) {
    const passed = state.passed + 1;
    const finished = passed >= state.bank.bands.length;
    return { ...state, answers, passed, band: finished ? state.band : state.band + 1, finished };
  }
  if (wrong >= FAIL_AT) return { ...state, answers, finished: true };
  return { ...state, answers };
}

/** Repite las respuestas en orden: el estado depende sólo de ellas (reproducible). */
export function replayPlacement(bank: PlacementBank, answers: readonly boolean[]): PlacementState {
  return answers.reduce(answerPlacement, createPlacement(bank));
}

/** Preguntas máximas del test para este banco. */
export const maxQuestions = (bank: PlacementBank) => bank.bands.length * BAND_SIZE;

/**
 * Progreso para la barra (0–1): bandas cerradas más lo respondido de la actual. No retrocede al
 * terminar antes de tiempo: un test terminado es 1.
 */
export function placementProgress(state: PlacementState): number {
  if (state.finished) return 1;
  const total = state.bank.bands.length;
  return Math.min(1, (state.passed + bandAnswers(state).length / BAND_SIZE) / total);
}

/** Resultado de un test terminado (null si sigue en curso). */
export function placementResult(state: PlacementState): PlacementResult | null {
  if (!state.finished) return null;
  const { bank } = state;
  const levels = bank.levels.map((l) => l.level);
  const masteredCount = Math.min(Math.floor(state.passed / 2), levels.length);
  const topReached = state.passed >= bank.bands.length;
  const index = Math.min(masteredCount, levels.length - 1);
  const level = levels[index]!;
  // Superó la primera banda del nivel asignado (y no dominó el nivel entero).
  const partial = !topReached && state.passed % 2 === 1;
  const correct = state.answers.filter((a) => a.correct).length;
  return {
    level,
    mastered: levels.slice(0, masteredCount),
    partial,
    topReached,
    correct,
    answered: state.answers.length,
    passedBands: state.passed,
    totalBands: bank.bands.length,
    version: bank.version,
  };
}

const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/** Deja en el banco sólo los niveles publicados (por si el contenido se retira): nunca de más. */
export function limitBankToLevels(
  bank: PlacementBank,
  published: readonly string[],
): PlacementBank {
  // Sólo un prefijo continuo de niveles: si falta A1, no se puede ubicar en A2.
  const levels: PlacementLevelInfo[] = [];
  for (const info of bank.levels) {
    if (!published.includes(info.level)) break;
    levels.push(info);
  }
  const kept = new Set(levels.map((l) => l.level));
  return { ...bank, levels, bands: bank.bands.filter((b) => kept.has(b.level)) };
}

/** Un banco con un solo nivel no tiene nada que distinguir: el curso empieza en ese nivel. */
export const placementUseful = (bank: PlacementBank | null | undefined): bank is PlacementBank =>
  Boolean(bank && bank.levels.length >= 2 && bank.bands.length >= 2);

/** Orden MCER (A1 < A2 < …). -1 si no es un nivel. */
export const levelRank = (level: string) => CEFR.indexOf(level);
