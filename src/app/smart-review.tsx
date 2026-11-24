import { router } from 'expo-router';
import {
  BookOpen,
  Brain,
  ChartNoAxesColumn,
  ChevronLeft,
  CircleAlert,
  Clock,
  Hourglass,
  Layers,
  Play,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { SmartReason } from '@shared/focusReview';
import { smartOverview } from '@shared/smartOverview';

import {
  BrandCard,
  Button,
  ErrorState,
  LoadingState,
  Mascot,
  Screen,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { useCurriculum, useMyWords } from '@/features/learning/hooks';
import { usePlus } from '@/features/plus/api';
import { PlusCrownPill } from '@/features/plus/components/PlusCrownPill';
import { useStrings } from '@/i18n';
import { practiceStrings } from '@/i18n/screens/practice';
import { smartReviewStrings } from '@/i18n/screens/smart-review';

/** Segmentos de la barra «Tu memoria». */
const SEGMENTS = 9;

const REASON_ICON: Record<SmartReason, typeof BookOpen> = {
  due: BookOpen,
  frequent_mistakes: CircleAlert,
  difficult: Zap,
  due_soon: Hourglass,
};

type Tone = 'high' | 'reinforce' | 'review';
const REASON_TONE: Record<SmartReason, Tone> = {
  due: 'high',
  frequent_mistakes: 'high',
  difficult: 'reinforce',
  due_soon: 'review',
};

/**
 * Presentación del repaso inteligente: cuánto recordás, qué palabras y temas conviene reforzar y
 * qué va a trabajar la sesión. Todo sale de tu historial con las mismas reglas que usa el servidor
 * para armar la sesión (shared/focusReview.ts). Sin Plus se ve igual y el botón lleva a Plus.
 */
export default function SmartReviewScreen() {
  const styles = useStyles();
  const t = useStrings(smartReviewStrings);
  const p = useStrings(practiceStrings);
  const words = useMyWords();
  const curriculum = useCurriculum();
  const plus = usePlus();
  const [now] = useState(() => Date.now());

  if (words.isPending || curriculum.isPending) return <LoadingState />;
  if (words.isError || !words.data) {
    return <ErrorState message={t.loadError} onRetry={() => void words.refetch()} />;
  }
  const o = smartOverview(words.data, curriculum.data?.units ?? [], now);
  const level = t.memoryLevel[o.memoryLevel];
  const filled = Math.round((o.memory / 100) * SEGMENTS);

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.back}
          hitSlop={8}
          onPress={() => router.back()}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <ChevronLeft color={colors.textStrong} size={26} />
        </Pressable>
        <View style={styles.headerTitle}>
          <Brain color={colors.primarySoft} size={26} />
          <Text variant="heading" color="textStrong" accessibilityRole="header" numberOfLines={1}>
            {t.title}
          </Text>
        </View>
        <PlusCrownPill label={t.plus} a11y={p.plusA11y} />
      </View>

      <View style={styles.hero}>
        <View style={styles.heroText}>
          <Text variant="title" color="textStrong" style={styles.heroTitle}>
            {t.heroTitle}
          </Text>
          <Text color="text">{t.heroBody}</Text>
        </View>
        <View style={styles.mascot} pointerEvents="none">
          <Mascot pose="pointUp" height={150} />
        </View>
      </View>

      <BrandCard contentStyle={styles.memoryCard}>
        <View style={styles.rowBetween}>
          <Text variant="heading" color="textStrong">
            {t.yourMemory}
          </Text>
          <Text variant="bodyStrong" color="primarySoft">
            {level}
          </Text>
        </View>
        <View style={styles.row} accessible accessibilityLabel={t.memoryA11y(o.memory, level)}>
          <View style={styles.segments}>
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <View key={i} style={[styles.segment, i < filled && styles.segmentOn]} />
            ))}
          </View>
          <Text variant="bodyStrong" color="textStrong" style={styles.percent}>
            {o.memory}%
          </Text>
        </View>
      </BrandCard>

      <View style={styles.statsRow}>
        <StatCard
          icon={<Layers color={colors.primarySoft} size={34} />}
          value={o.toReinforce}
          label={t.toReinforce(o.toReinforce)}
        />
        <StatCard
          icon={<Target color={colors.primarySoft} size={34} />}
          value={o.topicsToImprove}
          label={t.topicsToImprove(o.topicsToImprove)}
        />
      </View>

      <View style={styles.rowBetween}>
        <Text variant="heading" color="textStrong">
          {t.todaySession}
        </Text>
        <View style={styles.personalized}>
          <Sparkles color={colors.success} size={14} />
          <Text variant="caption" color="success" style={styles.bold}>
            {t.personalized}
          </Text>
        </View>
      </View>

      {o.exercises > 0 ? (
        <>
          <View style={styles.strip}>
            <View style={styles.stripItem}>
              <Clock color={colors.text} size={20} />
              <Text variant="bodyStrong" color="textStrong">
                {t.minutes(o.minutes.low, o.minutes.high)}
              </Text>
            </View>
            <View style={styles.stripDivider} />
            <View style={styles.stripItem}>
              <ChartNoAxesColumn color={colors.primarySoft} size={20} />
              <Text variant="bodyStrong" color="textStrong">
                {t.exercises(o.exercises)}
              </Text>
            </View>
          </View>

          <BrandCard contentStyle={styles.workCard}>
            <View style={styles.row}>
              <Target color={colors.primarySoft} size={24} />
              <Text variant="heading" color="textStrong">
                {t.whatWeWork}
              </Text>
            </View>
            {o.focus.map(({ reason, count }) => (
              <FocusRow
                key={reason}
                icon={REASON_ICON[reason]}
                label={t.reason[reason]}
                tag={t.tag[reason]}
                tone={REASON_TONE[reason]}
                a11y={t.reasonA11y(t.reason[reason], count, t.tag[reason])}
              />
            ))}
          </BrandCard>
        </>
      ) : (
        <BrandCard contentStyle={styles.workCard}>
          <Text variant="bodyStrong" color="textStrong">
            {t.emptyTitle}
          </Text>
          <Text color="text">{t.emptyBody}</Text>
        </BrandCard>
      )}

      {plus === true ? (
        <Button
          label={t.start}
          size="lg"
          icon={<Play color={colors.onPrimary} fill={colors.onPrimary} size={20} />}
          disabled={o.exercises === 0}
          onPress={() => router.replace({ pathname: '/review', params: { mode: 'smart' } })}
        />
      ) : (
        <Button
          label={t.unlock}
          size="lg"
          icon={<Sparkles color={colors.onPrimary} size={20} />}
          onPress={() => router.push('/plus')}
        />
      )}
      <Text variant="caption" color="text" align="center">
        {t.footer}
      </Text>
    </Screen>
  );
}

