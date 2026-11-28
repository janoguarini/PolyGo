import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database, Json } from '../../src/lib/database.generated';
import { BOT_PACING } from '../../shared/botPacing';
import { BOT_CALIBRATION } from '../../shared/bots';
import type { ArcadeSentence } from '../../shared/arcade';
import { RATING_CONFIG } from '../../shared/ranking';
import { wordLevel, type RushWord } from '../../shared/wordRush';
import {
  mergeSentenceSources,
  type WordRushSentenceRow,
  type WordRushVariantRow,
} from './wordRushBank';
import {
  consoleLogger,
  CHALLENGE_ERRORS,
  ChallengeError,
  StaleRatingError,
  type BattleStore,
  type BotBattleStart,
  type CourseInfo,
  type Logger,
  type PlayerInfo,
  type SettleResponse,
  type SettlementContextRow,
  type VerifyToken,
} from './types';

/** Cliente con la service_role key: salta RLS. Sólo existe en este proceso. */
export function createServiceClient(url: string, serviceRoleKey: string): SupabaseClient<Database> {
  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

/**
 * Fase 5: lee el banco de Word Rush (word_rush_sentences + word_rush_exercise_variants). Las tablas
 * todavía no están en los tipos generados (src/lib/database.generated.ts), así que se leen sin tipos y
 * cada fila se valida en mergeSentenceSources. Lanza si cualquiera de las dos lecturas falla (también
 * si las tablas no existen): quien llama sigue sólo con las lecciones.
 */
async function loadWordRushBank(
  db: SupabaseClient<Database>,
  languageCode: string,
): Promise<{ sentences: WordRushSentenceRow[]; variants: WordRushVariantRow[] }> {
  const untyped = db as unknown as SupabaseClient;
  const [sentences, variants] = await Promise.all([
    untyped
      .from('word_rush_sentences')
      .select('id, language_code, unit_id, tokens, answer, accepted_answers, translation')
      .eq('language_code', languageCode)
      .eq('is_published', true),
    // Pocas filas en total (~50, los seis cursos): se lee entera y sólo se usan las de ejercicios cargados.
    untyped.from('word_rush_exercise_variants').select('exercise_id, accepted_answers'),
  ]);
  if (sentences.error) throw sentences.error;
  if (variants.error) throw variants.error;
  return {
    sentences: (sentences.data ?? []) as WordRushSentenceRow[],
    variants: (variants.data ?? []) as WordRushVariantRow[],
  };
}

/**
 * Ranked compartido: las frases del banco de Word Rush del idioma con la consigna en `sourceLanguage`
 * (public.word_rush_sentence_translations, supabase/pending/20270110120100). Sólo para los textos de
 * apoyo de un curso que no es el canónico: el servidor las cruza por id con las canónicas. Lanza si
 * cualquiera de las lecturas falla (también si la tabla no existe).
 */
export async function loadBankSupport(
  db: SupabaseClient<Database>,
  languageCode: string,
  sourceLanguage: string,
): Promise<ArcadeSentence[]> {
  const untyped = db as unknown as SupabaseClient;
  const [sentences, translations] = await Promise.all([
    untyped
      .from('word_rush_sentences')
      .select('id, unit_id, tokens, answer, accepted_answers')
      .eq('language_code', languageCode)
      .eq('is_published', true),
    untyped
      .from('word_rush_sentence_translations')
      .select('sentence_id, translation')
      .eq('source_language', sourceLanguage),
  ]);
  if (sentences.error) throw sentences.error;
  if (translations.error) throw translations.error;
  const byId = new Map<string, string>();
  for (const t of (translations.data ?? []) as { sentence_id: unknown; translation: unknown }[]) {
    if (
      typeof t.sentence_id === 'string' &&
      typeof t.translation === 'string' &&
      t.translation.trim()
    ) {
      byId.set(t.sentence_id, t.translation);
    }
  }
  const out: ArcadeSentence[] = [];
  for (const row of (sentences.data ?? []) as Record<string, unknown>[]) {
    const translation = typeof row.id === 'string' ? byId.get(row.id) : undefined;
    if (!translation || typeof row.answer !== 'string' || !Array.isArray(row.tokens)) continue;
    out.push({
      id: row.id as string,
      tokens: (row.tokens as unknown[]).filter((t): t is string => typeof t === 'string'),
      answer: row.answer,
      acceptedAnswers: Array.isArray(row.accepted_answers)
        ? (row.accepted_answers as unknown[]).filter((t): t is string => typeof t === 'string')
        : [],
      translation,
      unitId: typeof row.unit_id === 'string' ? row.unit_id : null,
    });
  }
  return out;
}

export function createSupabaseStore(
  db: SupabaseClient<Database>,
  logger: Logger = consoleLogger,
): BattleStore {
  return {
    async getPlayer(userId) {
      const { data: profile, error } = await db
        .from('profiles')
        .select(
          'id, username, avatar_id, avatar_path, frame_id, target_language, onboarding_completed_at',
        )
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      if (!profile?.username || !profile.onboarding_completed_at) return null;

      const { data: rating, error: ratingError } = await db
        .from('player_ratings')
        .select('rating, games_played, wins')
        .eq('user_id', userId)
        .eq('language_code', profile.target_language)
        .maybeSingle();
      if (ratingError) throw ratingError;
      if (!rating) return null;

      // Sólo para decidir si ofrecer un bot de calibración: la base lo vuelve a contar al empezar.
      const { data: used, error: usedError } = await db.rpc('bot_calibration_used', {
        p_user_id: userId,
        p_language_code: profile.target_language,
      });
      if (usedError) throw usedError;

      // Puntajes recientes en Word Rush (protocolo 3), para el objetivo del bot. Si falla, el bot juega
      // como siempre: nunca impide entrar a la cola.
      let recentScores: number[] = [];
      const { data: recent, error: recentError } = await db
        .from('battles')
        .select('ended_at, battle_players!inner(score, user_id)')
        .eq('battle_players.user_id', userId)
        .eq('language_code', profile.target_language)
        .eq('protocol_version', 3)
        .eq('status', 'completed')
        .order('ended_at', { ascending: false })
        .limit(BOT_PACING.historySize);
      if (recentError) {
        logger.warn('recent_scores_unavailable', { userId, err: recentError.message });
      } else {
        recentScores = (recent ?? []).flatMap((row) =>
          row.battle_players.map((p) => p.score).filter((s): s is number => typeof s === 'number'),
        );
      }

      // Ranked compartido: el curso con que estudia este idioma (textos de apoyo). Si la función no está
      // o falla, juega con los textos canónicos: nunca impide entrar a la cola.
      let courseCode: string | null = null;
      const { data: course, error: courseError } = await (db as unknown as SupabaseClient).rpc(
        'user_course_for',
        { p_user: userId, p_language: profile.target_language },
      );
      if (courseError) {
        logger.warn('user_course_unavailable', { userId, err: courseError.message });
      } else if (typeof course === 'string') {
        courseCode = course;
      }

      return {
        userId,
        username: profile.username,
        avatarId: profile.avatar_id,
        avatarPath: profile.avatar_path,
        frameId: profile.frame_id,
        languageCode: profile.target_language,
        rating: rating.rating,
        gamesPlayed: rating.games_played,
        wins: rating.wins,
        botCalibrationLeft: Math.max(0, BOT_CALIBRATION.ratedGames - (used ?? 0)),
        recentScores,
        courseCode,
      } satisfies PlayerInfo;
    },

    async courses() {
      // courses todavía no está en los tipos generados (src/lib/database.generated.ts).
      const { data, error } = await (db as unknown as SupabaseClient)
        .from('courses')
        .select('code, target_language, source_language, is_default');
      if (error) throw error;
      return ((data ?? []) as Record<string, unknown>[])
        .filter(
          (c) =>
            typeof c.code === 'string' &&
            typeof c.target_language === 'string' &&
            typeof c.source_language === 'string',
        )
        .map((c): CourseInfo => ({
          code: c.code as string,
          targetLanguage: c.target_language as string,
          sourceLanguage: c.source_language as string,
          isDefault: c.is_default === true,
        }));
    },

    async loadWords(languageCode, courseCode) {
      // words.course_code (20270108120000) todavía no está en los tipos generados.
      let query = (db as unknown as SupabaseClient)
        .from('words')
        .select('id, text, translation_es, unit_id, emoji')
        .eq('language_code', languageCode)
        .eq('is_published', true);
      // Ranked compartido: sólo el curso pedido.
      if (courseCode) query = query.eq('course_code', courseCode);
      const { data, error } = await query;
      if (error) throw error;
      type WordRow = {
        id: string;
        text: string;
        translation_es: string;
        unit_id: string | null;
        emoji: string | null;
      };
      return ((data ?? []) as WordRow[]).map((w): RushWord => ({
        id: w.id,
        text: w.text,
        translationEs: w.translation_es,
        emoji: w.emoji,
        level: wordLevel(w.unit_id),
        // Fase C.7: el mazo se filtra por las unidades comunes a los jugadores (rushUnits).
        unitId: w.unit_id,
      }));
    },

    async rushUnits(languageCode, players) {
      const { data, error } = await db.rpc('rush_common_unit_ids', {
        p_language: languageCode,
        p_players: players.map((p) => p.userId),
        p_apis: players.map((p) => p.curriculumApi ?? 0),
      });
      if (error) throw error;
      if (!Array.isArray(data)) throw new Error('rush_common_unit_ids: sin unidades');
      return new Set(data);
    },

    async loadSentences(languageCode, course) {
      // Tres lecturas simples (unidades → lecciones → ejercicios), todas publicadas y del curso.
      let unitsQuery = (db as unknown as SupabaseClient)
        .from('curriculum_units')
        .select('id')
        .eq('language_code', languageCode)
        .eq('is_published', true);
      // Ranked compartido: sólo las lecciones del curso pedido (curriculum_units.course_code).
      if (course) unitsQuery = unitsQuery.eq('course_code', course.code);
      const { data: units, error: unitsError } = (await unitsQuery) as {
        data: { id: string }[] | null;
        error: { message: string } | null;
      };
      if (unitsError) throw unitsError;
      const unitIds = (units ?? []).map((u) => u.id);
      if (unitIds.length === 0) return [];

      const { data: lessons, error: lessonsError } = await db
        .from('lessons')
        .select('id, unit_id')
        .in('unit_id', unitIds)
        .eq('is_published', true);
      if (lessonsError) throw lessonsError;
      const unitOf = new Map((lessons ?? []).map((l) => [l.id, l.unit_id]));
      if (unitOf.size === 0) return [];

      const { data: exercises, error } = await db
        .from('exercises')
        .select('id, lesson_id, payload, answer, accepted_answers')
        .eq('type', 'order_words')
        .eq('is_published', true)
        .in('lesson_id', [...unitOf.keys()]);
      if (error) throw error;

      const sentences: ArcadeSentence[] = [];
      for (const e of exercises ?? []) {
        const payload = e.payload as { tokens?: unknown; translation?: unknown } | null;
        const tokens = payload?.tokens;
        if (
          !Array.isArray(tokens) ||
          !tokens.every((t): t is string => typeof t === 'string') ||
          typeof payload?.translation !== 'string'
        ) {
          continue;
        }
        sentences.push({
          id: e.id,
          tokens,
          answer: e.answer,
          acceptedAnswers: e.accepted_answers ?? [],
          translation: payload.translation,
          unitId: unitOf.get(e.lesson_id) ?? null,
        });
      }

      // Ranked compartido: un curso que no es el canónico sólo aporta sus textos de apoyo. Sus frases del
      // banco son las del canónico (mismo id, mismo inglés) con la consigna en su idioma
      // (word_rush_sentence_translations); sin esa consigna, la frase no está en la lista y el servidor
      // muestra la canónica (y lo registra).
      if (course && !course.isDefault) {
        try {
          return [
            ...sentences,
            ...(await loadBankSupport(db, languageCode, course.sourceLanguage)),
          ];
        } catch (err) {
          logger.warn('word_rush_translations_unavailable', {
            languageCode,
            course: course.code,
            err: String((err as { message?: unknown } | null)?.message ?? err),
            code: (err as { code?: unknown } | null)?.code ?? null,
          });
          return sentences;
        }
      }

      // Fase 5: el banco propio de Word Rush. Si no se puede leer (tablas sin crear, red, permisos),
      // la partida sigue sólo con las lecciones: nunca un banco a medias ni variantes sin su frase.
      let bank: Awaited<ReturnType<typeof loadWordRushBank>>;
      try {
        bank = await loadWordRushBank(db, languageCode);
      } catch (err) {
        logger.warn('word_rush_bank_unavailable', {
          languageCode,
          err: String((err as { message?: unknown } | null)?.message ?? err),
          code: (err as { code?: unknown } | null)?.code ?? null,
        });
        return sentences;
      }
      const merged = mergeSentenceSources(languageCode, sentences, bank, new Set(unitIds));
      const { report } = merged;
      if (report.bankSkipped || report.variantsSkipped || report.duplicatesSkipped) {
        logger.warn('word_rush_bank_rows_skipped', { languageCode, ...report });
      }
      return merged.sentences;
    },

    async startBattle(battleId, languageCode, player1, player2, protocolVersion) {
      const { error } = await db.rpc('start_battle', {
        p_battle_id: battleId,
        p_language_code: languageCode,
        p_player1: player1,
        p_player2: player2,
        p_protocol_version: protocolVersion,
      });
      if (error) throw error;
    },

    async startBotBattle(battleId, languageCode, player, bot, rated, protocolVersion) {
      const { data, error } = await db.rpc('start_bot_battle_v2', {
        p_battle_id: battleId,
        p_language_code: languageCode,
        p_player: player,
        p_bot_name: bot.name,
        p_bot_avatar_id: bot.avatarId,
        p_bot_rating: bot.rating,
        p_protocol_version: protocolVersion,
        p_rated: rated,
      });
      if (error) throw error;
      const res = data as unknown as {
        rated: boolean;
        calibration_used: number;
        calibration_limit: number;
      };
      return {
        rated: res.rated,
        calibration: { used: res.calibration_used, limit: res.calibration_limit },
      } satisfies BotBattleStart;
    },

    async challengeHost(code, hostId) {
      const { data, error } = await db.rpc('battle_server_challenge_host', {
        p_code: code,
        p_host: hostId,
      });
      if (error) throw challengeError(error);
      const res = data as unknown as {
        language_code: string;
        invitee_id: string | null;
        expires_at: number;
      };
      return {
        languageCode: res.language_code,
        inviteeId: res.invitee_id,
        expiresAt: Number(res.expires_at),
      };
    },

    async challengeJoin(code, guestId) {
      const { data, error } = await db.rpc('battle_server_challenge_join', {
        p_code: code,
        p_guest: guestId,
      });
      if (error) throw challengeError(error);
      const res = data as unknown as { host_id: string; language_code: string };
      return { hostId: res.host_id, languageCode: res.language_code };
    },

    async startFriendlyBattle(battleId, code, host, guest, protocolVersion) {
      const { error } = await db.rpc('start_friendly_battle', {
        p_battle_id: battleId,
        p_code: code,
        p_host: host,
        p_guest: guest,
        p_protocol_version: protocolVersion,
      });
      if (error) throw challengeError(error);
    },

    async settlementContext(battleId) {
      const { data, error } = await db.rpc('battle_settlement_context_v2', {
        p_battle_id: battleId,
        p_window_hours: RATING_CONFIG.repeatOpponentWindowHours,
      });
      if (error) throw error;
      // Los tipos generados no marcan como nullable las columnas de un LEFT JOIN (cuenta borrada).
      return data.map((row): SettlementContextRow => ({
        slot: row.slot as 1 | 2,
        userId: row.user_id ?? null,
        rating: row.rating ?? null,
        gamesPlayed: row.games_played ?? null,
        wins: row.wins ?? null,
        matchesInWindow: row.matches_in_window,
        isRanked: row.is_ranked,
      }));
    },

    async settleBattle(battleId, status, players) {
      const { data, error } = await db.rpc('settle_battle', {
        p_battle_id: battleId,
        p_status: status,
        p_players: players as unknown as Json,
      });
      if (error) {
        if (error.code === '40001' || error.message.includes('stale_rating')) {
          throw new StaleRatingError();
        }
        throw error;
      }
      return data as unknown as SettleResponse;
    },

    async cancelBattle(battleId) {
      const { error } = await db.rpc('cancel_battle', { p_battle_id: battleId });
      if (error) throw error;
    },

    async cancelStaleBattles(olderThanSeconds) {
      const { data, error } = await db.rpc('cancel_stale_battles', {
        p_older_than_seconds: olderThanSeconds,
      });
      if (error) throw error;
      return data as number;
    },
  };
}

/** Valida el access token del usuario contra Supabase Auth (sirve con claves simétricas o asimétricas). */
export function createTokenVerifier(db: SupabaseClient<Database>): VerifyToken {
  return async (token) => {
    const { data, error } = await db.auth.getUser(token);
    if (error || !data.user) return null;
    return data.user.id;
  };
}

/** Un rechazo de la base con un código de desafío conocido se reenvía al cliente tal cual. */
function challengeError(error: { message: string }): Error {
  const code = CHALLENGE_ERRORS.find((c) => error.message === c || error.message.includes(c));
  return code ? new ChallengeError(code) : new Error(error.message);
}
