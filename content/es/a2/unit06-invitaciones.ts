import type { EsUnitDef } from '../../es-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Español A2 U6 «Invitations and plans» (docs/ES_A1_A2.md): invitar (¿quieres venir…?, te invito
 * a…), aceptar (claro, con gusto), rechazar con cortesía (lo siento, no puedo, tengo que…), decir que
 * uno está libre y quedar (nos encontramos en…, nos vemos, el próximo sábado, en dos días). Futuro
 * simple introductorio (iré, haré, vendré, habrá, será): en la conversación de Latinoamérica los
 * planes se dicen sobre todo con ir a + infinitivo; el futuro simple aparece más en lo escrito, en
 * promesas y en predicciones. Variante: español neutro de Latinoamérica (tú y ustedes).
 * Pronunciación: la entonación de la invitación (sube al final) y de la respuesta cortés; el acento
 * final del futuro (iré, será).
 * Cultura: una fiesta en casa y una fiesta del barrio; los mensajes entre amigos terminan con «un
 * beso» o «un abrazo».
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const INVITACION = dialogue(
  'es.stim.a2-u6-invitacion',
  'Camila calls her friend Juan to invite him to something.',
  [
    ['Camila', 'Hola, Juan. El sábado hago una fiesta en mi casa. ¿Quieres venir?'],
    ['Juan', '¡Claro, con gusto! ¿A qué hora?'],
    ['Camila', 'A las nueve de la noche. Va a venir Martín también.'],
    ['Juan', '¿Llevo algo?'],
    ['Camila', 'Sí, si quieres, trae algo para tomar.'],
    ['Juan', 'Perfecto. ¡Nos vemos el sábado!'],
  ],
);

const MENSAJE = reading(
  'es.stim.a2-u6-mensaje',
  'message',
  'Martín answers Camila’s invitation by text message.',
  [
    'Hola, Camila. ¡Gracias por invitarme a la fiesta!',
    'Lo siento, pero el sábado no puedo: tengo que trabajar.',
    '¿Estás libre el próximo viernes?',
    'Podemos ir al cine o comer algo en Coyoacán.',
    'Si quieres, nos encontramos en la estación a las ocho.',
    '¡Un beso!',
  ],
  { from: 'Martín', to: 'Camila' },
);

const AVISO = reading(
  'es.stim.a2-u6-aviso',
  'notice',
  'A poster on the door of a neighborhood club.',
  [
    'El próximo sábado habrá una gran fiesta en la plaza del barrio.',
    'Será a las cinco de la tarde.',
    'Habrá música, baile y comida para todos.',
    'Si llueve, la fiesta será en la escuela.',
    '¡Los esperamos!',
  ],
  { title: 'Fiesta del barrio' },
);

