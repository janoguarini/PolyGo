/**
 * Variables públicas de la app (EXPO_PUBLIC_*): qué hace cada una y cuándo es obligatoria.
 * Fuente única para src/lib/env.ts (validación en la app) y scripts/check-env.ts (antes de una build).
 * Se empaquetan dentro de la app: nunca una clave secreta.
 */
export interface PublicEnvVar {
  name: string;
  /** always: la app no arranca sin ella. production: obligatoria para publicar en tiendas. */
  required: 'always' | 'production';
  /** Las URL tienen que ser https en producción (http sólo en desarrollo local). */
  kind: 'url' | 'publishable-key';
  description: string;
}

export const PUBLIC_ENV: readonly PublicEnvVar[] = [
  {
    name: 'EXPO_PUBLIC_SUPABASE_URL',
    required: 'always',
    kind: 'url',
    description: 'URL del proyecto Supabase (https://<ref>.supabase.co).',
  },
  {
    name: 'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    required: 'always',
    kind: 'publishable-key',
    description:
      'Clave pública (anon o sb_publishable_…). Nunca la service_role ni una sb_secret_….',
  },
  {
    name: 'EXPO_PUBLIC_BATTLE_SERVER_URL',
    required: 'production',
    kind: 'url',
    description:
      'Servidor de partidas Ranked (https://…), en eas.json para preview/production. Vacía o inválida = Ranked deshabilitado con aviso (en desarrollo, vacía = Ranked legacy por Supabase).',
  },
  {
    name: 'EXPO_PUBLIC_PRIVACY_POLICY_URL',
    required: 'production',
    kind: 'url',
    description: 'Política de privacidad pública (exigida por las tiendas). Hoy en eas.json.',
  },
];

/** true si el valor parece una clave secreta (service_role o sb_secret_…), que nunca va en la app. */
export function looksLikeSecretKey(value: string): boolean {
  if (value.startsWith('sb_secret_')) return true;
  const payload = value.split('.')[1];
  if (!payload) return false;
  try {
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // atob existe en Hermes y en Node; sin él no se puede comprobar (no se acusa).
    if (typeof globalThis.atob !== 'function') return false;
    const json = JSON.parse(globalThis.atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, '='))) as {
      role?: unknown;
    };
    return json.role === 'service_role';
  } catch {
    return false;
  }
}

export interface PublicEnvProblem {
  name: string;
  problem: 'missing' | 'invalid' | 'secret';
}

function validUrl(value: string, httpsOnly: boolean): boolean {
  try {
    const url = new URL(value);
    return httpsOnly
      ? url.protocol === 'https:'
      : url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Estado de EXPO_PUBLIC_BATTLE_SERVER_URL, independiente de Supabase: una URL mala del servidor de
 * partidas nunca invalida el resto de la configuración. En producción sólo vale https.
 */
export type BattleServerConfig =
  { status: 'configured'; url: string } | { status: 'missing' } | { status: 'invalid' };

export function resolveBattleServer(
  raw: string | undefined,
  { production }: { production: boolean },
): BattleServerConfig {
  const value = raw?.trim() ?? '';
  if (!value) return { status: 'missing' };
  return validUrl(value, production) ? { status: 'configured', url: value } : { status: 'invalid' };
}

/**
 * Qué sistema atiende Ranked y Práctica (los desafíos con amigos no dependen de esto):
 *   server    el servidor de partidas (autoridad del resultado).
 *   legacy    las partidas por Supabase. SÓLO en desarrollo y sólo si la URL falta: una build de
 *             preview/production nunca cae en silencio al sistema legacy.
 *   disabled  Ranked deshabilitado con aviso (URL inválida, o falta fuera de desarrollo).
 */
export type RankedBackend = 'server' | 'legacy' | 'disabled';

export function rankedBackendFor(
  battleServer: BattleServerConfig,
  { production }: { production: boolean },
): RankedBackend {
  if (battleServer.status === 'configured') return 'server';
  if (battleServer.status === 'missing' && !production) return 'legacy';
  return 'disabled';
}

/** Problemas de una configuración (sólo nombres, nunca valores). */
export function checkPublicEnv(
  values: Record<string, string | undefined>,
  { production }: { production: boolean },
): PublicEnvProblem[] {
  const problems: PublicEnvProblem[] = [];
  for (const v of PUBLIC_ENV) {
    const value = values[v.name]?.trim() ?? '';
    if (!value) {
      if (v.required === 'always' || production)
        problems.push({ name: v.name, problem: 'missing' });
      continue;
    }
    if (v.kind === 'publishable-key') {
      if (looksLikeSecretKey(value)) problems.push({ name: v.name, problem: 'secret' });
      else if (value.length < 20) problems.push({ name: v.name, problem: 'invalid' });
    } else if (!validUrl(value, production)) {
      problems.push({ name: v.name, problem: 'invalid' });
    }
  }
  return problems;
}
