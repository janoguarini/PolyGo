import { languageConfig } from '@shared/languages';
import type { CancelReason, ErrorCode } from '@shared/protocol';

import { defineStrings } from '@/i18n';
import { languageName, languageShortName } from '@/i18n/languages';

type ErrorKey = ErrorCode | 'connection';

/** Idioma de las traducciones de un curso (shared/languages.ts `support`; sin el campo, español). */
const supportOf = (code: string) => languageConfig(code).support?.code ?? 'es';

/** Nombres de los idiomas en portugués e italiano (completo y corto), por código del curso. */
const PT_LANGUAGES: Record<string, { name: string; short: string }> = {
  en: { name: 'inglês', short: 'inglês' },
  it: { name: 'italiano', short: 'italiano' },
  pt: { name: 'português', short: 'português' },
  zh: { name: 'chinês (mandarim)', short: 'chinês' },
  fr: { name: 'francês', short: 'francês' },
  es: { name: 'espanhol', short: 'espanhol' },
};
const IT_LANGUAGES: Record<string, { name: string; short: string }> = {
  en: { name: 'inglese', short: 'inglese' },
  it: { name: 'italiano', short: 'italiano' },
  pt: { name: 'portoghese', short: 'portoghese' },
  zh: { name: 'cinese (mandarino)', short: 'cinese' },
  fr: { name: 'francese', short: 'francese' },
  es: { name: 'spagnolo', short: 'spagnolo' },
};
const mapLanguage = (
  map: Record<string, { name: string; short: string }>,
  code: string | null | undefined,
  short: boolean,
) => {
  const config = languageConfig(code);
  const entry = map[config.code];
  return entry ? (short ? entry.short : entry.name) : config.name;
};
const ptLanguage = (code: string | null | undefined, short = false) =>
  mapLanguage(PT_LANGUAGES, code, short);
const itLanguage = (code: string | null | undefined, short = false) =>
  mapLanguage(IT_LANGUAGES, code, short);

