import { router } from 'expo-router';
import type { ReactNode } from 'react';

import { Button, Card, LoadingState, Screen, ScreenHeader, Text } from '@/design-system';

import { useAdminSession, useIsSuperadminAccount } from './api';

/**
 * Entrada al panel: la base decide (admin_session_check). Alcanza con la sesión de janitogap
 * (sin MFA desde 20270102120000_superadmin_no_mfa); cualquier otra cuenta ve «Acceso denegado».
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const isAdminAccount = useIsSuperadminAccount();
  const session = useAdminSession(isAdminAccount);

  if (!isAdminAccount) return <Denied />;
  if (session.isPending) return <LoadingState />;
  if (session.error) return <Denied detail="No se pudo verificar el acceso." onRetry={() => void session.refetch()} />;
  if (!session.data?.allowed) return <Denied />;
  return <>{children}</>;
}

function Denied({ detail, onRetry }: { detail?: string; onRetry?: () => void }) {
  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader title="Administración" onBack={() => router.back()} />
      <Card>
        <Text variant="heading">Acceso denegado</Text>
        <Text variant="body">{detail ?? 'Esta cuenta no es la administradora de Polygo.'}</Text>
        {onRetry ? <Button label="Reintentar" variant="secondary" onPress={onRetry} /> : null}
      </Card>
    </Screen>
  );
}
