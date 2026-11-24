import { GUTTER, HERO_ASPECT, welcomeMetrics } from '../welcomeTheme';

// Anchos/altos útiles (sin safe areas) de iPhone reales.
const DEVICES = {
  se: { width: 375, height: 667 - 20 },
  mini: { width: 375, height: 812 - 50 - 34 },
  iphone15: { width: 393, height: 852 - 59 - 34 },
  proMax: { width: 430, height: 932 - 59 - 34 },
};

describe('welcomeMetrics', () => {
  it('compacta sólo en pantallas bajas', () => {
    expect(welcomeMetrics(DEVICES.se.width, DEVICES.se.height).compact).toBe(true);
    expect(welcomeMetrics(DEVICES.mini.width, DEVICES.mini.height).compact).toBe(false);
    expect(welcomeMetrics(DEVICES.proMax.width, DEVICES.proMax.height).compact).toBe(false);
  });

  it.each(Object.entries(DEVICES))('el titular entra en el ancho (%s)', (_, d) => {
    const m = welcomeMetrics(d.width, d.height);
    expect(m.contentWidth).toBe(d.width - GUTTER * 2);
    // "Competí para subir." mide ~10,6 × fontSize en negrita cursiva.
    expect(m.headlineSize * 10.6).toBeLessThanOrEqual(m.contentWidth);
    expect(m.headlineSize).toBeGreaterThanOrEqual(26);
  });

  it('la ilustración nunca supera el ancho disponible', () => {
    const m = welcomeMetrics(DEVICES.proMax.width, DEVICES.proMax.height);
    expect(m.heroMax * HERO_ASPECT).toBeLessThanOrEqual(m.contentWidth + 1);
    expect(m.heroMin).toBeLessThan(m.heroMax);
  });

  it('en tablets/web la columna se limita a 480 pt', () => {
    expect(welcomeMetrics(1024, 1300).contentWidth).toBe(480 - GUTTER * 2);
  });
});
