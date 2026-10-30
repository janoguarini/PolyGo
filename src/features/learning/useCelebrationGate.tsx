import { useState, type ReactNode } from 'react';

import { useMyProfile } from '@/features/profile/hooks';

import type { LearningSummary } from './api';
import { DailyCelebration } from './components/DailyCelebration';
import { useLearningSummary } from './hooks';
import { celebrationFor } from './streak';

/**
 * Festejo de racha / objetivo diario entre los resultados de una sesión y lo que sigue.
 * Guarda el resumen de antes de la sesión y lo compara con el que se refresca al guardarla.
 * `guard(action)` envuelve los botones de los resultados: la primera vez muestra el festejo y
 * al continuar ejecuta la acción.
 */
export function useCelebrationGate(
  submit: { isSuccess: boolean; submittedAt: number },
  enabled = true,
): { screen: ReactNode; guard: (action: () => void) => () => void } {
  const summary = useLearningSummary();
  const goal = useMyProfile().data?.profile.daily_goal_minutes;
  const [before, setBefore] = useState<LearningSummary | null>(null);
  const [pending, setPending] = useState<(() => void) | null>(null);
  const [shown, setShown] = useState(false);

  // Sólo vale una foto tomada antes de enviar la sesión.
  if (enabled && !before && summary.data && !submit.submittedAt) setBefore(summary.data);

  const after = summary.data;
  const fresh = submit.isSuccess && after && summary.dataUpdatedAt > submit.submittedAt;
  const celebration =
    enabled && fresh && before && goal !== undefined ? celebrationFor(before, after, goal) : null;

  const guard = (action: () => void) => () => {
    if (celebration && !shown) {
      setShown(true);
      setPending(() => action);
    } else {
      action();
    }
  };

  const screen =
    pending && celebration ? (
      <DailyCelebration celebration={celebration} onContinue={pending} />
    ) : null;
  return { screen, guard };
}
