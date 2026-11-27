import * as Haptics from 'expo-haptics';
import { CircleCheck, CircleX, Sparkles } from 'lucide-react-native';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

import { Text, TextField, colors, radii, spacing, themedStyles } from '@/design-system';
import type { UsernameCheck } from '@/features/profile/useUsernameCheck';
import { useStrings } from '@/i18n';

import { signupStrings } from './strings';

/**
 * Nombre de jugador con comprobación en vivo: tilde verde si está libre; si ya existe, tres nombres
 * parecidos y libres para elegir con un toque.
 */
export function UsernameField({
  value,
  onChange,
  check,
  submitError,
  onSubmit,
}: {
  value: string;
  onChange: (next: string) => void;
  check: UsernameCheck;
  /** Error al enviar (red, o el nombre se ocupó justo antes): manda sobre el estado en vivo. */
  submitError?: string;
  onSubmit: () => void;
}) {
  const styles = useStyles();
  const { status, suggestions } = check;
  const t = useStrings(signupStrings);

  useEffect(() => {
    if (status === 'available')
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (status === 'taken')
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, [status, check.name]);

  const error =
    submitError ??
    (status === 'invalid'
      ? t.usernameRule
      : status === 'taken'
        ? t.usernameExists
        : status === 'error'
          ? t.usernameCheckFailed
          : undefined);

  const trailing =
    status === 'checking' ? (
      <ActivityIndicator color={colors.primarySoft} accessibilityLabel={t.usernameChecking} />
    ) : status === 'available' && !submitError ? (
      <Animated.View
        entering={ZoomIn.springify().damping(9)}
        accessible
        accessibilityLabel={t.usernameAvailableA11y}
      >
        <CircleCheck color={colors.success} size={26} strokeWidth={2.5} />
      </Animated.View>
    ) : status === 'taken' || submitError ? (
      <View accessible accessibilityLabel={t.usernameUnavailableA11y}>
        <CircleX color={colors.danger} size={24} />
      </View>
    ) : null;

  return (
    <View style={styles.wrap}>
      <TextField
        label={t.usernameLabel}
        value={value}
        onChangeText={onChange}
        error={error}
        success={status === 'available' && !submitError}
        trailing={trailing}
        hint={t.usernameHint}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={20}
        onSubmitEditing={onSubmit}
      />

      {status === 'available' && !submitError ? (
        <Animated.View entering={FadeInDown.springify()} style={styles.okRow}>
          <Text variant="caption" color="success" accessibilityLiveRegion="polite">
            {t.usernameAvailable(check.name ?? value)}
          </Text>
        </Animated.View>
      ) : null}

      {status === 'taken' && suggestions.length > 0 ? (
        <Animated.View entering={FadeInDown.springify()} style={styles.suggestions}>
          <View style={styles.suggestionsTitle}>
            <Sparkles color={colors.primarySoft} size={14} />
            <Text variant="caption" color="textMuted">
              {t.suggestionsTitle}
            </Text>
          </View>
          <View style={styles.chips}>
            {suggestions.map((s, i) => (
              <Animated.View
                key={s}
                entering={ZoomIn.delay(i * 70)
                  .springify()
                  .damping(10)}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t.useSuggestion(s)}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    onChange(s);
                  }}
                  style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
                >
                  <Text variant="bodyStrong" color="textStrong">
                    {s}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    wrap: { gap: spacing.sm },
    okRow: { flexDirection: 'row', alignItems: 'center' },
    suggestions: { gap: spacing.sm },
    suggestionsTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    chip: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radii.pill,
      borderWidth: 1.5,
      borderColor: colors.brandBorder,
      backgroundColor: colors.surfaceRaised,
    },
    pressed: { opacity: 0.75, transform: [{ scale: 0.96 }] },
  }),
);
