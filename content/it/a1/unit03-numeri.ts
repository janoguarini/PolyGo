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
export const unit03: UnitDef = {
  position: 3,
  title: 'Números y edad',
  titleEn: 'Numeri ed età',
  description: 'Contar hasta veinte y decir cuántos años tenés.',
  emoji: '🔢',
  objective: 'Podés contar hasta veinte, preguntar la edad y decir cuántos años tenés.',
  grammar: {
    title: 'Avere … anni',
    explanation:
      'Como en español, la edad se dice con avere (tener): ho venti anni. Ho se escribe con h, pero la h no suena.',
    examples: [
      { target: 'Quanti anni hai?', base: '¿Cuántos años tenés?' },
      { target: 'Ho diciotto anni.', base: 'Tengo dieciocho años.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de italiano.',
  },
  words: [
    w('it-uno', 'uno', 'uno', 'Ho uno zaino.', 'Tengo una mochila.', ['numbers'], { emoji: '1️⃣' }),
    w('it-due', 'due', 'dos', 'Due caffè, per favore.', 'Dos cafés, por favor.', ['numbers'], {
      emoji: '2️⃣',
    }),
    w('it-tre', 'tre', 'tres', 'Ho tre amici.', 'Tengo tres amigos.', ['numbers'], { emoji: '3️⃣' }),
    w('it-quattro', 'quattro', 'cuatro', 'Sono le quattro.', 'Son las cuatro.', ['numbers'], {
      emoji: '4️⃣',
    }),
    w('it-cinque', 'cinque', 'cinco', 'Cinque euro.', 'Cinco euros.', ['numbers'], { emoji: '5️⃣' }),
    w('it-sei-numero', 'sei', 'seis', 'Ho sei anni.', 'Tengo seis años.', ['numbers'], {
      emoji: '6️⃣',
    }),
    w('it-sette', 'sette', 'siete', 'Sette giorni.', 'Siete días.', ['numbers'], { emoji: '7️⃣' }),
    w('it-otto', 'otto', 'ocho', 'Otto studenti.', 'Ocho estudiantes.', ['numbers'], {
      emoji: '8️⃣',
    }),
    w('it-nove', 'nove', 'nueve', 'Ho nove anni.', 'Tengo nueve años.', ['numbers'], {
      emoji: '9️⃣',
    }),
    w('it-dieci', 'dieci', 'diez', 'Dieci euro.', 'Diez euros.', ['numbers'], { emoji: '🔟' }),
    w('it-quindici', 'quindici', 'quince', 'Ho quindici anni.', 'Tengo quince años.', ['numbers']),
    w(
      'it-diciotto',
      'diciotto',
      'dieciocho',
      'Lei ha diciotto anni.',
      'Ella tiene dieciocho años.',
      ['numbers'],
    ),
    w('it-venti', 'venti', 'veinte', 'Ho venti anni.', 'Tengo veinte años.', ['numbers']),
    w('it-ho', 'ho', 'tengo', 'Ho venti anni.', 'Tengo veinte años.', ['verbs', 'to-have']),
    w('it-hai', 'hai', 'tenés', 'Quanti anni hai?', '¿Cuántos años tenés?', ['verbs', 'to-have'], {
      acceptedTranslations: ['tienes'],
    }),
    w('it-ha', 'ha', 'tiene', 'Marco ha dieci anni.', 'Marco tiene diez años.', [
      'verbs',
      'to-have',
    ]),
    w('it-anni', 'anni', 'años', 'Ho trenta anni.', 'Tengo treinta años.', ['time']),
    w(
      'it-quanti-anni-hai',
      'quanti anni hai?',
      '¿cuántos años tenés?',
      'Ciao! Quanti anni hai?',
      '¡Hola! ¿Cuántos años tenés?',
      ['questions'],
      {
        acceptedTranslations: ['¿cuántos años tienes?'],
      },
    ),
  ],
  lessons: [
    {
      title: 'Da uno a cinque',
      objective: 'Contar del uno al cinco.',
      intro: {
        explanation:
          'Los primeros números se parecen al español, pero se pronuncian distinto: due (dos), tre (tres), quattro con doble t y cinque, que suena «chínkue».',
        examples: [
          { target: 'Uno, due, tre.', base: 'Uno, dos, tres.' },
          { target: 'Due caffè, per favore.', base: 'Dos cafés, por favor.' },
        ],
      },
      takeaways: ['Contás del uno al cinco.', 'Pedís dos o tres cosas con un número.'],
      exercises: [
        ex.imageChoice('2️⃣', 'due', ['tre', 'uno', 'cinque'], ['it-due']),
        ex.imageChoice('4️⃣', 'quattro', ['cinque', 'tre', 'due'], ['it-quattro']),
        ex.imageChoice('1️⃣', 'uno', ['due', 'tre', 'cinque'], ['it-uno']),
        ex.listenChoice('tre', ['due', 'uno', 'quattro'], ['it-tre']),
        ex.matchPairs(
          [
            ['due', 'dos'],
            ['tre', 'tres'],
            ['quattro', 'cuatro'],
            ['cinque', 'cinco'],
          ],
          ['it-due', 'it-tre', 'it-quattro', 'it-cinque'],
        ),
        ex.fillBlank(
          '___ caffè, per favore.',
          'Dos cafés, por favor.',
          'Due',
          ['Tre', 'Uno', 'Cinque'],
          ['it-due', 'it-per-favore'],
          { skill: 'vocabulary' },
        ),
        ex.translateWrite('Cuatro', 'quattro', ['it-quattro'], {
          explanation: 'Quattro se escribe con doble t.',
        }),
        ex.translateWrite('Tres', 'tre', ['it-tre']),
      ],
    },
    {
      title: 'Da sei a dieci',
      objective: 'Contar del seis al diez.',
      intro: {
        explanation:
          'Sei (seis) es igual a sei (sos) de la unidad anterior: el contexto los distingue. Sette, otto y dieci llevan doble consonante o «ci», que suena «chi».',
        examples: [
          { target: 'Sei, sette, otto.', base: 'Seis, siete, ocho.' },
          { target: 'Dieci euro.', base: 'Diez euros.' },
        ],
      },
      takeaways: ['Contás del seis al diez.', 'Sabés que sei puede ser «seis» o «sos».'],
      exercises: [
        ex.imageChoice('7️⃣', 'sette', ['sei', 'otto', 'nove'], ['it-sette']),
        ex.imageChoice('🔟', 'dieci', ['nove', 'otto', 'sette'], ['it-dieci']),
        ex.translationChoice('otto', 'ocho', ['siete', 'nueve', 'seis'], ['it-otto']),
        ex.listenChoice('nove', ['sei', 'dieci', 'sette'], ['it-nove']),
        ex.fillBlank(
          'Ho ___ anni.',
          'Tengo seis años.',
          'sei',
          ['sette', 'otto', 'dieci'],
          ['it-sei-numero', 'it-ho', 'it-anni'],
          {
            skill: 'vocabulary',
            explanation: 'Acá sei es el número seis. En «tu sei» es el verbo: «vos sos».',
          },
        ),
        ex.matchPairs(
          [
            ['sei', 'seis'],
            ['sette', 'siete'],
            ['otto', 'ocho'],
            ['dieci', 'diez'],
          ],
          ['it-sei-numero', 'it-sette', 'it-otto', 'it-dieci'],
        ),
        ex.translateWrite('Siete', 'sette', ['it-sette']),
        ex.translateWrite('Diez euros', 'dieci euro', ['it-dieci'], {
          explanation: 'Euro no cambia en plural: un euro, dieci euro.',
        }),
      ],
    },
    {
      title: 'Fino a venti',
      objective: 'Usar números más grandes: 15, 18 y 20.',
      intro: {
        explanation:
          'Quindici es quince y venti, veinte. Diciotto (dieciocho) se arma como «diez-ocho». Son los números que más vas a usar para la edad.',
        examples: [
          { target: 'Ho quindici anni.', base: 'Tengo quince años.' },
          { target: 'Lei ha diciotto anni.', base: 'Ella tiene dieciocho años.' },
        ],
      },
      takeaways: ['Decís 15, 18 y 20.', 'Reconocés los números de oído.'],
      exercises: [
        ex.translationChoice('venti', 'veinte', ['quince', 'dieciocho', 'diez'], ['it-venti']),
        ex.translationChoice(
          'quindici',
          'quince',
          ['veinte', 'cinco', 'dieciocho'],
          ['it-quindici'],
        ),
        ex.listenChoice('diciotto', ['quindici', 'venti', 'dieci'], ['it-diciotto']),
        ex.listenChoice('venti', ['dieci', 'sette', 'quindici'], ['it-venti']),
        ex.matchPairs(
          [
            ['dieci', 'diez'],
            ['quindici', 'quince'],
            ['diciotto', 'dieciocho'],
            ['venti', 'veinte'],
          ],
          ['it-dieci', 'it-quindici', 'it-diciotto', 'it-venti'],
        ),
        ex.fillBlank(
          'Dieci + dieci = ___',
          'Diez + diez = veinte',
          'venti',
          ['quindici', 'diciotto', 'nove'],
          ['it-venti', 'it-dieci'],
          { skill: 'vocabulary' },
        ),
        ex.translateWrite('Veinte', 'venti', ['it-venti']),
        ex.translateWrite('Quince', 'quindici', ['it-quindici']),
      ],
    },
    {
      title: 'Quanti anni hai?',
      objective: 'Preguntar y decir la edad.',
      intro: {
        explanation:
          'La edad se dice con avere (tener): ho (tengo), hai (tenés), ha (tiene) + número + anni. La h de ho, hai y ha no se pronuncia.',
        examples: [
          { target: 'Quanti anni hai?', base: '¿Cuántos años tenés?' },
          { target: 'Ho venti anni.', base: 'Tengo veinte años.' },
          { target: 'Marco ha dieci anni.', base: 'Marco tiene diez años.' },
        ],
      },
      takeaways: ['Preguntás la edad con quanti anni hai?', 'Respondés con ho + número + anni.'],
      exercises: [
        ex.translationChoice(
          'quanti anni hai?',
          '¿cuántos años tenés?',
          ['¿de dónde sos?', '¿cómo estás?', 'tengo'],
          ['it-quanti-anni-hai'],
        ),
        ex.translationChoice('ho', 'tengo', ['tenés', 'tiene', 'soy'], ['it-ho']),
        ex.fillBlank(
          '___ venti anni.',
          'Tengo veinte años.',
          'Ho',
          ['Hai', 'Ha', 'Sono'],
          ['it-ho', 'it-venti', 'it-anni'],
          {
            explanation:
              'La edad va con avere (ho), no con essere: ho venti anni, no «sono venti anni».',
          },
        ),
        ex.fillBlank(
          'Marco ___ dieci anni.',
          'Marco tiene diez años.',
          'ha',
          ['ho', 'hai', 'è'],
          ['it-ha', 'it-dieci', 'it-anni'],
          { skill: 'grammar' },
        ),
        ex.listenChoice(
          'quanti anni hai?',
          ['di dove sei?', 'come stai?', 'come ti chiami?'],
          ['it-quanti-anni-hai'],
        ),
        ex.orderWords('Lei ha diciotto anni.', 'Ella tiene dieciocho años.', [
          'it-ha',
          'it-diciotto',
          'it-anni',
        ]),
        ex.shortAnswer(
          'Quanti anni hai?',
          '¿Cuántos años tenés? (Respondé que tenés quince.)',
          'Ho quindici anni.',
          ['Io ho quindici anni.', 'Quindici anni.', 'Quindici.'],
          ['it-ho', 'it-quindici', 'it-anni'],
        ),
        ex.translateWrite('¿Cuántos años tenés?', 'Quanti anni hai?', ['it-quanti-anni-hai']),
      ],
    },
    {
      title: 'Presentarte completo',
      objective: 'Decir tu nombre, de dónde sos y cuántos años tenés.',
      intro: {
        explanation:
          'Ya podés presentarte entero: mi chiamo + nombre, sono di + ciudad y ho + edad. Recordá: la edad va con ho, el origen con sono.',
        examples: [
          {
            target: 'Mi chiamo Ana, sono di Rosario e ho vent’anni.',
            base: 'Me llamo Ana, soy de Rosario y tengo veinte años.',
          },
          { target: 'Lui è Paolo e ha otto anni.', base: 'Él es Paolo y tiene ocho años.' },
        ],
      },
      takeaways: [
        'Te presentás con nombre, origen y edad.',
        'Usás sono para el origen y ho para la edad.',
      ],
      exercises: [
        ex.translationChoice('hai', 'tenés', ['tengo', 'tiene', 'sos'], ['it-hai']),
        ex.fillBlank(
          'Sono di Rosario e ___ venti anni.',
          'Soy de Rosario y tengo veinte años.',
          'ho',
          ['sono', 'hai', 'è'],
          ['it-ho', 'it-sono-di', 'it-venti'],
          {
            explanation: 'El origen va con sono; la edad, con ho.',
          },
        ),
        ex.listenChoice(
          'ho otto anni',
          ['ho sette anni', 'ho nove anni', 'ho venti anni'],
          ['it-ho', 'it-otto', 'it-anni'],
        ),
        ex.orderWords('Lui ha otto anni.', 'Él tiene ocho años.', [
          'it-lui',
          'it-ha',
          'it-otto',
          'it-anni',
        ]),
        ex.matchPairs(
          [
            ['ho', 'tengo'],
            ['hai', 'tenés'],
            ['ha', 'tiene'],
            ['anni', 'años'],
          ],
          ['it-ho', 'it-hai', 'it-ha', 'it-anni'],
        ),
        ex.translationChoice('anni', 'años', ['tengo', 'veinte', 'nueve'], ['it-anni']),
        ex.translateWrite(
          'Tengo dieciocho años.',
          'Ho diciotto anni.',
          ['it-ho', 'it-diciotto', 'it-anni'],
          {
            acceptedAnswers: ['Io ho diciotto anni.'],
          },
        ),
        ex.translateWrite(
          'Ella tiene nueve años.',
          'Lei ha nove anni.',
          ['it-lei', 'it-ha', 'it-nove', 'it-anni'],
          {
            acceptedAnswers: ['Ha nove anni.'],
          },
        ),
      ],
    },
  ],
};
