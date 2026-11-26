import { useQueryClient } from '@tanstack/react-query';
import { router, type Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Card, Screen, ScreenHeader, Text, colors, spacing, useTheme } from '@/design-system';
import { useAdmin, usePeriodArgs } from '@/features/admin/api';
import { Kpi, KpiGrid, PeriodBar } from '@/features/admin/components';
import { MODULES } from '@/features/admin/modules';
import { fmtInt } from '@/features/admin/format';

/** Inicio del panel: período, lo más importante de un vistazo y los 13 módulos. */
export default function AdminHome() {
  useTheme();
  const qc = useQueryClient();
  const overview = useAdmin('admin_overview', usePeriodArgs());
  const s = overview.data?.snapshot;
  return (
    <Screen
      edges={['top', 'bottom']}
      contentStyle={styles.content}
      onRefresh={() => void qc.invalidateQueries({ queryKey: ['admin'] })}
      refreshing={overview.isRefetching}
    >
      <ScreenHeader title="Administración" onBack={() => router.back()} />
      <PeriodBar />
      <KpiGrid>
        <Kpi label="Usuarios" value={s?.total_users ?? null} />
        <Kpi label="DAU" value={s?.dau ?? null} />
        <Kpi label="MAU" value={s?.mau ?? null} />
        <Kpi label="Plus pagos" value={s?.paid_plus_users ?? null} />
      </KpiGrid>
      {overview.data?.alerts?.length ? (
        <Card onPress={() => router.push('/admin/overview' as Href)} accessibilityLabel="Ver alertas">
          <Text variant="bodyStrong" color="danger">
            {fmtInt(overview.data.alerts.length)} alerta(s) activas
          </Text>
        </Card>
      ) : null}
      {MODULES.map((m) => (
        <Card key={m.id} onPress={() => router.push(`/admin/${m.id}` as Href)} accessibilityLabel={m.label}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong">{m.label}</Text>
              <Text variant="caption">{m.hint}</Text>
            </View>
            <ChevronRight color={colors.textMuted} size={20} />
          </View>
        </Card>
      ))}
      <Text variant="caption" align="center">
        Sólo lectura. Cada consulta queda auditada.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
