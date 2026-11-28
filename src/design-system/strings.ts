import { defineStrings } from '@/i18n';

/** Textos por defecto de los componentes del sistema de diseño. */
export const designSystemStrings = defineStrings({
  es: {
    loading: 'Cargando…',
    errorTitle: 'Algo salió mal',
    errorMessage: 'No pudimos cargar esta información.',
    offlineTitle: 'Sin conexión',
    offlineMessage: 'Revisa tu conexión a internet e intenta de nuevo.',
    retry: 'Reintentar',
    back: 'Volver',
  },
  en: {
    loading: 'Loading…',
    errorTitle: 'Something went wrong',
    errorMessage: 'We couldn’t load this information.',
    offlineTitle: 'No connection',
    offlineMessage: 'Check your internet connection and try again.',
    retry: 'Try again',
    back: 'Back',
  },
  'pt-BR': {
    loading: 'Carregando…',
    errorTitle: 'Algo deu errado',
    errorMessage: 'Não conseguimos carregar essas informações.',
    offlineTitle: 'Sem conexão',
    offlineMessage: 'Confira sua conexão com a internet e tente de novo.',
    retry: 'Tentar de novo',
    back: 'Voltar',
  },
  it: {
    loading: 'Caricamento…',
    errorTitle: 'Qualcosa è andato storto',
    errorMessage: 'Non siamo riusciti a caricare queste informazioni.',
    offlineTitle: 'Nessuna connessione',
    offlineMessage: 'Controlla la connessione a internet e riprova.',
    retry: 'Riprova',
    back: 'Indietro',
  },
  fr: {
    loading: 'Chargement…',
    errorTitle: 'Un problème est survenu',
    errorMessage: 'Impossible de charger ces informations.',
    offlineTitle: 'Pas de connexion',
    offlineMessage: 'Vérifie ta connexion internet et réessaie.',
    retry: 'Réessayer',
    back: 'Retour',
  },
});
