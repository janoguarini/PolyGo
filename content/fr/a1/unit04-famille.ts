import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U4 «La familia» (docs/FR_A1_A2.md): presentar a la familia con c'est y voici, los
 * posesivos (mon / ma / mes, ton / ta / tes, son / sa / ses; mon delante de vocal: mon amie),
 * il s'appelle y j'ai un frère. Falso amigo: les parents son los padres, no los parientes.
 * Pronunciación: le fils (la l no suena, la s sí), la fille, sœur, le père / la mère.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const PHOTO = dialogue(
  'fr.stim.a1-u4-photo',
  'Léa le muestra a Hugo una foto de su familia.',
  [
    ['Léa', 'Voici ma famille!'],
    ['Hugo', "C'est ton père?"],
    ['Léa', "Oui. Il s'appelle Marc. Et voici ma mère, Anne."],
    ['Hugo', 'Et la fille?'],
    ['Léa', "C'est ma sœur. Elle s'appelle Chloé. Elle a huit ans."],
  ],
  FR_A1_RATE,
);

const FAMILLE = reading(
  'fr.stim.a1-u4-famille',
  'description',
  'Thomas describe a su familia en un trabajo para la clase de francés.',
  [
    "Je m'appelle Thomas et j'habite à Lyon.",
    'Mon père est français et ma mère est argentine.',
    "J'ai une sœur, Léa. Elle a onze ans.",
    'Ma grand-mère parle espagnol.',
    'Et voici Rex, mon chien!',
  ],
  { title: 'Ma famille' },
);

