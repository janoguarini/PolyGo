import {
  ARCADE,
  CHALLENGE_KINDS,
  KIND_ROTATION,
  RecentContentMemory,
  availableKinds,
  contentIds,
  createChallengeStream,
  isDescriptiveTranslation,
  sentencePool,
  translationsOverlap,
  type ArcadeChallenge,
  type ArcadeSentence,
} from '../../shared/arcade';
import { LANGUAGES } from '../../shared/languages';
import { TIERS } from '../../shared/ranking';
import { rushLabel, rushPool, wordLevel, type RushWord } from '../../shared/wordRush';
import { ES_PATH } from '../es-course';
import { FR_PATH } from '../fr-course';
import { CURRICULUM_PATH, type PathUnit } from '../index';
import { IT_PATH } from '../it-course';
import { lessonExerciseIndex, pathExerciseId } from '../path';
import { PT_PATH } from '../pt-course';
import { ZH_PATH } from '../zh-course';

/**
 * Word Rush (motor Arcade) con el contenido real de los seis cursos, en las dos franjas de nivel
 * (Bronce: A1; desde Plata: A1 + A2). Mismas funciones que el servidor de partidas: rushPool →
 * sentencePool → createChallengeStream. Las palabras y frases salen del contenido local que carga la
 * base (mismas unidades que rankedPools.test.ts); el filtro de unidades por jugador (C.7) no se
 * simula acá: es el banco completo de cada franja.
 */

const PATHS: Record<string, readonly PathUnit[]> = {
  en: CURRICULUM_PATH.filter((u) => u.language === 'en'),
  fr: FR_PATH,
  it: [...CURRICULUM_PATH.filter((u) => u.language === 'it'), ...IT_PATH],
  pt: [...CURRICULUM_PATH.filter((u) => u.language === 'pt'), ...PT_PATH],
  zh: [...CURRICULUM_PATH.filter((u) => u.language === 'zh'), ...ZH_PATH],
  es: ES_PATH,
};

const unitIdOf = (u: PathUnit) =>
  `${u.language === 'en' ? '' : `${u.language}-`}${u.level.toLowerCase()}-u${String(u.unit.position).padStart(2, '0')}`;

function wordsOf(language: string): RushWord[] {
  return PATHS[language]!.flatMap((u) =>
    u.unit.words.map((w) => ({
      id: w.id,
      text: w.text,
      translationEs: w.translation,
      emoji: w.emoji ?? null,
      level: wordLevel(unitIdOf(u)),
      unitId: unitIdOf(u),
    })),
  );
}

/** Ejercicios order_words como los carga loadSentences (payload.tokens / payload.translation). */
function sentencesOf(language: string): ArcadeSentence[] {
  const out: ArcadeSentence[] = [];
  for (const u of PATHS[language]!) {
    for (const lesson of u.lessons) {
      lesson.exercises.forEach((e, i) => {
        if (e.type !== 'order_words') return;
        const p = e.payload as { tokens?: unknown; translation?: unknown };
        if (!Array.isArray(p.tokens) || !p.tokens.every((t) => typeof t === 'string')) return;
        if (typeof p.translation !== 'string') return;
        out.push({
          id: pathExerciseId(lesson.id, lessonExerciseIndex(lesson, i)),
          tokens: p.tokens as string[],
          answer: e.answer,
          acceptedAnswers: e.acceptedAnswers ?? [],
          translation: p.translation,
          unitId: unitIdOf(u),
        });
      });
    }
  }
  return out;
}

function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const silver = TIERS.find((t) => t.id === 'silver')!.minRating;
const BANDS = [
  ['A1', 0, ['A1']],
  ['A1+A2', silver, ['A1', 'A2']],
] as const;
const RANKED = LANGUAGES.filter((l) => l.ranked).map((l) => l.code);

it('los seis cursos tienen Word Rush', () => {
  expect([...RANKED].sort()).toEqual(['en', 'es', 'fr', 'it', 'pt', 'zh']);
});

