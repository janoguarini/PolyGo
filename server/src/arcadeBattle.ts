import {
  ARCADE,
  arcadeScore,
  gradeArcade,
  isFrenzy,
  toChallengeView,
  type ArcadeAnswerResult,
  type ArcadeRules,
  type ArcadeChallenge,
  type ChallengeStream,
  type ChallengeView,
  type GradeOutcome,
} from '../../shared/arcade';
import { ArcadeBotBrain, botArcadeAnswer } from '../../shared/arcadeBot';
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

/** Si a un bot no se le puede armar ninguna respuesta válida (contenido roto), reintenta así. */
const BOT_RETRY_MS = 400;

/** Progreso propio de cada jugador en la partida. */
interface ArcadeSeat {
  /** Desafío actual. */
  current: number;
  /** Instante del servidor en que el desafío (o, en Connect, la pareja) quedó activo. */
  activeSince: number;
  combo: number;
  bestCombo: number;
  frenzyPoints: number;
  /** Connect: parejas resueltas del tablero actual, izquierda → derecha. */
  solved: Map<number, number>;
  /** Intentos en el desafío actual (Connect: parejas probadas). */
  attempts: number;
  /** Hasta qué índice (exclusivo) se le mostraron desafíos: lo que «vio» (memoria de contenido). */
  shownUpTo: number;
  /** Sólo bots: cómo juega. */
  brain: ArcadeBotBrain | null;
}

/**
 * Partida de Word Rush (motor interno Arcade, protocolo 3): 60 s, cuatro microjuegos, combo y Frenesí.
 * El ciclo de vida (confirmación, cuenta regresiva, reloj, desconexión con gracia, abandono, cierre y
 * liquidación) es el de Battle; acá cambia qué se juega y cómo se puntúa. Toda decisión usa el reloj
 * del servidor: el cliente dice qué hizo en qué desafío, nada más.
 *
 * La secuencia es un flujo continuo compartido (createChallengeStream): todos los jugadores (y el bot)
 * leen el mismo arreglo, que crece a pedido del más adelantado. La partida termina sólo por el reloj
 * (o por abandono): nunca por quedarse sin desafíos.
 */
export class ArcadeBattle extends Battle {
  private readonly arcade = new Map<string, ArcadeSeat>();

  constructor(
    id: string,
    mode: BattleMode,
    languageCode: string,
    players: PlayerInfo[],
    private readonly stream: ChallengeStream,
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
        attempts: 0,
        shownUpTo: 0,
        brain: p.isBot ? new ArcadeBotBrain(p.rating, random) : null,
      });
    }
  }

  /** Los desafíos generados hasta ahora (el mismo arreglo para todos). */
  get challenges(): readonly ArcadeChallenge[] {
    return this.stream.challenges;
  }

  /** Lo que se le mostró a un jugador, en orden (para la memoria de contenido reciente). */
  seenBy(userId: string): readonly ArcadeChallenge[] {
    const state = this.arcade.get(userId);
    return state ? this.challenges.slice(0, state.shownUpTo) : [];
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
    if (challengeIndex !== state.current) return reply({ ok: false, code: 'stale_question' });
    const challenge = this.stream.at(state.current);
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
    // Desconectado: igual corre su reloj; al volver recibe la ventana en battle:state.
    if (!seat.connected) return;
    for (const view of this.windowViews(state)) {
      this.hooks.send(seat.info.userId, 'arcade:challenge', view);
    }
  }

  /**
   * El desafío actual y los siguientes (lookahead), con el progreso de Connect. Asegura que existan:
   * el flujo crece a pedido, así que la ventana nunca queda vacía.
   */
  private windowViews(state: ArcadeSeat): ChallengeView[] {
    const end = state.current + this.arcadeRules.lookahead;
    this.stream.ensure(end);
    const views: ChallengeView[] = [];
    for (let i = state.current; i < end; i++) {
      views.push(toChallengeView(this.stream.at(i), i === state.current ? [...state.solved] : []));
    }
    state.shownUpTo = Math.max(state.shownUpTo, end);
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
    state.attempts += 1;
    if (done) {
      state.current += 1;
      state.solved.clear();
      state.attempts = 0;
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

  /** Marcador para los dos y el desafío que entra en la ventana (el flujo crece si hace falta). */
  private afterAnswer(seat: Seat, state: ArcadeSeat, done: boolean): void {
    this.broadcastScores();
    if (seat.info.isBot) {
      this.scheduleBot(seat, state);
      return;
    }
    // Pasó al siguiente: entra en la ventana el que viene después (el actual ya lo tenía).
    if (done && seat.connected) {
      const enteringIndex = state.current + this.arcadeRules.lookahead - 1;
      const entering = this.stream.at(enteringIndex);
      state.shownUpTo = Math.max(state.shownUpTo, enteringIndex + 1);
      this.hooks.send(seat.info.userId, 'arcade:challenge', toChallengeView(entering));
    }
  }

  /**
   * El bot juega su desafío actual con su habilidad (shared/arcadeBot.ts), por el mismo camino de
   * puntaje que una persona y con el reloj del servidor. Nunca queda trabado: si no se le puede armar
   * una respuesta válida, reintenta acertando y, si el contenido está roto, lo saltea sin puntos.
   */
  private scheduleBot(seat: Seat, state: ArcadeSeat): void {
    const brain = state.brain;
    if (!brain) return;
    const index = state.current;
    const challenge = this.stream.at(index);
    const attempts = state.attempts;
    const plan = brain.plan(challenge.kind, challenge.kind === 'connect' && attempts > 0);
    this.schedule(plan.delayMs, () => this.botPlay(seat, state, index, attempts, plan.correct));
  }

  private botPlay(
    seat: Seat,
    state: ArcadeSeat,
    index: number,
    attempts: number,
    wantCorrect: boolean,
  ): void {
    if (this.isOver || (this.status !== 'in_progress' && this.status !== 'reconnecting')) return;
    if (state.current !== index || state.attempts !== attempts) return;
    // Lo que el servidor no acepta de una persona tampoco lo hace el bot.
    if (this.endsAt !== null && this.clock.now() >= this.endsAt) return;
    const challenge = this.stream.at(index);
    const solvedLeft = new Set(state.solved.keys());
    let move = botArcadeAnswer(challenge, state.solved, wantCorrect, this.random);
    let outcome = move ? gradeArcade(challenge, move.answer, solvedLeft) : null;
    if (!outcome?.valid) {
      move = botArcadeAnswer(challenge, state.solved, true, this.random);
      outcome = move ? gradeArcade(challenge, move.answer, solvedLeft) : null;
    }
    if (!outcome?.valid) {
      // Contenido sin ninguna respuesta válida: no se puntúa y el bot pasa al siguiente.
      state.current += 1;
      state.solved.clear();
      state.attempts = 0;
      state.activeSince = this.clock.now();
      this.schedule(BOT_RETRY_MS, () => this.scheduleBot(seat, state));
      return;
    }
    const result = this.resolve(seat, state, challenge, outcome);
    state.brain?.observe(result.correct);
    this.afterAnswer(seat, state, result.done);
  }
}
