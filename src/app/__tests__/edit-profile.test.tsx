import { fireEvent, render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import EditProfileScreen from '../edit-profile';

const mockBuy = jest.fn();
const mockEquip = jest.fn();
const mockUpdate = jest.fn();
const mockBack = jest.fn();
let mockBalance = 10_071;
let mockOwned: string[] = [];

const profile = {
  id: 'me',
  username: 'janitogap',
  display_name: 'janitogap',
  avatar_id: 'panda-yellow',
  avatar_path: null,
  frame_id: null,
  background_id: null as string | null,
  region: 'AR',
  daily_goal_minutes: 10,
  target_language: 'en',
};

jest.mock('@/lib/sounds', () => ({ playSound: jest.fn() }));
jest.mock('@/features/profile/components/ProfileHeader', () => ({ ProfileHeader: () => null }));
jest.mock('expo-router', () => ({ router: { back: () => mockBack() } }));
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  NotificationFeedbackType: { Success: 'success' },
}));
jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
jest.mock('@/features/auth/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'me' } } }),
}));
jest.mock('@/features/profile/hooks', () => ({
  useMyProfile: () => ({ data: { profile, rating: null }, isPending: false, isError: false }),
  useUpdateProfile: () => ({ mutateAsync: (...a: unknown[]) => mockUpdate(...a) }),
}));
jest.mock('@/features/cosmetics/api', () => ({
  buyCosmetic: (...a: unknown[]) => mockBuy(...a),
  equipCosmetic: (...a: unknown[]) => mockEquip(...a),
  useOwnedCosmetics: () => ({ data: mockOwned, isPending: false, isError: false }),
  useBuyCosmetic: () => ({ mutate: jest.fn(), isPending: false }),
  useEquipCosmetic: () => ({ mutate: jest.fn(), isPending: false }),
}));
jest.mock('@/features/polys/api', () => ({
  usePolys: () => ({ data: { balance: mockBalance, granted: [] } }),
}));
jest.mock('@/features/plus/api', () => ({ usePlus: () => false }));
jest.mock('@/features/xp/api', () => ({ useXp: () => ({ data: null }) }));
jest.mock('@/features/xp/previewGate', () => ({ qaReadOnly: false }));
jest.mock('@/features/profile/avatarUpload', () => ({
  pickAvatarPhoto: jest.fn(),
  uploadAvatarPhoto: jest.fn(),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

beforeEach(() => {
  mockBalance = 10_071;
  mockOwned = [];
  profile.background_id = null;
  mockBuy.mockReset().mockResolvedValue({ balance: 9871, item_id: 'bg_forest', equipped: true });
  mockEquip.mockReset().mockResolvedValue(undefined);
  mockUpdate.mockReset().mockResolvedValue(undefined);
  mockBack.mockReset();
});

async function tryOn(name: string) {
  await render(<EditProfileScreen />, { wrapper });
  await fireEvent.press(screen.getByText('Fondos'));
  await fireEvent.press(screen.getByText(name));
}

describe('personalización: probar y comprar al guardar', () => {
  it('el botón dice cuánto sale y al guardar compra lo que estás probando', async () => {
    await tryOn('Bosque');
    expect(screen.getByText('Comprar y guardar · 200')).toBeTruthy();
    expect(screen.getByText(/Al guardar se compra Bosque/)).toBeTruthy();

    await fireEvent.press(screen.getByText('Comprar y guardar · 200'));
    expect(mockBuy).toHaveBeenCalledWith('bg_forest');
    expect(mockBack).toHaveBeenCalled();
  });

  it('sin Polys suficientes no deja comprar y dice cuánto falta', async () => {
    mockBalance = 50;
    await tryOn('Bosque');
    expect(screen.getByText('Te faltan 150 Polys para comprarlo.')).toBeTruthy();
    await fireEvent.press(screen.getByText('Comprar y guardar · 200'));
    expect(mockBuy).not.toHaveBeenCalled();
  });
});

describe('probar un avatar cambia sólo el avatar', () => {
  it('el fondo queda como estaba; si no combina con la skin, se avisa antes de guardar', async () => {
    mockOwned = ['bg_forest'];
    profile.background_id = 'bg_forest';
    await render(<EditProfileScreen />, { wrapper });
    await fireEvent.press(screen.getByText('Titán'));
    // Titán no combina con Bosque: no se lo saca en la vista previa, se avisa.
    expect(
      screen.getByText('Bosque no combina con Titán: al guardar vuelve al básico.'),
    ).toBeTruthy();
    expect(screen.getByText('Comprar y guardar · 2000')).toBeTruthy();
  });
});
