import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U8 «My day» (docs/ES_A1_A2.md): contar la rutina de todos los días con el presente de
 * los verbos regulares en -ar, -er, -ir en todas las personas (yo trabajo, vos trabajás, ella trabaja,
 * nosotros trabajamos, ustedes / ellos trabajan; en la Argentina no hay vosotros), los reflexivos más
 * frecuentes (me levanto, me acuesto, me ducho), las partes del día (a la mañana, a la tarde, a la
 * noche), las comidas, el orden (primero, después) y la frecuencia (siempre, a veces, todos los días).
 * Pronunciación: el acento del voseo en la última sílaba (trabajás, comés, vivís) lo distingue de yo y
 * de él (trabajo, trabaja). Cultura: en la Argentina se cena tarde.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const MANANA = dialogue(
  'es.stim.a1-u8-manana',
  'Two friends talk about when they work.',
  [
    ['Martín', '¿Vos trabajás a la mañana?'],
    ['Sofía', 'Sí, siempre trabajo a la mañana. ¿Y vos?'],
    ['Martín', 'Yo trabajo a la tarde. A la mañana miro series.'],
    ['Sofía', '¡Qué bien! ¿Y a la noche?'],
    ['Martín', 'A veces ceno con mis padres.'],
  ],
  ES_A1_RATE,
);

const MI_DIA = reading(
  'es.stim.a1-u8-mi-dia',
  'post',
  'Valentina writes a short post about her day.',
  [
    'Todos los días me levanto temprano.',
    'Primero tomo mate, después trabajo en casa.',
    'El almuerzo es con mi hermana.',
    'A la tarde escucho música.',
    'La cena es muy tarde y después me acuesto.',
  ],
  { title: 'Mi día', from: 'Valentina' },
);

