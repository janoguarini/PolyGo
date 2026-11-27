import { languageConfig } from '@shared/languages';

import { defineStrings } from '..';
import { languageName } from '../languages';

/** Nombres de los idiomas en portugués e italiano, por código del curso. */
const PT_LANGUAGE_NAMES: Record<string, string> = {
  en: 'inglês',
  it: 'italiano',
  pt: 'português',
  zh: 'chinês (mandarim)',
  fr: 'francês',
  es: 'espanhol',
};
const IT_LANGUAGE_NAMES: Record<string, string> = {
  en: 'inglese',
  it: 'italiano',
  pt: 'portoghese',
  zh: 'cinese (mandarino)',
  fr: 'francese',
  es: 'spagnolo',
};
const ptLanguage = (code: string | null | undefined) => {
  const config = languageConfig(code);
  return PT_LANGUAGE_NAMES[config.code] ?? config.name;
};
const itLanguage = (code: string | null | undefined) => {
  const config = languageConfig(code);
  return IT_LANGUAGE_NAMES[config.code] ?? config.name;
};

/** Pantalla de partida (src/app/battle.tsx). */
export const battleScreenStrings = defineStrings({
  es: {
    noMatchesIn: (code: string | null | undefined) =>
      `Todavía no hay partidas en ${languageName(code, 'es').toLowerCase()}`,
    noMatchesBody:
      'Las partidas se habilitan cuando el nivel A1 de este idioma esté completo. Para jugar, cambia a otro idioma desde tu perfil.',
    back: 'Volver',
    serverMissingDev:
      'Falta o es inválida EXPO_PUBLIC_BATTLE_SERVER_URL (en desarrollo puede ser http). Los desafíos con amigos siguen funcionando.',
    serverMissing:
      'No pudimos conectar esta versión de PolyGo con el servidor de partidas. Puedes seguir desafiando a tus amigos.',
    leaveTitle: '¿Abandonar la partida?',
    leaveFriendly: 'Abandonar cuenta como derrota en el desafío (no mueve el ELO).',
    leaveRanked: 'Abandonar cuenta como derrota y te baja el ELO.',
    keepPlaying: 'Seguir jugando',
    forfeit: 'Abandonar',
    exit: 'Salir',
    forfeitHint: 'Abandonar cuenta como derrota',
    exitHint: 'Vuelve a la pantalla anterior',
    labelFriendly: 'DESAFÍO · SIN ELO',
    labelPractice: 'WORD RUSH · PRÁCTICA',
    labelUnrated: 'WORD RUSH · SIN ELO',
    labelCalibration: (used: number, limit: number) => `RANKED · CALIBRACIÓN ${used}/${limit}`,
    labelRanked: 'RANKED · WORD RUSH',
    noteUnrated: 'Partida sin ELO: ganes o pierdas, tu ELO no cambia.',
    noteCalibration: (used: number, limit: number) =>
      `Partida de calibración ${used} de ${limit}: mueve tu ELO.`,
    noteCompetitive: 'Partida clasificatoria: mueve tu ELO.',
    preparing: 'Preparando la partida…',
    declinedTitle: (name: string | undefined) =>
      name ? `@${name} no puede ahora` : 'Tu amigo no puede ahora',
    challengeFailedTitle: 'No se pudo entrar al desafío',
    createOwnChallenge: 'Crear mi propio desafío',
    searching: 'Buscando rival…',
    waitingA11y: (mm: number, ss: string) => `Esperando ${mm} minutos ${ss} segundos`,
    searchingSub: (language: string | null) =>
      language ? `Buscando a alguien de tu nivel en ${language}` : 'Buscando a alguien de tu nivel',
    cancelSearch: 'Cancelar búsqueda',
    opponentFound: '¡Rival encontrado!',
    you: 'Tú',
    rules:
      '75 segundos, las mismas preguntas para los dos. Correcta +100 (+50 por rapidez), incorrecta −50. Encadena aciertos: la racha suma hasta +30.',
    waitingOpponent: 'Esperando a tu rival…',
    ready: '¡Listo!',
    confirmIn: (s: number) => `Confirma en ${s} s o la partida se cancela.`,
    go: '¡Ya!',
    timeUp: '¡Tiempo! Calculando el resultado…',
    allAnswered: 'Respondiste todas. Esperando el final…',
    cancelledTitle: 'Partida cancelada',
    missedEndTitle: 'Te perdiste el final',
    missedEndBody:
      'La partida terminó mientras estabas desconectado. Mira el resultado en tu historial.',
    newChallenge: 'Nuevo desafío',
    practiceAgain: 'Practicar de nuevo',
    findAnother: 'Buscar otra partida',
    shareMessage: (code: string, language: string, link: string) =>
      `¡Te desafío en PolyGo! 60 segundos de duelo ${languageConfig(language).inName}, tú contra mí. Entra con el código ${code} (Ranked → Tengo un código) o toca: ${link}`,
    waitingFor: (name: string) => `Esperando a @${name}`,
    inviteSent: 'Le llegó tu invitación en la app. Cuando la acepte, la partida empieza sola.',
    inviteNote:
      'Amistoso: no mueve el ELO. Deja esta pantalla abierta: si la cierras, la invitación se cancela.',
    cancelInvite: 'Cancelar invitación',
    challengeCreated: 'Desafío creado',
    passCode: 'Pásale este código a tu amigo. Cuando entre, la partida empieza sola.',
    codeA11y: (spelled: string) => `Código ${spelled}`,
    shareChallenge: 'Compartir desafío',
    codeNote:
      'Amistoso: no mueve el ELO. Deja esta pantalla abierta mientras esperas; el código vence en 15 minutos.',
    cancelChallenge: 'Cancelar desafío',
    playerA11y: (name: string, elo: string | null) =>
      `${name}, ${elo !== null ? `${elo} ELO` : 'sin posicionar'}`,
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
    labelPractice: 'WORD RUSH · PRACTICE',
    labelUnrated: 'WORD RUSH · NO ELO',
    labelCalibration: (used: number, limit: number) => `RANKED · CALIBRATION ${used}/${limit}`,
    labelRanked: 'RANKED · WORD RUSH',
    noteUnrated: 'No-ELO match: win or lose, your ELO stays the same.',
    noteCalibration: (used: number, limit: number) =>
      `Calibration match ${used} of ${limit}: it changes your ELO.`,
    noteCompetitive: 'Ranked match: it changes your ELO.',
    preparing: 'Getting the match ready…',
    declinedTitle: (name: string | undefined) =>
      name ? `@${name} can’t play right now` : 'Your friend can’t play right now',
    challengeFailedTitle: 'Couldn’t join the challenge',
    createOwnChallenge: 'Create my own challenge',
    searching: 'Looking for an opponent…',
    waitingA11y: (mm: number, ss: string) => `Waiting ${mm} minutes ${ss} seconds`,
    searchingSub: (language: string | null) =>
      language
        ? `Looking for someone at your level in ${language}`
        : 'Looking for someone at your level',
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
      `I challenge you on PolyGo! A 60-second ${languageName(language, 'en')} duel, you vs. me. Join with the code ${code} (Ranked → I have a code) or tap: ${link}`,
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
    playerA11y: (name: string, elo: string | null) =>
      `${name}, ${elo !== null ? `${elo} ELO` : 'unranked'}`,
  },
  'pt-BR': {
    noMatchesIn: (code: string | null | undefined) =>
      `Ainda não há partidas em ${ptLanguage(code)}`,
    noMatchesBody:
      'As partidas são liberadas quando o nível A1 deste idioma estiver completo. Para jogar, mude para outro idioma no seu perfil.',
    back: 'Voltar',
    serverMissingDev:
      'EXPO_PUBLIC_BATTLE_SERVER_URL está faltando ou é inválida (em desenvolvimento pode ser http). Os desafios com amigos continuam funcionando.',
    serverMissing:
      'Não conseguimos conectar esta versão do PolyGo ao servidor de partidas. Você ainda pode desafiar seus amigos.',
    leaveTitle: 'Abandonar a partida?',
    leaveFriendly: 'Abandonar conta como derrota no desafio (não mexe no ELO).',
    leaveRanked: 'Abandonar conta como derrota e diminui seu ELO.',
    keepPlaying: 'Continuar jogando',
    forfeit: 'Abandonar',
    exit: 'Sair',
    forfeitHint: 'Abandonar conta como derrota',
    exitHint: 'Volta para a tela anterior',
    labelFriendly: 'DESAFIO · SEM ELO',
    labelPractice: 'WORD RUSH · TREINO',
    labelUnrated: 'WORD RUSH · SEM ELO',
    labelCalibration: (used: number, limit: number) => `RANKED · CALIBRAÇÃO ${used}/${limit}`,
    labelRanked: 'RANKED · WORD RUSH',
    noteUnrated: 'Partida sem ELO: ganhando ou perdendo, seu ELO não muda.',
    noteCalibration: (used: number, limit: number) =>
      `Partida de calibração ${used} de ${limit}: mexe no seu ELO.`,
    noteCompetitive: 'Partida ranqueada: mexe no seu ELO.',
    preparing: 'Preparando a partida…',
    declinedTitle: (name: string | undefined) =>
      name ? `@${name} não pode agora` : 'Seu amigo não pode agora',
    challengeFailedTitle: 'Não foi possível entrar no desafio',
    createOwnChallenge: 'Criar meu próprio desafio',
    searching: 'Procurando rival…',
    waitingA11y: (mm: number, ss: string) => `Esperando ${mm} minutos ${ss} segundos`,
    searchingSub: (language: string | null) =>
      language ? `Procurando alguém do seu nível em ${language}` : 'Procurando alguém do seu nível',
    cancelSearch: 'Cancelar busca',
    opponentFound: 'Rival encontrado!',
    you: 'Você',
    rules:
      '75 segundos, as mesmas perguntas para os dois. Certa +100 (+50 por rapidez), errada −50. Emende acertos: a sequência soma até +30.',
    waitingOpponent: 'Esperando seu rival…',
    ready: 'Pronto!',
    confirmIn: (s: number) => `Confirme em ${s} s ou a partida será cancelada.`,
    go: 'Valendo!',
    timeUp: 'Tempo! Calculando o resultado…',
    allAnswered: 'Você respondeu todas. Esperando o final…',
    cancelledTitle: 'Partida cancelada',
    missedEndTitle: 'Você perdeu o final',
    missedEndBody:
      'A partida terminou enquanto você estava desconectado. Veja o resultado no seu histórico.',
    newChallenge: 'Novo desafio',
    practiceAgain: 'Treinar de novo',
    findAnother: 'Buscar outra partida',
    shareMessage: (code: string, language: string, link: string) =>
      `Te desafio no PolyGo! Um duelo de 60 segundos em ${ptLanguage(language)}, você contra mim. Entre com o código ${code} (Ranked → Tenho um código) ou toque: ${link}`,
    waitingFor: (name: string) => `Esperando @${name}`,
    inviteSent: 'Seu convite chegou no app. Quando aceitarem, a partida começa sozinha.',
    inviteNote:
      'Amistoso: não mexe no ELO. Deixe esta tela aberta: se você fechar, o convite é cancelado.',
    cancelInvite: 'Cancelar convite',
    challengeCreated: 'Desafio criado',
    passCode: 'Passe este código para seu amigo. Quando ele entrar, a partida começa sozinha.',
    codeA11y: (spelled: string) => `Código ${spelled}`,
    shareChallenge: 'Compartilhar desafio',
    codeNote:
      'Amistoso: não mexe no ELO. Deixe esta tela aberta enquanto espera; o código expira em 15 minutos.',
    cancelChallenge: 'Cancelar desafio',
    playerA11y: (name: string, elo: string | null) =>
      `${name}, ${elo !== null ? `${elo} ELO` : 'sem classificação'}`,
  },
  it: {
    noMatchesIn: (code: string | null | undefined) =>
      `Non ci sono ancora partite in ${itLanguage(code)}`,
    noMatchesBody:
      'Le partite si sbloccano quando il livello A1 di questa lingua è completo. Per giocare, passa a un’altra lingua dal tuo profilo.',
    back: 'Indietro',
    serverMissingDev:
      'EXPO_PUBLIC_BATTLE_SERVER_URL manca o non è valida (in sviluppo può essere http). Le sfide con gli amici continuano a funzionare.',
    serverMissing:
      'Non siamo riusciti a collegare questa versione di PolyGo al server delle partite. Puoi comunque sfidare i tuoi amici.',
    leaveTitle: 'Abbandonare la partita?',
    leaveFriendly: 'Abbandonare conta come sconfitta nella sfida (l’ELO non cambia).',
    leaveRanked: 'Abbandonare conta come sconfitta e ti fa perdere ELO.',
    keepPlaying: 'Continua a giocare',
    forfeit: 'Abbandona',
    exit: 'Esci',
    forfeitHint: 'Abbandonare conta come sconfitta',
    exitHint: 'Torna alla schermata precedente',
    labelFriendly: 'SFIDA · SENZA ELO',
    labelPractice: 'WORD RUSH · ALLENAMENTO',
    labelUnrated: 'WORD RUSH · SENZA ELO',
    labelCalibration: (used: number, limit: number) => `RANKED · CALIBRAZIONE ${used}/${limit}`,
    labelRanked: 'RANKED · WORD RUSH',
    noteUnrated: 'Partita senza ELO: che tu vinca o perda, il tuo ELO non cambia.',
    noteCalibration: (used: number, limit: number) =>
      `Partita di calibrazione ${used} di ${limit}: cambia il tuo ELO.`,
    noteCompetitive: 'Partita classificata: cambia il tuo ELO.',
    preparing: 'Stiamo preparando la partita…',
    declinedTitle: (name: string | undefined) =>
      name ? `@${name} non può ora` : 'Il tuo amico non può ora',
    challengeFailedTitle: 'Impossibile entrare nella sfida',
    createOwnChallenge: 'Crea la mia sfida',
    searching: 'Ricerca avversario…',
    waitingA11y: (mm: number, ss: string) => `In attesa da ${mm} minuti ${ss} secondi`,
    searchingSub: (language: string | null) =>
      language
        ? `Cerchiamo qualcuno del tuo livello in ${language}`
        : 'Cerchiamo qualcuno del tuo livello',
    cancelSearch: 'Annulla ricerca',
    opponentFound: 'Avversario trovato!',
    you: 'Tu',
    rules:
      '75 secondi, le stesse domande per entrambi. Giusta +100 (+50 per la velocità), sbagliata −50. Concatena risposte giuste: la serie aggiunge fino a +30.',
    waitingOpponent: 'In attesa del tuo avversario…',
    ready: 'Pronto!',
    confirmIn: (s: number) => `Conferma entro ${s} s o la partita viene annullata.`,
    go: 'Via!',
    timeUp: 'Tempo scaduto! Calcolo del risultato…',
    allAnswered: 'Hai risposto a tutte. In attesa della fine…',
    cancelledTitle: 'Partita annullata',
    missedEndTitle: 'Ti sei perso il finale',
    missedEndBody:
      'La partita è finita mentre eri disconnesso. Guarda il risultato nella tua cronologia.',
    newChallenge: 'Nuova sfida',
    practiceAgain: 'Allenati di nuovo',
    findAnother: 'Cerca un’altra partita',
    shareMessage: (code: string, language: string, link: string) =>
      `Ti sfido su PolyGo! Un duello di 60 secondi in ${itLanguage(language)}, tu contro me. Entra con il codice ${code} (Ranked → Ho un codice) o tocca: ${link}`,
    waitingFor: (name: string) => `In attesa di @${name}`,
    inviteSent: 'Il tuo invito è arrivato nell’app. Quando lo accetta, la partita parte da sola.',
    inviteNote:
      'Amichevole: l’ELO non cambia. Tieni aperta questa schermata: se la chiudi, l’invito viene annullato.',
    cancelInvite: 'Annulla invito',
    challengeCreated: 'Sfida creata',
    passCode: 'Passa questo codice al tuo amico. Quando entra, la partita parte da sola.',
    codeA11y: (spelled: string) => `Codice ${spelled}`,
    shareChallenge: 'Condividi la sfida',
    codeNote:
      'Amichevole: l’ELO non cambia. Tieni aperta questa schermata mentre aspetti; il codice scade tra 15 minuti.',
    cancelChallenge: 'Annulla sfida',
    playerA11y: (name: string, elo: string | null) =>
      `${name}, ${elo !== null ? `${elo} ELO` : 'non classificato'}`,
  },
});
