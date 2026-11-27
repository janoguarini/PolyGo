import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Flame,
  ShieldCheck,
  Snowflake,
  Trophy,
  X,
  Zap,
} from 'lucide-react-native';
import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  ZoomIn,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Card, Text, colors, spacing, themedStyles } from '@/design-system';
import { useLocale, useStrings } from '@/i18n';

import { useActivityDays } from '../hooks';
import {
  hoursUntilMidnight,
  monthGrid,
  monthRange,
  monthStats,
  nextMilestone,
  type CalendarDay,
} from '../streak';
import { streakStrings } from '../strings';

interface Props {
  visible: boolean;
  onClose: () => void;
  /** Racha actual, tal como la calcula el servidor (get_learning_summary). */
  streak: number;
  activeToday: boolean;
  /** Protectores de racha guardados. */
  freezes?: number;
  /** Botón «Practicar ahora» cuando hoy todavía no hubo estudio. Sin él, sólo cierra. */
  onPractice?: () => void;
}

const FIRE: readonly [string, string, string] = ['#FDBA74', '#F97316', '#DC2626'];
const EMBER: readonly [string, string] = ['#3B2F5C', '#1E1A33'];

/**
 * Calendario de racha: se abre tocando el fuego de Aprender. Muestra mes a mes los días con estudio
 * y los cubiertos por un protector, leídos de la base (user_daily_activity, user_frozen_days), con el
 * estado de hoy, el próximo hito y las tandas del mes. Sólo lee: abrirlo o cerrarlo no cambia la racha.
 */
