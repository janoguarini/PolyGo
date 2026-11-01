import { Search, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Card, Text, TextField, colors, spacing } from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { toUserMessage } from '@/lib/errors';

import { usePlayerSearch } from '../api';
import { PlayerRow } from './PlayerRow';
import { SearchAction, type Feedback } from './RequestActions';

/** Espera a que se deje de escribir antes de buscar. */
const SEARCH_DELAY_MS = 350;

/** Buscador por nombre de usuario o código PG-, con la acción de cada resultado. */
export function PlayerSearch({
  query,
  onChange,
  onFeedback,
  autoFocus,
}: {
  query: string;
  onChange: (q: string) => void;
  onFeedback: (feedback: Feedback) => void;
  autoFocus?: boolean;
}) {
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), SEARCH_DELAY_MS);
    return () => clearTimeout(t);
  }, [query]);
  const search = usePlayerSearch(debounced);
  const active = query.trim().length > 0;
  const tooShort = debounced.trim().replace(/^@/, '').length < 2;

  return (
    <View style={styles.gap}>
      <View>
        <TextField
          label="Buscar jugadores"
          value={query}
          onChangeText={onChange}
          placeholder="Nombre de usuario o código PG-…"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={autoFocus}
          returnKeyType="search"
          style={styles.input}
        />
        <View style={styles.searchIcon} pointerEvents="none">
          <Search color={colors.textSubtle} size={18} />
        </View>
        {active ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Borrar búsqueda"
            onPress={() => onChange('')}
            style={styles.clear}
            hitSlop={12}
          >
            <X color={colors.textMuted} size={18} />
          </Pressable>
        ) : null}
      </View>

      {!active ? null : tooShort ? (
        <Text variant="caption">Escribí al menos 2 letras.</Text>
      ) : search.isPending || debounced !== query ? (
        <ActivityIndicator color={colors.primaryBright} accessibilityLabel="Buscando" />
      ) : search.isError ? (
        <FormMessage tone="error" message={toUserMessage(search.error)} />
      ) : search.data && search.data.length > 0 ? (
        <Card style={styles.list}>
          {search.data.map((p) => (
            <PlayerRow
              key={p.userId}
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
          ))}
        </Card>
      ) : (
        <Text variant="caption">No encontramos jugadores con ese nombre o código.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.md },
  list: { gap: spacing.md },
  input: { paddingLeft: spacing.huge - spacing.md, paddingRight: spacing.huge - spacing.md },
  searchIcon: { position: 'absolute', left: spacing.lg, bottom: 16 },
  clear: { position: 'absolute', right: spacing.lg, bottom: 16 },
});
