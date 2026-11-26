import { useState, type ReactNode } from 'react';

import type { AdminSession } from '../auth/AuthGate.tsx';
import { usePanel, type Filters } from '../lib/context.tsx';
import { countryName, fmtDay, langName, platformName } from '../lib/format.ts';
import { PRESETS, presetPeriod, validCustom, type PresetId } from '../lib/period.ts';
import { useRpc } from '../lib/rpc.ts';
import { navigate, SECTIONS, type Route, type SectionId } from '../lib/router.ts';

/** Qué controles usa cada módulo (los que no filtran no los muestran, para no confundir). */
const CONTROLS: Record<SectionId, { period: boolean; filters: boolean }> = {
  overview: { period: true, filters: true },
  users: { period: false, filters: true },
  growth: { period: true, filters: true },
  learning: { period: true, filters: true },
  ranked: { period: true, filters: true },
  retention: { period: true, filters: true },
  social: { period: true, filters: true },
  monetization: { period: true, filters: true },
  marketing: { period: true, filters: false },
  notifications: { period: true, filters: true },
  health: { period: false, filters: false },
  content: { period: false, filters: false },
  admin: { period: false, filters: false },
};

interface FilterOptions {
  countries: string[];
  languages: { code: string; name: string }[];
  courses: { code: string; target: string; source: string }[];
  platforms: string[];
  levels: string[];
}

export function Layout({
  route,
  session,
  crumb,
  children,
}: {
  route: Route;
  session: AdminSession;
  crumb?: string;
  children: ReactNode;
}) {
  const section = SECTIONS.find((s) => s.id === route.section)!;
  const ctl = CONTROLS[route.section];
  const { theme, setTheme } = usePanel();
  const [confirmGlobal, setConfirmGlobal] = useState(false);

  return (
    <div className="app">
      <aside className="sidebar" aria-label="Módulos">
        <div className="brand">
          <span className="brand-mark">P</span>
          <span>
            PolyGo
            <small>Superadmin</small>
          </span>
        </div>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className="nav-item"
            aria-current={s.id === route.section ? 'page' : undefined}
            onClick={() => navigate(s.id)}
          >
            <span className="nav-icon" aria-hidden>
              {s.icon}
            </span>
            {s.label}
          </button>
        ))}
        <div className="sidebar-foot">
          <div>
            Sesión: <b style={{ color: 'var(--text-primary)' }}>{session.username}</b> · MFA ✓
          </div>
          <button className="btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀ Tema claro' : '☾ Tema oscuro'}
          </button>
          <button className="btn" onClick={() => void session.signOut('local')}>
            Cerrar sesión
          </button>
          {confirmGlobal ? (
            <div style={{ display: 'grid', gap: 6 }}>
              <span>Cierra también la sesión de la app en tus teléfonos.</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-danger" onClick={() => void session.signOut('global')}>
                  Confirmar
                </button>
                <button className="btn" onClick={() => setConfirmGlobal(false)}>
                  No
                </button>
              </div>
            </div>
          ) : (
            <button className="btn btn-ghost btn-danger" onClick={() => setConfirmGlobal(true)}>
              Cerrar todas las sesiones…
            </button>
          )}
          <span>Hora de Buenos Aires · sólo local</span>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <nav className="crumbs" aria-label="Ruta">
            <button onClick={() => navigate('overview')}>PolyGo</button>
            <span>/</span>
            {crumb ? (
              <>
                <button onClick={() => navigate(section.id)}>{section.label}</button>
                <span>/</span>
                <b>{crumb}</b>
              </>
            ) : (
              <b>{section.label}</b>
            )}
          </nav>
          {ctl.period && <PeriodControl />}
          <RefreshControl />
        </header>
        <main className="content">
          {ctl.filters && <FilterBar showCourse={route.section !== 'learning' && route.section !== 'ranked'} />}
          {children}
        </main>
      </div>
    </div>
  );
}

