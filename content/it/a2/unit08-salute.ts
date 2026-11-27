import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Italiano A2 U8 «Salud y bienestar» (docs/IT_A1_A2.md): decir qué te duele (mi fa male la schiena, ho
 * mal di testa), los síntomas, ir dal medico (da + persona), la farmacia y el imperativo: con tu
 * (prendi, bevi, riposati; non mangiare) y con Lei (prenda, beva).
 * Falso amigo: la ricetta es la receta del médico (y también la de cocina).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const MEDICO = dialogue('it.stim.a2-u8-medico', 'Una paciente en el consultorio del médico.', [
  ['Medico', 'Buongiorno, signora. Cosa c’è?'],
  ['Paziente', 'Ho mal di gola e la tosse da tre giorni.'],
  ['Medico', 'Ha anche la febbre?'],
  ['Paziente', 'Sì, ieri sera avevo trentotto.'],
  ['Medico', 'È un raffreddore. Prenda questo sciroppo tre volte al giorno e beva molta acqua.'],
]);

const FARMACIA = dialogue('it.stim.a2-u8-farmacia', 'Un cliente en una farmacia.', [
  ['Cliente', 'Buongiorno, ho mal di testa. Cosa mi consiglia?'],
  ['Farmacista', 'Ha la ricetta del medico?'],
  ['Cliente', 'No, non ce l’ho.'],
  ['Farmacista', 'Allora prenda queste pastiglie: una dopo pranzo e una dopo cena.'],
]);

const CONSIGLI = reading(
  'it.stim.a2-u8-consigli',
  'message',
  'Sara le escribe a Giulia, que está enferma.',
  [
    'Povera Giulia! Mi dispiace che stai male.',
    'Riposati, bevi tanto tè caldo e non uscire stasera.',
    'Se domani hai ancora la febbre, vai dal medico!',
    'Un abbraccio, Sara',
  ],
  { from: 'Sara', to: 'Giulia' },
);

const BENESSERE = reading(
  'it.stim.a2-u8-benessere',
  'notice',
  'Un cartel en la entrada de un gimnasio.',
  [
    'Dormi otto ore. Mangia frutta e verdura.',
    'Cammina mezz’ora al giorno.',
    'Non lavorare troppo davanti al computer: fai una pausa ogni ora.',
    'E se ti fa male la schiena, fai un po’ di yoga!',
  ],
  { title: 'Cinque consigli per stare bene' },
);

