/**
 * Identidades de los rivales de práctica de Ranked (los bots de shared/bots.ts): nombre y apellido
 * ficticios, avatar, marco y fondo. Sólo es presentación: el rating, la dificultad, el matchmaking y
 * la liquidación no las miran.
 *
 * El servidor de partidas elige una al crear el bot (pickBotIdentity) y la manda como `username` del
 * rival; la base la guarda en battle_players.bot_name (máx. 20 caracteres). El cliente la reconoce por
 * ese nombre (botIdentityByName) en el lobby, la partida, los resultados y el historial, así que es la
 * misma en todos lados sin campos nuevos en el protocolo. Un nombre de usuario real nunca coincide:
 * USERNAME_REGEX (shared/profile.ts) sólo admite minúsculas, números y "_", y estos nombres tienen
 * mayúsculas y un espacio.
 *
 * Fase 1: sólo arte que ya está en la app (avatares de shared/profile.ts AVATARS, skins de la
 * colección, marcos con arte y fondos de la tienda). Los ids se validan en
 * src/features/battle/__tests__/botIdentities.test.ts. Archivo autocontenido (sin imports) porque el
 * servidor de partidas lo copia tal cual.
 */

/** Estilo visual de la identidad (para elegir arte en próximas fases). */
export type BotIdentityStyle =
  'cyberpunk' | 'futuristic' | 'sport' | 'minimal' | 'fantasy' | 'esports';

/** Personalidad de juego para iteraciones futuras. Hoy NO cambia cómo juega el bot. */
export type BotPersonality = 'fast' | 'precise' | 'steady' | 'risky';

export interface BotIdentity {
  /** Estable: no cambiar un id publicado. */
  id: string;
  /** Nombre y apellido; único en el catálogo y de 20 caracteres como máximo. */
  name: string;
  /** Un id de AVATARS (shared/profile.ts) o una skin con arte ('skin-…'). */
  avatarId: string;
  /** Un marco con arte (shared/cosmetics.ts). */
  frameId: string;
  /** Un fondo de perfil (shared/cosmetics.ts). */
  backgroundId: string;
  style: BotIdentityStyle;
  personality: BotPersonality;
}

type Row = readonly [
  id: string,
  name: string,
  avatarId: string,
  frameId: string,
  backgroundId: string,
  style: BotIdentityStyle,
  personality: BotPersonality,
];

