import { botMatchApi, botMatchErrorCode } from '../botMatchApi';
import { humanMatchApi } from '../humanMatchApi';

const mockRpc = jest.fn();
jest.mock('@/lib/supabase', () => ({ requireSupabase: () => ({ rpc: mockRpc }) }));

/** Como responde PostgREST cuando se revoca EXECUTE (paso 3 del corte en docs/DEPLOYMENT.md). */
const revoked = (fn: string) => ({
  data: null,
  error: { code: '42501', message: `permission denied for function ${fn}` },
});

const codeOf = async (call: () => Promise<unknown>) => {
  try {
    await call();
  } catch (error) {
    return botMatchErrorCode(error);
  }
  throw new Error('esperaba un error');
};

beforeEach(() => mockRpc.mockReset());

describe('Ranked viejo cerrado para versiones viejas', () => {
  it('start_bot_match, finish_bot_match, join_human_queue y leave_human_queue piden actualizar', async () => {
    mockRpc.mockResolvedValue(revoked('start_bot_match'));
    expect(await codeOf(() => botMatchApi.start())).toBe('protocol_mismatch');

    mockRpc.mockResolvedValue(revoked('finish_bot_match'));
    expect(
      await codeOf(() => botMatchApi.finish('b1', { score: 0, correct: 0, answered: 0 }, false)),
    ).toBe('protocol_mismatch');

    mockRpc.mockResolvedValue(revoked('join_human_queue'));
    expect(await codeOf(() => humanMatchApi.join())).toBe('protocol_mismatch');

    mockRpc.mockResolvedValue(revoked('leave_human_queue'));
    expect(await codeOf(() => humanMatchApi.leave())).toBe('protocol_mismatch');
  });

  it('fuera de esas RPC un 42501 no se traduce (p. ej. los desafíos con amigos)', async () => {
    mockRpc.mockResolvedValue(revoked('create_friend_challenge'));
    expect(await codeOf(() => humanMatchApi.createChallenge())).toBe('server_error');
    expect(botMatchErrorCode(revoked('cualquiera').error)).toBe('server_error');
  });

  it('los demás errores de las RPC viejas pasan igual', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'language_unavailable' } });
    expect(await codeOf(() => botMatchApi.start())).toBe('language_unavailable');
  });
});

describe('botMatchErrorCode', () => {
  it('reconoce protocol_mismatch: hay que actualizar la app', () => {
    expect(botMatchErrorCode(new Error('protocol_mismatch'))).toBe('protocol_mismatch');
    expect(botMatchErrorCode({ message: 'protocol_mismatch', code: 'P0001' })).toBe(
      'protocol_mismatch',
    );
  });

  it('el resto sigue igual', () => {
    expect(botMatchErrorCode(new Error('not_authenticated'))).toBe('unauthorized');
    expect(botMatchErrorCode({ message: 'language_unavailable' })).toBe('language_unavailable');
    expect(botMatchErrorCode(new TypeError('Network request failed'))).toBe('connection');
    expect(botMatchErrorCode(new Error('algo raro'))).toBe('server_error');
  });
});
