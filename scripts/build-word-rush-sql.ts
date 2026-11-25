/**
 * Escribe el SQL de carga del banco de Word Rush (content/word-rush/sql.ts).
 * Uso: node --import tsx scripts/build-word-rush-sql.ts [salida.sql]
 *   (por defecto supabase/pending/20261227120100_word_rush_bank_data.sql)
 * Sólo escribe un archivo local: no se conecta a ninguna base.
 */
import { writeFileSync } from 'node:fs';

import { bankProblems } from '../content/word-rush/checks';
import { WORD_RUSH_LANGUAGES } from '../content/word-rush';
import { wordRushBankSql } from '../content/word-rush/sql';

const out = process.argv[2] ?? 'supabase/pending/20261227120100_word_rush_bank_data.sql';

const problems = WORD_RUSH_LANGUAGES.flatMap((l) => bankProblems(l));
if (problems.length) {
  console.error(`El banco tiene ${problems.length} problemas:\n${problems.join('\n')}`);
  process.exit(1);
}

writeFileSync(out, wordRushBankSql(), 'utf8');
console.log(`Escrito ${out}`);
