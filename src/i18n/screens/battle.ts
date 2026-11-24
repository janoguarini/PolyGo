import { languageConfig } from '@shared/languages';

import { defineStrings } from '..';
import { languageName } from '../languages';

/** Pantalla de partida (src/app/battle.tsx). */
export const battleScreenStrings = defineStrings({
  es: {
    noMatchesIn: (code: string | null | undefined) =>
      `Todavía no hay partidas en ${languageName(code, 'es').toLowerCase()}`,
    noMatchesBody:
      'Las partidas se habilitan cuando el nivel A1 de este idioma esté completo. Para jugar, cambiá a otro idioma desde tu perfil.',
    back: 'Volver',
    serverMissingDev:
      'Falta o es inválida EXPO_PUBLIC_BATTLE_SERVER_URL (en desarrollo puede ser http). Los desafíos con amigos siguen funcionando.',
    serverMissing:
      'No pudimos conectar esta versión de PolyGo con el servidor de partidas. Podés seguir desafiando a tus amigos.',
    leaveTitle: '¿Abandonar la partida?',
    leaveFriendly: 'Abandonar cuenta como derrota en el desafío (no mueve el ELO).',
    leaveRanked: 'Abandonar cuenta como derrota y te baja el ELO.',
    keepPlaying: 'Seguir jugando',
    forfeit: 'Abandonar',
    exit: 'Salir',
    forfeitHint: 'Abandonar cuenta como derrota',
    exitHint: 'Vuelve a la pantalla anterior',
    labelFriendly: 'DESAFÍO · SIN ELO',
    labelPractice: 'PRÁCTICA · SIN ELO',
    labelBotPractice: 'PRÁCTICA CONTRA BOT · SIN ELO',
    labelCalibration: (used: number, limit: number) => `RANKED · CALIBRACIÓN ${used}/${limit}`,
    labelRanked: 'RANKED · WORD RUSH',
    noteBotPractice: 'Práctica contra un bot: no mueve tu ELO ni da recompensas de Ranked.',
    noteCalibration: (used: number, limit: number) =>
      `Partida de calibración ${used} de ${limit} contra un bot: mueve tu ELO. Después, el ELO sólo se juega contra personas.`,
    noteCompetitive: 'Partida contra una persona: mueve tu ELO.',
    preparing: 'Preparando la partida…',
    declinedTitle: (name: string | undefined) =>
      name ? `@${name} no puede ahora` : 'Tu amigo no puede ahora',
    challengeFailedTitle: 'No se pudo entrar al desafío',
    createOwnChallenge: 'Crear mi propio desafío',
    searching: 'Buscando rival…',
    waitingA11y: (mm: number, ss: string) => `Esperando ${mm} minutos ${ss} segundos`,
    onlyHumans: 'Buscamos a una persona de tu nivel: las partidas contra bots ya no mueven tu ELO.',
    practiceVsBot: 'Practicar contra un bot (sin ELO)',
    cancelSearch: 'Cancelar búsqueda',
    opponentFound: '¡Rival encontrado!',
    you: 'Vos',
    rules:
      '75 segundos, las mismas preguntas para los dos. Correcta +100 (+50 por rapidez), incorrecta −50. Encadená aciertos: la racha suma hasta +30.',
    waitingOpponent: 'Esperando a tu rival…',
    ready: '¡Listo!',
    confirmIn: (s: number) => `Confirmá en ${s} s o la partida se cancela.`,
    go: '¡Ya!',
    timeUp: '¡Tiempo! Calculando el resultado…',
    allAnswered: 'Respondiste todas. Esperando el final…',
    cancelledTitle: 'Partida cancelada',
    missedEndTitle: 'Te perdiste el final',
    missedEndBody:
      'La partida terminó mientras estabas desconectado. Mirá el resultado en tu historial.',
    newChallenge: 'Nuevo desafío',
    practiceAgain: 'Practicar de nuevo',
    findAnother: 'Buscar otra partida',
    shareMessage: (code: string, language: string, link: string) =>
      `¡Te desafío en Polygo! 75 segundos de vocabulario ${languageConfig(language).inName}, vos contra mí. Entrá con el código ${code} (Ranked → Tengo un código) o tocá: ${link}`,
    waitingFor: (name: string) => `Esperando a @${name}`,
    inviteSent: 'Le llegó tu invitación en la app. Cuando la acepte, la partida empieza sola.',
    inviteNote:
      'Amistoso: no mueve el ELO. Dejá esta pantalla abierta: si la cerrás, la invitación se cancela.',
    cancelInvite: 'Cancelar invitación',
    challengeCreated: 'Desafío creado',
    passCode: 'Pasale este código a tu amigo. Cuando entre, la partida empieza sola.',
    codeA11y: (spelled: string) => `Código ${spelled}`,
    shareChallenge: 'Compartir desafío',
    codeNote:
      'Amistoso: no mueve el ELO. Dejá esta pantalla abierta mientras esperás; el código vence en 15 minutos.',
    cancelChallenge: 'Cancelar desafío',
    playerA11y: (name: string, isBot: boolean, elo: string | null) =>
      `${name}${isBot ? ', bot' : ''}, ${elo !== null ? `${elo} ELO` : 'sin posicionar'}`,
  },
  en: {
    noMatchesIn: (code: string | null | undefined) =>
      `No matches in ${languageName(code, 'en')} yet`,
    noMatchesBody:
      'Matches open up once the A1 level for this language is complete. To play, switch to another language from your profile.',
    back: 'Back',
    serverMissingDev:
      'EXPO_PUBLIC_BATTLE_SERVER_URL is missing or invalid (in development it can be http). Friend challenges still work.',
    serverMissing:
      'We couldn’t connect this version of PolyGo to the match server. You can still challenge your friends.',
    leaveTitle: 'Leave the match?',
    leaveFriendly: 'Leaving counts as a loss in the challenge (ELO doesn’t change).',
    leaveRanked: 'Leaving counts as a loss and lowers your ELO.',
    keepPlaying: 'Keep playing',
    forfeit: 'Leave',
    exit: 'Exit',
    forfeitHint: 'Leaving counts as a loss',
    exitHint: 'Goes back to the previous screen',
    labelFriendly: 'CHALLENGE · NO ELO',
    labelPractice: 'PRACTICE · NO ELO',
    labelBotPractice: 'PRACTICE VS BOT · NO ELO',
    labelCalibration: (used: number, limit: number) => `RANKED · CALIBRATION ${used}/${limit}`,
    labelRanked: 'RANKED · WORD RUSH',
    noteBotPractice: 'Practice against a bot: it won’t change your ELO or give Ranked rewards.',
    noteCalibration: (used: number, limit: number) =>
      `Calibration match ${used} of ${limit} against a bot: it changes your ELO. After that, ELO is only on the line against people.`,
    noteCompetitive: 'Match against a person: it changes your ELO.',
    preparing: 'Getting the match ready…',
    declinedTitle: (name: string | undefined) =>
      name ? `@${name} can’t play right now` : 'Your friend can’t play right now',
    challengeFailedTitle: 'Couldn’t join the challenge',
    createOwnChallenge: 'Create my own challenge',
    searching: 'Looking for an opponent…',
    waitingA11y: (mm: number, ss: string) => `Waiting ${mm} minutes ${ss} seconds`,
    onlyHumans:
      'We’re looking for a person at your level: matches against bots no longer change your ELO.',
    practiceVsBot: 'Practice against a bot (no ELO)',
    cancelSearch: 'Cancel search',
    opponentFound: 'Opponent found!',
    you: 'You',
    rules:
      '75 seconds, the same questions for both of you. Correct +100 (+50 for speed), wrong −50. Chain correct answers: your streak adds up to +30.',
    waitingOpponent: 'Waiting for your opponent…',
    ready: 'Ready!',
    confirmIn: (s: number) => `Confirm within ${s} s or the match is canceled.`,
    go: 'Go!',
    timeUp: 'Time’s up! Calculating the result…',
    allAnswered: 'You answered them all. Waiting for the end…',
    cancelledTitle: 'Match canceled',
    missedEndTitle: 'You missed the ending',
    missedEndBody:
      'The match ended while you were disconnected. Check the result in your match history.',
    newChallenge: 'New challenge',
    practiceAgain: 'Practice again',
    findAnother: 'Find another match',
    shareMessage: (code: string, language: string, link: string) =>
      `I challenge you on Polygo! 75 seconds of ${languageName(language, 'en')} vocabulary, you vs. me. Join with the code ${code} (Ranked → I have a code) or tap: ${link}`,
    waitingFor: (name: string) => `Waiting for @${name}`,
    inviteSent:
      'Your invite reached them in the app. Once they accept, the match starts on its own.',
    inviteNote:
      'Friendly: ELO doesn’t change. Keep this screen open: if you close it, the invite is canceled.',
    cancelInvite: 'Cancel invite',
    challengeCreated: 'Challenge created',
    passCode: 'Give this code to your friend. Once they join, the match starts on its own.',
    codeA11y: (spelled: string) => `Code ${spelled}`,
    shareChallenge: 'Share challenge',
    codeNote:
      'Friendly: ELO doesn’t change. Keep this screen open while you wait; the code expires in 15 minutes.',
    cancelChallenge: 'Cancel challenge',
    playerA11y: (name: string, isBot: boolean, elo: string | null) =>
      `${name}${isBot ? ', bot' : ''}, ${elo !== null ? `${elo} ELO` : 'unranked'}`,
  },
});
