import { io, type Socket } from 'socket.io-client';

import {
  PROTOCOL_VERSION,
  type ClientToServerEvents,
  type ErrorCode,
  type ServerToClientEvents,
} from '@shared/protocol';

import { env } from '@/lib/env';
import { supabase } from '@/lib/supabase';

export type BattleSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const battleServerConfigured = Boolean(env?.battleServerUrl);

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
        cb({ token: data.session?.access_token ?? '', protocolVersion: PROTOCOL_VERSION });
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

export const ERROR_MESSAGES: Record<ErrorCode | 'connection', string> = {
  connection: 'No pudimos conectar con el servidor de partidas. Revisá tu conexión.',
  unauthorized: 'Tu sesión expiró. Volvé a iniciar sesión.',
  protocol_mismatch: 'Hay una versión nueva de Polygo. Actualizá la app para jugar.',
  onboarding_required: 'Completá tu perfil antes de jugar.',
  language_unavailable: 'Ranked todavía no está disponible para tu idioma.',
  already_in_battle: 'Ya estás en una partida.',
  not_in_battle: 'La partida ya no existe.',
  stale_question: 'Esa pregunta ya pasó.',
  battle_over: 'La partida terminó.',
  invalid_payload: 'Algo salió mal con esa respuesta.',
  server_error: 'El servidor de partidas tuvo un problema. Probá de nuevo.',
  match_rate_limited: 'Jugaste muchas partidas hoy. Volvé mañana para seguir subiendo.',
  challenge_not_found: 'No encontramos ese código. Revisá que esté bien escrito.',
  challenge_expired: 'Ese desafío venció o se canceló. Pedile a tu amigo uno nuevo.',
  challenge_taken: 'Alguien más ya entró a ese desafío.',
  own_challenge: 'Ese es tu propio desafío: compartilo con un amigo.',
  host_gone: 'Tu amigo ya no está esperando. Pedile que vuelva a abrir el desafío.',
  language_mismatch: 'Tu amigo está aprendiendo otro idioma, así que no pueden jugar juntos.',
};
