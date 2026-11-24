import type { CosmeticRarity } from '@shared/cosmetics';

/**
 * Cosméticos dibujados en código: el aro Básico, el fondo Sólido y el catálogo anterior (retirado,
 * pero quien lo compró lo sigue usando). Lo nuevo es arte en imágenes: ver ./assets.ts.
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

export const FRAME_STYLES: Record<string, FrameStyle> = {
  // Gratis: aro violeta limpio.
  frame_basic: { colors: ['#C4B5FD', '#7C3AED', '#4C1D95'] },
  // ---- retirados ----
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

/** Fondo violeta que se ve cuando el jugador no tiene ninguno puesto (y el gratis, Sólido). */
export const DEFAULT_BACKGROUND: BackgroundStyle = {
  colors: ['#3B1D80', '#25145A', '#151036'],
  pattern: 'waves',
  accent: '#A78BFA',
};

export const BACKGROUND_STYLES: Record<string, BackgroundStyle> = {
  bg_solid: DEFAULT_BACKGROUND,
  // ---- retirados ----
  bg_ocean: { colors: ['#075985', '#0A1A33'], pattern: 'waves', accent: '#38BDF8' },
  bg_wine: { colors: ['#881337', '#2A0E1A'] },
  bg_sunset: { colors: ['#EA580C', '#BE185D', '#3B0764'], pattern: 'sparkles', accent: '#FDE68A' },
  bg_gold: { colors: ['#CA8A04', '#713F12', '#1C1305'], pattern: 'sparkles', accent: '#FEF08A' },
};

export function frameStyle(id: string | null | undefined): FrameStyle | null {
  return id && Object.hasOwn(FRAME_STYLES, id) ? FRAME_STYLES[id]! : null;
}

export function backgroundStyle(id: string | null | undefined): BackgroundStyle | null {
  return id && Object.hasOwn(BACKGROUND_STYLES, id) ? BACKGROUND_STYLES[id]! : null;
}

/**
 * Identidad de cada rareza: color principal (etiqueta, borde) y degradado del brillo de la tarjeta.
 * Mítica combina magenta y cian; Exclusiva es el violeta-celeste de Plus y las invitaciones.
 */
export const RARITY_COLORS: Record<CosmeticRarity, string> = {
  free: '#B4A7D6',
  common: '#4ADE80',
  rare: '#38BDF8',
  epic: '#C084FC',
  legendary: '#FACC15',
  mythic: '#F472B6',
  exclusive: '#A5B4FC',
  limited: '#FB923C',
};

export const RARITY_GLOW: Record<CosmeticRarity, readonly [string, string]> = {
  free: ['rgba(180,167,214,0.10)', 'rgba(180,167,214,0.02)'],
  common: ['rgba(74,222,128,0.18)', 'rgba(74,222,128,0.02)'],
  rare: ['rgba(56,189,248,0.20)', 'rgba(56,189,248,0.02)'],
  epic: ['rgba(192,132,252,0.24)', 'rgba(192,132,252,0.03)'],
  legendary: ['rgba(250,204,21,0.26)', 'rgba(250,204,21,0.03)'],
  mythic: ['rgba(244,114,182,0.30)', 'rgba(34,211,238,0.10)'],
  exclusive: ['rgba(139,92,246,0.32)', 'rgba(56,189,248,0.10)'],
  limited: ['rgba(251,146,60,0.24)', 'rgba(251,146,60,0.03)'],
};
