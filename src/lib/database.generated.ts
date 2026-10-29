// Generado desde el proyecto Supabase (MCP generate_typescript_types). No editar a mano.
// Regenerar tras cada migración: npx supabase gen types typescript --project-id wtymosvsymzoosxscnxi

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type FK<
  Name extends string,
  Column extends string,
  Target extends string,
  TargetColumn extends string,
  OneToOne extends boolean = false,
> = {
  foreignKeyName: Name;
  columns: [Column];
  isOneToOne: OneToOne;
  referencedRelation: Target;
  referencedColumns: [TargetColumn];
};

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.18';
  };
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string;
          created_at: string;
          description_es: string;
          icon: string;
          id: string;
          is_active: boolean;
          metric: string;
          position: number;
          threshold: number;
          title_es: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          description_es: string;
          icon: string;
          id: string;
          is_active?: boolean;
          metric: string;
          position: number;
          threshold: number;
          title_es: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          description_es?: string;
          icon?: string;
          id?: string;
          is_active?: boolean;
          metric?: string;
          position?: number;
          threshold?: number;
          title_es?: string;
        };
        Relationships: [];
      };
      battle_players: {
        Row: {
          battle_id: string;
          correct_answers: number;
          forfeited: boolean;
          rating_after: number | null;
          rating_before: number | null;
          result: string | null;
          score: number;
          slot: number;
          total_answers: number;
          user_id: string | null;
        };
        Insert: {
          battle_id: string;
          correct_answers?: number;
          forfeited?: boolean;
          rating_after?: number | null;
          rating_before?: number | null;
          result?: string | null;
          score?: number;
          slot: number;
          total_answers?: number;
          user_id?: string | null;
        };
        Update: {
          battle_id?: string;
          correct_answers?: number;
          forfeited?: boolean;
          rating_after?: number | null;
          rating_before?: number | null;
          result?: string | null;
          score?: number;
          slot?: number;
          total_answers?: number;
          user_id?: string | null;
        };
        Relationships: [
          FK<'battle_players_battle_id_fkey', 'battle_id', 'battles', 'id'>,
          FK<'battle_players_user_id_fkey', 'user_id', 'profiles', 'id'>,
        ];
      };
      battles: {
        Row: {
          created_at: string;
          ended_at: string | null;
          id: string;
          is_ranked: boolean;
          language_code: string;
          mode: string;
          protocol_version: number;
          season_id: number | null;
          started_at: string | null;
          status: string;
        };
        Insert: {
          created_at?: string;
          ended_at?: string | null;
          id?: string;
          is_ranked?: boolean;
          language_code: string;
          mode?: string;
          protocol_version?: number;
          season_id?: number | null;
          started_at?: string | null;
          status?: string;
        };
        Update: {
          created_at?: string;
          ended_at?: string | null;
          id?: string;
          is_ranked?: boolean;
          language_code?: string;
          mode?: string;
          protocol_version?: number;
          season_id?: number | null;
          started_at?: string | null;
          status?: string;
        };
        Relationships: [
          FK<'battles_language_code_fkey', 'language_code', 'languages', 'code'>,
          FK<'battles_season_id_fkey', 'season_id', 'seasons', 'id'>,
        ];
      };
      curriculum_units: {
        Row: {
          created_at: string;
          description_es: string;
          emoji: string;
          id: string;
          is_published: boolean;
          language_code: string;
          level: string;
          position: number;
          title_en: string;
          title_es: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description_es: string;
          emoji: string;
          id: string;
          is_published?: boolean;
          language_code: string;
          level: string;
          position: number;
          title_en: string;
          title_es: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description_es?: string;
          emoji?: string;
          id?: string;
          is_published?: boolean;
          language_code?: string;
          level?: string;
          position?: number;
          title_en?: string;
          title_es?: string;
          updated_at?: string;
        };
        Relationships: [
          FK<'curriculum_units_language_code_fkey', 'language_code', 'languages', 'code'>,
        ];
      };
      exercise_attempts: {
        Row: {
          answer: string;
          created_at: string;
          exercise_id: string | null;
          id: number;
          is_correct: boolean;
          is_first_try: boolean;
          response_ms: number;
          session_id: string;
          skill: string;
          user_id: string;
          word_id: string | null;
        };
        Insert: {
          answer: string;
          created_at?: string;
          exercise_id?: string | null;
          id?: never;
          is_correct: boolean;
          is_first_try: boolean;
          response_ms: number;
          session_id: string;
          skill: string;
          user_id: string;
          word_id?: string | null;
        };
        Update: {
          answer?: string;
          created_at?: string;
          exercise_id?: string | null;
          id?: never;
          is_correct?: boolean;
          is_first_try?: boolean;
          response_ms?: number;
          session_id?: string;
          skill?: string;
          user_id?: string;
          word_id?: string | null;
        };
        Relationships: [
          FK<'exercise_attempts_exercise_id_fkey', 'exercise_id', 'exercises', 'id'>,
          FK<'exercise_attempts_session_id_fkey', 'session_id', 'learning_sessions', 'id'>,
          FK<'exercise_attempts_user_id_fkey', 'user_id', 'profiles', 'id'>,
          FK<'exercise_attempts_word_id_fkey', 'word_id', 'words', 'id'>,
        ];
      };
      exercise_words: {
        Row: { exercise_id: string; word_id: string };
        Insert: { exercise_id: string; word_id: string };
        Update: { exercise_id?: string; word_id?: string };
        Relationships: [
          FK<'exercise_words_exercise_id_fkey', 'exercise_id', 'exercises', 'id'>,
          FK<'exercise_words_word_id_fkey', 'word_id', 'words', 'id'>,
        ];
      };
      exercises: {
        Row: {
          accepted_answers: string[];
          answer: string;
          created_at: string;
          difficulty: number;
          explanation_es: string | null;
          id: string;
          is_published: boolean;
          lesson_id: string;
          payload: Json;
          position: number;
          prompt_es: string;
          recommended_seconds: number;
          skill: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          accepted_answers?: string[];
          answer?: string;
          created_at?: string;
          difficulty?: number;
          explanation_es?: string | null;
          id: string;
          is_published?: boolean;
          lesson_id: string;
          payload: Json;
          position: number;
          prompt_es: string;
          recommended_seconds?: number;
          skill: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          accepted_answers?: string[];
          answer?: string;
          created_at?: string;
          difficulty?: number;
          explanation_es?: string | null;
          id?: string;
          is_published?: boolean;
          lesson_id?: string;
          payload?: Json;
          position?: number;
          prompt_es?: string;
          recommended_seconds?: number;
          skill?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [FK<'exercises_lesson_id_fkey', 'lesson_id', 'lessons', 'id'>];
      };
      languages: {
        Row: { code: string; created_at: string; is_target_available: boolean; name_es: string };
        Insert: {
          code: string;
          created_at?: string;
          is_target_available?: boolean;
          name_es: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          is_target_available?: boolean;
          name_es?: string;
        };
        Relationships: [];
      };
      learning_sessions: {
        Row: {
          completed_at: string;
          duration_seconds: number;
          first_try_correct: number;
          first_try_total: number;
          id: string;
          kind: string;
          lesson_id: string | null;
          local_date: string;
          started_at: string;
          total_answers: number;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          duration_seconds: number;
          first_try_correct: number;
          first_try_total: number;
          id: string;
          kind: string;
          lesson_id?: string | null;
          local_date: string;
          started_at: string;
          total_answers: number;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          duration_seconds?: number;
          first_try_correct?: number;
          first_try_total?: number;
          id?: string;
          kind?: string;
          lesson_id?: string | null;
          local_date?: string;
          started_at?: string;
          total_answers?: number;
          user_id?: string;
        };
        Relationships: [
          FK<'learning_sessions_lesson_id_fkey', 'lesson_id', 'lessons', 'id'>,
          FK<'learning_sessions_user_id_fkey', 'user_id', 'profiles', 'id'>,
        ];
      };
      lessons: {
        Row: {
          created_at: string;
          id: string;
          is_published: boolean;
          objective_es: string;
          position: number;
          title_es: string;
          unit_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          is_published?: boolean;
          objective_es: string;
          position: number;
          title_es: string;
          unit_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_published?: boolean;
          objective_es?: string;
          position?: number;
          title_es?: string;
          unit_id?: string;
          updated_at?: string;
        };
        Relationships: [FK<'lessons_unit_id_fkey', 'unit_id', 'curriculum_units', 'id'>];
      };
      player_ratings: {
        Row: {
          best_win_streak: number;
          draws: number;
          games_played: number;
          language_code: string;
          losses: number;
          peak_rating: number;
          rating: number;
          updated_at: string;
          user_id: string;
          win_streak: number;
          wins: number;
        };
        Insert: {
          best_win_streak?: number;
          draws?: number;
          games_played?: number;
          language_code: string;
          losses?: number;
          peak_rating?: number;
          rating?: number;
          updated_at?: string;
          user_id: string;
          win_streak?: number;
          wins?: number;
        };
        Update: {
          best_win_streak?: number;
          draws?: number;
          games_played?: number;
          language_code?: string;
          losses?: number;
          peak_rating?: number;
          rating?: number;
          updated_at?: string;
          user_id?: string;
          win_streak?: number;
          wins?: number;
        };
        Relationships: [
          FK<'player_ratings_language_code_fkey', 'language_code', 'languages', 'code'>,
          FK<'player_ratings_user_id_fkey', 'user_id', 'profiles', 'id'>,
        ];
      };
      profiles: {
        Row: {
          avatar_id: string;
          created_at: string;
          daily_goal_minutes: number;
          display_name: string | null;
          id: string;
          onboarding_completed_at: string | null;
          public_code: string;
          region: string | null;
          start_level: string;
          target_language: string;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_id?: string;
          created_at?: string;
          daily_goal_minutes?: number;
          display_name?: string | null;
          id: string;
          onboarding_completed_at?: string | null;
          public_code: string;
          region?: string | null;
          start_level?: string;
          target_language?: string;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_id?: string;
          created_at?: string;
          daily_goal_minutes?: number;
          display_name?: string | null;
          id?: string;
          onboarding_completed_at?: string | null;
          public_code?: string;
          region?: string | null;
          start_level?: string;
          target_language?: string;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [
          FK<'profiles_target_language_fkey', 'target_language', 'languages', 'code'>,
        ];
      };
      rating_history: {
        Row: {
          battle_id: string | null;
          created_at: string;
          delta: number | null;
          id: number;
          language_code: string;
          rating_after: number;
          rating_before: number;
          reason: string;
          season_id: number | null;
          user_id: string;
        };
        Insert: {
          battle_id?: string | null;
          created_at?: string;
          delta?: number | null;
          id?: never;
          language_code: string;
          rating_after: number;
          rating_before: number;
          reason: string;
          season_id?: number | null;
          user_id: string;
        };
        Update: {
          battle_id?: string | null;
          created_at?: string;
          delta?: number | null;
          id?: never;
          language_code?: string;
          rating_after?: number;
          rating_before?: number;
          reason?: string;
          season_id?: number | null;
          user_id?: string;
        };
        Relationships: [
          FK<'rating_history_battle_id_fkey', 'battle_id', 'battles', 'id'>,
          FK<'rating_history_language_code_fkey', 'language_code', 'languages', 'code'>,
          FK<'rating_history_season_id_fkey', 'season_id', 'seasons', 'id'>,
          FK<'rating_history_user_id_fkey', 'user_id', 'profiles', 'id'>,
        ];
      };
      seasons: {
        Row: {
          created_at: string;
          ends_at: string;
          id: number;
          name: string;
          starts_at: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          ends_at: string;
          id?: number;
          name: string;
          starts_at: string;
          status?: string;
        };
        Update: {
          created_at?: string;
          ends_at?: string;
          id?: number;
          name?: string;
          starts_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          achievement_id: string;
          unlocked_at: string;
          user_id: string;
        };
        Insert: {
          achievement_id: string;
          unlocked_at?: string;
          user_id: string;
        };
        Update: {
          achievement_id?: string;
          unlocked_at?: string;
          user_id?: string;
        };
        Relationships: [
          FK<'user_achievements_achievement_id_fkey', 'achievement_id', 'achievements', 'id'>,
          FK<'user_achievements_user_id_fkey', 'user_id', 'profiles', 'id'>,
        ];
      };
      user_daily_activity: {
        Row: {
          activity_date: string;
          answers: number;
          correct_answers: number;
          seconds_spent: number;
          sessions_completed: number;
          user_id: string;
        };
        Insert: {
          activity_date: string;
          answers?: number;
          correct_answers?: number;
          seconds_spent?: number;
          sessions_completed?: number;
          user_id: string;
        };
        Update: {
          activity_date?: string;
          answers?: number;
          correct_answers?: number;
          seconds_spent?: number;
          sessions_completed?: number;
          user_id?: string;
        };
        Relationships: [FK<'user_daily_activity_user_id_fkey', 'user_id', 'profiles', 'id'>];
      };
      user_lesson_progress: {
        Row: {
          best_accuracy: number;
          first_completed_at: string | null;
          last_accuracy: number;
          last_completed_at: string | null;
          lesson_id: string;
          times_completed: number;
          user_id: string;
        };
        Insert: {
          best_accuracy?: number;
          first_completed_at?: string | null;
          last_accuracy?: number;
          last_completed_at?: string | null;
          lesson_id: string;
          times_completed?: number;
          user_id: string;
        };
        Update: {
          best_accuracy?: number;
          first_completed_at?: string | null;
          last_accuracy?: number;
          last_completed_at?: string | null;
          lesson_id?: string;
          times_completed?: number;
          user_id?: string;
        };
        Relationships: [
          FK<'user_lesson_progress_lesson_id_fkey', 'lesson_id', 'lessons', 'id'>,
          FK<'user_lesson_progress_user_id_fkey', 'user_id', 'profiles', 'id'>,
        ];
      };
      user_settings: {
        Row: {
          created_at: string;
          profile_visibility: string;
          show_region: boolean;
          updated_at: string;
          user_id: string;
          widget_content_type: string;
        };
        Insert: {
          created_at?: string;
          profile_visibility?: string;
          show_region?: boolean;
          updated_at?: string;
          user_id: string;
          widget_content_type?: string;
        };
        Update: {
          created_at?: string;
          profile_visibility?: string;
          show_region?: boolean;
          updated_at?: string;
          user_id?: string;
          widget_content_type?: string;
        };
        Relationships: [FK<'user_settings_user_id_fkey', 'user_id', 'profiles', 'id', true>];
      };
      user_word_progress: {
        Row: {
          correct_count: number;
          created_at: string;
          incorrect_count: number;
          last_result: boolean | null;
          last_reviewed_at: string | null;
          mastered_at: string | null;
          next_review_at: string | null;
          seen_count: number;
          stage: number;
          updated_at: string;
          user_id: string;
          word_id: string;
        };
        Insert: {
          correct_count?: number;
          created_at?: string;
          incorrect_count?: number;
          last_result?: boolean | null;
          last_reviewed_at?: string | null;
          mastered_at?: string | null;
          next_review_at?: string | null;
          seen_count?: number;
          stage?: number;
          updated_at?: string;
          user_id: string;
          word_id: string;
        };
        Update: {
          correct_count?: number;
          created_at?: string;
          incorrect_count?: number;
          last_result?: boolean | null;
          last_reviewed_at?: string | null;
          mastered_at?: string | null;
          next_review_at?: string | null;
          seen_count?: number;
          stage?: number;
          updated_at?: string;
          user_id?: string;
          word_id?: string;
        };
        Relationships: [
          FK<'user_word_progress_user_id_fkey', 'user_id', 'profiles', 'id'>,
          FK<'user_word_progress_word_id_fkey', 'word_id', 'words', 'id'>,
        ];
      };
      words: {
        Row: WordRowType;
        Insert: {
          accepted_translations?: string[];
          created_at?: string;
          difficulty?: number;
          emoji?: string | null;
          example_en?: string | null;
          example_es?: string | null;
          id: string;
          ipa?: string | null;
          is_published?: boolean;
          language_code: string;
          review_status?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          tags?: string[];
          text: string;
          translation_es: string;
          unit_id: string;
          updated_at?: string;
        };
        Update: Partial<WordRowType>;
        Relationships: [
          FK<'words_language_code_fkey', 'language_code', 'languages', 'code'>,
          FK<'words_unit_id_fkey', 'unit_id', 'curriculum_units', 'id'>,
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      achievement_metrics: { Args: { p_user_id: string }; Returns: Json };
      apply_word_result: {
        Args: { p_at: string; p_correct: boolean; p_user_id: string; p_word_id: string };
        Returns: undefined;
      };
      complete_onboarding: {
        Args: {
          p_avatar_id: string;
          p_daily_goal_minutes: number;
          p_start_level: string;
          p_target_language: string;
          p_username: string;
        };
        Returns: {
          avatar_id: string;
          created_at: string;
          daily_goal_minutes: number;
          display_name: string | null;
          id: string;
          onboarding_completed_at: string | null;
          public_code: string;
          region: string | null;
          start_level: string;
          target_language: string;
          updated_at: string;
          username: string | null;
        };
        SetofOptions: { from: '*'; to: 'profiles'; isOneToOne: true; isSetofReturn: false };
      };
      evaluate_achievements: { Args: { p_user_id: string }; Returns: string[] };
      generate_public_code: { Args: never; Returns: string };
      get_learning_summary: { Args: { p_time_zone: string }; Returns: Json };
      get_match_history: {
        Args: { p_before: string; p_limit: number };
        Returns: {
          battle_id: string;
          correct_answers: number;
          ended_at: string;
          forfeited: boolean;
          is_ranked: boolean;
          mode: string;
          opponent_avatar_id: string;
          opponent_id: string;
          opponent_score: number;
          opponent_username: string;
          rating_after: number;
          rating_before: number;
          result: string;
          score: number;
          status: string;
          total_answers: number;
        }[];
      };
      get_my_achievements: {
        Args: never;
        Returns: {
          category: string;
          description_es: string;
          icon: string;
          id: string;
          progress: number;
          threshold: number;
          title_es: string;
          unlocked_at: string;
        }[];
      };
      get_public_profile: { Args: { p_user_id: string }; Returns: Json };
      is_lesson_unlocked: { Args: { p_lesson_id: string; p_user_id: string }; Returns: boolean };
      is_username_available: { Args: { p_username: string }; Returns: boolean };
      parse_learning_attempts: {
        Args: { p_attempts: Json };
        Returns: {
          answer: string;
          exercise_id: string;
          is_correct: boolean;
          is_first_try: boolean;
          ord: number;
          response_ms: number;
          word_id: string;
        }[];
      };
      safe_time_zone: { Args: { p_time_zone: string }; Returns: string };
      srs_config: { Args: never; Returns: Json };
      submit_learning_session: {
        Args: {
          p_attempts: Json;
          p_kind: string;
          p_lesson_id: string;
          p_session_id: string;
          p_started_at: string;
          p_time_zone: string;
        };
        Returns: Json;
      };
      word_of_the_day: {
        Args: { p_date: string; p_language?: string };
        Returns: WordRowType[];
        SetofOptions: { from: '*'; to: 'words'; isOneToOne: false; isSetofReturn: true };
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type WordRowType = {
  accepted_translations: string[];
  created_at: string;
  difficulty: number;
  emoji: string | null;
  example_en: string | null;
  example_es: string | null;
  id: string;
  ipa: string | null;
  is_published: boolean;
  language_code: string;
  review_status: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  tags: string[];
  text: string;
  translation_es: string;
  unit_id: string;
  updated_at: string;
};

type PublicTables = Database['public']['Tables'];

export type Tables<T extends keyof PublicTables> = PublicTables[T]['Row'];
export type TablesInsert<T extends keyof PublicTables> = PublicTables[T]['Insert'];
export type TablesUpdate<T extends keyof PublicTables> = PublicTables[T]['Update'];
