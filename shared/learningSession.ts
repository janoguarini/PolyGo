import { serializeAnswer, type TextRules } from './answers';
import type { UserAnswer } from './exercises';
import {
  gradeWithSpec,
  gradingSpecProblems,
  InvalidResponseError,
  type GradingSpec,
} from './grading';
import { choiceSeed, shuffleOrderV1 } from './shuffle';

/**
 * Núcleo de la Edge Function learning-session (fase 2, docs/LEARNING_ATTEMPTS_PHASE2.md): orden de
 * las presentaciones y corrección autoritativa de una lección. Es código puro: la función de Deno sólo
 * autentica, llama a la base y usa esto (lo empaqueta scripts/build-functions.ts).
 *
 * La corrección es `gradeWithSpec` (shared/grading.ts, contrato polygo.answers.v1) contra la versión
 * de la PRESENTACIÓN registrada, nunca contra el contenido vigente ni contra lo que diga el cliente.
 * El veredicto del cliente se guarda sólo para comparar.
 */

/** Identifica el corrector en exercise_attempt_gradings. Cambiar la corrección exige subirla. */
export const LEARNING_GRADER = {
  grader: 'shared/grading.ts#gradeWithSpec',
  grader_version: '1.0.0',
} as const;

/**
 * Reglas de texto de cada versión del corrector (shared/answers.ts, TextRules). El servidor corrige con
 * las de LEARNING_GRADER (gradeOne), no con las de la app: una regla nueva entra recién cuando se sube
 * la versión y se agrega acá, y la app corrige cada repaso con la versión que declara su clave
 * (gradeWithKey). 1.0.0 = la corrección de producción desde la fase 2.
 */
export const TEXT_RULES_BY_GRADER: Readonly<Record<string, TextRules>> = {
  '1.0.0': { apostropheTypo: true },
};

const GRADER_RULES = TEXT_RULES_BY_GRADER[LEARNING_GRADER.grader_version]!;

/** 1 intento + MAX_RETRIES de src/features/learning/player.ts. */
export const MAX_ATTEMPTS_PER_PRESENTATION = 3;
export const MAX_SESSION_ATTEMPTS = 200;
/**
 * Repasos del servidor: el primer intento más hasta 2 repeticiones de un error dentro de la sesión
 * (cierre de la fase 4, P4). Las repeticiones no son evidencia: no entran en el envío.
 */
export const MAX_REVIEW_ATTEMPTS = 3;

export class LearningSessionError extends Error {
  constructor(
    readonly code: string,
    message?: string,
  ) {
    super(message ?? code);
  }
}

/** Una ubicación del plan (learning_lesson_plan). */
export interface PlanEntry {
  exercise_id: string;
  option_set_id: number | null;
  option_count: number | null;
}

/**
 * Orden de cada ubicación con conjunto de opciones: polygo.shuffle.v1 con la semilla
 * `<session_id>:<exercise_id>`, la misma que usaba la app. Lo registra learning_start_lesson y la
 * app muestra exactamente ese orden (options_shown).
 */
export function presentationOrders(sessionId: string, plan: readonly PlanEntry[]) {
  const orders: Record<string, number[]> = {};
  for (const entry of plan) {
    if (entry.option_set_id === null) continue;
    if (!entry.option_count || entry.option_count < 2) {
      throw new LearningSessionError('invalid_plan', `${entry.exercise_id}: sin opciones`);
    }
    orders[entry.exercise_id] = shuffleOrderV1(
      entry.option_count,
      choiceSeed(sessionId, entry.exercise_id),
    );
  }
  return orders;
}

/** Fotografía de una presentación (learning_session_presentations). */
export interface PresentationSnapshot {
  presentation_id: number;
  exercise_id: string | null;
  item_id: string;
  item_version_id: number;
  grading_spec: GradingSpec;
  grading_mode_id: string;
  answer: string;
  accepted_answers: string[] | null;
  payload: unknown;
  option_set_id: number | null;
  option_order: number[] | null;
  /** Textos del conjunto, en el orden del conjunto. */
  option_texts: string[] | null;
  /** Explicación de la versión presentada (exercise_presentation_snapshot). */
  explanation_es?: string | null;
}

