import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Italiano A2 U5 «¿Qué pasó? Contar un hecho» (docs/IT_A1_A2.md): el imperfetto para la escena y el
 * passato prossimo para el hecho, stavo + gerundio, mentre, all'improvviso, quindi y per fortuna.
 * Falsos amigos: subito es «enseguida» (no «súbitamente») e imbarazzato es «avergonzado» (embarazada
 * se dice incinta).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CHIAVI = dialogue(
  'it.stim.a2-u5-chiavi',
  'Anna no encuentra sus llaves y llama a su hermano Paolo.',
  [
    ['Anna', 'Paolo, ho perso le chiavi di casa!'],
    ['Paolo', 'Calma. Dove sei stata stamattina?'],
    ['Anna', 'Al bar e poi al supermercato.'],
    ['Paolo', 'Allora chiamiamo il bar.'],
    ['Anna', 'Aspetta… Ho trovato le chiavi! Erano nella borsa, sotto il portafoglio.'],
  ],
);

const TELEFONO = dialogue(
  'it.stim.a2-u5-autobus',
  'Marta le cuenta a Luca por teléfono lo que le pasó.',
  [
    ['Luca', 'Pronto, Marta? Cos’è successo?'],
    ['Marta', 'Una cosa terribile: mi hanno rubato il portafoglio!'],
    ['Luca', 'No! Dove?'],
    ['Marta', 'In autobus. C’era tanta gente e io stavo leggendo. All’improvviso non c’era più!'],
    ['Luca', 'Hai chiamato la polizia?'],
    ['Marta', 'Sì, subito. Per fortuna i documenti erano a casa.'],
  ],
);

const NOTIZIA = reading(
  'it.stim.a2-u5-notizia',
  'notice',
  'Una noticia breve en la página web de un pueblo.',
  [
    'Sabato sera, mentre c’era il concerto in piazza, è caduto un grande albero.',
    'Per fortuna non è successo niente a nessuno.',
    'Il concerto è finito subito dopo.',
  ],
  { title: 'Paura in piazza' },
);

const DIARIO = reading(
  'it.stim.a2-u5-imbarazzo',
  'post',
  'Giorgio cuenta en sus redes un momento incómodo.',
  [
    'Ieri mattina pioveva e io ero in ritardo.',
    'Mentre correvo verso l’ufficio, sono caduto davanti a tutti i colleghi!',
    'Ero così imbarazzato… Ma un collega mi ha aiutato e poi abbiamo riso insieme.',
  ],
  { from: 'Giorgio', title: 'Che figura!' },
);

