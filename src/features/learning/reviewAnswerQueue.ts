import { deviceStorage } from '@/lib/secureStorage';

import {
  answerServerReview,
  LearningSessionHttpError,
  type ReviewAnswerResult,
  type ServerReviewAttempt,
} from './api';

/**
 * Cola de respuestas de un repaso del servidor con corrección instantánea
 * (docs/LEARNING_INSTANT_REVIEW.md). La app ya mostró el veredicto; acá cada respuesta se registra en el
 * servidor (answer_review) en segundo plano:
 *
 * - **En orden**: una sola petición en curso; la siguiente sale cuando terminó la anterior.
 * - **Una vez por intento**: la clave es presentación + número de intento. Volver a encolar la misma
 *   clave no manda otra petición (y el servidor, además, se queda con la primera: duplicate).
 * - **Sin red**: la respuesta queda al frente y se reintenta con espera creciente; nada se descarta.
 * - **Cierre inesperado**: lo pendiente se guarda en el dispositivo y se manda antes de retomar la
 *   sesión (replay), así la respuesta no se pierde ni se vuelve a preguntar.
 * - **Sesión terminada** (session_expired / session_closed): el servidor ya no admite respuestas; la
 *   cola se vacía y avisa (la pantalla vuelve a pedir la sesión).
 * - **Rechazo definitivo** de una respuesta (p. ej. presentation_not_found): se descarta esa sola; su
 *   evidencia la corrige igual submit_review.
 *
 * El envío final (submit_review) espera a `flush()`: si se mandara antes, el servidor cerraría la sesión
 * con respuestas todavía en camino.
 */

export interface QueuedAnswer extends ServerReviewAttempt {
  attemptNo: number;
}

export type SendAnswer = (
  sessionId: string,
  attempt: ServerReviewAttempt,
) => Promise<ReviewAnswerResult>;

export interface AnswerStore {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

interface Options {
  send?: SendAnswer;
  storage?: AnswerStore;
  /** Esperas entre reintentos sin red (la última se repite). */
  backoffMs?: readonly number[];
}

/** El servidor ya no admite respuestas en esta sesión. */
export const SESSION_GONE = new Set(['session_expired', 'session_closed']);

/** Errores del servidor que pueden ser pasajeros: se reintenta como sin red. */
const TRANSIENT_CODES = new Set(['server_error', 'unauthorized', 'not_authenticated']);

const BACKOFF_MS = [1_000, 2_000, 5_000, 10_000, 30_000];

export const attemptKeyOf = (presentationId: number, attemptNo: number) =>
  `${presentationId}#${attemptNo}`;

const keyOf = (a: QueuedAnswer) => attemptKeyOf(a.presentationId, a.attemptNo);

const storageKey = (sessionId: string) => `polygo.review.pending.${sessionId}`;

type Listener = { resolve: (r: ReviewAnswerResult) => void; reject: (e: unknown) => void };

function classify(err: unknown): 'gone' | 'rejected' | 'transient' {
  if (err instanceof LearningSessionHttpError) {
    if (SESSION_GONE.has(err.code)) return 'gone';
    return TRANSIENT_CODES.has(err.code) ? 'transient' : 'rejected';
  }
  return 'transient';
}

const isQueued = (v: unknown): v is QueuedAnswer => {
  const a = v as Partial<QueuedAnswer> | null;
  return (
    !!a &&
    typeof a.presentationId === 'number' &&
    typeof a.attemptNo === 'number' &&
    typeof a.responseMs === 'number' &&
    typeof a.answer === 'object' &&
    a.answer !== null
  );
};

export class ReviewAnswerQueue {
  private readonly send: SendAnswer;
  private readonly storage: AnswerStore;
  private readonly backoff: readonly number[];
  private pending: QueuedAnswer[] = [];
  private readonly listeners = new Map<string, Listener[]>();
  /** Correcciones del servidor ya recibidas, por intento (la que vale para la sesión). */
  readonly results = new Map<string, ReviewAnswerResult>();
  private running = false;
  private failures = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private waiters: { resolve: () => void; reject: (e: unknown) => void }[] = [];
  private restored: Promise<void> | null = null;
  private saving: Promise<void> = Promise.resolve();
  /** La sesión ya no admite respuestas (session_expired / session_closed). */
  gone: LearningSessionHttpError | null = null;

  constructor(
    readonly sessionId: string,
    options: Options = {},
  ) {
    this.send = options.send ?? answerServerReview;
    this.storage = options.storage ?? deviceStorage;
    this.backoff = options.backoffMs ?? BACKOFF_MS;
  }

  get size() {
    return this.pending.length;
  }

