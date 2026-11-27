import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Francés A2 U11 «Relaciones y vida cotidiana» (docs/FR_A1_A2.md): contar la rutina y lo que pasó con
 * verbos pronominales en passé composé (je me suis levée, on s'est rencontrés), los recíprocos
 * (on se voit, ils se disputent), el pronombre y de lugar (j'y vais, on y va), los relativos qui y que
 * y la negación ampliada (ne… jamais, ne… plus, ne… rien, ne… personne). Frecuencia: parfois,
 * rarement. Pronunciación: levé / levée suenan igual; en ils s'entendent se oye la d; liaison en
 * ils‿y vont; rien / bien y la n' de je n'ai. Falso amigo: le copain / la copine (amigo o novio).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const COUPLE = dialogue('fr.stim.a2-u11-couple', 'Antoine le pregunta a Inès por su novio.', [
  ['Antoine', 'Inès, comment est-ce que vous vous êtes rencontrés, Marc et toi?'],
  ['Inès', "On s'est rencontrés à Lyon, il y a deux ans, dans un cours de danse."],
  ['Antoine', 'Et maintenant, vous habitez ensemble?'],
  ['Inès', "Oui, depuis un an. On s'entend très bien."],
  ['Antoine', 'Vous allez vous marier?'],
  ['Inès', "Peut-être l'année prochaine!"],
]);

const POST = reading(
  'fr.stim.a2-u11-post',
  'post',
  'Camille cuenta sus fines de semana en una red social.',
  [
    'Le samedi, je vais à la plage avec ma copine Julie, qui habite à Nice.',
    'On y va en bus.',
    "Le soir, on regarde parfois un film qu'on aime.",
    'Le dimanche, je me réveille tard et je vais chez mes parents.',
    "J'y vais à vélo: ils n'habitent pas loin.",
  ],
  { from: 'Camille' },
);

const FATIGUE = dialogue(
  'fr.stim.a2-u11-fatigue',
  'Sophie habla con su amigo Paul, que está desanimado.',
  [
    ['Sophie', 'Ça va, Paul? Tu es fatigué?'],
    ['Paul', 'Oui. Je ne dors plus bien et je ne vois personne.'],
    ['Sophie', 'Tu veux faire quelque chose ce week-end?'],
    ['Paul', 'Non, je ne veux rien faire. Je reste à la maison.'],
    ['Sophie', 'Tu ne sors jamais! Samedi, on va au cinéma avec Hugo. Tu viens?'],
    ['Paul', "Bon, d'accord. J'y vais avec vous."],
  ],
);

export const FR_A2_U11: FrUnitDef = {
  names: [
    'Claire',
    'Paul',
    'Léa',
    'Hugo',
    'Julie',
    'Marc',
    'Camille',
    'Inès',
    'Antoine',
    'Sophie',
    'Thomas',
    'Lyon',
    'Paris',
    'Marseille',
    'Nice',
  ],
  support: [
    'tôt',
    'marié',
    'marient',
    'dispute',
    'disputent',
    'entends',
    'entend',
    'entendent',
    'voit',
    'parlent',
    'rencontré',
    'habitez',
    'habitent',
    'cours',
    'peut',
    'boit',
    'dors',
    'sors',
    'viens',
    'reste',
  ],
  unit: {
    position: 11,
    title: 'Relaciones y vida cotidiana',
    titleEn: 'Les relations',
    description:
      "Pronominales en passé composé (je me suis levée, on s'est rencontrés), recíprocos, el pronombre y (j'y vais), qui / que y la negación ampliada (ne… jamais, plus, rien, personne).",
    emoji: '🤝',
    objective:
      'Puedes contar tu rutina y lo que hiciste con verbos pronominales, hablar de tus relaciones (cómo se conocieron, si se llevan bien), usar y para un lugar, unir frases con qui y que y negar con ne… jamais, ne… plus, ne… rien y ne… personne.',
    grammar: {
      title: 'Pronominales con être · y · qui / que · ne… jamais',
      explanation:
        "Los verbos pronominales (se lever, se réveiller, se marier, se disputer) forman el passé composé con être, y el participio concuerda con el sujeto: je me suis levé, una mujer escribe je me suis levée y en plural ils se sont mariés (suena igual). Con on = nosotros se suele concordar en plural: on s'est rencontrés. El pronombre y reemplaza un lugar ya nombrado y va antes del verbo: Tu vas à Lyon? — Oui, j'y vais. Qui es el sujeto del verbo que sigue (le copain qui habite à Nice) y que, el objeto (le film que j'ai vu). Como ne… pas, las negaciones ne… jamais (nunca), ne… plus (ya no), ne… rien (nada) y ne… personne (nadie) rodean al verbo: je ne bois jamais de café.",
      examples: [
        { target: 'Hier, je me suis levée tard.', base: 'Ayer me levanté tarde.' },
        {
          target: "Tu vas à Lyon? — Oui, j'y vais demain.",
          base: '¿Vas a Lyon? — Sí, voy mañana.',
        },
        { target: "C'est le copain qui habite à Nice.", base: 'Es el amigo que vive en Niza.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        "A2 nuevo (U11). Sin revisión nativa: revisar la concordancia en plural con on (on s'est rencontrés), el matiz de le copain / la copine (amigo o novio según el contexto) y si rarement suena natural en las respuestas cortas.",
    },
    words: [
      w(
        'fr-je-me-reveille',
        'je me réveille',
        'me despierto',
        'Le dimanche, je me réveille tard.',
        'Los domingos me despierto tarde.',
        ['routine', 'verbs'],
        { emoji: '⏰' },
      ),
      w(
        'fr-je-me-suis-leve',
        'je me suis levé',
        'me levanté',
        'Hier, je me suis levée à six heures.',
        'Ayer me levanté a las seis.',
        ['routine', 'past'],
        { acceptedTexts: ['je me suis levée'] },
      ),
      w(
        'fr-on-s-est-rencontres',
        "on s'est rencontrés",
        'nos conocimos',
        "On s'est rencontrés à Lyon, il y a deux ans.",
        'Nos conocimos en Lyon hace dos años.',
        ['relations', 'past'],
        { acceptedTexts: ["on s'est rencontrées"] },
      ),
      w(
        'fr-se-marier',
        'se marier',
        'casarse',
        'Claire et Paul se sont mariés en juin.',
        'Claire y Paul se casaron en junio.',
        ['relations', 'verbs'],
        { emoji: '💍' },
      ),
      w(
        'fr-se-disputer',
        'se disputer',
        'pelearse',
        'Léa et sa sœur se disputent souvent.',
        'Léa y su hermana se pelean seguido.',
        ['relations', 'verbs'],
        { acceptedTranslations: ['discutir'] },
      ),
      w(
        'fr-s-entendre-bien',
        "s'entendre bien",
        'llevarse bien',
        "Je m'entends bien avec ma sœur.",
        'Me llevo bien con mi hermana.',
        ['relations', 'verbs'],
      ),
      w(
        'fr-le-copain',
        'le copain',
        'el amigo',
        "Hugo est un copain de l'école.",
        'Hugo es un amigo de la escuela.',
        ['relations'],
        {
          acceptedTranslations: ['el novio', 'la amiga', 'la novia'],
          acceptedTexts: ['la copine'],
        },
      ),
      w(
        'fr-le-couple',
        'le couple',
        'la pareja',
        'Léa et Hugo sont un beau couple.',
        'Léa y Hugo hacen una linda pareja.',
        ['relations', 'm'],
        { emoji: '💑' },
      ),
      w(
        'fr-ensemble',
        'ensemble',
        'juntos',
        'On habite ensemble depuis un an.',
        'Vivimos juntos desde hace un año.',
        ['relations'],
        { acceptedTranslations: ['juntas'] },
      ),
      w(
        'fr-j-y-vais',
        "j'y vais",
        'voy para allá',
        "Le musée? J'y vais demain.",
        '¿El museo? Voy mañana.',
        ['pronouns'],
        { acceptedTranslations: ['voy', 'voy ahí'] },
      ),
      w(
        'fr-ne-jamais',
        'ne… jamais',
        'nunca',
        'Je ne bois jamais de café le soir.',
        'Nunca tomo café por la noche.',
        ['negation', 'frequency'],
      ),
      w('fr-ne-plus', 'ne… plus', 'ya no', "Je n'habite plus à Paris.", 'Ya no vivo en París.', [
        'negation',
      ]),
      w('fr-ne-rien', 'ne… rien', 'nada', "Je n'ai rien mangé.", 'No comí nada.', ['negation']),
      w(
        'fr-ne-personne',
        'ne… personne',
        'nadie',
        "Il n'y a personne à la maison.",
        'No hay nadie en casa.',
        ['negation'],
      ),
      w(
        'fr-parfois',
        'parfois',
        'a veces',
        'Parfois, je me lève tard.',
        'A veces me levanto tarde.',
        ['frequency'],
      ),
      w(
        'fr-rarement',
        'rarement',
        'casi nunca',
        'Je vais rarement au cinéma.',
        'Casi nunca voy al cine.',
        ['frequency'],
        { acceptedTranslations: ['rara vez'] },
      ),
      w('fr-quelque-chose', 'quelque chose', 'algo', 'Tu veux quelque chose?', '¿Quieres algo?', [
        'basics',
      ]),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Je me suis levée tard',
        objective: 'Contar la rutina y lo que hiciste con verbos pronominales.',
        intro: {
          explanation:
            'Los verbos pronominales (se lever, se réveiller, se coucher) llevan me, te, se, nous, vous delante del verbo: je me réveille, tu te réveilles. En el passé composé van con être, no con avoir: je me suis levé. Con être, el participio concuerda con el sujeto: una mujer escribe je me suis levée y en plural nous nous sommes levés, pero levé y levée suenan igual. Para la frecuencia: toujours, souvent, parfois (a veces) y rarement (casi nunca).',
          examples: [
            { target: 'Je me réveille à sept heures.', base: 'Me despierto a las siete.' },
            { target: 'Hier, je me suis levée tard.', base: 'Ayer me levanté tarde.' },
          ],
        },
        takeaways: [
          'Cuentas tu mañana con je me réveille y je me suis levé o levée.',
          'Dices con qué frecuencia haces algo con parfois y rarement.',
        ],
        exercises: [
          ex.translationChoice(
            'je me réveille',
            'me despierto',
            ['me levanto', 'me acuesto', 'me levanté'],
            ['fr-je-me-reveille'],
            { id: 'fr.ex.3b5b5r8t6lvepw' },
          ),
          ex.translationChoice(
            'je me suis levé',
            'me levanté',
            ['me levanto', 'me despierto', 'me acosté'],
            ['fr-je-me-suis-leve'],
            {
              id: 'fr.ex.h5mob8ewhwctlr',
              explanation: 'Je me lève es presente; je me suis levé, passé composé con être.',
            },
          ),
          ex.matchPairs(
            [
              ['je me réveille', 'me despierto'],
              ['je me suis levé', 'me levanté'],
              ['parfois', 'a veces'],
              ['rarement', 'casi nunca'],
            ],
            ['fr-je-me-reveille', 'fr-je-me-suis-leve', 'fr-parfois', 'fr-rarement'],
            { id: 'fr.ex.jytgmag7ezqa81' },
          ),
          ex.listenChoice(
            'Je me suis levé à sept heures.',
            [
              'Je me lève à sept heures.',
              'Je me suis levé à six heures.',
              'Je me couche à sept heures.',
            ],
            ['fr-je-me-suis-leve'],
            {
              id: 'fr.ex.ae7jeu6job1wea',
              explanation:
                'Presta atención al suis: je me suis levé es pasado; je me lève, presente.',
            },
          ),
          ex.fillBlank(
            "Hier, Claire s'est ___ à six heures.",
            'Ayer Claire se levó a las seis.',
            'levée',
            ['levé', 'levés'],
            ['fr-je-me-suis-leve'],
            {
              id: 'fr.ex.l1ewfvmacljbob',
              explanation:
                'Con être el participio concuerda con el sujeto: Claire es mujer, levée. Suena igual que levé.',
            },
          ),
          ex.fillBlank(
            'Nous nous ___ levés à huit heures.',
            'Nos levantamos a las ocho.',
            'sommes',
            ['avons', 'sont', 'êtes'],
            ['fr-je-me-suis-leve'],
            {
              id: 'fr.ex.dgd62mg636089i',
              explanation:
                'Los verbos pronominales van con être en el passé composé: nous nous sommes levés, nunca «nous nous avons».',
            },
          ),
          ex.fillBlank(
            '___, je me lève tôt, mais pas tous les jours.',
            'A veces me levanto temprano, pero no todos los días.',
            'Parfois',
            ['Toujours', 'Hier', 'Tous les jours'],
            ['fr-parfois'],
            {
              id: 'fr.ex.56974jyf7qq2h4',
              skill: 'vocabulary',
              explanation:
                'Parfois es a veces: no todos los días. Toujours y tous les jours contradicen la frase.',
            },
          ),
          ex.translationChoice(
            'rarement',
            'casi nunca',
            ['a veces', 'siempre', 'seguido'],
            ['fr-rarement'],
            {
              id: 'fr.ex.ogy7a25btfxaz3',
              explanation: 'Rarement es casi nunca o rara vez; souvent, seguido.',
            },
          ),
          ex.translateWrite(
            'Ayer me levanté tarde.',
            'Hier, je me suis levé tard.',
            ['fr-je-me-suis-leve'],
            {
              id: 'fr.ex.j8bp6frpiidq7u',
              acceptedAnswers: [
                'Hier, je me suis levée tard.',
                'Je me suis levé tard hier.',
                'Je me suis levée tard hier.',
              ],
            },
          ),
          ex.shortAnswer(
            'Tu te réveilles à quelle heure?',
            '¿A qué hora te despiertas? (Responde que te despiertas a las siete.)',
            'Je me réveille à sept heures.',
            [
              'Je me réveille à 7 heures.',
              'À sept heures.',
              'Je me réveille à sept heures du matin.',
            ],
            ['fr-je-me-reveille'],
            { id: 'fr.ex.nnitk0ju71ypjt' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: "On s'est rencontrés à Lyon",
        objective: 'Contar cómo se conoció una pareja y si viven juntos.',
        intro: {
          explanation:
            "Para contar una historia de pareja: on s'est rencontrés (nos conocimos), ils se sont mariés (se casaron). Son verbos pronominales, así que van con être y concuerdan: elles se sont rencontrées. Ojo con ils sont mariés (están casados) y ils se sont mariés (se casaron): la diferencia es el se. Le couple es masculino aunque en español digamos la pareja, y ensemble es juntos. Falso amigo: le copain o la copine es amigo o amiga, pero mon copain también puede ser mi novio.",
          examples: [
            {
              target: 'Claire et Paul se sont mariés en juin.',
              base: 'Claire y Paul se casaron en junio.',
            },
            { target: "On s'est rencontrés à Paris.", base: 'Nos conocimos en París.' },
          ],
        },
        takeaways: [
          "Cuentas cómo se conocieron con on s'est rencontrés y ils se sont mariés.",
          'Hablas de tu copain o tu copine y de lo que hacen ensemble.',
        ],
        exercises: [
          ex.translationChoice(
            "on s'est rencontrés",
            'nos conocimos',
            ['nos casamos', 'nos separamos', 'nos peleamos'],
            ['fr-on-s-est-rencontres'],
            {
              id: 'fr.ex.syzf7d94ox6t77',
              explanation:
                'Rencontrer a alguien es conocerlo (o cruzárselo); on se retrouve es encontrarse en un lugar acordado.',
            },
          ),
          ex.matchPairs(
            [
              ["on s'est rencontrés", 'nos conocimos'],
              ['se marier', 'casarse'],
              ['le couple', 'la pareja'],
              ['ensemble', 'juntos'],
            ],
            ['fr-on-s-est-rencontres', 'fr-se-marier', 'fr-le-couple', 'fr-ensemble'],
            { id: 'fr.ex.dvdoxwki3jpayq' },
          ),
          ex.listenChoice(
            'Ils se sont mariés en juin.',
            [
              'Ils sont mariés depuis juin.',
              'Ils se sont rencontrés en juin.',
              'Ils se sont mariés en juillet.',
            ],
            ['fr-se-marier'],
            {
              id: 'fr.ex.8kjszdzs0vjbmq',
              explanation:
                'Escucha el se: ils se sont mariés es se casaron; ils sont mariés, están casados.',
            },
          ),
          ex.fillBlank(
            "Claire et Paul se ___ mariés l'année dernière.",
            'Claire y Paul se casaron el año pasado.',
            'sont',
            ['ont', 'est', 'sommes'],
            ['fr-se-marier'],
            {
              id: 'fr.ex.2uthyn37n4eobs',
              explanation:
                'Se marier es pronominal: passé composé con être y el plural ils se sont mariés.',
            },
          ),
          ex.fillBlank(
            "Mon ___ s'appelle Marc: on habite ensemble.",
            'Mi novio se llama Marc: vivimos juntos.',
            'copain',
            ['copine', 'couple'],
            ['fr-le-copain', 'fr-ensemble'],
            {
              id: 'fr.ex.y68iefy4z8otkf',
              skill: 'vocabulary',
              explanation:
                'Mon va con un sustantivo masculino: mon copain. La copine es femenino (ma copine) y le couple es la pareja, no la persona.',
            },
          ),
          question(
            'fr.ex.wt4kziah5qrjx8',
            COUPLE,
            '¿Dónde se conocieron Inès y Marc?',
            'En Lyon, en una clase de baile.',
            ['En París, en el trabajo.', 'En Lyon, en la universidad.', 'En una fiesta en Niza.'],
            ['fr-on-s-est-rencontres'],
            "Inès dice «On s'est rencontrés à Lyon, il y a deux ans, dans un cours de danse».",
          ),
          question(
            'fr.ex.wfaxustxrbl0p0',
            COUPLE,
            '¿Desde cuándo viven juntos?',
            'Desde hace un año.',
            ['Desde hace dos años.', 'No viven juntos.', 'Desde hace un mes.'],
            ['fr-ensemble'],
            'Antoine pregunta «vous habitez ensemble?» e Inès responde «Oui, depuis un an». Hace dos años es cuando se conocieron.',
          ),
          ex.orderWords(
            'Ils sont partis ensemble en vacances.',
            'Se fueron juntos de vacaciones.',
            ['fr-ensemble'],
            { id: 'fr.ex.blsw19wsfxc4fz' },
          ),
          ex.translateWrite(
            'Nos conocimos en París.',
            "On s'est rencontrés à Paris.",
            ['fr-on-s-est-rencontres'],
            {
              id: 'fr.ex.x5xlltjmk58vh8',
              acceptedAnswers: [
                "On s'est rencontrées à Paris.",
                'Nous nous sommes rencontrés à Paris.',
                'Nous nous sommes rencontrées à Paris.',
              ],
            },
          ),
          ex.shortAnswer(
            'Claire et Paul se sont mariés quand?',
            '¿Cuándo se casaron Claire y Paul? (Responde que se casaron en mayo.)',
            'Ils se sont mariés en mai.',
            ['En mai.', 'Claire et Paul se sont mariés en mai.'],
            ['fr-se-marier'],
            { id: 'fr.ex.mvljyspmtwpl74' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: "On s'entend bien",
        objective: 'Decir cómo te llevas con alguien y hablar de lo que hacen juntos.',
        intro: {
          explanation:
            "Con los verbos recíprocos, se significa el uno al otro: on se voit le samedi (nos vemos), ils se parlent (se hablan), on s'entend bien (nos llevamos bien), ils se disputent (se pelean). Entendre es oír, pero s'entendre bien es llevarse bien: je m'entends, on s'entend, ils s'entendent. En il s'entend la d no suena; en ils s'entendent sí se oye la d (la terminación -ent es muda). En pasado: on s'est disputés.",
          examples: [
            { target: "On s'entend très bien.", base: 'Nos llevamos muy bien.' },
            { target: 'Ils se disputent souvent.', base: 'Se pelean seguido.' },
          ],
        },
        takeaways: [
          "Dices cómo te llevas con alguien con s'entendre bien y se disputer.",
          'Usas se para hablar de lo que dos personas hacen el uno con el otro.',
        ],
        exercises: [
          ex.translationChoice(
            "s'entendre bien",
            'llevarse bien',
            ['pelearse', 'casarse', 'oír bien'],
            ['fr-s-entendre-bien'],
            {
              id: 'fr.ex.gxhh84lcbpwu0j',
              explanation: "Entendre es oír, pero s'entendre bien es llevarse bien con alguien.",
            },
          ),
          ex.listenChoice(
            "Ils s'entendent bien.",
            ["Il s'entend bien.", "Elle s'entend bien."],
            ['fr-s-entendre-bien'],
            {
              id: 'fr.ex.mq0ax3k3chyspt',
              explanation:
                "En ils s'entendent se oye la d antes de bien; en il s'entend y elle s'entend, la d no suena.",
            },
          ),
          ex.fillBlank(
            "Léa et sa sœur se ___ souvent: elles ne s'entendent pas bien.",
            'Léa y su hermana se pelean seguido: no se llevan bien.',
            'disputent',
            ['dispute', 'entendent', 'marient'],
            ['fr-se-disputer'],
            {
              id: 'fr.ex.huusb7n556gpj1',
              explanation:
                'Elles (ellas) lleva -ent: se disputent. No se llevan bien, así que se pelean.',
            },
          ),
          ex.fillBlank(
            "Mon copain et moi, on s'___ très bien.",
            'Mi novio y yo nos llevamos muy bien.',
            'entend',
            ['entendent', 'entends'],
            ['fr-s-entendre-bien', 'fr-le-copain'],
            {
              id: 'fr.ex.6l78uek3yktnaf',
              explanation: "On va con la forma de il: on s'entend, aunque signifique nosotros.",
            },
          ),
          ex.matchPairs(
            [
              ['on se voit', 'nos vemos'],
              ['ils se parlent', 'se hablan'],
              ["on s'entend bien", 'nos llevamos bien'],
              ['ils se disputent', 'se pelean'],
            ],
            ['fr-s-entendre-bien', 'fr-se-disputer'],
            { id: 'fr.ex.3x3cuvwx3rbngh' },
          ),
          ex.translationChoice(
            'se disputer',
            'pelearse',
            ['llevarse bien', 'casarse', 'conocerse'],
            ['fr-se-disputer'],
            {
              id: 'fr.ex.a4myum8wgfnyrs',
              explanation: 'Se disputer es pelearse o discutir con alguien.',
            },
          ),
          question(
            'fr.ex.57ot1opkz86567',
            COUPLE,
            '¿Cómo se llevan Inès y Marc?',
            'Muy bien.',
            ['Mal: se pelean seguido.', 'Más o menos.', 'No lo dice.'],
            ['fr-s-entendre-bien'],
            "Inès dice «On s'entend très bien».",
          ),
          question(
            'fr.ex.41uo4pq89qhpo0',
            COUPLE,
            '¿Inès y Marc ya se casaron?',
            'Todavía no: tal vez el año que viene.',
            ['Sí, hace dos años.', 'Sí, el año pasado.', 'No, y no se van a casar.'],
            ['fr-se-marier'],
            "Antoine pregunta «Vous allez vous marier?» e Inès responde «Peut-être l'année prochaine!».",
          ),
          ex.translateWrite(
            'Mi hermana y yo nos llevamos bien.',
            "Ma sœur et moi, on s'entend bien.",
            ['fr-s-entendre-bien'],
            {
              id: 'fr.ex.14b3dfue5bv5ux',
              acceptedAnswers: ['Ma sœur et moi, nous nous entendons bien.'],
            },
          ),
          ex.shortAnswer(
            "Tu t'entends bien avec tes parents?",
            '¿Te llevas bien con tus padres? (Responde que sí, muy bien.)',
            "Oui, je m'entends très bien avec mes parents.",
            ["Oui, je m'entends bien avec mes parents.", 'Oui, très bien.'],
            ['fr-s-entendre-bien'],
            { id: 'fr.ex.tmdmqbtt5yfg1e' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: "J'y vais · qui et que",
        objective: 'Reemplazar un lugar con y y unir frases con qui y que.',
        intro: {
          explanation:
            "Y reemplaza un lugar que ya se nombró (à la plage, au cinéma, chez mes parents) y va antes del verbo: Tu vas au cinéma? — Oui, j'y vais. También on y va, ils y vont. Liaison: en ils‿y vont la s se une a la y con un sonido z. Para unir frases: qui es el sujeto del verbo que sigue (le copain qui habite à Nice) y que, el objeto (le film que j'ai vu); que se vuelve qu' delante de vocal: le film qu'on aime.",
          examples: [
            {
              target: "Tu vas à la plage? — Oui, j'y vais demain.",
              base: '¿Vas a la playa? — Sí, voy mañana.',
            },
            { target: "C'est le copain qui habite à Lyon.", base: 'Es el amigo que vive en Lyon.' },
          ],
        },
        takeaways: [
          "Evitas repetir el lugar con y: j'y vais, on y va.",
          'Unes dos frases con qui (sujeto) y que (objeto).',
        ],
        exercises: [
          ex.translationChoice(
            "j'y vais",
            'voy para allá',
            ['me voy', 'vine', 'fui'],
            ['fr-j-y-vais'],
            {
              id: 'fr.ex.jrsy10w6mjicuj',
              explanation: "Y reemplaza el lugar: Le musée? J'y vais (voy al museo).",
            },
          ),
          ex.fillBlank(
            'Tu vas au cinéma ce soir? — Oui, on ___ va avec Hugo.',
            '¿Vas al cine esta noche? — Sí, vamos con Hugo.',
            'y',
            ['en', 'le', 'lui'],
            ['fr-j-y-vais'],
            {
              id: 'fr.ex.i2xj0t1qxlbduw',
              explanation: 'Para un lugar (au cinéma) se usa y, antes del verbo: on y va.',
            },
          ),
          ex.listenChoice(
            'Ils y vont le samedi.',
            ['Ils vont le samedi.', 'Il y va le samedi.'],
            ['fr-j-y-vais'],
            {
              id: 'fr.ex.qywu6jwwzk8mz0',
              explanation:
                'En ils y vont se oye una z: la s de ils se une a la y (liaison). En il y va no hay z.',
            },
          ),
          ex.fillBlank(
            "C'est le copain ___ habite à Marseille.",
            'Es el amigo que vive en Marsella.',
            'qui',
            ['que', 'où', 'quand'],
            ['fr-le-copain'],
            {
              id: 'fr.ex.p82js6yifk8kpd',
              explanation:
                'Qui es el sujeto: el copain es el que vive (habite). Después de qui viene el verbo.',
            },
          ),
          ex.fillBlank(
            "C'est le film ___ j'ai vu hier.",
            'Es la película que vi ayer.',
            'que',
            ['qui', 'où', 'quand'],
            ['fr-j-y-vais'],
            {
              id: 'fr.ex.rmn1yz3cgrrgo7',
              explanation:
                "Que es el objeto: yo (j') vi la película. Después de que viene otro sujeto.",
            },
          ),
          question(
            'fr.ex.gyi648ftxid4y9',
            POST,
            '¿Dónde vive Julie?',
            'En Niza.',
            ['En Lyon.', 'Con Camille.', 'Cerca de los padres de Camille.'],
            ['fr-le-copain'],
            'Camille escribe «ma copine Julie, qui habite à Nice».',
          ),
          question(
            'fr.ex.7wpgz6gmybxmbi',
            POST,
            '¿Cómo va Camille a lo de sus padres?',
            'En bici.',
            ['En autobús.', 'A pie.', 'En auto.'],
            ['fr-j-y-vais'],
            "Dice «je vais chez mes parents. J'y vais à vélo». En autobús van a la playa.",
          ),
          ex.orderWords(
            "J'y vais avec mon copain.",
            'Voy (para allá) con mi novio.',
            ['fr-j-y-vais', 'fr-le-copain'],
            { id: 'fr.ex.7skb55rf725cr2' },
          ),
          ex.translateWrite(
            '¿Vas a la farmacia? — Sí, voy ahora.',
            "Tu vas à la pharmacie? — Oui, j'y vais maintenant.",
            ['fr-j-y-vais'],
            {
              id: 'fr.ex.1smd3w4zw8kxq0',
              acceptedAnswers: [
                "Tu vas à la pharmacie? Oui, j'y vais maintenant.",
                "Vous allez à la pharmacie? — Oui, j'y vais maintenant.",
              ],
            },
          ),
          ex.shortAnswer(
            'Tu vas souvent au cinéma?',
            '¿Vas seguido al cine? (Responde que vas a veces.)',
            "J'y vais parfois.",
            [
              'Parfois.',
              "Oui, j'y vais parfois.",
              "Parfois, j'y vais.",
              'Je vais parfois au cinéma.',
            ],
            ['fr-j-y-vais', 'fr-parfois'],
            { id: 'fr.ex.jocj1uypmosg3w' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Je ne fais rien',
        objective: 'Negar con nunca, ya no, nada y nadie, y ofrecer algo.',
        intro: {
          explanation:
            "Como ne… pas, estas negaciones rodean al verbo: je ne bois jamais de café (nunca), je n'habite plus à Paris (ya no), je ne fais rien (nada), je ne vois personne (nadie). En el passé composé, rien va antes del participio (je n'ai rien mangé) y personne, después (je n'ai vu personne). Lo contrario de ne… rien es quelque chose (algo). Ne se vuelve n' delante de vocal: en je n'ai rien vu, esa n es lo único que se oye de la negación. En lo oral el ne a veces se cae, pero se escribe siempre.",
          examples: [
            { target: 'Je ne bois jamais de café le soir.', base: 'Nunca tomo café por la noche.' },
            { target: "Il n'y a personne dans la cuisine.", base: 'No hay nadie en la cocina.' },
          ],
        },
        takeaways: [
          'Niegas con ne… jamais, ne… plus, ne… rien y ne… personne alrededor del verbo.',
          'Ofreces o preguntas por quelque chose y respondes ne… rien.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['ne… jamais', 'nunca'],
              ['ne… plus', 'ya no'],
              ['ne… rien', 'nada'],
              ['ne… personne', 'nadie'],
            ],
            ['fr-ne-jamais', 'fr-ne-plus', 'fr-ne-rien', 'fr-ne-personne'],
            { id: 'fr.ex.ymp13b2hbqv9fz' },
          ),
          ex.fillBlank(
            'Hugo ne boit ___ de café: il déteste ça.',
            'Hugo nunca toma café: lo odia.',
            'jamais',
            ['rien', 'personne', 'toujours'],
            ['fr-ne-jamais'],
            {
              id: 'fr.ex.0vx5pwswvy7cbi',
              explanation: 'Ne… jamais es nunca y rodea al verbo: ne boit jamais.',
            },
          ),
          ex.fillBlank(
            "Avant, j'habitais à Lyon. Maintenant, je n'habite ___ à Lyon.",
            'Antes vivía en Lyon. Ahora ya no vivo en Lyon.',
            'plus',
            ['jamais', 'rien', 'personne'],
            ['fr-ne-plus'],
            {
              id: 'fr.ex.gjefb2gbozh5ig',
              explanation: 'Algo que pasaba y ya no pasa: ne… plus (ya no).',
            },
          ),
          ex.listenChoice(
            "Je n'ai rien mangé.",
            ["J'ai bien mangé.", "Je n'ai pas mangé."],
            ['fr-ne-rien'],
            {
              id: 'fr.ex.5sal1xk1lmsnv8',
              explanation:
                "Escucha la n de je n'ai y la r de rien: je n'ai rien mangé (no comí nada) / j'ai bien mangé (comí bien).",
            },
          ),
          ex.fillBlank(
            "Il n'y a ___ dans la salle de bains.",
            'No hay nadie en el baño.',
            'personne',
            ["quelqu'un", 'jamais', 'pas'],
            ['fr-ne-personne'],
            {
              id: 'fr.ex.kh7zyzblvxqj6o',
              explanation:
                "Nadie es ne… personne: il n'y a personne. Quelqu'un es alguien y no va con ne.",
            },
          ),
          ex.fillBlank(
            'Tu veux ___? — Non merci, je ne veux rien.',
            '¿Quieres algo? — No, gracias, no quiero nada.',
            'quelque chose',
            ['rien', 'personne', "quelqu'un"],
            ['fr-quelque-chose', 'fr-ne-rien'],
            {
              id: 'fr.ex.pvcxrotd2d654p',
              skill: 'vocabulary',
              explanation:
                'Para ofrecer algo: quelque chose. Rien (nada) va con ne en la respuesta.',
            },
          ),
          question(
            'fr.ex.t4675q1yg9iurq',
            FATIGUE,
            '¿Qué le pasa a Paul?',
            'Ya no duerme bien y no ve a nadie.',
            [
              'Ya no trabaja y está enfermo.',
              'Duerme mucho y sale todos los días.',
              'Se peleó con Sophie.',
            ],
            ['fr-ne-plus', 'fr-ne-personne'],
            'Paul dice «Je ne dors plus bien et je ne vois personne».',
          ),
          question(
            'fr.ex.iot7529onuax14',
            FATIGUE,
            '¿Qué decide Paul al final?',
            'Ir al cine el sábado con Sophie y Hugo.',
            [
              'Quedarse en casa todo el fin de semana.',
              'Ir al cine solo.',
              'Ir a lo de Hugo el domingo.',
            ],
            ['fr-j-y-vais', 'fr-ne-jamais'],
            "Sophie le dice «Tu ne sors jamais!» y lo invita al cine el sábado; Paul responde «Bon, d'accord. J'y vais avec vous».",
          ),
          ex.translateWrite(
            'Nunca me levanto tarde.',
            'Je ne me lève jamais tard.',
            ['fr-ne-jamais'],
            { id: 'fr.ex.lzjb1h1fqsprsx' },
          ),
          ex.shortAnswer(
            "Qu'est-ce que tu as fait hier soir?",
            '¿Qué hiciste anoche? (Responde que no hiciste nada.)',
            "Je n'ai rien fait.",
            ['Rien.', "Je n'ai rien fait hier soir.", "Hier soir, je n'ai rien fait."],
            ['fr-ne-rien'],
            { id: 'fr.ex.r3p7avg2q28cl1' },
          ),
        ],
      },
    ],
  },
};
