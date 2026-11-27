import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import type { ArcadeSnapshot } from '@shared/arcade';
import { BOT_IDENTITIES, botIdentityByName, pickBotIdentity } from '@shared/botIdentities';
import { cosmeticById } from '@shared/cosmetics';
import { AVATAR_IDS, USERNAME_REGEX } from '@shared/profile';
import type { BattleSnapshot, PublicPlayer } from '@shared/protocol';

import { BACKGROUND_IMAGES, FRAME_ART, SKIN_IMAGES } from '@/features/cosmetics/assets';
import { backgroundStyle, frameStyle } from '@/features/cosmetics/visuals';
import { MatchHistoryItem } from '@/features/profile/components/MatchHistoryItem';
import { __setInterfaceLanguageForTests } from '@/i18n';

import { ArcadeLobby } from '../arcade/ArcadeLobby';
import { ArcadeSearching } from '../arcade/ArcadeSearching';
import { playerLook } from '../rivalLook';
import { battleReducer, initialBattleState, type BattleState } from '../state';

/*
 * Identidades de los rivales de práctica (shared/botIdentities.ts): catálogo, selección y cómo se
 * presentan. Los componentes de arte se reemplazan por textos con sus props para poder ver qué
 * avatar, marco y fondo se dibujan.
 */

jest.mock('@/features/learning/speech', () => ({ speak: jest.fn(), stopSpeaking: jest.fn() }));
jest.mock('@/lib/sounds', () => ({ playSound: jest.fn() }));
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Error: 'error', Warning: 'warning' },
}));
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));
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
jest.mock('@/features/cosmetics/FramedAvatar', () => {
  const { createElement } = jest.requireActual('react');
  const { Text } = jest.requireActual('react-native');
  return {
    ...jest.requireActual('@/features/cosmetics/FramedAvatar'),
    FramedAvatar: ({ avatarId, frameId }: { avatarId?: string; frameId?: string | null }) =>
      createElement(Text, null, `avatar:${avatarId ?? '-'} marco:${frameId ?? '-'}`),
  };
});
jest.mock('@/features/cosmetics/ProfileBackdrop', () => {
  const { createElement } = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');
  return {
    ProfileBackdrop: ({ backgroundId, children }: { backgroundId: string; children: ReactNode }) =>
      createElement(View, { testID: `fondo:${backgroundId ?? null}` }, children),
  };
});
jest.mock('@/design-system', () => {
  const { createElement } = jest.requireActual('react');
  const { Text } = jest.requireActual('react-native');
  return {
    ...jest.requireActual('@/design-system'),
    Avatar: ({ avatarId }: { avatarId?: string | null }) =>
      createElement(Text, null, `avatar:${avatarId ?? '-'}`),
  };
});

// Perfil propio para la pantalla de búsqueda (sin red ni react-query).
jest.mock('@/features/profile/hooks', () => ({
  useMyProfile: () => ({
    data: {
      profile: {
        username: 'ana',
        avatar_id: 'cat-red',
        avatar_path: null,
        frame_id: 'frame_leaf',
        target_language: 'en',
      },
      rating: { rating: 182, wins: 6 },
    },
  }),
}));

beforeEach(() => __setInterfaceLanguageForTests('es'));

// ---------- 1–3. catálogo ----------

