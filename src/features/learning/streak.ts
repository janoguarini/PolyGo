import type { LearningSummary } from './api';

type DailyState = Pick<LearningSummary, 'streak_days' | 'active_today' | 'today_seconds'>;

export interface Celebration {
  /** Racha después de la sesión. */
  streakDays: number;
  /** Primera sesión del día: la racha arrancó o sumó un día. */
  streakExtended: boolean;
  /** Esta sesión hizo pasar el objetivo diario. */
  goalMet: boolean;
  goalMinutes: number;
}

/** Qué festejar al terminar una sesión, comparando el resumen de antes y el de después. */
export function celebrationFor(
  before: DailyState,
  after: DailyState,
  goalMinutes: number,
): Celebration | null {
  const goal = goalMinutes * 60;
  const streakExtended = !before.active_today && after.active_today;
  const goalMet = before.today_seconds < goal && after.today_seconds >= goal;
  if (!streakExtended && !goalMet) return null;
  return { streakDays: after.streak_days, streakExtended, goalMet, goalMinutes };
}

/** Hay una racha en juego y hoy todavía no practicaste: si no lo hacés, mañana vuelve a 0. */
export function streakAtRisk(summary: Pick<LearningSummary, 'streak_days' | 'active_today'>) {
  return summary.streak_days > 0 && !summary.active_today;
}

const DAY_LABELS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

export interface WeekDay {
  label: string;
  active: boolean;
  isToday: boolean;
}

/** Los últimos 7 días (terminando hoy) marcando los que forman parte de la racha actual. */
export function streakWeek(
  streakDays: number,
  activeToday: boolean,
  today = new Date(),
): WeekDay[] {
  return Array.from({ length: 7 }, (_, i) => {
    const daysAgo = 6 - i;
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);
    // Si hoy todavía no hubo actividad, la racha termina ayer.
    const active = activeToday ? daysAgo < streakDays : daysAgo >= 1 && daysAgo <= streakDays;
    return { label: DAY_LABELS[date.getDay()]!, active, isToday: daysAgo === 0 };
  });
}

export const daysLabel = (n: number) => `${n} ${n === 1 ? 'día' : 'días'}`;
