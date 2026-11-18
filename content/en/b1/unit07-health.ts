import type { B1UnitDef } from '../../b1';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from './helpers';

/**
 * B1 U7 «Salud y bienestar» (docs/B1_EN.md): síntomas y la farmacia; consejos con should, ought to y
 * had better; hábitos saludables; comparaciones avanzadas (as … as, not as … as, much / a bit +
 * comparativo, the more …, the better …); el estrés y el descanso.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const PHARMACY = dialogue('en.stim.b1-u7-pharmacy', 'En una farmacia.', [
  ['Pharmacist', 'Hello. How can I help you?'],
  ['Ben', "I've had a bad cough for three days, and my throat hurts."],
  ['Pharmacist', 'Do you have a fever?'],
  ['Ben', 'No, I think it is just a cold.'],
  [
    'Pharmacist',
    "Take this twice a day. If you don't feel better in a week, you'd better see a doctor.",
  ],
]);

const ADVICE = reading(
  'en.stim.b1-u7-advice',
  'message',
  'Mia le responde a una amiga que se lastimó.',
  [
    'Oh no, Kate! I am sorry you are injured.',
    'You ought to rest your leg for a few days.',
    "You'd better not go to the gym this week.",
    'Put some ice on it, and call me if you need anything!',
  ],
  { from: 'Mia', to: 'Kate' },
);

const HABITS = reading(
  'en.stim.b1-u7-habits',
  'description',
  'Un texto con consejos de una revista de salud.',
  [
    'Five habits for a healthy life',
    '1. Walk every day. Walking is not as hard as running, but it is just as good for you.',
    '2. Eat more vegetables. A healthy diet is much better than any pill.',
    '3. Drink water. It is boring, but it is the best drink.',
    '4. Sleep well. The more you sleep, the better you feel.',
    '5. Laugh a lot with your friends. It is good for your body.',
  ],
  { title: 'Five healthy habits' },
);

const STRESS = dialogue('en.stim.b1-u7-stress', 'Dos compañeros de trabajo charlan.', [
  ['Sam', 'You look tired. Are you OK?'],
  ['Lucy', "I've been so stressed lately. I work twelve hours a day."],
  ['Sam', 'You ought to take a few days off. You need to relax.'],
  ['Lucy', "You're right. I'll talk to my manager tomorrow."],
]);

export const EN_B1_U07: B1UnitDef = {
  names: ['Ben', 'Mia', 'Kate', 'Sam', 'Lucy', 'Pharmacist'],
  support: [
    'throat',
    'few',
    'ice',
    'body',
    'pill',
    'boring',
    'ok',
    'without',
    'important',
    'health',
  ],
  unit: {
    position: 7,
    title: 'Salud y bienestar',
    titleEn: 'Health and well-being',
    description:
      'Síntomas y la farmacia, consejos (should, ought to, had better), hábitos saludables, comparaciones y el estrés.',
    emoji: '🧘',
    objective: 'Podés explicar síntomas, dar y pedir consejos de salud y comparar hábitos.',
    grammar: {
      title: 'Consejos y comparaciones',
      explanation:
        "Should y ought to dan consejos (ought to es más formal). Had better ('d better) es un consejo fuerte, casi una advertencia: You'd better see a doctor. Para comparar: as … as (tan … como), not as … as (no tan … como), much / a bit + comparativo (mucho / un poco más).",
      examples: [
        { target: "You'd better see a doctor.", base: 'Más vale que vayas al médico.' },
        {
          target: 'Walking is not as hard as running.',
          base: 'Caminar no es tan duro como correr.',
        },
        { target: 'I feel much better today.', base: 'Hoy me siento mucho mejor.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B1: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-ought-to',
        'ought to',
        'tendría que / debería (consejo)',
        '/ˈɔt tu/',
        undefined,
        'You ought to rest.',
        'Tendrías que descansar.',
        ['health', 'modals'],
        ['tendría que'],
      ),
      w(
        'en-had-better',
        'had better',
        'más vale que / mejor que',
        '/hæd ˈbɛtər/',
        '⚠️',
        "You'd better see a doctor.",
        'Más vale que vayas al médico.',
        ['health', 'modals'],
        ['más vale que', 'mejor que'],
      ),
      w(
        'en-healthy',
        'healthy',
        'saludable / sano',
        '/ˈhɛlθi/',
        '🥗',
        'I want to eat healthy food.',
        'Quiero comer comida saludable.',
        ['health', 'adjectives'],
        ['saludable', 'sano', 'sana'],
      ),
      w(
        'en-diet',
        'diet',
        'alimentación / dieta',
        '/ˈdaɪət/',
        undefined,
        'A good diet is important.',
        'Una buena alimentación es importante.',
        ['health'],
        ['alimentación', 'dieta'],
      ),
      w(
        'en-exercise',
        'exercise',
        'ejercicio / hacer ejercicio',
        '/ˈɛksərsaɪz/',
        '🏃',
        'I exercise three times a week.',
        'Hago ejercicio tres veces por semana.',
        ['health'],
        ['ejercicio', 'hacer ejercicio'],
      ),
      w(
        'en-work-out',
        'work out',
        'entrenar / hacer gimnasia',
        '/ˈwɜrk ˈaʊt/',
        '🏋️',
        'She works out at the gym.',
        'Entrena en el gimnasio.',
        ['health', 'phrasal-verbs'],
        ['entrenar', 'hacer gimnasia'],
      ),
      w(
        'en-weight',
        'weight',
        'peso',
        '/weɪt/',
        '⚖️',
        'Exercise is good for your weight.',
        'El ejercicio es bueno para tu peso.',
        ['health'],
      ),
      w(
        'en-lose-weight',
        'lose weight',
        'bajar de peso',
        '/ˈluz ˈweɪt/',
        undefined,
        'He wants to lose weight.',
        'Quiere bajar de peso.',
        ['health'],
        ['adelgazar'],
      ),
      w(
        'en-a-bit',
        'a bit',
        'un poco',
        '/ə ˈbɪt/',
        undefined,
        'I feel a bit tired.',
        'Me siento un poco cansado.',
        ['comparatives'],
        ['un poquito'],
      ),
      w(
        'en-symptom',
        'symptom',
        'síntoma',
        '/ˈsɪmptəm/',
        undefined,
        'What are your symptoms?',
        '¿Qué síntomas tiene?',
        ['health'],
      ),
      w(
        'en-pain',
        'pain',
        'dolor',
        '/peɪn/',
        '🤕',
        'I have a pain in my back.',
        'Tengo un dolor en la espalda.',
        ['health'],
      ),
      w(
        'en-cough',
        'cough',
        'tos / toser',
        '/kɔf/',
        '😷',
        'I have a bad cough.',
        'Tengo mucha tos.',
        ['health'],
        ['tos', 'toser'],
      ),
      w(
        'en-a-cold',
        'a cold',
        'un resfrío',
        '/ə ˈkoʊld/',
        '🤧',
        'I think I have a cold.',
        'Creo que tengo un resfrío.',
        ['health'],
        ['un resfriado', 'resfrío'],
      ),
      w(
        'en-pharmacy',
        'pharmacy',
        'farmacia',
        '/ˈfɑrməsi/',
        '💊',
        'Is there a pharmacy near here?',
        '¿Hay una farmacia cerca?',
        ['health', 'places'],
      ),
      w(
        'en-injured',
        'injured',
        'lesionado / herido',
        '/ˈɪndʒərd/',
        '🩹',
        'She was injured in the game.',
        'Se lesionó en el partido.',
        ['health'],
        ['lesionado', 'lesionada', 'herido'],
      ),
      w(
        'en-stress',
        'stress',
        'estrés',
        '/strɛs/',
        undefined,
        'Stress is bad for your health.',
        'El estrés es malo para la salud.',
        ['health'],
      ),
      w(
        'en-stressed',
        'stressed',
        'estresado / estresada',
        '/strɛst/',
        '😫',
        'I am very stressed this week.',
        'Estoy muy estresado esta semana.',
        ['health', 'feelings'],
        ['estresado', 'estresada'],
      ),
      w(
        'en-relax',
        'relax',
        'relajarse',
        '/rɪˈlæks/',
        '🛀',
        'I relax with music.',
        'Me relajo con música.',
        ['health', 'verbs'],
        ['descansar un rato'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Síntomas',
        objective: 'Explicar síntomas en una farmacia o con el médico.',
        intro: {
          explanation:
            "Para contar cómo estás: I have a cold (tengo un resfrío), I have a bad cough (tengo mucha tos), I have a pain in my back. Con el present perfect decís desde cuándo: I've had a cough for three days.",
          examples: [
            {
              target: "I've had a bad cough for three days.",
              base: 'Hace tres días que tengo mucha tos.',
            },
            { target: 'Is there a pharmacy near here?', base: '¿Hay una farmacia cerca?' },
          ],
        },
        takeaways: [
          'Explicás tus síntomas y desde cuándo los tenés.',
          'Te arreglás en una farmacia.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['cough', 'tos / toser'],
              ['pain', 'dolor'],
              ['a cold', 'un resfrío'],
              ['pharmacy', 'farmacia'],
            ],
            ['en-cough', 'en-pain', 'en-a-cold', 'en-pharmacy'],
            { id: 'en.ex.j7w1k97grmaqab' },
          ),
          ex.imageChoice('🤧', 'a cold', ['a pain', 'a fever', 'a cough'], ['en-a-cold'], {
            id: 'en.ex.ejb7ayqup486xw',
          }),
          ex.fillBlank(
            "I've ___ a bad cough for three days.",
            'Hace tres días que tengo mucha tos.',
            'had',
            ['have', 'got', 'been'],
            ['en-cough', 'en-had'],
            {
              id: 'en.ex.vnv3qaz0fqzl3z',
              explanation: "Have es irregular: had (pasado y participio). I have had → I've had.",
            },
          ),
          ex.fillBlank(
            'What are your ___? — I have a fever and a headache.',
            '¿Qué síntomas tiene? — Tengo fiebre y dolor de cabeza.',
            'symptoms',
            ['pharmacies', 'coughs', 'pains'],
            ['en-symptom', 'en-fever', 'en-headache'],
            { id: 'en.ex.7ybidr3b0kbj6l', skill: 'vocabulary' },
          ),
          question(
            'en.ex.zr3pu4sf58aufc',
            PHARMACY,
            '¿Qué síntomas tiene Ben?',
            'Tos y dolor de garganta',
            ['Fiebre y tos', 'Dolor de cabeza', 'Dolor de espalda'],
            ['en-cough', 'en-symptom'],
            "Ben dice: «I've had a bad cough for three days, and my throat hurts».",
          ),
          question(
            'en.ex.zmwco7ciwkq4ly',
            PHARMACY,
            '¿Qué cree Ben que tiene?',
            'Un resfrío',
            ['Fiebre', 'Una lesión', 'Estrés'],
            ['en-a-cold'],
            'Ben dice: «I think it is just a cold».',
          ),
          ex.listenChoice(
            'Is there a pharmacy near here?',
            [
              'Is there a hospital near here?',
              'Is there a pharmacy near the hotel?',
              'Was there a pharmacy near here?',
            ],
            ['en-pharmacy', 'en-near'],
            { id: 'en.ex.73lk31vpj3cuc3' },
          ),
          ex.shortAnswer(
            "What's the matter? (tenés un resfrío)",
            '¿Qué te pasa?',
            'I have a cold.',
            ["I've got a cold.", 'I think I have a cold.', 'A cold.'],
            ['en-a-cold'],
            { id: 'en.ex.n7m5al520pt15j' },
          ),
          ex.translateWrite(
            'Tengo un dolor en la espalda.',
            'I have a pain in my back.',
            ['en-pain', 'en-back'],
            {
              id: 'en.ex.plp6ejmvo7t18r',
              acceptedAnswers: ["I've got a pain in my back.", 'My back hurts.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Consejos',
        objective: 'Dar consejos con should, ought to y had better.',
        intro: {
          explanation:
            "Should y ought to dan un consejo: You should rest, You ought to rest. Had better ('d better) es más fuerte, avisa que si no, habrá un problema: You'd better see a doctor. En negativo: You'd better not go.",
          examples: [
            {
              target: 'You ought to rest for a few days.',
              base: 'Tendrías que descansar unos días.',
            },
            {
              target: "You'd better not go to work today.",
              base: 'Mejor que hoy no vayas a trabajar.',
            },
          ],
        },
        takeaways: [
          'Das consejos con should y ought to.',
          'Advertís con had better y had better not.',
        ],
        exercises: [
          ex.fillBlank(
            'You ought ___ rest for a few days.',
            'Tendrías que descansar unos días.',
            'to',
            ['–', 'for', 'at'],
            ['en-ought-to', 'en-rest'],
            {
              id: 'en.ex.htv7n8ti324s3o',
              explanation: 'Ought lleva to: ought to rest. Should va sin to: should rest.',
            },
          ),
          ex.fillBlank(
            "You have a fever. You'd ___ see a doctor.",
            'Tenés fiebre. Más vale que vayas al médico.',
            'better',
            ['best', 'good', 'well'],
            ['en-had-better', 'en-doctor', 'en-fever'],
            { id: 'en.ex.lr6cth3dgdglc6' },
          ),
          ex.fillBlank(
            "It's very cold. You'd better ___ go out without a jacket.",
            'Hace mucho frío. Mejor que no salgas sin campera.',
            'not',
            ["don't", 'no', "didn't"],
            ['en-had-better', 'en-jacket'],
            {
              id: 'en.ex.0mzhcblwz5b1oa',
              explanation: "Had better not + verbo: you'd better not go.",
            },
          ),
          ex.translationChoice(
            'injured',
            'lesionado / herido',
            ['enfermo / enferma', 'cansado / cansada', 'estresado / estresada'],
            ['en-injured'],
            { id: 'en.ex.srjj8dfrvy1gbd' },
          ),
          question(
            'en.ex.fkt3kb4g7yls9j',
            ADVICE,
            '¿Qué le aconseja Mia a Kate?',
            'Que descanse la pierna unos días',
            ['Que vaya al gimnasio', 'Que vaya al médico hoy', 'Que camine mucho'],
            ['en-ought-to', 'en-rest'],
            'Mia escribe: «You ought to rest your leg for a few days».',
          ),
          question(
            'en.ex.wj1pev1lvjhwsa',
            ADVICE,
            '¿Qué no debería hacer Kate esta semana?',
            'Ir al gimnasio',
            ['Ponerse hielo', 'Llamar a Mia', 'Descansar'],
            ['en-had-better', 'en-gym'],
            "Mia escribe: «You'd better not go to the gym this week».",
          ),
          ex.listenChoice(
            "You'd better see a doctor.",
            [
              'You should see a doctor.',
              "You'd better call a doctor.",
              "We'd better see a doctor.",
            ],
            ['en-had-better', 'en-doctor'],
            { id: 'en.ex.37z51655l6urzq' },
          ),
          ex.shortAnswer(
            'I have a headache. What should I do? (descansar)',
            'Me duele la cabeza. ¿Qué hago?',
            'You should rest.',
            ['You ought to rest.', "You'd better rest.", 'Rest.', 'You should go to bed.'],
            ['en-should', 'en-rest'],
            { id: 'en.ex.al92faifbc4wqt' },
          ),
          ex.translateWrite(
            'Más vale que vayas al médico.',
            "You'd better see a doctor.",
            ['en-had-better', 'en-doctor'],
            {
              id: 'en.ex.moxi1izpiobvnj',
              acceptedAnswers: [
                'You had better see a doctor.',
                "You'd better go to the doctor.",
                'You had better go to the doctor.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Hábitos saludables',
        objective: 'Hablar de alimentación, ejercicio y peso.',
        intro: {
          explanation:
            'Healthy es saludable. Diet es la alimentación (no sólo «hacer dieta»). Exercise es hacer ejercicio; work out, entrenar. Lose weight es bajar de peso.',
          examples: [
            {
              target: 'I exercise three times a week.',
              base: 'Hago ejercicio tres veces por semana.',
            },
            {
              target: 'A healthy diet is very important.',
              base: 'Una alimentación saludable es muy importante.',
            },
          ],
        },
        takeaways: [
          'Hablás de tus hábitos de alimentación y ejercicio.',
          'Usás healthy, diet, work out y lose weight.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['healthy', 'saludable / sano'],
              ['diet', 'alimentación / dieta'],
              ['weight', 'peso'],
              ['work out', 'entrenar / hacer gimnasia'],
            ],
            ['en-healthy', 'en-diet', 'en-weight', 'en-work-out'],
            { id: 'en.ex.bdkl2r6ymrjqfw' },
          ),
          ex.fillBlank(
            'I ___ three times a week.',
            'Hago ejercicio tres veces por semana.',
            'exercise',
            ['lose', 'injured', 'healthy'],
            ['en-exercise', 'en-times'],
            { id: 'en.ex.qug7dylj1nqb28', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'She ___ out at the gym every morning.',
            'Entrena en el gimnasio todas las mañanas.',
            'works',
            ['makes', 'does', 'takes'],
            ['en-work-out', 'en-gym'],
            { id: 'en.ex.xzvp52io7pa5pc', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'He wants to lose ___, so he walks every day.',
            'Quiere bajar de peso, así que camina todos los días.',
            'weight',
            ['diet', 'pain', 'symptom'],
            ['en-lose-weight', 'en-walk'],
            { id: 'en.ex.dlw2kyfjmmtqsb', skill: 'vocabulary' },
          ),
          question(
            'en.ex.irw6k3ctvo2nhu',
            HABITS,
            'Según el texto, ¿qué es mejor que cualquier pastilla?',
            'Una alimentación saludable',
            ['Dormir bien', 'Caminar todos los días', 'Tomar agua'],
            ['en-healthy', 'en-diet'],
            'El texto dice: «A healthy diet is much better than any pill».',
          ),
          ex.listenChoice(
            'I want to eat healthy food.',
            [
              'I want to eat good food.',
              'I want to cook healthy food.',
              'I wanted to eat healthy food.',
            ],
            ['en-healthy', 'en-eat'],
            { id: 'en.ex.d1mern5q1zvczu' },
          ),
          ex.orderWords(
            'Exercise is good for your weight.',
            'El ejercicio es bueno para tu peso.',
            ['en-exercise', 'en-weight'],
            { id: 'en.ex.grwmbrawbml42g' },
          ),
          ex.shortAnswer(
            'How often do you exercise? (tres veces por semana)',
            '¿Con qué frecuencia hacés ejercicio?',
            'Three times a week.',
            ['I exercise three times a week.', 'I work out three times a week.'],
            ['en-exercise', 'en-times'],
            { id: 'en.ex.gzlgyhs5wgeucm' },
          ),
          ex.translateWrite(
            'Quiere bajar de peso.',
            'He wants to lose weight.',
            ['en-lose-weight'],
            {
              id: 'en.ex.9fe6aias3e76yk',
              acceptedAnswers: ['She wants to lose weight.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Comparar hábitos',
        objective:
          'Comparar con as … as, not as … as, much / a bit + comparativo y the more…, the better…',
        intro: {
          explanation:
            'As + adjetivo + as: tan … como (Walking is as good as running). Not as … as: no tan … como. Much / a bit delante del comparativo: much better (mucho mejor), a bit tired (un poco cansado). The more…, the better…: cuanto más…, mejor…',
          examples: [
            {
              target: 'Walking is not as hard as running.',
              base: 'Caminar no es tan duro como correr.',
            },
            {
              target: 'The more you sleep, the better you feel.',
              base: 'Cuanto más dormís, mejor te sentís.',
            },
          ],
        },
        takeaways: [
          'Comparás con as … as y not as … as.',
          'Matizás: much better, a bit healthier, the more…, the better…',
        ],
        exercises: [
          ex.fillBlank(
            'Walking is not as hard ___ running.',
            'Caminar no es tan duro como correr.',
            'as',
            ['than', 'like', 'that'],
            ['en-walk', 'en-run'],
            {
              id: 'en.ex.k7yj8omm2lmp0e',
              explanation: 'As … as (tan … como); con el comparativo va than (harder than).',
            },
          ),
          ex.fillBlank(
            'I feel ___ better today. Thank you!',
            'Hoy me siento mucho mejor. ¡Gracias!',
            'much',
            ['many', 'more', 'very'],
            ['en-much', 'en-better'],
            {
              id: 'en.ex.5fppck8tyzmqij',
              explanation:
                'Much + comparativo: much better (mucho mejor). Very no va con comparativos.',
            },
          ),
          ex.fillBlank(
            'I feel ___ tired, but I am OK.',
            'Me siento un poco cansado, pero estoy bien.',
            'a bit',
            ['a lot of', 'many', 'much'],
            ['en-a-bit', 'en-tired'],
            { id: 'en.ex.dolso2v54yd6oj', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'The more you sleep, the ___ you feel.',
            'Cuanto más dormís, mejor te sentís.',
            'better',
            ['good', 'best', 'well'],
            ['en-better', 'en-sleep'],
            { id: 'en.ex.4vnn04295tkodz' },
          ),
          question(
            'en.ex.d2ul23umfpu2b0',
            HABITS,
            'Según el texto, ¿qué tiene de bueno caminar?',
            'No es tan duro como correr y es igual de bueno',
            [
              'Es más rápido que correr',
              'Es mejor que dormir',
              'Es la mejor forma de bajar de peso',
            ],
            ['en-walk', 'en-healthy'],
            'El texto dice: «Walking is not as hard as running, but it is just as good for you».',
          ),
          question(
            'en.ex.29p4k1z5tahkh4',
            HABITS,
            '¿Qué pasa cuanto más dormís, según el texto?',
            'Te sentís mejor',
            ['Tenés más hambre', 'Bajás de peso', 'Tenés menos estrés'],
            ['en-better', 'en-sleep'],
            'El texto dice: «The more you sleep, the better you feel».',
          ),
          ex.listenChoice(
            'Tea is not as sweet as juice.',
            [
              'Tea is as sweet as juice.',
              'Tea is not as hot as juice.',
              'Tea is sweeter than juice.',
            ],
            ['en-tea', 'en-juice'],
            { id: 'en.ex.0shnzzr6bdxndt' },
          ),
          ex.translateWrite(
            'Hoy me siento mucho mejor.',
            'I feel much better today.',
            ['en-much', 'en-better'],
            {
              id: 'en.ex.iq8w779ikrekid',
              acceptedAnswers: [
                'Today I feel much better.',
                "I'm feeling much better today.",
                'I am feeling much better today.',
              ],
            },
          ),
          ex.translateWrite(
            'Mi hermano es tan alto como mi papá.',
            'My brother is as tall as my father.',
            ['en-tall', 'en-brother'],
            {
              id: 'en.ex.zu9k2ssfm25w9p',
              acceptedAnswers: ['My brother is as tall as my dad.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Estrés y descanso',
        objective: 'Hablar del estrés y de cómo descansar.',
        intro: {
          explanation:
            'Stress es el estrés; stressed, estresado. Relax es relajarse. Take a few days off es tomarse unos días libres. Para aconsejar: You ought to relax, You need to take a break.',
          examples: [
            { target: "I've been so stressed lately.", base: 'Estuve muy estresado últimamente.' },
            { target: 'I relax with music.', base: 'Me relajo con música.' },
          ],
        },
        takeaways: [
          'Contás cómo te sentís cuando estás estresado.',
          'Das consejos para relajarse.',
        ],
        exercises: [
          ex.translationChoice(
            'stressed',
            'estresado / estresada',
            ['aburrido / aburrida', 'lesionado / herido', 'nervioso / nerviosa'],
            ['en-stressed'],
            { id: 'en.ex.iofz67jtk3pvhq' },
          ),
          question(
            'en.ex.v8dsk1rru11f75',
            STRESS,
            '¿Por qué está estresada Lucy?',
            'Trabaja doce horas por día',
            ['Está enferma', 'Tiene un examen', 'No duerme por un ruido'],
            ['en-stressed'],
            "Lucy dice: «I've been so stressed lately. I work twelve hours a day».",
          ),
          question(
            'en.ex.vpbgyijbtvkvmr',
            STRESS,
            '¿Qué le aconseja Sam?',
            'Tomarse unos días libres',
            ['Trabajar menos horas', 'Ir al médico', 'Hacer ejercicio'],
            ['en-ought-to', 'en-relax'],
            'Sam dice: «You ought to take a few days off. You need to relax».',
          ),
          ex.fillBlank(
            '___ is bad for your health.',
            'El estrés es malo para la salud.',
            'Stress',
            ['Diet', 'Exercise', 'Weight'],
            ['en-stress'],
            { id: 'en.ex.zbzkx5or29pfov', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'I ___ with music and a good book.',
            'Me relajo con música y un buen libro.',
            'relax',
            ['exercise', 'cough', 'lose'],
            ['en-relax', 'en-music'],
            { id: 'en.ex.it7p42y7gylbl5', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'I am very stressed this week.',
            [
              'I am very tired this week.',
              'I was very stressed this week.',
              'I am very stressed this month.',
            ],
            ['en-stressed', 'en-week'],
            { id: 'en.ex.wg1bk1i3945y4v' },
          ),
          ex.orderWords(
            'You need to relax a bit.',
            'Necesitás relajarte un poco.',
            ['en-relax', 'en-a-bit', 'en-need'],
            { id: 'en.ex.c8ve4ksh5fhnnt' },
          ),
          ex.shortAnswer(
            'How do you relax? (escuchás música)',
            '¿Cómo te relajás?',
            'I listen to music.',
            ['I relax with music.', 'I listen to music to relax.', 'Listening to music.'],
            ['en-relax', 'en-listen'],
            { id: 'en.ex.10pv665nusyje3' },
          ),
          ex.translateWrite(
            'Estuve muy estresada últimamente.',
            "I've been very stressed lately.",
            ['en-stressed', 'en-lately'],
            {
              id: 'en.ex.6ffqmvtw32uu6p',
              acceptedAnswers: [
                'I have been very stressed lately.',
                "I've been so stressed lately.",
                'I have been so stressed lately.',
              ],
            },
          ),
        ],
      },
    ],
  },
};
