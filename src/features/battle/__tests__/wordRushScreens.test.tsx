import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import type { ArcadeSnapshot, ChallengeView } from '@shared/arcade';
import type { BattleFinish, BattleSnapshot, PlayerResult } from '@shared/protocol';

import { MatchHistoryItem } from '@/features/profile/components/MatchHistoryItem';
import { __setInterfaceLanguageForTests } from '@/i18n';

import { ArcadeLobby } from '../arcade/ArcadeLobby';
import { ArcadeStage } from '../arcade/ArcadeStage';
import { BattleResult } from '../components/BattleResult';
import { battleReducer, initialBattleState, type BattleState } from '../state';

jest.mock('@/features/learning/speech', () => ({ speak: jest.fn(), stopSpeaking: jest.fn() }));
jest.mock('@/lib/sounds', () => ({ playSound: jest.fn() }));
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Error: 'error', Warning: 'warning' },
}));
// El idioma de la sesión (voz y pinyin) lo cubren sus propios tests: acá sólo se pasa a los hijos.
jest.mock('@/features/learning/SessionLanguageProvider', () => ({
  SessionLanguageProvider: ({ children }: { children: ReactNode }) => children,
}));
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));
// El mock global (jest.setup.ts) no trae las animaciones de entrada/salida que usa el juego: se
// extiende sólo para este archivo, con el mismo criterio (sin runtime nativo, animaciones inmediatas).
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
    Easing: { out: (f: unknown) => f, cubic: () => 0, quad: () => 0, linear: () => 0 },
    FadeIn: animation(),
    FadeInDown: animation(),
    FadeInUp: animation(),
    FadeOut: animation(),
    FadeOutUp: animation(),
    ZoomIn: animation(),
  };
});

beforeEach(() => __setInterfaceLanguageForTests('es'));

const arcadeSnap = (over: Partial<ArcadeSnapshot> = {}): ArcadeSnapshot => ({
  challenges: [],
  current: 0,
  combo: 0,
  bestCombo: 0,
  frenzyAt: null,
  durationMs: 60_000,
  ...over,
});

const snapshot = (over: Partial<BattleSnapshot> = {}): BattleSnapshot => ({
  battleId: 'b1',
  mode: 'ranked',
  status: 'matched',
  yourSlot: 1,
  players: [
    { slot: 1, username: 'ana', avatarId: 'bolt', rating: 1000, gamesPlayed: 4 },
    { slot: 2, username: 'Kiko', avatarId: 'flame', rating: 1020, gamesPlayed: 40, isBot: true },
  ],
  serverNow: 100_000,
  readyDeadline: 110_000,
  startsAt: null,
  endsAt: null,
  question: null,
  scores: [
    { slot: 1, score: 0, correct: 0, answered: 0, connected: true },
    { slot: 2, score: 0, correct: 0, answered: 0, connected: true },
  ],
  arcade: arcadeSnap(),
  ...over,
});

/** Estado como lo deja la foto del servidor, con el reloj local igual al del servidor. */
const fromSnapshot = (s: BattleSnapshot): BattleState =>
  battleReducer(battleReducer(initialBattleState, { type: 'joined', mode: s.mode }), {
    type: 'snapshot',
    snapshot: s,
    receivedAt: s.serverNow,
  });

/** Todo lo que se dibujó (textos y etiquetas de accesibilidad), para buscar nombres prohibidos. */
const allText = () => JSON.stringify(screen.toJSON());

