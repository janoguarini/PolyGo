import type { PlayerRatingRow, ProfileRow, SeasonRow, UserSettingsRow } from '@/lib/database.types';
import { requireSupabase } from '@/lib/supabase';

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
  patch: Partial<Pick<UserSettingsRow, 'profile_visibility' | 'show_region'>>,
) {
  const { error } = await requireSupabase()
    .from('user_settings')
    .update(patch)
    .eq('user_id', userId);
  if (error) throw error;
}
