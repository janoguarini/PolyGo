import { deviceStorage } from '@/lib/secureStorage';
import { requireSupabase } from '@/lib/supabase';

/** Token de Expo registrado desde este teléfono (para darlo de baja al cerrar sesión). */
const TOKEN_KEY = 'polygo.pushToken';

export function rememberPushToken(token: string) {
  return deviceStorage.setItem(TOKEN_KEY, token);
}

/** Al cerrar sesión: este teléfono deja de recibir avisos de esa cuenta. Nunca falla. */
export async function unregisterPush() {
  try {
    const token = await deviceStorage.getItem(TOKEN_KEY);
    if (!token) return;
    await requireSupabase().rpc('unregister_push_token', { p_token: token });
    await deviceStorage.removeItem(TOKEN_KEY);
  } catch {
    // Sin red: el token queda activo hasta que otra cuenta lo registre o Expo lo dé por muerto.
  }
}
