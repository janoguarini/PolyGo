import { courseByCode } from '@shared/courses';
import { placementResult, type PlacementBank } from '@shared/placement';

import { PLACEMENT_BANKS } from '../../../../content/placement/banks.generated';
import {
  createSession,
  placementBankFor,
  questionNumber,
  sessionReducer,
  sessionResult,
  type PlacementSession,
} from '../session';

const en = courseByCode('en-from-es')!;
const right = { correct: true, typo: false, expected: '' } as const;
const wrong = { correct: false, expected: '' } as const;

const answer = (s: PlacementSession, ok: boolean) =>
  sessionReducer(sessionReducer(s, { type: 'answer', verdict: ok ? right : wrong, answer: 'x' }), {
    type: 'continue',
  });

describe('placementBankFor', () => {
  it('inglés y francés tienen test (A1 y A2 publicados)', () => {
    expect(placementBankFor(en)?.levels.map((l) => l.level)).toEqual(['A1', 'A2']);
    expect(placementBankFor(courseByCode('fr-from-es')!)).not.toBeNull();
  });

  it('italiano, portugués y chino (sólo A1) y español («Próximamente») no tienen test', () => {
    for (const code of ['it-from-es', 'pt-from-es', 'zh-from-es', 'es-from-en']) {
      expect(placementBankFor(courseByCode(code)!)).toBeNull();
    }
  });

  it('acota el banco a los niveles publicados hoy: nunca más de lo disponible', () => {
    const withB1: PlacementBank = {
      ...PLACEMENT_BANKS['en-from-es']!,
      levels: [
        ...PLACEMENT_BANKS['en-from-es']!.levels,
        { level: 'B1', firstUnitTitle: 'x', units: 4 },
      ],
      bands: [
        ...PLACEMENT_BANKS['en-from-es']!.bands,
        { ...PLACEMENT_BANKS['en-from-es']!.bands[0]!, level: 'B1' },
      ],
    };
    const bank = placementBankFor(en, { 'en-from-es': withB1 })!;
    expect(bank.levels.map((l) => l.level)).toEqual(['A1', 'A2']);
    expect(bank.bands.every((b) => b.level !== 'B1')).toBe(true);
  });

  it('el resultado de un banco no sirve para otro curso: cada curso usa el suyo', () => {
    expect(placementBankFor(en)!.courseCode).toBe('en-from-es');
    expect(placementBankFor(courseByCode('fr-from-es')!)!.courseCode).toBe('fr-from-es');
  });
});

describe('estado de la pantalla', () => {
  const bank = placementBankFor(en)!;

  it('bienvenida → pregunta 1 → feedback → pregunta 2', () => {
    let s = createSession(bank);
    expect(s.phase).toBe('intro');
    s = sessionReducer(s, { type: 'start' });
    expect(s.phase).toBe('question');
    expect(questionNumber(s)).toBe(1);
    s = sessionReducer(s, { type: 'answer', verdict: right, answer: 'x' });
    expect(s.phase).toBe('feedback');
    expect(s.last?.verdict.correct).toBe(true);
    expect(questionNumber(s)).toBe(1);
    s = sessionReducer(s, { type: 'continue' });
    expect(s.phase).toBe('question');
    expect(questionNumber(s)).toBe(2);
  });

  it('no acepta dos respuestas a la misma pregunta (doble toque)', () => {
    const s = sessionReducer(sessionReducer(createSession(bank), { type: 'start' }), {
      type: 'answer',
      verdict: right,
      answer: 'x',
    });
    expect(sessionReducer(s, { type: 'answer', verdict: wrong, answer: 'y' })).toBe(s);
  });

  it('avisa cuando sube de nivel (de A1 a A2) y no al terminar', () => {
    let s = sessionReducer(createSession(bank), { type: 'start' });
    for (let i = 0; i < 3; i += 1) s = answer(s, true); // A1·1 superada + 1 de A1·2
    s = sessionReducer(s, { type: 'answer', verdict: right, answer: 'x' }); // A1·2 superada
    expect(s.levelUp).toBe('A2');
    s = sessionReducer(s, { type: 'continue' });
    s = answer(s, false);
    s = sessionReducer(s, { type: 'answer', verdict: wrong, answer: 'x' }); // pierde A2·1
    expect(s.levelUp).toBeNull();
    expect(sessionResult(s)).toBeNull(); // todavía en el feedback
    s = sessionReducer(s, { type: 'continue' });
    expect(s.phase).toBe('result');
    expect(sessionResult(s)).toMatchObject({ level: 'A2', correct: 4, answered: 6 });
  });

  it('el resultado existe sólo al final (salir antes no deja nivel)', () => {
    let s = sessionReducer(createSession(bank), { type: 'start' });
    s = answer(s, true);
    expect(sessionResult(s)).toBeNull();
    expect(placementResult(s.test)).toBeNull();
  });

  it('repetir el test empieza de cero', () => {
    let s = sessionReducer(createSession(bank), { type: 'start' });
    s = answer(s, false);
    s = answer(s, false);
    expect(s.phase).toBe('result');
    s = sessionReducer(s, { type: 'restart' });
    expect(s.phase).toBe('intro');
    expect(s.test.answers).toEqual([]);
  });
});
