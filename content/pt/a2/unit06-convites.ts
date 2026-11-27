import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * PT-BR A2 U6 «Planes e invitaciones» (docs/PT_A1_A2.md): el futuro próximo (ir + infinitivo: vou
 * viajar, vamos jantar), invitar (você quer…?, topa…?), aceptar (bora!, com certeza, combinado) y
 * rechazar con cortesía (que pena, não posso; fica para outro dia). Cultura: el churrasco.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const LIGACAO = dialogue('pt.stim.a2-u6-ligacao', 'Marcos llama a una amiga para invitarla.', [
  ['Marcos', 'Oi, Bia! No sábado eu vou fazer um churrasco lá em casa. Topa?'],
  ['Bia', 'Que pena, no sábado eu não posso. Vou viajar com os meus pais.'],
  ['Marcos', 'Poxa! E no domingo? A gente pode ir ao cinema.'],
  ['Bia', 'No domingo eu topo! Combinado.'],
]);

const CONVITE = reading(
  'pt.stim.a2-u6-convite',
  'message',
  'Una invitación en un grupo de amigos.',
  [
    'Gente, sábado que vem é o meu aniversário! 🎉',
    'Vou fazer uma festa no meu apartamento, a partir das oito.',
    'Cada um traz uma bebida e eu vou fazer a comida.',
    'Quem vem? Respondam até quinta, por favor!',
  ],
  { from: 'Larissa' },
);

const RESPOSTAS = reading(
  'pt.stim.a2-u6-respostas',
  'message',
  'Las respuestas de los amigos en el grupo.',
  [
    'Theo: Com certeza! Eu levo o guaraná.',
    'Manu: Bora! Vou chegar um pouco tarde, depois do trabalho.',
    'Caio: Que pena, não vou poder ir. Vou estar em Curitiba. Fica para outro dia!',
  ],
  { title: 'Festa da Larissa' },
);

const RECADO = dialogue('pt.stim.a2-u6-recado', 'Un mensaje de voz de una compañera de trabajo.', [
  [
    'Vanessa',
    'Oi, Gabi, é a Vanessa. Você está a fim de almoçar comigo depois de amanhã? Tem um restaurante novo perto do escritório. Me liga!',
  ],
]);

