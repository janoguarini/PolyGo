import assert from 'node:assert/strict';
import { test } from 'node:test';

import { WORD_RUSH, type AnswerResult, type QuestionView } from '../../shared/protocol';
import { generateQuestions } from '../../shared/wordRush';
import { Battle, type BattleHooks } from '../src/battle';
import { ManualClock } from '../src/clock';
import { settleBattle } from '../src/settlement';
import { FakeStore, WORDS, flush, player, seededRandom } from './helpers';

const QUESTIONS = generateQuestions(WORDS, 5, seededRandom(4));

function setup({ mode = 'ranked' as 'ranked' | 'practice', failStart = false } = {}) {
  const clock = new ManualClock();
  const sent: { userId: string; event: string; payload: unknown }[] = [];
  const finished: string[] = [];
  const cancelled: string[] = [];
  const hooks: BattleHooks = {
    send: (userId, event, ...args) => sent.push({ userId, event, payload: args[0] }),
    onStart: () => (failStart ? Promise.reject(new Error('db')) : Promise.resolve()),
    onFinish: (_b, status) => finished.push(status),
    onCancel: (_b, reason) => cancelled.push(reason),
  };
  const players = mode === 'practice' ? [player('alice')] : [player('alice'), player('bob', 1050)];
  const battle = new Battle('b1', mode, 'en', players, QUESTIONS, clock, hooks);
  const last = (userId: string, event: string) =>
    [...sent].reverse().find((s) => s.userId === userId && s.event === event)?.payload;
  const answer = (userId: string, questionIndex: number, option: number) => {
    let result: Parameters<Parameters<Battle['answer']>[3]>[0] | undefined;
    battle.answer(userId, questionIndex, option, (r) => (result = r));
    return result!;
  };
  const correctOf = (i: number) => QUESTIONS[i]!.correctOption;
  const wrongOf = (i: number) => (QUESTIONS[i]!.correctOption + 1) % QUESTIONS[i]!.options.length;
  return { clock, sent, finished, cancelled, battle, last, answer, correctOf, wrongOf };
}

async function startPlaying(s: ReturnType<typeof setup>) {
  s.battle.begin();
  s.battle.markReady('alice');
  s.battle.markReady('bob');
  await flush();
  s.clock.advance(WORD_RUSH.countdownMs);
}

test('anuncia la partida a ambos con fecha límite para confirmar', () => {
  const s = setup();
  s.battle.begin();
  const found = s.last('alice', 'match:found') as { readyDeadline: number; players: unknown[] };
  assert.equal(found.readyDeadline, s.clock.now() + WORD_RUSH.readyTimeoutMs);
  assert.equal(found.players.length, 2);
  assert.ok(s.last('bob', 'match:found'));
  assert.equal(s.battle.status, 'matched');
});

test('si alguien no confirma en 10 s se cancela sin ELO', () => {
  const s = setup();
  s.battle.begin();
  s.battle.markReady('alice');
  s.clock.advance(WORD_RUSH.readyTimeoutMs);
  assert.equal(s.battle.status, 'cancelled');
  assert.deepEqual(s.cancelled, ['ready_timeout']);
  assert.deepEqual(s.finished, []);
  assert.ok(s.last('alice', 'battle:cancel'));
});

test('con ambos listos: cuenta atrás y luego la primera pregunta, sin la respuesta', async () => {
  const s = setup();
  s.battle.begin();
  s.battle.markReady('alice');
  s.battle.markReady('bob');
  await flush();
  assert.equal(s.battle.status, 'ready');
  const start = s.last('alice', 'battle:start') as { startsAt: number; endsAt: number };
  assert.equal(start.endsAt - start.startsAt, WORD_RUSH.durationMs);
  assert.equal(s.last('alice', 'battle:question'), undefined, 'no hay preguntas antes de empezar');

  s.clock.advance(WORD_RUSH.countdownMs);
  assert.equal(s.battle.status, 'in_progress');
  const q = s.last('alice', 'battle:question') as QuestionView;
  assert.equal(q.index, 0);
  assert.deepEqual(q.options, QUESTIONS[0]!.options);
  assert.equal('correctOption' in q, false);
  assert.deepEqual(s.last('bob', 'battle:question'), q, 'misma pregunta para ambos');
});

test('si falla el guardado del inicio, se cancela', async () => {
  const s = setup({ failStart: true });
  s.battle.begin();
  s.battle.markReady('alice');
  s.battle.markReady('bob');
  await flush();
  assert.equal(s.battle.status, 'cancelled');
  assert.deepEqual(s.cancelled, ['server_error']);
});

