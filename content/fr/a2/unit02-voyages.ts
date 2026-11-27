import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Francés A2 U2 «Viajes» (docs/FR_A1_A2.md): contar un viaje con el passé composé con être
 * (aller, partir, arriver, rester, rentrer, venir, tomber) y su concordancia (elle est partie, nous
 * sommes arrivés); il y a + tiempo = hace; el aeropuerto, el hotel, el equipaje; en retard / à l'heure.
 * Cultura: el TGV de la SNCF y la costumbre de composter (validar) el pasaje.
 * Pronunciación: il y a deux ans / il y a douze ans / il a deux ans; il est / ils sont; rentrée / restée.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const AEROPORT = dialogue(
  'fr.stim.a2-u2-aeroport',
  'Julie llama por teléfono a su amigo Marc desde el aeropuerto.',
  [
    ['Julie', "Salut, Marc! Je suis arrivée à l'aéroport, mais mon vol est en retard."],
    ['Marc', 'Non! Tu vas arriver à quelle heure?'],
    ['Julie', 'À minuit. Le vol de Paris est toujours en retard!'],
    ['Marc', 'Et ta valise?'],
    ['Julie', 'Elle est avec moi. Et toi, tu es rentré à la maison?'],
    ['Marc', "Oui, je suis rentré à six heures. Mon train est arrivé à l'heure!"],
  ],
);

const CARTE = reading(
  'fr.stim.a2-u2-carte',
  'postcard',
  'Una postal de Camille a su amiga Sophie.',
  [
    'Chère Sophie,',
    "Je suis arrivée à Marseille lundi. Le TGV est parti de Paris à l'heure et le voyage a été très court.",
    "Je suis restée cinq jours à l'hôtel, près de la mer.",
    'Mercredi, je suis tombée dans la rue, mais ça va!',
    'Dimanche, je vais rentrer à Lyon.',
    'Bises, Camille',
  ],
  { from: 'Camille', to: 'Sophie' },
);

