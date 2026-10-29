import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import DeleteAccountScreen from '../delete-account';

const mockDeleteAccount = jest.fn(() => Promise.resolve());

jest.mock('expo-router', () => ({ router: { back: jest.fn() } }));
jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
jest.mock('@/features/auth/api', () => ({ deleteAccount: () => mockDeleteAccount() }));
jest.mock('@/features/profile/hooks', () => ({
  useMyProfile: () => ({
    isPending: false,
    isError: false,
    data: { profile: { username: 'ana_92' } },
    refetch: jest.fn(),
  }),
}));

function wrapper({ children }: { children: ReactNode }) {
  // gcTime infinito: sin timers de recolección que dejen a Jest esperando al terminar.
  const client = new QueryClient({
    defaultOptions: {
      mutations: { retry: false, gcTime: Infinity },
      queries: { gcTime: Infinity },
    },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const deleteButton = () => screen.getByRole('button', { name: 'Eliminar mi cuenta para siempre' });

beforeEach(() => mockDeleteAccount.mockClear());

it('explica qué se borra y que no se puede deshacer', async () => {
  await render(<DeleteAccountScreen />, { wrapper });
  expect(screen.getByText('Esto no se puede deshacer')).toBeTruthy();
  expect(screen.getByText(/Tu ELO, tu rango/)).toBeTruthy();
  expect(screen.getByText(/sin tu nombre ni avatar/)).toBeTruthy();
});

it('sólo se habilita al escribir el usuario exacto y borra una vez', async () => {
  await render(<DeleteAccountScreen />, { wrapper });
  const input = screen.getByLabelText(/escribí tu usuario: ana_92/);

  expect(deleteButton()).toBeDisabled();
  await fireEvent.press(deleteButton());
  expect(mockDeleteAccount).not.toHaveBeenCalled();

  await fireEvent.changeText(input, 'ana_9');
  expect(deleteButton()).toBeDisabled();

  await fireEvent.changeText(input, '  ANA_92 ');
  expect(deleteButton()).toBeEnabled();
  await fireEvent.press(deleteButton());
  await waitFor(() => expect(mockDeleteAccount).toHaveBeenCalledTimes(1));
});
