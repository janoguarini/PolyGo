import { FINGER, FOX_H, FOX_MIN, foxWidth, tourLayout } from '../AppTour';

jest.mock('react-native-svg', () => ({ __esModule: true, default: () => null, Path: () => null }));

const screen = { width: 390, height: 844, insetTop: 47, insetBottom: 34, bubbleHeight: 190 };

/** Punta del dedo en pantalla para un layout anclado. */
function fingertip(layout: ReturnType<typeof tourLayout>) {
  if (layout.kind !== 'anchored') throw new Error('esperaba anclado');
  const f = FINGER[layout.pose];
  const w = foxWidth(layout.fox.height);
  return { x: layout.fox.left + f.x * w, y: layout.fox.top + f.y * layout.fox.height };
}

describe('tourLayout', () => {
  it('sin destino: centrado', () => {
    expect(tourLayout({ ...screen, rect: null })).toEqual({ kind: 'center' });
  });

  it('destino arriba (contadores): el zorro va abajo y apunta hacia arriba, con el dedo bajo el centro', () => {
    const rect = { x: 150, y: 60, width: 220, height: 40 };
    const layout = tourLayout({ ...screen, rect });
    expect(layout).toMatchObject({ kind: 'anchored', place: 'below', pose: 'pointUp' });
    const tip = fingertip(layout);
    expect(tip.y).toBeGreaterThan(rect.y + rect.height);
    expect(tip.y - (rect.y + rect.height)).toBeLessThan(50);
    expect(Math.abs(tip.x - (rect.x + rect.width / 2))).toBeLessThan(2);
  });

  it('destino abajo (tarjeta de Ranked): el zorro va arriba y apunta hacia abajo', () => {
    const rect = { x: 20, y: 470, width: 350, height: 230 };
    const layout = tourLayout({ ...screen, rect });
    expect(layout).toMatchObject({ kind: 'anchored', place: 'above', pose: 'pointDown' });
    const tip = fingertip(layout);
    expect(tip.y).toBeLessThan(rect.y);
    // El zorro no tapa el elemento.
    if (layout.kind === 'anchored') {
      expect(layout.fox.height).toBe(FOX_H);
      expect(layout.fox.top + layout.fox.height).toBeLessThanOrEqual(rect.y);
    }
  });

  it('nodo angosto a un costado: el dedo sigue al nodo hasta donde lo dejan los bordes', () => {
    const rect = { x: 250, y: 300, width: 80, height: 80 };
    const tip = fingertip(tourLayout({ ...screen, rect }));
    expect(Math.abs(tip.x - 290)).toBeLessThan(2);
    const edge = { x: 345, y: 300, width: 40, height: 40 };
    const layout = tourLayout({ ...screen, rect: edge });
    if (layout.kind !== 'anchored') throw new Error('esperaba anclado');
    expect(layout.fox.left + foxWidth(layout.fox.height)).toBeLessThanOrEqual(screen.width);
  });

  it('tarjeta en el medio (Repaso, Para hoy): el zorro se achica y la caja no queda bajo el notch', () => {
    const rect = { x: 20, y: 360, width: 350, height: 225 };
    const layout = tourLayout({ ...screen, rect });
    if (layout.kind !== 'anchored') throw new Error('esperaba anclado');
    expect(layout.fox.height).toBeLessThan(FOX_H);
    expect(layout.fox.height).toBeGreaterThanOrEqual(FOX_MIN);
    if (layout.bubble.bottom !== undefined) {
      const bubbleTop = screen.height - layout.bubble.bottom - screen.bubbleHeight;
      expect(bubbleTop).toBeGreaterThanOrEqual(screen.insetTop);
    }
  });

  it('la caja nunca tapa al zorro (captura de Ranked y cualquier otra posición)', () => {
    const rects = [
      { x: 12, y: 455, width: 345, height: 245 },
      ...[60, 200, 330, 470, 600].flatMap((y) =>
        [16, 120, 250].map((x) => ({ x, y, width: 100, height: 60 })),
      ),
    ];
    for (const rect of rects) {
      const layout = tourLayout({ ...screen, rect });
      if (layout.kind !== 'anchored' || layout.bubbleSide !== 'stacked') continue;
      const foxTop = layout.fox.top;
      const foxBottom = foxTop + layout.fox.height;
      if (layout.bubble.bottom !== undefined) {
        // Caja arriba del zorro: su borde inferior no baja de la cabeza.
        expect(screen.height - layout.bubble.bottom).toBeLessThanOrEqual(foxTop);
      } else {
        // Caja abajo del zorro: arranca después de los pies.
        expect(layout.bubble.top!).toBeGreaterThanOrEqual(foxBottom);
      }
    }
  });

  it('la caja nunca se sale de la pantalla', () => {
    for (const y of [60, 200, 330, 470, 600]) {
      for (const x of [16, 120, 250]) {
        const layout = tourLayout({ ...screen, rect: { x, y, width: 100, height: 60 } });
        if (layout.kind !== 'anchored') continue;
        expect(layout.bubble.left).toBeGreaterThanOrEqual(0);
        expect(layout.bubble.left + layout.bubble.width).toBeLessThanOrEqual(screen.width);
      }
    }
  });
});
