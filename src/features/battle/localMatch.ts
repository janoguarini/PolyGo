import { BOT_CONFIG } from '@shared/bots';
import {
  WORD_RUSH,
  type BattleFinish,
  type BattleMode,
  type BattleSnapshot,
  type BattleStatus,
  type PlayerResult,
  type PublicPlayer,
  type ScoreLine,
} from '@shared/protocol';
import { answerPoints, applyPoints, toQuestionView, type RushQuestion } from '@shared/wordRush';

import type { BattleAction } from './state';

/**
 * Partida Word Rush sin servidor de partidas: corre en el teléfono y emite las mismas acciones que
 * los eventos del servidor, así la pantalla de batalla no cambia. En ranked el bot y su guion los
 * decide la base (start_bot_match) y el resultado y el ELO también (finish_bot_match); acá sólo se
 * reproducen. La práctica es local y no se guarda.
 */

export interface BotMoveScript {
  /** Milisegundos desde la jugada anterior. */
  d: number;
  /** Si acierta. */
  c: boolean;
}

export interface StartedBotMatch {
  battle_id: string;
  me: { rating: number; games_played: number };
  bot: { name: string; avatar_id: string; rating: number };
  script: BotMoveScript[];
}

export interface FinishedBotMatch {
  battle_id: string;
  status: 'completed' | 'forfeited';
  me: {
    score: number;
    correct: number;
    answered: number;
    result: 'win' | 'loss' | 'draw';
    forfeited: boolean;
    rating_before: number;
    rating_after: number;
  };
  bot: { name: string; score: number; correct: number; answered: number; result: string };
  achievements: { id: string; title: string; icon: string }[];
}

export interface LocalMatchApi {
  start(): Promise<StartedBotMatch>;
  finish(
    battleId: string,
    line: { score: number; correct: number; answered: number },
    forfeit: boolean,
  ): Promise<FinishedBotMatch>;
}

/** Partida contra una persona creada por la base (get_human_match). Horarios en ms del servidor. */
export interface HumanMatchSetup {
  battle_id: string;
  /** false: desafío a un amigo, sin ELO. */
  ranked: boolean;
  your_slot: 1 | 2;
  server_now: number;
  starts_at: number;
  ends_at: number;
  questions: RushQuestion[];
  players: {
    slot: 1 | 2;
    username: string;
    avatar_id: string;
    avatar_path: string | null;
    rating: number;
    games_played: number;
  }[];
}

/** Resultado de finish_human_match / human_match_result. */
export type HumanMatchResult =
  | { pending: true }
  | {
      pending: false;
      battle_id: string;
      status: 'completed' | 'forfeited';
      ranked: boolean;
      achievements: Record<string, { id: string; title: string; icon: string }[]>;
      players: {
        slot: 1 | 2;
        username: string;
        score: number;
        correct: number;
        answered: number;
        result: 'win' | 'loss' | 'draw';
        forfeited: boolean;
        rating_before: number | null;
        rating_after: number | null;
      }[];
    };

export interface HumanMatchApi {
  finish(
    battleId: string,
    line: { score: number; correct: number; answered: number },
    forfeit: boolean,
  ): Promise<HumanMatchResult>;
  result(battleId: string): Promise<HumanMatchResult>;
}

export interface LocalPlayer {
  username: string;
  avatarId: string;
  avatarPath: string | null;
}

export interface LocalMatchDeps {
  dispatch: (action: BattleAction) => void;
  api: LocalMatchApi;
  me: LocalPlayer;
  questions: RushQuestion[];
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => unknown;
  clearTimer?: (handle: unknown) => void;
  random?: () => number;
  /** Se llama con el resultado de cada respuesta (sonido, vibración). */
  onAnswer?: (correct: boolean) => void;
  /** Ranked guardado: refrescar perfil, logros, clasificación. */
  onRankedFinished?: () => void;
  feedbackMs?: number;
  /** Reintentos al guardar el resultado (red inestable). */
  finishAttempts?: number;
  /** Partidas contra personas (Supabase). */
  human?: HumanMatchApi;
  /** Para elegir los logros propios del resultado de una partida contra una persona. */
  userId?: string;
  /** Cada vez que cambia el puntaje propio (para mostrárselo al rival en vivo). */
  onLineChange?: (line: { score: number; correct: number; answered: number }) => void;
  /** Cada cuánto se consulta si el rival ya informó su puntaje. */
  resultPollMs?: number;
}

interface Line {
  score: number;
  correct: number;
  answered: number;
}

const emptyLine = (): Line => ({ score: 0, correct: 0, answered: 0 });

