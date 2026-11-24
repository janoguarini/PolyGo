import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import WelcomeRoute from '../(auth)/index';

const mockSignInWithGoogle = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  router: { push: (href: string) => mockPush(href) },
  useFocusEffect: jest.fn(),
}));
jest.mock('expo-status-bar', () => ({ setStatusBarStyle: jest.fn() }));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
// La pantalla debe usar exactamente la implementación OAuth existente.
jest.mock('@/features/auth/api', () => ({
  signInWithGoogle: () => mockSignInWithGoogle(),
}));
const mockSignInWithApple = jest.fn();
/** appleSignInSupported() es Platform.OS === 'ios' (probado en appleSignIn.test.ts). */
let mockIsIOS = true;
jest.mock('@/features/auth/apple', () => ({
  signInWithApple: () => mockSignInWithApple(),
  appleSignInSupported: () => mockIsIOS,
}));

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false, gcTime: Infinity } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const googleButton = () => screen.getByRole('button', { name: 'Continuar con Google' });

beforeEach(() => {
  mockSignInWithGoogle.mockReset();
  mockPush.mockReset();
});

it('muestra Continuar con Google, Crear cuenta y Ya tengo cuenta', async () => {
  await render(<WelcomeRoute />, { wrapper });
  expect(googleButton()).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Ya tengo cuenta' })).toBeTruthy();
});

it('Google llama a signInWithGoogle y bloquea el botón mientras el navegador está abierto', async () => {
  let finish!: (r: { status: 'signed_in' }) => void;
  mockSignInWithGoogle.mockReturnValue(new Promise((r) => (finish = r)));
  await render(<WelcomeRoute />, { wrapper });

  await fireEvent.press(googleButton());
  await waitFor(() => expect(googleButton()).toBeDisabled());
  await fireEvent.press(googleButton());
  expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);

  finish({ status: 'signed_in' });
  await waitFor(() => expect(googleButton()).toBeEnabled());
  // La navegación posterior la hace el layout al recibir la sesión, no esta pantalla.
  expect(mockPush).not.toHaveBeenCalled();
});

it('avisa si el usuario cancela y muestra los errores', async () => {
  mockSignInWithGoogle.mockResolvedValueOnce({ status: 'cancelled' });
  await render(<WelcomeRoute />, { wrapper });

  await fireEvent.press(googleButton());
  expect(await screen.findByText(/Cancelaste el inicio con Google/)).toBeTruthy();

  mockSignInWithGoogle.mockRejectedValueOnce({ code: 'oauth_failed', message: 'x' });
  await fireEvent.press(googleButton());
  expect(
    await screen.findByText('Google no pudo completar el inicio de sesión. Intentá de nuevo.'),
  ).toBeTruthy();
});

it('Crear cuenta y Ya tengo cuenta siguen navegando igual', async () => {
  await render(<WelcomeRoute />, { wrapper });
  await fireEvent.press(screen.getByRole('button', { name: 'Crear cuenta' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Ya tengo cuenta' }));
  expect(mockPush).toHaveBeenNthCalledWith(1, '/sign-up');
  expect(mockPush).toHaveBeenNthCalledWith(2, '/sign-in');
  expect(mockSignInWithGoogle).not.toHaveBeenCalled();
});

describe('Sign in with Apple', () => {
  const setOS = (os: 'ios' | 'android' | 'web') => {
    mockIsIOS = os === 'ios';
  };
  afterEach(() => setOS('ios'));
  // Espera a que la pantalla termine de dibujarse antes de consultarla.
  const renderWelcome = async () => {
    await render(<WelcomeRoute />, { wrapper });
    await screen.findByRole('button', { name: 'Crear cuenta' });
  };
  beforeEach(() => mockSignInWithApple.mockReset());

  it('en iOS aparece en orden: Google, Apple, Crear cuenta, Ya tengo cuenta', async () => {
    setOS('ios');
    await renderWelcome();
    const labels = screen
      .getAllByRole('button')
      .map((b) => b.props.accessibilityLabel as string)
      .filter(Boolean);
    expect(labels).toEqual([
      'Continuar con Google',
      'Continuar con Apple',
      'Crear cuenta',
      'Ya tengo cuenta',
    ]);
  });

  it('en Android no aparece y el resto queda igual', async () => {
    setOS('android');
    await renderWelcome();
    expect(screen.queryByRole('button', { name: 'Continuar con Apple' })).toBeNull();
    expect(googleButton()).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeTruthy();
  });

  it('en web no aparece', async () => {
    setOS('web');
    await renderWelcome();
    expect(screen.queryByRole('button', { name: 'Continuar con Apple' })).toBeNull();
  });

  it('usa signInWithApple, se bloquea mientras procesa y avisa si el usuario cancela', async () => {
    setOS('ios');
    let finish!: (r: { status: 'cancelled' }) => void;
    mockSignInWithApple.mockReturnValue(new Promise((r) => (finish = r)));
    await renderWelcome();
    const appleButton = () => screen.getByRole('button', { name: 'Continuar con Apple' });

    await fireEvent.press(appleButton());
    await waitFor(() => expect(appleButton()).toBeDisabled());
    await fireEvent.press(appleButton());
    expect(mockSignInWithApple).toHaveBeenCalledTimes(1);
    expect(mockSignInWithGoogle).not.toHaveBeenCalled();

    finish({ status: 'cancelled' });
    expect(await screen.findByText(/Cancelaste el inicio con Apple/)).toBeTruthy();
    expect(appleButton()).toBeEnabled();
  });

  it('muestra el error de Apple sin afectar a Google', async () => {
    setOS('ios');
    mockSignInWithApple.mockRejectedValueOnce({ code: 'apple_invalid_token', message: 'x' });
    await renderWelcome();
    await fireEvent.press(screen.getByRole('button', { name: 'Continuar con Apple' }));
    expect(
      await screen.findByText('No pudimos validar tu cuenta de Apple. Intentá de nuevo.'),
    ).toBeTruthy();
    expect(googleButton()).toBeEnabled();
  });
});
