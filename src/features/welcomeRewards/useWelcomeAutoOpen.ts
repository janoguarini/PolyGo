import { router } from 'expo-router';
import { useEffect } from 'react';

import { hasWelcomeRewardToday, useWelcomeRewards } from './api';

/** Una vez por sesión de la app: no vuelve a abrirse si el usuario la cerró sin cobrar. */
let openedThisSession = false;

/**
 * Abre la recompensa de bienvenida sola al entrar a Inicio cuando hay un premio para cobrar hoy.
 * Con la migración sin aplicar, el estado es null y no pasa nada.
 */
export function useWelcomeAutoOpen(enabled: boolean) {
  const rewards = useWelcomeRewards();
  const show = enabled && hasWelcomeRewardToday(rewards.data);
  useEffect(() => {
    if (!show || openedThisSession) return;
    openedThisSession = true;
    // Deja que Inicio termine de montarse antes de presentar la pantalla.
    const id = setTimeout(() => router.push('/welcome-rewards'), 600);
    return () => clearTimeout(id);
  }, [show]);
}
