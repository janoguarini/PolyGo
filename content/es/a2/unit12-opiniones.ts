import type { EsUnitDef } from '../../es-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Español A2 U12 «Opinions and solutions» (docs/ES_A1_A2.md): opinar (creo que, me parece que, para
 * mí, [no] estoy de acuerdo, tenés razón), aconsejar y proponer con el condicional (deberías,
 * podríamos), la condición con si + presente (si llueve, vamos al cine), los conectores sin embargo,
 * por eso y porque, por y para (finalidad y destinatario / causa y medio), el estilo indirecto (dice
 * que…, me dijo que…) y ojalá (que) + subjuntivo como expresión fija (ojalá que no llueva).
 * Vocabulario rioplatense: la plata (el dinero), che (informal).
 * Pronunciación: la entonación de la opinión (descendente) y del desacuerdo cortés (suavizado).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const PRESTAMO = dialogue(
  'es.stim.a2-u12-prestamo',
  'Martín tells his friend Lucía about a problem with money.',
  [
    [
      'Martín',
      'Che, Lucía, tengo un problema. Le presté plata a Diego hace un mes y todavía no me la devolvió.',
    ],
    ['Lucía', '¿Y qué dice él?'],
    ['Martín', 'Me dijo que no tiene trabajo. Por eso no puede.'],
    [
      'Lucía',
      'Para mí, deberías hablar con él. Podríamos invitarlo a comer y buscar una solución.',
    ],
    ['Martín', 'Tenés razón. Lo llamo esta noche.'],
  ],
);

const BARRIO = reading(
  'es.stim.a2-u12-barrio',
  'post',
  'Sofía writes in her neighborhood’s online group.',
  [
    '¡Hola, vecinos!',
    'El sábado es la fiesta del barrio en la plaza.',
    'Sin embargo, el pronóstico dice que va a llover.',
    'Me parece que podríamos hacer la fiesta en el club.',
    'Si llueve, vamos al club; si no, a la plaza.',
    '¿Están de acuerdo?',
    '¡Ojalá que no llueva!',
  ],
  { from: 'Sofía' },
);