export const PT_A2_U06: PtUnitDef = {
  names: ['Marcos', 'Bia', 'Larissa', 'Theo', 'Manu', 'Caio', 'Curitiba', 'Vanessa', 'Gabi'],
  support: [
    'viajar',
    'trabalhar',
    'visitar',
    'visitei',
    'visito',
    'bolo',
    'topar',
    'poxa',
    'partir',
    'cada',
    'traz',
    'bebida',
    'respondam',
    'convide',
    'levo',
    'guaraná',
    'poder',
    'estar',
    'esta',
    'convidada',
    'dá',
    'ficar',
    'vontade',
    'almoçar',
    'comigo',
  ],
  unit: {
    position: 6,
    title: 'Planes e invitaciones',
    titleEn: 'Planos e convites',
    description:
      'El futuro próximo (vou + verbo), invitar, aceptar y rechazar como en Brasil (topa?, bora!, que pena, combinado) y el churrasco.',
    emoji: '🎉',
    objective:
      'Puedes contar tus planes, invitar a alguien, aceptar o rechazar una invitación con cortesía y arreglar día y hora.',
    grammar: {
      title: 'Futuro próximo: ir + infinitivo',
      explanation:
        'Para planes se usa ir + infinitivo, sin «a» en el medio: eu vou viajar, você vai sair?, nós vamos jantar, eles vão chegar tarde. Es la forma normal del futuro en el portugués hablado de Brasil.',
      examples: [
        { target: 'No sábado eu vou fazer um churrasco.', base: 'El sábado voy a hacer un asado.' },
        { target: 'Vocês vão sair hoje?', base: '¿Ustedes van a salir hoy?' },
        { target: 'A gente vai jantar fora.', base: 'Vamos a cenar afuera.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U6). Sin revisión nativa: revisar el registro informal (topa, bora, poxa) y el grupo de mensajes.',
    },
    words: [
      w(
        'pt-convite',
        'convite',
        'invitación',
        'Obrigado pelo convite!',
        '¡Gracias por la invitación!',
        ['social'],
        { emoji: '💌' },
      ),
      w(
        'pt-convidar',
        'convidar',
        'invitar',
        'Eu quero convidar você para a festa.',
        'Te quiero invitar a la fiesta.',
        ['social'],
        {
          acceptedTexts: ['convidei', 'convida'],
        },
      ),
      w(
        'pt-topa',
        'topa?',
        '¿te apuntas? / ¿te sumas?',
        'Vamos à praia amanhã. Topa?',
        'Vamos a la playa mañana. ¿Te apuntas?',
        ['social'],
        {
          acceptedTexts: ['topo', 'topa'],
          acceptedTranslations: [
            '¿te sumás?',
            '¿te prendés?',
            '¿te animás?',
            '¿te prendés? / ¿te sumás?',
            '¿te sumas?',
            '¿te apuntas?',
            '¿te animas?',
          ],
        },
      ),
      w(
        'pt-bora',
        'bora!',
        '¡vamos! / ¡de acuerdo!',
        'Cinema hoje? Bora!',
        '¿Cine hoy? ¡De acuerdo!',
        ['social'],
        {
          acceptedTexts: ['bora'],
          acceptedTranslations: ['¡dale!', 'dale', '¡dale! / ¡vamos!'],
        },
      ),
      w(
        'pt-combinado',
        'combinado',
        'trato hecho / quedamos así',
        'Sábado às oito? Combinado!',
        '¿Sábado a las ocho? ¡Quedamos así!',
        ['social'],
        {
          acceptedTranslations: ['trato hecho', 'quedamos así', 'de acuerdo'],
        },
      ),
      w(
        'pt-que-pena',
        'que pena',
        'qué lástima',
        'Que pena, eu não posso.',
        'Qué lástima, no puedo.',
        ['social'],
        {
          acceptedTranslations: ['qué pena', 'una lástima'],
        },
      ),
      w('pt-nao-posso', 'não posso', 'no puedo', 'Hoje eu não posso.', 'Hoy no puedo.', ['social']),
      w(
        'pt-semana-que-vem',
        'semana que vem',
        'la semana que viene',
        'Na semana que vem eu vou viajar.',
        'La semana que viene me voy de viaje.',
        ['time'],
        {
          acceptedTexts: ['a semana que vem'],
          acceptedTranslations: ['semana que viene', 'la próxima semana'],
        },
      ),
      w(
        'pt-festa',
        'festa',
        'fiesta',
        'A festa é no sábado.',
        'La fiesta es el sábado.',
        ['social'],
        { emoji: '🎈' },
      ),
      w(
        'pt-marcar',
        'marcar',
        'arreglar (un encuentro) / quedar',
        'Vamos marcar um café?',
        '¿Arreglamos para tomar un café?',
        ['social'],
        {
          acceptedTranslations: ['arreglar', 'quedar', 'acordar'],
        },
      ),
      w(
        'pt-ocupado',
        'ocupado',
        'ocupado',
        'Hoje eu estou muito ocupado.',
        'Hoy estoy muy ocupado.',
        ['social'],
        {
          acceptedTexts: ['ocupada'],
          acceptedTranslations: ['ocupada'],
        },
      ),
      w(
        'pt-com-certeza',
        'com certeza',
        'seguro / claro que sí',
        'Você vem? — Com certeza!',
        '¿Vienes? — ¡Seguro!',
        ['social'],
        {
          acceptedTranslations: ['seguro', 'claro que sí', 'por supuesto'],
        },
      ),
      w(
        'pt-a-fim-de',
        'a fim de',
        'con ganas de',
        'Estou a fim de sair hoje.',
        'Tengo ganas de salir hoy.',
        ['social'],
        {
          acceptedTranslations: ['tener ganas de', 'con ganas'],
        },
      ),
      w(
        'pt-depois-de-amanha',
        'depois de amanhã',
        'pasado mañana',
        'Depois de amanhã é feriado.',
        'Pasado mañana es feriado.',
        ['time'],
      ),
      w(
        'pt-churrasco',
        'churrasco',
        'asado',
        'Domingo tem churrasco na casa do Marcos.',
        'El domingo hay asado en la casa de Marcos.',
        ['food', 'social'],
        {
          emoji: '🍖',
        },
      ),
      w(
        'pt-outro-dia',
        'outro dia',
        'otro día',
        'Hoje não dá. Fica para outro dia!',
        'Hoy no puedo. ¡Queda para otro día!',
        ['time'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Vou viajar',
        objective: 'Contar tus planes con ir + infinitivo.',
        intro: {
          explanation:
            'El futuro de todos los días es ir + infinitivo, sin «a»: eu vou viajar («voy a viajar»), ele vai sair, nós vamos jantar, eles vão chegar. Semana que vem es «la semana que viene».',
          examples: [
            {
              target: 'Na semana que vem eu vou viajar.',
              base: 'La semana que viene voy a viajar.',
            },
            { target: 'A gente vai jantar fora hoje.', base: 'Hoy vamos a cenar afuera.' },
          ],
        },
        takeaways: [
          'Cuentas planes con vou + verbo.',
          'Ubicas el plan: semana que vem, depois de amanhã.',
        ],
        exercises: [
          ex.translationChoice(
            'semana que vem',
            'la semana que viene',
            ['la semana pasada', 'el fin de semana', 'toda la semana'],
            ['pt-semana-que-vem'],
            {
              id: 'pt.ex.2gyftgw2wcnssw',
            },
          ),
          ex.translationChoice(
            'depois de amanhã',
            'pasado mañana',
            ['anteayer', 'después del almuerzo', 'mañana por la mañana'],
            ['pt-depois-de-amanha'],
            {
              id: 'pt.ex.ujtzrxo38pdlyn',
            },
          ),
          ex.listenChoice(
            'Na semana que vem eu vou viajar.',
            [
              'Na semana passada eu viajei.',
              'Na semana que vem ele vai viajar.',
              'Na semana que vem eu vou trabalhar.',
            ],
            ['pt-semana-que-vem'],
            { id: 'pt.ex.gy9854m72zko8y' },
          ),
          ex.fillBlank(
            'Amanhã eu vou ___ a minha avó.',
            'Mañana voy a visitar a mi abuela.',
            'visitar',
            ['visitei', 'visito', 'a visitar'],
            ['pt-vou'],
            { id: 'pt.ex.mr8wudsek9fpx4', explanation: 'Ir + infinitivo, sin «a»: vou visitar.' },
          ),
          ex.fillBlank(
            'Vocês ___ sair hoje à noite?',
            '¿Ustedes van a salir hoy por la noche?',
            'vão',
            ['vai', 'vamos', 'vou'],
            ['pt-vao'],
            { id: 'pt.ex.nk51iu2h9n2gpt' },
          ),
          ex.fillBlank(
            'Depois de amanhã nós ___ jantar fora.',
            'Pasado mañana vamos a cenar afuera.',
            'vamos',
            ['vão', 'vou', 'fomos'],
            ['pt-depois-de-amanha', 'pt-vamos'],
            { id: 'pt.ex.x0ty2a71y3bb0k' },
          ),
          ex.orderWords(
            'No sábado eu vou fazer um churrasco.',
            'El sábado voy a hacer un asado.',
            ['pt-churrasco'],
            { id: 'pt.ex.6cv89v5bmi7t96' },
          ),
          ex.shortAnswer(
            'O que você vai fazer no fim de semana? (estudar)',
            '¿Qué vas a hacer el fin de semana? (Responde que vas a estudiar.)',
            'Eu vou estudar.',
            ['Vou estudar.', 'No fim de semana eu vou estudar.', 'No fim de semana vou estudar.'],
            ['pt-vou'],
            { id: 'pt.ex.ey66251g3kapgu' },
          ),
          ex.translateWrite(
            'La semana que viene voy a viajar.',
            'Na semana que vem eu vou viajar.',
            ['pt-semana-que-vem'],
            {
              id: 'pt.ex.9is3o00loze5dp',
              acceptedAnswers: [
                'Na semana que vem vou viajar.',
                'Semana que vem eu vou viajar.',
                'Semana que vem vou viajar.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Topa?',
        objective: 'Invitar a alguien.',
        intro: {
          explanation:
            'Para invitar: você quer…?, vamos…? o, entre amigos, topa? («¿te apuntas?»). Convidar es «invitar» y o convite, «la invitación». El churrasco es el asado brasileño.',
          examples: [
            {
              target: 'Vou fazer um churrasco no sábado. Topa?',
              base: 'El sábado hago un asado. ¿Te apuntas?',
            },
            {
              target: 'Eu quero convidar você para a minha festa.',
              base: 'Te quiero invitar a mi fiesta.',
            },
          ],
        },
        takeaways: ['Invitas con topa? o você quer…?', 'Nombras planes: festa, churrasco.'],
        exercises: [
          ex.translationChoice(
            'convite',
            'invitación',
            ['convite (banquete)', 'regalo', 'fiesta'],
            ['pt-convite'],
            { id: 'pt.ex.v2dyc2kj6fpvz5' },
          ),
          ex.translationChoice(
            'topa?',
            '¿te apuntas? / ¿te sumas?',
            ['¿te gusta?', '¿tocas?', '¿te encuentras?'],
            ['pt-topa'],
            {
              id: 'pt.ex.31dvr64gv3k6di',
            },
          ),
          ex.imageChoice('🍖', 'churrasco', ['festa', 'convite', 'bolo'], ['pt-churrasco'], {
            id: 'pt.ex.5a8afvvps2jowg',
          }),
          ex.listenChoice(
            'Vamos ao cinema amanhã. Topa?',
            [
              'Vamos ao cinema hoje. Topa?',
              'Vamos à praia amanhã. Topa?',
              'Vamos ao cinema amanhã?',
            ],
            ['pt-topa'],
            { id: 'pt.ex.uepjwhqweycvwu' },
          ),
          ex.fillBlank(
            'Eu quero ___ você para a festa.',
            'Te quiero invitar a la fiesta.',
            'convidar',
            ['convite', 'trazer', 'topar'],
            ['pt-convidar', 'pt-festa'],
            { id: 'pt.ex.eqe15tscbomh2c' },
          ),
          question(
            'pt.ex.ad2w16gjfkpvi0',
            LIGACAO,
            '¿A qué invita Marcos?',
            'A un asado en su casa el sábado',
            ['A una fiesta de cumpleaños', 'Al cine el sábado', 'A un viaje con sus padres'],
            ['pt-churrasco', 'pt-topa', 'pt-que-pena', 'pt-combinado'],
            'Marcos dice: «No sábado eu vou fazer um churrasco lá em casa. Topa?».',
          ),
          question(
            'pt.ex.9ukpqgww1439kp',
            CONVITE,
            '¿Qué organiza Larissa?',
            'Una fiesta de cumpleaños en su apartamento',
            ['Un asado en el parque', 'Una cena en un restaurante', 'Un viaje'],
            ['pt-festa', 'pt-convite'],
            'Escribe: «sábado que vem é o meu aniversário! Vou fazer uma festa no meu apartamento».',
          ),
          question(
            'pt.ex.15s3q69aqksk3y',
            CONVITE,
            '¿Qué tiene que llevar cada invitado?',
            'Una bebida',
            ['Comida', 'Un regalo', 'Nada'],
            ['pt-festa'],
            'Dice: «Cada um traz uma bebida e eu vou fazer a comida».',
          ),
          ex.shortAnswer(
            'Convide um amigo para a praia. (amanhã)',
            'Invita a un amigo a la playa mañana.',
            'Vamos à praia amanhã? Topa?',
            [
              'Vamos à praia amanhã?',
              'Você quer ir à praia amanhã?',
              'Praia amanhã? Topa?',
              'Topa ir à praia amanhã?',
            ],
            ['pt-topa', 'pt-convidar'],
            { id: 'pt.ex.w22bowjbo55nyj' },
          ),
          ex.translateWrite(
            '¡Gracias por la invitación!',
            'Obrigado pelo convite!',
            ['pt-convite'],
            {
              id: 'pt.ex.dfpo0tkcy1cn52',
              acceptedAnswers: [
                'Obrigada pelo convite!',
                'Obrigado pelo convite.',
                'Obrigada pelo convite.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Bora! Com certeza!',
        objective: 'Aceptar una invitación y cerrar el plan.',
        intro: {
          explanation:
            'Para aceptar: com certeza! («¡seguro!»), bora! (de vamos embora, muy informal: «¡vamos!») o eu topo! Para cerrar día y hora: combinado! («¡quedamos así!»). Marcar es «arreglar un encuentro»: vamos marcar um café?',
          examples: [
            { target: 'Churrasco no sábado? Bora!', base: '¿Asado el sábado? ¡De acuerdo!' },
            { target: 'Sábado às oito? Combinado!', base: '¿Sábado a las ocho? ¡Quedamos así!' },
          ],
        },
        takeaways: [
          'Aceptas: com certeza, bora, eu topo.',
          'Cierras el plan: combinado, vamos marcar.',
        ],
        exercises: [
          ex.translationChoice(
            'combinado',
            'trato hecho / quedamos así',
            ['combinado (mezcla)', 'cansado', 'invitado'],
            ['pt-combinado'],
            {
              id: 'pt.ex.72p6nvtvuup1zz',
            },
          ),
          ex.translationChoice(
            'com certeza',
            'seguro / claro que sí',
            ['con cuidado', 'tal vez', 'no sé'],
            ['pt-com-certeza'],
            {
              id: 'pt.ex.mh2fsongddcpgc',
            },
          ),
          ex.listenChoice(
            'Sábado às oito? Combinado!',
            [
              'Sábado às sete? Combinado!',
              'Sábado às oito? Com certeza!',
              'Domingo às oito? Combinado!',
            ],
            ['pt-combinado'],
            { id: 'pt.ex.xhynbrik1v64pv' },
          ),
          ex.fillBlank(
            'Vamos ___ um café na semana que vem?',
            '¿Arreglamos un café para la semana que viene?',
            'marcar',
            ['convidar', 'topar', 'combinado'],
            ['pt-marcar', 'pt-semana-que-vem'],
            { id: 'pt.ex.x9lj0kdl08m4g3' },
          ),
          ex.fillBlank(
            'Cinema hoje? ___!',
            '¿Cine hoy? ¡De acuerdo!',
            'Bora',
            ['Que pena', 'Não posso', 'Outro dia'],
            ['pt-bora'],
            { id: 'pt.ex.7lh9top4lt07te', skill: 'vocabulary' },
          ),
          question(
            'pt.ex.heu06bevo2mver',
            RESPOSTAS,
            '¿Qué va a llevar Theo?',
            'Guaraná',
            ['Comida', 'Un regalo', 'Nada, no va'],
            ['pt-com-certeza', 'pt-outro-dia'],
            'Theo responde: «Com certeza! Eu levo o guaraná».',
          ),
          question(
            'pt.ex.58a4ad4fzs6wi2',
            RESPOSTAS,
            '¿Qué dice Manu?',
            'Que va, pero va a llegar un poco tarde',
            ['Que no puede ir', 'Que va a llegar temprano', 'Que va a llevar la comida'],
            ['pt-bora'],
            'Manu escribe: «Bora! Vou chegar um pouco tarde, depois do trabalho».',
          ),
          ex.matchPairs(
            [
              ['bora!', '¡vamos! / ¡de acuerdo!'],
              ['combinado', 'trato hecho / quedamos así'],
              ['com certeza', 'seguro / claro que sí'],
              ['topa?', '¿te apuntas? / ¿te sumas?'],
            ],
            ['pt-bora', 'pt-combinado', 'pt-com-certeza', 'pt-topa'],
            { id: 'pt.ex.9z7i3iy3au3fgy' },
          ),
          ex.shortAnswer(
            'Churrasco no domingo, às duas. Você vem?',
            'Asado el domingo a las dos. ¿Vienes? (Acepta con entusiasmo.)',
            'Com certeza!',
            ['Bora!', 'Com certeza! Combinado.', 'Eu topo!', 'Combinado!', 'Vou, com certeza!'],
            ['pt-com-certeza'],
            { id: 'pt.ex.lvr495wyuy07yq' },
          ),
          ex.translateWrite(
            '¿Sábado a las ocho? ¡Quedamos así!',
            'Sábado às oito? Combinado!',
            ['pt-combinado'],
            { id: 'pt.ex.ejcdudydyn6qcm' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Que pena, não posso',
        objective: 'Rechazar una invitación con cortesía.',
        intro: {
          explanation:
            'Para decir que no, con cortesía: que pena, não posso («qué lástima, no puedo») y una razón con vou + verbo: vou trabalhar. Se cierra con fica para outro dia («queda para otro día»). Ocupado es igual que en español.',
          examples: [
            {
              target: 'Que pena, não posso. Vou trabalhar.',
              base: 'Qué lástima, no puedo. Voy a trabajar.',
            },
            {
              target: 'Hoje estou ocupado. Fica para outro dia?',
              base: 'Hoy estoy ocupado. ¿Lo dejamos para otro día?',
            },
          ],
        },
        takeaways: ['Rechazas con que pena, não posso.', 'Propones otro día: fica para outro dia.'],
        exercises: [
          ex.translationChoice(
            'que pena',
            'qué lástima',
            ['qué vergüenza', 'qué miedo', 'qué bueno'],
            ['pt-que-pena'],
            {
              id: 'pt.ex.954mgrjc8rs3x0',
              explanation: 'Que pena es «qué lástima».',
            },
          ),
          ex.listenChoice(
            'Que pena, eu não posso.',
            ['Que pena, ele não pode.', 'Que bom, eu posso.', 'Que pena, eu não vou.'],
            ['pt-que-pena', 'pt-nao-posso'],
            { id: 'pt.ex.70qvguh34bn6e2' },
          ),
          ex.fillBlank(
            'Que pena, hoje eu não ___. Vou trabalhar.',
            'Qué lástima, hoy no puedo. Voy a trabajar.',
            'posso',
            ['pode', 'quero', 'topo'],
            ['pt-nao-posso'],
            { id: 'pt.ex.di7uutchb4ryxv' },
          ),
          ex.fillBlank(
            'Estou muito ___ esta semana.',
            'Estoy muy ocupada esta semana.',
            'ocupada',
            ['ocupado', 'combinado', 'convidada'],
            ['pt-ocupado'],
            { id: 'pt.ex.urwv2tyq7evk9y', explanation: 'Lo dice una mujer: ocupada.' },
          ),
          ex.fillBlank(
            'Não dá hoje. Fica para ___ dia!',
            'Hoy no puedo. ¡Queda para otro día!',
            'outro',
            ['um', 'o', 'todo'],
            ['pt-outro-dia'],
            { id: 'pt.ex.qd17vtd11qyw6f' },
          ),
          question(
            'pt.ex.ml4148or47dgfs',
            LIGACAO,
            '¿Por qué Bia no puede ir el sábado?',
            'Porque va a viajar con sus padres',
            ['Porque tiene que trabajar', 'Porque no le gusta el asado', 'Porque está enferma'],
            ['pt-que-pena', 'pt-nao-posso'],
            'Bia dice: «Que pena, no sábado eu não posso. Vou viajar com os meus pais».',
          ),
          question(
            'pt.ex.zrz4322pgwik6n',
            LIGACAO,
            '¿Qué arreglan al final?',
            'Ir al cine el domingo',
            ['Hacer el asado el domingo', 'Viajar juntos', 'Nada'],
            ['pt-combinado', 'pt-topa'],
            'Marcos propone el cine el domingo y Bia dice: «No domingo eu topo! Combinado».',
          ),
          question(
            'pt.ex.ae5xutz88k9o12',
            RESPOSTAS,
            '¿Qué dice Caio de la fiesta?',
            'No puede ir porque va a estar en Curitiba',
            ['Va a llegar tarde', 'Va a llevar guaraná', 'Va a ir con su novia'],
            ['pt-que-pena', 'pt-outro-dia'],
            'Caio escribe: «Que pena, não vou poder ir. Vou estar em Curitiba».',
          ),
          ex.shortAnswer(
            'Vamos ao cinema hoje?',
            '¿Vamos al cine hoy? (Rechaza: qué lástima, no puedes, vas a estudiar.)',
            'Que pena, não posso. Vou estudar.',
            [
              'Que pena, eu não posso. Vou estudar.',
              'Que pena, hoje não posso. Vou estudar.',
              'Não posso, vou estudar.',
              'Que pena, não posso, vou estudar.',
            ],
            ['pt-que-pena', 'pt-nao-posso'],
            { id: 'pt.ex.wn1ce2py5xhdeh' },
          ),
          ex.translateWrite(
            'Qué lástima, hoy no puedo.',
            'Que pena, hoje eu não posso.',
            ['pt-que-pena', 'pt-nao-posso'],
            {
              id: 'pt.ex.r13ulfv2njd391',
              acceptedAnswers: ['Que pena, hoje não posso.', 'Que pena, eu não posso hoje.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Estou a fim de…',
        objective: 'Decir que tienes ganas de algo y combinar todo.',
        intro: {
          explanation:
            'A fim de es «con ganas de»: estou a fim de sair («tengo ganas de salir»); não estou a fim es una forma informal de decir que no. Con la invitación, la respuesta y el día, el plan está completo.',
          examples: [
            { target: 'Estou a fim de comer uma pizza.', base: 'Tengo ganas de comer una pizza.' },
            { target: 'Você está a fim de sair hoje?', base: '¿Tienes ganas de salir hoy?' },
          ],
        },
        takeaways: [
          'Dices que tienes ganas: estou a fim de…',
          'Armas un plan completo con día, hora y lugar.',
        ],
        exercises: [
          ex.translationChoice(
            'a fim de',
            'con ganas de',
            ['a fin de mes', 'al final de', 'antes de'],
            ['pt-a-fim-de'],
            { id: 'pt.ex.1ozib6jeq37jgv' },
          ),
          ex.fillBlank(
            'Hoje eu estou a ___ de ficar em casa.',
            'Hoy tengo ganas de quedarme en casa.',
            'fim',
            ['fins', 'final', 'vontade'],
            ['pt-a-fim-de'],
            { id: 'pt.ex.g56frv73ayewx1' },
          ),
          ex.listenChoice(
            'Você está a fim de sair hoje?',
            [
              'Você está a fim de sair amanhã?',
              'Você vai sair hoje?',
              'Você está a fim de comer hoje?',
            ],
            ['pt-a-fim-de'],
            { id: 'pt.ex.jcek102p05fsie' },
          ),
          question(
            'pt.ex.g3omcnmokox1u1',
            RECADO,
            '¿Qué le propone Vanessa a Gabi?',
            'Almorzar juntas pasado mañana',
            ['Cenar juntas mañana', 'Ir a una fiesta', 'Trabajar juntas el sábado'],
            ['pt-a-fim-de', 'pt-depois-de-amanha'],
            'Vanessa dice: «Você está a fim de almoçar comigo depois de amanhã?».',
          ),
          question(
            'pt.ex.yj5bus0zpgriaa',
            RECADO,
            '¿Dónde está el restaurante?',
            'Cerca de la oficina',
            ['Cerca de la casa de Gabi', 'En el centro', 'Lejos de la oficina'],
            ['pt-a-fim-de'],
            'Dice: «Tem um restaurante novo perto do escritório».',
          ),
          ex.matchPairs(
            [
              ['que pena', 'qué lástima'],
              ['não posso', 'no puedo'],
              ['outro dia', 'otro día'],
              ['a fim de', 'con ganas de'],
            ],
            ['pt-que-pena', 'pt-nao-posso', 'pt-outro-dia', 'pt-a-fim-de'],
            { id: 'pt.ex.p99o13bvalwujr' },
          ),
          ex.orderWords('Estou a fim de sair hoje.', 'Tengo ganas de salir hoy.', ['pt-a-fim-de'], {
            id: 'pt.ex.r48w6p4wn11ot3',
          }),
          ex.shortAnswer(
            'Você está a fim de jantar fora?',
            '¿Tienes ganas de cenar afuera? (Acepta y propón el sábado.)',
            'Com certeza! Vamos no sábado?',
            [
              'Bora! Vamos no sábado?',
              'Estou, sim! No sábado?',
              'Com certeza! No sábado?',
              'Sim! Vamos no sábado?',
            ],
            ['pt-com-certeza', 'pt-a-fim-de'],
            { id: 'pt.ex.lowuvao64qs4sp' },
          ),
          ex.translateWrite(
            'Tengo ganas de comer un asado.',
            'Estou a fim de comer um churrasco.',
            ['pt-a-fim-de', 'pt-churrasco'],
            {
              id: 'pt.ex.tglxto8rvo2l0t',
              acceptedAnswers: [
                'Eu estou a fim de comer um churrasco.',
                'Tô a fim de comer um churrasco.',
              ],
            },
          ),
        ],
      },
    ],
  },
};
