import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { LANGUAGES, isSelectable, type LanguageConfig } from '@shared/languages';
import { RATING_CONFIG } from '@shared/ranking';

import { Text, colors, radii, spacing } from '@/design-system';
import { fetchCurriculum } from '@/features/learning/api';
import { learningKeys } from '@/features/learning/hooks';

import { useIsContentTester, useMyRatings, useSetTargetLanguage } from '../hooks';

/** Precarga el camino de los otros idiomas elegibles: cambiar de idioma no muestra carga. */
export function usePrefetchLanguagePaths(current: string | undefined) {
  const tester = useIsContentTester().data ?? false;
  const qc = useQueryClient();
  useEffect(() => {
    if (!current) return;
    for (const l of LANGUAGES) {
      if (l.code === current || !isSelectable(l, tester)) continue;
      void qc.prefetchQuery({
        queryKey: learningKeys.curriculum(l.code),
        queryFn: () => fetchCurriculum(l.code),
        staleTime: 10 * 60_000,
      });
    }
  }, [qc, current, tester]);
}

/**
 * Idiomas: el que estudiás va resaltado y tocando otro disponible cambiás al instante (el progreso
 * de cada uno se conserva). Los que no se pueden elegir se ven «Próximamente»; los beta, sólo para
 * los testers de contenido. Los caminos de los idiomas elegibles se precargan: al cambiar no hay
 * pantalla de carga.
 */
export function LanguagesRow({
  current,
  onChanged,
}: {
  current: string;
  /** Después de tocar otro idioma (p. ej. para cerrar el selector de Aprender). */
  onChanged?: () => void;
}) {
  const ratings = useMyRatings();
  const tester = useIsContentTester().data ?? false;
  const switchLanguage = useSetTargetLanguage();
  usePrefetchLanguagePaths(current);

  const choose = (l: LanguageConfig) => {
    if (l.code === current) return;
    switchLanguage.mutate(l.code, {
      onError: () => Alert.alert('No pudimos cambiar el idioma', 'Probá de nuevo en un rato.'),
    });
    onChanged?.();
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {LANGUAGES.map((l) => {
        const selected = l.code === current;
        const selectable = isSelectable(l, tester);
        const rating = ratings.data?.[l.code] ?? RATING_CONFIG.initialRating;
        const detail = !selectable
          ? 'Próximamente'
          : l.status === 'beta'
            ? 'Beta'
            : l.ranked
              ? `${rating} ELO`
              : 'Sin ranked aún';
        return (
          <Pressable
            key={l.code}
            onPress={() => choose(l)}
            disabled={!selectable || selected}
            style={({ pressed }) => [
              styles.card,
              selected && styles.selected,
              !selectable && styles.soon,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected, disabled: !selectable }}
            accessibilityLabel={`${l.name}${selected ? ', idioma actual' : ''}: ${detail}`}
            accessibilityHint={
              selectable && !selected ? 'Cambia el idioma que estudiás' : undefined
            }
          >
            <View style={styles.flag}>
              <Text style={styles.flagText}>{l.flag}</Text>
            </View>
            <View>
              <Text variant="bodyStrong" color={selected ? 'textStrong' : 'text'}>
                {l.name}
              </Text>
              <Text
                variant="caption"
                color={l.status === 'beta' && selectable ? 'streak' : undefined}
              >
                {detail}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    borderColor: colors.primaryBright,
    borderWidth: 2,
    backgroundColor: colors.surfaceHighlight,
  },
  soon: { opacity: 0.55 },
  pressed: { opacity: 0.85 },
  flag: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
  },
  flagText: { fontSize: 24, lineHeight: 30 },
});
