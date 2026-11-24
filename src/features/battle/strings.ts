import { languageConfig } from '@shared/languages';
import type { CancelReason, ErrorCode } from '@shared/protocol';

import { defineStrings } from '@/i18n';
import { languageName, languageShortName } from '@/i18n/languages';

type ErrorKey = ErrorCode | 'connection';

/** Idioma de las traducciones de un curso (shared/languages.ts `support`; sin el campo, español). */
const supportOf = (code: string) => languageConfig(code).support?.code ?? 'es';

/** Mensajes de error de las partidas, por código estable del protocolo (no se tocan los códigos). */
export const battleErrorStrings = defineStrings<Record<ErrorKey, string>>({
  es: {
    connection: 'No pudimos conectar con el servidor de partidas. Revisá tu conexión.',
    unauthorized: 'Tu sesión expiró. Volvé a iniciar sesión.',
    protocol_mismatch: 'Hay una versión nueva de Polygo. Actualizá la app para jugar.',
    onboarding_required: 'Completá tu perfil antes de jugar.',
    language_unavailable: 'Ranked todavía no está disponible para tu idioma.',
    already_in_battle: 'Ya estás en una partida.',
    not_in_battle: 'La partida ya no existe.',
    stale_question: 'Esa pregunta ya pasó.',
    battle_over: 'La partida terminó.',
    invalid_payload: 'Algo salió mal con esa respuesta.',
    server_error: 'El servidor de partidas tuvo un problema. Probá de nuevo.',
    match_rate_limited: 'Jugaste muchas partidas hoy. Volvé mañana para seguir subiendo.',
    challenge_not_found: 'No encontramos ese código. Revisá que esté bien escrito.',
    challenge_expired: 'Ese desafío venció o se canceló. Pedile a tu amigo uno nuevo.',
    challenge_taken: 'Alguien más ya entró a ese desafío.',
    own_challenge: 'Ese es tu propio desafío: compartilo con un amigo.',
    host_gone: 'Tu amigo ya no está esperando. Pedile que vuelva a abrir el desafío.',
    language_mismatch: 'Tu amigo está aprendiendo otro idioma, así que no pueden jugar juntos.',
    challenge_declined: 'Tu amigo no puede jugar ahora. Probá más tarde.',
    not_friends: 'Sólo podés invitar a jugadores de tu lista de amigos.',
  },
  en: {
    connection: 'We couldn’t reach the match server. Check your connection.',
    unauthorized: 'Your session expired. Please sign in again.',
    protocol_mismatch: 'A new version of Polygo is out. Update the app to play.',
    onboarding_required: 'Finish setting up your profile before playing.',
    language_unavailable: 'Ranked isn’t available for your language yet.',
    already_in_battle: 'You’re already in a match.',
    not_in_battle: 'This match no longer exists.',
    stale_question: 'That question already passed.',
    battle_over: 'The match is over.',
    invalid_payload: 'Something went wrong with that answer.',
    server_error: 'The match server ran into a problem. Try again.',
    match_rate_limited:
      'You’ve played a lot of matches today. Come back tomorrow to keep climbing.',
    challenge_not_found: 'We couldn’t find that code. Check that it’s spelled right.',
    challenge_expired: 'That challenge expired or was canceled. Ask your friend for a new one.',
    challenge_taken: 'Someone else already joined that challenge.',
    own_challenge: 'That’s your own challenge: share it with a friend.',
    host_gone: 'Your friend is no longer waiting. Ask them to open the challenge again.',
    language_mismatch: 'Your friend is learning a different language, so you can’t play together.',
    challenge_declined: 'Your friend can’t play right now. Try again later.',
    not_friends: 'You can only invite players from your friends list.',
  },
});

/** Por qué se canceló una partida antes de empezar. */
export const cancelStrings = defineStrings<Record<CancelReason, string>>({
  es: {
    ready_timeout: 'Alguno de los dos no confirmó a tiempo. No se movió el ELO.',
    opponent_left: 'Tu rival se fue antes de empezar. No se movió el ELO.',
    server_error: 'El servidor no pudo empezar la partida. No se movió el ELO.',
    settlement_failed: 'No pudimos guardar el resultado, así que la partida se anuló sin ELO.',
  },
  en: {
    ready_timeout: 'One of you didn’t confirm in time. ELO didn’t change.',
    opponent_left: 'Your opponent left before the start. ELO didn’t change.',
    server_error: 'The server couldn’t start the match. ELO didn’t change.',
    settlement_failed: 'We couldn’t save the result, so the match was voided with no ELO change.',
  },
});

