import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Check, ChevronLeft, Gift, Lock } from 'lucide-react-native';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  ZoomIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { cosmeticById, type CosmeticItem } from '@shared/cosmetics';
import { WELCOME_REWARDS } from '@shared/welcomeRewards';

import {
  Avatar,
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
import { Confetti } from '@/features/battle/components/Confetti';
import { FramedAvatar } from '@/features/cosmetics/FramedAvatar';
import {
  useClaimWelcomeReward,
  useWelcomeRewards,
  type WelcomeClaim,
  type WelcomeDay,
} from '@/features/welcomeRewards/api';
import { LEGEND, LegendaryChest } from '@/features/welcomeRewards/LegendaryChest';
import { useStrings } from '@/i18n';
import { welcomeRewardsStrings } from '@/i18n/screens/welcome-rewards';
import { toUserMessage } from '@/lib/errors';
import { playSound } from '@/lib/sounds';

type DayState = 'claimed' | 'today' | 'locked';

/** Lo que muestra cada día: lo entregado de verdad si ya se cobró, si no lo configurado. */
interface ShownReward {
  item?: CosmeticItem;
  polys: number;
}

function shownReward(d: WelcomeDay): ShownReward {
  if (d.claimed_at && (d.granted_item || d.granted_polys != null)) {
    return { item: cosmeticById(d.granted_item), polys: d.granted_polys ?? d.polys };
  }
  return { item: d.kind === 'item' ? cosmeticById(d.item) : undefined, polys: d.polys };
}

/** Tiempo para ver la celebración antes de volver a Aprender. */
const CLOSE_AFTER_CLAIM_MS = 2200;

/** Ancho útil del contenido (Screen usa una columna de 680 en la web y padding xl). */
const contentWidth = (window: number) => Math.min(window, 680) - spacing.xl * 2;

/**
 * Recompensa de bienvenida: 7 días, un premio por día. El servidor decide qué día toca y lo
 * entrega (claim_welcome_reward); la pantalla sólo muestra el cofre, el calendario y el botón.
 */
export default function WelcomeRewardsScreen() {
  const styles = useStyles();
  const t = useStrings(welcomeRewardsStrings);
  const rewards = useWelcomeRewards();
  const claim = useClaimWelcomeReward();
  const { width, height } = useWindowDimensions();

  // Tras un cobro exitoso: se ve la celebración (cofre, confeti, premio) y la pantalla se cierra
  // sola, dejándote en Aprender. Si salís antes, el temporizador se cancela.
  useEffect(() => {
    if (!claim.isSuccess) return;
    const id = setTimeout(() => router.dismissTo('/'), CLOSE_AFTER_CLAIM_MS);
    return () => clearTimeout(id);
  }, [claim.isSuccess]);

  if (rewards.isPending) return <LoadingState />;
  if (rewards.isError || !rewards.data) {
    return <ErrorState message={t.loadError} onRetry={() => void rewards.refetch()} />;
  }
  const data = rewards.data;

  const stateOf = (d: WelcomeDay): DayState =>
    d.claimed_at ? 'claimed' : data.claimable_today && d.day === data.next_day ? 'today' : 'locked';

  const onClaim = () => {
    if (claim.isPending) return;
    claim.mutate(undefined, {
      onSuccess: () => {
        playSound('complete');
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
    });
  };

  const inner = contentWidth(width);
  // Todo tiene que entrar sin scroll en un teléfono común (≈844 pt): el cofre se ajusta al alto.
  const chestSize = Math.round(Math.min(Math.max(height * 0.12, 80), 130, inner * 0.4));
  const regular = data.days.filter((d) => d.day < data.total);
  const finale = data.days.find((d) => d.day === data.total);
  const rows = [regular.slice(0, 3), regular.slice(3, 6)];

  const header = (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.back}
        hitSlop={8}
        // Se abre sola desde Inicio: si no quedó historial (recarga, enlace), vuelve a Inicio.
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <ChevronLeft color={colors.textStrong} size={24} />
      </Pressable>
      <Text variant="heading" color="textStrong" accessibilityRole="header" style={styles.title}>
        {t.title}
      </Text>
      <View style={styles.back} />
    </View>
  );

  const footer = (
    <>
      {claim.data ? <ClaimResult result={claim.data} /> : null}
      {data.completed && !claim.data ? (
        <View style={styles.completedRow}>
          <Check color={colors.success} size={20} strokeWidth={3} />
          <Text variant="bodyStrong" color="success" align="center" style={styles.shrink}>
            {t.completed}
          </Text>
        </View>
      ) : data.claimable_today ? (
        <ClaimButton
          label={t.claim}
          hint={t.claimHint}
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
    </>
  );

  return (
    <Screen
      edges={['top', 'bottom']}
      header={header}
      footer={footer}
      contentStyle={styles.content}
      overlay={claim.isSuccess ? <Confetti /> : null}
    >
      {/* A. El cofre: lo primero que se ve. */}
      <LinearGradient
        colors={['#2C1170', '#1B0B4A', '#120833']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.hero}
        accessible
        accessibilityLabel={`${t.chestA11y}. ${t.heroTitle} ${t.heroSubtitle(data.total)}`}
      >
        <LegendaryChest
          size={chestSize}
          open={claim.isSuccess || data.completed}
          celebrate={claim.isSuccess}
        />
        <View style={styles.heroText}>
          <Text
            variant="heading"
            align="center"
            style={[styles.onDark, styles.heroTitle]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {data.completed ? t.completed : t.heroTitle}
          </Text>
          <Text variant="caption" align="center" style={styles.onDarkMuted} numberOfLines={2}>
            {t.heroSubtitle(data.total)}
          </Text>
        </View>
      </LinearGradient>

      {/* B. Calendario: 3 + 3 y el día 7 centrado, más grande. */}
      <View style={styles.calendar}>
        <View style={styles.calendarHead}>
          <Text variant="overline" color="textMuted">
            {t.calendarTitle.toUpperCase()}
          </Text>
          <View style={styles.progressPill}>
            <Text variant="caption" color="gold" style={styles.progressText}>
              {t.progress(data.claimed, data.total)}
            </Text>
          </View>
        </View>
        {rows.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((d) => (
              <DayTile key={d.day} day={d} state={stateOf(d)} onClaim={onClaim} />
            ))}
          </View>
        ))}
        {finale ? (
          <FinaleCard
            day={finale}
            state={stateOf(finale)}
            width={Math.min(inner * 0.9, 360)}
            onClaim={onClaim}
          />
        ) : null}
      </View>
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

/** Arte de la recompensa: skin, marco o moneda (lo que corresponda de verdad). */
function RewardArt({ reward, size }: { reward: ShownReward; size: number }) {
  const { item } = reward;
  if (item?.kind === 'skin') return <Avatar avatarId={item.id} size={size} />;
  if (item?.kind === 'frame') {
    return <FramedAvatar avatarId="skin-classic" frameId={item.id} size={size * 0.78} instant />;
  }
  return <PolyCoin size={size * 0.82} />;
}

function rewardLabel(reward: ShownReward, polys: (n: number) => string) {
  return reward.item ? reward.item.name : polys(reward.polys);
}

function DayTile({
  day,
  state,
  onClaim,
}: {
  day: WelcomeDay;
  state: DayState;
  onClaim: () => void;
}) {
  const styles = useStyles();
  const t = useStrings(welcomeRewardsStrings);
  const reward = shownReward(day);
  const label = rewardLabel(reward, t.polys);
  const today = state === 'today';
  const claimed = state === 'claimed';

  const body = (
    <>
      <Text
        variant="overline"
        color="textMuted"
        style={[styles.dayName, today ? styles.onDarkGold : claimed ? styles.dayNameClaimed : null]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {t.day(day.day).toUpperCase()}
      </Text>
      <View style={[styles.dayArt, state === 'locked' && styles.dim]}>
        <RewardArt reward={reward} size={36} />
      </View>
      <Text
        variant="caption"
        color={claimed ? 'success' : 'text'}
        style={[styles.dayValue, today && styles.onDark]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label}
      </Text>
      {claimed ? (
        <View style={[styles.badge, styles.badgeClaimed]}>
          <Check color="#FFFFFF" size={11} strokeWidth={4} />
        </View>
      ) : state === 'locked' ? (
        <View style={[styles.badge, styles.badgeLocked]}>
          <Lock color={colors.textMuted} size={10} strokeWidth={3} />
        </View>
      ) : null}
    </>
  );

  return (
    <View style={styles.dayCell}>
      {today ? <PulseRing radius={radii.lg} /> : null}
      <Pressable
        disabled={!today}
        onPress={onClaim}
        accessibilityRole={today ? 'button' : undefined}
        accessibilityHint={today ? t.claimHint : undefined}
        accessibilityLabel={t.dayA11y(day.day, label, state)}
        style={({ pressed }) => [
          styles.dayShell,
          today && styles.dayShellToday,
          pressed && styles.dayPressed,
        ]}
      >
        {today ? (
          <LinearGradient
            colors={['#6A2BFF', '#4314B8', '#2A0C78']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.day, styles.dayToday]}
          >
            {body}
          </LinearGradient>
        ) : (
          <View style={[styles.day, claimed ? styles.dayClaimed : styles.dayLocked]}>{body}</View>
        )}
      </Pressable>
      {today ? (
        <View style={styles.todayTag} pointerEvents="none">
          <Text style={styles.todayTagText}>{t.todayTag}</Text>
        </View>
      ) : null}
    </View>
  );
}

/** Día 7: la gran recompensa, centrada y más grande. Especial aun bloqueada. */
function FinaleCard({
  day,
  state,
  width,
  onClaim,
}: {
  day: WelcomeDay;
  state: DayState;
  width: number;
  onClaim: () => void;
}) {
  const styles = useStyles();
  const t = useStrings(welcomeRewardsStrings);
  const reward = shownReward(day);
  const label = rewardLabel(reward, t.polys);
  const today = state === 'today';
  const claimed = state === 'claimed';
  const locked = state === 'locked';

  return (
    <View style={[styles.finaleCell, { width }]}>
      <Pressable
        disabled={!today}
        onPress={onClaim}
        accessibilityRole={today ? 'button' : undefined}
        accessibilityHint={today ? t.claimHint : undefined}
        accessibilityLabel={`${t.legendTag}. ${t.dayA11y(day.day, label, state)}`}
        style={({ pressed }) => [
          styles.finaleShell,
          today && styles.finaleShellToday,
          pressed && styles.dayPressed,
        ]}
      >
        <LinearGradient
          colors={['#7B2EFF', '#4A15B8', '#22094F']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[styles.finale, locked && styles.finaleLocked, claimed && styles.finaleClaimed]}
        >
          <Sheen />
          <View style={styles.finaleArt}>
            <View style={styles.finaleHalo} />
            <View style={locked ? styles.finaleArtLocked : null}>
              <RewardArt reward={reward} size={76} />
            </View>
          </View>
          <View style={styles.finaleInfo}>
            <Text variant="overline" style={styles.onDarkGold}>
              {t.day(day.day).toUpperCase()}
            </Text>
            <Text variant="heading" style={styles.onDark} numberOfLines={1} adjustsFontSizeToFit>
              {label}
            </Text>
            <View style={styles.finaleStatus}>
              {claimed ? (
                <>
                  <Check color={colors.success} size={16} strokeWidth={3.5} />
                  <Text variant="caption" color="success" style={styles.bold}>
                    {t.claimedTag}
                  </Text>
                </>
              ) : today ? (
                <Text variant="caption" style={[styles.onDarkGold, styles.bold]}>
                  {t.legendToday}
                </Text>
              ) : (
                <>
                  <Lock color={LEGEND.gold} size={13} strokeWidth={3} />
                  <Text variant="caption" style={styles.onDarkMuted}>
                    {t.legendLocked(day.day - 1)}
                  </Text>
                </>
              )}
            </View>
          </View>
        </LinearGradient>
      </Pressable>
      <LinearGradient
        colors={[LEGEND.goldLight, LEGEND.gold, LEGEND.goldDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.legendTag}
        pointerEvents="none"
      >
        <Text style={styles.legendTagText} numberOfLines={1}>
          {t.legendTag}
        </Text>
      </LinearGradient>
    </View>
  );
}

/** Reflejo que cruza la tarjeta del día 7 cada pocos segundos. */
function Sheen() {
  const styles = useStyles();
  const reduceMotion = useReducedMotion();
  const x = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) return;
    x.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(2600, withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) })),
      ),
      -1,
      false,
    );
  }, [reduceMotion, x]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: -160 + 520 * x.value }, { rotate: '20deg' }],
  }));
  if (reduceMotion) return null;
  return (
    <Animated.View style={[styles.sheen, style]} pointerEvents="none">
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,241,184,0.22)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

