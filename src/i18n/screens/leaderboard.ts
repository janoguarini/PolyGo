import { defineStrings } from '..';

/** Clasificación (src/app/leaderboard.tsx). */
export const leaderboardScreenStrings = defineStrings({
  es: {
    title: 'Clasificación',
    winToEnter: 'Ganá una ranked para entrar a la clasificación.',
    global: 'Global',
    pickLanguageHint: 'Tocá de nuevo para elegir otro idioma',
    playerColumn: 'JUGADOR',
    rankColumn: 'RANGO',
    loading: 'Cargando clasificación…',
    loadError: 'No pudimos cargar la clasificación.',
    emptyTitle: 'Todavía no hay jugadores',
    emptyBody: 'Ganá una ranked y estrená la clasificación.',
  },
  en: {
    title: 'Leaderboard',
    winToEnter: 'Win a ranked match to join the leaderboard.',
    global: 'Global',
    pickLanguageHint: 'Tap again to pick another language',
    playerColumn: 'PLAYER',
    rankColumn: 'RANK',
    loading: 'Loading leaderboard…',
    loadError: 'We couldn’t load the leaderboard.',
    emptyTitle: 'No players yet',
    emptyBody: 'Win a ranked match and be the first on the leaderboard.',
  },
});
