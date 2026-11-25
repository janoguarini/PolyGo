/**
 * Rival de práctica a la altura de lo que el jugador realmente hace (Word Rush, motor Arcade).
 *
 * El bot de siempre (botArcadeMove) juega según el RATING: con poco ELO juega flojo. Pero un jugador
 * nuevo tiene poco ELO aunque juegue bien, y en el modo de 60 s con combos la diferencia se multiplica
 * (8000 a 900). Acá el bot apunta a un PUNTAJE: la mediana de las últimas partidas del jugador, ajustada
 * por su rango (en Bronce un 10 % menos; cada rango, más exigente) y con variación entre partidas, y
 * regula precisión y ritmo durante la partida para terminar cerca de ese objetivo. No mira al rival: sólo su propio puntaje contra su propio plan, así que ganarle depende de
 * jugar mejor que tu promedio.
 *
 * Sin historial suficiente (las primeras partidas), botTargetScore devuelve null y se usa el bot de
 * siempre. Ver BOT_PACING y la simulación en server/test/botPacing.test.ts.
 */
import { KIND_RULES, type ArcadeRules, type ChallengeKind } from './arcade';
import { BOT_CONFIG } from './bots';
import { getRank, type TierId } from './ranking';

export const BOT_PACING = {
  /** Partidas recientes (Word Rush completas, en este idioma) que se miran. */
  historySize: 10,
  /** Con menos que esto no hay objetivo: se usa el bot de siempre. */
  minHistory: 2,
  /**
   * El objetivo es la mediana × el factor del rango del jugador: en Bronce el rival apunta un 10 %
   * por debajo de tu nivel y cada rango se pone más difícil (en los rangos altos, por encima). Así
   * subir de los primeros rangos es accesible y los altos cuestan. Ver la simulación por rango en
   * server/test/botPacing.test.ts.
   */
  targetFactorByTier: {
    bronze: 0.9,
    silver: 0.93,
    gold: 0.96,
    platinum: 0.99,
    emerald: 1.02,
    diamond: 1.05,
    master: 1.08,
    grandmaster: 1.1,
  } as Readonly<Record<TierId, number>>,
  /** Variación del objetivo entre partidas (log-normal): unas veces el rival está mejor, otras peor. */
  targetSpread: 0.15,
  /** Precisión cuando va justo en su plan, y sus límites. */
  baseAccuracy: 0.85,
  minAccuracy: 0.45,
  maxAccuracy: 0.98,
  /** Cuánto corrige precisión y ritmo por cada unidad de desvío del plan. */
  accuracyGain: 0.14,
  speedGain: 0.4,
  /**
   * El desvío se mide en fracciones del objetivo (gapScale). Atrás satura en gapClamp; adelante puede
   * frenar más (aheadClamp), porque con combos un buen arranque se dispara.
   */
  gapScale: 0.1,
  gapClamp: 1.5,
  aheadClamp: 5,
  /**
   * Ritmo y precisión de base según el objetivo: calibrados para paceRef; con objetivos más bajos va
   * más lento ((paceRef / objetivo) ^ paceExponent, hasta slowMax veces) y se equivoca más
   * (accuracyPerHalving menos por cada mitad).
   */
  paceRef: 9_000,
  paceExponent: 0.7,
  slowMax: 4,
  fastMax: 0.75,
  accuracyPerHalving: 0.08,
  /** Mira un poco adelante para corregir antes de quedar lejos. */
  lookaheadMs: 1_500,
  /** Tiempo medio por formato cuando va en su plan (ms). */
  baseMs: { swipe: 1_350, connect: 1_150, audio: 1_900, sentence: 4_200 } as Readonly<
    Record<ChallengeKind, number>
  >,
  /** Dispersión log-normal de cada tiempo. */
  timeSpread: 0.25,
} as const;

export type BotPacingConfig = typeof BOT_PACING;

/** Normal estándar a partir de dos uniformes (Box-Muller). */
function gaussian(random: () => number): number {
  const u = Math.max(random(), 1e-9);
  const v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const clamp = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

/**
 * Puntaje objetivo del bot para esta partida, a partir de los puntajes recientes del jugador (más
 * nuevos primero). null sin historial suficiente.
 */
export function botTargetScore(
  recentScores: readonly number[] | null | undefined,
  /** Rating del jugador en este idioma: su rango decide qué tan exigente es el rival. */
  playerRating: number,
  random: () => number,
  config: BotPacingConfig = BOT_PACING,
): number | null {
  const scores = (recentScores ?? [])
    .filter((n) => Number.isFinite(n) && n > 0)
    .slice(0, config.historySize);
  if (scores.length < config.minHistory) return null;
  const sorted = [...scores].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 1 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
  const spread = Math.exp(config.targetSpread * gaussian(random));
  const factor = config.targetFactorByTier[getRank(playerRating).tier.id];
  return Math.max(1, Math.round(median * factor * spread));
}

/**
 * Qué fracción del puntaje final se espera tener a los `elapsedMs`: ritmo parejo, y el doble en el
 * Frenesí (los últimos frenzyMs valen frenzyMultiplier).
 */
export function expectedScoreFraction(
  elapsedMs: number,
  rules: Pick<ArcadeRules, 'durationMs' | 'frenzyMs' | 'frenzyMultiplier'>,
): number {
  const normal = rules.durationMs - rules.frenzyMs;
  const total = normal + rules.frenzyMs * rules.frenzyMultiplier;
  const t = clamp(elapsedMs, 0, rules.durationMs);
  const done = t <= normal ? t : normal + (t - normal) * rules.frenzyMultiplier;
  return total > 0 ? done / total : 1;
}

/** La próxima jugada del bot con objetivo: si acierta y cuánto tarda. */
export function pacedBotMove(
  input: {
    target: number;
    score: number;
    elapsedMs: number;
    kind: ChallengeKind;
    rules: Pick<ArcadeRules, 'durationMs' | 'frenzyMs' | 'frenzyMultiplier'>;
    random: () => number;
  },
  config: BotPacingConfig = BOT_PACING,
): { correct: boolean; delayMs: number } {
  const { target, score, elapsedMs, kind, rules, random } = input;
  const expected = target * expectedScoreFraction(elapsedMs + config.lookaheadMs, rules);
  // > 0: va atrás de su plan (acelera y se concentra); < 0: va adelante (afloja).
  const gap = clamp(
    (expected - score) / Math.max(1, target * config.gapScale),
    -config.aheadClamp,
    config.gapClamp,
  );
  // Base según el objetivo: un rival de 1500 puntos no juega al ritmo de uno de 9000.
  const ratio = config.paceRef / Math.max(1, target);
  const slow = clamp(Math.pow(ratio, config.paceExponent), config.fastMax, config.slowMax);
  const baseAccuracy =
    config.baseAccuracy - config.accuracyPerHalving * Math.max(0, Math.log2(ratio));
  const accuracy = clamp(
    baseAccuracy + config.accuracyGain * gap,
    config.minAccuracy,
    config.maxAccuracy,
  );
  const correct = random() < accuracy;
  const delay =
    config.baseMs[kind] *
    slow *
    Math.exp(-config.speedGain * gap) *
    Math.exp(config.timeSpread * gaussian(random));
  // Nunca más rápido que lo que se acepta de una persona (mismo piso que botArcadeMove).
  const min = Math.max(KIND_RULES[kind].minMs + 150, 350);
  return { correct, delayMs: Math.round(Math.min(BOT_CONFIG.maxMs, Math.max(min, delay))) };
}