export const IT_A2_U08: ItUnitDef = {
  names: ['Medico', 'Paziente', 'Cliente', 'Farmacista', 'Sara', 'Giulia'],
  support: [
    'sciroppo',
    'volte',
    'beva',
    'trentotto',
    'questo',
    'consiglia',
    'ce',
    'queste',
    'pastiglie',
    'cena',
    'povera',
    'uscire',
    'abbraccio',
    'consigli',
    'stare',
    'dormi',
    'mangia',
    'frutta',
    'cammina',
    'mezz',
    'computer',
    'pausa',
    'yoga',
    'comprare',
    'aspirina',
    'parlare',
  ],
  unit: {
    position: 8,
    title: 'Salud y bienestar',
    titleEn: 'Salute e benessere',
    description:
      'Decir qué te duele y qué síntomas tienes, entender al médico y al farmacéutico, y dar consejos con el imperativo.',
    emoji: '🩺',
    objective:
      'Puedes decir qué te duele y cómo te sientes, entender las indicaciones del médico y de la farmacia, y dar consejos de salud con el imperativo (riposati, prenda…).',
    grammar: {
      title: 'Mi fa male · ho mal di · imperativo con tu y con Lei',
      explanation:
        'Para el dolor: mi fa male + la parte del cuerpo (mi fa male la schiena) o ho mal di + parte, sin artículo (ho mal di testa, di gola). Imperativo con tu: -are → -a (mangia), -ere / -ire → -i (prendi, bevi, dormi); en negativo, non + infinitivo (non mangiare!). Con Lei (usted) se invierte: -are → -i (mangi), -ere / -ire → -a (prenda, beva). Con un reflexivo, el pronombre va pegado: riposati! Al médico se va con da: vado dal medico.',
      examples: [
        { target: 'Mi fa male la schiena.', base: 'Me duele la espalda.' },
        { target: 'Riposati e non uscire stasera!', base: '¡Descansa y no salgas esta noche!' },
        { target: 'Prenda questo sciroppo, signora.', base: 'Tome este jarabe, señora.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U8). Sin revisión nativa: revisar el registro del consultorio, non ce l’ho y las indicaciones de la farmacia.',
    },
    words: [
      w(
        'it-mi-fa-male',
        'mi fa male',
        'me duele',
        'Mi fa male la schiena.',
        'Me duele la espalda.',
        ['health'],
      ),
      w(
        'it-ho-mal-di-testa',
        'ho mal di testa',
        'me duele la cabeza',
        'Ho mal di testa da ieri.',
        'Me duele la cabeza desde ayer.',
        ['health'],
        {
          acceptedTranslations: ['tengo dolor de cabeza'],
          emoji: '🤕',
        },
      ),
      w('it-gola', 'gola', 'garganta', 'Ho mal di gola.', 'Me duele la garganta.', [
        'health',
        'body',
      ]),
      w(
        'it-pancia',
        'pancia',
        'panza',
        'Mi fa male la pancia.',
        'Me duele la panza.',
        ['health', 'body'],
        {
          acceptedTranslations: ['estómago', 'barriga'],
        },
      ),
      w('it-schiena', 'schiena', 'espalda', 'Mi fa male la schiena.', 'Me duele la espalda.', [
        'health',
        'body',
      ]),
      w('it-febbre', 'febbre', 'fiebre', 'Ho la febbre.', 'Tengo fiebre.', ['health'], {
        emoji: '🤒',
      }),
      w(
        'it-tosse',
        'tosse',
        'tos',
        'Ho la tosse da tre giorni.',
        'Tengo tos desde hace tres días.',
        ['health'],
      ),
      w(
        'it-raffreddore',
        'raffreddore',
        'resfrío',
        'È un raffreddore.',
        'Es un resfrío.',
        ['health'],
        {
          acceptedTranslations: ['resfriado'],
        },
      ),
      w(
        'it-dal-medico',
        'dal medico',
        'al médico',
        'Domani vado dal medico.',
        'Mañana voy al médico.',
        ['health', 'places'],
        {
          acceptedTranslations: ['en el médico'],
        },
      ),
      w(
        'it-farmacia',
        'farmacia',
        'farmacia',
        'La farmacia è aperta.',
        'La farmacia está abierta.',
        ['health', 'places'],
        { emoji: '💊' },
      ),
      w(
        'it-ricetta',
        'ricetta',
        'receta (del médico)',
        'Ha la ricetta del medico?',
        '¿Tiene la receta del médico?',
        ['health'],
        {
          acceptedTranslations: ['receta'],
        },
      ),
      w('it-prenda', 'prenda', 'tome (usted)', 'Prenda questo sciroppo.', 'Tome este jarabe.', [
        'health',
        'imperative',
      ]),
      w(
        'it-prendi',
        'prendi',
        'toma',
        'Prendi un’aspirina.',
        'Tómate una aspirina.',
        ['health', 'imperative'],
        {
          acceptedTranslations: ['toma', 'tomá'],
        },
      ),
      w('it-bevi', 'bevi', 'bebé (de beber)', 'Bevi tanta acqua.', 'Toma mucha agua.', [
        'health',
        'imperative',
      ]),
      w(
        'it-riposati',
        'riposati',
        'descansa',
        'Riposati un po’.',
        'Descansa un poco.',
        ['health', 'imperative'],
        {
          acceptedTranslations: ['descansa', 'descansá'],
        },
      ),
      w(
        'it-non-mangiare',
        'non mangiare',
        'no comas',
        'Non mangiare troppo!',
        '¡No comas demasiado!',
        ['health', 'imperative'],
      ),
      w(
        'it-sto-meglio',
        'sto meglio',
        'estoy mejor',
        'Oggi sto meglio.',
        'Hoy estoy mejor.',
        ['health'],
        {
          acceptedTranslations: ['me siento mejor'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Mi fa male',
        objective: 'Decir qué te duele.',
        intro: {
          explanation:
            'Para decir qué te duele: mi fa male + la parte del cuerpo con artículo (mi fa male la schiena) o ho mal di + la parte sin artículo (ho mal di testa, ho mal di gola).',
          examples: [
            { target: 'Mi fa male la pancia.', base: 'Me duele la panza.' },
            { target: 'Ho mal di testa da ieri.', base: 'Me duele la cabeza desde ayer.' },
          ],
        },
        takeaways: [
          'Dices mi fa male la… y ho mal di…',
          'Nombras la gola, la pancia y la schiena.',
        ],
        exercises: [
          ex.translationChoice(
            'mi fa male',
            'me duele',
            ['me cae mal', 'me pone mal', 'me da miedo'],
            ['it-mi-fa-male'],
            { id: 'it.ex.ux0mzsd1e5rxk9' },
          ),
          ex.matchPairs(
            [
              ['gola', 'garganta'],
              ['pancia', 'panza'],
              ['schiena', 'espalda'],
              ['ho mal di testa', 'me duele la cabeza'],
            ],
            ['it-gola', 'it-pancia', 'it-schiena', 'it-ho-mal-di-testa'],
            { id: 'it.ex.m0qgx3r5kgcsl0' },
          ),
          ex.listenChoice(
            'Mi fa male la schiena.',
            ['Mi fa male la pancia.', 'Ho mal di schiena da ieri.', 'Ti fa male la schiena?'],
            ['it-mi-fa-male', 'it-schiena'],
            { id: 'it.ex.mp9n0qd7rft3hi' },
          ),
          ex.imageChoice(
            '🤕',
            'ho mal di testa',
            ['ho mal di gola', 'mi fa male la pancia', 'ho fame'],
            ['it-ho-mal-di-testa'],
            {
              id: 'it.ex.afor0a5vqib0lb',
            },
          ),
          ex.fillBlank(
            'Ho mal di ___: non posso parlare.',
            'Me duele la garganta: no puedo hablar.',
            'gola',
            ['pancia', 'schiena', 'testa'],
            ['it-gola'],
            {
              id: 'it.ex.7rv1c4bpg9pu0h',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            'Mi ___ male la pancia.',
            'Me duele la panza.',
            'fa',
            ['ha', 'è', 'sta'],
            ['it-mi-fa-male', 'it-pancia'],
            {
              id: 'it.ex.kgj1x1gd71zzex',
            },
          ),
          ex.orderWords(
            'Ho mal di testa da ieri.',
            'Me duele la cabeza desde ayer.',
            ['it-ho-mal-di-testa'],
            { id: 'it.ex.jnug04kgdpmt1z' },
          ),
          ex.shortAnswer(
            'Cosa ti fa male?',
            '¿Qué te duele? (Responde que te duele la espalda.)',
            'Mi fa male la schiena.',
            ['La schiena.', 'Ho mal di schiena.'],
            ['it-mi-fa-male', 'it-schiena'],
            { id: 'it.ex.ksgu3pqae56aex' },
          ),
          ex.translateWrite('Me duele la cabeza.', 'Ho mal di testa.', ['it-ho-mal-di-testa'], {
            id: 'it.ex.g5wahso1tdl4nk',
            acceptedAnswers: ['Mi fa male la testa.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Dal medico',
        objective: 'Contar tus síntomas en el consultorio.',
        intro: {
          explanation:
            'Los síntomas van con avere y artículo: ho la febbre, ho la tosse, ho il raffreddore. Al médico se va con da (y no con a): vado dal medico, come vado da Marco.',
          examples: [
            { target: 'Ho la febbre e la tosse.', base: 'Tengo fiebre y tos.' },
            { target: 'Domani vado dal medico.', base: 'Mañana voy al médico.' },
          ],
        },
        takeaways: ['Cuentas síntomas: ho la febbre, la tosse.', 'Dices vado dal medico.'],
        exercises: [
          ex.translationChoice(
            'raffreddore',
            'resfrío',
            ['refresco', 'frío', 'fiebre'],
            ['it-raffreddore'],
            { id: 'it.ex.vecm2s9ilr5qfe' },
          ),
          ex.translationChoice(
            'dal medico',
            'al médico',
            ['del médico', 'para el médico', 'desde el médico'],
            ['it-dal-medico'],
            {
              id: 'it.ex.6kdohm6runx8nh',
              explanation: 'Para ir a lo de una persona se usa da: vado dal medico, vado da Marco.',
            },
          ),
          ex.listenChoice(
            'Ho la febbre e la tosse.',
            ['Ho la febbre e mal di gola.', 'Ho la tosse da ieri.', 'Hai la febbre e la tosse?'],
            ['it-febbre', 'it-tosse'],
            { id: 'it.ex.e4sfdycww808jz' },
          ),
          ex.fillBlank(
            'Domani vado ___ medico.',
            'Mañana voy al médico.',
            'dal',
            ['al', 'nel', 'sul'],
            ['it-dal-medico'],
            {
              id: 'it.ex.ibk9i6xav3r0yq',
              explanation: 'Da + il = dal: vado dal medico.',
            },
          ),
          ex.fillBlank(
            'Ho trentotto di ___.',
            'Tengo treinta y ocho de fiebre.',
            'febbre',
            ['tosse', 'gola', 'pancia'],
            ['it-febbre'],
            {
              id: 'it.ex.2hp9arkh6sx15e',
              skill: 'vocabulary',
            },
          ),
          question(
            'it.ex.14du44yvojyfxf',
            MEDICO,
            '¿Qué le pasa a la paciente?',
            'Le duele la garganta y tiene tos desde hace tres días',
            ['Le duele la espalda', 'Tiene fiebre desde hace una semana', 'Le duele la panza'],
            ['it-gola', 'it-tosse', 'it-da-due-anni'],
            'La paciente dice: «Ho mal di gola e la tosse da tre giorni».',
          ),
          question(
            'it.ex.dsxjjm9n9gsujb',
            MEDICO,
            '¿Tiene fiebre?',
            'Sí: anoche tenía 38',
            ['No', 'Sí: esta mañana tenía 37', 'No sabe'],
            ['it-febbre', 'it-avevo'],
            'La paciente dice: «ieri sera avevo trentotto».',
          ),
          question(
            'it.ex.1edyqbt2rgevrj',
            MEDICO,
            '¿Qué tiene, según el médico?',
            'Un resfrío',
            ['Una gripe fuerte', 'Nada', 'Dolor de espalda'],
            ['it-raffreddore'],
            'El médico dice: «È un raffreddore».',
          ),
          ex.shortAnswer(
            'Hai la febbre?',
            '¿Tienes fiebre? (Responde que sí, un poco.)',
            "Sì, ho un po' di febbre.",
            [
              'Sì, ho un po’ di febbre.',
              "Ho un po' di febbre.",
              'Ho un po’ di febbre.',
              'Sì, un po’.',
              "Sì, un po'.",
            ],
            ['it-febbre', 'it-un-po'],
            { id: 'it.ex.1zzwbnw8i5off6' },
          ),
          ex.translateWrite(
            'Tengo tos y fiebre.',
            'Ho la tosse e la febbre.',
            ['it-tosse', 'it-febbre'],
            {
              id: 'it.ex.oebjyufqaukmlm',
              acceptedAnswers: ['Ho tosse e febbre.', 'Ho la tosse e ho la febbre.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Prenda, beva',
        objective: 'Entender las indicaciones del médico y de la farmacia.',
        intro: {
          explanation:
            'El médico y el farmacéutico te tratan de Lei y dan indicaciones con el imperativo formal: con los verbos en -ere / -ire termina en -a (prenda, beva) y con los de -are, en -i (mangi). La ricetta es la receta del médico (y también la de cocina).',
          examples: [
            {
              target: 'Prenda questo sciroppo tre volte al giorno.',
              base: 'Tome este jarabe tres veces por día.',
            },
            { target: 'Ha la ricetta del medico?', base: '¿Tiene la receta del médico?' },
          ],
        },
        takeaways: ['Entiendes prenda y beva.', 'Pides algo en la farmacia.'],
        exercises: [
          ex.translationChoice(
            'ricetta',
            'receta (del médico)',
            ['recepción', 'recibo', 'remedio'],
            ['it-ricetta'],
            {
              id: 'it.ex.6afnn83nos01zl',
              explanation: 'La ricetta es la receta del médico; también la receta de cocina.',
            },
          ),
          ex.translationChoice(
            'prenda',
            'tome (usted)',
            ['prenda (de ropa)', 'tomó', 'tomaba'],
            ['it-prenda'],
            { id: 'it.ex.msty6q0z1ofh4s' },
          ),
          ex.listenChoice(
            'Prenda questo sciroppo tre volte al giorno.',
            [
              'Prenda questo sciroppo due volte al giorno.',
              'Prendi questo sciroppo tre volte al giorno.',
              'Prenda queste pastiglie tre volte al giorno.',
            ],
            ['it-prenda'],
            { id: 'it.ex.ueo0brmiz3zqkv' },
          ),
          ex.fillBlank(
            '___ molta acqua, signora.',
            'Tome mucha agua, señora.',
            'Beva',
            ['Bevi', 'Bevo', 'Bevuto'],
            ['it-prenda', 'it-acqua'],
            {
              id: 'it.ex.fo0s16jv3asn66',
              explanation: 'Con Lei, los verbos en -ere terminan en -a: beva.',
            },
          ),
          ex.fillBlank(
            'Vado in ___ a comprare le pastiglie.',
            'Voy a la farmacia a comprar las pastillas.',
            'farmacia',
            ['ricetta', 'febbre', 'gola'],
            ['it-farmacia'],
            { id: 'it.ex.swd2wrzstyntdn', skill: 'vocabulary' },
          ),
          question(
            'it.ex.sbrdf0hase23wb',
            MEDICO,
            '¿Qué le indica el médico a la paciente?',
            'Tomar el jarabe tres veces por día y tomar mucha agua',
            [
              'Quedarse tres días en la cama',
              'Tomar pastillas antes de comer',
              'Volver en tres días',
            ],
            ['it-prenda'],
            'El médico dice: «Prenda questo sciroppo tre volte al giorno e beva molta acqua».',
          ),
          question(
            'it.ex.vagzpxlgljj1tg',
            FARMACIA,
            '¿Qué le pregunta la farmacéutica al cliente?',
            'Si tiene la receta del médico',
            ['Si tiene fiebre', 'Cuánto quiere pagar', 'Desde cuándo le duele'],
            ['it-ricetta'],
            'La farmacéutica pregunta: «Ha la ricetta del medico?».',
          ),
          question(
            'it.ex.kcc8ed5acv706m',
            FARMACIA,
            '¿Cuándo tiene que tomar las pastillas?',
            'Una después del almuerzo y una después de la cena',
            ['Tres por día, antes de comer', 'Sólo a la noche', 'Una a la mañana'],
            ['it-prenda', 'it-farmacia'],
            'La farmacéutica dice: «prenda queste pastiglie: una dopo pranzo e una dopo cena».',
          ),
          ex.shortAnswer(
            'Cosa mi consiglia?',
            '¿Qué me aconseja? (Eres el médico: dile al paciente que tome mucha agua.)',
            'Beva molta acqua.',
            ['Beva molta acqua!', 'Beva tanta acqua.'],
            ['it-prenda'],
            { id: 'it.ex.gz4gb73y9pz3fl' },
          ),
          ex.translateWrite(
            'Tome estas pastillas, señora.',
            'Prenda queste pastiglie, signora.',
            ['it-prenda'],
            { id: 'it.ex.mwaa2880b599pr' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Riposati! Non mangiare!',
        objective: 'Dar consejos a un amigo con el imperativo.',
        intro: {
          explanation:
            'Con tu: -are → -a (mangia), -ere / -ire → -i (prendi, bevi, dormi). En negativo: non + infinitivo (non mangiare!, non uscire!). Con un reflexivo, el pronombre va pegado al final: riposati! (descansa).',
          examples: [
            { target: 'Riposati e bevi tanto tè.', base: 'Descansa y toma mucho té.' },
            { target: 'Non mangiare troppo!', base: '¡No comas demasiado!' },
          ],
        },
        takeaways: ['Aconsejas con prendi, bevi, riposati.', 'Prohíbes con non + infinitivo.'],
        exercises: [
          ex.translationChoice(
            'riposati',
            'descansa',
            ['repite', 'respira', 'reíte'],
            ['it-riposati'],
            { id: 'it.ex.4q15surn8hgg7r' },
          ),
          ex.matchPairs(
            [
              ['prendi', 'toma'],
              ['bevi', 'bebé (de beber)'],
              ['riposati', 'descansa'],
              ['non mangiare', 'no comas'],
            ],
            ['it-prendi', 'it-bevi', 'it-riposati', 'it-non-mangiare'],
            { id: 'it.ex.diyvv24crdj32t' },
          ),
          ex.listenChoice(
            'Riposati e bevi tanto tè.',
            ['Riposati e bevi tanta acqua.', 'Riposati e prendi tanto tè.', 'Non bere tanto tè.'],
            ['it-riposati', 'it-bevi'],
            { id: 'it.ex.zjics5i9b27wvk' },
          ),
          ex.fillBlank(
            'Non ___ troppo!',
            '¡No comas demasiado!',
            'mangiare',
            ['mangia', 'mangi', 'mangiato'],
            ['it-non-mangiare'],
            {
              id: 'it.ex.3u6j2306b2v2nk',
              explanation: 'El imperativo negativo con tu es non + infinitivo: non mangiare.',
            },
          ),
          ex.fillBlank(
            '___ un’aspirina e vai a letto.',
            'Tómate una aspirina y ve a la cama.',
            'Prendi',
            ['Prendo', 'Preso', 'Prendere'],
            ['it-prendi'],
            {
              id: 'it.ex.o4kjj727b0x8d8',
            },
          ),
          question(
            'it.ex.woxlgm19e9ggdk',
            CONSIGLI,
            '¿Qué le aconseja Sara a Giulia?',
            'Descansar, tomar té caliente y no salir esta noche',
            ['Ir al médico enseguida', 'Salir a tomar aire', 'Comer mucho'],
            ['it-riposati', 'it-bevi'],
            'Sara escribe: «Riposati, bevi tanto tè caldo e non uscire stasera».',
          ),
          question(
            'it.ex.0sja8vlgb7nibs',
            CONSIGLI,
            '¿Qué tiene que hacer Giulia si mañana sigue con fiebre?',
            'Ir al médico',
            ['Ir a la farmacia', 'Llamar a Sara', 'Quedarse en la cama'],
            ['it-dal-medico', 'it-febbre'],
            'Sara escribe: «Se domani hai ancora la febbre, vai dal medico!».',
          ),
          ex.shortAnswer(
            'Ho mal di testa…',
            'Me duele la cabeza… (Aconsejale a tu amigo que descanse.)',
            'Riposati!',
            ['Riposati un po’.', "Riposati un po'.", 'Allora riposati!', 'Riposati.'],
            ['it-riposati'],
            { id: 'it.ex.ocmp7gdymu9nme' },
          ),
          ex.translateWrite(
            'No comas el helado.',
            'Non mangiare il gelato.',
            ['it-non-mangiare', 'it-gelato'],
            { id: 'it.ex.mxn60173iadee1' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Sto meglio',
        objective: 'Decir que estás mejor y entender consejos para estar bien.',
        intro: {
          explanation:
            'Cuando te recuperas: sto meglio (estoy mejor). Los carteles y las revistas dan consejos con el imperativo con tu: dormi, mangia, cammina, fai una pausa.',
          examples: [
            { target: 'Oggi sto meglio, grazie.', base: 'Hoy estoy mejor, gracias.' },
            { target: 'Bevi molta acqua e riposati.', base: 'Toma mucha agua y descansa.' },
          ],
        },
        takeaways: ['Dices sto meglio.', 'Entiendes consejos de salud con el imperativo.'],
        exercises: [
          ex.translationChoice(
            'sto meglio',
            'estoy mejor',
            ['estoy peor', 'estoy mal', 'estoy cansado'],
            ['it-sto-meglio'],
            { id: 'it.ex.6z39cg863v7mpp' },
          ),
          ex.listenChoice(
            'Oggi sto meglio, grazie.',
            ['Oggi sto male, grazie.', 'Ieri stavo meglio.', 'Oggi sto bene, grazie.'],
            ['it-sto-meglio'],
            { id: 'it.ex.c997mrf5gys6ex' },
          ),
          ex.fillBlank(
            'Ieri avevo la febbre, ma oggi sto ___.',
            'Ayer tenía fiebre, pero hoy estoy mejor.',
            'meglio',
            ['male', 'malato', 'stanco'],
            ['it-sto-meglio', 'it-febbre'],
            { id: 'it.ex.ebjme9x868q2bb', skill: 'vocabulary' },
          ),
          question(
            'it.ex.cd75ann08rtgk4',
            BENESSERE,
            '¿Cuántas horas recomienda dormir el cartel?',
            'Ocho',
            ['Seis', 'Diez', 'Media hora'],
            ['it-riposati'],
            'El cartel dice: «Dormi otto ore».',
          ),
          question(
            'it.ex.tdttvpmxopbuf2',
            BENESSERE,
            '¿Qué consejo da para quien trabaja con la computadora?',
            'Hacer una pausa cada hora',
            ['Trabajar sólo a la mañana', 'Caminar media hora', 'Dormir la siesta'],
            ['it-non-mangiare'],
            'El cartel dice: «Non lavorare troppo davanti al computer: fai una pausa ogni ora».',
          ),
          question(
            'it.ex.f56kii4w84vz6i',
            BENESSERE,
            '¿Qué aconseja si te duele la espalda?',
            'Hacer un poco de yoga',
            ['Ir al médico', 'Tomar una pastilla', 'No caminar'],
            ['it-mi-fa-male', 'it-schiena'],
            'El cartel dice: «se ti fa male la schiena, fai un po’ di yoga!».',
          ),
          ex.orderWords(
            'Bevi molta acqua e riposati.',
            'Toma mucha agua y descansa.',
            ['it-bevi', 'it-riposati'],
            { id: 'it.ex.psijxw5urpkk09' },
          ),
          ex.shortAnswer(
            'Come stai oggi?',
            '¿Cómo estás hoy? (Responde que estás mejor, gracias.)',
            'Sto meglio, grazie.',
            ['Oggi sto meglio, grazie.', 'Sto meglio.', 'Oggi sto meglio.'],
            ['it-sto-meglio'],
            { id: 'it.ex.rbqgp9vnifp7xn' },
          ),
          ex.translateWrite('Hoy estoy mejor.', 'Oggi sto meglio.', ['it-sto-meglio', 'it-oggi'], {
            id: 'it.ex.2ml7jno1nceopm',
          }),
        ],
      },
    ],
  },
};
