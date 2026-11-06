import {
  MAX_WRITTEN_ANSWER_LENGTH,
  WORD_RUSH,
  canTransition,
  isTerminalStatus,
  type Ack,
  type AnswerResult,
  type BattleMode,
  type BattleSnapshot,
  type BattleStatus,
  type CalibrationInfo,
  type CancelReason,
  type MatchRating,
  type PublicPlayer,
  type ScoreLine,
  type ServerToClientEvents,
} from '../../shared/protocol';
import {
  WRITING,
  answerPoints,
  applyPoints,
  checkWritten,
  pointsElapsed,
  toQuestionView,
  type FinalLine,
  type RushQuestion,
} from '../../shared/wordRush';
import { BOT_CONFIG, botMove, botSkill } from '../../shared/bots';
import type { Clock } from './clock';
import type { BotBattleStart, PlayerInfo } from './types';

/** Lo que manda el cliente al responder: la opción o, en las preguntas para escribir, el texto. */
export interface AnswerChoice {
  option?: unknown;
  text?: unknown;
}

export type BattleRules = {
  -readonly [K in keyof typeof WORD_RUSH]: (typeof WORD_RUSH)[K] extends number
    ? number
    : (typeof WORD_RUSH)[K];
};

export type Send = <E extends keyof ServerToClientEvents>(
  userId: string,
  event: E,
  ...args: Parameters<ServerToClientEvents[E]>
) => void;

export interface BattleHooks {
  send: Send;
  /**
   * Persiste el inicio (sólo ranked). Si falla, la partida se cancela sin ELO. Contra un bot
   * devuelve lo que decidió la base (si es de calibración o práctica).
   */
  onStart(battle: Battle): Promise<BotBattleStart | void>;
  /** La partida terminó con resultado: el orquestador liquida y envía battle:finish. */
  onFinish(battle: Battle, status: 'completed' | 'forfeited'): void;
  onCancel(battle: Battle, reason: CancelReason): void;
}

interface Seat {
  slot: 1 | 2;
  info: PlayerInfo;
  connected: boolean;
  ready: boolean;
  score: number;
  correct: number;
  answered: number;
  /** Correctas seguidas (bonus de racha). */
  streak: number;
  /** Pregunta que el jugador tiene en pantalla; === questions.length cuando terminó todas. */
  questionIndex: number;
  questionSentAt: number;
  graceTimer: unknown;
  graceEndsAt: number | null;
  forfeited: boolean;
}

/**
 * Una partida Word Rush. Toda decisión (tiempo, corrección, puntaje, abandono) se toma acá con el
 * reloj del servidor; el cliente sólo envía qué opción eligió para qué pregunta.
 * Máquina de estados: shared/protocol.ts (canTransition) y docs/BATTLE_PROTOCOL.md.
 */
export class Battle {
  status: BattleStatus = 'matched';
  readyDeadline: number | null = null;
  startsAt: number | null = null;
  endsAt: number | null = null;
  /** Promesa del guardado de inicio; quien cancela la espera para no dejar filas abiertas. */
  persistence: Promise<unknown> | null = null;
  /** Si mueve el ELO. Contra un bot lo confirma la base al guardar el inicio (cupo de calibración). */
  rating: MatchRating;
  calibration: CalibrationInfo | null;

  private readonly seats: Seat[];
  private timers = new Set<unknown>();

  constructor(
    readonly id: string,
    readonly mode: BattleMode,
    readonly languageCode: string,
    players: PlayerInfo[],
    private readonly questions: RushQuestion[],
    private readonly clock: Clock,
    private readonly hooks: BattleHooks,
    private readonly rules: BattleRules = WORD_RUSH,
    /** Fuente [0, 1) de las jugadas de los bots (inyectable en tests). */
    private readonly random: () => number = Math.random,
    options: { rating?: MatchRating; calibration?: CalibrationInfo | null } = {},
  ) {
    this.rating = options.rating ?? (mode === 'ranked' ? 'competitive' : 'unrated');
    this.calibration = options.calibration ?? null;
    const expected = mode === 'practice' ? 1 : 2;
    if (players.length !== expected) throw new Error(`${mode} necesita ${expected} jugador(es)`);
    this.seats = players.map((info, i) => ({
      slot: (i + 1) as 1 | 2,
      info,
      connected: true,
      ready: false,
      score: 0,
      correct: 0,
      answered: 0,
      streak: 0,
      questionIndex: 0,
      questionSentAt: 0,
      graceTimer: null,
      graceEndsAt: null,
      forfeited: false,
    }));
  }

