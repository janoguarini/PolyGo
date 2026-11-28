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
    confirmLabel: (username: string) => `Para confirmar, escribe tu usuario: ${username}`,
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
  'pt-BR': {
    title: 'Excluir conta',
    cannotUndo: 'Isso não pode ser desfeito',
    deletedPermanently: 'São apagados de forma permanente:',
    whatIsDeleted: [
      'Sua conta, e-mail e senha.',
      'Seu perfil, avatar e ajustes de privacidade.',
      'Seu progresso: lições, palavras, revisões, sequência e conquistas.',
      'Seu ELO, seu rank e seu histórico de rating.',
    ],
    matchesNote:
      'As partidas que você jogou ficam no histórico dos seus rivais, sem seu nome nem avatar.',
    confirmLabel: (username: string) => `Para confirmar, digite seu usuário: ${username}`,
    confirmHint: 'O botão de excluir é liberado quando o usuário coincide',
    deleteForever: 'Excluir minha conta para sempre',
    cancel: 'Cancelar',
  },
  it: {
    title: 'Elimina account',
    cannotUndo: 'Questa azione non si può annullare',
    deletedPermanently: 'Vengono eliminati in modo permanente:',
    whatIsDeleted: [
      'Il tuo account, email e password.',
      'Il tuo profilo, avatar e impostazioni della privacy.',
      'I tuoi progressi: lezioni, parole, ripassi, serie e traguardi.',
      'Il tuo ELO, il tuo rango e il tuo storico del rating.',
    ],
    matchesNote:
      'Le partite che hai giocato restano nello storico dei tuoi avversari, senza il tuo nome né avatar.',
    confirmLabel: (username: string) => `Per confermare, scrivi il tuo nome utente: ${username}`,
    confirmHint: 'Il pulsante per eliminare si attiva quando corrisponde',
    deleteForever: 'Elimina il mio account per sempre',
    cancel: 'Annulla',
  },
  fr: {
    title: 'Supprimer le compte',
    cannotUndo: 'Cette action est irréversible',
    deletedPermanently: 'Seront supprimés définitivement :',
    whatIsDeleted: [
      'Ton compte, ton e-mail et ton mot de passe.',
      'Ton profil, ton avatar et tes réglages de confidentialité.',
      'Ta progression : leçons, mots, révisions, série et succès.',
      'Ton ELO, ton rang et ton historique de classement.',
    ],
    matchesNote:
      'Les parties que tu as jouées restent dans l’historique de tes adversaires, sans ton nom ni ton avatar.',
    confirmLabel: (username: string) => `Pour confirmer, écris ton nom d’utilisateur : ${username}`,
    confirmHint: 'Le bouton de suppression s’active quand ça correspond',
    deleteForever: 'Supprimer mon compte pour toujours',
    cancel: 'Annuler',
  },
});