export const ES_A2_U06: EsUnitDef = {
  names: ['Camila', 'Juan', 'Martín', 'Palermo', 'Coyoacán'],
  support: [
    'hago',
    'llevo',
    'algo',
    'si',
    'perfecto',
    'invitarme',
    'trabajar',
    'podemos',
    'gran',
    'plaza',
    'baile',
    'comida',
    'esperamos',
    'puedes',
    'invito',
    'cenar',
    'ir',
    'encontrar',
  ],
  unit: {
    position: 6,
    title: 'Invitations and plans',
    titleEn: 'Invitaciones y planes',
    description:
      'Invite friends, accept with claro or con gusto, say no politely with lo siento, no puedo, arrange when and where to meet, and recognize the simple future (iré, haré, será, habrá).',
    emoji: '🎉',
    objective:
      'You can invite someone, accept or politely decline an invitation, say when you are free, arrange a time and place to meet, and understand plans and announcements in the future.',
    grammar: {
      title: 'Inviting and the future: voy a ir and iré',
      explanation:
        'To invite a friend, ask ¿quieres venir…? (querer changes e to ie: quiero, quieres, quiere; with usted: ¿quiere venir…?; to a group: ¿quieren venir…?) or say te invito a… To accept: ¡claro! (sure, of course) or con gusto (with pleasure). To decline politely: lo siento, no puedo, plus a reason with tengo que + infinitive (tengo que trabajar). For plans, in everyday conversation Latin Americans mostly use ir a + infinitive: voy a ir, vamos a hacer una fiesta. The simple future (iré, haré, vendré, será, habrá) is more common in writing, in promises and in predictions. It is the infinitive + -é for yo, -ás for tú and -á for él / ella (invitar → invitaré, invitarás, ser → será), and a few verbs shorten the stem: hacer → haré, venir → vendré, haber → habrá (there will be). Every form is stressed on the last syllable, so it always has an accent.',
      examples: [
        {
          target: '¿Quieres venir a mi fiesta? — ¡Claro!',
          base: 'Do you want to come to my party? — Sure!',
        },
        {
          target: 'Lo siento, no puedo. Tengo que trabajar.',
          base: 'I’m sorry, I can’t. I have to work.',
        },
        {
          target: 'Mañana voy a ir al cine. Mañana iré al cine.',
          base: 'Tomorrow I’m going to the cinema. Tomorrow I’ll go to the cinema.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U6). Convertido al español neutro de Latinoamérica (tú y ustedes); sin revisión nativa. Revisar: «¡claro!» como aceptación en lugar de «dale» (rioplatense; «dale» y «de acuerdo» se aceptan en las respuestas; «vale», de España, no se usa); el imperativo «trae algo para tomar» (igual a la forma de usted del presente); «¿Llevo algo?» en una invitación; «un beso» o «un abrazo» como cierre de mensaje entre amigos; el futuro simple presentado como más escrito y para predicciones (en la conversación se prefiere «voy a + infinitivo»); Coyoacán (Ciudad de México) en el mensaje; «nos encontramos en…» con valor de propuesta («let’s meet»).',
    },
    words: [
      w(
        'es-quieres-venir',
        '¿quieres venir?',
        'do you want to come?',
        '¿Quieres venir al cine el sábado?',
        'Do you want to come to the cinema on Saturday?',
        ['invitations'],
        { acceptedTexts: ['¿querés venir?'] },
      ),
      w(
        'es-claro',
        'claro',
        'sure',
        '¿Vamos a la playa? — ¡Claro!',
        'Shall we go to the beach? — Sure!',
        ['invitations'],
        {
          acceptedTranslations: ['of course', 'OK', 'okay'],
          acceptedTexts: ['claro que sí', 'de acuerdo', 'dale'],
        },
      ),
      w(
        'es-con-gusto',
        'con gusto',
        'with pleasure',
        'Sí, con gusto.',
        'Yes, with pleasure.',
        ['invitations'],
        { acceptedTranslations: ['gladly'] },
      ),
      w(
        'es-lo-siento',
        'lo siento',
        "I'm sorry",
        'Lo siento, no puedo.',
        'I’m sorry, I can’t.',
        ['invitations'],
        { acceptedTranslations: ['sorry'] },
      ),
      w(
        'es-no-puedo',
        'no puedo',
        "I can't",
        'Hoy no puedo, tengo que trabajar.',
        'I can’t today, I have to work.',
        ['invitations'],
        { acceptedTranslations: ['I cannot'] },
      ),
      w(
        'es-estoy-libre',
        'estoy libre',
        "I'm free",
        'El domingo estoy libre.',
        'I’m free on Sunday.',
        ['invitations'],
        { acceptedTranslations: ['I am free'] },
      ),
      w(
        'es-ire',
        'iré',
        'I will go',
        'Mañana iré al banco.',
        'Tomorrow I’ll go to the bank.',
        ['future'],
        { acceptedTranslations: ["I'll go"] },
      ),
      w(
        'es-hare',
        'haré',
        'I will do',
        'El sábado haré una fiesta.',
        'On Saturday I’ll have a party.',
        ['future'],
        { acceptedTranslations: ["I'll make", 'I will make', "I'll do"] },
      ),
      w(
        'es-vendre',
        'vendré',
        'I will come',
        'Vendré a las nueve.',
        'I’ll come at nine.',
        ['future'],
        { acceptedTranslations: ["I'll come"] },
      ),
      w('es-habra', 'habrá', 'there will be', 'Mañana habrá sol.', 'It will be sunny tomorrow.', [
        'future',
      ]),
      w(
        'es-sera',
        'será',
        'it will be',
        'La fiesta será en mi casa.',
        'The party will be at my house.',
        ['future'],
        { acceptedTranslations: ["it'll be"] },
      ),
      w(
        'es-la-fiesta',
        'la fiesta',
        'the party',
        'La fiesta es el sábado.',
        'The party is on Saturday.',
        ['events'],
        { emoji: '🎉' },
      ),
      w(
        'es-invitar',
        'invitar',
        'to invite',
        'Quiero invitar a mi familia.',
        'I want to invite my family.',
        ['verbs'],
      ),
      w(
        'es-proximo',
        'próximo',
        'next',
        'Nos vemos el próximo lunes.',
        'See you next Monday.',
        ['time'],
        { acceptedTexts: ['próxima', 'próximos', 'próximas'] },
      ),
      w(
        'es-en-dos-dias',
        'en dos días',
        'in two days',
        'Me voy de viaje en dos días.',
        'I’m going on a trip in two days.',
        ['time'],
      ),
      w(
        'es-nos-vemos',
        'nos vemos',
        'see you',
        'Gracias, ¡nos vemos mañana!',
        'Thanks, see you tomorrow!',
        ['invitations'],
      ),
      w(
        'es-nos-encontramos',
        'nos encontramos',
        "let's meet",
        'Nos encontramos en la estación.',
        'Let’s meet at the station.',
        ['invitations'],
        { acceptedTranslations: ['we meet'] },
      ),
      w(
        'es-el-plan',
        'el plan',
        'the plan',
        '¿Cuál es el plan para el sábado?',
        'What’s the plan for Saturday?',
        ['invitations'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿Quieres venir?',
        objective: 'Invite a friend and accept an invitation.',
        intro: {
          explanation:
            'To invite a friend: ¿quieres venir a…? Querer changes its e to ie: quiero, quieres, quiere. With usted: ¿quiere venir?; with a group: ¿quieren venir? You can also say te invito a…, which often means you are paying. To accept: ¡claro! (sure, of course) or sí, con gusto (yes, with pleasure). In Argentina and Uruguay you will hear dale, and in Spain vale. Careful: mucho gusto is only for meeting someone. In ¿quieres venir? your voice goes up at the end, as in a yes / no question in English.',
          examples: [
            {
              target: '¿Quieres venir a mi fiesta? — ¡Claro!',
              base: 'Do you want to come to my party? — Sure!',
            },
            {
              target: 'Te invito a cenar el sábado. — Sí, con gusto.',
              base: 'Let me take you out to dinner on Saturday. — Yes, with pleasure.',
            },
          ],
        },
        takeaways: [
          'You invite a friend with ¿quieres venir…? or te invito a…',
          'You accept with claro or con gusto.',
        ],
        exercises: [
          ex.translationChoice(
            'la fiesta',
            'the party',
            ['the plan', 'the dinner', 'the trip'],
            ['es-la-fiesta'],
            { id: 'es.ex.uii7q43a2sgmu5' },
          ),
          ex.translationChoice('claro', 'sure', ['I’m sorry', 'see you', 'please'], ['es-claro'], {
            id: 'es.ex.glfubpks3aod34',
          }),
          ex.fillBlank(
            '¿___ venir a mi fiesta?',
            'Do you want to come to my party? (to a friend)',
            'Quieres',
            ['Quiero', 'Quiere', 'Vamos'],
            ['es-quieres-venir', 'es-la-fiesta'],
            {
              id: 'es.ex.sy6ek2t6865ztu',
              explanation:
                'With tú: ¿quieres venir? (querer: e → ie). Quiero is I want; quiere is for usted or él / ella, but here you are talking to a friend.',
            },
          ),
          ex.listenChoice(
            '¿Quieres venir?',
            ['¿Quiere venir?', '¿Quieres comer?', '¿Quieres salir?'],
            ['es-quieres-venir'],
            { id: 'es.ex.set660kjzl6ejl' },
          ),
          ex.matchPairs(
            [
              ['claro', 'sure'],
              ['con gusto', 'with pleasure'],
              ['la fiesta', 'the party'],
              ['invitar', 'to invite'],
            ],
            ['es-claro', 'es-con-gusto', 'es-la-fiesta', 'es-invitar'],
            { id: 'es.ex.f7ptxv12a6fnog' },
          ),
          ex.fillBlank(
            'Te invito a mi fiesta. — ¡___!',
            'I’m inviting you to my party. — Sure!',
            'Claro',
            ['Adiós', 'De nada', 'Mucho gusto'],
            ['es-claro'],
            {
              id: 'es.ex.dfzh6omow9abek',
              skill: 'vocabulary',
              explanation:
                '¡Claro! means sure, of course. Mucho gusto is only for introductions; with pleasure is con gusto.',
            },
          ),
          ex.orderWords(
            'Quiero invitar a mis padres.',
            'I want to invite my parents.',
            ['es-invitar'],
            { id: 'es.ex.yrrq8whdeabvoi' },
          ),
          ex.listenChoice(
            'Sí, con gusto.',
            ['Sí, mucho gusto.', 'No, gracias.', 'Sí, por favor.'],
            ['es-con-gusto'],
            { id: 'es.ex.ogfdrt2sb01qbb' },
          ),
          ex.translateWrite(
            'Do you want to come to the party? — Sure!',
            '¿Quieres venir a la fiesta? — ¡Claro!',
            ['es-quieres-venir', 'es-la-fiesta', 'es-claro'],
            {
              id: 'es.ex.kwfynar3zkshdr',
              acceptedAnswers: [
                '¿Quieres venir a la fiesta? ¡Claro!',
                '¿Quieres venir a la fiesta? — Claro.',
                '¿Quieres venir a la fiesta? — ¡Claro que sí!',
                '¿Quieres venir a la fiesta? — ¡De acuerdo!',
                '¿Quieres venir a la fiesta? — ¡Dale!',
                '¿Querés venir a la fiesta? — ¡Dale!',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Quieres venir a mi casa el sábado?',
            'Accept the invitation politely (e.g. «Sí, con gusto»).',
            'Sí, con gusto.',
            [
              'Con gusto.',
              '¡Sí, con gusto!',
              'Claro, con gusto.',
              '¡Claro!',
              'Claro que sí.',
              'Sí, claro.',
              'De acuerdo.',
              'Dale, con gusto.',
              'Sí, dale.',
            ],
            ['es-con-gusto'],
            { id: 'es.ex.d4d7vsfemby6p6' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Lo siento, no puedo',
        objective: 'Decline politely, give a reason and say when you are free.',
        intro: {
          explanation:
            'To say no politely, start with lo siento (I’m sorry), then no puedo (I can’t) and a reason with tengo que + infinitive (I have to): lo siento, no puedo, tengo que trabajar. With tú: ¿puedes? (can you?); poder changes o to ue, as in puedo. To say you are available: estoy libre (libre is the same for a man or a woman). In most Spanish-speaking countries a flat no sounds rude: people give a reason and suggest another plan (el plan).',
          examples: [
            {
              target: 'Lo siento, no puedo. Tengo que trabajar.',
              base: 'I’m sorry, I can’t. I have to work.',
            },
            {
              target: '¿Estás libre el domingo? — Sí, estoy libre.',
              base: 'Are you free on Sunday? — Yes, I’m free.',
            },
          ],
        },
        takeaways: [
          'You decline with lo siento, no puedo and a reason with tengo que.',
          'You say you are available with estoy libre.',
        ],
        exercises: [
          ex.translationChoice(
            'lo siento',
            "I'm sorry",
            ['with pleasure', 'see you', 'OK'],
            ['es-lo-siento'],
            { id: 'es.ex.3zdp2ezj90u1u4' },
          ),
          ex.translationChoice(
            'no puedo',
            "I can't",
            ['I don’t want to', 'I’m free', 'I don’t know'],
            ['es-no-puedo'],
            { id: 'es.ex.cwk59t0vsxxk5f' },
          ),
          ex.fillBlank(
            'Lo siento, no ___. Tengo que trabajar.',
            'I’m sorry, I can’t. I have to work.',
            'puedo',
            ['puedes', 'quiero', 'estoy'],
            ['es-lo-siento', 'es-no-puedo'],
            {
              id: 'es.ex.k6o2xzi1h8lhoa',
              explanation:
                'No puedo is I can’t (yo). Puedes is the tú form, and no quiero (I don’t want to) would sound rude.',
            },
          ),
          ex.listenChoice(
            'Lo siento, no puedo.',
            ['Lo siento, no quiero.', 'Sí, puedo.', 'Lo siento, no estoy.'],
            ['es-lo-siento', 'es-no-puedo'],
            { id: 'es.ex.42fir4a2fiui01' },
          ),
          ex.fillBlank(
            'El sábado estoy ___. ¿Vamos al cine?',
            'I’m free on Saturday. Shall we go to the cinema?',
            'libre',
            ['cansado', 'contento', 'lejos'],
            ['es-estoy-libre'],
            {
              id: 'es.ex.1grlx9nydywamz',
              skill: 'vocabulary',
              explanation:
                'Estoy libre means I’m free, available. It uses estar, like estoy cansado.',
            },
          ),
          ex.matchPairs(
            [
              ['lo siento', "I'm sorry"],
              ['no puedo', "I can't"],
              ['estoy libre', "I'm free"],
              ['el plan', 'the plan'],
            ],
            ['es-lo-siento', 'es-no-puedo', 'es-estoy-libre', 'es-el-plan'],
            { id: 'es.ex.hukxs9hgmxgg5w' },
          ),
          ex.orderWords(
            'Tengo un plan para el sábado.',
            'I have a plan for Saturday.',
            ['es-el-plan'],
            { id: 'es.ex.nubut3pl6410cq' },
          ),
          ex.listenChoice(
            '¿Estás libre el viernes?',
            ['¿Estás libre el jueves?', '¿Estás cansado el viernes?', 'Estoy libre el viernes.'],
            ['es-estoy-libre'],
            { id: 'es.ex.5rfm0hh5q1s8r6' },
          ),
          ex.translateWrite(
            'I’m sorry, I can’t. I have to work.',
            'Lo siento, no puedo. Tengo que trabajar.',
            ['es-lo-siento', 'es-no-puedo'],
            {
              id: 'es.ex.1w659qp0vt1bwa',
              acceptedAnswers: [
                'Lo siento, no puedo, tengo que trabajar.',
                'Lo siento, pero no puedo. Tengo que trabajar.',
                'Lo siento, no puedo porque tengo que trabajar.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Estás libre el domingo?',
            'Say yes, you are free (start with «Sí, estoy…»).',
            'Sí, estoy libre.',
            ['Sí, estoy libre', 'Sí, el domingo estoy libre.', 'Sí, estoy libre el domingo.'],
            ['es-estoy-libre'],
            { id: 'es.ex.fnq7d88jvt9t8f' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Nos vemos el sábado',
        objective: 'Arrange when and where to meet.',
        intro: {
          explanation:
            'To suggest a place and a time: nos encontramos en… (let’s meet at…, literally we meet): nos encontramos en la estación a las ocho. Próximo (next) goes before the noun and agrees with it: el próximo sábado, la próxima semana. En dos días means in two days from now. To say goodbye until then: nos vemos (see you), nos vemos el sábado.',
          examples: [
            {
              target: 'Nos encontramos en la estación a las ocho.',
              base: 'Let’s meet at the station at eight.',
            },
            { target: 'Nos vemos el próximo sábado.', base: 'See you next Saturday.' },
          ],
        },
        takeaways: [
          'You suggest a meeting point with nos encontramos en…',
          'You say when with el próximo…, en dos días and close with nos vemos.',
        ],
        exercises: [
          ex.translationChoice(
            'nos vemos',
            'see you',
            ['let’s meet', 'thank you', 'next'],
            ['es-nos-vemos'],
            { id: 'es.ex.m1xqwfolel7fdl' },
          ),
          ex.fillBlank(
            'Nos ___ en la estación a las ocho.',
            'Let’s meet at the station at eight.',
            'encontramos',
            ['encontrar', 'encontraron', 'vamos'],
            ['es-nos-encontramos'],
            {
              id: 'es.ex.k5m4n16zfsd3z4',
              explanation:
                'Nos encontramos (we meet) is the nosotros form of encontrarse; encontraron is they found.',
            },
          ),
          question(
            'es.ex.j93ltunkctzf1h',
            INVITACION,
            'What is Camila organizing?',
            'A party at her house on Saturday',
            ['A dinner at a restaurant', 'A trip to the beach', 'A party at Juan’s house'],
            ['es-la-fiesta', 'es-quieres-venir'],
            'Camila says “El sábado hago una fiesta en mi casa. ¿Quieres venir?”',
          ),
          question(
            'es.ex.aauvjfzwfcme7f',
            INVITACION,
            'How does Juan answer the invitation?',
            'He accepts happily',
            ['He says he can’t', 'He says maybe', 'He asks who is going'],
            ['es-claro', 'es-con-gusto'],
            'Juan answers “¡Claro, con gusto!”: sure, with pleasure.',
          ),
          ex.matchPairs(
            [
              ['próximo', 'next'],
              ['en dos días', 'in two days'],
              ['nos vemos', 'see you'],
              ['nos encontramos', "let's meet"],
            ],
            ['es-proximo', 'es-en-dos-dias', 'es-nos-vemos', 'es-nos-encontramos'],
            { id: 'es.ex.x577i2xyzxen5t' },
          ),
          ex.fillBlank(
            'Nos vemos la ___ semana.',
            'See you next week.',
            'próxima',
            ['próximo', 'próximas', 'primero'],
            ['es-proximo', 'es-nos-vemos'],
            {
              id: 'es.ex.0kmrhdidbyfghi',
              explanation:
                'Próximo agrees with the noun: semana is feminine and singular, so la próxima semana.',
            },
          ),
          ex.listenChoice(
            'Nos vemos el sábado.',
            ['Nos vemos el domingo.', 'Nos vamos el sábado.', 'Nos vemos el lunes.'],
            ['es-nos-vemos'],
            { id: 'es.ex.09bveh9wmruxed' },
          ),
          question(
            'es.ex.86m1asubp35enx',
            INVITACION,
            'What will Juan bring?',
            'Something to drink',
            ['Something to eat', 'Music', 'Nothing'],
            ['es-nos-vemos'],
            'Camila tells him “trae algo para tomar”: bring something to drink.',
          ),
          ex.translateWrite(
            'See you in two days!',
            '¡Nos vemos en dos días!',
            ['es-nos-vemos', 'es-en-dos-dias'],
            { id: 'es.ex.1b6rcfawp98g54', acceptedAnswers: ['Nos vemos en dos días.'] },
          ),
          ex.shortAnswer(
            '¿Dónde nos encontramos?',
            'Suggest meeting at the station (start with «Nos encontramos…»).',
            'Nos encontramos en la estación.',
            [
              'Nos encontramos en la estación',
              'Nos encontramos en la estación a las ocho.',
              'En la estación.',
            ],
            ['es-nos-encontramos'],
            { id: 'es.ex.pborxmo097ff4x' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Iré, haré, será',
        objective: 'Recognize and use the simple future in plans, promises and announcements.',
        intro: {
          explanation:
            'In everyday conversation, Latin Americans usually talk about plans with ir a + infinitive: voy a ir, voy a hacer una fiesta. The simple future appears more in writing, in promises and in predictions. Regular verbs add -é for yo, -ás for tú and -á for él / ella to the infinitive (ser → serás, será). Some shorten the stem: hacer → haré, venir → vendré, haber → habrá (there will be, the future of hay). The stress is always on the last syllable, which carries the accent: iré, será. Don’t mix up habrá (there will be) and había (there was).',
          examples: [
            {
              target: 'El sábado habrá música en la plaza.',
              base: 'There will be music in the square on Saturday.',
            },
            { target: 'Mañana iré al banco.', base: 'Tomorrow I’ll go to the bank.' },
          ],
        },
        takeaways: [
          'You recognize the simple future: iré, haré, vendré, será, habrá.',
          'You use voy a + infinitive for everyday plans and the simple future for promises and announcements.',
        ],
        exercises: [
          ex.translationChoice(
            'iré',
            'I will go',
            ['I went', 'I used to go', 'I will come'],
            ['es-ire'],
            { id: 'es.ex.14eodaz80o4yar' },
          ),
          ex.matchPairs(
            [
              ['haré', 'I will do'],
              ['vendré', 'I will come'],
              ['habrá', 'there will be'],
              ['será', 'it will be'],
            ],
            ['es-hare', 'es-vendre', 'es-habra', 'es-sera'],
            { id: 'es.ex.yjioylvlefd2fl' },
          ),
          ex.fillBlank(
            'Mañana ___ un día lindo.',
            'Tomorrow will be a nice day.',
            'será',
            ['era', 'fue', 'habrá'],
            ['es-sera'],
            {
              id: 'es.ex.lyeq0sulysb8et',
              explanation:
                'Será is the future of ser. Era and fue are past forms; habrá means there will be.',
            },
          ),
          ex.listenChoice(
            'Habrá música.',
            ['Había música.', 'Hay música.', 'Habrá comida.'],
            ['es-habra'],
            { id: 'es.ex.wrnar0444csq7b' },
          ),
          question(
            'es.ex.5xi7281fu590v7',
            AVISO,
            'When is the neighborhood party?',
            'Next Saturday at five in the afternoon',
            ['This Saturday at nine in the evening', 'Next Sunday at five', 'In two days'],
            ['es-proximo', 'es-sera'],
            '“El próximo sábado habrá una gran fiesta… Será a las cinco de la tarde.”',
          ),
          ex.fillBlank(
            'El domingo ___ la cena para mi familia.',
            'On Sunday I’ll make dinner for my family.',
            'haré',
            ['hice', 'iré', 'vendré'],
            ['es-hare'],
            {
              id: 'es.ex.vctu638b91fpbs',
              explanation:
                'Haré is the future of hacer (I will make / do). Hice is the preterite (I made).',
            },
          ),
          ex.listenChoice(
            'Vendré el sábado.',
            ['Vine el sábado.', 'Vendré el domingo.', 'Iré el sábado.'],
            ['es-vendre'],
            { id: 'es.ex.3meyyaqrh4uw3o' },
          ),
          question(
            'es.ex.x47lw51r89vyhq',
            AVISO,
            'What will happen if it rains?',
            'The party will be at the school',
            ['The party will be cancelled', 'There will be no music', 'It will be next week'],
            ['es-habra', 'es-la-fiesta'],
            '“Si llueve, la fiesta será en la escuela.”',
          ),
          ex.translateWrite(
            'I’ll go to your party.',
            'Iré a tu fiesta.',
            ['es-ire', 'es-la-fiesta'],
            {
              id: 'es.ex.ttes52d2ifgxgn',
              acceptedAnswers: ['Voy a ir a tu fiesta.', 'Yo iré a tu fiesta.'],
            },
          ),
          ex.shortAnswer(
            '¿Vas a venir mañana?',
            'Promise you will come, using the simple future (start with «Sí, …»).',
            'Sí, vendré.',
            ['Sí, vendré', 'Sí, mañana vendré.', 'Sí, vendré mañana.', 'Sí, voy a venir.'],
            ['es-vendre'],
            { id: 'es.ex.cuj0cke32xswze' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '¿Qué plan tienes?',
        objective: 'Understand a reply to an invitation and suggest another plan.',
        intro: {
          explanation:
            'A polite written refusal thanks first, then apologizes and suggests something else: ¡Gracias por invitarme! Lo siento, pero… ¿Estás libre el próximo viernes? Messages between friends in much of Latin America end with un beso (the written version of the kiss on the cheek) or un abrazo (a hug). Listen to the music of the sentence: an invitation rises at the end (¿quieres venir?), while a polite refusal falls gently, starting with lo siento.',
          examples: [
            {
              target: '¡Gracias por invitarme! Lo siento, pero no puedo.',
              base: 'Thanks for inviting me! I’m sorry, but I can’t.',
            },
            { target: '¿Estás libre el próximo viernes?', base: 'Are you free next Friday?' },
          ],
        },
        takeaways: [
          'You understand a polite refusal with a new proposal.',
          'You thank, apologize and suggest another plan.',
        ],
        exercises: [
          question(
            'es.ex.hh3jv1qmvypjy8',
            MENSAJE,
            'Why can’t Martín go to the party?',
            'He has to work',
            ['He is ill', 'He is travelling', 'He has another party'],
            ['es-no-puedo', 'es-lo-siento'],
            'He writes “Lo siento, pero el sábado no puedo: tengo que trabajar”.',
          ),
          question(
            'es.ex.cr0tcr1e8wx20d',
            MENSAJE,
            'What does Martín suggest?',
            'Going to the cinema or eating out next Friday',
            [
              'Going to the party next Saturday',
              'Having dinner at his house',
              'Meeting at the station on Saturday',
            ],
            ['es-proximo', 'es-estoy-libre'],
            '“¿Estás libre el próximo viernes? Podemos ir al cine o comer algo en Coyoacán.”',
          ),
          question(
            'es.ex.0zsu5kau15ns51',
            MENSAJE,
            'Where and when would they meet?',
            'At the station at eight',
            ['At Camila’s house at nine', 'In Coyoacán at five', 'At the cinema at eight'],
            ['es-nos-encontramos'],
            '“Si quieres, nos encontramos en la estación a las ocho.”',
          ),
          ex.listenChoice(
            '¿Quieres venir el próximo viernes?',
            [
              '¿Quieres venir el próximo jueves?',
              '¿Puedes venir el próximo viernes?',
              'Quiero venir el próximo viernes.',
            ],
            ['es-quieres-venir', 'es-proximo'],
            { id: 'es.ex.gzbfakh7ep06ux' },
          ),
          ex.fillBlank(
            'El ___ es ir al cine y después comer algo.',
            'The plan is to go to the cinema and then eat something.',
            'plan',
            ['fiesta', 'semana', 'noche'],
            ['es-el-plan'],
            {
              id: 'es.ex.w2salao2i6k4db',
              skill: 'vocabulary',
              explanation: 'El plan is masculine (el). Fiesta, semana and noche are feminine (la).',
            },
          ),
          ex.matchPairs(
            [
              ['¿quieres venir?', 'do you want to come?'],
              ['iré', 'I will go'],
              ['estoy libre', "I'm free"],
              ['invitar', 'to invite'],
            ],
            ['es-quieres-venir', 'es-ire', 'es-estoy-libre', 'es-invitar'],
            { id: 'es.ex.ql2llwegv1yj13' },
          ),
          ex.listenChoice(
            'Haré una fiesta.',
            ['Hice una fiesta.', 'Haré una cena.', 'Habrá una fiesta.'],
            ['es-hare', 'es-la-fiesta'],
            { id: 'es.ex.flztmjzdwmfwpz' },
          ),
          ex.fillBlank(
            'Gracias por ___. Lo siento, pero no puedo.',
            'Thanks for inviting me. I’m sorry, but I can’t.',
            'invitarme',
            ['invito', 'invitar', 'venir'],
            ['es-invitar', 'es-lo-siento'],
            {
              id: 'es.ex.ulcvmxx5o88es8',
              explanation:
                'After gracias por comes the infinitive, and me is attached to the end: invitarme (inviting me).',
            },
          ),
          ex.translateWrite(
            'Thanks for inviting me! See you on Friday.',
            '¡Gracias por invitarme! Nos vemos el viernes.',
            ['es-invitar', 'es-nos-vemos'],
            {
              id: 'es.ex.rt2otjj8rnjpvm',
              acceptedAnswers: [
                'Gracias por invitarme. Nos vemos el viernes.',
                '¡Gracias por invitarme! ¡Nos vemos el viernes!',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Quieres venir a la fiesta el sábado?',
            'Decline politely: say you are sorry, you can’t (start with «Lo siento…»).',
            'Lo siento, no puedo.',
            [
              'Lo siento, no puedo',
              'Lo siento, pero no puedo.',
              'Lo siento, no puedo. Tengo que trabajar.',
              'Lo siento, el sábado no puedo.',
            ],
            ['es-lo-siento', 'es-no-puedo'],
            { id: 'es.ex.w4gb1n9qbj72v6' },
          ),
        ],
      },
    ],
  },
};
