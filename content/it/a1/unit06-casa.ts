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
export const unit06: UnitDef = {
  position: 6,
  title: 'La casa',
  titleEn: 'La casa',
  description: 'Las partes de la casa, los muebles, decir qué hay y dónde está cada cosa.',
  emoji: '🏠',
  objective:
    "Podés describir tu casa con c'è y ci sono y decir dónde está algo con in, nel / nella y sul / sulla.",
  grammar: {
    title: "C'è / ci sono y las preposiciones articuladas",
    explanation:
      "C'è es «hay» con una cosa y ci sono con varias. In y su se juntan con el artículo: in + il = nel, in + la = nella, su + il = sul, su + la = sulla. Con las habitaciones de la casa se usa in sin artículo: in cucina.",
    examples: [
      { target: "In camera c'è un letto.", base: 'En la habitación hay una cama.' },
      { target: 'Ci sono due sedie.', base: 'Hay dos sillas.' },
      { target: 'Il libro è sul tavolo.', base: 'El libro está sobre la mesa.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de italiano.',
  },
  words: [
    w(
      'it-camera',
      'camera',
      'habitación',
      'La mia camera è piccola.',
      'Mi habitación es chica.',
      ['home'],
      {
        acceptedTranslations: ['dormitorio', 'cuarto'],
      },
    ),
    w('it-cucina', 'cucina', 'cocina', 'Sono in cucina.', 'Estoy en la cocina.', ['home']),
    w('it-bagno', 'bagno', 'baño', 'Il bagno è qui.', 'El baño está acá.', ['home'], {
      emoji: '🛁',
    }),
    w(
      'it-soggiorno',
      'soggiorno',
      'living',
      'Mia madre è in soggiorno.',
      'Mi mamá está en el living.',
      ['home'],
      { acceptedTranslations: ['sala de estar', 'comedor'] },
    ),
    w('it-tavolo', 'tavolo', 'mesa', 'Il libro è sul tavolo.', 'El libro está sobre la mesa.', [
      'home',
    ]),
    w('it-sedia', 'sedia', 'silla', 'Ci sono due sedie.', 'Hay dos sillas.', ['home'], {
      emoji: '🪑',
    }),
    w(
      'it-letto',
      'letto',
      'cama',
      "In camera c'è un letto.",
      'En la habitación hay una cama.',
      ['home'],
      {
        emoji: '🛏️',
      },
    ),
    w('it-divano', 'divano', 'sillón', 'Il divano è grande.', 'El sillón es grande.', ['home'], {
      acceptedTranslations: ['sofá'],
      emoji: '🛋️',
    }),
    w('it-finestra', 'finestra', 'ventana', 'La finestra è aperta.', 'La ventana está abierta.', [
      'home',
    ]),
    w('it-porta', 'porta', 'puerta', 'La porta è bianca.', 'La puerta es blanca.', ['home'], {
      emoji: '🚪',
    }),
    w(
      'it-borsa',
      'borsa',
      'cartera',
      'Il telefono è nella borsa.',
      'El teléfono está en la cartera.',
      ['objects'],
      {
        acceptedTranslations: ['bolso'],
        emoji: '👜',
      },
    ),
    w(
      'it-cassetto',
      'cassetto',
      'cajón',
      'Le chiavi sono nel cassetto.',
      'Las llaves están en el cajón.',
      ['home'],
    ),
    w('it-c-e', "c'è", 'hay (una cosa)', "C'è un divano.", 'Hay un sillón.', ['grammar']),
    w('it-ci-sono', 'ci sono', 'hay (varias cosas)', 'Ci sono tre sedie.', 'Hay tres sillas.', [
      'grammar',
    ]),
    w('it-in', 'in', 'en', 'Sono in cucina.', 'Estoy en la cocina.', ['prepositions']),
    w(
      'it-nel',
      'nel',
      'en el (in + il)',
      'Le chiavi sono nel cassetto.',
      'Las llaves están en el cajón.',
      ['prepositions'],
    ),
    w(
      'it-nella',
      'nella',
      'en la (in + la)',
      'Il telefono è nella borsa.',
      'El teléfono está en la cartera.',
      ['prepositions'],
    ),
    w(
      'it-sul',
      'sul',
      'sobre el (su + il)',
      'Il libro è sul tavolo.',
      'El libro está sobre la mesa.',
      ['prepositions'],
    ),
    w(
      'it-sulla',
      'sulla',
      'sobre la (su + la)',
      'La penna è sulla sedia.',
      'La lapicera está sobre la silla.',
      ['prepositions'],
    ),
    w('it-dove', 'dove', 'dónde', 'Dove sono le chiavi?', '¿Dónde están las llaves?', [
      'questions',
    ]),
  ],
  lessons: [
    {
      title: 'Le stanze',
      objective: 'Nombrar las partes de la casa.',
      intro: {
        explanation:
          'Para decir en qué parte de la casa estás se usa in, sin artículo: in cucina, in bagno, in camera. Ojo: sono también es «estoy» (sono in cucina), y camera es la habitación, no la cámara de fotos.',
        examples: [
          { target: 'Sono in cucina.', base: 'Estoy en la cocina.' },
          { target: 'Mia madre è in soggiorno.', base: 'Mi mamá está en el living.' },
        ],
      },
      takeaways: ['Nombrás las partes de la casa.', 'Decís dónde estás con in + habitación.'],
      exercises: [
        ex.translationChoice('cucina', 'cocina', ['baño', 'habitación', 'living'], ['it-cucina']),
        ex.translationChoice('camera', 'habitación', ['cocina', 'cama', 'baño'], ['it-camera'], {
          explanation: 'Camera es la habitación. La cámara de fotos es macchina fotografica.',
        }),
        ex.imageChoice('🛁', 'bagno', ['cucina', 'camera', 'soggiorno'], ['it-bagno']),
        ex.listenChoice(
          'in cucina',
          ['in bagno', 'in camera', 'in soggiorno'],
          ['it-in', 'it-cucina'],
        ),
        ex.fillBlank(
          'Sono ___ bagno.',
          'Estoy en el baño.',
          'in',
          ['sul', 'il', 'di'],
          ['it-in', 'it-bagno'],
          { explanation: 'Con las habitaciones de la casa va in sin artículo: in bagno.' },
        ),
        ex.matchPairs(
          [
            ['cucina', 'cocina'],
            ['bagno', 'baño'],
            ['camera', 'habitación'],
            ['soggiorno', 'living'],
          ],
          ['it-cucina', 'it-bagno', 'it-camera', 'it-soggiorno'],
        ),
        ex.translateWrite(
          'Estoy en la cocina.',
          'Sono in cucina.',
          ['it-sono', 'it-in', 'it-cucina'],
          {
            acceptedAnswers: ['Io sono in cucina.'],
            explanation: 'Sono es «soy» y también «estoy».',
          },
        ),
        ex.translateWrite('Mi papá está en el living.', 'Mio padre è in soggiorno.', [
          'it-mio',
          'it-in',
          'it-soggiorno',
        ]),
      ],
    },
    {
      title: 'I mobili',
      objective: 'Nombrar muebles y partes de una habitación.',
      intro: {
        explanation:
          'Tavolo es la mesa; sedia, la silla; letto, la cama; divano, el sillón. Finestra (ventana) y porta (puerta) son femeninas.',
        examples: [
          { target: 'Il letto è grande.', base: 'La cama es grande.' },
          { target: 'La finestra è aperta.', base: 'La ventana está abierta.' },
        ],
      },
      takeaways: ['Nombrás seis muebles y partes de la casa.', 'Sabés que tavolo es la mesa.'],
      exercises: [
        ex.imageChoice('🛏️', 'letto', ['divano', 'tavolo', 'sedia'], ['it-letto']),
        ex.imageChoice('🛋️', 'divano', ['letto', 'sedia', 'porta'], ['it-divano']),
        ex.imageChoice('🪑', 'sedia', ['tavolo', 'letto', 'finestra'], ['it-sedia']),
        ex.translationChoice('tavolo', 'mesa', ['silla', 'cama', 'ventana'], ['it-tavolo']),
        ex.listenChoice('la finestra', ['la porta', 'la sedia', 'il tavolo'], ['it-finestra']),
        ex.matchPairs(
          [
            ['finestra', 'ventana'],
            ['porta', 'puerta'],
            ['tavolo', 'mesa'],
            ['letto', 'cama'],
          ],
          ['it-finestra', 'it-porta', 'it-tavolo', 'it-letto'],
        ),
        ex.translateWrite('La silla', 'la sedia', ['it-la', 'it-sedia']),
        ex.translateWrite('La puerta y la ventana', 'la porta e la finestra', [
          'it-porta',
          'it-finestra',
        ]),
      ],
    },
    {
      title: "C'è, ci sono",
      objective: 'Decir qué hay en una habitación.',
      intro: {
        explanation:
          "C'è es «hay» con una cosa y ci sono, con varias: c'è un divano, ci sono due sedie. Para preguntar alcanza con el signo de pregunta: c'è un bagno?",
        examples: [
          { target: "In camera c'è un letto.", base: 'En la habitación hay una cama.' },
          { target: 'In cucina ci sono quattro sedie.', base: 'En la cocina hay cuatro sillas.' },
        ],
      },
      takeaways: ["Decís qué hay con c'è y ci sono.", "Preguntás si hay algo: c'è…?"],
      exercises: [
        ex.translationChoice(
          "c'è",
          'hay (una cosa)',
          ['hay (varias cosas)', 'es', 'tiene'],
          ['it-c-e'],
        ),
        ex.fillBlank(
          'In soggiorno ___ un divano.',
          'En el living hay un sillón.',
          "c'è",
          ['ci sono', 'sono', 'ho'],
          ['it-c-e', 'it-divano'],
        ),
        ex.fillBlank(
          'In cucina ___ due finestre.',
          'En la cocina hay dos ventanas.',
          'ci sono',
          ["c'è", 'ha', 'ho'],
          ['it-ci-sono', 'it-finestra'],
          { explanation: 'Con varias cosas: ci sono.' },
        ),
        ex.listenChoice(
          "C'è un bagno?",
          ['Ci sono due bagni.', "C'è un letto.", 'Dove sei?'],
          ['it-c-e', 'it-bagno'],
        ),
        ex.orderWords("In camera c'è un letto.", 'En la habitación hay una cama.', [
          'it-in',
          'it-camera',
          'it-c-e',
          'it-letto',
        ]),
        ex.orderWords('Ci sono tre sedie.', 'Hay tres sillas.', [
          'it-ci-sono',
          'it-tre',
          'it-sedia',
        ]),
        ex.translateWrite('Hay una mesa.', "C'è un tavolo.", ['it-c-e', 'it-tavolo'], {
          explanation: 'Tavolo es masculino: un tavolo.',
        }),
        ex.translateWrite(
          'Hay dos camas.',
          'Ci sono due letti.',
          ['it-ci-sono', 'it-due', 'it-letto'],
          {
            explanation: 'Letto → letti en plural.',
          },
        ),
      ],
    },
    {
      title: 'Nel, nella',
      objective: 'Decir dentro de qué está algo.',
      intro: {
        explanation:
          'Con un objeto concreto, in se junta con el artículo: in + il = nel, in + la = nella (y in + lo = nello). Con las habitaciones alcanza in: in cucina.',
        examples: [
          { target: 'Il telefono è nella borsa.', base: 'El teléfono está en la cartera.' },
          { target: 'Le chiavi sono nel cassetto.', base: 'Las llaves están en el cajón.' },
        ],
      },
      takeaways: ['Decís dónde está algo con nel y nella.', 'Usás in solo con las habitaciones.'],
      exercises: [
        ex.translationChoice('borsa', 'cartera', ['mochila', 'llave', 'mesa'], ['it-borsa']),
        ex.translationChoice('cassetto', 'cajón', ['cartera', 'cocina', 'silla'], ['it-cassetto']),
        ex.fillBlank(
          'Il libro è ___ borsa.',
          'El libro está en la cartera.',
          'nella',
          ['nel', 'sulla', 'in'],
          ['it-nella', 'it-borsa'],
          { explanation: 'Borsa es femenina: in + la = nella.' },
        ),
        ex.fillBlank(
          'Le chiavi sono ___ cassetto.',
          'Las llaves están en el cajón.',
          'nel',
          ['nella', 'in', 'sul'],
          ['it-nel', 'it-cassetto'],
          { explanation: 'Cassetto es masculino: in + il = nel.' },
        ),
        ex.listenChoice(
          'nel cassetto',
          ['nella borsa', 'sul tavolo', 'in cucina'],
          ['it-nel', 'it-cassetto'],
        ),
        ex.matchPairs(
          [
            ['in + il', 'nel'],
            ['in + la', 'nella'],
            ['in + lo', 'nello'],
            ["in + l'", "nell'"],
          ],
          ['it-nel', 'it-nella', 'it-in'],
        ),
        ex.orderWords('Il telefono è nella borsa.', 'El teléfono está en la cartera.', [
          'it-nella',
          'it-borsa',
        ]),
        ex.translateWrite(
          'Las llaves están en el cajón.',
          'Le chiavi sono nel cassetto.',
          ['it-le', 'it-chiave', 'it-nel', 'it-cassetto'],
          { explanation: 'Sono es «son» y también «están».' },
        ),
        ex.translateWrite('La llave está en la cartera.', 'La chiave è nella borsa.', [
          'it-chiave',
          'it-nella',
          'it-borsa',
        ]),
      ],
    },
    {
      title: 'Sul, sulla. Dove?',
      objective: 'Preguntar dónde está algo y decir que está sobre otra cosa.',
      intro: {
        explanation:
          "Su es «sobre» y también se junta con el artículo: su + il = sul, su + la = sulla. Para preguntar dónde está algo: dov'è…? (dove + è); con varias cosas, dove sono…?",
        examples: [
          { target: 'Il libro è sul tavolo.', base: 'El libro está sobre la mesa.' },
          {
            target: "Dov'è la chiave? È sulla sedia.",
            base: '¿Dónde está la llave? Está sobre la silla.',
          },
        ],
      },
      takeaways: [
        "Preguntás dónde está algo con dov'è…?",
        'Decís que algo está sobre otra cosa con sul y sulla.',
      ],
      exercises: [
        ex.translationChoice('dove', 'dónde', ['qué', 'cuándo', 'cómo'], ['it-dove']),
        ex.fillBlank(
          'Il libro è ___ tavolo.',
          'El libro está sobre la mesa.',
          'sul',
          ['sulla', 'nella', 'in'],
          ['it-sul', 'it-tavolo'],
          { explanation: 'Tavolo es masculino: su + il = sul.' },
        ),
        ex.fillBlank(
          'La penna è ___ sedia.',
          'La lapicera está sobre la silla.',
          'sulla',
          ['sul', 'nel', 'in'],
          ['it-sulla', 'it-sedia'],
          { explanation: 'Sedia es femenina: su + la = sulla.' },
        ),
        ex.listenChoice(
          'sul divano',
          ['sulla sedia', 'nel cassetto', 'in camera'],
          ['it-sul', 'it-divano'],
        ),
        ex.orderWords('Dove sono le chiavi?', '¿Dónde están las llaves?', [
          'it-dove',
          'it-le',
          'it-chiave',
        ]),
        ex.matchPairs(
          [
            ['sul', 'sobre el'],
            ['sulla', 'sobre la'],
            ['nel', 'en el'],
            ['nella', 'en la'],
          ],
          ['it-sul', 'it-sulla', 'it-nel', 'it-nella'],
        ),
        ex.shortAnswer(
          "Dov'è il libro?",
          '¿Dónde está el libro? (Respondé que está sobre la mesa.)',
          'È sul tavolo.',
          ['Il libro è sul tavolo.', 'Sul tavolo.'],
          ['it-dove', 'it-sul', 'it-tavolo'],
        ),
        ex.translateWrite('El teléfono está sobre la cama.', 'Il telefono è sul letto.', [
          'it-sul',
          'it-letto',
        ]),
      ],
    },
  ],
};
