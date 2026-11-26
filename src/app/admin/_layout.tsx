import { Stack } from 'expo-router';

import { AdminGate } from '@/features/admin/AdminGate';

/**
 * Panel de administración (sólo janitogap). El gate consulta a la base: cualquier otra cuenta ve
 * «Acceso denegado» y la base no le devuelve datos.
 */
export default function AdminLayout() {
  return (
    <AdminGate>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </AdminGate>
  );
}