test('puntuación autoritativa: velocidad, penalización, piso 0 y avance de preguntas', async () => {
  const s = setup();
  await startPlaying(s);

  const wrong = s.answer('alice', 0, s.wrongOf(0));
  assert.deepEqual(wrong, {
    ok: true,
    data: {
      questionIndex: 0,
      correct: false,
      correctOption: s.correctOf(0),
      points: -50,
      score: 0,
    },
  });

  s.clock.advance(2_500);
  const right = s.answer('alice', 1, s.correctOf(1)) as { ok: true; data: AnswerResult };
  assert.equal(right.data.points, 125);
  assert.equal(right.data.score, 125);
  assert.equal((s.last('alice', 'battle:question') as QuestionView).index, 2);

  const scores = s.last('bob', 'battle:score') as { scores: { slot: number; score: number }[] };
  assert.equal(scores.scores.find((l) => l.slot === 1)!.score, 125, 'el rival ve el puntaje');
});

test('respuestas duplicadas, adelantadas o inválidas se ignoran', async () => {
  const s = setup();
  await startPlaying(s);
  assert.equal(s.answer('alice', 0, s.correctOf(0)).ok, true);
  assert.deepEqual(s.answer('alice', 0, s.correctOf(0)), { ok: false, code: 'stale_question' });
  assert.deepEqual(s.answer('alice', 5, 0), { ok: false, code: 'stale_question' });
  assert.deepEqual(s.answer('alice', 1, 9), { ok: false, code: 'invalid_payload' });
  assert.deepEqual(s.answer('alice', 1.5 as number, 0), { ok: false, code: 'invalid_payload' });
  assert.deepEqual(s.answer('mallory', 1, 0), { ok: false, code: 'not_in_battle' });
  const line = s.battle.finalLines()[0]!;
  assert.equal(line.answered, 1);
});

test('no se puede responder antes de empezar ni después del final', async () => {
  const s = setup();
  s.battle.begin();
  assert.deepEqual(s.answer('alice', 0, 0), { ok: false, code: 'stale_question' });
  s.battle.markReady('alice');
  s.battle.markReady('bob');
  await flush();
  s.clock.advance(WORD_RUSH.countdownMs + WORD_RUSH.durationMs);
  assert.equal(s.battle.status, 'completed');
  assert.deepEqual(s.finished, ['completed']);
  assert.deepEqual(s.answer('alice', 0, 0), { ok: false, code: 'battle_over' });
});

test('termina antes si ambos responden todas las preguntas', async () => {
  const s = setup();
  await startPlaying(s);
  for (let i = 0; i < QUESTIONS.length; i++) {
    s.answer('alice', i, s.correctOf(i));
    s.answer('bob', i, s.wrongOf(i));
  }
  assert.equal(s.battle.status, 'completed');
  assert.deepEqual(s.finished, ['completed']);
});

test('reconexión dentro de 15 s: sigue la partida y el reloj no se detiene', async () => {
  const s = setup();
  await startPlaying(s);
  const endsAt = s.battle.endsAt;
  s.battle.disconnect('bob');
  assert.equal(s.battle.status, 'reconnecting');
  const status = s.last('alice', 'battle:opponent_status') as {
    connected: boolean;
    graceEndsAt: number;
  };
  assert.equal(status.connected, false);
  assert.equal(status.graceEndsAt, s.clock.now() + WORD_RUSH.reconnectGraceMs);

  // Mientras tanto alice puede seguir jugando.
  assert.equal(s.answer('alice', 0, s.correctOf(0)).ok, true);

  s.clock.advance(10_000);
  s.battle.reconnect('bob');
  assert.equal(s.battle.status, 'in_progress');
  const state = s.last('bob', 'battle:state') as { endsAt: number; question: QuestionView };
  assert.equal(state.endsAt, endsAt);
  assert.equal(state.question.index, 0);
  s.clock.advance(WORD_RUSH.reconnectGraceMs);
  assert.equal(s.battle.status, 'in_progress', 'el timer de gracia se canceló');
});

test('sin volver en 15 s: abandono y derrota de quien se fue', async () => {
  const s = setup();
  await startPlaying(s);
  s.answer('bob', 0, s.correctOf(0));
  s.battle.disconnect('bob');
  s.clock.advance(WORD_RUSH.reconnectGraceMs);
  assert.equal(s.battle.status, 'forfeited');
  assert.deepEqual(s.finished, ['forfeited']);
  const lines = s.battle.finalLines();
  assert.equal(lines[1]!.forfeited, true);
  assert.equal(lines[0]!.forfeited, false);
});

