import type { BadgeId, ReferralMissingStep } from '@shared/referrals';

import { defineStrings } from '@/i18n';

/**
 * Invitaciones. shared/referrals.ts guarda insignias, pasos y mensaje en español y lo replica la base
 * (supabase/tests/referrals.test.mjs): acá van, por id, los textos para la interfaz.
 */
export const referralStrings = defineStrings({
  es: {
    badges: {
      recruiter: { name: 'Reclutador', description: '3 amigos aprendiendo con vos' },
      ambassador: { name: 'Embajador PolyGo', description: '5 amigos aprendiendo con vos' },
      elite_inviter: { name: 'Invitador Élite', description: '10 amigos aprendiendo con vos' },
    } satisfies Record<BadgeId, { name: string; description: string }>,
    missingStep: {
      verify_email: 'Falta verificar su email',
      onboarding: 'Falta terminar el registro',
      first_activity: 'Falta su primera lección',
    } satisfies Record<ReferralMissingStep, string>,
    validating: 'Validando…',
    shareMessage:
      '¡Estoy aprendiendo idiomas en PolyGo! Sumate con mi invitación y desbloqueemos recompensas juntos. 🚀',
    // Errores del servidor (referralErrorMessage)
    errorSelf: 'No podés usar tu propio código.',
    errorAlreadyAttributed: 'Tu cuenta ya tiene una invitación registrada.',
    errorWindowClosed:
      'Los códigos de invitación sólo se pueden usar en los primeros días de una cuenta nueva.',
    errorNotEligible: 'Este código no es válido para tu cuenta.',
    errorInvalidCode: 'No encontramos ese código. Revisalo y probá de nuevo.',
    errorGeneric: 'No pudimos registrar la invitación. Probá de nuevo en un rato.',
    // InviteRewardsCard
    cardA11y: (qualified: number, goal: number) =>
      `Invitá amigos y ganá recompensas. ${qualified} de ${goal} amigos válidos`,
    cardOverline: 'INVITÁ AMIGOS Y GANÁ RECOMPENSAS',
    cardMissing: (n: number) => `Te faltan ${n} para tu próximo premio`,
    cardAllUnlocked: '¡Desbloqueaste todas las recompensas!',
    validFriendsA11y: (qualified: number, goal: number) => `${qualified} de ${goal} amigos válidos`,
    validFriends: (qualified: number, goal: number) => `${qualified} / ${goal} amigos válidos`,
  },
  en: {
    badges: {
      recruiter: { name: 'Recruiter', description: '3 friends learning with you' },
      ambassador: { name: 'PolyGo Ambassador', description: '5 friends learning with you' },
      elite_inviter: { name: 'Elite Inviter', description: '10 friends learning with you' },
    },
    missingStep: {
      verify_email: 'Needs to verify their email',
      onboarding: 'Needs to finish signing up',
      first_activity: 'Needs to do their first lesson',
    },
    validating: 'Validating…',
    shareMessage:
      'I’m learning languages on PolyGo! Join with my invite and let’s unlock rewards together. 🚀',
    errorSelf: 'You can’t use your own code.',
    errorAlreadyAttributed: 'Your account already has an invite registered.',
    errorWindowClosed: 'Invite codes can only be used during the first few days of a new account.',
    errorNotEligible: 'This code isn’t valid for your account.',
    errorInvalidCode: 'We couldn’t find that code. Check it and try again.',
    errorGeneric: 'We couldn’t register the invite. Try again in a bit.',
    cardA11y: (qualified: number, goal: number) =>
      `Invite friends and earn rewards. ${qualified} of ${goal} valid friends`,
    cardOverline: 'INVITE FRIENDS AND EARN REWARDS',
    cardMissing: (n: number) =>
      n === 1 ? '1 more to your next reward' : `${n} more to your next reward`,
    cardAllUnlocked: 'You unlocked every reward!',
    validFriendsA11y: (qualified: number, goal: number) => `${qualified} of ${goal} valid friends`,
    validFriends: (qualified: number, goal: number) => `${qualified} / ${goal} valid friends`,
  },
});
