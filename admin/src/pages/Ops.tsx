import { useState } from 'react';

import { DataTable } from '../components/DataTable.tsx';
import { Async, Card, Kpi, PageHead, Unavailable } from '../components/ui.tsx';
import { usePanel } from '../lib/context.tsx';
import { fmtBytes, fmtDateTime, fmtInt, fmtPct, langName, platformName } from '../lib/format.ts';
import { useRpc } from '../lib/rpc.ts';
import { navigate } from '../lib/router.ts';
import { SectionTitle, type Json } from './shared.tsx';

export function Health() {
  const { refreshKey } = usePanel();
  const state = useRpc<Json>('admin_health', {}, refreshKey);
  return (
    <>
      <PageHead title="Salud técnica">
        Lo observable desde la base. Crashes, logs de Auth y Edge Functions, latencia y costos llegan con la Etapa B.
      </PageHead>
      <Async state={state} rows={6}>
        {(d) => (
          <>
            <div className="grid kpis">
              <Kpi label="Partidas trabadas" value={d.battles.stuck.length} formula="En curso hace más de 1 hora." invert />
              <Kpi label="Abandono 7 días" value={d.battles.forfeit_rate_7d} format={fmtPct} formula="forfeited / (completed + forfeited) de los últimos 7 días (todas las partidas)." />
              <Kpi label="Canceladas 7 días" value={d.battles.cancelled_7d} />
              <Kpi label="Cola Ranked activa" value={d.queue.active} />
              <Kpi label="Cola sin señal" value={d.queue.stale} formula="Entradas activas sin señal hace más de 10 minutos." />
              <Kpi label="Recálculos pendientes" value={d.learning_jobs.recompute_pending} formula="knowledge_recompute_queue sin processed_at." />
              <Kpi label="Recálculos con error" value={d.learning_jobs.recompute_with_errors} />
              <Kpi label="Tamaño de la base" value={d.database.size_bytes} format={fmtBytes} />
              <Kpi label="Crashes" value={null} unavailable={d.unavailable.crashes} />
              <Kpi label="Errores de login" value={null} unavailable={d.unavailable.auth_errors} />
              <Kpi label="Latencia P95" value={null} unavailable={d.unavailable.api_latency} />
            </div>
            <div className="grid cols-2">
              <Card title="Versiones de la app (30 días)" info="Por learning_session_clients: plataforma y versión de la app en cada sesión de aprendizaje.">
                <DataTable
                  rows={d.app_versions_30d}
                  empty="Sin sesiones con datos de cliente."
                  columns={[
                    { key: 'platform', label: 'Plataforma', render: (r) => platformName(r.platform) },
                    { key: 'app_version', label: 'Versión' },
                    { key: 'contract', label: 'Contrato', num: true },
                    { key: 'sessions', label: 'Sesiones', num: true },
                    { key: 'users', label: 'Usuarios', num: true },
                  ]}
                />
              </Card>
              <Card title="Política de versión mínima">
                <DataTable
                  rows={d.client_policy}
                  columns={[
                    { key: 'platform', label: 'Plataforma', render: (r) => platformName(r.platform) },
                    { key: 'min_version', label: 'Mínima' },
                    { key: 'min_curriculum_api', label: 'API currículo', num: true },
                    { key: 'updated_at', label: 'Actualizada', render: (r) => fmtDateTime(r.updated_at) },
                  ]}
                />
              </Card>
              <Card title="Partidas trabadas">
                <DataTable
                  rows={d.battles.stuck}
                  empty="Ninguna. ✓"
                  columns={[
                    { key: 'battle_id', label: 'Partida', render: (r) => <span className="mono">{String(r.battle_id).slice(0, 8)}</span> },
                    { key: 'status', label: 'Estado' },
                    { key: 'language', label: 'Idioma', render: (r) => langName(r.language) },
                    { key: 'vs_bot', label: 'Bot' },
                    { key: 'created_at', label: 'Creada', render: (r) => fmtDateTime(r.created_at) },
                  ]}
                />
              </Card>
              <Card title="Trabajos de aprendizaje" sub="últimas 20 corridas">
                <DataTable
                  rows={d.learning_jobs.recent_runs}
                  empty="Sin corridas registradas."
                  columns={[
                    { key: 'job', label: 'Trabajo' },
                    { key: 'started_at', label: 'Inicio', render: (r) => fmtDateTime(r.started_at) },
                    { key: 'status', label: 'Estado' },
                    { key: 'processed', label: 'Procesados', num: true },
                    { key: 'failed', label: 'Fallidos', num: true },
                    { key: 'error', label: 'Error' },
                  ]}
                />
              </Card>
            </div>
            <SectionTitle>Base de datos</SectionTitle>
            <div className="grid cols-2">
              <Card title="Consultas más lentas" info="pg_stat_statements (promedio por llamada, ≥ 5 llamadas, roles de la API). Los valores literales vienen normalizados.">
                {d.database.slow_queries === null ? (
                  <p className="muted">pg_stat_statements no está disponible para esta consulta.</p>
                ) : (
                  <DataTable
                    rows={d.database.slow_queries}
                    empty="Sin consultas registradas."
                    columns={[
                      { key: 'query', label: 'Consulta', render: (r) => <span className="mono" style={{ whiteSpace: 'normal' }}>{String(r.query)}</span> },
                      { key: 'calls', label: 'Llamadas', num: true },
                      { key: 'mean_ms', label: 'Media (ms)', num: true },
                      { key: 'total_ms', label: 'Total (ms)', num: true },
                    ]}
                  />
                )}
              </Card>
              <div className="grid">
                <Card title="Conexiones por estado">
                  <DataTable rows={d.database.connections} columns={[{ key: 'state', label: 'Estado' }, { key: 'count', label: 'Conexiones', num: true }]} />
                </Card>
                <Card title="Tablas más grandes">
                  <DataTable
                    rows={d.database.largest_tables}
                    columns={[
                      { key: 'table', label: 'Tabla' },
                      { key: 'bytes', label: 'Tamaño', num: true, render: (r) => fmtBytes(r.bytes) },
                      { key: 'rows_estimate', label: 'Filas (est.)', num: true },
                    ]}
                  />
                </Card>
              </div>
            </div>
            <Unavailable items={d.unavailable} />
          </>
        )}
      </Async>
    </>
  );
}

