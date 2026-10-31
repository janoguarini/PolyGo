import { RATING_CONFIG } from './ranking';

/**
 * Bots de Word Rush para que el ranked funcione con pocos jugadores. Siempre se muestran como
 * bots (distintivo BOT) y la partida cuenta para el ELO como cualquier otra: el bot se elige a la
 * altura del jugador y juega con la habilidad de ese rating, así que en promedio se gana la mitad
 * y el ELO termina midiendo el nivel real. Ver docs/BATTLE_PROTOCOL.md.
 */

export const BOT_CONFIG = {
  /** Espera en cola sin rival humano antes de ofrecer un bot. */
  afterMs: 5_000,
  /** El rating del bot se elige a ± esto del jugador. */
  ratingJitter: 40,
  /**
   * Habilidad por rating (interpolación lineal entre puntos; fuera del rango se satura). Empinada
   * abajo: en Bronce los bots son lentos y en cada rango se nota que responden más rápido.
   * meanMs = tiempo medio de respuesta. Copiada en SQL: public.bot_skill.
   */
  skillCurve: [
    { rating: 100, accuracy: 0.5, meanMs: 6_500 },
    { rating: 400, accuracy: 0.68, meanMs: 4_200 },
    { rating: 1_000, accuracy: 0.82, meanMs: 2_700 },
    { rating: 1_600, accuracy: 0.91, meanMs: 1_800 },
    { rating: 2_200, accuracy: 0.97, meanMs: 1_200 },
  ],
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
  const curve = config.skillCurve;
  const first = curve[0]!;
  const last = curve[curve.length - 1]!;
  if (rating <= first.rating) return { accuracy: first.accuracy, meanMs: first.meanMs };
  if (rating >= last.rating) return { accuracy: last.accuracy, meanMs: last.meanMs };
  const i = curve.findIndex((p) => p.rating > rating);
  const a = curve[i - 1]!;
  const b = curve[i]!;
  const t = (rating - a.rating) / (b.rating - a.rating);
  return { accuracy: lerp(a.accuracy, b.accuracy, t), meanMs: lerp(a.meanMs, b.meanMs, t) };
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
