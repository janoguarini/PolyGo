/**
 * Misiones diarias. Cuáles tocan y el progreso los decide la base (daily_missions_for y
 * mission_progress en 20261031030000_daily_missions_streak_freeze.sql); acá sólo los textos.
 */

export const MISSION_IDS = [
  'lessons',
  'minutes',
  'correct',
  'perfect',
  'ranked_play',
  'ranked_win',
] as const;

export type MissionId = (typeof MISSION_IDS)[number];

/** Protectores de racha que se pueden guardar a la vez. */
export const MAX_STREAK_FREEZES = 2;

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

/** Texto de la misión según su meta, p. ej. "Completa 2 lecciones". */
export function missionTitle(id: MissionId, target: number): string {
  switch (id) {
    case 'lessons':
      return `Completa ${target} ${plural(target, 'lección', 'lecciones')}`;
    case 'minutes':
      return `Estudia ${target} minutos`;
    case 'correct':
      return `Acierta ${target} respuestas`;
    case 'perfect':
      return 'Termina una lección sin errores';
    case 'ranked_play':
      return `Juega ${target} ${plural(target, 'partida', 'partidas')} ranked`;
    case 'ranked_win':
      return 'Gana una partida ranked';
  }
}

/** A dónde ir para avanzar en la misión. */
export function missionDestination(id: MissionId): 'learn' | 'ranked' {
  return id === 'ranked_play' || id === 'ranked_win' ? 'ranked' : 'learn';
}