export function Content() {
  const { refreshKey } = usePanel();
  const [language, setLanguage] = useState('');
  const state = useRpc<Json>('admin_content', { p_language: language || null }, refreshKey);
  return (
    <>
      <PageHead title="Contenido">Catálogo educativo por idioma, estado de publicación y revisión, y cómo avanzan los usuarios reales.</PageHead>
      <Async state={state} rows={6}>
        {(d) => (
          <>
            <Card title="Idiomas">
              <DataTable
                csvName="contenido-idiomas"
                rows={d.languages}
                columns={[
                  { key: 'code', label: 'Idioma', render: (r) => langName(r.code) },
                  { key: 'content_status', label: 'Estado' },
                  { key: 'available', label: 'Disponible' },
                  { key: 'ranked_available', label: 'Ranked' },
                  { key: 'levels', label: 'Niveles', value: (r) => (r.levels as string[]).sort().join(' ') },
                  { key: 'units_published', label: 'Unidades pub.', num: true, render: (r) => `${fmtInt(r.units_published)} / ${fmtInt(r.units)}` },
                  { key: 'lessons_published', label: 'Lecciones pub.', num: true, render: (r) => `${fmtInt(r.lessons_published)} / ${fmtInt(r.lessons)}` },
                  { key: 'exercises_published', label: 'Ejercicios pub.', num: true, render: (r) => `${fmtInt(r.exercises_published)} / ${fmtInt(r.exercises)}` },
                  { key: 'review_status', label: 'Revisión (unidades)', value: (r) => Object.entries(r.review_status as Record<string, number>).map(([k, v]) => `${k}: ${v}`).join(' · ') },
                  { key: 'items_by_status', label: 'Ítems', value: (r) => Object.entries(r.items_by_status as Record<string, number>).map(([k, v]) => `${k}: ${v}`).join(' · ') },
                  { key: 'learners', label: 'Usuarios', num: true },
                ]}
              />
            </Card>
            <div className="grid cols-2">
              <Card title="Cursos">
                <DataTable
                  rows={d.courses}
                  columns={[
                    { key: 'code', label: 'Curso' },
                    { key: 'target', label: 'Aprende', render: (r) => langName(r.target) },
                    { key: 'source', label: 'Desde', render: (r) => langName(r.source) },
                    { key: 'default', label: 'Por defecto' },
                    { key: 'enrolled', label: 'Inscriptos', num: true },
                  ]}
                />
              </Card>
              <Card title="Reportes">
                <div className="grid kpis">
                  <Kpi label="Avatares por revisar" value={d.reports.avatar_pending} />
                  <Kpi label="Reportes de avatar" value={d.reports.avatar_total} />
                  <Kpi label="Errores de contenido" value={null} unavailable={d.unavailable.content_error_reports} />
                </div>
              </Card>
            </div>
            <Card
              title="Unidades"
              sub="finalización de usuarios reales"
              info="Empezaron = terminaron al menos 1 lección publicada de la unidad. Completaron = todas las publicadas."
              actions={
                <select className="select" aria-label="Idioma" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="">Todos los idiomas</option>
                  {(d.languages as Json[]).map((l) => (
                    <option key={l.code} value={l.code}>
                      {langName(l.code)}
                    </option>
                  ))}
                </select>
              }
            >
              <DataTable
                csvName="contenido-unidades"
                rows={d.units}
                columns={[
                  { key: 'language', label: 'Idioma', render: (r) => langName(r.language) },
                  { key: 'level', label: 'Nivel' },
                  { key: 'position', label: '#', num: true },
                  { key: 'title', label: 'Unidad' },
                  { key: 'published', label: 'Publicada' },
                  { key: 'review_status', label: 'Revisión' },
                  { key: 'lessons_published', label: 'Lecciones', num: true },
                  { key: 'users_started', label: 'Empezaron', num: true },
                  { key: 'users_completed', label: 'Completaron', num: true },
                  { key: 'completion_pct', label: 'Finalización', num: true, render: (r) => fmtPct(r.completion_pct) },
                ]}
              />
            </Card>
          </>
        )}
      </Async>
    </>
  );
}

