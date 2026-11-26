import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { localDate, presetPeriod, type Period } from './period.ts';

export interface Filters {
  country?: string;
  platform?: string;
  language?: string;
  course?: string;
  plan?: string;
}

interface PanelState {
  period: Period;
  setPeriod: (p: Period) => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  /** Cambia con la actualización automática o con «Actualizar»: las páginas vuelven a pedir. */
  refreshKey: number;
  refresh: () => void;
  autoRefreshMs: number;
  setAutoRefreshMs: (ms: number) => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
}

const Ctx = createContext<PanelState | null>(null);

function readPref<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writePref(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sin storage: la preferencia dura lo que la pestaña.
  }
}

/** Los filtros como los espera la base (sin claves vacías). */
export function filtersArg(f: Filters): Record<string, string> {
  return Object.fromEntries(Object.entries(f).filter(([, v]) => typeof v === 'string' && v !== '')) as Record<
    string,
    string
  >;
}

export function PanelProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<Period>(() => presetPeriod('30d', localDate()));
  const [filters, setFilters] = useState<Filters>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [autoRefreshMs, setAutoRefreshMsState] = useState<number>(() => readPref('polygo-admin-refresh', 0));
  const [theme, setThemeState] = useState<'dark' | 'light'>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  );

  useEffect(() => {
    if (!autoRefreshMs) return;
    const id = window.setInterval(() => setRefreshKey((n) => n + 1), autoRefreshMs);
    return () => window.clearInterval(id);
  }, [autoRefreshMs]);

  const value = useMemo<PanelState>(
    () => ({
      period,
      setPeriod,
      filters,
      setFilters,
      refreshKey,
      refresh: () => setRefreshKey((n) => n + 1),
      autoRefreshMs,
      setAutoRefreshMs: (ms) => {
        setAutoRefreshMsState(ms);
        writePref('polygo-admin-refresh', ms);
      },
      theme,
      setTheme: (t) => {
        setThemeState(t);
        document.documentElement.dataset.theme = t;
        try {
          localStorage.setItem('polygo-admin-theme', t);
        } catch {
          // Ídem.
        }
      },
    }),
    [period, filters, refreshKey, autoRefreshMs, theme],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePanel(): PanelState {
  const v = useContext(Ctx);
  if (!v) throw new Error('PanelProvider falta');
  return v;
}
