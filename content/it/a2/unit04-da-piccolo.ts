import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Italiano A2 U4 «Cuando era chico» (docs/IT_A1_A2.md): el imperfetto para hábitos y descripciones del
 * pasado (abitavo, giocavo, andavo; ero, avevo, facevo), c'era, mi piaceva, di solito y da piccolo.
 * Falsos amigos: la campagna es el campo; paese es «país» y también «pueblo».
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const NONNA = dialogue(
  'it.stim.a2-u4-nonna',
  'Una nieta le pregunta a su abuela cómo era su infancia.',
  [
    ['Nipote', 'Nonna, com’era la tua vita da piccola?'],
    ['Nonna', 'Abitavo in un paese in campagna, vicino a Lecce. Eravamo sette fratelli!'],
    ['Nipote', 'Sette! E andavi a scuola?'],
    ['Nonna', 'Sì, ci andavo a piedi. Non c’era l’autobus.'],
    ['Nipote', 'E cosa facevate la domenica?'],
    ['Nonna', 'Di solito andavamo dai nonni: c’era sempre un grande pranzo.'],
  ],
);

const RICORDO = reading(
  'it.stim.a2-u4-ricordo',
  'post',
  'Andrea comparte un recuerdo de su infancia.',
  [
    'Quando ero piccolo, d’estate andavo sempre al mare con i miei genitori.',
    'Avevo un cane, Bobi, e giocavo con lui tutto il giorno.',
    'La sera mangiavamo il gelato in piazza. Mi piaceva tantissimo!',
  ],
  { from: 'Andrea', title: 'Le estati al mare' },
);

const SCUOLA = reading(
  'it.stim.a2-u4-scuola',
  'description',
  'Francesca cuenta en un foro cómo era su escuela.',
  [
    'Da piccola non mi piaceva la scuola.',
    'La maestra era molto severa e c’erano trenta bambini in classe.',
    'Ma il pomeriggio facevo sport ed ero felice.',
  ],
  { from: 'Francesca' },
);

