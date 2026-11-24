import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U16 «Weather and seasons» (docs/ES_A1_A2.md): el tiempo con hace (hace calor, hace frío,
 * hace buen tiempo), llueve, nieva, hay sol, hay viento; ¿qué tiempo hace? / ¿cómo está el clima? Las
 * estaciones con artículo (el verano, en invierno), que dependen del hemisferio (diciembre es verano en
 * Chile y la Argentina, invierno en México y España). Español neutro de Latinoamérica (tú y ustedes):
 * ¿prefieres…? Lugares variados (Bogotá, Cartagena, Ciudad de México, Bariloche, Viña del Mar).
 * Comparaciones: más… que, menos… que y tan… como (en el apoyo). Pronunciación: la entonación de ¡qué calor!, el ritmo
 * silábico (llue-ve) y los pares calor / color y mar / mal / más.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const LLAMADA = dialogue(
  'es.stim.a1-u16-llamada',
  'In July, Martín, who lives in Mexico City, calls his friend Valentina, who is on holiday in Bariloche, in the south of Argentina.',
  [
    ['Martín', '¡Hola, Valentina! ¿Qué tiempo hace en Bariloche?'],
    ['Valentina', '¡Hace mucho frío! Hoy nieva. ¿Y en México?'],
    ['Martín', 'Acá es verano, pero llueve mucho.'],
    ['Valentina', '¿Y hace frío?'],
    ['Martín', 'Un poco, pero hace menos frío que en Bariloche.'],
    ['Valentina', '¡Me encanta el invierno en la montaña!'],
  ],
  ES_A1_RATE,
);

const POSTAL = reading(
  'es.stim.a1-u16-postal',
  'postcard',
  'In January, Camila sends a postcard to her friend Diego from the seaside in Chile.',
  [
    '¡Hola, Diego!',
    'Estoy en Viña del Mar con mi familia.',
    'Es enero y hace mucho calor.',
    'Hay sol todos los días.',
    'Por la mañana vamos a la playa.',
    '¡El mar es más lindo que la ciudad!',
    'Hasta luego, Camila',
  ],
  { from: 'Camila', to: 'Diego' },
);

