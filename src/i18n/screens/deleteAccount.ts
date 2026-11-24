import { defineStrings } from '..';

/** Eliminar cuenta (src/app/delete-account.tsx). */
export const deleteAccountStrings = defineStrings({
  es: {
    title: 'Eliminar cuenta',
    cannotUndo: 'Esto no se puede deshacer',
    deletedPermanently: 'Se borran de forma permanente:',
    whatIsDeleted: [
      'Tu cuenta, email y contraseña.',
      'Tu perfil, avatar y ajustes de privacidad.',
      'Tu progreso: lecciones, palabras, repasos, racha y logros.',
      'Tu ELO, tu rango y tu historial de rating.',
    ],
    matchesNote:
      'Las partidas que jugaste quedan en el historial de tus rivales sin tu nombre ni avatar.',
    confirmLabel: (username: string) => `Para confirmar, escribí tu usuario: ${username}`,
    confirmHint: 'El botón de eliminar se habilita cuando coincide',
    deleteForever: 'Eliminar mi cuenta para siempre',
    cancel: 'Cancelar',
  },
  en: {
    title: 'Delete account',
    cannotUndo: 'This can’t be undone',
    deletedPermanently: 'These are permanently deleted:',
    whatIsDeleted: [
      'Your account, email and password.',
      'Your profile, avatar and privacy settings.',
      'Your progress: lessons, words, reviews, streak and achievements.',
      'Your ELO, your rank and your rating history.',
    ],
    matchesNote: 'Matches you played stay in your opponents’ history, without your name or avatar.',
    confirmLabel: (username: string) => `To confirm, type your username: ${username}`,
    confirmHint: 'The delete button turns on when it matches',
    deleteForever: 'Delete my account forever',
    cancel: 'Cancel',
  },
});
