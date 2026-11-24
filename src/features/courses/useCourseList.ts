import { useMemo } from 'react';

import { courseByCode } from '@shared/courses';

import { useIsContentTester, useMyProfile } from '@/features/profile/hooks';
import { useLanguageRows } from '@/features/profile/languageProgress';

import { buildCourseList } from './catalog';
import { useMyCourses } from './hooks';
import type { CourseProfile } from './level';

/**
 * Lista de «Tus cursos»: el activo, los empezados y los que se pueden empezar, con el nivel y el
 * progreso de cada uno (las mismas consultas y caché que Aprender y Perfil).
 */
export function useCourseList() {
  const me = useMyProfile();
  const courses = useMyCourses();
  const tester = useIsContentTester();
  const profile = me.data?.profile as CourseProfile | undefined;
  const enrollments = courses.data ?? null;
  // Los cursos inscriptos se muestran aunque todavía no tengan lecciones completadas.
  const include = (enrollments ?? [])
    .map((e) => courseByCode(e.course_code)?.target)
    .filter((t): t is string => Boolean(t));
  const rows = useLanguageRows(
    profile?.target_language ?? 'en',
    profile?.start_level ?? 'A1',
    include,
  );
  const list = useMemo(() => {
    if (!profile) return null;
    const progressByLanguage = new Map(
      rows.rows.map((r) => [r.language.code, { progress: r.progress, started: true }] as const),
    );
    return buildCourseList({
      profile,
      enrollments,
      progressByLanguage,
      isTester: tester.data ?? false,
    });
  }, [profile, enrollments, rows.rows, tester.data]);
  return {
    list,
    // Sin perfil no hay nada que mostrar; el progreso puede llegar después (las filas se completan).
    isPending: me.isPending || courses.isPending,
    isError: me.isError || courses.isError,
    progressPending: rows.isPending,
    progressError: rows.isError,
    refetch: () => {
      void me.refetch();
      void courses.refetch();
      rows.refetch();
    },
  };
}
