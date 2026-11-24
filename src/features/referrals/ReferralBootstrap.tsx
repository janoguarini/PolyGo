import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { syncCosmetics } from '@/features/cosmetics/api';

import {
  claimReferral,
  clearPendingInviteCode,
  readPendingInviteCode,
  syncMyReferral,
} from './api';

/**
 * Montado con la sesión lista (registro terminado). Al abrir la app y al volver a primer plano:
 * - canjea el código de invitación guardado por un enlace (una vez; el servidor decide si vale),
 * - reevalúa la propia invitación (para que el referente reciba su premio cuando cumplís),
 * - concilia los exclusivos de Plus (si venció, se pausan sin borrar nada).
 * Todo es idempotente en el servidor; los errores no interrumpen al usuario.
 */
export function ReferralBootstrap() {
  const qc = useQueryClient();
  useEffect(() => {
    let running = false;
    const run = async () => {
      if (running) return;
      running = true;
      try {
        const code = await readPendingInviteCode();
        if (code) {
          try {
            await claimReferral(code);
            await clearPendingInviteCode();
          } catch (error) {
            // Un rechazo del servidor es definitivo (código inválido, cuenta vieja...): se descarta.
            // Un error de red deja el código para el próximo intento.
            if ((error as { code?: string } | null)?.code) await clearPendingInviteCode();
          }
        }
        await syncMyReferral().catch(() => null);
        const res = await syncCosmetics().catch(() => null);
        if (res && (res.suspended.length || res.restored.length)) {
          await qc.invalidateQueries({ queryKey: ['profile'] });
        }
      } finally {
        running = false;
      }
    };
    void run();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void run();
    });
    return () => sub.remove();
  }, [qc]);
  return null;
}
