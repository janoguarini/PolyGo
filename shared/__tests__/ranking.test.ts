import {
  RATING_CONFIG,
  computeRatingChange,
  expectedScore,
  getRank,
  isPlaced,
  repeatOpponentMultiplier,
} from '../ranking';

describe('expectedScore', () => {
  it('es 0.5 con ratings iguales', () => {
    expect(expectedScore(1000, 1000)).toBeCloseTo(0.5);
  });

  it('las expectativas de ambos jugadores suman 1', () => {
    expect(expectedScore(1200, 1000) + expectedScore(1000, 1200)).toBeCloseTo(1);
  });

  it('400 puntos de diferencia ≈ 0.909', () => {
    expect(expectedScore(1400, 1000)).toBeCloseTo(10 / 11, 3);
  });
});

describe('computeRatingChange', () => {
  it('victoria entre iguales: +16 con K=32', () => {
    const r = computeRatingChange({
      rating: 1000,
      opponentRating: 1000,
      outcome: 'win',
    });
    expect(r).toMatchObject({ before: 1000, after: 1016, delta: 16, kFactor: 32 });
  });

  it('derrota entre iguales: -16', () => {
    const r = computeRatingChange({
      rating: 1000,
      opponentRating: 1000,
      outcome: 'loss',
    });
    expect(r.delta).toBe(-16);
  });

  it('empate entre iguales: 0', () => {
    const r = computeRatingChange({
      rating: 1000,
      opponentRating: 1000,
      outcome: 'draw',
    });
    expect(r.delta).toBe(0);
  });

  it('empate contra un rival superior suma rating', () => {
    const r = computeRatingChange({
      rating: 1000,
      opponentRating: 1200,
      outcome: 'draw',
    });
    expect(r.delta).toBeGreaterThan(0);
  });

  it('ganar contra un rival superior da más que contra uno inferior', () => {
    const vsHigher = computeRatingChange({
      rating: 1000,
      opponentRating: 1200,
      outcome: 'win',
    });
    const vsLower = computeRatingChange({
      rating: 1000,
      opponentRating: 800,
      outcome: 'win',
    });
    expect(vsHigher.delta).toBeGreaterThan(vsLower.delta);
  });

  it('perder contra un rival inferior castiga más', () => {
    const vsLower = computeRatingChange({
      rating: 1200,
      opponentRating: 1000,
      outcome: 'loss',
    });
    const vsHigher = computeRatingChange({
      rating: 1200,
      opponentRating: 1400,
      outcome: 'loss',
    });
    expect(vsLower.delta).toBeLessThan(vsHigher.delta);
  });

  it('es de suma cero entre dos jugadores establecidos', () => {
    const a = computeRatingChange({
      rating: 1137,
      opponentRating: 1042,
      outcome: 'win',
    });
    const b = computeRatingChange({
      rating: 1042,
      opponentRating: 1137,
      outcome: 'loss',
    });
    expect(a.delta + b.delta).toBe(0);
  });

  it('sin posicionar: perder o empatar no mueve el rating; la primera victoria sí', () => {
    const base = { rating: 100, opponentRating: 110, placed: false };
    expect(computeRatingChange({ ...base, outcome: 'loss' }).delta).toBe(0);
    expect(computeRatingChange({ ...base, outcome: 'draw' }).delta).toBe(0);
    const win = computeRatingChange({ ...base, outcome: 'win' });
    expect(win.delta).toBe(16);
    expect(getRank(win.after).label).toBe('Bronce III');
  });

  it('nunca baja del piso de rating', () => {
    const r = computeRatingChange({
      rating: RATING_CONFIG.ratingFloor + 3,
      opponentRating: 100,
      outcome: 'loss',
    });
    expect(r.after).toBe(RATING_CONFIG.ratingFloor);
    expect(r.delta).toBe(-3);
  });

  it('diferencias extremas siguen acotadas por K', () => {
    const r = computeRatingChange({
      rating: 100,
      opponentRating: 3000,
      outcome: 'win',
    });
    expect(r.delta).toBeLessThanOrEqual(32);
    expect(r.delta).toBeGreaterThan(0);
  });

  it('anti-farming: reduce y luego anula el rating contra el mismo rival', () => {
    const base = {
      rating: 1000,
      opponentRating: 1000,
      outcome: 'win' as const,
    };
    expect(computeRatingChange({ ...base, matchesAgainstOpponentInWindow: 2 }).delta).toBe(16);
    expect(computeRatingChange({ ...base, matchesAgainstOpponentInWindow: 3 }).delta).toBe(8);
    expect(computeRatingChange({ ...base, matchesAgainstOpponentInWindow: 5 }).delta).toBe(0);
  });
});

describe('repeatOpponentMultiplier', () => {
  it('sigue la tabla configurada', () => {
    expect(repeatOpponentMultiplier(1)).toBe(1);
    expect(repeatOpponentMultiplier(4)).toBe(0.5);
    expect(repeatOpponentMultiplier(9)).toBe(0);
  });
});

describe('getRank', () => {
  it('el rating inicial es Bronce III, al principio del escalón', () => {
    const r = getRank(RATING_CONFIG.initialRating);
    expect(r.label).toBe('Bronce III');
    expect(r.progress).toBe(0);
  });

  it('respeta los límites exactos de tier', () => {
    expect(getRank(399).tier.id).toBe('bronze');
    expect(getRank(400).label).toBe('Plata III');
    expect(getRank(700).label).toBe('Oro III');
    expect(getRank(1899).tier.id).toBe('diamond');
    expect(getRank(1900).label).toBe('Maestro');
    expect(getRank(2500).label).toBe('Gran Maestro');
  });

  it('divisiones de Bronce de 100 puntos', () => {
    expect(getRank(199).label).toBe('Bronce III');
    expect(getRank(200).label).toBe('Bronce II');
    expect(getRank(300).label).toBe('Bronce I');
  });

  it('progreso dentro de la división', () => {
    const r = getRank(450); // Plata III: 400–499
    expect(r.stepMin).toBe(400);
    expect(r.nextStepMin).toBe(500);
    expect(r.progress).toBeCloseTo(0.5);
  });

  it('Gran Maestro no tiene siguiente escalón', () => {
    const r = getRank(2300);
    expect(r.nextStepMin).toBeNull();
    expect(r.progress).toBe(1);
  });

  it('el progreso siempre está entre 0 y 1', () => {
    for (let rating = 0; rating <= 2500; rating += 7) {
      const { progress } = getRank(rating);
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(1);
    }
  });
});

describe('isPlaced', () => {
  it('se posiciona con la primera victoria', () => {
    expect(isPlaced({ wins: 0 })).toBe(false);
    expect(isPlaced({ wins: 1 })).toBe(true);
  });
});
