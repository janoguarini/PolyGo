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
export const unit03: UnitDef = {
  position: 3,
  title: 'Números y edad',
  titleEn: 'Números e idade',
  description: 'Contar hasta veinte y decir cuántos años tenés.',
  emoji: '🔢',
  objective: 'Podés contar hasta veinte, preguntar la edad y decir cuántos años tenés.',
  grammar: {
    title: 'Ter … anos',
    explanation:
      'La edad se dice con ter (tener): eu tenho vinte anos. Con você, ele y ela: tem. Um y dois cambian con palabras femeninas: uma, duas.',
    examples: [
      { target: 'Quantos anos você tem?', base: '¿Cuántos años tenés?' },
      { target: 'Eu tenho dezoito anos.', base: 'Tengo dieciocho años.' },
      { target: 'Tenho duas irmãs.', base: 'Tengo dos hermanas.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de portugués de Brasil.',
  },
  words: [
    w('pt-um', 'um', 'uno', 'Tenho um irmão.', 'Tengo un hermano.', ['numbers'], {
      emoji: '1️⃣',
      acceptedTranslations: ['un'],
    }),
    w('pt-dois', 'dois', 'dos', 'Dois cafés, por favor.', 'Dos cafés, por favor.', ['numbers'], {
      emoji: '2️⃣',
    }),
    w('pt-tres', 'três', 'tres', 'Três amigos.', 'Tres amigos.', ['numbers'], { emoji: '3️⃣' }),
    w('pt-quatro', 'quatro', 'cuatro', 'Quatro livros.', 'Cuatro libros.', ['numbers'], {
      emoji: '4️⃣',
    }),
    w('pt-cinco', 'cinco', 'cinco', 'Cinco reais.', 'Cinco reales.', ['numbers'], { emoji: '5️⃣' }),
    w('pt-seis', 'seis', 'seis', 'Ela tem seis anos.', 'Ella tiene seis años.', ['numbers'], {
      emoji: '6️⃣',
    }),
    w('pt-sete', 'sete', 'siete', 'Sete dias.', 'Siete días.', ['numbers'], { emoji: '7️⃣' }),
    w('pt-oito', 'oito', 'ocho', 'Oito estudantes.', 'Ocho estudiantes.', ['numbers'], {
      emoji: '8️⃣',
    }),
    w('pt-nove', 'nove', 'nueve', 'Ele tem nove anos.', 'Él tiene nueve años.', ['numbers'], {
      emoji: '9️⃣',
    }),
    w('pt-dez', 'dez', 'diez', 'Dez reais.', 'Diez reales.', ['numbers'], { emoji: '🔟' }),
    w('pt-quinze', 'quinze', 'quince', 'Tenho quinze anos.', 'Tengo quince años.', ['numbers']),
    w('pt-dezoito', 'dezoito', 'dieciocho', 'Ela tem dezoito anos.', 'Ella tiene dieciocho años.', [
      'numbers',
    ]),
    w('pt-vinte', 'vinte', 'veinte', 'Tenho vinte anos.', 'Tengo veinte años.', ['numbers']),
    w('pt-tenho', 'tenho', 'tengo', 'Tenho vinte anos.', 'Tengo veinte años.', [
      'verbs',
      'to-have',
    ]),
    w(
      'pt-tem',
      'tem',
      'tiene / tenés (con você)',
      'Ele tem dez anos.',
      'Él tiene diez años.',
      ['verbs', 'to-have'],
      {
        acceptedTranslations: ['tiene', 'tenés'],
      },
    ),
    w('pt-anos', 'anos', 'años', 'Tenho trinta anos.', 'Tengo treinta años.', ['time']),
    w(
      'pt-quantos-anos',
      'quantos anos você tem?',
      '¿cuántos años tenés?',
      'Quantos anos você tem?',
      '¿Cuántos años tenés?',
      ['questions'],
      {
        acceptedTranslations: ['¿cuántos años tienes?'],
      },
    ),
  ],
  lessons: [
    {
      title: 'De um a cinco',
      objective: 'Contar del uno al cinco.',
      intro: {
        explanation:
          'Um es «uno» (con palabras femeninas, uma) y dois es «dos» (en femenino, duas). Três lleva tilde y quatro se escribe con qu.',
        examples: [
          { target: 'Um, dois, três.', base: 'Uno, dos, tres.' },
          { target: 'Dois cafés, por favor.', base: 'Dos cafés, por favor.' },
        ],
      },
      takeaways: [
        'Contás del uno al cinco.',
        'Sabés que um y dois cambian en femenino: uma, duas.',
      ],
      exercises: [
        ex.imageChoice('2️⃣', 'dois', ['três', 'um', 'cinco'], ['pt-dois']),
        ex.imageChoice('4️⃣', 'quatro', ['cinco', 'três', 'dois'], ['pt-quatro']),
        ex.translationChoice('três', 'tres', ['dos', 'cuatro', 'uno'], ['pt-tres']),
        ex.listenChoice('um', ['dois', 'quatro', 'cinco'], ['pt-um']),
        ex.matchPairs(
          [
            ['um', 'uno'],
            ['dois', 'dos'],
            ['três', 'tres'],
            ['quatro', 'cuatro'],
          ],
          ['pt-um', 'pt-dois', 'pt-tres', 'pt-quatro'],
        ),
        ex.fillBlank(
          '___ cafés, por favor.',
          'Dos cafés, por favor.',
          'Dois',
          ['Duas', 'Três', 'Um'],
          ['pt-dois'],
          {
            explanation: 'Café es masculino: dois cafés. Con una palabra femenina sería duas.',
          },
        ),
        ex.translateWrite('Dos', 'dois', ['pt-dois'], { acceptedAnswers: ['duas'] }),
        ex.translateWrite('Cuatro', 'quatro', ['pt-quatro']),
      ],
    },
    {
      title: 'De seis a dez',
      objective: 'Contar del seis al diez.',
      intro: {
        explanation:
          'Sete (siete), oito (ocho), nove (nueve) y dez (diez). Seis se escribe igual que en español, pero en Brasil suena «séis».',
        examples: [
          { target: 'Seis, sete, oito.', base: 'Seis, siete, ocho.' },
          { target: 'Dez reais.', base: 'Diez reales.' },
        ],
      },
      takeaways: ['Contás del seis al diez.', 'Reconocés los números de oído.'],
      exercises: [
        ex.imageChoice('7️⃣', 'sete', ['seis', 'oito', 'nove'], ['pt-sete']),
        ex.imageChoice('🔟', 'dez', ['nove', 'oito', 'sete'], ['pt-dez']),
        ex.translationChoice('oito', 'ocho', ['siete', 'nueve', 'diez'], ['pt-oito']),
        ex.listenChoice('nove', ['seis', 'dez', 'sete'], ['pt-nove']),
        ex.imageChoice('6️⃣', 'seis', ['sete', 'dez', 'oito'], ['pt-seis']),
        ex.matchPairs(
          [
            ['sete', 'siete'],
            ['oito', 'ocho'],
            ['nove', 'nueve'],
            ['dez', 'diez'],
          ],
          ['pt-sete', 'pt-oito', 'pt-nove', 'pt-dez'],
        ),
        ex.translateWrite('Ocho', 'oito', ['pt-oito']),
        ex.translateWrite('Diez', 'dez', ['pt-dez']),
      ],
    },
    {
      title: 'Até vinte',
      objective: 'Usar números más grandes: 5, 15, 18 y 20.',
      intro: {
        explanation:
          'Quinze es quince y vinte, veinte. Dezoito (dieciocho) es «dez-oito» todo junto. Son los que más vas a usar para la edad.',
        examples: [
          { target: 'Tenho quinze anos.', base: 'Tengo quince años.' },
          { target: 'Ela tem dezoito anos.', base: 'Ella tiene dieciocho años.' },
        ],
      },
      takeaways: ['Decís 15, 18 y 20.', 'Reconocés los números de oído.'],
      exercises: [
        ex.translationChoice('vinte', 'veinte', ['quince', 'dieciocho', 'diez'], ['pt-vinte']),
        ex.translationChoice('quinze', 'quince', ['veinte', 'cinco', 'dieciocho'], ['pt-quinze']),
        ex.listenChoice('dezoito', ['quinze', 'vinte', 'dez'], ['pt-dezoito']),
        ex.imageChoice('5️⃣', 'cinco', ['quinze', 'seis', 'vinte'], ['pt-cinco']),
        ex.matchPairs(
          [
            ['dez', 'diez'],
            ['quinze', 'quince'],
            ['dezoito', 'dieciocho'],
            ['vinte', 'veinte'],
          ],
          ['pt-dez', 'pt-quinze', 'pt-dezoito', 'pt-vinte'],
        ),
        ex.fillBlank(
          'Dez + dez = ___',
          'Diez + diez = veinte',
          'vinte',
          ['quinze', 'dezoito', 'nove'],
          ['pt-vinte', 'pt-dez'],
          { skill: 'vocabulary' },
        ),
        ex.translateWrite('Veinte', 'vinte', ['pt-vinte']),
        ex.translateWrite('Dieciocho', 'dezoito', ['pt-dezoito']),
      ],
    },
    {
      title: 'Quantos anos você tem?',
      objective: 'Preguntar y decir la edad.',
      intro: {
        explanation:
          'La edad va con ter: eu tenho (tengo) y você / ele / ela tem (tenés / tiene) + número + anos.',
        examples: [
          { target: 'Quantos anos você tem?', base: '¿Cuántos años tenés?' },
          { target: 'Tenho vinte anos.', base: 'Tengo veinte años.' },
          { target: 'Ele tem dez anos.', base: 'Él tiene diez años.' },
        ],
      },
      takeaways: [
        'Preguntás la edad con quantos anos você tem?',
        'Respondés con tenho + número + anos.',
      ],
      exercises: [
        ex.translationChoice(
          'quantos anos você tem?',
          '¿cuántos años tenés?',
          ['¿de dónde sos?', '¿todo bien?', 'tengo'],
          ['pt-quantos-anos'],
        ),
        ex.translationChoice(
          'tenho',
          'tengo',
          ['tiene / tenés (con você)', 'soy', 'años'],
          ['pt-tenho'],
        ),
        ex.fillBlank(
          'Eu ___ vinte anos.',
          'Tengo veinte años.',
          'tenho',
          ['tem', 'sou', 'é'],
          ['pt-tenho', 'pt-vinte', 'pt-anos'],
          {
            explanation: 'La edad va con ter: eu tenho. «Eu sou vinte anos» no se dice.',
          },
        ),
        ex.fillBlank(
          'Ele ___ dez anos.',
          'Él tiene diez años.',
          'tem',
          ['tenho', 'é', 'sou'],
          ['pt-tem', 'pt-dez', 'pt-anos'],
          { skill: 'grammar' },
        ),
        ex.listenChoice(
          'quantos anos você tem?',
          ['de onde você é?', 'tudo bem?', 'como você se chama?'],
          ['pt-quantos-anos'],
        ),
        ex.orderWords('Ela tem dezoito anos.', 'Ella tiene dieciocho años.', [
          'pt-tem',
          'pt-dezoito',
          'pt-anos',
        ]),
        ex.shortAnswer(
          'Quantos anos você tem?',
          '¿Cuántos años tenés? (Respondé que tenés quince.)',
          'Tenho quinze anos.',
          ['Eu tenho quinze anos.', 'Quinze anos.', 'Quinze.'],
          ['pt-tenho', 'pt-quinze', 'pt-anos'],
        ),
        ex.translateWrite('¿Cuántos años tenés?', 'Quantos anos você tem?', ['pt-quantos-anos']),
      ],
    },
    {
      title: 'Apresentação completa',
      objective: 'Decir tu nombre, de dónde sos y cuántos años tenés.',
      intro: {
        explanation:
          'Ya podés presentarte entero: meu nome é + nombre, sou de + ciudad y tenho + edad. El origen va con ser y la edad con ter.',
        examples: [
          {
            target: 'Meu nome é Ana, sou de Rosario e tenho vinte anos.',
            base: 'Me llamo Ana, soy de Rosario y tengo veinte años.',
          },
          { target: 'Ele é o Tiago e tem oito anos.', base: 'Él es Tiago y tiene ocho años.' },
        ],
      },
      takeaways: [
        'Te presentás con nombre, origen y edad.',
        'Usás sou para el origen y tenho para la edad.',
      ],
      exercises: [
        ex.translationChoice('anos', 'años', ['tengo', 'veinte', 'nueve'], ['pt-anos']),
        ex.fillBlank(
          'Sou de Rosario e ___ vinte anos.',
          'Soy de Rosario y tengo veinte años.',
          'tenho',
          ['sou', 'tem', 'é'],
          ['pt-tenho', 'pt-sou-de', 'pt-vinte'],
          {
            explanation: 'El origen va con sou; la edad, con tenho.',
          },
        ),
        ex.listenChoice(
          'tenho oito anos',
          ['tenho sete anos', 'tenho nove anos', 'tenho vinte anos'],
          ['pt-tenho', 'pt-oito', 'pt-anos'],
        ),
        ex.orderWords('Ele tem oito anos.', 'Él tiene ocho años.', [
          'pt-ele',
          'pt-tem',
          'pt-oito',
          'pt-anos',
        ]),
        ex.matchPairs(
          [
            ['tenho', 'tengo'],
            ['tem', 'tiene'],
            ['anos', 'años'],
            ['sou de', 'soy de'],
          ],
          ['pt-tenho', 'pt-tem', 'pt-anos', 'pt-sou-de'],
        ),
        ex.shortAnswer(
          'Oi! Como você se chama?',
          '¡Hola! ¿Cómo te llamás? (Respondé que te llamás Ana y tenés veinte años.)',
          'Meu nome é Ana e tenho vinte anos.',
          [
            'Eu me chamo Ana e tenho vinte anos.',
            'Me chamo Ana e tenho vinte anos.',
            'Sou a Ana e tenho vinte anos.',
            'Eu sou a Ana e tenho vinte anos.',
          ],
          ['pt-meu-nome-e', 'pt-tenho', 'pt-vinte'],
        ),
        ex.translateWrite(
          'Tengo dieciocho años.',
          'Tenho dezoito anos.',
          ['pt-tenho', 'pt-dezoito', 'pt-anos'],
          {
            acceptedAnswers: ['Eu tenho dezoito anos.'],
          },
        ),
        ex.translateWrite('Ella tiene nueve años.', 'Ela tem nove anos.', [
          'pt-ela',
          'pt-tem',
          'pt-nove',
          'pt-anos',
        ]),
      ],
    },
  ],
};
