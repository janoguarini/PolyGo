import { router, type Href } from 'expo-router';
import { useState } from 'react';

import { Text, TextField } from '@/design-system';

import { useAdmin, usePeriodArgs, type Json } from './api';
import {
  AdminAsync,
  BarList,
  Chips,
  Columns,
  Kpi,
  KpiGrid,
  Overline,
  Rows,
  Section,
  Unavailable,
  pctOf,
} from './components';
import {
  compactSeries,
  countryName,
  fmtBytes,
  fmtDateTime,
  fmtDec,
  fmtInt,
  fmtMs,
  fmtPct,
  fmtSeconds,
  langName,
  platformName,
  tierName,
} from './format';

// Los 13 módulos del panel, sobre las mismas RPC que el panel web (docs/ADMIN_PANEL.md).

export const MODULES = [
  { id: 'overview', label: 'Overview', hint: 'Usuarios, actividad, negocio y alertas' },
  { id: 'users', label: 'Usuarios', hint: 'Buscar usuarios y ver su ficha' },
  { id: 'growth', label: 'Crecimiento', hint: 'Registros, activación y distribución' },
  { id: 'learning', label: 'Aprendizaje', hint: 'Lecciones, precisión y puntos difíciles' },
  { id: 'ranked', label: 'Ranked', hint: 'Partidas, resultados, ELO y ranking' },
  { id: 'retention', label: 'Retención', hint: 'Cohortes D1–D90 y frecuencia' },
  { id: 'social', label: 'Social', hint: 'Amistades, desafíos y referidos' },
  { id: 'monetization', label: 'Monetización', hint: 'Plus, renovaciones y conversión' },
  { id: 'marketing', label: 'Marketing', hint: 'Ranking de referidores' },
  { id: 'notifications', label: 'Notificaciones', hint: 'Tokens y avisos' },
  { id: 'health', label: 'Salud técnica', hint: 'Partidas trabadas, versiones y base' },
  { id: 'content', label: 'Contenido', hint: 'Catálogo y finalización por unidad' },
  { id: 'admin', label: 'Administración', hint: 'Auditoría y eventos de seguridad' },
] as const;

export type ModuleId = (typeof MODULES)[number]['id'];

const items = (
  rows: { key: string; count: number }[] | null | undefined,
  label: (k: string) => string,
) => (rows ?? []).map((r) => ({ key: r.key, label: label(r.key), value: Number(r.count) }));

const openUser = (id: unknown) => router.push(`/admin/user/${String(id)}` as Href);

export function ModuleView({ id }: { id: ModuleId }) {
  switch (id) {
    case 'overview':
      return <Overview />;
    case 'users':
      return <Users />;
    case 'growth':
      return <Growth />;
    case 'learning':
      return <Learning />;
    case 'ranked':
      return <Ranked />;
    case 'retention':
      return <Retention />;
    case 'social':
      return <Social />;
    case 'monetization':
      return <Monetization />;
    case 'marketing':
      return <Marketing />;
    case 'notifications':
      return <Notifications />;
    case 'health':
      return <Health />;
    case 'content':
      return <Content />;
    case 'admin':
      return <Audit />;
  }
}

// ---------------------------------------------------------------------------------------------

function Overview() {
  const q = useAdmin('admin_overview', usePeriodArgs());
  return (
    <AdminAsync query={q}>
      {(d) => {
        const s = d.snapshot;
        const c = d.current;
        const p = d.previous;
        return (
          <>
            <Overline>Usuarios (hoy)</Overline>
            <KpiGrid>
              <Kpi label="Registrados" value={s.total_users} />
              <Kpi label="Nuevos hoy" value={s.new_today} />
              <Kpi label="Nuevos 7 días" value={s.new_7d} />
              <Kpi label="Nuevos 30 días" value={s.new_30d} />
              <Kpi label="DAU" value={s.dau} hint="aprendió o jugó hoy" />
              <Kpi label="WAU" value={s.wau} />
              <Kpi label="MAU" value={s.mau} />
              <Kpi label="App abierta hoy" value={s.seen_today} />
              <Kpi label="Free" value={s.free_users} />
              <Kpi label="Plus" value={s.plus_users} />
              <Kpi label="Plus pagos" value={s.paid_plus_users} />
              <Kpi label="Reactivados" value={s.reactivated} />
              <Kpi label="Inactivos 30 días" value={s.inactive_30d} />
              <Kpi label="En tiempo real" value={null} unavailable={d.unavailable.realtime_users} />
            </KpiGrid>
            <Overline>Actividad del período (vs anterior)</Overline>
            <KpiGrid>
              <Kpi label="Registros" value={c.signups} previous={p.signups} />
              <Kpi label="Activos" value={c.active_users} previous={p.active_users} />
              <Kpi
                label="Activos por día"
                value={c.avg_daily_active}
                previous={p.avg_daily_active}
                format={fmtDec}
              />
              <Kpi label="Sesiones" value={c.sessions} previous={p.sessions} />
              <Kpi
                label="Sesiones por usuario"
                value={c.sessions_per_learner}
                previous={p.sessions_per_learner}
                format={fmtDec}
              />
              <Kpi
                label="Duración de sesión"
                value={c.avg_session_seconds}
                previous={p.avg_session_seconds}
                format={fmtSeconds}
              />
              <Kpi label="Lecciones" value={c.lessons_completed} previous={p.lessons_completed} />
              <Kpi label="Repasos" value={c.reviews_completed} previous={p.reviews_completed} />
              <Kpi
                label="Ejercicios"
                value={c.exercises_answered}
                previous={p.exercises_answered}
              />
              <Kpi label="Partidas" value={c.battles} previous={p.battles} />
              <Kpi label="Completadas" value={c.battles_completed} previous={p.battles_completed} />
              <Kpi
                label="Abandonadas"
                value={c.battles_forfeited}
                previous={p.battles_forfeited}
                invert
              />
            </KpiGrid>
            <Overline>Negocio</Overline>
            <KpiGrid>
              <Kpi
                label="Suscripciones iniciadas"
                value={c.paid_subs_started}
                previous={p.paid_subs_started}
              />
              <Kpi label="MRR" value={null} unavailable={d.unavailable.mrr} />
              <Kpi
                label="Ingresos publicitarios"
                value={null}
                unavailable={d.unavailable.ads_revenue}
              />
            </KpiGrid>
            <Section title="Usuarios activos" hint="por día (por semana si el período es largo)">
              <Columns data={compactSeries(d.series, 'active', 'avg')} format={fmtDec} />
            </Section>
            <Section title="Registros">
              <Columns data={compactSeries(d.series, 'signups')} />
            </Section>
            <Section title="Lecciones · Repasos · Partidas">
              <Columns data={compactSeries(d.series, 'lessons')} />
              <Columns data={compactSeries(d.series, 'reviews')} />
              <Columns data={compactSeries(d.series, 'battles')} />
            </Section>
            <Section title="Alertas" hint="Reglas sobre datos reales">
              <Rows
                empty="Sin alertas con los datos disponibles."
                rows={(d.alerts as Json[]).map((a) => ({
                  key: a.key,
                  label: `${a.level === 'critical' ? '‼ Crítico' : a.level === 'warning' ? '▲ Atención' : 'ℹ Info'} · ${a.title}`,
                  sub: a.detail,
                  value: String(a.value),
                }))}
              />
            </Section>
            <Unavailable items={d.unavailable} />
          </>
        );
      }}
    </AdminAsync>
  );
}

