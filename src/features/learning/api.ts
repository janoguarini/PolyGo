import type { Exercise, UserAnswer } from '@shared/exercises';
import { LEARNING_CONTRACT, type ReviewGradingKey } from '@shared/learningSession';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import type { Tables } from '@/lib/database.generated';
import { requireSupabase } from '@/lib/supabase';

import { orderByRoute, type LessonProgress, type UnitSummary } from './curriculum';
import { parseExercise } from './schema';

export type WordRow = Tables<'words'>;

/** Introducción de la lección (lessons.intro): explicación breve y ejemplos naturales. */
export interface LessonIntro {
  explanation: string;
  examples: { target: string; base: string; note?: string }[];
}

export interface LessonContent {
  lesson: {
    id: string;
    title: string;
    objective: string;
    unitId: string;
    intro: LessonIntro | null;
    /** Cierre: qué aprendiste (se muestra en los resultados). */
    takeaways: string[];
  };
  exercises: Exercise[];
  words: Record<string, WordRow>;
  /** Versión de ítem de cada ejercicio, tal como se leyó (para comparar con la presentación). */
  versions: Record<string, number | null>;
}

export interface AttemptInput {
  exerciseId?: string;
  wordId?: string;
  answer: string;
  correct: boolean;
  firstTry: boolean;
  responseMs: number;
}

export interface SessionResult {
  session_id: string;
  duplicate: boolean;
  first_try_correct?: number;
  first_try_total?: number;
  accuracy?: number;
  /** Logros desbloqueados por esta sesión (vacío en reenvíos). */
  achievements_unlocked?: { id: string; title: string; icon: string }[];
  /** Ruta corregida en el servidor: el veredicto de cada intento, en orden. */
  verdicts?: {
    presentation_id: number;
    attempt_no: number;
    status: string;
    verdict: string | null;
  }[];
}

export interface LearningSummary {
  streak_days: number;
  active_today: boolean;
  /** Protectores de racha guardados. */
  streak_freezes: number;
  /** Días faltantes que el protector va a cubrir cuando vuelvas a estudiar. */
  freeze_pending: number;
  /** Días de la última semana cubiertos por un protector (YYYY-MM-DD). */
  frozen_dates: string[];
  lessons_completed: number;
  words_seen: number;
  words_mastered: number;
  words_due: number;
  seconds_learning: number;
  today_seconds: number;
  skills: { skill: string; answers: number; correct: number }[];
  frequent_mistakes: { word_id: string; text: string; translation: string; incorrect: number }[];
}

export interface WordProgressEntry {
  word: WordRow;
  stage: number;
  seenCount: number;
  incorrectCount: number;
  nextReviewAt: string | null;
}

export const userTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

