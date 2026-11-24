import * as WebBrowser from 'expo-web-browser';

import { toUserMessage } from '@/lib/errors';

import {
  exchangeCode,
  parseAuthCallbackUrl,
  resetAuthFlowsForTests,
  signIn,
  signInWithGoogle,
} from '../api';

const REDIRECT = 'polygo://auth-callback';
const GOOGLE_URL = 'https://example.supabase.co/auth/v1/authorize?provider=google';

const mockAuth = {
  signInWithOAuth: jest.fn(),
  exchangeCodeForSession: jest.fn(),
  signInWithPassword: jest.fn(),
};
jest.mock('@/lib/supabase', () => ({ requireSupabase: () => ({ auth: mockAuth }) }));
jest.mock('@/features/friends/pushToken', () => ({ unregisterPush: jest.fn() }));
jest.mock('expo-linking', () => ({
  createURL: (path: string) => `polygo://${path.replace(/^\//, '')}`,
}));
jest.mock('expo-web-browser', () => ({ openAuthSessionAsync: jest.fn() }));

const openAuthSession = WebBrowser.openAuthSessionAsync as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  resetAuthFlowsForTests();
  mockAuth.signInWithOAuth.mockResolvedValue({ data: { url: GOOGLE_URL }, error: null });
  mockAuth.exchangeCodeForSession.mockResolvedValue({ data: {}, error: null });
});

