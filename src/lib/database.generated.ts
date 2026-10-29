// Generado desde el proyecto Supabase (MCP generate_typescript_types). No editar a mano.
// Regenerar tras cada migración: npx supabase gen types typescript --project-id wtymosvsymzoosxscnxi

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ---- PROVISIONAL: ayudas para las tablas de 0003 escritas a mano (desaparecen al regenerar). ----
type ProvisionalTable<Row, Relationships> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: Relationships;
};
type Rel<
  Name extends string,
  Column extends string,
  Target extends string,
  TargetColumn extends string,
> = {
  foreignKeyName: Name;
  columns: [Column];
  isOneToOne: false;
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
      languages: {
        Row: {
          code: string;
          created_at: string;
          is_target_available: boolean;
          name_es: string;
        };
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
          {
            foreignKeyName: 'player_ratings_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'player_ratings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
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
          {
            foreignKeyName: 'profiles_target_language_fkey';
            columns: ['target_language'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
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
          {
            foreignKeyName: 'rating_history_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'rating_history_season_id_fkey';
            columns: ['season_id'];
            isOneToOne: false;
            referencedRelation: 'seasons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'rating_history_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
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
        Relationships: [
          {
            foreignKeyName: 'user_settings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      // ---- PROVISIONAL: tablas de la migración 0003 escritas a mano. Reemplazar al regenerar. ----
      curriculum_units: ProvisionalTable<
        {
          id: string;
          language_code: string;
          level: string;
          position: number;
          title_es: string;
          title_en: string;
          description_es: string;
          emoji: string;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        },
        []
      >;
      lessons: ProvisionalTable<
        {
          id: string;
          unit_id: string;
          position: number;
          title_es: string;
          objective_es: string;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        },
        [Rel<'lessons_unit_id_fkey', 'unit_id', 'curriculum_units', 'id'>]
      >;
      words: ProvisionalTable<
        {
          id: string;
          language_code: string;
          unit_id: string;
          text: string;
          translation_es: string;
          accepted_translations: string[];
          ipa: string | null;
          emoji: string | null;
          example_en: string | null;
          example_es: string | null;
          difficulty: number;
          tags: string[];
          is_published: boolean;
          review_status: string;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        },
        [Rel<'words_unit_id_fkey', 'unit_id', 'curriculum_units', 'id'>]
      >;
      exercises: ProvisionalTable<
        {
          id: string;
          lesson_id: string;
          position: number;
          type: string;
          skill: string;
          prompt_es: string;
          payload: Json;
          answer: string;
          accepted_answers: string[];
          explanation_es: string | null;
          difficulty: number;
          recommended_seconds: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        },
        [Rel<'exercises_lesson_id_fkey', 'lesson_id', 'lessons', 'id'>]
      >;
      exercise_words: ProvisionalTable<
        { exercise_id: string; word_id: string },
        [
          Rel<'exercise_words_exercise_id_fkey', 'exercise_id', 'exercises', 'id'>,
          Rel<'exercise_words_word_id_fkey', 'word_id', 'words', 'id'>,
        ]
      >;
      learning_sessions: ProvisionalTable<
        {
          id: string;
          user_id: string;
          kind: string;
          lesson_id: string | null;
          started_at: string;
          completed_at: string;
          duration_seconds: number;
          total_answers: number;
          first_try_total: number;
          first_try_correct: number;
          local_date: string;
        },
        []
      >;
      user_lesson_progress: ProvisionalTable<
        {
          user_id: string;
          lesson_id: string;
          times_completed: number;
          best_accuracy: number;
          last_accuracy: number;
          first_completed_at: string | null;
          last_completed_at: string | null;
        },
        [Rel<'user_lesson_progress_lesson_id_fkey', 'lesson_id', 'lessons', 'id'>]
      >;
      user_word_progress: ProvisionalTable<
        {
          user_id: string;
          word_id: string;
          stage: number;
          seen_count: number;
          correct_count: number;
          incorrect_count: number;
          last_result: boolean | null;
          last_reviewed_at: string | null;
          next_review_at: string | null;
          mastered_at: string | null;
          created_at: string;
          updated_at: string;
        },
        [Rel<'user_word_progress_word_id_fkey', 'word_id', 'words', 'id'>]
      >;
      user_daily_activity: ProvisionalTable<
        {
          user_id: string;
          activity_date: string;
          sessions_completed: number;
          answers: number;
          correct_answers: number;
          seconds_spent: number;
        },
        []
      >;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
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
        SetofOptions: {
          from: '*';
          to: 'profiles';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      generate_public_code: { Args: never; Returns: string };
      // ---- PROVISIONAL (migración 0003) ----
      submit_learning_session: {
        Args: {
          p_session_id: string;
          p_kind: string;
          p_lesson_id?: string;
          p_started_at: string;
          p_attempts: Json;
          p_time_zone: string;
        };
        Returns: Json;
      };
      get_learning_summary: { Args: { p_time_zone: string }; Returns: Json };
      word_of_the_day: {
        Args: { p_date: string; p_language?: string };
        Returns: Database['public']['Tables']['words']['Row'][];
        SetofOptions: { from: '*'; to: 'words'; isOneToOne: false; isSetofReturn: true };
      };
      is_username_available: { Args: { p_username: string }; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicTables = Database['public']['Tables'];

export type Tables<T extends keyof PublicTables> = PublicTables[T]['Row'];
export type TablesInsert<T extends keyof PublicTables> = PublicTables[T]['Insert'];
export type TablesUpdate<T extends keyof PublicTables> = PublicTables[T]['Update'];
