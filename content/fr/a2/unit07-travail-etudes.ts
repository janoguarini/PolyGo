import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Francés A2 U7 «Trabajo y estudios» (docs/FR_A1_A2.md): obligación, posibilidad y deseo con
 * devoir, pouvoir y vouloir + infinitivo (je dois, je peux, je veux) e il faut + infinitivo;
 * depuis + presente frente a il y a + pasado y pendant; conectores (d'abord, ensuite, enfin, parce
 * que); la entrevista, la pasantía, el CV. Falsos amigos: le stage, l'entretien, réussir un examen.
 * Pronunciación: je peux / je veux (p y v), il faut / il fait, deux / douze, la nasal de examen.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const ANNONCE = reading(
  'fr.stim.a2-u7-annonce',
  'ad',
  'Un aviso de empleo en la vidriera de un café.',
  [
    'Le Café Margot cherche un serveur ou une serveuse.',
    'Emploi à Lyon, du mardi au samedi, le soir.',
    'Il faut parler français et espagnol.',
    'Le salaire: 1 800 euros par mois.',
    'Les entretiens sont le lundi.',
    'Envoyez votre CV avant vendredi.',
  ],
  { title: "Offre d'emploi" },
);

const COLLEGUES = dialogue('fr.stim.a2-u7-collegues', 'Primer día de Marc en una oficina.', [
  ['Inès', 'Bonjour! Tu es le nouveau collègue?'],
  ['Marc', "Oui, je m'appelle Marc. Je fais un stage ici pendant six mois."],
  ['Inès', 'Enchantée! Moi, je travaille ici depuis trois ans.'],
  ['Marc', 'Et tu aimes le travail?'],
  ['Inès', 'Oui, beaucoup. Mes collègues sont très sympas.'],
]);

const COURRIEL = reading(
  'fr.stim.a2-u7-courriel',
  'email',
  'Hugo le escribe a su amiga Sarah.',
  [
    'Salut, Sarah!',
    "Lundi, j'ai un entretien pour un emploi à Marseille.",
    "D'abord, il faut envoyer mon CV et mon diplôme.",
    "Ensuite, je dois parler avec une ingénieure de l'entreprise.",
    'Enfin, si tout va bien, je commence le travail dans un mois!',
    'Je suis content parce que le salaire est bon.',
    'À bientôt! Hugo',
  ],
  { from: 'Hugo', to: 'Sarah' },
);

