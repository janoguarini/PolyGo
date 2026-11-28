import {
  ALL_COURSES,
  COURSES,
  SOURCE_LANGUAGES,
  activeCourseOf,
  courseByCode,
  courseLevels,
  courseStatus,
  defaultCourseFor,
  isCourseSelectable,
  selectableCoursesFor,
  type CourseDef,
} from '@shared/courses';
import { LANGUAGES, type LanguageStatus } from '@shared/languages';

import type { LevelProgress } from '@/features/profile/languageProgress';

import { buildCourseList } from '../catalog';
import { courseForLanguage, type CourseEnrollment, type CourseProfile } from '../level';

const NEW = ['en-from-pt', 'en-from-it', 'en-from-fr'];

/** Cambia el `status` de un curso durante una prueba (en producción, public.courses.status). */
function withStatus<T>(code: string, status: LanguageStatus, run: () => T): T {
  const course = courseByCode(code) as CourseDef & { status?: LanguageStatus };
  const before = course.status;
  course.status = status;
  try {
    return run();
  } finally {
    course.status = before;
  }
}

const enrollment = (
  course_code: string,
  over: Partial<CourseEnrollment> = {},
): CourseEnrollment => ({
  course_code,
  start_level: 'A1',
  placement_level: null,
  placement_completed_at: null,
  enrolled_at: '2026-11-21T00:00:00Z',
  last_selected_at: null,
  ...over,
});

describe('varios cursos por idioma (shared/courses.ts)', () => {
  it('orígenes: es, en, pt, it, fr', () => {
    expect(SOURCE_LANGUAGES).toEqual(['es', 'en', 'pt', 'it', 'fr']);
  });

  it('los seis cursos de siempre no cambian: mismos códigos, orden, origen y disponibilidad', () => {
    expect(COURSES.map((c) => [c.code, c.position, c.isDefault])).toEqual([
      ['en-from-es', 1, true],
      ['fr-from-es', 2, true],
      ['it-from-es', 3, true],
      ['pt-from-es', 4, true],
      ['zh-from-es', 5, true],
      ['es-from-en', 6, true],
      // Publicados el 2026-11-27 (supabase/pending/20270111*_publish_en_from_*.sql).
      ['en-from-pt', 7, false],
      ['en-from-it', 8, false],
      ['en-from-fr', 9, false],
    ]);
    for (const c of COURSES.filter((x) => x.isDefault)) {
      // Sin status ni niveles propios: heredan los del idioma.
      expect([c.code, c.status, c.levels]).toEqual([c.code, undefined, undefined]);
      const language = LANGUAGES.find((l) => l.code === c.target)!;
      expect(courseStatus(c)).toBe(language.status);
      expect(courseLevels(c)).toEqual(language.levels);
    }
  });

  it('inglés para hablantes de portugués, italiano y francés: publicados, no por defecto, A1–B2', () => {
    expect(ALL_COURSES.filter((c) => !c.isDefault).map((c) => c.code)).toEqual(NEW);
    for (const code of NEW) {
      const c = courseByCode(code)!;
      expect(c).toMatchObject({ target: 'en', isDefault: false, status: 'available' });
      expect(courseLevels(c)).toEqual(['A1', 'A2', 'B1', 'B2']);
      expect(isCourseSelectable(c)).toBe(true);
      // Publicados: están en el espejo de la base (supabase/tests/courses.test.mjs).
      expect(COURSES).toContain(c);
    }
    expect(courseByCode('en-from-pt')!.source).toBe('pt');
    expect(courseByCode('en-from-it')!.source).toBe('it');
    expect(courseByCode('en-from-fr')!.source).toBe('fr');
    expect(selectableCoursesFor('pt').map((c) => c.code)).toEqual(['en-from-pt']);
    expect(selectableCoursesFor('it').map((c) => c.code)).toEqual(['en-from-it']);
    expect(selectableCoursesFor('fr').map((c) => c.code)).toEqual(['en-from-fr']);
    // El curso por defecto del inglés sigue siendo el de español.
    expect(defaultCourseFor('en').code).toBe('en-from-es');
  });

  it('abrir un curso es cambiar su status: entonces se elige desde su origen', () => {
    withStatus('en-from-pt', 'available', () => {
      expect(selectableCoursesFor('pt').map((c) => c.code)).toEqual(['en-from-pt']);
      expect(selectableCoursesFor('es').map((c) => c.code)).toContain('en-from-es');
    });
    withStatus('en-from-it', 'beta', () => {
      expect(selectableCoursesFor('it')).toEqual([]);
      expect(selectableCoursesFor('it', true).map((c) => c.code)).toEqual(['en-from-it']);
    });
    withStatus('en-from-fr', 'soon', () => expect(selectableCoursesFor('fr', true)).toEqual([]));
  });

  it('la disponibilidad del curso manda sobre la del idioma', () => {
    const en = LANGUAGES.find((l) => l.code === 'en') as { status: LanguageStatus };
    const before = en.status;
    en.status = 'soon';
    try {
      // en-from-es hereda «soon»; en-from-pt, abierto por su cuenta, sigue disponible.
      expect(isCourseSelectable(courseByCode('en-from-es')!)).toBe(false);
      withStatus('en-from-pt', 'available', () =>
        expect(isCourseSelectable(courseByCode('en-from-pt')!)).toBe(true),
      );
    } finally {
      en.status = before;
    }
  });

  it('curso activo: respeta un curso que no es el por defecto de su idioma', () => {
    expect(activeCourseOf({ target_language: 'en', active_course_code: 'en-from-pt' }).code).toBe(
      'en-from-pt',
    );
    expect(activeCourseOf({ target_language: 'en', active_course_code: 'en-from-fr' }).source).toBe(
      'fr',
    );
    // De otro idioma (caché optimista): el por defecto del idioma del perfil.
    expect(activeCourseOf({ target_language: 'it', active_course_code: 'en-from-pt' }).code).toBe(
      'it-from-es',
    );
    expect(activeCourseOf({ target_language: 'en', active_course_code: 'nada' }).code).toBe(
      'en-from-es',
    );
  });
});

