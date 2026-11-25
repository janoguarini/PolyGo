import { BOT_CONFIG } from '@shared/bots';

import type { battleScreenStrings } from '@/i18n/screens/battle';

import type { BattleState } from './state';

type ScreenStrings = (typeof battleScreenStrings)['es'];

/**
 * Qué tipo de partida es (se ve arriba durante toda la partida). Todo Ranked es Word Rush: lo que
 * cambia es si mueve el ELO (contra una persona, calibración contra un bot, o sin ELO).
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
 * Mientras se busca rival: el servidor pone un bot de tu nivel a los BOT_CONFIG.afterMs si no aparece
 * una persona. Sin partidas de calibración en este idioma, ese bot juega sin ELO. Antes de saber cuántas
 * quedan (todavía no llegó queue:status), el aviso general.
 */
export function searchHint(
  queue: Pick<NonNullable<BattleState['queue']>, 'botCalibrationLeft'> | null,
  t: ScreenStrings,
): string {
  const seconds = Math.round(BOT_CONFIG.afterMs / 1000);
  return queue?.botCalibrationLeft === 0 ? t.botSoonUnrated(seconds) : t.botSoon(seconds);
}
