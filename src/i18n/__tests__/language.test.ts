/**
 * Idioma de la interfaz en ejecución: detección del sistema, prioridad de la elección guardada,
 * persistencia y la elección pendiente de sincronizar con el perfil.
 */

const mockStore = new Map<string, string>();
let mockLocales: { languageTag: string; languageCode: string | null }[] = [];

jest.mock('@/lib/secureStorage', () => ({
  deviceStorage: {
    getItem: async (k: string) => mockStore.get(k) ?? null,
    setItem: async (k: string, v: string) => void mockStore.set(k, v),
    removeItem: async (k: string) => void mockStore.delete(k),
  },
}));
jest.mock('expo-localization', () => ({ getLocales: () => mockLocales }));

type I18n = typeof import('..');
const load = (): I18n => {
  let mod!: I18n;
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mod = require('..') as I18n;
  });
  return mod;
};
const locales = (...tags: string[]) =>
  tags.map((t) => ({ languageTag: t, languageCode: t.split('-')[0]! }));

beforeEach(() => {
  mockStore.clear();
  mockLocales = [];
});

describe('detección del idioma del sistema', () => {
  const { interfaceLanguageForLocale, deviceInterfaceLanguage } = load();

  it.each([
    ['es-AR', 'es'],
    ['es-ES', 'es'],
    ['en-US', 'en'],
    ['en-GB', 'en'],
    ['pt-BR', 'pt-BR'],
    ['pt-PT', 'pt-BR'],
    ['pt_BR', 'pt-BR'],
    ['it-IT', 'it'],
    ['it', 'it'],
  ])('%s → %s', (tag, lang) => {
    expect(interfaceLanguageForLocale(tag)).toBe(lang);
  });

  it('idiomas no soportados no dan idioma; la sugerencia final es español', () => {
    expect(interfaceLanguageForLocale('de-DE')).toBeNull();
    expect(interfaceLanguageForLocale('')).toBeNull();
    expect(deviceInterfaceLanguage(['de-DE', 'fr-FR'])).toBe('es');
    expect(deviceInterfaceLanguage([])).toBe('es');
  });

  it('toma el primer idioma preferido que se soporta', () => {
    expect(deviceInterfaceLanguage(['de-DE', 'it-IT', 'en-US'])).toBe('it');
    expect(deviceInterfaceLanguage(['ja-JP', 'pt-BR'])).toBe('pt-BR');
  });
});

describe('hidratación y persistencia', () => {
  it('sin nada guardado usa el idioma del teléfono (expo-localization)', async () => {
    mockLocales = locales('it-IT', 'en-US');
    const i18n = load();
    expect(await i18n.hydrateInterfaceLanguage()).toBe('it');
    expect(i18n.getInterfaceLanguage()).toBe('it');
  });

  it('un teléfono en portugués abre en pt-BR; uno en alemán, en español', async () => {
    mockLocales = locales('pt-BR');
    expect(await load().hydrateInterfaceLanguage()).toBe('pt-BR');
    mockLocales = locales('de-DE');
    expect(await load().hydrateInterfaceLanguage()).toBe('es');
  });

  it('la elección manual guardada gana sobre el teléfono y persiste entre aperturas', async () => {
    mockLocales = locales('en-US');
    const first = load();
    await first.setInterfaceLanguage('pt-BR');
    expect(first.getInterfaceLanguage()).toBe('pt-BR');

    const reopened = load();
    expect(await reopened.hydrateInterfaceLanguage()).toBe('pt-BR');
  });

  it('los valores viejos (es / en) siguen valiendo; uno desconocido se ignora', async () => {
    mockLocales = locales('it-IT');
    mockStore.set('polygo.interface-language', 'en');
    expect(await load().hydrateInterfaceLanguage()).toBe('en');
    mockStore.set('polygo.interface-language', 'klingon');
    expect(await load().hydrateInterfaceLanguage()).toBe('it');
  });

  it('una elección pendiente de sincronizar sobrevive al reinicio, con su cuenta', async () => {
    const i18n = load();
    await i18n.setInterfaceLanguage('it');
    await i18n.setPendingInterfaceLanguage({ lang: 'it', owner: 'user-a' });
    const reopened = load();
    expect(await reopened.hydrateInterfaceLanguage()).toBe('it');
    expect(reopened.getPendingInterfaceLanguage()).toEqual({ lang: 'it', owner: 'user-a' });

    await reopened.setPendingInterfaceLanguage(null);
    const again = load();
    await again.hydrateInterfaceLanguage();
    expect(again.getPendingInterfaceLanguage()).toBeNull();
  });

  it('una marca pendiente que no coincide con el idioma guardado, o rota, se descarta', async () => {
    mockStore.set('polygo.interface-language', 'en');
    mockStore.set('polygo.interface-language.pending', JSON.stringify({ lang: 'it', owner: 'a' }));
    const i18n = load();
    await i18n.hydrateInterfaceLanguage();
    expect(i18n.getPendingInterfaceLanguage()).toBeNull();

    mockStore.set('polygo.interface-language.pending', '{roto');
    const again = load();
    await again.hydrateInterfaceLanguage();
    expect(again.getPendingInterfaceLanguage()).toBeNull();
  });

  it('isInterfaceLanguage acepta los cuatro códigos y nada más', () => {
    const { isInterfaceLanguage } = load();
    for (const l of ['es', 'en', 'pt-BR', 'it']) expect(isInterfaceLanguage(l)).toBe(true);
    for (const l of ['pt', 'PT-BR', 'fr', '', null, 3]) expect(isInterfaceLanguage(l)).toBe(false);
  });

  it('cada idioma tiene etiqueta propia, bandera y locale', () => {
    const { INTERFACE_LANGUAGES, INTERFACE_LANGUAGE_LABELS, INTERFACE_LANGUAGE_FLAGS, LOCALES } =
      load();
    expect(INTERFACE_LANGUAGES).toEqual(['es', 'en', 'pt-BR', 'it']);
    expect(INTERFACE_LANGUAGE_LABELS).toEqual({
      es: 'Español',
      en: 'English',
      'pt-BR': 'Português (Brasil)',
      it: 'Italiano',
    });
    for (const l of INTERFACE_LANGUAGES) {
      expect(INTERFACE_LANGUAGE_FLAGS[l]).toBeTruthy();
      expect(LOCALES[l]).toBeTruthy();
    }
  });
});
