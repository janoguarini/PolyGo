import { router } from 'expo-router';
import { Check, ChevronDown, Globe2, Trophy } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

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
  themedStyles,
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
import { useInterfaceLanguage, useStrings } from '@/i18n';
import { languageName } from '@/i18n/languages';
import { leaderboardScreenStrings } from '@/i18n/screens/leaderboard';

/** Idiomas con clasificación propia (los que tienen Ranked). */
const RANKED_LANGUAGES = LANGUAGES.filter((l) => l.ranked);

export default function LeaderboardScreen() {
  const styles = useStyles();
  const t = useStrings(leaderboardScreenStrings);
  const ui = useInterfaceLanguage();
  const { session } = useAuth();
  const meId = session?.user.id;
  const me = useMyProfile();
  const season = useActiveSeason();
  const [scope, setScope] = useState<string | null>(null);
  // Idioma de la segunda pestaña: el que estás aprendiendo, hasta que elijas otro.
  const [pickedLanguage, setPickedLanguage] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const target = me.data?.profile.target_language;
  const languageCode =
    pickedLanguage ??
    (RANKED_LANGUAGES.some((l) => l.code === target) ? target : RANKED_LANGUAGES[0]?.code) ??
    null;
  const language = RANKED_LANGUAGES.find((l) => l.code === languageCode);

  const leaderboard = useLeaderboard(scope);
  const position = useMyLeaderboardPosition(scope);
  const blockedIds = useBlockedIds();

  // Los bloqueados no se muestran; el resto conserva su puesto real.
  const entries = (leaderboard.data ?? []).filter((e) => !blockedIds.has(e.userId));
  const stars = useLeaderboardStars(leaderboard.data?.map((e) => e.userId));
  const podium = entries.filter((e) => e.position <= 3);
  const rest = entries.filter((e) => e.position > 3);
  const scopeLabel = scope === null ? t.worldScope : t.languageScope(languageName(scope, ui));

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

  const languageActive = scope !== null;

  return (
    <Screen
      onRefresh={() => {
        void leaderboard.refetch();
        void position.refetch();
      }}
      refreshing={leaderboard.isRefetching}
      footer={myRow ? <LeaderboardRow entry={myRow} isMe /> : undefined}
    >
      <ScreenHeader title={t.title} onBack={() => router.back()} />

      <Card gradient={gradients.ranked} style={styles.hero}>
        <View style={styles.trophy}>
          <Trophy color={colors.gold} fill={colors.goldStrong} size={40} />
        </View>
        <View style={styles.heroInfo}>
          <Text variant="overline" color="primarySoft">
            {season.data ? season.data.name.toUpperCase() : t.yourPosition}
          </Text>
          {position.isPending ? (
            <Text variant="title">…</Text>
          ) : myPos !== null ? (
            <>
              <Text variant="title" color="gold">
                {t.topIn(myPos, scopeLabel)}
              </Text>
              <Text variant="caption" color="text">
                {t.positionOf(
                  myPos,
                  position.data?.total ?? 0,
                  topPercent(myPos, position.data?.total ?? 0),
                )}
              </Text>
            </>
          ) : (
            <>
              <Text variant="heading">{t.unplaced}</Text>
              <Text variant="caption" color="text">
                {t.winToEnter}
              </Text>
            </>
          )}
        </View>
      </Card>

      <View style={styles.tabs} accessibilityRole="tablist">
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: !languageActive }}
          onPress={() => {
            setScope(null);
            setPickerOpen(false);
          }}
          style={[styles.tab, !languageActive && styles.tabActive]}
        >
          <Globe2 color={!languageActive ? colors.onPrimary : colors.textMuted} size={16} />
          <Text variant="bodyStrong" color={!languageActive ? 'onPrimary' : 'textMuted'}>
            {t.all}
          </Text>
        </Pressable>
        {language ? (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: languageActive, expanded: pickerOpen }}
            accessibilityHint={t.pickLanguageHint}
            onPress={() => {
              if (!languageActive) setScope(language.code);
              else setPickerOpen((open) => !open);
            }}
            style={[styles.tab, languageActive && styles.tabActive]}
          >
            <Text style={styles.tabFlag}>{language.flag}</Text>
            <Text
              variant="bodyStrong"
              color={languageActive ? 'onPrimary' : 'textMuted'}
              numberOfLines={1}
              style={styles.shrink}
            >
              {languageName(language.code, ui)}
            </Text>
            <ChevronDown
              color={languageActive ? colors.onPrimary : colors.textMuted}
              size={16}
              style={pickerOpen ? styles.chevronOpen : undefined}
            />
          </Pressable>
        ) : null}
      </View>

      {pickerOpen ? (
        <View style={styles.picker} accessibilityRole="menu">
          {RANKED_LANGUAGES.map((l) => {
            const selected = l.code === languageCode;
            return (
              <Pressable
                key={l.code}
                accessibilityRole="menuitem"
                accessibilityState={{ selected }}
                onPress={() => {
                  setPickedLanguage(l.code);
                  setScope(l.code);
                  setPickerOpen(false);
                }}
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
              >
                <Text style={styles.tabFlag}>{l.flag}</Text>
                <Text
                  variant="bodyStrong"
                  color={selected ? 'text' : 'textMuted'}
                  style={styles.optionLabel}
                >
                  {languageName(l.code, ui)}
                </Text>
                {selected ? <Check color={colors.primary} size={18} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {!languageActive ? (
        <Text variant="caption" color="textMuted">
          {t.globalNote}
        </Text>
      ) : null}

      {leaderboard.isPending ? (
        <LoadingState label={t.loading} />
      ) : leaderboard.isError ? (
        <ErrorState message={t.loadError} onRetry={() => void leaderboard.refetch()} />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<Trophy color={colors.textMuted} size={36} />}
          title={t.emptyTitle}
          message={t.emptyBody}
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
                languageName={
                  languageActive
                    ? undefined
                    : entry.languageCode &&
                        RANKED_LANGUAGES.some((l) => l.code === entry.languageCode)
                      ? languageName(entry.languageCode, ui)
                      : undefined
                }
              />
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
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
      flex: 1,
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      height: 40,
      borderRadius: radii.pill,
    },
    tabActive: { backgroundColor: colors.primary },
    tabFlag: { fontSize: 16, lineHeight: 20 },
    shrink: { flexShrink: 1 },
    chevronOpen: { transform: [{ rotate: '180deg' }] },
    picker: {
      padding: spacing.xs,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      height: 44,
      borderRadius: radii.md,
    },
    optionPressed: { backgroundColor: colors.surfaceRaised },
    optionLabel: { flex: 1 },
    list: { gap: spacing.xs },
  }),
);