describe.each(RANKED.map((c) => [c]))('%s', (language) => {
  const allWords = wordsOf(language);
  const allSentences = sentencesOf(language);

  describe.each(BANDS.map((b) => [...b]))('%s', (_band, rating, levels) => {
    const words = rushPool(allWords, rating);
    const sentences = sentencePool(allSentences, language, rating);
    const byId = new Map(allWords.map((w) => [w.id, w]));
    const labelOf = (id: string) => rushLabel(byId.get(id)!.translationEs);

    it('los cuatro microjuegos tienen contenido del nivel', () => {
      expect([...availableKinds(words, sentences)].sort()).toEqual([...CHALLENGE_KINDS].sort());
      expect(words.every((w) => w.level && (levels as readonly string[]).includes(w.level))).toBe(
        true,
      );
      expect(
        sentences.every((s) => (levels as readonly string[]).includes(wordLevel(s.unitId)!)),
      ).toBe(true);
    });

    it('400 desafíos válidos: sin respuestas dobles, sin gramática como traducción, rotación correcta', () => {
      for (const seed of [1, 2, 3]) {
        const stream = createChallengeStream(words, sentences, seeded(seed * 31 + rating));
        stream.ensure(400);
        const challenges = stream.challenges.slice(0, 400);
        for (const c of challenges) checkChallenge(c, labelOf);
        let run = 0;
        for (let i = 0; i < challenges.length; i++) {
          run = i > 0 && challenges[i]!.kind === challenges[i - 1]!.kind ? run + 1 : 1;
          expect(run).toBeLessThanOrEqual(KIND_ROTATION.maxRun[challenges[i]!.kind]);
        }
      }
    });

    it('una partida de 60 desafíos no repite palabras ni frases, ni lo mismo en dos seguidos', () => {
      for (const seed of [4, 5, 6, 7]) {
        const challenges = createChallengeStream(words, sentences, seeded(seed)).challenges.slice(
          0,
          60,
        );
        const ids = contentIds(challenges);
        expect(new Set(ids.words).size).toBe(ids.words.length);
        expect(new Set(ids.sentences).size).toBe(ids.sentences.length);
      }
    });

    it('con la memoria, la partida siguiente del mismo jugador no repite lo visto', () => {
      const memory = new RecentContentMemory();
      let previous: ReturnType<typeof contentIds> | null = null;
      for (let match = 1; match <= 3; match++) {
        const stream = createChallengeStream(words, sentences, seeded(100 + match), ARCADE, {
          recent: memory.recentFor([`p:${language}`]),
        });
        const seen = stream.challenges.slice(0, 25);
        memory.record(`p:${language}`, seen);
        const ids = contentIds(seen);
        if (previous) {
          const before = new Set([...previous.words, ...previous.sentences]);
          expect([...ids.words, ...ids.sentences].filter((id) => before.has(id))).toEqual([]);
        }
        previous = ids;
      }
    });
  });
});

/** Un desafío con contenido real: una sola respuesta correcta y nada descriptivo a la vista. */
function checkChallenge(c: ArcadeChallenge, labelOf: (id: string) => string): void {
  switch (c.kind) {
    case 'swipe': {
      expect(c.translation).toBe(labelOf(c.wordId));
      if (c.truthful) expect(c.candidate).toBe(c.translation);
      else expect(translationsOverlap(c.candidate, c.translation)).toBe(false);
      expect(isDescriptiveTranslation(c.translation)).toBe(false);
      expect(isDescriptiveTranslation(c.candidate)).toBe(false);
      return;
    }
    case 'audio': {
      expect(c.options).toHaveLength(ARCADE.audioOptions);
      expect(c.options[c.correctOption]).toBe(labelOf(c.wordId));
      for (let i = 0; i < c.options.length; i++) {
        expect(isDescriptiveTranslation(c.options[i]!)).toBe(false);
        for (let j = i + 1; j < c.options.length; j++) {
          expect(translationsOverlap(c.options[i]!, c.options[j]!)).toBe(false);
        }
      }
      return;
    }
    case 'connect': {
      expect(c.left).toHaveLength(ARCADE.connectPairs);
      const labels = c.wordIds.map(labelOf);
      c.solution.forEach((r, i) => expect(c.right[r]).toBe(labels[i]));
      for (let i = 0; i < labels.length; i++) {
        expect(isDescriptiveTranslation(labels[i]!)).toBe(false);
        for (let j = i + 1; j < labels.length; j++) {
          expect(translationsOverlap(labels[i]!, labels[j]!)).toBe(false);
        }
      }
      return;
    }
    case 'sentence': {
      expect(c.tokens.length).toBeGreaterThanOrEqual(ARCADE.sentenceTokens.min);
      expect(c.tokens.length).toBeLessThanOrEqual(ARCADE.sentenceTokens.max);
      expect(c.answers.length).toBeGreaterThanOrEqual(1);
      return;
    }
  }
}
