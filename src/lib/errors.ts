import { getStrings } from '@/i18n';

import { errorStrings } from './strings';

/**
 * Traduce errores de Supabase/red a mensajes para el usuario (en el idioma de la interfaz) sin
 * filtrar detalles internos. Los textos viven en ./strings.ts, por código estable del servidor.
 */

// Orden fijo de búsqueda de los códigos de las RPC (el del español; los dos idiomas tienen las mismas claves).
const RPC_CODES = Object.keys(errorStrings.es.rpc) as (keyof typeof errorStrings.es.rpc)[];

export function toUserMessage(error: unknown): string {
  const t = getStrings(errorStrings);
  if (!error || typeof error !== 'object') return t.unexpected;
  const e = error as { code?: unknown; message?: unknown; name?: unknown };
  const code = typeof e.code === 'string' ? e.code : undefined;
  const message = typeof e.message === 'string' ? e.message : '';

  const auth = t.auth as Record<string, string>;
  if (code && Object.prototype.hasOwnProperty.call(auth, code)) return auth[code]!;
  for (const key of RPC_CODES) {
    if (message.includes(key)) return t.rpc[key];
  }
  if (/network|fetch|Failed to fetch/i.test(message) || e.name === 'AuthRetryableFetchError') {
    return t.network;
  }
  return t.unexpectedRetry;
}
