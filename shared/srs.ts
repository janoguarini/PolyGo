/**
 * Repetición espaciada v1. La autoridad es la función SQL public.apply_word_result;
 * estos valores la replican para la UI y un test SQL verifica que coincidan.
 *
 * Etapas: 0 = nueva/fallada · 1..N = acertada en repasos espaciados · N = dominada.
 * Un acierto sólo sube de etapa si el repaso estaba vencido (o es la primera vez):
 * acertar varias veces seguidas en la misma lección no acelera el dominio.
 * Un fallo vuelve a la etapa 0 y deja la palabra para repasar de inmediato.
 */
export const SRS_CONFIG = {
  /** Días hasta el siguiente repaso al alcanzar la etapa i+1. */
  intervalsDays: [1, 3, 7] as const,
  /** Etapa a partir de la cual una palabra cuenta como dominada. */
  masteredStage: 3,
  /** Días entre repasos de mantenimiento de palabras dominadas. */
  maintenanceDays: 21,
} as const;

export type WordStatus = 'new' | 'learning' | 'mastered';

export function wordStatus(stage: number, seenCount: number): WordStatus {
  if (stage >= SRS_CONFIG.masteredStage) return 'mastered';
  return seenCount > 0 ? 'learning' : 'new';
}

export const WORD_STATUS_LABELS: Record<WordStatus, string> = {
  new: 'Nueva',
  learning: 'Aprendiendo',
  mastered: 'Dominada',
};
