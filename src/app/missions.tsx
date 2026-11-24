import { router } from 'expo-router';
import {
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Sparkles,
  Swords,
  Target,
  Trophy,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { missionDestination, type MissionId } from '@shared/missions';
import { POLYS } from '@shared/polys';

import {
  Card,
  ErrorState,
  LoadingState,
  PolyCoin,
  ProgressBar,
  Screen,
  ScreenHeader,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { DailyRewardCard } from '@/features/missions/DailyRewardCard';
import { useDailyMissions, type DailyMission } from '@/features/missions/api';
import { missionStrings } from '@/features/missions/strings';
import { FreezeCard } from '@/features/polys/StreakCards';
import { useStrings } from '@/i18n';
import { missionsScreenStrings } from '@/i18n/screens/missions';

const ICONS: Record<MissionId, typeof Target> = {
  lessons: BookOpen,
  minutes: Clock,
  correct: Target,
  perfect: Sparkles,
  ranked_play: Swords,
  ranked_win: Trophy,
};

/**
 * Misiones del día: 3 metas que se renuevan a medianoche. Cada una da Polys y las 3 juntas abren
 * el cofre del día. Acá también se compra el protector de racha.
 */
export default function MissionsScreen() {
  const styles = useStyles();
  const t = useStrings(missionsScreenStrings);
  const missions = useDailyMissions();

  if (missions.isPending) return <LoadingState label={t.loading} />;
  if (missions.isError || !missions.data) {
    return <ErrorState onRetry={() => void missions.refetch()} />;
  }
  const { missions: list, freezes, max_freezes } = missions.data;

  return (
    <Screen
      edges={['top', 'bottom']}
      onRefresh={() => void missions.refetch()}
      refreshing={missions.isRefetching}
    >
      <ScreenHeader title={t.title} onBack={() => router.back()} />

      <DailyRewardCard missions={missions.data} />

      <Text variant="overline" color="textStrong">
        {t.today}
      </Text>
      <View style={styles.list}>
        {list.map((m, i) => (
          <Animated.View key={m.id} entering={FadeInUp.delay(80 * i).duration(300)}>
            <MissionRow mission={m} />
          </Animated.View>
        ))}
      </View>

      <Text variant="caption" align="center">
        {t.resetHint}
      </Text>

      <FreezeCard freezes={freezes} max={max_freezes} />
    </Screen>
  );
}

function MissionRow({ mission }: { mission: DailyMission }) {
  const styles = useStyles();
  const t = useStrings(missionsScreenStrings);
  const m = useStrings(missionStrings);
  const Icon = ICONS[mission.id];
  const title = m.title(mission.id, mission.target);
  const go = () =>
    missionDestination(mission.id) === 'ranked' ? router.navigate('/ranked') : router.navigate('/');
  return (
    <Card
      onPress={mission.done ? undefined : go}
      style={[styles.mission, mission.done && styles.missionDone]}
      accessibilityLabel={t.missionA11y(
        title,
        mission.progress,
        mission.target,
        mission.done,
        POLYS.mission,
      )}
    >
      <View style={[styles.missionIcon, mission.done && styles.missionIconDone]}>
        {mission.done ? (
          <Check color={colors.onPrimary} size={22} strokeWidth={3} />
        ) : (
          <Icon color={colors.primaryBright} size={22} />
        )}
      </View>
      <View style={styles.missionBody}>
        <Text variant="bodyStrong" color={mission.done ? 'textMuted' : 'textStrong'}>
          {title}
        </Text>
        <View style={styles.progressRow}>
          <View style={styles.flex}>
            <ProgressBar
              value={mission.progress / mission.target}
              height={8}
              colors={mission.done ? [colors.success, colors.successStrong] : undefined}
            />
          </View>
          <Text variant="caption" color={mission.done ? 'success' : 'text'}>
            {mission.progress}/{mission.target}
          </Text>
        </View>
      </View>
      <View style={styles.missionReward} accessible={false}>
        <PolyCoin size={16} />
        <Text variant="caption" color={mission.done ? 'success' : 'gold'}>
          +{POLYS.mission}
        </Text>
      </View>
      {mission.done ? null : <ChevronRight color={colors.textMuted} size={20} />}
    </Card>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    flex: { flex: 1 },
    missionReward: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
    list: { gap: spacing.md },
    mission: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    missionDone: { opacity: 0.85 },
    missionIcon: {
      width: 44,
      height: 44,
      borderRadius: radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceRaised,
    },
    missionIconDone: { backgroundColor: colors.successDeep },
    missionBody: { flex: 1, gap: spacing.sm },
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  }),
);
