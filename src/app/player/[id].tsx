import { router, useLocalSearchParams } from 'expo-router';
import { Ban, Lock, Star, UserX } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import {
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
  ScreenHeader,
  StatTile,
  Text,
  colors,
  spacing,
  useTheme,
} from '@/design-system';
import { useAuth } from '@/features/auth/AuthProvider';
import { BlockUserButton } from '@/features/blocks/BlockUserButton';
import { useBlockedIds, useUnblockUser } from '@/features/blocks/api';
import { FriendButton } from '@/features/friends/FriendButton';
import { FamilyBadge } from '@/features/profile/components/AchievementBadge';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ReportPhotoButton } from '@/features/profile/components/ReportPhotoButton';
import { familyLevels } from '@/features/profile/families';
import { usePublicProfile } from '@/features/profile/hooks';

const joinedFormat = new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' });

/**
 * Perfil de otro jugador, con el mismo formato que el propio: encabezado con avatar, nombre y rango
 * sobre su fondo, y debajo secciones. La función del servidor decide qué mostrar según su
 * visibilidad.
 */
export default function PlayerScreen() {
  useTheme();
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
  const stats = p.stats;
  const games = stats ? stats.wins + stats.losses + stats.draws : 0;
  const families = familyLevels(p.achievements?.map((a) => a.id) ?? []);
  const isOther = p.id !== session?.user.id;

  return (
    <Screen onRefresh={() => void player.refetch()} refreshing={player.isRefetching}>
      <ScreenHeader title="Perfil" onBack={back} />

      <ProfileHeader
        profile={p}
        // Sin estadísticas (perfil privado) no se sabe si ganó alguna: se muestra sin posicionar.
        rating={p.rating ? { rating: p.rating.rating, wins: stats?.wins ?? 0 } : null}
        readonly
      />

      <View style={styles.meta}>
        <Text variant="caption" align="center">
          {p.public_code} · Desde {joinedFormat.format(new Date(p.created_at))}
        </Text>
        {isOther ? (
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

      {p.friendship && p.friendship !== 'self' ? (
        <FriendButton userId={p.id} username={p.username} state={p.friendship} />
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
            <>
              <SectionHeader title="Competitivo" />
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
                <StatTile label="ELO máximo" value={String(stats.peak_rating)} />
              </View>
            </>
          ) : null}

          {p.learning ? (
            <>
              <SectionHeader title="Aprendizaje" />
              <View style={styles.grid}>
                <StatTile
                  label="Estrellas"
                  value={String(p.learning.stars_earned ?? 0)}
                  icon={<Star color={colors.gold} fill={colors.gold} size={18} />}
                  hint={`${p.learning.golden_lessons ?? 0} doradas`}
                />
                <StatTile label="Lecciones" value={String(p.learning.lessons_completed)} />
                {typeof p.learning.concepts_mastered === 'number' ? (
                  <StatTile
                    label="Dominadas"
                    value={String(p.learning.concepts_mastered)}
                    hint="según su evidencia"
                  />
                ) : null}
                <StatTile
                  label="Racha récord"
                  value={`${p.learning.best_streak_days} d`}
                  hint="días de estudio"
                />
              </View>
            </>
          ) : null}

          <SectionHeader title={`Logros · ${families.reduce((n, f) => n + f.level, 0)} niveles`} />
          <Card style={styles.gap}>
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

/** Título de sección, igual que en el perfil propio. */
function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.section}>
      <Text variant="heading">{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  meta: { alignItems: 'center', gap: spacing.xs },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xl },
  private: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xxs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gap: { gap: spacing.sm },
  icons: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  badge: { width: 72, alignItems: 'center', gap: spacing.xs },
  section: { marginTop: spacing.sm },
});
