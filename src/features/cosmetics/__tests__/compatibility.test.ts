import {
  SKIN_COMPATIBILITY,
  compatibilityFor,
  isCosmeticCompatible,
  keepIfCompatible,
  skinsCompatibleWith,
} from '@shared/cosmeticCompatibility';
import { COSMETICS, visibleCosmetics } from '@shared/cosmetics';

describe('compatibilidad avatar ↔ marcos y fondos', () => {
  it('las listas sólo nombran ítems existentes del tipo correcto', () => {
    const byId = new Map(COSMETICS.map((c) => [c.id, c]));
    for (const [skin, c] of Object.entries(SKIN_COMPATIBILITY)) {
      expect(byId.get(skin as never)?.kind).toBe('skin');
      for (const f of c!.frames) expect(byId.get(f)?.kind).toBe('frame');
      for (const b of c!.backgrounds) expect(byId.get(b)?.kind).toBe('background');
    }
  });

  it('avatares neutros combinan con todo', () => {
    for (const avatar of ['skin-classic', 'bolt', 'panda-red', 'skin-samurai', null]) {
      expect(compatibilityFor(avatar)).toBeNull();
      for (const item of COSMETICS.filter((c) => c.kind !== 'skin')) {
        expect(isCosmeticCompatible(avatar, item.id)).toBe(true);
      }
    }
  });

  it('Ninja: hojas y templo sí; corona dorada y galaxia no', () => {
    expect(isCosmeticCompatible('skin-ninja', 'frame_leaf')).toBe(true);
    expect(isCosmeticCompatible('skin-ninja', 'bg_temple')).toBe(true);
    expect(isCosmeticCompatible('skin-ninja', 'frame_master')).toBe(false);
    expect(isCosmeticCompatible('skin-ninja', 'bg_galaxy')).toBe(false);
  });

  it('Cyber: ciudad neón sí; bosque y montaña no', () => {
    expect(isCosmeticCompatible('skin-cyber', 'bg_neon')).toBe(true);
    expect(isCosmeticCompatible('skin-cyber', 'bg_forest')).toBe(false);
    expect(isCosmeticCompatible('skin-cyber', 'bg_mountain')).toBe(false);
  });

  it('lo gratuito, lo ganado y lo retirado es universal', () => {
    for (const id of [
      'frame_basic',
      'bg_solid',
      'frame_rank',
      'frame_plus',
      'frame_referral_legend',
      'frame_event',
      'frame_fire',
      'bg_ocean',
    ]) {
      for (const skin of Object.keys(SKIN_COMPATIBILITY)) {
        expect(isCosmeticCompatible(skin, id)).toBe(true);
      }
    }
    expect(isCosmeticCompatible('skin-ninja', null)).toBe(true);
  });

  it('cambiar de avatar conserva lo compatible y suelta lo demás', () => {
    expect(keepIfCompatible('skin-academic', 'frame_stellar')).toBe('frame_stellar');
    expect(keepIfCompatible('skin-academic', 'bg_neon')).toBeNull();
    expect(keepIfCompatible('bolt', 'bg_neon')).toBe('bg_neon');
  });

  it('la grilla de cada skin muestra también lo bloqueado compatible', () => {
    const owned = new Set<string>();
    const frames = visibleCosmetics('frame', owned).filter((c) =>
      isCosmeticCompatible('skin-ninja', c.id),
    );
    const ids = frames.map((c) => c.id);
    // Comprables y compatibles (aunque no los tenga) + universales.
    expect(ids).toEqual(
      expect.arrayContaining([
        'frame_leaf',
        'frame_crystal',
        'frame_elite',
        'frame_basic',
        'frame_plus',
      ]),
    );
    expect(ids).not.toContain('frame_master');
    expect(ids).not.toContain('frame_stellar');
  });

  it('la tienda dice con qué skins combina cada ítem temático', () => {
    expect(skinsCompatibleWith('frame_master')).toEqual(['Académico']);
    expect(skinsCompatibleWith('bg_dimension').sort()).toEqual([
      'Académico',
      'Cyber',
      'Explorador',
    ]);
    expect(skinsCompatibleWith('frame_plus')).toEqual([]);
  });
});
