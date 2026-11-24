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
  useTheme,
} from '@/design-system';
import { deleteAccount } from '@/features/auth/api';
import { FormMessage } from '@/features/auth/FormMessage';
import { useMyProfile } from '@/features/profile/hooks';
import { useStrings } from '@/i18n';
import { deleteAccountStrings } from '@/i18n/screens/deleteAccount';
import { toUserMessage } from '@/lib/errors';

/** Borrado de cuenta dentro de la app (exigido por App Store y Google Play). Irreversible. */
export default function DeleteAccountScreen() {
  useTheme();
  const t = useStrings(deleteAccountStrings);
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
      <ScreenHeader title={t.title} onBack={() => router.back()} />

      <Card style={styles.gap}>
        <Text variant="heading">{t.cannotUndo}</Text>
        <Text color="textMuted">{t.deletedPermanently}</Text>
        {t.whatIsDeleted.map((line) => (
          <Text key={line}>• {line}</Text>
        ))}
        <Text color="textMuted">{t.matchesNote}</Text>
      </Card>

      <View style={styles.gap}>
        <TextField
          label={t.confirmLabel(username)}
          value={typed}
          onChangeText={setTyped}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!remove.isPending}
          accessibilityHint={t.confirmHint}
        />
        {remove.isError ? <FormMessage tone="error" message={toUserMessage(remove.error)} /> : null}
        <Button
          label={t.deleteForever}
          variant="danger"
          size="lg"
          disabled={!matches}
          loading={remove.isPending}
          icon={<Trash2 color={colors.danger} size={18} />}
          onPress={() => remove.mutate()}
        />
        <Button label={t.cancel} variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.sm },
});
