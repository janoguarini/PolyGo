/**
 * Fase 5: filas y SQL de carga del banco de Word Rush (tablas de
 * supabase/pending/20261227120000_word_rush_bank.sql). El SQL lo escribe
 * scripts/build-word-rush-sql.ts; ejecutarlo requiere autorización aparte.
 */
import { joinHan } from '../builders';
import { bankSentence, WORD_RUSH_BANKS, WORD_RUSH_LANGUAGES, type WordRushLanguage } from './index';

const HAN = /\p{Script=Han}/u;

/** Fila de public.word_rush_sentences tal como se carga. */
export interface WordRushSentenceDbRow {
  id: string;
  language_code: WordRushLanguage;
  level: 'A1' | 'A2';
  unit_id: string;
  tokens: string[];
  answer: string;
  accepted_answers: string[];
  translation: string;
  is_published: boolean;
}

/** Fila de public.word_rush_exercise_variants tal como se carga. */
export interface WordRushVariantDbRow {
  exercise_id: string;
  accepted_answers: string[];
  reason: string;
}

export function wordRushSentenceRows(
  languages: readonly WordRushLanguage[] = WORD_RUSH_LANGUAGES,
): WordRushSentenceDbRow[] {
  return languages.flatMap((language) =>
    WORD_RUSH_BANKS[language].sentences.map((def) => {
      const s = bankSentence(language, def);
      return {
        id: s.id,
        language_code: language,
        level: def.level,
        unit_id: s.unitId!,
        tokens: s.tokens,
        answer: s.answer,
        accepted_answers: s.acceptedAnswers,
        translation: s.translation,
        is_published: true,
      };
    }),
  );
}

/** Una fila por ejercicio (las variantes repetidas de un mismo ejercicio se juntan). */
export function wordRushVariantRows(
  languages: readonly WordRushLanguage[] = WORD_RUSH_LANGUAGES,
): WordRushVariantDbRow[] {
  const byExercise = new Map<string, WordRushVariantDbRow>();
  for (const language of languages) {
    for (const v of WORD_RUSH_BANKS[language].variants) {
      const accepted = v.accepted.map((a) => (HAN.test(a) ? joinHan(a) : a));
      const row = byExercise.get(v.exercise);
      if (row) {
        row.accepted_answers = [...new Set([...row.accepted_answers, ...accepted])];
        row.reason = `${row.reason}; ${v.reason}`;
      } else {
        byExercise.set(v.exercise, {
          exercise_id: v.exercise,
          accepted_answers: [...new Set(accepted)],
          reason: v.reason,
        });
      }
    }
  }
  return [...byExercise.values()];
}

const lit = (s: string) => `'${s.replace(/'/g, "''")}'`;
const arr = (xs: readonly string[]) =>
  xs.length ? `array[${xs.map(lit).join(', ')}]::text[]` : `'{}'::text[]`;

/**
 * SQL idempotente: inserta o actualiza (on conflict) las filas del banco. No borra nada: una frase
 * quitada del banco local queda en la base y hay que despublicarla aparte (is_published = false).
 * Si una unidad o un ejercicio no existe, las FK/triggers lanzan un error. Sin begin/commit propios:
 * hay que aplicarlo dentro de una transacción (la del mecanismo de aplicación) para que sea todo o nada.
 */
export function wordRushBankSql(): string {
  const sentences = wordRushSentenceRows();
  const variants = wordRushVariantRows();
  const lines: string[] = [
    '-- =====================================================================',
    '-- Datos del banco de Word Rush (Fase 5). GENERADO por scripts/build-word-rush-sql.ts desde',
    '-- content/word-rush/: no editar a mano. NO APLICADO: requiere autorización aparte y, antes,',
    '-- supabase/pending/20261227120000_word_rush_bank.sql.',
    `-- Frases nuevas: ${sentences.length}. Ejercicios con variantes: ${variants.length}.`,
    '-- Idempotente (on conflict do update). No borra filas ni toca lecciones/ejercicios.',
    '-- =====================================================================',
    '',
    'do $$',
    'begin',
    "  if to_regclass('public.word_rush_sentences') is null",
    "     or to_regclass('public.word_rush_exercise_variants') is null then",
    "    raise exception 'word_rush_bank_data: falta la migración 20261227120000_word_rush_bank';",
    '  end if;',
    'end;',
    '$$;',
    '',
  ];
  for (const s of sentences) {
    lines.push(
      'insert into public.word_rush_sentences (id, language_code, level, unit_id, tokens, answer, accepted_answers, translation, is_published)',
      `values (${[
        lit(s.id),
        lit(s.language_code),
        lit(s.level),
        lit(s.unit_id),
        arr(s.tokens),
        lit(s.answer),
        arr(s.accepted_answers),
        lit(s.translation),
        String(s.is_published),
      ].join(', ')})`,
      'on conflict (id) do update set language_code = excluded.language_code, level = excluded.level,',
      '  unit_id = excluded.unit_id, tokens = excluded.tokens, answer = excluded.answer,',
      '  accepted_answers = excluded.accepted_answers, translation = excluded.translation,',
      '  is_published = excluded.is_published;',
    );
  }
  lines.push('');
  for (const v of variants) {
    lines.push(
      'insert into public.word_rush_exercise_variants (exercise_id, accepted_answers, reason)',
      `values (${lit(v.exercise_id)}, ${arr(v.accepted_answers)}, ${lit(v.reason)})`,
      'on conflict (exercise_id) do update set accepted_answers = excluded.accepted_answers,',
      '  reason = excluded.reason;',
    );
  }
  // Sin begin/commit propios: la transacción la pone quien lo aplica (Fase 5.2).
  lines.push('', '');
  return lines.join('\n');
}