describe('catálogo de identidades', () => {
  it('tiene 30 identidades', () => {
    expect(BOT_IDENTITIES).toHaveLength(30);
  });

  it('sin ids, nombres ni combinaciones visuales repetidas', () => {
    const ids = BOT_IDENTITIES.map((i) => i.id);
    const names = BOT_IDENTITIES.map((i) => i.name);
    const looks = BOT_IDENTITIES.map((i) => `${i.avatarId}|${i.frameId}|${i.backgroundId}`);
    expect(new Set(ids).size).toBe(30);
    expect(new Set(names).size).toBe(30);
    expect(new Set(looks).size).toBe(30);
    for (const id of ids) expect(id).toMatch(/^[a-z]+(-[a-z]+)+$/);
  });

  it('cada nombre es nombre y apellido, entra en battle_players.bot_name y nunca es un usuario real', () => {
    for (const { name } of BOT_IDENTITIES) {
      expect(name).toMatch(/^\S+ \S+$/);
      expect(name.length).toBeLessThanOrEqual(20);
      expect(USERNAME_REGEX.test(name)).toBe(false);
      expect(botIdentityByName(name)?.name).toBe(name);
    }
    expect(botIdentityByName('Kiko')).toBeUndefined();
    expect(botIdentityByName(null)).toBeUndefined();
  });

  it('cada identidad tiene avatar, marco y fondo con arte que ya está en la app', () => {
    for (const identity of BOT_IDENTITIES) {
      const avatarOk =
        (AVATAR_IDS as readonly string[]).includes(identity.avatarId) ||
        SKIN_IMAGES[identity.avatarId] !== undefined;
      expect({ id: identity.id, avatarOk }).toEqual({ id: identity.id, avatarOk: true });

      const frame = cosmeticById(identity.frameId);
      expect(frame?.kind).toBe('frame');
      expect(frame?.available && !frame.retired).toBe(true);
      expect(Boolean(FRAME_ART[identity.frameId] ?? frameStyle(identity.frameId))).toBe(true);

      const background = cosmeticById(identity.backgroundId);
      expect(background?.kind).toBe('background');
      expect(background?.available && !background.retired).toBe(true);
      expect(
        Boolean(BACKGROUND_IMAGES[identity.backgroundId] ?? backgroundStyle(identity.backgroundId)),
      ).toBe(true);
    }
  });

  it('usa los 20 avatares con arte (variedad) y varios estilos', () => {
    expect(new Set(BOT_IDENTITIES.map((i) => i.avatarId)).size).toBe(20);
    expect(new Set(BOT_IDENTITIES.map((i) => i.style)).size).toBe(6);
  });
});

// ---------- 4. selección ----------

/** Fuente determinista [0, 1) para recorrer el catálogo. */
const sequence = (seed: number) => {
  let a = seed;
  return () => {
    a = (a * 9301 + 49297) % 233280;
    return a / 233280;
  };
};

describe('selección de identidad', () => {
  it('nunca repite la identidad anterior del mismo jugador', () => {
    const random = sequence(7);
    let previous: string | undefined;
    for (let i = 0; i < 500; i++) {
      const identity = pickBotIdentity(random, { previousId: previous });
      expect(identity.id).not.toBe(previous);
      previous = identity.id;
    }
  });

  it('nunca le da al bot el mismo avatar que tiene puesto el jugador', () => {
    const random = sequence(3);
    for (const avatarId of ['bolt', 'skin-cyber', 'lion-red']) {
      for (let i = 0; i < 200; i++) {
        expect(pickBotIdentity(random, { playerAvatarId: avatarId }).avatarId).not.toBe(avatarId);
      }
    }
  });

  it('reparte las 30 identidades', () => {
    const random = sequence(11);
    const seen = new Set<string>();
    let previous: string | undefined;
    for (let i = 0; i < 2_000; i++) {
      previous = pickBotIdentity(random, { previousId: previous }).id;
      seen.add(previous);
    }
    expect(seen.size).toBe(30);
  });

  it('es determinista para la misma fuente y no depende de nada más', () => {
    const a = pickBotIdentity(() => 0.42, { previousId: 'fede-martinez', playerAvatarId: 'bolt' });
    const b = pickBotIdentity(() => 0.42, { previousId: 'fede-martinez', playerAvatarId: 'bolt' });
    expect(a).toBe(b);
    // Los extremos de la fuente siempre dan una identidad válida.
    expect(pickBotIdentity(() => 0).id).toBe(BOT_IDENTITIES[0]!.id);
    expect(pickBotIdentity(() => 0.999999)).toBeDefined();
  });
});

// ---------- 5–7 y 10. presentación ----------

const FEDE = botIdentityByName('Fede Martínez')!;

const bot: PublicPlayer = {
  slot: 2,
  username: 'Fede Martínez',
  // Lo que guarda la base (un zorro de BOT_AVATARS): el cliente dibuja el de la identidad.
  avatarId: 'crown',
  rating: 174,
  gamesPlayed: 40,
  isBot: true,
};
const me: PublicPlayer = {
  slot: 1,
  username: 'ana',
  avatarId: 'cat-red',
  frameId: 'frame_leaf',
  rating: 182,
  gamesPlayed: 7,
};

const arcadeSnap = (): ArcadeSnapshot => ({
  challenges: [],
  current: 0,
  combo: 0,
  bestCombo: 0,
  frenzyAt: null,
  durationMs: 60_000,
});

