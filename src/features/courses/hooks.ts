import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';

import { defaultCourseFor, type CourseDef } from '@shared/courses';

import { useAuth } from '@/features/auth/AuthProvider';
import { setTargetLanguage } from '@/features/profile/api';
import { useMyProfile, useSwitchStudy } from '@/features/profile/hooks';
import {
  getInterfaceLanguage,
  setInterfaceLanguage,
  setPendingInterfaceLanguage,
  useInterfaceLanguageHydrated,
  usePendingInterfaceLanguage,
  type InterfaceLanguage,
} from '@/i18n';

import { fetchMyCourses, setActiveCourse } from './api';
import {
  chooseInterfaceLanguage,
  profileLanguageDecision,
  syncPendingInterfaceLanguage,
} from './interfaceLanguageSync';
import { courseForLanguage, languageStartLevel, type CourseProfile } from './level';

/** Dentro de ['profile']: cambiar de idioma (useSetTargetLanguage) ya invalida ['profile']. */
export const courseKeys = {
  mine: (userId: string) => ['profile', 'courses', userId] as const,
};

/** Cursos del usuario; `data === null` = migración sin aplicar (modelo anterior). */
export function useMyCourses() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: courseKeys.mine(userId ?? 'anonymous'),
    queryFn: () => fetchMyCourses(userId!),
    enabled: Boolean(userId),
  });
}

/**
 * Nivel desde el que empieza el camino de un idioma (por defecto, el que estudia). Mientras cargan los
 * cursos, o si fallan, usa la regla anterior (no bloquea Aprender ni el perfil).
 */
export function useLanguageStartLevel(language?: string): string | undefined {
  const me = useMyProfile();
  const courses = useMyCourses();
  const profile = me.data?.profile as CourseProfile | undefined;
  if (!profile) return undefined;
  return languageStartLevel(profile, courses.data ?? null, language);
}

/**
 * Resolvedor idioma → curso (el que devuelve la base para ese idioma, user_course_for): para las
 * claves de caché por curso de las listas de idiomas. Sin perfil, el curso por defecto.
 */
export function useCourseForLanguage(): (language: string) => CourseDef {
  const profile = useMyProfile().data?.profile as CourseProfile | undefined;
  const enrollments = useMyCourses().data ?? null;
  return useCallback(
    (language: string) =>
      profile ? courseForLanguage(profile, language, enrollments) : defaultCourseFor(language),
    [profile, enrollments],
  );
}

/** Resolvedor para listas de idiomas (perfil): idioma → nivel inicial. */
export function useLanguageStartLevels(): ((language: string) => string) | undefined {
  const me = useMyProfile();
  const courses = useMyCourses();
  const profile = me.data?.profile as CourseProfile | undefined;
  if (!profile) return undefined;
  const enrollments = courses.data ?? null;
  return (language: string) => languageStartLevel(profile, enrollments, language);
}

/**
 * El idioma de la interfaz guardado en el perfil manda sobre el del dispositivo (la misma cuenta en
 * otro teléfono ve el mismo idioma). null = no lo eligió: se queda el del dispositivo.
 */
export function useApplyProfileInterfaceLanguage() {
  const me = useMyProfile();
  const qc = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;
  const hydrated = useInterfaceLanguageHydrated();
  const pending = usePendingInterfaceLanguage();
  const profileLoaded = Boolean(me.data);
  const saved = (me.data?.profile as CourseProfile | undefined)?.interface_language;
  // Cada recarga del perfil (dataUpdatedAt) es una ocasión de reintentar una elección pendiente.
  const updatedAt = me.dataUpdatedAt;
  useEffect(() => {
    if (!hydrated || !userId || !profileLoaded) return;
    const decision = profileLanguageDecision({
      saved,
      userId,
      current: getInterfaceLanguage(),
      pending,
    });
    if (decision.action === 'discard-pending') void setPendingInterfaceLanguage(null);
    else if (decision.action === 'sync') void syncPendingInterfaceLanguage({ userId, qc });
    else if (decision.action === 'apply') void setInterfaceLanguage(decision.lang);
  }, [hydrated, userId, profileLoaded, saved, pending, updatedAt, qc]);

  // Al volver la app a primer plano (p. ej. con conexión otra vez), reintenta sin esperar.
  useEffect(() => {
    if (!userId) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void syncPendingInterfaceLanguage({ userId, qc, force: true });
    });
    return () => sub.remove();
  }, [userId, qc]);
}

/** Elección manual del idioma de la interfaz para la cuenta actual (ver interfaceLanguageSync.ts). */
export function useChooseInterfaceLanguage() {
  const qc = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;
  return useCallback(
    (language: InterfaceLanguage) => chooseInterfaceLanguage(language, { userId, qc }),
    [userId, qc],
  );
}

/**
 * Cambia el idioma de la interfaz desde Ajustes: al instante en el dispositivo y después en la base.
 * Nunca falla: si la base no responde o no lo acepta, la elección queda pendiente y se reintenta.
 */
export function useChangeInterfaceLanguage() {
  const choose = useChooseInterfaceLanguage();
  return useMutation({ mutationFn: (language: InterfaceLanguage) => choose(language) });
}

/**
 * Cambia el curso activo (set_active_course; sin la migración, set_target_language con el idioma del
 * curso). El progreso, el nivel y el ELO de cada curso se conservan; el XP es global y no cambia. Un
 * curso nuevo empieza en A1.
 */
export function useSwitchCourse() {
  return useSwitchStudy(
    async (course: CourseDef) => {
      const switched = await setActiveCourse(course.code);
      if (switched === null) await setTargetLanguage(course.target);
    },
    (course: CourseDef) => ({ language: course.target, courseCode: course.code }),
  );
}
