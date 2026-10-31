import type { Exercise, UserAnswer } from './exercises';

/**
 * Validación determinista de respuestas. Reglas (documentadas en docs/LEARNING_CURRICULUM.md):
 * - Sin distinción de mayúsculas, espacios extra, apóstrofos tipográficos, comas ni puntuación final.
 * - Las tildes SÍ cuentan (no se eliminan diacríticos).
 * - Contracciones del inglés: sólo la lista cerrada CONTRACTIONS es equivalente a su forma larga.
 * - Tolerancia a un error de tipeo (distancia de edición 1) sólo en respuestas escritas de
 *   8 caracteres o más, y nunca en ejercicios de ortografía (complete_word).
 * - Cualquier otra cosa es incorrecta: no se aceptan respuestas "parecidas".
 */

const CONTRACTIONS: Record<string, string> = {
  "i'm": 'i am',
  "you're": 'you are',
  "he's": 'he is',
  "she's": 'she is',
  "it's": 'it is',
  "we're": 'we are',
  "they're": 'they are',
  "isn't": 'is not',
  "aren't": 'are not',
  "don't": 'do not',
  "doesn't": 'does not',
  "what's": 'what is',
  "where's": 'where is',
  "who's": 'who is',
  "how's": 'how is',
  "that's": 'that is',
  "there's": 'there is',
  "can't": 'cannot',
  "wasn't": 'was not',
  "weren't": 'were not',
  "didn't": 'did not',
  "won't": 'will not',
  "shouldn't": 'should not',
  "mustn't": 'must not',
  "haven't": 'have not',
  "hasn't": 'has not',
  "i'll": 'i will',
  "you'll": 'you will',
  "he'll": 'he will',
  "she'll": 'she will',
  "it'll": 'it will',
  "we'll": 'we will',
  "they'll": 'they will',
  "i've": 'i have',
  "you've": 'you have',
  "we've": 'we have',
  "they've": 'they have',
};

const TYPO_MIN_LENGTH = 8;

export function normalizeAnswer(raw: string): string {
  return raw
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[¿¡]/g, '')
    .replace(/[,;:]/g, ' ')
    .replace(/[.!?]+(\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Expande contracciones para comparar "I'm fine" con "I am fine". */
export function canonicalForm(raw: string): string {
  return normalizeAnswer(raw)
    .split(' ')
    .map((token) => CONTRACTIONS[token] ?? token)
    .join(' ');
}

export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = prev[0]!;
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = prev[j]!;
      prev[j] = Math.min(
        prev[j]! + 1,
        prev[j - 1]! + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diagonal = temp;
    }
  }
  return prev[b.length]!;
}

export type AnswerVerdict =
  { correct: true; typo: boolean; expected: string } | { correct: false; expected: string };

function verdictForText(given: string, expected: string[], allowTypo: boolean): AnswerVerdict {
  const canonical = canonicalForm(given);
  const display = expected[0] ?? '';
  if (canonical.length === 0) return { correct: false, expected: display };
  const candidates = expected.map(canonicalForm);
  if (candidates.includes(canonical)) return { correct: true, typo: false, expected: display };
  if (allowTypo) {
    const close = candidates.some(
      (c) => c.length >= TYPO_MIN_LENGTH && editDistance(c, canonical) === 1,
    );
    if (close) return { correct: true, typo: true, expected: display };
  }
  return { correct: false, expected: display };
}

export function checkAnswer(exercise: Exercise, answer: UserAnswer): AnswerVerdict {
  const expected = [exercise.answer, ...exercise.acceptedAnswers];
  const display = exercise.answer;

  switch (answer.kind) {
    case 'option':
      // Las opciones se comparan exactas: el usuario no las escribe.
      return answer.value === exercise.answer
        ? { correct: true, typo: false, expected: display }
        : { correct: false, expected: display };

    case 'tokens':
      return verdictForText(answer.value.join(' '), expected, false);

    case 'text':
      return verdictForText(answer.value, expected, exercise.type !== 'complete_word');

    case 'pairs': {
      if (exercise.payload.type !== 'match_pairs') return { correct: false, expected: display };
      const solution = new Map(exercise.payload.pairs.map((p) => [p.left, p.right]));
      const ok =
        answer.value.length === solution.size &&
        answer.value.every((p) => solution.get(p.left) === p.right);
      return ok
        ? { correct: true, typo: false, expected: display }
        : { correct: false, expected: display };
    }
  }
}

/** Texto plano de una respuesta para registrarla en la base de datos. */
export function serializeAnswer(answer: UserAnswer): string {
  switch (answer.kind) {
    case 'text':
    case 'option':
      return answer.value;
    case 'tokens':
      return answer.value.join(' ');
    case 'pairs':
      return answer.value.map((p) => `${p.left}=${p.right}`).join('|');
  }
}
