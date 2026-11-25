import { fireEvent, render, screen } from '@testing-library/react-native';

import type { XpState } from '@/features/xp/api';
import { resetXpAnnouncements, xpAnnouncementsSuppressed } from '@/features/xp/announce';
import { XpRewardCard } from '@/features/xp/XpRewardCard';
import { __setInterfaceLanguageForTests } from '@/i18n';

import { SessionResults, sessionStars } from '../components/SessionResults';
import type { SessionStats } from '../player';

jest.mock('@/lib/sounds', () => ({ playSound: jest.fn() }));
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  selectionAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success' },
}));
// La XP que devuelve el servidor (sync_xp), controlada por cada test.
let mockXp: XpState | null | undefined;
jest.mock('@/features/xp/api', () => ({
  ...jest.requireActual('@/features/xp/api'),
  useXp: () => ({ data: mockXp, isError: false, refetch: jest.fn() }),
}));
// Con «reducir movimiento»: los números y la barra muestran el valor final enseguida.
jest.mock('react-native-reanimated', () => {
  const { View, Text, ScrollView } = jest.requireActual('react-native');
  const animation = () => {
    const builder: Record<string, () => unknown> = {};
    for (const method of ['duration', 'delay', 'springify', 'damping', 'easing']) {
      builder[method] = () => builder;
    }
    return builder;
  };
  const Animated = { View, Text, ScrollView, createAnimatedComponent: (c: unknown) => c };
  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    useSharedValue: (value: unknown) => ({ value }),
    useAnimatedStyle: (fn: () => object) => fn(),
    useReducedMotion: () => true,
    withTiming: (value: unknown) => value,
    withRepeat: (value: unknown) => value,
    withSpring: (value: unknown) => value,
    withSequence: (...values: unknown[]) => values[values.length - 1],
    withDelay: (_: number, value: unknown) => value,
    Easing: {
      out: (f: unknown) => f,
      in: (f: unknown) => f,
      inOut: (f: unknown) => f,
      cubic: () => 0,
      quad: () => 0,
      linear: () => 0,
    },
    FadeIn: animation(),
    FadeInUp: animation(),
    FadeOutUp: animation(),
    ZoomIn: animation(),
  };
});

const xpState = (over: Partial<XpState>): XpState => ({
  total: 100,
  level: 3,
  into: 20,
  need: 80,
  remaining: 60,
  level_before: 3,
  initial: false,
  granted: [],
  granted_total: 0,
  ...over,
});

beforeEach(() => {
  __setInterfaceLanguageForTests('es');
  resetXpAnnouncements();
  mockXp = undefined;
});

describe('estrellas de la sesión', () => {
  it('3 perfecta, 2 desde 80 %, 1 desde 50 %, 0 por debajo', () => {
    expect(sessionStars(1)).toBe(3);
    expect(sessionStars(0.85)).toBe(2);
    expect(sessionStars(0.5)).toBe(1);
    expect(sessionStars(0.3)).toBe(0);
  });
});

const stats: SessionStats = {
  total: 8,
  firstTryCorrect: 8,
  accuracy: 1,
  mistakes: [],
} as unknown as SessionStats;

describe('resultados de la sesión', () => {
  it('se puede seguir enseguida, aunque el progreso todavía se esté guardando', async () => {
    const onPrimary = jest.fn();
    await render(
      <SessionResults
        title="Per favore y grazie"
        stats={stats}
        durationSeconds={32}
        words={{}}
        saving
        saveError={null}
        saved={false}
        achievements={[]}
        onRetrySave={jest.fn()}
        primaryLabel="Siguiente lección"
        onPrimary={onPrimary}
        onExit={jest.fn()}
        reward={null}
      />,
    );
    expect(screen.getByText('¡Perfecto!')).toBeTruthy();
    expect(screen.getByLabelText('3 estrellas de 3')).toBeTruthy();
    expect(screen.getByText('100%')).toBeTruthy();
    expect(screen.getByText('8/8')).toBeTruthy();
    expect(screen.getByText('32 s')).toBeTruthy();
    const next = screen.getByRole('button', { name: 'Siguiente lección' });
    expect(next).not.toBeDisabled();
    await fireEvent.press(next);
    expect(onPrimary).toHaveBeenCalledTimes(1);
  });
});

describe('XP ganada en los resultados', () => {
  it('mientras se guarda: «Sumando experiencia…» con el nivel de antes; y tapa el aviso global', async () => {
    const before = xpState({});
    mockXp = before;
    const view = await render(<XpRewardCard before={before} saved={false} />);
    expect(screen.getByText('Sumando experiencia…')).toBeTruthy();
    expect(screen.getByText('Nivel 3')).toBeTruthy();
    expect(xpAnnouncementsSuppressed()).toBe(true);
    await view.unmount();
    expect(xpAnnouncementsSuppressed()).toBe(false);
  });

  it('guardada la sesión: «+20 XP» y la barra en el valor nuevo', async () => {
    const before = xpState({});
    mockXp = before;
    const view = await render(<XpRewardCard before={before} saved={false} />);
    mockXp = xpState({ total: 120, into: 40, granted_total: 20 });
    await view.rerender(<XpRewardCard before={before} saved />);
    expect(screen.getByText('+20 XP')).toBeTruthy();
    expect(screen.getByText('40 / 80 XP')).toBeTruthy();
    expect(screen.getByLabelText('Ganaste 20 de experiencia. Nivel 3')).toBeTruthy();
  });

  it('si subís de nivel lo festeja: «¡SUBISTE AL NIVEL 4!»', async () => {
    const before = xpState({ total: 170, into: 70 });
    mockXp = before;
    const view = await render(<XpRewardCard before={before} saved={false} />);
    mockXp = xpState({ total: 190, level: 4, into: 10, need: 95, level_before: 3 });
    await view.rerender(<XpRewardCard before={before} saved />);
    expect(screen.getByText('¡SUBISTE AL NIVEL 4!')).toBeTruthy();
    expect(screen.getByText('Nivel 4')).toBeTruthy();
    expect(screen.getByText('+20 XP')).toBeTruthy();
  });

  it('sin XP en el servidor (o sin dato de antes) no muestra nada', async () => {
    await render(<XpRewardCard before={null} saved />);
    expect(screen.queryByText(/XP/)).toBeNull();
  });
});
