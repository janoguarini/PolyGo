import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, PT_A1_RATE, question, reading, w } from '../helpers';

/**
 * PT-BR A1 U16 «Transporte y tiempo libre» (docs/PT_A1_A2.md): ir de + transporte (de ônibus, de
 * carro, a pé), las contracciones ao / à y pelo / pela, fazer (faço, faz, fazemos) e ir en plural
 * (vamos, vão) para proponer planes. Falso amigo: pelo es «por el» (el pelo es cabelo).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const SABADO = dialogue(
  'pt.stim.a1-u16-sabado',
  'Dos amigos arreglan qué hacer el sábado.',
  [
    ['Léo', 'O que você faz no sábado?'],
    ['Nina', 'Nada! Vamos ao cinema?'],
    ['Léo', 'Vamos! A gente vai de metrô?'],
    ['Nina', 'Não, vamos a pé. O cinema é perto.'],
  ],
  PT_A1_RATE,
);

const CAMINHO = reading(
  'pt.stim.a1-u16-caminho',
  'directions',
  'Una amiga le explica a Sofia cómo llegar a su casa.',
  [
    'Sofia, para chegar na minha casa você pega o ônibus 42 na estação.',
    'O ônibus passa pela praça e pelo mercado.',
    'Você desce no ponto da padaria e vai a pé: são cinco minutos.',
  ],
  { from: 'Clara', to: 'Sofia' },
);

const DOMINGO = reading(
  'pt.stim.a1-u16-domingo',
  'post',
  'Un chico de Río cuenta qué hace su familia los domingos.',
  [
    'Domingo é o nosso dia de tempo livre.',
    'De manhã a gente passeia de bicicleta pela praia.',
    'Os meus pais vão ao mercado e eu faço o almoço.',
    'À noite nós vamos ao cinema ou assistimos a um filme em casa.',
  ],
  { from: 'Gabriel', title: 'Domingo no Rio' },
);

export const PT_A1_U16: PtUnitDef = {
  names: ['Léo', 'Nina', 'Sofia', 'Clara', 'Gabriel', 'Rio', 'São Paulo'],
  support: [
    'mercado',
    'passa',
    'chegar',
    'pega',
    'desce',
    'fazem',
    'jantar',
    'fazer',
    'juntos',
    'ou',
    'assistimos',
    'rápido',
  ],
  unit: {
    position: 16,
    title: 'Transporte y tiempo libre',
    titleEn: 'Transporte e lazer',
    description:
      'Ir de ônibus, de carro o a pé; las contracciones ao, à, pelo y pela; fazer e ir en plural para proponer planes.',
    emoji: '🚲',
    objective:
      'Podés decir cómo vas a un lugar, por dónde pasa el colectivo, qué hacés en tu tiempo libre y proponer un plan con vamos…?',
    grammar: {
      title: 'Ir de + transporte · ao, à, pelo, pela · fazer',
      explanation:
        'El transporte va con de (no con «en»): vou de ônibus, de carro, de metrô; caminando es a pé. A + o = ao y a + a = à: vou ao cinema, vou à praia. Por + o = pelo y por + a = pela: passo pela praça. Fazer: eu faço, você / ele faz, nós fazemos. Ir: nós vamos, eles vão.',
      examples: [
        { target: 'Eu vou para a escola de ônibus.', base: 'Voy a la escuela en colectivo.' },
        { target: 'Vamos ao cinema?', base: '¿Vamos al cine?' },
        { target: 'O ônibus passa pela praça.', base: 'El colectivo pasa por la plaza.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'A1 nuevo (U16). Sin revisión nativa: revisar ir de, las contracciones y chegar na.',
    },
    words: [
      w('pt-carro', 'carro', 'auto', 'Eu vou de carro.', 'Voy en auto.', ['transport'], {
        acceptedTranslations: ['coche'],
        emoji: '🚗',
      }),
      w('pt-metro', 'metrô', 'subte', 'A gente vai de metrô.', 'Vamos en subte.', ['transport'], {
        emoji: '🚇',
      }),
      w(
        'pt-bicicleta',
        'bicicleta',
        'bicicleta',
        'Eu vou de bicicleta.',
        'Voy en bicicleta.',
        ['transport'],
        {
          emoji: '🚲',
        },
      ),
      w(
        'pt-a-pe',
        'a pé',
        'a pie / caminando',
        'A escola é perto: vou a pé.',
        'La escuela está cerca: voy caminando.',
        ['transport'],
        {
          acceptedTranslations: ['a pie', 'caminando'],
          emoji: '🚶',
        },
      ),
      w(
        'pt-aviao',
        'avião',
        'avión',
        'Vamos para Recife de avião.',
        'Vamos a Recife en avión.',
        ['transport'],
        {
          emoji: '✈️',
        },
      ),
      w('pt-trem', 'trem', 'tren', 'O trem é rápido.', 'El tren es rápido.', ['transport'], {
        emoji: '🚆',
      }),
      w('pt-ao', 'ao', 'al (a + o)', 'Vou ao cinema.', 'Voy al cine.', ['contractions'], {
        acceptedTranslations: ['al'],
      }),
      w(
        'pt-pelo',
        'pelo',
        'por el (por + o)',
        'Passeio pelo centro.',
        'Paseo por el centro.',
        ['contractions'],
        {
          acceptedTranslations: ['por el'],
        },
      ),
      w(
        'pt-pela',
        'pela',
        'por la (por + a)',
        'O ônibus passa pela praça.',
        'El colectivo pasa por la plaza.',
        ['contractions'],
        {
          acceptedTranslations: ['por la'],
        },
      ),
      w('pt-cinema', 'cinema', 'cine', 'Vamos ao cinema?', '¿Vamos al cine?', ['free-time'], {
        emoji: '🎬',
      }),
      w(
        'pt-passear',
        'passear',
        'pasear',
        'Eu gosto de passear pela praia.',
        'Me gusta pasear por la playa.',
        ['free-time'],
        {
          acceptedTexts: ['passeio', 'passeia'],
        },
      ),
      w(
        'pt-tempo-livre',
        'tempo livre',
        'tiempo libre',
        'O que você faz no seu tempo livre?',
        '¿Qué hacés en tu tiempo libre?',
        ['free-time'],
      ),
      w('pt-faco', 'faço', 'hago', 'Eu faço o almoço.', 'Yo hago el almuerzo.', ['verbs']),
      w(
        'pt-faz',
        'faz',
        'hace / hacés (con você)',
        'O que ele faz no sábado?',
        '¿Qué hace él el sábado?',
        ['verbs'],
        {
          acceptedTranslations: ['hace', 'hacés'],
        },
      ),
      w(
        'pt-fazemos',
        'fazemos',
        'hacemos',
        'Nós fazemos o jantar juntos.',
        'Hacemos la cena juntos.',
        ['verbs'],
      ),
      w('pt-vamos', 'vamos', 'vamos', 'Vamos à praia?', '¿Vamos a la playa?', ['verbs']),
      w('pt-vao', 'vão', 'van', 'Eles vão de trem.', 'Ellos van en tren.', ['verbs']),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'De ônibus, de carro, a pé',
        objective: 'Decir cómo vas a un lugar.',
        intro: {
          explanation:
            'En portugués el transporte va con de, no con «en»: vou de ônibus, de carro, de metrô, de bicicleta. Caminando se dice a pé.',
          examples: [
            { target: 'Eu vou para a escola de ônibus.', base: 'Voy a la escuela en colectivo.' },
            {
              target: 'A padaria é perto: vou a pé.',
              base: 'La panadería está cerca: voy caminando.',
            },
          ],
        },
        takeaways: ['Decís cómo vas: de ônibus, de carro, a pé.', 'Nombrás medios de transporte.'],
        exercises: [
          ex.imageChoice('🚗', 'carro', ['trem', 'avião', 'metrô'], ['pt-carro'], {
            id: 'pt.ex.6z5pxbr8b9jja3',
          }),
          ex.imageChoice('🚇', 'metrô', ['carro', 'trem', 'avião'], ['pt-metro'], {
            id: 'pt.ex.m23cmry6viyp5b',
          }),
          ex.imageChoice('✈️', 'avião', ['trem', 'carro', 'bicicleta'], ['pt-aviao'], {
            id: 'pt.ex.li8wgu6qho2blc',
          }),
          ex.translationChoice('trem', 'tren', ['avión', 'auto', 'subte'], ['pt-trem'], {
            id: 'pt.ex.y3b5zrzpak8sxz',
          }),
          ex.listenChoice(
            'Eu vou de metrô.',
            ['Eu vou de carro.', 'Eu vou a pé.', 'Ele vai de metrô.'],
            ['pt-metro', 'pt-vou'],
            { id: 'pt.ex.rtj4tjhoj5glib' },
          ),
          ex.fillBlank(
            'Eu vou para o trabalho ___ carro.',
            'Voy al trabajo en auto.',
            'de',
            ['em', 'no', 'com'],
            ['pt-carro'],
            { id: 'pt.ex.y3lctk8x0itcoy', explanation: 'El transporte va con de: de carro.' },
          ),
          ex.fillBlank(
            'A escola é perto: eu vou a ___.',
            'La escuela está cerca: voy caminando.',
            'pé',
            ['carro', 'trem', 'metrô'],
            ['pt-a-pe', 'pt-perto'],
            { id: 'pt.ex.8bbj6zpawyjm4v', skill: 'vocabulary' },
          ),
          ex.orderWords(
            'Ela vai para a escola de bicicleta.',
            'Ella va a la escuela en bicicleta.',
            ['pt-bicicleta', 'pt-vai'],
            {
              id: 'pt.ex.a96741xy4qsjj0',
            },
          ),
          ex.shortAnswer(
            'Como você vai para o trabalho? (🚌)',
            '¿Cómo vas al trabajo? (Respondé que vas en colectivo.)',
            'Eu vou de ônibus.',
            ['Vou de ônibus.', 'De ônibus.', 'Eu vou para o trabalho de ônibus.'],
            ['pt-onibus', 'pt-vou'],
            { id: 'pt.ex.ukooev1m04bu67' },
          ),
          ex.translateWrite('Voy en subte.', 'Eu vou de metrô.', ['pt-metro'], {
            id: 'pt.ex.31prfi37dkwqk8',
            acceptedAnswers: ['Vou de metrô.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Vou ao cinema',
        objective: 'Usar ao y à para decir adónde vas.',
        intro: {
          explanation:
            'A + o se une en ao y a + a, en à (con acento grave): vou ao cinema, vou à praia. En Brasil también se dice vou para o / pra: vou pra praia.',
          examples: [
            { target: 'No sábado eu vou ao cinema.', base: 'El sábado voy al cine.' },
            { target: 'Você vai à praia amanhã?', base: '¿Vas a la playa mañana?' },
          ],
        },
        takeaways: [
          'Usás ao con masculino y à con femenino.',
          'Decís adónde vas el fin de semana.',
        ],
        exercises: [
          ex.translationChoice('cinema', 'cine', ['teatro', 'cama', 'cocina'], ['pt-cinema'], {
            id: 'pt.ex.61cyw422wmale8',
          }),
          ex.translationChoice(
            'ao',
            'al (a + o)',
            ['del (de + o)', 'en el', 'por el (por + o)'],
            ['pt-ao'],
            {
              id: 'pt.ex.dj0a0dos3asdil',
            },
          ),
          ex.listenChoice(
            'Vou ao cinema.',
            ['Vou à praia.', 'Vou ao mercado.', 'Vai ao cinema.'],
            ['pt-ao', 'pt-cinema'],
            { id: 'pt.ex.6jkroeomig4cv7' },
          ),
          ex.fillBlank(
            'No sábado eu vou ___ cinema.',
            'El sábado voy al cine.',
            'ao',
            ['à', 'na', 'do'],
            ['pt-ao', 'pt-cinema'],
            { id: 'pt.ex.ojygvmlm81qbhs', explanation: 'Cinema es masculino: a + o = ao.' },
          ),
          ex.fillBlank(
            'Você vai ___ praia amanhã?',
            '¿Vas a la playa mañana?',
            'à',
            ['ao', 'no', 'da'],
            ['pt-praia', 'pt-amanha'],
            { id: 'pt.ex.jivk8n8o1wvuqx', explanation: 'Praia es femenino: a + a = à.' },
          ),
          ex.fillBlank(
            'Eu vou ___ restaurante à noite.',
            'Voy al restaurante a la noche.',
            'ao',
            ['à', 'da', 'na'],
            ['pt-ao', 'pt-a-noite'],
            { id: 'pt.ex.hajhsk7j9vc8b5' },
          ),
          ex.orderWords(
            'Amanhã a gente vai ao cinema.',
            'Mañana vamos al cine.',
            ['pt-ao', 'pt-cinema', 'pt-a-gente'],
            {
              id: 'pt.ex.5xuefwgt5l4jg1',
            },
          ),
          ex.shortAnswer(
            'Aonde você vai no sábado? (🎬)',
            '¿Adónde vas el sábado? (Respondé que vas al cine.)',
            'Eu vou ao cinema.',
            ['Vou ao cinema.', 'Ao cinema.', 'No sábado eu vou ao cinema.', 'Vou pro cinema.'],
            ['pt-ao', 'pt-cinema'],
            { id: 'pt.ex.9cy6r00qlgdiwc' },
          ),
          ex.translateWrite('Voy al cine.', 'Eu vou ao cinema.', ['pt-ao', 'pt-cinema'], {
            id: 'pt.ex.7f8zvy5l1oklm1',
            acceptedAnswers: ['Vou ao cinema.', 'Vou pro cinema.', 'Eu vou para o cinema.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Pela praça, pelo centro',
        objective: 'Decir por dónde pasa algo y pasear.',
        intro: {
          explanation:
            'Por + o se une en pelo y por + a, en pela: o ônibus passa pela praça. Falso amigo: pelo no es el pelo (eso es cabelo). Passear es «pasear»: eu passeio pelo centro.',
          examples: [
            { target: 'O ônibus passa pela praça.', base: 'El colectivo pasa por la plaza.' },
            { target: 'Eu gosto de passear pelo centro.', base: 'Me gusta pasear por el centro.' },
          ],
        },
        takeaways: ['Usás pelo y pela para «por el» y «por la».', 'Decís dónde te gusta pasear.'],
        exercises: [
          ex.translationChoice(
            'pelo',
            'por el (por + o)',
            ['el pelo', 'para el', 'al (a + o)'],
            ['pt-pelo'],
            {
              id: 'pt.ex.2ypnayys4oopji',
              explanation: 'Pelo es por + o; el pelo de la cabeza es cabelo.',
            },
          ),
          ex.translationChoice('passear', 'pasear', ['pasar', 'pagar', 'parar'], ['pt-passear'], {
            id: 'pt.ex.vd7dzpahh59x8v',
          }),
          ex.listenChoice(
            'O ônibus passa pela praça.',
            ['O ônibus passa pelo centro.', 'O trem passa pela praça.', 'O ônibus para na praça.'],
            ['pt-pela', 'pt-praca'],
            { id: 'pt.ex.g77rf7jwgifcem' },
          ),
          ex.fillBlank(
            'Eu gosto de passear ___ praia.',
            'Me gusta pasear por la playa.',
            'pela',
            ['pelo', 'ao', 'na'],
            ['pt-pela', 'pt-passear', 'pt-praia'],
            { id: 'pt.ex.qauio87irpfqtc', explanation: 'Praia es femenino: por + a = pela.' },
          ),
          ex.fillBlank(
            'O metrô passa ___ centro.',
            'El subte pasa por el centro.',
            'pelo',
            ['pela', 'ao', 'do'],
            ['pt-pelo', 'pt-metro'],
            { id: 'pt.ex.p7sn399l312xsu', explanation: 'Centro es masculino: por + o = pelo.' },
          ),
          question(
            'pt.ex.a64w265o2phz6f',
            CAMINHO,
            '¿Por dónde pasa el colectivo 42?',
            'Por la plaza y por el mercado',
            ['Por la estación y la panadería', 'Por la playa', 'Por el centro y la escuela'],
            ['pt-pela', 'pt-pelo'],
            'Clara escribe: «O ônibus passa pela praça e pelo mercado».',
          ),
          question(
            'pt.ex.72jctewgoi1ur4',
            CAMINHO,
            '¿Cómo llega Sofia desde la parada hasta la casa?',
            'Camina cinco minutos',
            ['Toma el subte', 'Va en bicicleta', 'Toma otro colectivo'],
            ['pt-a-pe'],
            'El mensaje dice: «vai a pé: são cinco minutos».',
          ),
          ex.orderWords(
            'A gente passeia pela cidade.',
            'Paseamos por la ciudad.',
            ['pt-passear', 'pt-pela', 'pt-cidade'],
            {
              id: 'pt.ex.z4znyjq5wm8ssi',
            },
          ),
          ex.shortAnswer(
            'Onde você gosta de passear? (🏖️)',
            '¿Dónde te gusta pasear? (Respondé que por la playa.)',
            'Eu gosto de passear pela praia.',
            ['Gosto de passear pela praia.', 'Pela praia.'],
            ['pt-passear', 'pt-pela'],
            { id: 'pt.ex.ksrxkqp220578b' },
          ),
          ex.translateWrite(
            'El colectivo pasa por la plaza.',
            'O ônibus passa pela praça.',
            ['pt-pela', 'pt-praca'],
            {
              id: 'pt.ex.src6lgta7n0bjl',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'O que você faz no tempo livre?',
        objective: 'Contar qué hacés en tu tiempo libre con fazer.',
        intro: {
          explanation:
            'Fazer es irregular: eu faço, você / ele / ela faz, nós fazemos. Tempo livre es «tiempo libre»: o que você faz no seu tempo livre?',
          examples: [
            { target: 'O que você faz no fim de semana?', base: '¿Qué hacés el fin de semana?' },
            { target: 'Eu faço o almoço no domingo.', base: 'Yo hago el almuerzo el domingo.' },
          ],
        },
        takeaways: ['Conjugás fazer: faço, faz, fazemos.', 'Contás qué hacés en tu tiempo libre.'],
        exercises: [
          ex.translationChoice(
            'faço',
            'hago',
            ['hace / hacés (con você)', 'hacemos', 'tengo'],
            ['pt-faco'],
            {
              id: 'pt.ex.22mj81ia0zzdl6',
            },
          ),
          ex.translationChoice(
            'tempo livre',
            'tiempo libre',
            ['fin de semana', 'vacaciones', 'mucho tiempo'],
            ['pt-tempo-livre'],
            {
              id: 'pt.ex.uvjekri0ulyj5p',
            },
          ),
          ex.listenChoice(
            'O que você faz no sábado?',
            [
              'O que você faz no domingo?',
              'O que vocês fazem no sábado?',
              'O que você quer no sábado?',
            ],
            ['pt-faz', 'pt-sabado'],
            { id: 'pt.ex.ehva15oj7nrfqq' },
          ),
          ex.fillBlank(
            'Eu ___ o jantar à noite.',
            'Yo hago la cena a la noche.',
            'faço',
            ['faz', 'fazemos', 'fazer'],
            ['pt-faco'],
            { id: 'pt.ex.odwt5nkiyejrrc', explanation: 'Con eu, fazer es faço.' },
          ),
          ex.fillBlank(
            'Nós ___ o almoço juntos.',
            'Hacemos el almuerzo juntos.',
            'fazemos',
            ['faço', 'faz', 'fazem'],
            ['pt-fazemos', 'pt-almoco'],
            { id: 'pt.ex.qtll0q114pdwih' },
          ),
          ex.fillBlank(
            'O que a Nina ___ no tempo livre?',
            '¿Qué hace Nina en su tiempo libre?',
            'faz',
            ['faço', 'fazemos', 'fazer'],
            ['pt-faz', 'pt-tempo-livre'],
            { id: 'pt.ex.odbjdnqbphm62b' },
          ),
          question(
            'pt.ex.tzh4uhu4vw67p7',
            DOMINGO,
            '¿Qué hace Gabriel el domingo?',
            'Hace el almuerzo',
            ['Va al mercado', 'Trabaja todo el día', 'Va a la escuela'],
            ['pt-faco', 'pt-vao'],
            'Gabriel escribe: «Os meus pais vão ao mercado e eu faço o almoço».',
          ),
          question(
            'pt.ex.ubein513fmxnly',
            DOMINGO,
            '¿Qué hace la familia a la mañana?',
            'Pasea en bicicleta por la playa',
            ['Va al cine', 'Va al mercado en auto', 'Mira una película'],
            ['pt-passear', 'pt-bicicleta', 'pt-pela', 'pt-vamos'],
            'Dice: «De manhã a gente passeia de bicicleta pela praia».',
          ),
          ex.shortAnswer(
            'O que você faz no seu tempo livre? (📖)',
            '¿Qué hacés en tu tiempo libre? (Respondé que leés.)',
            'Eu leio.',
            ['Leio.', 'Eu leio livros.', 'Leio livros.', 'No meu tempo livre eu leio.'],
            ['pt-tempo-livre', 'pt-leio'],
            { id: 'pt.ex.pgrlqua96xepy1' },
          ),
          ex.translateWrite(
            '¿Qué hacés el domingo?',
            'O que você faz no domingo?',
            ['pt-faz', 'pt-domingo'],
            {
              id: 'pt.ex.0w7fceu5j6yalx',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Vamos?',
        objective: 'Proponer planes con vamos y hablar de otros con vão.',
        intro: {
          explanation:
            'Ir en plural: nós vamos, eles / vocês vão. Para proponer un plan alcanza con vamos…?: vamos ao cinema? Para aceptar: vamos!',
          examples: [
            { target: 'Vamos à praia no domingo?', base: '¿Vamos a la playa el domingo?' },
            { target: 'Eles vão de trem para São Paulo.', base: 'Ellos van en tren a São Paulo.' },
          ],
        },
        takeaways: ['Proponés un plan con vamos…?', 'Decís adónde van otros con vão.'],
        exercises: [
          ex.translationChoice('vão', 'van', ['vamos', 'voy', 'va / vas (con você)'], ['pt-vao'], {
            id: 'pt.ex.c0nugw8evgdhso',
          }),
          ex.fillBlank(
            'Eles ___ de avião para Recife.',
            'Ellos van en avión a Recife.',
            'vão',
            ['vamos', 'vai', 'vou'],
            ['pt-vao', 'pt-aviao'],
            { id: 'pt.ex.twmaoho4cc87bo', explanation: 'Con eles, ir es vão.' },
          ),
          ex.fillBlank(
            '___ ao cinema hoje?',
            '¿Vamos al cine hoy?',
            'Vamos',
            ['Vão', 'Vou', 'Vai'],
            ['pt-vamos', 'pt-ao', 'pt-cinema'],
            { id: 'pt.ex.hien4a7stkknyh' },
          ),
          ex.listenChoice(
            'Vamos de trem?',
            ['Vamos de carro?', 'Vão de trem?', 'Vamos a pé?'],
            ['pt-vamos', 'pt-trem'],
            { id: 'pt.ex.5512q1aza4n97i' },
          ),
          question(
            'pt.ex.91shsrf9dfkrd7',
            SABADO,
            '¿Qué le propone Nina a Léo?',
            'Ir al cine el sábado',
            ['Ir a la playa el domingo', 'Tomar el subte al centro', 'Quedarse en casa'],
            ['pt-vamos', 'pt-cinema'],
            'Nina pregunta: «Vamos ao cinema?».',
          ),
          question(
            'pt.ex.sbd3og910uh6om',
            SABADO,
            '¿Cómo van a ir al cine?',
            'Caminando, porque está cerca',
            ['En subte', 'En auto', 'En colectivo'],
            ['pt-a-pe', 'pt-metro'],
            'Léo propone el metrô, pero Nina dice: «vamos a pé. O cinema é perto».',
          ),
          ex.orderWords(
            'Vamos à praia no domingo?',
            '¿Vamos a la playa el domingo?',
            ['pt-vamos', 'pt-domingo'],
            {
              id: 'pt.ex.98ltuf4qr061jv',
            },
          ),
          ex.shortAnswer(
            'Vamos ao cinema hoje?',
            '¿Vamos al cine hoy? (Aceptá y proponé ir en subte.)',
            'Vamos! Vamos de metrô?',
            [
              'Vamos! A gente vai de metrô?',
              'Vamos, de metrô!',
              'Sim, vamos de metrô.',
              'Vamos de metrô.',
            ],
            ['pt-vamos', 'pt-metro'],
            { id: 'pt.ex.cpfkozse78e718' },
          ),
          ex.translateWrite(
            '¿Vamos al cine el sábado?',
            'Vamos ao cinema no sábado?',
            ['pt-ao', 'pt-cinema'],
            {
              id: 'pt.ex.ugocvywxn43u50',
            },
          ),
        ],
      },
    ],
  },
};
