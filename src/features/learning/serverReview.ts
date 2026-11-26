import type { AnswerVerdict } from '@shared/answers';
import { serializeAnswer } from '@shared/answers';
import type { Exercise, UserAnswer } from '@shared/exercises';
import { gradeWithKey, type ReviewGradingKey } from '@shared/learningSession';

import { deviceStorage } from '@/lib/secureStorage';

import type {
  ReviewAnswered,
  ReviewAnswerResult,
  ReviewFocus,
  ReviewItem,
  ServerReviewAttempt,
  ServerVerdict,
  WordRow,
} from './api';
import { MAX_RETRIES, playerReducer, type Attempt, type PlayerState } from './player';
import { attemptKeyOf } from './reviewAnswerQueue';
import { parseExercise } from './schema';

/**
 * Repasos del servidor en la app (fase 4, docs/LEARNING_PHASE4.md §2 y §10). Código puro salvo el
 * almacenamiento de la sesión abierta: convierte lo que presentó el servidor en ejercicios del
 * reproductor, traduce su corrección a un veredicto y arma el envío.
 */

/** Id del ejercicio en el reproductor: una presentación del servidor. */
export const reviewExerciseId = (presentationId: number) => `presentation-${presentationId}`;

export const presentationIdOf = (exerciseId: string) =>
  Number(exerciseId.replace(/^presentation-/, ''));

/**
 * Repeticiones de un error por presentación (P4): las mismas del reproductor (MAX_RETRIES), que tienen
 * que coincidir con las que admite el servidor (MAX_REVIEW_ATTEMPTS − 1, shared/learningSession.ts).
 */
export const SERVER_REVIEW_RETRIES = MAX_RETRIES;

/**
 * Ejercicio del reproductor a partir del ítem presentado. Sin la respuesta: la corrige el servidor
 * (`answer` queda vacío hasta que llega su corrección). Un ítem con un payload que la app no entiende
 * es un error del servidor, no algo que se saltea en silencio.
 */
export function reviewExercise(item: ReviewItem): Exercise {
  return parseExercise(
    {
      id: reviewExerciseId(item.presentation_id),
      lesson_id: '',
      position: item.position,
      type: item.type,
      skill: item.skill,
      prompt_es: item.prompt,
      payload: item.payload,
      answer: item.answered?.answer ?? '',
      accepted_answers: [],
      explanation_es: item.answered?.explanation ?? null,
      difficulty: item.difficulty,
      recommended_seconds: item.recommended_seconds,
    },
    (item.words?.length ? item.words : [item.word]).map((w) => w.id),
  );
}

export function reviewSession(items: ReviewItem[]) {
  const exercises = items.map(reviewExercise).map((e) => ({ ...e, lessonId: null }));
  const words: Record<string, WordRow> = {};
  const shownOptions: Record<string, readonly string[] | null> = {};
  for (const item of items) {
    for (const w of item.words?.length ? item.words : [item.word]) words[w.id] = w;
    shownOptions[reviewExerciseId(item.presentation_id)] = item.options_shown;
  }
  return { exercises, words, shownOptions, answered: answeredAttempts(items) };
}

/** Veredicto del servidor para el reproductor. `invalid_response` cuenta como incorrecta (como en v1). */
export function serverVerdict(
  result: Pick<ReviewAnswered, 'status' | 'verdict' | 'answer'>,
): AnswerVerdict {
  const expected = result.answer;
  if (result.status === 'valid' && (result.verdict === 'correct' || result.verdict === 'typo')) {
    return { correct: true, typo: result.verdict === 'typo', expected };
  }
  return { correct: false, expected };
}

type Graded = Pick<ReviewAnswered, 'response' | 'status' | 'verdict' | 'response_ms' | 'assists'>;

const attemptOf = (presentationId: number, g: Graded, firstTry: boolean): Attempt => ({
  exerciseId: reviewExerciseId(presentationId),
  answer: serializeAnswer(g.response),
  correct: serverVerdict({ status: g.status, verdict: g.verdict, answer: '' }).correct,
  firstTry,
  responseMs: g.response_ms,
  response: g.response,
  ...(Object.keys(g.assists ?? {}).length ? { assists: g.assists } : {}),
});

