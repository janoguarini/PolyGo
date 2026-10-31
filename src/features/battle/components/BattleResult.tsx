import { RotateCcw } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

import type { BattleFinish, PlayerResult } from '@shared/protocol';
import { getRank } from '@shared/ranking';
import { accuracy } from '@shared/wordRush';

import { Button, Card, RankEmblemForRating, Text, colors, radii, spacing } from '@/design-system';
import { TierBadge } from '@/features/profile/components/AchievementBadge';

import { BotBadge } from './BotBadge';

interface Props {
  result: BattleFinish;
  onPlayAgain: () => void;
  onExit: () => void;
}

const TITLES = { win: '¡Victoria!', loss: 'Derrota', draw: 'Empate' } as const;
/** Emoji grande del encabezado: sólido y a color, como los del resto de la app. */
const EMOJIS = { win: '🏆', loss: '💪', draw: '🤝', practice: '🎯' } as const;

export function BattleResult({ result, onPlayAgain, onExit }: Props) {
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
      : result.friendly
        ? 'Desafío amistoso: no mueve el ELO.'
        : null;

  return (
    <View style={styles.wrap}>
      <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
        <Animated.View
          entering={ZoomIn.springify().damping(10)}
          style={[styles.emojiWrap, me.outcome === 'win' && styles.emojiWin]}
        >
          <Text style={styles.emoji} accessibilityElementsHidden importantForAccessibility="no">
            {EMOJIS[practice ? 'practice' : (me.outcome ?? 'draw')]}
          </Text>
        </Animated.View>
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
          placedBefore={me.placedBefore ?? true}
          won={me.outcome === 'win'}
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
                <TierBadge id={a.id} size={52} />
                <Text variant="bodyStrong" color="textStrong">
                  {a.title}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>
      ) : null}

      <Button
        label={practice ? 'Practicar otra vez' : result.friendly ? 'Nuevo desafío' : 'Jugar otra'}
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
  placedBefore,
  won,
}: {
  before: number;
  after: number;
  /** Si ya estaba posicionado antes de esta partida. */
  placedBefore: boolean;
  won: boolean;
}) {
  const delta = after - before;
  const sign = delta > 0 ? '+' : '';
  const rankBefore = getRank(before).label;
  const rankAfter = getRank(after).label;

  if (!placedBefore) {
    return (
      <Card
        style={styles.rating}
        accessibilityLabel={
          won ? `Te posicionaste en ${rankAfter} con ${after} de ELO` : 'Seguís sin posicionar'
        }
      >
        <RankEmblemForRating rating={after} size={48} dimmed={!won} />
        <View style={styles.flex}>
          <Text variant="overline">{won ? '¡POSICIONADO!' : 'SIN POSICIONAR'}</Text>
          <Text variant="heading">{won ? `${rankAfter} · ${after} ELO` : 'Todavía sin rango'}</Text>
          <Text variant="caption">
            {won
              ? 'Ya estás en el ranking. Cada victoria te acerca al próximo rango.'
              : 'Ganá una partida para entrar al ranking en Bronce. Perder ahora no te resta.'}
          </Text>
        </View>
      </Card>
    );
  }

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
          {rankBefore !== rankAfter ? `${rankBefore} → ${rankAfter}` : rankAfter}
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
  emojiWrap: {
    width: 112,
    height: 112,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
  },
  emojiWin: { backgroundColor: 'rgba(247, 215, 116, 0.16)' },
  emoji: { fontSize: 64, lineHeight: 78, textAlign: 'center' },
  gap: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  score: { minWidth: 56, textAlign: 'right' },
  rating: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  achievements: { borderColor: colors.goldStrong },
});
