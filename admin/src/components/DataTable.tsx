import { useMemo, useState, type ReactNode } from 'react';

import { downloadCsv, toCsv } from '../lib/csv.ts';
import { Empty } from './ui.tsx';

export interface Column<T> {
  key: string;
  label: string;
  num?: boolean;
  render?: (row: T) => ReactNode;
  /** Valor para ordenar y exportar (por defecto row[key]). */
  value?: (row: T) => unknown;
  sortable?: boolean;
}

/** Tabla con orden por columna y exportación CSV de lo que se ve (ya filtrado en la base). */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  csvName,
  onRowClick,
  empty,
  initialSort,
}: {
  columns: Column<T>[];
  rows: T[];
  csvName?: string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  initialSort?: { key: string; dir: 'asc' | 'desc' };
}) {
  const [sort, setSort] = useState(initialSort ?? null);
  const valueOf = (c: Column<T>, r: T) => (c.value ? c.value(r) : r[c.key]);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const val = (r: T) => (col.value ? col.value(r) : r[col.key]);
    return [...rows].sort((a, b) => {
      const x = val(a);
      const y = val(b);
      const nx = typeof x === 'number' ? x : Number(x);
      const ny = typeof y === 'number' ? y : Number(y);
      let cmp: number;
      if (x === null || x === undefined) cmp = 1;
      else if (y === null || y === undefined) cmp = -1;
      else if (Number.isFinite(nx) && Number.isFinite(ny)) cmp = nx - ny;
      else cmp = String(x).localeCompare(String(y), 'es');
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sort, columns]);

  if (!rows.length) return <Empty>{empty ?? 'Sin datos.'}</Empty>;

  return (
    <div>
      {csvName && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button
            className="btn"
            onClick={() =>
              downloadCsv(
                `${csvName}.csv`,
                toCsv(
                  columns.map((c) => ({ key: c.key, label: c.label })),
                  sorted.map((r) => Object.fromEntries(columns.map((c) => [c.key, valueOf(c, r)]))),
                ),
              )
            }
          >
            ⤓ CSV
          </button>
        </div>
      )}
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={c.num ? 'num' : undefined}>
                  {c.sortable === false ? (
                    c.label
                  ) : (
                    <button
                      onClick={() =>
                        setSort((s) =>
                          s?.key === c.key
                            ? { key: c.key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
                            : { key: c.key, dir: c.num ? 'desc' : 'asc' },
                        )
                      }
                    >
                      {c.label}
                      {sort?.key === c.key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ''}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr
                key={i}
                className={onRowClick ? 'clickable' : undefined}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={onRowClick ? (e) => e.key === 'Enter' && onRowClick(r) : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key} className={c.num ? 'num' : undefined}>
                    {c.render ? c.render(r) : formatCell(valueOf(c, r))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatCell(v: unknown): ReactNode {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v === 'boolean') return v ? 'Sí' : 'No';
  if (typeof v === 'number') return v.toLocaleString('es-AR');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}
