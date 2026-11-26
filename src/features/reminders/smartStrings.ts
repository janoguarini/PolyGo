import { defineStrings } from '@/i18n';

/**
 * Textos del push inteligente (smart.ts). Dos variantes (a/b) por tipo: PostHog mide cuál se abre
 * más (push_delivered / push_opened con `variant`) para quedarnos con la mejor.
 */
type Msg = { title: string; body: string };

export const smartStrings = defineStrings({
  es: {
    streak: (days: number): [Msg, Msg] => [
      {
        title: `🔥 Tus ${days} días de racha dependen de hoy`,
        body: 'Una lección corta y la seguís estirando.',
      },
      {
        title: `🔥 ${days} días seguidos. ¿Hoy cortás?`,
        body: 'Dos minutos alcanzan para mantenerla viva.',
      },
    ],
    mission: (left: number): [Msg, Msg] => [
      {
        title: '🎯 Misión casi completa',
        body:
          left === 1
            ? 'Te falta 1 para completar la misión de hoy.'
            : `Te faltan ${left} para completar la misión de hoy.`,
      },
      { title: '🎯 ¡Estás a nada!', body: 'Terminá tu misión de hoy y sumá Polys.' },
    ],
    chest: (): [Msg, Msg] => [
      {
        title: '🎁 Tu cofre te está esperando',
        body: 'Completaste las misiones: abrilo y mirá qué te tocó.',
      },
      { title: '🎁 Hay un cofre sin abrir', body: '¿Te toca el premio grande hoy?' },
    ],
    rank: (points: number, next: string): [Msg, Msg] => [
      { title: `⚔️ Estás a ${points} de ELO de ${next}`, body: '¿Una partida de 60 segundos?' },
      {
        title: `⚔️ ${next} está ahí nomás`,
        body: `Te faltan ${points} puntos. Una victoria y subís.`,
      },
    ],
    lesson: (title: string, language: string): [Msg, Msg] => [
      { title: '📚 Tu próxima lección', body: `Te espera «${title}». ¡Seguí con el ${language}!` },
      { title: `📚 «${title}» está lista`, body: 'Cinco minutos y la terminás.' },
    ],
    word: (flag: string, word: string): [Msg, Msg] => [
      {
        title: `${flag} Palabra del día: ${word}`,
        body: '¿Sabés qué significa? Entrá y descubrila.',
      },
      { title: `${flag} ¿Qué significa «${word}»?`, body: 'La palabra de hoy te está esperando.' },
    ],
    comeback: (language: string): [Msg, Msg] => [
      {
        title: '🦊 ¡Te extraño!',
        body: `Tu ${language} te está esperando. Una lección y retomás.`,
      },
      { title: '🦊 ¿Seguimos?', body: `Volvé al ${language} con una lección cortita.` },
    ],
    smartChannelName: 'Avisos personalizados',
    smartChannelDescription: 'Un aviso por día a tu hora de práctica, con lo que más te sirve.',
    smartToggle: 'Avisos inteligentes',
    smartHint:
      'Un segundo aviso a la hora en que solés practicar, con lo que más te sirve ese día.',
  },
  en: {
    streak: (days: number): [Msg, Msg] => [
      {
        title: `🔥 Your ${days}-day streak depends on today`,
        body: 'One short lesson keeps it growing.',
      },
      {
        title: `🔥 ${days} days in a row. Stopping today?`,
        body: 'Two minutes is enough to keep it alive.',
      },
    ],
    mission: (left: number): [Msg, Msg] => [
      { title: '🎯 Mission almost done', body: `Just ${left} more to finish today’s mission.` },
      { title: '🎯 You’re so close!', body: 'Finish today’s mission and earn Polys.' },
    ],
    chest: (): [Msg, Msg] => [
      { title: '🎁 Your chest is waiting', body: 'Missions done: open it and see what you got.' },
      { title: '🎁 There’s an unopened chest', body: 'Is today the big prize?' },
    ],
    rank: (points: number, next: string): [Msg, Msg] => [
      { title: `⚔️ You’re ${points} ELO from ${next}`, body: 'Up for a 60-second match?' },
      {
        title: `⚔️ ${next} is right there`,
        body: `${points} points to go. One win and you’re up.`,
      },
    ],
    lesson: (title: string, language: string): [Msg, Msg] => [
      { title: '📚 Your next lesson', body: `“${title}” is waiting. Keep going with ${language}!` },
      { title: `📚 “${title}” is ready`, body: 'Five minutes and it’s done.' },
    ],
    word: (flag: string, word: string): [Msg, Msg] => [
      {
        title: `${flag} Word of the day: ${word}`,
        body: 'Do you know what it means? Come find out.',
      },
      { title: `${flag} What does “${word}” mean?`, body: 'Today’s word is waiting for you.' },
    ],
    comeback: (language: string): [Msg, Msg] => [
      { title: '🦊 I miss you!', body: `Your ${language} is waiting. One lesson and you’re back.` },
      { title: '🦊 Shall we continue?', body: `Get back to ${language} with a quick lesson.` },
    ],
    smartChannelName: 'Personalized reminders',
    smartChannelDescription: 'One reminder a day at your practice time, with what helps you most.',
    smartToggle: 'Smart reminders',
    smartHint:
      'A second reminder at the time you usually practice, with what helps you most that day.',
  },
});
