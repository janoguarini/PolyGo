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
 * Redactada sin revisión de un hablante nativo: necesita revisión lingüística (mi piace /
 * mi piacciono, anch'io / neanch'io, volere y potere + infinitivo).
 */
export const unit11: UnitDef = {
  position: 11,
  title: 'Gustos',
  titleEn: 'Mi piace',
  description:
    'Decir lo que te gusta y lo que no, preguntar gustos y decir lo que querés y podés hacer.',
  emoji: '❤️',
  objective:
    "Podés decir mi piace / mi piacciono / non mi piace, preguntar ti piace?, responder anch'io o neanch'io y usar voglio y posso con un verbo.",
  grammar: {
    title: 'Mi piace / mi piacciono · voglio, posso + infinitivo',
    explanation:
      'Como en español, lo que gusta es el sujeto: mi piace con una cosa o un verbo (mi piace il calcio, mi piace cucinare) y mi piacciono con varias cosas (mi piacciono i gatti). Volere («querer») y potere («poder») van con el verbo en infinitivo: voglio viaggiare, posso pagare?',
    examples: [
      { target: 'Mi piace il calcio.', base: 'Me gusta el fútbol.' },
      { target: 'Mi piacciono i gatti.', base: 'Me gustan los gatos.' },
      { target: 'Voglio viaggiare in Italia.', base: 'Quiero viajar a Italia.' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      "Pendiente de revisión por un hablante nativo o docente de italiano (piace / piacciono, anch'io, posso + infinitivo).",
  },
  words: [
    w('it-mi-piace', 'mi piace', 'me gusta', 'Mi piace il caffè.', 'Me gusta el café.', ['likes']),
    w(
      'it-mi-piacciono',
      'mi piacciono',
      'me gustan',
      'Mi piacciono i gatti.',
      'Me gustan los gatos.',
      ['likes'],
    ),
    w(
      'it-non-mi-piace',
      'non mi piace',
      'no me gusta',
      'Non mi piace il tè.',
      'No me gusta el té.',
      ['likes'],
    ),
    w('it-ti-piace', 'ti piace?', '¿te gusta?', 'Ti piace il gelato?', '¿Te gusta el helado?', [
      'likes',
      'questions',
    ]),
    w(
      'it-anch-io',
      "anch'io",
      'yo también',
      "Mi piace ballare. — Anch'io!",
      'Me gusta bailar. — ¡Yo también!',
      ['likes'],
    ),
    w(
      'it-neanch-io',
      "neanch'io",
      'yo tampoco',
      "Non mi piace il latte. — Neanch'io.",
      'No me gusta la leche. — Yo tampoco.',
      ['likes'],
    ),
    w('it-calcio', 'calcio', 'fútbol', 'Mi piace il calcio.', 'Me gusta el fútbol.', ['hobbies'], {
      emoji: '⚽',
    }),
    w(
      'it-film',
      'film',
      'película',
      'Stasera guardo un film.',
      'Esta noche miro una película.',
      ['hobbies'],
      { emoji: '🎬' },
    ),
    w('it-cane', 'cane', 'perro', 'Il cane è nero.', 'El perro es negro.', ['animals'], {
      emoji: '🐶',
    }),
    w(
      'it-gatto',
      'gatto',
      'gato',
      'Il gatto è sul divano.',
      'El gato está sobre el sillón.',
      ['animals'],
      { emoji: '🐱' },
    ),
    w(
      'it-cucinare',
      'cucinare',
      'cocinar',
      'Mi piace cucinare.',
      'Me gusta cocinar.',
      ['verbs', 'hobbies'],
      {
        emoji: '🍳',
      },
    ),
    w(
      'it-ballare',
      'ballare',
      'bailar',
      'Ti piace ballare?',
      '¿Te gusta bailar?',
      ['verbs', 'hobbies'],
      {
        emoji: '💃',
      },
    ),
    w(
      'it-cantare',
      'cantare',
      'cantar',
      'Non mi piace cantare.',
      'No me gusta cantar.',
      ['verbs', 'hobbies'],
      { emoji: '🎤' },
    ),
    w(
      'it-viaggiare',
      'viaggiare',
      'viajar',
      'Voglio viaggiare in Italia.',
      'Quiero viajar a Italia.',
      ['verbs', 'hobbies'],
      { emoji: '✈️' },
    ),
    w('it-giocare', 'giocare', 'jugar', 'Voglio giocare a calcio.', 'Quiero jugar al fútbol.', [
      'verbs',
      'hobbies',
    ]),
    w('it-voglio', 'voglio', 'quiero', 'Voglio un caffè.', 'Quiero un café.', ['verbs']),
    w('it-vuoi', 'vuoi', 'querés', 'Vuoi un gelato?', '¿Querés un helado?', ['verbs'], {
      acceptedTranslations: ['quieres'],
    }),
    w('it-posso', 'posso', 'puedo', 'Posso pagare?', '¿Puedo pagar?', ['verbs']),
    w('it-puoi', 'puoi', 'podés', 'Puoi venire domani?', '¿Podés venir mañana?', ['verbs'], {
      acceptedTranslations: ['puedes'],
    }),
    w('it-pagare', 'pagare', 'pagar', 'Posso pagare con la carta?', '¿Puedo pagar con tarjeta?', [
      'verbs',
    ]),
  ],
  lessons: [
    {
      title: 'Mi piace',
      objective: 'Decir lo que te gusta y lo que no.',
      intro: {
        explanation:
          'Mi piace es «me gusta»: va con una cosa (mi piace il calcio) o con un verbo (mi piace cucinare). Para negar, non va adelante: non mi piace. Con las cosas se usa el artículo, como en español.',
        examples: [
          { target: 'Mi piace il caffè.', base: 'Me gusta el café.' },
          { target: 'Non mi piace cucinare.', base: 'No me gusta cocinar.' },
        ],
      },
      takeaways: [
        'Decís lo que te gusta con mi piace.',
        'Decís lo que no te gusta con non mi piace.',
      ],
      exercises: [
        ex.translationChoice(
          'mi piace',
          'me gusta',
          ['me llamo', 'quiero', 'tengo'],
          ['it-mi-piace'],
        ),
        ex.imageChoice('⚽', 'calcio', ['film', 'gelato', 'zaino'], ['it-calcio']),
        ex.imageChoice('🎬', 'film', ['calcio', 'libro', 'letto'], ['it-film']),
        ex.imageChoice('🍳', 'cucinare', ['dormo', 'leggo', 'ballare'], ['it-cucinare']),
        ex.listenChoice(
          'Non mi piace il tè.',
          ['Mi piace il tè.', 'Non mi piace il latte.', 'Non prendo il tè.'],
          ['it-non-mi-piace', 'it-te'],
        ),
        ex.fillBlank(
          '___ mi piace il calcio.',
          'No me gusta el fútbol.',
          'Non',
          ['No', 'Ne', 'Senza'],
          ['it-non-mi-piace', 'it-calcio'],
          { explanation: 'En italiano la negación es non, antes de mi piace.' },
        ),
        ex.orderWords('Mi piace cucinare la sera.', 'Me gusta cocinar a la noche.', [
          'it-mi-piace',
          'it-cucinare',
          'it-la-sera',
        ]),
        ex.translateWrite('Me gusta el fútbol.', 'Mi piace il calcio.', [
          'it-mi-piace',
          'it-calcio',
        ]),
        ex.translateWrite('No me gusta cocinar.', 'Non mi piace cucinare.', [
          'it-non-mi-piace',
          'it-cucinare',
        ]),
      ],
    },
    {
      title: 'Mi piacciono',
      objective: 'Hablar de gustos con cosas en plural.',
      intro: {
        explanation:
          'Con varias cosas, piace pasa a piacciono: mi piacciono i gatti («me gustan los gatos»). El plural de cane es cani y el de gatto, gatti; el de film no cambia (i film).',
        examples: [
          { target: 'Mi piacciono i cani.', base: 'Me gustan los perros.' },
          {
            target: 'Non mi piacciono i film tristi.',
            base: 'No me gustan las películas tristes.',
          },
        ],
      },
      takeaways: ['Usás mi piacciono con cosas en plural.', 'Nombrás perros y gatos.'],
      exercises: [
        ex.imageChoice('🐶', 'cane', ['gatto', 'calcio', 'orologio'], ['it-cane']),
        ex.imageChoice('🐱', 'gatto', ['cane', 'film', 'gelato'], ['it-gatto']),
        ex.translationChoice(
          'mi piacciono',
          'me gustan',
          ['me gusta', 'no me gusta', 'quiero'],
          ['it-mi-piacciono'],
        ),
        ex.listenChoice(
          'Mi piacciono i gatti.',
          ['Mi piace il gatto.', 'Mi piacciono i cani.', 'Non mi piacciono i gatti.'],
          ['it-mi-piacciono', 'it-gatto', 'it-i'],
        ),
        ex.fillBlank(
          'Mi ___ i cani.',
          'Me gustan los perros.',
          'piacciono',
          ['piace', 'chiamo', 'sveglio'],
          ['it-mi-piacciono', 'it-cane'],
          { explanation: 'I cani es plural: mi piacciono.' },
        ),
        ex.fillBlank(
          'Mi ___ il gelato.',
          'Me gusta el helado.',
          'piace',
          ['piacciono', 'chiamo', 'alzo'],
          ['it-mi-piace', 'it-gelato'],
          { explanation: 'Il gelato es una sola cosa: mi piace.' },
        ),
        ex.matchPairs(
          [
            ['mi piace', 'me gusta'],
            ['mi piacciono', 'me gustan'],
            ['cane', 'perro'],
            ['gatto', 'gato'],
          ],
          ['it-mi-piace', 'it-mi-piacciono', 'it-cane', 'it-gatto'],
        ),
        ex.translateWrite('Me gustan los gatos.', 'Mi piacciono i gatti.', [
          'it-mi-piacciono',
          'it-gatto',
        ]),
        ex.translateWrite('No me gustan los perros.', 'Non mi piacciono i cani.', [
          'it-non-mi-piace',
          'it-mi-piacciono',
          'it-cane',
        ]),
      ],
    },
    {
      title: "Ti piace? Anch'io!",
      objective: 'Preguntar gustos y responder.',
      intro: {
        explanation:
          "Ti piace…? es «¿te gusta…?». Para estar de acuerdo: anch'io («yo también») si te gusta, neanch'io («yo tampoco») si no te gusta.",
        examples: [
          { target: 'Ti piace ballare?', base: '¿Te gusta bailar?' },
          {
            target: "Non mi piace cantare. — Neanch'io.",
            base: 'No me gusta cantar. — Yo tampoco.',
          },
        ],
      },
      takeaways: ['Preguntás gustos con ti piace?', "Respondés anch'io o neanch'io."],
      exercises: [
        ex.translationChoice(
          'ti piace?',
          '¿te gusta?',
          ['¿cómo estás?', '¿querés?', '¿qué es?'],
          ['it-ti-piace'],
        ),
        ex.imageChoice('💃', 'ballare', ['cantare', 'cucinare', 'dormo'], ['it-ballare']),
        ex.imageChoice('🎤', 'cantare', ['ballare', 'scrivo', 'leggo'], ['it-cantare']),
        ex.translationChoice(
          "neanch'io",
          'yo tampoco',
          ['yo también', 'no me gusta', 'para mí'],
          ['it-neanch-io'],
        ),
        ex.listenChoice(
          'Ti piace ballare?',
          ['Ti piace cantare?', 'Mi piace ballare.', 'Ti piace il calcio?'],
          ['it-ti-piace', 'it-ballare'],
        ),
        ex.fillBlank(
          'Mi piace cantare. — ___!',
          'Me gusta cantar. — ¡Yo también!',
          "Anch'io",
          ["Neanch'io", 'Anche tu', 'Per me'],
          ['it-mi-piace', 'it-cantare', 'it-anch-io'],
          { explanation: "Si a vos también te gusta: anch'io." },
        ),
        ex.orderWords('Ti piace cucinare?', '¿Te gusta cocinar?', ['it-ti-piace', 'it-cucinare']),
        ex.shortAnswer(
          'Mi piace ballare. E a te?',
          'Me gusta bailar. ¿Y a vos? (Respondé que a vos también.)',
          "Anch'io.",
          ['Anche a me.', "Anch'io!", 'Anche a me piace ballare.', 'Mi piace ballare.'],
          ['it-anch-io'],
        ),
        ex.translateWrite('¿Te gusta cantar?', 'Ti piace cantare?', ['it-ti-piace', 'it-cantare']),
      ],
    },
    {
      title: 'Voglio…',
      objective: 'Decir lo que querés hacer.',
      intro: {
        explanation:
          'Voglio es «quiero» y vuoi «querés». Van con una cosa (voglio un caffè) o con un verbo en infinitivo (voglio viaggiare). Vorrei («quisiera») es más amable para pedir en un bar.',
        examples: [
          { target: 'Voglio viaggiare in Italia.', base: 'Quiero viajar a Italia.' },
          { target: 'Vuoi giocare a calcio?', base: '¿Querés jugar al fútbol?' },
        ],
      },
      takeaways: ['Decís lo que querés hacer con voglio + verbo.', 'Preguntás vuoi…?'],
      exercises: [
        ex.translationChoice('voglio', 'quiero', ['quisiera', 'puedo', 'tengo'], ['it-voglio']),
        ex.translationChoice('vuoi', 'querés', ['quiero', 'podés', 'vas'], ['it-vuoi']),
        ex.imageChoice('✈️', 'viaggiare', ['giocare', 'ballare', 'cucinare'], ['it-viaggiare']),
        ex.listenChoice(
          'Vuoi giocare a calcio?',
          ['Voglio giocare a calcio.', 'Vuoi un caffè?', 'Ti piace il calcio?'],
          ['it-vuoi', 'it-giocare', 'it-calcio'],
        ),
        ex.fillBlank(
          'Domani ___ viaggiare.',
          'Mañana quiero viajar.',
          'voglio',
          ['vuoi', 'vado', 'mi piacciono'],
          ['it-domani', 'it-voglio', 'it-viaggiare'],
        ),
        ex.orderWords('Voglio giocare a calcio oggi.', 'Quiero jugar al fútbol hoy.', [
          'it-voglio',
          'it-giocare',
          'it-calcio',
          'it-oggi',
        ]),
        ex.shortAnswer(
          'Vuoi un caffè?',
          '¿Querés un café? (Respondé que sí, un capuchino.)',
          'Sì, un cappuccino.',
          [
            'Sì, voglio un cappuccino.',
            'Sì, vorrei un cappuccino.',
            'Un cappuccino, grazie.',
            'Sì, un cappuccino, grazie.',
          ],
          ['it-si', 'it-cappuccino'],
        ),
        ex.translateWrite('Quiero viajar.', 'Voglio viaggiare.', ['it-voglio', 'it-viaggiare'], {
          acceptedAnswers: ['Io voglio viaggiare.'],
        }),
      ],
    },
    {
      title: 'Posso…?',
      objective: 'Pedir permiso y preguntar si alguien puede.',
      intro: {
        explanation:
          'Posso es «puedo» y puoi «podés». También van con el verbo en infinitivo: posso pagare? («¿puedo pagar?»), puoi venire domani? («¿podés venir mañana?»).',
        examples: [
          { target: 'Posso pagare?', base: '¿Puedo pagar?' },
          { target: 'Oggi non posso.', base: 'Hoy no puedo.' },
        ],
      },
      takeaways: ['Pedís permiso con posso…?', 'Decís que no podés con non posso.'],
      exercises: [
        ex.translationChoice('posso', 'puedo', ['quiero', 'podés', 'pago'], ['it-posso']),
        ex.translationChoice('puoi', 'podés', ['puedo', 'querés', 'tenés'], ['it-puoi']),
        ex.translationChoice('pagare', 'pagar', ['jugar', 'cantar', 'viajar'], ['it-pagare']),
        ex.listenChoice(
          'Posso pagare?',
          ['Puoi pagare?', 'Il conto, per favore.', 'Posso giocare?'],
          ['it-posso', 'it-pagare'],
        ),
        ex.fillBlank(
          'Oggi non ___, domani sì.',
          'Hoy no puedo, mañana sí.',
          'posso',
          ['puoi', 'voglio', 'piace'],
          ['it-oggi', 'it-posso', 'it-domani'],
        ),
        ex.matchPairs(
          [
            ['voglio', 'quiero'],
            ['vuoi', 'querés'],
            ['posso', 'puedo'],
            ['puoi', 'podés'],
          ],
          ['it-voglio', 'it-vuoi', 'it-posso', 'it-puoi'],
        ),
        ex.orderWords('Puoi giocare domani?', '¿Podés jugar mañana?', [
          'it-puoi',
          'it-giocare',
          'it-domani',
        ]),
        ex.translateWrite('¿Puedo pagar?', 'Posso pagare?', ['it-posso', 'it-pagare']),
        ex.translateWrite('Hoy no puedo.', 'Oggi non posso.', ['it-oggi', 'it-non', 'it-posso'], {
          acceptedAnswers: ['Non posso oggi.'],
        }),
      ],
    },
  ],
};
