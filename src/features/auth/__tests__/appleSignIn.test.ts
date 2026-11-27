import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

import { toUserMessage } from '@/lib/errors';

import {
  appleNameMetadata,
  appleSignInSupported,
  resetAppleFlowForTests,
  signInWithApple,
} from '../apple';

const mockAuth = { signInWithIdToken: jest.fn(), updateUser: jest.fn() };
/** Cualquier acceso a tablas (p. ej. profiles) pasaría por from(): Apple no debe usarlo. */
const mockFrom = jest.fn();
jest.mock('@/lib/supabase', () => ({
  requireSupabase: () => ({ auth: mockAuth, from: mockFrom }),
}));
jest.mock('expo-apple-authentication', () => ({
  isAvailableAsync: jest.fn(),
  signInAsync: jest.fn(),
  AppleAuthenticationScope: { FULL_NAME: 0, EMAIL: 1 },
}));
jest.mock('expo-crypto', () => {
  let n = 0;
  return {
    CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
    randomUUID: () => `uuid-${++n}`,
    digestStringAsync: jest.fn(async (_alg: string, value: string) => `sha256(${value})`),
  };
});

const signInAsync = AppleAuthentication.signInAsync as jest.Mock;
const isAvailable = AppleAuthentication.isAvailableAsync as jest.Mock;

const credential = (over: Partial<AppleAuthentication.AppleAuthenticationCredential> = {}) => ({
  user: 'apple-user-001',
  identityToken: 'header.payload.signature',
  authorizationCode: 'code',
  email: null,
  fullName: null,
  state: null,
  realUserStatus: 1,
  ...over,
});

const originalOS = Platform.OS;
const setOS = (os: typeof Platform.OS) => Object.defineProperty(Platform, 'OS', { value: os });

beforeEach(() => {
  jest.clearAllMocks();
  resetAppleFlowForTests();
  setOS('ios');
  isAvailable.mockResolvedValue(true);
  mockAuth.signInWithIdToken.mockResolvedValue({
    data: { session: {}, user: { id: 'user-apple-1' } },
    error: null,
  });
  mockAuth.updateUser.mockResolvedValue({ data: {}, error: null });
});
afterAll(() => setOS(originalOS));

describe('appleSignInSupported', () => {
  it.each([
    ['ios', true],
    ['android', false],
    ['web', false],
  ] as const)('%s → %s', (os, expected) => {
    setOS(os);
    expect(appleSignInSupported()).toBe(expected);
  });
});

