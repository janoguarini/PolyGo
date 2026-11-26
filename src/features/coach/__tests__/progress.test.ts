import { coachProgress } from '../progress';
import type { CoachSessionRecord } from '../api';

const session = (
  correct: number | null,
  total: number | null,
  done = true,
): CoachSessionRecord => ({
  sessionId: Math.random().toString(),
  languageCode: 'en',
  unitIds: ['a1-u01'],
  trial: true,
  createdAt: '2026-11-25T00:00:00Z',
  completedAt: done ? '2026-11-25T00:05:00Z' : null,
  correct,
  total,
});

describe('progreso del Coach', () => {
  it('sin sesiones terminadas no hay números', () => {
    expect(coachProgress([])).toEqual({ completed: 0, lastAccuracy: null, delta: null });
    expect(coachProgress([session(null, null, false)])).toEqual({
      completed: 0,
      lastAccuracy: null,
      delta: null,
    });
  });

  it('una sola sesión: precisión, sin tendencia', () => {
    expect(coachProgress([session(6, 8)])).toEqual({ completed: 1, lastAccuracy: 75, delta: null });
  });

  it('la tendencia compara la última (primera de la lista) con la primera terminada', () => {
    // Más reciente primero: 7/8 (88 %), una sin terminar, 4/8 (50 %).
    const p = coachProgress([session(7, 8), session(null, null, false), session(4, 8)]);
    expect(p).toEqual({ completed: 2, lastAccuracy: 88, delta: 38 });
  });
});
