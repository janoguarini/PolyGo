import { render, screen } from '@testing-library/react-native';

import type { XpState } from '../api';
import { LevelProgress } from '../LevelProgress';

const xp = (over: Partial<XpState> = {}): XpState => ({
  total: 1245,
  level: 11,
  into: 340,
  need: 520,
  remaining: 180,
  level_before: 11,
  initial: false,
  granted: [],
  granted_total: 0,
  ...over,
});

describe('LevelProgress', () => {
  it('sin XP en el servidor (migración sin aplicar) no muestra nada', async () => {
    const { toJSON } = await render(<LevelProgress xp={null} />);
    expect(toJSON()).toBeNull();
  });

  it('cargando reserva el alto sin texto', async () => {
    await render(<LevelProgress xp={undefined} />);
    expect(screen.queryByText(/Nivel/)).toBeNull();
  });

  it('muestra nivel, XP del nivel y lo que falta', async () => {
    await render(<LevelProgress xp={xp()} />);
    expect(screen.getByText('Nivel 11')).toBeTruthy();
    expect(screen.getByText('340 / 520 XP')).toBeTruthy();
    expect(screen.getByText('Faltan 180 XP para el nivel 12')).toBeTruthy();
    expect(screen.getByLabelText(/Nivel 11\. 340 de 520 XP/)).toBeTruthy();
  });

  it('compacto omite la línea de lo que falta', async () => {
    await render(<LevelProgress xp={xp()} compact />);
    expect(screen.queryByText(/Faltan/)).toBeNull();
  });

  it('nivel máximo', async () => {
    await render(<LevelProgress xp={xp({ level: 500, need: 0, into: 0, remaining: 0 })} />);
    expect(screen.getByText('Nivel máximo alcanzado')).toBeTruthy();
  });
});
