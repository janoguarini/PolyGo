import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Card, ErrorState, Text, spacing } from '@/design-system';
import { useStrings } from '@/i18n';

import { useMatchHistory, useRatingHistory } from '../hooks';
import { historyStrings } from '../strings';
import { MatchHistoryItem } from './MatchHistoryItem';
import { RatingChart } from './RatingChart';

const PREVIEW = 3;

/** Evolución del ELO y últimas partidas del perfil propio. Sin partidas, lo dice: no se inventan datos. */
export function CompetitiveHistory() {
  const t = useStrings(historyStrings);
  const history = useRatingHistory();
  const matches = useMatchHistory(PREVIEW);
  const recent = matches.data?.pages[0] ?? [];

  return (
    <>
      <Card style={styles.gap}>
        <Text variant="overline">{t.eloEvolution}</Text>
        {history.isError ? (
          <ErrorState message={t.evolutionError} onRetry={() => void history.refetch()} />
        ) : !history.data ? (
          <Text variant="caption">{t.loading}</Text>
        ) : history.data.length < 2 ? (
          <Text color="textMuted">{t.evolutionEmpty}</Text>
        ) : (
          <RatingChart series={history.data} />
        )}
      </Card>

      <Card style={styles.gap}>
        <Text variant="overline">{t.recentMatches}</Text>
        {matches.isError ? (
          <ErrorState message={t.matchesError} onRetry={() => void matches.refetch()} />
        ) : matches.isPending ? (
          <Text variant="caption">{t.loading}</Text>
        ) : recent.length === 0 ? (
          <Text color="textMuted">{t.matchesEmpty}</Text>
        ) : (
          <View>
            {recent.map((m) => (
              <MatchHistoryItem key={m.battleId} match={m} />
            ))}
            <Button label={t.fullHistory} variant="ghost" onPress={() => router.push('/matches')} />
          </View>
        )}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.sm },
});
