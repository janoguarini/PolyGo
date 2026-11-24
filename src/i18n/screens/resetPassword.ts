import { defineStrings } from '..';

/** Nueva contraseña tras el enlace de recuperación (src/app/reset-password.tsx). */
export const resetPasswordStrings = defineStrings({
  es: {
    title: 'Nueva contraseña',
    subtitle: 'Elegí una contraseña que no uses en otros sitios.',
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
});