function Users() {
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [internal, setInternal] = useState<'yes' | 'no'>('yes');
  const query = useAdmin('admin_users_list', {
    p_search: search || null,
    p_filters: {},
    p_include_internal: internal === 'yes',
    p_sort: 'created_desc',
    p_limit: 30,
    p_offset: offset,
  });
  return (
    <>
      <TextField
        label="Buscar (username, nombre, código o UID)"
        value={q}
        onChangeText={setQ}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={() => {
          setSearch(q.trim());
          setOffset(0);
        }}
      />
      <Chips
        options={[
          { id: 'yes', label: 'Con internas' },
          { id: 'no', label: 'Sin internas' },
        ]}
        value={internal}
        onChange={(v) => {
          setInternal(v);
          setOffset(0);
        }}
      />
      <AdminAsync query={query}>
        {(d) => (
          <Section title={`${fmtInt(d.total)} usuarios`} hint="Toca uno para ver su ficha">
            <Rows
              empty="Ningún usuario coincide."
              rows={(d.rows as Json[]).map((r) => ({
                key: r.id,
                label: `${r.username ?? '—'}${r.internal ? ' · interna' : ''}${r.plan === 'plus' ? ' · Plus' : ''}`,
                sub: `${fmtDateTime(r.created_at)} · ${countryName(r.country)} · ${platformName(r.platform)} · ${langName(r.target_language)} · ${fmtInt(r.lessons_completed)} lecc. · ${fmtInt(r.battles)} partidas`,
                value: r.best_rating != null ? String(r.best_rating) : '—',
                onPress: () => openUser(r.id),
              }))}
            />
            <Pager offset={offset} total={d.total} size={30} onChange={setOffset} />
          </Section>
        )}
      </AdminAsync>
    </>
  );
}

function Pager({
  offset,
  total,
  size,
  onChange,
}: {
  offset: number;
  total: number;
  size: number;
  onChange: (n: number) => void;
}) {
  if (total <= size) return null;
  return (
    <Chips
      options={[
        { id: 'prev', label: '← Anterior' },
        { id: 'info', label: `${offset + 1}–${Math.min(total, offset + size)} de ${total}` },
        { id: 'next', label: 'Siguiente →' },
      ]}
      value="info"
      onChange={(v) => {
        if (v === 'prev' && offset > 0) onChange(Math.max(0, offset - size));
        if (v === 'next' && offset + size < total) onChange(offset + size);
      }}
    />
  );
}

function Growth() {
  const q = useAdmin('admin_growth', usePeriodArgs());
  return (
    <AdminAsync query={q}>
      {(d) => {
        const f = d.funnel;
        const dist = d.distributions;
        return (
          <>
            <KpiGrid>
              <Kpi label="Registrados" value={d.total_users} />
              <Kpi label="Registros del período" value={d.signups} />
              <Kpi
                label="Onboarding completado"
                value={pctOf(f.onboarding_completed, f.signups)}
                format={fmtPct}
                hint={`${fmtInt(f.onboarding_completed)} de ${fmtInt(f.signups)}`}
              />
              <Kpi
                label="Min. hasta onboarding"
                value={f.median_minutes_to_onboarding}
                format={fmtDec}
                hint="mediana"
              />
              <Kpi
                label="Horas hasta 1.ª lección"
                value={f.median_hours_to_first_lesson}
                format={fmtDec}
                hint="mediana"
              />
              <Kpi
                label="Horas hasta 1.ª partida"
                value={f.median_hours_to_first_battle}
                format={fmtDec}
                hint="mediana"
              />
              <Kpi label="Nunca hicieron lección" value={d.never.never_lesson} />
              <Kpi label="Nunca jugaron Ranked" value={d.never.never_ranked} />
              <Kpi label="Abandonaron (14 días)" value={d.never.abandoned_14d} />
              <Kpi label="Nuevos activos" value={d.new_vs_returning.new_active} />
              <Kpi label="Recurrentes activos" value={d.new_vs_returning.returning_active} />
            </KpiGrid>
            <Section title="Registros por día">
              <Columns data={compactSeries(d.series, 'signups')} />
            </Section>
            <Section title="Embudo de activación" hint="registrados en el período">
              <BarList
                items={[
                  { key: 's', label: 'Registro', value: Number(f.signups) },
                  { key: 'o', label: 'Onboarding', value: Number(f.onboarding_completed) },
                  { key: 'l', label: '1.ª lección', value: Number(f.first_lesson) },
                  { key: 'b', label: '1.ª partida', value: Number(f.first_battle) },
                  { key: 'r', label: '1.ª Ranked', value: Number(f.first_ranked) },
                ]}
              />
            </Section>
            <Section title="País" hint="el que elige el usuario">
              <BarList items={items(dist.country, countryName)} />
            </Section>
            <Section title="Plataforma">
              <BarList items={items(dist.platform, platformName)} />
            </Section>
            <Section title="Free vs Plus">
              <BarList items={items(dist.plan, (k) => (k === 'plus' ? 'Plus' : 'Free'))} />
            </Section>
            <Section title="Idioma de la app">
              <BarList items={items(dist.interface_language, langName)} />
            </Section>
            <Section title="Idioma de origen">
              <BarList items={items(dist.source_language, langName)} />
            </Section>
            <Section title="Idioma objetivo">
              <BarList items={items(dist.target_language, langName)} />
            </Section>
            <Section title="Curso activo">
              <BarList items={items(dist.course, (k) => (k === '??' ? 'Sin curso' : k))} />
            </Section>
            <Unavailable items={d.unavailable} />
          </>
        );
      }}
    </AdminAsync>
  );
}

