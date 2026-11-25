import { RotateCcw } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

import type { BattleFinish, PlayerResult } from '@shared/protocol';
import { getRank } from '@shared/ranking';
import { accuracy } from '@shared/wordRush';

import {
  Button,
  Card,
  RankEmblemForRating,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { TierBadge } from '@/features/profile/components/AchievementBadge';
import { useRankLabels } from '@/features/ranked/strings';
import { useStrings } from '@/i18n';

import { ArcadeResultStats } from '../arcade/ArcadeResultStats';
import { Confetti } from './Confetti';
import { RankUpCelebration, rankUpKind } from './RankUpCelebration';
import { ResultHero } from './ResultHero';
import { battleStrings } from '../strings';
import { useAchievementTitle } from '@/features/profile/strings';

interface Props {
  result: BattleFinish;
  onPlayAgain: () => void;
  onExit: () => void;
  /** Recompensa bajo el encabezado (la XP de la partida: XpRewardCard). */
  reward?: ReactNode;
}

const TITLES = { win: 'victory', loss: 'defeat', draw: 'draw' } as const;
/** Emoji grande del encabezado: sólido y a color, como los del resto de la app. */
const EMOJIS = { win: '🏆', loss: '💪', draw: '🤝', practice: '🎯' } as const;

export function BattleResult({ result, onPlayAgain, onExit, reward }: Props) {
  const styles = useStyles();
  const t = useStrings(battleStrings);
  const achievementTitle = useAchievementTitle();
  const me = result.players.find((p) => p.slot === result.yourSlot)!;
  const opponent = result.players.find((p) => p.slot !== result.yourSlot);
  const practice = result.mode === 'practice';
  // Contra un bot fuera del cupo de calibración (el servidor lo pone solo) o una práctica contra bot
  // pedida por una build anterior: no movió el ELO y no se muestra ningún cambio de rating.
  const unrated = result.mode === 'bot_practice' || result.rating === 'unrated';
  const title = practice ? t.practiceDone : t[TITLES[me.outcome ?? 'draw']];
  const subtitle = practice
    ? t.practiceSubtitle
    : result.status === 'forfeited'
      ? me.forfeited
        ? t.youForfeited
        : t.opponentForfeited(opponent?.username)
      : result.friendly
        ? t.friendlySubtitle
        : unrated
          ? t.unratedSubtitle
          : result.rating === 'calibration' && result.calibration
            ? t.calibrationSubtitle(result.calibration.used, result.calibration.limit)
            : null;
  const victory = !practice && me.outcome === 'win';
  // Subiste de división, de rango o entraste al ranking: celebración a pantalla completa (una vez).
  const rankUp =
    practice || unrated || result.friendly
      ? null
      : rankUpKind(me.ratingBefore, me.ratingAfter, me.placedBefore ?? true, victory);
  const [celebrating, setCelebrating] = useState(rankUp !== null);
  // Victorias y derrotas llevan al zorro; empates y prácticas, el encabezado simple.
  const heroOutcome = practice
    ? null
    : me.outcome === 'win' || me.outcome === 'loss'
      ? me.outcome
      : null;

  return (
    <View style={styles.wrap}>
      {heroOutcome ? (
        <ResultHero
          outcome={heroOutcome}
          // Sin ELO, aunque llegara un rating no se muestra ningún cambio.
          ratingBefore={unrated ? null : me.ratingBefore}
          ratingAfter={unrated ? null : me.ratingAfter}
          placedBefore={me.placedBefore ?? true}
          subtitle={subtitle}
        />
      ) : (
        <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
          <Animated.View
            entering={ZoomIn.springify().damping(10)}
            style={[styles.emojiWrap, me.outcome === 'win' && styles.emojiWin]}
          >
            <Text style={styles.emoji} accessibilityElementsHidden importantForAccessibility="no">
              {EMOJIS[practice ? 'practice' : (me.outcome ?? 'draw')]}
            </Text>
          </Animated.View>
          <Text
            variant="display"
            align="center"
            color={me.outcome === 'win' ? 'gold' : 'textStrong'}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text color="textMuted" align="center">
              {subtitle}
            </Text>
          ) : null}
        </Animated.View>
      )}

      {reward}

      <Card style={styles.gap}>
        <Line label={t.you} player={me} highlight />
        {opponent ? <Line label={opponent.username} player={opponent} /> : null}
      </Card>

      {me.arcade ? <ArcadeResultStats me={me} opponent={opponent} /> : null}

      {!heroOutcome &&
      !practice &&
      !unrated &&
      me.ratingBefore !== null &&
      me.ratingAfter !== null ? (
        <RatingChange
          before={me.ratingBefore}
          after={me.ratingAfter}
          placedBefore={me.placedBefore ?? true}
          won={me.outcome === 'win'}
        />
      ) : null}

      {result.achievementsUnlocked.length > 0 ? (
        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <Card style={[styles.gap, styles.achievements]} accessibilityLabel={t.newAchievements}>
            <Text variant="overline" color="gold">
              {t.achievementsUnlocked(result.achievementsUnlocked.length)}
            </Text>
            {result.achievementsUnlocked.map((a) => (
              <View key={a.id} style={styles.row}>
                <TierBadge id={a.id} size={52} />
                <Text variant="bodyStrong" color="textStrong">
                  {achievementTitle(a.id, a.title)}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>
      ) : null}

      <Button
        label={
          practice || result.mode === 'bot_practice'
            ? t.practiceAgain
            : result.friendly
              ? t.newChallenge
              : t.playAgain
        }
        size="lg"
        icon={<RotateCcw color={colors.onPrimary} size={20} />}
        onPress={onPlayAgain}
      />
      <Button label={t.back} variant="ghost" onPress={onExit} />
      {victory ? <Confetti /> : null}
      {rankUp && celebrating && me.ratingBefore != null && me.ratingAfter != null ? (
        <RankUpCelebration
          ratingBefore={me.ratingBefore}
          ratingAfter={me.ratingAfter}
          kind={rankUp}
          onClose={() => setCelebrating(false)}
        />
      ) : null}
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
  const styles = useStyles();
  const t = useStrings(battleStrings);
  const pct = Math.round(accuracy(player) * 100);
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={t.lineA11y(label, player.score, player.correct, player.answered)}
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
  const styles = useStyles();
  const t = useStrings(battleStrings);
  const ranks = useRankLabels();
  const delta = after - before;
  const sign = delta > 0 ? '+' : '';
  const rankBefore = ranks.label(getRank(before));
  const rankAfter = ranks.label(getRank(after));

  if (!placedBefore) {
    return (
      <Card
        style={styles.rating}
        accessibilityLabel={won ? t.placedA11y(rankAfter, after) : t.stillUnplaced}
      >
        <RankEmblemForRating rating={after} size={48} dimmed={!won} />
        <View style={styles.flex}>
          <Text variant="overline">{won ? t.placedOverline : t.unplacedOverline}</Text>
          <Text variant="heading">{won ? `${rankAfter} · ${after} ELO` : t.noRankYet}</Text>
          <Text variant="caption">{won ? t.placedHint : t.unplacedHint}</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card
      style={styles.rating}
      accessibilityLabel={t.eloChangeA11y(before, after, `${sign}${delta}`)}
    >
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

const useStyles = themedStyles(() =>
  StyleSheet.create({
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
  }),
);
