import { canTransition, isTerminalStatus, WORD_RUSH } from '../protocol';
import {
  accuracy,
  answerPoints,
  applyPoints,
  decideOutcomes,
  generateQuestions,
  pictureEmojis,
  questionKind,
  streakBonus,
  streakLevel,
  toQuestionView,
  withPictures,
  type RushQuestion,
  type RushWord,
} from '../wordRush';

function mulberry(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WORDS: RushWord[] = [
  { id: 'hello', text: 'hello', translationEs: 'hola' },
  { id: 'hi', text: 'hi', translationEs: 'hola' },
  { id: 'bye', text: 'goodbye', translationEs: 'adiós' },
  { id: 'thanks', text: 'thank you', translationEs: 'gracias' },
  { id: 'please', text: 'please', translationEs: 'por favor' },
  { id: 'yes', text: 'yes', translationEs: 'sí' },
  { id: 'no', text: 'no', translationEs: 'no' },
];

describe('generateQuestions', () => {
  const questions = generateQuestions(WORDS, 40, mulberry(7));

  it('genera la cantidad pedida con índices consecutivos', () => {
    expect(questions).toHaveLength(40);
    questions.forEach((q, i) => expect(q.index).toBe(i));
  });

  it('cada pregunta tiene 4 opciones distintas y exactamente una correcta', () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(WORD_RUSH.optionsPerQuestion);
      expect(new Set(q.options.map((o) => o.toLowerCase())).size).toBe(q.options.length);
      const word = WORDS.find((w) => w.id === q.wordId)!;
      const expected = q.direction === 'en_es' ? word.translationEs : word.text;
      expect(q.options[q.correctOption]).toBe(expected);
      expect(q.prompt).toBe(q.direction === 'en_es' ? word.text : word.translationEs);
    }
  });

  it('nunca ofrece como distractor un sinónimo con la misma traducción', () => {
    for (const q of questions.filter((q) => q.wordId === 'hello' || q.wordId === 'hi')) {
      const other = q.wordId === 'hello' ? 'hi' : 'hello';
      expect(q.options).not.toContain(other);
    }
  });

  it('no repite la misma palabra dos veces seguidas', () => {
    for (let i = 1; i < questions.length; i++) {
      expect(questions[i]!.wordId).not.toBe(questions[i - 1]!.wordId);
    }
  });

  it('es determinista para la misma fuente aleatoria', () => {
    expect(generateQuestions(WORDS, 10, mulberry(3))).toEqual(
      generateQuestions(WORDS, 10, mulberry(3)),
    );
  });

  it('falla si no hay palabras suficientes', () => {
    expect(() => generateQuestions(WORDS.slice(0, 3), 5, mulberry(1))).toThrow();
  });

  it('la vista del cliente no incluye la respuesta correcta', () => {
    const view = toQuestionView(questions[0]!, 123);
    expect(view).not.toHaveProperty('correctOption');
    expect(view).not.toHaveProperty('wordId');
    expect(view.sentAt).toBe(123);
  });
});

describe('puntuación', () => {
  it('correcta inmediata = 150, al límite de la ventana = 100, tarde = 100', () => {
    expect(answerPoints(true, 0)).toBe(150);
    expect(answerPoints(true, 2_500)).toBe(125);
    expect(answerPoints(true, WORD_RUSH.speedBonusWindowMs)).toBe(100);
    expect(answerPoints(true, 60_000)).toBe(100);
    expect(answerPoints(true, -50)).toBe(150);
  });

  it('incorrecta = −50 y el puntaje no baja de 0', () => {
    expect(answerPoints(false, 0)).toBe(-50);
    expect(applyPoints(30, -50)).toBe(0);
    expect(applyPoints(200, -50)).toBe(150);
  });

  it('adivinar al azar entre 4 opciones tiene valor esperado ≈ 0 (sin bonus)', () => {
    const expected = 0.25 * WORD_RUSH.correctPoints - 0.75 * WORD_RUSH.wrongPenalty;
    expect(Math.abs(expected)).toBeLessThanOrEqual(WORD_RUSH.wrongPenalty / 2);
  });
});

