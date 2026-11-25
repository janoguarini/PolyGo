import { botIdentityByName } from '@shared/botIdentities';

/** Cómo se dibuja un jugador: avatar, marco y fondo de perfil. */
export interface PlayerLook {
  avatarId: string | null | undefined;
  frameId: string | null | undefined;
  /** Sólo los rivales de práctica traen fondo (los perfiles reales no lo mandan en la partida). */
  backgroundId: string | null;
}

/**
 * La presentación de un jugador. Un rival de práctica (bot) con identidad del catálogo
 * (shared/botIdentities.ts) se dibuja con su avatar, marco y fondo, reconocido por su nombre; así es
 * el mismo en el lobby, la partida, los resultados y el historial. Cualquier otro jugador, tal cual.
 */
export function playerLook(
  player:
    | {
        isBot?: boolean | null;
        username?: string | null;
        avatarId?: string | null;
        frameId?: string | null;
      }
    | null
    | undefined,
): PlayerLook {
  const identity = player?.isBot ? botIdentityByName(player.username) : undefined;
  if (identity) {
    return {
      avatarId: identity.avatarId,
      frameId: identity.frameId,
      backgroundId: identity.backgroundId,
    };
  }
  return { avatarId: player?.avatarId, frameId: player?.frameId, backgroundId: null };
}
