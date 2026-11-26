import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { useAuth } from '@/features/auth/AuthProvider';

import { energyKeys } from './api';
import { entitlementKeys } from './entitlements';
import { forgetPurchaser, identifyPurchaser, storeSupported } from './purchases';

/**
 * Asocia la tienda a la cuenta PolyGo que inició sesión (RevenueCat appUserID = user.id) y la
 * desasocia al salir. Al volver a la app relee los derechos: una renovación, cancelación o reembolso
 * hecho desde los ajustes del teléfono se ve sin reiniciar. No dibuja nada.
 */
export function PurchasesBootstrap() {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;
  const queryClient = useQueryClient();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    if (!storeSupported()) return;
    if (userId) void identifyPurchaser(userId);
    else if (previous.current) void forgetPurchaser();
    previous.current = userId;
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      void queryClient.invalidateQueries({ queryKey: entitlementKeys.state(userId) });
      void queryClient.invalidateQueries({ queryKey: energyKeys.state(userId) });
    });
    return () => sub.remove();
  }, [queryClient, userId]);

  return null;
}
