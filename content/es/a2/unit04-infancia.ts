import type { EsUnitDef } from '../../es-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Español A2 U4 «When I was a kid» (docs/ES_A1_A2.md): describir la infancia y las costumbres del
 * pasado con el pretérito imperfecto (-aba: jugaba; -ía: tenía, vivía; irregulares ser → era,
 * ir → iba, ver → veía; había), con de chico / cuando era chico, generalmente, cada verano, y
 * contrastar antes (imperfecto) con ahora (presente). Con vos el imperfecto no cambia: vos tenías,
 * vos eras (igual que en el resto del mundo hispano).
 * Pronunciación: la tilde de -ía (tenía, vivía, había) rompe el diptongo: tres sílabas.
 * Cultura: crecer en un pueblo del campo argentino; los veranos en la casa de los abuelos.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const RECUERDO = reading(
  'es.stim.a2-u4-recuerdo',
  'post',
  'Valentina shares an old photo of her village on social media.',
  [
    'Cuando era chica, vivía en un pueblo en el campo, cerca de Córdoba.',
    'Mi familia tenía una casa grande y dos perros.',
    'En el pueblo no había cine, pero había una escuela primaria muy linda.',
    'Generalmente jugaba en la calle con mis hermanos.',
    'Ahora vivo en Buenos Aires, pero cada verano vuelvo al pueblo.',
  ],
  { from: 'Valentina' },
);

const ABUELO = dialogue('es.stim.a2-u4-abuelo', 'Tomás asks his grandfather about his childhood.', [
  ['Tomás', 'Abuelo, ¿cómo era tu infancia?'],
  ['Pedro', 'Muy diferente. Antes vivíamos en el campo y no teníamos auto.'],
  ['Tomás', '¿Y cómo ibas a la escuela?'],
  ['Pedro', 'Iba a pie con mis hermanos, todos los días.'],
  ['Tomás', '¿Tenías juguetes?'],
  ['Pedro', 'Pocos. Jugaba al fútbol con una pelota vieja.'],
  ['Tomás', '¿Y mirabas la tele?'],
  ['Pedro', '¡No había tele! De noche escuchábamos la radio.'],
]);

const ANTES_AHORA = dialogue(
  'es.stim.a2-u4-antes-ahora',
  'Two friends talk about where they grew up.',
  [
    ['Martín', 'Lucía, ¿de chica vivías en Rosario?'],
    ['Lucía', 'No, crecí en Mendoza. Vivía en un departamento chico con mis padres.'],
    ['Martín', '¿Y qué hacías los fines de semana?'],
    ['Lucía', 'Generalmente íbamos a la montaña. ¡Me encantaba! ¿Y vos?'],
    ['Martín', 'Yo, de chico, miraba la tele todo el día.'],
  ],
);

