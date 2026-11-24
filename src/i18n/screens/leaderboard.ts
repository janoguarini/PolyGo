import { defineStrings } from '..';

/** Clasificación (src/app/leaderboard.tsx). */
export const leaderboardScreenStrings = defineStrings({
  es: {
    title: 'Clasificación',
    worldScope: 'del mundo',
    languageScope: (language: string) => `en ${language}`,
    yourPosition: 'TU PUESTO',
    topIn: (position: number, scope: string) => `Top ${position} ${scope}`,
    positionOf: (position: number, total: number, percent: number) =>
      `Puesto ${position} de ${total} · top ${percent} %`,
    unplaced: 'Sin posicionar',
    winToEnter: 'Ganá una ranked para entrar a la clasificación.',
    all: 'Todos',
    pickLanguageHint: 'Tocá de nuevo para elegir otro idioma',
    globalNote: 'La global toma el ELO de tu mejor idioma entre los que ya estás posicionado.',
    loading: 'Cargando clasificación…',
    loadError: 'No pudimos cargar la clasificación.',
    emptyTitle: 'Todavía no hay jugadores',
    emptyBody: 'Ganá una ranked y estrená la clasificación.',
  },
  en: {
    title: 'Leaderboard',
    worldScope: 'in the world',
    languageScope: (language: string) => `in ${language}`,
    yourPosition: 'YOUR POSITION',
    topIn: (position: number, scope: string) => `Top ${position} ${scope}`,
    positionOf: (position: number, total: number, percent: number) =>
      `Rank ${position} of ${total} · top ${percent}%`,
    unplaced: 'Unranked',
    winToEnter: 'Win a ranked match to join the leaderboard.',
    all: 'All',
    pickLanguageHint: 'Tap again to pick another language',
    globalNote: 'The global board uses the ELO of your best language among those you’re ranked in.',
    loading: 'Loading leaderboard…',
    loadError: 'We couldn’t load the leaderboard.',
    emptyTitle: 'No players yet',
    emptyBody: 'Win a ranked match and be the first on the leaderboard.',
  },
});
