import { getRank, type RankInfo, type TierId } from '@shared/ranking';

import {
  defineStrings,
  getInterfaceLanguage,
  stringsFor,
  useInterfaceLanguage,
  type InterfaceLanguage,
} from '@/i18n';

/**
 * Nombres de rango según el idioma de la interfaz. `shared/ranking.ts` los guarda en español (los usa
 * el servidor de partidas, y `getRank().label` / `tier.name` siguen en español): acá se mapean por id
 * estable de tier. Las divisiones (III, II, I) no cambian.
 *
 * Uso: `const ranks = useRankLabels(); ranks.label(getRank(rating))` en componentes, o
 * `getRankLabel(rank)` / `getTierName(id)` fuera de React.
 */
export const tierNames = defineStrings<Record<TierId, string>>({
  es: {
    bronze: 'Bronce',
    silver: 'Plata',
    gold: 'Oro',
    platinum: 'Platino',
    emerald: 'Esmeralda',
    diamond: 'Diamante',
    master: 'Maestro',
    grandmaster: 'Gran Maestro',
  },
  en: {
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
    emerald: 'Emerald',
    diamond: 'Diamond',
    master: 'Master',
    grandmaster: 'Grandmaster',
  },
  'pt-BR': {
    bronze: 'Bronze',
    silver: 'Prata',
    gold: 'Ouro',
    platinum: 'Platina',
    emerald: 'Esmeralda',
    diamond: 'Diamante',
    master: 'Mestre',
    grandmaster: 'Grão-Mestre',
  },
  it: {
    bronze: 'Bronzo',
    silver: 'Argento',
    gold: 'Oro',
    platinum: 'Platino',
    emerald: 'Smeraldo',
    diamond: 'Diamante',
    master: 'Maestro',
    grandmaster: 'Gran Maestro',
  },
  fr: {
    bronze: 'Bronze',
    silver: 'Argent',
    gold: 'Or',
    platinum: 'Platine',
    emerald: 'Émeraude',
    diamond: 'Diamant',
    master: 'Maître',
    grandmaster: 'Grand Maître',
  },
});

const unplacedNames = defineStrings({
  es: { unplaced: 'Sin posicionar' },
  en: { unplaced: 'Unranked' },
  'pt-BR': { unplaced: 'Sem classificação' },
  it: { unplaced: 'Non classificato' },
  fr: { unplaced: 'Non classé' },
});

/** «Oro» / «Gold» / «Ouro» / «Oro». */
export function tierName(tier: TierId, ui: InterfaceLanguage): string {
  return stringsFor(tierNames, ui)[tier];
}

/** Etiqueta de un rango ya calculado: «Plata II» / «Silver II», «Maestro» / «Master». */
export function rankLabel(
  rank: Pick<RankInfo, 'tier' | 'division'>,
  ui: InterfaceLanguage,
): string {
  const name = tierName(rank.tier.id, ui);
  return rank.division ? `${name} ${rank.division}` : name;
}

/** Etiqueta del rango que corresponde a un rating. */
export function rankLabelForRating(rating: number, ui: InterfaceLanguage): string {
  return rankLabel(getRank(rating), ui);
}

/** «Sin posicionar» / «Unranked». */
export function unplacedLabel(ui: InterfaceLanguage): string {
  return stringsFor(unplacedNames, ui).unplaced;
}

/** Fuera de React (utilidades, formateadores). */
export const getTierName = (tier: TierId) => tierName(tier, getInterfaceLanguage());
export const getRankLabel = (rank: Pick<RankInfo, 'tier' | 'division'>) =>
  rankLabel(rank, getInterfaceLanguage());
export const getRankLabelForRating = (rating: number) =>
  rankLabelForRating(rating, getInterfaceLanguage());
export const getUnplacedLabel = () => unplacedLabel(getInterfaceLanguage());

/** En componentes: `const ranks = useRankLabels(); ranks.label(getRank(r))`. */
export function useRankLabels() {
  const ui = useInterfaceLanguage();
  return {
    tier: (tier: TierId) => tierName(tier, ui),
    label: (rank: Pick<RankInfo, 'tier' | 'division'>) => rankLabel(rank, ui),
    forRating: (rating: number) => rankLabelForRating(rating, ui),
    unplaced: unplacedLabel(ui),
  };
}