export const ES_A2_U12: EsUnitDef = {
  names: ['Martín', 'Lucía', 'Diego', 'Sofía', 'Ana', 'Juan'],
  support: [
    'llover',
    'llueva',
    'devuelvo',
    'devolvió',
    'presté',
    'che',
    'invitarlo',
    'buscar',
    'razón',
    'pronóstico',
    'club',
    'teléfono',
    'debería',
    'hacemos',
  ],
  unit: {
    position: 12,
    title: 'Opinions and solutions',
    titleEn: 'Opiniones',
    description:
      'Give your opinion and agree or disagree, give advice with deberías and podríamos, talk about conditions with si llueve, link ideas with sin embargo and por eso, use por and para, and report what people say.',
    emoji: '💬',
    objective:
      'You can say what you think, agree or disagree politely, suggest solutions to a problem, say what you will do if something happens and report what someone said.',
    grammar: {
      title: 'Opinions · deberías, podríamos · si + present · por and para',
      explanation:
        'To give an opinion: creo que, me parece que or para mí + a sentence. To agree: estoy de acuerdo (with estar) or tenés razón; to disagree: no estoy de acuerdo. For advice and suggestions, use the conditional, which ends in -ía: deberías + infinitive (you should), podríamos + infinitive (we could). For a real condition, use si (without an accent: if) + present, and the present or ir a in the other half: si llueve, vamos al cine. Connectors: porque (because), por eso (that’s why), sin embargo (however). Para expresses purpose, destination or who something is for (para aprender, para vos); por expresses a cause or a means (por la lluvia, por teléfono). To report: dice que…, me dijo que… Ojalá (que) is followed by a special verb form, the subjunctive; for now, learn it as a fixed expression: ¡ojalá que no llueva! In Argentina money is usually la plata.',
      examples: [
        {
          target: 'Para mí, deberías hablar con él.',
          base: 'In my opinion, you should talk to him.',
        },
        {
          target: 'Si llueve, podríamos ir al cine.',
          base: 'If it rains, we could go to the cinema.',
        },
        { target: 'Me dijo que no tiene plata.', base: 'He told me that he has no money.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U12). Sin revisión nativa: revisar «ojalá que» + subjuntivo presentado como expresión fija (también «ojalá llueva» sin que), «che» como informal, «la plata» frente a «el dinero», «me dijo que no tiene trabajo» (concordancia de tiempos: también «no tenía») y «para mí» traducido como «in my opinion». La entonación se explica sin transcripciones.',
    },
    words: [
      w(
        'es-creo-que',
        'creo que',
        'I think that',
        'Creo que va a llover.',
        'I think it’s going to rain.',
        ['opinions'],
        { acceptedTranslations: ['I believe'] },
      ),
      w(
        'es-me-parece-que',
        'me parece que',
        'it seems to me that',
        'Me parece que es muy caro.',
        'It seems to me that it’s very expensive.',
        ['opinions'],
      ),
      w(
        'es-estoy-de-acuerdo',
        'estoy de acuerdo',
        'I agree',
        'Estoy de acuerdo con vos.',
        'I agree with you.',
        ['opinions'],
        { emoji: '🤝' },
      ),
      w(
        'es-para-mi',
        'para mí',
        'in my opinion',
        'Para mí, el mate es mejor que el café.',
        'In my opinion, mate is better than coffee.',
        ['opinions'],
        { acceptedTranslations: ['for me'] },
      ),
      w(
        'es-deberias',
        'deberías',
        'you should',
        'Deberías llamar a tu mamá.',
        'You should call your mom.',
        ['advice'],
      ),
      w(
        'es-podriamos',
        'podríamos',
        'we could',
        'Podríamos ir al cine.',
        'We could go to the cinema.',
        ['advice'],
      ),
      w(
        'es-si-llueve',
        'si llueve',
        'if it rains',
        'Si llueve, nos quedamos en casa.',
        'If it rains, we’ll stay at home.',
        ['conditions'],
        { emoji: '☔' },
      ),
      w(
        'es-sin-embargo',
        'sin embargo',
        'however',
        'Es caro. Sin embargo, me gusta.',
        'It’s expensive. However, I like it.',
        ['connectors'],
      ),
      w(
        'es-por-eso',
        'por eso',
        "that's why",
        'Estoy enfermo, por eso no voy a la facultad.',
        'I’m sick, that’s why I’m not going to college.',
        ['connectors'],
        { acceptedTranslations: ['so'] },
      ),
      w(
        'es-el-problema',
        'el problema',
        'the problem',
        'El problema es la plata.',
        'The problem is money.',
        ['problems'],
      ),
      w(
        'es-la-solucion',
        'la solución',
        'the solution',
        '¿Cuál es la solución?',
        'What is the solution?',
        ['problems'],
        { emoji: '💡' },
      ),
      w(
        'es-devolver',
        'devolver',
        'to give back',
        'Mañana te devuelvo el libro.',
        'I’ll give you back the book tomorrow.',
        ['verbs'],
        { acceptedTranslations: ['to return (something)'] },
      ),
      w(
        'es-la-plata',
        'la plata',
        'money',
        'No tengo plata para el viaje.',
        'I don’t have money for the trip.',
        ['money', 'argentina'],
        { acceptedTranslations: ['the money'], emoji: '💵' },
      ),
      w(
        'es-dice-que',
        'dice que',
        'he says that',
        'Ana dice que hace frío.',
        'Ana says that it’s cold.',
        ['reported'],
        { acceptedTranslations: ['she says that'] },
      ),
      w(
        'es-me-dijo-que',
        'me dijo que',
        'he told me that',
        'Juan me dijo que está enfermo.',
        'Juan told me that he’s sick.',
        ['reported'],
        { acceptedTranslations: ['she told me that'] },
      ),
      w(
        'es-ojala',
        'ojalá',
        'hopefully',
        '¡Ojalá que no llueva!',
        'Hopefully it won’t rain!',
        ['subjunctive'],
        { acceptedTranslations: ['I hope so'] },
      ),
      w(
        'es-para',
        'para',
        'for (a purpose)',
        'Estudio español para viajar.',
        'I study Spanish in order to travel.',
        ['prepositions'],
        { acceptedTranslations: ['in order to'] },
      ),
      w(
        'es-por',
        'por',
        'because of',
        'No fui a la playa por la lluvia.',
        'I didn’t go to the beach because of the rain.',
        ['prepositions'],
        { acceptedTranslations: ['through', 'by'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Creo que, para mí',
        objective: 'Give your opinion and say whether you agree.',
        intro: {
          explanation:
            'To give your opinion, start with creo que (I think that), me parece que (it seems to me that) or para mí (in my opinion), followed by a normal sentence. Para mí has an accent on mí (me), which tells it apart from mi (my). To agree: estoy de acuerdo, literally “I am in agreement”, with estar (not a verb like in English), or tenés razón (you’re right). To disagree: no estoy de acuerdo. An opinion is said with a falling tone at the end, like a statement; to disagree politely, Argentinians slow down and soften it first: Mmm… para mí, no.',
          examples: [
            {
              target: 'Creo que el colectivo es mejor que el subte.',
              base: 'I think the bus is better than the subway.',
            },
            {
              target: '¿Estás de acuerdo? — Sí, tenés razón.',
              base: 'Do you agree? — Yes, you’re right.',
            },
          ],
        },
        takeaways: [
          'You give your opinion with creo que, me parece que and para mí.',
          'You agree with estoy de acuerdo or tenés razón, and disagree with no estoy de acuerdo.',
        ],
        exercises: [
          ex.translationChoice(
            'creo que',
            'I think that',
            ['I agree', 'it seems to me that', 'hopefully'],
            ['es-creo-que'],
            { id: 'es.ex.6vhadci28r15fu' },
          ),
          ex.translationChoice(
            'estoy de acuerdo',
            'I agree',
            ['I think that', 'I’m free', 'I’m sorry'],
            ['es-estoy-de-acuerdo'],
            { id: 'es.ex.wya0yf226esfl2' },
          ),
          ex.matchPairs(
            [
              ['creo que', 'I think that'],
              ['me parece que', 'it seems to me that'],
              ['para mí', 'in my opinion'],
              ['estoy de acuerdo', 'I agree'],
            ],
            ['es-creo-que', 'es-me-parece-que', 'es-para-mi', 'es-estoy-de-acuerdo'],
            { id: 'es.ex.e613hah9kpf1lv' },
          ),
          ex.fillBlank(
            'Me ___ que es muy caro.',
            'It seems to me that it’s very expensive.',
            'parece',
            ['gusta', 'creo', 'llamo'],
            ['es-me-parece-que'],
            {
              id: 'es.ex.k0d1wmp2iwev6b',
              explanation:
                'Me parece que works like me gusta: the verb is parece and me shows who has the opinion.',
            },
          ),
          ex.listenChoice(
            'Para mí, no.',
            ['Para mí, sí.', 'Para vos, no.', 'Para mí, también.'],
            ['es-para-mi'],
            { id: 'es.ex.g5exut2j9cazue' },
          ),
          ex.fillBlank(
            'No estoy de ___ con vos.',
            'I don’t agree with you.',
            'acuerdo',
            ['razón', 'bien', 'gusto'],
            ['es-estoy-de-acuerdo'],
            {
              id: 'es.ex.8lf4f93tnkr9iw',
              explanation:
                'To agree is estar de acuerdo (con alguien). Razón goes with tener: tenés razón (you’re right).',
            },
          ),
          ex.fillBlank(
            '___ que va a llover.',
            'I think it’s going to rain.',
            'Creo',
            ['Tengo', 'Estoy', 'Soy'],
            ['es-creo-que'],
            {
              id: 'es.ex.d1k3etotj1a5nt',
              explanation:
                'Creo que + sentence: I think that… In Spanish the que is never dropped.',
            },
          ),
          ex.orderWords('Estoy de acuerdo con vos.', 'I agree with you.', ['es-estoy-de-acuerdo'], {
            id: 'es.ex.jl7qghf7g3r0kz',
          }),
          ex.translateWrite(
            'In my opinion, mate is better than coffee.',
            'Para mí, el mate es mejor que el café.',
            ['es-para-mi'],
            {
              id: 'es.ex.c3cotcd6f1k9hk',
              acceptedAnswers: [
                'Para mí el mate es mejor que el café.',
                'Creo que el mate es mejor que el café.',
              ],
            },
          ),
          ex.shortAnswer(
            'El subte es mejor que el colectivo. ¿Estás de acuerdo?',
            'Say you agree (use «estoy de acuerdo»).',
            'Sí, estoy de acuerdo.',
            [
              'Estoy de acuerdo.',
              'Sí, estoy de acuerdo con vos.',
              'Sí, tenés razón, estoy de acuerdo.',
              'Sí, estoy de acuerdo',
            ],
            ['es-estoy-de-acuerdo'],
            { id: 'es.ex.oi3ie8zn78gkk3' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Deberías, podríamos',
        objective: 'Give advice and suggest solutions to a problem.',
        intro: {
          explanation:
            'For advice, use deberías + infinitive (you should); for a suggestion that includes you, podríamos + infinitive (we could). Both are in the conditional, which ends in -ía: debería (I should), deberías, podríamos. The accent on the í means the i is a separate, stressed syllable: de-be-RÍ-as, po-DRÍ-a-mos. Watch out: el problema is masculine even though it ends in -a, like el día. La solución is feminine.',
          examples: [
            { target: 'Deberías llamar a tu mamá.', base: 'You should call your mom.' },
            { target: 'Podríamos ir al cine.', base: 'We could go to the cinema.' },
          ],
        },
        takeaways: [
          'You give advice with deberías and make suggestions with podríamos.',
          'You talk about el problema and la solución.',
        ],
        exercises: [
          ex.translationChoice(
            'deberías',
            'you should',
            ['we could', 'I would like to', 'you have to'],
            ['es-deberias'],
            { id: 'es.ex.w2ax09wa68zik6' },
          ),
          ex.translationChoice(
            'la solución',
            'the solution',
            ['the problem', 'the plan', 'the question'],
            ['es-la-solucion'],
            { id: 'es.ex.7f2jlupvwwtmjq' },
          ),
          ex.fillBlank(
            '___ problema es grande.',
            'The problem is big.',
            'El',
            ['La', 'Los'],
            ['es-el-problema'],
            {
              id: 'es.ex.fur1jt9tq041hq',
              skill: 'grammar',
              explanation: 'Problema ends in -a but is masculine: el problema, like el día.',
            },
          ),
          ex.fillBlank(
            'Estás muy cansado: ___ descansar.',
            'You’re very tired: you should rest.',
            'deberías',
            ['podríamos', 'debería', 'quiero'],
            ['es-deberias'],
            {
              id: 'es.ex.x86tvki2yi9h3l',
              explanation:
                'Advice to vos: deberías + infinitive. Debería is “I should” and podríamos is “we could”.',
            },
          ),
          ex.listenChoice(
            'Podríamos ir al cine.',
            ['Podríamos ir a la playa.', 'Deberías ir al cine.', 'Vamos al cine.'],
            ['es-podriamos'],
            { id: 'es.ex.jkzsle5xuyu2u1' },
          ),
          ex.matchPairs(
            [
              ['deberías', 'you should'],
              ['podríamos', 'we could'],
              ['el problema', 'the problem'],
              ['la solución', 'the solution'],
            ],
            ['es-deberias', 'es-podriamos', 'es-el-problema', 'es-la-solucion'],
            { id: 'es.ex.xv54i00wly1ijp' },
          ),
          ex.fillBlank(
            '¿Cuál es la ___? — Podríamos tomar el subte.',
            'What’s the solution? — We could take the subway.',
            'solución',
            ['problema', 'cuenta', 'hora'],
            ['es-la-solucion', 'es-podriamos'],
            {
              id: 'es.ex.pbvrmie4iogq20',
              explanation:
                'The answer proposes a solution: la solución. Problema is masculine (el problema), so “la problema” is wrong.',
            },
          ),
          ex.orderWords(
            'Deberías llamar a tu mamá.',
            'You should call your mom.',
            ['es-deberias'],
            {
              id: 'es.ex.16wvpmmuyun4ti',
            },
          ),
          ex.translateWrite(
            'We could go to the cinema.',
            'Podríamos ir al cine.',
            ['es-podriamos'],
            {
              id: 'es.ex.fv4a3d3by42mdu',
            },
          ),
          ex.shortAnswer(
            'Me duele la cabeza.',
            'Give advice with «deberías» (e.g. to rest: descansar).',
            'Deberías descansar.',
            [
              'Deberías descansar un poco.',
              'Deberías tomar un remedio.',
              'Deberías ir al médico.',
              'Deberías dormir.',
              'Deberías descansar',
            ],
            ['es-deberias'],
            { id: 'es.ex.cxek7r8rhbgei4' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Si llueve…',
        objective: 'Talk about conditions, link ideas and say what you hope.',
        intro: {
          explanation:
            'For a real condition, use si (if, without an accent; sí with an accent is yes) + present, and the present or ir a in the other half: si llueve, nos quedamos en casa. To link ideas: porque (because), por eso (that’s why) and sin embargo (however), which is a bit more formal than pero. Dice que + sentence reports what someone says. Ojalá (hopefully, I hope) comes from Arabic; it is followed by a special verb form, so learn it as a block: ¡ojalá que no llueva!',
          examples: [
            {
              target: 'Si llueve, nos quedamos en casa.',
              base: 'If it rains, we’ll stay at home.',
            },
            { target: '¡Ojalá que no llueva!', base: 'Hopefully it won’t rain!' },
          ],
        },
        takeaways: [
          'You make conditions with si + present: si llueve, vamos al cine.',
          'You link ideas with por eso and sin embargo, and hope with ojalá.',
        ],
        exercises: [
          ex.translationChoice(
            'sin embargo',
            'however',
            ["that's why", 'because', 'hopefully'],
            ['es-sin-embargo'],
            { id: 'es.ex.pbq31ce39uktjl' },
          ),
          ex.translationChoice(
            'ojalá',
            'hopefully',
            ['however', 'in my opinion', 'of course'],
            ['es-ojala'],
            { id: 'es.ex.5r5gmusjsuu2ux' },
          ),
          ex.fillBlank(
            '___ llueve, vamos al cine.',
            'If it rains, we’ll go to the cinema.',
            'Si',
            ['Por', 'Que', 'Para'],
            ['es-si-llueve'],
            {
              id: 'es.ex.ts6hvo4i7ecgyp',
              skill: 'grammar',
              explanation:
                'If is si, without an accent (sí with an accent means yes). After si, use the present: si llueve.',
            },
          ),
          ex.fillBlank(
            'Estoy cansado, ___ no voy a la fiesta.',
            'I’m tired, that’s why I’m not going to the party.',
            'por eso',
            ['sin embargo', 'porque', 'ojalá'],
            ['es-por-eso', 'es-sin-embargo'],
            {
              id: 'es.ex.xu5xs3ugdcgq5u',
              explanation:
                'Por eso introduces the result (that’s why). Porque introduces the cause, and sin embargo a contrast.',
            },
          ),
          ex.listenChoice(
            'Si llueve, nos quedamos en casa.',
            [
              'Si llueve, vamos al cine.',
              'Si nieva, nos quedamos en casa.',
              'Hoy llueve, nos quedamos en casa.',
            ],
            ['es-si-llueve'],
            { id: 'es.ex.gbz0jpi9j5ip46' },
          ),
          ex.fillBlank(
            'Ana ___ que hace frío.',
            'Ana says that it’s cold.',
            'dice',
            ['es', 'tiene', 'va'],
            ['es-dice-que'],
            {
              id: 'es.ex.ekxjqoe5hdqbrb',
              explanation: 'Dice que + sentence reports what someone says: Ana dice que…',
            },
          ),
          question(
            'es.ex.08r7k1671v9o76',
            BARRIO,
            'What is the problem with the neighborhood party?',
            'The forecast says it’s going to rain',
            ['The square is closed', 'Nobody can come', 'It is too expensive'],
            ['es-sin-embargo', 'es-dice-que'],
            'Sofía writes “Sin embargo, el pronóstico dice que va a llover”.',
          ),
          question(
            'es.ex.mw62xf1zfib653',
            BARRIO,
            'What does Sofía suggest?',
            'Having the party at the club',
            ['Cancelling the party', 'Moving it to Sunday', 'Going to the cinema'],
            ['es-me-parece-que', 'es-podriamos'],
            'She writes “Me parece que podríamos hacer la fiesta en el club”.',
          ),
          ex.translateWrite(
            'If it rains, we’ll stay at home.',
            'Si llueve, nos quedamos en casa.',
            ['es-si-llueve'],
            {
              id: 'es.ex.2kz0rt8dn5tq80',
              acceptedAnswers: [
                'Si llueve nos quedamos en casa.',
                'Si llueve, nos vamos a quedar en casa.',
              ],
            },
          ),
          ex.translateWrite(
            'It’s expensive. However, I like it.',
            'Es caro. Sin embargo, me gusta.',
            ['es-sin-embargo'],
            {
              id: 'es.ex.2ceii0mfkdzsv5',
              acceptedAnswers: [
                'Es cara. Sin embargo, me gusta.',
                'Es caro, sin embargo me gusta.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Por y para · la plata',
        objective: 'Use por and para, talk about money and report what someone told you.',
        intro: {
          explanation:
            'Para looks ahead: purpose (estudio para aprender), destination or the person something is for (es para vos). Por looks back to a cause or shows the means: por la lluvia (because of the rain), por teléfono (by phone), por mensaje. In Argentina money is la plata (literally silver); el dinero is the general word. Devolver (to give back) changes o to ue: devuelvo, devolvés. Me dijo que reports what someone told you: me dijo que no tiene plata.',
          examples: [
            { target: 'Estudio español para viajar.', base: 'I study Spanish in order to travel.' },
            { target: 'Me dijo que no tiene plata.', base: 'He told me that he has no money.' },
          ],
        },
        takeaways: [
          'You use para for purpose and recipients, and por for causes and means.',
          'You report what someone said with dice que and me dijo que.',
        ],
        exercises: [
          ex.translationChoice(
            'la plata',
            'money',
            ['the bill', 'the tip', 'the wallet'],
            ['es-la-plata'],
            { id: 'es.ex.o7lhwzblbsrf6k' },
          ),
          ex.translationChoice(
            'devolver',
            'to give back',
            ['to lose', 'to send', 'to receive'],
            ['es-devolver'],
            { id: 'es.ex.8fef10cunf02v4' },
          ),
          ex.fillBlank(
            'Estudio español ___ viajar.',
            'I study Spanish in order to travel.',
            'para',
            ['por', 'de', 'con'],
            ['es-para'],
            {
              id: 'es.ex.zuaggn1syug5as',
              skill: 'grammar',
              explanation: 'Purpose (in order to) is para + infinitive: para viajar.',
            },
          ),
          ex.fillBlank(
            'No fui a la playa ___ la lluvia.',
            'I didn’t go to the beach because of the rain.',
            'por',
            ['para', 'con', 'en'],
            ['es-por'],
            {
              id: 'es.ex.r9iyy3s792ttg2',
              skill: 'grammar',
              explanation: 'A cause (because of) is por: por la lluvia.',
            },
          ),
          ex.listenChoice(
            'Me dijo que no tiene plata.',
            [
              'Me dijo que no tiene tiempo.',
              'Dice que no tiene plata.',
              'Me dijo que tiene plata.',
            ],
            ['es-me-dijo-que', 'es-la-plata'],
            { id: 'es.ex.l6rcdrncr0tk0i' },
          ),
          ex.fillBlank(
            'Mañana te ___ el libro.',
            'I’ll give you back the book tomorrow.',
            'devuelvo',
            ['devolver', 'devolvió', 'recibí'],
            ['es-devolver'],
            {
              id: 'es.ex.rslwg115gt1yir',
              explanation:
                'Devolver changes o to ue in the yo form: devuelvo. Devolvió is “he gave back”.',
            },
          ),
          question(
            'es.ex.1qdbhmjt2e9dji',
            PRESTAMO,
            'What is Martín’s problem?',
            'Diego hasn’t given back the money Martín lent him',
            ['Diego stole his wallet', 'Martín lost his job', 'Martín has no money for a trip'],
            ['es-el-problema', 'es-devolver', 'es-la-plata'],
            'Martín says “Le presté plata a Diego hace un mes y todavía no me la devolvió”.',
          ),
          question(
            'es.ex.52zs85iv3r9lm6',
            PRESTAMO,
            'Why can’t Diego pay the money back?',
            'He doesn’t have a job',
            ['He is sick', 'He is travelling', 'He forgot'],
            ['es-me-dijo-que', 'es-por-eso'],
            'Martín says “Me dijo que no tiene trabajo. Por eso no puede”.',
          ),
          ex.translateWrite('This is for you.', 'Esto es para vos.', ['es-para'], {
            id: 'es.ex.24vvq43lwwjr37',
            acceptedAnswers: ['Esto es para usted.', 'Es para vos.', 'Es para usted.'],
          }),
          ex.translateWrite(
            'She told me that she’s sick.',
            'Me dijo que está enferma.',
            ['es-me-dijo-que'],
            {
              id: 'es.ex.y9474xvihktk58',
              acceptedAnswers: ['Ella me dijo que está enferma.', 'Me dijo que estaba enferma.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '¿Qué hacemos?',
        objective: 'Discuss a problem, disagree politely and agree on a solution.',
        intro: {
          explanation:
            'When friends discuss a problem, they combine everything: an opinion (para mí…), advice (deberías…), a suggestion (podríamos…) and a condition (si llueve…). Questions rise at the end and statements fall. A polite disagreement usually starts softly and more slowly, with tenés razón, pero… or no sé, para mí… Che is an informal way to get a friend’s attention in Argentina.',
          examples: [
            {
              target: 'Tenés razón, pero creo que es caro.',
              base: 'You’re right, but I think it’s expensive.',
            },
            {
              target: 'Me parece que podríamos llamarlo por teléfono.',
              base: 'I think we could call him on the phone.',
            },
          ],
        },
        takeaways: [
          'You discuss a problem and propose a solution.',
          'You disagree politely by softening your opinion.',
        ],
        exercises: [
          question(
            'es.ex.63alhtcu8gpjia',
            PRESTAMO,
            'What does Lucía suggest?',
            'Talking to Diego and inviting him to eat',
            ['Calling the police', 'Forgetting about the money', 'Lending Diego more money'],
            ['es-deberias', 'es-podriamos', 'es-la-solucion'],
            'Lucía says “deberías hablar con él. Podríamos invitarlo a comer y buscar una solución”.',
          ),
          question(
            'es.ex.pl7e18nt9uwdwd',
            PRESTAMO,
            'How does Martín react to Lucía’s advice?',
            'He agrees and will call Diego tonight',
            [
              'He disagrees with her',
              'He will write Diego an email',
              'He will talk to Diego next week',
            ],
            ['es-estoy-de-acuerdo'],
            'Martín answers “Tenés razón. Lo llamo esta noche”.',
          ),
          question(
            'es.ex.ds20dgxntlobix',
            BARRIO,
            'Where will the party be if it doesn’t rain?',
            'In the square',
            ['At the club', 'At Sofía’s house', 'At the cinema'],
            ['es-si-llueve'],
            'Sofía writes “Si llueve, vamos al club; si no, a la plaza”.',
          ),
          question(
            'es.ex.yhhsa0b3732377',
            BARRIO,
            'What does Sofía hope at the end of her post?',
            'That it won’t rain',
            [
              'That everyone goes to the club',
              'That it rains a lot',
              'That the party is on Sunday',
            ],
            ['es-ojala'],
            'She ends with “¡Ojalá que no llueva!”: hopefully it won’t rain.',
          ),
          ex.listenChoice(
            'No estoy de acuerdo.',
            ['Estoy de acuerdo.', 'Tenés razón.', 'No estoy libre.'],
            ['es-estoy-de-acuerdo'],
            { id: 'es.ex.p89cf93igpeecd' },
          ),
          ex.matchPairs(
            [
              ['por eso', "that's why"],
              ['sin embargo', 'however'],
              ['para', 'for (a purpose)'],
              ['por', 'because of'],
            ],
            ['es-por-eso', 'es-sin-embargo', 'es-para', 'es-por'],
            { id: 'es.ex.ivv19lbedub899' },
          ),
          ex.fillBlank(
            'Lo llamo ___ teléfono.',
            'I’ll call him on the phone.',
            'por',
            ['para', 'con', 'de'],
            ['es-por'],
            {
              id: 'es.ex.zfwm1kboa14xhn',
              skill: 'grammar',
              explanation: 'The means of communication takes por: por teléfono, por mensaje.',
            },
          ),
          ex.translateWrite(
            'In my opinion, you should give back the money.',
            'Para mí, deberías devolver la plata.',
            ['es-para-mi', 'es-deberias', 'es-devolver', 'es-la-plata'],
            {
              id: 'es.ex.vqp93xqofoq54k',
              acceptedAnswers: [
                'Para mí deberías devolver la plata.',
                'Creo que deberías devolver la plata.',
                'Para mí, deberías devolver el dinero.',
              ],
            },
          ),
          ex.shortAnswer(
            'Va a llover el sábado. ¿Qué hacemos?',
            'Suggest going to the cinema if it rains (use «si llueve» and «podríamos»).',
            'Si llueve, podríamos ir al cine.',
            [
              'Si llueve podríamos ir al cine.',
              'Podríamos ir al cine si llueve.',
              'Si llueve, podríamos ir al cine el sábado.',
            ],
            ['es-si-llueve', 'es-podriamos'],
            { id: 'es.ex.43gn3mfinm3p4i' },
          ),
        ],
      },
    ],
  },
};
