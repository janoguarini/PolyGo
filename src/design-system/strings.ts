import { defineStrings } from '@/i18n';

/** Textos por defecto de los componentes del sistema de diseño. */
export const designSystemStrings = defineStrings({
  es: {
    loading: 'Cargando…',
    errorTitle: 'Algo salió mal',
    errorMessage: 'No pudimos cargar esta información.',
    offlineTitle: 'Sin conexión',
    offlineMessage: 'Revisá tu conexión a internet e intentá de nuevo.',
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
});
