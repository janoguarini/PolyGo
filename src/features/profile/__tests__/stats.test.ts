import {
  achievementRatio,
  areaPath,
  chartGeometry,
  formatDelta,
  isMatchResult,
  linePath,
  nearestIndex,
  type RatingPoint,
} from '../stats';

const point = (rating: number, delta = 0, reason = 'battle'): RatingPoint => ({
  rating,
  delta,
  reason,
  at: '2026-10-29T12:00:00Z',
});

describe('chartGeometry', () => {
  it('reparte los puntos en X y respeta el padding', () => {
    const geo = chartGeometry(
      [point(1000, 0, 'initial'), point(1024, 24), point(1010, -14)],
      200,
      100,
      {
        top: 10,
        bottom: 10,
        left: 0,
        right: 0,
      },
    );
    expect(geo.points.map((p) => p.x)).toEqual([0, 100, 200]);
    for (const p of geo.points) {
      expect(p.y).toBeGreaterThanOrEqual(10);
      expect(p.y).toBeLessThanOrEqual(90);
    }
    // Mayor rating → más arriba (y menor).
    expect(geo.points[1]!.y).toBeLessThan(geo.points[0]!.y);
  });

  it('usa ticks limpios (múltiplos de 25) que contienen la serie', () => {
    const geo = chartGeometry([point(987), point(1063)], 100, 100);
    expect(geo.min % 25).toBe(0);
    expect(geo.max % 25).toBe(0);
    expect(geo.min).toBeLessThanOrEqual(987);
    expect(geo.max).toBeGreaterThanOrEqual(1063);
    expect(geo.ticks).toHaveLength(3);
  });

  it('una serie plana igual tiene rango vertical', () => {
    const geo = chartGeometry([point(1000), point(1000)], 100, 100);
    expect(geo.max - geo.min).toBeGreaterThanOrEqual(50);
    expect(Number.isFinite(geo.points[0]!.y)).toBe(true);
  });

  it('un único punto queda centrado', () => {
    const geo = chartGeometry([point(1000)], 100, 50, { top: 0, bottom: 0, left: 0, right: 0 });
    expect(geo.points[0]!.x).toBe(50);
  });
});

describe('paths e inspección', () => {
  const pts = [
    { x: 0, y: 10 },
    { x: 50, y: 5 },
    { x: 100, y: 20 },
  ];

  it('arma la línea y el área cerrada sobre la base', () => {
    expect(linePath(pts)).toBe('M0.0,10.0 L50.0,5.0 L100.0,20.0');
    expect(areaPath(pts, 30)).toBe('M0.0,10.0 L50.0,5.0 L100.0,20.0 L100.0,30 L0.0,30 Z');
    expect(areaPath([], 30)).toBe('');
  });

  it('elige el punto más cercano al dedo', () => {
    expect(nearestIndex(pts, -20)).toBe(0);
    expect(nearestIndex(pts, 60)).toBe(1);
    expect(nearestIndex(pts, 90)).toBe(2);
  });
});

describe('formatos', () => {
  it('muestra el signo del delta', () => {
    expect(formatDelta(24)).toBe('+24');
    expect(formatDelta(-14)).toBe('−14');
    expect(formatDelta(0)).toBe('±0');
  });

  it('valida resultados de partida', () => {
    expect(isMatchResult('win')).toBe(true);
    expect(isMatchResult('draw')).toBe(true);
    expect(isMatchResult('abandoned')).toBe(false);
    expect(isMatchResult(null)).toBe(false);
  });

  it('un logro desbloqueado está completo aunque la métrica haya bajado', () => {
    expect(achievementRatio({ progress: 3, threshold: 10, unlockedAt: null })).toBeCloseTo(0.3);
    expect(achievementRatio({ progress: 12, threshold: 10, unlockedAt: null })).toBe(1);
    expect(achievementRatio({ progress: 4, threshold: 10, unlockedAt: '2026-10-29' })).toBe(1);
  });
});
