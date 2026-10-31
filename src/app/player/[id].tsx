import { router, useLocalSearchParams } from 'expo-router';
import { Ban, Lock, Star, UserX } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { flagEmoji } from '@shared/profile';
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
import { useAuth } from '@/features/auth/AuthProvider';
import { BlockUserButton } from '@/features/blocks/BlockUserButton';
import { useBlockedIds, useUnblockUser } from '@/features/blocks/api';
import { FamilyBadge } from '@/features/profile/components/AchievementBadge';
import { ReportPhotoButton } from '@/features/profile/components/ReportPhotoButton';
import { familyLevels } from '@/features/profile/families';
import { usePublicProfile } from '@/features/profile/hooks';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';

const joinedFormat = new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' });

/** Perfil de otro jugador. La función del servidor decide qué mostrar según su visibilidad. */
export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const player = usePublicProfile(id);
  const { session } = useAuth();
  const blockedIds = useBlockedIds();
  const unblock = useUnblockUser();
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
  if (blockedIds.has(p.id)) {
    return (
      <Screen>
        <ScreenHeader title="Jugador" onBack={back} />
        <EmptyState
          icon={<Ban color={colors.textMuted} size={36} />}
          title={`Bloqueaste a @${p.username}`}
          message="No se cruzan en ranked, no puede entrar a tus desafíos y no ves su perfil."
          actionLabel={unblock.isPending ? 'Desbloqueando…' : 'Desbloquear'}
          onAction={() => unblock.mutate(p.id)}
        />
      </Screen>
    );
  }
  const rating = p.rating;
  const placement = rating ? isInPlacement(rating.games_played) : true;
  const stats = p.stats;
  const games = stats ? stats.wins + stats.losses + stats.draws : 0;
  const flag = flagEmoji(p.region);
  const families = familyLevels(p.achievements?.map((a) => a.id) ?? []);

  return (
    <Screen onRefresh={() => void player.refetch()} refreshing={player.isRefetching}>
      <ScreenHeader title={p.display_name ?? p.username} onBack={back} />

      <View style={styles.identity}>
        <Avatar avatarId={p.avatar_id} photoUrl={avatarPhotoUrl(p.avatar_path)} size={80} />
        <Text color="textMuted">
          {flag ? `${flag} ` : ''}@{p.username} · {p.public_code}
        </Text>
        <Text variant="caption">Desde {joinedFormat.format(new Date(p.created_at))}</Text>
        {p.id !== session?.user.id ? (
          <View style={styles.actions}>
            <ReportPhotoButton
              userId={p.id}
              username={p.username}
              hasPhoto={Boolean(p.avatar_path)}
            />
            <BlockUserButton userId={p.id} username={p.username} />
          </View>
        ) : null}
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
              <StatTile
                label="Estrellas"
                value={String(p.learning.stars_earned ?? 0)}
                icon={<Star color={colors.gold} fill={colors.gold} size={18} />}
                hint={`${p.learning.golden_lessons ?? 0} doradas`}
              />
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
            <Text variant="overline">
              LOGROS · {families.reduce((n, f) => n + f.level, 0)} NIVELES
            </Text>
            {families.length > 0 ? (
              <View style={styles.icons}>
                {families.map(({ family, level, maxLevel }) => (
                  <View
                    key={family.metric}
                    style={styles.badge}
                    accessible
                    accessibilityLabel={`${family.title}, nivel ${level} de ${maxLevel}`}
                  >
                    <FamilyBadge family={family} level={level} size={52} />
                    <Text variant="caption" align="center" numberOfLines={2}>
                      {family.title}
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
  actions: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xl },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  private: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gap: { gap: spacing.sm },
  icons: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  badge: { width: 72, alignItems: 'center', gap: spacing.xs },
});
