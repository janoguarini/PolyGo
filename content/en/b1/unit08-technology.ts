import type { B1UnitDef } from '../../b1';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from './helpers';

/**
 * B1 U8 «Tecnología y comunicación» (docs/B1_EN.md): oraciones de relativo (who para personas, which y
 * that para cosas, where para lugares); aparatos (turn on, turn off, la batería); internet (apps,
 * contraseñas, log in); redes sociales; seguir en contacto a distancia.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const HELP = dialogue(
  'en.stim.b1-u8-help',
  'Un empleado llama al servicio técnico de su empresa.',
  [
    ['Leo', "Hi. I can't log in to my computer."],
    ['Support', 'Have you changed your password recently?'],
    ['Leo', 'Yes, yesterday. I think I have forgotten the new one.'],
    ['Support', "No problem. I'll send you an email with a link that will help you."],
  ],
);

const APP_REVIEW = reading(
  'en.stim.b1-u8-app',
  'post',
  'Una opinión sobre una aplicación.',
  [
    'Five stars!',
    'This is an app which helps you plan your meals for the week.',
    'You can download it for free, and it works online and offline.',
    'The only thing that I don’t like is the battery: it uses a lot.',
    'I recommend it to people who don’t have much time to cook.',
  ],
  { from: 'Rosa', title: 'Meal planner' },
);

const CALL = dialogue('en.stim.b1-u8-call', 'Tom hace una videollamada con su abuela.', [
  ['Grandma', 'Tom? I can hear you, but I can’t see you.'],
  [
    'Tom',
    'Grandma, you have to turn on the camera. Touch the button which is at the bottom of the screen.',
  ],
  ['Grandma', 'Oh! Now I can see you. This video call is wonderful.'],
  ['Tom', "It's the best way to keep in touch. Let's do it every Sunday!"],
]);

const SOCIAL = reading(
  'en.stim.b1-u8-social',
  'post',
  'Una persona cuenta por qué usa menos las redes.',
  [
    'Last month I decided to spend less time on social media.',
    'I turned off my phone notifications, and I only check my apps at night.',
    'I still share photos with the people who are important to me.',
    'I have fewer followers now, but I have more time to read and see my friends.',
  ],
  { from: 'Kate', title: 'Less screen time' },
);

export const EN_B1_U08: B1UnitDef = {
  names: ['Leo', 'Support', 'Rosa', 'Tom', 'Grandma', 'Kate', 'Italy', 'PolyGo'],
  support: [
    'changed',
    'link',
    'stars',
    'meal',
    'offline',
    'recommend',
    'button',
    'bottom',
    'wonderful',
    'less',
    'notifications',
    'fewer',
    'internet',
    'power',
    'light',
    'during',
    'low',
    'broken',
    'line',
    'account',
    'tablet',
    'carry',
  ],
  unit: {
    position: 8,
    title: 'Tecnología y comunicación',
    titleEn: 'Technology and communication',
    description:
      'Explicar qué es algo o quién es alguien (who, which, that, where), aparatos, internet, redes sociales y videollamadas.',
    emoji: '📱',
    objective:
      'Puedes explicar para qué sirve un aparato o una app, resolver problemas simples de tecnología y contar cómo te comunicas.',
    grammar: {
      title: 'Oraciones de relativo',
      explanation:
        'Who se refiere a personas (the woman who lives next door); which y that, a cosas (an app which/that helps you); where, a lugares (the cafe where we met). Así explicas qué es algo sin empezar otra oración.',
      examples: [
        { target: 'She is the teacher who helped me.', base: 'Es la profesora que me ayudó.' },
        {
          target: 'This is an app that helps you learn words.',
          base: 'Es una app que te ayuda a aprender palabras.',
        },
        { target: 'That is the cafe where we met.', base: 'Ese es el café donde nos conocimos.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B1: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-device',
        'device',
        'dispositivo / aparato',
        '/dɪˈvaɪs/',
        undefined,
        'A tablet is a device which you can carry.',
        'Una tableta es un aparato que puedes llevar.',
        ['technology'],
        ['dispositivo', 'aparato'],
      ),
      w(
        'en-screen',
        'screen',
        'pantalla',
        '/skrin/',
        '🖥️',
        'The screen of my phone is broken.',
        'La pantalla de mi teléfono está rota.',
        ['technology'],
      ),
      w(
        'en-battery',
        'battery',
        'batería',
        '/ˈbætəri/',
        '🔋',
        'My battery is low.',
        'Tengo poca batería.',
        ['technology'],
        ['pila'],
      ),
      w(
        'en-charger',
        'charger',
        'cargador',
        '/ˈtʃɑrdʒər/',
        '🔌',
        'Can I use your charger?',
        '¿Puedo usar tu cargador?',
        ['technology'],
      ),
      w(
        'en-turn-on',
        'turn on',
        'prender / encender',
        '/ˈtɜrn ˈɑn/',
        undefined,
        'Turn on the light, please.',
        'Prende la luz, por favor.',
        ['technology', 'phrasal-verbs'],
        ['prender', 'encender'],
      ),
      w(
        'en-turn-off',
        'turn off',
        'apagar',
        '/ˈtɜrn ˈɔf/',
        undefined,
        'Please turn off your phones.',
        'Por favor, apaguen los teléfonos.',
        ['technology', 'phrasal-verbs'],
      ),
      w(
        'en-app',
        'app',
        'aplicación / app',
        '/æp/',
        '📲',
        'I use an app to learn English.',
        'Uso una app para aprender inglés.',
        ['technology'],
        ['aplicación', 'app'],
      ),
      w(
        'en-download',
        'download',
        'descargar / bajar',
        '/ˈdaʊnˌloʊd/',
        '⬇️',
        'You can download the app for free.',
        'Puedes descargar la app gratis.',
        ['technology', 'verbs'],
        ['descargar', 'bajar'],
      ),
      w(
        'en-upload',
        'upload',
        'subir (a internet)',
        '/ˈʌpˌloʊd/',
        '⬆️',
        'I uploaded the photos last night.',
        'Anoche subí las fotos.',
        ['technology', 'verbs'],
      ),
      w(
        'en-password',
        'password',
        'contraseña',
        '/ˈpæsˌwɜrd/',
        '🔑',
        'I have forgotten my password.',
        'Me olvidé la contraseña.',
        ['technology'],
        ['clave'],
      ),
      w(
        'en-log-in',
        'log in',
        'iniciar sesión / entrar',
        '/ˈlɔɡ ˈɪn/',
        undefined,
        "I can't log in to my account.",
        'No puedo entrar a mi cuenta.',
        ['technology', 'phrasal-verbs'],
        ['iniciar sesión', 'entrar'],
      ),
      w(
        'en-online',
        'online',
        'en línea / por internet',
        '/ˌɑnˈlaɪn/',
        '🌐',
        'I buy my clothes online.',
        'Compro la ropa por internet.',
        ['technology'],
        ['en línea', 'por internet', 'online'],
      ),
      w(
        'en-social-media',
        'social media',
        'redes sociales',
        '/ˈsoʊʃəl ˈmidiə/',
        undefined,
        'I spend too much time on social media.',
        'Paso demasiado tiempo en las redes sociales.',
        ['technology', 'communication'],
      ),
      w(
        'en-post',
        'post',
        'publicar / publicación',
        '/poʊst/',
        undefined,
        'She posts a photo every day.',
        'Publica una foto todos los días.',
        ['technology', 'communication'],
        ['publicar', 'publicación', 'posteo'],
      ),
      w(
        'en-follower',
        'follower',
        'seguidor / seguidora',
        '/ˈfɑloʊər/',
        undefined,
        'He has a lot of followers.',
        'Tiene muchos seguidores.',
        ['technology', 'communication'],
        ['seguidor', 'seguidora'],
      ),
      w(
        'en-share',
        'share',
        'compartir',
        '/ʃɛr/',
        undefined,
        'I share my photos with my family.',
        'Comparto mis fotos con mi familia.',
        ['technology', 'verbs'],
      ),
      w(
        'en-video-call',
        'video call',
        'videollamada',
        '/ˈvɪdioʊ ˌkɔl/',
        '📹',
        'We have a video call every Sunday.',
        'Hacemos una videollamada todos los domingos.',
        ['technology', 'communication'],
      ),
      w(
        'en-keep-in-touch',
        'keep in touch',
        'seguir en contacto',
        '/ˈkip ɪn ˈtʌtʃ/',
        undefined,
        "Let's keep in touch!",
        '¡Sigamos en contacto!',
        ['communication'],
        ['mantenerse en contacto', 'estar en contacto'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Aparatos',
        objective: 'Hablar de aparatos y explicar para qué sirven con which y that.',
        intro: {
          explanation:
            'Para explicar qué es una cosa: which o that + verbo (a device which/that you can carry). Turn on es prender; turn off, apagar. El objeto puede ir en el medio: turn it on, turn the light off.',
          examples: [
            {
              target: 'A charger is a thing which gives power to your phone.',
              base: 'Un cargador es algo que le da energía al teléfono.',
            },
            { target: 'Please turn off your phones.', base: 'Por favor, apaguen los teléfonos.' },
          ],
        },
        takeaways: [
          'Explicas qué es algo con which y that.',
          'Prendes y apagas aparatos: turn on, turn off.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['screen', 'pantalla'],
              ['battery', 'batería'],
              ['charger', 'cargador'],
              ['device', 'dispositivo / aparato'],
            ],
            ['en-screen', 'en-battery', 'en-charger', 'en-device'],
            { id: 'en.ex.vov23mcl0wiwcb' },
          ),
          ex.imageChoice('🔋', 'battery', ['charger', 'screen', 'device'], ['en-battery'], {
            id: 'en.ex.gea9tkhg6d0woe',
          }),
          ex.fillBlank(
            'A charger is a thing ___ gives power to your phone.',
            'Un cargador es algo que le da energía al teléfono.',
            'which',
            ['who', 'where', 'when'],
            ['en-charger', 'en-which'],
            {
              id: 'en.ex.8f1q84gj7bt24h',
              explanation: 'Para cosas: which o that. Who es para personas.',
            },
          ),
          ex.fillBlank(
            "It's dark. Can you turn ___ the light?",
            'Está oscuro. ¿Puedes prender la luz?',
            'on',
            ['off', 'up', 'in'],
            ['en-turn-on', 'en-dark'],
            { id: 'en.ex.lbdxai1fwcet2j', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'Please turn ___ your phones during the movie.',
            'Por favor, apaguen los teléfonos durante la película.',
            'off',
            ['on', 'out', 'in'],
            ['en-turn-off', 'en-movie'],
            { id: 'en.ex.dcok2cbw82x7dj', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'My battery is low. Can I use your charger?',
            [
              'My battery is low. Can I use your phone?',
              'My battery is full. Can I use your charger?',
              'My battery is low. Can you use your charger?',
            ],
            ['en-battery', 'en-charger'],
            { id: 'en.ex.hvvth36yxhj7c8' },
          ),
          ex.orderWords(
            'The screen of my phone is broken.',
            'La pantalla de mi teléfono está rota.',
            ['en-screen', 'en-phone'],
            { id: 'en.ex.axbzdtajhn76jq' },
          ),
          ex.shortAnswer(
            'What is a charger? (algo que le da energía a tu teléfono)',
            '¿Qué es un cargador?',
            'It is a thing which gives power to your phone.',
            [
              'It is a thing that gives power to your phone.',
              "It's a thing which gives power to your phone.",
              "It's a thing that gives power to your phone.",
              'A thing that gives power to your phone.',
            ],
            ['en-charger', 'en-which'],
            { id: 'en.ex.fzd3zzrbrjlped' },
          ),
          ex.translateWrite(
            'Apaga la computadora, por favor.',
            'Turn off the computer, please.',
            ['en-turn-off', 'en-computer'],
            {
              id: 'en.ex.zls2air9kbzznl',
              acceptedAnswers: [
                'Please turn off the computer.',
                'Turn the computer off, please.',
                'Please turn the computer off.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Gente y lugares',
        objective: 'Describir personas con who y lugares con where; seguir en contacto.',
        intro: {
          explanation:
            'Who explica quién es una persona: my friend who lives in Italy. Where explica un lugar: the cafe where we met. Para no perder el contacto: keep in touch, a video call (una videollamada).',
          examples: [
            {
              target: 'I have a friend who lives in Italy.',
              base: 'Tengo un amigo que vive en Italia.',
            },
            {
              target: 'That is the cafe where we met.',
              base: 'Ese es el café donde nos conocimos.',
            },
          ],
        },
        takeaways: [
          'Describes personas con who y lugares con where.',
          'Hablas de cómo sigues en contacto: a video call.',
        ],
        exercises: [
          ex.fillBlank(
            'I have a friend ___ lives in Italy.',
            'Tengo un amigo que vive en Italia.',
            'who',
            ['which', 'where', 'what'],
            ['en-who', 'en-friend'],
            {
              id: 'en.ex.b23yp54eoltpw8',
              explanation: 'Para personas: who (o that).',
            },
          ),
          ex.fillBlank(
            'That is the cafe ___ we met.',
            'Ese es el café donde nos conocimos.',
            'where',
            ['who', 'which', 'when'],
            ['en-where', 'en-met'],
            {
              id: 'en.ex.fi4jq8atited3z',
              explanation: 'Para lugares: where.',
            },
          ),
          ex.fillBlank(
            "Let's keep in ___!",
            '¡Sigamos en contacto!',
            'touch',
            ['call', 'line', 'time'],
            ['en-keep-in-touch'],
            { id: 'en.ex.r05pwzopfpgmfm', skill: 'vocabulary' },
          ),
          question(
            'en.ex.tm2kzsrranq1jc',
            CALL,
            '¿Qué problema tiene la abuela al principio?',
            'Oye a Tom, pero no lo ve',
            ['No oye a Tom', 'No tiene batería', 'No sabe prender la computadora'],
            ['en-video-call'],
            'La abuela dice: «I can hear you, but I can’t see you».',
          ),
          question(
            'en.ex.lj8ia5evtkv2eq',
            CALL,
            '¿Qué proponen al final?',
            'Hacer una videollamada todos los domingos',
            ['Visitarse los domingos', 'Llamarse por teléfono', 'Escribirse mensajes'],
            ['en-keep-in-touch', 'en-sunday'],
            "Tom dice: «It's the best way to keep in touch. Let's do it every Sunday!».",
          ),
          ex.listenChoice(
            'We have a video call every Sunday.',
            [
              'We have a video call every Saturday.',
              'We had a video call every Sunday.',
              'We have a phone call every Sunday.',
            ],
            ['en-video-call', 'en-sunday'],
            { id: 'en.ex.tam07lz0r9m1gt' },
          ),
          ex.orderWords(
            'She is the teacher who helped me.',
            'Es la profesora que me ayudó.',
            ['en-who', 'en-teacher', 'en-help'],
            { id: 'en.ex.ztohvaq5hnn52k' },
          ),
          ex.shortAnswer(
            'Who is Ana? (la chica que vive al lado)',
            '¿Quién es Ana?',
            'She is the girl who lives next door.',
            [
              "She's the girl who lives next door.",
              'The girl who lives next door.',
              'She is the girl that lives next door.',
              "She's the girl that lives next door.",
            ],
            ['en-who', 'en-girl'],
            { id: 'en.ex.myf6l1iug0j517' },
          ),
          ex.translateWrite(
            'Es el restaurante donde trabajo.',
            'It is the restaurant where I work.',
            ['en-where', 'en-restaurant'],
            {
              id: 'en.ex.cwl1hhuiio13vr',
              acceptedAnswers: [
                "It's the restaurant where I work.",
                'This is the restaurant where I work.',
                'That is the restaurant where I work.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Internet',
        objective: 'Usar apps y resolver problemas con contraseñas y el inicio de sesión.',
        intro: {
          explanation:
            "Download es descargar y upload, subir. Log in es entrar a una cuenta (log in to your account). Password es la contraseña. Para pedir ayuda: I can't log in. I have forgotten my password.",
          examples: [
            {
              target: 'You can download the app for free.',
              base: 'Puedes descargar la app gratis.',
            },
            { target: 'I have forgotten my password.', base: 'Me olvidé la contraseña.' },
          ],
        },
        takeaways: [
          'Descargas y subes archivos: download, upload.',
          "Explicas un problema: I can't log in, I have forgotten my password.",
        ],
        exercises: [
          ex.matchPairs(
            [
              ['download', 'descargar / bajar'],
              ['upload', 'subir (a internet)'],
              ['password', 'contraseña'],
              ['log in', 'iniciar sesión / entrar'],
            ],
            ['en-download', 'en-upload', 'en-password', 'en-log-in'],
            { id: 'en.ex.oyrjonqwa85lq6' },
          ),
          ex.fillBlank(
            'You can ___ the app for free.',
            'Puedes descargar la app gratis.',
            'download',
            ['upload', 'turn on', 'log in'],
            ['en-download', 'en-app'],
            { id: 'en.ex.blxsynr9dglv5h', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'I ___ the photos from the party last night.',
            'Anoche subí las fotos de la fiesta.',
            'uploaded',
            ['downloaded', 'turned off', 'logged'],
            ['en-upload', 'en-photo'],
            { id: 'en.ex.i0noqm8ui1h8vd', skill: 'vocabulary' },
          ),
          question(
            'en.ex.8uqi32skmkaafo',
            HELP,
            '¿Qué problema tiene Leo?',
            'No puede entrar a su computadora',
            ['Se le rompió la pantalla', 'No le llegan los mails', 'No tiene internet'],
            ['en-log-in'],
            "Leo dice: «I can't log in to my computer».",
          ),
          question(
            'en.ex.ihnep537vv8brt',
            HELP,
            '¿Por qué no puede entrar?',
            'Se olvidó la contraseña nueva',
            ['Nunca tuvo contraseña', 'La computadora está apagada', 'La app no funciona'],
            ['en-password'],
            'Leo dice: «I think I have forgotten the new one» (la contraseña que cambió ayer).',
          ),
          ex.listenChoice(
            'I have forgotten my password.',
            [
              'I have changed my password.',
              'I have forgotten my phone.',
              'She has forgotten her password.',
            ],
            ['en-password', 'en-forgotten'],
            { id: 'en.ex.b5gwd50jamf0mq' },
          ),
          ex.orderWords(
            'I use an app to learn English.',
            'Uso una app para aprender inglés.',
            ['en-app', 'en-learn'],
            { id: 'en.ex.yivjwsx0wwvbst' },
          ),
          ex.translateWrite(
            'No puedo entrar a mi cuenta.',
            "I can't log in to my account.",
            ['en-log-in'],
            {
              id: 'en.ex.e4m9ysm8ek95mj',
              acceptedAnswers: [
                'I cannot log in to my account.',
                "I can't log into my account.",
                'I cannot log into my account.',
              ],
            },
          ),
          ex.translateWrite(
            'Me olvidé la contraseña.',
            'I have forgotten my password.',
            ['en-password', 'en-forgotten'],
            {
              id: 'en.ex.96cdw39pnu9dsf',
              acceptedAnswers: ["I've forgotten my password.", 'I forgot my password.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Redes sociales',
        objective: 'Hablar de cómo usas las redes: publicar, compartir, seguidores.',
        intro: {
          explanation:
            'Social media son las redes sociales. Post es publicar (y una publicación); share, compartir; follower, seguidor. Online es «en línea» o «por internet»: I buy clothes online.',
          examples: [
            { target: 'She posts a photo every day.', base: 'Publica una foto todos los días.' },
            {
              target: 'I spend too much time on social media.',
              base: 'Paso demasiado tiempo en las redes.',
            },
          ],
        },
        takeaways: [
          'Cuentas cómo usas las redes sociales.',
          'Usas post, share, follower y online.',
        ],
        exercises: [
          ex.translationChoice(
            'share',
            'compartir',
            ['publicar / publicación', 'descargar / bajar', 'apagar'],
            ['en-share'],
            { id: 'en.ex.lkt2bajnsnorow' },
          ),
          ex.fillBlank(
            'She ___ a photo every day.',
            'Publica una foto todos los días.',
            'posts',
            ['shares', 'downloads', 'logs'],
            ['en-post', 'en-photo'],
            { id: 'en.ex.lygpr078ylexl1', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'He has thousands of ___.',
            'Tiene miles de seguidores.',
            'followers',
            ['screens', 'devices', 'passwords'],
            ['en-follower'],
            { id: 'en.ex.t8e6jdvs29863o', skill: 'vocabulary' },
          ),
          question(
            'en.ex.ovfbqzjf6ggd37',
            SOCIAL,
            '¿Qué decidió Kate el mes pasado?',
            'Pasar menos tiempo en las redes sociales',
            ['Cerrar sus cuentas', 'Comprar un teléfono nuevo', 'Publicar más fotos'],
            ['en-social-media'],
            'Kate escribe: «Last month I decided to spend less time on social media».',
          ),
          question(
            'en.ex.s4qj3dabmnrbbj',
            SOCIAL,
            '¿Con quién sigue compartiendo fotos?',
            'Con la gente que es importante para ella',
            ['Con todos sus seguidores', 'Con nadie', 'Sólo con su familia'],
            ['en-share', 'en-who'],
            'Kate escribe: «I still share photos with the people who are important to me».',
          ),
          ex.listenChoice(
            'I buy my clothes online.',
            ['I buy my shoes online.', 'I bought my clothes online.', 'I sell my clothes online.'],
            ['en-online', 'en-clothes'],
            { id: 'en.ex.w6pziyikdq0d7e' },
          ),
          ex.orderWords(
            'I share my photos with my family.',
            'Comparto mis fotos con mi familia.',
            ['en-share', 'en-photo', 'en-family'],
            { id: 'en.ex.phxow6ejq5a4ik' },
          ),
          ex.shortAnswer(
            'How much time do you spend on social media? (una hora por día)',
            '¿Cuánto tiempo pasas en las redes?',
            'One hour a day.',
            ['About one hour a day.', 'I spend one hour a day on social media.', 'An hour a day.'],
            ['en-social-media'],
            { id: 'en.ex.vukbmewrchpj8m' },
          ),
          ex.translateWrite(
            'Paso demasiado tiempo en las redes sociales.',
            'I spend too much time on social media.',
            ['en-social-media'],
            {
              id: 'en.ex.ta5xig0zh7kxo1',
              acceptedAnswers: ['I spend too much time on the social media.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Recomendar una app',
        objective: 'Explicar qué hace una app y a quién se la recomiendas.',
        intro: {
          explanation:
            'Para recomendar: It is an app which/that helps you… I recommend it to people who… Así combinas which/that (para la app) y who (para la gente).',
          examples: [
            {
              target: 'It is an app which helps you plan your meals.',
              base: 'Es una app que te ayuda a planificar las comidas.',
            },
            {
              target: 'I recommend it to people who travel a lot.',
              base: 'Se la recomiendo a la gente que viaja mucho.',
            },
          ],
        },
        takeaways: [
          'Explicas qué hace una app con which o that.',
          'Dices a quién se la recomiendas con who.',
        ],
        exercises: [
          question(
            'en.ex.du3i6y8hy86rz9',
            APP_REVIEW,
            '¿Para qué sirve la app?',
            'Para planificar las comidas de la semana',
            ['Para aprender a cocinar', 'Para comprar comida por internet', 'Para contar calorías'],
            ['en-app', 'en-which'],
            'Rosa escribe: «This is an app which helps you plan your meals for the week».',
          ),
          question(
            'en.ex.lmul25cjd4uu80',
            APP_REVIEW,
            '¿Qué no le gusta a Rosa?',
            'Que usa mucha batería',
            ['Que cuesta caro', 'Que sólo funciona en línea', 'Que es difícil de usar'],
            ['en-battery'],
            'Rosa escribe: «The only thing that I don’t like is the battery: it uses a lot».',
          ),
          ex.fillBlank(
            'It is an app ___ helps you learn words.',
            'Es una app que te ayuda a aprender palabras.',
            'that',
            ['who', 'where', 'what'],
            ['en-app', 'en-learn'],
            { id: 'en.ex.ziwhf4ggijd675' },
          ),
          ex.fillBlank(
            'I recommend it to people ___ travel a lot.',
            'Se la recomiendo a la gente que viaja mucho.',
            'who',
            ['which', 'where', 'what'],
            ['en-who', 'en-travel'],
            { id: 'en.ex.a9cyj2bklfw4qs' },
          ),
          ex.fillBlank(
            'You can use the app ___ without internet.',
            'Puedes usar la app por internet o sin internet.',
            'online or',
            ['offline and', 'turn on or', 'log in or'],
            ['en-online', 'en-app'],
            { id: 'en.ex.j49kyjv3hitv82', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'You can download it for free.',
            [
              'You can upload it for free.',
              'You can download it for a dollar.',
              'We can download it for free.',
            ],
            ['en-download'],
            { id: 'en.ex.mh9ovpknzud4cc' },
          ),
          ex.orderWords(
            'This is the app that I use every day.',
            'Esta es la app que uso todos los días.',
            ['en-app', 'en-every-day'],
            { id: 'en.ex.h66byp4fd0g78e' },
          ),
          ex.shortAnswer(
            'Which app do you use to learn English? (PolyGo, una app que te ayuda a aprender palabras)',
            '¿Qué app usas para aprender inglés?',
            'PolyGo. It is an app that helps you learn words.',
            [
              'PolyGo. It is an app which helps you learn words.',
              "PolyGo. It's an app that helps you learn words.",
              "PolyGo. It's an app which helps you learn words.",
              'PolyGo, an app that helps you learn words.',
            ],
            ['en-app', 'en-learn'],
            { id: 'en.ex.jwbqwxk36uvles' },
          ),
          ex.translateWrite(
            'Es una app que te ayuda a ahorrar.',
            'It is an app that helps you save money.',
            ['en-app', 'en-save'],
            {
              id: 'en.ex.xm956oerpq56vl',
              acceptedAnswers: [
                "It's an app that helps you save money.",
                'It is an app which helps you save money.',
                "It's an app which helps you save money.",
                'It is an app that helps you save.',
                'It is an app which helps you save.',
              ],
            },
          ),
        ],
      },
    ],
  },
};