  get userIds(): string[] {
    return this.seats.map((s) => s.info.userId);
  }

  get players(): PlayerInfo[] {
    return this.seats.map((s) => s.info);
  }

  get isOver(): boolean {
    return isTerminalStatus(this.status);
  }

  /** Anuncia la partida. En práctica no hay confirmación: arranca la cuenta atrás. */
  begin(): void {
    if (this.mode === 'practice') {
      this.markReady(this.seats[0]!.info.userId);
      return;
    }
    this.readyDeadline = this.clock.now() + this.rules.readyTimeoutMs;
    this.schedule(this.rules.readyTimeoutMs, () => this.cancel('ready_timeout'));
    for (const seat of this.seats)
      this.hooks.send(seat.info.userId, 'match:found', this.snapshot(seat.info.userId));
    // El bot confirma como una persona: con una pequeña demora.
    for (const seat of this.seats) {
      if (!seat.info.isBot) continue;
      const { min, max } = BOT_CONFIG.readyMs;
      this.schedule(min + this.random() * (max - min), () => this.markReady(seat.info.userId));
    }
  }

  markReady(userId: string): boolean {
    const seat = this.seat(userId);
    if (!seat || this.status !== 'matched') return false;
    seat.ready = true;
    if (this.seats.every((s) => s.ready)) void this.startCountdown();
    return true;
  }

  /**
   * Respuesta de un jugador. El cliente sólo dice qué eligió (o qué escribió) para qué pregunta: la
   * corrección, el tiempo y los puntos los decide el servidor. Cualquier otro dato se ignora.
   */
  answer(
    userId: string,
    questionIndex: unknown,
    choice: AnswerChoice,
    reply: Ack<AnswerResult>,
  ): void {
    const seat = this.seat(userId);
    if (!seat) return reply({ ok: false, code: 'not_in_battle' });
    if (this.isOver || (this.endsAt !== null && this.clock.now() >= this.endsAt)) {
      return reply({ ok: false, code: 'battle_over' });
    }
    if (this.status !== 'in_progress' && this.status !== 'reconnecting') {
      return reply({ ok: false, code: 'stale_question' });
    }
    if (!Number.isInteger(questionIndex)) return reply({ ok: false, code: 'invalid_payload' });
    // Duplicadas, adelantadas o de una pregunta anterior: se ignoran.
    if (questionIndex !== seat.questionIndex || seat.questionIndex >= this.questions.length) {
      return reply({ ok: false, code: 'stale_question' });
    }
    const question = this.questions[seat.questionIndex]!;

    let correct: boolean;
    if (question.write) {
      const text = choice?.text;
      if (typeof text !== 'string' || text.length > MAX_WRITTEN_ANSWER_LENGTH) {
        return reply({ ok: false, code: 'invalid_payload' });
      }
      correct = checkWritten(text, question.options[question.correctOption]!).correct;
    } else {
      const option = choice?.option;
      if (
        !Number.isInteger(option) ||
        (option as number) < 0 ||
        (option as number) >= question.options.length
      ) {
        return reply({ ok: false, code: 'invalid_payload' });
      }
      correct = option === question.correctOption;
    }
    reply({ ok: true, data: this.score(seat, question, correct) });
    this.advance(seat);
  }

  /** Puntúa la respuesta de la pregunta actual del jugador con el reloj del servidor. */
  private score(seat: Seat, question: RushQuestion, correct: boolean): AnswerResult {
    seat.streak = correct ? seat.streak + 1 : 0;
    const elapsed = pointsElapsed(question, this.clock.now() - seat.questionSentAt);
    const points = answerPoints(correct, elapsed, seat.streak);
    seat.score = applyPoints(seat.score, points);
    seat.answered += 1;
    if (correct) seat.correct += 1;
    seat.questionIndex += 1;
    return {
      questionIndex: question.index,
      correct,
      correctOption: question.correctOption,
      points,
      score: seat.score,
      streak: seat.streak,
      ...(question.write ? { correctText: question.options[question.correctOption]! } : {}),
    };
  }

