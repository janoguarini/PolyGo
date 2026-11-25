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
import { ARCADE, generateChallenges, sentencePool, type ArcadeSentence } from '../../shared/arcade';
import { ArcadeBattle, type ArcadeRules } from './arcadeBattle';
import {
  Battle,
  type BattleHooks,
  type BattleOptions,
  type BattleRules,
  type Send,
} from './battle';
import { systemClock, type Clock } from './clock';
import { Matchmaker } from './matchmaking';
import { settleBattle } from './settlement';
import {
  consoleLogger,
  type BattleStore,
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
  /** Reglas de Arcade (protocolo 3); en tests se acortan. */
  arcadeRules?: ArcadeRules;
  matchmaking?: typeof MATCHMAKING;
  /** Cada cuánto se intenta emparejar y se informa la espera. */
  tickMs?: number;
  /** Fuente [0, 1) para las preguntas; por defecto criptográfica. */
  random?: () => number;
  wordCacheMs?: number;
  /** Eventos por segundo que acepta cada socket; el resto se descarta sin responder. */
  maxEventsPerSecond?: number;
  /** Espera sin rival humano antes de jugar contra un bot; null desactiva los bots. */
  botAfterMs?: number | null;
  /** Después del cupo de calibración, el bot de Ranked mueve el ELO (BOT_CALIBRATION). */
  botRatedAfterCalibration?: boolean;
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
  /** Para tests y /health. */
  stats(): { connected: number; queued: number; battles: number };
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
  } = options;

  const sockets = new Map<string, IoSocket>();
  const battles = new Map<string, Battle>();
  const battleByUser = new Map<string, Battle>();
  const queued = new Map<string, PlayerInfo>();
  /** Versión de protocolo de quien está en la cola (la del socket con que entró). */
  const queuedProtocol = new Map<string, number>();
  /** Última identidad de bot que vio cada jugador (para no repetirla en la partida siguiente). */
  const lastBotIdentity = new Map<string, string>();
  const matchmaker = new Matchmaker(matchmaking);
  const wordCache = new Map<string, { words: RushWord[]; loadedAt: number }>();
  const sentenceCache = new Map<string, { sentences: ArcadeSentence[]; loadedAt: number }>();

  const stats = () => ({ connected: sockets.size, queued: matchmaker.size, battles: battles.size });

  const http = createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify({
          ok: true,
          // La más nueva (como antes) y todas las que acepta.
          protocolVersion: ARCADE_PROTOCOL_VERSION,
          protocolVersions: SUPPORTED_PROTOCOL_VERSIONS,
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

  const hooks: BattleHooks = {
    send,
    onStart: (battle) => {
      // Práctica (sola o contra un bot): no se guarda.
      if (battle.mode !== 'ranked') return Promise.resolve();
      const human = battle.players.find((p) => !p.isBot)!;
      const bot = battle.players.find((p) => p.isBot);
      if (bot) {
        // Se pide con ELO si es de calibración o clasificatoria; la base tiene la última palabra (si
        // devuelve rated = false, la partida queda sin ELO: applyBotStart).
        return store.startBotBattle(
          battle.id,
          battle.languageCode,
          human.userId,
          { name: bot.username, avatarId: bot.avatarId, rating: bot.rating },
          battle.rating !== 'unrated',
          battle.protocolVersion,
        );
      }
      const [a, b] = battle.userIds;
      return store.startBattle(battle.id, battle.languageCode, a!, b!, battle.protocolVersion);
    },
    onFinish: (battle, status) => void finalize(battle, status),
    onCancel: (battle, reason) => {
      release(battle);
      logger.info('battle_cancelled', { battleId: battle.id, reason });
      // Si el inicio llegó a guardarse (o se está guardando), la fila se cierra como cancelada.
      if (battle.mode === 'ranked' && battle.persistence) {
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

  async function wordsFor(languageCode: string): Promise<RushWord[]> {
    const cached = wordCache.get(languageCode);
    if (cached && clock.now() - cached.loadedAt < wordCacheMs) return cached.words;
    const words = await store.loadWords(languageCode);
    wordCache.set(languageCode, { words, loadedAt: clock.now() });
    return words;
  }

  async function sentencesFor(languageCode: string): Promise<ArcadeSentence[]> {
    const cached = sentenceCache.get(languageCode);
    if (cached && clock.now() - cached.loadedAt < wordCacheMs) return cached.sentences;
    const sentences = await store.loadSentences(languageCode);
    sentenceCache.set(languageCode, { sentences, loadedAt: clock.now() });
    return sentences;
  }

  async function createBattle(
    mode: BattleMode,
    players: PlayerInfo[],
    options: BattleOptions = {},
    protocolVersion: number = WORD_RUSH_PROTOCOL_VERSION,
  ): Promise<Battle> {
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
    const words = (await wordsFor(languageCode)).filter((w) => inUnits(w.unitId));
    let battle: Battle;
    if (protocolVersion === ARCADE_PROTOCOL_VERSION) {
      // Arcade: la misma secuencia de desafíos para los dos. Las frases pasan por el mismo filtro de
      // unidades. Si el curso no tiene frases suficientes para su nivel, Sentence Rush queda fuera de la
      // rotación (nunca se inventan frases).
      const sentences = sentencePool(
        (await sentencesFor(languageCode)).filter((s) => inUnits(s.unitId)),
        languageCode,
        rating,
      );
      const challenges = generateChallenges(
        rushPool(words, rating),
        sentences,
        random,
        arcadeRules,
      );
      battle = new ArcadeBattle(
        randomUUID(),
        mode,
        languageCode,
        players,
        challenges,
        clock,
        hooks,
        random,
        options,
        arcadeRules,
      );
    } else {
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
      // Juega a la altura de lo que el jugador hace en Word Rush (shared/botPacing.ts); sin historial,
      // como siempre (por rating).
      botTargetScore: botTargetScore(info.recentScores, info.rating, random),
    };
  }

  // ---------- matchmaking ----------
  let tickHandle: unknown = null;
  let closed = false;
  const tick = () => {
    if (closed) return;
    const now = clock.now();
    for (const [a, b] of matchmaker.takePairs(now)) {
      const infoA = queued.get(a.userId);
      const infoB = queued.get(b.userId);
      // El matchmaker sólo empareja la misma versión de protocolo.
      const protocol = queuedProtocol.get(a.userId) ?? WORD_RUSH_PROTOCOL_VERSION;
      for (const id of [a.userId, b.userId]) {
        queued.delete(id);
        queuedProtocol.delete(id);
      }
      if (!infoA || !infoB) continue;
      createBattle('ranked', [infoA, infoB], {}, protocol).catch((err: unknown) => {
        logger.error('battle_create_failed', { err: String(err) });
        for (const info of [infoA, infoB]) {
          send(info.userId, 'server:error', { code: 'server_error' });
        }
      });
    }
    // Sin rival humano a tiempo: un bot a su altura. Los emparejamientos humanos de este mismo tick ya
    // salieron de la cola, así que tienen prioridad. Con cupo de calibración, partida de calibración;
    // sin cupo, clasificatoria (mueve el ELO) si botRatedAfterCalibration, o sin ELO si no. La base
    // tiene la última palabra en start_bot_battle_v2 (sin la migración 20261228120000, sólo da ELO
    // dentro del cupo y la partida queda sin ELO).
    if (botAfterMs !== null) {
      for (const entry of matchmaker.takeWaitingLongerThan(botAfterMs, now)) {
        const info = queued.get(entry.userId);
        const protocol = queuedProtocol.get(entry.userId) ?? WORD_RUSH_PROTOCOL_VERSION;
        queued.delete(entry.userId);
        queuedProtocol.delete(entry.userId);
        if (!info) continue;
        const left = info.botCalibrationLeft ?? 0;
        createBattle(
          'ranked',
          [info, makeBot(info)],
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
              : { rating: 'unrated', calibration: null },
          protocol,
        ).catch((err: unknown) => {
          logger.error('battle_create_failed', { err: String(err) });
          send(info.userId, 'server:error', { code: 'server_error' });
        });
      }
    }
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
    if (typeof version !== 'number' || !SUPPORTED_PROTOCOL_VERSIONS.includes(version)) {
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
    // Si estaba en la cola con otra versión, esa entrada ya no corresponde a esta conexión: se saca
    // (con la misma versión se conserva, como siempre: el cliente vuelve a entrar sin perder la espera).
    const queuedVersion = queuedProtocol.get(userId);
    if (queuedVersion !== undefined && queuedVersion !== protocolVersion) {
      matchmaker.leave(userId);
      queued.delete(userId);
      queuedProtocol.delete(userId);
    }

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

    socket.on('queue:join', (payload, ack) => {
      const reply = safe(ack);
      const mode = payload?.mode;
      if (mode !== 'ranked' && mode !== 'practice' && mode !== 'bot_practice')
        return reply({ ok: false, code: 'invalid_payload' });
      if (battleByUser.has(userId)) return reply({ ok: false, code: 'already_in_battle' });

      store
        .getPlayer(userId)
        .then(async (profile) => {
          if (!profile) return reply({ ok: false, code: 'onboarding_required' });
          // El nivel curricular es el de la conexión que entra a la cola (fase C.8).
          const info: PlayerInfo = { ...profile, curriculumApi: socket.data.curriculumApi };
          // Pudo haber empezado una partida mientras se leía el perfil.
          if (battleByUser.has(userId)) return reply({ ok: false, code: 'already_in_battle' });
          if (sockets.get(userId) !== socket) return;
          if (mode === 'practice' || mode === 'bot_practice') {
            matchmaker.leave(userId);
            queued.delete(userId);
            queuedProtocol.delete(userId);
            reply({ ok: true, data: { mode } });
            // Contra un bot sin ELO: no se guarda ni da recompensas.
            try {
              await createBattle(
                mode,
                mode === 'practice' ? [info] : [info, makeBot(info)],
                {},
                protocolVersion,
              );
            } catch (err) {
              // El ack ya salió con ok: sin este aviso el cliente se queda esperando la partida. Se
              // atrapa acá para que el catch de abajo no vuelva a responder (un solo aviso).
              logger.error('battle_create_failed', { userId, mode, err: String(err) });
              socket.emit('server:error', { code: 'server_error' });
            }
            return;
          }
          queued.set(userId, info);
          queuedProtocol.set(userId, protocolVersion);
          matchmaker.join({
            userId,
            languageCode: info.languageCode,
            rating: info.rating,
            joinedAt: clock.now(),
            protocolVersion,
          });
          reply({ ok: true, data: { mode } });
          const entry = matchmaker.get(userId)!;
          send(userId, 'queue:status', {
            searching: true,
            window: matchmaker.windowFor(entry, clock.now()),
            waitedMs: clock.now() - entry.joinedAt,
            botCalibrationLeft: info.botCalibrationLeft ?? 0,
          });
        })
        .catch((err: unknown) => {
          logger.error('queue_join_failed', { userId, err: String(err) });
          reply({ ok: false, code: 'server_error' });
        });
    });

    socket.on('queue:leave', (ack) => {
      matchmaker.leave(userId);
      queued.delete(userId);
      queuedProtocol.delete(userId);
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
      matchmaker.leave(userId);
      queued.delete(userId);
      queuedProtocol.delete(userId);
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
      await new Promise<void>((resolve) => {
        void io.close(() => resolve());
      });
    },
  };
}
