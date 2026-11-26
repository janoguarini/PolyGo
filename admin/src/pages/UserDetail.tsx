import { useEffect, useState } from 'react';

import { DataTable } from '../components/DataTable.tsx';
import { Async, Card, Empty, Kpi, PageHead } from '../components/ui.tsx';
import { usePanel } from '../lib/context.tsx';
import { countryName, fmtDateTime, fmtInt, fmtPct, fmtSeconds, langName, platformName, tierName } from '../lib/format.ts';
import { addDays, localDate } from '../lib/period.ts';
import { useRpc } from '../lib/rpc.ts';
import type { Json } from './shared.tsx';

export function UserDetail({ userId, onTitle }: { userId: string; onTitle: (t: string) => void }) {
  const { refreshKey } = usePanel();
  const state = useRpc<Json>('admin_user_detail', { p_user: userId }, refreshKey);
  const [offset, setOffset] = useState(0);
  const battles = useRpc<Json>('admin_user_battles', { p_user: userId, p_limit: 20, p_offset: offset }, refreshKey);
  const title = state.data?.profile ? (state.data.profile.username ?? state.data.profile.id) : null;
  useEffect(() => {
    if (title) onTitle(String(title));
  }, [title, onTitle]);

  return (
    <Async state={state} rows={8}>
      {(d) => {
        if (!d) return <Empty>Usuario no encontrado.</Empty>;
        const p = d.profile;
        const activeDays = new Set((d.activity_90d as Json[]).map((a) => a.day));
        const today = localDate();
        const days = Array.from({ length: 90 }, (_, i) => addDays(today, i - 89));
        return (
          <>
            <PageHead title={p.username ?? 'Sin username'}>
              {p.display_name ? `${p.display_name} · ` : ''}
              {p.internal ? 'Cuenta interna (excluida de las métricas)' : 'Usuario real'}
              {p.superadmin ? ' · Superadmin' : ''}
            </PageHead>
            <div className="grid kpis">
              <Kpi label="Plan" value={d.plan === 'plus' ? 'Plus' : 'Free'} format={String} />
              <Kpi label="Nivel" value={d.xp?.level ?? null} foot={d.xp ? <span>{fmtInt(d.xp.total_xp)} XP</span> : undefined} />
              <Kpi label="Racha actual" value={d.streak?.current ?? 0} foot={<span>mejor: {fmtInt(d.streak?.best ?? 0)} días</span>} />
              <Kpi label="Lecciones completadas" value={d.learning.lessons_completed} foot={<span>{fmtInt(d.learning.distinct_lessons)} distintas</span>} />
              <Kpi label="Repasos" value={d.learning.reviews_completed} />
              <Kpi label="Precisión" value={d.learning.accuracy} format={fmtPct} foot={<span>{fmtInt(d.learning.answers)} respuestas</span>} />
              <Kpi label="Partidas" value={battles.data?.total ?? null} />
              <Kpi label="Polys" value={d.polys} />
            </div>
            <div className="grid cols-2">
              <Card title="Perfil">
                <dl className="kv">
                  <dt>ID</dt>
                  <dd className="mono">{p.id}</dd>
                  <dt>Código público</dt>
                  <dd className="mono">{p.public_code ?? '—'}</dd>
                  <dt>Registro</dt>
                  <dd>{fmtDateTime(p.created_at)}</dd>
                  <dt>Onboarding</dt>
                  <dd>{p.onboarding_completed_at ? fmtDateTime(p.onboarding_completed_at) : 'sin completar'}</dd>
                  <dt>Último login</dt>
                  <dd>{fmtDateTime(d.auth?.last_sign_in_at)}</dd>
                  <dt>Última presencia</dt>
                  <dd>{fmtDateTime(d.presence)}</dd>
                  <dt>Acceso con</dt>
                  <dd>{(d.auth?.providers ?? []).join(', ') || '—'}{d.auth?.email_confirmed ? ' · email confirmado' : ''}</dd>
                  <dt>País</dt>
                  <dd>{countryName(p.country ?? '??')} <span className="muted">(lo elige el usuario)</span></dd>
                  <dt>Plataforma</dt>
                  <dd>{platformName(p.platform)}</dd>
                  <dt>Idioma de la app</dt>
                  <dd>{langName(p.interface_language)}</dd>
                  <dt>Idioma objetivo</dt>
                  <dd>{langName(p.target_language)}</dd>
                  <dt>Curso activo</dt>
                  <dd>{p.active_course ?? '—'}</dd>
                  <dt>Meta diaria</dt>
                  <dd>{p.daily_goal_minutes ? `${p.daily_goal_minutes} min` : '—'}</dd>
                  <dt>Adquisición</dt>
                  <dd>
                    {d.acquisition.source === 'referral'
                      ? `Referido por ${d.social.referred_by ?? '—'}`
                      : 'Desconocida'}{' '}
                    <span className="muted">({d.acquisition.note})</span>
                  </dd>
                </dl>
              </Card>
              <div className="grid">
                <Card title="Actividad (últimos 90 días)" info="Cada cuadro es un día; violeta = completó una lección/repaso o jugó.">
                  <div className="heat" aria-label={`${activeDays.size} días activos de 90`}>
                    {days.map((day) => (
                      <i key={day} className={activeDays.has(day) ? 'on' : undefined} title={day} />
                    ))}
                  </div>
                  <p className="muted" style={{ margin: '8px 0 0', fontSize: 12 }}>
                    {activeDays.size} días activos de 90
                  </p>
                </Card>
                <Card title="Ranked por idioma">
                  <DataTable
                    rows={d.ratings}
                    empty="Sin rating."
                    columns={[
                      { key: 'language', label: 'Idioma', render: (r) => langName(r.language) },
                      { key: 'rating', label: 'ELO', num: true },
                      { key: 'tier', label: 'Liga', render: (r) => tierName(r.tier) },
                      { key: 'peak', label: 'Pico', num: true },
                      { key: 'games', label: 'Partidas', num: true },
                      { key: 'wins', label: 'V', num: true },
                      { key: 'losses', label: 'D', num: true },
                      { key: 'best_win_streak', label: 'Mejor racha', num: true },
                    ]}
                  />
                </Card>
                <Card title="Social">
                  <dl className="kv">
                    <dt>Amigos</dt>
                    <dd>{fmtInt(d.social.friends)}</dd>
                    <dt>Desafíos creados</dt>
                    <dd>{fmtInt(d.social.challenges_hosted)}</dd>
                    <dt>Referidos</dt>
                    <dd>
                      {fmtInt(d.social.referrals)} ({fmtInt(d.social.referrals_qualified)} calificados)
                    </dd>
                    <dt>Logros</dt>
                    <dd>{fmtInt(d.achievements)}</dd>
                    <dt>Push</dt>
                    <dd>
                      {(d.push_tokens as Json[]).filter((t) => t.active).length} dispositivos activos
                      {d.settings?.notify_challenges === false ? ' · desafíos apagados' : ''}
                    </dd>
                  </dl>
                </Card>
              </div>
            </div>
            <Card title="Suscripción" info="Estado actual de user_entitlements (no hay historial de cambios todavía).">
              <DataTable
                rows={d.entitlements}
                empty="Nunca tuvo Plus."
                columns={[
                  { key: 'entitlement', label: 'Beneficio' },
                  { key: 'source', label: 'Fuente' },
                  { key: 'product_id', label: 'Producto' },
                  { key: 'starts_at', label: 'Inicio', render: (r) => fmtDateTime(r.starts_at) },
                  { key: 'expires_at', label: 'Vence', render: (r) => fmtDateTime(r.expires_at) },
                  { key: 'will_renew', label: 'Renueva' },
                  { key: 'billing_issue_at', label: 'Problema de cobro', render: (r) => fmtDateTime(r.billing_issue_at) },
                ]}
              />
            </Card>
            <Card title="Cursos">
              <DataTable
                rows={d.courses}
                empty="Sin cursos."
                columns={[
                  { key: 'course', label: 'Curso' },
                  { key: 'start_level', label: 'Nivel inicial' },
                  { key: 'placement_level', label: 'Nivel por test' },
                  { key: 'enrolled_at', label: 'Inscripción', render: (r) => fmtDateTime(r.enrolled_at) },
                  { key: 'last_selected_at', label: 'Último uso', render: (r) => fmtDateTime(r.last_selected_at) },
                ]}
              />
            </Card>
            <Card title="Historial de aprendizaje" sub="últimas 20 sesiones">
              <DataTable
                csvName={`aprendizaje-${p.username ?? p.id}`}
                rows={d.recent_sessions}
                empty="Sin sesiones."
                columns={[
                  { key: 'completed_at', label: 'Fecha', render: (r) => fmtDateTime(r.completed_at) },
                  { key: 'kind', label: 'Tipo', render: (r) => (r.kind === 'lesson' ? 'Lección' : 'Repaso') },
                  { key: 'lesson_title', label: 'Lección' },
                  { key: 'answers', label: 'Respuestas', num: true },
                  { key: 'first_try_accuracy', label: 'Precisión 1.er intento', num: true, render: (r) => fmtPct(r.first_try_accuracy) },
                  { key: 'duration_seconds', label: 'Duración', num: true, render: (r) => fmtSeconds(r.duration_seconds) },
                ]}
              />
            </Card>
            <Card title="Historial de partidas">
              <Async state={battles} rows={4}>
                {(b) => (
                  <>
                    <DataTable
                      csvName={`partidas-${p.username ?? p.id}`}
                      rows={b.rows}
                      empty="Sin partidas."
                      columns={[
                        { key: 'created_at', label: 'Fecha', render: (r) => fmtDateTime(r.created_at) },
                        { key: 'language', label: 'Idioma', render: (r) => langName(r.language) },
                        { key: 'type', label: 'Tipo', value: (r) => (!r.ranked ? 'Amistosa' : r.vs_bot ? 'Ranked vs bot' : 'Ranked') },
                        { key: 'status', label: 'Estado' },
                        { key: 'result', label: 'Resultado', render: (r) => ({ win: 'Victoria', loss: 'Derrota', draw: 'Empate' } as Record<string, string>)[String(r.result)] ?? '—' },
                        { key: 'score', label: 'Puntos', num: true, render: (r) => `${r.score ?? '—'} – ${r.opponent_score ?? '—'}` },
                        { key: 'opponent', label: 'Rival', render: (r) => `${r.opponent ?? '—'}${r.opponent_is_bot ? ' (bot)' : ''}` },
                        { key: 'delta', label: 'ELO', num: true, value: (r) => (r.rating_after != null && r.rating_before != null ? Number(r.rating_after) - Number(r.rating_before) : null), render: (r) => (r.rating_after != null && r.rating_before != null ? `${r.rating_before} → ${r.rating_after}` : '—') },
                      ]}
                    />
                    <div className="pager">
                      <span>{fmtInt(b.total)} partidas</span>
                      <button className="btn" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - 20))}>
                        ← Anterior
                      </button>
                      <button className="btn" disabled={offset + 20 >= b.total} onClick={() => setOffset(offset + 20)}>
                        Siguiente →
                      </button>
                    </div>
                  </>
                )}
              </Async>
            </Card>
          </>
        );
      }}
    </Async>
  );
}
