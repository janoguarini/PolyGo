import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronDown, Globe2, Swords, Trophy } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { LANGUAGES } from '@shared/languages';

import {
  EmptyState,
  ErrorState,
  LoadingState,
  Screen,
  ScreenHeader,
  Text,
  colors,
  radii,
  spacing,
  themedStyles,
} from '@/design-system';
import { useAuth } from '@/features/auth/AuthProvider';
import { useBlockedIds } from '@/features/blocks/api';
import { useMyProfile, useMyRatings } from '@/features/profile/hooks';
import {
  useLeaderboard,
  useMyLeaderboardPosition,
  type LeaderboardEntry,
} from '@/features/ranked/api';
import { LeaderboardRow, type RowLanguage } from '@/features/ranked/Leaderboard';
import { useInterfaceLanguage, useStrings } from '@/i18n';
import { languageName } from '@/i18n/languages';
import { leaderboardScreenStrings } from '@/i18n/screens/leaderboard';

/** Idiomas con clasificación propia (los que tienen Ranked). */
const RANKED_LANGUAGES = LANGUAGES.filter((l) => l.ranked);

/** Degradé de la pestaña activa. */
const ACTIVE_TAB = ['#8B5CFF', '#6A2BFF', '#4A15C8'] as const;

/**
 * Clasificación: una fila por jugador (puesto, nombre, idioma y rango en ese idioma). Dos
 * pestañas: Global (el mejor idioma de cada uno) y el idioma que estudiás; tocar de nuevo la del
 * idioma abre el selector para ver otro. Tu fila queda fija abajo si no entrás en la lista.
 */
