import { defineStrings } from '..';

/** Iniciar sesión (src/app/(auth)/sign-in.tsx). */
export const signInStrings = defineStrings({
  es: {
    title: 'Iniciar sesión',
    subtitle: 'Tu rango te está esperando.',
    email: 'Email',
    password: 'Contraseña',
    submit: 'Entrar',
    forgotPassword: '¿Olvidaste tu contraseña?',
    noAccount: '¿No tenés cuenta? ',
    signUp: 'Registrate',
  },
  en: {
    title: 'Sign in',
    subtitle: 'Your rank is waiting for you.',
    email: 'Email',
    password: 'Password',
    submit: 'Sign in',
    forgotPassword: 'Forgot your password?',
    noAccount: 'Don’t have an account? ',
    signUp: 'Sign up',
  },
});
