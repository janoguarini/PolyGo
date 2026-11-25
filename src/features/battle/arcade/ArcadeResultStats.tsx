import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import type { PlayerResult } from '@shared/protocol';

import { Card, Text, spacing } from '@/design-system';
import { useStrings } from '@/i18n';

import { arcadeStrings } from './strings';

/**
 * Resumen de la partida arcade: mejor combo, puntos en Frenesí, aciertos, errores y respuestas. Si
 * perdiste, cuánto te faltó: la derrota muestra lo que salió bien y que estuvo cerca.
 */
export function ArcadeResultStats({
  me,
  opponent,
}: {
  me: PlayerResult;
  opponent: PlayerResult | undefined;
}) {
  const t = useStrings(arcadeStrings);
  if (!me.arcade) return null;
  const lost = me.outcome === 'loss' && opponent && !me.forfeited;
  const gap = lost ? opponent.score - me.score + 1 : 0;
  const stats: [string, number, boolean][] = [
    [t.bestCombo, me.arcade.bestCombo, lost === true],
    [t.frenzyPoints, me.arcade.frenzyPoints, false],
    [t.hits, me.correct, false],
    [t.misses, me.answered - me.correct, false],
    [t.answers, me.answered, false],
  ];
  return (
    <Animated.View entering={FadeInUp.delay(200).duration(350)}>
      <Card style={styles.card}>
        {lost && gap > 0 ? (
          <Text variant="bodyStrong" color="gold" align="center">
            {t.missedBy(gap)}
          </Text>
        ) : null}
        <View style={styles.grid}>
          {stats.map(([label, value, highlight]) => (
            <View
              key={label}
              style={styles.stat}
              accessible
              accessibilityLabel={`${label}: ${value}`}
            >
              <Text variant="stat" color={highlight ? 'gold' : 'textStrong'} align="center">
                {value}
              </Text>
              <Text variant="caption" align="center">
                {label}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    rowGap: spacing.md,
  },
  stat: { minWidth: '30%', alignItems: 'center', gap: spacing.xxs },
});
