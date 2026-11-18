import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, IT_A1_RATE, question, reading, w } from '../helpers';

/**
 * Italiano A1 U14 «¿Cómo sos? ¿Cómo estás?» (docs/IT_A1_A2.md): los estados con essere (sono stanco,
 * no «sto stanco»), stare para la salud (sto bene / male), avere para hambre, sed, frío y calor,
 * la descripción física y de carácter y la concordancia de los adjetivos.
 * Falsos amigos: caldo es «calor / caliente» (no el caldo) y carino es «lindo» (no «cariño»).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const ELENA = reading(
  'it.stim.a1-u14-elena',
  'message',
  'Marta le describe a una amiga suya a Luca, que la va a buscar a la estación.',
  [
    'Ciao Luca! La mia amica Elena è di Firenze.',
    'È alta e ha i capelli lunghi e neri.',
    'Ha gli occhi verdi.',
    'È molto simpatica, ma un po’ timida.',
  ],
  { from: 'Marta', to: 'Luca' },
);

const TELEFONO = dialogue(
  'it.stim.a1-u14-telefono',
  'Paolo habla por teléfono con su mamá.',
  [
    ['Mamma', 'Ciao Paolo! Come stai?'],
    ['Paolo', 'Non sto bene, mamma. Sono malato.'],
    ['Mamma', 'Oh no! Hai freddo?'],
    ['Paolo', 'Sì, ho freddo e sono molto stanco.'],
    ['Mamma', 'Allora a letto! E bevi un tè caldo.'],
  ],
  IT_A1_RATE,
);

const BAR = dialogue(
  'it.stim.a1-u14-bar',
  'Sara y Luca salen del gimnasio y entran a un bar.',
  [
    ['Sara', 'Ho fame! Prendiamo un panino?'],
    ['Luca', 'Sì, e io ho sete. Vorrei un’acqua.'],
    ['Sara', 'Anch’io! Ho caldo e sono un po’ stanca.'],
    ['Luca', 'Allora due acque e due panini, per favore!'],
  ],
  IT_A1_RATE,
);

export const IT_A1_U14: ItUnitDef = {
  names: ['Marta', 'Luca', 'Elena', 'Firenze', 'Paolo', 'Sara', 'Mamma'],
  support: ['verdi', 'timida', 'bevi', 'prendiamo', 'acque', 'oh'],
  unit: {
    position: 14,
    title: '¿Cómo sos? ¿Cómo estás?',
    titleEn: 'Come sei?',
    description:
      'Describir a una persona, decir cómo estás (sono stanco, sto male) y hablar de hambre, sed, frío y calor.',
    emoji: '🙂',
    objective:
      'Podés describir cómo es una persona, decir cómo estás y si tenés hambre, sed, frío o calor, sin confundir essere, stare y avere.',
    grammar: {
      title: 'Essere, stare y avere · concordancia de los adjetivos',
      explanation:
        'En italiano los estados van con essere: sono stanco (estoy cansado), è malata (está enferma). Stare se usa sobre todo para la salud y el saludo: sto bene, sto male. Hambre, sed, frío y calor van con avere, como en español: ho fame, ho caldo. Los rasgos físicos van con avere y artículo: ha i capelli neri. El adjetivo concuerda: alto, alta, alti, alte; giovane, giovani.',
      examples: [
        { target: 'Sono molto stanco.', base: 'Estoy muy cansado.' },
        { target: 'Ho freddo e sto male.', base: 'Tengo frío y me siento mal.' },
        {
          target: 'Elena è alta e ha i capelli neri.',
          base: 'Elena es alta y tiene el pelo negro.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U14). Sin revisión nativa: revisar essere / stare con los estados, anziano y el registro de carino.',
    },
    words: [
      w('it-stanco', 'stanco', 'cansado', 'Oggi sono stanco.', 'Hoy estoy cansado.', ['feelings'], {
        acceptedTexts: ['stanca'],
        acceptedTranslations: ['cansada'],
      }),
      w('it-felice', 'felice', 'feliz', 'Sono felice!', '¡Estoy feliz!', ['feelings'], {
        acceptedTranslations: ['contento', 'contenta'],
      }),
      w(
        'it-malato',
        'malato',
        'enfermo',
        'Paolo è malato.',
        'Paolo está enfermo.',
        ['feelings', 'health'],
        {
          acceptedTexts: ['malata'],
          acceptedTranslations: ['enferma'],
        },
      ),
      w(
        'it-sto-male',
        'sto male',
        'estoy mal',
        'Oggi sto male.',
        'Hoy me siento mal.',
        ['feelings', 'health'],
        {
          acceptedTranslations: ['me siento mal'],
        },
      ),
      w(
        'it-ho-fame',
        'ho fame',
        'tengo hambre',
        'Ho fame: è mezzogiorno!',
        'Tengo hambre: ¡es mediodía!',
        ['feelings', 'food'],
        {
          emoji: '😋',
        },
      ),
      w(
        'it-ho-sete',
        'ho sete',
        'tengo sed',
        'Ho sete, vorrei un’acqua.',
        'Tengo sed, quisiera un agua.',
        ['feelings', 'food'],
        {
          emoji: '🥤',
        },
      ),
      w(
        'it-ho-freddo',
        'ho freddo',
        'tengo frío',
        'Ho freddo la mattina.',
        'Tengo frío a la mañana.',
        ['feelings'],
        {
          emoji: '🥶',
        },
      ),
      w(
        'it-ho-caldo',
        'ho caldo',
        'tengo calor',
        'Ho caldo, vorrei un gelato.',
        'Tengo calor, quisiera un helado.',
        ['feelings'],
        {
          emoji: '🥵',
        },
      ),
      w(
        'it-com-e',
        "com'è?",
        '¿cómo es?',
        "Com'è tua sorella?",
        '¿Cómo es tu hermana?',
        ['questions', 'descriptions'],
        {
          acceptedTexts: ['com’è?'],
        },
      ),
      w(
        'it-basso',
        'basso',
        'bajo',
        'Mio fratello è basso.',
        'Mi hermano es bajo.',
        ['descriptions'],
        {
          acceptedTexts: ['bassa'],
          acceptedTranslations: ['baja'],
        },
      ),
      w('it-giovane', 'giovane', 'joven', 'Il professore è giovane.', 'El profesor es joven.', [
        'descriptions',
      ]),
      w(
        'it-anziano',
        'anziano',
        'mayor (de edad)',
        'Mio nonno è anziano.',
        'Mi abuelo es mayor.',
        ['descriptions'],
        {
          acceptedTexts: ['anziana'],
          acceptedTranslations: ['mayor', 'anciano', 'anciana', 'viejo', 'vieja'],
          emoji: '👴',
        },
      ),
      w(
        'it-capelli',
        'capelli',
        'pelo (de la cabeza)',
        'Ha i capelli neri.',
        'Tiene el pelo negro.',
        ['descriptions', 'body'],
        {
          acceptedTranslations: ['pelo', 'cabello'],
          emoji: '💇',
        },
      ),
      w(
        'it-occhi',
        'occhi',
        'ojos',
        'Ha gli occhi blu.',
        'Tiene los ojos azules.',
        ['descriptions', 'body'],
        {
          emoji: '👀',
        },
      ),
      w(
        'it-simpatico',
        'simpatico',
        'simpático',
        'Il mio amico è simpatico.',
        'Mi amigo es simpático.',
        ['descriptions'],
        {
          acceptedTexts: ['simpatica'],
          acceptedTranslations: ['simpática', 'buena onda'],
        },
      ),
      w(
        'it-carino',
        'carino',
        'lindo',
        'Il gatto è carino.',
        'El gato es lindo.',
        ['descriptions'],
        {
          acceptedTexts: ['carina'],
          acceptedTranslations: ['linda', 'bonito', 'bonita'],
        },
      ),
      w(
        'it-un-po',
        "un po'",
        'un poco',
        "Sono un po' stanca.",
        'Estoy un poco cansada.',
        ['quantity'],
        {
          acceptedTexts: ['un po’'],
          acceptedTranslations: ['un poquito'],
        },
      ),
      w('it-ma', 'ma', 'pero', 'È alto ma non è giovane.', 'Es alto pero no es joven.', [
        'connectors',
      ]),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Sono stanco',
        objective: 'Decir cómo estás con essere y con stare.',
        intro: {
          explanation:
            'En italiano los estados van con essere: sono stanco es «estoy cansado» y sono felice, «estoy feliz». Stare se usa sobre todo para la salud y el saludo: sto bene, sto male. Por eso: come stai? — Sto male, sono malato.',
          examples: [
            { target: 'Oggi sono stanca.', base: 'Hoy estoy cansada.' },
            { target: 'Sto male, sono malato.', base: 'Me siento mal, estoy enfermo.' },
          ],
        },
        takeaways: [
          'Decís cómo estás con sono: stanco, felice, malato.',
          'Decís cómo te sentís con sto bene / sto male.',
        ],
        exercises: [
          ex.translationChoice('stanco', 'cansado', ['feliz', 'enfermo', 'triste'], ['it-stanco'], {
            id: 'it.ex.rfi60upygj8cug',
          }),
          ex.fillBlank(
            'Oggi ___ stanca.',
            'Hoy estoy cansada.',
            'sono',
            ['ho', 'sei', 'siamo'],
            ['it-stanco'],
            {
              id: 'it.ex.bufng9n8rb2wsm',
              explanation: 'Cansado, feliz o enfermo van con essere: sono stanca.',
            },
          ),
          ex.listenChoice(
            'Sono molto felice.',
            ['Sono molto stanco.', 'Sei molto felice?', 'Siamo molto felici.'],
            ['it-felice', 'it-molto'],
            { id: 'it.ex.5x35m8fri22h1e' },
          ),
          ex.fillBlank(
            'Non ___ bene, sono malato.',
            'No me siento bien, estoy enfermo.',
            'sto',
            ['sono', 'ho', 'stai'],
            ['it-malato', 'it-bene'],
            {
              id: 'it.ex.hp4radvdt61i5e',
              explanation: 'Para la salud se usa stare: sto bene, non sto bene.',
            },
          ),
          ex.matchPairs(
            [
              ['stanco', 'cansado'],
              ['felice', 'feliz'],
              ['malato', 'enfermo'],
              ['sto male', 'estoy mal'],
            ],
            ['it-stanco', 'it-felice', 'it-malato', 'it-sto-male'],
            { id: 'it.ex.7wbswmkh9eq6yd' },
          ),
          ex.translationChoice(
            'sto male',
            'estoy mal',
            ['estoy bien', 'estoy cansado', 'soy malo'],
            ['it-sto-male'],
            {
              id: 'it.ex.mucaqmqsyec6t0',
            },
          ),
          ex.orderWords(
            'Mia madre è molto stanca.',
            'Mi mamá está muy cansada.',
            ['it-stanco', 'it-madre'],
            {
              id: 'it.ex.k8apsn54rlf1cr',
            },
          ),
          ex.shortAnswer(
            'Come stai oggi?',
            '¿Cómo estás hoy? (Respondé que no te sentís bien, que estás enfermo o enferma.)',
            'Non sto bene, sono malato.',
            [
              'Non sto bene, sono malata.',
              'Sto male, sono malato.',
              'Sto male, sono malata.',
              'Sono malato.',
              'Sono malata.',
              'Sto male.',
            ],
            ['it-sto-male', 'it-malato'],
            { id: 'it.ex.yvoel0778hlxa5' },
          ),
          ex.translateWrite('Estoy muy cansado.', 'Sono molto stanco.', ['it-stanco', 'it-molto'], {
            id: 'it.ex.rhu9tmr0p4ptcj',
            acceptedAnswers: [
              'Sono molto stanca.',
              'Io sono molto stanco.',
              'Io sono molto stanca.',
            ],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Ho fame, ho sete',
        objective: 'Decir si tenés hambre, sed, frío o calor.',
        intro: {
          explanation:
            'Hambre, sed, frío y calor van con avere, como en español: ho fame, ho sete, ho freddo, ho caldo. Ojo: caldo no es el caldo de la sopa, es «calor» o «caliente»: ho caldo es «tengo calor».',
          examples: [
            { target: 'Ho fame e ho sete.', base: 'Tengo hambre y tengo sed.' },
            { target: 'Ho caldo, vorrei un gelato.', base: 'Tengo calor, quisiera un helado.' },
          ],
        },
        takeaways: ['Decís ho fame, ho sete, ho freddo y ho caldo.', 'Sabés que caldo es «calor».'],
        exercises: [
          ex.translationChoice(
            'ho caldo',
            'tengo calor',
            ['tengo un caldo', 'tengo frío', 'tengo sed'],
            ['it-ho-caldo'],
            {
              id: 'it.ex.burub9z656bqyo',
              explanation: 'Falso amigo: caldo es «calor» o «caliente». Ho caldo = tengo calor.',
            },
          ),
          ex.imageChoice('🥶', 'ho freddo', ['ho caldo', 'ho fame', 'ho sete'], ['it-ho-freddo'], {
            id: 'it.ex.pkir7qp1istvwr',
          }),
          ex.listenChoice(
            'Ho fame e ho sete.',
            ['Ho fame e sono stanco.', 'Hai fame e hai sete?', 'Ho freddo e ho sete.'],
            ['it-ho-fame', 'it-ho-sete'],
            { id: 'it.ex.tms5k2xw609iw0' },
          ),
          ex.fillBlank(
            'Hai ___? Ecco un panino.',
            '¿Tenés hambre? Acá tenés un sándwich.',
            'fame',
            ['sete', 'freddo', 'caldo'],
            ['it-ho-fame', 'it-panino'],
            { id: 'it.ex.qe00jcjts9k9pd', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Ho ___: vorrei un’acqua.',
            'Tengo sed: quisiera un agua.',
            'sete',
            ['fame', 'freddo', 'male'],
            ['it-ho-sete', 'it-acqua'],
            { id: 'it.ex.ozbx8n36t8jhn1', skill: 'vocabulary' },
          ),
          question(
            'it.ex.q5bfhub4tx5gwa',
            BAR,
            '¿Qué le pasa a Luca?',
            'Tiene sed y quiere un agua',
            ['Tiene frío y quiere un té', 'Está enfermo', 'Tiene hambre y quiere un helado'],
            ['it-ho-sete'],
            'Luca dice: «io ho sete. Vorrei un’acqua».',
          ),
          question(
            'it.ex.lmjotrrh51rg6e',
            BAR,
            '¿Cómo está Sara?',
            'Tiene hambre y calor, y está un poco cansada',
            ['Tiene frío y está enferma', 'Está muy feliz y no tiene hambre', 'Tiene sed y frío'],
            ['it-ho-fame', 'it-ho-caldo', 'it-un-po'],
            'Sara dice: «Ho fame!» y después: «Ho caldo e sono un po’ stanca».',
          ),
          ex.shortAnswer(
            'Hai fame?',
            '¿Tenés hambre? (Respondé que no, que tenés sed.)',
            'No, ho sete.',
            ['No, non ho fame, ho sete.', 'Ho sete.', 'No, io ho sete.'],
            ['it-ho-sete'],
            { id: 'it.ex.fyiak0bk50xqog' },
          ),
          ex.translateWrite('Tengo frío.', 'Ho freddo.', ['it-ho-freddo'], {
            id: 'it.ex.alpzkynjin0zi9',
            acceptedAnswers: ['Io ho freddo.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: "Com'è?",
        objective: 'Describir cómo es una persona.',
        intro: {
          explanation:
            "Com'è? es «¿cómo es?». Se responde con è: è alto, è bassa, è giovane. El pelo y los ojos van con avere y artículo: ha i capelli neri, ha gli occhi blu. El adjetivo concuerda: capelli lunghi, sorella bassa.",
          examples: [
            { target: "Com'è tuo fratello? — È alto.", base: '¿Cómo es tu hermano? — Es alto.' },
            { target: 'Ha i capelli lunghi.', base: 'Tiene el pelo largo.' },
          ],
        },
        takeaways: [
          "Preguntás com'è? y describís con è y ha.",
          'Hacés concordar el adjetivo: basso, bassa, bassi.',
        ],
        exercises: [
          ex.translationChoice(
            "com'è?",
            '¿cómo es?',
            ['¿cómo estás?', '¿dónde está?', '¿qué es?'],
            ['it-com-e'],
            {
              id: 'it.ex.7de0af4xl49twe',
            },
          ),
          ex.imageChoice('👴', 'anziano', ['giovane', 'basso', 'alto'], ['it-anziano'], {
            id: 'it.ex.s2nnvb0nb09nhs',
          }),
          ex.matchPairs(
            [
              ['basso', 'bajo'],
              ['giovane', 'joven'],
              ['anziano', 'mayor (de edad)'],
              ['capelli', 'pelo (de la cabeza)'],
            ],
            ['it-basso', 'it-giovane', 'it-anziano', 'it-capelli'],
            { id: 'it.ex.o01zceax2ctcrk' },
          ),
          ex.listenChoice(
            'Ha i capelli lunghi.',
            ['Ha i capelli neri.', 'Ha gli occhi blu.', 'Hai i capelli lunghi?'],
            ['it-capelli'],
            { id: 'it.ex.7eyuj1x80rb876' },
          ),
          ex.fillBlank(
            'Mia sorella è ___.',
            'Mi hermana es baja.',
            'bassa',
            ['basso', 'bassi', 'basse'],
            ['it-basso', 'it-sorella'],
            {
              id: 'it.ex.8aa8i5cmhlty08',
              explanation: 'Sorella es femenino singular: bassa.',
            },
          ),
          ex.fillBlank(
            'Ha gli ___ blu.',
            'Tiene los ojos azules.',
            'occhi',
            ['capelli', 'anni', 'libri'],
            ['it-occhi', 'it-blu'],
            {
              id: 'it.ex.3w42phpbnj0hrc',
              skill: 'vocabulary',
              explanation: 'Occhi empieza con vocal: gli occhi.',
            },
          ),
          question(
            'it.ex.sqkllzw43yozjn',
            ELENA,
            '¿Cómo es Elena?',
            'Alta, con el pelo largo y negro',
            ['Baja, con el pelo corto', 'Alta y rubia', 'Baja, con el pelo largo y negro'],
            ['it-capelli', 'it-simpatico'],
            'Marta escribe: «È alta e ha i capelli lunghi e neri».',
          ),
          ex.orderWords('Lui è giovane e alto.', 'Él es joven y alto.', ['it-giovane'], {
            id: 'it.ex.llx2qvhr5ks7xg',
          }),
          ex.shortAnswer(
            "Com'è tuo fratello?",
            '¿Cómo es tu hermano? (Respondé que es alto y que tiene el pelo negro.)',
            'È alto e ha i capelli neri.',
            ['Mio fratello è alto e ha i capelli neri.', 'Lui è alto e ha i capelli neri.'],
            ['it-com-e', 'it-capelli'],
            { id: 'it.ex.tf567aefc3iy3t' },
          ),
          ex.translateWrite(
            'Mi abuelo es mayor.',
            'Mio nonno è anziano.',
            ['it-anziano', 'it-nonno'],
            {
              id: 'it.ex.ta2tbrljlariyc',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: "Simpatico, ma un po' timido",
        objective: 'Describir el carácter y matizar con un po’ y ma.',
        intro: {
          explanation:
            "Para el carácter: simpatico (buena onda) y carino (lindo, amable). Ojo: carino no es «cariño». Un po' es «un poco» y ma es «pero»: è carina ma un po' timida.",
          examples: [
            { target: 'Il mio amico è simpatico.', base: 'Mi amigo es simpático.' },
            { target: "È carina ma un po' timida.", base: 'Es linda pero un poco tímida.' },
          ],
        },
        takeaways: ['Describís el carácter con simpatico y carino.', "Matizás con un po' y ma."],
        exercises: [
          ex.translationChoice('carino', 'lindo', ['cariño', 'caro', 'cansado'], ['it-carino'], {
            id: 'it.ex.ptt2cpiiknr5w9',
            explanation: 'Falso amigo: carino es «lindo» o «amable»; no es «cariño».',
          }),
          ex.translationChoice(
            "un po'",
            'un poco',
            ['mucho', 'demasiado', 'también'],
            ['it-un-po'],
            { id: 'it.ex.s3b6sbvfekuzti' },
          ),
          ex.fillBlank(
            'È alto, ___ non è giovane.',
            'Es alto, pero no es joven.',
            'ma',
            ['e', 'o', 'anche'],
            ['it-ma', 'it-giovane'],
            {
              id: 'it.ex.g36fyd0uijv0im',
            },
          ),
          ex.listenChoice(
            "Sono un po' stanco.",
            ['Sono molto stanco.', "Sei un po' stanco?", "Sono un po' malato."],
            ['it-un-po', 'it-stanco'],
            { id: 'it.ex.1l4v90ilsh10s0' },
          ),
          question(
            'it.ex.hocb9613l7m4nx',
            ELENA,
            '¿Qué carácter tiene Elena?',
            'Es muy simpática, pero un poco tímida',
            [
              'Es tímida y nada simpática',
              'Es muy simpática y nada tímida',
              'Es un poco antipática',
            ],
            ['it-simpatico', 'it-ma', 'it-un-po'],
            'Marta escribe: «È molto simpatica, ma un po’ timida».',
          ),
          question(
            'it.ex.czauij2s1rg3ya',
            ELENA,
            '¿De qué color tiene los ojos Elena?',
            'Verdes',
            ['Azules', 'Negros', 'Marrones'],
            ['it-occhi'],
            'Marta escribe: «Ha gli occhi verdi».',
          ),
          ex.orderWords(
            'Il gatto è piccolo ma molto carino.',
            'El gato es chico pero muy lindo.',
            ['it-carino', 'it-ma', 'it-gatto'],
            {
              id: 'it.ex.1ulzst4h5ubv1a',
            },
          ),
          ex.shortAnswer(
            "Com'è la tua amica?",
            '¿Cómo es tu amiga? (Respondé que es simpática pero un poco tímida.)',
            "È simpatica ma un po' timida.",
            [
              'È simpatica, ma un po’ timida.',
              'È simpatica ma un po’ timida.',
              "È simpatica, ma un po' timida.",
              "La mia amica è simpatica ma un po' timida.",
            ],
            ['it-simpatico', 'it-ma', 'it-un-po'],
            { id: 'it.ex.l968lvdx7y659h' },
          ),
          ex.translateWrite(
            'Es lindo pero un poco caro.',
            "È carino ma un po' caro.",
            ['it-carino', 'it-un-po', 'it-ma'],
            {
              id: 'it.ex.ovndzufzlcwne1',
              acceptedAnswers: [
                'È carino ma un po’ caro.',
                "È carino, ma un po' caro.",
                'È carino, ma un po’ caro.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Essere, stare, avere',
        objective: 'Elegir el verbo justo para decir cómo estás y cómo sos.',
        intro: {
          explanation:
            'Tres verbos donde el español dice «estar» o «tener»: essere para cómo sos y cómo estás (è alta, sono stanco), stare para la salud (sto male) y avere para hambre, sed, frío y calor (ho freddo).',
          examples: [
            { target: 'Paolo è malato e ha freddo.', base: 'Paolo está enfermo y tiene frío.' },
            {
              target: "Sto bene, ma sono un po' stanca.",
              base: 'Estoy bien, pero un poco cansada.',
            },
          ],
        },
        takeaways: [
          'Elegís entre essere, stare y avere.',
          'Entendés una llamada sobre cómo está alguien.',
        ],
        exercises: [
          ex.fillBlank(
            'Paolo ___ malato.',
            'Paolo está enfermo.',
            'è',
            ['sta', 'ha', 'sono'],
            ['it-malato'],
            {
              id: 'it.ex.2r61fa2ypvef26',
              explanation: 'Enfermo es un estado: va con essere (è malato).',
            },
          ),
          ex.fillBlank(
            'Io ___ freddo.',
            'Tengo frío.',
            'ho',
            ['sono', 'sto', 'è'],
            ['it-ho-freddo'],
            {
              id: 'it.ex.f757sdos5x06x8',
              explanation: 'Frío, calor, hambre y sed van con avere.',
            },
          ),
          ex.listenChoice(
            'Non sto bene, sono malato.',
            ['Sto bene, non sono malato.', 'Non sto bene, sono stanco.', 'Non sta bene, è malato.'],
            ['it-malato', 'it-bene'],
            { id: 'it.ex.dqh1ufcrh9n0bn' },
          ),
          question(
            'it.ex.gbw6rfxp8ye3d3',
            TELEFONO,
            '¿Qué le pasa a Paolo?',
            'Está enfermo y tiene frío',
            ['Tiene calor y hambre', 'Está bien, pero cansado', 'Está triste'],
            ['it-malato', 'it-ho-freddo'],
            'Paolo dice: «Sono malato» y «ho freddo».',
          ),
          question(
            'it.ex.n031jzofpbe38r',
            TELEFONO,
            '¿Qué le aconseja la mamá?',
            'Que se acueste y tome un té caliente',
            ['Que tome un helado', 'Que vaya a trabajar', 'Que coma un sándwich'],
            ['it-ho-caldo'],
            'La mamá dice: «a letto! E bevi un tè caldo» (caldo = caliente).',
          ),
          question(
            'it.ex.6qf6o86rwtdoiu',
            TELEFONO,
            '¿Cómo está Paolo, además?',
            'Muy cansado',
            ['Muy feliz', 'Un poco triste', 'Con mucha hambre'],
            ['it-stanco'],
            'Paolo dice: «sono molto stanco».',
          ),
          ex.orderWords(
            'Oggi sto male e ho freddo.',
            'Hoy me siento mal y tengo frío.',
            ['it-sto-male', 'it-ho-freddo'],
            {
              id: 'it.ex.gt6k6ixlvkmwzp',
            },
          ),
          ex.shortAnswer(
            'Come sta tua madre?',
            '¿Cómo está tu mamá? (Respondé que está bien, pero un poco cansada.)',
            "Sta bene, ma è un po' stanca.",
            [
              "Sta bene ma è un po' stanca.",
              'Sta bene, ma è un po’ stanca.',
              'Sta bene ma è un po’ stanca.',
            ],
            ['it-stanco', 'it-un-po', 'it-ma'],
            { id: 'it.ex.s5spw90eloxljv' },
          ),
          ex.translateWrite(
            'Mi hermana está enferma.',
            'Mia sorella è malata.',
            ['it-malato', 'it-sorella'],
            {
              id: 'it.ex.4awgmch562gfcr',
            },
          ),
        ],
      },
    ],
  },
};
