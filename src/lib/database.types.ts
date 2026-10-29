/**
 * Alias de filas usados por la app, sobre los tipos generados por Supabase (database.generated.ts).
 * Los CHECK de Postgres llegan como `string`; los valores permitidos que la UI elige se tipan aparte.
 */
import type { Database, Tables } from './database.generated';

export type { Database };

export type ProfileRow = Tables<'profiles'>;
export type UserSettingsRow = Tables<'user_settings'>;
export type PlayerRatingRow = Tables<'player_ratings'>;
export type RatingHistoryRow = Tables<'rating_history'>;
export type SeasonRow = Tables<'seasons'>;
export type LanguageRow = Tables<'languages'>;

/** Valores del CHECK de user_settings.profile_visibility. */
export type ProfileVisibility = 'public' | 'friends' | 'private';
