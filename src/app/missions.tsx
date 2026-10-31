import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import {
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Snowflake,
  Sparkles,
  Swords,
  Target,
  Trophy,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

import { missionDestination, missionTitle, type MissionId } from '@shared/missions';

import {
  Button,
  Card,
  ErrorState,
  LoadingState,
  ProgressBar,
  Screen,
  ScreenHeader,
  Text,
  colors,
  gradients,
  radii,
  spacing,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import {
  useClaimMissionReward,
  useDailyMissions,
  type DailyMission,
} from '@/features/missions/api';
import { toUserMessage } from '@/lib/errors';
import { playSound } from '@/lib/sounds';

const ICONS: Record<MissionId, typeof Target> = {
  lessons: BookOpen,
  minutes: Clock,
  correct: Target,
  perfect: Sparkles,
  ranked_play: Swords,
  ranked_win: Trophy,
};

/** Misiones del día: 3 metas que se renuevan a medianoche. Las 3 juntas dan un protector de racha. */
export default function MissionsScreen() {
  const missions = useDailyMissions();
  const claim = useClaimMissionReward();

  if (missions.isPending) return <LoadingState label="Cargando misiones…" />;
  if (missions.isError || !missions.data) {
    return <ErrorState onRetry={() => void missions.refetch()} />;
  }
  const { missions: list, all_done, claimed, freezes, max_freezes } = missions.data;
  const doneCount = list.filter((m) => m.done).length;

  const onClaim = () =>
    claim.mutate(undefined, {
      onSuccess: () => {
        playSound('complete');
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
    });

  return (
    <Screen
      edges={['top', 'bottom']}
      onRefresh={() => void missions.refetch()}
      refreshing={missions.isRefetching}
    >
      <ScreenHeader title="Misiones del día" onBack={() => router.back()} />

      <Card gradient={gradients.hero} style={styles.reward}>
        <View style={styles.rewardRow}>
          <Animated.View
            key={claimed ? 'claimed' : 'pending'}
            entering={claimed ? ZoomIn.springify() : undefined}
            style={[styles.freezeIcon, claimed && styles.freezeIconOn]}
          >
            <Snowflake color={claimed ? colors.onPrimary : colors.info} size={30} />
          </Animated.View>
          <View style={styles.flex}>
            <Text variant="overline" color="info">
              RECOMPENSA
            </Text>
            <Text variant="heading" color="textStrong">
              Protector de racha
            </Text>
            <Text variant="caption">
              Si un día no estudiás, se usa solo y tu racha sigue. Tenés {freezes} de {max_freezes}.
            </Text>
          </View>
        </View>
        <ProgressBar
          value={doneCount / list.length}
          colors={[colors.info, colors.infoAlt]}
          accessibilityLabel={`${doneCount} de ${list.length} misiones completas`}
        />
        {claimed ? (
          <Text variant="bodyStrong" color="success" align="center">
            {freezes >= max_freezes && claim.data?.granted === false
              ? `Ya tenías ${max_freezes} protectores, el máximo. ¡Volvé mañana!`
              : '¡Protector reclamado! Mañana hay misiones nuevas.'}
          </Text>
        ) : all_done ? (
          <Button
            label="Reclamar protector"
            size="lg"
            icon={<Snowflake color={colors.onPrimary} size={20} />}
            loading={claim.isPending}
            onPress={onClaim}
          />
        ) : (
          <Text variant="caption" align="center">
            Completá las {list.length} misiones para ganarlo · {doneCount}/{list.length}
          </Text>
        )}
        {claim.isError ? <FormMessage tone="error" message={toUserMessage(claim.error)} /> : null}
      </Card>

      <View style={styles.list}>
        {list.map((m, i) => (
          <Animated.View key={m.id} entering={FadeInUp.delay(80 * i).duration(300)}>
            <MissionRow mission={m} />
          </Animated.View>
        ))}
      </View>

      <Text variant="caption" align="center">
        Las misiones cambian todos los días a la medianoche.
      </Text>
    </Screen>
  );
}

function MissionRow({ mission }: { mission: DailyMission }) {
  const Icon = ICONS[mission.id];
  const title = missionTitle(mission.id, mission.target);
  const go = () =>
    missionDestination(mission.id) === 'ranked' ? router.navigate('/ranked') : router.navigate('/');
  return (
    <Card
      onPress={mission.done ? undefined : go}
      style={[styles.mission, mission.done && styles.missionDone]}
      accessibilityLabel={`${title}: ${mission.progress} de ${mission.target}${mission.done ? ', completa' : ''}`}
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
      {mission.done ? null : <ChevronRight color={colors.textMuted} size={20} />}
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  reward: { gap: spacing.lg },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  freezeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 2,
    borderColor: colors.info,
  },
  freezeIconOn: { backgroundColor: colors.info },
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
});
