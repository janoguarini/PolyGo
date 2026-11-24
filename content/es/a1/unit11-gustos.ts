import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_A1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español A1 U11 «Likes and free time» (docs/ES_A1_A2.md), en español neutro de Latinoamérica (tú y
 * ustedes): decir qué te gusta y qué no con gustar (me gusta + singular o infinitivo, me gustan +
 * plural, ¿te gusta?, le gusta), me encanta, odio y prefiero (e → ie: prefiero, prefieres, prefiere),
 * jugar (u → ue: juego, juegas, juega) y tocar un instrumento (falso amigo: play = jugar o tocar), salir
 * con amigos y no me gusta para nada.
 * Pronunciación: la g de gusta (g + u, sonido duro), la de guitarra (gu + i: la u no suena) y la j de
 * juego / jugar (una h fuerte).
 * Cultura: bailes de distintos países (salsa, tango, cumbia), el fútbol de los fines de semana y salir
 * con amigos.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const TIEMPO_LIBRE = dialogue(
  'es.stim.a1-u11-tiempo-libre',
  'Two friends talk about what they like doing in their free time.',
  [
    ['Ana', 'Mateo, ¿te gusta leer?'],
    ['Mateo', 'Sí, me encanta. Leo todos los días.'],
    ['Ana', 'A mí no me gusta para nada. Me encanta bailar.'],
    ['Mateo', '¿Bailas salsa?'],
    ['Ana', 'Sí, los viernes.'],
  ],
  ES_A1_RATE,
);

const FUTBOL = dialogue(
  'es.stim.a1-u11-futbol',
  'Martín asks Sofía about football and music.',
  [
    ['Martín', 'Sofía, ¿te gusta el fútbol?'],
    ['Sofía', 'No, para nada. Me gusta la música.'],
    ['Martín', '¿Tocas la guitarra?'],
    ['Sofía', 'Sí, toco la guitarra todos los días. ¿Y tú?'],
    ['Martín', 'Yo juego al fútbol los sábados.'],
  ],
  ES_A1_RATE,
);

const DIEGO = reading(
  'es.stim.a1-u11-diego',
  'post',
  'Diego writes a short post about his free time.',
  [
    '¡Hola! Me llamo Diego y vivo en Cali.',
    'En mi tiempo libre me encanta cocinar y viajar.',
    'No me gustan los deportes: odio el fútbol.',
    'Prefiero salir con mis amigos los viernes.',
  ],
  { title: 'Mi tiempo libre', from: 'Diego' },
);

