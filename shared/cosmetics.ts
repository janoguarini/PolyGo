/**
 * Catálogo de cosméticos: skins (avatares), marcos y fondos del perfil. Fuente única: la base lo
 * replica en public.cosmetic_items (migraciones 20261101025309_polys_shop y
 * 20261222120000_profile_customization) y supabase/tests/shop.test.mjs compara ambos lados. El arte
 * de cada ítem se resuelve en la app (src/features/cosmetics/assets.ts y visuals.ts).
 *
 * Reglas:
 * - Sólo lo que tiene `source: 'polys'` tiene precio. Lo exclusivo (Plus, invitaciones) jamás se
 *   vende, ni por Polys ni por dinero.
 * - `available: false` = falta el arte aprobado: el ítem existe en el catálogo pero no se vende ni se
 *   equipa hasta que llegue (docs/PROFILE_CUSTOMIZATION.md, "Assets faltantes").
 * - `retired: true` = catálogo anterior (dibujado en código): no se vende ni se muestra, pero quien
 *   lo tiene lo conserva y lo puede seguir usando.
 * - Los marcos competitivos no son ítems sueltos: `frame_rank` se dibuja con el tier del ELO real del
 *   jugador (shared/ranking.ts). Nunca se elige un rango: sale del rating.
 */

export type CosmeticKind = 'skin' | 'frame' | 'background';
export type CosmeticRarity =
  'free' | 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'exclusive' | 'limited';
/** Cómo se consigue. */
export type CosmeticSource =
  'free' | 'polys' | 'season' | 'premium' | 'plus' | 'referral' | 'event' | 'rank';

export interface CosmeticItem {
  id: string;
  kind: CosmeticKind;
  rarity: CosmeticRarity;
  name: string;
  /** Precio en Polys; null = no se vende por Polys. */
  price: number | null;
  source: CosmeticSource;
  /** El arte está aprobado y en la app. */
  available: boolean;
  /** Catálogo anterior: sólo lo ve quien lo tiene. */
  retired: boolean;
}

type Row = readonly [
  id: string,
  kind: CosmeticKind,
  rarity: CosmeticRarity,
  name: string,
  price: number | null,
  source: CosmeticSource,
  flag?: 'missing-art' | 'retired',
];

// Orden = cosmetic_items.position.
const ROWS = [
  // ---------- skins ----------
  ['skin-classic', 'skin', 'free', 'Clásico', null, 'free'],
  ['skin-ninja', 'skin', 'common', 'Ninja', 250, 'polys'],
  ['skin-explorer', 'skin', 'common', 'Explorador', 250, 'polys'],
  ['skin-academic', 'skin', 'rare', 'Académico', 500, 'polys'],
  ['skin-samurai', 'skin', 'epic', 'Samurái', 850, 'polys', 'missing-art'],
  ['skin-cyber', 'skin', 'epic', 'Cyber', 850, 'polys'],
  ['skin-guardian', 'skin', 'legendary', 'Guardián', 1300, 'polys', 'missing-art'],
  ['skin-omega', 'skin', 'mythic', 'Omega', 2000, 'polys', 'missing-art'],
  [
    'skin-social-explorer',
    'skin',
    'exclusive',
    'Explorador Social',
    null,
    'referral',
    'missing-art',
  ],
  ['skin-team-legend', 'skin', 'exclusive', 'Leyenda del Equipo', null, 'referral', 'missing-art'],
  // ---------- marcos ----------
  ['frame_basic', 'frame', 'free', 'Básico', null, 'free'],
  ['frame_leaf', 'frame', 'common', 'Hoja', 150, 'polys'],
  ['frame_stellar', 'frame', 'common', 'Estelar', 250, 'polys'],
  ['frame_crystal', 'frame', 'rare', 'Cristal', 400, 'polys'],
  ['frame_elite', 'frame', 'epic', 'Élite', 700, 'polys'],
  ['frame_diamond', 'frame', 'legendary', 'Diamante', 1100, 'polys', 'missing-art'],
  ['frame_master', 'frame', 'legendary', 'Maestro', 1500, 'polys'],
  ['frame_plus', 'frame', 'exclusive', 'PolyGo Plus', null, 'plus'],
  ['frame_referral_legend', 'frame', 'exclusive', 'Leyenda', null, 'referral', 'missing-art'],
  ['frame_event', 'frame', 'limited', 'Evento', null, 'event', 'missing-art'],
  ['frame_rank', 'frame', 'free', 'Marco de rango', null, 'rank'],
  // ---------- fondos ----------
  ['bg_solid', 'background', 'free', 'Sólido', null, 'free'],
  ['bg_mountain', 'background', 'common', 'Montaña', 150, 'polys'],
  ['bg_forest', 'background', 'common', 'Bosque', 200, 'polys'],
  ['bg_aurora', 'background', 'rare', 'Aurora', 400, 'polys'],
  ['bg_neon', 'background', 'epic', 'Ciudad Neón', 650, 'polys'],
  ['bg_space', 'background', 'epic', 'Espacial', 850, 'polys'],
  ['bg_temple', 'background', 'legendary', 'Templo', 1100, 'polys', 'missing-art'],
  ['bg_galaxy', 'background', 'legendary', 'Galaxia', 1400, 'polys'],
  ['bg_dimension', 'background', 'mythic', 'Dimensión', 2000, 'polys'],
  // ---------- skins de la colección 2 (posiciones 32–36) ----------
  ['skin-aztec', 'skin', 'epic', 'Azteca', 850, 'polys'],
  ['skin-dragon', 'skin', 'legendary', 'Dragón', 1300, 'polys'],
  ['skin-king', 'skin', 'legendary', 'Rey', 1300, 'polys'],
  ['skin-titan', 'skin', 'mythic', 'Titán', 2000, 'polys'],
  ['skin-diamond', 'skin', 'exclusive', 'Diamante', null, 'plus'],
  // ---------- catálogo anterior: retirado, lo conserva quien lo tiene ----------
  ['frame_mint', 'frame', 'common', 'Menta', 150, 'polys', 'retired'],
  ['frame_coral', 'frame', 'common', 'Coral', 150, 'polys', 'retired'],
  ['frame_sky', 'frame', 'common', 'Cielo', 200, 'polys', 'retired'],
  ['frame_sun', 'frame', 'common', 'Sol', 250, 'polys', 'retired'],
  ['frame_sunset', 'frame', 'rare', 'Atardecer', 400, 'polys', 'retired'],
  ['frame_ocean', 'frame', 'rare', 'Océano', 450, 'polys', 'retired'],
  ['frame_aurora', 'frame', 'rare', 'Aurora clásica', 600, 'polys', 'retired'],
  ['frame_galaxy', 'frame', 'epic', 'Galaxia clásica', 1000, 'polys', 'retired'],
  ['frame_fire', 'frame', 'epic', 'Fuego', 1200, 'polys', 'retired'],
  ['frame_crown', 'frame', 'epic', 'Realeza', 1500, 'polys', 'retired'],
  ['frame_legend', 'frame', 'legendary', 'Leyenda de temporada', null, 'season', 'retired'],
  ['frame_founder', 'frame', 'legendary', 'Fundador', null, 'premium', 'retired'],
  ['bg_ocean', 'background', 'common', 'Mar profundo', 200, 'polys', 'retired'],
  ['bg_wine', 'background', 'common', 'Vino', 250, 'polys', 'retired'],
  ['bg_sunset', 'background', 'rare', 'Atardecer clásico', 500, 'polys', 'retired'],
  ['bg_gold', 'background', 'legendary', 'Oro', null, 'season', 'retired'],
] as const satisfies readonly Row[];

