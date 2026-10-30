import { RotateCcw, Trophy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import type { BattleFinish, PlayerResult } from '@shared/protocol';
import { getRank, isInPlacement } from '@shared/ranking';
import { accuracy } from '@shared/wordRush';

import { Button, Card, RankEmblemForRating, Text, colors, spacing } from '@/design-system';
import { TierBadge } from '@/features/profile/components/AchievementBadge';

import { BotBadge } from './BotBadge';

interface Props {
  result: BattleFinish;
  /** Partidas jugadas antes de esta, para saber si sigue en colocación. */
  gamesPlayedBefore: number | null;
  onPlayAgain: () => void;
  onExit: () => void;
}

const TITLES = { win: '¡Victoria!', loss: 'Derrota', draw: 'Empate' } as const;

export function BattleResult({ result, gamesPlayedBefore, onPlayAgain, onExit }: Props) {
  const me = result.players.find((p) => p.slot === result.yourSlot)!;
  const opponent = result.players.find((p) => p.slot !== result.yourSlot);
  const practice = result.mode === 'practice';
  const title = practice ? 'Práctica terminada' : TITLES[me.outcome ?? 'draw'];
  const subtitle = practice
    ? 'Sin ELO: es para entrenar.'
    : result.status === 'forfeited'
      ? me.forfeited
        ? 'Abandonaste la partida.'
        : `${opponent?.username ?? 'Tu rival'} abandonó la partida.`
      : null;

  return (
    <View style={styles.wrap}>
      <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
        {me.outcome === 'win' ? <Trophy color={colors.gold} size={48} /> : null}
        <Text variant="display" align="center" color={me.outcome === 'win' ? 'gold' : 'textStrong'}>
          {title}
        </Text>
        {subtitle ? (
          <Text color="textMuted" align="center">
            {subtitle}
          </Text>
        ) : null}
      </Animated.View>

      <Card style={styles.gap}>
        <Line label="Vos" player={me} highlight />
        {opponent ? <Line label={opponent.username} player={opponent} /> : null}
      </Card>

      {!practice && me.ratingBefore !== null && me.ratingAfter !== null ? (
        <RatingChange
          before={me.ratingBefore}
          after={me.ratingAfter}
          placement={gamesPlayedBefore !== null && isInPlacement(gamesPlayedBefore + 1)}
        />
      ) : null}

      {result.achievementsUnlocked.length > 0 ? (
        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <Card style={[styles.gap, styles.achievements]} accessibilityLabel="Logros nuevos">
            <Text variant="overline" color="gold">
              {result.achievementsUnlocked.length === 1
                ? 'LOGRO DESBLOQUEADO'
                : 'LOGROS DESBLOQUEADOS'}
            </Text>
            {result.achievementsUnlocked.map((a) => (
              <View key={a.id} style={styles.row}>
                <TierBadge id={a.id} size={40} />
                <Text variant="bodyStrong" color="textStrong">
                  {a.title}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>
      ) : null}

      <Button
        label={practice ? 'Practicar otra vez' : 'Jugar otra'}
        size="lg"
        icon={<RotateCcw color={colors.onPrimary} size={20} />}
        onPress={onPlayAgain}
      />
      <Button label="Volver" variant="ghost" onPress={onExit} />
    </View>
  );
}

function Line({
  label,
  player,
  highlight,
}: {
  label: string;
  player: PlayerResult;
  highlight?: boolean;
}) {
  const pct = Math.round(accuracy(player) * 100);
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${label}${player.isBot ? ' (bot)' : ''}: ${player.score} puntos, ${player.correct} de ${player.answered} correctas`}
    >
      <View style={[styles.flex, styles.nameRow]}>
        <Text
          variant="bodyStrong"
          color={highlight ? 'textStrong' : 'text'}
          numberOfLines={1}
          style={styles.shrink}
        >
          {label}
        </Text>
        {player.isBot ? <BotBadge /> : null}
      </View>
      <Text variant="caption">
        {player.correct}/{player.answered} · {pct}%
      </Text>
      <Text variant="heading" style={styles.score}>
        {player.score}
      </Text>
    </View>
  );
}

function RatingChange({
  before,
  after,
  placement,
}: {
  before: number;
  after: number;
  placement: boolean;
}) {
  const delta = after - before;
  const sign = delta > 0 ? '+' : '';
  const rankBefore = getRank(before).label;
  const rankAfter = getRank(after).label;
  return (
    <Card style={styles.rating} accessibilityLabel={`ELO ${before} a ${after}, ${sign}${delta}`}>
      <RankEmblemForRating rating={after} size={48} />
      <View style={styles.flex}>
        <Text variant="overline">ELO</Text>
        <Text variant="heading">
          {before} → {after}{' '}
          <Text
            variant="heading"
            color={delta > 0 ? 'success' : delta < 0 ? 'danger' : 'textMuted'}
          >
            ({sign}
            {delta})
          </Text>
        </Text>
        <Text variant="caption">
          {placement
            ? 'En colocación: tu rango se muestra tras 5 partidas.'
            : rankBefore !== rankAfter
              ? `${rankBefore} → ${rankAfter}`
              : rankAfter}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  shrink: { flexShrink: 1 },
  wrap: { gap: spacing.lg },
  header: { alignItems: 'center', gap: spacing.sm, marginVertical: spacing.lg },
  gap: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  score: { minWidth: 56, textAlign: 'right' },
  rating: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  achievements: { borderColor: colors.goldStrong },
});
