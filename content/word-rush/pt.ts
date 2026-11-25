import type { WordRushBank } from './types';

/**
 * Banco de Word Rush del curso «pt» (ver docs/WORD_RUSH_CONTENT.md). Sin frases nuevas todavía: sólo
 * los órdenes válidos que les faltaban a frases de las lecciones. Quedan fuera, porque su orden es único
 * y tienen «e»: «Tudo bem, e você?» (fórmula), «São onze e quinze.» (la hora), «Siga reto e depois à
 * direita.» (secuencia) y «O computador quebrou e não funciona.» (causa y efecto).
 */
export const PT_WORD_RUSH: WordRushBank = {
  language: 'pt',
  names: [],
  sentences: [],
  variants: [
    {
      exercise: 'pt-a1-u08-l03-e06',
      accepted: ['Ele fala espanhol e português.'],
      reason: 'enumeración de idiomas con «e»',
    },
    {
      exercise: 'pt-a1-u11-l05-e07',
      accepted: ['Hoje eu posso cozinhar.'],
      reason: '«hoje» puede ir al principio o al final',
    },
    {
      exercise: 'pt-a1-u14-l01-e07',
      accepted: ['Hoje você está cansado?'],
      reason: '«hoje» puede ir al principio de la pregunta',
    },
    {
      exercise: 'pt-a1-u16-l02-e07',
      accepted: ['A gente vai ao cinema amanhã.'],
      reason: '«amanhã» puede ir al principio o al final',
    },
    {
      exercise: 'pt-a2-u01-l01-e08',
      accepted: ['Eu trabalhei até tarde ontem.'],
      reason: '«ontem» puede ir al principio o al final',
    },
    {
      exercise: 'pt-a2-u01-l05-e07',
      accepted: ['Ontem eles saíram tarde.'],
      reason: '«ontem» puede ir al principio o al final',
    },
    {
      exercise: 'pt-a2-u06-l05-e07',
      accepted: ['Hoje estou a fim de sair.'],
      reason: '«hoje» puede ir al principio o al final',
    },
    {
      exercise: 'pt-a2-u12-l05-e08',
      accepted: ['Amanhã vamos resolver o problema.'],
      reason: '«amanhã» puede ir al principio o al final',
    },
  ],
  onlyOrder: [
    {
      exercise: 'pt-a2-u08-l05-e07',
      reason: '«para amanhã» completa a «consulta»: al principio cambia el sentido',
    },
  ],
};
