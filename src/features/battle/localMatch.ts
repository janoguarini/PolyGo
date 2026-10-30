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

  constructor(private readonly deps: LocalMatchDeps) {
    this.dispatch = deps.dispatch;
    this.now = deps.now ?? Date.now;
    this.setTimer = deps.setTimer ?? ((fn, ms) => setTimeout(fn, ms));
    this.clearTimer = deps.clearTimer ?? ((h) => clearTimeout(h as ReturnType<typeof setTimeout>));
    this.random = deps.random ?? Math.random;
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
    const question = this.deps.questions[this.questionIndex];
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
    if (this.mode === 'ranked' && this.battleId !== 'local') {
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
    this.schedule(WORD_RUSH.durationMs, () => void this.finish());
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
    const question = this.deps.questions[this.questionIndex];
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
    const lines: ScoreLine[] = [{ slot: 1, ...this.me, connected: true }];
    if (this.mode === 'ranked') lines.push({ slot: 2, ...this.bot, connected: true });
    return lines;
  }

  private emitScores(): void {
    this.dispatch({ type: 'scores', scores: this.scores() });
  }

  private emitSnapshot(): void {
    const question =
      this.status === 'in_progress' ? this.deps.questions[this.questionIndex] : undefined;
    const now = this.now();
    const snapshot: BattleSnapshot = {
      battleId: this.battleId,
      mode: this.mode,
      status: this.status,
      yourSlot: 1,
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
