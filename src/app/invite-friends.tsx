import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Check,
  ChevronLeft,
  Clock,
  Copy,
  Crown,
  Gift,
  Infinity as InfinityIcon,
  Lock,
  Search,
  Send,
  Shirt,
  Zap,
} from 'lucide-react-native';
import { useEffect, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Image,
  Pressable,
  Share,
  StyleSheet,
  View,
} from 'react-native';

import { cosmeticById } from '@shared/cosmetics';
import { REFERRAL_GOAL, inviteLink, nextMilestone, parseInviteCode } from '@shared/referrals';

import {
  BrandCard,
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  PolyCoin,
  ProgressBar,
  Screen,
  Text,
  TextField,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import {
  referralErrorMessage,
  useClaimReferral,
  useMyReferral,
  useReferralStatus,
  type ReferralInvite,
  type ReferralMilestoneState,
} from '@/features/referrals/api';
import { referralStrings } from '@/features/referrals/strings';
import { useStrings } from '@/i18n';
import { inviteFriendsStrings } from '@/i18n/screens/invite-friends';
import { playSound } from '@/lib/sounds';

const HERO = require('../../assets/profile/referrals/invite-hero.webp') as number;
/** Ancho / alto de assets/profile/referrals/invite-hero.webp. */
const HERO_ASPECT = 840 / 615;

/**
 * Invitá amigos y desbloqueá recompensas. Todo lo que se ve (código, amigos válidos, premios) lo
 * calcula el servidor; la pantalla sólo lo muestra. Compartir usa el menú nativo del sistema (que
 * también ofrece Copiar).
 */
export default function InviteScreen() {
  const s = useStrings(inviteFriendsStrings);
  const r = useStrings(referralStrings);
  const status = useReferralStatus();
  if (status.isPending) return <LoadingState />;
  if (status.isError) {
    return <ErrorState message={s.loadError} onRetry={() => void status.refetch()} />;
  }
  if (!status.data) {
    return (
      <Screen edges={['top', 'bottom']}>
        <BackButton />
        <EmptyState
          icon={<Gift color={colors.textMuted} size={36} />}
          title={s.soonTitle}
          message={s.soonMessage}
        />
      </Screen>
    );
  }
  const data = status.data;
  const share = () =>
    void Share.share({ message: `${r.shareMessage}\n${inviteLink(data.code)}` }).catch(() => {});
  // El sistema muestra Copiar junto a las apps para compartir.
  const shareCode = () => void Share.share({ message: data.code }).catch(() => {});
  const next = nextMilestone(data.qualified);
  return (
    <Screen
      edges={['top', 'bottom']}
      onRefresh={() => void status.refetch()}
      refreshing={status.isRefetching}
    >
      <BackButton />
      <Hero />
      <Progress qualified={data.qualified} pending={data.pending} />
      {data.milestones.map((m) => (
        <MilestoneCard
          key={m.at}
          milestone={m}
          qualified={data.qualified}
          isNext={next?.at === m.at}
          celebrate={data.just_granted.some((g) => g.milestone === m.at)}
        />
      ))}
      <Button
        label={s.inviteFriends}
        size="lg"
        icon={<Send color={colors.onPrimary} size={22} />}
        onPress={share}
        accessibilityHint={s.inviteHint}
      />
      <CodePill code={data.code} onPress={shareCode} />
      <SearchLink />
      <ClaimCodeCard />
      <Text variant="overline" color="textStrong">
        {s.yourInvites}
      </Text>
      {data.invites.length === 0 ? (
        <Text variant="caption">{s.invitesEmpty}</Text>
      ) : (
        data.invites.map((invite, i) => <InviteRow key={i} invite={invite} />)
      )}
    </Screen>
  );
}

function BackButton() {
  const styles = useStyles();
  const s = useStrings(inviteFriendsStrings);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={s.back}
      hitSlop={8}
      onPress={() => router.back()}
      style={({ pressed }) => [styles.back, pressed && styles.pressed]}
    >
      <ChevronLeft color={colors.textStrong} size={24} />
    </Pressable>
  );
}

