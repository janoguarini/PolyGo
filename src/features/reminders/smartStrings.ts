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
        body: 'Una lección corta y la sigues alargando.',
      },
      {
        title: `🔥 ${days} días seguidos. ¿Hoy la cortas?`,
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
      { title: '🎯 ¡Estás a nada!', body: 'Termina tu misión de hoy y suma Polys.' },
    ],
    chest: (): [Msg, Msg] => [
      {
        title: '🎁 Tu cofre te está esperando',
        body: 'Completaste las misiones: ábrelo y mira qué te tocó.',
      },
      { title: '🎁 Hay un cofre sin abrir', body: '¿Te toca el premio grande hoy?' },
    ],
    rank: (points: number, next: string): [Msg, Msg] => [
      { title: `⚔️ Estás a ${points} de ELO de ${next}`, body: '¿Una partida de 60 segundos?' },
      {
        title: `⚔️ ${next} está muy cerca`,
        body: `Te faltan ${points} puntos. Una victoria y subes.`,
      },
    ],
    lesson: (title: string, language: string): [Msg, Msg] => [
      { title: '📚 Tu próxima lección', body: `Te espera «${title}». ¡Sigue con el ${language}!` },
      { title: `📚 «${title}» está lista`, body: 'Cinco minutos y la terminas.' },
    ],
    word: (flag: string, word: string): [Msg, Msg] => [
      {
        title: `${flag} Palabra del día: ${word}`,
        body: '¿Sabes qué significa? Entra y descúbrela.',
      },
      { title: `${flag} ¿Qué significa «${word}»?`, body: 'La palabra de hoy te está esperando.' },
    ],
    comeback: (language: string): [Msg, Msg] => [
      {
        title: '🦊 ¡Te extraño!',
        body: `Tu ${language} te está esperando. Una lección y retomas.`,
      },
      { title: '🦊 ¿Seguimos?', body: `Vuelve al ${language} con una lección cortita.` },
    ],
    smartChannelName: 'Avisos personalizados',
    smartChannelDescription: 'Un aviso por día a tu hora de práctica, con lo que más te sirve.',
    smartToggle: 'Avisos inteligentes',
    smartHint:
      'Un segundo aviso a la hora en que sueles practicar, con lo que más te sirve ese día.',
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
  'pt-BR': {
    streak: (days: number): [Msg, Msg] => [
      {
        title: `🔥 Seus ${days} dias de sequência dependem de hoje`,
        body: 'Uma lição rápida e ela continua crescendo.',
      },
      {
        title: `🔥 ${days} dias seguidos. Vai parar hoje?`,
        body: 'Dois minutinhos bastam para mantê-la viva.',
      },
    ],
    mission: (left: number): [Msg, Msg] => [
      {
        title: '🎯 Missão quase completa',
        body:
          left === 1
            ? 'Falta 1 para completar a missão de hoje.'
            : `Faltam ${left} para completar a missão de hoje.`,
      },
      { title: '🎯 Falta pouquinho!', body: 'Termine sua missão de hoje e ganhe Polys.' },
    ],
    chest: (): [Msg, Msg] => [
      {
        title: '🎁 Seu baú está esperando',
        body: 'Você completou as missões: abra e veja o que ganhou.',
      },
      { title: '🎁 Tem um baú fechado', body: 'Será que hoje sai o prêmio grande?' },
    ],
    rank: (points: number, next: string): [Msg, Msg] => [
      {
        title: `⚔️ ${points === 1 ? 'Falta' : 'Faltam'} ${points} ELO para ${next}`,
        body: 'Uma partida de 60 segundos?',
      },
      {
        title: `⚔️ ${next} está logo ali`,
        body: `${points === 1 ? 'Falta 1 ponto' : `Faltam ${points} pontos`}. Uma vitória e você sobe.`,
      },
    ],
    lesson: (title: string, language: string): [Msg, Msg] => [
      {
        title: '📚 Sua próxima lição',
        body: `«${title}» está te esperando. Continue com o ${language}!`,
      },
      { title: `📚 «${title}» está pronta`, body: 'Cinco minutos e você termina.' },
    ],
    word: (flag: string, word: string): [Msg, Msg] => [
      {
        title: `${flag} Palavra do dia: ${word}`,
        body: 'Você sabe o que significa? Entre e descubra.',
      },
      { title: `${flag} O que significa «${word}»?`, body: 'A palavra de hoje está te esperando.' },
    ],
    comeback: (language: string): [Msg, Msg] => [
      {
        title: '🦊 Que saudade!',
        body: `Seu ${language} está te esperando. Uma lição e você retoma.`,
      },
      { title: '🦊 Vamos continuar?', body: `Volte ao ${language} com uma lição rapidinha.` },
    ],
    smartChannelName: 'Avisos personalizados',
    smartChannelDescription: 'Um aviso por dia no seu horário de prática, com o que mais te ajuda.',
    smartToggle: 'Avisos inteligentes',
    smartHint:
      'Um segundo aviso no horário em que você costuma praticar, com o que mais te ajuda naquele dia.',
  },
  it: {
    streak: (days: number): [Msg, Msg] => [
      {
        title: `🔥 La tua serie di ${days} giorni dipende da oggi`,
        body: 'Una lezione breve e continui ad allungarla.',
      },
      {
        title: `🔥 ${days} giorni di fila. Oggi ti fermi?`,
        body: 'Bastano due minuti per tenerla viva.',
      },
    ],
    mission: (left: number): [Msg, Msg] => [
      {
        title: '🎯 Missione quasi completata',
        body:
          left === 1
            ? 'Ti manca 1 per completare la missione di oggi.'
            : `Ti mancano ${left} per completare la missione di oggi.`,
      },
      { title: '🎯 Ci sei quasi!', body: 'Finisci la missione di oggi e guadagna Polys.' },
    ],
    chest: (): [Msg, Msg] => [
      {
        title: '🎁 Il tuo forziere ti aspetta',
        body: 'Hai completato le missioni: aprilo e scopri cosa hai vinto.',
      },
      { title: '🎁 C’è un forziere da aprire', body: 'Oggi tocca a te il premio grosso?' },
    ],
    rank: (points: number, next: string): [Msg, Msg] => [
      {
        title: `⚔️ ${points === 1 ? 'Ti manca' : 'Ti mancano'} ${points} ELO per ${next}`,
        body: 'Una partita da 60 secondi?',
      },
      {
        title: `⚔️ ${next} è a un passo`,
        body: `${points === 1 ? 'Ti manca 1 punto' : `Ti mancano ${points} punti`}. Una vittoria e sali.`,
      },
    ],
    lesson: (title: string, language: string): [Msg, Msg] => [
      {
        title: '📚 La tua prossima lezione',
        body: `Ti aspetta «${title}». Continua a studiare ${language}!`,
      },
      { title: `📚 «${title}» è pronta`, body: 'Cinque minuti e l’hai finita.' },
    ],
    word: (flag: string, word: string): [Msg, Msg] => [
      {
        title: `${flag} Parola del giorno: ${word}`,
        body: 'Sai cosa significa? Entra e scoprilo.',
      },
      { title: `${flag} Cosa significa «${word}»?`, body: 'La parola di oggi ti aspetta.' },
    ],
    comeback: (language: string): [Msg, Msg] => [
      {
        title: '🦊 Mi manchi!',
        body: `Il tuo ${language} ti aspetta. Una lezione e riparti.`,
      },
      {
        title: '🦊 Continuiamo?',
        body: `Torna a studiare ${language} con una lezione veloce.`,
      },
    ],
    smartChannelName: 'Avvisi personalizzati',
    smartChannelDescription:
      'Un avviso al giorno all’ora in cui fai pratica, con ciò che ti serve di più.',
    smartToggle: 'Avvisi intelligenti',
    smartHint:
      'Un secondo avviso all’ora in cui di solito fai pratica, con ciò che ti serve di più quel giorno.',
  },
  fr: {
    streak: (days: number): [Msg, Msg] => [
      {
        title: `🔥 Ta série de ${days} jours dépend d’aujourd’hui`,
        body: 'Une petite leçon et elle continue de grandir.',
      },
      {
        title: `🔥 ${days} jours d’affilée. Tu t’arrêtes ?`,
        body: 'Deux minutes suffisent pour la garder en vie.',
      },
    ],
    mission: (left: number): [Msg, Msg] => [
      {
        title: '🎯 Mission presque terminée',
        body: `Encore ${left} pour finir la mission du jour.`,
      },
      { title: '🎯 Tu y es presque !', body: 'Termine ta mission du jour et gagne des Polys.' },
    ],
    chest: (): [Msg, Msg] => [
      {
        title: '🎁 Ton coffre t’attend',
        body: 'Missions terminées : ouvre-le et découvre ton gain.',
      },
      { title: '🎁 Un coffre reste à ouvrir', body: 'Et si c’était le gros lot aujourd’hui ?' },
    ],
    rank: (points: number, next: string): [Msg, Msg] => [
      {
        title: `⚔️ Plus que ${points} ELO avant ${next}`,
        body: 'Une partie de 60 secondes ?',
      },
      {
        title: `⚔️ ${next} est tout proche`,
        body: `Encore ${points} ${points === 1 ? 'point' : 'points'}. Une victoire et tu montes.`,
      },
    ],
    lesson: (title: string, language: string): [Msg, Msg] => [
      { title: '📚 Ta prochaine leçon', body: `« ${title} » t’attend. Continue ton ${language} !` },
      { title: `📚 « ${title} » est prête`, body: 'Cinq minutes et c’est fini.' },
    ],
    word: (flag: string, word: string): [Msg, Msg] => [
      {
        title: `${flag} Mot du jour : ${word}`,
        body: 'Tu sais ce que ça veut dire ? Viens voir.',
      },
      { title: `${flag} Que veut dire « ${word} » ?`, body: 'Le mot du jour t’attend.' },
    ],
    comeback: (language: string): [Msg, Msg] => [
      {
        title: '🦊 Tu me manques !',
        body: `Ton ${language} t’attend. Une leçon et c’est reparti.`,
      },
      { title: '🦊 On continue ?', body: `Reviens à ton ${language} avec une petite leçon.` },
    ],
    smartChannelName: 'Rappels personnalisés',
    smartChannelDescription: 'Un rappel par jour à ton heure de pratique, avec ce qui t’aide le plus.',
    smartToggle: 'Rappels intelligents',
    smartHint:
      'Un deuxième rappel à l’heure où tu pratiques d’habitude, avec ce qui t’aide le plus ce jour-là.',
  },
});
