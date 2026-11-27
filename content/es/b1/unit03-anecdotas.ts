import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';
import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_B1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español B1 U3 «Anecdotes» (docs/ES_B1.md §3): contar una anécdota en orden. El pluscuamperfecto
 * (había + participio: el tren ya había salido, había olvidado el celular) dice lo que ya había pasado
 * antes de otro momento del pasado; el imperfecto describe la escena (estaba cansada, había mucha
 * gente) y el indefinido cuenta los hechos (me dormí, volví). Conectores de relato: en ese momento,
 * en cuanto, por fin, al final, de repente y luego. Verbos pronominales del relato: darse cuenta (me
 * di cuenta de que…), equivocarse (me equivoqué de…), reírse (nos reímos). Reacciones: ¡Qué susto!,
 * ¡Qué sorpresa!, ¡Qué vergüenza!, ¡No me digas!
 * Variante: español neutro de Latinoamérica, con tú (cuéntame, ¿me cuentas?), el celular, el metro y
 * el camión como alternativa mexicana del autobús.
 * Pronunciación: la h muda de había (a-BÍ-a) y la d suave de los participios (olvidado, salido); la
 * tilde que separa las vocales de reírse, reí y reímos.
 * Cultura: el metro de la Ciudad de México (Universidad, al final de la línea 3), una boda en Mérida
 * (Yucatán) y el «falso amigo» avergonzado / embarazada.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const METRO = dialogue(
  'es.stim.b1-u3-metro',
  'Daniela arrives late to meet her friend Rodrigo in Mexico City and tells him what happened on the subway.',
  [
    ['Rodrigo', '¡Por fin llegaste, Daniela! ¿Qué te pasó?'],
    [
      'Daniela',
      'Te cuento, Rodrigo. Esta mañana había mucha gente en el metro y yo estaba muy cansada.',
    ],
    ['Rodrigo', '¿Y entonces?'],
    [
      'Daniela',
      'En cuanto me senté, me dormí. Cuando me desperté, el tren ya había salido de mi estación y yo estaba en Universidad, ¡al final de la línea!',
    ],
    ['Rodrigo', '¡Qué susto! ¿Y qué hiciste?'],
    [
      'Daniela',
      'Tomé otro tren para volver. En ese momento me di cuenta de que había olvidado el celular en el asiento.',
    ],
    ['Rodrigo', '¡No! ¿Y lo perdiste?'],
    [
      'Daniela',
      'No. Al final, una señora lo encontró y me lo devolvió en la estación. ¡Qué sorpresa!',
    ],
  ],
  ES_B1_RATE,
);

const SUSTO = dialogue(
  'es.stim.b1-u3-susto',
  'Two coworkers in Lima, Patricia and Jorge, talk during a coffee break.',
  [
    ['Patricia', 'Jorge, ¿te cuento lo que me pasó anoche?'],
    ['Jorge', 'Claro, cuéntame.'],
    [
      'Patricia',
      'Estaba sola en casa porque mi esposo había salido con unos amigos. Yo estaba mirando una serie en la sala.',
    ],
    ['Jorge', '¿Y qué pasó?'],
    ['Patricia', 'De repente, escuché un ruido muy fuerte en la cocina. Tuve mucho miedo.'],
    ['Jorge', '¡Qué susto! ¿Y qué hiciste?'],
    [
      'Patricia',
      'Primero llamé a mi esposo. Luego fui a la cocina despacio y me di cuenta de que era el gato del vecino.',
    ],
    ['Jorge', '¿El gato? ¿Y cómo entró?'],
    ['Patricia', 'Por la ventana. ¡Yo la había dejado abierta!'],
  ],
  ES_B1_RATE,
);

const MENSAJE = reading(
  'es.stim.b1-u3-mensaje',
  'message',
  'Valeria writes to her friend Camila the day after an embarrassing moment.',
  [
    '¡Hola, Camila! No vas a creer lo que me pasó ayer.',
    'Estaba en un café de Guadalajara y vi a un chico alto con una camisa azul.',
    'Pensé que era mi vecino Andrés, entonces le di un beso y le dije: «¡Hola! ¿Qué haces aquí?».',
    'El chico me miró muy serio: ¡no era Andrés!',
    'En ese momento me di cuenta de que me había equivocado y me sentí muy avergonzada.',
    'Por suerte, él fue muy simpático y al final nos reímos mucho.',
    '¡Qué historia! Te cuento más el sábado.',
  ],
  { title: 'No vas a creer lo que me pasó', from: 'Valeria', to: 'Camila' },
);

const BODA = reading(
  'es.stim.b1-u3-boda',
  'post',
  'Mariana tells a family story on social media.',
  [
    'El sábado pasado fue la boda de mi hermana en Mérida.',
    'Hacía mucho calor, pero todo era perfecto.',
    'Cuando llegamos a la iglesia, mi hermano se dio cuenta de que había olvidado los anillos en el hotel.',
    'En ese momento, mi hermana casi lloró y nadie sabía qué hacer.',
    'Mi hermano tomó un taxi y, por fin, volvió con los anillos una hora después.',
    'Al final, la boda empezó tarde, pero fue una noche inolvidable.',
    'Ahora, en cada fiesta de la familia, contamos la historia de los anillos y nos reímos mucho.',
  ],
  { title: 'La boda de mi hermana', from: 'Mariana' },
);

