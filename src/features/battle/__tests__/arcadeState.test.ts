import type { ArcadeAnswerResult, ArcadeSnapshot, ChallengeView } from '@shared/arcade';
import type { BattleSnapshot } from '@shared/protocol';

import {
  arcadeFromSnapshot,
  arcadeReducer,
  currentChallenge,
  frenzyActive,
  verdictSound,
  type ArcadeClientState,
} from '../arcade/arcadeState';
import { battleReducer, initialBattleState, type BattleState } from '../state';

const swipe = (index: number): ChallengeView => ({
  index,
  kind: 'swipe',
  prompt: 'apple',
  candidate: 'manzana',
});
const connect = (index: number, solved: [number, number][] = []): ChallengeView => ({
  index,
  kind: 'connect',
  left: ['a', 'b', 'c', 'd'],
  right: ['1', '2', '3', '4'],
  solved,
});

const snapshot = (over: Partial<ArcadeSnapshot> = {}): ArcadeSnapshot => ({
  challenges: [swipe(0), connect(1)],
  current: 0,
  combo: 0,
  bestCombo: 0,
  frenzyAt: 145_000,
  durationMs: 60_000,
  ...over,
});

const result = (over: Partial<ArcadeAnswerResult>): ArcadeAnswerResult => ({
  challengeIndex: 0,
  kind: 'swipe',
  correct: true,
  points: 57,
  score: 57,
  combo: 1,
  multiplier: 1,
  frenzy: false,
  done: true,
  ...over,
});

const base = (): ArcadeClientState => arcadeFromSnapshot(null, snapshot());

describe('estado arcade del cliente', () => {
  it('Swipe avanza al instante (el siguiente ya estaba) y el veredicto llega después', () => {
    let s = arcadeReducer(base(), { type: 'arcade_submit', challengeIndex: 0 });
    expect(s.current).toBe(1);
    expect(s.pending).toBe(1);
    expect(currentChallenge(s)?.kind).toBe('connect');
    s = arcadeReducer(s, { type: 'arcade_result', result: result({}) });
    expect(s.pending).toBe(0);
    expect(s.verdict).toMatchObject({ correct: true, points: 57 });
    // El desafío viejo se descarta.
    expect(s.challenges[0]).toBeUndefined();
  });

  it('una respuesta a un desafío que no es el actual no avanza dos veces', () => {
    const s = arcadeReducer(base(), { type: 'arcade_submit', challengeIndex: 3 });
    expect(s.current).toBe(0);
  });

  it('Connect espera cada pareja; error marca la pareja, acierto la suma; al limpiar avanza', () => {
    let s = arcadeFromSnapshot(null, snapshot({ challenges: [connect(0), swipe(1)] }));
    s = arcadeReducer(s, { type: 'arcade_submit', challengeIndex: 0, pair: [0, 2] });
    expect(s.current).toBe(0);
    expect(s.connectPending).toEqual([0, 2]);
    s = arcadeReducer(s, {
      type: 'arcade_result',
      result: result({
        kind: 'connect',
        correct: false,
        points: 0,
        combo: 0,
        done: false,
        pair: [0, 2],
      }),
    });
    expect(s.connectPending).toBeNull();
    expect(s.connectWrong?.pair).toEqual([0, 2]);
    for (let i = 0; i < 4; i++) {
      s = arcadeReducer(s, { type: 'arcade_submit', challengeIndex: 0, pair: [i, i] });
      s = arcadeReducer(s, {
        type: 'arcade_result',
        result: result({ kind: 'connect', combo: i + 1, done: i === 3, pair: [i, i] }),
      });
    }
    expect(s.current).toBe(1);
    expect(s.solved).toEqual([]);
  });

  it('combo: sube de multiplicador y detecta la ruptura', () => {
    let s = { ...base(), combo: 2 };
    s = arcadeReducer(s, { type: 'arcade_result', result: result({ combo: 3, multiplier: 2 }) });
    expect(s.verdict?.tierUp).toBe(true);
    expect(s.multiplier).toBe(2);
    s = arcadeReducer(s, {
      type: 'arcade_result',
      result: result({ correct: false, combo: 0, multiplier: 1, points: 0 }),
    });
    expect(s.verdict?.comboBroken).toBe(true);
    expect(s.bestCombo).toBe(3);
  });

  it('tras reconectar manda la foto del servidor (descarta lo no confirmado)', () => {
    let s = arcadeReducer(base(), { type: 'arcade_submit', challengeIndex: 0 });
    s = arcadeFromSnapshot(
      s,
      snapshot({ current: 1, challenges: [connect(1, [[2, 3]]), swipe(2)], combo: 4 }),
    );
    expect(s.pending).toBe(0);
    expect(s.current).toBe(1);
    expect(s.solved).toEqual([[2, 3]]);
    expect(s.multiplier).toBe(2);
  });

  it('Frenesí según el reloj del servidor', () => {
    const s = base();
    const endsAt = 160_000;
    expect(frenzyActive(s, endsAt, 0, 144_999)).toBe(false);
    expect(frenzyActive(s, endsAt, 0, 145_000)).toBe(true);
    // Reloj local atrasado 1 s respecto del servidor: igual se activa a tiempo.
    expect(frenzyActive(s, endsAt, 1_000, 144_000)).toBe(true);
    expect(frenzyActive(s, endsAt, 0, 160_000)).toBe(false);
  });

  it('sonidos: tono creciente por escalón, combo perdido, error', () => {
    expect(verdictSound({ correct: true, tierUp: true, multiplier: 2, comboBroken: false })).toBe(
      'streak1',
    );
    expect(verdictSound({ correct: true, tierUp: true, multiplier: 4, comboBroken: false })).toBe(
      'streak3',
    );
    expect(verdictSound({ correct: true, tierUp: false, multiplier: 3, comboBroken: false })).toBe(
      'correct',
    );
    expect(verdictSound({ correct: false, tierUp: false, multiplier: 1, comboBroken: true })).toBe(
      'streakLost',
    );
    expect(verdictSound({ correct: false, tierUp: false, multiplier: 1, comboBroken: false })).toBe(
      'incorrect',
    );
  });
});

