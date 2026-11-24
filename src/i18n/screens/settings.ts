import type { ThemePreference } from '@/design-system';
import type { ProfileVisibility } from '@/lib/database.types';

import { defineStrings } from '..';

type Option = { title: string; description: string };

/** Ajustes (src/app/settings.tsx). */
export const settingsStrings = defineStrings({
  es: {
    title: 'Ajustes',
    reminder: 'RECORDATORIO',
    appearance: 'APARIENCIA',
    themes: {
      dark: { title: 'Oscuro', description: 'Fondo oscuro, el clásico de Polygo.' },
      light: { title: 'Claro', description: 'Fondo claro, ideal con mucha luz.' },
      system: { title: 'Automático', description: 'Sigue el modo claro u oscuro de tu teléfono.' },
    } satisfies Record<ThemePreference, Option>,
    interfaceLanguage: 'IDIOMA DE LA APP',
    interfaceLanguageHint:
      'Botones, pantallas y mensajes. No cambia el curso: cada curso se enseña desde su idioma.',
    sound: 'SONIDO',
    soundEffects: 'Efectos de sonido',
    soundEffectsHint:
      'Sonidos de acierto, error y fin de lección o partida. La pronunciación siempre suena.',
    privacy: 'PRIVACIDAD',
    visibility: {
      public: { title: 'Público', description: 'Cualquier jugador ve tu perfil y estadísticas.' },
      friends: {
        title: 'Sólo amigos',
        description: 'Tus amigos ven todo; el resto, sólo nombre, avatar y rango.',
      },
      private: {
        title: 'Privado',
        description: 'Los demás sólo ven tu nombre, avatar y rango; no tus estadísticas ni logros.',
      },
    } satisfies Record<ProfileVisibility, Option>,
    showCountry: 'Mostrar mi país',
    showCountryOn: 'La bandera aparece en tu perfil público.',
    showCountryNone: 'Elegí tu país en Editar perfil.',
    showCountryA11y: 'Mostrar mi país en el perfil público',
    showOnline: 'Mostrar cuando estoy en línea',
    showOnlineHint: 'Tus amigos te ven conectado y pueden invitarte a un amistoso.',
    showOnlineA11y: 'Mostrar a mis amigos cuando estoy en línea',
    blocked: 'USUARIOS BLOQUEADOS',
    account: 'CUENTA',
    editProfile: 'Editar perfil',
    replayTutorial: 'Rehacer el tutorial',
    signOut: 'Cerrar sesión',
    deleteAccount: 'Eliminar cuenta',
    deleteAccountHint: 'Abre la pantalla para borrar tu cuenta y tus datos',
    privacyPolicy: 'Política de privacidad',
    privacyPolicyHint: 'Abre la política de privacidad en el navegador',
    challengePush: 'Avisarme cuando un amigo me desafía',
    pushBlocked: 'Las notificaciones de Polygo están apagadas en este teléfono.',
    pushUnsupported: 'Las notificaciones sólo llegan en la app instalada (no en web ni Expo Go).',
    pushOn: 'Una notificación con la invitación, aunque tengas la app cerrada.',
    openPhoneSettings: 'Abrir ajustes del teléfono',
    challengePushA11y: 'Avisarme con una notificación cuando un amigo me desafía',
  },
  en: {
    title: 'Settings',
    reminder: 'REMINDER',
    appearance: 'APPEARANCE',
    themes: {
      dark: { title: 'Dark', description: 'Dark background, the classic Polygo look.' },
      light: { title: 'Light', description: 'Light background, great in bright light.' },
      system: { title: 'Automatic', description: 'Follows your phone’s light or dark mode.' },
    },
    interfaceLanguage: 'APP LANGUAGE',
    interfaceLanguageHint:
      'Buttons, screens and messages. It doesn’t change your course: each course is taught from its own language.',
    sound: 'SOUND',
    soundEffects: 'Sound effects',
    soundEffectsHint:
      'Sounds for right and wrong answers and for finishing a lesson or match. Pronunciation always plays.',
    privacy: 'PRIVACY',
    visibility: {
      public: { title: 'Public', description: 'Any player can see your profile and stats.' },
      friends: {
        title: 'Friends only',
        description: 'Your friends see everything; everyone else only sees name, avatar and rank.',
      },
      private: {
        title: 'Private',
        description: 'Others only see your name, avatar and rank; not your stats or achievements.',
      },
    },
    showCountry: 'Show my country',
    showCountryOn: 'The flag shows on your public profile.',
    showCountryNone: 'Choose your country in Edit profile.',
    showCountryA11y: 'Show my country on my public profile',
    showOnline: 'Show when I’m online',
    showOnlineHint: 'Your friends see you’re online and can invite you to a friendly match.',
    showOnlineA11y: 'Show my friends when I’m online',
    blocked: 'BLOCKED USERS',
    account: 'ACCOUNT',
    editProfile: 'Edit profile',
    replayTutorial: 'Replay the tutorial',
    signOut: 'Sign out',
    deleteAccount: 'Delete account',
    deleteAccountHint: 'Opens the screen to delete your account and your data',
    privacyPolicy: 'Privacy policy',
    privacyPolicyHint: 'Opens the privacy policy in your browser',
    challengePush: 'Notify me when a friend challenges me',
    pushBlocked: 'Polygo notifications are turned off on this phone.',
    pushUnsupported: 'Notifications only arrive in the installed app (not on web or Expo Go).',
    pushOn: 'A notification with the invite, even when the app is closed.',
    openPhoneSettings: 'Open phone settings',
    challengePushA11y: 'Send me a notification when a friend challenges me',
  },
});
