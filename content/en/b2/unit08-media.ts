import type { B2UnitDef } from '../../b2';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from '../b1/helpers';

/**
 * B2 U8 «Medios de comunicación y desinformación» (docs/B2_EN.md): rumores y publicaciones virales,
 * fuentes confiables y sesgadas, verificar datos. Estructura principal: estilo indirecto avanzado con
 * verbos de reporte y sus patrones (claim that / to, suggest + -ing, warn someone not to, insist on,
 * accuse someone of + -ing, deny / admit + -ing, refuse to).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const VIRAL = dialogue(
  'en.stim.b2-u8-viral',
  'Dos amigas hablan de una publicación que se volvió viral.',
  [
    [
      'Zoe',
      'Have you seen this? A post says that drinking hot water every hour stops you from getting a cold.',
    ],
    [
      'Amy',
      "I've seen it. It went viral yesterday. My aunt has already shared it with the whole family.",
    ],
    ['Zoe', 'Is it true, though? The post claims that doctors recommend it.'],
    [
      'Amy',
      'Which doctors? It doesn’t say. That’s how misinformation spreads: no names, no sources, just a big promise.',
    ],
    ['Zoe', 'So it’s just a rumor?'],
    [
      'Amy',
      'Probably. A fact-checking website looked at it this morning. They found no evidence at all.',
    ],
    ['Zoe', "I'll send the link to your aunt, then. Before she shares the next one!"],
  ],
);

const GUIDE = reading(
  'en.stim.b2-u8-guide',
  'post',
  'Una guía para reconocer información falsa.',
  [
    'Five questions to ask before you share a story',
    '1. Who wrote it? Reliable sources tell you who the journalist is and where the information comes from.',
    '2. Does the headline match the story? Clickbait headlines promise something shocking to make you click, but the article often says something different.',
    '3. Is it one-sided? A biased article only shows one side and ignores facts that do not support its argument.',
    '4. Are the numbers misleading? A "300% rise" sounds huge, but it may mean the number went from one to four.',
    '5. Have other media reported it? If nobody else has the story, be careful. Check it on a fact-checking site.',
  ],
  { title: 'Think before you share' },
);

const INTERVIEW = dialogue(
  'en.stim.b2-u8-interview',
  'Una entrevista en la televisión a un político.',
  [
    [
      'Journalist',
      'Mr. Hart, a newspaper has accused your party of using public money for its campaign. Is that true?',
    ],
    ['Hart', 'I completely deny that. Every dollar we spent was ours.'],
    ['Journalist', 'But you admitted last week that the campaign had used government offices.'],
    ['Hart', "I admitted using one office for one meeting. That's very different."],
    ['Journalist', 'Will you publish the campaign accounts?'],
    [
      'Hart',
      "I refuse to answer questions based on rumors. I insist that we haven't done anything wrong.",
    ],
    ['Journalist', 'Many viewers will find that answer hard to believe.'],
  ],
);

const MAYOR = reading(
  'en.stim.b2-u8-mayor',
  'post',
  'Una noticia de un diario local.',
  [
    'Mayor denies plan to close Central Park',
    'The mayor has denied claims that Central Park will be closed to build offices. A post on social media had suggested that the decision was already made, and it was shared more than fifty thousand times.',
    '"This is completely false," the mayor said yesterday. She admitted that the city had discussed new offices in the area, but she insisted that the park was never part of the plan.',
    'She also warned people not to believe everything they read online, and suggested checking the city website for official information.',
    'The person who created the post has refused to comment.',
  ],
  { title: 'City news', from: 'The Daily Courier' },
);

export const EN_B2_U08: B2UnitDef = {
  names: ['Zoe', 'Amy', 'Hart', 'Central', 'Courier', 'Journalist'],
  support: [
    'aunt',
    'whole',
    'match',
    'shocking',
    'sided',
    'ignores',
    'facts',
    'reported',
    'campaign',
    'spent',
    'ours',
    'publish',
    'accounts',
    'based',
    'viewers',
    'mayor',
    'false',
    'area',
    'official',
    'comment',
    'checking',
    'truth',
    'cable',
    'site',
    'program',
  ],
  unit: {
    position: 8,
    title: 'Medios y desinformación',
    titleEn: 'Media and misinformation',
    description:
      'Rumores y publicaciones virales, fuentes confiables y sesgadas, y estilo indirecto con claim, deny, admit, warn, accuse y refuse.',
    emoji: '📰',
    objective:
      'Podés reconocer información engañosa, contar con precisión lo que dijo alguien y opinar sobre las fuentes.',
    grammar: {
      title: 'Verbos de reporte',
      explanation:
        'Para contar lo que alguien dijo con más precisión que say o tell, cada verbo tiene su forma: claim that / claim to (afirmar), suggest + -ing o suggest that (sugerir), warn someone (not) to (advertir), insist that / insist on + -ing (insistir), accuse someone of + -ing (acusar), deny / admit + -ing (negar / admitir) y refuse to (negarse a). Los tiempos retroceden como en el B1: is → was, has → had.',
      examples: [
        {
          target: 'She warned people not to believe everything they read online.',
          base: 'Advirtió a la gente que no creyera todo lo que lee en internet.',
        },
        { target: 'He denied using public money.', base: 'Negó haber usado dinero público.' },
        { target: 'They accused him of lying.', base: 'Lo acusaron de mentir.' },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B2: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-rumor',
        'rumor',
        'rumor',
        '/ˈrumər/',
        '🗣️',
        "It's just a rumor. Don't believe it.",
        'Es sólo un rumor. No lo creas.',
        ['media'],
        undefined,
        ['rumour'],
      ),
      w(
        'en-go-viral',
        'go viral',
        'volverse viral',
        '/ˈɡoʊ ˈvaɪrəl/',
        '📲',
        'The video went viral in one day.',
        'El video se volvió viral en un día.',
        ['media', 'collocations'],
        ['hacerse viral'],
      ),
      w(
        'en-spread',
        'spread',
        'difundirse / propagarse',
        '/sprɛd/',
        undefined,
        'Fake news spreads faster than the truth.',
        'Las noticias falsas se difunden más rápido que la verdad.',
        ['media', 'verbs'],
        ['difundirse', 'propagarse', 'difundir'],
      ),
      w(
        'en-misinformation',
        'misinformation',
        'desinformación / información falsa',
        '/ˌmɪsɪnfərˈmeɪʃən/',
        undefined,
        'There is a lot of misinformation online.',
        'Hay mucha desinformación en internet.',
        ['media'],
        ['desinformación', 'información falsa'],
      ),
      w(
        'en-clickbait',
        'clickbait',
        'título engañoso (para que hagas clic)',
        '/ˈklɪkˌbeɪt/',
        '🎣',
        'That headline is clickbait. The article says nothing new.',
        'Ese título es para que hagas clic. La nota no dice nada nuevo.',
        ['media'],
        ['ciberanzuelo'],
      ),
      w(
        'en-claim',
        'claim',
        'afirmar / asegurar',
        '/kleɪm/',
        undefined,
        'The post claims that doctors recommend it.',
        'La publicación asegura que los médicos lo recomiendan.',
        ['reporting-verbs', 'verbs'],
        ['afirmar', 'asegurar', 'sostener'],
      ),
      w(
        'en-suggest',
        'suggest',
        'sugerir / proponer',
        '/səɡˈdʒɛst/',
        '💬',
        'She suggested checking the official website.',
        'Sugirió consultar la página oficial.',
        ['reporting-verbs', 'verbs'],
        ['sugerir', 'proponer'],
      ),
      w(
        'en-warn',
        'warn',
        'advertir / avisar (de un peligro)',
        '/wɔrn/',
        '⚠️',
        'He warned me not to touch the cables.',
        'Me advirtió que no tocara los cables.',
        ['reporting-verbs', 'verbs'],
        ['advertir', 'prevenir'],
      ),
      w(
        'en-insist',
        'insist',
        'insistir',
        '/ɪnˈsɪst/',
        undefined,
        'She insisted on paying for dinner.',
        'Insistió en pagar la cena.',
        ['reporting-verbs', 'verbs'],
      ),
      w(
        'en-accuse',
        'accuse',
        'acusar',
        '/əˈkjuz/',
        '👉',
        'They accused him of lying.',
        'Lo acusaron de mentir.',
        ['reporting-verbs', 'verbs'],
      ),
      w(
        'en-deny',
        'deny',
        'negar',
        '/dɪˈnaɪ/',
        '🙅',
        'He denied taking the money.',
        'Negó haberse llevado el dinero.',
        ['reporting-verbs', 'verbs'],
      ),
      w(
        'en-admit',
        'admit',
        'admitir / reconocer',
        '/ədˈmɪt/',
        undefined,
        'She admitted making a mistake.',
        'Reconoció haberse equivocado.',
        ['reporting-verbs', 'verbs'],
        ['admitir', 'reconocer'],
      ),
      w(
        'en-refuse',
        'refuse',
        'negarse a',
        '/rɪˈfjuz/',
        undefined,
        'He refused to answer the question.',
        'Se negó a responder la pregunta.',
        ['reporting-verbs', 'verbs'],
        ['negarse'],
      ),
      w(
        'en-reliable',
        'reliable',
        'confiable / fiable',
        '/rɪˈlaɪəbəl/',
        '✅',
        'Is this a reliable source?',
        '¿Es una fuente confiable?',
        ['media', 'adjectives'],
        ['confiable', 'fiable'],
      ),
      w(
        'en-biased',
        'biased',
        'parcial / sesgado',
        '/ˈbaɪəst/',
        undefined,
        'The article is biased. It only shows one side.',
        'La nota es parcial. Sólo muestra un lado.',
        ['media', 'adjectives'],
        ['parcial', 'sesgado', 'tendencioso'],
      ),
      w(
        'en-misleading',
        'misleading',
        'engañoso',
        '/mɪsˈlidɪŋ/',
        undefined,
        'The numbers in the post are misleading.',
        'Los números de la publicación son engañosos.',
        ['media', 'adjectives'],
      ),
      w(
        'en-fact-check',
        'fact-check',
        'verificar (datos)',
        '/ˈfækt ˌtʃɛk/',
        '🔍',
        'Always fact-check a story before you share it.',
        'Verificá siempre una noticia antes de compartirla.',
        ['media', 'verbs'],
        ['verificar', 'chequear'],
        ['fact check'],
      ),
      w(
        'en-audience',
        'audience',
        'público / audiencia',
        '/ˈɔdiəns/',
        '👥',
        'The program has a large audience.',
        'El programa tiene mucho público.',
        ['media'],
        ['público', 'audiencia'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Se volvió viral',
        objective:
          'Hablar de rumores y publicaciones virales y de cómo se difunde la desinformación.',
        intro: {
          explanation:
            'Algo que go viral (went viral) se comparte muchísimo en poco tiempo. A rumor es un rumor; misinformation, la desinformación. Spread (spread, spread) es difundirse. Clickbait es un título engañoso pensado para que hagas clic.',
          examples: [
            {
              target: 'The video went viral in one day.',
              base: 'El video se volvió viral en un día.',
            },
            {
              target: 'Fake news spreads faster than the truth.',
              base: 'Las noticias falsas se difunden más rápido que la verdad.',
            },
          ],
        },
        takeaways: [
          'Contás que algo se volvió viral y se difundió.',
          'Reconocés rumores, desinformación y clickbait.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['rumor', 'rumor'],
              ['go viral', 'volverse viral'],
              ['spread', 'difundirse / propagarse'],
              ['misinformation', 'desinformación / información falsa'],
            ],
            ['en-rumor', 'en-go-viral', 'en-spread', 'en-misinformation'],
            { id: 'en.ex.3eqsm54npo4pcu' },
          ),
          ex.fillBlank(
            'The video ___ viral in one day.',
            'El video se volvió viral en un día.',
            'went',
            ['made', 'did', 'got'],
            ['en-go-viral'],
            {
              id: 'en.ex.yccqaw104csuiz',
              skill: 'vocabulary',
              explanation: 'Go viral (went viral): volverse viral.',
            },
          ),
          ex.fillBlank(
            'Fake news ___ faster than the truth.',
            'Las noticias falsas se difunden más rápido que la verdad.',
            'spreads',
            ['spread', 'spreading', 'is spread'],
            ['en-spread'],
            { id: 'en.ex.bfmjvexbs79xm3', explanation: 'News es singular: news spreads.' },
          ),
          question(
            'en.ex.ju92ln50glddh4',
            VIRAL,
            '¿Qué dice la publicación viral?',
            'Que tomar agua caliente cada hora evita los resfríos',
            [
              'Que el agua fría cura el resfrío',
              'Que los médicos están en contra del agua',
              'Que hay que tomar remedios cada hora',
            ],
            ['en-go-viral', 'en-claim'],
            'Zoe dice: «A post says that drinking hot water every hour stops you from getting a cold».',
          ),
          question(
            'en.ex.qne2apt0pid22s',
            VIRAL,
            'Según Amy, ¿cómo se difunde la desinformación?',
            'Sin nombres ni fuentes, sólo con una gran promesa',
            ['Por los diarios', 'A través de los médicos', 'Con muchos datos'],
            ['en-misinformation', 'en-spread', 'en-rumor'],
            'Amy dice: «That’s how misinformation spreads: no names, no sources, just a big promise».',
          ),
          question(
            'en.ex.upqq2jl6rouuil',
            VIRAL,
            '¿Qué encontró el sitio de verificación?',
            'Ninguna prueba de que sea cierto',
            ['Que es cierto', 'Que lo dijo un médico famoso', 'Que la publicación se borró'],
            ['en-fact-check'],
            'Amy dice: «A fact-checking website looked at it this morning. They found no evidence at all».',
          ),
          ex.listenChoice(
            "It's just a rumor. Don't believe it.",
            [
              "It's just a rumor. Believe it.",
              "It's not a rumor. Don't believe it.",
              "It's just a story. Don't believe it.",
            ],
            ['en-rumor'],
            { id: 'en.ex.w1ii5eqyzgullh' },
          ),
          ex.orderWords(
            'There is a lot of misinformation online.',
            'Hay mucha desinformación en internet.',
            ['en-misinformation'],
            { id: 'en.ex.jenrbfjwcvdnas' },
          ),
          ex.shortAnswer(
            'Why is everyone talking about that video? (porque se volvió viral)',
            '¿Por qué todos hablan de ese video?',
            'Because it went viral.',
            ['It went viral.', 'Because it has gone viral.', "Because it's gone viral."],
            ['en-go-viral'],
            { id: 'en.ex.v88pamprhiwi5a' },
          ),
          ex.translateWrite(
            'Las noticias falsas se difunden más rápido que la verdad.',
            'Fake news spreads faster than the truth.',
            ['en-spread'],
            {
              id: 'en.ex.whucmiqbeqvv2y',
              acceptedAnswers: [
                'Fake news spreads more quickly than the truth.',
                'Fake news spread faster than the truth.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Lo que dijo, con precisión',
        objective: 'Contar lo que alguien afirmó, sugirió o advirtió.',
        intro: {
          explanation:
            'Claim that es afirmar algo que puede no ser cierto. Suggest va con -ing o con that: She suggested checking the website. Warn someone (not) to es advertir: He warned me not to touch it. Insist on + -ing o insist that: She insisted on paying.',
          examples: [
            {
              target: 'She suggested checking the official website.',
              base: 'Sugirió consultar la página oficial.',
            },
            {
              target: 'He warned me not to touch the cables.',
              base: 'Me advirtió que no tocara los cables.',
            },
          ],
        },
        takeaways: [
          'Contás lo que alguien afirmó o sugirió con claim y suggest.',
          'Contás advertencias e insistencias con warn e insist.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['claim', 'afirmar / asegurar'],
              ['suggest', 'sugerir / proponer'],
              ['warn', 'advertir / avisar (de un peligro)'],
              ['insist', 'insistir'],
            ],
            ['en-claim', 'en-suggest', 'en-warn', 'en-insist'],
            { id: 'en.ex.6glnrqie5uitwr' },
          ),
          ex.fillBlank(
            'She suggested ___ the official website.',
            'Sugirió consultar la página oficial.',
            'checking',
            ['to check', 'check', 'checked'],
            ['en-suggest'],
            {
              id: 'en.ex.e7petkuoy0bs5t',
              explanation: 'Suggest + -ing (o suggest that…), nunca «suggest to».',
            },
          ),
          ex.fillBlank(
            'He warned me ___ touch the cables.',
            'Me advirtió que no tocara los cables.',
            'not to',
            ["don't", 'to not', 'no'],
            ['en-warn'],
            { id: 'en.ex.e5qjfec5tcoy9m', explanation: 'Warn someone not to + verbo.' },
          ),
          ex.fillBlank(
            'She insisted ___ paying for dinner.',
            'Insistió en pagar la cena.',
            'on',
            ['in', 'to', 'for'],
            ['en-insist'],
            { id: 'en.ex.cmemc25bfcddu1', skill: 'vocabulary' },
          ),
          question(
            'en.ex.gycpni1483zkjo',
            MAYOR,
            '¿Qué había sugerido la publicación en las redes?',
            'Que ya estaba decidido cerrar el parque para construir oficinas',
            [
              'Que el parque iba a ser más grande',
              'Que la alcaldesa iba a renunciar',
              'Que las oficinas se iban a cerrar',
            ],
            ['en-suggest', 'en-claim', 'en-deny', 'en-admit', 'en-refuse'],
            'La noticia dice: «A post on social media had suggested that the decision was already made».',
          ),
          question(
            'en.ex.9z351u36rftpln',
            MAYOR,
            '¿Qué advirtió y qué sugirió la alcaldesa?',
            'Que no crean todo lo que leen en internet y que consulten la página de la ciudad',
            [
              'Que no vayan al parque',
              'Que borren la publicación',
              'Que llamen a la municipalidad',
            ],
            ['en-warn', 'en-suggest'],
            'La noticia dice: «She also warned people not to believe everything they read online, and suggested checking the city website».',
          ),
          ex.listenChoice(
            'He warned me not to touch the cables.',
            [
              'He told me to touch the cables.',
              'He warned me not to cut the cables.',
              'She warned me not to touch the cables.',
            ],
            ['en-warn'],
            { id: 'en.ex.gah0s1o87qjdxi' },
          ),
          ex.orderWords(
            'The post claims that doctors recommend it.',
            'La publicación asegura que los médicos lo recomiendan.',
            ['en-claim'],
            { id: 'en.ex.lnkzfqyrkf2y9u' },
          ),
          ex.shortAnswer(
            'What did the doctor say? (te advirtió que no comieras azúcar)',
            '¿Qué dijo el médico?',
            'He warned me not to eat sugar.',
            [
              'She warned me not to eat sugar.',
              'He warned me not to eat any sugar.',
              'The doctor warned me not to eat sugar.',
            ],
            ['en-warn'],
            { id: 'en.ex.z7ls90wxm1ytu9' },
          ),
          ex.translateWrite(
            'Insistió en pagar la cena.',
            'She insisted on paying for dinner.',
            ['en-insist'],
            {
              id: 'en.ex.j0oolvof4v8khh',
              acceptedAnswers: [
                'He insisted on paying for dinner.',
                'She insisted on paying for the dinner.',
                'He insisted on paying for the dinner.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Acusar, negar, admitir',
        objective: 'Contar acusaciones, negaciones y confesiones con su forma correcta.',
        intro: {
          explanation:
            'Accuse someone of + -ing: They accused him of lying. Deny + -ing es negar haber hecho algo: He denied taking the money. Admit + -ing es reconocerlo: She admitted making a mistake. Refuse to + verbo es negarse a hacer algo: He refused to answer.',
          examples: [
            { target: 'They accused him of lying.', base: 'Lo acusaron de mentir.' },
            { target: 'She admitted making a mistake.', base: 'Reconoció haberse equivocado.' },
          ],
        },
        takeaways: [
          'Contás acusaciones con accuse someone of + -ing.',
          'Usás deny y admit con -ing y refuse con to.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['accuse', 'acusar'],
              ['deny', 'negar'],
              ['admit', 'admitir / reconocer'],
              ['refuse', 'negarse a'],
            ],
            ['en-accuse', 'en-deny', 'en-admit', 'en-refuse'],
            { id: 'en.ex.8bm2sana9kxst9' },
          ),
          ex.fillBlank(
            'They accused him ___ lying.',
            'Lo acusaron de mentir.',
            'of',
            ['for', 'to', 'about'],
            ['en-accuse'],
            { id: 'en.ex.b9xysc2x116xgn', explanation: 'Accuse someone of + -ing.' },
          ),
          ex.fillBlank(
            'He denied ___ the money.',
            'Negó haberse llevado el dinero.',
            'taking',
            ['to take', 'take', 'took'],
            ['en-deny'],
            { id: 'en.ex.t5d49yrnzps238', explanation: 'Deny + -ing.' },
          ),
          ex.fillBlank(
            'He refused ___ the question.',
            'Se negó a responder la pregunta.',
            'to answer',
            ['answering', 'answer', 'of answering'],
            ['en-refuse'],
            { id: 'en.ex.qew5tlci5csvbl', explanation: 'Refuse to + verbo.' },
          ),
          question(
            'en.ex.k4offhf2ycz3w1',
            INTERVIEW,
            '¿De qué acusó un diario al partido de Hart?',
            'De usar dinero público para su campaña',
            [
              'De mentir en una entrevista',
              'De cerrar oficinas del gobierno',
              'De no pagar impuestos',
            ],
            ['en-accuse'],
            'La periodista dice: «a newspaper has accused your party of using public money for its campaign».',
          ),
          question(
            'en.ex.t104cugffmc4qq',
            INTERVIEW,
            '¿Qué admitió Hart la semana anterior, según él?',
            'Haber usado una oficina para una reunión',
            ['Haber usado dinero público', 'Haber mentido', 'Nada'],
            ['en-admit', 'en-deny'],
            'Hart dice: «I admitted using one office for one meeting. That’s very different».',
          ),
          question(
            'en.ex.fyh97fx6sybh7x',
            INTERVIEW,
            '¿Qué hace Hart cuando le preguntan por las cuentas de la campaña?',
            'Se niega a responder y dice que son rumores',
            ['Promete publicarlas', 'Admite que hubo errores', 'Culpa a la periodista'],
            ['en-refuse', 'en-insist'],
            'Hart dice: «I refuse to answer questions based on rumors. I insist that we haven’t done anything wrong».',
          ),
          ex.listenChoice(
            'She admitted making a mistake.',
            [
              'She denied making a mistake.',
              'She admitted making a promise.',
              'He admitted making a mistake.',
            ],
            ['en-admit'],
            { id: 'en.ex.t5jaa6lzz7kxrq' },
          ),
          ex.shortAnswer(
            'Did he say he took the money? (no, negó haberlo tomado)',
            '¿Dijo que se llevó el dinero?',
            'No, he denied taking it.',
            ['No, he denied taking the money.', 'He denied taking it.', 'No. He denied taking it.'],
            ['en-deny'],
            { id: 'en.ex.96kuhg9gkks15r' },
          ),
          ex.translateWrite('Lo acusaron de mentir.', 'They accused him of lying.', ['en-accuse'], {
            id: 'en.ex.lbioomgsrlnl8y',
            acceptedAnswers: ['He was accused of lying.', 'They accused him of telling lies.'],
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Fuentes confiables',
        objective: 'Distinguir fuentes confiables, parciales y engañosas.',
        intro: {
          explanation:
            'A reliable source es una fuente confiable. Un artículo biased es parcial: muestra un solo lado. Misleading es engañoso (no siempre falso, pero lleva a una idea equivocada). Fact-check es verificar los datos.',
          examples: [
            { target: 'Is this a reliable source?', base: '¿Es una fuente confiable?' },
            {
              target: 'Always fact-check a story before you share it.',
              base: 'Verificá siempre una noticia antes de compartirla.',
            },
          ],
        },
        takeaways: [
          'Evaluás si una fuente es confiable o parcial.',
          'Detectás números y títulos engañosos y verificás antes de compartir.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['reliable', 'confiable / fiable'],
              ['biased', 'parcial / sesgado'],
              ['misleading', 'engañoso'],
              ['fact-check', 'verificar (datos)'],
            ],
            ['en-reliable', 'en-biased', 'en-misleading', 'en-fact-check'],
            { id: 'en.ex.vhxjsgukwpbvpc' },
          ),
          ex.fillBlank(
            'The article is ___. It only shows one side.',
            'La nota es parcial. Sólo muestra un lado.',
            'biased',
            ['reliable', 'viral', 'official'],
            ['en-biased'],
            { id: 'en.ex.ai0ichij6r3n0d', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'That headline is ___. The article says nothing new.',
            'Ese título es para que hagas clic. La nota no dice nada nuevo.',
            'clickbait',
            ['reliable', 'misinformation', 'rumor'],
            ['en-clickbait'],
            { id: 'en.ex.zabn1gd4jkbs4t', skill: 'vocabulary' },
          ),
          question(
            'en.ex.nmb2kjtodata0y',
            GUIDE,
            'Según la guía, ¿qué hacen los títulos clickbait?',
            'Prometen algo impactante para que hagas clic, pero la nota dice otra cosa',
            ['Resumen bien la nota', 'Dan el nombre del periodista', 'Muestran los dos lados'],
            ['en-clickbait', 'en-misleading'],
            'La guía dice: «Clickbait headlines promise something shocking to make you click, but the article often says something different».',
          ),
          question(
            'en.ex.m9cc9274iv9trw',
            GUIDE,
            '¿Por qué un «aumento del 300%» puede ser engañoso?',
            'Porque puede significar que el número pasó de uno a cuatro',
            [
              'Porque siempre es falso',
              'Porque es un número muy chico',
              'Porque nadie lo verifica',
            ],
            ['en-misleading'],
            'La guía dice: «A "300% rise" sounds huge, but it may mean the number went from one to four».',
          ),
          question(
            'en.ex.ozeqe8psyjk2tl',
            GUIDE,
            '¿Qué recomienda la guía si ningún otro medio publicó la noticia?',
            'Tener cuidado y verificarla en un sitio de verificación',
            ['Compartirla rápido', 'Creerla igual', 'Escribirle al periodista'],
            ['en-fact-check', 'en-reliable'],
            'La guía dice: «If nobody else has the story, be careful. Check it on a fact-checking site».',
          ),
          ex.listenChoice(
            'Always fact-check a story before you share it.',
            [
              'Never fact-check a story before you share it.',
              'Always fact-check a story after you share it.',
              'Always read a story before you share it.',
            ],
            ['en-fact-check'],
            { id: 'en.ex.f8oqtt1x0lwtvy' },
          ),
          ex.orderWords(
            'The numbers in the post are misleading.',
            'Los números de la publicación son engañosos.',
            ['en-misleading'],
            { id: 'en.ex.r1j9y7yco1q69d' },
          ),
          ex.shortAnswer(
            'Why don’t you trust that website? (porque no es una fuente confiable)',
            '¿Por qué no confiás en esa página?',
            "Because it isn't a reliable source.",
            [
              'Because it is not a reliable source.',
              "It isn't a reliable source.",
              "Because it's not a reliable source.",
            ],
            ['en-reliable'],
            { id: 'en.ex.kl1c69anjm9ocf' },
          ),
          ex.translateWrite(
            '¿Es una fuente confiable?',
            'Is this a reliable source?',
            ['en-reliable'],
            {
              id: 'en.ex.61gupaflib8w2p',
              acceptedAnswers: ['Is it a reliable source?', 'Is that a reliable source?'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Los medios y su público',
        objective: 'Opinar sobre los medios y contar una noticia con verbos de reporte.',
        intro: {
          explanation:
            'The audience es el público de un programa, un medio o un espectáculo. Para contar una noticia con precisión, combinás los verbos de la unidad: The mayor denied the rumor, admitted that…, insisted that…, warned people not to…',
          examples: [
            {
              target: 'The program has a large audience.',
              base: 'El programa tiene mucho público.',
            },
            {
              target: 'The mayor denied the rumor about the park.',
              base: 'La alcaldesa negó el rumor sobre el parque.',
            },
          ],
        },
        takeaways: [
          'Hablás del público de los medios.',
          'Contás una noticia combinando claim, deny, admit, insist y warn.',
        ],
        exercises: [
          ex.translationChoice(
            'audience',
            'público / audiencia',
            ['rumor', 'desinformación / información falsa', 'engañoso'],
            ['en-audience'],
            { id: 'en.ex.h4kq5xdm7yb52o' },
          ),
          ex.fillBlank(
            'The program has a large ___.',
            'El programa tiene mucho público.',
            'audience',
            ['public', 'rumor', 'people'],
            ['en-audience'],
            {
              id: 'en.ex.tmmnrv2tkn9n5m',
              skill: 'vocabulary',
              explanation: 'Audience: el público de un programa o un espectáculo.',
            },
          ),
          ex.fillBlank(
            'The mayor ___ the rumor about the park.',
            'La alcaldesa negó el rumor sobre el parque.',
            'denied',
            ['refused', 'accused', 'insisted'],
            ['en-deny', 'en-rumor'],
            {
              id: 'en.ex.9xnuqkt9up8t89',
              explanation: 'Deny + sustantivo o -ing. Refuse va con to + verbo.',
            },
          ),
          question(
            'en.ex.ob0hlxokaa4bjn',
            MAYOR,
            '¿Qué admitió la alcaldesa?',
            'Que la ciudad había hablado de oficinas nuevas en la zona',
            [
              'Que iban a cerrar el parque',
              'Que la publicación era cierta',
              'Que no conocía el plan',
            ],
            ['en-admit', 'en-insist'],
            'La noticia dice: «She admitted that the city had discussed new offices in the area, but she insisted that the park was never part of the plan».',
          ),
          question(
            'en.ex.zpcyv7fb630tod',
            MAYOR,
            '¿Qué hizo la persona que creó la publicación?',
            'Se negó a hacer comentarios',
            ['Pidió perdón', 'Borró la publicación', 'Habló con la alcaldesa'],
            ['en-refuse'],
            'La noticia termina: «The person who created the post has refused to comment».',
          ),
          question(
            'en.ex.m3839hslglqsjb',
            INTERVIEW,
            '¿Qué sugiere la periodista con su último comentario?',
            'Que mucha gente no le va a creer a Hart',
            [
              'Que Hart tiene razón',
              'Que la entrevista terminó bien',
              'Que el público no la estaba mirando',
            ],
            ['en-audience'],
            'La periodista dice: «Many viewers will find that answer hard to believe».',
          ),
          ex.listenChoice(
            'The program has a large audience.',
            [
              'The program has a small audience.',
              'The program had a large audience.',
              'The concert has a large audience.',
            ],
            ['en-audience'],
            { id: 'en.ex.qd1q96clp8fxi5' },
          ),
          ex.orderWords(
            'She suggested checking the official website.',
            'Sugirió consultar la página oficial.',
            ['en-suggest'],
            { id: 'en.ex.cin533d51z6zkq' },
          ),
          ex.shortAnswer(
            'What did the post claim? (que el parque se iba a cerrar)',
            '¿Qué afirmaba la publicación?',
            'It claimed that the park was going to close.',
            [
              'It claimed that the park would close.',
              'It claimed that the park would be closed.',
              'It claimed the park was going to close.',
            ],
            ['en-claim'],
            { id: 'en.ex.tp4jpafvwspbxj' },
          ),
          ex.translateWrite(
            'Reconoció haberse equivocado.',
            'She admitted making a mistake.',
            ['en-admit'],
            {
              id: 'en.ex.f1rbip16ek0u67',
              acceptedAnswers: [
                'He admitted making a mistake.',
                'She admitted that she had made a mistake.',
                'He admitted that he had made a mistake.',
                'She admitted having made a mistake.',
              ],
            },
          ),
        ],
      },
    ],
  },
};
