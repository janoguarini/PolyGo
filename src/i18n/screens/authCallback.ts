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
  'pt-BR': {
    invalidLink: 'O link não é válido ou está incompleto.',
    verifying: 'Verificando link…',
    errorTitle: 'Não conseguimos verificar o link',
    backHome: 'Voltar ao início',
  },
  it: {
    invalidLink: 'Il link non è valido o è incompleto.',
    verifying: 'Verifica del link…',
    errorTitle: 'Non siamo riusciti a verificare il link',
    backHome: 'Torna all’inizio',
  },
});
