import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';
import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_B1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español B1 U10 «News and media» (docs/ES_B1.md §3): contar una noticia y transmitir lo que dijo,
 * preguntó o pidió otra persona. Gramática: el estilo indirecto con dijo que / explicó que / contó que
 * y el cambio de tiempo (es → era, va a → iba a, vendrá → vendría), con la nota de que en el habla de
 * Latinoamérica se conserva el presente si lo dicho sigue siendo verdad (me dijo que está enfermo, A2);
 * las preguntas indirectas (me preguntó si…, me preguntó dónde…, con tilde en el interrogativo);
 * me pidió que + presente de subjuntivo (me pidió que la llame mañana), frecuente en Latinoamérica
 * cuando el pedido sigue vigente; el imperfecto de subjuntivo (me pidió que llamara) sólo para
 * reconocerlo, en la explicación; según + sustantivo o pronombre (según el periódico, según ella).
 * Variante: español neutro de Latinoamérica, con tú y ustedes; usted con una testigo mayor. «La radio»
 * (el medio; en México también «el radio») y «la tele». Noticias ficticias y neutras: una tormenta
 * sin víctimas en Veracruz, un incendio sin heridos en una fábrica de Monterrey.
 * Pronunciación: periódico y artículo son esdrújulas (pe-RIÓ-di-co, ar-TÍ-cu-lo); según lleva el
 * acento al final (se-GÚN); la pregunta indirecta no sube al final (me preguntó si tenía tiempo es una
 * afirmación).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

/** L1 · Titulares de una aplicación de noticias. */
const TITULARES = reading(
  'es.stim.b1-u10-titulares',
  'notice',
  'The morning headlines in a news app.',
  [
    'Monterrey: gran incendio en una fábrica del centro',
    'Tormenta en Veracruz: hoy no hay clases en las escuelas',
    'El gobierno de Bogotá quiere más bicicletas en la ciudad',
    'Fútbol: Monterrey llega a la final',
    'Mérida: mañana va a hacer mucho calor',
  ],
  { title: 'Las noticias de hoy' },
);

/** L2 · Noticia de radio: presentadora y reportero en Veracruz. */
const RADIO = dialogue(
  'es.stim.b1-u10-radio',
  'A radio news program: the presenter talks to a reporter in Veracruz.',
  [
    [
      'Laura',
      'Buenas tardes. Estas son las noticias del día. Una tormenta muy fuerte llegó anoche a Veracruz. Desde allá nos informa Tomás.',
    ],
    [
      'Tomás',
      'Gracias, Laura. Sí, llueve desde anoche y hay agua en muchas calles del centro. Por suerte, todas las personas están bien.',
    ],
    ['Laura', '¿Y qué dice el gobierno del estado?'],
    [
      'Tomás',
      'El gobierno anunció que hoy no hay clases en las escuelas. Según el pronóstico, va a llover hasta el jueves.',
    ],
    ['Laura', '¿Y el aeropuerto?'],
    ['Tomás', 'Hoy no hay vuelos. El primer vuelo sale mañana a las diez, si no llueve mucho.'],
    ['Laura', 'Muchas gracias, Tomás. Vamos a informar más en las noticias de la noche.'],
  ],
  ES_B1_RATE,
);

/** L3 · Artículo del día siguiente: lo que contaron los testigos y anunció el gobierno. */
const ARTICULO = reading(
  'es.stim.b1-u10-articulo',
  'description',
  'A newspaper article the day after the storm.',
  [
    'La tormenta de Veracruz terminó ayer por la tarde.',
    'Según el gobierno, más de 300 casas tienen problemas con el agua.',
    'Una testigo, Rosa, contó que el agua llegó a su cocina en diez minutos.',
    'Su vecino explicó que era la tormenta más fuerte del año.',
    'El gobierno anunció que las escuelas iban a abrir el lunes.',
    'Hoy ya hay sol en la ciudad.',
  ],
  { title: 'El día después de la tormenta' },
);

/** L4–L5 · Una testigo del incendio habla con un periodista en Monterrey. */
const TESTIGO = dialogue(
  'es.stim.b1-u10-testigo',
  'A journalist talks to a woman who saw a fire in a factory in Monterrey.',
  [
    ['Sergio', 'Buenos días, señora. Soy periodista. ¿Usted vio el incendio de la fábrica?'],
    ['Gloria', 'Sí, vivo enfrente. A las seis de la mañana vi mucho humo y llamé a los bomberos.'],
    ['Sergio', '¿Y qué le preguntaron los bomberos?'],
    ['Gloria', 'Me preguntaron si había personas en la fábrica. Yo no sabía.'],
    ['Sergio', '¿Y había alguien?'],
    ['Gloria', 'No, por suerte. Un señor de la fábrica me contó que todos llegan a las ocho.'],
    ['Sergio', '¿Y ahora qué tiene que hacer la gente del barrio?'],
    ['Gloria', 'Un bombero me pidió que cierre las ventanas y que no salga de casa hoy.'],
    ['Sergio', 'Muchas gracias por su tiempo, señora.'],
  ],
  ES_B1_RATE,
);

/** L4–L5 · Mensaje que resume una reunión de trabajo. */
const REUNION = reading(
  'es.stim.b1-u10-reunion',
  'message',
  'Inés writes to her colleague Pablo, who missed a meeting.',
  [
    'Hola, Pablo. Te cuento lo que pasó en la reunión de hoy.',
    'La jefa explicó que el proyecto era muy importante para el cliente.',
    'Contó que el cliente vendría a la oficina el lunes.',
    'También dijo que íbamos a trabajar en equipo toda la semana.',
    'Me preguntó si tú podías presentar el proyecto el lunes. Le dije que no sabía.',
    'Y me pidió que te mande el archivo de la reunión: te lo mando esta noche.',
    'Según ella, la fecha límite es el viernes. ¡Hablamos mañana!',
  ],
  { from: 'Inés', to: 'Pablo' },
);

