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

/** Variante de Brasil. Redactada sin revisión de un hablante nativo: necesita revisión lingüística. */
export const unit02: UnitDef = {
  position: 2,
  title: '¿Quién sos y de dónde sos?',
  titleEn: 'Quem é você e de onde você é?',
  description: 'El verbo ser, decir de dónde sos y hablar de otras personas.',
  emoji: '🌍',
  objective:
    'Podés decir quién sos y de dónde sos, preguntarle lo mismo a otra persona y hablar de alguien con ele y ela.',
  grammar: {
    title: 'Ser con eu, você, ele y ela',
    explanation:
      'Eu sou (yo soy) y, para você, ele y ela, la misma forma: é. En Brasil você es el «vos» de todos los días y va con el verbo como ele: você é.',
    examples: [
      { target: 'Eu sou argentina.', base: 'Yo soy argentina.' },
      { target: 'Você é brasileiro?', base: '¿Vos sos brasileño?' },
      { target: 'Ela é professora.', base: 'Ella es profesora.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de portugués de Brasil.',
  },
  words: [
    w('pt-sou', 'sou', 'soy', 'Eu sou o Lucas.', 'Yo soy Lucas.', ['verbs', 'to-be']),
    w(
      'pt-e-ser',
      'é',
      'es / sos (con você)',
      'Ela é minha amiga.',
      'Ella es mi amiga.',
      ['verbs', 'to-be'],
      {
        acceptedTranslations: ['es', 'sos'],
      },
    ),
    w('pt-voce', 'você', 'vos', 'Você é brasileiro?', '¿Vos sos brasileño?', ['pronouns'], {
      acceptedTranslations: ['tú', 'usted'],
    }),
    w('pt-ele', 'ele', 'él', 'Ele é o Pedro.', 'Él es Pedro.', ['pronouns']),
    w('pt-ela', 'ela', 'ella', 'Ela é de São Paulo.', 'Ella es de São Paulo.', ['pronouns']),
    w('pt-estudante', 'estudante', 'estudiante', 'Eu sou estudante.', 'Soy estudiante.', [
      'people',
    ]),
    w('pt-professor', 'professor', 'profesor', 'Ele é professor.', 'Él es profesor.', ['people']),
    w('pt-professora', 'professora', 'profesora', 'Ela é professora.', 'Ella es profesora.', [
      'people',
    ]),
    w('pt-amigo', 'amigo', 'amigo', 'O Lucas é meu amigo.', 'Lucas es mi amigo.', ['people']),
    w('pt-amiga', 'amiga', 'amiga', 'A Carla é minha amiga.', 'Carla es mi amiga.', ['people']),
    w(
      'pt-brasileiro',
      'brasileiro',
      'brasileño',
      'O Pedro é brasileiro.',
      'Pedro es brasileño.',
      ['nationalities'],
      { emoji: '🇧🇷' },
    ),
    w('pt-brasileira', 'brasileira', 'brasileña', 'A Júlia é brasileira.', 'Júlia es brasileña.', [
      'nationalities',
    ]),
    w(
      'pt-argentino',
      'argentino',
      'argentino',
      'Eu sou argentino.',
      'Soy argentino.',
      ['nationalities'],
      { emoji: '🇦🇷' },
    ),
    w('pt-argentina', 'argentina', 'argentina', 'Ela é argentina.', 'Ella es argentina.', [
      'nationalities',
    ]),
    w(
      'pt-espanhol',
      'espanhol',
      'español',
      'O Pablo é espanhol.',
      'Pablo es español.',
      ['nationalities'],
      { emoji: '🇪🇸' },
    ),
    w(
      'pt-de-onde',
      'de onde você é?',
      '¿de dónde sos?',
      'Oi! De onde você é?',
      '¡Hola! ¿De dónde sos?',
      ['questions'],
      {
        acceptedTranslations: ['¿de dónde eres?'],
      },
    ),
    w('pt-sou-de', 'sou de', 'soy de', 'Sou de Buenos Aires.', 'Soy de Buenos Aires.', [
      'introductions',
    ]),
  ],
  lessons: [
    {
      title: 'Eu sou…',
      objective: 'Decir quién sos con sou.',
      intro: {
        explanation:
          'Sou es «soy». En Brasil se dice mucho eu sou + nombre, y es común poner el artículo antes del nombre: eu sou o Lucas, eu sou a Ana.',
        examples: [
          { target: 'Eu sou o Lucas.', base: 'Yo soy Lucas.' },
          { target: 'Eu sou estudante.', base: 'Soy estudiante.' },
        ],
      },
      takeaways: [
        'Decís quién sos con eu sou.',
        'Decís a qué te dedicás: estudante, professor, professora.',
      ],
      exercises: [
        ex.translationChoice('sou', 'soy', ['es / sos (con você)', 'él', 'ella'], ['pt-sou']),
        ex.translationChoice(
          'estudante',
          'estudiante',
          ['profesor', 'amigo', 'brasileño'],
          ['pt-estudante'],
        ),
        ex.listenChoice('eu sou', ['você é', 'ele é', 'ela é'], ['pt-sou', 'pt-eu']),
        ex.fillBlank(
          'Eu ___ estudante.',
          'Soy estudiante.',
          'sou',
          ['é', 'são', 'tem'],
          ['pt-sou', 'pt-estudante'],
          {
            explanation: 'Con eu (yo) el verbo ser es sou.',
          },
        ),
        ex.fillBlank(
          'Ela é ___.',
          'Ella es profesora.',
          'professora',
          ['professor', 'estudantes', 'amigo'],
          ['pt-professora', 'pt-ela'],
          {
            explanation: 'Para una mujer: professora, con -a. Se escribe con doble s.',
          },
        ),
        ex.orderWords('Eu sou o Lucas.', 'Yo soy Lucas.', ['pt-sou', 'pt-eu']),
        ex.translateWrite('Soy estudiante.', 'Eu sou estudante.', ['pt-sou', 'pt-estudante'], {
          acceptedAnswers: ['Sou estudante.'],
        }),
        ex.translateWrite(
          'Él es profesor.',
          'Ele é professor.',
          ['pt-ele', 'pt-e-ser', 'pt-professor'],
          {
            explanation: 'Professor se escribe con doble s.',
          },
        ),
      ],
    },
    {
      title: 'Você, ele, ela',
      objective: 'Hablar de vos y de otras personas con é.',
      intro: {
        explanation:
          'Você es «vos» y se conjuga como ele (él) y ela (ella): você é, ele é, ela é. Tu existe, pero en gran parte de Brasil se usa você.',
        examples: [
          { target: 'Você é o Pedro?', base: '¿Vos sos Pedro?' },
          { target: 'Ela é de São Paulo.', base: 'Ella es de São Paulo.' },
        ],
      },
      takeaways: ['Usás é con você, ele y ela.', 'Tratás a la gente de você.'],
      exercises: [
        ex.translationChoice('você', 'vos', ['él', 'ella', 'yo'], ['pt-voce']),
        ex.translationChoice('ela', 'ella', ['él', 'vos', 'amiga'], ['pt-ela']),
        ex.fillBlank(
          'Você ___ o Pedro?',
          '¿Vos sos Pedro?',
          'é',
          ['sou', 'e', 'são'],
          ['pt-e-ser', 'pt-voce'],
          {
            explanation:
              'Con você el verbo es é, igual que con ele y ela. E sin tilde significa «y».',
          },
        ),
        ex.listenChoice('ele é', ['ela é', 'você é', 'eu sou'], ['pt-ele', 'pt-e-ser']),
        ex.matchPairs(
          [
            ['eu', 'yo'],
            ['você', 'vos'],
            ['ele', 'él'],
            ['ela', 'ella'],
          ],
          ['pt-eu', 'pt-voce', 'pt-ele', 'pt-ela'],
        ),
        ex.orderWords('Ela é minha amiga.', 'Ella es mi amiga.', [
          'pt-ela',
          'pt-e-ser',
          'pt-amiga',
        ]),
        ex.translateWrite('Ella es profesora.', 'Ela é professora.', [
          'pt-ela',
          'pt-e-ser',
          'pt-professora',
        ]),
        ex.translateWrite('¿Vos sos Pedro?', 'Você é o Pedro?', ['pt-voce', 'pt-e-ser'], {
          acceptedAnswers: ['Você é Pedro?'],
        }),
      ],
    },
    {
      title: 'Não sou…',
      objective: 'Negar y preguntar con ser.',
      intro: {
        explanation:
          'Para negar, não va antes del verbo: não sou, não é. En Brasil también se escucha mucho el não repetido al final: não sou não.',
        examples: [
          {
            target: 'Você é professor? — Não, não sou professor.',
            base: '¿Sos profesor? — No, no soy profesor.',
          },
          { target: 'Ele não é meu amigo.', base: 'Él no es mi amigo.' },
        ],
      },
      takeaways: [
        'Negás con não antes del verbo.',
        'Preguntás con la misma oración y entonación de pregunta.',
      ],
      exercises: [
        ex.fillBlank(
          'Ele ___ é professor.',
          'Él no es profesor.',
          'não',
          ['no', 'sim', 'e'],
          ['pt-nao', 'pt-ele', 'pt-professor'],
          {
            explanation: 'En portugués es não, con ~ y sonido nasal; no es la palabra en español.',
          },
        ),
        ex.translationChoice(
          'ele não é',
          'él no es',
          ['ella es', 'vos sos', 'yo no soy'],
          ['pt-ele', 'pt-nao'],
        ),
        ex.listenChoice('não sou', ['eu sou', 'você é', 'ela é'], ['pt-nao', 'pt-sou']),
        ex.orderWords('Ele não é meu amigo.', 'Él no es mi amigo.', [
          'pt-ele',
          'pt-nao',
          'pt-amigo',
        ]),
        ex.fillBlank(
          'A Carla é minha ___.',
          'Carla es mi amiga.',
          'amiga',
          ['amigo', 'professor', 'ele'],
          ['pt-amiga'],
          { skill: 'grammar' },
        ),
        ex.shortAnswer(
          'Você é professor?',
          '¿Sos profesor? (Respondé que no.)',
          'Não, não sou professor.',
          ['Não sou professor.', 'Não, não sou.', 'Não.'],
          ['pt-nao', 'pt-sou', 'pt-professor'],
        ),
        ex.translateWrite(
          'No soy profesora.',
          'Não sou professora.',
          ['pt-nao', 'pt-sou', 'pt-professora'],
          {
            acceptedAnswers: ['Eu não sou professora.'],
          },
        ),
        ex.translateWrite('Ella no es estudiante.', 'Ela não é estudante.', [
          'pt-ela',
          'pt-nao',
          'pt-estudante',
        ]),
      ],
    },
    {
      title: 'Nacionalidades',
      objective: 'Decir tu nacionalidad con la terminación correcta.',
      intro: {
        explanation:
          'Como en español, muchas nacionalidades cambian -o / -a: brasileiro / brasileira, argentino / argentina. Español es espanhol (nh suena como «ñ»).',
        examples: [
          { target: 'O Pedro é brasileiro.', base: 'Pedro es brasileño.' },
          { target: 'A Júlia é brasileira.', base: 'Júlia es brasileña.' },
          { target: 'O Pablo é espanhol.', base: 'Pablo es español.' },
        ],
      },
      takeaways: [
        'Decís tu nacionalidad con sou + nacionalidad.',
        'Cambiás -o por -a para una mujer.',
      ],
      exercises: [
        ex.imageChoice(
          '🇧🇷',
          'brasileiro',
          ['espanhol', 'argentino', 'professor'],
          ['pt-brasileiro'],
        ),
        ex.translationChoice(
          'espanhol',
          'español',
          ['brasileño', 'argentino', 'brasileña'],
          ['pt-espanhol'],
        ),
        ex.listenChoice('argentina', ['argentino', 'brasileira', 'espanhol'], ['pt-argentina']),
        ex.fillBlank(
          'A Júlia é ___.',
          'Júlia es brasileña.',
          'brasileira',
          ['brasileiro', 'espanhol', 'argentino'],
          ['pt-brasileira'],
          {
            explanation: 'Júlia es mujer: brasileira, con -a.',
          },
        ),
        ex.fillBlank(
          'Eu sou ___.',
          'Soy argentino.',
          'argentino',
          ['argentina', 'brasileira', 'espanhola'],
          ['pt-argentino', 'pt-sou'],
          { skill: 'grammar' },
        ),
        ex.orderWords('O Pablo é espanhol.', 'Pablo es español.', ['pt-espanhol']),
        ex.translateWrite(
          'Pedro es brasileño.',
          'O Pedro é brasileiro.',
          ['pt-brasileiro', 'pt-e-ser'],
          {
            acceptedAnswers: ['Pedro é brasileiro.'],
          },
        ),
        ex.translateWrite('Soy español.', 'Sou espanhol.', ['pt-sou', 'pt-espanhol'], {
          acceptedAnswers: ['Eu sou espanhol.'],
        }),
      ],
    },
    {
      title: 'De onde você é?',
      objective: 'Preguntar y decir de dónde sos.',
      intro: {
        explanation:
          'De onde você é? es «¿de dónde sos?». Se responde sou de + ciudad o país: sou de Rosario, sou da Argentina (de + a = da).',
        examples: [
          { target: 'De onde você é?', base: '¿De dónde sos?' },
          { target: 'Sou de Buenos Aires.', base: 'Soy de Buenos Aires.' },
          { target: 'Sou da Argentina.', base: 'Soy de Argentina.', note: 'de + a = da' },
        ],
      },
      takeaways: [
        'Preguntás de dónde es alguien con de onde você é?',
        'Respondés con sou de + ciudad.',
      ],
      exercises: [
        ex.translationChoice(
          'de onde você é?',
          '¿de dónde sos?',
          ['¿todo bien?', '¿cómo te llamás?', 'soy de'],
          ['pt-de-onde'],
        ),
        ex.listenChoice(
          'de onde você é?',
          ['tudo bem?', 'como você se chama?', 'e você?'],
          ['pt-de-onde'],
        ),
        ex.fillBlank(
          'Sou ___ Argentina.',
          'Soy de Argentina.',
          'da',
          ['de', 'do', 'em'],
          ['pt-sou-de'],
          {
            skill: 'grammar',
            explanation:
              'Antes de un país con artículo femenino, de + a = da: sou da Argentina. Con ciudades, sou de.',
          },
        ),
        ex.orderWords('Sou de Buenos Aires.', 'Soy de Buenos Aires.', ['pt-sou-de']),
        ex.matchPairs(
          [
            ['de onde você é?', '¿de dónde sos?'],
            ['sou de', 'soy de'],
            ['brasileiro', 'brasileño'],
            ['ele', 'él'],
          ],
          ['pt-de-onde', 'pt-sou-de', 'pt-brasileiro', 'pt-ele'],
        ),
        ex.shortAnswer(
          'Oi! De onde você é?',
          '¡Hola! ¿De dónde sos? (Respondé que sos de Córdoba.)',
          'Sou de Córdoba.',
          ['Eu sou de Córdoba.', 'Sou de Cordoba.', 'Eu sou de Cordoba.'],
          ['pt-de-onde', 'pt-sou-de'],
        ),
        ex.translateWrite('¿De dónde sos?', 'De onde você é?', ['pt-de-onde']),
        ex.translateWrite('Ella es de São Paulo.', 'Ela é de São Paulo.', ['pt-ela', 'pt-e-ser'], {
          acceptedAnswers: ['Ela é de Sao Paulo.'],
        }),
      ],
    },
  ],
};
