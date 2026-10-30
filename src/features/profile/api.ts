import type {
  PlayerRatingRow,
  ProfileRow,
  ProfileVisibility,
  SeasonRow,
  UserSettingsRow,
} from '@/lib/database.types';
import { requireSupabase } from '@/lib/supabase';

import { MAX_CHART_POINTS, isMatchResult, type MatchResult, type RatingPoint } from './stats';

export interface MyProfile {
  profile: ProfileRow;
  rating: PlayerRatingRow | null;
  settings: UserSettingsRow | null;
}

export async function fetchMyProfile(userId: string): Promise<MyProfile> {
  const db = requireSupabase();
  const [profile, settings] = await Promise.all([
    db.from('profiles').select('*').eq('id', userId).single(),
    db.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
  ]);
  if (profile.error) throw profile.error;
  if (settings.error) throw settings.error;

  const rating = await db
    .from('player_ratings')
    .select('*')
    .eq('user_id', userId)
    .eq('language_code', profile.data.target_language)
    .maybeSingle();
  if (rating.error) throw rating.error;

  return { profile: profile.data, rating: rating.data, settings: settings.data };
}

export async function fetchActiveSeason(): Promise<SeasonRow | null> {
  const { data, error } = await requireSupabase()
    .from('seasons')
    .select('*')
    .eq('status', 'active')
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const { data, error } = await requireSupabase().rpc('is_username_available', {
    p_username: username,
  });
  if (error) throw error;
  return data;
}

export interface OnboardingInput {
  username: string;
  avatarId: string;
  targetLanguage: string;
  startLevel: string;
  dailyGoalMinutes: number;
}

export async function completeOnboarding(input: OnboardingInput): Promise<ProfileRow> {
  const { data, error } = await requireSupabase().rpc('complete_onboarding', {
    p_username: input.username,
    p_avatar_id: input.avatarId,
    p_target_language: input.targetLanguage,
    p_start_level: input.startLevel,
    p_daily_goal_minutes: input.dailyGoalMinutes,
  });
  if (error) throw error;
  return data;
}

export async function updateSettings(
  userId: string,
  patch: { profile_visibility?: ProfileVisibility; show_region?: boolean },
) {
  const { error } = await requireSupabase()
    .from('user_settings')
    .update(patch)
    .eq('user_id', userId);
  if (error) throw error;
}

export interface ProfilePatch {
  display_name?: string;
  avatar_id?: string;
  daily_goal_minutes?: number;
  region?: string | null;
  avatar_path?: string | null;
}

export async function updateProfile(userId: string, patch: ProfilePatch) {
  const { error } = await requireSupabase().from('profiles').update(patch).eq('id', userId);
  if (error) throw error;
}

/** Evolución del ELO (sólo el dueño puede leer su historial, por RLS). Orden cronológico. */
export async function fetchRatingHistory(
  userId: string,
  languageCode: string,
): Promise<RatingPoint[]> {
  const { data, error } = await requireSupabase()
    .from('rating_history')
    .select('rating_after, delta, created_at, reason')
    .eq('user_id', userId)
    .eq('language_code', languageCode)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(MAX_CHART_POINTS);
  if (error) throw error;
  return data
    .map((r) => ({
      rating: r.rating_after,
      delta: r.delta ?? 0,
      at: r.created_at,
      reason: r.reason,
    }))
    .reverse();
}

export interface MatchHistoryEntry {
  battleId: string;
  endedAt: string;
  isRanked: boolean;
  result: MatchResult | null;
  forfeited: boolean;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  ratingDelta: number | null;
  ratingAfter: number | null;
  /** null si el rival borró su cuenta. */
  opponent: { id: string; username: string | null; avatarId: string | null } | null;
  opponentScore: number | null;
}

export const MATCH_PAGE_SIZE = 20;

