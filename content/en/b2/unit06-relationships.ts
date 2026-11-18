import type { B2UnitDef } from '../../b2';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from '../b1/helpers';

/**
 * B2 U6 «Psicología y relaciones humanas» (docs/B2_EN.md): deducir lo que pasó y lamentar lo que se
 * hizo con los modales perfectos (must have, might have, can't have, should have, could have);
 * peleas y reconciliaciones (fall out, make up, overreact); estados de ánimo y emociones (mood,
 * upset, guilty, grateful); empatía y confianza en uno mismo.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const NO_ANSWER = dialogue(
  'en.stim.b2-u6-no-answer',
  'Dos amigos se preocupan porque una amiga no contesta.',
  [
    ['Max', "Sara hasn't answered my messages since Friday. That's not like her."],
    ['Eva', 'She must have lost her phone again. She loses it every month.'],
    ['Max', "She can't have lost it. She posted a photo on social media this morning."],
    ['Eva', 'Then she might have been busy with work. She has a big project at the moment.'],
    [
      'Max',
      'Maybe. Or I might have said something that upset her. I made a joke about her new job.',
    ],
    ['Eva', "Honestly, you shouldn't have joked about that. She's very nervous about it."],
    [
      'Max',
      "You're right. I should have thought before I spoke. I'll call her tonight and apologize.",
    ],
  ],
);

const ADVICE = reading(
  'en.stim.b2-u6-advice',
  'post',
  'Una columna de consejos: la carta de una lectora y la respuesta.',
  [
    'Dear Ruth, Last week I fell out with my best friend. She was an hour late for my birthday dinner, and I shouted at her in front of everyone. Now I feel guilty, but I am also still a bit angry. What should I do? — Lina',
    'Dear Lina, It sounds like you both made mistakes. Being an hour late is rude, and you had every right to be upset. However, you probably overreacted when you shouted at her in public.',
    'Try not to take it personally. She could have had a good reason for being late. Call her, tell her how you felt, and listen to her side of the story.',
    'Friends fall out all the time. What matters is how you make up. — Ruth',
  ],
  { title: 'Ask Ruth' },
);

const PODCAST = dialogue(
  'en.stim.b2-u6-podcast',
  'Un pódcast sobre psicología entrevista a un psicólogo.',
  [
    ['Host', 'Today we are talking about empathy. What exactly is it?'],
    [
      'Dr. Moss',
      "It is the ability to understand how another person feels, to put yourself in their shoes. It's not the same as agreeing with them.",
    ],
    ['Host', 'Can empathy be learned?'],
    [
      'Dr. Moss',
      'Yes. The first step is to listen without judging. Most of us listen only to answer.',
    ],
    ['Host', 'Some listeners say their mood changes very quickly. Is that normal?'],
    [
      'Dr. Moss',
      'Everybody has good and bad days. But if you are often in a bad mood, it might be stress, or a lack of sleep.',
    ],
    ['Host', 'And what about self-confidence?'],
    [
      'Dr. Moss',
      'People with low self-confidence tend to think that others are judging them. Usually, others are too busy thinking about themselves!',
    ],
  ],
);

const SORRY = reading(
  'en.stim.b2-u6-sorry',
  'message',
  'Un mensaje de disculpas entre amigos.',
  [
    "Hi Max, I'm sorry I didn't reply. I wasn't angry with you. My first week at the new job was awful, and I was in a terrible mood.",
    'Your joke was a bit much, but I know you didn’t mean it. I was being too sensitive.',
    "I'm really grateful that you called last night. You always know how to cheer me up.",
    "I promise I won't disappear like that again. I hate letting my friends down. Coffee on Saturday? Sara",
  ],
  { from: 'Sara', to: 'Max' },
);

export const EN_B2_U06: B2UnitDef = {
  names: ['Max', 'Sara', 'Eva', 'Ruth', 'Lina', 'Moss', 'Host', 'Dr'],
  support: [
    'answered',
    'posted',
    'joked',
    'shouted',
    'front',
    'matters',
    'ability',
    'judging',
    'listeners',
    'quickly',
    'normal',
    'everybody',
    'lack',
    'awful',
    'terrible',
    'sensitive',
    'disappear',
    'letting',
    'joke',
    'both',
    'reminded',
    'others',
  ],
  unit: {
    position: 6,
    title: 'Psicología y relaciones',
    titleEn: 'Psychology and relationships',
    description:
      'Deducir lo que pasó y lamentar lo que hiciste (must have, should have), peleas y reconciliaciones, estados de ánimo y empatía.',
    emoji: '🫂',
    objective:
      'Podés deducir qué le pasó a alguien, lamentar lo que hiciste, resolver una pelea y hablar de emociones.',
    grammar: {
      title: 'Modales perfectos',
      explanation:
        'Modal + have + participio habla del pasado. Para deducir: must have (seguro que sí), might / could have (es posible) y can’t have (seguro que no): She must have lost her phone. Para lamentar o criticar: should have / shouldn’t have (debería / no debería haber) y could have (podría haber, pero no lo hizo).',
      examples: [
        {
          target: 'She must have lost her phone again.',
          base: 'Seguro que perdió el teléfono otra vez.',
        },
        {
          target: "She can't have lost it. She posted a photo this morning.",
          base: 'No puede haberlo perdido. Subió una foto esta mañana.',
        },
        {
          target: 'I should have thought before I spoke.',
          base: 'Debería haber pensado antes de hablar.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B2: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-must-have',
        'must have',
        'debe de haber / seguro que (pasado)',
        '/ˈmʌst əv/',
        undefined,
        'You must have been very tired.',
        'Debés de haber estado muy cansado.',
        ['modals', 'deduction'],
        ['debe de haber', 'debe haber'],
      ),
      w(
        'en-might-have',
        'might have',
        'puede que haya / quizás haya',
        '/ˈmaɪt əv/',
        undefined,
        'He might have missed the bus.',
        'Puede que haya perdido el colectivo.',
        ['modals', 'deduction'],
        ['puede que haya', 'quizás haya'],
      ),
      w(
        'en-cant-have',
        "can't have",
        'no puede haber',
        '/ˈkænt əv/',
        undefined,
        "She can't have forgotten. I reminded her this morning.",
        'No puede haberse olvidado. Se lo recordé esta mañana.',
        ['modals', 'deduction'],
        ['no puede ser que haya'],
        ['cannot have'],
      ),
      w(
        'en-should-have',
        'should have',
        'debería haber',
        '/ˈʃʊd əv/',
        '😓',
        'I should have called you yesterday.',
        'Debería haberte llamado ayer.',
        ['modals', 'regret'],
        ['tendría que haber'],
      ),
      w(
        'en-could-have',
        'could have',
        'podría haber',
        '/ˈkʊd əv/',
        undefined,
        'You could have told me earlier!',
        '¡Me lo podrías haber dicho antes!',
        ['modals', 'regret'],
      ),
      w(
        'en-guilty',
        'guilty',
        'culpable',
        '/ˈɡɪlti/',
        '😞',
        'I feel guilty about what I said.',
        'Me siento culpable por lo que dije.',
        ['emotions', 'adjectives'],
      ),
      w(
        'en-fall-out',
        'fall out',
        'pelearse / enojarse (con alguien)',
        '/ˈfɔl ˈaʊt/',
        '💢',
        'I fell out with my best friend last week.',
        'La semana pasada me peleé con mi mejor amiga.',
        ['relationships', 'phrasal-verbs'],
        ['pelearse', 'enojarse con alguien'],
      ),
      w(
        'en-make-up',
        'make up',
        'reconciliarse / hacer las paces',
        '/ˈmeɪk ˈʌp/',
        '🤝',
        'They argued, but they made up the next day.',
        'Discutieron, pero al día siguiente se reconciliaron.',
        ['relationships', 'phrasal-verbs'],
        ['reconciliarse', 'hacer las paces', 'amigarse'],
      ),
      w(
        'en-overreact',
        'overreact',
        'exagerar / reaccionar de más',
        '/ˌoʊvəriˈækt/',
        undefined,
        "I'm sorry I overreacted. It wasn't a big problem.",
        'Perdón por exagerar. No era un problema grave.',
        ['relationships', 'verbs'],
        ['exagerar', 'reaccionar de más'],
      ),
      w(
        'en-take-it-personally',
        'take it personally',
        'tomárselo como algo personal',
        '/ˈteɪk ɪt ˈpɜrsənəli/',
        undefined,
        "Don't take it personally. He is rude to everyone.",
        'No te lo tomes como algo personal. Es maleducado con todos.',
        ['relationships', 'collocations'],
        ['tomárselo a pecho'],
      ),
      w(
        'en-upset',
        'upset',
        'molesto / dolido',
        '/ʌpˈsɛt/',
        '😟',
        'She was upset because nobody called her.',
        'Estaba dolida porque nadie la llamó.',
        ['emotions', 'adjectives'],
        ['molesto', 'dolido', 'disgustado'],
      ),
      w(
        'en-mood',
        'mood',
        'humor / estado de ánimo',
        '/mud/',
        '🌦️',
        "Don't talk to him now. He is in a bad mood.",
        'No le hables ahora. Está de mal humor.',
        ['emotions'],
        ['humor', 'estado de ánimo'],
      ),
      w(
        'en-cheer-up',
        'cheer up',
        'animar / levantar el ánimo',
        '/ˈtʃɪr ˈʌp/',
        '🎈',
        'Cheer up! Tomorrow will be better.',
        '¡Arriba ese ánimo! Mañana va a ser mejor.',
        ['emotions', 'phrasal-verbs'],
        ['animar', 'animarse', 'levantar el ánimo'],
      ),
      w(
        'en-let-down',
        'let down',
        'decepcionar / fallarle a alguien',
        '/ˈlɛt ˈdaʊn/',
        undefined,
        'I trusted you, and you let me down.',
        'Confié en vos y me fallaste.',
        ['relationships', 'phrasal-verbs'],
        ['decepcionar', 'fallarle a alguien', 'defraudar'],
      ),
      w(
        'en-grateful',
        'grateful',
        'agradecido',
        '/ˈɡreɪtfəl/',
        '🙏',
        'I am very grateful for your help.',
        'Te estoy muy agradecido por tu ayuda.',
        ['emotions', 'adjectives'],
      ),
      w(
        'en-stubborn',
        'stubborn',
        'terco / testarudo',
        '/ˈstʌbərn/',
        '🐂',
        'He is too stubborn to say sorry.',
        'Es demasiado terco para pedir perdón.',
        ['personality', 'adjectives'],
        ['terco', 'testarudo', 'cabeza dura'],
      ),
      w(
        'en-empathy',
        'empathy',
        'empatía',
        '/ˈɛmpəθi/',
        '💞',
        'Empathy means understanding how others feel.',
        'Empatía significa entender cómo se sienten los demás.',
        ['psychology'],
      ),
      w(
        'en-self-confidence',
        'self-confidence',
        'confianza en uno mismo / seguridad',
        '/ˌsɛlf ˈkɑnfədəns/',
        '💪',
        'Learning a language gave me more self-confidence.',
        'Aprender un idioma me dio más confianza en mí mismo.',
        ['psychology'],
        ['confianza en uno mismo', 'seguridad', 'autoestima'],
        ['self confidence'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Algo debe de haber pasado',
        objective: "Deducir qué pasó con must have, might have y can't have.",
        intro: {
          explanation:
            'Para deducir algo del pasado: must have + participio (estás casi seguro: She must have lost her phone), might / could have (es posible: She might have been busy) y can’t have (estás casi seguro de que no: She can’t have forgotten). En la conversación suena «must’ve», «might’ve».',
          examples: [
            {
              target: 'You must have been very tired.',
              base: 'Debés de haber estado muy cansado.',
            },
            {
              target: 'He might have missed the bus.',
              base: 'Puede que haya perdido el colectivo.',
            },
          ],
        },
        takeaways: [
          'Deducís lo que pasó con must have y can’t have.',
          'Decís lo que es posible con might have.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['must have', 'debe de haber / seguro que (pasado)'],
              ['might have', 'puede que haya / quizás haya'],
              ["can't have", 'no puede haber'],
              ['upset', 'molesto / dolido'],
            ],
            ['en-must-have', 'en-might-have', 'en-cant-have', 'en-upset'],
            { id: 'en.ex.56efg49frwh6nd' },
          ),
          ex.fillBlank(
            'You worked twelve hours. You must have ___ exhausted.',
            'Trabajaste doce horas. Debés de haber estado agotado.',
            'been',
            ['be', 'being', 'was'],
            ['en-must-have'],
            {
              id: 'en.ex.bxsng3oo4t883n',
              explanation: 'Modal + have + participio: must have been.',
            },
          ),
          ex.fillBlank(
            'She ___ have forgotten. I reminded her this morning.',
            'No puede haberse olvidado. Se lo recordé esta mañana.',
            "can't",
            ['must', 'should', 'might'],
            ['en-cant-have'],
            {
              id: 'en.ex.mziczh2m3tep9r',
              explanation: 'Can’t have: estás casi seguro de que no pasó.',
            },
          ),
          question(
            'en.ex.vvs3pcy0h1lcbb',
            NO_ANSWER,
            '¿Por qué Max está seguro de que Sara no perdió el teléfono?',
            'Porque subió una foto a las redes esa mañana',
            ['Porque la llamó y atendió', 'Porque Eva la vio', 'Porque Sara nunca pierde nada'],
            ['en-cant-have', 'en-must-have'],
            'Max dice: «She can’t have lost it. She posted a photo on social media this morning».',
          ),
          question(
            'en.ex.kln1k0ackkm2g5',
            NO_ANSWER,
            '¿Qué teme Max?',
            'Haber dicho algo que la molestó',
            ['Que Sara esté enferma', 'Que Sara se haya mudado', 'Que Eva esté enojada'],
            ['en-might-have', 'en-upset'],
            'Max dice: «I might have said something that upset her. I made a joke about her new job».',
          ),
          ex.listenChoice(
            'He might have missed the bus.',
            [
              'He must have missed the bus.',
              'He might have missed the train.',
              "He can't have missed the bus.",
            ],
            ['en-might-have'],
            { id: 'en.ex.eb8kp3l2j486c6' },
          ),
          ex.orderWords(
            'She must have lost her phone again.',
            'Seguro que perdió el teléfono otra vez.',
            ['en-must-have'],
            { id: 'en.ex.0sur3gdj7oxe3t' },
          ),
          ex.shortAnswer(
            "Where's Tom? He's never late. (quizás perdió el tren)",
            '¿Dónde está Tom? Nunca llega tarde.',
            'He might have missed the train.',
            [
              'He may have missed the train.',
              'He could have missed the train.',
              'Maybe he missed the train.',
            ],
            ['en-might-have'],
            { id: 'en.ex.798ue2da559hxh' },
          ),
          ex.translateWrite(
            'Debés de haber estado muy cansado.',
            'You must have been very tired.',
            ['en-must-have'],
            {
              id: 'en.ex.f3m4ocj0yucp2h',
              acceptedAnswers: ["You must've been very tired.", 'You must have been really tired.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Lo que debería haber hecho',
        objective: 'Lamentar y criticar el pasado con should have y could have.',
        intro: {
          explanation:
            'Should have + participio: algo que era lo correcto y no pasó (I should have called you = debería haberte llamado). Shouldn’t have: algo que pasó y no tendría que haber pasado. Could have: una posibilidad que no se aprovechó (You could have told me = me lo podrías haber dicho). Si te sentís mal por algo que hiciste, te sentís guilty.',
          examples: [
            {
              target: 'I should have called you yesterday.',
              base: 'Debería haberte llamado ayer.',
            },
            {
              target: 'You could have told me earlier!',
              base: '¡Me lo podrías haber dicho antes!',
            },
          ],
        },
        takeaways: [
          'Lamentás lo que hiciste o no hiciste con should / shouldn’t have.',
          'Reprochás con could have y decís que te sentís culpable.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['should have', 'debería haber'],
              ['could have', 'podría haber'],
              ['guilty', 'culpable'],
              ['must have', 'debe de haber / seguro que (pasado)'],
            ],
            ['en-should-have', 'en-could-have', 'en-guilty', 'en-must-have'],
            { id: 'en.ex.tixhovrn5fawwn' },
          ),
          ex.fillBlank(
            'I should have ___ you yesterday. Sorry!',
            'Debería haberte llamado ayer. ¡Perdón!',
            'called',
            ['call', 'calling', 'to call'],
            ['en-should-have'],
            { id: 'en.ex.1jesmb3ryn7ofn', explanation: 'Should have + participio.' },
          ),
          ex.fillBlank(
            'You ___ have joked about her job. She was very nervous.',
            'No deberías haber bromeado sobre su trabajo. Estaba muy nerviosa.',
            "shouldn't",
            ["can't", 'must', 'could'],
            ['en-should-have'],
            { id: 'en.ex.dkeyjrmfcuu2ia' },
          ),
          ex.fillBlank(
            'I feel ___ about what I said.',
            'Me siento culpable por lo que dije.',
            'guilty',
            ['happy', 'nervous', 'proud'],
            ['en-guilty'],
            { id: 'en.ex.05arpgu7t7tcdo', skill: 'vocabulary' },
          ),
          question(
            'en.ex.efl45y8h4b2loo',
            NO_ANSWER,
            '¿Qué opina Eva del chiste de Max?',
            'Que no tendría que haber bromeado sobre eso',
            ['Que fue gracioso', 'Que Sara no lo escuchó', 'Que no importa'],
            ['en-should-have'],
            'Eva dice: «Honestly, you shouldn’t have joked about that. She’s very nervous about it».',
          ),
          question(
            'en.ex.40g594ml1i84zp',
            NO_ANSWER,
            '¿Qué lamenta Max y qué va a hacer?',
            'No haber pensado antes de hablar; la va a llamar para pedirle perdón',
            [
              'Haber llamado tarde; le va a escribir',
              'Haber perdido el teléfono; se va a comprar otro',
              'Nada; va a esperar',
            ],
            ['en-should-have'],
            'Max dice: «I should have thought before I spoke. I’ll call her tonight and apologize».',
          ),
          ex.listenChoice(
            'You could have told me earlier!',
            [
              'You should have told me earlier!',
              'You could have told me later!',
              'You could have called me earlier!',
            ],
            ['en-could-have'],
            { id: 'en.ex.xywvdrzv4cj6ly' },
          ),
          ex.orderWords(
            'I should have called you yesterday.',
            'Debería haberte llamado ayer.',
            ['en-should-have'],
            { id: 'en.ex.wtjt3dht0u5f2k' },
          ),
          ex.shortAnswer(
            'Why do you feel bad? (deberías haber estudiado más)',
            '¿Por qué te sentís mal?',
            'I should have studied more.',
            [
              "I should've studied more.",
              'Because I should have studied more.',
              'I should have studied harder.',
            ],
            ['en-should-have'],
            { id: 'en.ex.vrree75n29lpmw' },
          ),
          ex.translateWrite(
            '¡Me lo podrías haber dicho antes!',
            'You could have told me earlier!',
            ['en-could-have'],
            {
              id: 'en.ex.3kkhj12tr8is68',
              acceptedAnswers: [
                "You could've told me earlier!",
                'You could have told me before!',
                'You could have told me sooner!',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Peleas y reconciliaciones',
        objective: 'Contar una pelea, reconocer que exageraste y hacer las paces.',
        intro: {
          explanation:
            'Fall out (with someone) es pelearse; make up, reconciliarse. Overreact es exagerar, reaccionar de más. Don’t take it personally: no te lo tomes como algo personal. Si alguien está upset, está molesto o dolido (no «enojado» del todo).',
          examples: [
            {
              target: 'I fell out with my best friend last week.',
              base: 'La semana pasada me peleé con mi mejor amiga.',
            },
            {
              target: 'They argued, but they made up the next day.',
              base: 'Discutieron, pero al día siguiente se reconciliaron.',
            },
          ],
        },
        takeaways: [
          'Contás una pelea con fall out y una reconciliación con make up.',
          'Reconocés que exageraste y pedís que no lo tomen como algo personal.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['fall out', 'pelearse / enojarse (con alguien)'],
              ['make up', 'reconciliarse / hacer las paces'],
              ['overreact', 'exagerar / reaccionar de más'],
              ['take it personally', 'tomárselo como algo personal'],
            ],
            ['en-fall-out', 'en-make-up', 'en-overreact', 'en-take-it-personally'],
            { id: 'en.ex.to1a45isyshf1t' },
          ),
          ex.fillBlank(
            'I fell ___ with my best friend last week.',
            'La semana pasada me peleé con mi mejor amiga.',
            'out',
            ['up', 'down', 'off'],
            ['en-fall-out'],
            { id: 'en.ex.04onny6iuj469k', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'They argued, but they made ___ the next day.',
            'Discutieron, pero al día siguiente se reconciliaron.',
            'up',
            ['out', 'down', 'off'],
            ['en-make-up'],
            { id: 'en.ex.ye40hn602zz2yx', skill: 'vocabulary' },
          ),
          question(
            'en.ex.r5rmg72z7yjcoj',
            ADVICE,
            '¿Por qué se pelearon Lina y su amiga?',
            'La amiga llegó una hora tarde y Lina le gritó delante de todos',
            [
              'La amiga no fue al cumpleaños',
              'Lina llegó tarde a una cena',
              'La amiga le gritó a Lina',
            ],
            ['en-fall-out'],
            'Lina escribe: «She was an hour late for my birthday dinner, and I shouted at her in front of everyone».',
          ),
          question(
            'en.ex.kegllpgjxvatz9',
            ADVICE,
            '¿Cuál es la opinión de Ruth?',
            'Las dos se equivocaron: llegar tarde fue grosero, pero Lina exageró',
            ['Sólo se equivocó la amiga', 'Sólo se equivocó Lina', 'Ninguna se equivocó'],
            ['en-overreact', 'en-upset'],
            'Ruth responde: «you both made mistakes… you probably overreacted when you shouted at her in public».',
          ),
          question(
            'en.ex.irmxgqdgvz9842',
            ADVICE,
            '¿Qué es lo más importante, según Ruth?',
            'Cómo se reconcilian, porque los amigos se pelean siempre',
            ['No pelearse nunca', 'Quién tiene razón', 'Que la amiga pida perdón primero'],
            ['en-make-up', 'en-take-it-personally'],
            'Ruth termina: «Friends fall out all the time. What matters is how you make up».',
          ),
          ex.listenChoice(
            "Don't take it personally. He is rude to everyone.",
            [
              "Don't take it personally. He is nice to everyone.",
              'Take it personally. He is rude to everyone.',
              "Don't take it personally. She is rude to everyone.",
            ],
            ['en-take-it-personally'],
            { id: 'en.ex.oxdogvk7f6a46e' },
          ),
          ex.orderWords(
            'I am sorry I overreacted yesterday.',
            'Perdón por exagerar ayer.',
            ['en-overreact'],
            { id: 'en.ex.lsqr0jw5vyo7uj' },
          ),
          ex.shortAnswer(
            'Are you still angry with your sister? (no, ya se reconciliaron)',
            '¿Seguís enojado con tu hermana?',
            'No, we have made up.',
            ["No, we've made up.", 'No, we made up.', 'No. We have made up.'],
            ['en-make-up'],
            { id: 'en.ex.27mne111knbf14' },
          ),
          ex.translateWrite(
            'No te lo tomes como algo personal.',
            "Don't take it personally.",
            ['en-take-it-personally'],
            {
              id: 'en.ex.6qzp4v0fm4ht1o',
              acceptedAnswers: ['Do not take it personally.', "Please don't take it personally."],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Estados de ánimo',
        objective: 'Hablar del humor, animar a alguien y contar que alguien te falló.',
        intro: {
          explanation:
            'Mood es el humor: in a good / bad mood. Cheer up es animar (Cheer up! = ¡Arriba!) y cheer someone up, animar a alguien. Let someone down es fallarle, decepcionarlo. Grateful es agradecido; stubborn, terco.',
          examples: [
            {
              target: "Don't talk to him now. He is in a bad mood.",
              base: 'No le hables ahora. Está de mal humor.',
            },
            { target: 'I trusted you, and you let me down.', base: 'Confié en vos y me fallaste.' },
          ],
        },
        takeaways: [
          'Describís el humor de alguien y lo animás.',
          'Decís que alguien te falló o que estás agradecido.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['mood', 'humor / estado de ánimo'],
              ['cheer up', 'animar / levantar el ánimo'],
              ['let down', 'decepcionar / fallarle a alguien'],
              ['grateful', 'agradecido'],
            ],
            ['en-mood', 'en-cheer-up', 'en-let-down', 'en-grateful'],
            { id: 'en.ex.ag9oyq40qysax7' },
          ),
          ex.imageChoice('🐂', 'stubborn', ['grateful', 'guilty', 'upset'], ['en-stubborn'], {
            id: 'en.ex.zn28y2zjfn91dc',
          }),
          ex.fillBlank(
            "Don't talk to him now. He is in a bad ___.",
            'No le hables ahora. Está de mal humor.',
            'mood',
            ['tone', 'day', 'time'],
            ['en-mood'],
            {
              id: 'en.ex.vrkkibwyjdmpon',
              skill: 'vocabulary',
              explanation: 'Be in a good / bad mood: estar de buen / mal humor.',
            },
          ),
          ex.fillBlank(
            'I trusted you, and you let me ___.',
            'Confié en vos y me fallaste.',
            'down',
            ['up', 'out', 'off'],
            ['en-let-down'],
            { id: 'en.ex.5lxxex74bd5icn', skill: 'vocabulary' },
          ),
          question(
            'en.ex.eri9430tonohik',
            SORRY,
            '¿Por qué Sara no contestaba los mensajes?',
            'Tuvo una primera semana horrible en el trabajo y estaba de muy mal humor',
            ['Estaba enojada con Max', 'Había perdido el teléfono', 'Estaba de viaje'],
            ['en-mood'],
            'Sara escribe: «I wasn’t angry with you. My first week at the new job was awful, and I was in a terrible mood».',
          ),
          question(
            'en.ex.l9yx67q2vsl6i5',
            SORRY,
            '¿Por qué Sara está agradecida con Max?',
            'Porque la llamó y siempre sabe cómo animarla',
            [
              'Porque le pidió perdón por escrito',
              'Porque la ayudó con el trabajo',
              'Porque le regaló un café',
            ],
            ['en-grateful', 'en-cheer-up'],
            'Sara escribe: «I’m really grateful that you called last night. You always know how to cheer me up».',
          ),
          question(
            'en.ex.wjqihkjt93w019',
            SORRY,
            '¿Qué reconoce Sara sobre el chiste?',
            'Que fue un poco fuerte, pero ella se lo tomó demasiado a pecho',
            ['Que fue muy gracioso', 'Que no lo leyó', 'Que Max lo dijo para molestarla'],
            ['en-take-it-personally', 'en-upset'],
            'Sara escribe: «Your joke was a bit much, but I know you didn’t mean it. I was being too sensitive».',
          ),
          ex.listenChoice(
            'Cheer up! Tomorrow will be better.',
            [
              'Cheer up! Tomorrow will be worse.',
              'Cheer up! Today will be better.',
              'Hurry up! Tomorrow will be better.',
            ],
            ['en-cheer-up'],
            { id: 'en.ex.c7uum13296zgog' },
          ),
          ex.shortAnswer(
            'Why is she not speaking to him? (porque él le falló)',
            '¿Por qué ella no le habla?',
            'Because he let her down.',
            ['He let her down.', 'Because he has let her down.', 'Because he let her down again.'],
            ['en-let-down'],
            { id: 'en.ex.6p9w7ih0l1xnuy' },
          ),
          ex.translateWrite(
            'Te estoy muy agradecido por tu ayuda.',
            'I am very grateful for your help.',
            ['en-grateful'],
            {
              id: 'en.ex.v0nnjk0vx1wtri',
              acceptedAnswers: [
                "I'm very grateful for your help.",
                'I am really grateful for your help.',
                "I'm really grateful for your help.",
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Ponerse en el lugar del otro',
        objective: 'Hablar de la empatía y de la confianza en uno mismo.',
        intro: {
          explanation:
            'Empathy es entender cómo se siente otra persona: to put yourself in someone’s shoes (ponerse en su lugar). Self-confidence es la confianza en uno mismo. Para hablar de lo que alguien podría haber sentido: She might have felt alone.',
          examples: [
            {
              target: 'Empathy means understanding how others feel.',
              base: 'Empatía significa entender cómo se sienten los demás.',
            },
            {
              target: 'Learning a language gave me more self-confidence.',
              base: 'Aprender un idioma me dio más confianza en mí mismo.',
            },
          ],
        },
        takeaways: [
          'Explicás qué es la empatía y cómo se practica.',
          'Hablás de tu confianza en vos mismo.',
        ],
        exercises: [
          ex.translationChoice(
            'self-confidence',
            'confianza en uno mismo / seguridad',
            ['empatía', 'humor / estado de ánimo', 'culpable'],
            ['en-self-confidence'],
            { id: 'en.ex.y7a85jql3x05th' },
          ),
          ex.fillBlank(
            '___ means understanding how others feel.',
            'Empatía significa entender cómo se sienten los demás.',
            'Empathy',
            ['Mood', 'Self-confidence', 'Diversity'],
            ['en-empathy'],
            { id: 'en.ex.4p6lfmh4yk0xrj', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Learning a language gave me more ___.',
            'Aprender un idioma me dio más confianza en mí mismo.',
            'self-confidence',
            ['empathy', 'mood', 'evidence'],
            ['en-self-confidence'],
            { id: 'en.ex.5pfk76btxyu76p', skill: 'vocabulary' },
          ),
          question(
            'en.ex.5229wxhbm3tx9b',
            PODCAST,
            'Según el psicólogo, ¿la empatía es lo mismo que estar de acuerdo?',
            'No: es entender cómo se siente otro, aunque no estés de acuerdo',
            ['Sí, es lo mismo', 'Sí, pero sólo con amigos', 'No: es dar consejos'],
            ['en-empathy'],
            'Dice: «It is the ability to understand how another person feels… It’s not the same as agreeing with them».',
          ),
          question(
            'en.ex.p2xmj7a529i7k1',
            PODCAST,
            '¿Qué puede haber detrás de estar seguido de mal humor?',
            'Estrés o falta de sueño',
            ['Una mala dieta', 'Demasiado trabajo en equipo', 'El clima'],
            ['en-mood', 'en-might-have'],
            'Dice: «if you are often in a bad mood, it might be stress, or a lack of sleep».',
          ),
          question(
            'en.ex.y5d0mr9r7gs02c',
            PODCAST,
            '¿Qué dice con humor sobre las personas con poca confianza en sí mismas?',
            'Creen que los demás las juzgan, pero los demás están pensando en sí mismos',
            ['Que nunca cambian', 'Que tienen razón', 'Que deberían hablar más'],
            ['en-self-confidence'],
            'Dice: «People with low self-confidence tend to think that others are judging them. Usually, others are too busy thinking about themselves!».',
          ),
          ex.listenChoice(
            'Empathy means understanding how others feel.',
            [
              'Empathy means understanding how you feel.',
              'Empathy means telling others how you feel.',
              'Empathy means knowing what others think.',
            ],
            ['en-empathy'],
            { id: 'en.ex.jqmv8l9g8bw752' },
          ),
          ex.orderWords(
            'He is too stubborn to say sorry.',
            'Es demasiado terco para pedir perdón.',
            ['en-stubborn'],
            { id: 'en.ex.2uo95m5306p2x9' },
          ),
          ex.shortAnswer(
            'How has learning English helped you? (te dio más confianza en vos mismo)',
            '¿En qué te ayudó aprender inglés?',
            'It has given me more self-confidence.',
            [
              "It's given me more self-confidence.",
              'It gave me more self-confidence.',
              'It has given me more confidence.',
            ],
            ['en-self-confidence'],
            { id: 'en.ex.r1yf7oyaq88ckf' },
          ),
          ex.translateWrite(
            'Es demasiado terco para pedir perdón.',
            'He is too stubborn to say sorry.',
            ['en-stubborn'],
            {
              id: 'en.ex.jl46i0meng02ne',
              acceptedAnswers: [
                "He's too stubborn to say sorry.",
                'He is too stubborn to apologize.',
                "He's too stubborn to apologize.",
                'She is too stubborn to say sorry.',
              ],
            },
          ),
        ],
      },
    ],
  },
};
