import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button, Screen, Text, TextField, spacing } from '@/design-system';
import { sendPasswordReset } from '@/features/auth/api';
import { FormMessage } from '@/features/auth/FormMessage';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/features/auth/schemas';
import { toUserMessage } from '@/lib/errors';

export default function ForgotPasswordScreen() {
  const { control, handleSubmit, formState } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const mutation = useMutation({
    mutationFn: (v: ForgotPasswordValues) => sendPasswordReset(v.email),
  });
  const submit = handleSubmit((v) => mutation.mutate(v));

  return (
    <Screen edges={['top', 'bottom']} contentStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="title">Recuperar contraseña</Text>
        <Text color="textMuted">Te enviamos un enlace para elegir una contraseña nueva.</Text>
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
            onSubmitEditing={() => void submit()}
          />
        )}
      />

      {mutation.isError ? (
        <FormMessage tone="error" message={toUserMessage(mutation.error)} />
      ) : null}
      {mutation.isSuccess ? (
        // Mensaje neutro: no revela si el email está registrado.
        <FormMessage
          tone="success"
          message="Si existe una cuenta con ese email, vas a recibir un enlace. Abrilo desde este teléfono."
        />
      ) : null}

      <Button
        label={mutation.isSuccess ? 'Reenviar enlace' : 'Enviar enlace'}
        size="lg"
        loading={mutation.isPending}
        onPress={submit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 96 },
  header: { gap: spacing.xs, marginBottom: spacing.md },
});
