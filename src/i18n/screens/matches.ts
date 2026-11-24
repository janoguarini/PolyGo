import { defineStrings } from '..';

/** Historial de partidas (src/app/matches.tsx). */
export const matchesScreenStrings = defineStrings({
  es: {
    title: 'Historial de partidas',
    loading: 'Cargando partidas…',
    emptyTitle: 'Sin partidas todavía',
    emptyBody:
      'Cuando juegues Word Rush vas a ver acá cada resultado y cuánto ELO ganaste o perdiste.',
    loadMore: 'Cargar más',
  },
  en: {
    title: 'Match history',
    loading: 'Loading matches…',
    emptyTitle: 'No matches yet',
    emptyBody:
      'Once you play Word Rush, you’ll see every result here and how much ELO you won or lost.',
    loadMore: 'Load more',
  },
});
