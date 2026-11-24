import { WifiOff } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import type { PublicPlayer, ScoreLine } from '@shared/protocol';

import { Card, ProgressBar, Text, colors, gradients, spacing, useTheme } from '@/design-system';
import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import { useStrings } from '@/i18n';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';

import { BotBadge } from './BotBadge';
import { battleStrings } from '../strings';

/** Barra de tiempo en rojo (se lee al dibujar: depende del tema). */
const danger = () => [colors.danger, colors.dangerStrong] as const;

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
  useTheme();
  const t = useStrings(battleStrings);
  const seconds = Math.ceil(remainingMs / 1000);
  const low = seconds <= 10;
  return (
    <View style={styles.wrap}>
      <View style={styles.timerRow}>
        <Text variant="overline">{t.time}</Text>
        <Text
          variant="heading"
          color={low ? 'danger' : 'textStrong'}
          accessibilityLabel={t.secondsLeft(seconds)}
          accessibilityLiveRegion={low ? 'polite' : 'none'}
        >
          {seconds}s
        </Text>
      </View>
      <ProgressBar
        value={remainingMs / durationMs}
        height={6}
        colors={low ? danger() : gradients.primary}
      />

      <View style={styles.scores}>
        <PlayerScore player={me} line={myLine} label={t.you} />
        {opponent ? <PlayerScore player={opponent} line={opponentLine} align="right" /> : null}
      </View>

      {opponent && opponentGraceMs != null ? (
        <Card style={styles.notice}>
          <WifiOff color={colors.streak} size={18} />
          <Text variant="caption" color="text" style={styles.noticeText}>
            {t.opponentDisconnected(opponent.username, Math.ceil(opponentGraceMs / 1000))}
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
  const t = useStrings(battleStrings);
  const right = align === 'right';
  return (
    <View
      style={[styles.player, right && styles.playerRight]}
      accessible
      accessibilityLabel={t.scoreA11y(
        label ?? player?.username ?? '',
        Boolean(player?.isBot),
        line?.score ?? 0,
      )}
    >
      <FramedAvatar
        avatarId={player?.avatarId}
        photoUrl={avatarPhotoUrl(player?.avatarPath)}
        size={player?.frameId ? 30 : 36}
        frameId={player?.frameId}
      />
      <View style={right ? styles.alignRight : undefined}>
        <View style={[styles.nameRow, right && styles.playerRight]}>
          <Text variant="caption" numberOfLines={1}>
            {label ?? player?.username}
          </Text>
          {player?.isBot ? <BotBadge /> : null}
        </View>
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
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  notice: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  noticeText: { flex: 1 },
});
