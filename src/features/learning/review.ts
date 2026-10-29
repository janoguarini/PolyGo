import type { Exercise } from '@shared/exercises';

import type { WordRow } from './api';
import { shuffle } from './random';

/**
 * Genera ejercicios de repaso determinísticos a partir de palabras (sin IA generativa):
 * rota entre elegir la traducción, escuchar y escribir en inglés.
 */
export function buildReviewExercises(due: WordRow[], pool: WordRow[], seed: string): Exercise[] {
  return due.map((word, index) => {
    const base = {
      id: `review-${word.id}`,
      lessonId: null,
      position: index + 1,
      explanation: null,
      difficulty: word.difficulty,
      recommendedSeconds: 20,
      wordIds: [word.id],
      acceptedAnswers: [] as string[],
    };

    const distractors = (pick: (w: WordRow) => string, exclude: string) =>
      shuffle(
        [...new Set(pool.filter((w) => w.id !== word.id).map(pick))].filter((v) => v !== exclude),
        `${seed}:${word.id}`,
      ).slice(0, 3);

    const kind = index % 3;
    if (kind === 0) {
      const options = distractors((w) => w.translation_es, word.translation_es);
      if (options.length === 3) {
        return {
          ...base,
          type: 'translation_choice',
          skill: 'vocabulary',
          prompt: `¿Qué significa «${word.text}»?`,
          payload: {
            type: 'translation_choice',
            word: word.text,
            options: [word.translation_es, ...options],
          },
          answer: word.translation_es,
        };
      }
    }
    if (kind === 1) {
      const options = distractors((w) => w.text, word.text);
      if (options.length === 3) {
        return {
          ...base,
          type: 'listen_choice',
          skill: 'listening',
          prompt: 'Escuchá y elegí lo que oís',
          payload: {
            type: 'listen_choice',
            audioText: word.text,
            options: [word.text, ...options],
          },
          answer: word.text,
        };
      }
    }
    return {
      ...base,
      type: 'translate_write',
      skill: 'translation',
      prompt: 'Escribí en inglés',
      payload: { type: 'translate_write', source: word.translation_es },
      answer: word.text,
    };
  });
}
