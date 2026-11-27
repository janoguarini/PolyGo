import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Italiano A2 U12 «Opiniones, problemas y soluciones» (docs/IT_A1_A2.md), cierre del A2: dar una
 * opinión (secondo me, penso di sì, sono d'accordo), el condizionale para deseos y consejos (mi
 * piacerebbe, preferirei, dovresti, sarebbe meglio), conectores (invece, comunque, purtroppo) y un
 * problema en una tienda (non funziona, si è rotto, lo scontrino, il rimborso).
 * Nota: sensibile es como en español («sensible»); «sensato» es otra cosa.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const OPINIONI = reading(
  'it.stim.a2-u12-cappuccino',
  'post',
  'Un foro de viajeros discute una costumbre italiana.',
  [
    'Marco: Secondo me è una regola vecchia. Se mi piace, lo prendo anche alle tre!',
    'Giovanna: Non sono d’accordo. In Italia il cappuccino si beve la mattina, invece dopo pranzo si prende un espresso.',
    'Luca: Comunque al bar nessuno dice niente… ma qualche cameriere sorride!',
  ],
  { title: 'Cappuccino dopo pranzo: sì o no?' },
);

const DESIDERI = reading(
  'it.stim.a2-u12-desideri',
  'post',
  'Valentina escribe sobre un sueño en su blog.',
  [
    'Mi piacerebbe vivere un anno in Italia.',
    'Preferirei una città piccola, come Lucca, invece di Roma o Milano.',
    'Purtroppo adesso non posso, ma tra due anni… chissà!',
  ],
  { from: 'Valentina', title: 'Il mio sogno' },
);

const CONSIGLIO = dialogue(
  'it.stim.a2-u12-consiglio',
  'Sara le cuenta un problema del trabajo a su amigo Paolo.',
  [
    ['Sara', 'Sono un po’ triste: il mio capo non mi ascolta mai.'],
    ['Paolo', 'Secondo me dovresti parlargli. Sarebbe meglio dire tutto con calma.'],
    ['Sara', 'Hai ragione. Purtroppo è molto sensibile alle critiche…'],
    ['Paolo', 'Comunque prova! Magari va bene.'],
  ],
);

const RECLAMO = dialogue(
  'it.stim.a2-u12-reclamo',
  'Una clienta vuelve a una tienda de electrónica.',
  [
    ['Cliente', 'Buongiorno. Ho comprato queste cuffie ieri, ma non funzionano.'],
    ['Commesso', 'Mi dispiace. Ha lo scontrino?'],
    ['Cliente', 'Sì, eccolo.'],
    ['Commesso', 'Preferisce cambiarle o vuole il rimborso?'],
    ['Cliente', 'Preferirei il rimborso, grazie.'],
  ],
);