export const FR_A2_U07: FrUnitDef = {
  names: ['Margot', 'Inès', 'Marc', 'Hugo', 'Sarah', 'Marseille', 'Lyon', 'Paris', 'Nadia'],
  support: [
    'ici',
    'étudie',
    'étudier',
    'envoyer',
    'envoyez',
    'parler',
    'par',
    'réussi',
    'enfin',
    'si',
    'content',
    'nouveau',
    'offre',
  ],
  unit: {
    position: 7,
    title: 'Trabajo y estudios',
    titleEn: 'Travail et études',
    description:
      "Devoir, pouvoir, vouloir + infinitivo e il faut; depuis + presente frente a il y a y pendant; d'abord, ensuite, enfin, parce que; la entrevista, la pasantía, el CV. Falsos amigos: le stage, réussir un examen.",
    emoji: '🎓',
    objective:
      'Podés decir lo que tenés que hacer, lo que podés y lo que querés, contar desde cuándo trabajás o estudiás y hablar de una entrevista, una pasantía o un examen.',
    grammar: {
      title: 'Devoir, pouvoir, vouloir + infinitivo · depuis',
      explanation:
        'Je dois (tengo que), je peux (puedo) y je veux (quiero) van seguidos de un infinitivo: je dois travailler, je peux venir. Con tu, las formas son iguales: tu dois, tu peux, tu veux. Il faut + infinitivo es la obligación general (hay que): il faut envoyer un CV; il faut + sustantivo, lo que hace falta: il faut un diplôme. Para algo que empezó y sigue, el francés usa el presente con depuis: je travaille ici depuis deux ans (trabajo acá desde hace dos años). Para algo terminado, passé composé con il y a (hace) o pendant (durante).',
      examples: [
        { target: 'Je dois travailler samedi.', base: 'Tengo que trabajar el sábado.' },
        { target: 'Il faut envoyer ton CV.', base: 'Hay que mandar tu currículum.' },
        { target: 'Je travaille ici depuis deux ans.', base: 'Trabajo acá desde hace dos años.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U7). Sin revisión nativa: revisar la traducción de la réunion como «la reunión de trabajo» (se evita el cognado exacto en los repasos), el aviso de empleo (registro y formato del sueldo, «1 800 euros par mois») y la explicación de réussir (aprobar) frente a passer un examen (rendir).',
    },
    words: [
      w(
        'fr-je-dois',
        'je dois',
        'tengo que',
        'Je dois prendre le train à huit heures.',
        'Tengo que tomar el tren a las ocho.',
        ['verbs', 'obligation'],
        { acceptedTranslations: ['debo'] },
      ),
      w(
        'fr-je-peux',
        'je peux',
        'puedo',
        'Je peux venir demain?',
        '¿Puedo venir mañana?',
        ['verbs'],
        { acceptedTranslations: ['yo puedo'] },
      ),
      w(
        'fr-je-veux',
        'je veux',
        'quiero',
        'Je veux faire un stage à Paris.',
        'Quiero hacer una pasantía en París.',
        ['verbs'],
        { acceptedTranslations: ['yo quiero'] },
      ),
      w(
        'fr-il-faut',
        'il faut',
        'hay que',
        'Il faut prendre le métro.',
        'Hay que tomar el subte.',
        ['obligation'],
        { acceptedTranslations: ['es necesario'] },
      ),
      w(
        'fr-depuis',
        'depuis',
        'desde hace',
        'Je travaille ici depuis deux ans.',
        'Trabajo acá desde hace dos años.',
        ['time'],
        { acceptedTranslations: ['desde'] },
      ),
      w(
        'fr-pendant',
        'pendant',
        'durante',
        "J'ai fait un stage pendant trois mois.",
        'Hice una pasantía durante tres meses.',
        ['time'],
      ),
      w(
        'fr-l-entretien',
        "l'entretien",
        'la entrevista',
        "J'ai un entretien demain à dix heures.",
        'Mañana tengo una entrevista a las diez.',
        ['work', 'm'],
        { acceptedTranslations: ['la entrevista de trabajo'] },
      ),
      w(
        'fr-le-stage',
        'le stage',
        'la pasantía',
        'Je fais un stage dans une entreprise.',
        'Hago una pasantía en una empresa.',
        ['work', 'm'],
        { acceptedTranslations: ['las prácticas'] },
      ),
      w(
        'fr-le-cv',
        'le CV',
        'el currículum',
        "C'est mon CV.",
        'Este es mi currículum.',
        ['work', 'm'],
        { acceptedTranslations: ['el CV'] },
      ),
      w(
        'fr-le-salaire',
        'le salaire',
        'el sueldo',
        "C'est un bon salaire.",
        'Es un buen sueldo.',
        ['work', 'm'],
        { acceptedTranslations: ['el salario'] },
      ),
      w(
        'fr-le-collegue',
        'le collègue',
        'el compañero de trabajo',
        "Ma collègue s'appelle Nadia.",
        'Mi compañera de trabajo se llama Nadia.',
        ['work'],
        {
          acceptedTranslations: ['la compañera de trabajo', 'el colega'],
          acceptedTexts: ['la collègue'],
        },
      ),
      w(
        'fr-la-reunion',
        'la réunion',
        'la reunión de trabajo',
        'La réunion commence à neuf heures.',
        'La reunión empieza a las nueve.',
        ['work', 'f'],
      ),
      w(
        'fr-l-universite',
        "l'université",
        'la universidad',
        "Ma sœur étudie à l'université.",
        'Mi hermana estudia en la universidad.',
        ['studies', 'f'],
        { acceptedTranslations: ['la facultad'] },
      ),
      w(
        'fr-l-examen',
        "l'examen",
        'el examen',
        "Demain, j'ai un examen.",
        'Mañana tengo un examen.',
        ['studies', 'm'],
        { emoji: '📝' },
      ),
      w(
        'fr-reussir',
        'réussir',
        'aprobar',
        "Je veux réussir l'examen.",
        'Quiero aprobar el examen.',
        ['studies', 'verbs'],
        { acceptedTranslations: ['tener éxito'] },
      ),
      w(
        'fr-le-diplome',
        'le diplôme',
        'el título',
        "J'ai mon diplôme depuis un an.",
        'Tengo el título desde hace un año.',
        ['studies', 'm'],
        { acceptedTranslations: ['el diploma'] },
      ),
      w(
        'fr-l-emploi',
        "l'emploi",
        'el empleo',
        'Je cherche un emploi à Lyon.',
        'Busco empleo en Lyon.',
        ['work', 'm'],
        { acceptedTranslations: ['el puesto'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Je dois, je peux, je veux',
        objective: 'Decir lo que tenés que hacer, lo que podés y lo que querés.',
        intro: {
          explanation:
            'Je dois (tengo que), je peux (puedo) y je veux (quiero) van seguidos de un infinitivo: je dois travailler, je peux venir, je veux partir. Con tu, las formas son iguales: tu dois, tu peux, tu veux. En la negación, ne… pas rodea al verbo conjugado: je ne peux pas venir. Pronunciación: peux y veux sólo se distinguen por la primera consonante (p / v), y la x final no suena.',
          examples: [
            { target: 'Je dois travailler samedi.', base: 'Tengo que trabajar el sábado.' },
            { target: 'Tu peux venir à la réunion?', base: '¿Podés venir a la reunión?' },
          ],
        },
        takeaways: [
          'Usás je dois, je peux y je veux + infinitivo.',
          'Distinguís peux y veux al oído.',
        ],
        exercises: [
          ex.translationChoice(
            'je dois',
            'tengo que',
            ['puedo', 'quiero', 'hay que'],
            ['fr-je-dois'],
            { id: 'fr.ex.rx8x6fm5iy01rm' },
          ),
          ex.listenChoice(
            'Je peux venir.',
            ['Je veux venir.', 'Je dois venir.', 'Je viendrai.'],
            ['fr-je-peux'],
            {
              id: 'fr.ex.n79mcttk7cptlt',
              explanation: 'Peux empieza con p y veux, con v: es la única diferencia.',
            },
          ),
          ex.matchPairs(
            [
              ['je dois', 'tengo que'],
              ['je peux', 'puedo'],
              ['je veux', 'quiero'],
              ['la réunion', 'la reunión de trabajo'],
            ],
            ['fr-je-dois', 'fr-je-peux', 'fr-je-veux', 'fr-la-reunion'],
            { id: 'fr.ex.s8ke5n97is2846' },
          ),
          ex.fillBlank(
            'Je ___ travailler samedi: il y a une réunion.',
            'Tengo que trabajar el sábado: hay una reunión.',
            'dois',
            ['suis', 'ai'],
            ['fr-je-dois', 'fr-la-reunion'],
            {
              id: 'fr.ex.igcoz4wk3z8xeo',
              explanation: 'Tener que + infinitivo: je dois travailler.',
            },
          ),
          ex.fillBlank(
            'Tu peux ___ à la réunion?',
            '¿Podés venir a la reunión?',
            'venir',
            ['viendrai', 'vas'],
            ['fr-je-peux', 'fr-la-reunion'],
            {
              id: 'fr.ex.o907mz7rzrdk07',
              explanation: 'Después de peux, dois o veux va el infinitivo: venir.',
            },
          ),
          ex.translationChoice('je veux', 'quiero', ['puedo', 'tengo que', 'iré'], ['fr-je-veux'], {
            id: 'fr.ex.6edhkb52jvhjlh',
          }),
          ex.translationChoice(
            'la réunion',
            'la reunión de trabajo',
            ['la fiesta', 'la cita', 'el examen'],
            ['fr-la-reunion'],
            { id: 'fr.ex.btrkxuj40uqfp3' },
          ),
          ex.orderWords(
            'Je ne peux pas venir à la réunion.',
            'No puedo ir a la reunión.',
            ['fr-je-peux', 'fr-la-reunion'],
            { id: 'fr.ex.d6r6jt3qqmavng' },
          ),
          ex.translateWrite(
            'Tengo que ir a la reunión.',
            'Je dois aller à la réunion.',
            ['fr-je-dois', 'fr-la-reunion'],
            { id: 'fr.ex.rfpxuetywz042p', acceptedAnswers: ['Je dois venir à la réunion.'] },
          ),
          ex.shortAnswer(
            'Tu peux venir samedi?',
            '¿Podés venir el sábado? (Respondé que no, que tenés que trabajar.)',
            'Non, je dois travailler.',
            [
              'Non, désolé, je dois travailler.',
              'Non, désolée, je dois travailler.',
              'Non, je ne peux pas. Je dois travailler.',
              'Désolé, je ne peux pas, je dois travailler.',
              'Désolée, je ne peux pas, je dois travailler.',
            ],
            ['fr-je-dois'],
            { id: 'fr.ex.co9crg8it7mz7c' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Il faut un CV',
        objective: 'Hablar de lo que hace falta para conseguir un empleo.',
        intro: {
          explanation:
            "Il faut + infinitivo es la obligación general, sin persona (hay que): il faut envoyer un CV. Con un sustantivo dice lo que hace falta: il faut un diplôme. Nunca cambia de forma. Ojo al oído: il faut y il fait se distinguen por la vocal, y en los dos la t final no suena. Falso amigo: l'entretien es la entrevista de trabajo, no el entretenimiento.",
          examples: [
            { target: 'Il faut envoyer ton CV.', base: 'Hay que mandar tu currículum.' },
            {
              target: "Pour l'emploi, il faut un entretien.",
              base: 'Para el puesto hace falta una entrevista.',
            },
          ],
        },
        takeaways: [
          'Decís lo que hay que hacer con il faut + infinitivo.',
          "Hablás de l'emploi, le CV, l'entretien y le salaire.",
        ],
        exercises: [
          ex.translationChoice(
            'il faut',
            'hay que',
            ['tengo que', 'quiero', 'puedo'],
            ['fr-il-faut'],
            {
              id: 'fr.ex.xvx0989mqmgnpq',
              explanation: 'Il faut es impersonal (hay que); je dois es personal (tengo que).',
            },
          ),
          ex.listenChoice(
            'Il faut un CV.',
            ['Il fait un CV.', 'Il a un CV.'],
            ['fr-il-faut', 'fr-le-cv'],
            {
              id: 'fr.ex.jt8vxzf177c13h',
              explanation: 'Il faut (hace falta) e il fait (hace) sólo cambian la vocal.',
            },
          ),
          ex.matchPairs(
            [
              ['il faut', 'hay que'],
              ['le CV', 'el currículum'],
              ["l'emploi", 'el empleo'],
              ["l'entretien", 'la entrevista'],
            ],
            ['fr-il-faut', 'fr-le-cv', 'fr-l-emploi', 'fr-l-entretien'],
            { id: 'fr.ex.l4kgcgxkg5xavq' },
          ),
          ex.fillBlank(
            "Pour l'emploi, il faut ___ français.",
            'Para el puesto hay que hablar francés.',
            'parler',
            ['parle', 'ai parlé'],
            ['fr-il-faut', 'fr-l-emploi'],
            {
              id: 'fr.ex.o5q2xhpc8mmt0w',
              explanation: 'Después de il faut va el infinitivo: il faut parler.',
            },
          ),
          ex.translationChoice(
            "l'entretien",
            'la entrevista',
            ['el entretenimiento', 'el empleo', 'el currículum'],
            ['fr-l-entretien'],
            {
              id: 'fr.ex.1lpyt2czo3wd5s',
              explanation: "Falso amigo: l'entretien es la entrevista de trabajo.",
            },
          ),
          question(
            'fr.ex.cp51lbt1lm7jl9',
            ANNONCE,
            '¿Qué hay que saber hacer para el puesto?',
            'Hablar francés y español.',
            ['Cocinar.', 'Tener un título universitario.', 'Hablar inglés.'],
            ['fr-il-faut', 'fr-l-emploi'],
            'El aviso dice «Il faut parler français et espagnol».',
          ),
          question(
            'fr.ex.ou6b8qvynxrbcx',
            ANNONCE,
            '¿Cuánto es el sueldo?',
            '1800 euros por mes.',
            ['1800 euros por semana.', '800 euros por mes.', 'No lo dice.'],
            ['fr-le-salaire'],
            'El aviso dice «Le salaire: 1 800 euros par mois».',
          ),
          ex.translationChoice(
            'le salaire',
            'el sueldo',
            ['el empleo', 'la entrevista', 'el currículum'],
            ['fr-le-salaire'],
            { id: 'fr.ex.n5gl9tg7e31ikv' },
          ),
          ex.translateWrite(
            'Hay que tomar el subte.',
            'Il faut prendre le métro.',
            ['fr-il-faut'],
            {
              id: 'fr.ex.ue3mt53dsv4fdp',
            },
          ),
          ex.shortAnswer(
            "Qu'est-ce qu'il faut pour l'emploi?",
            '¿Qué hace falta para el puesto? (Respondé que hace falta un currículum.)',
            'Il faut un CV.',
            ['Un CV.', "Pour l'emploi, il faut un CV."],
            ['fr-il-faut', 'fr-le-cv'],
            { id: 'fr.ex.nbt1pj51snvoyg' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Depuis deux ans',
        objective: 'Decir desde cuándo hacés algo y cuánto duró.',
        intro: {
          explanation:
            "Para algo que empezó en el pasado y sigue hoy, el francés usa el presente con depuis: je travaille ici depuis deux ans (trabajo acá desde hace dos años). Para algo terminado, passé composé con pendant (durante): j'ai fait un stage pendant six mois. Falso amigo: le stage es la pasantía, y le collègue (la collègue), el compañero o la compañera de trabajo.",
          examples: [
            {
              target: 'Je travaille ici depuis deux ans.',
              base: 'Trabajo acá desde hace dos años.',
            },
            {
              target: "J'ai fait un stage pendant six mois.",
              base: 'Hice una pasantía durante seis meses.',
            },
          ],
        },
        takeaways: [
          'Usás depuis + presente para algo que sigue.',
          'Usás pendant para una duración cerrada.',
        ],
        exercises: [
          ex.translationChoice(
            'depuis',
            'desde hace',
            ['durante', 'dentro de', 'todavía no'],
            ['fr-depuis'],
            { id: 'fr.ex.krdxlwssakxb89' },
          ),
          ex.translationChoice(
            'le stage',
            'la pasantía',
            ['el escenario', 'el sueldo', 'el empleo'],
            ['fr-le-stage'],
            {
              id: 'fr.ex.kqep7tleammvo9',
              explanation: 'Falso amigo: le stage es la pasantía (las prácticas).',
            },
          ),
          ex.listenChoice(
            'Je travaille ici depuis deux ans.',
            ['Je travaille ici depuis douze ans.', 'Je travaille ici depuis deux mois.'],
            ['fr-depuis'],
            {
              id: 'fr.ex.dwap4czcebwy8a',
              explanation: 'Deux tiene una sola vocal; douze termina con un sonido z.',
            },
          ),
          ex.fillBlank(
            'Je travaille ici ___ trois ans.',
            'Trabajo acá desde hace tres años.',
            'depuis',
            ['pendant', 'dans'],
            ['fr-depuis'],
            {
              id: 'fr.ex.mmrsuiv5i6fd0q',
              explanation: 'Algo que sigue hoy: presente + depuis.',
            },
          ),
          ex.fillBlank(
            "J'ai fait un stage ___ six mois.",
            'Hice una pasantía durante seis meses.',
            'pendant',
            ['depuis', 'dans'],
            ['fr-pendant', 'fr-le-stage'],
            {
              id: 'fr.ex.z3hhm9ltj7v56u',
              explanation: 'Algo terminado con una duración: passé composé + pendant.',
            },
          ),
          ex.matchPairs(
            [
              ['depuis', 'desde hace'],
              ['pendant', 'durante'],
              ['le stage', 'la pasantía'],
              ['le collègue', 'el compañero de trabajo'],
            ],
            ['fr-depuis', 'fr-pendant', 'fr-le-stage', 'fr-le-collegue'],
            { id: 'fr.ex.aujbf2ylkdb0n5' },
          ),
          question(
            'fr.ex.98clqcz3feeezv',
            COLLEGUES,
            '¿Cuánto tiempo va a durar la pasantía de Marc?',
            'Seis meses.',
            ['Tres años.', 'Tres meses.', 'Un año.'],
            ['fr-pendant', 'fr-le-stage'],
            'Marc dice «Je fais un stage ici pendant six mois».',
          ),
          question(
            'fr.ex.c9mbc6wgg5mn5i',
            COLLEGUES,
            '¿Desde cuándo trabaja Inès en la oficina?',
            'Desde hace tres años.',
            ['Desde hace seis meses.', 'Empieza hoy.', 'Desde hace un año.'],
            ['fr-depuis', 'fr-le-collegue'],
            'Inès dice «je travaille ici depuis trois ans».',
          ),
          ex.translateWrite(
            'Trabajo en la empresa desde hace un año.',
            "Je travaille dans l'entreprise depuis un an.",
            ['fr-depuis'],
            {
              id: 'fr.ex.i10flb9t3f406v',
              acceptedAnswers: ["Je travaille à l'entreprise depuis un an."],
            },
          ),
          ex.shortAnswer(
            'Tu habites à Lyon depuis quand?',
            '¿Desde cuándo vivís en Lyon? (Respondé que desde hace dos años.)',
            "J'habite à Lyon depuis deux ans.",
            ['Depuis deux ans.', "J'habite ici depuis deux ans."],
            ['fr-depuis'],
            { id: 'fr.ex.dnjqew43mvhs69' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: "Réussir l'examen",
        objective: 'Hablar de la universidad, los exámenes y el título.',
        intro: {
          explanation:
            "Falso amigo: réussir un examen es aprobarlo (passer un examen es rendirlo, no aprobarlo). Le diplôme es el título, y l'université es femenino: à l'université. Pronunciación: en examen, la x suena como gz y el final -en es una vocal nasal, como la de vin.",
          examples: [
            { target: "Je veux réussir l'examen.", base: 'Quiero aprobar el examen.' },
            {
              target: "Ma sœur étudie à l'université.",
              base: 'Mi hermana estudia en la universidad.',
            },
          ],
        },
        takeaways: ['Decís aprobar con réussir.', "Hablás de l'université, l'examen y le diplôme."],
        exercises: [
          ex.translationChoice(
            'réussir',
            'aprobar',
            ['rendir', 'reunir', 'estudiar'],
            ['fr-reussir'],
            {
              id: 'fr.ex.sc1x326zgiqg1u',
              explanation: 'Réussir un examen es aprobarlo; no tiene nada que ver con reunir.',
            },
          ),
          ex.listenChoice(
            "J'ai réussi l'examen.",
            ["J'ai fini l'examen.", "Je veux réussir l'examen.", "Je dois réussir l'examen."],
            ['fr-reussir', 'fr-l-examen'],
            { id: 'fr.ex.sm8c47hhkqc6qj' },
          ),
          ex.fillBlank(
            "Je veux ___ l'examen.",
            'Quiero aprobar el examen.',
            'réussir',
            ['réussi', 'finis'],
            ['fr-reussir', 'fr-l-examen'],
            {
              id: 'fr.ex.nmlg1q2b9vm33u',
              explanation:
                "Después de je veux va el infinitivo: réussir. Réussi es el participio (j'ai réussi).",
            },
          ),
          ex.matchPairs(
            [
              ["l'université", 'la universidad'],
              ["l'examen", 'el examen'],
              ['réussir', 'aprobar'],
              ['le diplôme', 'el título'],
            ],
            ['fr-l-universite', 'fr-l-examen', 'fr-reussir', 'fr-le-diplome'],
            { id: 'fr.ex.hv6507ynx69olm' },
          ),
          ex.translationChoice(
            'le diplôme',
            'el título',
            ['el examen', 'la universidad', 'el sueldo'],
            ['fr-le-diplome'],
            { id: 'fr.ex.cvxm7jxsp6oei1' },
          ),
          ex.fillBlank(
            "Pour réussir l'examen, il ___ étudier.",
            'Para aprobar el examen hay que estudiar.',
            'faut',
            ['fait', 'est'],
            ['fr-il-faut', 'fr-reussir'],
            {
              id: 'fr.ex.zfzsqh8w04042b',
              explanation: 'Hay que = il faut. Il fait se usa con el clima o con faire.',
            },
          ),
          ex.orderWords(
            "J'ai mon diplôme depuis un an.",
            'Tengo el título desde hace un año.',
            ['fr-le-diplome', 'fr-depuis'],
            { id: 'fr.ex.zxplo3hdhp7opb' },
          ),
          ex.translationChoice(
            "l'université",
            'la universidad',
            ['la escuela', 'la empresa', 'la oficina'],
            ['fr-l-universite'],
            { id: 'fr.ex.lk5m2y003q9ujm' },
          ),
          ex.translateWrite(
            'Quiero aprobar el examen.',
            "Je veux réussir l'examen.",
            ['fr-je-veux', 'fr-reussir', 'fr-l-examen'],
            { id: 'fr.ex.lb84eel8q9yxwp' },
          ),
          ex.shortAnswer(
            "Tu as réussi l'examen?",
            '¿Aprobaste el examen? (Respondé que sí.)',
            "Oui, j'ai réussi l'examen.",
            ["Oui, j'ai réussi!", "Oui, j'ai réussi."],
            ['fr-reussir', 'fr-l-examen'],
            { id: 'fr.ex.cystl6jzfjloj1' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: "D'abord, ensuite, enfin",
        objective: 'Contar los pasos de una búsqueda de empleo y dar razones.',
        intro: {
          explanation:
            "Para ordenar los pasos: d'abord (primero), ensuite (después) y enfin (por último). Para dar una razón: parce que (porque); delante de vocal, parce qu': parce qu'il faut travailler. En enfin hay dos nasales distintas: en- suena como la preposición en (en France) y -fin, como vin.",
          examples: [
            {
              target: "D'abord, j'ai un entretien. Ensuite, une réunion.",
              base: 'Primero tengo una entrevista. Después, una reunión.',
            },
            {
              target: 'Je ne peux pas venir parce que je dois travailler.',
              base: 'No puedo ir porque tengo que trabajar.',
            },
          ],
        },
        takeaways: [
          "Ordenás los pasos con d'abord, ensuite y enfin.",
          'Das razones con parce que.',
        ],
        exercises: [
          question(
            'fr.ex.4p2fgdb61wxuj9',
            COURRIEL,
            '¿Qué tiene Hugo el lunes?',
            'Una entrevista de trabajo.',
            ['Un examen.', 'Una reunión con sus compañeros.', 'Una fiesta.'],
            ['fr-l-entretien', 'fr-l-emploi'],
            "Hugo escribe «Lundi, j'ai un entretien pour un emploi».",
          ),
          question(
            'fr.ex.wilkdtivz43qnm',
            COURRIEL,
            '¿Qué tiene que hacer primero?',
            'Mandar su currículum y su título.',
            ['Hablar con una ingeniera.', 'Empezar a trabajar.', 'Rendir un examen.'],
            ['fr-il-faut', 'fr-le-cv', 'fr-le-diplome'],
            "Escribe «D'abord, il faut envoyer mon CV et mon diplôme».",
          ),
          question(
            'fr.ex.j0to4c0i9yo44j',
            COURRIEL,
            '¿Por qué está contento Hugo?',
            'Porque el sueldo es bueno.',
            [
              'Porque aprobó un examen.',
              'Porque ya tiene el puesto.',
              'Porque se va de vacaciones.',
            ],
            ['fr-le-salaire'],
            'Escribe «Je suis content parce que le salaire est bon».',
          ),
          ex.listenChoice(
            "D'abord, j'ai une réunion.",
            [
              "Ensuite, j'ai une réunion.",
              "D'abord, j'ai un entretien.",
              "Enfin, j'ai une réunion.",
            ],
            ['fr-la-reunion'],
            { id: 'fr.ex.opafpscbnexo5c' },
          ),
          ex.fillBlank(
            'Je ne peux pas venir ___ je dois travailler.',
            'No puedo ir porque tengo que trabajar.',
            'parce que',
            ['pourquoi', 'comment'],
            ['fr-je-dois'],
            {
              id: 'fr.ex.43q0gjx3c1ohb6',
              explanation:
                'Porque (para responder) es parce que; pourquoi es por qué (para preguntar).',
            },
          ),
          question(
            'fr.ex.ya6g8bxer44jy0',
            ANNONCE,
            '¿Hasta cuándo se puede mandar el currículum al café?',
            'Hasta el viernes.',
            ['Hasta el lunes.', 'Hasta el sábado.', 'No hay fecha.'],
            ['fr-le-cv'],
            'El aviso termina con «Envoyez votre CV avant vendredi».',
          ),
          ex.orderWords(
            'Ma collègue travaille ici depuis cinq ans.',
            'Mi compañera de trabajo trabaja acá desde hace cinco años.',
            ['fr-le-collegue', 'fr-depuis'],
            { id: 'fr.ex.4os21zh20vgn9k' },
          ),
          ex.matchPairs(
            [
              ['le salaire', 'el sueldo'],
              ["l'emploi", 'el empleo'],
              ['le stage', 'la pasantía'],
              ["l'examen", 'el examen'],
            ],
            ['fr-le-salaire', 'fr-l-emploi', 'fr-le-stage', 'fr-l-examen'],
            { id: 'fr.ex.kx7sqrccv2jyb3' },
          ),
          ex.translateWrite(
            'Primero tengo una entrevista. Después tengo una reunión.',
            "D'abord, j'ai un entretien. Ensuite, j'ai une réunion.",
            ['fr-l-entretien', 'fr-la-reunion'],
            {
              id: 'fr.ex.iczaar20a549v1',
              acceptedAnswers: [
                "D'abord j'ai un entretien, ensuite j'ai une réunion.",
                "D'abord, j'ai un entretien. Ensuite, une réunion.",
              ],
            },
          ),
          ex.shortAnswer(
            'Pourquoi tu ne peux pas venir?',
            '¿Por qué no podés venir? (Respondé que es porque tenés que estudiar.)',
            'Parce que je dois étudier.',
            [
              'Je ne peux pas venir parce que je dois étudier.',
              "Parce que je dois étudier pour l'examen.",
            ],
            ['fr-je-dois'],
            { id: 'fr.ex.5zu7ojynmncoku' },
          ),
        ],
      },
    ],
  },
};