/** Anillo que late alrededor del día disponible. */
function PulseRing({ radius }: { radius: number }) {
  const styles = useStyles();
  const reduceMotion = useReducedMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    if (!reduceMotion) t.value = withRepeat(withTiming(1, { duration: 1600 }), -1, false);
  }, [reduceMotion, t]);
  const style = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0 : 0.7 * (1 - t.value),
    transform: [{ scale: 1 + 0.1 * t.value }],
  }));
  return (
    <Animated.View pointerEvents="none" style={[styles.pulse, { borderRadius: radius }, style]} />
  );
}

/** Botón principal: ancho, degradé violeta intenso y sombra violeta. */
function ClaimButton({
  label,
  hint,
  loading,
  onPress,
}: {
  label: string;
  hint: string;
  loading: boolean;
  onPress: () => void;
}) {
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ busy: loading, disabled: loading }}
      disabled={loading}
      onPress={() => {
        if (Platform.OS !== 'web') void Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [styles.claimShell, pressed && styles.claimPressed]}
    >
      <LinearGradient
        colors={[LEGEND.violetBright, LEGEND.violet, '#5A16D6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.claim}
      >
        <View style={styles.claimShine} pointerEvents="none" />
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Gift color="#FFFFFF" size={22} strokeWidth={2.4} />
            <Text style={styles.claimText} numberOfLines={1} adjustsFontSizeToFit>
              {label.toUpperCase()}
            </Text>
          </>
        )}
      </LinearGradient>
    </Pressable>
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
    bold: { fontWeight: '700' },
    dim: { opacity: 0.4 },
    // Texto sobre superficies violetas fijas (iguales en ambos temas).
    onDark: { color: '#FFFFFF' },
    onDarkMuted: { color: '#D9CCFF' },
    onDarkGold: { color: LEGEND.gold },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xs,
    },
    title: { flex: 1, textAlign: 'center' },
    back: {
      width: 44,
      height: 44,
      borderRadius: radii.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: { gap: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.md },

    hero: {
      borderRadius: radii.xl,
      borderWidth: 1,
      borderColor: 'rgba(184, 77, 255, 0.5)',
      alignItems: 'center',
      paddingTop: spacing.xxs,
      paddingBottom: spacing.md,
      paddingHorizontal: spacing.lg,
      overflow: 'hidden',
    },
    heroText: { gap: 2, marginTop: -spacing.xs, alignItems: 'center', alignSelf: 'stretch' },
    heroTitle: { fontSize: 20, lineHeight: 26, fontWeight: '800' },

    calendar: { gap: spacing.sm },
    calendarHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xxs,
    },
    progressPill: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      borderRadius: radii.pill,
      backgroundColor: 'rgba(255, 213, 74, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255, 213, 74, 0.4)',
    },
    progressText: { fontWeight: '800', fontVariant: ['tabular-nums'] },
    row: { flexDirection: 'row', gap: spacing.sm, paddingTop: spacing.sm },

    dayCell: { flex: 1 },
    dayShell: { borderRadius: radii.lg },
    dayShellToday: {
      shadowColor: LEGEND.violetBright,
      shadowOpacity: 0.7,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 0 },
      elevation: 10,
      backgroundColor: '#4314B8',
    },
    dayPressed: { transform: [{ scale: 0.96 }] },
    day: {
      minHeight: 94,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: spacing.sm + 2,
      paddingBottom: spacing.sm,
      paddingHorizontal: spacing.xs,
      borderRadius: radii.lg,
      borderWidth: 1.5,
    },
    dayToday: { borderWidth: 2, borderColor: LEGEND.gold },
    dayClaimed: { backgroundColor: colors.surfaceRaised, borderColor: colors.success },
    dayLocked: { backgroundColor: colors.surface, borderColor: colors.border },
    dayName: { fontSize: 11, lineHeight: 14 },
    dayNameClaimed: { color: colors.success },
    dayArt: { height: 40, alignItems: 'center', justifyContent: 'center' },
    dayValue: { fontWeight: '800', fontSize: 13, fontVariant: ['tabular-nums'] },
    badge: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeClaimed: { backgroundColor: colors.successStrong },
    badgeLocked: { backgroundColor: colors.surfaceHighlight },
    pulse: { ...StyleSheet.absoluteFill, borderWidth: 2, borderColor: LEGEND.gold },
    todayTag: {
      position: 'absolute',
      top: -9,
      alignSelf: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: 1,
      borderRadius: radii.pill,
      backgroundColor: LEGEND.gold,
    },
    todayTagText: {
      fontSize: 10,
      lineHeight: 15,
      fontWeight: '900',
      color: LEGEND.night,
      letterSpacing: 1,
    },

    finaleCell: { alignSelf: 'center', marginTop: spacing.md },
    finaleShell: {
      borderRadius: radii.xl,
      backgroundColor: '#22094F',
      shadowColor: LEGEND.gold,
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 0 },
      elevation: 10,
    },
    finaleShellToday: { shadowOpacity: 0.7, shadowRadius: 24 },
    // Día 7 en horizontal: premio grande a la izquierda, datos a la derecha (cabe sin scroll).
    finale: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.xl,
      borderWidth: 2.5,
      borderColor: LEGEND.gold,
      overflow: 'hidden',
    },
    finaleLocked: { borderColor: 'rgba(255, 213, 74, 0.6)' },
    finaleClaimed: { borderColor: colors.success },
    finaleArt: { width: 84, height: 84, alignItems: 'center', justifyContent: 'center' },
    finaleInfo: { flex: 1, gap: 2 },
    finaleHalo: {
      position: 'absolute',
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: 'rgba(184, 77, 255, 0.35)',
      shadowColor: LEGEND.violetBright,
      shadowOpacity: 0.9,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 0 },
    },
    finaleArtLocked: { opacity: 0.6 },
    finaleStatus: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    sheen: { position: 'absolute', top: -60, bottom: -60, left: 0, width: 90 },
    legendTag: {
      position: 'absolute',
      top: -12,
      alignSelf: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: 3,
      borderRadius: radii.pill,
      borderWidth: 1,
      borderColor: '#8A5A0C',
    },
    legendTagText: {
      fontSize: 11,
      lineHeight: 15,
      fontWeight: '900',
      letterSpacing: 1.2,
      color: '#3A2200',
    },

    claimShell: {
      borderRadius: radii.lg,
      backgroundColor: LEGEND.violet,
      shadowColor: LEGEND.violet,
      shadowOpacity: 0.65,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 10,
    },
    claimPressed: { transform: [{ scale: 0.98 }], opacity: 0.92 },
    claim: {
      minHeight: 60,
      borderRadius: radii.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.xl,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.22)',
      overflow: 'hidden',
    },
    claimShine: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '48%',
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    claimText: {
      color: '#FFFFFF',
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '900',
      letterSpacing: 1.2,
      flexShrink: 1,
    },
    completedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    prize: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
  }),
);
