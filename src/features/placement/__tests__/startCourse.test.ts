import { courseByCode } from '@shared/courses';

import type { StartCourseResult } from '@/features/courses/api';

import { PlacementUnsupportedError, runStartCourse, type StartCourseDeps } from '../startCourse';

jest.mock('@/lib/supabase', () => ({ requireSupabase: jest.fn() }));

const en = courseByCode('en-from-es')!;
const fr = courseByCode('fr-from-es')!;
const placement = { level: 'A2', correct: 7, total: 9, version: 'placement-v1' };

const row = (patch: Partial<StartCourseResult> = {}): StartCourseResult => ({
  created: true,
  course_code: 'en-from-es',
  start_level: 'A2',
  placement_level: 'A2',
  placement_completed_at: '2026-11-22T12:00:00Z',
  ...patch,
});

function deps(startCourse: StartCourseDeps['startCourse']) {
  return {
    startCourse: jest.fn(startCourse),
    setActiveCourse: jest.fn(async () => ({}) as unknown),
    setTargetLanguage: jest.fn(async () => undefined),
  } as unknown as StartCourseDeps & Record<keyof StartCourseDeps, jest.Mock>;
}

it('guarda en el curso elegido, con el nivel y el resultado del test', async () => {
  const d = deps(async () => row());
  const out = await runStartCourse({ course: en, startLevel: 'A2', placement }, d);
  expect(d.startCourse).toHaveBeenCalledWith('en-from-es', 'A2', placement);
  expect(out).toMatchObject({ created: true, startLevel: 'A2', legacy: false });
  expect(d.setActiveCourse).not.toHaveBeenCalled();
});

it('cada curso con su resultado: el del francés va al francés', async () => {
  const d = deps(async () => row({ course_code: 'fr-from-es' }));
  await runStartCourse(
    { course: fr, startLevel: 'A1', placement: { ...placement, level: 'A1' } },
    d,
  );
  expect(d.startCourse.mock.calls[0][0]).toBe('fr-from-es');
});

it('«Empezar desde A1» no manda resultado', async () => {
  const d = deps(async () => row({ start_level: 'A1', placement_level: null }));
  const out = await runStartCourse({ course: en, startLevel: 'A1', placement: null }, d);
  expect(d.startCourse).toHaveBeenCalledWith('en-from-es', 'A1', null);
  expect(out.startLevel).toBe('A1');
});

it('un curso ya empezado devuelve el nivel que tenía (no se pisa)', async () => {
  const d = deps(async () => row({ created: false, start_level: 'A1', placement_level: 'A1' }));
  const out = await runStartCourse({ course: en, startLevel: 'A2', placement }, d);
  expect(out).toMatchObject({ created: false, startLevel: 'A1' });
});

it('un error de red se propaga (la pantalla ofrece reintentar) y no cambia de curso por otro lado', async () => {
  const d = deps(async () => {
    throw new Error('network');
  });
  await expect(runStartCourse({ course: en, startLevel: 'A2', placement }, d)).rejects.toThrow(
    'network',
  );
  expect(d.setActiveCourse).not.toHaveBeenCalled();
  expect(d.setTargetLanguage).not.toHaveBeenCalled();
  // Reintento: la misma llamada, ahora bien.
  d.startCourse.mockImplementation(async () => row());
  await expect(
    runStartCourse({ course: en, startLevel: 'A2', placement }, d),
  ).resolves.toMatchObject({ created: true });
});

describe('sin la migración del test (start_course no existe)', () => {
  it('un resultado no se puede guardar: error explícito, nada cambia', async () => {
    const d = deps(async () => null);
    await expect(
      runStartCourse({ course: en, startLevel: 'A2', placement }, d),
    ).rejects.toBeInstanceOf(PlacementUnsupportedError);
    await expect(
      runStartCourse({ course: en, startLevel: 'A1', placement: { ...placement, level: 'A1' } }, d),
    ).rejects.toBeInstanceOf(PlacementUnsupportedError);
    expect(d.setActiveCourse).not.toHaveBeenCalled();
  });

  it('desde A1 usa el cambio de curso de la Fase 3 (o set_target_language sin modelo de cursos)', async () => {
    const d = deps(async () => null);
    const out = await runStartCourse({ course: fr, startLevel: 'A1', placement: null }, d);
    expect(d.setActiveCourse).toHaveBeenCalledWith('fr-from-es');
    expect(d.setTargetLanguage).not.toHaveBeenCalled();
    expect(out).toMatchObject({ created: true, startLevel: 'A1', legacy: true });

    d.setActiveCourse.mockImplementation(async () => null);
    await runStartCourse({ course: fr, startLevel: 'A1', placement: null }, d);
    expect(d.setTargetLanguage).toHaveBeenCalledWith('fr');
  });
});
