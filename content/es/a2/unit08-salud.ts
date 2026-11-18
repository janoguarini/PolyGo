import type { EsUnitDef } from '../../es-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Español A2 U8 «Health» (docs/ES_A1_A2.md): me duele + singular / me duelen + plural, con artículo y
 * no con posesivo (me duele la cabeza); me siento bien / mal, estoy enfermo; el imperativo para dar
 * consejos: con vos descansá, tomá y en negativo no tomes, no salgas (la forma estándar, no «no
 * tomés»); con usted tome, descanse; y la fórmula ¡que te mejores! Vocabulario rioplatense: el
 * resfrío, el remedio.
 * Pronunciación: el acento que cambia el sentido (tomá / toma / tomo); la g fuerte de garganta.
 * Cultura: en el consultorio se habla de usted; cuando alguien estornuda se dice ¡salud!
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CONSULTORIO = dialogue(
  'es.stim.a2-u8-consultorio',
  'Tomás goes to see Elena, a doctor. They speak formally, with usted.',
  [
    ['Elena', 'Buenas tardes. ¿Qué le pasa?'],
    ['Tomás', 'Me siento muy mal. Me duele la cabeza y tengo fiebre desde ayer.'],
    ['Elena', '¿Le duele la garganta también?'],
    ['Tomás', 'Sí, un poco. Y me duelen los brazos.'],
    ['Elena', 'Es un resfrío. Tome este remedio tres veces por día y descanse.'],
    ['Tomás', '¿Puedo ir a trabajar mañana?'],
    ['Elena', 'No, tiene que quedarse en casa dos días. Acá tiene la receta.'],
  ],
);

const MENSAJE = reading(
  'es.stim.a2-u8-mensaje',
  'message',
  'A message from Valentina to her friend Tomás.',
  [
    '¡Hola, Tomás!',
    'Martín dice que estás enfermo. ¿Cómo te sentís?',
    'Descansá mucho y tomá mucha agua.',
    'No tomes café: no es bueno para la garganta.',
    'Mañana voy a tu casa con sopa.',
    '¡Que te mejores!',
    'Valentina',
  ],
  { from: 'Valentina', to: 'Tomás' },
);

