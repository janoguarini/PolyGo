import { daysLabel } from '@/features/learning/streak';
import { getStrings } from '@/i18n';

import {
  goldenHour,
  pickSmartMessage,
  smartSendTime,
  type SmartContext,
  type SmartType,
} from './smart';
import { reminderStrings } from './strings';

export interface ReminderPrefs {
  enabled: boolean;
  hour: number;
  minute: number;
  /** Push inteligente (el segundo aviso del día); por defecto, activado. */
  smart?: boolean;
}

/** Activado de fábrica a las 20:00 (llega sólo si el usuario dio permiso de notificaciones). */
export const DEFAULT_REMINDER: ReminderPrefs = { enabled: true, hour: 20, minute: 0 };

/** Horarios que se ofrecen en Perfil. */
export const REMINDER_HOURS = [8, 12, 18, 20, 21, 22] as const;

export interface PlannedReminder {
  date: Date;
  title: string;
  body: string;
}

/** Cuántos días por delante se programan; se reprograma cada vez que abrís la app o practicás. */
export const REMINDER_DAYS = 7;

/** La racha se corta a la medianoche local: el aviso llega estas horas antes. */
export const STREAK_ALERT_HOURS_BEFORE = 3;

export interface StreakState {
  streakDays: number;
  activeToday: boolean;
  /** Protectores guardados. */
  streakFreezes: number;
  /** Protectores que ya van a cubrir días que faltaste. */
  freezePending: number;
}

/**
 * Día (0 = hoy, 1 = mañana) en que la racha queda en juego suponiendo que no practicás más:
 * hoy si todavía no practicaste; mañana si ya lo hiciste. Sin racha no hay nada que perder.
 */
const streakRiskDay = ({ streakDays, activeToday }: StreakState) =>
  streakDays > 0 ? (activeToday ? 1 : 0) : null;

const alertDate = (now: Date, day: number) =>
  new Date(now.getFullYear(), now.getMonth(), now.getDate() + day, 24 - STREAK_ALERT_HOURS_BEFORE);

/**
 * Aviso de que la racha se pierde en {@link STREAK_ALERT_HOURS_BEFORE} horas. Es independiente
 * del recordatorio diario: llega aunque no lo hayas activado.
 */
export function planStreakAlert(input: { now: Date } & StreakState): PlannedReminder | null {
  const { now, streakDays, activeToday, streakFreezes, freezePending } = input;
  const day = streakRiskDay(input);
  if (day === null) return null;
  const date = alertDate(now, day);
  if (date.getTime() <= now.getTime()) return null;
  // Igual que en Inicio: un protector libre salva el día, salvo que ya esté cubriendo otros.
  const saved = streakFreezes > 0 && (activeToday || freezePending === 0);
  const t = getStrings(reminderStrings);
  return {
    date,
    title: t.streakAlertTitle(STREAK_ALERT_HOURS_BEFORE),
    body: saved
      ? t.streakAlertSaved(daysLabel(streakDays))
      : t.streakAlertBody(daysLabel(streakDays)),
  };
}

/**
 * Recordatorios de los próximos días a la hora elegida. Se arman suponiendo que no vas a
 * practicar más: si hoy ya practicaste no se avisa hoy. El día en que la racha está en juego,
 * si el recordatorio caería a la hora del aviso de racha o después, se omite para no repetir.
 */
export function planReminders(
  input: { now: Date; prefs: ReminderPrefs; days?: number } & Pick<
    StreakState,
    'streakDays' | 'activeToday'
  >,
): PlannedReminder[] {
  const { now, prefs, activeToday, days = REMINDER_DAYS } = input;
  if (!prefs.enabled) return [];
  const riskDay = streakRiskDay({ ...input, streakFreezes: 0, freezePending: 0 });
  const generic = getStrings(reminderStrings).generic;
  const plan: PlannedReminder[] = [];
  for (let k = 0; k < days; k++) {
    if (k === 0 && activeToday) continue;
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + k,
      prefs.hour,
      prefs.minute,
    );
    if (date.getTime() <= now.getTime()) continue;
    if (k === riskDay && date.getTime() >= alertDate(now, k).getTime()) continue;
    plan.push({ date, ...generic[k % generic.length]! });
  }
  return plan;
}

