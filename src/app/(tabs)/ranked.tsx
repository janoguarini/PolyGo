import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  CalendarDays,
  ChevronRight,
  Gamepad2,
  KeyRound,
  Swords,
  Target,
  Trophy,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react-native';
import { useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ScrollViewInstance } from 'react-native';

import { languageConfig } from '@shared/languages';
import { getRank, isPlaced } from '@shared/ranking';

import {
  Button,
  Card,
  ErrorState,
  LoadingState,
  Screen,
  Text,
  TextField,
  MIN_TOUCH,
  palette,
  colors,
  elevation,
  radii,
  spacing,
  themedStyles,
  gradients,
} from '@/design-system';
import { rankedDisabled } from '@/features/battle/availability';
import { battleStrings } from '@/features/battle/strings';
import { useActiveSeason, useMyProfile } from '@/features/profile/hooks';
import { PolysChip } from '@/features/polys/PolysChip';
import { useMyLeaderboardPosition } from '@/features/ranked/api';
import { GoldButton } from '@/features/ranked/GoldButton';
import { RankCard } from '@/features/ranked/RankCard';
import { TierLadder } from '@/features/ranked/TierLadder';
import { useLocale, useStrings } from '@/i18n';
import { rankedScreenStrings } from '@/i18n/screens/ranked';
import { useTabPressScroll } from '@/lib/useTabPressScroll';

/** Alto de los chips del encabezado (Polys y clasificación). */
const CHIP_HEIGHT = 38;

export default function RankedScreen() {
  const styles = useStyles();
  const t = useStrings(rankedScreenStrings);
  const unavailableTitle = useStrings(battleStrings).rankedUnavailableTitle;
  const locale = useLocale();
  const me = useMyProfile();
  const season = useActiveSeason();
  const position = useMyLeaderboardPosition(null);
  const scrollRef = useRef<ScrollViewInstance>(null);
  useTabPressScroll(scrollRef);

  if (me.isPending) return <LoadingState />;
  if (me.isError || !me.data) return <ErrorState onRetry={() => void me.refetch()} />;

  const rating = me.data.rating;
  const currentTier = rating && isPlaced(rating) ? getRank(rating.rating).tier.id : null;

  return (
    <Screen
      scrollRef={scrollRef}
      onRefresh={() => {
        void me.refetch();
        void position.refetch();
      }}
      refreshing={me.isRefetching}
    >
      {/* Resplandor violeta detrás del encabezado. */}
      <LinearGradient
        colors={gradients.rankedHeader}
        style={styles.backdrop}
        pointerEvents="none"
      />

      <View style={styles.headerBlock}>
        <View style={styles.header}>
          <Text variant="display" style={styles.title}>
            Ranked
          </Text>
          <PolysChip style={styles.chip} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.leaderboardA11y(position.data?.position)}
            hitSlop={6}
            onPress={() => router.push('/leaderboard')}
            style={({ pressed }) => [styles.trophyGlow, pressed && styles.pressed]}
          >
            <LinearGradient
              colors={['#FFE89A', colors.gold, colors.goldStrong]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.trophyButton}
            >
              <Trophy color={palette.ink900} fill={palette.ink900} size={18} />
              <Text variant="bodyStrong" style={styles.trophyText}>
                {position.data?.position ? `#${position.data.position}` : t.top}
              </Text>
              <ChevronRight color={palette.ink900} size={16} strokeWidth={2.5} />
            </LinearGradient>
          </Pressable>
        </View>
        {season.data ? (
          <View style={styles.season}>
            <CalendarDays color={colors.primarySoft} size={16} />
            <Text variant="caption" color="text" style={styles.seasonText}>
              {t.seasonEnds(
                season.data.name,
                new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(
                  new Date(season.data.ends_at),
                ),
              )}
            </Text>
          </View>
        ) : null}
      </View>

      {!languageConfig(me.data.profile.target_language).ranked ? (
        // Idiomas en preparación: sin banco de palabras suficiente para Word Rush.
        <Card style={styles.matchCard}>
          <Text variant="overline">{t.modeWordRush}</Text>
          <Text variant="heading">{t.comingSoon(me.data.profile.target_language)}</Text>
          <Text color="textMuted">{t.comingSoonBody}</Text>
          <Button
            label={t.goToProfile}
            variant="secondary"
            onPress={() => router.push('/profile')}
          />
        </Card>
      ) : (
        <>
          {rating ? <RankCard rating={rating} /> : null}
          <TierLadder current={currentTier} />

          {rankedDisabled ? (
            // Sin servidor de partidas válido en esta build: no se ofrece jugar (ni se cae al legacy).
            // Los desafíos con amigos siguen abajo: no pasan por el servidor de partidas.
            <Card style={styles.matchCard}>
              <Text variant="overline">{t.modeWordRush}</Text>
              <Text variant="heading" accessibilityRole="header">
                {unavailableTitle}
              </Text>
              <Text color="textMuted">{t.disabledBody}</Text>
            </Card>
          ) : (
            <MatchModeCard />
          )}

          <FriendChallengeCard />
        </>
      )}
    </Screen>
  );
}

