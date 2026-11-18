import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Italiano A2 U1 «¿Qué hiciste el fin de semana?» (docs/IT_A1_A2.md): el passato prossimo con avere
 * (-ato, -uto, -ito), los participios irregulares frecuentes (fatto, letto, scritto, preso), el plural
 * (abbiamo, hanno), già / non… ancora y las expresiones del pasado (ieri sera, stamattina, scorso).
 * Falsos amigos: la partita es el partido; la spesa son las compras de comida; la lettera es la carta.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const LUNEDI = dialogue(
  'it.stim.a2-u1-lunedi',
  'El lunes en la oficina, Chiara y Davide hablan del fin de semana.',
  [
    ['Chiara', 'Ciao Davide! Com’è andato il fine settimana?'],
    ['Davide', 'Bene! Sabato ho dormito fino alle dieci e poi ho fatto la spesa.'],
    ['Chiara', 'E domenica?'],
    ['Davide', 'Ho visto la partita con mio fratello. E tu?'],
    ['Chiara', 'Io ho letto un libro e ho pulito la casa. Che noia!'],
  ],
);

const MESSAGGIO = reading(
  'it.stim.a2-u1-messaggio',
  'message',
  'La mamá de Luca le deja un mensaje.',
  [
    'Ciao Luca, hai già mangiato?',
    'Stamattina ho fatto la spesa: nel frigo ci sono la pasta e la verdura.',
    'Ieri sera ha chiamato la nonna: non le hai ancora scritto!',
    'Un bacio, mamma',
  ],
  { from: 'Mamma', to: 'Luca' },
);

const DIARIO = reading(
  'it.stim.a2-u1-como',
  'post',
  'Sara cuenta en su blog un paseo de domingo.',
  [
    'Domenica scorsa io e i miei amici abbiamo preso il treno per Como.',
    'Abbiamo mangiato in una trattoria vicino al lago e abbiamo bevuto un buon vino.',
    'I miei amici hanno parlato tutto il giorno… e io ho dormito sul treno!',
  ],
  { from: 'Sara', title: 'Una domenica sul lago' },
);

