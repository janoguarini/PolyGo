import { randomInt, randomUUID } from 'node:crypto';
import { createServer, type Server as HttpServer } from 'node:http';

import { Server, type Socket } from 'socket.io';

import {
  MATCHMAKING,
  ARCADE_PROTOCOL_VERSION,
  SUPPORTED_PROTOCOL_VERSIONS,
  parseCurriculumApi,
  WORD_RUSH_PROTOCOL_VERSION,
  WORD_RUSH,
  type Ack,
  type BattleMode,
  type ClientToServerEvents,
  type ErrorCode,
  type ServerToClientEvents,
} from '../../shared/protocol';
import { pickBotIdentity } from '../../shared/botIdentities';
import { botTargetScore } from '../../shared/botPacing';
import { BOT_CALIBRATION, BOT_CONFIG, BOT_ID_PREFIX, pickBot } from '../../shared/bots';
import {
  generateQuestions,
  pictureEmojis,
  rushPool,
  withPictures,
  withWriting,
  writingEnabled,
  type RushWord,
} from '../../shared/wordRush';
import {
  ARCADE,
  RecentContentMemory,
  createChallengeStream,
  sentencePool,
  type ArcadeSentence,
} from '../../shared/arcade';
import { ArcadeBattle, type ArcadeRules } from './arcadeBattle';
import {
  Battle,
  type BattleHooks,
  type BattleOptions,
  type BattleRules,
  type Send,
} from './battle';
import { systemClock, type Clock } from './clock';
import { Matchmaker, type QueueEntry } from './matchmaking';
import { settleBattle } from './settlement';
import { canonicalCourse, seatCourse, withSentenceSupport, withWordSupport } from './sharedPool';
import {
  ChallengeError,
  consoleLogger,
  type BattleStore,
  type CourseInfo,
  type Logger,
  type PlayerInfo,
  type VerifyToken,
} from './types';

export interface BattleServerOptions {
  store: BattleStore;
  verifyToken: VerifyToken;
  clock?: Clock;
  logger?: Logger;
  rules?: BattleRules;
  /** Reglas de Word Rush (motor Arcade, protocolo 3); en tests se acortan. */
  arcadeRules?: ArcadeRules;
  matchmaking?: typeof MATCHMAKING;
  /** Cada cuánto se reintenta emparejar (ventanas que se amplían) y se informa la espera. */
  tickMs?: number;
  /** Fuente [0, 1) para los desafíos y los bots; por defecto criptográfica. */
  random?: () => number;
  wordCacheMs?: number;
  /** Eventos por segundo que acepta cada socket; el resto se descarta sin responder. */
  maxEventsPerSecond?: number;
  /** Espera sin rival humano antes de jugar contra un bot; null desactiva los bots. */
  botAfterMs?: number | null;
  /** Después del cupo de calibración, el bot de Ranked mueve el ELO (BOT_CALIBRATION). */
  botRatedAfterCalibration?: boolean;
  /**
   * Versiones de protocolo que acepta este servidor (subconjunto de SUPPORTED_PROTOCOL_VERSIONS). La
   * 2 (Word Rush clásico) sólo queda durante la transición a la build con el protocolo 3; quitarla es
   * el corte (index.ts lo lee de BATTLE_PROTOCOL_VERSIONS).
   */
  protocolVersions?: readonly number[];
  /** Memoria de contenido reciente (inyectable en tests). */
  recentContent?: RecentContentMemory;
}

/** Datos del socket tras el handshake: quién es y qué versión del protocolo habla. */
interface SocketData {
  userId: string;
  protocolVersion: number;
  /** Fase C.8: nivel curricular declarado en el handshake (0 si el cliente no lo declara). */
  curriculumApi: number;
}

type IoSocket = Socket<ClientToServerEvents, ServerToClientEvents, object, SocketData>;

const cryptoRandom = () => randomInt(0, 2 ** 32) / 2 ** 32;

export interface BattleServer {
  http: HttpServer;
  io: Server<ClientToServerEvents, ServerToClientEvents, object, SocketData>;
  close(): Promise<void>;
  /** Para tests y /health. `matching`: jugadores cuya partida se está creando. */
  stats(): {
    connected: number;
    queued: number;
    battles: number;
    matching: number;
    /** Anfitriones de desafíos a amigos esperando. */
    challenges: number;
  };
}

/** Anfitrión de un desafío esperando a su amigo (en memoria: si se desconecta, vuelve a registrarse). */
interface WaitingHost {
  code: string;
  info: PlayerInfo;
  protocol: number;
  timer: unknown;
}

/** Código de desafío: 6 letras o números (new_challenge_code). */
const CHALLENGE_CODE = /^[A-Z0-9]{6}$/;
const normalizeCode = (raw: unknown) => (typeof raw === 'string' ? raw.trim().toUpperCase() : '');

/** Un jugador cuya partida se está armando (lecturas de la base todavía en curso). */
interface PendingPlayer {
  mode: BattleMode;
  info: PlayerInfo;
  /** Entrada de cola original (ranked): para volver a la cola sin perder la espera. */
  entry: QueueEntry | null;
  protocol: number;
  /** Salió (queue:leave o reconexión con otra versión): su partida no se crea. */
  left: boolean;
}

