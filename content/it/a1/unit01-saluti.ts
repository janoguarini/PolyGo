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

/**
 * Unidad piloto del italiano. Redactada sin revisión de un hablante nativo: necesita revisión
 * lingüística antes de publicarse para todos (ver docs/CONTENT_STANDARD.md).
 */
export const unit01: UnitDef = {
  position: 1,
  title: 'Saludos y presentaciones',
  titleEn: 'Saluti e presentazioni',
  description: 'Saludar según la hora, despedirte, ser amable y presentarte.',
  emoji: '👋',
  objective:
    'Podés saludar según el momento del día, presentarte, preguntar cómo está alguien y responder con cortesía.',
  grammar: {
    title: 'Mi chiamo… (me llamo)',
    explanation:
      'Para decir tu nombre se usa chiamarsi, igual que «llamarse»: mi chiamo Ana. Para preguntar el nombre a alguien de confianza: come ti chiami?',
    examples: [
      { target: 'Mi chiamo Marco.', base: 'Me llamo Marco.' },
      { target: 'Come ti chiami?', base: '¿Cómo te llamás?' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de italiano.',
  },
  words: [
    w('it-ciao', 'ciao', 'hola (informal)', 'Ciao, Marco!', '¡Hola, Marco!', ['greetings'], {
      acceptedTranslations: ['hola', 'chau'],
    }),
    w('it-arrivederci', 'arrivederci', 'adiós', 'Arrivederci, signora!', '¡Adiós, señora!', [
      'greetings',
    ]),
    w('it-a-presto', 'a presto', 'hasta pronto', 'Ciao, a presto!', '¡Chau, hasta pronto!', [
      'greetings',
    ]),
    w('it-si', 'sì', 'sí', 'Sì, grazie.', 'Sí, gracias.', ['basics'], { emoji: '✅' }),
    w('it-no', 'no', 'no', 'No, grazie.', 'No, gracias.', ['basics'], { emoji: '❌' }),
    w(
      'it-buongiorno',
      'buongiorno',
      'buenos días',
      'Buongiorno, professore!',
      '¡Buenos días, profesor!',
      ['greetings', 'time'],
      { emoji: '🌅' },
    ),
    w(
      'it-buonasera',
      'buonasera',
      'buenas tardes (al saludar)',
      'Buonasera, signora Rossi.',
      'Buenas tardes, señora Rossi.',
      ['greetings', 'time'],
      {
        emoji: '🌆',
        acceptedTranslations: ['buenas tardes', 'buenas noches'],
      },
    ),
    w(
      'it-buonanotte',
      'buonanotte',
      'buenas noches (al despedirse)',
      'Buonanotte, mamma!',
      '¡Buenas noches, mamá!',
      ['greetings', 'time'],
      {
        emoji: '🌙',
        acceptedTranslations: ['buenas noches'],
      },
    ),
    w('it-per-favore', 'per favore', 'por favor', 'Un caffè, per favore.', 'Un café, por favor.', [
      'courtesy',
    ]),
    w('it-grazie', 'grazie', 'gracias', 'Grazie, Luca!', '¡Gracias, Luca!', ['courtesy']),
    w('it-prego', 'prego', 'de nada', 'Grazie! — Prego.', '¡Gracias! — De nada.', ['courtesy']),
    w('it-scusa', 'scusa', 'perdón (informal)', 'Scusa, Marta!', '¡Perdón, Marta!', ['courtesy'], {
      acceptedTranslations: ['perdón', 'disculpá', 'disculpa'],
    }),
    w('it-mi-chiamo', 'mi chiamo', 'me llamo', 'Mi chiamo Giulia.', 'Me llamo Giulia.', [
      'introductions',
    ]),
    w(
      'it-come-ti-chiami',
      'come ti chiami?',
      '¿cómo te llamás?',
      'Ciao! Come ti chiami?',
      '¡Hola! ¿Cómo te llamás?',
      ['introductions'],
      {
        acceptedTranslations: ['¿cómo te llamas?'],
      },
    ),
    w(
      'it-piacere',
      'piacere',
      'mucho gusto',
      'Piacere, io sono Paolo.',
      'Mucho gusto, yo soy Paolo.',
      ['introductions'],
      {
        acceptedTranslations: ['encantado', 'encantada'],
      },
    ),
    w('it-io', 'io', 'yo', 'Io mi chiamo Sara.', 'Yo me llamo Sara.', ['pronouns']),
    w(
      'it-come-stai',
      'come stai?',
      '¿cómo estás?',
      'Ciao, Anna! Come stai?',
      '¡Hola, Anna! ¿Cómo estás?',
      ['questions'],
    ),
    w('it-bene', 'bene', 'bien', 'Sto bene, grazie.', 'Estoy bien, gracias.', ['basics']),
    w('it-molto', 'molto', 'muy', 'Molto bene!', '¡Muy bien!', ['basics']),
    w(
      'it-e-tu',
      'e tu?',
      '¿y vos?',
      'Bene, grazie. E tu?',
      'Bien, gracias. ¿Y vos?',
      ['questions'],
      {
        acceptedTranslations: ['¿y tú?', 'y vos', 'y tú'],
      },
    ),
    w('it-anche', 'anche', 'también', 'Anch’io sto bene.', 'Yo también estoy bien.', ['basics']),
  ],
  lessons: [
    {
      title: 'Ciao y arrivederci',
      objective: 'Saludar y despedirte; decir sí y no.',
      intro: {
        explanation:
          'Ciao sirve para saludar y para despedirte entre amigos. Con alguien que no conocés, para despedirte usá arrivederci.',
        examples: [
          { target: 'Ciao, Marco!', base: '¡Hola, Marco!' },
          { target: 'Arrivederci, signora!', base: '¡Adiós, señora!' },
          { target: 'Ciao, a presto!', base: '¡Chau, hasta pronto!' },
        ],
      },
      takeaways: [
        'Saludás y te despedís con ciao.',
        'Te despedís con arrivederci de alguien que no conocés.',
        'Decís sì (con tilde) y no.',
      ],
      exercises: [
        ex.translationChoice('ciao', 'hola (informal)', ['adiós', 'gracias', 'sí'], ['it-ciao']),
        ex.imageChoice('✅', 'sì', ['no', 'ciao', 'prego'], ['it-si'], {
          explanation: 'Sì lleva tilde, pero hacia el otro lado que en español: sì.',
        }),
        ex.imageChoice('❌', 'no', ['sì', 'grazie', 'ciao'], ['it-no']),
        ex.listenChoice(
          'arrivederci',
          ['buongiorno', 'per favore', 'a presto'],
          ['it-arrivederci'],
        ),
        ex.matchPairs(
          [
            ['ciao', 'hola'],
            ['arrivederci', 'adiós'],
            ['a presto', 'hasta pronto'],
            ['sì', 'sí'],
          ],
          ['it-ciao', 'it-arrivederci', 'it-a-presto', 'it-si'],
        ),
        ex.fillBlank(
          'Ciao, a ___!',
          '¡Chau, hasta pronto!',
          'presto',
          ['bene', 'grazie', 'sì'],
          ['it-a-presto'],
          { skill: 'vocabulary' },
        ),
        ex.translateWrite('Hasta pronto', 'a presto', ['it-a-presto']),
        ex.translateWrite('Adiós', 'arrivederci', ['it-arrivederci'], {
          acceptedAnswers: ['ciao'],
          explanation: 'Arrivederci es la despedida neutra; ciao, la informal.',
        }),
      ],
    },
    {
      title: 'Buongiorno y buonasera',
      objective: 'Saludar según el momento del día.',
      intro: {
        explanation:
          'Buongiorno se dice a la mañana y hasta media tarde. Desde la tarde se saluda con buonasera. Buonanotte es sólo para despedirte a la noche o antes de dormir.',
        examples: [
          { target: 'Buongiorno, professore!', base: '¡Buenos días, profesor!' },
          { target: 'Buonasera, signora Rossi.', base: 'Buenas tardes, señora Rossi.' },
          { target: 'Buonanotte, mamma!', base: '¡Buenas noches, mamá!', note: 'al irte a dormir' },
        ],
      },
      takeaways: [
        'Saludás con buongiorno a la mañana y con buonasera desde la tarde.',
        'Usás buonanotte sólo para despedirte a la noche.',
      ],
      exercises: [
        ex.imageChoice(
          '🌅',
          'buongiorno',
          ['buonanotte', 'buonasera', 'arrivederci'],
          ['it-buongiorno'],
        ),
        ex.imageChoice('🌙', 'buonanotte', ['buongiorno', 'buonasera', 'ciao'], ['it-buonanotte']),
        ex.translationChoice(
          'buonasera',
          'buenas tardes (al saludar)',
          ['buenos días', 'hasta pronto', 'adiós'],
          ['it-buonasera'],
        ),
        ex.listenChoice('buonasera', ['buongiorno', 'buonanotte', 'arrivederci'], ['it-buonasera']),
        ex.fillBlank(
          '___, signora Rossi. Come sta?',
          'Buenas tardes, señora Rossi. ¿Cómo está?',
          'Buonasera',
          ['Buonanotte', 'Arrivederci', 'Prego'],
          ['it-buonasera'],
          {
            skill: 'vocabulary',
            explanation:
              'Para saludar a la tarde o a la noche se usa buonasera; buonanotte es para despedirse.',
          },
        ),
        ex.matchPairs(
          [
            ['buongiorno', 'buenos días'],
            ['buonasera', 'buenas tardes'],
            ['buonanotte', 'buenas noches'],
          ],
          ['it-buongiorno', 'it-buonasera', 'it-buonanotte'],
        ),
        ex.translateWrite('Buenos días', 'buongiorno', ['it-buongiorno'], {
          acceptedAnswers: ['buon giorno'],
        }),
        ex.translateWrite(
          'Te vas a dormir: «¡Buenas noches, mamá!»',
          'Buonanotte, mamma!',
          ['it-buonanotte'],
          {
            acceptedAnswers: ['Buona notte, mamma!'],
            explanation: 'Para despedirte a la noche se usa buonanotte; buonasera es para saludar.',
          },
        ),
      ],
    },
    {
      title: 'Per favore y grazie',
      objective: 'Pedir por favor, agradecer y disculparte.',
      intro: {
        explanation:
          'Grazie es gracias y prego, de nada. Scusa sirve para pedir perdón o llamar la atención de alguien de confianza.',
        examples: [
          { target: 'Un caffè, per favore.', base: 'Un café, por favor.' },
          { target: 'Grazie! — Prego.', base: '¡Gracias! — De nada.' },
          { target: 'Scusa, Marta!', base: '¡Perdón, Marta!' },
        ],
      },
      takeaways: [
        'Pedís algo con per favore.',
        'Agradecés con grazie y respondés prego.',
        'Te disculpás con scusa.',
      ],
      exercises: [
        ex.translationChoice(
          'grazie',
          'gracias',
          ['de nada', 'por favor', 'perdón (informal)'],
          ['it-grazie'],
        ),
        ex.translationChoice(
          'prego',
          'de nada',
          ['gracias', 'perdón (informal)', 'hasta pronto'],
          ['it-prego'],
          {
            explanation: 'Prego se parece a «ruego», pero acá significa «de nada».',
          },
        ),
        ex.listenChoice('per favore', ['prego', 'piacere', 'buonasera'], ['it-per-favore']),
        ex.fillBlank(
          'Un caffè, per ___.',
          'Un café, por favor.',
          'favore',
          ['grazie', 'prego', 'bene'],
          ['it-per-favore'],
          { skill: 'vocabulary' },
        ),
        ex.fillBlank(
          'A: Grazie! B: ___.',
          'A: ¡Gracias! B: De nada.',
          'Prego',
          ['Scusa', 'Ciao', 'Sì'],
          ['it-prego', 'it-grazie'],
          { skill: 'vocabulary' },
        ),
        ex.matchPairs(
          [
            ['per favore', 'por favor'],
            ['grazie', 'gracias'],
            ['prego', 'de nada'],
            ['scusa', 'perdón'],
          ],
          ['it-per-favore', 'it-grazie', 'it-prego', 'it-scusa'],
        ),
        ex.translateWrite('Gracias', 'grazie', ['it-grazie']),
        ex.translateWrite('De nada', 'prego', ['it-prego']),
      ],
    },
    {
      title: 'Mi chiamo…',
      objective: 'Decir tu nombre y preguntar el de otra persona.',
      intro: {
        explanation:
          'Mi chiamo + nombre es «me llamo». Para preguntar: come ti chiami? Al conocer a alguien se responde piacere.',
        examples: [
          { target: 'Mi chiamo Giulia.', base: 'Me llamo Giulia.' },
          { target: 'Ciao! Come ti chiami?', base: '¡Hola! ¿Cómo te llamás?' },
          { target: 'Piacere!', base: '¡Mucho gusto!' },
        ],
      },
      takeaways: [
        'Te presentás con mi chiamo + tu nombre.',
        'Preguntás el nombre con come ti chiami?',
        'Al conocer a alguien decís piacere.',
      ],
      exercises: [
        ex.translationChoice(
          'mi chiamo',
          'me llamo',
          ['mucho gusto', '¿cómo estás?', 'yo'],
          ['it-mi-chiamo'],
        ),
        ex.fillBlank(
          '___ chiamo Marco.',
          'Me llamo Marco.',
          'Mi',
          ['Io', 'Ti', 'Si'],
          ['it-mi-chiamo'],
          {
            explanation:
              'Se dice mi chiamo, como «me llamo». Io chiamo sería «yo llamo (a alguien)».',
          },
        ),
        ex.listenChoice(
          'come ti chiami?',
          ['come stai?', 'e tu?', 'mi chiamo'],
          ['it-come-ti-chiami'],
        ),
        ex.orderWords('Io mi chiamo Sara.', 'Yo me llamo Sara.', ['it-io', 'it-mi-chiamo']),
        ex.translationChoice(
          'piacere',
          'mucho gusto',
          ['por favor', 'de nada', 'me llamo'],
          ['it-piacere'],
          {
            explanation: 'Piacere significa «placer»: se usa como «mucho gusto».',
          },
        ),
        ex.matchPairs(
          [
            ['io', 'yo'],
            ['mi chiamo', 'me llamo'],
            ['piacere', 'mucho gusto'],
          ],
          ['it-io', 'it-mi-chiamo', 'it-piacere'],
        ),
        ex.shortAnswer(
          'Ciao! Come ti chiami?',
          '¡Hola! ¿Cómo te llamás? (Respondé que te llamás Ana.)',
          'Mi chiamo Ana.',
          ['Io mi chiamo Ana.', 'Sono Ana.', 'Io sono Ana.'],
          ['it-mi-chiamo', 'it-come-ti-chiami'],
          {
            explanation: 'También podés decir sono Ana («soy Ana»).',
          },
        ),
        ex.translateWrite('¿Cómo te llamás?', 'Come ti chiami?', ['it-come-ti-chiami']),
      ],
    },
    {
      title: 'Come stai?',
      objective: 'Preguntar y responder cómo está alguien.',
      intro: {
        explanation:
          'Come stai? es «¿cómo estás?» entre personas de confianza. Se responde bene (bien) o molto bene (muy bien), y se devuelve la pregunta con e tu?',
        examples: [
          { target: 'Ciao, Anna! Come stai?', base: '¡Hola, Anna! ¿Cómo estás?' },
          { target: 'Bene, grazie. E tu?', base: 'Bien, gracias. ¿Y vos?' },
          { target: 'Anch’io sto bene.', base: 'Yo también estoy bien.' },
        ],
      },
      takeaways: [
        'Preguntás come stai? y respondés bene o molto bene.',
        'Devolvés la pregunta con e tu?',
        'Decís «también» con anche.',
      ],
      exercises: [
        ex.translationChoice(
          'come stai?',
          '¿cómo estás?',
          ['¿cómo te llamás?', '¿y vos?', 'hasta pronto'],
          ['it-come-stai'],
        ),
        ex.translationChoice('anche', 'también', ['muy', 'bien', 'yo'], ['it-anche']),
        ex.fillBlank(
          'Sto ___, grazie.',
          'Estoy bien, gracias.',
          'bene',
          ['molto', 'prego', 'anche'],
          ['it-bene'],
          { skill: 'vocabulary' },
        ),
        ex.listenChoice('e tu?', ['come stai?', 'grazie', 'a presto'], ['it-e-tu']),
        ex.orderWords('Molto bene, grazie.', 'Muy bien, gracias.', [
          'it-molto',
          'it-bene',
          'it-grazie',
        ]),
        ex.matchPairs(
          [
            ['bene', 'bien'],
            ['molto', 'muy'],
            ['anche', 'también'],
            ['e tu?', '¿y vos?'],
          ],
          ['it-bene', 'it-molto', 'it-anche', 'it-e-tu'],
        ),
        ex.shortAnswer(
          'Ciao! Come stai?',
          '¡Hola! ¿Cómo estás?',
          'Bene, grazie.',
          [
            'Bene, grazie. E tu?',
            'Molto bene, grazie.',
            'Molto bene.',
            'Sto bene, grazie.',
            'Sto bene.',
            'Bene.',
          ],
          ['it-come-stai', 'it-bene'],
        ),
        ex.translateWrite('Muy bien, ¿y vos?', 'Molto bene, e tu?', [
          'it-molto',
          'it-bene',
          'it-e-tu',
        ]),
      ],
    },
  ],
};
