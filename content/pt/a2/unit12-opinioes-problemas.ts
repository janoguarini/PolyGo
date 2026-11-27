import type { PtUnitDef } from '../../pt-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * PT-BR A2 U12 «Opiniones y problemas» (docs/PT_A1_A2.md): dar una opinión (acho que, na minha
 * opinião), acordar y discrepar (concordo, discordo, tanto faz), condicionales sencillos (se + presente;
 * se der y se você quiser como expresiones fijas) y resolver problemas de todos los días (quebrou, não
 * funciona, a internet caiu, consertar, fazer uma reclamação).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const DEBATE = dialogue('pt.stim.a2-u12-debate', 'Dos amigos discuten dónde vivir.', [
  ['Léo', 'Acho que morar no centro é melhor. Tudo é perto e não preciso de carro.'],
  ['Carla', 'Discordo. Na minha opinião, o centro é muito barulhento e caro.'],
  ['Léo', 'É, isso é verdade. Mas no bairro você perde muito tempo no trânsito.'],
  ['Carla', 'Concordo. Mas eu prefiro a tranquilidade. Vale a pena!'],
]);

const RECLAMACAO = reading(
  'pt.stim.a2-u12-reclamacao',
  'email',
  'Un cliente escribe a su empresa de internet.',
  [
    'Prezados, venho fazer uma reclamação.',
    'Desde segunda-feira a internet cai todas as noites e o serviço não funciona.',
    'Já liguei três vezes e o problema ainda não foi resolvido.',
    'Se vocês não consertarem até sexta, vou cancelar o contrato.',
  ],
  { from: 'Henrique Melo', to: 'Atendimento NetCasa' },
);

const SUPORTE = dialogue('pt.stim.a2-u12-suporte', 'Una llamada al servicio técnico.', [
  ['Atendente', 'NetCasa, boa tarde. Como posso ajudar?'],
  ['Cliente', 'Boa tarde. A minha internet caiu de novo e o roteador não funciona.'],
  ['Atendente', 'Entendi. Se o senhor quiser, um técnico pode ir amanhã de manhã.'],
  ['Cliente', 'Pode ser. Se der, às nove, por favor.'],
]);

const ENQUETE = reading(
  'pt.stim.a2-u12-enquete',
  'post',
  'Las respuestas a una encuesta en una red social.',
  [
    'Pergunta do dia: trabalhar em casa ou no escritório?',
    'Bruna: Acho que em casa é melhor. Não perco tempo no ônibus.',
    'Igor: Discordo! No escritório eu converso com os colegas e trabalho mais.',
    'Sônia: Sei lá… Para mim tanto faz, se a internet funcionar!',
  ],
  { title: 'Enquete' },
);

