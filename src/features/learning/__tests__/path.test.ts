import {
  MAP_CURRENT_ROW_HEIGHT,
  MAP_CURRENT_SIZE,
  MAP_NODE_SIZE,
  MAP_ROW_HEIGHT,
  lessonKind,
  lessonStars,
  mapLabelBox,
  mapLayout,
  mapNodeX,
  starTotals,
} from '../path';

describe('camino de lecciones', () => {
  it('serpentea de un lado al otro sin sacar ningún nodo del contenedor', () => {
    for (const width of [280, 335, 361, 640]) {
      const sides = new Set<string>();
      for (let i = 0; i < 12; i++) {
        for (const status of ['completed', 'current', 'locked'] as const) {
          const x = mapNodeX(i, width, status);
          expect(x - MAP_CURRENT_SIZE / 2).toBeGreaterThanOrEqual(0);
          expect(x + MAP_CURRENT_SIZE / 2).toBeLessThanOrEqual(width);
          // Nunca en el centro: siempre queda un lado ancho para el texto.
          expect(Math.abs(x - width / 2)).toBeGreaterThan(width * 0.1);
          sides.add(x > width / 2 ? 'right' : 'left');
        }
      }
      expect(sides).toEqual(new Set(['left', 'right']));
    }
  });

  it('arranca a la izquierda y cruza hacia la derecha', () => {
    const { points } = mapLayout(0, ['current', 'locked', 'locked', 'locked', 'locked'], 335);
    expect(points.map((p) => p.side)).toEqual(['left', 'left', 'left', 'right', 'right']);
  });

  it('pone el texto del lado contrario al nodo, con lugar suficiente', () => {
    const width = 335;
    const { points } = mapLayout(
      0,
      Array.from({ length: 6 }, () => 'locked' as const),
      width,
    );
    for (const point of points) {
      const box = mapLabelBox(point, width, MAP_NODE_SIZE);
      expect(width - box.left - box.right).toBeGreaterThanOrEqual(150);
      if (point.side === 'left') expect(box.left).toBeGreaterThan(point.x + MAP_NODE_SIZE / 2);
      else expect(width - box.right).toBeLessThan(point.x - MAP_NODE_SIZE / 2);
    }
    // La lección actual se arrima a su borde: su tarjeta tiene más ancho que un texto común.
    const current = mapLayout(2, ['current'], width).points[0]!;
    const card = mapLabelBox(current, width, MAP_CURRENT_SIZE);
    expect(width - card.left - card.right).toBeGreaterThanOrEqual(190);
  });

  it('continúa la onda entre unidades y agranda la fila de la lección actual', () => {
    const a = mapLayout(0, ['completed', 'current', 'locked'], 335);
    const b = mapLayout(3, ['locked'], 335);
    expect(b.points[0]?.x).toBe(mapNodeX(3, 335, 'locked'));
    expect(a.points[0]?.y).toBe(MAP_ROW_HEIGHT / 2);
    expect((a.points[1]?.y ?? 0) - (a.points[0]?.y ?? 0)).toBe(
      MAP_ROW_HEIGHT / 2 + MAP_CURRENT_ROW_HEIGHT / 2,
    );
    expect(a.height).toBe(2 * MAP_ROW_HEIGHT + MAP_CURRENT_ROW_HEIGHT);
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
