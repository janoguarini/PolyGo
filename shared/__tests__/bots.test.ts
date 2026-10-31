import { BOT_CONFIG, BOT_NAMES, botMove, botSkill, isBotId, pickBot } from '../bots';
import { WORD_RUSH } from '../protocol';
import { answerPoints, applyPoints, decideOutcomes } from '../wordRush';

/** PRNG determinístico (mulberry32) para que la simulación sea reproducible. */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Una partida de 75 s de un bot con las reglas reales de puntuación. */
function play(rating: number, random: () => number) {
  const skill = botSkill(rating);
  let elapsed = 0;
  let score = 0;
  let correct = 0;
  let answered = 0;
  let streak = 0;
  for (;;) {
    const move = botMove(skill, random);
    if (elapsed + move.delayMs > WORD_RUSH.durationMs) break;
    elapsed += move.delayMs;
    streak = move.correct ? streak + 1 : 0;
    score = applyPoints(score, answerPoints(move.correct, move.delayMs, streak));
    answered += 1;
    if (move.correct) correct += 1;
  }
  return { score, correct, answered, forfeited: false };
}

function winRate(ratingA: number, ratingB: number, games = 600, seed = 7) {
  const random = seeded(seed);
  let points = 0;
  for (let i = 0; i < games; i++) {
    const [outcome] = decideOutcomes(play(ratingA, random), play(ratingB, random));
    points += outcome === 'win' ? 1 : outcome === 'draw' ? 0.5 : 0;
  }
  return points / games;
}

describe('botSkill', () => {
  it('más rating, más preciso y más rápido; satura en los extremos', () => {
    const low = botSkill(700);
    const high = botSkill(1500);
    expect(high.accuracy).toBeGreaterThan(low.accuracy);
    expect(high.meanMs).toBeLessThan(low.meanMs);
    expect(botSkill(0)).toEqual(botSkill(BOT_CONFIG.skillCurve[0].rating));
    expect(botSkill(3000)).toEqual(botSkill(BOT_CONFIG.skillCurve.at(-1)!.rating));
    // Entre puntos de la curva interpola.
    expect(botSkill(250).meanMs).toBeCloseTo((6_500 + 4_200) / 2);
  });

  it('se nota la diferencia de un rango a otro (Bronce → Plata → Oro)', () => {
    const bronze = botSkill(150).meanMs;
    const silver = botSkill(450).meanMs;
    const gold = botSkill(750).meanMs;
    expect(bronze - silver).toBeGreaterThan(1_000);
    expect(silver - gold).toBeGreaterThan(500);
  });
});

describe('botMove', () => {
  it('respeta los límites de tiempo y la precisión en promedio', () => {
    const random = seeded(1);
    const skill = botSkill(1000);
    const moves = Array.from({ length: 4000 }, () => botMove(skill, random));
    for (const m of moves) {
      expect(m.delayMs).toBeGreaterThanOrEqual(BOT_CONFIG.minMs);
      expect(m.delayMs).toBeLessThanOrEqual(BOT_CONFIG.maxMs);
    }
    const hit = moves.filter((m) => m.correct).length / moves.length;
    expect(Math.abs(hit - skill.accuracy)).toBeLessThan(0.03);
  });
});

describe('pickBot', () => {
  it('elige un bot a la altura del jugador, con nombre y zorro', () => {
    const random = seeded(3);
    for (let i = 0; i < 200; i++) {
      const bot = pickBot(1000, random);
      expect(Math.abs(bot.rating - 1000)).toBeLessThanOrEqual(BOT_CONFIG.ratingJitter);
      expect(BOT_NAMES).toContain(bot.name);
      expect(['bolt', 'crown', 'flame']).toContain(bot.avatarId);
    }
    expect(pickBot(120, () => 0).rating).toBe(100);
  });

  it('los ids de bot no parecen uuids de usuario', () => {
    expect(isBotId('bot:123')).toBe(true);
    expect(isBotId('7f1c2d3e-0000-4000-8000-000000000001')).toBe(false);
  });
});

describe('equilibrio (simulación de partidas completas)', () => {
  it('mismo rating: cada uno gana alrededor de la mitad', () => {
    const rate = winRate(1100, 1100);
    expect(rate).toBeGreaterThan(0.42);
    expect(rate).toBeLessThan(0.58);
  });

  it('más rating gana más seguido, y la ventaja crece con la diferencia', () => {
    const plus100 = winRate(1200, 1100);
    const plus300 = winRate(1400, 1100);
    expect(plus100).toBeGreaterThan(0.55);
    expect(plus300).toBeGreaterThan(plus100);
    expect(plus300).toBeGreaterThan(0.8);
  });
});
