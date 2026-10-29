import type { TierId } from '@shared/ranking';

/** Colores de cada tier: [claro, oscuro, acento]. Centralizado para emblemas, barras y textos. */
export const TIER_COLORS: Record<TierId, { light: string; dark: string; accent: string }> = {
  bronze: { light: '#E3A57A', dark: '#7A4122', accent: '#F2C4A3' },
  silver: { light: '#DDE3EE', dark: '#6B7487', accent: '#FFFFFF' },
  gold: { light: '#F7D774', dark: '#A8740F', accent: '#FFF1B8' },
  platinum: { light: '#7FE7DA', dark: '#1F7F7A', accent: '#D4FFF8' },
  emerald: { light: '#5EEAA1', dark: '#0F7A49', accent: '#C9FFE2' },
  diamond: { light: '#9CC9FF', dark: '#3550C8', accent: '#E4F0FF' },
  master: { light: '#D49BFF', dark: '#6A1FB8', accent: '#F3DEFF' },
  grandmaster: { light: '#FF8A8A', dark: '#A3132E', accent: '#FFE07A' },
};
