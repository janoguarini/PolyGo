import { cosmeticById, type CosmeticItem } from '@shared/cosmetics';

import { cosmeticStatus, isUnlocked, type CosmeticContext } from '../state';

const item = (id: string): CosmeticItem => {
  const found = cosmeticById(id);
  if (!found) throw new Error(id);
  return found;
};
const ctx = (over: Partial<CosmeticContext> = {}): CosmeticContext => ({
  owned: new Set(),
  plus: false,
  placed: false,
  ...over,
});

describe('estado de un cosmético', () => {
  it('lo que se compra muestra precio hasta comprarlo; después, equipable', () => {
    expect(cosmeticStatus(item('frame_crystal'), ctx(), null)).toEqual({ kind: 'buy', price: 400 });
    const owned = ctx({ owned: new Set(['frame_crystal']) });
    expect(cosmeticStatus(item('frame_crystal'), owned, null)).toEqual({ kind: 'unlocked' });
    expect(cosmeticStatus(item('frame_crystal'), owned, 'frame_crystal')).toEqual({
      kind: 'equipped',
    });
  });

  it('marco Plus: sólo con Plus activo, nunca con precio', () => {
    const frame = item('frame_plus');
    expect(frame.price).toBeNull();
    expect(cosmeticStatus(frame, ctx(), null)).toMatchObject({ kind: 'locked', reason: 'plus' });
    // Mientras no se sabe si tiene Plus, no se muestra desbloqueado.
    expect(isUnlocked(frame, ctx({ plus: undefined }))).toBe(false);
    expect(cosmeticStatus(frame, ctx({ plus: true }), null)).toEqual({ kind: 'unlocked' });
    // Si vence, el que lo tenía puesto lo ve bloqueado (no "equipado").
    expect(cosmeticStatus(frame, ctx({ plus: false }), 'frame_plus')).toMatchObject({
      kind: 'locked',
      reason: 'plus',
    });
  });

  it('premios de invitación: sin precio y con su requisito', () => {
    const legend = item('frame_referral_legend');
    expect(legend.price).toBeNull();
    // Hoy falta el arte: aunque lo tuviera, todavía no se equipa.
    expect(cosmeticStatus(legend, ctx({ owned: new Set([legend.id]) }), null)).toMatchObject({
      kind: 'locked',
      reason: 'missing_art',
    });
    expect(isUnlocked(legend, ctx({ plus: true }))).toBe(false);
  });

  it('marco de rango: sólo posicionado', () => {
    expect(cosmeticStatus(item('frame_rank'), ctx(), null)).toMatchObject({
      kind: 'locked',
      reason: 'rank',
    });
    expect(cosmeticStatus(item('frame_rank'), ctx({ placed: true }), null)).toEqual({
      kind: 'unlocked',
    });
  });

  it('gratis siempre; sin arte, nunca', () => {
    expect(isUnlocked(item('skin-classic'), ctx())).toBe(true);
    expect(isUnlocked(item('bg_solid'), ctx())).toBe(true);
    expect(cosmeticStatus(item('skin-omega'), ctx(), null)).toMatchObject({
      kind: 'locked',
      reason: 'missing_art',
    });
  });

  it('lo retirado sólo sirve si es tuyo y no se vuelve a vender', () => {
    expect(cosmeticStatus(item('bg_ocean'), ctx(), null)).toMatchObject({ kind: 'locked' });
    expect(cosmeticStatus(item('bg_ocean'), ctx({ owned: new Set(['bg_ocean']) }), null)).toEqual({
      kind: 'unlocked',
    });
  });
});
