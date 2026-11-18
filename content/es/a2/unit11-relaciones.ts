import type { EsUnitDef } from '../../es-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Español A2 U11 «Relationships and experiences» (docs/ES_A1_A2.md): contar cómo se conoció una
 * pareja y cómo se llevan las personas, con verbos reflexivos y recíprocos en pasado (me desperté, nos
 * conocimos, se casaron, se pelean, llevarse bien); la negación doble (no… nunca, no… nada, no…
 * nadie; nunca / nadie delante del verbo sin no), ya no y casi nunca; y el pretérito perfecto (he
 * estado, ha sido, ¿alguna vez has estado…?) para experiencias, explicado como poco frecuente en la
 * Argentina, donde el pasado de todos los días es el indefinido (¿alguna vez fuiste…?).
 * Pronunciación: la h muda de he, has, ha.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const PADRES = dialogue(
  'es.stim.a2-u11-padres',
  'Two friends, Sofía and Tomás, talk about their parents.',
  [
    ['Sofía', 'Tomás, ¿cómo se conocieron tus padres?'],
    ['Tomás', 'Se conocieron en la facultad, hace treinta años. Estudiaban juntos.'],
    ['Sofía', '¡Qué lindo! ¿Y se casaron después de la facultad?'],
    ['Tomás', 'Sí, en el verano. Casi nunca se pelean y se llevan muy bien.'],
    ['Sofía', 'Mis padres ya no están juntos, pero se llevan bien.'],
    ['Tomás', '¡Qué bien!'],
  ],
);

const VIAJE = reading(
  'es.stim.a2-u11-viaje',
  'post',
  'Camila writes a post about her year on a social network.',
  [
    'Este año ha sido increíble.',
    'En marzo me desperté un día y pensé: «Nunca he estado en el extranjero».',
    'Entonces compré un pasaje a Lima.',
    'No conocía a nadie, pero no tuve miedo.',
    'Allá conocí a Mateo, un chico de Rosario. Ahora somos novios y viajamos juntos.',
    '¿Y vos? ¿Alguna vez viajaste solo?',
  ],
  { from: 'Camila' },
);

