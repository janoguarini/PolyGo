import { daysLabel } from '@/features/learning/streak';

export interface ReminderPrefs {
  enabled: boolean;
  hour: number;
  minute: number;
}

export const DEFAULT_REMINDER: ReminderPrefs = { enabled: false, hour: 20, minute: 0 };

/** Horarios que se ofrecen en Perfil. */
export const REMINDER_HOURS = [8, 12, 18, 20, 21, 22] as const;

export interface PlannedReminder {
  date: Date;
  title: string;
  body: string;
}

const GENERIC = [
  { title: 'Hora de practicar inglés', body: 'Una lección corta y sumás un día a tu racha.' },
  { title: 'Tu camino te espera', body: 'Cinco minutos hoy hacen la diferencia.' },
  { title: 'Volvé a Polygo', body: 'Repasá tus palabras antes de que se te olviden.' },
];

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
  return {
    date,
    title: `🔥 Quedan ${STREAK_ALERT_HOURS_BEFORE} horas para tu racha`,
    body: saved
      ? `Hacé una lección para sumar a tu racha de ${daysLabel(streakDays)}. Si no, se usa un protector.`
      : `Hacé una lección antes de medianoche para no perder tu racha de ${daysLabel(streakDays)}.`,
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
    plan.push({ date, ...GENERIC[k % GENERIC.length]! });
  }
  return plan;
}

export const formatReminderTime = ({ hour, minute }: Pick<ReminderPrefs, 'hour' | 'minute'>) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