function Learning() {
  const base = usePeriodArgs();
  const [level, setLevel] = useState<'' | 'A1' | 'A2' | 'B1' | 'B2'>('');
  const q = useAdmin('admin_learning', {
    ...base,
    p_filters: { ...base.p_filters, ...(level ? { level } : {}) },
    p_min_attempts: 5,
  });
  return (
    <>
      <Chips
        options={[
          { id: '', label: 'Todos los niveles' },
          { id: 'A1', label: 'A1' },
          { id: 'A2', label: 'A2' },
          { id: 'B1', label: 'B1' },
          { id: 'B2', label: 'B2' },
        ]}
        value={level}
        onChange={setLevel}
      />
      <AdminAsync query={q}>
        {(d) => {
          const t = d.totals;
          return (
            <>
              <KpiGrid>
                <Kpi label="Lecciones" value={t.lessons_completed} />
                <Kpi
                  label="Lecciones iniciadas"
                  value={null}
                  unavailable={d.unavailable.lessons_started}
                />
                <Kpi label="Repasos" value={t.reviews_completed} />
                <Kpi label="Usuarios" value={t.learners} />
                <Kpi label="Unidades completadas" value={t.units_completed} />
                <Kpi label="Respuestas" value={t.answers} />
                <Kpi label="Correctas" value={t.correct} />
                <Kpi label="Incorrectas" value={t.incorrect} />
                <Kpi label="Precisión" value={t.accuracy} format={fmtPct} />
                <Kpi label="Precisión 1.er intento" value={t.first_try_accuracy} format={fmtPct} />
                <Kpi label="Tiempo por respuesta" value={t.avg_response_ms} format={fmtMs} />
                <Kpi label="Tiempo por lección" value={t.avg_lesson_seconds} format={fmtSeconds} />
              </KpiGrid>
              <Section title="Lecciones por día">
                <Columns data={compactSeries(d.series, 'lessons')} />
              </Section>
              <Section title="Por curso">
                <Rows
                  rows={(d.by_course as Json[]).map((r) => ({
                    key: r.language,
                    label: langName(r.language),
                    sub: `${fmtInt(r.learners)} usuarios · ${fmtPct(r.accuracy)} · ${fmtSeconds(r.avg_seconds)}`,
                    value: fmtInt(r.lessons),
                  }))}
                />
              </Section>
              <Section title="Por nivel">
                <Rows
                  rows={(d.by_level as Json[]).map((r) => ({
                    key: r.level,
                    label: r.level,
                    sub: `${fmtInt(r.learners)} usuarios · precisión ${fmtPct(r.accuracy)}`,
                    value: fmtInt(r.lessons),
                  }))}
                />
              </Section>
              <Section title="Por habilidad">
                <Rows
                  rows={(d.by_skill as Json[]).map((r) => ({
                    key: r.skill,
                    label: r.skill,
                    sub: `precisión ${fmtPct(r.accuracy)} · ${fmtMs(r.avg_ms)}`,
                    value: fmtInt(r.answers),
                  }))}
                />
              </Section>
              <Section title="Por tipo de ejercicio">
                <Rows
                  rows={(d.by_type as Json[]).map((r) => ({
                    key: r.type,
                    label: r.type,
                    sub: `precisión ${fmtPct(r.accuracy)} · ${fmtMs(r.avg_ms)}`,
                    value: fmtInt(r.answers),
                  }))}
                />
              </Section>
              <Section title="Ejercicios más difíciles" hint="con al menos 5 intentos">
                <Rows
                  empty="Ninguno alcanza el mínimo de intentos."
                  rows={(d.hardest_exercises as Json[]).map((r) => ({
                    key: r.exercise_id,
                    label: String(r.exercise_id),
                    sub: `${r.type ?? '—'} · ${langName(r.language)} ${r.level ?? ''} · ${fmtInt(r.attempts)} intentos`,
                    value: fmtPct(r.accuracy),
                  }))}
                />
              </Section>
              <Section title="Lecciones más difíciles">
                <Rows
                  empty="Pocas lecciones para comparar."
                  rows={(d.hardest_lessons as Json[]).map((r) => ({
                    key: r.lesson_id,
                    label: r.title ?? r.lesson_id,
                    sub: `${langName(r.language)} ${r.level ?? ''} · ${fmtInt(r.completions)} completadas`,
                    value: fmtPct(r.accuracy),
                  }))}
                />
              </Section>
              <Section title="Lecciones más hechas">
                <Rows
                  rows={(d.top_lessons as Json[]).map((r) => ({
                    key: r.lesson_id,
                    label: r.title ?? r.lesson_id,
                    sub: `${langName(r.language)} ${r.level ?? ''} · ${fmtInt(r.learners)} usuarios`,
                    value: fmtInt(r.completions),
                  }))}
                />
              </Section>
              <Section title="Rachas">
                <KpiGrid>
                  <Kpi label="Con racha" value={d.streaks.users_with_streak} />
                  <Kpi label="Racha media" value={d.streaks.avg_current} format={fmtDec} />
                  <Kpi label="Mejor racha" value={d.streaks.max_best} />
                </KpiGrid>
                <BarList
                  items={(d.streaks.buckets as Json[]).map((b) => ({
                    key: b.bucket,
                    label: `${b.bucket} días`,
                    value: Number(b.users),
                  }))}
                />
              </Section>
              <Unavailable items={d.unavailable} />
            </>
          );
        }}
      </AdminAsync>
    </>
  );
}