export default function LeaderboardScreen() {
  const styles = useStyles();
  const t = useStrings(leaderboardScreenStrings);
  const ui = useInterfaceLanguage();
  const { session } = useAuth();
  const meId = session?.user.id;
  const me = useMyProfile();
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
  const languageActive = scope !== null;

  const leaderboard = useLeaderboard(scope);
  const position = useMyLeaderboardPosition(scope);
  const blockedIds = useBlockedIds();
  const myRatings = useMyRatings();

  // Los bloqueados no se muestran; el resto conserva su puesto real.
  const entries = (leaderboard.data ?? []).filter((e) => !blockedIds.has(e.userId));

  // Bandera y nombre de cada idioma con Ranked, en el idioma de la interfaz.
  const languages = useMemo(
    () =>
      new Map<string, RowLanguage>(
        RANKED_LANGUAGES.map((l) => [l.code, { flag: l.flag, name: languageName(l.code, ui) }]),
      ),
    [ui],
  );
  // En la global, el idioma del rating de cada uno (su mejor idioma); en un idioma, ese.
  // (Primero el idioma de la fila: mientras llega la pestaña nueva se ve la lista anterior.)
  const rowLanguage = (entry: LeaderboardEntry) =>
    languages.get((entry.languageCode ?? scope) || '');

  // Las filas entran animadas sólo al abrir la pantalla; después de cambiar de pestaña se
  // reemplazan en el lugar, sin moverse.
  const [switched, setSwitched] = useState(false);
  const changeScope = (next: string | null) => {
    setSwitched(true);
    setScope(next);
  };

  const myPos = position.data?.position ?? null;
  const myRating = position.data?.rating ?? null;
  const inList = entries.some((e) => e.userId === meId);
  // Si no entrás en la lista, tu fila queda fija abajo.
  const myRow: LeaderboardEntry | null =
    myPos !== null && !inList && myRating !== null && me.data && meId
      ? {
          userId: meId,
          username: me.data.profile.username ?? '',
          avatarId: me.data.profile.avatar_id,
          avatarPath: me.data.profile.avatar_path,
          frameId: me.data.profile.frame_id,
          region: me.data.profile.region,
          // En la global, el idioma cuyo ELO es el mostrado (tu mejor idioma).
          languageCode:
            scope ??
            Object.entries(myRatings.data ?? {}).find(
              ([code, rating]) => rating === myRating && languages.has(code),
            )?.[0] ??
            null,
          rating: myRating,
          gamesPlayed: position.data?.gamesPlayed ?? 0,
          wins: position.data?.wins ?? 0,
          position: myPos,
        }
      : null;

  const footer = myRow ? (
    <LeaderboardRow entry={myRow} isMe pinned language={rowLanguage(myRow)} />
  ) : !position.isPending && myPos === null ? (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.navigate('/ranked')}
      style={({ pressed }) => [styles.unplaced, pressed && styles.pressed]}
    >
      <Swords color={colors.primaryBright} size={20} />
      <Text variant="bodyStrong" color="textStrong" style={styles.shrink}>
        {t.winToEnter}
      </Text>
    </Pressable>
  ) : undefined;

  const header = (
    <View style={styles.header}>
      <ScreenHeader title={t.title} onBack={() => router.back()} />
      <View style={styles.tabs} accessibilityRole="tablist">
        <Tab
          active={!languageActive}
          onPress={() => {
            changeScope(null);
            setPickerOpen(false);
          }}
          icon={<Globe2 color={!languageActive ? '#FFFFFF' : colors.textMuted} size={18} />}
          label={t.global}
        />
        {language ? (
          <Tab
            active={languageActive}
            expanded={pickerOpen}
            hint={t.pickLanguageHint}
            onPress={() => {
              if (!languageActive) changeScope(language.code);
              else setPickerOpen((open) => !open);
            }}
            icon={<Text style={styles.tabFlag}>{language.flag}</Text>}
            label={languageName(language.code, ui)}
            trailing={
              <ChevronDown
                color={languageActive ? '#FFFFFF' : colors.textMuted}
                size={16}
                style={pickerOpen ? styles.chevronOpen : undefined}
              />
            }
          />
        ) : null}
      </View>
      {pickerOpen ? (
        <Animated.View
          entering={FadeIn.duration(140)}
          exiting={FadeOut.duration(100)}
          style={styles.picker}
          accessibilityRole="menu"
        >
          {RANKED_LANGUAGES.map((l) => {
            const selected = l.code === languageCode;
            return (
              <Pressable
                key={l.code}
                accessibilityRole="menuitem"
                accessibilityState={{ selected }}
                onPress={() => {
                  setPickedLanguage(l.code);
                  changeScope(l.code);
                  setPickerOpen(false);
                }}
                style={({ pressed }) => [
                  styles.chip,
                  selected && styles.chipSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.tabFlag}>{l.flag}</Text>
                <Text
                  variant="bodyStrong"
                  color={selected ? 'textStrong' : 'text'}
                  numberOfLines={1}
                  style={styles.shrink}
                >
                  {languageName(l.code, ui)}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>
      ) : null}
    </View>
  );

  return (
    <Screen
      header={header}
      footer={footer}
      contentStyle={styles.content}
      onRefresh={() => {
        void leaderboard.refetch();
        void position.refetch();
      }}
      refreshing={leaderboard.isRefetching}
    >
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
        // Mientras llega la pestaña nueva, la anterior queda apenas atenuada (sin saltos).
        <View style={[styles.list, leaderboard.isPlaceholderData && styles.stale]}>
          <View style={styles.columns} importantForAccessibility="no-hide-descendants">
            <Text style={[styles.column, styles.columnPosition]}>#</Text>
            <Text style={[styles.column, styles.columnPlayer]}>{t.playerColumn}</Text>
            <Text style={styles.column}>{t.rankColumn}</Text>
          </View>
          {entries.map((entry, index) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              index={index}
              animate={!switched}
              isMe={entry.userId === meId}
              language={rowLanguage(entry)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

function Tab({
  active,
  expanded,
  hint,
  onPress,
  icon,
  label,
  trailing,
}: {
  active: boolean;
  expanded?: boolean;
  hint?: string;
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
}) {
  const styles = useStyles();
  const content = (
    <>
      {icon}
      <Text
        numberOfLines={1}
        style={[styles.tabLabel, active ? styles.tabLabelActive : styles.tabLabelIdle]}
      >
        {label.toUpperCase()}
      </Text>
      {trailing}
    </>
  );
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active, expanded }}
      accessibilityHint={hint}
      onPress={onPress}
      style={({ pressed }) => [styles.tabShell, pressed && styles.pressed]}
    >
      {active ? (
        <LinearGradient
          colors={ACTIVE_TAB}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.tab, styles.tabActive]}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={styles.tab}>{content}</View>
      )}
    </Pressable>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    shrink: { flexShrink: 1 },
    header: { gap: spacing.sm, paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
    content: { paddingTop: spacing.xs },
    tabs: {
      flexDirection: 'row',
      padding: 4,
      gap: 4,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tabShell: { flex: 1 },
    tab: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: radii.md,
    },
    tabActive: {
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    tabLabel: { fontSize: 14, lineHeight: 18, fontWeight: '900', letterSpacing: 0.8, flexShrink: 1 },
    tabLabelActive: { color: '#FFFFFF' },
    tabLabelIdle: { color: colors.textMuted },
    tabFlag: { fontSize: 17, lineHeight: 21 },
    chevronOpen: { transform: [{ rotate: '180deg' }] },
    picker: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      padding: spacing.xs,
      borderRadius: radii.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chip: {
      flexBasis: '31%',
      flexGrow: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      height: 42,
      paddingHorizontal: spacing.sm,
      borderRadius: radii.md,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    chipSelected: { borderColor: colors.primaryBright, backgroundColor: colors.surfaceHighlight },
    list: { gap: spacing.xs },
    stale: { opacity: 0.55 },
    columns: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingLeft: spacing.xs,
      paddingRight: spacing.sm,
      paddingBottom: 2,
    },
    column: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '800',
      letterSpacing: 1.2,
      color: colors.textSubtle,
    },
    columnPosition: { width: 36, textAlign: 'center' },
    columnPlayer: { flex: 1 },
    unplaced: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radii.lg,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: colors.primaryBright,
      backgroundColor: colors.surface,
    },
  }),
);
