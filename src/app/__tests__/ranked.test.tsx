import { fireEvent, render, screen } from '@testing-library/react-native';

import RankedScreen from '../(tabs)/ranked';

// Disponibilidad de Ranked según la configuración de la build: cada test elige el estado.
let mockDisabled = false;
jest.mock('@/features/battle/availability', () => ({
  RANKED_UNAVAILABLE_TITLE: 'Ranked no está disponible en esta versión',
  get rankedDisabled() {
    return mockDisabled;
  },
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockPush(...args) },
  useNavigation: () => ({ addListener: () => () => {} }),
}));
jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
jest.mock('@/features/profile/hooks', () => ({
  useMyProfile: () => ({
    isPending: false,
    isError: false,
    isRefetching: false,
    data: { profile: { target_language: 'en' }, rating: null },
    refetch: jest.fn(),
  }),
  useActiveSeason: () => ({ data: null }),
}));
jest.mock('@/features/ranked/api', () => ({
  useMyLeaderboardPosition: () => ({ data: null, refetch: jest.fn() }),
}));
jest.mock('@/features/polys/PolysChip', () => ({ PolysChip: () => null }));
jest.mock('@/lib/useTabPressScroll', () => ({ useTabPressScroll: () => {} }));

beforeEach(() => mockPush.mockClear());

describe('pestaña Ranked', () => {
  it('disponible: ofrece buscar partida y practicar, y no muestra el aviso', async () => {
    mockDisabled = false;
    await render(<RankedScreen />);

    expect(screen.queryByText('Ranked no está disponible en esta versión')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Buscar partida' }));
    expect(mockPush).toHaveBeenLastCalledWith({ pathname: '/battle', params: { mode: 'ranked' } });
    await fireEvent.press(screen.getByRole('button', { name: 'Practicar sin ELO' }));
    expect(mockPush).toHaveBeenLastCalledWith({
      pathname: '/battle',
      params: { mode: 'practice' },
    });
  });

  it('un único modo, Word Rush, sin textos explicativos (sin selector ni Arcade)', async () => {
    mockDisabled = false;
    await render(<RankedScreen />);

    expect(screen.getAllByText('Word Rush').length).toBeGreaterThan(0);
    // Ni el resumen de 60 s ni la lista de formatos: sólo el modo y los botones.
    expect(screen.queryByText(/cuatro formatos/)).toBeNull();
    expect(screen.queryByLabelText(/^Formatos de la partida/)).toBeNull();
    expect(screen.queryByText(/Swipe Battle|Connect Battle|Sentence Rush|Audio Blitz/)).toBeNull();
    expect(screen.getByRole('button', { name: 'Buscar partida' })).toBeTruthy();
    // Ni texto visible ni etiqueta de accesibilidad nombran a Arcade como modo.
    expect(screen.queryByText(/arcade/i)).toBeNull();
    expect(screen.queryByLabelText(/arcade/i)).toBeNull();
    expect(screen.queryByHintText(/arcade/i)).toBeNull();
  });

  it('deshabilitado: muestra el aviso y no ofrece Ranked ni Práctica', async () => {
    mockDisabled = true;
    await render(<RankedScreen />);

    expect(screen.getByText('Ranked no está disponible en esta versión')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Buscar partida' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Practicar sin ELO' })).toBeNull();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    'los desafíos con amigos siguen disponibles (Ranked deshabilitado: %s)',
    async (disabled) => {
      mockDisabled = disabled;
      await render(<RankedScreen />);

      await fireEvent.press(screen.getByRole('button', { name: 'Desafiar a un amigo' }));
      expect(mockPush).toHaveBeenLastCalledWith('/challenge-friend');
      expect(screen.getByRole('button', { name: 'Tengo un código' })).toBeTruthy();
    },
  );
});
