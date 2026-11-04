import { CheckCircle2 } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { friendChallengeById } from '@shared/friendChallenges';

import {
  Avatar,
  Button,
  Card,
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
import { useClaimWeeklyChallenge, useWeeklyChallenges, type WeeklyChallengeState } from '../social';

/** Retos de la semana: progreso real, premio en Polys y qué amigos ya los completaron. */
export function WeeklyChallengesCard({ now }: { now: number }) {
  const weekly = useWeeklyChallenges();
  const claim = useClaimWeeklyChallenge();

  if (weekly.isPending)
    return (
      <Card style={styles.center}>
        <ActivityIndicator color={colors.primaryBright} accessibilityLabel="Cargando retos" />
      </Card>
    );
  if (weekly.isError || !weekly.data)
    return (
      <Card style={styles.gap}>
        <Text color="textMuted">No pudimos cargar los retos de la semana.</Text>
        <Button label="Reintentar" variant="secondary" onPress={() => void weekly.refetch()} />
      </Card>
    );

  return (
    <Card style={styles.gap}>
      {weekly.data.challenges.map((c) => (
        <ChallengeRow
          key={c.id}
          challenge={c}
          claiming={claim.isPending && claim.variables === c.id}
          onClaim={() => claim.mutate(c.id)}
        />
      ))}
      {claim.isError ? <FormMessage tone="error" message={toUserMessage(claim.error)} /> : null}
      <Text variant="caption">
        {endsInLabel(weekly.data.ends_at, now)} · se renuevan cada lunes.
      </Text>
    </Card>
  );
}

function ChallengeRow({
  challenge,
  claiming,
  onClaim,
}: {
  challenge: WeeklyChallengeState;
  claiming: boolean;
  onClaim: () => void;
}) {
  const meta = friendChallengeById(challenge.id);
  const done = challenge.progress >= challenge.target;
  const title = meta?.title ?? challenge.id;
  return (
    <View style={styles.challenge}>
      <View style={styles.top}>
        <View style={styles.flex}>
          <Text variant="bodyStrong" color="textStrong">
            {title}
          </Text>
          {meta ? <Text variant="caption">{meta.description}</Text> : null}
        </View>
        <View
          style={styles.reward}
          accessible
          accessibilityLabel={`Premio: ${challenge.reward} Polys`}
        >
          <PolyCoin size={16} />
          <Text variant="bodyStrong" color="gold">
            {challenge.reward}
          </Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.flex}>
          <ProgressBar
            value={challenge.progress / challenge.target}
            colors={done ? gradients.gold : undefined}
            accessibilityLabel={`${title}: ${challenge.progress} de ${challenge.target}`}
          />
        </View>
        <Text variant="caption" color={done ? 'gold' : 'textMuted'}>
          {challenge.progress}/{challenge.target}
        </Text>
      </View>

      {challenge.friends_done > 0 ? <FriendsDone challenge={challenge} /> : null}

      {challenge.claimed ? (
        <View style={styles.claimed}>
          <CheckCircle2 color={colors.success} size={16} />
          <Text variant="caption" color="success">
            Premio cobrado
          </Text>
        </View>
      ) : done ? (
        <Button
          label={`Reclamar ${challenge.reward} Polys`}
          loading={claiming}
          icon={<PolyCoin size={18} />}
          onPress={onClaim}
        />
      ) : null}
    </View>
  );
}

function FriendsDone({ challenge }: { challenge: WeeklyChallengeState }) {
  const [first] = challenge.friends;
  const others = challenge.friends_done - 1;
  return (
    <View style={styles.friends}>
      <View style={styles.stack}>
        {challenge.friends.slice(0, 3).map((f, i) => (
          <View key={f.user_id} style={[styles.stackItem, i > 0 && styles.overlap]}>
            <Avatar avatarId={f.avatar_id} photoUrl={avatarPhotoUrl(f.avatar_path)} size={22} />
          </View>
        ))}
      </View>
      <Text variant="caption" style={styles.flex}>
        {first ? `${first.username}${others > 0 ? ` y ${others} más` : ''}` : ''}{' '}
        {challenge.friends_done === 1 ? 'ya lo completó' : 'ya lo completaron'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  gap: { gap: spacing.lg },
  challenge: { gap: spacing.sm },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceHighlight,
  },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  friends: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stack: { flexDirection: 'row' },
  stackItem: { borderRadius: radii.pill, borderWidth: 2, borderColor: colors.surface },
  overlap: { marginLeft: -8 },
  claimed: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
