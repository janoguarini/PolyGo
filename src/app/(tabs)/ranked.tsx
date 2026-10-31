import { router } from 'expo-router';
import { CalendarDays, Dumbbell, KeyRound, Search, Trophy, UserPlus } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type ScrollViewInstance } from 'react-native';

import {
  Button,
  Card,
  ErrorState,
  LoadingState,
  Screen,
  Text,
  TextField,
  MIN_TOUCH,
  colors,
  radii,
  spacing,
} from '@/design-system';
import { useActiveSeason, useMyProfile } from '@/features/profile/hooks';
import { useMyLeaderboardPosition } from '@/features/ranked/api';
import { useTabPressScroll } from '@/lib/useTabPressScroll';
import { RankCard } from '@/features/ranked/RankCard';

const dateFormat = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' });

export default function RankedScreen() {
  const me = useMyProfile();
  const season = useActiveSeason();
  const position = useMyLeaderboardPosition(null);
  const scrollRef = useRef<ScrollViewInstance>(null);
  useTabPressScroll(scrollRef);

  if (me.isPending) return <LoadingState />;
  if (me.isError || !me.data) return <ErrorState onRetry={() => void me.refetch()} />;

  return (
    <Screen
      scrollRef={scrollRef}
      onRefresh={() => {
        void me.refetch();
        void position.refetch();
      }}
      refreshing={me.isRefetching}
    >
      <View style={styles.titleRow}>
        <Text variant="title">Ranked</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            position.data?.position
              ? `Clasificación: estás en el puesto ${position.data.position} del mundo`
              : 'Clasificación'
          }
          onPress={() => router.push('/leaderboard')}
          style={({ pressed }) => [styles.trophyButton, pressed && styles.pressed]}
        >
          <Trophy color={colors.gold} fill={colors.goldStrong} size={22} />
          <Text variant="bodyStrong" color="gold">
            {position.data?.position ? `#${position.data.position}` : 'Top'}
          </Text>
        </Pressable>
      </View>

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
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  trophyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: MIN_TOUCH,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1.5,
    borderColor: colors.goldStrong,
  },
  pressed: { opacity: 0.75 },
});
