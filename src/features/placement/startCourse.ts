import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CourseDef } from '@shared/courses';

import { useAuth } from '@/features/auth/AuthProvider';
import {
  setActiveCourse,
  startCourse,
  type PlacementSubmission,
  type StartCourseResult,
} from '@/features/courses/api';
import { courseKeys } from '@/features/courses/hooks';
import type { CourseEnrollment } from '@/features/courses/level';
import { setTargetLanguage, type MyProfile } from '@/features/profile/api';
import { profileKeys } from '@/features/profile/hooks';

/**
 * Guardar el inicio de un curso nuevo (docs/PLACEMENT_TEST.md §Persistencia). Nada se escribe antes de
 * este paso: abandonar el test no deja nada. Un error deja el resultado en pantalla para reintentar.
 */

/** La base no tiene start_course (migración sin aplicar) y no se puede guardar un resultado. */
export class PlacementUnsupportedError extends Error {
  constructor() {
    super('placement_unsupported');
    this.name = 'PlacementUnsupportedError';
  }
}

export interface StartCourseInput {
  course: CourseDef;
  startLevel: string;
  placement: PlacementSubmission | null;
}

export interface StartCourseOutcome {
  /** false = ya estaba inscripto: se conservaron su nivel y su progreso. */
  created: boolean;
  /** Nivel con el que quedó el curso (el elegido o, si ya existía, el que tenía). */
  startLevel: string;
  /** Se usó el camino anterior (sin el modelo de cursos ni la migración del test). */
  legacy: boolean;
}

export interface StartCourseDeps {
  startCourse: typeof startCourse;
  setActiveCourse: typeof setActiveCourse;
  setTargetLanguage: typeof setTargetLanguage;
}

const defaultDeps: StartCourseDeps = { startCourse, setActiveCourse, setTargetLanguage };

export async function runStartCourse(
  { course, startLevel, placement }: StartCourseInput,
  deps: StartCourseDeps = defaultDeps,
): Promise<StartCourseOutcome & { result: StartCourseResult | null }> {
  const result = await deps.startCourse(course.code, startLevel, placement);
  if (result) {
    return { created: result.created, startLevel: result.start_level, legacy: false, result };
  }
  // Sin start_course sólo se puede empezar desde A1, como en la Fase 3 (el cambio de curso inscribe en
  // A1). Un resultado del test no se puede guardar: mejor un error que perderlo en silencio.
  if (placement || startLevel !== 'A1') throw new PlacementUnsupportedError();
  const switched = await deps.setActiveCourse(course.code);
  if (switched === null) await deps.setTargetLanguage(course.target);
  return { created: true, startLevel: 'A1', legacy: true, result: null };
}

/**
 * Mutación para empezar un curso. Al terminar, el caché del perfil y de los cursos queda con el curso
 * nuevo y su nivel (sin parpadeo del nivel anterior en Aprender) y se recargan perfil, camino y
 * clasificación.
 */
export function useStartCourse(deps?: StartCourseDeps) {
  const qc = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id ?? 'anonymous';
  return useMutation({
    mutationFn: (input: StartCourseInput) => runStartCourse(input, deps),
    onSuccess: (outcome, { course }) => {
      const key = profileKeys.me(userId);
      const cached = qc.getQueryData<MyProfile>(key);
      if (cached) {
        qc.setQueryData<MyProfile>(key, {
          ...cached,
          profile: {
            ...cached.profile,
            target_language: course.target,
            ...(outcome.startLevel === 'A1' || outcome.startLevel === 'A2'
              ? { start_level: outcome.startLevel }
              : {}),
            ...('active_course_code' in cached.profile ? { active_course_code: course.code } : {}),
          } as MyProfile['profile'],
          rating: cached.rating?.language_code === course.target ? cached.rating : null,
        });
      }
      const result = outcome.result;
      if (result) {
        qc.setQueryData<CourseEnrollment[] | null>(courseKeys.mine(userId), (list) => {
          if (!list) return list;
          const rest = list.filter((e) => e.course_code !== course.code);
          const previous = list.find((e) => e.course_code === course.code);
          return [
            ...rest,
            {
              course_code: course.code,
              start_level: result.start_level,
              placement_level: result.placement_level,
              placement_completed_at: result.placement_completed_at,
              enrolled_at: previous?.enrolled_at ?? new Date().toISOString(),
              last_selected_at: new Date().toISOString(),
            },
          ];
        });
      }
      void Promise.all([
        qc.invalidateQueries({ queryKey: ['profile'] }),
        qc.invalidateQueries({ queryKey: ['learning'] }),
        qc.invalidateQueries({ queryKey: ['leaderboard'] }),
      ]);
    },
  });
}