/** Lo que lee la corrección de una presentación (gradeOne). */
export type GradingKey = Pick<
  PresentationSnapshot,
  'grading_spec' | 'answer' | 'accepted_answers' | 'payload' | 'option_texts' | 'option_order'
>;

export type Verdict = 'correct' | 'typo' | 'incorrect';
const VERDICTS: readonly string[] = ['correct', 'typo', 'incorrect'];

/** Lo que manda la app por cada respuesta, en el orden en que ocurrieron. */
export interface SubmittedAttempt {
  presentation_id: number;
  answer: UserAnswer;
  client_verdict?: Verdict | null;
  response_ms: number;
  assists?: Record<string, number | boolean>;
}

/** Fila para submit_learning_session (su formato, sin cambios). */
export interface LegacyAttempt {
  exercise_id: string;
  answer: string;
  correct: boolean;
  first_try: boolean;
  response_ms: number;
}

export interface AttemptGrading {
  presentation_id: number;
  attempt_no: number;
  response: UserAnswer;
  status: 'valid' | 'invalid_response';
  verdict: Verdict | null;
  client_verdict: Verdict | null;
  selected_option: number | null;
  assists: Record<string, number | boolean>;
}

const MAX_TEXT = 500;
const MAX_TOKENS = 40;
const MAX_PAIRS = 12;

const isStr = (v: unknown, max = MAX_TEXT): v is string =>
  typeof v === 'string' && [...v].length <= max;

/** Valida la forma de una respuesta. Una forma imposible rechaza el envío entero. */
export function parseUserAnswer(raw: unknown): UserAnswer {
  const a = raw as { kind?: unknown; value?: unknown } | null;
  if (!a || typeof a !== 'object') throw new LearningSessionError('invalid_answer');
  switch (a.kind) {
    case 'option':
    case 'text':
      if (isStr(a.value)) return { kind: a.kind, value: a.value };
      break;
    case 'tokens':
      if (
        Array.isArray(a.value) &&
        a.value.length <= MAX_TOKENS &&
        a.value.every((t) => isStr(t, 100))
      ) {
        return { kind: 'tokens', value: a.value as string[] };
      }
      break;
    case 'pairs':
      if (
        Array.isArray(a.value) &&
        a.value.length <= MAX_PAIRS &&
        a.value.every(
          (p) => p && typeof p === 'object' && isStr(p.left, 200) && isStr(p.right, 200),
        )
      ) {
        return {
          kind: 'pairs',
          value: (a.value as { left: string; right: string }[]).map((p) => ({
            left: p.left,
            right: p.right,
          })),
        };
      }
      break;
  }
  throw new LearningSessionError('invalid_answer');
}

function parseAssists(raw: unknown): Record<string, number | boolean> {
  if (raw === undefined || raw === null) return {};
  if (typeof raw !== 'object' || Array.isArray(raw))
    throw new LearningSessionError('invalid_assists');
  const out: Record<string, number | boolean> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (!/^[a-z_]{1,40}$/.test(k)) throw new LearningSessionError('invalid_assists');
    if (
      typeof v === 'boolean' ||
      (Number.isInteger(v) && (v as number) >= 0 && (v as number) < 10000)
    ) {
      out[k] = v as number | boolean;
    } else {
      throw new LearningSessionError('invalid_assists');
    }
  }
  return out;
}

const sameMultiset = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && [...a].sort().join('\u0000') === [...b].sort().join('\u0000');

/**
 * ¿La respuesta es de las que esta presentación pudo producir? (arquitectura §9). Si no, la corrección
 * es `invalid_response`: no hay veredicto ni evidencia, y para el SRS v1 cuenta como incorrecta.
 */
