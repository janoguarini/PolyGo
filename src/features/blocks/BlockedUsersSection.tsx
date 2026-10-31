import { StyleSheet, View } from 'react-native';

import { Avatar, Button, Card, Text, spacing } from '@/design-system';
import { FormMessage } from '@/features/auth/FormMessage';
import { toUserMessage } from '@/lib/errors';

import { useBlockedUsers, useUnblockUser } from './api';

/** Ajustes → Usuarios bloqueados: la lista y "Desbloquear". */
export function BlockedUsersSection() {
  const blocked = useBlockedUsers();
  const unblock = useUnblockUser();

  if (blocked.isPending) return null;
  if (blocked.isError) {
    return <FormMessage tone="error" message="No pudimos cargar los usuarios bloqueados." />;
  }
  if (blocked.data.length === 0) {
    return (
      <Card>
        <Text variant="caption">
          No bloqueaste a nadie. Para bloquear a alguien, abrí su perfil desde la clasificación.
        </Text>
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
            label="Desbloquear"
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
