import { rankedBackend } from '@/lib/env';

/**
 * Disponibilidad de Ranked y Práctica en esta build (fuente única para la pestaña Ranked y la pantalla
 * de batalla). Sale de la configuración pública (ver rankedBackendFor en shared/publicEnv.ts):
 *   server    servidor de partidas.
 *   legacy    sólo en desarrollo sin URL: partidas por Supabase.
 *   disabled  falta o es inválida EXPO_PUBLIC_BATTLE_SERVER_URL fuera de desarrollo, o es inválida:
 *             se avisa y no se ofrece jugar. Nunca se reemplaza en silencio por el sistema legacy.
 *
 * Los desafíos con amigos no dependen de esto: van por Supabase y no mueven el ELO.
 */
export const rankedAvailability = rankedBackend;

export const rankedDisabled = rankedAvailability === 'disabled';

// El título del aviso (antes RANKED_UNAVAILABLE_TITLE) está en strings.ts: rankedUnavailableTitle.
