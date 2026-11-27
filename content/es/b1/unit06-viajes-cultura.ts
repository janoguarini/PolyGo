import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';
import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_B1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español B1 U6 «Travel and culture» (docs/ES_B1.md §3): el presente de subjuntivo (U5) para
 * recomendar y aconsejar (te recomiendo que, te aconsejo que, es mejor que + subjuntivo; le recomiendo
 * que con usted); la condición real si + presente → presente, ir a, futuro o imperativo (si vas a
 * Oaxaca, prueba el mole); el imperativo afirmativo de tú con pronombres pegados y tilde (pruébalo,
 * llévala) y el negativo, que es el subjuntivo con el pronombre delante (no regatees, no lo pierdas).
 * Pronunciación: la tilde de pruébalo y llévala (el acento sigue en la misma sílaba al sumar el
 * pronombre); la ll de llévalo suena como la y de «yes» (yeísmo); la c de recorrido y la g de regatear
 * son fuertes (k, g de «go»).
 * Variante: español neutro de Latinoamérica cercano a México, con tú entre amigos y usted en el
 * mostrador del aeropuerto. «La reserva» (panhispánico; en México también «la reservación», aceptada).
 * Cultura: el Día de Muertos (1 y 2 de noviembre) en Oaxaca; regatear un poco en los mercados, nunca
 * en restaurantes ni tiendas grandes; saludar al entrar a una tienda pequeña; el saludo con un beso en
 * la mejilla entre mujeres y entre hombre y mujer, la mano entre hombres (México y Perú); llegar un poco
 * tarde a una fiesta en casa, pero a tiempo a una cita de trabajo; la altura de Cusco. Escenarios:
 * Oaxaca, Ciudad de México, Cusco, Puebla, Bogotá, Lima.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const GUIA = reading(
  'es.stim.b1-u6-guia',
  'description',
  'A short travel guide for visitors to Oaxaca.',
  [
    'Si te gustan la comida y las tradiciones, Oaxaca es un destino perfecto.',
    'Te recomiendo que vayas al mercado 20 de Noviembre y que pruebes las tlayudas y el mole.',
    'En el mercado también hay artesanías muy lindas.',
    'Puedes regatear un poco, pero es mejor que no pidas precios muy bajos: muchas familias viven de su trabajo.',
    'Si viajas a principios de noviembre, vas a ver una tradición muy importante: el Día de Muertos.',
    'Y te aconsejo que hagas el recorrido por Monte Albán por la mañana, porque por la tarde hace mucho calor.',
  ],
  { title: 'Oaxaca para visitantes' },
);

const CINCO = reading(
  'es.stim.b1-u6-cinco-cosas',
  'post',
  'A travel blogger shares advice for visitors to Mexico.',
  [
    'En México, saludar y ser educado es muy importante.',
    'No entres a una tienda pequeña sin saludar: un «buenos días» es suficiente.',
    'No regatees en los restaurantes ni en las tiendas grandes; en los mercados, a veces sí puedes.',
    'No tomes fotos de la gente sin preguntar primero.',
    'No llegues a una fiesta en casa a la hora exacta: lo normal es llegar un poco más tarde.',
    'Y si alguien te invita a comer, no digas que no a todo: prueba un poco de cada plato.',
  ],
  { title: 'Cinco cosas que no debes hacer en México' },
);

const MOSTRADOR = dialogue(
  'es.stim.b1-u6-mostrador',
  'At an airline counter at the Mexico City airport. Daniel, a traveler, and Lorena, the agent, use usted.',
  [
    [
      'Daniel',
      'Buenas tardes. Tengo un vuelo a Bogotá a las seis, pero en la pantalla dice que tiene retraso.',
    ],
    ['Lorena', 'Sí, señor, lo siento. Por la lluvia, el vuelo tiene un retraso de tres horas.'],
    [
      'Daniel',
      '¿Tres horas? Tengo una reserva en un hotel para esta noche y una reunión mañana temprano.',
    ],
    ['Lorena', 'Si quiere, le puedo cambiar el boleto al vuelo de mañana a las siete.'],
    ['Daniel', 'No, gracias: es mejor que salga hoy. ¿Y si cancelan el vuelo?'],
    ['Lorena', 'Si lo cancelan, esta aerolínea le paga el alojamiento y la cena. No se preocupe.'],
    ['Daniel', 'Bueno. ¿Dónde puedo esperar?'],
    ['Lorena', 'Le recomiendo que espere cerca de la puerta 12 y que mire la pantalla.'],
  ],
  ES_B1_RATE,
);

const COSTUMBRES = dialogue(
  'es.stim.b1-u6-costumbres',
  'Emilio, from Mexico City, talks with his friend Rosa, from Cusco, before his trip to Peru.',
  [
    ['Emilio', 'Rosa, en Cusco, ¿cómo saludan a alguien en una fiesta?'],
    [
      'Rosa',
      'Como en México: con un beso en la mejilla entre mujeres o entre un hombre y una mujer. Los hombres se dan la mano.',
    ],
    ['Emilio', '¿Y es grosero no saludar a todos?'],
    ['Rosa', 'Un poco, sí. Es mejor que saludes a todos, uno por uno.'],
    [
      'Emilio',
      'Aquí es igual. ¿Y la hora? En México, si la fiesta es a las ocho, nadie llega a las ocho.',
    ],
    ['Rosa', '¡En Perú tampoco! Pero para una cita de trabajo, te aconsejo que llegues a tiempo.'],
    ['Emilio', '¿Y qué me recomiendas para mi viaje?'],
    [
      'Rosa',
      'Te recomiendo que hagas el recorrido por el Valle Sagrado. Y te aconsejo que descanses el primer día, por la altura.',
    ],
  ],
  ES_B1_RATE,
);

