import {
  LearningSessionHttpError,
  type ReviewAnswerResult,
  type ServerReviewAttempt,
} from '../api';
import { ReviewAnswerQueue, type AnswerStore, type QueuedAnswer } from '../reviewAnswerQueue';

/**
 * Cola de respuestas de la corrección instantánea: en orden, una vez por intento, sin perder nada sin
 * red ni al cerrar la app, y el envío final espera a que termine.
 */

jest.mock('@/lib/supabase', () => ({ requireSupabase: jest.fn() }));

function memoryStore(): AnswerStore & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: async (k) => data.get(k) ?? null,
    setItem: async (k, v) => {
      data.set(k, v);
    },
    removeItem: async (k) => {
      data.delete(k);
    },
  };
}

const answer = (presentationId: number, attemptNo = 1): QueuedAnswer => ({
  presentationId,
  attemptNo,
  answer: { kind: 'option', value: `r${presentationId}` },
  responseMs: 900,
  clientVerdict: 'correct',
});

const result = (a: ServerReviewAttempt, verdict: 'correct' | 'incorrect' = 'correct') =>
  ({
    presentation_id: a.presentationId,
    attempt_no: a.attemptNo,
    duplicate: false,
    matches: true,
    response: a.answer,
    status: 'valid',
    verdict,
    response_ms: a.responseMs,
    assists: {},
    answer: 'hola',
    explanation: null,
  }) as ReviewAnswerResult;

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const flushMicrotasks = () => new Promise<void>((r) => setImmediate(r));

const SESSION = '11111111-1111-4111-8111-111111111111';
const KEY = `polygo.review.pending.${SESSION}`;

const created: ReviewAnswerQueue[] = [];
const Queue = new Proxy(ReviewAnswerQueue, {
  construct(target, args: ConstructorParameters<typeof ReviewAnswerQueue>) {
    const q = new target(...args);
    created.push(q);
    return q;
  },
});
afterEach(() => {
  for (const q of created.splice(0)) q.dispose();
});

