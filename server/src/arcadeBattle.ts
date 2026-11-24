import {
  ARCADE,
  arcadeScore,
  botArcadeMove,
  gradeArcade,
  isFrenzy,
  toChallengeView,
  type ArcadeAnswerResult,
  type ArcadeRules,
  type ArcadeChallenge,
  type ChallengeView,
  type GradeOutcome,
} from '../../shared/arcade';
import {
  ARCADE_PROTOCOL_VERSION,
  WORD_RUSH,
  type Ack,
  type BattleMode,
  type BattleSnapshot,
} from '../../shared/protocol';
import { Battle, type BattleHooks, type BattleLine, type BattleOptions, type Seat } from './battle';
import type { Clock } from './clock';
import type { PlayerInfo } from './types';

export type { ArcadeRules } from '../../shared/arcade';

/** Progreso propio de cada jugador en la partida arcade. */
interface ArcadeSeat {
  /** Desafío actual (=== challenges.length si terminó todos). */
  current: number;
  /** Instante del servidor en que el desafío (o, en Connect, la pareja) quedó activo. */
  activeSince: number;
  combo: number;
  bestCombo: number;
  frenzyPoints: number;
  /** Connect: parejas resueltas del tablero actual, izquierda → derecha. */
  solved: Map<number, number>;
}

/**
 * Partida Ranked Arcade (protocolo 3): 60 s, cuatro microjuegos, combo y Frenesí. El ciclo de vida
 * (confirmación, cuenta regresiva, reloj, desconexión con gracia, abandono, cierre y liquidación) es
 * el de Battle; acá sólo cambia qué se juega y cómo se puntúa. Toda decisión usa el reloj del servidor:
 * el cliente dice qué hizo en qué desafío, nada más.
 */
export class ArcadeBattle extends Battle {
  private readonly arcade = new Map<string, ArcadeSeat>();

  constructor(
    id: string,
    mode: BattleMode,
    languageCode: string,
    players: PlayerInfo[],
    private readonly challenges: ArcadeChallenge[],
    clock: Clock,
    hooks: BattleHooks,
    random: () => number = Math.random,
    options: BattleOptions = {},
    private readonly arcadeRules: ArcadeRules = ARCADE,
  ) {
    super(
      id,
      mode,
      languageCode,
      players,
      [],
      clock,
      hooks,
      {
        ...WORD_RUSH,
        durationMs: arcadeRules.durationMs,
        countdownMs: arcadeRules.countdownMs,
        readyTimeoutMs: arcadeRules.readyTimeoutMs,
        reconnectGraceMs: arcadeRules.reconnectGraceMs,
      },
      random,
      { ...options, protocolVersion: ARCADE_PROTOCOL_VERSION },
    );
    for (const p of players) {
      this.arcade.set(p.userId, {
        current: 0,
        activeSince: 0,
        combo: 0,
        bestCombo: 0,
        frenzyPoints: 0,
        solved: new Map(),
      });
    }
  }

  /**
   * Respuesta de un jugador a su desafío actual. Duplicada, adelantada o de un desafío ya pasado:
   * stale_question (no puntúa ni rompe el combo). Forma inválida: invalid_payload.
   */
  arcadeAnswer(
    userId: string,
    challengeIndex: unknown,
    answer: unknown,
    reply: Ack<ArcadeAnswerResult>,
  ): void {
    const seat = this.seat(userId);
    const state = this.arcade.get(userId);
    if (!seat || !state) return reply({ ok: false, code: 'not_in_battle' });
    if (this.isOver || (this.endsAt !== null && this.clock.now() >= this.endsAt)) {
      return reply({ ok: false, code: 'battle_over' });
    }
    if (this.status !== 'in_progress' && this.status !== 'reconnecting') {
      return reply({ ok: false, code: 'stale_question' });
    }
    if (!Number.isInteger(challengeIndex)) return reply({ ok: false, code: 'invalid_payload' });
    if (challengeIndex !== state.current || state.current >= this.challenges.length) {
      return reply({ ok: false, code: 'stale_question' });
    }
    const challenge = this.challenges[state.current]!;
    const outcome = gradeArcade(challenge, answer, new Set(state.solved.keys()));
    if (!outcome.valid) return reply({ ok: false, code: 'invalid_payload' });
    const result = this.resolve(seat, state, challenge, outcome);
    reply({ ok: true, data: result });
    this.afterAnswer(seat, state, result.done);
  }

