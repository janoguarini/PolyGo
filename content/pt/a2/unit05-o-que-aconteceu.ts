import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * PT-BR A2 U5 «¿Qué pasó?» (docs/PT_A1_A2.md): contraste entre imperfeito (la escena: estava chovendo,
 * eu estava andando) y perfeito (lo que pasó: caiu, perdi, vi), estar + gerundio en pasado y los
 * conectores del relato (primeiro, então, de repente, enquanto, no final). Falso amigo: perceber es
 * «darse cuenta», no «percibir» un sueldo.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CELULAR = dialogue(
  'pt.stim.a2-u5-celular',
  'Rafa llama a su hermana desde el teléfono de un amigo.',
  [
    ['Rafa', 'Oi, Duda! Sou eu, o Rafa. Perdi o meu celular!'],
    ['Duda', 'Nossa! O que aconteceu?'],
    [
      'Rafa',
      'Eu estava no ônibus e estava ouvindo música. Quando eu desci, percebi que o celular não estava no bolso.',
    ],
    ['Duda', 'Que susto! Liga para a empresa de ônibus. Às vezes alguém encontra e devolve.'],
  ],
);

const ATRASO = reading(
  'pt.stim.a2-u5-atraso',
  'message',
  'Paulo le explica a su jefa por qué llegó tarde.',
  [
    'Bom dia, Sandra. Desculpe o atraso!',
    'Eu estava saindo de casa quando começou a chover muito.',
    'Então peguei um táxi, mas o trânsito estava parado por causa de um acidente.',
    'Cheguei às dez. Não vai acontecer de novo.',
  ],
  { from: 'Paulo', to: 'Sandra' },
);

const PRAIA = reading(
  'pt.stim.a2-u5-praia',
  'post',
  'Una chica cuenta algo que le pasó en la playa.',
  [
    'Vocês não vão acreditar no que aconteceu ontem!',
    'Primeiro, a gente estava tomando sol na praia de Copacabana.',
    'De repente, um cachorro pegou a minha sandália e saiu correndo.',
    'Enquanto todo mundo ria, eu corria atrás dele. No final, o dono devolveu a sandália.',
  ],
  { from: 'Júlia', title: 'Que dia!' },
);

