/**
 * Fuente única de verdad del sistema competitivo.
 * La usan la app (para mostrar) y el servidor de partidas (para liquidar).
 * Cambiar un valor acá cambia las reglas en ambos lados: documentarlo en docs/RANKING_SYSTEM.md.
 */

export const RATING_CONFIG = {
  initialRating: 1000,
  ratingFloor: 100,
  kFactor: 32,
  /** K más alto mientras el jugador está en partidas de colocación. */
  placementKFactor: 48,
  placementMatches: 5,
  /**
   * Anti-farming: multiplicador de K según cuántas partidas ranked se jugaron
   * contra el mismo rival en las últimas 24 h (contando la actual).
   */
  repeatOpponentWindowHours: 24,
  repeatOpponentMultipliers: [
    { fromMatch: 1, multiplier: 1 },
    { fromMatch: 3, multiplier: 0.5 },
    { fromMatch: 5, multiplier: 0 },
  ],
} as const;

export type TierId =
  'bronze' | 'silver' | 'gold' | 'platinum' | 'emerald' | 'diamond' | 'master' | 'grandmaster';

export type Division = 'III' | 'II' | 'I';

export interface TierDefinition {
  id: TierId;
  name: string;
  /** Rating mínimo (inclusive) para estar en este tier. */
  minRating: number;
  /** Si tiene divisiones III → II → I. */
  hasDivisions: boolean;
}

/** Ordenados de menor a mayor. */
export const TIERS: readonly TierDefinition[] = [
  { id: 'bronze', name: 'Bronce', minRating: 0, hasDivisions: true },
  { id: 'silver', name: 'Plata', minRating: 900, hasDivisions: true },
  { id: 'gold', name: 'Oro', minRating: 1050, hasDivisions: true },
  { id: 'platinum', name: 'Platino', minRating: 1200, hasDivisions: true },
  { id: 'emerald', name: 'Esmeralda', minRating: 1350, hasDivisions: true },
  { id: 'diamond', name: 'Diamante', minRating: 1500, hasDivisions: true },
  { id: 'master', name: 'Maestro', minRating: 1700, hasDivisions: false },
  { id: 'grandmaster', name: 'Gran Maestro', minRating: 1900, hasDivisions: false },
];

/** Bronce no tiene límite inferior real; sus divisiones se calculan desde este piso visual. */
const BRONZE_DIVISION_BASE = 750;
const DIVISIONS: readonly Division[] = ['III', 'II', 'I'];

export interface RankInfo {
  tier: TierDefinition;
  division: Division | null;
  /** Etiqueta lista para mostrar, p. ej. "Plata II" o "Maestro". */
  label: string;
  /** Rating donde empieza el escalón actual (división o tier). */
  stepMin: number;
  /** Rating donde empieza el siguiente escalón; null en el tope. */
  nextStepMin: number | null;
  /** Progreso 0..1 dentro del escalón actual. */
  progress: number;
}

export function getRank(rawRating: number): RankInfo {
  const rating = Math.max(0, Math.floor(rawRating));
  let index = 0;
  for (let i = 0; i < TIERS.length; i++) {
    if (rating >= TIERS[i]!.minRating) index = i;
  }
  const tier = TIERS[index]!;
  const nextTier = TIERS[index + 1] ?? null;

  if (!tier.hasDivisions || !nextTier) {
    return buildRank(tier, null, tier.minRating, nextTier?.minRating ?? null, rating);
  }

  const base = tier.id === 'bronze' ? BRONZE_DIVISION_BASE : tier.minRating;
  const span = (nextTier.minRating - base) / DIVISIONS.length;
  const bounds = DIVISIONS.map((_, i) => Math.round(base + span * i));
  let divIndex = 0;
  for (let i = 0; i < bounds.length; i++) {
    if (rating >= bounds[i]!) divIndex = i;
  }
  const stepMin = divIndex === 0 ? tier.minRating : bounds[divIndex]!;
  const nextStepMin = bounds[divIndex + 1] ?? nextTier.minRating;
  return buildRank(tier, DIVISIONS[divIndex]!, stepMin, nextStepMin, rating);
}

function buildRank(
  tier: TierDefinition,
  division: Division | null,
  stepMin: number,
  nextStepMin: number | null,
  rating: number,
): RankInfo {
  // En Bronce III el escalón visual empieza en 0, pero medimos progreso desde un piso razonable.
  const progressBase =
    tier.id === 'bronze' && division === 'III' ? RATING_CONFIG.ratingFloor : stepMin;
  const progress =
    nextStepMin === null
      ? 1
      : clamp01((rating - progressBase) / Math.max(1, nextStepMin - progressBase));
  return {
    tier,
    division,
    label: division ? `${tier.name} ${division}` : tier.name,
    stepMin,
    nextStepMin,
    progress,
  };
}

export type MatchOutcome = 'win' | 'draw' | 'loss';

export const OUTCOME_SCORE: Record<MatchOutcome, number> = { win: 1, draw: 0.5, loss: 0 };

/** ExpectedScoreA = 1 / (1 + 10^((RatingB - RatingA) / 400)) */
export function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

export function repeatOpponentMultiplier(matchesAgainstOpponentInWindow: number): number {
  let multiplier = 1;
  for (const step of RATING_CONFIG.repeatOpponentMultipliers) {
    if (matchesAgainstOpponentInWindow >= step.fromMatch) multiplier = step.multiplier;
  }
  return multiplier;
}

export interface RatingChangeInput {
  rating: number;
  opponentRating: number;
  outcome: MatchOutcome;
  /** Partidas ranked ya liquidadas antes de esta (para colocación). */
  gamesPlayed: number;
  /** Partidas contra este rival en la ventana, contando la actual. Por defecto 1. */
  matchesAgainstOpponentInWindow?: number;
}

export interface RatingChange {
  before: number;
  after: number;
  delta: number;
  expected: number;
  kFactor: number;
}

/** NewRatingA = RatingA + K * (ActualScoreA - ExpectedScoreA), redondeado y con piso. */
export function computeRatingChange(input: RatingChangeInput): RatingChange {
  const expected = expectedScore(input.rating, input.opponentRating);
  const baseK =
    input.gamesPlayed < RATING_CONFIG.placementMatches
      ? RATING_CONFIG.placementKFactor
      : RATING_CONFIG.kFactor;
  const kFactor = baseK * repeatOpponentMultiplier(input.matchesAgainstOpponentInWindow ?? 1);
  const rawDelta = Math.round(kFactor * (OUTCOME_SCORE[input.outcome] - expected));
  const after = Math.max(RATING_CONFIG.ratingFloor, input.rating + rawDelta);
  return { before: input.rating, after, delta: after - input.rating, expected, kFactor };
}

export function isInPlacement(gamesPlayed: number): boolean {
  return gamesPlayed < RATING_CONFIG.placementMatches;
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}