const WEEKDAYS = ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function Ranked() {
  const q = useAdmin('admin_ranked', usePeriodArgs());
  const [lbLang, setLbLang] = useState<'' | 'en' | 'pt' | 'it' | 'zh' | 'fr' | 'es'>('');
  const lb = useAdmin('admin_leaderboard', {
    p_language: lbLang || null,
    p_include_internal: false,
    p_limit: 50,
  });
  return (
    <>
      <AdminAsync query={q}>
        {(d) => {
          const t = d.totals;
          const e = d.elo;
          const hours = new Map((d.by_hour as Json[]).map((h) => [h.hour, Number(h.battles)]));
          const wd = new Map((d.by_weekday as Json[]).map((h) => [h.weekday, Number(h.battles)]));
          return (
            <>
              <Overline>Partidas</Overline>
              <KpiGrid>
                <Kpi label="Partidas" value={t.battles} />
                <Kpi label="Completadas" value={t.completed} />
                <Kpi label="Abandonadas" value={t.forfeited} />
                <Kpi label="Canceladas" value={t.cancelled} />
                <Kpi label="Sin terminar" value={t.unfinished} />
                <Kpi label="Ranked" value={t.ranked} />
                <Kpi label="Amistosas" value={t.friendly} />
                <Kpi label="Contra bot" value={t.vs_bot} />
                <Kpi label="Humano vs humano" value={t.vs_human} />
                <Kpi label="Jugadores" value={t.players} />
                <Kpi label="Partidas por jugador" value={t.battles_per_player} format={fmtDec} />
                <Kpi label="Duración media" value={t.avg_duration_seconds} format={fmtSeconds} />
                <Kpi label="Emparejado → inicio" value={t.avg_prep_seconds} format={fmtSeconds} />
                <Kpi
                  label="Matchmaking"
                  value={null}
                  unavailable={d.unavailable.matchmaking_time}
                />
              </KpiGrid>
              <Overline>Resultados</Overline>
              <KpiGrid>
                <Kpi label="Victorias" value={t.wins} />
                <Kpi label="Derrotas" value={t.losses} />
                <Kpi label="Empates" value={t.draws} />
                <Kpi label="% victorias" value={t.win_rate} format={fmtPct} />
                <Kpi label="% vs bot" value={t.win_rate_vs_bot} format={fmtPct} />
                <Kpi label="% vs humano" value={t.win_rate_vs_human} format={fmtPct} />
                <Kpi label="Precisión" value={t.accuracy} format={fmtPct} />
                <Kpi
                  label="Diferencia de ELO"
                  value={t.avg_rating_gap_human}
                  hint="humano vs humano"
                />
                <Kpi
                  label="Dejaron tras perder"
                  value={t.quit_after_loss}
                  hint={`de ${fmtInt(t.quit_after_loss_base)}`}
                />
              </KpiGrid>
              <Overline>ELO y ligas</Overline>
              <KpiGrid>
                <Kpi label="Con rating" value={e.players_rated} />
                <Kpi label="ELO promedio" value={e.avg} />
                <Kpi label="ELO mediano" value={e.median} />
                <Kpi label="ELO máximo" value={e.max} />
                <Kpi label="Ascensos" value={e.promotions} />
                <Kpi label="Descensos" value={e.demotions} />
                <Kpi label="Mejor racha" value={e.best_win_streak} />
                <Kpi label="En racha (3+)" value={e.on_win_streak_3plus} />
              </KpiGrid>
              <Section title="Partidas por día">
                <Columns data={compactSeries(d.series, 'battles')} />
              </Section>
              <Section title="Usuarios por liga">
                <BarList
                  max={8}
                  items={(e.by_tier as Json[]).map((b) => ({
                    key: b.tier,
                    label: tierName(b.tier),
                    value: Number(b.players),
                  }))}
                />
              </Section>
              <Section title="Por hora" hint="hora de Buenos Aires">
                <Columns
                  data={Array.from({ length: 24 }, (_, h) => ({
                    label: `${h} h`,
                    value: hours.get(h) ?? 0,
                  }))}
                />
              </Section>
              <Section title="Por día de la semana">
                <BarList
                  max={7}
                  items={[1, 2, 3, 4, 5, 6, 7].map((w) => ({
                    key: String(w),
                    label: WEEKDAYS[w] ?? '',
                    value: wd.get(w) ?? 0,
                  }))}
                />
              </Section>
              <Section title="Por idioma">
                <Rows
                  rows={(d.by_language as Json[]).map((r) => ({
                    key: r.language,
                    label: langName(r.language),
                    sub: `${fmtInt(r.players)} jugadores · precisión ${fmtPct(r.accuracy)} · victorias ${fmtPct(r.win_rate)}`,
                    value: fmtInt(r.battles),
                  }))}
                />
              </Section>
              <Section title="Por tipo">
                <Rows
                  rows={(d.by_type as Json[]).map((r) => ({
                    key: r.type,
                    label:
                      r.type === 'amistosa'
                        ? 'Amistosa'
                        : r.type === 'ranked_bot'
                          ? 'Ranked vs bot'
                          : 'Ranked humano',
                    sub: `victorias ${fmtPct(r.win_rate)} · precisión ${fmtPct(r.accuracy)}`,
                    value: fmtInt(r.battles),
                  }))}
                />
              </Section>
              <Section title="Por país">
                <BarList
                  items={(d.by_country as Json[]).map((r) => ({
                    key: r.country,
                    label: countryName(r.country),
                    value: Number(r.battles),
                  }))}
                />
              </Section>
              <Unavailable items={d.unavailable} />
            </>
          );
        }}
      </AdminAsync>
      <Section
        title="Ranking"
        hint={lbLang ? langName(lbLang) : 'global (mejor rating de cada usuario), sin internas'}
      >
        <Chips
          options={[
            { id: '', label: 'Global' },
            ...(['en', 'pt', 'it', 'zh', 'fr', 'es'] as const).map((l) => ({
              id: l,
              label: langName(l),
            })),
          ]}
          value={lbLang}
          onChange={setLbLang}
        />
        <AdminAsync query={lb}>
          {(rows) => (
            <Rows
              empty="Nadie jugó todavía."
              rows={(rows as Json[]).map((r) => ({
                key: `${r.user_id}-${r.language}`,
                label: `${r.position}. ${r.username ?? '—'}`,
                sub: `${tierName(r.tier)} · ${langName(r.language)} · ${fmtInt(r.games)} partidas · ${fmtPct(r.win_rate)}`,
                value: fmtInt(r.rating),
                onPress: () => openUser(r.user_id),
              }))}
            />
          )}
        </AdminAsync>
      </Section>
    </>
  );
}