  /**
   * Registra un intento en segundo plano. Resuelve con la corrección del servidor (cuando llegue, aunque
   * haga falta reintentar); rechaza sólo si el servidor lo rechaza definitivamente o la sesión terminó.
   */
  enqueue(answer: QueuedAnswer): Promise<ReviewAnswerResult> {
    const key = keyOf(answer);
    const done = this.results.get(key);
    if (done) return Promise.resolve(done);
    if (this.gone) return Promise.reject(this.gone);
    const promise = this.listen(key);
    if (!this.pending.some((a) => keyOf(a) === key)) {
      this.pending.push(answer);
      this.persist();
      this.pump();
    }
    return promise;
  }

  /**
   * Espera a que no quede nada pendiente. Reintenta ya (sin esperar la pausa). Rechaza si falla la red
   * mientras tanto (quien envía muestra «Reintentar») o si la sesión terminó.
   */
  flush(): Promise<void> {
    if (this.gone) return Promise.reject(this.gone);
    if (this.pending.length === 0 && !this.running) return Promise.resolve();
    const done = new Promise<void>((resolve, reject) => this.waiters.push({ resolve, reject }));
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.pump();
    return done;
  }

  /** Recupera lo pendiente que quedó guardado (la app se cerró antes de mandarlo). Una sola vez. */
  restore(): Promise<void> {
    this.restored ??= (async () => {
      try {
        const raw = await this.storage.getItem(storageKey(this.sessionId));
        const saved = raw ? (JSON.parse(raw) as unknown) : [];
        for (const a of Array.isArray(saved) ? saved.filter(isQueued) : []) {
          const key = keyOf(a);
          if (!this.results.has(key) && !this.pending.some((p) => keyOf(p) === key)) {
            this.pending.push(a);
          }
        }
      } catch {
        // Almacenamiento ilegible: no hay nada que recuperar.
      }
    })();
    return this.restored;
  }

  /** Antes de retomar la sesión: manda lo pendiente guardado. Una sesión terminada no es un error acá. */
  async replay(): Promise<void> {
    await this.restore();
    try {
      await this.flush();
    } catch (err) {
      if (classify(err) !== 'gone') throw err;
    }
  }

  /** Cancela el próximo reintento programado (lo pendiente sigue guardado). */
  dispose() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  private listen(key: string) {
    return new Promise<ReviewAnswerResult>((resolve, reject) => {
      this.listeners.set(key, [...(this.listeners.get(key) ?? []), { resolve, reject }]);
    });
  }

  private settle(key: string, outcome: { result: ReviewAnswerResult } | { error: unknown }) {
    const list = this.listeners.get(key) ?? [];
    this.listeners.delete(key);
    for (const l of list) {
      if ('result' in outcome) l.resolve(outcome.result);
      else l.reject(outcome.error);
    }
  }

  private persist() {
    const snapshot = JSON.stringify(this.pending);
    const empty = this.pending.length === 0;
    // En orden: la última escritura es la que queda.
    this.saving = this.saving
      .then(() =>
        empty
          ? this.storage.removeItem(storageKey(this.sessionId))
          : this.storage.setItem(storageKey(this.sessionId), snapshot),
      )
      .catch(() => {
        // Sin almacenamiento, lo pendiente sólo vive en memoria; todo lo demás funciona.
      });
  }

  private finishWaiters(error?: unknown) {
    const waiters = this.waiters;
    this.waiters = [];
    for (const w of waiters) {
      if (error === undefined) w.resolve();
      else w.reject(error);
    }
  }

  private pump() {
    if (this.running || this.timer) return;
    void this.run();
  }

  private async run() {
    this.running = true;
    while (this.pending.length > 0) {
      const head = this.pending[0]!;
      const key = keyOf(head);
      try {
        const result = await this.send(this.sessionId, head);
        this.failures = 0;
        this.results.set(key, result);
        this.pending.shift();
        this.persist();
        this.settle(key, { result });
      } catch (err) {
        const kind = classify(err);
        if (kind === 'gone') {
          this.gone = err as LearningSessionHttpError;
          const dropped = this.pending;
          this.pending = [];
          this.persist();
          for (const a of dropped) this.settle(keyOf(a), { error: err });
          this.running = false;
          this.finishWaiters(err);
          return;
        }
        if (kind === 'rejected') {
          this.pending.shift();
          this.persist();
          this.settle(key, { error: err });
          continue;
        }
        // Sin red (o un error pasajero): queda al frente y se reintenta después de una pausa.
        const wait = this.backoff[Math.min(this.failures, this.backoff.length - 1)]!;
        this.failures += 1;
        this.running = false;
        this.finishWaiters(err);
        this.timer = setTimeout(() => {
          this.timer = null;
          this.pump();
        }, wait);
        return;
      }
    }
    this.running = false;
    this.finishWaiters();
  }
}

/** Una cola por sesión, compartida entre montajes de la pantalla (sigue mandando aunque salgas). */
const queues = new Map<string, ReviewAnswerQueue>();

export function reviewAnswerQueue(sessionId: string): ReviewAnswerQueue {
  let q = queues.get(sessionId);
  if (!q) {
    q = new ReviewAnswerQueue(sessionId);
    queues.set(sessionId, q);
  }
  return q;
}
