import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  BarChart3,
  ChevronRight,
  Crown,
  Flag,
  Flame,
  Settings,
  Sparkles,
  Swords,
  Target,
  Trophy,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Alert, Image, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { defaultCourseFor } from '@shared/courses';
import { getRank, isPlaced } from '@shared/ranking';

import {
  BrandCard,
  ProgressBar,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { useLearningSummary } from '@/features/learning/hooks';
import { useEnergy } from '@/features/plus/api';
import { PolysChip } from '@/features/polys/PolysChip';
import { useXp } from '@/features/xp/api';
import { qaReadOnly } from '@/features/xp/previewGate';
import { XP_BAR_COLORS } from '@/features/xp/LevelProgress';
import { avatarViolet } from '@/design-system/imageData.generated';
import { useRankLabels } from '@/features/ranked/rankNames';
import { useLocale, useStrings } from '@/i18n';
import { useLanguageName } from '@/i18n/languages';
import type { PlayerRatingRow } from '@/lib/database.types';

import { familyProgress } from '../families';
import { useSwitchCourse } from '@/features/courses/hooks';

import { useMyAchievements } from '../hooks';
import { levelColor } from '../levelColor';
import { useLanguageRows, type LanguageProgressRow } from '../languageProgress';
import { achievementStrings, sectionsStrings } from '../strings';
import { AchievementsCarousel } from './AchievementsCarousel';

/**
 * Encabezado en una sola fila: marca PolyGo, racha, Polys y Ajustes. Sin título «Perfil» (la pestaña ya
 * lo dice): ese alto se lo lleva la tarjeta del jugador. En teléfonos de menos de 360 pt queda sólo el
 * logo, así los dos chips y la rueda entran sin apretarse.
 */
export function ProfileTopBar() {
  const styles = useStyles();
  const t = useStrings(sectionsStrings);
  const summary = useLearningSummary();
  const { width } = useWindowDimensions();
  const streak = summary.data?.streak_days;
  const showWordmark = width >= 360;
  return (
    <View style={styles.topBar}>
      <View style={styles.brand}>
        <Image source={avatarViolet} style={styles.logo} fadeDuration={0} accessible={false} />
        {showWordmark ? (
          <Text variant="title" color="textStrong" numberOfLines={1}>
            PolyGo
          </Text>
        ) : null}
      </View>
      <View
        style={styles.chip}
        accessible
        accessibilityLabel={streak === undefined ? t.streak : t.streakA11y(streak)}
      >
        <Flame
          color={streak ? colors.streak : colors.textSubtle}
          fill={streak ? colors.streak : 'transparent'}
          size={18}
        />
        <Text variant="bodyStrong" color={streak ? 'streak' : 'textMuted'} style={styles.tabular}>
          {streak ?? '–'}
        </Text>
      </View>
      <PolysChip />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t.settings}
        hitSlop={8}
        onPress={() => router.push('/settings')}
        style={({ pressed }) => [styles.gear, pressed && styles.pressed]}
      >
        <Settings color={colors.text} size={20} />
      </Pressable>
    </View>
  );
}

/** Victorias, partidas y porcentaje de victorias del idioma que estudiás (datos de ranked). */
export function StatsRow({ rating }: { rating: PlayerRatingRow | null }) {
  const styles = useStyles();
  const t = useStrings(sectionsStrings);
  const games = rating?.games_played ?? 0;
  const wins = rating?.wins ?? 0;
  const winRate = games > 0 ? `${Math.round((wins / games) * 100)}%` : '–';
  // Una sola franja con tres columnas iguales: ícono grande, número destacado y etiqueta debajo.
  return (
    <View style={styles.stats}>
      <StatCell
        emoji="🏆"
        tint={['rgba(250, 204, 21, 0.38)', 'rgba(180, 83, 9, 0.12)']}
        glow="#FACC15"
        value={String(wins)}
        label={t.wins}
      />
      <View style={styles.statDivider} />
      <StatCell
        emoji="⚔️"
        tint={['rgba(167, 139, 250, 0.42)', 'rgba(76, 29, 149, 0.14)']}
        glow="#A78BFA"
        value={String(games)}
        label={t.games}
      />
      <View style={styles.statDivider} />
      <StatCell
        emoji="🎯"
        tint={['rgba(248, 113, 113, 0.38)', 'rgba(153, 27, 27, 0.12)']}
        glow="#F87171"
        value={winRate}
        label={t.winRate}
      />
    </View>
  );
}

