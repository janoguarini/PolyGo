import type { BattlePhase } from './state';

/**
 * Qué pantalla (y qué reglas) corresponde a la partida en curso. El formato lo decide quien la arma,
 * no el modo:
 * - Servidor de partidas con la app nueva (protocolo 3): Ranked, práctica y amistosos se juegan en
 *   Arcade (60 s, shared/arcade.ts ARCADE.durationMs; server/src/server.ts arma ArcadeBattle para
 *   cualquier cliente de protocolo 3, también en los amistosos: server/test/friendly.test.ts). El
 *   snapshot trae `arcade` desde «rival encontrado».
 * - Sin servidor de partidas (useLocalBattleSession) o un servidor que todavía arma el formato clásico:
 *   Word Rush clásico de 75 s (shared/protocol.ts WORD_RUSH.durationMs, que no cambia: lo usan las
 *   builds anteriores).
 *
 * Antes los amistosos quedaban siempre en la pantalla clásica, con las reglas de 75 s y la tarjeta de
 * preguntas clásica, aunque el servidor los jugara en Arcade.
 */
export function usesArcadeShell(s: {
  /** La sesión sabe responder microjuegos Arcade (useBattleSession; la local no). */
  arcadeCapable: boolean;
  friendly: boolean;
  /** Llegaron datos Arcade del servidor (state.arcade). */
  hasArcade: boolean;
  phase: BattlePhase;
  rankedSearch: boolean;
}): boolean {
  if (!s.arcadeCapable) return false;
  // Un amistoso sólo entra a Arcade cuando el servidor ya lo confirmó con sus datos: si no llegan
  // (formato clásico), sigue en la pantalla clásica con sus reglas.
  if (s.friendly && !s.hasArcade) return false;
  const inGame = s.phase === 'found' || s.phase === 'countdown' || s.phase === 'playing';
  return (inGame && (s.hasArcade || s.phase === 'countdown')) || s.rankedSearch;
}
