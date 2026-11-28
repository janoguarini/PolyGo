/**
 * Fase 5: filas y SQL de carga del banco de Word Rush (tablas de
 * supabase/pending/20261227120000_word_rush_bank.sql). El SQL lo escribe
 * scripts/build-word-rush-sql.ts; ejecutarlo requiere autorización aparte.
 */
import { joinHan } from '../builders';
import {
  EN_WORD_RUSH_SUPPORT,
  WORD_RUSH_SUPPORT_LANGUAGES,
  type WordRushSupportLanguage,
} from './en-support';
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

// ---------------------------------------------------------------------------------------------
// Ranked compartido (docs/RANKED_SHARED_POOL.md): consignas por idioma de apoyo.

/** Fila de public.word_rush_sentence_translations tal como se carga. */
export interface WordRushSentenceTranslationDbRow {
  sentence_id: string;
  source_language: WordRushSupportLanguage;
  translation: string;
}

/** Una fila por frase del banco de inglés y por idioma de apoyo (pt, it, fr). */
export function wordRushSentenceTranslationRows(): WordRushSentenceTranslationDbRow[] {
  const rows: WordRushSentenceTranslationDbRow[] = [];
  const known = new Set(WORD_RUSH_BANKS.en.sentences.map((s) => s.id));
  for (const id of EN_WORD_RUSH_SUPPORT.keys()) {
    if (!known.has(id)) throw new Error(`${id}: consigna de una frase que no está en el banco`);
  }
  for (const def of WORD_RUSH_BANKS.en.sentences) {
    const support = EN_WORD_RUSH_SUPPORT.get(def.id);
    if (!support) {
      throw new Error(`${def.id}: falta la consigna en pt/it/fr (content/word-rush/en-support.ts)`);
    }
    for (const language of WORD_RUSH_SUPPORT_LANGUAGES) {
      rows.push({ sentence_id: def.id, source_language: language, translation: support[language] });
    }
  }
  return rows;
}

/**
 * SQL de supabase/pending/20270110120100_word_rush_sentence_translations.sql: la tabla (idempotente) y
 * sus datos (on conflict do update; no borra). Requiere el banco (20261227120000/120100). Sin
 * begin/commit propios, como el resto de las cargas.
 */
export function wordRushSentenceTranslationsSql(): string {
  const rows = wordRushSentenceTranslationRows();
  const sentences = rows.length / WORD_RUSH_SUPPORT_LANGUAGES.length;
  const lines: string[] = [
    '-- =====================================================================',
    '-- Ranked compartido (docs/RANKED_SHARED_POOL.md): la consigna de cada frase del banco de Word Rush en',
    '-- el idioma de apoyo de cada curso que no es el canónico (en-from-pt/it/fr). El inglés, las fichas y',
    '-- las respuestas siguen en public.word_rush_sentences: esto sólo agrega textos de apoyo.',
    '-- GENERADO por scripts/build-word-rush-translations-sql.ts desde content/word-rush/en-support.ts: no',
    '-- editar a mano. LOCAL: NO APLICADA. Requiere supabase/pending/20261227120000_word_rush_bank.sql y',
    '-- 20261227120100_word_rush_bank_data.sql (aplicadas en producción).',
    `-- Filas: ${rows.length} (${sentences} frases × ${WORD_RUSH_SUPPORT_LANGUAGES.join(', ')}).`,
    '-- Acceso: como el banco, sólo el servidor de partidas (service_role, select). Idempotente; no borra.',
    '-- Rollback: supabase/rollback/20270110120100_word_rush_sentence_translations.down.sql.',
    '-- Pruebas: supabase/tests/rankedSharedPool.test.mjs.',
    '-- =====================================================================',
    '',
    'do $$',
    'begin',
    "  if to_regclass('public.word_rush_sentences') is null then",
    "    raise exception 'word_rush_sentence_translations: falta la migración 20261227120000_word_rush_bank';",
    '  end if;',
    'end;',
    '$$;',
    '',
    'create table if not exists public.word_rush_sentence_translations (',
    '  sentence_id text not null references public.word_rush_sentences (id) on delete cascade,',
    '  -- Idioma de apoyo del curso (courses.source_language): pt, it, fr…',
    '  source_language text not null references public.languages (code),',
    "  translation text not null check (btrim(translation) <> ''),",
    '  created_at timestamptz not null default now(),',
    '  updated_at timestamptz not null default now(),',
    '  primary key (sentence_id, source_language)',
    ');',
    '',
    'create index if not exists word_rush_sentence_translations_source_idx',
    '  on public.word_rush_sentence_translations (source_language);',
    '',
    '-- La consigna va en otro idioma que la frase (nunca «inglés para el inglés»).',
    'create or replace function public.word_rush_sentence_translations_check()',
    'returns trigger',
    'language plpgsql',
    "set search_path = ''",
    'as $$',
    'begin',
    '  if exists (select 1 from public.word_rush_sentences s',
    '             where s.id = new.sentence_id and s.language_code = new.source_language) then',
    "    raise exception 'word_rush_sentence_translations %: la consigna no puede estar en el idioma de la frase (%)',",
    "      new.sentence_id, new.source_language using errcode = 'check_violation';",
    '  end if;',
    '  return new;',
    'end;',
    '$$;',
    'revoke all on function public.word_rush_sentence_translations_check() from public, anon, authenticated;',
    '',
    'drop trigger if exists word_rush_sentence_translations_check on public.word_rush_sentence_translations;',
    'create trigger word_rush_sentence_translations_check',
    '  before insert or update on public.word_rush_sentence_translations',
    '  for each row execute function public.word_rush_sentence_translations_check();',
    '',
    'drop trigger if exists word_rush_sentence_translations_updated_at on public.word_rush_sentence_translations;',
    'create trigger word_rush_sentence_translations_updated_at',
    '  before update on public.word_rush_sentence_translations',
    '  for each row execute function public.set_updated_at();',
    '',
    'alter table public.word_rush_sentence_translations enable row level security;',
    'revoke all on public.word_rush_sentence_translations from public, anon, authenticated;',
    'revoke all on public.word_rush_sentence_translations from service_role;',
    'grant select on public.word_rush_sentence_translations to service_role;',
    '',
  ];
  for (const r of rows) {
    lines.push(
      'insert into public.word_rush_sentence_translations (sentence_id, source_language, translation)',
      `values (${lit(r.sentence_id)}, ${lit(r.source_language)}, ${lit(r.translation)})`,
      'on conflict (sentence_id, source_language) do update set translation = excluded.translation;',
    );
  }
  lines.push('', '');
  return lines.join('\n');
}
