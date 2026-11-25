import {
  XP,
  totalXpForLevel,
  xpForNextLevel,
  xpProgress,
  xpSourceLabel,
  type XpSource,
} from '../xp';

describe('curva de niveles', () => {
  it('empieza en 50 XP y sube de a poco', () => {
    expect(xpForNextLevel(1)).toBe(50);
    expect(xpForNextLevel(2)).toBe(60);
    expect(xpForNextLevel(10)).toBe(175);
    expect(xpForNextLevel(50)).toBe(1010);
    expect(xpForNextLevel(99)).toBe(2255);
  });

  it('cada nivel pide al menos lo mismo que el anterior y siempre múltiplos de 5', () => {
    for (let l = 1; l < XP.maxLevel; l++) {
      expect(xpForNextLevel(l) % 5).toBe(0);
      if (l > 1) expect(xpForNextLevel(l)).toBeGreaterThanOrEqual(xpForNextLevel(l - 1));
    }
  });

  it('XP acumulada de los niveles de referencia (docs/PROFILE_XP_LEVELS.md)', () => {
    expect(totalXpForLevel(1)).toBe(0);
    expect(totalXpForLevel(2)).toBe(50);
    expect(totalXpForLevel(10)).toBe(905);
    expect(totalXpForLevel(25)).toBe(5455);
    expect(totalXpForLevel(50)).toBe(23380);
    expect(totalXpForLevel(100)).toBe(104380);
  });

  it('xpProgress es coherente con la curva en los bordes de nivel', () => {
    for (const level of [2, 10, 25, 50, 100]) {
      const at = totalXpForLevel(level);
      expect(xpProgress(at)).toMatchObject({ level, into: 0, need: xpForNextLevel(level) });
      expect(xpProgress(at - 1)).toMatchObject({ level: level - 1, remaining: 1 });
    }
    expect(xpProgress(-20)).toMatchObject({ total: 0, level: 1, into: 0, need: 50, ratio: 0 });
    expect(xpProgress(75).ratio).toBeCloseTo(25 / 60);
  });

  it('el tope técnico no rompe el cálculo', () => {
    const p = xpProgress(Number.MAX_SAFE_INTEGER);
    expect(p.level).toBe(XP.maxLevel);
    expect(p.need).toBe(0);
    expect(p.ratio).toBe(1);
  });
});

describe('ganancias', () => {
  it('cada fuente tiene monto y texto', () => {
    for (const source of Object.keys(XP.amounts) as XpSource[]) {
      expect(XP.amounts[source]).toBeGreaterThan(0);
      expect(xpSourceLabel(source).length).toBeGreaterThan(0);
    }
  });

  it('repetir lecciones y repasos tiene tope diario y vale menos que lo nuevo', () => {
    expect(XP.amounts.lesson_repeat).toBeLessThan(XP.amounts.lesson_first);
    expect(XP.dailyCaps.lesson_repeat * XP.amounts.lesson_repeat).toBeLessThanOrEqual(50);
    expect(XP.dailyCaps.review * XP.amounts.review).toBeLessThanOrEqual(50);
    // Tope de ranked: ni ganando todas se pasa de 300 XP por día.
    expect(XP.dailyCaps.ranked * XP.amounts.ranked_win).toBeLessThanOrEqual(300);
  });

  it('no hay recompensas por nivel sin aprobar', () => {
    expect(XP.levelRewards).toHaveLength(0);
  });
});
