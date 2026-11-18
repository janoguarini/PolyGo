import {
  looksLikeSecretKey,
  rankedBackendFor,
  resolveBattleServer,
  type BattleServerConfig,
  type RankedBackend,
} from '@shared/publicEnv';
import { z } from 'zod';

/**
 * Sólo variables públicas (EXPO_PUBLIC_*): se empaquetan dentro de la app.
 * Nunca poner aquí la service_role key de Supabase.
 *
 * Supabase se valida por separado del resto: es lo único sin lo que la app no puede arrancar. Una
 * URL opcional mala (servidor de partidas, política de privacidad) apaga sólo esa función.
 */
const supabaseSchema = z.object({
  supabaseUrl: z.url(),
  // Una clave secreta empaquetada en la app es una filtración: se rechaza aunque «funcione».
  supabaseAnonKey: z
    .string()
    .min(20)
    .refine((key) => !looksLikeSecretKey(key)),
});

/** Build de preview/production (sin servidor de desarrollo): https obligatorio y sin Ranked legacy. */
const production = !__DEV__;

// Expo sólo inyecta EXPO_PUBLIC_* cuando se accede con la ruta literal completa.
const parsed = supabaseSchema.safeParse({
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
});

/** Estado del servidor de partidas: nunca invalida la configuración de Supabase. */
export const battleServer: BattleServerConfig = resolveBattleServer(
  process.env.EXPO_PUBLIC_BATTLE_SERVER_URL,
  { production },
);

/** Quién atiende Ranked y Práctica en esta build (ver rankedBackendFor). */
export const rankedBackend: RankedBackend = rankedBackendFor(battleServer, { production });

const privacy = z.url().safeParse(process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL || undefined);

export const env = parsed.success
  ? {
      ...parsed.data,
      battleServerUrl: battleServer.status === 'configured' ? battleServer.url : undefined,
      // Inválida = no se muestra el enlace (igual que vacía); no bloquea la app.
      privacyPolicyUrl: privacy.success ? privacy.data : undefined,
    }
  : null;

/**
 * Variables de Supabase faltantes o inválidas (sin valores) para la pantalla de configuración. Sólo
 * éstas bloquean la app; el servidor de partidas se informa en Ranked (battleServer).
 */
export const envProblems: string[] = parsed.success
  ? []
  : [
      ...new Set(
        parsed.error.issues.map((issue) =>
          issue.path[0] === 'supabaseUrl'
            ? 'EXPO_PUBLIC_SUPABASE_URL'
            : 'EXPO_PUBLIC_SUPABASE_ANON_KEY',
        ),
      ),
    ];