const ROWS: readonly Row[] = [
  ['fede-martinez', 'Fede Martínez', 'bolt', 'frame_elite', 'bg_galaxy', 'esports', 'fast'],
  [
    'lucas-fernandez',
    'Lucas Fernández',
    'lion-yellow',
    'frame_master',
    'bg_aurora',
    'sport',
    'steady',
  ],
  [
    'tomas-herrera',
    'Tomás Herrera',
    'skin-cyber',
    'frame_crystal',
    'bg_neon',
    'cyberpunk',
    'risky',
  ],
  [
    'nicolas-castro',
    'Nicolás Castro',
    'panda-violet',
    'frame_stellar',
    'bg_space',
    'futuristic',
    'precise',
  ],
  ['mateo-gonzalez', 'Mateo González', 'dog-red', 'frame_leaf', 'bg_forest', 'sport', 'steady'],
  [
    'santiago-romero',
    'Santiago Romero',
    'skin-ninja',
    'frame_elite',
    'bg_dimension',
    'fantasy',
    'risky',
  ],
  ['franco-diaz', 'Franco Díaz', 'cat-red', 'frame_basic', 'bg_mountain', 'minimal', 'precise'],
  ['bruno-acosta', 'Bruno Acosta', 'lion-red', 'frame_master', 'bg_neon', 'sport', 'steady'],
  ['thiago-lopez', 'Thiago López', 'dog-violet', 'frame_stellar', 'bg_neon', 'cyberpunk', 'fast'],
  [
    'joaquin-torres',
    'Joaquín Torres',
    'lion-violet',
    'frame_crystal',
    'bg_galaxy',
    'esports',
    'precise',
  ],
  [
    'valentina-ruiz',
    'Valentina Ruiz',
    'cat-violet',
    'frame_stellar',
    'bg_aurora',
    'futuristic',
    'fast',
  ],
  ['camila-sosa', 'Camila Sosa', 'crown', 'frame_leaf', 'bg_mountain', 'minimal', 'steady'],
  ['martina-silva', 'Martina Silva', 'skin-explorer', 'frame_elite', 'bg_forest', 'sport', 'risky'],
  [
    'lucia-benitez',
    'Lucía Benítez',
    'panda-yellow',
    'frame_basic',
    'bg_forest',
    'minimal',
    'precise',
  ],
  [
    'sofia-medina',
    'Sofía Medina',
    'skin-academic',
    'frame_master',
    'bg_dimension',
    'fantasy',
    'precise',
  ],
  [
    'julieta-rios',
    'Julieta Ríos',
    'panda-red',
    'frame_crystal',
    'bg_space',
    'futuristic',
    'steady',
  ],
  [
    'agustina-vega',
    'Agustina Vega',
    'skin-classic',
    'frame_stellar',
    'bg_mountain',
    'sport',
    'fast',
  ],
  ['emma-navarro', 'Emma Navarro', 'cat-yellow', 'frame_master', 'bg_galaxy', 'esports', 'steady'],
  [
    'isabella-molina',
    'Isabella Molina',
    'skin-cyber',
    'frame_stellar',
    'bg_space',
    'futuristic',
    'risky',
  ],
  ['renata-paz', 'Renata Paz', 'flame', 'frame_elite', 'bg_neon', 'cyberpunk', 'precise'],
  [
    'benjamin-ortiz',
    'Benjamín Ortiz',
    'skin-academic',
    'frame_basic',
    'bg_aurora',
    'minimal',
    'steady',
  ],
  ['facundo-rojas', 'Facundo Rojas', 'lion-red', 'frame_leaf', 'bg_mountain', 'sport', 'risky'],
  ['ignacio-suarez', 'Ignacio Suárez', 'lion-yellow', 'frame_elite', 'bg_space', 'sport', 'fast'],
  [
    'delfina-correa',
    'Delfina Correa',
    'panda-violet',
    'frame_master',
    'bg_galaxy',
    'futuristic',
    'steady',
  ],
  [
    'maximiliano-gil',
    'Maximiliano Gil',
    'skin-ninja',
    'frame_master',
    'bg_galaxy',
    'fantasy',
    'risky',
  ],
  [
    'paula-dominguez',
    'Paula Domínguez',
    'dog-yellow',
    'frame_crystal',
    'bg_aurora',
    'minimal',
    'fast',
  ],
  ['gael-morales', 'Gael Morales', 'cat-yellow', 'frame_basic', 'bg_solid', 'minimal', 'precise'],
  ['abril-cabrera', 'Abril Cabrera', 'flame', 'frame_crystal', 'bg_dimension', 'cyberpunk', 'fast'],
  [
    'lautaro-peralta',
    'Lautaro Peralta',
    'bolt',
    'frame_stellar',
    'bg_dimension',
    'fantasy',
    'steady',
  ],
  [
    'milagros-aguirre',
    'Milagros Aguirre',
    'skin-classic',
    'frame_master',
    'bg_space',
    'esports',
    'steady',
  ],
];

export const BOT_IDENTITIES: readonly BotIdentity[] = ROWS.map(
  ([id, name, avatarId, frameId, backgroundId, style, personality]) => ({
    id,
    name,
    avatarId,
    frameId,
    backgroundId,
    style,
    personality,
  }),
);

const BY_NAME = new Map(BOT_IDENTITIES.map((identity) => [identity.name, identity]));

/** La identidad de un rival de práctica por su nombre (lo que llega como username o bot_name). */
export function botIdentityByName(name: string | null | undefined): BotIdentity | undefined {
  return name ? BY_NAME.get(name) : undefined;
}

/**
 * Elige la identidad de un bot nuevo: al azar entre las del catálogo, sin repetir la última que vio
 * este jugador (`previousId`) y sin el mismo avatar que tiene puesto el jugador (`playerAvatarId`),
 * para que los dos lados de la partida nunca se vean iguales.
 */
export function pickBotIdentity(
  random: () => number,
  {
    previousId,
    playerAvatarId,
  }: { previousId?: string | null; playerAvatarId?: string | null } = {},
): BotIdentity {
  const fresh = BOT_IDENTITIES.filter((identity) => identity.id !== previousId);
  const distinct = fresh.filter((identity) => identity.avatarId !== playerAvatarId);
  const pool = distinct.length > 0 ? distinct : fresh;
  return pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))]!;
}
