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
export const unit09: UnitDef = {
  position: 9,
  title: 'Horas y días',
  titleEn: 'Ore e giorni',
  description: 'Decir y preguntar la hora, a qué hora hacés algo y los días de la semana.',
  emoji: '🕗',
  objective:
    'Podés preguntar y decir la hora (che ore sono? sono le otto), decir a qué hora hacés algo (alle nove) y nombrar los días.',
  grammar: {
    title: 'Sono le… / è l’una / alle…',
    explanation:
      "Para la hora se usa sono le + número (sono le otto), salvo la una: è l'una. Para decir a qué hora pasa algo: alle + número (alle nove) y all'una. Media es e mezza y cuarto es e un quarto.",
    examples: [
      { target: 'Che ore sono? Sono le otto.', base: '¿Qué hora es? Son las ocho.' },
      { target: "È l'una e mezza.", base: 'Es la una y media.' },
      { target: 'Lavoro alle nove.', base: 'Trabajo a las nueve.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de italiano.',
  },
  words: [
    w(
      'it-che-ore-sono',
      'che ore sono?',
      '¿qué hora es?',
      'Scusa, che ore sono?',
      'Perdón, ¿qué hora es?',
      ['time', 'questions'],
      { acceptedTexts: ['che ora è?'], emoji: '🕗' },
    ),
    w('it-sono-le', 'sono le', 'son las', 'Sono le otto.', 'Son las ocho.', ['time']),
    w('it-e-l-una', "è l'una", 'es la una', "È l'una e mezza.", 'Es la una y media.', ['time']),
    w('it-e-mezza', 'e mezza', 'y media', 'Sono le tre e mezza.', 'Son las tres y media.', [
      'time',
    ]),
    w(
      'it-e-un-quarto',
      'e un quarto',
      'y cuarto',
      'Sono le sei e un quarto.',
      'Son las seis y cuarto.',
      ['time'],
    ),
    w('it-undici', 'undici', 'once', 'Sono le undici.', 'Son las once.', ['numbers']),
    w('it-dodici', 'dodici', 'doce', 'Sono le dodici.', 'Son las doce.', ['numbers']),
    w(
      'it-mezzogiorno',
      'mezzogiorno',
      'mediodía',
      'Mangio a mezzogiorno.',
      'Como al mediodía.',
      ['time'],
      { emoji: '🕛' },
    ),
    w('it-a-che-ora', 'a che ora?', '¿a qué hora?', 'A che ora lavori?', '¿A qué hora trabajás?', [
      'time',
      'questions',
    ]),
    w('it-alle', 'alle', 'a las', 'Lavoro alle nove.', 'Trabajo a las nueve.', ['time']),
    w('it-oggi', 'oggi', 'hoy', 'Oggi è lunedì.', 'Hoy es lunes.', ['time'], { emoji: '📅' }),
    w('it-domani', 'domani', 'mañana (el día siguiente)', 'Domani è sabato.', 'Mañana es sábado.', [
      'time',
    ]),
    w('it-lunedi', 'lunedì', 'lunes', 'Oggi è lunedì.', 'Hoy es lunes.', ['days']),
    w(
      'it-martedi',
      'martedì',
      'martes',
      'Martedì studio italiano.',
      'El martes estudio italiano.',
      ['days'],
    ),
    w(
      'it-mercoledi',
      'mercoledì',
      'miércoles',
      'Mercoledì lavoro a casa.',
      'El miércoles trabajo en casa.',
      ['days'],
    ),
    w('it-giovedi', 'giovedì', 'jueves', 'Giovedì leggo.', 'El jueves leo.', ['days']),
    w(
      'it-venerdi',
      'venerdì',
      'viernes',
      'Venerdì sera mangio una pizza.',
      'El viernes a la noche como una pizza.',
      ['days'],
    ),
    w('it-sabato', 'sabato', 'sábado', 'Domani è sabato.', 'Mañana es sábado.', ['days']),
    w(
      'it-domenica',
      'domenica',
      'domingo',
      'La domenica dormo molto.',
      'Los domingos duermo mucho.',
      ['days'],
    ),
    w(
      'it-fine-settimana',
      'il fine settimana',
      'el fin de semana',
      'Il fine settimana dormo.',
      'El fin de semana duermo.',
      ['time'],
      { acceptedTexts: ['il weekend'] },
    ),
  ],
  lessons: [
    {
      title: 'Che ore sono?',
      objective: 'Preguntar y decir la hora en punto.',
      intro: {
        explanation:
          "Para preguntar la hora: che ore sono? Se responde con sono le + número, en plural como en español: sono le otto. La una es la excepción: è l'una.",
        examples: [
          { target: 'Che ore sono? Sono le otto.', base: '¿Qué hora es? Son las ocho.' },
          { target: "È l'una.", base: 'Es la una.' },
        ],
      },
      takeaways: ['Preguntás la hora con che ore sono?', "Decís la hora con sono le… y è l'una."],
      exercises: [
        ex.translationChoice(
          'che ore sono?',
          '¿qué hora es?',
          ['¿cuántos años tenés?', '¿cómo estás?', '¿dónde está?'],
          ['it-che-ore-sono'],
        ),
        ex.listenChoice(
          'Sono le otto.',
          ['Sono le sette.', 'Sono le tre.', "È l'una."],
          ['it-sono-le', 'it-otto'],
        ),
        ex.listenChoice("È l'una.", ['Sono le due.', 'Sono le nove.', 'È lunedì.'], ['it-e-l-una']),
        ex.fillBlank(
          '___ le dieci.',
          'Son las diez.',
          'Sono',
          ['È', 'Ho', 'Alle'],
          ['it-sono-le', 'it-dieci'],
          { explanation: 'Para la hora se usa sono le (plural), salvo la una.' },
        ),
        ex.fillBlank("___ l'una.", 'Es la una.', 'È', ['Sono', 'Ho', 'Ha'], ['it-e-l-una'], {
          explanation: "La una va en singular: è l'una.",
        }),
        ex.matchPairs(
          [
            ['sono le sette', 'son las siete'],
            ['sono le cinque', 'son las cinco'],
            ["è l'una", 'es la una'],
            ['sono le nove', 'son las nueve'],
          ],
          ['it-sono-le', 'it-sette', 'it-cinque', 'it-e-l-una', 'it-nove'],
        ),
        ex.shortAnswer(
          'Che ore sono?',
          '¿Qué hora es? (Respondé que son las cuatro.)',
          'Sono le quattro.',
          ['Le quattro.'],
          ['it-sono-le', 'it-quattro'],
        ),
        ex.translateWrite('Son las ocho.', 'Sono le otto.', ['it-sono-le', 'it-otto']),
      ],
    },
    {
      title: 'E mezza, e un quarto',
      objective: 'Decir la hora con minutos.',
      intro: {
        explanation:
          'Como en español: y media es e mezza, y cuarto es e un quarto. Las 11 y las 12 son undici y dodici; a las 12 del día también se le dice mezzogiorno («mediodía»).',
        examples: [
          { target: 'Sono le tre e mezza.', base: 'Son las tres y media.' },
          { target: 'Sono le undici e un quarto.', base: 'Son las once y cuarto.' },
        ],
      },
      takeaways: ['Decís y media y y cuarto.', 'Contás hasta las doce y decís mediodía.'],
      exercises: [
        ex.translationChoice(
          'e mezza',
          'y media',
          ['y cuarto', 'a las', 'son las'],
          ['it-e-mezza'],
        ),
        ex.translationChoice('undici', 'once', ['doce', 'diez', 'quince'], ['it-undici']),
        ex.imageChoice('🕛', 'mezzogiorno', ['domani', 'oggi', 'sabato'], ['it-mezzogiorno']),
        ex.listenChoice(
          'Sono le dodici e un quarto.',
          ['Sono le dieci e un quarto.', 'Sono le dodici e mezza.', 'Sono le due e un quarto.'],
          ['it-dodici', 'it-e-un-quarto'],
        ),
        ex.fillBlank(
          'Sono le sei e ___.',
          'Son las seis y media.',
          'mezza',
          ['quarto', 'una', 'dodici'],
          ['it-sei-numero', 'it-e-mezza'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('Sono le undici e un quarto.', 'Son las once y cuarto.', [
          'it-sono-le',
          'it-undici',
          'it-e-un-quarto',
        ]),
        ex.translateWrite('Son las tres y media.', 'Sono le tre e mezza.', [
          'it-sono-le',
          'it-tre',
          'it-e-mezza',
        ]),
        ex.translateWrite(
          'Son las doce y cuarto.',
          'Sono le dodici e un quarto.',
          ['it-sono-le', 'it-dodici', 'it-e-un-quarto'],
          { acceptedAnswers: ['È mezzogiorno e un quarto.'] },
        ),
      ],
    },
    {
      title: 'A che ora?',
      objective: 'Decir a qué hora hacés algo.',
      intro: {
        explanation:
          "Para preguntar cuándo pasa algo: a che ora? Se responde con alle + número: alle nove («a las nueve»). Con la una: all'una. Y a mezzogiorno: «al mediodía».",
        examples: [
          { target: 'A che ora lavori?', base: '¿A qué hora trabajás?' },
          { target: 'Mi sveglio alle sette.', base: 'Me despierto a las siete.' },
        ],
      },
      takeaways: ['Preguntás a che ora…?', 'Decís a qué hora hacés algo con alle.'],
      exercises: [
        ex.translationChoice('alle', 'a las', ['son las', 'y media', 'hoy'], ['it-alle']),
        ex.translationChoice(
          'a che ora?',
          '¿a qué hora?',
          ['¿qué hora es?', '¿dónde?', '¿de qué color es?'],
          ['it-a-che-ora'],
        ),
        ex.listenChoice(
          'Mi sveglio alle sette.',
          ['Mi sveglio alle sei.', 'Sono le sette.', 'Mi alzo alle otto.'],
          ['it-mi-sveglio', 'it-alle', 'it-sette'],
        ),
        ex.fillBlank(
          'Lavoro ___ nove.',
          'Trabajo a las nueve.',
          'alle',
          ['sono le', 'e', 'in'],
          ['it-lavoro', 'it-alle', 'it-nove'],
        ),
        ex.fillBlank(
          'Mangio a ___.',
          'Como al mediodía.',
          'mezzogiorno',
          ['domani', 'oggi', 'mezza'],
          ['it-mangio', 'it-mezzogiorno'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('A che ora fai colazione?', '¿A qué hora desayunás?', [
          'it-a-che-ora',
          'it-faccio-colazione',
        ]),
        ex.shortAnswer(
          'A che ora ti svegli?',
          '¿A qué hora te despertás? (Respondé que a las siete.)',
          'Mi sveglio alle sette.',
          ['Alle sette.', 'Io mi sveglio alle sette.'],
          ['it-mi-sveglio', 'it-alle', 'it-sette'],
        ),
        ex.translateWrite(
          'Trabajo a las nueve.',
          'Lavoro alle nove.',
          ['it-lavoro', 'it-alle', 'it-nove'],
          { acceptedAnswers: ['Io lavoro alle nove.'] },
        ),
      ],
    },
    {
      title: 'I giorni',
      objective: 'Nombrar los días de lunes a viernes.',
      intro: {
        explanation:
          'Los días de lunes a viernes terminan en -dì y llevan tilde: lunedì, martedì, mercoledì, giovedì, venerdì. Se escriben con minúscula. «El lunes estudio» es simplemente lunedì studio, sin artículo.',
        examples: [
          { target: 'Oggi è lunedì.', base: 'Hoy es lunes.' },
          { target: 'Martedì studio italiano.', base: 'El martes estudio italiano.' },
        ],
      },
      takeaways: ['Nombrás los días de lunes a viernes.', 'Decís qué hacés un día sin artículo.'],
      exercises: [
        ex.translationChoice('lunedì', 'lunes', ['martes', 'miércoles', 'jueves'], ['it-lunedi']),
        ex.translationChoice('giovedì', 'jueves', ['viernes', 'martes', 'lunes'], ['it-giovedi']),
        ex.listenChoice('mercoledì', ['martedì', 'venerdì', 'lunedì'], ['it-mercoledi']),
        ex.matchPairs(
          [
            ['lunedì', 'lunes'],
            ['martedì', 'martes'],
            ['mercoledì', 'miércoles'],
            ['venerdì', 'viernes'],
          ],
          ['it-lunedi', 'it-martedi', 'it-mercoledi', 'it-venerdi'],
        ),
        ex.fillBlank(
          'Oggi ___ venerdì.',
          'Hoy es viernes.',
          'è',
          ['sono', 'alle', 'ha'],
          ['it-oggi', 'it-e-essere', 'it-venerdi'],
        ),
        ex.orderWords('Martedì studio italiano.', 'El martes estudio italiano.', [
          'it-martedi',
          'it-studio',
          'it-italiano',
        ]),
        ex.translateWrite('Hoy es lunes.', 'Oggi è lunedì.', [
          'it-oggi',
          'it-e-essere',
          'it-lunedi',
        ]),
        ex.translateWrite(
          'El jueves trabajo en casa.',
          'Giovedì lavoro a casa.',
          ['it-giovedi', 'it-lavoro', 'it-a-casa'],
          { acceptedAnswers: ['Il giovedì lavoro a casa.', 'Lavoro a casa giovedì.'] },
        ),
      ],
    },
    {
      title: 'Oggi, domani',
      objective: 'Hablar de hoy, mañana y el fin de semana.',
      intro: {
        explanation:
          'Oggi es «hoy» y domani «mañana» (el día siguiente; «a la mañana» es la mattina). Sabato y domenica no llevan tilde. Con artículo indican costumbre: la domenica = «los domingos».',
        examples: [
          { target: 'Domani è sabato.', base: 'Mañana es sábado.' },
          { target: 'Il fine settimana dormo molto.', base: 'El fin de semana duermo mucho.' },
        ],
      },
      takeaways: ['Distinguís domani y la mattina.', 'Hablás del fin de semana.'],
      exercises: [
        ex.translationChoice(
          'domani',
          'mañana (el día siguiente)',
          ['a la mañana', 'hoy', 'siempre'],
          ['it-domani'],
          { explanation: 'Domani es el día siguiente; «a la mañana» es la mattina.' },
        ),
        ex.translationChoice(
          'domenica',
          'domingo',
          ['sábado', 'lunes', 'viernes'],
          ['it-domenica'],
        ),
        ex.imageChoice('📅', 'oggi', ['domani', 'alle', 'poi'], ['it-oggi']),
        ex.listenChoice(
          'Domani è sabato.',
          ['Oggi è sabato.', 'Domani è domenica.', 'Oggi è lunedì.'],
          ['it-domani', 'it-sabato'],
        ),
        ex.fillBlank(
          'Il fine ___ dormo molto.',
          'El fin de semana duermo mucho.',
          'settimana',
          ['giorno', 'mattina', 'sera'],
          ['it-fine-settimana', 'it-dormo', 'it-molto'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('Oggi è venerdì e domani è sabato.', 'Hoy es viernes y mañana es sábado.', [
          'it-oggi',
          'it-venerdi',
          'it-domani',
          'it-sabato',
        ]),
        ex.shortAnswer(
          'Che giorno è oggi?',
          '¿Qué día es hoy? (Respondé que hoy es domingo.)',
          'Oggi è domenica.',
          ['È domenica.', 'Domenica.'],
          ['it-oggi', 'it-domenica'],
        ),
        ex.translateWrite('Mañana es domingo.', 'Domani è domenica.', ['it-domani', 'it-domenica']),
      ],
    },
  ],
};