export type CosmeticId = (typeof ROWS)[number][0];
export type SkinId = Extract<CosmeticId, `skin-${string}`>;

/** Catálogo completo en orden de presentación. */
export const COSMETICS: readonly (CosmeticItem & { id: CosmeticId })[] = ROWS.map((r) => {
  const row = r as Row;
  return {
    id: r[0],
    kind: row[1],
    rarity: row[2],
    name: row[3],
    price: row[4],
    source: row[5],
    available: row[6] !== 'missing-art',
    retired: row[6] === 'retired',
  };
});

export const RARITY_LABEL: Record<CosmeticRarity, string> = {
  free: 'Gratis',
  common: 'Común',
  rare: 'Rara',
  epic: 'Épica',
  legendary: 'Legendaria',
  mythic: 'Mítica',
  exclusive: 'Exclusiva',
  limited: 'Limitada',
};

export function cosmeticById(id: string | null | undefined): CosmeticItem | undefined {
  return COSMETICS.find((c) => c.id === id);
}

export function isSkinId(id: string | null | undefined): id is SkinId {
  return typeof id === 'string' && id.startsWith('skin-');
}

/** Lo que se muestra en Personalizar: lo vigente y, de lo retirado, sólo lo propio. */
export function visibleCosmetics(kind: CosmeticKind, owned: ReadonlySet<string>): CosmeticItem[] {
  return COSMETICS.filter((c) => c.kind === kind && (!c.retired || owned.has(c.id)));
}

/** Se gana, no se compra: Plus, invitaciones, eventos, rango o temporada. */
export function isEarnedOnly(item: CosmeticItem): boolean {
  return item.price === null && item.source !== 'free';
}

/** Cómo se consigue un ítem (etiqueta corta). */
export function cosmeticSourceLabel(source: CosmeticSource): string {
  switch (source) {
    case 'free':
      return 'Gratis';
    case 'polys':
      return 'En la tienda';
    case 'season':
      return 'Premio de temporada';
    case 'premium':
      return 'Edición especial';
    case 'plus':
      return 'Exclusivo PolyGo Plus';
    case 'referral':
      return 'Recompensa de invitación';
    case 'event':
      return 'Recompensa de evento';
    case 'rank':
      return 'Progresión competitiva';
  }
}

/** Requisito de invitaciones de cada premio (shared/referrals.ts lo usa para los hitos). */
export const REFERRAL_ITEM_MILESTONE: Partial<Record<CosmeticId, number>> = {
  'skin-social-explorer': 5,
  'skin-team-legend': 10,
  frame_referral_legend: 10,
};

/** Qué tiene que hacer el jugador para conseguir un ítem que todavía no puede usar. */
export function unlockHint(item: CosmeticItem): string {
  if (!item.available) return 'Arte en producción: llega pronto.';
  switch (item.source) {
    case 'free':
      return 'Disponible para todos.';
    case 'polys':
      return `Desbloquealo por ${item.price} Polys.`;
    case 'plus':
      return 'Disponible para suscriptores PolyGo Plus.';
    case 'referral': {
      const n = REFERRAL_ITEM_MILESTONE[item.id as CosmeticId] ?? 10;
      return `Conseguí ${n} amigos válidos para desbloquearlo.`;
    }
    case 'rank':
      return 'Ganá una partida ranked para estrenar tu marco de rango.';
    case 'event':
      return 'Se gana en un evento por tiempo limitado.';
    case 'season':
      return 'Fue un premio de temporada.';
    case 'premium':
      return 'Edición especial.';
  }
}