function Hero() {
  const styles = useStyles();
  const s = useStrings(inviteFriendsStrings);
  return (
    <View style={styles.hero}>
      <View style={styles.heroText}>
        <Text variant="display" color="textStrong" style={styles.heroTitle}>
          {s.heroTitle}
        </Text>
        <Text variant="display" color="primarySoft" style={styles.heroTitle}>
          {s.heroTitle2}
        </Text>
        <Text color="text">{s.heroBody}</Text>
      </View>
      <Image
        source={HERO}
        style={styles.heroArt}
        resizeMode="contain"
        fadeDuration={0}
        accessible={false}
      />
    </View>
  );
}

function Progress({ qualified, pending }: { qualified: number; pending: number }) {
  const styles = useStyles();
  const s = useStrings(inviteFriendsStrings);
  const next = nextMilestone(qualified);
  const missing = next ? next.at - qualified : 0;
  return (
    <BrandCard>
      <View style={styles.progressTop}>
        <Text variant="heading" color="textStrong" style={styles.flex}>
          {s.yourProgress}
        </Text>
        <Text variant="title" color="primarySoft" style={styles.tabular}>
          {qualified}
        </Text>
        <Text variant="heading" color="textStrong">
          {s.goalFriends(REFERRAL_GOAL)}
        </Text>
      </View>
      <View>
        <ProgressBar
          value={Math.min(1, qualified / REFERRAL_GOAL)}
          height={14}
          accessibilityLabel={s.progressA11y(qualified, REFERRAL_GOAL)}
        />
        <View style={styles.marks} pointerEvents="none">
          {[3, 5].map((at) => (
            <View
              key={at}
              style={[
                styles.mark,
                { left: `${(at / REFERRAL_GOAL) * 100}%` },
                qualified >= at && styles.markDone,
              ]}
            />
          ))}
        </View>
      </View>
      <Text color="text">
        {next ? s.missingForNext(missing) : s.allUnlocked}
        {pending > 0 ? s.pendingValidation(pending) : ''}
      </Text>
    </BrandCard>
  );
}

function MilestoneCard({
  milestone,
  qualified,
  isNext,
  celebrate,
}: {
  milestone: ReferralMilestoneState;
  qualified: number;
  isNext: boolean;
  celebrate: boolean;
}) {
  const styles = useStyles();
  const s = useStrings(inviteFriendsStrings);
  const r = useStrings(referralStrings);
  const unlocked = milestone.granted_at !== null;
  const top = milestone.at === REFERRAL_GOAL;
  const [scale] = useState(() => new Animated.Value(celebrate ? 0.85 : 1));
  useEffect(() => {
    if (!celebrate) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    playSound('complete');
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce) {
        scale.setValue(1);
        return;
      }
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }).start();
    });
  }, [celebrate, scale]);
  const badge = r.badges[milestone.badge];
  const items = milestone.items.map((id) => cosmeticById(id)).filter((i) => i !== undefined);
  const missing = Math.max(0, milestone.at - qualified);
  const plusDays = milestone.plus_days ?? 0;
  // El premio principal del hito (como en el diseño): lo legendario, la skin, Plus o los Polys.
  const crown = <Crown color={colors.gold} size={18} fill={colors.gold} />;
  const headline: { icon: ReactNode; label: string } = top
    ? {
        icon: crown,
        label: plusDays > 0 ? s.legendaryPlus(plusDays) : s.legendarySkinFrame,
      }
    : items.length > 0
      ? { icon: <Shirt color={colors.textStrong} size={18} />, label: s.exclusiveSkin }
      : plusDays > 0
        ? { icon: crown, label: s.plusDays(plusDays) }
        : { icon: <PolyCoin size={18} />, label: s.polys(milestone.polys) };
  const polysInHeadline = !top && items.length === 0 && plusDays === 0;
  const details = [
    ...(plusDays > 0 ? [s.unlimitedEnergy(plusDays)] : []),
    ...(milestone.polys > 0 && !polysInHeadline ? [s.polys(milestone.polys)] : []),
    s.badgeDetail(badge.name),
    ...items.map((item) =>
      s.itemDetail(item.kind === 'frame' ? 'frame' : 'skin', item.name, item.available),
    ),
    ...(top ? [s.goldenAura] : []),
  ];
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <BrandCard
        highlight={isNext || unlocked}
        glow={unlocked && top}
        contentStyle={styles.milestone}
      >
        <LinearGradient
          colors={
            top ? [colors.gold, colors.goldStrong] : [colors.primaryBright, colors.primaryPressed]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.milestoneIcon, !unlocked && !isNext && styles.dim]}
        >
          {top ? (
            <Crown color={colors.brandSolid} size={34} fill={colors.brandSolid} />
          ) : items.length > 0 ? (
            <Shirt color={colors.onPrimary} size={32} />
          ) : plusDays > 0 ? (
            // Energía ilimitada: infinito + rayo, como en el diseño.
            <View style={styles.energyIcon}>
              <InfinityIcon color={colors.gold} size={34} strokeWidth={2.6} />
              <Zap color={colors.gold} fill={colors.gold} size={18} style={styles.energyZap} />
            </View>
          ) : (
            <Gift color={colors.onPrimary} size={32} />
          )}
        </LinearGradient>
        <View style={styles.flex}>
          <Text variant="heading" color="textStrong">
            {s.friendsCount(milestone.at)}
          </Text>
          <View style={[styles.rewardPill, top && styles.rewardPillTop]}>
            {headline.icon}
            <Text variant="bodyStrong" color={top ? 'gold' : 'textStrong'} numberOfLines={1}>
              {headline.label}
            </Text>
          </View>
          <Text variant="caption" color="text">
            {details.join(', ')}.
          </Text>
        </View>
        {unlocked ? (
          <View
            style={[styles.statusChip, styles.statusChipDone]}
            accessible
            accessibilityLabel={s.unlocked}
          >
            <Check color={colors.onPrimary} size={16} strokeWidth={3} />
          </View>
        ) : (
          <View style={styles.statusChip} accessible accessibilityLabel={s.missingA11y(missing)}>
            <Lock color={colors.textStrong} size={14} />
            <Text variant="caption" color="textStrong" numberOfLines={1}>
              {s.missingShort(missing)}
            </Text>
          </View>
        )}
      </BrandCard>
    </Animated.View>
  );
}

