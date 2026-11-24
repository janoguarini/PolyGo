/**
 * Invitaciones con recompensas. Fuente única de los valores: la base los replica en
 * public.referral_config() (migración 20261222120100_referrals) y supabase/tests/referrals.test.mjs
 * compara ambos lados. Toda la validación y la entrega de premios ocurre en el servidor; la app sólo
 * muestra.
 *
 * El código de invitación es el código de amigo de siempre (profiles.public_code, 'PG-XXXXXX').
 */

export type BadgeId = 'recruiter' | 'ambassador' | 'elite_inviter';

export interface ReferralMilestone {
  /** Amigos válidos necesarios. */
  at: number;
  polys: number;
  /** Días de PolyGo Plus (energía ilimitada) que se suman (20261225120100_referral_plus_days). */
  plus_days: number;
  badge: BadgeId;
  /** Cosméticos exclusivos que se desbloquean (ids de shared/cosmetics.ts). */
  items: readonly string[];
}

export const REFERRALS = {
  /** Días desde que se creó la cuenta del invitado en los que todavía puede cargar un código. */
  attributionWindowDays: 7,
  milestones: [
    { at: 3, polys: 0, plus_days: 7, badge: 'recruiter', items: [] },
    { at: 5, polys: 750, plus_days: 0, badge: 'ambassador', items: ['skin-social-explorer'] },
    {
      at: 10,
      polys: 0,
      plus_days: 30,
      badge: 'elite_inviter',
      items: ['skin-team-legend', 'frame_referral_legend'],
    },
  ],
} as const satisfies {
  attributionWindowDays: number;
  milestones: readonly ReferralMilestone[];
};

export const REFERRAL_GOAL = REFERRALS.milestones[REFERRALS.milestones.length - 1]!.at;

export const BADGES: Record<BadgeId, { name: string; description: string }> = {
  recruiter: { name: 'Reclutador', description: '3 amigos aprendiendo con vos' },
  ambassador: { name: 'Embajador PolyGo', description: '5 amigos aprendiendo con vos' },
  elite_inviter: { name: 'Invitador Élite', description: '10 amigos aprendiendo con vos' },
};

/** Paso que le falta a una invitación pendiente (lo calcula el servidor). */
export type ReferralMissingStep = 'verify_email' | 'onboarding' | 'first_activity';

export function missingStepLabel(step: ReferralMissingStep | null | undefined): string {
  switch (step) {
    case 'verify_email':
      return 'Falta verificar su email';
    case 'onboarding':
      return 'Falta terminar el registro';
    case 'first_activity':
      return 'Falta su primera lección';
    default:
      return 'Validando…';
  }
}

/** Dominio público para los enlaces de invitación. */
export const INVITE_BASE_URL = 'https://polygo.app/invite/';

export function inviteLink(code: string): string {
  return `${INVITE_BASE_URL}${code}`;
}

/**
 * Extrae un código de lo que pegue o abra el usuario: 'PG-ABC123', 'abc123', el enlace web o el
 * deep link polygo://invite/PG-ABC123. null si no hay un código con forma válida (el servidor
 * decide si existe).
 */
export function parseInviteCode(input: string | null | undefined): string | null {
  if (!input) return null;
  const match = /(?:^|[/\s])(?:PG-)?([A-Z0-9]{6})\s*$/i.exec(input.trim());
  return match ? `PG-${match[1]!.toUpperCase()}` : null;
}

/** Próximo hito sin alcanzar (o null si ya llegó al máximo). */
export function nextMilestone(qualified: number): ReferralMilestone | null {
  return REFERRALS.milestones.find((m) => qualified < m.at) ?? null;
}

export const INVITE_SHARE_MESSAGE =
  '¡Estoy aprendiendo idiomas en PolyGo! Sumate con mi invitación y desbloqueemos recompensas juntos. 🚀';
