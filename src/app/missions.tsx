import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import {
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Gift,
  Snowflake,
  Sparkles,
  Swords,
  Target,
  Trophy,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

import { missionDestination, missionTitle, type MissionId } from '@shared/missions';
import { POLYS } from '@shared/polys';

import {
  Button,
  Card,
  ErrorState,
  LoadingState,
  PolyCoin,
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
import { useBuyStreakFreeze, usePolys } from '@/features/polys/api';
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

/**
 * Misiones del día: 3 metas que se renuevan a medianoche. Cada una da Polys y las 3 juntas abren
 * el cofre del día. Acá también se compra el protector de racha.
 */
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
            style={[styles.chestIcon, claimed && styles.chestIconOn]}
          >
            <Gift color={claimed ? colors.onPrimary : colors.gold} size={30} />
          </Animated.View>
          <View style={styles.flex}>
            <Text variant="overline" color="gold">
              RECOMPENSA
            </Text>
            <Text variant="heading" color="textStrong">
              Cofre del día
            </Text>
            <Text variant="caption">
              {`Entre ${POLYS.chest.min} y ${POLYS.chest.max} Polys, y a veces ${POLYS.chest.jackpot}. Abrilo ${POLYS.weekly.days} días de la semana y ganás ${POLYS.weekly.bonus} extra.`}
            </Text>
          </View>
        </View>
        <ProgressBar
          value={doneCount / list.length}
          colors={[colors.gold, colors.goldStrong]}
          accessibilityLabel={`${doneCount} de ${list.length} misiones completas`}
        />
        {claimed ? (
          claim.data ? (
            <Animated.View entering={ZoomIn.springify()} style={styles.prize}>
              <PolyCoin size={28} />
              <Text variant="title" color="gold">
                +{claim.data.polys + claim.data.weekly_bonus}
              </Text>
              <Text variant="bodyStrong" color="text" style={styles.flexShrink}>
                {claim.data.jackpot
                  ? '¡Cofre de la suerte!'
                  : claim.data.weekly_bonus > 0
                    ? `Incluye el bonus semanal (+${claim.data.weekly_bonus})`
                    : '¡Cofre abierto!'}
              </Text>
            </Animated.View>
          ) : (
            <Text variant="bodyStrong" color="success" align="center">
              Ya abriste el cofre de hoy. ¡Mañana hay misiones nuevas!
            </Text>
          )
        ) : all_done ? (
          <Button
            label="Abrir cofre"
            size="lg"
            icon={<Gift color={colors.onPrimary} size={20} />}
            loading={claim.isPending}
            onPress={onClaim}
          />
        ) : (
          <Text variant="caption" align="center">
            Completá las {list.length} misiones para abrirlo · {doneCount}/{list.length}
          </Text>
        )}
        {claim.isError ? <FormMessage tone="error" message={toUserMessage(claim.error)} /> : null}
      </Card>

      <FreezeCard freezes={freezes} max={max_freezes} />

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

/** El protector se compra con Polys: si un día no estudiás, se usa solo. */
function FreezeCard({ freezes, max }: { freezes: number; max: number }) {
  const polys = usePolys();
  const buy = useBuyStreakFreeze();
  const balance = polys.data?.balance ?? 0;
  const price = POLYS.prices.streakFreeze;
  const full = freezes >= max;
  return (
    <Card style={styles.freeze}>
      <View style={styles.rewardRow}>
        <View style={styles.freezeIcon}>
          <Snowflake color={colors.info} size={26} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong" color="textStrong">
            Protector de racha · {freezes}/{max}
          </Text>
          <Text variant="caption">Si un día no estudiás, se usa solo y tu racha sigue.</Text>
        </View>
      </View>
      <Button
        label={full ? 'Tenés el máximo' : `Comprar por ${price}`}
        variant="secondary"
        icon={full ? undefined : <PolyCoin size={20} />}
        disabled={full || balance < price}
        loading={buy.isPending}
        accessibilityHint={full ? undefined : `Cuesta ${price} Polys. Tenés ${balance}.`}
        onPress={() =>
          buy.mutate(undefined, {
            onSuccess: () => {
              playSound('complete');
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            },
          })
        }
      />
      {!full && balance < price ? (
        <Text variant="caption" align="center">
          Te faltan {price - balance} Polys. Completá misiones para juntarlos.
        </Text>
      ) : null}
      {buy.isError ? <FormMessage tone="error" message={toUserMessage(buy.error)} /> : null}
    </Card>
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
      accessibilityLabel={`${title}: ${mission.progress} de ${mission.target}${mission.done ? ', completa' : ''}. Da ${POLYS.mission} Polys`}
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

const styles = StyleSheet.create({
  flex: { flex: 1 },
  reward: { gap: spacing.lg },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  flexShrink: { flexShrink: 1 },
  chestIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  chestIconOn: { backgroundColor: colors.goldStrong },
  prize: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  freeze: { gap: spacing.md },
  freezeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 2,
    borderColor: colors.info,
  },
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
});