describe('signInWithApple', () => {
  it('registro: hoja de Apple con nonce hasheado y Supabase con el nonce original', async () => {
    signInAsync.mockResolvedValue(
      credential({
        email: 'ana@icloud.com',
        fullName: { givenName: 'Ana', familyName: 'Pérez' } as never,
      }),
    );

    await expect(signInWithApple()).resolves.toEqual({ status: 'signed_in' });

    const { nonce: hashed, requestedScopes } = signInAsync.mock.calls[0][0];
    expect(requestedScopes).toEqual([0, 1]);
    const { nonce: raw, ...rest } = mockAuth.signInWithIdToken.mock.calls[0][0];
    expect(rest).toEqual({ provider: 'apple', token: 'header.payload.signature' });
    expect(hashed).toBe(`sha256(${raw})`);
    expect(raw).toMatch(/^uuid-[0-9]+uuid-[0-9]+$/);
  });

  it('inicios posteriores: Apple ya no manda email ni nombre y se entra igual (misma cuenta)', async () => {
    signInAsync.mockResolvedValue(credential());
    await expect(signInWithApple()).resolves.toEqual({ status: 'signed_in' });
    // Supabase identifica la cuenta por el token (sub de Apple); el cliente no manda email.
    expect(mockAuth.signInWithIdToken).toHaveBeenCalledWith(
      expect.not.objectContaining({ email: expect.anything() }),
    );
  });

  it('cada intento usa un nonce nuevo', async () => {
    signInAsync.mockResolvedValue(credential());
    await signInWithApple();
    await signInWithApple();
    const [first, second] = mockAuth.signInWithIdToken.mock.calls.map((c) => c[0].nonce);
    expect(first).not.toBe(second);
  });

  it('"Ocultar mi email" (privaterelay) funciona como cualquier otra cuenta', async () => {
    signInAsync.mockResolvedValue(credential({ email: 'x7k2@privaterelay.appleid.com' }));
    await expect(signInWithApple()).resolves.toEqual({ status: 'signed_in' });
    expect(mockAuth.signInWithIdToken).toHaveBeenCalledTimes(1);
  });

  it('cancelar la hoja de Apple no es un error y no llama a Supabase', async () => {
    signInAsync.mockRejectedValue(
      Object.assign(new Error('canceled'), { code: 'ERR_REQUEST_CANCELED' }),
    );
    await expect(signInWithApple()).resolves.toEqual({ status: 'cancelled' });
    expect(mockAuth.signInWithIdToken).not.toHaveBeenCalled();
  });

  it('un error de Apple se informa en español', async () => {
    signInAsync.mockRejectedValue(
      Object.assign(new Error('failed'), { code: 'ERR_REQUEST_FAILED' }),
    );
    const error = await signInWithApple().catch((e: unknown) => e);
    expect(toUserMessage(error)).toBe(
      'Apple no pudo completar el inicio de sesión. Inténtalo de nuevo.',
    );
    expect(mockAuth.signInWithIdToken).not.toHaveBeenCalled();
  });

  it('sin identity token no se llama a Supabase', async () => {
    signInAsync.mockResolvedValue(credential({ identityToken: null }));
    await expect(signInWithApple()).rejects.toMatchObject({ code: 'apple_invalid_token' });
    expect(mockAuth.signInWithIdToken).not.toHaveBeenCalled();
  });

  it('token inválido o vencido: mensaje de Apple, nunca "email o contraseña incorrectos"', async () => {
    signInAsync.mockResolvedValue(credential());
    for (const code of ['invalid_credentials', 'bad_jwt', 'validation_failed', undefined]) {
      resetAppleFlowForTests();
      mockAuth.signInWithIdToken.mockResolvedValueOnce({
        data: {},
        error: { name: 'AuthApiError', code, message: 'Bad ID token' },
      });
      const error = await signInWithApple().catch((e: unknown) => e);
      expect(toUserMessage(error)).toBe(
        'No pudimos validar tu cuenta de Apple. Inténtalo de nuevo.',
      );
    }
  });

  it('sin conexión muestra el aviso de conexión', async () => {
    signInAsync.mockResolvedValue(credential());
    mockAuth.signInWithIdToken.mockResolvedValue({
      data: {},
      error: { name: 'AuthRetryableFetchError', message: 'Network request failed' },
    });
    const error = await signInWithApple().catch((e: unknown) => e);
    expect(toUserMessage(error)).toBe('No hay conexión con el servidor. Revisa tu internet.');
  });

  it('con Apple apagado en Supabase lo dice sin culpar al usuario', async () => {
    signInAsync.mockResolvedValue(credential());
    mockAuth.signInWithIdToken.mockResolvedValue({
      data: {},
      error: { name: 'AuthApiError', code: 'provider_disabled', message: 'not enabled' },
    });
    const error = await signInWithApple().catch((e: unknown) => e);
    expect(toUserMessage(error)).toBe(
      'Ese método de inicio de sesión no está disponible por ahora.',
    );
  });

  it('dos toques seguidos abren una sola hoja de Apple', async () => {
    signInAsync.mockResolvedValue(credential());
    const first = signInWithApple();
    expect(signInWithApple()).toBe(first);
    await first;
    expect(signInAsync).toHaveBeenCalledTimes(1);
    expect(mockAuth.signInWithIdToken).toHaveBeenCalledTimes(1);
  });

  it('fuera de iOS no existe: no abre nada', async () => {
    setOS('android');
    await expect(signInWithApple()).rejects.toMatchObject({ code: 'apple_unavailable' });
    expect(signInAsync).not.toHaveBeenCalled();
  });

  it('si el sistema no ofrece Sign in with Apple avisa que hay que actualizar', async () => {
    isAvailable.mockResolvedValue(false);
    const error = await signInWithApple().catch((e: unknown) => e);
    expect(toUserMessage(error)).toBe(
      'Esta versión de la app todavía no permite entrar con Apple. Actualízala o usa tu email.',
    );
    expect(signInAsync).not.toHaveBeenCalled();
  });
});

