import { activeCourseOf, courseByCode, defaultCourseFor, type CourseDef } from '@shared/courses';

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

/**
 * Curso de un idioma de destino para este perfil, igual que user_course_for en la base
 * (20270108120000_courses_per_language.sql): el activo si es de ese idioma; si no, el último elegido
 * (o inscripto) de ese idioma; si no, el por defecto. Es el curso cuyas unidades devuelve la base al
 * pedir ese idioma.
 */
export function courseForLanguage(
  profile: CourseProfile,
  language: string,
  enrollments: readonly CourseEnrollment[] | null = null,
): CourseDef {
  const active = activeCourseOf(profile);
  if (active.target === language) return active;
  let latest: { e: CourseEnrollment; course: CourseDef } | null = null;
  for (const e of enrollments ?? []) {
    const course = courseByCode(e.course_code);
    if (course?.target !== language) continue;
    if (!latest || newer(e, course, latest.e, latest.course)) latest = { e, course };
  }
  return latest?.course ?? defaultCourseFor(language);
}

/** Orden de user_course_for: last_selected_at desc nulls last, enrolled_at desc, código. */
function newer(a: CourseEnrollment, ac: CourseDef, b: CourseEnrollment, bc: CourseDef): boolean {
  if (a.last_selected_at !== b.last_selected_at) {
    if (a.last_selected_at === null) return false;
    if (b.last_selected_at === null) return true;
    return Date.parse(a.last_selected_at) > Date.parse(b.last_selected_at);
  }
  if (a.enrolled_at !== b.enrolled_at) return Date.parse(a.enrolled_at) > Date.parse(b.enrolled_at);
  return ac.code < bc.code;
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
  return courseStartLevel(profile, enrollments, courseForLanguage(profile, language, enrollments));
}
