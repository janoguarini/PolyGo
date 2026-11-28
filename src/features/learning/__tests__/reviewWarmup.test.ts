import { QueryClient } from '@tanstack/react-query';

import { LearningSessionHttpError, startServerReview, type ServerReviewStart } from '../api';
import { serverReviewQuery } from '../hooks';
import { courseByCode } from '@shared/courses';

import { __resetWarmReviews, reviewScope, takeWarmReview, warmReview } from '../reviewWarmup';
import { loadOpenReview, saveOpenReview } from '../serverReview';

jest.mock('expo-router', () => ({ useFocusEffect: jest.fn() }));
jest.mock('@/features/auth/AuthProvider', () => ({ useAuth: () => ({ session: null }) }));
jest.mock('@/features/profile/hooks', () => ({ useMyProfile: () => ({ data: undefined }) }));
jest.mock('@/features/coach/api', () => ({ coachKeys: {}, fetchCoachStatus: jest.fn() }));
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  startServerReview: jest.fn(),
}));
jest.mock('../reviewAnswerQueue', () => ({
  ...jest.requireActual('../reviewAnswerQueue'),
  reviewAnswerQueue: () => ({ replay: async () => undefined }),
}));
jest.mock('@/lib/secureStorage', () => {
  const store = new Map<string, string>();
  return {
    deviceStorage: {
      getItem: async (k: string) => store.get(k) ?? null,
      setItem: async (k: string, v: string) => void store.set(k, v),
      removeItem: async (k: string) => void store.delete(k),
      clear: () => store.clear(),
    },
  };
});

const start = jest.mocked(startServerReview);
const storage = jest.requireMock('@/lib/secureStorage').deviceStorage as { clear: () => void };

const ok = (sessionId: string): ServerReviewStart =>
  ({ session_id: sessionId, status: 'ok', items: [{ presentation_id: 1 }] }) as never;
const upToDate = (sessionId: string): ServerReviewStart =>
  ({ session_id: sessionId, status: 'up_to_date', items: [] }) as never;

let qc: QueryClient;
beforeEach(() => {
  __resetWarmReviews();
  storage.clear();
  qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  start.mockReset().mockImplementation(async (id) => ok(id));
});
afterEach(() => qc.clear());

describe('precarga del repaso', () => {
  it('pide el repaso, lo guarda como sesión abierta y la pantalla lo encuentra en caché', async () => {
    await warmReview(qc, 'en');
    expect(start).toHaveBeenCalledTimes(1);
    const [sessionId, language, focus] = start.mock.calls[0]!;
    expect(language).toBe('en');
    expect(focus).toBeUndefined();
    // Guardada: si la app se cierra, la pantalla retoma la misma sesión.
    expect((await loadOpenReview('en'))?.sessionId).toBe(sessionId);

    const taken = takeWarmReview(qc, 'en');
    expect(taken?.sessionId).toBe(sessionId);
    expect(qc.getQueryData(serverReviewQuery(sessionId, 'en').queryKey)).toEqual(ok(sessionId));
    // Se usa una sola vez.
    expect(takeWarmReview(qc, 'en')).toBeUndefined();
  });

  it('por curso: dos cursos de inglés no comparten la sesión precargada ni la guardada', async () => {
    const fromEs = courseByCode('en-from-es')!;
    const fromPt = courseByCode('en-from-pt')!;
    // Los cursos por defecto siguen con la clave de su idioma (las sesiones guardadas siguen valiendo).
    expect(reviewScope(fromEs)).toBe('en');
    expect(reviewScope(fromPt)).toBe('en-from-pt');

    await warmReview(qc, 'en', undefined, reviewScope(fromPt));
    const [sessionId, language] = start.mock.calls[0]!;
    // Al servidor se le sigue pidiendo el idioma.
    expect(language).toBe('en');
    expect((await loadOpenReview('en-from-pt'))?.sessionId).toBe(sessionId);
    expect(await loadOpenReview('en')).toBeNull();
    // Inglés desde español no se lleva el repaso de inglés desde portugués.
    expect(takeWarmReview(qc, 'en', undefined, reviewScope(fromEs))).toBeUndefined();
    expect(takeWarmReview(qc, 'en', undefined, reviewScope(fromPt))?.sessionId).toBe(sessionId);
  });

  it('precargar varias veces no vuelve a pedir el repaso', async () => {
    await Promise.all([warmReview(qc, 'en'), warmReview(qc, 'en')]);
    await warmReview(qc, 'en');
    expect(start).toHaveBeenCalledTimes(1);
  });

  it('retoma la sesión abierta guardada en vez de crear otra', async () => {
    await saveOpenReview('en', {
      sessionId: 'guardada',
      startedAt: new Date().toISOString(),
      date: 'x',
    });
    await warmReview(qc, 'en');
    expect(start.mock.calls[0]![0]).toBe('guardada');
  });

  it('una sesión guardada ya enviada se descarta y se precarga una nueva', async () => {
    await saveOpenReview('en', {
      sessionId: 'cerrada',
      startedAt: new Date().toISOString(),
      date: 'x',
    });
    start.mockImplementation(async (id) => {
      if (id === 'cerrada') throw new LearningSessionHttpError('session_closed');
      return ok(id);
    });
    await warmReview(qc, 'en');
    expect(start).toHaveBeenCalledTimes(2);
    const fresh = start.mock.calls[1]![0];
    expect(fresh).not.toBe('cerrada');
    expect(takeWarmReview(qc, 'en')?.sessionId).toBe(fresh);
  });

  it('sin red no rompe nada: la pantalla lo pide al entrar', async () => {
    start.mockRejectedValue(new Error('network'));
    await expect(warmReview(qc, 'en')).resolves.toBeUndefined();
    expect(takeWarmReview(qc, 'en')).toBeUndefined();
  });

  it('«al día» no se guarda como sesión abierta y sólo se reutiliza unos minutos', async () => {
    start.mockImplementation(async (id) => upToDate(id));
    const realNow = Date.now;
    await warmReview(qc, 'en');
    expect(await loadOpenReview('en')).toBeNull();
    try {
      Date.now = () => realNow() + 3 * 60_000;
      expect(takeWarmReview(qc, 'en')).toBeUndefined();
    } finally {
      Date.now = realNow;
    }
  });

  it('nunca precarga el Coach (gastaría una sesión de prueba)', async () => {
    await warmReview(qc, 'en', { kind: 'coach', unit_ids: ['u1'] });
    expect(start).not.toHaveBeenCalled();
  });

  it('el repaso inteligente se precarga aparte del básico', async () => {
    await warmReview(qc, 'en', { kind: 'smart' });
    expect(start.mock.calls[0]![2]).toEqual({ kind: 'smart' });
    expect(takeWarmReview(qc, 'en')).toBeUndefined();
    expect(takeWarmReview(qc, 'en', { kind: 'smart' })).toBeDefined();
  });
});
