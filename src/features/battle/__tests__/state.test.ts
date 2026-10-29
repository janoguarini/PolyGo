import type { BattleSnapshot, QuestionView } from '@shared/protocol';

import {
  battleReducer,
  initialBattleState,
  myLine,
  opponentPlayer,
  remainingMs,
  type BattleAction,
  type BattleState,
} from '../state';

const question = (index: number): QuestionView => ({
  index,
  direction: 'en_es',
  prompt: `word${index}`,
  options: ['a', 'b', 'c', 'd'],
  sentAt: 1_000 + index,
});

const snapshot = (over: Partial<BattleSnapshot> = {}): BattleSnapshot => ({
  battleId: 'b1',
  mode: 'ranked',
  status: 'matched',
  yourSlot: 2,
  players: [
    { slot: 1, username: 'alice', avatarId: 'bolt', rating: 1000, gamesPlayed: 0 },
    { slot: 2, username: 'bob', avatarId: 'flame', rating: 1050, gamesPlayed: 7 },
  ],
  serverNow: 10_000,
  readyDeadline: 20_000,
  startsAt: null,
  endsAt: null,
  question: null,
  scores: [
    { slot: 1, score: 0, correct: 0, answered: 0, connected: true },
    { slot: 2, score: 0, correct: 0, answered: 0, connected: true },
  ],
  ...over,
});

const run = (...actions: BattleAction[]): BattleState =>
  actions.reduce(battleReducer, initialBattleState);

const playing = () =>
  run(
    { type: 'joined', mode: 'ranked' },
    { type: 'snapshot', snapshot: snapshot(), receivedAt: 9_000 },
    {
      type: 'snapshot',
      snapshot: snapshot({
        status: 'in_progress',
        startsAt: 11_000,
        endsAt: 86_000,
        question: question(0),
      }),
      receivedAt: 9_000,
    },
  );

describe('battleReducer', () => {
  it('cola → rival encontrado con el desfase de reloj del servidor', () => {
    const s = run(
      { type: 'connecting', mode: 'ranked' },
      { type: 'joined', mode: 'ranked' },
      { type: 'queue_status', window: 150, waitedMs: 5_000 },
      { type: 'snapshot', snapshot: snapshot(), receivedAt: 9_000 },
    );
    expect(s.phase).toBe('found');
    expect(s.clockOffset).toBe(1_000);
    expect(opponentPlayer(s)?.username).toBe('alice');
    expect(remainingMs(s.readyDeadline, s.clockOffset, 9_000)).toBe(10_000);
    expect(remainingMs(s.readyDeadline, s.clockOffset, 30_000)).toBe(0);
  });

  it('la práctica pasa directo a la cuenta atrás', () => {
    expect(run({ type: 'joined', mode: 'practice' }).phase).toBe('countdown');
  });

  it('confirmar listo se mantiene si llega otra foto de la misma partida', () => {
    const s = run(
      { type: 'snapshot', snapshot: snapshot(), receivedAt: 0 },
      { type: 'ready_sent' },
      { type: 'snapshot', snapshot: snapshot({ status: 'ready' }), receivedAt: 0 },
    );
    expect(s.phase).toBe('countdown');
    expect(s.iAmReady).toBe(true);
  });

  it('feedback: muestra el resultado y retiene la siguiente pregunta hasta terminar', () => {
    let s = battleReducer(playing(), { type: 'answer_sent' });
    expect(s.answering).toBe(true);
    s = battleReducer(s, {
      type: 'answer_result',
      chosen: 1,
      result: { questionIndex: 0, correct: false, correctOption: 2, points: -50, score: 0 },
    });
    expect(s.feedback).toMatchObject({ chosen: 1, correctOption: 2, correct: false });
    s = battleReducer(s, { type: 'question', question: question(1) });
    expect(s.question?.index).toBe(0);
    expect(s.queuedQuestion?.index).toBe(1);
    s = battleReducer(s, { type: 'feedback_done' });
    expect(s.question?.index).toBe(1);
    expect(s.feedback).toBeNull();
    expect(s.answering).toBe(false);
  });

  it('si la siguiente pregunta llega después del feedback, se muestra al llegar', () => {
    let s = battleReducer(playing(), {
      type: 'answer_result',
      chosen: 0,
      result: { questionIndex: 0, correct: true, correctOption: 0, points: 140, score: 140 },
    });
    expect(myLine(s)?.score).toBe(140);
    s = battleReducer(s, { type: 'feedback_done' });
    expect(s.question).toBeNull();
    s = battleReducer(s, { type: 'question', question: question(1) });
    expect(s.question?.index).toBe(1);
  });

  it('ignora el resultado de una pregunta que ya no está en pantalla', () => {
    const s = battleReducer(playing(), {
      type: 'answer_result',
      chosen: 0,
      result: { questionIndex: 3, correct: true, correctOption: 0, points: 100, score: 100 },
    });
    expect(s.feedback).toBeNull();
  });

  it('reconectar: la pregunta del servidor reemplaza a la local', () => {
    let s = battleReducer(playing(), { type: 'answer_sent' });
    s = battleReducer(s, {
      type: 'snapshot',
      snapshot: snapshot({ status: 'in_progress', endsAt: 86_000, question: question(4) }),
      receivedAt: 9_500,
    });
    expect(s.question?.index).toBe(4);
    expect(s.answering).toBe(false);
    expect(s.clockOffset).toBe(500);
  });

  it('un corte de red en partida no muestra error; antes de jugar sí', () => {
    expect(battleReducer(playing(), { type: 'connection_error', code: 'connection' }).phase).toBe(
      'playing',
    );
    const searching = run({ type: 'joined', mode: 'ranked' });
    expect(battleReducer(searching, { type: 'connection_error', code: 'connection' }).phase).toBe(
      'error',
    );
    expect(battleReducer(playing(), { type: 'connection_error', code: 'unauthorized' }).phase).toBe(
      'error',
    );
  });

  it('fin, cancelación y partida perdida al reconectar', () => {
    const finished = battleReducer(playing(), {
      type: 'finished',
      result: {
        battleId: 'b1',
        mode: 'ranked',
        status: 'completed',
        yourSlot: 2,
        players: [],
        achievementsUnlocked: [],
      },
    });
    expect(finished.phase).toBe('finished');
    expect(
      battleReducer(finished, { type: 'question', question: question(9) }).question?.index,
    ).toBe(0);

    expect(
      battleReducer(playing(), { type: 'cancelled', reason: 'ready_timeout' }).cancelReason,
    ).toBe('ready_timeout');
    const lost = battleReducer(playing(), { type: 'lost' });
    expect(lost.phase).toBe('cancelled');
    expect(lost.cancelReason).toBeNull();
  });

  it('el rival desconectado informa la gracia', () => {
    const s = battleReducer(playing(), {
      type: 'opponent_status',
      connected: false,
      graceEndsAt: 50_000,
    });
    expect(s.opponent).toEqual({ connected: false, graceEndsAt: 50_000 });
  });
});
