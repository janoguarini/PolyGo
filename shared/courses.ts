import { LANGUAGES, isSelectable, languageConfig, type LanguageConfig } from './languages';

/**
 * Cursos (docs/MULTILINGUAL_ONBOARDING_PLAN.md §4.2): un curso = idioma de destino + idioma de origen.
 * Espejo de public.courses (supabase/migrations/20261223120000_course_model.sql); una prueba de la base
 * comprueba que coincidan.
 *
 * - El idioma de origen pertenece al curso (no al usuario): es el de las consignas, traducciones y
 *   explicaciones del contenido (shared/languages.ts `support`; sin el campo, español).
 * - Un mismo idioma de destino puede tener varios cursos; `isDefault` marca el que usan los caminos que
 *   sólo conocen el destino (profiles.target_language, set_target_language).
 * - La disponibilidad sale de `status` y `levels` del idioma de destino: no se repite acá.
 */

export const SOURCE_LANGUAGES = ['es', 'en'] as const;
export type SourceLanguage = (typeof SOURCE_LANGUAGES)[number];

export interface CourseDef {
  /** `<destino>-from-<origen>`, igual que public.courses.code. */
  code: string;
  target: string;
  source: SourceLanguage;
  isDefault: boolean;
  position: number;
}

export const courseCode = (target: string, source: SourceLanguage) => `${target}-from-${source}`;

/** Origen de un idioma de destino según su contenido (shared/languages.ts `support`). */
const sourceOfLanguage = (l: LanguageConfig): SourceLanguage => l.support?.code ?? 'es';

/** Orden de public.courses.position. */
const ORDER = ['en', 'fr', 'it', 'pt', 'zh', 'es'];

export const COURSES: readonly CourseDef[] = ORDER.map((target, i) => {
  const language = LANGUAGES.find((l) => l.code === target)!;
  const source = sourceOfLanguage(language);
  return { code: courseCode(target, source), target, source, isDefault: true, position: i + 1 };
});

export function courseByCode(code: string | null | undefined): CourseDef | undefined {
  return COURSES.find((c) => c.code === code);
}

/** El curso por defecto de un idioma de destino (el de `profiles.target_language`). */
export function defaultCourseFor(target: string | null | undefined): CourseDef {
  const code = languageConfig(target).code;
  return COURSES.find((c) => c.target === code && c.isDefault) ?? COURSES[0]!;
}

/** Idioma de destino de un curso (con su configuración). */
export const courseLanguage = (course: CourseDef): LanguageConfig => languageConfig(course.target);

/**
 * Cursos que se pueden elegir desde un idioma de origen: destino disponible (o beta para testers) y
 * con niveles publicados. Ordenados por `position`.
 */
export function selectableCoursesFor(source: SourceLanguage, isTester = false): CourseDef[] {
  return COURSES.filter((c) => {
    const language = courseLanguage(c);
    return c.source === source && isSelectable(language, isTester) && language.levels.length > 0;
  }).sort((a, b) => a.position - b.position);
}

/** Curso activo de un perfil: el guardado o, sin él (migración sin aplicar), el del idioma. */
export function activeCourseOf(profile: {
  target_language: string;
  active_course_code?: string | null;
}): CourseDef {
  const saved = courseByCode(profile.active_course_code);
  return saved && saved.target === profile.target_language
    ? saved
    : defaultCourseFor(profile.target_language);
}
