import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

import type { Widget } from 'expo-widgets';

import type { WordProgressEntry, WordRow } from '@/features/learning/api';

import {
  EMPTY_WORD_CARD,
  WIDGET_LINKS,
  buildQuiz,
  buildWordTimeline,
  rankWidgetWords,
  type QuizProps,
  type WordCardProps,
} from './content';

/**
 * Los widgets necesitan el módulo nativo de expo-widgets: existe en development/production builds,
 * no en Expo Go ni en web. Ahí todo esto es un no-op y la app funciona igual.
 */
export const widgetsSupported =
  Platform.OS !== 'web' && Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

interface Widgets {
  word: Widget<WordCardProps>;
  quiz: Widget<QuizProps>;
}

let loaded: Widgets | null | undefined;

function loadWidgets(): Widgets | null {
  if (loaded !== undefined) return loaded;
  if (!widgetsSupported) return (loaded = null);
  try {
    // Carga diferida: createWidget instancia el módulo nativo al importarse.
    /* eslint-disable @typescript-eslint/no-require-imports */
    loaded = {
      word: (require('@/widgets/PolygoWord') as { default: Widget<WordCardProps> }).default,
      quiz: (require('@/widgets/PolygoQuiz') as { default: Widget<QuizProps> }).default,
    };
    /* eslint-enable @typescript-eslint/no-require-imports */
  } catch {
    loaded = null;
  }
  return loaded;
}

export interface WidgetSyncInput {
  myWords: readonly WordProgressEntry[];
  pool: readonly WordRow[];
  wordOfDay: WordRow | null;
  /** Fecha local (YYYY-MM-DD): la ronda de preguntas cambia una vez por día. */
  localDate: string;
  now?: Date;
}

export const EMPTY_QUIZ: QuizProps = {
  questions: [],
  index: 0,
  chosen: -1,
  correctCount: 0,
  url: WIDGET_LINKS.quiz,
};

let lastQuizKey: string | null = null;

/**
 * Publica el contenido en los widgets. Devuelve false si no hay widgets en esta build.
 * La ronda de preguntas sólo se reemplaza cuando cambia el día o el conjunto de palabras, para no
 * pisar una ronda que el usuario dejó a medias en el widget cada vez que abre la app.
 */
export function syncWidgets(input: WidgetSyncInput): boolean {
  const widgets = loadWidgets();
  if (!widgets) return false;
  const now = input.now ?? new Date();

  const ranked = rankWidgetWords(input.myWords, input.pool, input.wordOfDay, now.getTime());
  if (Platform.OS === 'ios') {
    widgets.word.updateTimeline(buildWordTimeline(ranked, now));
  } else {
    // Android no tiene timeline: muestra la primera y se renueva cada vez que se abre la app.
    widgets.word.updateSnapshot(buildWordTimeline(ranked, now, 1)[0]!.props);
  }

  const studiedIds = input.myWords
    .filter((e) => e.seenCount > 0)
    .map((e) => e.word.id)
    .sort()
    .join(',');
  const quizKey = `${input.localDate}|${studiedIds}|${input.pool.length}`;
  if (quizKey !== lastQuizKey) {
    widgets.quiz.updateSnapshot(
      buildQuiz(input.myWords, input.pool, `quiz:${input.localDate}`) ?? EMPTY_QUIZ,
    );
    lastQuizKey = quizKey;
  }
  return true;
}

/** Al cerrar sesión: los widgets no deben seguir mostrando las palabras de la cuenta anterior. */
export function clearWidgets(): void {
  const widgets = loadWidgets();
  if (!widgets) return;
  widgets.word.updateSnapshot(EMPTY_WORD_CARD);
  widgets.quiz.updateSnapshot(EMPTY_QUIZ);
  lastQuizKey = null;
}

/** Sólo para tests. */
export function resetWidgetSyncForTests(): void {
  loaded = undefined;
  lastQuizKey = null;
}
