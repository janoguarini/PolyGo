import { useQueries, useQuery } from '@tanstack/react-query';

import { VISIBLE_LANGUAGES, isSelectable, type LanguageConfig } from '@shared/languages';

import { useAuth } from '@/features/auth/AuthProvider';
import { useCourseForLanguage, useLanguageStartLevels } from '@/features/courses/hooks';
import { fetchLessonProgress } from '@/features/learning/api';
import {
  withStatus,
  type LessonProgress,
  type UnitSummary,
  type UnitWithStatus,
} from '@/features/learning/curriculum';
import { curriculumQuery, learningKeys } from '@/features/learning/hooks';

import { useIsContentTester } from './hooks';

export interface LevelProgress {
  /** Nivel MCER en curso (el mismo que muestra Aprender). */
  level: string;
  completed: number;
  total: number;
  /** 0..1 de lecciones completadas del nivel. */
  ratio: number;
}

/**
 * Nivel en curso y su progreso, con la misma regla que el camino de Aprender: el primer nivel sin
 * terminar desde el nivel en que empezaste (o el último, si terminaste todos).
 */
export function levelProgress(units: UnitWithStatus[], startLevel: string): LevelProgress | null {
  if (units.length === 0) return null;
  const levels = [...new Set(units.map((u) => u.level))];
  const reachable = levels.slice(Math.max(0, levels.indexOf(startLevel)));
  const level =
    reachable.find((l) =>
      units.some((u) => u.level === l && u.completedCount < u.lessons.length),
    ) ??
    reachable[reachable.length - 1] ??
    levels[0]!;
  const inLevel = units.filter((u) => u.level === level);
  const total = inLevel.reduce((n, u) => n + u.lessons.length, 0);
  const completed = inLevel.reduce((n, u) => n + u.completedCount, 0);
  return { level, completed, total, ratio: total > 0 ? completed / total : 0 };
}

/** Si estudió algo en ese camino (al menos una lección completada). */
export function hasStarted(units: UnitWithStatus[]): boolean {
  return units.some((u) => u.completedCount > 0);
}

export interface LanguageProgressRow {
  language: LanguageConfig;
  current: boolean;
  progress: LevelProgress | null;
}

/**
 * Idiomas del perfil: el que estudiás y los que ya empezaste, con su nivel y progreso reales. Usa
 * las mismas consultas (y la misma caché) que Aprender; los caminos ya se precargan en el perfil.
 */
export function buildLanguageRows(
  languages: LanguageConfig[],
  curricula: (UnitSummary[] | undefined)[],
  progress: LessonProgress[],
  current: string,
  /** Nivel inicial del curso de cada idioma (o el del idioma actual, con el resto en A1). */
  startLevel: string | ((language: string) => string),
  /** Idiomas que se muestran aunque no tengan lecciones completadas (cursos inscriptos). */
  include: readonly string[] = [],
): LanguageProgressRow[] {
  const levelOf =
    typeof startLevel === 'function'
      ? startLevel
      : (code: string) => (code === current ? startLevel : 'A1');
  const rows: LanguageProgressRow[] = [];
  languages.forEach((language, i) => {
    const units = curricula[i];
    const isCurrent = language.code === current;
    if (!units) {
      if (isCurrent) rows.push({ language, current: true, progress: null });
      return;
    }
    const withProgress = withStatus(units, progress).units;
    if (!isCurrent && !include.includes(language.code) && !hasStarted(withProgress)) return;
    rows.push({
      language,
      current: isCurrent,
      progress: levelProgress(withProgress, levelOf(language.code)),
    });
  });
  // El que estudiás primero.
  return rows.sort((a, b) => Number(b.current) - Number(a.current));
}

export function useLanguageRows(
  current: string,
  startLevel: string,
  include: readonly string[] = [],
) {
  const { session } = useAuth();
  const userId = session?.user.id;
  const tester = useIsContentTester().data ?? false;
  // Nivel por curso (modelo de cursos); sin él, la regla anterior.
  const levelOf = useLanguageStartLevels();
  const languages = VISIBLE_LANGUAGES.filter((l) => isSelectable(l, tester) || l.code === current);
  // Caché por curso (el camino de cada idioma es el de su curso, como en Aprender).
  const courseFor = useCourseForLanguage();
  const curricula = useQueries({
    queries: languages.map((l) => curriculumQuery(courseFor(l.code))),
  });
  const progress = useQuery({
    queryKey: learningKeys.progress(userId ?? 'anonymous'),
    queryFn: () => fetchLessonProgress(userId!),
    enabled: Boolean(userId),
  });
  const currentQuery = curricula[languages.findIndex((l) => l.code === current)];
  return {
    rows: progress.data
      ? buildLanguageRows(
          languages,
          curricula.map((q) => q.data),
          progress.data,
          current,
          levelOf ?? startLevel,
          include,
        )
      : [],
    isPending: progress.isPending || Boolean(currentQuery?.isPending),
    isError: progress.isError || Boolean(currentQuery?.isError),
    refetch: () => {
      void progress.refetch();
      void currentQuery?.refetch();
    },
  };
}
