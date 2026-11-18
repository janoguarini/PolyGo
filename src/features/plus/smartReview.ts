// Las reglas viven en shared/focusReview.ts: el servidor arma y corrige el repaso con ellas (fase 4, P3)
// y la app sólo las usa para contar lo disponible.
import type { SmartReason } from '@shared/focusReview';

export { DUE_SOON_MS, SMART_REVIEW_SIZE, pickSmartReview, type SmartReason } from '@shared/focusReview';

export const SMART_REASON_LABELS: Record<SmartReason, string> = {
  due: 'Toca repasarla',
  frequent_mistakes: 'Te equivocaste varias veces',
  difficult: 'Todavía te cuesta',
  due_soon: 'Está por olvidarse',
};
