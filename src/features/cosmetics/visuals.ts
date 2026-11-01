import type { CosmeticId, CosmeticRarity } from '@shared/cosmetics';

/**
 * Cómo se dibuja cada cosmético. El catálogo (precio, rareza) está en shared/cosmetics.ts; acá sólo
 * colores y adornos, todo en código (sin imágenes).
 */

export type FrameOrnament = 'dots' | 'stars' | 'flames' | 'crown' | 'laurel' | 'gems';

export interface FrameStyle {
  /** Degradado del aro, de arriba a abajo. */
  colors: readonly [string, string, ...string[]];
  ornament?: FrameOrnament;
  /** Color de los adornos (por defecto blanco). */
  accent?: string;
}

export type BackdropPattern = 'stars' | 'grid' | 'waves' | 'sparkles';

export interface BackgroundStyle {
  colors: readonly [string, string, ...string[]];
  pattern?: BackdropPattern;
  /** Color del dibujo de fondo. */
  accent?: string;
}

type FrameId = Extract<CosmeticId, `frame_${string}`>;
type BackgroundId = Extract<CosmeticId, `bg_${string}`>;

export const FRAME_STYLES: Record<FrameId, FrameStyle> = {
  frame_mint: { colors: ['#6EE7B7', '#059669'] },
  frame_coral: { colors: ['#FDA4AF', '#E11D48'] },
  frame_sky: { colors: ['#7DD3FC', '#0284C7'] },
  frame_sun: { colors: ['#FDE68A', '#F59E0B'] },
  frame_sunset: { colors: ['#FDBA74', '#F43F5E', '#A855F7'], ornament: 'dots' },
  frame_ocean: { colors: ['#67E8F9', '#2563EB', '#1E3A8A'], ornament: 'dots' },
  frame_aurora: { colors: ['#86EFAC', '#22D3EE', '#A78BFA'], ornament: 'dots' },
  frame_galaxy: { colors: ['#C4B5FD', '#7C3AED', '#312E81'], ornament: 'stars' },
  frame_fire: { colors: ['#FDE047', '#F97316', '#DC2626'], ornament: 'flames', accent: '#F97316' },
  frame_crown: { colors: ['#FEF08A', '#EAB308', '#A16207'], ornament: 'crown', accent: '#FACC15' },
  frame_legend: {
    colors: ['#FDE68A', '#F472B6', '#8B5CF6', '#22D3EE'],
    ornament: 'laurel',
    accent: '#FACC15',
  },
  frame_founder: { colors: ['#F5F3FF', '#A78BFA', '#4C1D95'], ornament: 'gems', accent: '#E9D5FF' },
};

export const BACKGROUND_STYLES: Record<BackgroundId, BackgroundStyle> = {
  bg_forest: { colors: ['#166534', '#0B1F17'], pattern: 'waves', accent: '#4ADE80' },
  bg_ocean: { colors: ['#075985', '#0A1A33'], pattern: 'waves', accent: '#38BDF8' },
  bg_wine: { colors: ['#881337', '#2A0E1A'] },
  bg_sunset: { colors: ['#EA580C', '#BE185D', '#3B0764'], pattern: 'sparkles', accent: '#FDE68A' },
  bg_neon: { colors: ['#4C1D95', '#0F172A'], pattern: 'grid', accent: '#E879F9' },
  bg_galaxy: { colors: ['#312E81', '#3B0764', '#0B0A1F'], pattern: 'stars', accent: '#FFFFFF' },
  bg_gold: { colors: ['#CA8A04', '#713F12', '#1C1305'], pattern: 'sparkles', accent: '#FEF08A' },
};

export function frameStyle(id: string | null | undefined): FrameStyle | null {
  return id && id in FRAME_STYLES ? FRAME_STYLES[id as FrameId] : null;
}

export function backgroundStyle(id: string | null | undefined): BackgroundStyle | null {
  return id && id in BACKGROUND_STYLES ? BACKGROUND_STYLES[id as BackgroundId] : null;
}

/** Color de cada rareza (etiquetas y bordes en la tienda). */
export const RARITY_COLORS: Record<CosmeticRarity, string> = {
  common: '#94A3B8',
  rare: '#38BDF8',
  epic: '#C084FC',
  legendary: '#FACC15',
};