/**
 * Código personal. Tocarlo abre el menú del sistema con el código: desde ahí se copia o se manda
 * (la app no incluye una librería de portapapeles). Mantenerlo presionado también permite copiarlo.
 */
function CodePill({ code, onPress }: { code: string; onPress: () => void }) {
  const styles = useStyles();
  const s = useStrings(inviteFriendsStrings);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={s.codeA11y(code.split('').join(' '))}
      accessibilityHint={s.codeHint}
      onPress={onPress}
      style={({ pressed }) => [styles.codePill, pressed && styles.pressed]}
    >
      <Text color="text" style={styles.codeLabel}>
        {s.yourInviteCode}
      </Text>
      <View style={styles.codeDivider} />
      <View style={styles.codeBox}>
        <Text variant="heading" color="textStrong" selectable style={styles.code}>
          {code}
        </Text>
        <Copy color={colors.textStrong} size={18} />
      </View>
    </Pressable>
  );
}

/** «Agregar amigos» abre esta pantalla: desde acá se sigue llegando al buscador y a las solicitudes. */
function SearchLink() {
  const styles = useStyles();
  const s = useStrings(inviteFriendsStrings);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={s.searchHint}
      hitSlop={8}
      onPress={() => router.push('/add-friends')}
      style={({ pressed }) => [styles.searchLink, pressed && styles.pressed]}
    >
      <Search color={colors.primarySoft} size={18} />
      <Text variant="bodyStrong" color="primarySoft">
        {s.searchByUsername}
      </Text>
    </Pressable>
  );
}

function InviteRow({ invite }: { invite: ReferralInvite }) {
  const styles = useStyles();
  const s = useStrings(inviteFriendsStrings);
  const r = useStrings(referralStrings);
  const ok = invite.status === 'qualified';
  return (
    <View style={styles.inviteRow}>
      <View style={[styles.inviteDot, ok ? styles.inviteDotOk : styles.inviteDotPending]}>
        {ok ? (
          <Check color={colors.onPrimary} size={14} />
        ) : (
          <Clock color={colors.textMuted} size={14} />
        )}
      </View>
      <View style={styles.flex}>
        <Text variant="bodyStrong" color="textStrong" numberOfLines={1}>
          {invite.username ? `@${invite.username}` : s.newAccount}
        </Text>
        <Text variant="caption" color={ok ? 'success' : 'textMuted'}>
          {ok
            ? s.validFriend
            : invite.status === 'rejected'
              ? s.rejected
              : // Paso desconocido (servidor más nuevo) o sin paso: «Validando…», como missingStepLabel.
                ((invite.missing && (r.missingStep[invite.missing] as string | undefined)) ??
                r.validating)}
        </Text>
      </View>
    </View>
  );
}