/**
 * Intentos ya corregidos (retomar una sesión): la primera respuesta de cada presentación y, después,
 * sus repeticiones (que no son evidencia: reviewSubmission las deja afuera).
 */
export function answeredAttempts(items: ReviewItem[]): Attempt[] {
  return items.flatMap((item) =>
    item.answered
      ? [
          attemptOf(item.presentation_id, item.answered, true),
          ...[...(item.retries ?? [])]
            .sort((a, b) => a.attempt_no - b.attempt_no)
            .map((r) => attemptOf(item.presentation_id, r, false)),
        ]
      : [],
  );
}

/** Resultado de answer_review → lo que necesita el reproductor. */
export function remoteGrade(result: ReviewAnswerResult) {
  return {
    verdict: serverVerdict(result),
    response: result.response as UserAnswer,
    responseMs: result.response_ms,
    explanation: result.explanation,
  };
}

/** Envío: una respuesta por presentación, la primera registrada por el servidor (sin repeticiones). */
export function reviewSubmission(state: Pick<PlayerState, 'attempts'>): ServerReviewAttempt[] {
  return state.attempts
    .filter((a) => a.firstTry && a.response)
    .map((a) => ({
      presentationId: presentationIdOf(a.exerciseId),
      answer: a.response!,
      responseMs: a.responseMs,
      ...(a.assists ? { assists: a.assists } : {}),
    }));
}

// Sesión abierta (para retomarla si la app se cierra). Una por idioma y tipo de repaso. Si todavía se
// puede retomar lo decide el SERVIDOR (P7: mismo día local en la zona registrada al iniciarla): la app no
// filtra por su propia fecha, así un cambio de zona horaria o un envío fallido antes de medianoche no
// pierden la sesión (una vencida y completa se envía; una vencida incompleta se deja y se empieza otra).

export interface OpenReview {
  sessionId: string;
  startedAt: string;
  /** Día local del dispositivo al empezar (informativo: la vigencia la decide el servidor). */
  date: string;
}

/** Más allá de esto el plan del servidor ya venció (90 días) y no hay nada que retomar ni enviar. */
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

/** Tipo de repaso de una sesión guardada: el adaptativo o un foco de Plus (P3). */
export const reviewKind = (focus?: ReviewFocus) =>
  !focus
    ? 'review'
    : focus.kind === 'smart'
      ? 'smart'
      : focus.kind === 'topic'
        ? `topic.${focus.unit_id}`
        : `coach.${[...focus.unit_ids].sort().join('+')}`;

const key = (language: string, kind: string) =>
  kind === 'review' ? `polygo.review.open.${language}` : `polygo.review.open.${language}.${kind}`;

export async function loadOpenReview(language: string, kind = 'review', now = Date.now()) {
  try {
    const raw = await deviceStorage.getItem(key(language, kind));
    const open = raw ? (JSON.parse(raw) as Partial<OpenReview>) : null;
    if (
      open &&
      typeof open.sessionId === 'string' &&
      typeof open.startedAt === 'string' &&
      typeof open.date === 'string' &&
      !Number.isNaN(Date.parse(open.startedAt)) &&
      now - Date.parse(open.startedAt) < MAX_AGE_MS
    ) {
      return open as OpenReview;
    }
  } catch {
    // Almacenamiento ilegible: se empieza una sesión nueva.
  }
  return null;
}

export async function saveOpenReview(language: string, open: OpenReview, kind = 'review') {
  try {
    await deviceStorage.setItem(key(language, kind), JSON.stringify(open));
  } catch {
    // Sin almacenamiento la sesión no se puede retomar tras cerrar la app; todo lo demás funciona.
  }
}

export async function clearOpenReview(language: string, kind = 'review') {
  try {
    await deviceStorage.removeItem(key(language, kind));
  } catch {
    // Ídem.
  }
}

