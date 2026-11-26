// Formatos del panel de administración (es-AR, hora de Buenos Aires). El panel es una herramienta
// interna del dueño: sus textos van en español fijo (excepción documentada en docs/ADMIN_PANEL.md).
import { TIME_ZONE } from './api';

export function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

export const fmtInt = (v: unknown) => {
  const n = num(v);
  return n === null ? '—' : Math.round(n).toLocaleString('es-AR');
};

export const fmtDec = (v: unknown) => {
  const n = num(v);
  return n === null ? '—' : n.toLocaleString('es-AR', { maximumFractionDigits: 2 });
};

export const fmtPct = (v: unknown) => {
  const n = num(v);
  return n === null ? '—' : `${n.toLocaleString('es-AR', { maximumFractionDigits: 1 })} %`;
};

export function fmtSeconds(v: unknown): string {
  const n = num(v);
  if (n === null) return '—';
  if (n < 60) return `${Math.round(n)} s`;
  const m = Math.floor(n / 60);
  if (m < 60) return `${m} min ${Math.round(n % 60)} s`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

export const fmtMs = (v: unknown) => {
  const n = num(v);
  return n === null ? '—' : n < 1000 ? `${Math.round(n)} ms` : `${(n / 1000).toLocaleString('es-AR', { maximumFractionDigits: 1 })} s`;
};

export function fmtBytes(v: unknown): string {
  let n = num(v);
  if (n === null) return '—';
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (n >= 1024 && i < u.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toLocaleString('es-AR', { maximumFractionDigits: 1 })} ${u[i]}`;
}

export function fmtDateTime(v: unknown): string {
  if (typeof v !== 'string' || !v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('es-AR', { timeZone: TIME_ZONE, dateStyle: 'short', timeStyle: 'short' });
}

export function fmtDay(v: unknown): string {
  if (typeof v !== 'string' || !v) return '—';
  const [y, m, d] = v.slice(0, 10).split('-');
  return d && m ? `${d}/${m}` : String(y ?? '—');
}

export function deltaPct(cur: unknown, prev: unknown): number | null {
  const c = num(cur);
  const p = num(prev);
  if (c === null || p === null || p === 0) return null;
  return Math.round(((c - p) / p) * 1000) / 10;
}

const LANG: Record<string, string> = {
  en: 'Inglés',
  pt: 'Portugués',
  it: 'Italiano',
  zh: 'Chino',
  fr: 'Francés',
  es: 'Español',
};
export const langName = (c: unknown) =>
  typeof c === 'string' ? (LANG[c] ?? (c === '??' ? 'Sin dato' : c)) : '—';

export const countryName = (c: unknown) => (typeof c !== 'string' || !c || c === '??' ? 'Sin país' : c);

const TIER: Record<string, string> = {
  bronze: 'Bronce',
  silver: 'Plata',
  gold: 'Oro',
  platinum: 'Platino',
  emerald: 'Esmeralda',
  diamond: 'Diamante',
  master: 'Maestro',
  grandmaster: 'Gran Maestro',
};
export const tierName = (t: unknown) => (typeof t === 'string' ? (TIER[t] ?? t) : '—');

export const platformName = (p: unknown) =>
  p === 'ios' ? 'iOS' : p === 'android' ? 'Android' : p === 'unknown' ? 'Sin dato' : String(p ?? '—');

/** Agrupa una serie diaria por semana (lunes) cuando el período es largo, para que las barras se lean. */
export function compactSeries(rows: Json[], key: string, mode: 'sum' | 'avg' = 'sum'): { label: string; value: number }[] {
  const daily = rows.map((r) => ({ day: String(r.day), value: num(r[key]) ?? 0 }));
  if (daily.length <= 31) return daily.map((d) => ({ label: fmtDay(d.day), value: d.value }));
  const byWeek = new Map<string, { sum: number; n: number }>();
  for (const d of daily) {
    const dt = new Date(`${d.day}T00:00:00Z`);
    dt.setUTCDate(dt.getUTCDate() - ((dt.getUTCDay() + 6) % 7));
    const k = dt.toISOString().slice(0, 10);
    const b = byWeek.get(k) ?? { sum: 0, n: 0 };
    b.sum += d.value;
    b.n += 1;
    byWeek.set(k, b);
  }
  return [...byWeek.entries()].map(([k, b]) => ({
    label: fmtDay(k),
    value: mode === 'avg' ? Math.round((b.sum / b.n) * 100) / 100 : b.sum,
  }));
}

type Json = any;
