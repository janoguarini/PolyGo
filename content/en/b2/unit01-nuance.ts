import type { B2UnitDef } from '../../b2';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from '../b1/helpers';

/**
 * B2 U1 «Decir las cosas con matices» (docs/B2_EN.md): malentendidos, tono e indirectas; verbos
 * seguidos de -ing o de infinitivo con cambio de sentido (remember, forget, stop, try, regret, mean);
 * suavizar lo que se dice (tend to, seem to, apparently, actually); ser directo o tener tacto.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const EMAIL_TONE = dialogue(
  'en.stim.b2-u1-email-tone',
  'Dos compañeros de trabajo hablan de un correo que cayó mal.',
  [
    ['Nina', 'Can I ask you something? Did my email this morning seem rude to you?'],
    ['Sam', 'Honestly? It was a bit short. You just wrote "Fix this today." No hello, no thanks.'],
    ['Nina', "Oh no. I didn't mean to sound angry. I was in a hurry, that's all."],
    ['Sam', 'I know, but Mark actually thought you were annoyed with him.'],
    ['Nina', "That's a misunderstanding. I'll call him and explain."],
    [
      'Sam',
      "Good idea. A call is better than another email. Tone doesn't always get across in writing.",
    ],
  ],
);

const FEEDBACK_POST = reading(
  'en.stim.b2-u1-feedback-post',
  'post',
  'Una publicación de un blog sobre cómo dar una opinión difícil.',
  [
    'Most of us tend to avoid difficult conversations. We are afraid of hurting people, so we say nothing, or we drop a hint and hope the other person understands.',
    'The problem is that hints are easy to miss. Your colleague may not realize there is a problem at all.',
    'Being straightforward does not mean being blunt. Start with something positive, then point out the problem clearly and calmly, and finally look for a solution together.',
    'Remember: people can accept honest feedback when it is tactful. What they find hard to accept is sarcasm.',
  ],
  { title: 'How to say difficult things' },
);

const DINNER = dialogue(
  'en.stim.b2-u1-dinner',
  'Dos amigos comentan una cena de la noche anterior.',
  [
    ['Leo', 'Did you notice what Carla said at dinner? "Some people never offer to pay."'],
    ['Ivy', 'I did. Apparently she was talking about Tom. He always forgets his wallet.'],
    ['Leo', 'So she was implying that he never pays? That was a pretty strong hint.'],
    [
      'Ivy',
      "Well, I don't think she meant to embarrass him. She was being sarcastic, but in a friendly way.",
    ],
    ['Leo', "Tom didn't seem to find it funny, though. He went quiet for the rest of the night."],
    ['Ivy', "Maybe I'll bring it up with Carla. She'd want to know he was hurt."],
  ],
);

const APOLOGY = reading(
  'en.stim.b2-u1-apology',
  'email',
  'Un correo que intenta aclarar un malentendido.',
  [
    'Hi Mark,',
    'I want to apologize for my email yesterday. I realize it sounded rude, and I regret writing it in such a hurry.',
    'I did not mean to criticize your work. Actually, the report is very good. I only wanted to show you one mistake in the numbers before the meeting.',
    'Next time I will stop to think before I click "send". If you have a minute today, I would be happy to talk about it.',
    'Best wishes,',
    'Nina',
  ],
  { from: 'Nina', to: 'Mark', title: 'About my email' },
);

export const EN_B2_U01: B2UnitDef = {
  names: ['Nina', 'Sam', 'Mark', 'Carla', 'Ivy', 'Leo', 'Tom'],
  support: [
    'mistake',
    'thought',
    'something',
    'everything',
    'nothing',
    'sound',
    'realize',
    'argument',
    'lazy',
    'annoyed',
    'explain',
    'notice',
    'wallet',
    'pretty',
    'strong',
    'meant',
    'embarrass',
    'though',
    'conversation',
    'afraid',
    'drop',
    'positive',
    'clear',
    'accept',
    'sarcasm',
    'politics',
    'serious',
    'such',
    'criticize',
    'click',
    'minute',
    'feedback',
    'away',
    'show',
    'lying',
  ],
  unit: {
    position: 1,
    title: 'Decir las cosas con matices',
    titleEn: 'Saying things with nuance',
    description:
      'Malentendidos, tono e indirectas; remember, stop o try con -ing o infinitivo; ser directo sin ser brusco.',
    emoji: '🗣️',
    objective:
      'Puedes aclarar un malentendido, entender una indirecta y decir algo difícil con tacto.',
    grammar: {
      title: 'Verbos con -ing o infinitivo',
      explanation:
        'Algunos verbos cambian de sentido según lo que sigue. Remember / forget + -ing: algo que ya pasó (I remember meeting her). Remember / forget + to: algo que tienes que hacer (Remember to call him). Stop + -ing: dejar de hacer; stop + to: parar para hacer otra cosa. Try + -ing: probar algo; try + to: intentar. Regret + -ing: lamentar algo que hiciste. Mean to: tener la intención.',
      examples: [
        {
          target: 'I remember meeting her, but I forgot to ask her name.',
          base: 'Me acuerdo de haberla conocido, pero me olvidé de preguntarle el nombre.',
        },
        {
          target: 'We stopped to talk. Then we stopped talking.',
          base: 'Paramos para hablar. Después dejamos de hablar.',
        },
        { target: "I didn't mean to sound rude.", base: 'No fue mi intención sonar maleducado.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B2: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-misunderstanding',
        'misunderstanding',
        'malentendido',
        '/ˌmɪsʌndərˈstændɪŋ/',
        '🤷',
        "It wasn't an argument, just a misunderstanding.",
        'No fue una pelea, sólo un malentendido.',
        ['communication'],
      ),
      w(
        'en-tone',
        'tone',
        'tono',
        '/toʊn/',
        undefined,
        'I didn’t like the tone of his message.',
        'No me gustó el tono de su mensaje.',
        ['communication'],
      ),
      w(
        'en-mean-to',
        'mean to',
        'tener la intención de / querer (hacer algo)',
        '/ˈmin tu/',
        undefined,
        "Sorry, I didn't mean to wake you up.",
        'Perdón, no quise despertarte.',
        ['communication', 'verb-patterns'],
        ['tener la intención de', 'querer hacer'],
      ),
      w(
        'en-get-across',
        'get across',
        'transmitir / hacer entender (una idea)',
        '/ˈɡɛt əˈkrɔs/',
        undefined,
        'It is hard to get your ideas across in a short message.',
        'Es difícil transmitir tus ideas en un mensaje corto.',
        ['communication', 'phrasal-verbs'],
        ['transmitir', 'hacer entender'],
      ),
      w(
        'en-actually',
        'actually',
        'en realidad',
        '/ˈæktʃuəli/',
        undefined,
        'I thought he was angry, but actually he was tired.',
        'Pensé que estaba enojado, pero en realidad estaba cansado.',
        ['communication', 'adverbs'],
        ['de hecho'],
      ),
      w(
        'en-hint',
        'hint',
        'indirecta / pista',
        '/hɪnt/',
        '💡',
        'She dropped a hint about her birthday present.',
        'Tiró una indirecta sobre su regalo de cumpleaños.',
        ['communication'],
        ['indirecta', 'pista'],
      ),
      w(
        'en-imply',
        'imply',
        'insinuar / dar a entender',
        '/ɪmˈplaɪ/',
        undefined,
        'Are you implying that I am lazy?',
        '¿Estás insinuando que soy vago?',
        ['communication', 'verbs'],
        ['insinuar', 'dar a entender'],
      ),
      w(
        'en-sarcastic',
        'sarcastic',
        'sarcástico',
        '/sɑrˈkæstɪk/',
        '🙄',
        'Was he being sarcastic, or did he mean it?',
        '¿Estaba siendo sarcástico o lo decía en serio?',
        ['communication', 'adjectives'],
      ),
      w(
        'en-apparently',
        'apparently',
        'al parecer / por lo visto',
        '/əˈpærəntli/',
        undefined,
        'Apparently, the meeting has been canceled.',
        'Al parecer, cancelaron la reunión.',
        ['communication', 'adverbs'],
        ['al parecer', 'por lo visto', 'aparentemente'],
      ),
      w(
        'en-seem',
        'seem',
        'parecer',
        '/sim/',
        undefined,
        'You seem worried. Is everything OK?',
        'Pareces preocupado. ¿Está todo bien?',
        ['communication', 'verbs'],
      ),
      w(
        'en-regret',
        'regret',
        'arrepentirse de / lamentar',
        '/rɪˈɡrɛt/',
        '😔',
        'I regret saying those things to my brother.',
        'Me arrepiento de haberle dicho esas cosas a mi hermano.',
        ['verb-patterns', 'verbs'],
        ['arrepentirse', 'lamentar'],
      ),
      w(
        'en-remember-doing',
        'remember doing',
        'acordarse de haber hecho',
        '/rɪˈmɛmbər ˈduɪŋ/',
        undefined,
        'I remember doing my homework, but I can’t find it.',
        'Me acuerdo de haber hecho la tarea, pero no la encuentro.',
        ['verb-patterns'],
        ['recordar haber hecho'],
      ),
      w(
        'en-tend-to',
        'tend to',
        'tender a / soler',
        '/ˈtɛnd tu/',
        undefined,
        'People tend to speak faster when they are nervous.',
        'La gente tiende a hablar más rápido cuando está nerviosa.',
        ['communication', 'verb-patterns'],
        ['tender a', 'soler'],
      ),
      w(
        'en-straightforward',
        'straightforward',
        'directo / franco',
        '/ˌstreɪtˈfɔrwərd/',
        undefined,
        'I prefer straightforward answers.',
        'Prefiero las respuestas directas.',
        ['communication', 'adjectives'],
        ['directo', 'franco', 'sencillo'],
      ),
      w(
        'en-blunt',
        'blunt',
        'brusco / demasiado directo',
        '/blʌnt/',
        undefined,
        'Sorry to be blunt, but your plan won’t work.',
        'Perdón por ser tan directo, pero tu plan no va a funcionar.',
        ['communication', 'adjectives'],
        ['brusco', 'demasiado directo'],
      ),
      w(
        'en-tactful',
        'tactful',
        'con tacto / diplomático',
        '/ˈtæktfəl/',
        undefined,
        'Try to be tactful when you give feedback.',
        'Trata de tener tacto cuando des tu opinión.',
        ['communication', 'adjectives'],
        ['con tacto', 'diplomático'],
      ),
      w(
        'en-point-out',
        'point out',
        'señalar / hacer notar',
        '/ˈpɔɪnt ˈaʊt/',
        '👉',
        'She pointed out a mistake in my report.',
        'Señaló un error en mi informe.',
        ['communication', 'phrasal-verbs'],
        ['señalar', 'hacer notar'],
      ),
      w(
        'en-bring-up',
        'bring up',
        'sacar (un tema) / mencionar',
        '/ˈbrɪŋ ˈʌp/',
        undefined,
        "Don't bring up politics at dinner.",
        'No saques el tema de la política en la cena.',
        ['communication', 'phrasal-verbs'],
        ['sacar un tema', 'mencionar', 'plantear'],
      ),
      w(
        'en-body-language',
        'body language',
        'lenguaje corporal',
        '/ˈbɑdi ˌlæŋɡwɪdʒ/',
        '🙆',
        'His body language showed that he was nervous.',
        'Su lenguaje corporal mostraba que estaba nervioso.',
        ['communication'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'No quise decir eso',
        objective: 'Aclarar un malentendido y explicar lo que quisiste decir.',
        intro: {
          explanation:
            'Cuando algo se entiende mal, en inglés aclaras la intención con mean to: I didn’t mean to sound rude (no fue mi intención). Actually corrige una idea equivocada: Actually, I wasn’t angry (en realidad). Un misunderstanding es un malentendido y el tone, el tono de lo que dices.',
          examples: [
            {
              target: "I didn't mean to sound rude.",
              base: 'No fue mi intención sonar maleducado.',
            },
            {
              target: "It wasn't an argument, just a misunderstanding.",
              base: 'No fue una pelea, sólo un malentendido.',
            },
          ],
        },
        takeaways: [
          'Aclaras tu intención con I didn’t mean to…',
          'Corriges una idea equivocada con actually.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['misunderstanding', 'malentendido'],
              ['tone', 'tono'],
              ['actually', 'en realidad'],
              ['get across', 'transmitir / hacer entender (una idea)'],
            ],
            ['en-misunderstanding', 'en-tone', 'en-actually', 'en-get-across'],
            { id: 'en.ex.heulqk75qvxc61' },
          ),
          ex.fillBlank(
            "Sorry, I didn't ___ to wake you up.",
            'Perdón, no quise despertarte.',
            'mean',
            ['want', 'try', 'think'],
            ['en-mean-to'],
            {
              id: 'en.ex.mgxdfgacyt86l5',
              explanation: 'Didn’t mean to + verbo: no era tu intención hacerlo.',
            },
          ),
          ex.fillBlank(
            'I thought he was angry, but ___ he was just tired.',
            'Pensé que estaba enojado, pero en realidad sólo estaba cansado.',
            'actually',
            ['probably', 'finally', 'eventually'],
            ['en-actually'],
            {
              id: 'en.ex.kote14wmkxn53z',
              skill: 'vocabulary',
              explanation: 'Actually = en realidad (corrige lo que pensabas). No es «actualmente».',
            },
          ),
          question(
            'en.ex.yrcpub54revidh',
            EMAIL_TONE,
            '¿Por qué el correo de Nina pareció maleducado?',
            'Porque era muy corto, sin saludo ni agradecimiento',
            ['Porque tenía errores', 'Porque lo mandó a todos', 'Porque estaba en mayúsculas'],
            ['en-tone', 'en-seem'],
            'Sam dice: «It was a bit short. You just wrote "Fix this today." No hello, no thanks».',
          ),
          question(
            'en.ex.bdpzdrd5msn67r',
            EMAIL_TONE,
            '¿Qué cree Sam que conviene hacer?',
            'Llamar a Mark, porque el tono no siempre se entiende por escrito',
            ['Mandarle otro correo a Mark', 'No decir nada', 'Hablar con el jefe'],
            ['en-get-across', 'en-misunderstanding'],
            'Sam dice: «A call is better than another email. Tone doesn’t always get across in writing».',
          ),
          ex.listenChoice(
            "It wasn't an argument, just a misunderstanding.",
            [
              'It was an argument, not a misunderstanding.',
              "It wasn't an accident, just a misunderstanding.",
              "It wasn't an argument, just a mistake.",
            ],
            ['en-misunderstanding'],
            { id: 'en.ex.u1h9c7mry3s8tc' },
          ),
          ex.orderWords(
            'I did not mean to sound angry.',
            'No fue mi intención sonar enojado.',
            ['en-mean-to'],
            { id: 'en.ex.cfb6yp4xwje7w7' },
          ),
          ex.shortAnswer(
            'Why did you say that? (no fue tu intención ser maleducado)',
            '¿Por qué dijiste eso?',
            "I didn't mean to be rude.",
            [
              'I did not mean to be rude.',
              "Sorry, I didn't mean to be rude.",
              "I didn't mean to sound rude.",
            ],
            ['en-mean-to'],
            { id: 'en.ex.1wvxodfm9jgawc' },
          ),
          ex.translateWrite(
            'No me gustó el tono de su mensaje.',
            "I didn't like the tone of his message.",
            ['en-tone'],
            {
              id: 'en.ex.nsxxo1uhrdi5um',
              acceptedAnswers: [
                'I did not like the tone of his message.',
                "I didn't like the tone of her message.",
                'I did not like the tone of her message.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Leer entre líneas',
        objective: 'Entender indirectas, sarcasmo y lo que alguien da a entender.',
        intro: {
          explanation:
            'No todo se dice de forma directa. Imply es dar a entender algo sin decirlo; to drop a hint es tirar una indirecta. Si alguien es sarcastic, dice lo contrario de lo que piensa. Apparently (al parecer) y seem (parecer) muestran que no estás del todo seguro.',
          examples: [
            { target: 'Are you implying that I am lazy?', base: '¿Estás insinuando que soy vago?' },
            {
              target: 'Apparently, she was talking about Tom.',
              base: 'Al parecer, hablaba de Tom.',
            },
          ],
        },
        takeaways: [
          'Reconoces una indirecta y el sarcasmo.',
          'Cuentas lo que no sabes seguro con apparently y seem.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['hint', 'indirecta / pista'],
              ['imply', 'insinuar / dar a entender'],
              ['sarcastic', 'sarcástico'],
              ['apparently', 'al parecer / por lo visto'],
            ],
            ['en-hint', 'en-imply', 'en-sarcastic', 'en-apparently'],
            { id: 'en.ex.gmuip6v3ci9xw3' },
          ),
          ex.imageChoice('🙄', 'sarcastic', ['polite', 'honest', 'friendly'], ['en-sarcastic'], {
            id: 'en.ex.e5wyr5c63lh5ah',
          }),
          ex.fillBlank(
            'You ___ worried. Is everything OK?',
            'Pareces preocupado. ¿Está todo bien?',
            'seem',
            ['look like', 'imply', 'mean'],
            ['en-seem'],
            {
              id: 'en.ex.iloo04abzl2vqx',
              skill: 'vocabulary',
              explanation: 'Seem + adjetivo: parecer. Look like va con un sustantivo.',
            },
          ),
          ex.fillBlank(
            'She dropped a ___ about her birthday present.',
            'Tiró una indirecta sobre su regalo de cumpleaños.',
            'hint',
            ['tone', 'story', 'present'],
            ['en-hint'],
            { id: 'en.ex.6bh9j1uuna6gqa', skill: 'vocabulary' },
          ),
          question(
            'en.ex.apwahyxlumx0or',
            DINNER,
            '¿Qué dio a entender Carla con su comentario?',
            'Que Tom nunca paga',
            ['Que la cena era cara', 'Que Leo llegó tarde', 'Que Ivy olvidó la billetera'],
            ['en-imply', 'en-hint'],
            'Leo dice: «So she was implying that he never pays?».',
          ),
          question(
            'en.ex.cwdkxv5o0m10ac',
            DINNER,
            '¿Cómo reaccionó Tom, según Leo?',
            'No le hizo gracia y estuvo callado el resto de la noche',
            ['Se rió mucho', 'Pagó toda la cena', 'Se fue enojado antes del postre'],
            ['en-seem', 'en-sarcastic'],
            'Leo dice: «Tom didn’t seem to find it funny… He went quiet for the rest of the night».',
          ),
          ex.listenChoice(
            'Apparently, the meeting has been canceled.',
            [
              'Actually, the meeting has been canceled.',
              'Apparently, the meeting has been delayed.',
              'Apparently, the meeting was canceled.',
            ],
            ['en-apparently'],
            { id: 'en.ex.n5zde59wc3e7bt' },
          ),
          ex.shortAnswer(
            'Was he being serious? (no, estaba siendo sarcástico)',
            '¿Lo decía en serio?',
            'No, he was being sarcastic.',
            ['He was being sarcastic.', 'No, he was sarcastic.', 'No. He was being sarcastic.'],
            ['en-sarcastic'],
            { id: 'en.ex.0sv02ubluvb016' },
          ),
          ex.translateWrite(
            '¿Estás insinuando que soy vago?',
            'Are you implying that I am lazy?',
            ['en-imply'],
            {
              id: 'en.ex.ws4r2nmsysm5pq',
              acceptedAnswers: [
                "Are you implying that I'm lazy?",
                "Are you implying I'm lazy?",
                'Are you implying I am lazy?',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Recordar, dejar, intentar',
        objective: 'Usar remember, forget, stop, try y regret con -ing o con infinitivo.',
        intro: {
          explanation:
            'Con -ing hablas de algo que ya hiciste o de la actividad misma: I remember meeting her (me acuerdo de haberla conocido), I regret saying it (me arrepiento de haberlo dicho), We stopped talking (dejamos de hablar). Con to + verbo hablas de lo que hay que hacer o del propósito: Remember to call (acuérdate de llamar), We stopped to talk (paramos para hablar). Try + -ing es probar algo; try to, intentar.',
          examples: [
            {
              target: 'I remember meeting her, but I forgot to ask her name.',
              base: 'Me acuerdo de haberla conocido, pero me olvidé de preguntarle el nombre.',
            },
            {
              target: 'I regret saying those things to my brother.',
              base: 'Me arrepiento de haberle dicho esas cosas a mi hermano.',
            },
          ],
        },
        takeaways: [
          'Distingues remember doing (ya pasó) de remember to do (hay que hacerlo).',
          'Usas stop, try y regret con el sentido correcto.',
        ],
        exercises: [
          ex.fillBlank(
            'I remember ___ her at a party, but I can’t remember her name.',
            'Me acuerdo de haberla conocido en una fiesta, pero no me acuerdo de su nombre.',
            'meeting',
            ['to meet', 'meet', 'met'],
            ['en-remember-doing'],
            {
              id: 'en.ex.dyv0674xmftllz',
              explanation: 'Remember + -ing: un recuerdo de algo que ya pasó.',
            },
          ),
          ex.fillBlank(
            'Please remember ___ the door when you leave.',
            'Por favor, acuérdate de cerrar la puerta cuando te vayas.',
            'to close',
            ['closing', 'close', 'closed'],
            ['en-remember-doing'],
            {
              id: 'en.ex.fwwv8d88sbffar',
              explanation: 'Remember + to: algo que tienes que hacer.',
            },
          ),
          ex.fillBlank(
            'We were tired, so we stopped ___ a coffee.',
            'Estábamos cansados, así que paramos para tomar un café.',
            'to have',
            ['having', 'have', 'had'],
            ['en-remember-doing'],
            {
              id: 'en.ex.sme84cx4ludllg',
              explanation: 'Stop + to: parar para hacer otra cosa. Stop + -ing: dejar de hacerla.',
            },
          ),
          ex.fillBlank(
            'I regret ___ those things to my brother.',
            'Me arrepiento de haberle dicho esas cosas a mi hermano.',
            'saying',
            ['to say', 'say', 'said'],
            ['en-regret'],
            {
              id: 'en.ex.9tq0c5z9imvp74',
              explanation: 'Regret + -ing: te arrepientes de algo que hiciste.',
            },
          ),
          question(
            'en.ex.1hbwbr0p1tr8w8',
            APOLOGY,
            '¿De qué se arrepiente Nina?',
            'De haber escrito el correo con apuro',
            [
              'De haber criticado el informe',
              'De no haber ido a la reunión',
              'De haber llamado a Mark',
            ],
            ['en-regret'],
            'Nina escribe: «I regret writing it in such a hurry».',
          ),
          question(
            'en.ex.qxrg3srjgd6su9',
            APOLOGY,
            '¿Qué hará Nina la próxima vez?',
            'Parar a pensar antes de hacer clic en «enviar»',
            [
              'Dejar de mandar correos',
              'Pedirle a Mark que revise sus correos',
              'Escribir más rápido',
            ],
            ['en-remember-doing', 'en-mean-to'],
            'Nina escribe: «Next time I will stop to think before I click "send"» (stop + to = parar para).',
          ),
          ex.listenChoice(
            'I regret saying those things to my brother.',
            [
              'I regret saying those things to my mother.',
              "I don't regret saying those things to my brother.",
              'I regret not saying those things to my brother.',
            ],
            ['en-regret'],
            { id: 'en.ex.r555olfhh3vvzm' },
          ),
          ex.orderWords(
            'Remember to call your grandmother tonight.',
            'Acuérdate de llamar a tu abuela esta noche.',
            ['en-remember-doing'],
            { id: 'en.ex.rh90u4zugcwu6g' },
          ),
          ex.shortAnswer(
            'Are you still smoking? (dejaste de fumar hace dos años)',
            '¿Fumas?',
            'No, I stopped smoking two years ago.',
            [
              'I stopped smoking two years ago.',
              'No, I stopped two years ago.',
              'No. I stopped smoking two years ago.',
            ],
            ['en-remember-doing'],
            { id: 'en.ex.2sosb9fkpaeoyg' },
          ),
          ex.translateWrite(
            'Me acuerdo de haberla conocido, pero me olvidé de preguntarle el nombre.',
            'I remember meeting her, but I forgot to ask her name.',
            ['en-remember-doing'],
            {
              id: 'en.ex.5hh9kfufkl5t9t',
              acceptedAnswers: [
                'I remember meeting her but I forgot to ask her name.',
                'I remember meeting her, but I forgot to ask her what her name was.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Directo, pero con tacto',
        objective: 'Decir algo difícil de forma clara y amable.',
        intro: {
          explanation:
            'Straightforward es claro y directo (algo bueno); blunt es tan directo que puede ofender; tactful es tener tacto. Para señalar un problema usas point out, y para sacar un tema, bring up. Tend to (soler) suaviza una crítica: You tend to interrupt people suena mejor que You always interrupt.',
          examples: [
            {
              target: 'She pointed out a mistake in my report.',
              base: 'Señaló un error en mi informe.',
            },
            {
              target: 'People tend to speak faster when they are nervous.',
              base: 'La gente tiende a hablar más rápido cuando está nerviosa.',
            },
          ],
        },
        takeaways: [
          'Distingues straightforward, blunt y tactful.',
          'Señalas un problema con point out y lo suavizas con tend to.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['straightforward', 'directo / franco'],
              ['blunt', 'brusco / demasiado directo'],
              ['tactful', 'con tacto / diplomático'],
              ['bring up', 'sacar (un tema) / mencionar'],
            ],
            ['en-straightforward', 'en-blunt', 'en-tactful', 'en-bring-up'],
            { id: 'en.ex.55m37e8qwr5ozs' },
          ),
          ex.fillBlank(
            'She pointed ___ a mistake in my report.',
            'Señaló un error en mi informe.',
            'out',
            ['up', 'on', 'off'],
            ['en-point-out'],
            { id: 'en.ex.393s1etbi5f4n9', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Sorry to be ___, but your plan won’t work.',
            'Perdón por ser tan directo, pero tu plan no va a funcionar.',
            'blunt',
            ['tactful', 'polite', 'friendly'],
            ['en-blunt'],
            {
              id: 'en.ex.wwzrcn759ij5os',
              skill: 'vocabulary',
              explanation:
                'Blunt: tan directo que puede caer mal. Se usa para disculparse antes de una crítica.',
            },
          ),
          ex.fillBlank(
            'People ___ speak faster when they are nervous.',
            'La gente tiende a hablar más rápido cuando está nerviosa.',
            'tend to',
            ['seem', 'mean to', 'used'],
            ['en-tend-to'],
            { id: 'en.ex.doewlm7uwcm7gr', skill: 'vocabulary' },
          ),
          question(
            'en.ex.o0ia83stbr6wvy',
            FEEDBACK_POST,
            'Según el texto, ¿cuál es el problema de las indirectas?',
            'Que es fácil no darse cuenta de ellas',
            ['Que son maleducadas', 'Que llevan mucho tiempo', 'Que siempre ofenden'],
            ['en-hint'],
            'El texto dice: «The problem is that hints are easy to miss».',
          ),
          question(
            'en.ex.2x3ua3tg5ro28p',
            FEEDBACK_POST,
            '¿Qué diferencia hace el texto entre straightforward y blunt?',
            'Se puede ser claro sin ser brusco',
            ['Son lo mismo', 'Ser brusco funciona mejor', 'Hay que evitar ser claro'],
            ['en-straightforward', 'en-blunt'],
            'El texto dice: «Being straightforward does not mean being blunt».',
          ),
          question(
            'en.ex.lzcjgdoqw8grqf',
            FEEDBACK_POST,
            '¿Qué es lo que, según el texto, la gente acepta peor?',
            'El sarcasmo',
            ['Una opinión sincera', 'Un comentario positivo', 'Una solución en conjunto'],
            ['en-tactful', 'en-sarcastic'],
            'El texto dice: «people can accept honest feedback when it is tactful. What they find hard to accept is sarcasm».',
          ),
          ex.listenChoice(
            "Don't bring up politics at dinner.",
            [
              "Don't bring up politics at work.",
              'Do bring up politics at dinner.',
              "Don't talk about politics at dinner.",
            ],
            ['en-bring-up'],
            { id: 'en.ex.od3agufn19wdmv' },
          ),
          ex.shortAnswer(
            'Should I tell him about the problem? (sí, pero con tacto)',
            '¿Le cuento del problema?',
            'Yes, but be tactful.',
            [
              'Yes, but try to be tactful.',
              'Yes, but you should be tactful.',
              'Yes. But be tactful.',
            ],
            ['en-tactful'],
            { id: 'en.ex.uqp04c58oet2za' },
          ),
          ex.translateWrite(
            'Señaló un error en mi informe.',
            'She pointed out a mistake in my report.',
            ['en-point-out'],
            {
              id: 'en.ex.5u3w5yjk2rhtc2',
              acceptedAnswers: [
                'He pointed out a mistake in my report.',
                'She pointed out an error in my report.',
                'He pointed out an error in my report.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Más allá de las palabras',
        objective: 'Interpretar el lenguaje corporal y suavizar lo que dices.',
        intro: {
          explanation:
            'El body language (lenguaje corporal) también comunica. Para hablar de lo que ves sin afirmarlo: He seems nervous, She tends to look away. Para suavizar una opinión: I’d say…, It seems to me that…, a bit. Y si no se entendió tu idea: I couldn’t get my point across.',
          examples: [
            {
              target: 'His body language showed that he was nervous.',
              base: 'Su lenguaje corporal mostraba que estaba nervioso.',
            },
            {
              target: 'It is hard to get your ideas across in a short message.',
              base: 'Es difícil transmitir tus ideas en un mensaje corto.',
            },
          ],
        },
        takeaways: [
          'Describes el lenguaje corporal con seem y tend to.',
          'Suavizas una opinión y explicas si una idea no se entendió.',
        ],
        exercises: [
          ex.translationChoice(
            'body language',
            'lenguaje corporal',
            ['tono', 'malentendido', 'indirecta / pista'],
            ['en-body-language'],
            { id: 'en.ex.x11bjhpka50i2d' },
          ),
          ex.fillBlank(
            'His body ___ showed that he was nervous.',
            'Su lenguaje corporal mostraba que estaba nervioso.',
            'language',
            ['tone', 'eyes', 'hint'],
            ['en-body-language'],
            { id: 'en.ex.oo6nwtq54xe6jl', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'It is hard to get your ideas ___ in a short message.',
            'Es difícil transmitir tus ideas en un mensaje corto.',
            'across',
            ['out', 'up', 'off'],
            ['en-get-across'],
            { id: 'en.ex.05z5c4kpimjtr9', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'He ___ to be tired. He keeps closing his eyes.',
            'Parece estar cansado. No para de cerrar los ojos.',
            'seems',
            ['means', 'tends', 'implies'],
            ['en-seem'],
            {
              id: 'en.ex.17uhuxx9wgseod',
              explanation: 'Seem to + verbo: parecer (por lo que ves).',
            },
          ),
          question(
            'en.ex.nqoaxuwicxrmt8',
            DINNER,
            '¿Qué piensa hacer Ivy?',
            'Hablar del tema con Carla',
            ['Pedirle perdón a Tom', 'Invitar a Tom a cenar', 'No meterse'],
            ['en-bring-up'],
            'Ivy dice: «Maybe I’ll bring it up with Carla. She’d want to know he was hurt».',
          ),
          question(
            'en.ex.9iw1grwf7q4v8e',
            EMAIL_TONE,
            '¿Qué explica Nina sobre su correo?',
            'Que no quiso sonar enojada: estaba apurada',
            ['Que estaba enojada con Mark', 'Que no lo escribió ella', 'Que lo mandó por error'],
            ['en-mean-to'],
            'Nina dice: «I didn’t mean to sound angry. I was in a hurry, that’s all».',
          ),
          ex.listenChoice(
            'His body language showed that he was nervous.',
            [
              'His body language showed that he was angry.',
              'Her body language showed that she was nervous.',
              'His tone showed that he was nervous.',
            ],
            ['en-body-language'],
            { id: 'en.ex.ptvwrmh4oqgwac' },
          ),
          ex.orderWords(
            'People tend to look away when they are lying.',
            'La gente suele apartar la mirada cuando miente.',
            ['en-tend-to', 'en-body-language'],
            { id: 'en.ex.asku4tz1lsqni2' },
          ),
          ex.shortAnswer(
            'Did they understand your idea? (no, no pude transmitirla)',
            '¿Entendieron tu idea?',
            "No, I couldn't get it across.",
            [
              'No, I could not get it across.',
              "I couldn't get it across.",
              "No, I couldn't get my idea across.",
            ],
            ['en-get-across'],
            { id: 'en.ex.9jgcdbvgj8ld45' },
          ),
          ex.translateWrite(
            'Pareces preocupado. ¿Está todo bien?',
            'You seem worried. Is everything OK?',
            ['en-seem'],
            {
              id: 'en.ex.7fl4qtjzody4xu',
              acceptedAnswers: [
                'You seem worried. Is everything okay?',
                'You seem worried. Is everything all right?',
                'You seem worried. Are you OK?',
              ],
            },
          ),
        ],
      },
    ],
  },
};