export class LocalMatch {
  private readonly dispatch: LocalMatchDeps['dispatch'];
  private readonly now: () => number;
  private readonly setTimer: (fn: () => void, ms: number) => unknown;
  private readonly clearTimer: (handle: unknown) => void;
  private readonly random: () => number;
  private timers = new Set<unknown>();

  private mode: BattleMode = 'ranked';
  private status: BattleStatus = 'matched';
  private battleId = 'local';
  private players: PublicPlayer[] = [];
  private me: Line = emptyLine();
  private bot: Line = emptyLine();
  private questionIndex = 0;
  private questionSentAt = 0;
  private startsAt: number | null = null;
  private endsAt: number | null = null;
  private readyDeadline: number | null = null;
  private script: BotMoveScript[] = [];
  private finished = false;
  private opponentKind: 'bot' | 'human' = 'bot';
  private yourSlot: 1 | 2 = 1;
  private questions: RushQuestion[];

  constructor(private readonly deps: LocalMatchDeps) {
    this.dispatch = deps.dispatch;
    this.now = deps.now ?? Date.now;
    this.setTimer = deps.setTimer ?? ((fn, ms) => setTimeout(fn, ms));
    this.clearTimer = deps.clearTimer ?? ((h) => clearTimeout(h as ReturnType<typeof setTimeout>));
    this.random = deps.random ?? Math.random;
    this.questions = deps.questions;
  }

  /** Ranked: pide el bot a la base y lo anuncia. Práctica: arranca la cuenta atrás. */
  async begin(mode: BattleMode): Promise<void> {
    this.mode = mode;
    const meBase = {
      username: this.deps.me.username,
      avatarId: this.deps.me.avatarId,
      avatarPath: this.deps.me.avatarPath,
      isBot: false,
    };
    if (mode === 'practice') {
      this.players = [{ slot: 1, ...meBase, rating: 0, gamesPlayed: 0 }];
      this.dispatch({ type: 'joined', mode });
      this.startCountdown();
      return;
    }

    const started = await this.deps.api.start();
    this.battleId = started.battle_id;
    this.script = started.script;
    this.players = [
      { slot: 1, ...meBase, rating: started.me.rating, gamesPlayed: started.me.games_played },
      {
        slot: 2,
        username: started.bot.name,
        avatarId: started.bot.avatar_id,
        avatarPath: null,
        isBot: true,
        rating: started.bot.rating,
        gamesPlayed: BOT_CONFIG.displayedGames,
      },
    ];
    this.status = 'matched';
    this.readyDeadline = this.now() + WORD_RUSH.readyTimeoutMs;
    this.emitSnapshot();
    // Si no confirma a tiempo, la partida igual empieza (ya está creada en la base).
    this.schedule(WORD_RUSH.readyTimeoutMs, () => this.ready());
  }

  /**
   * Partida contra una persona: la base ya la creó con las preguntas y la hora de inicio (igual
   * para los dos). Sin confirmación: arranca la cuenta atrás hasta esa hora.
   */
  beginHuman(setup: HumanMatchSetup): void {
    this.mode = 'ranked';
    this.opponentKind = 'human';
    this.battleId = setup.battle_id;
    this.yourSlot = setup.your_slot;
    this.questions = setup.questions;
    this.players = setup.players.map((p) => ({
      slot: p.slot,
      username: p.username,
      avatarId: p.avatar_id,
      avatarPath: p.avatar_path,
      isBot: false,
      rating: p.rating,
      gamesPlayed: p.games_played,
    }));
    // Horarios del servidor pasados al reloj local.
    const offset = setup.server_now - this.now();
    this.status = 'ready';
    this.readyDeadline = null;
    this.startsAt = setup.starts_at - offset;
    this.endsAt = setup.ends_at - offset;
    this.emitSnapshot();
    this.schedule(Math.max(0, this.startsAt - this.now()), () => this.play());
  }

  /** Puntaje del rival que llegó en vivo (no autoritativo: el resultado lo decide la base). */
  opponentUpdate(line: { score: number; correct: number; answered: number }): void {
    if (this.opponentKind !== 'human' || this.finished) return;
    this.bot = { score: line.score, correct: line.correct, answered: line.answered };
    this.emitScores();
  }

  /** El jugador confirmó: el bot confirma con una demora de persona y arranca la cuenta atrás. */
  ready(): void {
    if (this.status !== 'matched' || this.finished) return;
    this.status = 'ready';
    this.clearAll();
    const { min, max } = BOT_CONFIG.readyMs;
    this.schedule(min + this.random() * (max - min), () => this.startCountdown());
  }

