import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { MailCheck } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button, Screen, Text, TextField, colors, spacing, useTheme } from '@/design-system';
import { signUp } from '@/features/auth/api';
import { AppleSignInButton } from '@/features/auth/AppleSignInButton';
import { FormMessage } from '@/features/auth/FormMessage';
import { AuthDivider, GoogleSignInButton } from '@/features/auth/GoogleSignInButton';
import { signUpSchema, type SignUpValues } from '@/features/auth/schemas';
import { authStrings } from '@/features/auth/strings';
import { useStrings } from '@/i18n';
import { signUpStrings } from '@/i18n/screens/signUp';
import { toUserMessage } from '@/lib/errors';

export default function SignUpScreen() {
  useTheme();
  const t = useStrings(signUpStrings);
  const auth = useStrings(authStrings);
  const { control, handleSubmit, formState, getValues } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });
  const mutation = useMutation({ mutationFn: signUp });
  const submit = handleSubmit((v) => mutation.mutate(v));

  if (mutation.data?.needsConfirmation) {
    return (
      <Screen edges={['top', 'bottom']} contentStyle={styles.centered}>
        <MailCheck color={colors.success} size={48} />
        <Text variant="title" align="center">
          {t.checkEmailTitle}
        </Text>
        <Text color="textMuted" align="center">
          {t.checkEmailMessage(getValues('email'))}
        </Text>
        <Link href="/sign-in" replace style={styles.link}>
          <Text color="primarySoft">{t.goToSignIn}</Text>
        </Link>
      </Screen>
    );
  }

  return (
    <Screen edges={['top', 'bottom']} contentStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="title">{t.title}</Text>
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
            hint={t.passwordHint}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <TextField
            label={t.confirmPassword}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={formState.errors.confirmPassword?.message}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            onSubmitEditing={() => void submit()}
          />
        )}
      />

      {mutation.isError ? (
        <FormMessage tone="error" message={toUserMessage(mutation.error)} />
      ) : null}

      <Button label={t.submit} size="lg" loading={mutation.isPending} onPress={submit} />

      <AuthDivider label={auth.dividerContinueWith} />
      <GoogleSignInButton />
      <AppleSignInButton />

      <Link href="/sign-in" replace style={styles.link}>
        <Text color="textMuted" align="center">
          {t.haveAccount}
          <Text color="primarySoft">{t.signIn}</Text>
        </Text>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 96 },
  centered: { justifyContent: 'center', alignItems: 'center', gap: spacing.lg },
  header: { gap: spacing.xs, marginBottom: spacing.md },
  link: { alignSelf: 'center', paddingVertical: spacing.md },
});