export const ES_A2_U11: EsUnitDef = {
  names: [
    'Sofía',
    'Tomás',
    'Camila',
    'Mateo',
    'Lima',
    'Rosario',
    'Córdoba',
    'Mendoza',
    'Bariloche',
    'Buenos Aires',
    'Lucía',
    'Ana',
    'Martín',
    'Diego',
  ],
  support: [
    'conocieron',
    'conocí',
    'conocía',
    'estudiaban',
    'casaron',
    'casamos',
    'pelean',
    'peleamos',
    'pelearon',
    'llevan',
    'llevamos',
    'llevás',
    'increíble',
    'pensé',
    'allá',
    'viajamos',
    'viajaste',
    'solo',
    'has',
  ],
  unit: {
    position: 11,
    title: 'Relationships and experiences',
    titleEn: 'Relaciones y experiencias',
    description:
      'Tell how people met and get along with reflexive verbs in the past, use double negatives (no… nunca, nada, nadie) and talk about experiences with alguna vez and he estado.',
    emoji: '💞',
    objective:
      'You can tell how a couple met and how people get along, say what never or no longer happens, and ask and answer about life experiences.',
    grammar: {
      title: 'Reflexive verbs in the past · double negation · he estado',
      explanation:
        'Reflexive verbs carry a pronoun that matches the subject: me desperté (I woke up), te despertaste (vos), se despertó, nos conocimos, se casaron. With a plural subject, nos and se often mean “each other”: nos conocimos (we met), se pelean (they argue), se llevan bien (they get along). Negation in Spanish is double, and the two negatives do not cancel each other: no + verb + nada, nadie or nunca (no tengo nada, no vino nadie). If nunca or nadie goes before the verb, there is no no: nunca vino nadie. Ya no means no longer. The present perfect is he, has, ha + a participle (estado, sido): he estado, ha sido. In Spain it is very common; in Argentina people prefer the simple past even for experiences (¿alguna vez fuiste a Bariloche?), but you will hear the perfect and should recognise it. The h is silent: he, has and ha sound just like e, as and a.',
      examples: [
        {
          target: 'Nos conocimos en la facultad y nos casamos en el verano.',
          base: 'We met at college and got married in the summer.',
        },
        { target: 'No vino nadie a la fiesta.', base: 'Nobody came to the party.' },
        {
          target: '¿Alguna vez has estado en Mendoza? — No, nunca.',
          base: 'Have you ever been to Mendoza? — No, never.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U11). Sin revisión nativa: revisar el lugar del pretérito perfecto en la Argentina (se presenta como poco frecuente y se prefiere «¿alguna vez fuiste…?»), «ya no vivo» frente a «no vivo más» (muy rioplatense, se acepta en las respuestas), «la pareja» para un hombre y «el novio / la novia» (también prometido/a). El estímulo usa «vino» (de venir), que el validador sólo reconoce por coincidir con «el vino».',
    },
    words: [
      w(
        'es-me-desperte',
        'me desperté',
        'I woke up',
        'Hoy me desperté muy tarde.',
        'Today I woke up very late.',
        ['past', 'reflexive'],
        { emoji: '⏰' },
      ),
      w(
        'es-nos-conocimos',
        'nos conocimos',
        'we met',
        'Nos conocimos en la facultad.',
        'We met at college.',
        ['past', 'reflexive'],
      ),
      w(
        'es-casarse',
        'casarse',
        'to get married',
        'Mi hermana va a casarse en diciembre.',
        'My sister is going to get married in December.',
        ['relationships'],
        { emoji: '💍' },
      ),
      w(
        'es-pelearse',
        'pelearse',
        'to argue',
        'Mis hermanos se pelean todos los días.',
        'My siblings argue every day.',
        ['relationships'],
        { acceptedTranslations: ['to fight'] },
      ),
      w(
        'es-llevarse-bien',
        'llevarse bien',
        'to get along',
        'Me llevo muy bien con mi hermana.',
        'I get along very well with my sister.',
        ['relationships'],
        { acceptedTranslations: ['to get on well'] },
      ),
      w(
        'es-el-novio',
        'el novio',
        'the boyfriend',
        'Mi novio se llama Diego.',
        'My boyfriend’s name is Diego.',
        ['relationships'],
        { acceptedTexts: ['la novia'], acceptedTranslations: ['the girlfriend'] },
      ),
      w(
        'es-la-pareja',
        'la pareja',
        'the partner',
        'Mi pareja es de Córdoba.',
        'My partner is from Córdoba.',
        ['relationships'],
        { acceptedTranslations: ['the couple'], emoji: '💑' },
      ),
      w(
        'es-juntos',
        'juntos',
        'together',
        'Vamos juntos a la fiesta.',
        'We’re going to the party together.',
        ['relationships'],
        { acceptedTexts: ['juntas'] },
      ),
      w(
        'es-nunca',
        'nunca',
        'never',
        'Nunca tomo café de noche.',
        'I never drink coffee at night.',
        ['negation'],
      ),
      w(
        'es-ya-no',
        'ya no',
        'no longer',
        'Ya no vivo en Rosario.',
        'I no longer live in Rosario.',
        ['negation'],
        { acceptedTranslations: ['not anymore'] },
      ),
      w(
        'es-nada',
        'nada',
        'nothing',
        'No hay nada en la mesa.',
        'There’s nothing on the table.',
        ['negation'],
        { acceptedTranslations: ['anything'] },
      ),
      w(
        'es-nadie',
        'nadie',
        'nobody',
        'No vino nadie a la fiesta.',
        'Nobody came to the party.',
        ['negation'],
        { acceptedTranslations: ['no one'] },
      ),
      w('es-algo', 'algo', 'something', '¿Querés tomar algo?', 'Do you want something to drink?', [
        'pronouns',
      ]),
      w(
        'es-casi-nunca',
        'casi nunca',
        'hardly ever',
        'Casi nunca como carne.',
        'I hardly ever eat meat.',
        ['frequency'],
        { acceptedTranslations: ['almost never'] },
      ),
      w(
        'es-he-estado',
        'he estado',
        'I have been',
        'Nunca he estado en Mendoza.',
        'I have never been to Mendoza.',
        ['perfect'],
        { acceptedTranslations: ["I've been"] },
      ),
      w(
        'es-alguna-vez',
        'alguna vez',
        'ever',
        '¿Alguna vez fuiste a Bariloche?',
        'Have you ever been to Bariloche?',
        ['perfect'],
      ),
      w(
        'es-ha-sido',
        'ha sido',
        'it has been',
        'Ha sido un día largo.',
        'It’s been a long day.',
        ['perfect'],
        { acceptedTranslations: ["it's been"] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Me desperté, nos conocimos',
        objective: 'Say when you woke up and tell how you met someone.',
        intro: {
          explanation:
            'Reflexive verbs carry a pronoun that matches the subject: me desperté (I woke up), te despertaste (you woke up, vos), se despertó (he or she woke up). With nos, the action is often mutual: nos conocimos (we met, literally “we got to know each other”). In the past, conocer is the verb for meeting someone for the first time. El novio and la novia are boyfriend and girlfriend; la pareja (partner, or couple) is always feminine, even when it is a man.',
          examples: [
            { target: 'Hoy me desperté muy tarde.', base: 'Today I woke up very late.' },
            {
              target: 'Mi novio y yo nos conocimos en un viaje.',
              base: 'My boyfriend and I met on a trip.',
            },
          ],
        },
        takeaways: [
          'You use me desperté and nos conocimos to tell a story in the past.',
          'You talk about your novio, novia or pareja.',
        ],
        exercises: [
          ex.translationChoice(
            'me desperté',
            'I woke up',
            ['I went to bed', 'I got up', 'we met'],
            ['es-me-desperte'],
            { id: 'es.ex.qeowxvuy9p8mds' },
          ),
          ex.translationChoice(
            'la pareja',
            'the partner',
            ['the boyfriend', 'the family', 'the neighbor'],
            ['es-la-pareja'],
            { id: 'es.ex.naxjyi4hc910yh' },
          ),
          ex.fillBlank(
            'Ayer ___ desperté a las seis.',
            'Yesterday I woke up at six.',
            'me',
            ['te', 'se', 'nos'],
            ['es-me-desperte'],
            {
              id: 'es.ex.tm9m30v4x64ku5',
              skill: 'grammar',
              explanation:
                'The pronoun matches the subject: yo → me desperté. Te is for vos, se for él or ella, nos for nosotros.',
            },
          ),
          ex.listenChoice(
            'Nos conocimos en Córdoba.',
            ['Nos conocimos en Rosario.', 'Se conocieron en Córdoba.', 'Me desperté en Córdoba.'],
            ['es-nos-conocimos'],
            { id: 'es.ex.7qox679eikxhdo' },
          ),
          ex.fillBlank(
            'Mi novio y yo nos ___ en la facultad.',
            'My boyfriend and I met at college.',
            'conocimos',
            ['conocieron', 'conocí', 'conocía'],
            ['es-nos-conocimos', 'es-el-novio'],
            {
              id: 'es.ex.gvhcpberbur3fa',
              explanation:
                'Mi novio y yo = nosotros, so nos conocimos. Se conocieron is “they met”; conocí is “I met”.',
            },
          ),
          ex.matchPairs(
            [
              ['me desperté', 'I woke up'],
              ['nos conocimos', 'we met'],
              ['el novio', 'the boyfriend'],
              ['la pareja', 'the partner'],
            ],
            ['es-me-desperte', 'es-nos-conocimos', 'es-el-novio', 'es-la-pareja'],
            { id: 'es.ex.z4wjt2euzz8vur' },
          ),
          ex.fillBlank(
            'Mi ___ se llama Martín. Es de Mendoza.',
            'My partner’s name is Martín. He’s from Mendoza.',
            'pareja',
            ['esposa', 'hermana', 'mamá'],
            ['es-la-pareja'],
            {
              id: 'es.ex.4z0irdb76gtqii',
              skill: 'vocabulary',
              explanation:
                'Martín is a man, so esposa, hermana and mamá don’t fit. La pareja is always feminine, even for a man.',
            },
          ),
          ex.orderWords('Nos conocimos en un viaje.', 'We met on a trip.', ['es-nos-conocimos'], {
            id: 'es.ex.ym61xiktbzuya7',
          }),
          ex.translateWrite(
            'Today I woke up at seven.',
            'Hoy me desperté a las siete.',
            ['es-me-desperte'],
            { id: 'es.ex.hzjoy8ydef1g16', acceptedAnswers: ['Me desperté a las siete hoy.'] },
          ),
          ex.translateWrite(
            'My girlfriend and I met in Buenos Aires.',
            'Mi novia y yo nos conocimos en Buenos Aires.',
            ['es-el-novio', 'es-nos-conocimos'],
            {
              id: 'es.ex.xet6dig71oew3o',
              acceptedAnswers: ['Mi novia y yo nos conocimos en Buenos Aires'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Casarse, pelearse, llevarse bien',
        objective: 'Say who got married, who argues and who gets along.',
        intro: {
          explanation:
            'Some verbs come with -se in the infinitive: casarse (to get married), pelearse (to argue), llevarse bien (to get along). The se changes with the person: nos casamos, se casaron (they got married), se pelean, me llevo bien con mi hermana. Note the preposition: llevarse bien con alguien, casarse con alguien. Juntos (together) agrees like an adjective: juntas for women. In Argentina a wedding is usually called el casamiento.',
          examples: [
            {
              target: 'Mis padres se casaron en el verano.',
              base: 'My parents got married in the summer.',
            },
            {
              target: 'Me llevo muy bien con mi hermana.',
              base: 'I get along very well with my sister.',
            },
          ],
        },
        takeaways: [
          'You use casarse, pelearse and llevarse bien with the right pronoun.',
          'You say together with juntos or juntas.',
        ],
        exercises: [
          ex.translationChoice(
            'casarse',
            'to get married',
            ['to argue', 'to get along', 'to wake up'],
            ['es-casarse'],
            { id: 'es.ex.rasbyyylerfolk' },
          ),
          ex.translationChoice(
            'pelearse',
            'to argue',
            ['to get married', 'to get along', 'to travel'],
            ['es-pelearse'],
            { id: 'es.ex.62lo5v9ytn7rvt' },
          ),
          ex.matchPairs(
            [
              ['casarse', 'to get married'],
              ['pelearse', 'to argue'],
              ['llevarse bien', 'to get along'],
              ['juntos', 'together'],
            ],
            ['es-casarse', 'es-pelearse', 'es-llevarse-bien', 'es-juntos'],
            { id: 'es.ex.mv7tsq4mjm9c1m' },
          ),
          ex.fillBlank(
            'Mis padres se ___ en el verano.',
            'My parents got married in the summer.',
            'casaron',
            ['casamos', 'casarse', 'pelean'],
            ['es-casarse'],
            {
              id: 'es.ex.rcamrc5osicz0s',
              explanation:
                'Mis padres = ellos, in the past: se casaron. Nos casamos is “we got married”.',
            },
          ),
          ex.listenChoice(
            'Se llevan muy bien.',
            ['Nos llevamos muy bien.', 'Se pelean mucho.', 'Me llevo muy bien.'],
            ['es-llevarse-bien'],
            { id: 'es.ex.bot5eet2urra72' },
          ),
          ex.fillBlank(
            'Me llevo bien ___ mi hermano.',
            'I get along well with my brother.',
            'con',
            ['de', 'a', 'en'],
            ['es-llevarse-bien'],
            {
              id: 'es.ex.k8dd66b158vm39',
              skill: 'grammar',
              explanation: 'Llevarse bien con alguien: to get along with someone.',
            },
          ),
          ex.fillBlank(
            'Lucía y Ana siempre van ___ al cine.',
            'Lucía and Ana always go to the cinema together.',
            'juntas',
            ['juntos', 'con', 'mucho'],
            ['es-juntos'],
            {
              id: 'es.ex.99mnk9k6s2oozi',
              skill: 'grammar',
              explanation:
                'Juntos agrees with the people: two women → juntas. Juntos is for men or a mixed group.',
            },
          ),
          ex.orderWords(
            'Mis padres se casaron en Córdoba.',
            'My parents got married in Córdoba.',
            ['es-casarse'],
            { id: 'es.ex.off6oa49eeadzl' },
          ),
          ex.translateWrite(
            'My brothers argue a lot.',
            'Mis hermanos se pelean mucho.',
            ['es-pelearse'],
            { id: 'es.ex.fm8gascf52tiz8' },
          ),
          ex.shortAnswer(
            '¿Te llevás bien con tu familia?',
            'Answer yes (start with «Sí, me llevo…»).',
            'Sí, me llevo bien con mi familia.',
            [
              'Sí, me llevo bien.',
              'Sí, me llevo muy bien con mi familia.',
              'Sí, me llevo muy bien.',
              'Sí, me llevo bien con mi familia',
            ],
            ['es-llevarse-bien'],
            { id: 'es.ex.9murj2wu2al10x' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Nunca, nada, nadie',
        objective: 'Say what never, no longer or hardly ever happens, with double negatives.',
        intro: {
          explanation:
            'In Spanish two negatives don’t cancel each other: no + verb + nada, nadie or nunca. No tengo nada (I don’t have anything), no vino nadie (nobody came). If nunca or nadie goes before the verb, you drop no: nunca tomo café. The opposites are algo (something) / nada, alguien (someone) / nadie, siempre / nunca. Ya no means no longer, and casi nunca means hardly ever. In Argentina you will also hear no… más: no vivo más en Rosario.',
          examples: [
            { target: 'No vino nadie a la fiesta.', base: 'Nobody came to the party.' },
            { target: 'Ya no vivo en Rosario.', base: 'I no longer live in Rosario.' },
          ],
        },
        takeaways: [
          'You make double negatives: no tengo nada, no vino nadie.',
          'You use nunca, casi nunca and ya no to talk about frequency and change.',
        ],
        exercises: [
          ex.translationChoice('nadie', 'nobody', ['nothing', 'never', 'someone'], ['es-nadie'], {
            id: 'es.ex.l03c1nbkjqz3gr',
          }),
          ex.translationChoice(
            'ya no',
            'no longer',
            ['not yet', 'always', 'hardly ever'],
            ['es-ya-no'],
            { id: 'es.ex.yq91vakjpw4aw3' },
          ),
          ex.matchPairs(
            [
              ['nunca', 'never'],
              ['nada', 'nothing'],
              ['algo', 'something'],
              ['casi nunca', 'hardly ever'],
            ],
            ['es-nunca', 'es-nada', 'es-algo', 'es-casi-nunca'],
            { id: 'es.ex.ywbp0eemrtn3qg' },
          ),
          ex.fillBlank(
            'No tengo ___ en la mochila.',
            'I don’t have anything in my backpack.',
            'nada',
            ['algo', 'nadie', 'nunca'],
            ['es-nada', 'es-algo'],
            {
              id: 'es.ex.l4x8ppudbnzj1h',
              skill: 'grammar',
              explanation:
                'After no + verb, Spanish uses nada (not algo): no tengo nada. Nadie is for people.',
            },
          ),
          ex.fillBlank(
            '___ vino nadie a la fiesta.',
            'Nobody came to the party.',
            'No',
            ['Ya', 'Algo', 'Siempre'],
            ['es-nadie'],
            {
              id: 'es.ex.ce86yhxi488sew',
              skill: 'grammar',
              explanation:
                'When nadie comes after the verb, the sentence needs no in front: no vino nadie. Nadie vino is also correct.',
            },
          ),
          ex.listenChoice(
            'Casi nunca como carne.',
            ['Nunca como carne.', 'Siempre como carne.', 'Casi nunca como pescado.'],
            ['es-casi-nunca'],
            { id: 'es.ex.8598bq2j8pa8vf' },
          ),
          question(
            'es.ex.cdcrb9k6qf48jh',
            PADRES,
            'How do Tomás’s parents get along?',
            'Very well: they hardly ever argue',
            ['Badly: they argue every day', 'They no longer live together', 'Tomás doesn’t know'],
            ['es-casi-nunca', 'es-pelearse', 'es-llevarse-bien'],
            'Tomás says “Casi nunca se pelean y se llevan muy bien”.',
          ),
          question(
            'es.ex.dfwm8dzz5gbj68',
            PADRES,
            'What does Sofía say about her own parents?',
            'They are no longer together, but they get along',
            [
              'They got married at college',
              'They argue a lot',
              'They have been together for thirty years',
            ],
            ['es-ya-no', 'es-juntos'],
            'Sofía says “Mis padres ya no están juntos, pero se llevan bien”.',
          ),
          ex.translateWrite(
            'I no longer live in Rosario.',
            'Ya no vivo en Rosario.',
            ['es-ya-no'],
            {
              id: 'es.ex.r2x0oa7p8n961h',
              acceptedAnswers: ['No vivo más en Rosario.'],
            },
          ),
          ex.shortAnswer(
            '¿Querés algo?',
            'Say no, you don’t want anything (use «nada»).',
            'No, no quiero nada.',
            [
              'No quiero nada.',
              'No, gracias, no quiero nada.',
              'No, nada.',
              'No, gracias. No quiero nada.',
            ],
            ['es-nada', 'es-algo'],
            { id: 'es.ex.mvk7yrp655lzmz' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: '¿Alguna vez…?',
        objective: 'Ask and answer about life experiences, and recognise the present perfect.',
        intro: {
          explanation:
            'The present perfect is he, has or ha + a participle ending in -ado or -ido: he estado (I have been), ha sido (it has been). In Spain it is used all the time; in Argentina people usually prefer the simple past, even for experiences: ¿Alguna vez fuiste a Bariloche? (Have you ever been to Bariloche?). You will still hear and read the perfect, especially for experiences and for something that has just ended (ha sido un día largo). Alguna vez means ever. The h is silent: he, has and ha sound exactly like e, as and a.',
          examples: [
            {
              target: '¿Alguna vez fuiste a Bariloche? — No, nunca.',
              base: 'Have you ever been to Bariloche? — No, never.',
            },
            { target: 'Nunca he estado en Mendoza.', base: 'I have never been to Mendoza.' },
          ],
        },
        takeaways: [
          'You ask about experiences with ¿alguna vez…?',
          'You recognise he estado and ha sido and know that the h is silent.',
        ],
        exercises: [
          ex.translationChoice(
            'alguna vez',
            'ever',
            ['never', 'sometimes', 'always'],
            ['es-alguna-vez'],
            { id: 'es.ex.vxgxvq66tseg12' },
          ),
          ex.translationChoice(
            'he estado',
            'I have been',
            ['it has been', 'I am (right now)', 'I was (back then)'],
            ['es-he-estado'],
            { id: 'es.ex.ev9b7tcq4uj7jd' },
          ),
          ex.fillBlank(
            'Nunca ___ estado en el extranjero.',
            'I have never been abroad.',
            'he',
            ['ha', 'has', 'era'],
            ['es-he-estado', 'es-nunca'],
            {
              id: 'es.ex.f9l7tzlexs8x7y',
              skill: 'grammar',
              explanation:
                'For yo, the perfect uses he: he estado. Has is for vos, ha for él, ella or usted. The h is never pronounced.',
            },
          ),
          ex.listenChoice(
            'He estado en Mendoza.',
            ['Ha estado en Mendoza.', 'Has estado en Mendoza.', 'Estuve en Mendoza.'],
            ['es-he-estado'],
            { id: 'es.ex.2gdb1qqs4drsmq' },
          ),
          ex.fillBlank(
            'Este año ___ sido muy largo.',
            'This year has been very long.',
            'ha',
            ['he', 'has', 'es'],
            ['es-ha-sido'],
            {
              id: 'es.ex.0bihvi9yose4tc',
              skill: 'grammar',
              explanation: 'Este año is third person, so ha: ha sido (it has been).',
            },
          ),
          question(
            'es.ex.ytf90ghmfcbhas',
            VIAJE,
            'What had Camila never done before this year?',
            'Travel abroad',
            ['Buy a plane ticket', 'Have a boyfriend', 'Visit Rosario'],
            ['es-nunca', 'es-he-estado'],
            'In March she thought “Nunca he estado en el extranjero”: I have never been abroad.',
          ),
          question(
            'es.ex.kj3pfy8jkn0j9n',
            VIAJE,
            'Who did Camila know in Lima when she arrived?',
            'Nobody',
            ['Her boyfriend', 'A friend from Rosario', 'Her family'],
            ['es-nadie'],
            'She writes “No conocía a nadie”: she didn’t know anybody.',
          ),
          ex.matchPairs(
            [
              ['he estado', 'I have been'],
              ['ha sido', 'it has been'],
              ['alguna vez', 'ever'],
              ['nunca', 'never'],
            ],
            ['es-he-estado', 'es-ha-sido', 'es-alguna-vez', 'es-nunca'],
            { id: 'es.ex.fimedk4sdvldb4' },
          ),
          ex.translateWrite(
            'Have you ever been to Bariloche?',
            '¿Alguna vez fuiste a Bariloche?',
            ['es-alguna-vez'],
            {
              id: 'es.ex.s6c3iekoddxfug',
              acceptedAnswers: [
                '¿Fuiste alguna vez a Bariloche?',
                '¿Alguna vez has estado en Bariloche?',
                '¿Alguna vez estuviste en Bariloche?',
                '¿Has estado alguna vez en Bariloche?',
                '¿Alguna vez fue a Bariloche?',
              ],
            },
          ),
          ex.translateWrite('It’s been a long day.', 'Ha sido un día largo.', ['es-ha-sido'], {
            id: 'es.ex.u0kckacnk12ajn',
            acceptedAnswers: ['Fue un día largo.', 'Ha sido un día muy largo.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Historias de pareja',
        objective: 'Understand and tell a short story about a relationship.',
        intro: {
          explanation:
            'To tell a love story, Argentinians use the simple past for the events (nos conocimos, se casaron) and the present for how things are now (se llevan bien, ya no están juntos). Hace + time means ago: nos conocimos hace dos años. Nosotros forms of -ar verbs are the same in the present and the past (nos peleamos = we argue / we argued): the context tells you which.',
          examples: [
            {
              target: 'Nos conocimos hace dos años y ahora vivimos juntos.',
              base: 'We met two years ago and now we live together.',
            },
            { target: 'Nunca nos peleamos.', base: 'We never argue.' },
          ],
        },
        takeaways: [
          'You tell how a couple met, when they got married and how they get along.',
          'You understand a post about a first experience.',
        ],
        exercises: [
          question(
            'es.ex.cu1g9wmzm1oer0',
            PADRES,
            'Where did Tomás’s parents meet?',
            'At college',
            ['On a trip', 'At work', 'At a party'],
            ['es-nos-conocimos'],
            'Tomás says “Se conocieron en la facultad, hace treinta años”.',
          ),
          question(
            'es.ex.hacsm2hf2dqikn',
            PADRES,
            'When did they get married?',
            'In the summer, after college',
            ['Thirty years before college', 'In the winter', 'They never got married'],
            ['es-casarse'],
            'Sofía asks “¿Y se casaron después de la facultad?” and Tomás answers “Sí, en el verano”.',
          ),
          question(
            'es.ex.4cms9s5o28jkpk',
            VIAJE,
            'Who is Mateo now?',
            'Camila’s boyfriend',
            ['Camila’s husband', 'A friend from Lima', 'Camila’s brother'],
            ['es-el-novio', 'es-juntos'],
            'She writes “Ahora somos novios y viajamos juntos”.',
          ),
          question(
            'es.ex.lx7l23i7o8b20a',
            VIAJE,
            'How has this year been for Camila?',
            'Amazing',
            ['Very hard', 'Long and boring', 'Like every year'],
            ['es-ha-sido'],
            'Her post starts “Este año ha sido increíble”: this year has been amazing.',
          ),
          ex.listenChoice(
            'Nos peleamos ayer.',
            ['Nos llevamos bien.', 'Se pelearon ayer.', 'Nos casamos ayer.'],
            ['es-pelearse'],
            { id: 'es.ex.2txqt7auy627xd' },
          ),
          ex.fillBlank(
            'Nunca nos ___. Nos llevamos muy bien.',
            'We never argue. We get along very well.',
            'peleamos',
            ['casamos', 'pelean', 'conocimos'],
            ['es-pelearse', 'es-nunca', 'es-llevarse-bien'],
            {
              id: 'es.ex.czhtlu56ovfe12',
              explanation:
                'With nos the verb is in the nosotros form: nos peleamos (we argue). Pelean is for ellos.',
            },
          ),
          ex.orderWords(
            'Nunca he estado en Mendoza.',
            'I have never been to Mendoza.',
            ['es-nunca', 'es-he-estado'],
            { id: 'es.ex.4ddtddllm7plpq' },
          ),
          ex.translateWrite(
            'We met two years ago and now we live together.',
            'Nos conocimos hace dos años y ahora vivimos juntos.',
            ['es-nos-conocimos', 'es-juntos'],
            {
              id: 'es.ex.6ay6putmid1z6h',
              acceptedAnswers: [
                'Nos conocimos hace dos años y ahora vivimos juntas.',
                'Hace dos años nos conocimos y ahora vivimos juntos.',
                'Nos conocimos hace dos años, y ahora vivimos juntos.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Alguna vez fuiste a Bariloche?',
            'Answer no, never (use «nunca»).',
            'No, nunca fui a Bariloche.',
            [
              'No, nunca.',
              'No, nunca fui.',
              'No, nunca he estado en Bariloche.',
              'No, no fui nunca.',
              'No, nunca fui a Bariloche',
            ],
            ['es-nunca', 'es-alguna-vez'],
            { id: 'es.ex.1ad81ys8x6h0nf' },
          ),
        ],
      },
    ],
  },
};