describe('Word Rush antes de jugar (identidad oscura, un solo modo)', () => {
  it('rival encontrado: Word Rush de 60 s, sin formatos ni reglas, y la nota corta de ELO', async () => {
    const onReady = jest.fn();
    const state = fromSnapshot(snapshot({ rating: 'unrated', calibration: null }));
    await render(<ArcadeLobby state={state} now={100_000} onReady={onReady} />);
    expect(screen.getByText('¡Rival encontrado!')).toBeTruthy();
    expect(screen.getByText('Word Rush')).toBeTruthy();
    expect(screen.getByText('60 s')).toBeTruthy();
    expect(screen.queryByLabelText(/^Formatos de la partida/)).toBeNull();
    expect(screen.queryByText(/cuatro formatos/)).toBeNull();
    expect(screen.getByText('Partida sin ELO: ganes o pierdas, tu ELO no cambia.')).toBeTruthy();
    expect(screen.getByText('Confirma en 10 s o la partida se cancela.')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: '¡Listo!' }));
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(allText()).not.toMatch(/arcade/i);
  });

  it('después de confirmar espera al rival (el botón queda deshabilitado)', async () => {
    const state = { ...fromSnapshot(snapshot()), iAmReady: true };
    await render(<ArcadeLobby state={state} now={100_000} onReady={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Esperando a tu rival…' })).toBeDisabled();
  });

  it('cuenta regresiva del servidor: 3, 2, 1 y «¡Ya!»', async () => {
    const state = fromSnapshot(
      snapshot({ status: 'ready', startsAt: 103_000, endsAt: 163_000, readyDeadline: null }),
    );
    expect(state.phase).toBe('countdown');
    const { rerender } = await render(
      <ArcadeLobby state={state} now={100_000} onReady={jest.fn()} />,
    );
    expect(screen.getByLabelText('Empieza en 3')).toBeTruthy();
    expect(screen.getByText('Prepárate')).toBeTruthy();
    await rerender(<ArcadeLobby state={state} now={102_100} onReady={jest.fn()} />);
    expect(screen.getByLabelText('Empieza en 1')).toBeTruthy();
    await rerender(<ArcadeLobby state={state} now={103_000} onReady={jest.fn()} />);
    expect(screen.getByText('¡Ya!')).toBeTruthy();
  });

  it('en inglés también es Word Rush', async () => {
    __setInterfaceLanguageForTests('en');
    await render(
      <ArcadeLobby state={fromSnapshot(snapshot())} now={100_000} onReady={jest.fn()} />,
    );
    expect(screen.getByText('Opponent found!')).toBeTruthy();
    expect(screen.getByText('Word Rush')).toBeTruthy();
    expect(screen.queryByLabelText(/^Match formats: /)).toBeNull();
    expect(allText()).not.toMatch(/arcade/i);
  });
});

describe('Word Rush en juego', () => {
  const swipe: ChallengeView = { index: 0, kind: 'swipe', prompt: 'apple', candidate: 'manzana' };
  const playing = (over: Partial<BattleState> = {}): BattleState => ({
    ...fromSnapshot(
      snapshot({
        status: 'in_progress',
        startsAt: 100_000,
        endsAt: 160_000,
        readyDeadline: null,
        arcade: arcadeSnap({ challenges: [swipe], frenzyAt: 145_000 }),
      }),
    ),
    ...over,
  });

  it('muestra el formato actual y el tiempo de una partida de 60 s', async () => {
    const state = playing();
    expect(state.phase).toBe('playing');
    await render(<ArcadeStage state={state} now={100_000} onAnswer={jest.fn()} />);
    expect(screen.getByText('Swipe Battle')).toBeTruthy();
    expect(screen.getByLabelText('Quedan 60 segundos')).toBeTruthy();
    expect(screen.queryByText('¡Tiempo!')).toBeNull();
  });

  it('a los 60 s: «¡Tiempo!» y ya no se puede responder hasta el resultado', async () => {
    await render(<ArcadeStage state={playing()} now={160_000} onAnswer={jest.fn()} />);
    expect(screen.getByText('¡Tiempo!')).toBeTruthy();
    expect(screen.getByText('Calculando el resultado…')).toBeTruthy();
    expect(screen.queryByText('Swipe Battle')).toBeNull();
  });

  it('el «+puntos» va en su propia franja, arriba del desafío: nunca tapa la palabra', async () => {
    const base = playing();
    const state: BattleState = {
      ...base,
      arcade: {
        ...base.arcade!,
        verdict: {
          id: 1,
          challengeIndex: 0,
          kind: 'swipe',
          correct: true,
          points: 400,
          multiplier: 4,
          frenzy: false,
          comboBroken: false,
          tierUp: false,
        },
      },
    };
    await render(<ArcadeStage state={state} now={110_000} onAnswer={jest.fn()} />);
    const flash = screen.getByText(/^\+400/);
    // Ningún antecesor del cartel es la tarjeta del Swipe (la de la palabra).
    for (let node = flash.parent; node; node = node.parent) {
      expect(String(node.props.accessibilityLabel ?? '')).not.toMatch(/apple/);
    }
    // Y se dibuja antes que el desafío (arriba de «Swipe Battle»).
    const tree = allText();
    expect(tree.indexOf('+')).toBeLessThan(tree.indexOf('Swipe Battle'));
  });

  it('si se cae la conexión, avisa que reconecta y que el reloj sigue', async () => {
    await render(
      <ArcadeStage state={playing({ online: false })} now={110_000} onAnswer={jest.fn()} />,
    );
    expect(screen.getByText('Reconectando… el reloj sigue corriendo')).toBeTruthy();
    expect(screen.getByText('Swipe Battle')).toBeTruthy();
  });
});

