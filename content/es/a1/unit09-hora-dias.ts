import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U9 «Time and days» (docs/ES_A1_A2.md), en español neutro de Latinoamérica (tú y ustedes):
 * preguntar y decir la hora (¿qué hora es? ¿tienes la hora? / ¿tiene la hora? con usted; es la
 * una / son las dos, y cuarto, y media, menos cuarto), decir a qué hora pasa algo (a las ocho, al
 * mediodía), los días de la semana (en minúscula; el lunes = on Monday, los lunes = on Mondays), el fin
 * de semana (el finde, coloquial, sólo aceptado), hoy y mañana (tomorrow) frente a la mañana (the
 * morning): mañana por la mañana.
 * Pronunciación: la entonación de las preguntas (sube al final en las de sí o no, baja en las que
 * empiezan con qué o a qué hora) y los números que se confunden de oído (dos / doce).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const HORA = dialogue(
  'es.stim.a1-u9-hora',
  'Two students meet in the street.',
  [
    ['Diego', 'Hola, Lucía. ¿Qué hora es?'],
    ['Lucía', 'Son las doce y media.'],
    ['Diego', 'Tengo clase a la una.'],
    ['Lucía', '¿Y mañana? ¿A qué hora tienes clase?'],
    ['Diego', 'Mañana es sábado. ¡No tengo clase!'],
  ],
  ES_A1_RATE,
);

const CLASES = reading(
  'es.stim.a1-u9-clases',
  'schedule',
  'The timetable of an English school, on the door.',
  [
    'Lunes y miércoles: a las diez de la mañana.',
    'Martes y jueves: a las siete de la tarde.',
    'Viernes: no hay clase.',
    'Fin de semana: los sábados a las once.',
  ],
  { title: 'Clases de inglés' },
);

