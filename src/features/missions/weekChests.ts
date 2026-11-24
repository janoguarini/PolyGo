import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/features/auth/AuthProvider';
import { requireSupabase } from '@/lib/supabase';

/**
 * Cofres abiertos en la semana (lunes a domingo, como el bonus semanal del servidor). Se leen del
 * registro de Polys del propio usuario (RLS: sólo lo suyo): cada cofre es reason 'chest' con
 * ref = fecha local, y el bonus es reason 'weekly' con ref = semana ISO ('IYYY-IW'). No se escribe
 * nada: abrir el cofre sigue siendo claim_mission_reward.
 */

export interface WeekDay {
  /** 'YYYY-MM-DD' local. */
  date: string;
  /** Polys que dio el cofre ese día (null = no se abrió). */
  polys: number | null;
}

export interface WeekChests {
  days: WeekDay[];
  /** Polys del bonus semanal ya cobrado (null si todavía no). */
  weeklyBonus: number | null;
}

const pad = (n: number) => String(n).padStart(2, '0');
const toDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!));
};
const toIso = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

/** Los 7 días (lunes a domingo) de la semana de `today`. */
export function weekDays(today: string): string[] {
  const d = toDate(today);
  const monday = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86_400_000);
  return Array.from({ length: 7 }, (_, i) => toIso(new Date(monday.getTime() + i * 86_400_000)));
}

/** Semana ISO como la escribe Postgres con to_char(fecha, 'IYYY-IW'). */
export function isoWeekRef(today: string): string {
  const d = toDate(today);
  const thursday = new Date(d.getTime() + (3 - ((d.getUTCDay() + 6) % 7)) * 86_400_000);
  const year = thursday.getUTCFullYear();
  const week = 1 + Math.floor((thursday.getTime() - Date.UTC(year, 0, 1)) / 86_400_000 / 7);
  return `${year}-${pad(week)}`;
}

export function buildWeek(
  today: string,
  rows: { reason: string; ref: string; amount: number }[],
): WeekChests {
  const byDate = new Map(rows.filter((r) => r.reason === 'chest').map((r) => [r.ref, r.amount]));
  const weekly = rows.find((r) => r.reason === 'weekly' && r.ref === isoWeekRef(today));
  return {
    days: weekDays(today).map((date) => ({ date, polys: byDate.get(date) ?? null })),
    weeklyBonus: weekly ? weekly.amount : null,
  };
}

export async function fetchWeekChests(today: string): Promise<WeekChests> {
  const days = weekDays(today);
  const { data, error } = await requireSupabase()
    .from('poly_transactions')
    .select('reason, ref, amount')
    .or(
      `and(reason.eq.chest,ref.gte.${days[0]},ref.lte.${days[6]}),and(reason.eq.weekly,ref.eq.${isoWeekRef(today)})`,
    );
  if (error) throw error;
  return buildWeek(today, data);
}

/** Dentro de ['learning']: abrir el cofre (que invalida ese prefijo) la vuelve a leer. */
export function useWeekChests(today: string | undefined) {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: ['learning', 'week-chests', userId ?? 'anonymous', today ?? 'none'],
    queryFn: () => fetchWeekChests(today!),
    enabled: Boolean(userId && today),
  });
}
