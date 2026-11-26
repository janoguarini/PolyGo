import * as Haptics from 'expo-haptics';
import { Bell, Check, Flame, Snowflake, Target } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';

import { isStreakShareMilestone, type ShareAchievement } from '@shared/share';

import { Button, Card, Screen, Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { useMyProfile } from '@/features/profile/hooks';
import { useReminderPrefs, useSetReminderPrefs } from '@/features/reminders/hooks';
import { ShareAchievementModal, canShareImages } from '@/features/share/ShareAchievement';
import { shareStrings } from '@/features/share/strings';
import { remindersSupported } from '@/features/reminders/notifications';
import { DEFAULT_REMINDER, formatReminderTime } from '@/features/reminders/schedule';
import { useStrings } from '@/i18n';

import { useLearningSummary } from '../hooks';
import { daysLabel, streakWeek, type Celebration } from '../streak';
import { streakStrings } from '../strings';

type Strings = (typeof streakStrings)['es'];

function headline(c: Celebration, t: Strings) {
  if (!c.streakExtended) return t.goalMet;
  if (c.streakDays <= 1) return t.streakStarted;
  return t.inARow(daysLabel(c.streakDays));
}

function subtitle(c: Celebration, t: Strings) {
  if (!c.streakExtended) return t.goalToday(c.goalMinutes);
  if (c.streakDays <= 1) return t.comeBackSecond;
  return t.comeBack;
}

/** Festejo de la primera sesión del día (racha) y/o de cumplir el objetivo diario. */
export function DailyCelebration({
  celebration,
  onContinue,
}: {
  celebration: Celebration;
  onContinue: () => void;
}) {
  const styles = useStyles();
  const t = useStrings(streakStrings);
  const summary = useLearningSummary();
  const week = streakWeek(
    celebration.streakDays,
    true,
    new Date(),
    summary.data?.frozen_dates ?? [],
  );
  const reminder = useReminderPrefs();
  const setReminder = useSetReminderPrefs();
  const offerReminder =
    remindersSupported && celebration.streakExtended && reminder.data?.enabled === false;

  useEffect(() => {
    if (Platform.OS !== 'web') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  // Hito de racha (7, 14, 30, 50, 100…): se festeja aparte y se puede compartir como tarjeta.
  const ts = useStrings(shareStrings);
  const language = useMyProfile().data?.profile.target_language;
  const milestone = celebration.streakExtended && isStreakShareMilestone(celebration.streakDays);
  const [sharing, setSharing] = useState<ShareAchievement | null>(null);
  const offerShare = milestone && canShareImages && Boolean(language);

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        offerShare && language ? (
          <View style={styles.footer}>
            <Button
              label={ts.shareAchievement}
              size="lg"
              onPress={() => setSharing({ kind: 'streak', days: celebration.streakDays, language })}
            />
            <Button label={t.continue} variant="ghost" onPress={onContinue} />
          </View>
        ) : (
          <Button label={t.continue} size="lg" onPress={onContinue} />
        )
      }
    >
      <ShareAchievementModal achievement={sharing} onClose={() => setSharing(null)} />
      <Animated.View entering={FadeInUp.duration(450)} style={styles.hero}>
        {celebration.streakExtended ? (
          <View
            style={styles.flame}
            accessible
            accessibilityLabel={t.streakLabel(daysLabel(celebration.streakDays))}
          >
            <Animated.View entering={ZoomIn.delay(150).springify().damping(8)}>
              <Flame color={colors.streak} fill={colors.streak} size={96} />
            </Animated.View>
            <Text variant="display" color="streak">
              {celebration.streakDays}
            </Text>
          </View>
        ) : (
          <Target color={colors.success} size={96} />
        )}
        <Text variant="title" align="center">
          {milestone ? ts.streakMilestone(celebration.streakDays) : headline(celebration, t)}
        </Text>
        <Text color="textMuted" align="center">
          {subtitle(celebration, t)}
        </Text>
      </Animated.View>

      {celebration.streakExtended ? (
        <Animated.View entering={FadeIn.delay(250).duration(400)}>
          <Card style={styles.week} accessibilityLabel={t.yourWeek}>
            {week.map((d, i) => (
              <View key={i} style={styles.day}>
                <Text variant="caption" color={d.isToday ? 'streak' : 'textMuted'}>
                  {d.label}
                </Text>
                <View
                  style={[styles.dot, d.active && styles.dotActive, d.frozen && styles.dotFrozen]}
                >
                  {d.active ? (
                    <Check color={colors.backgroundDeep} size={16} strokeWidth={3} />
                  ) : d.frozen ? (
                    <Snowflake color={colors.backgroundDeep} size={16} strokeWidth={3} />
                  ) : null}
                </View>
              </View>
            ))}
          </Card>
        </Animated.View>
      ) : null}

      {celebration.goalMet && celebration.streakExtended ? (
        <Card style={styles.goal}>
          <Target color={colors.success} size={22} />
          <Text variant="bodyStrong" style={styles.flex}>
            {t.alsoGoal(celebration.goalMinutes)}
          </Text>
        </Card>
      ) : null}

      {offerReminder ? (
        <Card style={styles.reminder}>
          <Text variant="bodyStrong">{t.remindTitle}</Text>
          <Text variant="caption">{t.remindBody(formatReminderTime(DEFAULT_REMINDER))}</Text>
          <Button
            label={t.enableReminder}
            variant="secondary"
            loading={setReminder.isPending}
            icon={<Bell color={colors.text} size={18} />}
            onPress={() => setReminder.mutate({ ...DEFAULT_REMINDER, enabled: true })}
          />
          {setReminder.data && setReminder.data !== 'granted' ? (
            <Text variant="caption" color="danger">
              {t.noPermission}
            </Text>
          ) : null}
        </Card>
      ) : null}
      {remindersSupported && setReminder.data === 'granted' ? (
        <Text variant="caption" align="center" color="success">
          {t.reminderSet(formatReminderTime(DEFAULT_REMINDER))}
        </Text>
      ) : null}
    </Screen>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    hero: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.huge },
    footer: { gap: spacing.xs },
    flame: { alignItems: 'center' },
    week: { flexDirection: 'row', justifyContent: 'space-between' },
    day: { alignItems: 'center', gap: spacing.xs },
    dot: {
      width: 30,
      height: 30,
      borderRadius: radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceHighlight,
    },
    dotActive: { backgroundColor: colors.streak },
    dotFrozen: { backgroundColor: colors.info },
    goal: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    flex: { flex: 1 },
    reminder: { gap: spacing.sm },
  }),
);
