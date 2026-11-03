import { languageConfig } from '../../../shared/languages';
import { exercisesFor } from '../../builders';
import type { UnitDef, WordDef } from '../../types';

const ex = exercisesFor(languageConfig('pt'));

const w = (
  id: string,
  text: string,
  translation: string,
  exampleEn: string,
  exampleEs: string,
  tags: string[],
  extra: Partial<WordDef> = {},
): WordDef => ({ id, text, translation, exampleEn, exampleEs, tags, ...extra });

/** Variante de Brasil. Redactada sin revisión de un hablante nativo: necesita revisión lingüística. */
export const unit07: UnitDef = {
  position: 7,
  title: 'La comida',
  titleEn: 'A comida',
  description: 'El desayuno, pedir con quero y queria, con o sin algo, y pedir la cuenta.',
  emoji: '🍞',
  objective:
    'Podés nombrar lo que comés en el desayuno, pedir con quero o queria (más amable), decir con o sin qué y pedir la cuenta.',
  grammar: {
    title: 'Quero y queria',
    explanation:
      'Quero es «quiero». Para pedir con amabilidad, en Brasil se usa queria (literalmente «quería»): eu queria um café, por favor. Para mim… («para mí…») sirve para pedir sin verbo.',
    examples: [
      { target: 'Quero um suco.', base: 'Quiero un jugo.' },
      {
        target: 'Eu queria um pão de queijo, por favor.',
        base: 'Quisiera un pan de queso, por favor.',
      },
      { target: 'Para mim, um café com leite.', base: 'Para mí, un café con leche.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de portugués de Brasil.',
  },
  words: [
    w('pt-quero', 'quero', 'quiero', 'Quero um suco.', 'Quiero un jugo.', ['restaurant']),
    w(
      'pt-queria',
      'queria',
      'quisiera',
      'Eu queria um café, por favor.',
      'Quisiera un café, por favor.',
      ['restaurant'],
      { acceptedTranslations: ['quería'] },
    ),
    w('pt-cafe', 'café', 'café', 'Um café, por favor.', 'Un café, por favor.', ['food'], {
      emoji: '☕',
    }),
    w(
      'pt-cafe-da-manha',
      'café da manhã',
      'desayuno',
      'O café da manhã é às oito.',
      'El desayuno es a las ocho.',
      ['food'],
    ),
    w('pt-pao', 'pão', 'pan', 'Quero pão com queijo.', 'Quiero pan con queso.', ['food'], {
      emoji: '🍞',
    }),
    w('pt-queijo', 'queijo', 'queso', 'Quero pão com queijo.', 'Quiero pan con queso.', ['food'], {
      emoji: '🧀',
    }),
    w(
      'pt-pao-de-queijo',
      'pão de queijo',
      'pan de queso',
      'O pão de queijo é gostoso.',
      'El pan de queso es rico.',
      ['food'],
    ),
    w(
      'pt-suco',
      'suco',
      'jugo',
      'Quero um suco de laranja.',
      'Quiero un jugo de naranja.',
      ['food'],
      {
        emoji: '🧃',
      },
    ),
    w('pt-agua', 'água', 'agua', 'Eu queria uma água.', 'Quisiera un agua.', ['food'], {
      emoji: '💧',
    }),
    w('pt-leite', 'leite', 'leche', 'Um café com leite.', 'Un café con leche.', ['food'], {
      emoji: '🥛',
    }),
    w('pt-acucar', 'açúcar', 'azúcar', 'Um café sem açúcar.', 'Un café sin azúcar.', ['food']),
    w('pt-com', 'com', 'con', 'Café com leite.', 'Café con leche.', ['prepositions']),
    w('pt-sem', 'sem', 'sin', 'Um suco sem açúcar.', 'Un jugo sin azúcar.', ['prepositions']),
    w(
      'pt-gostoso',
      'gostoso',
      'rico',
      'O pão de queijo é gostoso.',
      'El pan de queso es rico.',
      ['food'],
      {
        acceptedTexts: ['gostosa'],
        acceptedTranslations: ['sabroso'],
      },
    ),
    w(
      'pt-polvo',
      'polvo',
      'pulpo',
      'O polvo é gostoso.',
      'El pulpo es rico.',
      ['food', 'false-friends'],
      {
        emoji: '🐙',
      },
    ),
    w('pt-para-mim', 'para mim', 'para mí', 'Para mim, um suco.', 'Para mí, un jugo.', [
      'restaurant',
    ]),
    w('pt-a-conta', 'a conta', 'la cuenta', 'A conta, por favor.', 'La cuenta, por favor.', [
      'restaurant',
    ]),
  ],
  lessons: [
    {
      title: 'Café da manhã',
      objective: 'Nombrar lo que se come en el desayuno.',
      intro: {
        explanation:
          'Café da manhã es el desayuno (literalmente «café de la mañana»). Un clásico de Brasil es el pão de queijo, un pancito de queso.',
        examples: [
          {
            target: 'No café da manhã, tomo café com leite.',
            base: 'En el desayuno tomo café con leche.',
          },
          { target: 'O pão de queijo é gostoso.', base: 'El pan de queso es rico.' },
        ],
      },
      takeaways: [
        'Nombrás lo que comés en el desayuno.',
        'Sabés que café da manhã es el desayuno.',
      ],
      exercises: [
        ex.translationChoice(
          'café da manhã',
          'desayuno',
          ['café', 'almuerzo', 'pan'],
          ['pt-cafe-da-manha'],
        ),
        ex.imageChoice('🍞', 'pão', ['queijo', 'leite', 'café'], ['pt-pao']),
        ex.imageChoice('🧀', 'queijo', ['pão', 'leite', 'suco'], ['pt-queijo']),
        ex.translationChoice('leite', 'leche', ['queso', 'café', 'pan'], ['pt-leite']),
        ex.listenChoice(
          'pão de queijo',
          ['pão com queijo', 'café com leite', 'café da manhã'],
          ['pt-pao-de-queijo'],
        ),
        ex.matchPairs(
          [
            ['pão', 'pan'],
            ['queijo', 'queso'],
            ['leite', 'leche'],
            ['café da manhã', 'desayuno'],
          ],
          ['pt-pao', 'pt-queijo', 'pt-leite', 'pt-cafe-da-manha'],
        ),
        ex.translateWrite('Pan de queso', 'pão de queijo', ['pt-pao-de-queijo']),
        ex.translateWrite('Café con leche', 'café com leite', ['pt-com', 'pt-leite']),
      ],
    },
    {
      title: 'Eu quero…',
      objective: 'Decir qué querés comer o tomar.',
      intro: {
        explanation:
          'Quero es «quiero». Con amigos o en casa alcanza con quero; para pedir en un bar es más amable queria (lo vemos en la próxima lección).',
        examples: [
          { target: 'Quero um suco, por favor.', base: 'Quiero un jugo, por favor.' },
          { target: 'Você quer água?', base: '¿Querés agua?' },
        ],
      },
      takeaways: ['Decís qué querés con quero.', 'Nombrás jugo y agua.'],
      exercises: [
        ex.translationChoice('quero', 'quiero', ['quisiera', 'tengo', 'soy'], ['pt-quero']),
        ex.imageChoice('🧃', 'suco', ['água', 'leite', 'café'], ['pt-suco']),
        ex.imageChoice('💧', 'água', ['suco', 'leite', 'queijo'], ['pt-agua']),
        ex.listenChoice(
          'Quero um café.',
          ['Quero um suco.', 'Queria um café.', 'Tenho um café.'],
          ['pt-quero', 'pt-cafe'],
        ),
        ex.fillBlank(
          'Eu ___ um suco.',
          'Yo quiero un jugo.',
          'quero',
          ['sou', 'é', 'está'],
          ['pt-quero', 'pt-suco'],
        ),
        ex.orderWords('Quero um suco de laranja.', 'Quiero un jugo de naranja.', [
          'pt-quero',
          'pt-suco',
        ]),
        ex.translateWrite('Quiero un jugo.', 'Quero um suco.', ['pt-quero', 'pt-suco'], {
          acceptedAnswers: ['Eu quero um suco.'],
        }),
        ex.translateWrite(
          'Quiero pan con queso.',
          'Quero pão com queijo.',
          ['pt-quero', 'pt-pao', 'pt-com', 'pt-queijo'],
          { acceptedAnswers: ['Eu quero pão com queijo.'] },
        ),
      ],
    },
    {
      title: 'Eu queria…',
      objective: 'Pedir con amabilidad.',
      intro: {
        explanation:
          'Queria (literalmente «quería») es la forma amable de pedir en Brasil: eu queria um café, por favor. Para mim… es «para mí…».',
        examples: [
          {
            target: 'Eu queria um pão de queijo, por favor.',
            base: 'Quisiera un pan de queso, por favor.',
          },
          { target: 'Para mim, um suco.', base: 'Para mí, un jugo.' },
        ],
      },
      takeaways: ['Pedís con amabilidad con queria.', 'Pedís sin verbo con para mim….'],
      exercises: [
        ex.translationChoice('queria', 'quisiera', ['quiero', 'tengo', 'para mí'], ['pt-queria']),
        ex.translationChoice(
          'para mim',
          'para mí',
          ['para vos', 'por favor', 'yo'],
          ['pt-para-mim'],
        ),
        ex.listenChoice(
          'Eu queria uma água.',
          ['Eu quero uma água.', 'Para mim, um café.', 'Eu tenho uma água.'],
          ['pt-queria', 'pt-agua'],
        ),
        ex.fillBlank(
          'Eu ___ um café, por favor.',
          'Quisiera un café, por favor.',
          'queria',
          ['sou', 'tenho', 'está'],
          ['pt-queria', 'pt-cafe'],
          { explanation: 'Queria suena más amable que quero para pedir.' },
        ),
        ex.orderWords('Para mim, um café com leite.', 'Para mí, un café con leche.', [
          'pt-para-mim',
          'pt-cafe',
          'pt-com',
          'pt-leite',
        ]),
        ex.matchPairs(
          [
            ['quero', 'quiero'],
            ['queria', 'quisiera'],
            ['para mim', 'para mí'],
            ['com', 'con'],
          ],
          ['pt-quero', 'pt-queria', 'pt-para-mim', 'pt-com'],
        ),
        ex.shortAnswer(
          'O que você quer?',
          '¿Qué querés? (Pedí amablemente un pan de queso.)',
          'Eu queria um pão de queijo.',
          [
            'Queria um pão de queijo.',
            'Eu queria um pão de queijo, por favor.',
            'Queria um pão de queijo, por favor.',
            'Para mim, um pão de queijo.',
            'Quero um pão de queijo.',
            'Eu quero um pão de queijo.',
          ],
          ['pt-queria', 'pt-pao-de-queijo'],
        ),
        ex.translateWrite('Para mí, un jugo.', 'Para mim, um suco.', ['pt-para-mim', 'pt-suco']),
      ],
    },
    {
      title: 'Com ou sem?',
      objective: 'Decir con o sin qué lo querés y si está rico.',
      intro: {
        explanation:
          'Com es «con» y sem, «sin». Gostoso es «rico». Ojo con dos falsos amigos: polvo es el pulpo, y esquisito significa «raro», no «exquisito».',
        examples: [
          { target: 'Um café sem açúcar.', base: 'Un café sin azúcar.' },
          { target: 'O polvo é muito gostoso.', base: 'El pulpo es muy rico.' },
        ],
      },
      takeaways: ['Pedís com o sem.', 'Decís que algo está rico con gostoso.'],
      exercises: [
        ex.translationChoice('sem', 'sin', ['con', 'para mí', 'también'], ['pt-sem']),
        ex.translationChoice('polvo', 'pulpo', ['polvo (tierra)', 'pollo', 'pan'], ['pt-polvo'], {
          explanation: 'Falso amigo: polvo es el pulpo. El polvo de tierra es poeira.',
        }),
        ex.translationChoice('gostoso', 'rico', ['raro', 'grande', 'chico'], ['pt-gostoso']),
        ex.listenChoice(
          'sem açúcar',
          ['com açúcar', 'com leite', 'sem leite'],
          ['pt-sem', 'pt-acucar'],
        ),
        ex.fillBlank(
          'Um suco ___ açúcar, por favor.',
          'Un jugo sin azúcar, por favor.',
          'sem',
          ['com', 'para', 'de'],
          ['pt-sem', 'pt-acucar', 'pt-suco'],
        ),
        ex.fillBlank(
          'O pão de queijo é muito ___!',
          '¡El pan de queso es muy rico!',
          'gostoso',
          ['esquisito', 'bem', 'obrigado'],
          ['pt-gostoso', 'pt-pao-de-queijo'],
          { explanation: 'Esquisito es «raro». Para decir que algo es rico: gostoso.' },
        ),
        ex.translateWrite('Un café sin azúcar', 'um café sem açúcar', ['pt-sem', 'pt-acucar']),
        ex.translateWrite('El pulpo es rico.', 'O polvo é gostoso.', ['pt-polvo', 'pt-gostoso']),
      ],
    },
    {
      title: 'A conta, por favor',
      objective: 'Pedir la cuenta.',
      intro: {
        explanation:
          'Para pagar: a conta, por favor. Para agradecer, recordá: obrigado si sos hombre, obrigada si sos mujer.',
        examples: [
          { target: 'A conta, por favor.', base: 'La cuenta, por favor.' },
          { target: 'Eu queria a conta, por favor.', base: 'Quisiera la cuenta, por favor.' },
        ],
      },
      takeaways: ['Pedís la cuenta.', 'Pedís una comida completa con amabilidad.'],
      exercises: [
        ex.translationChoice(
          'a conta',
          'la cuenta',
          ['el cuento', 'el desayuno', 'la comida'],
          ['pt-a-conta'],
        ),
        ex.listenChoice(
          'A conta, por favor.',
          ['Um café, por favor.', 'Para mim, um suco.', 'Obrigada, tchau.'],
          ['pt-a-conta'],
        ),
        ex.fillBlank(
          '___ conta, por favor.',
          'La cuenta, por favor.',
          'A',
          ['O', 'Um', 'Os'],
          ['pt-a-conta', 'pt-a'],
          { explanation: 'Conta es femenina: a conta.' },
        ),
        ex.orderWords('Eu queria a conta, por favor.', 'Quisiera la cuenta, por favor.', [
          'pt-queria',
          'pt-a-conta',
        ]),
        ex.matchPairs(
          [
            ['a conta', 'la cuenta'],
            ['sem', 'sin'],
            ['polvo', 'pulpo'],
            ['gostoso', 'rico'],
          ],
          ['pt-a-conta', 'pt-sem', 'pt-polvo', 'pt-gostoso'],
        ),
        ex.fillBlank(
          'Para mim, um café ___ leite.',
          'Para mí, un café con leche.',
          'com',
          ['sem', 'da', 'do'],
          ['pt-com', 'pt-para-mim', 'pt-leite'],
        ),
        ex.shortAnswer(
          'Mais alguma coisa?',
          '¿Algo más? (Pedí la cuenta.)',
          'A conta, por favor.',
          [
            'A conta.',
            'Eu queria a conta, por favor.',
            'Queria a conta, por favor.',
            'Eu queria a conta.',
            'Só a conta, por favor.',
          ],
          ['pt-a-conta'],
        ),
        ex.translateWrite(
          'Quisiera un café y la cuenta, por favor.',
          'Eu queria um café e a conta, por favor.',
          ['pt-queria', 'pt-a-conta'],
          { acceptedAnswers: ['Queria um café e a conta, por favor.'] },
        ),
      ],
    },
  ],
};