export function localDateString(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Orden de unidades del recorrido del usuario (fase C.4, my_curriculum_route): unidad → posición en
 * su ruta. Sólo dibuja: el servidor decide qué está desbloqueado (is_lesson_unlocked). Si la función no
 * responde (un backend anterior), null: el camino queda en el orden por posición de siempre.
 */
export async function fetchCurriculumRoute(
  languageCode: string,
): Promise<Map<string, number> | null> {
  const { data, error } = await requireSupabase().rpc('my_curriculum_route', {
    p_language_code: languageCode,
  });
  // Vacío: sin sesión (la función no sabe de quién es el camino). Mejor el orden de siempre que nada.
  if (error || !data?.length) return null;
  return new Map(data.map((r) => [r.unit_id, r.unit_order]));
}

export async function fetchCurriculum(languageCode: string): Promise<UnitSummary[]> {
  const db = requireSupabase();
  const { data, error } = await db
    .from('curriculum_units')
    .select(
      'id, level, position, title_es, title_en, description_es, emoji, lessons(id, unit_id, position, title_es, objective_es, exercises(count))',
    )
    .eq('language_code', languageCode)
    .order('level')
    .order('position');
  if (error) throw error;
  const route = await fetchCurriculumRoute(languageCode);
  return orderByRoute(data, route).map((u) => ({
    id: u.id,
    level: u.level,
    position: route?.get(u.id) ?? u.position,
    title: u.title_es,
    titleEn: u.title_en,
    description: u.description_es,
    emoji: u.emoji,
    lessons: u.lessons.map((l) => ({
      id: l.id,
      unitId: l.unit_id,
      position: l.position,
      title: l.title_es,
      objective: l.objective_es,
      exerciseCount: l.exercises[0]?.count ?? 0,
    })),
  }));
}

export async function fetchLessonProgress(userId: string): Promise<LessonProgress[]> {
  const { data, error } = await requireSupabase()
    .from('user_lesson_progress')
    .select('lesson_id, times_completed, best_accuracy')
    .eq('user_id', userId);
  if (error) throw error;
  return data.map((p) => ({
    lessonId: p.lesson_id,
    timesCompleted: p.times_completed,
    bestAccuracy: Number(p.best_accuracy),
  }));
}

export async function fetchLessonContent(lessonId: string): Promise<LessonContent> {
  const db = requireSupabase();
  const [lesson, exercises] = await Promise.all([
    db.from('lessons').select('*').eq('id', lessonId).single(),
    db
      .from('exercises')
      .select('*, exercise_words(word_id, words(*))')
      .eq('lesson_id', lessonId)
      .order('position'),
  ]);
  if (lesson.error) throw lesson.error;
  if (exercises.error) throw exercises.error;

  const words: Record<string, WordRow> = {};
  const versions: Record<string, number | null> = {};
  const parsed = exercises.data.map((row) => {
    // database.generated.ts todavía no tiene las columnas de la fase 1 (sin regenerar).
    versions[row.id] = (row as { item_version_id?: number | null }).item_version_id ?? null;
    const ids: string[] = [];
    for (const link of row.exercise_words) {
      ids.push(link.word_id);
      if (link.words) words[link.word_id] = link.words;
    }
    return parseExercise(row, ids);
  });

  return {
    lesson: {
      id: lesson.data.id,
      title: lesson.data.title_es,
      objective: lesson.data.objective_es,
      unitId: lesson.data.unit_id,
      intro: parseIntro(lesson.data.intro),
      takeaways: lesson.data.takeaways ?? [],
    },
    exercises: parsed,
    words,
    versions,
  };
}

/** lessons.intro viene como JSON: se valida la forma en vez de confiar en un cast. */
export function parseIntro(raw: unknown): LessonIntro | null {
  if (!raw || typeof raw !== 'object') return null;
  const { explanation, examples } = raw as Record<string, unknown>;
  if (typeof explanation !== 'string' || !Array.isArray(examples)) return null;
  return {
    explanation,
    examples: examples.flatMap((e) => {
      if (!e || typeof e !== 'object') return [];
      const { target, base, note } = e as Record<string, unknown>;
      return typeof target === 'string' && typeof base === 'string'
        ? [{ target, base, ...(typeof note === 'string' ? { note } : {}) }]
        : [];
    }),
  };
}

export async function submitLearningSession(input: {
  sessionId: string;
  kind: 'lesson' | 'review';
  lessonId: string | null;
  startedAt: Date;
  attempts: AttemptInput[];
  /** Con presentaciones registradas: el servidor corrige (fase 2). Sin ellas, la ruta vieja. */
  graded?: GradedAttemptInput[];
}): Promise<SessionResult> {
  if (input.graded && input.kind === 'lesson' && input.lessonId) {
    try {
      return await invokeLearningSession<SessionResult>(
        {
          action: 'submit',
          session_id: input.sessionId,
          lesson_id: input.lessonId,
          started_at: input.startedAt.toISOString(),
          time_zone: userTimeZone(),
          attempts: input.graded.map((a) => ({
            presentation_id: a.presentationId,
            answer: a.answer,
            client_verdict: a.clientVerdict,
            response_ms: Math.round(a.responseMs),
            assists: a.assists ?? {},
          })),
        },
        SUBMIT_TIMEOUT_MS,
      );
    } catch (err) {
      // Respaldo: si la ruta nueva falla por algo que no es una regla de la lección (red, tiempo,
      // función caída o un rechazo del corrector), se guarda por la ruta vieja con el mismo
      // session_id. Si el envío corregido sí llegó a guardarse, la RPC vieja devuelve duplicate.
      if (!canFallBack(err)) throw err;
    }
  }
  return submitLegacy(input);
}

/** Ruta vieja: submit_learning_session con el veredicto local (repasos, y respaldo de lecciones). */
async function submitLegacy(input: {
  sessionId: string;
  kind: 'lesson' | 'review';
  lessonId: string | null;
  startedAt: Date;
  attempts: AttemptInput[];
}): Promise<SessionResult> {
  const { data, error } = await requireSupabase().rpc('submit_learning_session', {
    p_session_id: input.sessionId,
    p_kind: input.kind,
    // La función SQL no tiene valores por defecto: hay que enviar todos los parámetros o PostgREST
    // no la encuentra. En repasos el servidor ignora p_lesson_id.
    p_lesson_id: input.lessonId ?? '',
    p_started_at: input.startedAt.toISOString(),
    p_time_zone: userTimeZone(),
    p_attempts: input.attempts.map((a) => ({
      exercise_id: a.exerciseId,
      word_id: a.wordId,
      answer: a.answer,
      correct: a.correct,
      first_try: a.firstTry,
      response_ms: Math.round(a.responseMs),
    })),
  });
  if (error) throw error;
  return data as unknown as SessionResult;
}

/** Una presentación registrada por el servidor (Edge Function learning-session, fase 2). */
export interface LessonPresentation {
  presentation_id: number;
  exercise_id: string;
  item_version_id: number;
  option_set_id: number | null;
  option_order: number[] | null;
  /** Opciones en el orden exacto en que hay que mostrarlas (null si el ejercicio no es de elección). */
  options_shown: string[] | null;
}

export interface GradedAttemptInput {
  presentationId: number;
  answer: UserAnswer;
  clientVerdict: 'correct' | 'typo' | 'incorrect';
  responseMs: number;
  assists?: Record<string, number | boolean>;
}

const START_TIMEOUT_MS = 10_000;
const SUBMIT_TIMEOUT_MS = 20_000;

/** Error de la Edge Function con el código que devolvió (`{error: código}`); el mensaje es el código. */
export class LearningSessionHttpError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

/**
 * Reglas de la lección o de la cuenta: la ruta vieja daría el mismo rechazo (o no debe intentarse),
 * así que no hay respaldo. Cualquier otro error de la función sí lo tiene.
 */
const NO_FALLBACK = new Set([
  // Fase 5: la función ya no acepta este contrato; la ruta vieja tampoco es la salida.
  'client_outdated',
  'no_energy',
  'not_authenticated',
  'unauthorized',
  'lesson_locked',
  'lesson_not_found',
  'session_conflict',
  'incomplete_lesson',
  'invalid_started_at',
]);

export const canFallBack = (err: unknown) =>
  !(err instanceof LearningSessionHttpError && NO_FALLBACK.has(err.code));

/** Qué build habla con la Edge Function (sólo para medir; nunca cambia una corrección). */
export function learningClient() {
  const version = Constants.expoConfig?.version;
  return {
    contract: LEARNING_CONTRACT,
    app_version: typeof version === 'string' ? version : null,
    platform:
      Platform.OS === 'ios' || Platform.OS === 'android' || Platform.OS === 'web'
        ? Platform.OS
        : null,
  };
}

async function invokeLearningSession<T>(
  body: Record<string, unknown>,
  timeout: number,
): Promise<T> {
  const { data, error } = await requireSupabase().functions.invoke('learning-session', {
    // Contrato con la Edge Function (fase 5): la función registra qué build usa cada ruta.
    body: { ...body, client: learningClient() },
    timeout,
  });
  if (error) {
    const context = (error as { context?: { json?: () => Promise<unknown> } }).context;
    const payload = (await context?.json?.().catch(() => null)) as { error?: unknown } | null;
    throw typeof payload?.error === 'string' ? new LearningSessionHttpError(payload.error) : error;
  }
  return data as T;
}

/**
 * Registra en el servidor qué se presenta en esta lección (versión, conjunto y orden de opciones).
 * Idempotente por sessionId.
 */
export async function startLessonPresentation(
  sessionId: string,
  lessonId: string,
): Promise<LessonPresentation[]> {
  const data = await invokeLearningSession<{ presentations: LessonPresentation[] }>(
    {
      action: 'start',
      session_id: sessionId,
      lesson_id: lessonId,
    },
    START_TIMEOUT_MS,
  );
  if (!Array.isArray(data?.presentations)) throw new Error('invalid_start_response');
  return data.presentations;
}

export async function fetchLearningSummary(): Promise<LearningSummary> {
  const { data, error } = await requireSupabase().rpc('get_learning_summary', {
    p_time_zone: userTimeZone(),
  });
  if (error) throw error;
  return data as unknown as LearningSummary;
}

export async function fetchWordOfTheDay(languageCode: string): Promise<WordRow | null> {
  const { data, error } = await requireSupabase()
    .rpc('word_of_the_day', { p_date: localDateString(), p_language: languageCode })
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Tus palabras del idioma que estudiás (el progreso de los otros idiomas queda guardado aparte). */
export async function fetchMyWords(
  userId: string,
  languageCode: string,
): Promise<WordProgressEntry[]> {
  const { data, error } = await requireSupabase()
    .from('user_word_progress')
    .select('stage, seen_count, incorrect_count, next_review_at, words!inner(*)')
    .eq('user_id', userId)
    .eq('words.language_code', languageCode)
    .order('next_review_at', { ascending: true });
  if (error) throw error;
  return data.flatMap((row) =>
    row.words
      ? [
          {
            word: row.words,
            stage: row.stage,
            seenCount: row.seen_count,
            incorrectCount: row.incorrect_count,
            nextReviewAt: row.next_review_at,
          },
        ]
      : [],
  );
}

/** Todas las palabras publicadas: se usan como distractores en los repasos. */
export async function fetchWordPool(languageCode: string): Promise<WordRow[]> {
  const { data, error } = await requireSupabase()
    .from('words')
    .select('*')
    .eq('language_code', languageCode);
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------------------------
// Repasos del servidor (fase 4, docs/LEARNING_PHASE4.md §2): el servidor arma el repaso (SRS v2 +
// motor), registra lo que se presenta, corrige cada respuesta y guarda el envío. La app no corrige ni
// elige qué se repasa. Sin respaldo silencioso: si el servidor no responde, la pantalla muestra un
// estado recuperable (mismo session_id: todo es idempotente).

export type ServerVerdict = 'correct' | 'typo' | 'incorrect';

/** Corrección registrada en el servidor para una presentación. */
export interface ReviewAnswered {
  response: UserAnswer;
  status: 'valid' | 'invalid_response';
  verdict: ServerVerdict | null;
  response_ms: number;
  assists: Record<string, number | boolean>;
  /** Respuesta correcta (sólo llega una vez respondida). */
  answer: string;
  explanation: string | null;
}

/** Un ítem del repaso tal como se presentó (learning_review_content), sin la respuesta. */
export interface ReviewItem {
  presentation_id: number;
  position: number;
  item_id: string;
  item_version_id: number;
  concept_id: string;
  dimension: string;
  reason: string;
  type: string;
  skill: string;
  prompt: string;
  payload: unknown;
  options_shown: string[] | null;
  difficulty: number;
  recommended_seconds: number;
  word: WordRow;
  /** Fase 5: todas las palabras de los conceptos léxicos del ítem (la del plan primero). */
  words?: WordRow[];
  answered: ReviewAnswered | null;
  /** Repeticiones ya corregidas de un error (cierre de la fase 4, P4); no son evidencia. */
  retries?: ReviewRetry[];
  /**
   * Clave de corrección (docs/LEARNING_INSTANT_REVIEW.md): con ella la app da el feedback en el momento
   * y registra la respuesta en segundo plano. Ausente (learning-session anterior) = se espera al servidor.
   */
  grading_key?: ReviewGradingKey | null;
}

/** Repetición de un error dentro de la sesión, corregida por el servidor (attempt_no 2 o 3). */
export interface ReviewRetry {
  attempt_no: number;
  response: UserAnswer;
  status: 'valid' | 'invalid_response';
  verdict: ServerVerdict | null;
  response_ms: number;
  assists: Record<string, number | boolean>;
}

/** Repaso Plus (P3): lo arma y lo corrige el servidor, con las reglas de shared/focusReview.ts. */
export type ReviewFocus = { kind: 'smart' } | { kind: 'topic'; unit_id: string };

/** AL17: unidad persistente con la lección de su explicación. */
export interface PersistentUnit {
  concept_id: string;
  dimension: string;
  errors_30d: number;
  difficulty: number;
  intro_lesson_id: string | null;
}

export interface ServerReviewStart {
  session_id: string;
  /**
   * session_expired (P7): la sesión es de otro día local (en la zona registrada al iniciarla) y ya no
   * admite respuestas; `complete` dice si tiene todas las respuestas corregidas (entonces se envía).
   */
  /**
   * content_unavailable (fase 5): el idioma no tiene ejercicios que el servidor pueda presentar y
   * corregir (sin contenido publicado). Se muestra como contenido pendiente, no como «al día».
   */
  status:
    | 'ok'
    | 'up_to_date'
    | 'budget_exhausted'
    | 'srs_v2_disabled'
    | 'session_expired'
    | 'content_unavailable';
  complete?: boolean;
  duplicate?: boolean;
  recommend_lesson?: boolean;
  items: ReviewItem[];
  persistent?: PersistentUnit[];
}

export interface ReviewAnswerResult {
  presentation_id: number;
  /** 1 = la respuesta que vale; 2–3 = repetición de un error (P4). */
  attempt_no?: number;
  /** Ya había una respuesta registrada: vale esa (la de `response`). */
  duplicate: boolean;
  matches: boolean;
  response: UserAnswer;
  status: 'valid' | 'invalid_response';
  verdict: ServerVerdict | null;
  response_ms: number;
  assists: Record<string, number | boolean>;
  answer: string;
  explanation: string | null;
}

export interface ServerReviewAttempt {
  presentationId: number;
  answer: UserAnswer;
  responseMs: number;
  assists?: Record<string, number | boolean>;
  /** 1 (por defecto) = primer intento; 2–3 = repetición de un error, sólo para el feedback (P4). */
  attemptNo?: number;
  /** Veredicto que mostró la app (corrección instantánea): el servidor lo guarda sólo para comparar. */
  clientVerdict?: ServerVerdict;
}

const ANSWER_TIMEOUT_MS = 10_000;

const toWire = (a: ServerReviewAttempt) => ({
  presentation_id: a.presentationId,
  answer: a.answer,
  response_ms: Math.round(a.responseMs),
  assists: a.assists ?? {},
});

export async function startServerReview(
  sessionId: string,
  languageCode: string,
  focus?: ReviewFocus,
): Promise<ServerReviewStart> {
  const data = await invokeLearningSession<ServerReviewStart>(
    {
      action: 'start_review',
      session_id: sessionId,
      language_code: languageCode,
      time_zone: userTimeZone(),
      ...(focus ? { focus } : {}),
    },
    START_TIMEOUT_MS,
  );
  if (!data || typeof data.status !== 'string' || !Array.isArray(data.items)) {
    throw new Error('invalid_start_response');
  }
  return data;
}

export async function answerServerReview(
  sessionId: string,
  attempt: ServerReviewAttempt,
): Promise<ReviewAnswerResult> {
  const data = await invokeLearningSession<ReviewAnswerResult>(
    {
      action: 'answer_review',
      session_id: sessionId,
      attempt: {
        ...toWire(attempt),
        attempt_no: attempt.attemptNo ?? 1,
        ...(attempt.clientVerdict ? { client_verdict: attempt.clientVerdict } : {}),
      },
    },
    ANSWER_TIMEOUT_MS,
  );
  if (!data || typeof data.status !== 'string') throw new Error('invalid_answer_response');
  return data;
}

export async function submitServerReview(input: {
  sessionId: string;
  startedAt: Date;
  attempts: ServerReviewAttempt[];
}): Promise<SessionResult> {
  const data = await invokeLearningSession<SessionResult>(
    {
      action: 'submit_review',
      session_id: input.sessionId,
      started_at: input.startedAt.toISOString(),
      time_zone: userTimeZone(),
      attempts: input.attempts.map(toWire),
    },
    SUBMIT_TIMEOUT_MS,
  );
  // Una respuesta inesperada no se da por guardada: la pantalla ofrece reintentar con el mismo
  // session_id (record_learning_session es idempotente: si ya se guardó, devuelve duplicate).
  if (!data || typeof data !== 'object' || typeof data.session_id !== 'string') {
    throw new Error('invalid_submit_response');
  }
  return data;
}

/** Estados visibles del motor y «Para repasar» (get_learning_mastery, ADAPTIVE_LEARNING_DESIGN 14). */
export interface MasteryCounts {
  no_evidence: number;
  insufficient: number;
  weak: number;
  in_progress: number;
  mastered: number;
}

export interface LearningMastery {
  /** Falso mientras el motor no esté habilitado para mostrarse: no se muestra «Dominadas» (AL12). */
  available: boolean;
  review: { source: 'srs_v1' | 'srs_v2'; due_today: number; due_now: number };
  model_version?: string;
  computed_at?: string | null;
  pending_recompute?: number;
  dimensions?: Record<string, MasteryCounts>;
  retention?: { units: number; mean: number | null };
  speed?: { units: number; median: number | null };
  units?: (MasteryCounts & {
    unit_id: string;
    level: string;
    position: number;
    title: string;
    total: number;
    not_seen: number;
  })[];
  weak?: {
    concept_id: string;
    dimension: string;
    text: string | null;
    translation: string | null;
    mastery: number | null;
    confidence: number | null;
  }[];
}

export async function fetchLearningMastery(languageCode: string): Promise<LearningMastery> {
  const { data, error } = await requireSupabase().rpc(
    // database.generated.ts todavía no tiene las funciones de la fase 4 (sin regenerar).
    'get_learning_mastery' as never,
    { p_language: languageCode, p_time_zone: userTimeZone() } as never,
  );
  if (error) throw error;
  return data as unknown as LearningMastery;
}
