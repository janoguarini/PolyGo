import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U16 «El clima y las estaciones» (docs/FR_A1_A2.md): preguntar qué tiempo hace (quel temps
 * fait-il?) y responder con il fait + adjetivo (beau, mauvais, froid, chaud), il pleut, il neige e
 * il y a du soleil / du vent; las estaciones (en été, en automne, en hiver, pero au printemps) y los
 * lugares de vacaciones (la mer, la montagne, la plage). Diferencias con el español: il fait + adjetivo,
 * la mer es femenino. Pronunciación: vent / vin, consonantes finales mudas (fait, froid, chaud), la
 * liaison de en‿été, en‿hiver. Cultura: los hemisferios (en France il fait chaud en juillet).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const VACANCES = dialogue(
  'fr.stim.a1-u16-vacances',
  'Paul y Léa hablan de adónde les gusta ir de vacaciones.',
  [
    ['Paul', 'Léa, tu préfères la mer ou la montagne?'],
    ['Léa', "La montagne! En hiver, il neige et j'adore la neige."],
    ['Paul', 'Moi, je préfère la mer. En été, il fait chaud et il y a du soleil.'],
    ['Léa', 'Et quand il pleut?'],
    ['Paul', 'Quand il pleut, je vais au cinéma!'],
  ],
  FR_A1_RATE,
);

const CARTE = reading(
  'fr.stim.a1-u16-carte',
  'postcard',
  'Una postal de Claire, que está de vacaciones en Francia, a su amiga Ana, en Buenos Aires.',
  [
    'Chère Ana,',
    "Je suis à Marseille avec ma famille. C'est l'été: il fait très chaud et il y a du soleil.",
    'Le matin, nous allons à la plage. La mer est belle!',
    'Et à Buenos Aires? Il fait froid en juillet, non?',
    'À bientôt! Claire',
  ],
  { from: 'Claire', to: 'Ana' },
);

