import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button, Screen, Text, TextField, spacing } from '@/design-system';
import { useAuth } from '@/features/auth/AuthProvider';
import { signOut, updatePassword } from '@/features/auth/api';
import { FormMessage } from '@/features/auth/FormMessage';
import { newPasswordSchema, type NewPasswordValues } from '@/features/auth/schemas';
import { toUserMessage } from '@/lib/errors';

export default function ResetPasswordScreen() {
  const { setRecoveringPassword } = useAuth();
  const { control, handleSubmit, formState } = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });
  const mutation = useMutation({
    mutationFn: (v: NewPasswordValues) => updatePassword(v.password),
    // Al desactivarse el guard de esta pantalla, Stack.Protected redirige a las tabs.
    onSuccess: () => setRecoveringPassword(false),
  });
  const submit = handleSubmit((v) => mutation.mutate(v));

  return (
    <Screen edges={['top', 'bottom']} contentStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="title">Nueva contraseña</Text>
        <Text color="textMuted">Elegí una contraseña que no uses en otros sitios.</Text>
      </View>
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextField
            label="Contraseña nueva"
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
            onSubmitEditing={() => void submit()}
          />
        )}
      />
      {mutation.isError ? (
        <FormMessage tone="error" message={toUserMessage(mutation.error)} />
      ) : null}
      <Button label="Guardar contraseña" size="lg" loading={mutation.isPending} onPress={submit} />
      <Button
        label="Cancelar y cerrar sesión"
        variant="ghost"
        onPress={() => {
          setRecoveringPassword(false);
          void signOut();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 64 },
  header: { gap: spacing.xs, marginBottom: spacing.md },
});
