import type { WritingRequirement, WritingTaskDef } from '../../shared/writing';

/**
 * Producción escrita de portugués de Brasil A1 y A2 sin IA (docs/PT_A1_A2.md), con el mismo sistema que
 * el inglés (shared/writing.ts): se comprueba en el dispositivo y el texto no se envía ni se guarda.
 * Práctica opcional al terminar la lección; no bloquea ni cuenta para el progreso.
 *
 * - `guided`: requisitos observables (las estructuras que la lección acaba de practicar). Completa =
 *   todos los obligatorios cumplidos. Las de A1 U2–U8 acompañan lecciones del piloto ya publicado.
 * - `free`: texto libre de bloque, sin veredicto: modelo, pistas opcionales y lista de control.
 *
 * Sólo vocabulario enseñado hasta la lección (lo comprueba content/pt-checks.ts).
 * ESTADO EDITORIAL: borrador, sin revisión pedagógica ni nativa.
 */

const common = (minSentences: number): WritingRequirement[] => [
  {
    id: 'sentences',
    label: `Escribes al menos ${minSentences} oraciones`,
    kind: 'min_sentences',
    min: minSentences,
  },
  { id: 'capital', label: 'Cada oración empieza con mayúscula', kind: 'capital_start' },
  {
    id: 'punctuation',
    label: 'Terminas con punto, signo de exclamación o de pregunta',
    kind: 'end_punctuation',
  },
];

const base = { language: 'pt', allowInvented: true as const, maxChars: 900 };
const a2 = { ...base, maxChars: 1200 };

const DAYS = 'segunda|terça|quarta|quinta|sexta|sábado|domingo|hoje|amanhã';
const PERFEITO =
  'falei|trabalhei|estudei|joguei|comi|bebi|saí|dormi|assisti|acordei|fui|fiz|tive|estive|viajei|conheci|peguei|cozinhei|passeei|li|vi';

