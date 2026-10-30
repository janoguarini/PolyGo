import {
  PATH_ROW_HEIGHT,
  lessonKind,
  lessonStars,
  pathOffset,
  pathPoints,
  starTotals,
} from '../path';

describe('camino de lecciones', () => {
  it('ondula alrededor del centro sin salirse del contenedor', () => {
    const width = 335;
    const offsets = Array.from({ length: 16 }, (_, i) => pathOffset(i, width));
    expect(offsets[0]).toBe(0);
    expect(Math.max(...offsets)).toBeGreaterThan(0);
    expect(Math.min(...offsets)).toBeLessThan(0);
    for (const o of offsets) expect(Math.abs(o) + 36).toBeLessThanOrEqual(width / 2);
  });

  it('continúa la onda entre unidades usando el índice global', () => {
    const a = pathPoints(0, 6, 335);
    const b = pathPoints(6, 2, 335);
    expect(b[0]?.x).toBe(335 / 2 + pathOffset(6, 335));
    expect((a[1]?.y ?? 0) - (a[0]?.y ?? 0)).toBe(PATH_ROW_HEIGHT);
  });

  it('da estrellas según la mejor precisión', () => {
    expect(lessonStars(null)).toBe(0);
    expect(lessonStars(0.5)).toBe(1);
    expect(lessonStars(0.85)).toBe(2);
    expect(lessonStars(0.96)).toBe(2);
    expect(lessonStars(1)).toBe(3);
  });

  it('suma estrellas y lecciones doradas', () => {
    const units = [
      { lessons: [{ bestAccuracy: 1 }, { bestAccuracy: 0.5 }, { bestAccuracy: null }] },
    ];
    expect(starTotals(units)).toEqual({ earned: 4, max: 9, golden: 1 });
  });

  it('reconoce el tipo de lección por su id', () => {
    expect(lessonKind('a1-u01-l03')).toBe('lesson');
    expect(lessonKind('a1-u01-rev2')).toBe('review');
    expect(lessonKind('a1-u01-listen')).toBe('listening');
    expect(lessonKind('a1-u01-words')).toBe('words');
    expect(lessonKind('a1-u01-final')).toBe('final');
  });
});