  override snapshot(userId: string): BattleSnapshot {
    const base = super.snapshot(userId);
    const state = this.arcade.get(userId);
    const playing = this.status === 'in_progress' || this.status === 'reconnecting';
    return {
      ...base,
      question: null,
      arcade: {
        challenges: state && playing ? this.windowViews(state) : [],
        current: state?.current ?? 0,
        combo: state?.combo ?? 0,
        bestCombo: state?.bestCombo ?? 0,
        frenzyAt: this.endsAt === null ? null : this.endsAt - this.arcadeRules.frenzyMs,
        durationMs: this.arcadeRules.durationMs,
      },
    };
  }

  override finalLines(): BattleLine[] {
    return super.finalLines().map((line) => {
      const state = this.arcade.get(line.info.userId);
      return {
        ...line,
        arcade: { bestCombo: state?.bestCombo ?? 0, frenzyPoints: state?.frenzyPoints ?? 0 },
      };
    });
  }

  // ---------- internos ----------

  /** Al empezar (y sólo entonces): cada jugador recibe sus primeros desafíos; el bot empieza a jugar. */
  protected override sendQuestion(seat: Seat): void {
    const state = this.arcade.get(seat.info.userId)!;
    state.activeSince = this.clock.now();
    if (seat.info.isBot) {
      this.scheduleBot(seat, state);
      return;
    }
    if (!seat.connected) return;
    for (const view of this.windowViews(state)) {
      this.hooks.send(seat.info.userId, 'arcade:challenge', view);
    }
  }

  /** El desafío actual y los siguientes (lookahead), con el progreso de Connect. */
  private windowViews(state: ArcadeSeat): ChallengeView[] {
    const views: ChallengeView[] = [];
    for (let i = state.current; i < state.current + this.arcadeRules.lookahead; i++) {
      const challenge = this.challenges[i];
      if (!challenge) break;
      views.push(toChallengeView(challenge, i === state.current ? [...state.solved] : []));
    }
    return views;
  }

  /** Puntúa con el reloj del servidor y avanza el progreso del jugador. */
  private resolve(
    seat: Seat,
    state: ArcadeSeat,
    challenge: ArcadeChallenge,
    outcome: Extract<GradeOutcome, { valid: true }>,
  ): ArcadeAnswerResult {
    const now = this.clock.now();
    const frenzy = isFrenzy(now, this.endsAt, this.arcadeRules);
    const score = arcadeScore({
      kind: challenge.kind,
      correct: outcome.correct,
      elapsedMs: now - state.activeSince,
      comboBefore: state.combo,
      frenzy,
    });
    seat.score += score.points;
    seat.answered += 1;
    if (score.correct) seat.correct += 1;
    seat.streak = score.combo;
    state.combo = score.combo;
    state.bestCombo = Math.max(state.bestCombo, score.combo);
    if (frenzy) state.frenzyPoints += score.points;
    if (challenge.kind === 'connect' && score.correct && outcome.pair) {
      state.solved.set(outcome.pair[0], outcome.pair[1]);
    }
    // Una pareja de Connect descartada por rápida no existe (minMs 0): `done` sólo si se resolvió.
    const done = outcome.done && (challenge.kind !== 'connect' || score.correct);
    state.activeSince = now;
    if (done) {
      state.current += 1;
      state.solved.clear();
    }
    return {
      challengeIndex: challenge.index,
      kind: challenge.kind,
      correct: score.correct,
      points: score.points,
      score: seat.score,
      combo: score.combo,
      multiplier: score.multiplier,
      frenzy,
      done,
      ...(outcome.solution !== undefined ? { solution: outcome.solution } : {}),
      ...(outcome.correctOption !== undefined ? { correctOption: outcome.correctOption } : {}),
      ...(outcome.pair ? { pair: outcome.pair } : {}),
      ...(score.tooFast ? { tooFast: true } : {}),
    };
  }

