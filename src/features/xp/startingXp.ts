import { xpForNextLevel } from '@shared/xp';

import type { XpState } from './api';

/**
 * Estado inicial que se muestra mientras el servidor todavía no tiene XP (sync_xp sin migrar
 * devuelve null): nivel 0, sin XP y, como objetivo, lo que pide el nivel 1 en la curva real.
 * Sólo presentación: no se guarda ni se envía, y en cuanto sync_xp responda se usan sus datos.
 */
export const STARTING_XP: XpState = {
  total: 0,
  level: 0,
  into: 0,
  need: xpForNextLevel(1),
  remaining: xpForNextLevel(1),
  level_before: 0,
  initial: true,
  granted: [],
  granted_total: 0,
};

/** XP de la consulta, o el estado de nivel 0 si el servidor no tiene XP (undefined = cargando). */
export function xpOrStart(data: XpState | null | undefined): XpState | undefined {
  return data === null ? STARTING_XP : data;
}
