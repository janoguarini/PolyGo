import { CheckCircle2, CloudOff, RotateCcw, Trophy } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import type { Exercise } from '@shared/exercises';

import {
  Button,
  Card,
  Screen,
  StatTile,
  Text,
  colors,
  spacing,
  themedStyles,
} from '@/design-system';
import { TierBadge } from '@/features/profile/components/AchievementBadge';
import { useStrings } from '@/i18n';
import { toUserMessage } from '@/lib/errors';

import type { WordRow } from '../api';
import type { SessionStats } from '../player';
import { resultsStrings } from '../strings';
import { useAchievementTitle } from '@/features/profile/strings';

interface Props {
  title: string;
  stats: SessionStats;
  durationSeconds: number;
  words: Record<string, WordRow>;
  saving: boolean;
  saveError: unknown;
  saved: boolean;
  /** Logros que desbloqueó esta sesión según el servidor. */
  achievements: { id: string; title: string; icon: string }[];
  onRetrySave: () => void;
  /** Cierre de la lección: qué aprendiste («Ahora podés…»). */
  takeaways?: string[];
  /** Texto bajo las palabras con errores (por defecto: volverán en los repasos). */
  mistakesHint?: string;
  /** Contenido adicional al final (p. ej. AL17: volver a la explicación de la lección). */
  extra?: ReactNode;
  primaryLabel: string;
  onPrimary: () => void;
  onExit: () => void;
}

function headline(accuracy: number, t: (typeof resultsStrings)['es']) {
  if (accuracy === 1) return t.perfect;
  if (accuracy >= 0.8) return t.great;
  if (accuracy >= 0.5) return t.good;
  return t.keepGoing;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m} min ${s} s` : `${s} s`;
}

export function SessionResults(props: Props) {
  const styles = useStyles();
  const t = useStrings(resultsStrings);
  const achievementTitle = useAchievementTitle();
  const { stats, words } = props;
  const mistakeWords = uniqueWords(stats.mistakes, words);

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <>
          <Button
            label={props.primaryLabel}
            size="lg"
            disabled={!props.saved}
            onPress={props.onPrimary}
          />
          <Button label={t.back} variant="ghost" onPress={props.onExit} />
        </>
      }
    >
      <Animated.View entering={FadeInUp.duration(400)} style={styles.hero}>
        <Trophy color={stats.accuracy >= 0.8 ? colors.gold : colors.primaryBright} size={56} />
        <Text variant="display" align="center">
          {headline(stats.accuracy, t)}
        </Text>
        <Text color="textMuted" align="center">
          {props.title}
        </Text>
      </Animated.View>

      <View style={styles.grid}>
        <StatTile
          label={t.accuracy}
          value={`${Math.round(stats.accuracy * 100)}%`}
          hint={t.firstTry}
        />
        <StatTile label={t.correct} value={`${stats.firstTryCorrect}/${stats.total}`} />
        <StatTile label={t.time} value={formatDuration(props.durationSeconds)} />
      </View>

      {props.takeaways?.length ? (
        <Card style={styles.gap} accessibilityLabel={t.learnedLabel}>
          <Text variant="overline" color="primarySoft">
            {t.learned}
          </Text>
          {props.takeaways.map((takeaway) => (
            <View key={takeaway} style={styles.takeaway}>
              <CheckCircle2 color={colors.success} size={18} />
              <Text style={styles.flex}>{takeaway}</Text>
            </View>
          ))}
        </Card>
      ) : null}

      {props.saving ? (
        <Text variant="caption" align="center">
          {t.saving}
        </Text>
      ) : null}
      {props.saveError ? (
        <Card style={styles.error}>
          <View style={styles.row}>
            <CloudOff color={colors.danger} size={22} />
            <Text variant="bodyStrong" color="danger">
              {t.saveFailed}
            </Text>
          </View>
          <Text color="textMuted">
            {toUserMessage(props.saveError)} {t.notLost}
          </Text>
          <Button
            label={t.retry}
            variant="secondary"
            icon={<RotateCcw color={colors.text} size={18} />}
            onPress={props.onRetrySave}
          />
        </Card>
      ) : null}

      {props.achievements.length > 0 ? (
        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <Card style={[styles.gap, styles.achievements]} accessibilityLabel={t.newAchievements}>
            <Text variant="overline" color="gold">
              {t.unlocked(props.achievements.length)}
            </Text>
            {props.achievements.map((a) => (
              <View key={a.id} style={styles.row}>
                <TierBadge id={a.id} size={40} />
                <Text variant="bodyStrong" color="textStrong">
                  {achievementTitle(a.id, a.title)}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>
      ) : null}

      {mistakeWords.length > 0 ? (
        <Card style={styles.gap}>
          <Text variant="overline">{t.wordsToReview}</Text>
          {mistakeWords.map((w) => (
            <Text key={w.id}>
              <Text variant="bodyStrong" color="textStrong">
                {w.text}
              </Text>{' '}
              · {w.translation_es}
            </Text>
          ))}
          <Text variant="caption">{props.mistakesHint ?? t.mistakesHint}</Text>
        </Card>
      ) : null}
      {props.extra}
    </Screen>
  );
}

function uniqueWords(exercises: Exercise[], words: Record<string, WordRow>): WordRow[] {
  const seen = new Map<string, WordRow>();
  for (const e of exercises) {
    for (const id of e.wordIds) {
      const w = words[id];
      if (w) seen.set(id, w);
    }
  }
  return [...seen.values()];
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    hero: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    error: { gap: spacing.sm, borderColor: colors.dangerStrong },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    gap: { gap: spacing.sm },
    takeaway: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
    flex: { flex: 1 },
    achievements: { borderColor: colors.goldStrong },
  }),
);