// Corrección instantánea (docs/LEARNING_INSTANT_REVIEW.md): con la clave de cada ítem la app corrige en
// el momento con la regla del servidor; el servidor corrige y registra en segundo plano, y prevalece.

const isStringList = (v: unknown) => Array.isArray(v) && v.every((x) => typeof x === 'string');

/** Clave de corrección utilizable, o null (learning-session anterior o una clave que no se entiende). */
function parseGradingKey(raw: unknown): ReviewGradingKey | null {
  const k = raw as Partial<ReviewGradingKey> | null | undefined;
  if (!k || typeof k !== 'object') return null;
  if (typeof k.grading_spec !== 'object' || k.grading_spec === null) return null;
  if (typeof k.answer !== 'string') return null;
  // Sin versión del corrector no se sabe con qué reglas corrige el servidor: se lo espera.
  if (typeof k.grader_version !== 'string') return null;
  if (k.accepted_answers != null && !isStringList(k.accepted_answers)) return null;
  if (k.option_texts != null && !isStringList(k.option_texts)) return null;
  if (
    k.option_order != null &&
    !(Array.isArray(k.option_order) && k.option_order.every((x) => typeof x === 'number'))
  ) {
    return null;
  }
  return {
    grader_version: k.grader_version,
    grading_spec: k.grading_spec,
    answer: k.answer,
    accepted_answers: k.accepted_answers ?? null,
    payload: k.payload ?? null,
    option_texts: k.option_texts ?? null,
    option_order: k.option_order ?? null,
    explanation: typeof k.explanation === 'string' ? k.explanation : null,
  };
}

/** Claves de corrección por ejercicio del reproductor (sólo los ítems que traen una válida). */
export function gradingKeys(items: readonly ReviewItem[]): Record<string, ReviewGradingKey> {
  const keys: Record<string, ReviewGradingKey> = {};
  for (const item of items) {
    const key = parseGradingKey(item.grading_key);
    if (key) keys[reviewExerciseId(item.presentation_id)] = key;
  }
  return keys;
}

/**
 * Veredicto instantáneo con la clave: el mismo que dará answer_review (gradeWithKey es la regla del
 * servidor). null = no se puede corregir en el dispositivo; se espera al servidor como antes.
 */
export function localReviewGrade(
  key: ReviewGradingKey | undefined,
  answer: UserAnswer,
): { verdict: AnswerVerdict; explanation: string | null } | null {
  if (!key) return null;
  const graded = gradeWithKey(key, answer);
  if (!graded) return null;
  return {
    verdict: serverVerdict({ status: graded.status, verdict: graded.verdict, answer: key.answer }),
    explanation: key.explanation,
  };
}

/** Veredicto de la app para el servidor (client_verdict: sólo se guarda para comparar). */
export const clientVerdictOf = (v: AnswerVerdict): ServerVerdict =>
  v.correct ? (v.typo ? 'typo' : 'correct') : 'incorrect';

/**
 * Antes del envío: los intentos con la corrección que registró el servidor (prevalece sobre la de la
 * app). Una sesión terminada no se reabre; cambian el resultado de cada intento y su respuesta.
 */
export function reconcileWithServer(
  state: PlayerState,
  results: ReadonlyMap<string, ReviewAnswerResult>,
): PlayerState {
  const seen = new Map<string, number>();
  let next = state;
  for (const a of state.attempts) {
    const attemptNo = (seen.get(a.exerciseId) ?? 0) + 1;
    seen.set(a.exerciseId, attemptNo);
    const result = results.get(attemptKeyOf(presentationIdOf(a.exerciseId), attemptNo));
    if (!result) continue;
    const graded = remoteGrade(result);
    next = playerReducer(next, {
      type: 'reconcile',
      exerciseId: a.exerciseId,
      attemptNo,
      verdict: graded.verdict,
      response: graded.response,
      answer: serializeAnswer(graded.response),
    });
  }
  return next;
}
