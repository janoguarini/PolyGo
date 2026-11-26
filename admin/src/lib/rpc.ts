import { useCallback, useEffect, useRef, useState } from 'react';

import { supabase } from './supabase.ts';

/** Las RPC del panel (todas validan janitogap + MFA en la base). */
export type AdminRpc =
  | 'admin_session_check'
  | 'admin_filter_options'
  | 'admin_overview'
  | 'admin_growth'
  | 'admin_users_list'
  | 'admin_user_detail'
  | 'admin_user_battles'
  | 'admin_learning'
  | 'admin_ranked'
  | 'admin_leaderboard'
  | 'admin_retention'
  | 'admin_social'
  | 'admin_monetization'
  | 'admin_marketing'
  | 'admin_notifications'
  | 'admin_health'
  | 'admin_content'
  | 'admin_audit';

export class RpcError extends Error {
  constructor(
    message: string,
    readonly code: string | null,
  ) {
    super(message);
  }
  /** La base negó el acceso (no es superadmin, falta MFA o expiró la sesión). */
  get denied(): boolean {
    return this.code === '42501' || /admin_forbidden|admin_mfa_required|JWT/i.test(this.message);
  }
}

/** Avisa al AuthGate que la base negó el acceso: vuelve a verificar la sesión. */
export const AUTH_LOST_EVENT = 'polygo-admin-auth-lost';

export async function callRpc<T>(fn: AdminRpc, args: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) {
    const err = new RpcError(error.message, error.code ?? null);
    if (err.denied) window.dispatchEvent(new Event(AUTH_LOST_EVENT));
    throw err;
  }
  return data as T;
}

// Caché corta en memoria (no en disco): evita repetir la misma consulta al navegar entre módulos.
const CACHE_MS = 60_000;
const cache = new Map<string, { at: number; data: unknown }>();
export const clearRpcCache = () => cache.clear();

export interface RpcState<T> {
  data: T | null;
  error: RpcError | null;
  loading: boolean;
  reload: () => void;
  updatedAt: number | null;
}

/**
 * Llama una RPC cuando cambian sus argumentos o `refreshKey` (actualización automática o botón).
 * `refreshKey` distinto ignora la caché.
 */
export function useRpc<T>(
  fn: AdminRpc,
  args: Record<string, unknown>,
  refreshKey = 0,
  enabled = true,
): RpcState<T> {
  const key = `${fn}:${JSON.stringify(args)}`;
  const [state, setState] = useState<{ data: T | null; error: RpcError | null; loading: boolean; at: number | null }>(
    () => {
      const hit = cache.get(key);
      return { data: (hit?.data as T) ?? null, error: null, loading: enabled && !hit, at: hit?.at ?? null };
    },
  );
  const [manual, setManual] = useState(0);
  const lastRefresh = useRef(refreshKey);
  const seq = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const forced = lastRefresh.current !== refreshKey || manual > 0;
    lastRefresh.current = refreshKey;
    const hit = cache.get(key);
    if (hit && !forced && Date.now() - hit.at < CACHE_MS) {
      setState({ data: hit.data as T, error: null, loading: false, at: hit.at });
      return;
    }
    const mine = ++seq.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    callRpc<T>(fn, args)
      .then((data) => {
        if (mine !== seq.current) return;
        const at = Date.now();
        cache.set(key, { at, data });
        setState({ data, error: null, loading: false, at });
      })
      .catch((e: unknown) => {
        if (mine !== seq.current) return;
        const err = e instanceof RpcError ? e : new RpcError(String(e), null);
        setState((s) => ({ ...s, error: err, loading: false }));
      });
    // `args` se representa con `key`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, refreshKey, manual, enabled]);

  const reload = useCallback(() => setManual((n) => n + 1), []);
  return { data: state.data, error: state.error, loading: state.loading, reload, updatedAt: state.at };
}
