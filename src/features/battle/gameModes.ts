import { WORD_RUSH } from '@shared/protocol';

import { getStrings } from '@/i18n';

import { battleStrings } from './strings';

/**
 * Modos de juego para desafiar a un amigo. Hoy hay uno solo; cuando haya más, se suman acá y la
 * pantalla de desafío los muestra sin cambios.
 */
export type GameModeId = 'word_rush';

export interface GameMode {
  id: GameModeId;
  name: string;
  description: string;
  /** "75 s". */
  duration: string;
}

export const GAME_MODES: readonly GameMode[] = [
  {
    id: 'word_rush',
    name: 'Word Rush',
    // Se lee al dibujar: sigue el idioma de la interfaz.
    get description() {
      return getStrings(battleStrings).wordRushDescription;
    },
    duration: `${WORD_RUSH.durationMs / 1000} s`,
  },
];

export const DEFAULT_GAME_MODE: GameModeId = 'word_rush';
