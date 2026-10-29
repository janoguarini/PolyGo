/** Aleatoriedad determinista (con semilla) para que mezclar opciones sea reproducible y testeable. */

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Generador mulberry32. */
export function seededRandom(seed: string): () => number {
  let a = hashString(seed);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: readonly T[], seed: string): T[] {
  const random = seededRandom(seed);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

/** Mezcla garantizando un orden distinto del original cuando es posible (p. ej. ordenar palabras). */
export function shuffleDifferent<T>(items: readonly T[], seed: string): T[] {
  if (items.length < 2) return [...items];
  for (let attempt = 0; attempt < 10; attempt++) {
    const result = shuffle(items, `${seed}:${attempt}`);
    if (result.some((item, i) => item !== items[i])) return result;
  }
  return [...items.slice(1), items[0]!];
}

/** UUID v4 para claves de idempotencia (no criptográfico, suficiente como identificador). */
export function uuid(): string {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID.bind(crypto) : null;
  if (random) return random();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