function presentedProblem(p: GradingKey, answer: UserAnswer): boolean {
  switch (answer.kind) {
    case 'option':
      return !p.option_texts || !p.option_order || !p.option_texts.includes(answer.value);
    case 'tokens': {
      const payload = p.payload as { type?: string; tokens?: string[] };
      return payload?.type !== 'order_words' || !Array.isArray(payload.tokens)
        ? true
        : !sameMultiset(answer.value, payload.tokens);
    }
    case 'pairs': {
      const payload = p.payload as { type?: string; pairs?: { left: string; right: string }[] };
      if (payload?.type !== 'match_pairs' || !Array.isArray(payload.pairs)) return true;
      const lefts = answer.value.map((x) => x.left);
      const rights = answer.value.map((x) => x.right);
      return (
        new Set(lefts).size !== lefts.length ||
        new Set(rights).size !== rights.length ||
        !sameMultiset(
          lefts,
          payload.pairs.map((x) => x.left),
        ) ||
        !sameMultiset(
          rights,
          payload.pairs.map((x) => x.right),
        )
      );
    }
    case 'text':
      return false;
  }
}

/** Mismo recorte que parse_learning_attempts (left(…, 500) cuenta caracteres, no unidades UTF-16). */
const clipAnswer = (s: string) => [...s].slice(0, MAX_TEXT).join('');
const clipMs = (ms: unknown) =>
  typeof ms === 'number' && Number.isFinite(ms) ? Math.min(Math.max(Math.round(ms), 0), 600000) : 0;

/**
 * Corrige una lección entera. Rechaza (LearningSessionError) lo que no puede venir de una app honesta:
 * presentaciones ajenas o inexistentes, respuestas mal formadas, más intentos de los permitidos o un
 * reintento después de acertar. Devuelve, en el mismo orden, las filas para submit_learning_session
 * (con el veredicto del servidor) y las correcciones.
 */
export function gradeLessonAttempts(
  snapshots: readonly PresentationSnapshot[],
  rawAttempts: readonly unknown[],
): { attempts: LegacyAttempt[]; gradings: AttemptGrading[] } {
  if (
    !Array.isArray(rawAttempts) ||
    rawAttempts.length === 0 ||
    rawAttempts.length > MAX_SESSION_ATTEMPTS
  ) {
    throw new LearningSessionError('invalid_attempts');
  }
  const byId = new Map(snapshots.map((s) => [s.presentation_id, s]));
  const history = new Map<number, { count: number; solved: boolean }>();
  const attempts: LegacyAttempt[] = [];
  const gradings: AttemptGrading[] = [];

  for (const raw of rawAttempts) {
    const a = raw as Partial<SubmittedAttempt> | null;
    const p = a && typeof a.presentation_id === 'number' ? byId.get(a.presentation_id) : undefined;
    if (!a || !p || !p.exercise_id) throw new LearningSessionError('presentation_not_found');
    const answer = parseUserAnswer(a.answer);
    const assists = parseAssists(a.assists);
    const clientVerdict =
      a.client_verdict === undefined || a.client_verdict === null
        ? null
        : VERDICTS.includes(a.client_verdict)
          ? a.client_verdict
          : (() => {
              throw new LearningSessionError('invalid_client_verdict');
            })();

    const seen = history.get(p.presentation_id) ?? { count: 0, solved: false };
    if (seen.solved || seen.count >= MAX_ATTEMPTS_PER_PRESENTATION) {
      throw new LearningSessionError('invalid_sequence');
    }
    const attemptNo = seen.count + 1;
    const { correct, grading } = gradeOne(
      p,
      answer,
      assists,
      clientVerdict as Verdict | null,
      attemptNo,
    );
    history.set(p.presentation_id, { count: attemptNo, solved: correct });

    attempts.push({
      exercise_id: p.exercise_id,
      answer: clipAnswer(serializeAnswer(answer)),
      correct,
      first_try: attemptNo === 1,
      response_ms: clipMs(a.response_ms),
    });
    gradings.push(grading);
  }
  return { attempts, gradings };
}

/**
 * Veredicto de una respuesta contra lo presentado: la regla de gradeOne, sin registrar nada. La usan el
 * servidor (gradeOne) y la app para el feedback instantáneo de los repasos (gradeWithKey), así los dos
 * corrigen exactamente igual. Quien llama comprueba antes el grading_spec.
 */
