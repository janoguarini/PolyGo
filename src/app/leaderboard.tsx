import { router } from 'expo-router';
import { Globe2, Trophy } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { LANGUAGES } from '@shared/languages';

import {
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
  ScreenHeader,
  Text,
  colors,
  gradients,
  radii,
  spacing,
} from '@/design-system';
import { useAuth } from '@/features/auth/AuthProvider';
import { useBlockedIds } from '@/features/blocks/api';
import { useActiveSeason, useMyProfile } from '@/features/profile/hooks';
import {
  useLeaderboard,
  useLeaderboardStars,
  useMyLeaderboardPosition,
  type LeaderboardEntry,
} from '@/features/ranked/api';
import { LeaderboardRow, Podium, topPercent } from '@/features/ranked/Leaderboard';

/** Pestañas: global (suma de los idiomas) y una por idioma con Ranked. */
const SCOPES = [
  { code: null, label: 'Todos', flag: null },
  ...LANGUAGES.filter((l) => l.ranked).map((l) => ({
    code: l.code as string | null,
    label: l.name,
    flag: l.flag as string | null,
  })),
];

export default function LeaderboardScreen() {
  const { session } = useAuth();
  const meId = session?.user.id;
  const me = useMyProfile();
  const season = useActiveSeason();
  const [scope, setScope] = useState<string | null>(null);
  const leaderboard = useLeaderboard(scope);
  const position = useMyLeaderboardPosition(scope);
  const blockedIds = useBlockedIds();

  // Los bloqueados no se muestran; el resto conserva su puesto real.
  const entries = (leaderboard.data ?? []).filter((e) => !blockedIds.has(e.userId));
  const stars = useLeaderboardStars(leaderboard.data?.map((e) => e.userId));
  const podium = entries.filter((e) => e.position <= 3);
  const rest = entries.filter((e) => e.position > 3);
  const scopeLabel =
    scope === null ? 'del mundo' : `en ${SCOPES.find((s) => s.code === scope)?.label}`;

  const myPos = position.data?.position ?? null;
  const inList = entries.some((e) => e.userId === meId);
  // Si no entrás en la lista, tu fila queda fija abajo.
  const myRow: LeaderboardEntry | null =
    myPos !== null && !inList && position.data?.rating != null && me.data && meId
      ? {
          userId: meId,
          username: me.data.profile.username ?? '',
          avatarId: me.data.profile.avatar_id,
          avatarPath: me.data.profile.avatar_path,
          frameId: me.data.profile.frame_id,
          region: me.data.profile.region,
          languageCode: scope,
          rating: position.data.rating,
          gamesPlayed: position.data.gamesPlayed,
          wins: position.data.wins,
          position: myPos,
        }
      : null;

  return (
    <Screen
      onRefresh={() => {
        void leaderboard.refetch();
        void position.refetch();
      }}
      refreshing={leaderboard.isRefetching}
      footer={myRow ? <LeaderboardRow entry={myRow} isMe /> : undefined}
    >
      <ScreenHeader title="Clasificación" onBack={() => router.back()} />

      <Card gradient={gradients.ranked} style={styles.hero}>
        <View style={styles.trophy}>
          <Trophy color={colors.gold} fill={colors.goldStrong} size={40} />
        </View>
        <View style={styles.heroInfo}>
          <Text variant="overline" color="primarySoft">
            {season.data ? season.data.name.toUpperCase() : 'TU PUESTO'}
          </Text>
          {position.isPending ? (
            <Text variant="title">…</Text>
          ) : myPos !== null ? (
            <>
              <Text variant="title" color="gold">
                Top {myPos} {scopeLabel}
              </Text>
              <Text variant="caption" color="text">
                {`Puesto ${myPos} de ${position.data?.total ?? 0} · top ${topPercent(myPos, position.data?.total ?? 0)} %`}
              </Text>
            </>
          ) : (
            <>
              <Text variant="heading">Sin posicionar</Text>
              <Text variant="caption" color="text">
                Ganá una ranked para entrar a la clasificación.
              </Text>
            </>
          )}
        </View>
      </Card>

      {scope === null ? (
        <Text variant="caption" color="textMuted">
          La global suma tu ELO de cada idioma en el que ya estás posicionado.
        </Text>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
        accessibilityRole="tablist"
      >
        {SCOPES.map((s) => {
          const active = s.code === scope;
          return (
            <Pressable
              key={s.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => setScope(s.code)}
              style={[styles.tab, active && styles.tabActive]}
            >
              {s.flag ? (
                <Text style={styles.tabFlag}>{s.flag}</Text>
              ) : (
                <Globe2 color={active ? colors.onPrimary : colors.textMuted} size={16} />
              )}
              <Text variant="bodyStrong" color={active ? 'onPrimary' : 'textMuted'}>
                {s.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {leaderboard.isPending ? (
        <LoadingState label="Cargando clasificación…" />
      ) : leaderboard.isError ? (
        <ErrorState
          message="No pudimos cargar la clasificación."
          onRetry={() => void leaderboard.refetch()}
        />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<Trophy color={colors.textMuted} size={36} />}
          title="Todavía no hay jugadores"
          message="Ganá una ranked y estrená la clasificación."
        />
      ) : (
        <>
          {podium.length > 0 ? <Podium entries={podium} meId={meId} /> : null}
          <View style={styles.list}>
            {rest.map((entry) => (
              <LeaderboardRow
                key={entry.userId}
                entry={entry}
                isMe={entry.userId === meId}
                stars={stars.data?.[entry.userId]}
              />
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  trophy: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 197, 66, 0.16)',
    borderWidth: 2,
    borderColor: colors.goldStrong,
  },
  heroInfo: { flex: 1, gap: spacing.xxs },
  tabs: {
    flexDirection: 'row',
    padding: spacing.xs,
    gap: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 40,
    borderRadius: radii.pill,
  },
  tabActive: { backgroundColor: colors.primary },
  tabFlag: { fontSize: 16, lineHeight: 20 },
  list: { gap: spacing.xs },
});
