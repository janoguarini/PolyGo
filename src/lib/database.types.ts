/**
 * Tipos de la base de datos escritos a mano a partir de supabase/migrations.
 * Cuando exista un proyecto Supabase, regenerarlos con:
 *   npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts
 */

type Timestamp = string;

export type ProfileRow = {
  id: string;
  username: string | null;
  public_code: string;
  display_name: string | null;
  avatar_id: string;
  target_language: string;
  start_level: 'A1' | 'A2';
  daily_goal_minutes: number;
  region: string | null;
  onboarding_completed_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type UserSettingsRow = {
  user_id: string;
  profile_visibility: 'public' | 'friends' | 'private';
  show_region: boolean;
  widget_content_type: 'word_of_day' | 'quick_question' | 'review';
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type PlayerRatingRow = {
  user_id: string;
  language_code: string;
  rating: number;
  peak_rating: number;
  games_played: number;
  wins: number;
  losses: number;
  draws: number;
  win_streak: number;
  best_win_streak: number;
  updated_at: Timestamp;
};

export type RatingHistoryRow = {
  id: number;
  user_id: string;
  language_code: string;
  season_id: number | null;
  battle_id: string | null;
  reason: 'initial' | 'battle' | 'adjustment';
  rating_before: number;
  rating_after: number;
  delta: number;
  created_at: Timestamp;
};

export type SeasonRow = {
  id: number;
  name: string;
  starts_at: Timestamp;
  ends_at: Timestamp;
  status: 'scheduled' | 'active' | 'finished';
  created_at: Timestamp;
};

export type LanguageRow = {
  code: string;
  name_es: string;
  is_target_available: boolean;
  created_at: Timestamp;
};

type Table<Row, Update = Partial<Row>> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        ProfileRow,
        Partial<Pick<ProfileRow, 'display_name' | 'avatar_id' | 'daily_goal_minutes' | 'region'>>
      >;
      user_settings: Table<
        UserSettingsRow,
        Partial<Pick<UserSettingsRow, 'profile_visibility' | 'show_region' | 'widget_content_type'>>
      >;
      player_ratings: Table<PlayerRatingRow, never>;
      rating_history: Table<RatingHistoryRow, never>;
      seasons: Table<SeasonRow, never>;
      languages: Table<LanguageRow, never>;
    };
    Views: Record<string, never>;
    Functions: {
      is_username_available: { Args: { p_username: string }; Returns: boolean };
      complete_onboarding: {
        Args: {
          p_username: string;
          p_avatar_id: string;
          p_target_language: string;
          p_start_level: string;
          p_daily_goal_minutes: number;
        };
        Returns: ProfileRow;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
