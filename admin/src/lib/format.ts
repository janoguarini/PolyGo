import { TIME_ZONE } from './period.ts';

const nf = new Intl.NumberFormat('es-AR');
const nf1 = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 });

export const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** Los números de Postgres llegan como number o como string (numeric). */
export function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

export function fmtInt(v: unknown): string {
  const n = num(v);
  return n === null ? '—' : nf.format(Math.round(n));
}

export function fmtDec(v: unknown, digits: 1 | 2 = 1): string {
  const n = num(v);
  return n === null ? '—' : (digits === 1 ? nf1 : nf2).format(n);
}

export function fmtPct(v: unknown): string {
  const n = num(v);
  return n === null ? '—' : `${nf1.format(n)} %`;
}

export function fmtSeconds(v: unknown): string {
  const n = num(v);
  if (n === null) return '—';
  if (n < 60) return `${Math.round(n)} s`;
  const m = Math.floor(n / 60);
  const s = Math.round(n % 60);
  if (m < 60) return s ? `${m} min ${s} s` : `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

export function fmtMs(v: unknown): string {
  const n = num(v);
  return n === null ? '—' : n < 1000 ? `${Math.round(n)} ms` : `${nf1.format(n / 1000)} s`;
}

export function fmtBytes(v: unknown): string {
  const n = num(v);
  if (n === null) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let x = n;
  while (x >= 1024 && i < units.length - 1) {
    x /= 1024;
    i++;
  }
  return `${nf1.format(x)} ${units[i]}`;
}

export function fmtDateTime(v: unknown): string {
  if (typeof v !== 'string' || !v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: TIME_ZONE,
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d);
}

export function fmtDay(v: unknown): string {
  if (typeof v !== 'string' || !v) return '—';
  if (/^\d{4}-\d{2}$/.test(v)) {
    const [y, m] = v.split('-');
    return new Intl.DateTimeFormat('es-AR', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(Date.UTC(Number(y), Number(m) - 1, 1)),
    );
  }
  const d = new Date(`${v.slice(0, 10)}T00:00:00Z`);
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', timeZone: 'UTC' }).format(d);
}

/** Variación porcentual contra el período anterior (null si el anterior es 0 o falta). */
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
export const langName = (code: unknown): string =>
  typeof code === 'string' ? (LANG[code] ?? (code === '??' ? 'Sin dato' : code)) : '—';

export const countryName = (code: unknown): string => {
  if (typeof code !== 'string' || code === '??' || !code) return 'Sin país';
  try {
    return new Intl.DisplayNames(['es'], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
};

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
export const tierName = (id: unknown): string => (typeof id === 'string' ? (TIER[id] ?? id) : '—');

export const platformName = (p: unknown): string =>
  p === 'ios' ? 'iOS' : p === 'android' ? 'Android' : p === 'unknown' ? 'Sin dato' : String(p ?? '—');
