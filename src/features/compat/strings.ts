import { defineStrings } from '@/i18n';

/** Aviso de actualización obligatoria (features/compat). */
export const compatStrings = defineStrings({
  es: {
    title: 'Actualizá PolyGo',
    defaultMessage:
      'Hay una versión nueva de PolyGo. Actualizala desde la tienda para seguir aprendiendo.',
    yourVersion: 'TU VERSIÓN',
    unknownVersion: 'desconocida',
    minVersion: 'VERSIÓN MÍNIMA',
    goToStore: 'Ir a la tienda',
    retry: 'Ya actualicé, reintentar',
  },
  en: {
    title: 'Update Polygo',
    defaultMessage: 'A new version of Polygo is out. Update it from the store to keep learning.',
    yourVersion: 'YOUR VERSION',
    unknownVersion: 'unknown',
    minVersion: 'MINIMUM VERSION',
    goToStore: 'Go to the store',
    retry: 'I updated, try again',
  },
});