export const ES_A1_U16: EsUnitDef = {
  names: [
    'Bariloche',
    'Buenos Aires',
    'Ciudad de México',
    'México',
    'Chile',
    'Santiago',
    'Bogotá',
    'Cartagena',
    'Viña del Mar',
    'Martín',
    'Valentina',
    'Camila',
    'Diego',
  ],
  support: ['acá', 'mal', 'tan', 'sur', 'norte', 'clima'],
  unit: {
    position: 16,
    title: 'Weather and seasons',
    titleEn: 'El clima',
    description:
      'Talk about the weather with hace, llueve and hay sol, name the seasons (and see why they depend on the hemisphere) and compare places with más… que and menos… que.',
    emoji: '🌦️',
    objective:
      'You can ask and say what the weather is like, name the seasons, say what you prefer (the sea or the mountains) and compare places with más… que and menos… que.',
    grammar: {
      title: 'Hace calor · más… que',
      explanation:
        'For most weather Spanish uses hace (literally “it makes”): hace calor (it’s hot), hace frío (it’s cold), hace buen tiempo (the weather is nice). Calor and frío are nouns, so “very” is mucho: hace mucho frío. Rain and snow have their own verbs: llueve, nieva. For sun and wind use hay: hay sol, hay viento. To ask: ¿qué tiempo hace? (in many countries also ¿cómo está el clima?). Seasons take the article (el verano, el invierno, la primavera, el otoño), but after en you can drop it: en verano. Seasons depend on the hemisphere: in Mexico and Spain julio is summer and diciembre is winter; in Chile and Argentina it is the other way round. Near the equator (Colombia, Ecuador) the temperature hardly changes during the year, and people talk about rainy and dry seasons instead. To compare: más + adjective or noun + que (more… than), menos… que (less… than) and tan… como (as… as).',
      examples: [
        {
          target: '¿Qué tiempo hace? — Hace frío y llueve.',
          base: 'What’s the weather like? — It’s cold and raining.',
        },
        {
          target: 'En julio es invierno en Chile y verano en México.',
          base: 'In July it’s winter in Chile and summer in Mexico.',
        },
        {
          target: 'En Bariloche hace más frío que en Buenos Aires.',
          base: 'It’s colder in Bariloche than in Buenos Aires.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U16), convertido al español neutro de Latinoamérica con tú (2026-11-21). Sin revisión nativa: revisar «hay sol» frente a «hace sol» (se aceptan los dos), «¿cómo está el clima?» como pregunta coloquial frecuente en Latinoamérica (en rigor, el clima es el clima y el tiempo, el tiempo), la temporada de lluvias de julio en la Ciudad de México y las estaciones según el hemisferio. Se usa «acá» (latinoamericano general, ya enseñado). «Tan… como» se presenta con tan en el apoyo.',
    },
    words: [
      w(
        'es-que-tiempo-hace',
        '¿qué tiempo hace?',
        "what's the weather like?",
        '¿Qué tiempo hace en Bogotá?',
        'What’s the weather like in Bogotá?',
        ['weather', 'questions'],
        { acceptedTranslations: ['what is the weather like?', "how's the weather?"] },
      ),
      w(
        'es-hace-calor',
        'hace calor',
        "it's hot",
        'En la playa hace mucho calor.',
        'It’s very hot at the beach.',
        ['weather'],
        { acceptedTranslations: ['it is hot'], emoji: '🥵' },
      ),
      w(
        'es-hace-frio',
        'hace frío',
        "it's cold",
        'En invierno hace frío.',
        'It’s cold in winter.',
        ['weather'],
        { acceptedTranslations: ['it is cold'], emoji: '🥶' },
      ),
      w(
        'es-hace-buen-tiempo',
        'hace buen tiempo',
        'the weather is nice',
        'Hoy hace buen tiempo.',
        'The weather is nice today.',
        ['weather'],
        { acceptedTranslations: ["it's nice out", 'the weather is good'] },
      ),
      w(
        'es-llueve',
        'llueve',
        "it's raining",
        'Hoy llueve mucho.',
        'It’s raining a lot today.',
        ['weather'],
        { acceptedTranslations: ['it rains'], emoji: '🌧️' },
      ),
      w(
        'es-nieva',
        'nieva',
        "it's snowing",
        'En Bariloche nieva en invierno.',
        'It snows in Bariloche in winter.',
        ['weather'],
        { acceptedTranslations: ['it snows'], emoji: '🌨️' },
      ),
      w('es-el-sol', 'el sol', 'the sun', 'Hoy hay sol.', 'It’s sunny today.', ['weather'], {
        acceptedTranslations: ['sun'],
        emoji: '☀️',
      }),
      w(
        'es-el-viento',
        'el viento',
        'the wind',
        'Hay mucho viento en la playa.',
        'It’s very windy at the beach.',
        ['weather'],
        { acceptedTranslations: ['wind'], emoji: '💨' },
      ),
      w(
        'es-la-lluvia',
        'la lluvia',
        'the rain',
        'Me gusta la lluvia.',
        'I like the rain.',
        ['weather'],
        { acceptedTranslations: ['rain'] },
      ),
      w(
        'es-la-primavera',
        'la primavera',
        'spring',
        'En primavera hace buen tiempo.',
        'The weather is nice in spring.',
        ['seasons'],
        { acceptedTranslations: ['the spring'], emoji: '🌸' },
      ),
      w(
        'es-el-verano',
        'el verano',
        'summer',
        'En Chile, enero es verano.',
        'In Chile, January is summer.',
        ['seasons'],
        { acceptedTranslations: ['the summer'] },
      ),
      w(
        'es-el-otono',
        'el otoño',
        'autumn',
        'En otoño llueve mucho.',
        'It rains a lot in autumn.',
        ['seasons'],
        { acceptedTranslations: ['fall', 'the autumn'], emoji: '🍂' },
      ),
      w(
        'es-el-invierno',
        'el invierno',
        'winter',
        'En invierno voy a la montaña.',
        'In winter I go to the mountains.',
        ['seasons'],
        { acceptedTranslations: ['the winter'], emoji: '⛄' },
      ),
      w('es-el-mar', 'el mar', 'the sea', 'Me encanta el mar.', 'I love the sea.', ['places'], {
        acceptedTranslations: ['the ocean'],
        emoji: '🌊',
      }),
      w(
        'es-la-montana',
        'la montaña',
        'the mountains',
        'Prefiero la montaña.',
        'I prefer the mountains.',
        ['places'],
        { acceptedTranslations: ['the mountain'], emoji: '⛰️' },
      ),
      w(
        'es-la-playa',
        'la playa',
        'the beach',
        'Vamos a la playa en verano.',
        'We go to the beach in summer.',
        ['places'],
        { emoji: '🏖️' },
      ),
      w(
        'es-mas-que',
        'más… que',
        'more… than',
        'En Bogotá hace más frío que en Cartagena.',
        'It’s colder in Bogotá than in Cartagena.',
        ['comparisons'],
      ),
      w(
        'es-menos-que',
        'menos… que',
        'less… than',
        'Mi perro es menos lindo que tu gato.',
        'My dog is less cute than your cat.',
        ['comparisons'],
        { acceptedTranslations: ['fewer… than'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿Qué tiempo hace?',
        objective: 'Ask about the weather and say if it is hot, cold or nice.',
        intro: {
          explanation:
            'For the weather Spanish uses hace: hace calor (it’s hot), hace frío (it’s cold), hace buen tiempo (the weather is nice). To ask: ¿qué tiempo hace? Calor and frío are nouns, so you say hace mucho calor (not muy). In an exclamation like ¡qué calor! the voice starts high and falls. Careful with the vowels: calor (heat) is not color.',
          examples: [
            {
              target: '¿Qué tiempo hace hoy? — Hace calor.',
              base: 'What’s the weather like today? — It’s hot.',
            },
            { target: '¡Qué frío! Hace mucho frío.', base: 'So cold! It’s very cold.' },
          ],
        },
        takeaways: [
          'You ask ¿qué tiempo hace? and answer with hace calor, hace frío or hace buen tiempo.',
          'You say “very hot” with mucho: hace mucho calor.',
        ],
        exercises: [
          ex.translationChoice(
            'hace calor',
            "it's hot",
            ["it's cold", 'the weather is nice', "it's raining"],
            ['es-hace-calor'],
            { id: 'es.ex.8bl1v0jrn9tvzt' },
          ),
          ex.matchPairs(
            [
              ['¿qué tiempo hace?', "what's the weather like?"],
              ['hace calor', "it's hot"],
              ['hace frío', "it's cold"],
              ['hace buen tiempo', 'the weather is nice'],
            ],
            ['es-que-tiempo-hace', 'es-hace-calor', 'es-hace-frio', 'es-hace-buen-tiempo'],
            { id: 'es.ex.fqqz4una54ai6v' },
          ),
          ex.listenChoice('calor', ['color', 'caro'], ['es-hace-calor'], {
            id: 'es.ex.3tdd63p34glm41',
            explanation:
              'Spanish vowels never change: ca-lor has an a, co-lor has an o, and caro has no l.',
          }),
          ex.fillBlank(
            'Hoy hace mucho ___.',
            'It’s very cold today.',
            'frío',
            ['calor', 'buen'],
            ['es-hace-frio'],
            {
              id: 'es.ex.y54r3wouomui04',
              skill: 'vocabulary',
              explanation: 'Cold is frío: hace mucho frío.',
            },
          ),
          ex.fillBlank(
            'Hace ___ calor.',
            'It’s very hot.',
            'mucho',
            ['muy', 'mucha', 'bien'],
            ['es-hace-calor'],
            {
              id: 'es.ex.5ocfwblemj61v1',
              explanation:
                'Calor is a masculine noun, so you say mucho calor, not muy calor (muy goes with adjectives).',
            },
          ),
          ex.listenChoice(
            '¡Qué calor!',
            ['¡Qué frío!', '¿Qué tiempo hace?', '¡Qué color!'],
            ['es-hace-calor', 'es-hace-frio'],
            { id: 'es.ex.csx7e0341xs3gb' },
          ),
          ex.fillBlank(
            '¿Qué tiempo ___ hoy?',
            'What’s the weather like today?',
            'hace',
            ['es', 'tiene', 'está'],
            ['es-que-tiempo-hace'],
            {
              id: 'es.ex.etsnmamivuuyfz',
              explanation: 'Weather questions use hacer: ¿qué tiempo hace?',
            },
          ),
          ex.orderWords(
            'Hoy hace buen tiempo.',
            'The weather is nice today.',
            ['es-hace-buen-tiempo'],
            {
              id: 'es.ex.qt7bsu40i1atoz',
            },
          ),
          ex.translateWrite("It's very cold today.", 'Hoy hace mucho frío.', ['es-hace-frio'], {
            id: 'es.ex.26upvb6j9j9tle',
            acceptedAnswers: ['Hace mucho frío hoy.'],
          }),
          ex.shortAnswer(
            '¿Qué tiempo hace hoy?',
            'Say it is hot (use «Hace…»).',
            'Hace calor.',
            ['Hoy hace calor.', 'Hace mucho calor.', 'Hoy hace mucho calor.'],
            ['es-que-tiempo-hace', 'es-hace-calor'],
            { id: 'es.ex.5y3mfz2ik2xbmz' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Llueve, hay sol',
        objective: 'Talk about rain, snow, sun and wind.',
        intro: {
          explanation:
            'Rain and snow have their own verbs: llueve (it’s raining), nieva (it’s snowing). For sun and wind use hay: hay sol, hay viento (you’ll also hear hace sol). La lluvia is the rain. The ll of llueve and lluvia sounds like the y in English yes. Spanish has an even rhythm: every syllable gets about the same time, llue-ve, llu-via.',
          examples: [
            { target: 'Hoy llueve mucho.', base: 'It’s raining a lot today.' },
            { target: 'Hay sol, pero hace frío.', base: 'It’s sunny, but it’s cold.' },
          ],
        },
        takeaways: [
          'You say llueve and nieva for rain and snow.',
          'You say hay sol and hay viento for sun and wind.',
        ],
        exercises: [
          ex.translationChoice(
            'llueve',
            "it's raining",
            ["it's snowing", "it's hot", 'the wind'],
            ['es-llueve'],
            { id: 'es.ex.uhq3wc7y2qvftx' },
          ),
          ex.matchPairs(
            [
              ['el sol', 'the sun'],
              ['el viento', 'the wind'],
              ['la lluvia', 'the rain'],
              ['nieva', "it's snowing"],
            ],
            ['es-el-sol', 'es-el-viento', 'es-la-lluvia', 'es-nieva'],
            { id: 'es.ex.08ucjt4hj49z99' },
          ),
          ex.listenChoice(
            'Hoy llueve.',
            ['Hoy nieva.', 'Hoy hay sol.', 'Hoy hace frío.'],
            ['es-llueve', 'es-nieva'],
            { id: 'es.ex.6eo404trpr9q1u' },
          ),
          ex.fillBlank(
            'Hoy ___ sol.',
            'It’s sunny today.',
            'hay',
            ['es', 'está', 'tiene'],
            ['es-el-sol'],
            {
              id: 'es.ex.5tgc5owulu1x67',
              explanation:
                'Hay sol = it’s sunny (literally “there is sun”). You can also say hace sol.',
            },
          ),
          ex.translationChoice(
            'la lluvia',
            'the rain',
            ['the wind', 'the sun', "it's raining"],
            ['es-la-lluvia'],
            { id: 'es.ex.fxe1q0bz16wacr' },
          ),
          ex.fillBlank(
            'En Bariloche ___ mucho.',
            'It snows a lot in Bariloche.',
            'nieva',
            ['llueve', 'hay'],
            ['es-nieva', 'es-llueve'],
            {
              id: 'es.ex.omx70fo8z9hwmw',
              skill: 'vocabulary',
              explanation: 'Nieva is it snows; llueve is it rains.',
            },
          ),
          ex.listenChoice(
            'Hay mucho viento.',
            ['Hay mucho sol.', 'Hace mucho frío.', 'Hay mucha lluvia.'],
            ['es-el-viento', 'es-el-sol'],
            { id: 'es.ex.lgh1ja9mbxq9m1' },
          ),
          ex.orderWords('No me gusta la lluvia.', 'I don’t like the rain.', ['es-la-lluvia'], {
            id: 'es.ex.3luc44ntcuxdkq',
          }),
          ex.translateWrite(
            "It's sunny, but it's cold.",
            'Hay sol, pero hace frío.',
            ['es-el-sol', 'es-hace-frio'],
            { id: 'es.ex.c0uuti0vxzl5jx', acceptedAnswers: ['Hace sol, pero hace frío.'] },
          ),
          ex.shortAnswer(
            '¿Qué tiempo hace hoy?',
            'Say it is raining and windy (use «Llueve y hay…»).',
            'Llueve y hay viento.',
            [
              'Hoy llueve y hay viento.',
              'Llueve y hace viento.',
              'Hoy llueve y hace viento.',
              'Llueve y hay mucho viento.',
            ],
            ['es-llueve', 'es-el-viento'],
            { id: 'es.ex.82mclh42uixrur' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Las estaciones',
        objective: 'Name the seasons and say when they are in different countries.',
        intro: {
          explanation:
            'The seasons take the article: el verano, el otoño, el invierno, la primavera. After en you can drop it: en verano, en invierno. The seasons depend on the hemisphere. In the north (Mexico, Spain, the US) enero is winter and julio is summer. In the south (Chile, Argentina, Uruguay) it is the other way round: enero is summer and julio is winter, so spring starts in septiembre. Near the equator, in Colombia or Ecuador, people talk more about the rainy and the dry season. The ñ in otoño sounds like the ny in canyon.',
          examples: [
            {
              target: 'En enero es verano en Chile.',
              base: 'In January it’s summer in Chile.',
            },
            { target: 'En invierno hace frío.', base: 'It’s cold in winter.' },
          ],
        },
        takeaways: [
          'You know the four seasons with their article.',
          'You know that the seasons depend on the hemisphere: enero is summer in Chile and winter in Mexico.',
        ],
        exercises: [
          ex.translationChoice(
            'el invierno',
            'winter',
            ['summer', 'spring', 'autumn'],
            ['es-el-invierno'],
            { id: 'es.ex.4jdodj64r07rnt' },
          ),
          ex.matchPairs(
            [
              ['la primavera', 'spring'],
              ['el verano', 'summer'],
              ['el otoño', 'autumn'],
              ['el invierno', 'winter'],
            ],
            ['es-la-primavera', 'es-el-verano', 'es-el-otono', 'es-el-invierno'],
            { id: 'es.ex.l9t1pal8yn2w6n' },
          ),
          ex.fillBlank(
            'En Santiago, enero es ___.',
            'In Santiago (Chile), January is summer.',
            'verano',
            ['invierno', 'otoño', 'primavera'],
            ['es-el-verano'],
            {
              id: 'es.ex.rjb50kifbk6e8u',
              skill: 'vocabulary',
              explanation:
                'Santiago de Chile is in the southern hemisphere, so January is summer and July is winter. In Mexico City it would be invierno.',
            },
          ),
          ex.listenChoice(
            'En invierno nieva.',
            ['En invierno llueve.', 'En verano nieva.', 'En invierno hace frío.'],
            ['es-el-invierno', 'es-nieva'],
            { id: 'es.ex.k2ovspl9cyfhom' },
          ),
          ex.translationChoice(
            'el otoño',
            'autumn',
            ['spring', 'winter', 'the rain'],
            ['es-el-otono'],
            { id: 'es.ex.qw5nm8bmxs6s7g' },
          ),
          ex.fillBlank(
            'Me gusta ___ primavera.',
            'I like spring.',
            'la',
            ['el', 'las', 'los'],
            ['es-la-primavera'],
            {
              id: 'es.ex.vxd06o7kv7bbnu',
              explanation: 'Primavera is feminine: la primavera. The other seasons are masculine.',
            },
          ),
          ex.listenChoice(
            'Me encanta el verano.',
            ['Me encanta el invierno.', 'Me gusta el verano.', 'Odio el verano.'],
            ['es-el-verano', 'es-el-invierno'],
            { id: 'es.ex.vkaoaa7ytknxpt' },
          ),
          ex.orderWords(
            'En otoño llueve mucho.',
            'It rains a lot in autumn.',
            ['es-el-otono', 'es-llueve'],
            {
              id: 'es.ex.vdajf76d37nhd3',
            },
          ),
          ex.translateWrite(
            'In July it is winter in Chile.',
            'En julio es invierno en Chile.',
            ['es-el-invierno'],
            {
              id: 'es.ex.mwbx5eb569k6hv',
              acceptedAnswers: [
                'En Chile, julio es invierno.',
                'En Chile julio es invierno.',
                'En Chile en julio es invierno.',
                'En Chile, en julio es invierno.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Te gusta el invierno?',
            'Say no, you prefer summer (use «No, prefiero…»).',
            'No, prefiero el verano.',
            ['No. Prefiero el verano.', 'No, yo prefiero el verano.', 'No, me gusta el verano.'],
            ['es-el-verano', 'es-el-invierno'],
            { id: 'es.ex.a1ahbz8nuqpnx9' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Más… que, menos… que',
        objective: 'Compare places and say where you prefer to go.',
        intro: {
          explanation:
            'To compare: más + word + que (more… than) and menos + word + que (less… than): en Bogotá hace más frío que en Cartagena (Bogotá is high in the mountains; Cartagena is on the Caribbean coast). To say two things are equal: tan + adjective + como (as… as). To ask a friend what they prefer: ¿prefieres el mar o la montaña? (preferir changes e to ie: prefiero, prefieres). Listen to the ends of mar (sea), mal (bad) and más (more).',
          examples: [
            {
              target: 'En Bogotá hace más frío que en Cartagena.',
              base: 'It’s colder in Bogotá than in Cartagena.',
            },
            {
              target: 'La playa es tan linda como la montaña.',
              base: 'The beach is as nice as the mountains.',
            },
          ],
        },
        takeaways: [
          'You compare with más… que, menos… que and tan… como.',
          'You talk about the sea, the beach and the mountains.',
        ],
        exercises: [
          ex.translationChoice(
            'la playa',
            'the beach',
            ['the sea', 'the mountains', 'the city'],
            ['es-la-playa'],
            { id: 'es.ex.cz3pfw60okfp8q' },
          ),
          ex.matchPairs(
            [
              ['el mar', 'the sea'],
              ['la montaña', 'the mountains'],
              ['la playa', 'the beach'],
              ['más… que', 'more… than'],
            ],
            ['es-el-mar', 'es-la-montana', 'es-la-playa', 'es-mas-que'],
            { id: 'es.ex.sikt702h4kr1m0' },
          ),
          ex.fillBlank(
            'En Bogotá hace ___ frío que en Cartagena.',
            'It’s colder in Bogotá than in Cartagena.',
            'más',
            ['menos', 'muy', 'mucho'],
            ['es-mas-que', 'es-hace-frio'],
            {
              id: 'es.ex.k012zrxs7yqpuh',
              explanation: 'Colder than = más frío que. Menos frío que would be less cold.',
            },
          ),
          ex.listenChoice('mar', ['mal', 'más'], ['es-el-mar'], {
            id: 'es.ex.1idhh5mdehfcvy',
            explanation: 'Mar ends in a tapped r, mal in an l and más in an s.',
          }),
          ex.fillBlank(
            'En el norte hace ___ frío que en el sur.',
            'It’s less cold in the north than in the south.',
            'menos',
            ['más', 'muy', 'mucho'],
            ['es-menos-que', 'es-hace-frio'],
            {
              id: 'es.ex.fdvrn2qfrs37k8',
              explanation:
                'Less… than = menos… que. In Chile or Argentina the south is colder than the north (in Mexico or Spain it is usually the other way round).',
            },
          ),
          ex.fillBlank(
            'La playa es ___ linda como la montaña.',
            'The beach is as nice as the mountains.',
            'tan',
            ['más', 'menos', 'muy'],
            ['es-la-playa', 'es-la-montana'],
            {
              id: 'es.ex.cwishsdpow9tvk',
              explanation: 'As… as = tan… como. With más or menos you need que, not como.',
            },
          ),
          ex.listenChoice(
            'Vamos a la playa.',
            ['Vamos a la montaña.', 'Voy a la playa.', 'Van a la playa.'],
            ['es-la-playa', 'es-la-montana'],
            { id: 'es.ex.od502wgm71be5b' },
          ),
          ex.orderWords(
            'El mar es más lindo que la ciudad.',
            'The sea is nicer than the city.',
            ['es-el-mar', 'es-mas-que'],
            {
              id: 'es.ex.7r4lukpvn6ce3e',
            },
          ),
          ex.translateWrite(
            'In winter I go to the mountains.',
            'En invierno voy a la montaña.',
            ['es-la-montana', 'es-el-invierno'],
            {
              id: 'es.ex.mh9fd87mrbx2kp',
              acceptedAnswers: [
                'En el invierno voy a la montaña.',
                'Voy a la montaña en invierno.',
                'Yo voy a la montaña en invierno.',
                'En invierno yo voy a la montaña.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Prefieres el mar o la montaña?',
            'Say you prefer the sea (use «Prefiero…»).',
            'Prefiero el mar.',
            ['Yo prefiero el mar.', 'Prefiero el mar, gracias.'],
            ['es-el-mar', 'es-la-montana'],
            { id: 'es.ex.qy6vn6pnzobdn8' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '¿Cómo está el clima?',
        objective: 'Understand the weather in a phone call and a postcard.',
        intro: {
          explanation:
            'In much of Latin America you’ll also hear ¿cómo está el clima? for “what’s the weather like?” (strictly, el clima is the climate and el tiempo the weather). Put it together: hace calor or frío, llueve, nieva, hay sol, and compare places with más… que. Remember: when it is summer in Mexico or Spain, it is winter in Chile and Argentina.',
          examples: [
            {
              target: 'En Cartagena hace calor y hay sol.',
              base: 'In Cartagena it’s hot and sunny.',
            },
            {
              target: 'En Bariloche nieva más que en Santiago.',
              base: 'It snows more in Bariloche than in Santiago.',
            },
          ],
        },
        takeaways: [
          'You understand the weather in a conversation and a postcard.',
          'You describe the day and compare two places.',
        ],
        exercises: [
          question(
            'es.ex.bruse39evo13ao',
            POSTAL,
            'Where is Camila?',
            'At the beach in Viña del Mar, with her family',
            ['In the mountains in Bariloche', 'At home in Santiago', 'In the city, at work'],
            ['es-la-playa', 'es-el-mar'],
            'She writes “Estoy en Viña del Mar con mi familia” and “vamos a la playa”. In January it is summer in Chile.',
          ),
          question(
            'es.ex.9t2297fqybsy4m',
            POSTAL,
            'What is the weather like?',
            'Very hot and sunny',
            ['Cold and rainy', 'Windy and cold', 'It’s snowing'],
            ['es-hace-calor', 'es-el-sol'],
            'She writes “hace mucho calor” and “Hay sol todos los días”.',
          ),
          question(
            'es.ex.c22goftzilpcrp',
            POSTAL,
            'What does Camila think of the sea?',
            'It is nicer than the city',
            ['It is less nice than the city', 'It is too cold', 'She doesn’t like it'],
            ['es-mas-que', 'es-el-mar'],
            'She writes “¡El mar es más lindo que la ciudad!”.',
          ),
          question(
            'es.ex.morhnc7pf1i0q2',
            LLAMADA,
            'What is the weather like in Bariloche?',
            'Very cold, and it’s snowing',
            ['Hot and sunny', 'It’s raining', 'Nice and warm'],
            ['es-hace-frio', 'es-nieva'],
            'Valentina says “¡Hace mucho frío! Hoy nieva”.',
          ),
          question(
            'es.ex.qfj1d6o8e4j515',
            LLAMADA,
            'What is the weather like in Mexico City?',
            'It’s raining',
            ['It’s snowing', 'It’s very cold', 'It’s windy'],
            ['es-llueve'],
            'Martín says “Acá es verano, pero llueve mucho”: July is summer, and the rainy season, in Mexico City.',
          ),
          question(
            'es.ex.w80fhinvvcu0ke',
            LLAMADA,
            'Where is it colder?',
            'In Bariloche',
            ['In Mexico City', 'It’s the same', 'We can’t tell'],
            ['es-menos-que'],
            'Martín says “hace menos frío que en Bariloche”: Mexico City is less cold.',
          ),
          ex.listenChoice(
            'En verano hace más calor que en primavera.',
            [
              'En verano hace menos calor que en primavera.',
              'En invierno hace más frío que en otoño.',
              'En verano hace más calor que en otoño.',
            ],
            ['es-mas-que', 'es-el-verano', 'es-menos-que'],
            { id: 'es.ex.4a57iir3sp2xjt' },
          ),
          ex.fillBlank(
            '¡Qué ___ hace hoy! Hay mucho sol.',
            'It’s so hot today! It’s very sunny.',
            'calor',
            ['frío', 'lluvia', 'viento'],
            ['es-hace-calor', 'es-el-sol'],
            {
              id: 'es.ex.lhr4flfw8n6ri4',
              skill: 'vocabulary',
              explanation:
                '¡Qué calor hace! = it’s so hot! In an exclamation the voice falls at the end.',
            },
          ),
          ex.translateWrite(
            "It's colder in the mountains than at the beach.",
            'En la montaña hace más frío que en la playa.',
            ['es-mas-que', 'es-la-montana', 'es-la-playa'],
            {
              id: 'es.ex.f5l1nhb6sknmoe',
              acceptedAnswers: ['Hace más frío en la montaña que en la playa.'],
            },
          ),
          ex.shortAnswer(
            '¿Cómo está el clima?',
            'Say the weather is nice and sunny (use «Hace buen tiempo y…»).',
            'Hace buen tiempo y hay sol.',
            ['Hace buen tiempo y hace sol.', 'Hoy hace buen tiempo y hay sol.'],
            ['es-hace-buen-tiempo', 'es-el-sol'],
            { id: 'es.ex.1pb6mq1daadpps' },
          ),
        ],
      },
    ],
  },
};
