import {
  answerServerReview,
  LearningSessionHttpError,
  startServerReview,
  submitServerReview,
} from '../api';
import { LEARNING_CONTRACT } from '@shared/learningSession';

/**
 * Repasos del servidor: lo que la app manda a learning-session v3 (start_review / answer_review /
 * submit_review) y cómo trata las respuestas. Ningún error hace caer a submit_learning_session: la
 * corrección del cliente nunca es autoritativa en un repaso.
 */

const mockRpc = jest.fn();
const mockInvoke = jest.fn();
jest.mock('@/lib/supabase', () => ({
  requireSupabase: () => ({ rpc: mockRpc, functions: { invoke: mockInvoke } }),
}));

const SESSION = '00000000-0000-4000-8000-0000000000aa';

const httpError = (code: string) => ({
  data: null,
  error: { name: 'FunctionsHttpError', context: { json: async () => ({ error: code }) } },
});
/** Sin red / tiempo agotado: supabase-js no trae cuerpo. */
const networkError = () => ({
  data: null,
  error: Object.assign(new Error('Failed to send a request'), { name: 'FunctionsFetchError' }),
});

const body = () => mockInvoke.mock.calls[0]![1].body as Record<string, unknown>;
const options = () => mockInvoke.mock.calls[0]![1] as { timeout: number };

beforeEach(() => {
  mockRpc.mockReset();
  mockInvoke.mockReset();
});

afterEach(() => {
  // Ningún flujo de repaso usa la RPC vieja (veredicto del cliente).
  expect(mockRpc).not.toHaveBeenCalled();
});

describe('startServerReview', () => {
  it('pide start_review con el idioma, la zona, el contrato y un tiempo límite', async () => {
    mockInvoke.mockResolvedValue({ data: { session_id: SESSION, status: 'ok', items: [] } });
    const res = await startServerReview(SESSION, 'it');
    expect(mockInvoke).toHaveBeenCalledWith('learning-session', expect.anything());
    expect(body()).toMatchObject({
      action: 'start_review',
      session_id: SESSION,
      language_code: 'it',
      time_zone: expect.any(String),
      client: { contract: LEARNING_CONTRACT },
    });
    expect(body()).not.toHaveProperty('focus');
    expect(options().timeout).toBeGreaterThan(0);
    expect(res.status).toBe('ok');
  });

  it('Plus: manda el foco; el servidor decide y plus_required llega como código', async () => {
    mockInvoke.mockResolvedValue(httpError('plus_required'));
    const err = await startServerReview(SESSION, 'en', { kind: 'topic', unit_id: 'a1-u02' }).catch(
      (e: unknown) => e,
    );
    expect(body().focus).toEqual({ kind: 'topic', unit_id: 'a1-u02' });
    expect(err).toBeInstanceOf(LearningSessionHttpError);
    expect((err as LearningSessionHttpError).code).toBe('plus_required');
  });

  it.each([null, {}, { status: 'ok' }, { status: 1, items: [] }, { items: [] }])(
    'respuesta inesperada %j → error, no un repaso vacío',
    async (data) => {
      mockInvoke.mockResolvedValue({ data, error: null });
      await expect(startServerReview(SESSION, 'en')).rejects.toThrow('invalid_start_response');
    },
  );

  it('sin red: el error de red se propaga tal cual (la pantalla ofrece reintentar)', async () => {
    mockInvoke.mockResolvedValue(networkError());
    await expect(startServerReview(SESSION, 'en')).rejects.toThrow('Failed to send a request');
  });
});

