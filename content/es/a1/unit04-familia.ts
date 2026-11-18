import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U4 «Family» (docs/ES_A1_A2.md): la familia, los artículos el / la / los / las y el
 * masculino plural que incluye a todos (los padres = padre y madre, los hermanos, los hijos; falso
 * amigo: parents ≠ parientes), los posesivos mi / mis, tu / tus (también con vos) y su / sus (de él, de
 * ella, de usted), se llama y papá / mamá frente a padre / madre.
 * Pronunciación: la rr fuerte (perro / pero) y el yeísmo rehilado rioplatense (ella, se llama, yo).
 * Cultura: el domingo en familia y los abuelos italianos de muchas familias argentinas.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const FOTO = dialogue(
  'es.stim.a1-u4-foto',
  'Martín and Sofía look at photos on Sofía’s phone.',
  [
    ['Martín', '¿Ella es tu hermana?'],
    ['Sofía', 'Sí, se llama Camila. Tiene doce años.'],
    ['Martín', '¿Y él es tu papá?'],
    ['Sofía', 'No, es mi abuelo. Se llama Juan.'],
    ['Martín', '¿Tenés perro?'],
    ['Sofía', 'No, pero tengo dos gatos.'],
  ],
  ES_A1_RATE,
);

const POST = reading(
  'es.stim.a1-u4-post',
  'post',
  'Diego posts a family photo on social media.',
  [
    '¡Mi familia!',
    'Mi esposa, Ana, y mis hijos, Mateo y Valentina.',
    'Mateo tiene ocho años y Valentina tiene cinco.',
    'Mis padres viven en Córdoba.',
    '¡Y el perro se llama Toto!',
  ],
  { from: 'Diego' },
);

