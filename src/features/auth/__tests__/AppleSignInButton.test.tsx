import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { AppleSignInButton } from '../AppleSignInButton';

/** appleSignInSupported() es Platform.OS === 'ios' (probado en appleSignIn.test.ts). */
let mockIsIOS = true;
jest.mock('../apple', () => ({
  signInWithApple: jest.fn(),
  appleSignInSupported: () => mockIsIOS,
}));

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>;
}

const setOS = (os: 'ios' | 'android' | 'web') => {
  mockIsIOS = os === 'ios';
};
afterEach(() => setOS('ios'));

// Ingreso y registro usan este componente.
it('en iOS muestra "Continuar con Apple"', async () => {
  setOS('ios');
  await render(<AppleSignInButton />, { wrapper });
  expect(screen.getByRole('button', { name: 'Continuar con Apple' })).toBeTruthy();
});

it.each(['android', 'web'] as const)('en %s no dibuja nada', async (os) => {
  setOS(os);
  await render(<AppleSignInButton />, { wrapper });
  expect(screen.queryByRole('button', { name: 'Continuar con Apple' })).toBeNull();
  expect(screen.toJSON()).toBeNull();
});