export const FR_A2_U02: FrUnitDef = {
  names: [
    'Julie',
    'Marc',
    'Camille',
    'Sophie',
    'Paul',
    'Léa',
    'Claire',
    'Lyon',
    'Paris',
    'Marseille',
    'Nice',
    'Rome',
    'Madrid',
    'Italie',
    'TGV',
  ],
  support: ['rentrer', 'arriver', 'bises'],
  unit: {
    position: 2,
    title: 'Viajes',
    titleEn: 'Voyages',
    description:
      "Passé composé con être (aller, partir, arriver, rester, rentrer, venir, tomber) y la concordancia; il y a + tiempo = hace; el aeropuerto, el hotel, la maleta; en retard / à l'heure. Cultura: el TGV y la SNCF.",
    emoji: '✈️',
    objective:
      'Puedes contar un viaje: adónde fuiste, cuándo llegaste y volviste, cuánto te quedaste y si el vuelo o el tren llegó a tiempo.',
    grammar: {
      title: 'El passé composé con être',
      explanation:
        "Un grupo de verbos, casi todos de movimiento, forma el passé composé con être en lugar de avoir: aller (allé), partir (parti), arriver (arrivé), rester (resté), rentrer (rentré), venir (venu), tomber (tombé). Con être, el participio concuerda con el sujeto como un adjetivo: elle est partie, nous sommes arrivés, elles sont venues (la e y la s que se agregan no suenan). Los demás verbos siguen con avoir: j'ai pris le train, nous avons visité Rome. Il y a + tiempo significa «hace»: je suis parti il y a deux ans.",
      examples: [
        { target: 'Elle est partie à six heures.', base: 'Ella se fue a las seis.' },
        { target: 'Nous sommes arrivés en retard.', base: 'Llegamos tarde.' },
        {
          target: 'Il y a deux ans, je suis allé à Rome.',
          base: 'Hace dos años fui a Roma.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        "A2 nuevo (U2). Sin revisión nativa: revisar el registro de «Bises» en la postal, «partir à l'étranger» y si conviene enseñar también «je suis sorti».",
    },
    words: [
      w(
        'fr-je-suis-alle',
        'je suis allé',
        'fui',
        'Hier, je suis allé au cinéma.',
        'Ayer fui al cine.',
        ['past', 'movement'],
        { acceptedTranslations: ['yo fui'], acceptedTexts: ['je suis allée'] },
      ),
      w(
        'fr-je-suis-parti',
        'je suis parti',
        'me fui',
        'Je suis parti à six heures.',
        'Me fui a las seis.',
        ['past', 'movement'],
        { acceptedTranslations: ['salí'], acceptedTexts: ['je suis partie'] },
      ),
      w(
        'fr-je-suis-arrive',
        'je suis arrivé',
        'llegué',
        "Je suis arrivé à l'aéroport à midi.",
        'Llegué al aeropuerto al mediodía.',
        ['past', 'movement'],
        { acceptedTranslations: ['yo llegué'], acceptedTexts: ['je suis arrivée'] },
      ),
      w(
        'fr-je-suis-reste',
        'je suis resté',
        'me quedé',
        'Je suis resté trois jours à Lyon.',
        'Me quedé tres días en Lyon.',
        ['past'],
        { acceptedTranslations: ['yo me quedé'], acceptedTexts: ['je suis restée'] },
      ),
      w(
        'fr-je-suis-rentre',
        'je suis rentré',
        'volví',
        'Je suis rentré à la maison en bus.',
        'Volví a casa en autobús.',
        ['past', 'movement'],
        { acceptedTranslations: ['regresé'], acceptedTexts: ['je suis rentrée'] },
      ),
      w(
        'fr-je-suis-venu',
        'je suis venu',
        'vine',
        'Je suis venu avec ma sœur.',
        'Vine con mi hermana.',
        ['past', 'movement'],
        { acceptedTranslations: ['yo vine'], acceptedTexts: ['je suis venue'] },
      ),
      w(
        'fr-je-suis-tombe',
        'je suis tombé',
        'me caí',
        'Je suis tombé dans la rue.',
        'Me caí en la calle.',
        ['past'],
        { acceptedTranslations: ['yo me caí'], acceptedTexts: ['je suis tombée'] },
      ),
      w(
        'fr-il-y-a-deux-ans',
        'il y a deux ans',
        'hace dos años',
        'Il y a deux ans, je suis allé en Italie.',
        'Hace dos años fui a Italia.',
        ['time'],
      ),
      w(
        'fr-l-aeroport',
        "l'aéroport",
        'el aeropuerto',
        "L'aéroport est loin de la ville.",
        'El aeropuerto está lejos de la ciudad.',
        ['travel', 'm'],
        { emoji: '🛫' },
      ),
      w(
        'fr-la-valise',
        'la valise',
        'la maleta',
        'Ma valise est très grande.',
        'Mi maleta es muy grande.',
        ['travel', 'f'],
        { acceptedTranslations: ['la valija'], emoji: '🧳' },
      ),
      w(
        'fr-le-passeport',
        'le passeport',
        'el pasaporte',
        'Mon passeport est dans mon sac.',
        'Mi pasaporte está en mi bolso.',
        ['travel', 'm'],
        { emoji: '🛂' },
      ),
      w(
        'fr-l-hotel',
        "l'hôtel",
        'el hotel',
        "L'hôtel est près de la plage.",
        'El hotel está cerca de la playa.',
        ['travel', 'm'],
        { emoji: '🏨' },
      ),
      w(
        'fr-le-sejour',
        'le séjour',
        'la estadía',
        'Bon séjour à Paris!',
        '¡Buena estadía en París!',
        ['travel', 'm'],
        { acceptedTranslations: ['la estancia'] },
      ),
      w(
        'fr-l-etranger',
        "l'étranger",
        'el exterior',
        "Ma fille habite à l'étranger.",
        'Mi hija vive en el exterior.',
        ['travel'],
        { acceptedTranslations: ['el extranjero'] },
      ),
      w(
        'fr-le-vol',
        'le vol',
        'el vuelo',
        'Le vol pour Madrid est à huit heures.',
        'El vuelo a Madrid es a las ocho.',
        ['travel', 'm'],
      ),
      w(
        'fr-en-retard',
        'en retard',
        'atrasado',
        'Le train est en retard.',
        'El tren está atrasado.',
        ['time'],
        { acceptedTranslations: ['tarde', 'con retraso', 'atrasada'] },
      ),
      w(
        'fr-a-l-heure',
        "à l'heure",
        'a tiempo',
        "Le vol est arrivé à l'heure.",
        'El vuelo llegó a tiempo.',
        ['time'],
        { acceptedTranslations: ['puntual'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Je suis allé, je suis parti',
        objective: 'Contar adónde fuiste y cuándo llegaste con être.',
        intro: {
          explanation:
            "Los verbos de movimiento como aller, partir y arriver forman el passé composé con être, no con avoir: je suis allé, je suis parti, je suis arrivé (nunca «j'ai allé»). El participio concuerda con el sujeto como un adjetivo: elle est allée, ils sont partis, elles sont arrivées. La e y la s que se agregan no suenan.",
          examples: [
            { target: 'Je suis allé à Paris.', base: 'Fui a París.' },
            { target: "Elle est arrivée à l'aéroport.", base: 'Ella llegó al aeropuerto.' },
          ],
        },
        takeaways: [
          'Usas être con aller, partir y arriver: je suis allé.',
          'Haces concordar el participio: elle est partie, ils sont arrivés.',
        ],
        exercises: [
          ex.translationChoice(
            'je suis allé',
            'fui',
            ['me fui', 'llegué', 'vine'],
            ['fr-je-suis-alle'],
            { id: 'fr.ex.csjvpp4jim5hyl' },
          ),
          ex.translationChoice(
            "l'aéroport",
            'el aeropuerto',
            ['la estación de tren', 'el vuelo', 'la calle'],
            ['fr-l-aeroport'],
            { id: 'fr.ex.imvbldt63lqj55' },
          ),
          ex.matchPairs(
            [
              ['je suis allé', 'fui'],
              ['je suis parti', 'me fui'],
              ['je suis arrivé', 'llegué'],
              ['le vol', 'el vuelo'],
            ],
            ['fr-je-suis-alle', 'fr-je-suis-parti', 'fr-je-suis-arrive', 'fr-le-vol'],
            { id: 'fr.ex.xwafcg7vrtsked' },
          ),
          ex.fillBlank(
            'Hier, je ___ allé à Lyon.',
            'Ayer fui a Lyon.',
            'suis',
            ['ai', 'es', 'est'],
            ['fr-je-suis-alle'],
            {
              id: 'fr.ex.mdni32iurd02hi',
              explanation: "Aller va con être: je suis allé, nunca «j'ai allé».",
            },
          ),
          ex.fillBlank(
            "Claire est ___ à l'aéroport à midi.",
            'Claire llegó al aeropuerto al mediodía.',
            'arrivée',
            ['arrivé', 'arrivés'],
            ['fr-je-suis-arrive', 'fr-l-aeroport'],
            {
              id: 'fr.ex.xclkbgvd4jth70',
              explanation: 'Con être el participio concuerda: Claire es mujer, arrivée.',
            },
          ),
          ex.listenChoice(
            'Ils sont partis.',
            ['Il est parti.', 'Ils vont partir.'],
            ['fr-je-suis-parti'],
            {
              id: 'fr.ex.q0d8bsewgfanid',
              explanation: 'Escucha el auxiliar: il est o ils sont. La s de partis no suena.',
            },
          ),
          ex.listenChoice(
            'Le vol est arrivé.',
            ['Le vol est parti.', 'Le train est arrivé.'],
            ['fr-le-vol', 'fr-je-suis-arrive'],
            { id: 'fr.ex.6x0w3li56c1v4q' },
          ),
          ex.orderWords(
            'Nous sommes partis à six heures.',
            'Nos fuimos a las seis.',
            ['fr-je-suis-parti'],
            { id: 'fr.ex.92d7an7vnou616' },
          ),
          ex.translateWrite(
            'Mi mamá fue a Roma.',
            'Ma mère est allée à Rome.',
            ['fr-je-suis-alle'],
            {
              id: 'fr.ex.gxk7vk68njmkp6',
            },
          ),
          ex.shortAnswer(
            'Où est-ce que tu es allé le week-end dernier?',
            '¿Adónde fuiste el fin de semana pasado? (Responde que fuiste a Marsella.)',
            'Je suis allé à Marseille.',
            [
              'Je suis allée à Marseille.',
              'Le week-end dernier, je suis allé à Marseille.',
              'Le week-end dernier, je suis allée à Marseille.',
              'À Marseille.',
            ],
            ['fr-je-suis-alle'],
            { id: 'fr.ex.mwrccxmrwvsgcg' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: "Je suis resté à l'hôtel",
        objective: 'Contar cuánto te quedaste y cuándo volviste.',
        intro: {
          explanation:
            "Más verbos con être: rester → resté (quedarse, no «restar»), rentrer → rentré (volver, sobre todo a casa), venir → venu, tomber → tombé. Con nous, vous, ils y elles el participio va en plural: nous sommes restés. En l'hôtel la h no suena, por eso hay elisión: l'hôtel. Le séjour es la estadía.",
          examples: [
            { target: "Je suis resté à l'hôtel.", base: 'Me quedé en el hotel.' },
            { target: 'Nous sommes rentrés dimanche.', base: 'Volvimos el domingo.' },
          ],
        },
        takeaways: [
          'Cuentas tu estadía con je suis resté y je suis rentré.',
          'Pones el participio en plural con nous y ils: nous sommes restés.',
        ],
        exercises: [
          ex.translationChoice(
            'je suis rentré',
            'volví',
            ['me quedé', 'vine', 'me caí'],
            ['fr-je-suis-rentre'],
            { id: 'fr.ex.mvpzemt5lm957u' },
          ),
          ex.translationChoice(
            'le séjour',
            'la estadía',
            ['la sala', 'el vuelo', 'la maleta'],
            ['fr-le-sejour'],
            {
              id: 'fr.ex.zmjrkkss19wp3k',
              explanation: 'Le séjour es la estadía (y también la sala de una casa).',
            },
          ),
          ex.matchPairs(
            [
              ['je suis resté', 'me quedé'],
              ['je suis rentré', 'volví'],
              ['je suis venu', 'vine'],
              ['je suis tombé', 'me caí'],
            ],
            ['fr-je-suis-reste', 'fr-je-suis-rentre', 'fr-je-suis-venu', 'fr-je-suis-tombe'],
            { id: 'fr.ex.68geou1dkncntv' },
          ),
          ex.fillBlank(
            "Nous sommes ___ trois jours à l'hôtel.",
            'Nos quedamos tres días en el hotel.',
            'restés',
            ['resté', 'restée'],
            ['fr-je-suis-reste', 'fr-l-hotel'],
            {
              id: 'fr.ex.td763245ttf6em',
              explanation: 'Con nous el participio va en plural: nous sommes restés.',
            },
          ),
          ex.fillBlank(
            'Elle est ___ dans la rue.',
            'Ella se cayó en la calle.',
            'tombée',
            ['tombé', 'tombés'],
            ['fr-je-suis-tombe'],
            {
              id: 'fr.ex.rwh9rcxhmnz80u',
              explanation: 'Tomber va con être y concuerda: elle est tombée.',
            },
          ),
          ex.listenChoice(
            'Je suis venu avec mon frère.',
            ['Je suis rentré avec mon frère.', 'Je suis venu avec ma sœur.'],
            ['fr-je-suis-venu'],
            { id: 'fr.ex.ogpd4szbuj4sbi' },
          ),
          ex.listenChoice(
            'Il est venu.',
            ['Ils sont venus.', 'Il est rentré.'],
            ['fr-je-suis-venu', 'fr-je-suis-rentre'],
            {
              id: 'fr.ex.4h94ast7skj24z',
              explanation: 'Rentré empieza con una vocal nasal, como en vent; venu no tiene nasal.',
            },
          ),
          ex.orderWords(
            'Mon séjour à Rome a été très court.',
            'Mi estadía en Roma fue muy corta.',
            ['fr-le-sejour'],
            { id: 'fr.ex.0ur1wolg5v267o' },
          ),
          ex.translateWrite(
            'El domingo volví a casa en tren.',
            'Dimanche, je suis rentré à la maison en train.',
            ['fr-je-suis-rentre'],
            {
              id: 'fr.ex.0cqx73ckgvqeuj',
              acceptedAnswers: [
                'Dimanche, je suis rentrée à la maison en train.',
                'Je suis rentré à la maison en train dimanche.',
                'Je suis rentrée à la maison en train dimanche.',
              ],
            },
          ),
          ex.shortAnswer(
            "Tu es resté à l'hôtel?",
            '¿Te quedaste en el hotel? (Responde que sí.)',
            "Oui, je suis resté à l'hôtel.",
            ["Oui, je suis restée à l'hôtel.", 'Oui, je suis resté.', 'Oui, je suis restée.'],
            ['fr-je-suis-reste', 'fr-l-hotel'],
            { id: 'fr.ex.gq3yfuqo83o8b6' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Il y a deux ans',
        objective: 'Decir hace cuánto pasó algo y hablar del equipaje.',
        intro: {
          explanation:
            "Il y a + tiempo significa «hace»: il y a deux ans (hace dos años), il y a une semaine. Ya conoces il y a como «hay»: con una cantidad de tiempo y un verbo en pasado, es «hace». À l'étranger es en el exterior o al exterior: partir à l'étranger. Para viajar llevas la valise (la maleta) y le passeport.",
          examples: [
            {
              target: "Il y a deux ans, je suis parti à l'étranger.",
              base: 'Hace dos años me fui al exterior.',
            },
            {
              target: 'Mon passeport est dans la valise.',
              base: 'Mi pasaporte está en la maleta.',
            },
          ],
        },
        takeaways: [
          'Dices hace cuánto con il y a: il y a deux ans.',
          "Nombras la valise, le passeport y l'étranger.",
        ],
        exercises: [
          ex.translationChoice(
            'il y a deux ans',
            'hace dos años',
            ['dentro de dos años', 'tengo dos años', 'hay dos días'],
            ['fr-il-y-a-deux-ans'],
            { id: 'fr.ex.vbigjo17yl2nyd' },
          ),
          ex.translationChoice(
            "l'étranger",
            'el exterior',
            ['el aeropuerto', 'la ciudad', 'el país'],
            ['fr-l-etranger'],
            { id: 'fr.ex.upm7c7v7xbaiux' },
          ),
          ex.imageChoice('🧳', 'la valise', ['le passeport', 'le billet'], ['fr-la-valise'], {
            id: 'fr.ex.iut26dlqdf3fs5',
          }),
          ex.matchPairs(
            [
              ['il y a deux ans', 'hace dos años'],
              ["l'étranger", 'el exterior'],
              ['la valise', 'la maleta'],
              ['le passeport', 'el pasaporte'],
            ],
            ['fr-il-y-a-deux-ans', 'fr-l-etranger', 'fr-la-valise', 'fr-le-passeport'],
            { id: 'fr.ex.bdb8hf7atmf3zn' },
          ),
          ex.fillBlank(
            "Je suis parti à l'étranger ___ deux ans.",
            'Me fui al exterior hace dos años.',
            'il y a',
            ['dans', 'pour'],
            ['fr-il-y-a-deux-ans', 'fr-l-etranger'],
            {
              id: 'fr.ex.5hkgyff68a1lp3',
              explanation: 'Hace + tiempo es il y a. Dans deux ans es «dentro de dos años».',
            },
          ),
          ex.fillBlank(
            'Où est mon ___? — Dans la valise!',
            '¿Dónde está mi pasaporte? — ¡En la maleta!',
            'passeport',
            ['billet', 'vol'],
            ['fr-le-passeport', 'fr-la-valise'],
            { id: 'fr.ex.w0538skl8l73qq', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'Il y a deux ans.',
            ['Il y a douze ans.', 'Il a deux ans.'],
            ['fr-il-y-a-deux-ans'],
            {
              id: 'fr.ex.3zrdqaj68j6wmq',
              explanation:
                'Deux y douze se distinguen por la vocal; il y a (hace) tiene una sílaba más que il a (tiene).',
            },
          ),
          ex.orderWords(
            "Elle est partie à l'étranger il y a un an.",
            'Ella se fue al exterior hace un año.',
            ['fr-l-etranger', 'fr-je-suis-parti'],
            { id: 'fr.ex.4ye2hssr9y67xy' },
          ),
          ex.translateWrite(
            'Hace dos años fui a Madrid.',
            'Il y a deux ans, je suis allé à Madrid.',
            ['fr-il-y-a-deux-ans', 'fr-je-suis-alle'],
            {
              id: 'fr.ex.h8z7n1yrm7kvfs',
              acceptedAnswers: [
                'Il y a deux ans, je suis allée à Madrid.',
                'Je suis allé à Madrid il y a deux ans.',
                'Je suis allée à Madrid il y a deux ans.',
              ],
            },
          ),
          ex.shortAnswer(
            'Tu as ton passeport?',
            '¿Tienes tu pasaporte? (Responde que sí, que está en la maleta.)',
            'Oui, il est dans la valise.',
            [
              'Oui, il est dans ma valise.',
              'Oui, mon passeport est dans la valise.',
              'Oui, mon passeport est dans ma valise.',
            ],
            ['fr-le-passeport', 'fr-la-valise'],
            { id: 'fr.ex.nqfa6p0g3b2a2r' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: "En retard ou à l'heure?",
        objective: 'Decir si un vuelo o un tren llegó a tiempo o atrasado.',
        intro: {
          explanation:
            "En retard es atrasado o tarde: le vol est en retard, je suis arrivé en retard. À l'heure es a tiempo, puntual: le train est arrivé à l'heure. En Francia, el tren de alta velocidad es el TGV, de la compañía SNCF. En los trenes regionales todavía hay que composter (validar) el pasaje en una máquina antes de subir.",
          examples: [
            { target: 'Le train est en retard.', base: 'El tren está atrasado.' },
            { target: "Le vol est arrivé à l'heure.", base: 'El vuelo llegó a tiempo.' },
          ],
        },
        takeaways: [
          "Dices si algo está en retard o llegó à l'heure.",
          'Entiendes una conversación sobre un viaje con demoras.',
        ],
        exercises: [
          ex.translationChoice(
            'en retard',
            'atrasado',
            ['a tiempo', 'temprano', 'ahora'],
            ['fr-en-retard'],
            { id: 'fr.ex.6ewriigb75v5bs' },
          ),
          ex.fillBlank(
            'Le train est arrivé ___.',
            'El tren llegó a tiempo.',
            "à l'heure",
            ['en retard', 'demain'],
            ['fr-a-l-heure'],
            {
              id: 'fr.ex.vs3xh6ujrj8u1g',
              skill: 'vocabulary',
              explanation: "A tiempo es à l'heure.",
            },
          ),
          ex.listenChoice(
            'Le vol est en retard.',
            ["Le vol est à l'heure.", 'Le vol est parti.'],
            ['fr-en-retard', 'fr-le-vol'],
            { id: 'fr.ex.zej23x2fqjstku' },
          ),
          question(
            'fr.ex.wi7d69ozo1yoiq',
            AEROPORT,
            '¿Dónde está Julie?',
            'En el aeropuerto.',
            ['En la estación de tren.', 'En su casa.', 'En el hotel.'],
            ['fr-l-aeroport', 'fr-je-suis-arrive'],
            "Julie dice «Je suis arrivée à l'aéroport».",
          ),
          question(
            'fr.ex.wnhtttqvl9d0nb',
            AEROPORT,
            '¿Qué problema tiene Julie?',
            'Su vuelo está atrasado.',
            ['Perdió la maleta.', 'No tiene el pasaporte.', 'Su tren no llegó.'],
            ['fr-le-vol', 'fr-en-retard'],
            'Dice «mon vol est en retard» y, sobre la maleta, «Elle est avec moi».',
          ),
          question(
            'fr.ex.6sgq6lvqsu0bfs',
            AEROPORT,
            '¿A qué hora va a llegar Julie?',
            'A medianoche.',
            ['Al mediodía.', 'A las seis.', 'No lo sabe.'],
            ['fr-en-retard'],
            'Marc pregunta a qué hora va a llegar y Julie responde «À minuit».',
          ),
          question(
            'fr.ex.mngjytt1dcm1fu',
            AEROPORT,
            '¿Cómo le fue a Marc?',
            'Volvió a su casa a las seis y su tren llegó a tiempo.',
            [
              'Su tren llegó atrasado.',
              'Todavía está en el aeropuerto con Julie.',
              'Volvió a su casa a medianoche.',
            ],
            ['fr-je-suis-rentre', 'fr-a-l-heure'],
            "Marc dice «je suis rentré à six heures. Mon train est arrivé à l'heure!».",
          ),
          ex.orderWords(
            "Le TGV est arrivé à l'heure.",
            'El TGV llegó a tiempo.',
            ['fr-a-l-heure'],
            {
              id: 'fr.ex.b3ua0g2ig3i4yu',
            },
          ),
          ex.translateWrite(
            'Llegué tarde al trabajo.',
            'Je suis arrivé en retard au travail.',
            ['fr-en-retard', 'fr-je-suis-arrive'],
            {
              id: 'fr.ex.6w5ye1tlwdqg9b',
              acceptedAnswers: [
                'Je suis arrivée en retard au travail.',
                'Je suis arrivé au travail en retard.',
                'Je suis arrivée au travail en retard.',
              ],
            },
          ),
          ex.shortAnswer(
            "Le train est à l'heure?",
            '¿El tren está a tiempo? (Responde que no, que está atrasado.)',
            'Non, il est en retard.',
            ['Non, le train est en retard.'],
            ['fr-en-retard'],
            { id: 'fr.ex.fqgdvm2eik7qry' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: "Un séjour à l'étranger",
        objective: 'Contar un viaje completo con être y avoir.',
        intro: {
          explanation:
            "Para contar un viaje se mezclan los dos auxiliares: être con los verbos de movimiento (je suis allé, nous sommes rentrés) y avoir con los demás (j'ai pris le train, nous avons visité Rome). Sólo con être el participio concuerda: Léa est partie; Paul et Léa sont partis (con un varón en el grupo, masculino plural).",
          examples: [
            {
              target: 'Nous sommes allés à Rome il y a deux ans.',
              base: 'Fuimos a Roma hace dos años.',
            },
            { target: 'Léa est partie avec sa valise.', base: 'Léa se fue con su maleta.' },
          ],
        },
        takeaways: [
          "Eliges être o avoir según el verbo: je suis allé, j'ai visité.",
          'Haces concordar el participio sólo con être.',
        ],
        exercises: [
          ex.fillBlank(
            'Paul et Léa sont ___ en vacances.',
            'Paul y Léa se fueron de vacaciones.',
            'partis',
            ['parti', 'partie'],
            ['fr-je-suis-parti'],
            {
              id: 'fr.ex.rr8yc0gvov0wkw',
              explanation: 'Un varón y una mujer: masculino plural, partis.',
            },
          ),
          ex.fillBlank(
            'Nous ___ visité le musée.',
            'Visitamos el museo.',
            'avons',
            ['sommes', 'êtes'],
            ['fr-je-suis-alle'],
            {
              id: 'fr.ex.adghf1i5uqbwey',
              explanation: 'Visiter no es de movimiento: va con avoir, nous avons visité.',
            },
          ),
          ex.listenChoice(
            'Elle est rentrée.',
            ['Elle est restée.', 'Elle est tombée.'],
            ['fr-je-suis-rentre', 'fr-je-suis-reste'],
            {
              id: 'fr.ex.ku217u8eep4xgc',
              explanation: 'Rentrée tiene una vocal nasal; restée, no: escucha la primera sílaba.',
            },
          ),
          question(
            'fr.ex.rnki6dtm2ox9lj',
            CARTE,
            '¿Cómo fue el viaje de Camille a Marsella?',
            'En TGV: salió a tiempo y fue muy corto.',
            ['En avión, con demora.', 'En auto, muy largo.', 'En TGV, pero llegó tarde.'],
            ['fr-a-l-heure', 'fr-je-suis-arrive'],
            "Escribe «Le TGV est parti de Paris à l'heure et le voyage a été très court».",
          ),
          question(
            'fr.ex.iry5t5sue68p78',
            CARTE,
            '¿Cuánto tiempo se quedó Camille y dónde?',
            'Cinco días, en un hotel cerca del mar.',
            [
              'Cinco días, en la casa de Sophie.',
              'Una semana, en un hotel en la montaña.',
              'Dos días, en un hotel en París.',
            ],
            ['fr-je-suis-reste', 'fr-l-hotel'],
            "Escribe «Je suis restée cinq jours à l'hôtel, près de la mer».",
          ),
          question(
            'fr.ex.5j3c9ku7mgt3me',
            CARTE,
            '¿Qué le pasó a Camille el miércoles?',
            'Se cayó en la calle, pero está bien.',
            ['Perdió el pasaporte.', 'Volvió a Lyon.', 'Se cayó y está en el hospital.'],
            ['fr-je-suis-tombe'],
            'Escribe «Mercredi, je suis tombée dans la rue, mais ça va!».',
          ),
          ex.matchPairs(
            [
              ['le séjour', 'la estadía'],
              ["l'hôtel", 'el hotel'],
              ['en retard', 'atrasado'],
              ["à l'heure", 'a tiempo'],
            ],
            ['fr-le-sejour', 'fr-l-hotel', 'fr-en-retard', 'fr-a-l-heure'],
            { id: 'fr.ex.l6f3ykompd81s0' },
          ),
          ex.orderWords(
            'Elles sont venues en avion.',
            'Ellas vinieron en avión.',
            ['fr-je-suis-venu'],
            {
              id: 'fr.ex.lawv46mabvnftj',
            },
          ),
          ex.translateWrite(
            'Hace un año, mi hermana se fue al exterior.',
            "Il y a un an, ma sœur est partie à l'étranger.",
            ['fr-il-y-a-deux-ans', 'fr-l-etranger', 'fr-je-suis-parti'],
            {
              id: 'fr.ex.8crg7qx5epx8eb',
              acceptedAnswers: ["Ma sœur est partie à l'étranger il y a un an."],
            },
          ),
          ex.shortAnswer(
            'Où est-ce que tu es allé en vacances?',
            '¿Adónde fuiste de vacaciones? (Responde que fuiste a Niza y te quedaste una semana.)',
            'Je suis allé à Nice et je suis resté une semaine.',
            [
              'Je suis allée à Nice et je suis restée une semaine.',
              'Je suis allé à Nice. Je suis resté une semaine.',
              'Je suis allée à Nice. Je suis restée une semaine.',
            ],
            ['fr-je-suis-alle', 'fr-je-suis-reste'],
            { id: 'fr.ex.412xvyyfwlnp1u' },
          ),
        ],
      },
    ],
  },
};