const line = (over: Partial<PlayerResult>): PlayerResult => ({
  slot: 1,
  username: 'ana',
  isBot: false,
  score: 0,
  correct: 0,
  answered: 0,
  outcome: 'win',
  forfeited: false,
  ratingBefore: null,
  ratingAfter: null,
  ...over,
});

const finish = (over: Partial<BattleFinish>, me: Partial<PlayerResult>): BattleFinish => ({
  battleId: 'b1',
  mode: 'ranked',
  status: 'completed',
  yourSlot: 1,
  players: [
    line({
      score: 940,
      correct: 14,
      answered: 17,
      arcade: { bestCombo: 6, frenzyPoints: 300 },
      ...me,
    }),
    line({
      slot: 2,
      username: 'Kiko',
      isBot: true,
      score: 610,
      correct: 10,
      answered: 15,
      outcome: 'loss',
      arcade: { bestCombo: 3, frenzyPoints: 80 },
    }),
  ],
  achievementsUnlocked: [],
  rating: 'competitive',
  calibration: null,
  ...over,
});

describe('resultado de Word Rush', () => {
  it('contra un bot sin ELO: lo dice y no muestra ningún cambio de ELO', async () => {
    await render(
      <BattleResult
        result={finish({ rating: 'unrated' }, {})}
        onPlayAgain={jest.fn()}
        onExit={jest.fn()}
      />,
    );
    expect(screen.getByText('Partida sin ELO: tu ELO no cambió.')).toBeTruthy();
    expect(screen.queryByText('BOT')).toBeNull();
    expect(screen.queryByText('ELO anterior')).toBeNull();
    expect(screen.queryByText('ELO actual')).toBeNull();
    expect(screen.queryByLabelText(/^ELO /)).toBeNull();
    // Las estadísticas de la partida sí se ven.
    expect(screen.getByText('Mejor combo')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Jugar otra' })).toBeTruthy();
    expect(allText()).not.toMatch(/arcade/i);
  });

  it('aunque llegara un rating en una partida sin ELO, no se muestra', async () => {
    await render(
      <BattleResult
        result={finish({ rating: 'unrated' }, { ratingBefore: 1000, ratingAfter: 1012 })}
        onPlayAgain={jest.fn()}
        onExit={jest.fn()}
      />,
    );
    expect(screen.queryByText('ELO anterior')).toBeNull();
    expect(screen.queryByText(/\+12/)).toBeNull();
  });

  it('contra una persona con ELO: sí muestra el cambio (contraste)', async () => {
    await render(
      <BattleResult
        result={finish({}, { ratingBefore: 1000, ratingAfter: 1012, placedBefore: true })}
        onPlayAgain={jest.fn()}
        onExit={jest.fn()}
      />,
    );
    // El ELO va dentro de la tarjeta de división: «1000 → 1012 ELO» y el «+12 ELO» del título.
    expect(screen.getByText('1000')).toBeTruthy();
    expect(screen.getByText('1012')).toBeTruthy();
    expect(screen.getByText(/\+12/)).toBeTruthy();
  });
});

describe('historial', () => {
  const base = {
    battleId: 'b1',
    endedAt: '2026-11-24T12:00:00Z',
    result: 'win' as const,
    forfeited: false,
    score: 940,
    correctAnswers: 14,
    totalAnswers: 17,
    ratingAfter: null,
    opponent: { id: null, username: 'Kiko', avatarId: 'flame', isBot: true },
    opponentScore: 610,
  };

  it('una partida contra un rival de práctica sin ELO: «sin ELO», sin distintivo BOT ni cambio de rating', async () => {
    await render(<MatchHistoryItem match={{ ...base, isRanked: false, ratingDelta: null }} />);
    expect(screen.queryByText('BOT')).toBeNull();
    expect(screen.getByText(/· sin ELO/)).toBeTruthy();
    expect(screen.queryByText(/práctica/i)).toBeNull();
    expect(screen.getByText('940–610')).toBeTruthy();
    expect(screen.getByLabelText(/, sin ELO$/)).toBeTruthy();
  });

  it('una partida con ELO muestra la variación y no dice «sin ELO»', async () => {
    await render(<MatchHistoryItem match={{ ...base, isRanked: true, ratingDelta: 12 }} />);
    expect(screen.getByText('940–610 · +12')).toBeTruthy();
    expect(screen.queryByText(/sin ELO/)).toBeNull();
  });
});
