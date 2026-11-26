import { useId, useState, type ReactNode } from 'react';

import { deltaPct, fmtInt } from '../lib/format.ts';
import { M, type MetricKey } from '../lib/metrics.ts';
import type { RpcError } from '../lib/rpc.ts';

export function Card({
  title,
  sub,
  info,
  actions,
  children,
}: {
  title?: ReactNode;
  sub?: ReactNode;
  info?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="card">
      {(title || actions) && (
        <div className="card-head">
          {title && <h2>{title}</h2>}
          {info && <Info text={info} />}
          {sub && <span className="sub">{sub}</span>}
          {actions && <div className="actions">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/** «?» con la definición del indicador (hover o foco de teclado). */
export function Info({ title, text }: { title?: string; text: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="info" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="info-btn"
        aria-label="Cómo se calcula"
        aria-describedby={open ? id : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        ?
      </button>
      {open && (
        <span role="tooltip" id={id} className="info-pop">
          {title && <b>{title}</b>}
          {text}
        </span>
      )}
    </span>
  );
}

export function Kpi({
  metric,
  label,
  formula,
  value,
  previous,
  format = fmtInt,
  invert = false,
  unavailable,
  foot,
}: {
  metric?: MetricKey;
  label?: string;
  formula?: string;
  value: unknown;
  previous?: unknown;
  format?: (v: unknown) => string;
  /** true: que baje es bueno (p. ej. abandonos). */
  invert?: boolean;
  /** Motivo por el que no hay dato (se muestra «Sin datos»). */
  unavailable?: string;
  foot?: ReactNode;
}) {
  const def = metric ? M[metric] : null;
  const name = label ?? def?.label ?? '';
  const text = formula ?? def?.formula;
  const noData = unavailable !== undefined || value === null || value === undefined;
  const d = previous === undefined || noData ? null : deltaPct(value, previous);
  const good = d === null ? null : invert ? d < 0 : d > 0;
  return (
    <div className="card kpi">
      <div className="kpi-label">
        {name}
        {(text || unavailable) && <Info title={name} text={unavailable ? `Sin datos: ${unavailable}` : (text ?? '')} />}
      </div>
      {noData ? (
        <div className="kpi-value nodata">Sin datos</div>
      ) : (
        <div className="kpi-value">{format(value)}</div>
      )}
      <div className="kpi-foot">
        {previous !== undefined && !noData && (
          <>
            {d === null ? (
              <span>anterior: {format(previous)}</span>
            ) : (
              <>
                <span className={d === 0 ? '' : good ? 'delta-up' : 'delta-down'}>
                  {d > 0 ? '▲' : d < 0 ? '▼' : '■'} {Math.abs(d).toLocaleString('es-AR')} %
                </span>
                <span>vs {format(previous)}</span>
              </>
            )}
          </>
        )}
        {foot}
      </div>
    </div>
  );
}

export function Loading({ rows = 3 }: { rows?: number }) {
  return (
    <div style={{ display: 'grid', gap: 10, padding: '8px 0' }} aria-busy="true" aria-label="Cargando">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton" style={{ width: `${90 - i * 15}%` }} />
      ))}
    </div>
  );
}

export function ErrorBox({ error, onRetry }: { error: RpcError; onRetry?: () => void }) {
  return (
    <div className="state state-error" role="alert">
      <div>No se pudo cargar: {error.denied ? 'acceso denegado por la base.' : error.message}</div>
      {onRetry && !error.denied && (
        <button className="btn" style={{ marginTop: 10 }} onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function Empty({ children = 'Sin datos en el período.' }: { children?: ReactNode }) {
  return <div className="state">{children}</div>;
}

/** Wrapper para el estado de una RPC: carga, error o contenido. */
export function Async<T>({
  state,
  children,
  rows,
}: {
  state: { data: T | null; error: RpcError | null; loading: boolean; reload: () => void };
  children: (data: T) => ReactNode;
  rows?: number;
}) {
  if (state.error && !state.data) return <ErrorBox error={state.error} onRetry={state.reload} />;
  if (!state.data) return <Loading rows={rows} />;
  return <>{children(state.data)}</>;
}

/** Lo que falta medir y por qué (los textos vienen de la base: `unavailable`). */
export function Unavailable({ items }: { items: Record<string, string> | null | undefined }) {
  const entries = Object.entries(items ?? {});
  if (!entries.length) return null;
  return (
    <Card title="Sin datos todavía" sub="métricas pedidas que hoy no tienen una fuente confiable">
      <ul className="unavailable" style={{ margin: 0, paddingLeft: 18 }}>
        {entries.map(([k, v]) => (
          <li key={k}>
            <b>{UNAVAILABLE_LABELS[k] ?? k}:</b> {v}
          </li>
        ))}
      </ul>
    </Card>
  );
}

const UNAVAILABLE_LABELS: Record<string, string> = {
  realtime_users: 'Usuarios en tiempo real',
  session_duration_app: 'Duración de sesión de la app',
  lessons_started: 'Lecciones iniciadas / abandono',
  mrr: 'MRR',
  arr: 'ARR',
  ads_revenue: 'Ingresos publicitarios',
  ads: 'AdMob',
  crashes: 'Crashes',
  acquisition_source: 'Fuente de adquisición',
  country_geoip: 'País real',
  recurrent_errors: 'Errores recurrentes',
  matchmaking_time: 'Tiempo de matchmaking',
  no_opponent: 'Partidas sin oponente',
  disconnects: 'Desconexiones',
  question_reports: 'Preguntas reportadas',
  answer_time: 'Tiempo de respuesta en Ranked',
  feed: 'Feed',
  invitations: 'Invitaciones',
  revenue: 'Ingresos',
  refunds: 'Reembolsos',
  arpu: 'ARPU / ARPPU',
  ltv: 'LTV',
  paywall_funnel: 'Embudo del paywall',
  infra_costs: 'Costos de infraestructura',
  installs: 'Instalaciones',
  campaigns: 'Campañas',
  influencers: 'Influencers',
  clicks: 'Clics',
  spend: 'Inversión / ROI',
  sent: 'Enviadas',
  delivered_opened: 'Entregadas / abiertas / CTR',
  invalid_tokens: 'Tokens inválidos',
  return_after_push: 'Retorno tras notificación',
  auth_errors: 'Errores de login/registro',
  edge_function_errors: 'Errores de Edge Functions',
  api_latency: 'Latencia P50/P95/P99',
  battle_server: 'Servidor de partidas',
  egress_storage_costs: 'Egress, storage y costos',
  content_error_reports: 'Errores de contenido reportados',
};

export function Alerts({
  alerts,
}: {
  alerts: { key: string; level: 'critical' | 'warning' | 'info'; title: string; detail: string; value: unknown }[];
}) {
  if (!alerts.length)
    return <Empty>Sin alertas con los datos disponibles. Crashes, login y conversión llegan con la Etapa B.</Empty>;
  const icon = { critical: '!', warning: '▲', info: 'i' };
  const word = { critical: 'Crítico', warning: 'Atención', info: 'Info' };
  return (
    <div className="grid">
      {alerts.map((a) => (
        <div key={a.key} className={`alert ${a.level}`}>
          <span className="alert-icon" aria-hidden>
            {icon[a.level]}
          </span>
          <div>
            <div className="alert-title">
              {word[a.level]} · {a.title}
            </div>
            <div className="alert-detail">{a.detail}</div>
          </div>
          <span className="tnum">{String(a.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function PageHead({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="page-head">
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  );
}
