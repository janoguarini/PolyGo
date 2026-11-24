import { defineStrings } from '..';

/** Destino de los enlaces de email (src/app/auth-callback.tsx). */
export const authCallbackStrings = defineStrings({
  es: {
    invalidLink: 'El enlace no es válido o está incompleto.',
    verifying: 'Verificando enlace…',
    errorTitle: 'No pudimos verificar el enlace',
    backHome: 'Volver al inicio',
  },
  en: {
    invalidLink: 'This link is invalid or incomplete.',
    verifying: 'Verifying link…',
    errorTitle: 'We couldn’t verify the link',
    backHome: 'Back to start',
  },
});