function PeriodControl() {
  const { period, setPeriod } = usePanel();
  const [from, setFrom] = useState(period.from);
  const [to, setTo] = useState(period.to);
  const custom = period.preset === 'custom';
  return (
    <div className="controls">
      <select
        className="select"
        aria-label="Período"
        value={period.preset}
        onChange={(e) => {
          const id = e.target.value as PresetId;
          if (id === 'custom') setPeriod({ ...period, preset: 'custom' });
          else {
            const p = presetPeriod(id);
            setPeriod(p);
            setFrom(p.from);
            setTo(p.to);
          }
        }}
      >
        {PRESETS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
        <option value="custom">Personalizado…</option>
      </select>
      {custom ? (
        <>
          <input className="select" type="date" aria-label="Desde" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input className="select" type="date" aria-label="Hasta" value={to} onChange={(e) => setTo(e.target.value)} />
          <button
            className="btn"
            disabled={!validCustom(from, to)}
            title={validCustom(from, to) ? undefined : 'Desde ≤ hasta, máximo 2 años'}
            onClick={() => setPeriod({ preset: 'custom', from, to })}
          >
            Aplicar
          </button>
        </>
      ) : (
        <span className="muted" style={{ fontSize: 12 }}>
          {period.from === period.to ? fmtDay(period.from) : `${fmtDay(period.from)} – ${fmtDay(period.to)}`}
        </span>
      )}
    </div>
  );
}

function RefreshControl() {
  const { refresh, autoRefreshMs, setAutoRefreshMs } = usePanel();
  return (
    <div className="controls">
      <select
        className="select"
        aria-label="Actualización automática"
        value={autoRefreshMs}
        onChange={(e) => setAutoRefreshMs(Number(e.target.value))}
      >
        <option value={0}>Auto: no</option>
        <option value={60_000}>Auto: 1 min</option>
        <option value={300_000}>Auto: 5 min</option>
        <option value={900_000}>Auto: 15 min</option>
      </select>
      <button className="btn" onClick={refresh} title="Volver a consultar">
        ↻ Actualizar
      </button>
    </div>
  );
}

function FilterBar({ showCourse }: { showCourse: boolean }) {
  const { filters, setFilters, refreshKey } = usePanel();
  const opts = useRpc<FilterOptions>('admin_filter_options', {}, refreshKey);
  const set = (k: keyof Filters, v: string) => setFilters({ ...filters, [k]: v || undefined });
  const active = Object.values(filters).filter(Boolean).length;
  const o = opts.data;
  return (
    <div className="filters-row" aria-label="Filtros">
      <span className="muted" style={{ fontSize: 12 }}>
        Filtros
      </span>
      <select className="select" aria-label="País" value={filters.country ?? ''} onChange={(e) => set('country', e.target.value)}>
        <option value="">Todos los países</option>
        {o?.countries.map((c) => (
          <option key={c} value={c}>
            {countryName(c)}
          </option>
        ))}
      </select>
      <select className="select" aria-label="Plataforma" value={filters.platform ?? ''} onChange={(e) => set('platform', e.target.value)}>
        <option value="">Todas las plataformas</option>
        {o?.platforms.map((p) => (
          <option key={p} value={p}>
            {platformName(p)}
          </option>
        ))}
      </select>
      <select className="select" aria-label="Idioma objetivo" value={filters.language ?? ''} onChange={(e) => set('language', e.target.value)}>
        <option value="">Todos los idiomas</option>
        {o?.languages.map((l) => (
          <option key={l.code} value={l.code}>
            {langName(l.code)}
          </option>
        ))}
      </select>
      {showCourse && (
        <select className="select" aria-label="Curso" value={filters.course ?? ''} onChange={(e) => set('course', e.target.value)}>
          <option value="">Todos los cursos</option>
          {o?.courses.map((c) => (
            <option key={c.code} value={c.code}>
              {langName(c.target)} desde {langName(c.source)}
            </option>
          ))}
        </select>
      )}
      <select className="select" aria-label="Tipo de usuario" value={filters.plan ?? ''} onChange={(e) => set('plan', e.target.value)}>
        <option value="">Free y Plus</option>
        <option value="free">Sólo Free</option>
        <option value="plus">Sólo Plus</option>
      </select>
      {active > 0 && (
        <button className="btn btn-ghost" onClick={() => setFilters({})}>
          Limpiar ({active})
        </button>
      )}
      <span className="chip">Sin cuentas internas</span>
    </div>
  );
}
