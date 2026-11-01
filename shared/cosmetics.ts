/**
 * Catálogo de cosméticos: marcos del avatar y fondos del perfil. Fuente única: la base lo replica en
 * public.cosmetic_items (migración de la tienda) y un test compara ambos lados. El dibujo de cada
 * ítem vive en la app (src/features/cosmetics/visuals.ts).
 *
 * Legendarios: price = null. No se compran con Polys; se ganan por temporada o se venderán con
 * plata real (`source` dice cómo se consigue).
 */

export type CosmeticKind = 'frame' | 'background';
export type CosmeticRarity = 'common' | 'rare' | 'epic' | 'legendary';
/** Cómo se consigue un ítem que no se compra con Polys. */
export type CosmeticSource = 'polys' | 'season' | 'premium';

export interface CosmeticItem {
  id: string;
  kind: CosmeticKind;
  rarity: CosmeticRarity;
  name: string;
  /** Precio en Polys; null = no se vende por Polys. */
  price: number | null;
  source: CosmeticSource;
}

export const COSMETICS = [
  // ---------- marcos ----------
  { id: 'frame_mint', kind: 'frame', rarity: 'common', name: 'Menta', price: 150, source: 'polys' },
  {
    id: 'frame_coral',
    kind: 'frame',
    rarity: 'common',
    name: 'Coral',
    price: 150,
    source: 'polys',
  },
  { id: 'frame_sky', kind: 'frame', rarity: 'common', name: 'Cielo', price: 200, source: 'polys' },
  { id: 'frame_sun', kind: 'frame', rarity: 'common', name: 'Sol', price: 250, source: 'polys' },
  {
    id: 'frame_sunset',
    kind: 'frame',
    rarity: 'rare',
    name: 'Atardecer',
    price: 400,
    source: 'polys',
  },
  { id: 'frame_ocean', kind: 'frame', rarity: 'rare', name: 'Océano', price: 450, source: 'polys' },
  {
    id: 'frame_aurora',
    kind: 'frame',
    rarity: 'rare',
    name: 'Aurora',
    price: 600,
    source: 'polys',
  },
  {
    id: 'frame_galaxy',
    kind: 'frame',
    rarity: 'epic',
    name: 'Galaxia',
    price: 1000,
    source: 'polys',
  },
  { id: 'frame_fire', kind: 'frame', rarity: 'epic', name: 'Fuego', price: 1200, source: 'polys' },
  {
    id: 'frame_crown',
    kind: 'frame',
    rarity: 'epic',
    name: 'Realeza',
    price: 1500,
    source: 'polys',
  },
  {
    id: 'frame_legend',
    kind: 'frame',
    rarity: 'legendary',
    name: 'Leyenda',
    price: null,
    source: 'season',
  },
  {
    id: 'frame_founder',
    kind: 'frame',
    rarity: 'legendary',
    name: 'Fundador',
    price: null,
    source: 'premium',
  },
  // ---------- fondos del perfil ----------
  {
    id: 'bg_forest',
    kind: 'background',
    rarity: 'common',
    name: 'Bosque',
    price: 200,
    source: 'polys',
  },
  {
    id: 'bg_ocean',
    kind: 'background',
    rarity: 'common',
    name: 'Mar profundo',
    price: 200,
    source: 'polys',
  },
  {
    id: 'bg_wine',
    kind: 'background',
    rarity: 'common',
    name: 'Vino',
    price: 250,
    source: 'polys',
  },
  {
    id: 'bg_sunset',
    kind: 'background',
    rarity: 'rare',
    name: 'Atardecer',
    price: 500,
    source: 'polys',
  },
  { id: 'bg_neon', kind: 'background', rarity: 'rare', name: 'Neón', price: 600, source: 'polys' },
  {
    id: 'bg_galaxy',
    kind: 'background',
    rarity: 'epic',
    name: 'Galaxia',
    price: 1200,
    source: 'polys',
  },
  {
    id: 'bg_gold',
    kind: 'background',
    rarity: 'legendary',
    name: 'Oro',
    price: null,
    source: 'season',
  },
] as const satisfies readonly CosmeticItem[];

export type CosmeticId = (typeof COSMETICS)[number]['id'];

export const RARITY_LABEL: Record<CosmeticRarity, string> = {
  common: 'Común',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Legendario',
};

export function cosmeticById(id: string | null | undefined): CosmeticItem | undefined {
  return COSMETICS.find((c) => c.id === id);
}

/** Cómo se consigue un ítem que no está a la venta por Polys. */
export function cosmeticSourceLabel(source: CosmeticSource): string {
  switch (source) {
    case 'polys':
      return 'En la tienda';
    case 'season':
      return 'Premio de temporada';
    case 'premium':
      return 'Exclusivo · Próximamente';
  }
}
