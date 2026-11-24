import { defineStrings } from '..';

/** Crear cuenta (src/app/(auth)/sign-up.tsx). */
export const signUpStrings = defineStrings({
  es: {
    checkEmailTitle: 'Revisá tu email',
    checkEmailMessage: (email: string) =>
      `Enviamos un enlace de confirmación a ${email}. Abrilo desde este teléfono para activar tu cuenta.`,
    goToSignIn: 'Ir a iniciar sesión',
    title: 'Crear cuenta',
    email: 'Email',
    password: 'Contraseña',
    passwordHint: 'Mínimo 6 caracteres.',
    confirmPassword: 'Repetir contraseña',
    submit: 'Crear cuenta',
    haveAccount: '¿Ya tenés cuenta? ',
    signIn: 'Iniciá sesión',
  },
  en: {
    checkEmailTitle: 'Check your email',
    checkEmailMessage: (email: string) =>
      `We sent a confirmation link to ${email}. Open it on this phone to activate your account.`,
    goToSignIn: 'Go to sign in',
    title: 'Create account',
    email: 'Email',
    password: 'Password',
    passwordHint: 'At least 6 characters.',
    confirmPassword: 'Confirm password',
    submit: 'Create account',
    haveAccount: 'Already have an account? ',
    signIn: 'Sign in',
  },
});
