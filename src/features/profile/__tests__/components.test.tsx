import { render, screen } from '@testing-library/react-native';

import { familyByMetric } from '@shared/achievements';

import type { MatchHistoryEntry } from '../api';
import { FamilyRow } from '../components/AchievementBadge';
import type { FamilyProgress } from '../families';
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
    opponent: { id: 'u2', username: 'bob', avatarId: 'flame', isBot: false },
    opponentScore: 600,
    ...overrides,
  };
}

function progress(metric: string, overrides: Partial<FamilyProgress> = {}): FamilyProgress {
  const family = familyByMetric(metric)!;
  return {
    family,
    level: 1,
    maxLevel: family.tiers.length,
    current: family.tiers[0]!,
    next: family.tiers[1]!,
    value: 2,
    ratio: 0.25,
    lastUnlockedAt: '2026-10-29T12:00:00Z',
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

  it('marca al rival bot y no abre su perfil', async () => {
    await render(
      <MatchHistoryItem
        match={match({ opponent: { id: null, username: 'Kiko', avatarId: 'crown', isBot: true } })}
      />,
    );
    expect(screen.getByText('Kiko')).toBeTruthy();
    expect(screen.getByLabelText('Bot')).toBeTruthy();
    expect(screen.getByLabelText('Victoria contra Kiko (bot), 900 a 600, +24 ELO')).toBeTruthy();
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

describe('FamilyRow', () => {
  it('muestra el nivel, el próximo objetivo y el avance', async () => {
    await render(<FamilyRow progress={progress('lessons_completed')} rankedAvailable={false} />);
    expect(screen.getByText('Erudito')).toBeTruthy();
    expect(screen.getByText('Nivel 1/6')).toBeTruthy();
    expect(screen.getByText('Completá 5 lecciones distintas.')).toBeTruthy();
    expect(screen.getByText('2/5')).toBeTruthy();
  });

  it('marca los competitivos sin niveles como no disponibles mientras Ranked no abra', async () => {
    await render(
      <FamilyRow
        progress={progress('wins', { level: 0, current: null, value: 0, ratio: 0 })}
        rankedAvailable={false}
      />,
    );
    expect(screen.getByText('Disponible cuando abra Ranked')).toBeTruthy();
  });

  it('una familia completa no muestra barra de avance', async () => {
    const family = familyByMetric('reviews_completed')!;
    await render(
      <FamilyRow
        progress={progress('reviews_completed', {
          level: family.tiers.length,
          current: family.tiers.at(-1)!,
          next: null,
          ratio: 1,
        })}
        rankedAvailable
      />,
    );
    expect(screen.getByText(/^¡Completo!/)).toBeTruthy();
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
