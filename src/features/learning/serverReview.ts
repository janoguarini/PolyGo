import type { AnswerVerdict } from '@shared/answers';
import { serializeAnswer } from '@shared/answers';
import type { Exercise, UserAnswer } from '@shared/exercises';

import { deviceStorage } from '@/lib/secureStorage';

import type {
  ReviewAnswered,
  ReviewAnswerResult,
  ReviewFocus,
  ReviewItem,
  ServerReviewAttempt,
  WordRow,
} from './api';
import { MAX_RETRIES, type Attempt, type PlayerState } from './player';
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
  !focus ? 'review' : focus.kind === 'smart' ? 'smart' : `topic.${focus.unit_id}`;

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
