import { defineStrings } from '..';

/** Recuperar contraseña (src/app/(auth)/forgot-password.tsx). */
export const forgotPasswordStrings = defineStrings({
  es: {
    title: 'Recuperar contraseña',
    subtitle: 'Te enviamos un enlace para elegir una contraseña nueva.',
    email: 'Email',
    sent: 'Si existe una cuenta con ese email, vas a recibir un enlace. Ábrelo desde este teléfono.',
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
  'pt-BR': {
    title: 'Recuperar senha',
    subtitle: 'Vamos te enviar um link para escolher uma nova senha.',
    email: 'E-mail',
    sent: 'Se existir uma conta com esse e-mail, você vai receber um link. Abra pelo celular.',
    send: 'Enviar link',
    resend: 'Reenviar link',
  },
  it: {
    title: 'Recupera password',
    subtitle: 'Ti inviamo un link per scegliere una nuova password.',
    email: 'Email',
    sent: 'Se esiste un account con questa email, riceverai un link. Aprilo da questo telefono.',
    send: 'Invia link',
    resend: 'Invia di nuovo il link',
  },
});
