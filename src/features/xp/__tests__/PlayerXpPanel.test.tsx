import { render, screen } from '@testing-library/react-native';

import type { XpState } from '../api';
import { PlayerXpPanel } from '../PlayerXpPanel';

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

describe('PlayerXpPanel', () => {
  it('sin XP en el servidor no muestra nada', async () => {
    const { toJSON } = await render(<PlayerXpPanel xp={null} />);
    expect(toJSON()).toBeNull();
  });

  it('cargando reserva el alto sin texto', async () => {
    await render(<PlayerXpPanel xp={undefined} />);
    expect(screen.queryByText(/XP/)).toBeNull();
  });

  it('nivel a la izquierda; XP, barra y lo que falta a la derecha', async () => {
    await render(<PlayerXpPanel xp={xp()} />);
    expect(screen.getByText('11')).toBeTruthy();
    expect(screen.getByText('NIVEL')).toBeTruthy();
    expect(screen.getByText('Experiencia')).toBeTruthy();
    expect(screen.getByText('340 / 520 XP')).toBeTruthy();
    expect(screen.getByText('Faltan 180 XP para el nivel 12')).toBeTruthy();
    expect(screen.getByLabelText(/Nivel 11\. 340 de 520 XP/)).toBeTruthy();
    expect(screen.queryByText('PREVIEW')).toBeNull();
  });

  it('muestra el XP recién ganado (no en la primera sincronización)', async () => {
    await render(<PlayerXpPanel xp={xp({ granted_total: 169 })} />);
    expect(screen.getByText('+169 XP')).toBeTruthy();
    await render(<PlayerXpPanel xp={xp({ granted_total: 169, initial: true })} />);
    expect(screen.queryByText('+169 XP')).toBeNull();
  });

  it('modo PREVIEW conserva la etiqueta', async () => {
    await render(<PlayerXpPanel xp={xp({ preview: true })} />);
    expect(screen.getByText('PREVIEW')).toBeTruthy();
  });

  it('nivel máximo', async () => {
    await render(<PlayerXpPanel xp={xp({ level: 500, need: 0, into: 0, remaining: 0 })} />);
    expect(screen.getByText('Nivel máximo alcanzado')).toBeTruthy();
  });
});
