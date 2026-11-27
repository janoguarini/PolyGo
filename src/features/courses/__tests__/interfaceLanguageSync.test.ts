import { QueryClient } from '@tanstack/react-query';

import {
  __setInterfaceLanguageForTests,
  getInterfaceLanguage,
  getPendingInterfaceLanguage,
  setPendingInterfaceLanguage,
} from '@/i18n';

import {
  RETRY_MS,
  __resetInterfaceLanguageSyncForTests,
  chooseInterfaceLanguage,
  profileLanguageDecision,
  syncPendingInterfaceLanguage,
} from '../interfaceLanguageSync';

/**
 * Elección del idioma de la interfaz frente al perfil remoto: con y sin conexión, reintentos,
 * refrescos simultáneos, cambio de cuenta y registro. La persistencia tras reiniciar está en
 * src/i18n/__tests__/language.test.ts.
 */

const mockStore = new Map<string, string>();
jest.mock('@/lib/secureStorage', () => ({
  deviceStorage: {
    getItem: async (k: string) => mockStore.get(k) ?? null,
    setItem: async (k: string, v: string) => void mockStore.set(k, v),
    removeItem: async (k: string) => void mockStore.delete(k),
  },
}));
jest.mock('@/features/profile/hooks', () => ({
  profileKeys: { me: (userId: string) => ['profile', 'me', userId] },
}));

const mockSave = jest.fn<Promise<boolean>, [string]>();
jest.mock('../api', () => ({ saveInterfaceLanguage: (lang: string) => mockSave(lang) }));

const A = 'user-a';
const B = 'user-b';
const key = (u: string) => ['profile', 'me', u];
const profile = (lang: string | null) => ({
  profile: { id: A, interface_language: lang },
  rating: null,
  settings: null,
});
const cachedLang = (qc: QueryClient, u = A) =>
  (qc.getQueryData(key(u)) as { profile: { interface_language: string | null } } | undefined)
    ?.profile.interface_language;
const offline = () => Object.assign(new Error('Failed to fetch'), { name: 'TypeError' });

let qc: QueryClient;
beforeEach(async () => {
  mockStore.clear();
  mockSave.mockReset();
  __resetInterfaceLanguageSyncForTests();
  __setInterfaceLanguageForTests('es');
  await setPendingInterfaceLanguage(null);
  qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  qc.setQueryData(key(A), profile('es'));
});
afterEach(() => qc.clear());

