import { defineStrings } from '@/i18n';

/**
 * Recordatorios. Las notificaciones son locales: se arman con getStrings al programarlas, así que
 * salen en el idioma de la interfaz de ese momento (se reprograman al abrir la app).
 */
export const reminderStrings = defineStrings({
  es: {
    // Notificaciones (schedule.ts)
    generic: [
      { title: 'Hora de practicar', body: 'Una lección corta y sumás un día a tu racha.' },
      { title: 'Tu camino te espera', body: 'Cinco minutos hoy hacen la diferencia.' },
      { title: 'Volvé a Polygo', body: 'Repasá tus palabras antes de que se te olviden.' },
    ],
    streakAlertTitle: (hours: number) => `🔥 Quedan ${hours} horas para tu racha`,
    streakAlertSaved: (days: string) =>
      `Hacé una lección para sumar a tu racha de ${days}. Si no, se usa un protector.`,
    streakAlertBody: (days: string) =>
      `Hacé una lección antes de medianoche para no perder tu racha de ${days}.`,
    // Canales de Android (notifications.ts)
    dailyChannelName: 'Recordatorio diario',
    dailyChannelDescription: 'Un aviso por día para no cortar tu racha.',
    streakChannelName: 'Racha por perderse',
    streakChannelDescription: 'Avisa cuando quedan pocas horas para que se corte tu racha.',
    // ReminderSettings
    dailyReminder: 'Recordatorio diario',
    enabledHint: (time: string) => `Te avisamos a las ${time} si todavía no practicaste.`,
    disabledHint: 'Un aviso por día para no cortar tu racha.',
    schedule: 'Horario',
    denied: 'Sin permiso para notificaciones no podemos recordarte.',
    blocked: 'Las notificaciones de Polygo están desactivadas en los ajustes del teléfono.',
    openSettings: 'Abrir ajustes',
  },
  en: {
    generic: [
      { title: 'Time to practice', body: 'One short lesson adds a day to your streak.' },
      { title: 'Your path is waiting', body: 'Five minutes today makes a difference.' },
      { title: 'Come back to Polygo', body: 'Review your words before you forget them.' },
    ],
    streakAlertTitle: (hours: number) => `🔥 ${hours} hours left for your streak`,
    streakAlertSaved: (days: string) =>
      `Do a lesson to add to your ${days} streak. If not, a streak freeze will be used.`,
    streakAlertBody: (days: string) =>
      `Do a lesson before midnight so you don’t lose your ${days} streak.`,
    dailyChannelName: 'Daily reminder',
    dailyChannelDescription: 'One reminder a day to keep your streak going.',
    streakChannelName: 'Streak at risk',
    streakChannelDescription: 'Lets you know when your streak is about to end.',
    dailyReminder: 'Daily reminder',
    enabledHint: (time: string) => `We’ll remind you at ${time} if you haven’t practiced yet.`,
    disabledHint: 'One reminder a day to keep your streak going.',
    schedule: 'Time',
    denied: 'Without notification permission, we can’t remind you.',
    blocked: 'Polygo notifications are turned off in your phone settings.',
    openSettings: 'Open settings',
  },
});
