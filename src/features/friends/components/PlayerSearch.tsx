import { Search, SearchX, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import {
  Card,
  MIN_TOUCH,
  Text,
  colors,
  radii,
  spacing,
  typography,
  themedStyles,
} from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { useStrings } from '@/i18n';
import { toUserMessage } from '@/lib/errors';

import { usePlayerSearch } from '../api';
import { friendsStrings } from '../strings';
import { PlayerRow } from './PlayerRow';
import { SearchAction, type Feedback } from './RequestActions';

/** Espera a que se deje de escribir antes de buscar. */
const SEARCH_DELAY_MS = 350;

/** Barra de búsqueda redondeada: se ilumina al enfocarla. */
export function SearchBar({
  query,
  onChange,
  autoFocus,
}: {
  query: string;
  onChange: (q: string) => void;
  autoFocus?: boolean;
}) {
  const styles = useStyles();
  const t = useStrings(friendsStrings);
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.bar, focused && styles.barFocused]}>
      <Search color={focused ? colors.primarySoft : colors.textMuted} size={20} />
      <TextInput
        value={query}
        onChangeText={onChange}
        placeholder={t.searchPlaceholder}
        placeholderTextColor={colors.textSubtle}
        accessibilityLabel={t.searchA11y}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        returnKeyType="search"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        selectionColor={colors.primaryBright}
        style={styles.input}
      />
      {query.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.clearSearch}
          onPress={() => onChange('')}
          hitSlop={12}
          style={styles.clear}
        >
          <X color={colors.text} size={16} />
        </Pressable>
      ) : null}
    </View>
  );
}

/** Resultados de buscar por nombre de usuario o código PG-, con la acción de cada uno. */
export function PlayerSearchResults({
  query,
  onFeedback,
}: {
  query: string;
  onFeedback: (feedback: Feedback) => void;
}) {
  const styles = useStyles();
  const t = useStrings(friendsStrings);
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), SEARCH_DELAY_MS);
    return () => clearTimeout(t);
  }, [query]);
  const search = usePlayerSearch(debounced);
  const tooShort = debounced.trim().replace(/^@/, '').length < 2;

  if (tooShort)
    return (
      <Text variant="caption" align="center">
        {t.typeTwoLetters}
      </Text>
    );
  if (search.isPending || debounced !== query)
    return <ActivityIndicator color={colors.primaryBright} accessibilityLabel={t.searching} />;
  if (search.isError) return <FormMessage tone="error" message={toUserMessage(search.error)} />;
  if (!search.data || search.data.length === 0)
    return (
      <Animated.View entering={FadeIn.duration(200)} style={styles.empty}>
        <SearchX color={colors.textSubtle} size={32} />
        <Text variant="bodyStrong" color="text">
          {t.noResults}
        </Text>
        <Text variant="caption" align="center">
          {t.noResultsHint}
        </Text>
      </Animated.View>
    );

  return (
    <View style={styles.results}>
      <Text variant="overline">{t.playersCount(search.data.length)}</Text>
      {search.data.map((p, i) => (
        <Animated.View key={p.userId} entering={FadeInDown.delay(50 * i).duration(250)}>
          <Card style={styles.result}>
            <PlayerRow
              player={p}
              trailing={
                <SearchAction
                  userId={p.userId}
                  username={p.username}
                  state={p.state}
                  onFeedback={onFeedback}
                />
              }
            />
          </Card>
        </Animated.View>
      ))}
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: 54,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.pill,
      borderWidth: 1.5,
      borderColor: 'rgba(167, 139, 250, 0.25)',
      backgroundColor: colors.surface,
    },
    barFocused: {
      borderColor: colors.primaryBright,
      backgroundColor: colors.surfaceRaised,
      shadowColor: colors.primaryBright,
      shadowOpacity: 0.45,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 0 },
    },
    input: {
      flex: 1,
      minHeight: MIN_TOUCH,
      color: colors.textStrong,
      fontSize: typography.body.fontSize,
    },
    clear: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceHighlight,
    },
    results: { gap: spacing.sm },
    result: { paddingVertical: spacing.md, borderColor: 'rgba(167, 139, 250, 0.2)' },
    empty: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xl },
  }),
);
