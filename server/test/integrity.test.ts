/**
 * Integridad competitiva (Fase 1): el cliente sólo dice qué eligió o escribió; puntos, tiempo,
 * resultado y ELO los decide el servidor. Cupo de calibración contra bots, partidas sin ELO,
 * preguntas para escribir y reglas por idioma.
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';

import { io as connect, type Socket } from 'socket.io-client';

import { BOT_CALIBRATION, BOT_CONFIG } from '../../shared/bots';
import {
  MAX_WRITTEN_ANSWER_LENGTH,
  PROTOCOL_VERSION,
  WORD_RUSH,
  type AnswerResult,
  type BattleFinish,
  type BattleSnapshot,
  type ClientToServerEvents,
  type QuestionView,
  type ServerToClientEvents,
} from '../../shared/protocol';
import { generateQuestions, withWriting, type RushWord } from '../../shared/wordRush';
import { Battle, type AnswerChoice, type BattleHooks } from '../src/battle';
import { ManualClock } from '../src/clock';
import { createBattleServer, type BattleServer } from '../src/server';
import { settleBattle } from '../src/settlement';
import { silentLogger, type PlayerInfo } from '../src/types';
import { FakeStore, WORDS, flush, player, seededRandom } from './helpers';

// ---------- motor (reloj manual) ----------

const WRITE_QUESTIONS = withWriting(generateQuestions(WORDS, 6, seededRandom(4)));

function setup(questions = WRITE_QUESTIONS, players = [player('alice'), player('bob')]) {
  const clock = new ManualClock();
  const sent: { userId: string; event: string; payload: unknown }[] = [];
  const hooks: BattleHooks = {
    send: (userId, event, ...args) => sent.push({ userId, event, payload: args[0] }),
    onStart: () => Promise.resolve(),
    onFinish: () => {},
    onCancel: () => {},
  };
  const battle = new Battle('b1', 'ranked', 'en', players, questions, clock, hooks);
  const answer = (userId: string, questionIndex: number, choice: AnswerChoice) => {
    let result: Parameters<Parameters<Battle['answer']>[3]>[0] | undefined;
    battle.answer(userId, questionIndex, choice, (r) => (result = r));
    return result!;
  };
  return { clock, sent, battle, answer };
}

async function startPlaying(s: ReturnType<typeof setup>) {
  s.battle.begin();
  for (const p of s.battle.players) if (!p.isBot) s.battle.markReady(p.userId);
  await flush();
  s.clock.advance(WORD_RUSH.countdownMs);
}

/** Ningún dato que el cliente vea antes de responder delata la respuesta. */
function assertNoAnswerLeak(payload: unknown) {
  const text = JSON.stringify(payload);
  assert.ok(!text.includes('correctOption'), `no manda correctOption: ${text}`);
  assert.ok(!text.includes('wordId'), 'no manda el id de la palabra');
}

test('el cliente no puede declarar puntaje: los campos extra se ignoran y el tope es por respuesta', async () => {
  const s = setup(generateQuestions(WORDS, 4, seededRandom(4)));
  await startPlaying(s);
  const q = WRITE_QUESTIONS[0]!;
  const forged = { option: q.correctOption, score: 99_999, correct: true, points: 5_000 };
  const res = s.answer('alice', 0, forged as AnswerChoice);
  assert.equal(res.ok, true);
  if (res.ok) {
    assert.ok(res.data.points <= WORD_RUSH.maxCorrectPoints);
    assert.ok(res.data.score <= WORD_RUSH.maxCorrectPoints);
  }
  // Responder dos veces la misma pregunta (o una adelantada) no suma.
  assert.deepEqual(s.answer('alice', 0, { option: 0 }), { ok: false, code: 'stale_question' });
  assert.deepEqual(s.answer('alice', 3, { option: 0 }), { ok: false, code: 'stale_question' });
  const line = s.battle.finalLines().find((l) => l.info.userId === 'alice')!;
  assert.equal(line.answered, 1);
});

