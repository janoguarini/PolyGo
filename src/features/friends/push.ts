import { useQueryClient } from '@tanstack/react-query';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useAuth } from '@/features/auth/AuthProvider';
import { requireSupabase } from '@/lib/supabase';

import { rememberPushToken } from './pushToken';

/**
 * Push remotas: sólo en una build de la app (en Expo Go de Android no existen y en web no hay
 * notificaciones). Ahí todo esto es un no-op.
 */
export const pushSupported =
  Platform.OS !== 'web' && Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

/** Canal de Android para los desafíos (= CHANNEL_ID de la Edge Function notify-battle-invite). */
export const CHALLENGE_CHANNEL_ID = 'friend-challenges';

async function ensureChallengeChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHALLENGE_CHANNEL_ID, {
    name: 'Desafíos de amigos',
    description: 'Cuando un amigo te invita a un amistoso.',
    importance: AndroidImportance.HIGH,
  });
}

export type PushPermission = 'granted' | 'undetermined' | 'blocked' | 'unsupported';

export async function getPushPermission(): Promise<PushPermission> {
  if (!pushSupported) return 'unsupported';
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return 'granted';
  return current.canAskAgain ? 'undetermined' : 'blocked';
}

/**
 * Registra el token de Expo de este teléfono para la cuenta con sesión. Con `ask`, pide el permiso
 * si todavía no se decidió; sin `ask`, sólo registra si ya estaba concedido.
 */
export async function registerForPush({ ask }: { ask: boolean }): Promise<PushPermission> {
  if (!pushSupported) return 'unsupported';
  // En Android 13+ el diálogo de permiso sólo aparece si ya existe un canal.
  await ensureChallengeChannel();
  let permission = await getPushPermission();
  if (permission === 'undetermined' && ask) {
    const asked = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowSound: true, allowBadge: false },
    });
    permission = asked.granted ? 'granted' : asked.canAskAgain ? 'undetermined' : 'blocked';
  }
  if (permission !== 'granted') return permission;

  const projectId =
    (Constants.expoConfig?.extra?.eas as { projectId?: string } | undefined)?.projectId ??
    Constants.easConfig?.projectId;
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  const { error } = await requireSupabase().rpc('register_push_token', {
    p_token: token,
    p_platform: Platform.OS === 'ios' ? 'ios' : 'android',
  });
  if (error) throw error;
  await rememberPushToken(token);
  return 'granted';
}

/** Pide a la Edge Function que avise al amigo invitado. Si falla, la invitación sigue en pie. */
export function notifyBattleInvite(code: string) {
  void requireSupabase()
    .functions.invoke('notify-battle-invite', { body: { code } })
    .catch(() => {});
}

interface InviteData {
  type?: unknown;
  code?: unknown;
}

function inviteCode(response: Notifications.NotificationResponse | null | undefined) {
  if (!response || response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER)
    return null;
  const data = response.notification.request.content.data as InviteData | undefined;
  return data?.type === 'battle_invite' && typeof data.code === 'string' ? data.code : null;
}

/** Notificaciones ya abiertas en esta sesión (la última respuesta se repite al volver a montar). */
const handled = new Set<string>();

/**
 * Va en el layout de pestañas (con sesión y onboarding completo):
 * - registra el token si el permiso ya estaba concedido;
 * - tocar una notificación de desafío abre la partida (también con la app cerrada);
 * - si llega con la app abierta, refresca el latido para mostrar el aviso de adentro enseguida.
 */
export function useBattleInvitePush() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const qc = useQueryClient();
  const lastResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!userId || !pushSupported) return;
    registerForPush({ ask: false }).catch(() => {});
  }, [userId]);

  useEffect(() => {
    const code = inviteCode(lastResponse);
    if (!code || !lastResponse) return;
    const id = lastResponse.notification.request.identifier;
    if (handled.has(id)) return;
    handled.add(id);
    router.push({ pathname: '/battle', params: { code } });
  }, [lastResponse]);

  useEffect(() => {
    if (!pushSupported) return;
    const sub = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data as InviteData | undefined;
      if (data?.type === 'battle_invite') {
        void qc.invalidateQueries({ queryKey: ['friends'] });
      }
    });
    return () => sub.remove();
  }, [qc]);
}
