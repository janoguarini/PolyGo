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

// ---------------------------------------------------------------------------------------------
// Temas. `colors`, `gradients` y `elevation` leen SIEMPRE el tema activo (ver theme.tsx): los
// estilos se recalculan por tema con themedStyles() y los componentes se vuelven a dibujar con
// useTheme(). El resto de los tokens (espaciado, tipografía, colores del camino) no cambian.

export type ColorScheme = 'dark' | 'light';

const darkColors = {
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
  /** Fondo translúcido de chips y recuadros dentro de tarjetas de marca. */
  inset: 'rgba(7, 6, 15, 0.45)',
  /** Borde violeta translúcido de tarjetas de marca. */
  brandBorder: 'rgba(167, 139, 250, 0.45)',
  /** Color sólido detrás del brillo de las tarjetas de marca. */
  brandSolid: '#24145C',
};

export type ColorToken = keyof typeof darkColors;
export type Colors = Record<ColorToken, string>;

/**
 * Tema claro: mismos tokens. Todo texto sobre background/surface/surfaceRaised/surfaceHighlight
 * cumple WCAG AA (≥ 4.5:1; test en __tests__/contrast.test.ts). Por eso el dorado, el naranja de
 * racha y los verdes/rojos de texto son más oscuros que en el tema oscuro.
 */
const lightColors: Colors = {
  background: '#F6F5FB',
  backgroundDeep: '#ECEAF6',
  surface: '#FFFFFF',
  surfaceRaised: '#F1EFF9',
  surfaceHighlight: '#E6E2F5',
  border: '#E3E0F0',
  borderStrong: '#C9C3E3',
  text: '#29243F',
  textStrong: '#13102A',
  textMuted: '#5C567C',
  textSubtle: '#8B85AE',
  primary: '#6D28D9',
  primaryBright: '#7C3AED',
  primarySoft: '#6D28D9',
  primaryPressed: '#5B21B6',
  onPrimary: '#FFFFFF',
  info: '#0B5F77',
  infoAlt: '#1D4ED8',
  success: '#03684B',
  successStrong: '#059669',
  successDeep: '#047857',
  danger: '#B91C1C',
  dangerStrong: '#DC2626',
  dangerDeep: '#B91C1C',
  gold: '#8A5306',
  goldStrong: '#6E4204',
  streak: '#A8380A',
  overlay: 'rgba(19, 16, 42, 0.45)',
  inset: 'rgba(255, 255, 255, 0.6)',
  brandBorder: 'rgba(109, 40, 217, 0.25)',
  brandSolid: '#DED0FF',
};

type Gradient = readonly [string, string, ...string[]];
interface Gradients {
  primary: Gradient;
  hero: Gradient;
  ranked: Gradient;
  gold: Gradient;
  screen: Gradient;
  /** Tarjetas de marca (código de amigo, desafiar amigos, opción elegida). */
  brand: Gradient;
  /** Tarjeta de rango. */
  rankCard: Gradient;
  /** Panel de Ranked y su cabecera que se desvanece. */
  rankedPanel: Gradient;
  rankedHeader: Gradient;
  /** Logro bloqueado. */
  locked: Gradient;
}

const darkGradients: Gradients = {
  primary: [palette.violet400, palette.violet600],
  hero: ['#2A1A5E', palette.ink900],
  ranked: ['#3B1D80', '#151036'],
  gold: [palette.gold400, palette.gold500],
  screen: [palette.ink850, palette.ink900, palette.ink950],
  brand: ['#3F2391', '#24145C', '#160F3A'],
  rankCard: ['#4B2A9E', '#2A1766', '#140E33'],
  rankedPanel: ['#2E1A6B', '#1A1240', '#120E2C'],
  rankedHeader: ['#3B1D80', 'rgba(59, 29, 128, 0.35)', 'transparent'],
  locked: ['#3A3566', '#221E42'],
};

