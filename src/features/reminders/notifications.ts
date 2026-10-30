import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { deviceStorage } from '@/lib/secureStorage';

import { DEFAULT_REMINDER, planReminders, type ReminderPrefs } from './schedule';

/** En web no hay notificaciones locales programadas. */
export const remindersSupported = Platform.OS !== 'web';

const PREFS_KEY = 'polygo.reminder';
const CHANNEL_ID = 'daily-reminder';
const ID_PREFIX = 'daily-reminder-';

export async function loadReminderPrefs(): Promise<ReminderPrefs> {
  try {
    const raw = await deviceStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_REMINDER;
    const parsed = JSON.parse(raw) as Partial<ReminderPrefs>;
    return {
      enabled: parsed.enabled === true,
      hour: Number.isInteger(parsed.hour) ? parsed.hour! : DEFAULT_REMINDER.hour,
      minute: Number.isInteger(parsed.minute) ? parsed.minute! : DEFAULT_REMINDER.minute,
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
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Recordatorio diario',
    description: 'Un aviso por día para no cortar tu racha.',
    importance: AndroidImportance.DEFAULT,
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
      .filter((n) => n.identifier.startsWith(ID_PREFIX))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );
}

/**
 * Reprograma los recordatorios de los próximos días según tu racha de hoy. No pide permiso:
 * sin permiso concedido sólo borra los que hubiera.
 */
export async function syncReminders(
  prefs: ReminderPrefs,
  state: { streakDays: number; activeToday: boolean },
) {
  if (!remindersSupported) return;
  await cancelReminders();
  if (!prefs.enabled) return;
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) return;
  await ensureChannel();
  const plan = planReminders({ now: new Date(), prefs, ...state });
  await Promise.all(
    plan.map((r, i) =>
      Notifications.scheduleNotificationAsync({
        identifier: `${ID_PREFIX}${i}`,
        content: { title: r.title, body: r.body },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: r.date,
          channelId: CHANNEL_ID,
        },
      }),
    ),
  );
}
