import { Search, SearchX, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Card, MIN_TOUCH, Text, colors, radii, spacing, typography } from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { toUserMessage } from '@/lib/errors';

import { usePlayerSearch } from '../api';
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
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.bar, focused && styles.barFocused]}>
      <Search color={focused ? colors.primarySoft : colors.textMuted} size={20} />
      <TextInput
        value={query}
        onChangeText={onChange}
        placeholder="Nombre de usuario o código PG-…"
        placeholderTextColor={colors.textSubtle}
        accessibilityLabel="Buscar jugadores por nombre de usuario o código"
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
          accessibilityLabel="Borrar búsqueda"
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
        Escribí al menos 2 letras.
      </Text>
    );
  if (search.isPending || debounced !== query)
    return <ActivityIndicator color={colors.primaryBright} accessibilityLabel="Buscando" />;
  if (search.isError) return <FormMessage tone="error" message={toUserMessage(search.error)} />;
  if (!search.data || search.data.length === 0)
    return (
      <Animated.View entering={FadeIn.duration(200)} style={styles.empty}>
        <SearchX color={colors.textSubtle} size={32} />
        <Text variant="bodyStrong" color="text">
          Sin resultados
        </Text>
        <Text variant="caption" align="center">
          No encontramos jugadores con ese nombre o código.
        </Text>
      </Animated.View>
    );

  return (
    <View style={styles.results}>
      <Text variant="overline">
        {search.data.length === 1 ? '1 JUGADOR' : `${search.data.length} JUGADORES`}
      </Text>
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

const styles = StyleSheet.create({
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
});
