import { Platform } from 'react-native';

import type { WordRow } from '@/features/learning/api';

import { EMPTY_WORD_CARD, WORD_TIMELINE_HOURS } from '../content';
import { EMPTY_QUIZ, clearWidgets, resetWidgetSyncForTests, syncWidgets } from '../sync';

const mockWord = { updateSnapshot: jest.fn(), updateTimeline: jest.fn(), reload: jest.fn() };
const mockQuiz = { updateSnapshot: jest.fn(), updateTimeline: jest.fn(), reload: jest.fn() };

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { executionEnvironment: 'bare' },
  ExecutionEnvironment: { Bare: 'bare', Standalone: 'standalone', StoreClient: 'storeClient' },
}));
jest.mock('@/widgets/PolygoWord', () => ({ __esModule: true, default: mockWord }));
jest.mock('@/widgets/PolygoQuiz', () => ({ __esModule: true, default: mockQuiz }));


const w = (id: string, text: string, translation: string) =>
  ({
    id,
    text,
    translation_es: translation,
    ipa: null,
    emoji: null,
    example_en: null,
    is_published: true,
  }) as WordRow;

const POOL = [
  w('hello', 'hello', 'hola'),
  w('bye', 'goodbye', 'adiós'),
  w('thanks', 'thank you', 'gracias'),
  w('please', 'please', 'por favor'),
  w('water', 'water', 'agua'),
];

const input = (over: Partial<Parameters<typeof syncWidgets>[0]> = {}) => ({
  myWords: [],
  pool: POOL,
  wordOfDay: POOL[0]!,
  localDate: '2026-10-29',
  now: new Date('2026-10-29T10:00:00'),
  ...over,
});

beforeEach(() => {
  jest.clearAllMocks();
  resetWidgetSyncForTests();
});

const setOS = (os: 'ios' | 'android') =>
  Object.defineProperty(Platform, 'OS', { get: () => os, configurable: true });

it('iOS: timeline de palabras por hora y una ronda de preguntas', () => {
  setOS('ios');
  expect(syncWidgets(input())).toBe(true);
  const timeline = mockWord.updateTimeline.mock.calls[0]![0] as { props: { text: string } }[];
  expect(timeline).toHaveLength(WORD_TIMELINE_HOURS);
  expect(timeline[0]!.props.text).toBe('hello');
  expect(mockWord.updateSnapshot).not.toHaveBeenCalled();
  expect(mockQuiz.updateSnapshot.mock.calls[0]![0].questions).toHaveLength(10);
});

it('Android: sin timeline, snapshot de la primera palabra', () => {
  setOS('android');
  syncWidgets(input());
  expect(mockWord.updateTimeline).not.toHaveBeenCalled();
  expect(mockWord.updateSnapshot.mock.calls[0]![0]).toMatchObject({ text: 'hello', kind: 'daily' });
});

it('no pisa una ronda a medias: sólo renueva preguntas si cambia el día o las palabras', () => {
  setOS('ios');
  syncWidgets(input());
  syncWidgets(input({ now: new Date('2026-10-29T15:00:00') }));
  expect(mockQuiz.updateSnapshot).toHaveBeenCalledTimes(1);
  expect(mockWord.updateTimeline).toHaveBeenCalledTimes(2);
  syncWidgets(input({ localDate: '2026-10-30' }));
  expect(mockQuiz.updateSnapshot).toHaveBeenCalledTimes(2);
});

it('sin palabras suficientes la ronda queda vacía (pide abrir la app)', () => {
  setOS('ios');
  syncWidgets(input({ pool: POOL.slice(0, 2), wordOfDay: null }));
  expect(mockQuiz.updateSnapshot).toHaveBeenCalledWith(EMPTY_QUIZ);
});

it('al cerrar sesión se borran las palabras de la cuenta', () => {
  setOS('ios');
  clearWidgets();
  expect(mockWord.updateSnapshot).toHaveBeenCalledWith(EMPTY_WORD_CARD);
  expect(mockQuiz.updateSnapshot).toHaveBeenCalledWith(EMPTY_QUIZ);
});
