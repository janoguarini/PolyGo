import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Text as DSText, radii, spacing, themedStyles, useTheme } from '@/design-system';
import { useStrings } from '@/i18n';
import { toUserMessage } from '@/lib/errors';

import { appleSignInSupported, signInWithApple } from './apple';
import { FormMessage } from './FormMessage';
import { authStrings } from './strings';

/** Logo de Apple (glifo oficial), en el color del texto del botón. */
export function AppleLogo({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size * 0.814} height={size} viewBox="0 0 814 1000" accessible={false}>
      <Path
        fill={color}
        d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"
      />
    </Svg>
  );
}

/**
 * Estado de Sign in with Apple, compartido por bienvenida, ingreso y registro. Supabase crea la
 * cuenta si no existe; al terminar AuthProvider recibe la sesión y el layout redirige solo.
 */
export function useAppleSignIn() {
  const t = useStrings(authStrings).apple;
  const mutation = useMutation({ mutationFn: signInWithApple });
  const busy = mutation.isPending;
  const message: { tone: 'error' | 'info'; text: string } | null = mutation.isError
    ? { tone: 'error', text: toUserMessage(mutation.error) }
    : mutation.data?.status === 'cancelled'
      ? { tone: 'info', text: t.cancelled }
      : null;
  return {
    start: () => {
      if (!busy) mutation.mutate();
    },
    busy,
    message,
  };
}

/**
 * Botón negro de Apple (Human Interface Guidelines: fondo negro, logo y texto blancos). Sin
 * fondo ni borde propios del tema: se usa igual en las pantallas claras, oscuras y violetas.
 */
export function AppleButton({
  onPress,
  loading,
  height = 58,
  radius = radii.lg,
  labelSize = 17,
}: {
  onPress: () => void;
  loading: boolean;
  height?: number;
  radius?: number;
  labelSize?: number;
}) {
  const t = useStrings(authStrings).apple;
  return (
    <Pressable
      testID="apple-sign-in"
      onPress={() => {
        if (loading) return;
        if (Platform.OS !== 'web') void Haptics.selectionAsync();
        onPress();
      }}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={t.label}
      accessibilityHint={t.hint}
      accessibilityState={{ disabled: loading, busy: loading }}
      style={({ pressed }) => [
        styles.apple,
        { minHeight: height, borderRadius: radius },
        pressed && !loading && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <View style={styles.row}>
          <AppleLogo size={Math.round(labelSize * 1.15)} />
          <Text style={[styles.label, { fontSize: labelSize }]} maxFontSizeMultiplier={1.3}>
            {t.label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

/** "Continuar con Apple" para ingreso y registro. No se dibuja fuera de iOS. */
export function AppleSignInButton() {
  useTheme();
  const themed = useThemedStyles();
  const apple = useAppleSignIn();
  if (!appleSignInSupported()) return null;

  return (
    <View style={themed.wrap}>
      <AppleButton onPress={apple.start} loading={apple.busy} />
      {apple.message?.tone === 'error' ? (
        <FormMessage tone="error" message={apple.message.text} />
      ) : apple.message ? (
        <DSText
          variant="caption"
          align="center"
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {apple.message.text}
        </DSText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  apple: {
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    // Separa el botón negro del fondo oscuro sin cambiar su color.
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { color: '#FFFFFF', fontWeight: '600', letterSpacing: 0.2 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});

const useThemedStyles = themedStyles(() =>
  StyleSheet.create({
    wrap: { gap: spacing.sm },
  }),
);