export const ES_B1_U06: EsUnitDef = {
  names: [
    'Daniel',
    'Lorena',
    'Emilio',
    'Rosa',
    'Oaxaca',
    'Monte',
    'Albán',
    'Ángel',
    'Independencia',
    'Valle',
    'Sagrado',
    'Perú',
    'Cusco',
    'Puebla',
    'Bogotá',
    'Lima',
    'México',
  ],
  support: [
    // Presente de subjuntivo (recomendaciones)
    'visites',
    'pruebes',
    'lleves',
    'lleve',
    'pidas',
    'regatees',
    'saludes',
    'espere',
    'mire',
    'salga',
    'entres',
    'preocupe',
    // Imperativo con pronombres y otras formas
    'pruébalo',
    'pruébala',
    'llévalo',
    'llévala',
    'prueba',
    'saluda',
    'cancelan',
    'viajas',
    'esperar',
    'preguntar',
    'cambiar',
    'debes',
    'recomiendas',
    // Léxico
    'tlayudas',
    'principios',
    'muertos',
    'aerolínea',
    'mejilla',
    'mujer',
    'hombre',
    'mano',
    'tampoco',
    'igual',
    'cita',
    'altura',
    'fotos',
    'exacta',
    'normal',
    'suficiente',
    'famoso',
    'visitantes',
    'visitas',
    'visita',
    'llevar',
    'rico',
    'ser',
    'restaurante',
    'saludan',
    'entre',
    'comprar',
    'entras',
  ],
  unit: {
    position: 6,
    title: 'Travel and culture',
    titleEn: 'Viajes y cultura',
    description:
      'Recommend places and give advice with the subjunctive (te recomiendo que, te aconsejo que, es mejor que), talk about conditions with si + present, give commands with pronouns (pruébalo, llévala), sort out a delayed or cancelled flight and behave politely in another culture.',
    emoji: '🧳',
    objective:
      'You can recommend places and customs to a visitor, give advice with the subjunctive, deal with a delay or a cancellation at the airport and talk about what is polite or rude in another culture.',
    grammar: {
      title: 'Te recomiendo que + subjunctive · si + present · commands with pronouns',
      explanation:
        'Recommending and advising work like wanting (U5): when you advise someone else, use que + subjunctive. Te recomiendo que visites el museo (I recommend that you visit the museum), te aconsejo que lleves una chaqueta (I advise you to take a jacket), es mejor que vayas temprano (it is better for you to go early). With usted, change te to le and use the usted form: le recomiendo que espere aquí. A general piece of advice with no specific person can take the infinitive: es mejor ir temprano. For real conditions, si (if, no accent) goes with the present, never with the future or the present subjunctive: si vas a Oaxaca…; the other half can be the present, ir a, the future or a command: si vas a Oaxaca, prueba el mole. The affirmative tú command is usually the same as the él / ella form of the present: prueba, lleva, visita, saluda. Object pronouns are attached to the end, and a written accent keeps the stress where it was: prueba + lo = pruébalo, lleva + la = llévala. Negative tú commands are the subjunctive, with the pronoun before the verb: no regatees, no llegues tarde, no lo pruebes.',
      examples: [
        {
          target: 'Te recomiendo que pruebes el mole.',
          base: 'I recommend that you try the mole.',
        },
        {
          target: 'Si vas a Oaxaca, visita el mercado.',
          base: 'If you go to Oaxaca, visit the market.',
        },
        {
          target: 'Es mejor que hagas la reserva antes de tu viaje.',
          base: 'It’s better to make the reservation before your trip.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'B1 nuevo (U6), redactado 2026-11-27. Sin revisión nativa. Revisar: (1) «te recomiendo que» y «te aconsejo que» + subjuntivo frente al infinitivo (te recomiendo visitar…, también correcto: se acepta en algunas respuestas, no en todas); (2) «la reserva» frente a «la reservación» (México; aceptada como texto); (3) «el retraso» (en el Cono Sur «la demora»; en México también «el vuelo viene retrasado»); (4) los datos culturales: un beso en la mejilla entre mujeres y entre hombre y mujer, la mano entre hombres, en México y en Perú (variación por región, edad y contexto); llegar «un poco más tarde» a una fiesta en casa; regatear sólo un poco en los mercados; saludar al entrar a una tienda pequeña; (5) el mercado 20 de Noviembre y Monte Albán en Oaxaca, el Valle Sagrado en Cusco y el Ángel de la Independencia en la Ciudad de México (nombres reales declarados como nombres); (6) «tlayudas» sin explicar en la lectura (se entiende como comida por el contexto); (7) «educado» = polite (falso amigo de educated): se explica en L3; (8) «a principios de noviembre» y «el Día de Muertos» (1 y 2 de noviembre); (9) la aerolínea que paga el hotel si cancela: depende de la causa y de la ley de cada país (en el diálogo la causa es la lluvia; quizás conviene otra causa o una frase más prudente); (10) «salga» (subjuntivo de salir) usado sin enseñarlo como irregular frecuente.',
    },
    words: [
      w(
        'es-te-recomiendo-que',
        'te recomiendo que',
        'I recommend that you',
        'Te recomiendo que pruebes el mole en Oaxaca.',
        'I recommend that you try the mole in Oaxaca.',
        ['b1', 'subjunctive', 'advice'],
        { acceptedTranslations: ['I recommend you'] },
      ),
      w(
        'es-te-aconsejo-que',
        'te aconsejo que',
        'I advise you to',
        'Te aconsejo que lleves una chaqueta: por la noche hace frío.',
        'I advise you to take a jacket: it’s cold at night.',
        ['b1', 'subjunctive', 'advice'],
        { acceptedTranslations: ['I advise that you'] },
      ),
      w(
        'es-es-mejor-que',
        'es mejor que',
        "it's better that",
        'Es mejor que vayas al mercado temprano.',
        'It’s better if you go to the market early.',
        ['b1', 'subjunctive', 'advice'],
        { acceptedTranslations: ['it is better that', "it's better if"] },
      ),
      w(
        'es-la-tradicion',
        'la tradición',
        'the tradition',
        'El Día de Muertos es una tradición muy importante en México.',
        'The Day of the Dead is a very important tradition in Mexico.',
        ['b1', 'culture'],
      ),
      w(
        'es-el-destino',
        'el destino',
        'the destination',
        'Oaxaca es un destino perfecto si te gusta la comida.',
        'Oaxaca is a perfect destination if you like food.',
        ['b1', 'travel'],
      ),
      w(
        'es-el-alojamiento',
        'el alojamiento',
        'the accommodation',
        'El alojamiento cerca de la playa es más caro.',
        'Accommodation near the beach is more expensive.',
        ['b1', 'travel'],
        { acceptedTranslations: ['the lodging'] },
      ),
      w(
        'es-el-recorrido',
        'el recorrido',
        'the tour',
        'El recorrido por Monte Albán es por la mañana.',
        'The tour of Monte Albán is in the morning.',
        ['b1', 'travel'],
        { acceptedTranslations: ['the route'] },
      ),
      w(
        'es-el-retraso',
        'el retraso',
        'the delay',
        'Mi vuelo tiene un retraso de dos horas.',
        'My flight has a two-hour delay.',
        ['b1', 'travel'],
        { emoji: '⏳' },
      ),
      w(
        'es-cancelar',
        'cancelar',
        'to cancel',
        'Tuve que cancelar el viaje porque estaba enferma.',
        'I had to cancel the trip because I was sick.',
        ['b1', 'travel'],
      ),
      w(
        'es-la-reserva',
        'la reserva',
        'the reservation',
        'Tengo una reserva para dos noches en un hotel de Lima.',
        'I have a reservation for two nights at a hotel in Lima.',
        ['b1', 'travel'],
        { acceptedTranslations: ['the booking'], acceptedTexts: ['la reservación'] },
      ),
      w(
        'es-el-mercado',
        'el mercado',
        'the market',
        'Los domingos voy al mercado a comprar verduras.',
        'On Sundays I go to the market to buy vegetables.',
        ['b1', 'travel', 'culture'],
        { emoji: '🧺' },
      ),
      w(
        'es-las-artesanias',
        'las artesanías',
        'the handicrafts',
        'En Oaxaca compré artesanías para mi familia.',
        'In Oaxaca I bought handicrafts for my family.',
        ['b1', 'culture'],
        { acceptedTranslations: ['the crafts'], acceptedTexts: ['la artesanía'] },
      ),
      w(
        'es-regatear',
        'regatear',
        'to haggle',
        'En el mercado puedes regatear un poco.',
        'At the market you can haggle a little.',
        ['b1', 'culture'],
        { acceptedTranslations: ['to bargain'] },
      ),
      w(
        'es-el-monumento',
        'el monumento',
        'the monument',
        'El Ángel de la Independencia es un monumento muy famoso.',
        'The Angel of Independence is a very famous monument.',
        ['b1', 'travel'],
      ),
      w(
        'es-educado',
        'educado',
        'polite',
        'Mi vecino es muy educado: siempre saluda.',
        'My neighbor is very polite: he always says hello.',
        ['b1', 'culture'],
        { acceptedTranslations: ['well-mannered'], acceptedTexts: ['educada'] },
      ),
      w(
        'es-grosero',
        'grosero',
        'rude',
        'Es grosero no saludar cuando entras a una tienda.',
        'It’s rude not to say hello when you go into a shop.',
        ['b1', 'culture'],
        { acceptedTexts: ['grosera'] },
      ),
      w(
        'es-saludar',
        'saludar',
        'to greet',
        'En México es importante saludar al llegar.',
        'In Mexico it’s important to greet people when you arrive.',
        ['b1', 'culture'],
        { acceptedTranslations: ['to say hello'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Te recomiendo que…',
        objective:
          'Recommend places and give advice to a friend with te recomiendo que and te aconsejo que + subjunctive.',
        intro: {
          explanation:
            'To recommend something to a friend, use te recomiendo que + subjunctive: te recomiendo que visites el museo (I recommend that you visit the museum). Te aconsejo que (I advise you to) works the same way. The subjunctive is formed as in U5: visito → visite, visites; llevo → lleve, lleves; hago → haga, hagas; ir → vaya, vayas. To someone you call usted, say le recomiendo que + usted form: le recomiendo que visite el museo. Recomendar changes e to ie: recomiendo, recomiendas. El recorrido is a tour or a route through a place, and el destino is your destination.',
          examples: [
            {
              target: 'Te recomiendo que visites el museo de Puebla.',
              base: 'I recommend that you visit the museum in Puebla.',
            },
            {
              target: 'Te aconsejo que hagas el recorrido por la mañana.',
              base: 'I advise you to do the tour in the morning.',
            },
          ],
        },
        takeaways: [
          'You recommend places with te recomiendo que + subjunctive.',
          'You give advice with te aconsejo que + subjunctive.',
        ],
        exercises: [
          ex.translationChoice(
            'te recomiendo que',
            'I recommend that you',
            ['I remember that you', 'I hope that you', 'I promise you that'],
            ['es-te-recomiendo-que'],
            { id: 'es.ex.nnipnp4u9f7szy' },
          ),
          ex.fillBlank(
            'Te recomiendo que ___ el museo de Puebla.',
            'I recommend that you visit the museum in Puebla.',
            'visites',
            ['visitar', 'visitas'],
            ['es-te-recomiendo-que'],
            {
              id: 'es.ex.wl6gyoh0k6ak5p',
              explanation:
                'After te recomiendo que, the verb is in the subjunctive. Visitar is a regular -ar verb: visito → visite, visites (tú).',
            },
          ),
          ex.listenChoice(
            'Te aconsejo que lleves una chaqueta.',
            ['Te aconsejo que lleve una chaqueta.', 'Te aconsejo llevar una chaqueta.'],
            ['es-te-aconsejo-que'],
            { id: 'es.ex.zdhvpqs0jj3o0m' },
          ),
          ex.translationChoice(
            'el destino',
            'the destination',
            ['the luggage', 'the trip', 'the ticket'],
            ['es-el-destino'],
            { id: 'es.ex.qsqcdi7q2uvfis' },
          ),
          ex.fillBlank(
            'Te aconsejo que ___ el recorrido por la mañana.',
            'I advise you to do the tour in the morning.',
            'hagas',
            ['haces', 'hacer', 'hiciste'],
            ['es-te-aconsejo-que', 'es-el-recorrido'],
            {
              id: 'es.ex.535wp8lvech3pi',
              explanation:
                'Hacer has the yo form hago, so its subjunctive is haga, hagas (tú). Haces is the ordinary present.',
            },
          ),
          ex.matchPairs(
            [
              ['te recomiendo que', 'I recommend that you'],
              ['te aconsejo que', 'I advise you to'],
              ['el recorrido', 'the tour'],
              ['el monumento', 'the monument'],
            ],
            ['es-te-recomiendo-que', 'es-te-aconsejo-que', 'es-el-recorrido', 'es-el-monumento'],
            { id: 'es.ex.6d7dcq35ixxftt' },
          ),
          ex.fillBlank(
            'El Ángel de la Independencia es un ___ muy famoso.',
            'The Angel of Independence is a very famous monument.',
            'monumento',
            ['aeropuerto', 'hotel', 'barrio'],
            ['es-el-monumento'],
            {
              id: 'es.ex.dfii0e1zg6bnof',
              skill: 'vocabulary',
              explanation:
                'El monumento is a monument, like the Ángel de la Independencia, a column with a golden angel on Reforma avenue in Mexico City.',
            },
          ),
          ex.orderWords(
            'Te recomiendo que vayas a Oaxaca en noviembre.',
            'I recommend that you go to Oaxaca in November.',
            ['es-te-recomiendo-que'],
            { id: 'es.ex.t45yu753wm911d' },
          ),
          ex.translateWrite(
            'I advise you to visit the monuments in the morning.',
            'Te aconsejo que visites los monumentos por la mañana.',
            ['es-te-aconsejo-que', 'es-el-monumento'],
            {
              id: 'es.ex.al44usg84lc6om',
              acceptedAnswers: [
                'Te aconsejo que visites los monumentos en la mañana.',
                'Te aconsejo visitar los monumentos por la mañana.',
                'Por la mañana te aconsejo que visites los monumentos.',
                'Le aconsejo que visite los monumentos por la mañana.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué destino me recomiendas en México?',
            'Recommend that your friend goes to Oaxaca (start with «Te recomiendo que»).',
            'Te recomiendo que vayas a Oaxaca.',
            [
              'Te recomiendo que vayas a Oaxaca',
              'Te recomiendo que visites Oaxaca.',
              'Te recomiendo que vayas a Oaxaca en noviembre.',
              'Te recomiendo que conozcas Oaxaca.',
            ],
            ['es-te-recomiendo-que', 'es-el-destino'],
            { id: 'es.ex.n4m04vh74b89l5' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Si vas a Oaxaca…',
        objective:
          'Give travel advice with si + present and es mejor que + subjunctive, and talk about markets, handicrafts and traditions.',
        intro: {
          explanation:
            'For a real condition, use si (if, with no accent) + present. The other half can be a present, ir a + infinitive, the future or a command: si vas a Oaxaca, prueba el mole; si viajas en noviembre, vas a ver el Día de Muertos. Never put the future or the present subjunctive right after si. The tú command is usually the él / ella form of the present: prueba, visita, lleva. Es mejor que + subjunctive gives softer advice: es mejor que vayas temprano. In many Latin American markets you can regatear (haggle) a little, but never in restaurants or big shops.',
          examples: [
            {
              target: 'Si vas a Oaxaca, prueba el mole.',
              base: 'If you go to Oaxaca, try the mole.',
            },
            {
              target: 'Es mejor que vayas temprano al mercado.',
              base: 'It’s better if you go to the market early.',
            },
          ],
        },
        takeaways: [
          'You give travel tips with si + present and a command or ir a.',
          'You give softer advice with es mejor que + subjunctive.',
        ],
        exercises: [
          ex.translationChoice(
            'regatear',
            'to haggle',
            ['to give a present', 'to come back', 'to sell'],
            ['es-regatear'],
            { id: 'es.ex.1slvih9x9xcwna' },
          ),
          ex.fillBlank(
            'Si vas a Oaxaca, ___ el mole.',
            'If you go to Oaxaca, try the mole.',
            'prueba',
            ['pruebes', 'probar'],
            ['es-te-recomiendo-que'],
            {
              id: 'es.ex.1lcdmshln0fy5v',
              explanation:
                'Here the second half is a tú command, which is the él / ella form of the present: prueba (o → ue). Pruebes is the subjunctive, used after te recomiendo que or in a negative command.',
            },
          ),
          ex.listenChoice(
            'Es mejor que vayas temprano al mercado.',
            ['Es mejor ir temprano al mercado.', 'Es mejor que vaya temprano al mercado.'],
            ['es-es-mejor-que', 'es-el-mercado'],
            { id: 'es.ex.mghiuvtyglxdr8' },
          ),
          question(
            'es.ex.qmynynnu5540dw',
            GUIA,
            'What does the guide recommend at the market?',
            'Trying tlayudas and mole',
            ['Buying a jacket', 'Going in the afternoon', 'Not buying handicrafts'],
            ['es-te-recomiendo-que', 'es-el-mercado'],
            'The guide says “Te recomiendo que vayas al mercado 20 de Noviembre y que pruebes las tlayudas y el mole”.',
          ),
          question(
            'es.ex.txnvw7k88yaml7',
            GUIA,
            'What does the guide say about haggling?',
            'You can haggle a little, but not ask for very low prices',
            [
              'You can never haggle in Oaxaca',
              'You should always ask for half the price',
              'You can only haggle in restaurants',
            ],
            ['es-regatear', 'es-es-mejor-que', 'es-las-artesanias'],
            'The guide says “Puedes regatear un poco, pero es mejor que no pidas precios muy bajos: muchas familias viven de su trabajo”.',
          ),
          question(
            'es.ex.lugmclezxcmvo5',
            GUIA,
            'Why is it better to visit Monte Albán in the morning?',
            'Because it is very hot in the afternoon',
            [
              'Because it closes at noon',
              'Because the market opens in the afternoon',
              'Because there is a tradition in the afternoon',
            ],
            ['es-te-aconsejo-que', 'es-el-recorrido', 'es-la-tradicion'],
            'The guide says “te aconsejo que hagas el recorrido por Monte Albán por la mañana, porque por la tarde hace mucho calor”.',
          ),
          ex.matchPairs(
            [
              ['es mejor que', "it's better that"],
              ['la tradición', 'the tradition'],
              ['el mercado', 'the market'],
              ['las artesanías', 'the handicrafts'],
            ],
            ['es-es-mejor-que', 'es-la-tradicion', 'es-el-mercado', 'es-las-artesanias'],
            { id: 'es.ex.fffop7qgookgip' },
          ),
          ex.fillBlank(
            'En el mercado puedes ___ un poco el precio de las artesanías.',
            'At the market you can haggle a little over the price of the handicrafts.',
            'regatear',
            ['pagar', 'probar'],
            ['es-regatear', 'es-las-artesanias', 'es-el-mercado'],
            {
              id: 'es.ex.r28jvf3h2rk231',
              skill: 'vocabulary',
              explanation:
                'Regatear el precio is to haggle over the price. In a market it is normal to haggle a little; in restaurants and big shops it is not.',
            },
          ),
          ex.translateWrite(
            'If you go to Oaxaca in November, you are going to see a very important tradition.',
            'Si vas a Oaxaca en noviembre, vas a ver una tradición muy importante.',
            ['es-la-tradicion'],
            {
              id: 'es.ex.lvl37njdhwjnqe',
              acceptedAnswers: [
                'Si vas a Oaxaca en noviembre vas a ver una tradición muy importante.',
                'Si viajas a Oaxaca en noviembre, vas a ver una tradición muy importante.',
                'Si vas a Oaxaca en noviembre, verás una tradición muy importante.',
                'Vas a ver una tradición muy importante si vas a Oaxaca en noviembre.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Es mejor ir al mercado por la mañana o por la tarde?',
            'Say it is better that your friend goes in the morning (start with «Es mejor que»).',
            'Es mejor que vayas por la mañana.',
            [
              'Es mejor que vayas por la mañana',
              'Es mejor que vayas en la mañana.',
              'Es mejor que vayas temprano.',
              'Es mejor que vayas por la mañana temprano.',
            ],
            ['es-es-mejor-que', 'es-el-mercado'],
            { id: 'es.ex.5zospo1drav2jd' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Pruébalo, llévala',
        objective:
          'Give commands with pronouns (pruébalo, llévala), say what not to do (no regatees) and talk about polite and rude behavior.',
        intro: {
          explanation:
            'With an affirmative tú command, object pronouns are attached to the end of the verb: prueba + lo = pruébalo (try it), lleva + la = llévala (take it). The written accent keeps the stress on the same syllable as before. Lo or la agrees with the thing: el mole → pruébalo, la chaqueta → llévala. Negative tú commands use the subjunctive, and the pronoun goes before the verb: no regatees, no llegues tarde, no lo pruebes. Careful with educado: it means polite, well-mannered, not educated. Grosero is rude.',
          examples: [
            { target: 'El mole está muy rico: pruébalo.', base: 'The mole is delicious: try it.' },
            {
              target: 'No regatees en los restaurantes: es grosero.',
              base: 'Don’t haggle in restaurants: it’s rude.',
            },
          ],
        },
        takeaways: [
          'You give commands with attached pronouns: pruébalo, llévala.',
          'You say what not to do with no + subjunctive and talk about polite and rude behavior.',
        ],
        exercises: [
          ex.translationChoice('educado', 'polite', ['rude', 'shy', 'tired'], ['es-educado'], {
            id: 'es.ex.in4qrkl8a3hq8l',
            explanation:
              'Educado is a false friend: it means polite, well-mannered. For “educated” Spanish usually says something else (culto, con estudios).',
          }),
          ex.fillBlank(
            'El mole está muy rico: ___.',
            'The mole is delicious: try it.',
            'pruébalo',
            ['pruébala', 'prueba'],
            ['es-te-recomiendo-que'],
            {
              id: 'es.ex.do73hyewg3293d',
              explanation:
                'El mole is masculine, so the pronoun is lo, attached to the command: pruébalo. Pruébala would be for a feminine noun (la sopa).',
            },
          ),
          ex.listenChoice(
            'Llévala contigo.',
            ['Llévalo contigo.', 'Llévalos contigo.'],
            ['es-te-aconsejo-que'],
            { id: 'es.ex.3syavswfdn6sf0' },
          ),
          question(
            'es.ex.i8cgece5xy3qop',
            CINCO,
            'What should you do when you go into a small shop in Mexico?',
            'Greet people, for example with “buenos días”',
            ['Haggle over the price', 'Take photos', 'Wait outside'],
            ['es-saludar', 'es-educado'],
            'The post says “No entres a una tienda pequeña sin saludar: un «buenos días» es suficiente”.',
          ),
          question(
            'es.ex.u1tagzvadcte0v',
            CINCO,
            'Where is it OK to arrive a little late?',
            'At a party at someone’s home',
            ['At a restaurant', 'At a job interview', 'At the airport'],
            ['es-educado'],
            'The post says “No llegues a una fiesta en casa a la hora exacta: lo normal es llegar un poco más tarde”.',
          ),
          question(
            'es.ex.4nw1ylodt8h70o',
            CINCO,
            'Where shouldn’t you haggle?',
            'In restaurants and big shops',
            ['In markets', 'Anywhere in Mexico', 'In small shops only'],
            ['es-regatear', 'es-el-mercado'],
            'The post says “No regatees en los restaurantes ni en las tiendas grandes; en los mercados, a veces sí puedes”. No regatees is a negative command: no + subjunctive.',
          ),
          ex.matchPairs(
            [
              ['saludar', 'to greet'],
              ['educado', 'polite'],
              ['grosero', 'rude'],
              ['regatear', 'to haggle'],
            ],
            ['es-saludar', 'es-educado', 'es-grosero', 'es-regatear'],
            { id: 'es.ex.x9il7k6vw4j0r6' },
          ),
          ex.fillBlank(
            'En una tienda pequeña es ___ no saludar.',
            'In a small shop it’s rude not to say hello.',
            'grosero',
            ['educado', 'barato', 'tímido'],
            ['es-grosero', 'es-saludar'],
            {
              id: 'es.ex.qttbd5acq33i8e',
              skill: 'vocabulary',
              explanation:
                'Grosero is rude. Not saying hello when you go into a small shop is considered rude in Mexico and in many other countries.',
            },
          ),
          ex.translateWrite(
            'Don’t haggle in restaurants: it’s rude.',
            'No regatees en los restaurantes: es grosero.',
            ['es-regatear', 'es-grosero'],
            {
              id: 'es.ex.7y6km3qw5zc31d',
              acceptedAnswers: [
                'No regatees en los restaurantes, es grosero.',
                'No regatees en los restaurantes. Es grosero.',
                'No regatees en restaurantes: es grosero.',
                'No regatees en restaurantes, es grosero.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Es grosero no saludar en una tienda?',
            'Answer yes, and say it is better that your friend greets people (start with «Sí, es mejor que»).',
            'Sí, es mejor que saludes.',
            [
              'Sí, es mejor que saludes',
              'Sí, es mejor que saludes a todos.',
              'Sí, es mejor que saludes siempre.',
              'Sí, es mejor que saludes al entrar.',
            ],
            ['es-saludar', 'es-es-mejor-que'],
            { id: 'es.ex.b0ivhszw8ltnjf' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Un vuelo con retraso',
        objective:
          'Deal with a delayed or cancelled flight at the airport and talk about reservations and accommodation, using usted.',
        intro: {
          explanation:
            'At an airline counter or a hotel desk people use usted, so advice becomes le recomiendo que + usted form: le recomiendo que espere aquí. El retraso is a delay (el vuelo tiene un retraso de dos horas); in South America you will also hear la demora. Cancelar is to cancel. La reserva is a reservation; in Mexico people often say la reservación. El alojamiento is accommodation: a hotel, an apartment, a room. A condition with si works with usted too: si cancelan el vuelo, la aerolínea le paga el hotel.',
          examples: [
            {
              target: 'Mi vuelo tiene un retraso de dos horas.',
              base: 'My flight is two hours late.',
            },
            {
              target: 'Si cancelan el vuelo, ¿quién paga el alojamiento?',
              base: 'If they cancel the flight, who pays for the accommodation?',
            },
          ],
        },
        takeaways: [
          'You explain a delay or a cancellation and ask what happens next.',
          'You understand advice with usted: le recomiendo que espere.',
        ],
        exercises: [
          ex.translationChoice(
            'el retraso',
            'the delay',
            ['the return', 'the reservation', 'the tour'],
            ['es-el-retraso'],
            { id: 'es.ex.ivzlscwv43ydhu' },
          ),
          ex.fillBlank(
            'Quiero ___ mi reserva del hotel porque no puedo viajar.',
            'I want to cancel my hotel reservation because I can’t travel.',
            'cancelar',
            ['regatear', 'saludar', 'probar'],
            ['es-cancelar', 'es-la-reserva'],
            {
              id: 'es.ex.0kbodle5mpehiv',
              skill: 'vocabulary',
              explanation:
                'Cancelar is to cancel: cancelar una reserva, cancelar un vuelo. After quiero (one subject) the verb stays in the infinitive.',
            },
          ),
          ex.listenChoice(
            'El vuelo tiene un retraso de dos horas.',
            [
              'El vuelo tiene un retraso de doce horas.',
              'El vuelo tiene un retraso de dos minutos.',
            ],
            ['es-el-retraso'],
            { id: 'es.ex.9zhm73nvdg674z' },
          ),
          question(
            'es.ex.zjhkwp702te6js',
            MOSTRADOR,
            'How long is the delay, and why?',
            'Three hours, because of the rain',
            [
              'Three hours, because of a problem with the plane',
              'Six hours, because of the rain',
              'One hour, because of the wind',
            ],
            ['es-el-retraso'],
            'Lorena says “Por la lluvia, el vuelo tiene un retraso de tres horas”.',
          ),
          question(
            'es.ex.z26rzx1dpsukm4',
            MOSTRADOR,
            'Why does Daniel prefer to fly today?',
            'He has a hotel reservation tonight and a meeting early tomorrow',
            [
              'He doesn’t like flying in the morning',
              'The morning flight is more expensive',
              'He wants to cancel his trip',
            ],
            ['es-la-reserva', 'es-es-mejor-que'],
            'Daniel says “Tengo una reserva en un hotel para esta noche y una reunión mañana temprano”, and then “es mejor que salga hoy”.',
          ),
          question(
            'es.ex.p9gx1437c4e3j3',
            MOSTRADOR,
            'What happens if the airline cancels the flight?',
            'The airline pays for his accommodation and dinner',
            [
              'Daniel has to pay for a new ticket',
              'Daniel flies with another airline the same night',
              'The airline gives him his money back',
            ],
            ['es-cancelar', 'es-el-alojamiento'],
            'Lorena says “Si lo cancelan, esta aerolínea le paga el alojamiento y la cena”.',
          ),
          ex.matchPairs(
            [
              ['el retraso', 'the delay'],
              ['cancelar', 'to cancel'],
              ['la reserva', 'the reservation'],
              ['el alojamiento', 'the accommodation'],
            ],
            ['es-el-retraso', 'es-cancelar', 'es-la-reserva', 'es-el-alojamiento'],
            { id: 'es.ex.anno900rmln8kl' },
          ),
          ex.fillBlank(
            'Le recomiendo que ___ cerca de la puerta 12.',
            'I recommend that you wait near gate 12. (formal)',
            'espere',
            ['espera', 'esperar'],
            ['es-te-recomiendo-que'],
            {
              id: 'es.ex.nm27f01rmbtwyh',
              explanation:
                'With usted, te becomes le and the verb takes the usted subjunctive: espero → espere. Espera is the ordinary present.',
            },
          ),
          ex.translateWrite(
            'If they cancel the flight, the airline pays for the accommodation.',
            'Si cancelan el vuelo, la aerolínea paga el alojamiento.',
            ['es-cancelar', 'es-el-alojamiento'],
            {
              id: 'es.ex.k60ig83qf4py1r',
              acceptedAnswers: [
                'Si cancelan el vuelo la aerolínea paga el alojamiento.',
                'Si cancelan el vuelo, la aerolínea va a pagar el alojamiento.',
                'Si cancelan el vuelo, la aerolínea pagará el alojamiento.',
                'Si la aerolínea cancela el vuelo, paga el alojamiento.',
                'Si cancelan el vuelo, la aerolínea le paga el alojamiento.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Tiene una reserva?',
            'You are at a hotel. Say yes, you have a reservation for two nights (start with «Sí»).',
            'Sí, tengo una reserva para dos noches.',
            [
              'Sí, tengo una reserva para dos noches',
              'Sí, tengo una reservación para dos noches.',
              'Sí, tengo reserva para dos noches.',
              'Sí, tengo una reserva por dos noches.',
            ],
            ['es-la-reserva'],
            { id: 'es.ex.5608v4syvhfxv7' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Otras costumbres',
        objective:
          'Compare customs between countries, understand advice for a trip and recommend places and good manners to a visitor.',
        intro: {
          explanation:
            'Customs change from place to place. In Mexico and Peru, people usually greet with one kiss on the cheek between women or between a man and a woman, while men shake hands (se dan la mano). Arriving a little late to a party at someone’s home is normal, but for a work appointment (una cita de trabajo) you should be on time. To give this kind of advice, use te aconsejo que, te recomiendo que or es mejor que + subjunctive. Cusco is more than 3,000 meters high, so visitors are advised to rest on the first day (por la altura).',
          examples: [
            {
              target: 'Es mejor que saludes a todos en la fiesta.',
              base: 'It’s better to greet everyone at the party.',
            },
            {
              target: 'Te aconsejo que descanses el primer día.',
              base: 'I advise you to rest on the first day.',
            },
          ],
        },
        takeaways: [
          'You compare greetings and punctuality in different countries.',
          'You give a visitor advice about places and good manners.',
        ],
        exercises: [
          ex.translationChoice('grosero', 'rude', ['polite', 'shy', 'big'], ['es-grosero'], {
            id: 'es.ex.364oebyurp4bd9',
          }),
          question(
            'es.ex.3jzvn1a3mqms7t',
            COSTUMBRES,
            'How do men usually greet each other in Cusco and in Mexico?',
            'They shake hands',
            ['They kiss on the cheek', 'They don’t greet each other', 'They hug everyone'],
            ['es-saludar'],
            'Rosa says “Los hombres se dan la mano”: men shake hands. The kiss on the cheek is between women, or between a man and a woman.',
          ),
          question(
            'es.ex.l0yd9v5fyr65w3',
            COSTUMBRES,
            'What does Rosa advise for a work appointment?',
            'To arrive on time',
            ['To arrive a little late', 'To greet everyone with a kiss', 'To bring a present'],
            ['es-te-aconsejo-que', 'es-educado'],
            'Rosa says “para una cita de trabajo, te aconsejo que llegues a tiempo”.',
          ),
          question(
            'es.ex.11unsvm55eimzy',
            COSTUMBRES,
            'Why should Emilio rest on his first day in Cusco?',
            'Because of the altitude',
            ['Because the tour is very long', 'Because of the party', 'Because his flight is late'],
            ['es-te-aconsejo-que', 'es-el-recorrido'],
            'Rosa says “te aconsejo que descanses el primer día, por la altura”: Cusco is very high.',
          ),
          ex.listenChoice(
            'Te aconsejo que descanses el primer día.',
            ['Te aconsejo que descanses el primer mes.', 'Te aconsejo descansar el primer día.'],
            ['es-te-aconsejo-que'],
            { id: 'es.ex.iiw20hjwbrdk2x' },
          ),
          ex.fillBlank(
            'Para una cita de trabajo, es mejor que ___ a tiempo.',
            'For a work appointment, it’s better that you arrive on time.',
            'llegues',
            ['llegas', 'llegar', 'llegaste'],
            ['es-es-mejor-que'],
            {
              id: 'es.ex.fpmat1jb5rf6je',
              explanation:
                'Es mejor que + subjunctive: llegues. The g becomes gu before e to keep the hard g sound: llegar → llegue, llegues.',
            },
          ),
          ex.fillBlank(
            'Para ser ___ en una fiesta, saluda a todos.',
            'To be polite at a party, greet everyone.',
            'educado',
            ['grosero', 'tímido', 'cansado'],
            ['es-educado', 'es-saludar'],
            {
              id: 'es.ex.zetyi3klr2x224',
              skill: 'vocabulary',
              explanation: 'Educado means polite. Saluda is the tú command of saludar: greet.',
            },
          ),
          ex.orderWords(
            'Es mejor que saludes a todos en la fiesta.',
            'It’s better to greet everyone at the party.',
            ['es-es-mejor-que', 'es-saludar'],
            { id: 'es.ex.9rcr1ga645sup4' },
          ),
          ex.translateWrite(
            'I recommend that you make a reservation before your trip.',
            'Te recomiendo que hagas una reserva antes de tu viaje.',
            ['es-te-recomiendo-que', 'es-la-reserva'],
            {
              id: 'es.ex.9mbidibgoarxvs',
              acceptedAnswers: [
                'Te recomiendo que hagas la reserva antes de tu viaje.',
                'Te recomiendo que hagas una reservación antes de tu viaje.',
                'Te recomiendo hacer una reserva antes de tu viaje.',
                'Le recomiendo que haga una reserva antes de su viaje.',
              ],
            },
          ),
          ex.shortAnswer(
            'Un amigo va a visitar tu ciudad. ¿Qué le recomiendas?',
            'Recommend that he visits the market (start with «Te recomiendo que»).',
            'Te recomiendo que visites el mercado.',
            [
              'Te recomiendo que visites el mercado',
              'Te recomiendo que vayas al mercado.',
              'Te recomiendo que conozcas el mercado.',
              'Te recomiendo que visites el mercado de mi ciudad.',
            ],
            ['es-te-recomiendo-que', 'es-el-mercado'],
            { id: 'es.ex.77vn4iysfc4bc1' },
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

/** Tareas de escritura de la unidad (docs/ES_B1.md). */
export const ES_B1_U06_WRITING: readonly WritingTaskDef[] = [
  {
    ...base,
    id: 'es.b1.wt.consejos',
    kind: 'guided',
    codes: [],
    lesson: 'es-b1-u06-l05',
    title: 'Advice for a visitor',
    instructions:
      'A friend is going to visit your city or your country (real or invented). Write a message with advice: what places to visit, what to eat, where to stay and how to be polite. Use te recomiendo que or te aconsejo que + subjunctive, and at least one sentence with si + present.',
    prompts: ['¿Qué lugares me recomiendas?', '¿Qué es grosero en tu país?'],
    requirements: [
      {
        id: 'recommend',
        label:
          'You recommend or advise with que + subjunctive (te recomiendo que, te aconsejo que, es mejor que…)',
        kind: 'pattern',
        patterns: [
          ['recomiendo', 'que'],
          ['aconsejo', 'que'],
          ['mejor', 'que'],
        ],
      },
      {
        id: 'condition',
        label: 'You use si + present (si vas…, si te gusta…)',
        kind: 'pattern',
        patterns: [['si', '<WORD>']],
      },
      ...common(5),
    ],
    model:
      '¡Hola, Emma! ¡Qué bueno: vienes a Oaxaca en noviembre! Te recomiendo que vayas al mercado y que pruebes el mole. Si te gustan las artesanías, puedes regatear un poco, pero es mejor que no pidas precios muy bajos. Para el alojamiento, te aconsejo que hagas la reserva con tiempo, porque hay muchos visitantes por el Día de Muertos. Y es importante saludar cuando entras a una tienda: aquí es muy grosero no saludar. ¡Nos vemos en noviembre!',
    checklist: [
      'After te recomiendo que, te aconsejo que and es mejor que, the verb is in the subjunctive (vayas, pruebes, hagas).',
      'After si, I use the present, never the future.',
      'I use tú with my friend and close the message in a friendly way.',
    ],
  },
];
