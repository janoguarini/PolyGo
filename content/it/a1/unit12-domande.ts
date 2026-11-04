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
 * Redactada sin revisión de un hablante nativo: necesita revisión lingüística. Dove (U6), dov'è
 * (U10), a che ora (U9) y che cos'è (U5) ya están: acá se suman chi, cosa, quando, perché, come,
 * quale y los precios. Euro y caro son cognados: no van en ejercicios de traducción.
 */
export const unit12: UnitDef = {
  position: 12,
  title: 'Preguntas y precios',
  titleEn: 'Domande',
  description:
    'Preguntar quién, qué, cuándo, por qué, cómo y cuál, y preguntar cuánto cuesta algo en un negocio.',
  emoji: '❓',
  objective:
    'Podés hacer preguntas con chi, cosa, quando, perché, come y quale, preguntar quanto costa? / quanto costano? y decir si algo es caro o economico.',
  grammar: {
    title: 'Palabras para preguntar · quanto costa / quanto costano',
    explanation:
      'La palabra de pregunta va al principio: chi? (¿quién?), cosa? (¿qué?), quando? (¿cuándo?), perché? (¿por qué?), come? (¿cómo?), quale? (¿cuál?). Perché sirve también para responder: «porque». Para el precio: quanto costa? con una cosa y quanto costano? con varias.',
    examples: [
      { target: 'Quando parti? — Domani.', base: '¿Cuándo te vas? — Mañana.' },
      {
        target: 'Perché studi italiano? — Perché voglio viaggiare.',
        base: '¿Por qué estudiás italiano? — Porque quiero viajar.',
      },
      { target: 'Quanto costa il biglietto?', base: '¿Cuánto cuesta el boleto?' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de italiano (cosa / che cosa, quanto costa / costano).',
  },
  words: [
    w(
      'it-chi',
      'chi?',
      '¿quién?',
      'Chi è lui? — È mio fratello.',
      '¿Quién es él? — Es mi hermano.',
      ['questions'],
    ),
    w('it-cosa', 'cosa?', '¿qué?', 'Cosa mangi?', '¿Qué comés?', ['questions'], {
      acceptedTexts: ['che cosa?'],
    }),
    w(
      'it-cosa-fai',
      'cosa fai?',
      '¿qué hacés?',
      'Cosa fai oggi?',
      '¿Qué hacés hoy?',
      ['questions'],
      {
        acceptedTranslations: ['¿qué haces?'],
      },
    ),
    w('it-quando', 'quando?', '¿cuándo?', 'Quando vai a Roma?', '¿Cuándo vas a Roma?', [
      'questions',
    ]),
    w(
      'it-perche',
      'perché',
      '¿por qué? / porque',
      'Perché studi italiano?',
      '¿Por qué estudiás italiano?',
      ['questions'],
      { acceptedTranslations: ['¿por qué?', 'porque'] },
    ),
    w('it-come', 'come?', '¿cómo?', 'Come vai a scuola?', '¿Cómo vas a la escuela?', ['questions']),
    w('it-quale', 'quale?', '¿cuál?', 'Quale preferisci?', '¿Cuál preferís?', ['questions']),
    w(
      'it-quanto-costa',
      'quanto costa?',
      '¿cuánto cuesta?',
      'Quanto costa il biglietto?',
      '¿Cuánto cuesta el boleto?',
      ['shopping', 'questions'],
    ),
    w(
      'it-quanto-costano',
      'quanto costano?',
      '¿cuánto cuestan?',
      'Quanto costano le scarpe?',
      '¿Cuánto cuestan los zapatos?',
      ['shopping', 'questions'],
    ),
    w('it-euro', 'euro', 'euro', 'Costa dieci euro.', 'Cuesta diez euros.', ['shopping'], {
      acceptedTranslations: ['euros'],
      emoji: '💶',
    }),
    w(
      'it-biglietto',
      'biglietto',
      'boleto',
      'Un biglietto per Roma, per favore.',
      'Un boleto para Roma, por favor.',
      ['shopping'],
      { acceptedTranslations: ['billete', 'pasaje', 'entrada'], emoji: '🎫' },
    ),
    w(
      'it-maglietta',
      'maglietta',
      'remera',
      'La maglietta è rossa.',
      'La remera es roja.',
      ['shopping', 'clothes'],
      {
        acceptedTranslations: ['camiseta', 'playera'],
        emoji: '👕',
      },
    ),
    w(
      'it-scarpe',
      'scarpe',
      'zapatos',
      'Le scarpe sono nere.',
      'Los zapatos son negros.',
      ['shopping', 'clothes'],
      {
        acceptedTranslations: ['zapatillas'],
        emoji: '👟',
      },
    ),
    w('it-troppo', 'troppo', 'demasiado', 'È troppo caro!', '¡Es demasiado caro!', ['shopping']),
    w('it-caro', 'caro', 'caro', 'Il ristorante è caro.', 'El restaurante es caro.', ['shopping']),
    w(
      'it-economico',
      'economico',
      'barato',
      'Il panino è economico.',
      'El sándwich es barato.',
      ['shopping'],
      { acceptedTranslations: ['económico'] },
    ),
    w(
      'it-va-bene',
      'va bene',
      'está bien',
      'Dieci euro? Va bene.',
      '¿Diez euros? Está bien.',
      ['courtesy'],
      { acceptedTranslations: ['de acuerdo', 'dale'] },
    ),
  ],
  lessons: [
    {
      title: 'Chi? Cosa?',
      objective: 'Preguntar quién y qué.',
      intro: {
        explanation:
          'Chi? es «¿quién?» (se lee «qui»: ch suena como k) y cosa? es «¿qué?» (también che cosa?). Cosa fai? es «¿qué hacés?».',
        examples: [
          { target: 'Chi è lei? — È mia sorella.', base: '¿Quién es ella? — Es mi hermana.' },
          { target: 'Cosa fai oggi?', base: '¿Qué hacés hoy?' },
        ],
      },
      takeaways: ['Preguntás quién con chi?', 'Preguntás qué con cosa?'],
      exercises: [
        ex.translationChoice('chi?', '¿quién?', ['¿qué?', '¿cuándo?', '¿cuál?'], ['it-chi'], {
          explanation: 'Ch en italiano suena como k: chi se lee «qui».',
        }),
        ex.translationChoice('cosa?', '¿qué?', ['¿quién?', '¿cómo?', '¿dónde?'], ['it-cosa']),
        ex.listenChoice(
          'Chi è lui?',
          ['Chi è lei?', 'Come stai?', 'Cosa fai?'],
          ['it-chi', 'it-lui'],
        ),
        ex.fillBlank(
          '___ è? — È mio padre.',
          '¿Quién es? — Es mi papá.',
          'Chi',
          ['Cosa', 'Quando', 'Dove'],
          ['it-chi', 'it-mio', 'it-padre'],
        ),
        ex.fillBlank(
          '___ mangi? — Un panino.',
          '¿Qué comés? — Un sándwich.',
          'Cosa',
          ['Chi', 'Quale', 'Quando'],
          ['it-cosa', 'it-panino'],
        ),
        ex.orderWords('Cosa fai oggi?', '¿Qué hacés hoy?', ['it-cosa-fai', 'it-oggi']),
        ex.shortAnswer(
          'Cosa fai oggi?',
          '¿Qué hacés hoy? (Respondé que trabajás.)',
          'Lavoro.',
          ['Oggi lavoro.', 'Io lavoro.', 'Lavoro oggi.'],
          ['it-lavoro', 'it-oggi'],
        ),
        ex.translateWrite('¿Quién es ella?', 'Chi è lei?', ['it-chi', 'it-lei']),
      ],
    },
    {
      title: 'Quando? Perché?',
      objective: 'Preguntar cuándo y por qué, y explicar.',
      intro: {
        explanation:
          'Quando? es «¿cuándo?». Perché sirve para preguntar («¿por qué?») y para responder («porque»), igual pero sin signos: Perché studi? — Perché voglio viaggiare.',
        examples: [
          { target: 'Quando vai a Roma?', base: '¿Cuándo vas a Roma?' },
          {
            target: 'Perché studi italiano? — Perché mi piace.',
            base: '¿Por qué estudiás italiano? — Porque me gusta.',
          },
        ],
      },
      takeaways: ['Preguntás cuándo con quando?', 'Preguntás y respondés con perché.'],
      exercises: [
        ex.translationChoice(
          'quando?',
          '¿cuándo?',
          ['¿cuánto?', '¿quién?', '¿a qué hora?'],
          ['it-quando'],
        ),
        ex.translationChoice(
          'perché',
          '¿por qué? / porque',
          ['¿para qué?', '¿cómo?', 'para mí'],
          ['it-perche'],
        ),
        ex.listenChoice(
          'Quando vai a Roma?',
          ['Quando vado a Roma?', 'Perché vai a Roma?', 'Come vai a Roma?'],
          ['it-quando', 'it-vai'],
        ),
        ex.fillBlank(
          '___ vai in banca? — Domani.',
          '¿Cuándo vas al banco? — Mañana.',
          'Quando',
          ['Perché', 'Chi', 'Cosa'],
          ['it-quando', 'it-banca', 'it-domani'],
        ),
        ex.fillBlank(
          'Studio italiano ___ voglio viaggiare.',
          'Estudio italiano porque quiero viajar.',
          'perché',
          ['quando', 'come', 'anche'],
          ['it-studio', 'it-perche', 'it-voglio', 'it-viaggiare'],
          { explanation: 'Para responder «porque» también se usa perché.' },
        ),
        ex.orderWords('Perché non vuoi giocare?', '¿Por qué no querés jugar?', [
          'it-perche',
          'it-non',
          'it-vuoi',
          'it-giocare',
        ]),
        ex.shortAnswer(
          'Quando lavori?',
          '¿Cuándo trabajás? (Respondé que el lunes.)',
          'Lunedì.',
          ['Lavoro lunedì.', 'Il lunedì.', 'Lavoro il lunedì.'],
          ['it-lunedi', 'it-lavoro'],
        ),
        ex.translateWrite('¿Por qué no querés cantar?', 'Perché non vuoi cantare?', [
          'it-perche',
          'it-non',
          'it-vuoi',
          'it-cantare',
        ]),
      ],
    },
    {
      title: 'Come? Quale?',
      objective: 'Preguntar cómo y cuál.',
      intro: {
        explanation:
          'Come? es «¿cómo?» (como en come stai?). Quale? es «¿cuál?»: delante de è pierde la e, qual è? («¿cuál es?»), sin apóstrofo.',
        examples: [
          { target: 'Come vai alla stazione?', base: '¿Cómo vas a la estación?' },
          { target: 'Qual è il tuo numero?', base: '¿Cuál es tu número?' },
        ],
      },
      takeaways: ['Preguntás cómo con come?', 'Preguntás cuál con quale? / qual è?'],
      exercises: [
        ex.translationChoice('come?', '¿cómo?', ['¿cuándo?', '¿dónde?', '¿quién?'], ['it-come']),
        ex.translationChoice(
          'quale?',
          '¿cuál?',
          ['¿cuánto?', '¿qué hora?', '¿cómo?'],
          ['it-quale'],
        ),
        ex.listenChoice(
          'Come vai alla stazione?',
          ['Quando vai alla stazione?', "Dov'è la stazione?", 'Come stai?'],
          ['it-come', 'it-vai', 'it-stazione'],
        ),
        ex.fillBlank(
          'Qual ___ il tuo libro?',
          '¿Cuál es tu libro?',
          'è',
          ['sono', 'ha', 'sei'],
          ['it-quale', 'it-e-essere', 'it-libro'],
          { explanation: 'Quale + è = qual è, sin apóstrofo.' },
        ),
        ex.matchPairs(
          [
            ['chi?', '¿quién?'],
            ['cosa?', '¿qué?'],
            ['quando?', '¿cuándo?'],
            ['come?', '¿cómo?'],
            ['quale?', '¿cuál?'],
          ],
          ['it-chi', 'it-cosa', 'it-quando', 'it-come', 'it-quale'],
        ),
        ex.orderWords('Come vai a casa?', '¿Cómo vas a casa?', ['it-come', 'it-vai', 'it-a-casa']),
        ex.shortAnswer(
          'Va bene domani?',
          '¿Te viene bien mañana? (Respondé que sí, está bien.)',
          'Sì, va bene.',
          ['Va bene.', 'Sì, domani va bene.'],
          ['it-si', 'it-va-bene'],
        ),
        ex.translateWrite('¿Cómo estás?', 'Come stai?', ['it-come-stai']),
      ],
    },
    {
      title: 'Quanto costa?',
      objective: 'Preguntar precios.',
      intro: {
        explanation:
          'Quanto costa? es «¿cuánto cuesta?» y quanto costano? «¿cuánto cuestan?» (varias cosas). Euro no cambia en plural: dieci euro.',
        examples: [
          {
            target: 'Quanto costa la maglietta? — Quindici euro.',
            base: '¿Cuánto cuesta la remera? — Quince euros.',
          },
          { target: 'Quanto costano le scarpe?', base: '¿Cuánto cuestan los zapatos?' },
        ],
      },
      takeaways: [
        'Preguntás el precio con quanto costa?',
        'Usás quanto costano? con varias cosas.',
      ],
      exercises: [
        ex.imageChoice('🎫', 'biglietto', ['maglietta', 'scarpe', 'chiave'], ['it-biglietto']),
        ex.imageChoice('👕', 'maglietta', ['scarpe', 'borsa', 'biglietto'], ['it-maglietta']),
        ex.imageChoice('👟', 'scarpe', ['maglietta', 'zaino', 'letto'], ['it-scarpe']),
        ex.listenChoice(
          'Quanto costa il biglietto?',
          ['Quanto costano i biglietti?', "Dov'è il biglietto?", 'Quanti anni hai?'],
          ['it-quanto-costa', 'it-biglietto'],
        ),
        ex.listenChoice(
          'Costa dieci euro.',
          ['Costa due euro.', 'Costa dodici euro.', 'Costano dieci euro.'],
          ['it-euro', 'it-dieci'],
        ),
        ex.fillBlank(
          'Quanto ___ le scarpe?',
          '¿Cuánto cuestan los zapatos?',
          'costano',
          ['costa', 'sono', 'hai'],
          ['it-quanto-costano', 'it-scarpe'],
          { explanation: 'Le scarpe es plural: quanto costano?' },
        ),
        ex.orderWords('Quanto costa la maglietta?', '¿Cuánto cuesta la remera?', [
          'it-quanto-costa',
          'it-maglietta',
        ]),
        ex.translateWrite('¿Cuánto cuesta el boleto?', 'Quanto costa il biglietto?', [
          'it-quanto-costa',
          'it-biglietto',
        ]),
        ex.translateWrite('¿Cuánto cuestan los zapatos?', 'Quanto costano le scarpe?', [
          'it-quanto-costano',
          'it-scarpe',
        ]),
      ],
    },
    {
      title: 'Troppo caro!',
      objective: 'Opinar sobre un precio y cerrar una compra.',
      intro: {
        explanation:
          'Caro es igual que en español; «barato» se dice economico. Troppo es «demasiado»: è troppo caro! Para aceptar: va bene («está bien»).',
        examples: [
          { target: 'Venti euro? È troppo caro!', base: '¿Veinte euros? ¡Es demasiado caro!' },
          { target: 'Cinque euro? Va bene.', base: '¿Cinco euros? Está bien.' },
        ],
      },
      takeaways: ['Decís si algo es caro o barato.', 'Aceptás un precio con va bene.'],
      exercises: [
        ex.translationChoice('economico', 'barato', ['caro', 'rico', 'cerca'], ['it-economico'], {
          explanation: 'Barato es economico; caro es igual que en español.',
        }),
        ex.translationChoice('troppo', 'demasiado', ['muy', 'también', 'siempre'], ['it-troppo']),
        ex.listenChoice(
          'È troppo caro!',
          ['È molto buono!', 'È economico.', 'Non è caro.'],
          ['it-troppo', 'it-caro'],
        ),
        ex.fillBlank(
          'Il panino costa due euro: è ___.',
          'El sándwich cuesta dos euros: es barato.',
          'economico',
          ['troppo caro', 'lontano', 'sempre'],
          ['it-panino', 'it-due', 'it-euro', 'it-economico'],
          { skill: 'vocabulary' },
        ),
        ex.fillBlank(
          'Cinque euro? ___ bene.',
          '¿Cinco euros? Está bien.',
          'Va',
          ['Vai', 'Vado', 'È'],
          ['it-cinque', 'it-va-bene'],
        ),
        ex.orderWords('La maglietta è troppo cara.', 'La remera es demasiado cara.', [
          'it-maglietta',
          'it-troppo',
          'it-caro',
        ]),
        ex.shortAnswer(
          'Il biglietto costa venti euro.',
          'El boleto cuesta veinte euros. (Respondé que es demasiado caro.)',
          'È troppo caro!',
          ['È troppo caro.', 'Troppo caro!', 'Troppo caro.'],
          ['it-troppo', 'it-caro'],
        ),
        ex.translateWrite('Está bien, gracias.', 'Va bene, grazie.', ['it-va-bene', 'it-grazie']),
      ],
    },
  ],
};
