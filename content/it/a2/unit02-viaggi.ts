import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Italiano A2 U2 «Viajes» (docs/IT_A1_A2.md): el passato prossimo con essere (partire, arrivare,
 * tornare, rimanere, uscire, salire, scendere) y la concordancia del participio, sono stato
 * (essere y stare), el aeropuerto y fa (due anni fa = hace dos años).
 * Falso amigo: salire es «subir»; «salir» es uscire.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const AEROPORTO = dialogue(
  'it.stim.a2-u2-aeroporto',
  'Anuncios por los altavoces de un aeropuerto italiano.',
  [
    ['Altoparlante', 'Attenzione, prego. Il volo per Madrid parte alle undici e mezza.'],
    ['Altoparlante', 'Il volo per Londra è in ritardo di un’ora.'],
    ['Altoparlante', 'I passeggeri del volo per Palermo devono andare al gate dodici.'],
  ],
);

const VIAGGIO = dialogue(
  'it.stim.a2-u2-viaggio',
  'Giulia acaba de llegar a Roma y Paolo la llama.',
  [
    ['Paolo', 'Allora, com’è stato il viaggio?'],
    ['Giulia', 'Lungo! Sono partita da Buenos Aires alle dieci di sera.'],
    ['Paolo', 'E quando sei arrivata a Roma?'],
    ['Giulia', 'Il giorno dopo, alle cinque. Ma la mia valigia è arrivata due giorni dopo!'],
    ['Paolo', 'Che sfortuna!'],
  ],
);

const CARTOLINA = reading(
  'it.stim.a2-u2-cartolina',
  'postcard',
  'Marta e Ivan le mandan una postal a una amiga desde Sicilia.',
  [
    'Cara Laura, siamo arrivati a Palermo martedì.',
    'Siamo stati al mare tutti i giorni e ieri siamo saliti sull’Etna!',
    'Il cibo è buonissimo. Torniamo a casa domenica.',
    'Baci, Marta e Ivan',
  ],
  { from: 'Marta e Ivan', to: 'Laura' },
);

const PRIMO = reading(
  'it.stim.a2-u2-primo-viaggio',
  'post',
  'Diego recuerda en un foro de viajeros su primer viaje.',
  [
    'Dieci anni fa sono andato in Italia per la prima volta.',
    'Sono rimasto tre settimane a Firenze, da mia zia.',
    'Sono uscito tutte le sere e sono tornato a casa con tanti amici nuovi.',
  ],
  { from: 'Diego', title: 'Il mio primo viaggio' },
);