export const ES_A2_U08: EsUnitDef = {
  names: ['Tomás', 'Elena', 'Valentina', 'Martín', 'Lucía'],
  support: ['tome', 'descanse', 'tomá', 'sentís', 'dice', 'sopa', 'salgas', 'descansar'],
  unit: {
    position: 8,
    title: 'Health',
    titleEn: 'La salud',
    description:
      'Say what hurts (me duele, me duelen), how you feel and that you are sick, understand a doctor, give advice with the imperative (descansá, no tomes) and wish someone well.',
    emoji: '🩺',
    objective:
      'You can say what hurts and how you feel, understand a doctor’s questions and instructions, give a friend simple health advice and wish someone a quick recovery.',
    grammar: {
      title: 'Me duele / me duelen · the imperative',
      explanation:
        'Doler works like gustar: the thing that hurts is the subject, so it is me duele with one thing and me duelen with more than one (me duele la cabeza, me duelen los dientes). Spanish uses the article, not my, with parts of the body: me duele la espalda. To give advice to a friend, use the vos imperative: the infinitive without the final r, stressed on the last vowel: descansar → descansá, tomar → tomá. The negative uses a different form: no tomes, no salgas. In Argentina you may hear no tomés in casual speech, but no tomes is the standard form. With usted: tome, descanse, no tome.',
      examples: [
        {
          target: 'Me duele la cabeza y me duelen los dientes.',
          base: 'I have a headache and my teeth hurt.',
        },
        { target: 'Descansá y tomá mucha agua.', base: 'Rest and drink lots of water.' },
        { target: 'No salgas hoy: tenés fiebre.', base: 'Don’t go out today: you have a fever.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U8). Sin revisión nativa. Revisar: «no tomes» como forma estándar del imperativo negativo con vos (frente a «no tomés», coloquial); «el resfrío» y «el remedio» como lo habitual en la Argentina; «la panza» aceptada para «el estómago»; «la receta» (también «recipe»); si «me siento» puede confundirse con sentarse (se evitó «I sit» como distractor); la médica habla de usted («tome», «descanse»).',
    },
    words: [
      w(
        'es-me-duele',
        'me duele',
        'it hurts',
        'Me duele la cabeza.',
        'I have a headache.',
        ['health'],
        { acceptedTranslations: ['my… hurts'], acceptedTexts: ['me duelen'], emoji: '🤕' },
      ),
      w('es-la-cabeza', 'la cabeza', 'the head', '¿Te duele la cabeza?', 'Does your head hurt?', [
        'body',
      ]),
      w(
        'es-la-espalda',
        'la espalda',
        'the back',
        'Me duele mucho la espalda.',
        'My back hurts a lot.',
        ['body'],
      ),
      w(
        'es-el-estomago',
        'el estómago',
        'the stomach',
        'Me duele el estómago: comí mucho.',
        'My stomach hurts: I ate too much.',
        ['body'],
        { acceptedTexts: ['la panza'] },
      ),
      w(
        'es-la-garganta',
        'la garganta',
        'the throat',
        'Me duele la garganta y no puedo hablar.',
        'My throat hurts and I can’t talk.',
        ['body'],
      ),
      w(
        'es-los-dientes',
        'los dientes',
        'the teeth',
        'Me duelen los dientes.',
        'My teeth hurt.',
        ['body'],
        { emoji: '🦷' },
      ),
      w(
        'es-la-pierna',
        'la pierna',
        'the leg',
        'Me duele la pierna derecha.',
        'My right leg hurts.',
        ['body'],
        { emoji: '🦵' },
      ),
      w('es-el-brazo', 'el brazo', 'the arm', 'Me duelen los brazos.', 'My arms hurt.', ['body'], {
        emoji: '💪',
      }),
      w(
        'es-la-fiebre',
        'la fiebre',
        'fever',
        'Tengo fiebre desde ayer.',
        'I’ve had a fever since yesterday.',
        ['health'],
        { acceptedTranslations: ['a temperature', 'a fever'], emoji: '🌡️' },
      ),
      w(
        'es-el-resfrio',
        'el resfrío',
        'a cold',
        'Tengo un resfrío y me duele la garganta.',
        'I have a cold and my throat hurts.',
        ['health', 'argentina'],
        { acceptedTranslations: ['the cold (illness)'], emoji: '🤧' },
      ),
      w(
        'es-el-remedio',
        'el remedio',
        'the medicine',
        'Tomo el remedio tres veces por día.',
        'I take the medicine three times a day.',
        ['health', 'argentina'],
        { emoji: '💊' },
      ),
      w(
        'es-la-receta',
        'la receta',
        'the prescription',
        'Acá tiene la receta.',
        'Here is your prescription.',
        ['health'],
      ),
      w('es-me-siento', 'me siento', 'I feel', 'Hoy me siento mal.', 'I feel bad today.', [
        'health',
      ]),
      w(
        'es-enfermo',
        'enfermo',
        'sick',
        'Estoy enfermo: no puedo ir a trabajar.',
        'I’m sick: I can’t go to work.',
        ['health'],
        { acceptedTranslations: ['ill'], acceptedTexts: ['enferma', 'enfermos', 'enfermas'] },
      ),
      w(
        'es-descansa',
        'descansá',
        'rest, informal',
        'Estás muy cansado: descansá.',
        'You’re very tired: get some rest.',
        ['imperative', 'voseo'],
      ),
      w(
        'es-no-tomes',
        'no tomes',
        "don't take, informal",
        'No tomes café a la noche.',
        'Don’t drink coffee at night.',
        ['imperative'],
        { acceptedTranslations: ["don't drink"] },
      ),
      w(
        'es-que-te-mejores',
        '¡que te mejores!',
        'get well soon!',
        '¿Estás enfermo? ¡Que te mejores!',
        'Are you sick? Get well soon!',
        ['health', 'subjunctive'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Me duele la cabeza',
        objective: 'Say what hurts with me duele and me duelen.',
        intro: {
          explanation:
            'To say something hurts, Spanish turns the sentence around, like gustar: me duele la cabeza is literally “the head hurts me”. Use duele with one thing and duelen with more than one: me duelen los dientes. With parts of the body Spanish uses the article, not my: me duele la cabeza, not mi cabeza. To ask a friend: ¿te duele…?',
          examples: [
            { target: 'Me duele la cabeza.', base: 'I have a headache.' },
            { target: '¿Te duelen los dientes?', base: 'Do your teeth hurt?' },
          ],
        },
        takeaways: [
          'You say what hurts with me duele + one thing and me duelen + several.',
          'You use la, el or los with parts of the body, not mi.',
        ],
        exercises: [
          ex.translationChoice(
            'me duele',
            'it hurts',
            ['I feel', 'I like', 'I have'],
            ['es-me-duele'],
            { id: 'es.ex.mqrwug160x5qit' },
          ),
          ex.matchPairs(
            [
              ['la cabeza', 'the head'],
              ['la espalda', 'the back'],
              ['el estómago', 'the stomach'],
              ['los dientes', 'the teeth'],
            ],
            ['es-la-cabeza', 'es-la-espalda', 'es-el-estomago', 'es-los-dientes'],
            { id: 'es.ex.bfiveoasts2hmd' },
          ),
          ex.fillBlank(
            'Me ___ los dientes.',
            'My teeth hurt.',
            'duelen',
            ['duele', 'gusta', 'encanta'],
            ['es-me-duele', 'es-los-dientes'],
            {
              id: 'es.ex.pawkwcwlj9h8r0',
              explanation:
                'Los dientes is plural, so the verb is plural too: me duelen los dientes. With one thing: me duele.',
            },
          ),
          ex.fillBlank(
            'Me duele ___ espalda.',
            'My back hurts.',
            'la',
            ['mi', 'el', 'tu'],
            ['es-me-duele', 'es-la-espalda'],
            {
              id: 'es.ex.6wm70hyadouqr7',
              explanation:
                'With parts of the body Spanish uses the article: me duele la espalda. The me already says whose back it is.',
            },
          ),
          ex.listenChoice(
            'Me duele la cabeza.',
            ['Me duele la espalda.', 'Me duelen los dientes.'],
            ['es-me-duele', 'es-la-cabeza'],
            { id: 'es.ex.80kcjv7b40mrsi' },
          ),
          ex.translationChoice(
            'el estómago',
            'the stomach',
            ['the head', 'the back', 'the teeth'],
            ['es-el-estomago'],
            { id: 'es.ex.x65wd9hzzotlgk' },
          ),
          ex.listenChoice(
            '¿Te duele el estómago?',
            ['Me duele el estómago.', '¿Te duele la cabeza?'],
            ['es-me-duele', 'es-el-estomago'],
            { id: 'es.ex.j6kcnbspy4uyqn' },
          ),
          ex.orderWords(
            'Me duele mucho el estómago.',
            'My stomach hurts a lot.',
            ['es-me-duele', 'es-el-estomago'],
            { id: 'es.ex.4qqsae1a5c5d64' },
          ),
          ex.translateWrite(
            'My head hurts.',
            'Me duele la cabeza.',
            ['es-me-duele', 'es-la-cabeza'],
            { id: 'es.ex.ceqkkn46xcius6', acceptedAnswers: ['A mí me duele la cabeza.'] },
          ),
          ex.shortAnswer(
            '¿Qué te duele?',
            'Say your teeth hurt (start with «Me»).',
            'Me duelen los dientes.',
            [
              'Me duelen los dientes',
              'Me duelen mucho los dientes.',
              'Me duelen los dientes mucho.',
            ],
            ['es-me-duele', 'es-los-dientes'],
            { id: 'es.ex.b4sxm6vqeq9p5s' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: '¿Cómo te sentís?',
        objective: 'Say how you feel and that you are sick.',
        intro: {
          explanation:
            'Me siento + bien, mal or cansado means I feel… To ask a friend: ¿cómo te sentís? Estoy enfermo or estoy enferma (I’m sick) uses estar, because it is a state, not who you are. In garganta, the g before a, o or u is hard, like the g in go.',
          examples: [
            { target: '¿Cómo te sentís? — Me siento mal.', base: 'How do you feel? — I feel bad.' },
            { target: 'Estoy enferma: me duele la garganta.', base: 'I’m sick: my throat hurts.' },
          ],
        },
        takeaways: [
          'You say how you feel with me siento bien or me siento mal.',
          'You say you are sick with estoy enfermo or estoy enferma.',
        ],
        exercises: [
          ex.translationChoice(
            'me siento',
            'I feel',
            ['it hurts', 'I want', 'I get up'],
            ['es-me-siento'],
            { id: 'es.ex.m02tcjwo1c5kj3' },
          ),
          ex.fillBlank(
            'Hoy me siento ___: me duele la cabeza.',
            'Today I feel bad: I have a headache.',
            'mal',
            ['bien', 'contento', 'muy'],
            ['es-me-siento'],
            {
              id: 'es.ex.qswt92874dqyuz',
              skill: 'vocabulary',
              explanation: 'Mal is bad, the opposite of bien. With a headache you feel mal.',
            },
          ),
          ex.translationChoice('enfermo', 'sick', ['tired', 'happy', 'serious'], ['es-enfermo'], {
            id: 'es.ex.5punvihgy5btaw',
          }),
          ex.fillBlank(
            'Mi hermana ___ enferma.',
            'My sister is sick.',
            'está',
            ['es', 'tiene', 'hay'],
            ['es-enfermo'],
            {
              id: 'es.ex.ql3nt5w39z9muy',
              explanation:
                'Being sick is a state, so Spanish uses estar: está enferma. And enferma ends in -a because it describes a woman.',
            },
          ),
          ex.matchPairs(
            [
              ['la garganta', 'the throat'],
              ['la pierna', 'the leg'],
              ['el brazo', 'the arm'],
              ['me siento', 'I feel'],
            ],
            ['es-la-garganta', 'es-la-pierna', 'es-el-brazo', 'es-me-siento'],
            { id: 'es.ex.jwm9pz15p0njoq' },
          ),
          ex.listenChoice(
            'Me duele la pierna.',
            ['Me duele la garganta.', 'Me duelen las piernas.'],
            ['es-me-duele', 'es-la-pierna'],
            { id: 'es.ex.g9m8jspe95wn7g' },
          ),
          ex.listenChoice('Estoy enfermo.', ['Estoy cansado.', 'Estoy contento.'], ['es-enfermo'], {
            id: 'es.ex.gnyzfhsj2ja4x3',
          }),
          ex.orderWords(
            'Me siento mal y me duele la garganta.',
            'I feel bad and my throat hurts.',
            ['es-me-siento', 'es-la-garganta'],
            { id: 'es.ex.yfw4qmfq80lz8r' },
          ),
          ex.translateWrite(
            'My arm hurts and I feel bad.',
            'Me duele el brazo y me siento mal.',
            ['es-el-brazo', 'es-me-siento', 'es-me-duele'],
            {
              id: 'es.ex.8v4f9oz30mkuue',
              acceptedAnswers: [
                'Me siento mal y me duele el brazo.',
                'Me duele el brazo, y me siento mal.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Cómo te sentís?',
            'Say you are sick (estoy + enfermo or enferma).',
            'Estoy enfermo.',
            [
              'Estoy enfermo',
              'Estoy enferma.',
              'Estoy enferma',
              'Me siento mal, estoy enfermo.',
              'Me siento mal, estoy enferma.',
              'Me siento enfermo.',
              'Me siento enferma.',
            ],
            ['es-enfermo'],
            { id: 'es.ex.ylntojo06k0ta4' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'En el médico',
        objective: 'Understand a doctor’s questions and instructions.',
        intro: {
          explanation:
            'At the doctor’s, people speak with usted: ¿qué le pasa?, ¿le duele…? The doctor gives instructions with the usted imperative: tome este remedio, descanse. In Argentina people say el resfrío (a cold) and el remedio (medicine); elsewhere you will also hear resfriado and medicina. La receta is the prescription (the same word means recipe). Tener fiebre, to have a fever, has no article.',
          examples: [
            { target: 'Tengo fiebre desde ayer.', base: 'I’ve had a fever since yesterday.' },
            {
              target: 'Tome el remedio tres veces por día.',
              base: 'Take the medicine three times a day.',
            },
          ],
        },
        takeaways: [
          'You understand ¿qué le pasa? and instructions like tome and descanse.',
          'You talk about a fever, a cold, medicine and a prescription.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['la fiebre', 'fever'],
              ['el resfrío', 'a cold'],
              ['el remedio', 'the medicine'],
              ['la receta', 'the prescription'],
            ],
            ['es-la-fiebre', 'es-el-resfrio', 'es-el-remedio', 'es-la-receta'],
            { id: 'es.ex.86rtg0u9kg0lfd' },
          ),
          ex.fillBlank(
            'Tengo ___ desde ayer.',
            'I’ve had a fever since yesterday.',
            'fiebre',
            ['remedio', 'receta', 'garganta'],
            ['es-la-fiebre'],
            {
              id: 'es.ex.nyjkp9dwn19zt5',
              skill: 'vocabulary',
              explanation:
                'Tener fiebre is to have a fever, with no article. Since yesterday: desde ayer.',
            },
          ),
          ex.listenChoice(
            'Tome el remedio tres veces por día.',
            ['Tomo el remedio tres veces por día.', 'Tome el remedio dos veces por día.'],
            ['es-el-remedio'],
            { id: 'es.ex.ox8bqhnuuz0dgb' },
          ),
          question(
            'es.ex.wxw4pwkegiwiks',
            CONSULTORIO,
            'What is wrong with Tomás?',
            'He has a headache and a fever',
            ['His leg hurts', 'He has a stomachache', 'His teeth hurt'],
            ['es-me-duele', 'es-la-fiebre'],
            'Tomás says “Me duele la cabeza y tengo fiebre desde ayer”.',
          ),
          question(
            'es.ex.eai7rtqpzczsgf',
            CONSULTORIO,
            'What else hurts?',
            'His throat a little, and his arms',
            ['His back', 'His legs', 'Nothing else'],
            ['es-la-garganta', 'es-el-brazo'],
            'He answers “Sí, un poco” about his throat and adds “me duelen los brazos”.',
          ),
          question(
            'es.ex.fyizlqk9c2yjqa',
            CONSULTORIO,
            'What does the doctor say he has?',
            'A cold',
            ['Nothing serious, just tiredness', 'A stomach problem', 'An accident'],
            ['es-el-resfrio'],
            'Elena says “Es un resfrío”: it’s a cold.',
          ),
          question(
            'es.ex.gtok8zmbzlyuq9',
            CONSULTORIO,
            'How often does he have to take the medicine?',
            'Three times a day',
            ['Once a day', 'Twice a day', 'Only at night'],
            ['es-el-remedio'],
            'The doctor says “Tome este remedio tres veces por día”.',
          ),
          question(
            'es.ex.uy7n4nwlbg9234',
            CONSULTORIO,
            'Can Tomás go to work tomorrow?',
            'No, he has to stay at home for two days',
            ['Yes, in the afternoon', 'Yes, with the medicine', 'Only if his fever goes down'],
            ['es-la-receta', 'es-el-remedio'],
            'Elena answers “No, tiene que quedarse en casa dos días” and gives him the prescription: “Acá tiene la receta”.',
          ),
          ex.translateWrite('I have a cold.', 'Tengo un resfrío.', ['es-el-resfrio'], {
            id: 'es.ex.zhnoar1wq6bncw',
            acceptedAnswers: ['Tengo resfrío.', 'Estoy con un resfrío.'],
          }),
          ex.shortAnswer(
            '¿Qué le pasa?',
            'You are at the doctor’s. Say you have a fever (start with «Tengo»).',
            'Tengo fiebre.',
            [
              'Tengo fiebre',
              'Tengo fiebre desde ayer.',
              'Tengo mucha fiebre.',
              'Tengo un poco de fiebre.',
            ],
            ['es-la-fiebre'],
            { id: 'es.ex.ej4rgmw1jk7o4a' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Descansá, no tomes café',
        objective: 'Give a friend health advice with the imperative.',
        intro: {
          explanation:
            'To give a friend advice, take the infinitive, drop the final r and stress the last vowel: descansar → descansá, tomar → tomá. For negative advice the verb changes its vowel: no tomes, no salgas. In Argentina you may hear no tomés in casual speech, but no tomes is the standard. With usted: tome, descanse, no tome. Careful with stress: tomá (take!, to a friend), toma (he or she takes) and tomo (I take) are three different words.',
          examples: [
            { target: 'Descansá y tomá mucha agua.', base: 'Rest and drink lots of water.' },
            { target: 'No tomes café a la noche.', base: 'Don’t drink coffee at night.' },
          ],
        },
        takeaways: [
          'You give advice to a friend with descansá or tomá, stressed on the last syllable.',
          'You say what not to do with no tomes.',
        ],
        exercises: [
          ex.translationChoice(
            'descansá',
            'rest, informal',
            ["don't take, informal", 'I rest', 'get well soon!'],
            ['es-descansa'],
            { id: 'es.ex.6aiqinh4nc09pi' },
          ),
          ex.translationChoice(
            'no tomes',
            "don't take, informal",
            ['rest, informal', 'take, informal', "I don't take"],
            ['es-no-tomes'],
            { id: 'es.ex.lv2bgrkjixszj3' },
          ),
          ex.fillBlank(
            'Estás muy cansado: ___ un poco.',
            'You’re very tired: rest a little. (to a friend)',
            'descansá',
            ['descansar', 'descanse'],
            ['es-descansa'],
            {
              id: 'es.ex.992zyaumbbptkh',
              explanation:
                'With vos the imperative is the infinitive without the r, stressed at the end: descansá. Descanse is for usted.',
            },
          ),
          ex.fillBlank(
            '___ café: te duele el estómago.',
            'Don’t drink coffee: your stomach hurts. (to a friend)',
            'No tomes',
            ['No tomá', 'Tomá', 'No tomo'],
            ['es-no-tomes', 'es-el-estomago'],
            {
              id: 'es.ex.7cdbse1vrmzrjs',
              explanation:
                'The negative imperative changes the vowel: tomá → no tomes. No tomá is not correct.',
            },
          ),
          ex.listenChoice(
            'Tomá el remedio.',
            ['Tomo el remedio.', 'No tomes el remedio.'],
            ['es-no-tomes', 'es-el-remedio'],
            { id: 'es.ex.ho9llk8i2te8ma' },
          ),
          ex.fillBlank(
            'Señor, ___ este remedio tres veces por día.',
            'Sir, take this medicine three times a day.',
            'tome',
            ['tomá', 'tomes', 'tomo'],
            ['es-el-remedio'],
            {
              id: 'es.ex.mrnp8jsltu8fsx',
              explanation:
                'With usted (señor, señora) the imperative is tome. Tomá is for vos and tomo means I take.',
            },
          ),
          ex.matchPairs(
            [
              ['descansá', 'rest, informal'],
              ['no tomes', "don't take, informal"],
              ['el remedio', 'the medicine'],
              ['la receta', 'the prescription'],
            ],
            ['es-descansa', 'es-no-tomes', 'es-el-remedio', 'es-la-receta'],
            { id: 'es.ex.4hnkjd6ybhztlv' },
          ),
          ex.orderWords(
            'Descansá y tomá mucha agua.',
            'Rest and drink lots of water.',
            ['es-descansa'],
            {
              id: 'es.ex.dtjti4sogq1x8w',
            },
          ),
          ex.translateWrite(
            'Don’t drink coffee at night. (to a friend)',
            'No tomes café a la noche.',
            ['es-no-tomes'],
            {
              id: 'es.ex.9rqd1eck9k6l3w',
              acceptedAnswers: [
                'No tomes café de noche.',
                'A la noche no tomes café.',
                'No tomés café a la noche.',
              ],
            },
          ),
          ex.shortAnswer(
            'Estoy muy cansado.',
            'Give your friend advice: tell him to rest (use vos).',
            'Descansá.',
            [
              'Descansá',
              '¡Descansá!',
              'Descansá un poco.',
              'Descansá mucho.',
              'Tenés que descansar.',
            ],
            ['es-descansa'],
            { id: 'es.ex.7m5d7cc2a2wsri' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '¡Que te mejores!',
        objective: 'Understand a message to a sick friend and wish someone well.',
        intro: {
          explanation:
            'When a friend is sick, say ¡que te mejores! (get well soon!); with usted it is ¡que se mejore! It uses a verb form you will learn later, the subjunctive: for now, learn it as a fixed expression. And in Argentina, when someone sneezes, people say ¡salud!',
          examples: [
            { target: '¿Estás enfermo? ¡Que te mejores!', base: 'Are you sick? Get well soon!' },
            {
              target: 'Descansá mucho. ¡Que te mejores!',
              base: 'Get lots of rest. Get well soon!',
            },
          ],
        },
        takeaways: [
          'You wish a friend well with ¡que te mejores!',
          'You understand advice in a message to someone who is sick.',
        ],
        exercises: [
          ex.translationChoice(
            '¡que te mejores!',
            'get well soon!',
            ['nice to meet you', 'happy birthday!', 'see you later'],
            ['es-que-te-mejores'],
            { id: 'es.ex.cxoqfse8m8zzre' },
          ),
          question(
            'es.ex.x2mdw8rdi7usci',
            MENSAJE,
            'Why does Valentina write to Tomás?',
            'Because he is sick',
            ['Because it is his birthday', 'Because he has an exam', 'Because he is on a trip'],
            ['es-enfermo'],
            'She writes “Martín dice que estás enfermo”: Martín says you are sick.',
          ),
          question(
            'es.ex.sbj3cn5gc8hp0q',
            MENSAJE,
            'What advice does Valentina give?',
            'To rest and drink lots of water',
            ['To go to the doctor', 'To go out a little', 'To eat a lot'],
            ['es-descansa'],
            'She writes “Descansá mucho y tomá mucha agua”.',
          ),
          question(
            'es.ex.x62wmo3jl8mt9b',
            MENSAJE,
            'What should Tomás not drink, and why?',
            'Coffee, because it is bad for his throat',
            [
              'Water, because it is cold',
              'Mate, because it is late',
              'Tea, because he has a fever',
            ],
            ['es-no-tomes', 'es-la-garganta'],
            'She writes “No tomes café: no es bueno para la garganta”.',
          ),
          ex.listenChoice(
            '¡Que te mejores!',
            ['¡Feliz cumpleaños!', '¡Mucho gusto!'],
            ['es-que-te-mejores'],
            { id: 'es.ex.7hc321ldodgq73' },
          ),
          ex.fillBlank(
            'Me ___ los brazos y la espalda.',
            'My arms and my back hurt.',
            'duelen',
            ['duele', 'siento', 'gusta'],
            ['es-me-duele', 'es-el-brazo', 'es-la-espalda'],
            {
              id: 'es.ex.6u6ad478s4tpvn',
              explanation:
                'Two things hurt (los brazos y la espalda), so the verb is plural: me duelen.',
            },
          ),
          ex.translationChoice(
            'la garganta',
            'the throat',
            ['the leg', 'the arm', 'the head'],
            ['es-la-garganta'],
            { id: 'es.ex.frc9vlu8x035lp' },
          ),
          ex.orderWords(
            'Me duele la pierna y tengo fiebre.',
            'My leg hurts and I have a fever.',
            ['es-la-pierna', 'es-la-fiebre'],
            { id: 'es.ex.s17pmyck07e8lz' },
          ),
          ex.translateWrite(
            'Are you sick? Get lots of rest. Get well soon!',
            '¿Estás enfermo? Descansá mucho. ¡Que te mejores!',
            ['es-enfermo', 'es-descansa', 'es-que-te-mejores'],
            {
              id: 'es.ex.9w7umqtgsmptso',
              acceptedAnswers: [
                '¿Estás enferma? Descansá mucho. ¡Que te mejores!',
                '¿Estás enfermo? Descansá mucho, ¡que te mejores!',
                '¿Estás enferma? Descansá mucho, ¡que te mejores!',
              ],
            },
          ),
          ex.shortAnswer(
            'Me duele mucho la garganta.',
            'Your friend is sick. Wish them a quick recovery.',
            '¡Que te mejores!',
            [
              'Que te mejores',
              'Que te mejores.',
              '¡Que te mejores pronto!',
              'Descansá. ¡Que te mejores!',
            ],
            ['es-que-te-mejores'],
            { id: 'es.ex.4x2bijh025cq0s' },
          ),
        ],
      },
    ],
  },
};
