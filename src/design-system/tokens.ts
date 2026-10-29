/**
 * Tokens de diseño de Polygo. Toda la UI debe consumir estos valores;
 * no hardcodear colores ni espaciados en los componentes.
 */

export const palette = {
  ink950: '#07060F',
  ink900: '#0B0A1A',
  ink850: '#110F24',
  ink800: '#17142F',
  ink700: '#221E42',
  ink600: '#2F2A58',
  ink500: '#4A4478',
  ink400: '#6B6599',
  ink300: '#8D88B5',
  ink200: '#B9B5D9',
  ink100: '#E7E5F7',
  white: '#FFFFFF',
  violet600: '#6D28D9',
  violet500: '#7C3AED',
  violet400: '#8B5CF6',
  violet300: '#A78BFA',
  cyan400: '#22D3EE',
  blue400: '#60A5FA',
  green400: '#34D399',
  green500: '#10B981',
  green700: '#047857',
  red400: '#F87171',
  red500: '#EF4444',
  red700: '#B91C1C',
  gold400: '#F5C542',
  gold500: '#E0A82E',
  orange400: '#FB923C',
} as const;

export const colors = {
  background: palette.ink900,
  backgroundDeep: palette.ink950,
  surface: palette.ink850,
  surfaceRaised: palette.ink800,
  surfaceHighlight: palette.ink700,
  border: palette.ink700,
  borderStrong: palette.ink600,
  text: palette.ink100,
  textStrong: palette.white,
  textMuted: palette.ink300,
  // ≥ 3:1 sobre superficies (placeholders, íconos inactivos). Para texto informativo, textMuted.
  textSubtle: palette.ink400,
  primary: palette.violet500,
  primaryBright: palette.violet400,
  primarySoft: palette.violet300,
  primaryPressed: palette.violet600,
  onPrimary: palette.white,
  info: palette.cyan400,
  infoAlt: palette.blue400,
  success: palette.green400,
  successStrong: palette.green500,
  /** Fondo sólido con texto blanco encima (≥ 4.5:1). */
  successDeep: palette.green700,
  danger: palette.red400,
  dangerStrong: palette.red500,
  dangerDeep: palette.red700,
  gold: palette.gold400,
  goldStrong: palette.gold500,
  streak: palette.orange400,
  overlay: 'rgba(7, 6, 15, 0.72)',
} as const;

export const gradients = {
  primary: [palette.violet400, palette.violet600] as const,
  hero: ['#2A1A5E', palette.ink900] as const,
  ranked: ['#3B1D80', '#151036'] as const,
  gold: [palette.gold400, palette.gold500] as const,
  screen: [palette.ink850, palette.ink900, palette.ink950] as const,
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '800', letterSpacing: -0.5 },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '800', letterSpacing: -0.3 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 1.4 },
  stat: { fontSize: 28, lineHeight: 32, fontWeight: '800', letterSpacing: -0.5 },
} as const;

export type TypographyVariant = keyof typeof typography;

export const elevation = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  glow: {
    shadowColor: palette.violet400,
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
} as const;

export const durations = {
  fast: 120,
  base: 220,
  slow: 400,
  celebrate: 900,
} as const;

/** Tamaño mínimo de área táctil (accesibilidad). */
export const MIN_TOUCH = 44;
