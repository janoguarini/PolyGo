import { MATCHMAKING } from '../../shared/protocol';

export interface QueueEntry {
  userId: string;
  languageCode: string;
  rating: number;
  joinedAt: number;
}

/**
 * Cola ranked por idioma (la versión de protocolo ya la filtra el handshake).
 * Ventana inicial ±100 ELO, +50 cada 5 s hasta ±400; dos jugadores se emparejan sólo si la
 * diferencia entra en la ventana de AMBOS, así quien recién entra no recibe un rival lejano.
 */
export class Matchmaker {
  private entries = new Map<string, QueueEntry>();

  constructor(private readonly config: typeof MATCHMAKING = MATCHMAKING) {}

  join(entry: QueueEntry): void {
    // Reentrar no reinicia la espera.
    const existing = this.entries.get(entry.userId);
    this.entries.set(entry.userId, existing ? { ...entry, joinedAt: existing.joinedAt } : entry);
  }

  leave(userId: string): boolean {
    return this.entries.delete(userId);
  }

  get(userId: string): QueueEntry | undefined {
    return this.entries.get(userId);
  }

  get size(): number {
    return this.entries.size;
  }

  windowFor(entry: QueueEntry, now: number): number {
    const steps = Math.floor(Math.max(0, now - entry.joinedAt) / this.config.widenEveryMs);
    return Math.min(this.config.maxWindow, this.config.initialWindow + steps * this.config.widenBy);
  }

  /** Empareja a los que más esperan primero con el rival más cercano. Saca de la cola a los emparejados. */
  takePairs(now: number): [QueueEntry, QueueEntry][] {
    const waiting = [...this.entries.values()].sort((a, b) => a.joinedAt - b.joinedAt);
    const taken = new Set<string>();
    const pairs: [QueueEntry, QueueEntry][] = [];

    for (const a of waiting) {
      if (taken.has(a.userId)) continue;
      let best: QueueEntry | null = null;
      for (const b of waiting) {
        if (b.userId === a.userId || taken.has(b.userId) || b.languageCode !== a.languageCode)
          continue;
        const diff = Math.abs(a.rating - b.rating);
        if (diff > Math.min(this.windowFor(a, now), this.windowFor(b, now))) continue;
        if (!best || diff < Math.abs(a.rating - best.rating)) best = b;
      }
      if (best) {
        taken.add(a.userId);
        taken.add(best.userId);
        pairs.push([a, best]);
      }
    }

    for (const id of taken) this.entries.delete(id);
    return pairs;
  }
}
