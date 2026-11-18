import { CURRICULUM_API, clientPlatform, installedAppVersion } from '@/lib/clientInfo';
import { requireSupabase } from '@/lib/supabase';

import { parseCompatibility, unavailableCompatibility, type ClientCompatibility } from './status';

/**
 * Pregunta al servidor si esta build está admitida (app_client_status). Funciona con y sin sesión.
 * Nunca lanza: si el backend no responde o no tiene la función, devuelve `unavailable`.
 */
export async function fetchClientCompatibility(): Promise<ClientCompatibility> {
  const version = installedAppVersion();
  try {
    const { data, error } = await requireSupabase().rpc('app_client_status', {
      p_app_version: version,
      p_platform: clientPlatform(),
      p_curriculum_api: CURRICULUM_API,
    });
    if (error) return unavailableCompatibility(version, CURRICULUM_API);
    return parseCompatibility(data, version, CURRICULUM_API);
  } catch {
    return unavailableCompatibility(version, CURRICULUM_API);
  }
}