  /** Tras una respuesta: marcador, siguiente pregunta o fin si los dos terminaron todas. */
  private advance(seat: Seat): void {
    this.broadcastScores();
    if (seat.questionIndex < this.questions.length) {
      this.sendQuestion(seat);
    } else if (this.seats.every((s) => s.questionIndex >= this.questions.length)) {
      this.finish('completed');
    }
  }

  disconnect(userId: string): void {
    const seat = this.seat(userId);
    if (!seat || this.isOver || !seat.connected) return;
    seat.connected = false;

    if (this.status === 'matched' || this.status === 'ready') {
      this.cancel('opponent_left');
      return;
    }
    // En práctica no hay rival que esperar: termina con lo que llevaba (sin ELO).
    if (this.mode === 'practice') {
      this.finish('completed');
      return;
    }
    if (this.status === 'in_progress') this.transition('reconnecting');
    seat.graceEndsAt = this.clock.now() + this.rules.reconnectGraceMs;
    seat.graceTimer = this.schedule(this.rules.reconnectGraceMs, () => this.forfeit(seat));
    this.notifyOpponents(seat);
  }

  reconnect(userId: string): void {
    const seat = this.seat(userId);
    if (!seat || this.isOver) return;
    seat.connected = true;
    if (seat.graceTimer !== null) this.unschedule(seat.graceTimer);
    seat.graceTimer = null;
    seat.graceEndsAt = null;
    if (this.status === 'reconnecting' && this.seats.every((s) => s.connected)) {
      this.transition('in_progress');
    }
    this.hooks.send(userId, 'battle:state', this.snapshot(userId));
    this.notifyOpponents(seat);
  }

  /** Abandono voluntario. */
  leave(userId: string): void {
    const seat = this.seat(userId);
    if (!seat || this.isOver) return;
    if (this.status === 'matched' || this.status === 'ready') {
      this.cancel('opponent_left');
      return;
    }
    if (this.mode === 'practice') {
      this.finish('completed');
      return;
    }
    this.forfeit(seat);
  }

  cancel(reason: CancelReason): void {
    if (this.isOver || !canTransition(this.status, 'cancelled')) return;
    this.clearTimers();
    this.transition('cancelled');
    for (const seat of this.seats) {
      if (seat.connected)
        this.hooks.send(seat.info.userId, 'battle:cancel', { battleId: this.id, reason });
    }
    this.hooks.onCancel(this, reason);
  }

  /** Líneas finales por slot, para decidir el resultado y liquidar. */
  finalLines(): (FinalLine & { slot: 1 | 2; info: PlayerInfo })[] {
    return this.seats.map((s) => ({
      slot: s.slot,
      info: s.info,
      score: s.score,
      correct: s.correct,
      answered: s.answered,
      forfeited: s.forfeited,
    }));
  }

  snapshot(userId: string): BattleSnapshot {
    const seat = this.seat(userId);
    const question =
      seat && (this.status === 'in_progress' || this.status === 'reconnecting')
        ? this.questions[seat.questionIndex]
        : undefined;
    return {
      battleId: this.id,
      mode: this.mode,
      status: this.status,
      yourSlot: seat?.slot ?? 1,
      players: this.seats.map((s): PublicPlayer => ({
        slot: s.slot,
        username: s.info.username,
        avatarId: s.info.avatarId,
        avatarPath: s.info.avatarPath ?? null,
        frameId: s.info.frameId ?? null,
        isBot: s.info.isBot ?? false,
        rating: s.info.rating,
        gamesPlayed: s.info.gamesPlayed,
      })),
      serverNow: this.clock.now(),
      readyDeadline: this.readyDeadline,
      startsAt: this.startsAt,
      endsAt: this.endsAt,
      question: question && seat ? toQuestionView(question, seat.questionSentAt) : null,
      scores: this.scores(),
      rating: this.rating,
      calibration: this.calibration,
    };
  }

  /** Lo que decidió la base al guardar el inicio de una partida contra un bot. */
  applyBotStart(start: BotBattleStart): void {
    this.rating = start.rated ? 'calibration' : 'unrated';
    this.calibration = start.rated ? start.calibration : null;
  }

  // ---------- internos ----------