/** Partidas terminadas del usuario actual, más recientes primero. `before` pagina por fecha. */
export async function fetchMatchHistory(
  before: string | null,
  limit = MATCH_PAGE_SIZE,
): Promise<MatchHistoryEntry[]> {
  const { data, error } = await requireSupabase().rpc('get_match_history', {
    p_limit: limit,
    // La función acepta NULL (primera página); los tipos generados no lo reflejan.
    p_before: before as string,
  });
  if (error) throw error;
  return data.map((row) => ({
    battleId: row.battle_id,
    endedAt: row.ended_at,
    isRanked: row.is_ranked,
    result: isMatchResult(row.result) ? row.result : null,
    forfeited: row.forfeited,
    score: row.score,
    correctAnswers: row.correct_answers,
    totalAnswers: row.total_answers,
    ratingDelta:
      row.rating_after != null && row.rating_before != null
        ? row.rating_after - row.rating_before
        : null,
    ratingAfter: row.rating_after ?? null,
    opponent: row.opponent_id
      ? {
          id: row.opponent_id,
          username: row.opponent_username ?? null,
          avatarId: row.opponent_avatar_id ?? null,
        }
      : null,
    opponentScore: row.opponent_score ?? null,
  }));
}

export interface Achievement {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  progress: number;
  unlockedAt: string | null;
}

export async function fetchMyAchievements(): Promise<Achievement[]> {
  const { data, error } = await requireSupabase().rpc('get_my_achievements');
  if (error) throw error;
  return data.map((a) => ({
    id: a.id,
    category: a.category,
    title: a.title_es,
    description: a.description_es,
    icon: a.icon,
    threshold: a.threshold,
    progress: a.progress,
    unlockedAt: a.unlocked_at ?? null,
  }));
}

export interface PublicProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_id: string;
  avatar_path?: string | null;
  public_code: string;
  created_at: string;
  /** false si el perfil es privado: sólo llegan identidad y rango. */
  is_public: boolean;
  /** País (sólo si el jugador eligió mostrarlo). */
  region?: string | null;
  rating: { rating: number; games_played: number } | null;
  stats?: {
    wins: number;
    losses: number;
    draws: number;
    peak_rating: number;
    best_win_streak: number;
  } | null;
  learning?: {
    lessons_completed: number;
    words_mastered: number;
    best_streak_days: number;
    stars_earned: number;
    golden_lessons: number;
  };
  achievements?: {
    id: string;
    title: string;
    icon: string;
    category: string;
    unlocked_at: string;
  }[];
}

export async function fetchPublicProfile(userId: string): Promise<PublicProfile | null> {
  const { data, error } = await requireSupabase().rpc('get_public_profile', {
    p_user_id: userId,
  });
  if (error) throw error;
  return (data ?? null) as unknown as PublicProfile | null;
}

export interface CompetitiveStats {
  games: number;
  wins: number;
  draws: number;
  losses: number;
  /** Suma de variaciones de ELO en partidas ranked del período. */
  rating_delta: number;
  best_win_streak: number;
}

/** Estadísticas propias de los últimos `days` días (null = desde siempre). */
export async function fetchCompetitiveStats(days: number | null): Promise<CompetitiveStats> {
  const { data, error } = await requireSupabase().rpc('get_competitive_stats', { p_days: days });
  if (error) throw error;
  return data as unknown as CompetitiveStats;
}

/** ELO propio en cada idioma donde haya jugado o tenga rating. */
export async function fetchMyRatings(userId: string): Promise<Record<string, number>> {
  const { data, error } = await requireSupabase()
    .from('player_ratings')
    .select('language_code, rating')
    .eq('user_id', userId);
  if (error) throw error;
  return Object.fromEntries(data.map((r) => [r.language_code, r.rating]));
}

export type ReportReason = 'sexual' | 'violent' | 'hateful' | 'impersonation' | 'other';

/** Reporta la foto de perfil actual de un jugador (idempotente por foto y reportante). */
export async function reportAvatar(
  userId: string,
  reason: ReportReason,
): Promise<{ reported: boolean; hidden: boolean }> {
  const { data, error } = await requireSupabase().rpc('report_avatar', {
    p_user_id: userId,
    p_reason: reason,
  });
  if (error) throw error;
  return data as unknown as { reported: boolean; hidden: boolean };
}
