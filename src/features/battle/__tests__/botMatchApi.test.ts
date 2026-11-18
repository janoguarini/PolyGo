import { generateQuestions } from '@shared/wordRush';

import {
  botMatchApi,
  botMatchErrorCode,
  fetchRushUnits,
  localRushWords,
  rushWordsInUnits,
} from '../botMatchApi';
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

  it('con el interruptor de la Etapa 1 cerrado (20261209120000_ranked_legacy_guard) también piden actualizar', async () => {
    // Lo que responde PostgREST cuando ranked_legacy_guard() corta la llamada.
    const closed = {
      data: null,
      error: { code: '42501', message: 'protocol_mismatch', details: 'legacy_ranked_closed' },
    };
    mockRpc.mockResolvedValue(closed);
    expect(await codeOf(() => botMatchApi.start())).toBe('protocol_mismatch');
    expect(
      await codeOf(() => botMatchApi.finish('b1', { score: 900, correct: 9, answered: 10 }, false)),
    ).toBe('protocol_mismatch');
    expect(await codeOf(() => humanMatchApi.join())).toBe('protocol_mismatch');
    expect(await codeOf(() => humanMatchApi.leave())).toBe('protocol_mismatch');
    // finish_human_match de una partida ranked vieja: el mensaje ya trae el código.
    expect(
      await codeOf(() =>
        humanMatchApi.finish('b1', { score: 900, correct: 9, answered: 10 }, false),
      ),
    ).toBe('protocol_mismatch');
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

describe('Fase C.7: partida contra bots armada en el teléfono', () => {
  const words = [
    { id: 'en-hello', text: 'hello', translationEs: 'hola', unitId: 'a1-u01' },
    { id: 'en-bye', text: 'goodbye', translationEs: 'adiós', unitId: 'a1-u01' },
    { id: 'en-yes', text: 'yes', translationEs: 'sí', unitId: 'a1-u01' },
    { id: 'en-no', text: 'no', translationEs: 'no', unitId: 'a1-u01' },
    { id: 'en-surname', text: 'surname', translationEs: 'apellido', unitId: 'a1-u13' },
    { id: 'en-a-cup-of', text: 'a cup of', translationEs: 'una taza de', unitId: 'a1-u14' },
    { id: 'en-orphan', text: 'orphan', translationEs: 'huérfana', unitId: null },
  ];

  it('pide sus unidades con rush_my_unit_ids y filtra palabras y distractores', async () => {
    mockRpc.mockResolvedValue({ data: ['a1-u01'], error: null });
    const units = await fetchRushUnits('en');
    expect(mockRpc).toHaveBeenCalledWith('rush_my_unit_ids', { p_language_code: 'en' });
    const usable = rushWordsInUnits(words, units);
    expect(usable.map((w) => w.id)).toEqual(['en-hello', 'en-bye', 'en-yes', 'en-no']);
    const shown = generateQuestions(usable, 40, () => 0.42).flatMap((q) => [
      q.prompt,
      ...q.options,
    ]);
    for (const hidden of ['surname', 'apellido', 'a cup of', 'una taza de', 'orphan']) {
      expect(shown).not.toContain(hidden);
    }
  });

  it('sin la función en el backend (anterior a la C.7) no filtra: queda la RLS de words', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { code: 'PGRST202', message: 'not found' } });
    expect(await fetchRushUnits('en')).toBeNull();
    mockRpc.mockResolvedValue({ data: null, error: { code: '42883', message: 'does not exist' } });
    expect(await fetchRushUnits('en')).toBeNull();
    expect(rushWordsInUnits(words, null)).toEqual(words);
  });

  it('C.8: cualquier otro error o una respuesta rara no juega «con todo»: la partida no empieza', async () => {
    mockRpc.mockRejectedValue(new TypeError('Network request failed'));
    await expect(fetchRushUnits('en')).rejects.toThrow('Network request failed');
    expect(await codeOf(() => fetchRushUnits('en'))).toBe('connection');
    mockRpc.mockResolvedValue({ data: null, error: { code: '57014', message: 'timeout' } });
    await expect(fetchRushUnits('en')).rejects.toMatchObject({ code: '57014' });
    mockRpc.mockResolvedValue({ data: null, error: null });
    await expect(fetchRushUnits('en')).rejects.toThrow('respuesta inválida');
    // Sin unidades no hay mazo: generateQuestions lo rechaza (nunca se rellena con otras palabras).
    mockRpc.mockResolvedValue({ data: [], error: null });
    const none = rushWordsInUnits(words, await fetchRushUnits('en'));
    expect(none).toEqual([]);
    expect(() => generateQuestions(none, 10, () => 0.5)).toThrow();
  });

  it('C.8: localRushWords toma sólo filas publicadas de esas unidades, con nivel y unidad', () => {
    const rows = [
      { id: 'en-hello', text: 'hello', translation_es: 'hola', emoji: '👋', unit_id: 'a1-u01' },
      { id: 'en-mother', text: 'mother', translation_es: 'madre', unit_id: 'a1-u02' },
      { id: 'en-surname', text: 'surname', translation_es: 'apellido', unit_id: 'a1-u13' },
      {
        id: 'en-draft',
        text: 'draft',
        translation_es: 'borrador',
        unit_id: 'a1-u01',
        is_published: false,
      },
      { id: 'en-go', text: 'went', translation_es: 'fui', unit_id: 'a2-u01' },
    ];
    expect(localRushWords(rows, new Set(['a1-u01', 'a2-u01']))).toEqual([
      {
        id: 'en-hello',
        text: 'hello',
        translationEs: 'hola',
        emoji: '👋',
        level: 'A1',
        unitId: 'a1-u01',
      },
      {
        id: 'en-go',
        text: 'went',
        translationEs: 'fui',
        emoji: null,
        level: 'A2',
        unitId: 'a2-u01',
      },
    ]);
    expect(localRushWords(rows, null).map((w) => w.id)).toEqual([
      'en-hello',
      'en-mother',
      'en-surname',
      'en-go',
    ]);
  });
});
