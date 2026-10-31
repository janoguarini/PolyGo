import { streakLevel } from '@shared/wordRush';

import type { SoundEffect } from '@/lib/sounds';

const STREAK_SOUNDS: readonly SoundEffect[] = ['correct', 'streak1', 'streak2', 'streak3'];

/** Sonido de cada respuesta: en racha suena más brillante; cortar una racha suena distinto. */
export function answerSound(correct: boolean, streak: number, previousStreak: number): SoundEffect {
  if (!correct) return streakLevel(previousStreak) > 0 ? 'streakLost' : 'incorrect';
  // En racha cada acierto suena al escalón actual (3, 5 y 8 seguidas suben el tono).
  return STREAK_SOUNDS[streakLevel(streak)] ?? 'streak3';
}
