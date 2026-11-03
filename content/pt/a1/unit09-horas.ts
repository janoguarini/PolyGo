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
 * Sábado y domingo se escriben igual que en español: no se piden traducir (cognados).
 */
export const unit09: UnitDef = {
  position: 9,
  title: 'Horas y días',
  titleEn: 'Horas e dias',
  description:
    'Decir y preguntar la hora, a qué hora hacés algo y los días de la semana (segunda-feira…).',
  emoji: '🕗',
  objective:
    'Podés preguntar y decir la hora (que horas são? são oito horas), decir a qué hora hacés algo (às nove) y nombrar los días de la semana.',
  grammar: {
    title: 'São… horas / é uma hora / às…',
    explanation:
      'Para la hora se usa são + número + horas (são oito horas), salvo la una: é uma hora. Para decir a qué hora pasa algo: às + número (às nove). Los días de lunes a viernes se cuentan: segunda-feira (lunes), terça-feira (martes)…',
    examples: [
      { target: 'Que horas são? São oito horas.', base: '¿Qué hora es? Son las ocho.' },
      { target: 'É uma e meia.', base: 'Es la una y media.' },
      { target: 'Trabalho às nove.', base: 'Trabajo a las nueve.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de portugués de Brasil.',
  },
  words: [
    w(
      'pt-que-horas-sao',
      'que horas são?',
      '¿qué hora es?',
      'Desculpa, que horas são?',
      'Perdón, ¿qué hora es?',
      ['time', 'questions'],
      { emoji: '🕗' },
    ),
    w('pt-sao', 'são', 'son', 'São oito horas.', 'Son las ocho.', ['time']),
    w('pt-e-uma-hora', 'é uma hora', 'es la una', 'É uma hora.', 'Es la una.', ['time']),
    w('pt-e-meia', 'e meia', 'y media', 'São três e meia.', 'Son las tres y media.', ['time']),
    w(
      'pt-e-quinze',
      'e quinze',
      'y cuarto',
      'São seis e quinze.',
      'Son las seis y cuarto.',
      ['time'],
      {
        acceptedTranslations: ['y quince'],
      },
    ),
    w('pt-onze', 'onze', 'once', 'São onze horas.', 'Son las once.', ['numbers']),
    w('pt-doze', 'doze', 'doce', 'São doze horas.', 'Son las doce.', ['numbers']),
    w(
      'pt-meio-dia',
      'meio-dia',
      'mediodía',
      'Almoço ao meio-dia.',
      'Almuerzo al mediodía.',
      ['time'],
      {
        acceptedTexts: ['meio dia'],
        emoji: '🕛',
      },
    ),
    w(
      'pt-a-que-horas',
      'a que horas?',
      '¿a qué hora?',
      'A que horas você trabalha?',
      '¿A qué hora trabajás?',
      ['time', 'questions'],
    ),
    w('pt-as-hora', 'às', 'a las', 'Trabalho às nove.', 'Trabajo a las nueve.', ['time']),
    w('pt-hoje', 'hoje', 'hoy', 'Hoje é segunda-feira.', 'Hoy es lunes.', ['time'], {
      emoji: '📅',
    }),
    w('pt-amanha', 'amanhã', 'mañana (el día siguiente)', 'Amanhã é sábado.', 'Mañana es sábado.', [
      'time',
    ]),
    w('pt-segunda', 'segunda-feira', 'lunes', 'Hoje é segunda-feira.', 'Hoy es lunes.', ['days'], {
      acceptedTexts: ['segunda'],
    }),
    w(
      'pt-terca',
      'terça-feira',
      'martes',
      'Terça-feira eu estudo.',
      'El martes estudio.',
      ['days'],
      {
        acceptedTexts: ['terça'],
      },
    ),
    w(
      'pt-quarta',
      'quarta-feira',
      'miércoles',
      'Quarta-feira trabalho em casa.',
      'El miércoles trabajo en casa.',
      ['days'],
      { acceptedTexts: ['quarta'] },
    ),
    w('pt-quinta', 'quinta-feira', 'jueves', 'Quinta-feira eu leio.', 'El jueves leo.', ['days'], {
      acceptedTexts: ['quinta'],
    }),
    w(
      'pt-sexta',
      'sexta-feira',
      'viernes',
      'Sexta-feira à noite eu janto fora.',
      'El viernes a la noche ceno afuera.',
      ['days'],
      { acceptedTexts: ['sexta'] },
    ),
    w('pt-sabado', 'sábado', 'sábado', 'Amanhã é sábado.', 'Mañana es sábado.', ['days']),
    w(
      'pt-domingo',
      'domingo',
      'domingo',
      'No domingo eu durmo muito.',
      'El domingo duermo mucho.',
      ['days'],
    ),
    w(
      'pt-fim-de-semana',
      'fim de semana',
      'fin de semana',
      'No fim de semana eu durmo.',
      'El fin de semana duermo.',
      ['time'],
    ),
  ],
  lessons: [
    {
      title: 'Que horas são?',
      objective: 'Preguntar y decir la hora en punto.',
      intro: {
        explanation:
          'Para preguntar la hora: que horas são? Se responde con são + número + horas (são oito horas). La palabra horas se puede omitir: são oito. La una va en singular: é uma hora.',
        examples: [
          { target: 'Que horas são? São oito horas.', base: '¿Qué hora es? Son las ocho.' },
          { target: 'É uma hora.', base: 'Es la una.' },
        ],
      },
      takeaways: [
        'Preguntás la hora con que horas são?',
        'Decís la hora con são… horas y é uma hora.',
      ],
      exercises: [
        ex.translationChoice(
          'que horas são?',
          '¿qué hora es?',
          ['¿cuántos años tenés?', '¿todo bien?', '¿dónde está?'],
          ['pt-que-horas-sao'],
        ),
        ex.listenChoice(
          'São oito horas.',
          ['São sete horas.', 'São três horas.', 'É uma hora.'],
          ['pt-sao', 'pt-oito'],
        ),
        ex.listenChoice(
          'É uma hora.',
          ['São duas horas.', 'São nove horas.', 'É uma amiga.'],
          ['pt-e-uma-hora'],
        ),
        ex.fillBlank(
          '___ dez horas.',
          'Son las diez.',
          'São',
          ['É', 'Tem', 'Às'],
          ['pt-sao', 'pt-dez'],
          { explanation: 'Para la hora se usa são (plural), salvo la una: é uma hora.' },
        ),
        ex.fillBlank(
          'É ___ hora.',
          'Es la una.',
          'uma',
          ['um', 'duas', 'as'],
          ['pt-e-uma-hora', 'pt-uma'],
          { explanation: 'Hora es femenina: uma hora, duas horas.' },
        ),
        ex.matchPairs(
          [
            ['são sete horas', 'son las siete'],
            ['são cinco horas', 'son las cinco'],
            ['é uma hora', 'es la una'],
            ['são nove horas', 'son las nueve'],
          ],
          ['pt-sao', 'pt-sete', 'pt-e-uma-hora', 'pt-nove'],
        ),
        ex.shortAnswer(
          'Que horas são?',
          '¿Qué hora es? (Respondé que son las cuatro.)',
          'São quatro horas.',
          ['São quatro.', 'Quatro horas.'],
          ['pt-sao', 'pt-quatro'],
        ),
        ex.translateWrite('Son las ocho.', 'São oito horas.', ['pt-sao', 'pt-oito'], {
          acceptedAnswers: ['São oito.', 'São oito da manhã.'],
        }),
      ],
    },
    {
      title: 'E meia, e quinze',
      objective: 'Decir la hora con minutos.',
      intro: {
        explanation:
          'Y media es e meia; y cuarto se dice e quinze («y quince»). Once y doce son onze y doze; las 12 del día es meio-dia («mediodía»). Ojo: dos horas es duas horas (femenino).',
        examples: [
          { target: 'São três e meia.', base: 'Son las tres y media.' },
          { target: 'São onze e quinze.', base: 'Son las once y cuarto.' },
        ],
      },
      takeaways: ['Decís y media y y cuarto.', 'Contás hasta las doce y decís mediodía.'],
      exercises: [
        ex.translationChoice('e meia', 'y media', ['y cuarto', 'a las', 'son'], ['pt-e-meia']),
        ex.translationChoice('onze', 'once', ['doce', 'diez', 'quince'], ['pt-onze']),
        ex.imageChoice('🕛', 'meio-dia', ['amanhã', 'hoje', 'sábado'], ['pt-meio-dia']),
        ex.listenChoice(
          'São doze e quinze.',
          ['São dez e quinze.', 'São doze e meia.', 'São duas e quinze.'],
          ['pt-doze', 'pt-e-quinze'],
        ),
        ex.fillBlank(
          'São seis e ___.',
          'Son las seis y media.',
          'meia',
          ['quinze', 'uma', 'doze'],
          ['pt-seis', 'pt-e-meia'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('São onze e quinze.', 'Son las once y cuarto.', [
          'pt-sao',
          'pt-onze',
          'pt-e-quinze',
        ]),
        ex.translateWrite('Son las tres y media.', 'São três e meia.', ['pt-sao', 'pt-e-meia']),
        ex.translateWrite(
          'Son las doce y cuarto.',
          'São doze e quinze.',
          ['pt-sao', 'pt-doze', 'pt-e-quinze'],
          { acceptedAnswers: ['É meio-dia e quinze.'] },
        ),
      ],
    },
    {
      title: 'A que horas?',
      objective: 'Decir a qué hora hacés algo.',
      intro: {
        explanation:
          'Para preguntar cuándo pasa algo: a que horas? Se responde con às + número: às nove («a las nueve»). Con la una: à uma. Y ao meio-dia: «al mediodía».',
        examples: [
          { target: 'A que horas você trabalha?', base: '¿A qué hora trabajás?' },
          { target: 'Eu acordo às sete.', base: 'Me despierto a las siete.' },
        ],
      },
      takeaways: ['Preguntás a que horas…?', 'Decís a qué hora hacés algo con às.'],
      exercises: [
        ex.translationChoice('às', 'a las', ['son', 'y media', 'hoy'], ['pt-as-hora']),
        ex.translationChoice(
          'a que horas?',
          '¿a qué hora?',
          ['¿qué hora es?', '¿dónde?', '¿de quién es?'],
          ['pt-a-que-horas'],
        ),
        ex.listenChoice(
          'Eu acordo às sete.',
          ['Eu acordo às seis.', 'São sete horas.', 'Eu janto às oito.'],
          ['pt-acordo', 'pt-as-hora', 'pt-sete'],
        ),
        ex.fillBlank(
          'Trabalho ___ nove.',
          'Trabajo a las nueve.',
          'às',
          ['são', 'e', 'em'],
          ['pt-trabalho', 'pt-as-hora', 'pt-nove'],
        ),
        ex.fillBlank(
          'Almoço ao ___.',
          'Almuerzo al mediodía.',
          'meio-dia',
          ['amanhã', 'hoje', 'meia'],
          ['pt-almoco', 'pt-meio-dia'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('A que horas você janta?', '¿A qué hora cenás?', [
          'pt-a-que-horas',
          'pt-voce',
        ]),
        ex.shortAnswer(
          'A que horas você acorda?',
          '¿A qué hora te despertás? (Respondé que a las siete.)',
          'Acordo às sete.',
          ['Às sete.', 'Eu acordo às sete.', 'Acordo às sete horas.'],
          ['pt-acordo', 'pt-as-hora', 'pt-sete'],
        ),
        ex.translateWrite(
          'Trabajo a las nueve.',
          'Trabalho às nove.',
          ['pt-trabalho', 'pt-as-hora', 'pt-nove'],
          { acceptedAnswers: ['Eu trabalho às nove.', 'Trabalho às nove horas.'] },
        ),
      ],
    },
    {
      title: 'Segunda, terça…',
      objective: 'Nombrar los días de lunes a viernes.',
      intro: {
        explanation:
          'En portugués los días de lunes a viernes se cuentan: segunda-feira (lunes), terça-feira (martes), quarta-feira, quinta-feira, sexta-feira. En la charla se dice sólo segunda, terça…',
        examples: [
          { target: 'Hoje é segunda-feira.', base: 'Hoy es lunes.' },
          { target: 'Terça-feira eu estudo.', base: 'El martes estudio.' },
        ],
      },
      takeaways: ['Nombrás los días de lunes a viernes.', 'Sabés que segunda-feira es lunes.'],
      exercises: [
        ex.translationChoice(
          'segunda-feira',
          'lunes',
          ['segundo', 'martes', 'domingo'],
          ['pt-segunda'],
          { explanation: 'Se cuenta desde el domingo: segunda-feira es lunes.' },
        ),
        ex.translationChoice(
          'quinta-feira',
          'jueves',
          ['viernes', 'martes', 'quinto'],
          ['pt-quinta'],
        ),
        ex.listenChoice(
          'quarta-feira',
          ['terça-feira', 'sexta-feira', 'segunda-feira'],
          ['pt-quarta'],
        ),
        ex.matchPairs(
          [
            ['segunda-feira', 'lunes'],
            ['terça-feira', 'martes'],
            ['quarta-feira', 'miércoles'],
            ['sexta-feira', 'viernes'],
          ],
          ['pt-segunda', 'pt-terca', 'pt-quarta', 'pt-sexta'],
        ),
        ex.fillBlank(
          'Hoje ___ sexta-feira.',
          'Hoy es viernes.',
          'é',
          ['são', 'às', 'tem'],
          ['pt-hoje', 'pt-e-ser', 'pt-sexta'],
        ),
        ex.orderWords('Terça-feira eu estudo português.', 'El martes estudio portugués.', [
          'pt-terca',
          'pt-estudo',
        ]),
        ex.translateWrite('Hoy es lunes.', 'Hoje é segunda-feira.', ['pt-hoje', 'pt-segunda'], {
          acceptedAnswers: ['Hoje é segunda.'],
        }),
        ex.translateWrite(
          'El jueves trabajo en casa.',
          'Quinta-feira trabalho em casa.',
          ['pt-quinta', 'pt-trabalho', 'pt-em-casa'],
          {
            acceptedAnswers: [
              'Na quinta-feira trabalho em casa.',
              'Quinta-feira eu trabalho em casa.',
              'Na quinta-feira eu trabalho em casa.',
              'Quinta trabalho em casa.',
            ],
          },
        ),
      ],
    },
    {
      title: 'Hoje, amanhã',
      objective: 'Hablar de hoy, mañana y el fin de semana.',
      intro: {
        explanation:
          'Hoje es «hoy» y amanhã «mañana» (el día siguiente; «a la mañana» es de manhã). Sábado y domingo se escriben como en español. «El fin de semana» es no fim de semana.',
        examples: [
          { target: 'Amanhã é sábado.', base: 'Mañana es sábado.' },
          { target: 'No fim de semana eu durmo muito.', base: 'El fin de semana duermo mucho.' },
        ],
      },
      takeaways: ['Distinguís amanhã y de manhã.', 'Hablás del fin de semana.'],
      exercises: [
        ex.translationChoice(
          'amanhã',
          'mañana (el día siguiente)',
          ['a la mañana', 'hoy', 'siempre'],
          ['pt-amanha'],
          { explanation: 'Amanhã es el día siguiente; «a la mañana» es de manhã.' },
        ),
        ex.translationChoice(
          'fim de semana',
          'fin de semana',
          ['semana', 'hoy', 'mediodía'],
          ['pt-fim-de-semana'],
        ),
        ex.imageChoice('📅', 'hoje', ['amanhã', 'às', 'depois'], ['pt-hoje']),
        ex.listenChoice(
          'Amanhã é sábado.',
          ['Hoje é sábado.', 'Amanhã é domingo.', 'Hoje é segunda-feira.'],
          ['pt-amanha', 'pt-sabado'],
        ),
        ex.fillBlank(
          'No fim de ___ eu durmo muito.',
          'El fin de semana duermo mucho.',
          'semana',
          ['dia', 'manhã', 'noite'],
          ['pt-fim-de-semana', 'pt-durmo'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords(
          'Hoje é sexta-feira e amanhã é sábado.',
          'Hoy es viernes y mañana es sábado.',
          ['pt-hoje', 'pt-sexta', 'pt-amanha', 'pt-sabado'],
        ),
        ex.shortAnswer(
          'Que dia é hoje?',
          '¿Qué día es hoy? (Respondé que hoy es domingo.)',
          'Hoje é domingo.',
          ['É domingo.', 'Domingo.'],
          ['pt-hoje', 'pt-domingo'],
        ),
        ex.translateWrite(
          'Mañana es viernes.',
          'Amanhã é sexta-feira.',
          ['pt-amanha', 'pt-sexta'],
          {
            acceptedAnswers: ['Amanhã é sexta.'],
          },
        ),
      ],
    },
  ],
};