export const ES_A1_U04: EsUnitDef = {
  names: [
    'Lucía',
    'Sofía',
    'Martín',
    'Camila',
    'Juan',
    'Diego',
    'Ana',
    'Mateo',
    'Valentina',
    'Tomás',
    'Toto',
    'Pancho',
    'Rosario',
    'Córdoba',
    'Mendoza',
  ],
  support: ['las', 'con', 'viven', 'llaman'],
  unit: {
    position: 4,
    title: 'Family',
    titleEn: 'La familia',
    description:
      'Talk about your family and pets with el / la / los / las, the possessives mi, tu and su, and se llama.',
    emoji: '👨‍👩‍👧',
    objective:
      'You can introduce the people in your family and your pets, say their names and ages, and ask about someone else’s family.',
    grammar: {
      title: 'el / la / los / las · mi, tu, su',
      explanation:
        'Every noun has a gender: el padre, el hermano (masculine); la madre, la hermana (feminine). In the plural: los and las. A mixed group uses the masculine plural: los padres (father and mother), los hermanos (brothers and sisters, siblings), los hijos (children). Careful: parents is padres; parientes means relatives. Possessives: mi / mis (my), tu / tus (your, for someone you call vos — no accent: tú with an accent is the pronoun used in other countries), su / sus (his, her, their, and your for usted). Add -s when the noun is plural: mis padres, tus hermanos, sus hijos. Papá and mamá (stress on the last syllable) are the everyday words; padre and madre sound more formal. To say someone’s name: se llama (se llaman in the plural).',
      examples: [
        { target: 'Mis padres son de Córdoba.', base: 'My parents are from Córdoba.' },
        {
          target: '¿Cómo se llama tu hermana? — Se llama Camila.',
          base: 'What’s your sister’s name? — Her name is Camila.',
        },
        { target: 'Lucía vive con su abuela.', base: 'Lucía lives with her grandmother.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U4). Sin revisión nativa: revisar «¿Tenés perro?» sin artículo (habitual en la Argentina), «esposo / esposa» frente a «marido / mujer» (también muy usados), el comentario sobre los abuelos italianos y el asado del domingo, y la explicación de papá / mamá como formas cotidianas frente a padre / madre.',
    },
    words: [
      w(
        'es-la-familia',
        'la familia',
        'the family',
        'Mi familia es de Rosario.',
        'My family is from Rosario.',
        ['family'],
        { acceptedTranslations: ['family'], emoji: '👨‍👩‍👧' },
      ),
      w(
        'es-el-papa',
        'el papá',
        'dad',
        'Mi papá se llama Juan.',
        'My dad’s name is Juan.',
        ['family'],
        {
          acceptedTranslations: ['daddy'],
        },
      ),
      w(
        'es-el-padre',
        'el padre',
        'the father',
        'El padre de Lucía es italiano.',
        'Lucía’s father is Italian.',
        ['family'],
        { acceptedTranslations: ['father'] },
      ),
      w(
        'es-la-mama',
        'la mamá',
        'mom',
        'Mi mamá tiene dos hermanas.',
        'My mom has two sisters.',
        ['family'],
        { acceptedTranslations: ['mum'] },
      ),
      w(
        'es-la-madre',
        'la madre',
        'the mother',
        'La madre de Tomás es francesa.',
        'Tomás’s mother is French.',
        ['family'],
        { acceptedTranslations: ['mother'] },
      ),
      w(
        'es-los-padres',
        'los padres',
        'the parents',
        'Mis padres viven en Córdoba.',
        'My parents live in Córdoba.',
        ['family'],
        { acceptedTranslations: ['parents'] },
      ),
      w(
        'es-el-hermano',
        'el hermano',
        'the brother',
        'Tengo un hermano.',
        'I have a brother.',
        ['family'],
        { acceptedTranslations: ['brother'] },
      ),
      w(
        'es-la-hermana',
        'la hermana',
        'the sister',
        'Mi hermana tiene once años.',
        'My sister is eleven years old.',
        ['family'],
        { acceptedTranslations: ['sister'] },
      ),
      w(
        'es-el-hijo',
        'el hijo',
        'the son',
        'Su hijo se llama Mateo.',
        'Her son’s name is Mateo.',
        ['family'],
        { acceptedTranslations: ['son'] },
      ),
      w(
        'es-la-hija',
        'la hija',
        'the daughter',
        'Ana tiene una hija.',
        'Ana has a daughter.',
        ['family'],
        { acceptedTranslations: ['daughter'] },
      ),
      w(
        'es-el-abuelo',
        'el abuelo',
        'the grandfather',
        'Mi abuelo es italiano.',
        'My grandfather is Italian.',
        ['family'],
        { acceptedTranslations: ['grandpa', 'grandfather'] },
      ),
      w(
        'es-la-abuela',
        'la abuela',
        'the grandmother',
        'Mi abuela vive en Mendoza.',
        'My grandmother lives in Mendoza.',
        ['family'],
        { acceptedTranslations: ['grandma', 'grandmother'] },
      ),
      w(
        'es-el-esposo',
        'el esposo',
        'the husband',
        'Su esposo es brasileño.',
        'Her husband is Brazilian.',
        ['family'],
        { acceptedTranslations: ['husband'] },
      ),
      w(
        'es-la-esposa',
        'la esposa',
        'the wife',
        'La esposa de Diego se llama Ana.',
        'Diego’s wife’s name is Ana.',
        ['family'],
        { acceptedTranslations: ['wife'] },
      ),
      w('es-mi', 'mi', 'my', 'Ella es mi mamá.', 'She is my mom.', ['possessives'], {
        acceptedTexts: ['mis'],
      }),
      w(
        'es-tu',
        'tu',
        'your, informal',
        '¿Cómo se llama tu hermano?',
        'What’s your brother’s name?',
        ['possessives'],
        { acceptedTexts: ['tus'] },
      ),
      w(
        'es-su',
        'su',
        'his',
        'Lucía vive con su abuela.',
        'Lucía lives with her grandmother.',
        ['possessives'],
        { acceptedTranslations: ['her', 'their', 'your, formal'], acceptedTexts: ['sus'] },
      ),
      w(
        'es-se-llama',
        'se llama',
        'his name is',
        'Mi hermana se llama Camila.',
        'My sister’s name is Camila.',
        ['introductions'],
        { acceptedTranslations: ['her name is'] },
      ),
      w(
        'es-el-perro',
        'el perro',
        'the dog',
        'Tengo un perro y dos gatos.',
        'I have a dog and two cats.',
        ['animals'],
        { acceptedTranslations: ['dog'], emoji: '🐶' },
      ),
      w(
        'es-el-gato',
        'el gato',
        'the cat',
        'El gato de Sofía se llama Pancho.',
        'Sofía’s cat is called Pancho.',
        ['animals'],
        { acceptedTranslations: ['cat'], emoji: '🐱' },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Mi familia',
        objective: 'Name your parents and use el, la, los, las and mi / mis.',
        intro: {
          explanation:
            'El goes with masculine nouns (el padre) and la with feminine ones (la madre, la familia). In the plural: los and las. A mixed group uses the masculine: los padres means father and mother together. Careful: parents is padres; parientes means relatives. Mi is my, and mis goes before a plural: mis padres. To say whose: el padre de Lucía (Lucía’s father).',
          examples: [
            { target: 'Mi familia es de Rosario.', base: 'My family is from Rosario.' },
            { target: 'Mis padres son argentinos.', base: 'My parents are Argentine.' },
          ],
        },
        takeaways: [
          'You use el, la, los and las, and los padres for father and mother.',
          'You say mi with one person and mis with more than one.',
        ],
        exercises: [
          ex.translationChoice(
            'la familia',
            'the family',
            ['the father', 'the mother', 'the parents'],
            ['es-la-familia'],
            { id: 'es.ex.d0p6jmjd7pwavl' },
          ),
          ex.matchPairs(
            [
              ['el padre', 'the father'],
              ['la madre', 'the mother'],
              ['los padres', 'the parents'],
              ['la familia', 'the family'],
            ],
            ['es-el-padre', 'es-la-madre', 'es-los-padres', 'es-la-familia'],
            { id: 'es.ex.isaq820c9s8se6' },
          ),
          ex.fillBlank(
            '___ padre es italiano.',
            'My father is Italian.',
            'Mi',
            ['Mis', 'Yo', 'Me'],
            ['es-mi', 'es-el-padre'],
            {
              id: 'es.ex.n5pq9nbijboblf',
              explanation: 'One father: mi padre. Mis is for plurals: mis padres.',
            },
          ),
          ex.fillBlank(
            'Mis ___ viven en Córdoba.',
            'My parents live in Córdoba.',
            'padres',
            ['padre', 'madre', 'familia'],
            ['es-los-padres', 'es-mi'],
            {
              id: 'es.ex.3bmrc12lopspca',
              explanation:
                'Mis needs a plural noun: mis padres (my father and my mother). Padre and madre are singular.',
            },
          ),
          ex.listenChoice(
            'Mi madre es francesa.',
            ['Mi padre es francés.', 'Mis padres son franceses.', 'Mi madre es inglesa.'],
            ['es-la-madre', 'es-mi'],
            { id: 'es.ex.k4e5l1r8yec64w' },
          ),
          ex.translationChoice(
            'los padres',
            'the parents',
            ['the relatives', 'the family', 'the mother'],
            ['es-los-padres'],
            {
              id: 'es.ex.fr8so4bgu00enh',
              explanation:
                'Los padres are your father and mother. False friend: parientes means relatives.',
            },
          ),
          ex.fillBlank(
            '___ madre de Lucía es argentina.',
            'Lucía’s mother is Argentine.',
            'La',
            ['El', 'Los', 'Las'],
            ['es-la-madre'],
            {
              id: 'es.ex.she9elm5y9a98i',
              explanation:
                'Madre is feminine and singular: la madre. To say whose, use de: la madre de Lucía.',
            },
          ),
          ex.orderWords(
            'Mi familia es de Rosario.',
            'My family is from Rosario.',
            ['es-mi', 'es-la-familia'],
            { id: 'es.ex.drrlke3u11olr2' },
          ),
          ex.translateWrite(
            'My parents are Argentine.',
            'Mis padres son argentinos.',
            ['es-mi', 'es-los-padres'],
            { id: 'es.ex.9djicxzisnnvbs' },
          ),
          ex.translateWrite(
            "Lucía's father is Italian.",
            'El padre de Lucía es italiano.',
            ['es-el-padre'],
            { id: 'es.ex.kcnwidfaza9dhd' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Papá, mamá y hermanos',
        objective: 'Talk about your mom, dad, brothers and sisters, and ask about a friend’s.',
        intro: {
          explanation:
            'Papá and mamá are what people say every day; padre and madre sound more formal. Both have the stress on the last syllable, marked with the accent. Los hermanos means brothers, or brothers and sisters together. Tu is your for someone you call vos (tus before a plural). And se llama tells you someone’s name: mi mamá se llama Ana.',
          examples: [
            { target: 'Mi mamá se llama Ana.', base: 'My mom’s name is Ana.' },
            {
              target: '¿Vos tenés hermanos? — Sí, tengo una hermana.',
              base: 'Do you have any siblings? — Yes, I have a sister.',
            },
          ],
        },
        takeaways: [
          'You say papá, mamá, hermano and hermana.',
          'You ask a friend about family with tu: ¿cómo se llama tu hermano?',
        ],
        exercises: [
          ex.translationChoice(
            'el hermano',
            'the brother',
            ['the sister', 'the father', 'dad'],
            ['es-el-hermano'],
            { id: 'es.ex.obca2bvxq564mh' },
          ),
          ex.matchPairs(
            [
              ['el papá', 'dad'],
              ['la mamá', 'mom'],
              ['el hermano', 'the brother'],
              ['la hermana', 'the sister'],
            ],
            ['es-el-papa', 'es-la-mama', 'es-el-hermano', 'es-la-hermana'],
            { id: 'es.ex.3rhz5afxctlu8q' },
          ),
          ex.fillBlank(
            '¿Cómo se llama ___ hermana?',
            'What’s your sister’s name? (to a friend)',
            'tu',
            ['mi', 'tus', 'usted'],
            ['es-tu', 'es-la-hermana', 'es-se-llama'],
            {
              id: 'es.ex.285p5dc50q9bya',
              explanation:
                'Your (to a friend) is tu, and with one sister it is singular: tu hermana. Tus goes before a plural.',
            },
          ),
          ex.listenChoice(
            'Mi hermano se llama Diego.',
            [
              'Mi hermana se llama Camila.',
              'Tu hermano se llama Diego.',
              'Mi papá se llama Diego.',
            ],
            ['es-el-hermano', 'es-se-llama'],
            { id: 'es.ex.rh64rbqotj5efq' },
          ),
          ex.translationChoice(
            'se llama',
            'his name is',
            ['my name is', 'he is', 'he has'],
            ['es-se-llama'],
            { id: 'es.ex.4ji0dcz73jslv5' },
          ),
          ex.fillBlank(
            'Mi mamá ___ Ana.',
            'My mom’s name is Ana.',
            'se llama',
            ['me llamo', 'te llamás', 'tiene'],
            ['es-la-mama', 'es-se-llama'],
            {
              id: 'es.ex.fxhxgc1i8orly3',
              explanation:
                'For another person (él, ella): se llama. Me llamo is for yourself and te llamás for vos.',
            },
          ),
          ex.fillBlank(
            '¿Vos tenés ___? — Sí, un hermano y una hermana.',
            'Do you have siblings? — Yes, a brother and a sister.',
            'hermanos',
            ['hermanas', 'hermano', 'padres'],
            ['es-el-hermano', 'es-la-hermana'],
            {
              id: 'es.ex.73yvlxfks5oji8',
              explanation:
                'A brother and a sister together are hermanos: the masculine plural includes everyone.',
            },
          ),
          ex.listenChoice(
            'Ella se llama Lucía.',
            ['Él se llama Juan.', 'Yo me llamo Lucía.', 'Ella es Lucía.'],
            ['es-se-llama'],
            { id: 'es.ex.k6oufgknrzt3ov' },
          ),
          ex.translateWrite(
            'My dad is Brazilian.',
            'Mi papá es brasileño.',
            ['es-mi', 'es-el-papa'],
            {
              id: 'es.ex.qyaghpmiz4fuw8',
              acceptedAnswers: ['Mi padre es brasileño.'],
            },
          ),
          ex.shortAnswer(
            '¿Cómo se llama tu mamá?',
            'Answer with the name Lucía (e.g. «Se llama Lucía»).',
            'Se llama Lucía.',
            ['Se llama Lucía', 'Mi mamá se llama Lucía.', 'Mi madre se llama Lucía.'],
            ['es-se-llama', 'es-la-mama'],
            { id: 'es.ex.i5wwtk5t3uepz6' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Abuelos, hijos y su',
        objective: 'Talk about grandparents, children and partners, and use su / sus.',
        intro: {
          explanation:
            'Su means his, her or their, and also your when you speak to someone as usted: su hijo can be his son, her son or your son. Sus goes before a plural: sus hijos. Los hijos means children (sons and daughters); los abuelos, grandparents. Many Argentine families have Italian or Spanish grandparents.',
          examples: [
            { target: 'Mi abuelo es italiano.', base: 'My grandfather is Italian.' },
            { target: 'Diego tiene una hija y un hijo.', base: 'Diego has a daughter and a son.' },
          ],
        },
        takeaways: [
          'You talk about abuelos, hijos, esposo and esposa.',
          'You use su / sus for his, her, their and your (usted).',
        ],
        exercises: [
          ex.translationChoice(
            'la abuela',
            'the grandmother',
            ['the mother', 'the sister', 'the daughter'],
            ['es-la-abuela'],
            { id: 'es.ex.vl6e5f0bb38l3x' },
          ),
          ex.matchPairs(
            [
              ['el abuelo', 'the grandfather'],
              ['el hijo', 'the son'],
              ['la hija', 'the daughter'],
              ['la esposa', 'the wife'],
            ],
            ['es-el-abuelo', 'es-el-hijo', 'es-la-hija', 'es-la-esposa'],
            { id: 'es.ex.xr5s0dfxosf7ne' },
          ),
          ex.fillBlank(
            'Lucía vive con ___ abuela.',
            'Lucía lives with her grandmother.',
            'su',
            ['tu', 'mi', 'sus'],
            ['es-su', 'es-la-abuela'],
            {
              id: 'es.ex.w8zfzakxmtgvp2',
              explanation:
                'Her (Lucía’s) is su, and with one grandmother it is singular: su abuela.',
            },
          ),
          ex.listenChoice(
            'Mi abuelo es italiano.',
            ['Mi abuela es italiana.', 'Mi abuelo es inglés.', 'Tu abuelo es italiano.'],
            ['es-el-abuelo'],
            { id: 'es.ex.5mmjiufcb4q164' },
          ),
          ex.translationChoice(
            'el esposo',
            'the husband',
            ['the son', 'the brother', 'the father'],
            ['es-el-esposo'],
            { id: 'es.ex.25oal3f4kd4iz9' },
          ),
          ex.fillBlank(
            'Diego tiene ___ hija y un hijo.',
            'Diego has a daughter and a son.',
            'una',
            ['un', 'uno', 'la'],
            ['es-la-hija', 'es-el-hijo'],
            {
              id: 'es.ex.khxnur1eoddx9a',
              explanation: 'Hija is feminine: una hija. Hijo is masculine: un hijo.',
            },
          ),
          ex.fillBlank(
            'Señora, ¿___ hijos viven en Córdoba?',
            'Madam, do your children live in Córdoba?',
            'sus',
            ['su', 'tus', 'tu'],
            ['es-su', 'es-el-hijo'],
            {
              id: 'es.ex.cx9alzyifzet9p',
              explanation:
                'With usted (señora), your is su, and before a plural it is sus: sus hijos. Tus is for vos.',
            },
          ),
          ex.orderWords(
            'Mi abuela vive en Mendoza.',
            'My grandmother lives in Mendoza.',
            ['es-la-abuela', 'es-mi'],
            { id: 'es.ex.2ft29ep5xt48gf' },
          ),
          ex.translateWrite(
            'His wife is French.',
            'Su esposa es francesa.',
            ['es-su', 'es-la-esposa'],
            {
              id: 'es.ex.hzpv3fxr1ikaij',
            },
          ),
          ex.translateWrite(
            'I have a son and a daughter.',
            'Tengo un hijo y una hija.',
            ['es-el-hijo', 'es-la-hija'],
            { id: 'es.ex.h3jd2yfx509enq', acceptedAnswers: ['Yo tengo un hijo y una hija.'] },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'El perro y el gato',
        objective: 'Talk about pets and pronounce rr and ll.',
        intro: {
          explanation:
            'Perro (dog) has a strong, trilled rr; pero (but) has a single quick tap, like the tt in American butter: two different words. In Buenos Aires ll and y sound the same, like the sh in shoe or the s in measure: ella, se llama, yo. In Argentina people often ask ¿tenés perro? without un.',
          examples: [
            { target: 'Tengo un perro y dos gatos.', base: 'I have a dog and two cats.' },
            { target: 'Mi perro se llama Toto.', base: 'My dog’s name is Toto.' },
          ],
        },
        takeaways: [
          'You say el perro and el gato, and los gatos in the plural.',
          'You trill the rr in perro and say ll like the sh in shoe.',
        ],
        exercises: [
          ex.imageChoice('🐶', 'el perro', ['el gato', 'el hijo', 'el abuelo'], ['es-el-perro'], {
            id: 'es.ex.lk1umol1s6ixka',
          }),
          ex.translationChoice(
            'el gato',
            'the cat',
            ['the dog', 'the son', 'the brother'],
            ['es-el-gato'],
            { id: 'es.ex.21aj1evqjcvulj' },
          ),
          ex.listenChoice('perro', ['pero', 'padre'], ['es-el-perro'], {
            id: 'es.ex.tmut7bd5fr70zp',
          }),
          ex.fillBlank(
            'Tengo un perro y dos ___.',
            'I have a dog and two cats.',
            'gatos',
            ['gato', 'perro', 'hermano'],
            ['es-el-gato', 'es-el-perro'],
            {
              id: 'es.ex.m2lx3ovvurxob7',
              explanation: 'After dos the noun is plural: dos gatos.',
            },
          ),
          question(
            'es.ex.iia2aifn4dl48o',
            FOTO,
            'Who is Camila?',
            'Sofía’s sister',
            ['Sofía’s mother', 'Sofía’s daughter', 'Martín’s sister'],
            ['es-la-hermana', 'es-se-llama'],
            'Martín asks “¿Ella es tu hermana?” and Sofía answers “Sí, se llama Camila”.',
          ),
          question(
            'es.ex.41lw4liht9ypn2',
            FOTO,
            'Who is Juan?',
            'Sofía’s grandfather',
            ['Sofía’s dad', 'Sofía’s brother', 'Sofía’s son'],
            ['es-el-abuelo', 'es-el-papa'],
            'Sofía says “No, es mi abuelo. Se llama Juan”.',
          ),
          question(
            'es.ex.loh04qn5us6hop',
            FOTO,
            'Does Sofía have a dog?',
            'No, but she has two cats',
            ['Yes, one dog', 'Yes, two dogs', 'No, she has no pets'],
            ['es-el-perro', 'es-el-gato'],
            'Sofía answers “No, pero tengo dos gatos”.',
          ),
          ex.listenChoice(
            'Mi perro se llama Toto.',
            ['Mi gato se llama Toto.', 'Tu perro se llama Toto.', 'Mi perro es Toto.'],
            ['es-el-perro', 'es-se-llama'],
            { id: 'es.ex.gdpgvnqpeb161h' },
          ),
          ex.translateWrite(
            "My cat's name is Pancho.",
            'Mi gato se llama Pancho.',
            ['es-el-gato', 'es-se-llama', 'es-mi'],
            { id: 'es.ex.c7o25qpif0oscj' },
          ),
          ex.shortAnswer(
            '¿Tenés perro?',
            'Say no, but that you have a cat (e.g. «No, pero tengo un gato»).',
            'No, pero tengo un gato.',
            ['No, pero tengo un gato', 'No. Pero tengo un gato.', 'No, tengo un gato.'],
            ['es-el-perro', 'es-el-gato'],
            { id: 'es.ex.y7ajxsog01l8b3' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '¡Mi familia!',
        objective: 'Understand a family post and a conversation, and describe your family.',
        intro: {
          explanation:
            'In Argentina Sunday is often a family day: many families meet at the grandparents’ house for an asado (barbecue). When you introduce several people, use the plural: mis padres, mis hijos, se llaman.',
          examples: [
            { target: 'Mis padres viven en Córdoba.', base: 'My parents live in Córdoba.' },
            {
              target: 'Mis hijos se llaman Mateo y Valentina.',
              base: 'My children are called Mateo and Valentina.',
            },
          ],
        },
        takeaways: [
          'You understand a short post about a family.',
          'You say the names of several people with se llaman.',
        ],
        exercises: [
          question(
            'es.ex.5icygkk2fu7c5s',
            POST,
            'What is Diego’s wife’s name?',
            'Ana',
            ['Valentina', 'Camila', 'Lucía'],
            ['es-la-esposa'],
            'Diego writes “Mi esposa, Ana”.',
          ),
          question(
            'es.ex.wgia6ziope5jup',
            POST,
            'How many children does Diego have?',
            'Two: a son and a daughter',
            ['One son', 'Two daughters', 'Three children'],
            ['es-el-hijo', 'es-la-hija'],
            'He writes “mis hijos, Mateo y Valentina”: hijos includes a son and a daughter.',
          ),
          question(
            'es.ex.70kkuaemnr11pe',
            POST,
            'Where do Diego’s parents live?',
            'In Córdoba',
            ['In Rosario', 'With Diego', 'In Mendoza'],
            ['es-los-padres'],
            'He writes “Mis padres viven en Córdoba”.',
          ),
          question(
            'es.ex.z25yguf3510101',
            POST,
            'Who is Toto?',
            'The family dog',
            ['Diego’s son', 'The family cat', 'Diego’s father'],
            ['es-el-perro', 'es-se-llama'],
            'The post ends “¡Y el perro se llama Toto!”.',
          ),
          question(
            'es.ex.2mg1rpiucnd1c7',
            FOTO,
            'How old is Sofía’s sister?',
            'Twelve',
            ['Two', 'Ten', 'Eleven'],
            ['es-la-hermana'],
            'Sofía says “se llama Camila. Tiene doce años”.',
          ),
          ex.matchPairs(
            [
              ['mi', 'my'],
              ['tu', 'your, informal'],
              ['su', 'his, her, their'],
              ['la familia', 'the family'],
            ],
            ['es-mi', 'es-tu', 'es-su', 'es-la-familia'],
            { id: 'es.ex.y98sl6dsjnewax' },
          ),
          ex.fillBlank(
            'Mis hijos ___ Mateo y Valentina.',
            'My children are called Mateo and Valentina.',
            'se llaman',
            ['se llama', 'me llamo', 'tiene'],
            ['es-se-llama', 'es-el-hijo'],
            {
              id: 'es.ex.yg6ks2c2zmstln',
              explanation: 'For two or more people the verb is plural: se llaman.',
            },
          ),
          ex.listenChoice(
            'Mis padres son de Córdoba.',
            ['Mi padre es de Córdoba.', 'Mis padres son de Rosario.', 'Tus padres son de Córdoba.'],
            ['es-los-padres', 'es-mi'],
            { id: 'es.ex.fdqi5qus8n68fr' },
          ),
          ex.translateWrite(
            "My wife's name is Ana.",
            'Mi esposa se llama Ana.',
            ['es-la-esposa', 'es-se-llama'],
            { id: 'es.ex.m2ttjl3bxo59vh' },
          ),
          ex.shortAnswer(
            '¿Cómo se llaman tus padres?',
            'Answer that your parents are called Ana and Juan (e.g. «Se llaman Ana y Juan»).',
            'Se llaman Ana y Juan.',
            [
              'Se llaman Ana y Juan',
              'Mis padres se llaman Ana y Juan.',
              'Mis padres se llaman Ana y Juan',
            ],
            ['es-los-padres', 'es-tu', 'es-se-llama'],
            { id: 'es.ex.7sbsec3mkt9xgh' },
          ),
        ],
      },
    ],
  },
};