export function StreakCalendar({
  visible,
  onClose,
  streak,
  activeToday,
  freezes = 0,
  onPractice,
}: Props) {
  const styles = useStyles();
  const t = useStrings(streakStrings);
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const now = new Date();
  const [month, setMonth] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const { from, to } = monthRange(month.year, month.month);
  const activity = useActivityDays(from, to, visible);
  const isCurrentMonth = month.year === now.getFullYear() && month.month === now.getMonth();
  const weeks = monthGrid(
    month.year,
    month.month,
    activity.data?.studied ?? [],
    activity.data?.frozen ?? [],
    now,
  );
  const stats = monthStats(weeks);
  const milestone = nextMilestone(streak);
  const title = new Date(month.year, month.month, 1).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });

  const shift = (delta: number) => {
    void Haptics.selectionAsync();
    setMonth((m) => {
      const d = new Date(m.year, m.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const close = () => {
    onClose();
    // La próxima vez abre en el mes actual.
    setMonth({ year: now.getFullYear(), month: now.getMonth() });
  };

  const practice = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    close();
    onPractice?.();
  };

  useEffect(() => {
    if (visible && activeToday) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible, activeToday]);

  const status = activeToday
    ? { title: t.safeToday, sub: t.safeTodaySub }
    : streak > 0
      ? { title: t.atRisk(hoursUntilMidnight(now)), sub: t.atRiskSub }
      : { title: t.startToday, sub: t.startTodaySub };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={close}>
      <Pressable style={styles.backdrop} accessibilityLabel={t.close} onPress={close}>
        {/* Los toques dentro de la tarjeta no cierran el calendario. */}
        <Pressable onPress={() => undefined} accessible={false} style={styles.sheetWrap}>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <Card style={styles.sheet}>
              <LinearGradient
                colors={activeToday ? FIRE : EMBER}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hero}
              >
                <View style={styles.heroTop}>
                  <Text variant="overline" style={styles.onFire}>
                    {t.calendarTitle}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t.close}
                    onPress={close}
                    hitSlop={10}
                    style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
                  >
                    <X color="#FFFFFF" size={18} />
                  </Pressable>
                </View>

                <View
                  style={styles.heroBody}
                  accessible
                  accessibilityLabel={`${streak} ${t.streakCount(streak)}`}
                >
                  <PulsingFlame lit={activeToday} animate={visible && !reduceMotion} />
                  <View style={styles.heroCount}>
                    <Animated.View
                      key={visible ? 'open' : 'closed'}
                      entering={reduceMotion ? undefined : ZoomIn.springify().damping(9)}
                    >
                      <Text variant="display" style={[styles.onFire, styles.bigNumber]}>
                        {streak}
                      </Text>
                    </Animated.View>
                    <Text variant="bodyStrong" style={styles.onFireSoft}>
                      {t.streakCount(streak)}
                    </Text>
                  </View>
                </View>

                <View style={styles.milestone}>
                  <View style={styles.milestoneRow}>
                    <Trophy color="#FDE68A" size={14} />
                    <Text variant="caption" style={styles.onFireSoft}>
                      {t.milestoneLeft(
                        milestone.target - streak,
                        milestone.target,
                        milestone.polys,
                      )}
                    </Text>
                  </View>
                  <ProgressBar progress={milestone.progress} animate={visible && !reduceMotion} />
                </View>
              </LinearGradient>

              <View
                style={[styles.status, activeToday ? styles.statusSafe : styles.statusRisk]}
                accessible
                accessibilityLabel={`${status.title}. ${status.sub}`}
              >
                {activeToday ? (
                  <ShieldCheck color={colors.success} size={22} />
                ) : (
                  <Flame color={colors.streak} size={22} />
                )}
                <View style={styles.flex}>
                  <Text variant="bodyStrong" color={activeToday ? 'success' : 'streak'}>
                    {status.title}
                  </Text>
                  <Text variant="caption">{status.sub}</Text>
                </View>
              </View>
              {!activeToday ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={practice}
                  style={({ pressed }) => [pressed && styles.ctaPressed]}
                >
                  <LinearGradient
                    colors={FIRE}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.cta}
                  >
                    <Flame color="#FFFFFF" fill="#FFFFFF" size={18} />
                    <Text variant="bodyStrong" style={styles.onFire}>
                      {t.practiceNow}
                    </Text>
                  </LinearGradient>
                </Pressable>
              ) : null}

              <View style={styles.stats}>
                <Stat
                  icon={<CalendarCheck color={colors.streak} size={18} />}
                  value={stats.studied}
                  label={t.statMonth}
                />
                <Stat
                  icon={<Zap color={colors.gold} fill={colors.gold} size={18} />}
                  value={stats.bestRun}
                  label={t.statBest}
                />
                <Stat
                  icon={<Snowflake color={colors.info} size={18} />}
                  value={freezes}
                  label={t.statFreezes}
                />
              </View>

              <View style={styles.monthRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t.prevMonth}
                  onPress={() => shift(-1)}
                  hitSlop={10}
                  style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
                >
                  <ChevronLeft color={colors.primarySoft} size={20} />
                </Pressable>
                <Text variant="bodyStrong" color="textStrong" style={styles.monthTitle}>
                  {title.charAt(0).toUpperCase() + title.slice(1)}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t.nextMonth}
                  accessibilityState={{ disabled: isCurrentMonth }}
                  disabled={isCurrentMonth}
                  onPress={() => shift(1)}
                  hitSlop={10}
                  style={({ pressed }) => [
                    styles.navButton,
                    isCurrentMonth && styles.navDisabled,
                    pressed && styles.pressed,
                  ]}
                >
                  <ChevronRight color={colors.primarySoft} size={20} />
                </Pressable>
              </View>

              <View style={styles.week}>
                {t.weekLabels.map((label, i) => (
                  <Text key={i} variant="caption" align="center" style={styles.cell}>
                    {label}
                  </Text>
                ))}
              </View>

              <View style={styles.grid}>
                {activity.isError ? (
                  <View style={styles.state}>
                    <Text variant="caption" align="center">
                      {t.loadError}
                    </Text>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => void activity.refetch()}
                      hitSlop={8}
                    >
                      <Text variant="bodyStrong" color="primarySoft">
                        {t.retry}
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  weeks.map((week, w) => {
                    const perfect = week.every((d) => d && (d.studied || d.frozen));
                    return (
                      <View key={w} style={styles.week}>
                        {week.map((day, i) => {
                          if (!day) return <View key={`empty-${w}-${i}`} style={styles.cell} />;
                          const linked = (d: CalendarDay | null | undefined) =>
                            Boolean(d && (d.studied || d.frozen));
                          const inChain = linked(day);
                          return (
                            <DayCell
                              key={day.key}
                              day={day}
                              order={w * 7 + i}
                              animate={visible && !reduceMotion}
                              perfect={perfect}
                              linkLeft={inChain && linked(week[i - 1])}
                              linkRight={inChain && linked(week[i + 1])}
                              label={t.dayA11y(
                                new Date(month.year, month.month, day.day).toLocaleDateString(
                                  locale,
                                  { day: 'numeric', month: 'long' },
                                ),
                                day.studied ? 'studied' : day.frozen ? 'frozen' : 'none',
                              )}
                            />
                          );
                        })}
                      </View>
                    );
                  })
                )}
                {activity.isPending && visible ? (
                  <View style={styles.loading} pointerEvents="none">
                    <ActivityIndicator color={colors.primarySoft} />
                  </View>
                ) : null}
              </View>

              <View style={styles.legend}>
                <Legend swatch={<View style={[styles.swatch, styles.studiedDot]} />}>
                  {t.legendStudied}
                </Legend>
                <Legend
                  swatch={
                    <View style={[styles.swatch, styles.frozen]}>
                      <Snowflake color={colors.info} size={9} />
                    </View>
                  }
                >
                  {t.legendFrozen}
                </Legend>
                <Legend swatch={<View style={[styles.swatch, styles.perfectDot]} />}>
                  {t.legendPerfect}
                </Legend>
                <Legend swatch={<View style={[styles.swatch, styles.today]} />}>
                  {t.legendToday}
                </Legend>
              </View>
            </Card>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/** Fuego del héroe: late y brilla si hoy ya estudiaste; apagado y quieto si no. */