export const PT_WRITING_TASKS: readonly WritingTaskDef[] = [
  // ------------------------------------------------ A1, guiadas
  {
    ...base,
    id: 'pt.a1.wt.apresentacao',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a1-u02-l05',
    title: 'Preséntate',
    instructions:
      'Preséntate en portugués (con datos reales o inventados): saluda, di tu nombre, de dónde eres y qué eres (estudiante, profesor…).',
    prompts: ['Como você se chama?', 'De onde você é?'],
    requirements: [
      {
        id: 'name',
        label: 'Dices tu nombre (meu nome é…)',
        kind: 'pattern',
        patterns: [['meu', 'nome', 'é']],
      },
      {
        id: 'origin',
        label: 'Dices de dónde eres (sou de…)',
        kind: 'pattern',
        patterns: [
          ['sou', 'de'],
          ['sou', 'do|da'],
        ],
      },
      ...common(3),
    ],
    model: 'Oi! Meu nome é Marina. Sou de Córdoba. Eu sou argentina e sou estudante.',
    checklist: ['Saludo al principio.', 'Uso sou para decir de dónde soy y qué soy.'],
  },
  {
    ...base,
    id: 'pt.a1.wt.familia',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a1-u04-l05',
    title: 'Tu familia',
    instructions: 'Describe a tu familia: quiénes son y cómo se llaman. Usa meu y minha.',
    prompts: ['Como se chama a sua mãe?', 'Você tem irmãos?'],
    requirements: [
      {
        id: 'possessive',
        label: 'Usas meu o minha (meu pai, minha irmã…)',
        kind: 'pattern',
        patterns: [['meu|minha|meus|minhas', '<WORD>']],
      },
      {
        id: 'name',
        label: 'Dices cómo se llama alguien (se chama…)',
        kind: 'pattern',
        patterns: [['se', 'chama']],
      },
      ...common(3),
    ],
    model:
      'A minha família é pequena. A minha mãe se chama Carla e o meu pai se chama Pedro. Eu tenho uma irmã. Ela tem dez anos.',
    checklist: ['Uso minha con mujeres y meu con hombres.', 'Digo cómo se llama cada uno.'],
  },
  {
    ...base,
    id: 'pt.a1.wt.casa',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a1-u06-l05',
    title: 'Tu casa',
    instructions: 'Describe tu casa o tu apartamento: qué cuartos tiene y qué hay en cada uno.',
    prompts: ['Como é o seu quarto?', 'O que tem na cozinha?'],
    requirements: [
      {
        id: 'there-is',
        label: 'Dices qué hay con tem o há',
        kind: 'pattern',
        patterns: [['tem'], ['há']],
      },
      {
        id: 'room',
        label: 'Nombras un cuarto con no / na (no quarto, na cozinha…)',
        kind: 'pattern',
        patterns: [['no|na', 'quarto|cozinha|sala|banheiro']],
      },
      ...common(3),
    ],
    model:
      'No meu quarto tem uma cama e uma mesa. Na cozinha há uma mesa e quatro cadeiras. Na sala tem um sofá azul.',
    checklist: ['Uso tem o há para decir qué hay.', 'Uso no y na con los cuartos.'],
  },
  {
    ...base,
    id: 'pt.a1.wt.rotina',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a1-u08-l05',
    title: 'Tu rutina',
    instructions:
      'Cuenta un día normal tuyo: a qué hora te despiertas, qué haces por la mañana y por la noche.',
    prompts: ['Você trabalha?', 'Você janta em casa?'],
    requirements: [
      {
        id: 'verbs',
        label: 'Usas al menos un verbo de la rutina (acordo, trabalho, estudo, janto…)',
        kind: 'pattern',
        patterns: [['acordo|trabalho|estudo|almoço|janto|leio|escrevo|durmo|assisto|tomo']],
      },
      {
        id: 'time',
        label: 'Dices cuándo (de manhã, à noite, todo dia…)',
        kind: 'pattern',
        patterns: [['de', 'manhã'], ['à', 'noite'], ['todo', 'dia'], ['sempre']],
      },
      ...common(3),
    ],
    model:
      'De manhã eu acordo e tomo café da manhã. Depois eu trabalho em casa. À noite eu janto e leio um livro.',
    checklist: ['Uso verbos en presente con eu (-o).', 'Ordeno el día: de manhã, depois, à noite.'],
  },
  {
    ...base,
    id: 'pt.a1.wt.trabalho',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a1-u13-l05',
    title: 'Tu trabajo y el de tu familia',
    instructions:
      'Cuenta a qué te dedicas tú y otras personas de tu familia, y dónde trabajan. Usa al menos un verbo en plural (nós…, eles…).',
    prompts: ['O que você faz?', 'Onde vocês trabalham?'],
    requirements: [
      {
        id: 'job',
        label: 'Dices una profesión (sou professor, ela é médica…)',
        kind: 'pattern',
        patterns: [
          [
            'sou|é|são|somos',
            'médico|médica|enfermeiro|enfermeira|engenheiro|engenheira|garçom|garçonete|cozinheiro|cozinheira|motorista|professor|professora|estudante|estudantes|professores|médicos',
          ],
        ],
      },
      {
        id: 'plural',
        label: 'Usas un verbo en plural (trabalhamos, trabalham, somos, são)',
        kind: 'pattern',
        patterns: [['trabalhamos|trabalham|somos|são']],
      },
      ...common(3),
    ],
    model:
      'Eu sou engenheira e trabalho em um escritório no centro. O meu pai é motorista de ônibus. A minha mãe e a minha irmã são enfermeiras: elas trabalham à noite.',
    checklist: ['Digo profesiones sin artículo.', 'Uso un verbo en plural con nós o eles.'],
  },
  {
    ...base,
    id: 'pt.a1.wt.convite',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a1-u16-l05',
    title: 'Un mensaje para salir',
    instructions:
      'Escríbele un mensaje corto a un amigo para proponerle un plan: qué día, adónde (ao / à) y cómo van.',
    prompts: ['Vamos ao cinema?', 'Como a gente vai?'],
    requirements: [
      {
        id: 'propose',
        label: 'Propones un plan con vamos…?',
        kind: 'pattern',
        patterns: [['vamos']],
      },
      {
        id: 'where',
        label: 'Dices adónde con ao o à',
        kind: 'pattern',
        patterns: [['ao|à', '<WORD>']],
      },
      {
        id: 'day',
        label: 'Dices qué día (no sábado, amanhã…)',
        kind: 'pattern',
        patterns: [[DAYS]],
      },
      ...common(3),
    ],
    model:
      'Oi, Nina! Vamos ao cinema no sábado? O cinema é perto da estação. A gente vai de metrô. Tchau!',
    checklist: ['Saludo y me despido.', 'Uso ao con masculino y à con femenino.'],
  },
  // ------------------------------------------------ A1, libre (fin del A1)
  {
    ...base,
    id: 'pt.a1.wt.livre-eu',
    kind: 'free',
    codes: [],
    lesson: 'pt-a1-u16-final',
    block: 1,
    title: 'Texto libre: yo',
    instructions:
      'Escribe un texto libre sobre ti: quién eres, tu familia, tu rutina, lo que te gusta y qué haces en tu tiempo libre. No hay respuesta correcta: compara con el modelo y revisa la lista.',
    prompts: ['Quem é você?', 'O que você gosta de fazer?', 'O que você faz no fim de semana?'],
    requirements: [
      {
        id: 'likes',
        label: 'Pista: cuenta algo que te gusta (gosto de…)',
        kind: 'pattern',
        patterns: [['gosto', 'de|do|da']],
        optional: true,
      },
      {
        id: 'state',
        label: 'Pista: di cómo estás hoy (estou…)',
        kind: 'pattern',
        patterns: [['estou']],
        optional: true,
      },
      { id: 'words', label: 'Pista: unas 40 palabras', kind: 'min_words', min: 40, optional: true },
    ],
    model:
      'Oi! Eu sou o Lucas e moro em Rosario. Sou estudante de engenharia. A minha família é pequena: o meu pai, a minha mãe e uma irmã. De manhã eu estudo e à noite eu trabalho em um restaurante. Eu gosto de futebol e de cinema. No fim de semana eu passeio de bicicleta pela cidade. Hoje eu estou cansado, mas feliz!',
    checklist: [
      'Me presento y hablo de mi familia.',
      'Cuento mi rutina con verbos en presente.',
      'Uso ser para cómo soy y estar para cómo estoy.',
    ],
  },

  // ------------------------------------------------ A2, guiadas
  {
    ...a2,
    id: 'pt.a2.wt.fim-de-semana',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a2-u01-l05',
    title: 'Tu fin de semana',
    instructions:
      'Cuenta qué hiciste el fin de semana pasado (real o inventado), en orden, con el pretérito perfeito.',
    prompts: ['Como foi o seu fim de semana?', 'O que você fez no sábado?'],
    requirements: [
      {
        id: 'past',
        label: 'Usas el perfeito (falei, comi, saí, joguei…)',
        kind: 'pattern',
        patterns: [[PERFEITO]],
      },
      {
        id: 'when',
        label: 'Dices cuándo (no sábado, ontem, na semana passada…)',
        kind: 'pattern',
        patterns: [['no', 'sábado|domingo'], ['ontem'], ['semana', 'passada']],
      },
      ...common(4),
    ],
    model:
      'O meu fim de semana foi ótimo! No sábado eu joguei futebol com uns amigos e depois a gente comeu uma pizza. No domingo eu dormi até meio-dia. À noite eu assisti a um filme em casa.',
    checklist: [
      'Uso el perfeito para lo que hice.',
      'Ordeno el relato: no sábado, depois, no domingo.',
    ],
  },
  {
    ...a2,
    id: 'pt.a2.wt.viagem',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a2-u02-l05',
    title: 'Un viaje',
    instructions: 'Cuenta un viaje que hiciste: adónde fuiste, cómo, qué conociste y cómo fue.',
    prompts: ['Para onde você foi?', 'O que você conheceu?', 'Como foi a viagem?'],
    requirements: [
      {
        id: 'went',
        label: 'Dices adónde fuiste (fui para…, viajei para…)',
        kind: 'pattern',
        patterns: [['fui|viajei', 'para|a|ao|à']],
      },
      {
        id: 'visited',
        label: 'Dices qué conociste (conheci…)',
        kind: 'pattern',
        patterns: [['conheci']],
      },
      {
        id: 'opinion',
        label: 'Dices cómo fue (foi ótima, foi legal…)',
        kind: 'pattern',
        patterns: [['foi|foram', '<WORD>']],
      },
      ...common(4),
    ],
    model:
      'No ano passado eu viajei para Salvador com a minha família. A gente foi de avião. Lá eu conheci o centro histórico e comi acarajé. Fez muito calor, mas a viagem foi ótima!',
    checklist: ['Uso fui, fiz, tive o estive bien.', 'Digo cuándo fue el viaje.'],
  },
  {
    ...a2,
    id: 'pt.a2.wt.reserva',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a2-u03-l05',
    title: 'Un correo para reservar',
    instructions:
      'Escribe un correo a una posada para reservar una habitación: saluda, di qué quieres, para cuántas noches y pregunta qué incluye.',
    prompts: ['Para quantas noites?', 'O café da manhã está incluído?'],
    requirements: [
      {
        id: 'greeting',
        label: 'Saludas (Olá, Bom dia, Prezados…)',
        kind: 'pattern',
        patterns: [['olá|oi|prezados|prezada|prezado'], ['bom', 'dia'], ['boa', 'tarde|noite']],
      },
      {
        id: 'polite',
        label: 'Pides con cortesía (gostaria de…, poderia…)',
        kind: 'pattern',
        patterns: [['gostaria'], ['poderia']],
      },
      {
        id: 'room',
        label: 'Dices qué habitación (quarto de casal…)',
        kind: 'pattern',
        patterns: [['quarto']],
      },
      {
        id: 'question',
        label: 'Haces una pregunta (…?)',
        kind: 'pattern',
        patterns: [['incluído|incluída|diária|quanto']],
      },
      ...common(4),
    ],
    model:
      'Bom dia! Eu gostaria de reservar um quarto de casal para três noites, de dez a doze de março. O café da manhã está incluído? Quanto é a diária? Obrigada, Teresa Lima.',
    checklist: ['Saludo y firmo.', 'Uso gostaria de para pedir.', 'Hago al menos una pregunta.'],
  },
  {
    ...a2,
    id: 'pt.a2.wt.infancia',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a2-u04-l05',
    title: 'Tu infancia',
    instructions:
      'Cuenta cómo era tu vida de niño: dónde vivías, cómo eras y qué hacías siempre. Usa el imperfeito.',
    prompts: ['Onde você morava?', 'Do que você brincava?'],
    requirements: [
      {
        id: 'imperfect',
        label: 'Usas el imperfeito (era, tinha, morava, brincava, ia…)',
        kind: 'pattern',
        patterns: [['era|tinha|morava|brincava|brincávamos|gostava|ia|costumava|estudava|jogava']],
      },
      {
        id: 'child',
        label: 'Ubicas el recuerdo (quando eu era criança, naquela época…)',
        kind: 'pattern',
        patterns: [['quando', 'eu', 'era'], ['naquela', 'época'], ['antigamente']],
      },
      ...common(4),
    ],
    model:
      'Quando eu era criança, eu morava num bairro pequeno. Eu era tímido e tinha um cachorro. Todo dia eu brincava na rua com os vizinhos. No verão a gente ia à casa dos meus avós.',
    checklist: [
      'Uso el imperfeito para costumbres y descripciones.',
      'Digo dónde vivía y qué hacía.',
    ],
  },
  {
    ...a2,
    id: 'pt.a2.wt.aconteceu',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a2-u05-l05',
    title: 'Algo que te pasó',
    instructions:
      'Cuenta algo que te pasó (una sorpresa, un problema, algo gracioso): describe la escena con estava y cuenta qué pasó, con conectores.',
    prompts: ['Onde você estava?', 'O que aconteceu?', 'E no final?'],
    requirements: [
      {
        id: 'scene',
        label: 'Describes la escena (eu estava…, estava chovendo…)',
        kind: 'pattern',
        patterns: [['estava']],
      },
      {
        id: 'event',
        label: 'Cuentas qué pasó con el perfeito (perdi, caí, vi, encontrei…)',
        kind: 'pattern',
        patterns: [['perdi|caí|caiu|vi|ouvi|encontrei|percebi|cheguei|chegou|aconteceu|peguei']],
      },
      {
        id: 'connector',
        label: 'Usas un conector (primeiro, então, de repente, no final…)',
        kind: 'pattern',
        patterns: [['primeiro|então|enquanto|depois'], ['de', 'repente'], ['no', 'final']],
      },
      ...common(4),
    ],
    model:
      'Ontem eu estava no ônibus e estava chovendo muito. De repente, o ônibus parou. Quando eu desci, percebi que estava sem a minha chave! Então eu liguei para a minha irmã. No final, ela chegou com a chave.',
    checklist: [
      'Uso estava para la escena.',
      'Uso el perfeito para lo que pasó.',
      'Ordeno con conectores.',
    ],
  },
  {
    ...a2,
    id: 'pt.a2.wt.convite',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a2-u06-l05',
    title: 'Invitar y responder',
    instructions:
      'Escribe dos mensajes: uno para invitar a un amigo (qué, cuándo, dónde) y la respuesta de tu amigo (acepta o rechaza con cortesía).',
    prompts: ['Topa?', 'Que dia?', 'Que pena, não posso…'],
    requirements: [
      {
        id: 'plan',
        label: 'Cuentas el plan con vou / vamos + verbo',
        kind: 'pattern',
        patterns: [
          [
            'vou|vamos|vai',
            'fazer|jantar|sair|almoçar|viajar|comer|assistir|ver|jogar|passear|ficar|ir',
          ],
        ],
      },
      {
        id: 'invite',
        label: 'Invitas (topa?, você quer…?, vamos…?)',
        kind: 'pattern',
        patterns: [['topa'], ['você', 'quer'], ['quer', 'ir|vir'], ['vamos']],
      },
      {
        id: 'answer',
        label: 'Respondes (com certeza, bora, que pena, combinado…)',
        kind: 'pattern',
        patterns: [['bora|combinado|topo'], ['com', 'certeza'], ['que', 'pena'], ['não', 'posso']],
      },
      ...common(4),
    ],
    model:
      'Oi, Bia! No sábado eu vou fazer um churrasco lá em casa, às duas. Topa?\nQue pena, no sábado eu não posso. Vou viajar com os meus pais. Fica para outro dia!',
    checklist: ['Digo qué, cuándo y dónde.', 'Respondo con cortesía.'],
  },
  {
    ...a2,
    id: 'pt.a2.wt.candidatura',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a2-u07-l05',
    title: 'Un correo para una pasantía',
    instructions:
      'Escribe un correo formal para postularte a una pasantía: saludo formal, qué estudias, por qué te interesa y despedida formal.',
    prompts: ['O que você estuda?', 'Por que você quer a vaga?'],
    requirements: [
      {
        id: 'greeting',
        label: 'Saludas con formalidad (Prezados, Prezada…)',
        kind: 'pattern',
        patterns: [['prezados|prezada|prezado']],
      },
      {
        id: 'studies',
        label: 'Dices qué estudias (faculdade, curso…)',
        kind: 'pattern',
        patterns: [['faculdade|curso|estudo|estudante']],
      },
      {
        id: 'goal',
        label: 'Dices qué quieres (gostaria de…, pretendo…)',
        kind: 'pattern',
        patterns: [['gostaria'], ['pretendo']],
      },
      {
        id: 'closing',
        label: 'Te despides con formalidad (Atenciosamente)',
        kind: 'pattern',
        patterns: [['atenciosamente']],
      },
      ...common(4),
    ],
    model:
      'Prezada equipe, eu sou estudante de administração na faculdade e gostaria de me candidatar à vaga de estágio. Eu mandei o meu currículo. Pretendo trabalhar numa empresa grande depois do curso. Atenciosamente, Ana Souza.',
    checklist: [
      'Uso un registro formal: prezados, atenciosamente.',
      'Explico qué estudio y qué quiero.',
    ],
    glossary: [{ term: 'candidatar', meaning: 'postularse' }],
  },
  {
    ...a2,
    id: 'pt.a2.wt.conselhos',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a2-u08-l05',
    title: 'Consejos de salud',
    instructions:
      'Un amigo está resfriado. Escríbele un mensaje: pregunta cómo está y dale al menos dos consejos con el imperativo.',
    prompts: ['Como você está?', 'Você está com febre?'],
    requirements: [
      {
        id: 'imperative',
        label: 'Das consejos con el imperativo (tome, beba, descanse, evite…)',
        kind: 'pattern',
        patterns: [['tome|beba|descanse|evite|coma|durma|fique|marque']],
      },
      {
        id: 'negative',
        label: 'Das un consejo en negativo (não tome…, não saia…)',
        kind: 'pattern',
        patterns: [['não', 'tome|beba|coma|saia|trabalhe|vá']],
        optional: true,
      },
      {
        id: 'wish',
        label: 'Te despides deseando que se mejore (melhoras!)',
        kind: 'pattern',
        patterns: [['melhoras']],
      },
      ...common(4),
    ],
    model:
      'Oi, Pedro! Você está com febre? Descanse em casa e beba muita água. Não tome café à noite. Se a dor de garganta continuar, tome um remédio. Melhoras!',
    checklist: ['Uso el imperativo con você (-e / -a).', 'Me despido con melhoras.'],
    glossary: [
      { term: 'saia', meaning: 'salí / no salgas (imperativo de sair)' },
      { term: 'continuar', meaning: 'seguir' },
    ],
  },
  {
    ...a2,
    id: 'pt.a2.wt.recomendacao',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a2-u09-l05',
    title: 'Recomienda una tienda o un producto',
    instructions:
      'Recomiéndale a alguien una tienda, un restaurante o un producto: compáralo con otro y di por qué es el mejor.',
    prompts: ['Qual é o melhor?', 'Por quê?'],
    requirements: [
      {
        id: 'compare',
        label: 'Comparas (mais… do que, menos… do que, tão… quanto)',
        kind: 'pattern',
        patterns: [
          ['mais|menos', '<WORD>', 'do|que'],
          ['tão', '<WORD>', 'quanto'],
        ],
      },
      {
        id: 'best',
        label: 'Dices cuál es el mejor (o melhor, o mais…)',
        kind: 'pattern',
        patterns: [['o|a', 'melhor|mais|pior']],
      },
      ...common(4),
    ],
    model:
      'Eu recomendo a loja do centro. As roupas lá são mais baratas do que no shopping e a qualidade é tão boa quanto. Os vendedores são muito simpáticos. Para mim, é a melhor loja da cidade!',
    checklist: ['Comparo dos cosas.', 'Doy una razón con porque o con ejemplos.'],
    glossary: [
      { term: 'recomendo', meaning: 'recomiendo' },
      { term: 'shopping', meaning: 'centro comercial' },
      { term: 'qualidade', meaning: 'calidad' },
    ],
  },
  {
    ...a2,
    id: 'pt.a2.wt.mensagem',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a2-u10-l05',
    title: 'Un mensaje a un amigo',
    instructions:
      'Escríbele un mensaje a un amigo: cuéntale que se te quedó el celular sin batería o se te olvidó la contraseña, y pídele que te llame o te mande algo.',
    prompts: ['O que aconteceu?', 'O que você quer?'],
    requirements: [
      {
        id: 'pronoun',
        label: 'Usas me o te antes del verbo (me manda, te ligo…)',
        kind: 'pattern',
        patterns: [['me|te', 'manda|mando|liga|ligo|ajuda|ajudo|mandar|ligar']],
      },
      {
        id: 'tech',
        label: 'Nombras algo de tecnología (celular, senha, carregador…)',
        kind: 'pattern',
        patterns: [['celular|senha|carregador|computador|aplicativo|mensagem|áudio|zap|tela']],
      },
      ...common(3),
    ],
    model:
      'Oi, Gui! O meu celular está sem bateria e esqueci o carregador em casa. Me manda o endereço da festa por e-mail? Te ligo à noite!',
    checklist: ['Uso me y te antes del verbo.', 'Explico el problema y pido algo.'],
  },
  {
    ...a2,
    id: 'pt.a2.wt.opiniao',
    kind: 'guided',
    codes: [],
    lesson: 'pt-a2-u12-l05',
    title: 'Tu opinión',
    instructions:
      'Responde en un foro: ¿es mejor vivir en el centro o en un barrio tranquilo? Da tu opinión, una razón y algo con lo que estés o no estés de acuerdo.',
    prompts: ['O que você acha?', 'Por quê?'],
    requirements: [
      {
        id: 'opinion',
        label: 'Das tu opinión (acho que…, na minha opinião…)',
        kind: 'pattern',
        patterns: [
          ['acho', 'que'],
          ['na', 'minha', 'opinião'],
        ],
      },
      {
        id: 'agree',
        label: 'Dices si estás de acuerdo (concordo, discordo)',
        kind: 'pattern',
        patterns: [['concordo|discordo']],
      },
      {
        id: 'reason',
        label: 'Das una razón (porque…)',
        kind: 'pattern',
        patterns: [['porque']],
      },
      ...common(4),
    ],
    model:
      'Na minha opinião, morar num bairro tranquilo é melhor. Concordo que o centro é prático, porque tudo é perto. Mas acho que o barulho é um problema. No bairro eu durmo melhor e vale a pena!',
    checklist: ['Doy mi opinión y una razón.', 'Digo con qué estoy de acuerdo y con qué no.'],
    glossary: [{ term: 'prático', meaning: 'práctico' }],
  },
  // ------------------------------------------------ A2, libres
  {
    ...a2,
    id: 'pt.a2.wt.livre-viagem',
    kind: 'free',
    codes: [],
    lesson: 'pt-a2-u06-final',
    block: 1,
    title: 'Texto libre: organizar un viaje',
    instructions:
      'Escríbele a un amigo para organizar un viaje juntos: adónde van a ir, cómo, dónde se van a quedar y qué van a hacer. No hay respuesta correcta: compara con el modelo y revisa la lista.',
    prompts: ['Para onde a gente vai?', 'Onde a gente vai ficar?', 'O que a gente vai fazer?'],
    requirements: [
      {
        id: 'future',
        label: 'Pista: usa vou / vamos + verbo',
        kind: 'pattern',
        patterns: [['vou|vamos|vai', '<WORD>']],
        optional: true,
      },
      {
        id: 'stay',
        label: 'Pista: di dónde se quedan (pousada, hotel…)',
        kind: 'pattern',
        patterns: [['pousada|hotel|quarto']],
        optional: true,
      },
      { id: 'words', label: 'Pista: unas 50 palabras', kind: 'min_words', min: 50, optional: true },
    ],
    model:
      'Oi, Carol! Vamos fazer uma viagem para Salvador em julho? A gente pode ir de avião: o voo é rápido. Eu vi uma pousada perto da praia com café da manhã incluído e a diária não é cara. Lá a gente vai visitar o Pelourinho, comer acarajé e ir à praia todo dia. Topa? Eu posso fazer a reserva amanhã!',
    checklist: [
      'Propongo el destino, el transporte y el alojamiento.',
      'Uso vou / vamos + verbo para los planes.',
      'Termino con una pregunta para mi amigo.',
    ],
  },
  {
    ...a2,
    id: 'pt.a2.wt.livre-acontecimento',
    kind: 'free',
    codes: [],
    lesson: 'pt-a2-u12-final',
    block: 2,
    title: 'Texto libre: un día que no olvidas',
    instructions:
      'Cuenta un día importante de tu vida (real o inventado): cómo era tu vida en esa época, qué pasó, cómo te sentiste y qué piensas hoy. No hay respuesta correcta: compara con el modelo y revisa la lista.',
    prompts: ['Quando foi?', 'O que aconteceu?', 'O que você acha hoje?'],
    requirements: [
      {
        id: 'past',
        label: 'Pista: combina el imperfeito (era, tinha) y el perfeito (fui, conheci)',
        kind: 'pattern',
        patterns: [['era|tinha|morava|estava'], [PERFEITO]],
        optional: true,
      },
      {
        id: 'opinion',
        label: 'Pista: cierra con tu opinión (acho que…)',
        kind: 'pattern',
        patterns: [
          ['acho', 'que'],
          ['na', 'minha', 'opinião'],
        ],
        optional: true,
      },
      { id: 'words', label: 'Pista: unas 60 palabras', kind: 'min_words', min: 60, optional: true },
    ],
    model:
      'Há dez anos eu morava em Rosario e era estudante. Naquela época eu era muito tímido. Um dia, uma amiga me convidou para uma festa. Primeiro eu não queria ir, mas no final eu fui. Lá eu conheci a Marina, que hoje é a minha esposa! Eu me sentia nervoso, mas a gente conversou a noite toda. Acho que foi o dia mais importante da minha vida.',
    checklist: [
      'Uso el imperfeito para la escena y el perfeito para lo que pasó.',
      'Ordeno el relato con conectores.',
      'Cierro con lo que pienso hoy.',
    ],
    glossary: [
      { term: 'convidou', meaning: 'invitó' },
      { term: 'conversou', meaning: 'charló' },
      { term: 'esposa', meaning: 'esposa' },
      { term: 'nervoso', meaning: 'nervioso' },
      { term: 'importante', meaning: 'importante' },
    ],
  },
];
