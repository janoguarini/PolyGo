import {
  RATING_CONFIG,
  computeRatingChange,
  expectedScore,
  getRank,
  isInPlacement,
  repeatOpponentMultiplier,
} from '../ranking';

const ESTABLISHED = RATING_CONFIG.placementMatches; // ya fuera de colocación

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
      gamesPlayed: ESTABLISHED,
    });
    expect(r).toMatchObject({ before: 1000, after: 1016, delta: 16, kFactor: 32 });
  });

  it('derrota entre iguales: -16', () => {
    const r = computeRatingChange({
      rating: 1000,
      opponentRating: 1000,
      outcome: 'loss',
      gamesPlayed: ESTABLISHED,
    });
    expect(r.delta).toBe(-16);
  });

  it('empate entre iguales: 0', () => {
    const r = computeRatingChange({
      rating: 1000,
      opponentRating: 1000,
      outcome: 'draw',
      gamesPlayed: ESTABLISHED,
    });
    expect(r.delta).toBe(0);
  });

  it('empate contra un rival superior suma rating', () => {
    const r = computeRatingChange({
      rating: 1000,
      opponentRating: 1200,
      outcome: 'draw',
      gamesPlayed: ESTABLISHED,
    });
    expect(r.delta).toBeGreaterThan(0);
  });

  it('ganar contra un rival superior da más que contra uno inferior', () => {
    const vsHigher = computeRatingChange({
      rating: 1000,
      opponentRating: 1200,
      outcome: 'win',
      gamesPlayed: ESTABLISHED,
    });
    const vsLower = computeRatingChange({
      rating: 1000,
      opponentRating: 800,
      outcome: 'win',
      gamesPlayed: ESTABLISHED,
    });
    expect(vsHigher.delta).toBeGreaterThan(vsLower.delta);
  });

  it('perder contra un rival inferior castiga más', () => {
    const vsLower = computeRatingChange({
      rating: 1200,
      opponentRating: 1000,
      outcome: 'loss',
      gamesPlayed: ESTABLISHED,
    });
    const vsHigher = computeRatingChange({
      rating: 1200,
      opponentRating: 1400,
      outcome: 'loss',
      gamesPlayed: ESTABLISHED,
    });
    expect(vsLower.delta).toBeLessThan(vsHigher.delta);
  });

  it('es de suma cero entre dos jugadores establecidos', () => {
    const a = computeRatingChange({
      rating: 1137,
      opponentRating: 1042,
      outcome: 'win',
      gamesPlayed: ESTABLISHED,
    });
    const b = computeRatingChange({
      rating: 1042,
      opponentRating: 1137,
      outcome: 'loss',
      gamesPlayed: ESTABLISHED,
    });
    expect(a.delta + b.delta).toBe(0);
  });

  it('usa K de colocación en las primeras partidas', () => {
    const r = computeRatingChange({
      rating: 1000,
      opponentRating: 1000,
      outcome: 'win',
      gamesPlayed: 0,
    });
    expect(r.kFactor).toBe(RATING_CONFIG.placementKFactor);
    expect(r.delta).toBe(24);
  });

  it('nunca baja del piso de rating', () => {
    const r = computeRatingChange({
      rating: RATING_CONFIG.ratingFloor + 3,
      opponentRating: 100,
      outcome: 'loss',
      gamesPlayed: ESTABLISHED,
    });
    expect(r.after).toBe(RATING_CONFIG.ratingFloor);
    expect(r.delta).toBe(-3);
  });

  it('diferencias extremas siguen acotadas por K', () => {
    const r = computeRatingChange({
      rating: 100,
      opponentRating: 3000,
      outcome: 'win',
      gamesPlayed: ESTABLISHED,
    });
    expect(r.delta).toBeLessThanOrEqual(32);
    expect(r.delta).toBeGreaterThan(0);
  });

  it('anti-farming: reduce y luego anula el rating contra el mismo rival', () => {
    const base = {
      rating: 1000,
      opponentRating: 1000,
      outcome: 'win' as const,
      gamesPlayed: ESTABLISHED,
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
  it('el rating inicial es Plata I', () => {
    expect(getRank(RATING_CONFIG.initialRating).label).toBe('Plata I');
  });

  it('respeta los límites exactos de tier', () => {
    expect(getRank(899).tier.id).toBe('bronze');
    expect(getRank(900).label).toBe('Plata III');
    expect(getRank(1050).label).toBe('Oro III');
    expect(getRank(1699).tier.id).toBe('diamond');
    expect(getRank(1700).label).toBe('Maestro');
    expect(getRank(2500).label).toBe('Gran Maestro');
  });

  it('divisiones de Bronce', () => {
    expect(getRank(100).label).toBe('Bronce III');
    expect(getRank(800).label).toBe('Bronce II');
    expect(getRank(850).label).toBe('Bronce I');
  });

  it('progreso dentro de la división', () => {
    const r = getRank(925); // Plata III: 900–949
    expect(r.stepMin).toBe(900);
    expect(r.nextStepMin).toBe(950);
    expect(r.progress).toBeCloseTo(0.5);
  });

  it('Gran Maestro no tiene siguiente escalón', () => {
    const r = getRank(2100);
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

describe('isInPlacement', () => {
  it('detecta partidas de colocación', () => {
    expect(isInPlacement(0)).toBe(true);
    expect(isInPlacement(RATING_CONFIG.placementMatches)).toBe(false);
  });
});
