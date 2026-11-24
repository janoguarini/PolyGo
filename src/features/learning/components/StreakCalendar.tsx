import { ChevronLeft, ChevronRight, Flame, Snowflake, X } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from 'react-native';

import { Card, Text, colors, spacing, themedStyles } from '@/design-system';
import { useLocale, useStrings } from '@/i18n';

import { useActivityDays } from '../hooks';
import { monthGrid, monthRange, type CalendarDay } from '../streak';
import { streakStrings } from '../strings';

interface Props {
  visible: boolean;
  onClose: () => void;
  /** Racha actual, tal como la calcula el servidor (get_learning_summary). */
  streak: number;
  activeToday: boolean;
}

/**
 * Calendario de racha: se abre tocando el fuego de Aprender. Muestra mes a mes los días con estudio
 * y los cubiertos por un protector, leídos de la base (user_daily_activity, user_frozen_days). Sólo
 * lee: abrirlo o cerrarlo no cambia la racha.
 */
export function StreakCalendar({ visible, onClose, streak, activeToday }: Props) {
  const styles = useStyles();
  const t = useStrings(streakStrings);
  const locale = useLocale();
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
  const title = new Date(month.year, month.month, 1).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });

  const shift = (delta: number) =>
    setMonth((m) => {
      const d = new Date(m.year, m.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const close = () => {
    onClose();
    // La próxima vez abre en el mes actual.
    setMonth({ year: now.getFullYear(), month: now.getMonth() });
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={close}>
      <Pressable style={styles.backdrop} accessibilityLabel={t.close} onPress={close}>
        {/* Los toques dentro de la tarjeta no cierran el calendario. */}
        <Pressable onPress={() => undefined} accessible={false} style={styles.sheetWrap}>
          <Card style={styles.sheet}>
            <View style={styles.header}>
              <Text variant="overline">{t.calendarTitle}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t.close}
                onPress={close}
                hitSlop={10}
                style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
              >
                <X color={colors.textMuted} size={20} />
              </Pressable>
            </View>

            <View
              style={styles.hero}
              accessible
              accessibilityLabel={`${streak} ${t.streakCount(streak)}`}
            >
              <View style={[styles.flameRing, activeToday && styles.flameRingActive]}>
                <Flame
                  color={activeToday ? colors.streak : colors.textSubtle}
                  fill={activeToday ? colors.streak : 'transparent'}
                  size={34}
                />
              </View>
              <View>
                <Text
                  variant="display"
                  color={activeToday ? 'streak' : 'textStrong'}
                  style={styles.tabular}
                >
                  {streak}
                </Text>
                <Text variant="bodyStrong" color="textMuted">
                  {t.streakCount(streak)}
                </Text>
              </View>
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
                weeks.map((week, w) => (
                  <View key={w} style={styles.week}>
                    {week.map((day, i) =>
                      day ? (
                        <DayCell
                          key={day.key}
                          day={day}
                          label={t.dayA11y(
                            new Date(month.year, month.month, day.day).toLocaleDateString(locale, {
                              day: 'numeric',
                              month: 'long',
                            }),
                            day.studied ? 'studied' : day.frozen ? 'frozen' : 'none',
                          )}
                        />
                      ) : (
                        <View key={`empty-${w}-${i}`} style={styles.cell} />
                      ),
                    )}
                  </View>
                ))
              )}
              {activity.isPending && visible ? (
                <View style={styles.loading} pointerEvents="none">
                  <ActivityIndicator color={colors.primarySoft} />
                </View>
              ) : null}
            </View>

            <View style={styles.legend}>
              <Legend swatch={<View style={[styles.swatch, styles.studied]} />}>
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
              <Legend swatch={<View style={[styles.swatch, styles.today]} />}>
                {t.legendToday}
              </Legend>
            </View>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function DayCell({ day, label }: { day: CalendarDay; label: string }) {
  const styles = useStyles();
  return (
    <View style={styles.cell} accessible accessibilityLabel={label}>
      <View
        style={[
          styles.dayDot,
          day.studied && styles.studied,
          day.frozen && styles.frozen,
          day.isToday && styles.today,
        ]}
      >
        {day.frozen ? (
          <Snowflake color={colors.info} size={14} />
        ) : (
          <Text
            variant="caption"
            color={day.studied ? 'streak' : day.isToday ? 'textStrong' : 'text'}
            style={[styles.dayText, day.isFuture && styles.future]}
          >
            {day.day}
          </Text>
        )}
      </View>
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
      backgroundColor: 'rgba(7,6,15,0.72)',
    },
    sheetWrap: { width: '100%', maxWidth: 420, alignSelf: 'center' },
    sheet: { gap: spacing.md, borderColor: colors.brandBorder },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceRaised,
    },
    pressed: { opacity: 0.7 },
    hero: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    flameRing: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceRaised,
      borderWidth: 2,
      borderColor: colors.border,
    },
    flameRingActive: { backgroundColor: 'rgba(251,146,60,0.14)', borderColor: colors.streak },
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
    dayDot: {
      width: DOT,
      height: DOT,
      borderRadius: DOT / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayText: { fontWeight: '600', fontVariant: ['tabular-nums'] },
    future: { opacity: 0.4 },
    studied: {
      backgroundColor: 'rgba(251,146,60,0.2)',
      borderWidth: 1.5,
      borderColor: colors.streak,
    },
    frozen: { backgroundColor: 'rgba(56,189,248,0.16)' },
    today: { borderWidth: 2, borderColor: colors.primaryBright },
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
      gap: spacing.lg,
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
