import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U3 «Números y edad» (docs/FR_A1_A2.md): contar del 1 al 12 y el 20, avoir en singular
 * (j'ai, tu as, il a) y decir y preguntar la edad con avoir (j'ai vingt ans, nunca «je suis vingt»).
 * Pronunciación: six / dix cambian según lo que sigue, pares mínimos deux / douze y six / dix,
 * liaison deux‿ans, trois‿ans, neuf ans (con sonido v), il a / elle a.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const COLONIE = dialogue(
  'fr.stim.a1-u3-colonie',
  'Dos chicos se conocen en una colonia de vacaciones.',
  [
    ['Hugo', 'Salut! Tu as quel âge?'],
    ['Inès', "J'ai douze ans. Et toi?"],
    ['Hugo', "Moi, j'ai onze ans."],
    ['Inès', 'Et Lucas? Il a quel âge?'],
    ['Hugo', 'Il a dix ans.'],
  ],
  FR_A1_RATE,
);

const MESSAGE = reading(
  'fr.stim.a1-u3-message',
  'message',
  'Un mensaje de Clara a una compañera nueva del curso.',
  [
    'Salut, Giulia!',
    "Je m'appelle Clara. J'ai vingt ans.",
    "Je suis française, de Marseille, mais j'habite à Paris.",
    'Et toi, tu as quel âge?',
    'À bientôt!',
  ],
  { from: 'Clara', to: 'Giulia' },
);

