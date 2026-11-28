import {
  COURSES,
  activeCourseOf,
  courseByCode,
  defaultCourseFor,
  selectableCoursesFor,
} from '@shared/courses';
import { LANGUAGES } from '@shared/languages';

import {
  courseForLanguage,
  courseStartLevel,
  languageStartLevel,
  type CourseEnrollment,
  type CourseProfile,
} from '../level';

const enrollment = (course_code: string, start_level: string): CourseEnrollment => ({
  course_code,
  start_level,
  placement_level: null,
  placement_completed_at: null,
  enrolled_at: '2026-11-21T00:00:00Z',
  last_selected_at: null,
});

describe('catálogo de cursos (shared/courses.ts)', () => {
  it('un curso por defecto por idioma, con el origen que dice su contenido; más los de inglés', () => {
    expect(COURSES.map((c) => c.code)).toEqual([
      'en-from-es',
      'fr-from-es',
      'it-from-es',
      'pt-from-es',
      'zh-from-es',
      'es-from-en',
      'en-from-pt',
      'en-from-it',
      'en-from-fr',
    ]);
    expect(new Set(COURSES.map((c) => c.target))).toEqual(new Set(LANGUAGES.map((l) => l.code)));
    expect(courseByCode('es-from-en')).toMatchObject({ target: 'es', source: 'en' });
  });

  it('el origen pertenece al curso, no al idioma de destino ni al usuario', () => {
    expect(defaultCourseFor('es').source).toBe('en');
    expect(defaultCourseFor('en').source).toBe('es');
  });

  it('desde español se eligen los cinco cursos con niveles; desde inglés, el de español', () => {
    expect(selectableCoursesFor('es').map((c) => c.code)).toEqual([
      'en-from-es',
      'fr-from-es',
      'it-from-es',
      'pt-from-es',
      'zh-from-es',
    ]);
    expect(selectableCoursesFor('en').map((c) => c.code)).toEqual(['es-from-en']);
  });

  it('curso activo: el guardado si coincide con el idioma; si no (o sin migración), el por defecto', () => {
    expect(activeCourseOf({ target_language: 'it' }).code).toBe('it-from-es');
    expect(activeCourseOf({ target_language: 'it', active_course_code: 'it-from-es' }).code).toBe(
      'it-from-es',
    );
    // Caché optimista de useSetTargetLanguage: el idioma cambió antes que el curso.
    expect(activeCourseOf({ target_language: 'zh', active_course_code: 'it-from-es' }).code).toBe(
      'zh-from-es',
    );
  });
});

describe('nivel por curso (src/features/courses/level.ts)', () => {
  const profile: CourseProfile = {
    target_language: 'en',
    start_level: 'A2',
    active_course_code: 'en-from-es',
  };

  it('sin la migración (enrollments null) es exactamente la regla anterior', () => {
    expect(languageStartLevel(profile, null)).toBe('A2');
    expect(languageStartLevel(profile, null, 'it')).toBe('A1');
    expect(languageStartLevel({ target_language: 'en', start_level: 'A2' }, null)).toBe('A2');
  });

  it('con la migración, cada curso tiene su nivel', () => {
    const mine = [enrollment('en-from-es', 'A2'), enrollment('it-from-es', 'A2')];
    expect(languageStartLevel(profile, mine)).toBe('A2');
    expect(languageStartLevel(profile, mine, 'it')).toBe('A2');
    expect(languageStartLevel(profile, mine, 'zh')).toBe('A1');
  });

  it('el nivel guardado del curso manda sobre profiles.start_level', () => {
    const mine = [enrollment('en-from-es', 'A1')];
    expect(languageStartLevel(profile, mine)).toBe('A1');
  });

  it('un curso activo todavía sin inscripción usa profiles.start_level (como hoy)', () => {
    expect(courseStartLevel(profile, [], defaultCourseFor('en'))).toBe('A2');
  });

  it('el curso de un idioma es el activo si es de ese idioma', () => {
    expect(courseForLanguage(profile, 'en').code).toBe('en-from-es');
    expect(courseForLanguage(profile, 'es').code).toBe('es-from-en');
  });
});