export const PT_A2_U05: PtUnitDef = {
  names: ['Rafa', 'Duda', 'Sandra', 'Paulo', 'Júlia', 'Copacabana'],
  support: [
    'acontece',
    'perco',
    'chão',
    'cai',
    'carteira',
    'encontrou',
    'encontro',
    'ouvindo',
    'desci',
    'bolso',
    'susto',
    'liga',
    'empresa',
    'alguém',
    'encontra',
    'devolve',
    'andando',
    'acidente',
    'viu',
    'saindo',
    'barulho',
    'ouvia',
    'ouço',
    'desculpe',
    'atraso',
    'começou',
    'trânsito',
    'parado',
    'causa',
    'acontecer',
    'ligou',
    'tomou',
    'dono',
    'devolveu',
    'sandália',
    'ouviu',
    'cozinhava',
    'jornal',
    'via',
    'acreditar',
    'tomando',
    'sol',
    'pegou',
    'correndo',
    'corria',
    'atrás',
    'dormia',
    'percebeu',
    'parou',
    'deu',
    'certo',
    'atrasado',
  ],
  unit: {
    position: 5,
    title: '¿Qué pasó? Contar un hecho',
    titleEn: 'O que aconteceu?',
    description:
      'Imperfeito para la escena y perfeito para lo que pasó, estava + gerundio, los conectores del relato y el falso amigo perceber.',
    emoji: '💬',
    objective:
      'Puedes contar algo que te pasó: describir la escena, decir qué pasó de repente y ordenar el relato con primeiro, então y no final.',
    grammar: {
      title: 'Imperfeito y perfeito · estava + gerundio',
      explanation:
        'En un relato, el imperfeito pinta la escena (estava chovendo, eu estava no ônibus) y el perfeito cuenta lo que pasó (eu caí, perdi o celular). Estar + gerundio en pasado: eu estava andando («estaba caminando»); en Brasil el gerundio termina en -ndo, como en español.',
      examples: [
        {
          target: 'Eu estava andando quando vi o acidente.',
          base: 'Estaba caminando cuando vi el accidente.',
        },
        {
          target: 'Estava chovendo e eu caí na rua.',
          base: 'Estaba lloviendo y me caí en la calle.',
        },
        { target: 'De repente, o ônibus parou.', base: 'De repente, el autobús frenó.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U5). Sin revisión nativa: revisar el contraste de pasados y los conectores.',
    },
    words: [
      w('pt-aconteceu', 'aconteceu', 'pasó / sucedió', 'O que aconteceu?', '¿Qué pasó?', ['past'], {
        acceptedTranslations: ['pasó', 'sucedió', 'ocurrió'],
      }),
      w('pt-estava', 'estava', 'estaba', 'Eu estava em casa.', 'Estaba en casa.', ['past']),
      w(
        'pt-estava-chovendo',
        'estava chovendo',
        'estaba lloviendo',
        'Estava chovendo muito.',
        'Estaba lloviendo mucho.',
        ['past', 'weather'],
      ),
      w(
        'pt-enquanto',
        'enquanto',
        'mientras',
        'Enquanto eu cozinhava, ele lia.',
        'Mientras yo cocinaba, él leía.',
        ['connectors'],
      ),
      w(
        'pt-de-repente',
        'de repente',
        'de repente',
        'De repente, o ônibus parou.',
        'De repente, el autobús frenó.',
        ['connectors'],
      ),
      w(
        'pt-entao',
        'então',
        'entonces',
        'Estava chovendo, então peguei um táxi.',
        'Estaba lloviendo, entonces tomé un taxi.',
        ['connectors'],
        {
          acceptedTranslations: ['así que', 'por eso'],
        },
      ),
      w(
        'pt-primeiro',
        'primeiro',
        'primero',
        'Primeiro eu tomei café, depois saí.',
        'Primero desayuné, después salí.',
        ['connectors'],
      ),
      w(
        'pt-no-final',
        'no final',
        'al final',
        'No final, deu tudo certo.',
        'Al final, salió todo bien.',
        ['connectors'],
        {
          acceptedTranslations: ['finalmente'],
        },
      ),
      w(
        'pt-caiu',
        'caiu',
        'se cayó',
        'O celular caiu no chão.',
        'El celular se cayó al piso.',
        ['past'],
        {
          acceptedTexts: ['caí'],
          acceptedTranslations: ['me caí', 'cayó'],
        },
      ),
      w('pt-perdi', 'perdi', 'perdí', 'Perdi a chave de casa.', 'Perdí la llave de casa.', [
        'past',
      ]),
      w(
        'pt-encontrei',
        'encontrei',
        'encontré',
        'Encontrei a minha carteira.',
        'Encontré mi billetera.',
        ['past'],
      ),
      w('pt-vi', 'vi', 'vi', 'Eu vi um acidente na rua.', 'Vi un accidente en la calle.', ['past']),
      w(
        'pt-ouvi',
        'ouvi',
        'escuché / oí',
        'Ouvi um barulho na cozinha.',
        'Oí un ruido en la cocina.',
        ['past'],
        {
          acceptedTranslations: ['escuché'],
        },
      ),
      w(
        'pt-chegou',
        'chegou',
        'llegó / llegaste (con você)',
        'O ônibus chegou atrasado.',
        'El autobús llegó tarde.',
        ['past'],
        {
          acceptedTexts: ['cheguei'],
          acceptedTranslations: ['llegó', 'llegué'],
        },
      ),
      w(
        'pt-percebi',
        'percebi',
        'me di cuenta',
        'Percebi que estava sem a chave.',
        'Me di cuenta de que no tenía la llave.',
        ['past'],
        {
          acceptedTranslations: ['noté'],
        },
      ),
      w(
        'pt-sem-querer',
        'sem querer',
        'sin querer',
        'Desculpa, foi sem querer!',
        '¡Perdón, fue sin querer!',
        ['courtesy'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'O que aconteceu?',
        objective: 'Preguntar qué pasó y contar un hecho con el perfeito.',
        intro: {
          explanation:
            'O que aconteceu? es «¿qué pasó?». Se responde con el perfeito: perdi o celular, caí na rua, encontrei a chave. Cair (caerse) en pasado: eu caí, ele caiu.',
          examples: [
            { target: 'O que aconteceu? — Perdi a chave.', base: '¿Qué pasó? — Perdí la llave.' },
            { target: 'O celular caiu no chão.', base: 'El celular se cayó al piso.' },
          ],
        },
        takeaways: ['Preguntas o que aconteceu?', 'Cuentas un hecho: perdi, caiu, encontrei.'],
        exercises: [
          ex.translationChoice(
            'aconteceu',
            'pasó / sucedió',
            ['pasa', 'llegó / llegaste (con você)', 'se cayó'],
            ['pt-aconteceu'],
            {
              id: 'pt.ex.jglmub1t1fvx8q',
            },
          ),
          ex.translationChoice('perdi', 'perdí', ['pedí', 'perdió', 'encontré'], ['pt-perdi'], {
            id: 'pt.ex.3crtxrk845d4hj',
          }),
          ex.listenChoice(
            'O que aconteceu?',
            ['O que você fez?', 'Quando aconteceu?', 'O que acontece?'],
            ['pt-aconteceu'],
            { id: 'pt.ex.s15c7s6gvcga50' },
          ),
          ex.fillBlank(
            'Ontem eu ___ a chave de casa.',
            'Ayer perdí la llave de casa.',
            'perdi',
            ['perdeu', 'perco', 'encontrei'],
            ['pt-perdi', 'pt-chave'],
            { id: 'pt.ex.m4fwyuc96kaszz' },
          ),
          ex.fillBlank(
            'O celular ___ no chão.',
            'El celular se cayó al piso.',
            'caiu',
            ['cai', 'chegou', 'perdi'],
            ['pt-caiu'],
            { id: 'pt.ex.jyhoyi8en2tprk', explanation: 'Pasado de cair con ele: caiu.' },
          ),
          ex.fillBlank(
            'Que bom! Eu ___ a minha carteira.',
            '¡Qué bueno! Encontré mi billetera.',
            'encontrei',
            ['perdi', 'encontrou', 'encontro'],
            ['pt-encontrei'],
            { id: 'pt.ex.7zx1nz4mlh3xet' },
          ),
          question(
            'pt.ex.xbb5dswwprrvpp',
            CELULAR,
            '¿Qué le pasó a Rafa?',
            'Perdió el celular',
            ['Se cayó del autobús', 'Encontró un celular', 'Perdió la llave'],
            ['pt-perdi', 'pt-aconteceu', 'pt-percebi'],
            'Rafa dice: «Perdi o meu celular!».',
          ),
          ex.orderWords(
            'Eu perdi o celular no ônibus.',
            'Perdí el celular en el autobús.',
            ['pt-perdi'],
            { id: 'pt.ex.ew21kgh1k7siaz' },
          ),
          ex.shortAnswer(
            'O que aconteceu? (🔑 perder)',
            '¿Qué pasó? (Responde que perdiste la llave.)',
            'Eu perdi a chave.',
            [
              'Perdi a chave.',
              'Perdi a minha chave.',
              'Eu perdi a minha chave.',
              'Eu perdi a chave de casa.',
            ],
            ['pt-perdi', 'pt-chave'],
            { id: 'pt.ex.6t6q2dy24erutb' },
          ),
          ex.translateWrite(
            '¿Qué pasó? ¿Perdiste el celular?',
            'O que aconteceu? Você perdeu o celular?',
            ['pt-aconteceu'],
            {
              id: 'pt.ex.emb8o6iqjeufl5',
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Eu estava andando quando…',
        objective: 'Describir la escena con estava y estava + gerundio.',
        intro: {
          explanation:
            'La escena va en imperfeito: eu estava no ônibus, estava chovendo. Estar + gerundio (-ando, -endo, -indo) dice qué estaba pasando: eu estava andando. Lo que interrumpe va en perfeito: quando eu vi…',
          examples: [
            {
              target: 'Eu estava andando quando vi o acidente.',
              base: 'Estaba caminando cuando vi el accidente.',
            },
            { target: 'Estava chovendo muito.', base: 'Estaba lloviendo mucho.' },
          ],
        },
        takeaways: [
          'Describes la escena: estava + gerundio.',
          'Interrumpes con el perfeito: quando vi…',
        ],
        exercises: [
          ex.translationChoice(
            'estava chovendo',
            'estaba lloviendo',
            ['llovió', 'va a llover', 'hacía frío'],
            ['pt-estava-chovendo'],
            {
              id: 'pt.ex.pmqhhdpdx3y39e',
            },
          ),
          ex.listenChoice(
            'Eu estava andando quando vi o acidente.',
            [
              'Eu estava andando quando ouvi o acidente.',
              'Ele estava andando quando viu o acidente.',
              'Eu estava em casa quando vi o acidente.',
            ],
            ['pt-estava', 'pt-vi'],
            { id: 'pt.ex.i1nhl2bwruf0ty' },
          ),
          ex.fillBlank(
            'Eu ___ no ônibus quando o celular caiu.',
            'Estaba en el autobús cuando se cayó el celular.',
            'estava',
            ['estive', 'estou', 'fui'],
            ['pt-estava', 'pt-caiu'],
            { id: 'pt.ex.h0zl12a4t224yx', explanation: 'La escena va en imperfeito: estava.' },
          ),
          ex.fillBlank(
            'Eu estava saindo de casa quando ___ um barulho.',
            'Estaba saliendo de casa cuando oí un ruido.',
            'ouvi',
            ['ouvia', 'ouço', 'estava'],
            ['pt-ouvi'],
            {
              id: 'pt.ex.noqwuw2ig3vr8d',
              explanation: 'Lo que interrumpe la escena va en perfeito: ouvi.',
            },
          ),
          ex.fillBlank(
            'Quando eu cheguei, ___ chovendo.',
            'Cuando llegué, estaba lloviendo.',
            'estava',
            ['esteve', 'está', 'foi'],
            ['pt-estava-chovendo', 'pt-chegou'],
            { id: 'pt.ex.9ditnf0td2cdlj' },
          ),
          question(
            'pt.ex.ibgj3a6310uta7',
            CELULAR,
            '¿Qué estaba haciendo Rafa en el autobús?',
            'Estaba escuchando música',
            ['Estaba hablando por teléfono', 'Estaba durmiendo', 'Estaba leyendo'],
            ['pt-estava'],
            'Rafa dice: «Eu estava no ônibus e estava ouvindo música».',
          ),
          question(
            'pt.ex.bro4vm5jbhppzt',
            ATRASO,
            '¿Qué pasó cuando Paulo salía de casa?',
            'Empezó a llover mucho',
            ['Perdió las llaves', 'Se cayó en la calle', 'Vio un accidente'],
            ['pt-estava', 'pt-entao'],
            'Paulo escribe: «Eu estava saindo de casa quando começou a chover muito».',
          ),
          ex.orderWords(
            'Eu estava em casa quando você ligou.',
            'Estaba en casa cuando llamaste.',
            ['pt-estava'],
            { id: 'pt.ex.iarku5pzpzye35' },
          ),
          ex.shortAnswer(
            'Onde você estava quando eu liguei? (no ônibus)',
            '¿Dónde estabas cuando te llamé? (Responde que estabas en el autobús.)',
            'Eu estava no ônibus.',
            ['Estava no ônibus.', 'No ônibus.'],
            ['pt-estava'],
            { id: 'pt.ex.9pokpefxlx05hv' },
          ),
          ex.translateWrite(
            'Estaba lloviendo y me caí.',
            'Estava chovendo e eu caí.',
            ['pt-estava-chovendo', 'pt-caiu'],
            {
              id: 'pt.ex.ek864h49khdcns',
              acceptedAnswers: ['Estava chovendo e caí.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Primeiro, depois, então',
        objective: 'Ordenar un relato con conectores.',
        intro: {
          explanation:
            'Para ordenar lo que pasó: primeiro (primero), depois (después), então (entonces, así que) y no final (al final). Então también da la consecuencia: estava chovendo, então peguei um táxi.',
          examples: [
            {
              target: 'Primeiro eu tomei café, depois saí.',
              base: 'Primero desayuné, después salí.',
            },
            {
              target: 'Estava tarde, então peguei um táxi.',
              base: 'Era tarde, así que tomé un taxi.',
            },
          ],
        },
        takeaways: [
          'Ordenas un relato: primeiro, depois, no final.',
          'Das una consecuencia con então.',
        ],
        exercises: [
          ex.translationChoice(
            'então',
            'entonces',
            ['todavía', 'también', 'mientras'],
            ['pt-entao'],
            { id: 'pt.ex.32d6uiuxpu3j8m' },
          ),
          ex.translationChoice(
            'no final',
            'al final',
            ['al principio', 'de repente', 'mientras'],
            ['pt-no-final'],
            { id: 'pt.ex.kpag5i23i9un4u' },
          ),
          ex.listenChoice(
            'Primeiro eu tomei café, depois saí.',
            [
              'Primeiro eu saí, depois tomei café.',
              'Primeiro ela tomou café, depois saiu.',
              'Depois eu tomei café e saí.',
            ],
            ['pt-primeiro', 'pt-depois'],
            { id: 'pt.ex.5g1fz0s3kg4mne' },
          ),
          ex.fillBlank(
            'Estava chovendo, ___ peguei um táxi.',
            'Estaba lloviendo, así que tomé un taxi.',
            'então',
            ['enquanto', 'primeiro', 'mas'],
            ['pt-entao', 'pt-peguei'],
            { id: 'pt.ex.0tzmd5qn1vyyar', explanation: 'Consecuencia: então.' },
          ),
          ex.fillBlank(
            '___, o dono devolveu a sandália.',
            'Al final, el dueño devolvió la sandalia.',
            'No final',
            ['Primeiro', 'Enquanto', 'Então'],
            ['pt-no-final'],
            { id: 'pt.ex.mn2pgdl5fx41nv' },
          ),
          question(
            'pt.ex.cxfza6786a1ois',
            ATRASO,
            '¿Por qué Paulo tomó un taxi?',
            'Porque llovía mucho',
            ['Porque perdió el autobús', 'Porque había un accidente', 'Porque estaba cansado'],
            ['pt-entao', 'pt-peguei'],
            'Escribe que empezó a llover mucho: «Então peguei um táxi».',
          ),
          question(
            'pt.ex.4iiubioidgm9j7',
            ATRASO,
            '¿Por qué llegó tarde igual?',
            'Por un accidente, el tránsito estaba parado',
            ['Porque el taxi se rompió', 'Porque se perdió', 'Porque salió a las diez'],
            ['pt-estava', 'pt-chegou'],
            'Dice: «o trânsito estava parado por causa de um acidente. Cheguei às dez».',
          ),
          ex.matchPairs(
            [
              ['primeiro', 'primero'],
              ['então', 'entonces'],
              ['no final', 'al final'],
              ['enquanto', 'mientras'],
            ],
            ['pt-primeiro', 'pt-entao', 'pt-no-final', 'pt-enquanto'],
            { id: 'pt.ex.h4319oc6m43cym' },
          ),
          ex.shortAnswer(
            'Você chegou tarde. Por quê? (chovia → táxi)',
            'Llegaste tarde. ¿Por qué? (Responde que llovía, así que tomaste un taxi.)',
            'Estava chovendo, então peguei um táxi.',
            [
              'Estava chovendo, então eu peguei um táxi.',
              'Porque estava chovendo, então peguei um táxi.',
              'Choveu, então peguei um táxi.',
            ],
            ['pt-entao', 'pt-estava-chovendo'],
            { id: 'pt.ex.qyo6e0gc45ns3z' },
          ),
          ex.translateWrite(
            'Primero desayuné y después salí.',
            'Primeiro eu tomei café e depois saí.',
            ['pt-primeiro'],
            {
              id: 'pt.ex.p0epjvto5xpx0c',
              acceptedAnswers: [
                'Primeiro tomei café e depois saí.',
                'Primeiro eu tomei café da manhã e depois saí.',
                'Primeiro tomei café da manhã e depois saí.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'De repente…',
        objective: 'Contar una sorpresa con de repente y enquanto.',
        intro: {
          explanation:
            'De repente es igual que en español. Enquanto es «mientras»: enquanto eu cozinhava, ele lia. Ouvir en pasado: eu ouvi; ver: eu vi, ele viu.',
          examples: [
            { target: 'De repente, ouvi um barulho.', base: 'De repente, oí un ruido.' },
            {
              target: 'Enquanto eu dormia, o meu irmão chegou.',
              base: 'Mientras yo dormía, llegó mi hermano.',
            },
          ],
        },
        takeaways: ['Cuentas una sorpresa con de repente.', 'Unes dos acciones con enquanto.'],
        exercises: [
          ex.translationChoice(
            'enquanto',
            'mientras',
            ['entonces', 'en cuanto', 'cuando'],
            ['pt-enquanto'],
            { id: 'pt.ex.mg95y0aue43pg9' },
          ),
          ex.translationChoice('ouvi', 'escuché / oí', ['vi', 'olí', 'hice'], ['pt-ouvi'], {
            id: 'pt.ex.iy782ox4fcw4z8',
          }),
          ex.listenChoice(
            'De repente, ouvi um barulho.',
            [
              'De repente, vi um barulho.',
              'De repente, ele ouviu um barulho.',
              'Depois, ouvi um barulho.',
            ],
            ['pt-de-repente', 'pt-ouvi'],
            { id: 'pt.ex.0li7vdgl71vv1a' },
          ),
          ex.fillBlank(
            '___ eu cozinhava, ele lia o jornal.',
            'Mientras yo cocinaba, él leía el diario.',
            'Enquanto',
            ['Então', 'De repente', 'No final'],
            ['pt-enquanto'],
            { id: 'pt.ex.nj4hvyx6cvkhna' },
          ),
          ex.fillBlank(
            'Ontem eu ___ um acidente na rua.',
            'Ayer vi un accidente en la calle.',
            'vi',
            ['via', 'viu', 'ouvi'],
            ['pt-vi'],
            { id: 'pt.ex.oivaja6gkdwfgr' },
          ),
          question(
            'pt.ex.c8zxcf5h99tyvl',
            PRAIA,
            '¿Qué estaban haciendo en la playa?',
            'Estaban tomando sol',
            ['Estaban jugando al fútbol', 'Estaban nadando', 'Estaban comiendo'],
            ['pt-primeiro', 'pt-estava'],
            'Júlia escribe: «Primeiro, a gente estava tomando sol na praia».',
          ),
          question(
            'pt.ex.hvuvt757doq88h',
            PRAIA,
            '¿Qué pasó de repente?',
            'Un perro agarró su sandalia y salió corriendo',
            ['Empezó a llover', 'Perdió el celular en el agua', 'Un perro le mordió el pie'],
            ['pt-de-repente'],
            'Dice: «De repente, um cachorro pegou a minha sandália e saiu correndo».',
          ),
          question(
            'pt.ex.8n3haw89ig2a2f',
            PRAIA,
            '¿Cómo terminó la historia?',
            'El dueño del perro le devolvió la sandalia',
            [
              'Júlia compró otra sandalia',
              'El perro se quedó con la sandalia',
              'Todos se fueron de la playa',
            ],
            ['pt-no-final', 'pt-enquanto'],
            'Al final: «No final, o dono devolveu a sandália».',
          ),
          ex.shortAnswer(
            'O que você ouviu? (um barulho)',
            '¿Qué oíste? (Responde que oíste un ruido.)',
            'Eu ouvi um barulho.',
            ['Ouvi um barulho.', 'Um barulho.', 'De repente, ouvi um barulho.'],
            ['pt-ouvi'],
            { id: 'pt.ex.ufp050bvqhddui' },
          ),
          ex.translateWrite(
            'Mientras yo dormía, llegó mi hermano.',
            'Enquanto eu dormia, o meu irmão chegou.',
            ['pt-enquanto', 'pt-chegou'],
            {
              id: 'pt.ex.9g3vb77jl1q1ge',
              acceptedAnswers: [
                'Enquanto eu dormia, meu irmão chegou.',
                'Enquanto eu dormia, chegou o meu irmão.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Percebi que…',
        objective: 'Contar un problema completo y disculparte.',
        intro: {
          explanation:
            'Falso amigo: perceber es «darse cuenta»: percebi que estava sem a chave. Si hiciste algo sin intención: foi sem querer («fue sin querer»).',
          examples: [
            {
              target: 'Quando cheguei, percebi que estava sem a chave.',
              base: 'Cuando llegué, me di cuenta de que no tenía la llave.',
            },
            { target: 'Desculpa, foi sem querer!', base: '¡Perdón, fue sin querer!' },
          ],
        },
        takeaways: ['Dices que te diste cuenta: percebi que…', 'Te disculpas: foi sem querer.'],
        exercises: [
          ex.translationChoice(
            'percebi',
            'me di cuenta',
            ['percibí un sueldo', 'perdí', 'pensé'],
            ['pt-percebi'],
            {
              id: 'pt.ex.b5l1n2q8y2rue2',
              explanation: 'Falso amigo: perceber es «darse cuenta».',
            },
          ),
          ex.translationChoice(
            'sem querer',
            'sin querer',
            ['sin ganas', 'a propósito', 'sin problema'],
            ['pt-sem-querer'],
            { id: 'pt.ex.ksccht1n0yvwwc' },
          ),
          ex.listenChoice(
            'Desculpa, foi sem querer!',
            ['Desculpa, foi sem você!', 'Desculpa, eu não quero!', 'Obrigado, foi sem querer!'],
            ['pt-sem-querer', 'pt-desculpa'],
            { id: 'pt.ex.4iplbud4ooo23x' },
          ),
          ex.fillBlank(
            'Quando eu desci do ônibus, ___ que estava sem o celular.',
            'Cuando bajé del autobús, me di cuenta de que no tenía el celular.',
            'percebi',
            ['perdi', 'percebeu', 'ouvi'],
            ['pt-percebi'],
            { id: 'pt.ex.989ykqjui0lxde' },
          ),
          question(
            'pt.ex.oc41r067ymm8z9',
            CELULAR,
            '¿Cuándo se dio cuenta Rafa de que no tenía el celular?',
            'Cuando bajó del autobús',
            ['Cuando llegó a su casa', 'Cuando subió al autobús', 'Cuando quiso escuchar música'],
            ['pt-percebi'],
            'Rafa dice: «Quando eu desci, percebi que o celular não estava no bolso».',
          ),
          question(
            'pt.ex.c66m7z2uovi2bh',
            CELULAR,
            '¿Qué le aconseja Duda?',
            'Llamar a la empresa de colectivos',
            ['Comprar otro celular', 'Volver al autobús', 'Ir a la policía'],
            ['pt-aconteceu'],
            'Duda dice: «Liga para a empresa de ônibus. Às vezes alguém encontra e devolve».',
          ),
          ex.orderWords('Desculpa foi sem querer.', 'Perdón, fue sin querer.', ['pt-sem-querer'], {
            id: 'pt.ex.i6y3fitn94l8ri',
          }),
          ex.shortAnswer(
            'Você caiu? O que aconteceu? (chovia)',
            '¿Te caíste? ¿Qué pasó? (Responde que estaba lloviendo y te caíste en la calle.)',
            'Estava chovendo e eu caí na rua.',
            [
              'Estava chovendo e caí na rua.',
              'Estava chovendo e eu caí.',
              'Eu caí na rua porque estava chovendo.',
            ],
            ['pt-caiu', 'pt-estava-chovendo'],
            { id: 'pt.ex.qgjy6b3nr8oceq' },
          ),
          ex.translateWrite(
            'Me di cuenta de que no tenía la llave.',
            'Percebi que estava sem a chave.',
            ['pt-percebi', 'pt-estava'],
            {
              id: 'pt.ex.6omuz80u8q1rb0',
              acceptedAnswers: [
                'Eu percebi que estava sem a chave.',
                'Percebi que eu estava sem a chave.',
              ],
            },
          ),
        ],
      },
    ],
  },
};
