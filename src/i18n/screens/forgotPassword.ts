import { defineStrings } from '..';

/** Recuperar contraseña (src/app/(auth)/forgot-password.tsx). */
export const forgotPasswordStrings = defineStrings({
  es: {
    title: 'Recuperar contraseña',
    subtitle: 'Te enviamos un enlace para elegir una contraseña nueva.',
    email: 'Email',
    sent: 'Si existe una cuenta con ese email, vas a recibir un enlace. Abrilo desde este teléfono.',
    send: 'Enviar enlace',
    resend: 'Reenviar enlace',
  },
  en: {
    title: 'Reset password',
    subtitle: 'We’ll send you a link to choose a new password.',
    email: 'Email',
    sent: 'If an account exists for this email, you’ll get a link. Open it on this phone.',
    send: 'Send link',
    resend: 'Resend link',
  },
});
