import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  ErrorState,
  LoadingState,
  Screen,
  ScreenHeader,
  Text,
  TextField,
  colors,
  spacing,
} from '@/design-system';
import { deleteAccount } from '@/features/auth/api';
import { FormMessage } from '@/features/auth/FormMessage';
import { useMyProfile } from '@/features/profile/hooks';
import { toUserMessage } from '@/lib/errors';

const WHAT_IS_DELETED = [
  'Tu cuenta, email y contraseña.',
  'Tu perfil, avatar y ajustes de privacidad.',
  'Tu progreso: lecciones, palabras, repasos, racha y logros.',
  'Tu ELO, tu rango y tu historial de rating.',
];

/** Borrado de cuenta dentro de la app (exigido por App Store y Google Play). Irreversible. */
export default function DeleteAccountScreen() {
  const me = useMyProfile();
  const [typed, setTyped] = useState('');
  // Al terminar, AuthProvider recibe SIGNED_OUT y el layout raíz lleva a la bienvenida.
  const remove = useMutation({ mutationFn: deleteAccount });

  if (me.isPending) return <LoadingState />;
  if (me.isError || !me.data) return <ErrorState onRetry={() => void me.refetch()} />;

  const username = me.data.profile.username ?? '';
  const matches = username.length > 0 && typed.trim().toLowerCase() === username;

  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader title="Eliminar cuenta" onBack={() => router.back()} />

      <Card style={styles.gap}>
        <Text variant="heading">Esto no se puede deshacer</Text>
        <Text color="textMuted">Se borran de forma permanente:</Text>
        {WHAT_IS_DELETED.map((line) => (
          <Text key={line}>• {line}</Text>
        ))}
        <Text color="textMuted">
          Las partidas que jugaste quedan en el historial de tus rivales sin tu nombre ni avatar.
        </Text>
      </Card>

      <View style={styles.gap}>
        <TextField
          label={`Para confirmar, escribí tu usuario: ${username}`}
          value={typed}
          onChangeText={setTyped}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!remove.isPending}
          accessibilityHint="El botón de eliminar se habilita cuando coincide"
        />
        {remove.isError ? <FormMessage tone="error" message={toUserMessage(remove.error)} /> : null}
        <Button
          label="Eliminar mi cuenta para siempre"
          variant="danger"
          size="lg"
          disabled={!matches}
          loading={remove.isPending}
          icon={<Trash2 color={colors.danger} size={18} />}
          onPress={() => remove.mutate()}
        />
        <Button label="Cancelar" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.sm },
});
