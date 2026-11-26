import { useState } from 'react';

import { BarChart, HBars, LineChart } from '../components/charts.tsx';
import { DataTable } from '../components/DataTable.tsx';
import { Async, Card, Kpi, PageHead, Unavailable } from '../components/ui.tsx';
import { usePanel } from '../lib/context.tsx';
import { countryName, fmtDec, fmtInt, fmtPct, fmtSeconds, langName, tierName } from '../lib/format.ts';
import { aggregate } from '../lib/period.ts';
import { useRpc } from '../lib/rpc.ts';
import { navigate } from '../lib/router.ts';
import { GrainToggle, SectionTitle, useGrain, usePeriodArgs, type Json } from './shared.tsx';

const WEEKDAYS = ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function Ranked() {
  const { args, refreshKey } = usePeriodArgs();
  const state = useRpc<Json>('admin_ranked', args, refreshKey);
  const [grain, setGrain] = useGrain();
  return (
    <>
      <PageHead title="Ranked">
        Partidas de usuarios reales (las de bots se cuentan aparte). «Idioma» filtra el idioma de la partida.
      </PageHead>
      <Async state={state} rows={6}>
        {(d) => {
          const t = d.totals;
          const e = d.elo;
          const agg = aggregate(d.series, grain, { battles: 'sum', completed: 'sum', forfeited: 'sum', players: 'avg' });
          const hours = new Map((d.by_hour as Json[]).map((h) => [h.hour, Number(h.battles)]));
          const wd = new Map((d.by_weekday as Json[]).map((h) => [h.weekday, Number(h.battles)]));
          return (
            <>
              <SectionTitle>Partidas</SectionTitle>
              <div className="grid kpis">
                <Kpi metric="battles" value={t.battles} />
                <Kpi metric="battles_completed" value={t.completed} />
                <Kpi metric="battles_forfeited" value={t.forfeited} />
                <Kpi label="Canceladas" value={t.cancelled} formula="status cancelled." />
                <Kpi label="Sin terminar" value={t.unfinished} formula="status matched / ready / in_progress / reconnecting." />
                <Kpi label="Ranked" value={t.ranked} />
                <Kpi label="Amistosas" value={t.friendly} />
                <Kpi label="Contra bot" value={t.vs_bot} />
                <Kpi label="Humano vs humano" value={t.vs_human} />
                <Kpi metric="players" value={t.players} />
                <Kpi metric="battles_per_player" value={t.battles_per_player} format={(v) => fmtDec(v, 2)} />
                <Kpi metric="avg_duration_seconds" value={t.avg_duration_seconds} format={fmtSeconds} />
                <Kpi metric="avg_prep_seconds" value={t.avg_prep_seconds} format={fmtSeconds} />
                <Kpi label="Tiempo de matchmaking" value={null} unavailable={d.unavailable.matchmaking_time} />
                <Kpi label="Sin oponente" value={null} unavailable={d.unavailable.no_opponent} />
                <Kpi label="Desconexiones" value={null} unavailable={d.unavailable.disconnects} />
              </div>
              <SectionTitle>Resultados</SectionTitle>
              <div className="grid kpis">
                <Kpi label="Victorias" value={t.wins} />
                <Kpi label="Derrotas" value={t.losses} />
                <Kpi label="Empates" value={t.draws} />
                <Kpi metric="win_rate" value={t.win_rate} format={fmtPct} />
                <Kpi label="% victorias vs bot" value={t.win_rate_vs_bot} format={fmtPct} />
                <Kpi label="% victorias vs humano" value={t.win_rate_vs_human} format={fmtPct} />
                <Kpi label="Precisión" value={t.accuracy} format={fmtPct} formula="Suma de correct_answers / suma de total_answers de los usuarios reales." />
                <Kpi label="Abandonos propios" value={t.forfeits_by_real_players} formula="Participaciones de usuarios reales con forfeited = true." />
                <Kpi metric="avg_rating_gap_human" value={t.avg_rating_gap_human} />
                <Kpi metric="quit_after_loss" value={t.quit_after_loss} foot={<span>de {fmtInt(t.quit_after_loss_base)} con última partida hace +7 días</span>} />
              </div>
              <SectionTitle>ELO y ligas</SectionTitle>
              <div className="grid kpis">
                <Kpi label="Jugadores con rating" value={e.players_rated} formula="player_ratings con games_played > 0." />
                <Kpi label="ELO promedio" value={e.avg} />
                <Kpi label="ELO mediano" value={e.median} />
                <Kpi label="ELO máximo" value={e.max} />
                <Kpi label="Pico histórico" value={e.max_peak} />
                <Kpi metric="promotions" value={e.promotions} />
                <Kpi metric="demotions" value={e.demotions} />
                <Kpi label="Mejor racha de victorias" value={e.best_win_streak} />
                <Kpi label="En racha (3+)" value={e.on_win_streak_3plus} />
              </div>
              <Card title="Evolución" actions={<GrainToggle grain={grain} setGrain={setGrain} />}>
                <LineChart
                  data={agg}
                  series={[
                    { key: 'battles', label: 'Partidas' },
                    { key: 'completed', label: 'Completadas' },
                    { key: 'forfeited', label: 'Abandonadas' },
                  ]}
                  csvName="ranked-evolucion"
                />
              </Card>
              <div className="grid cols-2">
                <Card title="Usuarios por liga">
                  <BarChart label="Jugadores" data={(e.by_tier as Json[]).map((b) => ({ label: tierName(b.tier), value: Number(b.players), hint: `${tierName(b.tier)} (${b.min_rating}+)` }))} />
                </Card>
                <Card title="Distribución de ELO" info="Jugadores por tramo de 100 puntos.">
                  <BarChart label="Jugadores" data={(e.histogram as Json[]).map((b) => ({ label: String(b.from), value: Number(b.players), hint: `${b.from}–${Number(b.from) + 99}` }))} />
                </Card>
                <Card title="Actividad por hora" sub="hora de Buenos Aires">
                  <BarChart label="Partidas" data={Array.from({ length: 24 }, (_, h) => ({ label: String(h), value: hours.get(h) ?? 0, hint: `${h}:00–${h}:59` }))} />
                </Card>
                <Card title="Actividad por día de la semana">
                  <BarChart label="Partidas" data={[1, 2, 3, 4, 5, 6, 7].map((w) => ({ label: WEEKDAYS[w]!, value: wd.get(w) ?? 0 }))} />
                </Card>
                <Card title="Por idioma">
                  <DataTable
                    rows={d.by_language}
                    columns={[
                      { key: 'language', label: 'Idioma', render: (r) => langName(r.language) },
                      { key: 'battles', label: 'Partidas', num: true },
                      { key: 'players', label: 'Jugadores', num: true },
                      { key: 'accuracy', label: 'Precisión', num: true, render: (r) => fmtPct(r.accuracy) },
                      { key: 'win_rate', label: '% victorias', num: true, render: (r) => fmtPct(r.win_rate) },
                    ]}
                  />
                </Card>
                <Card title="Por tipo de partida">
                  <DataTable
                    rows={d.by_type}
                    columns={[
                      { key: 'type', label: 'Tipo', render: (r) => ({ amistosa: 'Amistosa', ranked_bot: 'Ranked vs bot', ranked_humano: 'Ranked humano' } as Record<string, string>)[String(r.type)] ?? String(r.type) },
                      { key: 'battles', label: 'Partidas', num: true },
                      { key: 'win_rate', label: '% victorias', num: true, render: (r) => fmtPct(r.win_rate) },
                      { key: 'accuracy', label: 'Precisión', num: true, render: (r) => fmtPct(r.accuracy) },
                    ]}
                  />
                </Card>
                <Card title="Rendimiento por liga" info="Por liga del jugador al empezar la partida (rating_before), sólo Ranked.">
                  <DataTable
                    rows={d.by_tier_performance}
                    columns={[
                      { key: 'tier', label: 'Liga', render: (r) => tierName(r.tier) },
                      { key: 'battles', label: 'Partidas', num: true },
                      { key: 'win_rate', label: '% victorias', num: true, render: (r) => fmtPct(r.win_rate) },
                      { key: 'accuracy', label: 'Precisión', num: true, render: (r) => fmtPct(r.accuracy) },
                    ]}
                  />
                </Card>
                <Card title="Por país">
                  <HBars items={(d.by_country as Json[]).map((r) => ({ key: r.country, label: countryName(r.country), value: Number(r.battles) }))} />
                </Card>
              </div>
              <Leaderboard />
              <Unavailable items={d.unavailable} />
            </>
          );
        }}
      </Async>
    </>
  );
}

