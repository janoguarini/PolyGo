import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.EXPO_PUBLIC_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export const configError =
  !url || !anonKey
    ? 'Faltan EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY en el .env de la raíz del repo.'
    : null;

/**
 * Cliente con la anon key: lo que se ve depende sólo de la sesión del usuario, y cada RPC del panel
 * vuelve a verificar en la base que sea janitogap con MFA. La sesión vive en sessionStorage: se
 * pierde al cerrar la pestaña (no queda un token guardado en el disco del navegador).
 */
export const supabase = createClient(url ?? 'http://invalid.local', anonKey ?? 'missing', {
  auth: {
    storage: window.sessionStorage,
    storageKey: 'polygo-admin-auth',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
