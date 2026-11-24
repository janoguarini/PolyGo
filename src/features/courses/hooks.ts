import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import type { CourseDef } from '@shared/courses';

import { useAuth } from '@/features/auth/AuthProvider';
import { setTargetLanguage, type MyProfile } from '@/features/profile/api';
import { profileKeys, useMyProfile, useSwitchStudy } from '@/features/profile/hooks';
import {
  getInterfaceLanguage,
  isInterfaceLanguage,
  setInterfaceLanguage,
  type InterfaceLanguage,
} from '@/i18n';

import { fetchMyCourses, saveInterfaceLanguage, setActiveCourse } from './api';
import { languageStartLevel, type CourseProfile } from './level';

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
  const saved = (me.data?.profile as CourseProfile | undefined)?.interface_language;
  useEffect(() => {
    if (isInterfaceLanguage(saved) && saved !== getInterfaceLanguage()) {
      void setInterfaceLanguage(saved);
    }
  }, [saved]);
}

/**
 * Cambia el idioma de la interfaz: al instante en el dispositivo y en el perfil en caché, y después en
 * la base (si la migración no está aplicada, queda sólo en el dispositivo). El caché se actualiza antes
 * para que useApplyProfileInterfaceLanguage no vuelva al valor anterior mientras responde el servidor.
 */
export function useChangeInterfaceLanguage() {
  const qc = useQueryClient();
  const { session } = useAuth();
  const key = profileKeys.me(session?.user.id ?? 'anonymous');
  return useMutation({
    mutationFn: async (language: InterfaceLanguage) => {
      await setInterfaceLanguage(language);
      const cached = qc.getQueryData<MyProfile>(key);
      // Sólo si el perfil ya tiene la columna (migración aplicada).
      if (cached && 'interface_language' in cached.profile) {
        qc.setQueryData<MyProfile>(key, {
          ...cached,
          profile: { ...cached.profile, interface_language: language } as MyProfile['profile'],
        });
      }
      return saveInterfaceLanguage(language);
    },
  });
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
