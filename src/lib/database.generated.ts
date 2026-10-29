// Generado desde el proyecto Supabase (MCP generate_typescript_types). No editar a mano.
// Regenerar tras cada migración: npx supabase gen types typescript --project-id wtymosvsymzoosxscnxi

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

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
