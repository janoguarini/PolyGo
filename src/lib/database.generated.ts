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
      avatar_reports: {
        Row: {
          avatar_path: string;
          created_at: string;
          id: number;
          reason: string;
          reported_id: string;
          reporter_id: string;
          reviewed_at: string | null;
        };
        Insert: {
          avatar_path: string;
          created_at?: string;
          id?: never;
          reason: string;
          reported_id: string;
          reporter_id: string;
          reviewed_at?: string | null;
        };
        Update: {
          avatar_path?: string;
          created_at?: string;
          id?: never;
          reason?: string;
          reported_id?: string;
          reporter_id?: string;
          reviewed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'avatar_reports_reported_id_fkey';
            columns: ['reported_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'avatar_reports_reporter_id_fkey';
            columns: ['reporter_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      battle_players: {
        Row: {
          battle_id: string;
          bot_avatar_id: string | null;
          bot_name: string | null;
          correct_answers: number;
          forfeited: boolean;
          rating_after: number | null;
          rating_before: number | null;
          result: string | null;
          score: number;
          slot: number;
          submitted_at: string | null;
          total_answers: number;
          user_id: string | null;
        };
        Insert: {
          battle_id: string;
          bot_avatar_id?: string | null;
          bot_name?: string | null;
          correct_answers?: number;
          forfeited?: boolean;
          rating_after?: number | null;
          rating_before?: number | null;
          result?: string | null;
          score?: number;
          slot: number;
          submitted_at?: string | null;
          total_answers?: number;
          user_id?: string | null;
        };
        Update: {
          battle_id?: string;
          bot_avatar_id?: string | null;
          bot_name?: string | null;
          correct_answers?: number;
          forfeited?: boolean;
          rating_after?: number | null;
          rating_before?: number | null;
          result?: string | null;
          score?: number;
          slot?: number;
          submitted_at?: string | null;
          total_answers?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'battle_players_battle_id_fkey';
            columns: ['battle_id'];
            isOneToOne: false;
            referencedRelation: 'battles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'battle_players_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      battles: {
        Row: {
          bot_script: Json | null;
          created_at: string;
          ended_at: string | null;
          has_bot: boolean;
          id: string;
          is_ranked: boolean;
          language_code: string;
          mode: string;
          protocol_version: number;
          questions: Json | null;
          season_id: number | null;
          started_at: string | null;
          status: string;
        };
        Insert: {
          bot_script?: Json | null;
          created_at?: string;
          ended_at?: string | null;
          has_bot?: boolean;
          id?: string;
          is_ranked?: boolean;
          language_code: string;
          mode?: string;
          protocol_version?: number;
          questions?: Json | null;
          season_id?: number | null;
          started_at?: string | null;
          status?: string;
        };
        Update: {
          bot_script?: Json | null;
          created_at?: string;
          ended_at?: string | null;
          has_bot?: boolean;
          id?: string;
          is_ranked?: boolean;
          language_code?: string;
          mode?: string;
          protocol_version?: number;
          questions?: Json | null;
          season_id?: number | null;
          started_at?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'battles_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'battles_season_id_fkey';
            columns: ['season_id'];
            isOneToOne: false;
            referencedRelation: 'seasons';
            referencedColumns: ['id'];
          },
        ];
      };
      concepts: {
        Row: {
          description_es: string | null;
          group_key: string | null;
          id: string;
          kind: string;
          language_code: string;
          level: string;
          parent_id: string | null;
          status: string;
          title_es: string | null;
          word_id: string | null;
        };
        Insert: {
          description_es?: string | null;
          group_key?: string | null;
          id: string;
          kind: string;
          language_code: string;
          level: string;
          parent_id?: string | null;
          status: string;
          title_es?: string | null;
          word_id?: string | null;
        };
        Update: {
          description_es?: string | null;
          group_key?: string | null;
          id?: string;
          kind?: string;
          language_code?: string;
          level?: string;
          parent_id?: string | null;
          status?: string;
          title_es?: string | null;
          word_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'concepts_kind_fkey';
            columns: ['kind'];
            isOneToOne: false;
            referencedRelation: 'ref_concept_kinds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'concepts_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'concepts_level_fkey';
            columns: ['level'];
            isOneToOne: false;
            referencedRelation: 'ref_levels';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'concepts_parent_fkey';
            columns: ['parent_id', 'language_code'];
            isOneToOne: false;
            referencedRelation: 'concepts';
            referencedColumns: ['id', 'language_code'];
          },
          {
            foreignKeyName: 'concepts_word_fkey';
            columns: ['word_id', 'language_code'];
            isOneToOne: false;
            referencedRelation: 'words';
            referencedColumns: ['id', 'language_code'];
          },
        ];
      };
      content_personas: {
        Row: {
          age: number;
          city: string;
          country: string;
          display_name: string;
          email: string;
          fictional: boolean;
          id: string;
          language_code: string;
          phone: string;
        };
        Insert: {
          age: number;
          city: string;
          country: string;
          display_name: string;
          email: string;
          fictional?: boolean;
          id: string;
          language_code: string;
          phone: string;
        };
        Update: {
          age?: number;
          city?: string;
          country?: string;
          display_name?: string;
          email?: string;
          fictional?: boolean;
          id?: string;
          language_code?: string;
          phone?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'content_personas_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
        ];
      };
      content_testers: {
        Row: {
          created_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'content_testers_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      cosmetic_items: {
        Row: {
          id: string;
          kind: string;
          position: number;
          price: number | null;
          rarity: string;
          source: string;
        };
        Insert: {
          id: string;
          kind: string;
          position: number;
          price?: number | null;
          rarity: string;
          source: string;
        };
        Update: {
          id?: string;
          kind?: string;
          position?: number;
          price?: number | null;
          rarity?: string;
          source?: string;
        };
        Relationships: [];
      };
      curriculum_units: {
        Row: {
          created_at: string;
          description_es: string;
          emoji: string;
          grammar: Json | null;
          id: string;
          is_published: boolean;
          language_code: string;
          level: string;
          objective_es: string | null;
          position: number;
          review_status: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          title_en: string;
          title_es: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description_es: string;
          emoji: string;
          grammar?: Json | null;
          id: string;
          is_published?: boolean;
          language_code: string;
          level: string;
          objective_es?: string | null;
          position: number;
          review_status?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          title_en: string;
          title_es: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description_es?: string;
          emoji?: string;
          grammar?: Json | null;
          id?: string;
          is_published?: boolean;
          language_code?: string;
          level?: string;
          objective_es?: string | null;
          position?: number;
          review_status?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          title_en?: string;
          title_es?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'curriculum_units_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
        ];
      };
      exercise_attempt_gradings: {
        Row: {
          assists: Json;
          attempt_id: number;
          attempt_no: number;
          client_verdict: string | null;
          graded_at: string;
          grader: string;
          grader_version: string;
          grading_mode_id: string;
          input_modality: string;
          item_id: string;
          item_version_id: number;
          presentation_id: number;
          response: Json;
          response_kind: string;
          selected_option: number | null;
          session_id: string;
          status: string;
          user_id: string;
          verdict: string | null;
        };
        Insert: {
          assists?: Json;
          attempt_id: number;
          attempt_no: number;
          client_verdict?: string | null;
          graded_at?: string;
          grader: string;
          grader_version: string;
          grading_mode_id: string;
          input_modality: string;
          item_id: string;
          item_version_id: number;
          presentation_id: number;
          response: Json;
          response_kind: string;
          selected_option?: number | null;
          session_id: string;
          status: string;
          user_id: string;
          verdict?: string | null;
        };
        Update: {
          assists?: Json;
          attempt_id?: number;
          attempt_no?: number;
          client_verdict?: string | null;
          graded_at?: string;
          grader?: string;
          grader_version?: string;
          grading_mode_id?: string;
          input_modality?: string;
          item_id?: string;
          item_version_id?: number;
          presentation_id?: number;
          response?: Json;
          response_kind?: string;
          selected_option?: number | null;
          session_id?: string;
          status?: string;
          user_id?: string;
          verdict?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'exercise_attempt_gradings_attempt_id_fkey';
            columns: ['attempt_id'];
            isOneToOne: true;
            referencedRelation: 'exercise_attempt_reconstruction';
            referencedColumns: ['attempt_id'];
          },
          {
            foreignKeyName: 'exercise_attempt_gradings_attempt_id_fkey';
            columns: ['attempt_id'];
            isOneToOne: true;
            referencedRelation: 'exercise_attempts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attempt_gradings_grading_mode_id_fkey';
            columns: ['grading_mode_id'];
            isOneToOne: false;
            referencedRelation: 'ref_grading_modes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attempt_gradings_input_modality_fkey';
            columns: ['input_modality'];
            isOneToOne: false;
            referencedRelation: 'ref_input_modalities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attempt_gradings_presentation_id_fkey';
            columns: ['presentation_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_presentations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attempt_gradings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attempt_gradings_version_fkey';
            columns: ['item_version_id', 'item_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_item_versions';
            referencedColumns: ['id', 'item_id'];
          },
        ];
      };
      exercise_attempt_presentations: {
        Row: {
          attempt_id: number;
          created_at: string;
          presentation_id: number;
        };
        Insert: {
          attempt_id: number;
          created_at?: string;
          presentation_id: number;
        };
        Update: {
          attempt_id?: number;
          created_at?: string;
          presentation_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'exercise_attempt_presentations_attempt_id_fkey';
            columns: ['attempt_id'];
            isOneToOne: true;
            referencedRelation: 'exercise_attempt_reconstruction';
            referencedColumns: ['attempt_id'];
          },
          {
            foreignKeyName: 'exercise_attempt_presentations_attempt_id_fkey';
            columns: ['attempt_id'];
            isOneToOne: true;
            referencedRelation: 'exercise_attempts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attempt_presentations_presentation_id_fkey';
            columns: ['presentation_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_presentations';
            referencedColumns: ['id'];
          },
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
          {
            foreignKeyName: 'exercise_attempts_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attempts_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'learning_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attempts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attempts_word_id_fkey';
            columns: ['word_id'];
            isOneToOne: false;
            referencedRelation: 'words';
            referencedColumns: ['id'];
          },
        ];
      };
      exercise_item_versions: {
        Row: {
          accepted_answers: string[];
          answer: string;
          content_hash: string;
          created_at: string;
          difficulty: number;
          explanation_es: string | null;
          generator: string | null;
          generator_version: string | null;
          grading_mode_id: string | null;
          grading_spec: Json;
          id: number;
          item_id: string;
          payload: Json;
          prompt_es: string;
          recommended_seconds: number;
          version: number;
        };
        Insert: {
          accepted_answers: string[];
          answer: string;
          content_hash: string;
          created_at?: string;
          difficulty: number;
          explanation_es?: string | null;
          generator?: string | null;
          generator_version?: string | null;
          grading_mode_id?: string | null;
          grading_spec: Json;
          id?: never;
          item_id: string;
          payload: Json;
          prompt_es: string;
          recommended_seconds: number;
          version: number;
        };
        Update: {
          accepted_answers?: string[];
          answer?: string;
          content_hash?: string;
          created_at?: string;
          difficulty?: number;
          explanation_es?: string | null;
          generator?: string | null;
          generator_version?: string | null;
          grading_mode_id?: string | null;
          grading_spec?: Json;
          id?: never;
          item_id?: string;
          payload?: Json;
          prompt_es?: string;
          recommended_seconds?: number;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'exercise_item_versions_grading_mode_fkey';
            columns: ['grading_mode_id'];
            isOneToOne: false;
            referencedRelation: 'ref_grading_modes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_item_versions_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_items';
            referencedColumns: ['id'];
          },
        ];
      };
      exercise_items: {
        Row: {
          assessment_mode: string;
          cefr_activity: string | null;
          created_at: string;
          current_version_id: number | null;
          id: string;
          input_modality: string;
          language_code: string;
          level: string;
          origin: string;
          response_format: string;
          response_privacy: string;
          retired_at: string | null;
          status: string;
          type: string;
        };
        Insert: {
          assessment_mode: string;
          cefr_activity?: string | null;
          created_at?: string;
          current_version_id?: number | null;
          id: string;
          input_modality: string;
          language_code: string;
          level: string;
          origin: string;
          response_format: string;
          response_privacy: string;
          retired_at?: string | null;
          status: string;
          type: string;
        };
        Update: {
          assessment_mode?: string;
          cefr_activity?: string | null;
          created_at?: string;
          current_version_id?: number | null;
          id?: string;
          input_modality?: string;
          language_code?: string;
          level?: string;
          origin?: string;
          response_format?: string;
          response_privacy?: string;
          retired_at?: string | null;
          status?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'exercise_items_cefr_activity_fkey';
            columns: ['cefr_activity'];
            isOneToOne: false;
            referencedRelation: 'ref_cefr_activities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_items_current_version_fkey';
            columns: ['current_version_id', 'id'];
            isOneToOne: false;
            referencedRelation: 'exercise_item_versions';
            referencedColumns: ['id', 'item_id'];
          },
          {
            foreignKeyName: 'exercise_items_input_modality_fkey';
            columns: ['input_modality'];
            isOneToOne: false;
            referencedRelation: 'ref_input_modalities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_items_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'exercise_items_level_fkey';
            columns: ['level'];
            isOneToOne: false;
            referencedRelation: 'ref_levels';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_items_mode_format_fkey';
            columns: ['assessment_mode', 'response_format'];
            isOneToOne: false;
            referencedRelation: 'ref_mode_formats';
            referencedColumns: ['assessment_mode', 'response_format'];
          },
          {
            foreignKeyName: 'exercise_items_response_privacy_fkey';
            columns: ['response_privacy'];
            isOneToOne: false;
            referencedRelation: 'ref_response_privacy';
            referencedColumns: ['id'];
          },
        ];
      };
      exercise_option_set_assignments: {
        Row: {
          assigned_at: string;
          exercise_id: string;
          id: number;
          item_id: string;
          item_version_id: number;
          option_set_id: number;
        };
        Insert: {
          assigned_at?: string;
          exercise_id: string;
          id?: never;
          item_id: string;
          item_version_id: number;
          option_set_id: number;
        };
        Update: {
          assigned_at?: string;
          exercise_id?: string;
          id?: never;
          item_id?: string;
          item_version_id?: number;
          option_set_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'exercise_option_set_assignments_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_option_set_assignments_set_fkey';
            columns: ['option_set_id', 'item_version_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_option_sets';
            referencedColumns: ['id', 'item_version_id'];
          },
          {
            foreignKeyName: 'exercise_option_set_assignments_version_fkey';
            columns: ['item_version_id', 'item_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_item_versions';
            referencedColumns: ['id', 'item_id'];
          },
        ];
      };
      exercise_option_sets: {
        Row: {
          answer_index: number;
          created_at: string;
          format: string;
          generator: string | null;
          generator_version: string | null;
          id: number;
          item_id: string;
          item_version_id: number;
          options: Json;
          options_hash: string;
          origin: string;
        };
        Insert: {
          answer_index: number;
          created_at?: string;
          format: string;
          generator?: string | null;
          generator_version?: string | null;
          id?: never;
          item_id: string;
          item_version_id: number;
          options: Json;
          options_hash: string;
          origin: string;
        };
        Update: {
          answer_index?: number;
          created_at?: string;
          format?: string;
          generator?: string | null;
          generator_version?: string | null;
          id?: never;
          item_id?: string;
          item_version_id?: number;
          options?: Json;
          options_hash?: string;
          origin?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'exercise_option_sets_version_fkey';
            columns: ['item_version_id', 'item_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_item_versions';
            referencedColumns: ['id', 'item_id'];
          },
        ];
      };
      exercise_presentations: {
        Row: {
          exercise_id: string | null;
          id: number;
          item_id: string;
          item_version_id: number;
          option_order: number[] | null;
          option_set_id: number | null;
          position: number | null;
          presented_at: string;
          session_id: string;
          shuffle_algorithm: string | null;
          shuffle_seed: string | null;
          user_id: string;
        };
        Insert: {
          exercise_id?: string | null;
          id?: never;
          item_id: string;
          item_version_id: number;
          option_order?: number[] | null;
          option_set_id?: number | null;
          position?: number | null;
          presented_at?: string;
          session_id: string;
          shuffle_algorithm?: string | null;
          shuffle_seed?: string | null;
          user_id: string;
        };
        Update: {
          exercise_id?: string | null;
          id?: never;
          item_id?: string;
          item_version_id?: number;
          option_order?: number[] | null;
          option_set_id?: number | null;
          position?: number | null;
          presented_at?: string;
          session_id?: string;
          shuffle_algorithm?: string | null;
          shuffle_seed?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'exercise_presentations_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_presentations_set_fkey';
            columns: ['option_set_id', 'item_version_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_option_sets';
            referencedColumns: ['id', 'item_version_id'];
          },
          {
            foreignKeyName: 'exercise_presentations_shuffle_algorithm_fkey';
            columns: ['shuffle_algorithm'];
            isOneToOne: false;
            referencedRelation: 'ref_shuffle_algorithms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_presentations_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_presentations_version_fkey';
            columns: ['item_version_id', 'item_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_item_versions';
            referencedColumns: ['id', 'item_id'];
          },
        ];
      };
      exercise_words: {
        Row: {
          exercise_id: string;
          word_id: string;
        };
        Insert: {
          exercise_id: string;
          word_id: string;
        };
        Update: {
          exercise_id?: string;
          word_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'exercise_words_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_words_word_id_fkey';
            columns: ['word_id'];
            isOneToOne: false;
            referencedRelation: 'words';
            referencedColumns: ['id'];
          },
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
          item_id: string;
          item_version_id: number;
          lesson_id: string;
          option_set_id: number | null;
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
          item_id: string;
          item_version_id: number;
          lesson_id: string;
          option_set_id?: number | null;
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
          item_id?: string;
          item_version_id?: number;
          lesson_id?: string;
          option_set_id?: number | null;
          payload?: Json;
          position?: number;
          prompt_es?: string;
          recommended_seconds?: number;
          skill?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'exercises_item_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercises_item_version_fkey';
            columns: ['item_version_id', 'item_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_item_versions';
            referencedColumns: ['id', 'item_id'];
          },
          {
            foreignKeyName: 'exercises_lesson_id_fkey';
            columns: ['lesson_id'];
            isOneToOne: false;
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercises_option_set_fkey';
            columns: ['option_set_id', 'item_version_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_option_sets';
            referencedColumns: ['id', 'item_version_id'];
          },
        ];
      };
      friend_challenges: {
        Row: {
          battle_id: string | null;
          cancelled: boolean;
          code: string;
          created_at: string;
          declined: boolean;
          expires_at: string;
          guest_id: string | null;
          host_curriculum_api: number;
          host_id: string;
          invitee_id: string | null;
          language_code: string;
          notified_at: string | null;
          seen_at: string;
        };
        Insert: {
          battle_id?: string | null;
          cancelled?: boolean;
          code: string;
          created_at?: string;
          declined?: boolean;
          expires_at?: string;
          guest_id?: string | null;
          host_curriculum_api?: number;
          host_id: string;
          invitee_id?: string | null;
          language_code: string;
          notified_at?: string | null;
          seen_at?: string;
        };
        Update: {
          battle_id?: string | null;
          cancelled?: boolean;
          code?: string;
          created_at?: string;
          declined?: boolean;
          expires_at?: string;
          guest_id?: string | null;
          host_curriculum_api?: number;
          host_id?: string;
          invitee_id?: string | null;
          language_code?: string;
          notified_at?: string | null;
          seen_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'friend_challenges_battle_id_fkey';
            columns: ['battle_id'];
            isOneToOne: false;
            referencedRelation: 'battles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'friend_challenges_guest_id_fkey';
            columns: ['guest_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'friend_challenges_host_id_fkey';
            columns: ['host_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'friend_challenges_invitee_id_fkey';
            columns: ['invitee_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'friend_challenges_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
        ];
      };
      friendships: {
        Row: {
          addressee_id: string;
          created_at: string;
          requester_id: string;
          responded_at: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          addressee_id: string;
          created_at?: string;
          requester_id: string;
          responded_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          addressee_id?: string;
          created_at?: string;
          requester_id?: string;
          responded_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'friendships_addressee_id_fkey';
            columns: ['addressee_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'friendships_requester_id_fkey';
            columns: ['requester_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      item_concepts: {
        Row: {
          concept_id: string;
          dimension: string;
          item_id: string;
          language_code: string;
          role: string;
        };
        Insert: {
          concept_id: string;
          dimension: string;
          item_id: string;
          language_code: string;
          role: string;
        };
        Update: {
          concept_id?: string;
          dimension?: string;
          item_id?: string;
          language_code?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'item_concepts_concept_fkey';
            columns: ['concept_id', 'language_code'];
            isOneToOne: false;
            referencedRelation: 'concepts';
            referencedColumns: ['id', 'language_code'];
          },
          {
            foreignKeyName: 'item_concepts_dimension_fkey';
            columns: ['dimension'];
            isOneToOne: false;
            referencedRelation: 'ref_polygo_dimensions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'item_concepts_item_fkey';
            columns: ['item_id', 'language_code'];
            isOneToOne: false;
            referencedRelation: 'exercise_items';
            referencedColumns: ['id', 'language_code'];
          },
        ];
      };
      item_objectives: {
        Row: {
          item_id: string;
          language_code: string;
          objective_id: string;
        };
        Insert: {
          item_id: string;
          language_code: string;
          objective_id: string;
        };
        Update: {
          item_id?: string;
          language_code?: string;
          objective_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'item_objectives_item_fkey';
            columns: ['item_id', 'language_code'];
            isOneToOne: false;
            referencedRelation: 'exercise_items';
            referencedColumns: ['id', 'language_code'];
          },
          {
            foreignKeyName: 'item_objectives_objective_fkey';
            columns: ['objective_id', 'language_code'];
            isOneToOne: false;
            referencedRelation: 'learning_objectives';
            referencedColumns: ['id', 'language_code'];
          },
        ];
      };
      knowledge_recompute_queue: {
        Row: {
          attempts: number;
          concept_id: string;
          dimension: string;
          enqueued_at: string;
          last_error: string | null;
          processed_at: string | null;
          user_id: string;
        };
        Insert: {
          attempts?: number;
          concept_id: string;
          dimension: string;
          enqueued_at?: string;
          last_error?: string | null;
          processed_at?: string | null;
          user_id: string;
        };
        Update: {
          attempts?: number;
          concept_id?: string;
          dimension?: string;
          enqueued_at?: string;
          last_error?: string | null;
          processed_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_recompute_queue_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      languages: {
        Row: {
          code: string;
          content_status: string;
          created_at: string;
          is_target_available: boolean;
          name_es: string;
          ranked_available: boolean;
        };
        Insert: {
          code: string;
          content_status?: string;
          created_at?: string;
          is_target_available?: boolean;
          name_es: string;
          ranked_available?: boolean;
        };
        Update: {
          code?: string;
          content_status?: string;
          created_at?: string;
          is_target_available?: boolean;
          name_es?: string;
          ranked_available?: boolean;
        };
        Relationships: [];
      };
      learning_job_runs: {
        Row: {
          error: string | null;
          failed: number;
          finished_at: string;
          id: number;
          job: string;
          processed: number;
          reason: string | null;
          remaining: number | null;
          started_at: string;
          status: string;
        };
        Insert: {
          error?: string | null;
          failed?: number;
          finished_at?: string;
          id?: never;
          job: string;
          processed?: number;
          reason?: string | null;
          remaining?: number | null;
          started_at: string;
          status: string;
        };
        Update: {
          error?: string | null;
          failed?: number;
          finished_at?: string;
          id?: never;
          job?: string;
          processed?: number;
          reason?: string | null;
          remaining?: number | null;
          started_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      learning_objectives: {
        Row: {
          can_do_es: string;
          cefr_activity: string;
          cefr_ref: string | null;
          created_at: string;
          description_es: string | null;
          group_key: string | null;
          id: string;
          language_code: string;
          level: string;
          position: number;
          status: string;
        };
        Insert: {
          can_do_es: string;
          cefr_activity: string;
          cefr_ref?: string | null;
          created_at?: string;
          description_es?: string | null;
          group_key?: string | null;
          id: string;
          language_code: string;
          level: string;
          position: number;
          status: string;
        };
        Update: {
          can_do_es?: string;
          cefr_activity?: string;
          cefr_ref?: string | null;
          created_at?: string;
          description_es?: string | null;
          group_key?: string | null;
          id?: string;
          language_code?: string;
          level?: string;
          position?: number;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'learning_objectives_cefr_activity_fkey';
            columns: ['cefr_activity'];
            isOneToOne: false;
            referencedRelation: 'ref_cefr_activities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'learning_objectives_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'learning_objectives_level_fkey';
            columns: ['level'];
            isOneToOne: false;
            referencedRelation: 'ref_levels';
            referencedColumns: ['id'];
          },
        ];
      };
      learning_session_clients: {
        Row: {
          app_version: string | null;
          contract: number | null;
          platform: string | null;
          recorded_at: string;
          route: string;
          session_id: string;
          user_id: string;
        };
        Insert: {
          app_version?: string | null;
          contract?: number | null;
          platform?: string | null;
          recorded_at?: string;
          route: string;
          session_id: string;
          user_id: string;
        };
        Update: {
          app_version?: string | null;
          contract?: number | null;
          platform?: string | null;
          recorded_at?: string;
          route?: string;
          session_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'learning_session_clients_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
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
          {
            foreignKeyName: 'learning_sessions_lesson_id_fkey';
            columns: ['lesson_id'];
            isOneToOne: false;
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'learning_sessions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      lesson_objectives: {
        Row: {
          lesson_id: string;
          objective_id: string;
          role: string;
        };
        Insert: {
          lesson_id: string;
          objective_id: string;
          role: string;
        };
        Update: {
          lesson_id?: string;
          objective_id?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_objectives_lesson_id_fkey';
            columns: ['lesson_id'];
            isOneToOne: false;
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lesson_objectives_objective_id_fkey';
            columns: ['objective_id'];
            isOneToOne: false;
            referencedRelation: 'learning_objectives';
            referencedColumns: ['id'];
          },
        ];
      };
      lessons: {
        Row: {
          created_at: string;
          id: string;
          intro: Json | null;
          is_published: boolean;
          objective_es: string;
          position: number;
          takeaways: string[];
          title_es: string;
          unit_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          intro?: Json | null;
          is_published?: boolean;
          objective_es: string;
          position: number;
          takeaways?: string[];
          title_es: string;
          unit_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          intro?: Json | null;
          is_published?: boolean;
          objective_es?: string;
          position?: number;
          takeaways?: string[];
          title_es?: string;
          unit_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lessons_unit_id_fkey';
            columns: ['unit_id'];
            isOneToOne: false;
            referencedRelation: 'curriculum_units';
            referencedColumns: ['id'];
          },
        ];
      };
      mastery_model_versions: {
        Row: {
          created_at: string;
          enabled_for_adaptive: boolean;
          enabled_for_display: boolean;
          params: Json;
          status: string;
          version: string;
        };
        Insert: {
          created_at?: string;
          enabled_for_adaptive?: boolean;
          enabled_for_display?: boolean;
          params: Json;
          status: string;
          version: string;
        };
        Update: {
          created_at?: string;
          enabled_for_adaptive?: boolean;
          enabled_for_display?: boolean;
          params?: Json;
          status?: string;
          version?: string;
        };
        Relationships: [];
      };
      objective_concepts: {
        Row: {
          concept_id: string;
          language_code: string;
          objective_id: string;
          role: string;
        };
        Insert: {
          concept_id: string;
          language_code: string;
          objective_id: string;
          role: string;
        };
        Update: {
          concept_id?: string;
          language_code?: string;
          objective_id?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'objective_concepts_concept_fkey';
            columns: ['concept_id', 'language_code'];
            isOneToOne: false;
            referencedRelation: 'concepts';
            referencedColumns: ['id', 'language_code'];
          },
          {
            foreignKeyName: 'objective_concepts_objective_fkey';
            columns: ['objective_id', 'language_code'];
            isOneToOne: false;
            referencedRelation: 'learning_objectives';
            referencedColumns: ['id', 'language_code'];
          },
        ];
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
      poly_transactions: {
        Row: {
          amount: number;
          created_at: string;
          id: number;
          reason: string;
          ref: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: never;
          reason: string;
          ref: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: never;
          reason?: string;
          ref?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'poly_transactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      poly_wallets: {
        Row: {
          balance: number;
          initialized: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          balance?: number;
          initialized?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          balance?: number;
          initialized?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'poly_wallets_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      practice_sources: {
        Row: {
          active: boolean;
          affects_lesson_progress: boolean;
          affects_srs: boolean;
          consumes_energy: boolean;
          counts_for_streak: boolean;
          evidence_class: string;
          id: string;
          plus_feature: string | null;
          reward_kind: string | null;
          selection_mode: string;
        };
        Insert: {
          active: boolean;
          affects_lesson_progress: boolean;
          affects_srs: boolean;
          consumes_energy: boolean;
          counts_for_streak: boolean;
          evidence_class: string;
          id: string;
          plus_feature?: string | null;
          reward_kind?: string | null;
          selection_mode: string;
        };
        Update: {
          active?: boolean;
          affects_lesson_progress?: boolean;
          affects_srs?: boolean;
          consumes_energy?: boolean;
          counts_for_streak?: boolean;
          evidence_class?: string;
          id?: string;
          plus_feature?: string | null;
          reward_kind?: string | null;
          selection_mode?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_id: string;
          avatar_path: string | null;
          background_id: string | null;
          created_at: string;
          daily_goal_minutes: number;
          display_name: string | null;
          frame_id: string | null;
          id: string;
          onboarding_completed_at: string | null;
          public_code: string;
          region: string | null;
          start_level: string;
          target_language: string;
          tutorial_completed_at: string | null;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_id?: string;
          avatar_path?: string | null;
          background_id?: string | null;
          created_at?: string;
          daily_goal_minutes?: number;
          display_name?: string | null;
          frame_id?: string | null;
          id: string;
          onboarding_completed_at?: string | null;
          public_code: string;
          region?: string | null;
          start_level?: string;
          target_language?: string;
          tutorial_completed_at?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_id?: string;
          avatar_path?: string | null;
          background_id?: string | null;
          created_at?: string;
          daily_goal_minutes?: number;
          display_name?: string | null;
          frame_id?: string | null;
          id?: string;
          onboarding_completed_at?: string | null;
          public_code?: string;
          region?: string | null;
          start_level?: string;
          target_language?: string;
          tutorial_completed_at?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_background_id_fkey';
            columns: ['background_id'];
            isOneToOne: false;
            referencedRelation: 'cosmetic_items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_frame_id_fkey';
            columns: ['frame_id'];
            isOneToOne: false;
            referencedRelation: 'cosmetic_items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_target_language_fkey';
            columns: ['target_language'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
        ];
      };
      push_tokens: {
        Row: {
          active: boolean;
          created_at: string;
          platform: string;
          token: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          platform: string;
          token: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          platform?: string;
          token?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'push_tokens_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      ranked_queue: {
        Row: {
          active: boolean;
          battle_id: string | null;
          curriculum_api: number;
          joined_at: string;
          language_code: string;
          rating: number;
          seen_at: string;
          user_id: string;
        };
        Insert: {
          active?: boolean;
          battle_id?: string | null;
          curriculum_api?: number;
          joined_at?: string;
          language_code: string;
          rating: number;
          seen_at?: string;
          user_id: string;
        };
        Update: {
          active?: boolean;
          battle_id?: string | null;
          curriculum_api?: number;
          joined_at?: string;
          language_code?: string;
          rating?: number;
          seen_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ranked_queue_battle_id_fkey';
            columns: ['battle_id'];
            isOneToOne: false;
            referencedRelation: 'battles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ranked_queue_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'ranked_queue_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
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
            foreignKeyName: 'rating_history_battle_id_fkey';
            columns: ['battle_id'];
            isOneToOne: false;
            referencedRelation: 'battles';
            referencedColumns: ['id'];
          },
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
      ref_assessment_modes: {
        Row: {
          feeds_comprehension: boolean;
          feeds_production: boolean;
          id: string;
          retrieval_rank: number | null;
        };
        Insert: {
          feeds_comprehension: boolean;
          feeds_production: boolean;
          id: string;
          retrieval_rank?: number | null;
        };
        Update: {
          feeds_comprehension?: boolean;
          feeds_production?: boolean;
          id?: string;
          retrieval_rank?: number | null;
        };
        Relationships: [];
      };
      ref_assists: {
        Row: {
          id: string;
          optional: boolean;
        };
        Insert: {
          id: string;
          optional: boolean;
        };
        Update: {
          id?: string;
          optional?: boolean;
        };
        Relationships: [];
      };
      ref_cefr_activities: {
        Row: {
          direction: string;
          id: string;
        };
        Insert: {
          direction: string;
          id: string;
        };
        Update: {
          direction?: string;
          id?: string;
        };
        Relationships: [];
      };
      ref_concept_kinds: {
        Row: {
          id: string;
          knowledge_dimension: string | null;
        };
        Insert: {
          id: string;
          knowledge_dimension?: string | null;
        };
        Update: {
          id?: string;
          knowledge_dimension?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'ref_concept_kinds_knowledge_dimension_fkey';
            columns: ['knowledge_dimension'];
            isOneToOne: false;
            referencedRelation: 'ref_polygo_dimensions';
            referencedColumns: ['id'];
          },
        ];
      };
      ref_grading_modes: {
        Row: {
          created_at: string;
          id: string;
          mode: string;
          schema: Json;
          version: number;
        };
        Insert: {
          created_at?: string;
          id: string;
          mode: string;
          schema: Json;
          version: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          mode?: string;
          schema?: Json;
          version?: number;
        };
        Relationships: [];
      };
      ref_input_modalities: {
        Row: {
          id: string;
        };
        Insert: {
          id: string;
        };
        Update: {
          id?: string;
        };
        Relationships: [];
      };
      ref_levels: {
        Row: {
          id: string;
          position: number;
        };
        Insert: {
          id: string;
          position: number;
        };
        Update: {
          id?: string;
          position?: number;
        };
        Relationships: [];
      };
      ref_mode_formats: {
        Row: {
          assessment_mode: string;
          response_format: string;
        };
        Insert: {
          assessment_mode: string;
          response_format: string;
        };
        Update: {
          assessment_mode?: string;
          response_format?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ref_mode_formats_assessment_mode_fkey';
            columns: ['assessment_mode'];
            isOneToOne: false;
            referencedRelation: 'ref_assessment_modes';
            referencedColumns: ['id'];
          },
        ];
      };
      ref_polygo_dimensions: {
        Row: {
          axis: string;
          id: string;
        };
        Insert: {
          axis: string;
          id: string;
        };
        Update: {
          axis?: string;
          id?: string;
        };
        Relationships: [];
      };
      ref_response_privacy: {
        Row: {
          id: string;
          retention_months: number;
        };
        Insert: {
          id: string;
          retention_months: number;
        };
        Update: {
          id?: string;
          retention_months?: number;
        };
        Relationships: [];
      };
      ref_shuffle_algorithms: {
        Row: {
          created_at: string;
          description: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
        };
        Relationships: [];
      };
      review_presentation_answers: {
        Row: {
          answered_at: string;
          assists: Json;
          client_verdict: string | null;
          grader: string;
          grader_version: string;
          presentation_id: number;
          response: Json;
          response_ms: number;
          selected_option: number | null;
          session_id: string;
          status: string;
          user_id: string;
          verdict: string | null;
        };
        Insert: {
          answered_at?: string;
          assists?: Json;
          client_verdict?: string | null;
          grader: string;
          grader_version: string;
          presentation_id: number;
          response: Json;
          response_ms: number;
          selected_option?: number | null;
          session_id: string;
          status: string;
          user_id: string;
          verdict?: string | null;
        };
        Update: {
          answered_at?: string;
          assists?: Json;
          client_verdict?: string | null;
          grader?: string;
          grader_version?: string;
          presentation_id?: number;
          response?: Json;
          response_ms?: number;
          selected_option?: number | null;
          session_id?: string;
          status?: string;
          user_id?: string;
          verdict?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'review_presentation_answers_presentation_id_fkey';
            columns: ['presentation_id'];
            isOneToOne: true;
            referencedRelation: 'exercise_presentations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'review_presentation_answers_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      review_presentation_retries: {
        Row: {
          answered_at: string;
          assists: Json;
          attempt_no: number;
          client_verdict: string | null;
          grader: string;
          grader_version: string;
          presentation_id: number;
          response: Json;
          response_ms: number;
          selected_option: number | null;
          session_id: string;
          status: string;
          user_id: string;
          verdict: string | null;
        };
        Insert: {
          answered_at?: string;
          assists?: Json;
          attempt_no: number;
          client_verdict?: string | null;
          grader: string;
          grader_version: string;
          presentation_id: number;
          response: Json;
          response_ms: number;
          selected_option?: number | null;
          session_id: string;
          status: string;
          user_id: string;
          verdict?: string | null;
        };
        Update: {
          answered_at?: string;
          assists?: Json;
          attempt_no?: number;
          client_verdict?: string | null;
          grader?: string;
          grader_version?: string;
          presentation_id?: number;
          response?: Json;
          response_ms?: number;
          selected_option?: number | null;
          session_id?: string;
          status?: string;
          user_id?: string;
          verdict?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'review_presentation_retries_presentation_id_fkey';
            columns: ['presentation_id'];
            isOneToOne: false;
            referencedRelation: 'review_presentation_answers';
            referencedColumns: ['presentation_id'];
          },
          {
            foreignKeyName: 'review_presentation_retries_user_id_fkey';
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
      srs_algorithm_versions: {
        Row: {
          created_at: string;
          params: Json;
          status: string;
          version: string;
        };
        Insert: {
          created_at?: string;
          params: Json;
          status: string;
          version: string;
        };
        Update: {
          created_at?: string;
          params?: Json;
          status?: string;
          version?: string;
        };
        Relationships: [];
      };
      srs_applied_sessions: {
        Row: {
          algorithm_version: string;
          applied_at: string;
          imax: number;
          items_served: number;
          language_code: string | null;
          origin: string;
          planner_version: string;
          seq: number;
          session_id: string;
          source: string;
          t_srs: string;
          time_zone: string;
          units_attended: number;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          applied_at?: string;
          imax: number;
          items_served?: number;
          language_code?: string | null;
          origin: string;
          planner_version: string;
          seq: number;
          session_id: string;
          source: string;
          t_srs: string;
          time_zone: string;
          units_attended?: number;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          applied_at?: string;
          imax?: number;
          items_served?: number;
          language_code?: string | null;
          origin?: string;
          planner_version?: string;
          seq?: number;
          session_id?: string;
          source?: string;
          t_srs?: string;
          time_zone?: string;
          units_attended?: number;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'srs_applied_sessions_algorithm_version_fkey';
            columns: ['algorithm_version'];
            isOneToOne: false;
            referencedRelation: 'srs_algorithm_versions';
            referencedColumns: ['version'];
          },
          {
            foreignKeyName: 'srs_applied_sessions_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'srs_applied_sessions_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: true;
            referencedRelation: 'learning_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'srs_applied_sessions_source_fkey';
            columns: ['source'];
            isOneToOne: false;
            referencedRelation: 'practice_sources';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'srs_applied_sessions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'srs_applied_sessions_weights_version_fkey';
            columns: ['weights_version'];
            isOneToOne: false;
            referencedRelation: 'srs_weights';
            referencedColumns: ['weights_version'];
          },
        ];
      };
      srs_hint_queue: {
        Row: {
          concept_id: string;
          dimension: string;
          enqueued_at: string;
          processed_at: string | null;
          user_id: string;
        };
        Insert: {
          concept_id: string;
          dimension: string;
          enqueued_at?: string;
          processed_at?: string | null;
          user_id: string;
        };
        Update: {
          concept_id?: string;
          dimension?: string;
          enqueued_at?: string;
          processed_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'srs_hint_queue_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      srs_migration_cutoff: {
        Row: {
          category_c_ratio: number | null;
          converted_units: number;
          created_at: string;
          cutoff_at: string;
          max_attempt_id: number | null;
          result: Json;
          session_ids_hash: string;
          sessions: number;
          time_zone: string;
          user_id: string;
          verified_units: number;
        };
        Insert: {
          category_c_ratio?: number | null;
          converted_units: number;
          created_at?: string;
          cutoff_at: string;
          max_attempt_id?: number | null;
          result: Json;
          session_ids_hash: string;
          sessions: number;
          time_zone: string;
          user_id: string;
          verified_units: number;
        };
        Update: {
          category_c_ratio?: number | null;
          converted_units?: number;
          created_at?: string;
          cutoff_at?: string;
          max_attempt_id?: number | null;
          result?: Json;
          session_ids_hash?: string;
          sessions?: number;
          time_zone?: string;
          user_id?: string;
          verified_units?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'srs_migration_cutoff_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      srs_migration_queue: {
        Row: {
          attempts: number;
          enqueued_at: string;
          last_error: string | null;
          next_attempt_at: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          attempts?: number;
          enqueued_at?: string;
          last_error?: string | null;
          next_attempt_at?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          attempts?: number;
          enqueued_at?: string;
          last_error?: string | null;
          next_attempt_at?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'srs_migration_queue_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      srs_session_plans: {
        Row: {
          algorithm_version: string;
          budget: number;
          created_at: string;
          expires_at: string;
          focus: Json | null;
          items: Json;
          language_code: string;
          local_date: string | null;
          planner_version: string;
          session_id: string;
          source: string;
          time_zone: string | null;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          budget: number;
          created_at?: string;
          expires_at?: string;
          focus?: Json | null;
          items: Json;
          language_code: string;
          local_date?: string | null;
          planner_version: string;
          session_id: string;
          source: string;
          time_zone?: string | null;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          budget?: number;
          created_at?: string;
          expires_at?: string;
          focus?: Json | null;
          items?: Json;
          language_code?: string;
          local_date?: string | null;
          planner_version?: string;
          session_id?: string;
          source?: string;
          time_zone?: string | null;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'srs_session_plans_algorithm_version_fkey';
            columns: ['algorithm_version'];
            isOneToOne: false;
            referencedRelation: 'srs_algorithm_versions';
            referencedColumns: ['version'];
          },
          {
            foreignKeyName: 'srs_session_plans_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'srs_session_plans_source_fkey';
            columns: ['source'];
            isOneToOne: false;
            referencedRelation: 'practice_sources';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'srs_session_plans_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'srs_session_plans_weights_version_fkey';
            columns: ['weights_version'];
            isOneToOne: false;
            referencedRelation: 'srs_weights';
            referencedColumns: ['weights_version'];
          },
        ];
      };
      srs_unit_updates: {
        Row: {
          concept_id: string;
          dimension: string;
          full_error: boolean;
          informative: boolean;
          language_code: string;
          lapses_after: number;
          origin: string;
          seq: number;
          session_id: string;
          t_srs: string;
          user_id: string;
        };
        Insert: {
          concept_id: string;
          dimension: string;
          full_error: boolean;
          informative: boolean;
          language_code: string;
          lapses_after: number;
          origin: string;
          seq: number;
          session_id: string;
          t_srs: string;
          user_id: string;
        };
        Update: {
          concept_id?: string;
          dimension?: string;
          full_error?: boolean;
          informative?: boolean;
          language_code?: string;
          lapses_after?: number;
          origin?: string;
          seq?: number;
          session_id?: string;
          t_srs?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'srs_unit_updates_dimension_fkey';
            columns: ['dimension'];
            isOneToOne: false;
            referencedRelation: 'ref_polygo_dimensions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'srs_unit_updates_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'srs_unit_updates_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'learning_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'srs_unit_updates_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      srs_user_debt_days: {
        Row: {
          al19_active: boolean;
          budget: number;
          created_at: string;
          debt_items: number;
          debt_prev_units: number;
          debt_units_end: number | null;
          imax_effective: number;
          ipu: number;
          language_code: string;
          load45: number | null;
          pend_units: number;
          study_date: string;
          trend_ratio: number | null;
          user_id: string;
        };
        Insert: {
          al19_active: boolean;
          budget: number;
          created_at?: string;
          debt_items: number;
          debt_prev_units: number;
          debt_units_end?: number | null;
          imax_effective: number;
          ipu: number;
          language_code: string;
          load45?: number | null;
          pend_units: number;
          study_date: string;
          trend_ratio?: number | null;
          user_id: string;
        };
        Update: {
          al19_active?: boolean;
          budget?: number;
          created_at?: string;
          debt_items?: number;
          debt_prev_units?: number;
          debt_units_end?: number | null;
          imax_effective?: number;
          ipu?: number;
          language_code?: string;
          load45?: number | null;
          pend_units?: number;
          study_date?: string;
          trend_ratio?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'srs_user_debt_days_user_id_language_code_fkey';
            columns: ['user_id', 'language_code'];
            isOneToOne: false;
            referencedRelation: 'srs_user_debt_state';
            referencedColumns: ['user_id', 'language_code'];
          },
        ];
      };
      srs_user_debt_state: {
        Row: {
          al19_active: boolean;
          enter_streak: number;
          entered_at: string | null;
          entered_on: string | null;
          entries: number;
          evaluated_at: string | null;
          evaluated_on: string;
          exit_streak: number;
          imax_effective: number;
          init_source: string;
          language_code: string;
          last_ipu: number | null;
          last_load45: number | null;
          last_trend_ratio: number | null;
          measured_days: number;
          measured_since: string;
          measured_since_date: string;
          planner_version: string;
          user_id: string;
        };
        Insert: {
          al19_active?: boolean;
          enter_streak?: number;
          entered_at?: string | null;
          entered_on?: string | null;
          entries?: number;
          evaluated_at?: string | null;
          evaluated_on: string;
          exit_streak?: number;
          imax_effective?: number;
          init_source: string;
          language_code: string;
          last_ipu?: number | null;
          last_load45?: number | null;
          last_trend_ratio?: number | null;
          measured_days?: number;
          measured_since: string;
          measured_since_date: string;
          planner_version: string;
          user_id: string;
        };
        Update: {
          al19_active?: boolean;
          enter_streak?: number;
          entered_at?: string | null;
          entered_on?: string | null;
          entries?: number;
          evaluated_at?: string | null;
          evaluated_on?: string;
          exit_streak?: number;
          imax_effective?: number;
          init_source?: string;
          language_code?: string;
          last_ipu?: number | null;
          last_load45?: number | null;
          last_trend_ratio?: number | null;
          measured_days?: number;
          measured_since?: string;
          measured_since_date?: string;
          planner_version?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'srs_user_debt_state_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'srs_user_debt_state_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      srs_user_head: {
        Row: {
          last_seq: number;
          last_t_srs: string | null;
          time_zone: string | null;
          updated_at: string;
          user_id: string;
          v2_since: string | null;
        };
        Insert: {
          last_seq?: number;
          last_t_srs?: string | null;
          time_zone?: string | null;
          updated_at?: string;
          user_id: string;
          v2_since?: string | null;
        };
        Update: {
          last_seq?: number;
          last_t_srs?: string | null;
          time_zone?: string | null;
          updated_at?: string;
          user_id?: string;
          v2_since?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'srs_user_head_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      srs_v2_settings: {
        Row: {
          enabled: boolean;
          id: boolean;
          updated_at: string;
        };
        Insert: {
          enabled?: boolean;
          id?: boolean;
          updated_at?: string;
        };
        Update: {
          enabled?: boolean;
          id?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      srs_weights: {
        Row: {
          algorithm_version: string;
          created_at: string;
          fitted_on: Json;
          status: string;
          w: number[];
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          created_at?: string;
          fitted_on: Json;
          status: string;
          w: number[];
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          created_at?: string;
          fitted_on?: Json;
          status?: string;
          w?: number[];
          weights_version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'srs_weights_algorithm_version_fkey';
            columns: ['algorithm_version'];
            isOneToOne: false;
            referencedRelation: 'srs_algorithm_versions';
            referencedColumns: ['version'];
          },
        ];
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
          {
            foreignKeyName: 'user_achievements_achievement_id_fkey';
            columns: ['achievement_id'];
            isOneToOne: false;
            referencedRelation: 'achievements';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_achievements_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_blocks: {
        Row: {
          active: boolean;
          blocked_id: string;
          blocker_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          blocked_id: string;
          blocker_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          blocked_id?: string;
          blocker_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_blocks_blocked_id_fkey';
            columns: ['blocked_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_blocks_blocker_id_fkey';
            columns: ['blocker_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_concept_state: {
        Row: {
          assisted_count: number;
          best_mode_rank_correct: number | null;
          computed_at: string | null;
          concept_id: string;
          confidence: number | null;
          current_correct_streak: number;
          dimension: string;
          dirty_since: string | null;
          distinct_days: number;
          evidence_count: number;
          exposure_count: number;
          first_exposed_at: string | null;
          first_try_correct: number;
          first_try_count: number;
          language_code: string;
          last_correct_at: string | null;
          last_exposed_at: string | null;
          last_incorrect_at: string | null;
          last_outcome: string | null;
          mastery: number | null;
          max_retained_gap_s: number | null;
          model_detail: Json | null;
          model_version: string | null;
          prior_confidence: number | null;
          prior_evidence_count: number | null;
          prior_last_evidence_at: string | null;
          prior_level: string | null;
          prior_mastery: number | null;
          prior_model_version: string | null;
          prior_retention_estimate: number | null;
          prior_snapshot_id: number | null;
          recall_speed: number | null;
          retention_estimate: number | null;
          status: string;
          sum_log_response_ms: number | null;
          unassisted_first_try_correct: number;
          user_id: string;
          weak: boolean;
        };
        Insert: {
          assisted_count?: number;
          best_mode_rank_correct?: number | null;
          computed_at?: string | null;
          concept_id: string;
          confidence?: number | null;
          current_correct_streak?: number;
          dimension: string;
          dirty_since?: string | null;
          distinct_days?: number;
          evidence_count?: number;
          exposure_count?: number;
          first_exposed_at?: string | null;
          first_try_correct?: number;
          first_try_count?: number;
          language_code: string;
          last_correct_at?: string | null;
          last_exposed_at?: string | null;
          last_incorrect_at?: string | null;
          last_outcome?: string | null;
          mastery?: number | null;
          max_retained_gap_s?: number | null;
          model_detail?: Json | null;
          model_version?: string | null;
          prior_confidence?: number | null;
          prior_evidence_count?: number | null;
          prior_last_evidence_at?: string | null;
          prior_level?: string | null;
          prior_mastery?: number | null;
          prior_model_version?: string | null;
          prior_retention_estimate?: number | null;
          prior_snapshot_id?: number | null;
          recall_speed?: number | null;
          retention_estimate?: number | null;
          status?: string;
          sum_log_response_ms?: number | null;
          unassisted_first_try_correct?: number;
          user_id: string;
          weak?: boolean;
        };
        Update: {
          assisted_count?: number;
          best_mode_rank_correct?: number | null;
          computed_at?: string | null;
          concept_id?: string;
          confidence?: number | null;
          current_correct_streak?: number;
          dimension?: string;
          dirty_since?: string | null;
          distinct_days?: number;
          evidence_count?: number;
          exposure_count?: number;
          first_exposed_at?: string | null;
          first_try_correct?: number;
          first_try_count?: number;
          language_code?: string;
          last_correct_at?: string | null;
          last_exposed_at?: string | null;
          last_incorrect_at?: string | null;
          last_outcome?: string | null;
          mastery?: number | null;
          max_retained_gap_s?: number | null;
          model_detail?: Json | null;
          model_version?: string | null;
          prior_confidence?: number | null;
          prior_evidence_count?: number | null;
          prior_last_evidence_at?: string | null;
          prior_level?: string | null;
          prior_mastery?: number | null;
          prior_model_version?: string | null;
          prior_retention_estimate?: number | null;
          prior_snapshot_id?: number | null;
          recall_speed?: number | null;
          retention_estimate?: number | null;
          status?: string;
          sum_log_response_ms?: number | null;
          unassisted_first_try_correct?: number;
          user_id?: string;
          weak?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'user_concept_state_concept_fkey';
            columns: ['concept_id', 'language_code'];
            isOneToOne: false;
            referencedRelation: 'concepts';
            referencedColumns: ['id', 'language_code'];
          },
          {
            foreignKeyName: 'user_concept_state_dimension_fkey';
            columns: ['dimension'];
            isOneToOne: false;
            referencedRelation: 'ref_polygo_dimensions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_concept_state_model_version_fkey';
            columns: ['model_version'];
            isOneToOne: false;
            referencedRelation: 'mastery_model_versions';
            referencedColumns: ['version'];
          },
          {
            foreignKeyName: 'user_concept_state_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_cosmetics: {
        Row: {
          acquired_at: string;
          item_id: string;
          source: string;
          user_id: string;
        };
        Insert: {
          acquired_at?: string;
          item_id: string;
          source: string;
          user_id: string;
        };
        Update: {
          acquired_at?: string;
          item_id?: string;
          source?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_cosmetics_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'cosmetic_items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_cosmetics_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
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
        Relationships: [
          {
            foreignKeyName: 'user_daily_activity_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_energy: {
        Row: {
          anchor_at: string;
          units: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          anchor_at: string;
          units: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          anchor_at?: string;
          units?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_energy_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_entitlements: {
        Row: {
          entitlement: string;
          expires_at: string | null;
          external_id: string | null;
          source: string;
          starts_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          entitlement: string;
          expires_at?: string | null;
          external_id?: string | null;
          source: string;
          starts_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          entitlement?: string;
          expires_at?: string | null;
          external_id?: string | null;
          source?: string;
          starts_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_entitlements_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_frozen_days: {
        Row: {
          created_at: string;
          frozen_date: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          frozen_date: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          frozen_date?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_frozen_days_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
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
          {
            foreignKeyName: 'user_lesson_progress_lesson_id_fkey';
            columns: ['lesson_id'];
            isOneToOne: false;
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_lesson_progress_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_mission_rewards: {
        Row: {
          claimed_at: string;
          mission_date: string;
          user_id: string;
        };
        Insert: {
          claimed_at?: string;
          mission_date: string;
          user_id: string;
        };
        Update: {
          claimed_at?: string;
          mission_date?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_mission_rewards_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_presence: {
        Row: {
          last_seen_at: string;
          user_id: string;
        };
        Insert: {
          last_seen_at?: string;
          user_id: string;
        };
        Update: {
          last_seen_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_presence_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_settings: {
        Row: {
          created_at: string;
          notify_challenges: boolean;
          profile_visibility: string;
          show_online: boolean;
          show_region: boolean;
          updated_at: string;
          user_id: string;
          widget_content_type: string;
        };
        Insert: {
          created_at?: string;
          notify_challenges?: boolean;
          profile_visibility?: string;
          show_online?: boolean;
          show_region?: boolean;
          updated_at?: string;
          user_id: string;
          widget_content_type?: string;
        };
        Update: {
          created_at?: string;
          notify_challenges?: boolean;
          profile_visibility?: string;
          show_online?: boolean;
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
      user_srs_state: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_srs_state_algorithm_version_fkey';
            columns: ['algorithm_version'];
            isOneToOne: false;
            referencedRelation: 'srs_algorithm_versions';
            referencedColumns: ['version'];
          },
          {
            foreignKeyName: 'user_srs_state_concept_fkey';
            columns: ['concept_id', 'language_code'];
            isOneToOne: false;
            referencedRelation: 'concepts';
            referencedColumns: ['id', 'language_code'];
          },
          {
            foreignKeyName: 'user_srs_state_dimension_fkey';
            columns: ['dimension'];
            isOneToOne: false;
            referencedRelation: 'ref_polygo_dimensions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_srs_state_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_srs_state_weights_version_fkey';
            columns: ['weights_version'];
            isOneToOne: false;
            referencedRelation: 'srs_weights';
            referencedColumns: ['weights_version'];
          },
        ];
      };
      user_srs_state_p0: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p1: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p10: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p11: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p12: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p13: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p14: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p15: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p2: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p3: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p4: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p5: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p6: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p7: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p8: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_srs_state_p9: {
        Row: {
          algorithm_version: string;
          concept_id: string;
          created_at: string;
          difficulty: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses: number;
          last_a: number | null;
          last_seen_at: string;
          last_session_id: string | null;
          last_z_minus: number | null;
          me_hint_at: string | null;
          me_hint_expires_at: string | null;
          migration_reason: string | null;
          migration_source: string | null;
          n: number;
          recent_item_ids: string[];
          relearning: boolean;
          rung: string;
          stability: number | null;
          t_last: string | null;
          updated_at: string;
          user_id: string;
          weights_version: string;
        };
        Insert: {
          algorithm_version: string;
          concept_id: string;
          created_at?: string;
          difficulty?: number | null;
          dimension: string;
          due_at: string;
          due_effective_at: string;
          exposures: number;
          language_code: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id: string;
          weights_version: string;
        };
        Update: {
          algorithm_version?: string;
          concept_id?: string;
          created_at?: string;
          difficulty?: number | null;
          dimension?: string;
          due_at?: string;
          due_effective_at?: string;
          exposures?: number;
          language_code?: string;
          lapses?: number;
          last_a?: number | null;
          last_seen_at?: string;
          last_session_id?: string | null;
          last_z_minus?: number | null;
          me_hint_at?: string | null;
          me_hint_expires_at?: string | null;
          migration_reason?: string | null;
          migration_source?: string | null;
          n?: number;
          recent_item_ids?: string[];
          relearning?: boolean;
          rung?: string;
          stability?: number | null;
          t_last?: string | null;
          updated_at?: string;
          user_id?: string;
          weights_version?: string;
        };
        Relationships: [];
      };
      user_streak_freezes: {
        Row: {
          available: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          available?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          available?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_streak_freezes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
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
          {
            foreignKeyName: 'user_word_progress_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_word_progress_word_id_fkey';
            columns: ['word_id'];
            isOneToOne: false;
            referencedRelation: 'words';
            referencedColumns: ['id'];
          },
        ];
      };
      words: {
        Row: {
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
          romanization: string | null;
          tags: string[];
          text: string;
          translation_es: string;
          unit_id: string;
          updated_at: string;
        };
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
          romanization?: string | null;
          tags?: string[];
          text: string;
          translation_es: string;
          unit_id: string;
          updated_at?: string;
        };
        Update: {
          accepted_translations?: string[];
          created_at?: string;
          difficulty?: number;
          emoji?: string | null;
          example_en?: string | null;
          example_es?: string | null;
          id?: string;
          ipa?: string | null;
          is_published?: boolean;
          language_code?: string;
          review_status?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          romanization?: string | null;
          tags?: string[];
          text?: string;
          translation_es?: string;
          unit_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'words_language_code_fkey';
            columns: ['language_code'];
            isOneToOne: false;
            referencedRelation: 'languages';
            referencedColumns: ['code'];
          },
          {
            foreignKeyName: 'words_unit_id_fkey';
            columns: ['unit_id'];
            isOneToOne: false;
            referencedRelation: 'curriculum_units';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      exercise_attempt_reconstruction: {
        Row: {
          attempt_id: number | null;
          created_at: string | null;
          exercise_id: string | null;
          presentation_id: number | null;
          reason: string | null;
          session_id: string | null;
          status: string | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'exercise_attempt_presentations_presentation_id_fkey';
            columns: ['presentation_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_presentations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attempts_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attempts_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'learning_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attempts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      accept_friend_challenge: { Args: { p_code: string }; Returns: Json };
      achievement_metrics: { Args: { p_user_id: string }; Returns: Json };
      apply_word_result: {
        Args: {
          p_at: string;
          p_correct: boolean;
          p_user_id: string;
          p_word_id: string;
        };
        Returns: undefined;
      };
      are_friends: { Args: { p_a: string; p_b: string }; Returns: boolean };
      battle_settlement_context: {
        Args: { p_battle_id: string; p_window_hours: number };
        Returns: {
          games_played: number;
          matches_in_window: number;
          rating: number;
          slot: number;
          user_id: string;
        }[];
      };
      battle_server_challenge_host: {
        Args: { p_code: string; p_host: string };
        Returns: Json;
      };
      battle_server_challenge_join: {
        Args: { p_code: string; p_guest: string };
        Returns: Json;
      };
      battle_settlement_context_v2: {
        Args: { p_battle_id: string; p_window_hours: number };
        Returns: {
          games_played: number;
          is_ranked: boolean;
          matches_in_window: number;
          rating: number;
          slot: number;
          user_id: string;
          wins: number;
        }[];
      };
      block_user: { Args: { p_user_id: string }; Returns: undefined };
      bot_calibration_limit: { Args: never; Returns: number };
      bot_calibration_used: {
        Args: { p_language_code: string; p_user_id: string };
        Returns: number;
      };
      bot_script: { Args: { p_rating: number }; Returns: Json };
      bot_skill: {
        Args: { p_rating: number };
        Returns: {
          accuracy: number;
          mean_ms: number;
        }[];
      };
      buy_cosmetic: { Args: { p_item_id: string }; Returns: Json };
      buy_streak_freeze: { Args: never; Returns: Json };
      cancel_battle: { Args: { p_battle_id: string }; Returns: boolean };
      cancel_friend_challenge: { Args: { p_code: string }; Returns: undefined };
      cancel_stale_battles: {
        Args: { p_older_than_seconds: number };
        Returns: number;
      };
      claim_battle_invite_push: {
        Args: { p_code: string; p_host: string };
        Returns: Json;
      };
      claim_friend_challenge: { Args: { p_id: string }; Returns: Json };
      claim_friend_daily_mission: {
        Args: { p_id: string; p_time_zone: string };
        Returns: Json;
      };
      claim_mission_reward: { Args: { p_time_zone: string }; Returns: Json };
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
          avatar_path: string | null;
          background_id: string | null;
          created_at: string;
          daily_goal_minutes: number;
          display_name: string | null;
          frame_id: string | null;
          id: string;
          onboarding_completed_at: string | null;
          public_code: string;
          region: string | null;
          start_level: string;
          target_language: string;
          tutorial_completed_at: string | null;
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
      complete_tutorial: { Args: never; Returns: undefined };
      consume_lesson_energy: { Args: { p_user: string }; Returns: number };
      create_friend_challenge: { Args: never; Returns: Json };
      current_streak: { Args: { p_user: string }; Returns: number };
      daily_missions_for: {
        Args: { p_day: string; p_user: string };
        Returns: Json;
      };
      deactivate_push_tokens: {
        Args: { p_tokens: string[] };
        Returns: undefined;
      };
      decline_battle_invite: { Args: { p_code: string }; Returns: undefined };
      energy_config: { Args: never; Returns: Json };
      energy_now: {
        Args: { p_at: string; p_user: string };
        Returns: Record<string, unknown>;
      };
      equip_cosmetic: {
        Args: { p_item_id: string | null; p_kind: string };
        Returns: undefined;
      };
      evaluate_achievements: { Args: { p_user_id: string }; Returns: string[] };
      exercise_presentation_snapshot: {
        Args: { p_presentation_id: number };
        Returns: Json;
      };
      finish_bot_match: {
        Args: {
          p_answered: number;
          p_battle_id: string;
          p_correct: number;
          p_forfeit: boolean;
          p_score: number;
        };
        Returns: Json;
      };
      finish_human_match: {
        Args: {
          p_answered: number;
          p_battle_id: string;
          p_correct: number;
          p_forfeit: boolean;
          p_score: number;
        };
        Returns: Json;
      };
      finish_tutorial: { Args: never; Returns: Json };
      friend_challenge_progress: {
        Args: { p_id: string; p_user: string; p_week: string };
        Returns: number;
      };
      friend_challenge_status: { Args: { p_code: string }; Returns: Json };
      friend_count: { Args: { p_user: string }; Returns: number };
      friend_daily_config: { Args: never; Returns: Json };
      friend_ids: {
        Args: { p_user: string };
        Returns: {
          friend_id: string;
          friends_since: string;
          open_stats: boolean;
        }[];
      };
      friend_limit: { Args: never; Returns: number };
      friend_weekly_config: { Args: never; Returns: Json };
      friendship_state: {
        Args: { p_me: string; p_other: string };
        Returns: string;
      };
      generate_public_code: { Args: never; Returns: string };
      get_blocked_users: {
        Args: never;
        Returns: {
          avatar_id: string;
          blocked_at: string;
          user_id: string;
          username: string;
        }[];
      };
      get_competitive_stats: { Args: { p_days: number | null }; Returns: Json };
      get_daily_missions: { Args: { p_time_zone: string }; Returns: Json };
      get_coach_status: { Args: never; Returns: Json };
      get_energy: { Args: never; Returns: Json };
      get_entitlements: { Args: never; Returns: Json };
      get_friend_activity: {
        Args: never;
        Returns: {
          avatar_id: string;
          avatar_path: string;
          frame_id: string;
          happened_at: string;
          kind: string;
          label: string;
          user_id: string;
          username: string;
          value: number;
          value2: number;
        }[];
      };
      get_friend_daily_missions: {
        Args: { p_time_zone: string };
        Returns: Json;
      };
      get_friend_weekly_challenges: { Args: never; Returns: Json };
      get_friends: {
        Args: never;
        Returns: {
          avatar_id: string;
          avatar_path: string;
          frame_id: string;
          placed: boolean;
          rating: number;
          since: string;
          state: string;
          streak: number;
          user_id: string;
          username: string;
        }[];
      };
      get_friends_v2: {
        Args: never;
        Returns: {
          avatar_id: string;
          avatar_path: string;
          frame_id: string;
          invite_code: string;
          invited_by_me: boolean;
          last_seen_at: string;
          online: boolean;
          placed: boolean;
          rating: number;
          since: string;
          state: string;
          streak: number;
          user_id: string;
          username: string;
        }[];
      };
      get_human_match: { Args: { p_battle_id: string }; Returns: Json };
      get_leaderboard: {
        Args: { p_language_code?: string | null; p_limit?: number };
        Returns: {
          avatar_id: string;
          avatar_path: string;
          games_played: number;
          language_code: string;
          position: number;
          rating: number;
          region: string;
          user_id: string;
          username: string;
          wins: number;
        }[];
      };
      get_learning_mastery: {
        Args: { p_language: string; p_time_zone: string };
        Returns: Json;
      };
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
      get_my_leaderboard_entry: {
        Args: { p_language_code?: string | null };
        Returns: {
          games_played: number;
          position: number;
          rating: number;
          total: number;
          wins: number;
        }[];
      };
      get_my_leaderboard_position: {
        Args: { p_language_code?: string | null };
        Returns: {
          position: number;
          total: number;
        }[];
      };
      get_public_profile: { Args: { p_user_id: string }; Returns: Json };
      get_public_stars: {
        Args: { p_user_ids: string[] };
        Returns: {
          stars_earned: number;
          user_id: string;
        }[];
      };
      get_streak_repair: { Args: { p_time_zone: string }; Returns: Json };
      has_plus: { Args: { p_user: string }; Returns: boolean };
      human_match_result: { Args: { p_battle_id: string }; Returns: Json };
      invite_friend_to_battle: { Args: { p_user_id: string }; Returns: Json };
      invite_is_live: {
        Args: { c: Database['public']['Tables']['friend_challenges']['Row'] };
        Returns: boolean;
      };
      is_blocked_between: {
        Args: { p_a: string; p_b: string };
        Returns: boolean;
      };
      is_content_tester: { Args: never; Returns: boolean };
      is_lesson_unlocked: {
        Args: { p_lesson_id: string; p_user_id: string };
        Returns: boolean;
      };
      app_client_status: {
        Args: { p_app_version?: string | null; p_platform?: string | null; p_curriculum_api?: number | null };
        Returns: Json;
      };
      my_curriculum_route: {
        Args: { p_language_code: string };
        Returns: {
          level: string;
          route_id: string | null;
          unit_id: string;
          unit_order: number;
        }[];
      };
      is_online: { Args: { p_user: string }; Returns: boolean };
      is_username_available: { Args: { p_username: string }; Returns: boolean };
      item_concepts_rule_violation: {
        Args: { p_item_id: string };
        Returns: string;
      };
      join_human_queue: { Args: never; Returns: Json };
      leaderboard_ranked: {
        Args: { p_language_code: string };
        Returns: {
          games_played: number;
          language_code: string;
          position: number;
          rating: number;
          user_id: string;
          wins: number;
        }[];
      };
      learning_focus_candidates: {
        Args: { p_lang: string; p_now: string; p_user: string };
        Returns: Json;
      };
      learning_jobs_status: { Args: never; Returns: Json };
      learning_lesson_plan: {
        Args: { p_lesson_id: string; p_user: string };
        Returns: Json;
      };
      learning_note_client: {
        Args: {
          p_client: Json;
          p_route: string;
          p_session_id: string;
          p_user: string;
        };
        Returns: undefined;
      };
      learning_presentations_public: {
        Args: { p_session_id: string; p_user: string };
        Returns: Json;
      };
      learning_retention_sweep: {
        Args: { p_limit?: number; p_now?: string };
        Returns: Json;
      };
      learning_review_answer: {
        Args: {
          p_grader: Json;
          p_grading: Json;
          p_response_ms: number;
          p_session_id: string;
          p_user: string;
        };
        Returns: Json;
      };
      learning_review_candidates: {
        Args: { p_lang: string; p_now: string; p_tz: string; p_user: string };
        Returns: Json;
      };
      learning_review_content: {
        Args: { p_session_id: string; p_user: string };
        Returns: Json;
      };
      learning_review_coverage: { Args: { p_lang: string }; Returns: Json };
      learning_review_prepare: {
        Args: { p_session_id: string; p_tz: string; p_user: string };
        Returns: Json;
      };
      learning_review_retry: {
        Args: {
          p_grader: Json;
          p_grading: Json;
          p_response_ms: number;
          p_session_id: string;
          p_user: string;
        };
        Returns: Json;
      };
      learning_review_words: {
        Args: { p_session_id: string; p_user: string };
        Returns: Json;
      };
      learning_route_usage: { Args: { p_since: string }; Returns: Json };
      learning_run_job: {
        Args: { p_job: string; p_limit?: number };
        Returns: Json;
      };
      learning_session_presentations: {
        Args: { p_session_id: string; p_user: string };
        Returns: Json;
      };
      learning_session_verdicts: {
        Args: { p_session_id: string };
        Returns: Json;
      };
      learning_start_basic_review: {
        Args: {
          p_lang: string;
          p_orders: Json;
          p_plan: Json;
          p_session_id: string;
          p_tz: string;
          p_user: string;
        };
        Returns: Json;
      };
      learning_start_focus_review: {
        Args: {
          p_lang: string;
          p_orders: Json;
          p_plan: Json;
          p_session_id: string;
          p_tz: string;
          p_user: string;
        };
        Returns: Json;
      };
      learning_start_lesson: {
        Args: {
          p_lesson_id: string;
          p_orders: Json;
          p_session_id: string;
          p_user: string;
        };
        Returns: Json;
      };
      learning_start_review: {
        Args: {
          p_lang: string;
          p_orders: Json;
          p_plan: Json;
          p_session_id: string;
          p_tz: string;
          p_user: string;
        };
        Returns: Json;
      };
      learning_submit_graded: {
        Args: {
          p_attempts: Json;
          p_grader: Json;
          p_gradings: Json;
          p_lesson_id: string;
          p_session_id: string;
          p_started_at: string;
          p_time_zone: string;
          p_user: string;
        };
        Returns: Json;
      };
      learning_submit_review_graded: {
        Args: {
          p_attempts: Json;
          p_grader: Json;
          p_gradings: Json;
          p_session_id: string;
          p_started_at: string;
          p_time_zone: string;
          p_user: string;
        };
        Returns: Json;
      };
      leave_human_queue: { Args: never; Returns: Json };
      lesson_star_totals: { Args: { p_user_id: string }; Returns: Json };
      live_battle_invites: { Args: { p_user: string }; Returns: Json };
      local_day_start: { Args: { p_time_zone: string }; Returns: string };
      mastery_assist_factor: { Args: { p_assists: Json }; Returns: number };
      mastery_beta_cf: {
        Args: { p_a: number; p_b: number; p_x: number };
        Returns: number;
      };
      mastery_beta_inc: {
        Args: { p_a: number; p_b: number; p_x: number };
        Returns: number;
      };
      mastery_beta_p5: { Args: { p_a: number; p_b: number }; Returns: number };
      mastery_display_count: {
        Args: { p_lang: string; p_user: string };
        Returns: number;
      };
      mastery_eval: {
        Args: {
          p_as_of: string;
          p_concept: string;
          p_dim: string;
          p_user: string;
        };
        Returns: Json;
      };
      mastery_evidence_rows: {
        Args: {
          p_as_of: string;
          p_concept: string;
          p_dim: string;
          p_user: string;
        };
        Returns: Json;
      };
      mastery_exposures: {
        Args: { p_concept: string; p_user: string };
        Returns: {
          at: string;
          attempt_id: number;
        }[];
      };
      mastery_ln_gamma: { Args: { p_z: number }; Returns: number };
      mastery_process_queue: {
        Args: { p_as_of?: string; p_limit?: number };
        Returns: number;
      };
      mastery_process_queue_safe: {
        Args: { p_as_of?: string; p_limit: number };
        Returns: Json;
      };
      mastery_recompute_unit: {
        Args: {
          p_as_of: string;
          p_concept: string;
          p_dim: string;
          p_user: string;
        };
        Returns: Json;
      };
      mastery_rung_for_mode: {
        Args: { p_dim: string; p_mode: string };
        Returns: string;
      };
      mission_progress: {
        Args: { p_day: string; p_mission: string; p_tz: string; p_user: string };
        Returns: number;
      };
      new_challenge_code: { Args: never; Returns: string };
      online_window: { Args: never; Returns: string };
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
      ping_presence: { Args: never; Returns: Json };
      poly_config: { Args: never; Returns: Json };
      poly_credit: {
        Args: {
          p_amount: number;
          p_reason: string;
          p_ref: string;
          p_user: string;
        };
        Returns: number;
      };
      poly_debit: {
        Args: {
          p_amount: number;
          p_reason: string;
          p_ref: string;
          p_user: string;
        };
        Returns: number;
      };
      poly_earnings: {
        Args: { p_tz: string; p_user: string };
        Returns: {
          amount: number;
          reason: string;
          ref: string;
        }[];
      };
      push_tokens_per_user: { Args: never; Returns: number };
      queue_window: { Args: { p_joined_at: string }; Returns: number };
      ranked_rating_after: {
        Args: {
          p_mult: number;
          p_opponent: number;
          p_placed: boolean;
          p_rating: number;
          p_score: number;
        };
        Returns: number;
      };
      rating_after: {
        Args: {
          p_games: number;
          p_opponent: number;
          p_rating: number;
          p_score: number;
        };
        Returns: number;
      };
      record_learning_session: {
        Args: {
          p_client?: Json;
          p_grader: Json;
          p_gradings: Json;
          p_session_id: string;
          p_started_at: string;
          p_time_zone: string;
          p_user: string;
        };
        Returns: Json;
      };
      register_push_token: {
        Args: { p_platform: string; p_token: string };
        Returns: undefined;
      };
      remove_friend: { Args: { p_user_id: string }; Returns: undefined };
      repair_streak: { Args: { p_time_zone: string }; Returns: Json };
      report_avatar: {
        Args: { p_reason: string; p_user_id: string };
        Returns: Json;
      };
      respond_friend_request: {
        Args: { p_accept: boolean; p_user_id: string };
        Returns: string;
      };
      review_item_candidates: {
        Args: { p_lang: string };
        Returns: {
          concept_id: string;
          dimension: string;
          grading_mode_id: string;
          input_modality: string;
          item_id: string;
          item_type: string;
          item_version_id: number;
          option_count: number;
          option_set_id: number;
          rung: string;
        }[];
      };
      review_item_known: {
        Args: { p_item: string; p_mode: string; p_user: string };
        Returns: boolean;
      };
      review_plan_expired: {
        Args: { p_now: string; p_session_id: string };
        Returns: boolean;
      };
      review_session_complete: {
        Args: { p_session_id: string };
        Returns: boolean;
      };
      rush_common_unit_ids: {
        Args: { p_apis?: number[]; p_language: string; p_players: string[] };
        Returns: string[];
      };
      rush_label: { Args: { p_translation: string }; Returns: string };
      rush_levels: { Args: { p_rating: number }; Returns: string[] };
      rush_my_unit_ids: { Args: { p_language_code: string }; Returns: string[] };
      rush_points: {
        Args: { p_correct: boolean; p_elapsed_ms: number };
        Returns: number;
      };
      rush_questions:
        | { Args: { p_count: number; p_language: string }; Returns: Json }
        | {
            Args: { p_count: number; p_language: string; p_rating: number };
            Returns: Json;
          };
      rush_streak_bonus: { Args: { p_streak: number }; Returns: number };
      rush_writing: { Args: { p_rating: number }; Returns: boolean };
      rush_writing_for: {
        Args: { p_language: string; p_rating: number };
        Returns: boolean;
      };
      safe_time_zone: { Args: { p_time_zone: string }; Returns: string };
      search_players: {
        Args: { p_query: string };
        Returns: {
          avatar_id: string;
          avatar_path: string;
          frame_id: string;
          placed: boolean;
          rating: number;
          state: string;
          user_id: string;
          username: string;
        }[];
      };
      send_friend_request: { Args: { p_user_id: string }; Returns: string };
      set_target_language: {
        Args: { p_language: string };
        Returns: {
          avatar_id: string;
          avatar_path: string | null;
          background_id: string | null;
          created_at: string;
          daily_goal_minutes: number;
          display_name: string | null;
          frame_id: string | null;
          id: string;
          onboarding_completed_at: string | null;
          public_code: string;
          region: string | null;
          start_level: string;
          target_language: string;
          tutorial_completed_at: string | null;
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
      settle_battle: {
        Args: { p_battle_id: string; p_players: Json; p_status: string };
        Returns: Json;
      };
      settle_bot_match: {
        Args: {
          p_answered: number;
          p_battle_id: string;
          p_correct: number;
          p_forfeit: boolean;
          p_score: number;
          p_user_id: string;
        };
        Returns: Json;
      };
      settle_human_match: { Args: { p_battle_id: string }; Returns: Json };
      silent_decline_window: { Args: never; Returns: string };
      srs_apply_me_hint: {
        Args: { p_limit?: number; p_now?: string };
        Returns: number;
      };
      srs_config: { Args: never; Returns: Json };
      srs_unit_errors_window_complete: {
        Args: { p_now: string; p_source: string; p_user: string };
        Returns: boolean;
      };
      srs_unit_full_errors: {
        Args: {
          p_concept: string;
          p_dim: string;
          p_now: string;
          p_user: string;
        };
        Returns: number;
      };
      srs_user_lock: { Args: { p_tz: string; p_user: string }; Returns: string };
      srs_v2_al19_evaluate: {
        Args: {
          p_day: string;
          p_exclude: string;
          p_lang: string;
          p_t: string;
          p_tz: string;
          p_user: string;
        };
        Returns: {
          al19_active: boolean;
          enter_streak: number;
          entered_at: string | null;
          entered_on: string | null;
          entries: number;
          evaluated_at: string | null;
          evaluated_on: string;
          exit_streak: number;
          imax_effective: number;
          init_source: string;
          language_code: string;
          last_ipu: number | null;
          last_load45: number | null;
          last_trend_ratio: number | null;
          measured_days: number;
          measured_since: string;
          measured_since_date: string;
          planner_version: string;
          user_id: string;
        };
        SetofOptions: {
          from: '*';
          to: 'srs_user_debt_state';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      srs_v2_apply_session: {
        Args: { p_origin: string; p_session_id: string; p_tz: string };
        Returns: Json;
      };
      srs_v2_assist_factor4: { Args: { p_assists: Json }; Returns: number };
      srs_v2_conversion_stability: {
        Args: { p_imax: number; p_stage: number };
        Returns: number;
      };
      srs_v2_debt_init: {
        Args: { p_lang: string; p_source: string; p_tz: string; p_user: string };
        Returns: undefined;
      };
      srs_v2_enabled: { Args: never; Returns: boolean };
      srs_v2_enqueue_migrations: { Args: never; Returns: number };
      srs_v2_ipu: { Args: { p_lang: string; p_user: string }; Returns: number };
      srs_v2_ladder: { Args: { p_dim: string }; Returns: string[] };
      srs_v2_migrate_user: {
        Args: { p_tz?: string; p_user: string };
        Returns: Json;
      };
      srs_v2_migrate_user_locked: {
        Args: { p_tz: string; p_user: string };
        Returns: Json;
      };
      srs_v2_observations: {
        Args: { p_session_id: string };
        Returns: {
          concept_id: string;
          dimension: string;
          is_correct: boolean;
          item_id: string;
          language_code: string;
          level: string;
          n_t: number;
          ord: number;
          q4: number;
          r: number;
          word_id: string;
        }[];
      };
      srs_v2_quantize: { Args: { p_a4: number; p_s4: number }; Returns: number };
      srs_v2_recompute_check: {
        Args: { p_user: string };
        Returns: {
          concept_id: string;
          dimension: string;
          field: string;
          recomputed: string;
          stored: string;
        }[];
      };
      srs_v2_relative_rung: {
        Args: { p_dim: string; p_rung: string; p_target: string };
        Returns: number;
      };
      srs_v2_repair_sweep: { Args: never; Returns: number };
      srs_v2_rung_for_mode: {
        Args: { p_dim: string; p_mode: string };
        Returns: string;
      };
      srs_v2_s4: { Args: { p_verdict: string }; Returns: number };
      srs_v2_session_result: {
        Args: { p_session_id: string; p_user: string };
        Returns: Json;
      };
      srs_v2_session_source: { Args: { p_session_id: string }; Returns: string };
      srs_v2_start_rung: { Args: { p_dim: string }; Returns: string };
      srs_v2_target_rung: {
        Args: { p_dim: string; p_level: string };
        Returns: string;
      };
      srs_v2_unit_hash: {
        Args: { p_concept: string; p_dim: string; p_user: string };
        Returns: number;
      };
      srs_v2_update: {
        Args: {
          p_d: number;
          p_dim: string;
          p_due: string;
          p_exposures: number;
          p_f: number;
          p_has_row: boolean;
          p_imax: number;
          p_lapses: number;
          p_last_a: number;
          p_last_zm: number;
          p_n: number;
          p_next_day: string;
          p_obs: Json;
          p_r: number;
          p_relearning: boolean;
          p_rung: string;
          p_s: number;
          p_t: string;
          p_t_last: string;
          p_target: string;
          p_w: number[];
        };
        Returns: Record<string, unknown>;
      };
      srs_v2_user_rhythm100: {
        Args: { p_exclude: string; p_user: string };
        Returns: number;
      };
      start_friendly_battle: {
        Args: {
          p_battle_id: string;
          p_code: string;
          p_guest: string;
          p_host: string;
          p_protocol_version: number;
        };
        Returns: undefined;
      };
      start_battle: {
        Args: {
          p_battle_id: string;
          p_language_code: string;
          p_player1: string;
          p_player2: string;
          p_protocol_version: number;
        };
        Returns: undefined;
      };
      start_bot_battle: {
        Args: {
          p_battle_id: string;
          p_bot_avatar_id: string;
          p_bot_name: string;
          p_bot_rating: number;
          p_language_code: string;
          p_player: string;
          p_protocol_version: number;
        };
        Returns: undefined;
      };
      start_bot_battle_v2: {
        Args: {
          p_battle_id: string;
          p_bot_avatar_id: string;
          p_bot_name: string;
          p_bot_rating: number;
          p_language_code: string;
          p_player: string;
          p_protocol_version: number;
          p_rated: boolean;
        };
        Returns: Json;
      };
      start_bot_match: { Args: never; Returns: Json };
      streak_ending: {
        Args: { p_day: string; p_user: string };
        Returns: number;
      };
      streak_repair_offer: {
        Args: { p_tz: string; p_user: string };
        Returns: Json;
      };
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
      submit_learning_session_v1: {
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
      sync_polys: { Args: { p_time_zone: string }; Returns: Json };
      unblock_user: { Args: { p_user_id: string }; Returns: undefined };
      unregister_push_token: { Args: { p_token: string }; Returns: undefined };
      word_of_the_day: {
        Args: { p_date: string; p_language?: string };
        Returns: {
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
          romanization: string | null;
          tags: string[];
          text: string;
          translation_es: string;
          unit_id: string;
          updated_at: string;
        }[];
        SetofOptions: {
          from: '*';
          to: 'words';
          isOneToOne: false;
          isSetofReturn: true;
        };
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
