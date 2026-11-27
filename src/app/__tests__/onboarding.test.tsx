import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { __setInterfaceLanguageForTests } from '@/i18n';

import OnboardingScreen, { onboardingLanguages } from '../onboarding';

const mockMutate = jest.fn();
const mockAvailable = jest.fn();
const mockSaveUi = jest.fn();

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
jest.mock('@/features/courses/hooks', () => ({
  useChooseInterfaceLanguage: () => (lang: string) => mockSaveUi(lang),
}));
jest.mock('@/features/profile/hooks', () => ({
  useCompleteOnboarding: () => ({ mutate: mockMutate, isPending: false, isError: false }),
}));

beforeEach(() => {
  mockMutate.mockReset();
  mockAvailable.mockReset().mockResolvedValue(true);
  mockSaveUi.mockReset().mockResolvedValue('saved');
  __setInterfaceLanguageForTests('es');
});

const press = (label: string | RegExp) => fireEvent.press(screen.getByText(label));

/** Bienvenida → Italiano → nivel → objetivo → avatar → nombre (con los textos en español). */
async function toUsernameStep() {
  await press('¡Empecemos! 🚀');
  await fireEvent.press(screen.getByLabelText('Italiano'));
  for (let i = 0; i < 4; i++) await press('Continuar');
}

describe('registro gamificado', () => {
  it('recorre los pasos con banderas, niveles con emoji y la colección nueva, y se registra', async () => {
    await render(<OnboardingScreen />);
    expect(screen.getByText('¡Hola! 👋')).toBeTruthy();
    await press('¡Empecemos! 🚀');

    // Idiomas con bandera.
    expect(screen.getByText('¿Qué idioma quieres aprender?')).toBeTruthy();
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
    expect(screen.getByText(/Dragón: desbloquéala con 1300 Polys/)).toBeTruthy();
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
    await toUsernameStep();
    await fireEvent.changeText(screen.getByLabelText('Nombre de jugador'), 'libre_1');
    expect(await screen.findByText('✅ ¡libre_1 está disponible!')).toBeTruthy();
    expect(screen.getByLabelText('Nombre disponible')).toBeTruthy();
  });

  it('si ya existe, ofrece 3 parecidos libres y tocar uno lo deja elegido', async () => {
    // Ocupados: el pedido y cualquier variante con números; libres: el resto.
    mockAvailable.mockImplementation(async (n: string) => n !== 'juan' && !/\d/.test(n));
    await render(<OnboardingScreen />);
    await toUsernameStep();
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
    await toUsernameStep();
    await fireEvent.changeText(screen.getByLabelText('Nombre de jugador'), 'ocupado');
    await act(async () => {
      await press('¡Empezar a jugar! 🎮');
    });
    expect(screen.getByText('Ese nombre ya está en uso.')).toBeTruthy();
    expect(mockMutate).not.toHaveBeenCalled();
  });
});

describe('registro en otros idiomas de interfaz', () => {
  afterAll(() => __setInterfaceLanguageForTests('es'));

  it('no preelige idioma: sin elegir, no se puede seguir', async () => {
    await render(<OnboardingScreen />);
    await press('¡Empecemos! 🚀');
    await press('Continuar');
    // Sigue en el paso del idioma.
    expect(screen.getByText('¿Qué idioma quieres aprender?')).toBeTruthy();
  });

  it('cambiar el idioma de la app en la bienvenida traduce el registro al instante', async () => {
    await render(<OnboardingScreen />);
    await fireEvent.press(screen.getByLabelText('Idioma de la app: Italiano'));
    expect(screen.getByText('Ciao! 👋')).toBeTruthy();
    expect(screen.getByText('Impara le lingue giocando con PolyGo')).toBeTruthy();
    expect(screen.queryByText('¡Hola! 👋')).toBeNull();
  });

  it.each([
    ['en', 'Let’s go! 🚀', 'Which language do you want to learn?', 'Italian, Taught in Spanish'],
    ['pt-BR', 'Vamos lá! 🚀', 'Qual idioma você quer aprender?', 'Inglês, Explicado em espanhol'],
    ['it', 'Cominciamo! 🚀', 'Quale lingua vuoi imparare?', 'Inglese, Spiegato in spagnolo'],
  ] as const)('%s: todo el recorrido sale en ese idioma', async (ui, start, ask, tile) => {
    __setInterfaceLanguageForTests(ui);
    await render(<OnboardingScreen />);
    await press(start);
    expect(screen.getByText(ask)).toBeTruthy();
    await fireEvent.press(screen.getByLabelText(tile));
    // Ningún texto de la pantalla queda en español.
    const texts = screen.toJSON() ? JSON.stringify(screen.toJSON()) : '';
    expect(texts).not.toMatch(/quieres|Continuar el|¿|¡|Elige|Empiezas/);
  });

  it('pt-BR: completa el registro y guarda el idioma de la app en el perfil', async () => {
    __setInterfaceLanguageForTests('pt-BR');
    mockMutate.mockImplementation((_input, opts: { onSuccess: () => void }) => opts.onSuccess());
    await render(<OnboardingScreen />);
    await press('Vamos lá! 🚀');
    await fireEvent.press(screen.getByLabelText('Italiano, Explicado em espanhol'));
    await press('Continuar');
    expect(screen.getByLabelText(/B1, Me viro bem, EM BREVE/)).toBeTruthy();
    await press('Continuar');
    expect(screen.getByLabelText('10 minutos por dia, Constante')).toBeTruthy();
    await press('Continuar');
    expect(screen.getByText('✨ CLÁSSICO · GRÁTIS!')).toBeTruthy();
    await press('Continuar');
    await fireEvent.changeText(screen.getByLabelText('Nome de jogador'), 'brasuca');
    expect(screen.getByText('JOGADOR')).toBeTruthy();
    await act(async () => {
      await press('Começar a jogar! 🎮');
    });
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'brasuca', targetLanguage: 'it' }),
      expect.anything(),
    );
    expect(mockSaveUi).toHaveBeenCalledWith('pt-BR');
  });

  it('no ofrece aprender el idioma propio y sí el español a quien no lo habla', () => {
    const codes = (ui: Parameters<typeof onboardingLanguages>[0]) =>
      onboardingLanguages(ui).map((l) => l.code);
    expect(codes('es')).not.toContain('es');
    expect(codes('en')).not.toContain('en');
    expect(codes('en')).toContain('es');
    expect(codes('pt-BR')).not.toContain('pt');
    expect(codes('it')).not.toContain('it');
    expect(codes('it')).toContain('en');
  });
});
