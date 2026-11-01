import type { SoundEffect } from '@/lib/sounds';

/** Cada cuántos aciertos seguidos suena algo: sonar en cada respuesta cansa. */
export const SOUND_EVERY = 5;

const STREAK_SOUNDS: readonly SoundEffect[] = ['streak1', 'streak2', 'streak3'];

/**
 * Sonido de una respuesta de ranked, o null para no sonar. Sólo suena cada 5 aciertos seguidos
 * (5, 10, 15… con el tono subiendo) y al cortar una racha de al menos 5. La vibración avisa
 * igual en cada respuesta.
 */
export function answerSound(
  correct: boolean,
  streak: number,
  previousStreak: number,
): SoundEffect | null {
  if (!correct) return previousStreak >= SOUND_EVERY ? 'streakLost' : null;
  if (streak === 0 || streak % SOUND_EVERY !== 0) return null;
  const step = streak / SOUND_EVERY - 1;
  return STREAK_SOUNDS[Math.min(step, STREAK_SOUNDS.length - 1)] ?? 'streak3';
}
