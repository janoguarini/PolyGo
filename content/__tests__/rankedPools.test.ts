import { LANGUAGES } from '../../shared/languages';
import { WORD_RUSH } from '../../shared/protocol';
import {
  RUSH_LEVELS,
  WRITING,
  generateQuestions,
  rushLabel,
  rushPool,
  wordLevel,
  withWriting,
  writingEnabled,
  type RushWord,
} from '../../shared/wordRush';
import { ES_PATH } from '../es-course';
import { FR_PATH } from '../fr-course';
import { CURRICULUM_PATH, type PathUnit } from '../index';
import { IT_PATH } from '../it-course';
import { PT_PATH } from '../pt-course';
import { ZH_PATH } from '../zh-course';

/**
 * Ranked en todos los cursos (supabase/pending/20261226120000_ranked_all_courses.sql): con el
 * vocabulario A1 + A2 de cada idioma, el generador del servidor de partidas (server/src/server.ts:
 * rushPool → generateQuestions → withWriting) arma preguntas válidas en cada rango. Es la misma
 * función que usa el servidor; las palabras salen del contenido publicado (el que carga la base).
 */

/** Unidades A1 + A2 publicadas de cada idioma (el inglés: las del currículo original). */
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
    })),
  );
}

/** Generador determinista (mulberry32): mismas preguntas en cada corrida. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const norm = (s: string) => s.trim().toLowerCase();
const RANKED = LANGUAGES.filter((l) => l.ranked).map((l) => l.code);

it('todos los idiomas con curso tienen Ranked', () => {
  expect(RANKED.sort()).toEqual(['en', 'es', 'fr', 'it', 'pt', 'zh']);
});

describe.each(RANKED.map((c) => [c]))('%s', (language) => {
  const words = wordsOf(language);

  it('vocabulario A1 y A2 suficiente, con nivel en cada palabra', () => {
    const a1 = words.filter((w) => w.level === 'A1');
    const a2 = words.filter((w) => w.level === 'A2');
    expect(a1.length).toBeGreaterThanOrEqual(150);
    expect(a2.length).toBeGreaterThanOrEqual(150);
    expect(words.every((w) => w.level === 'A1' || w.level === 'A2')).toBe(true);
  });

  // Bronce (sólo A1), Plata (A1 + A2) y Oro (además, una de cada tres para escribir, salvo en chino).
  const ratings = [...RUSH_LEVELS.map((s) => s.minRating), WRITING.minRating];
  it.each(ratings.map((r) => [r]))(
    'rating %i: preguntas válidas, sin dos opciones correctas',
    (rating) => {
      // Como generateQuestions: una palabra por texto (la primera).
      const pool = rushPool(words, rating).filter(
        (w, i, all) => all.findIndex((x) => norm(x.text) === norm(w.text)) === i,
      );
      const levels = RUSH_LEVELS.filter((s) => rating >= s.minRating).at(-1)!.levels;
      // Si el nivel tiene palabras, el banco no se sale de él.
      expect(pool.every((w) => w.level && levels.includes(w.level))).toBe(true);
      const byId = new Map(pool.map((w) => [w.id, w]));
      let questions = generateQuestions(pool, 300, seeded(rating + language.length));
      if (writingEnabled(rating, language)) questions = withWriting(questions);

      for (const q of questions) {
        const word = byId.get(q.wordId)!;
        expect(word).toBeDefined();
        const label = rushLabel(word.translationEs);
        if (q.write) {
          // Escribir: el enunciado es la traducción y la única opción, la palabra del idioma.
          expect(language).not.toBe('zh');
          expect(q.options).toEqual([word.text]);
          expect(q.prompt).toBe(label);
          continue;
        }
        expect(q.options).toHaveLength(WORD_RUSH.optionsPerQuestion);
        expect(new Set(q.options.map(norm)).size).toBe(q.options.length);
        const correct = q.direction === 'en_es' ? label : word.text;
        expect(q.options[q.correctOption]).toBe(correct);
        expect(q.prompt).toBe(q.direction === 'en_es' ? word.text : label);
        // Ningún distractor es otra forma de la misma respuesta (misma palabra o misma traducción).
        for (const [i, option] of q.options.entries()) {
          if (i === q.correctOption) continue;
          const other = pool.find((w) =>
            q.direction === 'en_es'
              ? norm(rushLabel(w.translationEs)) === norm(option)
              : norm(w.text) === norm(option),
          );
          expect(other).toBeDefined();
          expect(norm(other!.text)).not.toBe(norm(word.text));
          expect(norm(rushLabel(other!.translationEs))).not.toBe(norm(label));
        }
      }
      // Sin la misma palabra dos veces seguidas.
      for (let i = 1; i < questions.length; i++) {
        expect(questions[i]!.wordId).not.toBe(questions[i - 1]!.wordId);
      }
    },
  );
});

it('las palabras de un idioma nunca aparecen en las preguntas de otro', () => {
  const ids = Object.fromEntries(RANKED.map((l) => [l, new Set(wordsOf(l).map((w) => w.id))]));
  for (const language of RANKED) {
    const questions = generateQuestions(rushPool(wordsOf(language), 0), 200, seeded(7));
    for (const q of questions) {
      for (const other of RANKED) {
        if (other !== language) expect(ids[other]!.has(q.wordId)).toBe(false);
      }
    }
  }
});
