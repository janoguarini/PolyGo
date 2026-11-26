import { useEffect, useState } from 'react';

import { DataTable } from '../components/DataTable.tsx';
import { Async, Card, PageHead } from '../components/ui.tsx';
import { filtersArg, usePanel } from '../lib/context.tsx';
import { countryName, fmtDateTime, fmtInt, langName, platformName } from '../lib/format.ts';
import { useRpc } from '../lib/rpc.ts';
import { navigate } from '../lib/router.ts';
import type { Json } from './shared.tsx';

const PAGE = 50;

export function Users() {
  const { filters, refreshKey } = usePanel();
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('created_desc');
  const [includeInternal, setIncludeInternal] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(q.trim());
      setOffset(0);
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const state = useRpc<Json>(
    'admin_users_list',
    {
      p_search: search || null,
      p_filters: filtersArg(filters),
      p_include_internal: includeInternal,
      p_sort: sort,
      p_limit: PAGE,
      p_offset: offset,
    },
    refreshKey,
  );

  return (
    <>
      <PageHead title="Usuarios">
        Búsqueda por username, nombre visible, código público o UID. Las cuentas internas aparecen marcadas.
      </PageHead>
      <Card
        title="Tabla de usuarios"
        actions={
          <div className="controls">
            <input
              className="input"
              type="search"
              placeholder="Buscar…"
              aria-label="Buscar usuarios"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select className="select" aria-label="Orden" value={sort} onChange={(e) => (setSort(e.target.value), setOffset(0))}>
              <option value="created_desc">Más nuevos</option>
              <option value="created_asc">Más antiguos</option>
              <option value="last_seen">Última presencia</option>
              <option value="username">Username</option>
            </select>
            <label className="muted" style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={includeInternal}
                onChange={(e) => (setIncludeInternal(e.target.checked), setOffset(0))}
              />
              Mostrar internas
            </label>
          </div>
        }
      >
        <Async state={state} rows={8}>
          {(d) => (
            <>
              <DataTable
                csvName="usuarios"
                rows={d.rows}
                onRowClick={(r) => navigate('users', String(r.id))}
                empty="Ningún usuario coincide."
                columns={[
                  {
                    key: 'username',
                    label: 'Usuario',
                    render: (r) => (
                      <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        <b>{String(r.username ?? '—')}</b>
                        {r.internal ? <span className="chip chip-warn">interna</span> : null}
                        {!r.onboarded ? <span className="chip">sin onboarding</span> : null}
                      </span>
                    ),
                  },
                  { key: 'created_at', label: 'Registro', render: (r) => fmtDateTime(r.created_at) },
                  { key: 'last_seen_at', label: 'Última presencia', render: (r) => fmtDateTime(r.last_seen_at) },
                  { key: 'country', label: 'País', render: (r) => countryName(r.country ?? '??') },
                  { key: 'platform', label: 'Plataforma', render: (r) => platformName(r.platform) },
                  { key: 'target_language', label: 'Idioma', render: (r) => langName(r.target_language) },
                  { key: 'plan', label: 'Plan', render: (r) => (r.plan === 'plus' ? <span className="chip chip-brand">Plus</span> : 'Free') },
                  { key: 'level', label: 'Nivel', num: true },
                  { key: 'lessons_completed', label: 'Lecciones', num: true },
                  { key: 'battles', label: 'Partidas', num: true },
                  { key: 'best_rating', label: 'ELO máx.', num: true },
                ]}
              />
              <div className="pager">
                <span>
                  {fmtInt(d.total)} usuarios · {fmtInt(Math.min(d.total, offset + 1))}–{fmtInt(Math.min(d.total, offset + PAGE))}
                </span>
                <button className="btn" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>
                  ← Anterior
                </button>
                <button className="btn" disabled={offset + PAGE >= d.total} onClick={() => setOffset(offset + PAGE)}>
                  Siguiente →
                </button>
              </div>
            </>
          )}
        </Async>
      </Card>
    </>
  );
}
