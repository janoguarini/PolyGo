import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { LANGUAGES, isSelectable, type LanguageConfig } from '@shared/languages';
import { RATING_CONFIG } from '@shared/ranking';

import { Text, colors, radii, spacing } from '@/design-system';

import { useIsContentTester, useMyRatings, useSetTargetLanguage } from '../hooks';

/**
 * Idiomas: el que estudiás va resaltado y tocando otro disponible cambiás de idioma (el progreso de
 * cada uno se conserva). Los que no se pueden elegir se ven «Próximamente»; los beta, sólo para
 * los testers de contenido.
 */
export function LanguagesRow({ current }: { current: string }) {
  const ratings = useMyRatings();
  const tester = useIsContentTester().data ?? false;
  const switchLanguage = useSetTargetLanguage();

  const choose = (l: LanguageConfig) => {
    if (l.code === current || switchLanguage.isPending) return;
    Alert.alert(
      `¿Estudiar ${l.name.toLowerCase()}?`,
      `${l.status === 'beta' ? 'Es un curso en preparación: el contenido todavía no está revisado por hablantes nativos. ' : ''}Tu progreso en cada idioma se guarda: podés volver cuando quieras.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cambiar',
          onPress: () =>
            switchLanguage.mutate(l.code, {
              onError: () =>
                Alert.alert('No pudimos cambiar el idioma', 'Probá de nuevo en un rato.'),
            }),
        },
      ],
    );
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