function Leaderboard() {
  const { refreshKey } = usePanel();
  const [language, setLanguage] = useState('');
  const [internal, setInternal] = useState(false);
  const state = useRpc<Json[]>('admin_leaderboard', { p_language: language || null, p_include_internal: internal, p_limit: 100 }, refreshKey);
  return (
    <Card
      title="Ranking"
      sub={language ? langName(language) : 'global (mejor rating de cada usuario)'}
      actions={
        <div className="controls">
          <select className="select" aria-label="Idioma del ranking" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="">Global</option>
            {['en', 'pt', 'it', 'zh', 'fr', 'es'].map((l) => (
              <option key={l} value={l}>
                {langName(l)}
              </option>
            ))}
          </select>
          <label className="muted" style={{ fontSize: 13, display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} /> incluir internas
          </label>
        </div>
      }
    >
      <Async state={state}>
        {(rows) => (
          <DataTable
            csvName={`ranking-${language || 'global'}`}
            rows={rows}
            onRowClick={(r) => navigate('users', String(r.user_id))}
            empty="Nadie jugó todavía."
            columns={[
              { key: 'position', label: '#', num: true },
              { key: 'username', label: 'Usuario', render: (r) => <>{String(r.username ?? '—')} {r.internal ? <span className="chip chip-warn">interna</span> : null}</> },
              { key: 'language', label: 'Idioma', render: (r) => langName(r.language) },
              { key: 'rating', label: 'ELO', num: true },
              { key: 'tier', label: 'Liga', render: (r) => tierName(r.tier) },
              { key: 'peak', label: 'Pico', num: true },
              { key: 'games', label: 'Partidas', num: true },
              { key: 'win_rate', label: '% V', num: true, render: (r) => fmtPct(r.win_rate) },
            ]}
          />
        )}
      </Async>
    </Card>
  );
}
