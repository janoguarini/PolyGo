import { io, type Socket } from 'socket.io-client';

import {
  PROTOCOL_VERSION,
  type ClientToServerEvents,
  type ErrorCode,
  type HandshakeAuth,
  type ServerToClientEvents,
} from '@shared/protocol';

import { getStrings } from '@/i18n';
import { CURRICULUM_API } from '@/lib/clientInfo';
import { env } from '@/lib/env';
import { supabase } from '@/lib/supabase';

import { rankedAvailability } from './availability';
import { battleErrorStrings } from './strings';

export type BattleSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/** Ranked y Práctica van por el servidor de partidas (URL válida; https fuera de desarrollo). */
export const battleServerConfigured =
  rankedAvailability === 'server' && Boolean(env?.battleServerUrl);

const KNOWN_CODES: readonly ErrorCode[] = [
  'unauthorized',
  'protocol_mismatch',
  'onboarding_required',
  'language_unavailable',
  'server_error',
];

/** Conexión al servidor de partidas. El token se pide en cada (re)conexión: así viaja siempre vigente. */
export function connectBattleSocket(): BattleSocket {
  if (!env?.battleServerUrl) throw new Error('EXPO_PUBLIC_BATTLE_SERVER_URL no está configurada');
  return io(env.battleServerUrl, {
    transports: ['websocket'],
    reconnectionDelay: 500,
    reconnectionDelayMax: 3_000,
    timeout: 8_000,
    auth: (cb) => {
      void (async () => {
        const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
        const auth: HandshakeAuth = {
          token: data.session?.access_token ?? '',
          protocolVersion: PROTOCOL_VERSION,
          // Fase C.8: el nivel curricular de esta build (el servidor lo usa como 0 si falta).
          curriculumApi: CURRICULUM_API,
        };
        cb(auth);
      })();
    },
  });
}

/** El servidor rechaza el handshake con el código como mensaje; cualquier otra cosa es red. */
export function connectErrorCode(error: Error): ErrorCode | 'connection' {
  return (KNOWN_CODES as readonly string[]).includes(error.message)
    ? (error.message as ErrorCode)
    : 'connection';
}

/** Mensaje para mostrar de un código de error, en el idioma de la interfaz (ver strings.ts). */
export function battleErrorMessage(code: ErrorCode | 'connection'): string {
  return getStrings(battleErrorStrings)[code];
}
