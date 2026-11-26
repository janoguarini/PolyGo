import type { TierId } from './ranking';

/**
 * Logros que se pueden compartir como tarjeta (imagen) y que pagan Polys la primera vez que se
 * comparten. La base (claim_share_reward) valida cada logro contra sus propios datos y paga una sola
 * vez por `shareRef`: el cliente nunca decide el monto.
 */
export type ShareAchievement =
  /** Llegaste a un rango nuevo (de Bronce a Plata, de Plata a Oro…). */
  | { kind: 'rank'; tier: TierId }
  /** Hito de racha (7, 14, 30, 50, 100… días). */
  | { kind: 'streak'; days: number; language: string }
  /** Terminaste un nivel entero de un curso (A1 → A2). */
  | { kind: 'level'; level: string; language: string };

/** Polys por compartir cada logro (una vez por logro). Igual que public.share_reward_polys(). */
export const SHARE_REWARD_POLYS = 20;

/** Hitos de racha que se festejan y se pueden compartir. Pasado el año, cada 100 días. */
const STREAK_MILESTONES = [7, 14, 30, 50, 100, 150, 200, 250, 300, 365] as const;

export function isStreakShareMilestone(days: number): boolean {
  if ((STREAK_MILESTONES as readonly number[]).includes(days)) return true;
  return days > 365 && days % 100 === 0;
}

/**
 * Identificador estable del logro (el `ref` del movimiento de Polys): un mismo logro paga una sola
 * vez aunque se comparta muchas veces o desde otro teléfono. La racha no lleva el idioma: es una sola
 * para toda la cuenta.
 */
export function shareRef(a: ShareAchievement): string {
  switch (a.kind) {
    case 'rank':
      return `rank:${a.tier}`;
    case 'streak':
      return `streak:${a.days}`;
    case 'level':
      return `level:${a.language}:${a.level}`;
  }
}
