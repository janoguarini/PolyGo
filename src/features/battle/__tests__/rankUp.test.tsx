import { fireEvent, render, screen } from '@testing-library/react-native';

import type { BattleFinish, PlayerResult } from '@shared/protocol';

import { Text } from '@/design-system';
import { __setInterfaceLanguageForTests } from '@/i18n';

import { BattleResult } from '../components/BattleResult';
import { rankUpKind } from '../components/RankUpCelebration';
import { resultFoxSize } from '../components/ResultHero';

jest.mock('@/lib/sounds', () => ({ playSound: jest.fn() }));
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Error: 'error', Warning: 'warning' },
}));
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));
// Con «reducir movimiento» (como el mock global): el rango nuevo se ve enseguida, sin partículas.
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
    interpolate: (_value: number, _input: number[], output: number[]) => output[0],
    Easing: {
      out: (f: unknown) => f,
      in: (f: unknown) => f,
      inOut: (f: unknown) => f,
      cubic: () => 0,
      quad: () => 0,
      linear: () => 0,
    },
    FadeIn: animation(),
    FadeInDown: animation(),
    FadeInUp: animation(),
    FadeOut: animation(),
    FadeOutUp: animation(),
    ZoomIn: animation(),
  };
});

beforeEach(() => __setInterfaceLanguageForTests('es'));

describe('cuándo se celebra un ascenso', () => {
  it('subir de división (Bronce III → Bronce II), de rango (Bronce → Plata) o entrar al ranking', () => {
    expect(rankUpKind(182, 200, true, true)).toBe('division');
    expect(rankUpKind(390, 410, true, true)).toBe('tier');
    expect(rankUpKind(100, 116, false, true)).toBe('placed');
  });

  it('no se celebra si no subiste de escalón, bajaste, perdiste sin posicionar o no hubo ELO', () => {
    expect(rankUpKind(200, 215, true, true)).toBeNull();
    expect(rankUpKind(200, 182, true, false)).toBeNull();
    expect(rankUpKind(100, 100, false, false)).toBeNull();
    expect(rankUpKind(null, null, true, true)).toBeNull();
    expect(rankUpKind(182, null, true, true)).toBeNull();
  });
});

const line = (over: Partial<PlayerResult>): PlayerResult => ({
  slot: 1,
  username: 'ana',
  isBot: false,
  score: 11_554,
  correct: 38,
  answered: 40,
  outcome: 'win',
  forfeited: false,
  ratingBefore: 182,
  ratingAfter: 200,
  placedBefore: true,
  ...over,
});

const finish = (me: Partial<PlayerResult>, over: Partial<BattleFinish> = {}): BattleFinish => ({
  battleId: 'b1',
  mode: 'ranked',
  status: 'completed',
  yourSlot: 1,
  players: [
    line(me),
    line({
      slot: 2,
      username: 'Maximiliano Gil',
      isBot: true,
      score: 9_650,
      outcome: 'loss',
      ratingBefore: null,
      ratingAfter: null,
    }),
  ],
  achievementsUnlocked: [],
  rating: 'competitive',
  calibration: null,
  ...over,
});

describe('celebración en el resultado', () => {
  it('al subir de división muestra «¡ASCENDISTE!», el rango nuevo y de dónde venís; «¡Vamos!» la cierra', async () => {
    await render(<BattleResult result={finish({})} onPlayAgain={jest.fn()} onExit={jest.fn()} />);
    expect(screen.getByText('¡ASCENDISTE!')).toBeTruthy();
    // En la celebración y en la tarjeta de rango de abajo.
    expect(screen.getAllByText('Bronce II')).toHaveLength(2);
    expect(screen.getByText('Dejaste atrás Bronce III')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: '¡Vamos!' }));
    expect(screen.queryByText('¡ASCENDISTE!')).toBeNull();
    expect(screen.getAllByText('Bronce II')).toHaveLength(1);
    // Debajo sigue el resultado de siempre.
    expect(screen.getByText('Ascendiste a')).toBeTruthy();
  });

  it('al llegar a un rango nuevo dice «¡NUEVO RANGO!»', async () => {
    await render(
      <BattleResult
        result={finish({ ratingBefore: 390, ratingAfter: 410 })}
        onPlayAgain={jest.fn()}
        onExit={jest.fn()}
      />,
    );
    expect(screen.getByText('¡NUEVO RANGO!')).toBeTruthy();
    expect(screen.getByText('Dejaste atrás Bronce I')).toBeTruthy();
  });

  it('sin subir de escalón, sin ELO o en un amistoso no hay celebración', async () => {
    const cases: BattleFinish[] = [
      finish({ ratingBefore: 200, ratingAfter: 215 }),
      finish({ ratingBefore: null, ratingAfter: null }, { rating: 'unrated' }),
      finish({}, { friendly: true }),
    ];
    for (const result of cases) {
      const view = await render(
        <BattleResult result={result} onPlayAgain={jest.fn()} onExit={jest.fn()} />,
      );
      expect(screen.queryByText('¡ASCENDISTE!')).toBeNull();
      expect(screen.queryByText('¡NUEVO RANGO!')).toBeNull();
      await view.unmount();
    }
  });
});

describe('XP en el resultado de la partida', () => {
  it('la recompensa (tarjeta de XP) se muestra en el resultado', async () => {
    await render(
      <BattleResult
        result={finish({ ratingBefore: 200, ratingAfter: 215 })}
        onPlayAgain={jest.fn()}
        onExit={jest.fn()}
        reward={<Text>+30 XP</Text>}
      />,
    );
    expect(screen.getByText('+30 XP')).toBeTruthy();
    // Va debajo del encabezado, antes del marcador de la partida.
    const tree = JSON.stringify(screen.toJSON());
    expect(tree.indexOf('+30 XP')).toBeLessThan(tree.indexOf('Maximiliano Gil'));
  });
});

describe('el rango siempre se ve sin scrollear', () => {
  it('el zorro usa sólo lo que sobra después de reservar el título y el rango', () => {
    // iPhone 14/15/16 (852 pt menos zonas seguras ≈ 759): zorro mediano y el rango entra entero.
    expect(resultFoxSize(759, true)).toBe(229);
    // Pantallas altas: tope de 320.
    expect(resultFoxSize(1_000, true)).toBe(320);
    // Pantalla chica (iPhone SE ≈ 627): no entra, se oculta y queda el rango a la vista.
    expect(resultFoxSize(627, true)).toBe(0);
    // Sin ELO no hay tarjetas de rango: el zorro puede ser más grande.
    expect(resultFoxSize(759, false)).toBe(320);
  });
});
