import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  ImageOff,
  Layers,
  Lock,
  Play,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import { useMemo, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { pickSmartReview, type SmartReason } from '@shared/focusReview';
import { smartOverview } from '@shared/smartOverview';

import {
  ErrorState,
  LoadingState,
  Screen,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { useCurriculum, useMyWords, useStudyCourse } from '@/features/learning/hooks';
import type { ReviewFocus } from '@/features/learning/api';
import { useWarmReview } from '@/features/learning/reviewWarmup';
import { usePlus } from '@/features/plus/api';
import { GoldButton, PLUS_INK } from '@/features/plus/components/GoldButton';
import { SegmentRing, WORD_GROUP_COLORS } from '@/features/plus/components/ProgressRing';
import { useStrings } from '@/i18n';
import { smartReviewStrings } from '@/i18n/screens/smart-review';

/** Color de cada motivo en la barra de la sesión. */
const REASON_COLOR: Record<SmartReason, string> = {
  due: '#FB7185',
  frequent_mistakes: '#FB923C',
  difficult: '#A78BFA',
  due_soon: '#38BDF8',
};
/** Palabras de la sesión que se muestran. Sin Plus, sólo las primeras: el resto queda con candado. */
const PREVIEW = 8;
const FREE_VISIBLE = 3;
/** El foco del repaso inteligente (el mismo que arma review.tsx con mode=smart). */
const SMART_FOCUS: ReviewFocus = { kind: 'smart' };

/**
 * Presentación del repaso inteligente. Visual y con poco texto; todo sale de tu historial real con las
 * mismas reglas que usa el servidor para armar la sesión (shared/focusReview.ts). La ven todos: sin
 * Plus, la sesión se ve armada (con algunas palabras bloqueadas) y el botón lleva a Plus.
 */
export default function SmartReviewScreen() {
  const styles = useStyles();
  const t = useStrings(smartReviewStrings);
  const words = useMyWords();
  const curriculum = useCurriculum();
  const plus = usePlus();
  const course = useStudyCourse();
  const [now] = useState(() => Date.now());

  const preview = useMemo(
    () => (words.data ? pickSmartReview(words.data, now, PREVIEW).map((p) => p.entry) : []),
    [words.data, now],
  );

  // Con Plus y algo para trabajar, el repaso inteligente se prepara mientras leés la presentación.
  useWarmReview(course, plus === true && preview.length > 0 ? SMART_FOCUS : null);

  if (words.isPending || curriculum.isPending) return <LoadingState />;
  if (words.isError || !words.data) {
    return <ErrorState message={t.loadError} onRetry={() => void words.refetch()} />;
  }
  const o = smartOverview(words.data, curriculum.data?.units ?? [], now);
  const locked = plus !== true;
  const totalFocus = o.focus.reduce((n, f) => n + f.count, 0);
  // Palabras que el repaso espaciado gratis pide hoy (el camino gratis que siempre se ofrece).
  const dueToday = words.data.filter(
    (e) => e.seenCount > 0 && e.nextReviewAt !== null && Date.parse(e.nextReviewAt) <= now,
  ).length;

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
          <Brain color={colors.primarySoft} size={24} />
          <Text variant="heading" color="textStrong" accessibilityRole="header" numberOfLines={1}>
            {t.title}
          </Text>
        </View>
        <View style={styles.plusPill}>
          <Crown color={PLUS_INK} fill={PLUS_INK} size={12} />
          <Text style={styles.plusPillText}>{t.plus}</Text>
        </View>
      </View>

      {/* Tus palabras en tres grupos que suman el total: se entiende sin explicación. */}
      <LinearGradient
        colors={['#6D36E0', '#3F1D9E', '#241258']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <SegmentRing
          size={136}
          stroke={13}
          segments={[
            { value: o.groups.mastered, color: WORD_GROUP_COLORS.mastered },
            { value: o.groups.due, color: WORD_GROUP_COLORS.due },
            { value: o.groups.struggling, color: WORD_GROUP_COLORS.struggling },
          ]}
          accessibilityLabel={t.groupsA11y(
            o.groups.mastered,
            o.groups.due,
            o.groups.struggling,
            o.studied,
          )}
        >
          <Text style={styles.ringValue} color="textStrong">
            {o.groups.mastered}
            <Text style={styles.ringTotal} color="text">
              {t.ofTotal(o.studied)}
            </Text>
          </Text>
          <Text style={styles.ringCaption} color="text">
            {t.masteredCaption}
          </Text>
        </SegmentRing>
        <View style={styles.legendCol}>
          {(['mastered', 'due', 'struggling'] as const).map((g) => (
            <View key={g} style={styles.groupRow}>
              <View style={[styles.groupDot, { backgroundColor: WORD_GROUP_COLORS[g] }]} />
              <Text style={styles.groupCount} color="textStrong">
                {o.groups[g]}
              </Text>
              <View style={styles.groupText}>
                <Text style={styles.groupLabel} color="textStrong" numberOfLines={1}>
                  {t.groups[g]}
                </Text>
                <Text style={styles.groupHint} color="text" numberOfLines={1}>
                  {t.groupsHint[g]}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </LinearGradient>

      {o.exercises > 0 ? (
        <View style={[styles.session, locked && styles.sessionLocked]}>
          <View style={styles.sessionTop}>
            <Text variant="heading" color="textStrong">
              {t.todaySession}
            </Text>
            <View style={styles.metaRow}>
              <Meta
                icon={<Clock color={colors.text} size={14} />}
                label={t.minutes(o.minutes.low, o.minutes.high)}
              />
              <Meta
                icon={<Play color={colors.text} size={14} />}
                label={t.exercises(o.exercises)}
              />
            </View>
          </View>

          {/* Qué trabaja la sesión: barra de colores proporcional + leyenda con números. */}
          <View style={styles.stack} accessible={false}>
            {o.focus.map((f) => (
              <View
                key={f.reason}
                style={{
                  flex: f.count / Math.max(1, totalFocus),
                  backgroundColor: REASON_COLOR[f.reason],
                }}
              />
            ))}
          </View>
          <View style={styles.legend}>
            {o.focus.map((f) => (
              <View
                key={f.reason}
                style={styles.legendItem}
                accessible
                accessibilityLabel={t.reasonA11y(t.reason[f.reason], f.count)}
              >
                <View style={[styles.dot, { backgroundColor: REASON_COLOR[f.reason] }]} />
                <Text variant="caption" color="textStrong" style={styles.bold}>
                  {f.count}
                </Text>
                <Text variant="caption" color="text">
                  {t.reason[f.reason]}
                </Text>
              </View>
            ))}
          </View>

          {preview.length > 0 ? (
            <View style={styles.wordsBlock}>
              <Text variant="caption" color="text" style={styles.bold}>
                {t.wordsToday}
              </Text>
              <View style={styles.chips}>
                {(locked ? preview.slice(0, FREE_VISIBLE) : preview).map((e) => (
                  <View key={e.word.id} style={styles.chip}>
                    <Text style={styles.chipText} color="textStrong">
                      {e.word.text}
                    </Text>
                  </View>
                ))}
                {locked && preview.length > FREE_VISIBLE ? (
                  <View
                    style={[styles.chip, styles.chipLocked]}
                    accessible
                    accessibilityLabel={t.lockedA11y(preview.length - FREE_VISIBLE)}
                  >
                    <Lock color={PLUS_INK} size={13} />
                    <Text style={styles.chipLockedText}>
                      {t.moreLocked(preview.length - FREE_VISIBLE)}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}

          {locked ? (
            <GoldButton
              label={t.unlock}
              sublabel={t.unlockSub}
              onPress={() => router.push('/plus')}
            />
          ) : (
            <GoldButton
              label={t.start}
              sublabel={t.startSub}
              icon={<Play color={PLUS_INK} fill={PLUS_INK} size={18} />}
              onPress={() => router.replace({ pathname: '/review', params: { mode: 'smart' } })}
            />
          )}
        </View>
      ) : (
        <View style={styles.session}>
          <Text variant="bodyStrong" color="textStrong">
            {t.emptyTitle}
          </Text>
          <Text color="text">{t.emptyBody}</Text>
        </View>
      )}

      {locked ? (
        <>
          {/* Lo que suma Plus además del repaso inteligente (lleva a la pantalla de Plus). */}
          <View style={styles.moreBlock}>
            <Text variant="caption" color="text" style={styles.bold}>
              {t.alsoInPlus}
            </Text>
            <View style={styles.tilesRow}>
              <MiniTile
                icon={<Sparkles color={colors.gold} size={22} />}
                label={t.perkCoach}
                onPress={() => router.push('/plus')}
              />
              <MiniTile
                icon={<Zap color={colors.gold} size={22} />}
                label={t.perkEnergy}
                onPress={() => router.push('/plus')}
              />
              <MiniTile
                icon={<ImageOff color={colors.gold} size={22} />}
                label={t.perkAds}
                onPress={() => router.push('/plus')}
              />
            </View>
          </View>
          {/* Camino gratis siempre visible: el repaso espaciado de hoy. */}
          {dueToday > 0 ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/review')}
              style={({ pressed }) => [styles.freeLink, pressed && styles.pressed]}
            >
              <BookOpen color={colors.primarySoft} size={18} />
              <Text color="text" style={styles.freeLinkText}>
                {t.freeReview(dueToday)}
              </Text>
              <ChevronRight color={colors.text} size={18} />
            </Pressable>
          ) : null}
        </>
      ) : (
        <View style={styles.moreBlock}>
          <Text variant="caption" color="text" style={styles.bold}>
            {t.morePractice}
          </Text>
          <View style={styles.tilesRow}>
            <MiniTile
              icon={<Layers color={colors.primarySoft} size={22} />}
              label={t.topicReview}
              onPress={() => router.push('/review-topics')}
            />
            <MiniTile
              icon={<Sparkles color={colors.gold} size={22} />}
              label={t.coach}
              onPress={() => router.push('/coach')}
            />
          </View>
        </View>
      )}
    </Screen>
  );
}

function MiniTile({
  icon,
  label,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  onPress: () => void;
}) {
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
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

const useStyles = themedStyles(() =>
  StyleSheet.create({
    bold: { fontWeight: '700' },
    pressed: { opacity: 0.75 },
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    back: { width: 36, height: 44, justifyContent: 'center' },
    headerTitle: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    plusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radii.pill,
      backgroundColor: colors.gold,
    },
    plusPillText: { color: PLUS_INK, fontWeight: '900', fontSize: 13 },
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
      overflow: 'visible',
    },
    ringValue: { fontSize: 32, lineHeight: 36, fontWeight: '900', fontVariant: ['tabular-nums'] },
    ringTotal: { fontSize: 17, fontWeight: '800' },
    legendCol: { flex: 1, gap: spacing.sm },
    groupRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    groupDot: { width: 12, height: 12, borderRadius: 6 },
    // Columna fija y centrada: los números quedan alineados entre el punto y el texto.
    groupCount: {
      width: 34,
      fontSize: 20,
      lineHeight: 24,
      fontWeight: '900',
      fontVariant: ['tabular-nums'],
      textAlign: 'center',
    },
    moreBlock: { gap: spacing.sm },
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
    freeLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    freeLinkText: { flex: 1, fontWeight: '700' },
    groupText: { flex: 1 },
    groupLabel: { fontSize: 13, lineHeight: 16, fontWeight: '800' },
    groupHint: { fontSize: 11, lineHeight: 14 },
    ringCaption: { fontSize: 12, lineHeight: 14, fontWeight: '700' },
    session: {
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: radii.xl,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: 'rgba(251,191,36,0.55)',
    },
    sessionLocked: { backgroundColor: 'rgba(251,191,36,0.05)' },
    sessionTop: { gap: spacing.xs },
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
    stack: {
      flexDirection: 'row',
      height: 14,
      borderRadius: 7,
      overflow: 'hidden',
      gap: 2,
      backgroundColor: 'rgba(255,255,255,0.08)',
    },
    legend: { flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing.md, rowGap: spacing.xs },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    dot: { width: 10, height: 10, borderRadius: 5 },
    wordsBlock: { gap: spacing.xs },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(139,92,246,0.18)',
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    chipText: { fontSize: 14, fontWeight: '800' },
    chipLocked: { backgroundColor: colors.gold, borderColor: colors.gold },
    chipLockedText: { color: PLUS_INK, fontWeight: '900', fontSize: 14 },
  }),
);
