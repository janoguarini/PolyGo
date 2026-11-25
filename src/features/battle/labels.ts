import type { BattleFinish } from '@shared/protocol';

import type { battleScreenStrings } from '@/i18n/screens/battle';

import type { BattleState } from './state';

type ScreenStrings = (typeof battleScreenStrings)['es'];

/**
 * Qué tipo de partida es (se ve arriba durante toda la partida). Todo Ranked es Word Rush: lo que
 * cambia es si mueve el ELO (clasificatoria, calibración o sin ELO). Ningún texto dice si el rival es
 * un bot: los rivales de práctica se presentan como cualquier jugador (ver rivalLook.ts).
 */
export function matchLabel(
  state: Pick<BattleState, 'friendly' | 'mode' | 'rating' | 'calibration'>,
  t: ScreenStrings,
): string {
  if (state.friendly) return t.labelFriendly;
  if (state.mode === 'practice') return t.labelPractice;
  if (state.mode === 'bot_practice' || state.rating === 'unrated') return t.labelUnrated;
  if (state.rating === 'calibration' && state.calibration) {
    return t.labelCalibration(state.calibration.used, state.calibration.limit);
  }
  return t.labelRanked;
}

/** Lo que se explica antes de empezar según si la partida mueve el ELO. */
export function ratingNote(
  state: Pick<BattleState, 'friendly' | 'mode' | 'rating' | 'calibration'>,
  t: ScreenStrings,
): string | null {
  if (state.friendly || state.mode === 'practice') return null;
  if (state.mode === 'bot_practice' || state.rating === 'unrated') return t.noteUnrated;
  if (state.rating === 'calibration' && state.calibration) {
    return t.noteCalibration(state.calibration.used, state.calibration.limit);
  }
  if (state.rating === 'competitive') return t.noteCompetitive;
  return null;
}

/**
 * Si se muestra «Buscando rival» (ArcadeSearching): al buscar partida Ranked, desde el primer instante
 * (mientras conecta y entra a la cola) y hasta que aparece el rival. Nunca en desafíos ni prácticas.
 */
export function isRankedSearch(
  state: Pick<BattleState, 'phase' | 'mode' | 'friendly' | 'challenge'>,
  rankedRoute: boolean,
): boolean {
  return (
    rankedRoute &&
    (state.phase === 'idle' || state.phase === 'connecting' || state.phase === 'searching') &&
    state.mode === 'ranked' &&
    !state.friendly &&
    !state.challenge
  );
}

/** Si la partida suma XP (y se muestra la tarjeta de XP): sólo Ranked con ELO, ganes o pierdas. */
export function battleGivesXp(result: Pick<BattleFinish, 'mode' | 'rating' | 'friendly'>): boolean {
  return result.mode === 'ranked' && result.rating !== 'unrated' && !result.friendly;
}