export const ES_B1_U03: EsUnitDef = {
  names: [
    'Daniela',
    'Rodrigo',
    'Patricia',
    'Jorge',
    'Valeria',
    'Camila',
    'Andrés',
    'Mariana',
    'Mérida',
  ],
  support: [
    // Formas nuevas de verbos de la unidad y del relato.
    'contamos',
    'cuéntame',
    'di',
    'dio',
    'habían',
    'dejado',
    'equivocado',
    'equivoqué',
    'equivocó',
    'reímos',
    'reí',
    'reíste',
    'sentí',
    'senté',
    'entró',
    'encontró',
    'tomó',
    'volvió',
    'lloró',
    'llegamos',
    'hacía',
    'sabía',
    'creer',
    'digas',
    // Léxico de los relatos.
    'despacio',
    'línea',
    'asiento',
    'boda',
    'iglesia',
    'anillos',
    'taxi',
    'vergüenza',
  ],
  unit: {
    position: 3,
    title: 'Anecdotes',
    titleEn: 'Anécdotas',
    description:
      'Tell an anecdote in order: set the scene with the imperfect, tell the events with the preterite, say what had already happened with había + participle, link the story with en ese momento, en cuanto, por fin and al final, and react to other people’s stories.',
    emoji: '😅',
    objective:
      'You can tell a short anecdote in the right order, say what had already happened before something else, and react to someone else’s story (¡Qué susto!, ¡No me digas!).',
    grammar: {
      title: 'The pluperfect (había + participle) · telling a story · story connectors',
      explanation:
        'The pluperfect tells what had already happened before another moment in the past. It is the imperfect of haber + a participle: había, habías, había, habíamos, habían + -ado (-ar verbs: olvidado) or -ido (-er / -ir verbs: salido). The irregular participles are the ones you know from the present perfect: hecho, visto, dicho, escrito, vuelto, puesto, abierto, roto. Ya often goes with it: cuando llegué, el tren ya había salido (it left before I arrived). Compare: cuando llegué, el tren salió (it left at that moment). Había is never separated from the participle, and object pronouns go before había: lo había dejado, me había equivocado. In a story, the imperfect sets the scene (estaba cansada, había mucha gente), the preterite moves the story forward (me dormí, volví) and the pluperfect goes back to something earlier. To order the events use primero, luego, de repente (suddenly), en ese momento (at that moment), en cuanto (as soon as: en cuanto llegué, llamé), por fin (at last, with relief after waiting) and al final (in the end, how things turned out). Several story verbs take a reflexive pronoun: darse cuenta de que (to realize: me di cuenta, se dio cuenta; dar has no accents in the preterite: di, dio), equivocarse (to make a mistake: me equivoqué, with c → qu before e) and reírse (to laugh: me reí, nos reímos; él / ella se rio, written without an accent since 2010, although you will often see rió).',
      examples: [
        {
          target: 'Cuando llegué a la estación, el tren ya había salido.',
          base: 'When I got to the station, the train had already left.',
        },
        {
          target:
            'Estaba en el metro y, de repente, me di cuenta de que había olvidado el celular.',
          base: 'I was on the subway and suddenly I realized I had forgotten my phone.',
        },
        { target: 'Al final, todos nos reímos mucho.', base: 'In the end, we all laughed a lot.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'B1 nuevo (U3), español neutro de Latinoamérica con tú. Sin revisión nativa. Revisar: «el tren ya había salido de mi estación» (también «ya me había pasado de estación», más idiomático en México); «al final» (in the end) frente a «por fin» (at last) en los ejercicios de huecos, donde a veces los dos podrían caber (se eligieron frases con un solo conector posible); «en cuanto» + indefinido (en cuanto me senté) sin presentar todavía en cuanto + subjuntivo; «me equivoqué de número / de autobús» y la aceptación de «camión» (México); «se rio» sin tilde (ortografía de 2010) mencionado sólo en la gramática, porque en los textos se usa «nos reímos» para evitarlo; «darle un beso» a un desconocido como saludo (normal en gran parte de Latinoamérica entre conocidos); «avergonzado» frente a «apenado» (México) y la mención del falso amigo «embarazada»; «¡No me digas!» y «¡Qué vergüenza!» como reacciones (también «¡Qué pena!» en México y Colombia, con otro sentido en otros países); «la iglesia» en la boda de Mérida; «hacía mucho calor» con «hacía» como forma de apoyo. Coordinación: las formas de apoyo (conté, di, dio, salido…) pueden quedar enseñadas por U1–U2 cuando se escriban; si el validador las marca como ya enseñadas, se sacan del apoyo.',
    },
    words: [
      w(
        'es-la-anecdota',
        'la anécdota',
        'anecdote',
        'Mi abuelo siempre cuenta anécdotas de su pueblo.',
        'My grandfather always tells anecdotes about his town.',
        ['b1', 'stories'],
        { acceptedTranslations: ['the anecdote'], emoji: '💬' },
      ),
      w(
        'es-contar',
        'contar',
        'to tell',
        '¿Me cuentas qué pasó?',
        'Will you tell me what happened?',
        ['b1', 'stories', 'verbs'],
        { acceptedTranslations: ['to count'] },
      ),
      w(
        'es-la-historia',
        'la historia',
        'story',
        'Es una historia muy divertida.',
        'It’s a very funny story.',
        ['b1', 'stories'],
        { acceptedTranslations: ['the story', 'history'], emoji: '📖' },
      ),
      w(
        'es-olvidar',
        'olvidar',
        'to forget',
        'No quiero olvidar este día.',
        'I don’t want to forget this day.',
        ['b1', 'verbs'],
      ),
      w(
        'es-habia-olvidado',
        'había olvidado',
        'I had forgotten',
        'Había olvidado las llaves en casa.',
        'I had forgotten my keys at home.',
        ['b1', 'pluperfect'],
        { acceptedTranslations: ['he had forgotten', 'she had forgotten'] },
      ),
      w(
        'es-habia-salido',
        'había salido',
        'had left',
        'Cuando llegué, el tren ya había salido.',
        'When I arrived, the train had already left.',
        ['b1', 'pluperfect'],
        { acceptedTranslations: ['had gone out'] },
      ),
      w(
        'es-darse-cuenta',
        'darse cuenta',
        'to realize',
        'Me di cuenta de que era muy tarde.',
        'I realized that it was very late.',
        ['b1', 'verbs'],
        { acceptedTranslations: ['to notice'] },
      ),
      w(
        'es-en-ese-momento',
        'en ese momento',
        'at that moment',
        'En ese momento, llegó la policía.',
        'At that moment, the police arrived.',
        ['b1', 'connectors'],
      ),
      w(
        'es-por-fin',
        'por fin',
        'finally (at last)',
        '¡Por fin llegó el autobús!',
        'The bus finally arrived!',
        ['b1', 'connectors'],
        { acceptedTranslations: ['at last', 'finally'] },
      ),
      w(
        'es-al-final',
        'al final',
        'in the end',
        'Al final, todo salió bien.',
        'In the end, everything turned out fine.',
        ['b1', 'connectors'],
      ),
      w(
        'es-en-cuanto',
        'en cuanto',
        'as soon as',
        'En cuanto llegué a casa, llamé a mi mamá.',
        'As soon as I got home, I called my mom.',
        ['b1', 'connectors'],
      ),
      w(
        'es-equivocarse',
        'equivocarse',
        'to make a mistake',
        'Perdón, me equivoqué de número.',
        'Sorry, I got the wrong number.',
        ['b1', 'verbs'],
        { acceptedTranslations: ['to be wrong'] },
      ),
      w(
        'es-el-susto',
        'el susto',
        'scare, fright',
        '¡Qué susto! Pensé que había alguien en la casa.',
        'What a scare! I thought there was someone in the house.',
        ['b1', 'feelings'],
        { acceptedTranslations: ['scare', 'fright'], emoji: '😱' },
      ),
      w(
        'es-reirse',
        'reírse',
        'to laugh',
        'Nos reímos mucho con la película.',
        'We laughed a lot at the movie.',
        ['b1', 'verbs'],
        { emoji: '😂' },
      ),
      w(
        'es-la-sorpresa',
        'la sorpresa',
        'surprise',
        'La fiesta fue una sorpresa para mi papá.',
        'The party was a surprise for my dad.',
        ['b1', 'feelings'],
        { acceptedTranslations: ['the surprise'], emoji: '🎁' },
      ),
      w(
        'es-me-paso',
        'me pasó',
        'it happened to me',
        'Esto me pasó el año pasado en Lima.',
        'This happened to me last year in Lima.',
        ['b1', 'stories'],
      ),
      w(
        'es-avergonzado',
        'avergonzado',
        'embarrassed',
        'Estaba muy avergonzada porque llegué tarde.',
        'I was very embarrassed because I arrived late.',
        ['b1', 'feelings'],
        { acceptedTexts: ['avergonzada'], emoji: '😳' },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: '¿Qué te pasó?',
        objective: 'Ask someone what happened, start telling a story and react to it.',
        intro: {
          explanation:
            'An anécdota is a short, real story, usually funny or surprising; la historia is any story (and also history). Contar (to tell) changes o to ue: cuento, cuentas, cuenta, contamos, cuentan. To invite someone to tell you a story say ¿Me cuentas? or cuéntame (tell me), and to start one say te cuento… (let me tell you). Pasar works with me, te, le: ¿Qué te pasó? (What happened to you?), me pasó algo increíble. Remember the two past tenses of a story: the imperfect for the scene (era de noche, llovía) and the preterite for what happened (me pasó, vi). People react with ¡Qué…! + noun: ¡Qué susto! (What a scare!), ¡Qué sorpresa! (What a surprise!), ¡Qué historia!',
          examples: [
            {
              target: '¿Qué te pasó? — Te cuento: me pasó algo muy divertido.',
              base: 'What happened to you? — Let me tell you: something very funny happened to me.',
            },
            { target: '¡Qué susto! ¿Y qué hiciste?', base: 'What a scare! And what did you do?' },
          ],
        },
        takeaways: [
          'You ask ¿Qué te pasó? and start a story with te cuento… or me pasó…',
          'You react to a story with ¡Qué susto!, ¡Qué sorpresa! or ¡Qué historia!',
        ],
        exercises: [
          ex.translationChoice(
            'la anécdota',
            'anecdote',
            ['joke', 'piece of news', 'advice'],
            ['es-la-anecdota'],
            { id: 'es.ex.umrwoz0rpghumu' },
          ),
          ex.translationChoice(
            'me pasó',
            'it happened to me',
            ['I passed it', 'I missed it', 'it hurt me'],
            ['es-me-paso'],
            { id: 'es.ex.au9arzgws5e5yp' },
          ),
          ex.matchPairs(
            [
              ['contar', 'to tell'],
              ['la historia', 'story'],
              ['el susto', 'scare, fright'],
              ['la sorpresa', 'surprise'],
            ],
            ['es-contar', 'es-la-historia', 'es-el-susto', 'es-la-sorpresa'],
            { id: 'es.ex.0xc8c7fjzu57nk' },
          ),
          ex.fillBlank(
            'Oye, ¿me ___ qué te pasó ayer?',
            'Hey, will you tell me what happened to you yesterday?',
            'cuentas',
            ['contar', 'cuento', 'contamos'],
            ['es-contar'],
            {
              id: 'es.ex.ubz03w6mtz2x2t',
              explanation:
                'Contar changes o to ue in the present: cuento, cuentas, cuenta (but contamos). Te pasó shows we are talking to tú, so the verb is cuentas.',
            },
          ),
          ex.listenChoice(
            '¡Qué susto!',
            ['¡Qué sorpresa!', '¡Qué suerte!', '¡Qué sueño!'],
            ['es-el-susto'],
            { id: 'es.ex.6kz6g9ssdnumvk' },
          ),
          ex.fillBlank(
            'Ayer me ___ algo muy divertido en el trabajo.',
            'Something very funny happened to me at work yesterday.',
            'pasó',
            ['pasa', 'pasado'],
            ['es-me-paso'],
            {
              id: 'es.ex.b1zaq3yevrl0j5',
              explanation:
                'Ayer marks a finished event, so we use the preterite: me pasó. The subject is algo (something), so the verb is in the él / ella form.',
            },
          ),
          ex.fillBlank(
            'Era de noche y ___ mucho cuando llegué a casa.',
            'It was night and it was raining a lot when I got home.',
            'llovía',
            ['llueve', 'llover'],
            ['es-la-historia'],
            {
              id: 'es.ex.9hp1t9z1n1scvp',
              explanation:
                'The weather and the time are the scene of the story, so they go in the imperfect: era de noche, llovía. What happens next goes in the preterite: llegué.',
            },
          ),
          ex.orderWords(
            'Mi abuelo siempre cuenta historias divertidas.',
            'My grandfather always tells funny stories.',
            ['es-contar', 'es-la-historia'],
            { id: 'es.ex.w0ngysi805bc27' },
          ),
          ex.translateWrite(
            'It was a very funny story.',
            'Fue una historia muy divertida.',
            ['es-la-historia'],
            {
              id: 'es.ex.0n7beabrsdxyf4',
              acceptedAnswers: [
                'Era una historia muy divertida.',
                'Fue una anécdota muy divertida.',
                'Era una anécdota muy divertida.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué te pasó? Estás muy contento.',
            'Say that something very funny happened to you (use «me pasó»).',
            'Me pasó algo muy divertido.',
            [
              'Me pasó algo divertido.',
              'Me pasó algo muy divertido hoy.',
              'Hoy me pasó algo muy divertido.',
              'Me pasó algo muy divertido en el trabajo.',
              'Te cuento: me pasó algo muy divertido.',
            ],
            ['es-me-paso'],
            { id: 'es.ex.5fkx2yejp1h7o7' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Ya había salido',
        objective: 'Say what had already happened before another moment in the past.',
        intro: {
          explanation:
            'To go back to something that happened before another past moment, use the pluperfect: había + participle. Había is the same word as in había mucha gente, and its h is silent: a-BÍ-a. The forms are había, habías, había, habíamos, habían, and the participle never changes: había olvidado, habían salido. The d of -ado / -ido is soft, almost like the th of this. Ya (already) usually goes before había: cuando llegué, el tren ya había salido. Darse cuenta de que means to realize: me di cuenta, te diste cuenta, se dio cuenta. Dar has no written accents in the preterite (di, dio).',
          examples: [
            {
              target: 'Cuando llegué a la estación, el tren ya había salido.',
              base: 'When I got to the station, the train had already left.',
            },
            {
              target: 'Me di cuenta de que había olvidado las llaves.',
              base: 'I realized that I had forgotten my keys.',
            },
          ],
        },
        takeaways: [
          'You say what had already happened with había + participle (había salido, había olvidado).',
          'You say what you realized with me di cuenta de que…',
        ],
        exercises: [
          ex.translationChoice(
            'había salido',
            'had left',
            ['has left', 'was leaving', 'will leave'],
            ['es-habia-salido'],
            { id: 'es.ex.lmky86l1z07dng' },
          ),
          ex.matchPairs(
            [
              ['olvidar', 'to forget'],
              ['había olvidado', 'I had forgotten'],
              ['había salido', 'had left'],
              ['darse cuenta', 'to realize'],
            ],
            ['es-olvidar', 'es-habia-olvidado', 'es-habia-salido', 'es-darse-cuenta'],
            { id: 'es.ex.hoyko6gorxo55u' },
          ),
          ex.fillBlank(
            'Cuando llegué, el tren ya ___ salido.',
            'When I arrived, the train had already left.',
            'había',
            ['ha', 'hay', 'tenía'],
            ['es-habia-salido'],
            {
              id: 'es.ex.26srt76sa25bxe',
              explanation:
                'Something that happened before another past moment (cuando llegué) takes the pluperfect: había + participle. Spanish uses haber, never tener, to build these tenses.',
            },
          ),
          ex.fillBlank(
            'Me ___ cuenta de que era muy tarde.',
            'I realized that it was very late.',
            'di',
            ['dio', 'dije', 'hice'],
            ['es-darse-cuenta'],
            {
              id: 'es.ex.b6v981nv86cwz8',
              explanation:
                'Darse cuenta uses dar: me di cuenta (I), se dio cuenta (he / she). Dije is from decir and hice from hacer.',
            },
          ),
          ex.listenChoice(
            'Había olvidado las llaves.',
            ['Habían olvidado las llaves.', 'He olvidado las llaves.', 'Había olvidado la maleta.'],
            ['es-habia-olvidado'],
            { id: 'es.ex.aot71e9ggmzcbl' },
          ),
          ex.orderWords(
            'Me di cuenta de que había olvidado las llaves.',
            'I realized that I had forgotten my keys.',
            ['es-darse-cuenta', 'es-habia-olvidado'],
            { id: 'es.ex.oftuglc3lx9u19' },
          ),
          question(
            'es.ex.pqngvxvjfhy5iv',
            SUSTO,
            'Why was Patricia alone at home?',
            'Her husband had gone out with some friends',
            [
              'Her husband was working late',
              'Her family was on a trip',
              'She had just moved to Lima',
            ],
            ['es-habia-salido'],
            'Patricia says “mi esposo había salido con unos amigos”: había salido tells what had happened before the story started.',
          ),
          question(
            'es.ex.iuo82bhlobju2z',
            SUSTO,
            'What made the noise in the kitchen?',
            'The neighbor’s cat',
            ['Her husband', 'A thief', 'The TV'],
            ['es-darse-cuenta', 'es-el-susto'],
            'Patricia says “me di cuenta de que era el gato del vecino”.',
          ),
          ex.translateWrite(
            'I had forgotten my passport.',
            'Había olvidado el pasaporte.',
            ['es-habia-olvidado'],
            {
              id: 'es.ex.dsgmb9ka09v09j',
              acceptedAnswers: [
                'Había olvidado mi pasaporte.',
                'Yo había olvidado el pasaporte.',
                'Yo había olvidado mi pasaporte.',
                'Se me había olvidado el pasaporte.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Por qué no tomaste el tren de las ocho?',
            'Say that when you arrived, the train had already left (use «ya había salido»).',
            'Cuando llegué, el tren ya había salido.',
            [
              'Cuando llegué el tren ya había salido.',
              'Porque el tren ya había salido.',
              'Porque cuando llegué, el tren ya había salido.',
              'Cuando llegué a la estación, el tren ya había salido.',
              'El tren ya había salido.',
            ],
            ['es-habia-salido'],
            { id: 'es.ex.7kcjx6v3e8w5tf' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'En ese momento',
        objective: 'Put the events of a story in order with connectors.',
        intro: {
          explanation:
            'Connectors make a story easy to follow. Primero, luego and después put events in order; de repente (suddenly) and en ese momento (at that moment) introduce the key event; en cuanto (as soon as) + a past verb says that one thing happened right after another: en cuanto llegué, llamé. Por fin (at last) shows relief after waiting or trying: ¡Por fin llegó el autobús! Al final (in the end) says how things turned out: al final, todo salió bien. With de, al final de means at the end of: al final de la línea, al final de la calle.',
          examples: [
            {
              target: 'En cuanto llegué a casa, llamé a mi mamá.',
              base: 'As soon as I got home, I called my mom.',
            },
            { target: '¡Por fin llegó el autobús!', base: 'The bus finally arrived!' },
          ],
        },
        takeaways: [
          'You order a story with luego, de repente, en ese momento and en cuanto.',
          'You say how it ended with por fin (at last) and al final (in the end).',
        ],
        exercises: [
          ex.translationChoice(
            'por fin',
            'finally (at last)',
            ['in the end', 'at that moment', 'suddenly'],
            ['es-por-fin'],
            { id: 'es.ex.3i79xhpj0dr8t9' },
          ),
          ex.matchPairs(
            [
              ['en ese momento', 'at that moment'],
              ['por fin', 'finally (at last)'],
              ['al final', 'in the end'],
              ['en cuanto', 'as soon as'],
            ],
            ['es-en-ese-momento', 'es-por-fin', 'es-al-final', 'es-en-cuanto'],
            { id: 'es.ex.s06j1q65uax9up' },
          ),
          ex.fillBlank(
            '___ llegué a casa, llamé a mi mamá.',
            'As soon as I got home, I called my mom.',
            'En cuanto',
            ['Por fin', 'Al final', 'De repente'],
            ['es-en-cuanto'],
            {
              id: 'es.ex.qwc1uxcxcb6lnn',
              explanation:
                'The sentence has two verbs (llegué, llamé), so it needs a word that links them: en cuanto (as soon as). Por fin, al final and de repente go with a single event.',
            },
          ),
          ex.fillBlank(
            'Tomé el tren equivocado y llegué tarde, pero ___ todo salió bien.',
            'I took the wrong train and arrived late, but in the end everything turned out fine.',
            'al final',
            ['en cuanto', 'mientras', 'todavía'],
            ['es-al-final'],
            {
              id: 'es.ex.xlrm3zaxor38a8',
              explanation:
                'Al final (in the end) tells how the story turned out. En cuanto and mientras need another verb after them.',
            },
          ),
          ex.listenChoice(
            'Al final, todo salió bien.',
            ['Al final, todo salió mal.', 'Por fin, todo salió bien.', 'Al final, todo fue bien.'],
            ['es-al-final'],
            { id: 'es.ex.sn7wfpnii3c90n' },
          ),
          question(
            'es.ex.tc97tc1umg4aeq',
            METRO,
            'Why did Daniela miss her station?',
            'She fell asleep as soon as she sat down',
            [
              'The train didn’t stop there',
              'She was reading on her phone',
              'She took the wrong line',
            ],
            ['es-en-cuanto', 'es-habia-salido'],
            'Daniela says “En cuanto me senté, me dormí”, and when she woke up “el tren ya había salido de mi estación”.',
          ),
          question(
            'es.ex.2eyn66pzv2shwr',
            METRO,
            'What did Daniela realize on the train back?',
            'She had left her phone on the seat',
            ['She had lost her wallet', 'She was on the wrong train again', 'She had no ticket'],
            ['es-en-ese-momento', 'es-darse-cuenta'],
            'She says “En ese momento me di cuenta de que había olvidado el celular en el asiento”.',
          ),
          ex.orderWords(
            'En ese momento me di cuenta de que era muy tarde.',
            'At that moment I realized that it was very late.',
            ['es-en-ese-momento', 'es-darse-cuenta'],
            { id: 'es.ex.txelp2xl0j3thu' },
          ),
          ex.translateWrite(
            'In the end, everything turned out fine.',
            'Al final, todo salió bien.',
            ['es-al-final'],
            {
              id: 'es.ex.ohdyef39wghtlb',
              acceptedAnswers: ['Al final todo salió bien.', 'Al final, todo salió muy bien.'],
            },
          ),
          ex.shortAnswer(
            '¿Qué hiciste en cuanto llegaste a casa?',
            'Say that as soon as you got home, you called your mom (use «en cuanto»).',
            'En cuanto llegué a casa, llamé a mi mamá.',
            [
              'En cuanto llegué a casa llamé a mi mamá.',
              'En cuanto llegué, llamé a mi mamá.',
              'Llamé a mi mamá en cuanto llegué a casa.',
              'En cuanto llegué a casa, llamé a mi madre.',
            ],
            ['es-en-cuanto'],
            { id: 'es.ex.5rcqsq6oadcjeh' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Me equivoqué',
        objective: 'Talk about mistakes and embarrassing moments, and say who laughed.',
        intro: {
          explanation:
            'Equivocarse (to make a mistake, to be wrong) and reírse (to laugh) take a reflexive pronoun: me equivoqué, te equivocaste, se equivocó; me reí, te reíste, nos reímos. In the yo form, c becomes qu before e: equivoqué (like busqué). Equivocarse de + noun means to get the wrong one: me equivoqué de número, de autobús, de día. Reírse de means to laugh at or about something. The accent on the í of reí and reímos keeps the two vowels in separate syllables: re-Í-mos. Avergonzado (avergonzada for a woman) means embarrassed. Careful: embarazada means pregnant!',
          examples: [
            { target: 'Perdón, me equivoqué de número.', base: 'Sorry, I got the wrong number.' },
            {
              target: 'Estaba muy avergonzada, pero al final nos reímos mucho.',
              base: 'I was very embarrassed, but in the end we laughed a lot.',
            },
          ],
        },
        takeaways: [
          'You say you made a mistake with me equivoqué (de…).',
          'You say how you felt with avergonzado / avergonzada and who laughed with reírse.',
        ],
        exercises: [
          ex.translationChoice(
            'avergonzado',
            'embarrassed',
            ['pregnant', 'angry', 'bored'],
            ['es-avergonzado'],
            { id: 'es.ex.j1gpd8lghn6uin' },
          ),
          ex.translationChoice(
            'equivocarse',
            'to make a mistake',
            ['to get lost', 'to fall asleep', 'to complain'],
            ['es-equivocarse'],
            { id: 'es.ex.9m4wqseigqhm79' },
          ),
          ex.fillBlank(
            'Perdón, me ___ de número.',
            'Sorry, I got the wrong number.',
            'equivoqué',
            ['equivocó', 'equivocarse', 'equivocado'],
            ['es-equivocarse'],
            {
              id: 'es.ex.pmljuzrj7tordf',
              explanation:
                'With me (I), the preterite is equivoqué: c becomes qu before e. Equivocó is the él / ella form.',
            },
          ),
          ex.fillBlank(
            'Nos ___ mucho con la película.',
            'We laughed a lot at the movie.',
            'reímos',
            ['reí', 'reírse', 'reíste'],
            ['es-reirse'],
            {
              id: 'es.ex.7biniq0fpqlhdy',
              explanation:
                'Nos goes with nosotros: nos reímos. Reí is “I laughed” (me reí) and reíste is “you laughed” (te reíste).',
            },
          ),
          ex.listenChoice(
            'Me sentí muy avergonzada.',
            ['Me sentí muy cansada.', 'Me siento muy avergonzada.', 'Estaba muy avergonzada.'],
            ['es-avergonzado'],
            { id: 'es.ex.f24uiadblwmhh7' },
          ),
          question(
            'es.ex.cftcery4vkslzi',
            MENSAJE,
            'Who did Valeria think the young man was?',
            'Her neighbor Andrés',
            ['Her brother', 'A coworker', 'A famous actor'],
            ['es-equivocarse'],
            'Valeria writes “Pensé que era mi vecino Andrés”, and later “me di cuenta de que me había equivocado”.',
          ),
          question(
            'es.ex.8bqb2rqw8wg4j7',
            MENSAJE,
            'How did the story end?',
            'They both laughed about it',
            [
              'Valeria left the café quickly',
              'The young man got angry',
              'Andrés arrived at the café',
            ],
            ['es-reirse', 'es-al-final', 'es-avergonzado'],
            'She writes “él fue muy simpático y al final nos reímos mucho”.',
          ),
          ex.orderWords(
            'Al final nos reímos mucho de la historia.',
            'In the end, we laughed a lot about the story.',
            ['es-reirse', 'es-al-final'],
            { id: 'es.ex.8lc75efrjgwjmc' },
          ),
          ex.translateWrite(
            'I was very embarrassed.',
            'Estaba muy avergonzado.',
            ['es-avergonzado'],
            {
              id: 'es.ex.a1oca9b0ukw0wx',
              acceptedAnswers: [
                'Estaba muy avergonzada.',
                'Yo estaba muy avergonzado.',
                'Yo estaba muy avergonzada.',
                'Me sentí muy avergonzado.',
                'Me sentí muy avergonzada.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Por qué llegaste tarde a la fiesta?',
            'Say that you took the wrong bus (use «me equivoqué de autobús»).',
            'Me equivoqué de autobús.',
            [
              'Porque me equivoqué de autobús.',
              'Llegué tarde porque me equivoqué de autobús.',
              'Me equivoqué de camión.',
              'Porque me equivoqué de camión.',
            ],
            ['es-equivocarse'],
            { id: 'es.ex.f6ma3cgj20p6h4' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '¡Qué historia!',
        objective: 'Tell a complete anecdote and react to someone else’s story.',
        intro: {
          explanation:
            'A good anecdote has a scene (imperfect: hacía calor, estaba cansada), a series of events (preterite: llegué, me di cuenta), something that had happened before (había olvidado…) and an ending (al final…). When you listen to a story, show interest: ¿Y qué pasó después?, ¿Y entonces?, ¡No me digas! (No way! / You don’t say!), ¡Qué susto!, ¡Qué sorpresa! or ¡Qué vergüenza! (How embarrassing!). Exclamations go up and down with a lot of energy; the follow-up questions rise at the end.',
          examples: [
            {
              target: '¡No me digas! ¿Y qué pasó después?',
              base: 'No way! And what happened next?',
            },
            {
              target: '¡Qué vergüenza! Yo también me equivoqué una vez.',
              base: 'How embarrassing! I made a mistake like that once too.',
            },
          ],
        },
        takeaways: [
          'You tell a complete anecdote: scene, events, what had happened before and the ending.',
          'You react to someone’s story with ¡No me digas!, ¡Qué vergüenza! and ¿Y qué pasó después?',
        ],
        exercises: [
          question(
            'es.ex.8oyye88vum75hj',
            METRO,
            'How did Daniela’s story end?',
            'A woman found her phone and gave it back to her',
            [
              'Daniela bought a new phone',
              'The police found the phone',
              'Rodrigo went to look for the phone',
            ],
            ['es-al-final', 'es-la-sorpresa'],
            'Daniela says “Al final, una señora lo encontró y me lo devolvió en la estación”.',
          ),
          question(
            'es.ex.nmaf78nzvzdrth',
            SUSTO,
            'What does Patricia say at the end of her story?',
            'She had left the window open herself',
            [
              'Her husband had left the window open',
              'The cat was hers',
              'She had called the police',
            ],
            ['es-el-susto', 'es-me-paso'],
            'Patricia explains that the cat came in through the window: “¡Yo la había dejado abierta!”.',
          ),
          question(
            'es.ex.4a9labmmaw0ldp',
            BODA,
            'What had Mariana’s brother forgotten?',
            'The rings, at the hotel',
            ['His suit, at home', 'The car keys', 'The flowers, at the church'],
            ['es-habia-olvidado', 'es-darse-cuenta'],
            'Mariana writes “mi hermano se dio cuenta de que había olvidado los anillos en el hotel”.',
          ),
          question(
            'es.ex.x73z169ewb2p52',
            BODA,
            'When did her brother come back with the rings?',
            'An hour later',
            ['Ten minutes later', 'The next day', 'He never came back'],
            ['es-por-fin'],
            'She writes “por fin, volvió con los anillos una hora después”.',
          ),
          question(
            'es.ex.p2gmi8e1ngfnv3',
            BODA,
            'What does the family do with this story now?',
            'They tell it at every family party and laugh',
            [
              'They never talk about it',
              'Her brother doesn’t want to hear it',
              'They think it was a terrible day',
            ],
            ['es-contar', 'es-reirse', 'es-la-historia'],
            'Mariana writes “en cada fiesta de la familia, contamos la historia de los anillos y nos reímos mucho”.',
          ),
          ex.listenChoice(
            '¡No me digas! ¿Y qué pasó después?',
            [
              '¡No me digas! ¿Y qué pasó antes?',
              '¡No me digas! ¿Y quién llegó después?',
              '¡No me digas! ¿Y qué hiciste después?',
            ],
            ['es-me-paso'],
            { id: 'es.ex.j4b34p1emfm6mb' },
          ),
          ex.fillBlank(
            'Cuando llegamos a la iglesia, mi hermano se dio cuenta de que ___ olvidado los anillos.',
            'When we got to the church, my brother realized he had forgotten the rings.',
            'había',
            ['habían', 'ha', 'hay'],
            ['es-habia-olvidado', 'es-darse-cuenta'],
            {
              id: 'es.ex.38d1d9yyob0iht',
              explanation:
                'The subject is mi hermano (he), so había, not habían. The forgetting happened before he realized it, so it goes in the pluperfect.',
            },
          ),
          ex.matchPairs(
            [
              ['¡Qué susto!', 'What a scare!'],
              ['¡Qué sorpresa!', 'What a surprise!'],
              ['¡Qué vergüenza!', 'How embarrassing!'],
              ['¡No me digas!', 'No way!'],
            ],
            ['es-el-susto', 'es-la-sorpresa'],
            { id: 'es.ex.b6q5yb1mup1rio' },
          ),
          ex.translateWrite(
            'When I got to the station, the train had already left.',
            'Cuando llegué a la estación, el tren ya había salido.',
            ['es-habia-salido'],
            {
              id: 'es.ex.r1e07xy07e1aoz',
              acceptedAnswers: [
                'Cuando llegué a la estación el tren ya había salido.',
                'El tren ya había salido cuando llegué a la estación.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Y qué pasó al final?',
            'Say that in the end you all laughed a lot (use «al final» and «reírse»).',
            'Al final, nos reímos mucho.',
            [
              'Al final nos reímos mucho.',
              'Al final, todos nos reímos mucho.',
              'Al final todos nos reímos mucho.',
              'Al final, nos reímos mucho de la historia.',
            ],
            ['es-al-final', 'es-reirse'],
            { id: 'es.ex.iqvrdubg51g1hv' },
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

/** Participios para el pluscuamperfecto (había + participio). */
const PARTICIPIOS =
  'olvidado|salido|dejado|hecho|visto|dicho|escrito|vuelto|puesto|abierto|roto|perdido|llegado|terminado|empezado|cerrado|comprado|ido|estado|sido|conocido|probado|equivocado|entrado|tomado|comido|llamado|pasado|encontrado|subido|bajado';

/** Tareas de escritura de la unidad (docs/ES_B1.md). */
export const ES_B1_U03_WRITING: readonly WritingTaskDef[] = [
  {
    ...base,
    id: 'es.b1.wt.anecdota',
    kind: 'guided',
    codes: [],
    lesson: 'es-b1-u03-l05',
    title: 'A funny anecdote',
    instructions:
      'Tell a funny or surprising anecdote (real or invented): set the scene with the imperfect, tell the events with the preterite, say what had already happened with había + participle and link the story with connectors. End with how it turned out.',
    prompts: ['¿Qué te pasó?', '¿Qué había pasado antes?', '¿Qué pasó al final?'],
    requirements: [
      {
        id: 'pluperfect',
        label: 'You use the pluperfect: había + participle (había olvidado, ya había salido…)',
        kind: 'pattern',
        patterns: [['había|habías|habíamos|habían', PARTICIPIOS]],
      },
      {
        id: 'connector',
        label:
          'You use a story connector (en ese momento, en cuanto, por fin, al final, de repente…)',
        kind: 'pattern',
        patterns: [
          ['en', 'ese', 'momento'],
          ['en', 'cuanto'],
          ['por', 'fin'],
          ['al', 'final'],
          ['de', 'repente'],
        ],
      },
      {
        id: 'pronominal',
        label: 'You use a story verb with a pronoun (me di cuenta, me equivoqué, nos reímos…)',
        kind: 'pattern',
        patterns: [
          ['di|dio|diste|dimos|dieron', 'cuenta'],
          ['equivoqué|equivocó|equivocaste|equivocamos|equivocaron|equivocado'],
          ['reí|reímos|rio|rió|reíste|rieron'],
        ],
      },
      ...common(5),
    ],
    model:
      'Hace dos años fui a Bogotá para una entrevista de trabajo. Era muy temprano y yo estaba cansada. En cuanto llegué a la oficina, me di cuenta de que había olvidado el currículum en el hotel. ¡Qué susto! Entonces le dije todo a la señora de la entrevista. Por suerte, ella fue muy simpática y nos reímos mucho. Al final, la entrevista salió muy bien.',
    checklist: [
      'The scene goes in the imperfect (era, estaba) and the events in the preterite (llegué, dije).',
      'I use había + participle for something that had happened before (había olvidado).',
      'I link the story with connectors (en cuanto, entonces, al final).',
    ],
  },
];