const DAYS = ['d1', 'd3', 'd7', 'd14', 'd30', 'd60', 'd90'] as const;
const retLine = (r: Json) =>
  DAYS.map((k) => `${k.toUpperCase()} ${r?.[k]?.eligible ? fmtPct(r[k].pct) : '—'}`).join(' · ');

function Retention() {
  const [segment, setSegment] = useState<
    '' | 'platform' | 'country' | 'course' | 'plan' | 'played_ranked' | 'first_lesson'
  >('');
  const q = useAdmin('admin_retention', { ...usePeriodArgs(), p_segment: segment || null });
  return (
    <AdminAsync query={q}>
      {(d) => {
        const g = d.engagement;
        return (
          <>
            <Section title="Cómo se calcula">
              <Text variant="caption">{d.definition}</Text>
            </Section>
            <Section title="Retención general" hint="cohortes registradas en el período">
              <Text variant="bodyStrong">{retLine(d.overall)}</Text>
            </Section>
            <Section title="Cohortes semanales">
              <Rows
                empty="Nadie se registró en el período."
                rows={(d.cohorts as Json[]).map((c) => ({
                  key: c.cohort_week,
                  label: `Semana del ${c.cohort_week} · ${fmtInt(c.size)} usuarios`,
                  sub: retLine(c.retention),
                  value: '',
                }))}
              />
            </Section>
            <Section title="Por segmento">
              <Chips
                options={[
                  { id: '', label: 'Ninguno' },
                  { id: 'platform', label: 'Plataforma' },
                  { id: 'country', label: 'País' },
                  { id: 'course', label: 'Curso' },
                  { id: 'plan', label: 'Free/Plus' },
                  { id: 'played_ranked', label: 'Jugó Ranked' },
                  { id: 'first_lesson', label: '1.ª lección' },
                ]}
                value={segment}
                onChange={setSegment}
              />
              {segment ? (
                <Rows
                  rows={((d.segments ?? []) as Json[]).map((s) => ({
                    key: s.segment,
                    label: `${s.segment} · ${fmtInt(s.size)}`,
                    sub: retLine(s.retention),
                    value: '',
                  }))}
                />
              ) : null}
            </Section>
            <Overline>Uso en el período</Overline>
            <KpiGrid>
              <Kpi label="Activos" value={g.active_users} />
              <Kpi label="Días activos por usuario" value={g.avg_active_days} format={fmtDec} />
              <Kpi label="Sesiones por usuario" value={g.sessions_per_user} format={fmtDec} />
              <Kpi
                label="Días entre actividades"
                value={g.avg_days_between_activity}
                format={fmtDec}
              />
              <Kpi label="Sólo aprenden" value={g.learn_only} />
              <Kpi label="Sólo juegan" value={g.play_only} />
              <Kpi label="Aprenden y juegan" value={g.learn_and_play} />
              <Kpi label="Dejaron de aprender" value={g.stopped_learning} />
              <Kpi label="Dejaron de jugar" value={g.stopped_playing} />
            </KpiGrid>
            <Section title="Frecuencia y Plus">
              <Rows
                rows={(g.frequency as Json[]).map((r) => ({
                  key: r.bucket,
                  label: r.bucket,
                  sub: `${fmtPct(r.plus_pct)} con Plus`,
                  value: fmtInt(r.users),
                }))}
              />
            </Section>
            <Unavailable items={d.unavailable} />
          </>
        );
      }}
    </AdminAsync>
  );
}

function Social() {
  const q = useAdmin('admin_social', usePeriodArgs());
  return (
    <AdminAsync query={q}>
      {(d) => {
        const f = d.friendships;
        const c = d.challenges;
        const r = d.referrals;
        const r7 = d.retention_d1_7;
        return (
          <>
            <Overline>Amistades</Overline>
            <KpiGrid>
              <Kpi label="Amistades" value={f.accepted_total} />
              <Kpi label="Pendientes" value={f.pending_total} />
              <Kpi label="Solicitudes" value={f.requests_sent} />
              <Kpi label="Aceptadas" value={f.accepted} />
              <Kpi label="Rechazadas" value={f.declined} />
              <Kpi label="Aceptación" value={f.acceptance_rate} format={fmtPct} />
              <Kpi label="Activos socialmente" value={d.socially_active_users} />
            </KpiGrid>
            <Overline>Desafíos</Overline>
            <KpiGrid>
              <Kpi label="Creados" value={c.created} />
              <Kpi label="Aceptados" value={c.accepted} />
              <Kpi label="Jugados" value={c.played} />
              <Kpi label="Completados" value={c.completed} />
              <Kpi label="Abandonados" value={c.abandoned} />
              <Kpi label="Rechazados" value={c.declined} />
              <Kpi label="Cancelados" value={c.cancelled} />
              <Kpi label="Vencidos" value={c.expired} />
            </KpiGrid>
            <Overline>Referidos</Overline>
            <KpiGrid>
              <Kpi label="Con código" value={r.attributed} />
              <Kpi label="Calificados" value={r.qualified} />
              <Kpi label="Pendientes" value={r.pending} />
              <Kpi label="Rechazados" value={r.rejected} />
            </KpiGrid>
            <Section
              title="¿Qué retiene más?"
              hint={`Activos entre el día 1 y 7 · base ${fmtInt(r7.base_users)} usuarios (correlación, no causa)`}
            >
              <BarList
                format={fmtPct}
                items={[
                  { key: 'wf', label: 'Con amigos', value: Number(r7.with_friends ?? 0) },
                  { key: 'nf', label: 'Sin amigos', value: Number(r7.without_friends ?? 0) },
                  { key: 'wc', label: 'Con desafíos', value: Number(r7.with_challenges ?? 0) },
                  { key: 'nc', label: 'Sin desafíos', value: Number(r7.without_challenges ?? 0) },
                ]}
              />
            </Section>
            <Unavailable items={d.unavailable} />
          </>
        );
      }}
    </AdminAsync>
  );
}

