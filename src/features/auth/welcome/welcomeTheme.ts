/**
 * Paleta propia de la pantalla de bienvenida. Es una pantalla de marca: se ve igual (oscura) con el
 * tema claro y con el oscuro, por eso no usa los colores del tema activo.
 */
export const welcome = {
  background: ['#1E0B4D', '#13063A', '#0B0322'] as const,
  /** Brillo radial detrás de la ilustración. */
  glow: '#8B3DFF',
  glowPink: '#D946EF',
  text: '#FFFFFF',
  textSoft: '#E4DAFF',
  textMuted: '#C3B5EC',
  link: '#C9A2FF',
  iconBright: '#E2B8FF',
  cardFill: 'rgba(43, 20, 99, 0.55)',
  cardFillActive: 'rgba(66, 30, 140, 0.62)',
  cardBorder: 'rgba(167, 120, 255, 0.55)',
  cardBorderActive: '#C084FC',
  pillFill: 'rgba(28, 10, 66, 0.7)',
  pillBorder: 'rgba(167, 120, 255, 0.75)',
  headline: ['#F3C9FF', '#C27BFF', '#9445FF'] as const,
  primary: ['#B84DFF', '#8E3CFF', '#6A22E0'] as const,
  primaryBorder: 'rgba(255, 255, 255, 0.28)',
  outlineBorder: '#A774FF',
  outlineFill: 'rgba(24, 9, 60, 0.55)',
} as const;

/** Margen lateral de la pantalla. */
export const GUTTER = 20;

/** Ancho / alto de assets/images/welcome-hero.webp. */
export const HERO_ASPECT = 1000 / 810;

/**
 * Tamaños según el alto útil (sin safe areas). Por debajo de ~700 pt (iPhone SE, mini con barra)
 * se compacta todo. La ilustración no tiene alto fijo: WelcomeScreen mide el resto en el
 * dispositivo y le da sólo lo que sobra (entre heroMin y heroMax), para que todo entre sin scroll.
 */
export function welcomeMetrics(width: number, usableHeight: number) {
  const compact = usableHeight < 700;
  const contentWidth = Math.min(width, 480) - GUTTER * 2;
  // La línea más larga ("Competí para subir.") mide ~10,6 veces el tamaño de letra en negrita
  // cursiva del sistema; se deja margen para que nunca se corte.
  const headlineSize = Math.min(compact ? 27 : 30, Math.floor(contentWidth / 11.2));
  return {
    compact,
    contentWidth,
    headlineSize,
    headlineLine: Math.round(headlineSize * 1.16),
    heroMin: compact ? 100 : 120,
    /** Como máximo el 80 % del ancho: deja aire para el resto aunque sobre lugar. */
    heroMax: Math.round((contentWidth * 0.8) / HERO_ASPECT),
    gap: compact ? 7 : 10,
    cardIcon: compact ? 26 : 30,
    buttonHeight: compact ? 50 : 54,
  };
}
