import type { WordProgressEntry } from '@/features/learning/api';

/** Palabras por sesión de repaso inteligente (el básico usa 10). */
export const SMART_REVIEW_SIZE = 15;
/** «Por olvidar»: el repaso espaciado la pide dentro de este plazo. */
export const DUE_SOON_MS = 24 * 60 * 60 * 1000;

export type SmartReason = 'due' | 'frequent_mistakes' | 'difficult' | 'due_soon';

export const SMART_REASON_LABELS: Record<SmartReason, string> = {
  due: 'Toca repasarla',
  frequent_mistakes: 'Te equivocaste varias veces',
  difficult: 'Todavía te cuesta',
  due_soon: 'Está por olvidarse',
};

/**
 * Repaso inteligente (Plus). Reglas fijas sobre tu historial real (user_word_progress), sin IA ni
 * modelo adaptativo:
 * 1. vencidas según el repaso espaciado (más errores primero),
 * 2. errores frecuentes (2 o más),
 * 3. difíciles: te equivocaste en al menos un tercio de las veces o siguen en la etapa inicial
 *    después de verlas varias veces,
 * 4. por olvidar: el repaso espaciado las pide en las próximas 24 h.
 * Sin repetidas. Las que no encajan en ninguna regla no entran.
 */
export function pickSmartReview(
  entries: readonly WordProgressEntry[],
  now: number,
  size = SMART_REVIEW_SIZE,
): { entry: WordProgressEntry; reason: SmartReason }[] {
  const dueAt = (e: WordProgressEntry) =>
    e.nextReviewAt === null ? Infinity : new Date(e.nextReviewAt).getTime();
  const errorRate = (e: WordProgressEntry) =>
    e.seenCount > 0 ? e.incorrectCount / e.seenCount : 0;
  const studied = entries.filter((e) => e.seenCount > 0);

  const buckets: [SmartReason, WordProgressEntry[]][] = [
    [
      'due',
      studied
        .filter((e) => dueAt(e) <= now)
        .sort((a, b) => b.incorrectCount - a.incorrectCount || dueAt(a) - dueAt(b)),
    ],
    [
      'frequent_mistakes',
      studied
        .filter((e) => e.incorrectCount >= 2)
        .sort((a, b) => b.incorrectCount - a.incorrectCount || errorRate(b) - errorRate(a)),
    ],
    [
      'difficult',
      studied
        .filter((e) => errorRate(e) >= 1 / 3 || (e.stage === 0 && e.seenCount >= 3))
        .sort((a, b) => errorRate(b) - errorRate(a) || a.stage - b.stage),
    ],
    [
      'due_soon',
      studied
        .filter((e) => dueAt(e) > now && dueAt(e) <= now + DUE_SOON_MS)
        .sort((a, b) => dueAt(a) - dueAt(b)),
    ],
  ];

  const picked = new Set<string>();
  const result: { entry: WordProgressEntry; reason: SmartReason }[] = [];
  for (const [reason, list] of buckets) {
    for (const entry of list) {
      if (result.length >= size) return result;
      if (picked.has(entry.word.id)) continue;
      picked.add(entry.word.id);
      result.push({ entry, reason });
    }
  }
  return result;
}
