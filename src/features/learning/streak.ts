import { POLYS } from '@shared/polys';

import { getStrings } from '@/i18n';

import type { LearningSummary } from './api';
import { streakStrings } from './strings';

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

export interface WeekDay {
  label: string;
  active: boolean;
  /** Día sin estudio cubierto por un protector de racha. */
  frozen: boolean;
  isToday: boolean;
}

const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * Los últimos 7 días (terminando hoy) marcando los que forman parte de la racha actual. Los días
 * cubiertos por un protector (frozenDates, YYYY-MM-DD) no cuentan como estudiados pero no la cortan.
 */
export function streakWeek(
  streakDays: number,
  activeToday: boolean,
  today = new Date(),
  frozenDates: readonly string[] = [],
): WeekDay[] {
  const frozen = new Set(frozenDates);
  const days = Array.from({ length: 7 }, (_, i) => {
    const daysAgo = 6 - i;
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);
    return { date, daysAgo, frozen: frozen.has(dateKey(date)) };
  });
  // Recorre hacia atrás desde hoy (o ayer, si hoy todavía no hubo actividad).
  const active = new Set<number>();
  let remaining = streakDays;
  for (let daysAgo = activeToday ? 0 : 1; daysAgo < 7 && remaining > 0; daysAgo++) {
    if (days[6 - daysAgo]!.frozen) continue;
    active.add(daysAgo);
    remaining--;
  }
  return days.map(({ date, daysAgo, frozen: isFrozen }) => ({
    label: getStrings(streakStrings).dayLabels[date.getDay()]!,
    active: active.has(daysAgo),
    frozen: isFrozen && !active.has(daysAgo),
    isToday: daysAgo === 0,
  }));
}

export const daysLabel = (n: number) => getStrings(streakStrings).days(n);

export interface CalendarDay {
  /** YYYY-MM-DD. */
  key: string;
  day: number;
  /** Hubo estudio ese día. */
  studied: boolean;
  /** Sin estudio, pero cubierto por un protector de racha. */
  frozen: boolean;
  isToday: boolean;
  isFuture: boolean;
}

/** Primer y último día de un mes (month: 0–11), como YYYY-MM-DD. */
export function monthRange(year: number, month: number): { from: string; to: string } {
  return {
    from: dateKey(new Date(year, month, 1)),
    to: dateKey(new Date(year, month + 1, 0)),
  };
}

/**
 * Semanas de un mes para el calendario de racha, empezando en lunes; null = casilla vacía antes del
 * día 1 o después del último. Marca los días con los datos reales (studied / frozen, YYYY-MM-DD): no
 * deduce nada de la cantidad de días de racha.
 */
export function monthGrid(
  year: number,
  month: number,
  studied: readonly string[],
  frozen: readonly string[],
  today = new Date(),
): (CalendarDay | null)[][] {
  const studiedSet = new Set(studied);
  const frozenSet = new Set(frozen);
  const todayKey = dateKey(today);
  const lead = (new Date(year, month, 1).getDay() + 6) % 7; // lunes = 0
  const length = new Date(year, month + 1, 0).getDate();
  const cells: (CalendarDay | null)[] = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= length; day++) {
    const key = dateKey(new Date(year, month, day));
    const isStudied = studiedSet.has(key);
    cells.push({
      key,
      day,
      studied: isStudied,
      frozen: !isStudied && frozenSet.has(key),
      isToday: key === todayKey,
      isFuture: key > todayKey,
    });
  }
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

/** Hitos de racha que se festejan en el calendario. */
export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100, 150, 200, 365, 500, 1000] as const;

/**
 * Próximo hito por alcanzar, el progreso (0–1) desde el hito anterior y los Polys que paga al
 * llegar (POLYS.streakMilestones; null si ese hito no paga nada).
 */
export function nextMilestone(streak: number): {
  target: number;
  previous: number;
  progress: number;
  polys: number | null;
} {
  const target = STREAK_MILESTONES.find((m) => m > streak) ?? (Math.floor(streak / 500) + 1) * 500;
  const previous = [...STREAK_MILESTONES].reverse().find((m) => m <= streak) ?? 0;
  const span = target - previous;
  const polys = POLYS.streakMilestones.find((m) => m.days === target)?.polys ?? null;
  return { target, previous, progress: span > 0 ? (streak - previous) / span : 0, polys };
}

/** Días estudiados del mes y la tanda consecutiva más larga (un protector no corta, pero no suma). */
export function monthStats(weeks: readonly (readonly (CalendarDay | null)[])[]): {
  studied: number;
  bestRun: number;
} {
  let studied = 0;
  let run = 0;
  let bestRun = 0;
  for (const day of weeks.flat()) {
    if (!day || day.isFuture) continue;
    if (day.studied) {
      studied++;
      run++;
      bestRun = Math.max(bestRun, run);
    } else if (!day.frozen && !day.isToday) {
      run = 0;
    }
  }
  return { studied, bestRun };
}

/** Horas enteras (redondeando hacia arriba) que faltan para la medianoche local. */
export function hoursUntilMidnight(now = new Date()): number {
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return Math.max(1, Math.ceil((midnight.getTime() - now.getTime()) / 3_600_000));
}
