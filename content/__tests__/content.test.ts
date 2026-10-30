import { checkAnswer } from '@shared/answers';
import type { Exercise, UserAnswer } from '@shared/exercises';

import { A1_PATH, A1_UNITS } from '../a1';
import { tokensOf } from '../builders';
import { pathExerciseId } from '../path';
import type { ExerciseDef } from '../types';

const allWords = A1_UNITS.flatMap((u) => u.words);
// Camino completo: incluye las lecciones de consolidación generadas (también se validan).
const lessons = A1_PATH.flatMap(({ unit, lessons: path }) =>
  path.map((lesson) => ({ unit, lesson, id: lesson.id })),
);
const exercises = lessons.flatMap(({ unit, lesson, id }) =>
  lesson.exercises.map((def, ei) => ({ unit, def, lessonId: id, id: pathExerciseId(id, ei) })),
);

function toExercise(def: ExerciseDef, id: string): Exercise {
  return {
    id,
    lessonId: null,
    position: 1,
    type: def.type,
    skill: def.skill,
    prompt: def.prompt,
    payload: def.payload,
    answer: def.answer,
    acceptedAnswers: def.acceptedAnswers ?? [],
    explanation: def.explanation ?? null,
    difficulty: def.difficulty ?? 1,
    recommendedSeconds: def.recommendedSeconds ?? 20,
    wordIds: def.words,
  };
}

function canonicalAnswer(def: ExerciseDef, text: string): UserAnswer {
  switch (def.payload.type) {
    case 'order_words':
      return { kind: 'tokens', value: tokensOf(text) };
    case 'match_pairs':
      return { kind: 'pairs', value: def.payload.pairs };
    case 'translate_write':
    case 'complete_word':
    case 'short_answer':
      return { kind: 'text', value: text };
    default:
      return { kind: 'option', value: text };
  }
}

describe('estructura del currículo A1', () => {
  it('tiene unidades con posiciones consecutivas y 5–8 lecciones escritas', () => {
    A1_UNITS.forEach((unit, i) => {
      expect(unit.position).toBe(i + 1);
      expect(unit.lessons.length).toBeGreaterThanOrEqual(5);
      expect(unit.lessons.length).toBeLessThanOrEqual(8);
    });
  });

  it('el camino intercala consolidación, conserva los ids escritos y cierra con el repaso final', () => {
    for (const { unit, lessons: path } of A1_PATH) {
      expect(path.map((l) => l.position)).toEqual(path.map((_, i) => i + 1));
      expect(path.filter((l) => l.kind === 'lesson').map((l) => l.id)).toEqual(
        unit.lessons.map(
          (_, i) =>
            `a1-u${String(unit.position).padStart(2, '0')}-l${String(i + 1).padStart(2, '0')}`,
        ),
      );
      expect(path.at(-1)?.kind).toBe('final');
      expect(path.length).toBeGreaterThanOrEqual(unit.lessons.length * 2);
      path.forEach((l) => expect(l.id).toMatch(/^[a-z0-9-]+$/));
    }
    const ids = lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada lección tiene entre 6 y 10 ejercicios', () => {
    for (const { lesson, id } of lessons) {
      expect([id, lesson.exercises.length >= 6 && lesson.exercises.length <= 10]).toEqual([
        id,
        true,
      ]);
    }
  });

  it('los ids de palabras son únicos y válidos', () => {
    const ids = allWords.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^en-[a-z0-9-]+$/));
  });

  it('cada palabra tiene IPA, traducción y ejemplos', () => {
    for (const w of allWords) {
      expect(w.ipa).toMatch(/^\/.+\/$/);
      expect(w.translation.trim()).not.toBe('');
      expect(w.exampleEn.trim()).not.toBe('');
      expect(w.exampleEs.trim()).not.toBe('');
    }
  });

  it('los ejercicios sólo usan palabras de su unidad o de unidades anteriores', () => {
    for (const { unit, def, id } of exercises) {
      const available = new Set(
        A1_UNITS.filter((u) => u.position <= unit.position).flatMap((u) =>
          u.words.map((w) => w.id),
        ),
      );
      expect(def.words.length).toBeGreaterThan(0);
      for (const w of def.words) expect([id, w, available.has(w)]).toEqual([id, w, true]);
    }
  });

  it('ninguna palabra inglesa coincide con la traducción de otra palabra', () => {
    // Si no, en Word Rush y en el widget "café" (coffee) podría tener como opción "café" (el lugar).
    const plain = (s: string) =>
      s
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/\(.*?\)/g, '')
        .trim()
        .toLowerCase();
    const clashes = allWords.flatMap((a) =>
      allWords
        .filter((b) => b.id !== a.id && plain(a.text) === plain(b.translation))
        .map((b) => `${a.id} ↔ ${b.id}`),
    );
    expect(clashes).toEqual([]);
  });

  it('cada palabra se practica en al menos un ejercicio', () => {
    const used = new Set(exercises.flatMap((e) => e.def.words));
    const unused = allWords.filter((w) => !used.has(w.id)).map((w) => w.id);
    expect(unused).toEqual([]);
  });
});

describe('integridad de cada ejercicio', () => {
  it.each(exercises.map((e) => [e.id, e] as const))('%s', (_id, { def, id }) => {
    expect(def.payload.type).toBe(def.type);
    const p = def.payload;

    switch (p.type) {
      case 'image_choice':
      case 'translation_choice':
      case 'fill_blank':
      case 'listen_choice':
        expect(p.options).toContain(def.answer);
        expect(new Set(p.options).size).toBe(p.options.length);
        expect(p.options.length).toBeGreaterThanOrEqual(3);
        if (p.type === 'image_choice') expect(p.emoji.length).toBeGreaterThan(0);
        if (p.type === 'fill_blank') expect(p.sentence.split('___').length).toBe(2);
        break;
      case 'order_words':
        expect(p.tokens).toEqual(tokensOf(def.answer));
        expect(p.tokens.length).toBeGreaterThanOrEqual(3);
        break;
      case 'complete_word': {
        expect(p.masked.length).toBe(def.answer.length);
        expect(p.masked).toContain('_');
        [...p.masked].forEach((ch, i) => {
          if (ch !== '_') expect(ch).toBe(def.answer[i]);
        });
        break;
      }
      case 'match_pairs':
        expect(p.pairs.length).toBeGreaterThanOrEqual(3);
        expect(new Set(p.pairs.map((x) => x.left)).size).toBe(p.pairs.length);
        expect(new Set(p.pairs.map((x) => x.right)).size).toBe(p.pairs.length);
        break;
      default:
        expect(def.answer.trim()).not.toBe('');
    }

    // La respuesta canónica y cada variante aceptada deben pasar el validador real.
    const exercise = toExercise(def, id);
    const verdict = checkAnswer(exercise, canonicalAnswer(def, def.answer));
    expect(verdict).toMatchObject({ correct: true, typo: false });
    for (const accepted of def.acceptedAnswers ?? []) {
      if (def.payload.type === 'order_words') continue; // variantes de orden no aplican a tokens fijos
      expect([accepted, checkAnswer(exercise, canonicalAnswer(def, accepted)).correct]).toEqual([
        accepted,
        true,
      ]);
    }
  });
});
