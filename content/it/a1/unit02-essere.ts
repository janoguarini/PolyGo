import { languageConfig } from '../../../shared/languages';
import { exercisesFor } from '../../builders';
import type { UnitDef, WordDef } from '../../types';

const ex = exercisesFor(languageConfig('it'));

const w = (
  id: string,
  text: string,
  translation: string,
  exampleEn: string,
  exampleEs: string,
  tags: string[],
  extra: Partial<WordDef> = {},
): WordDef => ({ id, text, translation, exampleEn, exampleEs, tags, ...extra });

/** Redactada sin revisión de un hablante nativo: necesita revisión lingüística. */
export const unit02: UnitDef = {
  position: 2,
  title: '¿Quién sos y de dónde sos?',
  titleEn: 'Chi sei e di dove sei?',
  description: 'El verbo essere, decir de dónde sos y hablar de otras personas.',
  emoji: '🌍',
  objective:
    'Podés decir quién sos y de dónde sos, preguntarle lo mismo a otra persona y hablar de alguien con lui y lei.',
  grammar: {
    title: 'Essere (ser) y la concordancia -o / -a',
    explanation:
      'Io sono, tu sei, lui/lei è. Las nacionalidades cambian como en español: italiano / italiana. Para negar, non va antes del verbo: non sono.',
    examples: [
      { target: 'Io sono argentina.', base: 'Yo soy argentina.' },
      { target: 'Lui è italiano.', base: 'Él es italiano.' },
      { target: 'Non sono spagnolo.', base: 'No soy español.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de italiano.',
  },
  words: [
    w('it-sono', 'sono', 'soy', 'Sono Marco.', 'Soy Marco.', ['verbs', 'to-be']),
    w('it-sei', 'sei', 'sos', 'Sei italiano?', '¿Sos italiano?', ['verbs', 'to-be'], {
      acceptedTranslations: ['eres'],
    }),
    w('it-e-essere', 'è', 'es', 'Lei è Giulia.', 'Ella es Giulia.', ['verbs', 'to-be']),
    w(
      'it-non',
      'non',
      'negación (antes del verbo)',
      'Non sono italiano.',
      'No soy italiano.',
      ['grammar'],
      {
        acceptedTranslations: ['no'],
      },
    ),
    w('it-lui', 'lui', 'él', 'Lui è Paolo.', 'Él es Paolo.', ['pronouns']),
    w('it-lei', 'lei', 'ella', 'Lei è di Roma.', 'Ella es de Roma.', ['pronouns']),
    w(
      'it-studente',
      'studente',
      'estudiante (varón)',
      'Sono uno studente.',
      'Soy estudiante.',
      ['people'],
      {
        acceptedTranslations: ['estudiante'],
      },
    ),
    w(
      'it-studentessa',
      'studentessa',
      'estudiante (mujer)',
      'Anna è una studentessa.',
      'Anna es estudiante.',
      ['people'],
      {
        acceptedTranslations: ['estudiante'],
      },
    ),
    w('it-amico', 'amico', 'amigo', 'Luca è un amico.', 'Luca es un amigo.', ['people']),
    w('it-amica', 'amica', 'amiga', 'Sara è la mia amica.', 'Sara es mi amiga.', ['people']),
    w(
      'it-italiano',
      'italiano',
      'italiano',
      'Marco è italiano.',
      'Marco es italiano.',
      ['nationalities'],
      { emoji: '🇮🇹' },
    ),
    w('it-italiana', 'italiana', 'italiana', 'Giulia è italiana.', 'Giulia es italiana.', [
      'nationalities',
    ]),
    w(
      'it-argentino',
      'argentino',
      'argentino',
      'Sono argentino.',
      'Soy argentino.',
      ['nationalities'],
      { emoji: '🇦🇷' },
    ),
    w('it-argentina', 'argentina', 'argentina', 'Lei è argentina.', 'Ella es argentina.', [
      'nationalities',
    ]),
    w(
      'it-spagnolo',
      'spagnolo',
      'español',
      'Pablo è spagnolo.',
      'Pablo es español.',
      ['nationalities'],
      { emoji: '🇪🇸' },
    ),
    w(
      'it-messicano',
      'messicano',
      'mexicano',
      'Carlos è messicano.',
      'Carlos es mexicano.',
      ['nationalities'],
      { emoji: '🇲🇽' },
    ),
    w(
      'it-di-dove-sei',
      'di dove sei?',
      '¿de dónde sos?',
      'Ciao! Di dove sei?',
      '¡Hola! ¿De dónde sos?',
      ['questions'],
      {
        acceptedTranslations: ['¿de dónde eres?'],
      },
    ),
    w('it-sono-di', 'sono di', 'soy de', 'Sono di Buenos Aires.', 'Soy de Buenos Aires.', [
      'introductions',
    ]),
  ],
  lessons: [
    {
      title: 'Io sono…',
      objective: 'Decir quién sos con sono.',
      intro: {
        explanation:
          'Sono es «soy». En italiano el pronombre io casi siempre se omite, igual que en español: sono Marco. Studente es para un varón y studentessa, para una mujer.',
        examples: [
          { target: 'Sono Marco.', base: 'Soy Marco.' },
          { target: 'Sono una studentessa.', base: 'Soy estudiante.', note: 'lo dice una mujer' },
        ],
      },
      takeaways: ['Decís quién sos con sono.', 'Usás studente o studentessa según quién habla.'],
      exercises: [
        ex.translationChoice('sono', 'soy', ['sos', 'es', 'él'], ['it-sono']),
        ex.translationChoice(
          'studentessa',
          'estudiante (mujer)',
          ['amiga', 'ella', 'italiana'],
          ['it-studentessa'],
        ),
        ex.listenChoice('sono', ['sei', 'è', 'non'], ['it-sono']),
        ex.fillBlank('Io ___ Marco.', 'Yo soy Marco.', 'sono', ['sei', 'è', 'mi'], ['it-sono'], {
          explanation: 'Con io (yo) el verbo essere es sono.',
        }),
        ex.fillBlank(
          'Anna è una ___.',
          'Anna es estudiante.',
          'studentessa',
          ['studente', 'amico', 'lui'],
          ['it-studentessa', 'it-e-essere'],
          {
            explanation: 'Anna es mujer: studentessa. Studente es para un varón.',
          },
        ),
        ex.orderWords('Io sono uno studente.', 'Yo soy estudiante.', ['it-sono', 'it-studente']),
        ex.translateWrite('Soy Marco.', 'Sono Marco.', ['it-sono'], {
          acceptedAnswers: ['Io sono Marco.'],
        }),
        ex.translateWrite(
          'Soy estudiante (varón).',
          'Sono uno studente.',
          ['it-sono', 'it-studente'],
          {
            acceptedAnswers: ['Sono studente.', 'Io sono uno studente.', 'Io sono studente.'],
            explanation: 'Delante de st- el artículo es uno: uno studente.',
          },
        ),
      ],
    },
    {
      title: 'Tu sei, lui è',
      objective: 'Hablar de vos y de otras personas con sei y è.',
      intro: {
        explanation:
          'Tu sei es «vos sos» y lui è / lei è, «él es / ella es». Ojo: è con tilde es «es»; sin tilde, e significa «y».',
        examples: [
          { target: 'Tu sei Luca?', base: '¿Vos sos Luca?' },
          { target: 'Lui è Paolo.', base: 'Él es Paolo.' },
          { target: 'Lei è la mia amica.', base: 'Ella es mi amiga.' },
        ],
      },
      takeaways: ['Usás sei con tu y è con lui o lei.', 'Distinguís è (es) de e (y).'],
      exercises: [
        ex.translationChoice('lui', 'él', ['ella', 'yo', 'amigo'], ['it-lui']),
        ex.translationChoice('lei', 'ella', ['él', 'amiga', 'sos'], ['it-lei']),
        ex.fillBlank('Tu ___ Luca?', '¿Vos sos Luca?', 'sei', ['sono', 'è', 'non'], ['it-sei'], {
          explanation: 'Con tu el verbo es sei.',
        }),
        ex.fillBlank(
          'Lei ___ Giulia.',
          'Ella es Giulia.',
          'è',
          ['e', 'sei', 'sono'],
          ['it-e-essere', 'it-lei'],
          {
            explanation: 'È con tilde es el verbo (es). E sin tilde significa «y».',
          },
        ),
        ex.listenChoice('lui è', ['lei è', 'tu sei', 'io sono'], ['it-lui', 'it-e-essere']),
        ex.matchPairs(
          [
            ['sono', 'soy'],
            ['sei', 'sos'],
            ['è', 'es'],
            ['lei', 'ella'],
          ],
          ['it-sono', 'it-sei', 'it-e-essere', 'it-lei'],
        ),
        ex.translateWrite('Él es Paolo.', 'Lui è Paolo.', ['it-lui', 'it-e-essere'], {
          acceptedAnswers: ['È Paolo.'],
        }),
        ex.translateWrite('¿Vos sos Anna?', 'Tu sei Anna?', ['it-sei'], {
          acceptedAnswers: ['Sei Anna?'],
        }),
      ],
    },
    {
      title: 'Non sono…',
      objective: 'Negar y preguntar con essere.',
      intro: {
        explanation:
          'Para negar, non va antes del verbo: non sono, non è. Una pregunta de sí o no es la misma oración con entonación de pregunta: Sei italiano?',
        examples: [
          {
            target: 'Sei italiano? — No, non sono italiano.',
            base: '¿Sos italiano? — No, no soy italiano.',
          },
          { target: 'Lui non è un amico.', base: 'Él no es un amigo.' },
        ],
      },
      takeaways: [
        'Negás con non antes del verbo.',
        'Preguntás con la misma oración y entonación de pregunta.',
      ],
      exercises: [
        ex.translationChoice(
          'non',
          'negación (antes del verbo)',
          ['sos', 'ella', 'amigo'],
          ['it-non'],
        ),
        ex.fillBlank(
          'No, ___ sono italiano.',
          'No, no soy italiano.',
          'non',
          ['no', 'sì', 'e'],
          ['it-non', 'it-italiano'],
          {
            explanation:
              'Antes del verbo va non. No sólo se usa como respuesta suelta: «No, non sono…».',
          },
        ),
        ex.listenChoice('non sono', ['sono', 'sei', 'è'], ['it-non', 'it-sono']),
        ex.orderWords('Lui non è italiano.', 'Él no es italiano.', [
          'it-lui',
          'it-non',
          'it-e-essere',
        ]),
        ex.translationChoice('amico', 'amigo', ['amiga', 'él', 'estudiante (varón)'], ['it-amico']),
        ex.shortAnswer(
          'Sei italiano?',
          '¿Sos italiano? (Respondé que no.)',
          'No, non sono italiano.',
          ['No, non sono italiano', 'Non sono italiano.', 'No.'],
          ['it-non', 'it-sono', 'it-sei'],
          {
            explanation: 'Se responde no y después la oración con non: No, non sono italiano.',
          },
        ),
        ex.translateWrite(
          'No soy estudiante (varón).',
          'Non sono uno studente.',
          ['it-non', 'it-sono', 'it-studente'],
          {
            acceptedAnswers: ['Non sono studente.', 'Io non sono uno studente.'],
          },
        ),
        ex.translateWrite(
          'Ella no es mi amiga.',
          'Lei non è la mia amica.',
          ['it-lei', 'it-non', 'it-amica'],
          {
            acceptedAnswers: ['Non è la mia amica.', 'Lei non è mia amica.'],
          },
        ),
      ],
    },
    {
      title: 'Nacionalidades',
      objective: 'Decir tu nacionalidad con la terminación correcta.',
      intro: {
        explanation:
          'Muchas nacionalidades terminan en -o para un varón y en -a para una mujer: italiano / italiana, argentino / argentina. Español es spagnolo y mexicano, messicano.',
        examples: [
          { target: 'Sono argentina.', base: 'Soy argentina.' },
          { target: 'Pablo è spagnolo.', base: 'Pablo es español.' },
          { target: 'Carlos è messicano.', base: 'Carlos es mexicano.' },
        ],
      },
      takeaways: [
        'Decís tu nacionalidad con sono + nacionalidad.',
        'Cambiás -o por -a si hablás de una mujer.',
      ],
      exercises: [
        ex.imageChoice('🇮🇹', 'italiano', ['spagnolo', 'messicano', 'argentino'], ['it-italiano']),
        ex.translationChoice(
          'spagnolo',
          'español',
          ['italiano', 'mexicano', 'argentino'],
          ['it-spagnolo'],
        ),
        ex.listenChoice('messicano', ['italiano', 'spagnolo', 'argentino'], ['it-messicano']),
        ex.fillBlank(
          'Giulia è ___.',
          'Giulia es italiana.',
          'italiana',
          ['italiano', 'spagnolo', 'messicano'],
          ['it-italiana', 'it-e-essere'],
          {
            explanation: 'Giulia es mujer: italiana, con -a.',
          },
        ),
        ex.fillBlank(
          'Lei è ___.',
          'Ella es argentina.',
          'argentina',
          ['argentino', 'spagnolo', 'messicano'],
          ['it-argentina', 'it-lei'],
          { skill: 'grammar' },
        ),
        ex.orderWords('Lui è spagnolo.', 'Él es español.', ['it-lui', 'it-spagnolo']),
        ex.translateWrite('Pablo es español.', 'Pablo è spagnolo.', ['it-spagnolo', 'it-e-essere']),
        ex.translateWrite('Carlos es mexicano.', 'Carlos è messicano.', [
          'it-messicano',
          'it-e-essere',
        ]),
      ],
    },
    {
      title: 'Di dove sei?',
      objective: 'Preguntar y decir de dónde sos.',
      intro: {
        explanation:
          'Di dove sei? es «¿de dónde sos?». Se responde sono di + ciudad: sono di Roma, sono di Buenos Aires.',
        examples: [
          { target: 'Di dove sei?', base: '¿De dónde sos?' },
          { target: 'Sono di Buenos Aires.', base: 'Soy de Buenos Aires.' },
          { target: 'Anche lei è di Roma.', base: 'Ella también es de Roma.' },
        ],
      },
      takeaways: [
        'Preguntás de dónde es alguien con di dove sei?',
        'Respondés con sono di + ciudad.',
      ],
      exercises: [
        ex.translationChoice(
          'di dove sei?',
          '¿de dónde sos?',
          ['¿cómo estás?', '¿cómo te llamás?', 'soy de'],
          ['it-di-dove-sei'],
        ),
        ex.listenChoice(
          'di dove sei?',
          ['come stai?', 'come ti chiami?', 'e tu?'],
          ['it-di-dove-sei'],
        ),
        ex.fillBlank('Sono ___ Roma.', 'Soy de Roma.', 'di', ['da', 'e', 'non'], ['it-sono-di'], {
          explanation: 'Para la ciudad de origen se usa di: sono di Roma.',
        }),
        ex.orderWords('Sono di Buenos Aires.', 'Soy de Buenos Aires.', ['it-sono-di']),
        ex.matchPairs(
          [
            ['di dove sei?', '¿de dónde sos?'],
            ['sono di', 'soy de'],
            ['amica', 'amiga'],
            ['lui', 'él'],
          ],
          ['it-di-dove-sei', 'it-sono-di', 'it-amica', 'it-lui'],
        ),
        ex.shortAnswer(
          'Ciao! Di dove sei?',
          '¡Hola! ¿De dónde sos? (Respondé que sos de Córdoba.)',
          'Sono di Córdoba.',
          ['Io sono di Córdoba.', 'Sono di Cordoba.', 'Io sono di Cordoba.'],
          ['it-di-dove-sei', 'it-sono-di'],
        ),
        ex.translateWrite('¿De dónde sos?', 'Di dove sei?', ['it-di-dove-sei'], {
          acceptedAnswers: ['Tu di dove sei?'],
        }),
        ex.translateWrite(
          'Mi amigo es de Roma.',
          'Il mio amico è di Roma.',
          ['it-amico', 'it-e-essere'],
          {
            acceptedAnswers: ['Il mio amico è di Roma'],
            explanation: 'Con amico se usa el artículo: il mio amico.',
          },
        ),
      ],
    },
  ],
};