describe('integración con el reducer de batalla', () => {
  const battleSnap = (over: Partial<BattleSnapshot> = {}): BattleSnapshot => ({
    battleId: 'b1',
    mode: 'ranked',
    status: 'ready',
    yourSlot: 1,
    players: [],
    serverNow: 100_000,
    readyDeadline: null,
    startsAt: 100_000,
    endsAt: 160_000,
    question: null,
    scores: [
      { slot: 1, score: 0, correct: 0, answered: 0, connected: true },
      { slot: 2, score: 0, correct: 0, answered: 0, connected: true },
    ],
    arcade: snapshot({ challenges: [] }),
    ...over,
  });

  it('el primer desafío pasa a jugando y el resultado actualiza el puntaje propio', () => {
    let s: BattleState = battleReducer(initialBattleState, {
      type: 'snapshot',
      snapshot: battleSnap(),
      receivedAt: 100_000,
    });
    expect(s.phase).toBe('countdown');
    expect(s.arcade).not.toBeNull();
    s = battleReducer(s, { type: 'arcade_challenge', challenge: swipe(0) });
    expect(s.phase).toBe('playing');
    s = battleReducer(s, { type: 'arcade_submit', challengeIndex: 0 });
    s = battleReducer(s, { type: 'arcade_result', result: result({ score: 57 }) });
    expect(s.scores.find((l) => l.slot === 1)?.score).toBe(57);
  });

  it('sin parte arcade (Word Rush) el estado arcade queda vacío y las acciones no hacen nada', () => {
    let s = battleReducer(initialBattleState, {
      type: 'snapshot',
      snapshot: battleSnap({ arcade: undefined }),
      receivedAt: 100_000,
    });
    expect(s.arcade).toBeNull();
    s = battleReducer(s, { type: 'arcade_challenge', challenge: swipe(0) });
    expect(s.arcade).toBeNull();
  });
});
