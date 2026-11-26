import { useEffect, useRef, useState, type ReactNode } from 'react';

import { fmtDay, fmtInt, num } from '../lib/format.ts';
import { DataTable } from './DataTable.tsx';
import { Empty } from './ui.tsx';

// Gráficos SVG propios (sin librería): líneas de 2 px, barras con extremo redondeado de 4 px y
// separación de 2 px, grilla tenue, leyenda con ≥ 2 series, tooltip al pasar el mouse y vista de
// tabla en cada gráfico. Los colores de serie siguen un orden fijo (--series-1…6).

export interface Series {
  key: string;
  label: string;
}

const seriesColor = (i: number) => `var(--series-${(i % 6) + 1})`;

function useWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cw = entries[0]?.contentRect.width;
      if (cw) setW(Math.max(240, Math.floor(cw)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/** Máximo «redondo» y marcas del eje Y. */
function niceTicks(max: number, count = 4): number[] {
  if (!(max > 0)) return [0, 1];
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(Math.round(v * 1000) / 1000);
  return ticks;
}

function compact(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toLocaleString('es-AR', { maximumFractionDigits: 1 })} M`;
  if (Math.abs(v) >= 1000) return `${(v / 1000).toLocaleString('es-AR', { maximumFractionDigits: 1 })} k`;
  return v.toLocaleString('es-AR', { maximumFractionDigits: 2 });
}

function TableToggle({
  showTable,
  setShowTable,
}: {
  showTable: boolean;
  setShowTable: (v: boolean) => void;
}) {
  return (
    <div className="seg" role="group" aria-label="Vista">
      <button aria-pressed={!showTable} onClick={() => setShowTable(false)}>
        Gráfico
      </button>
      <button aria-pressed={showTable} onClick={() => setShowTable(true)}>
        Tabla
      </button>
    </div>
  );
}

export function ChartHeader({ children, toggle }: { children?: ReactNode; toggle: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      {toggle}
    </div>
  );
}

export function LineChart({
  data,
  series,
  xKey = 'day',
  height = 220,
  xFormat = (v) => fmtDay(v),
  yFormat = (v) => fmtInt(v),
  area = series.length === 1,
  csvName,
}: {
  data: Record<string, unknown>[];
  series: Series[];
  xKey?: string;
  height?: number;
  xFormat?: (v: unknown) => string;
  yFormat?: (v: unknown) => string;
  area?: boolean;
  csvName?: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const toggle = <TableToggle showTable={showTable} setShowTable={setShowTable} />;
  const legend =
    series.length >= 2 ? (
      <div className="legend">
        {series.map((s, i) => (
          <span key={s.key}>
            <i className="swatch" style={{ background: seriesColor(i) }} />
            {s.label}
          </span>
        ))}
      </div>
    ) : null;

  if (!data.length) return <Empty />;
  if (showTable)
    return (
      <div>
        <ChartHeader toggle={toggle}>{legend}</ChartHeader>
        <DataTable
          csvName={csvName}
          rows={data}
          columns={[
            { key: xKey, label: 'Fecha', render: (r) => xFormat(r[xKey]), value: (r) => r[xKey] },
            ...series.map((s) => ({ key: s.key, label: s.label, num: true, render: (r: Record<string, unknown>) => yFormat(r[s.key]) })),
          ]}
        />
      </div>
    );

  const m = { l: 44, r: 12, t: 10, b: 26 };
  const iw = width - m.l - m.r;
  const ih = height - m.t - m.b;
  const max = Math.max(0, ...data.flatMap((d) => series.map((s) => num(d[s.key]) ?? 0)));
  const ticks = niceTicks(max);
  const top = ticks[ticks.length - 1] || 1;
  const step = data.length > 1 ? iw / (data.length - 1) : 0;
  const x = (i: number) => m.l + (data.length > 1 ? i * step : iw / 2);
  const y = (v: number) => m.t + ih - (v / top) * ih;
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(iw / 70))));

  const pathFor = (key: string) => {
    let d = '';
    let pen = false;
    data.forEach((row, i) => {
      const v = num(row[key]);
      if (v === null) {
        pen = false;
        return;
      }
      d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      pen = true;
    });
    return d;
  };

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
    const px = e.clientX - rect.left;
    const i = data.length > 1 ? Math.round((px - m.l) / step) : 0;
    setHover(Math.min(data.length - 1, Math.max(0, i)));
  };

  const hv = hover !== null ? data[hover] : null;
  const tipLeft = hover !== null ? Math.min(x(hover) + 12, width - 170) : 0;

  return (
    <div>
      <ChartHeader toggle={toggle}>{legend}</ChartHeader>
      <div className="chart" ref={ref}>
        <svg width={width} height={height} role="img" aria-label={series.map((s) => s.label).join(', ')}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} stroke="var(--grid)" strokeWidth={1} />
              <text x={m.l - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--text-muted)">
                {compact(t)}
              </text>
            </g>
          ))}
          <line x1={m.l} x2={width - m.r} y1={y(0)} y2={y(0)} stroke="var(--axis)" strokeWidth={1} />
          {data.map((row, i) =>
            i % labelEvery === 0 ? (
              <text key={i} x={x(i)} y={height - 8} textAnchor="middle" fontSize={11} fill="var(--text-muted)">
                {xFormat(row[xKey])}
              </text>
            ) : null,
          )}
          {area &&
            series.slice(0, 1).map((s) => {
              const line = pathFor(s.key);
              if (!line || data.length < 2) return null;
              return (
                <path
                  key={`a-${s.key}`}
                  d={`${line}L${x(data.length - 1)},${y(0)}L${x(0)},${y(0)}Z`}
                  fill={seriesColor(0)}
                  opacity={0.12}
                />
              );
            })}
          {series.map((s, i) => (
            <path
              key={s.key}
              d={pathFor(s.key)}
              fill="none"
              stroke={seriesColor(i)}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {data.length === 1 &&
            series.map((s, i) => {
              const v = num(data[0]?.[s.key]);
              return v === null ? null : (
                <circle key={s.key} cx={x(0)} cy={y(v)} r={4} fill={seriesColor(i)} stroke="var(--surface-1)" strokeWidth={2} />
              );
            })}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={m.t} y2={m.t + ih} stroke="var(--axis)" strokeWidth={1} />
              {series.map((s, i) => {
                const v = num(hv?.[s.key]);
                return v === null ? null : (
                  <circle
                    key={s.key}
                    cx={x(hover)}
                    cy={y(v)}
                    r={4}
                    fill={seriesColor(i)}
                    stroke="var(--surface-1)"
                    strokeWidth={2}
                  />
                );
              })}
            </g>
          )}
          <rect
            x={m.l - 6}
            y={m.t}
            width={iw + 12}
            height={ih}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          />
        </svg>
        {hv && (
          <div className="tip" style={{ left: tipLeft, top: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{xFormat(hv[xKey])}</div>
            {series.map((s, i) => (
              <div className="tip-row" key={s.key}>
                <span>
                  <i className="swatch" style={{ background: seriesColor(i) }} />
                  {s.label}
                </span>
                <b className="tnum">{yFormat(hv[s.key])}</b>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Barras verticales de una serie (categorías ordenadas: horas, días de la semana, ligas…). */
export function BarChart({
  data,
  label,
  height = 200,
  yFormat = (v) => fmtInt(v),
  csvName,
}: {
  data: { label: string; value: number | null; hint?: string }[];
  label: string;
  height?: number;
  yFormat?: (v: unknown) => string;
  csvName?: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const toggle = <TableToggle showTable={showTable} setShowTable={setShowTable} />;

  if (!data.length) return <Empty />;
  if (showTable)
    return (
      <div>
        <ChartHeader toggle={toggle} />
        <DataTable
          csvName={csvName}
          rows={data as unknown as Record<string, unknown>[]}
          columns={[
            { key: 'label', label: 'Categoría' },
            { key: 'value', label, num: true, render: (r) => yFormat(r.value) },
          ]}
        />
      </div>
    );

  const m = { l: 44, r: 8, t: 10, b: 26 };
  const iw = width - m.l - m.r;
  const ih = height - m.t - m.b;
  const max = Math.max(0, ...data.map((d) => d.value ?? 0));
  const ticks = niceTicks(max);
  const top = ticks[ticks.length - 1] || 1;
  const band = iw / data.length;
  const gap = Math.max(2, band * 0.2);
  const bw = Math.max(2, band - gap);
  const y = (v: number) => m.t + ih - (v / top) * ih;
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(iw / 44))));
  const r = Math.min(4, bw / 2);

  return (
    <div>
      <ChartHeader toggle={toggle} />
      <div className="chart" ref={ref}>
        <svg width={width} height={height} role="img" aria-label={label}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} stroke="var(--grid)" />
              <text x={m.l - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--text-muted)">
                {compact(t)}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const v = d.value ?? 0;
            const x0 = m.l + i * band + gap / 2;
            const y0 = y(v);
            const h = m.t + ih - y0;
            return (
              <g key={i}>
                {h > 0 && (
                  <path
                    d={
                      h > r
                        ? `M${x0},${m.t + ih}V${y0 + r}Q${x0},${y0} ${x0 + r},${y0}H${x0 + bw - r}Q${x0 + bw},${y0} ${x0 + bw},${y0 + r}V${m.t + ih}Z`
                        : `M${x0},${m.t + ih}V${y0}H${x0 + bw}V${m.t + ih}Z`
                    }
                    fill="var(--series-1)"
                    opacity={hover === null || hover === i ? 1 : 0.55}
                  />
                )}
                {i % labelEvery === 0 && (
                  <text
                    x={x0 + bw / 2}
                    y={height - 8}
                    textAnchor="middle"
                    fontSize={11}
                    fill="var(--text-muted)"
                  >
                    {d.label}
                  </text>
                )}
                <rect
                  x={m.l + i * band}
                  y={m.t}
                  width={band}
                  height={ih}
                  fill="transparent"
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                />
              </g>
            );
          })}
          <line x1={m.l} x2={width - m.r} y1={y(0)} y2={y(0)} stroke="var(--axis)" />
        </svg>
        {hover !== null && data[hover] && (
          <div
            className="tip"
            style={{ left: Math.min(m.l + hover * band + band / 2 + 8, width - 160), top: 8 }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{data[hover].hint ?? data[hover].label}</div>
            <div className="tip-row">
              <span>{label}</span>
              <b className="tnum">{yFormat(data[hover].value)}</b>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Distribución con etiqueta directa (país, plataforma, curso…). */
export function HBars({
  items,
  format = (v) => fmtInt(v),
  max: maxItems = 10,
  showShare = true,
}: {
  items: { key: string; label: string; value: number }[];
  format?: (v: unknown) => string;
  max?: number;
  showShare?: boolean;
}) {
  if (!items.length) return <Empty />;
  const total = items.reduce((a, b) => a + b.value, 0);
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const shown = sorted.slice(0, maxItems);
  const rest = sorted.slice(maxItems);
  if (rest.length) shown.push({ key: '__other', label: `Otros (${rest.length})`, value: rest.reduce((a, b) => a + b.value, 0) });
  const max = Math.max(...shown.map((i) => i.value), 1);
  return (
    <div className="hbars">
      {shown.map((i) => (
        <div className="hbar" key={i.key} title={`${i.label}: ${format(i.value)}`}>
          <span className="hbar-label">{i.label}</span>
          <span className="hbar-track">
            <span className="hbar-fill" style={{ width: `${(i.value / max) * 100}%`, display: 'block' }} />
          </span>
          <span className="hbar-val">
            {format(i.value)}
            {showShare && total > 0 && (
              <span className="muted"> · {Math.round((i.value / total) * 100)} %</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Celda de intensidad (rampa de un solo tono: el violeta de marca sobre la superficie). */
export function heatStyle(pct: number | null): React.CSSProperties {
  if (pct === null) return { color: 'var(--text-muted)' };
  const a = Math.max(0.06, Math.min(1, pct / 100));
  return {
    background: `color-mix(in srgb, var(--brand) ${Math.round(a * 85)}%, var(--surface-2))`,
    color: a > 0.5 ? '#fff' : 'var(--text-primary)',
  };
}
