import type { BadgeId, ReferralMissingStep } from '@shared/referrals';

import { defineStrings } from '@/i18n';

/**
 * Invitaciones. shared/referrals.ts guarda insignias, pasos y mensaje en español y lo replica la base
 * (supabase/tests/referrals.test.mjs): acá van, por id, los textos para la interfaz.
 */
export const referralStrings = defineStrings({
  es: {
    badges: {
      recruiter: { name: 'Reclutador', description: '3 amigos aprendiendo contigo' },
      ambassador: { name: 'Embajador PolyGo', description: '5 amigos aprendiendo contigo' },
      elite_inviter: { name: 'Invitador Élite', description: '10 amigos aprendiendo contigo' },
    } satisfies Record<BadgeId, { name: string; description: string }>,
    missingStep: {
      verify_email: 'Falta verificar su email',
      onboarding: 'Falta terminar el registro',
      first_activity: 'Falta su primera lección',
    } satisfies Record<ReferralMissingStep, string>,
    validating: 'Validando…',
    shareMessage:
      '¡Estoy aprendiendo idiomas en PolyGo! Súmate con mi invitación y desbloqueemos recompensas juntos. 🚀',
    // Errores del servidor (referralErrorMessage)
    errorSelf: 'No puedes usar tu propio código.',
    errorAlreadyAttributed: 'Tu cuenta ya tiene una invitación registrada.',
    errorWindowClosed:
      'Los códigos de invitación sólo se pueden usar en los primeros días de una cuenta nueva.',
    errorNotEligible: 'Este código no es válido para tu cuenta.',
    errorInvalidCode: 'No encontramos ese código. Revísalo e inténtalo de nuevo.',
    errorGeneric: 'No pudimos registrar la invitación. Inténtalo de nuevo en un rato.',
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
  },
  'pt-BR': {
    badges: {
      recruiter: { name: 'Recrutador', description: '3 amigos aprendendo com você' },
      ambassador: { name: 'Embaixador PolyGo', description: '5 amigos aprendendo com você' },
      elite_inviter: { name: 'Convidador Elite', description: '10 amigos aprendendo com você' },
    },
    missingStep: {
      verify_email: 'Falta verificar o e-mail',
      onboarding: 'Falta terminar o cadastro',
      first_activity: 'Falta fazer a primeira lição',
    },
    validating: 'Validando…',
    shareMessage:
      'Estou aprendendo idiomas no PolyGo! Entre com o meu convite e vamos desbloquear recompensas juntos. 🚀',
    errorSelf: 'Você não pode usar o seu próprio código.',
    errorAlreadyAttributed: 'Sua conta já tem um convite registrado.',
    errorWindowClosed:
      'Os códigos de convite só podem ser usados nos primeiros dias de uma conta nova.',
    errorNotEligible: 'Este código não é válido para a sua conta.',
    errorInvalidCode: 'Não encontramos esse código. Confira e tente de novo.',
    errorGeneric: 'Não conseguimos registrar o convite. Tente de novo daqui a pouco.',
  },
  it: {
    badges: {
      recruiter: { name: 'Reclutatore', description: '3 amici che imparano con te' },
      ambassador: { name: 'Ambasciatore PolyGo', description: '5 amici che imparano con te' },
      elite_inviter: { name: 'Invitatore Élite', description: '10 amici che imparano con te' },
    },
    missingStep: {
      verify_email: 'Deve ancora verificare l’email',
      onboarding: 'Deve ancora finire la registrazione',
      first_activity: 'Deve ancora fare la prima lezione',
    },
    validating: 'Verifica in corso…',
    shareMessage:
      'Sto imparando le lingue su PolyGo! Unisciti con il mio invito e sblocchiamo ricompense insieme. 🚀',
    errorSelf: 'Non puoi usare il tuo codice.',
    errorAlreadyAttributed: 'Il tuo account ha già un invito registrato.',
    errorWindowClosed:
      'I codici invito si possono usare solo nei primi giorni di un account nuovo.',
    errorNotEligible: 'Questo codice non è valido per il tuo account.',
    errorInvalidCode: 'Non abbiamo trovato questo codice. Controllalo e riprova.',
    errorGeneric: 'Non siamo riusciti a registrare l’invito. Riprova tra un po’.',
  },
});
