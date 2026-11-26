import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { router, type Href } from 'expo-router';
import { useEffect } from 'react';

import { registerForPush } from '@/features/friends/push';
import { track } from '@/lib/analytics';
import { deviceStorage } from '@/lib/secureStorage';

import { useLearningSummary } from '@/features/learning/hooks';
import { useInterfaceLanguage } from '@/i18n';

import {
  cancelReminders,
  loadReminderPrefs,
  remindersSupported,
  requestReminderPermission,
  saveReminderPrefs,
  syncReminders,
  type PermissionResult,
  type PushData,
} from './notifications';
import { useSmartInput } from './smartContext';
import type { ReminderPrefs } from './schedule';

const prefsKey = ['reminders', 'prefs'] as const;
const permissionKey = ['reminders', 'permission'] as const;

/** ¿El teléfono deja mandar avisos? (los interruptores se ven apagados sin permiso). */
export function useNotificationsGranted() {
  return useQuery({
    queryKey: permissionKey,
    queryFn: async () => (await Notifications.getPermissionsAsync()).granted,
    enabled: remindersSupported,
  });
}

export function useReminderPrefs() {
  return useQuery({
    queryKey: prefsKey,
    queryFn: loadReminderPrefs,
    enabled: remindersSupported,
    staleTime: Infinity,
  });
}

/**
 * Guarda la preferencia. Al activar pide permiso; si se niega, queda desactivado y se devuelve
 * el motivo para mostrarlo.
 */
export function useSetReminderPrefs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (prefs: ReminderPrefs): Promise<PermissionResult | null> => {
      const smart = prefs.smart !== false;
      const permission = prefs.enabled || smart ? await requestReminderPermission() : null;
      const granted = permission === 'granted';
      const saved = { ...prefs, enabled: prefs.enabled && granted, smart: smart && granted };
      await saveReminderPrefs(saved);
      qc.setQueryData(prefsKey, saved);
      void qc.invalidateQueries({ queryKey: permissionKey });
      return permission;
    },
  });
}

/**
 * Mantiene programados los recordatorios según la racha de hoy: se reprograma al abrir la app,
 * al terminar una sesión (el resumen se refresca) y al cambiar la preferencia. Al cerrar sesión
 * (las pestañas se desmontan) se cancelan.
 */
export function useReminderSync() {
  const prefs = useReminderPrefs();
  const summary = useLearningSummary();
  const p = prefs.data;
  const streakDays = summary.data?.streak_days;
  const activeToday = summary.data?.active_today;
  const streakFreezes = summary.data?.streak_freezes ?? 0;
  const freezePending = summary.data?.freeze_pending ?? 0;
  // Los textos se arman al programar: al cambiar el idioma de la interfaz se reprograman.
  const language = useInterfaceLanguage();
  // Push inteligente: horario de oro + el mensaje más fuerte del día (smart.ts).
  const smart = useSmartInput(streakDays, activeToday);

  useEffect(() => {
    if (!p || streakDays === undefined || activeToday === undefined) return;
    syncReminders(
      p,
      { streakDays, activeToday, streakFreezes, freezePending },
      smart ?? null,
    ).catch(() => {
      // Un recordatorio que no se programa nunca debe romper la app.
    });
  }, [p, streakDays, activeToday, streakFreezes, freezePending, language, smart]);

  useEffect(() => () => void cancelReminders().catch(() => {}), []);
}

/** Ya se pidió el permiso de notificaciones una vez (al cerrar el tutorial o al abrir la app). */
const ASKED_KEY = 'polygo.push-permission-asked';
/** Pausa tras cerrar el tutorial: primero se ve el inicio (y el regalo de bienvenida). */
const ASK_DELAY_MS = 4_000;

/**
 * El recordatorio viene activado de fábrica, pero sin permiso no llega: se pide UNA sola vez, apenas
 * se cierra el tutorial (o, en cuentas que ya lo tenían, al abrir la app). Si lo concede, también
 * quedan activos los avisos de desafíos de amigos.
 */
export function useAskPushPermissionOnce(ready: boolean) {
  const qc = useQueryClient();
  useEffect(() => {
    if (!ready || !remindersSupported) return;
    const timer = setTimeout(() => {
      void (async () => {
        try {
          if (await deviceStorage.getItem(ASKED_KEY)) return;
          const current = await Notifications.getPermissionsAsync();
          await deviceStorage.setItem(ASKED_KEY, '1');
          if (current.granted || !current.canAskAgain) return;
          const result = await requestReminderPermission();
          track('push_permission', { result });
          if (result === 'granted') {
            // Reprograma con permiso y registra el teléfono para los desafíos.
            void qc.invalidateQueries({ queryKey: prefsKey });
            await registerForPush({ ask: false });
          }
        } catch {
          // Nunca rompe la app.
        }
      })();
    }, ASK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [ready, qc]);
}

const opened = new Set<string>();

/** Tocar un recordatorio o un push inteligente: se mide en PostHog y abre la pantalla justa. */
export function usePushOpen() {
  const last = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (!last) return;
    const id = last.notification.request.identifier;
    const data = last.notification.request.content.data as Partial<PushData> | undefined;
    if (opened.has(id) || !data?.kind || !['daily', 'smart', 'streak'].includes(data.kind)) return;
    opened.add(id);
    track('push_opened', { kind: data.kind, type: data.type, variant: data.variant });
    if (data.route && data.route !== '/') router.navigate(data.route as Href);
  }, [last]);
}
