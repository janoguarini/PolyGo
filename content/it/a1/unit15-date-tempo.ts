import type { ItUnitDef } from '../../it-course';
import { dialogue, ex, IT_A1_RATE, question, reading, w } from '../helpers';

/**
 * Italiano A1 U15 «Fechas, meses y clima» (docs/IT_A1_A2.md): las decenas hasta cento, los meses
 * (en minúscula), la fecha (il 5 maggio, il primo maggio), el clima (fa caldo, piove, nevica, c'è il
 * sole) y las estaciones, con el contraste de hemisferios y fechas italianas (Ferragosto, Natale).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const METEO = dialogue(
  'it.stim.a1-u15-meteo',
  'El pronóstico del tiempo en una radio italiana.',
  [
    ['Radio', 'Buongiorno! Oggi a Milano piove e fa freddo.'],
    ['Radio', 'A Roma c’è il sole, ma c’è vento.'],
    ['Radio', 'Domani a Napoli fa caldo: venticinque gradi!'],
  ],
  IT_A1_RATE,
);

const INVITO = reading(
  'it.stim.a1-u15-invito',
  'message',
  'Chiara invita a sus amigos a su cumpleaños.',
  [
    'Ciao a tutti! Sabato 12 luglio è il mio compleanno.',
    'Facciamo una festa a casa mia, alle otto.',
    'Fa caldo: c’è anche la piscina!',
  ],
  { from: 'Chiara' },
);

const FERRAGOSTO = reading(
  'it.stim.a1-u15-ferragosto',
  'notice',
  'Un cartel en la puerta de una tienda de Florencia.',
  [
    'Il 15 agosto è Ferragosto.',
    'In Italia è festa: il negozio è chiuso.',
    'Fa molto caldo e molte famiglie sono in vacanza.',
    'Buone vacanze a tutti!',
  ],
  { title: 'Chiuso per Ferragosto' },
);

const STAGIONI = dialogue(
  'it.stim.a1-u15-stagioni',
  'Giulia, en Turín, habla por video con Pablo, en Buenos Aires, en diciembre.',
  [
    ['Giulia', 'Ciao Pablo! Che tempo fa a Buenos Aires?'],
    ['Pablo', 'Fa caldo! A dicembre qui è estate.'],
    ['Giulia', 'Qui a Torino è inverno: fa freddo e nevica!'],
    ['Pablo', 'Che bello! A Buenos Aires non nevica mai.'],
  ],
  IT_A1_RATE,
);

export const IT_A1_U15: ItUnitDef = {
  names: [
    'Milano',
    'Chiara',
    'Ferragosto',
    'Giulia',
    'Pablo',
    'Buenos Aires',
    'Torino',
    'Natale',
    'Radio',
  ],
  support: [
    'vento',
    'venticinque',
    'gradi',
    'facciamo',
    'festa',
    'piscina',
    'chiuso',
    'vacanza',
    'vacanze',
    'buone',
    'mai',
    'primavera',
    'anno',
    'su',
  ],
  unit: {
    position: 15,
    title: 'Fechas, meses y clima',
    titleEn: 'Date e tempo',
    description:
      'Contar hasta cien, decir la fecha y tu cumpleaños, preguntar qué tiempo hace y hablar de las estaciones.',
    emoji: '📅',
    objective:
      'Puedes decir la fecha y cuándo es tu cumpleaños, contar hasta cien y decir qué tiempo hace (fa caldo, piove, nevica) en cada estación.',
    grammar: {
      title: 'La fecha · fare con el clima',
      explanation:
        'La fecha va con il + número + mes, y los meses en minúscula: il 5 maggio. El día 1 se dice con el ordinal: il primo maggio. «En mayo» es a maggio o in maggio. Para el clima se usa fare: fa caldo, fa freddo; y también piove, nevica, c’è il sole. Ojo: fa caldo es «hace calor» (caldo no es el caldo). L’estate (el verano) es femenino.',
      examples: [
        { target: 'Il mio compleanno è il primo maggio.', base: 'Mi cumpleaños es el 1 de mayo.' },
        {
          target: 'Che tempo fa? — Piove e fa freddo.',
          base: '¿Qué tiempo hace? — Llueve y hace frío.',
        },
        { target: "D'estate fa caldo.", base: 'En verano hace calor.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U15). Sin revisión nativa: revisar a / in + mes, d’estate / in estate y el cartel de Ferragosto.',
    },
    words: [
      w(
        'it-cinquanta',
        'cinquanta',
        'cincuenta',
        'Mio padre ha cinquanta anni.',
        'Mi papá tiene cincuenta años.',
        ['numbers'],
      ),
      w(
        'it-cento',
        'cento',
        'cien',
        'Il biglietto costa cento euro.',
        'El boleto cuesta cien euros.',
        ['numbers'],
        {
          acceptedTranslations: ['ciento'],
        },
      ),
      w('it-mese', 'mese', 'mes', 'Gennaio è un mese freddo.', 'Enero es un mes frío.', ['dates']),
      w('it-gennaio', 'gennaio', 'enero', 'A gennaio fa freddo.', 'En enero hace frío.', ['dates']),
      w('it-maggio', 'maggio', 'mayo', 'Il primo maggio è festa.', 'El 1 de mayo es feriado.', [
        'dates',
      ]),
      w('it-luglio', 'luglio', 'julio', 'A luglio fa caldo.', 'En julio hace calor.', ['dates']),
      w(
        'it-agosto',
        'agosto',
        'agosto',
        'Il 15 agosto è Ferragosto.',
        'El 15 de agosto es Ferragosto.',
        ['dates'],
      ),
      w(
        'it-dicembre',
        'dicembre',
        'diciembre',
        'Il 25 dicembre è Natale.',
        'El 25 de diciembre es Navidad.',
        ['dates'],
      ),
      w(
        'it-compleanno',
        'compleanno',
        'cumpleaños',
        'Il mio compleanno è a luglio.',
        'Mi cumpleaños es en julio.',
        ['dates'],
        { emoji: '🎂' },
      ),
      w(
        'it-il-primo',
        'il primo',
        'el primero (del mes)',
        'Il primo gennaio è festa.',
        'El 1 de enero es feriado.',
        ['dates'],
        {
          acceptedTranslations: ['el primero', 'el 1', 'el uno'],
        },
      ),
      w(
        'it-che-tempo-fa',
        'che tempo fa?',
        '¿qué tiempo hace?',
        'Che tempo fa a Roma?',
        '¿Qué tiempo hace en Roma?',
        ['weather', 'questions'],
        {
          acceptedTranslations: ['¿cómo está el tiempo?'],
        },
      ),
      w('it-fa-caldo', 'fa caldo', 'hace calor', 'Oggi fa caldo.', 'Hoy hace calor.', ['weather'], {
        emoji: '🌡️',
      }),
      w('it-fa-freddo', 'fa freddo', 'hace frío', 'A gennaio fa freddo.', 'En enero hace frío.', [
        'weather',
      ]),
      w('it-piove', 'piove', 'llueve', 'Oggi piove.', 'Hoy llueve.', ['weather'], {
        acceptedTranslations: ['está lloviendo'],
        emoji: '🌧️',
      }),
      w('it-nevica', 'nevica', 'nieva', 'A Torino nevica.', 'En Turín nieva.', ['weather'], {
        acceptedTranslations: ['está nevando'],
        emoji: '❄️',
      }),
      w(
        'it-c-e-il-sole',
        "c'è il sole",
        'hay sol',
        "Oggi c'è il sole.",
        'Hoy hay sol.',
        ['weather'],
        {
          acceptedTexts: ['c’è il sole'],
          acceptedTranslations: ['está soleado', 'sale el sol'],
          emoji: '☀️',
        },
      ),
      w(
        'it-estate',
        "l'estate",
        'el verano',
        "L'estate è bella.",
        'El verano es lindo.',
        ['weather', 'dates'],
        {
          acceptedTexts: ['l’estate', 'estate'],
          acceptedTranslations: ['verano'],
          emoji: '🏖️',
        },
      ),
      w(
        'it-inverno',
        "l'inverno",
        'el invierno',
        "L'inverno è freddo.",
        'El invierno es frío.',
        ['weather', 'dates'],
        {
          acceptedTexts: ['l’inverno', 'inverno'],
          acceptedTranslations: ['invierno'],
          emoji: '⛄',
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Trenta, cinquanta, cento',
        objective: 'Contar de diez en diez hasta cien.',
        intro: {
          explanation:
            'Las decenas: venti, trenta, quaranta, cinquanta… ottanta, cento. Con uno y otto la decena pierde la última vocal: ventuno, trentotto. Cien es cento, sin cambios: cento euro.',
          examples: [
            { target: 'Mio padre ha cinquanta anni.', base: 'Mi papá tiene cincuenta años.' },
            { target: 'Il biglietto costa cento euro.', base: 'El boleto cuesta cien euros.' },
          ],
        },
        takeaways: ['Cuentas de diez en diez hasta cento.', 'Dices edades y precios más grandes.'],
        exercises: [
          ex.translationChoice(
            'cinquanta',
            'cincuenta',
            ['quince', 'cinco', 'quinientos'],
            ['it-cinquanta'],
            { id: 'it.ex.dhtjivmsaov4zk' },
          ),
          ex.translationChoice('cento', 'cien', ['cinco', 'cincuenta', 'mil'], ['it-cento'], {
            id: 'it.ex.dxvneecmfnos9k',
          }),
          ex.matchPairs(
            [
              ['venti', 'veinte'],
              ['trenta', 'treinta'],
              ['cinquanta', 'cincuenta'],
              ['cento', 'cien'],
            ],
            ['it-venti', 'it-cinquanta', 'it-cento'],
            { id: 'it.ex.y9cvwibt010vi9' },
          ),
          ex.listenChoice(
            'Mio nonno ha ottanta anni.',
            ['Mio nonno ha trenta anni.', 'Mia nonna ha ottanta anni.', 'Mio nonno ha otto anni.'],
            ['it-nonno', 'it-anni'],
            { id: 'it.ex.8usfa2ut2mqy8a' },
          ),
          ex.fillBlank(
            'Mia madre ha ___ anni.',
            'Mi mamá tiene cincuenta años.',
            'cinquanta',
            ['cinque', 'quindici', 'cento'],
            ['it-cinquanta', 'it-madre'],
            { id: 'it.ex.nq46y5mzrqfbyp', skill: 'vocabulary' },
          ),
          ex.listenChoice(
            'Costa cento euro.',
            ['Costa venti euro.', 'Costa cinque euro.', 'Costano cento euro.'],
            ['it-cento', 'it-quanto-costa'],
            { id: 'it.ex.koonzjovxjaha8' },
          ),
          ex.orderWords(
            'Il biglietto costa cento euro.',
            'El boleto cuesta cien euros.',
            ['it-cento', 'it-biglietto'],
            {
              id: 'it.ex.1xi5a55no1easp',
            },
          ),
          ex.shortAnswer(
            'Quanti anni ha tuo padre?',
            '¿Cuántos años tiene tu papá? (Responde que tiene cincuenta años.)',
            'Ha cinquanta anni.',
            ['Mio padre ha cinquanta anni.', 'Cinquanta anni.', 'Cinquanta.'],
            ['it-cinquanta', 'it-ha'],
            { id: 'it.ex.to8ej0wrx7nrmw' },
          ),
          ex.translateWrite('Cuesta cien euros.', 'Costa cento euro.', ['it-cento'], {
            id: 'it.ex.qjabs9ecjifx1a',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Il primo maggio',
        objective: 'Decir la fecha y cuándo es tu cumpleaños.',
        intro: {
          explanation:
            'Los meses van en minúscula: gennaio, maggio, luglio, agosto, dicembre. La fecha es il + número + mes: il 12 luglio. El día 1 usa el ordinal: il primo maggio. «En julio» es a luglio o in luglio.',
          examples: [
            {
              target: 'Il mio compleanno è il primo maggio.',
              base: 'Mi cumpleaños es el 1 de mayo.',
            },
            { target: 'Il mio compleanno è a luglio.', base: 'Mi cumpleaños es en julio.' },
          ],
        },
        takeaways: [
          'Dices la fecha con il + número + mes (il primo para el 1).',
          'Dices en qué mes es algo: a luglio, in luglio.',
        ],
        exercises: [
          ex.translationChoice('gennaio', 'enero', ['junio', 'julio', 'mayo'], ['it-gennaio'], {
            id: 'it.ex.qm48bu5vhmibp7',
          }),
          ex.matchPairs(
            [
              ['gennaio', 'enero'],
              ['maggio', 'mayo'],
              ['luglio', 'julio'],
              ['mese', 'mes'],
            ],
            ['it-gennaio', 'it-maggio', 'it-luglio', 'it-mese'],
            { id: 'it.ex.pplyaki9kphnlk' },
          ),
          ex.translationChoice(
            'compleanno',
            'cumpleaños',
            ['aniversario', 'fiesta', 'año'],
            ['it-compleanno'],
            { id: 'it.ex.zirgzewrk8isen' },
          ),
          ex.listenChoice(
            'Il mio compleanno è il primo maggio.',
            [
              'Il mio compleanno è il primo luglio.',
              'Il tuo compleanno è il primo maggio?',
              'Il mio compleanno è a maggio.',
            ],
            ['it-compleanno', 'it-il-primo', 'it-maggio'],
            { id: 'it.ex.uauzjtfmm0ppaz' },
          ),
          ex.fillBlank(
            'Il mio compleanno è il ___ gennaio.',
            'Mi cumpleaños es el 1 de enero.',
            'primo',
            ['uno', 'prima', 'un'],
            ['it-il-primo', 'it-gennaio'],
            {
              id: 'it.ex.hh0kiaibxjtmd9',
              explanation: 'El día 1 del mes se dice con el ordinal: il primo gennaio.',
            },
          ),
          ex.fillBlank(
            'Il compleanno di Marco è ___ agosto.',
            'El cumpleaños de Marco es en agosto.',
            'in',
            ['su', 'da', 'per'],
            ['it-agosto', 'it-compleanno'],
            { id: 'it.ex.87hpm2awnx04tj', explanation: '«En agosto» es in agosto (o ad agosto).' },
          ),
          question(
            'it.ex.ngg3h47q0mirop',
            INVITO,
            '¿Cuándo es la fiesta de Chiara?',
            'El sábado 12 de julio, a las ocho',
            [
              'El domingo 12 de junio, a las ocho',
              'El sábado 1 de julio, a la una',
              'El 12 de agosto, a la noche',
            ],
            ['it-compleanno', 'it-luglio'],
            'Chiara escribe: «Sabato 12 luglio è il mio compleanno» y «alle otto».',
          ),
          question(
            'it.ex.c8v5xpaedhj7we',
            INVITO,
            '¿Por qué la piscina es una buena idea?',
            'Porque hace calor',
            ['Porque llueve', 'Porque hace frío', 'Porque es invierno'],
            ['it-fa-caldo'],
            'Chiara escribe: «Fa caldo: c’è anche la piscina!».',
          ),
          ex.shortAnswer(
            'Quando è il tuo compleanno?',
            '¿Cuándo es tu cumpleaños? (Responde que es el 1 de mayo.)',
            'Il mio compleanno è il primo maggio.',
            ['È il primo maggio.', 'Il primo maggio.'],
            ['it-compleanno', 'it-il-primo', 'it-maggio'],
            { id: 'it.ex.0qvtdq4hct9ekk' },
          ),
          ex.translateWrite(
            'Mi cumpleaños es en enero.',
            'Il mio compleanno è a gennaio.',
            ['it-compleanno', 'it-gennaio'],
            {
              id: 'it.ex.v1d4u0q4mx98fp',
              acceptedAnswers: ['Il mio compleanno è in gennaio.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Che tempo fa?',
        objective: 'Preguntar y decir qué tiempo hace.',
        intro: {
          explanation:
            'Che tempo fa? es «¿qué tiempo hace?». Con fare: fa caldo, fa freddo. Sin fare: piove (llueve), nevica (nieva), c’è il sole (hay sol). Ojo: fa caldo es «hace calor», no tiene que ver con el caldo.',
          examples: [
            { target: 'Che tempo fa? — Fa caldo.', base: '¿Qué tiempo hace? — Hace calor.' },
            { target: 'Oggi piove e fa freddo.', base: 'Hoy llueve y hace frío.' },
          ],
        },
        takeaways: [
          'Preguntas che tempo fa?',
          'Dices fa caldo, fa freddo, piove, nevica y c’è il sole.',
        ],
        exercises: [
          ex.translationChoice(
            'che tempo fa?',
            '¿qué tiempo hace?',
            ['¿qué hora es?', '¿cuánto tiempo?', '¿qué haces?'],
            ['it-che-tempo-fa'],
            {
              id: 'it.ex.nx0d2mkypr8npv',
            },
          ),
          ex.imageChoice('🌧️', 'piove', ['nevica', 'fa caldo', "c'è il sole"], ['it-piove'], {
            id: 'it.ex.fxuz424nlvngw7',
          }),
          ex.imageChoice(
            '☀️',
            "c'è il sole",
            ['piove', 'nevica', 'fa freddo'],
            ['it-c-e-il-sole'],
            { id: 'it.ex.783plb90t8qotc' },
          ),
          ex.listenChoice(
            'Oggi piove e fa freddo.',
            ['Oggi piove e fa caldo.', 'Domani piove e fa freddo.', 'Oggi nevica e fa freddo.'],
            ['it-piove', 'it-fa-freddo'],
            { id: 'it.ex.ohjm59s515mb1j' },
          ),
          ex.fillBlank(
            'Oggi ___ caldo.',
            'Hoy hace calor.',
            'fa',
            ['ha', 'è', 'ho'],
            ['it-fa-caldo'],
            {
              id: 'it.ex.q2ssdqeifvr8og',
              explanation: 'El clima va con fare: fa caldo. Ho caldo es «tengo calor».',
            },
          ),
          ex.fillBlank(
            'A gennaio a Torino ___.',
            'En enero en Turín nieva.',
            'nevica',
            ['fa caldo', "c'è il sole", 'ho freddo'],
            ['it-nevica', 'it-gennaio'],
            { id: 'it.ex.os978mshoepeoh', skill: 'vocabulary' },
          ),
          question(
            'it.ex.e0r779tckvrxr1',
            METEO,
            '¿Qué tiempo hace hoy en Milán?',
            'Llueve y hace frío',
            ['Hay sol y hace calor', 'Nieva', 'Hay viento y sol'],
            ['it-piove', 'it-fa-freddo'],
            'La radio dice: «Oggi a Milano piove e fa freddo».',
          ),
          question(
            'it.ex.srrbnque7efz0c',
            METEO,
            '¿Qué tiempo va a hacer mañana en Nápoles?',
            'Calor: veinticinco grados',
            ['Frío: cinco grados', 'Lluvia y viento', 'Nieve'],
            ['it-fa-caldo'],
            'La radio dice: «Domani a Napoli fa caldo: venticinque gradi!».',
          ),
          ex.shortAnswer(
            'Che tempo fa oggi?',
            '¿Qué tiempo hace hoy? (Responde que hace frío y llueve.)',
            'Fa freddo e piove.',
            ['Oggi fa freddo e piove.', 'Piove e fa freddo.', 'Oggi piove e fa freddo.'],
            ['it-fa-freddo', 'it-piove'],
            { id: 'it.ex.5v8us9xboczwer' },
          ),
          ex.translateWrite(
            'Hace calor y hay sol.',
            "Fa caldo e c'è il sole.",
            ['it-fa-caldo', 'it-c-e-il-sole'],
            {
              id: 'it.ex.jbnl6zjzndwdzh',
              acceptedAnswers: ['Fa caldo e c’è il sole.', "Oggi fa caldo e c'è il sole."],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: "L'estate e l'inverno",
        objective: 'Hablar de las estaciones y del clima en cada una.',
        intro: {
          explanation:
            "Las estaciones: la primavera, l'estate (el verano, femenino), l'autunno y l'inverno. «En verano» es d'estate o in estate. Y recuerda: en la Argentina diciembre es verano; en Italia, invierno.",
          examples: [
            { target: "D'estate fa caldo.", base: 'En verano hace calor.' },
            {
              target: 'A dicembre in Italia è inverno.',
              base: 'En diciembre en Italia es invierno.',
            },
          ],
        },
        takeaways: ["Nombras l'estate y l'inverno.", 'Comparas el clima de los dos hemisferios.'],
        exercises: [
          ex.translationChoice(
            "l'estate",
            'el verano',
            ['el invierno', 'el estado', 'la estación'],
            ['it-estate'],
            {
              id: 'it.ex.u66gkslsrfjsit',
              explanation: "L'estate es «el verano» y es femenino: l'estate è calda.",
            },
          ),
          ex.translationChoice(
            "l'inverno",
            'el invierno',
            ['el verano', 'el infierno', 'la primavera'],
            ['it-inverno'],
            {
              id: 'it.ex.wq3ne2spmhi1tv',
            },
          ),
          ex.listenChoice(
            "D'estate fa caldo.",
            ["D'inverno fa caldo.", "D'estate fa freddo.", "D'estate piove."],
            ['it-estate', 'it-fa-caldo'],
            { id: 'it.ex.svfnkk0b1nymu3' },
          ),
          ex.fillBlank(
            'In Italia a dicembre è ___.',
            'En Italia en diciembre es invierno.',
            'inverno',
            ['estate', 'primavera', 'mese'],
            ['it-inverno', 'it-dicembre'],
            { id: 'it.ex.2xr06c61chs7uc', skill: 'vocabulary' },
          ),
          question(
            'it.ex.ardbrfgc52wxov',
            STAGIONI,
            '¿Qué estación es en Buenos Aires?',
            'Verano: hace calor',
            ['Invierno: hace frío', 'Primavera: llueve', 'Invierno: nieva'],
            ['it-estate', 'it-fa-caldo'],
            'Pablo dice: «Fa caldo! A dicembre qui è estate».',
          ),
          question(
            'it.ex.pv9c7bvoo6r08z',
            STAGIONI,
            '¿Qué tiempo hace en Turín?',
            'Hace frío y nieva',
            ['Hace calor y hay sol', 'Llueve, pero no hace frío', 'Hace calor y llueve'],
            ['it-inverno', 'it-nevica'],
            'Giulia dice: «Qui a Torino è inverno: fa freddo e nevica!».',
          ),
          question(
            'it.ex.ntqe0v993y1dlx',
            STAGIONI,
            '¿Qué no pasa nunca en Buenos Aires, según Pablo?',
            'No nieva',
            ['No llueve', 'No hace calor', 'No hay sol'],
            ['it-nevica'],
            'Pablo dice: «A Buenos Aires non nevica mai».',
          ),
          ex.orderWords(
            'A luglio in Argentina è inverno.',
            'En julio en la Argentina es invierno.',
            ['it-luglio', 'it-inverno'],
            {
              id: 'it.ex.a4dhwcguseck95',
            },
          ),
          ex.shortAnswer(
            "Ti piace l'inverno?",
            '¿Te gusta el invierno? (Responde que no, que te gusta el verano.)',
            "No, mi piace l'estate.",
            [
              'No, mi piace l’estate.',
              "Non mi piace l'inverno, mi piace l'estate.",
              "Mi piace l'estate.",
            ],
            ['it-estate', 'it-mi-piace'],
            { id: 'it.ex.n1g6oqxpjz9wk8' },
          ),
          ex.translateWrite(
            'En invierno hace frío.',
            "D'inverno fa freddo.",
            ['it-inverno', 'it-fa-freddo'],
            {
              id: 'it.ex.oipfypvfdnmxbb',
              acceptedAnswers: ['D’inverno fa freddo.', 'In inverno fa freddo.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Ferragosto',
        objective: 'Entender fechas y avisos de días especiales en Italia.',
        intro: {
          explanation:
            'Fechas que vas a ver en Italia: il primo maggio, Ferragosto (il 15 agosto, en pleno verano) y Natale (il 25 dicembre). Esos días muchos negocios están cerrados: chiuso.',
          examples: [
            { target: 'Il 15 agosto è Ferragosto.', base: 'El 15 de agosto es Ferragosto.' },
            { target: 'Il primo maggio è festa.', base: 'El 1 de mayo es feriado.' },
          ],
        },
        takeaways: [
          'Entiendes un aviso de cierre por un feriado.',
          'Dices fechas especiales del año.',
        ],
        exercises: [
          ex.listenChoice(
            'Il quindici agosto è Ferragosto.',
            [
              'Il quindici luglio è Ferragosto.',
              'Il cinque agosto è Ferragosto.',
              'Il quindici agosto è Natale.',
            ],
            ['it-agosto'],
            { id: 'it.ex.pbzwkne9j9ebkw' },
          ),
          ex.fillBlank(
            '___ 15 agosto è Ferragosto.',
            'El 15 de agosto es Ferragosto.',
            'Il',
            ['La', 'Lo', 'Un'],
            ['it-agosto'],
            {
              id: 'it.ex.hd0z4x2wgp1b8c',
              explanation: 'Las fechas llevan il: il 15 agosto, il primo maggio.',
            },
          ),
          ex.translationChoice(
            'il primo',
            'el primero (del mes)',
            ['el primo', 'el último', 'el segundo'],
            ['it-il-primo'],
            {
              id: 'it.ex.luth9m5jwi4igc',
            },
          ),
          question(
            'it.ex.b0nac47juoj7kd',
            FERRAGOSTO,
            '¿Por qué está cerrada la tienda?',
            'Porque el 15 de agosto es feriado',
            ['Porque es domingo', 'Porque llueve', 'Porque es Navidad'],
            ['it-agosto'],
            'El cartel dice: «Il 15 agosto è Ferragosto. In Italia è festa: il negozio è chiuso».',
          ),
          question(
            'it.ex.kya98jrju5yxka',
            FERRAGOSTO,
            '¿Qué tiempo hace en Ferragosto, según el cartel?',
            'Mucho calor',
            ['Mucho frío', 'Llueve', 'Nieva'],
            ['it-fa-caldo'],
            'El cartel dice: «Fa molto caldo».',
          ),
          question(
            'it.ex.ao47tkp8ktuaaj',
            FERRAGOSTO,
            '¿Qué hacen muchas familias?',
            'Están de vacaciones',
            ['Trabajan en la tienda', 'Van a la escuela', 'Están en casa por la lluvia'],
            ['it-estate'],
            'El cartel dice: «molte famiglie sono in vacanza».',
          ),
          ex.orderWords(
            'Il primo maggio è festa.',
            'El 1 de mayo es feriado.',
            ['it-il-primo', 'it-maggio'],
            { id: 'it.ex.6cqjf0y53fn9xc' },
          ),
          ex.shortAnswer(
            'Che tempo fa a Ferragosto?',
            '¿Qué tiempo hace en Ferragosto? (Responde que hace mucho calor.)',
            'Fa molto caldo.',
            ['A Ferragosto fa molto caldo.', 'Fa caldo.'],
            ['it-fa-caldo'],
            { id: 'it.ex.fhy7rpv9leot9p' },
          ),
          ex.translateWrite(
            'El 25 de diciembre es Navidad.',
            'Il 25 dicembre è Natale.',
            ['it-dicembre'],
            {
              id: 'it.ex.mravqzrt5czgxz',
              acceptedAnswers: ['Il venticinque dicembre è Natale.'],
            },
          ),
        ],
      },
    ],
  },
};
