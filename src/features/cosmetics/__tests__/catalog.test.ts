import { COSMETICS } from '@shared/cosmetics';

import { BACKGROUND_STYLES, FRAME_STYLES, backgroundStyle, frameStyle } from '../visuals';

describe('catálogo de cosméticos', () => {
  it('cada ítem tiene su dibujo y no sobra ninguno', () => {
    const frames = COSMETICS.filter((c) => c.kind === 'frame').map((c) => c.id);
    const backgrounds = COSMETICS.filter((c) => c.kind === 'background').map((c) => c.id);
    expect(Object.keys(FRAME_STYLES).sort()).toEqual([...frames].sort());
    expect(Object.keys(BACKGROUND_STYLES).sort()).toEqual([...backgrounds].sort());
  });

  it('los legendarios no se venden por Polys; el resto sí', () => {
    for (const item of COSMETICS) {
      if (item.rarity === 'legendary') {
        expect(item.price).toBeNull();
        expect(item.source).not.toBe('polys');
      } else {
        expect(item.price).toBeGreaterThan(0);
        expect(item.source).toBe('polys');
      }
    }
  });

  it('los precios respetan los rangos de cada rareza', () => {
    const ranges = { common: [150, 250], rare: [400, 600], epic: [1000, 1500] } as const;
    for (const item of COSMETICS) {
      if (item.rarity === 'legendary') continue;
      const [min, max] = ranges[item.rarity];
      expect(item.price).toBeGreaterThanOrEqual(min);
      expect(item.price).toBeLessThanOrEqual(max);
    }
  });

  it('ids desconocidos no dibujan nada', () => {
    expect(frameStyle(null)).toBeNull();
    expect(frameStyle('bg_forest')).toBeNull();
    expect(backgroundStyle('frame_mint')).toBeNull();
    expect(frameStyle('frame_mint')).not.toBeNull();
  });
});
