import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';

/**
 * Producción escrita de inglés B2 sin IA (docs/B2_EN.md), con el mismo sistema que A1, A2 y B1
 * (shared/writing.ts): se comprueba en el dispositivo y el texto no se envía ni se guarda. Práctica
 * opcional al terminar la lección; no bloquea ni cuenta para el progreso.
 *
 * - `guided` (12): correos formales y profesionales, un informe breve, opiniones, un reclamo, una
 *   disculpa, una noticia contada con verbos de reporte, una reflexión, una argumentación, un relato y
 *   una recomendación entre dos alternativas. Requisitos observables: las estructuras que la unidad
 *   acaba de practicar. Completa = todos los obligatorios cumplidos.
 * - `free` (3): una propuesta (U4), un desacuerdo diplomático (U8) y un artículo de opinión (U12), sin
 *   veredicto; modelo, pistas opcionales y lista de control.
 *
 * Sólo vocabulario enseñado hasta la lección (lo comprueba content/b2-checks.ts).
 * ESTADO EDITORIAL: borrador, sin revisión pedagógica ni nativa.
 */

const common = (minSentences: number): WritingRequirement[] => [
  {
    id: 'sentences',
    label: `Escribís al menos ${minSentences} oraciones`,
    kind: 'min_sentences',
    min: minSentences,
  },
  { id: 'capital', label: 'Cada oración empieza con mayúscula', kind: 'capital_start' },
  {
    id: 'punctuation',
    label: 'Terminás con punto, signo de exclamación o de pregunta',
    kind: 'end_punctuation',
  },
];

const base = { language: 'en', allowInvented: true as const, maxChars: 1500 };

