import type { ExpansionUnitDef } from '../../a2-expansion';
import { ex } from '../../builders';
import { dialogue, question, reading } from './context-helpers';
import { w } from './word';

/**
 * A2 U16 «Mensajes, correos y llamadas» (docs/A2_EN_COMPLETION.md): mensajes entre amigos, correos
 * (Dear…, Best wishes), pedir con Could you…?, hablar por teléfono y reservar un hotel. Supone A1
 * (hotel de U10, I'd like de U14) y A2 U1–U15 (email de U10, will de U8).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CHAT = reading(
  'en.stim.a2-u16-chat',
  'message',
  'Leo le escribe a Mia después de una fiesta.',
  [
    'Hi Mia!',
    'Thanks for the photos from the party.',
    'They are amazing!',
    "I'm at work now. I'll call you later.",
    'See you soon!',
  ],
  { from: 'Leo', to: 'Mia' },
);

const EMMA_EMAIL = reading(
  'en.stim.a2-u16-email',
  'email',
  'Emma le escribe a Leo después de un viaje.',
  [
    'Dear Leo,',
    'Thanks for your email.',
    'The trip to the mountains was amazing!',
    'Could you send me your photos? I lost my phone on the last day.',
    'Best wishes,',
    'Emma',
  ],
  { from: 'Emma', to: 'Leo', title: 'Our trip' },
);

const PHONE = dialogue('en.stim.a2-u16-phone', 'Leo llama a un hotel para hablar con Emma.', [
  ['Kate', 'Hello, Green Hotel.'],
  ['Leo', 'Hi. Can I speak to Emma Brown, please?'],
  ['Kate', "Hold on, please. Sorry, she isn't here. Would you like to leave a message?"],
  ['Leo', 'Yes. Could she call me back? My name is Leo.'],
  ['Kate', 'Sure. Goodbye!'],
]);

const BOOKING = reading(
  'en.stim.a2-u16-booking',
  'email',
  'Leo escribe a un hotel para reservar.',
  [
    'Hello,',
    "I'd like to book a double room for two nights, from Friday 12 May to Sunday 14 May.",
    'We arrive on Friday at eight in the evening.',
    'Could you send me the price, please?',
    'Best wishes,',
    'Leo Torres',
  ],
  { from: 'Leo', title: 'Room for two nights' },
);

const HOTEL_REPLY = reading(
  'en.stim.a2-u16-hotel-reply',
  'email',
  'El hotel le responde a Leo.',
  [
    'Dear Leo,',
    'Thanks for your email.',
    'We have a double room for Friday and Saturday.',
    'The price is $90 a night, with breakfast.',
    'You can check in after two and check out before eleven.',
    'Best wishes,',
    'Kate, Green Hotel',
  ],
  { from: 'Kate', to: 'Leo', title: 'Your room' },
);

export const EN_A2_U16: ExpansionUnitDef = {
  names: ['Mia', 'Leo', 'Emma', 'Kate', 'Brown', 'Torres', 'Ana'],
  unit: {
    position: 16,
    title: 'Mensajes, correos y llamadas',
    titleEn: 'Messages, emails and calls',
    description:
      'Mensajes y correos, pedir algo con Could you…?, hablar por teléfono y reservar un hotel.',
    emoji: '✉️',
    objective:
      'Puedes escribir y entender mensajes y correos cortos, hablar por teléfono y reservar un hotel.',
    grammar: {
      title: 'Correos y pedidos',
      explanation:
        'Un correo empieza con Dear + nombre y termina con Best wishes. Para pedir algo con cortesía se usa Could you + verbo…? (¿podrías…?).',
      examples: [
        { target: 'Dear Ana,', base: 'Querida Ana:' },
        {
          target: 'Could you send me the photos, please?',
          base: '¿Podrías mandarme las fotos, por favor?',
        },
        { target: 'Best wishes, Leo', base: 'Saludos, Leo' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'A2 completo: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-message',
        'message',
        'mensaje',
        '/ˈmɛsɪdʒ/',
        '💬',
        'I got your message.',
        'Recibí tu mensaje.',
        ['messages'],
      ),
      w(
        'en-dear',
        'dear',
        'querido / querida (en cartas)',
        '/dɪr/',
        undefined,
        'Dear Ana, how are you?',
        'Querida Ana, ¿cómo estás?',
        ['messages'],
        ['querido', 'querida', 'estimado', 'estimada'],
      ),
      w(
        'en-thanks-for',
        'thanks for',
        'gracias por',
        '/ˈθæŋks fɔr/',
        '🙏',
        'Thanks for your message!',
        '¡Gracias por tu mensaje!',
        ['messages'],
      ),
      w(
        'en-take-care',
        'take care',
        'cuídate',
        '/ˈteɪk ˈkɛr/',
        '👋',
        'Take care, Ana!',
        '¡Cuídate, Ana!',
        ['messages'],
        ['cuídate', 'cuídese', 'cuidate'],
      ),
      w(
        'en-best-wishes',
        'best wishes',
        'saludos / cariños (al despedirse)',
        '/bɛst ˈwɪʃəz/',
        undefined,
        'Best wishes, Leo',
        'Saludos, Leo',
        ['messages'],
        ['saludos', 'cariños'],
      ),
      w(
        'en-reply',
        'reply',
        'responder (un mensaje)',
        '/rɪˈplaɪ/',
        undefined,
        'Please reply soon.',
        'Por favor, responde pronto.',
        ['messages', 'verbs'],
        ['responder', 'contestar'],
      ),
      w(
        'en-send',
        'send',
        'enviar / mandar',
        '/sɛnd/',
        '📤',
        'I send a lot of messages.',
        'Mando muchos mensajes.',
        ['messages', 'verbs'],
        ['enviar', 'mandar'],
      ),
      w(
        'en-call-back',
        'call back',
        'devolver la llamada',
        '/ˈkɔl ˈbæk/',
        undefined,
        'Can you call me back?',
        '¿Me puedes devolver la llamada?',
        ['phone'],
        ['volver a llamar'],
      ),
      w(
        'en-leave-a-message',
        'leave a message',
        'dejar un mensaje',
        '/liv ə ˈmɛsɪdʒ/',
        undefined,
        'Can I leave a message?',
        '¿Puedo dejar un mensaje?',
        ['phone'],
      ),
      w(
        'en-hold-on',
        'hold on',
        'un momento (al teléfono)',
        '/hoʊld ˈɑn/',
        '☎️',
        'Hold on, please.',
        'Un momento, por favor.',
        ['phone'],
        ['un momento', 'espere', 'espera', 'esperá'],
      ),
      w(
        'en-could-you',
        'could you',
        '¿podrías…? / ¿podría…?',
        '/kʊd ju/',
        undefined,
        'Could you help me, please?',
        '¿Podrías ayudarme, por favor?',
        ['requests'],
        ['podrías', 'podría'],
      ),
      w(
        'en-book-a-room',
        'book a room',
        'reservar una habitación',
        '/bʊk ə ˈrum/',
        '🛎️',
        "I'd like to book a room.",
        'Quisiera reservar una habitación.',
        ['hotel'],
      ),
      w(
        'en-double-room',
        'double room',
        'habitación doble',
        '/ˈdʌbəl ˈrum/',
        '🛏️',
        'We want a double room.',
        'Queremos una habitación doble.',
        ['hotel'],
      ),
      w(
        'en-check-in',
        'check in',
        'registrarse (en un hotel)',
        '/tʃɛk ˈɪn/',
        undefined,
        'You can check in at two.',
        'Pueden registrarse a las dos.',
        ['hotel'],
        ['registrarse', 'hacer el check-in'],
      ),
      w(
        'en-check-out',
        'check out',
        'dejar la habitación (en un hotel)',
        '/tʃɛk ˈaʊt/',
        undefined,
        'We check out on Sunday.',
        'Dejamos la habitación el domingo.',
        ['hotel'],
        ['dejar la habitación', 'hacer el check-out'],
      ),
      w(
        'en-reception',
        'reception',
        'recepción',
        '/rɪˈsɛpʃən/',
        undefined,
        'The key is at reception.',
        'La llave está en recepción.',
        ['hotel'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Un mensaje a un amigo',
        objective: 'Escribir y entender mensajes cortos entre amigos.',
        intro: {
          explanation:
            'Un mensaje informal empieza con Hi y el nombre, y termina con See you soon! (¡hasta pronto!) o Take care! (¡cuídate!). Para agradecer: Thanks for… (gracias por…).',
          examples: [
            { target: 'Thanks for your message!', base: '¡Gracias por tu mensaje!' },
            { target: 'See you soon!', base: '¡Hasta pronto!' },
          ],
        },
        takeaways: [
          'Escribes y entiendes mensajes cortos entre amigos.',
          'Agradeces con Thanks for… y te despides con See you soon o Take care.',
        ],
        exercises: [
          ex.translationChoice(
            'send',
            'enviar / mandar',
            ['responder (un mensaje)', 'recibir', 'escribir'],
            ['en-send'],
            { id: 'en.ex.sjslwdyaoeo6ms' },
          ),
          ex.matchPairs(
            [
              ['message', 'mensaje'],
              ['reply', 'responder (un mensaje)'],
              ['send', 'enviar / mandar'],
              ['take care', 'cuídate'],
            ],
            ['en-message', 'en-reply', 'en-send', 'en-take-care'],
            { id: 'en.ex.fr0q2y2g56gbgb' },
          ),
          ex.fillBlank(
            'Thanks ___ your message!',
            '¡Gracias por tu mensaje!',
            'for',
            ['to', 'of', 'at'],
            ['en-thanks-for', 'en-message'],
            {
              id: 'en.ex.3gqlehcyx5cgnh',
              explanation: 'Gracias por… = Thanks for… (o Thank you for…).',
            },
          ),
          question(
            'en.ex.6ygiev9smc2hnb',
            CHAT,
            '¿Qué le agradece Leo a Mia?',
            'Las fotos de la fiesta',
            ['Un regalo de cumpleaños', 'La invitación a la fiesta', 'Una llamada'],
            ['en-thanks-for', 'en-photo'],
            'Leo escribe: «Thanks for the photos from the party».',
          ),
          question(
            'en.ex.t80v32k62u2sbj',
            CHAT,
            '¿Por qué Leo no llama ahora?',
            'Porque está trabajando',
            ['Porque está en una fiesta', 'Porque no tiene teléfono', 'Porque está durmiendo'],
            ['en-work', 'en-later'],
            'Leo escribe: «I’m at work now. I’ll call you later».',
          ),
          ex.listenChoice(
            'Please reply to my message soon.',
            [
              'Please send me a message soon.',
              'Please reply to my email soon.',
              'Please reply to my message now.',
            ],
            ['en-reply', 'en-message', 'en-soon'],
            { id: 'en.ex.gchrnl5jfu79bn' },
          ),
          ex.orderWords(
            'I send her a message every day.',
            'Le mando un mensaje todos los días.',
            ['en-send', 'en-message', 'en-every-day'],
            {
              id: 'en.ex.t5oaulp9o33r4i',
            },
          ),
          ex.translateWrite(
            '¡Gracias por tu mensaje!',
            'Thanks for your message!',
            ['en-thanks-for', 'en-message'],
            {
              id: 'en.ex.nz6xccf2gmkhun',
              acceptedAnswers: ['Thank you for your message!'],
            },
          ),
          ex.translateWrite(
            '¡Cuídate! Hasta pronto.',
            'Take care! See you soon.',
            ['en-take-care', 'en-soon'],
            {
              id: 'en.ex.dsc0h54l1y6abw',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Un correo',
        objective: 'Empezar y terminar un correo, y pedir algo con Could you…?',
        intro: {
          explanation:
            'Un correo empieza con Dear + nombre (Dear Leo,) y termina con Best wishes, + tu nombre. Para pedir algo con cortesía: Could you…? (¿podrías…?) + el verbo.',
          examples: [
            { target: 'Dear Leo,', base: 'Querido Leo:' },
            {
              target: 'Could you send me the photos, please?',
              base: '¿Podrías mandarme las fotos, por favor?',
            },
          ],
        },
        takeaways: [
          'Empiezas un correo con Dear… y lo terminas con Best wishes.',
          'Pides algo con cortesía: Could you…?',
        ],
        exercises: [
          ex.fillBlank(
            '___ Ana, how are you?',
            'Querida Ana, ¿cómo estás?',
            'Dear',
            ['Best', 'Thanks', 'Soon'],
            ['en-dear'],
            { id: 'en.ex.t66tjzk5w2i6kp', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            '___ you help me, please?',
            '¿Podrías ayudarme, por favor?',
            'Could',
            ['Have', 'Are', 'Did'],
            ['en-could-you', 'en-help'],
            { id: 'en.ex.wzepr2o5lz2xht' },
          ),
          ex.translationChoice(
            'best wishes',
            'saludos / cariños (al despedirse)',
            ['hasta pronto', 'querido / querida (en cartas)', 'gracias por'],
            ['en-best-wishes'],
            { id: 'en.ex.wyy80jb20ikacw' },
          ),
          question(
            'en.ex.jbev9jjjvk0j4b',
            EMMA_EMAIL,
            '¿Qué le pide Emma a Leo?',
            'Que le mande sus fotos',
            ['Que la llame', 'Que le preste su teléfono', 'Que viaje con ella a la montaña'],
            ['en-could-you', 'en-send', 'en-photo'],
            'Emma escribe: «Could you send me your photos?».',
          ),
          question(
            'en.ex.3zmmuydwpjzr7v',
            EMMA_EMAIL,
            '¿Por qué Emma no tiene fotos?',
            'Perdió el teléfono',
            ['No le gusta sacar fotos', 'No fue al viaje', 'Las borró'],
            ['en-lost', 'en-phone'],
            'Emma escribe: «I lost my phone on the last day».',
          ),
          ex.listenChoice(
            'Could you call me tomorrow?',
            [
              'Could you call me today?',
              'Can you call me tomorrow?',
              'Could you help me tomorrow?',
            ],
            ['en-could-you', 'en-call', 'en-tomorrow'],
            { id: 'en.ex.80gch1x2bxek5f' },
          ),
          ex.orderWords(
            'Could you send me the photos?',
            '¿Podrías mandarme las fotos?',
            ['en-could-you', 'en-send', 'en-photo'],
            {
              id: 'en.ex.mhd8apjohtbpr0',
            },
          ),
          ex.translateWrite(
            '¿Podrías ayudarme, por favor?',
            'Could you help me, please?',
            ['en-could-you', 'en-help'],
            {
              id: 'en.ex.ybokpaao198mfd',
              acceptedAnswers: [
                'Can you help me, please?',
                'Could you help me?',
                'Could you please help me?',
              ],
            },
          ),
          ex.translateWrite('Saludos, Ana', 'Best wishes, Ana', ['en-best-wishes'], {
            id: 'en.ex.ghuvpvtuevecbc',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Al teléfono',
        objective: 'Pedir hablar con alguien y dejar un mensaje.',
        intro: {
          explanation:
            'Al teléfono: Can I speak to…? (¿puedo hablar con…?). Si la persona no está, puedes dejar un mensaje (leave a message) o pedir que te devuelva la llamada (call me back). Hold on, please = un momento, por favor.',
          examples: [
            { target: 'Can I speak to Emma, please?', base: '¿Puedo hablar con Emma, por favor?' },
            { target: 'Hold on, please.', base: 'Un momento, por favor.' },
          ],
        },
        takeaways: [
          'Pides hablar con alguien y dejas un mensaje.',
          'Entiendes Hold on y pides que te llamen: call me back.',
        ],
        exercises: [
          ex.translationChoice(
            'hold on',
            'un momento (al teléfono)',
            ['devolver la llamada', 'dejar un mensaje', 'hasta pronto'],
            ['en-hold-on'],
            { id: 'en.ex.upd28m4ipepx00' },
          ),
          ex.fillBlank(
            'Can you call me ___ later?',
            '¿Me puedes devolver la llamada más tarde?',
            'back',
            ['up', 'on', 'in'],
            ['en-call-back', 'en-later'],
            { id: 'en.ex.z35nb5duvki4od' },
          ),
          ex.fillBlank(
            "She isn't here. Would you like to ___ a message?",
            'No está. ¿Quieres dejarle un mensaje?',
            'leave',
            ['send', 'make', 'have'],
            ['en-leave-a-message'],
            { id: 'en.ex.rvi667g9k5f5d4', explanation: 'Dejar un mensaje = leave a message.' },
          ),
          question(
            'en.ex.you06agqhiuh1a',
            PHONE,
            '¿Qué pide Leo?',
            'Que Emma lo llame',
            ['Hablar con Kate', 'Reservar una habitación', 'Que Emma le mande un correo'],
            ['en-call-back', 'en-leave-a-message'],
            'Emma no está y Leo deja un mensaje: «Could she call me back?».',
          ),
          question(
            'en.ex.uajag4csfodlr1',
            PHONE,
            '¿Qué hace Kate primero?',
            'Le pide que espere un momento',
            ['Le corta la llamada', 'Le da el número de Emma', 'Le pide su dirección'],
            ['en-hold-on'],
            'Kate dice: «Hold on, please».',
          ),
          ex.listenChoice(
            'Can I leave a message?',
            ['Can I leave a number?', 'Can I send a message?', 'Can you leave a message?'],
            ['en-leave-a-message'],
            { id: 'en.ex.71uk7n1s7o3e9x' },
          ),
          ex.orderWords(
            'Could you call me back?',
            '¿Podrías devolverme la llamada?',
            ['en-could-you', 'en-call-back'],
            {
              id: 'en.ex.yll4dn30ljbc98',
            },
          ),
          ex.shortAnswer(
            "Emma isn't here. Would you like to leave a message? (sí: que te llame)",
            'Emma no está. ¿Quieres dejarle un mensaje?',
            'Yes, could she call me back, please?',
            [
              'Yes, please. Could she call me back?',
              'Could she call me back?',
              'Yes, can she call me back?',
              'Yes, can she call me back, please?',
            ],
            ['en-call-back', 'en-leave-a-message'],
            { id: 'en.ex.i50w9in0h7twzw' },
          ),
          ex.translateWrite('Un momento, por favor.', 'Hold on, please.', ['en-hold-on'], {
            id: 'en.ex.vf8rxmyak16301',
            acceptedAnswers: ['Hold on.', 'Hold on a moment, please.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Reservar un hotel',
        objective: 'Reservar una habitación y entender las reglas del hotel.',
        intro: {
          explanation:
            "Para reservar: I'd like to book a room. Una habitación para dos personas es a double room. Check in es registrarte al llegar y check out, dejar la habitación al irte.",
          examples: [
            {
              target: "I'd like to book a double room.",
              base: 'Quisiera reservar una habitación doble.',
            },
            { target: 'You can check in at two.', base: 'Pueden registrarse a las dos.' },
          ],
        },
        takeaways: [
          'Reservas una habitación de hotel.',
          'Entiendes el check in, el check out y la recepción.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['book a room', 'reservar una habitación'],
              ['double room', 'habitación doble'],
              ['check in', 'registrarse (en un hotel)'],
              ['reception', 'recepción'],
            ],
            ['en-book-a-room', 'en-double-room', 'en-check-in', 'en-reception'],
            { id: 'en.ex.qmh3w38uytem75' },
          ),
          ex.fillBlank(
            "I'd like to ___ a room for Friday.",
            'Quisiera reservar una habitación para el viernes.',
            'book',
            ['read', 'buy', 'pay'],
            ['en-book-a-room'],
            {
              id: 'en.ex.gksrutam722ev1',
              explanation: 'Book, además de «libro», es «reservar»: book a room.',
            },
          ),
          ex.fillBlank(
            'You can check ___ at two, when you arrive.',
            'Pueden registrarse a las dos, cuando lleguen.',
            'in',
            ['out', 'on', 'at'],
            ['en-check-in', 'en-arrive'],
            { id: 'en.ex.ub242pjmgtf2kd' },
          ),
          ex.fillBlank(
            'We check ___ on Sunday morning and go to the airport.',
            'Dejamos la habitación el domingo a la mañana y vamos al aeropuerto.',
            'out',
            ['in', 'up', 'on'],
            ['en-check-out', 'en-airport'],
            { id: 'en.ex.m793fvs1tsu7a4' },
          ),
          question(
            'en.ex.v6l1movtg1ussn',
            BOOKING,
            '¿Cuántas noches quiere quedarse Leo?',
            'Dos',
            ['Una', 'Tres', 'Catorce'],
            ['en-book-a-room', 'en-double-room'],
            'Leo escribe: «I’d like to book a double room for two nights».',
          ),
          question(
            'en.ex.b3pmmyqsmuqgpv',
            BOOKING,
            '¿Qué le pide Leo al hotel?',
            'Que le digan el precio',
            ['La dirección del hotel', 'La hora del check out', 'Una habitación con desayuno'],
            ['en-could-you', 'en-price'],
            'Leo escribe: «Could you send me the price, please?».',
          ),
          ex.listenChoice(
            'The key is at reception.',
            ['The key is in the room.', 'The keys are at reception.', 'The bag is at reception.'],
            ['en-reception', 'en-key'],
            { id: 'en.ex.hq09607n41cucr' },
          ),
          ex.shortAnswer(
            'What time is check out? (a las once)',
            '¿A qué hora hay que dejar la habitación?',
            "It's at eleven.",
            [
              'At eleven.',
              'Check out is at eleven.',
              'At 11.',
              "It's at 11.",
              "At eleven o'clock.",
            ],
            ['en-check-out', 'en-eleven'],
            { id: 'en.ex.gv8m8cj4effgya' },
          ),
          ex.translateWrite(
            'Quisiera reservar una habitación doble.',
            "I'd like to book a double room.",
            ['en-book-a-room', 'en-double-room'],
            {
              id: 'en.ex.x4j401f5xpjwo6',
              acceptedAnswers: [
                'I would like to book a double room.',
                'I want to book a double room.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Responder un correo',
        objective: 'Entender un correo y responderlo.',
        intro: {
          explanation:
            'Para responder un correo: agradece (Thanks for your email), contesta lo que te preguntan y despídete (Best wishes / See you soon). Si te piden algo, di qué vas a hacer con will: I’ll send you the photos tonight.',
          examples: [
            { target: 'Thanks for your email.', base: 'Gracias por tu correo.' },
            { target: "I'll send you the photos tonight.", base: 'Esta noche te mando las fotos.' },
          ],
        },
        takeaways: [
          'Respondes un correo: agradeces, contestas y te despides.',
          'Dices qué vas a hacer con will: I’ll send…',
        ],
        exercises: [
          question(
            'en.ex.45spwiqd6nv4ra',
            HOTEL_REPLY,
            '¿Cuánto cuesta la habitación por noche?',
            '90 dólares, con desayuno',
            ['90 dólares, sin desayuno', '180 dólares, con desayuno', '9 dólares, con desayuno'],
            ['en-double-room', 'en-price'],
            'Kate escribe: «The price is $90 a night, with breakfast».',
          ),
          question(
            'en.ex.g57o359w6fq4h3',
            HOTEL_REPLY,
            '¿Desde qué hora puede registrarse Leo?',
            'Desde las dos',
            ['Desde las once', 'Antes de las dos', 'Desde las nueve'],
            ['en-check-in'],
            'Kate escribe: «You can check in after two». Las once es la hora límite para dejar la habitación.',
          ),
          ex.fillBlank(
            "Thanks for your email. I'll ___ you the photos tonight.",
            'Gracias por tu correo. Esta noche te mando las fotos.',
            'send',
            ['sending', 'sends', 'reply'],
            ['en-send', 'en-will'],
            {
              id: 'en.ex.k8chiqhh72sr8y',
              explanation: "Después de will (I'll) va el verbo en su forma base.",
            },
          ),
          ex.listenChoice(
            'Thanks for your email. See you soon!',
            [
              'Thanks for your message. See you soon!',
              'Thanks for your email. See you later!',
              'Thanks for the email. See you tomorrow!',
            ],
            ['en-thanks-for', 'en-soon', 'en-email'],
            { id: 'en.ex.315k0cf884h3uh' },
          ),
          ex.fillBlank(
            "I got your message, but I can't ___ now. I'm driving.",
            'Recibí tu mensaje, pero no puedo responder ahora. Estoy manejando.',
            'reply',
            ['send', 'leave', 'check'],
            ['en-reply', 'en-drive'],
            { id: 'en.ex.1h46wlry7rs0z7', skill: 'vocabulary' },
          ),
          ex.orderWords(
            "I'll call you back tonight.",
            'Esta noche te devuelvo la llamada.',
            ['en-call-back', 'en-tonight'],
            {
              id: 'en.ex.st6n53ne57glpw',
            },
          ),
          ex.shortAnswer(
            'Could you send me the photos? (sí, esta noche)',
            '¿Podrías mandarme las fotos?',
            "Yes, I'll send them tonight.",
            [
              "Sure, I'll send them tonight.",
              "Yes, I'll send you the photos tonight.",
              'Yes, tonight.',
              "Yes, I'll send them to you tonight.",
            ],
            ['en-send', 'en-tonight'],
            { id: 'en.ex.j17p4ag4b5hi0z' },
          ),
          ex.translateWrite(
            'Querida Emma, gracias por tu correo.',
            'Dear Emma, thanks for your email.',
            ['en-dear', 'en-thanks-for', 'en-email'],
            {
              id: 'en.ex.0ney4vtxa5jbxy',
              acceptedAnswers: ['Dear Emma, thank you for your email.'],
            },
          ),
        ],
      },
    ],
  },
};