export const ES_A2_U04: EsUnitDef = {
  names: [
    'Valentina',
    'Córdoba',
    'Buenos Aires',
    'Tomás',
    'Pedro',
    'Martín',
    'Lucía',
    'Mendoza',
    'Rosario',
  ],
  support: [
    'diferente',
    'vivíamos',
    'teníamos',
    'ibas',
    'iba',
    'íbamos',
    'tenías',
    'pelota',
    'viejo',
    'mirabas',
    'miraba',
    'escuchábamos',
    'vivías',
    'hacías',
    'encantaba',
    'crecí',
    'veía',
    'vivían',
    'tenían',
    'jugábamos',
    'jugaban',
    'eras',
    'comía',
  ],
  unit: {
    position: 4,
    title: 'When I was a kid',
    titleEn: 'Cuando era chico',
    description:
      'Describe your childhood and past habits with the imperfect (era, tenía, vivía, jugaba, había, iba), and compare antes with ahora.',
    emoji: '🧸',
    objective:
      'You can describe where you lived, what you were like and what you used to do as a child, and compare the past with the present.',
    grammar: {
      title: 'The imperfect: era, tenía, vivía, jugaba, había',
      explanation:
        'To describe how things were and what you used to do, Spanish uses the imperfect (pretérito imperfecto). Verbs in -ar take -aba (jugar → jugaba, mirar → miraba); verbs in -er and -ir take -ía (tener → tenía, vivir → vivía). The yo form and the él / ella form are the same: era can mean I was or he / she was. With vos and ustedes: vos jugabas, vos tenías, ellos vivían (with vos there is no special form here: it is the same in every Spanish-speaking country). For we: jugábamos, teníamos. Only three verbs are irregular: ser → era, ir → iba, ver → veía. Había is the past of hay (there was / there were) and never changes: había un cine, había muchos chicos. The imperfect describes the background and habits (cuando era chico, generalmente, cada verano); for one finished event you already know the preterite (crecí en Córdoba, fui a Mendoza).',
      examples: [
        {
          target: 'Cuando era chico, vivía en un pueblo.',
          base: 'When I was little, I lived in a village.',
        },
        {
          target: 'En el pueblo no había cine.',
          base: 'There was no cinema in the village.',
        },
        {
          target: 'Antes vivía en el campo; ahora vivo en la ciudad.',
          base: 'I used to live in the countryside; now I live in the city.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U4). Sin revisión nativa. Revisar: «de chico / de chica» y «cuando era chico» (lo habitual en la Argentina, frente a «de pequeño», que no se enseña); «jugar al fútbol» (con al, como se dice acá); «la primaria» por la escuela primaria; «la tele»; «la escuela era lejos» se evitó (lo natural es «quedaba lejos», no enseñado). En el diálogo del abuelo, «iba a pie» en vez de «iba a caballo» para no sumar vocabulario.',
    },
    words: [
      w(
        'es-era',
        'era',
        'I was (back then)',
        'De chico, era muy tímido.',
        'As a kid, I was very shy.',
        ['past'],
        { acceptedTranslations: ['it was', 'he was', 'she was'] },
      ),
      w(
        'es-tenia',
        'tenía',
        'I had (back then)',
        'Cuando era chico, tenía un perro.',
        'When I was little, I had a dog.',
        ['past'],
        { acceptedTranslations: ['I used to have'] },
      ),
      w(
        'es-vivia',
        'vivía',
        'I used to live',
        'Antes vivía en el campo.',
        'I used to live in the countryside.',
        ['past'],
        { acceptedTranslations: ['I lived'] },
      ),
      w(
        'es-jugaba',
        'jugaba',
        'I used to play',
        'De chica, jugaba al fútbol.',
        'As a girl, I used to play football.',
        ['past'],
        { acceptedTranslations: ['I played'] },
      ),
      w(
        'es-habia',
        'había',
        'there was',
        'En el pueblo había un cine.',
        'There was a cinema in the village.',
        ['past'],
        { acceptedTranslations: ['there were'] },
      ),
      w(
        'es-de-chico',
        'de chico',
        'as a kid',
        'De chico, vivía en Córdoba.',
        'As a kid, I lived in Córdoba.',
        ['time'],
        { acceptedTranslations: ['as a child'], acceptedTexts: ['de chica'] },
      ),
      w(
        'es-cuando-era-chico',
        'cuando era chico',
        'when I was little',
        'Cuando era chico, jugaba en la calle.',
        'When I was little, I used to play in the street.',
        ['time'],
        { acceptedTranslations: ['when I was a kid'], acceptedTexts: ['cuando era chica'] },
      ),
      w(
        'es-antes',
        'antes',
        'before',
        'Antes vivía en un pueblo; ahora vivo en la ciudad.',
        'I used to live in a village; now I live in the city.',
        ['time'],
        { acceptedTranslations: ['in the past'] },
      ),
      w(
        'es-la-infancia',
        'la infancia',
        'childhood',
        'Tengo muchos recuerdos de mi infancia.',
        'I have lots of memories of my childhood.',
        ['life'],
      ),
      w(
        'es-el-pueblo',
        'el pueblo',
        'the village',
        'Mi abuela vive en un pueblo chico.',
        'My grandmother lives in a small village.',
        ['places'],
        { acceptedTranslations: ['the small town'] },
      ),
      w(
        'es-el-campo',
        'el campo',
        'the countryside',
        'Mis abuelos tenían una casa en el campo.',
        'My grandparents had a house in the countryside.',
        ['places'],
      ),
      w(
        'es-el-juguete',
        'el juguete',
        'the toy',
        'De chico, tenía pocos juguetes.',
        'As a kid, I had few toys.',
        ['life'],
        { emoji: '🧸' },
      ),
      w(
        'es-la-primaria',
        'la primaria',
        'primary school',
        'Iba a la primaria a pie.',
        'I used to walk to primary school.',
        ['studies'],
        { acceptedTranslations: ['elementary school'] },
      ),
      w(
        'es-cada',
        'cada',
        'each',
        'Cada verano íbamos a la playa.',
        'Every summer we went to the beach.',
        ['frequency'],
        { acceptedTranslations: ['every'] },
      ),
      w(
        'es-el-recuerdo',
        'el recuerdo',
        'the memory',
        'Es un recuerdo muy lindo.',
        'It’s a lovely memory.',
        ['life'],
      ),
      w(
        'es-crecer',
        'crecer',
        'to grow up',
        'Crecí en el campo.',
        'I grew up in the countryside.',
        ['verbs'],
      ),
      w(
        'es-generalmente',
        'generalmente',
        'usually',
        'Generalmente comía en la casa de mi abuela.',
        'I usually ate at my grandmother’s house.',
        ['frequency'],
        { acceptedTranslations: ['normally'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Cuando era chico…',
        objective: 'Say where you lived and what you were like as a child.',
        intro: {
          explanation:
            'To talk about your childhood, start with cuando era chico (a girl says cuando era chica) or the shorter de chico / de chica: in Argentina chico means kid. Then use the imperfect: era (I was), vivía (I used to live). Vivir → vivía: the í has an accent, so the i and the a are two separate syllables: vi-ví-a. The same form works for he and she: Lucía vivía en Córdoba.',
          examples: [
            {
              target: 'Cuando era chico, vivía en un pueblo.',
              base: 'When I was little, I lived in a village.',
            },
            { target: 'De chica, era muy tímida.', base: 'As a girl, I was very shy.' },
          ],
        },
        takeaways: [
          'You start a childhood memory with cuando era chico or de chico.',
          'You say where you lived with vivía and what you were like with era.',
        ],
        exercises: [
          ex.translationChoice(
            'era',
            'I was (back then)',
            ['I am', 'I used to live', 'I was born'],
            ['es-era'],
            { id: 'es.ex.d18k07htqpf7rw' },
          ),
          ex.translationChoice(
            'vivía',
            'I used to live',
            ['I live', 'I used to play', 'I grew up'],
            ['es-vivia'],
            { id: 'es.ex.8gd65h5wptq9ut' },
          ),
          ex.matchPairs(
            [
              ['el pueblo', 'the village'],
              ['el campo', 'the countryside'],
              ['la infancia', 'childhood'],
              ['de chico', 'as a kid'],
            ],
            ['es-el-pueblo', 'es-el-campo', 'es-la-infancia', 'es-de-chico'],
            { id: 'es.ex.pwa94cgu70ymmo' },
          ),
          ex.fillBlank(
            'Cuando era chico, ___ en el campo.',
            'When I was little, I lived in the countryside.',
            'vivía',
            ['vivo', 'era', 'tengo'],
            ['es-cuando-era-chico', 'es-vivia', 'es-el-campo'],
            {
              id: 'es.ex.13wliqmw2zfd58',
              explanation:
                'To describe how life used to be, use the imperfect: vivía. Vivo is the present (I live now).',
            },
          ),
          ex.listenChoice(
            'Vivía en un pueblo.',
            ['Vivo en un pueblo.', 'Vivía en una ciudad.', 'Vivía en el campo.'],
            ['es-vivia', 'es-el-pueblo'],
            { id: 'es.ex.b9v1r0zids1ob5' },
          ),
          ex.fillBlank(
            'De chica, ___ muy tímida.',
            'As a girl, I was very shy.',
            'era',
            ['soy', 'estoy', 'sos'],
            ['es-de-chico', 'es-era'],
            {
              id: 'es.ex.cn27mjevkyuwsx',
              explanation:
                'Era is the imperfect of ser, used to describe what someone was like in the past. Soy is the present.',
            },
          ),
          ex.orderWords(
            'De chico vivía en el campo.',
            'As a kid, I lived in the countryside.',
            ['es-de-chico', 'es-vivia', 'es-el-campo'],
            { id: 'es.ex.exzhshcojhrjaz' },
          ),
          ex.listenChoice(
            'Era muy tímido.',
            ['Es muy tímido.', 'Era muy simpático.', 'Soy muy tímido.'],
            ['es-era'],
            { id: 'es.ex.al84iyb4ulfz2l' },
          ),
          ex.translateWrite(
            'When I was little, I lived in a village.',
            'Cuando era chico, vivía en un pueblo.',
            ['es-cuando-era-chico', 'es-vivia', 'es-el-pueblo'],
            {
              id: 'es.ex.4vitdc2w1xvhj9',
              acceptedAnswers: [
                'Cuando era chica, vivía en un pueblo.',
                'Cuando era chico vivía en un pueblo.',
                'Cuando era chica vivía en un pueblo.',
                'De chico, vivía en un pueblo.',
                'De chica, vivía en un pueblo.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Dónde vivías de chico?',
            'Answer that you lived in the countryside (start with «Vivía…»).',
            'Vivía en el campo.',
            [
              'Vivía en el campo',
              'De chico, vivía en el campo.',
              'De chica, vivía en el campo.',
              'Cuando era chico, vivía en el campo.',
              'Cuando era chica, vivía en el campo.',
            ],
            ['es-vivia', 'es-el-campo'],
            { id: 'es.ex.r448xlk9dmo32b' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Tenía, había, jugaba',
        objective: 'Talk about what you had, what there was and what you played as a child.',
        intro: {
          explanation:
            'Verbs in -ar take -aba: jugar → jugaba (I used to play). Verbs in -er take -ía: tener → tenía (I used to have). Había is the past of hay: there was or there were, always the same form (había un cine, había dos escuelas). In Argentina you play a sport with al: jugaba al fútbol. La primaria is primary school, and in jugaba the b between vowels is soft, almost like a v.',
          examples: [
            { target: 'En mi pueblo había un cine.', base: 'There was a cinema in my village.' },
            {
              target: 'De chico, tenía un perro y jugaba con él.',
              base: 'As a kid, I had a dog and I used to play with it.',
            },
          ],
        },
        takeaways: [
          'You say what you had with tenía and what there was with había.',
          'You say what you used to play with jugaba.',
        ],
        exercises: [
          ex.translationChoice(
            'había',
            'there was',
            ['there is', 'I had (back then)', 'I used to play'],
            ['es-habia'],
            { id: 'es.ex.glrybpa55gx6xy' },
          ),
          ex.translationChoice(
            'el juguete',
            'the toy',
            ['the ball', 'the book', 'the village'],
            ['es-el-juguete'],
            { id: 'es.ex.sjc3uuvwbtzrcl' },
          ),
          ex.fillBlank(
            'En el pueblo no ___ cine.',
            'There was no cinema in the village.',
            'había',
            ['hay', 'tenía', 'era'],
            ['es-habia', 'es-el-pueblo'],
            {
              id: 'es.ex.ku8abcglgo57a2',
              explanation:
                'Había is the past of hay: there was. Hay is the present (there is). Tenía means I had.',
            },
          ),
          ex.listenChoice(
            'Tenía un perro.',
            ['Tengo un perro.', 'Tenía un gato.', 'Había un perro.'],
            ['es-tenia'],
            { id: 'es.ex.wbw9q3rzcmfs2j' },
          ),
          ex.matchPairs(
            [
              ['tenía', 'I had (back then)'],
              ['había', 'there was'],
              ['jugaba', 'I used to play'],
              ['la primaria', 'primary school'],
            ],
            ['es-tenia', 'es-habia', 'es-jugaba', 'es-la-primaria'],
            { id: 'es.ex.5ocxokeqzdbkno' },
          ),
          ex.fillBlank(
            'De chico, ___ al fútbol en la calle.',
            'As a kid, I used to play football in the street.',
            'jugaba',
            ['juego', 'jugar', 'tenía'],
            ['es-jugaba', 'es-de-chico'],
            {
              id: 'es.ex.qalw2eo51xgr5n',
              explanation:
                'For a past habit, -ar verbs take -aba: jugar → jugaba. Juego is the present; jugar is the infinitive.',
            },
          ),
          ex.orderWords(
            'Mi hermano tenía un juguete rojo.',
            'My brother had a red toy.',
            ['es-tenia', 'es-el-juguete'],
            { id: 'es.ex.u77oh9tvacq7o9' },
          ),
          ex.listenChoice(
            'Había un juguete en la mesa.',
            [
              'Hay un juguete en la mesa.',
              'Había un libro en la mesa.',
              'Había un juguete en la silla.',
            ],
            ['es-habia', 'es-el-juguete'],
            { id: 'es.ex.ue3p7919g6us1c' },
          ),
          ex.translateWrite(
            'In primary school, I used to play football.',
            'En la primaria, jugaba al fútbol.',
            ['es-la-primaria', 'es-jugaba'],
            {
              id: 'es.ex.x7ojtd69j62z80',
              acceptedAnswers: [
                'En la primaria jugaba al fútbol.',
                'En la primaria, jugaba fútbol.',
                'Jugaba al fútbol en la primaria.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Tenías juguetes de chico?',
            'Answer yes: you had a lot of toys (start with «Sí, tenía…»).',
            'Sí, tenía muchos juguetes.',
            [
              'Sí, tenía muchos juguetes',
              'Sí, de chico tenía muchos juguetes.',
              'Sí, de chica tenía muchos juguetes.',
              'Sí, tenía muchos.',
            ],
            ['es-tenia', 'es-el-juguete'],
            { id: 'es.ex.bgsepf3igd4ncs' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Generalmente, cada verano',
        objective: 'Describe habits and routines in the past.',
        intro: {
          explanation:
            'The imperfect is also for things you did again and again: generalmente (usually), siempre, a veces, todos los días, cada verano (every summer). Cada never changes and goes with a singular noun: cada verano, cada domingo. Two useful irregular verbs: ir → iba (I used to go), ver → veía (I used to see). For we: íbamos, with an accent on the first í.',
          examples: [
            {
              target: 'Cada verano íbamos a la playa.',
              base: 'Every summer we went to the beach.',
            },
            {
              target: 'Generalmente veía a mis abuelos los domingos.',
              base: 'I usually saw my grandparents on Sundays.',
            },
          ],
        },
        takeaways: [
          'You describe past habits with generalmente, siempre or cada + the imperfect.',
          'You use iba and veía, the imperfect of ir and ver.',
        ],
        exercises: [
          ex.translationChoice(
            'generalmente',
            'usually',
            ['always', 'sometimes', 'every day'],
            ['es-generalmente'],
            { id: 'es.ex.zeqb4mggsq4g7c' },
          ),
          ex.fillBlank(
            '___ verano íbamos a la playa.',
            'Every summer we went to the beach.',
            'Cada',
            ['Todos', 'Siempre', 'Mucho'],
            ['es-cada'],
            {
              id: 'es.ex.atjyrrozkbbfjv',
              skill: 'vocabulary',
              explanation:
                'Cada + a singular noun: cada verano. With todos you need the plural: todos los veranos.',
            },
          ),
          ex.listenChoice(
            'Generalmente iba a la escuela a pie.',
            [
              'Generalmente voy a la escuela a pie.',
              'Generalmente iba a la escuela en tren.',
              'Siempre iba a la escuela a pie.',
            ],
            ['es-generalmente'],
            { id: 'es.ex.bfw7f9r8qei4wp' },
          ),
          ex.fillBlank(
            'Generalmente ___ a mis abuelos los domingos.',
            'I usually saw my grandparents on Sundays.',
            'veía',
            ['vi', 'iba', 'era'],
            ['es-generalmente'],
            {
              id: 'es.ex.f54abghgu8n1q3',
              explanation:
                'A repeated action in the past takes the imperfect: veía. Vi (preterite) is for one specific time.',
            },
          ),
          question(
            'es.ex.xuka6c0in4jysl',
            RECUERDO,
            'Where did Valentina live as a child?',
            'In a village in the countryside',
            ['In Buenos Aires', 'In the center of Córdoba', 'In a big city by the sea'],
            ['es-vivia', 'es-el-pueblo', 'es-el-campo'],
            'She writes “vivía en un pueblo en el campo, cerca de Córdoba”.',
          ),
          question(
            'es.ex.1xhapi991f43x2',
            RECUERDO,
            'What was there NOT in her village?',
            'A cinema',
            ['A school', 'Streets to play in', 'Houses with dogs'],
            ['es-habia'],
            '“En el pueblo no había cine”: there was no cinema. There was a school: “había una escuela primaria muy linda”.',
          ),
          ex.orderWords(
            'Generalmente jugaba en la calle con mis hermanos.',
            'I usually played in the street with my brothers and sisters.',
            ['es-generalmente', 'es-jugaba'],
            { id: 'es.ex.jzg91sjgus4zpx' },
          ),
          question(
            'es.ex.a7swhfme6cr6xr',
            RECUERDO,
            'What does Valentina do every summer now?',
            'She goes back to the village',
            ['She goes to the beach', 'She visits Buenos Aires', 'She works at the school'],
            ['es-cada'],
            'She lives in Buenos Aires now, “pero cada verano vuelvo al pueblo”: every summer I go back to the village.',
          ),
          ex.translateWrite(
            'Every summer we went to the countryside.',
            'Cada verano íbamos al campo.',
            ['es-cada', 'es-el-campo'],
            {
              id: 'es.ex.ruarsnzm0a7qg1',
              acceptedAnswers: [
                'Cada verano, íbamos al campo.',
                'Todos los veranos íbamos al campo.',
                'Íbamos al campo cada verano.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué hacías los fines de semana?',
            'Say that you usually went to the beach (start with «Generalmente…»).',
            'Generalmente iba a la playa.',
            [
              'Generalmente, iba a la playa.',
              'Generalmente íbamos a la playa.',
              'Generalmente iba a la playa con mi familia.',
              'Generalmente íbamos a la playa con mi familia.',
            ],
            ['es-generalmente'],
            { id: 'es.ex.c5q6bqod25guq4' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Antes y ahora',
        objective: 'Compare the past with the present and talk about growing up.',
        intro: {
          explanation:
            'Antes (before, in the past) goes with the imperfect; ahora (now) goes with the present: antes vivía en el campo; ahora vivo en la ciudad. To say where you grew up, use the preterite of crecer: crecí en Mendoza (the whole period, seen as finished). Careful: un recuerdo is a memory (or a souvenir), and recordar means to remember, not to record.',
          examples: [
            {
              target: 'Antes vivía en el campo; ahora vivo en la ciudad.',
              base: 'I used to live in the countryside; now I live in the city.',
            },
            { target: 'Crecí en un pueblo chico.', base: 'I grew up in a small village.' },
          ],
        },
        takeaways: [
          'You contrast antes + imperfect with ahora + present.',
          'You say where you grew up with crecí en.',
        ],
        exercises: [
          ex.translationChoice('antes', 'before', ['now', 'then', 'always'], ['es-antes'], {
            id: 'es.ex.grdfgoix1t3g32',
          }),
          ex.orderWords(
            'Tengo muchos recuerdos de mi infancia.',
            'I have lots of memories of my childhood.',
            ['es-el-recuerdo', 'es-la-infancia'],
            { id: 'es.ex.5cxjouij6f4bsd' },
          ),
          ex.fillBlank(
            'Antes ___ en el campo; ahora vivo en la ciudad.',
            'I used to live in the countryside; now I live in the city.',
            'vivía',
            ['vivo', 'jugaba', 'había'],
            ['es-antes', 'es-vivia'],
            {
              id: 'es.ex.2ki0d4mmcrlct8',
              explanation:
                'Antes goes with the imperfect (vivía); ahora goes with the present (vivo).',
            },
          ),
          ex.listenChoice(
            'Antes jugaba al fútbol.',
            ['Ahora juego al fútbol.', 'Antes miraba el fútbol.', 'Antes jugaba con mi perro.'],
            ['es-antes', 'es-jugaba'],
            { id: 'es.ex.rngr2hh2fokru7' },
          ),
          question(
            'es.ex.x1kzhxuznfdnfz',
            ABUELO,
            'How did the grandfather get to school?',
            'On foot, with his brothers',
            ['By car', 'By bus', 'By bike, on his own'],
            ['es-la-infancia'],
            'He says “Iba a pie con mis hermanos”. They had no car: “no teníamos auto”.',
          ),
          question(
            'es.ex.lx8z2cbcik7u8a',
            ABUELO,
            'What did he play with?',
            'An old ball',
            ['Lots of toys', 'A radio', 'His dog'],
            ['es-jugaba', 'es-el-juguete'],
            'He had few toys (“Pocos”) and “Jugaba al fútbol con una pelota vieja”.',
          ),
          ex.matchPairs(
            [
              ['antes', 'before'],
              ['crecer', 'to grow up'],
              ['el recuerdo', 'the memory'],
              ['generalmente', 'usually'],
            ],
            ['es-antes', 'es-crecer', 'es-el-recuerdo', 'es-generalmente'],
            { id: 'es.ex.tsbqxb8f19vlon' },
          ),
          question(
            'es.ex.mxbl07tjnkcqi8',
            ABUELO,
            'What did his family do in the evenings?',
            'They listened to the radio',
            ['They watched TV', 'They played football', 'They went to the cinema'],
            ['es-habia', 'es-antes'],
            '“¡No había tele! De noche escuchábamos la radio.”',
          ),
          ex.translateWrite(
            'I grew up in a small village.',
            'Crecí en un pueblo chico.',
            ['es-crecer', 'es-el-pueblo'],
            { id: 'es.ex.93ilx14wkl5eq1', acceptedAnswers: ['Crecí en un pueblo pequeño.'] },
          ),
          ex.shortAnswer(
            '¿Dónde vivías antes?',
            'Say that you used to live in Córdoba and now you live in Rosario (use «antes» and «ahora»).',
            'Antes vivía en Córdoba; ahora vivo en Rosario.',
            [
              'Antes vivía en Córdoba, ahora vivo en Rosario.',
              'Antes vivía en Córdoba. Ahora vivo en Rosario.',
              'Antes vivía en Córdoba y ahora vivo en Rosario.',
              'Antes vivía en Córdoba, pero ahora vivo en Rosario.',
            ],
            ['es-antes', 'es-vivia'],
            { id: 'es.ex.agoxiu3rr1e8rj' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Mis recuerdos',
        objective: 'Understand and tell short memories of your childhood.',
        intro: {
          explanation:
            'A childhood memory usually mixes the imperfect for the scene and the habits (vivía, había, jugábamos) with a time expression (cuando era chica, cada verano). Listen to the stress: había, tenía and vivía have three syllables because the accent on í separates it from the a (ha-bí-a), while in familia the i and the a are said together. With ellos the imperfect ends in -aban or -ían: mis abuelos vivían en el campo.',
          examples: [
            {
              target: 'Cuando era chica, había un cine cerca de mi casa.',
              base: 'When I was little, there was a cinema near my house.',
            },
            {
              target: 'Mis abuelos vivían en el campo.',
              base: 'My grandparents lived in the countryside.',
            },
          ],
        },
        takeaways: [
          'You understand a short story about someone’s childhood.',
          'You tell a memory with cuando era chico and the imperfect.',
        ],
        exercises: [
          question(
            'es.ex.g4qnnawfjia21c',
            ANTES_AHORA,
            'Where did Lucía grow up?',
            'In Mendoza',
            ['In Rosario', 'In the countryside', 'In Buenos Aires'],
            ['es-crecer'],
            'Lucía says “No, crecí en Mendoza”: she grew up in Mendoza, in a small apartment.',
          ),
          question(
            'es.ex.s98j0ebtrjwlgl',
            ANTES_AHORA,
            'What did Lucía’s family usually do at the weekend?',
            'They went to the mountains',
            ['They watched TV all day', 'They went to the beach', 'They stayed at home'],
            ['es-generalmente'],
            '“Generalmente íbamos a la montaña. ¡Me encantaba!” Martín is the one who watched TV.',
          ),
          ex.listenChoice(
            'Había un cine.',
            ['Hay un cine.', 'Había un banco.', 'Había dos cines.'],
            ['es-habia'],
            { id: 'es.ex.rflb76nrl5qlz4' },
          ),
          ex.fillBlank(
            'Mis abuelos ___ en el campo.',
            'My grandparents lived in the countryside.',
            'vivían',
            ['vivía', 'vivo', 'vivíamos'],
            ['es-vivia', 'es-el-campo'],
            {
              id: 'es.ex.pph8mkhiibb8a6',
              explanation:
                'With ellos (mis abuelos) the imperfect ends in -ían: vivían. Vivía is for yo or él / ella; vivíamos is for nosotros.',
            },
          ),
          ex.fillBlank(
            'De chicos, mi hermano y yo ___ en la calle.',
            'As kids, my brother and I used to play in the street.',
            'jugábamos',
            ['jugaba', 'jugaban', 'juego'],
            ['es-jugaba', 'es-de-chico'],
            {
              id: 'es.ex.ac1166d7jv3s4f',
              explanation:
                'Mi hermano y yo = nosotros, so the verb ends in -ábamos: jugábamos (with an accent).',
            },
          ),
          ex.matchPairs(
            [
              ['era', 'I was (back then)'],
              ['cada', 'each'],
              ['el juguete', 'the toy'],
              ['cuando era chico', 'when I was little'],
            ],
            ['es-era', 'es-cada', 'es-el-juguete', 'es-cuando-era-chico'],
            { id: 'es.ex.ixe0tjp376p2n0' },
          ),
          ex.listenChoice(
            'Cada verano iba al campo.',
            [
              'Cada verano voy al campo.',
              'Cada invierno iba al campo.',
              'Cada verano iba al pueblo.',
            ],
            ['es-cada', 'es-el-campo'],
            { id: 'es.ex.gne31fixidjouy' },
          ),
          ex.translationChoice(
            'el recuerdo',
            'the memory',
            ['the record', 'the toy', 'the village'],
            ['es-el-recuerdo'],
            { id: 'es.ex.12ztkf9h4eku4p' },
          ),
          ex.translateWrite(
            'When I was little, my family had a house in the countryside.',
            'Cuando era chico, mi familia tenía una casa en el campo.',
            ['es-cuando-era-chico', 'es-tenia', 'es-el-campo'],
            {
              id: 'es.ex.orgmxtiffyf5nq',
              acceptedAnswers: [
                'Cuando era chica, mi familia tenía una casa en el campo.',
                'Cuando era chico mi familia tenía una casa en el campo.',
                'Cuando era chica mi familia tenía una casa en el campo.',
                'De chico, mi familia tenía una casa en el campo.',
                'De chica, mi familia tenía una casa en el campo.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Cómo eras de chico?',
            'Describe yourself as a child: say you were very shy (start with «De chico, era…» or «De chica, era…»).',
            'De chico, era muy tímido.',
            [
              'De chica, era muy tímida.',
              'De chico era muy tímido.',
              'De chica era muy tímida.',
              'Era muy tímido.',
              'Era muy tímida.',
              'Cuando era chico, era muy tímido.',
              'Cuando era chica, era muy tímida.',
            ],
            ['es-era', 'es-de-chico'],
            { id: 'es.ex.of9tn57b48wp25' },
          ),
        ],
      },
    ],
  },
};
