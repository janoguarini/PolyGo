import { QueryClient } from '@tanstack/react-query';

import { fetchLessonContent, startLessonPresentation } from '../api';
import { lessonContentQuery, lessonPresentationQuery } from '../hooks';
import { __resetWarmLessons, takeWarmSession, warmLesson } from '../lessonWarmup';

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  fetchLessonContent: jest.fn(),
  startLessonPresentation: jest.fn(),
}));

const content = jest.mocked(fetchLessonContent);
const start = jest.mocked(startLessonPresentation);

const flush = () => new Promise((r) => setTimeout(r, 0));

let qc: QueryClient;
beforeEach(() => {
  __resetWarmLessons();
  qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  content.mockReset().mockResolvedValue({ lesson: { id: 'l1' } } as never);
  start.mockReset().mockResolvedValue([]);
});
afterEach(() => qc.clear());

describe('precarga de la próxima lección', () => {
  it('baja el contenido y registra la presentación; al entrar, la lección encuentra todo en caché', async () => {
    warmLesson(qc, 'l1');
    await flush();
    expect(content).toHaveBeenCalledWith('l1');
    expect(start).toHaveBeenCalledTimes(1);
    const [sessionId, lessonId] = start.mock.calls[0]!;
    expect(lessonId).toBe('l1');

    const taken = takeWarmSession(qc, 'l1');
    expect(taken).toBe(sessionId);
    // La pantalla de la lección usa las mismas claves: no hay nada que esperar.
    expect(qc.getQueryData(lessonContentQuery('l1').queryKey)).toBeTruthy();
    expect(qc.getQueryData(lessonPresentationQuery(taken!, 'l1').queryKey)).toEqual([]);
  });

  it('precargar varias veces la misma lección no registra otra presentación', async () => {
    warmLesson(qc, 'l1');
    warmLesson(qc, 'l1');
    await flush();
    warmLesson(qc, 'l1');
    await flush();
    expect(start).toHaveBeenCalledTimes(1);
  });

  it('la sesión precargada se usa una sola vez (después, una nueva)', async () => {
    warmLesson(qc, 'l1');
    await flush();
    expect(takeWarmSession(qc, 'l1')).toBeDefined();
    expect(takeWarmSession(qc, 'l1')).toBeUndefined();
  });

  it('sin precarga, o si la presentación falló, la lección arranca como siempre (sesión nueva)', async () => {
    expect(takeWarmSession(qc, 'otra')).toBeUndefined();
    start.mockRejectedValueOnce(new Error('timeout'));
    warmLesson(qc, 'l2');
    await flush();
    expect(takeWarmSession(qc, 'l2')).toBeUndefined();
  });

  it('si la presentación todavía está en camino, se usa igual (se espera sólo lo que falta)', () => {
    start.mockReturnValueOnce(new Promise(() => {}));
    warmLesson(qc, 'l3');
    const sessionId = start.mock.calls[0]?.[0];
    expect(takeWarmSession(qc, 'l3')).toBe(sessionId);
  });
});
