/**
 * Compatibilidad visual entre avatares (skins), marcos y fondos. Fuente única: la base la replica en
 * public.cosmetic_compatibility (migración 20261222120300_cosmetic_compatibility) y
 * supabase/tests/cosmeticCompatibility.test.mjs compara ambos lados. La base es la que decide: un
 * trigger en profiles impide guardar una combinación incompatible aunque se llame directo.
 *
 * Reglas (iguales en cosmeticCompatible() de la base):
 * 1. Sólo se filtran los ítems TEMÁTICOS: los que se venden por Polys en el catálogo vigente. Lo
 *    gratuito (Básico, Sólido), lo ganado (marco de rango, Plus, invitaciones, eventos, temporada) y
 *    lo retirado es universal: nunca se le esconde a nadie algo que ya ganó o compró antes de esto.
 * 2. Un avatar sin lista (Clásico, los zorros y animales básicos, la foto propia y las skins que
 *    todavía no tienen arte) es NEUTRO: combina con todo.
 * 3. Una skin con lista sólo admite, de lo temático, lo que figura en su lista.
 *
 * Para sumar un personaje: agregar su skin en shared/cosmetics.ts, su entrada acá y las mismas filas
 * en una migración nueva (insert into public.cosmetic_compatibility). Para un marco o fondo nuevo:
 * sumarlo a la lista de cada skin con la que combine.
 *
 * Criterio artístico (sobre el arte real, docs/PROFILE_XP_LEVELS.md §6): Ninja = noche, hojas,
 * filos, sakura y templo; Explorador = aventura al aire libre, montaña, bosque, ruinas; Académico =
 * laureles y oro, astronomía y conocimiento antiguo; Cyber = neón, energía, cristal tecnológico,
 * espacio.
 */

import { cosmeticById, type CosmeticId, type CosmeticItem, type SkinId } from './cosmetics';

export interface SkinCompatibility {
  frames: readonly CosmeticId[];
  backgrounds: readonly CosmeticId[];
}

export const SKIN_COMPATIBILITY: Partial<Record<SkinId, SkinCompatibility>> = {
  'skin-ninja': {
    frames: ['frame_leaf', 'frame_crystal', 'frame_elite'],
    backgrounds: ['bg_forest', 'bg_mountain', 'bg_neon', 'bg_temple'],
  },
  'skin-explorer': {
    frames: ['frame_leaf', 'frame_stellar', 'frame_crystal'],
    backgrounds: ['bg_mountain', 'bg_forest', 'bg_aurora', 'bg_dimension'],
  },
  'skin-academic': {
    frames: ['frame_leaf', 'frame_stellar', 'frame_master'],
    backgrounds: ['bg_aurora', 'bg_space', 'bg_galaxy', 'bg_dimension'],
  },
  'skin-cyber': {
    frames: ['frame_stellar', 'frame_crystal', 'frame_elite'],
    backgrounds: ['bg_neon', 'bg_space', 'bg_galaxy', 'bg_dimension'],
  },
};

/** Ítems que dependen del avatar: los que se venden por Polys en el catálogo vigente. */
export function isThemedCosmetic(item: CosmeticItem): boolean {
  return item.kind !== 'skin' && item.source === 'polys' && !item.retired;
}

/** Lista de compatibilidad del avatar, o null si es neutro (combina con todo). */
export function compatibilityFor(avatarId: string | null | undefined): SkinCompatibility | null {
  if (!avatarId) return null;
  return SKIN_COMPATIBILITY[avatarId as SkinId] ?? null;
}

/** ¿Se puede usar este marco/fondo con este avatar? `null` (sin marco o sin fondo) siempre se puede. */
export function isCosmeticCompatible(
  avatarId: string | null | undefined,
  itemId: string | null | undefined,
): boolean {
  if (!itemId) return true;
  const item = cosmeticById(itemId);
  if (!item || !isThemedCosmetic(item)) return true;
  const list = compatibilityFor(avatarId);
  if (!list) return true;
  const allowed = item.kind === 'frame' ? list.frames : list.backgrounds;
  return (allowed as readonly string[]).includes(item.id);
}

/**
 * Lo que queda puesto al cambiar de avatar: se mantiene si sigue siendo compatible; si no, vuelve
 * al predeterminado (null). Es lo mismo que hace el trigger de la base.
 */
export function keepIfCompatible(avatarId: string, itemId: string | null): string | null {
  return isCosmeticCompatible(avatarId, itemId) ? itemId : null;
}

/**
 * Skins con arte que combinan con un marco/fondo temático (para mostrar "Combina con…" en la
 * tienda). Vacío = universal: combina con todo.
 */
export function skinsCompatibleWith(itemId: string): string[] {
  const item = cosmeticById(itemId);
  if (!item || !isThemedCosmetic(item)) return [];
  return Object.entries(SKIN_COMPATIBILITY)
    .filter(([, c]) =>
      ((item.kind === 'frame' ? c!.frames : c!.backgrounds) as readonly string[]).includes(item.id),
    )
    .map(([skin]) => cosmeticById(skin)?.name ?? skin);
}