export function AdminTools() {
  const { refreshKey } = usePanel();
  const [offset, setOffset] = useState(0);
  const state = useRpc<Json>('admin_audit', { p_limit: 50, p_offset: offset }, refreshKey);
  return (
    <>
      <PageHead title="Administración">
        Auditoría del panel y eventos de seguridad. La Etapa A es de sólo lectura: no hay acciones que modifiquen usuarios, ELO, suscripciones ni contenido.
      </PageHead>
      <Async state={state} rows={6}>
        {(d) => (
          <>
            <div className="grid kpis">
              <Kpi label="Superadmins" value={d.superadmins.length} formula="admin.superadmins: se carga sólo por migración." />
              <Kpi label="Denegaciones 24 h" value={d.denied_24h} formula="Intentos de usuarios logueados que no son el superadmin o no tienen MFA (como máximo 1 por usuario y motivo cada 10 min)." invert />
              <Kpi label="Acciones registradas" value={d.actions_total} />
            </div>
            <div className="grid cols-2">
              <Card title="Superadmin">
                <DataTable
                  rows={d.superadmins}
                  columns={[
                    { key: 'label', label: 'Cuenta' },
                    { key: 'user_id', label: 'UID', render: (r) => <span className="mono">{String(r.user_id)}</span> },
                    { key: 'created_at', label: 'Desde', render: (r) => fmtDateTime(r.created_at) },
                  ]}
                />
              </Card>
              <Card title="Cuentas internas" info="Excluidas de las métricas de usuarios reales.">
                <DataTable
                  rows={d.internal_accounts}
                  onRowClick={(r) => navigate('users', String(r.user_id))}
                  columns={[
                    { key: 'label', label: 'Cuenta' },
                    { key: 'user_id', label: 'UID', render: (r) => <span className="mono">{String(r.user_id)}</span> },
                  ]}
                />
              </Card>
            </div>
            <Card title="Eventos de seguridad">
              <DataTable
                csvName="eventos-seguridad"
                rows={d.security_events}
                empty="Sin eventos."
                columns={[
                  { key: 'created_at', label: 'Fecha', render: (r) => fmtDateTime(r.created_at) },
                  { key: 'event', label: 'Evento', render: (r) => ({ access_granted: 'Acceso concedido', denied_not_admin: 'Denegado: no es admin', denied_mfa: 'Denegado: falta MFA' } as Record<string, string>)[String(r.event)] ?? String(r.event) },
                  { key: 'username', label: 'Usuario' },
                  { key: 'aal', label: 'AAL' },
                  { key: 'user_id', label: 'UID', render: (r) => <span className="mono">{String(r.user_id ?? '—').slice(0, 8)}</span> },
                ]}
              />
            </Card>
            <Card title="Auditoría de acciones del panel" sub="cada consulta queda registrada (la misma, como mucho una vez por minuto)">
              <DataTable
                csvName="auditoria"
                rows={d.actions}
                empty="Sin acciones."
                columns={[
                  { key: 'created_at', label: 'Fecha', render: (r) => fmtDateTime(r.created_at) },
                  { key: 'username', label: 'Usuario' },
                  { key: 'action', label: 'Acción' },
                  { key: 'params', label: 'Parámetros', value: (r) => (r.params ? JSON.stringify(r.params) : ''), render: (r) => <span className="mono">{r.params ? JSON.stringify(r.params).slice(0, 120) : '—'}</span> },
                ]}
              />
              <div className="pager">
                <button className="btn" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - 50))}>
                  ← Anterior
                </button>
                <button className="btn" disabled={offset + 50 >= d.actions_total} onClick={() => setOffset(offset + 50)}>
                  Siguiente →
                </button>
              </div>
            </Card>
          </>
        )}
      </Async>
    </>
  );
}