describe('racha', () => {
  it('suma un poco más desde 3, 5 y 8 correctas seguidas', () => {
    expect([1, 2, 3, 4, 5, 7, 8, 20].map(streakBonus)).toEqual([0, 0, 10, 10, 20, 20, 30, 30]);
    expect([2, 3, 5, 8].map(streakLevel)).toEqual([0, 1, 2, 3]);
  });

  it('se suma a la respuesta correcta y nunca supera el tope', () => {
    expect(answerPoints(true, 5_000, 3)).toBe(110);
    expect(answerPoints(true, 0, 12)).toBe(WORD_RUSH.maxCorrectPoints);
    expect(answerPoints(false, 0, 12)).toBe(-WORD_RUSH.wrongPenalty);
  });
});

describe('tipos de pregunta', () => {
  const pool: RushWord[] = [
    { id: 'apple', text: 'apple', translationEs: 'manzana', emoji: '🍎' },
    { id: 'coffee', text: 'coffee', translationEs: 'café', emoji: '☕' },
    { id: 'cup', text: 'cup', translationEs: 'taza', emoji: '☕' },
    { id: 'know', text: 'know', translationEs: 'saber', emoji: '🤔' },
    { id: 'dog', text: 'dog', translationEs: 'perro', emoji: null },
  ];

  it('sólo usa imágenes inequívocas', () => {
    expect([...pictureEmojis(pool).entries()]).toEqual([['apple', '🍎']]);
  });

  it('es determinístico: imagen, audio o texto según la pregunta', () => {
    const q = (over: Partial<RushQuestion>): RushQuestion => ({
      index: 0,
      wordId: 'apple',
      direction: 'es_en',
      prompt: 'manzana',
      options: ['apple', 'cup', 'dog', 'know'],
      correctOption: 0,
      ...over,
    });
    const [withImage] = withPictures([q({})], pictureEmojis(pool));
    expect(questionKind(withImage!)).toBe('image');
    expect(toQuestionView(withImage!, 0)).toMatchObject({ kind: 'image', emoji: '🍎' });
    expect(questionKind(q({ direction: 'en_es', index: 1 }))).toBe('audio');
    expect(questionKind(q({ direction: 'en_es', index: 3 }))).toBe('text');
    expect(toQuestionView(q({ index: 2 }), 0).emoji).toBeUndefined();
  });
});

describe('decideOutcomes', () => {
  const line = (score: number, correct = 5, answered = 10, forfeited = false) => ({
    score,
    correct,
    answered,
    forfeited,
  });

  it('gana el mayor puntaje', () => {
    expect(decideOutcomes(line(900), line(600))).toEqual(['win', 'loss']);
    expect(decideOutcomes(line(100), line(600))).toEqual(['loss', 'win']);
  });

  it('empate de puntaje se desempata por precisión', () => {
    expect(decideOutcomes(line(500, 5, 6), line(500, 5, 8))).toEqual(['win', 'loss']);
  });

  it('empate total', () => {
    expect(decideOutcomes(line(500, 5, 8), line(500, 5, 8))).toEqual(['draw', 'draw']);
    expect(decideOutcomes(line(0, 0, 0), line(0, 0, 0))).toEqual(['draw', 'draw']);
  });

  it('el que abandona pierde aunque vaya ganando', () => {
    expect(decideOutcomes(line(1500, 10, 10, true), line(0))).toEqual(['loss', 'win']);
    expect(decideOutcomes(line(0), line(1500, 10, 10, true))).toEqual(['win', 'loss']);
  });

  it('precisión sin respuestas es 0', () => {
    expect(accuracy({ correct: 0, answered: 0 })).toBe(0);
  });
});

describe('máquina de estados', () => {
  it('acepta sólo las transiciones del protocolo', () => {
    expect(canTransition('matched', 'ready')).toBe(true);
    expect(canTransition('ready', 'in_progress')).toBe(true);
    expect(canTransition('in_progress', 'reconnecting')).toBe(true);
    expect(canTransition('reconnecting', 'in_progress')).toBe(true);
    expect(canTransition('reconnecting', 'forfeited')).toBe(true);
    expect(canTransition('in_progress', 'completed')).toBe(true);
    expect(canTransition('matched', 'in_progress')).toBe(false);
    expect(canTransition('in_progress', 'cancelled')).toBe(false);
    expect(canTransition('completed', 'in_progress')).toBe(false);
    expect(canTransition('in_progress', 'forfeited')).toBe(false);
  });

  it('estados terminales', () => {
    expect(isTerminalStatus('completed')).toBe(true);
    expect(isTerminalStatus('forfeited')).toBe(true);
    expect(isTerminalStatus('cancelled')).toBe(true);
    expect(isTerminalStatus('reconnecting')).toBe(false);
  });
});