function StatCard({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  const styles = useStyles();
  return (
    <BrandCard
      style={styles.flex}
      contentStyle={styles.statCard}
      accessibilityLabel={`${value} ${label}`}
    >
      {icon}
      <View style={styles.flex}>
        <Text variant="title" color="textStrong" style={styles.statValue}>
          {value}
        </Text>
        <Text color="text" numberOfLines={2}>
          {label}
        </Text>
      </View>
    </BrandCard>
  );
}

function FocusRow({
  icon: Icon,
  label,
  tag,
  tone,
  a11y,
}: {
  icon: typeof BookOpen;
  label: string;
  tag: string;
  tone: Tone;
  a11y: string;
}) {
  const styles = useStyles();
  const toneStyle =
    tone === 'high'
      ? styles.tagHigh
      : tone === 'reinforce'
        ? styles.tagReinforce
        : styles.tagReview;
  const toneColor = tone === 'high' ? 'streak' : tone === 'reinforce' ? 'primarySoft' : 'success';
  return (
    <View style={styles.focusRow} accessible accessibilityLabel={a11y}>
      <Icon color={colors.primarySoft} size={22} />
      <Text variant="bodyStrong" color="textStrong" style={styles.flex} numberOfLines={2}>
        {label}
      </Text>
      <View style={[styles.tag, toneStyle]}>
        <Text variant="caption" color={toneColor} style={styles.bold} numberOfLines={1}>
          {tag}
        </Text>
      </View>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    flex: { flex: 1 },
    bold: { fontWeight: '700' },
    pressed: { opacity: 0.75 },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    back: { width: 36, height: 44, justifyContent: 'center' },
    headerTitle: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    hero: { flexDirection: 'row', alignItems: 'center', minHeight: 150 },
    heroText: { flex: 1, gap: spacing.sm, zIndex: 1 },
    heroTitle: { fontSize: 28, lineHeight: 33 },
    mascot: { marginRight: -spacing.md, marginLeft: -spacing.lg },
    memoryCard: { gap: spacing.md, padding: spacing.lg },
    segments: { flex: 1, flexDirection: 'row', gap: spacing.xxs },
    segment: {
      flex: 1,
      height: 12,
      borderRadius: 6,
      backgroundColor: 'rgba(139,92,246,0.22)',
    },
    segmentOn: { backgroundColor: colors.primaryBright },
    percent: { minWidth: 44, textAlign: 'right', fontVariant: ['tabular-nums'] },
    statsRow: { flexDirection: 'row', gap: spacing.md },
    statCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
    statValue: { fontVariant: ['tabular-nums'] },
    personalized: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xxs,
      borderRadius: radii.pill,
      borderWidth: 1,
      borderColor: colors.success,
      backgroundColor: 'rgba(34,197,94,0.12)',
    },
    strip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    stripItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    stripDivider: { width: 1, height: 28, backgroundColor: colors.brandBorder },
    workCard: { gap: spacing.sm, padding: spacing.lg },
    focusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.inset,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    tag: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      borderRadius: radii.pill,
      borderWidth: 1,
    },
    tagHigh: { borderColor: colors.streak, backgroundColor: 'rgba(251,146,60,0.14)' },
    tagReinforce: { borderColor: colors.primary, backgroundColor: 'rgba(139,92,246,0.16)' },
    tagReview: { borderColor: colors.success, backgroundColor: 'rgba(34,197,94,0.12)' },
  }),
);