export const ES_A1_U09: EsUnitDef = {
  names: ['Diego', 'Lucía', 'Tomás', 'Camila'],
  support: ['clase', 'cenas'],
  unit: {
    position: 9,
    title: 'Time and days',
    titleEn: 'La hora y los días',
    description:
      'Ask and tell the time, say when something happens, name the days of the week and the weekend, and tell today from tomorrow.',
    emoji: '🕒',
    objective:
      'You can ask and say what time it is, say at what time you do things and talk about the days of the week, today and tomorrow.',
    grammar: {
      title: 'Es la una / son las dos · el lunes, los lunes',
      explanation:
        'To ask the time: ¿qué hora es? Answer es la una for one o’clock and son las + number for every other hour: son las dos, son las diez (la and las refer to la hora). Add minutes with y: y cuarto (quarter past), y media (half past), y diez; take them away with menos: menos cuarto (quarter to). To say when something happens, use a: a la una, a las ocho, al mediodía (a + el = al); ask ¿a qué hora? Add de la mañana, de la tarde or de la noche to make it clear. The days of the week are masculine and written in lower case. El lunes means on Monday (one day), los lunes on Mondays (every week); there is no word for “on”. Hoy is today and mañana is tomorrow, but la mañana is the morning: mañana por la mañana is tomorrow morning. Intonation: a yes/no question rises at the end (¿Es la una?); a question that starts with qué or a qué hora usually falls (¿Qué hora es?).',
      examples: [
        {
          target: '¿Qué hora es? — Son las tres y media.',
          base: 'What time is it? — It’s half past three.',
        },
        { target: 'Es la una menos cuarto.', base: 'It’s quarter to one.' },
        { target: 'Los sábados me levanto tarde.', base: 'On Saturdays I get up late.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U9). Convertido al español neutro de Latinoamérica (tú y ustedes) el 2026-11-21. Sin revisión nativa. Revisar: «¿tienes la hora?» / «¿tiene la hora?» como pedido habitual; «a las siete de la tarde» (en muchos países la tarde llega hasta más o menos las siete u ocho); «mañana por la mañana» como forma mostrada («mañana a la mañana», rioplatense, aceptada); «el finde» como coloquial (España, Argentina), sólo aceptado; la explicación de la entonación (descendente en las preguntas con qué).',
    },
    words: [
      w(
        'es-que-hora-es',
        '¿qué hora es?',
        'what time is it?',
        '¿Qué hora es? — Son las dos.',
        'What time is it? — It’s two o’clock.',
        ['time', 'questions'],
        { emoji: '🕒' },
      ),
      w(
        'es-la-hora',
        'la hora',
        'the time',
        '¿Tienes la hora?',
        'Do you have the time?',
        ['time'],
        {
          acceptedTranslations: ['the hour'],
        },
      ),
      w('es-y-media', 'y media', 'half past', 'Son las ocho y media.', 'It’s half past eight.', [
        'time',
      ]),
      w(
        'es-y-cuarto',
        'y cuarto',
        'quarter past',
        'Es la una y cuarto.',
        'It’s quarter past one.',
        ['time'],
      ),
      w(
        'es-menos-cuarto',
        'menos cuarto',
        'quarter to',
        'Son las diez menos cuarto.',
        'It’s quarter to ten.',
        ['time'],
      ),
      w(
        'es-el-mediodia',
        'el mediodía',
        'noon',
        'Almuerzo al mediodía.',
        'I have lunch at noon.',
        ['time'],
        { acceptedTranslations: ['midday'] },
      ),
      w(
        'es-la-medianoche',
        'la medianoche',
        'midnight',
        'Me acuesto a la medianoche.',
        'I go to bed at midnight.',
        ['time'],
      ),
      w('es-lunes', 'lunes', 'Monday', 'El lunes trabajo en casa.', 'On Monday I work at home.', [
        'days',
      ]),
      w('es-martes', 'martes', 'Tuesday', 'Los martes tengo clase.', 'On Tuesdays I have class.', [
        'days',
      ]),
      w('es-miercoles', 'miércoles', 'Wednesday', 'Hoy es miércoles.', 'Today is Wednesday.', [
        'days',
      ]),
      w(
        'es-jueves',
        'jueves',
        'Thursday',
        'Los jueves como con mi abuela.',
        'On Thursdays I eat with my grandmother.',
        ['days'],
      ),
      w(
        'es-viernes',
        'viernes',
        'Friday',
        'El viernes ceno con mis padres.',
        'On Friday I have dinner with my parents.',
        ['days'],
      ),
      w(
        'es-sabado',
        'sábado',
        'Saturday',
        'El sábado me levanto tarde.',
        'On Saturday I get up late.',
        ['days'],
      ),
      w(
        'es-domingo',
        'domingo',
        'Sunday',
        'Los domingos como con mi familia.',
        'On Sundays I eat with my family.',
        ['days'],
      ),
      w(
        'es-la-semana',
        'la semana',
        'the week',
        'Trabajo cinco días a la semana.',
        'I work five days a week.',
        ['time'],
      ),
      w(
        'es-el-fin-de-semana',
        'el fin de semana',
        'the weekend',
        'El fin de semana miro películas.',
        'At the weekend I watch movies.',
        ['time'],
        { acceptedTexts: ['el finde'] },
      ),
      w('es-hoy', 'hoy', 'today', 'Hoy es viernes.', 'Today is Friday.', ['time']),
      w('es-manana', 'mañana', 'tomorrow', 'Mañana es sábado.', 'Tomorrow is Saturday.', ['time']),
      w(
        'es-a-que-hora',
        '¿a qué hora?',
        'at what time?',
        '¿A qué hora cenas?',
        'What time do you have dinner?',
        ['time', 'questions'],
        { acceptedTranslations: ['what time?'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿Qué hora es?',
        objective: 'Ask the time and say it with o’clock, quarter past and half past.',
        intro: {
          explanation:
            '¿Qué hora es? asks the time. For one o’clock say es la una; for every other hour, son las + number: son las dos, son las ocho. The la and las are there because they refer to la hora (the time). Add y cuarto for quarter past and y media for half past: son las ocho y media. To ask someone informally: ¿tienes la hora? (tener: yo tengo, tú tienes); to a stranger, with usted: ¿tiene la hora? Careful with dos (two) and doce (twelve): listen for the c.',
          examples: [
            { target: '¿Qué hora es? — Es la una.', base: 'What time is it? — It’s one o’clock.' },
            { target: 'Son las ocho y media.', base: 'It’s half past eight.' },
          ],
        },
        takeaways: [
          'You ask ¿qué hora es? and answer es la una or son las dos.',
          'You add y cuarto and y media.',
        ],
        exercises: [
          ex.translationChoice(
            '¿qué hora es?',
            'what time is it?',
            ['how are you?', 'what is this?', 'where is it?'],
            ['es-que-hora-es'],
            { id: 'es.ex.ra1r8g5jnd2ai1' },
          ),
          ex.fillBlank(
            '¿Tienes la ___?',
            'Do you have the time?',
            'hora',
            ['una', 'cuarto', 'media'],
            ['es-la-hora'],
            {
              id: 'es.ex.ehfq2vjtrhpti2',
              skill: 'vocabulary',
              explanation:
                'La hora is the time. ¿Tienes la hora? (or, with usted, ¿tiene la hora?) is a common way to ask the time.',
            },
          ),
          ex.listenChoice(
            'Son las dos y media.',
            ['Son las doce y media.', 'Son las diez y media.', 'Son las dos y cuarto.'],
            ['es-y-media', 'es-y-cuarto'],
            { id: 'es.ex.7q6vmb9bn95edq' },
          ),
          ex.fillBlank(
            '___ las dos y cuarto.',
            'It’s quarter past two.',
            'Son',
            ['Es', 'Hay', 'Soy'],
            ['es-y-cuarto'],
            {
              id: 'es.ex.94lzfxq9sk1q0u',
              explanation:
                'For every hour except one o’clock you use son las: son las dos. Only one o’clock is singular: es la una.',
            },
          ),
          ex.matchPairs(
            [
              ['¿qué hora es?', 'what time is it?'],
              ['la hora', 'the time'],
              ['y media', 'half past'],
              ['y cuarto', 'quarter past'],
            ],
            ['es-que-hora-es', 'es-la-hora', 'es-y-media', 'es-y-cuarto'],
            { id: 'es.ex.cma0fif0lt01be' },
          ),
          ex.fillBlank(
            '___ la una y media.',
            'It’s half past one.',
            'Es',
            ['Son', 'Está', 'Hay'],
            ['es-y-media'],
            {
              id: 'es.ex.gwc8pqalm4m2tr',
              explanation: 'One o’clock is singular: es la una, es la una y media.',
            },
          ),
          ex.listenChoice(
            '¿Qué hora es?',
            ['¿Qué es esto?', '¿Dónde está?', '¿Cómo estás?'],
            ['es-que-hora-es'],
            { id: 'es.ex.r8b0k0ym14zior' },
          ),
          ex.orderWords('Son las ocho y cuarto.', 'It’s quarter past eight.', ['es-y-cuarto'], {
            id: 'es.ex.j3zsp0rl2xc0zn',
          }),
          ex.shortAnswer(
            '¿Qué hora es?',
            'Say it’s half past three (start with «Son las»).',
            'Son las tres y media.',
            ['Son las tres y media', 'Las tres y media.'],
            ['es-que-hora-es', 'es-y-media'],
            { id: 'es.ex.92gi51gc3r8doo' },
          ),
          ex.translateWrite(
            'What time is it? — It’s one o’clock.',
            '¿Qué hora es? — Es la una.',
            ['es-que-hora-es'],
            {
              id: 'es.ex.ashbs2bdevkqm2',
              acceptedAnswers: ['¿Qué hora es? Es la una.', '¿Qué hora es? — La una.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'A las ocho',
        objective: 'Say at what time you do things, with quarter to, noon and midnight.',
        intro: {
          explanation:
            'After half past, count back with menos: son las nueve menos cuarto (quarter to nine). Twelve o’clock is el mediodía (noon) or la medianoche (midnight). To ask when something happens: ¿a qué hora…? The answer uses a: a la una, a las ocho, al mediodía (a + el becomes al). Add de la mañana, de la tarde or de la noche to be clear: a las diez de la noche.',
          examples: [
            {
              target: '¿A qué hora te levantas? — A las siete.',
              base: 'What time do you get up? — At seven.',
            },
            { target: 'Almuerzo al mediodía.', base: 'I have lunch at noon.' },
          ],
        },
        takeaways: [
          'You ask ¿a qué hora? and answer a la una or a las ocho.',
          'You use menos cuarto, el mediodía and la medianoche.',
        ],
        exercises: [
          ex.translationChoice(
            'menos cuarto',
            'quarter to',
            ['quarter past', 'half past', 'midnight'],
            ['es-menos-cuarto'],
            { id: 'es.ex.pzy45qg4gtg4rd' },
          ),
          ex.fillBlank(
            'Son las nueve ___ cuarto.',
            'It’s quarter to nine.',
            'menos',
            ['y', 'de', 'a'],
            ['es-menos-cuarto'],
            {
              id: 'es.ex.bo0b2vf73wwunt',
              explanation:
                'Quarter to is menos cuarto (literally “minus a quarter”). Y cuarto would be quarter past.',
            },
          ),
          ex.translationChoice(
            'el mediodía',
            'noon',
            ['midnight', 'the afternoon', 'the morning'],
            ['es-el-mediodia'],
            { id: 'es.ex.99k77ryentjm2j' },
          ),
          ex.listenChoice(
            'Me levanto a las siete.',
            ['Me levanto a las seis.', 'Me acuesto a las siete.', 'Me levanto a las once.'],
            ['es-a-que-hora'],
            { id: 'es.ex.p78m1q2zv9v8vu' },
          ),
          ex.matchPairs(
            [
              ['menos cuarto', 'quarter to'],
              ['el mediodía', 'noon'],
              ['la medianoche', 'midnight'],
              ['¿a qué hora?', 'at what time?'],
            ],
            ['es-menos-cuarto', 'es-el-mediodia', 'es-la-medianoche', 'es-a-que-hora'],
            { id: 'es.ex.1htq14rp2me9nt' },
          ),
          ex.fillBlank(
            '¿___ qué hora cenas?',
            'What time do you have dinner?',
            'A',
            ['De', 'En', 'Y'],
            ['es-a-que-hora'],
            {
              id: 'es.ex.fgzlpp3zv9zjvr',
              explanation: 'To ask when something happens, Spanish needs a: ¿a qué hora…?',
            },
          ),
          ex.listenChoice(
            'Me acuesto a la medianoche.',
            ['Me acuesto al mediodía.', 'Me levanto a la medianoche.', 'Me acuesto a la una.'],
            ['es-la-medianoche', 'es-el-mediodia'],
            { id: 'es.ex.d408fbcepkwf12' },
          ),
          ex.fillBlank(
            'Almuerzo ___ mediodía.',
            'I have lunch at noon.',
            'al',
            ['el', 'en', 'de'],
            ['es-el-mediodia'],
            {
              id: 'es.ex.pl9vqi9eegdosu',
              explanation: 'A + el always becomes al: a + el mediodía = al mediodía.',
            },
          ),
          ex.shortAnswer(
            '¿A qué hora te levantas?',
            'Say you get up at seven (start with «Me levanto»).',
            'Me levanto a las siete.',
            [
              'Me levanto a las siete',
              'Yo me levanto a las siete.',
              'Me levanto a las siete de la mañana.',
              'A las siete.',
            ],
            ['es-a-que-hora'],
            { id: 'es.ex.oqy3sr8s5xq3he' },
          ),
          ex.translateWrite(
            'I go to bed at midnight.',
            'Me acuesto a la medianoche.',
            ['es-la-medianoche'],
            {
              id: 'es.ex.45fi70epwismhl',
              acceptedAnswers: ['Yo me acuesto a la medianoche.', 'A la medianoche me acuesto.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Lunes, martes, miércoles',
        objective: 'Name the weekdays and say on which day you do something.',
        intro: {
          explanation:
            'The days of the week are masculine and written in lower case: lunes, martes, miércoles, jueves. Use el for one specific day (el lunes = on Monday) and los for something you do every week (los lunes = on Mondays); there is no word for “on”. These days don’t change in the plural: el martes, los martes. De lunes a jueves means from Monday to Thursday. La semana is the week. Miércoles carries an accent because the stress falls on mié.',
          examples: [
            { target: 'El lunes trabajo en casa.', base: 'On Monday I work at home.' },
            {
              target: 'Los jueves como con mi abuela.',
              base: 'On Thursdays I eat with my grandmother.',
            },
          ],
        },
        takeaways: [
          'You name the days from lunes to jueves.',
          'You say el lunes for one day and los lunes for every week.',
        ],
        exercises: [
          ex.translationChoice(
            'lunes',
            'Monday',
            ['Tuesday', 'Wednesday', 'Thursday'],
            ['es-lunes'],
            { id: 'es.ex.o5qwyhjnfot95r' },
          ),
          ex.matchPairs(
            [
              ['lunes', 'Monday'],
              ['martes', 'Tuesday'],
              ['miércoles', 'Wednesday'],
              ['jueves', 'Thursday'],
            ],
            ['es-lunes', 'es-martes', 'es-miercoles', 'es-jueves'],
            { id: 'es.ex.6ekb4302xwd147' },
          ),
          ex.listenChoice(
            'El martes trabajo.',
            ['El jueves trabajo.', 'El lunes trabajo.', 'Los martes trabajo.'],
            ['es-martes', 'es-jueves', 'es-lunes'],
            { id: 'es.ex.f87f9q0ryqme4i' },
          ),
          ex.fillBlank(
            '___ lunes tomo café con mi abuela.',
            'On Mondays I have coffee with my grandmother.',
            'Los',
            ['El', 'La', 'Las'],
            ['es-lunes'],
            {
              id: 'es.ex.yn3556nbfyu8c8',
              explanation:
                'Every Monday is los lunes. El lunes would be one Monday. Days are masculine, so never la or las.',
            },
          ),
          ex.translationChoice(
            'la semana',
            'the week',
            ['the time', 'Wednesday', 'every day'],
            ['es-la-semana'],
            { id: 'es.ex.t0bhrvu1pot4pi' },
          ),
          ex.fillBlank(
            'Trabajo cinco días a la ___.',
            'I work five days a week.',
            'semana',
            ['hora', 'mañana', 'noche'],
            ['es-la-semana'],
            {
              id: 'es.ex.8njuupnjye7b5l',
              skill: 'vocabulary',
              explanation: 'A la semana means a week, per week: cinco días a la semana.',
            },
          ),
          ex.listenChoice(
            'Tengo clase los miércoles.',
            ['Tengo clase los martes.', 'Tengo clase los jueves.', 'Tengo clase los lunes.'],
            ['es-miercoles', 'es-martes', 'es-jueves'],
            { id: 'es.ex.vapc0grfa5ijqb' },
          ),
          ex.orderWords(
            'Los jueves trabajo en casa.',
            'On Thursdays I work at home.',
            ['es-jueves'],
            {
              id: 'es.ex.rk22vlwk14l9vu',
            },
          ),
          ex.shortAnswer(
            '¿Qué días trabajas?',
            'Say you work from Monday to Thursday (start with «Trabajo de»).',
            'Trabajo de lunes a jueves.',
            [
              'Trabajo de lunes a jueves',
              'De lunes a jueves.',
              'Yo trabajo de lunes a jueves.',
              'Trabajo los lunes, martes, miércoles y jueves.',
            ],
            ['es-lunes', 'es-jueves'],
            { id: 'es.ex.c5z6dbfil98rfu' },
          ),
          ex.translateWrite(
            'I have class on Tuesdays and Thursdays.',
            'Tengo clase los martes y los jueves.',
            ['es-martes', 'es-jueves'],
            {
              id: 'es.ex.oebo6848ltqh1w',
              acceptedAnswers: [
                'Tengo clase los martes y jueves.',
                'Los martes y los jueves tengo clase.',
                'Los martes y jueves tengo clase.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'El fin de semana',
        objective: 'Talk about Friday and the weekend and read a timetable.',
        intro: {
          explanation:
            'Viernes is Friday, and the weekend, el fin de semana, is sábado and domingo. In Spain and Argentina people often shorten it to el finde (informal). Sábado and domingo add an s in the plural: los sábados, los domingos. In many Spanish-speaking countries Sunday is a family day, often with a long lunch.',
          examples: [
            { target: 'El sábado me levanto tarde.', base: 'On Saturday I get up late.' },
            {
              target: 'Los domingos como con mi familia.',
              base: 'On Sundays I eat with my family.',
            },
          ],
        },
        takeaways: [
          'You name viernes, sábado and domingo and say el fin de semana.',
          'You understand days and times in a timetable.',
        ],
        exercises: [
          ex.translationChoice(
            'viernes',
            'Friday',
            ['Saturday', 'Sunday', 'Thursday'],
            ['es-viernes'],
            { id: 'es.ex.xg51t0h9z6ll02' },
          ),
          ex.matchPairs(
            [
              ['viernes', 'Friday'],
              ['sábado', 'Saturday'],
              ['domingo', 'Sunday'],
              ['el fin de semana', 'the weekend'],
            ],
            ['es-viernes', 'es-sabado', 'es-domingo', 'es-el-fin-de-semana'],
            { id: 'es.ex.a5xebckb2kwgcw' },
          ),
          ex.listenChoice(
            'El sábado me levanto tarde.',
            [
              'El domingo me levanto tarde.',
              'El sábado me acuesto tarde.',
              'El viernes me levanto tarde.',
            ],
            ['es-sabado', 'es-domingo', 'es-viernes'],
            { id: 'es.ex.rsawgvdhvdxbew' },
          ),
          ex.fillBlank(
            'Los ___ como con mi familia.',
            'On Sundays I eat with my family.',
            'domingos',
            ['sábados', 'viernes', 'lunes'],
            ['es-domingo'],
            {
              id: 'es.ex.r5zqw11cdp27yy',
              skill: 'vocabulary',
              explanation: 'Sunday is domingo; on Sundays, los domingos.',
            },
          ),
          question(
            'es.ex.gb1hs28nlmp525',
            CLASES,
            'At what time are the classes on Mondays and Wednesdays?',
            'At ten in the morning',
            ['At seven in the evening', 'At eleven', 'At two in the afternoon'],
            ['es-lunes', 'es-miercoles'],
            'The timetable says “Lunes y miércoles: a las diez de la mañana”.',
          ),
          question(
            'es.ex.mxqv7hgtu5re7e',
            CLASES,
            'Is there a class on Friday?',
            'No, there isn’t',
            ['Yes, in the morning', 'Yes, in the evening', 'Only at the weekend'],
            ['es-viernes'],
            'It says “Viernes: no hay clase”.',
          ),
          question(
            'es.ex.9cjq2ayb2vysde',
            CLASES,
            'When is the weekend class?',
            'On Saturdays at eleven',
            ['On Sundays at eleven', 'On Saturdays at seven', 'There is no class at the weekend'],
            ['es-el-fin-de-semana', 'es-sabado'],
            'It says “Fin de semana: los sábados a las once”.',
          ),
          ex.fillBlank(
            'El ___ de semana no trabajo.',
            'At the weekend I don’t work.',
            'fin',
            ['día', 'lunes', 'año'],
            ['es-el-fin-de-semana'],
            {
              id: 'es.ex.65vytg3kljiapo',
              skill: 'vocabulary',
              explanation:
                'The weekend is el fin de semana (in Spain and Argentina, informally, el finde).',
            },
          ),
          ex.translateWrite(
            'On Saturday I get up late.',
            'El sábado me levanto tarde.',
            ['es-sabado'],
            {
              id: 'es.ex.5trgqnospfjemx',
              acceptedAnswers: ['El sábado yo me levanto tarde.', 'Me levanto tarde el sábado.'],
            },
          ),
          ex.shortAnswer(
            '¿Qué haces el fin de semana?',
            'Say that at the weekend you watch movies (start with «El fin de semana»).',
            'El fin de semana miro películas.',
            [
              'El fin de semana miro películas',
              'El finde miro películas.',
              'El fin de semana yo miro películas.',
              'Miro películas.',
            ],
            ['es-el-fin-de-semana'],
            { id: 'es.ex.gwvmjr8t2hfoo3' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Hoy y mañana',
        objective:
          'Say what day it is today and tomorrow, and follow a short conversation about times.',
        intro: {
          explanation:
            'Hoy is today and mañana is tomorrow. Don’t mix up mañana (tomorrow) and la mañana (the morning): mañana por la mañana is tomorrow morning. Listen to the melody of questions: a yes/no question goes up at the end (¿Hoy trabajas?), while a question with qué or a qué hora usually goes down (¿A qué hora trabajas?).',
          examples: [
            { target: 'Hoy es viernes.', base: 'Today is Friday.' },
            { target: 'Mañana por la mañana trabajo.', base: 'Tomorrow morning I work.' },
          ],
        },
        takeaways: [
          'You say hoy es… and mañana es…',
          'You tell mañana (tomorrow) apart from la mañana (the morning).',
        ],
        exercises: [
          ex.translationChoice('hoy', 'today', ['tomorrow', 'the week', 'noon'], ['es-hoy'], {
            id: 'es.ex.9vov6n17jwcls7',
          }),
          ex.translationChoice(
            'mañana',
            'tomorrow',
            ['the morning', 'today', 'midnight'],
            ['es-manana'],
            { id: 'es.ex.af6rzzzmaxiqqs' },
          ),
          question(
            'es.ex.0vm1y6aelpb1h9',
            HORA,
            'What time is it?',
            'Half past twelve',
            ['Half past two', 'One o’clock', 'Quarter past twelve'],
            ['es-que-hora-es', 'es-y-media'],
            'Lucía answers “Son las doce y media”.',
          ),
          question(
            'es.ex.oza20tdiw76qfo',
            HORA,
            'When is Diego’s class today?',
            'At one o’clock',
            ['At twelve', 'At half past twelve', 'He has no class today'],
            ['es-a-que-hora'],
            'Diego says “Tengo clase a la una”.',
          ),
          question(
            'es.ex.pxezjgiq3ubjju',
            HORA,
            'Why doesn’t Diego have class tomorrow?',
            'Because it is Saturday',
            ['Because it is Sunday', 'Because the class is at midnight', 'Because he is ill'],
            ['es-manana', 'es-sabado'],
            'Diego says “Mañana es sábado. ¡No tengo clase!”.',
          ),
          ex.listenChoice(
            'Hoy es lunes.',
            ['Hoy es martes.', 'Mañana es lunes.', 'Hoy es jueves.'],
            ['es-hoy', 'es-manana', 'es-lunes'],
            { id: 'es.ex.207m8lre1odsli' },
          ),
          ex.fillBlank(
            'Hoy es jueves y ___ es viernes.',
            'Today is Thursday and tomorrow is Friday.',
            'mañana',
            ['hoy', 'la mañana', 'la semana'],
            ['es-manana', 'es-hoy'],
            {
              id: 'es.ex.tt4mepmmbbqxs0',
              explanation: 'Tomorrow is mañana, with no article. La mañana means the morning.',
            },
          ),
          ex.matchPairs(
            [
              ['hoy', 'today'],
              ['mañana', 'tomorrow'],
              ['la semana', 'the week'],
              ['el mediodía', 'noon'],
            ],
            ['es-hoy', 'es-manana', 'es-la-semana', 'es-el-mediodia'],
            { id: 'es.ex.wnmhm11n1qgyny' },
          ),
          ex.translateWrite(
            'Tomorrow morning I work.',
            'Mañana por la mañana trabajo.',
            ['es-manana'],
            {
              id: 'es.ex.67d595j7der8ku',
              acceptedAnswers: [
                'Mañana por la mañana yo trabajo.',
                'Trabajo mañana por la mañana.',
                'Mañana a la mañana trabajo.',
                'Trabajo mañana a la mañana.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué día es hoy?',
            'Say today is Wednesday (start with «Hoy es»).',
            'Hoy es miércoles.',
            ['Hoy es miércoles', 'Es miércoles.'],
            ['es-hoy', 'es-miercoles'],
            { id: 'es.ex.0k6xib4qfz4y73' },
          ),
        ],
      },
    ],
  },
};