export const FR_A1_U04: FrUnitDef = {
  names: ['Marc', 'Anne', 'Chloé', 'Inès', 'Rex', 'Lyon'],
  support: ['voici', 'des', 'avez', 'tes', 'amie', 'ses'],
  unit: {
    position: 4,
    title: 'La familia',
    titleEn: 'La famille',
    description:
      "La familia, los posesivos (mon / ma / mes, ton / ta / tes, son / sa / ses), il s'appelle y j'ai un frère. Falso amigo: les parents. Le fils y la fille.",
    emoji: '👨‍👩‍👧',
    objective:
      'Podés presentar a tu familia, decir cómo se llaman y cuántos años tienen, y preguntar por la familia de otra persona.',
    grammar: {
      title: 'Los posesivos',
      explanation:
        "El posesivo concuerda con la cosa o la persona poseída, no con quien la posee: mon père, ma mère, mes parents (mi, mis); ton / ta / tes (tu, tus); son / sa / ses (su, sus). Por eso son père es «su papá» tanto de Hugo como de Léa, y sa mère es «su mamá» aunque hable de un hombre. Delante de vocal se usa mon, ton, son aunque la palabra sea femenina: mon amie, nunca «ma amie». Para presentar: c'est mon frère, voici ma famille. Ojo con el falso amigo: les parents son los padres (no los parientes).",
      examples: [
        { target: "C'est mon père.", base: 'Es mi papá.' },
        {
          target: 'Voici ma sœur et mes parents.',
          base: 'Esta es mi hermana y estos son mis padres.',
        },
        { target: "Sa mère s'appelle Anne.", base: 'Su mamá se llama Anne.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U4). Sin revisión nativa: revisar «Vous avez des enfants?» traducido como «¿Tiene hijos?», y el uso de la fille como hija y como chica en el diálogo.',
    },
    words: [
      w('fr-la-famille', 'la famille', 'la familia', 'Voici ma famille.', 'Esta es mi familia.', [
        'family',
        'f',
      ]),
      w('fr-le-pere', 'le père', 'el padre', "C'est mon père.", 'Es mi papá.', ['family', 'm'], {
        acceptedTranslations: ['el papá'],
      }),
      w(
        'fr-la-mere',
        'la mère',
        'la madre',
        'Ma mère est argentine.',
        'Mi mamá es argentina.',
        ['family', 'f'],
        { acceptedTranslations: ['la mamá'] },
      ),
      w(
        'fr-les-parents',
        'les parents',
        'los padres',
        'Voici mes parents.',
        'Estos son mis padres.',
        ['family'],
      ),
      w('fr-le-frere', 'le frère', 'el hermano', "J'ai un frère.", 'Tengo un hermano.', [
        'family',
        'm',
      ]),
      w(
        'fr-la-soeur',
        'la sœur',
        'la hermana',
        'Ma sœur a douze ans.',
        'Mi hermana tiene doce años.',
        ['family', 'f'],
      ),
      w('fr-le-fils', 'le fils', 'el hijo', 'Il a un fils.', 'Tiene un hijo.', ['family', 'm']),
      w(
        'fr-la-fille',
        'la fille',
        'la hija',
        "C'est ma fille, Chloé.",
        'Es mi hija, Chloé.',
        ['family', 'f'],
        { acceptedTranslations: ['la chica'] },
      ),
      w(
        'fr-le-mari',
        'le mari',
        'el marido',
        'Paul est le mari de Claire.',
        'Paul es el marido de Claire.',
        ['family', 'm'],
        { acceptedTranslations: ['el esposo'] },
      ),
      w(
        'fr-la-femme',
        'la femme',
        'la mujer',
        'Claire est la femme de Paul.',
        'Claire es la esposa de Paul.',
        ['family', 'f'],
        { acceptedTranslations: ['la esposa'] },
      ),
      w(
        'fr-le-grand-pere',
        'le grand-père',
        'el abuelo',
        'Mon grand-père est italien.',
        'Mi abuelo es italiano.',
        ['family', 'm'],
      ),
      w(
        'fr-la-grand-mere',
        'la grand-mère',
        'la abuela',
        'Ma grand-mère parle espagnol.',
        'Mi abuela habla español.',
        ['family', 'f'],
      ),
      w(
        'fr-l-enfant',
        "l'enfant",
        'el niño',
        'Vous avez des enfants?',
        '¿Tiene hijos?',
        ['family'],
        { acceptedTranslations: ['la niña', 'el nene'] },
      ),
      w(
        'fr-mon-ma',
        'mon / ma',
        'mi',
        "C'est mon frère et ma sœur.",
        'Son mi hermano y mi hermana.',
        ['possessives'],
      ),
      w('fr-mes', 'mes', 'mis', 'Voici mes sœurs.', 'Estas son mis hermanas.', ['possessives']),
      w('fr-ton-ta', 'ton / ta', 'tu', "C'est ta sœur?", '¿Es tu hermana?', ['possessives']),
      w(
        'fr-son-sa',
        'son / sa',
        'su',
        "Léa? Son père s'appelle Marc.",
        '¿Léa? Su papá se llama Marc.',
        ['possessives'],
      ),
      w(
        'fr-il-s-appelle',
        "il s'appelle",
        'se llama',
        "Il s'appelle Hugo.",
        'Se llama Hugo.',
        ['introductions'],
        {
          acceptedTranslations: ['él se llama', 'ella se llama'],
          acceptedTexts: ["elle s'appelle"],
        },
      ),
      w(
        'fr-le-chien',
        'le chien',
        'el perro',
        "J'ai un chien.",
        'Tengo un perro.',
        ['animals', 'm'],
        {
          emoji: '🐶',
        },
      ),
      w(
        'fr-le-chat',
        'le chat',
        'el gato',
        'Mon chat a trois ans.',
        'Mi gato tiene tres años.',
        ['animals', 'm'],
        { emoji: '🐱' },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Ma famille',
        objective: 'Presentar a tus padres con mon, ma y mes.',
        intro: {
          explanation:
            "Le père es el padre y la mère, la madre (la è es una e abierta). Les parents son los padres: es un falso amigo, no significa parientes. Mi se dice mon con palabras masculinas (mon père), ma con femeninas (ma mère) y mes en plural (mes parents). Para presentar: c'est mon père (es mi papá) o voici ma famille (esta es mi familia).",
          examples: [
            { target: "C'est mon père.", base: 'Es mi papá.' },
            { target: 'Voici mes parents.', base: 'Estos son mis padres.' },
          ],
        },
        takeaways: [
          "Presentás a tu familia con c'est y voici.",
          'Elegís mon, ma o mes según la palabra que sigue.',
        ],
        exercises: [
          ex.translationChoice(
            'la mère',
            'la madre',
            ['el padre', 'los padres', 'la familia'],
            ['fr-la-mere'],
            { id: 'fr.ex.c500jvr6nxgdna' },
          ),
          ex.translationChoice(
            'les parents',
            'los padres',
            ['los parientes', 'la familia', 'la madre'],
            ['fr-les-parents'],
            {
              id: 'fr.ex.mo8qe4voczwz11',
              explanation: 'Falso amigo: les parents son el padre y la madre, no los parientes.',
            },
          ),
          ex.matchPairs(
            [
              ['la famille', 'la familia'],
              ['le père', 'el padre'],
              ['la mère', 'la madre'],
              ['les parents', 'los padres'],
            ],
            ['fr-la-famille', 'fr-le-pere', 'fr-la-mere', 'fr-les-parents'],
            { id: 'fr.ex.nnpm5q0ycwm1im' },
          ),
          ex.listenChoice(
            "C'est mon père.",
            ["C'est ma mère.", 'Voici mon père.', "C'est le père."],
            ['fr-le-pere', 'fr-mon-ma'],
            {
              id: 'fr.ex.q4jkrat5hffvit',
              explanation: 'Mon es una vocal nasal; ma termina en a abierta.',
            },
          ),
          ex.fillBlank(
            "C'est ___ mère.",
            'Es mi mamá.',
            'ma',
            ['mon', 'mes', 'moi'],
            ['fr-mon-ma', 'fr-la-mere'],
            { id: 'fr.ex.2ee3lseme9z7oj', explanation: 'Mère es femenino: ma mère.' },
          ),
          ex.fillBlank(
            'Voici ___ parents.',
            'Estos son mis padres.',
            'mes',
            ['mon', 'ma', 'moi'],
            ['fr-mes', 'fr-les-parents'],
            { id: 'fr.ex.g26et6ioim5a78', explanation: 'Parents es plural: mes parents.' },
          ),
          ex.translationChoice('mes', 'mis', ['mi', 'tu', 'su'], ['fr-mes'], {
            id: 'fr.ex.yue5ngpf9pwpwu',
          }),
          ex.orderWords(
            'Voici ma famille.',
            'Esta es mi familia.',
            ['fr-la-famille', 'fr-mon-ma'],
            {
              id: 'fr.ex.39j9wmigvtriwt',
            },
          ),
          ex.translateWrite('Es mi papá.', "C'est mon père.", ['fr-le-pere', 'fr-mon-ma'], {
            id: 'fr.ex.63d3n3peokhkjo',
            acceptedAnswers: ['Voici mon père.'],
          }),
          ex.shortAnswer(
            "C'est la mère de Léa?",
            '¿Es la mamá de Léa? (Respondé que no, que es tu mamá.)',
            "Non, c'est ma mère.",
            ["Non. C'est ma mère.", "C'est ma mère."],
            ['fr-mon-ma', 'fr-la-mere'],
            { id: 'fr.ex.e5bok1atz1bmjc' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: "J'ai un frère",
        objective: 'Hablar de hermanos e hijos con avoir.',
        intro: {
          explanation:
            "Con avoir decís quién está en tu familia: j'ai un frère, j'ai une sœur. Le fils es el hijo: la l no suena y la s final sí (una excepción). La fille es la hija (también la chica): la ll suena como una y. En sœur, œ es una vocal que no existe en español: se dice con la boca redondeada. L'enfant es el niño o la niña; para preguntar si alguien tiene hijos: vous avez des enfants?",
          examples: [
            { target: "J'ai un frère et une sœur.", base: 'Tengo un hermano y una hermana.' },
            { target: 'Vous avez des enfants?', base: '¿Tiene hijos?' },
          ],
        },
        takeaways: [
          "Decís cuántos hermanos o hijos tenés con j'ai.",
          'Pronunciás le fils con s y la fille con sonido y.',
        ],
        exercises: [
          ex.translationChoice(
            'la sœur',
            'la hermana',
            ['el hermano', 'la hija', 'la madre'],
            ['fr-la-soeur'],
            { id: 'fr.ex.igt6aiv5mpzs9b' },
          ),
          ex.matchPairs(
            [
              ['le frère', 'el hermano'],
              ['la sœur', 'la hermana'],
              ['le fils', 'el hijo'],
              ['la fille', 'la hija'],
            ],
            ['fr-le-frere', 'fr-la-soeur', 'fr-le-fils', 'fr-la-fille'],
            { id: 'fr.ex.4r1nyri40dlwyz' },
          ),
          ex.listenChoice(
            'le fils',
            ['la fille', 'le frère', 'la sœur'],
            ['fr-le-fils', 'fr-la-fille'],
            {
              id: 'fr.ex.pzsdn5uj4vunb1',
              explanation: 'En fils la s final suena y la l no; en fille, la ll suena como y.',
            },
          ),
          ex.fillBlank(
            "J'ai un frère et deux ___.",
            'Tengo un hermano y dos hermanas.',
            'sœurs',
            ['sœur', 'frère', 'fille'],
            ['fr-la-soeur', 'fr-le-frere'],
            {
              id: 'fr.ex.u24mkxnuncp3ys',
              explanation:
                'Con deux va el plural: sœurs. La s del plural no suena, pero se escribe.',
            },
          ),
          ex.fillBlank(
            'Vous avez des ___?',
            '¿Tiene hijos?',
            'enfants',
            ['enfant', 'famille', 'mère'],
            ['fr-l-enfant'],
            {
              id: 'fr.ex.sozjuvgy8i1b3f',
              explanation: 'Para preguntar por los hijos en general se usa des enfants, en plural.',
            },
          ),
          ex.translationChoice(
            "l'enfant",
            'el niño',
            ['el padre', 'la hermana', 'la familia'],
            ['fr-l-enfant'],
            { id: 'fr.ex.hiop5oil10hmjn' },
          ),
          ex.listenChoice(
            "J'ai deux frères.",
            ["J'ai douze frères.", "J'ai deux sœurs.", "J'ai un frère."],
            ['fr-le-frere'],
            {
              id: 'fr.ex.w78oyj1zx4prxk',
              explanation: 'Deux termina en vocal; douze, con sonido z.',
            },
          ),
          ex.orderWords(
            "J'ai un fils et une fille.",
            'Tengo un hijo y una hija.',
            ['fr-le-fils', 'fr-la-fille'],
            { id: 'fr.ex.pam37cdfk4k119' },
          ),
          ex.translateWrite('Tengo una hermana.', "J'ai une sœur.", ['fr-la-soeur'], {
            id: 'fr.ex.j69rdr8ob9grav',
          }),
          ex.shortAnswer(
            'Tu as des frères?',
            '¿Tenés hermanos? (Respondé que tenés un hermano y una hermana.)',
            "J'ai un frère et une sœur.",
            ["Oui, j'ai un frère et une sœur.", "Oui. J'ai un frère et une sœur."],
            ['fr-le-frere', 'fr-la-soeur'],
            { id: 'fr.ex.pri7qlbrg0adgm' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Ton mari, ta grand-mère',
        objective: 'Hablar de la pareja y los abuelos, y preguntar con ton, ta y tes.',
        intro: {
          explanation:
            'Le mari es el marido y la femme, la mujer o la esposa (en femme la e suena como a). Los abuelos: le grand-père y la grand-mère; los dos juntos, les grands-parents. Para tu: ton con palabras masculinas (ton mari), ta con femeninas (ta grand-mère) y tes en plural (tes grands-parents). La d de grand no suena.',
          examples: [
            { target: "C'est ton mari?", base: '¿Es tu marido?' },
            { target: 'Ma grand-mère est italienne.', base: 'Mi abuela es italiana.' },
          ],
        },
        takeaways: [
          'Nombrás a la pareja y a los abuelos.',
          'Preguntás por la familia de otro con ton, ta y tes.',
        ],
        exercises: [
          ex.translationChoice(
            'le grand-père',
            'el abuelo',
            ['la abuela', 'el padre', 'el marido'],
            ['fr-le-grand-pere'],
            { id: 'fr.ex.nvps6ii0lj1p61' },
          ),
          ex.matchPairs(
            [
              ['le mari', 'el marido'],
              ['la femme', 'la mujer'],
              ['le grand-père', 'el abuelo'],
              ['la grand-mère', 'la abuela'],
            ],
            ['fr-le-mari', 'fr-la-femme', 'fr-le-grand-pere', 'fr-la-grand-mere'],
            { id: 'fr.ex.ub873qrlokp7ue' },
          ),
          ex.listenChoice(
            'ta grand-mère',
            ['ma grand-mère', 'ta mère', 'mon grand-père'],
            ['fr-la-grand-mere', 'fr-ton-ta'],
            { id: 'fr.ex.xq5lzm7fjlzqtr' },
          ),
          ex.fillBlank(
            "C'est ___ mari?",
            '¿Es tu marido?',
            'ton',
            ['ta', 'tes', 'mon'],
            ['fr-ton-ta', 'fr-le-mari'],
            { id: 'fr.ex.sooljnoyut3alr', explanation: 'Mari es masculino: ton mari.' },
          ),
          ex.fillBlank(
            'Claire est la ___ de Paul.',
            'Claire es la esposa de Paul.',
            'femme',
            ['mari', 'fille', 'mère'],
            ['fr-la-femme'],
            {
              id: 'fr.ex.33tiacbd1blkj8',
              skill: 'vocabulary',
              explanation: 'La femme es la mujer y también la esposa. Le mari es el marido.',
            },
          ),
          ex.translationChoice('ton / ta', 'tu', ['mi', 'su', 'mis'], ['fr-ton-ta'], {
            id: 'fr.ex.1usei1ytxo2pz2',
          }),
          ex.fillBlank(
            'Voici ___ grands-parents, Hugo!',
            '¡Acá están tus abuelos, Hugo!',
            'tes',
            ['ton', 'ta', 'mes'],
            ['fr-ton-ta', 'fr-le-grand-pere'],
            {
              id: 'fr.ex.x459eji8fkc1p6',
              explanation: 'Grands-parents es plural: tes grands-parents.',
            },
          ),
          ex.orderWords(
            'Ta femme parle français?',
            '¿Tu esposa habla francés?',
            ['fr-la-femme', 'fr-ton-ta'],
            { id: 'fr.ex.77s46x1j7xttu2' },
          ),
          ex.translateWrite(
            'Mi abuela es italiana.',
            'Ma grand-mère est italienne.',
            ['fr-la-grand-mere', 'fr-mon-ma'],
            { id: 'fr.ex.mxvtsly9i8c45w' },
          ),
          ex.shortAnswer(
            'Ton grand-père est français?',
            '¿Tu abuelo es francés? (Respondé que no, que es español.)',
            'Non, il est espagnol.',
            [
              "Non, il n'est pas français. Il est espagnol.",
              'Non. Il est espagnol.',
              'Non, mon grand-père est espagnol.',
            ],
            ['fr-le-grand-pere'],
            { id: 'fr.ex.86e6g4opmq0hpc' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: "Il s'appelle Marc",
        objective: 'Decir cómo se llama alguien y usar son y sa.',
        intro: {
          explanation:
            "Para decir el nombre de otra persona: il s'appelle Marc, elle s'appelle Chloé. Su se dice son, sa o ses según la palabra que sigue, no según quién la posee: son père es su papá (de Léa o de Hugo) y sa mère, su mamá. Delante de vocal se usa mon, ton, son aunque la palabra sea femenina: mon amie Inès, nunca «ma amie».",
          examples: [
            { target: "Il s'appelle Marc.", base: 'Se llama Marc.' },
            { target: "Hugo? Sa mère s'appelle Anne.", base: '¿Hugo? Su mamá se llama Anne.' },
          ],
        },
        takeaways: [
          "Decís cómo se llama alguien con il s'appelle o elle s'appelle.",
          'Elegís son o sa por la palabra que sigue, no por el dueño.',
        ],
        exercises: [
          ex.translationChoice(
            "il s'appelle",
            'se llama',
            ['me llamo', '¿cómo te llamás?', 'tiene'],
            ['fr-il-s-appelle'],
            { id: 'fr.ex.y25dllu4tha7k3' },
          ),
          ex.fillBlank(
            "Léa? ___ père s'appelle Marc.",
            '¿Léa? Su papá se llama Marc.',
            'Son',
            ['Sa', 'Ses', 'Ma'],
            ['fr-son-sa', 'fr-le-pere'],
            {
              id: 'fr.ex.o7mh79rl7jndxo',
              explanation: 'Père es masculino: son père, aunque sea el papá de Léa.',
            },
          ),
          ex.fillBlank(
            "Hugo? ___ mère s'appelle Anne.",
            '¿Hugo? Su mamá se llama Anne.',
            'Sa',
            ['Son', 'Ses', 'Mon'],
            ['fr-son-sa', 'fr-la-mere'],
            {
              id: 'fr.ex.hf2io5x9ludu70',
              explanation: 'Mère es femenino: sa mère, aunque sea la mamá de Hugo.',
            },
          ),
          ex.listenChoice(
            "Elle s'appelle Chloé.",
            ["Il s'appelle Marc.", "Je m'appelle Chloé.", "Tu t'appelles Chloé?"],
            ['fr-il-s-appelle'],
            { id: 'fr.ex.dksx3iqkp6v8xx' },
          ),
          question(
            'fr.ex.jeryvhhgof2vzw',
            PHOTO,
            '¿Cómo se llama el papá de Léa?',
            'Marc.',
            ['Hugo.', 'Anne.', 'Paul.'],
            ['fr-il-s-appelle', 'fr-le-pere'],
            "Hugo pregunta «C'est ton père?» y Léa responde «Oui. Il s'appelle Marc».",
          ),
          question(
            'fr.ex.r8vvbdydeyj6nw',
            PHOTO,
            '¿Quién es Chloé?',
            'La hermana de Léa.',
            ['La mamá de Léa.', 'La hija de Hugo.', 'Una amiga de Léa.'],
            ['fr-la-soeur', 'fr-la-fille'],
            "Léa dice «C'est ma sœur. Elle s'appelle Chloé».",
          ),
          question(
            'fr.ex.6qcp8uiu9e6dav',
            PHOTO,
            '¿Cuántos años tiene Chloé?',
            'Ocho.',
            ['Once.', 'Seis.', 'Veinte.'],
            ['fr-la-soeur'],
            'Léa dice «Elle a huit ans».',
          ),
          ex.fillBlank(
            'Voici ___ amie Inès.',
            'Esta es mi amiga Inès.',
            'mon',
            ['ma', 'mes', 'moi'],
            ['fr-mon-ma'],
            {
              id: 'fr.ex.x0ds3ch0s52kam',
              explanation:
                'Amie empieza con vocal: mon amie, aunque sea femenino. «Ma amie» no se dice.',
            },
          ),
          ex.translateWrite(
            'Su hermano se llama Lucas.',
            "Son frère s'appelle Lucas.",
            ['fr-son-sa', 'fr-il-s-appelle'],
            { id: 'fr.ex.93zp1ymaxfbly7' },
          ),
          ex.shortAnswer(
            "Ta mère s'appelle comment?",
            '¿Cómo se llama tu mamá? (Respondé que se llama Marie.)',
            "Elle s'appelle Marie.",
            ["Ma mère s'appelle Marie.", 'Marie.', "Elle s'appelle Marie!"],
            ['fr-il-s-appelle'],
            { id: 'fr.ex.j1n03p5ir0itd2' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Mon chien et mon chat',
        objective: 'Hablar de las mascotas y describir a tu familia.',
        intro: {
          explanation:
            "Le chien es el perro y le chat, el gato: en chat la t final no suena. Las mascotas también entran en la familia: j'ai un chien, mon chat a trois ans. Con ses hablás de varias cosas de otra persona: Léa et ses parents (Léa y sus padres).",
          examples: [
            { target: "J'ai un chien et deux chats.", base: 'Tengo un perro y dos gatos.' },
            { target: 'Mon chat a trois ans.', base: 'Mi gato tiene tres años.' },
          ],
        },
        takeaways: [
          'Hablás de tus mascotas con le chien y le chat.',
          'Entendés una descripción corta de una familia.',
        ],
        exercises: [
          ex.translationChoice(
            'le chat',
            'el gato',
            ['el perro', 'el niño', 'el hijo'],
            ['fr-le-chat'],
            {
              id: 'fr.ex.lk13cz7i0lc5kq',
            },
          ),
          ex.imageChoice('🐶', 'le chien', ['le chat', 'la fille', 'le fils'], ['fr-le-chien'], {
            id: 'fr.ex.r4n1yzg8okhd9r',
          }),
          ex.listenChoice(
            'Son chat a deux ans.',
            ['Son chien a deux ans.', 'Son chat a douze ans.', 'Sa sœur a deux ans.'],
            ['fr-le-chat', 'fr-son-sa'],
            { id: 'fr.ex.s7ax4hjfamtg0k' },
          ),
          question(
            'fr.ex.7wok7ausne6yw6',
            FAMILLE,
            '¿De dónde es la mamá de Thomas?',
            'De Argentina.',
            ['De Francia.', 'De Italia.', 'No lo dice.'],
            ['fr-la-mere', 'fr-mon-ma'],
            'Thomas escribe «ma mère est argentine».',
          ),
          question(
            'fr.ex.cho77o2cyomrw8',
            FAMILLE,
            '¿Cuántos años tiene la hermana de Thomas?',
            'Once.',
            ['Doce.', 'Veinte.', 'Dos.'],
            ['fr-la-soeur'],
            "Escribe «J'ai une sœur, Léa. Elle a onze ans».",
          ),
          question(
            'fr.ex.im8f2wswpy2ngm',
            FAMILLE,
            '¿Quién es Rex?',
            'El perro de Thomas.',
            ['El gato de Thomas.', 'El hermano de Thomas.', 'El abuelo de Thomas.'],
            ['fr-le-chien'],
            'El texto termina con «Et voici Rex, mon chien!».',
          ),
          ex.fillBlank(
            'Voici Léa et ___ parents.',
            'Acá están Léa y sus padres.',
            'ses',
            ['son', 'sa', 'mes'],
            ['fr-son-sa', 'fr-les-parents'],
            {
              id: 'fr.ex.cdcbzvzxqk4buf',
              explanation: 'Parents es plural: ses parents (sus padres).',
            },
          ),
          ex.orderWords(
            'Mon chien a cinq ans.',
            'Mi perro tiene cinco años.',
            ['fr-le-chien', 'fr-mon-ma'],
            {
              id: 'fr.ex.cqod2y6okmwef9',
            },
          ),
          ex.translateWrite(
            'Tengo un perro y dos gatos.',
            "J'ai un chien et deux chats.",
            ['fr-le-chien', 'fr-le-chat'],
            { id: 'fr.ex.ec2wngulvus4ds' },
          ),
          ex.shortAnswer(
            'Vous avez des enfants?',
            '¿Tiene hijos? (Respondé que sí: un hijo y una hija.)',
            "Oui, j'ai un fils et une fille.",
            [
              "J'ai un fils et une fille.",
              "Oui. J'ai un fils et une fille.",
              'Oui, un fils et une fille.',
            ],
            ['fr-le-fils', 'fr-la-fille', 'fr-l-enfant'],
            { id: 'fr.ex.arltcwldaq49iq' },
          ),
        ],
      },
    ],
  },
};
