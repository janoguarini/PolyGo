import { HBars, LineChart } from '../components/charts.tsx';
import { Async, Card, Kpi, PageHead, Unavailable } from '../components/ui.tsx';
import { countryName, fmtDec, fmtInt, fmtPct, langName, platformName } from '../lib/format.ts';
import { aggregate } from '../lib/period.ts';
import { useRpc } from '../lib/rpc.ts';
import { GrainToggle, SectionTitle, toItems, useGrain, usePeriodArgs, type Json } from './shared.tsx';

const pctOf = (a: unknown, b: unknown) => (Number(b) > 0 ? Math.round((Number(a) / Number(b)) * 1000) / 10 : null);

export function Growth() {
  const { args, refreshKey } = usePeriodArgs();
  const state = useRpc<Json>('admin_growth', args, refreshKey);
  const [grain, setGrain] = useGrain();
  return (
    <>
      <PageHead title="Crecimiento">Registros, de dónde vienen los usuarios y cuánto tardan en activarse.</PageHead>
      <Async state={state} rows={6}>
        {(d) => {
          const f = d.funnel;
          const agg = aggregate(d.series, grain, { signups: 'sum', cumulative: 'avg' });
          const dist = d.distributions;
          return (
            <>
              <div className="grid kpis">
                <Kpi metric="total_users" value={d.total_users} />
                <Kpi metric="signups" value={d.signups} />
                <Kpi label="Onboarding completado" value={pctOf(f.onboarding_completed, f.signups)} format={fmtPct} formula="Registrados en el período con onboarding_completed_at / registrados en el período." foot={<span>{fmtInt(f.onboarding_completed)} de {fmtInt(f.signups)}</span>} />
                <Kpi label="Minutos hasta onboarding" value={f.median_minutes_to_onboarding} format={(v) => fmtDec(v)} formula="Mediana de (onboarding_completed_at − registro) de los registrados en el período." />
                <Kpi label="Horas hasta 1.ª lección" value={f.median_hours_to_first_lesson} format={(v) => fmtDec(v)} formula="Mediana de (primera lección completada − registro), registrados en el período." />
                <Kpi label="Horas hasta 1.ª partida" value={f.median_hours_to_first_battle} format={(v) => fmtDec(v)} formula="Mediana de (primera partida − registro), registrados en el período." />
                <Kpi label="Nunca hicieron una lección" value={d.never.never_lesson} formula="Usuarios (con filtros) sin ninguna lección completada en toda su historia." />
                <Kpi label="Nunca jugaron Ranked" value={d.never.never_ranked} formula="Usuarios sin ninguna partida Ranked." />
                <Kpi label="Abandonaron" value={d.never.abandoned_14d} formula="Registrados hace más de 14 días sin actividad en los últimos 14 días." />
                <Kpi label="Nuevos activos" value={d.new_vs_returning.new_active} formula="Activos en el período que se registraron dentro del período." />
                <Kpi label="Recurrentes activos" value={d.new_vs_returning.returning_active} formula="Activos en el período registrados antes del período." />
              </div>
              <Card title="Registros" actions={<GrainToggle grain={grain} setGrain={setGrain} />}>
                <LineChart data={agg} series={[{ key: 'signups', label: 'Registros' }]} csvName="registros" />
              </Card>
              <Card title="Embudo de activación" sub="registrados en el período">
                <HBars
                  showShare={false}
                  items={[
                    { key: 's', label: 'Registro', value: Number(f.signups) },
                    { key: 'o', label: 'Onboarding', value: Number(f.onboarding_completed) },
                    { key: 'l', label: '1.ª lección', value: Number(f.first_lesson) },
                    { key: 'b', label: '1.ª partida', value: Number(f.first_battle) },
                    { key: 'r', label: '1.ª Ranked', value: Number(f.first_ranked) },
                  ]}
                  format={(v) => `${fmtInt(v)} (${fmtPct(pctOf(v, f.signups))})`}
                />
              </Card>
              <SectionTitle>Distribución (todos los usuarios con filtros)</SectionTitle>
              <div className="grid cols-3">
                <Card title="País" info="profiles.region: lo elige el usuario, muchos no lo completan. El país por IP llega con PostHog.">
                  <HBars items={toItems(dist.country, countryName)} />
                </Card>
                <Card title="Plataforma" info="Última plataforma conocida: sesiones de aprendizaje o tokens de push.">
                  <HBars items={toItems(dist.platform, platformName)} />
                </Card>
                <Card title="Free vs Plus">
                  <HBars items={toItems(dist.plan, (k) => (k === 'plus' ? 'Plus' : 'Free'))} />
                </Card>
                <Card title="Idioma de la app">
                  <HBars items={toItems(dist.interface_language, langName)} />
                </Card>
                <Card title="Idioma de origen" info="source_language del curso activo.">
                  <HBars items={toItems(dist.source_language, langName)} />
                </Card>
                <Card title="Idioma objetivo">
                  <HBars items={toItems(dist.target_language, langName)} />
                </Card>
                <Card title="Curso activo">
                  <HBars items={toItems(dist.course, (k) => (k === '??' ? 'Sin curso' : k))} />
                </Card>
                <Card title="Cursos inscriptos" info="Inscripciones en user_courses (un usuario puede tener varias).">
                  <HBars items={toItems(dist.courses_enrolled, (k) => k)} />
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