export const IT_A2_U01: ItUnitDef = {
  names: ['Chiara', 'Davide', 'Luca', 'Como', 'Sara', 'Marco', 'Mamma'],
  support: [
    'fino',
    'noia',
    'frigo',
    'pasta',
    'verdura',
    'chiamato',
    'bacio',
    'trattoria',
    'lago',
    'vino',
    'tutto',
    'lettera',
    'avete',
    'buon',
  ],
  unit: {
    position: 1,
    title: '¿Qué hiciste el fin de semana?',
    titleEn: 'Il fine settimana',
    description:
      'Contar lo que hiciste con el passato prossimo: participios regulares e irregulares, già, non… ancora y las expresiones del pasado.',
    emoji: '🗓️',
    objective:
      'Podés contar qué hiciste el fin de semana o ayer (ho dormito, abbiamo preso il treno), decir lo que ya hiciste y lo que todavía no, y entender el relato de otra persona.',
    grammar: {
      title: 'Passato prossimo con avere',
      explanation:
        'Para contar algo terminado: avere en presente + participio. Los regulares: -are → -ato (parlato), -ere → -uto (bevuto), -ire → -ito (dormito). Irregulares frecuentes: fatto, letto, scritto, preso, visto. Con avere el participio no cambia: Sara ha letto, loro hanno letto. Donde en el Río de la Plata decimos «comí», en italiano se dice ho mangiato. Già y ancora van entre avere y el participio: ho già mangiato, non ho ancora mangiato.',
      examples: [
        { target: 'Sabato ho dormito fino alle dieci.', base: 'El sábado dormí hasta las diez.' },
        { target: 'Abbiamo preso il treno per Como.', base: 'Tomamos el tren a Como.' },
        { target: 'Non ho ancora mangiato.', base: 'Todavía no comí.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U1). Sin revisión nativa: revisar el registro de los diálogos y la colocación de già / ancora.',
    },
    words: [
      w('it-ho-parlato', 'ho parlato', 'hablé', 'Ho parlato con Marco.', 'Hablé con Marco.', [
        'verbs',
        'past',
      ]),
      w('it-ho-dormito', 'ho dormito', 'dormí', 'Ho dormito molto.', 'Dormí mucho.', [
        'verbs',
        'past',
      ]),
      w('it-ho-bevuto', 'ho bevuto', 'bebí', 'Ho bevuto un caffè.', 'Me tomé un café.', [
        'verbs',
        'past',
      ]),
      w('it-ho-fatto', 'ho fatto', 'hice', 'Ho fatto colazione al bar.', 'Desayuné en el bar.', [
        'verbs',
        'past',
      ]),
      w('it-ho-letto', 'ho letto', 'yo leí', 'Ho letto un libro.', 'Leí un libro.', [
        'verbs',
        'past',
      ]),
      w('it-ho-scritto', 'ho scritto', 'escribí', 'Ho scritto una lettera.', 'Escribí una carta.', [
        'verbs',
        'past',
      ]),
      w(
        'it-ho-preso',
        'ho preso',
        'tomé',
        'Ho preso il treno.',
        'Tomé el tren.',
        ['verbs', 'past'],
        {
          acceptedTranslations: ['agarré'],
        },
      ),
      w('it-ho-pulito', 'ho pulito', 'limpié', 'Ho pulito la casa.', 'Limpié la casa.', [
        'verbs',
        'past',
        'home',
      ]),
      w('it-abbiamo', 'abbiamo', 'tenemos', 'Abbiamo un cane.', 'Tenemos un perro.', ['verbs']),
      w('it-hanno', 'hanno', 'tienen', 'Hanno due figli.', 'Tienen dos hijos.', ['verbs']),
      w('it-gia', 'già', 'ya', 'Ho già mangiato.', 'Ya comí.', ['time']),
      w('it-ancora', 'ancora', 'todavía', 'Non ho ancora mangiato.', 'Todavía no comí.', ['time'], {
        acceptedTranslations: ['aún', 'otra vez'],
      }),
      w(
        'it-scorso',
        'scorso',
        'pasado',
        'Sabato scorso ho visto un film.',
        'El sábado pasado vi una película.',
        ['time'],
        {
          acceptedTexts: ['scorsa'],
          acceptedTranslations: ['pasada'],
        },
      ),
      w(
        'it-stamattina',
        'stamattina',
        'esta mañana',
        'Stamattina ho fatto la spesa.',
        'Esta mañana hice las compras.',
        ['time'],
      ),
      w(
        'it-ieri-sera',
        'ieri sera',
        'anoche',
        'Ieri sera ho dormito male.',
        'Anoche dormí mal.',
        ['time'],
        {
          acceptedTranslations: ['ayer a la noche'],
        },
      ),
      w(
        'it-partita',
        'partita',
        'partido (de fútbol)',
        'Ho visto la partita.',
        'Vi el partido.',
        ['free-time'],
        {
          acceptedTranslations: ['partido'],
          emoji: '⚽',
        },
      ),
      w(
        'it-la-spesa',
        'la spesa',
        'las compras (de comida)',
        'Faccio la spesa il sabato.',
        'Hago las compras los sábados.',
        ['shopping', 'home'],
        {
          acceptedTranslations: ['las compras', 'el súper'],
          emoji: '🛒',
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Ho parlato, ho dormito',
        objective: 'Contar lo que hiciste con los participios regulares.',
        intro: {
          explanation:
            'El passato prossimo cuenta algo terminado: avere + participio. -are → -ato (parlato), -ere → -uto (bevuto), -ire → -ito (dormito). Donde decimos «hablé», en italiano se dice ho parlato.',
          examples: [
            { target: 'Ieri ho parlato con mia madre.', base: 'Ayer hablé con mi mamá.' },
            { target: 'Ho dormito molto.', base: 'Dormí mucho.' },
          ],
        },
        takeaways: [
          'Formás el passato prossimo con ho + participio.',
          'Conocés los participios en -ato, -uto, -ito.',
        ],
        exercises: [
          ex.translationChoice(
            'ho dormito',
            'dormí',
            ['duermo', 'dormimos', 'voy a dormir'],
            ['it-ho-dormito'],
            { id: 'it.ex.ik8nnf9s6u7e95' },
          ),
          ex.matchPairs(
            [
              ['ho parlato', 'hablé'],
              ['ho dormito', 'dormí'],
              ['ho bevuto', 'bebí'],
              ['ho mangiato', 'comí'],
            ],
            ['it-ho-parlato', 'it-ho-dormito', 'it-ho-bevuto', 'it-ho-mangiato'],
            { id: 'it.ex.d3t5eblib3c18x' },
          ),
          ex.listenChoice(
            'Ieri ho dormito molto.',
            ['Ieri ho mangiato molto.', 'Oggi ho dormito molto.', 'Ieri hai dormito molto?'],
            ['it-ho-dormito', 'it-ieri'],
            { id: 'it.ex.j90xdjxwonim1v' },
          ),
          ex.fillBlank(
            'Ieri ho ___ con mia madre.',
            'Ayer hablé con mi mamá.',
            'parlato',
            ['parlo', 'parli', 'parla'],
            ['it-ho-parlato'],
            {
              id: 'it.ex.nqfz8kjo3gogc1',
              explanation: 'Parlare es de -are: el participio es parlato.',
            },
          ),
          ex.fillBlank(
            'Ho ___ un caffè al bar.',
            'Tomé un café en el bar.',
            'bevuto',
            ['bevo', 'bevi', 'bevuta'],
            ['it-ho-bevuto', 'it-caffe'],
            {
              id: 'it.ex.x1cg459nr9qcyi',
              explanation: 'Bere da bevuto; con avere el participio no cambia.',
            },
          ),
          ex.fillBlank(
            'Sabato ___ dormito fino alle dieci.',
            'El sábado dormí hasta las diez.',
            'ho',
            ['sono', 'hai', 'è'],
            ['it-ho-dormito'],
            {
              id: 'it.ex.wpyow09qby7nqh',
              explanation: 'Dormire forma el pasado con avere: ho dormito.',
            },
          ),
          ex.orderWords(
            'Ieri ho parlato con Marco.',
            'Ayer hablé con Marco.',
            ['it-ho-parlato', 'it-ieri'],
            { id: 'it.ex.fbix95j79sla4c' },
          ),
          ex.shortAnswer(
            'Hai dormito bene?',
            '¿Dormiste bien? (Respondé que sí, que dormiste mucho.)',
            'Sì, ho dormito molto.',
            ['Sì, ho dormito molto bene.', 'Ho dormito molto.', 'Sì, ho dormito bene.'],
            ['it-ho-dormito'],
            { id: 'it.ex.tyms3y02rr16xx' },
          ),
          ex.translateWrite(
            'Ayer hablé con mi hermana.',
            'Ieri ho parlato con mia sorella.',
            ['it-ho-parlato', 'it-ieri', 'it-sorella'],
            {
              id: 'it.ex.i3k48xsxqswx7v',
              acceptedAnswers: ['Ho parlato con mia sorella ieri.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Ho fatto, ho preso',
        objective: 'Usar los participios irregulares más frecuentes.',
        intro: {
          explanation:
            'Algunos participios son irregulares: fare → fatto, leggere → letto, scrivere → scritto, prendere → preso (y vedere → visto). Ojo: fare la spesa es hacer las compras de comida, y la lettera es la carta que se escribe.',
          examples: [
            { target: 'Ho fatto la spesa al supermercato.', base: 'Hice las compras en el súper.' },
            { target: 'Ho preso il treno alle otto.', base: 'Tomé el tren a las ocho.' },
          ],
        },
        takeaways: [
          'Usás fatto, letto, scritto y preso.',
          'Decís que hiciste las compras: ho fatto la spesa.',
        ],
        exercises: [
          ex.translationChoice(
            'ho letto',
            'leí',
            ['yo leo', 'yo escribí', 'yo elegí'],
            ['it-ho-letto'],
            { id: 'it.ex.0qxlaavnj5vxm7' },
          ),
          ex.matchPairs(
            [
              ['ho fatto', 'hice'],
              ['ho letto', 'yo leí'],
              ['ho scritto', 'escribí'],
              ['ho preso', 'tomé'],
            ],
            ['it-ho-fatto', 'it-ho-letto', 'it-ho-scritto', 'it-ho-preso'],
            { id: 'it.ex.8ug4nhc6r7zw6i' },
          ),
          ex.listenChoice(
            'Ho preso il treno alle otto.',
            [
              'Ho preso l’autobus alle otto.',
              'Ho preso il treno alle sette.',
              'Prendo il treno alle otto.',
            ],
            ['it-ho-preso', 'it-treno'],
            { id: 'it.ex.n6ipa2oenwj8ag' },
          ),
          ex.fillBlank(
            'Ieri ho ___ un libro.',
            'Ayer leí un libro.',
            'letto',
            ['leggo', 'scritto', 'preso'],
            ['it-ho-letto', 'it-libro'],
            {
              id: 'it.ex.mtldnlusxq390d',
            },
          ),
          ex.translationChoice(
            'la spesa',
            'las compras (de comida)',
            ['el gasto', 'la cuenta', 'el precio'],
            ['it-la-spesa'],
            {
              id: 'it.ex.ljjuhrbu2l36y0',
              explanation:
                'Fare la spesa es hacer las compras de comida (en el súper, en el mercado).',
            },
          ),
          ex.fillBlank(
            'Ho ___ la spesa al supermercato.',
            'Hice las compras en el súper.',
            'fatto',
            ['faccio', 'preso', 'visto'],
            ['it-ho-fatto', 'it-la-spesa'],
            { id: 'it.ex.q7erzo0m2ya88h' },
          ),
          ex.fillBlank(
            'Ho ___ una lettera alla nonna.',
            'Le escribí una carta a la abuela.',
            'scritto',
            ['scrivo', 'letto', 'fatto'],
            ['it-ho-scritto', 'it-nonna'],
            {
              id: 'it.ex.zy959vvs6hs293',
              explanation:
                'Scrivere da scritto. La lettera es la carta (en italiano, carta es «papel»).',
            },
          ),
          ex.shortAnswer(
            'Cosa hai fatto ieri?',
            '¿Qué hiciste ayer? (Respondé que hiciste las compras.)',
            'Ieri ho fatto la spesa.',
            ['Ho fatto la spesa.', 'Ho fatto la spesa ieri.'],
            ['it-ho-fatto', 'it-la-spesa'],
            { id: 'it.ex.updrdyz089np3c' },
          ),
          ex.translateWrite('Tomé el tren.', 'Ho preso il treno.', ['it-ho-preso', 'it-treno'], {
            id: 'it.ex.a61l17483wmua8',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Abbiamo mangiato, hanno parlato',
        objective: 'Contar lo que hizo un grupo.',
        intro: {
          explanation:
            'Avere en plural: abbiamo (noi), avete (voi), hanno (loro). Con avere el participio no cambia aunque hablen varias personas: abbiamo mangiato, hanno parlato, Sara ha letto.',
          examples: [
            { target: 'Abbiamo mangiato in una trattoria.', base: 'Comimos en una trattoria.' },
            {
              target: 'I miei amici hanno parlato tutto il giorno.',
              base: 'Mis amigos hablaron todo el día.',
            },
          ],
        },
        takeaways: [
          'Contás en plural: abbiamo, hanno + participio.',
          'Sabés que con avere el participio no concuerda.',
        ],
        exercises: [
          ex.translationChoice('hanno', 'tienen', ['tenemos', 'tiene', 'tenés'], ['it-hanno'], {
            id: 'it.ex.8omhnhg3jh9uh2',
          }),
          ex.fillBlank(
            'Noi ___ mangiato in una trattoria.',
            'Comimos en una trattoria.',
            'abbiamo',
            ['hanno', 'ho', 'siamo'],
            ['it-abbiamo', 'it-ho-mangiato'],
            { id: 'it.ex.puadoc3cw2ptqg' },
          ),
          ex.fillBlank(
            'I miei amici ___ parlato tutto il giorno.',
            'Mis amigos hablaron todo el día.',
            'hanno',
            ['abbiamo', 'ha', 'sono'],
            ['it-hanno', 'it-ho-parlato'],
            { id: 'it.ex.6optnw67wwm835' },
          ),
          ex.fillBlank(
            'Sara ha ___ un libro.',
            'Sara leyó un libro.',
            'letto',
            ['letta', 'letti', 'lette'],
            ['it-ho-letto'],
            {
              id: 'it.ex.ryxd7j3rjubuem',
              explanation:
                'Con avere el participio queda en -o aunque hable una mujer: Sara ha letto.',
            },
          ),
          ex.listenChoice(
            'Abbiamo bevuto un buon vino.',
            [
              'Hanno bevuto un buon vino.',
              'Abbiamo bevuto un caffè.',
              'Abbiamo preso un buon vino.',
            ],
            ['it-abbiamo', 'it-ho-bevuto'],
            { id: 'it.ex.6o31g2n1oyb9t3' },
          ),
          question(
            'it.ex.ndqxnhcarc6351',
            DIARIO,
            '¿Cómo fueron Sara y sus amigos a Como?',
            'En tren',
            ['En auto', 'En colectivo', 'En bicicleta'],
            ['it-ho-preso', 'it-abbiamo', 'it-scorso'],
            'Sara escribe: «abbiamo preso il treno per Como».',
          ),
          question(
            'it.ex.riwkcjf8qzsi0v',
            DIARIO,
            '¿Dónde comieron?',
            'En una trattoria cerca del lago',
            ['En la casa de un amigo', 'En el tren', 'En un bar de la estación'],
            ['it-ho-mangiato'],
            'Sara escribe: «Abbiamo mangiato in una trattoria vicino al lago».',
          ),
          question(
            'it.ex.0dvqhvhodhf2ns',
            DIARIO,
            '¿Qué hizo Sara mientras sus amigos hablaban?',
            'Durmió en el tren',
            ['Leyó un libro', 'Habló todo el día', 'Tomó un café'],
            ['it-ho-dormito', 'it-hanno'],
            'Sara escribe: «I miei amici hanno parlato tutto il giorno… e io ho dormito sul treno!».',
          ),
          ex.shortAnswer(
            'Cosa avete mangiato?',
            '¿Qué comieron ustedes? (Respondé que comieron una pizza.)',
            'Abbiamo mangiato una pizza.',
            ['Noi abbiamo mangiato una pizza.', 'Abbiamo mangiato la pizza.', 'Una pizza.'],
            ['it-abbiamo', 'it-ho-mangiato'],
            { id: 'it.ex.uu7fb99yx2j6xd' },
          ),
          ex.translateWrite(
            'Ellos tomaron un café.',
            'Hanno preso un caffè.',
            ['it-hanno', 'it-ho-preso'],
            {
              id: 'it.ex.6nl6lxe8lpyqai',
              acceptedAnswers: [
                'Loro hanno preso un caffè.',
                'Hanno bevuto un caffè.',
                'Loro hanno bevuto un caffè.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Già, non… ancora',
        objective: 'Decir lo que ya hiciste y lo que todavía no.',
        intro: {
          explanation:
            'Già (ya) y ancora (todavía) van entre avere y el participio: ho già mangiato (ya comí), non ho ancora mangiato (todavía no comí). Non… ancora también sirve solo: non ancora!',
          examples: [
            { target: 'Ho già fatto la spesa.', base: 'Ya hice las compras.' },
            {
              target: 'Non ho ancora scritto alla nonna.',
              base: 'Todavía no le escribí a la abuela.',
            },
          ],
        },
        takeaways: ['Decís ho già + participio.', 'Decís non ho ancora + participio.'],
        exercises: [
          ex.translationChoice('già', 'ya', ['todavía', 'nunca', 'después'], ['it-gia'], {
            id: 'it.ex.4oql9ertyxxfor',
          }),
          ex.translationChoice('ancora', 'todavía', ['ya', 'ahora', 'nunca'], ['it-ancora'], {
            id: 'it.ex.x4zcdugpeccnzm',
            explanation: 'Non… ancora es «todavía no»; ancora solo también es «otra vez» o «más».',
          }),
          ex.fillBlank(
            'Ho ___ mangiato, grazie.',
            'Ya comí, gracias.',
            'già',
            ['ancora', 'mai', 'sempre'],
            ['it-gia', 'it-ho-mangiato'],
            {
              id: 'it.ex.ms1lcoycosuujb',
            },
          ),
          ex.fillBlank(
            'Non ho ___ scritto alla nonna.',
            'Todavía no le escribí a la abuela.',
            'ancora',
            ['già', 'sempre', 'molto'],
            ['it-ancora', 'it-ho-scritto'],
            { id: 'it.ex.igemv2jbqv9fur' },
          ),
          ex.listenChoice(
            'Hai già fatto la spesa?',
            [
              'Hai già fatto colazione?',
              'Ho già fatto la spesa.',
              'Non hai ancora fatto la spesa?',
            ],
            ['it-gia', 'it-la-spesa'],
            { id: 'it.ex.st2kq876ngujt6' },
          ),
          ex.orderWords(
            'Non ho ancora letto il libro.',
            'Todavía no leí el libro.',
            ['it-ancora', 'it-ho-letto'],
            { id: 'it.ex.f30h6ks2f5pfh0' },
          ),
          question(
            'it.ex.ae9n9imjf8d3rp',
            MESSAGGIO,
            '¿Qué hizo la mamá de Luca a la mañana?',
            'Las compras',
            ['Pasta para la cena', 'Llamó a la abuela', 'Limpió la casa'],
            ['it-stamattina', 'it-la-spesa'],
            'La mamá escribe: «Stamattina ho fatto la spesa».',
          ),
          question(
            'it.ex.3yqzwh9lxhv92r',
            MESSAGGIO,
            '¿Qué todavía no hizo Luca?',
            'Escribirle a la abuela',
            ['Comer', 'Hacer las compras', 'Llamar a su mamá'],
            ['it-ancora', 'it-ho-scritto'],
            'La mamá escribe: «non le hai ancora scritto!».',
          ),
          ex.shortAnswer(
            'Hai già mangiato?',
            '¿Ya comiste? (Respondé que no, que todavía no comiste.)',
            'No, non ho ancora mangiato.',
            ['Non ho ancora mangiato.', 'No, non ancora.', 'Non ancora.'],
            ['it-ancora', 'it-ho-mangiato'],
            { id: 'it.ex.avwf2cic52vysw' },
          ),
          ex.translateWrite(
            'Ya hice las compras.',
            'Ho già fatto la spesa.',
            ['it-gia', 'it-ho-fatto', 'it-la-spesa'],
            {
              id: 'it.ex.seu0puiaki17a1',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Sabato scorso',
        objective: 'Ubicar en el tiempo lo que hiciste y entender un relato.',
        intro: {
          explanation:
            'Para el pasado: stamattina (esta mañana), ieri sera (anoche), sabato scorso, la settimana scorsa (scorso concuerda). Ojo: la partita es el partido; la partida de un viaje es otra cosa.',
          examples: [
            { target: 'Ieri sera ho visto la partita.', base: 'Anoche vi el partido.' },
            {
              target: 'La settimana scorsa ho pulito la casa.',
              base: 'La semana pasada limpié la casa.',
            },
          ],
        },
        takeaways: [
          'Decís cuándo: stamattina, ieri sera, sabato scorso.',
          'Entendés un relato de fin de semana.',
        ],
        exercises: [
          ex.translationChoice(
            'ieri sera',
            'anoche',
            ['ayer a la mañana', 'esta noche', 'mañana a la noche'],
            ['it-ieri-sera'],
            {
              id: 'it.ex.qlpqeoxd04gzy7',
            },
          ),
          ex.translationChoice(
            'partita',
            'partido (de fútbol)',
            ['partida', 'parte', 'fiesta'],
            ['it-partita'],
            {
              id: 'it.ex.t0jpx366gasm90',
              explanation: 'Falso amigo: la partita es el partido (de fútbol, de cartas).',
            },
          ),
          ex.fillBlank(
            'Sabato ___ ho visto la partita.',
            'El sábado pasado vi el partido.',
            'scorso',
            ['scorsa', 'scorsi', 'prima'],
            ['it-scorso', 'it-partita'],
            {
              id: 'it.ex.s7t3ngtxvrtnu7',
              explanation: 'Sabato es masculino: sabato scorso.',
            },
          ),
          ex.fillBlank(
            'La settimana ___ ho pulito la casa.',
            'La semana pasada limpié la casa.',
            'scorsa',
            ['scorso', 'scorse', 'dopo'],
            ['it-scorso', 'it-ho-pulito'],
            {
              id: 'it.ex.c24snucu77fsng',
              explanation: 'Settimana es femenino: la settimana scorsa.',
            },
          ),
          ex.listenChoice(
            'Stamattina ho pulito la casa.',
            [
              'Stamattina ho fatto la spesa.',
              'Ieri sera ho pulito la casa.',
              'Sabato scorso ho pulito la casa.',
            ],
            ['it-stamattina', 'it-ho-pulito'],
            { id: 'it.ex.vgawp80fosf5zf' },
          ),
          question(
            'it.ex.zosarm9yqb96ye',
            LUNEDI,
            '¿Qué hizo Davide el sábado?',
            'Durmió hasta las diez y después hizo las compras',
            [
              'Vio el partido con su hermano',
              'Leyó un libro y limpió la casa',
              'Trabajó hasta las diez',
            ],
            ['it-ho-dormito', 'it-la-spesa'],
            'Davide dice: «Sabato ho dormito fino alle dieci e poi ho fatto la spesa».',
          ),
          question(
            'it.ex.yocnkocw63iamc',
            LUNEDI,
            '¿Y el domingo?',
            'Vio el partido con su hermano',
            ['Fue a la cancha con su papá', 'Hizo las compras', 'Durmió todo el día'],
            ['it-partita'],
            'Davide dice: «Ho visto la partita con mio fratello».',
          ),
          question(
            'it.ex.u7fdgovmoe12bp',
            LUNEDI,
            '¿Cómo fue el fin de semana de Chiara?',
            'Aburrido: leyó y limpió la casa',
            ['Divertido: fue a un partido', 'Cansador: trabajó mucho', 'Tranquilo: durmió mucho'],
            ['it-ho-letto', 'it-ho-pulito'],
            'Chiara dice: «ho letto un libro e ho pulito la casa. Che noia!».',
          ),
          ex.shortAnswer(
            'Cosa hai fatto ieri sera?',
            '¿Qué hiciste anoche? (Respondé que viste el partido.)',
            'Ieri sera ho visto la partita.',
            [
              'Ho visto la partita.',
              'Ho guardato la partita.',
              'Ieri sera ho guardato la partita.',
            ],
            ['it-ieri-sera', 'it-partita'],
            { id: 'it.ex.ecxlnpypkjgnw4' },
          ),
          ex.translateWrite(
            'Esta mañana limpié la casa.',
            'Stamattina ho pulito la casa.',
            ['it-stamattina', 'it-ho-pulito'],
            {
              id: 'it.ex.leopzubb4nz0m3',
            },
          ),
        ],
      },
    ],
  },
};