export const IT_A2_U05: ItUnitDef = {
  names: ['Anna', 'Paolo', 'Marta', 'Luca', 'Giorgio', 'Marco'],
  support: [
    'calma',
    'chiamiamo',
    'aspetta',
    'sotto',
    'pronto',
    'terribile',
    'tanta',
    'gente',
    'leggendo',
    'polizia',
    'documenti',
    'concerto',
    'albero',
    'niente',
    'nessuno',
    'finito',
    'paura',
    'correvo',
    'verso',
    'davanti',
    'colleghi',
    'collega',
    'così',
    'aiutato',
    'riso',
    'figura',
    'dormendo',
    'camminando',
    'stavi',
    'facendo',
    'faceva',
    'dalla',
    'leggevo',
    'centro',
    'mangiando',
    'della',
  ],
  unit: {
    position: 5,
    title: '¿Qué pasó? Contar un hecho',
    titleEn: "Cos'è successo?",
    description:
      'Contar algo que te pasó: la escena con el imperfetto (pioveva, stavo leggendo) y el hecho con el passato prossimo (all’improvviso è caduto…).',
    emoji: '💬',
    objective:
      'Podés contar algo que te pasó (perdiste algo, te robaron, te caíste): describir la escena, decir qué estabas haciendo, qué pasó de repente y cómo terminó.',
    grammar: {
      title: 'Imperfetto y passato prossimo · stavo + gerundio',
      explanation:
        'En un relato, el imperfetto pinta la escena (pioveva, c’era tanta gente) y lo que estaba pasando; el passato prossimo cuenta el hecho que pasó (sono caduto). Para «estaba haciendo»: stare en imperfetto + gerundio (-are → -ando, -ere / -ire → -endo): stavo leggendo. Mentre (mientras) va con imperfetto; all’improvviso (de repente) con el hecho. Conectores: poi, allora, quindi (así que), per fortuna (por suerte).',
      examples: [
        {
          target: 'Mentre stavo leggendo, è arrivato Marco.',
          base: 'Mientras estaba leyendo, llegó Marco.',
        },
        { target: "Pioveva e all'improvviso sono caduto.", base: 'Llovía y de repente me caí.' },
        { target: 'Per fortuna ho trovato le chiavi.', base: 'Por suerte encontré las llaves.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U5). Sin revisión nativa: revisar el registro de las historias, che figura! y la noticia breve.',
    },
    words: [
      w(
        'it-cos-e-successo',
        "cos'è successo?",
        '¿qué pasó?',
        "Cos'è successo ieri?",
        '¿Qué pasó ayer?',
        ['questions', 'past'],
        {
          acceptedTexts: ['cos’è successo?', 'che cosa è successo?'],
        },
      ),
      w('it-e-successo', 'è successo', 'pasó', 'È successo ieri sera.', 'Pasó anoche.', ['past'], {
        acceptedTranslations: ['ocurrió', 'sucedió'],
      }),
      w('it-ho-perso', 'ho perso', 'perdí', 'Ho perso le chiavi.', 'Perdí las llaves.', [
        'verbs',
        'past',
      ]),
      w(
        'it-ho-trovato',
        'ho trovato',
        'encontré',
        'Ho trovato il portafoglio.',
        'Encontré la billetera.',
        ['verbs', 'past'],
      ),
      w('it-ho-chiamato', 'ho chiamato', 'llamé', 'Ho chiamato mia madre.', 'Llamé a mi mamá.', [
        'verbs',
        'past',
      ]),
      w(
        'it-portafoglio',
        'portafoglio',
        'billetera',
        'Il portafoglio è nella borsa.',
        'La billetera está en la cartera.',
        ['objects'],
        {
          acceptedTranslations: ['cartera (de bolsillo)'],
          emoji: '👛',
        },
      ),
      w('it-subito', 'subito', 'enseguida', 'Ho chiamato subito.', 'Llamé enseguida.', ['time'], {
        acceptedTranslations: ['inmediatamente', 'ya mismo'],
      }),
      w(
        'it-mi-hanno-rubato',
        'mi hanno rubato',
        'me robaron',
        'Mi hanno rubato il portafoglio.',
        'Me robaron la billetera.',
        ['past'],
      ),
      w('it-stavo', 'stavo', 'estaba (haciendo algo)', 'Stavo leggendo.', 'Estaba leyendo.', [
        'verbs',
        'past',
      ]),
      w(
        'it-mentre',
        'mentre',
        'mientras',
        'Mentre leggevo, è arrivato Marco.',
        'Mientras leía, llegó Marco.',
        ['connectors'],
      ),
      w(
        'it-all-improvviso',
        "all'improvviso",
        'de repente',
        "All'improvviso è caduto un albero.",
        'De repente se cayó un árbol.',
        ['connectors'],
        {
          acceptedTexts: ['all’improvviso'],
        },
      ),
      w(
        'it-per-fortuna',
        'per fortuna',
        'por suerte',
        'Per fortuna ho trovato le chiavi.',
        'Por suerte encontré las llaves.',
        ['connectors'],
      ),
      w('it-pioveva', 'pioveva', 'llovía', 'Ieri pioveva.', 'Ayer llovía.', ['weather', 'past']),
      w(
        'it-e-caduto',
        'è caduto',
        'se cayó',
        'Il bambino è caduto.',
        'El nene se cayó.',
        ['past'],
        {
          acceptedTexts: ['è caduta', 'sono caduto', 'sono caduta'],
          acceptedTranslations: ['me caí', 'cayó'],
        },
      ),
      w(
        'it-imbarazzato',
        'imbarazzato',
        'avergonzado',
        'Ero molto imbarazzato.',
        'Estaba muy avergonzado.',
        ['feelings'],
        {
          acceptedTexts: ['imbarazzata'],
          acceptedTranslations: ['avergonzada', 'incómodo', 'incómoda'],
        },
      ),
      w(
        'it-quindi',
        'quindi',
        'así que',
        'Pioveva, quindi sono rimasto a casa.',
        'Llovía, así que me quedé en casa.',
        ['connectors'],
        {
          acceptedTranslations: ['por eso', 'entonces'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: "Cos'è successo?",
        objective: 'Preguntar qué pasó y contar que perdiste o encontraste algo.',
        intro: {
          explanation:
            'Cos’è successo? es «¿qué pasó?». Para contar: ho perso (perdí), ho trovato (encontré), ho chiamato (llamé). Ojo: subito es «enseguida», no «súbitamente».',
          examples: [
            { target: 'Ho perso le chiavi di casa!', base: '¡Perdí las llaves de casa!' },
            { target: 'Ho chiamato subito.', base: 'Llamé enseguida.' },
          ],
        },
        takeaways: ["Preguntás cos'è successo?", 'Contás que perdiste, encontraste o llamaste.'],
        exercises: [
          ex.translationChoice(
            "cos'è successo?",
            '¿qué pasó?',
            ['¿qué es eso?', '¿cómo te fue?', '¿qué hacés?'],
            ['it-cos-e-successo'],
            {
              id: 'it.ex.2c2lyfgkjrnjub',
            },
          ),
          ex.translationChoice(
            'subito',
            'enseguida',
            ['súbitamente', 'despacio', 'de repente'],
            ['it-subito'],
            {
              id: 'it.ex.x3a9urht39xyl6',
              explanation: 'Falso amigo: subito es «enseguida». «De repente» es all’improvviso.',
            },
          ),
          ex.matchPairs(
            [
              ['ho perso', 'perdí'],
              ['ho trovato', 'encontré'],
              ['ho chiamato', 'llamé'],
              ['portafoglio', 'billetera'],
            ],
            ['it-ho-perso', 'it-ho-trovato', 'it-ho-chiamato', 'it-portafoglio'],
            { id: 'it.ex.4v5nonjfwepso8' },
          ),
          ex.listenChoice(
            'Ho perso le chiavi di casa.',
            [
              'Ho trovato le chiavi di casa.',
              'Ho perso le chiavi della macchina.',
              'Hai perso le chiavi di casa?',
            ],
            ['it-ho-perso', 'it-chiave'],
            { id: 'it.ex.09iaybqzp07nqw' },
          ),
          ex.fillBlank(
            'Ho ___ il portafoglio!',
            '¡Perdí la billetera!',
            'perso',
            ['trovato', 'chiamato', 'preso'],
            ['it-ho-perso', 'it-portafoglio'],
            {
              id: 'it.ex.c1rro6j37cg6zc',
              skill: 'vocabulary',
            },
          ),
          question(
            'it.ex.ww43p9s9bx5mtg',
            CHIAVI,
            '¿Qué perdió Anna?',
            'Las llaves de su casa',
            ['La billetera', 'La cartera', 'El celular'],
            ['it-ho-perso'],
            'Anna dice: «ho perso le chiavi di casa!».',
          ),
          question(
            'it.ex.tyrb6pa4agfoip',
            CHIAVI,
            '¿Dónde estaban al final?',
            'En la cartera, debajo de la billetera',
            ['En el bar', 'En el supermercado', 'En la casa de Paolo'],
            ['it-ho-trovato', 'it-portafoglio'],
            'Anna dice: «Ho trovato le chiavi! Erano nella borsa, sotto il portafoglio».',
          ),
          ex.shortAnswer(
            "Cos'è successo?",
            '¿Qué pasó? (Respondé que perdiste la billetera.)',
            'Ho perso il portafoglio.',
            ['Ho perso il mio portafoglio.', 'Ho perso il portafoglio!'],
            ['it-ho-perso', 'it-portafoglio'],
            { id: 'it.ex.u1bpfbee80han8' },
          ),
          ex.translateWrite(
            'Llamé enseguida.',
            'Ho chiamato subito.',
            ['it-ho-chiamato', 'it-subito'],
            { id: 'it.ex.gr7m5slo1nio6t' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Stavo leggendo',
        objective: 'Decir qué estabas haciendo cuando pasó algo.',
        intro: {
          explanation:
            'Para «estaba haciendo» se usa stavo + gerundio: -are → -ando (camminando), -ere / -ire → -endo (leggendo, dormendo). Mentre (mientras) va con lo que estaba pasando: mentre stavo leggendo…',
          examples: [
            { target: 'Stavo camminando in centro.', base: 'Estaba caminando por el centro.' },
            {
              target: 'Mentre ero in autobus, ho visto Marco.',
              base: 'Mientras estaba en el colectivo, vi a Marco.',
            },
          ],
        },
        takeaways: [
          'Decís qué estabas haciendo: stavo + -ando / -endo.',
          'Usás mentre para la escena.',
        ],
        exercises: [
          ex.translationChoice(
            'mentre',
            'mientras',
            ['después', 'antes', 'así que'],
            ['it-mentre'],
            { id: 'it.ex.nam98ja4k2ewzw' },
          ),
          ex.fillBlank(
            'Stavo ___ quando hai chiamato.',
            'Estaba durmiendo cuando llamaste.',
            'dormendo',
            ['dormito', 'dormo', 'camminando'],
            ['it-stavo'],
            {
              id: 'it.ex.2mub39cscp7aea',
              explanation: 'Stavo + gerundio: dormire → dormendo.',
            },
          ),
          ex.fillBlank(
            'Mentre ___ in autobus, ho visto Marco.',
            'Mientras estaba en el colectivo, vi a Marco.',
            'ero',
            ['sono', 'ho', 'siamo'],
            ['it-mentre', 'it-ero'],
            {
              id: 'it.ex.51tlho6cnik6qq',
              explanation: 'Mentre va con imperfetto: mentre ero…',
            },
          ),
          ex.listenChoice(
            'Stavo camminando in centro.',
            [
              'Stavo mangiando in centro.',
              'Sto camminando in centro.',
              'Stavo camminando in piazza.',
            ],
            ['it-stavo'],
            { id: 'it.ex.91cfvlz9repgzl' },
          ),
          question(
            'it.ex.h3ohoari1scs78',
            TELEFONO,
            '¿Qué le robaron a Marta?',
            'La billetera',
            ['Los documentos', 'El celular', 'Las llaves'],
            ['it-mi-hanno-rubato', 'it-portafoglio'],
            'Marta dice: «mi hanno rubato il portafoglio!».',
          ),
          question(
            'it.ex.q28n2jg3hd55h8',
            TELEFONO,
            '¿Qué estaba haciendo Marta cuando pasó?',
            'Estaba leyendo en el colectivo',
            [
              'Estaba durmiendo en el tren',
              'Estaba hablando por teléfono',
              'Estaba bajando del colectivo',
            ],
            ['it-stavo', 'it-all-improvviso'],
            'Marta dice: «C’era tanta gente e io stavo leggendo. All’improvviso non c’era più!».',
          ),
          question(
            'it.ex.v2ezi9o8pv5slw',
            TELEFONO,
            '¿Por qué tuvo suerte Marta?',
            'Porque los documentos estaban en casa',
            [
              'Porque encontró la billetera',
              'Porque la policía llegó enseguida',
              'Porque no tenía plata',
            ],
            ['it-per-fortuna', 'it-subito'],
            'Marta dice: «Per fortuna i documenti erano a casa».',
          ),
          ex.shortAnswer(
            'Cosa stavi facendo?',
            '¿Qué estabas haciendo? (Respondé que estabas leyendo.)',
            'Stavo leggendo.',
            ['Stavo leggendo un libro.', 'Io stavo leggendo.'],
            ['it-stavo'],
            { id: 'it.ex.m7wh8p95jp6cr1' },
          ),
          ex.translateWrite(
            'Estaba caminando por el centro.',
            'Stavo camminando in centro.',
            ['it-stavo'],
            {
              id: 'it.ex.3rzak0e32nok2e',
              acceptedAnswers: ['Stavo camminando per il centro.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: "Pioveva e all'improvviso…",
        objective: 'Separar la escena (imperfetto) del hecho (passato prossimo).',
        intro: {
          explanation:
            'En un relato, el imperfetto pinta la escena: pioveva, faceva freddo, c’era tanta gente. El passato prossimo cuenta lo que pasó: all’improvviso è caduto un albero. Como en español: «llovía y de repente se cayó».',
          examples: [
            { target: 'Pioveva quando sono uscita.', base: 'Llovía cuando salí.' },
            { target: "All'improvviso è caduto un albero.", base: 'De repente se cayó un árbol.' },
          ],
        },
        takeaways: [
          'Usás el imperfetto para la escena y el passato prossimo para el hecho.',
          "Usás all'improvviso para el momento clave.",
        ],
        exercises: [
          ex.translationChoice(
            "all'improvviso",
            'de repente',
            ['de a poco', 'improvisado', 'por suerte'],
            ['it-all-improvviso'],
            {
              id: 'it.ex.6bxylw8hjte7tv',
            },
          ),
          ex.fillBlank(
            '___ e faceva freddo.',
            'Llovía y hacía frío.',
            'Pioveva',
            ['Piove', 'Nevica', 'Fa'],
            ['it-pioveva'],
            {
              id: 'it.ex.363v8e4jwl0bmz',
              explanation: 'La escena va en imperfetto: pioveva, faceva.',
            },
          ),
          ex.fillBlank(
            'Pioveva quando ___ uscita.',
            'Llovía cuando salí.',
            'sono',
            ['ero', 'stavo', 'ho'],
            ['it-pioveva', 'it-sono-uscito'],
            {
              id: 'it.ex.xvp4jj4e2mti0t',
              explanation: 'El hecho (salir) va en passato prossimo con essere: sono uscita.',
            },
          ),
          ex.listenChoice(
            "All'improvviso è caduto un albero.",
            [
              "All'improvviso è arrivato un treno.",
              'Per fortuna è caduto un albero.',
              "All'improvviso è caduta una sedia.",
            ],
            ['it-all-improvviso', 'it-e-caduto'],
            { id: 'it.ex.q1dry40uwkz0s7' },
          ),
          question(
            'it.ex.wkx90ahmnuerko',
            NOTIZIA,
            '¿Qué pasó el sábado a la noche?',
            'Se cayó un árbol grande durante el concierto',
            [
              'Se suspendió el concierto por la lluvia',
              'Robaron en la plaza',
              'Se cortó la luz en la plaza',
            ],
            ['it-e-caduto', 'it-mentre'],
            'La noticia dice: «mentre c’era il concerto in piazza, è caduto un grande albero».',
          ),
          question(
            'it.ex.gwq7wl3qqhn92n',
            NOTIZIA,
            '¿Hubo heridos?',
            'No, por suerte a nadie le pasó nada',
            ['Sí, algunos', 'Sí, el músico', 'La noticia no lo dice'],
            ['it-per-fortuna', 'it-e-successo'],
            'La noticia dice: «Per fortuna non è successo niente a nessuno».',
          ),
          question(
            'it.ex.vu82xauag0danc',
            NOTIZIA,
            '¿Qué pasó con el concierto?',
            'Terminó enseguida',
            ['Siguió hasta tarde', 'Empezó después', 'Se hizo al día siguiente'],
            ['it-subito'],
            'La noticia dice: «Il concerto è finito subito dopo» (subito = enseguida).',
          ),
          ex.orderWords(
            'Pioveva e c’era tanta gente.',
            'Llovía y había mucha gente.',
            ['it-pioveva', 'it-c-era'],
            { id: 'it.ex.9sc97wlte3au9b' },
          ),
          ex.shortAnswer(
            'Che tempo faceva?',
            '¿Qué tiempo hacía? (Respondé que llovía y hacía frío.)',
            'Pioveva e faceva freddo.',
            ['Faceva freddo e pioveva.', 'Pioveva.'],
            ['it-pioveva'],
            { id: 'it.ex.y4dfu96pywvjdx' },
          ),
          ex.translateWrite(
            'Llovía cuando salí.',
            'Pioveva quando sono uscito.',
            ['it-pioveva', 'it-sono-uscito'],
            {
              id: 'it.ex.k6uc47h0unvl6k',
              acceptedAnswers: ['Pioveva quando sono uscita.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Che figura!',
        objective: 'Contar un momento incómodo y sus consecuencias.',
        intro: {
          explanation:
            'Ojo con el falso amigo: imbarazzato es «avergonzado» o «incómodo» (embarazada se dice incinta). Quindi es «así que, por eso». Y en italiano «hacer el ridículo» es fare una brutta figura: che figura!',
          examples: [
            { target: 'Ero così imbarazzata!', base: '¡Estaba tan avergonzada!' },
            {
              target: 'Pioveva, quindi sono rimasto a casa.',
              base: 'Llovía, así que me quedé en casa.',
            },
          ],
        },
        takeaways: [
          'Sabés que imbarazzato es «avergonzado».',
          'Unís causa y consecuencia con quindi.',
        ],
        exercises: [
          ex.translationChoice(
            'imbarazzato',
            'avergonzado',
            ['embarazado', 'enojado', 'aburrido'],
            ['it-imbarazzato'],
            {
              id: 'it.ex.i9keh8vx2ix7g8',
              explanation:
                'Falso amigo: imbarazzato es «avergonzado» o «incómodo». «Embarazada» es incinta.',
            },
          ),
          ex.translationChoice('quindi', 'así que', ['quince', 'quizás', 'cuando'], ['it-quindi'], {
            id: 'it.ex.afh31pfv3hxvh1',
          }),
          ex.fillBlank(
            'Mia sorella è ___ dalla bicicletta.',
            'Mi hermana se cayó de la bici.',
            'caduta',
            ['caduto', 'cadute', 'caduti'],
            ['it-e-caduto', 'it-bicicletta'],
            {
              id: 'it.ex.s8yjia5xi9k1kg',
              explanation: 'Cadere va con essere: el participio concuerda (mia sorella è caduta).',
            },
          ),
          ex.fillBlank(
            'Pioveva, ___ sono rimasto a casa.',
            'Llovía, así que me quedé en casa.',
            'quindi',
            ['mentre', 'ma', 'perché'],
            ['it-quindi'],
            {
              id: 'it.ex.ks0h6o3oyrxbky',
            },
          ),
          ex.listenChoice(
            'Ero così imbarazzata!',
            ['Ero così stanca!', 'Era così imbarazzata!', 'Ero così felice!'],
            ['it-imbarazzato'],
            { id: 'it.ex.l2dopojziu0f5n' },
          ),
          question(
            'it.ex.18jvaxu2pqf2gk',
            DIARIO,
            '¿Qué le pasó a Giorgio?',
            'Se cayó delante de sus compañeros de trabajo',
            ['Llegó tarde y lo retaron', 'Perdió la billetera', 'Se mojó con la lluvia'],
            ['it-e-caduto', 'it-mentre'],
            'Giorgio escribe: «Mentre correvo verso l’ufficio, sono caduto davanti a tutti i colleghi!».',
          ),
          question(
            'it.ex.6eqryltq0itphc',
            DIARIO,
            '¿Cómo se sintió?',
            'Muy avergonzado',
            ['Muy enojado', 'Tranquilo', 'Enfermo'],
            ['it-imbarazzato'],
            'Giorgio escribe: «Ero così imbarazzato…».',
          ),
          question(
            'it.ex.h604kg3rz02bcy',
            DIARIO,
            '¿Cómo terminó la historia?',
            'Un compañero lo ayudó y después se rieron juntos',
            ['Volvió a su casa', 'Nadie lo ayudó', 'Llamó a un médico'],
            ['it-pioveva'],
            'Giorgio escribe: «un collega mi ha aiutato e poi abbiamo riso insieme».',
          ),
          ex.shortAnswer(
            'Eri imbarazzato?',
            '¿Estabas avergonzado? (Respondé que sí, muy avergonzado o avergonzada.)',
            'Sì, ero molto imbarazzato.',
            ['Sì, ero molto imbarazzata.', 'Ero molto imbarazzato.', 'Ero molto imbarazzata.'],
            ['it-imbarazzato'],
            { id: 'it.ex.s1llnaklqryb2l' },
          ),
          ex.translateWrite(
            'Llovía, así que tomé el colectivo.',
            "Pioveva, quindi ho preso l'autobus.",
            ['it-pioveva', 'it-quindi', 'it-ho-preso'],
            {
              id: 'it.ex.hgi8ghrfmjzdh0',
              acceptedAnswers: ['Pioveva, quindi ho preso l’autobus.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Raccontare un fatto',
        objective: 'Contar de principio a fin algo que te pasó.',
        intro: {
          explanation:
            'Un buen relato: la escena en imperfetto (pioveva, stavo leggendo), el hecho en passato prossimo (all’improvviso è successo…), y el final con un conector: per fortuna, quindi, poi.',
          examples: [
            {
              target: 'Mentre stavo leggendo, è arrivato Marco.',
              base: 'Mientras estaba leyendo, llegó Marco.',
            },
            {
              target: 'Per fortuna ho trovato le chiavi.',
              base: 'Por suerte encontré las llaves.',
            },
          ],
        },
        takeaways: [
          'Contás un hecho con escena, momento clave y final.',
          'Usás mentre, all’improvviso, quindi y per fortuna.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['mentre', 'mientras'],
              ["all'improvviso", 'de repente'],
              ['quindi', 'así que'],
              ['per fortuna', 'por suerte'],
            ],
            ['it-mentre', 'it-all-improvviso', 'it-quindi', 'it-per-fortuna'],
            { id: 'it.ex.3zj4c300cmvksf' },
          ),
          ex.fillBlank(
            'Cosa ti è ___?',
            '¿Qué te pasó?',
            'successo',
            ['successa', 'successi', 'caduto'],
            ['it-e-successo'],
            {
              id: 'it.ex.1oyk46pnv3asm7',
            },
          ),
          ex.listenChoice(
            'Mentre stavo leggendo, è arrivato Marco.',
            [
              'Mentre stavo dormendo, è arrivato Marco.',
              'Mentre leggevo, è arrivata Marta.',
              'Quando sono arrivato, Marco stava leggendo.',
            ],
            ['it-mentre', 'it-stavo'],
            { id: 'it.ex.0s4vjmt6fmwe0j' },
          ),
          ex.fillBlank(
            'Pioveva ___ sono uscita.',
            'Llovía cuando salí.',
            'quando',
            ['mentre', 'quindi', 'già'],
            ['it-pioveva', 'it-quando'],
            {
              id: 'it.ex.jp0pyuqimreps0',
            },
          ),
          question(
            'it.ex.pl2o309xmp21ac',
            CHIAVI,
            '¿Qué le propone Paolo a Anna?',
            'Llamar al bar',
            ['Ir a la policía', 'Volver al supermercado', 'Esperar en casa'],
            ['it-ho-chiamato'],
            'Paolo dice: «Allora chiamiamo il bar».',
          ),
          ex.orderWords(
            'Per fortuna ho trovato le chiavi.',
            'Por suerte encontré las llaves.',
            ['it-per-fortuna', 'it-ho-trovato'],
            {
              id: 'it.ex.xaz7durfzsopma',
            },
          ),
          ex.shortAnswer(
            "Cos'è successo ieri?",
            '¿Qué pasó ayer? (Respondé que te robaron la billetera en el colectivo.)',
            'Mi hanno rubato il portafoglio in autobus.',
            [
              'In autobus mi hanno rubato il portafoglio.',
              'Mi hanno rubato il portafoglio.',
              'Ieri mi hanno rubato il portafoglio in autobus.',
            ],
            ['it-mi-hanno-rubato', 'it-portafoglio'],
            { id: 'it.ex.w1gm05jsldcvxj' },
          ),
          ex.translateWrite(
            'Mientras leía, llegó mi hermano.',
            'Mentre leggevo, è arrivato mio fratello.',
            ['it-mentre', 'it-fratello'],
            {
              id: 'it.ex.ql7w87ptaivktq',
              acceptedAnswers: ['Mentre stavo leggendo, è arrivato mio fratello.'],
            },
          ),
        ],
      },
    ],
  },
};