describe('nombre de Apple (metadatos privados)', () => {
  const name = (
    givenName: string | null,
    familyName: string | null,
    middleName: string | null = null,
  ) =>
    ({
      givenName,
      familyName,
      middleName,
      namePrefix: null,
      nameSuffix: null,
      nickname: null,
    }) as never;

  it('primer registro con nombre y apellido: se guarda en los metadatos de la cuenta nueva', async () => {
    signInAsync.mockResolvedValue(credential({ fullName: name('Ana', 'Pérez') }));
    await expect(signInWithApple()).resolves.toEqual({ status: 'signed_in' });

    expect(mockAuth.updateUser).toHaveBeenCalledTimes(1);
    expect(mockAuth.updateUser).toHaveBeenCalledWith({
      data: { full_name: 'Ana Pérez', given_name: 'Ana', family_name: 'Pérez' },
    });
    // Después de crear la sesión (updateUser usa la sesión recién creada, la del usuario correcto).
    expect(mockAuth.signInWithIdToken.mock.invocationCallOrder[0]).toBeLessThan(
      mockAuth.updateUser.mock.invocationCallOrder[0]!,
    );
  });

  it('nombre incompleto: sólo se envían los campos con texto', async () => {
    signInAsync.mockResolvedValue(credential({ fullName: name('Ana', null) }));
    await signInWithApple();
    expect(mockAuth.updateUser).toHaveBeenCalledWith({
      data: { full_name: 'Ana', given_name: 'Ana' },
    });

    resetAppleFlowForTests();
    mockAuth.updateUser.mockClear();
    signInAsync.mockResolvedValue(credential({ fullName: name('  ', 'Pérez') }));
    await signInWithApple();
    expect(mockAuth.updateUser).toHaveBeenCalledWith({
      data: { full_name: 'Pérez', family_name: 'Pérez' },
    });
  });

  it('incluye el segundo nombre en full_name', () => {
    expect(appleNameMetadata(name('Ana', 'Pérez', 'María'))).toEqual({
      full_name: 'Ana María Pérez',
      given_name: 'Ana',
      family_name: 'Pérez',
    });
  });

  it('nombre vacío o null: no se llama a updateUser (no se pisa nada)', async () => {
    for (const fullName of [null, name(null, null), name('', '  ')]) {
      resetAppleFlowForTests();
      signInAsync.mockResolvedValue(credential({ fullName }));
      await expect(signInWithApple()).resolves.toEqual({ status: 'signed_in' });
    }
    expect(mockAuth.updateUser).not.toHaveBeenCalled();
  });

  it('nunca envía claves vacías o null que pisen metadatos existentes', async () => {
    signInAsync.mockResolvedValue(credential({ fullName: name('Ana', '') }));
    await signInWithApple();
    const { data } = mockAuth.updateUser.mock.calls[0][0];
    expect(Object.keys(data).sort()).toEqual(['full_name', 'given_name']);
    expect(Object.values(data).every((v) => typeof v === 'string' && v.trim() !== '')).toBe(true);
  });

  it('inicio posterior: Apple ya no manda el nombre y el guardado anterior queda intacto', async () => {
    signInAsync.mockResolvedValue(credential({ fullName: name(null, null) }));
    await expect(signInWithApple()).resolves.toEqual({ status: 'signed_in' });
    expect(mockAuth.updateUser).not.toHaveBeenCalled();
  });

  it('si updateUser falla, el login sigue y el registro no incluye el nombre', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    signInAsync.mockResolvedValue(credential({ fullName: name('Ana', 'Pérez') }));

    mockAuth.updateUser.mockResolvedValueOnce({
      data: {},
      error: {
        name: 'AuthApiError',
        code: 'unexpected_failure',
        status: 500,
        message: 'Ana Pérez',
      },
    });
    await expect(signInWithApple()).resolves.toEqual({ status: 'signed_in' });

    resetAppleFlowForTests();
    mockAuth.updateUser.mockRejectedValueOnce(new TypeError('Network request failed'));
    await expect(signInWithApple()).resolves.toEqual({ status: 'signed_in' });

    expect(warn).toHaveBeenCalledTimes(2);
    const logged = JSON.stringify(warn.mock.calls);
    expect(logged).not.toMatch(/Ana|Pérez/);
    expect(logged).toContain('unexpected_failure');
    warn.mockRestore();
  });

  it('si el usuario cancela no se guarda nada', async () => {
    signInAsync.mockRejectedValue(
      Object.assign(new Error('canceled'), { code: 'ERR_REQUEST_CANCELED' }),
    );
    await expect(signInWithApple()).resolves.toEqual({ status: 'cancelled' });
    expect(mockAuth.updateUser).not.toHaveBeenCalled();
  });

  it('si Supabase rechaza el token no se guarda nada', async () => {
    signInAsync.mockResolvedValue(credential({ fullName: name('Ana', 'Pérez') }));
    mockAuth.signInWithIdToken.mockResolvedValue({
      data: { session: null, user: null },
      error: { name: 'AuthApiError', code: 'bad_jwt', message: 'invalid' },
    });
    await expect(signInWithApple()).rejects.toMatchObject({ code: 'apple_invalid_token' });
    expect(mockAuth.updateUser).not.toHaveBeenCalled();
  });

  it('no toca profiles.display_name ni ninguna tabla', async () => {
    signInAsync.mockResolvedValue(credential({ fullName: name('Ana', 'Pérez') }));
    await signInWithApple();
    expect(mockFrom).not.toHaveBeenCalled();
    const { data } = mockAuth.updateUser.mock.calls[0][0];
    expect(data).not.toHaveProperty('display_name');
    expect(data).not.toHaveProperty('username');
  });
});
