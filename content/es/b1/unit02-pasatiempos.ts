import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';
import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_B1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español B1 U2 «Habits and hobbies» (docs/ES_B1.md §3): costumbres y pasatiempos con perífrasis.
 * Soler + infinitivo (suelo correr), llevar + tiempo + gerundio (llevo dos años estudiando), seguir +
 * gerundio (sigo viviendo en Monterrey), dejar de, volver a y empezar a + infinitivo (dejé de tomar
 * café, volví a nadar, empecé a pintar) y el repaso de desde hace / hace… que con presente. Verbos
 * pronominales del ocio: relajarse, aburrirse, inscribirse (me relajo, me aburro, me inscribí).
 * Variante: español neutro de Latinoamérica, con tú y ustedes. «La piscina» como forma enseñada (en
 * México también «la alberca»; se aceptan las dos en las respuestas abiertas), «el vóleibol», «el
 * parque».
 * Pronunciación: el gerundio (-ando / -iendo, con el acento en an / ien) y la ortografía de empecé (z → c
 * delante de e) frente a empezó, que suenan igual con seseo.
 * Cultura: el calor de Monterrey, correr a las cinco de la mañana en Bogotá y subir a Monserrate, un centro
 * cultural de Puebla, un foro con usuarios de Guadalajara, Lima, Santiago y Monterrey.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const GIMNASIO = dialogue(
  'es.stim.b1-u2-gimnasio',
  'Javier meets his friend Mónica at a gym in Monterrey.',
  [
    ['Javier', '¡Mónica! ¿Tú también vienes a este gimnasio?'],
    [
      'Mónica',
      'Sí, llevo tres meses entrenando aquí. Suelo venir los lunes y los jueves, antes del trabajo.',
    ],
    ['Javier', '¡Qué bien! Yo suelo correr en el parque, pero con este calor es imposible.'],
    ['Mónica', 'Te entiendo. Por eso yo nado en la piscina del gimnasio. ¿Sabes nadar?'],
    ['Javier', 'Sí, pero hace años que no nado.'],
    [
      'Mónica',
      'Entonces ven conmigo el sábado. También hay un equipo de natación que entrena dos veces por semana.',
    ],
    ['Javier', '¿Un equipo? Llevo mucho tiempo sin hacer deporte…'],
    ['Mónica', '¡Por eso! Hacer deporte es la mejor costumbre que puedes tener.'],
  ],
  ES_B1_RATE,
);

const CORREDOR = dialogue(
  'es.stim.b1-u2-corredor',
  'Natalia interviews Julián, a runner from Bogotá, for a sports podcast.',
  [
    ['Natalia', 'Julián, ¿cuánto tiempo llevas corriendo?'],
    ['Julián', 'Corro desde hace quince años, desde la universidad.'],
    ['Natalia', '¿Y sigues entrenando todos los días?'],
    [
      'Julián',
      'Sigo entrenando seis días por semana. Suelo salir a las cinco de la mañana, cuando la ciudad está tranquila.',
    ],
    ['Natalia', '¡Qué temprano! ¿No te aburres?'],
    [
      'Julián',
      'Nunca. Correr es mi forma de relajarme. Cuando subo a Monserrate, me siento libre.',
    ],
    ['Natalia', '¿Y cuál es tu próximo sueño?'],
    ['Julián', 'Correr el maratón de Nueva York. ¡Llevo dos años soñando con eso!'],
  ],
  ES_B1_RATE,
);

const CENTRO = reading(
  'es.stim.b1-u2-centro',
  'ad',
  'An ad for a cultural center in Puebla.',
  [
    '¿Te aburres los fines de semana? ¡Encuentra tu nuevo pasatiempo!',
    'Clases de pintura para adultos: martes y jueves, de 6 a 8 de la tarde.',
    'Natación para niños y adultos en nuestra piscina: lunes, miércoles y viernes.',
    'Equipo de corredores: salimos a correr juntos los domingos a las 7 de la mañana.',
    'Si dejaste de hacer deporte hace tiempo, ¡nunca es tarde para volver!',
    'La primera clase es gratis. Inscríbete en la recepción antes del 15 de enero.',
  ],
  { title: 'Centro Cultural Ángeles' },
);

const FORO = reading(
  'es.stim.b1-u2-foro',
  'post',
  'People answer a question in an online forum about hobbies.',
  [
    'Ximena (Guadalajara): Empecé a pintar en enero.',
    'Ahora pinto todos los domingos y me relajo mucho.',
    'Gabriel (Lima): Yo volví a tocar la guitarra después de diez años, ¡y me sigue gustando como antes!',
    'Renata (Santiago): Dejé de ver series hasta tarde y me inscribí en un equipo de vóleibol.',
    'Llevo seis meses jugando y ya no me aburro los fines de semana.',
    'Héctor (Monterrey): Yo todavía no tengo pasatiempo. ¿Alguna idea?',
  ],
  { title: '¿Qué pasatiempo empezaste este año?' },
);

