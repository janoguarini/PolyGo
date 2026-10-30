import { BOT_CONFIG } from '@shared/bots';
import { WORD_RUSH } from '@shared/protocol';
import { answerPoints, applyPoints, generateQuestions } from '@shared/wordRush';

import {
  LocalMatch,
  type FinishedBotMatch,
  type LocalMatchApi,
  type StartedBotMatch,
} from '../localMatch';
import { battleReducer, initialBattleState, type BattleAction, type BattleState } from '../state';

const WORDS = [
  { id: 'hello', text: 'hello', translationEs: 'hola' },
  { id: 'bye', text: 'goodbye', translationEs: 'adiós' },
  { id: 'thanks', text: 'thank you', translationEs: 'gracias' },
  { id: 'please', text: 'please', translationEs: 'por favor' },
  { id: 'yes', text: 'yes', translationEs: 'sí' },
  { id: 'water', text: 'water', translationEs: 'agua' },
];
const QUESTIONS = generateQuestions(WORDS, 40, () => 0.3);

/** Reloj manual: el tiempo sólo avanza con advance(). */
function manualClock() {
  let now = 1_000_000;
  let id = 0;
  const timers = new Map<number, { at: number; fn: () => void }>();
  return {
    now: () => now,
    setTimer: (fn: () => void, ms: number) => {
      timers.set(++id, { at: now + ms, fn });
      return id;
    },
    clearTimer: (h: unknown) => void timers.delete(h as number),
    advance(ms: number) {
      const target = now + ms;
      for (;;) {
        let next: [number, { at: number; fn: () => void }] | null = null;
        for (const t of timers) if (t[1].at <= target && (!next || t[1].at < next[1].at)) next = t;
        if (!next) break;
        timers.delete(next[0]);
        now = next[1].at;
        next[1].fn();
      }
      now = target;
    },
  };
}

const flush = () => new Promise<void>((r) => setImmediate(() => r()));

const SCRIPT = [
  { d: 2000, c: true },
  { d: 3000, c: false },
  { d: 2500, c: true },
];

function setup() {
  const clock = manualClock();
  let state: BattleState = initialBattleState;
  const dispatch = (action: BattleAction) => {
    state = battleReducer(state, action);
  };
  const finishCalls: { line: unknown; forfeit: boolean }[] = [];
  const api: LocalMatchApi = {
    start: async (): Promise<StartedBotMatch> => ({
      battle_id: 'm1',
      me: { rating: 1000, games_played: 3 },
      bot: { name: 'Kiko', avatar_id: 'crown', rating: 1020 },
      script: SCRIPT,
    }),
    finish: async (battleId, line, forfeit): Promise<FinishedBotMatch> => {
      finishCalls.push({ line, forfeit });
      return {
        battle_id: battleId,
        status: forfeit ? 'forfeited' : 'completed',
        me: {
          ...line,
          result: forfeit ? 'loss' : 'win',
          forfeited: forfeit,
          rating_before: 1000,
          rating_after: forfeit ? 976 : 1025,
        },
        bot: { name: 'Kiko', score: 260, correct: 2, answered: 3, result: 'loss' },
        achievements: [{ id: 'first_win', title: 'Campeón · Nivel 1', icon: 'trophy' }],
      };
    },
  };
  const onRankedFinished = jest.fn();
  const match = new LocalMatch({
    dispatch: (a) => dispatch(a),
    api,
    questions: QUESTIONS,
    me: { username: 'ana', avatarId: 'bolt', avatarPath: null },
    now: clock.now,
    setTimer: clock.setTimer,
    clearTimer: clock.clearTimer,
    random: () => 0,
    onRankedFinished,
  });
  return { clock, match, state: () => state, finishCalls, onRankedFinished, dispatch };
}

it('ranked: anuncia al bot, cuenta atrás, juega con el guion y guarda el resultado en la base', async () => {
  const s = setup();
  s.dispatch({ type: 'connecting', mode: 'ranked' });
  await s.match.begin('ranked');
  expect(s.state().phase).toBe('found');
  const bot = s.state().players.find((p) => p.slot === 2)!;
  expect(bot).toMatchObject({ username: 'Kiko', isBot: true, rating: 1020 });

  s.match.ready();
  s.clock.advance(BOT_CONFIG.readyMs.min); // demora del bot al confirmar (random = 0)
  expect(s.state().phase).toBe('countdown');
  s.clock.advance(WORD_RUSH.countdownMs);
  expect(s.state().phase).toBe('playing');
  expect(s.state().question?.index).toBe(0);

  // Respuesta correcta a los 1,2 s: 100 + bonus.
  s.clock.advance(1_200);
  s.match.answer(QUESTIONS[0]!.correctOption);
  const myScore = answerPoints(true, 1_200);
  expect(s.state().feedback?.correct).toBe(true);
  expect(s.state().scores.find((l) => l.slot === 1)?.score).toBe(myScore);

  // El bot juega su guion a su ritmo.
  s.clock.advance(5_000);
  let botScore = 0;
  for (const m of SCRIPT.slice(0, 2)) botScore = applyPoints(botScore, answerPoints(m.c, m.d));
  expect(s.state().scores.find((l) => l.slot === 2)).toMatchObject({
    answered: 2,
    score: botScore,
  });

  s.clock.advance(WORD_RUSH.durationMs);
  await flush();
  expect(s.finishCalls).toEqual([
    { line: { score: myScore, correct: 1, answered: 1 }, forfeit: false },
  ]);
  expect(s.state().phase).toBe('finished');
  expect(s.state().result?.players[0]).toMatchObject({ outcome: 'win', ratingAfter: 1025 });
  expect(s.state().result?.players[1]).toMatchObject({ isBot: true, username: 'Kiko' });
  expect(s.state().result?.achievementsUnlocked).toHaveLength(1);
  expect(s.onRankedFinished).toHaveBeenCalled();
});

it('si no confirma en 10 s, la partida empieza igual', async () => {
  const s = setup();
  await s.match.begin('ranked');
  s.clock.advance(WORD_RUSH.readyTimeoutMs + 1_000);
  expect(s.state().phase).toBe('countdown');
});

it('abandonar en plena partida avisa a la base como derrota', async () => {
  const s = setup();
  await s.match.begin('ranked');
  s.match.ready();
  s.clock.advance(1_000 + WORD_RUSH.countdownMs + 5_000);
  s.match.leave();
  await flush();
  expect(s.finishCalls).toEqual([{ line: { score: 0, correct: 0, answered: 0 }, forfeit: true }]);
  // Después de abandonar ya no corre nada más.
  s.clock.advance(WORD_RUSH.durationMs);
  await flush();
  expect(s.finishCalls).toHaveLength(1);
});

it('práctica: sin bot ni base, termina sola con el puntaje propio', async () => {
  const s = setup();
  s.dispatch({ type: 'connecting', mode: 'practice' });
  await s.match.begin('practice');
  s.clock.advance(WORD_RUSH.countdownMs);
  expect(s.state().phase).toBe('playing');
  s.match.answer((QUESTIONS[0]!.correctOption + 1) % 4);
  s.clock.advance(WORD_RUSH.durationMs);
  await flush();
  expect(s.finishCalls).toHaveLength(0);
  expect(s.state().result?.mode).toBe('practice');
  expect(s.state().result?.players).toHaveLength(1);
  expect(s.state().result?.players[0]).toMatchObject({ answered: 1, correct: 0, outcome: null });
});
