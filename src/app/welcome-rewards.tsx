import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Check, ChevronLeft, Gift, Lock, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { cosmeticById } from '@shared/cosmetics';
import { WELCOME_REWARDS } from '@shared/welcomeRewards';

import {
  Avatar,
  BrandCard,
  Button,
  ErrorState,
  LoadingState,
  PolyCoin,
  Screen,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import {
  useClaimWelcomeReward,
  useWelcomeRewards,
  type WelcomeClaim,
  type WelcomeDay,
} from '@/features/welcomeRewards/api';
import { useStrings } from '@/i18n';
import { welcomeRewardsStrings } from '@/i18n/screens/welcome-rewards';
import { toUserMessage } from '@/lib/errors';
import { playSound } from '@/lib/sounds';

type DayState = 'claimed' | 'today' | 'locked';

/**
 * Recompensa de bienvenida: 7 días, un premio por día. El servidor decide qué día toca y lo
 * entrega (claim_welcome_reward); la pantalla sólo muestra el calendario y el botón.
 */
export default function WelcomeRewardsScreen() {
  const styles = useStyles();
  const t = useStrings(welcomeRewardsStrings);
  const rewards = useWelcomeRewards();
  const claim = useClaimWelcomeReward();

  if (rewards.isPending) return <LoadingState />;
  if (rewards.isError || !rewards.data) {
    return <ErrorState message={t.loadError} onRetry={() => void rewards.refetch()} />;
  }
  const data = rewards.data;

  const stateOf = (d: WelcomeDay): DayState =>
    d.claimed_at ? 'claimed' : data.claimable_today && d.day === data.next_day ? 'today' : 'locked';

  const onClaim = () =>
    claim.mutate(undefined, {
      onSuccess: () => {
        playSound('complete');
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
    });

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
          <ChevronLeft color={colors.textStrong} size={24} />
        </Pressable>
        <Text variant="heading" color="textStrong" accessibilityRole="header" style={styles.title}>
          {t.title}
        </Text>
        <View style={styles.back} />
      </View>

      <BrandCard glow={data.claimable_today} contentStyle={styles.card}>
        <Chest open={claim.isSuccess} />
        <Text variant="bodyStrong" color="textStrong" align="center">
          {t.intro(data.total)}
        </Text>

        <View style={styles.days}>
          {data.days.map((d) => (
            <DayTile key={d.day} day={d} state={stateOf(d)} />
          ))}
        </View>

        {claim.data ? <ClaimResult result={claim.data} /> : null}

        {data.completed && !claim.data ? (
          <Text variant="bodyStrong" color="success" align="center">
            {t.completed}
          </Text>
        ) : data.claimable_today ? (
          <Button
            label={t.claim}
            size="lg"
            icon={<Gift color={colors.onPrimary} size={20} />}
            loading={claim.isPending}
            onPress={onClaim}
          />
        ) : !data.completed ? (
          <Button
            label={t.comeBack}
            size="lg"
            variant="secondary"
            disabled
            icon={<Lock color={colors.textMuted} size={18} />}
          />
        ) : null}
        {claim.isError ? <FormMessage tone="error" message={claimError(claim.error, t)} /> : null}
      </BrandCard>
    </Screen>
  );
}

function claimError(error: unknown, t: { alreadyClaimed: string }): string {
  const message = (error as { message?: string } | null)?.message ?? '';
  if (message.includes('already_claimed') || message.includes('welcome_completed')) {
    return t.alreadyClaimed;
  }
  return toUserMessage(error);
}

function Chest({ open }: { open: boolean }) {
  const styles = useStyles();
  return (
    <View style={styles.hero}>
      <Sparkles color={colors.gold} size={20} style={styles.sparkleLeft} />
      <Sparkles color={colors.gold} size={14} style={styles.sparkleRight} />
      <Sparkles color={colors.gold} size={12} style={styles.sparkleBottom} />
      <Animated.View
        key={open ? 'open' : 'closed'}
        entering={open ? ZoomIn.springify() : undefined}
      >
        <LinearGradient
          colors={[colors.primaryBright, colors.primaryPressed]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.chest}
        >
          <Gift color={colors.gold} size={64} strokeWidth={2.2} />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

function DayTile({ day, state }: { day: WelcomeDay; state: DayState }) {
  const styles = useStyles();
  const t = useStrings(welcomeRewardsStrings);
  const item = day.kind === 'item' ? cosmeticById(day.item) : undefined;
  const label = item ? item.name : t.polys(day.polys);
  const special = day.kind === 'item';
  return (
    <View
      style={[
        styles.day,
        special && styles.daySpecial,
        state === 'claimed' && styles.dayClaimed,
        state === 'today' && styles.dayToday,
      ]}
      accessible
      accessibilityLabel={t.dayA11y(day.day, label, state)}
    >
      <Text
        variant="caption"
        color={state === 'today' ? 'gold' : 'text'}
        style={styles.dayName}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {t.day(day.day)}
      </Text>
      <View style={styles.dayArt}>
        {state === 'claimed' ? (
          <Check color={colors.success} size={26} strokeWidth={3.5} />
        ) : item?.kind === 'skin' ? (
          <Avatar avatarId={item.id} size={34} />
        ) : item?.kind === 'frame' ? (
          <FramedAvatar avatarId="skin-classic" frameId={item.id} size={26} instant />
        ) : (
          <PolyCoin size={24} />
        )}
      </View>
      {day.kind === 'polys' && state !== 'claimed' ? (
        <Text variant="caption" color="textStrong" style={styles.dayValue} numberOfLines={1}>
          {day.polys}
        </Text>
      ) : (
        <View style={styles.dayValueSpacer} />
      )}
    </View>
  );
}

function ClaimResult({ result }: { result: WelcomeClaim }) {
  const styles = useStyles();
  const t = useStrings(welcomeRewardsStrings);
  const item = cosmeticById(result.item);
  return (
    <Animated.View entering={ZoomIn.springify()} style={styles.prize}>
      {item ? <Gift color={colors.gold} size={24} /> : <PolyCoin size={26} />}
      <Text variant="bodyStrong" color="gold" style={styles.shrink}>
        {item
          ? t.got(item.name)
          : WELCOME_REWARDS[result.day - 1]?.kind === 'item'
            ? t.gotRepeated(result.polys)
            : t.got(t.polys(result.polys))}
      </Text>
    </Animated.View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    pressed: { opacity: 0.75 },
    shrink: { flexShrink: 1 },
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    title: { flex: 1, textAlign: 'center' },
    back: {
      width: 44,
      height: 44,
      borderRadius: radii.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: { gap: spacing.lg, alignItems: 'stretch' },
    hero: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
    },
    sparkleLeft: { position: 'absolute', left: '18%', top: spacing.lg },
    sparkleRight: { position: 'absolute', right: '20%', top: spacing.sm },
    sparkleBottom: { position: 'absolute', right: '26%', bottom: spacing.lg },
    chest: {
      width: 132,
      height: 132,
      borderRadius: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: colors.gold,
      shadowColor: colors.gold,
      shadowOpacity: 0.55,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 0 },
      elevation: 10,
    },
    days: { flexDirection: 'row', gap: spacing.xxs },
    day: {
      flex: 1,
      alignItems: 'center',
      gap: spacing.xxs,
      paddingVertical: spacing.sm,
      paddingHorizontal: 2,
      borderRadius: radii.md,
      backgroundColor: colors.inset,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    daySpecial: { backgroundColor: colors.surfaceRaised },
    dayClaimed: { borderColor: colors.success },
    dayToday: { borderWidth: 2, borderColor: colors.gold },
    dayName: { fontSize: 10, lineHeight: 13, fontWeight: '700' },
    dayArt: { height: 36, alignItems: 'center', justifyContent: 'center' },
    dayValue: { fontSize: 11, lineHeight: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
    dayValueSpacer: { height: 14 },
    prize: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
  }),
);
