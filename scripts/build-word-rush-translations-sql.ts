/**
 * Ranked compartido (docs/RANKED_SHARED_POOL.md): escribe el SQL de las consignas del banco de Word Rush
 * por idioma de apoyo (content/word-rush/sql.ts → wordRushSentenceTranslationsSql).
 * Uso: node --import tsx scripts/build-word-rush-translations-sql.ts [salida.sql]
 *   (por defecto supabase/pending/20270110120100_word_rush_sentence_translations.sql)
 * Sólo escribe un archivo local: no se conecta a ninguna base.
 */
import { writeFileSync } from 'node:fs';

import { wordRushSentenceTranslationsSql } from '../content/word-rush/sql';

const out =
  process.argv[2] ?? 'supabase/pending/20270110120100_word_rush_sentence_translations.sql';
writeFileSync(out, wordRushSentenceTranslationsSql(), 'utf8');
console.log(`Escrito ${out}`);