  answer(option: number): void {
    if (this.status !== 'in_progress' || this.finished) return;
    const question = this.questions[this.questionIndex];
    if (!question) return;
    this.dispatch({ type: 'answer_sent' });
    const correct = option === question.correctOption;
    const points = answerPoints(correct, this.now() - this.questionSentAt);
    this.me = {
      score: applyPoints(this.me.score, points),
      correct: this.me.correct + (correct ? 1 : 0),
      answered: this.me.answered + 1,
    };
    this.dispatch({
      type: 'answer_result',
      chosen: option,
      result: {
        questionIndex: question.index,
        correct,
        correctOption: question.correctOption,
        points,
        score: this.me.score,
      },
    });
    this.deps.onAnswer?.(correct);
    this.deps.onLineChange?.(this.me);
    this.schedule(this.deps.feedbackMs ?? 350, () => this.dispatch({ type: 'feedback_done' }));
    this.emitScores();
    this.questionIndex += 1;
    this.sendQuestion();
  }

  /** Abandono: en ranked, una vez anunciado el rival, cuenta como derrota. */
  leave(): void {
    if (this.finished) return;
    this.finished = true;
    this.clearAll();
    if (this.mode === 'ranked' && this.opponentKind === 'human' && this.deps.human) {
      void this.deps.human.finish(this.battleId, this.me, true).then(
        () => this.deps.onRankedFinished?.(),
        () => {}, // Si falla, la base lo da por abandono cuando vence el plazo.
      );
    } else if (this.mode === 'ranked' && this.battleId !== 'local') {
      void this.deps.api.finish(this.battleId, this.me, true).then(
        () => this.deps.onRankedFinished?.(),
        () => {}, // Si falla, la base la cierra como abandono al empezar la próxima.
      );
    }
  }

  dispose(): void {
    this.clearAll();
  }

  // ---------- internos ----------

  private startCountdown(): void {
    if (this.finished) return;
    this.status = 'ready';
    this.readyDeadline = null;
    this.startsAt = this.now() + WORD_RUSH.countdownMs;
    this.endsAt = this.startsAt + WORD_RUSH.durationMs;
    this.emitSnapshot();
    this.schedule(WORD_RUSH.countdownMs, () => this.play());
  }

  private play(): void {
    if (this.finished) return;
    this.status = 'in_progress';
    this.questionIndex = 0;
    this.questionSentAt = this.now();
    this.emitSnapshot();
    const endsIn = this.endsAt === null ? WORD_RUSH.durationMs : this.endsAt - this.now();
    this.schedule(Math.max(0, endsIn), () => void this.finish());
    if (this.opponentKind === 'human') return;
    // El bot reproduce su guion: cada jugada en su momento.
    let at = 0;
    for (const move of this.script) {
      at += move.d;
      if (at > WORD_RUSH.durationMs) break;
      this.schedule(at, () => {
        this.bot = {
          score: applyPoints(this.bot.score, answerPoints(move.c, move.d)),
          correct: this.bot.correct + (move.c ? 1 : 0),
          answered: this.bot.answered + 1,
        };
        this.emitScores();
      });
    }
  }

  private sendQuestion(): void {
    const question = this.questions[this.questionIndex];
    this.questionSentAt = this.now();
    if (question) {
      this.dispatch({ type: 'question', question: toQuestionView(question, this.questionSentAt) });
    }
  }

  private async finish(): Promise<void> {
    if (this.finished) return;
    this.finished = true;
    this.clearAll();
    this.status = 'completed';

    if (this.mode === 'practice') {
      this.dispatch({ type: 'finished', result: this.practiceResult() });
      return;
    }
    if (this.opponentKind === 'human') {
      await this.finishHuman();
      return;
    }

    const attempts = this.deps.finishAttempts ?? 3;
    for (let attempt = 1; ; attempt++) {
      try {
        const saved = await this.deps.api.finish(this.battleId, this.me, false);
        this.dispatch({ type: 'finished', result: this.rankedResult(saved) });
        this.deps.onRankedFinished?.();
        return;
      } catch {
        if (attempt >= attempts) {
          this.dispatch({ type: 'cancelled', reason: 'settlement_failed' });
          return;
        }
        await new Promise((resolve) => this.setTimer(() => resolve(null), 1_000 * attempt));
      }
    }
  }

