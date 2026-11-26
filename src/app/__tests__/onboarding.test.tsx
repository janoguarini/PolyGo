import { act, fireEvent, render, screen } from '@testing-library/react-native';

import OnboardingScreen from '../onboarding';

const mockMutate = jest.fn();
const mockAvailable = jest.fn();

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(),
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
  NotificationFeedbackType: { Success: 'success', Error: 'error', Warning: 'warning' },
}));
jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
jest.mock('@/lib/sounds', () => ({ playSound: jest.fn() }));
jest.mock('@/features/profile/api', () => ({
  isUsernameAvailable: (name: string) => mockAvailable(name),
}));
jest.mock('@/features/profile/hooks', () => ({
  useCompleteOnboarding: () => ({ mutate: mockMutate, isPending: false, isError: false }),
}));

beforeEach(() => {
  mockMutate.mockReset();
  mockAvailable.mockReset().mockResolvedValue(true);
});

const press = (label: string | RegExp) => fireEvent.press(screen.getByText(label));

describe('registro gamificado', () => {
  it('recorre los pasos con banderas, niveles con emoji y la colección nueva, y se registra', async () => {
    await render(<OnboardingScreen />);
    expect(screen.getByText('¡Hola! 👋')).toBeTruthy();
    await press('¡Empecemos! 🚀');

    // Idiomas con bandera.
    expect(screen.getByText('¿Qué idioma querés aprender?')).toBeTruthy();
    expect(screen.getByText('🇺🇸')).toBeTruthy();
    expect(screen.getByText('🇮🇹')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Italiano'));
    await press('Continuar');

    // Niveles: los que no tienen contenido quedan bloqueados.
    expect(screen.getByText('🐣')).toBeTruthy();
    expect(screen.getByLabelText(/B1, Me defiendo, PRONTO/)).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('A2, Sé lo básico'));
    await press('Continuar');

    // Objetivo diario.
    await fireEvent.press(screen.getByLabelText('15 minutos al día, Serio'));
    await press('Continuar');

    // Avatar: la skin Clásica gratis y la colección nueva bloqueada (nada de los avatares viejos).
    expect(screen.getByText('✨ CLÁSICO · ¡GRATIS!')).toBeTruthy();
    expect(screen.queryByLabelText('Zorro violeta')).toBeNull();
    await fireEvent.press(screen.getByLabelText(/Dragón, .*bloqueada/));
    expect(screen.getByText(/Dragón: desbloqueala con 1300 Polys/)).toBeTruthy();
    await press('Continuar');

    // Nombre con la tarjeta de jugador en vivo.
    await fireEvent.changeText(screen.getByLabelText('Nombre de jugador'), 'polyfan');
    expect(screen.getByText('polyfan')).toBeTruthy();
    expect(screen.getByText('Italiano')).toBeTruthy();
    await act(async () => {
      await press('¡Empezar a jugar! 🎮');
    });

    expect(mockAvailable).toHaveBeenCalledWith('polyfan');
    expect(mockMutate).toHaveBeenCalledWith(
      {
        username: 'polyfan',
        avatarId: 'skin-classic',
        targetLanguage: 'it',
        startLevel: 'A2',
        dailyGoalMinutes: 15,
      },
      expect.anything(),
    );
  });

  it('mientras escribís: tilde verde si está libre', async () => {
    await render(<OnboardingScreen />);
    for (const label of ['¡Empecemos! 🚀', 'Continuar', 'Continuar', 'Continuar', 'Continuar']) {
      await press(label);
    }
    await fireEvent.changeText(screen.getByLabelText('Nombre de jugador'), 'libre_1');
    expect(await screen.findByText('✅ ¡libre_1 está disponible!')).toBeTruthy();
    expect(screen.getByLabelText('Nombre disponible')).toBeTruthy();
  });

  it('si ya existe, ofrece 3 parecidos libres y tocar uno lo deja elegido', async () => {
    // Ocupados: el pedido y cualquier variante con números; libres: el resto.
    mockAvailable.mockImplementation(async (n: string) => n !== 'juan' && !/\d/.test(n));
    await render(<OnboardingScreen />);
    for (const label of ['¡Empecemos! 🚀', 'Continuar', 'Continuar', 'Continuar', 'Continuar']) {
      await press(label);
    }
    await fireEvent.changeText(screen.getByLabelText('Nombre de jugador'), 'juan');
    expect(await screen.findByText('Ese nombre ya existe.')).toBeTruthy();
    expect(await screen.findByLabelText('Usar juan_pro')).toBeTruthy();
    expect(screen.getAllByLabelText(/^Usar /)).toHaveLength(3);
    expect(screen.queryByLabelText(/^Usar juan\d/)).toBeNull();

    await fireEvent.press(screen.getByLabelText('Usar juan_pro'));
    expect(await screen.findByText('✅ ¡juan_pro está disponible!')).toBeTruthy();
    expect(screen.queryByLabelText(/^Usar /)).toBeNull();
  });

  it('un nombre ocupado no registra y lo avisa', async () => {
    mockAvailable.mockResolvedValue(false);
    await render(<OnboardingScreen />);
    for (const label of ['¡Empecemos! 🚀', 'Continuar', 'Continuar', 'Continuar', 'Continuar']) {
      await press(label);
    }
    await fireEvent.changeText(screen.getByLabelText('Nombre de jugador'), 'ocupado');
    await act(async () => {
      await press('¡Empezar a jugar! 🎮');
    });
    expect(screen.getByText('Ese nombre ya está en uso.')).toBeTruthy();
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