export const ES_B1_U02: EsUnitDef = {
  names: [
    'Javier',
    'Mónica',
    'Julián',
    'Natalia',
    'Ximena',
    'Gabriel',
    'Renata',
    'Monserrate',
    'Ángeles',
    'Héctor',
  ],
  support: [
    'sueles',
    'suele',
    'solemos',
    'suelen',
    'favorito',
    'parque',
    'dormir',
    'entrenando',
    'imposible',
    'entiendo',
    'nado',
    'piscina',
    'sabes',
    'ven',
    'conmigo',
    'natación',
    'entrena',
    'estudiando',
    'viviendo',
    'nadando',
    'entreno',
    'entrené',
    'lleva',
    'corriendo',
    'corro',
    'sigues',
    'aburres',
    'forma',
    'relajarme',
    'subo',
    'maratón',
    'soñando',
    'pintando',
    'relaja',
    'aburre',
    'relajar',
    'aburren',
    'aburro',
    'relajan',
    'relajarte',
    'relajo',
    'lesión',
    'dejaste',
    'dejó',
    'deja',
    'dejar',
    'encuentra',
    'pintura',
    'adultos',
    'nuestra',
    'corredores',
    'volver',
    'inscríbete',
    'recepción',
    'empezaste',
    'pinto',
    'tocar',
    'gustando',
    'inscribí',
    'vóleibol',
    'jugando',
    'idea',
    'empezó',
    'inscribirme',
    'inscribe',
    'centro',
    'cultural',
    'ver',
  ],
  unit: {
    position: 2,
    title: 'Habits and hobbies',
    titleEn: 'Hábitos y pasatiempos',
    description:
      'Talk about your habits and hobbies: say what you usually do with suelo, how long you have been doing something with llevo + -ando / -iendo, what you are still doing with sigo, and what you stopped, started or did again with dejé de, empecé a and volví a.',
    emoji: '🎨',
    objective:
      'You can talk about your habits and hobbies, say how long you have been doing something, and say what you stopped doing, started doing or did again.',
    grammar: {
      title: 'Soler · llevar + gerund · seguir + gerund · dejar de, volver a, empezar a',
      explanation:
        'Spanish uses verb + infinitive or verb + gerund combinations (periphrases) to talk about habits and changes. Soler + infinitive means “to usually do”: suelo correr por la mañana. It changes o to ue: suelo, sueles, suele, solemos, suelen. Llevar + time + gerund says how long you have been doing something that still continues: llevo dos años estudiando español (I have been studying Spanish for two years). The same idea can be said with the present + desde hace (estudio español desde hace dos años) or hace… que (hace dos años que estudio español): English uses “have been -ing”, but Spanish uses the present. The gerund ends in -ando for -ar verbs (pintar → pintando) and -iendo for -er / -ir verbs (correr → corriendo, vivir → viviendo). Seguir + gerund means “to still be doing”: sigo viviendo en Monterrey (I still live in Monterrey); seguir changes e to i and its yo form is sigo: sigo, sigues, sigue. Three verbs + a preposition + infinitive describe changes: dejar de (to stop): dejé de tomar café; volver a (to do again): volví a nadar; empezar a (to start): empecé a pintar (z changes to c before e). Don’t confuse volver a + infinitive (again) with volver a + a place (to go back to): volví a Oaxaca. Reflexive verbs keep their pronoun: me relajo, te aburres, me inscribí; with an infinitive it is attached: para relajarme, quiero inscribirme.',
      examples: [
        { target: 'Suelo correr por la mañana.', base: 'I usually run in the morning.' },
        {
          target: 'Llevo dos años estudiando español.',
          base: 'I’ve been studying Spanish for two years.',
        },
        {
          target: 'Dejé de tomar café y volví a correr.',
          base: 'I stopped drinking coffee and started running again.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'B1 nuevo (U2), en español neutro de Latinoamérica con tú; sin revisión nativa. Revisar: (1) «suelo» como palabra (también es «floor»): se aclara en L1; «soler» sólo se practica en presente (solía se menciona, no se usa). (2) «llevo» como palabra cuando A1/A2 ya enseñaron «llevo» = I carry / I wear: el validador lo acepta, pero el repaso generado podría mostrar la traducción «I have been (+ -ing, with time)» para un ejemplo de llevar ropa; revisar. (3) La traducción de «volví a» («I … again») y de «sigo» («I’m still (+ -ing)»): ¿claras para el alumno? (4) «La piscina» en el gimnasio de Monterrey: en México es más natural «la alberca»; se usa piscina por ser neutra. (5) «Hace años que no nado» y «Llevo mucho tiempo sin hacer deporte» (llevar + sin + infinitivo, no explicado aparte). (6) «Vóleibol» con tilde (también «voleibol» y «vólibol»); «el maratón» masculino (también «la maratón»). (7) El anuncio usa el imperativo «Inscríbete» y «Encuentra» sin enseñarlos (apoyo). (8) «Me sigue gustando como antes» (seguir + gerundio con gustar). (9) «Ver series» con el infinitivo ver como apoyo (A1/A2 enseñaron veo, vi, viste, pero no ver). (10) Podcast (inglés) sólo en la situación. Pronunciación: gerundios y empecé / empezó sin transcripción.',
    },
    words: [
      w(
        'es-el-pasatiempo',
        'el pasatiempo',
        'hobby',
        '¿Cuál es tu pasatiempo? — Me encanta cocinar.',
        'What’s your hobby? — I love cooking.',
        ['hobbies'],
        { acceptedTranslations: ['pastime', 'the hobby'], emoji: '🎨' },
      ),
      w(
        'es-suelo',
        'suelo',
        'I usually',
        'Suelo correr por la mañana.',
        'I usually run in the morning.',
        ['habits', 'periphrases'],
        { acceptedTranslations: ['I tend to'] },
      ),
      w(
        'es-llevo',
        'llevo',
        'I have been (+ -ing, with time)',
        'Llevo dos años estudiando español.',
        'I’ve been studying Spanish for two years.',
        ['habits', 'periphrases'],
      ),
      w(
        'es-sigo',
        'sigo',
        "I'm still (+ -ing)",
        'Sigo viviendo en Monterrey.',
        'I still live in Monterrey.',
        ['habits', 'periphrases'],
        { acceptedTranslations: ['I keep (+ -ing)'] },
      ),
      w(
        'es-deje-de',
        'dejé de',
        'I stopped (doing)',
        'Dejé de tomar café el año pasado.',
        'I stopped drinking coffee last year.',
        ['changes', 'periphrases'],
        { acceptedTranslations: ['I quit'] },
      ),
      w(
        'es-volvi-a',
        'volví a',
        'I … again',
        'Volví a nadar después de cinco años.',
        'I started swimming again after five years.',
        ['changes', 'periphrases'],
        { acceptedTranslations: ['I did … again'] },
      ),
      w(
        'es-empece-a',
        'empecé a',
        'I started (to)',
        'Empecé a pintar en enero.',
        'I started painting in January.',
        ['changes', 'periphrases'],
        { acceptedTranslations: ['I began (to)'] },
      ),
      w(
        'es-entrenar',
        'entrenar',
        'to train',
        'Me gusta entrenar por la mañana.',
        'I like training in the morning.',
        ['sport'],
        { acceptedTranslations: ['to work out'] },
      ),
      w(
        'es-el-gimnasio',
        'el gimnasio',
        'gym',
        'Voy al gimnasio después del trabajo.',
        'I go to the gym after work.',
        ['sport', 'places'],
        { acceptedTranslations: ['the gym'], emoji: '🏋️' },
      ),
      w(
        'es-correr',
        'correr',
        'to run',
        'Me gusta correr en el parque.',
        'I like running in the park.',
        ['sport'],
        { emoji: '🏃' },
      ),
      w(
        'es-nadar',
        'nadar',
        'to swim',
        'Me encanta nadar en el mar.',
        'I love swimming in the sea.',
        ['sport'],
        { emoji: '🏊' },
      ),
      w(
        'es-pintar',
        'pintar',
        'to paint',
        'Los domingos me gusta pintar.',
        'On Sundays I like painting.',
        ['hobbies'],
        { emoji: '🖌️' },
      ),
      w(
        'es-la-costumbre',
        'la costumbre',
        'habit, custom',
        'Tengo la costumbre de leer antes de dormir.',
        'I have the habit of reading before going to sleep.',
        ['habits'],
        { acceptedTranslations: ['habit', 'custom'] },
      ),
      w(
        'es-aburrirse',
        'aburrirse',
        'to get bored',
        'Los niños se aburren en los viajes largos.',
        'Children get bored on long trips.',
        ['feelings', 'reflexive'],
        { acceptedTranslations: ['to be bored'], emoji: '🥱' },
      ),
      w(
        'es-relajarse',
        'relajarse',
        'to relax',
        'Para relajarme, escucho música.',
        'To relax, I listen to music.',
        ['feelings', 'reflexive'],
        { emoji: '😌' },
      ),
      w(
        'es-el-equipo',
        'el equipo',
        'team',
        'Juego en un equipo de fútbol.',
        'I play in a football team.',
        ['sport'],
        { acceptedTranslations: ['the team'] },
      ),
      w(
        'es-inscribirse',
        'inscribirse',
        'to sign up',
        'Quiero inscribirme en una clase de pintura.',
        'I want to sign up for a painting class.',
        ['hobbies', 'reflexive'],
        { acceptedTranslations: ['to enroll', 'to enrol', 'to register'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Suelo…',
        objective: 'Talk about your habits and hobbies with soler + infinitive.',
        intro: {
          explanation:
            'Soler + infinitive means “to usually do something”. It changes o to ue: (yo) suelo, (tú) sueles, (él / ella / usted) suele, (nosotros) solemos, (ellos / ustedes) suelen. The next verb is always an infinitive: suelo ir, suelo correr. It means about the same as generalmente or normalmente + present (generalmente voy al gimnasio); both are very common. Careful: el suelo is also a noun (the floor), but in suelo correr it is the verb. El pasatiempo (hobby) comes from pasar + tiempo, “to pass time”. La costumbre is a habit or a custom: tengo la costumbre de leer (I’m in the habit of reading).',
          examples: [
            {
              target: 'Suelo ir al gimnasio por la mañana.',
              base: 'I usually go to the gym in the morning.',
            },
            {
              target: '¿Qué sueles hacer los fines de semana?',
              base: 'What do you usually do at weekends?',
            },
          ],
        },
        takeaways: [
          'You talk about what you usually do with suelo, sueles, suele + infinitive.',
          'You talk about your hobbies (el pasatiempo) and habits (la costumbre).',
        ],
        exercises: [
          ex.translationChoice(
            'suelo',
            'I usually',
            ['I want', 'I can', 'I have to'],
            ['es-suelo'],
            { id: 'es.ex.tpclgyy26sf1vd' },
          ),
          ex.translationChoice(
            'el pasatiempo',
            'hobby',
            ['the past', 'the weekend', 'the timetable'],
            ['es-el-pasatiempo'],
            { id: 'es.ex.4k8xjm7russcy7' },
          ),
          ex.fillBlank(
            '¿Qué ___ hacer los fines de semana?',
            'What do you usually do at weekends?',
            'sueles',
            ['suelo', 'suele', 'solemos'],
            ['es-suelo'],
            {
              id: 'es.ex.95mlh7o1cie200',
              explanation:
                'Soler changes o to ue: suelo, sueles, suele, solemos, suelen. With tú it is sueles.',
            },
          ),
          ex.fillBlank(
            'Suelo ___ al gimnasio después del trabajo.',
            'I usually go to the gym after work.',
            'ir',
            ['voy', 'fui', 'iba'],
            ['es-suelo', 'es-el-gimnasio'],
            {
              id: 'es.ex.5da8uhpi4muizt',
              explanation:
                'After soler, the verb is always an infinitive: suelo ir, not suelo voy.',
            },
          ),
          ex.matchPairs(
            [
              ['el pasatiempo', 'hobby'],
              ['la costumbre', 'habit, custom'],
              ['el gimnasio', 'gym'],
              ['correr', 'to run'],
            ],
            ['es-el-pasatiempo', 'es-la-costumbre', 'es-el-gimnasio', 'es-correr'],
            { id: 'es.ex.i5s22b35rigcm3' },
          ),
          ex.listenChoice(
            'Suelo correr por la mañana.',
            [
              'Suelo correr por la tarde.',
              'Quiero correr por la mañana.',
              'Suelen correr por la mañana.',
            ],
            ['es-suelo', 'es-correr'],
            { id: 'es.ex.z96gkq66um4zt8' },
          ),
          ex.fillBlank(
            'Tengo la ___ de leer antes de dormir.',
            'I have the habit of reading before going to sleep.',
            'costumbre',
            ['pasatiempo', 'gimnasio', 'semana'],
            ['es-la-costumbre'],
            {
              id: 'es.ex.o12cwmfw4z05f3',
              skill: 'vocabulary',
              explanation:
                'Tener la costumbre de + infinitive: to be in the habit of doing something. Costumbre is feminine: la costumbre.',
            },
          ),
          ex.orderWords(
            'Mi pasatiempo favorito es correr en el parque.',
            'My favorite hobby is running in the park.',
            ['es-el-pasatiempo', 'es-correr'],
            { id: 'es.ex.75tastxjylvqt0' },
          ),
          ex.translateWrite(
            'I usually go to the gym in the morning.',
            'Suelo ir al gimnasio por la mañana.',
            ['es-suelo', 'es-el-gimnasio'],
            {
              id: 'es.ex.hxgprpcjgvzy4r',
              acceptedAnswers: [
                'Por la mañana suelo ir al gimnasio.',
                'Suelo ir al gimnasio en la mañana.',
                'Generalmente voy al gimnasio por la mañana.',
                'Normalmente voy al gimnasio por la mañana.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué sueles hacer los domingos?',
            'Say what you usually do (Suelo + infinitive).',
            'Suelo correr en el parque.',
            [
              'Suelo correr en el parque',
              'Suelo descansar.',
              'Suelo ir al gimnasio.',
              'Suelo leer.',
              'Suelo cocinar.',
              'Suelo dormir mucho.',
              'Suelo comer con mi familia.',
              'Los domingos suelo descansar.',
              'Los domingos suelo correr.',
            ],
            ['es-suelo'],
            { id: 'es.ex.vjnsab3i9gj29o' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Llevo dos años…',
        objective:
          'Say how long you have been doing something with llevar + time + gerund and desde hace.',
        intro: {
          explanation:
            'For something that started in the past and is still going on, English uses “have been -ing”, but Spanish uses the present. There are three common ways: llevo dos años nadando, nado desde hace dos años, and hace dos años que nado. Llevar is regular: llevo, llevas, lleva, llevamos, llevan; to ask, say ¿Cuánto tiempo llevas + gerund? The gerund ends in -ando for -ar verbs (entrenar → entrenando, nadar → nadando) and -iendo for -er / -ir verbs (correr → corriendo, vivir → viviendo). For something you haven’t done for a long time, use hace… que no: hace años que no nado. El equipo is a team (it can also mean equipment).',
          examples: [
            {
              target: 'Llevo tres meses entrenando en este gimnasio.',
              base: 'I’ve been training at this gym for three months.',
            },
            {
              target: 'Juego en un equipo de fútbol desde hace dos años.',
              base: 'I’ve been playing in a football team for two years.',
            },
          ],
        },
        takeaways: [
          'You say how long you have been doing something with llevo + time + gerund (llevo dos años nadando).',
          'You also use desde hace and hace… que with the present: nado desde hace un año.',
        ],
        exercises: [
          ex.translationChoice(
            'llevo',
            'I have been (+ -ing, with time)',
            ['I usually', 'I stopped (doing)', 'I want to'],
            ['es-llevo'],
            { id: 'es.ex.yo3p9ajuoa49b8' },
          ),
          ex.translationChoice(
            'el equipo',
            'team',
            ['player', 'match', 'coach'],
            ['es-el-equipo'],
            { id: 'es.ex.45wew79ibu84dw' },
          ),
          ex.fillBlank(
            'Llevo tres meses ___ en este gimnasio.',
            'I’ve been training at this gym for three months.',
            'entrenando',
            ['entrenar', 'entreno', 'entrené'],
            ['es-llevo', 'es-entrenar'],
            {
              id: 'es.ex.3olvqpd4pa6zyk',
              explanation:
                'Llevar + time + gerund: llevo tres meses entrenando. The gerund of -ar verbs ends in -ando.',
            },
          ),
          ex.fillBlank(
            '¿Cuánto tiempo ___ nadando?',
            'How long have you been swimming?',
            'llevas',
            ['llevo', 'lleva', 'sueles'],
            ['es-llevo', 'es-nadar'],
            {
              id: 'es.ex.holdsv1wdunnw4',
              explanation:
                'With tú, the form is llevas. ¿Cuánto tiempo llevas + gerund? is the usual way to ask how long someone has been doing something.',
            },
          ),
          ex.fillBlank(
            'Juego en un equipo de fútbol ___ hace dos años.',
            'I’ve been playing in a football team for two years.',
            'desde',
            ['por', 'durante', 'hasta'],
            ['es-el-equipo'],
            {
              id: 'es.ex.hw6g372bbrs1u6',
              explanation:
                'Desde hace + time goes with the present for something that is still true: juego desde hace dos años. Por and durante can’t go before hace, and hasta hace dos años means “until two years ago”, which doesn’t fit a present verb.',
            },
          ),
          ex.listenChoice(
            'Llevo dos años nadando.',
            ['Llevo dos meses nadando.', 'Llevo dos años corriendo.', 'Suelo nadar dos horas.'],
            ['es-llevo', 'es-nadar'],
            { id: 'es.ex.rqjqexe9qewk7p' },
          ),
          question(
            'es.ex.1xzr8ifoon0trt',
            GIMNASIO,
            'How long has Mónica been training at the gym?',
            'For three months',
            ['For three years', 'For three weeks', 'Since last Monday'],
            ['es-llevo', 'es-entrenar'],
            'Mónica says “llevo tres meses entrenando aquí”: llevar + time + gerund.',
          ),
          question(
            'es.ex.uulsjpss3itrsf',
            GIMNASIO,
            'Why doesn’t Javier run in the park these days?',
            'Because it’s too hot',
            [
              'Because he hurt his leg',
              'Because the park is closed',
              'Because he prefers swimming',
            ],
            ['es-correr', 'es-suelo'],
            'Javier says “Yo suelo correr en el parque, pero con este calor es imposible”.',
          ),
          ex.translateWrite(
            'I’ve been studying Spanish for two years.',
            'Llevo dos años estudiando español.',
            ['es-llevo'],
            {
              id: 'es.ex.tq0x81kh4b729b',
              acceptedAnswers: [
                'Estudio español desde hace dos años.',
                'Hace dos años que estudio español.',
                'Llevo dos años aprendiendo español.',
                'Llevo dos años estudiando español',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Cuánto tiempo llevas estudiando español?',
            'Answer with «Llevo + time + estudiando».',
            'Llevo un año estudiando español.',
            [
              'Llevo un año estudiando español',
              'Llevo un año estudiando.',
              'Llevo dos años estudiando español.',
              'Llevo seis meses estudiando español.',
              'Llevo tres meses estudiando español.',
              'Llevo dos meses estudiando español.',
              'Llevo poco tiempo estudiando español.',
              'Llevo un año.',
              'Estudio español desde hace un año.',
            ],
            ['es-llevo'],
            { id: 'es.ex.zsp00qmr6ypw9j' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Sigo…',
        objective:
          'Say what you are still doing with seguir + gerund, and talk about relaxing and getting bored.',
        intro: {
          explanation:
            'Seguir + gerund means “to still be doing something” or “to keep doing it”: sigo viviendo en Monterrey (I still live in Monterrey). Seguir changes e to i and its yo form is sigo: sigo, sigues, sigue, seguimos, siguen. You can say the same with todavía + present: todavía vivo en Monterrey. The opposite is ya no (no longer): ya no pinto. Relajarse (to relax) and aburrirse (to get bored) are reflexive: the pronoun changes with the person (me relajo, te relajas, se relaja; me aburro, te aburres, se aburren). With an infinitive, the pronoun is attached to the end: para relajarme (to relax).',
          examples: [
            { target: 'Sigo viviendo en Monterrey.', base: 'I still live in Monterrey.' },
            {
              target: 'Cuando pinto, me relajo y nunca me aburro.',
              base: 'When I paint, I relax and I never get bored.',
            },
          ],
        },
        takeaways: [
          'You say what you are still doing with sigo, sigues, sigue + gerund.',
          'You talk about relaxing and getting bored with relajarse and aburrirse (me relajo, me aburro).',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['sigo', "I'm still (+ -ing)"],
              ['pintar', 'to paint'],
              ['relajarse', 'to relax'],
              ['aburrirse', 'to get bored'],
            ],
            ['es-sigo', 'es-pintar', 'es-relajarse', 'es-aburrirse'],
            { id: 'es.ex.kdygm8z7cj1m87' },
          ),
          ex.fillBlank(
            '___ viviendo en Monterrey, con mis padres.',
            'I still live in Monterrey, with my parents.',
            'Sigo',
            ['Suelo', 'Llevo', 'Sigue'],
            ['es-sigo'],
            {
              id: 'es.ex.7chlox8k11ce38',
              explanation:
                'Seguir + gerund means still doing something: sigo viviendo = I still live. The yo form is sigo; sigue is él / ella.',
            },
          ),
          ex.fillBlank(
            'Cuando pinto, me ___ mucho.',
            'When I paint, I relax a lot.',
            'relajo',
            ['relajan', 'aburre', 'relajar'],
            ['es-relajarse', 'es-pintar'],
            {
              id: 'es.ex.chh1dpqalny0ub',
              explanation:
                'Relajarse is reflexive: me relajo, te relajas, se relaja. Me goes with the yo form relajo. Me aburre would mean “it bores me”.',
            },
          ),
          ex.fillBlank(
            'Los niños se ___ en los viajes largos.',
            'Children get bored on long trips.',
            'aburren',
            ['aburro', 'aburres', 'relajan'],
            ['es-aburrirse'],
            {
              id: 'es.ex.g96h7wvxnkgtnt',
              explanation:
                'Los niños is ellos, so the form is se aburren. Me aburro is yo and te aburres is tú.',
            },
          ),
          ex.listenChoice(
            'Sigo pintando los domingos.',
            [
              'Suelo pintar los domingos.',
              'Sigo pintando los sábados.',
              'Sigue pintando los domingos.',
            ],
            ['es-sigo', 'es-pintar'],
            { id: 'es.ex.jhqiai4n78b7cc' },
          ),
          question(
            'es.ex.t5jcif8yr2nfwc',
            GIMNASIO,
            'What does Mónica invite Javier to do?',
            'To come with her on Saturday and maybe join a swimming team',
            [
              'To run in the park before work',
              'To train with her on Monday morning',
              'To play football with her team',
            ],
            ['es-nadar', 'es-el-equipo'],
            'Mónica says “ven conmigo el sábado. También hay un equipo de natación que entrena dos veces por semana”.',
          ),
          question(
            'es.ex.cyxfdnymy1jhbs',
            CORREDOR,
            'How often does Julián train?',
            'Six days a week',
            ['Every day', 'Twice a week', 'Only at weekends'],
            ['es-sigo', 'es-entrenar'],
            'Julián says “Sigo entrenando seis días por semana”.',
          ),
          question(
            'es.ex.da6x4r3v6nu7m7',
            CORREDOR,
            'Why doesn’t Julián get bored?',
            'Because running is his way of relaxing',
            [
              'Because he always runs with friends',
              'Because he listens to music',
              'Because he runs in a different city every week',
            ],
            ['es-aburrirse', 'es-relajarse'],
            'He answers “¿No te aburres?” with “Nunca. Correr es mi forma de relajarme”.',
          ),
          ex.translateWrite(
            'I still live in Monterrey.',
            'Sigo viviendo en Monterrey.',
            ['es-sigo'],
            {
              id: 'es.ex.xrvgn0quadgf50',
              acceptedAnswers: [
                'Todavía vivo en Monterrey.',
                'Aún vivo en Monterrey.',
                'Yo sigo viviendo en Monterrey.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué haces para relajarte?',
            'Say what you do to relax (Para relajarme, …).',
            'Para relajarme, escucho música.',
            [
              'Para relajarme escucho música.',
              'Escucho música para relajarme.',
              'Para relajarme, leo.',
              'Para relajarme, pinto.',
              'Para relajarme, corro.',
              'Para relajarme, nado.',
              'Pinto para relajarme.',
              'Leo un libro para relajarme.',
              'Para relajarme, voy al gimnasio.',
            ],
            ['es-relajarse'],
            { id: 'es.ex.apqgj8wzkogr3t' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Dejé de…, volví a…',
        objective: 'Say what you stopped doing and what you started doing again.',
        intro: {
          explanation:
            'Dejar de + infinitive means to stop doing something: dejé de tomar café (I stopped drinking coffee). Without de, dejar means to leave or to let. Volver a + infinitive means to do something again: volví a nadar (I swam again, I went back to swimming). Don’t confuse it with volver a + a place, which means to go back: volví a Oaxaca. In the preterite both verbs are regular: dejé, dejaste, dejó; volví, volviste, volvió (the o → ue change is only in the present: vuelvo). To say you don’t do something any more, use ya no + present: ya no corro.',
          examples: [
            {
              target: 'Dejé de correr por una lesión, pero el mes pasado volví a entrenar.',
              base: 'I stopped running because of an injury, but last month I started training again.',
            },
            { target: '¿Cuándo dejaste de pintar?', base: 'When did you stop painting?' },
          ],
        },
        takeaways: [
          'You say what you stopped doing with dejé de + infinitive.',
          'You say what you did again with volví a + infinitive.',
        ],
        exercises: [
          ex.translationChoice(
            'dejé de',
            'I stopped (doing)',
            ['I started (to)', 'I kept on', 'I tried to'],
            ['es-deje-de'],
            { id: 'es.ex.ie1hqecz2g3vfw' },
          ),
          ex.fillBlank(
            'Dejé ___ tomar café el año pasado.',
            'I stopped drinking coffee last year.',
            'de',
            ['a', 'en', 'que'],
            ['es-deje-de'],
            {
              id: 'es.ex.t9m8naiyfzrk5m',
              explanation:
                'Dejar de + infinitive = to stop doing something. Without de, dejar means to leave or to let.',
            },
          ),
          ex.fillBlank(
            'Después de cinco años, volví ___ nadar.',
            'After five years, I started swimming again.',
            'a',
            ['de', 'en', 'con'],
            ['es-volvi-a', 'es-nadar'],
            {
              id: 'es.ex.kavsualue572lv',
              explanation:
                'Volver a + infinitive means to do something again: volví a nadar. Volver de would mean to come back from a place.',
            },
          ),
          ex.fillBlank(
            'Mi hermano ___ de jugar en el equipo en 2020.',
            'My brother stopped playing in the team in 2020.',
            'dejó',
            ['dejé', 'deja', 'dejar'],
            ['es-deje-de', 'es-el-equipo'],
            {
              id: 'es.ex.6w7v14xwphkfzc',
              explanation:
                'Mi hermano is él, and 2020 is a finished time, so the preterite is dejó. Dejé is the yo form.',
            },
          ),
          ex.listenChoice(
            'Volví a correr el mes pasado.',
            [
              'Dejé de correr el mes pasado.',
              'Volví a correr la semana pasada.',
              'Suelo correr todos los meses.',
            ],
            ['es-volvi-a', 'es-correr'],
            { id: 'es.ex.43ekurg7choxn0' },
          ),
          question(
            'es.ex.s0up5xap6eoex7',
            CORREDOR,
            'What is Julián’s next dream?',
            'To run the New York marathon',
            ['To run up Monserrate every day', 'To stop running', 'To train other runners'],
            ['es-correr'],
            'He says “Correr el maratón de Nueva York. ¡Llevo dos años soñando con eso!”.',
          ),
          question(
            'es.ex.p5bn8ppoooo5d7',
            CENTRO,
            'When are the painting classes?',
            'On Tuesdays and Thursdays, from 6 to 8 p.m.',
            [
              'On Mondays, Wednesdays and Fridays',
              'On Sundays at 7 a.m.',
              'Every day before 15 January',
            ],
            ['es-pintar'],
            'The ad says “Clases de pintura para adultos: martes y jueves, de 6 a 8 de la tarde”.',
          ),
          question(
            'es.ex.4gr448vv21t7tk',
            CENTRO,
            'What does the ad say to people who stopped doing sport?',
            'That it’s never too late to come back',
            [
              'That they have to pay more',
              'That they can only join the children’s classes',
              'That they need a doctor’s note',
            ],
            ['es-deje-de', 'es-volvi-a'],
            'It says “Si dejaste de hacer deporte hace tiempo, ¡nunca es tarde para volver!”.',
          ),
          ex.translateWrite(
            'I stopped drinking coffee and started running again.',
            'Dejé de tomar café y volví a correr.',
            ['es-deje-de', 'es-volvi-a'],
            {
              id: 'es.ex.jp1sg8rfgchnmq',
              acceptedAnswers: [
                'Dejé de beber café y volví a correr.',
                'Dejé de tomar café y empecé a correr otra vez.',
                'Dejé de tomar café y empecé a correr de nuevo.',
                'Dejé de tomar café y volví a correr',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué dejaste de hacer este año?',
            'Say what you stopped doing (Dejé de + infinitive).',
            'Dejé de tomar café.',
            [
              'Dejé de tomar café',
              'Este año dejé de tomar café.',
              'Dejé de comer carne.',
              'Dejé de correr.',
              'Dejé de ver series hasta tarde.',
              'Dejé de ver series.',
              'Dejé de trabajar los sábados.',
              'Dejé de usar el celular por la noche.',
              'Dejé de fumar.',
            ],
            ['es-deje-de'],
            { id: 'es.ex.bjhdjy7grrjti2' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Empecé a…',
        objective: 'Tell how you started a new hobby and sign up for an activity.',
        intro: {
          explanation:
            'Empezar a + infinitive means to start doing something: empecé a pintar en enero. In the yo form of the preterite, z changes to c before e: empecé (but empezaste, empezó). In the present it changes e to ie: empiezo, empiezas. Inscribirse en means to sign up for: me inscribí en un equipo, quiero inscribirme en una clase. Now put the whole unit together: suelo + infinitive for habits, llevo + time + gerund for how long, sigo + gerund for what continues, and dejé de, volví a and empecé a for the changes in your life.',
          examples: [
            {
              target: 'Empecé a pintar en enero y ya no me aburro los domingos.',
              base: 'I started painting in January and I don’t get bored on Sundays any more.',
            },
            {
              target: 'Me inscribí en un equipo de vóleibol.',
              base: 'I signed up for a volleyball team.',
            },
          ],
        },
        takeaways: [
          'You say when you started something with empecé a + infinitive.',
          'You sign up for a class or a team with inscribirse en (me inscribí en…).',
        ],
        exercises: [
          ex.translationChoice(
            'empecé a',
            'I started (to)',
            ['I stopped (doing)', 'I tried to', 'I … again'],
            ['es-empece-a'],
            { id: 'es.ex.6g36rtgevyzftu' },
          ),
          ex.fillBlank(
            '___ a pintar en enero.',
            'I started painting in January.',
            'Empecé',
            ['Empezó', 'Empiezo', 'Dejé'],
            ['es-empece-a', 'es-pintar'],
            {
              id: 'es.ex.p7yk8tyntuuxd3',
              explanation:
                'Empezar a + infinitive. In the yo form of the preterite, z changes to c before e: empecé. Empezó is él / ella and empiezo is the present. Dejé needs de: dejé de pintar.',
            },
          ),
          ex.fillBlank(
            'Quiero ___ en una clase de natación.',
            'I want to sign up for a swimming class.',
            'inscribirme',
            ['inscribirse', 'inscribí', 'inscribe'],
            ['es-inscribirse'],
            {
              id: 'es.ex.v7j83zlbqoexws',
              explanation:
                'Inscribirse is reflexive. After quiero, the pronoun matches yo and is attached to the infinitive: quiero inscribirme.',
            },
          ),
          ex.listenChoice(
            'Me inscribí en un equipo de vóleibol.',
            [
              'Me inscribí en un equipo de fútbol.',
              'Quiero inscribirme en un equipo de vóleibol.',
              'Me inscribí en una clase de vóleibol.',
            ],
            ['es-inscribirse', 'es-el-equipo'],
            { id: 'es.ex.gzdfvgf5cmivkf' },
          ),
          question(
            'es.ex.eujdoc0yg6tll3',
            CENTRO,
            'How can you sign up at the cultural center?',
            'At the reception, before 15 January',
            ['Online, at any time', 'By phone, after the first class', 'At the swimming pool'],
            ['es-inscribirse'],
            'The ad says “La primera clase es gratis. Inscríbete en la recepción antes del 15 de enero”.',
          ),
          question(
            'es.ex.5z91w3ksxov9rq',
            FORO,
            'What did Gabriel start doing again?',
            'Playing the guitar',
            ['Painting', 'Playing volleyball', 'Watching series'],
            ['es-volvi-a'],
            'Gabriel writes “Yo volví a tocar la guitarra después de diez años”.',
          ),
          question(
            'es.ex.khi8us9rui6taf',
            FORO,
            'What did Renata stop doing?',
            'Watching series until late',
            ['Playing volleyball', 'Going out at weekends', 'Painting on Sundays'],
            ['es-deje-de', 'es-inscribirse'],
            'Renata writes “Dejé de ver series hasta tarde y me inscribí en un equipo de vóleibol”.',
          ),
          question(
            'es.ex.s6wqnl2myyu9n4',
            FORO,
            'How does painting make Ximena feel?',
            'Very relaxed',
            ['Bored on Sundays', 'Tired', 'Nervous'],
            ['es-empece-a', 'es-pintar', 'es-relajarse'],
            'Ximena writes “Empecé a pintar en enero. Ahora pinto todos los domingos y me relajo mucho”.',
          ),
          ex.translateWrite(
            'I started painting two years ago, and I’m still painting.',
            'Empecé a pintar hace dos años y sigo pintando.',
            ['es-empece-a', 'es-sigo', 'es-pintar'],
            {
              id: 'es.ex.5ddzlaqybddz9v',
              acceptedAnswers: [
                'Empecé a pintar hace dos años, y sigo pintando.',
                'Empecé a pintar hace dos años y todavía pinto.',
                'Hace dos años empecé a pintar y sigo pintando.',
                'Hace dos años que empecé a pintar y sigo pintando.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué pasatiempo empezaste este año?',
            'Answer with «Empecé a + infinitive».',
            'Empecé a correr.',
            [
              'Empecé a correr',
              'Este año empecé a correr.',
              'Empecé a pintar.',
              'Empecé a nadar.',
              'Empecé a correr en el parque.',
              'Empecé a tocar la guitarra.',
              'Empecé a ir al gimnasio.',
              'Empecé a estudiar español.',
              'Empecé a cocinar.',
            ],
            ['es-empece-a', 'es-el-pasatiempo'],
            { id: 'es.ex.mpgbsni0fjmigh' },
          ),
        ],
      },
    ],
  },
};

const common = (minSentences: number): WritingRequirement[] => [
  {
    id: 'sentences',
    label: `You write at least ${minSentences} sentences`,
    kind: 'min_sentences',
    min: minSentences,
  },
  { id: 'capital', label: 'Each sentence starts with a capital letter', kind: 'capital_start' },
  {
    id: 'punctuation',
    label: 'You end with a full stop, an exclamation mark or a question mark',
    kind: 'end_punctuation',
  },
];

const base = { language: 'es', allowInvented: true as const, maxChars: 1500 };

/** Gerundios frecuentes de la unidad y de A2. */
const GERUNDIOS =
  'pintando|corriendo|nadando|entrenando|jugando|estudiando|tocando|bailando|cocinando|leyendo|viviendo|trabajando|haciendo|caminando|aprendiendo|tomando|soñando';

/** Tareas de escritura de la unidad (docs/ES_B1.md). */
export const ES_B1_U02_WRITING: readonly WritingTaskDef[] = [
  {
    ...base,
    id: 'es.b1.wt.pasatiempo',
    kind: 'guided',
    codes: [],
    lesson: 'es-b1-u02-l05',
    title: 'My hobby',
    instructions:
      'Write about one of your hobbies (real or invented): what it is, how long you have been doing it (llevo + time + gerund), what you usually do (suelo + infinitive), and something you stopped, started or did again (dejé de, empecé a, volví a).',
    prompts: ['¿Cuál es tu pasatiempo?', '¿Desde cuándo lo haces?'],
    requirements: [
      {
        id: 'llevo',
        label: 'You say how long with llevo + time + gerund (llevo dos años pintando…)',
        kind: 'pattern',
        patterns: [['llevo|llevas|lleva|llevamos|llevan', '<WORD>', '<WORD>', GERUNDIOS]],
      },
      {
        id: 'soler',
        label: 'You say what you usually do with suelo + infinitive (suelo entrenar…)',
        kind: 'pattern',
        patterns: [['suelo|sueles|suele|solemos|suelen', '<WORD>']],
      },
      {
        id: 'since',
        label: 'You use desde hace or hace… que (pinto desde hace un año…)',
        kind: 'pattern',
        patterns: [
          ['desde', 'hace'],
          ['hace', '<WORD>', '<WORD>', 'que'],
        ],
      },
      ...common(5),
    ],
    model:
      'Mi pasatiempo favorito es nadar. Llevo cuatro años nadando en un equipo de Guadalajara. Suelo entrenar tres veces por semana, antes del trabajo. El año pasado dejé de entrenar dos meses por una lesión, pero después volví a nadar. También pinto desde hace un año: cuando pinto, me relajo mucho. ¡Nunca me aburro los fines de semana!',
    checklist: [
      'I use llevo + time + gerund (llevo cuatro años nadando) for something I still do.',
      'I use suelo + infinitive for my habits, and desde hace with the present.',
      'I use the preterite for changes: dejé de, volví a, empecé a.',
    ],
  },
];
