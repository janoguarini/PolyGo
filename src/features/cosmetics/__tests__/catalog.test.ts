import { COSMETICS, visibleCosmetics } from '@shared/cosmetics';
import { TIERS } from '@shared/ranking';

import { SKIN_IMAGES } from '@/design-system/skinImages';

import { BACKGROUND_IMAGES, FRAME_ART, RANK_FRAME_ART } from '../assets';
import { frameArt } from '../FramedAvatar';
import { BACKGROUND_STYLES, FRAME_STYLES, backgroundStyle, frameStyle } from '../visuals';

const hasArt = (id: string, kind: string) => {
  if (kind === 'skin') return id in SKIN_IMAGES;
  if (kind === 'frame') return id === 'frame_rank' || id in FRAME_ART || id in FRAME_STYLES;
  return id in BACKGROUND_IMAGES || id in BACKGROUND_STYLES;
};

describe('catálogo de cosméticos', () => {
  it('todo lo disponible tiene arte; lo que no tiene arte está marcado como no disponible', () => {
    for (const item of COSMETICS) {
      expect([item.id, hasArt(item.id, item.kind)]).toEqual([item.id, item.available]);
    }
  });

  it('no sobra arte sin ítem', () => {
    const ids = new Set<string>(COSMETICS.map((c) => c.id));
    for (const id of [
      ...Object.keys(SKIN_IMAGES),
      ...Object.keys(FRAME_ART),
      ...Object.keys(FRAME_STYLES),
      ...Object.keys(BACKGROUND_IMAGES),
      ...Object.keys(BACKGROUND_STYLES),
    ]) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it('hay un marco de rango por cada tier de shared/ranking.ts', () => {
    expect(Object.keys(RANK_FRAME_ART).sort()).toEqual(TIERS.map((t) => t.id).sort());
  });

  it('el marco de rango sale del ELO real', () => {
    expect(frameArt('frame_rank', 1650)).toBe(RANK_FRAME_ART.diamond);
    expect(frameArt('frame_rank', 120)).toBe(RANK_FRAME_ART.bronze);
    expect(frameArt('frame_rank', 2400)).toBe(RANK_FRAME_ART.grandmaster);
    expect(frameArt('frame_rank', null)).toBeNull();
  });

  it('sólo lo de la tienda tiene precio, y en el rango de su rareza', () => {
    const ranges = {
      common: [150, 250],
      rare: [400, 500],
      epic: [650, 850],
      legendary: [1100, 1500],
      mythic: [2000, 2000],
    } as const;
    for (const item of COSMETICS) {
      if (item.source !== 'polys') {
        expect([item.id, item.price]).toEqual([item.id, null]);
        continue;
      }
      if (item.retired) continue;
      const range = ranges[item.rarity as keyof typeof ranges];
      expect(range).toBeDefined();
      expect(item.price).toBeGreaterThanOrEqual(range[0]);
      expect(item.price).toBeLessThanOrEqual(range[1]);
    }
  });

  it('lo exclusivo (Plus e invitaciones) nunca tiene precio', () => {
    for (const item of COSMETICS.filter((c) => c.rarity === 'exclusive')) {
      expect(item.price).toBeNull();
      expect(['plus', 'referral']).toContain(item.source);
    }
  });

  it('lo retirado sólo lo ve quien lo tiene', () => {
    expect(visibleCosmetics('background', new Set()).some((c) => c.id === 'bg_ocean')).toBe(false);
    expect(visibleCosmetics('background', new Set(['bg_ocean'])).some((c) => c.id === 'bg_ocean')).toBe(
      true,
    );
  });

  it('ids desconocidos no dibujan nada', () => {
    expect(frameStyle(null)).toBeNull();
    expect(frameStyle('bg_solid')).toBeNull();
    expect(backgroundStyle('frame_basic')).toBeNull();
    expect(frameStyle('frame_basic')).not.toBeNull();
    expect(frameArt('no_existe')).toBeNull();
  });
});