export const formatReminderTime = ({ hour, minute }: Pick<ReminderPrefs, 'hour' | 'minute'>) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

export type NotificationKind = 'daily' | 'smart' | 'streak';

/** Un aviso del plan, con lo que hace falta para medirlo en PostHog y abrir la pantalla justa. */
export interface PlannedNotification extends PlannedReminder {
  kind: NotificationKind;
  /** Tipo de mensaje del push inteligente (o el kind para los otros). */
  type: string;
  variant: string;
  route: string;
}

/** Como mucho, avisos por día (los dos que pidió el producto: el elegido y el inteligente). */
export const MAX_PER_DAY = 2;
/** Días por delante del push inteligente (se recalcula cada vez que abrís la app). */
export const SMART_DAYS = 4;
/** Desde esta hora un aviso ya cubre la noche: con él no hace falta el aviso de racha. */
const EVENING_HOUR = 17;

const dayIndex = (now: Date, date: Date) =>
  Math.round(
    (new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() -
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
      86_400_000,
  );

/**
 * El plan completo de los próximos días, con un máximo de {@link MAX_PER_DAY} por día:
 * - el recordatorio a la hora que elegiste (`daily`);
 * - el push inteligente a tu horario de oro (`smart`), con el mensaje más fuerte del día;
 * - el aviso de racha (`streak`) sólo si ese día ningún otro aviso cae a la noche; si con él serían
 *   tres, se deja el aviso de racha y se saca el inteligente.
 */
export function planNotifications(
  input: {
    now: Date;
    prefs: ReminderPrefs;
    smart: {
      enabled: boolean;
      ctx: SmartContext;
      practiceTimes: readonly number[];
      priority?: readonly SmartType[];
    } | null;
  } & StreakState,
): PlannedNotification[] {
  const { now, prefs, smart } = input;
  const plan: PlannedNotification[] = planReminders(input).map((r) => ({
    ...r,
    kind: 'daily' as const,
    type: 'daily',
    variant: 'a',
    route: '/',
  }));

  if (smart?.enabled) {
    const at = smartSendTime(
      goldenHour(smart.practiceTimes, now),
      prefs.enabled ? prefs.hour : null,
    );
    for (let k = 0; k < SMART_DAYS; k++) {
      if (k === 0 && input.activeToday) continue;
      const date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + k,
        at.hour,
        at.minute,
      );
      if (date.getTime() <= now.getTime()) continue;
      const msg = pickSmartMessage({ ctx: smart.ctx, day: k, date, priority: smart.priority });
      if (!msg) continue;
      plan.push({
        date,
        title: msg.title,
        body: msg.body,
        kind: 'smart',
        type: msg.type,
        variant: msg.variant,
        route: msg.route,
      });
    }
  }

  const alert = planStreakAlert(input);
  if (alert) {
    const day = dayIndex(now, alert.date);
    const sameDay = plan.filter((p) => dayIndex(now, p.date) === day);
    const eveningCovered = sameDay.some((p) => p.date.getHours() >= EVENING_HOUR);
    if (!eveningCovered) {
      if (sameDay.length >= MAX_PER_DAY) {
        const i = plan.findIndex((p) => p.kind === 'smart' && dayIndex(now, p.date) === day);
        if (i >= 0) plan.splice(i, 1);
      }
      plan.push({ ...alert, kind: 'streak', type: 'streak_alert', variant: 'a', route: '/' });
    }
  }
  return plan.sort((a, b) => a.date.getTime() - b.date.getTime());
}
