/** Reloj inyectable: el servidor usa el real y los tests uno manual para controlar el tiempo. */
export interface Clock {
  now(): number;
  setTimeout(fn: () => void, ms: number): unknown;
  clearTimeout(handle: unknown): void;
}

export const systemClock: Clock = {
  now: () => Date.now(),
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (handle) => clearTimeout(handle as NodeJS.Timeout),
};

/** Reloj manual para tests: el tiempo sólo avanza con advance(). */
export class ManualClock implements Clock {
  private current: number;
  private nextId = 1;
  private timers = new Map<number, { at: number; fn: () => void }>();

  constructor(start = 1_000_000) {
    this.current = start;
  }

  now(): number {
    return this.current;
  }

  setTimeout(fn: () => void, ms: number): unknown {
    const id = this.nextId++;
    this.timers.set(id, { at: this.current + Math.max(0, ms), fn });
    return id;
  }

  clearTimeout(handle: unknown): void {
    this.timers.delete(handle as number);
  }

  /** Avanza el reloj ejecutando en orden los timers que vencen en el camino. */
  advance(ms: number): void {
    const target = this.current + ms;
    for (;;) {
      let next: [number, { at: number; fn: () => void }] | null = null;
      for (const entry of this.timers) {
        if (entry[1].at <= target && (!next || entry[1].at < next[1].at)) next = entry;
      }
      if (!next) break;
      this.timers.delete(next[0]);
      this.current = next[1].at;
      next[1].fn();
    }
    this.current = target;
  }
}