  /** Informa el puntaje y espera el del rival (o el vencimiento del plazo, que decide la base). */
  private async finishHuman(): Promise<void> {
    const api = this.deps.human!;
    const pollMs = this.deps.resultPollMs ?? 2_000;
    const wait = () => new Promise((resolve) => this.setTimer(() => resolve(null), pollMs));
    let submitted = false;
    let failures = 0;
    let result: HumanMatchResult | null = null;
    // Hasta ~50 s después del final: la base cierra la partida a los 30 s de gracia.
    for (let i = 0; i < 25; i++) {
      try {
        result = submitted
          ? await api.result(this.battleId)
          : await api.finish(this.battleId, this.me, false);
        submitted = true;
        failures = 0;
        if (!result.pending) break;
      } catch {
        if (++failures >= (this.deps.finishAttempts ?? 3)) break;
      }
      await wait();
    }
    if (!result || result.pending) {
      this.dispatch({ type: 'cancelled', reason: 'settlement_failed' });
      return;
    }
    this.dispatch({ type: 'finished', result: this.humanResult(result) });
    this.deps.onRankedFinished?.();
  }

  private humanResult(saved: Extract<HumanMatchResult, { pending: false }>): BattleFinish {
    return {
      battleId: saved.battle_id,
      mode: 'ranked',
      status: saved.status,
      yourSlot: this.yourSlot,
      players: saved.players.map((p) => ({
        slot: p.slot,
        username: p.username,
        isBot: false,
        score: p.score,
        correct: p.correct,
        answered: p.answered,
        outcome: p.result,
        forfeited: p.forfeited,
        ratingBefore: p.rating_before,
        ratingAfter: p.rating_after,
      })),
      achievementsUnlocked: (this.deps.userId && saved.achievements[this.deps.userId]) || [],
      friendly: !saved.ranked,
    };
  }

  private rankedResult(saved: FinishedBotMatch): BattleFinish {
    const [meInfo, botInfo] = this.players;
    const players: PlayerResult[] = [
      {
        slot: 1,
        username: meInfo!.username,
        isBot: false,
        score: saved.me.score,
        correct: saved.me.correct,
        answered: saved.me.answered,
        outcome: saved.me.result,
        forfeited: saved.me.forfeited,
        ratingBefore: saved.me.rating_before,
        ratingAfter: saved.me.rating_after,
      },
      {
        slot: 2,
        username: botInfo!.username,
        isBot: true,
        score: saved.bot.score,
        correct: saved.bot.correct,
        answered: saved.bot.answered,
        outcome: saved.bot.result as PlayerResult['outcome'],
        forfeited: false,
        ratingBefore: null,
        ratingAfter: null,
      },
    ];
    return {
      battleId: saved.battle_id,
      mode: 'ranked',
      status: saved.status,
      yourSlot: 1,
      players,
      achievementsUnlocked: saved.achievements,
    };
  }

  private practiceResult(): BattleFinish {
    return {
      battleId: this.battleId,
      mode: 'practice',
      status: 'completed',
      yourSlot: 1,
      players: [
        {
          slot: 1,
          username: this.deps.me.username,
          isBot: false,
          ...this.me,
          outcome: null,
          forfeited: false,
          ratingBefore: null,
          ratingAfter: null,
        },
      ],
      achievementsUnlocked: [],
    };
  }

  private scores(): ScoreLine[] {
    const lines: ScoreLine[] = [{ slot: this.yourSlot, ...this.me, connected: true }];
    if (this.mode === 'ranked') {
      lines.push({ slot: this.yourSlot === 1 ? 2 : 1, ...this.bot, connected: true });
    }
    return lines.sort((a, b) => a.slot - b.slot);
  }

  private emitScores(): void {
    this.dispatch({ type: 'scores', scores: this.scores() });
  }

  private emitSnapshot(): void {
    const question = this.status === 'in_progress' ? this.questions[this.questionIndex] : undefined;
    const now = this.now();
    const snapshot: BattleSnapshot = {
      battleId: this.battleId,
      mode: this.mode,
      status: this.status,
      yourSlot: this.yourSlot,
      players: this.players,
      serverNow: now,
      readyDeadline: this.readyDeadline,
      startsAt: this.startsAt,
      endsAt: this.endsAt,
      question: question ? toQuestionView(question, this.questionSentAt) : null,
      scores: this.scores(),
    };
    this.dispatch({ type: 'snapshot', snapshot, receivedAt: now });
  }

  private schedule(ms: number, fn: () => void): void {
    const handle = this.setTimer(() => {
      this.timers.delete(handle);
      fn();
    }, ms);
    this.timers.add(handle);
  }

  private clearAll(): void {
    for (const handle of this.timers) this.clearTimer(handle);
    this.timers.clear();
  }
}
