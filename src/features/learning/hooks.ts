import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';
import { useMyProfile } from '@/features/profile/hooks';

import {
  answerServerReview,
  fetchActivityDays,
  fetchCurriculum,
  fetchLearningMastery,
  fetchLearningSummary,
  fetchLessonContent,
  fetchLessonProgress,
  fetchMyWords,
  fetchWordOfTheDay,
  fetchWordPool,
  localDateString,
  startLessonPresentation,
  startServerReview,
  submitLearningSession,
  submitServerReview,
  type ReviewFocus,
  type ServerReviewAttempt,
} from './api';
import { withStatus } from './curriculum';
import { reviewAnswerQueue } from './reviewAnswerQueue';
import { activeCourseOf, type CourseDef } from '@shared/courses';
import { languageConfig } from '@shared/languages';

/**
 * Claves de caché. Lo que depende del contenido (camino, banco de palabras, palabras, palabra del día,
 * dominio) va por CÓDIGO DE CURSO, no por idioma: la base devuelve el contenido del curso del usuario
 * en ese idioma (user_course_for), así que al pasar de inglés desde español a inglés desde portugués
 * la caché del otro curso no se reutiliza. Las llamadas al servidor siguen siendo por idioma.
 */
export const learningKeys = {
  all: ['learning'] as const,
  curriculum: (courseCode: string) => ['learning', 'curriculum', courseCode] as const,
  progress: (userId: string) => ['learning', 'progress', userId] as const,
  lesson: (lessonId: string) => ['learning', 'lesson', lessonId] as const,
  summary: (userId: string) => ['learning', 'summary', userId] as const,
  words: (userId: string, courseCode: string) => ['learning', 'words', userId, courseCode] as const,
  pool: (courseCode: string) => ['learning', 'pool', courseCode] as const,
  wordOfDay: (date: string, courseCode: string) =>
    ['learning', 'word-of-day', date, courseCode] as const,
  mastery: (userId: string, courseCode: string) =>
    ['learning', 'mastery', userId, courseCode] as const,
  activity: (userId: string, from: string, to: string) =>
    ['learning', 'activity', userId, from, to] as const,
};

/** Idioma que estudiás (configuración de shared/languages.ts). */
export function useStudyLanguage() {
  return languageConfig(useIdentity().language);
}

/** Curso que estudiás (el activo del perfil; puede no ser el por defecto de su idioma). */
export function useStudyCourse(): CourseDef | undefined {
  const profile = useMyProfile().data?.profile;
  return profile ? activeCourseOf(profile) : undefined;
}

function useIdentity() {
  const { session } = useAuth();
  const course = useStudyCourse();
  return { userId: session?.user.id, language: course?.target, courseCode: course?.code };
}

/** La consulta del camino de un curso (Aprender, perfil y la precarga de los otros idiomas). */
export function curriculumQuery(course: CourseDef) {
  return {
    queryKey: learningKeys.curriculum(course.code),
    queryFn: () => fetchCurriculum(course.target),
    staleTime: 10 * 60_000,
  };
}

/** Mapa de unidades con estado de cada lección (completada / actual / bloqueada). */
export function useCurriculum() {
  const { userId, language, courseCode } = useIdentity();
  const curriculum = useQuery({
    queryKey: learningKeys.curriculum(courseCode ?? 'none'),
    queryFn: () => fetchCurriculum(language!),
    enabled: Boolean(language),
    staleTime: 10 * 60_000,
  });
  const progress = useQuery({
    queryKey: learningKeys.progress(userId ?? 'anonymous'),
    queryFn: () => fetchLessonProgress(userId!),
    enabled: Boolean(userId),
  });
  const data =
    curriculum.data && progress.data ? withStatus(curriculum.data, progress.data) : undefined;
  return {
    data,
    isPending: curriculum.isPending || progress.isPending,
    isError: curriculum.isError || progress.isError,
    isRefetching: curriculum.isRefetching || progress.isRefetching,
    refetch: () => Promise.all([curriculum.refetch(), progress.refetch()]),
  };
}

export function useLessonContent(lessonId: string) {
  return useQuery(lessonContentQuery(lessonId));
}

export function useLearningSummary() {
  const { userId } = useIdentity();
  return useQuery({
    queryKey: learningKeys.summary(userId ?? 'anonymous'),
    queryFn: fetchLearningSummary,
    enabled: Boolean(userId),
  });
}

/** Días estudiados y protegidos de un rango (calendario de racha). Sólo lee: no toca la racha. */
export function useActivityDays(from: string, to: string, enabled = true) {
  const { userId } = useIdentity();
  return useQuery({
    queryKey: learningKeys.activity(userId ?? 'anonymous', from, to),
    queryFn: () => fetchActivityDays(userId!, from, to),
    enabled: enabled && Boolean(userId),
  });
}

export function useWordOfTheDay() {
  const date = localDateString();
  const { language, courseCode } = useIdentity();
  return useQuery({
    queryKey: learningKeys.wordOfDay(date, courseCode ?? 'none'),
    queryFn: () => fetchWordOfTheDay(language!),
    enabled: Boolean(language),
    staleTime: 60 * 60_000,
  });
}

export function useMyWords() {
  const { userId, language, courseCode } = useIdentity();
  return useQuery({
    queryKey: learningKeys.words(userId ?? 'anonymous', courseCode ?? 'none'),
    queryFn: () => fetchMyWords(userId!, language!),
    enabled: Boolean(userId && language),
  });
}