  private async startCountdown(): Promise<void> {
    this.transition('ready');
    this.clearTimers();
    this.readyDeadline = null;
    const persistence = this.hooks.onStart(this);
    this.persistence = persistence;
    try {
      const started = await persistence;
      if (started) this.applyBotStart(started);
    } catch {
      this.cancel('server_error');
      return;
    }
    // Alguien se fue mientras se guardaba el inicio.
    if (this.status !== 'ready') return;

    const now = this.clock.now();
    this.startsAt = now + this.rules.countdownMs;
    this.endsAt = this.startsAt + this.rules.durationMs;
    for (const seat of this.seats)
      this.hooks.send(seat.info.userId, 'battle:start', this.snapshot(seat.info.userId));
    this.schedule(this.rules.countdownMs, () => this.play());
  }

  private play(): void {
    if (this.status !== 'ready') return;
    this.transition('in_progress');
    this.schedule(this.rules.durationMs, () => this.finish('completed'));
    for (const seat of this.seats) this.sendQuestion(seat);
  }

  private sendQuestion(seat: Seat): void {
    seat.questionSentAt = this.clock.now();
    const question = this.questions[seat.questionIndex];
    if (seat.info.isBot) {
      if (question) this.scheduleBotAnswer(seat, question);
      return;
    }
    // Si está desconectado igual corre su reloj; al volver recibe la pregunta en battle:state.
    if (question && seat.connected) {
      this.hooks.send(
        seat.info.userId,
        'battle:question',
        toQuestionView(question, seat.questionSentAt),
      );
    }
  }

  /** El bot "piensa" según su habilidad y responde por el mismo camino que una persona. */
  private scheduleBotAnswer(seat: Seat, question: RushQuestion): void {
    const move = botMove(botSkill(seat.info.rating), this.random);
    // Escribir lleva más tiempo: el bot tarda lo mismo que el margen extra del bonus.
    const delay = question.write ? move.delayMs * WRITING.timeFactor : move.delayMs;
    this.schedule(delay, () => {
      if (this.isOver || (this.status !== 'in_progress' && this.status !== 'reconnecting')) return;
      if (seat.questionIndex !== question.index) return;
      this.score(seat, question, move.correct);
      this.advance(seat);
    });
  }

  private forfeit(seat: Seat): void {
    if (this.status !== 'in_progress' && this.status !== 'reconnecting') return;
    if (this.status === 'in_progress') this.transition('reconnecting');
    seat.forfeited = true;
    this.finish('forfeited');
  }

  private finish(status: 'completed' | 'forfeited'): void {
    if (this.isOver) return;
    this.clearTimers();
    this.transition(status);
    this.hooks.onFinish(this, status);
  }

  private scores(): ScoreLine[] {
    return this.seats.map((s) => ({
      slot: s.slot,
      score: s.score,
      correct: s.correct,
      answered: s.answered,
      connected: s.connected,
    }));
  }

  private broadcastScores(): void {
    const scores = this.scores();
    for (const seat of this.seats) {
      if (seat.connected) this.hooks.send(seat.info.userId, 'battle:score', { scores });
    }
  }

  private notifyOpponents(changed: Seat): void {
    for (const seat of this.seats) {
      if (seat !== changed && seat.connected) {
        this.hooks.send(seat.info.userId, 'battle:opponent_status', {
          connected: changed.connected,
          graceEndsAt: changed.graceEndsAt,
        });
      }
    }
  }

  private transition(to: BattleStatus): void {
    if (!canTransition(this.status, to)) {
      throw new Error(`Transición inválida ${this.status} → ${to} en ${this.id}`);
    }
    this.status = to;
  }

  private seat(userId: string): Seat | undefined {
    return this.seats.find((s) => s.info.userId === userId);
  }

  private schedule(ms: number, fn: () => void): unknown {
    const handle = this.clock.setTimeout(() => {
      this.timers.delete(handle);
      fn();
    }, ms);
    this.timers.add(handle);
    return handle;
  }

  private unschedule(handle: unknown): void {
    this.clock.clearTimeout(handle);
    this.timers.delete(handle);
  }

  private clearTimers(): void {
    for (const handle of this.timers) this.clock.clearTimeout(handle);
    this.timers.clear();
    for (const seat of this.seats) seat.graceTimer = null;
  }
}
