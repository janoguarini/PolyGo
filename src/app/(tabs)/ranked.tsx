import { router } from 'expo-router';
import {
  CalendarDays,
  Dumbbell,
  KeyRound,
  Search,
  Star,
  Trophy,
  UserPlus,
} from 'lucide-react-native';
import { useState } from 'react';
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
  TextField,
  colors,
  spacing,
} from '@/design-system';
import { useAuth } from '@/features/auth/AuthProvider';
import { useBlockedIds } from '@/features/blocks/api';
import { useActiveSeason, useMyProfile } from '@/features/profile/hooks';
import { useLeaderboard, useLeaderboardStars } from '@/features/ranked/api';
import { RankCard } from '@/features/ranked/RankCard';
import { avatarPhotoUrl } from '@/lib/avatarPhoto';

const dateFormat = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' });

export default function RankedScreen() {
  const { session } = useAuth();
  const me = useMyProfile();
  const season = useActiveSeason();
  const leaderboard = useLeaderboard(me.data?.profile.target_language);
  const stars = useLeaderboardStars(leaderboard.data?.map((e) => e.userId));
  const blockedIds = useBlockedIds();

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
        <Button
          label="Buscar partida"
          size="lg"
          icon={<Search color={colors.onPrimary} size={20} />}
          accessibilityHint="Busca un rival con un ELO similar"
          onPress={() => router.push({ pathname: '/battle', params: { mode: 'ranked' } })}
        />
        <Button
          label="Practicar sin ELO"
          variant="ghost"
          icon={<Dumbbell color={colors.textMuted} size={18} />}
          accessibilityHint="Una ronda de 75 segundos contra el reloj, sin rival"
          onPress={() => router.push({ pathname: '/battle', params: { mode: 'practice' } })}
        />
      </Card>

      <FriendChallengeCard />

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
            // Los bloqueados no se muestran; el resto conserva su puesto real.
            if (blockedIds.has(entry.userId)) return null;
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
                <Avatar
                  avatarId={entry.avatarId}
                  photoUrl={avatarPhotoUrl(entry.avatarPath)}
                  size={32}
                />
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

const CODE_PATTERN = /^[A-Z0-9]{6}$/;

/** Desafío a un amigo: crear un código o entrar con el de otro. Amistoso, sin ELO. */
function FriendChallengeCard() {
  const [joining, setJoining] = useState(false);
  const [code, setCode] = useState('');
  const clean = code.trim().toUpperCase();
  const valid = CODE_PATTERN.test(clean);

  return (
    <Card style={styles.matchCard}>
      <Text variant="overline">JUGAR CON UN AMIGO</Text>
      <Text color="textMuted">
        Mandale un código y juegan la misma partida en vivo. Amistoso: no mueve el ELO.
      </Text>
      {joining ? (
        <>
          <TextField
            label="Código del desafío"
            value={code}
            onChangeText={(t) => setCode(t.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6))}
            autoCapitalize="characters"
            autoCorrect={false}
            autoFocus
            placeholder="ABC234"
            returnKeyType="go"
            onSubmitEditing={() => {
              if (valid) router.push({ pathname: '/battle', params: { code: clean } });
            }}
          />
          <Button
            label="Entrar al desafío"
            disabled={!valid}
            onPress={() => router.push({ pathname: '/battle', params: { code: clean } })}
          />
          <Button label="Volver" variant="ghost" onPress={() => setJoining(false)} />
        </>
      ) : (
        <>
          <Button
            label="Desafiar a un amigo"
            variant="secondary"
            icon={<UserPlus color={colors.text} size={20} />}
            accessibilityHint="Crea un código para compartir con un amigo"
            onPress={() => router.push({ pathname: '/battle', params: { challenge: 'host' } })}
          />
          <Button
            label="Tengo un código"
            variant="ghost"
            icon={<KeyRound color={colors.textMuted} size={18} />}
            onPress={() => setJoining(true)}
          />
        </>
      )}
    </Card>
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
