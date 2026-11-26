// Períodos del panel en fechas calendario de Buenos Aires (la base usa la misma zona: admin.tz()).

export const TIME_ZONE = 'America/Argentina/Buenos_Aires';

export type PresetId = 'today' | 'yesterday' | '7d' | '30d' | '90d' | '12m' | 'custom';

export interface Period {
  preset: PresetId;
  from: string; // YYYY-MM-DD, inclusive
  to: string; // YYYY-MM-DD, inclusive
}

export const PRESETS: { id: Exclude<PresetId, 'custom'>; label: string }[] = [
  { id: 'today', label: 'Hoy' },
  { id: 'yesterday', label: 'Ayer' },
  { id: '7d', label: 'Últimos 7 días' },
  { id: '30d', label: 'Últimos 30 días' },
  { id: '90d', label: 'Últimos 90 días' },
  { id: '12m', label: 'Últimos 12 meses' },
];

/** Fecha local de Buenos Aires para un instante. */
export function localDate(at: Date = new Date(), timeZone: string = TIME_ZONE): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(at);
}

export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

export function presetPeriod(id: Exclude<PresetId, 'custom'>, today: string = localDate()): Period {
  switch (id) {
    case 'today':
      return { preset: id, from: today, to: today };
    case 'yesterday':
      return { preset: id, from: addDays(today, -1), to: addDays(today, -1) };
    case '7d':
      return { preset: id, from: addDays(today, -6), to: today };
    case '30d':
      return { preset: id, from: addDays(today, -29), to: today };
    case '90d':
      return { preset: id, from: addDays(today, -89), to: today };
    case '12m':
      return { preset: id, from: addDays(today, -364), to: today };
  }
}

/** El período anterior de igual largo (el mismo cálculo que admin_overview). */
export function previousPeriod(p: Pick<Period, 'from' | 'to'>): { from: string; to: string } {
  const len = daysBetween(p.from, p.to) + 1;
  return { from: addDays(p.from, -len), to: addDays(p.from, -1) };
}

/** Un período personalizado válido: desde ≤ hasta y como máximo 2 años (lo mismo que admin.check_range). */
export function validCustom(from: string, to: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) return false;
  const span = daysBetween(from, to);
  return span >= 0 && span <= 731;
}

export type Grain = 'day' | 'week' | 'month';

/** Clave del bucket de una fecha: el lunes de su semana o el mes. */
export function bucketOf(day: string, grain: Grain): string {
  if (grain === 'day') return day;
  if (grain === 'month') return day.slice(0, 7);
  const d = new Date(`${day}T00:00:00Z`);
  const iso = (d.getUTCDay() + 6) % 7; // lunes = 0
  return addDays(day, -iso);
}

/**
 * Agrupa una serie diaria. Las columnas 'sum' se suman; las 'avg' (p. ej. usuarios activos, que no
 * se pueden sumar entre días) se promedian.
 */
export function aggregate<T extends Record<string, unknown>>(
  rows: T[],
  grain: Grain,
  modes: Record<string, 'sum' | 'avg'>,
): Record<string, number | string>[] {
  const buckets = new Map<string, { n: number; acc: Record<string, number> }>();
  for (const r of rows) {
    const key = bucketOf(String(r.day), grain);
    const b = buckets.get(key) ?? { n: 0, acc: {} };
    b.n += 1;
    for (const k of Object.keys(modes)) {
      const v = Number(r[k] ?? 0);
      b.acc[k] = (b.acc[k] ?? 0) + (Number.isFinite(v) ? v : 0);
    }
    buckets.set(key, b);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([day, b]) => {
      const out: Record<string, number | string> = { day };
      for (const [k, mode] of Object.entries(modes)) {
        const total = b.acc[k] ?? 0;
        out[k] = mode === 'avg' ? Math.round((total / b.n) * 100) / 100 : total;
      }
      return out;
    });
}
