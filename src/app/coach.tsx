import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  BookOpen,
  Brain,
  ChevronLeft,
  CircleCheck,
  Clock,
  Crown,
  ImageOff,
  Lock,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react-native';
import { useMemo, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { coachSessionPlan, diagnose, pickCoachReview, type CoachArea } from '@shared/coach';
import type { TopicUnit } from '@shared/focusReview';
import { smartOverview } from '@shared/smartOverview';

import {
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
import { useCoachStatus, type CoachStatus } from '@/features/coach/api';
import { coachProgress, sessionAccuracy } from '@/features/coach/progress';
import type { WordProgressEntry } from '@/features/learning/api';
import { useCurriculum, useMyWords } from '@/features/learning/hooks';
import { GoldButton, PLUS_INK } from '@/features/plus/components/GoldButton';
import { SegmentRing, WORD_GROUP_COLORS } from '@/features/plus/components/ProgressRing';
import { useInterfaceLanguage, useLocale, useStrings } from '@/i18n';
import { coachStrings } from '@/i18n/screens/coach';

/** Palabras que se muestran como adelanto de la sesión. */
const PREVIEW_WORDS = 8;
/** Colores de prioridad de las áreas a mejorar (1.ª, 2.ª, 3.ª). */
const PRIORITY = ['#FB7185', '#FB923C', '#A78BFA'] as const;

/**
 * Coach (PolyGo Plus, primera versión sin IA generativa), con el mismo lenguaje visual que el repaso
 * inteligente y el repaso por tema. Todo sale de datos reales: tus palabras en tres grupos
 * (shared/smartOverview), el diagnóstico por reglas (shared/coach), la sesión propuesta con las mismas
 * reglas que usa el servidor (coachSessionPlan / pickCoachReview) y tus sesiones anteriores
 * (get_coach_status). Diagnóstico, plan e historial son gratis; empezar una sesión requiere Plus o
 * una de las 2 de prueba (las cuenta el servidor).
 */
export default function CoachScreen() {
  const styles = useStyles();
  const t = useStrings(coachStrings);
  const ui = useInterfaceLanguage();
  const words = useMyWords();
  const curriculum = useCurriculum();
  const status = useCoachStatus();
  const [now] = useState(() => Date.now());

  const units = useMemo<TopicUnit[]>(
    () =>
      (curriculum.data?.units ?? []).map((u) => ({
        id: u.id,
        level: u.level,
        emoji: u.emoji,
        title: ui === 'en' && u.titleEn ? u.titleEn : u.title,
      })),
    [curriculum.data, ui],
  );
  const diagnosis = useMemo(
    () => (words.data ? diagnose(units, words.data) : null),
    [units, words.data],
  );
  const overview = useMemo(
    () => (words.data ? smartOverview(words.data, units, now) : null),
    [words.data, units, now],
  );
  const plan = useMemo(
    () => (diagnosis && words.data ? coachSessionPlan(diagnosis, words.data) : null),
    [diagnosis, words.data],
  );
  const preview = useMemo<WordProgressEntry[]>(
    () => (words.data && plan ? pickCoachReview(words.data, plan.unitIds, PREVIEW_WORDS) : []),
    [words.data, plan],
  );

  if (words.isPending || curriculum.isPending || status.isPending) return <LoadingState />;
  if (words.isError || curriculum.isError || !diagnosis || !overview) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <ErrorState
          message={t.loadError}
          onRetry={() => {
            void words.refetch();
            void curriculum.refetch();
          }}
        />
      </Screen>
    );
  }

  const coach = status.data;
  const weak = diagnosis.status === 'ok' ? diagnosis.weak : [];
  const strong = diagnosis.status === 'insufficient_data' ? [] : diagnosis.strong;
  const g = overview.groups;
  const bubble =
    diagnosis.status === 'insufficient_data'
      ? t.bubbleNew(diagnosis.studied, diagnosis.needed)
      : plan?.kind === 'focus'
        ? t.bubbleFocus(weak.map((a) => a.unit.title))
        : plan
          ? t.bubbleMaintenance(plan.exercises)
          : t.bubbleClean;
  const start = () =>
    plan &&
    router.push({ pathname: '/review', params: { mode: 'coach', units: plan.unitIds.join(',') } });

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
          <Sparkles color={colors.gold} size={22} />
          <Text variant="heading" color="textStrong" accessibilityRole="header">
            {t.title}
          </Text>
        </View>
        {coach ? <StatusPill coach={coach} /> : null}
      </View>

      {/* Tus palabras en tres grupos (mismo anillo que el repaso inteligente). */}
      <LinearGradient
        colors={['#6D36E0', '#3F1D9E', '#241258']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <SegmentRing
          size={124}
          stroke={12}
          segments={[
            { value: g.mastered, color: WORD_GROUP_COLORS.mastered },
            { value: g.due, color: WORD_GROUP_COLORS.due },
            { value: g.struggling, color: WORD_GROUP_COLORS.struggling },
          ]}
          accessibilityLabel={t.groupsA11y(g.mastered, g.due, g.struggling, overview.studied)}
        >
          <Text style={styles.ringValue} color="textStrong">
            {g.mastered}
            <Text style={styles.ringTotal} color="text">
              {t.ofTotal(overview.studied)}
            </Text>
          </Text>
          <Text style={styles.ringCaption} color="text">
            {t.mastered}
          </Text>
        </SegmentRing>
        <View style={styles.legendCol}>
          {(['mastered', 'due', 'struggling'] as const).map((k) => (
            <View key={k} style={styles.groupRow}>
              <View style={[styles.groupDot, { backgroundColor: WORD_GROUP_COLORS[k] }]} />
              <Text style={styles.groupCount} color="textStrong">
                {g[k]}
              </Text>
              <View style={styles.flex}>
                <Text style={styles.groupLabel} color="textStrong" numberOfLines={1}>
                  {t.groups[k]}
                </Text>
                <Text style={styles.groupHint} color="text" numberOfLines={1}>
                  {t.groupsHint[k]}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* El Coach te habla: diagnóstico corto y honesto. */}
      <View style={styles.bubbleRow}>
        <View style={styles.avatar} pointerEvents="none">
          <Mascot pose={plan ? 'pointDown' : 'thinking'} height={58} />
        </View>
        <View style={styles.bubble}>
          <Text style={styles.overline}>{t.overline}</Text>
          <Text color="textStrong" style={styles.bubbleText}>
            {bubble}
          </Text>
        </View>
      </View>

      {plan && coach ? (
        coach.canStart ? (
          <View style={styles.sessionCard}>
            <View style={styles.sessionTop}>
              <Text variant="heading" color="textStrong">
                {plan.kind === 'focus' ? t.sessionFocus : t.sessionMaintenance}
              </Text>
              <View style={styles.metaRow}>
                <Meta
                  icon={<Clock color={colors.text} size={14} />}
                  label={t.minutes(plan.minutes.low, plan.minutes.high)}
                />
                <Meta
                  icon={<Play color={colors.text} size={14} />}
                  label={t.exercises(plan.exercises)}
                />
              </View>
            </View>
            {preview.length > 0 ? (
              <View style={styles.chips}>
                {preview.map((e) => (
                  <View key={e.word.id} style={styles.chip}>
                    <Text style={styles.chipText} color="textStrong">
                      {e.word.text}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
            <GoldButton
              label={t.start}
              sublabel={
                coach.plus
                  ? t.startSubPlus
                  : t.startSubTrial(coach.trialRemaining, coach.trialLimit)
              }
              icon={<Play color={PLUS_INK} fill={PLUS_INK} size={18} />}
              onPress={start}
            />
          </View>
        ) : (
          <View style={[styles.sessionCard, styles.locked]}>
            <View style={styles.row}>
              <View style={styles.lockIcon}>
                <Lock color={PLUS_INK} size={16} />
              </View>
              <Text variant="heading" color="textStrong" style={styles.flex}>
                {t.lockedTitle}
              </Text>
            </View>
            <Text color="text">{t.lockedBody(coach.trialLimit)}</Text>
            <GoldButton
              label={t.unlock}
              sublabel={t.unlockSub}
              onPress={() => router.push('/plus')}
            />
          </View>
        )
      ) : diagnosis.status === 'insufficient_data' ? (
        <Button
          label={t.goLearn}
          size="lg"
          icon={<BookOpen color={colors.onPrimary} size={20} />}
          onPress={() => router.dismissTo('/')}
        />
      ) : null}

      {weak.length > 0 ? (
        <View style={styles.section}>
          <SectionTitle icon={<Target color={colors.streak} size={20} />} title={t.plan} />
          {weak.map((a, i) => (
            <AreaCard key={a.unit.id} area={a} index={i} />
          ))}
        </View>
      ) : null}

      {strong.length > 0 ? (
        <View style={styles.section}>
          <SectionTitle
            icon={<CircleCheck color={colors.success} size={20} />}
            title={t.strengths}
          />
          <View style={styles.chips}>
            {strong.map((a) => (
              <View key={a.unit.id} style={styles.strongChip}>
                <Text>{a.unit.emoji}</Text>
                <Text variant="caption" color="textStrong" style={styles.bold}>
                  {a.unit.title}
                </Text>
                <Text variant="caption" color="success" style={styles.bold}>
                  {Math.round((1 - a.errorRate) * 100)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {coach && coach.sessions.length > 0 ? <Progress coach={coach} units={units} /> : null}

      {coach && !coach.plus ? (
        <View style={styles.section}>
          <Text variant="caption" color="text" style={styles.bold}>
            {t.alsoInPlus}
          </Text>
          <View style={styles.tilesRow}>
            <MiniTile icon={<Brain color={colors.gold} size={22} />} label={t.perkSmart} />
            <MiniTile icon={<Zap color={colors.gold} size={22} />} label={t.perkEnergy} />
            <MiniTile icon={<ImageOff color={colors.gold} size={22} />} label={t.perkAds} />
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

function StatusPill({ coach }: { coach: CoachStatus }) {
  const styles = useStyles();
  const t = useStrings(coachStrings);
  if (coach.plus) {
    return (
      <View style={styles.pillGold} accessible accessibilityLabel={t.unlimitedA11y}>
        <Crown color={PLUS_INK} fill={PLUS_INK} size={13} />
        <Text style={styles.pillGoldText}>{t.unlimited}</Text>
      </View>
    );
  }
  return (
    <View
      style={styles.pill}
      accessible
      accessibilityLabel={t.freeLeftA11y(coach.trialRemaining, coach.trialLimit)}
    >
      {Array.from({ length: coach.trialLimit }, (_, i) => (
        <View key={i} style={[styles.token, i < coach.trialRemaining && styles.tokenOn]} />
      ))}
      <Text variant="caption" color="textStrong" style={styles.bold}>
        {t.freeLeft(coach.trialRemaining)}
      </Text>
    </View>
  );
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  const styles = useStyles();
  return (
    <View style={styles.row}>
      {icon}
      <Text variant="heading" color="textStrong" accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

function Meta({ icon, label }: { icon: ReactNode; label: string }) {
  const styles = useStyles();
  return (
    <View style={styles.meta}>
      {icon}
      <Text variant="caption" color="text" style={styles.bold}>
        {label}
      </Text>
    </View>
  );
}

function MiniTile({ icon, label }: { icon: ReactNode; label: string }) {
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => router.push('/plus')}
      style={({ pressed }) => [styles.miniTile, pressed && styles.pressed]}
    >
      {icon}
      <Text
        style={styles.miniLabel}
        color="textStrong"
        numberOfLines={2}
        maxFontSizeMultiplier={1.25}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function AreaCard({ area, index }: { area: CoachArea; index: number }) {
  const styles = useStyles();
  const t = useStrings(coachStrings);
  const accuracy = Math.round((1 - area.errorRate) * 100);
  const color = PRIORITY[index] ?? PRIORITY[2];
  const priority = t.priority(index);
  return (
    <View
      style={styles.area}
      accessible
      accessibilityLabel={t.areaA11y(
        index + 1,
        area.unit.title,
        t.accuracy(accuracy),
        t.struggling(area.struggling),
        priority,
      )}
    >
      <View style={[styles.areaRank, { backgroundColor: color }]}>
        <Text style={styles.areaRankText}>{index + 1}</Text>
      </View>
      <View style={styles.flex}>
        <View style={styles.areaTop}>
          <Text variant="bodyStrong" color="textStrong" numberOfLines={1} style={styles.flex}>
            {area.unit.emoji} {area.unit.title}
          </Text>
          <View style={[styles.priority, { borderColor: color }]}>
            <Text style={[styles.priorityText, { color }]}>{priority}</Text>
          </View>
        </View>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${accuracy}%`, backgroundColor: color }]} />
        </View>
        <Text variant="caption" color="text">
          {t.accuracy(accuracy)} · {t.struggling(area.struggling)}
        </Text>
      </View>
    </View>
  );
}

function Progress({ coach, units }: { coach: CoachStatus; units: TopicUnit[] }) {
  const styles = useStyles();
  const t = useStrings(coachStrings);
  const locale = useLocale();
  const progress = coachProgress(coach.sessions);
  const titleOf = (id: string) => units.find((u) => u.id === id)?.title ?? id;
  return (
    <View style={styles.section}>
      <SectionTitle icon={<TrendingUp color={colors.success} size={20} />} title={t.progress} />
      {progress.lastAccuracy !== null ? (
        <View style={styles.progressTop}>
          <View>
            <Text variant="caption" color="text">
              {t.lastSession}
            </Text>
            <Text style={styles.progressValue} color="textStrong">
              {progress.lastAccuracy}%
            </Text>
          </View>
          <View style={styles.flex}>
            {progress.delta !== null ? (
              <View style={[styles.deltaChip, progress.delta < 0 && styles.deltaDown]}>
                <TrendingUp
                  color={progress.delta >= 0 ? colors.success : colors.streak}
                  size={14}
                />
                <Text
                  variant="caption"
                  style={[
                    styles.bold,
                    { color: progress.delta >= 0 ? colors.success : colors.streak },
                  ]}
                >
                  {t.delta(progress.delta)}
                </Text>
              </View>
            ) : null}
            <Text variant="caption" color="text">
              {t.sessionsDone(progress.completed)}
            </Text>
          </View>
        </View>
      ) : null}
      {coach.sessions.slice(0, 5).map((s) => {
        const acc = sessionAccuracy(s);
        return (
          <View key={s.sessionId} style={styles.historyRow}>
            <View style={styles.flex}>
              <Text variant="bodyStrong" color="textStrong" numberOfLines={1}>
                {s.unitIds.map(titleOf).join(' · ')}
              </Text>
              <Text variant="caption" color="text">
                {new Date(s.createdAt).toLocaleDateString(locale)}
                {s.trial ? ` · ${t.trialTag}` : ''}
              </Text>
            </View>
            {acc !== null ? (
              <View style={styles.historyAcc}>
                <View style={styles.miniBar}>
                  <View style={[styles.miniFill, { width: `${acc}%` }]} />
                </View>
                <Text variant="caption" color="textStrong" style={styles.bold}>
                  {acc}%
                </Text>
              </View>
            ) : (
              <Text variant="caption" color="textMuted">
                {t.notFinished}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    flex: { flex: 1 },
    bold: { fontWeight: '700' },
    pressed: { opacity: 0.75 },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    back: { width: 36, height: 44, justifyContent: 'center' },
    headerTitle: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: spacing.sm,
      paddingVertical: 5,
      borderRadius: radii.pill,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    token: { width: 9, height: 9, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.18)' },
    tokenOn: { backgroundColor: colors.gold },
    pillGold: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 5,
      borderRadius: radii.pill,
      backgroundColor: colors.gold,
    },
    pillGoldText: { color: PLUS_INK, fontWeight: '900', fontSize: 13 },
    hero: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: radii.xl,
      borderWidth: 1,
      borderColor: 'rgba(233,213,255,0.35)',
      shadowColor: '#A855F7',
      shadowOpacity: 0.55,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 0 },
      elevation: 10,
    },
    ringValue: { fontSize: 30, lineHeight: 34, fontWeight: '900', fontVariant: ['tabular-nums'] },
    ringTotal: { fontSize: 16, fontWeight: '800' },
    ringCaption: { fontSize: 12, lineHeight: 14, fontWeight: '700' },
    legendCol: { flex: 1, gap: spacing.sm },
    groupRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    groupDot: { width: 12, height: 12, borderRadius: 6 },
    groupCount: {
      width: 34,
      fontSize: 20,
      lineHeight: 24,
      fontWeight: '900',
      fontVariant: ['tabular-nums'],
      textAlign: 'center',
    },
    groupLabel: { fontSize: 13, lineHeight: 16, fontWeight: '800' },
    groupHint: { fontSize: 11, lineHeight: 14 },
    bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(168,85,247,0.25)',
      borderWidth: 2,
      borderColor: colors.gold,
    },
    bubble: {
      flex: 1,
      gap: 2,
      padding: spacing.md,
      borderRadius: radii.lg,
      borderBottomLeftRadius: 4,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    overline: { color: colors.gold, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
    bubbleText: { fontSize: 15, lineHeight: 20, fontWeight: '600' },
    sessionCard: {
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: radii.xl,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: 'rgba(251,191,36,0.55)',
    },
    sessionTop: { gap: spacing.xs },
    locked: { backgroundColor: 'rgba(251,191,36,0.06)' },
    lockIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.gold,
    },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radii.pill,
      backgroundColor: colors.inset,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
    chip: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(139,92,246,0.18)',
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    chipText: { fontSize: 14, fontWeight: '800' },
    section: { gap: spacing.sm },
    area: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    areaRank: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    areaRankText: { color: PLUS_INK, fontWeight: '900', fontSize: 15 },
    areaTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    priority: {
      paddingHorizontal: spacing.xs,
      paddingVertical: 1,
      borderRadius: radii.pill,
      borderWidth: 1,
    },
    priorityText: { fontSize: 11, fontWeight: '800' },
    bar: {
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.10)',
      overflow: 'hidden',
      marginVertical: 6,
    },
    barFill: { height: '100%', borderRadius: 4 },
    strongChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(34,197,94,0.12)',
      borderWidth: 1,
      borderColor: 'rgba(34,197,94,0.45)',
    },
    progressTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
      padding: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    progressValue: { fontSize: 32, lineHeight: 36, fontWeight: '900' },
    deltaChip: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(34,197,94,0.14)',
      marginBottom: 4,
    },
    deltaDown: { backgroundColor: 'rgba(251,146,60,0.14)' },
    historyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.brandBorder,
    },
    historyAcc: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    miniBar: {
      width: 56,
      height: 6,
      borderRadius: 3,
      backgroundColor: 'rgba(255,255,255,0.10)',
      overflow: 'hidden',
    },
    miniFill: { height: '100%', borderRadius: 3, backgroundColor: colors.success },
    tilesRow: { flexDirection: 'row', gap: spacing.sm },
    miniTile: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      minHeight: 84,
      padding: spacing.sm,
      borderRadius: radii.lg,
      backgroundColor: 'rgba(139,92,246,0.14)',
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    miniLabel: { fontSize: 13, lineHeight: 16, fontWeight: '800', textAlign: 'center' },
  }),
);
