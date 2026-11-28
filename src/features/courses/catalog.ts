import {
  SOURCE_LANGUAGES,
  activeCourseOf,
  courseByCode,
  courseLanguage,
  isCourseSelectable,
  selectableCoursesFor,
  type CourseDef,
  type SourceLanguage,
} from '@shared/courses';
import type { LanguageConfig } from '@shared/languages';

import type { LevelProgress } from '@/features/profile/languageProgress';

import {
  courseForLanguage,
  courseStartLevel,
  type CourseEnrollment,
  type CourseProfile,
} from './level';

/**
 * Lista de cursos de la pantalla «Tus cursos» (Fase 3, docs/MULTILINGUAL_ONBOARDING_PLAN.md). Lógica
 * pura: arma el curso activo, los cursos ya empezados y los que se pueden empezar, sin red.
 *
 * - «Míos»: el activo, los inscriptos (user_courses) y los idiomas con lecciones completadas (con la
 *   migración sin aplicar, sólo estos dos últimos se conocen por el progreso).
 * - «Para empezar»: los cursos elegibles (destino disponible, o beta para testers, y con niveles) que
 *   todavía no son míos, agrupados por idioma de origen; primero el origen del curso activo. Un curso
 *   nuevo empieza en A1: no hereda el nivel de otro curso.
 * - Nunca aparecen cursos «Próximamente» ni ocultos: sólo los que tienen contenido.
 */

export interface CourseEntry {
  course: CourseDef;
  /** Idioma que se aprende. */
  language: LanguageConfig;
  active: boolean;
  /** Se puede elegir ahora (el activo también cuenta como elegible). */
  selectable: boolean;
  /** Nivel desde el que empieza el camino de este curso. */
  startLevel: string;
  /** Nivel en curso y su progreso (null mientras carga o sin camino publicado). */
  progress: LevelProgress | null;
}

export interface CourseGroup {
  /** Idioma desde el que se aprende (el del contenido del curso). */
  source: SourceLanguage;
  courses: CourseEntry[];
}

export interface CourseList {
  active: CourseEntry;
  /** Otros cursos ya empezados o inscriptos (sin el activo). */
  mine: CourseEntry[];
  /** Cursos para empezar, por idioma de origen. Sin grupos vacíos. */
  available: CourseGroup[];
}

export interface CourseListInput {
  profile: CourseProfile;
  /** null = migración sin aplicar (modelo anterior). */
  enrollments: readonly CourseEnrollment[] | null;
  /**
   * Progreso por idioma de destino (de useLanguageRows). Los que faltan se consideran sin empezar. La
   * base devuelve el camino de un idioma según su curso (user_course_for): el progreso es de ese curso
   * (courseForLanguage), no de los otros cursos del mismo idioma.
   */
  progressByLanguage: ReadonlyMap<string, { progress: LevelProgress | null; started: boolean }>;
  isTester: boolean;
}

export function buildCourseList({
  profile,
  enrollments,
  progressByLanguage,
  isTester,
}: CourseListInput): CourseList {
  const activeCourse = activeCourseOf(profile);
  const entry = (course: CourseDef): CourseEntry => {
    const language = courseLanguage(course);
    const active = course.code === activeCourse.code;
    return {
      course,
      language,
      active,
      selectable: active || isCourseSelectable(course, isTester),
      startLevel: courseStartLevel(profile, enrollments, course),
      progress:
        courseForLanguage(profile, course.target, enrollments).code === course.code
          ? (progressByLanguage.get(course.target)?.progress ?? null)
          : null,
    };
  };

  const mineCodes = new Set<string>();
  for (const e of enrollments ?? []) if (courseByCode(e.course_code)) mineCodes.add(e.course_code);
  for (const [language, row] of progressByLanguage) {
    if (row.started) mineCodes.add(courseForLanguage(profile, language, enrollments).code);
  }
  mineCodes.delete(activeCourse.code);

  const mine = [...mineCodes]
    .map((code) => entry(courseByCode(code)!))
    // Los elegibles primero; después, el orden del catálogo.
    .sort(
      (a, b) =>
        Number(b.selectable) - Number(a.selectable) || a.course.position - b.course.position,
    );

  const sources = [
    activeCourse.source,
    ...SOURCE_LANGUAGES.filter((s) => s !== activeCourse.source),
  ];
  const available = sources
    .map((source) => ({
      source,
      courses: selectableCoursesFor(source, isTester)
        .filter((c) => c.code !== activeCourse.code && !mineCodes.has(c.code))
        .map(entry),
    }))
    .filter((g) => g.courses.length > 0);

  return { active: entry(activeCourse), mine, available };
}