test('las preguntas llegan sin la respuesta: ni en battle:question, ni en las fotos, ni en las de escribir', async () => {
  const s = setup();
  await startPlaying(s);
  for (let i = 0; i < WRITE_QUESTIONS.length; i++) {
    const q = WRITE_QUESTIONS[i]!;
    s.answer('alice', i, q.write ? { text: 'zzz' } : { option: (q.correctOption + 1) % 4 });
  }
  const views = s.sent.filter((x) => x.event === 'battle:question').map((x) => x.payload);
  assert.ok(views.length >= WRITE_QUESTIONS.length);
  for (const v of views) assertNoAnswerLeak(v);
  const writes = views.filter((v) => (v as QuestionView).kind === 'write') as QuestionView[];
  assert.ok(writes.length > 0, 'hay preguntas para escribir');
  for (const w of writes) assert.deepEqual(w.options, [], 'las de escribir van sin opciones');
  for (const snap of s.sent.filter(
    (x) => x.event === 'match:found' || x.event === 'battle:start',
  )) {
    assertNoAnswerLeak((snap.payload as BattleSnapshot).question);
  }
});

test('preguntas para escribir: el servidor corrige el texto, con más margen de tiempo, y valida el formato', async () => {
  const s = setup();
  await startPlaying(s);
  const writeIndex = WRITE_QUESTIONS.findIndex((q) => q.write);
  assert.equal(writeIndex, 2, 'la 3.ª pregunta es para escribir');
  for (let i = 0; i < writeIndex; i++) {
    s.answer('alice', i, { option: WRITE_QUESTIONS[i]!.correctOption });
  }
  const q = WRITE_QUESTIONS[writeIndex]!;
  // Formato equivocado: una opción en una de escribir, o un texto demasiado largo.
  assert.deepEqual(s.answer('alice', writeIndex, { option: 0 }), {
    ok: false,
    code: 'invalid_payload',
  });
  assert.deepEqual(
    s.answer('alice', writeIndex, { text: 'a'.repeat(MAX_WRITTEN_ANSWER_LENGTH + 1) }),
    { ok: false, code: 'invalid_payload' },
  );
  // 6 s: fuera de la ventana normal (5 s) pero dentro de la de escribir (10 s).
  s.clock.advance(6_000);
  const res = s.answer('alice', writeIndex, { text: `  ${q.options[0]!.toUpperCase()} ` });
  assert.equal(res.ok, true);
  const data = (res as { ok: true; data: AnswerResult }).data;
  assert.equal(data.correct, true, 'mayúsculas y espacios no importan');
  assert.equal(data.correctText, q.options[0]);
  assert.ok(data.points > WORD_RUSH.correctPoints, 'todavía tiene bonus de velocidad');
  // En una pregunta de opciones no vale mandar texto.
  assert.deepEqual(s.answer('alice', writeIndex + 1, { text: 'hello' }), {
    ok: false,
    code: 'invalid_payload',
  });
});

test('desde Oro el bot tarda el doble en las preguntas para escribir, y su guion nunca se manda', async () => {
  const bot: PlayerInfo = {
    ...player('bot:1', 1000),
    username: 'Kiko',
    isBot: true,
    gamesPlayed: BOT_CONFIG.displayedGames,
  };
  const botAnswered = async (writing: boolean) => {
    const plain = generateQuestions(WORDS, 40, seededRandom(4));
    const clock = new ManualClock();
    const sent: { userId: string; event: string }[] = [];
    const hooks: BattleHooks = {
      send: (userId, event, ..._args) => void sent.push({ userId, event }),
      onStart: () => Promise.resolve(),
      onFinish: () => {},
      onCancel: () => {},
    };
    const battle = new Battle(
      'b1',
      'ranked',
      'en',
      [player('alice'), bot],
      writing ? withWriting(plain) : plain,
      clock,
      hooks,
      WORD_RUSH,
      seededRandom(7),
    );
    battle.begin();
    battle.markReady('alice');
    clock.advance(BOT_CONFIG.readyMs.max);
    await flush();
    clock.advance(WORD_RUSH.countdownMs + WORD_RUSH.durationMs);
    // Al bot nunca se le mandan preguntas: "piensa" en el servidor con su habilidad.
    assert.ok(
      !sent.some((x) => x.userId === bot.userId && x.event === 'battle:question'),
      'al bot no se le mandan preguntas',
    );
    return battle.finalLines().find((l) => l.info.isBot)!.answered;
  };
  const plain = await botAnswered(false);
  const writing = await botAnswered(true);
  assert.ok(plain > 0);
  assert.ok(writing < plain, `con preguntas para escribir responde menos (${writing} < ${plain})`);
});

