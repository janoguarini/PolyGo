import { HBars, LineChart } from '../components/charts.tsx';
import { DataTable } from '../components/DataTable.tsx';
import { Async, Card, Kpi, PageHead, Unavailable } from '../components/ui.tsx';
import { fmtInt, fmtPct, platformName } from '../lib/format.ts';
import { useRpc } from '../lib/rpc.ts';
import { navigate } from '../lib/router.ts';
import { SectionTitle, usePeriodArgs, type Json } from './shared.tsx';

export function Social() {
  const { args, refreshKey } = usePeriodArgs();
  const state = useRpc<Json>('admin_social', args, refreshKey);
  return (
    <>
      <PageHead title="Social">Amistades, desafíos entre amigos y referidos de usuarios reales.</PageHead>
      <Async state={state} rows={6}>
        {(d) => {
          const f = d.friendships;
          const c = d.challenges;
          const r = d.referrals;
          const r7 = d.retention_d1_7;
          return (
            <>
              <SectionTitle>Amistades</SectionTitle>
              <div className="grid kpis">
                <Kpi label="Amistades totales" value={f.accepted_total} formula="Pares aceptados hoy (iniciados por un usuario real)." />
                <Kpi label="Pendientes" value={f.pending_total} />
                <Kpi label="Solicitudes enviadas" value={f.requests_sent} formula="friendships creadas en el período." />
                <Kpi label="Aceptadas" value={f.accepted} formula="Respondidas (responded_at) en el período con status accepted." />
                <Kpi label="Rechazadas" value={f.declined} />
                <Kpi metric="acceptance_rate" value={f.acceptance_rate} format={fmtPct} />
                <Kpi metric="socially_active_users" value={d.socially_active_users} />
              </div>
              <SectionTitle>Desafíos</SectionTitle>
              <div className="grid kpis">
                <Kpi label="Creados" value={c.created} />
                <Kpi label="Aceptados" value={c.accepted} formula="Con guest_id (alguien entró al desafío)." />
                <Kpi label="Jugados" value={c.played} formula="Con battle_id." />
                <Kpi label="Completados" value={c.completed} />
                <Kpi label="Abandonados" value={c.abandoned} formula="La partida terminó en forfeited." />
                <Kpi label="Rechazados" value={c.declined} />
                <Kpi label="Cancelados" value={c.cancelled} />
                <Kpi label="Vencidos" value={c.expired} formula="Sin rival, sin cancelar ni rechazar, y expires_at ya pasó." />
              </div>
              <SectionTitle>Referidos</SectionTitle>
              <div className="grid kpis">
                <Kpi label="Registros con código" value={r.attributed} />
                <Kpi label="Calificados" value={r.qualified} />
                <Kpi label="Pendientes" value={r.pending} />
                <Kpi label="Rechazados" value={r.rejected} />
              </div>
              <Card title="¿Qué función social retiene más?" info="% de usuarios activos algún día entre el 1 y el 7 tras registrarse, según tengan amigos o desafíos (hoy). Base: usuarios registrados hace más de 8 días.">
                <HBars
                  showShare={false}
                  format={fmtPct}
                  items={[
                    { key: 'wf', label: 'Con amigos', value: Number(r7.with_friends ?? 0) },
                    { key: 'nf', label: 'Sin amigos', value: Number(r7.without_friends ?? 0) },
                    { key: 'wc', label: 'Con desafíos', value: Number(r7.with_challenges ?? 0) },
                    { key: 'nc', label: 'Sin desafíos', value: Number(r7.without_challenges ?? 0) },
                  ]}
                />
                <p className="muted" style={{ fontSize: 12, marginBottom: 0 }}>
                  Base: {fmtInt(r7.base_users)} usuarios. Es una correlación, no prueba causa: quien ya está enganchado suma amigos.
                </p>
              </Card>
              <Card title="Evolución">
                <LineChart
                  data={d.series}
                  series={[
                    { key: 'requests', label: 'Solicitudes' },
                    { key: 'challenges', label: 'Desafíos' },
                  ]}
                  csvName="social"
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

export function Monetization() {
  const { args, refreshKey } = usePeriodArgs();
  const state = useRpc<Json>('admin_monetization', args, refreshKey);
  return (
    <>
      <PageHead title="Monetización">
        Suscripciones Plus desde la base (estado actual). Ingresos, MRR y AdMob llegan con integraciones verificadas (Etapa B): no se estiman.
      </PageHead>
      <Async state={state} rows={6}>
        {(d) => {
          const p = d.plus;
          const u = d.unavailable;
          return (
            <>
              <SectionTitle>Plus</SectionTitle>
              <div className="grid kpis">
                <Kpi metric="paid_plus_users" value={p.active_paid} />
                <Kpi metric="plus_users" value={p.active_any_source} />
                <Kpi metric="paid_subs_started" value={p.started_in_period} />
                <Kpi metric="expired_in_period" value={p.expired_in_period} />
                <Kpi metric="will_not_renew" value={p.will_not_renew} />
                <Kpi metric="billing_issues" value={p.billing_issues} />
                <Kpi metric="conversion_paid_pct" value={p.conversion_paid_pct} format={fmtPct} />
                <Kpi label="Sin publicidad (ad_free)" value={p.ad_free_active} />
                <Kpi label="Mensuales" value={p.monthly_vs_annual?.monthly} formula="Plus pago vigente cuyo product_id contiene «month»." />
                <Kpi label="Anuales" value={p.monthly_vs_annual?.annual} formula="Plus pago vigente cuyo product_id contiene «year» o «annual»." />
              </div>
              <SectionTitle>Ingresos (fuentes externas)</SectionTitle>
              <div className="grid kpis">
                <Kpi label="MRR" value={null} unavailable={u.mrr} />
                <Kpi label="ARR" value={null} unavailable={u.arr} />
                <Kpi label="Ingresos Plus" value={null} unavailable={u.revenue} />
                <Kpi label="Reembolsos" value={null} unavailable={u.refunds} />
                <Kpi label="ARPU / ARPPU" value={null} unavailable={u.arpu} />
                <Kpi label="LTV estimado" value={null} unavailable={u.ltv} />
                <Kpi label="Ingresos publicitarios" value={null} unavailable={u.ads} />
                <Kpi label="Costos de infraestructura" value={null} unavailable={u.infra_costs} />
              </div>
              <div className="grid cols-3">
                <Card title="Plus vigente por fuente" info="Manual, promocional y referido NO son ingresos.">
                  <HBars items={(p.by_source as Json[]).map((r) => ({ key: r.source, label: r.source, value: Number(r.active) }))} />
                </Card>
                <Card title="Plus pago por producto">
                  <HBars items={(p.by_product as Json[]).map((r) => ({ key: r.product, label: r.product, value: Number(r.active) }))} />
                </Card>
                <Card title="Plus pago por tienda">
                  <HBars items={(p.by_store as Json[]).map((r) => ({ key: r.store, label: r.store === 'app_store' ? 'App Store' : 'Google Play', value: Number(r.active) }))} />
                </Card>
              </div>
              <Card title="Embudo del paywall">
                <p className="muted" style={{ margin: 0 }}>
                  Sin datos: {u.paywall_funnel}
                </p>
              </Card>
              <Card title="Notas sobre estos números">
                <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-secondary)' }}>
                  {Object.values(d.notes as Record<string, string>).map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </Card>
              <Unavailable items={u} />
            </>
          );
        }}
      </Async>
    </>
  );
}

export function Marketing() {
  const { args, refreshKey } = usePeriodArgs();
  const state = useRpc<Json>('admin_marketing', { p_from: args.p_from, p_to: args.p_to }, refreshKey);
  return (
    <>
      <PageHead title="Marketing y referidos">
        Lo único atribuible con certeza hoy son los códigos de referido. No se atribuyen registros ni ingresos sin una fuente confiable.
      </PageHead>
      <Async state={state} rows={5}>
        {(d) => (
          <>
            <div className="grid kpis">
              <Kpi label="Registros con código" value={d.totals.signups_with_code} />
              <Kpi label="Registros totales" value={d.totals.signups_total} />
              <Kpi label="% con código" value={Number(d.totals.signups_total) > 0 ? (100 * Number(d.totals.signups_with_code)) / Number(d.totals.signups_total) : null} format={fmtPct} formula="Registros con referral_attributions / registros del período (sin cuentas internas)." />
              <Kpi label="Calificados" value={d.totals.qualified} />
              <Kpi label="Rechazados" value={d.totals.rejected} />
              <Kpi label="Instalaciones" value={null} unavailable={d.unavailable.installs} />
              <Kpi label="Costo por registro" value={null} unavailable={d.unavailable.spend} />
              <Kpi label="ROI por influencer" value={null} unavailable={d.unavailable.spend} />
            </div>
            <Card title="Ranking de referidores" info="Para medir influencers hoy: darle a cada uno su código de referido. Retención = activos algún día entre el 1 y el 7, sobre los invitados que ya cumplieron 8 días.">
              <DataTable
                csvName="referidores"
                rows={d.referrers}
                onRowClick={(r) => navigate('users', String(r.referrer_id))}
                empty="Nadie se registró con código en el período."
                columns={[
                  { key: 'username', label: 'Referidor', render: (r) => <>{String(r.username ?? '—')} {r.internal ? <span className="chip chip-warn">interna</span> : null}</> },
                  { key: 'codes', label: 'Código', value: (r) => (r.codes as string[]).join(' ') },
                  { key: 'signups', label: 'Registros', num: true },
                  { key: 'onboarded', label: 'Onboarding', num: true },
                  { key: 'first_lesson', label: '1.ª lección', num: true },
                  { key: 'first_battle', label: '1.ª partida', num: true },
                  { key: 'paid_plus', label: 'Plus pago', num: true },
                  { key: 'qualified', label: 'Calificados', num: true },
                  { key: 'retained_d1_7', label: 'Retención D1–7', num: true, render: (r) => fmtPct(r.retained_d1_7) },
                ]}
              />
            </Card>
            <Unavailable items={d.unavailable} />
          </>
        )}
      </Async>
    </>
  );
}

export function Notifications() {
  const { args, refreshKey } = usePeriodArgs();
  const state = useRpc<Json>('admin_notifications', args, refreshKey);
  return (
    <>
      <PageHead title="Notificaciones">
        Lo que hay en la base: tokens de push y avisos de desafío. Entregas y aperturas están en PostHog (Etapa B).
      </PageHead>
      <Async state={state}>
        {(d) => (
          <>
            <div className="grid kpis">
              <Kpi label="Tokens activos" value={d.tokens.active} />
              <Kpi label="Tokens inactivos" value={d.tokens.inactive} formula="push_tokens con active = false (dados de baja o inválidos)." />
              <Kpi label="Usuarios alcanzables" value={d.tokens.users_reachable} foot={<span>de {fmtInt(d.tokens.users_total)}</span>} />
              <Kpi label="Apagaron desafíos" value={d.preferences.challenge_notifications_off} formula="user_settings.notify_challenges = false." />
              <Kpi label="Push de desafío enviados" value={d.challenge_pushes_sent} formula="friend_challenges con notified_at en el período." />
              <Kpi label="Enviadas (todas)" value={null} unavailable={d.unavailable.sent} />
              <Kpi label="Abiertas / CTR" value={null} unavailable={d.unavailable.delivered_opened} />
              <Kpi label="Retorno tras push" value={null} unavailable={d.unavailable.return_after_push} />
            </div>
            <Card title="Tokens por plataforma">
              <DataTable
                rows={d.tokens.by_platform}
                columns={[
                  { key: 'platform', label: 'Plataforma', render: (r) => platformName(r.platform) },
                  { key: 'active', label: 'Activos', num: true },
                  { key: 'inactive', label: 'Inactivos', num: true },
                ]}
              />
            </Card>
            <Unavailable items={d.unavailable} />
          </>
        )}
      </Async>
    </>
  );
}
