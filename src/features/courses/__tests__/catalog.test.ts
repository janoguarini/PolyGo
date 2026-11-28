import { LANGUAGES } from '@shared/languages';

import type { LevelProgress } from '@/features/profile/languageProgress';

import { buildCourseList, type CourseListInput } from '../catalog';
import type { CourseEnrollment, CourseProfile } from '../level';

const enrollment = (course_code: string, start_level: string): CourseEnrollment => ({
  course_code,
  start_level,
  placement_level: null,
  placement_completed_at: null,
  enrolled_at: '2026-11-21T00:00:00Z',
  last_selected_at: null,
});

type Row = { progress: LevelProgress | null; started: boolean };

const progress = (level: string, completed: number, total: number): Row => ({
  progress: { level, completed, total, ratio: completed / total },
  started: true,
});

const profile: CourseProfile = {
  target_language: 'en',
  start_level: 'A2',
  active_course_code: 'en-from-es',
};

const input = (over: Partial<CourseListInput> = {}): CourseListInput => ({
  profile,
  enrollments: [enrollment('en-from-es', 'A2')],
  progressByLanguage: new Map([['en', progress('A2', 3, 120)]]),
  isTester: false,
  ...over,
});

const codes = (entries: { course: { code: string } }[]) => entries.map((e) => e.course.code);

describe('lista de cursos (buildCourseList)', () => {
  it('identifica el curso activo con su idioma de origen, nivel y progreso', () => {
    const { active } = buildCourseList(input());
    expect(active.course).toMatchObject({ code: 'en-from-es', target: 'en', source: 'es' });
    expect(active.active).toBe(true);
    expect(active.startLevel).toBe('A2');
    expect(active.progress).toMatchObject({ level: 'A2', completed: 3, total: 120 });
  });

  it('ofrece los cursos disponibles agrupados por origen: primero el del curso activo', () => {
    const { available } = buildCourseList(input());
    expect(available.map((g) => g.source)).toEqual(['es', 'en', 'pt', 'it', 'fr']);
    expect(codes(available[0]!.courses)).toEqual([
      'fr-from-es',
      'it-from-es',
      'pt-from-es',
      'zh-from-es',
    ]);
    // El español se enseña desde el inglés: aparece en el grupo «desde inglés».
    expect(codes(available[1]!.courses)).toEqual(['es-from-en']);
    // Inglés para hablantes de portugués, italiano y francés: uno por grupo.
    expect(available.slice(2).map((g) => codes(g.courses))).toEqual([
      ['en-from-pt'],
      ['en-from-it'],
      ['en-from-fr'],
    ]);
  });

  it('un idioma «Próximamente» no se ofrece para empezar', () => {
    const es = LANGUAGES.find((l) => l.code === 'es') as { status: string };
    const status = es.status;
    es.status = 'soon';
    try {
      const all = codes(buildCourseList(input()).available.flatMap((g) => g.courses));
      expect(all).not.toContain('es-from-en');
    } finally {
      es.status = status;
    }
  });

  it('un curso nuevo empieza en A1 aunque el activo esté en A2 (no hereda el nivel)', () => {
    const { available } = buildCourseList(input());
    for (const entry of available.flatMap((g) => g.courses)) {
      expect([entry.course.code, entry.startLevel, entry.progress]).toEqual([
        entry.course.code,
        'A1',
        null,
      ]);
    }
  });

  it('mis cursos: los inscriptos y los empezados, cada uno con su nivel y su progreso', () => {
    const list = buildCourseList(
      input({
        enrollments: [
          enrollment('en-from-es', 'A2'),
          enrollment('it-from-es', 'A1'),
          enrollment('zh-from-es', 'A1'),
        ],
        progressByLanguage: new Map([
          ['en', progress('A2', 3, 120)],
          ['it', progress('A1', 40, 120)],
          ['zh', { progress: null, started: true } as Row],
        ]),
      }),
    );
    expect(codes(list.mine)).toEqual(['it-from-es', 'zh-from-es']);
    expect(list.mine[0]).toMatchObject({ startLevel: 'A1', progress: { completed: 40 } });
    // Los cursos míos no se ofrecen otra vez para empezar.
    expect(codes(list.available.flatMap((g) => g.courses))).toEqual([
      'fr-from-es',
      'pt-from-es',
      'es-from-en',
      'en-from-pt',
      'en-from-it',
      'en-from-fr',
    ]);
  });

  it('los niveles de cada curso son independientes', () => {
    const list = buildCourseList(
      input({
        profile: { target_language: 'it', start_level: 'A1', active_course_code: 'it-from-es' },
        enrollments: [enrollment('en-from-es', 'A2'), enrollment('it-from-es', 'A1')],
        progressByLanguage: new Map([
          ['en', progress('A2', 10, 120)],
          ['it', progress('A1', 1, 120)],
        ]),
      }),
    );
    expect([list.active.course.code, list.active.startLevel]).toEqual(['it-from-es', 'A1']);
    expect([list.mine[0]!.course.code, list.mine[0]!.startLevel]).toEqual(['en-from-es', 'A2']);
  });

  it('sin la migración (enrollments null) usa el progreso para saber qué cursos son tuyos', () => {
    const list = buildCourseList(
      input({
        enrollments: null,
        progressByLanguage: new Map([
          ['en', progress('A2', 3, 120)],
          ['pt', progress('A1', 2, 120)],
        ]),
      }),
    );
    expect(list.active.startLevel).toBe('A2'); // profiles.start_level, como hoy
    expect(codes(list.mine)).toEqual(['pt-from-es']);
    expect(list.mine[0]!.startLevel).toBe('A1');
  });

  it('un curso tuyo cuyo idioma dejó de estar disponible se ve pero no se elige', () => {
    const fr = LANGUAGES.find((l) => l.code === 'fr') as { status: string };
    const status = fr.status;
    fr.status = 'soon';
    try {
      const list = buildCourseList(
        input({
          enrollments: [
            enrollment('en-from-es', 'A2'),
            enrollment('fr-from-es', 'A1'),
            enrollment('it-from-es', 'A1'),
          ],
        }),
      );
      const entry = list.mine.find((e) => e.course.code === 'fr-from-es')!;
      expect(entry.selectable).toBe(false);
      expect(list.mine[list.mine.length - 1]!.course.code).toBe('fr-from-es');
    } finally {
      fr.status = status;
    }
  });

  it('el curso activo está siempre, aunque no tenga inscripción ni progreso todavía', () => {
    const list = buildCourseList(input({ enrollments: [], progressByLanguage: new Map() }));
    expect(list.active).toMatchObject({ active: true, progress: null, startLevel: 'A2' });
    expect(list.mine).toEqual([]);
  });

  it('si ya tenés todos los cursos disponibles, no queda ningún grupo para empezar', () => {
    const list = buildCourseList(
      input({
        enrollments: [
          ...['en', 'fr', 'it', 'pt', 'zh'].map((l) => enrollment(`${l}-from-es`, 'A1')),
          enrollment('es-from-en', 'A1'),
          ...['pt', 'it', 'fr'].map((s) => enrollment(`en-from-${s}`, 'A1')),
        ],
      }),
    );
    expect(list.available).toEqual([]);
  });
});
