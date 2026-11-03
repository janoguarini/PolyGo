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
export const unit08: UnitDef = {
  position: 8,
  title: 'La rutina',
  titleEn: 'A rotina',
  description:
    'Contar tu día: despertarte, trabajar o estudiar, almorzar y cenar, con verbos en -ar, -er e -ir.',
  emoji: '🌅',
  objective:
    'Podés contar qué hacés en un día normal con verbos en presente (falo, escrevo, durmo) y decir dónde vivís con moro em.',
  grammar: {
    title: 'Presente: -ar, -er, -ir',
    explanation:
      'Con eu casi todos los verbos terminan en -o: falo, escrevo, durmo. Con você, ele y ela, en -a (los de -ar) o en -e (los de -er e -ir): fala, escreve, dorme. En Brasil «tú» casi no se usa: se dice você con el verbo como ele.',
    examples: [
      { target: 'Eu falo português.', base: 'Yo hablo portugués.' },
      { target: 'Você fala espanhol?', base: '¿Vos hablás español?' },
      { target: 'Eu moro em São Paulo.', base: 'Vivo en San Pablo.' },
    ],
  },
  review: {
    status: 'draft',
    notes:
      'Pendiente de revisión por un hablante nativo o docente de portugués de Brasil (falso amigo assistir).',
  },
  words: [
    w(
      'pt-acordo',
      'acordo',
      'me despierto',
      'Eu acordo às sete.',
      'Me despierto a las siete.',
      ['verbs', 'routine'],
      { emoji: '⏰' },
    ),
    w(
      'pt-tomo-cafe',
      'tomo café da manhã',
      'tomo el desayuno',
      'Tomo café da manhã em casa.',
      'Tomo el desayuno en casa.',
      ['verbs', 'routine'],
      { emoji: '🥐' },
    ),
    w(
      'pt-almoco',
      'almoço',
      'almuerzo',
      'Almoço ao meio-dia.',
      'Almuerzo al mediodía.',
      ['verbs', 'routine'],
      { emoji: '🍽️' },
    ),
    w('pt-janto', 'janto', 'ceno', 'Janto em casa.', 'Ceno en casa.', ['verbs', 'routine']),
    w(
      'pt-de-manha',
      'de manhã',
      'a la mañana',
      'De manhã eu tomo café.',
      'A la mañana tomo café.',
      ['time'],
      { acceptedTranslations: ['por la mañana', 'de mañana'] },
    ),
    w('pt-a-noite', 'à noite', 'a la noche', 'À noite eu leio.', 'A la noche leo.', ['time'], {
      acceptedTranslations: ['por la noche', 'de noche'],
    }),
    w('pt-falo', 'falo', 'hablo', 'Falo português e espanhol.', 'Hablo portugués y español.', [
      'verbs',
    ]),
    w(
      'pt-fala',
      'fala',
      'habla / hablás (con você)',
      'Você fala espanhol?',
      '¿Vos hablás español?',
      ['verbs'],
      { acceptedTranslations: ['habla', 'hablás'] },
    ),
    w(
      'pt-leio',
      'leio',
      'leo',
      'À noite eu leio um livro.',
      'A la noche leo un libro.',
      ['verbs'],
      {
        emoji: '📖',
      },
    ),
    w(
      'pt-escrevo',
      'escrevo',
      'escribo',
      'Escrevo com a caneta.',
      'Escribo con la lapicera.',
      ['verbs'],
      { emoji: '✍️' },
    ),
    w('pt-durmo', 'durmo', 'duermo', 'Durmo oito horas.', 'Duermo ocho horas.', ['verbs'], {
      emoji: '😴',
    }),
    w(
      'pt-trabalho',
      'trabalho',
      'trabajo',
      'Trabalho em casa.',
      'Trabajo en casa.',
      ['verbs', 'work'],
      {
        emoji: '💼',
      },
    ),
    w(
      'pt-estudo',
      'estudo',
      'estudio',
      'Estudo português todo dia.',
      'Estudio portugués todos los días.',
      ['verbs'],
    ),
    w(
      'pt-moro',
      'moro',
      'vivo (en un lugar)',
      'Eu moro em Buenos Aires.',
      'Vivo en Buenos Aires.',
      ['verbs'],
      { acceptedTranslations: ['vivo'] },
    ),
    w(
      'pt-assisto',
      'assisto',
      'miro (la tele)',
      'À noite eu assisto TV.',
      'A la noche miro la tele.',
      ['verbs'],
      { acceptedTranslations: ['miro', 'veo'], emoji: '📺' },
    ),
    w('pt-em-casa', 'em casa', 'en casa', 'Trabalho em casa.', 'Trabajo en casa.', ['places'], {
      emoji: '🏠',
    }),
    w(
      'pt-todo-dia',
      'todo dia',
      'todos los días',
      'Estudo todo dia.',
      'Estudio todos los días.',
      ['time'],
      { acceptedTexts: ['todos os dias'], acceptedTranslations: ['cada día'] },
    ),
    w('pt-sempre', 'sempre', 'siempre', 'Sempre tomo café da manhã.', 'Siempre tomo el desayuno.', [
      'time',
    ]),
    w(
      'pt-depois',
      'depois',
      'después',
      'Almoço e depois trabalho.',
      'Almuerzo y después trabajo.',
      ['time'],
      { acceptedTranslations: ['luego'] },
    ),
  ],
  lessons: [
    {
      title: 'Acordo e tomo café',
      objective: 'Contar cómo empieza tu día.',
      intro: {
        explanation:
          'Acordo es «me despierto», sin pronombre reflexivo. Desayunar se dice tomar café da manhã: eu tomo café da manhã. De manhã es «a la mañana».',
        examples: [
          { target: 'Eu acordo às sete.', base: 'Me despierto a las siete.' },
          {
            target: 'De manhã tomo café da manhã em casa.',
            base: 'A la mañana tomo el desayuno en casa.',
          },
        ],
      },
      takeaways: [
        'Decís que te despertás con acordo.',
        'Decís que desayunás con tomo café da manhã.',
      ],
      exercises: [
        ex.imageChoice('⏰', 'acordo', ['durmo', 'leio', 'trabalho'], ['pt-acordo']),
        ex.translationChoice(
          'acordo',
          'me despierto',
          ['duermo', 'me llamo', 'ceno'],
          ['pt-acordo'],
          { explanation: 'Acordo es «me despierto»; «estar de acuerdo» es concordar.' },
        ),
        ex.translationChoice(
          'de manhã',
          'a la mañana',
          ['a la noche', 'todos los días', 'siempre'],
          ['pt-de-manha'],
        ),
        ex.listenChoice(
          'Eu acordo e tomo café da manhã.',
          ['Eu acordo às sete.', 'Eu tomo um café.', 'Eu durmo em casa.'],
          ['pt-acordo', 'pt-tomo-cafe'],
        ),
        ex.fillBlank(
          'De manhã eu ___ café da manhã.',
          'A la mañana tomo el desayuno.',
          'tomo',
          ['sou', 'tenho', 'quero'],
          ['pt-de-manha', 'pt-tomo-cafe'],
        ),
        ex.orderWords(
          'De manhã eu acordo e tomo café da manhã.',
          'A la mañana me despierto y tomo el desayuno.',
          ['pt-de-manha', 'pt-acordo', 'pt-tomo-cafe'],
        ),
        ex.translateWrite(
          'Me despierto a la mañana.',
          'Acordo de manhã.',
          ['pt-acordo', 'pt-de-manha'],
          {
            acceptedAnswers: ['Eu acordo de manhã.', 'De manhã eu acordo.', 'De manhã acordo.'],
          },
        ),
        ex.translateWrite(
          'Tomo el desayuno en casa.',
          'Tomo café da manhã em casa.',
          ['pt-tomo-cafe', 'pt-em-casa'],
          { acceptedAnswers: ['Eu tomo café da manhã em casa.'] },
        ),
      ],
    },
    {
      title: 'Falo, escrevo, durmo',
      objective: 'Usar verbos en -ar, -er e -ir con eu.',
      intro: {
        explanation:
          'Los verbos terminan en -ar (falar), -er (escrever, ler) o -ir (dormir). Con eu terminan en -o: falo, escrevo, durmo. Ler («leer») es irregular: eu leio.',
        examples: [
          { target: 'Falo português.', base: 'Hablo portugués.' },
          { target: 'À noite eu leio e depois durmo.', base: 'A la noche leo y después duermo.' },
        ],
      },
      takeaways: ['Conjugás verbos en -ar, -er e -ir con eu.', 'Decís qué hacés a la noche.'],
      exercises: [
        ex.translationChoice('leio', 'leo', ['escribo', 'duermo', 'hablo'], ['pt-leio']),
        ex.imageChoice('😴', 'durmo', ['leio', 'escrevo', 'falo'], ['pt-durmo']),
        ex.translationChoice('escrevo', 'escribo', ['leo', 'estudio', 'ceno'], ['pt-escrevo']),
        ex.listenChoice(
          'À noite eu leio um livro.',
          ['À noite eu durmo.', 'De manhã eu leio.', 'Eu escrevo um livro.'],
          ['pt-a-noite', 'pt-leio', 'pt-livro'],
        ),
        ex.fillBlank(
          'Eu ___ espanhol.',
          'Yo hablo español.',
          'falo',
          ['fala', 'sou', 'tenho'],
          ['pt-eu', 'pt-falo', 'pt-espanhol'],
          { explanation: 'Con eu el verbo termina en -o: falo.' },
        ),
        ex.matchPairs(
          [
            ['falo', 'hablo'],
            ['leio', 'leo'],
            ['escrevo', 'escribo'],
            ['durmo', 'duermo'],
          ],
          ['pt-falo', 'pt-leio', 'pt-escrevo', 'pt-durmo'],
        ),
        ex.orderWords('À noite eu leio e depois durmo.', 'A la noche leo y después duermo.', [
          'pt-a-noite',
          'pt-leio',
          'pt-depois',
          'pt-durmo',
        ]),
        ex.translateWrite(
          'Escribo con la lapicera.',
          'Escrevo com a caneta.',
          ['pt-escrevo', 'pt-caneta'],
          { acceptedAnswers: ['Eu escrevo com a caneta.'] },
        ),
        ex.translateWrite(
          'A la noche leo un libro.',
          'À noite eu leio um livro.',
          ['pt-a-noite', 'pt-leio', 'pt-livro'],
          { acceptedAnswers: ['À noite leio um livro.', 'Eu leio um livro à noite.'] },
        ),
      ],
    },
    {
      title: 'Você fala…?',
      objective: 'Conjugar con você, ele y ela.',
      intro: {
        explanation:
          'Con você, ele y ela el verbo termina en -a en los verbos de -ar (fala) y en -e en los demás (escreve, dorme). En Brasil a un amigo también se le dice você.',
        examples: [
          { target: 'Você fala espanhol?', base: '¿Vos hablás español?' },
          { target: 'Ela fala muito bem.', base: 'Ella habla muy bien.' },
        ],
      },
      takeaways: ['Preguntás con você fala…?', 'Hablás de otra persona con ele / ela fala.'],
      exercises: [
        ex.translationChoice(
          'falo',
          'hablo',
          ['habla / hablás (con você)', 'leo', 'vivo (en un lugar)'],
          ['pt-falo'],
        ),
        ex.translationChoice(
          'fala',
          'habla / hablás (con você)',
          ['hablo', 'duermo', 'escribo'],
          ['pt-fala'],
        ),
        ex.listenChoice(
          'Você fala espanhol?',
          ['Eu falo espanhol.', 'Ela fala espanhol.', 'Você é espanhol?'],
          ['pt-voce', 'pt-fala', 'pt-espanhol'],
        ),
        ex.fillBlank(
          'Você ___ português?',
          '¿Vos hablás portugués?',
          'fala',
          ['falo', 'sou', 'tenho'],
          ['pt-voce', 'pt-fala'],
          { explanation: 'Con você el verbo va como con ele: fala.' },
        ),
        ex.fillBlank(
          'Ela ___ muito bem.',
          'Ella habla muy bien.',
          'fala',
          ['falo', 'é', 'tem'],
          ['pt-ela', 'pt-fala', 'pt-bem'],
        ),
        ex.orderWords('Ele fala português e espanhol.', 'Él habla portugués y español.', [
          'pt-ele',
          'pt-fala',
          'pt-espanhol',
        ]),
        ex.shortAnswer(
          'Você fala português?',
          '¿Hablás portugués? (Respondé que sí, que hablás portugués.)',
          'Sim, falo português.',
          ['Sim, eu falo português.', 'Falo.', 'Sim, falo.', 'Sim.'],
          ['pt-sim', 'pt-falo'],
        ),
        ex.translateWrite('Ella habla español.', 'Ela fala espanhol.', [
          'pt-ela',
          'pt-fala',
          'pt-espanhol',
        ]),
      ],
    },
    {
      title: 'Trabalho e estudo',
      objective: 'Decir qué hacés durante el día y dónde vivís.',
      intro: {
        explanation:
          'Trabalho es «trabajo» y estudo «estudio». Para decir dónde vivís se usa morar: eu moro em Buenos Aires. Almoço es «almuerzo» y janto «ceno».',
        examples: [
          { target: 'Eu moro em Buenos Aires.', base: 'Vivo en Buenos Aires.' },
          { target: 'Almoço e depois trabalho.', base: 'Almuerzo y después trabajo.' },
        ],
      },
      takeaways: ['Decís si trabajás o estudiás.', 'Decís dónde vivís con moro em.'],
      exercises: [
        ex.imageChoice('💼', 'trabalho', ['estudo', 'durmo', 'janto'], ['pt-trabalho']),
        ex.translationChoice(
          'moro',
          'vivo (en un lugar)',
          ['trabajo', 'estudio', 'ceno'],
          ['pt-moro'],
        ),
        ex.translationChoice('janto', 'ceno', ['almuerzo', 'duermo', 'leo'], ['pt-janto']),
        ex.listenChoice(
          'Trabalho em casa.',
          ['Estudo em casa.', 'Janto em casa.', 'Trabalho na cozinha.'],
          ['pt-trabalho', 'pt-em-casa'],
        ),
        ex.fillBlank(
          'Eu ___ em Buenos Aires.',
          'Vivo en Buenos Aires.',
          'moro',
          ['sou', 'estou', 'tenho'],
          ['pt-moro'],
          { explanation: 'Para decir dónde vivís se usa morar: eu moro em…' },
        ),
        ex.matchPairs(
          [
            ['trabalho', 'trabajo'],
            ['estudo', 'estudio'],
            ['almoço', 'almuerzo'],
            ['janto', 'ceno'],
          ],
          ['pt-trabalho', 'pt-estudo', 'pt-almoco', 'pt-janto'],
        ),
        ex.shortAnswer(
          'Onde você mora?',
          '¿Dónde vivís? (Respondé que vivís en Buenos Aires.)',
          'Moro em Buenos Aires.',
          ['Eu moro em Buenos Aires.', 'Em Buenos Aires.'],
          ['pt-moro'],
        ),
        ex.translateWrite('Trabajo en casa.', 'Trabalho em casa.', ['pt-trabalho', 'pt-em-casa'], {
          acceptedAnswers: ['Eu trabalho em casa.'],
        }),
      ],
    },
    {
      title: 'Todo dia',
      objective: 'Contar tu rutina en orden.',
      intro: {
        explanation:
          'Todo dia es «todos los días»; sempre, «siempre»; depois, «después». Ojo con assistir: assisto TV es «miro la tele», no «asisto».',
        examples: [
          { target: 'Estudo português todo dia.', base: 'Estudio portugués todos los días.' },
          { target: 'Janto e depois assisto TV.', base: 'Ceno y después miro la tele.' },
        ],
      },
      takeaways: [
        'Contás tu rutina con todo dia y depois.',
        'Sabés que assistir TV es mirar la tele.',
      ],
      exercises: [
        ex.translationChoice(
          'todo dia',
          'todos los días',
          ['a la mañana', 'siempre', 'después'],
          ['pt-todo-dia'],
        ),
        ex.translationChoice(
          'assisto',
          'miro (la tele)',
          ['asisto', 'ayudo', 'duermo'],
          ['pt-assisto'],
          {
            explanation: 'Falso amigo: assistir TV es mirar la tele.',
          },
        ),
        ex.imageChoice('📺', 'assisto TV', ['leio', 'escrevo', 'durmo'], ['pt-assisto']),
        ex.listenChoice(
          'Sempre tomo café da manhã.',
          ['Sempre tomo um café.', 'Sempre durmo muito.', 'Tomo café da manhã em casa.'],
          ['pt-sempre', 'pt-tomo-cafe'],
        ),
        ex.fillBlank(
          'Almoço e ___ trabalho.',
          'Almuerzo y después trabajo.',
          'depois',
          ['sempre', 'também', 'muito'],
          ['pt-almoco', 'pt-depois', 'pt-trabalho'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('Estudo português todo dia.', 'Estudio portugués todos los días.', [
          'pt-estudo',
          'pt-todo-dia',
        ]),
        ex.translateWrite(
          'Ceno y después miro la tele.',
          'Janto e depois assisto TV.',
          ['pt-janto', 'pt-depois', 'pt-assisto'],
          {
            acceptedAnswers: ['Janto e depois assisto televisão.', 'Eu janto e depois assisto TV.'],
          },
        ),
        ex.translateWrite(
          'Estudio todos los días.',
          'Estudo todo dia.',
          ['pt-estudo', 'pt-todo-dia'],
          {
            acceptedAnswers: [
              'Eu estudo todo dia.',
              'Estudo todos os dias.',
              'Todo dia eu estudo.',
            ],
          },
        ),
      ],
    },
  ],
};
