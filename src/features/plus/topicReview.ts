import type { WordProgressEntry } from '@/features/learning/api';

/** Palabras por sesión de repaso por tema. */
export const TOPIC_REVIEW_SIZE = 15;

export interface TopicUnit {
  id: string;
  level: string;
  title: string;
  emoji: string;
}

export interface TopicSummary {
  unit: TopicUnit;
  /** Palabras de la unidad que ya estudiaste. */
  studied: number;
  /** De esas, cuántas toca repasar ahora. */
  due: number;
  /** De esas, cuántas tienen algún error. */
  withMistakes: number;
}

const isDue = (e: WordProgressEntry, now: number) =>
  e.nextReviewAt !== null && new Date(e.nextReviewAt).getTime() <= now;

/**
 * Unidades con palabras estudiadas, en el orden del currículo. Las que no tienen ninguna no
 * aparecen: no hay nada real para repasar.
 */
export function topicSummaries(
  units: readonly TopicUnit[],
  entries: readonly WordProgressEntry[],
  now: number,
): TopicSummary[] {
  return units.flatMap((unit) => {
    const mine = entries.filter((e) => e.seenCount > 0 && e.word.unit_id === unit.id);
    if (mine.length === 0) return [];
    return [
      {
        unit,
        studied: mine.length,
        due: mine.filter((e) => isDue(e, now)).length,
        withMistakes: mine.filter((e) => e.incorrectCount > 0).length,
      },
    ];
  });
}

/**
 * Repaso por tema (Plus): sólo palabras estudiadas de una unidad. Primero las vencidas, después las
 * que más errores tienen, después las de etapa más baja; si sobran, se toman las que menos tiempo
 * falta para repasar.
 */
export function pickTopicReview(
  entries: readonly WordProgressEntry[],
  unitId: string,
  now: number,
  size = TOPIC_REVIEW_SIZE,
): WordProgressEntry[] {
  const dueAt = (e: WordProgressEntry) =>
    e.nextReviewAt === null ? Infinity : new Date(e.nextReviewAt).getTime();
  return entries
    .filter((e) => e.seenCount > 0 && e.word.unit_id === unitId)
    .sort(
      (a, b) =>
        Number(isDue(b, now)) - Number(isDue(a, now)) ||
        b.incorrectCount - a.incorrectCount ||
        a.stage - b.stage ||
        dueAt(a) - dueAt(b),
    )
    .slice(0, size);
}
