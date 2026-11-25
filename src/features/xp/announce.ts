import { xpSourceLabel } from '@shared/xp';

import { getStrings } from '@/i18n';

import type { XpGrant, XpState } from './api';
import { xpStrings } from './strings';

/** Ganancias y niveles ya anunciados en esta sesión (la misma respuesta puede volver del caché). */
const announced = new Set<string>();
const announcedLevels = new Set<number>();

/** Resume varias ganancias en una línea: "Lección completada ×2" o "Experiencia". */
export function xpGrantSummary(grants: XpGrant[]): { total: number; label: string } {
  const total = grants.reduce((n, g) => n + g.amount, 0);
  const sources = [...new Set(grants.map((g) => g.source))];
  const t = getStrings(xpStrings);
  const label =
    sources.length === 1
      ? `${t.sourceLabel(sources[0]!, xpSourceLabel(sources[0]!))}${grants.length > 1 ? ` ×${grants.length}` : ''}`
      : t.experience;
  return { total, label };
}

/**
 * Qué anunciar para una respuesta de sync_xp: nada (primera vez o ya anunciado), un aviso de XP o la
 * subida de nivel (que ya incluye el XP ganado). Marca lo anunciado.
 */
export function nextXpAnnouncement(
  xp: XpState,
):
  | { kind: 'level'; level: number; gained: number }
  | { kind: 'toast'; total: number; label: string }
  | null {
  const fresh = xp.granted.filter((g) => !announced.has(`${g.source}:${g.ref}`));
  for (const g of xp.granted) announced.add(`${g.source}:${g.ref}`);
  if (xp.initial) {
    // La historia acreditada la primera vez no se celebra: ese nivel ya "era" del jugador.
    announcedLevels.add(xp.level);
    return null;
  }
  if (xp.level > xp.level_before && !announcedLevels.has(xp.level)) {
    announcedLevels.add(xp.level);
    return { kind: 'level', level: xp.level, gained: xp.granted_total };
  }
  if (fresh.length === 0) return null;
  return { kind: 'toast', ...xpGrantSummary(fresh) };
}

/** Sólo para tests. */
export function resetXpAnnouncements() {
  announced.clear();
  announcedLevels.clear();
  suppressed = 0;
}

/**
 * Pantallas que muestran ellas mismas la XP ganada (los resultados de una lección): mientras están
 * a la vista, el aviso global («+20 XP» y el modal de nivel) no se muestra encima. Lo anunciado igual
 * se marca, así no aparece después. Devuelve la función que levanta la supresión.
 */
let suppressed = 0;
export function suppressXpAnnouncements(): () => void {
  suppressed += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    suppressed -= 1;
  };
}
export function xpAnnouncementsSuppressed(): boolean {
  return suppressed > 0;
}
