import { defineStrings } from '..';

/** Crear cuenta (src/app/(auth)/sign-up.tsx). */
export const signUpStrings = defineStrings({
  es: {
    checkEmailTitle: 'Revisa tu email',
    checkEmailMessage: (email: string) =>
      `Enviamos un enlace de confirmación a ${email}. Ábrelo desde este teléfono para activar tu cuenta.`,
    goToSignIn: 'Ir a iniciar sesión',
    title: 'Crear cuenta',
    email: 'Email',
    password: 'Contraseña',
    passwordHint: 'Mínimo 6 caracteres.',
    confirmPassword: 'Repetir contraseña',
    submit: 'Crear cuenta',
    haveAccount: '¿Ya tienes cuenta? ',
    signIn: 'Inicia sesión',
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
  'pt-BR': {
    checkEmailTitle: 'Confira seu e-mail',
    checkEmailMessage: (email: string) =>
      `Enviamos um link de confirmação para ${email}. Abra pelo celular para ativar sua conta.`,
    goToSignIn: 'Ir para o login',
    title: 'Criar conta',
    email: 'E-mail',
    password: 'Senha',
    passwordHint: 'Mínimo de 6 caracteres.',
    confirmPassword: 'Repetir senha',
    submit: 'Criar conta',
    haveAccount: 'Já tem conta? ',
    signIn: 'Entrar',
  },
  it: {
    checkEmailTitle: 'Controlla la tua email',
    checkEmailMessage: (email: string) =>
      `Abbiamo inviato un link di conferma a ${email}. Aprilo da questo telefono per attivare il tuo account.`,
    goToSignIn: 'Vai all’accesso',
    title: 'Crea account',
    email: 'Email',
    password: 'Password',
    passwordHint: 'Almeno 6 caratteri.',
    confirmPassword: 'Ripeti la password',
    submit: 'Crea account',
    haveAccount: 'Hai già un account? ',
    signIn: 'Accedi',
  },
  fr: {
    checkEmailTitle: 'Vérifie tes e-mails',
    checkEmailMessage: (email: string) =>
      `On a envoyé un lien de confirmation à ${email}. Ouvre-le sur ce téléphone pour activer ton compte.`,
    goToSignIn: 'Aller à la connexion',
    title: 'Créer un compte',
    email: 'E-mail',
    password: 'Mot de passe',
    passwordHint: '6 caractères minimum.',
    confirmPassword: 'Confirme le mot de passe',
    submit: 'Créer un compte',
    haveAccount: 'Déjà un compte ? ',
    signIn: 'Connecte-toi',
  },
});
