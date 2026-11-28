import { LANGUAGES, languageConfig, type LanguageConfig, type LanguageStatus } from './languages';

/**
 * Cursos (docs/MULTILINGUAL_ONBOARDING_PLAN.md §4.2, docs/EN_MULTI_SOURCE.md): un curso = idioma de
 * destino + idioma de origen. Espejo de public.courses (supabase/migrations/20261223120000_course_model.sql
 * y 20270108120000_courses_per_language.sql); supabase/tests/courses.test.mjs comprueba que coincidan
 * (sin los ocultos).
 *
 * - El idioma de origen pertenece al curso (no al usuario): es el de las consignas, traducciones y
 *   explicaciones del contenido.
 * - Un mismo idioma de destino puede tener varios cursos (inglés desde es, pt, it y fr); `isDefault`
 *   marca el que usan los caminos que sólo conocen el destino (profiles.target_language,
 *   set_target_language).
 * - Disponibilidad = `status` del curso ?? `status` del idioma (como
 *   coalesce(courses.status, languages.content_status) en la base). Niveles = `levels` del curso ??
 *   `levels` del idioma. Los cursos de siempre no los declaran: heredan los del idioma.
 */

export const SOURCE_LANGUAGES = ['es', 'en', 'pt', 'it', 'fr'] as const;
export type SourceLanguage = (typeof SOURCE_LANGUAGES)[number];

export interface CourseDef {
  /** `<destino>-from-<origen>`, igual que public.courses.code. */
  code: string;
  target: string;
  source: SourceLanguage;
  isDefault: boolean;
  position: number;
  /** public.courses.status; sin el campo, el del idioma de destino. */
  status?: LanguageStatus;
  /** Niveles publicados del curso; sin el campo, los del idioma de destino. */
  levels?: readonly string[];
}

export const courseCode = (target: string, source: SourceLanguage) => `${target}-from-${source}`;

/** Origen de un idioma de destino según su contenido (shared/languages.ts `support`). */
const sourceOfLanguage = (l: LanguageConfig): SourceLanguage => l.support?.code ?? 'es';

/** Orden de public.courses.position de los cursos por defecto. */
const ORDER = ['en', 'fr', 'it', 'pt', 'zh', 'es'];

const DEFAULT_COURSES: CourseDef[] = ORDER.map((target, i) => {
  const language = LANGUAGES.find((l) => l.code === target)!;
  const source = sourceOfLanguage(language);
  return { code: courseCode(target, source), target, source, isDefault: true, position: i + 1 };
});

/**
 * Inglés para hablantes de portugués, italiano y francés (docs/EN_MULTI_SOURCE.md; contenido con
 * prefijos ept / eit / efr). Publicados y abiertos en producción el 2026-11-27
 * (supabase/pending/20270111*_publish_en_from_*.sql, public.courses.status = 'available'). B2: cargas
 * 20270112120*_en_from_*_b2 + pending/20270112130*_publish_en_from_*_b2.
 */
const EXTRA_COURSES: CourseDef[] = [
  {
    code: 'en-from-pt',
    target: 'en',
    source: 'pt',
    isDefault: false,
    position: 7,
    status: 'available',
    levels: ['A1', 'A2', 'B1', 'B2'],
  },
  {
    code: 'en-from-it',
    target: 'en',
    source: 'it',
    isDefault: false,
    position: 8,
    status: 'available',
    levels: ['A1', 'A2', 'B1', 'B2'],
  },
  {
    code: 'en-from-fr',
    target: 'en',
    source: 'fr',
    isDefault: false,
    position: 9,
    status: 'available',
    levels: ['A1', 'A2', 'B1', 'B2'],
  },
];

/** Todos los cursos, también los ocultos (para reconocer un curso activo o inscripto). */
export const ALL_COURSES: readonly CourseDef[] = [...DEFAULT_COURSES, ...EXTRA_COURSES];

/** Idioma de destino de un curso (con su configuración). */
export const courseLanguage = (course: CourseDef): LanguageConfig => languageConfig(course.target);

/** Disponibilidad del curso: la suya o, sin ella, la del idioma de destino. */
export const courseStatus = (course: CourseDef): LanguageStatus =>
  course.status ?? courseLanguage(course).status;

/** Niveles publicados del curso: los suyos o, sin ellos, los del idioma de destino. */
export const courseLevels = (course: CourseDef): readonly string[] =>
  course.levels ?? courseLanguage(course).levels;

/** Si el usuario puede elegirlo: disponible, o beta para los testers de contenido. */
export function isCourseSelectable(course: CourseDef, isTester = false): boolean {
  const status = courseStatus(course);
  return status === 'available' || (status === 'beta' && isTester);
}

/** Los cursos que la app conoce (sin los ocultos): el espejo de public.courses. */
export const COURSES: readonly CourseDef[] = ALL_COURSES.filter(
  (c) => courseStatus(c) !== 'hidden',
);

export function courseByCode(code: string | null | undefined): CourseDef | undefined {
  return ALL_COURSES.find((c) => c.code === code);
}

/** El curso por defecto de un idioma de destino (el de `profiles.target_language`). */
export function defaultCourseFor(target: string | null | undefined): CourseDef {
  const code = languageConfig(target).code;
  return ALL_COURSES.find((c) => c.target === code && c.isDefault) ?? ALL_COURSES[0]!;
}

/**
 * Cursos que se pueden elegir desde un idioma de origen: disponibles (o beta para testers) y con
 * niveles publicados. Ordenados por `position`. Nunca los ocultos ni los «Próximamente».
 */
export function selectableCoursesFor(source: SourceLanguage, isTester = false): CourseDef[] {
  return ALL_COURSES.filter(
    (c) => c.source === source && isCourseSelectable(c, isTester) && courseLevels(c).length > 0,
  ).sort((a, b) => a.position - b.position);
}

/**
 * Curso activo de un perfil: el guardado (aunque no sea el por defecto de su idioma, p. ej.
 * en-from-pt) si es del idioma del perfil; si no (migración sin aplicar, o la caché optimista cambió
 * el idioma antes que el curso), el por defecto del idioma.
 */
export function activeCourseOf(profile: {
  target_language: string;
  active_course_code?: string | null;
}): CourseDef {
  const saved = courseByCode(profile.active_course_code);
  return saved && saved.target === profile.target_language
    ? saved
    : defaultCourseFor(profile.target_language);
}
