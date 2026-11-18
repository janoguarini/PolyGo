import type { EsUnitDef } from '../../es-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Español A2 U10 «Technology» (docs/ES_A1_A2.md): la computadora, el celular, los mensajes y los
 * mails; mandar, recibir, llamar, bajar (descargar) y andar (= funcionar en la Argentina: la compu no
 * anda). Pronombres de objeto directo (lo, la, los, las) e indirecto (le, les) delante del verbo
 * conjugado (lo llamo, la veo, le escribo, les hablo), le + lo = se lo (se lo mando), y detrás del
 * infinitivo (voy a llamarlo = lo voy a llamar).
 * Pronunciación: la ll rehilada de llamo y pantalla, y la ñ de contraseña.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const COMPU = dialogue(
  'es.stim.a2-u10-compu',
  'Marta calls her grandson Nico because her computer has a problem.',
  [
    ['Marta', '¡Hola, Nico! La computadora no anda y no puedo leer los mails.'],
    ['Nico', 'Hola, abuela. ¿Qué pasó con la pantalla?'],
    ['Marta', 'Está negra. Y ayer cambié la contraseña, pero me olvidé la nueva.'],
    ['Nico', 'Tranquila, abuela. Esta tarde voy a tu casa y lo vemos.'],
    ['Marta', '¡Gracias! ¿Llamo a tu mamá?'],
    ['Nico', 'No, yo la llamo ahora.'],
  ],
);

const FACULTAD = reading(
  'es.stim.a2-u10-facultad',
  'message',
  'A text message from Valentina (Valen) to her dad.',
  [
    '¡Hola, papá!',
    'Te mando el mail de la facultad con el horario de los exámenes. ¿Lo recibiste?',
    'Para leerlo, tenés que bajar la app de la facultad.',
    'La contraseña te la mando por mensaje.',
    '¿No anda? Llamame esta noche.',
    'Besos, Valen',
  ],
  { from: 'Valen', to: 'Papá' },
);

