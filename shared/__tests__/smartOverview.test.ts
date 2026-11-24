import { SMART_REVIEW_SIZE, type FocusProgress } from '../focusReview';
import { memoryLevel, smartOverview } from '../smartOverview';

const NOW = Date.parse('2026-11-23T12:00:00Z');
const HOUR = 60 * 60 * 1000;
let n = 0;
function entry(p: Partial<FocusProgress> & { unit?: string }): FocusProgress {
  n += 1;
  return {
    word: { id: `w${n}`, unit_id: p.unit ?? 'u1' },
    stage: p.stage ?? 2,
    seenCount: p.seenCount ?? 4,
    incorrectCount: p.incorrectCount ?? 0,
    nextReviewAt:
      p.nextReviewAt === undefined ? new Date(NOW + 72 * HOUR).toISOString() : p.nextReviewAt,
  };
}
const units = [
  { id: 'u1', level: 'A1', title: 'Hola', emoji: '👋' },
  { id: 'u2', level: 'A1', title: 'Números', emoji: '🔢' },
];

describe('smartOverview', () => {
  it('sin palabras: todo en cero', () => {
    const o = smartOverview([], units, NOW);
    expect(o).toMatchObject({ studied: 0, memory: 0, toReinforce: 0, exercises: 0, focus: [] });
  });

  it('cuenta memoria, palabras, temas y motivos con las reglas del servidor', () => {
    const entries = [
      entry({}), // firme
      entry({}), // firme
      entry({ nextReviewAt: new Date(NOW - HOUR).toISOString() }), // vencida
      entry({ incorrectCount: 3, seenCount: 5, unit: 'u2' }), // errores frecuentes
      entry({ nextReviewAt: new Date(NOW + 2 * HOUR).toISOString() }), // por olvidarse (firme)
      entry({ seenCount: 0 }), // nunca vista: no cuenta
    ];
    const o = smartOverview(entries, units, NOW);
    expect(o.studied).toBe(5);
    // Firmes: las dos primeras y la que vence en 2 h (no vencida, sin errores).
    expect(o.memory).toBe(60);
    expect(o.memoryLevel).toBe('good');
    expect(o.toReinforce).toBe(3);
    expect(o.topicsToImprove).toBe(2);
    expect(o.exercises).toBe(3);
    expect(o.focus).toEqual([
      { reason: 'due', count: 1 },
      { reason: 'frequent_mistakes', count: 1 },
      { reason: 'due_soon', count: 1 },
    ]);
  });

  it('la sesión tiene tope y la duración sale de los ejercicios', () => {
    const entries = Array.from({ length: 30 }, () =>
      entry({ nextReviewAt: new Date(NOW - HOUR).toISOString() }),
    );
    const o = smartOverview(entries, units, NOW);
    expect(o.toReinforce).toBe(30);
    expect(o.exercises).toBe(SMART_REVIEW_SIZE);
    expect(o.minutes).toEqual({ low: 5, high: 7 });
  });

  it('niveles de memoria', () => {
    expect(memoryLevel(90)).toBe('strong');
    expect(memoryLevel(70)).toBe('good');
    expect(memoryLevel(40)).toBe('building');
    expect(memoryLevel(10)).toBe('weak');
  });
});
