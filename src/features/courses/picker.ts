import {
  SOURCE_LANGUAGES,
  courseLanguage,
  courseLevels,
  selectableCoursesFor,
  type CourseDef,
  type SourceLanguage,
} from '@shared/courses';
import type { LanguageConfig } from '@shared/languages';

import type { InterfaceLanguage } from '@/i18n';

/**
 * Selector de cursos agrupado por idioma de origen, como Duolingo («Idiomas para hablantes de
 * español», «… de inglés»…). Lo usan el registro (src/app/onboarding.tsx) y «Agregar curso» en «Tus
 * cursos» (src/app/courses.tsx). Lógica pura, sin red:
 *
 * - Primero va el origen que coincide con el idioma de la interfaz (que arranca con el del teléfono),
 *   abierto; los demás, debajo y cerrados, en el orden de SOURCE_LANGUAGES. Si ese origen no tiene
 *   cursos para elegir, se abre la primera sección que quede (siempre hay una a la vista).
 * - Una sección sin cursos elegibles no aparece. Nunca aparecen cursos ocultos ni «Próximamente»
 *   (selectableCoursesFor).
 * - Los cursos que ya tenés van marcados: tocarlos te pasa a ese curso en vez de empezarlo.
 */

/** Idioma de origen que corresponde a cada idioma de interfaz. */
export const SOURCE_FOR_INTERFACE: Record<InterfaceLanguage, SourceLanguage> = {
  es: 'es',
  en: 'en',
  'pt-BR': 'pt',
  it: 'it',
  fr: 'fr',
};

export interface PickerCourse {
  course: CourseDef;
  /** Idioma que se aprende. */
  language: LanguageConfig;
  /** Niveles publicados del curso, en orden. */
  levels: readonly string[];
  /** Ya es uno de tus cursos (el activo incluido). */
  mine: boolean;
  /** Es el que estudiás ahora. */
  active: boolean;
}

export interface PickerSection {
  source: SourceLanguage;
  courses: PickerCourse[];
  /** Abierta al mostrarse (sólo la primera). */
  expanded: boolean;
}

export interface PickerInput {
  ui: InterfaceLanguage;
  isTester?: boolean;
  /** Códigos de tus cursos (activo e inscriptos o empezados). */
  mine?: ReadonlySet<string>;
  activeCode?: string | null;
}

export function buildCoursePicker({
  ui,
  isTester = false,
  mine = new Set(),
  activeCode = null,
}: PickerInput): PickerSection[] {
  const first = SOURCE_FOR_INTERFACE[ui];
  const sources = [first, ...SOURCE_LANGUAGES.filter((s) => s !== first)];
  const sections = sources
    .map((source) => ({
      source,
      courses: selectableCoursesFor(source, isTester).map((course): PickerCourse => ({
        course,
        language: courseLanguage(course),
        levels: courseLevels(course),
        mine: mine.has(course.code) || course.code === activeCode,
        active: course.code === activeCode,
      })),
      expanded: false,
    }))
    .filter((s) => s.courses.length > 0);
  if (sections[0]) sections[0].expanded = true;
  return sections;
}

/** «A1–B1», o «A1» con un solo nivel. */
export function levelRange(levels: readonly string[]): string {
  if (levels.length === 0) return '';
  return levels.length === 1 ? levels[0]! : `${levels[0]}–${levels[levels.length - 1]}`;
}

/** Abre o cierra una sección (acordeón: puede haber varias abiertas). */
export function toggleSection(
  open: ReadonlySet<SourceLanguage>,
  source: SourceLanguage,
): Set<SourceLanguage> {
  const next = new Set(open);
  if (next.has(source)) next.delete(source);
  else next.add(source);
  return next;
}

/** Secciones abiertas al mostrarse el selector. */
export const initiallyOpen = (sections: readonly PickerSection[]): Set<SourceLanguage> =>
  new Set(sections.filter((s) => s.expanded).map((s) => s.source));
