import * as Haptics from 'expo-haptics';
import { CheckCircle2, CloudOff, RotateCcw, Star, Trophy } from 'lucide-react-native';
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn, useReducedMotion } from 'react-native-reanimated';

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
import { Confetti } from '@/features/battle/components/Confetti';
import { TierBadge } from '@/features/profile/components/AchievementBadge';
import { useStrings } from '@/i18n';
import { toUserMessage } from '@/lib/errors';

import type { WordRow } from '../api';
import type { SessionStats } from '../player';
import { resultsStrings } from '../strings';
import { useCountUp } from '../useCountUp';
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
  /** Recompensa bajo las estadísticas (p. ej. la XP ganada: XpRewardCard). */
  reward?: ReactNode;
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

/** Estrellas de la sesión: 3 perfecta, 2 desde 80 %, 1 desde 50 %. */
export function sessionStars(accuracy: number): 0 | 1 | 2 | 3 {
  if (accuracy >= 1) return 3;
  if (accuracy >= 0.8) return 2;
  if (accuracy >= 0.5) return 1;
  return 0;
}

const STAR_STEP_MS = 280;
const STAR_START_MS = 350;

export function SessionResults(props: Props) {
  const styles = useStyles();
  const t = useStrings(resultsStrings);
  const achievementTitle = useAchievementTitle();
  const reduceMotion = useReducedMotion();
  const { stats, words } = props;
  const mistakeWords = uniqueWords(stats.mistakes, words);
  const stars = sessionStars(stats.accuracy);
  const pct = Math.round(stats.accuracy * 100);
  // Los números suben contando, uno detrás del otro.
  const shownPct = useCountUp(pct, { delay: 500, duration: 900 });
  const shownCorrect = useCountUp(stats.firstTryCorrect, { delay: 650, duration: 700 });
  const shownSeconds = useCountUp(props.durationSeconds, { delay: 800, duration: 700 });

  // Una vibración por estrella, al ritmo en que aparecen.
  useEffect(() => {
    if (reduceMotion || stars === 0) return;
    const timers = Array.from({ length: stars }, (_, i) =>
      setTimeout(
        () =>
          void Haptics.impactAsync(
            i === stars - 1
              ? Haptics.ImpactFeedbackStyle.Heavy
              : Haptics.ImpactFeedbackStyle.Medium,
          ),
        STAR_START_MS + i * STAR_STEP_MS,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [stars, reduceMotion]);

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <>
          {/* No espera al guardado: se guarda en segundo plano (con reintentos, sin duplicar). */}
          <Button label={props.primaryLabel} size="lg" onPress={props.onPrimary} />
          <Button label={t.back} variant="ghost" onPress={props.onExit} />
        </>
      }
    >
      <View style={styles.hero}>
        <Animated.View
          entering={reduceMotion ? undefined : ZoomIn.springify().damping(8)}
          style={[styles.trophy, stats.accuracy >= 0.8 && styles.trophyGlow]}
        >
          <Trophy color={stats.accuracy >= 0.8 ? colors.gold : colors.primaryBright} size={64} />
        </Animated.View>
        <View style={styles.stars} accessible accessibilityLabel={t.starsA11y(stars)}>
          {[0, 1, 2].map((i) => {
            const earned = i < stars;
            return (
              <Animated.View
                key={i}
                entering={
                  reduceMotion || !earned
                    ? undefined
                    : ZoomIn.delay(STAR_START_MS + i * STAR_STEP_MS)
                        .springify()
                        .damping(7)
                }
                style={i === 1 && styles.starMiddle}
              >
                <Star
                  size={i === 1 ? 46 : 36}
                  color={earned ? colors.gold : colors.border}
                  fill={earned ? colors.gold : 'transparent'}
                  strokeWidth={2}
                />
              </Animated.View>
            );
          })}
        </View>
        <Animated.View entering={reduceMotion ? undefined : FadeInUp.delay(250).duration(400)}>
          <Text variant="display" align="center">
            {headline(stats.accuracy, t)}
          </Text>
          <Text color="textMuted" align="center">
            {props.title}
          </Text>
        </Animated.View>
      </View>

      <Animated.View
        entering={reduceMotion ? undefined : FadeInUp.delay(400).duration(400)}
        style={styles.grid}
      >
        <StatTile label={t.accuracy} value={`${shownPct}%`} hint={t.firstTry} />
        <StatTile label={t.correct} value={`${shownCorrect}/${stats.total}`} />
        <StatTile label={t.time} value={formatDuration(shownSeconds)} />
      </Animated.View>

      {props.reward}

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
      {stars >= 2 ? <Confetti /> : null}
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
    hero: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xl },
    trophy: {
      width: 104,
      height: 104,
      borderRadius: 52,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.inset,
    },
    trophyGlow: {
      shadowColor: colors.gold,
      shadowOpacity: 0.7,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 0 },
      elevation: 10,
    },
    stars: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
    starMiddle: { marginBottom: spacing.xs },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    error: { gap: spacing.sm, borderColor: colors.dangerStrong },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    gap: { gap: spacing.sm },
    takeaway: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
    flex: { flex: 1 },
    achievements: { borderColor: colors.goldStrong },
  }),
);
