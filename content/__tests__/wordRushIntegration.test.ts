import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { mergeSentenceSources } from '../../server/src/wordRushBank';
import { createChallengeStream, sentencePool, type ArcadeSentence } from '../../shared/arcade';
import type { RushWord } from '../../shared/wordRush';
import {
  PUBLISHED_PATHS,
  WORD_RUSH_LANGUAGES,
  lessonOnlySentences,
  unitIdOf,
  wordRushSentences,
} from '../word-rush';
import { BAND_RATING } from '../word-rush/checks';
import { wordRushSentenceRows, wordRushVariantRows } from '../word-rush/sql';

/**
 * Fase 5: el banco de Word Rush tal como lo leería el servidor (filas de content/word-rush/sql.ts →
 * mergeSentenceSources de server/src/wordRushBank.ts) y su aislamiento del resto de la app.
 * La carga real en PGlite está en supabase/tests/wordRushBank.test.mjs.
 */

const publishedUnits = (language: (typeof WORD_RUSH_LANGUAGES)[number]) =>
  new Set(PUBLISHED_PATHS[language].map((u) => unitIdOf(language, u.level, u.unit.position)));

function serverSentences(language: (typeof WORD_RUSH_LANGUAGES)[number]) {
  return mergeSentenceSources(
    language,
    lessonOnlySentences(language),
    {
      sentences: wordRushSentenceRows([language]),
      variants: wordRushVariantRows(),
    },
    publishedUnits(language),
  );
}

const sortById = (list: readonly ArcadeSentence[]) =>
  [...list]
    .map((s) => ({ ...s, acceptedAnswers: [...s.acceptedAnswers].sort() }))
    .sort((a, b) => a.id.localeCompare(b.id));

describe('Word Rush: banco unido como en el servidor', () => {
  it.each(WORD_RUSH_LANGUAGES)(
    '%s: igual al contenido local, sin filas descartadas',
    (language) => {
      const { sentences, report } = serverSentences(language);
      expect(report).toEqual({
        bankSentences: wordRushSentenceRows([language]).length,
        bankSkipped: 0,
        variantsApplied: expect.any(Number),
        variantsSkipped: 0,
        duplicatesSkipped: 0,
      });
      expect(sortById(sentences)).toEqual(sortById(wordRushSentences(language)));
    },
  );

  it('frases utilizables en A1 según docs/WORD_RUSH_CONTENT.md (inglés 165, español 167)', () => {
    const a1 = (language: 'en' | 'es') =>
      sentencePool(serverSentences(language).sentences, language, BAND_RATING.A1).length;
    expect(a1('en')).toBe(165);
    expect(a1('es')).toBe(167);
  });

  it('no modifica las frases de las lecciones que recibe', () => {
    const lessons = lessonOnlySentences('en');
    const copy = JSON.parse(JSON.stringify(lessons));
    mergeSentenceSources(
      'en',
      lessons,
      { sentences: wordRushSentenceRows(['en']), variants: wordRushVariantRows() },
      publishedUnits('en'),
    );
    expect(lessons).toEqual(copy);
  });

  it.each(['en', 'es'] as const)(
    '%s A1: 60 desafíos sin repetir frase y la misma secuencia con la misma semilla',
    (language) => {
      const pool = sentencePool(serverSentences(language).sentences, language, BAND_RATING.A1);
      const words: RushWord[] = Array.from({ length: 80 }, (_, i) => ({
        id: `w${i}`,
        text: `word${i}`,
        translationEs: `palabra${i}`,
        level: 'A1',
        unitId: 'a1-u01',
      }));
      const seeded = (seed: number) => () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
      const a = createChallengeStream(words, pool, seeded(11));
      const b = createChallengeStream(words, pool, seeded(11));
      const ids: string[] = [];
      for (let i = 0; i < 60; i++) {
        expect(a.at(i)).toEqual(b.at(i));
        const c = a.at(i);
        if (c.kind === 'sentence') ids.push(c.sentenceId);
      }
      expect(ids.length).toBeGreaterThan(0);
      expect(new Set(ids).size).toBe(ids.length);
    },
  );
});

describe('Word Rush: el banco sólo lo lee el servidor de partidas', () => {
  const ROOT = join(__dirname, '..', '..');
  const TABLES = /word_rush_sentences|word_rush_exercise_variants/;

  function files(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      if (name === 'node_modules' || name === '__tests__') return [];
      return statSync(path).isDirectory() ? files(path) : [path];
    });
  }

  it('ni la app, ni las lecciones, ni los desafíos con amigos, ni las migraciones aplicables las usan', () => {
    const scanned = ['src', 'shared', 'supabase/functions', 'supabase/migrations', 'server/src']
      .flatMap((d) => files(join(ROOT, d)))
      .filter((f) => /\.(ts|tsx|mjs|js|sql)$/.test(f));
    const users = scanned
      .filter((f) => TABLES.test(readFileSync(f, 'utf8')))
      .map((f) => relative(ROOT, f).replace(/\\/g, '/'));
    // Sólo la lectura del servidor (loadSentences) y sus tipos/comentarios. La migración vive en
    // supabase/pending/.
    expect(users.sort()).toEqual(['server/src/supabaseStore.ts', 'server/src/wordRushBank.ts']);
  });
});