describe('curso de cada idioma (courseForLanguage = user_course_for)', () => {
  const profile: CourseProfile = {
    target_language: 'it',
    start_level: 'A1',
    active_course_code: 'it-from-es',
  };

  it('el activo, si es de ese idioma', () => {
    const p = { ...profile, target_language: 'en', active_course_code: 'en-from-pt' };
    expect(courseForLanguage(p, 'en', [enrollment('en-from-es')]).code).toBe('en-from-pt');
  });

  it('si no, el último elegido (los nunca elegidos, al final); si no, el por defecto', () => {
    const list = [
      enrollment('en-from-es', { last_selected_at: '2026-11-20T00:00:00Z' }),
      enrollment('en-from-pt', { last_selected_at: '2026-11-25T00:00:00Z' }),
      enrollment('en-from-fr', { enrolled_at: '2026-11-26T00:00:00Z' }),
    ];
    expect(courseForLanguage(profile, 'en', list).code).toBe('en-from-pt');
    // Sin ninguno elegido: el inscripto más reciente.
    const never = [
      enrollment('en-from-es'),
      enrollment('en-from-fr', { enrolled_at: '2026-11-26T00:00:00Z' }),
    ];
    expect(courseForLanguage(profile, 'en', never).code).toBe('en-from-fr');
    expect(courseForLanguage(profile, 'en', []).code).toBe('en-from-es');
    expect(courseForLanguage(profile, 'en').code).toBe('en-from-es');
  });

  it('«Tus cursos»: el progreso de un idioma es sólo del curso que la base devuelve para él', () => {
    const progress: LevelProgress = { level: 'A1', completed: 5, total: 100, ratio: 0.05 };
    const list = withStatus('en-from-pt', 'available', () =>
      buildCourseList({
        profile: { target_language: 'en', start_level: 'A1', active_course_code: 'en-from-pt' },
        enrollments: [enrollment('en-from-es'), enrollment('en-from-pt')],
        progressByLanguage: new Map([['en', { progress, started: true }]]),
        isTester: false,
      }),
    );
    expect(list.active.course.code).toBe('en-from-pt');
    expect(list.active.progress).toEqual(progress);
    // El otro curso de inglés es tuyo, pero su progreso no es el del activo.
    const other = list.mine.find((e) => e.course.code === 'en-from-es')!;
    expect(other.progress).toBeNull();
  });
});
