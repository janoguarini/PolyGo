import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { MailCheck } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button, Screen, Text, TextField, colors, spacing } from '@/design-system';
import { signUp } from '@/features/auth/api';
import { FormMessage } from '@/features/auth/FormMessage';
import { signUpSchema, type SignUpValues } from '@/features/auth/schemas';
import { toUserMessage } from '@/lib/errors';

export default function SignUpScreen() {
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
          Revisá tu email
        </Text>
        <Text color="textMuted" align="center">
          Enviamos un enlace de confirmación a {getValues('email')}. Abrilo desde este teléfono para
          activar tu cuenta.
        </Text>
        <Link href="/sign-in" replace style={styles.link}>
          <Text color="primarySoft">Ir a iniciar sesión</Text>
        </Link>
      </Screen>
    );
  }

  return (
    <Screen edges={['top', 'bottom']} contentStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="title">Crear cuenta</Text>
        <Text color="textMuted">Empezás en 1000 de ELO. Lo demás depende de vos.</Text>
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextField
            label="Email"
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
            label="Contraseña"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={formState.errors.password?.message}
            hint="Mínimo 8 caracteres, con letras y números."
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
            label="Repetir contraseña"
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

      <Button label="Crear cuenta" size="lg" loading={mutation.isPending} onPress={submit} />

      <Link href="/sign-in" replace style={styles.link}>
        <Text color="textMuted" align="center">
          ¿Ya tenés cuenta? <Text color="primarySoft">Iniciá sesión</Text>
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