  /** Marcador para los dos, el desafío que entra en la ventana y fin si todos agotaron la secuencia. */
  private afterAnswer(seat: Seat, state: ArcadeSeat, done: boolean): void {
    this.broadcastScores();
    if (state.current >= this.challenges.length) {
      if ([...this.arcade.values()].every((s) => s.current >= this.challenges.length)) {
        this.finish('completed');
      }
      return;
    }
    if (seat.info.isBot) {
      this.scheduleBot(seat, state);
      return;
    }
    // Pasó al siguiente: entra en la ventana el que viene después (el actual ya lo tenía).
    const entering = this.challenges[state.current + this.arcadeRules.lookahead - 1];
    if (done && entering && seat.connected) {
      this.hooks.send(seat.info.userId, 'arcade:challenge', toChallengeView(entering));
    }
  }

  /** El bot juega el mismo desafío que una persona, con su habilidad, por el mismo camino de puntaje. */
  private scheduleBot(seat: Seat, state: ArcadeSeat): void {
    const challenge = this.challenges[state.current];
    if (!challenge) return;
    const move = botArcadeMove(seat.info.rating, challenge.kind, this.random);
    const index = challenge.index;
    const solvedBefore = state.solved.size;
    this.schedule(move.delayMs, () => {
      if (this.isOver || (this.status !== 'in_progress' && this.status !== 'reconnecting')) return;
      if (state.current !== index || state.solved.size !== solvedBefore) return;
      if (this.endsAt !== null && this.clock.now() >= this.endsAt) return;
      const outcome = gradeArcade(
        challenge,
        this.botAnswer(challenge, state, move.correct),
        new Set(state.solved.keys()),
      );
      if (!outcome.valid) return;
      const result = this.resolve(seat, state, challenge, outcome);
      this.afterAnswer(seat, state, result.done);
    });
  }

  /** Lo que "toca" el bot: la respuesta correcta o una equivocada válida. */
  private botAnswer(challenge: ArcadeChallenge, state: ArcadeSeat, correct: boolean): unknown {
    switch (challenge.kind) {
      case 'swipe':
        return { kind: 'swipe', accept: correct ? challenge.truthful : !challenge.truthful };
      case 'audio': {
        const wrong = challenge.options.findIndex((_, i) => i !== challenge.correctOption);
        return {
          kind: 'audio',
          option: correct || wrong < 0 ? challenge.correctOption : wrong,
        };
      }
      case 'connect': {
        const left = challenge.left.findIndex((_, i) => !state.solved.has(i));
        const usedRight = new Set(state.solved.values());
        const wrong = challenge.right.findIndex(
          (_, r) => r !== challenge.solution[left] && !usedRight.has(r),
        );
        return {
          kind: 'connect',
          left,
          right: correct || wrong < 0 ? challenge.solution[left] : wrong,
        };
      }
      case 'sentence': {
        const order = challenge.tokens.map((_, i) => i);
        if (correct) {
          // Ordena los bloques según la respuesta canónica.
          const canonical = challenge.answers[0] ?? '';
          const remaining = [...order];
          const sorted: number[] = [];
          let rest = canonical;
          while (remaining.length > 0) {
            const at = remaining.findIndex((i) =>
              rest.trimStart().toLowerCase().startsWith(challenge.tokens[i]!.toLowerCase()),
            );
            const pick = remaining.splice(at < 0 ? 0 : at, 1)[0]!;
            sorted.push(pick);
            rest = rest.trimStart().slice(challenge.tokens[pick]!.length);
          }
          return { kind: 'sentence', order: sorted };
        }
        return { kind: 'sentence', order: [...order].reverse() };
      }
    }
  }
}
