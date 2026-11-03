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

/**
 * Variante de Brasil. Redactada sin revisión de un hablante nativo: necesita revisión lingüística.
 * No/na van como frases hechas (no quarto, na cozinha): «no» suelto chocaría con não («no»).
 */
export const unit06: UnitDef = {
  position: 6,
  title: 'La casa',
  titleEn: 'A casa',
  description: 'Las partes de la casa, los muebles, decir qué hay y dónde está cada cosa.',
  emoji: '🏠',
  objective:
    'Podés describir tu casa con tem / há y decir dónde está algo con no / na, em cima de y embaixo de.',
  grammar: {
    title: 'Tem / há y em + artículo',
    explanation:
      'Para decir «hay», en Brasil se usa casi siempre tem; há es más formal. Em («en») se junta con el artículo: em + o = no, em + a = na. Para ubicar algo: está + no / na / em cima de / embaixo de.',
    examples: [
      { target: 'Na sala tem um sofá.', base: 'En el living hay un sillón.' },
      { target: 'O livro está no quarto.', base: 'El libro está en el dormitorio.' },
      { target: 'A chave está em cima da mesa.', base: 'La llave está encima de la mesa.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de portugués de Brasil.',
  },
  words: [
    w(
      'pt-quarto',
      'quarto',
      'dormitorio',
      'Meu quarto é pequeno.',
      'Mi dormitorio es chico.',
      ['home'],
      {
        acceptedTranslations: ['habitación', 'cuarto'],
      },
    ),
    w('pt-cozinha', 'cozinha', 'cocina', 'A cozinha é grande.', 'La cocina es grande.', ['home']),
    w('pt-banheiro', 'banheiro', 'baño', 'O banheiro é ali.', 'El baño es ahí.', ['home'], {
      emoji: '🛁',
    }),
    w(
      'pt-sala',
      'sala',
      'living',
      'Na sala tem um sofá.',
      'En el living hay un sillón.',
      ['home'],
      {
        acceptedTranslations: ['sala', 'sala de estar'],
      },
    ),
    w('pt-mesa', 'mesa', 'mesa', 'Tem uma mesa na cozinha.', 'Hay una mesa en la cocina.', [
      'home',
    ]),
    w('pt-cadeira', 'cadeira', 'silla', 'A cadeira é branca.', 'La silla es blanca.', ['home'], {
      emoji: '🪑',
    }),
    w(
      'pt-cama',
      'cama',
      'cama',
      'Tem uma cama no quarto.',
      'Hay una cama en el dormitorio.',
      ['home'],
      {
        emoji: '🛏️',
      },
    ),
    w(
      'pt-sofa',
      'sofá',
      'sillón',
      'Na sala tem um sofá.',
      'En el living hay un sillón.',
      ['home'],
      {
        emoji: '🛋️',
      },
    ),
    w('pt-janela', 'janela', 'ventana', 'A janela é branca.', 'La ventana es blanca.', ['home']),
    w('pt-porta', 'porta', 'puerta', 'A porta é azul.', 'La puerta es azul.', ['home'], {
      emoji: '🚪',
    }),
    w('pt-ha', 'há', 'hay', 'Há três quartos.', 'Hay tres dormitorios.', ['grammar']),
    w('pt-esta', 'está', 'está', 'O livro está no quarto.', 'El libro está en el dormitorio.', [
      'verbs',
    ]),
    w(
      'pt-no-quarto',
      'no quarto',
      'en el dormitorio',
      'Meu pai está no quarto.',
      'Mi papá está en el dormitorio.',
      ['prepositions', 'home'],
    ),
    w(
      'pt-na-cozinha',
      'na cozinha',
      'en la cocina',
      'Minha mãe está na cozinha.',
      'Mi mamá está en la cocina.',
      ['prepositions', 'home'],
    ),
    w(
      'pt-em-cima',
      'em cima de',
      'encima de',
      'A chave está em cima da mesa.',
      'La llave está encima de la mesa.',
      ['prepositions'],
      { acceptedTranslations: ['sobre'] },
    ),
    w(
      'pt-embaixo',
      'embaixo de',
      'debajo de',
      'O gato está embaixo da cama.',
      'El gato está debajo de la cama.',
      ['prepositions'],
    ),
    w('pt-onde', 'onde', 'dónde', 'Onde está a chave?', '¿Dónde está la llave?', ['questions']),
  ],
  lessons: [
    {
      title: 'Os cômodos',
      objective: 'Nombrar las partes de la casa.',
      intro: {
        explanation:
          'Las partes de la casa. Quarto es el dormitorio (el número cuatro es quatro) y banheiro, el baño. Sala es el living.',
        examples: [
          { target: 'A cozinha é grande.', base: 'La cocina es grande.' },
          { target: 'Meu quarto é pequeno.', base: 'Mi dormitorio es chico.' },
        ],
      },
      takeaways: ['Nombrás las partes de la casa.', 'Sabés que quarto es el dormitorio.'],
      exercises: [
        ex.translationChoice('cozinha', 'cocina', ['baño', 'dormitorio', 'living'], ['pt-cozinha']),
        ex.translationChoice('quarto', 'dormitorio', ['cuatro', 'cocina', 'baño'], ['pt-quarto'], {
          explanation: 'Quarto es el dormitorio. El número cuatro es quatro.',
        }),
        ex.imageChoice('🛁', 'banheiro', ['cozinha', 'quarto', 'sala'], ['pt-banheiro']),
        ex.listenChoice('a cozinha', ['o quarto', 'o banheiro', 'a sala'], ['pt-cozinha']),
        ex.matchPairs(
          [
            ['quarto', 'dormitorio'],
            ['cozinha', 'cocina'],
            ['banheiro', 'baño'],
            ['sala', 'living'],
          ],
          ['pt-quarto', 'pt-cozinha', 'pt-banheiro', 'pt-sala'],
        ),
        ex.fillBlank(
          'Meu ___ é pequeno.',
          'Mi dormitorio es chico.',
          'quarto',
          ['cozinha', 'sala', 'janela'],
          ['pt-quarto', 'pt-meu'],
          { skill: 'vocabulary' },
        ),
        ex.translateWrite('La cocina', 'a cozinha', ['pt-a', 'pt-cozinha']),
        ex.translateWrite('Mi baño', 'meu banheiro', ['pt-meu', 'pt-banheiro'], {
          acceptedAnswers: ['o meu banheiro'],
        }),
      ],
    },
    {
      title: 'Os móveis',
      objective: 'Nombrar muebles y partes de una habitación.',
      intro: {
        explanation:
          'Muchos muebles se parecen al español: mesa, cama, sofá (el sillón). Ojo con cadeira (silla) y janela (ventana).',
        examples: [
          { target: 'A cama é grande.', base: 'La cama es grande.' },
          { target: 'A janela é branca.', base: 'La ventana es blanca.' },
        ],
      },
      takeaways: ['Nombrás seis muebles y partes de la casa.', 'Sabés que cadeira es la silla.'],
      exercises: [
        ex.imageChoice('🪑', 'cadeira', ['mesa', 'cama', 'sofá'], ['pt-cadeira']),
        ex.imageChoice('🛋️', 'sofá', ['cama', 'cadeira', 'porta'], ['pt-sofa']),
        ex.imageChoice('🛏️', 'cama', ['sofá', 'mesa', 'janela'], ['pt-cama']),
        ex.translationChoice('janela', 'ventana', ['puerta', 'silla', 'mesa'], ['pt-janela']),
        ex.listenChoice('a porta', ['a janela', 'a cadeira', 'a mesa'], ['pt-porta']),
        ex.matchPairs(
          [
            ['janela', 'ventana'],
            ['porta', 'puerta'],
            ['cadeira', 'silla'],
            ['sofá', 'sillón'],
          ],
          ['pt-janela', 'pt-porta', 'pt-cadeira', 'pt-sofa'],
        ),
        ex.translateWrite('La silla es blanca.', 'A cadeira é branca.', [
          'pt-cadeira',
          'pt-branco',
        ]),
        ex.translateWrite('La puerta y la ventana', 'a porta e a janela', [
          'pt-porta',
          'pt-janela',
        ]),
      ],
    },
    {
      title: 'Tem, há',
      objective: 'Decir qué hay en la casa.',
      intro: {
        explanation:
          'Para decir «hay», en Brasil se usa casi siempre tem: tem um sofá na sala. Há significa lo mismo, pero es más formal o escrito. Ninguno cambia en plural: tem duas cadeiras (con femeninas, «dos» es duas).',
        examples: [
          { target: 'Na sala tem um sofá.', base: 'En el living hay un sillón.' },
          { target: 'Há três quartos.', base: 'Hay tres dormitorios.' },
        ],
      },
      takeaways: ['Decís qué hay con tem.', 'Reconocés há en textos más formales.'],
      exercises: [
        ex.translationChoice('há', 'hay', ['tengo', 'es / sos', 'dónde'], ['pt-ha']),
        ex.fillBlank(
          'Na cozinha ___ uma mesa.',
          'En la cocina hay una mesa.',
          'tem',
          ['é', 'sou', 'está'],
          ['pt-tem', 'pt-mesa', 'pt-na-cozinha'],
          { explanation: 'En Brasil «hay» se dice tem.' },
        ),
        ex.fillBlank(
          '___ dois banheiros.',
          'Hay dos baños.',
          'Há',
          ['É', 'Sou', 'Está'],
          ['pt-ha', 'pt-dois', 'pt-banheiro'],
        ),
        ex.listenChoice(
          'Tem uma cama no quarto.',
          ['Tem um sofá na sala.', 'Há duas cadeiras.', 'A cama é grande.'],
          ['pt-tem', 'pt-cama', 'pt-no-quarto'],
        ),
        ex.translationChoice(
          'no quarto',
          'en el dormitorio',
          ['en la cocina', 'el dormitorio', 'en el baño'],
          ['pt-no-quarto'],
        ),
        ex.orderWords('Tem duas cadeiras na cozinha.', 'Hay dos sillas en la cocina.', [
          'pt-tem',
          'pt-cadeira',
          'pt-na-cozinha',
        ]),
        ex.translateWrite(
          'Hay una mesa en la cocina.',
          'Tem uma mesa na cozinha.',
          ['pt-tem', 'pt-na-cozinha'],
          {
            acceptedAnswers: [
              'Há uma mesa na cozinha.',
              'Na cozinha tem uma mesa.',
              'Na cozinha há uma mesa.',
            ],
          },
        ),
        ex.translateWrite('Hay tres dormitorios.', 'Tem três quartos.', ['pt-tem', 'pt-quarto'], {
          acceptedAnswers: ['Há três quartos.'],
        }),
      ],
    },
    {
      title: 'No quarto, na cozinha',
      objective: 'Decir en qué parte de la casa está algo o alguien.',
      intro: {
        explanation:
          'Em («en») se junta con el artículo: em + o = no, em + a = na. Para decir dónde está algo o alguien se usa está: o livro está no quarto, minha mãe está na cozinha.',
        examples: [
          { target: 'Minha mãe está na cozinha.', base: 'Mi mamá está en la cocina.' },
          { target: 'O livro está no quarto.', base: 'El libro está en el dormitorio.' },
        ],
      },
      takeaways: ['Decís dónde está algo con está + no / na.', 'Juntás em + o = no y em + a = na.'],
      exercises: [
        ex.translationChoice(
          'na cozinha',
          'en la cocina',
          ['la cocina', 'en el dormitorio', 'en el baño'],
          ['pt-na-cozinha'],
        ),
        ex.fillBlank(
          'O celular está ___ quarto.',
          'El celular está en el dormitorio.',
          'no',
          ['na', 'em', 'do'],
          ['pt-no-quarto', 'pt-esta'],
          { explanation: 'Quarto es masculino: em + o = no.' },
        ),
        ex.fillBlank(
          'A chave está ___ sala.',
          'La llave está en el living.',
          'na',
          ['no', 'em', 'da'],
          ['pt-esta', 'pt-sala', 'pt-chave'],
          { explanation: 'Sala es femenina: em + a = na.' },
        ),
        ex.listenChoice(
          'Ela está na cozinha.',
          ['Ela está no quarto.', 'Ele está na sala.', 'Ela é da Ana.'],
          ['pt-esta', 'pt-na-cozinha', 'pt-ela'],
        ),
        ex.orderWords('Meu pai está no quarto.', 'Mi papá está en el dormitorio.', [
          'pt-meu',
          'pt-pai',
          'pt-esta',
          'pt-no-quarto',
        ]),
        ex.matchPairs(
          [
            ['no quarto', 'en el dormitorio'],
            ['na cozinha', 'en la cocina'],
            ['banheiro', 'baño'],
            ['janela', 'ventana'],
          ],
          ['pt-no-quarto', 'pt-na-cozinha', 'pt-banheiro', 'pt-janela'],
        ),
        ex.translateWrite(
          'Mi mamá está en la cocina.',
          'Minha mãe está na cozinha.',
          ['pt-minha', 'pt-mae', 'pt-na-cozinha'],
          { acceptedAnswers: ['A minha mãe está na cozinha.'] },
        ),
        ex.translateWrite('El libro está en el dormitorio.', 'O livro está no quarto.', [
          'pt-livro',
          'pt-no-quarto',
        ]),
      ],
    },
    {
      title: 'Onde está?',
      objective: 'Preguntar dónde está algo y ubicarlo.',
      intro: {
        explanation:
          'Para preguntar dónde está algo: onde está…? Para ubicarlo: em cima de (encima de) y embaixo de (debajo de). El de también se junta con el artículo: em cima da mesa, embaixo do sofá.',
        examples: [
          {
            target: 'Onde está a chave? Está em cima da mesa.',
            base: '¿Dónde está la llave? Está encima de la mesa.',
          },
          { target: 'O gato está embaixo da cama.', base: 'El gato está debajo de la cama.' },
        ],
      },
      takeaways: [
        'Preguntás dónde está algo con onde está…?',
        'Ubicás cosas con em cima de y embaixo de.',
      ],
      exercises: [
        ex.translationChoice('onde', 'dónde', ['qué', 'de quién', 'cómo'], ['pt-onde']),
        ex.translationChoice(
          'embaixo de',
          'debajo de',
          ['encima de', 'en la cocina', 'de quién'],
          ['pt-embaixo'],
        ),
        ex.fillBlank(
          'O livro está em cima ___ mesa.',
          'El libro está encima de la mesa.',
          'da',
          ['do', 'na', 'no'],
          ['pt-em-cima', 'pt-da', 'pt-mesa'],
          { explanation: 'Mesa es femenina: de + a = da.' },
        ),
        ex.fillBlank(
          'A borracha está embaixo ___ sofá.',
          'La goma está debajo del sillón.',
          'do',
          ['da', 'no', 'na'],
          ['pt-embaixo', 'pt-do', 'pt-sofa'],
          { explanation: 'Sofá es masculino: de + o = do.' },
        ),
        ex.listenChoice(
          'em cima da cama',
          ['embaixo da cama', 'em cima da mesa', 'na cozinha'],
          ['pt-em-cima', 'pt-cama'],
        ),
        ex.orderWords('Onde está o meu celular?', '¿Dónde está mi celular?', [
          'pt-onde',
          'pt-esta',
          'pt-meu',
        ]),
        ex.shortAnswer(
          'Onde está a chave? 🔑',
          '¿Dónde está la llave? (Respondé que está encima de la mesa.)',
          'Está em cima da mesa.',
          ['A chave está em cima da mesa.', 'Em cima da mesa.'],
          ['pt-onde', 'pt-em-cima', 'pt-mesa'],
        ),
        ex.translateWrite('La llave está debajo de la silla.', 'A chave está embaixo da cadeira.', [
          'pt-chave',
          'pt-embaixo',
          'pt-cadeira',
        ]),
      ],
    },
  ],
};
