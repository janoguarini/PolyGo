import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { getStrings } from '@/i18n';
import { track } from '@/lib/analytics';
import { deviceStorage } from '@/lib/secureStorage';

import type { SmartContext, SmartType } from './smart';
import {
  DEFAULT_REMINDER,
  planNotifications,
  type NotificationKind,
  type ReminderPrefs,
  type StreakState,
} from './schedule';
import { smartStrings } from './smartStrings';
import { reminderStrings } from './strings';

/** En web no hay notificaciones locales programadas. */
export const remindersSupported = Platform.OS !== 'web';

const PREFS_KEY = 'polygo.reminder';
const CHANNEL_ID = 'daily-reminder';
const ID_PREFIX = 'daily-reminder-';
const STREAK_CHANNEL_ID = 'streak-alert';
const STREAK_ALERT_ID = 'streak-alert';
const SMART_CHANNEL_ID = 'smart-push';
const SMART_PREFIX = 'smart-push-';
/** El último plan programado: al reprogramar, lo que ya pasó cuenta como entregado (PostHog). */
const PLAN_KEY = 'polygo.push-plan';

/** Datos que viajan en cada aviso: para medirlo y abrir la pantalla justa al tocarlo. */
export interface PushData {
  kind: NotificationKind;
  type: string;
  variant: string;
  route: string;
}

export async function loadReminderPrefs(): Promise<ReminderPrefs> {
  try {
    const raw = await deviceStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_REMINDER;
    const parsed = JSON.parse(raw) as Partial<ReminderPrefs>;
    return {
      enabled: parsed.enabled !== false,
      hour: Number.isInteger(parsed.hour) ? parsed.hour! : DEFAULT_REMINDER.hour,
      minute: Number.isInteger(parsed.minute) ? parsed.minute! : DEFAULT_REMINDER.minute,
      smart: parsed.smart !== false,
    };
  } catch {
    return DEFAULT_REMINDER;
  }
}

export function saveReminderPrefs(prefs: ReminderPrefs) {
  return deviceStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

/** Si la app está abierta no hace falta el aviso: ya estás practicando. */
export function configureNotifications() {
  if (!remindersSupported) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: false,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

async function ensureChannel() {
  // En Android 13+ el diálogo de permiso sólo aparece si ya existe un canal.
  if (Platform.OS !== 'android') return;
  const t = getStrings(reminderStrings);
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: t.dailyChannelName,
    description: t.dailyChannelDescription,
    importance: AndroidImportance.DEFAULT,
  });
  const smart = getStrings(smartStrings);
  await Notifications.setNotificationChannelAsync(SMART_CHANNEL_ID, {
    name: smart.smartChannelName,
    description: smart.smartChannelDescription,
    importance: AndroidImportance.DEFAULT,
  });
  await Notifications.setNotificationChannelAsync(STREAK_CHANNEL_ID, {
    name: t.streakChannelName,
    description: t.streakChannelDescription,
    importance: AndroidImportance.HIGH,
  });
}

export type PermissionResult = 'granted' | 'denied' | 'blocked';

/** Pide permiso si todavía no se decidió. `blocked`: hay que habilitarlo desde Ajustes. */
export async function requestReminderPermission(): Promise<PermissionResult> {
  if (!remindersSupported) return 'denied';
  await ensureChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return 'granted';
  if (!current.canAskAgain) return 'blocked';
  const asked = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowSound: true, allowBadge: false },
  });
  if (asked.granted) return 'granted';
  return asked.canAskAgain ? 'denied' : 'blocked';
}

export async function cancelReminders() {
  if (!remindersSupported) return;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter(
        (n) =>
          n.identifier.startsWith(ID_PREFIX) ||
          n.identifier.startsWith(SMART_PREFIX) ||
          n.identifier === STREAK_ALERT_ID,
      )
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );
}

interface SavedPush extends PushData {
  at: number;
}

/** Lo programado la vez anterior que ya pasó se dio por entregado: se avisa a PostHog una vez. */
async function reportDelivered(now: number) {
  try {
    const raw = await deviceStorage.getItem(PLAN_KEY);
    const saved: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(saved)) return;
    for (const p of saved as SavedPush[]) {
      if (typeof p?.at === 'number' && p.at <= now) {
        track('push_delivered', { kind: p.kind, type: p.type, variant: p.variant });
      }
    }
  } catch {
    // Medir nunca rompe los avisos.
  }
}

const CHANNEL_BY_KIND: Record<NotificationKind, string> = {
  daily: CHANNEL_ID,
  smart: SMART_CHANNEL_ID,
  streak: STREAK_CHANNEL_ID,
};

/** El push inteligente: contexto del usuario, prácticas (horario de oro) y prioridad de PostHog. */
export interface SmartInput {
  ctx: SmartContext;
  practiceTimes: readonly number[];
  priority?: readonly SmartType[];
}

/**
 * Reprograma los avisos de los próximos días (el recordatorio elegido, el push inteligente y el
 * aviso de racha; máximo 2 por día). No pide permiso: sin permiso concedido sólo borra los que
 * hubiera.
 */
export async function syncReminders(
  prefs: ReminderPrefs,
  state: StreakState,
  smart: SmartInput | null = null,
) {
  if (!remindersSupported) return;
  const now = new Date();
  await reportDelivered(now.getTime());
  await cancelReminders();
  await deviceStorage.removeItem(PLAN_KEY).catch(() => {});
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) return;
  await ensureChannel();
  const plan = planNotifications({
    now,
    prefs,
    ...state,
    smart: smart ? { enabled: prefs.smart !== false, ...smart } : null,
  });
  let daily = 0;
  let smartN = 0;
  const saved: SavedPush[] = [];
  await Promise.all(
    plan.map((r) => {
      const identifier =
        r.kind === 'streak'
          ? STREAK_ALERT_ID
          : r.kind === 'smart'
            ? `${SMART_PREFIX}${smartN++}`
            : `${ID_PREFIX}${daily++}`;
      const data: PushData = { kind: r.kind, type: r.type, variant: r.variant, route: r.route };
      saved.push({ ...data, at: r.date.getTime() });
      return Notifications.scheduleNotificationAsync({
        identifier,
        content: { title: r.title, body: r.body, data: { ...data } },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: r.date,
          channelId: CHANNEL_BY_KIND[r.kind],
        },
      });
    }),
  );
  await deviceStorage.setItem(PLAN_KEY, JSON.stringify(saved)).catch(() => {});
}