const lightGradients: Gradients = {
  primary: [palette.violet400, palette.violet600],
  hero: ['#E7DEFF', '#F6F5FB'],
  ranked: ['#D9CCFF', '#EFEAFF'],
  gold: [palette.gold400, palette.gold500],
  screen: ['#FFFFFF', '#F6F5FB', '#ECEAF6'],
  brand: ['#EDE5FF', '#DED0FF', '#CDB8FF'],
  rankCard: ['#E9DFFF', '#D8C8FF', '#C7B1FF'],
  rankedPanel: ['#EFE9FF', '#E3D9FF', '#D6C9FF'],
  rankedHeader: ['#D9CCFF', 'rgba(217, 204, 255, 0.4)', 'transparent'],
  locked: ['#E2DEF2', '#D2CDE8'],
};

/**
 * Colores del camino de lecciones, uno por unidad (rotan). `lip` es el borde inferior
 * oscuro que da relieve al nodo; los íconos sobre `fill` son blancos.
 */
export const pathAccents = [
  { fill: palette.violet500, lip: '#4C1D95' },
  { fill: '#0891B2', lip: '#155E75' },
  { fill: palette.green500, lip: '#065F46' },
  { fill: '#EA580C', lip: '#9A3412' },
  { fill: '#2563EB', lip: '#1E3A8A' },
  { fill: '#DB2777', lip: '#9D174D' },
] as const;

/** Lección perfecta (3 estrellas). Sobre `fill` los íconos van oscuros (ink900). */
export const pathGold = { fill: palette.gold400, lip: '#A16207' } as const;

export type PathAccent = (typeof pathAccents)[number] | typeof pathGold;

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

interface Shadow {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
  elevation: number;
}
interface Elevation {
  card: Shadow;
  glow: Shadow;
}

const darkElevation: Elevation = {
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
};

const lightElevation: Elevation = {
  card: {
    shadowColor: '#2B2160',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  glow: {
    shadowColor: palette.violet500,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
};

const THEMES = {
  dark: { colors: darkColors as Colors, gradients: darkGradients, elevation: darkElevation },
  light: { colors: lightColors, gradients: lightGradients, elevation: lightElevation },
} as const;

let active: ColorScheme = 'dark';

/** Tema con el que se leen los tokens. Lo fija ThemeProvider (theme.tsx) al dibujar. */
export function setActiveScheme(scheme: ColorScheme) {
  active = scheme;
}

export function getActiveScheme(): ColorScheme {
  return active;
}

/** Ejecuta `fn` leyendo los tokens de `scheme` (para calcular estilos de un tema concreto). */
export function withScheme<T>(scheme: ColorScheme, fn: () => T): T {
  const prev = active;
  active = scheme;
  try {
    return fn();
  } finally {
    active = prev;
  }
}

/** Vista del tema activo: cada lectura (`colors.text`) devuelve el valor del tema vigente. */
function live<T extends object>(pick: (t: (typeof THEMES)[ColorScheme]) => T): T {
  const current = () => pick(THEMES[active]) as Record<PropertyKey, unknown>;
  return new Proxy({} as T, {
    get: (_, key) => current()[key],
    has: (_, key) => key in current(),
    ownKeys: () => Reflect.ownKeys(current()),
    getOwnPropertyDescriptor: (_, key) =>
      key in current()
        ? { enumerable: true, configurable: true, writable: false, value: current()[key] }
        : undefined,
  });
}

export const colors: Colors = live((t) => t.colors);
export const gradients: Gradients = live((t) => t.gradients);
export const elevation: Elevation = live((t) => t.elevation);

/** Paletas completas (para tests y vistas previas). */
export const themeColors: Record<ColorScheme, Colors> = {
  dark: THEMES.dark.colors,
  light: THEMES.light.colors,
};

export const durations = {
  fast: 120,
  base: 220,
  slow: 400,
  celebrate: 900,
} as const;

/** Tamaño mínimo de área táctil (accesibilidad). */
export const MIN_TOUCH = 44;
