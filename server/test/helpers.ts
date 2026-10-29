import type { RushWord } from '../../shared/wordRush';
import {
  StaleRatingError,
  type BattleStore,
  type PlayerInfo,
  type SettlementContextRow,
  type SettlementPlayer,
} from '../src/types';

export const WORDS: RushWord[] = [
  { id: 'hello', text: 'hello', translationEs: 'hola' },
  { id: 'bye', text: 'goodbye', translationEs: 'adiós' },
  { id: 'thanks', text: 'thank you', translationEs: 'gracias' },
  { id: 'please', text: 'please', translationEs: 'por favor' },
  { id: 'yes', text: 'yes', translationEs: 'sí' },
  { id: 'water', text: 'water', translationEs: 'agua' },
];

export function player(userId: string, rating = 1000, gamesPlayed = 0): PlayerInfo {
  return { userId, username: userId, avatarId: 'bolt', languageCode: 'en', rating, gamesPlayed };
}

/** Deja correr las promesas pendientes (p. ej. el guardado del inicio de partida). */
export const flush = () => new Promise<void>((resolve) => setImmediate(resolve));

export function seededRandom(seed = 1): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Store en memoria con la misma semántica que las funciones SQL (idempotencia, rating vigente). */
export class FakeStore implements BattleStore {
  players = new Map<string, PlayerInfo>();
  started = new Map<string, [string, string]>();
  settled = new Map<string, { status: string; players: SettlementPlayer[] }>();
  cancelled = new Set<string>();
  matchesInWindow = 1;
  failStart = false;
  /** Cuántas veces responder stale_rating antes de aceptar. */
  staleTimes = 0;
  settleCalls = 0;

  add(...infos: PlayerInfo[]): this {
    for (const info of infos) this.players.set(info.userId, info);
    return this;
  }

  async getPlayer(userId: string) {
    return this.players.get(userId) ?? null;
  }

  async loadWords() {
    return WORDS;
  }

  async startBattle(battleId: string, _language: string, p1: string, p2: string) {
    if (this.failStart) throw new Error('db down');
    this.started.set(battleId, [p1, p2]);
  }

  async settlementContext(battleId: string): Promise<SettlementContextRow[]> {
    const ids = this.started.get(battleId)!;
    return ids.map((id, i) => {
      const p = this.players.get(id);
      return {
        slot: (i + 1) as 1 | 2,
        userId: p ? id : null,
        rating: p?.rating ?? null,
        gamesPlayed: p?.gamesPlayed ?? null,
        matchesInWindow: this.matchesInWindow,
      };
    });
  }

  async settleBattle(
    battleId: string,
    status: 'completed' | 'forfeited',
    players: SettlementPlayer[],
  ) {
    this.settleCalls++;
    if (this.staleTimes > 0) {
      this.staleTimes--;
      // Simula que otra partida movió el rating entre la lectura y la escritura.
      const first = this.players.get(this.started.get(battleId)![0])!;
      this.players.set(first.userId, { ...first, rating: first.rating + 1 });
      throw new StaleRatingError();
    }
    if (this.settled.has(battleId) || this.cancelled.has(battleId)) {
      return { duplicate: true, achievements: {} };
    }
    this.settled.set(battleId, { status, players });
    const ids = this.started.get(battleId)!;
    const achievements: Record<string, { id: string; title: string; icon: string }[]> = {};
    players.forEach((p, i) => {
      const id = ids[i]!;
      const info = this.players.get(id);
      if (info && p.rating_after !== null) {
        this.players.set(id, {
          ...info,
          rating: p.rating_after,
          gamesPlayed: info.gamesPlayed + 1,
        });
      }
      achievements[id] =
        p.result === 'win' ? [{ id: 'first_win', title: 'Primera victoria', icon: 'swords' }] : [];
    });
    return { duplicate: false, achievements };
  }

  async cancelBattle(battleId: string) {
    this.cancelled.add(battleId);
  }

  async cancelStaleBattles() {
    return 0;
  }
}
