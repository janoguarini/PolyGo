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

/**
 * Recordatorios de los próximos días a la hora elegida. Se arman suponiendo que no vas a
 * practicar más: si hoy ya practicaste no se avisa hoy, y la racha que se menciona es la que
 * estaría en riesgo ese día.
 */
export function planReminders(input: {
  now: Date;
  prefs: ReminderPrefs;
  streakDays: number;
  activeToday: boolean;
  days?: number;
}): PlannedReminder[] {
  const { now, prefs, streakDays, activeToday, days = REMINDER_DAYS } = input;
  if (!prefs.enabled) return [];
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
    // Hoy sin practicar: está en riesgo la racha actual. Mañana, sólo si hoy practicaste
    // (si no, para entonces ya se cortó).
    const atRisk = streakDays > 0 && ((k === 0 && !activeToday) || (k === 1 && activeToday));
    plan.push(
      atRisk
        ? {
            date,
            title: '🔥 Tu racha está en riesgo',
            body: `Hacé una lección hoy para no perder tu racha de ${daysLabel(streakDays)}.`,
          }
        : { date, ...GENERIC[k % GENERIC.length]! },
    );
  }
  return plan;
}

export const formatReminderTime = ({ hour, minute }: Pick<ReminderPrefs, 'hour' | 'minute'>) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