describe('answerServerReview', () => {
  it('manda la respuesta estructurada, primer intento por defecto, ms redondeados', async () => {
    mockInvoke.mockResolvedValue({
      data: { presentation_id: 7, status: 'valid', verdict: 'correct', duplicate: false },
    });
    await answerServerReview(SESSION, {
      presentationId: 7,
      answer: { kind: 'text', value: 'ciao' },
      responseMs: 1234.6,
    });
    expect(body()).toMatchObject({
      action: 'answer_review',
      session_id: SESSION,
      attempt: {
        presentation_id: 7,
        answer: { kind: 'text', value: 'ciao' },
        response_ms: 1235,
        assists: {},
        attempt_no: 1,
      },
    });
    // Sin corrección instantánea la app no manda veredicto propio.
    expect(JSON.stringify(body())).not.toMatch(/client_verdict|correct"/);
  });

  it('corrección instantánea: manda el veredicto que mostró la app (sólo para comparar)', async () => {
    mockInvoke.mockResolvedValue({ data: { status: 'valid', verdict: 'correct' } });
    await answerServerReview(SESSION, {
      presentationId: 7,
      answer: { kind: 'option', value: 'x' },
      responseMs: 10,
      clientVerdict: 'typo',
    });
    expect(body().attempt).toMatchObject({ attempt_no: 1, client_verdict: 'typo' });
  });

  it('repetición de un error (P4): manda su número de intento y las ayudas', async () => {
    mockInvoke.mockResolvedValue({ data: { status: 'valid', verdict: 'incorrect' } });
    await answerServerReview(SESSION, {
      presentationId: 7,
      answer: { kind: 'option', value: 'x' },
      responseMs: 10,
      attemptNo: 2,
      assists: { reading_visible: true },
    });
    expect(body().attempt).toMatchObject({ attempt_no: 2, assists: { reading_visible: true } });
  });

  it.each(['session_expired', 'session_closed', 'retry_not_allowed', 'invalid_request'])(
    'rechazo %s → LearningSessionHttpError con el código',
    async (code) => {
      mockInvoke.mockResolvedValue(httpError(code));
      const err = await answerServerReview(SESSION, {
        presentationId: 7,
        answer: { kind: 'option', value: 'x' },
        responseMs: 10,
      }).catch((e: unknown) => e);
      expect(err).toBeInstanceOf(LearningSessionHttpError);
      expect((err as LearningSessionHttpError).code).toBe(code);
    },
  );

  it('respuesta sin status → error (no se inventa un veredicto)', async () => {
    mockInvoke.mockResolvedValue({ data: { verdict: 'correct' }, error: null });
    await expect(
      answerServerReview(SESSION, {
        presentationId: 7,
        answer: { kind: 'option', value: 'x' },
        responseMs: 10,
      }),
    ).rejects.toThrow('invalid_answer_response');
  });
});

describe('submitServerReview', () => {
  const input = {
    sessionId: SESSION,
    startedAt: new Date('2026-11-09T10:00:00Z'),
    attempts: [
      { presentationId: 7, answer: { kind: 'option' as const, value: 'hola' }, responseMs: 900.4 },
      {
        presentationId: 8,
        answer: { kind: 'text' as const, value: 'casa' },
        responseMs: 1500,
        attemptNo: 1,
      },
    ],
  };

  it('manda submit_review con una respuesta por presentación, sin veredicto ni attempt_no', async () => {
    mockInvoke.mockResolvedValue({ data: { session_id: SESSION, duplicate: false } });
    const res = await submitServerReview(input);
    expect(body()).toMatchObject({
      action: 'submit_review',
      session_id: SESSION,
      started_at: '2026-11-09T10:00:00.000Z',
      time_zone: expect.any(String),
    });
    expect(body().attempts).toEqual([
      {
        presentation_id: 7,
        answer: { kind: 'option', value: 'hola' },
        response_ms: 900,
        assists: {},
      },
      {
        presentation_id: 8,
        answer: { kind: 'text', value: 'casa' },
        response_ms: 1500,
        assists: {},
      },
    ]);
    expect(res.duplicate).toBe(false);
  });

  it('reenvío del mismo session_id (respuesta perdida): el servidor contesta duplicate', async () => {
    mockInvoke.mockResolvedValue({ data: { session_id: SESSION, duplicate: true } });
    await expect(submitServerReview(input)).resolves.toMatchObject({ duplicate: true });
  });

  it.each([null, 'ok', {}, { duplicate: false }])(
    'respuesta inesperada %j → error (no se da por guardado)',
    async (data) => {
      mockInvoke.mockResolvedValue({ data, error: null });
      await expect(submitServerReview(input)).rejects.toThrow('invalid_submit_response');
    },
  );

  it.each(['answer_mismatch', 'invalid_gradings', 'session_expired'])(
    'rechazo %s → error con el código, sin ruta vieja',
    async (code) => {
      mockInvoke.mockResolvedValue(httpError(code));
      const err = await submitServerReview(input).catch((e: unknown) => e);
      expect((err as LearningSessionHttpError).code).toBe(code);
    },
  );

  it('sin red → error, sin ruta vieja', async () => {
    mockInvoke.mockResolvedValue(networkError());
    await expect(submitServerReview(input)).rejects.toThrow('Failed to send a request');
  });
});
