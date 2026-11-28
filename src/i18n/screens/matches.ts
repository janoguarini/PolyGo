import { defineStrings } from '..';

/** Historial de partidas (src/app/matches.tsx). */
export const matchesScreenStrings = defineStrings({
  es: {
    title: 'Historial de partidas',
    loading: 'Cargando partidas…',
    emptyTitle: 'Sin partidas todavía',
    emptyBody:
      'Cuando juegues Word Rush verás aquí cada resultado y cuánto ELO ganaste o perdiste.',
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
  'pt-BR': {
    title: 'Histórico de partidas',
    loading: 'Carregando partidas…',
    emptyTitle: 'Nenhuma partida ainda',
    emptyBody:
      'Quando você jogar Word Rush, vai ver aqui cada resultado e quanto ELO ganhou ou perdeu.',
    loadMore: 'Carregar mais',
  },
  it: {
    title: 'Storico partite',
    loading: 'Caricamento partite…',
    emptyTitle: 'Ancora nessuna partita',
    emptyBody:
      'Quando giocherai a Word Rush, qui vedrai ogni risultato e quanto ELO hai guadagnato o perso.',
    loadMore: 'Carica altre',
  },
  fr: {
    title: 'Historique des matchs',
    loading: 'Chargement des matchs…',
    emptyTitle: 'Pas encore de matchs',
    emptyBody:
      'Quand tu joueras à Word Rush, tu verras ici chaque résultat et l’ELO gagné ou perdu.',
    loadMore: 'Charger plus',
  },
});
