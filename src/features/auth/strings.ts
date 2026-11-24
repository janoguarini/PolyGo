import { defineStrings } from '@/i18n';

/** Textos compartidos de autenticación: validación, botones de Google/Apple y configuración. */
export const authStrings = defineStrings({
  es: {
    validation: {
      invalidEmail: 'Ingresá un email válido.',
      passwordMin: 'Mínimo 6 caracteres.',
      passwordMax: 'Máximo 72 caracteres.',
      passwordRequired: 'Ingresá tu contraseña.',
      passwordsDontMatch: 'Las contraseñas no coinciden.',
    },
    google: {
      label: 'Continuar con Google',
      hint: 'Abre Google para elegir tu cuenta y vuelve a Polygo',
      cancelled: 'Cancelaste el inicio con Google. Podés intentarlo de nuevo o usar tu email.',
    },
    apple: {
      label: 'Continuar con Apple',
      hint: 'Abre la hoja de Apple para entrar con tu Apple ID',
      cancelled: 'Cancelaste el inicio con Apple. Podés intentarlo de nuevo o usar otro método.',
    },
    dividerEmail: 'o con tu email',
    dividerContinueWith: 'o continuá con',
    configMissing: {
      title: 'Falta configurar el backend',
      message:
        'Polygo necesita un proyecto de Supabase para registrar usuarios y guardar el progreso.',
      missingVariables: 'VARIABLES FALTANTES O INVÁLIDAS',
      howToFix: 'Cómo resolverlo',
      step1: '1. Copiá .env.example a .env en la raíz del proyecto.',
      step2: '2. Completá la URL y la anon key de tu proyecto Supabase.',
      step3: '3. Aplicá las migraciones de supabase/migrations.',
      step4: '4. Reiniciá con: npx expo start --clear',
    },
  },
  en: {
    validation: {
      invalidEmail: 'Enter a valid email.',
      passwordMin: 'At least 6 characters.',
      passwordMax: 'At most 72 characters.',
      passwordRequired: 'Enter your password.',
      passwordsDontMatch: 'Passwords don’t match.',
    },
    google: {
      label: 'Continue with Google',
      hint: 'Opens Google so you can pick your account, then brings you back to Polygo',
      cancelled: 'You canceled Google sign-in. You can try again or use your email.',
    },
    apple: {
      label: 'Continue with Apple',
      hint: 'Opens the Apple sheet so you can sign in with your Apple ID',
      cancelled: 'You canceled Apple sign-in. You can try again or use another method.',
    },
    dividerEmail: 'or use your email',
    dividerContinueWith: 'or continue with',
    configMissing: {
      title: 'Backend not configured',
      message: 'Polygo needs a Supabase project to sign up users and save progress.',
      missingVariables: 'MISSING OR INVALID VARIABLES',
      howToFix: 'How to fix it',
      step1: '1. Copy .env.example to .env in the project root.',
      step2: '2. Fill in the URL and anon key of your Supabase project.',
      step3: '3. Apply the migrations in supabase/migrations.',
      step4: '4. Restart with: npx expo start --clear',
    },
  },
});

/** Pantalla de bienvenida (features/auth/welcome). */
export const welcomeStrings = defineStrings({
  es: {
    heroLabel: 'El zorro de PolyGo festejando frente a un globo terráqueo, con escudos de rango',
    headlineLine1: 'Aprendé jugando.',
    headlineLine2: 'Competí para subir.',
    subtitle: 'Desafiá a jugadores reales, mejorá tu inglés\ny conquistá nuevos rangos.',
    features: [
      { title: 'Aprendé', text: 'Lecciones cortas y efectivas' },
      { title: 'Competí', text: 'Batallas 1 vs 1 en tiempo real' },
      { title: 'Subí de rango', text: 'De Bronce a Gran Maestro' },
    ],
    createAccount: 'Crear cuenta',
    haveAccount: 'Ya tengo cuenta',
  },
  en: {
    heroLabel: 'The Polygo fox celebrating in front of a globe, with rank shields',
    headlineLine1: 'Learn by playing.',
    headlineLine2: 'Compete to climb.',
    subtitle: 'Challenge real players, level up your language\nskills and conquer new ranks.',
    features: [
      { title: 'Learn', text: 'Short, effective lessons' },
      { title: 'Compete', text: 'Real-time 1 vs 1 battles' },
      { title: 'Rank up', text: 'From Bronze to Grandmaster' },
    ],
    createAccount: 'Create account',
    haveAccount: 'I already have an account',
  },
});
