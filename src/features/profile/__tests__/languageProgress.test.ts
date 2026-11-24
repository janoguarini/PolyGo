import { languageConfig } from '@shared/languages';

import type { LessonProgress, UnitSummary } from '@/features/learning/curriculum';

import { buildLanguageRows } from '../languageProgress';

const unit = (id: string, level: string, position: number, lessons: number): UnitSummary => ({
  id,
  level,
  position,
  title: id,
  titleEn: id,
  description: '',
  emoji: '',
  lessons: Array.from({ length: lessons }, (_, i) => ({
    id: `${id}-l${i + 1}`,
    unitId: id,
    position: i + 1,
    title: '',
    objective: '',
    exerciseCount: 5,
  })),
});
const done = (...ids: string[]): LessonProgress[] =>
  ids.map((lessonId) => ({ lessonId, timesCompleted: 1, bestAccuracy: 1 }));

const en = [unit('en1', 'A1', 1, 2), unit('en2', 'A1', 2, 2), unit('en3', 'A2', 1, 4)];
const itUnits = [unit('it1', 'A1', 1, 4)];
const pt = [unit('pt1', 'A1', 1, 4)];
const langs = [languageConfig('en'), languageConfig('it'), languageConfig('pt')];

describe('Mis idiomas: nivel y progreso reales', () => {
  it('el idioma actual siempre aparece; los demás sólo si se empezaron', () => {
    const rows = buildLanguageRows(langs, [en, itUnits, pt], done('it1-l1'), 'en', 'A1');
    expect(rows.map((r) => r.language.code)).toEqual(['en', 'it']);
    expect(rows[0]!.current).toBe(true);
  });

  it('el nivel en curso es el primero sin terminar, como en Aprender', () => {
    const rows = buildLanguageRows(
      langs,
      [en, itUnits, pt],
      done('en1-l1', 'en1-l2', 'en2-l1', 'en2-l2', 'en3-l1'),
      'en',
      'A1',
    );
    expect(rows[0]!.progress).toEqual({ level: 'A2', completed: 1, total: 4, ratio: 0.25 });
  });

  it('respeta el nivel desde el que empezaste en el idioma actual', () => {
    const rows = buildLanguageRows(langs, [en, itUnits, pt], [], 'en', 'A2');
    expect(rows[0]!.progress).toMatchObject({ level: 'A2', completed: 0, ratio: 0 });
  });

  it('sin el camino cargado, el actual aparece sin progreso (no se inventa)', () => {
    const rows = buildLanguageRows(langs, [undefined, itUnits, pt], [], 'en', 'A1');
    expect(rows).toEqual([{ language: langs[0], current: true, progress: null }]);
  });
});
