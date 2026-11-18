import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Nivel de compatibilidad curricular de esta build (fase C.5, 20261115120000_client_compatibility.sql).
 *
 *   0  builds anteriores: no declaran nada y dibujan el camino por posición.
 *   1  esta build: dibuja el camino con my_curriculum_route (rutas curriculares versionadas).
 *
 * Subirlo SÓLO cuando la app aprenda a representar algo que una build anterior no puede (y registrar
 * el requisito de la ruta nueva en curriculum_route_client_requirements). Es un entero fijo en el
 * código: no depende de la versión de la tienda ni de expo-updates.
 */
export const CURRICULUM_API = 1;

/** Cabecera que el servidor lee en cada request (request.headers de PostgREST). */
export const CURRICULUM_API_HEADER = 'x-polygo-curriculum-api';

/** Metadato del alta (auth.users.raw_user_meta_data) con el nivel del cliente que crea la cuenta. */
export const CURRICULUM_API_SIGNUP_KEY = 'polygo_curriculum_api';

/**
 * Versión instalada: la `version` de app.json embebida en la build (Constants.expoConfig). Sin
 * expo-updates el JS siempre es el de la build, así que coincide con la versión publicada en la tienda.
 * null si no está disponible.
 */
export function installedAppVersion(): string | null {
  const version = Constants.expoConfig?.version;
  return typeof version === 'string' && version.trim() !== '' ? version.trim() : null;
}

export type ClientPlatform = 'ios' | 'android' | 'web';

export function clientPlatform(): ClientPlatform | null {
  return Platform.OS === 'ios' || Platform.OS === 'android' || Platform.OS === 'web'
    ? Platform.OS
    : null;
}

/** Cabeceras globales del cliente Supabase (PostgREST, RPC y Edge Functions). */
export function clientHeaders(): Record<string, string> {
  return { [CURRICULUM_API_HEADER]: String(CURRICULUM_API) };
}
