import { BOT_CALIBRATION } from '../../shared/bots';
import type { ArcadeSentence } from '../../shared/arcade';
import type { RushWord } from '../../shared/wordRush';
import {
  ChallengeError,
  StaleRatingError,
  type BattleStore,
  type CourseInfo,
  type PlayerInfo,
  type RushPlayer,
  type SettlementContextRow,
  type SettlementPlayer,
} from '../src/types';

export const WORDS: RushWord[] = [
  { id: 'hello', text: 'hello', translationEs: 'hola', unitId: 'a1-u01' },
  { id: 'bye', text: 'goodbye', translationEs: 'adiós', unitId: 'a1-u01' },
  { id: 'thanks', text: 'thank you', translationEs: 'gracias', unitId: 'a1-u01' },
  { id: 'please', text: 'please', translationEs: 'por favor', unitId: 'a1-u02' },
  { id: 'yes', text: 'yes', translationEs: 'sí', unitId: 'a1-u02' },
  { id: 'water', text: 'water', translationEs: 'agua', unitId: 'a1-u02' },
];

/** Banco para Arcade: alcanza para Connect (≥ 8 palabras) y Sentence Rush (≥ 6 frases). */
export const ARCADE_WORDS: RushWord[] = [
  ...WORDS,
  { id: 'apple', text: 'apple', translationEs: 'manzana', unitId: 'a1-u02' },
  { id: 'house', text: 'house', translationEs: 'casa', unitId: 'a1-u02' },
  { id: 'dog', text: 'dog', translationEs: 'perro', unitId: 'a1-u02' },
  { id: 'cat', text: 'cat', translationEs: 'gato', unitId: 'a1-u02' },
];

const sentence = (id: string, text: string, translation: string): ArcadeSentence => ({
  id,
  tokens: text.replace(/[.!?]$/, '').split(' '),
  answer: text,
  acceptedAnswers: [],
  translation,
  unitId: 'a1-u01',
});

