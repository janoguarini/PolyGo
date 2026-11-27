import type { B2UnitDef } from '../../b2';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from '../b1/helpers';

/**
 * B2 U11 «Narrativas, literatura y expresiones idiomáticas» (docs/B2_EN.md): hablar de libros (novel,
 * plot, character, twist), contar una historia con estilo: oraciones con participio (Walking home,
 * … / Having missed the train, …) e inversión narrativa (Never had I…, Hardly had… when…, No sooner…
 * than…, Little did I know…); expresiones idiomáticas frecuentes (break the ice, out of the blue, a
 * piece of cake, the last straw, once in a blue moon).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const BOOK_CLUB = dialogue(
  'en.stim.b2-u11-book-club',
  'Dos amigas comentan una novela en su club de lectura.',
  [
    ['Julia', 'So, did you finish the novel?'],
    ['Nora', "Last night. I couldn't stop reading. The plot is so clever."],
    ['Julia', "I know! And that twist in the last chapter… I didn't see it coming at all."],
    ['Nora', 'Neither did I. It turns out that the narrator was lying to us from the start.'],
    ['Julia', 'Exactly. Looking back, the clues were all there, but I trusted her completely.'],
    [
      'Nora',
      'My favorite character was the old fisherman, though. He hardly says anything, but every word matters.',
    ],
    ['Julia', 'Same here. Shall we choose another book by her for next month?'],
  ],
);

const STORY = reading(
  'en.stim.b2-u11-story',
  'post',
  'El comienzo de un cuento.',
  [
    'Having missed the last train, Elena set off on foot along the dark coast road.',
    'Never had she felt so alone. The wind was cold, and the only sound was the sea.',
    'Walking past the old lighthouse, she noticed a light in the window. It had been empty for twenty years.',
    'Hardly had she stopped when the door opened, and a voice called her name.',
    'Little did she know that this night would change her life.',
  ],
  { title: 'The Lighthouse — Chapter 1' },
);

const GRANDPA = dialogue(
  'en.stim.b2-u11-grandpa',
  'Un abuelo le cuenta a su nieta cómo conoció a su abuela.',
  [
    ['Lily', 'Grandpa, how did you meet Grandma?'],
    [
      'Grandpa',
      "At a wedding. I didn't know anyone, so I was standing in a corner, feeling a bit silly.",
    ],
    ['Lily', 'And then?'],
    [
      'Grandpa',
      'Then, out of the blue, she came over and asked me to dance. I was so nervous that I stepped on her foot!',
    ],
    ['Lily', 'Oh no!'],
    [
      'Grandpa',
      'She laughed, and that broke the ice. We talked all night. It turned out that we lived on the same street.',
    ],
    ['Lily', "That's so romantic."],
    [
      'Grandpa',
      'Fifty years later, I still remember it. When we got married, her mother burst into tears. Happy tears, I hope!',
    ],
  ],
);

const IDIOMS = reading(
  'en.stim.b2-u11-idioms',
  'post',
  'Una publicación sobre expresiones idiomáticas en inglés.',
  [
    'Five idioms you will actually hear',
    '"It was a piece of cake." Something was very easy. You can say it about an exam, a task or a recipe.',
    '"Once in a blue moon." Very rarely. I only go to the cinema once in a blue moon.',
    '"The last straw." The final problem that makes you lose patience. The neighbors played loud music again at three in the morning. That was the last straw.',
    '"To break the ice." To make people feel relaxed when they first meet. A good joke can break the ice.',
    '"Out of the blue." Suddenly, without warning. My old friend called me out of the blue.',
  ],
  { title: 'Idioms in real life' },
);

export const EN_B2_U11: B2UnitDef = {
  names: ['Julia', 'Nora', 'Elena', 'Lily', 'Grandpa', 'Grandma'],
  support: [
    'clever',
    'coming',
    'neither',
    'clues',
    'fisherman',
    'shall',
    'along',
    'lighthouse',
    'noticed',
    'empty',
    'voice',
    'wedding',
    'corner',
    'silly',
    'stepped',
    'romantic',
    'idioms',
    'rarely',
    'patience',
    'neighbors',
    'loud',
    'relaxed',
    'warning',
    'recipe',
    'choose',
    'surprise',
    'react',
    'wife',
  ],
  unit: {
    position: 11,
    title: 'Historias, libros y expresiones',
    titleEn: 'Stories, books and idioms',
    description:
      'Hablar de novelas y personajes, contar una historia con participios e inversión (Never had I…, Hardly had… when…) y expresiones idiomáticas frecuentes.',
    emoji: '📚',
    objective:
      'Puedes comentar un libro, contar una historia con recursos narrativos y entender expresiones idiomáticas frecuentes.',
    grammar: {
      title: 'Participios e inversión narrativa',
      explanation:
        'Las oraciones con participio resumen una acción del mismo sujeto: Walking home, I saw… (mientras caminaba); Having missed the train, she walked (como había perdido el tren). En los relatos, algunas expresiones negativas al principio invierten el sujeto y el auxiliar para dar dramatismo: Never had she felt so alone; Hardly had she stopped when…; No sooner had we arrived than…; Little did she know that…',
      examples: [
        {
          target: 'Having missed the last train, Elena set off on foot.',
          base: 'Como había perdido el último tren, Elena salió a pie.',
        },
        { target: 'Never had she felt so alone.', base: 'Nunca se había sentido tan sola.' },
        {
          target: 'Little did she know that this night would change her life.',
          base: 'Poco se imaginaba que esa noche le cambiaría la vida.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B2: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-novel',
        'novel',
        'novela',
        '/ˈnɑvəl/',
        '📖',
        'I could not stop reading the novel.',
        'No podía dejar de leer la novela.',
        ['literature'],
      ),
      w(
        'en-plot',
        'plot',
        'trama / argumento',
        '/plɑt/',
        '🧵',
        'The plot is clever and surprising.',
        'La trama es ingeniosa y sorprendente.',
        ['literature'],
        ['trama', 'argumento'],
      ),
      w(
        'en-character',
        'character',
        'personaje',
        '/ˈkærəktər/',
        '🎭',
        'My favorite character is the old fisherman.',
        'Mi personaje favorito es el viejo pescador.',
        ['literature'],
      ),
      w(
        'en-chapter',
        'chapter',
        'capítulo',
        '/ˈtʃæptər/',
        '🔖',
        'The twist is in the last chapter.',
        'El giro está en el último capítulo.',
        ['literature'],
      ),
      w(
        'en-narrator',
        'narrator',
        'narrador / narradora',
        '/ˈnærˌeɪtər/',
        '🗨️',
        'The narrator was lying to us.',
        'La narradora nos estaba mintiendo.',
        ['literature'],
        ['narrador', 'narradora'],
      ),
      w(
        'en-twist',
        'twist',
        'giro (inesperado)',
        '/twɪst/',
        '🌀',
        "I didn't expect that twist at the end.",
        'No me esperaba ese giro al final.',
        ['literature'],
        ['giro', 'vuelta de tuerca'],
      ),
      w(
        'en-turn-out',
        'turn out',
        'resultar',
        '/ˈtɜrn ˈaʊt/',
        undefined,
        'It turned out that we lived on the same street.',
        'Resultó que vivíamos en la misma calle.',
        ['narrative', 'phrasal-verbs'],
        ['resultar que'],
      ),
      w(
        'en-set-off',
        'set off',
        'salir / ponerse en camino',
        '/ˈsɛt ˈɔf/',
        '🚶',
        'We set off early in the morning.',
        'Salimos temprano a la mañana.',
        ['narrative', 'phrasal-verbs'],
        ['salir', 'ponerse en camino', 'partir'],
      ),
      w(
        'en-out-of-the-blue',
        'out of the blue',
        'de la nada / de repente',
        '/ˈaʊt əv ðə ˈblu/',
        '🔵',
        'My old friend called me out of the blue.',
        'Mi viejo amigo me llamó de la nada.',
        ['idioms'],
        ['de la nada', 'de repente', 'sin aviso'],
      ),
      w(
        'en-break-the-ice',
        'break the ice',
        'romper el hielo',
        '/ˈbreɪk ðə ˈaɪs/',
        '🧊',
        'A good joke can break the ice.',
        'Un buen chiste puede romper el hielo.',
        ['idioms'],
      ),
      w(
        'en-burst-into-tears',
        'burst into tears',
        'ponerse a llorar / romper en llanto',
        '/ˈbɜrst ˈɪntu ˈtɪrz/',
        '😭',
        'When she heard the news, she burst into tears.',
        'Cuando escuchó la noticia, se puso a llorar.',
        ['idioms', 'emotions'],
        ['ponerse a llorar', 'romper en llanto'],
      ),
      w(
        'en-never-had',
        'never had',
        'nunca había (inversión)',
        '/ˈnɛvər hæd/',
        undefined,
        'Never had she felt so alone.',
        'Nunca se había sentido tan sola.',
        ['inversion'],
        ['nunca había'],
      ),
      w(
        'en-hardly',
        'hardly',
        'apenas',
        '/ˈhɑrdli/',
        undefined,
        'Hardly had she stopped when the door opened.',
        'Apenas se había detenido cuando se abrió la puerta.',
        ['inversion', 'adverbs'],
        ['casi no'],
      ),
      w(
        'en-no-sooner',
        'no sooner',
        'no bien / en cuanto',
        '/noʊ ˈsunər/',
        undefined,
        'No sooner had we arrived than it started to rain.',
        'No bien llegamos, empezó a llover.',
        ['inversion'],
        ['no bien', 'en cuanto'],
      ),
      w(
        'en-little-did-i-know',
        'little did I know',
        'poco me imaginaba / no tenía idea',
        '/ˈlɪtəl dɪd aɪ ˈnoʊ/',
        undefined,
        'Little did I know that she would become my wife.',
        'Poco me imaginaba que iba a ser mi esposa.',
        ['inversion'],
        ['poco me imaginaba', 'no tenía idea'],
      ),
      w(
        'en-a-piece-of-cake',
        'a piece of cake',
        'pan comido / muy fácil',
        '/ə ˈpis əv ˈkeɪk/',
        '🍰',
        'The exam was a piece of cake.',
        'El examen fue pan comido.',
        ['idioms'],
        ['pan comido', 'muy fácil'],
      ),
      w(
        'en-once-in-a-blue-moon',
        'once in a blue moon',
        'muy de vez en cuando',
        '/ˈwʌns ɪn ə ˈblu ˈmun/',
        '🌕',
        'I only go to the cinema once in a blue moon.',
        'Voy al cine muy de vez en cuando.',
        ['idioms'],
        ['de vez en cuando', 'casi nunca'],
      ),
      w(
        'en-the-last-straw',
        'the last straw',
        'la gota que colmó el vaso',
        '/ðə ˈlæst ˈstrɔ/',
        '🥤',
        'The noise at three in the morning was the last straw.',
        'El ruido a las tres de la mañana fue la gota que colmó el vaso.',
        ['idioms'],
        ['la gota que rebalsó el vaso'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Comentar un libro',
        objective: 'Hablar de una novela: la trama, los personajes y los capítulos.',
        intro: {
          explanation:
            'A novel es una novela (no «una telenovela»). The plot es la trama; a character, un personaje (no el carácter de una persona); a chapter, un capítulo. Para opinar: The plot is clever, I couldn’t stop reading, My favorite character is…',
          examples: [
            {
              target: 'I could not stop reading the novel.',
              base: 'No podía dejar de leer la novela.',
            },
            {
              target: 'My favorite character is the old fisherman.',
              base: 'Mi personaje favorito es el viejo pescador.',
            },
          ],
        },
        takeaways: [
          'Comentas una novela: trama, personajes y capítulos.',
          'Das tu opinión sobre un libro.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['novel', 'novela'],
              ['plot', 'trama / argumento'],
              ['character', 'personaje'],
              ['chapter', 'capítulo'],
            ],
            ['en-novel', 'en-plot', 'en-character', 'en-chapter'],
            { id: 'en.ex.5xvlc8w3l4bc5v' },
          ),
          ex.fillBlank(
            'My favorite ___ is the old fisherman.',
            'Mi personaje favorito es el viejo pescador.',
            'character',
            ['plot', 'chapter', 'novel'],
            ['en-character'],
            {
              id: 'en.ex.zv6wbsnqbfuby8',
              skill: 'vocabulary',
              explanation:
                'Character: personaje de una historia (y también el carácter de alguien).',
            },
          ),
          ex.fillBlank(
            'The ___ is clever and surprising.',
            'La trama es ingeniosa y sorprendente.',
            'plot',
            ['character', 'chapter', 'narrator'],
            ['en-plot'],
            { id: 'en.ex.eehhojlfsfoyf7', skill: 'vocabulary' },
          ),
          question(
            'en.ex.ax4wl0smu0i2xc',
            BOOK_CLUB,
            '¿Qué le pareció la novela a Nora?',
            'No podía dejar de leerla; la trama le pareció muy ingeniosa',
            ['Le pareció aburrida', 'No la terminó', 'Le gustó sólo el final'],
            ['en-novel', 'en-plot'],
            'Nora dice: «I couldn’t stop reading. The plot is so clever».',
          ),
          question(
            'en.ex.zkm4hjp11dd3xn',
            BOOK_CLUB,
            '¿Qué personaje prefiere Nora y por qué?',
            'El viejo pescador: casi no habla, pero cada palabra importa',
            ['La narradora, porque es sincera', 'El protagonista, porque es valiente', 'Ninguno'],
            ['en-character', 'en-hardly', 'en-twist', 'en-chapter', 'en-narrator', 'en-turn-out'],
            'Nora dice: «My favorite character was the old fisherman… He hardly says anything, but every word matters».',
          ),
          ex.listenChoice(
            'I could not stop reading the novel.',
            [
              'I could not start reading the novel.',
              'I could not stop reading the story.',
              'I would not stop reading the novel.',
            ],
            ['en-novel'],
            { id: 'en.ex.ei7zxrdye4k03p' },
          ),
          ex.orderWords(
            'The twist is in the last chapter.',
            'El giro está en el último capítulo.',
            ['en-chapter', 'en-twist'],
            { id: 'en.ex.3rn0mfbfw1o5qm' },
          ),
          ex.shortAnswer(
            'How was the book? (no podías dejar de leerlo)',
            '¿Qué tal el libro?',
            "I couldn't stop reading it.",
            [
              'I could not stop reading it.',
              "I couldn't stop reading it!",
              'Great. I could not stop reading it.',
            ],
            ['en-novel'],
            { id: 'en.ex.ieyzq7w1ywwczj' },
          ),
          ex.translateWrite(
            'Mi personaje favorito es el viejo pescador.',
            'My favorite character is the old fisherman.',
            ['en-character'],
            {
              id: 'en.ex.jniu3gtc7v9cdm',
              acceptedAnswers: [
                'My favourite character is the old fisherman.',
                'My favorite character was the old fisherman.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Giros inesperados',
        objective: 'Hablar del narrador, de los giros de una historia y de cómo resultó todo.',
        intro: {
          explanation:
            'The narrator es quien cuenta la historia. A twist es un giro inesperado. Turn out es resultar: It turns out that… (resulta que…). Set off es salir, ponerse en camino: She set off on foot.',
          examples: [
            {
              target: 'It turned out that we lived on the same street.',
              base: 'Resultó que vivíamos en la misma calle.',
            },
            { target: 'We set off early in the morning.', base: 'Salimos temprano a la mañana.' },
          ],
        },
        takeaways: [
          'Hablas del narrador y de los giros de una historia.',
          'Cuentas cómo resultó algo con turn out y cuándo salieron con set off.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['narrator', 'narrador / narradora'],
              ['twist', 'giro (inesperado)'],
              ['turn out', 'resultar'],
              ['set off', 'salir / ponerse en camino'],
            ],
            ['en-narrator', 'en-twist', 'en-turn-out', 'en-set-off'],
            { id: 'en.ex.66p4z3yxk7lxja' },
          ),
          ex.fillBlank(
            'It turned ___ that we lived on the same street.',
            'Resultó que vivíamos en la misma calle.',
            'out',
            ['up', 'off', 'down'],
            ['en-turn-out'],
            { id: 'en.ex.g8epbc1g63c8na', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'We set ___ early in the morning.',
            'Salimos temprano a la mañana.',
            'off',
            ['up', 'out', 'down'],
            ['en-set-off'],
            { id: 'en.ex.1wtg6qjj5d7aej', skill: 'vocabulary' },
          ),
          question(
            'en.ex.bbnx6x8lfkv6uu',
            BOOK_CLUB,
            '¿Cuál es el giro del último capítulo?',
            'Que la narradora les mentía desde el principio',
            [
              'Que el pescador era el narrador',
              'Que todo era un sueño',
              'Que la protagonista muere',
            ],
            ['en-twist', 'en-narrator', 'en-turn-out'],
            'Nora dice: «It turns out that the narrator was lying to us from the start».',
          ),
          question(
            'en.ex.xeorh5ece0elyv',
            BOOK_CLUB,
            '¿Qué se da cuenta Julia al mirar hacia atrás?',
            'Que las pistas estaban, pero ella confiaba en la narradora',
            ['Que el libro tenía errores', 'Que ya conocía el final', 'Que no entendió la trama'],
            ['en-narrator'],
            'Julia dice: «Looking back, the clues were all there, but I trusted her completely».',
          ),
          ex.listenChoice(
            "I didn't expect that twist at the end.",
            [
              'I expected that twist at the end.',
              "I didn't expect that twist at the start.",
              "I didn't like that twist at the end.",
            ],
            ['en-twist'],
            { id: 'en.ex.m6w80ez7mywczq' },
          ),
          ex.orderWords(
            'The narrator was lying to us.',
            'La narradora nos estaba mintiendo.',
            ['en-narrator'],
            { id: 'en.ex.nbhs0vm3wmzhtd' },
          ),
          ex.shortAnswer(
            'When did you leave for the mountains? (salieron temprano a la mañana)',
            '¿Cuándo salieron para la montaña?',
            'We set off early in the morning.',
            ['We set off early.', 'We set off early in the morning!', 'Early in the morning.'],
            ['en-set-off'],
            { id: 'en.ex.wjztg6e2k6bgic' },
          ),
          ex.translateWrite(
            'Resultó que vivíamos en la misma calle.',
            'It turned out that we lived on the same street.',
            ['en-turn-out'],
            {
              id: 'en.ex.weemksurb9dyjj',
              acceptedAnswers: [
                'It turned out we lived on the same street.',
                'It turned out that we lived in the same street.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Contar con estilo',
        objective: 'Contar una historia con oraciones con participio y expresiones vivas.',
        intro: {
          explanation:
            'Con un participio resumes una acción del mismo sujeto: Walking past the lighthouse, she noticed a light (mientras pasaba…). Having + participio cuenta lo que pasó antes: Having missed the train, she walked. Expresiones que dan vida a un relato: out of the blue (de la nada), break the ice (romper el hielo), burst into tears (ponerse a llorar).',
          examples: [
            {
              target: 'Having missed the last train, Elena set off on foot.',
              base: 'Como había perdido el último tren, Elena salió a pie.',
            },
            {
              target: 'My old friend called me out of the blue.',
              base: 'Mi viejo amigo me llamó de la nada.',
            },
          ],
        },
        takeaways: [
          'Unes acciones con un participio: Walking…, Having…',
          'Cuentas con expresiones como out of the blue y burst into tears.',
        ],
        exercises: [
          ex.fillBlank(
            '___ missed the last train, Elena set off on foot.',
            'Como había perdido el último tren, Elena salió a pie.',
            'Having',
            ['Had', 'Have', 'Being'],
            ['en-set-off'],
            {
              id: 'en.ex.h8cuq3zd81k2ca',
              explanation: 'Having + participio: una acción anterior del mismo sujeto.',
            },
          ),
          ex.fillBlank(
            '___ past the old lighthouse, she noticed a light.',
            'Al pasar junto al viejo faro, vio una luz.',
            'Walking',
            ['Walked', 'Walk', 'To walk'],
            ['en-narrator'],
            {
              id: 'en.ex.lz8or0mhd7sw41',
              explanation: 'Participio en -ing: dos acciones al mismo tiempo, del mismo sujeto.',
            },
          ),
          ex.fillBlank(
            'When she heard the news, she burst into ___.',
            'Cuando escuchó la noticia, se puso a llorar.',
            'tears',
            ['cry', 'crying', 'sad'],
            ['en-burst-into-tears'],
            { id: 'en.ex.mwbikibuwaom4k', skill: 'vocabulary' },
          ),
          question(
            'en.ex.56hyfj30phcj7q',
            GRANDPA,
            '¿Cómo se acercó la abuela al abuelo?',
            'De la nada, fue y lo invitó a bailar',
            ['Él la invitó a bailar', 'Los presentó un amigo', 'Se conocieron en la calle'],
            ['en-out-of-the-blue'],
            'El abuelo dice: «Then, out of the blue, she came over and asked me to dance».',
          ),
          question(
            'en.ex.t011d6cb1ay3tc',
            GRANDPA,
            '¿Qué rompió el hielo esa noche?',
            'Que ella se rió cuando él le pisó el pie',
            ['Un chiste del abuelo', 'Una canción', 'Que eran vecinos'],
            ['en-break-the-ice', 'en-turn-out'],
            'El abuelo dice: «She laughed, and that broke the ice».',
          ),
          question(
            'en.ex.r1gxt1rfx9ghn7',
            GRANDPA,
            '¿Qué pasó con la madre de la abuela en el casamiento?',
            'Se puso a llorar, de felicidad según el abuelo',
            ['Se fue temprano', 'No quiso ir', 'Se rió mucho'],
            ['en-burst-into-tears'],
            'El abuelo dice: «her mother burst into tears. Happy tears, I hope!».',
          ),
          ex.listenChoice(
            'My old friend called me out of the blue.',
            [
              'My old friend called me on my birthday.',
              'My best friend called me out of the blue.',
              'My old friend visited me out of the blue.',
            ],
            ['en-out-of-the-blue'],
            { id: 'en.ex.c0w2clj9944738' },
          ),
          ex.orderWords(
            'A good joke can break the ice.',
            'Un buen chiste puede romper el hielo.',
            ['en-break-the-ice'],
            { id: 'en.ex.mnrbvusgijmn1j' },
          ),
          ex.shortAnswer(
            'How did she react to the news? (se puso a llorar)',
            '¿Cómo reaccionó a la noticia?',
            'She burst into tears.',
            ['She burst into tears!', 'She burst into tears when she heard it.'],
            ['en-burst-into-tears'],
            { id: 'en.ex.97b5hk6y4qhz02' },
          ),
          ex.translateWrite(
            'Mi viejo amigo me llamó de la nada.',
            'My old friend called me out of the blue.',
            ['en-out-of-the-blue'],
            {
              id: 'en.ex.hvubf4w2dvvr5d',
              acceptedAnswers: [
                'An old friend called me out of the blue.',
                'My old friend phoned me out of the blue.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Nunca había visto algo así',
        objective: 'Dar dramatismo a un relato con la inversión.',
        intro: {
          explanation:
            'En los relatos, si empiezas con never, hardly, no sooner o little, se invierten el auxiliar y el sujeto: Never had she felt so alone (= She had never felt so alone). Hardly had… when… y No sooner had… than…: una cosa pasó apenas terminó la otra. Little did I know…: poco me imaginaba.',
          examples: [
            { target: 'Never had she felt so alone.', base: 'Nunca se había sentido tan sola.' },
            {
              target: 'No sooner had we arrived than it started to rain.',
              base: 'No bien llegamos, empezó a llover.',
            },
          ],
        },
        takeaways: [
          'Inviertes auxiliar y sujeto después de never, hardly y no sooner.',
          'Anticipas un giro con Little did I know…',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['never had', 'nunca había (inversión)'],
              ['hardly', 'apenas'],
              ['no sooner', 'no bien / en cuanto'],
              ['little did I know', 'poco me imaginaba / no tenía idea'],
            ],
            ['en-never-had', 'en-hardly', 'en-no-sooner', 'en-little-did-i-know'],
            { id: 'en.ex.pl73s3p14ptaml' },
          ),
          ex.fillBlank(
            'Never ___ she felt so alone.',
            'Nunca se había sentido tan sola.',
            'had',
            ['has', 'did', 'was'],
            ['en-never-had'],
            {
              id: 'en.ex.2esnq4q0q5c5ev',
              explanation: 'Inversión: Never + had + sujeto + participio.',
            },
          ),
          ex.fillBlank(
            'No sooner had we arrived ___ it started to rain.',
            'No bien llegamos, empezó a llover.',
            'than',
            ['when', 'that', 'then'],
            ['en-no-sooner'],
            { id: 'en.ex.vnia4egdvrsq1n', explanation: 'No sooner… than; hardly… when.' },
          ),
          ex.fillBlank(
            'Little ___ I know that she would become my wife.',
            'Poco me imaginaba que iba a ser mi esposa.',
            'did',
            ['had', 'was', 'do'],
            ['en-little-did-i-know'],
            { id: 'en.ex.284837dt9ojvka' },
          ),
          question(
            'en.ex.7dysi3jw6exnx3',
            STORY,
            '¿Por qué Elena caminaba sola por la ruta de la costa?',
            'Porque había perdido el último tren',
            [
              'Porque quería ver el faro',
              'Porque le gustaba caminar de noche',
              'Porque alguien la esperaba',
            ],
            ['en-set-off', 'en-never-had', 'en-hardly', 'en-little-did-i-know'],
            'El cuento empieza: «Having missed the last train, Elena set off on foot».',
          ),
          question(
            'en.ex.ef8ll6ipvhameg',
            STORY,
            '¿Por qué le llama la atención la luz del faro?',
            'Porque el faro estaba vacío desde hacía veinte años',
            [
              'Porque era de colores',
              'Porque se apagaba y prendía',
              'Porque nunca había visto un faro',
            ],
            ['en-chapter'],
            'El cuento dice: «she noticed a light in the window. It had been empty for twenty years».',
          ),
          question(
            'en.ex.kvqpowbbqjstiu',
            STORY,
            '¿Qué efecto tiene la última oración, «Little did she know that this night would change her life»?',
            'Anticipa que va a pasar algo importante que ella todavía no sabe',
            [
              'Cuenta el final de la historia',
              'Dice que Elena tenía miedo',
              'Explica quién la llamó',
            ],
            ['en-little-did-i-know'],
            'Little did she know…: el narrador sabe algo que el personaje ignora y crea suspenso.',
          ),
          ex.listenChoice(
            'Never had she felt so alone.',
            [
              'She had never felt so happy.',
              'Never had he felt so alone.',
              'Never has she felt so alone.',
            ],
            ['en-never-had'],
            { id: 'en.ex.gl390rm70x7ju7' },
          ),
          ex.shortAnswer(
            'She had never seen such a beautiful place. (reescríbelo empezando con Never had…)',
            'Reescribe con inversión: «Nunca había visto un lugar tan lindo».',
            'Never had she seen such a beautiful place.',
            [
              'Never had she seen such a beautiful place!',
              'Never had she seen a place so beautiful.',
            ],
            ['en-never-had'],
            { id: 'en.ex.vblamr0u28ndep' },
          ),
          ex.translateWrite(
            'No bien llegamos, empezó a llover.',
            'No sooner had we arrived than it started to rain.',
            ['en-no-sooner'],
            {
              id: 'en.ex.eneo2fey2qsej1',
              acceptedAnswers: [
                'No sooner had we arrived than it began to rain.',
                'No sooner had we arrived than it started raining.',
                'Hardly had we arrived when it started to rain.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Expresiones de todos los días',
        objective: 'Entender y usar expresiones idiomáticas frecuentes.',
        intro: {
          explanation:
            'Las expresiones idiomáticas no se traducen palabra por palabra. A piece of cake es pan comido; once in a blue moon, muy de vez en cuando; the last straw, la gota que colmó el vaso. Úsalas en situaciones informales y con moderación.',
          examples: [
            { target: 'The exam was a piece of cake.', base: 'El examen fue pan comido.' },
            {
              target: 'I only go to the cinema once in a blue moon.',
              base: 'Voy al cine muy de vez en cuando.',
            },
          ],
        },
        takeaways: [
          'Entiendes expresiones idiomáticas frecuentes.',
          'Usas algunas en situaciones informales.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['a piece of cake', 'pan comido / muy fácil'],
              ['once in a blue moon', 'muy de vez en cuando'],
              ['the last straw', 'la gota que colmó el vaso'],
              ['break the ice', 'romper el hielo'],
            ],
            [
              'en-a-piece-of-cake',
              'en-once-in-a-blue-moon',
              'en-the-last-straw',
              'en-break-the-ice',
            ],
            { id: 'en.ex.ugnbzb4jwvmxtl' },
          ),
          ex.imageChoice(
            '🍰',
            'a piece of cake',
            ['the last straw', 'out of the blue', 'break the ice'],
            ['en-a-piece-of-cake'],
            {
              id: 'en.ex.dt4efwtsrl8xya',
            },
          ),
          ex.fillBlank(
            'I only go to the cinema once in a blue ___.',
            'Voy al cine muy de vez en cuando.',
            'moon',
            ['sky', 'day', 'year'],
            ['en-once-in-a-blue-moon'],
            { id: 'en.ex.skt0wos86zb9hx', skill: 'vocabulary' },
          ),
          question(
            'en.ex.ahlwoc3vd9xhzp',
            IDIOMS,
            'Según la publicación, ¿cuándo se dice «the last straw»?',
            'Cuando un último problema hace que pierdas la paciencia',
            [
              'Cuando algo es muy fácil',
              'Cuando algo pasa muy pocas veces',
              'Cuando alguien llama de repente',
            ],
            [
              'en-the-last-straw',
              'en-a-piece-of-cake',
              'en-once-in-a-blue-moon',
              'en-break-the-ice',
              'en-out-of-the-blue',
            ],
            'La publicación dice: «"The last straw." The final problem that makes you lose patience».',
          ),
          question(
            'en.ex.kwpq4ap1hfimfj',
            IDIOMS,
            '¿Qué significa «once in a blue moon» en el ejemplo del cine?',
            'Que casi nunca va al cine',
            ['Que va al cine de noche', 'Que va todos los meses', 'Que va sólo con luna llena'],
            ['en-once-in-a-blue-moon'],
            'La publicación dice: «"Once in a blue moon." Very rarely».',
          ),
          ex.listenChoice(
            'The exam was a piece of cake.',
            [
              'The exam was a piece of paper.',
              'The test was a piece of cake.',
              "The exam wasn't a piece of cake.",
            ],
            ['en-a-piece-of-cake'],
            { id: 'en.ex.y3oz3q5ugyi3g5' },
          ),
          ex.orderWords(
            'That was the last straw.',
            'Esa fue la gota que colmó el vaso.',
            ['en-the-last-straw'],
            { id: 'en.ex.vkmvs8jy0ab8af' },
          ),
          ex.shortAnswer(
            'How was the driving test? (fue pan comido)',
            '¿Cómo te fue en el examen de manejo?',
            'It was a piece of cake.',
            ['It was a piece of cake!', 'A piece of cake.', 'It was a piece of cake, really.'],
            ['en-a-piece-of-cake'],
            { id: 'en.ex.n3unnz1c2xycz4' },
          ),
          ex.translateWrite(
            'Voy al cine muy de vez en cuando.',
            'I only go to the cinema once in a blue moon.',
            ['en-once-in-a-blue-moon'],
            {
              id: 'en.ex.4xiyhr48hwendy',
              acceptedAnswers: [
                'I go to the cinema once in a blue moon.',
                'I only go to the movies once in a blue moon.',
                'I go to the movies once in a blue moon.',
              ],
            },
          ),
        ],
      },
    ],
  },
};