export const IT_A2_U02: ItUnitDef = {
  names: [
    'Madrid',
    'Londra',
    'Palermo',
    'Altoparlante',
    'Paolo',
    'Giulia',
    'Buenos Aires',
    'Laura',
    'Marta',
    'Ivan',
    'Etna',
    'Diego',
    'Firenze',
    'Sicilia',
  ],
  support: [
    'attenzione',
    'parte',
    'ritardo',
    'passeggeri',
    'devono',
    'andare',
    'gate',
    'del',
    'sfortuna',
    'sull',
    'cibo',
    'buonissimo',
    'torniamo',
    'volta',
    'zia',
    'tanti',
    'nuovi',
    'dall',
  ],
  unit: {
    position: 2,
    title: 'Viajes',
    titleEn: 'Viaggi',
    description:
      'Contar un viaje con el passato prossimo con essere (sono partito, siamo arrivati), entender el aeropuerto y decir hace cuánto pasó algo.',
    emoji: '✈️',
    objective:
      'Puedes contar un viaje (cuándo saliste y llegaste, dónde estuviste y cuánto te quedaste), entender anuncios del aeropuerto y decir hace cuánto pasó algo (due anni fa).',
    grammar: {
      title: 'Passato prossimo con essere',
      explanation:
        'Los verbos de movimiento y de cambio de lugar forman el passato prossimo con essere: andare, partire, arrivare, tornare, uscire, salire, scendere, rimanere. Con essere el participio concuerda como un adjetivo: sono arrivato (él), sono arrivata (ella), siamo arrivati, siamo arrivate. Essere y stare comparten participio: sono stato = «estuve» o «fui». Ojo: salire es «subir» y uscire es «salir». Fa después del tiempo es «hace»: due anni fa.',
      examples: [
        {
          target: 'Sono partita da Buenos Aires alle dieci.',
          base: 'Salí de Buenos Aires a las diez.',
        },
        {
          target: 'Siamo stati al mare tutti i giorni.',
          base: 'Estuvimos en el mar todos los días.',
        },
        { target: 'Sono salito sul treno due ore fa.', base: 'Subí al tren hace dos horas.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U2). Sin revisión nativa: revisar los anuncios del aeropuerto, salire in montagna / sull’Etna y da mia zia.',
    },
    words: [
      w(
        'it-sono-partito',
        'sono partito',
        'partí',
        'Sono partito alle dieci.',
        'Partí a las diez.',
        ['verbs', 'past', 'travel'],
        {
          acceptedTexts: ['sono partita'],
        },
      ),
      w(
        'it-sono-arrivato',
        'sono arrivato',
        'llegué',
        'Sono arrivato a Roma ieri.',
        'Llegué a Roma ayer.',
        ['verbs', 'past', 'travel'],
        {
          acceptedTexts: ['sono arrivata'],
        },
      ),
      w(
        'it-sono-tornato',
        'sono tornato',
        'volví',
        'Sono tornato a casa alle undici.',
        'Volví a casa a las once.',
        ['verbs', 'past', 'travel'],
        {
          acceptedTexts: ['sono tornata'],
          acceptedTranslations: ['regresé'],
        },
      ),
      w(
        'it-siamo-andati',
        'siamo andati',
        'fuimos',
        'Siamo andati al mare.',
        'Fuimos al mar.',
        ['verbs', 'past', 'travel'],
        {
          acceptedTexts: ['siamo andate'],
        },
      ),
      w(
        'it-sono-stato',
        'sono stato',
        'estuve',
        'Sono stato a Firenze.',
        'Estuve en Florencia.',
        ['verbs', 'past', 'travel'],
        {
          acceptedTexts: ['sono stata'],
        },
      ),
      w(
        'it-sono-rimasto',
        'sono rimasto',
        'me quedé',
        'Sono rimasto a casa.',
        'Me quedé en casa.',
        ['verbs', 'past'],
        {
          acceptedTexts: ['sono rimasta'],
        },
      ),
      w(
        'it-sono-uscito',
        'sono uscito',
        'salí',
        'Sono uscito con Sara.',
        'Salí con Sara.',
        ['verbs', 'past'],
        {
          acceptedTexts: ['sono uscita'],
        },
      ),
      w(
        'it-sono-salito',
        'sono salito',
        'subí',
        'Sono salito sul treno.',
        'Subí al tren.',
        ['verbs', 'past', 'travel'],
        {
          acceptedTexts: ['sono salita'],
        },
      ),
      w(
        'it-sono-sceso',
        'sono sceso',
        'bajé',
        'Sono sceso in piazza.',
        'Bajé en la plaza.',
        ['verbs', 'past', 'travel'],
        {
          acceptedTexts: ['sono scesa'],
          acceptedTranslations: ['me bajé'],
        },
      ),
      w('it-viaggio', 'viaggio', 'viaje', 'Il viaggio è lungo.', 'El viaje es largo.', ['travel'], {
        emoji: '🧭',
      }),
      w(
        'it-valigia',
        'valigia',
        'maleta',
        'La mia valigia è rossa.',
        'Mi maleta es roja.',
        ['travel'],
        {
          acceptedTranslations: ['maleta', 'valija'],
          emoji: '🧳',
        },
      ),
      w(
        'it-aereo',
        'aereo',
        'avión',
        'Vado a Roma in aereo.',
        'Voy a Roma en avión.',
        ['travel', 'transport'],
        { emoji: '✈️' },
      ),
      w(
        'it-aeroporto',
        'aeroporto',
        'aeropuerto',
        'L’aeroporto è lontano.',
        'El aeropuerto está lejos.',
        ['travel', 'places'],
        {
          emoji: '🛫',
        },
      ),
      w('it-volo', 'volo', 'vuelo', 'Il volo parte alle dieci.', 'El vuelo sale a las diez.', [
        'travel',
      ]),
      w(
        'it-vacanza',
        'vacanza',
        'vacaciones',
        'Sono in vacanza.',
        'Estoy de vacaciones.',
        ['travel', 'free-time'],
        {
          acceptedTexts: ['vacanze'],
        },
      ),
      w(
        'it-fa',
        'fa',
        'hace (… tiempo)',
        'Sono arrivato due giorni fa.',
        'Llegué hace dos días.',
        ['time'],
        {
          acceptedTranslations: ['hace'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Sono partito, sono arrivato',
        objective: 'Contar salidas y llegadas con essere.',
        intro: {
          explanation:
            'Con los verbos de movimiento (andare, partire, arrivare, tornare) el passato prossimo va con essere, y el participio concuerda como un adjetivo: sono arrivato (él), sono arrivata (ella), siamo arrivati.',
          examples: [
            { target: 'Sono arrivata a Roma ieri.', base: 'Llegué a Roma ayer.' },
            { target: 'Siamo andati a Napoli in treno.', base: 'Fuimos a Nápoles en tren.' },
          ],
        },
        takeaways: [
          'Usas essere con partire, arrivare, tornare y andare.',
          'Haces concordar el participio: arrivato, arrivata, arrivati.',
        ],
        exercises: [
          ex.translationChoice(
            'sono arrivato',
            'llegué',
            ['salí', 'volví', 'me quedé'],
            ['it-sono-arrivato'],
            { id: 'it.ex.vg4ck63ijcwrh1' },
          ),
          ex.matchPairs(
            [
              ['sono partito', 'partí'],
              ['sono arrivato', 'llegué'],
              ['sono tornato', 'volví'],
              ['siamo andati', 'fuimos'],
            ],
            ['it-sono-partito', 'it-sono-arrivato', 'it-sono-tornato', 'it-siamo-andati'],
            { id: 'it.ex.eqh5e0j5zbkvwt' },
          ),
          ex.listenChoice(
            'Sono arrivata a Roma ieri.',
            [
              'Sono arrivato a Roma ieri.',
              'Sono partita da Roma ieri.',
              'Sono arrivata a Roma oggi.',
            ],
            ['it-sono-arrivato', 'it-ieri'],
            { id: 'it.ex.rvyb9z79fmwk2b' },
          ),
          ex.fillBlank(
            'Giulia è ___ ieri.',
            'Giulia llegó ayer.',
            'arrivata',
            ['arrivato', 'arrivati', 'arrivate'],
            ['it-sono-arrivato'],
            {
              id: 'it.ex.bmix1aktl1jixi',
              explanation: 'Con essere el participio concuerda: Giulia è arrivata.',
            },
          ),
          ex.fillBlank(
            'Noi siamo ___ a Napoli in treno.',
            'Fuimos a Nápoles en tren.',
            'andati',
            ['andato', 'andata', 'andiamo'],
            ['it-siamo-andati', 'it-treno'],
            { id: 'it.ex.z9c8ma6hpk0os6' },
          ),
          ex.fillBlank(
            'Ieri ___ tornato a casa alle undici.',
            'Ayer volví a casa a las once.',
            'sono',
            ['ho', 'hai', 'siamo'],
            ['it-sono-tornato'],
            {
              id: 'it.ex.4rp1ets5jlu6ob',
              explanation: 'Tornare forma el pasado con essere: sono tornato.',
            },
          ),
          ex.orderWords(
            'Sono partito alle dieci di sera.',
            'Partí a las diez de la noche.',
            ['it-sono-partito'],
            { id: 'it.ex.bqc8zb5a2n5g1p' },
          ),
          ex.shortAnswer(
            'Quando sei arrivato?',
            '¿Cuándo llegaste? (Responde que llegaste ayer.)',
            'Sono arrivato ieri.',
            [
              'Sono arrivata ieri.',
              'Ieri.',
              'Sono arrivato ieri sera.',
              'Sono arrivata ieri sera.',
            ],
            ['it-sono-arrivato', 'it-ieri'],
            { id: 'it.ex.rar49246iauez8' },
          ),
          ex.translateWrite(
            'Volvimos a casa en tren.',
            'Siamo tornati a casa in treno.',
            ['it-sono-tornato', 'it-treno'],
            {
              id: 'it.ex.h0fh65zd6c5tin',
              acceptedAnswers: ['Siamo tornate a casa in treno.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: "Il viaggio, l'aeroporto",
        objective: 'Usar el vocabulario del viaje y entender anuncios del aeropuerto.',
        intro: {
          explanation:
            'Para viajar: il viaggio, la valigia (la maleta), l’aereo, l’aeroporto y il volo (el vuelo). En los anuncios vas a oír parte (sale) y in ritardo (demorado).',
          examples: [
            { target: 'Il volo parte alle undici.', base: 'El vuelo sale a las once.' },
            { target: 'La mia valigia è rossa.', base: 'Mi maleta es roja.' },
          ],
        },
        takeaways: [
          'Nombras el aereo, la valigia y il volo.',
          'Entiendes un anuncio de salida o de demora.',
        ],
        exercises: [
          ex.imageChoice('✈️', 'aereo', ['treno', 'valigia', 'volo'], ['it-aereo'], {
            id: 'it.ex.wzx9kzvzzm3hye',
          }),
          ex.imageChoice('🧳', 'valigia', ['aereo', 'aeroporto', 'viaggio'], ['it-valigia'], {
            id: 'it.ex.ldocyqj4q95rh5',
          }),
          ex.matchPairs(
            [
              ['viaggio', 'viaje'],
              ['aeroporto', 'aeropuerto'],
              ['valigia', 'maleta'],
              ['volo', 'vuelo'],
            ],
            ['it-viaggio', 'it-aeroporto', 'it-valigia', 'it-volo'],
            { id: 'it.ex.sw0qcmm9agm8i8' },
          ),
          ex.listenChoice(
            'Il volo parte alle undici.',
            [
              'Il volo parte alle dodici.',
              'Il treno parte alle undici.',
              'Il volo parte alle dieci.',
            ],
            ['it-volo'],
            { id: 'it.ex.dhutdplzgrua8b' },
          ),
          ex.fillBlank(
            "Ho preso l'___ per Roma.",
            'Tomé el avión a Roma.',
            'aereo',
            ['aeroporto', 'volo', 'valigia'],
            ['it-aereo', 'it-ho-preso'],
            {
              id: 'it.ex.scvtkra80fwbro',
              skill: 'vocabulary',
            },
          ),
          question(
            'it.ex.hi47p6ixsjoe1t',
            AEROPORTO,
            '¿A qué hora sale el vuelo a Madrid?',
            'A las once y media',
            ['A las doce', 'A las once y cuarto', 'Con una hora de demora'],
            ['it-volo'],
            'El anuncio dice: «Il volo per Madrid parte alle undici e mezza».',
          ),
          question(
            'it.ex.ry1ia0n1slzcyn',
            AEROPORTO,
            '¿Qué pasa con el vuelo a Londres?',
            'Está demorado una hora',
            ['Sale a las once', 'Está cancelado', 'Sale por la puerta doce'],
            ['it-volo'],
            'El anuncio dice: «Il volo per Londra è in ritardo di un’ora».',
          ),
          ex.shortAnswer(
            'Come sei andato a Roma?',
            '¿Cómo fuiste a Roma? (Responde que fuiste en avión.)',
            'Sono andato in aereo.',
            [
              'Sono andata in aereo.',
              'In aereo.',
              'Sono andato a Roma in aereo.',
              'Sono andata a Roma in aereo.',
            ],
            ['it-aereo', 'it-sono-andato'],
            { id: 'it.ex.9t3u4nq8j8w494' },
          ),
          ex.translateWrite(
            'Mi maleta es roja.',
            'La mia valigia è rossa.',
            ['it-valigia', 'it-rosso'],
            { id: 'it.ex.hi3d0t0pvj9rep' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Sono stato, sono rimasto',
        objective: 'Decir dónde estuviste y cuánto te quedaste.',
        intro: {
          explanation:
            'Essere y stare comparten participio: sono stato es «estuve» o «fui» (sono stato a Firenze). Rimanere (quedarse) da rimasto: sono rimasto a casa. Los dos van con essere.',
          examples: [
            {
              target: 'Siamo stati in vacanza in Sicilia.',
              base: 'Estuvimos de vacaciones en Sicilia.',
            },
            { target: 'Domenica sono rimasta a casa.', base: 'El domingo me quedé en casa.' },
          ],
        },
        takeaways: [
          'Dices dónde estuviste: sono stato / stata.',
          'Dices que te quedaste: sono rimasto / rimasta.',
        ],
        exercises: [
          ex.translationChoice(
            'sono stato',
            'estuve',
            ['estoy', 'era', 'me quedé'],
            ['it-sono-stato'],
            { id: 'it.ex.hknjlh1wmq11f3' },
          ),
          ex.translationChoice(
            'sono rimasto',
            'me quedé',
            ['me fui', 'volví', 'estuve'],
            ['it-sono-rimasto'],
            { id: 'it.ex.5w35hc5ouhpc6q' },
          ),
          ex.fillBlank(
            'Marco è ___ a Firenze tre settimane.',
            'Marco estuvo tres semanas en Florencia.',
            'stato',
            ['stata', 'stati', 'state'],
            ['it-sono-stato'],
            { id: 'it.ex.pysirwckrqpdao' },
          ),
          ex.fillBlank(
            'Domenica Paolo è ___ a casa.',
            'El domingo Paolo se quedó en casa.',
            'rimasto',
            ['partito', 'arrivato', 'tornato'],
            ['it-sono-rimasto'],
            {
              id: 'it.ex.8w13uitl159tvu',
              skill: 'vocabulary',
            },
          ),
          ex.listenChoice(
            'Siamo stati in vacanza in Sicilia.',
            [
              'Siamo andati in vacanza in Sicilia.',
              'Sono stato in vacanza in Sicilia.',
              'Siamo stati in vacanza a Roma.',
            ],
            ['it-sono-stato', 'it-vacanza'],
            { id: 'it.ex.qrfarg17ljtja4' },
          ),
          question(
            'it.ex.y4an8edgxw3j46',
            VIAGGIO,
            '¿Cómo fue el viaje de Giulia?',
            'Largo: salió de Buenos Aires a las diez de la noche',
            [
              'Corto y tranquilo',
              'Largo: salió de Roma a las cinco',
              'Cómodo: llegó la misma noche',
            ],
            ['it-sono-partito', 'it-viaggio'],
            'Giulia dice: «Lungo! Sono partita da Buenos Aires alle dieci di sera».',
          ),
          question(
            'it.ex.smd1jghmkpe9jf',
            VIAGGIO,
            '¿Qué problema tuvo Giulia?',
            'Su maleta llegó dos días después',
            ['Perdió el vuelo', 'Llegó dos días tarde', 'Se quedó en Buenos Aires'],
            ['it-valigia', 'it-sono-arrivato'],
            'Giulia dice: «la mia valigia è arrivata due giorni dopo!».',
          ),
          ex.orderWords(
            'Siamo stati in vacanza al mare.',
            'Estuvimos de vacaciones en el mar.',
            ['it-sono-stato', 'it-vacanza'],
            {
              id: 'it.ex.i6nbb4ld6o87x8',
            },
          ),
          ex.shortAnswer(
            'Dove sei stato in vacanza?',
            '¿Dónde estuviste de vacaciones? (Responde que estuviste en Sicilia.)',
            'Sono stato in Sicilia.',
            [
              'Sono stata in Sicilia.',
              'In Sicilia.',
              'Sono stato in vacanza in Sicilia.',
              'Sono stata in vacanza in Sicilia.',
            ],
            ['it-sono-stato'],
            { id: 'it.ex.vla2erg868ek0d' },
          ),
          ex.translateWrite('Me quedé en casa.', 'Sono rimasto a casa.', ['it-sono-rimasto'], {
            id: 'it.ex.33xc4d46w3443q',
            acceptedAnswers: ['Sono rimasta a casa.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Salire, scendere, uscire',
        objective: 'No confundir salire con «salir».',
        intro: {
          explanation:
            'Ojo con el falso amigo: salire es «subir» (sono salito sul treno) y scendere es «bajar» (sono sceso dall’autobus). «Salir» es uscire: sono uscito con gli amici. Todos van con essere.',
          examples: [
            { target: 'Sono salito sul treno a Milano.', base: 'Subí al tren en Milán.' },
            { target: 'Ieri sera sono uscita con Sara.', base: 'Anoche salí con Sara.' },
          ],
        },
        takeaways: ['Sabes que salire es «subir».', 'Dices «salí» con sono uscito / uscita.'],
        exercises: [
          ex.translationChoice(
            'sono salito',
            'subí',
            ['salí', 'bajé', 'llegué'],
            ['it-sono-salito'],
            {
              id: 'it.ex.ce4xl2p25wgs1u',
              explanation: 'Falso amigo: salire es «subir». «Salir» es uscire.',
            },
          ),
          ex.translationChoice(
            'sono uscito',
            'salí',
            ['subí', 'bajé', 'volví'],
            ['it-sono-uscito'],
            { id: 'it.ex.p3ds80tb8wsz8t' },
          ),
          ex.fillBlank(
            'Sono ___ sul treno a Milano.',
            'Subí al tren en Milán.',
            'salito',
            ['uscito', 'sceso', 'partito'],
            ['it-sono-salito', 'it-treno'],
            {
              id: 'it.ex.sveypxnn7ir8y5',
              skill: 'vocabulary',
            },
          ),
          ex.fillBlank(
            "Sono ___ dall'autobus in piazza.",
            'Me bajé del autobús en la plaza.',
            'sceso',
            ['salito', 'uscito', 'stato'],
            ['it-sono-sceso', 'it-autobus'],
            { id: 'it.ex.yxm7chzylrx9im', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'Ieri sera sono uscita con Sara.',
            [
              'Ieri sera sono uscito con Sara.',
              'Ieri sera sono salita con Sara.',
              'Ieri sono uscita con Sara.',
            ],
            ['it-sono-uscito', 'it-ieri-sera'],
            { id: 'it.ex.j9ioos0upj1a99' },
          ),
          question(
            'it.ex.iewlsmi2yiuvtp',
            CARTOLINA,
            '¿Qué hicieron Marta e Ivan ayer?',
            'Subieron al Etna',
            ['Salieron del Etna', 'Bajaron al mar', 'Volvieron a casa'],
            ['it-sono-salito'],
            'Escriben: «ieri siamo saliti sull’Etna!» (salire = subir).',
          ),
          question(
            'it.ex.ag2snctf00mw5q',
            CARTOLINA,
            '¿Dónde estuvieron todos los días?',
            'En el mar',
            ['En el Etna', 'En la casa de Laura', 'En Palermo, en el hotel'],
            ['it-sono-stato'],
            'Escriben: «Siamo stati al mare tutti i giorni».',
          ),
          question(
            'it.ex.kk03allgveo2kc',
            CARTOLINA,
            '¿Cuándo vuelven a casa?',
            'El domingo',
            ['El martes', 'Mañana', 'Dentro de un mes'],
            ['it-sono-tornato'],
            'Escriben: «Torniamo a casa domenica».',
          ),
          ex.shortAnswer(
            'Sei uscito ieri sera?',
            '¿Saliste anoche? (Responde que no, que te quedaste en casa.)',
            'No, sono rimasto a casa.',
            ['No, sono rimasta a casa.', 'Sono rimasto a casa.', 'Sono rimasta a casa.'],
            ['it-sono-rimasto', 'it-sono-uscito'],
            { id: 'it.ex.f7glb2e2zpa6fj' },
          ),
          ex.translateWrite(
            'Subimos a la montaña.',
            'Siamo saliti in montagna.',
            ['it-sono-salito', 'it-montagna'],
            {
              id: 'it.ex.vugquqirytq3vt',
              acceptedAnswers: ['Siamo salite in montagna.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Dieci anni fa',
        objective: 'Decir hace cuánto pasó algo y entender el relato de un viaje.',
        intro: {
          explanation:
            'Fa, después de una cantidad de tiempo, es «hace»: due anni fa (hace dos años), una settimana fa (hace una semana). Va al final: sono arrivato tre giorni fa.',
          examples: [
            {
              target: 'Sono andato in Italia dieci anni fa.',
              base: 'Fui a Italia hace diez años.',
            },
            { target: 'Siamo partiti due giorni fa.', base: 'Partimos hace dos días.' },
          ],
        },
        takeaways: ['Dices hace cuánto con … fa.', 'Entiendes un relato de viaje en pasado.'],
        exercises: [
          ex.translationChoice(
            'due anni fa',
            'hace dos años',
            ['dentro de dos años', 'dos años después', 'tiene dos años'],
            ['it-fa'],
            {
              id: 'it.ex.8ka9h9nq0n477u',
            },
          ),
          ex.fillBlank(
            'Sono andato in Italia tre anni ___.',
            'Fui a Italia hace tres años.',
            'fa',
            ['prima', 'dopo', 'già'],
            ['it-fa'],
            {
              id: 'it.ex.svjycpmk5kada9',
              explanation: '«Hace tres años» es tre anni fa: fa va al final.',
            },
          ),
          ex.listenChoice(
            'Sono arrivato una settimana fa.',
            [
              'Sono arrivato un mese fa.',
              'Sono partito una settimana fa.',
              'Sono tornato una settimana fa.',
            ],
            ['it-fa', 'it-sono-arrivato'],
            { id: 'it.ex.lcsnsk6dn4wq8c' },
          ),
          question(
            'it.ex.2daxqqfndrly8e',
            PRIMO,
            '¿Cuándo fue Diego a Italia por primera vez?',
            'Hace diez años',
            ['El año pasado', 'Hace tres semanas', 'Dentro de diez años'],
            ['it-fa'],
            'Diego escribe: «Dieci anni fa sono andato in Italia per la prima volta».',
          ),
          question(
            'it.ex.edifulg1dv2q0l',
            PRIMO,
            '¿Dónde se quedó?',
            'En Florencia, en la casa de su tía, tres semanas',
            ['En un hotel de Florencia', 'En Roma, tres días', 'En la casa de un amigo'],
            ['it-sono-rimasto'],
            'Diego escribe: «Sono rimasto tre settimane a Firenze, da mia zia».',
          ),
          question(
            'it.ex.gxzg887ezgv55r',
            PRIMO,
            '¿Qué se trajo Diego de ese viaje?',
            'Muchos amigos nuevos',
            ['Una maleta nueva', 'Muchos libros', 'Nada: no salió nunca'],
            ['it-sono-uscito', 'it-sono-tornato'],
            'Diego escribe: «Sono uscito tutte le sere e sono tornato a casa con tanti amici nuovi».',
          ),
          ex.orderWords(
            'Siamo partiti due giorni fa.',
            'Partimos hace dos días.',
            ['it-fa', 'it-sono-partito'],
            { id: 'it.ex.j5ei36zzle11sf' },
          ),
          ex.shortAnswer(
            'Quando sei arrivato in Italia?',
            '¿Cuándo llegaste a Italia? (Responde que llegaste hace dos semanas.)',
            'Sono arrivato due settimane fa.',
            [
              'Sono arrivata due settimane fa.',
              'Due settimane fa.',
              'Sono arrivato in Italia due settimane fa.',
              'Sono arrivata in Italia due settimane fa.',
            ],
            ['it-fa', 'it-sono-arrivato'],
            { id: 'it.ex.hrbv816flexplk' },
          ),
          ex.translateWrite(
            'Volví hace una semana.',
            'Sono tornato una settimana fa.',
            ['it-fa', 'it-sono-tornato'],
            {
              id: 'it.ex.r29n0v67g5v87m',
              acceptedAnswers: ['Sono tornata una settimana fa.'],
            },
          ),
        ],
      },
    ],
  },
};
