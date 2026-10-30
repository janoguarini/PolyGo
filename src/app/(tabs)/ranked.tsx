import { router } from 'expo-router';
import { CalendarDays, Dumbbell, Search, Star, Trophy } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Avatar,
  Button,
  Card,
  ErrorState,
  LoadingState,
  RankEmblemForRating,
  Screen,
  Text,
  colors,
  spacing,
} from '@/design-system';
import { useAuth } from '@/features/auth/AuthProvider';
import { battleServerConfigured } from '@/features/battle/client';
import { useActiveSeason, useMyProfile } from '@/features/profile/hooks';
import { useLeaderboard, useLeaderboardStars } from '@/features/ranked/api';
import { RankCard } from '@/features/ranked/RankCard';

const dateFormat = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' });

export default function RankedScreen() {
  const { session } = useAuth();
  const me = useMyProfile();
  const season = useActiveSeason();
  const leaderboard = useLeaderboard(me.data?.profile.target_language);
  const stars = useLeaderboardStars(leaderboard.data?.map((e) => e.userId));
  // Sin URL del servidor de partidas el botón no puede quedar activo sin hacer nada.
  const battleServerReady = battleServerConfigured;

  if (me.isPending) return <LoadingState />;
  if (me.isError || !me.data) return <ErrorState onRetry={() => void me.refetch()} />;

  return (
    <Screen
      onRefresh={() => {
        void me.refetch();
        void leaderboard.refetch();
      }}
      refreshing={me.isRefetching || leaderboard.isRefetching}
    >
      <Text variant="title">Ranked</Text>

      {season.data ? (
        <View style={styles.season}>
          <CalendarDays color={colors.textMuted} size={16} />
          <Text variant="caption">
            {season.data.name} · termina el {dateFormat.format(new Date(season.data.ends_at))}
          </Text>
        </View>
      ) : null}

      {me.data.rating ? <RankCard rating={me.data.rating} /> : null}

      <Card style={styles.matchCard}>
        <Text variant="overline">MODO · WORD RUSH</Text>
        <Text color="textMuted">
          1 contra 1 · preguntas de vocabulario idénticas para ambos jugadores · el servidor valida
          cada respuesta.
        </Text>
        <Button
          label="Buscar partida"
          size="lg"
          disabled={!battleServerReady}
          icon={<Search color={colors.onPrimary} size={20} />}
          accessibilityHint="Busca un rival con un ELO similar"
          onPress={() => router.push({ pathname: '/battle', params: { mode: 'ranked' } })}
        />
        <Button
          label="Practicar sin ELO"
          variant="ghost"
          disabled={!battleServerReady}
          icon={<Dumbbell color={colors.textMuted} size={18} />}
          accessibilityHint="Una ronda de 75 segundos contra el reloj, sin rival"
          onPress={() => router.push({ pathname: '/battle', params: { mode: 'practice' } })}
        />
        {!battleServerReady ? (
          <Text variant="caption" align="center">
            El servidor de partidas no está configurado (EXPO_PUBLIC_BATTLE_SERVER_URL). No
            mostramos rivales simulados.
          </Text>
        ) : null}
      </Card>

      <View style={styles.sectionHeader}>
        <Trophy color={colors.gold} size={20} />
        <Text variant="heading">Clasificación global</Text>
      </View>

      {leaderboard.isPending ? (
        <LoadingState label="Cargando clasificación…" />
      ) : leaderboard.isError ? (
        <ErrorState
          message="No pudimos cargar la clasificación."
          onRetry={() => void leaderboard.refetch()}
        />
      ) : (
        <Card style={styles.list}>
          {leaderboard.data.map((entry, index) => {
            const isMe = entry.userId === session?.user.id;
            const entryStars = stars.data?.[entry.userId];
            return (
              <Pressable
                key={entry.userId}
                style={({ pressed }) => [
                  styles.entry,
                  isMe && styles.entryMe,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Puesto ${index + 1}, ${entry.username}, ${entry.rating} ELO${entryStars !== undefined ? `, ${entryStars} estrellas` : ''}`}
                accessibilityHint="Abre el perfil del jugador"
                onPress={() =>
                  isMe
                    ? router.navigate('/profile')
                    : router.push({ pathname: '/player/[id]', params: { id: entry.userId } })
                }
              >
                <Text
                  variant="bodyStrong"
                  color={index < 3 ? 'gold' : 'textMuted'}
                  style={styles.position}
                >
                  {index + 1}
                </Text>
                <Avatar avatarId={entry.avatarId} size={32} />
                <Text variant="bodyStrong" numberOfLines={1} style={styles.name}>
                  {entry.username}
                  {isMe ? ' (vos)' : ''}
                </Text>
                {entryStars !== undefined ? (
                  <View style={styles.stars}>
                    <Star color={colors.gold} fill={colors.gold} size={14} />
                    <Text variant="caption" color="gold">
                      {entryStars}
                    </Text>
                  </View>
                ) : null}
                <RankEmblemForRating rating={entry.rating} size={26} />
                <Text variant="bodyStrong" color="text">
                  {entry.rating}
                </Text>
              </Pressable>
            );
          })}
          {leaderboard.data.length === 0 ? (
            <Text color="textMuted">Todavía no hay jugadores.</Text>
          ) : null}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  season: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: -spacing.sm },
  matchCard: { gap: spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  list: { gap: spacing.xs, paddingVertical: spacing.sm },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  entryMe: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 10,
    marginHorizontal: -spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  pressed: { opacity: 0.75 },
  position: { width: 24, textAlign: 'center' },
  name: { flex: 1 },
  stars: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
});