function Monetization() {
  const q = useAdmin('admin_monetization', usePeriodArgs());
  return (
    <AdminAsync query={q}>
      {(d) => {
        const p = d.plus;
        const u = d.unavailable;
        return (
          <>
            <KpiGrid>
              <Kpi label="Plus pagos" value={p.active_paid} />
              <Kpi label="Plus (todas las fuentes)" value={p.active_any_source} />
              <Kpi label="Iniciadas" value={p.started_in_period} />
              <Kpi label="Vencidas" value={p.expired_in_period} />
              <Kpi label="No van a renovar" value={p.will_not_renew} />
              <Kpi label="Problemas de cobro" value={p.billing_issues} />
              <Kpi label="Conversión a pago" value={p.conversion_paid_pct} format={fmtPct} />
              <Kpi label="Mensuales" value={p.monthly_vs_annual?.monthly} />
              <Kpi label="Anuales" value={p.monthly_vs_annual?.annual} />
              <Kpi label="MRR" value={null} unavailable={u.mrr} />
              <Kpi label="ARR" value={null} unavailable={u.arr} />
              <Kpi label="Ingresos" value={null} unavailable={u.revenue} />
              <Kpi label="Ingresos publicitarios" value={null} unavailable={u.ads} />
            </KpiGrid>
            <Section title="Plus por fuente" hint="Manual, promocional y referido no son ingresos">
              <BarList
                items={(p.by_source as Json[]).map((r) => ({
                  key: r.source,
                  label: r.source,
                  value: Number(r.active),
                }))}
              />
            </Section>
            <Section title="Plus pago por producto">
              <BarList
                items={(p.by_product as Json[]).map((r) => ({
                  key: r.product,
                  label: r.product,
                  value: Number(r.active),
                }))}
              />
            </Section>
            <Section title="Notas">
              {Object.values(d.notes as Record<string, string>).map((n) => (
                <Text key={n} variant="caption">
                  • {n}
                </Text>
              ))}
            </Section>
            <Unavailable items={u} />
          </>
        );
      }}
    </AdminAsync>
  );
}

function Marketing() {
  const { p_from, p_to } = usePeriodArgs();
  const q = useAdmin('admin_marketing', { p_from, p_to });
  return (
    <AdminAsync query={q}>
      {(d) => (
        <>
          <KpiGrid>
            <Kpi label="Registros con código" value={d.totals.signups_with_code} />
            <Kpi label="Registros totales" value={d.totals.signups_total} />
            <Kpi label="Calificados" value={d.totals.qualified} />
            <Kpi label="Rechazados" value={d.totals.rejected} />
            <Kpi label="Instalaciones" value={null} unavailable={d.unavailable.installs} />
            <Kpi label="ROI" value={null} unavailable={d.unavailable.spend} />
          </KpiGrid>
          <Section
            title="Ranking de referidores"
            hint="Para medir influencers: un código de referido por cada uno"
          >
            <Rows
              empty="Nadie se registró con código en el período."
              rows={(d.referrers as Json[]).map((r) => ({
                key: r.referrer_id,
                label: `${r.username ?? '—'}${r.internal ? ' · interna' : ''}`,
                sub: `onboarding ${fmtInt(r.onboarded)} · 1.ª lección ${fmtInt(r.first_lesson)} · 1.ª partida ${fmtInt(r.first_battle)} · Plus ${fmtInt(r.paid_plus)} · retención D1–7 ${fmtPct(r.retained_d1_7)}`,
                value: fmtInt(r.signups),
                onPress: () => openUser(r.referrer_id),
              }))}
            />
          </Section>
          <Unavailable items={d.unavailable} />
        </>
      )}
    </AdminAsync>
  );
}

function Notifications() {
  const q = useAdmin('admin_notifications', usePeriodArgs());
  return (
    <AdminAsync query={q}>
      {(d) => (
        <>
          <KpiGrid>
            <Kpi label="Tokens activos" value={d.tokens.active} />
            <Kpi label="Tokens inactivos" value={d.tokens.inactive} />
            <Kpi
              label="Usuarios alcanzables"
              value={d.tokens.users_reachable}
              hint={`de ${fmtInt(d.tokens.users_total)}`}
            />
            <Kpi label="Apagaron desafíos" value={d.preferences.challenge_notifications_off} />
            <Kpi label="Push de desafío" value={d.challenge_pushes_sent} />
            <Kpi label="Abiertas / CTR" value={null} unavailable={d.unavailable.delivered_opened} />
          </KpiGrid>
          <Section title="Tokens por plataforma">
            <Rows
              rows={(d.tokens.by_platform as Json[]).map((r) => ({
                key: r.platform,
                label: platformName(r.platform),
                sub: `${fmtInt(r.inactive)} inactivos`,
                value: fmtInt(r.active),
              }))}
            />
          </Section>
          <Unavailable items={d.unavailable} />
        </>
      )}
    </AdminAsync>
  );
}