test('sin posicionar: perder no mueve el rating; ganar lo posiciona', async () => {
  const store = new FakeStore().add(player('nuevo', 100, 0, 0), player('rival', 110));
  const s = setup(generateQuestions(WORDS, 4, seededRandom(4)), [
    player('nuevo', 100, 0, 0),
    player('rival', 110),
  ]);
  await store.startBattle('b1', 'en', 'nuevo', 'rival');
  await startPlaying(s);
  s.answer('rival', 0, { option: WRITE_QUESTIONS[0]!.correctOption });
  s.clock.advance(WORD_RUSH.durationMs);
  const result = await settleBattle(store, s.battle, 'completed');
  const nuevo = result.players.find((p) => p.username === 'nuevo')!;
  assert.equal(nuevo.outcome, 'loss');
  assert.equal(nuevo.ratingAfter, 100, 'sin posicionar no pierde');
  assert.equal(nuevo.placedBefore, false);
  const rival = result.players.find((p) => p.username === 'rival')!;
  assert.ok(rival.ratingAfter! > 110);
  assert.equal(result.rating, 'competitive');
});

test('reliquidar la misma partida no duplica el ELO', async () => {
  const store = new FakeStore().add(player('alice'), player('bob'));
  const s = setup(generateQuestions(WORDS, 4, seededRandom(4)));
  await store.startBattle('b1', 'en', 'alice', 'bob');
  await startPlaying(s);
  s.answer('alice', 0, { option: WRITE_QUESTIONS[0]!.correctOption });
  s.clock.advance(WORD_RUSH.durationMs);
  const first = await settleBattle(store, s.battle, 'completed');
  const after = store.players.get('alice')!.rating;
  const second = await settleBattle(store, s.battle, 'completed');
  assert.equal(first.duplicate, false);
  assert.equal(second.duplicate, true);
  assert.equal(store.players.get('alice')!.rating, after);
  assert.equal(store.settled.size, 1);
  // La primera muestra el cambio real; la duplicada no inventa otro (sería aplicar el ELO dos veces).
  const alice1 = first.players.find((p) => p.username === 'alice')!;
  assert.equal(alice1.ratingAfter, after);
  assert.notEqual(alice1.ratingBefore, alice1.ratingAfter);
  for (const p of second.players) {
    assert.equal(p.ratingBefore, null);
    assert.equal(p.ratingAfter, null);
    assert.equal(p.placedBefore, undefined);
  }
});

test('un bot fuera del cupo que la base guardó como no ranked se cierra sin ELO', async () => {
  const store = new FakeStore().add(player('alice', 1000, 10));
  store.calibrationUsed.set('alice:en', BOT_CALIBRATION.ratedGames);
  const bot: PlayerInfo = { ...player('bot:1', 1000), username: 'Kiko', isBot: true };
  const s = setup(generateQuestions(WORDS, 4, seededRandom(4)), [player('alice', 1000, 10), bot]);
  s.battle.rating = 'calibration';
  const started = await store.startBotBattle(
    'b1',
    'en',
    'alice',
    { name: 'Kiko', avatarId: 'crown', rating: 1000 },
    true,
  );
  assert.equal(started.rated, false, 'la base no da más calibración');
  s.battle.applyBotStart(started);
  await startPlaying(s);
  s.clock.advance(WORD_RUSH.durationMs);
  const result = await settleBattle(store, s.battle, 'completed');
  assert.equal(result.rating, 'unrated');
  assert.equal(result.players[0]!.ratingAfter, null);
  assert.equal(store.players.get('alice')!.rating, 1000);
  assert.equal(store.players.get('alice')!.gamesPlayed, 10, 'no cuenta como partida competitiva');
});

// ---------- servidor completo ----------

type Client = Socket<ServerToClientEvents, ClientToServerEvents>;
let server: BattleServer;
let url: string;
let store: FakeStore;
const clients: Client[] = [];

