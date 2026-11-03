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

/**
 * Redactada sin revisión de un hablante nativo: necesita revisión lingüística. Dove ya está en la
 * unidad 6: acá se suma dov'è y las direcciones.
 */
export const unit10: UnitDef = {
  position: 10,
  title: 'La ciudad',
  titleEn: 'La città',
  description: 'Lugares de la ciudad, preguntar dónde está algo, ir a un lugar y dar direcciones.',
  emoji: '🏙️',
  objective:
    "Podés preguntar dov'è…?, decir adónde vas con vado a / vado in y entender a destra, a sinistra, sempre dritto, vicino y lontano.",
  grammar: {
    title: 'Andare: vado a… / vado in…',
    explanation:
      'Andare («ir») es irregular: vado, vai, va. Con ciudades y con casa se usa a: vado a Roma, vado a casa. Con muchos lugares de la ciudad se usa in sin artículo: vado in banca, vado in piazza, vado in centro.',
    examples: [
      { target: 'Vado a Roma.', base: 'Voy a Roma.' },
      { target: 'Vado in banca.', base: 'Voy al banco.' },
      { target: "Scusi, dov'è la stazione?", base: 'Disculpe, ¿dónde está la estación?' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de italiano (uso de a / in).',
  },
  words: [
    w(
      'it-citta',
      'città',
      'ciudad',
      'Roma è una città molto bella.',
      'Roma es una ciudad muy linda.',
      ['places'],
      { emoji: '🏙️' },
    ),
    w('it-strada', 'strada', 'calle', 'La strada è lunga.', 'La calle es larga.', ['places'], {
      acceptedTranslations: ['camino'],
      emoji: '🛣️',
    }),
    w('it-piazza', 'piazza', 'plaza', 'Il bar è in piazza.', 'El bar está en la plaza.', [
      'places',
    ]),
    w(
      'it-stazione',
      'stazione',
      'estación',
      "Dov'è la stazione?",
      '¿Dónde está la estación?',
      ['places'],
      { emoji: '🚉' },
    ),
    w('it-banca', 'banca', 'banco (de dinero)', 'Vado in banca.', 'Voy al banco.', ['places'], {
      emoji: '🏦',
    }),
    w(
      'it-ospedale',
      'ospedale',
      'hospital',
      "L'ospedale è vicino.",
      'El hospital está cerca.',
      ['places'],
      { emoji: '🏥' },
    ),
    w(
      'it-ristorante',
      'ristorante',
      'restaurante',
      'Il ristorante è in piazza.',
      'El restaurante está en la plaza.',
      ['places'],
      { emoji: '🍝' },
    ),
    w(
      'it-albergo',
      'albergo',
      'hotel',
      "L'albergo è vicino alla stazione.",
      'El hotel está cerca de la estación.',
      ['places'],
      { emoji: '🏨' },
    ),
    w(
      'it-supermercato',
      'supermercato',
      'supermercado',
      "Dov'è il supermercato?",
      '¿Dónde está el supermercado?',
      ['places'],
      { emoji: '🛒' },
    ),
    w('it-dov-e', "dov'è?", '¿dónde está?', "Dov'è la stazione?", '¿Dónde está la estación?', [
      'questions',
    ]),
    w(
      'it-scusi',
      'scusi',
      'disculpe',
      "Scusi, dov'è la banca?",
      'Disculpe, ¿dónde está el banco?',
      ['courtesy'],
      { acceptedTranslations: ['perdone'] },
    ),
    w('it-vado', 'vado', 'voy', 'Vado a casa.', 'Voy a casa.', ['verbs']),
    w('it-vai', 'vai', 'vas', 'Dove vai?', '¿Adónde vas?', ['verbs']),
    w(
      'it-a-destra',
      'a destra',
      'a la derecha',
      'La banca è a destra.',
      'El banco está a la derecha.',
      ['directions'],
      { emoji: '➡️' },
    ),
    w(
      'it-a-sinistra',
      'a sinistra',
      'a la izquierda',
      "L'albergo è a sinistra.",
      'El hotel está a la izquierda.',
      ['directions'],
      { emoji: '⬅️' },
    ),
    w(
      'it-sempre-dritto',
      'sempre dritto',
      'todo derecho',
      'Vai sempre dritto.',
      'Andá todo derecho.',
      ['directions'],
      { acceptedTranslations: ['todo recto', 'siempre derecho'], emoji: '⬆️' },
    ),
    w('it-vicino', 'vicino', 'cerca', 'La stazione è vicino.', 'La estación está cerca.', [
      'directions',
    ]),
    w('it-lontano', 'lontano', 'lejos', "L'ospedale è lontano.", 'El hospital está lejos.', [
      'directions',
    ]),
  ],
  lessons: [
    {
      title: 'In città',
      objective: 'Nombrar lugares de la ciudad.',
      intro: {
        explanation:
          'Algunos lugares se parecen al español: ristorante, supermercato, stazione. Otros no: el hotel también se dice albergo, la calle es strada y el banco (de plata) es banca.',
        examples: [
          { target: 'Il ristorante è in piazza.', base: 'El restaurante está en la plaza.' },
          { target: 'Roma è una città molto bella.', base: 'Roma es una ciudad muy linda.' },
        ],
      },
      takeaways: ['Nombrás lugares de la ciudad.', 'Sabés que el banco es banca.'],
      exercises: [
        ex.imageChoice('🚉', 'stazione', ['banca', 'piazza', 'albergo'], ['it-stazione']),
        ex.imageChoice('🏦', 'banca', ['ospedale', 'stazione', 'strada'], ['it-banca']),
        ex.translationChoice('strada', 'calle', ['plaza', 'ciudad', 'estación'], ['it-strada']),
        ex.translationChoice(
          'albergo',
          'hotel',
          ['hospital', 'restaurante', 'banco (de dinero)'],
          ['it-albergo'],
        ),
        ex.listenChoice(
          'Il ristorante è in piazza.',
          ['Il ristorante è in strada.', 'La banca è in piazza.', 'Il bar è in piazza.'],
          ['it-ristorante', 'it-piazza'],
        ),
        ex.matchPairs(
          [
            ['città', 'ciudad'],
            ['strada', 'calle'],
            ['piazza', 'plaza'],
            ['ospedale', 'hospital'],
          ],
          ['it-citta', 'it-strada', 'it-piazza', 'it-ospedale'],
        ),
        ex.translateWrite('La estación', 'la stazione', ['it-la', 'it-stazione']),
        ex.translateWrite(
          'El hotel está en la plaza.',
          "L'albergo è in piazza.",
          ['it-albergo', 'it-piazza'],
          { acceptedAnswers: ["L'hotel è in piazza."] },
        ),
      ],
    },
    {
      title: "Dov'è…?",
      objective: 'Preguntar dónde está un lugar.',
      intro: {
        explanation:
          "Dov'è…? (dove + è) es «¿dónde está…?». A un desconocido se le habla de usted: scusi («disculpe»); a un amigo, scusa.",
        examples: [
          { target: "Scusi, dov'è la stazione?", base: 'Disculpe, ¿dónde está la estación?' },
          { target: "Dov'è il supermercato?", base: '¿Dónde está el supermercado?' },
        ],
      },
      takeaways: [
        "Preguntás dónde está algo con dov'è?",
        'Le hablás de usted a un desconocido con scusi.',
      ],
      exercises: [
        ex.translationChoice(
          "dov'è?",
          '¿dónde está?',
          ['¿qué es?', '¿a qué hora?', '¿qué hora es?'],
          ['it-dov-e'],
        ),
        ex.translationChoice(
          'scusi',
          'disculpe',
          ['gracias', 'de nada', 'por favor'],
          ['it-scusi'],
          {
            explanation: 'Scusi es de usted; a un amigo se le dice scusa.',
          },
        ),
        ex.imageChoice(
          '🛒',
          'supermercato',
          ['ristorante', 'ospedale', 'albergo'],
          ['it-supermercato'],
        ),
        ex.listenChoice(
          "Scusi, dov'è la stazione?",
          ["Scusi, dov'è la banca?", "Dov'è il bagno?", 'Scusi, che ore sono?'],
          ['it-scusi', 'it-dov-e', 'it-stazione'],
        ),
        ex.fillBlank(
          "Scusi, ___ l'ospedale?",
          'Disculpe, ¿dónde está el hospital?',
          "dov'è",
          ["che cos'è", 'a che ora', 'come stai'],
          ['it-scusi', 'it-dov-e', 'it-ospedale'],
        ),
        ex.orderWords("Scusi, dov'è il supermercato?", 'Disculpe, ¿dónde está el supermercado?', [
          'it-scusi',
          'it-dov-e',
          'it-supermercato',
        ]),
        ex.translateWrite('¿Dónde está el banco?', "Dov'è la banca?", ['it-dov-e', 'it-banca']),
        ex.translateWrite('Disculpe, ¿dónde está el restaurante?', "Scusi, dov'è il ristorante?", [
          'it-scusi',
          'it-dov-e',
          'it-ristorante',
        ]),
      ],
    },
    {
      title: 'Vado a… Vado in…',
      objective: 'Decir adónde vas.',
      intro: {
        explanation:
          'Vado es «voy» y vai «vas». Con ciudades y con casa va a: vado a Roma, vado a casa. Con lugares como banca, piazza o centro va in, sin artículo: vado in banca («voy al banco»).',
        examples: [
          { target: 'Dove vai? Vado a casa.', base: '¿Adónde vas? Voy a casa.' },
          { target: 'Vado in banca.', base: 'Voy al banco.' },
        ],
      },
      takeaways: ['Decís adónde vas con vado.', 'Elegís entre a (ciudades, casa) e in (lugares).'],
      exercises: [
        ex.translationChoice('vado', 'voy', ['vas', 'tengo', 'soy'], ['it-vado']),
        ex.translationChoice('vai', 'vas', ['voy', 'sos', 'tenés'], ['it-vai']),
        ex.listenChoice(
          'Dove vai?',
          ['Dove sei?', 'Di dove sei?', 'Dove vado?'],
          ['it-dove', 'it-vai'],
        ),
        ex.fillBlank('Vado ___ Roma.', 'Voy a Roma.', 'a', ['in', 'di', 'nel'], ['it-vado'], {
          explanation: 'Con ciudades se usa a: vado a Roma.',
        }),
        ex.fillBlank(
          'Vado ___ banca.',
          'Voy al banco.',
          'in',
          ['a', 'di', 'nella'],
          ['it-vado', 'it-banca'],
          { explanation: 'Con banca, piazza o centro se usa in sin artículo: vado in banca.' },
        ),
        ex.orderWords('Oggi vado in città.', 'Hoy voy a la ciudad.', [
          'it-oggi',
          'it-vado',
          'it-citta',
        ]),
        ex.shortAnswer(
          'Dove vai?',
          '¿Adónde vas? (Respondé que vas a casa.)',
          'Vado a casa.',
          ['Io vado a casa.', 'A casa.'],
          ['it-vado', 'it-a-casa'],
        ),
        ex.translateWrite('Voy al banco.', 'Vado in banca.', ['it-vado', 'it-banca'], {
          acceptedAnswers: ['Io vado in banca.'],
        }),
      ],
    },
    {
      title: 'A destra, a sinistra',
      objective: 'Entender y dar direcciones.',
      intro: {
        explanation:
          'Para dar direcciones: a destra («a la derecha»), a sinistra («a la izquierda») y sempre dritto («todo derecho»). Ojo: sinistra se parece a «siniestra», que en español también quiere decir izquierda.',
        examples: [
          { target: 'La banca è a destra.', base: 'El banco está a la derecha.' },
          { target: 'Vai sempre dritto.', base: 'Andá todo derecho.' },
        ],
      },
      takeaways: ['Entendés a destra y a sinistra.', 'Das la indicación sempre dritto.'],
      exercises: [
        ex.imageChoice(
          '➡️',
          'a destra',
          ['a sinistra', 'sempre dritto', 'vicino'],
          ['it-a-destra'],
        ),
        ex.imageChoice(
          '⬅️',
          'a sinistra',
          ['a destra', 'sempre dritto', 'lontano'],
          ['it-a-sinistra'],
        ),
        ex.translationChoice(
          'sempre dritto',
          'todo derecho',
          ['a la derecha', 'siempre', 'cerca'],
          ['it-sempre-dritto'],
        ),
        ex.listenChoice(
          "L'albergo è a sinistra.",
          ["L'albergo è a destra.", "L'ospedale è a sinistra.", "L'albergo è vicino."],
          ['it-albergo', 'it-a-sinistra'],
        ),
        ex.fillBlank(
          'La stazione è a ___.',
          'La estación está a la derecha.',
          'destra',
          ['sinistra', 'dritto', 'casa'],
          ['it-stazione', 'it-a-destra'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords(
          'Vai sempre dritto e poi a destra.',
          'Andá todo derecho y después a la derecha.',
          ['it-vai', 'it-sempre-dritto', 'it-poi', 'it-a-destra'],
        ),
        ex.translateWrite('El banco está a la izquierda.', 'La banca è a sinistra.', [
          'it-banca',
          'it-a-sinistra',
        ]),
        ex.translateWrite('Todo derecho y después a la derecha.', 'Sempre dritto e poi a destra.', [
          'it-sempre-dritto',
          'it-poi',
          'it-a-destra',
        ]),
      ],
    },
    {
      title: 'Vicino o lontano?',
      objective: 'Decir si un lugar está cerca o lejos.',
      intro: {
        explanation:
          'Vicino es «cerca» y lontano «lejos». Se usan con è: la stazione è vicino. Para decir cerca de qué: vicino a (vicino alla stazione).',
        examples: [
          { target: 'La stazione è vicino.', base: 'La estación está cerca.' },
          { target: "L'ospedale è lontano?", base: '¿El hospital está lejos?' },
        ],
      },
      takeaways: [
        'Decís si algo está cerca o lejos.',
        'Preguntás y entendés indicaciones completas.',
      ],
      exercises: [
        ex.translationChoice(
          'vicino',
          'cerca',
          ['lejos', 'a la derecha', 'todo derecho'],
          ['it-vicino'],
        ),
        ex.translationChoice(
          'lontano',
          'lejos',
          ['cerca', 'a la izquierda', 'calle'],
          ['it-lontano'],
        ),
        ex.listenChoice(
          "L'ospedale è lontano?",
          ["L'ospedale è vicino?", "Dov'è l'ospedale?", 'La stazione è lontano?'],
          ['it-ospedale', 'it-lontano'],
        ),
        ex.fillBlank(
          'Il supermercato è ___: cinque minuti.',
          'El supermercado está cerca: cinco minutos.',
          'vicino',
          ['lontano', 'a sinistra', 'domani'],
          ['it-supermercato', 'it-vicino', 'it-cinque'],
          { skill: 'vocabulary' },
        ),
        ex.matchPairs(
          [
            ['vicino', 'cerca'],
            ['lontano', 'lejos'],
            ['a destra', 'a la derecha'],
            ['a sinistra', 'a la izquierda'],
          ],
          ['it-vicino', 'it-lontano', 'it-a-destra', 'it-a-sinistra'],
        ),
        ex.orderWords("Scusi, l'albergo è lontano?", 'Disculpe, ¿el hotel está lejos?', [
          'it-scusi',
          'it-albergo',
          'it-lontano',
        ]),
        ex.shortAnswer(
          "Scusi, dov'è la stazione?",
          'Disculpe, ¿dónde está la estación? (Respondé que está a la derecha.)',
          'È a destra.',
          ['La stazione è a destra.', 'A destra.'],
          ['it-a-destra', 'it-stazione'],
        ),
        ex.translateWrite(
          'La estación está cerca.',
          'La stazione è vicino.',
          ['it-stazione', 'it-vicino'],
          { acceptedAnswers: ['La stazione è vicina.'] },
        ),
      ],
    },
  ],
};
