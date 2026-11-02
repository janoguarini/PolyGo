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
 * Unidad piloto del portugués (variante de Brasil). Redactada sin revisión de un hablante nativo:
 * necesita revisión lingüística antes de publicarse para todos (ver docs/CONTENT_STANDARD.md).
 */
export const unit01: UnitDef = {
  position: 1,
  title: 'Saludos y presentaciones',
  titleEn: 'Cumprimentos e apresentações',
  description: 'Saludar, despedirte, agradecer y presentarte en portugués de Brasil.',
  emoji: '👋',
  objective:
    'Podés saludar según el momento del día, presentarte, preguntar cómo está alguien y responder con cortesía.',
  grammar: {
    title: 'Obrigado / obrigada',
    explanation:
      'Para agradecer, la palabra concuerda con quien habla: un hombre dice obrigado y una mujer, obrigada.',
    examples: [
      { target: 'Obrigado, Ana! (lo dice Pedro)', base: '¡Gracias, Ana!' },
      { target: 'Obrigada, Pedro! (lo dice Ana)', base: '¡Gracias, Pedro!' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de portugués de Brasil.',
  },
  words: [
    w('pt-oi', 'oi', 'hola (informal)', 'Oi, Lucas!', '¡Hola, Lucas!', ['greetings'], {
      acceptedTranslations: ['hola'],
    }),
    w('pt-tchau', 'tchau', 'chau', 'Tchau, até amanhã!', '¡Chau, hasta mañana!', ['greetings'], {
      acceptedTranslations: ['adiós'],
    }),
    w('pt-ate-logo', 'até logo', 'hasta luego', 'Tchau, até logo!', '¡Chau, hasta luego!', [
      'greetings',
    ]),
    w('pt-sim', 'sim', 'sí', 'Sim, obrigado.', 'Sí, gracias.', ['basics'], { emoji: '✅' }),
    w('pt-nao', 'não', 'no', 'Não, obrigada.', 'No, gracias.', ['basics'], { emoji: '❌' }),
    w(
      'pt-bom-dia',
      'bom dia',
      'buenos días',
      'Bom dia, professora!',
      '¡Buenos días, profesora!',
      ['greetings', 'time'],
      { emoji: '🌅' },
    ),
    w(
      'pt-boa-tarde',
      'boa tarde',
      'buenas tardes',
      'Boa tarde, senhor Silva.',
      'Buenas tardes, señor Silva.',
      ['greetings', 'time'],
      { emoji: '☀️' },
    ),
    w(
      'pt-boa-noite',
      'boa noite',
      'buenas noches',
      'Boa noite! Até amanhã.',
      '¡Buenas noches! Hasta mañana.',
      ['greetings', 'time'],
      { emoji: '🌙' },
    ),
    w(
      'pt-obrigado',
      'obrigado',
      'gracias (lo dice un hombre)',
      'Obrigado, Ana!',
      '¡Gracias, Ana!',
      ['courtesy'],
      {
        acceptedTranslations: ['gracias'],
      },
    ),
    w(
      'pt-obrigada',
      'obrigada',
      'gracias (lo dice una mujer)',
      'Obrigada, Pedro!',
      '¡Gracias, Pedro!',
      ['courtesy'],
      {
        acceptedTranslations: ['gracias'],
      },
    ),
    w('pt-de-nada', 'de nada', 'de nada', 'Obrigado! — De nada.', '¡Gracias! — De nada.', [
      'courtesy',
    ]),
    w('pt-desculpa', 'desculpa', 'perdón', 'Desculpa, Júlia!', '¡Perdón, Júlia!', ['courtesy'], {
      acceptedTranslations: ['disculpá', 'disculpa'],
    }),
    w(
      'pt-meu-nome-e',
      'meu nome é',
      'mi nombre es',
      'Meu nome é Rafael.',
      'Mi nombre es Rafael.',
      ['introductions'],
      {
        acceptedTranslations: ['me llamo'],
      },
    ),
    w(
      'pt-como-voce-se-chama',
      'como você se chama?',
      '¿cómo te llamás?',
      'Oi! Como você se chama?',
      '¡Hola! ¿Cómo te llamás?',
      ['introductions'],
      {
        acceptedTranslations: ['¿cómo te llamas?'],
      },
    ),
    w(
      'pt-prazer',
      'prazer',
      'mucho gusto',
      'Prazer, eu sou a Carla.',
      'Mucho gusto, soy Carla.',
      ['introductions'],
      {
        acceptedTranslations: ['encantado', 'encantada'],
        acceptedTexts: ['muito prazer'],
      },
    ),
    w('pt-eu', 'eu', 'yo', 'Eu sou o Tiago.', 'Yo soy Tiago.', ['pronouns']),
    w(
      'pt-tudo-bem',
      'tudo bem?',
      '¿todo bien?',
      'Oi, Marina! Tudo bem?',
      '¡Hola, Marina! ¿Todo bien?',
      ['questions'],
      {
        acceptedTranslations: ['¿cómo estás?', '¿qué tal?'],
      },
    ),
    w('pt-bem', 'bem', 'bien', 'Estou bem, obrigado.', 'Estoy bien, gracias.', ['basics']),
    w('pt-e-voce', 'e você?', '¿y vos?', 'Tudo bem. E você?', 'Todo bien. ¿Y vos?', ['questions'], {
      acceptedTranslations: ['¿y tú?', 'y vos', 'y tú'],
    }),
    w('pt-tambem', 'também', 'también', 'Eu também estou bem.', 'Yo también estoy bien.', [
      'basics',
    ]),
  ],
  lessons: [
    {
      title: 'Oi y tchau',
      objective: 'Saludar y despedirte; decir sí y no.',
      intro: {
        explanation:
          'En Brasil se saluda con oi y se despide con tchau, que se escribe así pero suena como «chau». Ojo con não: la «ão» se dice por la nariz.',
        examples: [
          { target: 'Oi, Lucas!', base: '¡Hola, Lucas!' },
          { target: 'Tchau, até logo!', base: '¡Chau, hasta luego!' },
          { target: 'Não, obrigada.', base: 'No, gracias.' },
        ],
      },
      takeaways: ['Saludás con oi y te despedís con tchau o até logo.', 'Decís sim y não.'],
      exercises: [
        ex.translationChoice('oi', 'hola (informal)', ['chau', 'sí', 'hasta luego'], ['pt-oi']),
        ex.imageChoice('✅', 'sim', ['não', 'oi', 'tchau'], ['pt-sim']),
        ex.imageChoice('❌', 'não', ['sim', 'oi', 'bem'], ['pt-nao']),
        ex.listenChoice('tchau', ['oi', 'sim', 'não'], ['pt-tchau']),
        ex.matchPairs(
          [
            ['oi', 'hola'],
            ['tchau', 'chau'],
            ['até logo', 'hasta luego'],
            ['sim', 'sí'],
          ],
          ['pt-oi', 'pt-tchau', 'pt-ate-logo', 'pt-sim'],
        ),
        ex.fillBlank(
          'Tchau, até ___!',
          '¡Chau, hasta luego!',
          'logo',
          ['bem', 'sim', 'oi'],
          ['pt-ate-logo'],
          { skill: 'vocabulary' },
        ),
        ex.translateWrite('No', 'não', ['pt-nao'], {
          explanation: 'Não lleva tilde (~) sobre la a: sin ella es otra cosa.',
        }),
        ex.translateWrite('Hasta luego', 'até logo', ['pt-ate-logo']),
      ],
    },
    {
      title: 'Bom dia y boa noite',
      objective: 'Saludar según el momento del día.',
      intro: {
        explanation:
          'Bom dia es para la mañana y boa tarde para la tarde. Boa noite sirve para saludar y para despedirte a la noche. Fijate: bom con día, boa con tarde y noite.',
        examples: [
          { target: 'Bom dia, professora!', base: '¡Buenos días, profesora!' },
          { target: 'Boa tarde, senhor Silva.', base: 'Buenas tardes, señor Silva.' },
          { target: 'Boa noite! Até amanhã.', base: '¡Buenas noches! Hasta mañana.' },
        ],
      },
      takeaways: [
        'Saludás con bom dia, boa tarde y boa noite.',
        'Boa noite sirve para saludar y para despedirte.',
      ],
      exercises: [
        ex.imageChoice('🌅', 'bom dia', ['boa noite', 'boa tarde', 'tchau'], ['pt-bom-dia']),
        ex.imageChoice('🌙', 'boa noite', ['bom dia', 'boa tarde', 'oi'], ['pt-boa-noite']),
        ex.translationChoice(
          'boa tarde',
          'buenas tardes',
          ['buenos días', 'buenas noches', 'hasta luego'],
          ['pt-boa-tarde'],
        ),
        ex.listenChoice('boa noite', ['bom dia', 'boa tarde', 'até logo'], ['pt-boa-noite']),
        ex.fillBlank(
          '___ dia, professora!',
          '¡Buenos días, profesora!',
          'Bom',
          ['Boa', 'Bem', 'Oi'],
          ['pt-bom-dia'],
          {
            explanation:
              'Dia es masculino: bom dia. Tarde y noite son femeninas: boa tarde, boa noite.',
          },
        ),
        ex.matchPairs(
          [
            ['bom dia', 'buenos días'],
            ['boa tarde', 'buenas tardes'],
            ['boa noite', 'buenas noches'],
          ],
          ['pt-bom-dia', 'pt-boa-tarde', 'pt-boa-noite'],
        ),
        ex.translateWrite('Buenos días', 'bom dia', ['pt-bom-dia']),
        ex.translateWrite('Buenas noches', 'boa noite', ['pt-boa-noite']),
      ],
    },
    {
      title: 'Obrigado y desculpa',
      objective: 'Agradecer, responder y disculparte.',
      intro: {
        explanation:
          'Para agradecer, un hombre dice obrigado y una mujer, obrigada. Se responde de nada. Desculpa sirve para pedir perdón.',
        examples: [
          { target: 'Obrigado! — De nada.', base: '¡Gracias! — De nada.' },
          { target: 'Obrigada, Pedro!', base: '¡Gracias, Pedro!', note: 'lo dice una mujer' },
          { target: 'Desculpa, Júlia!', base: '¡Perdón, Júlia!' },
        ],
      },
      takeaways: [
        'Agradecés con obrigado u obrigada, según quién habla.',
        'Respondés de nada y te disculpás con desculpa.',
      ],
      exercises: [
        ex.translationChoice(
          'obrigado',
          'gracias (lo dice un hombre)',
          ['de nada', 'perdón', 'por favor'],
          ['pt-obrigado'],
        ),
        ex.fillBlank(
          'Ana: «___, Pedro!»',
          'Ana: «¡Gracias, Pedro!»',
          'Obrigada',
          ['Obrigado', 'Desculpa', 'Prazer'],
          ['pt-obrigada', 'pt-obrigado'],
          {
            skill: 'grammar',
            explanation: 'Ana es mujer, así que dice obrigada (con a).',
          },
        ),
        ex.listenChoice('desculpa', ['de nada', 'obrigada', 'prazer'], ['pt-desculpa']),
        ex.fillBlank(
          'A: Obrigado! B: De ___.',
          'A: ¡Gracias! B: De nada.',
          'nada',
          ['bem', 'logo', 'dia'],
          ['pt-de-nada', 'pt-obrigado'],
          { skill: 'vocabulary' },
        ),
        ex.matchPairs(
          [
            ['obrigado', 'gracias'],
            ['desculpa', 'perdón'],
            ['tchau', 'chau'],
            ['sim', 'sí'],
          ],
          ['pt-obrigado', 'pt-desculpa', 'pt-tchau', 'pt-sim'],
        ),
        ex.translationChoice(
          'desculpa',
          'perdón',
          ['gracias (lo dice un hombre)', 'de nada', 'mucho gusto'],
          ['pt-desculpa'],
        ),
        ex.translateWrite('Ana le dice a Pedro: «¡Gracias!»', 'Obrigada!', ['pt-obrigada']),
        ex.translateWrite('Perdón', 'desculpa', ['pt-desculpa'], { acceptedAnswers: ['desculpe'] }),
      ],
    },
    {
      title: 'Meu nome é…',
      objective: 'Decir tu nombre y preguntar el de otra persona.',
      intro: {
        explanation:
          'Para presentarte decís meu nome é + tu nombre. Para preguntar: como você se chama? Al conocer a alguien se dice prazer o muito prazer.',
        examples: [
          { target: 'Meu nome é Rafael.', base: 'Mi nombre es Rafael.' },
          { target: 'Oi! Como você se chama?', base: '¡Hola! ¿Cómo te llamás?' },
          { target: 'Muito prazer!', base: '¡Mucho gusto!' },
        ],
      },
      takeaways: [
        'Te presentás con meu nome é + tu nombre.',
        'Preguntás el nombre con como você se chama?',
        'Al conocer a alguien decís prazer.',
      ],
      exercises: [
        ex.translationChoice(
          'meu nome é',
          'mi nombre es',
          ['mucho gusto', '¿todo bien?', 'yo'],
          ['pt-meu-nome-e'],
        ),
        ex.fillBlank(
          'Meu ___ é Rafael.',
          'Mi nombre es Rafael.',
          'nome',
          ['bem', 'dia', 'eu'],
          ['pt-meu-nome-e'],
          { skill: 'vocabulary' },
        ),
        ex.listenChoice(
          'como você se chama?',
          ['tudo bem?', 'e você?', 'meu nome é'],
          ['pt-como-voce-se-chama'],
        ),
        ex.orderWords('Meu nome é Carla.', 'Mi nombre es Carla.', ['pt-meu-nome-e']),
        ex.translationChoice(
          'prazer',
          'mucho gusto',
          ['por favor', 'de nada', 'mi nombre es'],
          ['pt-prazer'],
        ),
        ex.matchPairs(
          [
            ['eu', 'yo'],
            ['meu nome é', 'mi nombre es'],
            ['prazer', 'mucho gusto'],
          ],
          ['pt-eu', 'pt-meu-nome-e', 'pt-prazer'],
        ),
        ex.shortAnswer(
          'Oi! Como você se chama?',
          '¡Hola! ¿Cómo te llamás? (Respondé que te llamás Ana.)',
          'Meu nome é Ana.',
          ['Eu me chamo Ana.', 'Me chamo Ana.', 'Eu sou a Ana.', 'Sou a Ana.'],
          ['pt-meu-nome-e', 'pt-como-voce-se-chama'],
          {
            explanation:
              'También se dice eu me chamo Ana. En Brasil es común poner el artículo: eu sou a Ana.',
          },
        ),
        ex.translateWrite('¿Cómo te llamás?', 'Como você se chama?', ['pt-como-voce-se-chama'], {
          acceptedAnswers: ['Qual é o seu nome?', 'Qual o seu nome?'],
        }),
      ],
    },
    {
      title: 'Tudo bem?',
      objective: 'Preguntar y responder cómo está alguien.',
      intro: {
        explanation:
          'Tudo bem? es la forma más común de preguntar cómo está alguien. Se responde tudo bem o tudo bom, y se devuelve con e você?',
        examples: [
          { target: 'Oi, Marina! Tudo bem?', base: '¡Hola, Marina! ¿Todo bien?' },
          { target: 'Tudo bem. E você?', base: 'Todo bien. ¿Y vos?' },
          { target: 'Eu também estou bem.', base: 'Yo también estoy bien.' },
        ],
      },
      takeaways: [
        'Preguntás tudo bem? y respondés tudo bem.',
        'Devolvés la pregunta con e você?',
        'Decís «también» con também.',
      ],
      exercises: [
        ex.translationChoice(
          'tudo bem?',
          '¿todo bien?',
          ['¿cómo te llamás?', '¿y vos?', 'hasta luego'],
          ['pt-tudo-bem'],
        ),
        ex.translationChoice('também', 'también', ['bien', 'yo', 'sí'], ['pt-tambem']),
        ex.fillBlank(
          'Estou ___, obrigado.',
          'Estoy bien, gracias.',
          'bem',
          ['bom', 'boa', 'também'],
          ['pt-bem'],
          {
            explanation: 'Bem es «bien» (cómo estás); bom es «bueno»: bom dia.',
          },
        ),
        ex.listenChoice('e você?', ['tudo bem?', 'obrigado', 'até logo'], ['pt-e-voce']),
        ex.orderWords('Tudo bem, e você?', 'Todo bien, ¿y vos?', ['pt-tudo-bem', 'pt-e-voce']),
        ex.matchPairs(
          [
            ['bem', 'bien'],
            ['também', 'también'],
            ['eu', 'yo'],
            ['e você?', '¿y vos?'],
          ],
          ['pt-bem', 'pt-tambem', 'pt-eu', 'pt-e-voce'],
        ),
        ex.shortAnswer(
          'Oi! Tudo bem?',
          '¡Hola! ¿Todo bien?',
          'Tudo bem.',
          [
            'Tudo bem, e você?',
            'Tudo bom.',
            'Tudo bom, e você?',
            'Tudo bem, obrigado.',
            'Tudo bem, obrigada.',
            'Estou bem.',
            'Estou bem, obrigado.',
            'Estou bem, obrigada.',
          ],
          ['pt-tudo-bem', 'pt-bem'],
        ),
        ex.translateWrite(
          'Yo también estoy bien.',
          'Eu também estou bem.',
          ['pt-eu', 'pt-tambem', 'pt-bem'],
          {
            acceptedAnswers: ['Também estou bem.'],
          },
        ),
      ],
    },
  ],
};
