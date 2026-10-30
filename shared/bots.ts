import { RATING_CONFIG } from './ranking';

/**
 * Bots de Word Rush para que el ranked funcione con pocos jugadores. Siempre se muestran como
 * bots (distintivo BOT) y la partida cuenta para el ELO como cualquier otra: el bot se elige a la
 * altura del jugador y juega con la habilidad de ese rating, así que en promedio se gana la mitad
 * y el ELO termina midiendo el nivel real. Ver docs/BATTLE_PROTOCOL.md.
 */

export const BOT_CONFIG = {
  /** Espera en cola sin rival humano antes de ofrecer un bot. */
  afterMs: 10_000,
  /** El rating del bot se elige a ± esto del jugador. */
  ratingJitter: 40,
  /** Rango de la escala de habilidad: por debajo y por encima se satura. */
  minRating: 600,
  maxRating: 1900,
  accuracy: { atMin: 0.55, atMax: 0.97 },
  /** Tiempo medio de respuesta (ms). */
  meanMs: { atMin: 5_000, atMax: 1_300 },
  /** Dispersión (log-normal) del tiempo de respuesta. */
  timeSpread: 0.35,
  minMs: 600,
  maxMs: 12_000,
  /** Lo que se muestra como partidas jugadas (fuera de colocación). */
  displayedGames: 40,
  /** Demora de "listo" al encontrar rival (ms). */
  readyMs: { min: 600, max: 2_000 },
} as const;

/** Nombres de los bots (siempre con el distintivo BOT al lado). */
export const BOT_NAMES = [
  'Kiko',
  'Luna',
  'Nico',
  'Maia',
  'Tomi',
  'Sol',
  'Bruno',
  'Pía',
  'Lolo',
  'Vera',
  'Fede',
  'Cami',
  'Rocco',
  'Juli',
  'Teo',
  'Abril',
] as const;

/** Avatares de los bots: los mismos zorros que eligen los usuarios. */
export const BOT_AVATARS = ['bolt', 'crown', 'flame'] as const;

export interface BotSkill {
  /** Probabilidad de acertar cada pregunta. */
  accuracy: number;
  /** Tiempo medio de respuesta en ms. */
  meanMs: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Habilidad del bot para un rating: más rating, más preciso y más rápido. */
export function botSkill(rating: number, config = BOT_CONFIG): BotSkill {
  const t = Math.min(
    1,
    Math.max(0, (rating - config.minRating) / (config.maxRating - config.minRating)),
  );
  return {
    accuracy: lerp(config.accuracy.atMin, config.accuracy.atMax, t),
    meanMs: lerp(config.meanMs.atMin, config.meanMs.atMax, t),
  };
}

/** Normal estándar a partir de dos uniformes (Box-Muller). */
function gaussian(random: () => number): number {
  const u = Math.max(random(), 1e-9);
  const v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export interface BotMove {
  correct: boolean;
  delayMs: number;
}

/** Qué hace el bot con la próxima pregunta: si acierta y cuánto tarda. */
export function botMove(skill: BotSkill, random: () => number, config = BOT_CONFIG): BotMove {
  const correct = random() < skill.accuracy;
  const delay = skill.meanMs * Math.exp(config.timeSpread * gaussian(random));
  return {
    correct,
    delayMs: Math.round(Math.min(config.maxMs, Math.max(config.minMs, delay))),
  };
}

export interface BotPersona {
  name: string;
  avatarId: (typeof BOT_AVATARS)[number];
  rating: number;
}

/** Elige un bot a la altura del jugador (rating ± jitter, nunca por debajo del piso). */
export function pickBot(
  playerRating: number,
  random: () => number,
  config = BOT_CONFIG,
): BotPersona {
  const jitter = Math.round((random() * 2 - 1) * config.ratingJitter);
  return {
    name: BOT_NAMES[Math.floor(random() * BOT_NAMES.length)]!,
    avatarId: BOT_AVATARS[Math.floor(random() * BOT_AVATARS.length)]!,
    rating: Math.max(RATING_CONFIG.ratingFloor, playerRating + jitter),
  };
}

/** Los ids de bot nunca colisionan con un uuid de usuario. */
export const BOT_ID_PREFIX = 'bot:';
export const isBotId = (id: string) => id.startsWith(BOT_ID_PREFIX);
