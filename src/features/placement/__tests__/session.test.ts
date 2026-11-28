import { courseByCode, courseLevels } from '@shared/courses';
import { LANGUAGES } from '@shared/languages';
import { placementResult } from '@shared/placement';
import { unreadHan } from '@shared/readings';

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
  it('inglés (A1–B2 publicados) y francés (A1–A2) tienen test', () => {
    expect(placementBankFor(en)?.levels.map((l) => l.level)).toEqual(['A1', 'A2', 'B1', 'B2']);
    expect(placementBankFor(courseByCode('fr-from-es')!)?.levels.map((l) => l.level)).toEqual([
      'A1',
      'A2',
    ]);
  });

  it('inglés desde pt, it y fr: el banco también llega a B2', () => {
    for (const code of ['en-from-pt', 'en-from-it', 'en-from-fr']) {
      expect(placementBankFor(courseByCode(code)!)?.levels.map((l) => l.level)).toEqual([
        'A1',
        'A2',
        'B1',
        'B2',
      ]);
    }
  });

  it('italiano, portugués, chino y español (A1 y A2) también tienen test', () => {
    for (const code of ['it-from-es', 'pt-from-es', 'zh-from-es', 'es-from-en']) {
      expect(placementBankFor(courseByCode(code)!)?.levels.map((l) => l.level)).toEqual([
        'A1',
        'A2',
      ]);
    }
  });

  it('un curso con un solo nivel no tiene test (no hay nada que distinguir)', () => {
    const it_ = LANGUAGES.find((l) => l.code === 'it') as unknown as { levels: string[] };
    const levels = it_.levels;
    it_.levels = ['A1'];
    try {
      expect(placementBankFor(courseByCode('it-from-es')!)).toBeNull();
    } finally {
      it_.levels = levels;
    }
  });

  it('chino: el banco trae el pinyin de todo lo que muestran las preguntas', () => {
    const bank = placementBankFor(courseByCode('zh-from-es')!)!;
    const dict = new Map(Object.entries(bank.readings ?? {}));
    expect(dict.size).toBeGreaterThan(0);
    for (const item of bank.bands.flatMap((b) => b.items)) {
      expect(unreadHan(JSON.stringify(item.exercise), dict)).toEqual([]);
    }
    expect(placementBankFor(courseByCode('fr-from-es')!)!.readings).toBeUndefined();
  });

  it('acota el banco a los niveles publicados hoy: nunca más de lo disponible', () => {
    // El banco generado de en-from-es trae A1–B2; si el idioma publicara sólo A1–A2, el test no
    // podría ofrecer (ni asignar) B1 ni B2.
    const enLang = LANGUAGES.find((l) => l.code === 'en') as unknown as { levels: string[] };
    const levels = enLang.levels;
    enLang.levels = ['A1', 'A2'];
    try {
      expect(PLACEMENT_BANKS['en-from-es']!.bands.some((b) => b.level === 'B2')).toBe(true);
      const bank = placementBankFor(en)!;
      expect(bank.levels.map((l) => l.level)).toEqual(['A1', 'A2']);
      expect(bank.bands.every((b) => b.level === 'A1' || b.level === 'A2')).toBe(true);
    } finally {
      enLang.levels = levels;
    }
  });

  it('cada banco generado cabe en los niveles publicados de su curso', () => {
    for (const [code, generated] of Object.entries(PLACEMENT_BANKS)) {
      const course = courseByCode(code)!;
      const published = courseLevels(course);
      expect(generated.levels.every((l) => published.includes(l.level))).toBe(true);
      expect(generated.bands.every((b) => published.includes(b.level))).toBe(true);
    }
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
