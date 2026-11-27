import { defineStrings } from '..';

/** Nueva contraseña tras el enlace de recuperación (src/app/reset-password.tsx). */
export const resetPasswordStrings = defineStrings({
  es: {
    title: 'Nueva contraseña',
    subtitle: 'Elige una contraseña que no uses en otros sitios.',
    password: 'Contraseña nueva',
    passwordHint: 'Mínimo 6 caracteres.',
    confirmPassword: 'Repetir contraseña',
    save: 'Guardar contraseña',
    cancel: 'Cancelar y cerrar sesión',
  },
  en: {
    title: 'New password',
    subtitle: 'Pick a password you don’t use on other sites.',
    password: 'New password',
    passwordHint: 'At least 6 characters.',
    confirmPassword: 'Confirm password',
    save: 'Save password',
    cancel: 'Cancel and sign out',
  },
  'pt-BR': {
    title: 'Nova senha',
    subtitle: 'Escolha uma senha que você não use em outros sites.',
    password: 'Nova senha',
    passwordHint: 'Mínimo de 6 caracteres.',
    confirmPassword: 'Repetir senha',
    save: 'Salvar senha',
    cancel: 'Cancelar e sair',
  },
  it: {
    title: 'Nuova password',
    subtitle: 'Scegli una password che non usi su altri siti.',
    password: 'Nuova password',
    passwordHint: 'Almeno 6 caratteri.',
    confirmPassword: 'Ripeti la password',
    save: 'Salva password',
    cancel: 'Annulla ed esci',
  },
});