describe('signInWithGoogle', () => {
  it('pide la URL a Supabase sin redirigir y la abre en el navegador del sistema', async () => {
    openAuthSession.mockResolvedValue({ type: 'success', url: `${REDIRECT}?code=abc` });

    await expect(signInWithGoogle()).resolves.toEqual({ status: 'signed_in' });

    expect(mockAuth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: REDIRECT,
        skipBrowserRedirect: true,
        queryParams: { prompt: 'select_account' },
      },
    });
    expect(openAuthSession).toHaveBeenCalledWith(GOOGLE_URL, REDIRECT);
    expect(mockAuth.exchangeCodeForSession).toHaveBeenCalledWith('abc');
  });

  it('cerrar el navegador es una cancelación, no un error, y no canjea nada', async () => {
    openAuthSession.mockResolvedValue({ type: 'cancel' });
    await expect(signInWithGoogle()).resolves.toEqual({ status: 'cancelled' });

    openAuthSession.mockResolvedValue({ type: 'dismiss' });
    await expect(signInWithGoogle()).resolves.toEqual({ status: 'cancelled' });

    expect(mockAuth.exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it('rechazar el permiso en Google (access_denied) también es una cancelación', async () => {
    openAuthSession.mockResolvedValue({
      type: 'success',
      url: `${REDIRECT}?error=access_denied&error_description=The+user+denied`,
    });
    await expect(signInWithGoogle()).resolves.toEqual({ status: 'cancelled' });
    expect(mockAuth.exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it('un error de Supabase en la vuelta (query o #fragmento) se informa con un mensaje claro', async () => {
    openAuthSession.mockResolvedValue({
      type: 'success',
      url: `${REDIRECT}#error=server_error&error_description=Unable+to+exchange+external+code`,
    });
    const error = await signInWithGoogle().catch((e: unknown) => e);
    expect(error).toMatchObject({ code: 'oauth_failed' });
    expect(toUserMessage(error)).toBe(
      'Google no pudo completar el inicio de sesión. Intentá de nuevo.',
    );
    expect(mockAuth.exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it('si signInWithOAuth falla, el error llega a la pantalla', async () => {
    mockAuth.signInWithOAuth.mockResolvedValue({
      data: { url: null },
      error: { code: 'provider_disabled', message: 'Unsupported provider' },
    });
    const error = await signInWithGoogle().catch((e: unknown) => e);
    expect(toUserMessage(error)).toBe(
      'Ese método de inicio de sesión no está disponible por ahora.',
    );
    expect(openAuthSession).not.toHaveBeenCalled();
  });

  it('una vuelta sin código es un callback inválido', async () => {
    openAuthSession.mockResolvedValue({ type: 'success', url: REDIRECT });
    await expect(signInWithGoogle()).rejects.toMatchObject({ code: 'oauth_invalid_callback' });
  });

  it('un código vencido o inválido muestra un mensaje y libera el botón', async () => {
    openAuthSession.mockResolvedValue({ type: 'success', url: `${REDIRECT}?code=viejo` });
    mockAuth.exchangeCodeForSession.mockResolvedValue({
      data: {},
      error: { code: 'flow_state_expired', message: 'flow state has expired' },
    });
    const error = await signInWithGoogle().catch((e: unknown) => e);
    expect(toUserMessage(error)).toBe('El inicio de sesión tardó demasiado. Intentá de nuevo.');

    // El flujo terminó: un nuevo toque arranca otro intento.
    openAuthSession.mockResolvedValue({ type: 'cancel' });
    await expect(signInWithGoogle()).resolves.toEqual({ status: 'cancelled' });
    expect(mockAuth.signInWithOAuth).toHaveBeenCalledTimes(2);
  });

  it('si el navegador no se puede abrir, informa el error en vez de quedar colgado', async () => {
    openAuthSession.mockRejectedValue(new Error('Another web browser is already open'));
    await expect(signInWithGoogle()).rejects.toMatchObject({ code: 'oauth_browser_busy' });
  });

  it('dos toques seguidos comparten un único flujo (un solo navegador, un solo canje)', async () => {
    let finish!: (r: unknown) => void;
    openAuthSession.mockReturnValue(new Promise((r) => (finish = r)));

    const first = signInWithGoogle();
    const second = signInWithGoogle();
    expect(second).toBe(first);

    // Esperar a que el flujo llegue a abrir el navegador.
    await new Promise<void>((r) => setImmediate(r));
    finish({ type: 'success', url: `${REDIRECT}?code=uno` });
    await expect(first).resolves.toEqual({ status: 'signed_in' });

    expect(mockAuth.signInWithOAuth).toHaveBeenCalledTimes(1);
    expect(openAuthSession).toHaveBeenCalledTimes(1);
    expect(mockAuth.exchangeCodeForSession).toHaveBeenCalledTimes(1);
  });
});

describe('exchangeCode', () => {
  it('el mismo código se canjea una sola vez aunque lleguen dos callbacks (Android)', async () => {
    let finish!: (r: unknown) => void;
    mockAuth.exchangeCodeForSession.mockReturnValue(new Promise((r) => (finish = r)));

    // El navegador de signInWithGoogle y la ruta /auth-callback reciben el mismo ?code=.
    const fromBrowser = exchangeCode('xyz');
    const fromRoute = exchangeCode('xyz');
    finish({ data: {}, error: null });
    await Promise.all([fromBrowser, fromRoute]);
    await exchangeCode('xyz');

    expect(mockAuth.exchangeCodeForSession).toHaveBeenCalledTimes(1);
  });

  it('códigos distintos (p. ej. email de confirmación) se canjean por separado', async () => {
    await exchangeCode('a');
    await exchangeCode('b');
    expect(mockAuth.exchangeCodeForSession).toHaveBeenCalledTimes(2);
  });

  it('un código inválido rechaza a todos los que esperan ese canje', async () => {
    mockAuth.exchangeCodeForSession.mockResolvedValue({
      data: {},
      error: { code: 'flow_state_not_found', message: 'invalid flow state' },
    });
    await expect(exchangeCode('malo')).rejects.toMatchObject({ code: 'flow_state_not_found' });
    await expect(exchangeCode('malo')).rejects.toMatchObject({ code: 'flow_state_not_found' });
    expect(mockAuth.exchangeCodeForSession).toHaveBeenCalledTimes(1);
  });
});

describe('parseAuthCallbackUrl', () => {
  it('lee el código y los errores de la query y del fragmento', () => {
    expect(parseAuthCallbackUrl('polygo://auth-callback?code=c1')).toEqual({ code: 'c1' });
    expect(
      parseAuthCallbackUrl('polygo://auth-callback#error=e&error_description=Algo%20fall%C3%B3'),
    ).toEqual({ error: 'e', errorDescription: 'Algo falló' });
    expect(parseAuthCallbackUrl('exp://192.168.0.9:8081/--/auth-callback?code=c2#x=1')).toEqual({
      code: 'c2',
    });
    expect(parseAuthCallbackUrl('polygo://auth-callback')).toEqual({});
    expect(parseAuthCallbackUrl('polygo://auth-callback?code=%E0%A4%A')).toEqual({});
  });
});

describe('login tradicional', () => {
  it('signIn sigue usando email y contraseña, sin navegador ni OAuth', async () => {
    mockAuth.signInWithPassword.mockResolvedValue({ data: {}, error: null });
    await signIn({ email: 'a@b.com', password: 'secreto' });
    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'secreto',
    });
    expect(mockAuth.signInWithOAuth).not.toHaveBeenCalled();
    expect(openAuthSession).not.toHaveBeenCalled();
  });
});