export const PT_A2_U12: PtUnitDef = {
  names: [
    'Léo',
    'Carla',
    'Henrique',
    'Melo',
    'NetCasa',
    'Atendente',
    'Cliente',
    'Bruna',
    'Igor',
    'Sônia',
  ],
  support: [
    'choveu',
    'achei',
    'acham',
    'ideia',
    'preciso',
    'barulhento',
    'verdade',
    'perde',
    'prefiro',
    'tranquilidade',
    'converso',
    'enquete',
    'funcionar',
    'hambúrguer',
    'junto',
    'ter',
    'passo',
    'dar',
    'roteador',
    'entendi',
    'técnico',
    'ser',
    'aí',
    'quebra',
    'elevador',
    'funcionam',
    'conserta',
    'quebrar',
    'respondeu',
    'prezados',
    'venho',
    'consertarem',
    'cancelar',
    'contrato',
    'atendimento',
    'sushi',
    'pensei',
    'nisso',
  ],
  unit: {
    position: 12,
    title: 'Opiniones y problemas',
    titleEn: 'Opiniões e problemas',
    description:
      'Dar una opinión, acordar y discrepar, condicionales sencillos (se…), y resolver problemas de todos los días: algo se rompió, no funciona o se cortó internet.',
    emoji: '💡',
    objective:
      'Puedes dar y pedir opiniones, decir si estás de acuerdo, plantear condiciones simples y explicar un problema para que te lo resuelvan.',
    grammar: {
      title: 'Opinar · condicionales sencillos',
      explanation:
        'Opinar: acho que + verbo (acho que é melhor), na minha opinião. Acordar: concordo; discrepar: discordo. Condición posible: se + presente y el resultado en presente o con vou + verbo (se você tem tempo, a gente vai). Expresiones fijas muy usadas: se der («si se puede»), se você quiser («si quieres»).',
      examples: [
        {
          target: 'Acho que morar no centro é melhor.',
          base: 'Creo que vivir en el centro es mejor.',
        },
        {
          target: 'Se você tem tempo, a gente pode almoçar.',
          base: 'Si tienes tiempo, podemos almorzar.',
        },
        {
          target: 'O meu celular quebrou e não funciona.',
          base: 'Se me rompió el celular y no funciona.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U12). Sin revisión nativa: revisar el correo de reclamo y las expresiones se der / se você quiser.',
    },
    words: [
      w(
        'pt-acho-que',
        'acho que',
        'creo que / me parece que',
        'Acho que vai chover.',
        'Creo que va a llover.',
        ['opinions'],
        {
          acceptedTranslations: ['creo que', 'me parece que', 'pienso que'],
        },
      ),
      w(
        'pt-na-minha-opiniao',
        'na minha opinião',
        'en mi opinión',
        'Na minha opinião, o filme é ótimo.',
        'En mi opinión, la película es buenísima.',
        ['opinions'],
        {
          acceptedTranslations: ['para mí'],
        },
      ),
      w(
        'pt-concordo',
        'concordo',
        'estoy de acuerdo',
        'Concordo com você.',
        'Estoy de acuerdo contigo.',
        ['opinions'],
        {
          acceptedTexts: ['concorda'],
        },
      ),
      w(
        'pt-discordo',
        'discordo',
        'no estoy de acuerdo',
        'Discordo, acho que é caro.',
        'No estoy de acuerdo, creo que es caro.',
        ['opinions'],
        {
          acceptedTranslations: ['discrepo'],
        },
      ),
      w(
        'pt-tanto-faz',
        'tanto faz',
        'me da igual',
        'Pizza ou sushi? Tanto faz.',
        '¿Pizza o sushi? Me da igual.',
        ['opinions'],
        {
          acceptedTranslations: ['da igual', 'me da lo mismo'],
        },
      ),
      w(
        'pt-sei-la',
        'sei lá',
        'qué sé yo / no sé',
        'Sei lá, nunca pensei nisso.',
        'Qué sé yo, nunca lo pensé.',
        ['opinions'],
        {
          acceptedTranslations: ['qué sé yo', 'ni idea'],
        },
      ),
      w(
        'pt-vale-a-pena',
        'vale a pena',
        'vale la pena',
        'O curso é caro, mas vale a pena.',
        'El curso es caro, pero vale la pena.',
        ['opinions'],
      ),
      w(
        'pt-se-voce-quiser',
        'se você quiser',
        'si quieres',
        'Se você quiser, eu te ajudo.',
        'Si quieres, te ayudo.',
        ['conditions'],
        {
          acceptedTexts: ['se quiser'],
          acceptedTranslations: ['si quiere', 'si querés'],
        },
      ),
      w(
        'pt-se-der',
        'se der',
        'si se puede / si da',
        'Se der, eu passo aí amanhã.',
        'Si puedo, paso mañana.',
        ['conditions'],
        {
          acceptedTranslations: ['si puedo', 'si se puede'],
        },
      ),
      w(
        'pt-ainda',
        'ainda',
        'todavía / aún',
        'Ainda estou no trabalho.',
        'Todavía estoy en el trabajo.',
        ['time'],
        {
          acceptedTranslations: ['todavía', 'aún'],
        },
      ),
      w(
        'pt-quebrou',
        'quebrou',
        'se rompió',
        'O meu celular quebrou.',
        'Se me rompió el celular.',
        ['problems'],
        {
          acceptedTranslations: ['se rompió', 'se descompuso'],
        },
      ),
      w(
        'pt-nao-funciona',
        'não funciona',
        'no funciona',
        'O elevador não funciona.',
        'El ascensor no funciona.',
        ['problems'],
      ),
      w(
        'pt-internet-caiu',
        'a internet caiu',
        'se cortó internet',
        'A internet caiu de novo!',
        '¡Se cortó internet otra vez!',
        ['problems', 'technology'],
        {
          acceptedTranslations: ['se cayó internet', 'se fue internet'],
        },
      ),
      w(
        'pt-consertar',
        'consertar',
        'arreglar / reparar',
        'Você pode consertar o meu computador?',
        '¿Puedes arreglar mi computadora?',
        ['problems'],
        {
          acceptedTexts: ['consertei', 'consertou'],
          acceptedTranslations: ['arreglar', 'reparar'],
        },
      ),
      w(
        'pt-reclamacao',
        'reclamação',
        'reclamo / queja',
        'Quero fazer uma reclamação.',
        'Quiero hacer un reclamo.',
        ['problems'],
        {
          acceptedTranslations: ['reclamo', 'queja'],
        },
      ),
      w(
        'pt-resolver',
        'resolver',
        'resolver',
        'Vamos resolver o problema.',
        'Vamos a resolver el problema.',
        ['problems'],
        {
          acceptedTexts: ['resolvido', 'resolveu'],
        },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Acho que…',
        objective: 'Dar tu opinión.',
        intro: {
          explanation:
            'Achar es «encontrar», pero acho que es «creo que», «me parece que»: acho que é melhor. Na minha opinião es «en mi opinión». Para preguntar: o que você acha?',
          examples: [
            {
              target: 'Acho que morar no centro é melhor.',
              base: 'Creo que vivir en el centro es mejor.',
            },
            { target: 'O que você acha do filme?', base: '¿Qué te parece la película?' },
          ],
        },
        takeaways: ['Das tu opinión: acho que…, na minha opinião…', 'Preguntas: o que você acha?'],
        exercises: [
          ex.translationChoice(
            'acho que',
            'creo que / me parece que',
            ['encuentro que', 'sé que', 'digo que'],
            ['pt-acho-que'],
            { id: 'pt.ex.ilvpqlo4a7nzgh' },
          ),
          ex.translationChoice(
            'na minha opinião',
            'en mi opinión',
            ['en mi casa', 'a mi manera', 'en mi trabajo'],
            ['pt-na-minha-opiniao'],
            {
              id: 'pt.ex.oeszuvwi3rr008',
            },
          ),
          ex.listenChoice(
            'Acho que vai chover hoje.',
            [
              'Acho que vai fazer calor hoje.',
              'Acho que choveu hoje.',
              'Acho que vai chover amanhã.',
            ],
            ['pt-acho-que'],
            { id: 'pt.ex.l3t1ztpnts0l9u' },
          ),
          ex.fillBlank(
            'Eu ___ que o centro é muito caro.',
            'Creo que el centro es muy caro.',
            'acho',
            ['acha', 'achei', 'acham'],
            ['pt-acho-que'],
            { id: 'pt.ex.pderpwz13q9s70' },
          ),
          ex.fillBlank(
            'Na minha ___, o filme é ótimo.',
            'En mi opinión, la película es buenísima.',
            'opinião',
            ['ideia', 'casa', 'vez'],
            ['pt-na-minha-opiniao'],
            { id: 'pt.ex.155wl4p56f7o2f' },
          ),
          question(
            'pt.ex.l489463w5reu7k',
            DEBATE,
            '¿Qué piensa Léo de vivir en el centro?',
            'Que es mejor: todo queda cerca y no necesita auto',
            ['Que es caro y ruidoso', 'Que se pierde mucho tiempo', 'Que es tranquilo'],
            ['pt-acho-que'],
            'Léo dice: «Acho que morar no centro é melhor. Tudo é perto e não preciso de carro».',
          ),
          question(
            'pt.ex.4zmwi4wca9hqvj',
            DEBATE,
            '¿Qué opina Carla del centro?',
            'Que es muy ruidoso y caro',
            ['Que es lindo y barato', 'Que queda lejos', 'Que es mejor que el barrio'],
            ['pt-na-minha-opiniao', 'pt-discordo', 'pt-concordo', 'pt-vale-a-pena'],
            'Carla dice: «Na minha opinião, o centro é muito barulhento e caro».',
          ),
          ex.orderWords(
            'O que você acha do filme?',
            '¿Qué te parece la película?',
            ['pt-acho-que'],
            { id: 'pt.ex.rcqvkzmhkyek4e' },
          ),
          ex.shortAnswer(
            'O que você acha do português? (bonito)',
            '¿Qué te parece el portugués? (Responde que crees que es muy lindo.)',
            'Acho que é muito bonito.',
            [
              'Eu acho que é muito bonito.',
              'Acho muito bonito.',
              'Na minha opinião, é muito bonito.',
              'Acho que o português é muito bonito.',
            ],
            ['pt-acho-que'],
            { id: 'pt.ex.zzq3hmapnqkaid' },
          ),
          ex.translateWrite('Creo que es mejor.', 'Acho que é melhor.', ['pt-acho-que'], {
            id: 'pt.ex.kbbze8uu2z84im',
            acceptedAnswers: ['Eu acho que é melhor.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Concordo, discordo',
        objective: 'Decir si estás de acuerdo.',
        intro: {
          explanation:
            '«Estoy de acuerdo» es un solo verbo: concordo (com você). «No estoy de acuerdo»: discordo. Si te da igual: tanto faz. Si no sabes: sei lá (informal). Vale a pena es «vale la pena».',
          examples: [
            { target: 'Concordo com você.', base: 'Estoy de acuerdo contigo.' },
            {
              target: 'Pizza ou hambúrguer? Tanto faz.',
              base: '¿Pizza o hamburguesa? Me da igual.',
            },
          ],
        },
        takeaways: [
          'Acuerdas y discrepas: concordo, discordo.',
          'Dices que te da igual: tanto faz.',
        ],
        exercises: [
          ex.translationChoice(
            'concordo',
            'estoy de acuerdo',
            ['concuerdo (verbos)', 'recuerdo', 'no estoy de acuerdo'],
            ['pt-concordo'],
            {
              id: 'pt.ex.hh2nc9wbf5dgo8',
            },
          ),
          ex.translationChoice(
            'tanto faz',
            'me da igual',
            ['hace tanto', 'cuánto hace', 'tanto mejor'],
            ['pt-tanto-faz'],
            { id: 'pt.ex.dtfiy5d6johb4d' },
          ),
          ex.matchPairs(
            [
              ['concordo', 'estoy de acuerdo'],
              ['discordo', 'no estoy de acuerdo'],
              ['tanto faz', 'me da igual'],
              ['sei lá', 'qué sé yo / no sé'],
            ],
            ['pt-concordo', 'pt-discordo', 'pt-tanto-faz', 'pt-sei-la'],
            { id: 'pt.ex.tc0e1qsojp07gw' },
          ),
          ex.listenChoice(
            'Concordo com você.',
            ['Discordo de você.', 'Concordo com ela.', 'Converso com você.'],
            ['pt-concordo'],
            { id: 'pt.ex.s216yfsto72iev' },
          ),
          ex.fillBlank(
            'Eu ___ com você: é muito caro.',
            'Estoy de acuerdo contigo: es muy caro.',
            'concordo',
            ['discordo', 'acho', 'tanto faz'],
            ['pt-concordo'],
            { id: 'pt.ex.c2pje98o2jowg3' },
          ),
          question(
            'pt.ex.tx6qgwj8fgjmm2',
            DEBATE,
            '¿Por qué prefiere Carla el barrio?',
            'Por la tranquilidad: cree que vale la pena',
            ['Porque es más barato', 'Porque no hay tránsito', 'Porque tiene auto'],
            ['pt-concordo', 'pt-vale-a-pena'],
            'Carla dice: «Mas eu prefiro a tranquilidade. Vale a pena!».',
          ),
          question(
            'pt.ex.gw8iyuc1goqxc4',
            ENQUETE,
            '¿Qué opina Igor?',
            'No está de acuerdo: en la oficina charla con los compañeros y trabaja más',
            ['Que trabajar en casa es mejor', 'Que le da igual', 'Que no sabe'],
            ['pt-discordo'],
            'Igor escribe: «Discordo! No escritório eu converso com os colegas e trabalho mais».',
          ),
          question(
            'pt.ex.97sc9yl7itu4bo',
            ENQUETE,
            '¿Y Sônia?',
            'Le da igual, si internet funciona',
            ['Prefiere la oficina', 'Prefiere su casa', 'No trabaja'],
            ['pt-tanto-faz', 'pt-sei-la', 'pt-internet-caiu', 'pt-nao-funciona'],
            'Sônia escribe: «Sei lá… Para mim tanto faz, se a internet funcionar!».',
          ),
          ex.shortAnswer(
            'Acho que o curso é caro, mas é muito bom.',
            'Creo que el curso es caro, pero es muy bueno. (Di que estás de acuerdo y que vale la pena.)',
            'Concordo, vale a pena.',
            [
              'Concordo! Vale a pena.',
              'Concordo com você, vale a pena.',
              'Eu concordo, vale a pena.',
              'Concordo. Vale a pena!',
            ],
            ['pt-concordo', 'pt-vale-a-pena'],
            { id: 'pt.ex.5r4vj6u9scyuik' },
          ),
          ex.translateWrite(
            'No estoy de acuerdo contigo.',
            'Eu discordo de você.',
            ['pt-discordo'],
            {
              id: 'pt.ex.phf7fr8chzntes',
              acceptedAnswers: [
                'Discordo de você.',
                'Não concordo com você.',
                'Eu não concordo com você.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Se você quiser…',
        objective: 'Plantear condiciones sencillas.',
        intro: {
          explanation:
            'Una condición posible: se + presente y el resultado en presente o con vou + verbo: se você tem tempo, a gente vai. Hay expresiones fijas que vas a oír siempre: se você quiser («si quieres») y se der («si se puede»).',
          examples: [
            { target: 'Se você quiser, eu te ajudo.', base: 'Si quieres, te ayudo.' },
            { target: 'Se der, eu passo aí amanhã.', base: 'Si puedo, paso mañana.' },
          ],
        },
        takeaways: ['Planteas una condición con se.', 'Usas se der y se você quiser.'],
        exercises: [
          ex.translationChoice(
            'se der',
            'si se puede / si da',
            ['si das', 'si dice', 'se dio'],
            ['pt-se-der'],
            { id: 'pt.ex.9sml881pqm4qlj' },
          ),
          ex.translationChoice(
            'se você quiser',
            'si quieres',
            ['si quisiste', 'se quiere', 'si tú querías'],
            ['pt-se-voce-quiser'],
            {
              id: 'pt.ex.rl4bflr9z28ivh',
            },
          ),
          ex.listenChoice(
            'Se você quiser, eu te ajudo.',
            ['Se você quiser, eu te ligo.', 'Se ele quiser, eu ajudo.', 'Você quer ajuda?'],
            ['pt-se-voce-quiser', 'pt-te'],
            { id: 'pt.ex.cis53jahl5h1u5' },
          ),
          ex.fillBlank(
            'Se você ___ tempo, a gente almoça junto.',
            'Si tienes tiempo, almorzamos juntos.',
            'tem',
            ['tinha', 'teve', 'ter'],
            ['pt-tem'],
            { id: 'pt.ex.b1ovhxagf1dq2y', explanation: 'Condición posible: se + presente.' },
          ),
          ex.fillBlank(
            'Se ___, eu passo na sua casa amanhã.',
            'Si puedo, paso por tu casa mañana.',
            'der',
            ['dá', 'deu', 'dar'],
            ['pt-se-der'],
            { id: 'pt.ex.fp70whglzu9zes', explanation: 'Expresión fija: se der («si se puede»).' },
          ),
          question(
            'pt.ex.rswm7byd11k3ma',
            SUPORTE,
            '¿Qué ofrece la empresa?',
            'Mandar un técnico mañana por la mañana',
            ['Devolverle el dinero', 'Cambiar el contrato', 'Mandar un técnico hoy'],
            ['pt-se-voce-quiser', 'pt-internet-caiu', 'pt-nao-funciona'],
            'La atendente dice: «Se o senhor quiser, um técnico pode ir amanhã de manhã».',
          ),
          question(
            'pt.ex.wx3mcaatd5ikwp',
            SUPORTE,
            '¿A qué hora prefiere el cliente?',
            'A las nueve, si se puede',
            ['A las diez', 'A la tarde', 'Le da igual'],
            ['pt-se-der'],
            'El cliente dice: «Se der, às nove, por favor».',
          ),
          ex.orderWords(
            'Se você quiser eu te ajudo.',
            'Si quieres, te ayudo.',
            ['pt-se-voce-quiser'],
            { id: 'pt.ex.31pgoln9l40905' },
          ),
          ex.shortAnswer(
            'Você vem à festa amanhã?',
            '¿Vienes a la fiesta mañana? (Responde que si puedes, vas.)',
            'Se der, eu vou.',
            ['Se der, vou.', 'Se der, eu vou sim.', 'Vou, se der.', 'Se der, eu vou!'],
            ['pt-se-der'],
            { id: 'pt.ex.shqdyueq60scxa' },
          ),
          ex.translateWrite(
            'Si quieres, te llamo mañana.',
            'Se você quiser, eu te ligo amanhã.',
            ['pt-se-voce-quiser'],
            {
              id: 'pt.ex.739d020z34dxt5',
              acceptedAnswers: [
                'Se você quiser, te ligo amanhã.',
                'Se quiser, eu te ligo amanhã.',
                'Se quiser, te ligo amanhã.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Quebrou, não funciona',
        objective: 'Explicar que algo se rompió o no funciona.',
        intro: {
          explanation:
            'Quebrar es «romper»: o celular quebrou («se rompió el celular»), sin pronombre. Para algo que anda mal: não funciona. Si se corta internet: a internet caiu. Consertar es «arreglar».',
          examples: [
            { target: 'O meu celular quebrou.', base: 'Se me rompió el celular.' },
            { target: 'A internet caiu de novo!', base: '¡Se cortó internet otra vez!' },
          ],
        },
        takeaways: [
          'Explicas un problema: quebrou, não funciona.',
          'Pides que lo arreglen: consertar.',
        ],
        exercises: [
          ex.translationChoice(
            'quebrou',
            'se rompió',
            ['se quedó', 'se cortó', 'se perdió'],
            ['pt-quebrou'],
            { id: 'pt.ex.wv0ac5b9ln0xol' },
          ),
          ex.translationChoice(
            'consertar',
            'arreglar / reparar',
            ['conservar', 'concertar (una cita)', 'conectar'],
            ['pt-consertar'],
            {
              id: 'pt.ex.3tawbz7rtuafap',
            },
          ),
          ex.listenChoice(
            'A internet caiu de novo.',
            ['A internet não caiu.', 'O celular caiu de novo.', 'A internet voltou de novo.'],
            ['pt-internet-caiu'],
            { id: 'pt.ex.azlqr8er1qogmh' },
          ),
          ex.fillBlank(
            'O meu celular ___ e não liga.',
            'Se me rompió el celular y no prende.',
            'quebrou',
            ['quebra', 'consertou', 'funciona'],
            ['pt-quebrou'],
            { id: 'pt.ex.f94zy6r7x4kqcx' },
          ),
          ex.fillBlank(
            'O elevador não ___.',
            'El ascensor no funciona.',
            'funciona',
            ['funcionam', 'quebrou', 'conserta'],
            ['pt-nao-funciona'],
            { id: 'pt.ex.7hdmcu84ddca11' },
          ),
          ex.fillBlank(
            'Você pode ___ o meu computador?',
            '¿Puedes arreglar mi computadora?',
            'consertar',
            ['quebrar', 'funcionar', 'apagar'],
            ['pt-consertar', 'pt-computador'],
            { id: 'pt.ex.32jak92cnfltex' },
          ),
          question(
            'pt.ex.rxihdropqly9g2',
            SUPORTE,
            '¿Qué problema tiene el cliente?',
            'Se le cortó internet otra vez y el router no funciona',
            ['Se le rompió el celular', 'No le llega la factura', 'Quiere cambiar de plan'],
            ['pt-internet-caiu', 'pt-nao-funciona'],
            'Dice: «A minha internet caiu de novo e o roteador não funciona».',
          ),
          ex.orderWords(
            'O computador quebrou e não funciona.',
            'La computadora se rompió y no funciona.',
            ['pt-quebrou', 'pt-nao-funciona'],
            {
              id: 'pt.ex.i7jr15o7d024ab',
            },
          ),
          ex.shortAnswer(
            'Por que você não respondeu? (celular quebrou)',
            '¿Por qué no contestaste? (Responde que se te rompió el celular.)',
            'O meu celular quebrou.',
            [
              'Meu celular quebrou.',
              'Porque o meu celular quebrou.',
              'Porque meu celular quebrou.',
              'O celular quebrou.',
            ],
            ['pt-quebrou'],
            { id: 'pt.ex.phrdefreoyfc4r' },
          ),
          ex.translateWrite('Se cortó internet.', 'A internet caiu.', ['pt-internet-caiu'], {
            id: 'pt.ex.03e820trlkki8u',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Uma reclamação',
        objective: 'Hacer un reclamo y pedir una solución.',
        intro: {
          explanation:
            'Fazer uma reclamação es «hacer un reclamo». Ainda es «todavía»: o problema ainda não foi resolvido («todavía no se resolvió»). Para cerrar con una condición: se vocês não resolverem, vou cancelar.',
          examples: [
            { target: 'Quero fazer uma reclamação.', base: 'Quiero hacer un reclamo.' },
            { target: 'Ainda estou sem internet.', base: 'Todavía estoy sin internet.' },
          ],
        },
        takeaways: [
          'Haces un reclamo: fazer uma reclamação.',
          'Explicas que todavía no se resolvió: ainda não…',
        ],
        exercises: [
          ex.translationChoice(
            'reclamação',
            'reclamo / queja',
            ['recomendación', 'reunión', 'respuesta'],
            ['pt-reclamacao'],
            { id: 'pt.ex.h2hgb4ojdsfso1' },
          ),
          ex.translationChoice('ainda', 'todavía / aún', ['ya', 'nunca', 'antes'], ['pt-ainda'], {
            id: 'pt.ex.v8wgrmhippf2w3',
          }),
          ex.listenChoice(
            'Quero fazer uma reclamação.',
            ['Quero fazer uma reserva.', 'Quero fazer uma pergunta.', 'Quer fazer uma reclamação?'],
            ['pt-reclamacao'],
            { id: 'pt.ex.b8caif0x6r2voq' },
          ),
          ex.fillBlank(
            'O problema ___ não foi resolvido.',
            'El problema todavía no se resolvió.',
            'ainda',
            ['já', 'nunca', 'então'],
            ['pt-ainda', 'pt-resolver'],
            { id: 'pt.ex.j43unrsugymxfw' },
          ),
          question(
            'pt.ex.fjr8wi3xm6hscd',
            RECLAMACAO,
            '¿Qué problema tiene Henrique?',
            'Internet se corta todas las noches desde el lunes',
            ['Le cobraron de más', 'No tiene internet desde el viernes', 'El técnico no fue'],
            ['pt-internet-caiu', 'pt-reclamacao'],
            'Escribe: «Desde segunda-feira a internet cai todas as noites».',
          ),
          question(
            'pt.ex.pcl6gqek0t94ib',
            RECLAMACAO,
            '¿Qué hizo antes de escribir?',
            'Llamó tres veces, pero todavía no lo resolvieron',
            ['Fue a la oficina', 'Cambió el router', 'Nada'],
            ['pt-ainda', 'pt-resolver'],
            'Dice: «Já liguei três vezes e o problema ainda não foi resolvido».',
          ),
          question(
            'pt.ex.d3dqhw08av89s9',
            RECLAMACAO,
            '¿Qué va a hacer si no lo arreglan?',
            'Cancelar el contrato',
            ['Llamar otra vez', 'Pagar menos', 'Escribir en una red social'],
            ['pt-consertar'],
            'Al final: «Se vocês não consertarem até sexta, vou cancelar o contrato».',
          ),
          ex.orderWords(
            'Vamos resolver o problema amanhã.',
            'Vamos a resolver el problema mañana.',
            ['pt-resolver'],
            { id: 'pt.ex.29wpgubz0b5vz8' },
          ),
          ex.shortAnswer(
            'Atendimento, bom dia. Como posso ajudar?',
            'Atención al cliente, buenos días. ¿En qué puedo ayudar? (Di que quieres hacer un reclamo: se cortó internet.)',
            'Quero fazer uma reclamação. A internet caiu.',
            [
              'Bom dia, quero fazer uma reclamação. A internet caiu.',
              'Eu quero fazer uma reclamação: a internet caiu.',
              'Quero fazer uma reclamação, a internet caiu.',
            ],
            ['pt-reclamacao', 'pt-internet-caiu'],
            { id: 'pt.ex.era727dc0tmscg' },
          ),
          ex.translateWrite(
            'Todavía estoy sin internet.',
            'Ainda estou sem internet.',
            ['pt-ainda'],
            {
              id: 'pt.ex.c6wsp8qbgem2wv',
              acceptedAnswers: ['Eu ainda estou sem internet.'],
            },
          ),
        ],
      },
    ],
  },
};
