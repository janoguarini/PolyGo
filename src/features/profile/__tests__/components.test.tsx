import { render, screen } from '@testing-library/react-native';

import type { Achievement, MatchHistoryEntry } from '../api';
import { AchievementRow } from '../components/AchievementBadge';
import { MatchHistoryItem } from '../components/MatchHistoryItem';
import { RatingChart } from '../components/RatingChart';

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

function match(overrides: Partial<MatchHistoryEntry>): MatchHistoryEntry {
  return {
    battleId: 'b1',
    endedAt: '2026-10-29T12:00:00Z',
    isRanked: true,
    result: 'win',
    forfeited: false,
    score: 900,
    correctAnswers: 8,
    totalAnswers: 10,
    ratingDelta: 24,
    ratingAfter: 1024,
    opponent: { id: 'u2', username: 'bob', avatarId: 'flame' },
    opponentScore: 600,
    ...overrides,
  };
}

function achievement(overrides: Partial<Achievement>): Achievement {
  return {
    id: 'lessons_5',
    category: 'learning',
    title: 'Constante',
    description: 'Completá 5 lecciones distintas.',
    icon: 'book-open',
    threshold: 5,
    progress: 2,
    unlockedAt: null,
    ...overrides,
  };
}

describe('MatchHistoryItem', () => {
  it('nombra el resultado con texto, el marcador y el cambio de ELO', async () => {
    await render(<MatchHistoryItem match={match({})} />);
    expect(screen.getByText('Victoria')).toBeTruthy();
    expect(screen.getByText('bob')).toBeTruthy();
    expect(screen.getByText('900–600 · +24')).toBeTruthy();
  });

  it('anonimiza al rival que borró su cuenta', async () => {
    await render(
      <MatchHistoryItem match={match({ result: 'loss', ratingDelta: -18, opponent: null })} />,
    );
    expect(screen.getByText('Jugador eliminado')).toBeTruthy();
    expect(screen.getByText('Derrota')).toBeTruthy();
    expect(screen.getByText('900–600 · −18')).toBeTruthy();
  });
});

describe('AchievementRow', () => {
  it('muestra el progreso de un logro pendiente', async () => {
    await render(<AchievementRow achievement={achievement({})} rankedAvailable={false} />);
    expect(screen.getByText('2/5')).toBeTruthy();
  });

  it('marca los competitivos como no disponibles mientras Ranked no abra', async () => {
    await render(
      <AchievementRow
        achievement={achievement({
          category: 'competitive',
          title: 'Primera victoria',
          progress: 0,
        })}
        rankedAvailable={false}
      />,
    );
    expect(screen.getByText('Disponible cuando abra Ranked')).toBeTruthy();
  });

  it('muestra la fecha de desbloqueo', async () => {
    await render(
      <AchievementRow
        achievement={achievement({ progress: 5, unlockedAt: '2026-10-29T12:00:00Z' })}
        rankedAvailable={false}
      />,
    );
    expect(screen.getByText(/^Desbloqueado el /)).toBeTruthy();
  });
});

describe('RatingChart', () => {
  it('resume la serie para lectores de pantalla y muestra el último valor', async () => {
    await render(
      <RatingChart
        series={[
          { rating: 1000, delta: 0, reason: 'initial', at: '2026-10-20T12:00:00Z' },
          { rating: 1024, delta: 24, reason: 'battle', at: '2026-10-21T12:00:00Z' },
          { rating: 1010, delta: -14, reason: 'battle', at: '2026-10-22T12:00:00Z' },
        ]}
      />,
    );
    expect(screen.getByText('1010')).toBeTruthy();
    expect(
      screen.getByLabelText('Evolución del ELO en 2 partidas: de 1000 a 1010, +10.'),
    ).toBeTruthy();
  });
});