/** Word Rush: buscar partida Ranked o practicar sin ELO. Sólo con Ranked disponible. */
function MatchModeCard() {
  const styles = useStyles();
  const t = useStrings(rankedScreenStrings);
  return (
    <Card gradient={gradients.rankedPanel} style={[styles.matchCard, styles.glowCard]}>
      <SectionTitle icon={<Gamepad2 color={colors.primarySoft} size={18} />} centered>
        {t.gameMode}
      </SectionTitle>
      <View style={styles.modePill}>
        <Zap color={colors.gold} fill={colors.gold} size={18} />
        <Text variant="bodyStrong" color="textStrong">
          Word Rush
        </Text>
      </View>
      <GoldButton
        label={t.findMatch}
        accessibilityHint={t.findMatchHint}
        onPress={() => router.push({ pathname: '/battle', params: { mode: 'ranked' } })}
      />
      <OutlinePill
        label={t.practiceNoElo}
        icon={<Target color={colors.text} size={18} />}
        accessibilityHint={t.practiceHint}
        onPress={() => router.push({ pathname: '/battle', params: { mode: 'practice' } })}
      />
    </Card>
  );
}

function SectionTitle({
  icon,
  children,
  centered = false,
}: {
  icon: ReactNode;
  children: string;
  centered?: boolean;
}) {
  const styles = useStyles();
  return (
    <View style={[styles.sectionTitle, centered && styles.centered]}>
      {icon}
      <Text variant="overline" color="primarySoft" style={styles.sectionText}>
        {children}
      </Text>
    </View>
  );
}

function OutlinePill({
  label,
  icon,
  onPress,
  accessibilityHint,
}: {
  label: string;
  icon?: ReactNode;
  onPress: () => void;
  accessibilityHint?: string;
}) {
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [styles.outlinePill, pressed && styles.pressed]}
    >
      {icon}
      <Text variant="bodyStrong" color="textStrong" numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const CODE_PATTERN = /^[A-Z0-9]{6}$/;

/** Desafío a un amigo: crear un código o entrar con el de otro. Amistoso, sin ELO. */
function FriendChallengeCard() {
  const styles = useStyles();
  const t = useStrings(rankedScreenStrings);
  const [joining, setJoining] = useState(false);
  const [code, setCode] = useState('');
  const clean = code.trim().toUpperCase();
  const valid = CODE_PATTERN.test(clean);

  return (
    <Card style={styles.matchCard}>
      <View style={styles.friendTop}>
        <View style={styles.friendText}>
          <SectionTitle icon={<Users color={colors.primarySoft} size={18} />}>
            {t.playWithFriend}
          </SectionTitle>
          <Text color="text">{t.playWithFriendBody}</Text>
        </View>
        <View style={styles.swords} accessible={false}>
          <Swords color={colors.primarySoft} size={36} strokeWidth={1.75} />
        </View>
      </View>
      {joining ? (
        <>
          <TextField
            label={t.challengeCode}
            value={code}
            onChangeText={(t) => setCode(t.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6))}
            autoCapitalize="characters"
            autoCorrect={false}
            autoFocus
            placeholder="ABC234"
            returnKeyType="go"
            onSubmitEditing={() => {
              if (valid) router.push({ pathname: '/battle', params: { code: clean } });
            }}
          />
          <Button
            label={t.joinChallenge}
            disabled={!valid}
            onPress={() => router.push({ pathname: '/battle', params: { code: clean } })}
          />
          <Button label={t.back} variant="ghost" onPress={() => setJoining(false)} />
        </>
      ) : (
        <>
          <Button
            label={t.challengeFriend}
            icon={<UserPlus color={colors.onPrimary} size={20} />}
            accessibilityHint={t.challengeFriendHint}
            onPress={() => router.push('/challenge-friend')}
          />
          <OutlinePill
            label={t.haveCode}
            icon={<KeyRound color={colors.text} size={18} />}
            onPress={() => setJoining(true)}
          />
        </>
      )}
    </Card>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    backdrop: { position: 'absolute', top: -400, left: 0, right: 0, height: 760 },
    headerBlock: { gap: spacing.sm },
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    title: { flex: 1, fontStyle: 'italic', fontWeight: '900', fontSize: 38, lineHeight: 44 },
    season: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radii.pill,
      backgroundColor: colors.inset,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    seasonText: { fontSize: 14, flexShrink: 1 },
    chip: { minHeight: CHIP_HEIGHT, paddingHorizontal: spacing.md },
    trophyGlow: {
      borderRadius: radii.pill,
      shadowColor: colors.gold,
      shadowOpacity: 0.55,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
      elevation: 6,
    },
    trophyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      minHeight: CHIP_HEIGHT,
      paddingLeft: spacing.md,
      paddingRight: spacing.sm,
      borderRadius: radii.pill,
      borderWidth: 1.5,
      borderColor: '#FFF1B8',
    },
    trophyText: { color: palette.ink900, fontWeight: '800', fontVariant: ['tabular-nums'] },
    matchCard: { gap: spacing.md },
    glowCard: { borderColor: colors.brandBorder, ...elevation.glow },
    sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    sectionText: { fontSize: 13, lineHeight: 16 },
    centered: { justifyContent: 'center' },
    modePill: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      alignSelf: 'center',
      minHeight: MIN_TOUCH,
      paddingHorizontal: spacing.xxl,
      borderRadius: radii.pill,
      backgroundColor: colors.inset,
      borderWidth: 1.5,
      borderColor: 'rgba(167, 139, 250, 0.55)',
      marginBottom: spacing.xs,
    },
    outlinePill: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      minHeight: 50,
      paddingHorizontal: spacing.xl,
      borderRadius: radii.pill,
      borderWidth: 1.5,
      borderColor: colors.borderStrong,
      backgroundColor: 'rgba(7, 6, 15, 0.3)',
    },
    friendTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    friendText: { flex: 1, gap: spacing.sm },
    swords: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(124, 58, 237, 0.18)',
      ...elevation.glow,
    },
    pressed: { opacity: 0.75 },
  }),
);
