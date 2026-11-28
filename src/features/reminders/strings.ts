import { defineStrings } from '@/i18n';

/**
 * Recordatorios. Las notificaciones son locales: se arman con getStrings al programarlas, así que
 * salen en el idioma de la interfaz de ese momento (se reprograman al abrir la app).
 */
export const reminderStrings = defineStrings({
  es: {
    // Notificaciones (schedule.ts)
    generic: [
      { title: 'Hora de practicar', body: 'Una lección corta y sumas un día a tu racha.' },
      { title: 'Tu camino te espera', body: 'Cinco minutos hoy hacen la diferencia.' },
      { title: 'Vuelve a PolyGo', body: 'Repasa tus palabras antes de que se te olviden.' },
    ],
    streakAlertTitle: (hours: number) => `🔥 Quedan ${hours} horas para tu racha`,
    streakAlertSaved: (days: string) =>
      `Haz una lección para sumar a tu racha de ${days}. Si no, se usa un protector.`,
    streakAlertBody: (days: string) =>
      `Haz una lección antes de medianoche para no perder tu racha de ${days}.`,
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
    blocked: 'Las notificaciones de PolyGo están desactivadas en los ajustes del teléfono.',
    openSettings: 'Abrir ajustes',
  },
  en: {
    generic: [
      { title: 'Time to practice', body: 'One short lesson adds a day to your streak.' },
      { title: 'Your path is waiting', body: 'Five minutes today makes a difference.' },
      { title: 'Come back to PolyGo', body: 'Review your words before you forget them.' },
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
    blocked: 'PolyGo notifications are turned off in your phone settings.',
    openSettings: 'Open settings',
  },
  'pt-BR': {
    generic: [
      { title: 'Hora de praticar', body: 'Uma lição rápida e você soma um dia à sua sequência.' },
      { title: 'Sua trilha está te esperando', body: 'Cinco minutos hoje fazem a diferença.' },
      { title: 'Volte ao PolyGo', body: 'Revise suas palavras antes de esquecer.' },
    ],
    streakAlertTitle: (hours: number) =>
      `🔥 Sua sequência acaba em ${hours} ${hours === 1 ? 'hora' : 'horas'}`,
    streakAlertSaved: (days: string) =>
      `Faça uma lição para somar à sua sequência de ${days}. Se não, um protetor será usado.`,
    streakAlertBody: (days: string) =>
      `Faça uma lição antes da meia-noite para não perder sua sequência de ${days}.`,
    dailyChannelName: 'Lembrete diário',
    dailyChannelDescription: 'Um aviso por dia para não perder sua sequência.',
    streakChannelName: 'Sequência em risco',
    streakChannelDescription: 'Avisa quando faltam poucas horas para sua sequência acabar.',
    dailyReminder: 'Lembrete diário',
    enabledHint: (time: string) => `A gente te avisa às ${time} se você ainda não praticou.`,
    disabledHint: 'Um aviso por dia para não perder sua sequência.',
    schedule: 'Horário',
    denied: 'Sem permissão para notificações, não conseguimos te lembrar.',
    blocked: 'As notificações do PolyGo estão desativadas nas configurações do celular.',
    openSettings: 'Abrir configurações',
  },
  it: {
    generic: [
      {
        title: 'È ora di fare pratica',
        body: 'Una lezione breve e aggiungi un giorno alla tua serie.',
      },
      { title: 'Il tuo percorso ti aspetta', body: 'Cinque minuti oggi fanno la differenza.' },
      { title: 'Torna su PolyGo', body: 'Ripassa le tue parole prima di dimenticarle.' },
    ],
    streakAlertTitle: (hours: number) =>
      `🔥 ${hours === 1 ? 'Resta 1 ora' : `Restano ${hours} ore`} per salvare la tua serie`,
    streakAlertSaved: (days: string) =>
      `Fai una lezione per allungare la tua serie di ${days}. Altrimenti verrà usata una protezione.`,
    streakAlertBody: (days: string) =>
      `Fai una lezione prima di mezzanotte per non perdere la tua serie di ${days}.`,
    dailyChannelName: 'Promemoria giornaliero',
    dailyChannelDescription: 'Un avviso al giorno per non interrompere la tua serie.',
    streakChannelName: 'Serie a rischio',
    streakChannelDescription:
      'Ti avvisa quando mancano poche ore prima che la tua serie si interrompa.',
    dailyReminder: 'Promemoria giornaliero',
    enabledHint: (time: string) => `Ti avvisiamo alle ${time} se non hai ancora fatto pratica.`,
    disabledHint: 'Un avviso al giorno per non interrompere la tua serie.',
    schedule: 'Orario',
    denied: 'Senza il permesso per le notifiche non possiamo ricordartelo.',
    blocked: 'Le notifiche di PolyGo sono disattivate nelle impostazioni del telefono.',
    openSettings: 'Apri impostazioni',
  },
  fr: {
    generic: [
      { title: 'C’est l’heure de pratiquer', body: 'Une petite leçon et ta série gagne un jour.' },
      { title: 'Ton parcours t’attend', body: 'Cinq minutes aujourd’hui, ça change tout.' },
      { title: 'Reviens sur PolyGo', body: 'Révise tes mots avant de les oublier.' },
    ],
    streakAlertTitle: (hours: number) =>
      `🔥 Plus que ${hours} ${hours === 1 ? 'heure' : 'heures'} pour ta série`,
    streakAlertSaved: (days: string) =>
      `Fais une leçon pour prolonger ta série de ${days}. Sinon, un protecteur sera utilisé.`,
    streakAlertBody: (days: string) =>
      `Fais une leçon avant minuit pour ne pas perdre ta série de ${days}.`,
    dailyChannelName: 'Rappel quotidien',
    dailyChannelDescription: 'Un rappel par jour pour garder ta série.',
    streakChannelName: 'Série en danger',
    streakChannelDescription: 'Te prévient quand il reste peu d’heures avant la fin de ta série.',
    dailyReminder: 'Rappel quotidien',
    enabledHint: (time: string) => `On te prévient à ${time} si tu n’as pas encore pratiqué.`,
    disabledHint: 'Un rappel par jour pour garder ta série.',
    schedule: 'Horaire',
    denied: 'Sans l’autorisation des notifications, on ne peut pas te le rappeler.',
    blocked: 'Les notifications de PolyGo sont désactivées dans les réglages du téléphone.',
    openSettings: 'Ouvrir les réglages',
  },
});
