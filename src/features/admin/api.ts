import { useQuery, useQueryClient } from '@tanstack/react-query';
import { create } from 'zustand';

import { useAuth } from '@/features/auth/AuthProvider';
import { requireSupabase } from '@/lib/supabase';

/**
 * Panel de administración dentro de la app (docs/ADMIN_PANEL.md). Sólo lo ve janitogap.
 *
 * SEGURIDAD: este UID sólo decide si se MUESTRA el botón (para no consultar la base por cada
 * usuario que abre su perfil). Quien autoriza es la base: cada public.admin_* verifica auth.uid()
 * contra admin.superadmins y exige MFA (aal2). Cambiar este valor en un cliente no da acceso a nada.
 */
export const SUPERADMIN_UID = '267762e4-8145-4e48-900b-9b14ccefb59b';

export function useIsSuperadminAccount(): boolean {
  return useAuth().session?.user.id === SUPERADMIN_UID;
}

/** Las respuestas son JSON armado por la base (forma garantizada por supabase/tests/adminPanel.test.mjs). */
export type Json = any;

export type AdminRpc =
  | 'admin_session_check'
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

export class AdminError extends Error {
  constructor(
    message: string,
    readonly code: string | null,
  ) {
    super(message);
  }
  get denied(): boolean {
    return this.code === '42501' || /admin_forbidden|admin_mfa_required/.test(this.message);
  }
}

export async function adminRpc<T = Json>(fn: AdminRpc, args: Record<string, unknown> = {}): Promise<T> {
  // Las RPC del panel no están en los tipos generados de la app (son sólo para el superadmin).
  const { data, error } = await requireSupabase().rpc(fn as never, args as never);
  if (error) throw new AdminError(error.message, error.code ?? null);
  return data as T;
}

export const SESSION_KEY = ['admin', 'session'] as const;

export interface SessionCheck {
  allowed: boolean;
  reason: 'ok' | 'mfa_required' | 'forbidden';
  username?: string;
}

export function useAdminSession(enabled: boolean) {
  return useQuery({
    queryKey: SESSION_KEY,
    queryFn: () => adminRpc<SessionCheck>('admin_session_check'),
    enabled,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });
}

/** Una RPC del panel. Si la base niega el acceso (p. ej. la sesión perdió el MFA), se vuelve a verificar. */
export function useAdmin<T = Json>(fn: AdminRpc, args: Record<string, unknown>) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: ['admin', fn, args],
    queryFn: async () => {
      try {
        return await adminRpc<T>(fn, args);
      } catch (e) {
        if (e instanceof AdminError && e.denied) void qc.invalidateQueries({ queryKey: SESSION_KEY });
        throw e;
      }
    },
    staleTime: 60_000,
    retry: (n, e) => !(e instanceof AdminError && e.denied) && n < 1,
  });
}

// ---------- período (compartido entre las pantallas del panel) ----------

export const TIME_ZONE = 'America/Argentina/Buenos_Aires';

export type PresetId = 'today' | 'yesterday' | '7d' | '30d' | '90d' | '12m';

export const PRESETS: { id: PresetId; label: string }[] = [
  { id: 'today', label: 'Hoy' },
  { id: 'yesterday', label: 'Ayer' },
  { id: '7d', label: '7 días' },
  { id: '30d', label: '30 días' },
  { id: '90d', label: '90 días' },
  { id: '12m', label: '12 meses' },
];

export function localDate(at: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(at);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function presetRange(id: PresetId, today: string = localDate()): { from: string; to: string } {
  switch (id) {
    case 'today':
      return { from: today, to: today };
    case 'yesterday':
      return { from: addDays(today, -1), to: addDays(today, -1) };
    case '7d':
      return { from: addDays(today, -6), to: today };
    case '30d':
      return { from: addDays(today, -29), to: today };
    case '90d':
      return { from: addDays(today, -89), to: today };
    case '12m':
      return { from: addDays(today, -364), to: today };
  }
}

interface AdminPrefs {
  preset: PresetId;
  plan: '' | 'free' | 'plus';
  setPreset: (p: PresetId) => void;
  setPlan: (p: '' | 'free' | 'plus') => void;
}

export const useAdminPrefs = create<AdminPrefs>((set) => ({
  preset: '30d',
  plan: '',
  setPreset: (preset) => set({ preset }),
  setPlan: (plan) => set({ plan }),
}));

/** Argumentos de período + filtros para las RPC. */
export function usePeriodArgs() {
  const { preset, plan } = useAdminPrefs();
  const { from, to } = presetRange(preset);
  return { p_from: from, p_to: to, p_filters: plan ? { plan } : {} };
}