function gradePresented(
  p: GradingKey,
  answer: UserAnswer,
  rules: TextRules,
): { status: AttemptGrading['status']; verdict: Verdict | null } {
  if (presentedProblem(p, answer)) return { status: 'invalid_response', verdict: null };
  try {
    const v = gradeWithSpec(
      p.grading_spec,
      { answer: p.answer, accepted_answers: p.accepted_answers ?? [], payload: p.payload },
      answer,
      rules,
    );
    return { status: 'valid', verdict: v.correct ? (v.typo ? 'typo' : 'correct') : 'incorrect' };
  } catch (err) {
    if (!(err instanceof InvalidResponseError)) throw err;
    return { status: 'invalid_response', verdict: null };
  }
}

/** Corrige una respuesta contra la versión presentada (la misma regla para lecciones y repasos). */
function gradeOne(
  p: PresentationSnapshot,
  answer: UserAnswer,
  assists: Record<string, number | boolean>,
  clientVerdict: Verdict | null,
  attemptNo: number,
): { correct: boolean; grading: AttemptGrading } {
  {
    if (gradingSpecProblems(p.grading_spec).length) {
      throw new LearningSessionError('invalid_grading_spec', p.item_id);
    }
    const { status, verdict } = gradePresented(p, answer, GRADER_RULES);
    const correct = verdict === 'correct' || verdict === 'typo';
    return {
      correct,
      grading: {
        presentation_id: p.presentation_id,
        attempt_no: attemptNo,
        response: answer,
        status,
        verdict,
        client_verdict: clientVerdict,
        selected_option:
          status === 'valid' && answer.kind === 'option' && p.option_texts
            ? p.option_texts.indexOf(answer.value)
            : null,
        assists,
      },
    };
  }
}

// ---------------------------------------------------------------------------------------------
// Repasos generados en el servidor (fase 3, origen adaptive_review): ítems del catálogo sin ubicación.

/** Entrada del plan del servidor con lo necesario para presentar el ítem. */
export interface ReviewPlanEntry {
  item_id: string;
  option_count: number | null;
}

/** Orden de las opciones de cada ítem de elección: polygo.shuffle.v1 con semilla `<sesión>:<ítem>`. */
export function reviewPresentationOrders(sessionId: string, entries: readonly ReviewPlanEntry[]) {
  const orders: Record<string, number[]> = {};
  for (const e of entries) {
    if (e.option_count === null) continue;
    if (!Number.isInteger(e.option_count) || e.option_count < 2) {
      throw new LearningSessionError('invalid_plan', `${e.item_id}: sin opciones`);
    }
    orders[e.item_id] = shuffleOrderV1(e.option_count, `${sessionId}:${e.item_id}`);
  }
  return orders;
}

/** Fila para submit_learning_session en un repaso: una palabra publicada por intento, sin reintentos. */
export interface LegacyReviewAttempt {
  word_id: string;
  answer: string;
  correct: boolean;
  first_try: true;
  response_ms: number;
}

/**
 * Corrige un repaso del servidor. Una respuesta por presentación (los repasos no tienen reintentos:
 * la RPC de repasos exige primeros intentos y palabras distintas); la palabra de cada presentación la
 * fija el plan del servidor (`wordByItem`), nunca la app.
 */
export function gradeReviewAttempts(
  snapshots: readonly PresentationSnapshot[],
  rawAttempts: readonly unknown[],
  wordByItem: Readonly<Record<string, string>>,
): { attempts: LegacyReviewAttempt[]; gradings: AttemptGrading[] } {
  if (
    !Array.isArray(rawAttempts) ||
    rawAttempts.length === 0 ||
    rawAttempts.length > snapshots.length
  ) {
    throw new LearningSessionError('invalid_attempts');
  }
  const done = new Set<number>();
  const attempts: LegacyReviewAttempt[] = [];
  const gradings: AttemptGrading[] = [];
  for (const raw of rawAttempts) {
    const one = gradeReviewAnswer(snapshots, raw, wordByItem);
    if (done.has(one.grading.presentation_id)) throw new LearningSessionError('invalid_sequence');
    done.add(one.grading.presentation_id);
    attempts.push(one.attempt);
    gradings.push(one.grading);
  }
  return { attempts, gradings };
}