test('si el tiempo se agota mientras alguien reconecta, termina normal', async () => {
  const s = setup();
  await startPlaying(s);
  s.clock.advance(WORD_RUSH.durationMs - 5_000);
  s.battle.disconnect('alice');
  s.clock.advance(5_000);
  assert.equal(s.battle.status, 'completed');
  assert.equal(s.battle.finalLines()[0]!.forfeited, false);
});

test('abandonar antes de empezar cancela; en juego es derrota inmediata', async () => {
  const before = setup();
  before.battle.begin();
  before.battle.leave('alice');
  assert.equal(before.battle.status, 'cancelled');
  assert.deepEqual(before.cancelled, ['opponent_left']);

  const during = setup();
  await startPlaying(during);
  during.battle.leave('alice');
  assert.equal(during.battle.status, 'forfeited');
  assert.equal(during.battle.finalLines()[0]!.forfeited, true);
});

test('desconectarse durante la cuenta atrás cancela', async () => {
  const s = setup();
  s.battle.begin();
  s.battle.markReady('alice');
  s.battle.markReady('bob');
  await flush();
  s.battle.disconnect('alice');
  assert.equal(s.battle.status, 'cancelled');
  s.clock.advance(WORD_RUSH.countdownMs);
  assert.equal(s.battle.status, 'cancelled', 'no arranca después');
});

test('práctica: arranca sola, sin confirmación, y termina sin rival', async () => {
  const s = setup({ mode: 'practice' });
  s.battle.begin();
  await flush();
  assert.equal(s.last('alice', 'match:found'), undefined);
  assert.ok(s.last('alice', 'battle:start'));
  s.clock.advance(WORD_RUSH.countdownMs);
  for (let i = 0; i < QUESTIONS.length; i++) s.answer('alice', i, s.correctOf(i));
  assert.equal(s.battle.status, 'completed');
});

test('práctica: salir o perder la conexión en juego la termina (nunca queda colgada)', async () => {
  for (const action of ['leave', 'disconnect'] as const) {
    const s = setup({ mode: 'practice' });
    s.battle.begin();
    await flush();
    s.clock.advance(WORD_RUSH.countdownMs);
    s.battle[action]('alice');
    assert.equal(s.battle.status, 'completed', action);
    assert.deepEqual(s.finished, ['completed']);
  }
});

test('liquidación: usa el ELO compartido y reintenta si el rating cambió', async () => {
  const s = setup();
  await startPlaying(s);
  s.answer('alice', 0, s.correctOf(0));
  s.clock.advance(WORD_RUSH.durationMs);

  const store = new FakeStore().add(player('alice'), player('bob', 1050));
  store.started.set('b1', ['alice', 'bob']);
  store.staleTimes = 1;
  const result = await settleBattle(store, s.battle, 'completed');
  assert.equal(store.settleCalls, 2);
  const [alice, bob] = result.players;
  assert.equal(alice!.outcome, 'win');
  assert.equal(bob!.outcome, 'loss');
  assert.equal(alice!.ratingBefore, 1001, 'usó el rating fresco tras el reintento');
  assert.ok(alice!.ratingAfter! > 1001);
  assert.ok(bob!.ratingAfter! < 1050);
  assert.deepEqual(
    result.achievements.alice!.map((a) => a.id),
    ['first_win'],
  );
});

test('liquidación: se rinde tras varios stale seguidos', async () => {
  const s = setup();
  await startPlaying(s);
  s.clock.advance(WORD_RUSH.durationMs);
  const store = new FakeStore().add(player('alice'), player('bob'));
  store.started.set('b1', ['alice', 'bob']);
  store.staleTimes = 5;
  await assert.rejects(settleBattle(store, s.battle, 'completed'), /stale_rating/);
  assert.equal(store.settleCalls, 3);
});

test('liquidación de práctica: no toca la base', async () => {
  const s = setup({ mode: 'practice' });
  s.battle.begin();
  await flush();
  s.clock.advance(WORD_RUSH.countdownMs + WORD_RUSH.durationMs);
  const store = new FakeStore();
  const result = await settleBattle(store, s.battle, 'completed');
  assert.equal(store.settleCalls, 0);
  assert.equal(result.players[0]!.outcome, null);
  assert.equal(result.players[0]!.ratingAfter, null);
});