export const ES_A1_U08: EsUnitDef = {
  names: [
    'Lucía',
    'Martín',
    'Sofía',
    'Valentina',
    'Diego',
    'Camila',
    'Palermo',
    'Córdoba',
    'Rosario',
    'Mendoza',
    'Buenos Aires',
  ],
  support: [
    'tele',
    'serie',
    'música',
    'película',
    'radio',
    'temprano',
    'ducho',
    'levantás',
    'acostás',
    'trabajás',
    'mirás',
    'escuchás',
    'trabajamos',
    'trabajan',
    'escuchamos',
    'escuchan',
    'come',
    'comemos',
    'comen',
    'vivimos',
    'hablan',
    'hablamos',
    'ceno',
    'hacés',
  ],
  unit: {
    position: 8,
    title: 'My day',
    titleEn: 'Mi día',
    description:
      'Talk about your daily routine: regular -ar, -er and -ir verbs in the present for every person, reflexive verbs like me levanto, parts of the day, meals, first and then, always and sometimes.',
    emoji: '⏰',
    objective:
      'You can describe your daily routine and other people’s: when you get up, work, eat and go to bed, in what order and how often.',
    grammar: {
      title: 'Present tense: -ar, -er, -ir · me levanto',
      explanation:
        'Regular verbs change their ending for each person. -ar (trabajar): trabajo, trabajás, trabaja, trabajamos, trabajan. -er (comer): como, comés, come, comemos, comen. -ir (vivir): vivo, vivís, vive, vivimos, viven. Vos stresses the last syllable and carries an accent (trabajás, comés, vivís): that stress is what tells it apart from yo trabajo and ella trabaja. Usted, él and ella share a form (trabaja), and so do ustedes and ellos (trabajan). In Argentina ustedes is the plural of both vos and usted; in Spain you will also hear vosotros, which is not used here. Some verbs come with me, te, se (reflexive): me levanto (I get up), te levantás, se levanta; me acuesto (I go to bed), te acostás, se acuesta. Spanish often drops the subject pronoun, because the ending already says who it is: trabajo = I work.',
      examples: [
        {
          target: 'Yo trabajo, vos trabajás y ella trabaja.',
          base: 'I work, you work and she works.',
        },
        {
          target: 'Nosotros vivimos en Rosario y ellos viven en Córdoba.',
          base: 'We live in Rosario and they live in Córdoba.',
        },
        {
          target: 'Primero me levanto, después me ducho.',
          base: 'First I get up, then I take a shower.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U8). Sin revisión nativa. Revisar: «a la mañana / a la tarde / a la noche» como forma rioplatense habitual (se acepta «por la…» en las respuestas); «tarde» también como adverbio (me acuesto tarde) sin enseñarlo como palabra; «desayuno» y «almuerzo» usados también como verbos (yo desayuno) a partir de los sustantivos; «miro la tele» como lo más natural en la Argentina; «café con leche» en el desayuno.',
    },
    words: [
      w(
        'es-la-manana',
        'la mañana',
        'the morning',
        'Tomo mate a la mañana.',
        'I drink mate in the morning.',
        ['time'],
        { emoji: '🌅' },
      ),
      w(
        'es-la-tarde',
        'la tarde',
        'the afternoon',
        'A la tarde trabajo en casa.',
        'In the afternoon I work at home.',
        ['time'],
      ),
      w(
        'es-la-noche',
        'la noche',
        'the night',
        'A la noche miro la tele.',
        'In the evening I watch TV.',
        ['time'],
        { acceptedTranslations: ['the evening'], emoji: '🌙' },
      ),
      w(
        'es-me-levanto',
        'me levanto',
        'I get up',
        'Me levanto y tomo un café.',
        'I get up and have a coffee.',
        ['verbs', 'reflexive'],
      ),
      w(
        'es-me-acuesto',
        'me acuesto',
        'I go to bed',
        'Me acuesto muy tarde.',
        'I go to bed very late.',
        ['verbs', 'reflexive'],
        { emoji: '🛏️' },
      ),
      w('es-trabajo', 'trabajo', 'I work', 'Trabajo en Palermo.', 'I work in Palermo.', ['verbs']),
      w(
        'es-miro',
        'miro',
        'I watch',
        'A veces miro una película.',
        'Sometimes I watch a movie.',
        ['verbs'],
        { acceptedTranslations: ['I look at'] },
      ),
      w(
        'es-escucho',
        'escucho',
        'I listen to',
        'Escucho música en la cocina.',
        'I listen to music in the kitchen.',
        ['verbs'],
        { acceptedTranslations: ['I listen'], emoji: '🎧' },
      ),
      w(
        'es-nosotros',
        'nosotros',
        'we',
        'Nosotros vivimos en Córdoba.',
        'We live in Córdoba.',
        ['pronouns'],
        { acceptedTexts: ['nosotras'] },
      ),
      w('es-ellos', 'ellos', 'they', 'Ellos hablan inglés.', 'They speak English.', ['pronouns'], {
        acceptedTexts: ['ellas'],
      }),
      w(
        'es-ustedes',
        'ustedes',
        'you all',
        '¿Ustedes viven en Rosario?',
        'Do you all live in Rosario?',
        ['pronouns'],
        { acceptedTranslations: ['you (plural)'] },
      ),
      w(
        'es-primero',
        'primero',
        'first',
        'Primero me levanto, después tomo mate.',
        'First I get up, then I drink mate.',
        ['sequence'],
      ),
      w(
        'es-despues',
        'después',
        'then',
        'Después del almuerzo trabajo.',
        'After lunch I work.',
        ['sequence'],
        { acceptedTranslations: ['after', 'afterwards'] },
      ),
      w(
        'es-todos-los-dias',
        'todos los días',
        'every day',
        'Tomo mate todos los días.',
        'I drink mate every day.',
        ['frequency'],
      ),
      w(
        'es-el-desayuno',
        'el desayuno',
        'breakfast',
        'El desayuno es café con leche y medialunas.',
        'Breakfast is coffee with milk and croissants.',
        ['meals'],
        { acceptedTranslations: ['the breakfast'], emoji: '☕' },
      ),
      w(
        'es-el-almuerzo',
        'el almuerzo',
        'lunch',
        'En el almuerzo como carne y verduras.',
        'For lunch I eat meat and vegetables.',
        ['meals'],
        { acceptedTranslations: ['the lunch'] },
      ),
      w(
        'es-la-cena',
        'la cena',
        'dinner',
        'En la Argentina la cena es muy tarde.',
        'In Argentina dinner is very late.',
        ['meals', 'culture'],
        { acceptedTranslations: ['the dinner', 'supper'], emoji: '🍽️' },
      ),
      w(
        'es-siempre',
        'siempre',
        'always',
        'Siempre desayuno en casa.',
        'I always have breakfast at home.',
        ['frequency'],
      ),
      w(
        'es-a-veces',
        'a veces',
        'sometimes',
        'A veces escucho la radio.',
        'Sometimes I listen to the radio.',
        ['frequency'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'La mañana, la tarde, la noche',
        objective: 'Talk about the parts of the day and the meals.',
        intro: {
          explanation:
            'La mañana is the morning, la tarde the afternoon and la noche the evening or night. To say “in the morning”, people in Argentina usually say a la mañana (a la tarde, a la noche); you will also hear por la mañana. The meals: el desayuno (breakfast), el almuerzo (lunch) and la cena (dinner). Dinner in Argentina is late, often after nine in the evening. Careful: la mañana is the morning, but mañana on its own means tomorrow. The ñ sounds like the ny in canyon.',
          examples: [
            { target: 'Tomo mate a la mañana.', base: 'I drink mate in the morning.' },
            { target: 'La cena es a la noche.', base: 'Dinner is in the evening.' },
          ],
        },
        takeaways: [
          'You say when you do something with a la mañana, a la tarde and a la noche.',
          'You name the meals: el desayuno, el almuerzo and la cena.',
        ],
        exercises: [
          ex.translationChoice(
            'la mañana',
            'the morning',
            ['the afternoon', 'the night', 'lunch'],
            ['es-la-manana'],
            { id: 'es.ex.ip96ym3gglcasr' },
          ),
          ex.matchPairs(
            [
              ['la mañana', 'the morning'],
              ['la tarde', 'the afternoon'],
              ['la noche', 'the night'],
              ['la cena', 'dinner'],
            ],
            ['es-la-manana', 'es-la-tarde', 'es-la-noche', 'es-la-cena'],
            { id: 'es.ex.lewy135ttyy819' },
          ),
          ex.listenChoice(
            'Tomo mate a la mañana.',
            ['Tomo mate a la tarde.', 'Tomo mate a la noche.', 'Tomo café a la mañana.'],
            ['es-la-manana', 'es-la-tarde', 'es-la-noche'],
            { id: 'es.ex.gg7inmmbfoli73' },
          ),
          ex.translationChoice(
            'el desayuno',
            'breakfast',
            ['lunch', 'dinner', 'the morning'],
            ['es-el-desayuno'],
            { id: 'es.ex.6e80bxtbac2tsw' },
          ),
          ex.fillBlank(
            'El ___ es a la mañana.',
            'Breakfast is in the morning.',
            'desayuno',
            ['almuerzo', 'vino', 'pan'],
            ['es-el-desayuno', 'es-la-manana'],
            {
              id: 'es.ex.o8tj5sctdmsdtm',
              skill: 'vocabulary',
              explanation:
                'El desayuno is breakfast, the morning meal. El almuerzo is lunch, at midday.',
            },
          ),
          ex.translationChoice(
            'el almuerzo',
            'lunch',
            ['breakfast', 'dinner', 'the afternoon'],
            ['es-el-almuerzo'],
            { id: 'es.ex.907fjok9ucac04' },
          ),
          ex.fillBlank(
            'La ___ es a la noche.',
            'Dinner is in the evening.',
            'cena',
            ['mañana', 'tarde', 'leche'],
            ['es-la-cena', 'es-la-noche'],
            {
              id: 'es.ex.f953gkjyg5j18v',
              skill: 'vocabulary',
              explanation:
                'La cena is dinner. In Argentina it is late: many people have dinner after nine.',
            },
          ),
          ex.listenChoice(
            'En el almuerzo como carne.',
            ['En el desayuno como carne.', 'En la cena como carne.', 'En el almuerzo como queso.'],
            ['es-el-almuerzo', 'es-el-desayuno', 'es-la-cena'],
            { id: 'es.ex.fokl5l8ty9xjbz' },
          ),
          ex.translateWrite(
            'Sometimes I drink mate in the afternoon.',
            'A veces tomo mate a la tarde.',
            ['es-a-veces', 'es-la-tarde'],
            {
              id: 'es.ex.d00ybqyv7zisdj',
              acceptedAnswers: [
                'A la tarde a veces tomo mate.',
                'A veces tomo mate por la tarde.',
                'A veces, tomo mate a la tarde.',
                'A la tarde, a veces tomo mate.',
              ],
            },
          ),
          ex.translateWrite(
            'Dinner is in the evening.',
            'La cena es a la noche.',
            ['es-la-cena', 'es-la-noche'],
            {
              id: 'es.ex.q6qlk9dzmkv0rt',
              acceptedAnswers: ['La cena es por la noche.', 'La cena es de noche.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Me levanto, me acuesto',
        objective: 'Say when you get up and go to bed, and in what order you do things.',
        intro: {
          explanation:
            'Some verbs come with me, te or se: they are reflexive, a bit like “get yourself up”. Me levanto is I get up and me acuesto is I go to bed; me ducho is I take a shower. With vos: te levantás, te acostás (no ue, because the stress moves to the end). With él, ella or usted: se levanta, se acuesta. To put things in order: primero (first) and después (then, afterwards). Two handy extras: tarde also means late (me acuesto tarde), and desayuno also means I have breakfast.',
          examples: [
            {
              target: 'Primero me levanto, después me ducho.',
              base: 'First I get up, then I take a shower.',
            },
            { target: 'Me acuesto muy tarde.', base: 'I go to bed very late.' },
          ],
        },
        takeaways: [
          'You use me levanto and me acuesto, and te levantás, te acostás with vos.',
          'You order your day with primero and después.',
        ],
        exercises: [
          ex.translationChoice(
            'me levanto',
            'I get up',
            ['I go to bed', 'my name is', 'I drink'],
            ['es-me-levanto'],
            { id: 'es.ex.s9b6nj233hpt7p' },
          ),
          ex.translationChoice(
            'me acuesto',
            'I go to bed',
            ['I get up', 'I eat', 'then'],
            ['es-me-acuesto'],
            { id: 'es.ex.l67t4apzn9n8j7' },
          ),
          ex.fillBlank(
            'Primero me ___, después tomo mate.',
            'First I get up, then I drink mate.',
            'levanto',
            ['acuesto', 'llamo', 'tomo'],
            ['es-primero', 'es-despues', 'es-me-levanto'],
            {
              id: 'es.ex.tpexktq0qciw8k',
              skill: 'vocabulary',
              explanation:
                'Me levanto is I get up. Me acuesto would be I go to bed, which does not come before mate in the morning.',
            },
          ),
          ex.listenChoice(
            'Me levanto y me ducho.',
            ['Me acuesto y me ducho.', 'Me levanto y tomo mate.', 'Me acuesto muy tarde.'],
            ['es-me-levanto', 'es-me-acuesto'],
            { id: 'es.ex.f4ziuu6brxpdyt' },
          ),
          ex.matchPairs(
            [
              ['me levanto', 'I get up'],
              ['me acuesto', 'I go to bed'],
              ['primero', 'first'],
              ['después', 'then'],
            ],
            ['es-me-levanto', 'es-me-acuesto', 'es-primero', 'es-despues'],
            { id: 'es.ex.nkhye46vzedo5a' },
          ),
          ex.fillBlank(
            'Vos te ___ muy tarde.',
            'You go to bed very late.',
            'acostás',
            ['acuesto', 'acuesta', 'levanto'],
            ['es-me-acuesto'],
            {
              id: 'es.ex.3ohjkw0w10veh0',
              explanation:
                'With vos: te acostás, stressed on the last syllable and without ue. Yo me acuesto, ella se acuesta.',
            },
          ),
          ex.fillBlank(
            'Martín ___ levanta y después toma mate.',
            'Martín gets up and then drinks mate.',
            'se',
            ['me', 'te', 'mi'],
            ['es-me-levanto', 'es-despues'],
            {
              id: 'es.ex.nqzydci1a5aiat',
              explanation:
                'With él, ella or usted the reflexive word is se: se levanta. Me is for yo and te for vos.',
            },
          ),
          ex.orderWords(
            'Primero me levanto y después me ducho.',
            'First I get up and then I take a shower.',
            ['es-primero', 'es-despues', 'es-me-levanto'],
            { id: 'es.ex.r203ryjks64j7b' },
          ),
          ex.shortAnswer(
            '¿Te levantás tarde?',
            'Answer that yes, you get up late (start with «Sí, me levanto»).',
            'Sí, me levanto tarde.',
            ['Sí, me levanto tarde', 'Sí, yo me levanto tarde.', 'Sí, me levanto muy tarde.'],
            ['es-me-levanto'],
            { id: 'es.ex.c3qxi6mnt7iijv' },
          ),
          ex.translateWrite(
            'First I get up, then I have breakfast.',
            'Primero me levanto, después desayuno.',
            ['es-primero', 'es-despues', 'es-me-levanto'],
            {
              id: 'es.ex.83tvuokds08bbw',
              acceptedAnswers: [
                'Primero me levanto y después desayuno.',
                'Primero me levanto. Después desayuno.',
                'Primero me levanto, y después desayuno.',
                'Primero me levanto, luego desayuno.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Trabajo, miro, escucho',
        objective: 'Say what you and others do, with yo, vos and él or ella, and how often.',
        intro: {
          explanation:
            'Verbs ending in -ar (trabajar, mirar, escuchar) change their ending for each person: yo trabajo, vos trabajás, él, ella or usted trabaja. With vos the stress falls on the last syllable and it has an accent: trabajás, mirás, escuchás. Listen for it: tra-BA-jo is I, tra-ba-JÁS is you. Mirar means to watch or look at and escuchar to listen to, with no extra word for “at” or “to”: miro la tele, escucho música. Siempre (always) and a veces (sometimes) usually go before the verb.',
          examples: [
            { target: 'Siempre escucho música.', base: 'I always listen to music.' },
            { target: '¿Vos trabajás en Palermo?', base: 'Do you work in Palermo?' },
          ],
        },
        takeaways: [
          'You conjugate -ar verbs for yo, vos and él or ella: trabajo, trabajás, trabaja.',
          'You say how often with siempre and a veces.',
        ],
        exercises: [
          ex.translationChoice(
            'trabajo',
            'I work',
            ['I watch', 'I listen to', 'I get up'],
            ['es-trabajo'],
            { id: 'es.ex.4y826uyfeb2pho' },
          ),
          ex.listenChoice(
            'Vos trabajás en Palermo.',
            ['Yo trabajo en Palermo.', 'Ella trabaja en Palermo.'],
            ['es-trabajo'],
            { id: 'es.ex.tbuwqc5btbvc7u' },
          ),
          ex.fillBlank(
            'Vos ___ música a la noche.',
            'You listen to music in the evening.',
            'escuchás',
            ['escucho', 'escucha', 'mirás'],
            ['es-escucho', 'es-la-noche'],
            {
              id: 'es.ex.q2vh6b1nmygrbe',
              explanation:
                'With vos the ending is -ás, stressed: escuchás. Escucho is for yo and escucha for él or ella.',
            },
          ),
          ex.matchPairs(
            [
              ['trabajo', 'I work'],
              ['miro', 'I watch'],
              ['escucho', 'I listen to'],
              ['siempre', 'always'],
            ],
            ['es-trabajo', 'es-miro', 'es-escucho', 'es-siempre'],
            { id: 'es.ex.w8vy5il6830lbc' },
          ),
          ex.fillBlank(
            'Lucía ___ una serie a la noche.',
            'Lucía watches a series in the evening.',
            'mira',
            ['miro', 'mirás', 'escucha'],
            ['es-miro'],
            {
              id: 'es.ex.p76ej5gtx420yu',
              explanation:
                'With ella (Lucía) the -ar ending is -a: mira. Miro is for yo and mirás for vos.',
            },
          ),
          question(
            'es.ex.kghmdqjy5cgp87',
            MANANA,
            'When does Sofía work?',
            'In the morning',
            ['In the afternoon', 'In the evening', 'Only sometimes'],
            ['es-trabajo', 'es-la-manana', 'es-siempre'],
            'Sofía answers “Sí, siempre trabajo a la mañana”: she always works in the morning.',
          ),
          question(
            'es.ex.czfooijvftkl2y',
            MANANA,
            'What does Martín do in the morning?',
            'He watches series',
            ['He works', 'He listens to music', 'He has dinner with his parents'],
            ['es-miro'],
            'Martín works in the afternoon; he says “A la mañana miro series”.',
          ),
          ex.orderWords(
            'A veces escucho la radio.',
            'Sometimes I listen to the radio.',
            ['es-a-veces', 'es-escucho'],
            { id: 'es.ex.6s13ljt7bzd49b' },
          ),
          ex.shortAnswer(
            '¿Trabajás a la mañana?',
            'Answer that yes, you work in the morning (start with «Sí, trabajo»).',
            'Sí, trabajo a la mañana.',
            [
              'Sí, trabajo a la mañana',
              'Sí, yo trabajo a la mañana.',
              'Sí, trabajo por la mañana.',
              'Sí, siempre trabajo a la mañana.',
            ],
            ['es-trabajo', 'es-la-manana'],
            { id: 'es.ex.mpe9sicu61yx8x' },
          ),
          ex.translateWrite(
            'I always watch TV in the evening.',
            'Siempre miro la tele a la noche.',
            ['es-siempre', 'es-miro', 'es-la-noche'],
            {
              id: 'es.ex.07kdn4ik7zh4ao',
              acceptedAnswers: [
                'A la noche siempre miro la tele.',
                'Siempre miro la televisión a la noche.',
                'Siempre miro tele a la noche.',
                'Siempre miro la tele por la noche.',
                'Yo siempre miro la tele a la noche.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Nosotros, ustedes, ellos',
        objective: 'Talk about what we, you all and they do, with -ar, -er and -ir verbs.',
        intro: {
          explanation:
            'The plural persons are nosotros (we; nosotras if they are all women), ustedes (you all) and ellos (they; ellas for women). In Argentina ustedes is the plural of both vos and usted, and ustedes and ellos share the same verb form. -ar: trabajamos, trabajan. Verbs in -er and -ir follow the same idea: comer → como, comés, come, comemos, comen; vivir → vivo, vivís, vive, vivimos, viven. Todos los días means every day.',
          examples: [
            {
              target: 'Nosotros comemos en casa todos los días.',
              base: 'We eat at home every day.',
            },
            {
              target: '¿Ustedes viven en Rosario? — No, vivimos en Mendoza.',
              base: 'Do you all live in Rosario? — No, we live in Mendoza.',
            },
          ],
        },
        takeaways: [
          'You use nosotros, ustedes and ellos with their endings: -amos / -emos / -imos and -an / -en.',
          'You say that something happens every day with todos los días.',
        ],
        exercises: [
          ex.translationChoice('nosotros', 'we', ['they', 'you all', 'I'], ['es-nosotros'], {
            id: 'es.ex.siobbrfpapfhlv',
          }),
          ex.matchPairs(
            [
              ['nosotros', 'we'],
              ['ellos', 'they'],
              ['ustedes', 'you all'],
              ['todos los días', 'every day'],
            ],
            ['es-nosotros', 'es-ellos', 'es-ustedes', 'es-todos-los-dias'],
            { id: 'es.ex.kqm0dg3kkvlv1o' },
          ),
          ex.fillBlank(
            'Nosotros ___ en Córdoba.',
            'We live in Córdoba.',
            'vivimos',
            ['viven', 'vive', 'vivís'],
            ['es-nosotros'],
            {
              id: 'es.ex.rby6s67yjemofe',
              explanation:
                'With nosotros, -ir verbs end in -imos: vivimos. Viven is for ustedes or ellos.',
            },
          ),
          ex.listenChoice(
            'Ellos trabajan en Rosario.',
            [
              'Ellos trabajan en Mendoza.',
              'Ella trabaja en Rosario.',
              'Nosotros trabajamos en Rosario.',
            ],
            ['es-ellos', 'es-trabajo', 'es-nosotros'],
            { id: 'es.ex.mu3bebuc21dbyg' },
          ),
          ex.fillBlank(
            '¿Ustedes ___ carne?',
            'Do you all eat meat?',
            'comen',
            ['comemos', 'come', 'como'],
            ['es-ustedes'],
            {
              id: 'es.ex.2p8dyxe96zvy21',
              explanation:
                'Ustedes takes the same ending as ellos: comen. In Spain you would also hear vosotros, but not in Argentina.',
            },
          ),
          ex.translationChoice(
            'todos los días',
            'every day',
            ['sometimes', 'always', 'first'],
            ['es-todos-los-dias'],
            { id: 'es.ex.31qng28uuzzrft' },
          ),
          ex.fillBlank(
            'Ellas ___ inglés todos los días.',
            'They speak English every day.',
            'hablan',
            ['hablamos', 'habla', 'hablo'],
            ['es-ellos', 'es-todos-los-dias'],
            {
              id: 'es.ex.u2aiz3qxyhpd2w',
              explanation: 'With ellos or ellas, -ar verbs end in -an: hablan.',
            },
          ),
          ex.listenChoice(
            'Nosotros comemos a la noche.',
            ['Ustedes comen a la noche.', 'Vos comés a la noche.', 'Ella come a la noche.'],
            ['es-nosotros', 'es-ustedes'],
            { id: 'es.ex.h8riq2yieoe62l' },
          ),
          ex.translateWrite(
            'We eat at home every day.',
            'Nosotros comemos en casa todos los días.',
            ['es-nosotros', 'es-todos-los-dias'],
            {
              id: 'es.ex.ix2ytdjqp8ze99',
              acceptedAnswers: [
                'Comemos en casa todos los días.',
                'Todos los días comemos en casa.',
                'Nosotros comemos todos los días en casa.',
                'Nosotras comemos en casa todos los días.',
                'Todos los días nosotros comemos en casa.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Ustedes viven en Rosario?',
            'Answer that no, you live in Mendoza (start with «No, vivimos»).',
            'No, vivimos en Mendoza.',
            [
              'No, vivimos en Mendoza',
              'No, nosotros vivimos en Mendoza.',
              'No, nosotras vivimos en Mendoza.',
            ],
            ['es-ustedes', 'es-nosotros'],
            { id: 'es.ex.eur18qto2118z5' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Mi día',
        objective: 'Understand and tell a short description of someone’s day.',
        intro: {
          explanation:
            'To tell your day, put the actions in order with primero and después, and add when (a la mañana, a la tarde, a la noche) and how often (siempre, a veces, todos los días). A typical Argentine day: mate or café con leche with medialunas for breakfast, lunch around one, and a late dinner.',
          examples: [
            {
              target: 'Todos los días me levanto temprano y tomo mate.',
              base: 'Every day I get up early and drink mate.',
            },
            {
              target: 'A la noche ceno y después me acuesto.',
              base: 'In the evening I have dinner and then I go to bed.',
            },
          ],
        },
        takeaways: [
          'You understand a short text about someone’s routine.',
          'You tell your own day in order, with when and how often.',
        ],
        exercises: [
          question(
            'es.ex.6t5cjbuakv83dx',
            MI_DIA,
            'What does Valentina do first?',
            'She drinks mate',
            ['She works at home', 'She listens to music', 'She has lunch with her sister'],
            ['es-primero'],
            'She writes “Primero tomo mate, después trabajo en casa”.',
          ),
          question(
            'es.ex.x7ot3lhah2l3tl',
            MI_DIA,
            'Where does Valentina work?',
            'At home',
            ['In Palermo', 'At her sister’s', 'She doesn’t work'],
            ['es-trabajo'],
            'She writes “después trabajo en casa”: she works at home.',
          ),
          question(
            'es.ex.y4th5vcfid1k3c',
            MI_DIA,
            'Who does she have lunch with?',
            'Her sister',
            ['Her mother', 'Her brother', 'Alone'],
            ['es-el-almuerzo'],
            'She writes “El almuerzo es con mi hermana”.',
          ),
          question(
            'es.ex.imz8m10e0ilfd2',
            MI_DIA,
            'What does she say about dinner?',
            'It is very late',
            ['It is very early', 'It is with her sister', 'She doesn’t have dinner'],
            ['es-la-cena', 'es-me-acuesto'],
            'She writes “La cena es muy tarde y después me acuesto”.',
          ),
          question(
            'es.ex.wixn21xfq9r1jq',
            MANANA,
            'Who does Martín sometimes have dinner with?',
            'His parents',
            ['Sofía', 'His sister', 'His friends from work'],
            ['es-a-veces', 'es-la-noche'],
            'Martín says “A veces ceno con mis padres”: sometimes he has dinner with his parents.',
          ),
          ex.listenChoice(
            'Ustedes trabajan todos los días.',
            [
              'Nosotros trabajamos todos los días.',
              'Ellos trabajan a veces.',
              'Vos trabajás todos los días.',
            ],
            ['es-ustedes', 'es-todos-los-dias', 'es-a-veces'],
            { id: 'es.ex.ls1ack4bk1ur6b' },
          ),
          ex.fillBlank(
            'A la tarde, Valentina ___ música.',
            'In the afternoon, Valentina listens to music.',
            'escucha',
            ['escucho', 'escuchás', 'escuchan'],
            ['es-escucho', 'es-la-tarde'],
            {
              id: 'es.ex.noa0owaxlwxfy0',
              explanation: 'With ella (Valentina): escucha. Escuchan is for ellos or ustedes.',
            },
          ),
          ex.matchPairs(
            [
              ['el desayuno', 'breakfast'],
              ['el almuerzo', 'lunch'],
              ['a veces', 'sometimes'],
              ['después', 'then'],
            ],
            ['es-el-desayuno', 'es-el-almuerzo', 'es-a-veces', 'es-despues'],
            { id: 'es.ex.k96a933atar1na' },
          ),
          ex.translateWrite(
            'Sometimes we listen to music in the evening.',
            'A veces escuchamos música a la noche.',
            ['es-a-veces', 'es-escucho', 'es-nosotros'],
            {
              id: 'es.ex.akpsx8zezgdy87',
              acceptedAnswers: [
                'A veces nosotros escuchamos música a la noche.',
                'A la noche a veces escuchamos música.',
                'A veces escuchamos música por la noche.',
                'Nosotros a veces escuchamos música a la noche.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué hacés a la noche?',
            'Say that in the evening you watch a series (start with «A la noche»).',
            'A la noche miro una serie.',
            [
              'A la noche miro una serie',
              'A la noche yo miro una serie.',
              'A la noche, miro una serie.',
              'A la noche miro series.',
            ],
            ['es-miro', 'es-la-noche'],
            { id: 'es.ex.zvbddcfwztg3lc' },
          ),
        ],
      },
    ],
  },
};
