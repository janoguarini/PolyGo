import {
  canonicalForm,
  checkAnswer,
  editDistance,
  normalizeAnswer,
  serializeAnswer,
} from '../answers';
import type { Exercise, ExercisePayload } from '../exercises';

function exercise(overrides: Partial<Exercise> & { payload: ExercisePayload }): Exercise {
  return {
    id: 'x',
    lessonId: 'l',
    position: 1,
    type: overrides.payload.type,
    skill: 'translation',
    prompt: '',
    answer: '',
    acceptedAnswers: [],
    explanation: null,
    difficulty: 1,
    recommendedSeconds: 20,
    wordIds: [],
    ...overrides,
  };
}

const translate = exercise({
  payload: { type: 'translate_write', source: 'La silla es grande.' },
  answer: 'The chair is big.',
});

const text = (value: string) => ({ kind: 'text' as const, value });

describe('normalizeAnswer', () => {
  it('ignora mayúsculas, espacios extra y puntuación final', () => {
    expect(normalizeAnswer('  The   CHAIR is big!  ')).toBe('the chair is big');
  });

  it('unifica apóstrofos tipográficos', () => {
    expect(normalizeAnswer('I’m fine')).toBe("i'm fine");
  });

  it('quita signos de apertura del español y comas', () => {
    expect(normalizeAnswer('¿Hola, Ana?')).toBe('hola ana');
  });

  it('conserva las tildes', () => {
    expect(normalizeAnswer('Adiós')).toBe('adiós');
    expect(normalizeAnswer('Adiós')).not.toBe(normalizeAnswer('Adios'));
  });
});

describe('canonicalForm', () => {
  it('expande sólo las contracciones de la lista', () => {
    expect(canonicalForm("I'm from Spain")).toBe('i am from spain');
    expect(canonicalForm("She isn't here")).toBe('she is not here');
    expect(canonicalForm("y'all")).toBe("y'all");
  });

  it('expande las contracciones del A2 (pasado, futuro y presente perfecto)', () => {
    expect(canonicalForm("I didn't go")).toBe('i did not go');
    expect(canonicalForm("I'll help you")).toBe('i will help you');
    expect(canonicalForm("I've never been to England")).toBe('i have never been to england');
    expect(canonicalForm("She hasn't called yet")).toBe('she has not called yet');
  });
});

describe('editDistance', () => {
  it('calcula la distancia de Levenshtein', () => {
    expect(editDistance('kitten', 'sitting')).toBe(3);
    expect(editDistance('chair', 'chair')).toBe(0);
    expect(editDistance('', 'abc')).toBe(3);
  });
});

describe('checkAnswer · escritura', () => {
  it('acepta la respuesta exacta normalizada', () => {
    expect(checkAnswer(translate, text('the chair is big')).correct).toBe(true);
    expect(checkAnswer(translate, text('The chair is big.')).correct).toBe(true);
  });

  it('rechaza respuestas incorrectas o vacías', () => {
    expect(checkAnswer(translate, text('The table is big')).correct).toBe(false);
    expect(checkAnswer(translate, text('   ')).correct).toBe(false);
  });

  it('acepta un error de tipeo en respuestas largas y lo marca', () => {
    const v = checkAnswer(translate, text('The chiar is big'));
    // "chiar" está a distancia 2 (transposición) → no se acepta
    expect(v.correct).toBe(false);
    const typo = checkAnswer(translate, text('The chair is bigg'));
    expect(typo).toEqual({ correct: true, typo: true, expected: 'The chair is big.' });
  });

  it('no tolera errores en respuestas cortas', () => {
    const short = exercise({
      payload: { type: 'translate_write', source: 'Hola' },
      answer: 'hello',
    });
    expect(checkAnswer(short, text('helo')).correct).toBe(false);
  });

  it('no tolera errores en ejercicios de ortografía', () => {
    const spelling = exercise({
      payload: { type: 'complete_word', masked: 'g__dbye', hint: 'adiós' },
      answer: 'goodbye',
    });
    expect(checkAnswer(spelling, text('goodbye')).correct).toBe(true);
    expect(checkAnswer(spelling, text('Goodbye')).correct).toBe(true);
    expect(checkAnswer(spelling, text('godbye')).correct).toBe(false);
  });

  it('acepta variantes explícitas y contracciones', () => {
    const ex = exercise({
      payload: { type: 'translate_write', source: 'Soy de Argentina.' },
      answer: 'I am from Argentina.',
      acceptedAnswers: ["I'm Argentinian."],
    });
    expect(checkAnswer(ex, text("I'm from Argentina")).correct).toBe(true);
    expect(checkAnswer(ex, text('i’m from argentina')).correct).toBe(true);
    expect(checkAnswer(ex, text('I am Argentinian')).correct).toBe(true);
  });
});

describe('checkAnswer · opciones, orden y parejas', () => {
  const choice = exercise({
    payload: { type: 'image_choice', emoji: '🪑', options: ['chair', 'table', 'window', 'door'] },
    answer: 'chair',
  });

  it('compara opciones de forma exacta', () => {
    expect(checkAnswer(choice, { kind: 'option', value: 'chair' }).correct).toBe(true);
    expect(checkAnswer(choice, { kind: 'option', value: 'table' }).correct).toBe(false);
  });

  it('valida el orden de palabras', () => {
    const order = exercise({
      payload: {
        type: 'order_words',
        tokens: ['is', 'The', 'big', 'chair'],
        translation: 'La silla es grande.',
      },
      answer: 'The chair is big.',
    });
    expect(
      checkAnswer(order, { kind: 'tokens', value: ['The', 'chair', 'is', 'big'] }).correct,
    ).toBe(true);
    expect(
      checkAnswer(order, { kind: 'tokens', value: ['The', 'big', 'is', 'chair'] }).correct,
    ).toBe(false);
  });

  it('valida parejas completas y correctas', () => {
    const match = exercise({
      payload: {
        type: 'match_pairs',
        pairs: [
          { left: 'one', right: 'uno' },
          { left: 'two', right: 'dos' },
        ],
      },
    });
    expect(
      checkAnswer(match, {
        kind: 'pairs',
        value: [
          { left: 'two', right: 'dos' },
          { left: 'one', right: 'uno' },
        ],
      }).correct,
    ).toBe(true);
    expect(
      checkAnswer(match, { kind: 'pairs', value: [{ left: 'one', right: 'uno' }] }).correct,
    ).toBe(false);
    expect(
      checkAnswer(match, {
        kind: 'pairs',
        value: [
          { left: 'one', right: 'dos' },
          { left: 'two', right: 'uno' },
        ],
      }).correct,
    ).toBe(false);
  });
});

describe('serializeAnswer', () => {
  it('serializa cada tipo de respuesta', () => {
    expect(serializeAnswer({ kind: 'tokens', value: ['I', 'am'] })).toBe('I am');
    expect(serializeAnswer({ kind: 'pairs', value: [{ left: 'a', right: 'b' }] })).toBe('a=b');
  });
});
