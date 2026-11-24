import { StyleSheet, View } from 'react-native';

import { Avatar, Button, Card, Text, spacing } from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { useStrings } from '@/i18n';
import { toUserMessage } from '@/lib/errors';

import { useBlockedUsers, useUnblockUser } from './api';
import { blockStrings } from './strings';

/** Ajustes → Usuarios bloqueados: la lista y "Desbloquear". */
export function BlockedUsersSection() {
  const t = useStrings(blockStrings);
  const blocked = useBlockedUsers();
  const unblock = useUnblockUser();

  if (blocked.isPending) return null;
  if (blocked.isError) {
    return <FormMessage tone="error" message={t.loadError} />;
  }
  if (blocked.data.length === 0) {
    return (
      <Card>
        <Text variant="caption">{t.empty}</Text>
      </Card>
    );
  }

  return (
    <Card style={styles.list}>
      {blocked.data.map((u) => (
        <View key={u.userId} style={styles.row}>
          <Avatar avatarId={u.avatarId} size={36} />
          <Text variant="bodyStrong" numberOfLines={1} style={styles.name}>
            @{u.username}
          </Text>
          <Button
            label={t.unblock}
            variant="ghost"
            loading={unblock.isPending && unblock.variables === u.userId}
            disabled={unblock.isPending}
            onPress={() => unblock.mutate(u.userId)}
          />
        </View>
      ))}
      {unblock.isError ? <FormMessage tone="error" message={toUserMessage(unblock.error)} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  name: { flex: 1 },
});
