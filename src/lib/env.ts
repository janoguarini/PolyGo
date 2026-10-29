import { z } from 'zod';

/**
 * Sólo variables públicas (EXPO_PUBLIC_*): se empaquetan dentro de la app.
 * Nunca poner aquí la service_role key de Supabase.
 */
const schema = z.object({
  supabaseUrl: z.url(),
  supabaseAnonKey: z.string().min(20),
  battleServerUrl: z.url().optional(),
  privacyPolicyUrl: z.url().optional(),
});

// Expo sólo inyecta EXPO_PUBLIC_* cuando se accede con la ruta literal completa.
const raw = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  battleServerUrl: process.env.EXPO_PUBLIC_BATTLE_SERVER_URL || undefined,
  privacyPolicyUrl: process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL || undefined,
};

const parsed = schema.safeParse(raw);

export const env = parsed.success ? parsed.data : null;

/** Lista de variables faltantes o inválidas (sin valores) para mostrar en la pantalla de configuración. */
export const envProblems: string[] = parsed.success
  ? []
  : parsed.error.issues.map((issue) => {
      const key = String(issue.path[0]);
      const name = {
        supabaseUrl: 'EXPO_PUBLIC_SUPABASE_URL',
        supabaseAnonKey: 'EXPO_PUBLIC_SUPABASE_ANON_KEY',
        battleServerUrl: 'EXPO_PUBLIC_BATTLE_SERVER_URL',
        privacyPolicyUrl: 'EXPO_PUBLIC_PRIVACY_POLICY_URL',
      }[key];
      return name ?? key;
    });