const EMOJI_WORDS: RushWord[] = [
  { id: 'dog', text: 'dog', translationEs: 'perro', emoji: '🐶' },
  { id: 'cat', text: 'cat', translationEs: 'gato', emoji: '🐱' },
  { id: 'apple', text: 'apple', translationEs: 'manzana', emoji: '🍎' },
  { id: 'sun', text: 'sun', translationEs: 'sol', emoji: '☀️' },
  { id: 'car', text: 'car', translationEs: 'auto', emoji: '🚗' },
  { id: 'house', text: 'house', translationEs: 'casa', emoji: '🏠' },
];

class EmojiStore extends FakeStore {
  override async loadWords() {
    return EMOJI_WORDS;
  }
}

before(async () => {
  store = new EmojiStore().add(
    player('calib', 300, 0),
    player('zhgold', 1000, 10),
    player('engold', 1000, 10),
    player('quitter', 300, 0),
  );
  store.players.set('zhgold', { ...store.players.get('zhgold')!, languageCode: 'zh' });
  server = createBattleServer({
    store,
    verifyToken: async (token) => (token.startsWith('tok-') ? token.slice(4) : null),
    logger: silentLogger,
    rules: {
      ...WORD_RUSH,
      questionCount: 12,
      countdownMs: 30,
      durationMs: 600,
      readyTimeoutMs: 3_000,
    },
    tickMs: 20,
    random: seededRandom(21),
    botAfterMs: 100,
  });
  await new Promise<void>((resolve) => server.http.listen(0, resolve));
  url = `http://127.0.0.1:${(server.http.address() as AddressInfo).port}`;
});

after(async () => {
  for (const c of clients) c.disconnect();
  await server.close();
});

function client(userId: string): Client {
  const socket: Client = connect(url, {
    transports: ['websocket'],
    auth: { token: `tok-${userId}`, protocolVersion: PROTOCOL_VERSION },
    reconnection: false,
    forceNew: true,
  });
  clients.push(socket);
  return socket;
}

const connected = (socket: Client) =>
  new Promise<void>((resolve, reject) => {
    socket.once('connect', () => resolve());
    socket.once('connect_error', reject);
  });

