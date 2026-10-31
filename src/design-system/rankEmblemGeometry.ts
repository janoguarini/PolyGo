import type { Division } from '@shared/ranking';

/**
 * Geometría del emblema de rango (viewBox "0 -4 100 104"). La usan RankEmblem y el script que
 * genera los SVG del sitio web (scripts/generate-website-emblems.ts).
 */
export const EMBLEM_VIEWBOX = '0 -4 100 104';
export const SHIELD = 'M50 4 L90 20 L86 62 Q80 84 50 96 Q20 84 14 62 L10 20 Z';
export const INNER = 'M50 15 L79 27 L76 60 Q71 77 50 86 Q29 77 24 60 L21 27 Z';
export const CROWN = 'M30 14 L36 2 L43 10 L50 0 L57 10 L64 2 L70 14 Z';
export const DIVISION_PIPS: Record<Division, number> = { III: 1, II: 2, I: 3 };

function regularPolygon(sides: number, radius: number, cx = 50, cy = 50): string {
  return Array.from({ length: sides }, (_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');
}

function star(points: number, outer: number, inner: number, cx = 50, cy = 50): string {
  return Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (i * Math.PI) / points;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');
}

/** La gema central gana lados con cada tier; los dos más altos son estrellas. */
export function gemPoints(tierIndex: number): string {
  return tierIndex >= 6 ? star(5 + (tierIndex - 6), 17, 8) : regularPolygon(3 + tierIndex, 15);
}

/** Trazo de cada marca de división (de 1 a 3, abajo de la gema). */
export function pipPath(i: number): string {
  return `M38 ${70 + i * 5} L50 ${75 + i * 5} L62 ${70 + i * 5}`;
}
