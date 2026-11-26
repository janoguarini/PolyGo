/**
 * Permisos Free / Plus de la app: ÚNICA puerta para preguntar «¿puede hacer esto?».
 *
 * Fuentes (todas del servidor; el cliente no puede escribir user_entitlements):
 * - Plus: get_energy().plus (has_plus), la misma lectura que ya usa la energía, así nunca hay dos
 *   respuestas distintas en pantalla.
 * - Sin publicidad y el detalle de la suscripción: get_entitlements() (migración
 *   20261230120000_plus_store_coach). Si todavía no existe en la base, Sin publicidad queda «no se
 *   sabe» (⇒ sin anuncios) y nada más cambia.
 *
 * Sin conexión, React Query conserva el último estado confirmado: un corte de red no le quita Plus a
 * nadie. La reglas de qué da cada plan viven en shared/plus.ts.
 */
import { useQuery } from '@tanstack/react-query';

import { resolveEntitlements, type Entitlements } from '@shared/plus';

import { useAuth } from '@/features/auth/AuthProvider';
import { requireSupabase } from '@/lib/supabase';

import { useEnergy } from './api';

export interface SubscriptionDetail {
  source: 'app_store' | 'play_store' | 'promotional' | 'manual' | 'referral';
  productId: string | null;
  expiresAt: string | null;
  /** false = canceló: conserva el acceso hasta expiresAt. null = no aplica (manual). */
  willRenew: boolean | null;
  billingIssue: boolean;
}

export interface EntitlementsReading {
  plus: boolean;
  adFree: boolean;
  detail: SubscriptionDetail | null;
  serverNow: string;
}

export const entitlementKeys = {
  all: ['plus', 'entitlements'] as const,
  state: (userId: string) => ['plus', 'entitlements', userId] as const,
};

export function parseEntitlements(raw: unknown): EntitlementsReading {
  const r = (raw ?? {}) as Record<string, unknown>;
  const d = r.plus_detail as Record<string, unknown> | null | undefined;
  return {
    plus: r.plus === true,
    adFree: r.ad_free === true,
    serverNow: typeof r.server_now === 'string' ? r.server_now : new Date().toISOString(),
    detail: d
      ? {
          source: d.source as SubscriptionDetail['source'],
          productId: typeof d.product_id === 'string' ? d.product_id : null,
          expiresAt: typeof d.expires_at === 'string' ? d.expires_at : null,
          willRenew: typeof d.will_renew === 'boolean' ? d.will_renew : null,
          billingIssue: d.billing_issue === true,
        }
      : null,
  };
}

export async function fetchEntitlements(): Promise<EntitlementsReading> {
  const { data, error } = await requireSupabase().rpc('get_entitlements');
  if (error) throw error;
  return parseEntitlements(data);
}

/** Lectura cruda de get_entitlements (detalle de la suscripción, Sin publicidad). */
export function useEntitlementsQuery() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: entitlementKeys.state(userId ?? 'anonymous'),
    queryFn: fetchEntitlements,
    enabled: Boolean(userId),
    // Una renovación o un reembolso pueden llegar en cualquier momento (webhook).
    refetchInterval: 10 * 60_000,
    retry: 1,
  });
}

/** Permisos efectivos de la cuenta. undefined = todavía no se sabe. */
export function useEntitlements(): Entitlements {
  const energy = useEnergy();
  const query = useEntitlementsQuery();
  const plus = energy.view?.plus ?? query.data?.plus;
  return resolveEntitlements({ plus, adFree: query.data?.adFree });
}
