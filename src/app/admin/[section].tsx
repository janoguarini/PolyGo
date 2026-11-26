import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { EmptyState, Screen, ScreenHeader, spacing, useTheme } from '@/design-system';
import { PeriodBar } from '@/features/admin/components';
import { MODULES, ModuleView, type ModuleId } from '@/features/admin/modules';

/** Sin período: estos módulos muestran el estado actual. */
const NO_PERIOD: readonly ModuleId[] = ['users', 'health', 'content', 'admin'];

export default function AdminSection() {
  useTheme();
  const qc = useQueryClient();
  const { section } = useLocalSearchParams<{ section: string }>();
  const mod = MODULES.find((m) => m.id === section);
  return (
    <Screen
      edges={['top', 'bottom']}
      contentStyle={styles.content}
      onRefresh={() => void qc.invalidateQueries({ queryKey: ['admin'] })}
      refreshing={false}
    >
      <ScreenHeader title={mod?.label ?? 'Administración'} onBack={() => router.back()} />
      {mod ? (
        <>
          {NO_PERIOD.includes(mod.id) ? null : <PeriodBar />}
          <ModuleView id={mod.id} />
        </>
      ) : (
        <EmptyState title="Módulo inexistente" />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { gap: spacing.md } });