/**
 * Columna de estadística: emoji a color (en iOS, el estilo 3D de Apple) sobre un medallón con degradé
 * y halo del color de la estadística, número destacado y etiqueta.
 */
function StatCell({
  emoji,
  tint,
  glow,
  value,
  label,
}: {
  emoji: string;
  tint: readonly [string, string];
  glow: string;
  value: string;
  label: string;
}) {
  const styles = useStyles();
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${label}: ${value}`}>
      <View style={[styles.statHalo, { shadowColor: glow }]}>
        <LinearGradient
          colors={tint}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={[styles.statIcon, { borderColor: `${glow}66` }]}
        >
          <Text style={styles.statEmoji} accessible={false}>
            {emoji}
          </Text>
        </LinearGradient>
      </View>
      <Text variant="heading" color="textStrong" style={styles.tabular} numberOfLines={1}>
        {value}
      </Text>
      <Text variant="caption" color="text" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/**
 * Mis idiomas: el que estudiás y los que empezaste, con su nivel MCER en curso y el progreso real
 * del nivel (lecciones completadas, como en Aprender). Tocar otro idioma lo elige; «Gestionar» abre
 * el selector con todos.
 */
export function LanguagesCard({ current, startLevel }: { current: string; startLevel: string }) {
  const styles = useStyles();
  const t = useStrings(sectionsStrings);
  const languageName = useLanguageName();
  const { rows, isPending, isError, refetch } = useLanguageRows(current, startLevel);
  const switchCourse = useSwitchCourse();
  const narrow = useWindowDimensions().width < 360;
  const choose = (row: LanguageProgressRow) => {
    if (row.current) return;
    if (qaReadOnly) {
      Alert.alert(t.previewTitle, t.previewLanguage);
      return;
    }
    switchCourse.mutate(defaultCourseFor(row.language.code), {
      onError: () => Alert.alert(t.switchErrorTitle, t.switchErrorMessage),
    });
  };
  return (
    <BrandCard>
      <SectionTitle
        icon={<BarChart3 color={colors.primarySoft} size={20} />}
        title={t.myLanguages}
        action={
          qaReadOnly ? undefined : { label: t.manage, onPress: () => router.push('/courses') }
        }
      />
      {isError ? (
        <Pressable accessibilityRole="button" onPress={refetch}>
          <Text variant="caption">{t.progressError}</Text>
        </Pressable>
      ) : isPending ? (
        <Text variant="caption">{t.loadingLanguages}</Text>
      ) : (
        rows.map((row, i) => (
          <Pressable
            key={row.language.code}
            accessibilityRole="button"
            accessibilityLabel={t.languageA11y(
              languageName(row.language.code),
              row.progress?.level ?? null,
              Math.round((row.progress?.ratio ?? 0) * 100),
              row.current,
            )}
            onPress={() => choose(row)}
            style={({ pressed }) => [
              styles.langRow,
              narrow && styles.langRowNarrow,
              i > 0 && styles.langDivider,
              pressed && !row.current && styles.pressed,
            ]}
          >
            <Text style={styles.flag}>{row.language.flag}</Text>
            <View style={styles.langName}>
              <Text variant="bodyStrong" color="textStrong" numberOfLines={1}>
                {languageName(row.language.code)}
              </Text>
              {row.current ? (
                <Text variant="caption" color="primarySoft">
                  {t.studying}
                </Text>
              ) : null}
            </View>
            {row.progress ? (
              <>
                <View
                  style={[styles.levelPill, { backgroundColor: levelColor(row.progress.level) }]}
                >
                  <Text variant="caption" color="onPrimary" style={styles.levelText}>
                    {row.progress.level}
                  </Text>
                </View>
                <View style={styles.langBar}>
                  <ProgressBar
                    value={row.progress.ratio}
                    accessibilityLabel={t.levelProgress(row.progress.level)}
                  />
                </View>
                <Text variant="caption" color="text" style={[styles.tabular, styles.percent]}>
                  {Math.round(row.progress.ratio * 100)}%
                </Text>
              </>
            ) : null}
            <ChevronRight color={colors.textMuted} size={18} />
          </Pressable>
        ))
      )}
    </BrandCard>
  );
}

/** Logros: desbloqueados sobre el total y las familias destacadas. */
export function AchievementsCard() {
  const t = useStrings(sectionsStrings);
  const achievements = useMyAchievements();
  const total = achievements.data?.length;
  const unlocked = achievements.data?.filter((a) => a.unlockedAt).length;
  return (
    <BrandCard>
      <SectionTitle
        icon={<Trophy color={colors.gold} size={20} />}
        title={total ? t.achievementsCount(unlocked ?? 0, total) : t.achievements}
        action={{ label: t.seeAll, onPress: () => router.push('/achievements') }}
      />
      <AchievementsCarousel />
    </BrandCard>
  );
}

interface Goal {
  key: string;
  icon: ReactNode;
  title: string;
  detail: string;
  ratio: number;
  colors?: readonly [string, string, ...string[]];
  onPress?: () => void;
}

/**
 * Próximos objetivos: lo que está más cerca de desbloquearse, con datos reales del servidor (nivel
 * por XP, escalón de ranked por ELO y el logro más avanzado). Sin recompensas inventadas: cada
 * objetivo dice qué falta, no qué se gana.
 */
export function NextGoalsCard({ rating }: { rating: PlayerRatingRow | null }) {
  const styles = useStyles();
  const t = useStrings(sectionsStrings);
  const a = useStrings(achievementStrings);
  const ranks = useRankLabels();
  const xp = useXp().data;
  const achievements = useMyAchievements().data;
  const goals: Goal[] = [];

  if (xp && xp.need > 0) {
    goals.push({
      key: 'level',
      icon: <Sparkles color={colors.gold} size={20} />,
      title: t.reachLevel(xp.level + 1),
      detail: t.xpLeft(xp.remaining),
      ratio: xp.into / xp.need,
      colors: XP_BAR_COLORS,
    });
  }

  if (!rating || !isPlaced(rating)) {
    goals.push({
      key: 'rank',
      icon: <Swords color={colors.primarySoft} size={20} />,
      title: t.enterRanking,
      detail: t.winARanked,
      ratio: 0,
      onPress: () => router.push('/ranked'),
    });
  } else {
    const rank = getRank(rating.rating);
    if (rank.nextStepMin !== null) {
      goals.push({
        key: 'rank',
        icon: <Swords color={colors.primarySoft} size={20} />,
        title: t.climbTo(ranks.label(getRank(rank.nextStepMin))),
        detail: t.eloLeft(Math.max(0, rank.nextStepMin - rating.rating)),
        ratio: rank.progress,
        onPress: () => router.push('/leaderboard'),
      });
    }
  }

  if (achievements) {
    const closest = familyProgress(achievements)
      .filter((f) => f.next)
      .sort((a, b) => b.ratio - a.ratio)[0];
    if (closest?.next) {
      goals.push({
        key: 'achievement',
        icon: <Flag color={colors.success} size={20} />,
        title: a.tierDescription(closest.family, closest.next),
        detail: `${closest.value} / ${closest.next.threshold}`,
        ratio: closest.ratio,
        colors: closest.family.colors,
        onPress: () => router.push('/achievements'),
      });
    }
  }

  if (goals.length === 0) return null;
  return (
    <BrandCard>
      <SectionTitle icon={<Target color={colors.primarySoft} size={20} />} title={t.nextGoals} />
      {goals.map((g, i) => {
        const row = (
          <>
            <View style={styles.goalIcon}>{g.icon}</View>
            <View style={styles.goalBody}>
              <Text variant="bodyStrong" color="textStrong" numberOfLines={1}>
                {g.title}
              </Text>
              <View style={styles.goalBottom}>
                <View style={styles.flex}>
                  <ProgressBar value={g.ratio} height={6} colors={g.colors} />
                </View>
                <Text variant="caption" color="text" numberOfLines={1} style={styles.goalDetail}>
                  {g.detail}
                </Text>
              </View>
            </View>
            {g.onPress ? <ChevronRight color={colors.textMuted} size={18} /> : null}
          </>
        );
        const label = t.goalA11y(g.title, g.detail, Math.round(g.ratio * 100));
        return g.onPress ? (
          <Pressable
            key={g.key}
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={g.onPress}
            style={({ pressed }) => [
              styles.goal,
              i > 0 && styles.langDivider,
              pressed && styles.pressed,
            ]}
          >
            {row}
          </Pressable>
        ) : (
          <View
            key={g.key}
            accessible
            accessibilityLabel={label}
            style={[styles.goal, i > 0 && styles.langDivider]}
          >
            {row}
          </View>
        );
      })}
    </BrandCard>
  );
}

/** PolyGo Plus: beneficios reales (los de la pantalla de Plus) o tu suscripción activa. */
export function PlusCard() {
  const styles = useStyles();
  const t = useStrings(sectionsStrings);
  const locale = useLocale();
  const energy = useEnergy();
  const plus = energy.view?.plus;
  return (
    <BrandCard
      glow={!plus}
      highlight
      onPress={() => router.push('/plus')}
      accessibilityLabel={plus ? t.plusActiveA11y : t.plusLearnA11y}
      contentStyle={styles.plus}
    >
      <Crown color={colors.gold} fill={colors.gold} size={40} />
      <View style={styles.flex}>
        <Text variant="heading" color="textStrong">
          PolyGo Plus
        </Text>
        <Text variant="caption" color="text">
          {plus
            ? energy.plusExpiresAt
              ? t.plusUntil(new Date(energy.plusExpiresAt).toLocaleDateString(locale))
              : t.plusActive
            : t.plusPitch}
        </Text>
      </View>
      <ChevronRight color={colors.textStrong} size={24} />
    </BrandCard>
  );
}

export function SectionTitle({
  icon,
  title,
  action,
}: {
  icon?: ReactNode;
  title: string;
  action?: { label: string; onPress: () => void };
}) {
  const styles = useStyles();
  return (
    <View style={styles.section}>
      {icon}
      <Text variant="heading" color="textStrong" style={styles.flex}>
        {title}
      </Text>
      {action ? (
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={action.onPress}
          style={styles.sectionAction}
        >
          <Text variant="bodyStrong" color="primarySoft">
            {action.label}
          </Text>
          <ChevronRight color={colors.primarySoft} size={16} />
        </Pressable>
      ) : null}
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    flex: { flex: 1 },
    tabular: { fontVariant: ['tabular-nums'] },
    pressed: { opacity: 0.75 },
    topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    brand: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    logo: { width: 36, height: 36, borderRadius: 18 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.xxs,
      paddingHorizontal: spacing.sm,
      borderRadius: radii.pill,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.border,
    },
    gear: {
      width: 40,
      height: 40,
      borderRadius: radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    stats: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm + 2,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    stat: { flex: 1, minWidth: 0, alignItems: 'center', gap: 1 },
    statHalo: {
      borderRadius: 20,
      marginBottom: 1,
      shadowOpacity: 0.5,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 0 },
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statEmoji: { fontSize: 21, lineHeight: 26, textAlign: 'center' },
    statDivider: {
      width: 1,
      alignSelf: 'stretch',
      marginVertical: spacing.sm,
      backgroundColor: colors.brandBorder,
    },
    goal: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: 48,
      paddingVertical: spacing.xs,
    },
    goalIcon: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.inset,
    },
    goalBody: { flex: 1, minWidth: 0, gap: spacing.xxs },
    goalBottom: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    goalDetail: { flexShrink: 0, maxWidth: '55%', fontVariant: ['tabular-nums'] },
    section: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    sectionAction: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    langRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: 48,
    },
    langDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.brandBorder },
    flag: { fontSize: 26, lineHeight: 32 },
    // Nombre y barra se reparten el ancho libre (la barra un poco más); el nombre se corta con … y
    // la barra conserva un mínimo legible en pantallas angostas.
    langName: { flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 52 },
    levelPill: {
      minWidth: 36,
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radii.sm,
    },
    levelText: { fontWeight: '800' },
    langBar: { flexGrow: 1.3, flexShrink: 1, flexBasis: 0, minWidth: 36 },
    percent: { width: 34, textAlign: 'right' },
    // Menos aire entre columnas en teléfonos de menos de 360 pt: todo entra sin cortar la barra.
    langRowNarrow: { gap: spacing.xs + 2 },
    plus: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  }),
);