export function createBattleServer(options: BattleServerOptions): BattleServer {
  const {
    store,
    verifyToken,
    clock = systemClock,
    logger = consoleLogger,
    rules = WORD_RUSH,
    arcadeRules = ARCADE,
    matchmaking = MATCHMAKING,
    tickMs = 1_000,
    random = cryptoRandom,
    wordCacheMs = 10 * 60_000,
    // Una persona responde a lo sumo unas pocas preguntas por segundo; 20 deja margen holgado.
    maxEventsPerSecond = 20,
    botAfterMs = BOT_CONFIG.afterMs,
    botRatedAfterCalibration = BOT_CALIBRATION.ratedAfterCalibration,
    protocolVersions = SUPPORTED_PROTOCOL_VERSIONS,
    recentContent = new RecentContentMemory(),
  } = options;

  const accepted = protocolVersions.filter((v) => SUPPORTED_PROTOCOL_VERSIONS.includes(v));
  if (accepted.length === 0) throw new Error('battle-server: ninguna versión de protocolo válida');

  const sockets = new Map<string, IoSocket>();
  const battles = new Map<string, Battle>();
  const battleByUser = new Map<string, Battle>();
  const queued = new Map<string, PlayerInfo>();
  /** Versión de protocolo de quien está en la cola (la del socket con que entró). */
  const queuedProtocol = new Map<string, number>();
  /** Última identidad de bot que vio cada jugador (para no repetirla en la partida siguiente). */
  const lastBotIdentity = new Map<string, string>();
  /** Temporizador del bot de cada jugador en la cola (vence a joinedAt + botAfterMs). */
  const botTimers = new Map<string, unknown>();
  /** Jugadores cuya partida se está creando: ni están en la cola ni tienen partida todavía. */
  const pending = new Map<string, PendingPlayer>();
  const matchmaker = new Matchmaker(matchmaking);
  const wordCache = new Map<string, { words: RushWord[]; loadedAt: number }>();
  const sentenceCache = new Map<string, { sentences: ArcadeSentence[]; loadedAt: number }>();
  /** Desafíos a amigos: código → anfitrión esperando, y anfitrión → su código. */
  const hostsByCode = new Map<string, WaitingHost>();
  const codeByHost = new Map<string, string>();

  /** El anfitrión deja de esperar (salió, se desconectó, venció o empezó la partida). */
  const stopHosting = (userId: string) => {
    const code = codeByHost.get(userId);
    if (code === undefined) return;
    codeByHost.delete(userId);
    const waiting = hostsByCode.get(code);
    if (waiting && waiting.info.userId === userId) {
      clock.clearTimeout(waiting.timer);
      hostsByCode.delete(code);
    }
  };

  const stats = () => ({
    connected: sockets.size,
    queued: matchmaker.size,
    battles: battles.size,
    matching: pending.size,
    challenges: hostsByCode.size,
  });
  const contentKey = (userId: string, languageCode: string) => `${userId}:${languageCode}`;

  const http = createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify({
          ok: true,
          // La más nueva que acepta (como antes) y todas las que acepta.
          protocolVersion: Math.max(...accepted),
          protocolVersions: accepted,
          ...stats(),
        }),
      );
      return;
    }
    res.writeHead(404).end();
  });

  // Sin cookies: la autenticación es el token del handshake, así que CORS abierto no expone nada.
  const io: BattleServer['io'] = new Server(http, {
    serveClient: false,
    cors: { origin: '*' },
    pingInterval: 10_000,
    pingTimeout: 8_000,
  });

  const send: Send = (userId, event, ...args) => {
    sockets.get(userId)?.emit(event, ...args);
  };

  const release = (battle: Battle) => {
    battles.delete(battle.id);
    for (const userId of battle.userIds) {
      if (battleByUser.get(userId) === battle) battleByUser.delete(userId);
    }
  };

  /** Lo que vio cada persona en una partida de Word Rush, para no repetírselo enseguida. */
  const rememberContent = (battle: Battle) => {
    if (!(battle instanceof ArcadeBattle)) return;
    for (const player of battle.players) {
      if (player.isBot) continue;
      recentContent.record(
        contentKey(player.userId, battle.languageCode),
        battle.seenBy(player.userId),
      );
    }
  };

  const hooks: BattleHooks = {
    send,
    onStart: (battle) => {
      // Amistoso: se guarda sin ELO y se ata al desafío (historial, misiones de amigos).
      if (battle.mode === 'friendly') {
        const [host, guest] = battle.userIds;
        return store.startFriendlyBattle(
          battle.id,
          battle.challengeCode!,
          host!,
          guest!,
          battle.protocolVersion,
        );
      }
      // Práctica (sola o contra un bot): no se guarda.
      if (battle.mode !== 'ranked') return Promise.resolve();
      const human = battle.players.find((p) => !p.isBot)!;
      const bot = battle.players.find((p) => p.isBot);
      if (bot) {
        // La base decide si todavía es de calibración (cupo por usuario e idioma).
        return store.startBotBattle(
          battle.id,
          battle.languageCode,
          human.userId,
          { name: bot.username, avatarId: bot.avatarId, rating: bot.rating },
          // Se pide con ELO si es de calibración o clasificatoria; la base tiene la última palabra (si
          // devuelve rated = false, la partida queda sin ELO: applyBotStart).
          battle.rating !== 'unrated',
          battle.protocolVersion,
        );
      }
      const [a, b] = battle.userIds;
      return store.startBattle(battle.id, battle.languageCode, a!, b!, battle.protocolVersion);
    },
    onFinish: (battle, status) => {
      rememberContent(battle);
      void finalize(battle, status);
    },
    onCancel: (battle, reason) => {
      release(battle);
      logger.info('battle_cancelled', { battleId: battle.id, reason });
      // Si el inicio llegó a guardarse (o se está guardando), la fila se cierra como cancelada.
      if ((battle.mode === 'ranked' || battle.mode === 'friendly') && battle.persistence) {
        battle.persistence
          .then(() => store.cancelBattle(battle.id))
          .catch((err: unknown) =>
            logger.error('cancel_failed', { battleId: battle.id, err: String(err) }),
          );
      }
    },
  };

  async function finalize(battle: Battle, status: 'completed' | 'forfeited') {
    try {
      const settled = await settleBattle(store, battle, status);
      logger.info('battle_settled', {
        battleId: battle.id,
        status,
        mode: battle.mode,
        rating: settled.rating,
        duplicate: settled.duplicate,
      });
      for (const player of battle.players) {
        if (player.isBot) continue;
        const slot = battle.finalLines().find((l) => l.info.userId === player.userId)!.slot;
        send(player.userId, 'battle:finish', {
          battleId: battle.id,
          mode: battle.mode,
          status,
          yourSlot: slot,
          players: settled.players,
          achievementsUnlocked: settled.achievements[player.userId] ?? [],
          rating: settled.rating,
          calibration: settled.calibration,
          ...(battle.mode === 'friendly' ? { friendly: true } : {}),
        });
      }
    } catch (err) {
      logger.error('settlement_failed', { battleId: battle.id, err: String(err) });
      await store.cancelBattle(battle.id).catch(() => {});
      for (const userId of battle.userIds) {
        send(userId, 'battle:cancel', { battleId: battle.id, reason: 'settlement_failed' });
      }
    } finally {
      release(battle);
    }
  }

  /** Sin curso (catálogo sin leer): como antes de los cursos por idioma, todo el idioma. */
  const cacheKey = (languageCode: string, course: CourseInfo | null) =>
    course ? `${languageCode}:${course.code}` : languageCode;

  async function wordsFor(
    languageCode: string,
    course: CourseInfo | null = null,
  ): Promise<RushWord[]> {
    const key = cacheKey(languageCode, course);
    const cached = wordCache.get(key);
    if (cached && clock.now() - cached.loadedAt < wordCacheMs) return cached.words;
    const words = course
      ? await store.loadWords(languageCode, course.code)
      : await store.loadWords(languageCode);
    wordCache.set(key, { words, loadedAt: clock.now() });
    return words;
  }

  async function sentencesFor(
    languageCode: string,
    course: CourseInfo | null = null,
  ): Promise<ArcadeSentence[]> {
    const key = cacheKey(languageCode, course);
    const cached = sentenceCache.get(key);
    if (cached && clock.now() - cached.loadedAt < wordCacheMs) return cached.sentences;
    const sentences = course
      ? await store.loadSentences(languageCode, course)
      : await store.loadSentences(languageCode);
    sentenceCache.set(key, { sentences, loadedAt: clock.now() });
    return sentences;
  }

  /**
   * Ranked compartido: catálogo de cursos (cacheado como el contenido). Si no se puede leer, null: la
   * partida se arma como antes de los cursos por idioma (todo el idioma, textos canónicos).
   */
  let courseCache: { courses: CourseInfo[]; loadedAt: number } | null = null;
  async function courseCatalog(): Promise<CourseInfo[] | null> {
    if (courseCache && clock.now() - courseCache.loadedAt < wordCacheMs) return courseCache.courses;
    try {
      const courses = await store.courses();
      courseCache = { courses, loadedAt: clock.now() };
      return courses;
    } catch (err) {
      logger.warn('courses_unavailable', { err: String((err as Error)?.message ?? err) });
      return null;
    }
  }

  /** Lo que falta en un curso de apoyo (el asiento ve el texto canónico): se registra, no se bloquea. */
  function logMissingSupport(
    languageCode: string,
    course: string,
    kind: 'words' | 'sentences',
    missing: readonly string[],
  ) {
    if (missing.length === 0) return;
    logger.warn('shared_pool_support_missing', {
      languageCode,
      course,
      kind,
      count: missing.length,
      sample: missing.slice(0, 10),
    });
  }

  /**
   * Arma y anuncia una partida. Las lecturas de la base son asíncronas: si mientras tanto alguien se fue
   * (`aborted()`), la partida no se crea y devuelve null (nadie recibe match:found).
   */
  async function createBattle(
    mode: BattleMode,
    players: PlayerInfo[],
    options: BattleOptions = {},
    protocolVersion: number = WORD_RUSH_PROTOCOL_VERSION,
    aborted: () => boolean = () => false,
  ): Promise<Battle | null> {
    const languageCode = players[0]!.languageCode;
    // Contenido según el rango del jugador con menos rating (lo humano; el bot tiene el rating del
    // jugador ± 40). Mismas reglas que shared/wordRush.ts y shared/arcade.ts.
    const humans = players.filter((p) => !p.isBot);
    const rating = Math.min(...humans.map((p) => p.rating));
    // Fases C.7/C.8: sólo el contenido de las unidades que pueden usar TODOS los humanos, cada uno con
    // el nivel curricular de su cliente (public.rush_common_unit_ids; el bot no cuenta). Si la base no
    // da el conjunto, esto lanza y la partida no se crea: nunca «todas las palabras».
    const units = await store.rushUnits(
      languageCode,
      humans.map((p) => ({ userId: p.userId, curriculumApi: p.curriculumApi ?? 0 })),
    );
    const inUnits = (unitId: string | null | undefined) => unitId != null && units.has(unitId);
    // Ranked compartido (docs/RANKED_SHARED_POOL.md): el contenido sale siempre del curso canónico del
    // idioma (rush_common_unit_ids devuelve sus unidades), igual para todos los asientos. Los asientos de
    // otro curso del mismo idioma reciben además sus textos de apoyo (support). Una partida de un solo
    // curso canónico no lleva support: todo queda como siempre.
    const catalog = await courseCatalog();
    const canonical = canonicalCourse(catalog, languageCode);
    const seats = players.map((p) => ({ player: p, course: seatCourse(catalog, languageCode, p) }));
    const foreign = [
      ...new Map(
        seats.flatMap((s) => (s.course ? [[s.course.code, s.course] as const] : [])),
      ).values(),
    ];
    // Lo que cada asiento ve sale de su `courseCode` (ArcadeBattle): null = textos canónicos.
    players = seats.map(({ player: p, course }) =>
      p.isBot || (p.courseCode ?? null) === (course?.code ?? null)
        ? p
        : { ...p, courseCode: course?.code ?? null },
    );
    let words = (await wordsFor(languageCode, canonical)).filter((w) => inUnits(w.unitId));
    let battle: Battle;
    if (protocolVersion === ARCADE_PROTOCOL_VERSION) {
      let canonicalSentences = (await sentencesFor(languageCode, canonical)).filter((s) =>
        inUnits(s.unitId),
      );
      for (const course of foreign) {
        const w = withWordSupport(words, course.code, await wordsFor(languageCode, course));
        words = w.words;
        logMissingSupport(languageCode, course.code, 'words', w.missing);
        const s = withSentenceSupport(
          canonicalSentences,
          course.code,
          await sentencesFor(languageCode, course),
        );
        canonicalSentences = s.sentences;
        // Sólo las que pueden salir (nivel, fichas, conectores): el resto no importa.
        logMissingSupport(
          languageCode,
          course.code,
          'sentences',
          sentencePool(
            canonicalSentences.filter((x) => s.missing.includes(x.id)),
            languageCode,
            rating,
          ).map((x) => x.id),
        );
      }
      // Word Rush: la misma secuencia para todos, como flujo continuo. Las frases pasan por el mismo
      // filtro de unidades; sin frases suficientes, Sentence Rush queda fuera (nunca se inventan).
      const sentences = sentencePool(canonicalSentences, languageCode, rating);
      if (aborted()) return null;
      const stream = createChallengeStream(
        rushPool(words, rating),
        sentences,
        random,
        arcadeRules,
        {
          recent: recentContent.recentFor(humans.map((p) => contentKey(p.userId, languageCode))),
        },
      );
      battle = new ArcadeBattle(
        randomUUID(),
        mode,
        languageCode,
        players,
        stream,
        clock,
        hooks,
        random,
        options,
        arcadeRules,
      );
    } else {
      // Protocolo 2 (Word Rush clásico de 75 s): sólo para las builds anteriores, hasta el corte.
      if (aborted()) return null;
      let questions = generateQuestions(rushPool(words, rating), rules.questionCount, random);
      if (writingEnabled(rating, languageCode)) questions = withWriting(questions);
      questions = withPictures(questions, pictureEmojis(words));
      battle = new Battle(
        randomUUID(),
        mode,
        languageCode,
        players,
        questions,
        clock,
        hooks,
        rules,
        random,
        options,
      );
    }
    battles.set(battle.id, battle);
    for (const p of players) battleByUser.set(p.userId, battle);
    logger.info('battle_created', {
      battleId: battle.id,
      mode,
      rating: battle.rating,
      languageCode,
      protocolVersion: battle.protocolVersion,
      players: players.map((p) => p.userId),
    });
    battle.begin();
    return battle;
  }

  /**
   * Un bot a la altura del jugador (shared/bots.ts) con una identidad del catálogo
   * (shared/botIdentities.ts): sólo cambia el nombre que se muestra; rating y dificultad siguen saliendo
   * de pickBot. El avatarId sigue siendo uno de los zorros de BOT_AVATARS (lo que acepta la base en
   * start_bot_battle_v2); el cliente dibuja el avatar, el marco y el fondo de la identidad por su nombre.
   */
  function makeBot(info: PlayerInfo): PlayerInfo {
    const persona = pickBot(info.rating, random);
    const identity = pickBotIdentity(random, {
      previousId: lastBotIdentity.get(info.userId),
      playerAvatarId: info.avatarId,
    });
    lastBotIdentity.set(info.userId, identity.id);
    return {
      userId: `${BOT_ID_PREFIX}${randomUUID()}`,
      username: identity.name,
      avatarId: persona.avatarId,
      avatarPath: null,
      isBot: true,
      languageCode: info.languageCode,
      rating: persona.rating,
      gamesPlayed: BOT_CONFIG.displayedGames,
      // Juega a la altura de lo que el jugador hace en Word Rush, ajustado por su rango
      // (shared/botPacing.ts); sin historial, como siempre (por rating).
      botTargetScore: botTargetScore(info.recentScores, info.rating, random),
    };
  }

  // ---------- cola ----------

  function clearBotTimer(userId: string) {
    const handle = botTimers.get(userId);
    if (handle !== undefined) clock.clearTimeout(handle);
    botTimers.delete(userId);
  }

  function dequeue(userId: string) {
    matchmaker.leave(userId);
    queued.delete(userId);
    queuedProtocol.delete(userId);
    clearBotTimer(userId);
  }

  /** Entra (o vuelve) a la cola. Conserva la espera si ya estaba; el bot vence a joinedAt + botAfterMs. */
  function enqueue(info: PlayerInfo, protocol: number, joinedAt: number) {
    queued.set(info.userId, info);
    queuedProtocol.set(info.userId, protocol);
    matchmaker.join({
      userId: info.userId,
      languageCode: info.languageCode,
      rating: info.rating,
      joinedAt,
      protocolVersion: protocol,
    });
    clearBotTimer(info.userId);
    if (botAfterMs !== null) {
      const entry = matchmaker.get(info.userId)!;
      const wait = Math.max(0, entry.joinedAt + botAfterMs - clock.now());
      botTimers.set(
        info.userId,
        clock.setTimeout(() => {
          botTimers.delete(info.userId);
          runMatching();
        }, wait),
      );
    }
  }

  /**
   * Un pase de emparejamiento. Primero personas (también quien llegó justo al vencer el plazo de otro);
   * después, a quien esperó botAfterMs sin rival compatible, un bot. Es síncrono: un mismo jugador no
   * puede quedar en dos partidas, porque sale de la cola antes de que se arme cualquiera de ellas.
   */
  function runMatching() {
    if (closed) return;
    const now = clock.now();
    for (const pair of matchmaker.takePairs(now)) launch(pair, false);
    if (botAfterMs !== null) {
      for (const entry of matchmaker.takeWaitingLongerThan(botAfterMs, now)) launch([entry], true);
    }
  }

  /** Saca de la cola a los emparejados y arma su partida (contra un bot si `withBot`). */
  function launch(entries: QueueEntry[], withBot: boolean) {
    const members: PendingPlayer[] = [];
    for (const entry of entries) {
      const info = queued.get(entry.userId);
      const protocol = queuedProtocol.get(entry.userId) ?? WORD_RUSH_PROTOCOL_VERSION;
      dequeue(entry.userId);
      if (!info) continue;
      members.push({ mode: 'ranked', info, entry, protocol, left: false });
    }
    if (members.length !== entries.length) {
      // No debería pasar (cola y datos van juntos): quien quedó, vuelve a la cola con su espera.
      for (const m of members) enqueue(m.info, m.protocol, m.entry!.joinedAt);
      return;
    }
    const players = withBot
      ? [members[0]!.info, makeBot(members[0]!.info)]
      : members.map((m) => m.info);
    let options: BattleOptions = {};
    if (withBot) {
      // Con cupo de calibración, partida de calibración. Sin cupo, igual se juega en seguida (nadie
      // queda esperando): clasificatoria (mueve el ELO) si botRatedAfterCalibration, o sin ELO si no.
      // La base tiene la última palabra en start_bot_battle_v2 (sin la migración 20261228120000, sólo
      // da ELO dentro del cupo y la partida queda sin ELO).
      const left = members[0]!.info.botCalibrationLeft ?? 0;
      options =
        left > 0
          ? {
              rating: 'calibration',
              calibration: {
                used: BOT_CALIBRATION.ratedGames - left + 1,
                limit: BOT_CALIBRATION.ratedGames,
              },
            }
          : botRatedAfterCalibration
            ? { rating: 'competitive', calibration: null }
            : { rating: 'unrated', calibration: null };
    }
    void startPending(members, 'ranked', players, options, members[0]!.protocol);
  }

  /**
   * Crea la partida de `members` registrándolos como pendientes mientras se leen los datos. Si alguno se
   * fue o se desconectó en ese lapso, la partida no se crea y los demás vuelven a la cola con su espera.
   */
  async function startPending(
    members: PendingPlayer[],
    mode: BattleMode,
    players: PlayerInfo[],
    options: BattleOptions,
    protocol: number,
  ): Promise<void> {
    for (const m of members) pending.set(m.info.userId, m);
    const gone = (m: PendingPlayer) => m.left || !sockets.has(m.info.userId) || closed;
    let battle: Battle | null = null;
    try {
      battle = await createBattle(mode, players, options, protocol, () => members.some(gone));
    } catch (err) {
      // Error (p. ej. la base no dio las unidades): se avisa y NO se vuelve a la cola, porque volver a
      // emparejar fallaría igual (sería un bucle). El cliente muestra el error y puede reintentar.
      logger.error('battle_create_failed', { mode, err: String(err) });
      for (const m of members) {
        if (!gone(m)) send(m.info.userId, 'server:error', { code: 'server_error' });
      }
      return;
    } finally {
      for (const m of members) {
        if (pending.get(m.info.userId) === m) pending.delete(m.info.userId);
      }
    }
    if (!battle && mode === 'friendly') {
      // Uno de los dos se fue mientras se armaba: al otro se le avisa (no hay cola a la que volver).
      for (const m of members) {
        if (!gone(m)) send(m.info.userId, 'server:error', { code: 'host_gone' });
      }
      return;
    }
    if (battle || mode !== 'ranked') return;
    // No se creó porque alguien se fue: los que siguen buscando vuelven con su espera original.
    let requeued = false;
    for (const m of members) {
      if (gone(m) || battleByUser.has(m.info.userId) || pending.has(m.info.userId)) continue;
      if (!m.entry || matchmaker.get(m.info.userId)) continue;
      enqueue(m.info, m.protocol, m.entry.joinedAt);
      requeued = true;
    }
    if (requeued) runMatching();
  }

  // ---------- tick ----------
  let tickHandle: unknown = null;
  let closed = false;
  const tick = () => {
    if (closed) return;
    // Las ventanas de ELO se amplían con la espera: se reintenta periódicamente.
    runMatching();
    const now = clock.now();
    for (const userId of queued.keys()) {
      const entry = matchmaker.get(userId);
      if (!entry) continue;
      send(userId, 'queue:status', {
        searching: true,
        window: matchmaker.windowFor(entry, now),
        waitedMs: now - entry.joinedAt,
        botCalibrationLeft: queued.get(userId)?.botCalibrationLeft ?? 0,
      });
    }
    tickHandle = clock.setTimeout(tick, tickMs);
  };
  tickHandle = clock.setTimeout(tick, tickMs);

  // ---------- conexiones ----------
  io.use((socket, next) => {
    const auth = (socket.handshake.auth ?? {}) as Record<string, unknown>;
    const fail = (code: ErrorCode) => {
      const error = new Error(code) as Error & { data?: unknown };
      error.data = { code };
      next(error);
    };
    const version = auth.protocolVersion;
    if (typeof version !== 'number' || !accepted.includes(version)) {
      return fail('protocol_mismatch');
    }
    if (typeof auth.token !== 'string' || auth.token.length === 0) return fail('unauthorized');
    verifyToken(auth.token)
      .then((userId) => {
        if (!userId) return fail('unauthorized');
        // Una partida en curso sólo la retoma un cliente de su misma versión de protocolo (Word Rush 2,
        // Arcade 3): si no, se rechaza ANTES de reemplazar la conexión que la está jugando.
        const ongoing = battleByUser.get(userId);
        if (ongoing && ongoing.protocolVersion !== version) return fail('protocol_mismatch');
        socket.data.userId = userId;
        socket.data.protocolVersion = version;
        socket.data.curriculumApi = parseCurriculumApi(auth.curriculumApi);
        next();
      })
      .catch((err: unknown) => {
        logger.error('auth_failed', { err: String(err) });
        fail('server_error');
      });
  });

  io.on('connection', (socket: IoSocket) => {
    const userId = socket.data.userId;
    const protocolVersion = socket.data.protocolVersion;
    // La partida pudo crearse entre el handshake y este punto: misma regla que en io.use, sin tocar la
    // conexión que la está jugando.
    const battle = battleByUser.get(userId);
    if (battle && battle.protocolVersion !== protocolVersion) {
      socket.emit('server:error', { code: 'protocol_mismatch' });
      socket.disconnect(true);
      return;
    }
    const previous = sockets.get(userId);
    sockets.set(userId, socket);
    // Una conexión por usuario: la nueva reemplaza a la anterior (p. ej. reconexión de red).
    if (previous) previous.disconnect(true);
    // Si estaba en la cola (o armando partida) con otra versión, eso ya no corresponde a esta conexión
    // (con la misma versión se conserva: el cliente vuelve a entrar sin perder la espera).
    const queuedVersion = queuedProtocol.get(userId);
    if (queuedVersion !== undefined && queuedVersion !== protocolVersion) dequeue(userId);
    const waiting = pending.get(userId);
    if (waiting && waiting.protocol !== protocolVersion) waiting.left = true;

    if (battle) battle.reconnect(userId);

    // Rate limit por socket (ventana fija de 1 s): protege la base de reintentos en bucle.
    let windowStart = clock.now();
    let eventsInWindow = 0;
    let warned = false;
    socket.use((_packet, next) => {
      const now = clock.now();
      if (now - windowStart >= 1_000) {
        windowStart = now;
        eventsInWindow = 0;
      }
      if (++eventsInWindow <= maxEventsPerSecond) return next();
      if (!warned) logger.warn('rate_limited', { userId });
      warned = true;
    });

    const safe = <T>(ack: Ack<T> | undefined): Ack<T> =>
      typeof ack === 'function' ? ack : () => {};

    /**
     * Si ya hay una partida armándose para este usuario: pedir lo mismo otra vez (p. ej. el cliente
     * reingresa a la cola al reconectarse) se acepta sin crear otra; pedir otra cosa, no.
     */
    const pendingConflict = (mode: BattleMode): 'same' | 'other' | null => {
      const current = pending.get(userId);
      if (!current || current.left) return null;
      return current.mode === mode && current.protocol === protocolVersion ? 'same' : 'other';
    };

    socket.on('queue:join', (payload, ack) => {
      const reply = safe(ack);
      const mode = payload?.mode;
      if (mode !== 'ranked' && mode !== 'practice' && mode !== 'bot_practice')
        return reply({ ok: false, code: 'invalid_payload' });
      if (battleByUser.has(userId)) return reply({ ok: false, code: 'already_in_battle' });
      const conflict = pendingConflict(mode);
      if (conflict === 'same') return reply({ ok: true, data: { mode } });
      if (conflict === 'other') return reply({ ok: false, code: 'already_in_battle' });

      store
        .getPlayer(userId)
        .then(async (profile) => {
          if (!profile) return reply({ ok: false, code: 'onboarding_required' });
          // El nivel curricular es el de la conexión que entra a la cola (fase C.8).
          const info: PlayerInfo = { ...profile, curriculumApi: socket.data.curriculumApi };
          // Pudo haber empezado (o estar armándose) una partida mientras se leía el perfil.
          if (battleByUser.has(userId)) return reply({ ok: false, code: 'already_in_battle' });
          if (sockets.get(userId) !== socket) return;
          const late = pendingConflict(mode);
          if (late === 'same') return reply({ ok: true, data: { mode } });
          if (late === 'other') return reply({ ok: false, code: 'already_in_battle' });

          if (mode === 'practice' || mode === 'bot_practice') {
            dequeue(userId);
            reply({ ok: true, data: { mode } });
            // Sin ELO: no se guarda ni da recompensas. El ack ya salió con ok: si falla, server:error.
            const member: PendingPlayer = {
              mode,
              info,
              entry: null,
              protocol: protocolVersion,
              left: false,
            };
            await startPending(
              [member],
              mode,
              mode === 'practice' ? [info] : [info, makeBot(info)],
              {},
              protocolVersion,
            );
            return;
          }
          // Reentrar no reinicia la espera (Matchmaker.join conserva joinedAt).
          enqueue(info, protocolVersion, clock.now());
          reply({ ok: true, data: { mode } });
          const entry = matchmaker.get(userId)!;
          send(userId, 'queue:status', {
            searching: true,
            window: matchmaker.windowFor(entry, clock.now()),
            waitedMs: clock.now() - entry.joinedAt,
            botCalibrationLeft: info.botCalibrationLeft ?? 0,
          });
          // Si ya hay un rival compatible esperando, se empareja ahora (sin esperar al tick).
          runMatching();
        })
        .catch((err: unknown) => {
          logger.error('queue_join_failed', { userId, err: String(err) });
          reply({ ok: false, code: 'server_error' });
        });
    });

    // ---------- desafíos a amigos (amistoso = la misma partida que Ranked, sin ELO) ----------

    /** Validaciones comunes; devuelve el código o responde el error. */
    const challengeCodeOf = (
      payload: { code?: unknown } | undefined,
      reply: Ack<{ code: string }>,
    ): string | null => {
      const code = normalizeCode(payload?.code);
      if (!CHALLENGE_CODE.test(code)) {
        reply({ ok: false, code: 'invalid_payload' });
        return null;
      }
      // Sólo con el motor de Ranked (Arcade): una build vieja juega sus amistosos por la base.
      if (protocolVersion !== ARCADE_PROTOCOL_VERSION) {
        reply({ ok: false, code: 'protocol_mismatch' });
        return null;
      }
      if (battleByUser.has(userId) || pending.has(userId)) {
        reply({ ok: false, code: 'already_in_battle' });
        return null;
      }
      return code;
    };

    const challengeFailed = (reply: Ack<{ code: string }>, err: unknown) => {
      if (err instanceof ChallengeError) return reply({ ok: false, code: err.code });
      logger.error('challenge_failed', { userId, err: String(err) });
      reply({ ok: false, code: 'server_error' });
    };

    socket.on('challenge:host', (payload, ack) => {
      const reply = safe(ack);
      const code = challengeCodeOf(payload, reply);
      if (!code) return;
      void (async () => {
        try {
          const profile = await store.getPlayer(userId);
          if (!profile) return reply({ ok: false, code: 'onboarding_required' });
          const challenge = await store.challengeHost(code, userId);
          if (sockets.get(userId) !== socket) return;
          dequeue(userId);
          stopHosting(userId);
          const waiting: WaitingHost = {
            code,
            info: { ...profile, curriculumApi: socket.data.curriculumApi },
            protocol: protocolVersion,
            timer: null,
          };
          waiting.timer = clock.setTimeout(
            () => {
              if (hostsByCode.get(code) !== waiting) return;
              stopHosting(userId);
              send(userId, 'server:error', { code: 'challenge_expired' });
            },
            Math.max(0, challenge.expiresAt - clock.now()),
          );
          hostsByCode.set(code, waiting);
          codeByHost.set(userId, code);
          reply({ ok: true, data: { code } });
        } catch (err) {
          challengeFailed(reply, err);
        }
      })();
    });

    socket.on('challenge:join', (payload, ack) => {
      const reply = safe(ack);
      const code = challengeCodeOf(payload, reply);
      if (!code) return;
      void (async () => {
        try {
          const profile = await store.getPlayer(userId);
          if (!profile) return reply({ ok: false, code: 'onboarding_required' });
          const challenge = await store.challengeJoin(code, userId);
          const host = hostsByCode.get(code);
          // El anfitrión tiene que estar esperando ahora mismo (si cerró la app, ya no hay duelo).
          if (
            !host ||
            host.info.userId !== challenge.hostId ||
            !sockets.has(host.info.userId) ||
            battleByUser.has(host.info.userId)
          ) {
            return reply({ ok: false, code: 'host_gone' });
          }
          if (sockets.get(userId) !== socket || battleByUser.has(userId)) return;
          stopHosting(host.info.userId);
          dequeue(userId);
          reply({ ok: true, data: { code } });
          const guest: PlayerInfo = { ...profile, curriculumApi: socket.data.curriculumApi };
          const members: PendingPlayer[] = [
            {
              mode: 'friendly',
              info: host.info,
              entry: null,
              protocol: host.protocol,
              left: false,
            },
            { mode: 'friendly', info: guest, entry: null, protocol: protocolVersion, left: false },
          ];
          await startPending(
            members,
            'friendly',
            [host.info, guest],
            { rating: 'unrated', calibration: null, challengeCode: code },
            ARCADE_PROTOCOL_VERSION,
          );
        } catch (err) {
          challengeFailed(reply, err);
        }
      })();
    });

    socket.on('queue:leave', (ack) => {
      stopHosting(userId);
      dequeue(userId);
      const waiting = pending.get(userId);
      if (waiting) waiting.left = true;
      safe(ack)({ ok: true, data: null });
    });

    socket.on('match:ready', (payload, ack) => {
      const reply = safe(ack);
      const current = battleByUser.get(userId);
      if (!current || current.id !== payload?.battleId)
        return reply({ ok: false, code: 'not_in_battle' });
      if (!current.markReady(userId)) return reply({ ok: false, code: 'stale_question' });
      reply({ ok: true, data: null });
    });

    socket.on('battle:answer', (payload, ack) => {
      const reply = safe(ack);
      const current = battleByUser.get(userId);
      if (!current || current.id !== payload?.battleId)
        return reply({ ok: false, code: 'not_in_battle' });
      // Sólo se toma qué eligió o escribió: puntos, tiempo y resultado los calcula el servidor.
      current.answer(
        userId,
        payload.questionIndex,
        { option: payload.option, text: payload.text },
        reply,
      );
    });

    socket.on('arcade:answer', (payload, ack) => {
      const reply = safe(ack);
      const current = battleByUser.get(userId);
      if (!(current instanceof ArcadeBattle) || current.id !== payload?.battleId)
        return reply({ ok: false, code: 'not_in_battle' });
      // Sólo qué hizo en qué desafío: tiempo, corrección, combo, Frenesí y puntos los decide el servidor.
      current.arcadeAnswer(userId, payload.challengeIndex, payload.answer, reply);
    });

    socket.on('battle:leave', (ack) => {
      const current = battleByUser.get(userId);
      if (!current) return safe(ack)({ ok: false, code: 'not_in_battle' });
      current.leave(userId);
      safe(ack)({ ok: true, data: null });
    });

    socket.on('battle:sync', (ack) => {
      const current = battleByUser.get(userId);
      safe(ack)({ ok: true, data: current ? current.snapshot(userId) : null });
    });

    socket.on('disconnect', () => {
      if (sockets.get(userId) !== socket) return;
      sockets.delete(userId);
      dequeue(userId);
      // El anfitrión que se desconecta deja de esperar; al reconectarse, la app vuelve a registrarse.
      stopHosting(userId);
      // Una partida que se está armando para este usuario no se crea si no vuelve antes (ver gone()).
      battleByUser.get(userId)?.disconnect(userId);
    });
  });

  return {
    http,
    io,
    stats,
    close: async () => {
      closed = true;
      if (tickHandle !== null) clock.clearTimeout(tickHandle);
      for (const userId of [...botTimers.keys()]) clearBotTimer(userId);
      await new Promise<void>((resolve) => {
        void io.close(() => resolve());
      });
    },
  };
}