export const ES_A2_U10: EsUnitDef = {
  names: ['Marta', 'Nico', 'Valen', 'Martín', 'Sofía', 'Juan', 'Diego', 'Camila', 'Ana'],
  support: [
    'anda',
    'manda',
    'mandás',
    'mandé',
    'mandaste',
    'bajé',
    'bajaste',
    'recibí',
    'recibiste',
    'llamame',
    'llamarlo',
    'llamarla',
    'leerlo',
    'cambié',
    'olvidé',
    'nuevo',
    'tranquilo',
    'horario',
    'besos',
  ],
  unit: {
    position: 10,
    title: 'Technology',
    titleEn: 'Tecnología',
    description:
      'Talk about computers, phones, messages and emails, and use object pronouns: lo llamo, la veo, le escribo, les hablo, se lo mando.',
    emoji: '💻',
    objective:
      'You can talk about your computer and phone, say that something isn’t working, send and receive messages and emails, and avoid repeating nouns with lo, la, le, les and se lo.',
    grammar: {
      title: 'Object pronouns: lo, la, le, les · se lo',
      explanation:
        'To avoid repeating a noun, Spanish uses object pronouns. For the person or thing that receives the action directly: lo (him, it, masculine), la (her, it, feminine), los and las (them). For the person something is sent, written or said to: le (to him, to her, to you with usted) and les (to them, to ustedes). With a conjugated verb, the pronoun goes BEFORE it, unlike English: lo llamo (I call him), no la veo (I don’t see her), le escribo (I write to him). Spanish usually keeps the person too: le escribo a Diego. When le meets lo or la, le becomes se: se lo mando (I send it to him), never “le lo”. With an infinitive the pronoun can also be attached to the end: voy a llamarlo = lo voy a llamar. In Argentina, andar is also used for devices: la compu no anda (the computer isn’t working).',
      examples: [
        { target: '¿Y Martín? — Lo llamo ahora.', base: 'What about Martín? — I’ll call him now.' },
        {
          target: 'Le escribo un mail a la profesora.',
          base: 'I’m writing an email to the teacher.',
        },
        {
          target: '¿El mail para Juan? Se lo mando hoy.',
          base: 'The email for Juan? I’ll send it to him today.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U10). Sin revisión nativa: revisar «me olvidé la contraseña» (lo coloquial en la Argentina; la norma pide «me olvidé de la contraseña»), «ya se lo mando» con «ya» = enseguida, «la compu» como forma aceptada y «el mail» (también se dice «el correo»). Se enseña «se lo» y se muestra «te la mando» en la lectura sin explicarlo a fondo.',
    },
    words: [
      w(
        'es-la-computadora',
        'la computadora',
        'the computer',
        'Trabajo con la computadora todos los días.',
        'I work on the computer every day.',
        ['technology'],
        { acceptedTexts: ['la compu'], emoji: '💻' },
      ),
      w(
        'es-mandar',
        'mandar',
        'to send',
        'Te mando un mensaje esta noche.',
        'I’ll send you a message tonight.',
        ['technology', 'verbs'],
      ),
      w(
        'es-recibir',
        'recibir',
        'to receive',
        '¿Recibiste mi mail?',
        'Did you get my email?',
        ['technology', 'verbs'],
        { acceptedTranslations: ['to get'] },
      ),
      w(
        'es-el-mensaje',
        'el mensaje',
        'the message',
        'Mi mamá me manda mensajes todos los días.',
        'My mom sends me messages every day.',
        ['technology'],
        { acceptedTranslations: ['the text'], emoji: '💬' },
      ),
      w(
        'es-el-mail',
        'el mail',
        'the email',
        'Le escribo un mail a la profesora.',
        'I’m writing an email to the teacher.',
        ['technology'],
        { acceptedTranslations: ['the e-mail'], emoji: '📧' },
      ),
      w(
        'es-llamar',
        'llamar',
        'to call',
        'Voy a llamar a mi abuela.',
        'I’m going to call my grandmother.',
        ['technology', 'verbs'],
        { acceptedTranslations: ['to phone'], emoji: '📞' },
      ),
      w(
        'es-bajar',
        'bajar',
        'to download',
        'Ayer bajé la app del banco.',
        'Yesterday I downloaded the bank app.',
        ['technology', 'verbs'],
        { acceptedTexts: ['descargar'] },
      ),
      w(
        'es-la-app',
        'la app',
        'the app',
        'La app del banco no anda.',
        'The bank app isn’t working.',
        ['technology'],
        { emoji: '📱' },
      ),
      w(
        'es-la-contrasena',
        'la contraseña',
        'the password',
        'Me olvidé la contraseña.',
        'I forgot the password.',
        ['technology'],
        { emoji: '🔑' },
      ),
      w(
        'es-conectado',
        'conectado',
        'online',
        '¿Estás conectada? — Sí, estoy en la computadora.',
        'Are you online? — Yes, I’m on the computer.',
        ['technology'],
        { acceptedTranslations: ['connected'], acceptedTexts: ['conectada'] },
      ),
      w(
        'es-la-pantalla',
        'la pantalla',
        'the screen',
        'La pantalla del celular es muy chica.',
        'The phone screen is very small.',
        ['technology'],
      ),
      w(
        'es-andar',
        'andar',
        'to work (a device)',
        'El celular no anda.',
        'The phone isn’t working.',
        ['technology', 'argentina'],
      ),
      w(
        'es-lo-llamo',
        'lo llamo',
        'I call him',
        'Martín no está. Lo llamo mañana.',
        'Martín isn’t here. I’ll call him tomorrow.',
        ['pronouns'],
        { acceptedTranslations: ["I'll call him"] },
      ),
      w(
        'es-la-veo',
        'la veo',
        'I see her',
        '¿Y Sofía? — La veo hoy en la facultad.',
        'What about Sofía? — I’m seeing her today at college.',
        ['pronouns'],
      ),
      w(
        'es-le-escribo',
        'le escribo',
        'I write to him',
        'Le escribo un mensaje a Diego.',
        'I’m writing Diego a message.',
        ['pronouns'],
        { acceptedTranslations: ['I write to her'] },
      ),
      w(
        'es-les-hablo',
        'les hablo',
        'I talk to them',
        'Les hablo a los estudiantes en inglés.',
        'I talk to the students in English.',
        ['pronouns'],
        { acceptedTranslations: ['I speak to them'] },
      ),
      w(
        'es-se-lo-mando',
        'se lo mando',
        'I send it to him',
        '¿El mail para Juan? Ya se lo mando.',
        'The email for Juan? I’ll send it to him right away.',
        ['pronouns'],
        { acceptedTranslations: ["I'll send it to her"] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'La compu y el celular',
        objective:
          'Name the parts of your digital life: computer, screen, app, password, messages.',
        intro: {
          explanation:
            'In Argentina a computer is la computadora (informally la compu) and a mobile phone is el celular. Emails are el mail, borrowed from English, and an app is la app. Watch the gender: la pantalla and la contraseña are feminine, el mensaje is masculine even though it ends in -e. The ñ of contraseña sounds like the ny in canyon. Conectado means online; for a woman, conectada.',
          examples: [
            {
              target: 'La pantalla de la computadora es grande.',
              base: 'The computer screen is big.',
            },
            {
              target: '¿Estás conectado? — Sí, estoy en la compu.',
              base: 'Are you online? — Yes, I’m on the computer.',
            },
          ],
        },
        takeaways: [
          'You name the computer, the screen, the app, the password, messages and emails.',
          'You say someone is online with conectado or conectada.',
        ],
        exercises: [
          ex.translationChoice(
            'la computadora',
            'the computer',
            ['the cell phone', 'the screen', 'the key'],
            ['es-la-computadora'],
            { id: 'es.ex.ba0om42kqtdmiq' },
          ),
          ex.translationChoice(
            'la pantalla',
            'the screen',
            ['the password', 'the window', 'the door'],
            ['es-la-pantalla'],
            { id: 'es.ex.97pqzruokmcc6u' },
          ),
          ex.matchPairs(
            [
              ['la app', 'the app'],
              ['la contraseña', 'the password'],
              ['el mensaje', 'the message'],
              ['el mail', 'the email'],
            ],
            ['es-la-app', 'es-la-contrasena', 'es-el-mensaje', 'es-el-mail'],
            { id: 'es.ex.rzdmubi5wuhhox' },
          ),
          ex.listenChoice(
            'Mi contraseña es larga.',
            ['Mi contraseña es corta.', 'Mi pantalla es larga.', 'Tu contraseña es larga.'],
            ['es-la-contrasena'],
            { id: 'es.ex.rxwsu3lre9mffz' },
          ),
          ex.fillBlank(
            'La ___ del celular es muy chica.',
            'The phone screen is very small.',
            'pantalla',
            ['contraseña', 'llave', 'silla'],
            ['es-la-pantalla'],
            {
              id: 'es.ex.ok215asvwgxlbs',
              skill: 'vocabulary',
              explanation:
                'La pantalla is the screen. Spanish says “the screen of the phone”: la pantalla del celular. The ll sounds like the sh in shoe in Buenos Aires.',
            },
          ),
          ex.translationChoice(
            'conectado',
            'online',
            ['tired', 'happy', 'busy'],
            ['es-conectado'],
            { id: 'es.ex.s81714f0p3y6ud' },
          ),
          ex.fillBlank(
            '¿Estás ___? — Sí, estoy en la computadora.',
            'Are you online? — Yes, I’m on the computer.',
            'conectado',
            ['cansado', 'contento', 'grande'],
            ['es-conectado', 'es-la-computadora'],
            {
              id: 'es.ex.4fxpjrgz177f4r',
              skill: 'vocabulary',
              explanation:
                'Conectado means online. It goes with estar, like cansado or contento, and changes for a woman: conectada.',
            },
          ),
          ex.fillBlank(
            '___ mensaje de mi mamá es largo.',
            'My mom’s message is long.',
            'El',
            ['La', 'Los'],
            ['es-el-mensaje'],
            {
              id: 'es.ex.16fecrxkd2vwck',
              skill: 'grammar',
              explanation:
                'Mensaje is masculine (el mensaje) even though it ends in -e. Pantalla and contraseña are feminine.',
            },
          ),
          ex.translateWrite(
            'The computer screen is big.',
            'La pantalla de la computadora es grande.',
            ['es-la-pantalla', 'es-la-computadora'],
            { id: 'es.ex.z2lh6bpkuoag50', acceptedAnswers: ['La pantalla de la compu es grande.'] },
          ),
          ex.translateWrite(
            'I have a message from my mom.',
            'Tengo un mensaje de mi mamá.',
            ['es-el-mensaje'],
            { id: 'es.ex.kbx3n4wdewuhdv', acceptedAnswers: ['Tengo un mensaje de mamá.'] },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Mandar, recibir, bajar',
        objective: 'Say what you send, receive, download and call, and say a device isn’t working.',
        intro: {
          explanation:
            'Mandar (to send), llamar (to call) and bajar (to download) are regular -ar verbs: in the past, mandé, llamé, bajé (I) and mandaste, llamaste, bajaste (vos). Recibir (to receive) is an -ir verb: recibí, recibiste. Bajar literally means to go down; in Argentina it is the everyday word for downloading (descargar is also correct). With a person, llamar needs a: llamo a mi abuela. And for devices, Argentinians say andar: el celular no anda (the phone isn’t working).',
          examples: [
            { target: 'Ayer bajé la app del banco.', base: 'Yesterday I downloaded the bank app.' },
            { target: 'El celular no anda.', base: 'The phone isn’t working.' },
          ],
        },
        takeaways: [
          'You use mandar, recibir, llamar and bajar in the present and the past.',
          'You say a device isn’t working with no anda.',
        ],
        exercises: [
          ex.translationChoice(
            'mandar',
            'to send',
            ['to receive', 'to call', 'to download'],
            ['es-mandar'],
            { id: 'es.ex.xt4oeg3atoz7t7' },
          ),
          ex.translationChoice(
            'recibir',
            'to receive',
            ['to send', 'to download', 'to read'],
            ['es-recibir'],
            { id: 'es.ex.vs2vsuwizjt71i' },
          ),
          ex.matchPairs(
            [
              ['mandar', 'to send'],
              ['recibir', 'to receive'],
              ['llamar', 'to call'],
              ['bajar', 'to download'],
            ],
            ['es-mandar', 'es-recibir', 'es-llamar', 'es-bajar'],
            { id: 'es.ex.stg0kclca734pq' },
          ),
          ex.fillBlank(
            'Ayer ___ la app del banco.',
            'Yesterday I downloaded the bank app.',
            'bajé',
            ['bajar', 'bajaste', 'mandé'],
            ['es-bajar', 'es-la-app'],
            {
              id: 'es.ex.wmt6741szh7pma',
              explanation:
                'Ayer asks for the past, and “I” for the yo form: bajé. Bajaste is the vos form (you downloaded).',
            },
          ),
          ex.listenChoice(
            'Mandé un mail.',
            ['Mandaste un mail.', 'Mandé un mensaje.', 'Llamé a Juan.'],
            ['es-mandar', 'es-el-mail'],
            { id: 'es.ex.x277tz62z8atpx' },
          ),
          ex.fillBlank(
            'La computadora no ___.',
            'The computer isn’t working.',
            'anda',
            ['está', 'es', 'tiene'],
            ['es-andar', 'es-la-computadora'],
            {
              id: 'es.ex.pz4eeur7qb2pn3',
              explanation:
                'In Argentina, andar is used for machines and devices: no anda means it isn’t working (no funciona).',
            },
          ),
          ex.fillBlank(
            '¿___ mi mensaje? — Sí, gracias.',
            'Did you get my message? — Yes, thanks.',
            'Recibiste',
            ['Recibí', 'Recibir'],
            ['es-recibir', 'es-el-mensaje'],
            {
              id: 'es.ex.zybc6wtlfvpm4g',
              explanation:
                'Asking a friend (vos) about the past: recibiste. Recibí is “I received”.',
            },
          ),
          ex.orderWords(
            'Voy a llamar a mi abuela.',
            'I’m going to call my grandmother.',
            ['es-llamar'],
            { id: 'es.ex.cjplf2qh1vuvbc' },
          ),
          ex.translateWrite('The phone isn’t working.', 'El celular no anda.', ['es-andar'], {
            id: 'es.ex.ddbtt0jgwf3kmh',
            acceptedAnswers: ['El celular no funciona.'],
          }),
          ex.translateWrite(
            'I received a message from Camila.',
            'Recibí un mensaje de Camila.',
            ['es-recibir', 'es-el-mensaje'],
            { id: 'es.ex.bxmtaprzs7rhg7' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Lo llamo, la veo',
        objective: 'Replace a person or a thing with lo, la, los, las.',
        intro: {
          explanation:
            'Lo, la, los and las replace the person or thing that receives the action: lo for a man or a masculine noun, la for a woman or a feminine noun, los and las for plurals. Unlike English, they go before the conjugated verb: lo llamo (I call him), la veo (I see her). With no, the order is no + pronoun + verb: no lo tengo. In Buenos Aires the ll of llamo sounds like the sh in shoe.',
          examples: [
            {
              target: '¿Y Martín? — Lo llamo ahora.',
              base: 'What about Martín? — I’ll call him now.',
            },
            { target: '¿La app? La bajé ayer.', base: 'The app? I downloaded it yesterday.' },
          ],
        },
        takeaways: [
          'You put lo, la, los and las before the conjugated verb.',
          'You choose the pronoun by gender and number: lo, la, los, las.',
        ],
        exercises: [
          ex.translationChoice(
            'lo llamo',
            'I call him',
            ['I see her', 'I talk to them', 'I write to him'],
            ['es-lo-llamo'],
            { id: 'es.ex.jabuujhljybdjd' },
          ),
          ex.translationChoice(
            'la veo',
            'I see her',
            ['I call him', 'I see him', 'I call her'],
            ['es-la-veo'],
            { id: 'es.ex.5u53ub2xmkeltm' },
          ),
          ex.fillBlank(
            '¿Y Sofía? — ___ veo mañana.',
            'What about Sofía? — I’ll see her tomorrow.',
            'La',
            ['Lo', 'Los', 'Las'],
            ['es-la-veo'],
            {
              id: 'es.ex.uirrh77k6kgohi',
              skill: 'grammar',
              explanation: 'Sofía is a woman, one person: la. Lo would be him; los and las, them.',
            },
          ),
          ex.fillBlank(
            '¿El celular? No ___ tengo.',
            'The phone? I don’t have it.',
            'lo',
            ['la', 'los', 'las'],
            ['es-lo-llamo'],
            {
              id: 'es.ex.efuv2y2ssyd5c8',
              skill: 'grammar',
              explanation:
                'El celular is masculine and singular: lo. The order is no + pronoun + verb: no lo tengo.',
            },
          ),
          ex.listenChoice(
            'Lo llamo mañana.',
            ['La llamo mañana.', 'Lo llamo ahora.', 'Los llamo mañana.'],
            ['es-lo-llamo'],
            { id: 'es.ex.z76y7ewjlfhqge' },
          ),
          ex.orderWords('Lo llamo esta noche.', 'I’ll call him tonight.', ['es-lo-llamo'], {
            id: 'es.ex.gnx84uuztc2wg5',
          }),
          question(
            'es.ex.a03algzwg6v4zj',
            COMPU,
            'What is wrong with Marta’s computer?',
            'It isn’t working and the screen is black',
            ['It is very old', 'It has no apps', 'Someone stole it'],
            ['es-andar', 'es-la-pantalla'],
            'Marta says “La computadora no anda” (it isn’t working) and the screen “está negra” (is black).',
          ),
          question(
            'es.ex.y4ljn309rtcij2',
            COMPU,
            'Who is Nico going to call?',
            'His mom',
            ['His grandmother', 'His dad', 'A friend'],
            ['es-llamar', 'es-lo-llamo'],
            'Marta asks “¿Llamo a tu mamá?” and Nico answers “Yo la llamo ahora”: la means her, his mom.',
          ),
          ex.translateWrite(
            'My grandmother? I see her on Sundays.',
            '¿Mi abuela? La veo los domingos.',
            ['es-la-veo'],
            {
              id: 'es.ex.z2kz670474hk71',
              acceptedAnswers: [
                'Mi abuela, la veo los domingos.',
                '¿Mi abuela? La veo todos los domingos.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Llamás a tu papá hoy?',
            'Answer yes, using a pronoun instead of tu papá (e.g. «Sí, lo llamo hoy»).',
            'Sí, lo llamo hoy.',
            ['Sí, lo llamo.', 'Sí, hoy lo llamo.', 'Sí, lo llamo hoy'],
            ['es-lo-llamo'],
            { id: 'es.ex.enzhmbaj4bw9xs' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Le escribo, se lo mando',
        objective: 'Say who you write, talk or send things to, with le, les and se lo.',
        intro: {
          explanation:
            'Le and les mark the person who gets something: le escribo (I write to him or to her), les hablo (I talk to them). Spanish usually keeps the person as well: le escribo a Diego, les hablo a los estudiantes. When le or les meets lo, la, los or las, it changes to se: se lo mando (I send it to him), never “le lo”. The order is always person first, then thing: se lo, te la, me lo.',
          examples: [
            {
              target: 'Le escribo un mail a la profesora.',
              base: 'I’m writing an email to the teacher.',
            },
            {
              target: '¿El mail para Juan? Se lo mando hoy.',
              base: 'The email for Juan? I’ll send it to him today.',
            },
          ],
        },
        takeaways: [
          'You use le and les for the person who receives something.',
          'You turn le lo into se lo: se lo mando.',
        ],
        exercises: [
          ex.translationChoice(
            'le escribo',
            'I write to him',
            ['I talk to them', 'I call him', 'I see her'],
            ['es-le-escribo'],
            { id: 'es.ex.1985t4ypgwvx9n' },
          ),
          ex.fillBlank(
            '___ escribo un mensaje a mi hermana.',
            'I’m writing a message to my sister.',
            'Le',
            ['Les', 'La', 'Lo'],
            ['es-le-escribo', 'es-el-mensaje'],
            {
              id: 'es.ex.a59o4fk2a3tgz8',
              skill: 'grammar',
              explanation:
                'My sister receives the message, so she gets le (to her). La would mean that you write her, as if she were the message.',
            },
          ),
          ex.fillBlank(
            '___ hablo a los estudiantes en inglés.',
            'I talk to the students in English.',
            'Les',
            ['Le', 'Los', 'Lo'],
            ['es-les-hablo'],
            {
              id: 'es.ex.r5fi65i72i1my9',
              skill: 'grammar',
              explanation:
                'Los estudiantes are several people who hear you: les (to them). Le is for one person.',
            },
          ),
          ex.listenChoice(
            'Le escribo a mi papá.',
            ['Les escribo a mis papás.', 'Le escribo a mi mamá.', 'Le hablo a mi papá.'],
            ['es-le-escribo'],
            { id: 'es.ex.n5q42nc6wg9l16' },
          ),
          ex.fillBlank(
            '¿El mail para Juan? Ya ___ mando.',
            'The email for Juan? I’ll send it to him right away.',
            'se lo',
            ['le lo', 'lo le', 'se la'],
            ['es-se-lo-mando', 'es-el-mail'],
            {
              id: 'es.ex.3n2z70qw9z8m7f',
              skill: 'grammar',
              explanation:
                'Le + lo becomes se lo; “le lo” does not exist. The person goes first, then the thing: se lo. El mail is masculine, so lo, not la.',
            },
          ),
          ex.orderWords(
            'Se lo mando mañana.',
            'I’ll send it to him tomorrow.',
            ['es-se-lo-mando'],
            {
              id: 'es.ex.uapfyjt9zc0dz4',
            },
          ),
          question(
            'es.ex.m6san412nxl1lm',
            FACULTAD,
            'What is Valentina sending her dad?',
            'An email from her college',
            ['Photos of a trip', 'The password of her phone', 'A new app'],
            ['es-el-mail', 'es-mandar'],
            'She writes “Te mando el mail de la facultad”: I’m sending you the email from the college.',
          ),
          question(
            'es.ex.cphrm2ql4fytm4',
            FACULTAD,
            'How is she going to send him the password?',
            'By text message',
            ['By email', 'In person', 'In a phone call'],
            ['es-la-contrasena', 'es-el-mensaje'],
            'She writes “La contraseña te la mando por mensaje”: I’ll send you the password by message.',
          ),
          ex.translateWrite(
            'I’m writing an email to the teacher.',
            'Le escribo un mail a la profesora.',
            ['es-le-escribo', 'es-el-mail'],
            {
              id: 'es.ex.l3px72xs4gbr7p',
              acceptedAnswers: [
                'Le escribo un mail al profesor.',
                'Le escribo un mail a la profe.',
                'Le escribo un mail al profe.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Le mandás el mail a Diego?',
            'Answer yes, replacing both el mail and Diego with pronouns (start with «Sí, se…»).',
            'Sí, se lo mando.',
            ['Sí, se lo mando ahora.', 'Sí, ya se lo mando.', 'Sí, se lo mando'],
            ['es-se-lo-mando'],
            { id: 'es.ex.4b228m0zeu8zmx' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Voy a llamarlo',
        objective: 'Understand messages about technology and use pronouns with infinitives.',
        intro: {
          explanation:
            'With an infinitive (llamar, leer, bajar) the pronoun has two possible places: before the conjugated verb or attached to the end of the infinitive, as one word. Lo voy a llamar = voy a llamarlo; tenés que leerlo. Never use both at once. With an affirmative vos command it is also attached: llamame (call me). The stress stays where it was: lla-MAR-lo.',
          examples: [
            { target: 'Voy a llamarlo esta noche.', base: 'I’m going to call him tonight.' },
            { target: 'Lo voy a llamar esta noche.', base: 'I’m going to call him tonight.' },
          ],
        },
        takeaways: [
          'You put the pronoun before voy a or at the end of the infinitive: lo voy a llamar = voy a llamarlo.',
          'You understand a message or a call about a device that isn’t working.',
        ],
        exercises: [
          question(
            'es.ex.hiqhklzxrdajwz',
            COMPU,
            'What did Marta do yesterday?',
            'She changed her password',
            ['She downloaded an app', 'She sent an email', 'She bought a computer'],
            ['es-la-contrasena'],
            'Marta says “ayer cambié la contraseña, pero me olvidé la nueva”: she changed it and forgot the new one.',
          ),
          question(
            'es.ex.thk4csf29go8km',
            COMPU,
            'When is Nico going to Marta’s house?',
            'This afternoon',
            ['Tonight', 'Tomorrow morning', 'Right now'],
            ['es-la-computadora'],
            'Nico says “Esta tarde voy a tu casa”: this afternoon.',
          ),
          question(
            'es.ex.uv4h9upcjd88nl',
            FACULTAD,
            'What does her dad have to do to read the email?',
            'Download the college app',
            ['Call the college', 'Change his password', 'Buy a new computer'],
            ['es-bajar', 'es-la-app'],
            'She writes “Para leerlo, tenés que bajar la app de la facultad”.',
          ),
          question(
            'es.ex.qhhjotdj0jh21o',
            FACULTAD,
            'What should he do if it doesn’t work?',
            'Call her tonight',
            ['Write to her tomorrow', 'Go to the college', 'Send her an email'],
            ['es-andar', 'es-llamar'],
            'She writes “¿No anda? Llamame esta noche”: if it isn’t working, call me tonight.',
          ),
          ex.listenChoice(
            'Voy a llamarlo mañana.',
            ['Voy a llamarla mañana.', 'Vas a llamarlo mañana.', 'Voy a llamarlo ahora.'],
            ['es-lo-llamo', 'es-llamar'],
            { id: 'es.ex.ltt85iino37rrb' },
          ),
          ex.fillBlank(
            'Lo voy a ___ esta noche.',
            'I’m going to call him tonight.',
            'llamar',
            ['llamarlo', 'llamo', 'llamé'],
            ['es-lo-llamo', 'es-llamar'],
            {
              id: 'es.ex.r7sg05jg6ex1rm',
              skill: 'grammar',
              explanation:
                'The pronoun lo is already before voy a, so the infinitive stays bare: lo voy a llamar. Llamarlo here would repeat the pronoun.',
            },
          ),
          ex.matchPairs(
            [
              ['bajar', 'to download'],
              ['andar', 'to work (a device)'],
              ['les hablo', 'I talk to them'],
              ['se lo mando', 'I send it to him'],
            ],
            ['es-bajar', 'es-andar', 'es-les-hablo', 'es-se-lo-mando'],
            { id: 'es.ex.dxlap80etpunoy' },
          ),
          ex.translateWrite(
            'I’m going to call him tonight.',
            'Voy a llamarlo esta noche.',
            ['es-lo-llamo', 'es-llamar'],
            {
              id: 'es.ex.rpmx900jrcrd0j',
              acceptedAnswers: [
                'Lo voy a llamar esta noche.',
                'Esta noche voy a llamarlo.',
                'Esta noche lo voy a llamar.',
              ],
            },
          ),
          ex.translateWrite(
            'The app isn’t working. Are you online?',
            'La app no anda. ¿Estás conectado?',
            ['es-la-app', 'es-andar', 'es-conectado'],
            {
              id: 'es.ex.cqbsekmvgkctj0',
              acceptedAnswers: [
                'La app no anda. ¿Estás conectada?',
                'La app no anda, ¿estás conectado?',
                'La app no anda, ¿estás conectada?',
                'La app no funciona. ¿Estás conectado?',
                'La app no funciona. ¿Estás conectada?',
              ],
            },
          ),
        ],
      },
    ],
  },
};
