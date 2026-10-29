import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Award, BookOpen, LogOut, Pencil, Shield, Swords } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { TARGET_LANGUAGES } from '@shared/profile';
import { getRank, isInPlacement } from '@shared/ranking';

import {
  Avatar,
  Button,
  Card,
  ErrorState,
  LoadingState,
  RankEmblemForRating,
  Screen,
  SelectCard,
  StatTile,
  Text,
  colors,
  spacing,
} from '@/design-system';
import { signOut } from '@/features/auth/api';
import { FormMessage } from '@/features/auth/FormMessage';
import { LearningStats } from '@/features/learning/components/LearningStats';
import { AchievementsSummary } from '@/features/profile/components/AchievementsSummary';
import { CompetitiveHistory } from '@/features/profile/components/CompetitiveHistory';
import { useMyProfile, useUpdateSettings } from '@/features/profile/hooks';
import type { ProfileVisibility } from '@/lib/database.types';
import { toUserMessage } from '@/lib/errors';

const joinedFormat = new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' });

const VISIBILITY: {
  id: ProfileVisibility;
  title: string;
  description: string;
}[] = [
  { id: 'public', title: 'Público', description: 'Cualquier jugador ve tu perfil y estadísticas.' },
  { id: 'friends', title: 'Sólo amigos', description: 'Se aplicará cuando existan los amigos.' },
  {
    id: 'private',
    title: 'Privado',
    description: 'Los demás sólo ven tu nombre, avatar y rango; no tus estadísticas ni logros.',
  },
];

export default function ProfileScreen() {
  const { data, isPending, isError, refetch, isRefetching } = useMyProfile();
  const updateSettings = useUpdateSettings();
  const logout = useMutation({ mutationFn: signOut });

  if (isPending) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={() => void refetch()} />;
  const { profile, rating, settings } = data;

  const language =
    TARGET_LANGUAGES.find((l) => l.code === profile.target_language)?.name ??
    profile.target_language;
  const games = rating?.games_played ?? 0;
  const winRate = games > 0 && rating ? `${Math.round((rating.wins / games) * 100)}%` : '—';
  const placement = rating ? isInPlacement(rating.games_played) : true;

  return (
    <Screen onRefresh={() => void refetch()} refreshing={isRefetching}>
      <View style={styles.identity}>
        <Avatar avatarId={profile.avatar_id} size={88} />
        <Text variant="title">{profile.display_name ?? profile.username}</Text>
        <Text color="textMuted">
          @{profile.username} · {profile.public_code}
        </Text>
        <Text variant="caption">
          Desde {joinedFormat.format(new Date(profile.created_at))} · Aprende {language}
        </Text>
        <Button
          label="Editar perfil"
          variant="secondary"
          icon={<Pencil color={colors.text} size={16} />}
          onPress={() => router.push('/edit-profile')}
          style={styles.edit}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Swords color={colors.primaryBright} size={20} />
        <Text variant="heading">Competitivo</Text>
      </View>
      {rating ? (
        <>
          <Card style={styles.rankRow}>
            <RankEmblemForRating rating={rating.rating} size={56} dimmed={placement} />
            <View style={styles.flex}>
              <Text variant="bodyStrong">
                {placement ? 'En colocación' : getRank(rating.rating).label}
              </Text>
              <Text variant="caption">
                {rating.rating} ELO · máximo {rating.peak_rating}
              </Text>
            </View>
          </Card>
          <View style={styles.grid}>
            <StatTile label="Partidas" value={String(games)} />
            <StatTile
              label="Victorias"
              value={winRate}
              hint={`${rating.wins}V · ${rating.losses}D · ${rating.draws}E`}
            />
            <StatTile label="Racha actual" value={String(rating.win_streak)} />
            <StatTile label="Mejor racha" value={String(rating.best_win_streak)} />
          </View>
          <CompetitiveHistory />
        </>
      ) : null}

      <View style={styles.sectionHeader}>
        <Award color={colors.gold} size={20} />
        <Text variant="heading">Logros</Text>
      </View>
      <AchievementsSummary />

      <View style={styles.sectionHeader}>
        <BookOpen color={colors.info} size={20} />
        <Text variant="heading">Aprendizaje</Text>
      </View>
      <LearningStats level={profile.start_level} />

      <View style={styles.sectionHeader}>
        <Shield color={colors.success} size={20} />
        <Text variant="heading">Privacidad</Text>
      </View>
      {VISIBILITY.map((option) => (
        <SelectCard
          key={option.id}
          title={option.title}
          description={option.description}
          selected={settings?.profile_visibility === option.id}
          disabled={updateSettings.isPending}
          onPress={() => updateSettings.mutate({ profile_visibility: option.id })}
        />
      ))}
      {updateSettings.isError ? (
        <FormMessage tone="error" message={toUserMessage(updateSettings.error)} />
      ) : null}

      {logout.isError ? <FormMessage tone="error" message={toUserMessage(logout.error)} /> : null}
      <Button
        label="Cerrar sesión"
        variant="danger"
        loading={logout.isPending}
        icon={<LogOut color={colors.danger} size={18} />}
        onPress={() => logout.mutate()}
        style={styles.logout}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  flex: { flex: 1, gap: spacing.xxs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gap: { gap: spacing.sm },
  logout: { marginTop: spacing.xl },
  edit: { marginTop: spacing.sm, alignSelf: 'center', paddingHorizontal: spacing.xl },
});
