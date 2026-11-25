import type { WordRushBank } from './types';

/**
 * Banco de Word Rush del curso «it» (ver docs/WORD_RUSH_CONTENT.md). Sin frases nuevas todavía: sólo
 * los órdenes válidos que les faltaban a frases de las lecciones. Queda fuera, porque su orden es único
 * y tiene «e»: «Sono le undici e un quarto.» (la hora); Word Rush la descarta por el conector.
 */
export const IT_WORD_RUSH: WordRushBank = {
  language: 'it',
  names: [],
  sentences: [],
  variants: [
    {
      exercise: 'it-a1-u05-l03-e07',
      accepted: ['Ho tre penne e due libri.'],
      reason: 'enumeración con «e»: el orden de los objetos es libre',
    },
    {
      exercise: 'it-a1-u05-rev2-e09',
      accepted: ['Ho tre penne e due libri.'],
      reason: 'enumeración con «e»: el orden de los objetos es libre',
    },
    {
      exercise: 'it-a1-u08-l02-e07',
      accepted: ['Leggo e poi dormo la sera.'],
      reason: 'el complemento de tiempo «la sera» puede ir al final',
    },
    {
      exercise: 'it-a1-u08-rev1-e05',
      accepted: ['Leggo e poi dormo la sera.'],
      reason: 'el complemento de tiempo «la sera» puede ir al final',
    },
    {
      exercise: 'it-a1-u08-l03-e06',
      accepted: ['Lui parla spagnolo e italiano.'],
      reason: 'enumeración de idiomas con «e»',
    },
    {
      exercise: 'it-a1-u08-final-e05',
      accepted: ['Lui parla spagnolo e italiano.'],
      reason: 'enumeración de idiomas con «e»',
    },
    {
      exercise: 'it-a1-u14-l03-e08',
      accepted: ['Lui è alto e giovane.'],
      reason: 'dos adjetivos coordinados con «e»',
    },
    {
      exercise: 'it-a1-u14-rev2-e10',
      accepted: ['Lui è alto e giovane.'],
      reason: 'dos adjetivos coordinados con «e»',
    },
    {
      exercise: 'it-a1-u14-l05-e07',
      accepted: ['Oggi ho freddo e sto male.'],
      reason: 'dos estados coordinados con «e»',
    },
    {
      exercise: 'it-a2-u05-l03-e08',
      accepted: ['C’era tanta gente e pioveva.'],
      reason: 'dos descripciones simultáneas en imperfecto',
    },
    {
      exercise: 'it-a2-u05-rev2-e02',
      accepted: ['C’era tanta gente e pioveva.'],
      reason: 'dos descripciones simultáneas en imperfecto',
    },
    {
      exercise: 'it-a2-u08-l05-e07',
      accepted: ['Riposati e bevi molta acqua.'],
      reason: 'dos consejos coordinados, sin secuencia',
    },
    {
      exercise: 'it-a1-u10-l03-e06',
      accepted: ['Vado in città oggi.'],
      reason: '«oggi» puede ir al principio o al final',
    },
    {
      exercise: 'it-a1-u11-l04-e06',
      accepted: ['Oggi voglio giocare a calcio.'],
      reason: '«oggi» puede ir al principio o al final',
    },
    {
      exercise: 'it-a1-u11-l05-e07',
      accepted: ['Domani puoi giocare?'],
      reason: '«domani» puede ir al principio de la pregunta',
    },
    {
      exercise: 'it-a1-u12-l01-e06',
      accepted: ['Oggi cosa fai?'],
      reason: '«oggi» al principio es igual de natural en el habla',
    },
    {
      exercise: 'it-a2-u01-l01-e07',
      accepted: ['Ho parlato con Marco ieri.'],
      reason: '«ieri» puede ir al principio o al final',
    },
    {
      exercise: 'it-a2-u08-l01-e07',
      accepted: ['Da ieri ho mal di testa.'],
      reason: '«da ieri» puede ir al principio o al final',
    },
  ],
};
