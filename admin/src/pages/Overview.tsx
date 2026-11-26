import { HBars, LineChart } from '../components/charts.tsx';
import { Alerts, Async, Card, Kpi, PageHead, Unavailable } from '../components/ui.tsx';
import { fmtDay, fmtInt, fmtDec, fmtSeconds, fmtPct, deltaPct } from '../lib/format.ts';
import { aggregate } from '../lib/period.ts';
import { useRpc } from '../lib/rpc.ts';
import { GrainToggle, SectionTitle, useGrain, usePeriodArgs, type Json } from './shared.tsx';

export function Overview() {
  const { args, refreshKey } = usePeriodArgs();
  const state = useRpc<Json>('admin_overview', args, refreshKey);
  const [grain, setGrain] = useGrain();

  return (
    <>
      <PageHead title="Overview">
        Foto de hoy y el período elegido contra el período anterior de igual largo. Sólo usuarios reales.
      </PageHead>
      <Async state={state} rows={6}>
        {(d) => {
          const s = d.snapshot;
          const c = d.current;
          const p = d.previous;
          const series = d.series as Json[];
          const agg = aggregate(series, grain, {
            signups: 'sum',
            active: 'avg',
            lessons: 'sum',
            reviews: 'sum',
            battles: 'sum',
          });
          const growth = deltaPct(c.total_users_end, p.total_users_end);
          return (
            <>
              <SectionTitle>Usuarios</SectionTitle>
              <div className="grid kpis">
                <Kpi metric="total_users" value={s.total_users} foot={growth !== null ? <span>crecimiento {fmtPct(growth)} vs fin del período anterior</span> : undefined} />
                <Kpi metric="new_today" value={s.new_today} />
                <Kpi metric="new_7d" value={s.new_7d} />
                <Kpi metric="new_30d" value={s.new_30d} />
                <Kpi metric="dau" value={s.dau} />
                <Kpi metric="wau" value={s.wau} />
                <Kpi metric="mau" value={s.mau} />
                <Kpi metric="seen_today" value={s.seen_today} />
                <Kpi metric="free_users" value={s.free_users} />
                <Kpi metric="plus_users" value={s.plus_users} />
                <Kpi metric="reactivated" value={s.reactivated} />
                <Kpi metric="inactive_30d" value={s.inactive_30d} />
                <Kpi label="Usuarios en tiempo real" value={null} unavailable={d.unavailable.realtime_users} />
              </div>

              <SectionTitle>Actividad del período</SectionTitle>
              <div className="grid kpis">
                <Kpi metric="signups" value={c.signups} previous={p.signups} />
                <Kpi metric="active_users" value={c.active_users} previous={p.active_users} />
                <Kpi metric="avg_daily_active" value={c.avg_daily_active} previous={p.avg_daily_active} format={(v) => fmtDec(v, 2)} />
                <Kpi metric="sessions" value={c.sessions} previous={p.sessions} />
                <Kpi metric="sessions_per_learner" value={c.sessions_per_learner} previous={p.sessions_per_learner} format={(v) => fmtDec(v, 2)} />
                <Kpi metric="avg_session_seconds" value={c.avg_session_seconds} previous={p.avg_session_seconds} format={fmtSeconds} />
                <Kpi label="Lecciones iniciadas" value={null} unavailable={d.unavailable.lessons_started} />
                <Kpi metric="lessons_completed" value={c.lessons_completed} previous={p.lessons_completed} />
                <Kpi metric="reviews_completed" value={c.reviews_completed} previous={p.reviews_completed} />
                <Kpi metric="exercises_answered" value={c.exercises_answered} previous={p.exercises_answered} />
                <Kpi metric="battles" value={c.battles} previous={p.battles} />
                <Kpi metric="battles_completed" value={c.battles_completed} previous={p.battles_completed} />
                <Kpi metric="battles_forfeited" value={c.battles_forfeited} previous={p.battles_forfeited} invert />
              </div>

              <SectionTitle>Negocio</SectionTitle>
              <div className="grid kpis">
                <Kpi metric="paid_plus_users" value={s.paid_plus_users} />
                <Kpi metric="paid_subs_started" value={c.paid_subs_started} previous={p.paid_subs_started} />
                <Kpi label="MRR" value={null} unavailable={d.unavailable.mrr} />
                <Kpi label="ARR" value={null} unavailable={d.unavailable.mrr} />
                <Kpi label="Ingresos por suscripciones" value={null} unavailable={d.unavailable.mrr} />
                <Kpi label="Ingresos publicitarios" value={null} unavailable={d.unavailable.ads_revenue} />
              </div>

              <div className="grid cols-2">
                <Card
                  title="Usuarios"
                  info="Registros (suma del bucket) y usuarios activos (promedio diario dentro del bucket: los activos no se suman entre días)."
                  actions={<GrainToggle grain={grain} setGrain={setGrain} />}
                >
                  <LineChart
                    data={agg}
                    series={[
                      { key: 'active', label: grain === 'day' ? 'Activos' : 'Activos (prom. diario)' },
                      { key: 'signups', label: 'Registros' },
                    ]}
                    yFormat={(v) => fmtDec(v, 2)}
                    csvName="overview-usuarios"
                  />
                </Card>
                <Card title="Actividad" sub={grain === 'day' ? 'por día' : grain === 'week' ? 'por semana' : 'por mes'}>
                  <LineChart
                    data={agg}
                    series={[
                      { key: 'lessons', label: 'Lecciones' },
                      { key: 'reviews', label: 'Repasos' },
                      { key: 'battles', label: 'Partidas' },
                    ]}
                    csvName="overview-actividad"
                  />
                </Card>
              </div>

              <div className="grid cols-2">
                <Card title="Alertas" sub="reglas sobre datos reales; se recalculan en cada consulta">
                  <Alerts alerts={d.alerts} />
                </Card>
                <Card title="Comparación de período" sub={`${fmtDay(d.range.from)}–${fmtDay(d.range.to)} vs ${fmtDay(d.range.prev_from)}–${fmtDay(d.range.prev_to)}`}>
                  <HBars
                    showShare={false}
                    format={fmtInt}
                    items={[
                      { key: 'cur_active', label: 'Activos (actual)', value: Number(c.active_users ?? 0) },
                      { key: 'prev_active', label: 'Activos (anterior)', value: Number(p.active_users ?? 0) },
                      { key: 'cur_signups', label: 'Registros (actual)', value: Number(c.signups ?? 0) },
                      { key: 'prev_signups', label: 'Registros (anterior)', value: Number(p.signups ?? 0) },
                    ]}
                  />
                </Card>
              </div>
              <Unavailable items={d.unavailable} />
            </>
          );
        }}
      </Async>
    </>
  );
}
