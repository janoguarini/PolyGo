import { BOT_CALIBRATION } from '../../shared/bots';
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

/** Jugador posicionado por defecto (1 victoria); con wins = 0 está sin posicionar. */
export function player(userId: string, rating = 1000, gamesPlayed = 0, wins = 1): PlayerInfo {
  return {
    userId,
    username: userId,
    avatarId: 'bolt',
    languageCode: 'en',
    rating,
    gamesPlayed,
    wins,
  };
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

  /** Partidas de calibración contra bots usadas por usuario:idioma (como bot_calibration_used). */
  calibrationUsed = new Map<string, number>();
  /** Partidas guardadas como no ranked (bot fuera del cupo). */
  unranked = new Set<string>();

  async getPlayer(userId: string) {
    const info = this.players.get(userId);
    if (!info) return null;
    const used = this.calibrationUsed.get(`${userId}:${info.languageCode}`) ?? 0;
    return { ...info, botCalibrationLeft: Math.max(0, BOT_CALIBRATION.ratedGames - used) };
  }

  async loadWords() {
    return WORDS;
  }

  async startBattle(battleId: string, _language: string, p1: string, p2: string) {
    if (this.failStart) throw new Error('db down');
    this.started.set(battleId, [p1, p2]);
  }

  /** Partidas contra bots: id → [jugador, datos del bot]. */
  botBattles = new Map<
    string,
    { player: string; bot: { name: string; avatarId: string; rating: number } }
  >();

  /** Como start_bot_battle_v2: la calibración sólo si queda cupo; idempotente por id. */
  async startBotBattle(
    battleId: string,
    language: string,
    player: string,
    bot: { name: string; avatarId: string; rating: number },
    rated: boolean,
  ) {
    if (this.failStart) throw new Error('db down');
    const key = `${player}:${language}`;
    const limit = BOT_CALIBRATION.ratedGames;
    if (this.botBattles.has(battleId)) {
      return {
        rated: !this.unranked.has(battleId),
        calibration: { used: this.calibrationUsed.get(key) ?? 0, limit },
      };
    }
    const used = this.calibrationUsed.get(key) ?? 0;
    const isRanked = rated && used < limit;
    if (isRanked) this.calibrationUsed.set(key, used + 1);
    else this.unranked.add(battleId);
    this.botBattles.set(battleId, { player, bot });
    // El slot 2 no tiene usuario (como en start_bot_battle).
    this.started.set(battleId, [player, `bot-slot:${battleId}`]);
    return { rated: isRanked, calibration: { used: used + (isRanked ? 1 : 0), limit } };
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
        wins: p ? (p.wins ?? 0) : null,
        matchesInWindow: this.matchesInWindow,
        isRanked: !this.unranked.has(battleId),
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
    // No ranked: resultado guardado, sin rating ni logros (settle_battle).
    if (this.unranked.has(battleId)) return { duplicate: false, achievements: {} };
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
          wins: (info.wins ?? 0) + (p.result === 'win' ? 1 : 0),
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