function next<E extends keyof ServerToClientEvents>(
  socket: Client,
  event: E,
  timeoutMs = 5_000,
): Promise<Parameters<ServerToClientEvents[E]>[0]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout esperando ${event}`)), timeoutMs);
    // @ts-expect-error: el listener genérico recibe el payload del evento E.
    socket.once(event, (payload) => {
      clearTimeout(timer);
      resolve(payload);
    });
  });
}

/** Busca rival y juega la partida sin responder; devuelve la foto inicial y el resultado. */
async function playBotMatch(socket: Client, mode: 'ranked' | 'bot_practice' = 'ranked') {
  const found = next(socket, 'match:found');
  const finish = next(socket, 'battle:finish');
  socket.emit('queue:join', { mode }, () => {});
  const snap = (await found) as BattleSnapshot;
  socket.emit('match:ready', { battleId: snap.battleId }, () => {});
  return { snap, result: (await finish) as BattleFinish };
}

test('cupo de calibración: 3 partidas contra bots con ELO; después la cola sólo espera personas', async () => {
  const calib = client('calib');
  await connected(calib);
  for (let i = 1; i <= BOT_CALIBRATION.ratedGames; i++) {
    const { snap, result } = await playBotMatch(calib);
    assert.equal(snap.rating, 'calibration');
    assert.deepEqual(snap.calibration, { used: i, limit: BOT_CALIBRATION.ratedGames });
    assert.equal(result.rating, 'calibration');
    assert.notEqual(result.players.find((p) => p.slot === result.yourSlot)!.ratingBefore, null);
  }
  assert.equal(store.calibrationUsed.get('calib:en'), BOT_CALIBRATION.ratedGames);

  // Cupo agotado: no aparece un bot aunque espere; la cola le avisa que no le quedan.
  const status = next(calib, 'queue:status');
  calib.emit('queue:join', { mode: 'ranked' }, () => {});
  assert.equal((await status).botCalibrationLeft, 0);
  await new Promise((r) => setTimeout(r, 400));
  assert.equal(server.stats().battles, 0, 'sin bot competitivo fuera del cupo');
  assert.equal(server.stats().queued, 1);
  await calib.emitWithAck('queue:leave');
  calib.disconnect();
});

test('práctica contra bot: sin ELO, sin guardar nada y sin consumir cupo', async () => {
  const calib = client('calib');
  await connected(calib);
  const ratingBefore = store.players.get('calib')!.rating;
  const settledBefore = store.settled.size;
  const startedBefore = store.botBattles.size;
  const { snap, result } = await playBotMatch(calib, 'bot_practice');
  assert.equal(snap.mode, 'bot_practice');
  assert.equal(snap.rating, 'unrated');
  assert.equal(snap.players.find((p) => p.slot !== snap.yourSlot)!.isBot, true);
  assert.equal(result.rating, 'unrated');
  for (const p of result.players) assert.equal(p.ratingAfter, null);
  assert.equal(store.players.get('calib')!.rating, ratingBefore);
  assert.equal(store.settled.size, settledBefore, 'no se liquida en la base');
  assert.equal(store.botBattles.size, startedBefore, 'no se guarda la partida');
  calib.disconnect();
});

test('abandonar una calibración la consume; irse antes de empezar no', async () => {
  const quitter = client('quitter');
  await connected(quitter);
  // Se va antes de confirmar: la partida se cancela y no se guardó.
  const found = next(quitter, 'match:found');
  quitter.emit('queue:join', { mode: 'ranked' }, () => {});
  await found;
  const cancelled = next(quitter, 'battle:cancel');
  quitter.emit('battle:leave', () => {});
  assert.equal((await cancelled).reason, 'opponent_left');
  assert.equal(store.calibrationUsed.get('quitter:en') ?? 0, 0);

  // Ahora abandona en juego: derrota y el cupo se usa.
  const found2 = next(quitter, 'match:found');
  quitter.emit('queue:join', { mode: 'ranked' }, () => {});
  const snap = await found2;
  const started = next(quitter, 'battle:start');
  quitter.emit('match:ready', { battleId: snap.battleId }, () => {});
  await started;
  await new Promise((r) => setTimeout(r, 60));
  const finish = next(quitter, 'battle:finish');
  quitter.emit('battle:leave', () => {});
  const result = await finish;
  assert.equal(result.status, 'forfeited');
  assert.equal(store.calibrationUsed.get('quitter:en'), 1);
  quitter.disconnect();
});

/** Juega una práctica sola respondiendo todo y devuelve las preguntas que recibió. */
async function practiceQuestions(userId: string): Promise<QuestionView[]> {
  const socket = client(userId);
  await connected(socket);
  const seen: QuestionView[] = [];
  socket.on('battle:question', (q) => {
    seen.push(q);
    const word = EMOJI_WORDS.find((w) => w.text === q.prompt || w.translationEs === q.prompt);
    const payload =
      q.kind === 'write'
        ? { text: 'x' }
        : { option: Math.max(0, q.options.indexOf(word?.text ?? '')) };
    socket.emit(
      'battle:answer',
      { battleId: snapId, questionIndex: q.index, ...payload },
      () => {},
    );
  });
  let snapId = '';
  const start = next(socket, 'battle:start');
  const finish = next(socket, 'battle:finish');
  socket.emit('queue:join', { mode: 'practice' }, () => {});
  snapId = (await start).battleId;
  await finish;
  socket.disconnect();
  return seen;
}

test('reglas por idioma: desde Oro hay preguntas para escribir, salvo en chino; con imagen si el emoji es único', async () => {
  const en = await practiceQuestions('engold');
  const zh = await practiceQuestions('zhgold');
  assert.ok(
    en.some((q) => q.kind === 'write'),
    'inglés desde Oro escribe',
  );
  assert.ok(!zh.some((q) => q.kind === 'write'), 'chino nunca pide escribir');
  assert.ok(
    [...en, ...zh].some((q) => q.kind === 'image' && typeof q.emoji === 'string'),
    'las preguntas con imagen llegan con su emoji',
  );
  for (const q of [...en, ...zh]) assertNoAnswerLeak(q);
});