describe('idioma de la interfaz frente al perfil', () => {
  it('1. con conexión: se aplica al instante, se guarda y no queda nada pendiente', async () => {
    mockSave.mockResolvedValue(true);
    const result = await chooseInterfaceLanguage('it', { userId: A, qc });
    expect(result).toBe('saved');
    expect(getInterfaceLanguage()).toBe('it');
    expect(mockSave).toHaveBeenCalledWith('it');
    expect(getPendingInterfaceLanguage()).toBeNull();
    expect(cachedLang(qc)).toBe('it');
  });

  it('2. sin conexión: la elección queda, pendiente, y el perfil viejo no la pisa', async () => {
    mockSave.mockRejectedValue(offline());
    const result = await chooseInterfaceLanguage('it', { userId: A, qc });
    expect(result).toBe('pending');
    expect(getInterfaceLanguage()).toBe('it');
    expect(getPendingInterfaceLanguage()).toEqual({ lang: 'it', owner: A });

    // Llega un refresco del perfil con el valor de la base (español).
    qc.setQueryData(key(A), profile('es'));
    const decision = profileLanguageDecision({
      saved: 'es',
      userId: A,
      current: getInterfaceLanguage(),
      pending: getPendingInterfaceLanguage(),
    });
    expect(decision).toEqual({ action: 'sync' });
    expect(getInterfaceLanguage()).toBe('it');
  });

  it('la base que todavía no acepta pt-BR (sin migración) también deja la elección pendiente', async () => {
    mockSave.mockResolvedValue(false);
    expect(await chooseInterfaceLanguage('pt-BR', { userId: A, qc })).toBe('pending');
    expect(getInterfaceLanguage()).toBe('pt-BR');
    expect(getPendingInterfaceLanguage()).toEqual({ lang: 'pt-BR', owner: A });
    // No insiste en esta sesión salvo al volver a la app (force).
    mockSave.mockClear();
    expect(await syncPendingInterfaceLanguage({ userId: A, qc })).toBe('pending');
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('3. al reconectar se sincroniza y se borra la marca', async () => {
    mockSave.mockRejectedValueOnce(offline());
    await chooseInterfaceLanguage('it', { userId: A, qc });
    expect(getPendingInterfaceLanguage()).not.toBeNull();

    // Un reintento automático antes de RETRY_MS no llama al servidor…
    mockSave.mockResolvedValue(true);
    expect(await syncPendingInterfaceLanguage({ userId: A, qc })).toBe('pending');
    expect(mockSave).toHaveBeenCalledTimes(1);

    // …pero al volver la app a primer plano (force) sí.
    expect(await syncPendingInterfaceLanguage({ userId: A, qc, force: true })).toBe('saved');
    expect(mockSave).toHaveBeenLastCalledWith('it');
    expect(getPendingInterfaceLanguage()).toBeNull();
    expect(cachedLang(qc)).toBe('it');
    expect(getInterfaceLanguage()).toBe('it');
  });

  it('3b. el reintento automático corre pasado RETRY_MS', async () => {
    const now = jest.spyOn(Date, 'now');
    now.mockReturnValue(1_000_000);
    mockSave.mockRejectedValueOnce(offline());
    await chooseInterfaceLanguage('it', { userId: A, qc });
    mockSave.mockResolvedValue(true);
    now.mockReturnValue(1_000_000 + RETRY_MS + 1);
    expect(await syncPendingInterfaceLanguage({ userId: A, qc })).toBe('saved');
    now.mockRestore();
  });

  it('4. un refresco del perfil en curso no pisa la elección', async () => {
    // Refresco lento que va a devolver el valor viejo.
    let resolveFetch!: (v: unknown) => void;
    const inFlight = qc
      .fetchQuery({
        queryKey: key(A),
        queryFn: () => new Promise((r) => (resolveFetch = r)),
        staleTime: 0,
      })
      .catch(() => undefined);
    mockSave.mockResolvedValue(true);
    const choice = chooseInterfaceLanguage('it', { userId: A, qc });
    resolveFetch(profile('es'));
    await Promise.all([choice, inFlight]);
    expect(cachedLang(qc)).toBe('it');
    expect(getInterfaceLanguage()).toBe('it');
  });

  it('4b. un guardado en vuelo y una elección nueva: van en orden y gana la última', async () => {
    const order: string[] = [];
    let releaseFirst: (() => void) | undefined;
    mockSave.mockImplementation(async (lang) => {
      if (lang === 'it') await new Promise<void>((r) => (releaseFirst = r));
      order.push(lang);
      return true;
    });
    const first = chooseInterfaceLanguage('it', { userId: A, qc });
    // Esperar a que el guardado del italiano ya esté en el servidor (en vuelo).
    for (let i = 0; i < 50 && !releaseFirst; i++) await new Promise((r) => setTimeout(r, 0));
    expect(releaseFirst).toBeDefined();
    const second = chooseInterfaceLanguage('pt-BR', { userId: A, qc });
    releaseFirst!();
    expect(await first).toBe('saved');
    expect(await second).toBe('saved');
    expect(order).toEqual(['it', 'pt-BR']);
    expect(getInterfaceLanguage()).toBe('pt-BR');
    expect(cachedLang(qc)).toBe('pt-BR');
    expect(getPendingInterfaceLanguage()).toBeNull();
  });

  it('4c. una elección que quedó vieja antes de enviarse no se manda', async () => {
    mockSave.mockResolvedValue(true);
    const first = chooseInterfaceLanguage('it', { userId: A, qc });
    const second = chooseInterfaceLanguage('pt-BR', { userId: A, qc });
    await Promise.all([first, second]);
    expect(mockSave.mock.calls.map(([l]) => l)).toEqual(['pt-BR']);
    expect(getInterfaceLanguage()).toBe('pt-BR');
    expect(getPendingInterfaceLanguage()).toBeNull();
  });

  it('5. cambio de cuenta: la marca de la anterior se descarta y manda el perfil nuevo', async () => {
    mockSave.mockRejectedValue(offline());
    await chooseInterfaceLanguage('it', { userId: A, qc });
    expect(getPendingInterfaceLanguage()?.owner).toBe(A);

    expect(
      profileLanguageDecision({
        saved: 'en',
        userId: B,
        current: getInterfaceLanguage(),
        pending: getPendingInterfaceLanguage(),
      }),
    ).toEqual({ action: 'discard-pending' });
    expect(await syncPendingInterfaceLanguage({ userId: B, qc, force: true })).toBe('none');
    expect(getPendingInterfaceLanguage()).toBeNull();
    expect(mockSave).toHaveBeenCalledTimes(1); // nunca se guardó el italiano de A en la cuenta B
    expect(
      profileLanguageDecision({ saved: 'en', userId: B, current: 'it', pending: null }),
    ).toEqual({ action: 'apply', lang: 'en' });
  });

  it('6. fallo al guardar durante el registro: queda pendiente y se guarda después', async () => {
    // El registro elige el idioma con la cuenta recién creada; el perfil todavía no lo tiene.
    qc.setQueryData(key(A), profile(null));
    mockSave.mockRejectedValueOnce(offline());
    expect(await chooseInterfaceLanguage('pt-BR', { userId: A, qc })).toBe('pending');
    expect(
      profileLanguageDecision({
        saved: null,
        userId: A,
        current: getInterfaceLanguage(),
        pending: getPendingInterfaceLanguage(),
      }),
    ).toEqual({ action: 'sync' });
    mockSave.mockResolvedValue(true);
    expect(await syncPendingInterfaceLanguage({ userId: A, qc, force: true })).toBe('saved');
    expect(getPendingInterfaceLanguage()).toBeNull();
    expect(cachedLang(qc)).toBe('pt-BR');
  });

  it('una marca sin cuenta (elegida sin sesión) la adopta la primera cuenta que sincroniza', async () => {
    await chooseInterfaceLanguage('it', { userId: null, qc });
    expect(mockSave).not.toHaveBeenCalled();
    expect(getPendingInterfaceLanguage()).toEqual({ lang: 'it', owner: null });
    mockSave.mockResolvedValue(true);
    expect(await syncPendingInterfaceLanguage({ userId: A, qc, force: true })).toBe('saved');
    expect(mockSave).toHaveBeenCalledWith('it');
  });

  it('sin nada pendiente, el perfil manda (usuarios existentes, otro dispositivo)', () => {
    expect(
      profileLanguageDecision({ saved: 'en', userId: A, current: 'es', pending: null }),
    ).toEqual({ action: 'apply', lang: 'en' });
    expect(
      profileLanguageDecision({ saved: 'es', userId: A, current: 'es', pending: null }),
    ).toEqual({ action: 'none' });
    // null (no lo eligió) o un valor desconocido no cambian nada.
    expect(
      profileLanguageDecision({ saved: null, userId: A, current: 'it', pending: null }),
    ).toEqual({ action: 'none' });
    expect(
      profileLanguageDecision({ saved: 'klingon', userId: A, current: 'it', pending: null }),
    ).toEqual({ action: 'none' });
  });
});
