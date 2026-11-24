import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { BadgeId, ReferralMissingStep } from '@shared/referrals';

import { useAuth } from '@/features/auth/AuthProvider';
import { getStrings } from '@/i18n';
import { callPendingRpc, isMissingRpc } from '@/lib/pendingRpc';

import { referralStrings } from './strings';

/**
 * Invitaciones. Todo lo decide el servidor (20261222120100_referrals): la app nunca manda contadores
 * ni estados, sólo el código que el usuario trae y "reevaluá".
 */

export interface ReferralInvite {
  /** Usuario público del invitado (null si todavía no eligió uno). */
  username: string | null;
  status: 'pending' | 'qualified' | 'rejected';
  joined_at: string;
  qualified_at: string | null;
  missing: ReferralMissingStep | null;
}

export interface ReferralMilestoneState {
  at: number;
  polys: number;
  /** Días de Plus (20261225120100_referral_plus_days); ausente en un servidor anterior. */
  plus_days?: number;
  badge: BadgeId;
  items: string[];
  granted_at: string | null;
}

export interface ReferralStatus {
  code: string;
  qualified: number;
  pending: number;
  /** Hitos entregados en esta consulta (para la animación de desbloqueo). */
  just_granted: { milestone: number }[];
  milestones: ReferralMilestoneState[];
  invites: ReferralInvite[];
}

export interface MyReferral {
  attributed: boolean;
  status: ReferralInvite['status'] | null;
  referrer_username: string | null;
  can_claim: boolean;
}

export const referralKeys = {
  status: (userId: string) => ['referrals', 'status', userId] as const,
  mine: (userId: string) => ['referrals', 'mine', userId] as const,
};

/** null = la migración todavía no está aplicada (la pantalla muestra "muy pronto"). */
export async function fetchReferralStatus(): Promise<ReferralStatus | null> {
  try {
    return await callPendingRpc<ReferralStatus>('get_referral_status');
  } catch (error) {
    if (isMissingRpc(error)) return null;
    throw error;
  }
}

export function useReferralStatus() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: referralKeys.status(userId ?? 'anonymous'),
    queryFn: fetchReferralStatus,
    enabled: Boolean(userId),
  });
}

export async function syncMyReferral(): Promise<MyReferral | null> {
  try {
    return await callPendingRpc<MyReferral>('sync_referral');
  } catch (error) {
    if (isMissingRpc(error)) return null;
    throw error;
  }
}

/** Lado del invitado: su invitación (y si todavía puede cargar un código). */
export function useMyReferral() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: referralKeys.mine(userId ?? 'anonymous'),
    queryFn: syncMyReferral,
    enabled: Boolean(userId),
  });
}

export async function claimReferral(code: string) {
  return callPendingRpc<{ referrer_username: string; status: ReferralInvite['status'] }>(
    'claim_referral',
    { p_code: code },
  );
}

export function useClaimReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: claimReferral,
    onSuccess: async () => {
      await clearPendingInviteCode();
      await qc.invalidateQueries({ queryKey: ['referrals'] });
    },
  });
}

// ---------- código recibido por enlace, guardado hasta que la cuenta esté lista ----------
const PENDING_KEY = 'polygo.pendingInviteCode';

/** Guarda el código de un enlace de invitación (antes de tener cuenta o de terminar el registro). */
export async function savePendingInviteCode(code: string): Promise<void> {
  try {
    if (Platform.OS === 'web') globalThis.localStorage?.setItem(PENDING_KEY, code);
    else await SecureStore.setItemAsync(PENDING_KEY, code);
  } catch {
    // Sin almacenamiento el usuario puede cargar el código a mano en Invitar amigos.
  }
}

export async function readPendingInviteCode(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') return globalThis.localStorage?.getItem(PENDING_KEY) ?? null;
    return await SecureStore.getItemAsync(PENDING_KEY);
  } catch {
    return null;
  }
}

export async function clearPendingInviteCode(): Promise<void> {
  try {
    if (Platform.OS === 'web') globalThis.localStorage?.removeItem(PENDING_KEY);
    else await SecureStore.deleteItemAsync(PENDING_KEY);
  } catch {
    // nada que limpiar
  }
}

/** Errores del servidor → texto para el usuario. */
export function referralErrorMessage(error: unknown): string {
  const t = getStrings(referralStrings);
  const msg = (error as { message?: string } | null)?.message ?? '';
  if (msg.includes('self_referral')) return t.errorSelf;
  if (msg.includes('already_attributed')) return t.errorAlreadyAttributed;
  if (msg.includes('attribution_window_closed')) return t.errorWindowClosed;
  if (msg.includes('referral_not_eligible')) return t.errorNotEligible;
  if (msg.includes('invalid_code')) return t.errorInvalidCode;
  return t.errorGeneric;
}
