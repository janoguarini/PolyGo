import { defineStrings } from '..';

/** Layout raíz (src/app/_layout.tsx). */
export const rootStrings = defineStrings({
  es: {
    crashTitle: 'Algo salió mal',
    crashMessage: 'Polygo tuvo un error inesperado. Tu progreso guardado no se perdió.',
    loading: 'Preparando Polygo…',
    profileError: 'No pudimos cargar tu perfil.',
  },
  en: {
    crashTitle: 'Something went wrong',
    crashMessage: 'Polygo hit an unexpected error. Your saved progress is safe.',
    loading: 'Getting Polygo ready…',
    profileError: 'We couldn’t load your profile.',
  },
});
