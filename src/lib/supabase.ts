import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import type { Database } from './database.types';
import { env } from './env';
import { sessionStorage } from './secureStorage';

/**
 * Cliente Supabase con la clave pública (anon). Toda la autorización real vive en RLS
 * y en funciones del backend. null si faltan variables de entorno.
 */
export const supabase: SupabaseClient<Database> | null = env
  ? createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        storage: sessionStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        // PKCE: los enlaces de confirmación y recuperación traen un ?code= que se canjea en la app.
        flowType: 'pkce',
      },
    })
  : null;

export function requireSupabase(): SupabaseClient<Database> {
  if (!supabase)
    throw new Error('Supabase no está configurado (faltan variables EXPO_PUBLIC_SUPABASE_*).');
  return supabase;
}

// Refrescar el token sólo con la app en primer plano (recomendación de Supabase para React Native).
if (supabase && Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
