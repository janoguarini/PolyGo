import { activeCourseOf, defaultCourseFor, type CourseDef } from '@shared/courses';

/**
 * Nivel por curso (docs/MULTILINGUAL_ONBOARDING_PLAN.md §4.2). Lógica pura, sin red.
 *
 * Con la migración 20261223120000_course_model aplicada, el nivel sale de public.user_courses. Sin
 * ella (`enrollments === null`), se deriva como antes: el curso activo usa profiles.start_level y el
 * resto empieza en A1. Así la app muestra lo mismo que hoy contra la base de producción.
 */

/** Una fila de public.user_courses (lo que la app usa). */
export interface CourseEnrollment {
  course_code: string;
  start_level: string;
  placement_level: string | null;
  placement_completed_at: string | null;
  enrolled_at: string;
  last_selected_at: string | null;
}

/** Lo que la app usa del perfil para el modelo de cursos (columnas nuevas opcionales). */
export interface CourseProfile {
  target_language: string;
  start_level: string;
  active_course_code?: string | null;
  interface_language?: string | null;
}

/** Curso de un idioma de destino para este perfil: el activo si es de ese idioma; si no, el por defecto. */
export function courseForLanguage(profile: CourseProfile, language: string): CourseDef {
  const active = activeCourseOf(profile);
  return active.target === language ? active : defaultCourseFor(language);
}

export function courseStartLevel(
  profile: CourseProfile,
  enrollments: readonly CourseEnrollment[] | null,
  course: CourseDef,
): string {
  if (enrollments) {
    const enrolled = enrollments.find((e) => e.course_code === course.code);
    if (enrolled) return enrolled.start_level;
  }
  // Sin inscripción (o sin migración): como hasta ahora.
  return course.code === activeCourseOf(profile).code ? profile.start_level : 'A1';
}

/** Nivel desde el que empieza el camino del idioma `language` (por defecto, el que estudia). */
export function languageStartLevel(
  profile: CourseProfile,
  enrollments: readonly CourseEnrollment[] | null,
  language: string = profile.target_language,
): string {
  return courseStartLevel(profile, enrollments, courseForLanguage(profile, language));
}
