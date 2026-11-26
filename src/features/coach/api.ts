import { useQuery } from '@tanstack/react-query';

import { coachTrialRemaining, FREE_LIMITS } from '@shared/plus';

import { useAuth } from '@/features/auth/AuthProvider';
import { requireSupabase } from '@/lib/supabase';

export interface CoachSessionRecord {
  sessionId: string;
  languageCode: string;
  unitIds: string[];
  trial: boolean;
  createdAt: string;
  /** null mientras no se terminó. */
  completedAt: string | null;
  correct: number | null;
  total: number | null;
}

export interface CoachStatus {
  plus: boolean;
  trialLimit: number;
  trialUsed: number;
  trialRemaining: number;
  /** Puede empezar una sesión personalizada ahora (Plus o le quedan pruebas). */
  canStart: boolean;
  sessions: CoachSessionRecord[];
}

export const coachKeys = {
  status: (userId: string) => ['learning', 'coach', userId] as const,
};

export function parseCoachStatus(raw: unknown): CoachStatus {
  const r = (raw ?? {}) as Record<string, unknown>;
  const plus = r.plus === true;
  const trialLimit =
    typeof r.trial_limit === 'number' ? r.trial_limit : FREE_LIMITS.coachTrialSessions;
  const trialUsed = typeof r.trial_used === 'number' ? r.trial_used : 0;
  const trialRemaining = coachTrialRemaining(trialUsed, trialLimit);
  const sessions = Array.isArray(r.sessions) ? (r.sessions as Record<string, unknown>[]) : [];
  return {
    plus,
    trialLimit,
    trialUsed,
    trialRemaining,
    canStart: plus || trialRemaining > 0,
    sessions: sessions.map((s) => ({
      sessionId: String(s.session_id),
      languageCode: String(s.language_code),
      unitIds: Array.isArray(s.unit_ids) ? s.unit_ids.map(String) : [],
      trial: s.trial === true,
      createdAt: String(s.created_at),
      completedAt: typeof s.completed_at === 'string' ? s.completed_at : null,
      correct: typeof s.correct === 'number' ? s.correct : null,
      total: typeof s.total === 'number' ? s.total : null,
    })),
  };
}

export async function fetchCoachStatus(): Promise<CoachStatus> {
  const { data, error } = await requireSupabase().rpc('get_coach_status');
  if (error) throw error;
  return parseCoachStatus(data);
}

/**
 * Pruebas usadas y restantes según el SERVIDOR (coach_sessions): reinstalar, cerrar sesión o cambiar
 * de teléfono no las reinicia. Dentro de ['learning']: terminar un repaso la vuelve a leer.
 */
export function useCoachStatus() {
  const { session } = useAuth();
  const userId = session?.user.id;
  return useQuery({
    queryKey: coachKeys.status(userId ?? 'anonymous'),
    queryFn: fetchCoachStatus,
    enabled: Boolean(userId),
  });
}
