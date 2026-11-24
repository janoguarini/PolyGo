import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button, Screen, Text, TextField, spacing } from '@/design-system';
import { signIn } from '@/features/auth/api';
import { AppleSignInButton } from '@/features/auth/AppleSignInButton';
import { FormMessage } from '@/features/auth/FormMessage';
import { AuthDivider, GoogleSignInButton } from '@/features/auth/GoogleSignInButton';
import { signInSchema, type SignInValues } from '@/features/auth/schemas';
import { useStrings } from '@/i18n';
import { signInStrings } from '@/i18n/screens/signIn';
import { authStrings } from '@/features/auth/strings';
import { toUserMessage } from '@/lib/errors';

export default function SignInScreen() {
  const t = useStrings(signInStrings);
  const auth = useStrings(authStrings);
  const { control, handleSubmit, formState } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });
  const mutation = useMutation({ mutationFn: signIn });
  // Al iniciar sesión, onAuthStateChange actualiza la sesión y los guards del layout redirigen.

  return (
    <Screen edges={['top', 'bottom']} contentStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="title">{t.title}</Text>
        <Text color="textMuted">{t.subtitle}</Text>
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextField
            label={t.email}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={formState.errors.email?.message}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextField
            label={t.password}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={formState.errors.password?.message}
            secureTextEntry
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={() => void handleSubmit((v) => mutation.mutate(v))()}
          />
        )}
      />

      {mutation.isError ? (
        <FormMessage tone="error" message={toUserMessage(mutation.error)} />
      ) : null}

      <Button
        label={t.submit}
        size="lg"
        loading={mutation.isPending}
        onPress={handleSubmit((v) => mutation.mutate(v))}
      />

      <AuthDivider label={auth.dividerContinueWith} />
      <GoogleSignInButton />
      <AppleSignInButton />

      <View style={styles.links}>
        <Link href="/forgot-password" style={styles.link}>
          <Text color="primarySoft">{t.forgotPassword}</Text>
        </Link>
        <Link href="/sign-up" replace style={styles.link}>
          <Text color="textMuted">
            {t.noAccount}
            <Text color="primarySoft">{t.signUp}</Text>
          </Text>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 96 },
  header: { gap: spacing.xs, marginBottom: spacing.md },
  links: { alignItems: 'center', gap: spacing.lg, marginTop: spacing.md },
  link: { paddingVertical: spacing.sm },
});