/** Textos de los componentes de src/features/battle y de la disponibilidad de Ranked. */
export const battleStrings = defineStrings({
  es: {
    rankedUnavailableTitle: 'Ranked no está disponible en esta versión',
    /** Nombre del idioma dentro de una frase: «italiano». */
    languageInSentence: (code: string | null | undefined) => languageName(code, 'es').toLowerCase(),
    you: 'Vos',
    back: 'Volver',
    victory: '¡Victoria!',
    defeat: 'Derrota',
    draw: 'Empate',

    // BattleResult
    practiceDone: 'Práctica terminada',
    practiceSubtitle: 'Sin ELO: es para entrenar.',
    youForfeited: 'Abandonaste la partida.',
    opponentForfeited: (name: string | undefined) => `${name ?? 'Tu rival'} abandonó la partida.`,
    friendlySubtitle: 'Desafío amistoso: no mueve el ELO.',
    botPracticeSubtitle: 'Práctica contra un bot: no mueve el ELO.',
    calibrationSubtitle: (used: number, limit: number) =>
      `Calibración ${used} de ${limit} contra bots.`,
    newAchievements: 'Logros nuevos',
    achievementsUnlocked: (n: number): string =>
      n === 1 ? 'LOGRO DESBLOQUEADO' : 'LOGROS DESBLOQUEADOS',
    practiceAgain: 'Practicar otra vez',
    newChallenge: 'Nuevo desafío',
    playAgain: 'Jugar otra',
    lineA11y: (name: string, isBot: boolean, score: number, correct: number, answered: number) =>
      `${name}${isBot ? ' (bot)' : ''}: ${score} puntos, ${correct} de ${answered} correctas`,
    placedA11y: (rank: string, elo: number) => `Te posicionaste en ${rank} con ${elo} de ELO`,
    stillUnplaced: 'Seguís sin posicionar',
    placedOverline: '¡POSICIONADO!',
    unplacedOverline: 'SIN POSICIONAR',
    noRankYet: 'Todavía sin rango',
    placedHint: 'Ya estás en el ranking. Cada victoria te acerca al próximo rango.',
    unplacedHint: 'Ganá una partida para entrar al ranking en Bronce. Perder ahora no te resta.',
    eloChangeA11y: (before: number, after: number, delta: string) =>
      `ELO ${before} a ${after}, ${delta}`,

    // ResultHero
    nextOneIsYours: 'La próxima es tuya.',
    foxWin: 'El zorro de Polygo festejando',
    foxLoss: 'El zorro de Polygo, triste',
    eloBeforeAfterA11y: (before: number, after: number) =>
      `ELO anterior ${before}, ELO actual ${after}`,
    previousElo: 'ELO anterior',
    currentElo: 'ELO actual',
    placedIn: 'Te posicionaste en',
    promotedTo: 'Ascendiste a',
    demotedTo: 'Bajaste a',
    yourDivision: 'Tu división',
    topOfLadder: 'Estás en la cima del ranking.',
    eloToNext: (n: number, next: string) => `Faltan ${n} ELO para ${next}`,

    // BattleHud
    time: 'TIEMPO',
    secondsLeft: (s: number) => `Quedan ${s} segundos`,
    opponentDisconnected: (name: string, s: number) =>
      `${name} se desconectó. Si no vuelve en ${s} s, ganás por abandono.`,
    scoreA11y: (name: string, isBot: boolean, score: number) =>
      `${name}${isBot ? ' (bot)' : ''}: ${score} puntos`,

    // QuestionCard (consignas en mayúsculas según el idioma de la partida)
    listenAndChoose: 'ESCUCHÁ Y ELEGÍ QUÉ SIGNIFICA',
    howDoYouSay: (code: string) => `¿CÓMO SE DICE ${languageConfig(code).inName.toUpperCase()}?`,
    writeTheWord: (code: string) =>
      `ESCRIBÍ LA PALABRA ${languageConfig(code).inName.toUpperCase()}`,
    // La traducción está en el idioma de apoyo del curso: español, o inglés en el curso de español.
    chooseTranslation: (code: string) =>
      `ELEGÍ LA TRADUCCIÓN ${languageConfig(supportOf(code)).alName.toUpperCase()}`,
    chooseTheWord: (code: string) =>
      `ELEGÍ LA PALABRA ${languageConfig(code).inName.toUpperCase()}`,
    streakA11y: (streak: number, bonus: number) =>
      `Racha de ${streak} correctas: la próxima suma ${bonus} extra`,
    streakChip: (streak: number, bonus: number) => `🔥 Racha x${streak} · +${bonus}`,
    listenAgain: 'Escuchar otra vez',
    listenSlowly: 'Escuchar despacio',
    imageA11y: (prompt: string) => `Imagen: ${prompt}`,
    onStreak: (points: number) => `¡En racha! +${points}`,
    nice: (points: number) => `¡Bien! +${points}`,
    spelled: (text: string, points: number) => `Se escribe «${text}» · ${points}`,
    yourAnswer: 'Tu respuesta',
    submit: 'Responder',

    // Modos de juego (desafío a un amigo)
    wordRushDescription: 'Vocabulario cara a cara: el que más acierta gana.',
  },
  en: {
    rankedUnavailableTitle: 'Ranked isn’t available in this version',
    languageInSentence: (code: string | null | undefined) => languageName(code, 'en'),
    you: 'You',
    back: 'Back',
    victory: 'Victory!',
    defeat: 'Defeat',
    draw: 'Draw',

    practiceDone: 'Practice complete',
    practiceSubtitle: 'No ELO: this one is just training.',
    youForfeited: 'You left the match.',
    opponentForfeited: (name: string | undefined) => `${name ?? 'Your opponent'} left the match.`,
    friendlySubtitle: 'Friendly challenge: ELO doesn’t change.',
    botPracticeSubtitle: 'Practice against a bot: ELO doesn’t change.',
    calibrationSubtitle: (used: number, limit: number) =>
      `Calibration ${used} of ${limit} against bots.`,
    newAchievements: 'New achievements',
    achievementsUnlocked: (n: number) =>
      n === 1 ? 'ACHIEVEMENT UNLOCKED' : 'ACHIEVEMENTS UNLOCKED',
    practiceAgain: 'Practice again',
    newChallenge: 'New challenge',
    playAgain: 'Play again',
    lineA11y: (name: string, isBot: boolean, score: number, correct: number, answered: number) =>
      `${name}${isBot ? ' (bot)' : ''}: ${score} points, ${correct} of ${answered} correct`,
    placedA11y: (rank: string, elo: number) => `You placed in ${rank} with ${elo} ELO`,
    stillUnplaced: 'You’re still unranked',
    placedOverline: 'PLACED!',
    unplacedOverline: 'UNRANKED',
    noRankYet: 'No rank yet',
    placedHint: 'You’re on the ladder now. Every win gets you closer to the next rank.',
    unplacedHint: 'Win a match to join the ladder in Bronze. Losing now won’t cost you anything.',
    eloChangeA11y: (before: number, after: number, delta: string) =>
      `ELO ${before} to ${after}, ${delta}`,

    nextOneIsYours: 'You’ll get the next one.',
    foxWin: 'The Polygo fox celebrating',
    foxLoss: 'The Polygo fox, feeling sad',
    eloBeforeAfterA11y: (before: number, after: number) =>
      `Previous ELO ${before}, current ELO ${after}`,
    previousElo: 'Previous ELO',
    currentElo: 'Current ELO',
    placedIn: 'You placed in',
    promotedTo: 'Promoted to',
    demotedTo: 'Dropped to',
    yourDivision: 'Your division',
    topOfLadder: 'You’re at the top of the ladder.',
    eloToNext: (n: number, next: string) => `${n} ELO to ${next}`,

    time: 'TIME',
    secondsLeft: (s: number) => `${s} seconds left`,
    opponentDisconnected: (name: string, s: number) =>
      `${name} disconnected. If they’re not back in ${s} s, you win by forfeit.`,
    scoreA11y: (name: string, isBot: boolean, score: number) =>
      `${name}${isBot ? ' (bot)' : ''}: ${score} points`,

    listenAndChoose: 'LISTEN AND CHOOSE WHAT IT MEANS',
    howDoYouSay: (code: string) =>
      `HOW DO YOU SAY IT IN ${languageShortName(code, 'en').toUpperCase()}?`,
    writeTheWord: (code: string) =>
      `TYPE THE WORD IN ${languageShortName(code, 'en').toUpperCase()}`,
    chooseTranslation: (code: string) =>
      `CHOOSE THE ${languageShortName(supportOf(code), 'en').toUpperCase()} TRANSLATION`,
    chooseTheWord: (code: string) =>
      `CHOOSE THE WORD IN ${languageShortName(code, 'en').toUpperCase()}`,
    streakA11y: (streak: number, bonus: number) =>
      `${streak} correct in a row: the next one adds ${bonus} extra`,
    streakChip: (streak: number, bonus: number) => `🔥 Streak x${streak} · +${bonus}`,
    listenAgain: 'Listen again',
    listenSlowly: 'Listen slowly',
    imageA11y: (prompt: string) => `Image: ${prompt}`,
    onStreak: (points: number) => `On fire! +${points}`,
    nice: (points: number) => `Nice! +${points}`,
    spelled: (text: string, points: number) => `It’s spelled “${text}” · ${points}`,
    yourAnswer: 'Your answer',
    submit: 'Submit',

    wordRushDescription: 'Head-to-head vocabulary: whoever gets the most right wins.',
  },
});