function PulsingFlame({ lit, animate }: { lit: boolean; animate: boolean }) {
  const styles = useStyles();
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (!animate) {
      pulse.value = 0;
      return;
    }
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: lit ? 700 : 1100, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: lit ? 700 : 1100, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
    );
    return () => cancelAnimation(pulse);
  }, [animate, lit, pulse]);
  const glow = useAnimatedStyle(() => ({
    opacity: (lit ? 0.35 : 0.12) + pulse.value * (lit ? 0.35 : 0.12),
    transform: [{ scale: 1 + pulse.value * (lit ? 0.25 : 0.1) }],
  }));
  const flame = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 + pulse.value * (lit ? 0.08 : 0.03) },
      { rotate: `${pulse.value * 4 - 2}deg` },
    ],
  }));
  return (
    <View style={styles.flameBox}>
      <Animated.View style={[styles.flameGlow, glow]} />
      <Animated.View style={flame}>
        <Flame
          color={lit ? '#FFFFFF' : 'rgba(255,255,255,0.55)'}
          fill={lit ? '#FEF3C7' : 'transparent'}
          size={52}
        />
      </Animated.View>
    </View>
  );
}

function ProgressBar({ progress, animate }: { progress: number; animate: boolean }) {
  const styles = useStyles();
  const fill = useSharedValue(animate ? 0 : progress);
  useEffect(() => {
    fill.value = animate ? withSpring(progress, { damping: 14 }) : progress;
  }, [animate, progress, fill]);
  const bar = useAnimatedStyle(() => ({ width: `${Math.max(4, fill.value * 100)}%` }));
  return (
    <View style={styles.track}>
      <Animated.View style={[styles.trackFill, bar]} />
    </View>
  );
}