function Health() {
  const q = useAdmin('admin_health', {});
  return (
    <AdminAsync query={q}>
      {(d) => (
        <>
          <KpiGrid>
            <Kpi label="Partidas trabadas" value={d.battles.stuck.length} />
            <Kpi label="Abandono 7 días" value={d.battles.forfeit_rate_7d} format={fmtPct} />
            <Kpi label="Canceladas 7 días" value={d.battles.cancelled_7d} />
            <Kpi label="Cola activa" value={d.queue.active} />
            <Kpi label="Cola sin señal" value={d.queue.stale} />
            <Kpi label="Recálculos pendientes" value={d.learning_jobs.recompute_pending} />
            <Kpi label="Recálculos con error" value={d.learning_jobs.recompute_with_errors} />
            <Kpi label="Tamaño de la base" value={d.database.size_bytes} format={fmtBytes} />
            <Kpi label="Crashes" value={null} unavailable={d.unavailable.crashes} />
          </KpiGrid>
          <Section title="Versiones de la app (30 días)">
            <Rows
              empty="Sin sesiones con datos de cliente."
              rows={(d.app_versions_30d as Json[]).map((r, i) => ({
                key: String(i),
                label: `${platformName(r.platform)} ${r.app_version}`,
                sub: `contrato ${r.contract ?? '—'} · ${fmtInt(r.users)} usuarios`,
                value: fmtInt(r.sessions),
              }))}
            />
          </Section>
          <Section title="Partidas trabadas">
            <Rows
              empty="Ninguna. ✓"
              rows={(d.battles.stuck as Json[]).map((r) => ({
                key: r.battle_id,
                label: `${r.status} · ${langName(r.language)}`,
                sub: fmtDateTime(r.created_at),
                value: r.vs_bot ? 'bot' : '',
              }))}
            />
          </Section>
          <Section title="Trabajos de aprendizaje">
            <Rows
              empty="Sin corridas."
              rows={(d.learning_jobs.recent_runs as Json[]).map((r, i) => ({
                key: String(i),
                label: `${r.job} · ${r.status}`,
                sub: `${fmtDateTime(r.started_at)}${r.error ? ` · ${r.error}` : ''}`,
                value: `${fmtInt(r.processed)}/${fmtInt(r.failed)}`,
              }))}
            />
          </Section>
          <Section title="Consultas más lentas" hint="pg_stat_statements, promedio por llamada">
            <Rows
              empty="Sin datos."
              rows={((d.database.slow_queries ?? []) as Json[])
                .slice(0, 10)
                .map((r, i) => ({
                  key: String(i),
                  label: String(r.query).slice(0, 90),
                  sub: `${fmtInt(r.calls)} llamadas`,
                  value: `${fmtDec(r.mean_ms)} ms`,
                }))}
            />
          </Section>
          <Section title="Tablas más grandes">
            <Rows
              rows={(d.database.largest_tables as Json[]).map((r) => ({
                key: r.table,
                label: r.table,
                sub: `${fmtInt(r.rows_estimate)} filas (est.)`,
                value: fmtBytes(r.bytes),
              }))}
            />
          </Section>
          <Unavailable items={d.unavailable} />
        </>
      )}
    </AdminAsync>
  );
}

function Content() {
  const [lang, setLang] = useState<'' | 'en' | 'pt' | 'it' | 'zh' | 'fr' | 'es'>('en');
  const q = useAdmin('admin_content', { p_language: lang || null });
  return (
    <AdminAsync query={q}>
      {(d) => (
        <>
          <Section title="Idiomas">
            <Rows
              rows={(d.languages as Json[]).map((l) => ({
                key: l.code,
                label: `${langName(l.code)} · ${l.content_status ?? '—'}${l.available ? '' : ' · no disponible'}${l.ranked_available ? ' · Ranked' : ''}`,
                sub: `unidades ${fmtInt(l.units_published)}/${fmtInt(l.units)} · lecciones ${fmtInt(l.lessons_published)}/${fmtInt(l.lessons)} · ejercicios ${fmtInt(l.exercises_published)}/${fmtInt(l.exercises)} · niveles ${(l.levels as string[]).sort().join(' ')}`,
                value: `${fmtInt(l.learners)} usuarios`,
              }))}
            />
          </Section>
          <Section title="Cursos">
            <Rows
              rows={(d.courses as Json[]).map((c) => ({
                key: c.code,
                label: `${langName(c.target)} desde ${langName(c.source)}`,
                sub: c.code,
                value: `${fmtInt(c.enrolled)} inscriptos`,
              }))}
            />
          </Section>
          <KpiGrid>
            <Kpi label="Avatares por revisar" value={d.reports.avatar_pending} />
            <Kpi
              label="Errores de contenido"
              value={null}
              unavailable={d.unavailable.content_error_reports}
            />
          </KpiGrid>
          <Section title="Unidades" hint="Empezaron / completaron (usuarios reales)">
            <Chips
              options={(['en', 'pt', 'it', 'zh', 'fr', 'es'] as const).map((l) => ({
                id: l,
                label: langName(l),
              }))}
              value={lang}
              onChange={setLang}
            />
            <Rows
              rows={(d.units as Json[]).map((u) => ({
                key: u.unit_id,
                label: `${u.level} · ${u.position}. ${u.title ?? u.unit_id}`,
                sub: `${u.published ? 'publicada' : 'borrador'} · revisión ${u.review_status ?? '—'} · ${fmtInt(u.lessons_published)} lecciones · ${fmtInt(u.users_started)} empezaron`,
                value: `${fmtInt(u.users_completed)} · ${fmtPct(u.completion_pct)}`,
              }))}
            />
          </Section>
        </>
      )}
    </AdminAsync>
  );
}

function Audit() {
  const q = useAdmin('admin_audit', { p_limit: 50, p_offset: 0 });
  const EVENT: Record<string, string> = {
    access_granted: 'Acceso concedido',
    denied_not_admin: 'Denegado: no es admin',
    denied_mfa: 'Denegado: falta MFA',
  };
  return (
    <AdminAsync query={q}>
      {(d) => (
        <>
          <KpiGrid>
            <Kpi label="Superadmins" value={d.superadmins.length} />
            <Kpi label="Denegaciones 24 h" value={d.denied_24h} />
            <Kpi label="Acciones registradas" value={d.actions_total} />
          </KpiGrid>
          <Section title="Superadmin y cuentas internas">
            <Rows
              rows={(d.superadmins as Json[]).map((s) => ({
                key: s.user_id,
                label: `Superadmin: ${s.label}`,
                sub: s.user_id,
                value: '',
              }))}
            />
            <Rows
              rows={(d.internal_accounts as Json[]).map((s) => ({
                key: s.user_id,
                label: `Interna: ${s.label}`,
                sub: s.user_id,
                value: '',
                onPress: () => openUser(s.user_id),
              }))}
            />
          </Section>
          <Section title="Eventos de seguridad">
            <Rows
              empty="Sin eventos."
              rows={(d.security_events as Json[]).map((e) => ({
                key: String(e.id),
                label: EVENT[e.event] ?? e.event,
                sub: `${fmtDateTime(e.created_at)} · ${e.username ?? String(e.user_id ?? '—').slice(0, 8)} · ${e.aal ?? '—'}`,
                value: '',
              }))}
            />
          </Section>
          <Section title="Auditoría del panel" hint="últimas 50 consultas">
            <Rows
              empty="Sin acciones."
              rows={(d.actions as Json[]).map((a) => ({
                key: String(a.id),
                label: a.action,
                sub: `${fmtDateTime(a.created_at)}${a.params ? ` · ${JSON.stringify(a.params).slice(0, 80)}` : ''}`,
                value: '',
              }))}
            />
          </Section>
        </>
      )}
    </AdminAsync>
  );
}

