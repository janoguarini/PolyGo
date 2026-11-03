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
export const unit08: UnitDef = {
  position: 8,
  title: 'La rutina',
  titleEn: 'La routine',
  description:
    'Contar tu día: despertarte, desayunar, trabajar o estudiar, con verbos en -are, -ere e -ire.',
  emoji: '🌅',
  objective:
    'Podés contar qué hacés en un día normal con verbos en presente (parlo, leggo, dormo) y con mi sveglio / mi alzo.',
  grammar: {
    title: 'Presente: -are, -ere, -ire y verbos reflexivos',
    explanation:
      'Con io casi todos los verbos terminan en -o: parlo, leggo, dormo. Con tu terminan en -i: parli, leggi, dormi. Con lui / lei, en -a (los de -are) o en -e (los de -ere e -ire): parla, legge, dorme. Los reflexivos llevan mi delante, como en español: mi sveglio, mi alzo.',
    examples: [
      { target: 'Io parlo italiano.', base: 'Yo hablo italiano.' },
      { target: 'Tu parli spagnolo?', base: '¿Vos hablás español?' },
      {
        target: 'La mattina mi sveglio alle sette.',
        base: 'A la mañana me despierto a las siete.',
      },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de italiano.',
  },
  words: [
    w(
      'it-mi-sveglio',
      'mi sveglio',
      'me despierto',
      'La mattina mi sveglio presto.',
      'A la mañana me despierto temprano.',
      ['verbs', 'routine'],
      { emoji: '⏰' },
    ),
    w(
      'it-mi-alzo',
      'mi alzo',
      'me levanto',
      'Mi sveglio e mi alzo.',
      'Me despierto y me levanto.',
      ['verbs', 'routine'],
    ),
    w(
      'it-faccio-colazione',
      'faccio colazione',
      'desayuno (tomo el desayuno)',
      'Faccio colazione a casa.',
      'Desayuno en casa.',
      ['verbs', 'routine'],
      { acceptedTranslations: ['tomo el desayuno'], emoji: '🥐' },
    ),
    w(
      'it-la-mattina',
      'la mattina',
      'a la mañana',
      'La mattina bevo un caffè.',
      'A la mañana tomo un café.',
      ['time'],
      { acceptedTranslations: ['por la mañana', 'de mañana'] },
    ),
    w(
      'it-la-sera',
      'la sera',
      'a la noche',
      'La sera leggo un libro.',
      'A la noche leo un libro.',
      ['time'],
      { acceptedTranslations: ['por la noche', 'de noche'] },
    ),
    w('it-parlo', 'parlo', 'hablo', 'Parlo italiano e spagnolo.', 'Hablo italiano y español.', [
      'verbs',
    ]),
    w('it-parli', 'parli', 'hablás', 'Tu parli italiano?', '¿Vos hablás italiano?', ['verbs'], {
      acceptedTranslations: ['hablas'],
    }),
    w('it-parla', 'parla', 'habla', 'Lei parla molto bene.', 'Ella habla muy bien.', ['verbs']),
    w(
      'it-leggo',
      'leggo',
      'leo',
      'La sera leggo un libro.',
      'A la noche leo un libro.',
      ['verbs'],
      {
        emoji: '📖',
      },
    ),
    w(
      'it-scrivo',
      'scrivo',
      'escribo',
      'Scrivo con la penna.',
      'Escribo con la lapicera.',
      ['verbs'],
      { emoji: '✍️' },
    ),
    w('it-dormo', 'dormo', 'duermo', 'Dormo otto ore.', 'Duermo ocho horas.', ['verbs'], {
      emoji: '😴',
    }),
    w('it-bevo', 'bevo', 'bebo', 'La mattina bevo un caffè.', 'A la mañana tomo un café.', [
      'verbs',
    ]),
    w(
      'it-mangio',
      'mangio',
      'como (de comer)',
      'Mangio un panino.',
      'Como un sándwich.',
      ['verbs'],
      {
        acceptedTranslations: ['como'],
      },
    ),
    w('it-lavoro', 'lavoro', 'trabajo', 'Lavoro a casa.', 'Trabajo en casa.', ['verbs', 'work'], {
      emoji: '💼',
    }),
    w(
      'it-studio',
      'studio',
      'estudio',
      'Studio italiano ogni giorno.',
      'Estudio italiano todos los días.',
      ['verbs'],
    ),
    w('it-a-casa', 'a casa', 'en casa', 'Lavoro a casa.', 'Trabajo en casa.', ['places'], {
      emoji: '🏠',
    }),
    w(
      'it-ogni-giorno',
      'ogni giorno',
      'todos los días',
      'Studio ogni giorno.',
      'Estudio todos los días.',
      ['time'],
      { acceptedTranslations: ['cada día'] },
    ),
    w('it-sempre', 'sempre', 'siempre', 'Faccio sempre colazione.', 'Siempre desayuno.', ['time']),
    w(
      'it-poi',
      'poi',
      'después',
      'Faccio colazione, poi lavoro.',
      'Desayuno, después trabajo.',
      ['time'],
      { acceptedTranslations: ['luego'] },
    ),
  ],
  lessons: [
    {
      title: 'Mi sveglio e mi alzo',
      objective: 'Contar cómo empieza tu día.',
      intro: {
        explanation:
          'Despertarse y levantarse son reflexivos, como en español: mi sveglio («me despierto»), mi alzo («me levanto»). Desayunar se dice faccio colazione («hago desayuno»). La mattina es «a la mañana».',
        examples: [
          { target: 'La mattina mi sveglio presto.', base: 'A la mañana me despierto temprano.' },
          { target: 'Mi alzo e faccio colazione.', base: 'Me levanto y desayuno.' },
        ],
      },
      takeaways: [
        'Decís que te despertás y te levantás.',
        'Decís que desayunás con faccio colazione.',
      ],
      exercises: [
        ex.imageChoice('⏰', 'mi sveglio', ['dormo', 'leggo', 'lavoro'], ['it-mi-sveglio']),
        ex.translationChoice(
          'mi alzo',
          'me levanto',
          ['me despierto', 'me llamo', 'duermo'],
          ['it-mi-alzo'],
        ),
        ex.translationChoice(
          'la mattina',
          'a la mañana',
          ['a la noche', 'todos los días', 'siempre'],
          ['it-la-mattina'],
        ),
        ex.listenChoice(
          'Mi sveglio e mi alzo.',
          ['Mi chiamo Marco.', 'Mi alzo e lavoro.', 'Faccio colazione.'],
          ['it-mi-sveglio', 'it-mi-alzo'],
        ),
        ex.fillBlank(
          'La mattina ___ colazione.',
          'A la mañana desayuno.',
          'faccio',
          ['sono', 'ho', 'mi'],
          ['it-la-mattina', 'it-faccio-colazione'],
          { explanation: 'Desayunar es fare colazione: io faccio colazione.' },
        ),
        ex.orderWords(
          'La mattina mi sveglio e mi alzo.',
          'A la mañana me despierto y me levanto.',
          ['it-la-mattina', 'it-mi-sveglio', 'it-mi-alzo'],
        ),
        ex.translateWrite('Me despierto y me levanto.', 'Mi sveglio e mi alzo.', [
          'it-mi-sveglio',
          'it-mi-alzo',
        ]),
        ex.translateWrite(
          'A la mañana desayuno.',
          'La mattina faccio colazione.',
          ['it-la-mattina', 'it-faccio-colazione'],
          { acceptedAnswers: ['Faccio colazione la mattina.'] },
        ),
      ],
    },
    {
      title: 'Parlo, leggo, dormo',
      objective: 'Usar verbos en -are, -ere e -ire con io.',
      intro: {
        explanation:
          'Los verbos italianos terminan en -are (parlare), -ere (leggere) o -ire (dormire). Con io, los tres terminan en -o: parlo, leggo, dormo. Igual que en español: hablo, leo, duermo.',
        examples: [
          { target: 'Parlo italiano.', base: 'Hablo italiano.' },
          { target: 'La sera leggo e poi dormo.', base: 'A la noche leo y después duermo.' },
        ],
      },
      takeaways: ['Conjugás verbos en -are, -ere e -ire con io.', 'Decís qué hacés a la noche.'],
      exercises: [
        ex.translationChoice('leggo', 'leo', ['escribo', 'duermo', 'hablo'], ['it-leggo']),
        ex.imageChoice('😴', 'dormo', ['leggo', 'scrivo', 'parlo'], ['it-dormo']),
        ex.translationChoice('scrivo', 'escribo', ['leo', 'estudio', 'bebo'], ['it-scrivo']),
        ex.listenChoice(
          'La sera leggo un libro.',
          ['La sera dormo.', 'La mattina leggo.', 'Scrivo un libro.'],
          ['it-la-sera', 'it-leggo'],
        ),
        ex.fillBlank(
          'Io ___ italiano.',
          'Yo hablo italiano.',
          'parlo',
          ['parli', 'parla', 'sono'],
          ['it-parlo', 'it-italiano'],
          { explanation: 'Con io el verbo termina en -o: parlo.' },
        ),
        ex.matchPairs(
          [
            ['parlo', 'hablo'],
            ['leggo', 'leo'],
            ['scrivo', 'escribo'],
            ['dormo', 'duermo'],
          ],
          ['it-parlo', 'it-leggo', 'it-scrivo', 'it-dormo'],
        ),
        ex.orderWords('La sera leggo e poi dormo.', 'A la noche leo y después duermo.', [
          'it-la-sera',
          'it-leggo',
          'it-poi',
          'it-dormo',
        ]),
        ex.translateWrite('Escribo con la lapicera.', 'Scrivo con la penna.', [
          'it-scrivo',
          'it-penna',
        ]),
        ex.translateWrite(
          'A la noche leo un libro.',
          'La sera leggo un libro.',
          ['it-la-sera', 'it-leggo'],
          { acceptedAnswers: ['Leggo un libro la sera.'] },
        ),
      ],
    },
    {
      title: 'Tu parli? Lei parla',
      objective: 'Conjugar con tu y con lui / lei.',
      intro: {
        explanation:
          'Con tu el verbo termina en -i: parli, leggi, dormi. Con lui o lei termina en -a en los verbos de -are (parla) y en -e en los demás (legge, dorme). Como en español, el pronombre se puede omitir.',
        examples: [
          { target: 'Tu parli spagnolo?', base: '¿Vos hablás español?' },
          { target: 'Lei parla molto bene.', base: 'Ella habla muy bien.' },
        ],
      },
      takeaways: ['Preguntás con tu parli…?', 'Hablás de otra persona con parla.'],
      exercises: [
        ex.translationChoice('parli', 'hablás', ['hablo', 'habla', 'leo'], ['it-parli']),
        ex.translationChoice('parla', 'habla', ['hablás', 'hablo', 'duermo'], ['it-parla']),
        ex.listenChoice(
          'Tu parli italiano?',
          ['Io parlo italiano.', 'Lei parla italiano.', 'Tu sei italiano?'],
          ['it-parli', 'it-italiano'],
        ),
        ex.fillBlank(
          'Tu ___ spagnolo?',
          '¿Vos hablás español?',
          'parli',
          ['parlo', 'parla', 'sei'],
          ['it-parli', 'it-spagnolo'],
          { explanation: 'Con tu el verbo termina en -i: parli.' },
        ),
        ex.fillBlank(
          'Lei ___ molto bene.',
          'Ella habla muy bien.',
          'parla',
          ['parlo', 'parli', 'sono'],
          ['it-lei', 'it-parla', 'it-molto', 'it-bene'],
        ),
        ex.orderWords('Lui parla italiano e spagnolo.', 'Él habla italiano y español.', [
          'it-lui',
          'it-parla',
          'it-italiano',
          'it-spagnolo',
        ]),
        ex.shortAnswer(
          'Parli italiano?',
          '¿Hablás italiano? (Respondé que sí.)',
          'Sì, parlo italiano.',
          ['Sì, io parlo italiano.', "Sì, parlo un po' di italiano.", 'Sì.'],
          ['it-si', 'it-parlo', 'it-italiano'],
        ),
        ex.translateWrite(
          'Ella habla muy bien.',
          'Lei parla molto bene.',
          ['it-lei', 'it-parla', 'it-molto', 'it-bene'],
          { acceptedAnswers: ['Parla molto bene.'] },
        ),
      ],
    },
    {
      title: 'Lavoro e studio',
      objective: 'Decir qué hacés durante el día.',
      intro: {
        explanation:
          'Lavoro es «trabajo» y studio «estudio». A casa es «en casa» (y también «a casa»): lavoro a casa. Mangio es «como» y bevo «tomo, bebo».',
        examples: [
          { target: 'Lavoro a casa.', base: 'Trabajo en casa.' },
          {
            target: 'Studio italiano e mangio un panino.',
            base: 'Estudio italiano y como un sándwich.',
          },
        ],
      },
      takeaways: ['Decís si trabajás o estudiás.', 'Decís qué comés y qué tomás.'],
      exercises: [
        ex.imageChoice('💼', 'lavoro', ['studio', 'dormo', 'mangio'], ['it-lavoro']),
        ex.translationChoice('studio', 'estudio', ['trabajo', 'escribo', 'leo'], ['it-studio']),
        ex.translationChoice(
          'mangio',
          'como (de comer)',
          ['bebo', 'duermo', 'hablo'],
          ['it-mangio'],
        ),
        ex.listenChoice(
          'Lavoro a casa.',
          ['Studio a casa.', 'Dormo a casa.', 'Lavoro in cucina.'],
          ['it-lavoro', 'it-a-casa'],
        ),
        ex.fillBlank(
          'La mattina ___ un caffè.',
          'A la mañana tomo un café.',
          'bevo',
          ['mangio', 'leggo', 'dormo'],
          ['it-la-mattina', 'it-bevo', 'it-caffe'],
          { skill: 'vocabulary', explanation: 'El café se toma: bevo un caffè.' },
        ),
        ex.matchPairs(
          [
            ['lavoro', 'trabajo'],
            ['studio', 'estudio'],
            ['mangio', 'como (de comer)'],
            ['bevo', 'bebo'],
          ],
          ['it-lavoro', 'it-studio', 'it-mangio', 'it-bevo'],
        ),
        ex.shortAnswer(
          'Lavori o studi?',
          '¿Trabajás o estudiás? (Respondé que estudiás.)',
          'Studio.',
          ['Io studio.', 'Studio italiano.', 'Sono studente.', 'Sono studentessa.'],
          ['it-studio'],
        ),
        ex.translateWrite('Trabajo en casa.', 'Lavoro a casa.', ['it-lavoro', 'it-a-casa'], {
          acceptedAnswers: ['Io lavoro a casa.'],
        }),
      ],
    },
    {
      title: 'Ogni giorno',
      objective: 'Contar tu rutina en orden.',
      intro: {
        explanation:
          'Para contar tu día: ogni giorno («todos los días»), sempre («siempre») y poi («después»). Sempre va después del verbo: faccio sempre colazione.',
        examples: [
          { target: 'Studio italiano ogni giorno.', base: 'Estudio italiano todos los días.' },
          { target: 'Faccio colazione, poi lavoro.', base: 'Desayuno, después trabajo.' },
        ],
      },
      takeaways: ['Contás tu rutina con ogni giorno y poi.', 'Ubicás sempre después del verbo.'],
      exercises: [
        ex.translationChoice(
          'ogni giorno',
          'todos los días',
          ['a la mañana', 'siempre', 'después'],
          ['it-ogni-giorno'],
        ),
        ex.translationChoice('poi', 'después', ['siempre', 'también', 'muy'], ['it-poi']),
        ex.listenChoice(
          'Faccio sempre colazione.',
          ['Faccio colazione a casa.', 'Studio sempre.', 'Mi alzo sempre presto.'],
          ['it-faccio-colazione', 'it-sempre'],
        ),
        ex.fillBlank(
          'Faccio colazione, ___ lavoro.',
          'Desayuno, después trabajo.',
          'poi',
          ['sempre', 'anche', 'molto'],
          ['it-faccio-colazione', 'it-poi', 'it-lavoro'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('Studio italiano ogni giorno.', 'Estudio italiano todos los días.', [
          'it-studio',
          'it-italiano',
          'it-ogni-giorno',
        ]),
        ex.orderWords(
          'Mi sveglio, faccio colazione e poi studio.',
          'Me despierto, desayuno y después estudio.',
          ['it-mi-sveglio', 'it-faccio-colazione', 'it-poi', 'it-studio'],
        ),
        ex.translateWrite(
          'Siempre desayuno en casa.',
          'Faccio sempre colazione a casa.',
          ['it-sempre', 'it-faccio-colazione', 'it-a-casa'],
          {
            acceptedAnswers: [
              'Faccio colazione sempre a casa.',
              'Faccio sempre colazione in casa.',
            ],
          },
        ),
        ex.translateWrite(
          'Estudio todos los días.',
          'Studio ogni giorno.',
          ['it-studio', 'it-ogni-giorno'],
          { acceptedAnswers: ['Io studio ogni giorno.', 'Ogni giorno studio.'] },
        ),
      ],
    },
  ],
};
