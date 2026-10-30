/**
 * Geometría del camino de lecciones: los nodos ondulan de lado a lado (como un sendero)
 * y la onda continúa entre unidades porque el índice es global.
 */

export const PATH_NODE_SIZE = 72;
export const PATH_ROW_HEIGHT = 104;

export interface PathPoint {
  x: number;
  y: number;
}

/** Desplazamiento horizontal del nodo `globalIndex` respecto al centro. */
export function pathOffset(globalIndex: number, width: number): number {
  const amplitude = Math.min(width * 0.26, 96);
  return Math.round(Math.sin((globalIndex * Math.PI) / 4) * amplitude);
}

/** Centros de `count` nodos dentro de un contenedor de ancho `width`. */
export function pathPoints(firstIndex: number, count: number, width: number): PathPoint[] {
  return Array.from({ length: count }, (_, i) => ({
    x: width / 2 + pathOffset(firstIndex + i, width),
    y: i * PATH_ROW_HEIGHT + PATH_ROW_HEIGHT / 2,
  }));
}

/** Curva SVG entre dos centros con tangentes verticales (tramo suave). */
export function segmentPath(from: PathPoint, to: PathPoint): string {
  const midY = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
}

/**
 * Estrellas de una lección completada según su mejor precisión al primer intento:
 * 3 sólo sin ningún error (la lección se vuelve dorada), 2 desde 80 %, 1 por completarla.
 */
export function lessonStars(bestAccuracy: number | null): 0 | 1 | 2 | 3 {
  if (bestAccuracy === null) return 0;
  if (bestAccuracy >= 1) return 3;
  if (bestAccuracy >= 0.8) return 2;
  return 1;
}

/** Estrellas acumuladas en el currículo (para el perfil). */
export function starTotals(units: { lessons: { bestAccuracy: number | null }[] }[]) {
  const lessons = units.flatMap((u) => u.lessons);
  const stars = lessons.map((l) => lessonStars(l.bestAccuracy));
  return {
    earned: stars.reduce<number>((n, x) => n + x, 0),
    max: lessons.length * 3,
    golden: stars.filter((x) => x === 3).length,
  };
}

/** Tipo de lección según su id (las de consolidación se generan en content/path.ts). */
export type LessonKind = 'lesson' | 'review' | 'listening' | 'words' | 'final';

export function lessonKind(lessonId: string): LessonKind {
  if (/-rev\d+$/.test(lessonId)) return 'review';
  if (lessonId.endsWith('-listen')) return 'listening';
  if (lessonId.endsWith('-words')) return 'words';
  if (lessonId.endsWith('-final')) return 'final';
  return 'lesson';
}
