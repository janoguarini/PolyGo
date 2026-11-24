import { useMutation } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native';

import { Button, Text, colors, spacing, themedStyles } from '@/design-system';
import { useStrings } from '@/i18n';
import { toUserMessage } from '@/lib/errors';

import { signInWithGoogle } from './api';
import { FormMessage } from './FormMessage';
import { authStrings } from './strings';
import { GoogleIcon } from './welcome/WelcomeArt';

/**
 * Estado del inicio con Google, compartido por todos los botones "Continuar con Google" (ingreso,
 * registro y bienvenida). Supabase crea la cuenta si no existe. Al terminar, AuthProvider recibe
 * la sesión y el layout principal redirige solo; acá sólo hay carga, cancelación y errores.
 * signInWithGoogle() ya garantiza un único flujo OAuth a la vez; `busy` además bloquea el botón.
 */
export function useGoogleSignIn() {
  const t = useStrings(authStrings).google;
  const mutation = useMutation({ mutationFn: signInWithGoogle });
  const busy = mutation.isPending || mutation.data?.status === 'redirecting';
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

/** "Continuar con Google" con el estilo de las pantallas de ingreso y registro. */
export function GoogleSignInButton() {
  const styles = useStyles();
  const t = useStrings(authStrings).google;
  const google = useGoogleSignIn();

  return (
    <View style={styles.wrap}>
      <Button
        testID="google-sign-in"
        label={t.label}
        variant="secondary"
        size="lg"
        icon={<GoogleIcon size={26} />}
        loading={google.busy}
        accessibilityHint={t.hint}
        onPress={google.start}
      />
      {google.message?.tone === 'error' ? (
        <FormMessage tone="error" message={google.message.text} />
      ) : google.message ? (
        <Text
          variant="caption"
          align="center"
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {google.message.text}
        </Text>
      ) : null}
    </View>
  );
}

/** Separador "o" entre el botón de Google y el formulario de email. */
export function AuthDivider({ label }: { label?: string }) {
  const styles = useStyles();
  const t = useStrings(authStrings);
  return (
    <View style={styles.divider} accessible={false} importantForAccessibility="no-hide-descendants">
      <View style={styles.line} />
      <Text variant="caption">{label ?? t.dividerEmail}</Text>
      <View style={styles.line} />
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    wrap: { gap: spacing.sm },
    divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.borderStrong },
  }),
);
