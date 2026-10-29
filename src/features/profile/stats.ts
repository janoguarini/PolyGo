/** Lógica pura del perfil competitivo (sin React ni Supabase) para poder testearla. */

export interface RatingPoint {
  rating: number;
  delta: number;
  at: string;
  reason: string;
}

export interface ChartGeometry {
  points: { x: number; y: number }[];
  min: number;
  max: number;
  /** Valores de las líneas de referencia del eje Y (de abajo hacia arriba). */
  ticks: number[];
}

/** Puntos máximos que muestra el gráfico: las últimas N variaciones. */
export const MAX_CHART_POINTS = 50;

/**
 * Escala la serie a un rectángulo. X por orden (una partida = un paso), Y con márgenes redondeados a
 * múltiplos de 25 para que los ticks sean números limpios. Una serie plana igual tiene altura.
 */
export function chartGeometry(
  series: readonly RatingPoint[],
  width: number,
  height: number,
  padding = { top: 12, bottom: 12, left: 0, right: 0 },
): ChartGeometry {
  const values = series.map((p) => p.rating);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const step = 25;
  let min = Math.floor((rawMin - 10) / step) * step;
  let max = Math.ceil((rawMax + 10) / step) * step;
  if (max - min < 2 * step) {
    const mid = (min + max) / 2;
    min = Math.floor((mid - step) / step) * step;
    max = min + 2 * step;
  }
  const innerW = Math.max(width - padding.left - padding.right, 1);
  const innerH = Math.max(height - padding.top - padding.bottom, 1);
  const n = series.length;
  const points = series.map((p, i) => ({
    x: padding.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW),
    y: padding.top + (1 - (p.rating - min) / (max - min)) * innerH,
  }));
  return { points, min, max, ticks: [min, Math.round((min + max) / 2), max] };
}

/** Índice del punto más cercano a una coordenada X (para inspeccionar tocando el gráfico). */
export function nearestIndex(points: readonly { x: number }[], x: number): number {
  let best = 0;
  for (let i = 1; i < points.length; i++) {
    if (Math.abs(points[i]!.x - x) < Math.abs(points[best]!.x - x)) best = i;
  }
  return best;
}

export function linePath(points: readonly { x: number; y: number }[]): string {
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');
}

export function areaPath(points: readonly { x: number; y: number }[], baseline: number): string {
  if (points.length === 0) return '';
  const first = points[0]!;
  const last = points[points.length - 1]!;
  return `${linePath(points)} L${last.x.toFixed(1)},${baseline} L${first.x.toFixed(1)},${baseline} Z`;
}

export function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return `−${Math.abs(delta)}`;
  return '±0';
}

export type MatchResult = 'win' | 'loss' | 'draw';

export const RESULT_LABELS: Record<MatchResult, string> = {
  win: 'Victoria',
  loss: 'Derrota',
  draw: 'Empate',
};

export function isMatchResult(value: string | null | undefined): value is MatchResult {
  return value === 'win' || value === 'loss' || value === 'draw';
}

export interface AchievementLike {
  progress: number;
  threshold: number;
  unlockedAt: string | null;
}

/** 0..1. Un logro desbloqueado siempre está completo aunque la métrica haya bajado después. */
export function achievementRatio(a: AchievementLike): number {
  if (a.unlockedAt) return 1;
  return Math.min(a.progress / a.threshold, 1);
}
