import type { WordRushBank } from './types';

/**
 * Banco de Word Rush del curso «fr» (ver docs/WORD_RUSH_CONTENT.md). Sin frases nuevas todavía: sólo
 * los órdenes válidos que les faltaban a frases de las lecciones.
 */
export const FR_WORD_RUSH: WordRushBank = {
  language: 'fr',
  names: [],
  sentences: [],
  variants: [
    {
      exercise: 'fr-a1-u04-l02-e08',
      accepted: ["J'ai une fille et un fils."],
      reason: 'enumeración con «et»: el orden de los hijos es libre',
    },
    {
      exercise: 'fr-a1-u16-l02-e08',
      accepted: ["Aujourd'hui il y a du soleil."],
      reason: "«aujourd'hui» puede ir al principio o al final",
    },
    {
      exercise: 'fr-a1-u17-l03-e08',
      accepted: ['Demain nous allons visiter le musée.'],
      reason: '«demain» puede ir al principio o al final',
    },
    {
      exercise: 'fr-a2-u01-l01-e08',
      accepted: ["J'ai parlé avec Claire hier soir."],
      reason: '«hier soir» puede ir al principio o al final',
    },
  ],
  onlyOrder: [
    {
      exercise: 'fr-a1-u15-l03-e07',
      reason: "«aujourd'hui» al principio de la pregunta no es natural sin coma ni cambio de forma",
    },
    {
      exercise: 'fr-a2-u05-l01-e08',
      reason: '«hier» no se antepone a «qu’est-ce qui»',
    },
  ],
};
