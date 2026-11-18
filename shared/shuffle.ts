/**
 * `polygo.shuffle.v1`: la mezcla con semilla que usa la app para ordenar las opciones
 * (src/features/learning/random.ts, `shuffle`), congelada como algoritmo versionado
 * (docs/EXERCISE_ITEM_VERSIONS_PENDING.md, §5). FNV-1a de 32 bits sobre las unidades UTF-16 de la
 * semilla, generador mulberry32 y Fisher–Yates desde el final.
 *
 * Es sólo un metadato de la presentación: la fuente de verdad es el orden registrado
 * (`exercise_presentations.option_order`), no la semilla ni el algoritmo. Un cambio de
 * comportamiento es `polygo.shuffle.v2` (fila nueva en `ref_shuffle_algorithms`), nunca una edición de
 * esta función: shared/__tests__/shuffle.test.ts congela sus salidas y su equivalencia con la app.
 */

export const SHUFFLE_V1 = 'polygo.shuffle.v1';

function fnv1a(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: string): () => number {
  let a = fnv1a(seed);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Orden que muestra `polygo.shuffle.v1` para `n` elementos: `order[k]` es el índice (en el conjunto)
 * del elemento que queda en la posición `k`. `shuffle(items, seed)` de la app es
 * `shuffleOrderV1(items.length, seed).map((i) => items[i])`.
 */
export function shuffleOrderV1(n: number, seed: string): number[] {
  if (!Number.isInteger(n) || n < 0) throw new Error(`shuffleOrderV1: n inválido (${n})`);
  const random = mulberry32(seed);
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  return order;
}

/** Semilla con la que la app mezcla las opciones de un ejercicio (AnswerInput.tsx, ChoiceInput). */
export const choiceSeed = (sessionId: string, exerciseId: string) => `${sessionId}:${exerciseId}`;
