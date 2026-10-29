import { router, useLocalSearchParams } from 'expo-router';
import { Lock, UserX } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { getRank, isInPlacement } from '@shared/ranking';

import {
  Avatar,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  RankEmblemForRating,
  Screen,
  ScreenHeader,
  StatTile,
  Text,
  colors,
  spacing,
} from '@/design-system';
import { AchievementIcon } from '@/features/profile/components/AchievementBadge';
import { usePublicProfile } from '@/features/profile/hooks';

const joinedFormat = new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' });

/** Perfil de otro jugador. La función del servidor decide qué mostrar según su visibilidad. */
export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const player = usePublicProfile(id);
  const back = () => router.back();

  if (player.isPending) return <LoadingState />;
  if (player.isError) return <ErrorState onRetry={() => void player.refetch()} />;
  if (!player.data)
    return (
      <Screen>
        <ScreenHeader title="Jugador" onBack={back} />
        <EmptyState
          icon={<UserX color={colors.textMuted} size={36} />}
          title="Jugador no encontrado"
          message="Puede que haya borrado su cuenta."
        />
      </Screen>
    );

  const p = player.data;
  const rating = p.rating;
  const placement = rating ? isInPlacement(rating.games_played) : true;
  const stats = p.stats;
  const games = stats ? stats.wins + stats.losses + stats.draws : 0;

  return (
    <Screen onRefresh={() => void player.refetch()} refreshing={player.isRefetching}>
      <ScreenHeader title={p.display_name ?? p.username} onBack={back} />

      <View style={styles.identity}>
        <Avatar avatarId={p.avatar_id} size={80} />
        <Text color="textMuted">
          @{p.username} · {p.public_code}
        </Text>
        <Text variant="caption">Desde {joinedFormat.format(new Date(p.created_at))}</Text>
      </View>

      {rating ? (
        <Card style={styles.rankRow}>
          <RankEmblemForRating rating={rating.rating} size={56} dimmed={placement} />
          <View style={styles.flex}>
            <Text variant="bodyStrong">
              {placement ? 'En colocación' : getRank(rating.rating).label}
            </Text>
            <Text variant="caption">
              {rating.rating} ELO{stats ? ` · máximo ${stats.peak_rating}` : ''}
            </Text>
          </View>
        </Card>
      ) : null}

      {!p.is_public ? (
        <Card style={styles.private}>
          <Lock color={colors.textMuted} size={20} />
          <Text color="textMuted" style={styles.flex}>
            Este perfil es privado: sólo se muestran el nombre, el avatar y el rango.
          </Text>
        </Card>
      ) : (
        <>
          {stats ? (
            <View style={styles.grid}>
              <StatTile label="Partidas" value={String(games)} />
              <StatTile
                label="Victorias"
                value={games > 0 ? `${Math.round((stats.wins / games) * 100)}%` : '—'}
                hint={`${stats.wins}V · ${stats.losses}D · ${stats.draws}E`}
              />
              <StatTile
                label="Mejor racha"
                value={String(stats.best_win_streak)}
                hint="victorias"
              />
            </View>
          ) : null}
          {p.learning ? (
            <View style={styles.grid}>
              <StatTile label="Lecciones" value={String(p.learning.lessons_completed)} />
              <StatTile
                label="Dominadas"
                value={String(p.learning.words_mastered)}
                hint="palabras"
              />
              <StatTile
                label="Racha récord"
                value={`${p.learning.best_streak_days} d`}
                hint="días de estudio"
              />
            </View>
          ) : null}
          <Card style={styles.gap}>
            <Text variant="overline">LOGROS · {p.achievements?.length ?? 0}</Text>
            {p.achievements && p.achievements.length > 0 ? (
              <View style={styles.icons}>
                {p.achievements.map((a) => (
                  <View key={a.id} style={styles.badge} accessible accessibilityLabel={a.title}>
                    <AchievementIcon icon={a.icon} unlocked />
                    <Text variant="caption" align="center" numberOfLines={2}>
                      {a.title}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text color="textMuted">Todavía no desbloqueó logros.</Text>
            )}
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center', gap: spacing.xs },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  private: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gap: { gap: spacing.sm },
  icons: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  badge: { width: 72, alignItems: 'center', gap: spacing.xs },
});
