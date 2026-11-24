/**
 * Geometría del mapa de aprendizaje: un sendero sinuoso que cruza de izquierda a derecha. Cada nodo
 * deja libre el lado opuesto para el título de su lección, y la onda continúa entre unidades porque
 * el índice es global. La lección actual ocupa una fila más alta (su nodo es más grande y tiene
 * brillo) y se arrima a su borde.
 */

import type { LessonStatus } from './curriculum';

/** Diámetro de un nodo común. */
export const MAP_NODE_SIZE = 64;
/** Diámetro del anillo exterior del nodo actual. */
export const MAP_CURRENT_SIZE = 96;
export const MAP_ROW_HEIGHT = 96;
export const MAP_CURRENT_ROW_HEIGHT = 136;
/** Espacio entre el borde de un nodo y el texto que lo acompaña. */
export const MAP_LABEL_GAP = 14;

export interface PathPoint {
  x: number;
  y: number;
  /** Lado del contenedor donde quedó el nodo: su texto va del lado contrario. */
  side: 'left' | 'right';
}

export function mapRowHeight(status: LessonStatus): number {
  return status === 'current' ? MAP_CURRENT_ROW_HEIGHT : MAP_ROW_HEIGHT;
}

/**
 * Posición en la onda del nodo `globalIndex`, entre -1 (izquierda) y 1 (derecha). Con este desfase
 * nunca cae en el centro: ±0.5 o ±1, así siempre queda un lado ancho para el texto.
 */
export function mapWave(globalIndex: number): number {
  // Negativo al principio: el recorrido arranca a la izquierda y cruza hacia la derecha.
  return -Math.sin(Math.PI / 6 + (globalIndex * Math.PI) / 3);
}

/** Centro horizontal de un nodo: la onda recorre el ancho sin sacar el nodo actual del contenedor. */
export function mapNodeX(globalIndex: number, width: number, status: LessonStatus): number {
  const wave = mapWave(globalIndex);
  const edge = MAP_CURRENT_SIZE / 2 + 2;
  // La lección actual se arrima a su borde (como un extremo de la onda) para dejar sitio a la tarjeta.
  const reach = status === 'current' ? Math.sign(wave) : wave;
  const amplitude = Math.max(0, Math.min(width * 0.3, width / 2 - edge));
  return Math.round(width / 2 + reach * amplitude);
}

/** Centros de los nodos de un tramo y su alto total (las filas de la lección actual son más altas). */
export function mapLayout(
  firstIndex: number,
  statuses: readonly LessonStatus[],
  width: number,
): { points: PathPoint[]; height: number } {
  let y = 0;
  const points = statuses.map((status, i): PathPoint => {
    const row = mapRowHeight(status);
    const x = mapNodeX(firstIndex + i, width, status);
    const point: PathPoint = { x, y: y + row / 2, side: x > width / 2 ? 'right' : 'left' };
    y += row;
    return point;
  });
  return { points, height: y };
}

/**
 * Espacio libre para el texto de un nodo (del lado contrario al nodo): desde el borde del contenedor
 * hasta `MAP_LABEL_GAP` antes del nodo.
 */
export function mapLabelBox(point: PathPoint, width: number, nodeSize: number) {
  const reach = nodeSize / 2 + MAP_LABEL_GAP;
  return point.side === 'left'
    ? { left: point.x + reach, right: 0 }
    : { left: 0, right: width - point.x + reach };
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
