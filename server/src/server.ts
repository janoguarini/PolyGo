import { randomInt, randomUUID } from 'node:crypto';
import { createServer, type Server as HttpServer } from 'node:http';

import { Server, type Socket } from 'socket.io';

import {
  MATCHMAKING,
  PROTOCOL_VERSION,
  WORD_RUSH,
  type Ack,
  type BattleMode,
  type ClientToServerEvents,
  type ErrorCode,
  type ServerToClientEvents,
} from '../../shared/protocol';
import { BOT_CONFIG, BOT_ID_PREFIX, pickBot } from '../../shared/bots';
import { generateQuestions, type RushWord } from '../../shared/wordRush';
import { Battle, type BattleHooks, type BattleRules, type Send } from './battle';
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
}

type IoSocket = Socket<ClientToServerEvents, ServerToClientEvents, object, { userId: string }>;

const cryptoRandom = () => randomInt(0, 2 ** 32) / 2 ** 32;

export interface BattleServer {
  http: HttpServer;
  io: Server<ClientToServerEvents, ServerToClientEvents, object, { userId: string }>;
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
    matchmaking = MATCHMAKING,
    tickMs = 1_000,
    random = cryptoRandom,
    wordCacheMs = 10 * 60_000,
    // Una persona responde a lo sumo unas pocas preguntas por segundo; 20 deja margen holgado.
    maxEventsPerSecond = 20,
    botAfterMs = BOT_CONFIG.afterMs,
  } = options;

  const sockets = new Map<string, IoSocket>();
  const battles = new Map<string, Battle>();
  const battleByUser = new Map<string, Battle>();
  const queued = new Map<string, PlayerInfo>();
  const matchmaker = new Matchmaker(matchmaking);
  const wordCache = new Map<string, { words: RushWord[]; loadedAt: number }>();

  const stats = () => ({ connected: sockets.size, queued: matchmaker.size, battles: battles.size });

  const http = createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true, protocolVersion: PROTOCOL_VERSION, ...stats() }));
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
      if (battle.mode !== 'ranked') return Promise.resolve();
      const human = battle.players.find((p) => !p.isBot)!;
      const bot = battle.players.find((p) => p.isBot);
      if (bot) {
        return store.startBotBattle(battle.id, battle.languageCode, human.userId, {
          name: bot.username,
          avatarId: bot.avatarId,
          rating: bot.rating,
        });
      }
      const [a, b] = battle.userIds;
      return store.startBattle(battle.id, battle.languageCode, a!, b!);
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
      logger.info('battle_settled', { battleId: battle.id, status, mode: battle.mode });
      for (const player of battle.players) {
        const slot = battle.finalLines().find((l) => l.info.userId === player.userId)!.slot;
        send(player.userId, 'battle:finish', {
          battleId: battle.id,
          mode: battle.mode,
          status,
          yourSlot: slot,
          players: settled.players,
          achievementsUnlocked: settled.achievements[player.userId] ?? [],
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

  async function createBattle(mode: BattleMode, players: PlayerInfo[]): Promise<Battle> {
    const languageCode = players[0]!.languageCode;
    const questions = generateQuestions(await wordsFor(languageCode), rules.questionCount, random);
    const battle = new Battle(
      randomUUID(),
      mode,
      languageCode,
      players,
      questions,
      clock,
      hooks,
      rules,
      random,
    );
    battles.set(battle.id, battle);
    for (const p of players) battleByUser.set(p.userId, battle);
    logger.info('battle_created', {
      battleId: battle.id,
      mode,
      players: players.map((p) => p.userId),
    });
    battle.begin();
    return battle;
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
      queued.delete(a.userId);
      queued.delete(b.userId);
      if (!infoA || !infoB) continue;
      createBattle('ranked', [infoA, infoB]).catch((err: unknown) => {
        logger.error('battle_create_failed', { err: String(err) });
        for (const info of [infoA, infoB]) {
          send(info.userId, 'server:error', { code: 'server_error' });
        }
      });
    }
    // Sin rival humano a tiempo: un bot a su altura (siempre identificado como BOT).
    if (botAfterMs !== null) {
      for (const entry of matchmaker.takeWaitingLongerThan(botAfterMs, now)) {
        const info = queued.get(entry.userId);
        queued.delete(entry.userId);
        if (!info) continue;
        const persona = pickBot(info.rating, random);
        const bot: PlayerInfo = {
          userId: `${BOT_ID_PREFIX}${randomUUID()}`,
          username: persona.name,
          avatarId: persona.avatarId,
          avatarPath: null,
          isBot: true,
          languageCode: info.languageCode,
          rating: persona.rating,
          gamesPlayed: BOT_CONFIG.displayedGames,
        };
        createBattle('ranked', [info, bot]).catch((err: unknown) => {
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
    if (auth.protocolVersion !== PROTOCOL_VERSION) return fail('protocol_mismatch');
    if (typeof auth.token !== 'string' || auth.token.length === 0) return fail('unauthorized');
    verifyToken(auth.token)
      .then((userId) => {
        if (!userId) return fail('unauthorized');
        socket.data.userId = userId;
        next();
      })
      .catch((err: unknown) => {
        logger.error('auth_failed', { err: String(err) });
        fail('server_error');
      });
  });

  io.on('connection', (socket: IoSocket) => {
    const userId = socket.data.userId;
    const previous = sockets.get(userId);
    sockets.set(userId, socket);
    // Una conexión por usuario: la nueva reemplaza a la anterior (p. ej. reconexión de red).
    if (previous) previous.disconnect(true);

    const battle = battleByUser.get(userId);
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
      if (mode !== 'ranked' && mode !== 'practice')
        return reply({ ok: false, code: 'invalid_payload' });
      if (battleByUser.has(userId)) return reply({ ok: false, code: 'already_in_battle' });

      store
        .getPlayer(userId)
        .then(async (info) => {
          if (!info) return reply({ ok: false, code: 'onboarding_required' });
          // Pudo haber empezado una partida mientras se leía el perfil.
          if (battleByUser.has(userId)) return reply({ ok: false, code: 'already_in_battle' });
          if (sockets.get(userId) !== socket) return;
          if (mode === 'practice') {
            matchmaker.leave(userId);
            queued.delete(userId);
            reply({ ok: true, data: { mode } });
            await createBattle('practice', [info]);
            return;
          }
          queued.set(userId, info);
          matchmaker.join({
            userId,
            languageCode: info.languageCode,
            rating: info.rating,
            joinedAt: clock.now(),
          });
          reply({ ok: true, data: { mode } });
          const entry = matchmaker.get(userId)!;
          send(userId, 'queue:status', {
            searching: true,
            window: matchmaker.windowFor(entry, clock.now()),
            waitedMs: clock.now() - entry.joinedAt,
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
      current.answer(userId, payload.questionIndex, payload.option, reply);
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