// ---------------------------------------------------------------------------------------------
// Fase 5 (docs/LEARNING_PHASE5.md): record_learning_session, la vía autoritativa de los repasos del
// servidor para ítems de uno o varios conceptos y de cualquier dimensión.

/**
 * Versión del contrato entre la app y la Edge Function. 1 = builds sin el campo (fases 2–4); 2 = repasos
 * por record_learning_session y estado content_unavailable. La app la manda en cada pedido; la función
 * la registra (learning_session_clients) para saber cuándo la ruta vieja deja de usarse.
 */
export const LEARNING_CONTRACT = 2;

export interface ClientInfo {
  contract: number;
  app_version: string | null;
  platform: 'ios' | 'android' | 'web' | null;
}

/** Lo que manda la app en `client`. Sin el campo (o mal formado) es una build del contrato 1. */
export function parseClientInfo(raw: unknown): ClientInfo {
  const c = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const contract =
    Number.isInteger(c.contract) && (c.contract as number) >= 1 && (c.contract as number) <= 1000
      ? (c.contract as number)
      : 1;
  const version =
    typeof c.app_version === 'string' && /^[0-9A-Za-z._+-]{1,40}$/.test(c.app_version)
      ? c.app_version
      : null;
  const platform =
    c.platform === 'ios' || c.platform === 'android' || c.platform === 'web' ? c.platform : null;
  return { contract, app_version: version, platform };
}

/** Corrección de record_learning_session: la de siempre + lo que se guarda en exercise_attempts. */
export interface RecordedGrading extends AttemptGrading {
  response_ms: number;
  /** serializeAnswer(response), recortada como en parse_learning_attempts. */
  answer_text: string;
}

/**
 * Corrige un repaso del servidor para record_learning_session. La misma regla que gradeReviewAnswer
 * (gradeOne contra la versión presentada) pero sin exigir una palabra por presentación: los conceptos y
 * las palabras de cada ítem los decide la base desde item_concepts, nunca la app. `planItems` es el plan
 * registrado (srs_session_plans.items): sólo se corrige lo que el servidor planificó. Una respuesta por
 * presentación; las repeticiones de errores (P4) no se envían.
 */
export function gradeRecordedAttempts(
  snapshots: readonly PresentationSnapshot[],
  rawAttempts: readonly unknown[],
  planItems: Readonly<Record<string, string>>,
): RecordedGrading[] {
  if (
    !Array.isArray(rawAttempts) ||
    rawAttempts.length === 0 ||
    rawAttempts.length > snapshots.length
  ) {
    throw new LearningSessionError('invalid_attempts');
  }
  const done = new Set<number>();
  return rawAttempts.map((raw) => {
    const { grading, attempt, responseMs } = gradeReviewAnswer(snapshots, raw, planItems);
    if (done.has(grading.presentation_id)) throw new LearningSessionError('invalid_sequence');
    done.add(grading.presentation_id);
    return { ...grading, response_ms: responseMs, answer_text: attempt.answer };
  });
}

/**
 * Corrige UNA respuesta de un repaso del servidor (fase 4, acción answer_review): la misma regla que
 * gradeReviewAttempts, para dar el feedback del servidor en el momento. La corrección se registra
 * (review_presentation_answers) y el envío final tiene que traer exactamente esa respuesta.
 */