export function useWordPool() {
  const { language, courseCode } = useIdentity();
  return useQuery({
    ...wordPoolQuery(language ?? 'none', courseCode ?? 'none'),
    enabled: Boolean(language),
  });
}

/**
 * La consulta del banco de palabras (también la usan la precarga de reviewWarmup.ts y la batalla):
 * se pide por idioma y se guarda por curso.
 */
export function wordPoolQuery(language: string, courseCode: string) {
  return {
    queryKey: learningKeys.pool(courseCode),
    queryFn: () => fetchWordPool(language),
    staleTime: 30 * 60_000,
  };
}

/**
 * Presentaciones de la lección registradas por el servidor (fase 2). Una sola vez por sesión: fuera
 * de learningKeys para que guardar la sesión no la vuelva a pedir. Si falla, la lección se juega por
 * la ruta vieja.
 */
export function useLessonPresentation(sessionId: string, lessonId: string) {
  return useQuery(lessonPresentationQuery(sessionId, lessonId));
}

/** La consulta de la presentación (también la usa la precarga de lessonWarmup.ts, con la misma clave). */
export function lessonPresentationQuery(sessionId: string, lessonId: string) {
  return {
    queryKey: ['lesson-presentation', sessionId, lessonId] as const,
    queryFn: () => startLessonPresentation(sessionId, lessonId),
    staleTime: Infinity,
    gcTime: Infinity,
    // Sin reintento: si falla (o vence el tiempo límite), se juega por la ruta vieja sin esperar más.
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  };
}

/** La consulta del contenido de una lección (también la usa la precarga). */
export function lessonContentQuery(lessonId: string) {
  return {
    queryKey: learningKeys.lesson(lessonId),
    queryFn: () => fetchLessonContent(lessonId),
    staleTime: 10 * 60_000,
  };
}

/** Envía la sesión (idempotente por sessionId) y refresca progreso, resumen, palabras y logros. */
export function useSubmitSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitLearningSession,
    // Los resultados no esperan al guardado (se puede seguir enseguida): si la red falla, se reintenta
    // solo. Es seguro: el envío es idempotente por session_id (un reenvío nunca duplica la sesión).
    retry: 3,
    retryDelay: (attempt) => Math.min(8_000, 1_000 * 2 ** attempt),
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: learningKeys.all }),
        qc.invalidateQueries({ queryKey: ['profile', 'achievements'] }),
        qc.invalidateQueries({ queryKey: ['profile', 'player'] }),
      ]),
  });
}

/** Estados visibles del motor y «Para repasar» del SRS vigente (fase 4). */
export function useLearningMastery() {
  const { userId, language, courseCode } = useIdentity();
  return useQuery({
    queryKey: learningKeys.mastery(userId ?? 'anonymous', courseCode ?? 'none'),
    queryFn: () => fetchLearningMastery(language!),
    enabled: Boolean(userId && language),
  });
}

/**
 * Repaso armado por el servidor (fase 4). Una vez por sesión, fuera de learningKeys para que guardar no
 * lo vuelva a pedir. Sin reintento automático ni respaldo: si falla, la pantalla ofrece reintentar con
 * el mismo sessionId (el servidor lo retoma tal cual).
 */
export function useServerReview(
  sessionId: string | null,
  language: string | undefined,
  focus?: ReviewFocus,
) {
  return useQuery({
    ...serverReviewQuery(sessionId ?? '', language ?? '', focus),
    enabled: Boolean(sessionId && language),
  });
}

/** La consulta del repaso del servidor (también la usa la precarga de reviewWarmup.ts, misma clave). */
export function serverReviewQuery(sessionId: string, language: string, focus?: ReviewFocus) {
  return {
    queryKey: ['server-review', sessionId, language, focus ?? null] as const,
    queryFn: async () => {
      // Corrección instantánea: lo que quedó sin registrar (la app se cerró, sin red) se manda antes de
      // retomar, así el servidor devuelve esas respuestas como ya corregidas. Sin red, falla como start.
      await reviewAnswerQueue(sessionId).replay();
      return startServerReview(sessionId, language, focus);
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false as const,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  };
}

/** Corrige una respuesta en el servidor (idempotente: la primera respuesta registrada es la que vale). */
export function useAnswerServerReview(sessionId: string | null) {
  return useMutation({
    mutationFn: (attempt: ServerReviewAttempt) => answerServerReview(sessionId!, attempt),
  });
}

/**
 * Envía el repaso del servidor (idempotente por sessionId) y refresca lo mismo que useSubmitSession.
 * `attempts` puede ser una función: con la corrección instantánea, espera a que se registren las
 * respuestas pendientes (y su fallo es un fallo del guardado, con «Reintentar»).
 */
export function useSubmitServerReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      sessionId: string;
      startedAt: Date;
      attempts: ServerReviewAttempt[] | (() => Promise<ServerReviewAttempt[]>);
    }) =>
      submitServerReview({
        ...input,
        attempts: typeof input.attempts === 'function' ? await input.attempts() : input.attempts,
      }),
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: learningKeys.all }),
        qc.invalidateQueries({ queryKey: ['profile', 'achievements'] }),
        qc.invalidateQueries({ queryKey: ['profile', 'player'] }),
      ]),
  });
}