const lobbyState = (opponent: PublicPlayer, over: Partial<BattleSnapshot> = {}): BattleState => {
  const snapshot: BattleSnapshot = {
    battleId: 'b1',
    mode: 'ranked',
    status: 'matched',
    yourSlot: 1,
    players: [me, opponent],
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
    rating: 'unrated',
    calibration: null,
    ...over,
  };
  return battleReducer(battleReducer(initialBattleState, { type: 'joined', mode: 'ranked' }), {
    type: 'snapshot',
    snapshot,
    receivedAt: snapshot.serverNow,
  });
};

const allText = () => JSON.stringify(screen.toJSON());

describe('rival encontrado (lobby)', () => {
  it('el rival de práctica se ve con su nombre, su ELO estimado, avatar, marco y fondo, sin BOT', async () => {
    await render(<ArcadeLobby state={lobbyState(bot)} now={100_000} onReady={jest.fn()} />);
    expect(screen.getByText('¡Rival encontrado!')).toBeTruthy();
    expect(screen.getByText('Fede Martínez')).toBeTruthy();
    // ELO y rango con su color, en la tarjeta a todo el ancho.
    expect(screen.getByText(/^174 ELO/)).toBeTruthy();
    // Vos (182) y el rival (174) están en Bronce III: el rango figura en las dos tarjetas.
    expect(screen.getAllByText(/·\s+Bronce III$/)).toHaveLength(2);
    expect(screen.getByText(`avatar:${FEDE.avatarId} marco:${FEDE.frameId}`)).toBeTruthy();
    // Uno arriba del otro con un VS en el medio.
    expect(screen.getByText('VS', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByTestId(`fondo:${FEDE.backgroundId}`)).toBeTruthy();
    expect(screen.getByLabelText('Fede Martínez, 174 ELO')).toBeTruthy();
    // Ni distintivo ni la palabra «bot» en ningún texto o etiqueta de accesibilidad.
    expect(screen.queryByText('BOT')).toBeNull();
    expect(allText()).not.toMatch(/\bbots?\b|rival(es)? de pr[áa]ctica/i);
    // Antes de empezar dice que no mueve el ELO, sin decir contra quién.
    expect(screen.getByText(/^Partida sin ELO/)).toBeTruthy();
  });

  it('en calibración avisa antes de empezar que mueve el ELO, sin delatar al rival', async () => {
    await render(
      <ArcadeLobby
        state={lobbyState(bot, { rating: 'calibration', calibration: { used: 1, limit: 3 } })}
        now={100_000}
        onReady={jest.fn()}
      />,
    );
    expect(screen.getByText('Partida de calibración 1 de 3: mueve tu ELO.')).toBeTruthy();
    expect(allText()).not.toMatch(/\bbots?\b|rival(es)? de pr[áa]ctica/i);
  });

  it('un jugador real se ve con su propio perfil, en una tarjeta con el fondo por defecto', async () => {
    const human: PublicPlayer = {
      slot: 2,
      username: 'bob',
      avatarId: 'panda-red',
      frameId: 'frame_crystal',
      rating: 990,
      gamesPlayed: 12,
    };
    await render(
      <ArcadeLobby
        state={lobbyState(human, { rating: 'competitive' })}
        now={100_000}
        onReady={jest.fn()}
      />,
    );
    expect(screen.getByText('bob')).toBeTruthy();
    expect(screen.getByText(/^990 ELO/)).toBeTruthy();
    expect(screen.getByText(/·\s+Oro I$/)).toBeTruthy();
    expect(screen.getByText('avatar:panda-red marco:frame_crystal')).toBeTruthy();
    // Mi propio perfil, también tal cual.
    expect(screen.getByText('avatar:cat-red marco:frame_leaf')).toBeTruthy();
    // Las dos tarjetas con el mismo formato: sin fondo propio, el violeta por defecto.
    expect(screen.getAllByTestId('fondo:null')).toHaveLength(2);
  });

  it('mi tarjeta usa el fondo y el marco de mi perfil, con el mismo formato que la del rival', async () => {
    await render(
      <ArcadeLobby
        state={lobbyState(bot)}
        now={100_000}
        onReady={jest.fn()}
        myLook={{ avatarId: 'cat-red', frameId: 'frame_master', backgroundId: 'bg_aurora' }}
      />,
    );
    expect(screen.getByTestId('fondo:bg_aurora')).toBeTruthy();
    expect(screen.getByText('avatar:cat-red marco:frame_master')).toBeTruthy();
    expect(screen.getByTestId(`fondo:${FEDE.backgroundId}`)).toBeTruthy();
    expect(screen.getByLabelText('Tú, 182 ELO')).toBeTruthy();
    expect(screen.getByLabelText('Fede Martínez, 174 ELO')).toBeTruthy();
  });
});

describe('la identidad es la misma en toda la experiencia', () => {
  it('lobby, partida, resultados e historial resuelven el mismo avatar, marco y fondo', () => {
    const fromSnapshot = playerLook(bot);
    const fromResult = playerLook({ username: 'Fede Martínez', isBot: true });
    const fromHistory = playerLook({ username: 'Fede Martínez', avatarId: 'bolt', isBot: true });
    const expected = {
      avatarId: FEDE.avatarId,
      frameId: FEDE.frameId,
      backgroundId: FEDE.backgroundId,
    };
    expect(fromSnapshot).toEqual(expected);
    expect(fromResult).toEqual(expected);
    expect(fromHistory).toEqual(expected);
  });

  it('el historial dibuja el avatar de la identidad (no el zorro que guarda la base)', async () => {
    await render(
      <MatchHistoryItem
        match={{
          battleId: 'b1',
          endedAt: '2026-11-24T23:34:58Z',
          isRanked: false,
          result: 'win',
          forfeited: false,
          score: 8048,
          correctAnswers: 29,
          totalAnswers: 31,
          ratingDelta: null,
          ratingAfter: null,
          opponent: { id: null, username: 'Fede Martínez', avatarId: 'crown', isBot: true },
          opponentScore: 915,
        }}
      />,
    );
    expect(screen.getByText('Fede Martínez')).toBeTruthy();
    expect(screen.getByText(`avatar:${FEDE.avatarId}`)).toBeTruthy();
    expect(screen.queryByText('BOT')).toBeNull();
  });

  it('sólo los rivales de práctica usan el catálogo: un jugador real nunca se reemplaza', () => {
    expect(
      playerLook({ username: 'Fede Martínez', avatarId: 'dog-red', frameId: null, isBot: false }),
    ).toEqual({ avatarId: 'dog-red', frameId: null, backgroundId: null });
    // Un bot viejo (nombre fuera del catálogo) queda como venía, sin fondo.
    expect(playerLook({ username: 'Kiko', avatarId: 'flame', isBot: true })).toEqual({
      avatarId: 'flame',
      frameId: undefined,
      backgroundId: null,
    });
  });
});

// ---------- búsqueda de rival ----------

describe('buscando rival (pantalla oscura de Word Rush)', () => {
  it('muestra tu perfil, la espera, el idioma y qué se juega, sin decir nada de bots', async () => {
    const onCancel = jest.fn();
    await render(<ArcadeSearching waitedMs={2_400} onCancel={onCancel} />);
    expect(screen.getByText('Buscando rival…')).toBeTruthy();
    expect(screen.getByText('0:02')).toBeTruthy();
    expect(screen.getByLabelText('Esperando 0 minutos 02 segundos')).toBeTruthy();
    expect(screen.getByText(/^Buscando a alguien de tu nivel en /)).toBeTruthy();
    // Tu avatar y marco (en el radar, decorativo: oculto al lector de pantalla), tu ELO y tu rango.
    expect(
      screen.getByText('avatar:cat-red marco:frame_leaf', { includeHiddenElements: true }),
    ).toBeTruthy();
    // Insignia de rango con los colores del tier (182 = Bronce).
    expect(screen.getByLabelText(/^Bronce .+, 182 ELO$/)).toBeTruthy();
    // El modo, sin la lista de formatos ni las reglas.
    expect(screen.getByText('Word Rush')).toBeTruthy();
    expect(screen.getByText('60 s')).toBeTruthy();
    expect(screen.queryByLabelText(/^Formatos de la partida: /)).toBeNull();
    expect(screen.queryByText(/cuatro formatos/)).toBeNull();
    // Nada que delate a los bots.
    expect(allText()).not.toMatch(/\bbots?\b|rival(es)? de pr[áa]ctica|practice rival/i);
    expect(allText()).not.toMatch(/arcade/i);
    await fireEvent.press(screen.getByRole('button', { name: 'Cancelar búsqueda' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('en inglés, igual de neutral', async () => {
    __setInterfaceLanguageForTests('en');
    await render(<ArcadeSearching waitedMs={65_000} onCancel={jest.fn()} />);
    expect(screen.getByText('Looking for an opponent…')).toBeTruthy();
    expect(screen.getByText('1:05')).toBeTruthy();
    expect(screen.getByText(/^Looking for someone at your level in /)).toBeTruthy();
    expect(allText()).not.toMatch(/\bbots?\b|practice rival/i);
  });
});
