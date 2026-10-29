import { WifiOff } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import type { PublicPlayer, ScoreLine } from '@shared/protocol';

import { Avatar, Card, ProgressBar, Text, colors, gradients, spacing } from '@/design-system';

const DANGER = [colors.danger, colors.dangerStrong] as const;

interface Props {
  remainingMs: number;
  durationMs: number;
  me: PublicPlayer | undefined;
  myLine: ScoreLine | undefined;
  opponent?: PublicPlayer;
  opponentLine?: ScoreLine;
  opponentGraceMs?: number | null;
}

/** Reloj del servidor y marcador en vivo. */
export function BattleHud({
  remainingMs,
  durationMs,
  me,
  myLine,
  opponent,
  opponentLine,
  opponentGraceMs,
}: Props) {
  const seconds = Math.ceil(remainingMs / 1000);
  const low = seconds <= 10;
  return (
    <View style={styles.wrap}>
      <View style={styles.timerRow}>
        <Text variant="overline">TIEMPO</Text>
        <Text
          variant="heading"
          color={low ? 'danger' : 'textStrong'}
          accessibilityLabel={`Quedan ${seconds} segundos`}
          accessibilityLiveRegion={low ? 'polite' : 'none'}
        >
          {seconds}s
        </Text>
      </View>
      <ProgressBar
        value={remainingMs / durationMs}
        height={6}
        colors={low ? DANGER : gradients.primary}
      />

      <View style={styles.scores}>
        <PlayerScore player={me} line={myLine} label="Vos" />
        {opponent ? <PlayerScore player={opponent} line={opponentLine} align="right" /> : null}
      </View>

      {opponent && opponentGraceMs != null ? (
        <Card style={styles.notice}>
          <WifiOff color={colors.streak} size={18} />
          <Text variant="caption" color="text" style={styles.noticeText}>
            {opponent.username} se desconectó. Si no vuelve en {Math.ceil(opponentGraceMs / 1000)}{' '}
            s, ganás por abandono.
          </Text>
        </Card>
      ) : null}
    </View>
  );
}

function PlayerScore({
  player,
  line,
  label,
  align = 'left',
}: {
  player: PublicPlayer | undefined;
  line: ScoreLine | undefined;
  label?: string;
  align?: 'left' | 'right';
}) {
  const right = align === 'right';
  return (
    <View
      style={[styles.player, right && styles.playerRight]}
      accessible
      accessibilityLabel={`${label ?? player?.username ?? ''}: ${line?.score ?? 0} puntos`}
    >
      <Avatar avatarId={player?.avatarId} size={36} />
      <View style={right ? styles.alignRight : undefined}>
        <Text variant="caption" numberOfLines={1}>
          {label ?? player?.username}
        </Text>
        <Text variant="stat">{line?.score ?? 0}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  timerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  scores: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  player: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 },
  playerRight: { flexDirection: 'row-reverse' },
  alignRight: { alignItems: 'flex-end' },
  notice: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  noticeText: { flex: 1 },
});
