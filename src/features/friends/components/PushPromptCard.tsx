import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BellRing, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { Button, Card, Text, colors, spacing, useTheme } from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { useStrings } from '@/i18n';
import { deviceStorage } from '@/lib/secureStorage';
import { toUserMessage } from '@/lib/errors';

import { getPushPermission, pushSupported, registerForPush } from '../push';
import { friendsStrings } from '../strings';

const DISMISSED_KEY = 'polygo.pushPromptDismissed';
const permissionKey = ['friends', 'push-permission'] as const;

/** Permiso de notificaciones de este teléfono ('unsupported' en web y Expo Go). */
export function usePushPermission() {
  return useQuery({ queryKey: permissionKey, queryFn: getPushPermission, staleTime: 0 });
}

/** Pide (o reintenta) el permiso y registra el token. */
export function useEnablePush() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => registerForPush({ ask: true }),
    onSettled: () => qc.invalidateQueries({ queryKey: permissionKey }),
  });
}

/**
 * En Amigos, cuando ya tenés amigos: invita a activar los avisos de desafíos. Se puede cerrar
 * (no vuelve a aparecer) y desaparece sola si el permiso ya está concedido.
 */
export function PushPromptCard() {
  useTheme();
  const t = useStrings(friendsStrings);
  const permission = usePushPermission();
  const enable = useEnablePush();
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    void deviceStorage.getItem(DISMISSED_KEY).then((v) => setDismissed(v === '1'));
  }, []);

  if (!pushSupported || dismissed !== false) return null;
  const state = permission.data;
  if (state !== 'undetermined' && state !== 'blocked') return null;

  const dismiss = () => {
    setDismissed(true);
    void deviceStorage.setItem(DISMISSED_KEY, '1');
  };

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <BellRing color={colors.primarySoft} size={22} />
        <Text variant="bodyStrong" color="textStrong" style={styles.flex}>
          {t.pushTitle}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.dontShowAgain}
          onPress={dismiss}
          hitSlop={12}
          style={styles.close}
        >
          <X color={colors.textMuted} size={18} />
        </Pressable>
      </View>
      <Text color="textMuted">{state === 'blocked' ? t.pushBlocked : t.pushAsk}</Text>
      {enable.isError ? <FormMessage tone="error" message={toUserMessage(enable.error)} /> : null}
      {state === 'blocked' ? (
        <Button
          label={t.openPhoneSettings}
          variant="secondary"
          onPress={() => void Linking.openSettings()}
        />
      ) : (
        <Button label={t.enablePush} loading={enable.isPending} onPress={() => enable.mutate()} />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  flex: { flex: 1 },
  close: { minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' },
});
