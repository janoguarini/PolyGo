import {
  colors,
  getActiveScheme,
  gradients,
  setActiveScheme,
  themeColors,
  withScheme,
} from '../tokens';

describe('tokens por tema', () => {
  afterEach(() => setActiveScheme('dark'));

  it('por defecto se leen los colores del tema oscuro', () => {
    expect(getActiveScheme()).toBe('dark');
    expect(colors.background).toBe(themeColors.dark.background);
  });

  it('colors y gradients siguen al tema activo', () => {
    setActiveScheme('light');
    expect(colors.background).toBe(themeColors.light.background);
    expect(colors.background).not.toBe(themeColors.dark.background);
    expect(gradients.brand[0]).not.toBe(withScheme('dark', () => gradients.brand[0]));
  });

  it('withScheme lee otro tema sin cambiar el activo', () => {
    expect(withScheme('light', () => colors.text)).toBe(themeColors.light.text);
    expect(getActiveScheme()).toBe('dark');
  });

  it('se comporta como un objeto normal (claves, spread)', () => {
    expect(Object.keys(colors)).toEqual(Object.keys(themeColors.dark));
    expect({ ...colors }.primary).toBe(themeColors.dark.primary);
    expect('primary' in colors).toBe(true);
  });

  it('los dos temas definen exactamente los mismos tokens', () => {
    expect(Object.keys(themeColors.light).sort()).toEqual(Object.keys(themeColors.dark).sort());
  });
});