export const EN_B2_WRITING_TASKS: readonly WritingTaskDef[] = [
  // ------------------------------------------------ Guiadas, al terminar la lección
  {
    ...base,
    id: 'en.b2.wt.misunderstanding',
    kind: 'guided',
    codes: [],
    lesson: 'b2-u01-l05',
    title: 'Aclarar un malentendido',
    instructions:
      'Un compañero se ofendió por un mensaje tuyo. Escribile un correo breve y con tacto: reconocé que el mensaje sonó mal, explicá qué quisiste decir y proponé hablar.',
    prompts: ['What did you write?', 'What did you actually mean?', 'What can you do now?'],
    requirements: [
      {
        id: 'mean',
        label: 'Aclarás tu intención (I didn’t mean to…)',
        kind: 'pattern',
        patterns: [
          ["didn't|did", 'not|mean', 'mean|to'],
          ['meant', 'to'],
        ],
      },
      {
        id: 'actually',
        label: 'Corregís la idea equivocada con actually',
        kind: 'pattern',
        patterns: [['actually']],
      },
      {
        id: 'apology',
        label: 'Pedís disculpas (sorry, apologize)',
        kind: 'pattern',
        patterns: [['sorry|apologize']],
      },
      ...common(4),
    ],
    model:
      'Hi Mark, I want to apologize for my message this morning. I realize it sounded rude, but I didn’t mean to criticize your work. Actually, I think your report is very good. I was in a hurry, and my tone didn’t get across in writing. Could we talk about it after lunch?',
    checklist: [
      'Reconocí que el mensaje sonó mal y pedí disculpas.',
      'Expliqué lo que quise decir con I didn’t mean to… y actually.',
      'Propuse hablar.',
    ],
  },
  {
    ...base,
    id: 'en.b2.wt.offer-conditions',
    kind: 'guided',
    codes: [],
    lesson: 'b2-u02-l05',
    title: 'Responder a una oferta con condiciones',
    instructions:
      'Te ofrecieron un trabajo. Respondé con un correo formal: agradecé, poné una condición para aceptar (as long as, provided that) y decí qué pasa si no se cumple (otherwise).',
    prompts: [
      'What do you like about the offer?',
      'What do you ask for?',
      'What will you do otherwise?',
    ],
    requirements: [
      {
        id: 'greeting',
        label: 'Empezás con un saludo formal (Dear…)',
        kind: 'pattern',
        patterns: [['dear']],
      },
      {
        id: 'condition',
        label: 'Ponés una condición con as long as o provided that',
        kind: 'pattern',
        patterns: [
          ['as', 'long', 'as'],
          ['provided', 'that'],
        ],
      },
      {
        id: 'otherwise',
        label: 'Decís qué pasa si no se cumple (otherwise)',
        kind: 'pattern',
        patterns: [['otherwise']],
      },
      {
        id: 'closing',
        label: 'Cerrás de forma formal (Kind regards, Best wishes…)',
        kind: 'pattern',
        patterns: [['regards'], ['best', 'wishes'], ['yours', 'sincerely']],
      },
      ...common(4),
    ],
    model:
      'Dear Mr. Patel, Thank you very much for the job offer. I am very excited about the project and the team. I would be happy to accept, provided that I can work from home two days a week. Otherwise, I am afraid I would have to turn the offer down. I hope we can reach an agreement. Kind regards.',
    checklist: [
      'Usé un saludo y una despedida formales.',
      'Puse una condición con provided that o as long as.',
      'Dije qué pasa si no se cumple, con cortesía.',
    ],
  },
  {
    ...base,
    id: 'en.b2.wt.city-report',
    kind: 'guided',
    codes: [],
    lesson: 'b2-u03-l05',
    title: 'Un informe breve sobre tu ciudad',
    instructions:
      'Escribí un informe breve para una revista sobre los cambios en tu ciudad o tu barrio: qué se hizo, qué se está haciendo y qué se espera. Usá la voz pasiva.',
    prompts: [
      'What has been built or changed?',
      'What is being done now?',
      'What is expected next?',
    ],
    requirements: [
      {
        id: 'perfect-passive',
        label: 'Contás algo que ya se hizo (has / have been + participio)',
        kind: 'pattern',
        patterns: [['has|have', 'been', '<WORD>']],
      },
      {
        id: 'continuous-passive',
        label: 'Contás algo que se está haciendo (is / are being + participio)',
        kind: 'pattern',
        patterns: [['is|are', 'being', '<WORD>']],
      },
      {
        id: 'expected',
        label: 'Decís lo que se espera o se dice (is expected to, it is said that…)',
        kind: 'pattern',
        patterns: [
          ['expected', 'to'],
          ['it', 'is', 'said|believed'],
        ],
      },
      ...common(4),
    ],
    model:
      'My neighborhood has changed a lot in the last five years. A new park has been built near the river, and the old market has been repaired. At the moment, two hundred new homes are being built for young families. However, housing is still very expensive. The new homes are expected to be ready next year.',
    checklist: [
      'Conté lo que ya se hizo con has been + participio.',
      'Conté lo que se está haciendo con is being + participio.',
      'Dije lo que se espera.',
    ],
  },
  {
    ...base,
    id: 'en.b2.wt.tech-opinion',
    kind: 'guided',
    codes: [],
    lesson: 'b2-u04-l05',
    title: 'Tu opinión sobre una tecnología',
    instructions:
      'Elegí una tecnología que usás todos los días (una app, la inteligencia artificial, el teléfono). Explicá qué es, por qué dependés de ella y qué te preocupa. Usá oraciones de relativo con comas.',
    prompts: ['What technology do you rely on?', 'Why is it useful?', 'What worries you about it?'],
    requirements: [
      {
        id: 'relative',
        label: 'Agregás información entre comas con which o who',
        kind: 'pattern',
        patterns: [['which|who|whose']],
      },
      {
        id: 'rely',
        label: 'Decís de qué dependés (rely on)',
        kind: 'pattern',
        patterns: [['rely|relies', 'on']],
      },
      {
        id: 'worry',
        label: 'Decís qué te preocupa (privacy, data, I worry about…)',
        kind: 'pattern',
        patterns: [['privacy|data|worry|worried']],
      },
      ...common(4),
    ],
    model:
      'I rely on my phone for everything. My favorite app, which I use every day, helps me plan my week. It is very useful, but it collects a lot of data about me, which worries me. I would like to know who uses my information. In my opinion, privacy is more important than innovation.',
    checklist: [
      'Usé which o who para agregar información.',
      'Expliqué de qué dependo con rely on.',
      'Dije qué me preocupa.',
    ],
  },
  {
    ...base,
    id: 'en.b2.wt.repair-complaint',
    kind: 'guided',
    codes: [],
    lesson: 'b2-u05-l05',
    title: 'Un reclamo con una propuesta',
    instructions:
      'Compraste algo caro que se rompió enseguida. Escribí un reclamo formal: contá qué pasó, compará con lo que esperabas y proponé una solución (que te lo arreglen o te lo cambien).',
    prompts: ['What did you buy?', 'What went wrong?', 'What would you like the shop to do?'],
    requirements: [
      {
        id: 'greeting',
        label: 'Empezás con un saludo formal (Dear…)',
        kind: 'pattern',
        patterns: [['dear']],
      },
      {
        id: 'causative',
        label: 'Pedís que te lo arreglen o cambien (have / get it repaired, replaced…)',
        kind: 'pattern',
        patterns: [['have|get|had|got', 'it|them', '<WORD>']],
      },
      {
        id: 'comparison',
        label: 'Comparás con matices (twice as, nowhere near as, by far…)',
        kind: 'pattern',
        patterns: [
          ['twice', 'as'],
          ['nowhere', 'near'],
          ['by', 'far'],
        ],
      },
      ...common(4),
    ],
    model:
      'Dear Sir or Madam, Last month I bought some headphones from your shop. They were twice as expensive as my old ones, but they broke after two weeks. They are nowhere near as good as your website says. I would like to have them repaired or replaced this week. I have attached the receipt. Kind regards.',
    checklist: [
      'Conté qué pasó con el producto.',
      'Comparé con twice as o nowhere near as.',
      'Pedí que me lo arreglen o cambien con have / get + participio.',
    ],
  },
  {
    ...base,
    id: 'en.b2.wt.make-up',
    kind: 'guided',
    codes: [],
    lesson: 'b2-u06-l05',
    title: 'Hacer las paces',
    instructions:
      'Te peleaste con un amigo. Escribile un mensaje: reconocé lo que deberías haber hecho distinto, mostrá que entendés cómo se sintió y proponé reconciliarse.',
    prompts: ['What happened?', 'What should you have done?', 'How might your friend have felt?'],
    requirements: [
      {
        id: 'should-have',
        label: 'Reconocés tu error con should / shouldn’t have',
        kind: 'pattern',
        patterns: [
          ["should|shouldn't", 'have', '<WORD>'],
          ["should've", '<WORD>'],
        ],
      },
      {
        id: 'deduction',
        label: 'Deducís cómo se sintió con must / might have',
        kind: 'pattern',
        patterns: [
          ['must|might|could', 'have', '<WORD>'],
          ["must've|might've|could've", '<WORD>'],
        ],
      },
      {
        id: 'make-up',
        label: 'Proponés reconciliarse o verse (make up, coffee, meet…)',
        kind: 'pattern',
        patterns: [['make|made', 'up'], ['coffee|meet|talk']],
      },
      ...common(4),
    ],
    model:
      "Hi Sara, I'm really sorry about what happened on Friday. I shouldn't have shouted at you in front of everyone. You must have felt embarrassed, and I feel guilty about it. I overreacted, and I hope you don't take it personally. Can we meet for a coffee and make up?",
    checklist: [
      'Reconocí mi error con should / shouldn’t have.',
      'Mostré empatía con must / might have.',
      'Propuse hacer las paces.',
    ],
  },
  {
    ...base,
    id: 'en.b2.wt.environment-opinion',
    kind: 'guided',
    codes: [],
    lesson: 'b2-u07-l05',
    title: 'Un artículo de opinión sobre el medioambiente',
    instructions:
      'Escribí un artículo breve de opinión sobre un problema ambiental (las sequías, la contaminación, la energía). Presentá el problema, reconocé una dificultad y proponé una solución.',
    prompts: ['What is the problem?', 'What makes it hard to tackle?', 'What should we do?'],
    requirements: [
      {
        id: 'concession',
        label: 'Contrastás con despite, in spite of o even though',
        kind: 'pattern',
        patterns: [['despite'], ['in', 'spite', 'of'], ['even', 'though']],
      },
      {
        id: 'whereas',
        label: 'Comparás dos ideas opuestas con whereas',
        kind: 'pattern',
        patterns: [['whereas']],
      },
      {
        id: 'solution',
        label: 'Proponés una solución (should, need to, tackle…)',
        kind: 'pattern',
        patterns: [['should|tackle'], ['need', 'to']],
      },
      ...common(5),
    ],
    model:
      'Water shortages are a growing threat in my country. Despite the storms last winter, many rivers are still very low. Some people waste a lot of water, whereas farmers often have no choice. Even though it is not easy, we need to tackle the problem now. In my opinion, the government should invest in renewable energy and help farmers use less water.',
    checklist: [
      'Presenté el problema.',
      'Usé despite / even though y whereas.',
      'Propuse una solución.',
    ],
    glossary: [{ term: 'invest', meaning: 'invertir' }],
  },
  {
    ...base,
    id: 'en.b2.wt.report-story',
    kind: 'guided',
    codes: [],
    lesson: 'b2-u08-l05',
    title: 'Contar una noticia',
    instructions:
      'Contá una noticia (real o inventada) como en un diario: qué se afirmó, quién lo negó o lo admitió y qué advirtió alguien. Usá verbos de reporte en lugar de say.',
    prompts: ['What was the rumor?', 'Who denied or admitted something?', 'What did they warn?'],
    requirements: [
      {
        id: 'claim',
        label: 'Contás lo que alguien afirmó (claimed, suggested)',
        kind: 'pattern',
        patterns: [['claimed|claims|suggested|suggests']],
      },
      {
        id: 'deny-admit',
        label: 'Usás denied o admitted (+ -ing o that)',
        kind: 'pattern',
        patterns: [['denied|denies|admitted|admits']],
      },
      {
        id: 'warn',
        label: 'Contás una advertencia o una negativa (warned… not to, refused to)',
        kind: 'pattern',
        patterns: [
          ['warned|warns', '<WORD>', 'not', 'to'],
          ['refused|refuses', 'to'],
        ],
      },
      ...common(4),
    ],
    model:
      'Last week a post claimed that the city was going to close the main library. The post went viral in one day. The mayor denied the rumor and insisted that the library would stay open. However, she admitted that the building needed repairs. She also warned people not to believe everything they read online.',
    checklist: [
      'Conté lo que se afirmó con claimed.',
      'Usé denied o admitted.',
      'Conté una advertencia con warned… not to o una negativa con refused to.',
    ],
  },
  {
    ...base,
    id: 'en.b2.wt.looking-back',
    kind: 'guided',
    codes: [],
    lesson: 'b2-u09-l05',
    title: 'Mirar atrás',
    instructions:
      'Mirá hacia atrás en tu educación (el colegio, la facultad, un curso). Contá una decisión, imaginá qué habría pasado con otra elección y decí qué aprendiste.',
    prompts: [
      'What decision do you look back on?',
      'What would have happened otherwise?',
      'What did you learn?',
    ],
    requirements: [
      {
        id: 'third',
        label: 'Usás el tercer condicional (If I had…, I would have…)',
        kind: 'pattern',
        patterns: [
          ['would', 'have', '<WORD>'],
          ["would've|i'd|wouldn't", 'have', '<WORD>'],
          ["wouldn't", 'have'],
        ],
      },
      {
        id: 'if-had',
        label: 'Empezás la condición con if + had',
        kind: 'pattern',
        patterns: [
          ['if', '<WORD>', "had|hadn’t|hadn't"],
          ['if', "i'd"],
        ],
      },
      {
        id: 'wish',
        label: 'Lamentás algo con I wish o If only',
        kind: 'pattern',
        patterns: [['wish'], ['if', 'only']],
      },
      ...common(4),
    ],
    model:
      'When I look back on my school days, I remember how much I struggled with math. If I had asked for help earlier, I would have passed the exam the first time. If only I had been less shy! However, that experience changed my mindset. Now I know that mistakes help me make progress.',
    checklist: [
      'Imaginé otro resultado con If I had…, I would have…',
      'Lamenté algo con I wish o If only.',
      'Conté qué aprendí.',
    ],
  },
  {
    ...base,
    id: 'en.b2.wt.argument',
    kind: 'guided',
    codes: [],
    lesson: 'b2-u10-l05',
    title: 'Una argumentación',
    instructions:
      'Elegí un tema (¿Hay que prohibir los teléfonos en el colegio? ¿Trabajar cuatro días por semana?). Defendé tu postura con dos razones, reconocé la postura contraria y cerrá con una conclusión.',
    prompts: [
      'What is your position?',
      'What do people on the other side say?',
      'How do you finish?',
    ],
    requirements: [
      {
        id: 'add',
        label: 'Sumás una razón con moreover o furthermore',
        kind: 'pattern',
        patterns: [['moreover|furthermore']],
      },
      {
        id: 'concede',
        label: 'Reconocés la otra postura (admittedly) y la rebatís (nevertheless, however)',
        kind: 'pattern',
        patterns: [['admittedly']],
      },
      {
        id: 'rebut',
        label: 'Rebatís con nevertheless o however',
        kind: 'pattern',
        patterns: [['nevertheless|however']],
      },
      {
        id: 'conclude',
        label: 'Concluís con to sum up o all things considered',
        kind: 'pattern',
        patterns: [
          ['to', 'sum', 'up'],
          ['all', 'things', 'considered'],
        ],
      },
      ...common(5),
    ],
    model:
      'In my opinion, companies should try the four-day week. People who are rested work better and make fewer mistakes. Moreover, they have more time for their families. Admittedly, some clients expect us every day. Nevertheless, teams can take turns, so nobody is left without help. To sum up, the benefits outweigh the costs.',
    checklist: [
      'Di mi postura con dos razones.',
      'Reconocí la otra postura con admittedly y la rebatí.',
      'Cerré con una conclusión.',
    ],
  },
  {
    ...base,
    id: 'en.b2.wt.story',
    kind: 'guided',
    codes: [],
    lesson: 'b2-u11-l05',
    title: 'El comienzo de un relato',
    instructions:
      'Escribí el comienzo de un relato (real o inventado). Empezá con una oración con participio, agregá una inversión para crear tensión y usá al menos una expresión idiomática.',
    prompts: [
      'Where does the story start?',
      'What happens out of the blue?',
      'How does the character feel?',
    ],
    requirements: [
      {
        id: 'participle',
        label: 'Usás una oración con participio (Having…, Walking…)',
        kind: 'pattern',
        patterns: [['having', '<WORD>'], ['walking|looking|sitting|standing|running']],
      },
      {
        id: 'inversion',
        label: 'Usás una inversión (Never had…, Hardly had…, Little did…)',
        kind: 'pattern',
        patterns: [
          ['never', 'had|have|has'],
          ['hardly', 'had'],
          ['no', 'sooner', 'had'],
          ['little', 'did'],
        ],
      },
      {
        id: 'idiom',
        label: 'Usás una expresión (out of the blue, burst into tears, break the ice…)',
        kind: 'pattern',
        patterns: [
          ['out', 'of', 'the', 'blue'],
          ['burst', 'into', 'tears'],
          ['break|broke', 'the', 'ice'],
          ['piece', 'of', 'cake'],
          ['last', 'straw'],
          ['blue', 'moon'],
        ],
      },
      ...common(4),
    ],
    model:
      'Having missed the last bus, Tom set off on foot. Never had he seen the streets so empty. Walking past the old cinema, he heard someone call his name. Out of the blue, his old friend Ana appeared. Little did he know that she had been looking for him for years.',
    checklist: [
      'Empecé con una oración con participio.',
      'Usé una inversión para crear tensión.',
      'Usé una expresión idiomática.',
    ],
    glossary: [{ term: 'appeared', meaning: 'apareció' }],
  },
  {
    ...base,
    id: 'en.b2.wt.recommendation',
    kind: 'guided',
    codes: [],
    lesson: 'b2-u12-l05',
    title: 'Recomendar una opción',
    instructions:
      'Un amigo tiene que elegir entre dos opciones (dos trabajos, dos ciudades, dos cursos). Escribile comparando las dos, con sus pros y contras, y recomendale una.',
    prompts: [
      'What can your friend choose?',
      'What are the pros and cons?',
      'What do you recommend?',
    ],
    requirements: [
      {
        id: 'pros-cons',
        label: 'Hablás de pros y contras o del costo a cambio (trade-off)',
        kind: 'pattern',
        patterns: [
          ['pros', 'and', 'cons'],
          ['trade-off'],
          ['advantage|advantages|disadvantage|disadvantages'],
        ],
      },
      {
        id: 'contrast',
        label: 'Comparás con whereas, however u on the other hand',
        kind: 'pattern',
        patterns: [['whereas|however'], ['on', 'the', 'other', 'hand']],
      },
      {
        id: 'recommend',
        label: 'Recomendás una opción (I would…, I recommend, you should…)',
        kind: 'pattern',
        patterns: [['recommend'], ['you', 'should'], ['if', 'i', 'were', 'you']],
      },
      ...common(5),
    ],
    model:
      'Hi! I have been weighing up the pros and cons of your two offers. The job in Lisbon pays more, whereas the job here is closer to your family. However, Lisbon is only a short flight away. Every choice has a trade-off, but this is a great opportunity. If I were you, I would take the job in Lisbon.',
    checklist: [
      'Comparé las dos opciones con sus pros y contras.',
      'Usé whereas o however.',
      'Recomendé una opción.',
    ],
  },

  // ------------------------------------------------ Libres, al terminar cada bloque
  {
    ...base,
    id: 'en.b2.wt.block1-proposal',
    kind: 'free',
    codes: [],
    lesson: 'b2-u04-final',
    block: 1,
    title: 'Una propuesta para tu trabajo o tu estudio',
    instructions:
      'Escribí una propuesta para mejorar algo en tu trabajo, tu facultad o tu barrio. Explicá la situación, tu idea, sus condiciones y por qué conviene.',
    prompts: ['What is the problem now?', 'What is your proposal?', 'Why is it a good idea?'],
    requirements: [
      {
        id: 'proposal',
        label: '¿Presentaste tu propuesta con claridad?',
        kind: 'pattern',
        patterns: [['proposal'], ['i', 'suggest'], ['we', 'could|should']],
        optional: true,
      },
      {
        id: 'condition',
        label: '¿Pusiste una condición (as long as, provided that)?',
        kind: 'pattern',
        patterns: [
          ['as', 'long', 'as'],
          ['provided', 'that'],
        ],
        optional: true,
      },
      {
        id: 'relative',
        label: '¿Agregaste información con which, who o whose?',
        kind: 'pattern',
        patterns: [['which|who|whose']],
        optional: true,
      },
      {
        id: 'length',
        label: '¿Escribiste al menos 5 oraciones?',
        kind: 'min_sentences',
        min: 5,
        optional: true,
      },
    ],
    model:
      'At the moment, our team has too many meetings, most of which are not necessary. My proposal is easy: one short meeting on Monday, which everyone attends, and written updates for the rest of the week. This would give us more time for real work. We could try it for a month, as long as the managers agree. If it works, we will reach our goals faster.',
    checklist: [
      'Expliqué la situación y mi propuesta.',
      'Puse una condición.',
      'Expliqué por qué conviene.',
    ],
    glossary: [
      { term: 'attends', meaning: 'asiste' },
      { term: 'updates', meaning: 'novedades, actualizaciones' },
    ],
  },
  {
    ...base,
    id: 'en.b2.wt.block2-disagree',
    kind: 'free',
    codes: [],
    lesson: 'b2-u08-final',
    block: 2,
    title: 'Discrepar con diplomacia',
    instructions:
      'Un colega publicó una opinión con la que no estás de acuerdo (por ejemplo, «Las redes sociales son la mejor fuente de noticias»). Respondele con respeto: reconocé lo que tiene de cierto y explicá por qué pensás distinto.',
    prompts: ['What do you agree with?', 'Why do you see it differently?', 'What do you suggest?'],
    requirements: [
      {
        id: 'soften',
        label: '¿Suavizaste tu desacuerdo (I see your point, but…; I’m not sure…)?',
        kind: 'pattern',
        patterns: [
          ['i', 'see', 'your', 'point'],
          ['not', 'sure'],
          ['i', 'understand'],
        ],
        optional: true,
      },
      {
        id: 'contrast',
        label: '¿Usaste even though, despite o whereas?',
        kind: 'pattern',
        patterns: [['even', 'though'], ['despite'], ['whereas']],
        optional: true,
      },
      {
        id: 'reporting',
        label: '¿Contaste lo que dijo con un verbo de reporte (claimed, suggested)?',
        kind: 'pattern',
        patterns: [['claimed|claim|suggested|suggest|admitted|warned']],
        optional: true,
      },
      {
        id: 'length',
        label: '¿Escribiste al menos 5 oraciones?',
        kind: 'min_sentences',
        min: 5,
        optional: true,
      },
    ],
    model:
      'Hi! I read your post with interest. I see your point: social media is fast, and it is where young people get their news. However, I’m not sure it is the best source. Even though some posts are reliable, many are biased or misleading, and rumors spread very quickly. I would suggest checking a story in two different sources before sharing it.',
    checklist: [
      'Reconocí lo que tiene de cierto la otra opinión.',
      'Expliqué mi desacuerdo con respeto.',
      'Hice una propuesta.',
    ],
  },
  {
    ...base,
    id: 'en.b2.wt.block3-opinion',
    kind: 'free',
    codes: [],
    lesson: 'b2-u12-final',
    block: 3,
    title: 'Un artículo de opinión: ventajas y desventajas',
    instructions:
      'Escribí un artículo de opinión sobre un tema que te interese (el trabajo remoto, la inteligencia artificial en la educación, la universidad gratuita). Presentá ventajas y desventajas, tu postura y una conclusión.',
    prompts: [
      'What are the main advantages?',
      'What are the disadvantages?',
      'What do you think in the end?',
    ],
    requirements: [
      {
        id: 'linkers',
        label: '¿Usaste conectores (moreover, however, nevertheless)?',
        kind: 'pattern',
        patterns: [['moreover|furthermore|however|nevertheless']],
        optional: true,
      },
      {
        id: 'cleft',
        label: '¿Enfatizaste una idea (What matters is…, The reason why…)?',
        kind: 'pattern',
        patterns: [
          ['what', '<WORD>', 'is'],
          ['the', 'reason', 'why'],
        ],
        optional: true,
      },
      {
        id: 'conclusion',
        label: '¿Cerraste con una conclusión (to sum up, all things considered)?',
        kind: 'pattern',
        patterns: [
          ['to', 'sum', 'up'],
          ['all', 'things', 'considered'],
        ],
        optional: true,
      },
      {
        id: 'length',
        label: '¿Escribiste al menos 6 oraciones?',
        kind: 'min_sentences',
        min: 6,
        optional: true,
      },
    ],
    model:
      'Working from home has become very common. Its main advantage is flexibility: people save time and money, and they can organize their day. Moreover, many say they are more productive. However, working alone can be lonely, and it is harder to build a team. What matters is not where we work, but how well we communicate. All things considered, I believe a mix of home and office is the best solution.',
    checklist: [
      'Presenté ventajas y desventajas.',
      'Usé conectores y enfaticé una idea.',
      'Cerré con una conclusión.',
    ],
    glossary: [
      { term: 'productive', meaning: 'productivo' },
      { term: 'organize', meaning: 'organizar' },
      { term: 'communicate', meaning: 'comunicarse' },
      { term: 'mix', meaning: 'mezcla' },
      { term: 'build', meaning: 'armar, construir' },
    ],
  },
];
