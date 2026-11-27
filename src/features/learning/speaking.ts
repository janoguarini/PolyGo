import type { Exercise } from '@shared/exercises';
import { HAN } from '@shared/languages';
import { shuffleOrderV1 } from '@shared/shuffle';

/** Ejercicios de hablar por lección (como máximo). */
export const SPEAKING_PER_LESSON = 2;

/** Frases cortas: cómodas de decir de una vez y que el reconocedor transcribe bien. */
function speakable(exercise: Exercise): boolean {
  if (exercise.type !== 'translate_write') return false;
  const answer = exercise.answer.trim();
  if (!answer) return false;
  if (HAN.test(answer)) return answer.replace(/\s/g, '').length <= 12;
  const words = answer.split(/\s+/).length;
  return words >= 2 && words <= 8;
}

/**
 * Qué ejercicios de traducir de una lección o un repaso se responden hablando: hasta SPEAKING_PER_LESSON de los
 * aptos, elegidos con la semilla de la sesión (la misma sesión elige siempre los mismos).
 * Para lecciones y repasos: la nivelación y Ranked nunca hablan.
 */
export function pickSpeakingExercises(
  exercises: readonly Exercise[],
  seed: string,
  max = SPEAKING_PER_LESSON,
): ReadonlySet<string> {
  const candidates = exercises.filter(speakable);
  const order = shuffleOrderV1(candidates.length, `${seed}:speaking`);
  return new Set(order.slice(0, max).map((i) => candidates[i]!.id));
}
