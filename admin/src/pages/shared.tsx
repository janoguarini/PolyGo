import { useState } from 'react';

import { Card } from '../components/ui.tsx';
import { filtersArg, usePanel } from '../lib/context.tsx';
import type { Grain } from '../lib/period.ts';

/**
 * Las respuestas de las RPC son JSON armado en la base (jsonb_build_object). Se tipan de forma
 * laxa: la forma la garantizan las funciones SQL y supabase/tests/adminPanel.test.mjs.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Json = any;

/** Argumentos comunes: período + filtros. */
export function usePeriodArgs() {
  const { period, filters, refreshKey } = usePanel();
  return {
    args: { p_from: period.from, p_to: period.to, p_filters: filtersArg(filters) },
    refreshKey,
    period,
  };
}

export function GrainToggle({ grain, setGrain }: { grain: Grain; setGrain: (g: Grain) => void }) {
  return (
    <div className="seg" role="group" aria-label="Agrupar por">
      {(
        [
          ['day', 'Día'],
          ['week', 'Semana'],
          ['month', 'Mes'],
        ] as const
      ).map(([g, l]) => (
        <button key={g} aria-pressed={grain === g} onClick={() => setGrain(g)}>
          {l}
        </button>
      ))}
    </div>
  );
}

export function useGrain(initial: Grain = 'day') {
  return useState<Grain>(initial);
}

export function SectionTitle({ children }: { children: string }) {
  return <h2 className="section-title">{children}</h2>;
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <div className="muted" style={{ fontSize: 13 }}>
        {children}
      </div>
    </Card>
  );
}

/** Lista {key,count} → items para HBars. */
export const toItems = (rows: { key: string; count: number }[] | null | undefined, label: (k: string) => string) =>
  (rows ?? []).map((r) => ({ key: r.key, label: label(r.key), value: Number(r.count) }));