export const IT_A2_U12: ItUnitDef = {
  names: [
    'Marco',
    'Giovanna',
    'Luca',
    'Valentina',
    'Lucca',
    'Milano',
    'Sara',
    'Paolo',
    'Cliente',
    'Commesso',
  ],
  support: [
    'regola',
    'vecchia',
    'beve',
    'espresso',
    'sorride',
    'vivere',
    'chissà',
    'sogno',
    'ascolta',
    'parlargli',
    'dire',
    'ragione',
    'critiche',
    'prova',
    'comprato',
    'cuffie',
    'funzionano',
    'eccolo',
    'preferisce',
    'cambiarle',
    'idea',
    'imparare',
    'riposare',
    'dormire',
    'lavatrice',
    'fare',
    'dovrei',
    'triste',
    'preferisco',
    'viene',
    'partire',
  ],
  unit: {
    position: 12,
    title: 'Opiniones, problemas y soluciones',
    titleEn: 'Opinioni e problemi',
    description:
      'Dar tu opinión y estar o no de acuerdo, expresar deseos y dar consejos con el condicional, y resolver un problema en una tienda.',
    emoji: '💡',
    objective:
      'Puedes dar tu opinión (secondo me…), decir si estás de acuerdo, expresar deseos y consejos (mi piacerebbe, dovresti) y resolver un problema con algo que compraste (non funziona, vorrei il rimborso).',
    grammar: {
      title: 'Opiniones · condizionale presente · conectores',
      explanation:
        'Para opinar: secondo me (para mí), penso di sì / di no (creo que sí / que no), sono d’accordo / non sono d’accordo. El condizionale suaviza: deseos (mi piacerebbe, preferirei, vorrei), consejos (dovresti riposare) y propuestas (sarebbe meglio…). Se forma con -erei / -irei (preferirei); irregulares frecuentes: vorrei, potrei, dovrei / dovresti, sarei / sarebbe. Conectores: invece (en cambio), comunque (de todos modos), purtroppo (lamentablemente). Ojo: con una cosa rota el participio concuerda: si è rotto il telefono, si è rotta la lavatrice.',
      examples: [
        { target: 'Secondo me è una bella idea.', base: 'Para mí es una buena idea.' },
        { target: 'Dovresti parlare con il capo.', base: 'Deberías hablar con el jefe.' },
        {
          target: 'Il cellulare non funziona: vorrei il rimborso.',
          base: 'El celular no anda: quisiera el reembolso.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U12). Sin revisión nativa: revisar el foro sobre el cappuccino, parlargli y el registro del reclamo.',
    },
    words: [
      w(
        'it-secondo-me',
        'secondo me',
        'para mí',
        'Secondo me è una bella idea.',
        'Para mí es una buena idea.',
        ['opinions'],
        {
          acceptedTranslations: ['en mi opinión', 'a mi parecer'],
        },
      ),
      w(
        'it-penso-di-si',
        'penso di sì',
        'creo que sí',
        'Viene anche Marco? — Penso di sì.',
        '¿Viene también Marco? — Creo que sí.',
        ['opinions'],
        {
          acceptedTranslations: ['pienso que sí'],
        },
      ),
      w(
        'it-sono-d-accordo',
        "sono d'accordo",
        'estoy de acuerdo',
        "Sono d'accordo con te.",
        'Estoy de acuerdo contigo.',
        ['opinions'],
        {
          acceptedTexts: ['sono d’accordo'],
        },
      ),
      w(
        'it-invece',
        'invece',
        'en cambio',
        'Io prendo un caffè, invece lei prende un tè.',
        'Yo tomo un café; ella, en cambio, un té.',
        ['connectors'],
      ),
      w(
        'it-mi-piacerebbe',
        'mi piacerebbe',
        'me gustaría',
        'Mi piacerebbe vivere in Italia.',
        'Me gustaría vivir en Italia.',
        ['opinions', 'conditional'],
      ),
      w(
        'it-preferirei',
        'preferirei',
        'preferiría',
        'Preferirei una città piccola.',
        'Preferiría una ciudad chica.',
        ['opinions', 'conditional'],
      ),
      w(
        'it-sarebbe',
        'sarebbe',
        'sería',
        'Sarebbe meglio partire presto.',
        'Sería mejor salir temprano.',
        ['conditional'],
      ),
      w(
        'it-purtroppo',
        'purtroppo',
        'lamentablemente',
        'Purtroppo non posso.',
        'Lamentablemente no puedo.',
        ['connectors'],
        {
          acceptedTranslations: ['por desgracia'],
        },
      ),
      w('it-dovresti', 'dovresti', 'deberías', 'Dovresti riposare.', 'Deberías descansar.', [
        'conditional',
      ]),
      w(
        'it-sensibile',
        'sensibile',
        'sensible',
        'Mia sorella è molto sensibile.',
        'Mi hermana es muy sensible.',
        ['descriptions'],
      ),
      w(
        'it-comunque',
        'comunque',
        'de todos modos',
        'Comunque prova!',
        '¡De todos modos, prueba!',
        ['connectors'],
        {
          acceptedTranslations: ['igual', 'de todas formas'],
        },
      ),
      w(
        'it-non-funziona',
        'non funziona',
        'no funciona',
        'Il cellulare non funziona.',
        'El celular no anda.',
        ['problems'],
        {
          acceptedTranslations: ['no anda'],
        },
      ),
      w(
        'it-si-e-rotto',
        'si è rotto',
        'se rompió',
        'Il portatile si è rotto.',
        'Se rompió la notebook.',
        ['problems', 'past'],
        {
          acceptedTexts: ['si è rotta'],
        },
      ),
      w('it-problema', 'problema', 'problema', 'Qual è il problema?', '¿Cuál es el problema?', [
        'problems',
      ]),
      w(
        'it-cambiare',
        'cambiare',
        'cambiar',
        'Vorrei cambiare la giacca.',
        'Quisiera cambiar la chaqueta.',
        ['problems', 'shopping'],
      ),
      w(
        'it-scontrino',
        'scontrino',
        'ticket (de compra)',
        'Ha lo scontrino?',
        '¿Tiene el ticket?',
        ['problems', 'shopping'],
        {
          acceptedTranslations: ['ticket', 'comprobante'],
          emoji: '🧾',
        },
      ),
      w(
        'it-rimborso',
        'rimborso',
        'reembolso',
        'Vorrei il rimborso.',
        'Quisiera el reembolso.',
        ['problems', 'shopping'],
        {
          acceptedTranslations: ['devolución del dinero'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Secondo me',
        objective: 'Dar tu opinión y decir si estás de acuerdo.',
        intro: {
          explanation:
            'Para opinar: secondo me (para mí), penso di sì / penso di no (creo que sí / que no). Para responder: sono d’accordo o non sono d’accordo. Invece es «en cambio».',
          examples: [
            { target: "Non sono d'accordo con te.", base: 'No estoy de acuerdo contigo.' },
            { target: 'Secondo me è una bella idea.', base: 'Para mí es una buena idea.' },
          ],
        },
        takeaways: [
          'Opinas con secondo me y penso di sì.',
          "Dices sono d'accordo / non sono d'accordo.",
        ],
        exercises: [
          ex.translationChoice(
            'secondo me',
            'para mí',
            ['después de mí', 'conmigo', 'a mi lado'],
            ['it-secondo-me'],
            {
              id: 'it.ex.04rctjp4lx0fcz',
              explanation: 'Secondo me es «para mí, en mi opinión».',
            },
          ),
          ex.translationChoice(
            'penso di sì',
            'creo que sí',
            ['creo que no', 'pienso en mí', 'no sé'],
            ['it-penso-di-si'],
            { id: 'it.ex.s39gbwz4u08vfg' },
          ),
          ex.listenChoice(
            "Non sono d'accordo con te.",
            ["Sono d'accordo con te.", "Non sono d'accordo con lei.", 'Secondo me hai ragione.'],
            ['it-sono-d-accordo'],
            { id: 'it.ex.jslkrvszjx8ru0' },
          ),
          ex.fillBlank(
            'Secondo ___, è una bella idea.',
            'Para mí, es una buena idea.',
            'me',
            ['mi', 'io', 'te'],
            ['it-secondo-me'],
            {
              id: 'it.ex.351e3pja0am7x6',
            },
          ),
          question(
            'it.ex.uip1spi94yeyyo',
            OPINIONI,
            '¿Qué opina Marco del capuchino después del almuerzo?',
            'Que es una regla vieja: si le gusta, lo toma a cualquier hora',
            [
              'Que es de mala educación',
              'Que sólo se toma a la mañana',
              'Que en el bar no lo sirven',
            ],
            ['it-secondo-me', 'it-comunque'],
            'Marco escribe: «Secondo me è una regola vecchia. Se mi piace, lo prendo anche alle tre!».',
          ),
          question(
            'it.ex.x2yggjzxttlz23',
            OPINIONI,
            '¿Y Giovanna?',
            'No está de acuerdo: el capuchino es de la mañana y después del almuerzo, un café',
            ['Está de acuerdo con Marco', 'Dice que da igual', 'Dice que nunca toma café'],
            ['it-sono-d-accordo', 'it-invece'],
            'Giovanna escribe: «Non sono d’accordo… il cappuccino si beve la mattina, invece dopo pranzo si prende un espresso».',
          ),
          ex.fillBlank(
            'Io prendo un caffè, ___ lei prende un tè.',
            'Yo tomo un café; ella, en cambio, un té.',
            'invece',
            ['quindi', 'perché', 'anche'],
            ['it-invece'],
            { id: 'it.ex.25svc3ikfoxyd2' },
          ),
          ex.shortAnswer(
            "Sei d'accordo?",
            '¿Estás de acuerdo? (Responde que sí, que estás de acuerdo.)',
            "Sì, sono d'accordo.",
            ['Sì, sono d’accordo.', "Sono d'accordo.", 'Sono d’accordo.'],
            ['it-sono-d-accordo'],
            { id: 'it.ex.kd2iuzbvsdnx0u' },
          ),
          ex.translateWrite(
            'Para mí, Roma es la ciudad más linda.',
            'Secondo me, Roma è la città più bella.',
            ['it-secondo-me', 'it-il-piu'],
            {
              id: 'it.ex.b2wmk4z02xssdc',
              acceptedAnswers: ['Secondo me Roma è la città più bella.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Mi piacerebbe, preferirei',
        objective: 'Expresar deseos con el condizionale.',
        intro: {
          explanation:
            'El condizionale expresa deseos de forma suave: mi piacerebbe (me gustaría), preferirei (preferiría), vorrei (quisiera), sarebbe (sería). Purtroppo (lamentablemente) es lo contrario de per fortuna.',
          examples: [
            { target: 'Mi piacerebbe vivere in Italia.', base: 'Me gustaría vivir en Italia.' },
            { target: 'Purtroppo adesso non posso.', base: 'Lamentablemente ahora no puedo.' },
          ],
        },
        takeaways: ['Expresas deseos con mi piacerebbe y preferirei.', 'Usas purtroppo.'],
        exercises: [
          ex.translationChoice(
            'mi piacerebbe',
            'me gustaría',
            ['me gustaba', 'me gusta', 'me gustó'],
            ['it-mi-piacerebbe'],
            { id: 'it.ex.feltwh6pwyvx8c' },
          ),
          ex.translationChoice(
            'purtroppo',
            'lamentablemente',
            ['por lo tanto', 'por suerte', 'por todos lados'],
            ['it-purtroppo'],
            {
              id: 'it.ex.kzqhg8md2m33wc',
              explanation: 'Purtroppo es «lamentablemente», lo contrario de per fortuna.',
            },
          ),
          ex.matchPairs(
            [
              ['mi piacerebbe', 'me gustaría'],
              ['preferirei', 'preferiría'],
              ['sarebbe', 'sería'],
              ['vorrei', 'quisiera'],
            ],
            ['it-mi-piacerebbe', 'it-preferirei', 'it-sarebbe', 'it-vorrei'],
            { id: 'it.ex.xs14pr1x5o8454' },
          ),
          ex.listenChoice(
            'Mi piacerebbe vivere in Italia.',
            [
              'Mi piace vivere in Italia.',
              'Mi piacerebbe viaggiare in Italia.',
              'Ti piacerebbe vivere in Italia?',
            ],
            ['it-mi-piacerebbe'],
            { id: 'it.ex.tyilwftea09st6' },
          ),
          ex.fillBlank(
            '___ una città piccola.',
            'Preferiría una ciudad chica.',
            'Preferirei',
            ['Preferisci', 'Sarebbe', 'Mi piace'],
            ['it-preferirei'],
            {
              id: 'it.ex.j9jnuuesyg0wz7',
            },
          ),
          question(
            'it.ex.kbb305vntegqqt',
            DESIDERI,
            '¿Qué le gustaría a Valentina?',
            'Vivir un año en Italia',
            ['Estudiar en Roma', 'Trabajar en Milán', 'Visitar Italia un mes'],
            ['it-mi-piacerebbe'],
            'Valentina escribe: «Mi piacerebbe vivere un anno in Italia».',
          ),
          question(
            'it.ex.eaxb15ona4syf9',
            DESIDERI,
            '¿Qué tipo de ciudad preferiría?',
            'Una ciudad chica, como Lucca',
            ['Una ciudad grande, como Roma', 'Milán', 'Un pueblo en el campo'],
            ['it-preferirei', 'it-invece'],
            'Valentina escribe: «Preferirei una città piccola, come Lucca, invece di Roma o Milano».',
          ),
          question(
            'it.ex.rct63e6sj9i3ko',
            DESIDERI,
            '¿Por qué no lo hace ahora?',
            'Lamentablemente ahora no puede',
            ['Porque no le gusta Italia', 'Porque ya vivió allá', 'Porque se va mañana'],
            ['it-purtroppo'],
            'Valentina escribe: «Purtroppo adesso non posso, ma tra due anni… chissà!».',
          ),
          ex.shortAnswer(
            'Cosa ti piacerebbe fare?',
            '¿Qué te gustaría hacer? (Responde que te gustaría viajar a Italia.)',
            'Mi piacerebbe viaggiare in Italia.',
            ['Mi piacerebbe andare in Italia.', 'Viaggiare in Italia.'],
            ['it-mi-piacerebbe', 'it-viaggiare'],
            { id: 'it.ex.zkd1sralq0h5w7' },
          ),
          ex.translateWrite(
            'Me gustaría aprender italiano.',
            "Mi piacerebbe imparare l'italiano.",
            ['it-mi-piacerebbe'],
            {
              id: 'it.ex.z6tqhbdgj0qtrt',
              acceptedAnswers: [
                'Mi piacerebbe imparare l’italiano.',
                'Mi piacerebbe studiare italiano.',
                "Mi piacerebbe studiare l'italiano.",
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Dovresti…',
        objective: 'Dar consejos con dovresti y sarebbe meglio.',
        intro: {
          explanation:
            'Para aconsejar con suavidad: dovresti + infinitivo (deberías) o sarebbe meglio + infinitivo (sería mejor). Comunque es «de todos modos, igual». Sensibile es como en español: una persona sensibile se ofende o se emociona fácil.',
          examples: [
            {
              target: 'Secondo me dovresti parlare con il capo.',
              base: 'Para mí deberías hablar con el jefe.',
            },
            { target: 'Comunque prova!', base: '¡Igual prueba!' },
          ],
        },
        takeaways: ['Aconsejas con dovresti y sarebbe meglio.', 'Usas comunque.'],
        exercises: [
          ex.translationChoice(
            'dovresti',
            'deberías',
            ['debiste', 'debes', 'debía'],
            ['it-dovresti'],
            { id: 'it.ex.7s8tnshgtj7fhr' },
          ),
          ex.translationChoice(
            'comunque',
            'de todos modos',
            ['como siempre', 'comúnmente', 'con todos'],
            ['it-comunque'],
            { id: 'it.ex.vvul2drbm7orjb' },
          ),
          ex.fillBlank(
            'Sei stanco: ___ riposare.',
            'Estás cansado: deberías descansar.',
            'dovresti',
            ['devo', 'dobbiamo', 'sarebbe'],
            ['it-dovresti', 'it-stanco'],
            {
              id: 'it.ex.swzivm476a1nxv',
            },
          ),
          ex.listenChoice(
            'Secondo me dovresti parlare con il capo.',
            [
              'Secondo me devi parlare con il capo.',
              'Secondo me dovresti parlare con tua madre.',
              'Secondo te dovrei parlare con il capo?',
            ],
            ['it-dovresti', 'it-secondo-me'],
            { id: 'it.ex.19u11qj2fxxemd' },
          ),
          ex.translationChoice(
            'sensibile',
            'sensible',
            ['sensato', 'sencillo', 'sereno'],
            ['it-sensibile'],
            {
              id: 'it.ex.8rcrud6vbm2jdo',
              explanation:
                'Sensibile es «sensible», como en español; «sensato» en italiano es sensato o assennato.',
            },
          ),
          question(
            'it.ex.hvnounbvvz24ef',
            CONSIGLIO,
            '¿Qué le pasa a Sara?',
            'Está un poco triste porque su jefe nunca la escucha',
            ['Está enferma', 'Perdió el trabajo', 'Se peleó con Paolo'],
            ['it-capo'],
            'Sara dice: «Sono un po’ triste: il mio capo non mi ascolta mai».',
          ),
          question(
            'it.ex.qwk2aq0rhx9633',
            CONSIGLIO,
            '¿Qué le aconseja Paolo?',
            'Hablar con el jefe y decirle todo con calma',
            ['Cambiar de trabajo', 'No decir nada', 'Escribirle un mail enojada'],
            ['it-dovresti', 'it-sarebbe'],
            'Paolo dice: «dovresti parlargli. Sarebbe meglio dire tutto con calma».',
          ),
          question(
            'it.ex.h1tj2ea6ozs89r',
            CONSIGLIO,
            '¿Por qué a Sara le parece difícil?',
            'Porque el jefe es muy sensible a las críticas',
            ['Porque el jefe nunca está', 'Porque ella es tímida', 'Porque Paolo no la ayuda'],
            ['it-sensibile', 'it-purtroppo', 'it-comunque'],
            'Sara dice: «Purtroppo è molto sensibile alle critiche…», y Paolo: «Comunque prova!».',
          ),
          ex.shortAnswer(
            'Ho mal di testa da tre giorni.',
            'Me duele la cabeza hace tres días. (Aconsejale que vaya al médico.)',
            'Dovresti andare dal medico.',
            ['Secondo me dovresti andare dal medico.', 'Dovresti andare dal medico!'],
            ['it-dovresti', 'it-dal-medico'],
            { id: 'it.ex.d8nsnl9bf0s6ae' },
          ),
          ex.translateWrite('Deberías dormir más.', 'Dovresti dormire di più.', ['it-dovresti'], {
            id: 'it.ex.jy5cjf6hov41fm',
            acceptedAnswers: ['Dovresti dormire più.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Non funziona!',
        objective: 'Explicar un problema con algo que compraste.',
        intro: {
          explanation:
            'Para un problema: non funziona (no anda), si è rotto / si è rotta (se rompió; el participio concuerda con la cosa). Para pedir una solución: vorrei cambiare… (quisiera cambiar…).',
          examples: [
            { target: 'Il mio cellulare si è rotto.', base: 'Se me rompió el celular.' },
            { target: 'Vorrei cambiare la giacca.', base: 'Quisiera cambiar la chaqueta.' },
          ],
        },
        takeaways: ['Dices non funziona y si è rotto / rotta.', 'Pides cambiar algo.'],
        exercises: [
          ex.translationChoice(
            'non funziona',
            'no funciona',
            ['no termina', 'no fuma', 'no se encuentra'],
            ['it-non-funziona'],
            { id: 'it.ex.9feo6xae4bfmtm' },
          ),
          ex.translationChoice(
            'si è rotto',
            'se rompió',
            ['se rió', 'se robó', 'se cansó'],
            ['it-si-e-rotto'],
            { id: 'it.ex.2l9oaaz8xje9my' },
          ),
          ex.listenChoice(
            'Il mio cellulare si è rotto.',
            [
              'Il mio portatile si è rotto.',
              'Il mio cellulare non funziona.',
              'Il tuo cellulare si è rotto?',
            ],
            ['it-si-e-rotto', 'it-cellulare'],
            { id: 'it.ex.hvyqr04nth3i9z' },
          ),
          ex.fillBlank(
            'Il portatile non ___.',
            'La notebook no funciona.',
            'funziona',
            ['funzionano', 'problema', 'rotto'],
            ['it-non-funziona', 'it-portatile'],
            {
              id: 'it.ex.4af5342xpgzxul',
            },
          ),
          ex.fillBlank(
            'La lavatrice si è ___.',
            'Se rompió el lavarropas.',
            'rotta',
            ['rotto', 'rotti', 'rotte'],
            ['it-si-e-rotto'],
            {
              id: 'it.ex.5vo7xx5uy5gz8r',
              explanation: 'Lavatrice es femenino: si è rotta.',
            },
          ),
          question(
            'it.ex.wa4spgk3ttbc7x',
            RECLAMO,
            '¿Qué problema tiene la clienta?',
            'Los auriculares que compró ayer no funcionan',
            ['Le cobraron de más', 'Los auriculares son muy caros', 'Se los robaron'],
            ['it-non-funziona', 'it-problema', 'it-rimborso'],
            'La clienta dice: «Ho comprato queste cuffie ieri, ma non funzionano».',
          ),
          question(
            'it.ex.6p6nym8poqw3uu',
            RECLAMO,
            '¿Qué le pide primero el vendedor?',
            'El ticket de compra',
            ['El documento', 'Que vuelva mañana', 'La tarjeta'],
            ['it-scontrino'],
            'El vendedor pregunta: «Ha lo scontrino?».',
          ),
          ex.shortAnswer(
            'Qual è il problema?',
            '¿Cuál es el problema? (Responde que el celular no funciona.)',
            'Il cellulare non funziona.',
            ['Il mio cellulare non funziona.', 'Non funziona il cellulare.'],
            ['it-non-funziona', 'it-problema'],
            { id: 'it.ex.xuwkchv1y7nrfi' },
          ),
          ex.translateWrite(
            'Quisiera cambiar la chaqueta.',
            'Vorrei cambiare la giacca.',
            ['it-cambiare', 'it-giacca'],
            { id: 'it.ex.o26f0avrq3a11y' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Lo scontrino e il rimborso',
        objective: 'Resolver un reclamo y opinar sobre costumbres.',
        intro: {
          explanation:
            'Lo scontrino es el ticket de compra (no un «descuento», que es lo sconto). Con el ticket puedes pedir il rimborso (que te devuelvan el dinero) o cambiare il prodotto. Para elegir con cortesía: preferirei…',
          examples: [
            { target: 'Ha lo scontrino?', base: '¿Tiene el ticket?' },
            {
              target: 'Preferirei il rimborso, grazie.',
              base: 'Preferiría el reembolso, gracias.',
            },
          ],
        },
        takeaways: ['Pides il rimborso o cambiar algo.', 'Distingues lo scontrino de lo sconto.'],
        exercises: [
          ex.translationChoice(
            'scontrino',
            'ticket (de compra)',
            ['descuento', 'encuentro', 'escritorio'],
            ['it-scontrino'],
            {
              id: 'it.ex.y77df0lzea1vxj',
              explanation: 'Lo scontrino es el ticket; el descuento es lo sconto.',
            },
          ),
          ex.translationChoice(
            'rimborso',
            'reembolso',
            ['rebote', 'recargo', 'repuesto'],
            ['it-rimborso'],
            { id: 'it.ex.iuth8ohsempyyb' },
          ),
          ex.listenChoice(
            'Preferirei il rimborso, grazie.',
            [
              'Preferisco il rimborso, grazie.',
              'Vorrei cambiare, grazie.',
              'Preferirei un caffè, grazie.',
            ],
            ['it-preferirei', 'it-rimborso'],
            { id: 'it.ex.y06k6i06ykomm8' },
          ),
          ex.fillBlank(
            'Ha lo ___? Senza non posso cambiare la giacca.',
            '¿Tiene el ticket? Sin él no puedo cambiarle la chaqueta.',
            'scontrino',
            ['sconto', 'rimborso', 'conto'],
            ['it-scontrino', 'it-cambiare'],
            { id: 'it.ex.nrxhrqwues12dy', skill: 'vocabulary' },
          ),
          question(
            'it.ex.1gius4if0si773',
            RECLAMO,
            '¿Qué le ofrece el vendedor?',
            'Cambiar los auriculares o devolverle el dinero',
            ['Arreglarlos', 'Un descuento', 'Nada, porque no tiene ticket'],
            ['it-cambiare', 'it-rimborso'],
            'El vendedor pregunta: «Preferisce cambiarle o vuole il rimborso?».',
          ),
          question(
            'it.ex.14zyty00m4zo4b',
            RECLAMO,
            '¿Qué elige la clienta?',
            'El reembolso',
            ['Cambiarlos', 'Otros auriculares más caros', 'Volver otro día'],
            ['it-preferirei', 'it-rimborso'],
            'La clienta dice: «Preferirei il rimborso, grazie».',
          ),
          question(
            'it.ex.42yqpkscskkqdh',
            OPINIONI,
            '¿Qué dice Luca de lo que pasa en los bares?',
            'Que nadie dice nada, pero algunos meseros sonríen',
            [
              'Que no te sirven el capuchino a la tarde',
              'Que los meseros se enojan',
              'Que es más caro a la tarde',
            ],
            ['it-comunque'],
            'Luca escribe: «Comunque al bar nessuno dice niente… ma qualche cameriere sorride!».',
          ),
          ex.orderWords(
            'Purtroppo il cellulare si è rotto.',
            'Lamentablemente se rompió el celular.',
            ['it-purtroppo', 'it-si-e-rotto'],
            { id: 'it.ex.ndkfsmixqf2aih' },
          ),
          ex.shortAnswer(
            'Preferisce cambiarle o vuole il rimborso?',
            '¿Prefiere cambiarlos o quiere el reembolso? (Responde que preferirías el reembolso.)',
            'Preferirei il rimborso.',
            ['Preferirei il rimborso, grazie.', 'Il rimborso, per favore.'],
            ['it-preferirei', 'it-rimborso'],
            { id: 'it.ex.m2yx0n24ynxf43' },
          ),
          ex.translateWrite(
            'Lamentablemente no tengo el ticket.',
            'Purtroppo non ho lo scontrino.',
            ['it-purtroppo', 'it-scontrino'],
            { id: 'it.ex.ye8d1xl3gojv7q' },
          ),
        ],
      },
    ],
  },
};
