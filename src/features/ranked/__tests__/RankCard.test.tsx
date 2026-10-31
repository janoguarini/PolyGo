import { render, screen } from '@testing-library/react-native';

import type { PlayerRatingRow } from '@/lib/database.types';

import { RankCard } from '../RankCard';

function rating(overrides: Partial<PlayerRatingRow>): PlayerRatingRow {
  return {
    user_id: 'u1',
    language_code: 'en',
    rating: 100,
    peak_rating: 100,
    games_played: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    win_streak: 0,
    best_win_streak: 0,
    updated_at: '2026-10-28T00:00:00Z',
    ...overrides,
  };
}

describe('RankCard', () => {
  it('sin victorias: sin posicionar y sin número de ELO', async () => {
    await render(<RankCard rating={rating({ games_played: 2, losses: 2 })} />);
    expect(screen.getByText('Sin posicionar')).toBeTruthy();
    expect(
      screen.getByText('Ganá tu primera partida para entrar al ranking en Bronce.'),
    ).toBeTruthy();
    expect(screen.queryByText('100 ELO')).toBeNull();
  });

  it('la primera victoria lo posiciona en Bronce III', async () => {
    await render(
      <RankCard rating={rating({ rating: 116, peak_rating: 116, games_played: 1, wins: 1 })} />,
    );
    expect(screen.getByText('Bronce III')).toBeTruthy();
    expect(screen.getByText('84 ELO para el siguiente rango')).toBeTruthy();
  });

  it('muestra rango y ELO restante para jugadores establecidos', async () => {
    await render(
      <RankCard rating={rating({ rating: 1120, peak_rating: 1120, games_played: 10, wins: 10 })} />,
    );
    expect(screen.getByText('Platino II')).toBeTruthy();
    expect(screen.getByText('1120 ELO')).toBeTruthy();
    expect(screen.getByText('80 ELO para el siguiente rango')).toBeTruthy();
  });

  it('indica el rango máximo', async () => {
    await render(
      <RankCard rating={rating({ rating: 2300, peak_rating: 2300, games_played: 50, wins: 50 })} />,
    );
    expect(screen.getByText('Gran Maestro')).toBeTruthy();
    expect(screen.getByText('Rango máximo alcanzado')).toBeTruthy();
  });
});
