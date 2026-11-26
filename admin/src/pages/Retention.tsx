import { useState } from 'react';

import { heatStyle } from '../components/charts.tsx';
import { DataTable } from '../components/DataTable.tsx';
import { Async, Card, Empty, Kpi, PageHead, Unavailable } from '../components/ui.tsx';
import { countryName, fmtDay, fmtDec, fmtInt, fmtPct, langName, platformName } from '../lib/format.ts';
import { useRpc } from '../lib/rpc.ts';
import { SectionTitle, usePeriodArgs, type Json } from './shared.tsx';

const DAYS = ['d1', 'd3', 'd7', 'd14', 'd30', 'd60', 'd90'] as const;
const SEGMENTS = [
  ['', 'Sin segmentar'],
  ['platform', 'Plataforma'],
  ['country', 'País'],
  ['language', 'Idioma'],
  ['course', 'Curso'],
  ['plan', 'Free / Plus'],
  ['played_ranked', 'Jugó Ranked'],
  ['first_lesson', 'Completó 1.ª lección'],
] as const;

function segLabel(seg: string, v: string): string {
  if (seg === 'platform') return platformName(v);
  if (seg === 'country') return countryName(v);
  if (seg === 'language') return langName(v);
  if (seg === 'plan') return v === 'plus' ? 'Plus' : 'Free';
  return v;
}

function RetCell({ r }: { r: Json }) {
  if (!r || r.eligible === 0) return <td className="cell muted">—</td>;
  const pct = r.pct === null ? null : Number(r.pct);
  return (
    <td className="cell" style={heatStyle(pct)} title={`${r.retained} de ${r.eligible}`}>
      {fmtPct(pct)}
    </td>
  );
}

export function Retention() {
  const { args, refreshKey } = usePeriodArgs();
  const [segment, setSegment] = useState('');
  const state = useRpc<Json>('admin_retention', { ...args, p_segment: segment || null }, refreshKey);
  return (
    <>
      <PageHead title="Retención y cohortes">
        Cohortes = usuarios registrados en el período, agrupados por semana de registro (lunes).
      </PageHead>
      <Async state={state} rows={6}>
        {(d) => {
          const g = d.engagement;
          return (
            <>
              <Card title="Cómo se calcula">
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  {d.definition} Ejemplo: D7 = de los registrados que ya cumplieron 7 días completos, cuántos estuvieron activos justo el día 7. «—» = todavía ningún usuario de la cohorte llegó a ese día.
                </p>
              </Card>
              <Card title="Retención general" sub="todas las cohortes del período">
                <table className="data cohort">
                  <thead>
                    <tr>
                      {DAYS.map((k) => (
                        <th key={k} className="num">
                          {k.toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {DAYS.map((k) => (
                        <RetCell key={k} r={d.overall?.[k]} />
                      ))}
                    </tr>
                  </tbody>
                </table>
              </Card>
              <Card title="Cohortes semanales" info="Cada fila es la semana de registro. El número sobre el mouse es retenidos / elegibles.">
                {d.cohorts.length ? (
                  <div className="table-wrap">
                    <table className="data cohort">
                      <thead>
                        <tr>
                          <th>Semana</th>
                          <th className="num">Usuarios</th>
                          {DAYS.map((k) => (
                            <th key={k} className="num">
                              {k.toUpperCase()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(d.cohorts as Json[]).map((c) => (
                          <tr key={c.cohort_week}>
                            <td>{fmtDay(c.cohort_week)}</td>
                            <td className="num">{fmtInt(c.size)}</td>
                            {DAYS.map((k) => (
                              <RetCell key={k} r={c.retention?.[k]} />
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Empty>Nadie se registró en el período.</Empty>
                )}
              </Card>
              <Card
                title="Por segmento"
                actions={
                  <select className="select" aria-label="Segmento" value={segment} onChange={(e) => setSegment(e.target.value)}>
                    {SEGMENTS.map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                }
              >
                {!segment ? (
                  <Empty>Elegí un segmento para comparar la retención.</Empty>
                ) : d.segments?.length ? (
                  <div className="table-wrap">
                    <table className="data cohort">
                      <thead>
                        <tr>
                          <th>Segmento</th>
                          <th className="num">Usuarios</th>
                          {DAYS.map((k) => (
                            <th key={k} className="num">
                              {k.toUpperCase()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(d.segments as Json[]).map((s) => (
                          <tr key={s.segment}>
                            <td>{segLabel(segment, s.segment)}</td>
                            <td className="num">{fmtInt(s.size)}</td>
                            {DAYS.map((k) => (
                              <RetCell key={k} r={s.retention?.[k]} />
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Empty>Sin cohortes en el período.</Empty>
                )}
              </Card>
              <SectionTitle>Uso en el período (todos los usuarios, no sólo cohortes)</SectionTitle>
              <div className="grid kpis">
                <Kpi metric="active_users" value={g.active_users} />
                <Kpi label="Días activos por usuario" value={g.avg_active_days} format={(v) => fmtDec(v, 2)} formula="Promedio de días con actividad entre los usuarios activos del período." />
                <Kpi metric="sessions_per_learner" value={g.sessions_per_user} format={(v) => fmtDec(v, 2)} />
                <Kpi label="Días entre actividades" value={g.avg_days_between_activity} format={(v) => fmtDec(v, 2)} formula="Promedio de la distancia en días entre dos días activos consecutivos del mismo usuario." />
                <Kpi label="Sólo aprenden" value={g.learn_only} />
                <Kpi label="Sólo juegan" value={g.play_only} />
                <Kpi label="Aprenden y juegan" value={g.learn_and_play} />
                <Kpi label="Dejaron de aprender" value={g.stopped_learning} formula="Aprendieron en los 30 días previos al período y no en el período." />
                <Kpi label="Dejaron de jugar" value={g.stopped_playing} formula="Jugaron en los 30 días previos al período y no en el período." />
              </div>
              <Card title="Frecuencia de uso y Plus" info="Usuarios activos del período agrupados por días activos; % con Plus vigente en cada grupo.">
                <DataTable
                  rows={g.frequency}
                  columns={[
                    { key: 'bucket', label: 'Días activos', sortable: false },
                    { key: 'users', label: 'Usuarios', num: true },
                    { key: 'plus_pct', label: '% con Plus', num: true, render: (r) => fmtPct(r.plus_pct) },
                  ]}
                />
              </Card>
              <Unavailable items={d.unavailable} />
            </>
          );
        }}
      </Async>
    </>
  );
}