export const ARCADE_SENTENCES: ArcadeSentence[] = [
  sentence('s1', 'I went home yesterday.', 'Fui a casa ayer.'),
  sentence('s2', 'She is a student.', 'Ella es estudiante.'),
  sentence('s3', 'We like green tea.', 'Nos gusta el té verde.'),
  sentence('s4', 'My name is Sofía.', 'Me llamo Sofía.'),
  sentence('s5', 'The dog is very big.', 'El perro es muy grande.'),
  sentence('s6', 'They live in Rome.', 'Viven en Roma.'),
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

  /** Puntajes recientes de Word Rush por usuario (más nuevos primero), como los lee getPlayer. */
  recentScores = new Map<string, number[]>();
  /**
   * true: como start_bot_battle_v2 ANTES de la migración 20261228120000 (ELO sólo dentro del cupo).
   * false (por defecto): como después (la base respeta p_rated).
   */
  capRatedBotBattles = false;

  async getPlayer(userId: string) {
    const info = this.players.get(userId);
    if (!info) return null;
    const used = this.calibrationUsed.get(`${userId}:${info.languageCode}`) ?? 0;
    return {
      ...info,
      botCalibrationLeft: Math.max(0, BOT_CALIBRATION.ratedGames - used),
      recentScores: this.recentScores.get(userId) ?? [],
    };
  }

  /** Banco de palabras y frases (Arcade) que devuelve la "base". */
  words: RushWord[] = WORDS;
  sentences: ArcadeSentence[] = [];
  /** battle id → protocol_version guardada al empezar. */
  protocolOf = new Map<string, number>();

  /**
   * Ranked compartido: catálogo de cursos (public.courses). Vacío por defecto: el servidor juega como
   * antes de los cursos por idioma (todo el idioma, textos canónicos), y así los tests de siempre.
   */
  courseCatalog: CourseInfo[] = [];
  /** Palabras y frases por curso (loadWords/loadSentences con curso); sin entrada, las de siempre. */
  wordsByCourse = new Map<string, RushWord[]>();
  sentencesByCourse = new Map<string, ArcadeSentence[]>();
  /** Llamadas a loadWords: [idioma, curso]. */
  wordLoads: [string, string | null][] = [];

  async courses() {
    return this.courseCatalog;
  }

  async loadWords(languageCode = 'en', courseCode?: string | null) {
    this.wordLoads.push([languageCode, courseCode ?? null]);
    return (courseCode && this.wordsByCourse.get(courseCode)) || this.words;
  }

  async loadSentences(_languageCode = 'en', course?: CourseInfo | null) {
    return (course && this.sentencesByCourse.get(course.code)) || this.sentences;
  }

  /**
   * Modelo de rush_player_unit_ids (como en el servidor original): `unitsByUser` es lo que ve un
   * jugador con un cliente de nivel 0 (ruta de respaldo + desbloqueos) y `unitsByUserCompatible` lo que
   * ve con nivel ≥ 1 (su ruta asignada). Sin entrada: todas las unidades del banco (palabras y frases).
   */
  unitsByUser = new Map<string, string[]>();
  unitsByUserCompatible = new Map<string, string[]>();
  /** Llamadas a rushUnits: [idioma, jugadores]. */
  rushUnitCalls: [string, string[]][] = [];
  /** Llamadas a rushUnits con el nivel de cada jugador: [idioma, [usuario, nivel][]]. */
  rushApiCalls: [string, [string, number][]][] = [];

  /** Como rush_common_unit_ids: la intersección de lo que puede usar cada humano con su cliente. */
  async rushUnits(languageCode: string, players: readonly RushPlayer[]) {
    this.rushUnitCalls.push([languageCode, players.map((p) => p.userId)]);
    this.rushApiCalls.push([languageCode, players.map((p) => [p.userId, p.curriculumApi ?? 0])]);
    const all = [...new Set([...this.words, ...this.sentences].map((w) => w.unitId ?? ''))].filter(
      Boolean,
    );
    let common = new Set(all);
    for (const p of players) {
      const fallback = this.unitsByUser.get(p.userId) ?? all;
      const usable =
        (p.curriculumApi ?? 0) >= 1
          ? (this.unitsByUserCompatible.get(p.userId) ?? fallback)
          : fallback;
      const mine = new Set(usable);
      common = new Set([...common].filter((u) => mine.has(u)));
    }
    return common as ReadonlySet<string>;
  }

  async startBattle(
    battleId: string,
    _language: string,
    p1: string,
    p2: string,
    protocolVersion = 2,
  ) {
    if (this.failStart) throw new Error('db down');
    this.started.set(battleId, [p1, p2]);
    this.protocolOf.set(battleId, protocolVersion);
  }

  /** Partidas contra bots: id → [jugador, datos del bot]. */
  botBattles = new Map<
    string,
    { player: string; bot: { name: string; avatarId: string; rating: number } }
  >();

  /**
   * Como start_bot_battle_v2: ranked si se pide (con capRatedBotBattles, sólo dentro del cupo, como
   * antes de la migración); cuenta las partidas ranked contra bots (bot_calibration_used); idempotente.
   */
  async startBotBattle(
    battleId: string,
    language: string,
    player: string,
    bot: { name: string; avatarId: string; rating: number },
    rated: boolean,
    protocolVersion = 2,
  ) {
    if (this.failStart) throw new Error('db down');
    this.protocolOf.set(battleId, protocolVersion);
    const key = `${player}:${language}`;
    const limit = BOT_CALIBRATION.ratedGames;
    if (this.botBattles.has(battleId)) {
      return {
        rated: !this.unranked.has(battleId),
        calibration: { used: this.calibrationUsed.get(key) ?? 0, limit },
      };
    }
    const used = this.calibrationUsed.get(key) ?? 0;
    const isRanked = rated && (!this.capRatedBotBattles || used < limit);
    if (isRanked) this.calibrationUsed.set(key, used + 1);
    else this.unranked.add(battleId);
    this.botBattles.set(battleId, { player, bot });
    // El slot 2 no tiene usuario (como en start_bot_battle).
    this.started.set(battleId, [player, `bot-slot:${battleId}`]);
    return { rated: isRanked, calibration: { used: used + (isRanked ? 1 : 0), limit } };
  }

  /**
   * Desafíos a amigos, como friend_challenges + battle_server_challenge_host/_join y
   * start_friendly_battle: código → anfitrión, invitado (opcional), vencimiento y partida.
   */
  challenges = new Map<
    string,
    {
      host: string;
      invitee: string | null;
      expiresAt: number;
      battleId: string | null;
      language: string;
    }
  >();
  friendlyStarts: {
    battleId: string;
    code: string;
    host: string;
    guest: string;
    protocol: number;
  }[] = [];

  addChallenge(
    code: string,
    host: string,
    invitee: string | null = null,
    expiresAt = Date.now() + 120_000,
  ) {
    const language = this.players.get(host)?.languageCode ?? 'en';
    this.challenges.set(code, { host, invitee, expiresAt, battleId: null, language });
    return this;
  }

  async challengeHost(code: string, hostId: string) {
    const c = this.challenges.get(code);
    if (!c || c.host !== hostId) throw new ChallengeError('challenge_not_found');
    if (c.battleId) throw new ChallengeError('challenge_taken');
    if (c.expiresAt < Date.now()) throw new ChallengeError('challenge_expired');
    return { languageCode: c.language, inviteeId: c.invitee, expiresAt: c.expiresAt };
  }

  async challengeJoin(code: string, guestId: string) {
    const c = this.challenges.get(code);
    if (!c) throw new ChallengeError('challenge_not_found');
    if (c.battleId) throw new ChallengeError('challenge_taken');
    if (c.host === guestId) throw new ChallengeError('own_challenge');
    if (c.invitee && c.invitee !== guestId) throw new ChallengeError('challenge_not_found');
    if (c.expiresAt < Date.now()) throw new ChallengeError('challenge_expired');
    if ((this.players.get(guestId)?.languageCode ?? 'en') !== c.language) {
      throw new ChallengeError('language_mismatch');
    }
    return { hostId: c.host, languageCode: c.language };
  }

  async startFriendlyBattle(
    battleId: string,
    code: string,
    host: string,
    guest: string,
    protocol: number,
  ) {
    if (this.failStart) throw new Error('db down');
    const c = this.challenges.get(code);
    if (!c || c.host !== host) throw new ChallengeError('challenge_not_found');
    if (c.battleId && c.battleId !== battleId) throw new ChallengeError('challenge_taken');
    c.battleId = battleId;
    this.friendlyStarts.push({ battleId, code, host, guest, protocol });
    // Como start_friendly_battle: una partida sin ELO (is_ranked = false).
    this.started.set(battleId, [host, guest]);
    this.protocolOf.set(battleId, protocol);
    this.unranked.add(battleId);
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
