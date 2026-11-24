import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Gift, Sparkles } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { POLYS } from '@shared/polys';

import {
  BrandCard,
  Button,
  PolyCoin,
  ProgressBar,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { useStrings } from '@/i18n';
import { toUserMessage } from '@/lib/errors';
import { playSound } from '@/lib/sounds';

import { useClaimMissionReward, type DailyMissions } from './api';
import { dailyRewardStrings } from './strings';
import { useWeekChests } from './weekChests';

/**
 * Recompensa diaria: el cofre del día (se abre una vez por día al completar las misiones) y la
 * semana con los cofres que ya abriste. Todo sale del servidor: los días abiertos y lo que dio cada
 * cofre se leen del registro de Polys, y abrir el cofre es claim_mission_reward (que rechaza un
 * segundo intento). Abrirlo `POLYS.weekly.days` días de la misma semana suma el bonus semanal.
 */
export function DailyRewardCard({ missions }: { missions: DailyMissions }) {
  const styles = useStyles();
  const t = useStrings(dailyRewardStrings);
  const claim = useClaimMissionReward();
  const week = useWeekChests(missions.date);
  const doneCount = missions.missions.filter((m) => m.done).length;
  const total = missions.missions.length;
  const opened = week.data?.days.filter((d) => d.polys !== null).length ?? 0;

  const onClaim = () =>
    claim.mutate(undefined, {
      onSuccess: () => {
        playSound('complete');
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
    });

  return (
    <BrandCard glow={missions.all_done && !missions.claimed} contentStyle={styles.card}>
      <View style={styles.hero}>
        <Sparkles color={colors.gold} size={18} style={styles.sparkleLeft} />
        <Sparkles color={colors.gold} size={14} style={styles.sparkleRight} />
        <Animated.View
          key={missions.claimed ? 'open' : 'closed'}
          entering={missions.claimed ? ZoomIn.springify() : undefined}
        >
          <LinearGradient
            colors={[colors.gold, colors.goldStrong]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.chest}
          >
            <Gift color={colors.brandSolid} size={56} strokeWidth={2.2} />
          </LinearGradient>
        </Animated.View>
      </View>
      <Text variant="bodyStrong" color="textStrong" align="center">
        {t.intro(total, POLYS.weekly.days, POLYS.weekly.bonus)}
      </Text>

      <View style={styles.days} accessibilityLabel={t.weekA11y(opened)}>
        {(week.data?.days ?? []).map((day, i) => {
          const today = day.date === missions.date;
          const past = day.date < missions.date;
          const open = day.polys !== null;
          return (
            <View
              key={day.date}
              style={[styles.day, open && styles.dayOpen, today && styles.dayToday]}
              accessible
              accessibilityLabel={t.dayA11y(t.days[i]!, today, open, day.polys, past)}
            >
              <Text variant="caption" color={today ? 'gold' : 'text'} style={styles.dayName}>
                {t.days[i]}
              </Text>
              {open ? (
                <View style={styles.check}>
                  <Check color={colors.onPrimary} size={14} strokeWidth={3} />
                </View>
              ) : (
                <View style={past ? styles.dim : undefined}>
                  <PolyCoin size={20} />
                </View>
              )}
              <Text
                variant="caption"
                color={open ? 'success' : past ? 'textSubtle' : 'textStrong'}
                style={styles.dayValue}
                numberOfLines={1}
              >
                {open ? `+${day.polys}` : past ? '–' : `${POLYS.chest.min}-${POLYS.chest.max}`}
              </Text>
            </View>
          );
        })}
      </View>
      {week.isError ? (
        <Text variant="caption" align="center">
          {t.weekError}
        </Text>
      ) : null}

      <View style={styles.weekly}>
        <Text variant="caption" color="text" style={styles.flex}>
          {week.data?.weeklyBonus
            ? t.weeklyClaimed(week.data.weeklyBonus)
            : t.weeklyProgress(Math.min(opened, POLYS.weekly.days), POLYS.weekly.days)}
        </Text>
        <View style={styles.weeklyBar}>
          <ProgressBar
            value={week.data?.weeklyBonus ? 1 : Math.min(1, opened / POLYS.weekly.days)}
            colors={[colors.gold, colors.goldStrong]}
            accessibilityLabel={t.weeklyA11y}
          />
        </View>
      </View>

      {missions.claimed ? (
        claim.data ? (
          <Animated.View entering={ZoomIn.springify()} style={styles.prize}>
            <PolyCoin size={28} />
            <Text variant="title" color="gold">
              +{claim.data.polys + claim.data.weekly_bonus}
            </Text>
            <Text variant="bodyStrong" color="text" style={styles.shrink}>
              {claim.data.jackpot
                ? t.jackpot
                : claim.data.weekly_bonus > 0
                  ? t.includesWeekly(claim.data.weekly_bonus)
                  : t.opened}
            </Text>
          </Animated.View>
        ) : (
          <Text variant="bodyStrong" color="success" align="center">
            {t.alreadyOpened}
          </Text>
        )
      ) : (
        <Button
          label={missions.all_done ? t.claim : t.completeMissions(doneCount, total)}
          size="lg"
          icon={<Gift color={colors.onPrimary} size={20} />}
          disabled={!missions.all_done}
          loading={claim.isPending}
          onPress={onClaim}
        />
      )}
      {claim.isError ? <FormMessage tone="error" message={toUserMessage(claim.error)} /> : null}
    </BrandCard>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    flex: { flex: 1 },
    shrink: { flexShrink: 1 },
    card: { gap: spacing.lg, alignItems: 'stretch' },
    hero: { alignItems: 'center', justifyContent: 'center', paddingTop: spacing.sm },
    sparkleLeft: { position: 'absolute', left: '22%', top: spacing.lg },
    sparkleRight: { position: 'absolute', right: '24%', top: spacing.xs },
    chest: {
      width: 104,
      height: 104,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: colors.primaryBright,
      shadowColor: colors.gold,
      shadowOpacity: 0.6,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 0 },
      elevation: 8,
    },
    days: { flexDirection: 'row', gap: spacing.xs },
    day: {
      flex: 1,
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      borderRadius: radii.md,
      backgroundColor: colors.inset,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    dayOpen: { borderColor: colors.success },
    dayToday: { borderWidth: 2, borderColor: colors.gold },
    dayName: { fontSize: 11, lineHeight: 14, fontWeight: '700' },
    dayValue: { fontSize: 11, lineHeight: 14, fontVariant: ['tabular-nums'] },
    dim: { opacity: 0.35 },
    check: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.successStrong,
    },
    weekly: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    weeklyBar: { width: 96 },
    prize: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
  }),
);
