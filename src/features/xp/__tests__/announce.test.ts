import type { XpState } from '../api';
import { nextXpAnnouncement, resetXpAnnouncements, xpGrantSummary } from '../announce';

const state = (over: Partial<XpState> = {}): XpState => ({
  total: 70,
  level: 2,
  into: 20,
  need: 60,
  remaining: 40,
  level_before: 2,
  initial: false,
  granted: [],
  granted_total: 0,
  ...over,
});

beforeEach(resetXpAnnouncements);

describe('anuncios de XP', () => {
  it('la primera sincronización no celebra la historia', () => {
    expect(
      nextXpAnnouncement(state({ initial: true, level: 9, level_before: 1, granted_total: 800 })),
    ).toBeNull();
    // Y ese nivel tampoco se celebra después si vuelve del caché.
    expect(nextXpAnnouncement(state({ level: 9, level_before: 1 }))).toBeNull();
  });

  it('una lección da un aviso de +XP una sola vez', () => {
    const s = state({
      granted: [{ source: 'lesson_first', ref: 'l1', amount: 20 }],
      granted_total: 20,
    });
    expect(nextXpAnnouncement(s)).toEqual({
      kind: 'toast',
      total: 20,
      label: 'Lección completada',
    });
    expect(nextXpAnnouncement(s)).toBeNull();
  });

  it('subir de nivel muestra la celebración (con el XP ganado) en vez del aviso', () => {
    const s = state({
      level: 3,
      level_before: 2,
      granted: [{ source: 'ranked_win', ref: 'b1', amount: 30 }],
      granted_total: 30,
    });
    expect(nextXpAnnouncement(s)).toEqual({ kind: 'level', level: 3, gained: 30 });
    expect(nextXpAnnouncement(s)).toBeNull();
  });

  it('resume varias ganancias', () => {
    expect(
      xpGrantSummary([
        { source: 'review', ref: 'a', amount: 10 },
        { source: 'review', ref: 'b', amount: 10 },
      ]),
    ).toEqual({ total: 20, label: 'Repaso completado ×2' });
    expect(
      xpGrantSummary([
        { source: 'review', ref: 'a', amount: 10 },
        { source: 'daily_challenge', ref: '2026-11-21', amount: 40 },
      ]),
    ).toEqual({ total: 50, label: 'Experiencia' });
  });
});