export const FR_A1_U03: FrUnitDef = {
  names: ['Inès', 'Clara', 'Giulia', 'Marseille', 'Paris', 'Lyon', 'Rosario'],
  support: ['ans'],
  unit: {
    position: 3,
    title: 'Números y edad',
    titleEn: 'Les nombres',
    description:
      "Números del 1 al 12 y el 20, avoir en singular y la edad con avoir (j'ai vingt ans). Six y dix, deux y douze, liaison deux‿ans.",
    emoji: '🔢',
    objective:
      'Puedes contar del uno al doce y el veinte, decir cuántos años tienes y preguntar la edad de otra persona.',
    grammar: {
      title: 'Avoir y la edad',
      explanation:
        "La edad se dice con avoir (tener), no con être: j'ai vingt ans, nunca «je suis vingt». Avoir en singular: j'ai (je se vuelve j' delante de vocal), tu as, il a, elle a. Ans es la forma plural de an (año): un an, deux ans. Para preguntar: quel âge as-tu? (con inversión y guion) o, más coloquial, tu as quel âge? Ojo con la liaison: deux‿ans, trois‿ans, six‿ans y dix‿ans se unen con un sonido z; huit ans y vingt ans hacen sonar la t; neuf ans se dice con un sonido v.",
      examples: [
        { target: "J'ai vingt ans.", base: 'Tengo veinte años.' },
        {
          target: "Quel âge as-tu? — J'ai douze ans.",
          base: '¿Cuántos años tienes? — Tengo doce.',
        },
        { target: 'Il a six ans.', base: 'Tiene seis años.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U3). Sin revisión nativa: revisar la suma con «et» (deux et trois, cinq) como forma oral simple, y la descripción de la pronunciación de six / dix delante de consonante.',
    },
    words: [
      w('fr-un', 'un', 'uno', 'Rosario est une ville.', 'Rosario es una ciudad.', ['numbers'], {
        acceptedTranslations: ['una'],
        acceptedTexts: ['une'],
        emoji: '1️⃣',
      }),
      w('fr-deux', 'deux', 'dos', 'Il a deux ans.', 'Tiene dos años.', ['numbers'], {
        emoji: '2️⃣',
      }),
      w('fr-trois', 'trois', 'tres', 'Un, deux, trois!', '¡Uno, dos, tres!', ['numbers'], {
        emoji: '3️⃣',
      }),
      w(
        'fr-quatre',
        'quatre',
        'cuatro',
        'Deux et deux, quatre.',
        'Dos más dos, cuatro.',
        ['numbers'],
        {
          emoji: '4️⃣',
        },
      ),
      w('fr-cinq', 'cinq', 'cinco', 'Elle a cinq ans.', 'Tiene cinco años.', ['numbers'], {
        emoji: '5️⃣',
      }),
      w('fr-six', 'six', 'seis', 'Il a six ans.', 'Tiene seis años.', ['numbers'], {
        emoji: '6️⃣',
      }),
      w('fr-sept', 'sept', 'siete', 'Sept et trois, dix.', 'Siete más tres, diez.', ['numbers'], {
        emoji: '7️⃣',
      }),
      w('fr-huit', 'huit', 'ocho', 'Elle a huit ans.', 'Tiene ocho años.', ['numbers'], {
        emoji: '8️⃣',
      }),
      w('fr-neuf', 'neuf', 'nueve', 'Il a neuf ans.', 'Tiene nueve años.', ['numbers'], {
        emoji: '9️⃣',
      }),
      w('fr-dix', 'dix', 'diez', 'Tu as dix ans?', '¿Tienes diez años?', ['numbers'], {
        emoji: '🔟',
      }),
      w('fr-onze', 'onze', 'once', "J'ai onze ans.", 'Tengo once años.', ['numbers']),
      w('fr-douze', 'douze', 'doce', 'Elle a douze ans.', 'Tiene doce años.', ['numbers']),
      w('fr-vingt', 'vingt', 'veinte', "J'ai vingt ans.", 'Tengo veinte años.', ['numbers']),
      w(
        'fr-j-ai',
        "j'ai",
        'tengo',
        "J'ai vingt ans. Et toi?",
        'Tengo veinte años. ¿Y tú?',
        ['verbs'],
        {
          acceptedTranslations: ['yo tengo'],
        },
      ),
      w('fr-tu-as', 'tu as', 'tienes', 'Tu as quel âge?', '¿Cuántos años tienes?', ['verbs'], {
        acceptedTranslations: ['tú tienes', 'tenés'],
      }),
      w(
        'fr-il-a',
        'il a',
        'él tiene',
        'Il a onze ans et elle a douze ans.',
        'Él tiene once años y ella tiene doce.',
        ['verbs'],
        { acceptedTranslations: ['ella tiene'], acceptedTexts: ['elle a'] },
      ),
      w(
        'fr-quel-age',
        'quel âge as-tu?',
        '¿cuántos años tienes?',
        "Quel âge as-tu? — J'ai douze ans.",
        '¿Cuántos años tienes? — Tengo doce.',
        ['questions'],
        { acceptedTranslations: ['¿cuántos años tenés?', '¿qué edad tenés?', '¿qué edad tienes?'] },
      ),
      w('fr-un-an', 'un an', 'un año', 'Il a un an.', 'Tiene un año.', ['time', 'm']),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Un, deux, trois',
        objective: 'Contar del uno al cinco.',
        intro: {
          explanation:
            'Un, deux, trois, quatre, cinq. Un es una vocal nasal (la n no suena); con una palabra femenina se dice une: une ville. En deux y trois la consonante final no suena, pero en cinq la q final sí se pronuncia cuando el número va solo. Para sumar, en el habla se usa et: deux et trois, cinq.',
          examples: [
            { target: 'Un, deux, trois.', base: 'Uno, dos, tres.' },
            { target: 'Rosario est une ville.', base: 'Rosario es una ciudad.' },
          ],
        },
        takeaways: [
          'Cuentas del uno al cinco en francés.',
          'Usas un o une según el género de la palabra.',
        ],
        exercises: [
          ex.translationChoice('trois', 'tres', ['dos', 'cuatro', 'cinco'], ['fr-trois'], {
            id: 'fr.ex.rqyswhmnaki83y',
          }),
          ex.matchPairs(
            [
              ['un', 'uno'],
              ['deux', 'dos'],
              ['quatre', 'cuatro'],
              ['cinq', 'cinco'],
            ],
            ['fr-un', 'fr-deux', 'fr-quatre', 'fr-cinq'],
            { id: 'fr.ex.mg6fi807uk5xb9' },
          ),
          ex.listenChoice(
            'Un, deux, trois.',
            ['Un, deux, quatre.', 'Deux, trois, quatre.', 'Trois, deux, un.'],
            ['fr-un', 'fr-deux', 'fr-trois'],
            { id: 'fr.ex.mxd1707d1af7cz' },
          ),
          ex.fillBlank(
            'Un, deux, ___, quatre, cinq.',
            'Uno, dos, tres, cuatro, cinco.',
            'trois',
            ['deux', 'cinq', 'quatre'],
            ['fr-trois'],
            { id: 'fr.ex.r9umz44u69yhc4', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Lyon est ___ ville.',
            'Lyon es una ciudad.',
            'une',
            ['un', 'deux', 'trois'],
            ['fr-un', 'fr-deux', 'fr-trois'],
            {
              id: 'fr.ex.pqg88p5l4myume',
              explanation: 'Ville es femenino: une ville. Un va con palabras masculinas: un pays.',
            },
          ),
          ex.translationChoice('cinq', 'cinco', ['cuatro', 'tres', 'uno'], ['fr-cinq'], {
            id: 'fr.ex.ngu31bedlad238',
            explanation: 'Cinq solo hace sonar la q final.',
          }),
          ex.listenChoice(
            'Deux et trois, cinq.',
            ['Deux et deux, quatre.', 'Trois et deux, cinq.', 'Un et trois, quatre.'],
            ['fr-deux', 'fr-trois', 'fr-cinq'],
            { id: 'fr.ex.ae6y6dbwno9c0m' },
          ),
          ex.translateWrite(
            'Uno, dos, tres.',
            'Un, deux, trois.',
            ['fr-un', 'fr-deux', 'fr-trois'],
            {
              id: 'fr.ex.pbfb2wsl24s50l',
            },
          ),
          ex.shortAnswer(
            'Deux et deux?',
            '¿Dos más dos? (Escribe el resultado en letras.)',
            'quatre',
            ['Quatre.', 'Deux et deux, quatre.'],
            ['fr-quatre'],
            { id: 'fr.ex.5iwmk4136bcjp5' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Six, sept, huit, neuf, dix',
        objective: 'Contar del seis al diez y distinguir six de dix.',
        intro: {
          explanation:
            'Six, sept, huit, neuf, dix. En sept la p no suena. La h de huit es muda y la t suena. Six y dix cambian según lo que sigue: solos, la x suena como s; delante de consonante no suena (six villes); delante de vocal se une con un sonido z (six‿ans, dix‿ans). Escucha bien la primera consonante: six empieza con s, dix con d.',
          examples: [
            { target: 'Six, sept, huit, neuf, dix.', base: 'Seis, siete, ocho, nueve, diez.' },
            { target: 'Cinq et cinq, dix.', base: 'Cinco más cinco, diez.' },
          ],
        },
        takeaways: [
          'Cuentas del seis al diez.',
          'Distingues six de dix y sabes que su x cambia según lo que sigue.',
        ],
        exercises: [
          ex.translationChoice('huit', 'ocho', ['seis', 'siete', 'nueve'], ['fr-huit'], {
            id: 'fr.ex.xpvxs2hgruxmv3',
          }),
          ex.matchPairs(
            [
              ['six', 'seis'],
              ['sept', 'siete'],
              ['neuf', 'nueve'],
              ['dix', 'diez'],
            ],
            ['fr-six', 'fr-sept', 'fr-neuf', 'fr-dix'],
            { id: 'fr.ex.0jk5nlbkhv2na4' },
          ),
          ex.listenChoice('six', ['dix', 'sept', 'cinq'], ['fr-six', 'fr-dix'], {
            id: 'fr.ex.r47l2wcx0dpr5h',
            explanation: 'Six empieza con s; dix, con d. Solos, los dos hacen sonar la x como s.',
          }),
          ex.fillBlank(
            'Six, sept, ___, neuf, dix.',
            'Seis, siete, ocho, nueve, diez.',
            'huit',
            ['six', 'dix', 'neuf'],
            ['fr-huit'],
            { id: 'fr.ex.xc7ec5jq2zi4qs', skill: 'vocabulary' },
          ),
          ex.translationChoice('sept', 'siete', ['seis', 'diez', 'nueve'], ['fr-sept'], {
            id: 'fr.ex.6awjkop5g63yil',
            explanation: 'En sept la p no se pronuncia.',
          }),
          ex.listenChoice('dix ans', ['six ans', 'deux ans', 'dix villes'], ['fr-dix', 'fr-six'], {
            id: 'fr.ex.8224fnepug7tte',
            explanation: 'Delante de vocal, la x de dix se une a ans con un sonido z: dix‿ans.',
          }),
          ex.fillBlank(
            'Cinq et cinq, ___.',
            'Cinco más cinco, diez.',
            'dix',
            ['six', 'neuf', 'huit'],
            ['fr-dix', 'fr-cinq'],
            { id: 'fr.ex.qd8gtufvb0ju1f', skill: 'vocabulary' },
          ),
          ex.translationChoice('neuf', 'nueve', ['once', 'diez', 'seis'], ['fr-neuf'], {
            id: 'fr.ex.sdnggrxnqikg4g',
            explanation: 'Neuf es nueve; delante de ans se pronuncia con v: neuf ans.',
          }),
          ex.translateWrite('Ocho más dos, diez.', 'Huit et deux, dix.', ['fr-huit', 'fr-dix'], {
            id: 'fr.ex.y1jyt2ja4a17mv',
          }),
          ex.shortAnswer(
            'Quatre et quatre?',
            '¿Cuatro más cuatro? (Escribe el resultado en letras.)',
            'huit',
            ['Huit.', 'Quatre et quatre, huit.'],
            ['fr-huit'],
            { id: 'fr.ex.ooe5avvk5o40jz' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: "J'ai vingt ans",
        objective: 'Contar hasta el doce y el veinte, y decir tu edad con avoir.',
        intro: {
          explanation:
            "Onze, douze y vingt. En vingt la g y la t no suenan (vocal nasal), pero en vingt ans la t se une a ans. La edad va con avoir: j'ai vingt ans (tengo veinte años), nunca «je suis vingt». Un an es un año; en plural, ans. Ojo con deux y douze: deux es corto; douze termina con un sonido z.",
          examples: [
            { target: "J'ai vingt ans.", base: 'Tengo veinte años.' },
            { target: "J'ai douze ans.", base: 'Tengo doce años.' },
          ],
        },
        takeaways: [
          "Dices tu edad con j'ai + número + ans.",
          'Distingues deux de douze al escuchar.',
        ],
        exercises: [
          ex.translationChoice('douze', 'doce', ['dos', 'once', 'veinte'], ['fr-douze'], {
            id: 'fr.ex.ihy1lsyhwg4uv4',
          }),
          ex.listenChoice('douze', ['deux', 'onze', 'dix'], ['fr-douze', 'fr-deux'], {
            id: 'fr.ex.5wx5ifwa8uko1y',
            explanation: 'Deux termina en vocal; douze, con un sonido z.',
          }),
          ex.matchPairs(
            [
              ['onze', 'once'],
              ['douze', 'doce'],
              ['vingt', 'veinte'],
              ["j'ai", 'tengo'],
            ],
            ['fr-onze', 'fr-douze', 'fr-vingt', 'fr-j-ai'],
            { id: 'fr.ex.d8xaaw87l4y2ue' },
          ),
          ex.fillBlank(
            '___ vingt ans.',
            'Tengo veinte años.',
            "J'ai",
            ['Je suis', 'Je parle', "Je m'appelle"],
            ['fr-j-ai', 'fr-vingt'],
            {
              id: 'fr.ex.yplbj7l0dt3t5z',
              explanation: "La edad se dice con avoir: j'ai vingt ans. «Je suis vingt» no existe.",
            },
          ),
          ex.translationChoice('un an', 'un año', ['uno', 'once', 'tengo'], ['fr-un-an'], {
            id: 'fr.ex.bcklyuu876uxld',
          }),
          ex.listenChoice(
            "J'ai deux ans.",
            ["J'ai douze ans.", "J'ai dix ans.", "J'ai un an."],
            ['fr-j-ai', 'fr-deux', 'fr-un-an'],
            {
              id: 'fr.ex.1g7n7h0yxry3xx',
              explanation: 'Deux ans se une con un sonido z: deux‿ans.',
            },
          ),
          ex.fillBlank(
            "J'ai onze ___.",
            'Tengo once años.',
            'ans',
            ['an', 'un', 'une'],
            ['fr-onze', 'fr-un-an'],
            {
              id: 'fr.ex.eqqnkalx0rp8t0',
              explanation: 'Con más de un año va el plural: ans. Un an es solo para uno.',
            },
          ),
          ex.orderWords("J'ai vingt ans.", 'Tengo veinte años.', ['fr-j-ai', 'fr-vingt'], {
            id: 'fr.ex.048c5qx6la1z6u',
          }),
          ex.translateWrite('Tengo doce años.', "J'ai douze ans.", ['fr-j-ai', 'fr-douze'], {
            id: 'fr.ex.cfmw1zp7wn4tyf',
          }),
          ex.translateWrite(
            'Tengo once años y soy de Lyon.',
            "J'ai onze ans et je suis de Lyon.",
            ['fr-j-ai', 'fr-onze'],
            { id: 'fr.ex.4tdlzj5vnrrh1l' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Quel âge as-tu?',
        objective: 'Preguntar la edad y decir la edad de otra persona.',
        intro: {
          explanation:
            "Avoir en singular: j'ai, tu as, il a, elle a. En tu as la s final no suena.Para preguntar la edad: quel âge as-tu? (el verbo va antes del sujeto, unido con guion) o, entre amigos, tu as quel âge? Il a y elle a se distinguen solo por el pronombre: escúchalo bien.",
          examples: [
            { target: 'Quel âge as-tu?', base: '¿Cuántos años tienes?' },
            { target: 'Il a huit ans.', base: 'Tiene ocho años.' },
          ],
        },
        takeaways: [
          'Preguntas la edad con quel âge as-tu? o tu as quel âge?',
          'Dices la edad de otra persona con il a o elle a.',
        ],
        exercises: [
          ex.translationChoice(
            'quel âge as-tu?',
            '¿cuántos años tienes?',
            ['¿de dónde eres?', '¿cómo te llamas?', '¿cómo va?'],
            ['fr-quel-age'],
            { id: 'fr.ex.dr6oz664tzzzpk' },
          ),
          ex.matchPairs(
            [
              ["j'ai", 'tengo'],
              ['tu as', 'tienes'],
              ['il a', 'él tiene'],
              ['quel âge as-tu?', '¿cuántos años tienes?'],
            ],
            ['fr-j-ai', 'fr-tu-as', 'fr-il-a', 'fr-quel-age'],
            { id: 'fr.ex.7up2fwldia5phd' },
          ),
          ex.fillBlank(
            'Tu ___ quel âge?',
            '¿Cuántos años tienes?',
            'as',
            ['es', 'a', 'ai'],
            ['fr-tu-as', 'fr-quel-age'],
            {
              id: 'fr.ex.t3gpsv2mmtao6y',
              explanation: 'Con tu: tu as. La edad va con avoir, no con être (tu es).',
            },
          ),
          ex.fillBlank(
            'Lucas? Il ___ neuf ans.',
            '¿Lucas? Tiene nueve años.',
            'a',
            ['as', 'est', 'ai'],
            ['fr-il-a', 'fr-neuf'],
            {
              id: 'fr.ex.uhi8ihkk65mx9b',
              explanation: 'Con il: il a. Y neuf ans se dice con un sonido v.',
            },
          ),
          ex.listenChoice(
            'Elle a huit ans.',
            ['Il a huit ans.', 'Elle a sept ans.', 'Elle a vingt ans.'],
            ['fr-il-a', 'fr-huit'],
            {
              id: 'fr.ex.r47umbfbuukqlw',
              explanation: 'Elle empieza con vocal abierta y termina en l; il es corto.',
            },
          ),
          question(
            'fr.ex.2iiwa4mupsmarz',
            COLONIE,
            '¿Cuántos años tiene Inès?',
            'Doce.',
            ['Dos.', 'Once.', 'Diez.'],
            ['fr-douze', 'fr-j-ai'],
            "Inès responde «J'ai douze ans».",
          ),
          question(
            'fr.ex.0icabdyhvtrlcw',
            COLONIE,
            '¿Cuántos años tiene Hugo?',
            'Once.',
            ['Doce.', 'Diez.', 'Uno.'],
            ['fr-onze'],
            "Hugo dice «Moi, j'ai onze ans».",
          ),
          question(
            'fr.ex.j0kz1axqths3v2',
            COLONIE,
            '¿Cuántos años tiene Lucas?',
            'Diez.',
            ['Seis.', 'Doce.', 'Dos.'],
            ['fr-dix', 'fr-il-a'],
            'Hugo responde «Il a dix ans».',
          ),
          ex.translateWrite('Ella tiene seis años.', 'Elle a six ans.', ['fr-il-a', 'fr-six'], {
            id: 'fr.ex.0bj2gpgphj34kj',
          }),
          ex.shortAnswer(
            'Quel âge as-tu?',
            '¿Cuántos años tienes? (Responde que tienes veinte años.)',
            "J'ai vingt ans.",
            ["Moi, j'ai vingt ans.", 'Vingt ans.'],
            ['fr-j-ai', 'fr-vingt'],
            { id: 'fr.ex.c6rm697tfljpar' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Números y edades',
        objective: 'Repasar los números y entender edades en un mensaje y en una conversación.',
        intro: {
          explanation:
            "Ya puedes presentarte completo: je m'appelle…, j'ai… ans, je suis de…, j'habite à… Recuerda la liaison delante de ans: deux‿ans, trois‿ans, six‿ans y dix‿ans con sonido z, huit ans y vingt ans con t, neuf ans con v. Y para preguntar: tu as quel âge?",
          examples: [
            {
              target: "Je m'appelle Clara. J'ai vingt ans.",
              base: 'Me llamo Clara. Tengo veinte años.',
            },
            { target: 'Il a trois ans.', base: 'Tiene tres años.' },
          ],
        },
        takeaways: [
          'Entiendes edades en un texto y en un diálogo.',
          'Pronuncias la liaison de los números delante de ans.',
        ],
        exercises: [
          question(
            'fr.ex.zhyljz1dw44utr',
            MESSAGE,
            '¿Cuántos años tiene Clara?',
            'Veinte.',
            ['Doce.', 'Dos.', 'Diez.'],
            ['fr-vingt', 'fr-j-ai'],
            "Clara escribe «J'ai vingt ans».",
          ),
          question(
            'fr.ex.abccqajm9t4t0k',
            MESSAGE,
            '¿Qué le pregunta Clara a Giulia?',
            'Cuántos años tiene.',
            ['De dónde es.', 'Cómo se llama.', 'Dónde vive.'],
            ['fr-quel-age', 'fr-tu-as'],
            'Al final escribe «Et toi, tu as quel âge?».',
          ),
          question(
            'fr.ex.ukgtjr7c80bwm3',
            COLONIE,
            '¿Quién es el mayor de los tres chicos?',
            'Inès, que tiene doce años.',
            ['Hugo, que tiene once.', 'Lucas, que tiene diez.', 'Tienen la misma edad.'],
            ['fr-douze', 'fr-onze', 'fr-dix'],
            'Inès tiene douze (12), Hugo onze (11) y Lucas dix (10).',
          ),
          ex.listenChoice(
            'Il a six ans.',
            ['Il a dix ans.', 'Elle a six ans.', 'Il a sept ans.'],
            ['fr-six', 'fr-il-a'],
            {
              id: 'fr.ex.613skp3muah1s0',
              explanation: 'Six‿ans y dix‿ans: cambia solo la primera consonante.',
            },
          ),
          ex.fillBlank(
            'Quel ___ as-tu?',
            '¿Cuántos años tienes?',
            'âge',
            ['ans', 'an', 'un'],
            ['fr-quel-age'],
            { id: 'fr.ex.54oynvg5hpixrd', skill: 'vocabulary' },
          ),
          ex.translationChoice('tu as', 'tienes', ['tengo', 'él tiene', 'eres'], ['fr-tu-as'], {
            id: 'fr.ex.1xpuo9l97ur64c',
          }),
          ex.matchPairs(
            [
              ['trois', 'tres'],
              ['sept', 'siete'],
              ['onze', 'once'],
              ['vingt', 'veinte'],
            ],
            ['fr-trois', 'fr-sept', 'fr-onze', 'fr-vingt'],
            { id: 'fr.ex.mnkirb940gfzem' },
          ),
          ex.orderWords('Elle a quatre ans.', 'Tiene cuatro años.', ['fr-il-a', 'fr-quatre'], {
            id: 'fr.ex.5j2shrh6ptwfrg',
          }),
          ex.translateWrite('¿Cuántos años tienes?', 'Quel âge as-tu?', ['fr-quel-age'], {
            id: 'fr.ex.zt6cn2t4bk3ee2',
            acceptedAnswers: ['Tu as quel âge?'],
          }),
          ex.shortAnswer(
            'Paul a quel âge?',
            '¿Cuántos años tiene Paul? (Responde que tiene doce años.)',
            'Il a douze ans.',
            ['Paul a douze ans.', 'Douze ans.'],
            ['fr-il-a', 'fr-douze'],
            { id: 'fr.ex.ruahhfb1lyjlj9' },
          ),
        ],
      },
    ],
  },
};