/** Mensajes de error de las partidas, por código estable del protocolo (no se tocan los códigos). */
export const battleErrorStrings = defineStrings<Record<ErrorKey, string>>({
  es: {
    connection: 'No pudimos conectar con el servidor de partidas. Revisa tu conexión.',
    unauthorized: 'Tu sesión expiró. Vuelve a iniciar sesión.',
    protocol_mismatch: 'Hay una versión nueva de PolyGo. Actualiza la app para jugar.',
    onboarding_required: 'Completa tu perfil antes de jugar.',
    language_unavailable: 'Ranked todavía no está disponible para tu idioma.',
    already_in_battle: 'Ya estás en una partida.',
    not_in_battle: 'La partida ya no existe.',
    stale_question: 'Esa pregunta ya pasó.',
    battle_over: 'La partida terminó.',
    invalid_payload: 'Algo salió mal con esa respuesta.',
    server_error: 'El servidor de partidas tuvo un problema. Inténtalo de nuevo.',
    match_rate_limited: 'Jugaste muchas partidas hoy. Vuelve mañana para seguir subiendo.',
    challenge_not_found: 'No encontramos ese código. Revisa que esté bien escrito.',
    challenge_expired: 'Ese desafío venció o se canceló. Pídele a tu amigo uno nuevo.',
    challenge_taken: 'Alguien más ya entró a ese desafío.',
    own_challenge: 'Ese es tu propio desafío: compártelo con un amigo.',
    host_gone: 'Tu amigo ya no está esperando. Pídele que vuelva a abrir el desafío.',
    language_mismatch: 'Tu amigo está aprendiendo otro idioma, así que no pueden jugar juntos.',
    challenge_declined: 'Tu amigo no puede jugar ahora. Inténtalo más tarde.',
    not_friends: 'Sólo puedes invitar a jugadores de tu lista de amigos.',
  },
  en: {
    connection: 'We couldn’t reach the match server. Check your connection.',
    unauthorized: 'Your session expired. Please sign in again.',
    protocol_mismatch: 'A new version of PolyGo is out. Update the app to play.',
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
  'pt-BR': {
    connection: 'Não conseguimos conectar ao servidor de partidas. Verifique sua conexão.',
    unauthorized: 'Sua sessão expirou. Entre de novo.',
    protocol_mismatch: 'Tem uma versão nova do PolyGo. Atualize o app para jogar.',
    onboarding_required: 'Complete seu perfil antes de jogar.',
    language_unavailable: 'O Ranked ainda não está disponível para o seu idioma.',
    already_in_battle: 'Você já está em uma partida.',
    not_in_battle: 'Essa partida não existe mais.',
    stale_question: 'Essa pergunta já passou.',
    battle_over: 'A partida terminou.',
    invalid_payload: 'Algo deu errado com essa resposta.',
    server_error: 'O servidor de partidas teve um problema. Tente de novo.',
    match_rate_limited: 'Você jogou muitas partidas hoje. Volte amanhã para continuar subindo.',
    challenge_not_found: 'Não encontramos esse código. Confira se está escrito certo.',
    challenge_expired: 'Esse desafio expirou ou foi cancelado. Peça um novo ao seu amigo.',
    challenge_taken: 'Outra pessoa já entrou nesse desafio.',
    own_challenge: 'Esse é o seu próprio desafio: compartilhe com um amigo.',
    host_gone: 'Seu amigo não está mais esperando. Peça para ele abrir o desafio de novo.',
    language_mismatch:
      'Seu amigo está aprendendo outro idioma, então vocês não podem jogar juntos.',
    challenge_declined: 'Seu amigo não pode jogar agora. Tente mais tarde.',
    not_friends: 'Você só pode convidar jogadores da sua lista de amigos.',
  },
  it: {
    connection:
      'Non siamo riusciti a collegarci al server delle partite. Controlla la connessione.',
    unauthorized: 'La sessione è scaduta. Accedi di nuovo.',
    protocol_mismatch: 'È uscita una nuova versione di PolyGo. Aggiorna l’app per giocare.',
    onboarding_required: 'Completa il tuo profilo prima di giocare.',
    language_unavailable: 'Ranked non è ancora disponibile per la tua lingua.',
    already_in_battle: 'Sei già in una partita.',
    not_in_battle: 'Questa partita non esiste più.',
    stale_question: 'Quella domanda è già passata.',
    battle_over: 'La partita è finita.',
    invalid_payload: 'Qualcosa è andato storto con quella risposta.',
    server_error: 'Il server delle partite ha avuto un problema. Riprova.',
    match_rate_limited: 'Oggi hai giocato tante partite. Torna domani per continuare a salire.',
    challenge_not_found: 'Non abbiamo trovato quel codice. Controlla di averlo scritto bene.',
    challenge_expired:
      'Quella sfida è scaduta o è stata annullata. Chiedine una nuova al tuo amico.',
    challenge_taken: 'Qualcun altro è già entrato in quella sfida.',
    own_challenge: 'Questa è la tua sfida: condividila con un amico.',
    host_gone: 'Il tuo amico non ti sta più aspettando. Chiedigli di riaprire la sfida.',
    language_mismatch:
      'Il tuo amico sta imparando un’altra lingua, quindi non potete giocare insieme.',
    challenge_declined: 'Il tuo amico non può giocare ora. Riprova più tardi.',
    not_friends: 'Puoi invitare solo giocatori della tua lista di amici.',
  },
  fr: {
    connection: 'Impossible de joindre le serveur de matchs. Vérifie ta connexion.',
    unauthorized: 'Ta session a expiré. Reconnecte-toi.',
    protocol_mismatch: 'Une nouvelle version de PolyGo est sortie. Mets l’app à jour pour jouer.',
    onboarding_required: 'Termine ton profil avant de jouer.',
    language_unavailable: 'Ranked n’est pas encore disponible pour ta langue.',
    already_in_battle: 'Tu es déjà dans un match.',
    not_in_battle: 'Ce match n’existe plus.',
    stale_question: 'Cette question est déjà passée.',
    battle_over: 'Le match est terminé.',
    invalid_payload: 'Un problème est survenu avec cette réponse.',
    server_error: 'Le serveur de matchs a eu un problème. Réessaie.',
    match_rate_limited:
      'Tu as joué beaucoup de matchs aujourd’hui. Reviens demain pour continuer à grimper.',
    challenge_not_found: 'Code introuvable. Vérifie qu’il est bien écrit.',
    challenge_expired: 'Ce défi a expiré ou a été annulé. Demande-en un nouveau à ton ami.',
    challenge_taken: 'Quelqu’un d’autre a déjà rejoint ce défi.',
    own_challenge: 'C’est ton propre défi : partage-le avec un ami.',
    host_gone: 'Ton ami ne t’attend plus. Demande-lui de rouvrir le défi.',
    language_mismatch: 'Ton ami apprend une autre langue, vous ne pouvez donc pas jouer ensemble.',
    challenge_declined: 'Ton ami ne peut pas jouer pour l’instant. Réessaie plus tard.',
    not_friends: 'Tu ne peux inviter que des joueurs de ta liste d’amis.',
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
  'pt-BR': {
    ready_timeout: 'Um de vocês não confirmou a tempo. O ELO não mudou.',
    opponent_left: 'Seu rival saiu antes de começar. O ELO não mudou.',
    server_error: 'O servidor não conseguiu iniciar a partida. O ELO não mudou.',
    settlement_failed: 'Não conseguimos salvar o resultado, então a partida foi anulada sem ELO.',
  },
  it: {
    ready_timeout: 'Uno dei due non ha confermato in tempo. L’ELO non è cambiato.',
    opponent_left: 'Il tuo avversario è uscito prima dell’inizio. L’ELO non è cambiato.',
    server_error: 'Il server non è riuscito ad avviare la partita. L’ELO non è cambiato.',
    settlement_failed:
      'Non siamo riusciti a salvare il risultato, quindi la partita è stata annullata senza ELO.',
  },
  fr: {
    ready_timeout: 'L’un de vous n’a pas confirmé à temps. L’ELO n’a pas bougé.',
    opponent_left: 'Ton adversaire est parti avant le début. L’ELO n’a pas bougé.',
    server_error: 'Le serveur n’a pas pu lancer le match. L’ELO n’a pas bougé.',
    settlement_failed: 'Impossible d’enregistrer le résultat : le match a été annulé sans ELO.',
  },
});

/** Textos de los componentes de src/features/battle y de la disponibilidad de Ranked. */
export const battleStrings = defineStrings({
  es: {
    rankedUnavailableTitle: 'Ranked no está disponible en esta versión',
    /** Nombre del idioma dentro de una frase: «italiano». */
    languageInSentence: (code: string | null | undefined) => languageName(code, 'es').toLowerCase(),
    you: 'Tú',
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
    unratedSubtitle: 'Partida sin ELO: tu ELO no cambió.',
    calibrationSubtitle: (used: number, limit: number) => `Calibración ${used} de ${limit}.`,
    newAchievements: 'Logros nuevos',
    achievementsUnlocked: (n: number): string =>
      n === 1 ? 'LOGRO DESBLOQUEADO' : 'LOGROS DESBLOQUEADOS',
    practiceAgain: 'Practicar otra vez',
    newChallenge: 'Nuevo desafío',
    playAgain: 'Jugar otra',
    lineA11y: (name: string, score: number, correct: number, answered: number) =>
      `${name}: ${score} puntos, ${correct} de ${answered} correctas`,
    placedA11y: (rank: string, elo: number) => `Te posicionaste en ${rank} con ${elo} de ELO`,
    stillUnplaced: 'Sigues sin posicionar',
    placedOverline: '¡POSICIONADO!',
    unplacedOverline: 'SIN POSICIONAR',
    noRankYet: 'Todavía sin rango',
    placedHint: 'Ya estás en el ranking. Cada victoria te acerca al próximo rango.',
    unplacedHint: 'Gana una partida para entrar al ranking en Bronce. Perder ahora no te resta.',
    eloChangeA11y: (before: number, after: number, delta: string) =>
      `ELO ${before} a ${after}, ${delta}`,

    // ResultHero
    nextOneIsYours: 'La próxima es tuya.',
    foxWin: 'El zorro de PolyGo festejando',
    foxLoss: 'El zorro de PolyGo, triste',
    eloBeforeAfterA11y: (before: number, after: number) =>
      `ELO anterior ${before}, ELO actual ${after}`,
    previousElo: 'ELO anterior',
    currentElo: 'ELO actual',
    placedIn: 'Te posicionaste en',
    promotedTo: 'Ascendiste a',
    demotedTo: 'Bajaste a',

    // RankUpCelebration
    rankUpDivision: '¡ASCENDISTE!',
    rankUpTier: '¡NUEVO RANGO!',
    rankUpPlaced: '¡ENTRASTE AL RANKING!',
    rankUpFrom: (from: string) => `Dejaste atrás ${from}`,
    rankUpContinue: '¡Vamos!',
    rankUpA11y: (rank: string) => `¡Ascendiste a ${rank}!`,
    yourDivision: 'Tu división',
    topOfLadder: 'Estás en la cima del ranking.',
    eloToNext: (n: number, next: string) => `Faltan ${n} ELO para ${next}`,

    // BattleHud
    time: 'TIEMPO',
    secondsLeft: (s: number) => `Quedan ${s} segundos`,
    opponentDisconnected: (name: string, s: number) =>
      `${name} se desconectó. Si no vuelve en ${s} s, ganas por abandono.`,
    scoreA11y: (name: string, score: number) => `${name}: ${score} puntos`,

    // QuestionCard (consignas en mayúsculas según el idioma de la partida)
    listenAndChoose: 'ESCUCHA Y ELIGE QUÉ SIGNIFICA',
    howDoYouSay: (code: string) => `¿CÓMO SE DICE ${languageConfig(code).inName.toUpperCase()}?`,
    writeTheWord: (code: string) =>
      `ESCRIBE LA PALABRA ${languageConfig(code).inName.toUpperCase()}`,
    // La traducción está en el idioma de apoyo del curso: español, o inglés en el curso de español.
    chooseTranslation: (code: string) =>
      `ELIGE LA TRADUCCIÓN ${languageConfig(supportOf(code)).alName.toUpperCase()}`,
    chooseTheWord: (code: string) =>
      `ELIGE LA PALABRA ${languageConfig(code).inName.toUpperCase()}`,
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
    wordRushDescription: 'La misma partida que Ranked: los microjuegos cara a cara, sin ELO.',
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
    unratedSubtitle: 'No-ELO match: your ELO didn’t change.',
    calibrationSubtitle: (used: number, limit: number) => `Calibration ${used} of ${limit}.`,
    newAchievements: 'New achievements',
    achievementsUnlocked: (n: number) =>
      n === 1 ? 'ACHIEVEMENT UNLOCKED' : 'ACHIEVEMENTS UNLOCKED',
    practiceAgain: 'Practice again',
    newChallenge: 'New challenge',
    playAgain: 'Play again',
    lineA11y: (name: string, score: number, correct: number, answered: number) =>
      `${name}: ${score} points, ${correct} of ${answered} correct`,
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
    foxWin: 'The PolyGo fox celebrating',
    foxLoss: 'The PolyGo fox, feeling sad',
    eloBeforeAfterA11y: (before: number, after: number) =>
      `Previous ELO ${before}, current ELO ${after}`,
    previousElo: 'Previous ELO',
    currentElo: 'Current ELO',
    placedIn: 'You placed in',
    promotedTo: 'Promoted to',
    demotedTo: 'Dropped to',

    rankUpDivision: 'RANK UP!',
    rankUpTier: 'NEW RANK!',
    rankUpPlaced: 'YOU’RE ON THE LADDER!',
    rankUpFrom: (from: string) => `You left ${from} behind`,
    rankUpContinue: 'Let’s go!',
    rankUpA11y: (rank: string) => `You reached ${rank}!`,
    yourDivision: 'Your division',
    topOfLadder: 'You’re at the top of the ladder.',
    eloToNext: (n: number, next: string) => `${n} ELO to ${next}`,

    time: 'TIME',
    secondsLeft: (s: number) => `${s} seconds left`,
    opponentDisconnected: (name: string, s: number) =>
      `${name} disconnected. If they’re not back in ${s} s, you win by forfeit.`,
    scoreA11y: (name: string, score: number) => `${name}: ${score} points`,

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

    wordRushDescription: 'The same match as Ranked: head-to-head mini-games, no ELO.',
  },
  'pt-BR': {
    rankedUnavailableTitle: 'O Ranked não está disponível nesta versão',
    languageInSentence: (code: string | null | undefined) => ptLanguage(code),
    you: 'Você',
    back: 'Voltar',
    victory: 'Vitória!',
    defeat: 'Derrota',
    draw: 'Empate',

    practiceDone: 'Treino concluído',
    practiceSubtitle: 'Sem ELO: é só para treinar.',
    youForfeited: 'Você abandonou a partida.',
    opponentForfeited: (name: string | undefined) => `${name ?? 'Seu rival'} abandonou a partida.`,
    friendlySubtitle: 'Desafio amistoso: não mexe no ELO.',
    unratedSubtitle: 'Partida sem ELO: seu ELO não mudou.',
    calibrationSubtitle: (used: number, limit: number) => `Calibração ${used} de ${limit}.`,
    newAchievements: 'Novas conquistas',
    achievementsUnlocked: (n: number): string =>
      n === 1 ? 'CONQUISTA DESBLOQUEADA' : 'CONQUISTAS DESBLOQUEADAS',
    practiceAgain: 'Treinar de novo',
    newChallenge: 'Novo desafio',
    playAgain: 'Jogar outra',
    lineA11y: (name: string, score: number, correct: number, answered: number) =>
      `${name}: ${score} pontos, ${correct} de ${answered} corretas`,
    placedA11y: (rank: string, elo: number) => `Você se classificou em ${rank} com ${elo} ELO`,
    stillUnplaced: 'Você continua sem classificação',
    placedOverline: 'CLASSIFICADO!',
    unplacedOverline: 'SEM CLASSIFICAÇÃO',
    noRankYet: 'Ainda sem rank',
    placedHint: 'Você já está no ranking. Cada vitória deixa você mais perto do próximo rank.',
    unplacedHint:
      'Vença uma partida para entrar no ranking, começando no Bronze. Perder agora não tira nada de você.',
    eloChangeA11y: (before: number, after: number, delta: string) =>
      `ELO de ${before} para ${after}, ${delta}`,

    nextOneIsYours: 'A próxima é sua.',
    foxWin: 'A raposa do PolyGo comemorando',
    foxLoss: 'A raposa do PolyGo, triste',
    eloBeforeAfterA11y: (before: number, after: number) =>
      `ELO anterior ${before}, ELO atual ${after}`,
    previousElo: 'ELO anterior',
    currentElo: 'ELO atual',
    placedIn: 'Você se classificou em',
    promotedTo: 'Você subiu para',
    demotedTo: 'Você caiu para',

    rankUpDivision: 'VOCÊ SUBIU!',
    rankUpTier: 'NOVO RANK!',
    rankUpPlaced: 'VOCÊ ENTROU NO RANKING!',
    rankUpFrom: (from: string) => `Você deixou ${from} para trás`,
    rankUpContinue: 'Bora!',
    rankUpA11y: (rank: string) => `Você subiu para ${rank}!`,
    yourDivision: 'Sua divisão',
    topOfLadder: 'Você está no topo do ranking.',
    eloToNext: (n: number, next: string) => `${n === 1 ? 'Falta' : 'Faltam'} ${n} ELO para ${next}`,

    time: 'TEMPO',
    secondsLeft: (s: number) => `Faltam ${s} segundos`,
    opponentDisconnected: (name: string, s: number) =>
      `${name} se desconectou. Se não voltar em ${s} s, você vence por abandono.`,
    scoreA11y: (name: string, score: number) => `${name}: ${score} pontos`,

    listenAndChoose: 'OUÇA E ESCOLHA O QUE SIGNIFICA',
    howDoYouSay: (code: string) => `COMO SE DIZ EM ${ptLanguage(code, true).toUpperCase()}?`,
    writeTheWord: (code: string) => `ESCREVA A PALAVRA EM ${ptLanguage(code, true).toUpperCase()}`,
    chooseTranslation: (code: string) =>
      `ESCOLHA A TRADUÇÃO EM ${ptLanguage(supportOf(code), true).toUpperCase()}`,
    chooseTheWord: (code: string) => `ESCOLHA A PALAVRA EM ${ptLanguage(code, true).toUpperCase()}`,
    streakA11y: (streak: number, bonus: number) =>
      `Sequência de ${streak} acertos: a próxima vale ${bonus} a mais`,
    streakChip: (streak: number, bonus: number) => `🔥 Sequência x${streak} · +${bonus}`,
    listenAgain: 'Ouvir de novo',
    listenSlowly: 'Ouvir devagar',
    imageA11y: (prompt: string) => `Imagem: ${prompt}`,
    onStreak: (points: number) => `Pegando fogo! +${points}`,
    nice: (points: number) => `Boa! +${points}`,
    spelled: (text: string, points: number) => `Escreve-se “${text}” · ${points}`,
    yourAnswer: 'Sua resposta',
    submit: 'Responder',

    wordRushDescription: 'A mesma partida do Ranked: os minijogos cara a cara, sem ELO.',
  },
  it: {
    rankedUnavailableTitle: 'Ranked non è disponibile in questa versione',
    languageInSentence: (code: string | null | undefined) => itLanguage(code),
    you: 'Tu',
    back: 'Indietro',
    victory: 'Vittoria!',
    defeat: 'Sconfitta',
    draw: 'Pareggio',

    practiceDone: 'Allenamento completato',
    practiceSubtitle: 'Niente ELO: serve solo per allenarti.',
    youForfeited: 'Hai abbandonato la partita.',
    opponentForfeited: (name: string | undefined) =>
      `${name ?? 'Il tuo avversario'} ha abbandonato la partita.`,
    friendlySubtitle: 'Sfida amichevole: l’ELO non cambia.',
    unratedSubtitle: 'Partita senza ELO: il tuo ELO non è cambiato.',
    calibrationSubtitle: (used: number, limit: number) => `Calibrazione ${used} di ${limit}.`,
    newAchievements: 'Nuovi traguardi',
    achievementsUnlocked: (n: number): string =>
      n === 1 ? 'TRAGUARDO SBLOCCATO' : 'TRAGUARDI SBLOCCATI',
    practiceAgain: 'Allenati di nuovo',
    newChallenge: 'Nuova sfida',
    playAgain: 'Gioca ancora',
    lineA11y: (name: string, score: number, correct: number, answered: number) =>
      `${name}: ${score} punti, ${correct} corrette su ${answered}`,
    placedA11y: (rank: string, elo: number) => `Ora sei in ${rank} con ${elo} ELO`,
    stillUnplaced: 'Sei ancora non classificato',
    placedOverline: 'CLASSIFICATO!',
    unplacedOverline: 'NON CLASSIFICATO',
    noRankYet: 'Ancora senza rango',
    placedHint: 'Ora sei in classifica. Ogni vittoria ti avvicina al prossimo rango.',
    unplacedHint:
      'Vinci una partita per entrare in classifica nel Bronzo. Perdere ora non ti toglie nulla.',
    eloChangeA11y: (before: number, after: number, delta: string) =>
      `ELO da ${before} a ${after}, ${delta}`,

    nextOneIsYours: 'La prossima è tua.',
    foxWin: 'La volpe di PolyGo che festeggia',
    foxLoss: 'La volpe di PolyGo, triste',
    eloBeforeAfterA11y: (before: number, after: number) =>
      `ELO precedente ${before}, ELO attuale ${after}`,
    previousElo: 'ELO precedente',
    currentElo: 'ELO attuale',
    placedIn: 'Sei stato classificato in',
    promotedTo: 'Sei salito a',
    demotedTo: 'Sei sceso a',

    rankUpDivision: 'SEI SALITO!',
    rankUpTier: 'NUOVO RANGO!',
    rankUpPlaced: 'SEI ENTRATO IN CLASSIFICA!',
    rankUpFrom: (from: string) => `Ti sei lasciato alle spalle ${from}`,
    rankUpContinue: 'Andiamo!',
    rankUpA11y: (rank: string) => `Sei salito a ${rank}!`,
    yourDivision: 'La tua divisione',
    topOfLadder: 'Sei in cima alla classifica.',
    eloToNext: (n: number, next: string) => `${n === 1 ? 'Manca' : 'Mancano'} ${n} ELO per ${next}`,

    time: 'TEMPO',
    secondsLeft: (s: number) => `Mancano ${s} secondi`,
    opponentDisconnected: (name: string, s: number) =>
      `${name} si è disconnesso. Se non torna entro ${s} s, vinci per abbandono.`,
    scoreA11y: (name: string, score: number) => `${name}: ${score} punti`,

    listenAndChoose: 'ASCOLTA E SCEGLI COSA SIGNIFICA',
    howDoYouSay: (code: string) => `COME SI DICE IN ${itLanguage(code, true).toUpperCase()}?`,
    writeTheWord: (code: string) => `SCRIVI LA PAROLA IN ${itLanguage(code, true).toUpperCase()}`,
    chooseTranslation: (code: string) =>
      `SCEGLI LA TRADUZIONE IN ${itLanguage(supportOf(code), true).toUpperCase()}`,
    chooseTheWord: (code: string) => `SCEGLI LA PAROLA IN ${itLanguage(code, true).toUpperCase()}`,
    streakA11y: (streak: number, bonus: number) =>
      `Serie di ${streak} risposte giuste: la prossima vale ${bonus} in più`,
    streakChip: (streak: number, bonus: number) => `🔥 Serie x${streak} · +${bonus}`,
    listenAgain: 'Ascolta di nuovo',
    listenSlowly: 'Ascolta lentamente',
    imageA11y: (prompt: string) => `Immagine: ${prompt}`,
    onStreak: (points: number) => `Che serie! +${points}`,
    nice: (points: number) => `Bene! +${points}`,
    spelled: (text: string, points: number) => `Si scrive «${text}» · ${points}`,
    yourAnswer: 'La tua risposta',
    submit: 'Rispondi',

    wordRushDescription: 'La stessa partita di Ranked: i minigiochi faccia a faccia, senza ELO.',
  },
  fr: {
    rankedUnavailableTitle: 'Ranked n’est pas disponible dans cette version',
    languageInSentence: (code: string | null | undefined) => languageName(code, 'fr').toLowerCase(),
    you: 'Toi',
    back: 'Retour',
    victory: 'Victoire !',
    defeat: 'Défaite',
    draw: 'Égalité',

    practiceDone: 'Entraînement terminé',
    practiceSubtitle: 'Sans ELO : c’est juste pour t’entraîner.',
    youForfeited: 'Tu as abandonné le match.',
    opponentForfeited: (name: string | undefined) =>
      `${name ?? 'Ton adversaire'} a abandonné le match.`,
    friendlySubtitle: 'Match amical : l’ELO ne bouge pas.',
    unratedSubtitle: 'Match sans ELO : ton ELO n’a pas changé.',
    calibrationSubtitle: (used: number, limit: number) => `Calibrage ${used} sur ${limit}.`,
    newAchievements: 'Nouveaux succès',
    achievementsUnlocked: (n: number): string => (n === 1 ? 'SUCCÈS DÉBLOQUÉ' : 'SUCCÈS DÉBLOQUÉS'),
    practiceAgain: 'S’entraîner encore',
    newChallenge: 'Nouveau défi',
    playAgain: 'Rejouer',
    lineA11y: (name: string, score: number, correct: number, answered: number) =>
      `${name} : ${score} points, ${correct} bonnes réponses sur ${answered}`,
    placedA11y: (rank: string, elo: number) => `Tu es classé ${rank} avec ${elo} d’ELO`,
    stillUnplaced: 'Tu n’es toujours pas classé',
    placedOverline: 'CLASSÉ !',
    unplacedOverline: 'NON CLASSÉ',
    noRankYet: 'Pas encore de rang',
    placedHint: 'Te voilà dans le classement. Chaque victoire te rapproche du rang suivant.',
    unplacedHint:
      'Gagne un match pour entrer dans le classement en Bronze. Perdre maintenant ne te coûte rien.',
    eloChangeA11y: (before: number, after: number, delta: string) =>
      `ELO de ${before} à ${after}, ${delta}`,

    nextOneIsYours: 'La prochaine est pour toi.',
    foxWin: 'Le renard de PolyGo fait la fête',
    foxLoss: 'Le renard de PolyGo, tout triste',
    eloBeforeAfterA11y: (before: number, after: number) =>
      `ELO précédent ${before}, ELO actuel ${after}`,
    previousElo: 'ELO précédent',
    currentElo: 'ELO actuel',
    placedIn: 'Tu es classé',
    promotedTo: 'Tu montes en',
    demotedTo: 'Tu descends en',

    rankUpDivision: 'TU MONTES !',
    rankUpTier: 'NOUVEAU RANG !',
    rankUpPlaced: 'TU ENTRES DANS LE CLASSEMENT !',
    rankUpFrom: (from: string) => `Tu laisses ${from} derrière toi`,
    rankUpContinue: 'C’est parti !',
    rankUpA11y: (rank: string) => `Tu passes ${rank} !`,
    yourDivision: 'Ta division',
    topOfLadder: 'Tu es au sommet du classement.',
    eloToNext: (n: number, next: string) => `Encore ${n} ELO pour ${next}`,

    time: 'TEMPS',
    secondsLeft: (s: number) => `${s} secondes restantes`,
    opponentDisconnected: (name: string, s: number) =>
      `${name} s’est déconnecté. S’il ne revient pas d’ici ${s} s, tu gagnes par abandon.`,
    scoreA11y: (name: string, score: number) => `${name} : ${score} points`,

    listenAndChoose: 'ÉCOUTE ET CHOISIS CE QUE ÇA VEUT DIRE',
    howDoYouSay: (code: string) =>
      `COMMENT ON DIT EN ${languageShortName(code, 'fr').toUpperCase()} ?`,
    writeTheWord: (code: string) =>
      `ÉCRIS LE MOT EN ${languageShortName(code, 'fr').toUpperCase()}`,
    chooseTranslation: (code: string) =>
      `CHOISIS LA TRADUCTION EN ${languageShortName(supportOf(code), 'fr').toUpperCase()}`,
    chooseTheWord: (code: string) =>
      `CHOISIS LE MOT EN ${languageShortName(code, 'fr').toUpperCase()}`,
    streakA11y: (streak: number, bonus: number) =>
      `Série de ${streak} bonnes réponses : la prochaine rapporte ${bonus} de plus`,
    streakChip: (streak: number, bonus: number) => `🔥 Série x${streak} · +${bonus}`,
    listenAgain: 'Réécouter',
    listenSlowly: 'Écouter lentement',
    imageA11y: (prompt: string) => `Image : ${prompt}`,
    onStreak: (points: number) => `En feu ! +${points}`,
    nice: (points: number) => `Bien joué ! +${points}`,
    spelled: (text: string, points: number) => `Ça s’écrit « ${text} » · ${points}`,
    yourAnswer: 'Ta réponse',
    submit: 'Valider',

    wordRushDescription: 'Le même match que Ranked : des mini-jeux en face-à-face, sans ELO.',
  },
});
