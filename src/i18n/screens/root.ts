import { defineStrings } from '..';

/** Layout raíz (src/app/_layout.tsx). */
export const rootStrings = defineStrings({
  es: {
    crashTitle: 'Algo salió mal',
    crashMessage: 'PolyGo tuvo un error inesperado. Tu progreso guardado no se perdió.',
    loading: 'Preparando PolyGo…',
    profileError: 'No pudimos cargar tu perfil.',
  },
  en: {
    crashTitle: 'Something went wrong',
    crashMessage: 'PolyGo hit an unexpected error. Your saved progress is safe.',
    loading: 'Getting PolyGo ready…',
    profileError: 'We couldn’t load your profile.',
  },
  'pt-BR': {
    crashTitle: 'Algo deu errado',
    crashMessage: 'O PolyGo teve um erro inesperado. Seu progresso salvo não foi perdido.',
    loading: 'Preparando o PolyGo…',
    profileError: 'Não conseguimos carregar seu perfil.',
  },
  it: {
    crashTitle: 'Qualcosa è andato storto',
    crashMessage:
      'PolyGo ha avuto un errore imprevisto. I tuoi progressi salvati non sono andati persi.',
    loading: 'Preparazione di PolyGo…',
    profileError: 'Non siamo riusciti a caricare il tuo profilo.',
  },
  fr: {
    crashTitle: 'Un problème est survenu',
    crashMessage:
      'PolyGo a rencontré une erreur inattendue. Ta progression enregistrée est intacte.',
    loading: 'Préparation de PolyGo…',
    profileError: 'Impossible de charger ton profil.',
  },
});
