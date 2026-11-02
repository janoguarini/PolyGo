import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';
import { useMyProfile } from '@/features/profile/hooks';

import {
  fetchCurriculum,
  fetchLearningSummary,
  fetchLessonContent,
  fetchLessonProgress,
  fetchMyWords,
  fetchWordOfTheDay,
  fetchWordPool,
  localDateString,
  submitLearningSession,
} from './api';
import { withStatus } from './curriculum';
import { languageConfig } from '@shared/languages';

export const learningKeys = {
  all: ['learning'] as const,
  curriculum: (language: string) => ['learning', 'curriculum', language] as const,
  progress: (userId: string) => ['learning', 'progress', userId] as const,
  lesson: (lessonId: string) => ['learning', 'lesson', lessonId] as const,
  summary: (userId: string) => ['learning', 'summary', userId] as const,
  words: (userId: string, language: string) => ['learning', 'words', userId, language] as const,
  pool: (language: string) => ['learning', 'pool', language] as const,
  wordOfDay: (date: string, language: string) =>
    ['learning', 'word-of-day', date, language] as const,
};

/** Idioma que estudiás (configuración de shared/languages.ts). */
export function useStudyLanguage() {
  return languageConfig(useIdentity().language);
}

function useIdentity() {
  const { session } = useAuth();
  const profile = useMyProfile();
  return { userId: session?.user.id, language: profile.data?.profile.target_language };
}

/** Mapa de unidades con estado de cada lección (completada / actual / bloqueada). */
export function useCurriculum() {
  const { userId, language } = useIdentity();
  const curriculum = useQuery({
    queryKey: learningKeys.curriculum(language ?? 'none'),
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
  return useQuery({
    queryKey: learningKeys.lesson(lessonId),
    queryFn: () => fetchLessonContent(lessonId),
    staleTime: 10 * 60_000,
  });
}

export function useLearningSummary() {
  const { userId } = useIdentity();
  return useQuery({
    queryKey: learningKeys.summary(userId ?? 'anonymous'),
    queryFn: fetchLearningSummary,
    enabled: Boolean(userId),
  });
}

export function useWordOfTheDay() {
  const date = localDateString();
  const { language } = useIdentity();
  return useQuery({
    queryKey: learningKeys.wordOfDay(date, language ?? 'none'),
    queryFn: () => fetchWordOfTheDay(language!),
    enabled: Boolean(language),
    staleTime: 60 * 60_000,
  });
}

export function useMyWords() {
  const { userId, language } = useIdentity();
  return useQuery({
    queryKey: learningKeys.words(userId ?? 'anonymous', language ?? 'none'),
    queryFn: () => fetchMyWords(userId!, language!),
    enabled: Boolean(userId && language),
  });
}

export function useWordPool() {
  const { language } = useIdentity();
  return useQuery({
    queryKey: learningKeys.pool(language ?? 'none'),
    queryFn: () => fetchWordPool(language!),
    enabled: Boolean(language),
    staleTime: 30 * 60_000,
  });
}

/** Envía la sesión (idempotente por sessionId) y refresca progreso, resumen, palabras y logros. */
export function useSubmitSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitLearningSession,
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: learningKeys.all }),
        qc.invalidateQueries({ queryKey: ['profile', 'achievements'] }),
        qc.invalidateQueries({ queryKey: ['profile', 'player'] }),
      ]),
  });
}