export const ES_B1_U10: EsUnitDef = {
  names: [
    'Monterrey',
    'Veracruz',
    'Bogotá',
    'Mérida',
    'Guadalajara',
    'Laura',
    'Tomás',
    'Rosa',
    'Sergio',
    'Gloria',
    'Inés',
    'Pablo',
  ],
  support: [
    'ocurrió',
    'anunció',
    'informa',
    'vendrá',
    'vendría',
    'iban',
    'podías',
    'hubo',
    'terminó',
    'llegan',
    'preguntaron',
    'cierre',
    'presentar',
    'sobre',
    'humo',
    'bombero',
  ],
  unit: {
    position: 10,
    title: 'News and media',
    titleEn: 'Noticias y medios',
    description:
      'Talk about the news and the media you follow, tell a news story, and report what other people said, asked or asked you to do: dijo que era, explicó que iba a, me preguntó si, me pidió que + subjunctive, según.',
    emoji: '📰',
    objective:
      'You can tell a piece of news, report what someone said, asked or asked you to do, and say where you get your news and according to whom something happened.',
    grammar: {
      title: 'Reported speech: dijo que era · me preguntó si · me pidió que + subjunctive · según',
      explanation:
        'To report what someone said in the past, use dijo que, explicó que or contó que + a sentence. As in English, the verb usually moves one step back in time: “es importante” → explicó que era importante (present → imperfect); “va a llover” → dijo que iba a llover (va a → iba a); “el cliente vendrá” → contó que el cliente vendría (future → conditional, which ends in -ía: vendría, tendría, sería). In everyday Latin American Spanish, if what was said is still true, people often keep the present: me dijo que está enfermo (he is still sick). Reported yes / no questions use si (if, without an accent): “¿Tienes tiempo?” → me preguntó si tenía tiempo. Question words keep their accent: me preguntó dónde vivía, cuándo llegaba. Do not confuse preguntar (to ask a question) with pedir (to ask for something, or to ask someone to do something). After pedir que, Spanish uses the subjunctive: me pide que llame (she asks me to call). After me pidió que, Latin Americans very often keep the present subjunctive when the request is still valid: me pidió que la llame mañana. In books and the news you will also see the imperfect subjunctive, me pidió que la llamara: you only need to recognize it at this level. Según (according to) goes before a noun or a subject pronoun: según el periódico, según ella, según tú. Reported questions are statements, so the voice does not rise at the end.',
      examples: [
        {
          target: 'La jefa explicó que el proyecto era muy importante.',
          base: 'The boss explained that the project was very important.',
        },
        {
          target: 'Ana me preguntó si tenía tiempo mañana.',
          base: 'Ana asked me if I had time tomorrow.',
        },
        {
          target: 'Según el periódico, el incendio ocurrió anoche.',
          base: 'According to the newspaper, the fire happened last night.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'B1 nuevo (U10), español neutro con tú. Sin revisión nativa. Revisar: (1) la concordancia de tiempos: se enseña el cambio (es → era, va a → iba a, vendrá → vendría) y se avisa que en Latinoamérica se conserva el presente si sigue vigente; en los fill_blank se evitaron como distractores las formas que un nativo aceptaría (es, va, vendrá), ¿queda claro?; (2) «me pidió que + presente de subjuntivo» (me pidió que la llame, que cierre las ventanas, que te mande el archivo) como norma latinoamericana cuando el pedido sigue vigente, con «llamara» sólo como reconocimiento y como respuesta aceptada: ¿suficiente?; (3) «me preguntó si» frente al coloquial «me preguntó que si» (no se enseña ni se acepta); (4) «el testigo / la testigo» (invariable) y «el periodista / la periodista»; (5) «la radio» frente a «el radio» (México, Centroamérica): sólo se menciona; (6) los titulares van sin punto final, como en la prensa; (7) «me preguntó si tú podías presentar…» con el «tú» explícito para dejar claro que habla de Pablo: ¿natural?; (8) «llueve desde anoche» y «hasta el jueves» en la radio de Veracruz; (9) noticias ficticias, sin víctimas y sin nombres de medios ni de políticos reales.',
    },
    words: [
      w(
        'es-las-noticias',
        'las noticias',
        'the news',
        'Veo las noticias en la tele todas las noches.',
        'I watch the news on TV every night.',
        ['b1', 'media'],
        { acceptedTranslations: ['news'], emoji: '📰' },
      ),
      w(
        'es-el-periodico',
        'el periódico',
        'newspaper',
        'Leo el periódico todas las mañanas.',
        'I read the newspaper every morning.',
        ['b1', 'media'],
        { acceptedTranslations: ['the newspaper', 'the paper'], emoji: '🗞️' },
      ),
      w(
        'es-el-articulo',
        'el artículo',
        'article',
        'Leí un artículo muy bueno sobre la tormenta.',
        'I read a very good article about the storm.',
        ['b1', 'media'],
        { acceptedTranslations: ['the article'] },
      ),
      w(
        'es-el-periodista',
        'el periodista',
        'journalist',
        'La periodista habló con los testigos del incendio.',
        'The journalist talked to the witnesses of the fire.',
        ['b1', 'media', 'jobs'],
        { acceptedTranslations: ['the journalist', 'reporter'], emoji: '🎤' },
      ),
      w(
        'es-el-titular',
        'el titular',
        'headline',
        'El titular de hoy habla de la tormenta en Veracruz.',
        'Today’s headline is about the storm in Veracruz.',
        ['b1', 'media'],
        { acceptedTranslations: ['the headline'] },
      ),
      w(
        'es-explico-que',
        'explicó que',
        'explained that',
        'La jefa explicó que el proyecto era muy importante.',
        'The boss explained that the project was very important.',
        ['b1', 'reported'],
        { acceptedTranslations: ['he explained that', 'she explained that'] },
      ),
      w(
        'es-conto-que',
        'contó que',
        'told (that)',
        'Mi hermana me contó que tenía un trabajo nuevo.',
        'My sister told me that she had a new job.',
        ['b1', 'reported'],
        { acceptedTranslations: ['said that', 'told that'] },
      ),
      w(
        'es-me-pregunto-si',
        'me preguntó si',
        'asked me if',
        'Ana me preguntó si tenía tiempo mañana.',
        'Ana asked me if I had time tomorrow.',
        ['b1', 'reported'],
        { acceptedTranslations: ['asked me whether', 'she asked me if'] },
      ),
      w(
        'es-me-pidio-que',
        'me pidió que',
        'asked me to',
        'Mi mamá me pidió que la llame esta noche.',
        'My mom asked me to call her tonight.',
        ['b1', 'reported', 'subjunctive'],
        { acceptedTranslations: ['she asked me to', 'he asked me to'] },
      ),
      w(
        'es-segun',
        'según',
        'according to',
        'Según el periódico, mañana va a llover.',
        'According to the newspaper, it’s going to rain tomorrow.',
        ['b1', 'media'],
      ),
      w(
        'es-ocurrir',
        'ocurrir',
        'to happen',
        '¿Qué ocurrió anoche en la fábrica?',
        'What happened at the factory last night?',
        ['b1', 'verbs'],
        { acceptedTranslations: ['to occur'] },
      ),
      w(
        'es-anunciar',
        'anunciar',
        'to announce',
        'El gobierno anunció que hoy no hay clases.',
        'The government announced that there are no classes today.',
        ['b1', 'verbs'],
      ),
      w(
        'es-el-incendio',
        'el incendio',
        'fire',
        'Hubo un incendio en una fábrica del centro.',
        'There was a fire in a factory downtown.',
        ['b1', 'news'],
        { acceptedTranslations: ['the fire', 'blaze'], emoji: '🔥' },
      ),
      w(
        'es-la-tormenta',
        'la tormenta',
        'storm',
        'Una tormenta muy fuerte llegó anoche a Veracruz.',
        'A very strong storm hit Veracruz last night.',
        ['b1', 'news', 'weather'],
        { acceptedTranslations: ['the storm'], emoji: '⛈️' },
      ),
      w(
        'es-el-gobierno',
        'el gobierno',
        'government',
        'El gobierno de la ciudad quiere más bicicletas.',
        'The city government wants more bicycles.',
        ['b1', 'news'],
        { acceptedTranslations: ['the government'], emoji: '🏛️' },
      ),
      w(
        'es-el-testigo',
        'el testigo',
        'witness',
        'Una testigo vio el incendio desde su casa.',
        'A witness saw the fire from her house.',
        ['b1', 'news'],
        { acceptedTranslations: ['the witness'] },
      ),
      w(
        'es-informar',
        'informar',
        'to report',
        'Vamos a informar más en las noticias de la noche.',
        'We will report more on the evening news.',
        ['b1', 'verbs', 'media'],
        { acceptedTranslations: ['to inform'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Las noticias de hoy',
        objective: 'Understand headlines and talk about the news and the media you use.',
        intro: {
          explanation:
            'In Spanish, news is plural: las noticias son buenas (the news is good). One piece of news is una noticia. A newspaper is el periódico (also el diario in many countries), and a headline is el titular. Periódico and artículo are stressed on the third syllable from the end, so they carry a written accent: pe-RIÓ-di-co, ar-TÍ-cu-lo. El incendio is a fire that destroys something (a house, a forest); for fire in general, Spanish says el fuego. La tormenta is a storm. El gobierno can be national or local: el gobierno de la ciudad. Headlines are short and often have no verb and no full stop: Tormenta en Veracruz.',
          examples: [
            {
              target: 'Leo el periódico todas las mañanas.',
              base: 'I read the newspaper every morning.',
            },
            {
              target: 'Hubo un incendio en una fábrica del centro.',
              base: 'There was a fire in a factory downtown.',
            },
          ],
        },
        takeaways: [
          'You talk about las noticias, el periódico, los artículos and los titulares.',
          'You understand headlines about a storm, a fire or the government.',
        ],
        exercises: [
          ex.translationChoice(
            'el titular',
            'headline',
            ['article', 'newspaper', 'journalist'],
            ['es-el-titular'],
            { id: 'es.ex.5bpvbokoocsw4x' },
          ),
          ex.matchPairs(
            [
              ['las noticias', 'the news'],
              ['el periódico', 'newspaper'],
              ['el artículo', 'article'],
              ['el gobierno', 'government'],
            ],
            ['es-las-noticias', 'es-el-periodico', 'es-el-articulo', 'es-el-gobierno'],
            { id: 'es.ex.wne4y0eot4be1e' },
          ),
          ex.imageChoice(
            '⛈️',
            'la tormenta',
            ['el incendio', 'el sol', 'la playa'],
            ['es-la-tormenta', 'es-el-incendio'],
            { id: 'es.ex.o7vma4j7jf33h0' },
          ),
          ex.fillBlank(
            'Las noticias de hoy ___ muy malas.',
            'Today’s news is very bad.',
            'son',
            ['es', 'está', 'hay'],
            ['es-las-noticias'],
            {
              id: 'es.ex.3t3c6xcvvfeg0c',
              explanation:
                'Las noticias is plural in Spanish, so the verb is plural too: las noticias son malas. In English “news” takes a singular verb.',
            },
          ),
          ex.listenChoice(
            'Leo el periódico todas las mañanas.',
            [
              'Leo el periódico todas las noches.',
              'Veo las noticias todas las mañanas.',
              'Leo un artículo todas las mañanas.',
            ],
            ['es-el-periodico'],
            { id: 'es.ex.qgpz99tsizszyf' },
          ),
          question(
            'es.ex.xrlsjuagrfmuxx',
            TITULARES,
            'Why is there no school in Veracruz today?',
            'Because of a storm',
            ['Because of a fire', 'Because it is very hot', 'Because of a football final'],
            ['es-la-tormenta', 'es-el-titular'],
            'The headline says “Tormenta en Veracruz: hoy no hay clases en las escuelas”. The fire is in Monterrey and the heat in Mérida.',
          ),
          question(
            'es.ex.9cp6k04wwhei2a',
            TITULARES,
            'What does the government of Bogotá want?',
            'More bicycles in the city',
            ['A new factory', 'More schools', 'Fewer cars at night'],
            ['es-el-gobierno'],
            'The headline says “El gobierno de Bogotá quiere más bicicletas en la ciudad”.',
          ),
          ex.fillBlank(
            'Hubo un ___ en una fábrica del centro.',
            'There was a fire in a factory downtown.',
            'incendio',
            ['tormenta', 'titular', 'gobierno'],
            ['es-el-incendio'],
            {
              id: 'es.ex.iwsu7xougt73us',
              explanation:
                'A fire that burns a building or a forest is el incendio (un incendio). La tormenta is a storm; it is feminine, so it would be “una tormenta”.',
            },
          ),
          ex.translateWrite(
            'I read an article about the storm.',
            'Leí un artículo sobre la tormenta.',
            ['es-el-articulo', 'es-la-tormenta'],
            {
              id: 'es.ex.7aifrnv3lmghlk',
              acceptedAnswers: [
                'Leí un artículo de la tormenta.',
                'Yo leí un artículo sobre la tormenta.',
                'Leo un artículo sobre la tormenta.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Dónde lees las noticias?',
            'Say where you get your news (e.g. on your phone: leo las noticias en el celular).',
            'Leo las noticias en el celular.',
            [
              'Veo las noticias en la tele.',
              'Leo las noticias en el periódico.',
              'Leo el periódico.',
              'En el celular.',
              'Leo las noticias en la computadora.',
              'Escucho las noticias en la radio.',
              'Veo las noticias en el celular.',
            ],
            ['es-las-noticias'],
            { id: 'es.ex.6jsr8tabi9j7t9' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Según el gobierno…',
        objective: 'Say what happened and who reported or announced it, with según.',
        intro: {
          explanation:
            'Según means “according to”. It goes before a noun or a subject pronoun: según el periódico, según el gobierno, según ella, según tú (not “según ti”). Ocurrir means to happen, like pasar, but it sounds a bit more formal and is very common in the news: ¿qué ocurrió? Anunciar (to announce) and informar (to report, to inform) are regular -ar verbs: el gobierno anunció…, nos informa Tomás. A journalist is el periodista or la periodista: words in -ista are the same for men and women, only the article changes. Remember that la radio (the medium) is feminine; in Mexico you will also hear el radio.',
          examples: [
            {
              target: 'Según el pronóstico, va a llover hasta el jueves.',
              base: 'According to the forecast, it’s going to rain until Thursday.',
            },
            {
              target: 'El gobierno anunció que hoy no hay clases.',
              base: 'The government announced that there are no classes today.',
            },
          ],
        },
        takeaways: [
          'You say where information comes from with según.',
          'You talk about what happened and who announced or reported it: ocurrir, anunciar, informar.',
        ],
        exercises: [
          ex.translationChoice(
            'según',
            'according to',
            ['about', 'because of', 'after'],
            ['es-segun'],
            { id: 'es.ex.c4cfmi5u667no1' },
          ),
          ex.matchPairs(
            [
              ['según', 'according to'],
              ['ocurrir', 'to happen'],
              ['anunciar', 'to announce'],
              ['informar', 'to report'],
            ],
            ['es-segun', 'es-ocurrir', 'es-anunciar', 'es-informar'],
            { id: 'es.ex.2axh8erxr8q905' },
          ),
          ex.fillBlank(
            '___ el pronóstico, mañana va a llover.',
            'According to the forecast, it’s going to rain tomorrow.',
            'Según',
            ['Para', 'Sobre', 'Por'],
            ['es-segun'],
            {
              id: 'es.ex.yimrjfdnvr17io',
              explanation:
                'To say where information comes from, use según: según el pronóstico. Para mí gives your own opinion, and sobre means “about”.',
            },
          ),
          ex.fillBlank(
            'Ella es ___ y trabaja en la radio.',
            'She’s a journalist and works on the radio.',
            'periodista',
            ['periódico', 'artículo', 'titular'],
            ['es-el-periodista'],
            {
              id: 'es.ex.jn7mp6w5l6g425',
              explanation:
                'El periodista / la periodista: words in -ista don’t change for women. After ser, professions go without un / una: es periodista.',
            },
          ),
          ex.fillBlank(
            'Ayer el gobierno ___ que no hay clases hoy.',
            'Yesterday the government announced that there are no classes today.',
            'anunció',
            ['anunciar', 'ocurrió', 'informar'],
            ['es-anunciar', 'es-el-gobierno'],
            {
              id: 'es.ex.zg7texly9a29xq',
              explanation:
                'Ayer asks for the preterite: anunció (it announced). Ocurrió means “happened” and does not take que + a sentence.',
            },
          ),
          ex.listenChoice(
            '¿Qué ocurrió anoche en Veracruz?',
            [
              '¿Qué ocurrió anoche en Monterrey?',
              '¿Qué pasó ayer en Veracruz?',
              '¿Qué ocurrió esta mañana en Veracruz?',
            ],
            ['es-ocurrir'],
            { id: 'es.ex.7xcwnnhr4hinko' },
          ),
          question(
            'es.ex.3a5xw846hx45gs',
            RADIO,
            'What did the government announce?',
            'That there are no classes in the schools today',
            [
              'That the airport is closed for a week',
              'That everyone has to leave the city',
              'That the storm is over',
            ],
            ['es-anunciar', 'es-el-gobierno'],
            'Tomás says “El gobierno anunció que hoy no hay clases en las escuelas”.',
          ),
          question(
            'es.ex.qtcziq87hoihuv',
            RADIO,
            'According to the forecast, how long will it rain?',
            'Until Thursday',
            ['Until tonight', 'Until tomorrow at ten', 'All week'],
            ['es-segun', 'es-la-tormenta'],
            'Tomás says “Según el pronóstico, va a llover hasta el jueves”.',
          ),
          ex.translateWrite(
            'According to the journalist, the storm is very strong.',
            'Según el periodista, la tormenta es muy fuerte.',
            ['es-segun', 'es-el-periodista', 'es-la-tormenta'],
            {
              id: 'es.ex.ck4cvpnsue0a2r',
              acceptedAnswers: [
                'Según la periodista, la tormenta es muy fuerte.',
                'Según el periodista la tormenta es muy fuerte.',
                'Según la periodista la tormenta es muy fuerte.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué ocurrió anoche en Veracruz?',
            'Answer with the radio news: a very strong storm arrived (llegó una tormenta).',
            'Llegó una tormenta muy fuerte.',
            [
              'Llegó una tormenta.',
              'Una tormenta muy fuerte llegó a Veracruz.',
              'Una tormenta llegó a Veracruz.',
              'Llegó una tormenta muy fuerte a Veracruz.',
              'Hubo una tormenta muy fuerte.',
              'Hubo una tormenta.',
            ],
            ['es-ocurrir', 'es-la-tormenta'],
            { id: 'es.ex.zmg8tdy91s14eo' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Explicó que era…',
        objective: 'Report what someone said in the past, moving the verb back in time.',
        intro: {
          explanation:
            'When you report something said in the past, the verb usually moves one step back, as in English: “Es la tormenta más fuerte del año” → explicó que era la tormenta más fuerte del año. Present → imperfect (es → era, tiene → tenía); va a → iba a (dijo que iba a llover); future → conditional (vendrá → vendría, the conditional ending -ía). If the news is still true today, people in Latin America often keep the present: me dijo que está enfermo. Contar means to tell (a story, news) and also to count: me contó que… El testigo is a witness; it does not change for women: la testigo.',
          examples: [
            {
              target: 'Su vecino explicó que era la tormenta más fuerte del año.',
              base: 'Her neighbor explained that it was the strongest storm of the year.',
            },
            {
              target: 'Una testigo contó que el agua llegó a su cocina.',
              base: 'A witness said that the water reached her kitchen.',
            },
          ],
        },
        takeaways: [
          'You report what someone said with explicó que, contó que and dijo que.',
          'You move the verb back: es → era, va a → iba a, vendrá → vendría.',
        ],
        exercises: [
          ex.translationChoice(
            'el testigo',
            'witness',
            ['journalist', 'neighbor', 'headline'],
            ['es-el-testigo'],
            { id: 'es.ex.x1hmbhjc1luzl6' },
          ),
          ex.matchPairs(
            [
              ['explicó que', 'explained that'],
              ['contó que', 'told (that)'],
              ['el testigo', 'witness'],
              ['el periodista', 'journalist'],
            ],
            ['es-explico-que', 'es-conto-que', 'es-el-testigo', 'es-el-periodista'],
            { id: 'es.ex.jlt0eyccz37nam' },
          ),
          ex.fillBlank(
            'La jefa explicó que el proyecto ___ muy importante.',
            'The boss explained that the project was very important.',
            'era',
            ['sea', 'ser', 'son'],
            ['es-explico-que'],
            {
              id: 'es.ex.60ufn38qzxhp3a',
              explanation:
                'In reported speech the present moves back to the imperfect: “es importante” → explicó que era importante. (If it is still true, you will also hear explicó que es importante.)',
            },
          ),
          ex.fillBlank(
            'Explicó que ___ a llover por la tarde.',
            'He explained that it was going to rain in the afternoon.',
            'iba',
            ['ir', 'vas', 'iban'],
            ['es-explico-que'],
            {
              id: 'es.ex.16u7ekiop36zmd',
              explanation:
                'Va a llover becomes iba a llover in reported speech. Llover is impersonal (there is no subject, like “it rains”), so iba stays singular.',
            },
          ),
          ex.fillBlank(
            '«El cliente vendrá el lunes». → Contó que el cliente ___ el lunes.',
            '“The client will come on Monday.” → She said the client would come on Monday.',
            'vendría',
            ['venir', 'vine', 'vienes'],
            ['es-conto-que'],
            {
              id: 'es.ex.5jd0i7ta6c1md3',
              explanation:
                'The future (vendrá) becomes the conditional (vendría, “would come”) in reported speech. Vine is “I came”, and vienes is “you come”.',
            },
          ),
          ex.listenChoice(
            'Explicó que era muy tarde.',
            [
              'Explicó que era muy temprano.',
              'Contó que era muy tarde.',
              'Explicó que es muy tarde.',
            ],
            ['es-explico-que', 'es-conto-que'],
            { id: 'es.ex.sox4cgnmy6v5ix' },
          ),
          question(
            'es.ex.6sapqtwv3eatgj',
            ARTICULO,
            'What did Rosa tell the newspaper?',
            'That the water reached her kitchen in ten minutes',
            [
              'That it was the strongest storm of the year',
              'That 300 houses have problems with water',
              'That the schools were going to open on Monday',
            ],
            ['es-el-testigo', 'es-conto-que'],
            'The article says “Una testigo, Rosa, contó que el agua llegó a su cocina en diez minutos”. The strongest storm of the year is what her neighbor explained.',
          ),
          question(
            'es.ex.e2ltqtub4yath7',
            ARTICULO,
            'What did the government announce?',
            'That the schools were going to open on Monday',
            [
              'That the storm was going to come back',
              'That families had to leave their houses',
              'That there was no sun in the city',
            ],
            ['es-anunciar', 'es-el-gobierno'],
            'The article says “El gobierno anunció que las escuelas iban a abrir el lunes”: van a abrir → iban a abrir.',
          ),
          ex.translateWrite(
            'She explained that it was very important.',
            'Explicó que era muy importante.',
            ['es-explico-que'],
            {
              id: 'es.ex.xb25if1mfav6fe',
              acceptedAnswers: [
                'Ella explicó que era muy importante.',
                'Explicó que es muy importante.',
                'Ella explicó que es muy importante.',
              ],
            },
          ),
          ex.translateWrite(
            'The witness said that the fire was very big.',
            'El testigo contó que el incendio era muy grande.',
            ['es-el-testigo', 'es-conto-que', 'es-el-incendio'],
            {
              id: 'es.ex.qg24tulize79se',
              acceptedAnswers: [
                'La testigo contó que el incendio era muy grande.',
                'El testigo dijo que el incendio era muy grande.',
                'La testigo dijo que el incendio era muy grande.',
                'El testigo explicó que el incendio era muy grande.',
                'El testigo contó que el incendio fue muy grande.',
                'El testigo dijo que el incendio fue muy grande.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Me preguntó si…',
        objective: 'Report questions with preguntó si / dónde and requests with pidió que.',
        intro: {
          explanation:
            'To report a yes / no question, use preguntar + si (if): “¿Tienes tiempo?” → me preguntó si tenía tiempo. With a question word, keep the word and its accent: “¿Dónde vives?” → me preguntó dónde vivía. Preguntar is to ask a question; pedir is to ask for something or to ask someone to do something. Pedir que is followed by the subjunctive: me pide que llame (she asks me to call). After me pidió que, Latin Americans usually keep the present subjunctive if the request is still valid: me pidió que la llame mañana, me pidió que cierre las ventanas. In written Spanish you will also see me pidió que la llamara (imperfect subjunctive): just recognize it for now. Pedir changes e to i: pido, pides, pide, pidió.',
          examples: [
            {
              target: 'Me preguntó si tenía tiempo.',
              base: 'She asked me if I had time.',
            },
            {
              target: 'Mi mamá me pidió que la llame esta noche.',
              base: 'My mom asked me to call her tonight.',
            },
          ],
        },
        takeaways: [
          'You report questions with me preguntó si… and me preguntó dónde / cuándo…',
          'You report requests with me pidió que + subjunctive.',
        ],
        exercises: [
          ex.translationChoice(
            'me pidió que',
            'asked me to',
            ['asked me if', 'told (that)', 'explained that'],
            ['es-me-pidio-que'],
            { id: 'es.ex.87ad0iscpju0rr' },
          ),
          ex.fillBlank(
            'Me ___ si tenía tiempo.',
            'She asked me if I had time.',
            'preguntó',
            ['pidió', 'contó', 'explicó'],
            ['es-me-pregunto-si'],
            {
              id: 'es.ex.jkdetey5g83fwn',
              explanation:
                'A question is reported with preguntar: me preguntó si… Pedir is for requests (me pidió que + subjunctive).',
            },
          ),
          ex.fillBlank(
            'Mi jefa me pidió que le ___ el archivo.',
            'My boss asked me to send her the file.',
            'mande',
            ['mando', 'mandar', 'manda'],
            ['es-me-pidio-que'],
            {
              id: 'es.ex.u9wcptbr7s75rk',
              explanation:
                'Pedir que + subjunctive: mande (from mandar: -ar verbs take -e). Mando and manda are indicative, and the infinitive mandar needs no que.',
            },
          ),
          ex.fillBlank(
            'Me preguntó ___ vivía.',
            'He asked me where I lived.',
            'dónde',
            ['si', 'que', 'según'],
            ['es-me-pregunto-si'],
            {
              id: 'es.ex.avpi12njojfyf3',
              explanation:
                'A reported question with a question word keeps the word and its accent: “¿Dónde vives?” → me preguntó dónde vivía. Si is only for yes / no questions.',
            },
          ),
          ex.listenChoice(
            'Me preguntó si tenía tiempo.',
            [
              'Me preguntó si tenía frío.',
              'Me dijo que tenía tiempo.',
              'Me preguntó si tienes tiempo.',
            ],
            ['es-me-pregunto-si'],
            { id: 'es.ex.d7infpy91wbpn4' },
          ),
          question(
            'es.ex.1s075g8sg2iuib',
            TESTIGO,
            'What did the firefighters ask Gloria?',
            'If there were people in the factory',
            ['Where she lived', 'When the fire started', 'If she could close the factory'],
            ['es-me-pregunto-si', 'es-el-testigo'],
            'Gloria says “Me preguntaron si había personas en la fábrica”: preguntar + si for a yes / no question.',
          ),
          question(
            'es.ex.mifby7q8aq1if7',
            TESTIGO,
            'What did a firefighter ask Gloria to do?',
            'Close the windows and stay at home today',
            ['Call the newspaper', 'Leave the neighborhood', 'Talk to the workers of the factory'],
            ['es-me-pidio-que'],
            'Gloria says “Un bombero me pidió que cierre las ventanas y que no salga de casa hoy”: pedir que + subjunctive.',
          ),
          question(
            'es.ex.6cq2oc8pj5r3jk',
            REUNION,
            'What did the boss ask Inés?',
            'If Pablo could present the project on Monday',
            [
              'If Inés could send the file to the client',
              'Where Pablo was',
              'When the client was going to come',
            ],
            ['es-me-pregunto-si'],
            'Inés writes “Me preguntó si tú podías presentar el proyecto el lunes”: the boss asked if Pablo could (¿puede…?), and Inés, writing to Pablo, reports it with tú: si podías.',
          ),
          ex.translateWrite(
            'She asked me to call her tomorrow.',
            'Me pidió que la llame mañana.',
            ['es-me-pidio-que'],
            {
              id: 'es.ex.i1yoavyza8co9k',
              acceptedAnswers: [
                'Ella me pidió que la llame mañana.',
                'Me pidió que la llamara mañana.',
                'Ella me pidió que la llamara mañana.',
                'Me pidió que la llamase mañana.',
              ],
            },
          ),
          ex.shortAnswer(
            '«¿Tienes tiempo mañana?», te preguntó Ana. ¿Qué te preguntó?',
            'Report Ana’s question (use «me preguntó si»).',
            'Me preguntó si tenía tiempo mañana.',
            [
              'Me preguntó si tenía tiempo.',
              'Me preguntó si tengo tiempo mañana.',
              'Ana me preguntó si tenía tiempo mañana.',
              'Me preguntó si tenía tiempo al día siguiente.',
              'Ana me preguntó si tengo tiempo mañana.',
            ],
            ['es-me-pregunto-si'],
            { id: 'es.ex.y4o2zafbxe4258' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Te cuento la noticia',
        objective:
          'Tell a piece of news and pass on what different people said, asked and asked for.',
        intro: {
          explanation:
            'To pass on news, start with te cuento (let me tell you) or ¿sabes qué pasó?, then report each person with the right verb: dijo que, explicó que, contó que for statements; me preguntó si / dónde for questions; me pidió que + subjunctive for requests. Add según to say where the information comes from. A news story usually answers: ¿qué ocurrió?, ¿dónde?, ¿cuándo? and ¿qué dicen los testigos?',
          examples: [
            {
              target: 'Te cuento lo que pasó en la reunión de hoy.',
              base: 'Let me tell you what happened at today’s meeting.',
            },
            {
              target: 'Según ella, la fecha límite es el viernes.',
              base: 'According to her, the deadline is Friday.',
            },
          ],
        },
        takeaways: [
          'You tell a news story: what happened, where, when and what the witnesses said.',
          'You pass on what people said, asked and asked you to do.',
        ],
        exercises: [
          question(
            'es.ex.g854tqog1is7gs',
            REUNION,
            'When is the client coming to the office?',
            'On Monday',
            ['On Friday', 'Tomorrow', 'Next week'],
            ['es-conto-que'],
            'Inés writes “Contó que el cliente vendría a la oficina el lunes”: vendrá → vendría. Friday is the deadline.',
          ),
          question(
            'es.ex.xkukekvkizniz6',
            REUNION,
            'What did the boss ask Inés to do?',
            'Send Pablo the file from the meeting',
            ['Present the project on Monday', 'Call the client', 'Work alone all week'],
            ['es-me-pidio-que', 'es-explico-que'],
            'Inés writes “me pidió que te mande el archivo de la reunión: te lo mando esta noche”. Presenting the project is what the boss asked about Pablo.',
          ),
          question(
            'es.ex.ux3fkrq0b6peea',
            TESTIGO,
            'Why was nobody in the factory?',
            'The fire was at six and everybody arrives at eight',
            ['It was a Sunday', 'The firefighters closed it', 'The workers were on a trip'],
            ['es-conto-que', 'es-el-incendio'],
            'Gloria saw the smoke “a las seis de la mañana”, and a man from the factory “me contó que todos llegan a las ocho”.',
          ),
          question(
            'es.ex.kujounq2aiwraq',
            RADIO,
            'When is the first flight from Veracruz?',
            'Tomorrow at ten, if it doesn’t rain much',
            ['Today at ten', 'On Thursday', 'Tonight'],
            ['es-informar'],
            'Tomás says “Hoy no hay vuelos. El primer vuelo sale mañana a las diez, si no llueve mucho”.',
          ),
          ex.listenChoice(
            'Según el periódico, el incendio ocurrió anoche.',
            [
              'Según el periódico, el incendio ocurrió ayer.',
              'Según la radio, el incendio ocurrió anoche.',
              'Según el periódico, la tormenta llegó anoche.',
            ],
            ['es-segun', 'es-el-incendio', 'es-ocurrir'],
            { id: 'es.ex.e26akmimc4a2h0' },
          ),
          ex.matchPairs(
            [
              ['me preguntó si', 'asked me if'],
              ['me pidió que', 'asked me to'],
              ['anunciar', 'to announce'],
              ['el titular', 'headline'],
            ],
            ['es-me-pregunto-si', 'es-me-pidio-que', 'es-anunciar', 'es-el-titular'],
            { id: 'es.ex.h17npwvw1a3snm' },
          ),
          ex.fillBlank(
            'El gobierno ___ que las escuelas iban a abrir el lunes.',
            'The government announced that the schools were going to open on Monday.',
            'anunció',
            ['anunciar', 'ocurrió', 'según'],
            ['es-anunciar', 'es-el-gobierno'],
            {
              id: 'es.ex.bxf3xejamkg3zd',
              explanation:
                'A reporting verb in the preterite: anunció que… And the verb after it moves back: van a abrir → iban a abrir.',
            },
          ),
          ex.orderWords(
            'El periodista me preguntó dónde vivía.',
            'The journalist asked me where I lived.',
            ['es-el-periodista', 'es-me-pregunto-si'],
            { id: 'es.ex.32aqo2h292yq2e' },
          ),
          ex.translateWrite(
            'The journalist told me that the storm was going to arrive at night.',
            'El periodista me dijo que la tormenta iba a llegar en la noche.',
            ['es-el-periodista', 'es-la-tormenta'],
            {
              id: 'es.ex.po7vxx2z9k3px4',
              acceptedAnswers: [
                'El periodista me dijo que la tormenta iba a llegar por la noche.',
                'La periodista me dijo que la tormenta iba a llegar en la noche.',
                'La periodista me dijo que la tormenta iba a llegar por la noche.',
                'El periodista me contó que la tormenta iba a llegar en la noche.',
                'El periodista me contó que la tormenta iba a llegar por la noche.',
                'El periodista me dijo que la tormenta iba a llegar de noche.',
              ],
            },
          ),
          ex.shortAnswer(
            'Tu amigo te dijo: «Voy a llegar tarde». ¿Qué te dijo?',
            'Report what your friend said (va a → iba a).',
            'Me dijo que iba a llegar tarde.',
            [
              'Dijo que iba a llegar tarde.',
              'Me dijo que va a llegar tarde.',
              'Mi amigo me dijo que iba a llegar tarde.',
              'Me contó que iba a llegar tarde.',
              'Me explicó que iba a llegar tarde.',
            ],
            ['es-conto-que', 'es-explico-que'],
            { id: 'es.ex.v6xw3p21ipwbid' },
          ),
        ],
      },
    ],
  },
};

const common = (minSentences: number): WritingRequirement[] => [
  {
    id: 'sentences',
    label: `You write at least ${minSentences} sentences`,
    kind: 'min_sentences',
    min: minSentences,
  },
  { id: 'capital', label: 'Each sentence starts with a capital letter', kind: 'capital_start' },
  {
    id: 'punctuation',
    label: 'You end with a full stop, an exclamation mark or a question mark',
    kind: 'end_punctuation',
  },
];

const base = { language: 'es', allowInvented: true as const, maxChars: 1500 };

/** Tareas de escritura de la unidad (docs/ES_B1.md). */
export const ES_B1_U10_WRITING: readonly WritingTaskDef[] = [
  {
    ...base,
    id: 'es.b1.wt.lo-que-te-dijeron',
    kind: 'guided',
    codes: [],
    lesson: 'es-b1-u10-l05',
    title: 'What they told you',
    instructions:
      'Think of a recent conversation (real or invented) with a friend, a relative or someone at work. Report what the person told you, what they asked you and what they asked you to do. Move the verbs back in time (es → era, va a → iba a).',
    prompts: ['¿Qué te contó?', '¿Qué te preguntó y qué te pidió?'],
    requirements: [
      {
        id: 'reported',
        label: 'You report what someone said (dijo que, explicó que, contó que…)',
        kind: 'pattern',
        patterns: [['dijo|explicó|contó|anunció', 'que']],
      },
      {
        id: 'backshift',
        label: 'You move a verb back in time (era, estaba, tenía, iba a, vendría…)',
        kind: 'pattern',
        patterns: [['era|estaba|tenía|iba|iban|vendría|podía|podías|había']],
      },
      {
        id: 'question',
        label: 'You report a question (me preguntó si… / me preguntó dónde…)',
        kind: 'pattern',
        patterns: [['preguntó', 'si|dónde|cuándo|qué|cómo|por|quién']],
      },
      {
        id: 'request',
        label: 'You report a request with pidió que + subjunctive (me pidió que la llame…)',
        kind: 'pattern',
        patterns: [['pidió', 'que']],
      },
      ...common(5),
    ],
    model:
      'Ayer hablé con mi amiga Sofía por teléfono. Me contó que estaba muy contenta porque tenía un trabajo nuevo. Explicó que el trabajo era en un periódico de Guadalajara y que iba a ser periodista. Me preguntó si iba a ir a Guadalajara en diciembre. Le dije que sí. También me pidió que la llame el domingo. Según ella, Guadalajara es muy bonita en diciembre.',
    checklist: [
      'I use dijo que, explicó que or contó que, and I move the verb back (es → era, va a → iba a).',
      'I report a question with preguntó si (yes / no) or with dónde, cuándo… (with the accent).',
      'After pidió que I use the subjunctive (que la llame, que le mande…).',
    ],
  },
];