/** Para cuentas nuevas sin invitación: cargar a mano el código de quien te invitó. */
function ClaimCodeCard() {
  const styles = useStyles();
  const s = useStrings(inviteFriendsStrings);
  const mine = useMyReferral();
  const claim = useClaimReferral();
  const [value, setValue] = useState('');
  if (!mine.data?.can_claim) return null;
  const code = parseInviteCode(value);
  return (
    <View style={styles.claim}>
      <Text variant="bodyStrong" color="textStrong">
        {s.invitedBySomeone}
      </Text>
      <TextField
        label={s.inviteCodeLabel}
        value={value}
        onChangeText={setValue}
        autoCapitalize="characters"
        placeholder="PG-ABC123"
        hint={s.inviteCodeHint}
      />
      {claim.isError ? (
        <FormMessage tone="error" message={referralErrorMessage(claim.error)} />
      ) : null}
      {claim.isSuccess ? (
        <FormMessage tone="success" message={s.claimed(claim.data.referrer_username)} />
      ) : null}
      <Button
        label={s.useCode}
        variant="secondary"
        disabled={!code}
        loading={claim.isPending}
        onPress={() => code && claim.mutate(code)}
      />
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    flex: { flex: 1 },
    tabular: { fontVariant: ['tabular-nums'] },
    pressed: { opacity: 0.75 },
    dim: { opacity: 0.6 },
    back: {
      width: 44,
      height: 44,
      borderRadius: radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    hero: { flexDirection: 'row', alignItems: 'center', minHeight: 170 },
    heroText: { flex: 1, gap: spacing.xs, zIndex: 1 },
    heroTitle: { fontSize: 30, lineHeight: 34 },
    heroArt: { width: '46%', aspectRatio: HERO_ASPECT, marginLeft: -spacing.md },
    progressTop: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
    marks: { ...StyleSheet.absoluteFill },
    mark: {
      position: 'absolute',
      top: -2,
      bottom: -2,
      width: 3,
      marginLeft: -1.5,
      borderRadius: 2,
      backgroundColor: colors.borderStrong,
    },
    markDone: { backgroundColor: colors.gold },
    milestone: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    energyIcon: { alignItems: 'center', justifyContent: 'center' },
    energyZap: { position: 'absolute', top: -14, right: -4 },
    milestoneIcon: {
      width: 68,
      height: 68,
      borderRadius: radii.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rewardPill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: spacing.xs,
      marginVertical: spacing.xxs,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radii.pill,
      backgroundColor: colors.inset,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    rewardPillTop: { borderColor: colors.gold },
    statusChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
      paddingHorizontal: spacing.sm,
      minHeight: 32,
      borderRadius: radii.pill,
      backgroundColor: colors.inset,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    statusChipDone: {
      width: 32,
      paddingHorizontal: 0,
      justifyContent: 'center',
      backgroundColor: colors.successStrong,
      borderColor: colors.successStrong,
    },
    codePill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      gap: spacing.md,
      paddingLeft: spacing.lg,
      paddingRight: spacing.xs,
      paddingVertical: spacing.xs,
      borderRadius: radii.pill,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
      maxWidth: '100%',
    },
    codeLabel: { flexShrink: 1 },
    codeDivider: { width: 1, height: 24, backgroundColor: colors.brandBorder },
    codeBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radii.pill,
      backgroundColor: colors.surfaceRaised,
    },
    code: { letterSpacing: 1 },
    searchLink: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      gap: spacing.xs,
      minHeight: 44,
      paddingHorizontal: spacing.md,
    },
    inviteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inviteDot: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inviteDotOk: { backgroundColor: colors.success },
    inviteDotPending: { backgroundColor: colors.surfaceRaised },
    claim: {
      gap: spacing.sm,
      padding: spacing.lg,
      borderRadius: radii.xl,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
  }),
);