// ---------------------------------------------------------------------------------------------

export function UserDetailView({ id }: { id: string }) {
  const q = useAdmin('admin_user_detail', { p_user: id });
  const battles = useAdmin('admin_user_battles', { p_user: id, p_limit: 20, p_offset: 0 });
  return (
    <AdminAsync query={q}>
      {(d) => {
        if (!d) return <Text variant="body">Usuario no encontrado.</Text>;
        const p = d.profile;
        const RESULT: Record<string, string> = { win: 'Victoria', loss: 'Derrota', draw: 'Empate' };
        return (
          <>
            <Text variant="title">{p.username ?? 'Sin username'}</Text>
            <Text variant="caption">
              {p.display_name ? `${p.display_name} · ` : ''}
              {p.internal ? 'Cuenta interna' : 'Usuario real'}
              {p.superadmin ? ' · Superadmin' : ''}
            </Text>
            <KpiGrid>
              <Kpi label="Plan" value={d.plan === 'plus' ? 'Plus' : 'Free'} format={String} />
              <Kpi
                label="Nivel"
                value={d.xp?.level ?? null}
                hint={d.xp ? `${fmtInt(d.xp.total_xp)} XP` : undefined}
              />
              <Kpi
                label="Racha"
                value={d.streak?.current ?? 0}
                hint={`mejor: ${fmtInt(d.streak?.best ?? 0)}`}
              />
              <Kpi label="Lecciones" value={d.learning.lessons_completed} />
              <Kpi label="Repasos" value={d.learning.reviews_completed} />
              <Kpi label="Precisión" value={d.learning.accuracy} format={fmtPct} />
              <Kpi label="Partidas" value={battles.data?.total ?? null} />
              <Kpi label="Polys" value={d.polys} />
            </KpiGrid>
            <Section title="Perfil">
              <Rows
                rows={[
                  { key: 'id', label: 'ID', sub: p.id, value: '' },
                  { key: 'reg', label: 'Registro', value: fmtDateTime(p.created_at) },
                  {
                    key: 'onb',
                    label: 'Onboarding',
                    value: p.onboarding_completed_at
                      ? fmtDateTime(p.onboarding_completed_at)
                      : 'sin completar',
                  },
                  {
                    key: 'login',
                    label: 'Último login',
                    value: fmtDateTime(d.auth?.last_sign_in_at),
                  },
                  { key: 'seen', label: 'Última presencia', value: fmtDateTime(d.presence) },
                  {
                    key: 'prov',
                    label: 'Acceso con',
                    value: (d.auth?.providers ?? []).join(', ') || '—',
                  },
                  { key: 'country', label: 'País', value: countryName(p.country) },
                  { key: 'platform', label: 'Plataforma', value: platformName(p.platform) },
                  { key: 'ui', label: 'Idioma de la app', value: langName(p.interface_language) },
                  { key: 'target', label: 'Idioma objetivo', value: langName(p.target_language) },
                  { key: 'course', label: 'Curso activo', value: p.active_course ?? '—' },
                  {
                    key: 'acq',
                    label: 'Adquisición',
                    value:
                      d.acquisition.source === 'referral'
                        ? `referido por ${d.social.referred_by ?? '—'}`
                        : 'desconocida',
                  },
                  { key: 'friends', label: 'Amigos', value: fmtInt(d.social.friends) },
                  { key: 'ach', label: 'Logros', value: fmtInt(d.achievements) },
                ]}
              />
            </Section>
            <Section title="Ranked por idioma">
              <Rows
                empty="Sin rating."
                rows={(d.ratings as Json[]).map((r) => ({
                  key: r.language,
                  label: `${langName(r.language)} · ${tierName(r.tier)}`,
                  sub: `${fmtInt(r.games)} partidas · ${fmtInt(r.wins)}V ${fmtInt(r.losses)}D · pico ${fmtInt(r.peak)}`,
                  value: fmtInt(r.rating),
                }))}
              />
            </Section>
            <Section title="Suscripción" hint="estado actual">
              <Rows
                empty="Nunca tuvo Plus."
                rows={(d.entitlements as Json[]).map((e, i) => ({
                  key: String(i),
                  label: `${e.entitlement} · ${e.source}`,
                  sub: `${e.product_id ?? '—'} · desde ${fmtDateTime(e.starts_at)} · vence ${fmtDateTime(e.expires_at)} · renueva ${e.will_renew === null ? '—' : e.will_renew ? 'sí' : 'no'}`,
                  value: '',
                }))}
              />
            </Section>
            <Section title="Historial de aprendizaje" hint="últimas 20 sesiones">
              <Rows
                empty="Sin sesiones."
                rows={(d.recent_sessions as Json[]).map((s, i) => ({
                  key: String(i),
                  label: s.kind === 'lesson' ? (s.lesson_title ?? 'Lección') : 'Repaso',
                  sub: `${fmtDateTime(s.completed_at)} · ${fmtInt(s.answers)} respuestas · ${fmtSeconds(s.duration_seconds)}`,
                  value: fmtPct(s.first_try_accuracy),
                }))}
              />
            </Section>
            <Section title="Historial de partidas" hint="últimas 20">
              <AdminAsync query={battles}>
                {(b) => (
                  <Rows
                    empty="Sin partidas."
                    rows={(b.rows as Json[]).map((r) => ({
                      key: r.battle_id,
                      label: `${RESULT[r.result] ?? '—'} vs ${r.opponent ?? '—'}${r.opponent_is_bot ? ' (bot)' : ''}`,
                      sub: `${fmtDateTime(r.created_at)} · ${langName(r.language)} · ${!r.ranked ? 'amistosa' : 'ranked'} · ${r.status} · ${r.score ?? '—'}–${r.opponent_score ?? '—'}`,
                      value:
                        r.rating_after != null && r.rating_before != null
                          ? `${r.rating_before}→${r.rating_after}`
                          : '—',
                    }))}
                  />
                )}
              </AdminAsync>
            </Section>
          </>
        );
      }}
    </AdminAsync>
  );
}
