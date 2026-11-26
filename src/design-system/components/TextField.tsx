import { themedStyles } from '../theme';
import { useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radii, spacing, typography } from '../tokens';
import { Text } from './Text';

export interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  /** Ícono dentro del campo, a la derecha (p. ej. un tilde de «disponible»). */
  trailing?: ReactNode;
  /** Borde verde: el valor es válido (p. ej. nombre libre). */
  success?: boolean;
}

export function TextField({
  label,
  error,
  hint,
  trailing,
  success,
  style,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const styles = useStyles();
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? colors.danger
    : success
      ? colors.success
      : focused
        ? colors.primaryBright
        : colors.border;

  return (
    <View style={styles.wrapper}>
      <Text variant="caption" color="text">
        {label}
      </Text>
      <View>
        <TextInput
          accessibilityLabel={label}
          accessibilityHint={error ?? hint}
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.primaryBright}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, { borderColor }, trailing ? styles.withTrailing : null, style]}
          maxFontSizeMultiplier={1.5}
          {...rest}
        />
        {trailing ? (
          <View style={styles.trailing} pointerEvents="none">
            {trailing}
          </View>
        ) : null}
      </View>
      {error ? (
        <Text variant="caption" color="danger" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption">{hint}</Text>
      ) : null}
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    wrapper: { gap: spacing.xs },
    input: {
      ...typography.body,
      color: colors.textStrong,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1.5,
      borderRadius: radii.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      minHeight: 50,
    },
    withTrailing: { paddingRight: spacing.huge },
    trailing: {
      position: 'absolute',
      right: spacing.md,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
    },
  }),
);
