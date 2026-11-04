import { BookOpen, CheckCircle2, Clock, Swords, Users } from 'lucide-react-native';
import { Fragment, useEffect, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { friendChallengeById } from '@shared/friendChallenges';

import {
  Avatar,
  Button,
  Card,
  MIN_TOUCH,
  PolyCoin,
  ProgressBar,
  Text,
  colors,
  gradients,
  radii,
  spacing,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';
import { toUserMessage } from '@/lib/errors';

import { endsInLabel } from '../format';
import { useClaimFriendMission, useFriendDailyMissions, type FriendMissionState } from '../social';
import { IconTile } from './IconTile';

const ICON_SIZE = 18;
const MISSION_ICON: Record<string, ReactNode> = {
  play_3: <Swords color={colors.primarySoft} size={ICON_SIZE} />,
  review_20: <BookOpen color={colors.primarySoft} size={ICON_SIZE} />,
  friendly_1: <Users color={colors.primarySoft} size={ICON_SIZE} />,
};

/** Misiones diarias de Amigos: progreso real, premio en Polys y qué amigos ya las completaron. */
export function DailyMissionsCard({ now }: { now: number }) {
  const missions = useFriendDailyMissions();
  const claim = useClaimFriendMission();

  // Pasada la medianoche, las de ayer ya no valen: se vuelven a pedir.
  const stale = missions.data ? now >= missions.data.ends_at : false;
  const { refetch } = missions;
  useEffect(() => {
    if (stale) void refetch();
  }, [stale, refetch]);

  if (missions.isPending)
    return (
      <Card style={styles.center}>
        <ActivityIndicator color={colors.primaryBright} accessibilityLabel="Cargando misiones" />
      </Card>
    );
  if (missions.isError || !missions.data)
    return (
      <Card style={styles.card}>
        <Text color="textMuted">No pudimos cargar las misiones de hoy.</Text>
        <Button label="Reintentar" variant="secondary" onPress={() => void missions.refetch()} />
      </Card>
    );

  return (
    <Card style={styles.card}>
      {missions.data.challenges.map((c, i) => (
        <Fragment key={c.id}>
          {i > 0 ? <View style={styles.divider} /> : null}
          <MissionRow
            mission={c}
            claiming={claim.isPending && claim.variables === c.id}
            onClaim={() => claim.mutate(c.id)}
          />
        </Fragment>
      ))}
      {claim.isError ? <FormMessage tone="error" message={toUserMessage(claim.error)} /> : null}
      <View style={styles.footer}>
        <Clock color={colors.textMuted} size={14} />
        <Text variant="caption">{endsInLabel(missions.data.ends_at, now)} · nuevas cada día.</Text>
      </View>
    </Card>
  );
}

function MissionRow({
  mission,
  claiming,
  onClaim,
}: {
  mission: FriendMissionState;
  claiming: boolean;
  onClaim: () => void;
}) {
  const meta = friendChallengeById(mission.id);
  const done = mission.progress >= mission.target;
  const title = meta?.title ?? mission.id;
  const claimable = done && !mission.claimed;
  return (
    <View style={styles.row}>
      <IconTile size={36}>
        {mission.claimed ? (
          <CheckCircle2 color={colors.success} size={ICON_SIZE} />
        ) : (
          (MISSION_ICON[mission.id] ?? <Swords color={colors.primarySoft} size={ICON_SIZE} />)
        )}
      </IconTile>
      <View style={styles.body}>
        <Text
          variant="bodyStrong"
          color={mission.claimed ? 'textMuted' : 'textStrong'}
          numberOfLines={1}
          style={styles.title}
          accessibilityHint={meta?.description}
        >
          {title}
        </Text>
        <View style={styles.progressRow}>
          <View style={styles.flex}>
            <ProgressBar
              value={mission.progress / mission.target}
              height={6}
              colors={done ? gradients.gold : undefined}
              accessibilityLabel={`${title}: ${mission.progress} de ${mission.target}`}
            />
          </View>
          <Text variant="caption" color={done ? 'gold' : 'textMuted'} style={styles.count}>
            {mission.progress}/{mission.target}
          </Text>
        </View>
        {mission.friends_done > 0 ? <FriendsDone mission={mission} /> : null}
      </View>
      <Reward mission={mission} claimable={claimable} claiming={claiming} onClaim={onClaim} />
    </View>
  );
}

/** Premio: pastilla con los Polys; si está lista para cobrar, se vuelve botón dorado. */
function Reward({
  mission,
  claimable,
  claiming,
  onClaim,
}: {
  mission: FriendMissionState;
  claimable: boolean;
  claiming: boolean;
  onClaim: () => void;
}) {
  if (claimable)
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Reclamar ${mission.reward} Polys`}
        accessibilityState={{ busy: claiming }}
        disabled={claiming}
        onPress={onClaim}
        hitSlop={6}
        style={({ pressed }) => [styles.reward, styles.claim, pressed && styles.pressed]}
      >
        {claiming ? (
          <ActivityIndicator color={colors.backgroundDeep} size="small" />
        ) : (
          <>
            <PolyCoin size={14} />
            <Text variant="caption" style={styles.claimText}>
              +{mission.reward}
            </Text>
          </>
        )}
      </Pressable>
    );
  return (
    <View
      style={[styles.reward, mission.claimed && styles.rewardClaimed]}
      accessible
      accessibilityLabel={mission.claimed ? 'Premio cobrado' : `Premio: ${mission.reward} Polys`}
    >
      <PolyCoin size={14} />
      <Text variant="caption" color={mission.claimed ? 'textMuted' : 'gold'} style={styles.bold}>
        {mission.reward}
      </Text>
    </View>
  );
}

function FriendsDone({ mission }: { mission: FriendMissionState }) {
  const [first] = mission.friends;
  const others = mission.friends_done - 1;
  return (
    <View style={styles.friends}>
      <View style={styles.stack}>
        {mission.friends.slice(0, 3).map((f, i) => (
          <View key={f.user_id} style={[styles.stackItem, i > 0 && styles.overlap]}>
            <Avatar avatarId={f.avatar_id} photoUrl={avatarPhotoUrl(f.avatar_path)} size={18} />
          </View>
        ))}
      </View>
      <Text variant="caption" numberOfLines={1} style={styles.flex}>
        {first ? `${first.username}${others > 0 ? ` y ${others} más` : ''}` : ''}{' '}
        {mission.friends_done === 1 ? 'ya la completó' : 'ya la completaron'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  card: {
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  body: { flex: 1, gap: spacing.xs },
  title: { fontSize: 15, lineHeight: 20 },
  flex: { flex: 1 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  count: { minWidth: 34, textAlign: 'right' },
  divider: { height: 1, backgroundColor: colors.border },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    minWidth: 52,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  rewardClaimed: { opacity: 0.6 },
  claim: {
    minHeight: MIN_TOUCH - 12,
    backgroundColor: colors.gold,
    borderColor: colors.goldStrong,
  },
  claimText: { color: colors.backgroundDeep, fontWeight: '800' },
  bold: { fontWeight: '700' },
  pressed: { opacity: 0.75 },
  friends: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  stack: { flexDirection: 'row' },
  stackItem: { borderRadius: radii.pill, borderWidth: 2, borderColor: colors.surface },
  overlap: { marginLeft: -6 },
});
