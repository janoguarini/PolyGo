import { languageConfig } from '../../../shared/languages';
import { exercisesFor } from '../../builders';
import type { UnitDef, WordDef } from '../../types';

const ex = exercisesFor(languageConfig('pt'));

const w = (
  id: string,
  text: string,
  translation: string,
  exampleEn: string,
  exampleEs: string,
  tags: string[],
  extra: Partial<WordDef> = {},
): WordDef => ({ id, text, translation, exampleEn, exampleEs, tags, ...extra });

/**
 * Variante de Brasil. Redactada sin revisión de un hablante nativo: necesita revisión lingüística.
 * Onde (U6), de quem (U5) y a que horas (U9) ya están. Porque, caro y barato son cognados: no van
 * en ejercicios de traducción. Falso amigo: apelido es «apodo» (el apellido es sobrenome).
 */
export const unit12: UnitDef = {
  position: 12,
  title: 'Preguntas y precios',
  titleEn: 'Perguntas',
  description:
    'Preguntar qué, quién, cuándo, por qué y cuál, preguntar cuánto cuesta algo y el falso amigo apelido.',
  emoji: '❓',
  objective:
    'Podés preguntar con o que, quem, quando, por que y qual, responder con porque, preguntar quanto custa? / quanto custam? y decir si algo es caro o barato.',
  grammar: {
    title: 'Palabras para preguntar · por que / porque',
    explanation:
      'La palabra de pregunta va al principio: o que? (¿qué?), quem? (¿quién?), quando? (¿cuándo?), qual? (¿cuál?). Para «¿por qué?» se escribe por que, separado; para responder, porque, junto. El precio: quanto custa? con una cosa y quanto custam? con varias.',
    examples: [
      { target: 'O que você faz? — Eu estudo.', base: '¿Qué hacés? — Estudio.' },
      {
        target: 'Por que você estuda português? — Porque eu gosto.',
        base: '¿Por qué estudiás portugués? — Porque me gusta.',
      },
      { target: 'Quanto custa a camiseta?', base: '¿Cuánto cuesta la remera?' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de portugués de Brasil (por que / porque, reais, tá bom).',
  },
  words: [
    w('pt-o-que', 'o que?', '¿qué?', 'O que você quer?', '¿Qué querés?', ['questions'], {
      acceptedTexts: ['que?', 'o quê?'],
    }),
    w(
      'pt-quem',
      'quem?',
      '¿quién?',
      'Quem é ele? — É meu irmão.',
      '¿Quién es él? — Es mi hermano.',
      ['questions'],
    ),
    w(
      'pt-quando',
      'quando?',
      '¿cuándo?',
      'Quando você vai para a praia?',
      '¿Cuándo vas a la playa?',
      ['questions'],
    ),
    w(
      'pt-por-que',
      'por que?',
      '¿por qué?',
      'Por que você estuda português?',
      '¿Por qué estudiás portugués?',
      ['questions'],
    ),
    w('pt-porque', 'porque', 'porque', 'Eu estudo porque gosto.', 'Estudio porque me gusta.', [
      'questions',
    ]),
    w('pt-qual', 'qual?', '¿cuál?', 'Qual é o seu nome?', '¿Cuál es tu nombre?', ['questions']),
    w(
      'pt-quanto-custa',
      'quanto custa?',
      '¿cuánto cuesta?',
      'Quanto custa a passagem?',
      '¿Cuánto cuesta el pasaje?',
      ['shopping', 'questions'],
    ),
    w(
      'pt-quanto-custam',
      'quanto custam?',
      '¿cuánto cuestan?',
      'Quanto custam os sapatos?',
      '¿Cuánto cuestan los zapatos?',
      ['shopping', 'questions'],
    ),
    w(
      'pt-reais',
      'reais',
      'reales (dinero)',
      'Custa dez reais.',
      'Cuesta diez reales.',
      ['shopping'],
      {
        acceptedTranslations: ['reales'],
        emoji: '💵',
      },
    ),
    w('pt-caro', 'caro', 'caro', 'O restaurante é caro.', 'El restaurante es caro.', ['shopping']),
    w('pt-barato', 'barato', 'barato', 'O pão é barato.', 'El pan es barato.', ['shopping']),
    w(
      'pt-camiseta',
      'camiseta',
      'remera',
      'A camiseta é azul.',
      'La remera es azul.',
      ['shopping', 'clothes'],
      {
        acceptedTranslations: ['playera'],
        emoji: '👕',
      },
    ),
    w(
      'pt-sapato',
      'sapato',
      'zapato',
      'O sapato é preto.',
      'El zapato es negro.',
      ['shopping', 'clothes'],
      {
        emoji: '👞',
      },
    ),
    w(
      'pt-passagem',
      'passagem',
      'pasaje',
      'Uma passagem para o Rio, por favor.',
      'Un pasaje a Río, por favor.',
      ['shopping'],
      { acceptedTranslations: ['boleto', 'billete'], emoji: '🎫' },
    ),
    w('pt-apelido', 'apelido', 'apodo', 'Meu apelido é Juca.', 'Mi apodo es Juca.', ['questions'], {
      acceptedTranslations: ['sobrenombre'],
    }),
    w('pt-sobrenome', 'sobrenome', 'apellido', 'Qual é o seu sobrenome?', '¿Cuál es tu apellido?', [
      'questions',
    ]),
    w(
      'pt-ta-bom',
      'tá bom',
      'está bien',
      'Dez reais? Tá bom.',
      '¿Diez reales? Está bien.',
      ['courtesy'],
      {
        acceptedTranslations: ['dale', 'de acuerdo'],
        acceptedTexts: ['está bom'],
      },
    ),
  ],
  lessons: [
    {
      title: 'O que? Quem?',
      objective: 'Preguntar qué y quién.',
      intro: {
        explanation:
          'O que? es «¿qué?» (o que você quer? «¿qué querés?») y quem? es «¿quién?». Al final de la frase, que lleva acento: você quer o quê?',
        examples: [
          { target: 'O que você quer?', base: '¿Qué querés?' },
          { target: 'Quem é ela? — É minha irmã.', base: '¿Quién es ella? — Es mi hermana.' },
        ],
      },
      takeaways: ['Preguntás qué con o que?', 'Preguntás quién con quem?'],
      exercises: [
        ex.translationChoice('quem?', '¿quién?', ['¿qué?', '¿cuándo?', '¿cuál?'], ['pt-quem']),
        ex.translationChoice('o que?', '¿qué?', ['¿quién?', '¿dónde?', '¿cuánto?'], ['pt-o-que']),
        ex.listenChoice(
          'Quem é ela?',
          ['Quem é ele?', 'Onde está ela?', 'O que é isso?'],
          ['pt-quem', 'pt-ela'],
        ),
        ex.fillBlank(
          '___ é ele? — É meu pai.',
          '¿Quién es él? — Es mi papá.',
          'Quem',
          ['O que', 'Quando', 'Onde'],
          ['pt-quem', 'pt-ele', 'pt-pai'],
        ),
        ex.fillBlank(
          'O ___ você quer? — Um café.',
          '¿Qué querés? — Un café.',
          'que',
          ['quem', 'qual', 'quando'],
          ['pt-o-que', 'pt-quero'],
        ),
        ex.orderWords('O que você quer comer?', '¿Qué querés comer?', ['pt-o-que', 'pt-voce']),
        ex.shortAnswer(
          'O que você estuda?',
          '¿Qué estudiás? (Respondé que estudiás portugués.)',
          'Eu estudo português.',
          ['Estudo português.', 'Português.'],
          ['pt-estudo'],
        ),
        ex.translateWrite('¿Quién es ella?', 'Quem é ela?', ['pt-quem', 'pt-ela']),
      ],
    },
    {
      title: 'Quando? Por que?',
      objective: 'Preguntar cuándo y por qué, y explicar.',
      intro: {
        explanation:
          'Quando? es «¿cuándo?». Para preguntar «¿por qué?» se escribe separado: por que?; para responder, junto: porque. Suenan igual.',
        examples: [
          {
            target: 'Quando você trabalha? — Segunda-feira.',
            base: '¿Cuándo trabajás? — El lunes.',
          },
          {
            target: 'Por que você estuda? — Porque eu gosto.',
            base: '¿Por qué estudiás? — Porque me gusta.',
          },
        ],
      },
      takeaways: [
        'Preguntás cuándo con quando?',
        'Distinguís por que? (pregunta) y porque (respuesta).',
      ],
      exercises: [
        ex.translationChoice(
          'quando?',
          '¿cuándo?',
          ['¿cuánto?', '¿quién?', '¿a qué hora?'],
          ['pt-quando'],
        ),
        ex.translationChoice(
          'por que?',
          '¿por qué?',
          ['¿para qué?', '¿cuál?', '¿qué?'],
          ['pt-por-que'],
        ),
        ex.listenChoice(
          'Quando você vai para a praia?',
          [
            'Por que você vai para a praia?',
            'Quando você vai para a escola?',
            'Você gosta da praia?',
          ],
          ['pt-quando', 'pt-vai', 'pt-praia'],
        ),
        ex.fillBlank(
          'Eu estudo português ___ gosto do Brasil.',
          'Estudio portugués porque me gusta Brasil.',
          'porque',
          ['por que', 'quando', 'também'],
          ['pt-estudo', 'pt-porque', 'pt-gosto-de', 'pt-do'],
          { explanation: 'Para responder va junto: porque.' },
        ),
        ex.fillBlank(
          '___ você não gosta de leite?',
          '¿Por qué no te gusta la leche?',
          'Por que',
          ['Porque', 'Quando', 'Quem'],
          ['pt-por-que', 'pt-gosta-de', 'pt-leite'],
          { explanation: 'Para preguntar va separado: por que?' },
        ),
        ex.orderWords('Quando você trabalha?', '¿Cuándo trabajás?', [
          'pt-quando',
          'pt-voce',
          'pt-trabalho',
        ]),
        ex.shortAnswer(
          'Por que você estuda português?',
          '¿Por qué estudiás portugués? (Respondé que porque te gusta.)',
          'Porque eu gosto.',
          ['Porque gosto.', 'Porque eu gosto de português.', 'Porque gosto de português.'],
          ['pt-porque', 'pt-gosto-de'],
        ),
        ex.translateWrite(
          '¿Cuándo vas a la playa?',
          'Quando você vai para a praia?',
          ['pt-quando', 'pt-vai', 'pt-praia'],
          { acceptedAnswers: ['Quando você vai pra praia?', 'Quando vai para a praia?'] },
        ),
      ],
    },
    {
      title: 'Qual é o seu apelido?',
      objective: 'Preguntar cuál y evitar un falso amigo.',
      intro: {
        explanation:
          'Qual? es «¿cuál?»: qual é o seu nome? Ojo con el falso amigo: apelido es «apodo»; el apellido se dice sobrenome.',
        examples: [
          { target: 'Qual é o seu sobrenome? — Silva.', base: '¿Cuál es tu apellido? — Silva.' },
          { target: 'Meu apelido é Juca.', base: 'Mi apodo es Juca.' },
        ],
      },
      takeaways: [
        'Preguntás cuál con qual?',
        'Sabés que apelido es «apodo» y sobrenome «apellido».',
      ],
      exercises: [
        ex.translationChoice('qual?', '¿cuál?', ['¿cuánto?', '¿cómo?', '¿quién?'], ['pt-qual']),
        ex.translationChoice('apelido', 'apodo', ['apellido', 'nombre', 'edad'], ['pt-apelido'], {
          explanation: 'Falso amigo: apelido es el apodo; el apellido es sobrenome.',
        }),
        ex.translationChoice(
          'sobrenome',
          'apellido',
          ['apodo', 'nombre', 'número'],
          ['pt-sobrenome'],
        ),
        ex.listenChoice(
          'Qual é o seu sobrenome?',
          ['Qual é o seu apelido?', 'Qual é o seu nome?', 'Quem é o seu amigo?'],
          ['pt-qual', 'pt-sobrenome'],
        ),
        ex.fillBlank(
          '___ é o seu nome?',
          '¿Cuál es tu nombre?',
          'Qual',
          ['Quem', 'Quando', 'Quanto'],
          ['pt-qual'],
          { explanation: 'Con é + sustantivo se pregunta qual: qual é o seu nome?' },
        ),
        ex.matchPairs(
          [
            ['quem?', '¿quién?'],
            ['quando?', '¿cuándo?'],
            ['qual?', '¿cuál?'],
            ['por que?', '¿por qué?'],
          ],
          ['pt-quem', 'pt-quando', 'pt-qual', 'pt-por-que'],
        ),
        ex.orderWords('Meu apelido é Juca.', 'Mi apodo es Juca.', ['pt-meu', 'pt-apelido']),
        ex.shortAnswer(
          'Qual é o seu sobrenome?',
          '¿Cuál es tu apellido? (Respondé que es García.)',
          'Meu sobrenome é García.',
          ['É García.', 'García.', 'Meu sobrenome é Garcia.', 'É Garcia.', 'Garcia.'],
          ['pt-meu', 'pt-sobrenome'],
        ),
        ex.translateWrite(
          '¿Cuál es tu apodo?',
          'Qual é o seu apelido?',
          ['pt-qual', 'pt-apelido'],
          {
            acceptedAnswers: ['Qual é seu apelido?', 'Qual é o teu apelido?'],
          },
        ),
      ],
    },
    {
      title: 'Quanto custa?',
      objective: 'Preguntar precios.',
      intro: {
        explanation:
          'Quanto custa? es «¿cuánto cuesta?» y quanto custam? «¿cuánto cuestan?» (varias cosas). La moneda de Brasil es el real; en plural, reais: dez reais.',
        examples: [
          {
            target: 'Quanto custa a camiseta? — Vinte reais.',
            base: '¿Cuánto cuesta la remera? — Veinte reales.',
          },
          { target: 'Quanto custam os sapatos?', base: '¿Cuánto cuestan los zapatos?' },
        ],
      },
      takeaways: ['Preguntás el precio con quanto custa?', 'Entendés precios en reais.'],
      exercises: [
        ex.imageChoice('👕', 'camiseta', ['sapato', 'passagem', 'caneta'], ['pt-camiseta']),
        ex.imageChoice('👞', 'sapato', ['camiseta', 'chave', 'cama'], ['pt-sapato']),
        ex.imageChoice('🎫', 'passagem', ['camiseta', 'livro', 'janela'], ['pt-passagem']),
        ex.listenChoice(
          'Quanto custa a passagem?',
          ['Quanto custam as passagens?', 'Onde fica a estação?', 'Quantos anos você tem?'],
          ['pt-quanto-custa', 'pt-passagem'],
        ),
        ex.listenChoice(
          'Custa dez reais.',
          ['Custa doze reais.', 'Custa dois reais.', 'Custam dez reais.'],
          ['pt-reais', 'pt-dez'],
        ),
        ex.fillBlank(
          'Quanto ___ os sapatos?',
          '¿Cuánto cuestan los zapatos?',
          'custam',
          ['custa', 'são', 'tem'],
          ['pt-quanto-custam', 'pt-sapato'],
          { explanation: 'Os sapatos es plural: quanto custam?' },
        ),
        ex.orderWords('Quanto custa a camiseta?', '¿Cuánto cuesta la remera?', [
          'pt-quanto-custa',
          'pt-camiseta',
        ]),
        ex.translateWrite('¿Cuánto cuesta el pasaje?', 'Quanto custa a passagem?', [
          'pt-quanto-custa',
          'pt-passagem',
        ]),
        ex.translateWrite('¿Cuánto cuestan los zapatos?', 'Quanto custam os sapatos?', [
          'pt-quanto-custam',
          'pt-sapato',
        ]),
      ],
    },
    {
      title: 'Caro ou barato?',
      objective: 'Opinar sobre un precio y cerrar una compra.',
      intro: {
        explanation:
          'Caro y barato son iguales que en español. Muito caro es «muy caro». Para aceptar un precio se dice tá bom («está bien»), la forma corta de está bom.',
        examples: [
          { target: 'Cinquenta reais? É muito caro!', base: '¿Cincuenta reales? ¡Es muy caro!' },
          { target: 'Cinco reais? Tá bom.', base: '¿Cinco reales? Está bien.' },
        ],
      },
      takeaways: ['Decís si algo es caro o barato.', 'Aceptás un precio con tá bom.'],
      exercises: [
        ex.translationChoice(
          'tá bom',
          'está bien',
          ['muy caro', 'de nada', 'no me gusta'],
          ['pt-ta-bom'],
        ),
        ex.listenChoice(
          'É muito caro!',
          ['É muito barato!', 'É muito gostoso!', 'Não é caro.'],
          ['pt-muito', 'pt-caro'],
        ),
        ex.listenChoice(
          'Tá bom, obrigado.',
          ['Tudo bem, obrigado.', 'Tá bom, obrigada.', 'Bom dia, obrigado.'],
          ['pt-ta-bom', 'pt-obrigado'],
        ),
        ex.fillBlank(
          'O pão custa dois reais: é ___.',
          'El pan cuesta dos reales: es barato.',
          'barato',
          ['caro', 'longe', 'esquisito'],
          ['pt-pao', 'pt-dois', 'pt-reais', 'pt-barato'],
          { skill: 'vocabulary' },
        ),
        ex.fillBlank(
          'Vinte reais? ___ bom.',
          '¿Veinte reales? Está bien.',
          'Tá',
          ['É', 'Tem', 'Tudo'],
          ['pt-vinte', 'pt-ta-bom'],
        ),
        ex.orderWords('A camiseta é muito cara.', 'La remera es muy cara.', [
          'pt-camiseta',
          'pt-muito',
          'pt-caro',
        ]),
        ex.shortAnswer(
          'A passagem custa vinte reais.',
          'El pasaje cuesta veinte reales. (Respondé que está bien.)',
          'Tá bom.',
          ['Tá bom!', 'Está bom.', 'Tá bom, obrigado.', 'Tá bom, obrigada.'],
          ['pt-ta-bom'],
        ),
        ex.translateWrite(
          'Está bien, gracias.',
          'Tá bom, obrigado.',
          ['pt-ta-bom', 'pt-obrigado'],
          {
            acceptedAnswers: ['Tá bom, obrigada.', 'Está bom, obrigado.', 'Está bom, obrigada.'],
          },
        ),
      ],
    },
  ],
};
