import { requireSupabase } from '@/lib/supabase';

/**
 * RPC de migraciones preparadas que todavía no están en producción (y por lo tanto no figuran en
 * database.generated.ts, que se genera desde el proyecto). Al aplicar
 * 20261222120000_profile_customization, 20261222120100_referrals y 20261222120200_player_xp: regenerar los tipos y cambiar
 * cada llamada por `requireSupabase().rpc(...)` tipado. Ver docs/PROFILE_CUSTOMIZATION.md.
 */
export type PendingRpc =
  | 'sync_cosmetics'
  | 'claim_referral'
  | 'sync_referral'
  | 'get_referral_status'
  | 'get_profile_flair'
  /** XP y nivel global (20261222120200_player_xp). */
  | 'sync_xp'
  /** Modelo de cursos (20261223120000_course_model). */
  | 'set_interface_language'
  | 'set_active_course'
  | 'set_course_start_level'
  | 'complete_onboarding_v2'
  /** Test de nivel (20261224120000_course_placement). */
  | 'start_course'
  /** Calendario de bienvenida (20261225120000_welcome_rewards). */
  | 'get_welcome_rewards'
  | 'claim_welcome_reward';

type UntypedRpc = (
  fn: string,
  args?: Record<string, unknown>,
) => PromiseLike<{ data: unknown; error: { code?: string; message: string } | null }>;

export async function callPendingRpc<T>(
  fn: PendingRpc,
  args?: Record<string, unknown>,
): Promise<T> {
  const client = requireSupabase();
  const rpc = client.rpc.bind(client) as unknown as UntypedRpc;
  const { data, error } = await rpc(fn, args);
  if (error) throw error;
  return data as T;
}

/** La función no existe todavía en la base (migración sin aplicar): PostgREST responde PGRST202. */
export function isMissingRpc(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  return code === 'PGRST202' || code === '42883';
}

/** La tabla no existe todavía (migración sin aplicar): PostgREST responde PGRST205; Postgres, 42P01. */
export function isMissingTable(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  return code === 'PGRST205' || code === '42P01';
}
