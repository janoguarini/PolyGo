import { languageConfig } from '../../../shared/languages';
import { exercisesFor } from '../../builders';
import type { UnitDef, WordDef } from '../../types';

const ex = exercisesFor(languageConfig('it'));

const w = (
  id: string,
  text: string,
  translation: string,
  exampleEn: string,
  exampleEs: string,
  tags: string[],
  extra: Partial<WordDef> = {},
): WordDef => ({ id, text, translation, exampleEn, exampleEs, tags, ...extra });

/** Redactada sin revisión de un hablante nativo: necesita revisión lingüística. */
export const unit07: UnitDef = {
  position: 7,
  title: 'En el bar',
  titleEn: 'Al bar',
  description:
    'Pedir algo para tomar y comer en un bar italiano, con o sin azúcar, y pedir la cuenta.',
  emoji: '☕',
  objective:
    'Podés pedir en un bar con vorrei, prendo o per me, decir con o sin qué lo querés y pedir la cuenta.',
  grammar: {
    title: 'Pedir con vorrei, prendo y per me',
    explanation:
      'Vorrei («quisiera») es la forma amable de pedir. Prendo («tomo», «me pido») es igual de común entre amigos o en la barra. Per me… («para mí…») sirve para pedir sin verbo.',
    examples: [
      { target: 'Vorrei un cappuccino, per favore.', base: 'Quisiera un capuchino, por favor.' },
      { target: 'Io prendo un caffè.', base: 'Yo me pido un café.' },
      { target: 'Per me un gelato.', base: 'Para mí un helado.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de italiano.',
  },
  words: [
    w('it-caffe', 'caffè', 'café', 'Un caffè, per favore.', 'Un café, por favor.', ['food'], {
      emoji: '☕',
    }),
    w(
      'it-cappuccino',
      'cappuccino',
      'capuchino',
      'Un cappuccino e un cornetto.',
      'Un capuchino y una medialuna.',
      ['food'],
    ),
    w('it-te', 'tè', 'té', 'Un tè senza zucchero.', 'Un té sin azúcar.', ['food'], { emoji: '🍵' }),
    w('it-latte', 'latte', 'leche', 'Un caffè con latte.', 'Un café con leche.', ['food'], {
      emoji: '🥛',
    }),
    w('it-acqua', 'acqua', 'agua', "Vorrei un'acqua.", 'Quisiera un agua.', ['food'], {
      emoji: '💧',
    }),
    w(
      'it-succo',
      "succo d'arancia",
      'jugo de naranja',
      "Vorrei un succo d'arancia.",
      'Quisiera un jugo de naranja.',
      ['food'],
      { emoji: '🧃' },
    ),
    w('it-zucchero', 'zucchero', 'azúcar', 'Senza zucchero, grazie.', 'Sin azúcar, gracias.', [
      'food',
    ]),
    w(
      'it-cornetto',
      'cornetto',
      'medialuna',
      'Un cappuccino e un cornetto.',
      'Un capuchino y una medialuna.',
      ['food'],
      { acceptedTranslations: ['croissant'], emoji: '🥐' },
    ),
    w('it-panino', 'panino', 'sándwich', 'Vorrei un panino.', 'Quisiera un sándwich.', ['food'], {
      acceptedTranslations: ['sánguche', 'sandwich'],
      emoji: '🥪',
    }),
    w('it-gelato', 'gelato', 'helado', 'Per me un gelato.', 'Para mí un helado.', ['food'], {
      emoji: '🍨',
    }),
    w(
      'it-vorrei',
      'vorrei',
      'quisiera',
      'Vorrei un panino, per favore.',
      'Quisiera un sándwich, por favor.',
      ['restaurant'],
      { acceptedTranslations: ['me gustaría'] },
    ),
    w(
      'it-prendo',
      'prendo',
      'tomo (pido)',
      'Io prendo un caffè.',
      'Yo me pido un café.',
      ['restaurant'],
      {
        acceptedTranslations: ['pido', 'me pido'],
      },
    ),
    w('it-per-me', 'per me', 'para mí', 'Per me un cappuccino.', 'Para mí un capuchino.', [
      'restaurant',
    ]),
    w('it-senza', 'senza', 'sin', 'Un caffè senza zucchero.', 'Un café sin azúcar.', [
      'prepositions',
    ]),
    w(
      'it-buono',
      'buono',
      'rico',
      'Il gelato è molto buono!',
      '¡El helado está muy rico!',
      ['food'],
      {
        acceptedTranslations: ['bueno'],
      },
    ),
    w('it-il-conto', 'il conto', 'la cuenta', 'Il conto, per favore.', 'La cuenta, por favor.', [
      'restaurant',
    ]),
    w('it-ecco', 'ecco', 'acá tiene', 'Ecco il suo caffè.', 'Acá tiene su café.', ['restaurant'], {
      acceptedTranslations: ['aquí tiene', 'acá tenés'],
    }),
  ],
  lessons: [
    {
      title: 'Un caffè!',
      objective: 'Nombrar lo que se toma en un bar italiano.',
      intro: {
        explanation:
          'En Italia un caffè es un espresso chiquito. El cappuccino lleva leche y se toma a la mañana con un cornetto. Ojo: latte es «leche»; si pedís «un latte» te dan un vaso de leche.',
        examples: [
          { target: 'Un caffè, per favore.', base: 'Un café, por favor.' },
          { target: 'Un cappuccino e un cornetto.', base: 'Un capuchino y una medialuna.' },
        ],
      },
      takeaways: ['Nombrás lo que se toma en un bar.', 'Sabés que latte es leche.'],
      exercises: [
        ex.imageChoice('☕', 'caffè', ['tè', 'latte', 'acqua'], ['it-caffe']),
        ex.imageChoice('🥐', 'cornetto', ['panino', 'gelato', 'caffè'], ['it-cornetto']),
        ex.translationChoice('latte', 'leche', ['café', 'té', 'agua'], ['it-latte'], {
          explanation: 'Latte es leche. El café con leche es caffellatte.',
        }),
        ex.listenChoice('un cappuccino', ['un caffè', 'un cornetto', 'un tè'], ['it-cappuccino']),
        ex.fillBlank(
          'Un ___, per favore.',
          'Un té, por favor.',
          'tè',
          ['latte', 'caffè', 'cornetto'],
          ['it-te', 'it-per-favore'],
          { skill: 'vocabulary' },
        ),
        ex.matchPairs(
          [
            ['caffè', 'café'],
            ['latte', 'leche'],
            ['cornetto', 'medialuna'],
            ['cappuccino', 'capuchino'],
          ],
          ['it-caffe', 'it-latte', 'it-cornetto', 'it-cappuccino'],
        ),
        ex.translateWrite('Un café, por favor.', 'Un caffè, per favore.', [
          'it-caffe',
          'it-per-favore',
        ]),
        ex.translateWrite(
          'Un capuchino y una medialuna',
          'un cappuccino e un cornetto',
          ['it-cappuccino', 'it-cornetto'],
          { explanation: 'Cornetto es masculino: un cornetto.' },
        ),
      ],
    },
    {
      title: 'Vorrei…',
      objective: 'Pedir con amabilidad.',
      intro: {
        explanation:
          "Vorrei es «quisiera»: la forma amable de pedir. Vorrei un panino, per favore. Acqua es femenina y empieza con vocal: un'acqua.",
        examples: [
          { target: 'Vorrei un panino, per favore.', base: 'Quisiera un sándwich, por favor.' },
          { target: "Vorrei un succo d'arancia.", base: 'Quisiera un jugo de naranja.' },
        ],
      },
      takeaways: ['Pedís con vorrei.', 'Nombrás agua, jugo y sándwich.'],
      exercises: [
        ex.translationChoice('vorrei', 'quisiera', ['tomo (pido)', 'tengo', 'soy'], ['it-vorrei']),
        ex.imageChoice('🥪', 'panino', ['cornetto', 'gelato', 'caffè'], ['it-panino']),
        ex.translationChoice('acqua', 'agua', ['leche', 'jugo de naranja', 'té'], ['it-acqua']),
        ex.listenChoice(
          "Vorrei un succo d'arancia.",
          ['Vorrei un caffè.', 'Vorrei un panino.', "Vorrei un'acqua."],
          ['it-vorrei', 'it-succo'],
        ),
        ex.fillBlank(
          '___ un panino, per favore.',
          'Quisiera un sándwich, por favor.',
          'Vorrei',
          ['Sono', 'Ho', 'Ciao'],
          ['it-vorrei', 'it-panino'],
        ),
        ex.orderWords(
          "Vorrei un succo d'arancia, per favore.",
          'Quisiera un jugo de naranja, por favor.',
          ['it-vorrei', 'it-succo', 'it-per-favore'],
        ),
        ex.translateWrite('Quisiera un sándwich, por favor.', 'Vorrei un panino, per favore.', [
          'it-vorrei',
          'it-panino',
          'it-per-favore',
        ]),
        ex.translateWrite('Quisiera un agua.', "Vorrei un'acqua.", ['it-vorrei', 'it-acqua'], {
          acceptedAnswers: ["Vorrei dell'acqua.", 'Vorrei acqua.'],
          explanation: "Acqua es femenina y empieza con vocal: un'acqua.",
        }),
      ],
    },
    {
      title: 'Prendo… Per me…',
      objective: 'Pedir con prendo y per me.',
      intro: {
        explanation:
          'Prendo («tomo», «me pido») es otra forma muy común de pedir: io prendo un caffè. Per me… («para mí…») sirve para pedir sin verbo, como en español.',
        examples: [
          { target: 'Io prendo un gelato.', base: 'Yo me pido un helado.' },
          { target: 'Per me un cappuccino.', base: 'Para mí un capuchino.' },
        ],
      },
      takeaways: ['Pedís con prendo.', 'Pedís con per me… sin verbo.'],
      exercises: [
        ex.translationChoice('prendo', 'tomo (pido)', ['quisiera', 'tengo', 'soy'], ['it-prendo']),
        ex.translationChoice('per me', 'para mí', ['por favor', 'para vos', 'yo'], ['it-per-me']),
        ex.imageChoice('🍨', 'gelato', ['panino', 'cornetto', 'latte'], ['it-gelato']),
        ex.listenChoice(
          'Per me un gelato.',
          ['Per me un caffè.', 'Prendo un panino.', 'Vorrei un tè.'],
          ['it-per-me', 'it-gelato'],
        ),
        ex.fillBlank(
          'Io ___ un caffè.',
          'Yo me pido un café.',
          'prendo',
          ['sono', 'sei', 'hai'],
          ['it-prendo', 'it-caffe'],
        ),
        ex.orderWords(
          'Per me un cappuccino e un cornetto.',
          'Para mí un capuchino y una medialuna.',
          ['it-per-me', 'it-cappuccino', 'it-cornetto'],
        ),
        ex.shortAnswer(
          'Cosa prendi?',
          '¿Qué te pedís? (Respondé que te pedís un helado.)',
          'Prendo un gelato.',
          ['Io prendo un gelato.', 'Un gelato.', 'Per me un gelato.', 'Vorrei un gelato.'],
          ['it-prendo', 'it-gelato'],
        ),
        ex.translateWrite('Para mí un café.', 'Per me un caffè.', ['it-per-me', 'it-caffe']),
      ],
    },
    {
      title: 'Con o senza?',
      objective: 'Decir con o sin qué lo querés y si está rico.',
      intro: {
        explanation:
          'Senza es «sin»; con se dice igual que en español. Para la comida, «rico» es buono: il gelato è buono. Bene es «bien» (sto bene), no se usa para la comida.',
        examples: [
          { target: 'Un caffè senza zucchero.', base: 'Un café sin azúcar.' },
          { target: 'Il gelato è molto buono!', base: '¡El helado está muy rico!' },
        ],
      },
      takeaways: ['Pedís con o senza.', 'Decís que algo está rico con buono.'],
      exercises: [
        ex.translationChoice('senza', 'sin', ['con', 'para mí', 'muy'], ['it-senza']),
        ex.translationChoice('zucchero', 'azúcar', ['leche', 'agua', 'helado'], ['it-zucchero']),
        ex.listenChoice(
          'senza zucchero',
          ['con zucchero', 'con latte', 'senza latte'],
          ['it-senza', 'it-zucchero'],
        ),
        ex.fillBlank(
          'Un tè ___ zucchero.',
          'Un té sin azúcar.',
          'senza',
          ['con', 'per', 'in'],
          ['it-senza', 'it-zucchero'],
        ),
        ex.fillBlank(
          'Il cornetto è molto ___!',
          '¡La medialuna está muy rica!',
          'buono',
          ['bene', 'buona', 'grazie'],
          ['it-buono', 'it-molto', 'it-cornetto'],
          {
            explanation:
              'Para la comida se usa buono, y cornetto es masculino: buono. Bene es «bien».',
          },
        ),
        ex.matchPairs(
          [
            ['senza', 'sin'],
            ['zucchero', 'azúcar'],
            ['buono', 'rico'],
            ['latte', 'leche'],
          ],
          ['it-senza', 'it-zucchero', 'it-buono', 'it-latte'],
        ),
        ex.translateWrite('Un té sin azúcar, por favor.', 'Un tè senza zucchero, per favore.', [
          'it-senza',
          'it-zucchero',
          'it-per-favore',
        ]),
        ex.translateWrite('¡El helado está muy rico!', 'Il gelato è molto buono!', [
          'it-gelato',
          'it-molto',
          'it-buono',
        ]),
      ],
    },
    {
      title: 'Il conto, per favore',
      objective: 'Pedir la cuenta y entender cuando te dan algo.',
      intro: {
        explanation:
          'Para pagar: il conto, per favore. Cuando te alcanzan algo te dicen ecco («acá tiene»). En muchos bares italianos se paga primero en la caja y después se pide en la barra.',
        examples: [
          { target: 'Il conto, per favore.', base: 'La cuenta, por favor.' },
          { target: 'Ecco il suo caffè.', base: 'Acá tiene su café.' },
        ],
      },
      takeaways: ['Pedís la cuenta.', 'Entendés ecco cuando te dan algo.'],
      exercises: [
        ex.translationChoice(
          'il conto',
          'la cuenta',
          ['el cuento', 'la comida', 'el número'],
          ['it-il-conto'],
          { explanation: 'Conto es la cuenta; «el cuento» es racconto.' },
        ),
        ex.translationChoice('ecco', 'acá tiene', ['gracias', 'de nada', 'por favor'], ['it-ecco']),
        ex.listenChoice(
          'Il conto, per favore.',
          ['Un caffè, per favore.', 'Grazie, arrivederci.', 'Ecco il caffè.'],
          ['it-il-conto', 'it-per-favore'],
        ),
        ex.fillBlank(
          '___ il cappuccino.',
          'Acá tiene el capuchino.',
          'Ecco',
          ['Vorrei', 'Senza', 'Ciao'],
          ['it-ecco', 'it-cappuccino'],
        ),
        ex.orderWords('Il conto, per favore.', 'La cuenta, por favor.', [
          'it-il-conto',
          'it-per-favore',
        ]),
        ex.matchPairs(
          [
            ['il conto', 'la cuenta'],
            ['ecco', 'acá tiene'],
            ['vorrei', 'quisiera'],
            ['prendo', 'tomo (pido)'],
          ],
          ['it-il-conto', 'it-ecco', 'it-vorrei', 'it-prendo'],
        ),
        ex.shortAnswer(
          'Desidera?',
          '¿Qué desea? (Pedí un café y un agua.)',
          "Vorrei un caffè e un'acqua.",
          [
            "Vorrei un caffè e un'acqua, per favore.",
            "Un caffè e un'acqua, per favore.",
            "Un caffè e un'acqua.",
            "Prendo un caffè e un'acqua.",
            "Per me un caffè e un'acqua.",
          ],
          ['it-vorrei', 'it-caffe', 'it-acqua'],
        ),
        ex.translateWrite('La cuenta, por favor.', 'Il conto, per favore.', [
          'it-il-conto',
          'it-per-favore',
        ]),
      ],
    },
  ],
};