export function gradeReviewAnswer(
  snapshots: readonly PresentationSnapshot[],
  raw: unknown,
  wordByItem: Readonly<Record<string, string>>,
  attemptNo = 1,
): { attempt: LegacyReviewAttempt; grading: AttemptGrading; responseMs: number } {
  // Repetición de un error dentro de la sesión (cierre de la fase 4, P4): se corrige con la misma regla,
  // pero no es evidencia ni entra en el envío (sólo el primer intento lo hace).
  if (!Number.isInteger(attemptNo) || attemptNo < 1 || attemptNo > MAX_REVIEW_ATTEMPTS) {
    throw new LearningSessionError('invalid_attempt_no');
  }
  const a = raw as Partial<SubmittedAttempt> | null;
  const p =
    a && typeof a.presentation_id === 'number'
      ? snapshots.find((s) => s.presentation_id === a.presentation_id)
      : undefined;
  if (!a || !p || p.exercise_id !== null) throw new LearningSessionError('presentation_not_found');
  const word = wordByItem[p.item_id];
  if (!word) throw new LearningSessionError('presentation_not_found');
  const answer = parseUserAnswer(a.answer);
  const assists = parseAssists(a.assists);
  const clientVerdict =
    a.client_verdict === undefined || a.client_verdict === null
      ? null
      : VERDICTS.includes(a.client_verdict)
        ? (a.client_verdict as Verdict)
        : (() => {
            throw new LearningSessionError('invalid_client_verdict');
          })();
  const { correct, grading } = gradeOne(p, answer, assists, clientVerdict, attemptNo);
  const responseMs = clipMs(a.response_ms);
  return {
    attempt: {
      word_id: word,
      answer: clipAnswer(serializeAnswer(answer)),
      correct,
      first_try: true,
      response_ms: responseMs,
    },
    grading,
    responseMs,
  };
}

// ---------------------------------------------------------------------------------------------
// Corrección instantánea de los repasos (docs/LEARNING_INSTANT_REVIEW.md). start_review manda, junto con
// cada ítem, la clave con la que el servidor lo corrige: la app da el feedback en el momento con la misma
// regla (gradeWithKey → gradePresented) y registra la respuesta en segundo plano (answer_review). El
// servidor sigue siendo la autoridad: corrige y registra cada respuesta, y su veredicto prevalece.

/** Clave de corrección de un ítem de repaso: lo que lee gradePresented y la explicación. */
export interface ReviewGradingKey extends GradingKey {
  explanation: string | null;
  /** Versión del corrector que corrige este repaso en el servidor (LEARNING_GRADER). */
  grader_version: string;
}

export const reviewGradingKey = (p: PresentationSnapshot): ReviewGradingKey => ({
  grader_version: LEARNING_GRADER.grader_version,
  grading_spec: p.grading_spec,
  answer: p.answer,
  accepted_answers: p.accepted_answers ?? null,
  payload: p.payload,
  option_texts: p.option_texts ?? null,
  option_order: p.option_order ?? null,
  explanation: p.explanation_es ?? null,
});

/**
 * Ítems de learning_review_content con su clave (`grading_key`), tomada de la presentación registrada
 * (learning_session_presentations): la misma fotografía con la que answer_review y submit_review
 * corrigen. Un ítem sin presentación de repaso queda con `grading_key: null` (la app espera al servidor).
 */
export function withGradingKeys<T extends { presentation_id: number }>(
  items: readonly T[],
  snapshots: readonly PresentationSnapshot[],
): (T & { grading_key: ReviewGradingKey | null })[] {
  const byId = new Map(
    snapshots.filter((s) => s.exercise_id === null).map((s) => [s.presentation_id, s]),
  );
  return items.map((item) => {
    const p = byId.get(item.presentation_id);
    return { ...item, grading_key: p ? reviewGradingKey(p) : null };
  });
}

/**
 * Veredicto de una respuesta con la clave de un ítem: el mismo que dará el servidor, con las reglas de
 * SU versión del corrector. `null` si la clave no sirve para corregir (versión del corrector que esta
 * app no conoce, grading_spec desconocido o inválido): entonces la app espera al servidor.
 */
export function gradeWithKey(
  key: ReviewGradingKey,
  answer: UserAnswer,
): { status: AttemptGrading['status']; verdict: Verdict | null } | null {
  const rules = Object.prototype.hasOwnProperty.call(TEXT_RULES_BY_GRADER, key.grader_version)
    ? TEXT_RULES_BY_GRADER[key.grader_version]
    : undefined;
  if (!rules || gradingSpecProblems(key.grading_spec).length) return null;
  try {
    return gradePresented(key, answer, rules);
  } catch {
    return null;
  }
}
