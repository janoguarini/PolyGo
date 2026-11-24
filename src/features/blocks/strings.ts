import { defineStrings } from '@/i18n';

/** Bloquear y desbloquear jugadores (perfil de otro jugador y Ajustes). */
export const blockStrings = defineStrings({
  es: {
    blockA11y: (username: string) => `Bloquear a ${username}`,
    block: 'Bloquear',
    confirmTitle: (username: string) => `¿Bloquear a @${username}?`,
    effectRanked: '• No van a volver a cruzarse en ranked.',
    effectChallenges: '• No va a poder entrar a tus desafíos.',
    effectVisibility: '• No lo vas a ver en la clasificación ni en su perfil.',
    noNotice: 'No le avisamos. Podés desbloquearlo cuando quieras desde Ajustes.',
    confirm: 'Sí, bloquear',
    cancel: 'Cancelar',
    loadError: 'No pudimos cargar los usuarios bloqueados.',
    empty: 'No bloqueaste a nadie. Para bloquear a alguien, abrí su perfil desde la clasificación.',
    unblock: 'Desbloquear',
  },
  en: {
    blockA11y: (username: string) => `Block ${username}`,
    block: 'Block',
    confirmTitle: (username: string) => `Block @${username}?`,
    effectRanked: '• You won’t be matched in Ranked again.',
    effectChallenges: '• They won’t be able to join your challenges.',
    effectVisibility: '• You won’t see them on the leaderboard or their profile.',
    noNotice: 'We won’t notify them. You can unblock them anytime in Settings.',
    confirm: 'Yes, block',
    cancel: 'Cancel',
    loadError: 'We couldn’t load your blocked users.',
    empty: 'You haven’t blocked anyone. To block someone, open their profile from the leaderboard.',
    unblock: 'Unblock',
  },
});
