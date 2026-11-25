import type { WordRushBank } from './types';

/**
 * Banco de Word Rush del curso «zh» (ver docs/WORD_RUSH_CONTENT.md). Sin frases nuevas todavía: sólo
 * los órdenes válidos que les faltaban a frases de las lecciones. En chino la palabra de tiempo puede
 * ir antes o después del sujeto (我早上吃早饭 / 早上我吃早饭). Las variantes se escriben con las fichas
 * separadas por espacios, como las frases de las lecciones; la respuesta se compara sin espacios.
 */
export const ZH_WORD_RUSH: WordRushBank = {
  language: 'zh',
  names: [],
  sentences: [],
  variants: [
    {
      exercise: 'zh-a1-u08-l01-e07',
      accepted: ['早上 我 吃 早饭。'],
      reason: 'la palabra de tiempo puede ir antes del sujeto',
    },
    {
      exercise: 'zh-a1-u08-l03-e07',
      accepted: ['晚上 我 看 书。'],
      reason: 'la palabra de tiempo puede ir antes del sujeto',
    },
    {
      exercise: 'zh-a1-u08-l04-e07',
      accepted: ['下午 我 工作。'],
      reason: 'la palabra de tiempo puede ir antes del sujeto',
    },
    {
      exercise: 'zh-a1-u11-l04-e06',
      accepted: ['明天 你 能 来 吗？'],
      reason: 'la palabra de tiempo puede ir antes del sujeto',
    },
    {
      exercise: 'zh-a1-u16-l05-e05',
      accepted: ['昨天 我 没 去 银行。'],
      reason: 'la palabra de tiempo puede ir antes del sujeto',
    },
    {
      exercise: 'zh-a2-u04-l02-e07',
      accepted: ['晚上 我 给 你 打电话。'],
      reason: 'la palabra de tiempo puede ir antes del sujeto',
    },
  ],
  onlyOrder: [
    { exercise: 'zh-a1-u09-l01-e06', reason: '现在几点 no tiene sujeto: 现在 va primero' },
    { exercise: 'zh-a1-u09-l02-e06', reason: '现在九点半 no tiene sujeto: 现在 va primero' },
  ],
};