describe('ReviewAnswerQueue', () => {
  it('manda en orden, una petición a la vez', async () => {
    const calls: number[] = [];
    const gates = [deferred<void>(), deferred<void>(), deferred<void>()];
    const send = jest.fn(async (_s: string, a: ServerReviewAttempt) => {
      calls.push(a.presentationId);
      await gates[calls.length - 1]!.promise;
      return result(a);
    });
    const q = new Queue(SESSION, { send, storage: memoryStore() });
    const done = [q.enqueue(answer(1)), q.enqueue(answer(2)), q.enqueue(answer(3))];
    await flushMicrotasks();
    expect(calls).toEqual([1]);
    gates[0]!.resolve();
    await done[0];
    await flushMicrotasks();
    expect(calls).toEqual([1, 2]);
    gates[1]!.resolve();
    gates[2]!.resolve();
    await Promise.all(done);
    expect(calls).toEqual([1, 2, 3]);
    expect(q.size).toBe(0);
  });

  it('el mismo intento se registra una sola vez (doble toque, reencolar, ya registrado)', async () => {
    const send = jest.fn(async (_s: string, a: ServerReviewAttempt) => result(a));
    const q = new Queue(SESSION, { send, storage: memoryStore() });
    const [a, b] = [q.enqueue(answer(1)), q.enqueue(answer(1))];
    expect(await a).toEqual(await b);
    expect(await q.enqueue(answer(1))).toEqual(await a);
    // Otro intento de la misma presentación (repetición de un error) sí es otra petición.
    await q.enqueue(answer(1, 2));
    expect(send.mock.calls.map(([, x]) => [x.presentationId, x.attemptNo])).toEqual([
      [1, 1],
      [1, 2],
    ]);
  });

  it('sin red: reintenta con espera, sin saltear ni reordenar', async () => {
    jest.useFakeTimers();
    try {
      let online = false;
      const send = jest.fn(async (_s: string, a: ServerReviewAttempt) => {
        if (!online) throw new Error('Network request failed');
        return result(a);
      });
      const q = new Queue(SESSION, { send, storage: memoryStore(), backoffMs: [100] });
      const first = q.enqueue(answer(1));
      const second = q.enqueue(answer(2));
      await jest.advanceTimersByTimeAsync(0);
      expect(send).toHaveBeenCalledTimes(1);
      await jest.advanceTimersByTimeAsync(100);
      expect(send).toHaveBeenCalledTimes(2);
      expect(send.mock.calls.every(([, a]) => a.presentationId === 1)).toBe(true);
      online = true;
      await jest.advanceTimersByTimeAsync(100);
      await expect(first).resolves.toMatchObject({ presentation_id: 1 });
      await expect(second).resolves.toMatchObject({ presentation_id: 2 });
      expect(send.mock.calls.map(([, a]) => a.presentationId)).toEqual([1, 1, 1, 2]);
    } finally {
      jest.useRealTimers();
    }
  });

  it('flush espera lo pendiente y reintenta ya; sin red rechaza (el guardado ofrece reintentar)', async () => {
    jest.useFakeTimers();
    try {
      let online = false;
      const send = jest.fn(async (_s: string, a: ServerReviewAttempt) => {
        if (!online) throw new Error('Network request failed');
        return result(a);
      });
      const q = new Queue(SESSION, { send, storage: memoryStore(), backoffMs: [60_000] });
      void q.enqueue(answer(1));
      await jest.advanceTimersByTimeAsync(0);
      await expect(q.flush()).rejects.toThrow('Network request failed');
      online = true;
      // No espera el minuto de pausa: reintenta en el momento.
      await expect(q.flush()).resolves.toBeUndefined();
      expect(q.size).toBe(0);
      expect(q.results.get('1#1')).toMatchObject({ verdict: 'correct' });
    } finally {
      jest.useRealTimers();
    }
  });

  it('flush sin nada pendiente resuelve enseguida', async () => {
    const q = new Queue(SESSION, { send: jest.fn(), storage: memoryStore() });
    await expect(q.flush()).resolves.toBeUndefined();
  });

  it('lo pendiente se guarda en el dispositivo y se manda al retomar (cierre inesperado)', async () => {
    const store = memoryStore();
    const offline = jest.fn(async () => {
      throw new Error('Network request failed');
    });
    const before = new Queue(SESSION, { send: offline, storage: store, backoffMs: [1e9] });
    void before.enqueue(answer(1));
    void before.enqueue(answer(2, 1));
    await flushMicrotasks();
    await flushMicrotasks();
    expect(JSON.parse(store.data.get(KEY)!)).toHaveLength(2);

    // La app se cerró: otra cola (otro proceso) con el mismo almacenamiento.
    const send = jest.fn(async (_s: string, a: ServerReviewAttempt) => result(a));
    const after = new Queue(SESSION, { send, storage: store });
    await after.replay();
    expect(send.mock.calls.map(([, a]) => a.presentationId)).toEqual([1, 2]);
    await flushMicrotasks();
    expect(store.data.has(KEY)).toBe(false);
  });

  it('al retomar sin red, replay falla (la pantalla muestra «Reintentar») y no pierde nada', async () => {
    const store = memoryStore();
    store.data.set(KEY, JSON.stringify([answer(1)]));
    const send = jest.fn(async () => {
      throw new Error('Network request failed');
    });
    const q = new Queue(SESSION, { send, storage: store, backoffMs: [1e9] });
    await expect(q.replay()).rejects.toThrow('Network request failed');
    expect(q.size).toBe(1);
    expect(JSON.parse(store.data.get(KEY)!)).toHaveLength(1);
  });

  it('sesión terminada (session_expired / session_closed): vacía la cola y avisa', async () => {
    const store = memoryStore();
    const gone = new LearningSessionHttpError('session_expired');
    const send = jest.fn(async () => {
      throw gone;
    });
    const q = new Queue(SESSION, { send, storage: store });
    const a = q.enqueue(answer(1));
    const b = q.enqueue(answer(2));
    await expect(a).rejects.toBe(gone);
    await expect(b).rejects.toBe(gone);
    expect(send).toHaveBeenCalledTimes(1);
    await expect(q.flush()).rejects.toBe(gone);
    await expect(q.enqueue(answer(3))).rejects.toBe(gone);
    // Antes de retomar, una sesión terminada no es un error: el servidor dice qué hacer.
    await expect(q.replay()).resolves.toBeUndefined();
    await flushMicrotasks();
    expect(store.data.has(KEY)).toBe(false);
  });

  it('un rechazo definitivo descarta sólo esa respuesta y sigue con las demás', async () => {
    const send = jest.fn(async (_s: string, a: ServerReviewAttempt) => {
      if (a.presentationId === 1) throw new LearningSessionHttpError('presentation_not_found');
      return result(a);
    });
    const q = new Queue(SESSION, { send, storage: memoryStore() });
    const a = q.enqueue(answer(1));
    const b = q.enqueue(answer(2));
    await expect(a).rejects.toMatchObject({ code: 'presentation_not_found' });
    await expect(b).resolves.toMatchObject({ presentation_id: 2 });
    await expect(q.flush()).resolves.toBeUndefined();
  });

  it('un error pasajero del servidor (server_error) se reintenta como sin red', async () => {
    jest.useFakeTimers();
    try {
      let fail = true;
      const send = jest.fn(async (_s: string, a: ServerReviewAttempt) => {
        if (fail) {
          fail = false;
          throw new LearningSessionHttpError('server_error');
        }
        return result(a);
      });
      const q = new Queue(SESSION, { send, storage: memoryStore(), backoffMs: [50] });
      const a = q.enqueue(answer(1));
      await jest.advanceTimersByTimeAsync(50);
      await expect(a).resolves.toMatchObject({ presentation_id: 1 });
      expect(send).toHaveBeenCalledTimes(2);
    } finally {
      jest.useRealTimers();
    }
  });
});
