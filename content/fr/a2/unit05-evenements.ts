import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Francés A2 U5 «¿Qué pasó? Contar un hecho» (docs/FR_A1_A2.md): preguntar qué pasó y contar un
 * hecho (un robo, una pérdida, un accidente) con la escena, lo que pasó y la consecuencia.
 * Gramática: imparfait para la escena (il pleuvait, j'étais en train de…) y passé composé para el
 * hecho (soudain, j'ai vu…); pendant que, alors, tout à coup; heureusement / malheureusement; être en
 * train de + infinitivo. Pronunciación: il pleut / il pleuvait, je regardais / j'ai regardé,
 * le voisin / la voisine (vocal nasal frente a n que suena). Falso amigo: voler es robar (y volar).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const METRO = dialogue(
  'fr.stim.a2-u5-metro',
  'Sarah se encuentra con su amigo Marc, que está preocupado.',
  [
    ['Sarah', "Qu'est-ce qui s'est passé, Marc?"],
    ['Marc', "On m'a volé mon portefeuille dans le métro!"],
    ['Sarah', 'Oh non! Quand?'],
    [
      'Marc',
      "Ce matin. Il y avait beaucoup de gens et j'étais en train de lire. Tout à coup, quelqu'un a pris mon portefeuille dans mon sac.",
    ],
    ['Sarah', 'Tu as appelé la police?'],
    ['Marc', 'Oui. Heureusement, mon téléphone était dans ma poche.'],
  ],
);

const ACCIDENT = reading(
  'fr.stim.a2-u5-accident',
  'message',
  'Julie le cuenta a Camille lo que vio anoche.',
  [
    'Salut Camille!',
    'Hier soir, il pleuvait et je rentrais à la maison à pied.',
    "Soudain, j'ai vu un accident devant la boulangerie: une voiture et un vélo.",
    "J'ai eu très peur! Alors, j'ai appelé la police.",
    "Heureusement, le monsieur du vélo n'était pas blessé.",
    "Mon voisin Paul est venu m'aider.",
    'Bisous, Julie',
  ],
  { from: 'Julie', to: 'Camille' },
);

export const FR_A2_U05: FrUnitDef = {
  names: ['Sarah', 'Marc', 'Julie', 'Camille', 'Paul', 'Lyon', 'Paris'],
  support: [
    'perdu',
    'volé',
    'appelé',
    'eu',
    'dormais',
    'regardais',
    'rentrais',
    'faisait',
    'gens',
    'poche',
    'oh',
    'blessé',
    'aider',
    'bisous',
    'travailler',
  ],
  unit: {
    position: 5,
    title: '¿Qué pasó? Contar un hecho',
    titleEn: "Qu'est-ce qui s'est passé?",
    description:
      "Contar un hecho: imparfait para la escena (il pleuvait, j'étais en train de…) y passé composé para lo que pasó (soudain, tout à coup, alors).",
    emoji: '📰',
    objective:
      'Puedes preguntar qué pasó y contar un hecho (un robo, una pérdida, un accidente): cómo era la escena, qué pasó de repente, qué hiciste y cómo terminó.',
    grammar: {
      title: 'Imparfait y passé composé: la escena y el hecho',
      explanation:
        "Para contar algo que pasó se combinan los dos pasados, como en español «llovía cuando vi…». El imparfait pinta la escena, lo que estaba pasando: il pleuvait, j'étais en train de lire (estaba leyendo: être en train de + infinitivo), pendant que je dormais (mientras dormía). El passé composé cuenta el hecho puntual, a menudo con soudain o tout à coup (de repente): j'ai vu un accident, quelqu'un a volé mon sac. Alors (entonces) introduce la consecuencia, y heureusement / malheureusement, tu comentario. Ojo: je regardais y j'ai regardé suenan distinto (e abierta al final frente a j'ai delante).",
      examples: [
        {
          target: "Il pleuvait. Soudain, j'ai vu un accident.",
          base: 'Llovía. De repente, vi un accidente.',
        },
        {
          target: "J'étais en train de lire quand quelqu'un est arrivé.",
          base: 'Estaba leyendo cuando llegó alguien.',
        },
        {
          target: "J'ai eu peur, alors j'ai appelé la police.",
          base: 'Tuve miedo, entonces llamé a la policía.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        "A2 nuevo (U5). Sin revisión nativa: revisar «on m'a volé» traducido como «me robaron», el uso de alors con coma y «l'accident est arrivé» (pasó) en la última producción.",
    },
    words: [
      w(
        'fr-qu-est-ce-qui-s-est-passe',
        "qu'est-ce qui s'est passé?",
        '¿qué pasó?',
        "Qu'est-ce qui s'est passé, Marc?",
        '¿Qué pasó, Marc?',
        ['questions', 'past'],
        { acceptedTranslations: ['¿qué sucedió?'] },
      ),
      w(
        'fr-soudain',
        'soudain',
        'de repente',
        "Soudain, j'ai vu un accident.",
        'De repente, vi un accidente.',
        ['sequence'],
      ),
      w(
        'fr-tout-a-coup',
        'tout à coup',
        'de golpe',
        "Tout à coup, quelqu'un a volé mon sac.",
        'De golpe, alguien me robó el bolso.',
        ['sequence'],
        { acceptedTranslations: ['de pronto'] },
      ),
      w(
        'fr-pendant-que',
        'pendant que',
        'mientras',
        'Pendant que je dormais, il pleuvait.',
        'Mientras dormía, llovía.',
        ['sequence'],
      ),
      w(
        'fr-etre-en-train-de',
        'être en train de',
        'estar haciendo algo',
        "J'étais en train de lire quand tu as appelé.",
        'Estaba leyendo cuando llamaste.',
        ['verbs'],
        { acceptedTranslations: ['estar + gerundio'] },
      ),
      w(
        'fr-alors',
        'alors',
        'entonces',
        "J'ai eu peur, alors j'ai appelé la police.",
        'Tuve miedo, entonces llamé a la policía.',
        ['sequence'],
      ),
      w(
        'fr-heureusement',
        'heureusement',
        'por suerte',
        'Heureusement, mon téléphone était dans mon sac.',
        'Por suerte, mi teléfono estaba en el bolso.',
        ['sequence'],
        { acceptedTranslations: ['afortunadamente'] },
      ),
      w(
        'fr-malheureusement',
        'malheureusement',
        'lamentablemente',
        "Malheureusement, j'ai perdu mon passeport.",
        'Lamentablemente, perdí el pasaporte.',
        ['sequence'],
        { acceptedTranslations: ['por desgracia'] },
      ),
      w(
        'fr-l-accident',
        "l'accident",
        'el accidente',
        'Il y a eu un accident devant la gare.',
        'Hubo un accidente frente a la estación.',
        ['events', 'm'],
        { emoji: '💥' },
      ),
      w('fr-perdre', 'perdre', 'perder', 'Je déteste perdre mes clés.', 'Odio perder las llaves.', [
        'verbs',
      ]),
      w(
        'fr-voler',
        'voler',
        'robar',
        "Quelqu'un a volé mon vélo.",
        'Alguien me robó la bici.',
        ['verbs'],
        { acceptedTranslations: ['volar'] },
      ),
      w(
        'fr-le-portefeuille',
        'le portefeuille',
        'la billetera',
        "On m'a volé mon portefeuille!",
        '¡Me robaron la billetera!',
        ['objects', 'm'],
        { acceptedTranslations: ['la cartera'], emoji: '👛' },
      ),
      w(
        'fr-la-police',
        'la police',
        'la policía',
        "J'ai appelé la police.",
        'Llamé a la policía.',
        ['events', 'f'],
        { emoji: '🚓' },
      ),
      w(
        'fr-il-pleuvait',
        'il pleuvait',
        'llovía',
        'Il pleuvait et il faisait froid.',
        'Llovía y hacía frío.',
        ['weather', 'imparfait'],
        { acceptedTranslations: ['estaba lloviendo'] },
      ),
      w(
        'fr-quelqu-un',
        "quelqu'un",
        'alguien',
        "Quelqu'un a pris mon portefeuille.",
        'Alguien se llevó mi billetera.',
        ['basics'],
      ),
      w(
        'fr-avoir-peur',
        'avoir peur',
        'tener miedo',
        'Les enfants ont peur du chien.',
        'Los chicos le tienen miedo al perro.',
        ['feelings'],
      ),
      w(
        'fr-le-voisin',
        'le voisin',
        'el vecino',
        'Ma voisine a appelé la police.',
        'Mi vecina llamó a la policía.',
        ['people'],
        { acceptedTranslations: ['la vecina'], acceptedTexts: ['la voisine'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿Qué pasó?',
        objective: 'Preguntar qué pasó y contar una pérdida o un robo.',
        intro: {
          explanation:
            "Para preguntar qué pasó: qu'est-ce qui s'est passé? El hecho se cuenta en passé composé: j'ai perdu (perdre, perder) y on m'a volé (me robaron; on sirve para alguien que no conoces). Falso amigo: voler es robar, y también volar. Le portefeuille es la billetera, y la police, la policía.",
          examples: [
            {
              target: "Qu'est-ce qui s'est passé? — J'ai perdu mon portefeuille.",
              base: '¿Qué pasó? — Perdí la billetera.',
            },
            { target: "On m'a volé mon téléphone!", base: '¡Me robaron el teléfono!' },
          ],
        },
        takeaways: [
          "Preguntas qu'est-ce qui s'est passé?",
          "Cuentas una pérdida con j'ai perdu y un robo con on m'a volé.",
        ],
        exercises: [
          ex.translationChoice(
            "qu'est-ce qui s'est passé?",
            '¿qué pasó?',
            ['¿qué es esto?', '¿qué hora es?', '¿a qué te dedicas?'],
            ['fr-qu-est-ce-qui-s-est-passe'],
            { id: 'fr.ex.o614p3wb98yekj' },
          ),
          ex.translationChoice('voler', 'robar', ['perder', 'buscar', 'llamar'], ['fr-voler'], {
            id: 'fr.ex.dp525y47v3oeuw',
            explanation: 'Voler es robar y también volar: el contexto lo aclara.',
          }),
          ex.matchPairs(
            [
              ['perdre', 'perder'],
              ['voler', 'robar'],
              ['le portefeuille', 'la billetera'],
              ['la police', 'la policía'],
            ],
            ['fr-perdre', 'fr-voler', 'fr-le-portefeuille', 'fr-la-police'],
            { id: 'fr.ex.ulh0txwo8b7ra0' },
          ),
          ex.listenChoice(
            "J'ai perdu mon portefeuille.",
            ["J'ai perdu mon passeport.", "J'ai perdu mon téléphone."],
            ['fr-perdre', 'fr-le-portefeuille'],
            { id: 'fr.ex.4up89ermpzcyeq' },
          ),
          ex.fillBlank(
            "On m'a ___ mon portefeuille!",
            '¡Me robaron la billetera!',
            'volé',
            ['voler', 'vol', 'perdre'],
            ['fr-voler', 'fr-le-portefeuille'],
            {
              id: 'fr.ex.b4lciyycwcwnih',
              explanation: "Passé composé de voler: on m'a volé. Le vol, además, es el vuelo.",
            },
          ),
          ex.fillBlank(
            "J'ai ___ mes clés.",
            'Perdí mis llaves.',
            'perdu',
            ['perdre', 'volé', 'venu'],
            ['fr-perdre'],
            {
              id: 'fr.ex.y0kuy2xjeeuczq',
              explanation: "El participio de perdre es perdu: j'ai perdu.",
            },
          ),
          ex.imageChoice(
            '👛',
            'le portefeuille',
            ['le passeport', 'la valise', 'la clé'],
            ['fr-le-portefeuille'],
            { id: 'fr.ex.p09f3eu9gs5vid' },
          ),
          ex.orderWords(
            "Qu'est-ce qui s'est passé hier?",
            '¿Qué pasó ayer?',
            ['fr-qu-est-ce-qui-s-est-passe'],
            { id: 'fr.ex.9oi8wma4irf090' },
          ),
          ex.translateWrite(
            'Perdí la billetera.',
            "J'ai perdu mon portefeuille.",
            ['fr-perdre', 'fr-le-portefeuille'],
            { id: 'fr.ex.9z2l1sw55t4kxc', acceptedAnswers: ["J'ai perdu le portefeuille."] },
          ),
          ex.shortAnswer(
            "Qu'est-ce qui s'est passé?",
            '¿Qué pasó? (Responde que te robaron la billetera.)',
            "On m'a volé mon portefeuille.",
            ["On m'a volé mon portefeuille!", "Quelqu'un a volé mon portefeuille."],
            ['fr-voler', 'fr-le-portefeuille'],
            { id: 'fr.ex.als35jnczhdfqs' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'La escena',
        objective: 'Describir qué estaba pasando cuando ocurrió algo.',
        intro: {
          explanation:
            "La escena de un relato va en imparfait: il pleuvait (llovía; en presente, il pleut), il faisait froid. Para una acción en curso: être en train de + infinitivo (j'étais en train de lire, estaba leyendo). Pendant que es mientras: pendant que je dormais. Quelqu'un es alguien.",
          examples: [
            { target: 'Il pleuvait et il faisait froid.', base: 'Llovía y hacía frío.' },
            {
              target: "J'étais en train de lire quand quelqu'un est arrivé.",
              base: 'Estaba leyendo cuando llegó alguien.',
            },
          ],
        },
        takeaways: [
          'Describes la escena con el imparfait: il pleuvait.',
          'Dices qué estabas haciendo con être en train de.',
        ],
        exercises: [
          ex.translationChoice(
            'il pleuvait',
            'llovía',
            ['llueve', 'nevaba', 'hacía frío'],
            ['fr-il-pleuvait'],
            { id: 'fr.ex.pn6d1x9cr7nla7' },
          ),
          ex.listenChoice('Il pleuvait.', ['Il pleut.', 'Il neige.'], ['fr-il-pleuvait'], {
            id: 'fr.ex.9g2dzc61hs71mb',
            explanation: 'Il pleut es presente; il pleuvait, imparfait, tiene una sílaba más.',
          }),
          ex.translationChoice(
            "quelqu'un",
            'alguien',
            ['nadie', 'algo', 'cada uno'],
            ['fr-quelqu-un'],
            { id: 'fr.ex.0092mn4gwxep2o' },
          ),
          ex.fillBlank(
            "J'étais en ___ de lire.",
            'Estaba leyendo.',
            'train',
            ['temps', 'retard', 'vacances'],
            ['fr-etre-en-train-de'],
            {
              id: 'fr.ex.o9ule9np5q95g5',
              skill: 'vocabulary',
              explanation: 'La expresión es être en train de + infinitivo: estar haciendo algo.',
            },
          ),
          ex.fillBlank(
            "___ je dormais, quelqu'un a volé mon vélo.",
            'Mientras dormía, alguien me robó la bici.',
            'Pendant que',
            ['Parce que', 'Pourquoi', "Qu'est-ce que"],
            ['fr-pendant-que', 'fr-quelqu-un'],
            {
              id: 'fr.ex.iuhzrv9yjgj1ml',
              skill: 'vocabulary',
              explanation: 'Mientras: pendant que.',
            },
          ),
          ex.matchPairs(
            [
              ['il pleuvait', 'llovía'],
              ['pendant que', 'mientras'],
              ["quelqu'un", 'alguien'],
              ['être en train de', 'estar haciendo algo'],
            ],
            ['fr-il-pleuvait', 'fr-pendant-que', 'fr-quelqu-un', 'fr-etre-en-train-de'],
            { id: 'fr.ex.pz1xfzvoa6ymf8' },
          ),
          ex.fillBlank(
            'Hier, il ___ et il faisait froid.',
            'Ayer llovía y hacía frío.',
            'pleuvait',
            ['pleut', 'neige', 'pluie'],
            ['fr-il-pleuvait'],
            {
              id: 'fr.ex.8ngjw3a80vaxl7',
              explanation: 'La escena en pasado va en imparfait: il pleuvait.',
            },
          ),
          ex.orderWords(
            'Je suis en train de travailler.',
            'Estoy trabajando.',
            ['fr-etre-en-train-de'],
            {
              id: 'fr.ex.2kujdeaw6m99rc',
            },
          ),
          ex.translateWrite(
            'Estaba leyendo cuando llegó alguien.',
            "J'étais en train de lire quand quelqu'un est arrivé.",
            ['fr-etre-en-train-de', 'fr-quelqu-un'],
            {
              id: 'fr.ex.fxe5qz272jzrsy',
              acceptedAnswers: ["Je lisais quand quelqu'un est arrivé."],
            },
          ),
          ex.shortAnswer(
            'Quel temps faisait-il hier?',
            '¿Qué tiempo hacía ayer? (Responde que llovía.)',
            'Il pleuvait.',
            ['Hier, il pleuvait.', 'Il pleuvait hier.'],
            ['fr-il-pleuvait'],
            { id: 'fr.ex.tgc2poxiaj0cr1' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'De repente',
        objective: 'Contar el hecho que interrumpe la escena y su consecuencia.',
        intro: {
          explanation:
            "Después de la escena, el hecho en passé composé, con soudain o tout à coup (de repente, de golpe). Alors (entonces) da la consecuencia. Avoir peur es tener miedo, con avoir como en español; en pasado, j'ai eu peur. Soudain termina en vocal nasal, como vin: la n no se pronuncia.",
          examples: [
            {
              target: "Il pleuvait. Soudain, j'ai vu un accident.",
              base: 'Llovía. De repente, vi un accidente.',
            },
            {
              target: "J'ai eu peur, alors j'ai appelé la police.",
              base: 'Tuve miedo, entonces llamé a la policía.',
            },
          ],
        },
        takeaways: [
          'Marcas el hecho con soudain o tout à coup.',
          "Cuentas la consecuencia con alors y dices j'ai eu peur.",
        ],
        exercises: [
          ex.translationChoice(
            'soudain',
            'de repente',
            ['entonces', 'mientras', 'por suerte'],
            ['fr-soudain'],
            { id: 'fr.ex.zfllr286t9aywf' },
          ),
          ex.translationChoice('alors', 'entonces', ['de golpe', 'antes', 'ahora'], ['fr-alors'], {
            id: 'fr.ex.u3yyn5hh8wa94o',
          }),
          ex.listenChoice(
            "Soudain, j'ai vu un accident.",
            ["Souvent, j'ai vu un accident.", "Soudain, j'ai eu un accident."],
            ['fr-soudain', 'fr-l-accident'],
            {
              id: 'fr.ex.8j35abdsutedjy',
              explanation:
                'Soudain (de repente) termina en vocal nasal; souvent (seguido), en otra nasal, como vent.',
            },
          ),
          ex.fillBlank(
            "Il pleuvait. ___, j'ai vu un accident.",
            'Llovía. De golpe, vi un accidente.',
            'Tout à coup',
            ['Pendant que', 'Parce que', 'Avant'],
            ['fr-tout-a-coup', 'fr-l-accident'],
            {
              id: 'fr.ex.cqf93fmqms6dym',
              skill: 'vocabulary',
              explanation: 'De golpe: tout à coup.',
            },
          ),
          ex.fillBlank(
            "J'ai eu très ___.",
            'Tuve mucho miedo.',
            'peur',
            ['froid', 'peu', 'pluie'],
            ['fr-avoir-peur'],
            {
              id: 'fr.ex.4qzh0d9a9uk0vh',
              skill: 'vocabulary',
              explanation: "Tener miedo: avoir peur; en passé composé, j'ai eu peur.",
            },
          ),
          ex.matchPairs(
            [
              ['soudain', 'de repente'],
              ['tout à coup', 'de golpe'],
              ['alors', 'entonces'],
              ['avoir peur', 'tener miedo'],
            ],
            ['fr-soudain', 'fr-tout-a-coup', 'fr-alors', 'fr-avoir-peur'],
            { id: 'fr.ex.2n8qaru44pzy4n' },
          ),
          ex.fillBlank(
            "J'ai vu ___ accident.",
            'Vi un accidente.',
            'un',
            ['une', 'la', 'des'],
            ['fr-l-accident'],
            {
              id: 'fr.ex.5b30ksvpltjvza',
              explanation: "Accident es masculino: un accident, l'accident.",
            },
          ),
          ex.orderWords(
            "Alors j'ai appelé la police.",
            'Entonces llamé a la policía.',
            ['fr-alors', 'fr-la-police'],
            {
              id: 'fr.ex.d4oveyggija189',
            },
          ),
          ex.translateWrite(
            'De repente, tuve miedo.',
            "Soudain, j'ai eu peur.",
            ['fr-soudain', 'fr-avoir-peur'],
            {
              id: 'fr.ex.0qaissn1fswdye',
              acceptedAnswers: ["Tout à coup, j'ai eu peur.", "Soudain j'ai eu peur."],
            },
          ),
          ex.shortAnswer(
            "Qu'est-ce que tu as vu?",
            '¿Qué viste? (Responde que viste un accidente.)',
            "J'ai vu un accident.",
            ['Un accident.', "J'ai vu un accident!"],
            ['fr-l-accident'],
            { id: 'fr.ex.q5t5fgj2g4jwak' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Por suerte',
        objective: 'Comentar lo que pasó y entender un relato oral.',
        intro: {
          explanation:
            'Heureusement (por suerte) y malheureusement (lamentablemente) comentan lo que pasó; la h no suena y eu se pronuncia con los labios redondeados. Le voisin es el vecino; la voisine, la vecina. En voisin la n no suena (vocal nasal); en voisine sí se pronuncia.',
          examples: [
            {
              target: 'Heureusement, mon téléphone était dans mon sac.',
              base: 'Por suerte, mi teléfono estaba en el bolso.',
            },
            { target: 'Malheureusement, il pleuvait.', base: 'Lamentablemente, llovía.' },
          ],
        },
        takeaways: [
          'Comentas con heureusement o malheureusement.',
          'Hablas de le voisin y la voisine.',
        ],
        exercises: [
          ex.translationChoice(
            'heureusement',
            'por suerte',
            ['lamentablemente', 'de repente', 'entonces'],
            ['fr-heureusement'],
            { id: 'fr.ex.ybf0u297p3h9kl' },
          ),
          ex.listenChoice(
            "C'est mon voisin.",
            ["C'est ma voisine.", "C'est mon cousin."],
            ['fr-le-voisin'],
            {
              id: 'fr.ex.jj3apgmp5zncq9',
              explanation: 'En voisin la n no suena (vocal nasal); en voisine, sí.',
            },
          ),
          ex.fillBlank(
            "___, j'ai perdu mon portefeuille.",
            'Lamentablemente, perdí la billetera.',
            'Malheureusement',
            ['Heureusement', 'Soudain', 'Pendant que'],
            ['fr-malheureusement'],
            {
              id: 'fr.ex.td9vj8p1jst4wf',
              skill: 'vocabulary',
              explanation: 'Mal- le da el sentido negativo: malheureusement, lamentablemente.',
            },
          ),
          ex.fillBlank(
            'Ma ___ a appelé la police.',
            'Mi vecina llamó a la policía.',
            'voisine',
            ['voisin', 'cousin', 'voiture'],
            ['fr-le-voisin', 'fr-la-police'],
            { id: 'fr.ex.uc8tc258bqdu01', explanation: 'Con ma va el femenino: ma voisine.' },
          ),
          ex.matchPairs(
            [
              ['heureusement', 'por suerte'],
              ['malheureusement', 'lamentablemente'],
              ['le voisin', 'el vecino'],
              ['la police', 'la policía'],
            ],
            ['fr-heureusement', 'fr-malheureusement', 'fr-le-voisin', 'fr-la-police'],
            { id: 'fr.ex.3hj4q9ob6u7k7x' },
          ),
          question(
            'fr.ex.09gogshjvtd5ub',
            METRO,
            '¿Qué le robaron a Marc?',
            'La billetera.',
            ['El teléfono.', 'El bolso.', 'El pasaje de metro.'],
            ['fr-voler', 'fr-le-portefeuille'],
            "Marc dice «On m'a volé mon portefeuille dans le métro!».",
          ),
          question(
            'fr.ex.k3jp08ph2oa0or',
            METRO,
            '¿Qué estaba haciendo Marc cuando pasó?',
            'Estaba leyendo.',
            ['Estaba durmiendo.', 'Estaba hablando por teléfono.', 'Estaba comiendo.'],
            ['fr-etre-en-train-de'],
            "Cuenta «j'étais en train de lire».",
          ),
          question(
            'fr.ex.nz5ozhbaqdiki9',
            METRO,
            '¿Por qué dice Marc «heureusement»?',
            'Porque el teléfono estaba en su bolsillo y no se lo robaron.',
            [
              'Porque encontró la billetera.',
              'Porque la policía atrapó al ladrón.',
              'Porque no había gente en el metro.',
            ],
            ['fr-heureusement'],
            'Dice «Heureusement, mon téléphone était dans ma poche»: a la billetera la sacaron del bolso.',
          ),
          ex.translateWrite(
            'Por suerte, mi vecino llamó a la policía.',
            'Heureusement, mon voisin a appelé la police.',
            ['fr-heureusement', 'fr-le-voisin', 'fr-la-police'],
            {
              id: 'fr.ex.6b1nsl0itx3t72',
              acceptedAnswers: ['Heureusement mon voisin a appelé la police.'],
            },
          ),
          ex.shortAnswer(
            'Tu as appelé la police?',
            '¿Llamaste a la policía? (Responde que sí.)',
            "Oui, j'ai appelé la police.",
            ["Oui, j'ai appelé la police!", "Oui, j'ai appelé la police, merci."],
            ['fr-la-police'],
            { id: 'fr.ex.di0ldnv3njgtcv' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Contar un hecho',
        objective: 'Contar un hecho completo, de la escena al final.',
        intro: {
          explanation:
            "Un relato completo tiene cuatro partes: la escena en imparfait (il pleuvait, pendant que je rentrais…), el hecho en passé composé (soudain, j'ai vu…), la consecuencia (alors, j'ai appelé…) y tu comentario (heureusement…). Escucha bien: je rentrais (imparfait) y je suis rentré (passé composé) no suenan igual.",
          examples: [
            {
              target: 'Pendant que je rentrais à la maison, il pleuvait.',
              base: 'Mientras volvía a casa, llovía.',
            },
            {
              target: "Tout à coup, quelqu'un a volé mon sac.",
              base: 'De golpe, alguien me robó el bolso.',
            },
          ],
        },
        takeaways: [
          'Ordenas un relato: escena, hecho, consecuencia y comentario.',
          'Eliges imparfait para la escena y passé composé para el hecho.',
        ],
        exercises: [
          ex.listenChoice(
            'Il pleuvait quand je suis rentré.',
            ['Il pleuvait quand je suis arrivé.', 'Il pleuvait quand je suis parti.'],
            ['fr-il-pleuvait'],
            { id: 'fr.ex.niso8qs69l7j2o' },
          ),
          ex.listenChoice(
            "Je regardais un film quand quelqu'un est arrivé.",
            [
              "J'ai regardé un film quand quelqu'un est arrivé.",
              "Je regardais un film quand quelqu'un est parti.",
            ],
            ['fr-quelqu-un'],
            {
              id: 'fr.ex.7bqvxfcefmw54c',
              explanation:
                "Je regardais (imparfait) termina en e abierta; en j'ai regardé se oye el j'ai delante. La escena va en imparfait.",
            },
          ),
          ex.fillBlank(
            'Pendant que je ___ à la maison, il pleuvait.',
            'Mientras volvía a casa, llovía.',
            'rentrais',
            ['suis rentré', 'rentrer'],
            ['fr-pendant-que', 'fr-il-pleuvait'],
            {
              id: 'fr.ex.y7ibtlyj20dihz',
              explanation:
                'Con pendant que se describe lo que estaba pasando: imparfait, je rentrais.',
            },
          ),
          question(
            'fr.ex.i9o2gcge0k7y1y',
            ACCIDENT,
            '¿Qué tiempo hacía cuando Julie volvía a casa?',
            'Llovía.',
            ['Hacía mucho calor.', 'Nevaba.', 'Hacía sol.'],
            ['fr-il-pleuvait'],
            'Escribe «Hier soir, il pleuvait».',
          ),
          question(
            'fr.ex.z2brc6kzp7gjjk',
            ACCIDENT,
            '¿Qué vio Julie?',
            'Un accidente entre un auto y una bici.',
            [
              'Un robo en la panadería.',
              'Un accidente entre dos autos.',
              'A la policía en la calle.',
            ],
            ['fr-soudain', 'fr-l-accident'],
            "Cuenta «Soudain, j'ai vu un accident devant la boulangerie: une voiture et un vélo».",
          ),
          question(
            'fr.ex.rx2pe2hvm9r4cj',
            ACCIDENT,
            '¿Qué hizo Julie después?',
            'Llamó a la policía.',
            ['Se fue corriendo a su casa.', 'Llamó a Camille.', 'Nada, porque tenía miedo.'],
            ['fr-alors', 'fr-la-police', 'fr-avoir-peur'],
            "Escribe «J'ai eu très peur! Alors, j'ai appelé la police».",
          ),
          question(
            'fr.ex.tkip62ynbb69pi',
            ACCIDENT,
            '¿Cómo terminó la historia?',
            'Bien: el señor de la bici no estaba herido y el vecino de Julie la ayudó.',
            [
              'Mal: el señor de la bici estaba herido.',
              'La policía no vino.',
              'El vecino de Julie tuvo el accidente.',
            ],
            ['fr-heureusement', 'fr-le-voisin'],
            "Dice «Heureusement, le monsieur du vélo n'était pas blessé» y «Mon voisin Paul est venu m'aider».",
          ),
          ex.orderWords(
            "Tout à coup quelqu'un a volé mon sac.",
            'De golpe, alguien me robó el bolso.',
            ['fr-tout-a-coup', 'fr-quelqu-un', 'fr-voler'],
            { id: 'fr.ex.393dplzyah3gwr' },
          ),
          ex.translateWrite(
            'Llovía y, de repente, vi un accidente.',
            "Il pleuvait et, soudain, j'ai vu un accident.",
            ['fr-il-pleuvait', 'fr-soudain', 'fr-l-accident'],
            {
              id: 'fr.ex.qpena7y5gg3cjp',
              acceptedAnswers: [
                "Il pleuvait et soudain j'ai vu un accident.",
                "Il pleuvait. Soudain, j'ai vu un accident.",
                "Il pleuvait et, tout à coup, j'ai vu un accident.",
                "Il pleuvait et tout à coup j'ai vu un accident.",
              ],
            },
          ),
          ex.shortAnswer(
            "Qu'est-ce que tu faisais quand l'accident est arrivé?",
            '¿Qué estabas haciendo cuando pasó el accidente? (Responde que estabas trabajando.)',
            "J'étais en train de travailler.",
            ['Je travaillais.', "J'étais en train de travailler!"],
            ['fr-etre-en-train-de'],
            { id: 'fr.ex.h81l19tzb0hq3m' },
          ),
        ],
      },
    ],
  },
};