export const FR_A1_U16: FrUnitDef = {
  names: [
    'Paul',
    'Léa',
    'Claire',
    'Ana',
    'Marseille',
    'Paris',
    'Lyon',
    'Buenos Aires',
    'Argentine',
    'France',
  ],
  support: [],
  unit: {
    position: 16,
    title: 'El clima y las estaciones',
    titleEn: 'La météo',
    description:
      'Quel temps fait-il? Il fait beau / mauvais / froid / chaud, il pleut, il neige, il y a du soleil / du vent; las estaciones (en été, pero au printemps); la mer, la montagne, la plage. Los hemisferios.',
    emoji: '☀️',
    objective:
      'Puedes preguntar y decir qué tiempo hace, hablar de las estaciones y contar si prefieres el mar o la montaña.',
    grammar: {
      title: 'Il fait + adjetivo · en / au + estación',
      explanation:
        'Para el clima, el francés usa il fait + adjetivo: il fait beau (hace buen tiempo), il fait mauvais, il fait froid, il fait chaud; nunca «il est froid». La lluvia y la nieve tienen verbo propio: il pleut, il neige. Con el sol y el viento se usa il y a du: il y a du soleil, il y a du vent. Para preguntar: quel temps fait-il? Las estaciones son masculinas y se dicen con en (en été, en automne, en hiver), salvo au printemps. Ojo: la mer (el mar) es femenino.',
      examples: [
        {
          target: 'Quel temps fait-il? — Il fait beau.',
          base: '¿Qué tiempo hace? — Hace buen tiempo.',
        },
        { target: 'Il pleut et il y a du vent.', base: 'Llueve y hay viento.' },
        {
          target: 'Au printemps, il fait beau, mais en hiver, il fait froid.',
          base: 'En primavera hace buen tiempo, pero en invierno hace frío.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U16). Sin revisión nativa: revisar «aller à la mer» (ir de vacaciones al mar), la explicación de vent / vin y la descripción de la liaison en‿été.',
    },
    words: [
      w(
        'fr-quel-temps-fait-il',
        'quel temps fait-il?',
        '¿qué tiempo hace?',
        'Quel temps fait-il à Lyon?',
        '¿Qué tiempo hace en Lyon?',
        ['weather', 'questions'],
        { acceptedTranslations: ['¿cómo está el tiempo?'] },
      ),
      w(
        'fr-il-fait-beau',
        'il fait beau',
        'hace buen tiempo',
        "Aujourd'hui, il fait beau.",
        'Hoy hace buen tiempo.',
        ['weather'],
        { acceptedTranslations: ['está lindo'] },
      ),
      w(
        'fr-il-fait-mauvais',
        'il fait mauvais',
        'hace mal tiempo',
        'Il fait mauvais à Paris.',
        'Hace mal tiempo en París.',
        ['weather'],
        { acceptedTranslations: ['está feo'] },
      ),
      w(
        'fr-il-fait-froid',
        'il fait froid',
        'hace frío',
        'En hiver, il fait froid.',
        'En invierno hace frío.',
        ['weather'],
      ),
      w(
        'fr-il-fait-chaud',
        'il fait chaud',
        'hace calor',
        'En juillet, il fait chaud à Marseille.',
        'En julio hace calor en Marsella.',
        ['weather'],
      ),
      w(
        'fr-il-pleut',
        'il pleut',
        'llueve',
        'Il pleut beaucoup en automne.',
        'En otoño llueve mucho.',
        ['weather'],
        { acceptedTranslations: ['está lloviendo'] },
      ),
      w(
        'fr-il-neige',
        'il neige',
        'nieva',
        'Il neige à la montagne.',
        'Nieva en la montaña.',
        ['weather'],
        { acceptedTranslations: ['está nevando'] },
      ),
      w('fr-le-soleil', 'le soleil', 'el sol', "Il y a du soleil aujourd'hui.", 'Hoy hay sol.', [
        'weather',
        'm',
      ]),
      w(
        'fr-le-vent',
        'le vent',
        'el viento',
        'Il y a du vent à la plage.',
        'Hay viento en la playa.',
        ['weather', 'm'],
      ),
      w('fr-la-pluie', 'la pluie', 'la lluvia', "J'aime la pluie.", 'Me gusta la lluvia.', [
        'weather',
        'f',
      ]),
      w(
        'fr-le-printemps',
        'le printemps',
        'la primavera',
        'Au printemps, il fait beau.',
        'En primavera hace buen tiempo.',
        ['seasons', 'm'],
      ),
      w('fr-l-ete', "l'été", 'el verano', 'En été, je vais à la mer.', 'En verano voy al mar.', [
        'seasons',
        'm',
      ]),
      w(
        'fr-l-automne',
        "l'automne",
        'el otoño',
        'En automne, il y a du vent.',
        'En otoño hay viento.',
        ['seasons', 'm'],
      ),
      w('fr-l-hiver', "l'hiver", 'el invierno', 'En hiver, il neige.', 'En invierno nieva.', [
        'seasons',
        'm',
      ]),
      w('fr-la-mer', 'la mer', 'el mar', 'La mer est belle.', 'El mar es lindo.', ['places', 'f']),
      w(
        'fr-la-montagne',
        'la montagne',
        'la montaña',
        'Nous allons à la montagne en hiver.',
        'En invierno vamos a la montaña.',
        ['places', 'f'],
      ),
      w(
        'fr-la-plage',
        'la plage',
        'la playa',
        'Le matin, je vais à la plage.',
        'Por la mañana voy a la playa.',
        ['places', 'f'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Quel temps fait-il?',
        objective: 'Preguntar qué tiempo hace y responder con il fait.',
        intro: {
          explanation:
            'Para el clima, el francés usa il fait + adjetivo, como el «hace» del español pero con un adjetivo: il fait beau (hace buen tiempo), il fait mauvais (hace mal tiempo), il fait froid, il fait chaud. Para preguntar: quel temps fait-il?, con inversión como en comment est-il? La t de fait no suena, ni la d final de froid y chaud.',
          examples: [
            {
              target: 'Quel temps fait-il? — Il fait beau.',
              base: '¿Qué tiempo hace? — Hace buen tiempo.',
            },
            { target: "Aujourd'hui, il fait très chaud.", base: 'Hoy hace mucho calor.' },
          ],
        },
        takeaways: [
          'Preguntas quel temps fait-il?',
          'Respondes con il fait beau, mauvais, froid o chaud.',
        ],
        exercises: [
          ex.translationChoice(
            'il fait froid',
            'hace frío',
            ['hace calor', 'hace buen tiempo', 'hace mal tiempo'],
            ['fr-il-fait-froid'],
            { id: 'fr.ex.cxjhgsnqywseym' },
          ),
          ex.translationChoice(
            'quel temps fait-il?',
            '¿qué tiempo hace?',
            ['¿qué hora es?', '¿qué fecha es?', '¿cómo es?'],
            ['fr-quel-temps-fait-il'],
            { id: 'fr.ex.if966fpvi1jrrq' },
          ),
          ex.matchPairs(
            [
              ['il fait beau', 'hace buen tiempo'],
              ['il fait mauvais', 'hace mal tiempo'],
              ['il fait froid', 'hace frío'],
              ['il fait chaud', 'hace calor'],
            ],
            ['fr-il-fait-beau', 'fr-il-fait-mauvais', 'fr-il-fait-froid', 'fr-il-fait-chaud'],
            { id: 'fr.ex.gjvtiv50224ykv' },
          ),
          ex.listenChoice(
            'Il fait chaud.',
            ['Il fait froid.', 'Il fait beau.', 'Il fait mauvais.'],
            ['fr-il-fait-chaud', 'fr-il-fait-froid'],
            { id: 'fr.ex.6804s1vy8q9dgr' },
          ),
          ex.fillBlank(
            "Il ___ froid aujourd'hui.",
            'Hoy hace frío.',
            'fait',
            ['est', 'a', 'fais'],
            ['fr-il-fait-froid'],
            {
              id: 'fr.ex.5bhow0b9zeh6g2',
              explanation: 'Para el clima: il fait + adjetivo. Fais es la forma de je y tu.',
            },
          ),
          ex.fillBlank(
            'Il fait ___: on va au cinéma.',
            'Hace mal tiempo: vamos al cine.',
            'mauvais',
            ['beau', 'belle'],
            ['fr-il-fait-mauvais'],
            {
              id: 'fr.ex.nggkwt8ytf64zg',
              skill: 'vocabulary',
              explanation: 'Mal tiempo es il fait mauvais; il fait beau es buen tiempo.',
            },
          ),
          ex.orderWords(
            'Quel temps fait-il à Paris?',
            '¿Qué tiempo hace en París?',
            ['fr-quel-temps-fait-il'],
            {
              id: 'fr.ex.0zyekutsw5efgg',
            },
          ),
          ex.fillBlank(
            'En juillet, il fait ___ à Marseille.',
            'En julio hace calor en Marsella.',
            'chaud',
            ['froid', 'chaude'],
            ['fr-il-fait-chaud'],
            {
              id: 'fr.ex.o55qj6xzl3cys6',
              explanation: 'Con il fait el adjetivo no cambia: il fait chaud, nunca «chaude».',
            },
          ),
          ex.translateWrite(
            'Hoy hace buen tiempo.',
            "Aujourd'hui, il fait beau.",
            ['fr-il-fait-beau'],
            {
              id: 'fr.ex.hfb3yhrqnmgcwp',
              acceptedAnswers: ["Il fait beau aujourd'hui.", "Aujourd'hui il fait beau."],
            },
          ),
          ex.shortAnswer(
            'Quel temps fait-il?',
            '¿Qué tiempo hace? (Responde que hace mucho frío.)',
            'Il fait très froid.',
            ["Il fait très froid aujourd'hui.", "Aujourd'hui, il fait très froid."],
            ['fr-il-fait-froid', 'fr-quel-temps-fait-il'],
            { id: 'fr.ex.wltedmsb4wj1sk' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Il pleut, il neige',
        objective: 'Hablar de la lluvia, la nieve, el sol y el viento.',
        intro: {
          explanation:
            'La lluvia y la nieve tienen verbo propio: il pleut (llueve) e il neige (nieva). Con el sol y el viento se usa il y a du: il y a du soleil (hay sol), il y a du vent (hay viento). La pluie es la lluvia. Ojo al oído: vent tiene la vocal nasal de blanc y vin, la de pain: il y a du vent no es il y a du vin.',
          examples: [
            { target: 'Il pleut à Paris.', base: 'Llueve en París.' },
            { target: 'Il y a du soleil et du vent.', base: 'Hay sol y viento.' },
          ],
        },
        takeaways: ['Dices il pleut e il neige.', 'Usas il y a du soleil e il y a du vent.'],
        exercises: [
          ex.translationChoice(
            'il pleut',
            'llueve',
            ['nieva', 'hace frío', 'hay viento'],
            ['fr-il-pleut'],
            { id: 'fr.ex.xdx0azi1ansa2s' },
          ),
          ex.matchPairs(
            [
              ['il neige', 'nieva'],
              ['le soleil', 'el sol'],
              ['le vent', 'el viento'],
              ['la pluie', 'la lluvia'],
            ],
            ['fr-il-neige', 'fr-le-soleil', 'fr-le-vent', 'fr-la-pluie'],
            { id: 'fr.ex.8zjv0ln73fh6d1' },
          ),
          ex.listenChoice(
            'Il y a du vent.',
            ['Il y a du vin.', 'Il y a du soleil.', 'Il pleut.'],
            ['fr-le-vent'],
            {
              id: 'fr.ex.99iwliozad2qrc',
              explanation: 'Vent tiene la vocal nasal de blanc; vin, la de pain.',
            },
          ),
          ex.fillBlank(
            'Il y a ___ soleil.',
            'Hay sol.',
            'du',
            ['de la', 'le', 'un'],
            ['fr-le-soleil'],
            {
              id: 'fr.ex.f66ihl2e6imbdk',
              explanation: 'Soleil es masculino: il y a du soleil (de + le = du).',
            },
          ),
          ex.fillBlank(
            'Il ___ à Lyon.',
            'Llueve en Lyon.',
            'pleut',
            ['pluie', 'fait'],
            ['fr-il-pleut', 'fr-la-pluie'],
            {
              id: 'fr.ex.8d5yrwjzp63nqy',
              explanation: 'Llueve es il pleut (verbo); la pluie es el sustantivo, la lluvia.',
            },
          ),
          ex.translationChoice(
            'la pluie',
            'la lluvia',
            ['el viento', 'la nieve', 'el sol'],
            ['fr-la-pluie'],
            { id: 'fr.ex.843vp4b8p0nkry' },
          ),
          ex.fillBlank(
            'Il fait froid et il ___.',
            'Hace frío y nieva.',
            'neige',
            ['vent', 'soleil'],
            ['fr-il-neige'],
            { id: 'fr.ex.wllz5qghpcihx6', skill: 'vocabulary' },
          ),
          ex.orderWords("Il y a du soleil aujourd'hui.", 'Hoy hay sol.', ['fr-le-soleil'], {
            id: 'fr.ex.a1jprh5whaiix3',
          }),
          ex.translateWrite(
            'Llueve y hace frío.',
            'Il pleut et il fait froid.',
            ['fr-il-pleut', 'fr-il-fait-froid'],
            { id: 'fr.ex.rnngc43ydeuhmb', acceptedAnswers: ['Il fait froid et il pleut.'] },
          ),
          ex.shortAnswer(
            'Quel temps fait-il à Paris?',
            '¿Qué tiempo hace en París? (Responde que hay viento y llueve.)',
            'Il y a du vent et il pleut.',
            [
              'Il pleut et il y a du vent.',
              'À Paris, il y a du vent et il pleut.',
              'Il y a du vent, il pleut.',
            ],
            ['fr-le-vent', 'fr-il-pleut'],
            { id: 'fr.ex.lnzc6hhqymagqo' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Les saisons',
        objective: 'Nombrar las estaciones y decir qué tiempo hace en cada una.',
        intro: {
          explanation:
            "Las cuatro estaciones son masculinas: le printemps (la primavera, ¡masculino!), l'été, l'automne, l'hiver. «En verano» es en été, y lo mismo en automne, en hiver: la n de en se une a la vocal siguiente (liaison). Pero printemps empieza con consonante: au printemps. En automne, la m no suena.",
          examples: [
            { target: 'En hiver, il neige.', base: 'En invierno nieva.' },
            { target: 'Au printemps, il fait beau.', base: 'En primavera hace buen tiempo.' },
          ],
        },
        takeaways: [
          "Nombras le printemps, l'été, l'automne y l'hiver.",
          'Dices en été, en automne, en hiver, pero au printemps.',
        ],
        exercises: [
          ex.translationChoice(
            "l'hiver",
            'el invierno',
            ['el verano', 'el otoño', 'la primavera'],
            ['fr-l-hiver'],
            { id: 'fr.ex.nb8my6jfals29v' },
          ),
          ex.matchPairs(
            [
              ['le printemps', 'la primavera'],
              ["l'été", 'el verano'],
              ["l'automne", 'el otoño'],
              ["l'hiver", 'el invierno'],
            ],
            ['fr-le-printemps', 'fr-l-ete', 'fr-l-automne', 'fr-l-hiver'],
            { id: 'fr.ex.74w4kr9jojy0nh' },
          ),
          ex.listenChoice(
            'En été, il fait chaud.',
            ['En hiver, il fait chaud.', 'En été, il fait froid.', 'En automne, il fait chaud.'],
            ['fr-l-ete', 'fr-l-hiver', 'fr-l-automne'],
            {
              id: 'fr.ex.tgcsmh4618yd6g',
              explanation:
                'En été y en hiver se unen con liaison: la n de en suena pegada a la vocal.',
            },
          ),
          ex.fillBlank(
            '___ printemps, il fait beau.',
            'En primavera hace buen tiempo.',
            'Au',
            ['En', 'Le', 'À'],
            ['fr-le-printemps'],
            {
              id: 'fr.ex.ctju07rdfbokte',
              explanation:
                'Printemps empieza con consonante: au printemps. Las otras estaciones van con en.',
            },
          ),
          ex.fillBlank(
            'En ___, il neige.',
            'En invierno nieva.',
            'hiver',
            ['été', 'printemps', 'automne'],
            ['fr-l-hiver', 'fr-il-neige'],
            { id: 'fr.ex.g3ce38pjc96v0o', skill: 'vocabulary' },
          ),
          ex.translationChoice(
            "l'automne",
            'el otoño',
            ['el invierno', 'el verano', 'la montaña'],
            ['fr-l-automne'],
            { id: 'fr.ex.ktd6xnzq9ka4ef' },
          ),
          ex.fillBlank(
            'En automne, il y a ___ pluie.',
            'En otoño hay mucha lluvia.',
            'beaucoup de',
            ['très', 'beaucoup'],
            ['fr-l-automne', 'fr-la-pluie'],
            {
              id: 'fr.ex.vod2ma7g8uwufi',
              explanation:
                'Mucho + sustantivo es beaucoup de: beaucoup de pluie. Très va con adjetivos.',
            },
          ),
          ex.orderWords('En été il fait très chaud.', 'En verano hace mucho calor.', ['fr-l-ete'], {
            id: 'fr.ex.kfwvrgdrtmxtqz',
          }),
          ex.translateWrite(
            'En otoño llueve.',
            'En automne, il pleut.',
            ['fr-l-automne', 'fr-il-pleut'],
            {
              id: 'fr.ex.d8afeyutnpkbqi',
              acceptedAnswers: ['Il pleut en automne.', 'En automne il pleut.'],
            },
          ),
          ex.shortAnswer(
            'Quel temps fait-il en hiver?',
            '¿Qué tiempo hace en invierno? (Responde que hace frío y nieva.)',
            'Il fait froid et il neige.',
            ['En hiver, il fait froid et il neige.', 'Il neige et il fait froid.'],
            ['fr-l-hiver', 'fr-il-neige'],
            { id: 'fr.ex.8w3b29tn4zzkue' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'La mer ou la montagne?',
        objective: 'Hablar de la playa, el mar y la montaña, y decir qué prefieres.',
        intro: {
          explanation:
            'Ojo con el género: la mer (el mar) es femenino en francés. Mer y mère (madre) suenan igual. La montagne es la montaña y la plage, la playa. Para decir adónde vas: je vais à la mer, à la montagne, à la plage. Para elegir: tu préfères la mer ou la montagne?',
          examples: [
            { target: 'En été, je vais à la mer.', base: 'En verano voy al mar.' },
            {
              target: 'Nous allons à la montagne en hiver.',
              base: 'En invierno vamos a la montaña.',
            },
          ],
        },
        takeaways: [
          'Dices la mer, la montagne y la plage, todas femeninas.',
          'Cuentas adónde vas con je vais à la…',
        ],
        exercises: [
          ex.translationChoice(
            'la mer',
            'el mar',
            ['la madre', 'la montaña', 'la playa'],
            ['fr-la-mer'],
            {
              id: 'fr.ex.c1r5ssx8tfwrnw',
              explanation: 'La mer es el mar (femenino). La madre es la mère: suenan igual.',
            },
          ),
          ex.fillBlank(
            'Je vais à ___ mer.',
            'Voy al mar.',
            'la',
            ['le', 'les', 'un'],
            ['fr-la-mer'],
            {
              id: 'fr.ex.o8k5v5jm5tj18o',
              explanation: 'Mer es femenino en francés: à la mer.',
            },
          ),
          ex.listenChoice(
            'Je vais à la plage.',
            ['Je vais à la mer.', 'Je vais à la montagne.', 'Je vais à la gare.'],
            ['fr-la-plage', 'fr-la-mer', 'fr-la-montagne'],
            { id: 'fr.ex.wworifgozqgose' },
          ),
          ex.matchPairs(
            [
              ['la mer', 'el mar'],
              ['la montagne', 'la montaña'],
              ['la plage', 'la playa'],
              ['le soleil', 'el sol'],
            ],
            ['fr-la-mer', 'fr-la-montagne', 'fr-la-plage', 'fr-le-soleil'],
            { id: 'fr.ex.k7ce0lzv225knb' },
          ),
          question(
            'fr.ex.zi2v3uqibyq16l',
            VACANCES,
            '¿Qué prefiere Léa?',
            'La montaña.',
            ['El mar.', 'La playa.', 'La ciudad.'],
            ['fr-la-montagne'],
            'Léa responde «La montagne!».',
          ),
          question(
            'fr.ex.d2rr1ogip471ba',
            VACANCES,
            '¿Por qué a Paul le gusta el mar en verano?',
            'Porque hace calor y hay sol.',
            ['Porque hay viento.', 'Porque nieva.', 'Porque llueve poco.'],
            ['fr-il-fait-chaud', 'fr-le-soleil', 'fr-la-mer'],
            'Paul dice «En été, il fait chaud et il y a du soleil».',
          ),
          question(
            'fr.ex.l53jd43enxxugr',
            VACANCES,
            '¿Qué hace Paul cuando llueve?',
            'Va al cine.',
            ['Va a la playa.', 'Va a la montaña.', 'Se queda mirando el mar.'],
            ['fr-il-pleut'],
            'Paul responde «Quand il pleut, je vais au cinéma!».',
          ),
          ex.fillBlank(
            'En hiver, nous allons à la ___: il neige.',
            'En invierno vamos a la montaña: nieva.',
            'montagne',
            ['plage', 'mer'],
            ['fr-la-montagne'],
            { id: 'fr.ex.gwpnk18ncnbi65', skill: 'vocabulary' },
          ),
          ex.translateWrite(
            'En verano voy a la playa.',
            'En été, je vais à la plage.',
            ['fr-l-ete', 'fr-la-plage'],
            {
              id: 'fr.ex.44o18i6qov3ptx',
              acceptedAnswers: ['Je vais à la plage en été.', 'En été je vais à la plage.'],
            },
          ),
          ex.shortAnswer(
            'Tu préfères la mer ou la montagne?',
            '¿Prefieres el mar o la montaña? (Responde que prefieres el mar.)',
            'Je préfère la mer.',
            ['La mer.', 'Je préfère la mer!', 'La mer!'],
            ['fr-la-mer', 'fr-la-montagne'],
            { id: 'fr.ex.31y2hiybrzg9op' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Julio: ¿verano o invierno?',
        objective: 'Describir el clima de un lugar y entender la diferencia de hemisferios.',
        intro: {
          explanation:
            'Francia está en el hemisferio norte: allí julio y agosto son verano y hace calor, mientras que en la Argentina es invierno. Por eso un francés dice en juillet, il fait chaud, y tú, en juillet, il fait froid. Recuerda: il fait + adjetivo, il pleut, il neige, il y a du soleil / du vent.',
          examples: [
            {
              target: 'En France, il fait chaud en juillet.',
              base: 'En Francia hace calor en julio.',
            },
            {
              target: "En Argentine, en juillet, c'est l'hiver.",
              base: 'En la Argentina, en julio, es invierno.',
            },
          ],
        },
        takeaways: [
          'Describes el clima de un lugar y de una estación.',
          'Sabes que en julio es verano en Francia e invierno en la Argentina.',
        ],
        exercises: [
          question(
            'fr.ex.kcagurw5g67zfn',
            CARTE,
            '¿Qué estación es en Marsella?',
            'Verano.',
            ['Invierno.', 'Primavera.', 'Otoño.'],
            ['fr-l-ete'],
            "Claire escribe «C'est l'été».",
          ),
          question(
            'fr.ex.lwij9u4cy3u6ys',
            CARTE,
            '¿Qué tiempo hace en Marsella?',
            'Hace mucho calor y hay sol.',
            ['Hace frío y llueve.', 'Hay viento y hace mal tiempo.', 'Hace calor, pero llueve.'],
            ['fr-il-fait-chaud', 'fr-le-soleil'],
            'La postal dice «il fait très chaud et il y a du soleil».',
          ),
          question(
            'fr.ex.2ewqowyoqa21q2',
            CARTE,
            '¿Por qué Claire cree que en Buenos Aires hace frío?',
            'Porque en julio es invierno en el hemisferio sur.',
            [
              'Porque en Buenos Aires siempre nieva.',
              'Porque Ana se lo dijo.',
              'Porque en julio llueve mucho.',
            ],
            ['fr-il-fait-froid'],
            'Claire pregunta «Il fait froid en juillet, non?»: en julio es invierno en la Argentina.',
          ),
          ex.listenChoice(
            'En hiver, il neige à la montagne.',
            [
              'En hiver, il pleut à la montagne.',
              'En été, il neige à la montagne.',
              'En hiver, il neige à la mer.',
            ],
            ['fr-il-neige', 'fr-la-montagne'],
            { id: 'fr.ex.kkifv1ohvflhpn' },
          ),
          ex.fillBlank(
            'En Argentine, en juillet, il fait ___.',
            'En la Argentina, en julio, hace frío.',
            'froid',
            ['chaud', 'froide'],
            ['fr-il-fait-froid'],
            {
              id: 'fr.ex.2jn4g0p6gnudgh',
              explanation:
                'En el hemisferio sur, julio es invierno: il fait froid (sin concordancia).',
            },
          ),
          ex.translationChoice(
            'il fait mauvais',
            'hace mal tiempo',
            ['hace buen tiempo', 'hace calor', 'llueve'],
            ['fr-il-fait-mauvais'],
            { id: 'fr.ex.ky3xusxlvwirw7' },
          ),
          ex.fillBlank(
            '___ fait-il? — Il y a du vent.',
            '¿Qué tiempo hace? — Hay viento.',
            'Quel temps',
            ['Quelle heure', 'Quel âge'],
            ['fr-quel-temps-fait-il', 'fr-le-vent'],
            { id: 'fr.ex.psko3zste7ud71', skill: 'vocabulary' },
          ),
          ex.orderWords(
            'La mer est belle en été.',
            'El mar es lindo en verano.',
            ['fr-la-mer', 'fr-l-ete'],
            {
              id: 'fr.ex.1zjqyp7w92qxc5',
              explanation: 'Mer es femenino: la mer est belle.',
            },
          ),
          ex.translateWrite(
            'En primavera hace buen tiempo.',
            'Au printemps, il fait beau.',
            ['fr-le-printemps', 'fr-il-fait-beau'],
            {
              id: 'fr.ex.sq7j0a5b65w1gc',
              acceptedAnswers: ['Il fait beau au printemps.', 'Au printemps il fait beau.'],
            },
          ),
          ex.shortAnswer(
            "Quel temps fait-il aujourd'hui?",
            '¿Qué tiempo hace hoy? (Responde que hace buen tiempo y hay sol.)',
            'Il fait beau et il y a du soleil.',
            [
              "Aujourd'hui, il fait beau et il y a du soleil.",
              'Il y a du soleil et il fait beau.',
              'Il fait beau, il y a du soleil.',
            ],
            ['fr-il-fait-beau', 'fr-le-soleil'],
            { id: 'fr.ex.tv9zokrb6nfco0' },
          ),
        ],
      },
    ],
  },
};