export const IT_A2_U04: ItUnitDef = {
  names: ['Nipote', 'Nonna', 'Lecce', 'Andrea', 'Bobi', 'Francesca', 'Rosario'],
  support: [
    'vita',
    'andavi',
    'facevate',
    'andavamo',
    'dai',
    'pranzo',
    'mangiavamo',
    'tantissimo',
    'maestra',
    'severa',
    'erano',
    'classe',
    'pomeriggio',
    'sport',
    'ed',
    'eri',
    'abito',
    'abitare',
    'abitava',
    'abitavi',
    'avevi',
    'animale',
    'compiti',
    'facevi',
    'estati',
  ],
  unit: {
    position: 4,
    title: 'Cuando era chico',
    titleEn: 'Da piccolo',
    description:
      'Contar cómo era tu vida de chico con el imperfetto: dónde vivías, qué hacías, qué había y qué te gustaba.',
    emoji: '🧸',
    objective:
      'Puedes contar cómo eras de chico o chica, dónde vivías, qué hacías por lo general y qué había en tu barrio o tu pueblo, y entender los recuerdos de otra persona.',
    grammar: {
      title: 'Imperfetto: hábitos y descripciones',
      explanation:
        'El imperfetto describe cómo eran las cosas y lo que hacías siempre, como nuestro pretérito imperfecto. Regulares: -are → -avo (abitavo), -ere → -evo, -ire → -ivo; con noi, -avamo / -evamo (andavamo). Essere es irregular: ero, eri, era, eravamo, eravate, erano. Avere es regular (avevo) y fare usa la raíz fac- (facevo). C’era / c’erano = «había». Ojo: giocare a calcio, sin artículo (no «al calcio»).',
      examples: [
        { target: 'Da piccolo abitavo in un paese.', base: 'De chico vivía en un pueblo.' },
        {
          target: 'Di solito giocavo a calcio con mio fratello.',
          base: 'Por lo general jugaba al fútbol con mi hermano.',
        },
        { target: "Non c'era l'autobus.", base: 'No había autobús.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U4). Sin revisión nativa: revisar ci andavo, dai nonni y el registro de la entrevista.',
    },
    words: [
      w(
        'it-ero',
        'ero',
        'yo era',
        'Da piccolo ero timido.',
        'De chico era tímido.',
        ['verbs', 'past'],
        {
          acceptedTranslations: ['yo estaba'],
        },
      ),
      w('it-era', 'era', 'era (él / ella)', 'La maestra era severa.', 'La maestra era severa.', [
        'verbs',
        'past',
      ]),
      w('it-eravamo', 'eravamo', 'éramos', 'Eravamo sette fratelli.', 'Éramos siete hermanos.', [
        'verbs',
        'past',
      ]),
      w('it-avevo', 'avevo', 'yo tenía', 'Avevo un cane.', 'Tenía un perro.', ['verbs', 'past']),
      w(
        'it-aveva',
        'aveva',
        'tenía (él / ella)',
        'Mio nonno aveva una casa grande.',
        'Mi abuelo tenía una casa grande.',
        ['verbs', 'past'],
      ),
      w('it-abitavo', 'abitavo', 'yo vivía', 'Abitavo a Roma.', 'Vivía en Roma.', [
        'verbs',
        'past',
      ]),
      w('it-giocavo', 'giocavo', 'yo jugaba', 'Giocavo a calcio.', 'Jugaba al fútbol.', [
        'verbs',
        'past',
      ]),
      w('it-andavo', 'andavo', 'yo iba', 'Andavo a scuola a piedi.', 'Iba a la escuela a pie.', [
        'verbs',
        'past',
      ]),
      w(
        'it-facevo',
        'facevo',
        'yo hacía',
        'Facevo sport il sabato.',
        'Hacía deporte los sábados.',
        ['verbs', 'past'],
      ),
      w(
        'it-c-era',
        "c'era",
        'había (una cosa)',
        "C'era un cinema in piazza.",
        'Había un cine en la plaza.',
        ['past'],
        {
          acceptedTexts: ['c’era'],
          acceptedTranslations: ['había'],
        },
      ),
      w(
        'it-mi-piaceva',
        'mi piaceva',
        'me gustaba',
        'Mi piaceva la scuola.',
        'Me gustaba la escuela.',
        ['past', 'likes'],
      ),
      w(
        'it-da-piccolo',
        'da piccolo',
        'de chico',
        'Da piccolo abitavo a Roma.',
        'De chico vivía en Roma.',
        ['past'],
        {
          acceptedTexts: ['da piccola'],
          acceptedTranslations: ['de chica', 'de niño', 'de niña'],
        },
      ),
      w(
        'it-di-solito',
        'di solito',
        'por lo general',
        'Di solito andavo al mare.',
        'Por lo general iba al mar.',
        ['time'],
        {
          acceptedTranslations: ['normalmente', 'generalmente'],
        },
      ),
      w(
        'it-bambino',
        'bambino',
        'niño',
        'Il bambino è in piazza.',
        'El niño está en la plaza.',
        ['family'],
        {
          acceptedTexts: ['bambina'],
          acceptedTranslations: ['niña', 'nene', 'niño', 'nena', 'chico', 'chica'],
          emoji: '🧒',
        },
      ),
      w(
        'it-paese',
        'paese',
        'pueblo',
        'Abitavo in un piccolo paese.',
        'Vivía en un pueblo chico.',
        ['places'],
        {
          acceptedTranslations: ['país'],
          emoji: '🏘️',
        },
      ),
      w(
        'it-campagna',
        'campagna',
        'campo',
        'La casa è in campagna.',
        'La casa está en el campo.',
        ['places'],
        { emoji: '🌾' },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Ero, era, eravamo',
        objective: 'Decir cómo eras con el imperfetto de essere.',
        intro: {
          explanation:
            'Para describir cómo eran las cosas se usa el imperfetto, como nuestro pretérito imperfecto. Essere: ero (yo era), eri, era (él / ella era), eravamo (éramos). Da piccolo / da piccola es «de chico / de chica».',
          examples: [
            { target: 'Da piccola ero molto timida.', base: 'De chica era muy tímida.' },
            { target: 'Eravamo sette fratelli.', base: 'Éramos siete hermanos.' },
          ],
        },
        takeaways: ['Usas ero, era y eravamo.', 'Dices da piccolo / da piccola.'],
        exercises: [
          ex.translationChoice(
            'da piccolo',
            'de chico',
            ['un poquito', 'desde lejos', 'de grande'],
            ['it-da-piccolo'],
            { id: 'it.ex.k287nm987dyppt' },
          ),
          ex.translationChoice('ero', 'yo era', ['yo soy', 'yo seré', 'yo tenía'], ['it-ero'], {
            id: 'it.ex.i6wreijrq9y0y5',
          }),
          ex.matchPairs(
            [
              ['ero', 'yo era'],
              ['era', 'era (él / ella)'],
              ['eravamo', 'éramos'],
              ['bambino', 'niño'],
            ],
            ['it-ero', 'it-era', 'it-eravamo', 'it-bambino'],
            { id: 'it.ex.4yib2mi72tktyo' },
          ),
          ex.listenChoice(
            'Da piccolo ero molto timido.',
            [
              'Da piccolo ero molto felice.',
              'Da piccola ero molto timida.',
              'Ora sono molto timido.',
            ],
            ['it-da-piccolo', 'it-ero'],
            { id: 'it.ex.205ywcrcapwnym' },
          ),
          ex.fillBlank(
            'Da piccola io ___ molto felice.',
            'De chica yo era muy feliz.',
            'ero',
            ['era', 'eravamo', 'sono'],
            ['it-ero', 'it-da-piccolo'],
            {
              id: 'it.ex.wil34p5owxr4fm',
            },
          ),
          ex.fillBlank(
            'Mio nonno ___ un bambino molto timido.',
            'Mi abuelo era un niño muy tímido.',
            'era',
            ['ero', 'eravamo', 'sono'],
            ['it-era', 'it-bambino'],
            { id: 'it.ex.k0z3z63ycwg50h' },
          ),
          ex.fillBlank(
            'Noi ___ sette fratelli.',
            'Éramos siete hermanos.',
            'eravamo',
            ['ero', 'era', 'siamo'],
            ['it-eravamo'],
            {
              id: 'it.ex.z4rm4kmercybe0',
            },
          ),
          ex.orderWords(
            'Da piccola ero molto timida.',
            'De chica era muy tímida.',
            ['it-da-piccolo', 'it-ero'],
            { id: 'it.ex.5e6srrunp5k8ga' },
          ),
          ex.shortAnswer(
            'Com’eri da piccolo?',
            '¿Cómo eras de chico? (Responde que eras muy tímido o tímida.)',
            'Ero molto timido.',
            ['Ero molto timida.', 'Da piccolo ero molto timido.', 'Da piccola ero molto timida.'],
            ['it-ero', 'it-da-piccolo'],
            { id: 'it.ex.1iyod2noij11uy' },
          ),
          ex.translateWrite(
            'De chico era muy feliz.',
            'Da piccolo ero molto felice.',
            ['it-da-piccolo', 'it-ero'],
            {
              id: 'it.ex.6uwxuo408lp4a5',
              acceptedAnswers: [
                'Da piccola ero molto felice.',
                'Da bambino ero molto felice.',
                'Da bambina ero molto felice.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Abitavo, giocavo, andavo',
        objective: 'Contar lo que hacías siempre.',
        intro: {
          explanation:
            'Los verbos en -are hacen el imperfetto en -avo: abitavo (vivía), giocavo (jugaba), andavo (iba). Sirve para lo que hacías siempre, a menudo con di solito (por lo general). Ojo: giocare a calcio va sin artículo.',
          examples: [
            {
              target: 'Di solito andavo a scuola a piedi.',
              base: 'Por lo general iba a la escuela a pie.',
            },
            {
              target: 'Giocavo a calcio con mio fratello.',
              base: 'Jugaba al fútbol con mi hermano.',
            },
          ],
        },
        takeaways: [
          'Cuentas hábitos con -avo: abitavo, giocavo, andavo.',
          'Dices di solito y giocare a calcio.',
        ],
        exercises: [
          ex.translationChoice(
            'giocavo',
            'yo jugaba',
            ['yo jugué', 'yo juego', 'yo jugaré'],
            ['it-giocavo'],
            { id: 'it.ex.pghs7sd6rj39p2' },
          ),
          ex.translationChoice(
            'di solito',
            'por lo general',
            ['solamente', 'de a uno', 'una sola vez'],
            ['it-di-solito'],
            {
              id: 'it.ex.alp6ddrngl6uu3',
            },
          ),
          ex.listenChoice(
            'Di solito andavo a scuola a piedi.',
            [
              'Di solito vado a scuola a piedi.',
              'Di solito andavo a scuola in autobus.',
              'Oggi sono andato a scuola a piedi.',
            ],
            ['it-di-solito', 'it-andavo'],
            { id: 'it.ex.xkxr2004irdo9y' },
          ),
          ex.fillBlank(
            'Da piccolo ___ a Milano.',
            'De chico vivía en Milán.',
            'abitavo',
            ['abito', 'abitare', 'abitava'],
            ['it-abitavo', 'it-da-piccolo'],
            {
              id: 'it.ex.86k9y7zsw30jc5',
            },
          ),
          ex.fillBlank(
            'Ogni estate ___ al mare.',
            'Todos los veranos iba al mar.',
            'andavo',
            ['vado', 'andiamo', 'vanno'],
            ['it-andavo', 'it-mare'],
            {
              id: 'it.ex.w689s4mfx08kq7',
              explanation: 'Para lo que hacías siempre, imperfetto: andavo.',
            },
          ),
          ex.fillBlank(
            'Giocavo ___ calcio con mio fratello.',
            'Jugaba al fútbol con mi hermano.',
            'a',
            ['al', 'in', 'di'],
            ['it-giocavo', 'it-calcio'],
            {
              id: 'it.ex.jq69ex54c0s2mk',
              explanation: 'En italiano se dice giocare a calcio, sin artículo.',
            },
          ),
          question(
            'it.ex.8uqzytwvn3x4ua',
            RICORDO,
            '¿Adónde iba Andrea en verano?',
            'Al mar, con sus papás',
            ['A la montaña, con sus abuelos', 'Al campo, con su perro', 'A la plaza, solo'],
            ['it-andavo', 'it-da-piccolo', 'it-mi-piaceva'],
            'Andrea escribe: «d’estate andavo sempre al mare con i miei genitori».',
          ),
          question(
            'it.ex.bzlj4b5lruvcxu',
            RICORDO,
            '¿Con quién jugaba todo el día?',
            'Con su perro, Bobi',
            ['Con su hermano', 'Con sus papás', 'Con los chicos de la plaza'],
            ['it-giocavo', 'it-avevo'],
            'Andrea escribe: «Avevo un cane, Bobi, e giocavo con lui tutto il giorno».',
          ),
          ex.shortAnswer(
            'Dove abitavi da piccolo?',
            '¿Dónde vivías de chico? (Responde que vivías en Rosario.)',
            'Abitavo a Rosario.',
            ['Da piccolo abitavo a Rosario.', 'Da piccola abitavo a Rosario.', 'A Rosario.'],
            ['it-abitavo'],
            { id: 'it.ex.nh8u2y7a4tvkgn' },
          ),
          ex.translateWrite(
            'Por lo general jugaba en la plaza.',
            'Di solito giocavo in piazza.',
            ['it-di-solito', 'it-giocavo', 'it-piazza'],
            {
              id: 'it.ex.2685gpcn7rduk4',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: "Avevo, facevo, c'era",
        objective: 'Decir qué tenías, qué hacías y qué había.',
        intro: {
          explanation:
            'Avere es regular: avevo (tenía), aveva. Fare usa la raíz fac-: facevo (hacía). Para lo que había: c’era (una cosa) y c’erano (varias). Y lo que te gustaba: mi piaceva.',
          examples: [
            {
              target: 'Da piccolo io avevo un gatto nero.',
              base: 'De chico yo tenía un gato negro.',
            },
            { target: 'Mi piaceva molto la scuola.', base: 'Me gustaba mucho la escuela.' },
          ],
        },
        takeaways: ["Usas avevo, facevo y c'era.", 'Dices lo que te gustaba con mi piaceva.'],
        exercises: [
          ex.translationChoice(
            "c'era",
            'había (una cosa)',
            ['hay', 'estaba él', 'era cara'],
            ['it-c-era'],
            { id: 'it.ex.wf2v5e5s3vlvj6' },
          ),
          ex.fillBlank(
            'Da piccolo io ___ un gatto nero.',
            'De chico yo tenía un gato negro.',
            'avevo',
            ['ho', 'aveva', 'hanno'],
            ['it-avevo', 'it-gatto'],
            {
              id: 'it.ex.fvkk25s3ytgayr',
            },
          ),
          ex.fillBlank(
            'Nella mia città non ___ il cinema.',
            'En mi ciudad no había cine.',
            "c'era",
            ["c'è", 'ci sono', 'aveva'],
            ['it-c-era', 'it-cinema'],
            { id: 'it.ex.4m8yl1wvm03041', explanation: 'En el pasado, c’è pasa a c’era.' },
          ),
          ex.listenChoice(
            'Mi piaceva molto la scuola.',
            [
              'Mi piace molto la scuola.',
              'Non mi piaceva la scuola.',
              'Mi piaceva molto il calcio.',
            ],
            ['it-mi-piaceva'],
            { id: 'it.ex.qi5g2tcqfun45o' },
          ),
          ex.fillBlank(
            'Il sabato ___ i compiti con mia sorella.',
            'Los sábados hacía los deberes con mi hermana.',
            'facevo',
            ['faccio', 'fatto', 'fanno'],
            ['it-facevo', 'it-sorella'],
            { id: 'it.ex.aipk800voxebkf' },
          ),
          question(
            'it.ex.tze4ovjhms2q86',
            SCUOLA,
            '¿Qué le parecía la escuela a Francesca?',
            'No le gustaba',
            ['Le gustaba mucho', 'Le daba igual', 'Le encantaba la maestra'],
            ['it-mi-piaceva'],
            'Francesca escribe: «Da piccola non mi piaceva la scuola».',
          ),
          question(
            'it.ex.fx68eqk2q9zc4c',
            SCUOLA,
            '¿Cómo era la clase?',
            'La maestra era muy severa y eran treinta chicos',
            ['La maestra era simpática y eran pocos', 'Eran trece chicos', 'No había maestra'],
            ['it-era', 'it-bambino'],
            'Francesca escribe: «La maestra era molto severa e c’erano trenta bambini in classe».',
          ),
          question(
            'it.ex.ypvlarbzjnrfor',
            SCUOLA,
            '¿Cuándo era feliz Francesca?',
            'A la tarde, cuando hacía deporte',
            ['A la mañana, en clase', 'Los domingos', 'Nunca'],
            ['it-facevo', 'it-ero'],
            'Francesca escribe: «il pomeriggio facevo sport ed ero felice».',
          ),
          ex.shortAnswer(
            'Avevi un animale?',
            '¿Tenías un animal? (Responde que sí, que tenías un perro.)',
            'Sì, avevo un cane.',
            ['Avevo un cane.', 'Sì, avevo un cane da piccolo.', 'Sì, avevo un cane da piccola.'],
            ['it-avevo', 'it-cane'],
            { id: 'it.ex.37peix3sxo7aq0' },
          ),
          ex.translateWrite(
            'De chica me gustaba bailar.',
            'Da piccola mi piaceva ballare.',
            ['it-mi-piaceva', 'it-ballare'],
            {
              id: 'it.ex.3u5hn3bfyjtt6o',
              acceptedAnswers: ['Da bambina mi piaceva ballare.', 'Da piccolo mi piaceva ballare.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Il paese e la campagna',
        objective: 'Hablar del lugar donde vivías y entender un recuerdo largo.',
        intro: {
          explanation:
            'Paese es «país», pero también «pueblo»: abitavo in un piccolo paese. Ojo: la campagna es el campo (no una campaña). Vivir en el campo: abitare in campagna.',
          examples: [
            { target: 'Abitavo in un piccolo paese.', base: 'Vivía en un pueblo chico.' },
            {
              target: 'Mio nonno aveva una casa in campagna.',
              base: 'Mi abuelo tenía una casa en el campo.',
            },
          ],
        },
        takeaways: [
          'Sabes que campagna es «campo» y paese, «pueblo».',
          'Entiendes a alguien mayor que cuenta su infancia.',
        ],
        exercises: [
          ex.translationChoice(
            'campagna',
            'campo',
            ['campaña', 'compañía', 'campamento'],
            ['it-campagna'],
            {
              id: 'it.ex.e2vzew4s3t64sq',
              explanation: 'Falso amigo: la campagna es el campo.',
            },
          ),
          ex.translationChoice('paese', 'pueblo', ['paisaje', 'paso', 'pariente'], ['it-paese'], {
            id: 'it.ex.3x5scvlrjnswl1',
            explanation: 'Paese es «país» y también «pueblo»; el contexto te dice cuál.',
          }),
          ex.listenChoice(
            'Abitavo in un piccolo paese.',
            [
              'Abito in un piccolo paese.',
              'Abitavo in una piccola città.',
              'Abitavo in un grande paese.',
            ],
            ['it-abitavo', 'it-paese'],
            { id: 'it.ex.ud36dw59mjig1g' },
          ),
          question(
            'it.ex.fb8k80ivq47v9r',
            NONNA,
            '¿Dónde vivía la abuela de chica?',
            'En un pueblo del campo, cerca de Lecce',
            ['En la ciudad de Lecce', 'En un pueblo de la montaña', 'Cerca del mar, en Roma'],
            ['it-paese', 'it-campagna', 'it-abitavo'],
            'La abuela dice: «Abitavo in un paese in campagna, vicino a Lecce».',
          ),
          question(
            'it.ex.q1mjnprxhn98vs',
            NONNA,
            '¿Cuántos hermanos eran?',
            'Siete',
            ['Dos', 'Diecisiete', 'Era hija única'],
            ['it-eravamo'],
            'La abuela dice: «Eravamo sette fratelli!».',
          ),
          question(
            'it.ex.jg1ggb2fftipvk',
            NONNA,
            '¿Cómo iba a la escuela?',
            'A pie, porque no había autobús',
            ['En autobús', 'En la bicicleta de su hermano', 'No iba a la escuela'],
            ['it-andavo', 'it-c-era'],
            'La abuela dice: «ci andavo a piedi. Non c’era l’autobus».',
          ),
          question(
            'it.ex.voqjk0qed0x08a',
            NONNA,
            '¿Qué hacían los domingos?',
            'Iban a lo de los abuelos, donde siempre había un gran almuerzo',
            ['Iban a misa y después al mar', 'Se quedaban en casa', 'Iban al cine del pueblo'],
            ['it-di-solito', 'it-c-era'],
            'La abuela dice: «Di solito andavamo dai nonni: c’era sempre un grande pranzo».',
          ),
          ex.shortAnswer(
            'Dove abitava tua nonna?',
            '¿Dónde vivía tu abuela? (Responde que vivía en un pueblo, en el campo.)',
            'Abitava in un paese in campagna.',
            ['Mia nonna abitava in un paese in campagna.', 'In un paese in campagna.'],
            ['it-paese', 'it-campagna'],
            { id: 'it.ex.q56xky5b5zravl' },
          ),
          ex.translateWrite(
            'Mi abuelo tenía una casa en el campo.',
            'Mio nonno aveva una casa in campagna.',
            ['it-aveva', 'it-campagna', 'it-nonno'],
            {
              id: 'it.ex.6asult4j0j0qit',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Quando ero piccolo…',
        objective: 'Contar un recuerdo de tu infancia.',
        intro: {
          explanation:
            'Para contar recuerdos combinas todo: quando ero piccolo (cuando era chico) + lo que hacías (andavo, giocavo, facevo) + lo que había (c’era) + lo que te gustaba (mi piaceva).',
          examples: [
            {
              target: 'Quando ero piccola, abitavo a Roma.',
              base: 'Cuando era chica, vivía en Roma.',
            },
            {
              target: 'Di solito facevo i compiti in cucina.',
              base: 'Por lo general hacía los deberes en la cocina.',
            },
          ],
        },
        takeaways: [
          'Cuentas un recuerdo con el imperfetto.',
          'Combinas quando ero piccolo, di solito y mi piaceva.',
        ],
        exercises: [
          ex.fillBlank(
            'Quando ___ piccola, abitavo a Roma.',
            'Cuando era chica, vivía en Roma.',
            'ero',
            ['era', 'sono', 'avevo'],
            ['it-ero', 'it-abitavo'],
            {
              id: 'it.ex.9m6cip9p06tsh0',
            },
          ),
          ex.matchPairs(
            [
              ['avevo', 'yo tenía'],
              ['facevo', 'yo hacía'],
              ['andavo', 'yo iba'],
              ['abitavo', 'yo vivía'],
            ],
            ['it-avevo', 'it-facevo', 'it-andavo', 'it-abitavo'],
            { id: 'it.ex.ijizh0eff2goza' },
          ),
          ex.listenChoice(
            'Di solito facevo i compiti in cucina.',
            [
              'Di solito facevo colazione in cucina.',
              'Oggi faccio i compiti in cucina.',
              'Di solito facevo i compiti in camera.',
            ],
            ['it-di-solito', 'it-facevo'],
            { id: 'it.ex.ra4zu5e1ul4f52' },
          ),
          ex.translationChoice(
            'mi piaceva',
            'me gustaba',
            ['me gusta', 'me gustó mucho', 'me gustaría'],
            ['it-mi-piaceva'],
            {
              id: 'it.ex.3q063lo9xgh8ze',
            },
          ),
          question(
            'it.ex.j34v4xumsnb85v',
            RICORDO,
            '¿Qué hacía la familia de Andrea a la noche?',
            'Comían helado en la plaza',
            ['Iban al cine', 'Jugaban con el perro', 'Cenaban en un restaurante'],
            ['it-mi-piaceva'],
            'Andrea escribe: «La sera mangiavamo il gelato in piazza. Mi piaceva tantissimo!».',
          ),
          ex.orderWords(
            'Da bambino giocavo sempre in piazza.',
            'De chico jugaba siempre en la plaza.',
            ['it-bambino', 'it-giocavo'],
            {
              id: 'it.ex.69bov1x6mub12b',
            },
          ),
          ex.shortAnswer(
            'Cosa facevi d’estate da piccolo?',
            '¿Qué hacías en verano de chico? (Responde que ibas al mar.)',
            'Andavo al mare.',
            [
              'D’estate andavo al mare.',
              'Da piccolo andavo al mare.',
              'Da piccola andavo al mare.',
              "D'estate andavo al mare.",
            ],
            ['it-andavo', 'it-mare'],
            { id: 'it.ex.kmhx7qapjaw9ww' },
          ),
          ex.translateWrite(
            'En mi pueblo había una plaza grande.',
            "Nel mio paese c'era una piazza grande.",
            ['it-paese', 'it-c-era', 'it-piazza'],
            {
              id: 'it.ex.rppq949bsj6bkt',
              acceptedAnswers: [
                'Nel mio paese c’era una piazza grande.',
                "Nel mio paese c'era una grande piazza.",
                'Nel mio paese c’era una grande piazza.',
              ],
            },
          ),
        ],
      },
    ],
  },
};
