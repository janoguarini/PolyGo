import { colors, palette } from '../tokens';

/** Contraste WCAG 2.x entre dos colores hex (#RRGGBB). */
function contrast(fg: string, bg: string): number {
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
  };
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a! + 0.05) / (b! + 0.05);
}

// Fondos sobre los que se dibuja texto (pantalla, tarjetas, tarjeta resaltada, widget).
const BACKGROUNDS = {
  background: colors.background,
  surface: colors.surface,
  surfaceRaised: colors.surfaceRaised,
  surfaceHighlight: colors.surfaceHighlight,
  widget: palette.ink800,
};

// Texto normal: AA exige 4.5:1. Las variantes "caption"/"overline" también son texto chico.
const BODY_TEXT = [
  'text',
  'textStrong',
  'textMuted',
  'primarySoft',
  'success',
  'danger',
  'gold',
  'info',
  'streak',
] as const;

describe('contraste WCAG AA', () => {
  for (const token of BODY_TEXT) {
    for (const [bgName, bg] of Object.entries(BACKGROUNDS)) {
      it(`${token} sobre ${bgName} ≥ 4.5:1`, () => {
        expect(contrast(colors[token], bg)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it('texto de botón primario (blanco sobre violeta) ≥ 4.5:1', () => {
    expect(contrast(colors.onPrimary, colors.primary)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.onPrimary, colors.primaryPressed)).toBeGreaterThanOrEqual(4.5);
  });

  it('feedback de respuestas: blanco sobre verde/rojo de fondo ≥ 4.5:1', () => {
    expect(contrast(colors.textStrong, colors.successDeep)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.textStrong, colors.dangerDeep)).toBeGreaterThanOrEqual(4.5);
  });

  it('placeholder (textSubtle) ≥ 3:1: no es contenido, pero tiene que leerse', () => {
    expect(contrast(colors.textSubtle, colors.surface)).toBeGreaterThanOrEqual(3);
  });
});
