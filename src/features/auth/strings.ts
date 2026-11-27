import { defineStrings } from '@/i18n';

/** Textos compartidos de autenticación: validación, botones de Google/Apple y configuración. */
export const authStrings = defineStrings({
  es: {
    validation: {
      invalidEmail: 'Ingresa un email válido.',
      passwordMin: 'Mínimo 6 caracteres.',
      passwordMax: 'Máximo 72 caracteres.',
      passwordRequired: 'Ingresa tu contraseña.',
      passwordsDontMatch: 'Las contraseñas no coinciden.',
    },
    google: {
      label: 'Continuar con Google',
      hint: 'Abre Google para elegir tu cuenta y vuelve a PolyGo',
      cancelled: 'Cancelaste el inicio con Google. Puedes intentarlo de nuevo o usar tu email.',
    },
    apple: {
      label: 'Continuar con Apple',
      hint: 'Abre la hoja de Apple para entrar con tu Apple ID',
      cancelled: 'Cancelaste el inicio con Apple. Puedes intentarlo de nuevo o usar otro método.',
    },
    dividerEmail: 'o con tu email',
    dividerContinueWith: 'o continúa con',
    configMissing: {
      title: 'Falta configurar el backend',
      message:
        'PolyGo necesita un proyecto de Supabase para registrar usuarios y guardar el progreso.',
      missingVariables: 'VARIABLES FALTANTES O INVÁLIDAS',
      howToFix: 'Cómo resolverlo',
      step1: '1. Copia .env.example a .env en la raíz del proyecto.',
      step2: '2. Completa la URL y la anon key de tu proyecto Supabase.',
      step3: '3. Aplica las migraciones de supabase/migrations.',
      step4: '4. Reinicia con: npx expo start --clear',
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
      hint: 'Opens Google so you can pick your account, then brings you back to PolyGo',
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
      message: 'PolyGo needs a Supabase project to sign up users and save progress.',
      missingVariables: 'MISSING OR INVALID VARIABLES',
      howToFix: 'How to fix it',
      step1: '1. Copy .env.example to .env in the project root.',
      step2: '2. Fill in the URL and anon key of your Supabase project.',
      step3: '3. Apply the migrations in supabase/migrations.',
      step4: '4. Restart with: npx expo start --clear',
    },
  },
  'pt-BR': {
    validation: {
      invalidEmail: 'Digite um e-mail válido.',
      passwordMin: 'Mínimo de 6 caracteres.',
      passwordMax: 'Máximo de 72 caracteres.',
      passwordRequired: 'Digite sua senha.',
      passwordsDontMatch: 'As senhas não coincidem.',
    },
    google: {
      label: 'Continuar com o Google',
      hint: 'Abre o Google para você escolher sua conta e volta para o PolyGo',
      cancelled: 'Você cancelou o login com o Google. Pode tentar de novo ou usar seu e-mail.',
    },
    apple: {
      label: 'Continuar com a Apple',
      hint: 'Abre a janela da Apple para entrar com seu Apple ID',
      cancelled: 'Você cancelou o login com a Apple. Pode tentar de novo ou usar outro método.',
    },
    dividerEmail: 'ou com seu e-mail',
    dividerContinueWith: 'ou continue com',
    configMissing: {
      title: 'Falta configurar o backend',
      message:
        'O PolyGo precisa de um projeto do Supabase para cadastrar usuários e salvar o progresso.',
      missingVariables: 'VARIÁVEIS AUSENTES OU INVÁLIDAS',
      howToFix: 'Como resolver',
      step1: '1. Copie .env.example para .env na raiz do projeto.',
      step2: '2. Preencha a URL e a anon key do seu projeto Supabase.',
      step3: '3. Aplique as migrações de supabase/migrations.',
      step4: '4. Reinicie com: npx expo start --clear',
    },
  },
  it: {
    validation: {
      invalidEmail: 'Inserisci un’email valida.',
      passwordMin: 'Minimo 6 caratteri.',
      passwordMax: 'Massimo 72 caratteri.',
      passwordRequired: 'Inserisci la password.',
      passwordsDontMatch: 'Le password non coincidono.',
    },
    google: {
      label: 'Continua con Google',
      hint: 'Apre Google per scegliere il tuo account e poi torna su PolyGo',
      cancelled: 'Hai annullato l’accesso con Google. Puoi riprovare o usare la tua email.',
    },
    apple: {
      label: 'Continua con Apple',
      hint: 'Apre la finestra di Apple per accedere con il tuo ID Apple',
      cancelled: 'Hai annullato l’accesso con Apple. Puoi riprovare o usare un altro metodo.',
    },
    dividerEmail: 'oppure con la tua email',
    dividerContinueWith: 'oppure continua con',
    configMissing: {
      title: 'Backend non configurato',
      message:
        'PolyGo ha bisogno di un progetto Supabase per registrare gli utenti e salvare i progressi.',
      missingVariables: 'VARIABILI MANCANTI O NON VALIDE',
      howToFix: 'Come risolvere',
      step1: '1. Copia .env.example in .env nella cartella principale del progetto.',
      step2: '2. Inserisci l’URL e la anon key del tuo progetto Supabase.',
      step3: '3. Applica le migrazioni in supabase/migrations.',
      step4: '4. Riavvia con: npx expo start --clear',
    },
  },
});

/** Pantalla de bienvenida (features/auth/welcome). */
export const welcomeStrings = defineStrings({
  es: {
    heroLabel: 'El zorro de PolyGo festejando frente a un globo terráqueo, con escudos de rango',
    headlineLine1: 'Aprende jugando.',
    headlineLine2: 'Compite para subir.',
    subtitle: 'Desafía a jugadores reales, mejora tu inglés\ny conquista nuevos rangos.',
    features: [
      { title: 'Aprende', text: 'Lecciones cortas y efectivas' },
      { title: 'Compite', text: 'Batallas 1 vs 1 en tiempo real' },
      { title: 'Sube de rango', text: 'De Bronce a Gran Maestro' },
    ],
    createAccount: 'Crear cuenta',
    haveAccount: 'Ya tengo cuenta',
  },
  en: {
    heroLabel: 'The PolyGo fox celebrating in front of a globe, with rank shields',
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
  'pt-BR': {
    heroLabel:
      'A raposa do PolyGo comemorando na frente de um globo terrestre, com escudos de rank',
    headlineLine1: 'Aprenda jogando.',
    headlineLine2: 'Compita para subir.',
    subtitle: 'Desafie jogadores reais, melhore seus idiomas\ne conquiste novos ranks.',
    features: [
      { title: 'Aprenda', text: 'Lições curtas e eficazes' },
      { title: 'Dispute', text: 'Batalhas 1 vs 1 em tempo real' },
      { title: 'Suba de rank', text: 'Do Bronze ao Grão-Mestre' },
    ],
    createAccount: 'Criar conta',
    haveAccount: 'Já tenho conta',
  },
  it: {
    heroLabel:
      'La volpe di PolyGo che festeggia davanti a un mappamondo, con gli stemmi dei ranghi',
    headlineLine1: 'Impara giocando.',
    headlineLine2: 'Sfida gli altri per salire.',
    subtitle: 'Sfida giocatori veri, migliora le tue lingue\ne conquista nuovi ranghi.',
    features: [
      { title: 'Impara', text: 'Lezioni brevi ed efficaci' },
      { title: 'Competi', text: 'Sfide 1 vs 1 in tempo reale' },
      { title: 'Sali di rango', text: 'Dal Bronzo a Gran Maestro' },
    ],
    createAccount: 'Crea account',
    haveAccount: 'Ho già un account',
  },
});
