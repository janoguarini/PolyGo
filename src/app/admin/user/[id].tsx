import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { EmptyState, Screen, ScreenHeader, spacing, useTheme } from '@/design-system';
import { UserDetailView } from '@/features/admin/modules';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Ficha administrativa de un usuario. */
export default function AdminUser() {
  useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const valid = typeof id === 'string' && UUID.test(id);
  return (
    <Screen edges={['top', 'bottom']} contentStyle={styles.content}>
      <ScreenHeader title="Ficha de usuario" onBack={() => router.back()} />
      {valid ? <UserDetailView id={id.toLowerCase()} /> : <EmptyState title="Usuario inválido" />}
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { gap: spacing.md } });
