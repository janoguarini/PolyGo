import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { checkAnswer } from '../../shared/answers';
import { COURSES } from '../../shared/courses';
import type { UserAnswer } from '../../shared/exercises';
import { languageConfig } from '../../shared/languages';
import { BAND_SIZE, PLACEMENT_VERSION, levelRank } from '../../shared/placement';
import { PLACEMENT_BANKS } from '../placement/banks.generated';
import { renderPlacementBanks } from '../placement/render';
import { fitsDimension, slotsFor, sourceExercise } from '../placement/select';

/**
 * Banco del test de nivel (docs/PLACEMENT_TEST.md): está al día, cada pregunta es un ejercicio real de
 * una lección publicada del curso, respeta la progresión y nunca va más allá de lo publicado.
 */

const banks = Object.values(PLACEMENT_BANKS);

const correctAnswer = (e: (typeof banks)[number]['bands'][number]['items'][number]['exercise']) => {
  const p = e.payload;
  const answer: UserAnswer =
    p.type === 'order_words'
      ? { kind: 'tokens', value: e.answer.replace(/[.?!]$/, '').split(' ') }
      : p.type === 'short_answer'
        ? { kind: 'text', value: e.answer }
        : { kind: 'option', value: e.answer };
  return answer;
};

it('banks.generated.ts está al día (npm run content:placement)', () => {
  const file = readFileSync(join(__dirname, '../placement/banks.generated.ts'), 'utf8');
  expect(file.replace(/\r\n/g, '\n')).toBe(renderPlacementBanks());
});

it('hay banco para cada curso con dos o más niveles publicados, y sólo para esos', () => {
  const expected = COURSES.filter((c) => languageConfig(c.target).levels.length >= 2).map(
    (c) => c.code,
  );
  expect(Object.keys(PLACEMENT_BANKS).sort()).toEqual(expected.sort());
  // Hoy: inglés y francés (A1 y A2). Italiano, portugués y chino sólo tienen A1; español, nada.
  expect(Object.keys(PLACEMENT_BANKS).sort()).toEqual(['en-from-es', 'fr-from-es']);
});

describe.each(banks.map((b) => [b.courseCode, b] as const))('%s', (courseCode, bank) => {
  const course = COURSES.find((c) => c.code === courseCode)!;
  const published = languageConfig(course.target).levels;
  const items = bank.bands.flatMap((b) => b.items);

  it('versión y niveles: exactamente los publicados, en orden', () => {
    expect(bank.version).toBe(PLACEMENT_VERSION);
    expect(bank.levels.map((l) => l.level)).toEqual([...published]);
    for (const l of bank.levels) expect(levelRank(l.level)).toBeGreaterThanOrEqual(0);
  });

  it('dos bandas por nivel, en orden de dificultad, con 3 preguntas cada una', () => {
    expect(bank.bands.map((b) => `${b.level}.${b.half}`)).toEqual(
      published.flatMap((l) => [`${l}.1`, `${l}.2`]),
    );
    for (const band of bank.bands) expect(band.items).toHaveLength(BAND_SIZE);
  });

  it('cada pregunta es, tal cual, un ejercicio de una lección del curso (nada inventado)', () => {
    for (const item of items) {
      const source = sourceExercise(courseCode, item.sourceId);
      expect(source).not.toBeNull();
      expect(item.exercise).toMatchObject({
        type: source!.type,
        skill: source!.skill,
        prompt: source!.prompt,
        payload: source!.payload,
        answer: source!.answer,
        acceptedAnswers: source!.acceptedAnswers ?? [],
      });
    }
  });

  it('cada pregunta sale de una unidad de su nivel y de su mitad', () => {
    for (const band of bank.bands) {
      const info = bank.levels.find((l) => l.level === band.level)!;
      const middle = Math.ceil(info.units / 2);
      for (const item of band.items) {
        if (band.half === 1) expect(item.unit).toBeLessThanOrEqual(middle);
        else expect(item.unit).toBeGreaterThan(middle);
        const prefix = item.sourceId.startsWith(`${course.target}.ex.`)
          ? null // ids declarados: el nivel lo comprueba sourceExercise + la unidad
          : `${course.target === 'en' ? '' : `${course.target}-`}${band.level.toLowerCase()}-u`;
        if (prefix) expect(item.sourceId.startsWith(prefix)).toBe(true);
      }
    }
  });

  it('progresión: las dimensiones de cada banda siguen el plan y el tipo corresponde', () => {
    bank.bands.forEach((band, i) => {
      expect(band.items.map((it) => it.dimension)).toEqual([...slotsFor(i)]);
      for (const item of band.items) {
        expect(fitsDimension(sourceExercise(courseCode, item.sourceId)!, item.dimension)).toBe(
          true,
        );
      }
    });
    // Cubre las cinco dimensiones.
    expect(new Set(items.map((i) => i.dimension)).size).toBe(5);
  });

  it('sin audio, sin preguntas repetidas y con un estímulo distinto por pregunta de lectura', () => {
    expect(items.some((i) => i.exercise.type === 'listen_choice')).toBe(false);
    expect(new Set(items.map((i) => i.sourceId)).size).toBe(items.length);
    const stimuli = items.flatMap((i) =>
      i.exercise.payload.type === 'context_choice' ? [i.exercise.payload.stimulus.id] : [],
    );
    expect(new Set(stimuli).size).toBe(stimuli.length);
  });

  it('la respuesta canónica de cada pregunta se corrige como correcta y otra opción no', () => {
    for (const item of items) {
      const e = item.exercise;
      expect(checkAnswer(e, correctAnswer(e)).correct).toBe(true);
      const p = e.payload;
      if ('options' in p) {
        const wrong = p.options.find((o) => o !== e.answer)!;
        expect(checkAnswer(e, { kind: 'option', value: wrong }).correct).toBe(false);
      }
    }
  });

  it('primera unidad de cada nivel con título (punto de partida que ve el usuario)', () => {
    for (const l of bank.levels) {
      expect(l.firstUnitTitle.length).toBeGreaterThan(2);
      expect(l.units).toBeGreaterThanOrEqual(2);
    }
  });
});
