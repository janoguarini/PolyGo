import { defineStrings } from '..';
import { languageName } from '../languages';

/** Pestaña Ranked (src/app/(tabs)/ranked.tsx). */
export const rankedScreenStrings = defineStrings({
  es: {
    leaderboardA11y: (position: number | null | undefined) =>
      position ? `Clasificación: estás en el puesto ${position} del mundo` : 'Clasificación',
    top: 'Top',
    seasonEnds: (season: string, date: string) => `${season} · Termina el ${date}`,
    modeWordRush: 'MODO · WORD RUSH',
    comingSoon: (code: string | null | undefined) =>
      `Ranked en ${languageName(code, 'es').toLowerCase()} llega pronto`,
    comingSoonBody:
      'Las partidas se habilitan cuando el nivel A1 de este idioma esté completo. Para jugar ahora, cambia a otro idioma desde tu perfil: tu progreso en cada idioma se guarda.',
    goToProfile: 'Ir al perfil',
    disabledBody:
      'Las partidas Ranked y la práctica están desactivadas en esta versión de PolyGo. Puedes seguir desafiando a tus amigos: esas partidas no mueven el ELO.',
    gameMode: 'MODO DE JUEGO',
    findMatch: 'Buscar partida',
    findMatchHint: 'Busca un rival con un ELO similar',
    practiceNoElo: 'Practicar sin ELO',
    practiceHint: 'Una partida de Word Rush de 60 segundos contra el reloj, sin rival',
    playWithFriend: 'JUGAR CON UN AMIGO',
    playWithFriendBody:
      'Mándale un código y juegan la misma partida en vivo. Amistoso: no mueve el ELO.',
    challengeCode: 'Código del desafío',
    joinChallenge: 'Entrar al desafío',
    back: 'Volver',
    challengeFriend: 'Desafiar a un amigo',
    challengeFriendHint: 'Crea un código para compartir con un amigo',
    haveCode: 'Tengo un código',
  },
  en: {
    leaderboardA11y: (position: number | null | undefined) =>
      position ? `Leaderboard: you’re number ${position} in the world` : 'Leaderboard',
    top: 'Top',
    seasonEnds: (season: string, date: string) => `${season} · Ends ${date}`,
    modeWordRush: 'MODE · WORD RUSH',
    comingSoon: (code: string | null | undefined) =>
      `Ranked in ${languageName(code, 'en')} is coming soon`,
    comingSoonBody:
      'Matches open up once the A1 level for this language is complete. To play now, switch to another language from your profile. Your progress in each language is saved.',
    goToProfile: 'Go to profile',
    disabledBody:
      'Ranked matches and practice are turned off in this version of PolyGo. You can still challenge your friends: those matches don’t affect ELO.',
    gameMode: 'GAME MODE',
    findMatch: 'Find a match',
    findMatchHint: 'Looks for an opponent with a similar ELO',
    practiceNoElo: 'Practice without ELO',
    practiceHint: 'A 60-second Word Rush match against the clock, no opponent',
    playWithFriend: 'PLAY WITH A FRIEND',
    playWithFriendBody:
      'Send them a code and play the same match live. Friendly: ELO doesn’t change.',
    challengeCode: 'Challenge code',
    joinChallenge: 'Join challenge',
    back: 'Back',
    challengeFriend: 'Challenge a friend',
    challengeFriendHint: 'Creates a code to share with a friend',
    haveCode: 'I have a code',
  },
  'pt-BR': {
    leaderboardA11y: (position: number | null | undefined) =>
      position ? `Classificação: você está na posição ${position} do mundo` : 'Classificação',
    top: 'Top',
    seasonEnds: (season: string, date: string) => `${season} · Termina em ${date}`,
    modeWordRush: 'MODO · WORD RUSH',
    comingSoon: (code: string | null | undefined) =>
      `Ranked em ${languageName(code, 'pt-BR').toLowerCase()} chega em breve`,
    comingSoonBody:
      'As partidas são liberadas quando o nível A1 deste idioma estiver completo. Para jogar agora, mude para outro idioma no seu perfil: seu progresso em cada idioma fica salvo.',
    goToProfile: 'Ir para o perfil',
    disabledBody:
      'As partidas Ranked e o treino estão desativados nesta versão do PolyGo. Você ainda pode desafiar seus amigos: essas partidas não mexem no ELO.',
    gameMode: 'MODO DE JOGO',
    findMatch: 'Buscar partida',
    findMatchHint: 'Procura um rival com ELO parecido',
    practiceNoElo: 'Treinar sem ELO',
    practiceHint: 'Uma partida de Word Rush de 60 segundos contra o relógio, sem rival',
    playWithFriend: 'JOGAR COM UM AMIGO',
    playWithFriendBody:
      'Mande um código e vocês jogam a mesma partida ao vivo. Amistoso: não mexe no ELO.',
    challengeCode: 'Código do desafio',
    joinChallenge: 'Entrar no desafio',
    back: 'Voltar',
    challengeFriend: 'Desafiar um amigo',
    challengeFriendHint: 'Cria um código para compartilhar com um amigo',
    haveCode: 'Tenho um código',
  },
  it: {
    leaderboardA11y: (position: number | null | undefined) =>
      position ? `Classifica: sei in posizione ${position} nel mondo` : 'Classifica',
    top: 'Top',
    seasonEnds: (season: string, date: string) => `${season} · Fine: ${date}`,
    modeWordRush: 'MODALITÀ · WORD RUSH',
    comingSoon: (code: string | null | undefined) =>
      `Ranked in ${languageName(code, 'it').toLowerCase()} arriva presto`,
    comingSoonBody:
      'Le partite si sbloccano quando il livello A1 di questa lingua è completo. Per giocare ora, passa a un’altra lingua dal tuo profilo: i tuoi progressi in ogni lingua restano salvati.',
    goToProfile: 'Vai al profilo',
    disabledBody:
      'Le partite Ranked e l’allenamento sono disattivati in questa versione di PolyGo. Puoi comunque sfidare i tuoi amici: quelle partite non cambiano l’ELO.',
    gameMode: 'MODALITÀ DI GIOCO',
    findMatch: 'Cerca partita',
    findMatchHint: 'Cerca un avversario con un ELO simile',
    practiceNoElo: 'Allenati senza ELO',
    practiceHint: 'Una partita di Word Rush da 60 secondi contro il tempo, senza avversario',
    playWithFriend: 'GIOCA CON UN AMICO',
    playWithFriendBody:
      'Mandagli un codice e giocate la stessa partita dal vivo. Amichevole: non cambia l’ELO.',
    challengeCode: 'Codice della sfida',
    joinChallenge: 'Entra nella sfida',
    back: 'Indietro',
    challengeFriend: 'Sfida un amico',
    challengeFriendHint: 'Crea un codice da condividere con un amico',
    haveCode: 'Ho un codice',
  },
});