export const ES_A1_U11: EsUnitDef = {
  names: ['Ana', 'Mateo', 'Martín', 'Sofía', 'Diego', 'Cali', 'Italia'],
  support: [
    'gustan',
    'encantan',
    'le',
    'o',
    'mí',
    'leo',
    'bailas',
    'salsa',
    'toco',
    'tocas',
    'toca',
    'juegas',
    'juega',
    'prefieres',
    'prefiere',
    'amigo',
  ],
  unit: {
    position: 11,
    title: 'Likes and free time',
    titleEn: 'Gustos y tiempo libre',
    description:
      'Say what you like, love, hate and prefer with me gusta, me gustan, me encanta, odio and prefiero, and talk about sports, music and free time with jugar, tocar and salir.',
    emoji: '🎸',
    objective:
      'You can say what you like and don’t like, ask a friend about their likes, and talk about your hobbies, the sports you play and what you do in your free time.',
    grammar: {
      title: 'Gustar: me gusta, me gustan · jugar and tocar',
      explanation:
        'Gustar works “backwards”: the thing you like is the subject. Me gusta + one thing or a verb in the infinitive (me gusta la música, me gusta leer); me gustan + several things (me gustan los gatos). Keep the article: me gusta el fútbol, not me gusta fútbol. To ask a friend: ¿te gusta…? For he or she: le gusta. Me encanta (I love) works the same way. Odio (I hate) and prefiero (I prefer) are normal verbs. Preferir changes e to ie in yo, tú and él / ella / usted: prefiero, prefieres, prefiere. Jugar changes u to ue in the same persons: juego, juegas, juega (but nosotros jugamos). Play a sport is jugar al (a + el) fútbol (in Mexico you will also hear jugar fútbol), and play an instrument is tocar: toco la guitarra, ¿tocas la guitarra?',
      examples: [
        { target: 'Me gusta la música. Me gustan los gatos.', base: 'I like music. I like cats.' },
        {
          target: '¿Te gusta bailar? — Sí, me encanta.',
          base: 'Do you like dancing? — Yes, I love it.',
        },
        {
          target: 'Juego al fútbol y toco la guitarra.',
          base: 'I play football and I play the guitar.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U11). Convertido al español neutro de Latinoamérica (tú y ustedes) el 2026-11-21. Sin revisión nativa: revisar que «me gusta» se traduzca «I like» (la explicación aclara que funciona al revés), «jugar al fútbol» (en México también «jugar fútbol», aceptado en las respuestas), la salsa en lugar del tango en el diálogo, «el deporte» con la aceptada «sports» y si conviene enseñar «a mí me gusta» ya acá (sólo aparece en el diálogo).',
    },
    words: [
      w('es-me-gusta', 'me gusta', 'I like', 'Me gusta la música.', 'I like music.', ['likes'], {
        emoji: '👍',
      }),
      w(
        'es-me-encanta',
        'me encanta',
        'I love',
        'Me encanta el café.',
        'I love coffee.',
        ['likes'],
        {
          acceptedTranslations: ['I really like'],
          emoji: '😍',
        },
      ),
      w('es-odio', 'odio', 'I hate', 'Odio la leche.', 'I hate milk.', ['likes']),
      w('es-prefiero', 'prefiero', 'I prefer', 'Prefiero el té.', 'I prefer tea.', [
        'likes',
        'verbs',
      ]),
      w(
        'es-te-gusta',
        '¿te gusta?',
        'do you like?',
        '¿Te gusta el fútbol?',
        'Do you like football?',
        ['likes', 'questions'],
        { acceptedTranslations: ['do you like it?'] },
      ),
      w(
        'es-el-deporte',
        'el deporte',
        'sport',
        'No me gusta el deporte.',
        'I don’t like sport.',
        ['hobbies'],
        { acceptedTranslations: ['sports', 'the sport'] },
      ),
      w(
        'es-la-musica',
        'la música',
        'music',
        'Escucho música todos los días.',
        'I listen to music every day.',
        ['hobbies'],
        { acceptedTranslations: ['the music'], emoji: '🎵' },
      ),
      w(
        'es-el-futbol',
        'el fútbol',
        'football',
        'Juego al fútbol los sábados.',
        'I play football on Saturdays.',
        ['hobbies'],
        { acceptedTranslations: ['soccer'], emoji: '⚽' },
      ),
      w(
        'es-la-guitarra',
        'la guitarra',
        'the guitar',
        'Mi hermano toca la guitarra.',
        'My brother plays the guitar.',
        ['hobbies'],
        { emoji: '🎸' },
      ),
      w('es-leer', 'leer', 'to read', 'Me gusta leer.', 'I like reading.', ['hobbies', 'verbs'], {
        emoji: '📖',
      }),
      w(
        'es-bailar',
        'bailar',
        'to dance',
        'Me encanta bailar salsa.',
        'I love dancing salsa.',
        ['hobbies', 'verbs'],
        { emoji: '💃' },
      ),
      w(
        'es-viajar',
        'viajar',
        'to travel',
        'Quiero viajar a Italia.',
        'I want to travel to Italy.',
        ['hobbies', 'verbs'],
        { emoji: '✈️' },
      ),
      w(
        'es-cocinar',
        'cocinar',
        'to cook',
        'Me gusta cocinar con mi mamá.',
        'I like cooking with my mom.',
        ['hobbies', 'verbs'],
      ),
      w(
        'es-juego',
        'juego',
        'I play',
        'Juego al fútbol con mis amigos.',
        'I play football with my friends.',
        ['verbs'],
      ),
      w(
        'es-jugar',
        'jugar',
        'to play',
        '¿Te gusta jugar al fútbol?',
        'Do you like playing football?',
        ['verbs'],
      ),
      w(
        'es-para-nada',
        'para nada',
        'not at all',
        'No me gusta para nada.',
        'I don’t like it at all.',
        ['likes'],
      ),
      w(
        'es-el-tiempo-libre',
        'el tiempo libre',
        'free time',
        'En mi tiempo libre leo.',
        'In my free time I read.',
        ['hobbies'],
        { acceptedTranslations: ['spare time'] },
      ),
      w('es-con', 'con', 'with', 'Voy al cine con Ana.', 'I go to the cinema with Ana.', [
        'prepositions',
      ]),
      w(
        'es-salir',
        'salir',
        'to go out',
        'Me gusta salir los viernes.',
        'I like going out on Fridays.',
        ['verbs', 'hobbies'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Me gusta…',
        objective: 'Say what you like and don’t like, and ask a friend.',
        intro: {
          explanation:
            'To say you like something: me gusta + the thing, with its article: me gusta la música, me gusta el fútbol (English drops the article; Spanish keeps it). To say you don’t: no me gusta. To ask a friend: ¿te gusta…? A strong no: no me gusta para nada (I don’t like it at all). The g in gusta is hard, like the g in go.',
          examples: [
            { target: 'Me gusta la música.', base: 'I like music.' },
            {
              target: '¿Te gusta el fútbol? — No, para nada.',
              base: 'Do you like football? — No, not at all.',
            },
          ],
        },
        takeaways: [
          'You say what you like with me gusta + el / la + noun.',
          'You ask a friend ¿te gusta…? and answer no, para nada.',
        ],
        exercises: [
          ex.translationChoice(
            'me gusta',
            'I like',
            ['I hate', 'I prefer', 'do you like?'],
            ['es-me-gusta'],
            { id: 'es.ex.mgxcrhi51rgydm' },
          ),
          ex.translationChoice(
            'la música',
            'music',
            ['sport', 'football', 'free time'],
            ['es-la-musica'],
            { id: 'es.ex.jpno3vtswv2jjo' },
          ),
          ex.matchPairs(
            [
              ['me gusta', 'I like'],
              ['¿te gusta?', 'do you like?'],
              ['el fútbol', 'football'],
              ['el deporte', 'sport'],
            ],
            ['es-me-gusta', 'es-te-gusta', 'es-el-futbol', 'es-el-deporte'],
            { id: 'es.ex.amcwommf00nkm9' },
          ),
          ex.listenChoice(
            'Me gusta el fútbol.',
            ['No me gusta el fútbol.', 'Me gusta la música.', '¿Te gusta el fútbol?'],
            ['es-me-gusta', 'es-el-futbol'],
            { id: 'es.ex.esypyv2wjayfxp' },
          ),
          ex.fillBlank(
            'Me gusta ___ música.',
            'I like music.',
            'la',
            ['el', 'los', 'un'],
            ['es-me-gusta', 'es-la-musica'],
            {
              id: 'es.ex.fl7nikipm40t5f',
              explanation:
                'Spanish keeps the article after gustar: me gusta la música (not me gusta música). Música is feminine, so la.',
            },
          ),
          ex.fillBlank(
            '¿Te ___ el deporte?',
            'Do you like sport?',
            'gusta',
            ['gusto', 'llamas', 'tengo'],
            ['es-te-gusta', 'es-el-deporte'],
            {
              id: 'es.ex.rwnyqgqtpslnmw',
              explanation:
                'To ask a friend if they like something: ¿te gusta…? Gusto appears in mucho gusto, but it is not the form you need here.',
            },
          ),
          ex.orderWords(
            'No me gusta el deporte.',
            'I don’t like sport.',
            ['es-me-gusta', 'es-el-deporte'],
            { id: 'es.ex.8rdu86dj3yrqib' },
          ),
          ex.listenChoice(
            'No, para nada.',
            ['No, gracias.', 'Sí, mucho.', 'No, de nada.'],
            ['es-para-nada'],
            { id: 'es.ex.krpplwzajkkkmg' },
          ),
          ex.translateWrite(
            'Do you like football?',
            '¿Te gusta el fútbol?',
            ['es-te-gusta', 'es-el-futbol'],
            {
              id: 'es.ex.jk9r3dzcek2n7b',
              acceptedAnswers: ['¿A ti te gusta el fútbol?', '¿A vos te gusta el fútbol?'],
            },
          ),
          ex.shortAnswer(
            '¿Te gusta la música?',
            'Say that you like it a lot (e.g. «Sí, me gusta mucho.»).',
            'Sí, me gusta mucho.',
            [
              'Sí, me gusta.',
              'Sí, me gusta mucho la música.',
              'Sí, me gusta la música.',
              'Sí, mucho.',
              'Me gusta mucho.',
            ],
            ['es-me-gusta', 'es-la-musica'],
            { id: 'es.ex.l1usjvxo6mwzky' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Me gustan, me encanta, odio',
        objective: 'Talk about things you like in the plural, and say you love or hate something.',
        intro: {
          explanation:
            'When you like several things, gustar goes plural: me gustan los perros. Me encanta (I love) works the same way: me encanta el café, me encantan los libros. Odio (I hate) is a normal verb: odio el té. For he or she, use le: a mi papá le gusta el fútbol. Listen to the end of the word: gusta or gustan.',
          examples: [
            { target: 'Me gustan los perros.', base: 'I like dogs.' },
            {
              target: 'Me encanta el café, pero odio el té.',
              base: 'I love coffee, but I hate tea.',
            },
          ],
        },
        takeaways: [
          'You use me gustan and me encantan with plural things.',
          'You say you hate something with odio.',
        ],
        exercises: [
          ex.translationChoice(
            'me encanta',
            'I love',
            ['I hate', 'I like', 'not at all'],
            ['es-me-encanta'],
            { id: 'es.ex.a525e4fo9igxm7' },
          ),
          ex.fillBlank(
            'Me ___ los gatos.',
            'I like cats.',
            'gustan',
            ['gusta', 'gusto', 'llamo'],
            ['es-me-gusta'],
            {
              id: 'es.ex.husvfgfx20xbsk',
              explanation:
                'Los gatos is plural, so the verb is plural too: me gustan los gatos. With one thing: me gusta el gato.',
            },
          ),
          ex.listenChoice(
            'Me gustan los perros.',
            ['Me gusta el perro.', 'Me gustan los gatos.', 'Odio los perros.'],
            ['es-me-gusta', 'es-odio'],
            { id: 'es.ex.626g5zcb28opg9' },
          ),
          ex.translationChoice('odio', 'I hate', ['I love', 'I prefer', 'I like'], ['es-odio'], {
            id: 'es.ex.z8lefg0lp069e5',
          }),
          ex.fillBlank(
            'A mi papá le ___ el fútbol.',
            'My dad likes football.',
            'gusta',
            ['gustan', 'gusto', 'tengo'],
            ['es-me-gusta', 'es-el-futbol'],
            {
              id: 'es.ex.qlt6sf2bho5huq',
              explanation: 'For he or she: le gusta. El fútbol is one thing, so gusta, not gustan.',
            },
          ),
          ex.matchPairs(
            [
              ['me encanta', 'I love'],
              ['odio', 'I hate'],
              ['me gusta', 'I like'],
              ['para nada', 'not at all'],
            ],
            ['es-me-encanta', 'es-odio', 'es-me-gusta', 'es-para-nada'],
            { id: 'es.ex.7lwk4cj5gw0kxq' },
          ),
          ex.fillBlank(
            'Odio ___ verduras.',
            'I hate vegetables.',
            'las',
            ['la', 'el', 'los'],
            ['es-odio'],
            {
              id: 'es.ex.juncu86xx9zhof',
              explanation:
                'Spanish uses the article when you talk about things in general: odio las verduras. Verduras is feminine plural, so las.',
            },
          ),
          ex.orderWords('Me encantan los libros.', 'I love books.', ['es-me-encanta'], {
            id: 'es.ex.g2tkmfo33h8uvd',
          }),
          ex.translateWrite('I love coffee.', 'Me encanta el café.', ['es-me-encanta'], {
            id: 'es.ex.j1iead1k91z68a',
          }),
          ex.translateWrite(
            'I like cats, but I hate dogs.',
            'Me gustan los gatos, pero odio los perros.',
            ['es-me-gusta', 'es-odio'],
            {
              id: 'es.ex.mb9jivwmjc79l2',
              acceptedAnswers: ['Me gustan los gatos pero odio los perros.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Me gusta leer',
        objective: 'Talk about free-time activities with me gusta + a verb.',
        intro: {
          explanation:
            'To say you like doing something, use the infinitive (the basic form of the verb, ending in -ar, -er or -ir) and always gusta, never gustan: me gusta leer, me gusta bailar y cocinar. English uses the -ing form (I like reading); Spanish uses the infinitive. Your free time is el tiempo libre. Every country has its dances: salsa in Cali, tango in Buenos Aires, cumbia almost everywhere.',
          examples: [
            { target: 'Me gusta leer.', base: 'I like reading.' },
            {
              target: 'En mi tiempo libre me encanta bailar.',
              base: 'In my free time I love dancing.',
            },
          ],
        },
        takeaways: [
          'You say what you like doing with me gusta + infinitive.',
          'You talk about your free time: en mi tiempo libre…',
        ],
        exercises: [
          ex.translationChoice(
            'leer',
            'to read',
            ['to dance', 'to cook', 'to travel'],
            ['es-leer'],
            { id: 'es.ex.1j4ddb3qh6mkur' },
          ),
          ex.matchPairs(
            [
              ['leer', 'to read'],
              ['bailar', 'to dance'],
              ['viajar', 'to travel'],
              ['cocinar', 'to cook'],
            ],
            ['es-leer', 'es-bailar', 'es-viajar', 'es-cocinar'],
            { id: 'es.ex.n4muy0mgdwbsb1' },
          ),
          ex.fillBlank(
            'Me ___ bailar y cocinar.',
            'I like dancing and cooking.',
            'gusta',
            ['gustan', 'gusto', 'llamo'],
            ['es-me-gusta', 'es-bailar', 'es-cocinar'],
            {
              id: 'es.ex.ebk77f2sub4sls',
              explanation:
                'With verbs, gustar is always singular, even with two of them: me gusta bailar y cocinar.',
            },
          ),
          ex.listenChoice(
            'Me gusta viajar.',
            ['Me gusta bailar.', 'Me gusta leer.', 'Me gusta cocinar.'],
            ['es-viajar'],
            { id: 'es.ex.8m2fpia8mvb1xa' },
          ),
          ex.translationChoice(
            'el tiempo libre',
            'free time',
            ['the weekend', 'the week', 'the morning'],
            ['es-el-tiempo-libre'],
            { id: 'es.ex.3ci3m8egdbaxkm' },
          ),
          ex.orderWords(
            'En mi tiempo libre me gusta leer.',
            'In my free time I like reading.',
            ['es-el-tiempo-libre', 'es-leer'],
            { id: 'es.ex.ulw0uw2yebf572' },
          ),
          question(
            'es.ex.2qnq7t40otdq8t',
            TIEMPO_LIBRE,
            'How does Mateo feel about reading?',
            'He loves it',
            ['He hates it', 'He doesn’t like it at all', 'He prefers dancing'],
            ['es-me-encanta', 'es-leer'],
            'Ana asks “¿te gusta leer?” and Mateo answers “Sí, me encanta”: yes, I love it.',
          ),
          question(
            'es.ex.0u7sc0zv0y86j2',
            TIEMPO_LIBRE,
            'What does Ana love doing?',
            'Dancing',
            ['Reading', 'Cooking', 'Travelling'],
            ['es-bailar'],
            'Ana says “Me encanta bailar”, and she dances salsa on Fridays.',
          ),
          ex.translateWrite('I like cooking.', 'Me gusta cocinar.', ['es-me-gusta', 'es-cocinar'], {
            id: 'es.ex.le9wacuulgqcsz',
          }),
          ex.shortAnswer(
            '¿Te gusta viajar?',
            'Say yes, you love it (e.g. «Sí, me encanta.»).',
            'Sí, me encanta.',
            ['Sí, me encanta viajar.', 'Me encanta.', 'Me encanta viajar.', '¡Sí, me encanta!'],
            ['es-me-encanta', 'es-viajar'],
            { id: 'es.ex.c8n0pkp663r3v6' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Juego al fútbol',
        objective: 'Say which sports and instruments you play, with jugar and tocar.',
        intro: {
          explanation:
            'English “play” is two verbs in Spanish: jugar for games and sports (juego al fútbol: a + el becomes al) and tocar for instruments (toco la guitarra). Jugar changes u to ue: yo juego, tú juegas, él / ella / usted juega (only nosotros keeps the u: jugamos). In Mexico people often drop the al: juego fútbol. Pronunciation: in guitarra the u is silent and the g is hard, like the g in give; the j in juego and jugar sounds like a strong English h.',
          examples: [
            { target: 'Juego al fútbol los domingos.', base: 'I play football on Sundays.' },
            { target: 'Mi hermana toca la guitarra.', base: 'My sister plays the guitar.' },
          ],
        },
        takeaways: [
          'You play sports with jugar al… (juego, tú juegas).',
          'You play instruments with tocar: toco la guitarra.',
        ],
        exercises: [
          ex.translationChoice(
            'jugar',
            'to play',
            ['to dance', 'to go out', 'to read'],
            ['es-jugar'],
            { id: 'es.ex.vvu96mwasdj99c' },
          ),
          ex.fillBlank(
            'Yo ___ al fútbol los sábados.',
            'I play football on Saturdays.',
            'juego',
            ['juegas', 'juega', 'jugar'],
            ['es-juego', 'es-el-futbol'],
            {
              id: 'es.ex.jcrph5d3o8bfed',
              explanation:
                'With yo, jugar becomes juego (u → ue). Juegas is for tú and juega for él, ella or usted.',
            },
          ),
          ex.listenChoice(
            'Juego al fútbol.',
            ['Juegas al fútbol.', 'Juega al fútbol.'],
            ['es-juego', 'es-el-futbol'],
            { id: 'es.ex.5ej3gaknp339vh' },
          ),
          ex.fillBlank(
            '¿Tú ___ al fútbol?',
            'Do you play football?',
            'juegas',
            ['juego', 'juega', 'jugar'],
            ['es-jugar', 'es-el-futbol'],
            {
              id: 'es.ex.slg9hdjq4pgbbp',
              explanation:
                'With tú: juegas. The u changes to ue, as in juego: yo juego, tú juegas, usted juega.',
            },
          ),
          ex.fillBlank(
            'Mi hermano ___ la guitarra.',
            'My brother plays the guitar.',
            'toca',
            ['juega', 'juego', 'toco'],
            ['es-la-guitarra', 'es-jugar'],
            {
              id: 'es.ex.rr9dmzfd4s1z1x',
              explanation:
                'For instruments Spanish uses tocar, not jugar: toca la guitarra. Toco is for yo.',
            },
          ),
          question(
            'es.ex.rkqx00rdesv202',
            FUTBOL,
            'What instrument does Sofía play?',
            'The guitar',
            ['The piano', 'The drums', 'She doesn’t play an instrument'],
            ['es-la-guitarra'],
            'Sofía says “toco la guitarra todos los días”: I play the guitar every day.',
          ),
          question(
            'es.ex.w5ebo4bitdwiq2',
            FUTBOL,
            'When does Martín play football?',
            'On Saturdays',
            ['Every day', 'On Sundays', 'He doesn’t play football'],
            ['es-juego', 'es-el-futbol'],
            'Martín says “Yo juego al fútbol los sábados”.',
          ),
          ex.listenChoice(
            'Me gustan los deportes.',
            ['Me gusta el deporte.', 'Me gustan los perros.', 'No me gustan los deportes.'],
            ['es-me-gusta', 'es-el-deporte'],
            { id: 'es.ex.eqxusmnt7cfw5s' },
          ),
          ex.translateWrite(
            'I play football with my brother.',
            'Juego al fútbol con mi hermano.',
            ['es-juego', 'es-el-futbol', 'es-con'],
            {
              id: 'es.ex.6c4dnpiza55mnv',
              acceptedAnswers: [
                'Yo juego al fútbol con mi hermano.',
                'Juego fútbol con mi hermano.',
                'Yo juego fútbol con mi hermano.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Juegas al fútbol?',
            'Say yes, you play on Sundays (e.g. «Sí, juego los domingos.»).',
            'Sí, juego los domingos.',
            [
              'Sí, juego al fútbol los domingos.',
              'Sí, juego fútbol los domingos.',
              'Sí, los domingos.',
              'Juego los domingos.',
              'Sí, yo juego los domingos.',
            ],
            ['es-juego'],
            { id: 'es.ex.r1kjuc1u8ewwvo' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Prefiero salir',
        objective: 'Say what you prefer, talk about going out with friends, and understand a post.',
        intro: {
          explanation:
            'Prefiero (I prefer) changes e to ie, and so does the tú form: yo prefiero, tú prefieres, él / ella / usted prefiere. To ask a friend: ¿prefieres el té o el café? Salir is to go out: salir con amigos (con = with). In many Spanish-speaking cities, from Madrid to Bogotá, people go out with friends late, especially on Fridays and Saturdays.',
          examples: [
            {
              target: 'Prefiero salir con mis amigos.',
              base: 'I prefer going out with my friends.',
            },
            { target: '¿Prefieres el té o el café?', base: 'Do you prefer tea or coffee?' },
          ],
        },
        takeaways: [
          'You say what you prefer with prefiero and ask a friend ¿prefieres…?',
          'You talk about going out with friends: salir con amigos.',
        ],
        exercises: [
          ex.translationChoice(
            'prefiero',
            'I prefer',
            ['I hate', 'I love', 'I play'],
            ['es-prefiero'],
            { id: 'es.ex.ipwwfwk90vanm8' },
          ),
          ex.translationChoice(
            'salir',
            'to go out',
            ['to travel', 'to dance', 'to play'],
            ['es-salir'],
            { id: 'es.ex.bye1nnpbdf2xkn' },
          ),
          ex.fillBlank(
            '¿Tú ___ el té o el café?',
            'Do you prefer tea or coffee?',
            'prefieres',
            ['prefiero', 'prefiere', 'quiero'],
            ['es-prefiero'],
            {
              id: 'es.ex.3i8pde1mt063ci',
              explanation:
                'With tú: prefieres, with the same e → ie change as prefiero. Prefiero is for yo and prefiere for usted.',
            },
          ),
          ex.listenChoice(
            'Prefiero salir con mis amigos.',
            [
              'Prefiero salir con mis hermanos.',
              'Me gusta salir con mis amigos.',
              'Prefiero viajar con mis amigos.',
            ],
            ['es-prefiero', 'es-salir', 'es-con'],
            { id: 'es.ex.qcrr3x0i5km0wp' },
          ),
          question(
            'es.ex.d5tcf2e3bvdnsy',
            DIEGO,
            'What does Diego love doing in his free time?',
            'Cooking and travelling',
            ['Playing football', 'Reading and dancing', 'Playing the guitar'],
            ['es-el-tiempo-libre', 'es-cocinar', 'es-viajar'],
            'He writes “En mi tiempo libre me encanta cocinar y viajar”.',
          ),
          question(
            'es.ex.j2t11bf65i47gi',
            DIEGO,
            'What does Diego think of football?',
            'He hates it',
            ['He loves it', 'He plays it on Fridays', 'He prefers it to cooking'],
            ['es-odio', 'es-el-futbol'],
            'He writes “No me gustan los deportes: odio el fútbol”.',
          ),
          question(
            'es.ex.ddk1pmptr0xpx5',
            DIEGO,
            'What does Diego prefer doing on Fridays?',
            'Going out with his friends',
            ['Cooking with his family', 'Watching football', 'Staying at home'],
            ['es-prefiero', 'es-salir', 'es-con'],
            'He writes “Prefiero salir con mis amigos los viernes”.',
          ),
          ex.orderWords(
            'Me gusta salir con mis amigos.',
            'I like going out with my friends.',
            ['es-salir', 'es-con'],
            { id: 'es.ex.6o2008yyxgww2d' },
          ),
          ex.translateWrite('I prefer tea.', 'Prefiero el té.', ['es-prefiero'], {
            id: 'es.ex.cct7k0qta7tb1r',
            acceptedAnswers: ['Yo prefiero el té.'],
          }),
          ex.shortAnswer(
            '¿Te gusta el fútbol?',
            'Say you don’t like it at all (e.g. «No, no me gusta para nada.»).',
            'No, no me gusta para nada.',
            ['No, para nada.', 'No me gusta para nada.', 'No, no me gusta para nada el fútbol.'],
            ['es-para-nada', 'es-me-gusta'],
            { id: 'es.ex.63q1xycufq4omu' },
          ),
        ],
      },
    ],
  },
};
