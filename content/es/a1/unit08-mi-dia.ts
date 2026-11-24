import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U8 «My day» (docs/ES_A1_A2.md), en español neutro de Latinoamérica (tú y ustedes): contar
 * la rutina de todos los días con el presente de los verbos regulares en -ar, -er, -ir en todas las
 * personas (yo trabajo, tú trabajas, él / ella / usted trabaja, nosotros trabajamos, ustedes / ellos
 * trabajan; como, comes…; vivo, vives…), ustedes como único plural (vosotros sólo se menciona en inglés,
 * para España), los reflexivos más frecuentes (me levanto / te levantas / se levanta; me acuesto / te
 * acuestas, o → ue), las partes del día (por la mañana, por la tarde, por la noche; se acepta «a la…»),
 * las comidas, el orden (primero, después) y la frecuencia (siempre, a veces, todos los días).
 * Pronunciación: la terminación distingue a las personas (trabajo / trabajas / trabaja).
 * Cultura: los horarios de las comidas cambian según el país (en España y en la Argentina se cena tarde).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const MANANA = dialogue(
  'es.stim.a1-u8-manana',
  'Two friends talk about when they work.',
  [
    ['Martín', '¿Trabajas por la mañana?'],
    ['Sofía', 'Sí, siempre trabajo por la mañana. ¿Y tú?'],
    ['Martín', 'Yo trabajo por la tarde. Por la mañana miro series.'],
    ['Sofía', '¡Qué bien! ¿Y por la noche?'],
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
    'Primero tomo café, después trabajo en casa.',
    'El almuerzo es con mi hermana.',
    'Por la tarde escucho música.',
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
    'Bogotá',
    'Lima',
    'Guadalajara',
    'Monterrey',
  ],
  support: [
    'tele',
    'serie',
    'música',
    'película',
    'radio',
    'temprano',
    'ducho',
    'levantas',
    'acuestas',
    'trabajas',
    'miras',
    'escuchas',
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
    'haces',
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
        'Regular verbs change their ending for each person: yo, tú, él / ella / usted, nosotros, ustedes / ellos. -ar (trabajar): trabajo, trabajas, trabaja, trabajamos, trabajan. -er (comer): como, comes, come, comemos, comen. -ir (vivir): vivo, vives, vive, vivimos, viven. The tú form ends in -s (trabajas, comes, vives). Usted, él and ella share a form (trabaja), and so do ustedes and ellos (trabajan). In Latin America ustedes is the plural of both tú and usted; in Spain friends say vosotros, which you only need to recognise. Some verbs come with me, te, se (reflexive): me levanto (I get up), te levantas, se levanta; me acuesto (I go to bed), te acuestas, se acuesta. Acostarse changes o to ue in these forms: acuesto, acuestas, acuesta. Spanish often drops the subject pronoun, because the ending already says who it is: trabajo = I work.',
      examples: [
        {
          target: 'Yo trabajo, tú trabajas y ella trabaja.',
          base: 'I work, you work and she works.',
        },
        {
          target: 'Nosotros vivimos en Guadalajara y ellos viven en Lima.',
          base: 'We live in Guadalajara and they live in Lima.',
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
        'A1 nuevo (U8). Convertido al español neutro de Latinoamérica (tú y ustedes) el 2026-11-21. Sin revisión nativa. Revisar: «por la mañana / por la tarde / por la noche» como forma general (se acepta «a la…» en las respuestas); «el almuerzo» para lunch (en México se dice más «la comida»; se menciona); «tarde» también como adverbio (me acuesto tarde) sin enseñarlo como palabra; «desayuno» y «almuerzo» usados también como verbos (yo desayuno) a partir de los sustantivos; «miro la tele» («veo la tele» también es muy común y se acepta en las respuestas); «café con leche» en el desayuno; las ciudades (Bogotá, Lima, Guadalajara, Monterrey) reemplazan a las argentinas.',
    },
    words: [
      w(
        'es-la-manana',
        'la mañana',
        'the morning',
        'Tomo café por la mañana.',
        'I drink café in the morning.',
        ['time'],
        { emoji: '🌅' },
      ),
      w(
        'es-la-tarde',
        'la tarde',
        'the afternoon',
        'Por la tarde trabajo en casa.',
        'In the afternoon I work at home.',
        ['time'],
      ),
      w(
        'es-la-noche',
        'la noche',
        'the night',
        'Por la noche miro la tele.',
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
      w('es-trabajo', 'trabajo', 'I work', 'Trabajo en Bogotá.', 'I work in Bogotá.', ['verbs']),
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
        'Nosotros vivimos en Lima.',
        'We live in Lima.',
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
        '¿Ustedes viven en Guadalajara?',
        'Do you all live in Guadalajara?',
        ['pronouns'],
        { acceptedTranslations: ['you (plural)'] },
      ),
      w(
        'es-primero',
        'primero',
        'first',
        'Primero me levanto, después tomo café.',
        'First I get up, then I drink café.',
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
        'Tomo café todos los días.',
        'I drink café every day.',
        ['frequency'],
      ),
      w(
        'es-el-desayuno',
        'el desayuno',
        'breakfast',
        'El desayuno es café con leche y croissants.',
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
        'En mi casa la cena es muy tarde.',
        'At home, dinner is very late.',
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
            'La mañana is the morning, la tarde the afternoon and la noche the evening or night. To say “in the morning”, say por la mañana (por la tarde, por la noche); in Argentina and Uruguay you will also hear a la mañana. The meals: el desayuno (breakfast), el almuerzo (lunch; in Mexico people usually call the midday meal la comida) and la cena (dinner). Meal times change from country to country: in Spain and Argentina dinner is late, often after nine in the evening. Careful: la mañana is the morning, but mañana on its own means tomorrow. The ñ sounds like the ny in canyon.',
          examples: [
            { target: 'Tomo café por la mañana.', base: 'I drink coffee in the morning.' },
            { target: 'La cena es por la noche.', base: 'Dinner is in the evening.' },
          ],
        },
        takeaways: [
          'You say when you do something with por la mañana, por la tarde and por la noche.',
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
            'Tomo café por la mañana.',
            ['Tomo café por la tarde.', 'Tomo café por la noche.', 'Tomo té por la mañana.'],
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
            'El ___ es por la mañana.',
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
            'La ___ es por la noche.',
            'Dinner is in the evening.',
            'cena',
            ['mañana', 'tarde', 'leche'],
            ['es-la-cena', 'es-la-noche'],
            {
              id: 'es.ex.f953gkjyg5j18v',
              skill: 'vocabulary',
              explanation:
                'La cena is dinner. In Spain and Argentina it is late: many people have dinner after nine.',
            },
          ),
          ex.listenChoice(
            'En el almuerzo como carne.',
            ['En el desayuno como carne.', 'En la cena como carne.', 'En el almuerzo como queso.'],
            ['es-el-almuerzo', 'es-el-desayuno', 'es-la-cena'],
            { id: 'es.ex.fokl5l8ty9xjbz' },
          ),
          ex.translateWrite(
            'Sometimes I drink coffee in the afternoon.',
            'A veces tomo café por la tarde.',
            ['es-a-veces', 'es-la-tarde'],
            {
              id: 'es.ex.d00ybqyv7zisdj',
              acceptedAnswers: [
                'Por la tarde a veces tomo café.',
                'A veces tomo café a la tarde.',
                'A veces, tomo café por la tarde.',
                'Por la tarde, a veces tomo café.',
                'A veces bebo café por la tarde.',
                'A veces tomo un café por la tarde.',
              ],
            },
          ),
          ex.translateWrite(
            'Dinner is in the evening.',
            'La cena es por la noche.',
            ['es-la-cena', 'es-la-noche'],
            {
              id: 'es.ex.q6qlk9dzmkv0rt',
              acceptedAnswers: ['La cena es a la noche.', 'La cena es de noche.'],
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
            'Some verbs come with me, te or se: they are reflexive, a bit like “get yourself up”. Me levanto is I get up and me acuesto is I go to bed; me ducho is I take a shower. With tú: te levantas, te acuestas. Notice the ue: acostarse changes o to ue in yo, tú and él / ella (me acuesto, te acuestas, se acuesta). With él, ella or usted: se levanta, se acuesta. To put things in order: primero (first) and después (then, afterwards). Two handy extras: tarde also means late (me acuesto tarde), and desayuno also means I have breakfast.',
          examples: [
            {
              target: 'Primero me levanto, después me ducho.',
              base: 'First I get up, then I take a shower.',
            },
            { target: 'Me acuesto muy tarde.', base: 'I go to bed very late.' },
          ],
        },
        takeaways: [
          'You use me levanto and me acuesto, and te levantas, te acuestas with tú.',
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
            'Primero me ___, después tomo café.',
            'First I get up, then I drink café.',
            'levanto',
            ['acuesto', 'llamo', 'tomo'],
            ['es-primero', 'es-despues', 'es-me-levanto'],
            {
              id: 'es.ex.tpexktq0qciw8k',
              skill: 'vocabulary',
              explanation:
                'Me levanto is I get up. Me acuesto would be I go to bed, which does not come before your morning coffee.',
            },
          ),
          ex.listenChoice(
            'Me levanto y me ducho.',
            ['Me acuesto y me ducho.', 'Me levanto y tomo café.', 'Me acuesto muy tarde.'],
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
            'Tú te ___ muy tarde.',
            'You go to bed very late.',
            'acuestas',
            ['acuesto', 'acuesta', 'levanto'],
            ['es-me-acuesto'],
            {
              id: 'es.ex.3ohjkw0w10veh0',
              explanation:
                'With tú: te acuestas, with -as and the o → ue change. Yo me acuesto, ella se acuesta.',
            },
          ),
          ex.fillBlank(
            'Martín ___ levanta y después toma café.',
            'Martín gets up and then drinks café.',
            'se',
            ['me', 'te', 'mi'],
            ['es-me-levanto', 'es-despues'],
            {
              id: 'es.ex.nqzydci1a5aiat',
              explanation:
                'With él, ella or usted the reflexive word is se: se levanta. Me is for yo and te for tú.',
            },
          ),
          ex.orderWords(
            'Primero me levanto y después me ducho.',
            'First I get up and then I take a shower.',
            ['es-primero', 'es-despues', 'es-me-levanto'],
            { id: 'es.ex.r203ryjks64j7b' },
          ),
          ex.shortAnswer(
            '¿Te levantas tarde?',
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
        objective: 'Say what you and others do, with yo, tú and él or ella, and how often.',
        intro: {
          explanation:
            'Verbs ending in -ar (trabajar, mirar, escuchar) change their ending for each person: yo trabajo, tú trabajas, él, ella or usted trabaja. The stress stays in the same place (tra-BA-jo, tra-BA-jas, tra-BA-ja), so listen for the ending: -o is I, -as is you, -a is he, she or usted. Mirar means to watch or look at and escuchar to listen to, with no extra word for “at” or “to”: miro la tele, escucho música. Siempre (always) and a veces (sometimes) usually go before the verb.',
          examples: [
            { target: 'Siempre escucho música.', base: 'I always listen to music.' },
            { target: '¿Trabajas en Bogotá?', base: 'Do you work in Bogotá?' },
          ],
        },
        takeaways: [
          'You conjugate -ar verbs for yo, tú and él or ella: trabajo, trabajas, trabaja.',
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
            'Tú trabajas en Bogotá.',
            ['Yo trabajo en Bogotá.', 'Ella trabaja en Bogotá.'],
            ['es-trabajo'],
            { id: 'es.ex.tbuwqc5btbvc7u' },
          ),
          ex.fillBlank(
            'Tú ___ música por la noche.',
            'You listen to music in the evening.',
            'escuchas',
            ['escucho', 'escucha', 'miras'],
            ['es-escucho', 'es-la-noche'],
            {
              id: 'es.ex.q2vh6b1nmygrbe',
              explanation:
                'With tú the ending is -as: escuchas. Escucho is for yo and escucha for él or ella.',
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
            'Lucía ___ una serie por la noche.',
            'Lucía watches a series in the evening.',
            'mira',
            ['miro', 'miras', 'escucha'],
            ['es-miro'],
            {
              id: 'es.ex.p76ej5gtx420yu',
              explanation:
                'With ella (Lucía) the -ar ending is -a: mira. Miro is for yo and miras for tú.',
            },
          ),
          question(
            'es.ex.kghmdqjy5cgp87',
            MANANA,
            'When does Sofía work?',
            'In the morning',
            ['In the afternoon', 'In the evening', 'Only sometimes'],
            ['es-trabajo', 'es-la-manana', 'es-siempre'],
            'Sofía answers “Sí, siempre trabajo por la mañana”: she always works in the morning.',
          ),
          question(
            'es.ex.czfooijvftkl2y',
            MANANA,
            'What does Martín do in the morning?',
            'He watches series',
            ['He works', 'He listens to music', 'He has dinner with his parents'],
            ['es-miro'],
            'Martín works in the afternoon; he says “Por la mañana miro series”.',
          ),
          ex.orderWords(
            'A veces escucho la radio.',
            'Sometimes I listen to the radio.',
            ['es-a-veces', 'es-escucho'],
            { id: 'es.ex.6s13ljt7bzd49b' },
          ),
          ex.shortAnswer(
            '¿Trabajas por la mañana?',
            'Answer that yes, you work in the morning (start with «Sí, trabajo»).',
            'Sí, trabajo por la mañana.',
            [
              'Sí, trabajo por la mañana',
              'Sí, yo trabajo por la mañana.',
              'Sí, trabajo a la mañana.',
              'Sí, siempre trabajo por la mañana.',
            ],
            ['es-trabajo', 'es-la-manana'],
            { id: 'es.ex.mpe9sicu61yx8x' },
          ),
          ex.translateWrite(
            'I always watch TV in the evening.',
            'Siempre miro la tele por la noche.',
            ['es-siempre', 'es-miro', 'es-la-noche'],
            {
              id: 'es.ex.07kdn4ik7zh4ao',
              acceptedAnswers: [
                'Por la noche siempre miro la tele.',
                'Siempre miro la televisión por la noche.',
                'Siempre miro tele por la noche.',
                'Siempre miro la tele a la noche.',
                'Yo siempre miro la tele por la noche.',
                'Siempre veo la tele por la noche.',
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
            'The plural persons are nosotros (we; nosotras if they are all women), ustedes (you all) and ellos (they; ellas for women). In Latin America ustedes is the plural of both tú and usted (in Spain friends say vosotros, which this course does not practise), and ustedes and ellos share the same verb form. -ar: trabajamos, trabajan. Verbs in -er and -ir follow the same idea: comer → como, comes, come, comemos, comen; vivir → vivo, vives, vive, vivimos, viven. Todos los días means every day.',
          examples: [
            {
              target: 'Nosotros comemos en casa todos los días.',
              base: 'We eat at home every day.',
            },
            {
              target: '¿Ustedes viven en Guadalajara? — No, vivimos en Monterrey.',
              base: 'Do you all live in Guadalajara? — No, we live in Monterrey.',
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
            'Nosotros ___ en Lima.',
            'We live in Lima.',
            'vivimos',
            ['viven', 'vive', 'vives'],
            ['es-nosotros'],
            {
              id: 'es.ex.rby6s67yjemofe',
              explanation:
                'With nosotros, -ir verbs end in -imos: vivimos. Viven is for ustedes or ellos.',
            },
          ),
          ex.listenChoice(
            'Ellos trabajan en Guadalajara.',
            [
              'Ellos trabajan en Monterrey.',
              'Ella trabaja en Guadalajara.',
              'Nosotros trabajamos en Guadalajara.',
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
                'Ustedes takes the same ending as ellos: comen. In Latin America ustedes is the only plural “you”; in Spain friends would say vosotros.',
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
            'Nosotros comemos por la noche.',
            ['Ustedes comen por la noche.', 'Tú comes por la noche.', 'Ella come por la noche.'],
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
            '¿Ustedes viven en Guadalajara?',
            'Answer that no, you live in Monterrey (start with «No, vivimos»).',
            'No, vivimos en Monterrey.',
            [
              'No, vivimos en Monterrey',
              'No, nosotros vivimos en Monterrey.',
              'No, nosotras vivimos en Monterrey.',
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
            'To tell your day, put the actions in order with primero and después, and add when (por la mañana, por la tarde, por la noche) and how often (siempre, a veces, todos los días). Routines change from country to country: in Mexico the big meal (la comida) is around two or three in the afternoon, and in Spain and Argentina dinner is very late.',
          examples: [
            {
              target: 'Todos los días me levanto temprano y tomo café.',
              base: 'Every day I get up early and drink café.',
            },
            {
              target: 'Por la noche ceno y después me acuesto.',
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
            'She drinks coffee',
            ['She works at home', 'She listens to music', 'She has lunch with her sister'],
            ['es-primero'],
            'She writes “Primero tomo café, después trabajo en casa”.',
          ),
          question(
            'es.ex.x7ot3lhah2l3tl',
            MI_DIA,
            'Where does Valentina work?',
            'At home',
            ['In Bogotá', 'At her sister’s', 'She doesn’t work'],
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
              'Tú trabajas todos los días.',
            ],
            ['es-ustedes', 'es-todos-los-dias', 'es-a-veces'],
            { id: 'es.ex.ls1ack4bk1ur6b' },
          ),
          ex.fillBlank(
            'Por la tarde, Valentina ___ música.',
            'In the afternoon, Valentina listens to music.',
            'escucha',
            ['escucho', 'escuchas', 'escuchan'],
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
            'A veces escuchamos música por la noche.',
            ['es-a-veces', 'es-escucho', 'es-nosotros'],
            {
              id: 'es.ex.akpsx8zezgdy87',
              acceptedAnswers: [
                'A veces nosotros escuchamos música por la noche.',
                'Por la noche a veces escuchamos música.',
                'A veces escuchamos música a la noche.',
                'Nosotros a veces escuchamos música por la noche.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué haces por la noche?',
            'Say that in the evening you watch a series (start with «Por la noche»).',
            'Por la noche miro una serie.',
            [
              'Por la noche miro una serie',
              'Por la noche yo miro una serie.',
              'Por la noche, miro una serie.',
              'Por la noche miro series.',
              'A la noche miro una serie.',
              'Por la noche veo una serie.',
            ],
            ['es-miro', 'es-la-noche'],
            { id: 'es.ex.zvbddcfwztg3lc' },
          ),
        ],
      },
    ],
  },
};
