import type { Exercise } from '@shared/exercises';

import type { Tables } from '@/lib/database.generated';
import { requireSupabase } from '@/lib/supabase';

import type { LessonProgress, UnitSummary } from './curriculum';
import { parseExercise } from './schema';

export type WordRow = Tables<'words'>;

export interface LessonContent {
  lesson: { id: string; title: string; objective: string; unitId: string };
  exercises: Exercise[];
  words: Record<string, WordRow>;
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
  return data.map((u) => ({
    id: u.id,
    level: u.level,
    position: u.position,
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
    db.from('lessons').select('id, title_es, objective_es, unit_id').eq('id', lessonId).single(),
    db
      .from('exercises')
      .select('*, exercise_words(word_id, words(*))')
      .eq('lesson_id', lessonId)
      .order('position'),
  ]);
  if (lesson.error) throw lesson.error;
  if (exercises.error) throw exercises.error;

  const words: Record<string, WordRow> = {};
  const parsed = exercises.data.map((row) => {
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
    },
    exercises: parsed,
    words,
  };
}

export async function submitLearningSession(input: {
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

export async function fetchLearningSummary(): Promise<LearningSummary> {
  const { data, error } = await requireSupabase().rpc('get_learning_summary', {
    p_time_zone: userTimeZone(),
  });
  if (error) throw error;
  return data as unknown as LearningSummary;
}

export async function fetchWordOfTheDay(): Promise<WordRow | null> {
  const { data, error } = await requireSupabase()
    .rpc('word_of_the_day', { p_date: localDateString() })
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchMyWords(userId: string): Promise<WordProgressEntry[]> {
  const { data, error } = await requireSupabase()
    .from('user_word_progress')
    .select('stage, seen_count, incorrect_count, next_review_at, words(*)')
    .eq('user_id', userId)
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