/** Componentes de src/features/ranked (tarjeta de rango, escalera, clasificación). */
export const rankedStrings = defineStrings({
  es: {
    // RankCard
    currentRank: 'RANGO ACTUAL',
    eloA11y: (elo: number) => `${elo} puntos de ELO`,
    firstWinHint: 'Gana tu primera partida para entrar al ranking en Bronce.',
    progressA11y: 'Progreso al siguiente rango',
    maxRank: 'Rango máximo alcanzado',
    eloToNextRank: (n: number) => `${n} ELO para el siguiente rango`,
    // TierLadder
    ladderA11y: (names: string) => `Rangos: ${names}`,
    // Leaderboard
    you: 'Tú',
    openProfileHint: 'Abre el perfil del jugador',
    rowA11y: (
      place: number,
      name: string,
      language: string | undefined,
      rank: string,
      elo: number,
    ) => `Puesto ${place}, ${name}${language ? `, ${language}` : ''}, ${rank}, ${elo} ELO`,
  },
  en: {
    currentRank: 'CURRENT RANK',
    eloA11y: (elo: number) => `${elo} ELO points`,
    firstWinHint: 'Win your first match to join the ladder in Bronze.',
    progressA11y: 'Progress to the next rank',
    maxRank: 'Top rank reached',
    eloToNextRank: (n: number) => `${n} ELO to the next rank`,
    ladderA11y: (names: string) => `Ranks: ${names}`,
    you: 'You',
    openProfileHint: 'Opens the player’s profile',
    rowA11y: (
      place: number,
      name: string,
      language: string | undefined,
      rank: string,
      elo: number,
    ) => `Rank ${place}, ${name}${language ? `, ${language}` : ''}, ${rank}, ${elo} ELO`,
  },
  'pt-BR': {
    currentRank: 'RANK ATUAL',
    eloA11y: (elo: number) => `${elo} pontos de ELO`,
    firstWinHint: 'Vença sua primeira partida para entrar no ranking, começando no Bronze.',
    progressA11y: 'Progresso até o próximo rank',
    maxRank: 'Rank máximo alcançado',
    eloToNextRank: (n: number) => `${n} ELO para o próximo rank`,
    ladderA11y: (names: string) => `Ranks: ${names}`,
    you: 'Você',
    openProfileHint: 'Abre o perfil do jogador',
    rowA11y: (
      place: number,
      name: string,
      language: string | undefined,
      rank: string,
      elo: number,
    ) => `Posição ${place}, ${name}${language ? `, ${language}` : ''}, ${rank}, ${elo} ELO`,
  },
  it: {
    currentRank: 'RANGO ATTUALE',
    eloA11y: (elo: number) => `${elo} punti ELO`,
    firstWinHint: 'Vinci la tua prima partita per entrare in classifica nel Bronzo.',
    progressA11y: 'Progresso verso il rango successivo',
    maxRank: 'Rango massimo raggiunto',
    eloToNextRank: (n: number) => `${n} ELO al rango successivo`,
    ladderA11y: (names: string) => `Ranghi: ${names}`,
    you: 'Tu',
    openProfileHint: 'Apre il profilo del giocatore',
    rowA11y: (
      place: number,
      name: string,
      language: string | undefined,
      rank: string,
      elo: number,
    ) => `Posizione ${place}, ${name}${language ? `, ${language}` : ''}, ${rank}, ${elo} ELO`,
  },
  fr: {
    currentRank: 'RANG ACTUEL',
    eloA11y: (elo: number) => `${elo} points d’ELO`,
    firstWinHint: 'Gagne ton premier match pour entrer dans le classement en Bronze.',
    progressA11y: 'Progression vers le rang suivant',
    maxRank: 'Rang maximum atteint',
    eloToNextRank: (n: number) => `${n} ELO avant le rang suivant`,
    ladderA11y: (names: string) => `Rangs : ${names}`,
    you: 'Toi',
    openProfileHint: 'Ouvre le profil du joueur',
    rowA11y: (
      place: number,
      name: string,
      language: string | undefined,
      rank: string,
      elo: number,
    ) => `Place ${place}, ${name}${language ? `, ${language}` : ''}, ${rank}, ${elo} ELO`,
  },
});
