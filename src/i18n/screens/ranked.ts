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
      'Las partidas se habilitan cuando el nivel A1 de este idioma esté completo. Para jugar ahora, cambiá a otro idioma desde tu perfil: tu progreso en cada idioma se guarda.',
    goToProfile: 'Ir al perfil',
    disabledBody:
      'Las partidas Ranked y la práctica están desactivadas en esta versión de PolyGo. Podés seguir desafiando a tus amigos: esas partidas no mueven el ELO.',
    gameMode: 'MODO DE JUEGO',
    findMatch: 'Buscar partida',
    findMatchHint: 'Busca un rival con un ELO similar',
    practiceNoElo: 'Practicar sin ELO',
    practiceHint: 'Una ronda de 75 segundos contra el reloj, sin rival',
    playWithFriend: 'JUGAR CON UN AMIGO',
    playWithFriendBody:
      'Mandale un código y juegan la misma partida en vivo. Amistoso: no mueve el ELO.',
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
    practiceHint: 'A 75-second round against the clock, no opponent',
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
});
