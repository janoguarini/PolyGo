import { render, screen } from '@testing-library/react-native';

import type { XpState } from '../api';
import { PlayerTitle } from '../PlayerTitle';
import { STARTING_XP, xpOrStart } from '../startingXp';
import {
  LEVEL_TITLES,
  displayedTitle,
  getTitleChoice,
  isTitleUnlocked,
  levelTitle,
  setTitleChoice,
} from '../titles';

const xp = (over: Partial<XpState> = {}): XpState => ({
  total: 1245,
  level: 12,
  into: 340,
  need: 520,
  remaining: 180,
  level_before: 12,
  initial: false,
  granted: [],
  granted_total: 0,
  ...over,
});

describe('levelTitle', () => {
  it.each([
    [1, 'Novato'],
    [4, 'Novato'],
    [5, 'Principiante'],
    [9, 'Principiante'],
    [10, 'Aprendiz'],
    [19, 'Aprendiz'],
    [20, 'Explorador'],
    [29, 'Explorador'],
    [30, 'Intermedio'],
    [39, 'Intermedio'],
    [40, 'Avanzado'],
    [49, 'Avanzado'],
    [50, 'Experto'],
    [59, 'Experto'],
    [60, 'Especialista'],
    [74, 'Especialista'],
    [75, 'Maestro'],
    [89, 'Maestro'],
    [90, 'Gran Maestro'],
    [99, 'Gran Maestro'],
    [100, 'Políglota Élite'],
    [500, 'Políglota Élite'],
  ])('nivel %i → %s', (level, title) => {
    expect(levelTitle(level)).toBe(title);
  });

  it('niveles fuera de rango caen en el primer título', () => {
    expect(levelTitle(0)).toBe('Novato');
    expect(levelTitle(Number.NaN)).toBe('Novato');
  });

  it('la tabla está ordenada y empieza en el nivel 1', () => {
    const mins = LEVEL_TITLES.map((t) => t.minLevel);
    expect(mins[0]).toBe(1);
    expect(mins).toEqual([...mins].sort((a, b) => a - b));
    expect(new Set(mins).size).toBe(mins.length);
    expect(LEVEL_TITLES[0]?.title).toBe('Novato');
  });
});

describe('títulos elegidos', () => {
  it('el primero está siempre disponible, también en nivel 0', () => {
    expect(isTitleUnlocked('Novato', 0)).toBe(true);
    expect(isTitleUnlocked('Principiante', 4)).toBe(false);
    expect(isTitleUnlocked('Principiante', 5)).toBe(true);
    expect(isTitleUnlocked('Inexistente', 500)).toBe(false);
  });

  it('se muestra el elegido si está desbloqueado; si no, el automático', () => {
    expect(displayedTitle(32, 'Aprendiz')).toBe('Aprendiz');
    expect(displayedTitle(32, null)).toBe('Intermedio');
    expect(displayedTitle(12, 'Maestro')).toBe('Aprendiz');
    expect(displayedTitle(12, 'Inexistente')).toBe('Aprendiz');
  });

  it('guarda la elección por usuario y la puede volver a automático', () => {
    setTitleChoice('user-a', 'Novato');
    expect(getTitleChoice('user-a')).toBe('Novato');
    expect(getTitleChoice('user-b')).toBeNull();
    setTitleChoice('user-a', null);
    expect(getTitleChoice('user-a')).toBeNull();
  });
});

describe('nivel 0 sin XP en el servidor', () => {
  it('null pasa a nivel 0; cargando y datos reales no cambian', () => {
    expect(xpOrStart(null)).toBe(STARTING_XP);
    expect(STARTING_XP.level).toBe(0);
    expect(STARTING_XP.need).toBeGreaterThan(0);
    expect(xpOrStart(undefined)).toBeUndefined();
    const real = xp();
    expect(xpOrStart(real)).toBe(real);
  });
});

describe('PlayerTitle', () => {
  it('muestra sólo el título (sin la línea de nivel)', async () => {
    await render(<PlayerTitle xp={xp()} />);
    expect(screen.getByText('Aprendiz')).toBeTruthy();
    expect(screen.queryByText(/desbloqueado/)).toBeNull();
  });

  it('usa el título elegido si está desbloqueado', async () => {
    await render(<PlayerTitle xp={xp({ level: 40 })} choice="Explorador" />);
    expect(screen.getByText('Explorador')).toBeTruthy();
  });

  it('nivel 0: Novato', async () => {
    await render(<PlayerTitle xp={STARTING_XP} />);
    expect(screen.getByText('Novato')).toBeTruthy();
  });

  it('cambia al subir de nivel', async () => {
    const { rerender } = await render(<PlayerTitle xp={xp({ level: 19 })} />);
    expect(screen.getByText('Aprendiz')).toBeTruthy();
    await rerender(<PlayerTitle xp={xp({ level: 20, level_before: 19 })} />);
    expect(screen.getByText('Explorador')).toBeTruthy();
    expect(screen.queryByText('Aprendiz')).toBeNull();
  });

  it('funciona con datos de PREVIEW', async () => {
    await render(<PlayerTitle xp={xp({ level: 100, preview: true })} />);
    expect(screen.getByText('Políglota Élite')).toBeTruthy();
  });

  it('sin XP en el servidor no muestra nada; cargando no muestra texto', async () => {
    const { toJSON } = await render(<PlayerTitle xp={null} />);
    expect(toJSON()).toBeNull();
    await render(<PlayerTitle xp={undefined} />);
    expect(screen.queryByText(/Nivel/)).toBeNull();
  });
});
