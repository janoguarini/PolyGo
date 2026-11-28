import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { __setInterfaceLanguageForTests } from '@/i18n';

import OnboardingScreen, { onboardingCourses } from '../onboarding';

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
  await fireEvent.press(screen.getByLabelText('Italiano, A1–A2'));
  for (let i = 0; i < 4; i++) await press('Continuar');
}

describe('registro gamificado', () => {
  it('recorre los pasos con banderas, niveles con emoji y la colección nueva, y se registra', async () => {
    await render(<OnboardingScreen />);
    expect(screen.getByText('¡Hola! 👋')).toBeTruthy();
    await press('¡Empecemos! 🚀');

    // Cursos con bandera, agrupados por el idioma que hablás: el de la app arriba y abierto.
    expect(screen.getByText('¿Qué idioma quieres aprender?')).toBeTruthy();
    expect(screen.getByText('Idiomas para hablantes de español')).toBeTruthy();
    expect(screen.getByText('Idiomas para hablantes de inglés')).toBeTruthy();
    // La bandera de EE. UU. va en el curso de inglés y en la sección de quien habla inglés.
    expect(screen.getAllByText('🇺🇸')).toHaveLength(2);
    // La de Italia, en el curso de italiano y en la sección de quien habla italiano.
    expect(screen.getAllByText('🇮🇹')).toHaveLength(2);
    expect(screen.getByText('Idiomas para hablantes de portugués')).toBeTruthy();
    expect(screen.getByText('Idiomas para hablantes de italiano')).toBeTruthy();
    expect(screen.getByText('Idiomas para hablantes de francés')).toBeTruthy();
    // El español (para hablantes de inglés) queda dentro de su sección, cerrada.
    expect(screen.queryByLabelText('Español, A1–A2')).toBeNull();
    await fireEvent.press(screen.getByLabelText('Italiano, A1–A2'));
    expect(screen.getByLabelText('Italiano, A1–A2').props.accessibilityState).toMatchObject({
      selected: true,
    });
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
    [
      'en',
      'Let’s go! 🚀',
      'Which language do you want to learn?',
      'Spanish, A1–A2',
      'For English speakers',
    ],
    [
      'pt-BR',
      'Vamos lá! 🚀',
      'Qual idioma você quer aprender?',
      'Inglês, A1–B1',
      'Para quem fala português',
    ],
    [
      'it',
      'Cominciamo! 🚀',
      'Quale lingua vuoi imparare?',
      'Inglese, A1–B1',
      'Per chi parla italiano',
    ],
    [
      'fr',
      'C’est parti ! 🚀',
      'Quelle langue veux-tu apprendre ?',
      'Anglais, A1–B1',
      'Pour les francophones',
    ],
  ] as const)('%s: todo el recorrido sale en ese idioma', async (ui, start, ask, tile, first) => {
    __setInterfaceLanguageForTests(ui);
    await render(<OnboardingScreen />);
    await press(start);
    expect(screen.getByText(ask)).toBeTruthy();
    // Arriba y abierta, la sección del idioma de la app, con su curso de inglés (A1–B1).
    expect(screen.getByText(first)).toBeTruthy();
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
    // El italiano (para hablantes de español) está en su sección, cerrada: se abre con un toque.
    await fireEvent.press(
      screen.getByRole('button', { name: 'Para quem fala espanhol, 5 cursos' }),
    );
    await fireEvent.press(screen.getByLabelText('Italiano, A1–A2'));
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

  it('en inglés: el curso de español arriba y abierto; los de español, cerrados y a un toque', async () => {
    __setInterfaceLanguageForTests('en');
    await render(<OnboardingScreen />);
    await press('Let’s go! 🚀');
    const sections = screen.getAllByRole('button', { name: /^For .* speakers, / });
    expect(sections.map((x) => x.props.accessibilityLabel)).toEqual([
      'For English speakers, 1 course',
      'For Spanish speakers, 5 courses',
      'For Portuguese speakers, 1 course',
      'For Italian speakers, 1 course',
      'For French speakers, 1 course',
    ]);
    expect(screen.getByLabelText('Spanish, A1–A2')).toBeTruthy();
    expect(screen.queryByLabelText('Italian, A1–A2')).toBeNull();
    await fireEvent.press(sections[1]!);
    await fireEvent.press(screen.getByLabelText('Italian, A1–A2'));
    for (let i = 0; i < 4; i++) await press('Continue');
    await fireEvent.changeText(screen.getByLabelText('Player name'), 'yankee');
    expect(screen.getByText('Italian')).toBeTruthy();
  });

  it('los cursos del registro: agrupados por origen, primero el de la app y abierto', () => {
    const view = (ui: Parameters<typeof onboardingCourses>[0]) =>
      onboardingCourses(ui).map((s) => [s.source, s.expanded, s.courses.map((c) => c.course.code)]);
    expect(view('es')).toEqual([
      ['es', true, ['en-from-es', 'fr-from-es', 'it-from-es', 'pt-from-es', 'zh-from-es']],
      ['en', false, ['es-from-en']],
      ['pt', false, ['en-from-pt']],
      ['it', false, ['en-from-it']],
      ['fr', false, ['en-from-fr']],
    ]);
    expect(view('en').map(([s, e]) => [s, e])).toEqual([
      ['en', true],
      ['es', false],
      ['pt', false],
      ['it', false],
      ['fr', false],
    ]);
    // Portugués, italiano y francés: su sección arriba y abierta, con el único curso (inglés).
    for (const [ui, source] of [
      ['pt-BR', 'pt'],
      ['it', 'it'],
      ['fr', 'fr'],
    ] as const) {
      const sections = view(ui);
      expect(sections[0]).toEqual([source, true, [`en-from-${source}`]]);
      expect(sections.slice(1).map(([s, e]) => [s, e])).toEqual(
        (['es', 'en', 'pt', 'it', 'fr'] as const)
          .filter((s) => s !== source)
          .map((s) => [s, false]),
      );
    }
  });

  it('pt-BR: el inglés para hablantes de portugués se registra con su curso', async () => {
    __setInterfaceLanguageForTests('pt-BR');
    mockMutate.mockImplementation((_input, opts: { onSuccess: () => void }) => opts.onSuccess());
    await render(<OnboardingScreen />);
    await press('Vamos lá! 🚀');
    await fireEvent.press(screen.getByLabelText('Inglês, A1–B1'));
    for (let i = 0; i < 4; i++) await press('Continuar');
    await fireEvent.changeText(screen.getByLabelText('Nome de jogador'), 'brasuca');
    await act(async () => {
      await press('Começar a jogar! 🎮');
    });
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ targetLanguage: 'en', courseCode: 'en-from-pt' }),
      expect.anything(),
    );
  });
});