function DayCell({
  day,
  label,
  order,
  animate,
  perfect,
  linkLeft,
  linkRight,
}: {
  day: CalendarDay;
  label: string;
  order: number;
  animate: boolean;
  perfect: boolean;
  linkLeft: boolean;
  linkRight: boolean;
}) {
  const styles = useStyles();
  const band = perfect ? styles.bandPerfect : styles.band;
  const pulse = useSharedValue(0);
  const pendingToday = day.isToday && !day.studied && !day.frozen;
  useEffect(() => {
    if (!animate || !pendingToday) return;
    pulse.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
    return () => cancelAnimation(pulse);
  }, [animate, pendingToday, pulse]);
  const ring = useAnimatedStyle(() => ({
    opacity: 1 - pulse.value * 0.6,
    transform: [{ scale: 1 + pulse.value * 0.12 }],
  }));

  const dot = (
    <View
      style={[
        styles.dayDot,
        day.studied && (perfect ? styles.perfectDot : styles.studiedDot),
        day.frozen && styles.frozen,
        day.isToday && day.studied && styles.todayStudied,
      ]}
    >
      {day.frozen ? (
        <Snowflake color={colors.info} size={14} />
      ) : (
        <Text
          variant="caption"
          color={day.isToday ? 'textStrong' : 'text'}
          style={[styles.dayText, day.studied && styles.dayTextOn, day.isFuture && styles.future]}
        >
          {day.day}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.cell} accessible accessibilityLabel={label}>
      {linkLeft ? <View style={[band, styles.bandLeft]} /> : null}
      {linkRight ? <View style={[band, styles.bandRight]} /> : null}
      {pendingToday ? <Animated.View style={[styles.todayRing, ring]} /> : null}
      {animate && day.studied ? (
        <Animated.View
          entering={ZoomIn.delay(Math.min(order * 14, 500))
            .springify()
            .damping(11)}
        >
          {dot}
        </Animated.View>
      ) : (
        dot
      )}
    </View>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  const styles = useStyles();
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${label}: ${value}`}>
      {icon}
      <Text variant="bodyStrong" color="textStrong" style={styles.tabular}>
        {value}
      </Text>
      <Text variant="caption" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function Legend({ swatch, children }: { swatch: ReactNode; children: string }) {
  const styles = useStyles();
  return (
    <View style={styles.legendItem}>
      {swatch}
      <Text variant="caption">{children}</Text>
    </View>
  );
}

const DOT = 34;

const useStyles = themedStyles(() =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'center',
      padding: spacing.lg,
      backgroundColor: 'rgba(7,6,15,0.78)',
    },
    sheetWrap: { width: '100%', maxWidth: 420, maxHeight: '100%', alignSelf: 'center' },
    sheet: { gap: spacing.md, borderColor: colors.brandBorder, overflow: 'hidden' },
    flex: { flex: 1 },
    pressed: { opacity: 0.7 },
    hero: { borderRadius: 18, padding: spacing.md, gap: spacing.sm },
    heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    onFire: { color: '#FFFFFF' },
    onFireSoft: { color: 'rgba(255,255,255,0.88)' },
    closeButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.22)',
    },
    heroBody: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    heroCount: { flex: 1 },
    bigNumber: { fontSize: 52, lineHeight: 58, fontVariant: ['tabular-nums'] },
    flameBox: { width: 84, height: 84, alignItems: 'center', justifyContent: 'center' },
    flameGlow: {
      position: 'absolute',
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: '#FDE68A',
    },
    milestone: { gap: 6 },
    milestoneRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    track: {
      height: 10,
      borderRadius: 5,
      backgroundColor: 'rgba(0,0,0,0.25)',
      overflow: 'hidden',
    },
    trackFill: { height: '100%', borderRadius: 5, backgroundColor: '#FDE68A' },
    status: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.sm,
      borderRadius: 14,
      borderWidth: 1,
    },
    statusSafe: { backgroundColor: 'rgba(52,211,153,0.1)', borderColor: colors.success },
    statusRisk: { backgroundColor: 'rgba(251,146,60,0.1)', borderColor: colors.streak },
    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: 14,
      borderRadius: 14,
    },
    ctaPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    stats: { flexDirection: 'row', gap: spacing.sm },
    stat: {
      flex: 1,
      alignItems: 'center',
      gap: 2,
      paddingVertical: spacing.sm,
      borderRadius: 14,
      backgroundColor: colors.surfaceRaised,
    },
    tabular: { fontVariant: ['tabular-nums'] },
    monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    monthTitle: { flex: 1, textAlign: 'center' },
    navButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceRaised,
    },
    navDisabled: { opacity: 0.35 },
    week: { flexDirection: 'row' },
    grid: { gap: spacing.xs, minHeight: 6 * DOT },
    cell: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: DOT },
    band: {
      position: 'absolute',
      top: 4,
      bottom: 4,
      backgroundColor: 'rgba(251,146,60,0.28)',
    },
    bandPerfect: {
      position: 'absolute',
      top: 4,
      bottom: 4,
      backgroundColor: 'rgba(245,197,66,0.32)',
    },
    bandLeft: { left: 0, right: '50%' },
    bandRight: { left: '50%', right: 0 },
    dayDot: {
      width: DOT,
      height: DOT,
      borderRadius: DOT / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayText: { fontWeight: '600', fontVariant: ['tabular-nums'] },
    dayTextOn: { color: '#FFFFFF', fontWeight: '800' },
    future: { opacity: 0.4 },
    studiedDot: { backgroundColor: '#F97316' },
    perfectDot: { backgroundColor: colors.goldStrong },
    todayStudied: { borderWidth: 2, borderColor: '#FFFFFF' },
    frozen: { backgroundColor: 'rgba(56,189,248,0.22)' },
    today: { borderWidth: 2, borderColor: colors.primaryBright },
    todayRing: {
      position: 'absolute',
      width: DOT,
      height: DOT,
      borderRadius: DOT / 2,
      borderWidth: 2,
      borderColor: colors.primaryBright,
    },
    state: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
    loading: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      columnGap: spacing.md,
      rowGap: spacing.xs,
      paddingTop: spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    swatch: {
      width: 14,
      height: 14,
      borderRadius: 7,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);
